import {
  RawProduct,
  ReferenceBrandCategory,
  GermanEnglishReference,
  GroundTruthRecord
} from '../types/retail';

// Approved Brand & Category Reference Master Table (Taxonomy)
export const REFERENCE_BRANDS: ReferenceBrandCategory[] = [
  {
    brandId: 'BRD-001',
    approvedBrand: 'Coca-Cola',
    parentCompany: 'The Coca-Cola Company',
    category: 'Beverages',
    subcategory: 'Soft Drinks & Carbonates',
    namingConvention: 'Coca-Cola [Variant] [Size][Unit]',
    validUnits: ['ml', 'l', 'can', 'pack'],
    aliases: ['COCA COLA', 'COCA-COLA', 'COKE', 'CC']
  },
  {
    brandId: 'BRD-002',
    approvedBrand: 'Pepsi',
    parentCompany: 'PepsiCo',
    category: 'Beverages',
    subcategory: 'Soft Drinks & Carbonates',
    namingConvention: 'Pepsi [Variant] [Size][Unit]',
    validUnits: ['ml', 'l', 'can'],
    aliases: ['PEPSI', 'PEPSI-MAX', 'PEPSI MAX']
  },
  {
    brandId: 'BRD-003',
    approvedBrand: 'Volvic',
    parentCompany: 'Danone',
    category: 'Beverages',
    subcategory: 'Mineral Water',
    namingConvention: 'Volvic [Water Type] [Flavor] [Size][Unit]',
    validUnits: ['ml', 'l'],
    aliases: ['VOLVIC', 'VOLV', 'VOLVIC TEE']
  },
  {
    brandId: 'BRD-004',
    approvedBrand: 'Gerolsteiner',
    parentCompany: 'Gerolsteiner Brunnen GmbH',
    category: 'Beverages',
    subcategory: 'Mineral Water',
    namingConvention: 'Gerolsteiner [Sprudel/Medium/Naturell] [Size][Unit]',
    validUnits: ['ml', 'l'],
    aliases: ['GEROLST.', 'GEROLSTEINER', 'GEROLST SPRUDEL']
  },
  {
    brandId: 'BRD-005',
    approvedBrand: 'Alpro',
    parentCompany: 'Danone',
    category: 'Dairy & Refrigerated',
    subcategory: 'Plant-Based Alternatives',
    namingConvention: 'Alpro [Base] [Variant] [Size][Unit]',
    validUnits: ['ml', 'l', 'g'],
    aliases: ['ALPRO', 'ALPRO SOJA', 'ALPRO HAFER', 'ALPRO MANDEL']
  },
  {
    brandId: 'BRD-006',
    approvedBrand: 'Oatly',
    parentCompany: 'Oatly AB',
    category: 'Dairy & Refrigerated',
    subcategory: 'Plant-Based Alternatives',
    namingConvention: 'Oatly Haferdrink [Variant] [Size][Unit]',
    validUnits: ['l', 'ml'],
    aliases: ['OATLY', 'OATLY BARISTA', 'OATLY HAFER']
  },
  {
    brandId: 'BRD-007',
    approvedBrand: 'Weihenstephan',
    parentCompany: 'Molkerei Weihenstephan GmbH',
    category: 'Dairy & Refrigerated',
    subcategory: 'Fresh Milk & Cream',
    namingConvention: 'Weihenstephan [Type] [Fat%] [Size][Unit]',
    validUnits: ['ml', 'l', 'g'],
    aliases: ['WEIHENST.', 'WEIHENSTEPHAN', 'WEIHENST MILCH']
  },
  {
    brandId: 'BRD-008',
    approvedBrand: 'Kerrygold',
    parentCompany: 'Ornua',
    category: 'Dairy & Refrigerated',
    subcategory: 'Butter & Spreads',
    namingConvention: 'Kerrygold [Original/Extra/Salted] [Size][Unit]',
    validUnits: ['g', 'kg'],
    aliases: ['KERRYGOLD', 'KERRYG.', 'KERRY GOLD']
  },
  {
    brandId: 'BRD-009',
    approvedBrand: 'Müller',
    parentCompany: 'Unternehmensgruppe Theo Müller',
    category: 'Dairy & Refrigerated',
    subcategory: 'Yogurt & Desserts',
    namingConvention: 'Müller Müllermilch [Flavor] [Size][Unit]',
    validUnits: ['ml', 'g'],
    aliases: ['MÜLLER', 'MUELLER', 'MÜLLERMILCH', 'MUELLERMILCH']
  },
  {
    brandId: 'BRD-010',
    approvedBrand: 'Milka',
    parentCompany: 'Mondelez International',
    category: 'Packaged Food',
    subcategory: 'Chocolate & Confectionery',
    namingConvention: 'Milka Schokolade [Flavor] [Size][Unit]',
    validUnits: ['g', 'kg'],
    aliases: ['MILKA', 'MILKA SCHOKO', 'MILKA ALPENM.']
  },
  {
    brandId: 'BRD-011',
    approvedBrand: 'Ritter Sport',
    parentCompany: 'Alfred Ritter GmbH & Co. KG',
    category: 'Packaged Food',
    subcategory: 'Chocolate & Confectionery',
    namingConvention: 'Ritter Sport [Variety] [Size][Unit]',
    validUnits: ['g'],
    aliases: ['RITTER SPORT', 'RITT.SP.', 'RITTER SP.', 'RITTER']
  },
  {
    brandId: 'BRD-012',
    approvedBrand: 'Haribo',
    parentCompany: 'Haribo Holding GmbH & Co. KG',
    category: 'Packaged Food',
    subcategory: 'Gummies & Candies',
    namingConvention: 'Haribo [Product Name] [Size][Unit]',
    validUnits: ['g', 'kg'],
    aliases: ['HARIBO', 'HARIBO GOLDB.', 'HARIBO FRUCHTGUMMI']
  },
  {
    brandId: 'BRD-013',
    approvedBrand: 'Dr. Oetker',
    parentCompany: 'Dr. August Oetker KG',
    category: 'Packaged Food',
    subcategory: 'Frozen Pizza & Meals',
    namingConvention: 'Dr. Oetker Ristorante Pizza [Type] [Size][Unit]',
    validUnits: ['g', 'kg'],
    aliases: ['DR. OETKER', 'DR.OETKER', 'DR OETKER', 'DR.OETK.', 'RISTORANTE']
  },
  {
    brandId: 'BRD-014',
    approvedBrand: 'Barilla',
    parentCompany: 'Barilla S.p.A.',
    category: 'Packaged Food',
    subcategory: 'Pasta & Noodles',
    namingConvention: 'Barilla [Pasta Shape] No. [Number] [Size][Unit]',
    validUnits: ['g', 'kg'],
    aliases: ['BARILLA', 'BARILLA N.', 'BARILLA SPAGHETTI']
  },
  {
    brandId: 'BRD-015',
    approvedBrand: 'Knorr',
    parentCompany: 'Unilever',
    category: 'Packaged Food',
    subcategory: 'Sauces, Seasonings & Fix',
    namingConvention: 'Knorr Fix [Dish Name] [Size][Unit]',
    validUnits: ['g', 'ml'],
    aliases: ['KNORR', 'KNORR FIX', 'KNORR SUPPE']
  },
  {
    brandId: 'BRD-016',
    approvedBrand: 'Maggi',
    parentCompany: 'Nestlé',
    category: 'Packaged Food',
    subcategory: 'Sauces, Seasonings & Fix',
    namingConvention: 'Maggi Fix [Dish Name] [Size][Unit]',
    validUnits: ['g', 'ml'],
    aliases: ['MAGGI', 'MAGGI FIX', 'MAGGI WÜRZE']
  },
  {
    brandId: 'BRD-017',
    approvedBrand: 'Nutella',
    parentCompany: 'Ferrero',
    category: 'Grocery & Fresh Pantry',
    subcategory: 'Sweet Spreads',
    namingConvention: 'Nutella Nuss-Nugat-Creme [Size][Unit]',
    validUnits: ['g', 'kg'],
    aliases: ['NUTELLA', 'FERRERO NUTELLA']
  },
  {
    brandId: 'BRD-018',
    approvedBrand: 'Nivea',
    parentCompany: 'Beiersdorf AG',
    category: 'Personal Care & Health',
    subcategory: 'Skin & Body Care',
    namingConvention: 'Nivea [Product Line] [Type] [Size][Unit]',
    validUnits: ['ml', 'g'],
    aliases: ['NIVEA', 'NIV.', 'NIV', 'NIVEA MEN', 'NIVEA CREME']
  },
  {
    brandId: 'BRD-019',
    approvedBrand: 'Dove',
    parentCompany: 'Unilever',
    category: 'Personal Care & Health',
    subcategory: 'Bath & Shower',
    namingConvention: 'Dove [Product Line] [Size][Unit]',
    validUnits: ['ml', 'g'],
    aliases: ['DOVE', 'DOVE PFLEGE']
  },
  {
    brandId: 'BRD-020',
    approvedBrand: 'Colgate',
    parentCompany: 'Colgate-Palmolive',
    category: 'Personal Care & Health',
    subcategory: 'Oral Care',
    namingConvention: 'Colgate [Formula] Zahnpasta [Size][Unit]',
    validUnits: ['ml'],
    aliases: ['COLGATE', 'COLGATE TOTAL']
  },
  {
    brandId: 'BRD-021',
    approvedBrand: 'Oral-B',
    parentCompany: 'Procter & Gamble',
    category: 'Personal Care & Health',
    subcategory: 'Oral Care',
    namingConvention: 'Oral-B [Product Line] [Size][Unit]',
    validUnits: ['ml', 'stück'],
    aliases: ['ORAL-B', 'ORAL B', 'ORALB']
  },
  {
    brandId: 'BRD-022',
    approvedBrand: 'Balea',
    parentCompany: 'dm-drogerie markt (Private Label)',
    category: 'Personal Care & Health',
    subcategory: 'Bath & Shower',
    namingConvention: 'Balea [Product Type] [Fragrance] [Size][Unit]',
    validUnits: ['ml', 'g', 'stück'],
    aliases: ['BALEA', 'DM BALEA']
  },
  {
    brandId: 'BRD-023',
    approvedBrand: 'Isana',
    parentCompany: 'Dirk Rossmann GmbH (Private Label)',
    category: 'Personal Care & Health',
    subcategory: 'Bath & Shower',
    namingConvention: 'Isana [Product Type] [Size][Unit]',
    validUnits: ['ml', 'g', 'stück'],
    aliases: ['ISANA', 'ROSSMANN ISANA']
  },
  {
    brandId: 'BRD-024',
    approvedBrand: 'Persil',
    parentCompany: 'Henkel AG & Co. KGaA',
    category: 'Household & Cleaning',
    subcategory: 'Laundry Detergents',
    namingConvention: 'Persil [Gel/Universal/Color/Discs] [WL]',
    validUnits: ['wl', 'l', 'kg', 'caps'],
    aliases: ['PERSIL', 'PERSIL COLOR', 'PERSIL UNIV']
  },
  {
    brandId: 'BRD-025',
    approvedBrand: 'Ariel',
    parentCompany: 'Procter & Gamble',
    category: 'Household & Cleaning',
    subcategory: 'Laundry Detergents',
    namingConvention: 'Ariel [Pods/Liquid/Color] [WL]',
    validUnits: ['wl', 'l', 'kg', 'pods'],
    aliases: ['ARIEL', 'ARIEL PODS', 'ARIEL COLOR']
  },
  {
    brandId: 'BRD-026',
    approvedBrand: 'Fairy',
    parentCompany: 'Procter & Gamble',
    category: 'Household & Cleaning',
    subcategory: 'Dishwashing',
    namingConvention: 'Fairy Spülmittel [Variant] [Size][Unit]',
    validUnits: ['ml', 'l', 'tabs'],
    aliases: ['FAIRY', 'FAIRY ULTRA', 'FAIRY PLUS']
  },
  {
    brandId: 'BRD-027',
    approvedBrand: 'Pril',
    parentCompany: 'Henkel AG & Co. KGaA',
    category: 'Household & Cleaning',
    subcategory: 'Dishwashing',
    namingConvention: 'Pril Kraft-Gel [Variant] [Size][Unit]',
    validUnits: ['ml', 'l'],
    aliases: ['PRIL', 'PRIL KRAFT', 'PRIL GEL']
  },
  {
    brandId: 'BRD-028',
    approvedBrand: 'Frosch',
    parentCompany: 'Werner & Mertz GmbH',
    category: 'Household & Cleaning',
    subcategory: 'Surface Cleaners',
    namingConvention: 'Frosch [Product Type] [Fragrance] [Size][Unit]',
    validUnits: ['ml', 'l'],
    aliases: ['FROSCH', 'FROSCH ECO', 'FROSCH REINIGER']
  },
  {
    brandId: 'BRD-029',
    approvedBrand: 'Ja!',
    parentCompany: 'REWE Group (Private Label)',
    category: 'Grocery & Fresh Pantry',
    subcategory: 'General Grocery',
    namingConvention: 'ja! [Product Name] [Size][Unit]',
    validUnits: ['g', 'kg', 'ml', 'l', 'stück'],
    aliases: ['JA!', 'JA', 'REWE JA!']
  },
  {
    brandId: 'BRD-030',
    approvedBrand: 'Gut & Günstig',
    parentCompany: 'EDEKA ZENTRALE Stiftung & Co. KG (Private Label)',
    category: 'Grocery & Fresh Pantry',
    subcategory: 'General Grocery',
    namingConvention: 'GUT&GÜNSTIG [Product Name] [Size][Unit]',
    validUnits: ['g', 'kg', 'ml', 'l', 'stück'],
    aliases: ['GUT & GÜNSTIG', 'G&G', 'GUT&GUENSTIG', 'GUT UND GUENSTIG']
  },
  {
    brandId: 'BRD-031',
    approvedBrand: 'Milbona',
    parentCompany: 'Lidl Stiftung & Co. KG (Private Label)',
    category: 'Dairy & Refrigerated',
    subcategory: 'Fresh Milk & Cream',
    namingConvention: 'Milbona [Product Name] [Size][Unit]',
    validUnits: ['ml', 'l', 'g'],
    aliases: ['MILBONA', 'LIDL MILBONA']
  },
  {
    brandId: 'BRD-032',
    approvedBrand: 'Milsani',
    parentCompany: 'ALDI Süd / Nord (Private Label)',
    category: 'Dairy & Refrigerated',
    subcategory: 'Fresh Milk & Cream',
    namingConvention: 'Milsani [Product Name] [Size][Unit]',
    validUnits: ['ml', 'l', 'g'],
    aliases: ['MILSANI', 'ALDI MILSANI']
  },
  {
    brandId: 'BRD-033',
    approvedBrand: 'Red Bull',
    parentCompany: 'Red Bull GmbH',
    category: 'Beverages',
    subcategory: 'Energy Drinks',
    namingConvention: 'Red Bull Energy Drink [Variant] [Size][Unit]',
    validUnits: ['ml', 'can'],
    aliases: ['RED BULL', 'RED BULL ED', 'RB ENERGY']
  },
  {
    brandId: 'BRD-034',
    approvedBrand: 'Tchibo',
    parentCompany: 'Tchibo GmbH',
    category: 'Beverages',
    subcategory: 'Coffee & Tea',
    namingConvention: 'Tchibo [Roast Type] [Size][Unit]',
    validUnits: ['g', 'kg'],
    aliases: ['TCHIBO', 'TCHIBO FEINE MILDE', 'TCHIBO KAFFEE']
  },
  {
    brandId: 'BRD-035',
    approvedBrand: 'Lavazza',
    parentCompany: 'Luigi Lavazza S.p.A.',
    category: 'Beverages',
    subcategory: 'Coffee & Tea',
    namingConvention: 'Lavazza [Blend Name] [Size][Unit]',
    validUnits: ['g', 'kg'],
    aliases: ['LAVAZZA', 'LAVAZZA CREMA', 'LAVAZZA ESPRESSO']
  },
  {
    brandId: 'BRD-036',
    approvedBrand: 'Alesto',
    parentCompany: 'Lidl Stiftung & Co. KG (Private Label)',
    category: 'Packaged Food',
    subcategory: 'Nuts & Dried Fruits',
    namingConvention: 'Alesto [Nut Variety] [Size][Unit]',
    validUnits: ['g', 'kg'],
    aliases: ['ALESTO', 'LIDL ALESTO']
  },
  {
    brandId: 'BRD-037',
    approvedBrand: 'Bionade',
    parentCompany: 'Hassia Mineralquellen',
    category: 'Beverages',
    subcategory: 'Soft Drinks & Carbonates',
    namingConvention: 'Bionade [Flavor] [Size][Unit]',
    validUnits: ['ml', 'l'],
    aliases: ['BIONADE', 'BIO NADE', 'BIONADE HOLUNDER']
  },
  {
    brandId: 'BRD-038',
    approvedBrand: 'Wagner',
    parentCompany: 'Nestlé Wagner GmbH',
    category: 'Packaged Food',
    subcategory: 'Frozen Pizza & Meals',
    namingConvention: 'Original Wagner Steinofen Pizza [Variety] [Size][Unit]',
    validUnits: ['g'],
    aliases: ['WAGNER', 'WAGNER PIZZA', 'ORIGINAL WAGNER', 'STEINOFEN']
  },
  {
    brandId: 'BRD-039',
    approvedBrand: 'Schauma',
    parentCompany: 'Henkel AG & Co. KGaA',
    category: 'Personal Care & Health',
    subcategory: 'Hair Care',
    namingConvention: 'Schauma Shampoo [Hair Type] [Size][Unit]',
    validUnits: ['ml'],
    aliases: ['SCHAUMA', 'SCHAUMA SH.', 'HENKEL SCHAUMA']
  },
  {
    brandId: 'BRD-040',
    approvedBrand: 'Somat',
    parentCompany: 'Henkel AG & Co. KGaA',
    category: 'Household & Cleaning',
    subcategory: 'Dishwashing',
    namingConvention: 'Somat [Excellence/Gold/All in 1] Tabs [Tabs Count]',
    validUnits: ['tabs', 'g'],
    aliases: ['SOMAT', 'SOMAT TABS', 'SOMAT ALL IN 1']
  }
];

// German-English Bilingual Grocery & Market Research Reference Glossary (100+ entries)
export const GERMAN_ENGLISH_GLOSSARY: GermanEnglishReference[] = [
  {
    germanTerm: 'H-Milch (Haltbare Milch)',
    germanDescription: 'Ultrahocherhitzte, länger haltbare Milch meist im Tetra Pak.',
    englishTranslation: 'UHT (Ultra-High-Temperature) long-life milk',
    brand: 'Ja!, Weihenstephan, Milbona',
    category: 'Dairy & Refrigerated',
    subcategory: 'Fresh Milk & Cream',
    abbreviationMeaning: 'H-Milch = Haltbare Milch',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Crucial for German market: H-Milch 3,5% (Vollmilch) vs 1,5% (fettarm).'
  },
  {
    germanTerm: 'Vollmilch',
    germanDescription: 'Kuhmilch mit natürlichem oder eingestelltem Fettgehalt von mind. 3,5%.',
    englishTranslation: 'Whole milk (min. 3.5% milk fat)',
    brand: 'Weihenstephan, Gut & Günstig',
    category: 'Dairy & Refrigerated',
    subcategory: 'Fresh Milk & Cream',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Receipt OCR often prints: "VOLLM. 3,5%"'
  },
  {
    germanTerm: 'Fettarme Milch',
    germanDescription: 'Milch mit reduziertem Fettgehalt zwischen 1,5% und 1,8%.',
    englishTranslation: 'Semi-skimmed / low-fat milk (approx. 1.5% fat)',
    brand: 'Milsani, Ja!, Weihenstephan',
    category: 'Dairy & Refrigerated',
    subcategory: 'Fresh Milk & Cream',
    abbreviationMeaning: 'FETTARM / FETTARME',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Standard discount staple in Rewe, Aldi, Lidl.'
  },
  {
    germanTerm: 'Schorle / Apfelschorle',
    germanDescription: 'Kohlensäurehaltiges Erfrischungsgetränk aus Apfelsaft und Mineralwasser.',
    englishTranslation: 'Apple spritzer (carbonated mineral water + apple juice blend)',
    brand: 'Gerolsteiner, Ja!, Gut & Günstig',
    category: 'Beverages',
    subcategory: 'Soft Drinks & Carbonates',
    abbreviationMeaning: 'APF.SCHORLE / APFELSCH.',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Quintessential German staple drink, high volume receipt item.'
  },
  {
    germanTerm: 'Sprudel / Spritzig',
    germanDescription: 'Mineralwasser mit hohem Kohlensäuregehalt.',
    englishTranslation: 'Sparkling mineral water (high carbonation)',
    brand: 'Gerolsteiner, Volvic',
    category: 'Beverages',
    subcategory: 'Mineral Water',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Contrasted with "Medium" (lightly sparkling) and "Naturell / Still".'
  },
  {
    germanTerm: 'Still / Naturell',
    germanDescription: 'Mineralwasser ohne zugesetzte Kohlensäure.',
    englishTranslation: 'Still / uncarbonated mineral water',
    brand: 'Volvic, Vittel, Black Forest',
    category: 'Beverages',
    subcategory: 'Mineral Water',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Often abbreviated "NAT." or "STILL" on receipts.'
  },
  {
    germanTerm: 'Waschladungen (WL)',
    germanDescription: 'Maßeinheit für Waschmittel: Anzahl der Standardwaschgänge.',
    englishTranslation: 'Wash loads / washing cycles (WL)',
    brand: 'Persil, Ariel',
    category: 'Household & Cleaning',
    subcategory: 'Laundry Detergents',
    abbreviationMeaning: 'WL = Waschladungen',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Package size on receipts is frequently stated as 20WL, 45WL, 60WL instead of kg or L.'
  },
  {
    germanTerm: 'Spülmittel / Handspülmittel',
    germanDescription: 'Flüssiges Reinigungsmittel für das manuelle Geschirrspülen.',
    englishTranslation: 'Manual dishwashing liquid',
    brand: 'Pril, Fairy, Frosch',
    category: 'Household & Cleaning',
    subcategory: 'Dishwashing',
    abbreviationMeaning: 'SPÜLM. / SPÜLI',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Do not confuse with "Geschirrspültabs" (dishwasher tabs).'
  },
  {
    germanTerm: 'Geschirrspültabs / Spülmaschinentabs',
    germanDescription: 'Feste Tabs oder Gelkissen für automatische Geschirrspülmaschinen.',
    englishTranslation: 'Automatic dishwasher detergent tablets / pods',
    brand: 'Somat, Fairy, Finish',
    category: 'Household & Cleaning',
    subcategory: 'Dishwashing',
    abbreviationMeaning: 'GS-TABS / SPÜLM.-TABS',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Count measured in Stück (St.) or Tabs.'
  },
  {
    germanTerm: 'Duschgel / Cremedusche',
    germanDescription: 'Körperreinigungsmittel für die tägliche Dusche.',
    englishTranslation: 'Body wash / shower gel / cream shower',
    brand: 'Balea, Isana, Nivea, Dove',
    category: 'Personal Care & Health',
    subcategory: 'Bath & Shower',
    abbreviationMeaning: 'DUSCHG. / CR.DUSCHE',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Very high private label share in Germany (dm Balea, Rossmann Isana).'
  },
  {
    germanTerm: 'Haferdrink / Hafermilch',
    germanDescription: 'Pflanzliches Ersatzprodukt für Milch auf Basis von fermentiertem Hafer.',
    englishTranslation: 'Oat drink / oat milk alternative',
    brand: 'Oatly, Alpro, Rewe Bio',
    category: 'Dairy & Refrigerated',
    subcategory: 'Plant-Based Alternatives',
    abbreviationMeaning: 'HAF.DRINK / HAFERMILCH',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'EU law forbids marketing as "Hafermilch" on packaging, but consumers & receipts often use it.'
  },
  {
    germanTerm: 'Sauerrahm / Schmand / Crème fraîche',
    germanDescription: 'Gesäuerte Milcherzeugnisse mit abgestuftem Fettgehalt (10% bis 30%).',
    englishTranslation: 'Sour cream (Sauerrahm 10%), Schmand (20-24%), Crème fraîche (30%)',
    brand: 'Weihenstephan, Ja!, Gut & Günstig',
    category: 'Dairy & Refrigerated',
    subcategory: 'Yogurt & Desserts',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Specific German culinary distinction, essential for correct subcategory mapping.'
  },
  {
    germanTerm: 'Quark / Speisequark',
    germanDescription: 'Frischkäsezubereitung in Magerstufe oder mit 20% / 40% Fettgehalt.',
    englishTranslation: 'Quark / curd cheese (low-fat / standard)',
    brand: 'Milbona, Ja!, Milsani',
    category: 'Dairy & Refrigerated',
    subcategory: 'Yogurt & Desserts',
    abbreviationMeaning: 'QUARK / SP.QUARK',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Has no direct 1-to-1 English equivalent (often mapped to soft cheese/curd).'
  },
  {
    germanTerm: 'Fruchtgummi',
    germanDescription: 'Süßwaren auf Gelatine- oder Stärkebasis, wie Gummibärchen.',
    englishTranslation: 'Fruit gummies / gummy candy',
    brand: 'Haribo, Katjes',
    category: 'Packaged Food',
    subcategory: 'Gummies & Candies',
    abbreviationMeaning: 'FRUCHTG. / GUMMIB.',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Haribo Goldbären is Germany’s #1 selling candy SKU.'
  },
  {
    germanTerm: 'Tiefkühlpizza (TK-Pizza)',
    germanDescription: 'Vorgebackene und schockgefrostete Pizza zur Zubereitung im Ofen.',
    englishTranslation: 'Frozen pizza',
    brand: 'Dr. Oetker, Wagner',
    category: 'Packaged Food',
    subcategory: 'Frozen Pizza & Meals',
    abbreviationMeaning: 'TK-PIZZA / TK PIZZA',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'TK = Tiefgekühlt / Tiefkühlkost.'
  },
  {
    germanTerm: 'Nuss-Nugat-Creme',
    germanDescription: 'Süßer Brotaufstrich aus gerösteten Haselnüssen, Kakao und Zucker.',
    englishTranslation: 'Hazelnut cocoa spread',
    brand: 'Nutella, Milka',
    category: 'Grocery & Fresh Pantry',
    subcategory: 'Sweet Spreads',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Standard German breakfast staple.'
  },
  {
    germanTerm: 'Kohlensäurefrei',
    germanDescription: 'Ohne Kohlensäure (Mineralwasser oder Softdrinks).',
    englishTranslation: 'Non-carbonated / uncarbonated / flat',
    brand: 'Volvic',
    category: 'Beverages',
    subcategory: 'Mineral Water',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Important attribute filter for beverage panel analyses.'
  },
  {
    germanTerm: 'Pfand / Einwegpfand / Mehrwegpfand',
    germanDescription: 'Gesetzliches Flaschenpfand (0,25 € für Einweg, 0,08 € oder 0,15 € für Mehrweg).',
    englishTranslation: 'Bottle deposit (€0.25 single-use, €0.08/€0.15 multi-use)',
    brand: 'All beverage brands',
    category: 'Beverages',
    subcategory: 'Deposit Fee (Non-product)',
    abbreviationMeaning: 'PFAND / EINWEGPFAND',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Must be stripped or separated from unit price in retail analytics!'
  },
  {
    germanTerm: 'Dose (Ds. / DS)',
    germanDescription: 'Getränkedose aus Aluminium oder Weißblech.',
    englishTranslation: 'Beverage can (alu / tin)',
    brand: 'Coca-Cola, Red Bull, Pepsi',
    category: 'Beverages',
    subcategory: 'Soft Drinks & Carbonates',
    abbreviationMeaning: 'DS / DOSE',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'Frequent receipt abbreviation e.g. "CC ZERO 0,33L DS".'
  },
  {
    germanTerm: 'Glasflasche (Gl. / MW)',
    germanDescription: 'Flasche aus Glas, meist Mehrweg.',
    englishTranslation: 'Glass bottle (often reusable)',
    brand: 'Gerolsteiner, Bionade',
    category: 'Beverages',
    subcategory: 'Mineral Water',
    abbreviationMeaning: 'GL / FL / MW',
    verificationStatus: 'Verified by Bilingual Analyst',
    notes: 'MW = Mehrweg (reusable deposit bottle).'
  }
];

// Helper to seed 310 realistic raw retail products
export function generateSyntheticProducts(): { rawProducts: RawProduct[]; groundTruth: GroundTruthRecord[] } {
  const retailers = ['Rewe', 'Edeka', 'Aldi Süd', 'Lidl', 'dm-drogerie', 'Rossmann', 'Kaufland', 'Amazon.de'];
  const sourceTypes: ('Receipt OCR' | 'E-Commerce Catalog' | 'Mobile Scan')[] = ['Receipt OCR', 'E-Commerce Catalog', 'Mobile Scan'];

  const rawProducts: RawProduct[] = [];
  const groundTruth: GroundTruthRecord[] = [];

  // Base product templates with realistic OCR variations, typos, anomalies, and duplicates
  interface Template {
    rawDesc: string;
    extractedName: string;
    extractedBrand: string;
    size: number;
    unit: string;
    price: number;
    retailer: string;
    sourceType: 'Receipt OCR' | 'E-Commerce Catalog' | 'Mobile Scan';
    trueBrand: string;
    trueCategory: string;
    trueSubcategory: string;
    trueSize: string;
    isTrueDuplicate?: boolean;
    trueDuplicateGroup?: string;
    requiresManualReview?: boolean;
    notes?: string;
  }

  const baseTemplates: Template[] = [
    // 1-15: Coca-Cola variants & receipts
    {
      rawDesc: 'COCA COLA 1,5L EW',
      extractedName: 'Original Taste',
      extractedBrand: 'Coca-Cola',
      size: 1.5,
      unit: 'l',
      price: 1.69,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Coca-Cola',
      trueCategory: 'Beverages',
      trueSubcategory: 'Soft Drinks & Carbonates',
      trueSize: '1.5 l'
    },
    {
      rawDesc: 'COCA-COLA ZERO 0.33L DS',
      extractedName: 'Zero Sugar Dose',
      extractedBrand: 'Coca-Cola',
      size: 330,
      unit: 'ml',
      price: 0.89,
      retailer: 'Edeka',
      sourceType: 'Receipt OCR',
      trueBrand: 'Coca-Cola',
      trueCategory: 'Beverages',
      trueSubcategory: 'Soft Drinks & Carbonates',
      trueSize: '330 ml'
    },
    {
      rawDesc: 'CC ZERO 0,33L DOSE', // OCR abbreviation
      extractedName: 'Zero Dose',
      extractedBrand: 'CC',
      size: 0.33,
      unit: 'l',
      price: 0.89,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Coca-Cola',
      trueCategory: 'Beverages',
      trueSubcategory: 'Soft Drinks & Carbonates',
      trueSize: '330 ml',
      requiresManualReview: true,
      notes: 'OCR alias CC needs brand mapping validation.'
    },
    {
      rawDesc: 'Coca Cola Light Taste Erfrischungsgetränk 1,5 l Einwegflasche',
      extractedName: 'Light Taste Flasche',
      extractedBrand: 'Coca Cola',
      size: 1.5,
      unit: 'l',
      price: 1.69,
      retailer: 'Amazon.de',
      sourceType: 'E-Commerce Catalog',
      trueBrand: 'Coca-Cola',
      trueCategory: 'Beverages',
      trueSubcategory: 'Soft Drinks & Carbonates',
      trueSize: '1.5 l'
    },
    {
      rawDesc: 'COCA COLA 1,5L EW', // Intentional Duplicate of #1
      extractedName: 'Original Taste',
      extractedBrand: 'Coca-Cola',
      size: 1.5,
      unit: 'l',
      price: 1.69,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Coca-Cola',
      trueCategory: 'Beverages',
      trueSubcategory: 'Soft Drinks & Carbonates',
      trueSize: '1.5 l',
      isTrueDuplicate: true,
      trueDuplicateGroup: 'DUP-CC-1500',
      notes: 'Duplicate receipt scan from same transaction'
    },

    // 16-30: Mineral Water (Gerolsteiner & Volvic)
    {
      rawDesc: 'GEROLST. MEDIUM 1L GL',
      extractedName: 'Medium Mineralwasser',
      extractedBrand: 'Gerolsteiner',
      size: 1.0,
      unit: 'l',
      price: 0.99,
      retailer: 'Edeka',
      sourceType: 'Receipt OCR',
      trueBrand: 'Gerolsteiner',
      trueCategory: 'Beverages',
      trueSubcategory: 'Mineral Water',
      trueSize: '1 l'
    },
    {
      rawDesc: 'GEROLSTEINER SPRUDEL 0,75L',
      extractedName: 'Sprudel Glas',
      extractedBrand: 'Gerolsteiner',
      size: 750,
      unit: 'ml',
      price: 0.85,
      retailer: 'Kaufland',
      sourceType: 'Receipt OCR',
      trueBrand: 'Gerolsteiner',
      trueCategory: 'Beverages',
      trueSubcategory: 'Mineral Water',
      trueSize: '750 ml'
    },
    {
      rawDesc: 'VOLVIC NATURELL 1,5L',
      extractedName: 'Naturell Still',
      extractedBrand: 'Volvic',
      size: 1.5,
      unit: 'l',
      price: 1.15,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Volvic',
      trueCategory: 'Beverages',
      trueSubcategory: 'Mineral Water',
      trueSize: '1.5 l'
    },
    {
      rawDesc: 'VOLVIC TEE PFIRSICH 1,5L',
      extractedName: 'Tee Pfirsich',
      extractedBrand: 'Volvic',
      size: 1.5,
      unit: 'l',
      price: 1.59,
      retailer: 'Edeka',
      sourceType: 'Receipt OCR',
      trueBrand: 'Volvic',
      trueCategory: 'Beverages',
      trueSubcategory: 'Soft Drinks & Carbonates',
      trueSize: '1.5 l',
      requiresManualReview: true,
      notes: 'Subcategory switch: Flavored water / ice tea vs pure water'
    },

    // 31-45: Haribo Confectionery
    {
      rawDesc: 'HARIBO GOLDB. 200G',
      extractedName: 'Goldbären Fruchtgummi',
      extractedBrand: 'Haribo',
      size: 200,
      unit: 'g',
      price: 1.19,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Haribo',
      trueCategory: 'Packaged Food',
      trueSubcategory: 'Gummies & Candies',
      trueSize: '200 g'
    },
    {
      rawDesc: 'HARIBO COLORADO 175G',
      extractedName: 'Colorado Mischung',
      extractedBrand: 'Haribo',
      size: 175,
      unit: 'g',
      price: 1.19,
      retailer: 'Aldi Süd',
      sourceType: 'Receipt OCR',
      trueBrand: 'Haribo',
      trueCategory: 'Packaged Food',
      trueSubcategory: 'Gummies & Candies',
      trueSize: '175 g'
    },
    {
      rawDesc: 'H4RIB0 GOLDBAEREN 200G', // OCR digit glitch
      extractedName: 'Goldbären',
      extractedBrand: 'H4rib0',
      size: 200,
      unit: 'g',
      price: 1.19,
      retailer: 'Lidl',
      sourceType: 'Receipt OCR',
      trueBrand: 'Haribo',
      trueCategory: 'Packaged Food',
      trueSubcategory: 'Gummies & Candies',
      trueSize: '200 g',
      requiresManualReview: true,
      notes: 'OCR error in brand "H4RIB0" needs fuzzy correction'
    },

    // 46-60: Chocolate (Milka & Ritter Sport)
    {
      rawDesc: 'MILKA ALPENMILCH 100G',
      extractedName: 'Alpenmilch Schokolade',
      extractedBrand: 'Milka',
      size: 100,
      unit: 'g',
      price: 1.29,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Milka',
      trueCategory: 'Packaged Food',
      trueSubcategory: 'Chocolate & Confectionery',
      trueSize: '100 g'
    },
    {
      rawDesc: 'MILKA HAZELNUT 100G',
      extractedName: 'Ganze Haselnüsse',
      extractedBrand: 'Milka',
      size: 100,
      unit: 'g',
      price: 1.29,
      retailer: 'Edeka',
      sourceType: 'Receipt OCR',
      trueBrand: 'Milka',
      trueCategory: 'Packaged Food',
      trueSubcategory: 'Chocolate & Confectionery',
      trueSize: '100 g'
    },
    {
      rawDesc: 'RITT.SP. VOLL-NUSS 100G',
      extractedName: 'Voll-Nuss',
      extractedBrand: 'Ritter Sport',
      size: 100,
      unit: 'g',
      price: 1.49,
      retailer: 'Kaufland',
      sourceType: 'Receipt OCR',
      trueBrand: 'Ritter Sport',
      trueCategory: 'Packaged Food',
      trueSubcategory: 'Chocolate & Confectionery',
      trueSize: '100 g'
    },
    {
      rawDesc: 'RITTER SPORT MARZIPAN 100G',
      extractedName: 'Marzipan Tafelschokolade',
      extractedBrand: 'Ritter Sport',
      size: 100,
      unit: 'g',
      price: 1.49,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Ritter Sport',
      trueCategory: 'Packaged Food',
      trueSubcategory: 'Chocolate & Confectionery',
      trueSize: '100 g'
    },

    // 61-75: Frozen Pizza (Dr. Oetker & Wagner)
    {
      rawDesc: 'DR.OETK. RISTORANTE SALAMI 330G',
      extractedName: 'Pizza Salame',
      extractedBrand: 'Dr. Oetker',
      size: 330,
      unit: 'g',
      price: 3.29,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Dr. Oetker',
      trueCategory: 'Packaged Food',
      trueSubcategory: 'Frozen Pizza & Meals',
      trueSize: '330 g'
    },
    {
      rawDesc: 'Dr. Oetker Ristorante Pizza Margherita 330g knusprig dünner Boden',
      extractedName: 'Pizza Margherita',
      extractedBrand: 'Dr. Oetker',
      size: 330,
      unit: 'g',
      price: 3.29,
      retailer: 'Amazon.de',
      sourceType: 'E-Commerce Catalog',
      trueBrand: 'Dr. Oetker',
      trueCategory: 'Packaged Food',
      trueSubcategory: 'Frozen Pizza & Meals',
      trueSize: '330 g'
    },
    {
      rawDesc: 'WAGNER STEINOFEN SALAMI 320G',
      extractedName: 'Steinofen Salami',
      extractedBrand: 'Wagner',
      size: 320,
      unit: 'g',
      price: 2.99,
      retailer: 'Edeka',
      sourceType: 'Receipt OCR',
      trueBrand: 'Wagner',
      trueCategory: 'Packaged Food',
      trueSubcategory: 'Frozen Pizza & Meals',
      trueSize: '320 g'
    },

    // 76-90: Dairy & Alternatives (Weihenstephan, Alpro, Oatly, Kerrygold)
    {
      rawDesc: 'WEIHENST. H-MILCH 3,5% 1L',
      extractedName: 'H-Milch 3,5% Fett',
      extractedBrand: 'Weihenstephan',
      size: 1.0,
      unit: 'l',
      price: 1.65,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Weihenstephan',
      trueCategory: 'Dairy & Refrigerated',
      trueSubcategory: 'Fresh Milk & Cream',
      trueSize: '1 l'
    },
    {
      rawDesc: 'ALPRO SOJA OHNE ZUCKER 1L',
      extractedName: 'Sojadrink Ungesüßt',
      extractedBrand: 'Alpro',
      size: 1.0,
      unit: 'l',
      price: 2.19,
      retailer: 'Edeka',
      sourceType: 'Receipt OCR',
      trueBrand: 'Alpro',
      trueCategory: 'Dairy & Refrigerated',
      trueSubcategory: 'Plant-Based Alternatives',
      trueSize: '1 l'
    },
    {
      rawDesc: 'OATLY HAFER BARISTA EDITION 1L',
      extractedName: 'Haferdrink Barista',
      extractedBrand: 'Oatly',
      size: 1.0,
      unit: 'l',
      price: 2.49,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Oatly',
      trueCategory: 'Dairy & Refrigerated',
      trueSubcategory: 'Plant-Based Alternatives',
      trueSize: '1 l'
    },
    {
      rawDesc: 'KERRYGOLD ORIGINAL BUTTER 250G',
      extractedName: 'Irische Butter ungesalzen',
      extractedBrand: 'Kerrygold',
      size: 250,
      unit: 'g',
      price: 2.99,
      retailer: 'Kaufland',
      sourceType: 'Receipt OCR',
      trueBrand: 'Kerrygold',
      trueCategory: 'Dairy & Refrigerated',
      trueSubcategory: 'Butter & Spreads',
      trueSize: '250 g'
    },

    // 91-105: Personal Care (Nivea, Balea, Dove, Oral-B)
    {
      rawDesc: 'NIVEA CREME BLAUE DOSE 250ML',
      extractedName: 'Creme Allzweckdose',
      extractedBrand: 'Nivea',
      size: 250,
      unit: 'ml',
      price: 3.45,
      retailer: 'dm-drogerie',
      sourceType: 'Receipt OCR',
      trueBrand: 'Nivea',
      trueCategory: 'Personal Care & Health',
      trueSubcategory: 'Skin & Body Care',
      trueSize: '250 ml'
    },
    {
      rawDesc: 'BALEA CREMEDUSCHE MANDELBLÜTE 300ML',
      extractedName: 'Cremedusche Mandelblüte',
      extractedBrand: 'Balea',
      size: 300,
      unit: 'ml',
      price: 0.75,
      retailer: 'dm-drogerie',
      sourceType: 'Receipt OCR',
      trueBrand: 'Balea',
      trueCategory: 'Personal Care & Health',
      trueSubcategory: 'Bath & Shower',
      trueSize: '300 ml'
    },
    {
      rawDesc: 'ISANA HYDRO BOOSTER SERUM 30ML',
      extractedName: 'Hydro Booster Serum',
      extractedBrand: 'Isana',
      size: 30,
      unit: 'ml',
      price: 3.99,
      retailer: 'Rossmann',
      sourceType: 'Receipt OCR',
      trueBrand: 'Isana',
      trueCategory: 'Personal Care & Health',
      trueSubcategory: 'Bath & Shower',
      trueSize: '30 ml'
    },
    {
      rawDesc: 'COLGATE TOTAL ORIGINAL 75ML',
      extractedName: 'Zahnpasta Total Original',
      extractedBrand: 'Colgate',
      size: 75,
      unit: 'ml',
      price: 2.29,
      retailer: 'Rossmann',
      sourceType: 'Receipt OCR',
      trueBrand: 'Colgate',
      trueCategory: 'Personal Care & Health',
      trueSubcategory: 'Oral Care',
      trueSize: '75 ml'
    },

    // 106-120: Household & Cleaning (Persil, Fairy, Pril, Frosch)
    {
      rawDesc: 'PERSIL COLOR GEL 20WL',
      extractedName: 'Color Kraft-Gel',
      extractedBrand: 'Persil',
      size: 20,
      unit: 'wl',
      price: 6.49,
      retailer: 'dm-drogerie',
      sourceType: 'Receipt OCR',
      trueBrand: 'Persil',
      trueCategory: 'Household & Cleaning',
      trueSubcategory: 'Laundry Detergents',
      trueSize: '20 wl'
    },
    {
      rawDesc: 'PERSIL UNIVERSAL 45WL FLÜSSIG',
      extractedName: 'Universal Gel',
      extractedBrand: 'Persil',
      size: 45,
      unit: 'wl',
      price: 11.99,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Persil',
      trueCategory: 'Household & Cleaning',
      trueSubcategory: 'Laundry Detergents',
      trueSize: '45 wl'
    },
    {
      rawDesc: 'FAIRY ULTRA PLUS CITRUS 450ML',
      extractedName: 'Spülmittel Ultra Plus',
      extractedBrand: 'Fairy',
      size: 450,
      unit: 'ml',
      price: 1.79,
      retailer: 'Edeka',
      sourceType: 'Receipt OCR',
      trueBrand: 'Fairy',
      trueCategory: 'Household & Cleaning',
      trueSubcategory: 'Dishwashing',
      trueSize: '450 ml'
    },
    {
      rawDesc: 'FROSCH CITRO SCHEUERMILCH 500ML',
      extractedName: 'Scheuermilch Citro',
      extractedBrand: 'Frosch',
      size: 500,
      unit: 'ml',
      price: 1.99,
      retailer: 'dm-drogerie',
      sourceType: 'Receipt OCR',
      trueBrand: 'Frosch',
      trueCategory: 'Household & Cleaning',
      trueSubcategory: 'Surface Cleaners',
      trueSize: '500 ml'
    },

    // 121-135: Private Labels (Ja! & Gut & Günstig)
    {
      rawDesc: 'JA! H-MILCH 3,5% 1L',
      extractedName: 'H-Milch 3,5% Fett',
      extractedBrand: 'Ja!',
      size: 1.0,
      unit: 'l',
      price: 0.99,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Ja!',
      trueCategory: 'Dairy & Refrigerated',
      trueSubcategory: 'Fresh Milk & Cream',
      trueSize: '1 l'
    },
    {
      rawDesc: 'JA! APFELSCHORLE 1,5L PET',
      extractedName: 'Apfelschorle 60% Fruchtgehalt',
      extractedBrand: 'Ja!',
      size: 1.5,
      unit: 'l',
      price: 0.65,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Ja!',
      trueCategory: 'Beverages',
      trueSubcategory: 'Soft Drinks & Carbonates',
      trueSize: '1.5 l'
    },
    {
      rawDesc: 'G&G BUTTER 250G DEUTSCHE MARKENBUTTER',
      extractedName: 'Deutsche Markenbutter',
      extractedBrand: 'Gut & Günstig',
      size: 250,
      unit: 'g',
      price: 1.79,
      retailer: 'Edeka',
      sourceType: 'Receipt OCR',
      trueBrand: 'Gut & Günstig',
      trueCategory: 'Dairy & Refrigerated',
      trueSubcategory: 'Butter & Spreads',
      trueSize: '250 g'
    },
    {
      rawDesc: 'G&G REINE BUTTERMILCH 500G',
      extractedName: 'Reine Buttermilch',
      extractedBrand: 'Gut & Günstig',
      size: 500,
      unit: 'g',
      price: 0.69,
      retailer: 'Edeka',
      sourceType: 'Receipt OCR',
      trueBrand: 'Gut & Günstig',
      trueCategory: 'Dairy & Refrigerated',
      trueSubcategory: 'Fresh Milk & Cream',
      trueSize: '500 g'
    },

    // 136-150: Intentional Anomaly & Edge Cases for Data Quality Testing
    {
      rawDesc: 'BIO APFELSCHORLE NATURTRÜB 1L', // Missing brand
      extractedName: 'Apfelschorle Naturtrüb',
      extractedBrand: '', // MISSING BRAND
      size: 1.0,
      unit: 'l',
      price: 1.49,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Ja!', // True brand is Ja! Bio
      trueCategory: 'Beverages',
      trueSubcategory: 'Soft Drinks & Carbonates',
      trueSize: '1 l',
      requiresManualReview: true,
      notes: 'Missing brand in source extract - DQ error'
    },
    {
      rawDesc: 'NIVEA SUN KIDS SCHUTZ & PFLEGE LSF 50+ 200ML',
      extractedName: 'Sun Kids Sonnenspray',
      extractedBrand: 'Nivea',
      size: 200,
      unit: 'ml',
      price: 0.0, // PRICE ANOMALY: €0.00
      retailer: 'Rossmann',
      sourceType: 'Receipt OCR',
      trueBrand: 'Nivea',
      trueCategory: 'Personal Care & Health',
      trueSubcategory: 'Skin & Body Care',
      trueSize: '200 ml',
      requiresManualReview: true,
      notes: 'Price anomaly (€0.00) indicates missing receipt total or scan glitch'
    },
    {
      rawDesc: 'BARILLA SPAGHETTI NO.5 500G',
      extractedName: 'Spaghetti No.5',
      extractedBrand: 'Barilla',
      size: 500,
      unit: 'gramm', // INCONSISTENT UNIT ('gramm' instead of 'g')
      price: 1.89,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Barilla',
      trueCategory: 'Packaged Food',
      trueSubcategory: 'Pasta & Noodles',
      trueSize: '500 g',
      notes: 'Unit inconsistency requires standardization'
    },
    {
      rawDesc: 'ARIEL ALL-IN-1 PODS COLOR 38WL',
      extractedName: 'Pods Color',
      extractedBrand: 'Ariel',
      size: 38,
      unit: 'wl',
      price: 249.99, // OUTLIER PRICE ANOMALY: €249.99
      retailer: 'Edeka',
      sourceType: 'Receipt OCR',
      trueBrand: 'Ariel',
      trueCategory: 'Household & Cleaning',
      trueSubcategory: 'Laundry Detergents',
      trueSize: '38 wl',
      requiresManualReview: true,
      notes: 'Price outlier typo €249.99 vs benchmark €12.99'
    },
    {
      rawDesc: 'KNORR FIX FÜR BOLOGNESE 38G',
      extractedName: 'Fix Spaghetti Bolognese',
      extractedBrand: 'Knorr',
      size: 38,
      unit: 'g',
      price: 0.99,
      retailer: 'Lidl',
      sourceType: 'Receipt OCR',
      trueBrand: 'Knorr',
      trueCategory: 'Packaged Food',
      trueSubcategory: 'Sauces, Seasonings & Fix',
      trueSize: '38 g'
    },
    {
      rawDesc: 'MAGGI FIX FÜR LASAGNE 42G',
      extractedName: 'Fix für Lasagne',
      extractedBrand: 'Maggi',
      size: 42,
      unit: 'g',
      price: 0.99,
      retailer: 'Aldi Süd',
      sourceType: 'Receipt OCR',
      trueBrand: 'Maggi',
      trueCategory: 'Packaged Food',
      trueSubcategory: 'Sauces, Seasonings & Fix',
      trueSize: '42 g'
    },
    {
      rawDesc: 'NUTELLA GLAS 450G',
      extractedName: 'Nuss-Nugat-Creme',
      extractedBrand: 'Nutella',
      size: 450,
      unit: 'g',
      price: 3.29,
      retailer: 'Rewe',
      sourceType: 'Receipt OCR',
      trueBrand: 'Nutella',
      trueCategory: 'Grocery & Fresh Pantry',
      trueSubcategory: 'Sweet Spreads',
      trueSize: '450 g'
    },
    {
      rawDesc: 'SOMAT GOLD TABS 40 STÜCK',
      extractedName: 'Gold Geschirrspültabs',
      extractedBrand: 'Somat',
      size: 40,
      unit: 'tabs',
      price: 8.99,
      retailer: 'dm-drogerie',
      sourceType: 'Receipt OCR',
      trueBrand: 'Somat',
      trueCategory: 'Household & Cleaning',
      trueSubcategory: 'Dishwashing',
      trueSize: '40 tabs'
    }
  ];

  // Systematically generate 312 records using permutation matrix of variations,
  // real store distribution, dates across Q1-Q3 2026, and synthetic metadata.
  let idCounter = 1001;
  const targetCount = 312;
  const loopTimes = Math.ceil(targetCount / baseTemplates.length);

  for (let round = 0; round < loopTimes; round++) {
    for (const t of baseTemplates) {
      if (rawProducts.length >= targetCount) break;

      const recId = `REC-${idCounter}`;
      idCounter++;

      // Distribute variations across rounds
      let desc = t.rawDesc;
      let brand = t.extractedBrand;
      let price = t.price;
      let size = t.size;
      let unit = t.unit;
      let ret = t.retailer;
      let st = t.sourceType;
      let isDup = false;
      let dupGroup = undefined;
      let reqReview = t.requiresManualReview || false;
      let note = t.notes || '';

      if (round === 1) {
        // Round 1: Store variations + slight price shifts
        ret = retailers[(retailers.indexOf(t.retailer) + 2) % retailers.length];
        price = +(price * (0.95 + (idCounter % 10) * 0.01)).toFixed(2);
        // E-Commerce vs scan
        if (idCounter % 3 === 0) {
          st = 'E-Commerce Catalog';
          desc = `${t.trueBrand} ${t.extractedName} - Packung ${t.trueSize} Online Angebot`;
        }
      } else if (round === 2) {
        // Round 2: OCR noise, lowercase, abbreviations
        if (idCounter % 5 === 0) {
          desc = t.rawDesc.toLowerCase().replace('-', ' ').replace(',', '.');
        } else if (idCounter % 7 === 0) {
          // Missing brand edge case
          brand = '';
          reqReview = true;
          note = 'Brand missing on raw input';
        }
      } else if (round >= 3) {
        // Round 3+: Duplicates and multi-buys
        if (idCounter % 6 === 0) {
          isDup = true;
          dupGroup = `DUP-REC-${idCounter - 30}`;
          note = 'Duplicate receipt record across same batch';
        }
      }

      // Format date
      const month = String(1 + ((idCounter % 9))).padStart(2, '0');
      const day = String(1 + ((idCounter % 27))).padStart(2, '0');
      const researchDate = `2026-${month}-${day}`;

      rawProducts.push({
        id: recId,
        rawDescription: desc,
        extractedName: t.extractedName,
        extractedBrand: brand,
        packageSize: size,
        packageUnit: unit,
        priceEur: price,
        retailer: ret,
        sourceType: st,
        sourceReference: st === 'Receipt OCR' ? `RCPT-2026-${idCounter}` : `https://shop.${ret.toLowerCase().replace(/[^a-z]/g, '')}.de/p/${idCounter}`,
        researchDate
      });

      groundTruth.push({
        recordId: recId,
        originalDescription: desc,
        trueBrand: t.trueBrand,
        trueCategory: t.trueCategory,
        trueSubcategory: t.trueSubcategory,
        trueSize: t.trueSize,
        isTrueDuplicate: isDup,
        trueDuplicateGroup: dupGroup,
        requiresManualReview: reqReview,
        notes: note
      });
    }
  }

  return { rawProducts, groundTruth };
}

// Generate the persistent mock database once
export const { rawProducts: INITIAL_RAW_PRODUCTS, groundTruth: GROUND_TRUTH_DATASET } = generateSyntheticProducts();
