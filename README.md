# RetailLens — Retail Product Intelligence & Data Quality Analysis
<img width="1901" height="850" alt="Screenshot 2026-10-16 015704" src="https://github.com/user-attachments/assets/23a0a433-e955-407e-8fdd-d8c39fbfe249" />
<img width="1902" height="868" alt="Screenshot 2026-10-16 015752" src="https://github.com/user-attachments/assets/c031c178-6135-4886-bcf7-16a67867a7eb" />
<img width="1909" height="868" alt="Screenshot 2026-10-16 015844" src="https://github.com/user-attachments/assets/6c345215-ce62-4ae4-9a23-2470fbf6d16d" />
<img width="1912" height="869" alt="Screenshot 2026-10-16 015948" src="https://github.com/user-attachments/assets/0a1dde38-311a-42f8-8979-f4211067879d" />
<img width="1910" height="864" alt="Screenshot 2026-10-16 020032" src="https://github.com/user-attachments/assets/074fafac-10f3-4df3-b36e-19498b1215ab" />
<img width="1916" height="860" alt="Screenshot 2026-10-16 020159" src="https://github.com/user-attachments/assets/f1fd2c4d-eae8-4c65-ae8e-15cf64bb7828" />
<img width="1916" height="860" alt="Screenshot 2026-10-16 020304" src="https://github.com/user-attachments/assets/20172e26-fa49-4d23-9b10-38e6cb5340ad" />
<img width="1915" height="861" alt="Screenshot 2026-10-16 020419" src="https://github.com/user-attachments/assets/e2eb84ad-5407-4985-89ce-9630b177ddd3" />

An Excel-based retail market research project designed to standardize product information, match receipt descriptions to brands and categories, identify data quality issues, and generate actionable reports.

## Project Overview

Retail product descriptions often contain abbreviations, inconsistent formatting, spelling variations, missing brand information, and duplicate records. These issues can affect the accuracy of product databases and market research insights.

**RetailLens** demonstrates a structured workflow for organizing retail product data, validating product attributes, tracking uncertain matches, and maintaining a consistent product catalog using Microsoft Excel.

This project is designed to demonstrate practical data analyst skills relevant to product intelligence, market research, and data quality operations.

## Objectives

- Match retail product descriptions with appropriate brands and product categories.
- Standardize product names, package sizes, and measurement units.
- Identify duplicate records and incomplete product information.
- Validate data consistency using Excel formulas and reference tables.
- Create a review workflow for uncertain product matches.
- Maintain an audit trail of corrections and verification decisions.
- Summarize product catalog quality through dashboards and charts.

## Technology Stack

- **Microsoft Excel:** Data analysis and reporting
- **Excel Tables:** Structured datasets and filtering
- **Excel Formulas:** XLOOKUP, IF, IFERROR, COUNTIF, COUNTIFS, and text functions
- **Conditional Formatting:** Highlighting data quality issues
- **PivotTables and PivotCharts:** Category and brand analysis
- **Data Validation:** Standardized category and review-status selection
- **Power Query:** Optional data cleaning and transformation

## Workbook Structure

| Worksheet | Purpose |
|---|---|
| Dashboard | Summary metrics, charts, and catalog status |
| Product Catalog | Product descriptions, brands, categories, prices, and review statuses |
| Brand Reference | Standardized brands, categories, and validation rules |
| Data Quality | Missing fields, invalid prices, duplicates, and review flags |
| Review Log | Record of manual verification and corrections |
| Read Me | Project purpose and usage instructions |

*Adjust this list to match the worksheets included in your final workbook.*

## Key Features

### 1. Product Matching
Organizes raw product descriptions and compares candidate products using brand names, product attributes, and package sizes. Ambiguous records are flagged for manual review.

### 2. Data Cleaning
Identifies incomplete fields, inconsistent product naming, invalid values, and formatting issues that may affect catalog reliability.

### 3. Duplicate Detection
Flags potentially duplicated descriptions for investigation while preserving products that have different package sizes or variants.

### 4. Data Validation
Uses reference data and controlled selections to improve consistency across product brands, categories, subcategories, and review statuses.

### 5. Quality Dashboard
Summarizes record counts, matching statuses, pending reviews, potential duplicates, and product category distribution.

### 6. Review and Audit Trail
Provides a structured way to document corrections, reviewer decisions, evidence references, and reasons for changes.

## Example Use Case

A receipt contains the description `Dove Soap 100 g`, while the product catalog contains a standardized entry for Dove soap.

The analyst checks the brand, product type, and package size before assigning a match. If the information is incomplete or conflicting, the record is flagged for review instead of being automatically confirmed.

This process helps improve consistency and reduce incorrect product assignments.

## How to Use

1. Download the Excel workbook from this repository.
2. Open it in Microsoft Excel.
3. Start with the **Read Me** worksheet for instructions.
4. Review the product records and their current matching statuses.
5. Investigate records flagged for missing information or possible duplicates.
6. Update product details only after checking appropriate evidence.
7. Review the dashboard and quality reports after making changes.

## Evaluation Approach

Matching performance should be evaluated against a manually verified test dataset.

Recommended metrics include:

- Matching precision
- Matching recall
- Duplicate detection precision and recall
- Number of unresolved records
- Data completeness rate
- Manual review rate

No performance figures should be reported until they have been measured on a documented test dataset.

## Data and Limitations

The sample records are illustrative and should be treated as synthetic demonstration data unless explicitly documented otherwise. Example URLs are placeholders, not verified product evidence.

Text similarity alone cannot establish that two product descriptions refer to the same item. Brand, variant, package size, and source evidence must be considered before confirming a match.

This is an independent portfolio project and is not affiliated with or endorsed by Numerator.

## Skills Demonstrated

- Microsoft Excel and spreadsheet analysis
- Data cleaning and standardization
- Product research and categorization
- Data quality assurance
- Duplicate identification
- Lookup formulas and reference tables
- Dashboard development and reporting
- Attention to detail and structured review workflows
- Documentation and reproducible analysis

## Future Improvements

- Expand the catalog with verified product information from permitted public sources.
- Automate data imports and transformations with Power Query.
- Add more advanced product matching and exception handling.
- Develop a larger, manually labeled evaluation dataset.
- Add bilingual German–English product descriptions where language skills and verified translations are available.

## Author

**Jiten Moni Das**

GitHub: https://github.com/jiten54

---

*Built as a practical data analytics portfolio project focused on retail product intelligence, catalog accuracy, and market research workflows.*
