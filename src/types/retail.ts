export type SourceType = 'Receipt OCR' | 'E-Commerce Catalog' | 'Mobile Scan' | 'Store Flyer';

export type MatchDecision = 'AUTO-CONFIRMED' | 'MANUAL_REVIEW' | 'UNMATCHED' | 'REJECTED';

export type DQStatus = 'VALID' | 'WARNING' | 'CRITICAL_ERROR';

export type VerificationStatus = 'VERIFIED' | 'PENDING_REVIEW' | 'REJECTED' | 'RE-MAPPED';

export interface RawProduct {
  id: string; // e.g. REC-1001
  rawDescription: string; // e.g. "JA! H-MILCH 3,5% 1L" or "Dr. Oetker Ristorante Salami Pizza 330g"
  extractedName: string;
  extractedBrand: string;
  packageSize: number;
  packageUnit: string;
  priceEur: number;
  retailer: string; // Rewe, Edeka, Aldi Süd, Lidl, dm-drogerie, Rossmann, Kaufland, Amazon.de
  sourceType: SourceType;
  sourceReference: string; // Receipt # or URL
  researchDate: string;
}

export interface ReferenceBrandCategory {
  brandId: string;
  approvedBrand: string;
  parentCompany: string;
  category: string;
  subcategory: string;
  namingConvention: string;
  validUnits: string[];
  aliases: string[]; // common OCR or receipt abbreviations e.g. ["RITT.SP.", "RITTER SP."]
}

export interface MatchedProduct {
  recordId: string;
  originalDescription: string;
  candidateProduct: string;
  matchedBrand: string;
  productCategory: string;
  subcategory: string;
  extractedSizeUnit: string;
  candidateSizeUnit: string;
  sizeParity: boolean;
  brandConfidence: number; // 0 - 100
  nameConfidence: number; // 0 - 100
  overallConfidence: number; // 0 - 100
  matchDecision: MatchDecision;
  decisionRule: string;
  reviewerComments: string;
  isDuplicate: boolean;
  duplicateOfId?: string;
}

export interface DQIssue {
  recordId: string;
  issueType: 'MISSING_BRAND' | 'MISSING_CATEGORY' | 'DUPLICATE_RECORD' | 'PRICE_ANOMALY' | 'INCONSISTENT_UNIT' | 'BRAND_CATEGORY_CONFLICT' | 'UNCERTAIN_MATCH';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  currentValue: string;
  expectedFormatOrValue: string;
  status: DQStatus;
  recommendedAction: string;
}

export interface ReviewQueueItem {
  id: string;
  recordId: string;
  originalDescription: string;
  suggestedBrand: string;
  suggestedCategory: string;
  suggestedSubcategory: string;
  confidenceScore: number;
  flagReason: string;
  verificationStatus: VerificationStatus;
  reviewerDecision?: string;
  correctionNotes?: string;
  evidenceSource?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ReviewLogEntry {
  logId: string;
  recordId: string;
  timestamp: string;
  originalValue: string;
  correctedValue: string;
  decision: string;
  reviewer: string;
  reasonCode: string;
  evidenceUrl: string;
}

export interface GermanEnglishReference {
  germanTerm: string;
  germanDescription: string;
  englishTranslation: string;
  brand: string;
  category: string;
  subcategory: string;
  abbreviationMeaning?: string;
  verificationStatus: 'Verified by Bilingual Analyst' | 'Unverified / Machine Translated';
  notes: string;
}

export interface GroundTruthRecord {
  recordId: string;
  originalDescription: string;
  trueBrand: string;
  trueCategory: string;
  trueSubcategory: string;
  trueSize: string;
  isTrueDuplicate: boolean;
  trueDuplicateGroup?: string;
  requiresManualReview: boolean;
  notes: string;
}
