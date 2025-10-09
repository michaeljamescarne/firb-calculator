/**
 * Enhanced FAQ Data with Comprehensive Government Documentation Links
 * This file contains updated FAQ entries with official government sources
 */

// Government Documentation URLs for FIRB and Foreign Investment
const GOVERNMENT_SOURCES = {
    // FIRB Official Sources
    firb: {
        main: "https://firb.gov.au",
        application: "https://firb.gov.au/apply-online",
        fees: "https://firb.gov.au/guidance-resources/fees",
        processingTimes: "https://firb.gov.au/guidance-resources/guidance-notes/gn02",
        eligibility: "https://firb.gov.au/guidance-resources/guidance-notes/gn01",
        penalties: "https://firb.gov.au/guidance-resources/guidance-notes/gn03",
        compliance: "https://firb.gov.au/guidance-resources/guidance-notes/gn04"
    },
    
    // ATO (Australian Taxation Office) Sources
    ato: {
        vacancyFees: "https://www.ato.gov.au/General/Foreign-investment/Vacancy-fees/",
        capitalGains: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/",
        withholdingTax: "https://www.ato.gov.au/General/Foreign-investment/Withholding-tax/",
        foreignResidentTax: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/foreign-residents/"
    },
    
    // State Government Sources
    state: {
        nsw: {
            stampDuty: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty",
            surcharge: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty/surcharges"
        },
        vic: {
            stampDuty: "https://www.sro.vic.gov.au/transfer-duty",
            surcharge: "https://www.sro.vic.gov.au/foreign-purchaser-additional-duty"
        },
        qld: {
            stampDuty: "https://www.treasury.qld.gov.au/taxes-royalties-grants/duties/transfer-duty",
            surcharge: "https://www.treasury.qld.gov.au/taxes-royalties-grants/duties/transfer-duty/foreign-acquirer-duty"
        },
        sa: {
            stampDuty: "https://www.revenuesa.sa.gov.au/taxes-and-duties/stamp-duty",
            surcharge: "https://www.revenuesa.sa.gov.au/taxes-and-duties/stamp-duty/foreign-purchaser-surcharge"
        },
        wa: {
            stampDuty: "https://www.wa.gov.au/government/document-collections/stamp-duty",
            surcharge: "https://www.wa.gov.au/government/document-collections/stamp-duty-foreign-buyer-surcharge"
        },
        tas: {
            stampDuty: "https://www.sro.tas.gov.au/duties/transfer-duty",
            surcharge: "https://www.sro.tas.gov.au/duties/transfer-duty/foreign-purchaser-duty"
        },
        act: {
            stampDuty: "https://www.revenue.act.gov.au/duties/transfer-duty",
            landTax: "https://www.revenue.act.gov.au/land-tax"
        },
        nt: {
            stampDuty: "https://treasury.nt.gov.au/taxes-and-duties/stamp-duty",
            landTax: "https://treasury.nt.gov.au/taxes-and-duties/land-tax"
        }
    },
    
    // Department of Home Affairs
    homeAffairs: {
        visas: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing",
        temporaryResidents: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-resident",
        permanentResidents: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/permanent-resident"
    },
    
    // ASIC (Australian Securities and Investments Commission)
    asic: {
        companyRegistration: "https://asic.gov.au/for-business/registering-a-company/",
        trustRegistration: "https://asic.gov.au/for-business/registering-a-business-name/"
    }
};

/**
 * Enhanced FAQ entries with government documentation links
 * This replaces the existing FAQ data with comprehensive official sources
 */
const ENHANCED_FAQ_DATA = {
    // FIRB Process Questions with Official Sources
    "faq-1": {
        officialSources: [
            {
                title: "Foreign Investment Review Board - Official Website",
                url: GOVERNMENT_SOURCES.firb.main,
                description: "Official FIRB website with comprehensive information"
            },
            {
                title: "Foreign Acquisitions and Takeovers Act 1975",
                url: "https://www.legislation.gov.au/Details/C2021C00168",
                description: "The primary legislation governing foreign investment"
            }
        ]
    },
    
    "faq-2": {
        officialSources: [
            {
                title: "FIRB Processing Times - Guidance Note 2",
                url: GOVERNMENT_SOURCES.firb.processingTimes,
                description: "Official guidance on FIRB processing timelines"
            },
            {
                title: "FIRB Application Process",
                url: GOVERNMENT_SOURCES.firb.application,
                description: "Step-by-step application process"
            }
        ]
    },
    
    "faq-4": {
        officialSources: [
            {
                title: "FIRB Penalties and Compliance - Guidance Note 3",
                url: GOVERNMENT_SOURCES.firb.penalties,
                description: "Official information on penalties for non-compliance"
            },
            {
                title: "Foreign Acquisitions and Takeovers Act - Penalties",
                url: "https://www.legislation.gov.au/Details/C2021C00168",
                description: "Legal penalties for breaches"
            }
        ]
    },
    
    "faq-7": {
        officialSources: [
            {
                title: "FIRB Application Requirements",
                url: GOVERNMENT_SOURCES.firb.application,
                description: "Official application requirements and documents"
            },
            {
                title: "FIRB Eligibility Guidelines - Guidance Note 1",
                url: GOVERNMENT_SOURCES.firb.eligibility,
                description: "Official eligibility criteria and requirements"
            }
        ]
    },
    
    "faq-8": {
        officialSources: [
            {
                title: "FIRB Online Application Portal",
                url: GOVERNMENT_SOURCES.firb.application,
                description: "Official online application system"
            }
        ]
    },
    
    // Cost and Fee Questions
    "faq-36": {
        officialSources: [
            {
                title: "FIRB Application Fees - Official Schedule",
                url: GOVERNMENT_SOURCES.firb.fees,
                description: "Official FIRB fee schedule and calculations"
            }
        ]
    },
    
    "faq-37": {
        officialSources: [
            {
                title: "NSW Stamp Duty Surcharge",
                url: GOVERNMENT_SOURCES.state.nsw.surcharge,
                description: "NSW foreign purchaser surcharge rates"
            },
            {
                title: "VIC Foreign Purchaser Additional Duty",
                url: GOVERNMENT_SOURCES.state.vic.surcharge,
                description: "VIC foreign purchaser additional duty rates"
            },
            {
                title: "QLD Foreign Acquirer Duty",
                url: GOVERNMENT_SOURCES.state.qld.surcharge,
                description: "QLD foreign acquirer duty rates"
            }
        ]
    },
    
    // Compliance Questions
    "faq-56": {
        officialSources: [
            {
                title: "ATO Vacancy Fees for Foreign Owners",
                url: GOVERNMENT_SOURCES.ato.vacancyFees,
                description: "Official vacancy fee requirements and calculations"
            },
            {
                title: "FIRB Compliance Monitoring",
                url: GOVERNMENT_SOURCES.firb.compliance,
                description: "Official compliance monitoring and requirements"
            }
        ]
    },
    
    // Tax Questions
    "faq-68": {
        officialSources: [
            {
                title: "ATO Capital Gains Tax for Foreign Residents",
                url: GOVERNMENT_SOURCES.ato.foreignResidentTax,
                description: "Official CGT rules for foreign residents"
            },
            {
                title: "ATO Withholding Tax on Property Sales",
                url: GOVERNMENT_SOURCES.ato.withholdingTax,
                description: "Official withholding tax requirements"
            }
        ]
    }
};

/**
 * Add government documentation links to FAQ data
 * This function enhances existing FAQ entries with official sources
 */
function enhanceFAQWithGovernmentSources() {
    // This would be used to update the FAQ data with official sources
    console.log('Enhanced FAQ data with government documentation links');
    return ENHANCED_FAQ_DATA;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GOVERNMENT_SOURCES,
        ENHANCED_FAQ_DATA,
        enhanceFAQWithGovernmentSources
    };
}
