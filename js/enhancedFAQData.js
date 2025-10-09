/**
 * Enhanced FAQ Data with Government Documentation Links
 * This script updates the FAQ data with comprehensive official sources
 */

// Function to enhance FAQ data with government sources
function enhanceFAQData() {
    const enhancedData = {
        // FAQ-4: What happens if I purchase without FIRB approval?
        "faq-4": {
            officialSources: [
                {
                    title: "FIRB Penalties and Compliance - Guidance Note 3",
                    url: "https://firb.gov.au/guidance-resources/guidance-notes/gn03",
                    description: "Official information on penalties for non-compliance"
                },
                {
                    title: "Foreign Acquisitions and Takeovers Act - Penalties",
                    url: "https://www.legislation.gov.au/Details/C2021C00168",
                    description: "Legal penalties for breaches"
                }
            ]
        },
        
        // FAQ-6: Can FIRB approval be denied?
        "faq-6": {
            officialSources: [
                {
                    title: "FIRB Eligibility Guidelines - Guidance Note 1",
                    url: "https://firb.gov.au/guidance-resources/guidance-notes/gn01",
                    description: "Official eligibility criteria and requirements"
                },
                {
                    title: "FIRB Application Process",
                    url: "https://firb.gov.au/apply-online",
                    description: "Official application process and requirements"
                }
            ]
        },
        
        // FAQ-7: What information do I need for a FIRB application?
        "faq-7": {
            officialSources: [
                {
                    title: "FIRB Application Requirements",
                    url: "https://firb.gov.au/apply-online",
                    description: "Official application requirements and documents"
                },
                {
                    title: "FIRB Eligibility Guidelines - Guidance Note 1",
                    url: "https://firb.gov.au/guidance-resources/guidance-notes/gn01",
                    description: "Official eligibility criteria and requirements"
                }
            ]
        },
        
        // FAQ-21: What is a foreign person under FIRB rules?
        "faq-21": {
            officialSources: [
                {
                    title: "FIRB Foreign Person Definition",
                    url: "https://firb.gov.au/guidance-resources/guidance-notes/gn01",
                    description: "Official definition of foreign person"
                },
                {
                    title: "Foreign Acquisitions and Takeovers Act - Definitions",
                    url: "https://www.legislation.gov.au/Details/C2021C00168",
                    description: "Legal definition of foreign person"
                }
            ]
        },
        
        // FAQ-22: Do Australian permanent residents need FIRB approval?
        "faq-22": {
            officialSources: [
                {
                    title: "FIRB Eligibility Guidelines - Guidance Note 1",
                    url: "https://firb.gov.au/guidance-resources/guidance-notes/gn01",
                    description: "Official eligibility criteria for permanent residents"
                },
                {
                    title: "Department of Home Affairs - Permanent Residency",
                    url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/permanent-resident",
                    description: "Official information on permanent residency"
                }
            ]
        },
        
        // FAQ-36: How much does FIRB approval cost?
        "faq-36": {
            officialSources: [
                {
                    title: "FIRB Application Fees - Official Schedule",
                    url: "https://firb.gov.au/guidance-resources/fees",
                    description: "Official FIRB fee schedule and calculations"
                }
            ]
        },
        
        // FAQ-37: What are stamp duty surcharges?
        "faq-37": {
            officialSources: [
                {
                    title: "NSW Stamp Duty Surcharge",
                    url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty/surcharges",
                    description: "NSW foreign purchaser surcharge rates"
                },
                {
                    title: "VIC Foreign Purchaser Additional Duty",
                    url: "https://www.sro.vic.gov.au/foreign-purchaser-additional-duty",
                    description: "VIC foreign purchaser additional duty rates"
                },
                {
                    title: "QLD Foreign Acquirer Duty",
                    url: "https://www.treasury.qld.gov.au/taxes-royalties-grants/duties/transfer-duty/foreign-acquirer-duty",
                    description: "QLD foreign acquirer duty rates"
                },
                {
                    title: "SA Foreign Purchaser Surcharge",
                    url: "https://www.revenuesa.sa.gov.au/taxes-and-duties/stamp-duty/foreign-purchaser-surcharge",
                    description: "SA foreign purchaser surcharge rates"
                },
                {
                    title: "WA Foreign Buyer Surcharge",
                    url: "https://www.wa.gov.au/government/document-collections/stamp-duty-foreign-buyer-surcharge",
                    description: "WA foreign buyer surcharge rates"
                },
                {
                    title: "TAS Foreign Purchaser Duty",
                    url: "https://www.sro.tas.gov.au/duties/transfer-duty/foreign-purchaser-duty",
                    description: "TAS foreign purchaser duty rates"
                }
            ]
        },
        
        // FAQ-56: What is the vacancy fee?
        "faq-56": {
            officialSources: [
                {
                    title: "ATO Vacancy Fees for Foreign Owners",
                    url: "https://www.ato.gov.au/General/Foreign-investment/Vacancy-fees/",
                    description: "Official vacancy fee requirements and calculations"
                },
                {
                    title: "FIRB Compliance Monitoring",
                    url: "https://firb.gov.au/guidance-resources/guidance-notes/gn04",
                    description: "Official compliance monitoring and requirements"
                }
            ]
        },
        
        // FAQ-68: What taxes apply when I sell?
        "faq-68": {
            officialSources: [
                {
                    title: "ATO Capital Gains Tax for Foreign Residents",
                    url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/foreign-residents/",
                    description: "Official CGT rules for foreign residents"
                },
                {
                    title: "ATO Withholding Tax on Property Sales",
                    url: "https://www.ato.gov.au/General/Foreign-investment/Withholding-tax/",
                    description: "Official withholding tax requirements"
                }
            ]
        },
        
        // FAQ-70: How do I calculate capital gains tax?
        "faq-70": {
            officialSources: [
                {
                    title: "ATO Capital Gains Tax Calculator",
                    url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/",
                    description: "Official CGT calculation tools and rules"
                },
                {
                    title: "ATO Foreign Resident CGT",
                    url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/foreign-residents/",
                    description: "CGT rules specifically for foreign residents"
                }
            ]
        }
    };
    
    return enhancedData;
}

// Function to update FAQ data with government sources
function updateFAQWithGovernmentSources() {
    console.log('Updating FAQ data with government documentation links...');
    
    // This would be used to update the actual FAQ data file
    const enhancedData = enhanceFAQData();
    
    // Log the enhanced data for verification
    console.log('Enhanced FAQ data:', enhancedData);
    
    return enhancedData;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        enhanceFAQData,
        updateFAQWithGovernmentSources
    };
}
