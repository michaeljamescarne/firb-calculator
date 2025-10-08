/**
 * FIRB Calculator - Official Data Rates (2024-25)
 * @file dataRates2024_25.js
 *
 * Last Updated: January 2025
 * Financial Year: 2024-25
 *
 * Sources:
 * - FIRB: https://firb.gov.au/guidance-resources/guidance-notes/gn12
 * - NSW: https://www.revenue.nsw.gov.au/
 * - VIC: https://www.sro.vic.gov.au/
 * - QLD: https://www.qld.gov.au/housing/buying-owning-home
 * - SA: https://www.revenuesa.sa.gov.au/
 * - WA: https://www.wa.gov.au/organisation/department-of-finance
 * - TAS: https://www.sro.tas.gov.au/
 * - ACT: https://www.revenue.act.gov.au/
 * - NT: https://nt.gov.au/
 */

/**
 * Data version and last updated timestamp
 */
const DATA_VERSION = {
    version: '2024-25',
    lastUpdated: '2025-01-15',
    financialYear: '2024-25',
    nextReview: '2025-07-01' // Next financial year
};

/**
 * FIRB Application Fees (2024-25)
 * Source: FIRB Guidance Note 12
 * Last Verified: January 2025
 *
 * Note: Fees indexed annually (typically July 1)
 */
const FIRB_FEES_2024_25 = {
    // Individual residential property fees
    individual: {
        // Tier 1: Under $1M
        tier1: {
            threshold: 1000000,
            fee: 13200
        },
        // Tier 2: $1M - $1,999,999
        tier2: {
            threshold: 2000000,
            fee: 26400
        },
        // Tier 3: $2M - $2,999,999
        tier3: {
            threshold: 3000000,
            fee: 39600
        },
        // Tier 4: $3M - $4,999,999
        tier4: {
            threshold: 5000000,
            fee: 132000
        },
        // Tier 5: $5M - $9,999,999
        tier5: {
            threshold: 10000000,
            fee: 132000
        },
        // Tier 6: $10M+
        tier6: {
            threshold: Infinity,
            fee: 132000
        }
    },

    // Company/Trust fees (significantly higher)
    company: {
        tier1: { threshold: 1000000, fee: 26400 },
        tier2: { threshold: 2000000, fee: 52800 },
        tier3: { threshold: 3000000, fee: 79200 },
        tier4: { threshold: 5000000, fee: 105600 },
        tier5: { threshold: 10000000, fee: 158400 },
        tier6: { threshold: Infinity, fee: 211200 }
    },

    // Vacant land fees (lower than established dwellings)
    vacantLand: {
        under1M: 6600,
        from1Mto2M: 13200,
        from2Mto3M: 26400,
        over3M: 132000
    },

    // Annual vacancy fee (if property vacant >6 months/year)
    vacancyFee: {
        base: 13200, // Per year
        indexed: true
    },

    // Sources and notes
    sources: [
        'https://firb.gov.au/guidance-resources/guidance-notes/gn12',
        'Fees indexed annually on 1 July'
    ]
};

/**
 * State Stamp Duty Surcharges for Foreign Buyers (2024-25)
 * Additional to standard stamp duty
 */
const STAMP_DUTY_SURCHARGES_2024_25 = {
    NSW: {
        rate: 0.08, // 8%
        description: 'Foreign Purchaser Additional Duty',
        source: 'https://www.revenue.nsw.gov.au/',
        lastUpdated: '2024-07-01'
    },
    VIC: {
        rate: 0.08, // 8%
        description: 'Additional Duty for Foreign Purchasers',
        source: 'https://www.sro.vic.gov.au/',
        lastUpdated: '2024-07-01'
    },
    QLD: {
        rate: 0.08, // 8%
        description: 'Additional Foreign Acquirer Duty',
        source: 'https://www.qld.gov.au/housing',
        lastUpdated: '2024-07-01'
    },
    WA: {
        rate: 0.07, // 7%
        description: 'Foreign Buyer Duty Surcharge',
        source: 'https://www.wa.gov.au/',
        lastUpdated: '2024-07-01'
    },
    SA: {
        rate: 0.07, // 7%
        description: 'Foreign Investor Duty Surcharge',
        source: 'https://www.revenuesa.sa.gov.au/',
        lastUpdated: '2024-07-01'
    },
    TAS: {
        rate: 0.08, // 8%
        description: 'Foreign Investor Duty Surcharge',
        source: 'https://www.sro.tas.gov.au/',
        lastUpdated: '2024-07-01'
    },
    ACT: {
        rate: 0.04, // 4%
        description: 'Foreign Investor Duty Surcharge',
        source: 'https://www.revenue.act.gov.au/',
        lastUpdated: '2024-07-01'
    },
    NT: {
        rate: 0.00, // 0% - No foreign buyer surcharge!
        description: 'No Foreign Buyer Surcharge',
        source: 'https://nt.gov.au/',
        lastUpdated: '2024-07-01',
        note: 'Competitive advantage for NT'
    }
};

/**
 * Land Tax Surcharges for Foreign Owners (2024-25)
 * Annual charge on top of standard land tax
 */
const LAND_TAX_SURCHARGES_2024_25 = {
    NSW: {
        rate: 0.04, // 4%
        threshold: 1075000, // Tax-free threshold
        description: 'Foreign Owner Surcharge',
        source: 'https://www.revenue.nsw.gov.au/',
        lastUpdated: '2024-07-01'
    },
    VIC: {
        rate: 0.04, // 4%
        threshold: 50000, // Very low threshold
        description: 'Absentee Owner Surcharge',
        source: 'https://www.sro.vic.gov.au/',
        lastUpdated: '2024-07-01'
    },
    QLD: {
        rate: 0.02, // 2%
        threshold: 350000,
        description: 'Foreign Owner Surcharge',
        source: 'https://www.qld.gov.au/',
        lastUpdated: '2024-07-01'
    },
    WA: {
        rate: 0.04, // 4%
        threshold: 300000,
        description: 'Foreign Owner Surcharge',
        source: 'https://www.wa.gov.au/',
        lastUpdated: '2024-07-01'
    },
    SA: {
        rate: 0.04, // 4%
        threshold: 450000,
        description: 'Foreign Owner Surcharge',
        source: 'https://www.revenuesa.sa.gov.au/',
        lastUpdated: '2024-07-01'
    },
    TAS: {
        rate: 0.015, // 1.5%
        threshold: 25000,
        description: 'Foreign Investor Land Tax Surcharge',
        source: 'https://www.sro.tas.gov.au/',
        lastUpdated: '2024-07-01'
    },
    ACT: {
        rate: 0.0075, // 0.75%
        threshold: 0, // No threshold - applies to all
        description: 'Foreign Owner Surcharge',
        source: 'https://www.revenue.act.gov.au/',
        lastUpdated: '2024-07-01'
    },
    NT: {
        rate: 0.00, // 0% - No land tax surcharge!
        threshold: 0,
        description: 'No Foreign Owner Surcharge',
        source: 'https://nt.gov.au/',
        lastUpdated: '2024-07-01'
    }
};

/**
 * Standard Transfer Duty (Stamp Duty) Brackets
 * Paid by ALL buyers (foreign and domestic)
 * Progressive tax brackets
 */
const TRANSFER_DUTY_BRACKETS_2024_25 = {
    NSW: {
        brackets: [
            { min: 0, max: 16000, rate: 0.0125, base: 0 },
            { min: 16000, max: 35000, rate: 0.015, base: 200 },
            { min: 35000, max: 93000, rate: 0.0175, base: 485 },
            { min: 93000, max: 351000, rate: 0.035, base: 1500 },
            { min: 351000, max: 1168000, rate: 0.045, base: 10525 },
            { min: 1168000, max: Infinity, rate: 0.055, base: 47290 }
        ],
        source: 'https://www.revenue.nsw.gov.au/',
        lastUpdated: '2024-07-01'
    },
    VIC: {
        brackets: [
            { min: 0, max: 25000, rate: 0.014, base: 0 },
            { min: 25000, max: 130000, rate: 0.024, base: 350 },
            { min: 130000, max: 960000, rate: 0.05, base: 2870 },
            { min: 960000, max: Infinity, rate: 0.06, base: 44370 }
        ],
        source: 'https://www.sro.vic.gov.au/',
        lastUpdated: '2024-07-01'
    },
    QLD: {
        brackets: [
            { min: 0, max: 5000, rate: 0, base: 0 },
            { min: 5000, max: 75000, rate: 0.015, base: 0 },
            { min: 75000, max: 540000, rate: 0.035, base: 1050 },
            { min: 540000, max: 1000000, rate: 0.045, base: 17325 },
            { min: 1000000, max: Infinity, rate: 0.0575, base: 38025 }
        ],
        source: 'https://www.qld.gov.au/',
        lastUpdated: '2024-07-01'
    },
    WA: {
        brackets: [
            { min: 0, max: 120000, rate: 0.019, base: 0 },
            { min: 120000, max: 150000, rate: 0.029, base: 2280 },
            { min: 150000, max: 360000, rate: 0.038, base: 3150 },
            { min: 360000, max: 725000, rate: 0.04, base: 11130 },
            { min: 725000, max: Infinity, rate: 0.05, base: 25730 }
        ],
        source: 'https://www.wa.gov.au/',
        lastUpdated: '2024-07-01'
    },
    SA: {
        brackets: [
            { min: 0, max: 12000, rate: 0.01, base: 0 },
            { min: 12000, max: 30000, rate: 0.02, base: 120 },
            { min: 30000, max: 50000, rate: 0.03, base: 480 },
            { min: 50000, max: 100000, rate: 0.035, base: 1080 },
            { min: 100000, max: 200000, rate: 0.04, base: 2830 },
            { min: 200000, max: 250000, rate: 0.0425, base: 6830 },
            { min: 250000, max: 300000, rate: 0.045, base: 8955 },
            { min: 300000, max: 500000, rate: 0.0475, base: 11205 },
            { min: 500000, max: Infinity, rate: 0.055, base: 20705 }
        ],
        source: 'https://www.revenuesa.sa.gov.au/',
        lastUpdated: '2024-07-01'
    },
    TAS: {
        brackets: [
            { min: 0, max: 3000, rate: 0.005, base: 0 },
            { min: 3000, max: 25000, rate: 0.0175, base: 15 },
            { min: 25000, max: 75000, rate: 0.025, base: 400 },
            { min: 75000, max: 200000, rate: 0.035, base: 1650 },
            { min: 200000, max: 375000, rate: 0.04, base: 6025 },
            { min: 375000, max: 725000, rate: 0.0425, base: 13025 },
            { min: 725000, max: Infinity, rate: 0.045, base: 27900 }
        ],
        source: 'https://www.sro.tas.gov.au/',
        lastUpdated: '2024-07-01'
    },
    ACT: {
        brackets: [
            { min: 0, max: 200000, rate: 0.0218, base: 0 },
            { min: 200000, max: 300000, rate: 0.0332, base: 4360 },
            { min: 300000, max: 500000, rate: 0.0446, base: 7680 },
            { min: 500000, max: 750000, rate: 0.0555, base: 16600 },
            { min: 750000, max: 1000000, rate: 0.06, base: 30475 },
            { min: 1000000, max: 1455000, rate: 0.065, base: 45475 },
            { min: 1455000, max: Infinity, rate: 0.067, base: 75050 }
        ],
        source: 'https://www.revenue.act.gov.au/',
        lastUpdated: '2024-07-01'
    },
    NT: {
        brackets: [
            { min: 0, max: 525000, rate: 0.0665, base: 0 },
            { min: 525000, max: 3000000, rate: 0.0495, base: 34913 },
            { min: 3000000, max: 5000000, rate: 0.0575, base: 157388 },
            { min: 5000000, max: Infinity, rate: 0.0595, base: 272388 }
        ],
        source: 'https://nt.gov.au/',
        lastUpdated: '2024-07-01'
    }
};

/**
 * Capital Gains Tax (CGT) Information for Foreign Residents
 */
const CAPITAL_GAINS_TAX_2024_25 = {
    withholdingRate: 0.125, // 12.5% withholding on sale proceeds

    // CGT rates for foreign residents (same as income tax rates)
    marginalRates: [
        { min: 0, max: 18200, rate: 0 },
        { min: 18200, max: 45000, rate: 0.19 },
        { min: 45000, max: 120000, rate: 0.325 },
        { min: 120000, max: 180000, rate: 0.37 },
        { min: 180000, max: Infinity, rate: 0.45 }
    ],

    // No 50% CGT discount for foreign residents
    discount: 0, // 0% (domestic residents get 50% if held >12 months)

    clearanceCertificate: {
        required: true,
        threshold: 750000, // Required if property value >= $750,000
        description: 'Foreign Resident Capital Gains Withholding'
    },

    sources: [
        'https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax',
        'https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/foreign-resident-capital-gains-withholding'
    ],

    lastUpdated: '2024-07-01'
};

/**
 * Council Rates Estimates by Major City/Region
 * Annual estimates (varies significantly by council)
 */
const COUNCIL_RATES_ESTIMATES_2024_25 = {
    Sydney: { min: 1500, max: 3500, average: 2400 },
    Melbourne: { min: 1400, max: 3200, average: 2200 },
    Brisbane: { min: 1300, max: 2800, average: 1900 },
    Perth: { min: 1200, max: 2600, average: 1800 },
    Adelaide: { min: 1100, max: 2400, average: 1600 },
    Hobart: { min: 1000, max: 2200, average: 1500 },
    Canberra: { min: 1400, max: 2800, average: 2000 },
    Darwin: { min: 1000, max: 2000, average: 1400 },

    regional: { min: 800, max: 1800, average: 1200 },

    note: 'Rates vary significantly by property value, land size, and council area',
    source: 'Various council websites',
    lastUpdated: '2024-07-01'
};

/**
 * Body Corporate / Strata Fees Estimates
 * Quarterly estimates for apartments/units
 */
const BODY_CORPORATE_FEES_2024_25 = {
    // Low-rise apartments (2-4 stories, minimal facilities)
    lowRise: {
        quarterly: { min: 500, max: 1200, average: 800 },
        annual: { min: 2000, max: 4800, average: 3200 }
    },

    // Mid-rise apartments (5-15 stories, gym, pool)
    midRise: {
        quarterly: { min: 1000, max: 2500, average: 1600 },
        annual: { min: 4000, max: 10000, average: 6400 }
    },

    // High-rise apartments (16+ stories, concierge, facilities)
    highRise: {
        quarterly: { min: 2000, max: 5000, average: 3200 },
        annual: { min: 8000, max: 20000, average: 12800 }
    },

    // Townhouses (minimal common property)
    townhouse: {
        quarterly: { min: 300, max: 800, average: 500 },
        annual: { min: 1200, max: 3200, average: 2000 }
    },

    note: 'Fees depend on building facilities, age, and size',
    lastUpdated: '2024-07-01'
};

/**
 * Get human-readable last updated string
 */
function getLastUpdatedString() {
    const date = new Date(DATA_VERSION.lastUpdated);
    return date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Get days since last update
 */
function getDaysSinceUpdate() {
    const lastUpdate = new Date(DATA_VERSION.lastUpdated);
    const now = new Date();
    const diffTime = Math.abs(now - lastUpdate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Check if data needs review (older than 6 months)
 */
function needsReview() {
    return getDaysSinceUpdate() > 180;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DATA_VERSION,
        FIRB_FEES_2024_25,
        STAMP_DUTY_SURCHARGES_2024_25,
        LAND_TAX_SURCHARGES_2024_25,
        TRANSFER_DUTY_BRACKETS_2024_25,
        CAPITAL_GAINS_TAX_2024_25,
        COUNCIL_RATES_ESTIMATES_2024_25,
        BODY_CORPORATE_FEES_2024_25,
        getLastUpdatedString,
        getDaysSinceUpdate,
        needsReview
    };
}
