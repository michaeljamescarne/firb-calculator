/**
 * Enhanced Structured Data for AI Search Optimization
 * Provides comprehensive Schema.org markup for better AI understanding
 */

/**
 * Generate comprehensive structured data for the application
 * @returns {string} HTML string with structured data scripts
 */
function generateEnhancedStructuredData() {
    const structuredData = {
        // WebApplication Schema
        webApplication: {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "FIRB Calculator",
            "alternateName": "Foreign Investment Review Board Calculator",
            "description": "Free online calculator for foreign investment property costs in Australia including FIRB fees, stamp duty surcharges, and total investment analysis.",
            "url": "https://michaeljamescarne.github.io/firb-calculator/",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web Browser",
            "browserRequirements": "Requires JavaScript. Requires HTML5.",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "AUD",
                "availability": "https://schema.org/InStock"
            },
            "creator": {
                "@type": "Organization",
                "name": "FIRB Calculator",
                "url": "https://michaeljamescarne.github.io/firb-calculator/"
            },
            "featureList": [
                "FIRB Fee Calculator",
                "Stamp Duty Surcharge Calculator", 
                "State-by-State Comparison",
                "Investment Analysis",
                "Document Checklist",
                "Timeline Guide",
                "Comprehensive FAQ",
                "Mobile Optimized",
                "PWA Support"
            ],
            "screenshot": "https://michaeljamescarne.github.io/firb-calculator/screenshots/home.png",
            "softwareVersion": "2.0",
            "datePublished": "2024-01-01",
            "dateModified": "2025-01-01",
            "inLanguage": "en-AU",
            "audience": {
                "@type": "Audience",
                "audienceType": "Foreign Property Investors"
            }
        },

        // FAQPage Schema (Enhanced)
        faqPage: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": generateFAQStructuredData()
        },

        // HowTo Schema for Calculator Process
        howTo: {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Calculate FIRB Fees and Foreign Property Investment Costs",
            "description": "Step-by-step guide to calculate foreign investment property costs in Australia",
            "image": "https://michaeljamescarne.github.io/firb-calculator/screenshots/home.png",
            "totalTime": "PT5M",
            "supply": [
                {
                    "@type": "HowToSupply",
                    "name": "Property Value"
                },
                {
                    "@type": "HowToSupply", 
                    "name": "Citizenship Status"
                },
                {
                    "@type": "HowToSupply",
                    "name": "Property Type"
                },
                {
                    "@type": "HowToSupply",
                    "name": "State/Territory"
                }
            ],
            "tool": [
                {
                    "@type": "HowToTool",
                    "name": "FIRB Calculator"
                }
            ],
            "step": [
                {
                    "@type": "HowToStep",
                    "name": "Determine Eligibility",
                    "text": "Check if you need FIRB approval based on your citizenship status and visa type",
                    "url": "https://michaeljamescarne.github.io/firb-calculator/?step=eligibility"
                },
                {
                    "@type": "HowToStep",
                    "name": "Enter Property Details",
                    "text": "Input property value, type, and location details",
                    "url": "https://michaeljamescarne.github.io/firb-calculator/?step=calculator"
                },
                {
                    "@type": "HowToStep",
                    "name": "Calculate Costs",
                    "text": "Review FIRB fees, stamp duty surcharges, and total costs",
                    "url": "https://michaeljamescarne.github.io/firb-calculator/?step=results"
                },
                {
                    "@type": "HowToStep",
                    "name": "Analyze Investment",
                    "text": "Review investment analysis and state comparison",
                    "url": "https://michaeljamescarne.github.io/firb-calculator/?step=investment"
                }
            ]
        },

        // Article Schema for Educational Content
        article: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Complete Guide to Foreign Investment Property Costs in Australia",
            "description": "Comprehensive guide covering FIRB fees, stamp duty surcharges, and total costs for foreign property investment in Australia.",
            "author": {
                "@type": "Organization",
                "name": "FIRB Calculator"
            },
            "publisher": {
                "@type": "Organization",
                "name": "FIRB Calculator",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://michaeljamescarne.github.io/firb-calculator/icons/icon-192x192.png"
                }
            },
            "datePublished": "2024-01-01",
            "dateModified": "2025-01-01",
            "mainEntityOfPage": "https://michaeljamescarne.github.io/firb-calculator/",
            "image": "https://michaeljamescarne.github.io/firb-calculator/screenshots/home.png",
            "articleSection": "Finance",
            "keywords": "FIRB, foreign investment, Australia, property, calculator, fees, stamp duty"
        },

        // BreadcrumbList Schema
        breadcrumbList: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://michaeljamescarne.github.io/firb-calculator/"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Calculator",
                    "item": "https://michaeljamescarne.github.io/firb-calculator/?step=calculator"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "FAQ",
                    "item": "https://michaeljamescarne.github.io/firb-calculator/?step=faq"
                }
            ]
        },

        // Organization Schema
        organization: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FIRB Calculator",
            "url": "https://michaeljamescarne.github.io/firb-calculator/",
            "logo": "https://michaeljamescarne.github.io/firb-calculator/icons/icon-192x192.png",
            "description": "Free online calculator for foreign investment property costs in Australia",
            "foundingDate": "2024-01-01",
            "areaServed": {
                "@type": "Country",
                "name": "Australia"
            },
            "serviceType": "Financial Calculator",
            "knowsAbout": [
                "Foreign Investment Review Board",
                "FIRB Fees",
                "Stamp Duty Surcharges",
                "Property Investment",
                "Australian Real Estate"
            ]
        }
    };

    // Generate HTML with all structured data
    return Object.values(structuredData).map(data => 
        `<script type="application/ld+json">${JSON.stringify(data, null, 2)}</script>`
    ).join('\n');
}

/**
 * Generate FAQ structured data from FAQ data
 * @returns {Array} Array of FAQ structured data objects
 */
function generateFAQStructuredData() {
    if (!window.faqData) return [];

    const allQuestions = [];
    window.faqData.categories.forEach(category => {
        category.questions.forEach(question => {
            allQuestions.push({
                "@type": "Question",
                "name": question.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": question.answer,
                    "author": {
                        "@type": "Organization",
                        "name": "FIRB Calculator"
                    }
                },
                "keywords": question.keywords ? question.keywords.join(', ') : '',
                "dateCreated": "2024-01-01",
                "dateModified": "2025-01-01"
            });
        });
    });

    return allQuestions;
}

/**
 * Generate AI-optimized content structure
 * @returns {string} HTML string with AI-friendly content structure
 */
function generateAIOptimizedContent() {
    return `
        <!-- AI Search Optimization -->
        <div class="ai-content-structure" style="display: none;">
            <!-- Entity Definitions -->
            <div data-entity="FIRB">
                <span data-definition="Foreign Investment Review Board">FIRB</span>
                <span data-synonyms="Foreign Investment Review Board, Australian foreign investment regulator">Foreign Investment Review Board</span>
            </div>
            
            <div data-entity="Stamp Duty Surcharge">
                <span data-definition="Additional tax on foreign property buyers">Stamp Duty Surcharge</span>
                <span data-synonyms="Foreign buyer surcharge, additional stamp duty, foreign purchaser duty">Foreign Buyer Surcharge</span>
            </div>
            
            <div data-entity="Land Tax Surcharge">
                <span data-definition="Annual tax on foreign property owners">Land Tax Surcharge</span>
                <span data-synonyms="Foreign land tax, annual surcharge, foreign owner tax">Foreign Land Tax</span>
            </div>
            
            <!-- Contextual Information -->
            <div data-context="Foreign Investment">
                <span data-topic="Eligibility">Who needs FIRB approval</span>
                <span data-topic="Costs">Total investment costs</span>
                <span data-topic="Process">Application process</span>
                <span data-topic="Compliance">Legal requirements</span>
            </div>
            
            <!-- Answer Templates -->
            <div data-answer-template="Cost Calculation">
                <span data-question="How much does FIRB approval cost?">FIRB fees range from $13,200 to $243,400+ depending on property value</span>
                <span data-question="What are the total costs?">Total costs include FIRB fees, stamp duty surcharges, and other fees</span>
            </div>
        </div>
    `;
}

/**
 * Generate voice search optimized content
 * @returns {string} HTML string with voice search optimization
 */
function generateVoiceSearchOptimization() {
    return `
        <!-- Voice Search Optimization -->
        <div class="voice-search-content" style="display: none;">
            <!-- Conversational Questions -->
            <div data-voice-query="What are the costs for foreign property investment in Australia?">
                <span data-answer="Foreign property investment costs include FIRB fees, stamp duty surcharges, and other fees. Use our calculator to get exact costs.</span>
            </div>
            
            <div data-voice-query="Do I need FIRB approval for property investment?">
                <span data-answer="Foreign persons need FIRB approval before purchasing residential property in Australia. Check your eligibility with our wizard.</span>
            </div>
            
            <div data-voice-query="How much is stamp duty for foreign buyers?">
                <span data-answer="Foreign buyers pay additional stamp duty surcharges of 7-8% depending on the state. This is on top of standard stamp duty.</span>
            </div>
            
            <!-- Natural Language Responses -->
            <div data-natural-response="Cost Breakdown">
                <span data-context="Total costs for foreign property investment include FIRB application fees ranging from $13,200 to $243,400, stamp duty surcharges of 7-8%, land tax surcharges, and other associated costs.</span>
            </div>
        </div>
    `;
}

/**
 * Initialize structured data when DOM is ready
 */
function initializeStructuredData() {
    // Add structured data to head
    const structuredDataHTML = generateEnhancedStructuredData();
    const aiContentHTML = generateAIOptimizedContent();
    const voiceSearchHTML = generateVoiceSearchOptimization();
    
    // Insert into head
    document.head.insertAdjacentHTML('beforeend', structuredDataHTML);
    
    // Insert AI optimization content
    document.body.insertAdjacentHTML('beforeend', aiContentHTML);
    document.body.insertAdjacentHTML('beforeend', voiceSearchHTML);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStructuredData);
} else {
    initializeStructuredData();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateEnhancedStructuredData,
        generateFAQStructuredData,
        generateAIOptimizedContent,
        generateVoiceSearchOptimization
    };
}
