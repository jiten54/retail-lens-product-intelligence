import {
  RawProduct,
  MatchedProduct,
  DQIssue,
  ReviewQueueItem,
  ReferenceBrandCategory,
  GroundTruthRecord
} from '../types/retail';
import { REFERENCE_BRANDS } from '../data/retailDatabase';

// Normalizes text strings: removes special punctuation, converts to uppercase, trims extra spaces
export function normalizeString(str: string): string {
  if (!str) return '';
  return str
    .toUpperCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Convert various unit representations into standard canonical units
export function standardizeUnit(size: number, unit: string): { canonicalSize: number; canonicalUnit: string; isStandard: boolean } {
  const u = (unit || '').toLowerCase().trim();
  let canonicalSize = size;
  let canonicalUnit = u;
  let isStandard = true;

  if (u === 'l' || u === 'liter' || u === 'litre') {
    canonicalSize = size * 1000;
    canonicalUnit = 'ml';
    if (u !== 'l') isStandard = false;
  } else if (u === 'ml') {
    canonicalUnit = 'ml';
  } else if (u === 'kg' || u === 'kilogramm') {
    canonicalSize = size * 1000;
    canonicalUnit = 'g';
    if (u !== 'kg') isStandard = false;
  } else if (u === 'g' || u === 'gramm' || u === 'gr') {
    canonicalUnit = 'g';
    if (u !== 'g') isStandard = false;
  } else if (u === 'wl' || u === 'wäschen' || u === 'waschladungen') {
    canonicalUnit = 'wl';
    if (u !== 'wl') isStandard = false;
  } else if (u === 'tabs' || u === 'stück' || u === 'stk' || u === 'st') {
    canonicalUnit = 'tabs';
  }

  return { canonicalSize, canonicalUnit, isStandard };
}

// Token-based Jaccard / Levenshtein overlap for name similarity
export function calculateTokenSimilarity(strA: string, strB: string): number {
  const normA = normalizeString(strA);
  const normB = normalizeString(strB);
  if (!normA || !normB) return 0;
  if (normA === normB) return 100;

  const tokensA = new Set(normA.split(' '));
  const tokensB = new Set(normB.split(' '));

  let intersection = 0;
  tokensA.forEach((token) => {
    if (tokensB.has(token)) intersection++;
  });

  const union = new Set([...tokensA, ...tokensB]).size;
  const jaccard = union > 0 ? (intersection / union) * 100 : 0;
  return Math.round(jaccard);
}

// Evaluates brand match against approved reference taxonomy
export function matchBrand(rawBrand: string, rawDesc: string): { matchedBrand: ReferenceBrandCategory | null; score: number; method: string } {
  const cleanBrand = (rawBrand || '').trim().toUpperCase();
  const cleanDesc = (rawDesc || '').toUpperCase();

  if (!cleanBrand && !cleanDesc) {
    return { matchedBrand: null, score: 0, method: 'MISSING_BRAND' };
  }

  // 1. Exact Match on Approved Brand Name
  for (const ref of REFERENCE_BRANDS) {
    if (ref.approvedBrand.toUpperCase() === cleanBrand) {
      return { matchedBrand: ref, score: 100, method: 'EXACT_BRAND_MATCH' };
    }
  }

  // 2. Alias Match on Reference Aliases
  for (const ref of REFERENCE_BRANDS) {
    for (const alias of ref.aliases) {
      if (alias.toUpperCase() === cleanBrand) {
        return { matchedBrand: ref, score: 92, method: 'ALIAS_EXACT_MATCH' };
      }
    }
  }

  // 3. Look for Brand or Alias token embedded in Raw Description
  for (const ref of REFERENCE_BRANDS) {
    if (cleanDesc.includes(ref.approvedBrand.toUpperCase())) {
      return { matchedBrand: ref, score: 85, method: 'BRAND_IN_DESCRIPTION' };
    }
    for (const alias of ref.aliases) {
      if (cleanDesc.includes(alias.toUpperCase())) {
        return { matchedBrand: ref, score: 80, method: 'ALIAS_IN_DESCRIPTION' };
      }
    }
  }

  // 4. Fuzzy / Substring Check
  for (const ref of REFERENCE_BRANDS) {
    const sim = calculateTokenSimilarity(cleanBrand, ref.approvedBrand);
    if (sim >= 70) {
      return { matchedBrand: ref, score: sim, method: 'FUZZY_BRAND_MATCH' };
    }
  }

  return { matchedBrand: null, score: 0, method: 'UNRESOLVED_BRAND' };
}

// Executes matching for all products
export function executeProductMatching(rawProducts: RawProduct[]): MatchedProduct[] {
  // Pass 1: Duplicate identification
  const seenKeys = new Map<string, string>();
  const duplicateFlags = new Map<string, { isDup: boolean; duplicateOfId?: string }>();

  rawProducts.forEach((p) => {
    const compositeKey = `${normalizeString(p.extractedBrand)}_${normalizeString(p.extractedName)}_${p.packageSize}_${(p.packageUnit || '').toLowerCase()}_${p.retailer}`;
    if (seenKeys.has(compositeKey)) {
      duplicateFlags.set(p.id, { isDup: true, duplicateOfId: seenKeys.get(compositeKey) });
    } else {
      seenKeys.set(compositeKey, p.id);
      duplicateFlags.set(p.id, { isDup: false });
    }
  });

  return rawProducts.map((p) => {
    const brandResult = matchBrand(p.extractedBrand, p.rawDescription);
    const matchedRef = brandResult.matchedBrand;
    const brandConfidence = brandResult.score;

    let candidateProduct = 'Unresolved Candidate';
    let productCategory = 'Uncategorized';
    let subcategory = 'Unassigned';
    let candidateSizeUnit = `${p.packageSize} ${p.packageUnit}`;

    if (matchedRef) {
      productCategory = matchedRef.category;
      subcategory = matchedRef.subcategory;
      candidateProduct = `${matchedRef.approvedBrand} ${p.extractedName || 'Standard SKU'}`;
      candidateSizeUnit = `${p.packageSize} ${matchedRef.validUnits[0] || p.packageUnit}`;
    }

    // Name similarity
    const nameConfidence = p.extractedName ? calculateTokenSimilarity(p.rawDescription, candidateProduct) : 40;

    // Package size parity check
    const rawStd = standardizeUnit(p.packageSize, p.packageUnit);
    const sizeParity = p.packageSize > 0 && rawStd.isStandard;
    const sizeScore = sizeParity ? 20 : 0;

    // Transparent rule-based composite formula:
    // Brand (45%) + Name (35%) + Size (20%)
    const rawOverallScore = Math.round((brandConfidence * 0.45) + (nameConfidence * 0.35) + sizeScore);
    const overallConfidence = Math.min(100, Math.max(0, rawOverallScore));

    const dupInfo = duplicateFlags.get(p.id) || { isDup: false };

    // Deterministic Decision Rules
    let matchDecision: MatchedProduct['matchDecision'] = 'UNMATCHED';
    let decisionRule = 'Rule 0: Fallback';
    let reviewerComments = '';

    if (dupInfo.isDup) {
      matchDecision = 'MANUAL_REVIEW';
      decisionRule = 'Rule DUP-1: Flagged for Duplicate Verification';
      reviewerComments = `Identified as duplicate record of ${dupInfo.duplicateOfId}. Verify if distinct basket purchase.`;
    } else if (brandConfidence >= 85 && nameConfidence >= 60 && sizeParity && overallConfidence >= 85) {
      // Golden Match: Brand verified, name verified, size parity met
      matchDecision = 'AUTO-CONFIRMED';
      decisionRule = 'Rule AC-1: High Brand Fidelity (>=85%) + Name Similarity (>=60%) + Size Parity';
      reviewerComments = 'System-matched with high confidence. All attributes verified against approved taxonomy.';
    } else if (overallConfidence >= 50 || brandConfidence >= 50) {
      // Uncertain Match: Sent to Human-In-The-Loop Review
      matchDecision = 'MANUAL_REVIEW';
      decisionRule = 'Rule MR-1: Ambiguous Match / Low Confidence (50%-84%) requires Analyst verification';
      reviewerComments = brandConfidence < 70
        ? 'Brand could not be confirmed with 100% certainty. Requires bilingual analyst check.'
        : 'Candidate matched partially. Review package size or subcategory.';
    } else {
      matchDecision = 'UNMATCHED';
      decisionRule = 'Rule UN-1: Insufficient Attribute Overlap (<50%)';
      reviewerComments = 'Description lacks recognizable brand or product identifiers in reference taxonomy.';
    }

    return {
      recordId: p.id,
      originalDescription: p.rawDescription,
      candidateProduct,
      matchedBrand: matchedRef ? matchedRef.approvedBrand : (p.extractedBrand || 'Unknown'),
      productCategory,
      subcategory,
      extractedSizeUnit: `${p.packageSize} ${p.packageUnit}`,
      candidateSizeUnit,
      sizeParity,
      brandConfidence,
      nameConfidence,
      overallConfidence,
      matchDecision,
      decisionRule,
      reviewerComments,
      isDuplicate: dupInfo.isDup,
      duplicateOfId: dupInfo.duplicateOfId
    };
  });
}

// Executes Data Quality Audits
export function runDataQualityAudit(rawProducts: RawProduct[], matchedProducts: MatchedProduct[]): DQIssue[] {
  const issues: DQIssue[] = [];
  const matchedMap = new Map(matchedProducts.map(m => [m.recordId, m]));

  rawProducts.forEach((p) => {
    const match = matchedMap.get(p.id);

    // 1. Missing Brand Check
    if (!p.extractedBrand || p.extractedBrand.trim().length === 0 || p.extractedBrand.includes('???')) {
      issues.push({
        recordId: p.id,
        issueType: 'MISSING_BRAND',
        severity: 'HIGH',
        description: 'Product brand missing or corrupted in raw source extract.',
        currentValue: p.extractedBrand || '(Empty)',
        expectedFormatOrValue: 'Approved Brand from Reference Taxonomy',
        status: 'CRITICAL_ERROR',
        recommendedAction: 'Inspect raw description, assign verified brand via manual review queue.'
      });
    }

    // 2. Price Anomaly Check
    if (p.priceEur <= 0 || p.priceEur > 150) {
      issues.push({
        recordId: p.id,
        issueType: 'PRICE_ANOMALY',
        severity: 'HIGH',
        description: p.priceEur <= 0 ? 'Zero or negative price detected.' : 'Unusually high price outlier (> €150.00) for standard retail item.',
        currentValue: `€${p.priceEur.toFixed(2)}`,
        expectedFormatOrValue: '€0.10 - €50.00 (FMCG grocery range)',
        status: 'CRITICAL_ERROR',
        recommendedAction: 'Verify store receipt line item. Check if promo bundle, deposit error, or OCR scan glitch.'
      });
    }

    // 3. Inconsistent Package Unit
    const std = standardizeUnit(p.packageSize, p.packageUnit);
    if (!std.isStandard) {
      issues.push({
        recordId: p.id,
        issueType: 'INCONSISTENT_UNIT',
        severity: 'MEDIUM',
        description: `Non-standard package unit '${p.packageUnit}' detected.`,
        currentValue: `${p.packageSize} ${p.packageUnit}`,
        expectedFormatOrValue: `Standardized to ${std.canonicalSize} ${std.canonicalUnit}`,
        status: 'WARNING',
        recommendedAction: 'Standardize unit to canonical measure (ml, g, l, kg, wl, tabs) via Power Query transformation.'
      });
    }

    // 4. Duplicate Record Check
    if (match && match.isDuplicate) {
      issues.push({
        recordId: p.id,
        issueType: 'DUPLICATE_RECORD',
        severity: 'MEDIUM',
        description: `Duplicate product entry detected. Matches record ${match.duplicateOfId}.`,
        currentValue: `${p.extractedBrand} - ${p.extractedName} (${p.retailer})`,
        expectedFormatOrValue: 'Unique SKU per transaction timestamp',
        status: 'WARNING',
        recommendedAction: 'Confirm if duplicate scan in same receipt or legitimate multi-quantity purchase.'
      });
    }

    // 5. Uncertain Match Flag
    if (match && match.matchDecision === 'MANUAL_REVIEW' && !match.isDuplicate) {
      issues.push({
        recordId: p.id,
        issueType: 'UNCERTAIN_MATCH',
        severity: 'LOW',
        description: `Confidence score (${match.overallConfidence}%) falls below auto-confirmation threshold (85%).`,
        currentValue: `Score: ${match.overallConfidence}%`,
        expectedFormatOrValue: 'Score >= 85% with exact brand match',
        status: 'WARNING',
        recommendedAction: 'Route to Bilingual Analyst Manual Review Queue for ground-truth validation.'
      });
    }
  });

  return issues;
}

// Generate the initial Manual Review Queue
export function generateInitialReviewQueue(matchedProducts: MatchedProduct[]): ReviewQueueItem[] {
  let queueId = 1;
  return matchedProducts
    .filter(m => m.matchDecision === 'MANUAL_REVIEW' || m.matchDecision === 'UNMATCHED')
    .map(m => {
      let flagReason = 'Confidence Score (50-84%) below auto-confirmation threshold';
      if (m.isDuplicate) flagReason = `Potential Duplicate Record (Ref: ${m.duplicateOfId})`;
      else if (m.brandConfidence < 60) flagReason = 'Unrecognized or ambiguous brand name in German receipt OCR';
      else if (!m.sizeParity) flagReason = 'Package size or unit mismatch vs reference product catalog';

      return {
        id: `REV-${String(queueId++).padStart(4, '0')}`,
        recordId: m.recordId,
        originalDescription: m.originalDescription,
        suggestedBrand: m.matchedBrand,
        suggestedCategory: m.productCategory,
        suggestedSubcategory: m.subcategory,
        confidenceScore: m.overallConfidence,
        flagReason,
        verificationStatus: 'PENDING_REVIEW'
      };
    });
}

// Calculate Ground Truth Evaluation Metrics
export function calculateEvaluationMetrics(matchedProducts: MatchedProduct[], groundTruth: GroundTruthRecord[]) {
  const gtMap = new Map(groundTruth.map(gt => [gt.recordId, gt]));

  let totalEvaluated = 0;
  let trueAutoConfirmedCorrect = 0; // True Positive
  let falseAutoConfirmed = 0; // False Positive (Error: system auto-confirmed when it shouldn't or got brand wrong)
  let trueManualReviewSent = 0; // Correctly caught for human review
  let unnecessaryManualReview = 0; // Was completely clear but sent to manual review

  let brandAccuracyCount = 0;
  let categoryAccuracyCount = 0;
  let duplicateDetectionCount = 0;

  matchedProducts.forEach(m => {
    const gt = gtMap.get(m.recordId);
    if (!gt) return;
    totalEvaluated++;

    const isBrandCorrect = m.matchedBrand.toLowerCase() === gt.trueBrand.toLowerCase();
    const isCatCorrect = m.productCategory.toLowerCase() === gt.trueCategory.toLowerCase();

    if (isBrandCorrect) brandAccuracyCount++;
    if (isCatCorrect) categoryAccuracyCount++;

    if (m.isDuplicate === gt.isTrueDuplicate) duplicateDetectionCount++;

    if (m.matchDecision === 'AUTO-CONFIRMED') {
      if (isBrandCorrect && isCatCorrect && !gt.requiresManualReview && !gt.isTrueDuplicate) {
        trueAutoConfirmedCorrect++;
      } else {
        falseAutoConfirmed++;
      }
    } else if (m.matchDecision === 'MANUAL_REVIEW') {
      if (gt.requiresManualReview || gt.isTrueDuplicate || !isBrandCorrect) {
        trueManualReviewSent++;
      } else {
        unnecessaryManualReview++;
      }
    }
  });

  const precision = (trueAutoConfirmedCorrect + falseAutoConfirmed) > 0
    ? (trueAutoConfirmedCorrect / (trueAutoConfirmedCorrect + falseAutoConfirmed)) * 100
    : 0;

  const recall = (trueAutoConfirmedCorrect + unnecessaryManualReview) > 0
    ? (trueAutoConfirmedCorrect / (trueAutoConfirmedCorrect + unnecessaryManualReview)) * 100
    : 0;

  const f1Score = (precision + recall) > 0
    ? (2 * (precision * recall)) / (precision + recall)
    : 0;

  const brandMatchRate = totalEvaluated > 0 ? (brandAccuracyCount / totalEvaluated) * 100 : 0;
  const categoryAccuracyRate = totalEvaluated > 0 ? (categoryAccuracyCount / totalEvaluated) * 100 : 0;

  return {
    totalEvaluated,
    trueAutoConfirmedCorrect,
    falseAutoConfirmed,
    trueManualReviewSent,
    unnecessaryManualReview,
    precision: +precision.toFixed(1),
    recall: +recall.toFixed(1),
    f1Score: +f1Score.toFixed(1),
    brandMatchRate: +brandMatchRate.toFixed(1),
    categoryAccuracyRate: +categoryAccuracyRate.toFixed(1),
    duplicateDetectionRate: +(duplicateDetectionCount / (totalEvaluated || 1) * 100).toFixed(1)
  };
}
