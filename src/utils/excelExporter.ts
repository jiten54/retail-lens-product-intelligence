import ExcelJS from 'exceljs';
import {
  RawProduct,
  MatchedProduct,
  DQIssue,
  ReviewQueueItem,
  ReviewLogEntry
} from '../types/retail';
import {
  REFERENCE_BRANDS,
  GERMAN_ENGLISH_GLOSSARY,
  GROUND_TRUTH_DATASET
} from '../data/retailDatabase';
import { calculateEvaluationMetrics } from './matchingEngine';

// Styling constants for corporate Navy & Teal theme
const NAVY_HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF0F172A' } // Slate 900
};

const TEAL_ACCENT_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF0D9488' } // Teal 600
};

const CARD_HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF1E293B' } // Slate 800
};

const SUBHEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFE2E8F0' } // Slate 200
};

const WHITE_BOLD_FONT: Partial<ExcelJS.Font> = {
  name: 'Calibri',
  size: 11,
  bold: true,
  color: { argb: 'FFFFFFFF' }
};

const BORDER_THIN: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
};

export async function generateAndDownloadExcel(
  rawProducts: RawProduct[],
  matchedProducts: MatchedProduct[],
  dqIssues: DQIssue[],
  reviewQueue: ReviewQueueItem[],
  reviewLog: ReviewLogEntry[]
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'RetailLens — Numerator Data Analyst Portfolio';
  workbook.lastModifiedBy = 'Bilingual Retail Analyst';
  workbook.created = new Date();
  workbook.modified = new Date();

  const evalMetrics = calculateEvaluationMetrics(matchedProducts, GROUND_TRUTH_DATASET);

  // ==========================================
  // SHEET 1: Executive Dashboard
  // ==========================================
  const dashSheet = workbook.addWorksheet('1_Executive_Dashboard', {
    views: [{ showGridLines: true }]
  });

  // Title Block
  dashSheet.mergeCells('A1:J1');
  const titleCell = dashSheet.getCell('A1');
  titleCell.value = 'RETAILLENS — RETAIL PRODUCT MATCHING & DATA QUALITY DASHBOARD';
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = NAVY_HEADER_FILL;
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  dashSheet.getRow(1).height = 36;

  dashSheet.mergeCells('A2:J2');
  const subCell = dashSheet.getCell('A2');
  subCell.value = 'Numerator Data Analyst (Bilingual German) Project Workflow | Automated vs Manual Triage & Ground Truth Validation';
  subCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FFFFFFFF' } };
  subCell.fill = CARD_HEADER_FILL;
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  dashSheet.getRow(2).height = 20;

  // KPI Tiles Header row 4
  const kpiHeaders = [
    { cell: 'B4', label: 'Total Products Processed', valCell: 'B5', formula: '=COUNTA(2_Raw_Product_Data!A2:A500)', calc: rawProducts.length },
    { cell: 'D4', label: 'Successfully Auto-Matched', valCell: 'D5', formula: '=COUNTIF(3_Product_Matching!I2:I500, "AUTO-CONFIRMED")', calc: matchedProducts.filter(m => m.matchDecision === 'AUTO-CONFIRMED').length },
    { cell: 'F4', label: 'Manual Review Queue', valCell: 'F5', formula: '=COUNTIF(3_Product_Matching!I2:I500, "MANUAL_REVIEW")', calc: matchedProducts.filter(m => m.matchDecision === 'MANUAL_REVIEW').length },
    { cell: 'H4', label: 'Duplicate Records Detected', valCell: 'H5', formula: '=COUNTIF(3_Product_Matching!K2:K500, TRUE)', calc: matchedProducts.filter(m => m.isDuplicate).length },
    { cell: 'J4', label: 'Data Quality Anomalies', valCell: 'J5', formula: '=COUNTA(5_Data_Quality_Audit!A2:A500)', calc: dqIssues.length }
  ];

  kpiHeaders.forEach(k => {
    const lbl = dashSheet.getCell(k.cell);
    lbl.value = k.label;
    lbl.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF475569' } };
    lbl.alignment = { horizontal: 'center', vertical: 'middle' };
    lbl.fill = SUBHEADER_FILL;
    lbl.border = BORDER_THIN;

    const val = dashSheet.getCell(k.valCell);
    val.value = { formula: k.formula, result: k.calc };
    val.font = { name: 'Calibri', size: 18, bold: true, color: { argb: 'FF0F172A' } };
    val.alignment = { horizontal: 'center', vertical: 'middle' };
    val.border = BORDER_THIN;
  });
  dashSheet.getRow(4).height = 24;
  dashSheet.getRow(5).height = 32;

  // Secondary Performance Metrics row 7-8
  const secMetrics = [
    { cell: 'B7', label: 'Auto-Match Completion Rate', valCell: 'B8', formula: '=D5/B5', calc: +(matchedProducts.filter(m => m.matchDecision === 'AUTO-CONFIRMED').length / (rawProducts.length || 1)).toFixed(3), numFmt: '0.0%' },
    { cell: 'D7', label: 'Model Precision vs Ground Truth', valCell: 'D8', formula: '="" & TEXT(' + (evalMetrics.precision / 100) + ', "0.0%")', calc: `${evalMetrics.precision}%`, numFmt: '@' },
    { cell: 'F7', label: 'Model Recall (Safe Triage)', valCell: 'F8', formula: '="" & TEXT(' + (evalMetrics.recall / 100) + ', "0.0%")', calc: `${evalMetrics.recall}%`, numFmt: '@' },
    { cell: 'H7', label: 'Brand Taxonomy Match Rate', valCell: 'H8', formula: '="" & TEXT(' + (evalMetrics.brandMatchRate / 100) + ', "0.0%")', calc: `${evalMetrics.brandMatchRate}%`, numFmt: '@' },
    { cell: 'J7', label: 'Manual Review Resolution Rate', valCell: 'J8', formula: '="" & TEXT(' + (reviewLog.length / (reviewQueue.length || 1) * 100).toFixed(1) + ', "0.0%")', calc: `${(reviewLog.length / (reviewQueue.length || 1) * 100).toFixed(1)}%`, numFmt: '@' }
  ];

  secMetrics.forEach(k => {
    const lbl = dashSheet.getCell(k.cell);
    lbl.value = k.label;
    lbl.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF475569' } };
    lbl.alignment = { horizontal: 'center', vertical: 'middle' };
    lbl.fill = SUBHEADER_FILL;
    lbl.border = BORDER_THIN;

    const val = dashSheet.getCell(k.valCell);
    val.value = { formula: k.formula, result: k.calc };
    if (k.numFmt) val.numFmt = k.numFmt;
    val.font = { name: 'Calibri', size: 15, bold: true, color: { argb: 'FF0D9488' } };
    val.alignment = { horizontal: 'center', vertical: 'middle' };
    val.border = BORDER_THIN;
  });
  dashSheet.getRow(7).height = 22;
  dashSheet.getRow(8).height = 28;

  // Department / Category Performance Summary Table
  dashSheet.getCell('B10').value = 'CATEGORY COVERAGE & MATCH BREAKDOWN (LIVE FORMULAS)';
  dashSheet.getCell('B10').font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  dashSheet.getCell('B10').fill = CARD_HEADER_FILL;
  dashSheet.mergeCells('B10:G10');

  const catTableHeaders = ['Category', 'Total SKUs', 'Auto-Matched', 'Manual Review', 'Duplicates', 'Avg Confidence'];
  catTableHeaders.forEach((th, idx) => {
    const c = dashSheet.getCell(11, idx + 2);
    c.value = th;
    c.font = WHITE_BOLD_FONT;
    c.fill = NAVY_HEADER_FILL;
    c.border = BORDER_THIN;
    c.alignment = { horizontal: 'center' };
  });

  const categories = [
    'Beverages',
    'Dairy & Refrigerated',
    'Packaged Food',
    'Personal Care & Health',
    'Household & Cleaning',
    'Grocery & Fresh Pantry'
  ];

  categories.forEach((cat, rIdx) => {
    const rowNum = 12 + rIdx;
    const catMatched = matchedProducts.filter(m => m.productCategory === cat);
    const catTotal = catMatched.length;
    const autoM = catMatched.filter(m => m.matchDecision === 'AUTO-CONFIRMED').length;
    const manR = catMatched.filter(m => m.matchDecision === 'MANUAL_REVIEW').length;
    const dups = catMatched.filter(m => m.isDuplicate).length;
    const avgConf = catTotal > 0 ? (catMatched.reduce((acc, curr) => acc + curr.overallConfidence, 0) / catTotal) / 100 : 0;

    dashSheet.getCell(rowNum, 2).value = cat;
    dashSheet.getCell(rowNum, 3).value = { formula: `=COUNTIF(3_Product_Matching!E2:E500, "${cat}")`, result: catTotal };
    dashSheet.getCell(rowNum, 4).value = { formula: `=COUNTIFS(3_Product_Matching!E2:E500, "${cat}", 3_Product_Matching!I2:I500, "AUTO-CONFIRMED")`, result: autoM };
    dashSheet.getCell(rowNum, 5).value = { formula: `=COUNTIFS(3_Product_Matching!E2:E500, "${cat}", 3_Product_Matching!I2:I500, "MANUAL_REVIEW")`, result: manR };
    dashSheet.getCell(rowNum, 6).value = { formula: `=COUNTIFS(3_Product_Matching!E2:E500, "${cat}", 3_Product_Matching!K2:K500, TRUE)`, result: dups };
    const avgCell = dashSheet.getCell(rowNum, 7);
    avgCell.value = { formula: `=IFERROR(AVERAGEIF(3_Product_Matching!E2:E500, "${cat}", 3_Product_Matching!H2:H500)/100, 0)`, result: avgConf };
    avgCell.numFmt = '0.0%';

    for (let c = 2; c <= 7; c++) {
      dashSheet.getCell(rowNum, c).border = BORDER_THIN;
      if (c >= 3 && c <= 6) dashSheet.getCell(rowNum, c).alignment = { horizontal: 'right' };
      if (c === 7) dashSheet.getCell(rowNum, c).alignment = { horizontal: 'right' };
    }
  });

  // Table Totals
  const totRow = 12 + categories.length;
  dashSheet.getCell(totRow, 2).value = 'TOTAL';
  dashSheet.getCell(totRow, 2).font = { bold: true };
  dashSheet.getCell(totRow, 3).value = { formula: `=SUM(C12:C${totRow - 1})`, result: rawProducts.length };
  dashSheet.getCell(totRow, 4).value = { formula: `=SUM(D12:D${totRow - 1})`, result: matchedProducts.filter(m => m.matchDecision === 'AUTO-CONFIRMED').length };
  dashSheet.getCell(totRow, 5).value = { formula: `=SUM(E12:E${totRow - 1})`, result: matchedProducts.filter(m => m.matchDecision === 'MANUAL_REVIEW').length };
  dashSheet.getCell(totRow, 6).value = { formula: `=SUM(F12:F${totRow - 1})`, result: matchedProducts.filter(m => m.isDuplicate).length };
  const totAvgCell = dashSheet.getCell(totRow, 7);
  totAvgCell.value = { formula: `=AVERAGE(G12:G${totRow - 1})`, result: 0.88 };
  totAvgCell.numFmt = '0.0%';

  for (let c = 2; c <= 7; c++) {
    const cell = dashSheet.getCell(totRow, c);
    cell.font = { bold: true };
    cell.border = BORDER_THIN;
    cell.fill = SUBHEADER_FILL;
    if (c >= 3) cell.alignment = { horizontal: 'right' };
  }

  // Set widths
  dashSheet.getColumn('A').width = 4;
  dashSheet.getColumn('B').width = 26;
  dashSheet.getColumn('C').width = 16;
  dashSheet.getColumn('D').width = 16;
  dashSheet.getColumn('E').width = 16;
  dashSheet.getColumn('F').width = 16;
  dashSheet.getColumn('G').width = 18;
  dashSheet.getColumn('H').width = 18;
  dashSheet.getColumn('I').width = 14;
  dashSheet.getColumn('J').width = 24;

  // ==========================================
  // SHEET 2: Raw Product Data
  // ==========================================
  const rawSheet = workbook.addWorksheet('2_Raw_Product_Data', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1, showGridLines: true }]
  });

  const rawHeaders = [
    'Record ID',
    'Original Description (Receipt / Web)',
    'Extracted Product Name',
    'Extracted Brand',
    'Package Size',
    'Package Unit',
    'Price (€)',
    'Retailer / Store',
    'Source Type',
    'Source Reference / URL',
    'Research Date'
  ];

  const rawHeaderRow = rawSheet.getRow(1);
  rawHeaderRow.values = rawHeaders;
  rawHeaderRow.font = WHITE_BOLD_FONT;
  rawHeaderRow.fill = NAVY_HEADER_FILL;
  rawHeaderRow.height = 26;

  rawProducts.forEach((p, idx) => {
    const row = rawSheet.getRow(idx + 2);
    row.values = [
      p.id,
      p.rawDescription,
      p.extractedName,
      p.extractedBrand,
      p.packageSize,
      p.packageUnit,
      p.priceEur,
      p.retailer,
      p.sourceType,
      p.sourceReference,
      p.researchDate
    ];
    row.getCell(7).numFmt = '€#,##0.00';
    for (let c = 1; c <= 11; c++) {
      row.getCell(c).border = BORDER_THIN;
    }
  });

  rawSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: rawProducts.length + 1, column: 11 }
  };

  rawSheet.columns = [
    { width: 14 }, // ID
    { width: 38 }, // Raw desc
    { width: 30 }, // Extracted name
    { width: 18 }, // Brand
    { width: 14 }, // Size
    { width: 14 }, // Unit
    { width: 14 }, // Price
    { width: 16 }, // Retailer
    { width: 20 }, // Source
    { width: 32 }, // URL / Ref
    { width: 14 }  // Date
  ];

  // ==========================================
  // SHEET 3: Product Matching Engine
  // ==========================================
  const matchSheet = workbook.addWorksheet('3_Product_Matching', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1, showGridLines: true }]
  });

  const matchHeaders = [
    'Record ID',
    'Original Description',
    'Candidate Master Product',
    'Matched Brand (XLOOKUP / Rule)',
    'Product Category',
    'Subcategory',
    'Size Comparison (Ext vs Cand)',
    'Confidence Score (%)',
    'Match Decision',
    'Decision Rule Applied',
    'Is Duplicate?',
    'Reviewer Comments'
  ];

  const matchHeaderRow = matchSheet.getRow(1);
  matchHeaderRow.values = matchHeaders;
  matchHeaderRow.font = WHITE_BOLD_FONT;
  matchHeaderRow.fill = NAVY_HEADER_FILL;
  matchHeaderRow.height = 26;

  matchedProducts.forEach((m, idx) => {
    const row = matchSheet.getRow(idx + 2);
    const rowNum = idx + 2;

    // Excel formula emulation
    row.getCell(1).value = m.recordId;
    row.getCell(2).value = { formula: `=2_Raw_Product_Data!B${rowNum}`, result: m.originalDescription };
    row.getCell(3).value = m.candidateProduct;
    row.getCell(4).value = { formula: `=IFERROR(XLOOKUP(2_Raw_Product_Data!D${rowNum}, 4_Brand_Category_Ref!B:B, 4_Brand_Category_Ref!B:B, "${m.matchedBrand}"), "${m.matchedBrand}")`, result: m.matchedBrand };
    row.getCell(5).value = { formula: `=IFERROR(XLOOKUP(D${rowNum}, 4_Brand_Category_Ref!B:B, 4_Brand_Category_Ref!D:D, "${m.productCategory}"), "${m.productCategory}")`, result: m.productCategory };
    row.getCell(6).value = { formula: `=IFERROR(XLOOKUP(D${rowNum}, 4_Brand_Category_Ref!B:B, 4_Brand_Category_Ref!E:E, "${m.subcategory}"), "${m.subcategory}")`, result: m.subcategory };
    row.getCell(7).value = `${m.extractedSizeUnit} vs ${m.candidateSizeUnit}`;
    const scoreCell = row.getCell(8);
    scoreCell.value = m.overallConfidence / 100;
    scoreCell.numFmt = '0.0%';

    const decCell = row.getCell(9);
    decCell.value = {
      formula: `=IF(K${rowNum}=TRUE, "MANUAL_REVIEW", IF(H${rowNum}>=0.85, "AUTO-CONFIRMED", IF(H${rowNum}>=0.5, "MANUAL_REVIEW", "UNMATCHED")))`,
      result: m.matchDecision
    };

    // Soft conditional highlighting
    if (m.matchDecision === 'AUTO-CONFIRMED') {
      decCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Light green
    } else if (m.matchDecision === 'MANUAL_REVIEW') {
      decCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF08A' } }; // Light amber
    } else {
      decCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } }; // Light red
    }

    row.getCell(10).value = m.decisionRule;
    row.getCell(11).value = m.isDuplicate;
    row.getCell(12).value = m.reviewerComments;

    for (let c = 1; c <= 12; c++) {
      row.getCell(c).border = BORDER_THIN;
    }
  });

  matchSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: matchedProducts.length + 1, column: 12 }
  };

  matchSheet.columns = [
    { width: 14 }, // Record ID
    { width: 34 }, // Desc
    { width: 34 }, // Candidate
    { width: 20 }, // Matched Brand
    { width: 22 }, // Category
    { width: 24 }, // Subcategory
    { width: 24 }, // Size comparison
    { width: 20 }, // Score
    { width: 20 }, // Decision
    { width: 32 }, // Rule
    { width: 14 }, // Dup
    { width: 40 }  // Comments
  ];

  // ==========================================
  // SHEET 4: Brand and Category Reference (Taxonomy)
  // ==========================================
  const brandSheet = workbook.addWorksheet('4_Brand_Category_Ref', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1, showGridLines: true }]
  });

  const brandHeaders = [
    'Brand ID',
    'Approved Brand Name',
    'Parent Corporation',
    'Standard Category',
    'Standard Subcategory',
    'Standard Naming Convention',
    'Permitted Units',
    'Known OCR Aliases / Abbreviations'
  ];

  const brandHeaderRow = brandSheet.getRow(1);
  brandHeaderRow.values = brandHeaders;
  brandHeaderRow.font = WHITE_BOLD_FONT;
  brandHeaderRow.fill = NAVY_HEADER_FILL;
  brandHeaderRow.height = 26;

  REFERENCE_BRANDS.forEach((b, idx) => {
    const row = brandSheet.getRow(idx + 2);
    row.values = [
      b.brandId,
      b.approvedBrand,
      b.parentCompany,
      b.category,
      b.subcategory,
      b.namingConvention,
      b.validUnits.join(', '),
      b.aliases.join(', ')
    ];
    for (let c = 1; c <= 8; c++) {
      row.getCell(c).border = BORDER_THIN;
    }
  });

  brandSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: REFERENCE_BRANDS.length + 1, column: 8 }
  };

  brandSheet.columns = [
    { width: 14 },
    { width: 22 },
    { width: 28 },
    { width: 24 },
    { width: 26 },
    { width: 38 },
    { width: 20 },
    { width: 34 }
  ];

  // ==========================================
  // SHEET 5: Data Quality Audit
  // ==========================================
  const dqSheet = workbook.addWorksheet('5_Data_Quality_Audit', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1, showGridLines: true }]
  });

  const dqHeaders = [
    'Record ID',
    'Anomaly Type',
    'Severity Level',
    'Issue Description',
    'Current Value',
    'Expected Format / Value',
    'Audit Status',
    'Recommended Action'
  ];

  const dqHeaderRow = dqSheet.getRow(1);
  dqHeaderRow.values = dqHeaders;
  dqHeaderRow.font = WHITE_BOLD_FONT;
  dqHeaderRow.fill = NAVY_HEADER_FILL;
  dqHeaderRow.height = 26;

  dqIssues.forEach((issue, idx) => {
    const row = dqSheet.getRow(idx + 2);
    row.values = [
      issue.recordId,
      issue.issueType,
      issue.severity,
      issue.description,
      issue.currentValue,
      issue.expectedFormatOrValue,
      issue.status,
      issue.recommendedAction
    ];

    const sevCell = row.getCell(3);
    if (issue.severity === 'HIGH') {
      sevCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
      sevCell.font = { bold: true, color: { argb: 'FF991B1B' } };
    } else if (issue.severity === 'MEDIUM') {
      sevCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
      sevCell.font = { bold: true, color: { argb: 'FF92400E' } };
    }

    for (let c = 1; c <= 8; c++) {
      row.getCell(c).border = BORDER_THIN;
    }
  });

  dqSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: dqIssues.length + 1, column: 8 }
  };

  dqSheet.columns = [
    { width: 14 },
    { width: 24 },
    { width: 16 },
    { width: 38 },
    { width: 26 },
    { width: 32 },
    { width: 18 },
    { width: 44 }
  ];

  // ==========================================
  // SHEET 6: Manual Review Queue
  // ==========================================
  const revSheet = workbook.addWorksheet('6_Manual_Review_Queue', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1, showGridLines: true }]
  });

  const revHeaders = [
    'Queue Item ID',
    'Record ID',
    'Original Description',
    'Suggested Brand',
    'Suggested Category',
    'Suggested Subcategory',
    'Confidence Score',
    'Flag Reason',
    'Verification Status',
    'Reviewer Decision',
    'Correction Notes',
    'Evidence Source URL / Receipt',
    'Reviewed By',
    'Timestamp'
  ];

  const revHeaderRow = revSheet.getRow(1);
  revHeaderRow.values = revHeaders;
  revHeaderRow.font = WHITE_BOLD_FONT;
  revHeaderRow.fill = NAVY_HEADER_FILL;
  revHeaderRow.height = 26;

  reviewQueue.forEach((item, idx) => {
    const row = revSheet.getRow(idx + 2);
    row.values = [
      item.id,
      item.recordId,
      item.originalDescription,
      item.suggestedBrand,
      item.suggestedCategory,
      item.suggestedSubcategory,
      item.confidenceScore / 100,
      item.flagReason,
      item.verificationStatus,
      item.reviewerDecision || 'Pending',
      item.correctionNotes || '',
      item.evidenceSource || '',
      item.reviewedBy || '',
      item.reviewedAt || ''
    ];
    row.getCell(7).numFmt = '0.0%';

    for (let c = 1; c <= 14; c++) {
      row.getCell(c).border = BORDER_THIN;
    }
  });

  revSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: reviewQueue.length + 1, column: 14 }
  };

  revSheet.columns = [
    { width: 16 },
    { width: 14 },
    { width: 34 },
    { width: 20 },
    { width: 22 },
    { width: 24 },
    { width: 18 },
    { width: 36 },
    { width: 20 },
    { width: 22 },
    { width: 30 },
    { width: 30 },
    { width: 18 },
    { width: 20 }
  ];

  // ==========================================
  // SHEET 7: Review Log (Audit Trail)
  // ==========================================
  const logSheet = workbook.addWorksheet('7_Review_Log', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1, showGridLines: true }]
  });

  const logHeaders = [
    'Log ID',
    'Record ID',
    'Timestamp',
    'Original Value',
    'Corrected Value',
    'Decision',
    'Reviewer',
    'Reason Code',
    'Evidence URL / Reference'
  ];

  const logHeaderRow = logSheet.getRow(1);
  logHeaderRow.values = logHeaders;
  logHeaderRow.font = WHITE_BOLD_FONT;
  logHeaderRow.fill = NAVY_HEADER_FILL;
  logHeaderRow.height = 26;

  reviewLog.forEach((log, idx) => {
    const row = logSheet.getRow(idx + 2);
    row.values = [
      log.logId,
      log.recordId,
      log.timestamp,
      log.originalValue,
      log.correctedValue,
      log.decision,
      log.reviewer,
      log.reasonCode,
      log.evidenceUrl
    ];
    for (let c = 1; c <= 9; c++) {
      row.getCell(c).border = BORDER_THIN;
    }
  });

  logSheet.columns = [
    { width: 16 },
    { width: 14 },
    { width: 22 },
    { width: 30 },
    { width: 30 },
    { width: 20 },
    { width: 22 },
    { width: 28 },
    { width: 34 }
  ];

  // ==========================================
  // SHEET 8: Analysis and Reporting (Pivot Summaries)
  // ==========================================
  const repSheet = workbook.addWorksheet('8_Analysis_and_Reporting', {
    views: [{ showGridLines: true }]
  });

  repSheet.mergeCells('A1:H1');
  const repTitle = repSheet.getCell('A1');
  repTitle.value = 'RETAIL MARKET RESEARCH ANALYSIS & DATA CLEANING REPORTS';
  repTitle.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  repTitle.fill = NAVY_HEADER_FILL;
  repTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  repSheet.getRow(1).height = 30;

  // Report 1: Top Brands Distribution & Match Quality
  repSheet.getCell('A3').value = 'Top Brands Distribution & Matching Quality';
  repSheet.getCell('A3').font = { bold: true, size: 11 };

  const rep1Headers = ['Brand', 'Total SKU Volume', 'Confirmed Matches', 'Manual Review', 'Match Precision'];
  rep1Headers.forEach((h, i) => {
    const cell = repSheet.getCell(4, i + 1);
    cell.value = h;
    cell.font = WHITE_BOLD_FONT;
    cell.fill = TEAL_ACCENT_FILL;
    cell.border = BORDER_THIN;
  });

  const topBrands = ['Coca-Cola', 'Haribo', 'Dr. Oetker', 'Milka', 'Weihenstephan', 'Persil', 'Nivea', 'Ja!', 'Gut & Günstig', 'Ariel'];
  topBrands.forEach((bName, rIdx) => {
    const rNum = 5 + rIdx;
    const bItems = matchedProducts.filter(m => m.matchedBrand.toLowerCase() === bName.toLowerCase());
    const tot = bItems.length;
    const autoC = bItems.filter(m => m.matchDecision === 'AUTO-CONFIRMED').length;
    const manR = bItems.filter(m => m.matchDecision === 'MANUAL_REVIEW').length;
    const prec = tot > 0 ? (autoC / tot) : 0;

    repSheet.getCell(rNum, 1).value = bName;
    repSheet.getCell(rNum, 2).value = { formula: `=COUNTIF(3_Product_Matching!D:D, "${bName}")`, result: tot };
    repSheet.getCell(rNum, 3).value = { formula: `=COUNTIFS(3_Product_Matching!D:D, "${bName}", 3_Product_Matching!I:I, "AUTO-CONFIRMED")`, result: autoC };
    repSheet.getCell(rNum, 4).value = { formula: `=COUNTIFS(3_Product_Matching!D:D, "${bName}", 3_Product_Matching!I:I, "MANUAL_REVIEW")`, result: manR };
    const pCell = repSheet.getCell(rNum, 5);
    pCell.value = { formula: `=IFERROR(C${rNum}/B${rNum}, 0)`, result: prec };
    pCell.numFmt = '0.0%';

    for (let c = 1; c <= 5; c++) {
      repSheet.getCell(rNum, c).border = BORDER_THIN;
    }
  });

  // Report 2: Data Quality Issues by Severity
  repSheet.getCell('G3').value = 'Data Quality Issues by Severity';
  repSheet.getCell('G3').font = { bold: true, size: 11 };
  repSheet.getCell('G4').value = 'Severity';
  repSheet.getCell('G4').font = WHITE_BOLD_FONT;
  repSheet.getCell('G4').fill = CARD_HEADER_FILL;
  repSheet.getCell('H4').value = 'Incident Count';
  repSheet.getCell('H4').font = WHITE_BOLD_FONT;
  repSheet.getCell('H4').fill = CARD_HEADER_FILL;

  ['HIGH', 'MEDIUM', 'LOW'].forEach((sev, idx) => {
    const r = 5 + idx;
    const cnt = dqIssues.filter(i => i.severity === sev).length;
    repSheet.getCell(r, 7).value = sev;
    repSheet.getCell(r, 8).value = { formula: `=COUNTIF(5_Data_Quality_Audit!C:C, "${sev}")`, result: cnt };
    repSheet.getCell(r, 7).border = BORDER_THIN;
    repSheet.getCell(r, 8).border = BORDER_THIN;
  });

  repSheet.columns = [
    { width: 20 },
    { width: 18 },
    { width: 18 },
    { width: 16 },
    { width: 18 },
    { width: 6 },
    { width: 16 },
    { width: 18 }
  ];

  // ==========================================
  // SHEET 9: German-English Product Reference
  // ==========================================
  const deSheet = workbook.addWorksheet('9_DE_EN_Reference', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1, showGridLines: true }]
  });

  const deHeaders = [
    'German Grocery Term / Receipt String',
    'German Definition & Cultural Usage',
    'Standard English Translation',
    'Sample Brands',
    'Category',
    'Subcategory',
    'OCR Abbreviation Meaning',
    'Verification Status',
    'Analyst Research Notes'
  ];

  const deHeaderRow = deSheet.getRow(1);
  deHeaderRow.values = deHeaders;
  deHeaderRow.font = WHITE_BOLD_FONT;
  deHeaderRow.fill = NAVY_HEADER_FILL;
  deHeaderRow.height = 26;

  GERMAN_ENGLISH_GLOSSARY.forEach((g, idx) => {
    const row = deSheet.getRow(idx + 2);
    row.values = [
      g.germanTerm,
      g.germanDescription,
      g.englishTranslation,
      g.brand,
      g.category,
      g.subcategory,
      g.abbreviationMeaning || '',
      g.verificationStatus,
      g.notes
    ];
    for (let c = 1; c <= 9; c++) {
      row.getCell(c).border = BORDER_THIN;
    }
  });

  deSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: GERMAN_ENGLISH_GLOSSARY.length + 1, column: 9 }
  };

  deSheet.columns = [
    { width: 28 },
    { width: 38 },
    { width: 34 },
    { width: 24 },
    { width: 22 },
    { width: 24 },
    { width: 24 },
    { width: 28 },
    { width: 42 }
  ];

  // ==========================================
  // SHEET 10: Ground Truth & Model Benchmark
  // ==========================================
  const gtSheet = workbook.addWorksheet('10_Ground_Truth_Benchmark', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1, showGridLines: true }]
  });

  const gtHeaders = [
    'Record ID',
    'Original Description',
    'True Ground-Truth Brand',
    'True Category',
    'True Subcategory',
    'True Standard Size',
    'True Duplicate?',
    'Requires Manual Review?',
    'Analyst Verification Notes'
  ];

  const gtHeaderRow = gtSheet.getRow(1);
  gtHeaderRow.values = gtHeaders;
  gtHeaderRow.font = WHITE_BOLD_FONT;
  gtHeaderRow.fill = CARD_HEADER_FILL;
  gtHeaderRow.height = 26;

  GROUND_TRUTH_DATASET.forEach((gt, idx) => {
    const row = gtSheet.getRow(idx + 2);
    row.values = [
      gt.recordId,
      gt.originalDescription,
      gt.trueBrand,
      gt.trueCategory,
      gt.trueSubcategory,
      gt.trueSize,
      gt.isTrueDuplicate,
      gt.requiresManualReview,
      gt.notes
    ];
    for (let c = 1; c <= 9; c++) {
      row.getCell(c).border = BORDER_THIN;
    }
  });

  gtSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: GROUND_TRUTH_DATASET.length + 1, column: 9 }
  };

  gtSheet.columns = [
    { width: 14 },
    { width: 34 },
    { width: 24 },
    { width: 22 },
    { width: 24 },
    { width: 18 },
    { width: 16 },
    { width: 24 },
    { width: 40 }
  ];

  // Write and trigger download in browser
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'RetailLens_Product_Matching_Quality_Analysis.xlsx';
  anchor.click();
  window.URL.revokeObjectURL(url);
}
