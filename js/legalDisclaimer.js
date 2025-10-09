/**
 * Legal Disclaimer and Accuracy Notice
 * Provides important legal disclaimers and accuracy notices for the FIRB Calculator
 */

/**
 * Legal disclaimer content for the application
 */
const LEGAL_DISCLAIMER = {
    title: "Important Legal Notice",
    content: `
        <div class="legal-disclaimer">
            <div class="disclaimer-header">
                <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <h3 class="disclaimer-title">Legal Disclaimer</h3>
            </div>
            
            <div class="disclaimer-content">
                <p class="disclaimer-text">
                    <strong>This calculator is provided for informational purposes only</strong> and should not be considered as legal, financial, or tax advice. 
                    All calculations are estimates based on current legislation and may not reflect your specific circumstances.
                </p>
                
                <div class="disclaimer-section">
                    <h4 class="section-title">Accuracy & Verification</h4>
                    <ul class="disclaimer-list">
                        <li>Verify all calculations with qualified professionals</li>
                        <li>Check current legislation and fee schedules</li>
                        <li>Consult with legal and tax advisors</li>
                        <li>Confirm eligibility requirements with FIRB</li>
                    </ul>
                </div>
                
                <div class="disclaimer-section">
                    <h4 class="section-title">Professional Advice Required</h4>
                    <p class="disclaimer-text">
                        For all property transactions, we strongly recommend consulting with:
                    </p>
                    <ul class="disclaimer-list">
                        <li><strong>Legal Advisors:</strong> Property law specialists</li>
                        <li><strong>Tax Advisors:</strong> Accountants familiar with foreign investment</li>
                        <li><strong>Financial Advisors:</strong> Mortgage and investment specialists</li>
                        <li><strong>Real Estate Agents:</strong> Property transaction experts</li>
                    </ul>
                </div>
                
                <div class="disclaimer-section">
                    <h4 class="section-title">Official Sources</h4>
                    <p class="disclaimer-text">
                        Always refer to official government websites for current information:
                    </p>
                    <ul class="disclaimer-list">
                        <li><strong>FIRB:</strong> <a href="https://firb.gov.au" target="_blank" rel="noopener">firb.gov.au</a></li>
                        <li><strong>ATO:</strong> <a href="https://www.ato.gov.au" target="_blank" rel="noopener">ato.gov.au</a></li>
                        <li><strong>State Revenue Offices:</strong> Check your state's official website</li>
                    </ul>
                </div>
                
                <div class="disclaimer-section">
                    <h4 class="section-title">Liability Limitation</h4>
                    <p class="disclaimer-text">
                        The developers of this calculator:
                    </p>
                    <ul class="disclaimer-list">
                        <li>Accept no responsibility for decisions made based on calculations</li>
                        <li>Recommend professional advice for all property transactions</li>
                        <li>Encourage verification of all information with official sources</li>
                        <li>Provide this tool as a starting point for further research</li>
                    </ul>
                </div>
                
                <div class="disclaimer-footer">
                    <p class="footer-text">
                        <strong>Last Updated:</strong> January 2025 | 
                        <strong>Next Review:</strong> March 2025
                    </p>
                    <p class="footer-text">
                        This calculator is not affiliated with or endorsed by the Australian Government, FIRB, ATO, or any state government.
                    </p>
                </div>
            </div>
        </div>
    `,
    
    // Short version for modals and alerts
    short: `
        <div class="legal-notice-short">
            <p><strong>Disclaimer:</strong> This calculator provides estimates only. Always verify with qualified professionals and official government sources.</p>
        </div>
    `,
    
    // Footer version
    footer: `
        <div class="legal-footer">
            <p>This calculator is for informational purposes only. Always consult qualified professionals and verify with official government sources.</p>
        </div>
    `
};

/**
 * Accuracy notice for calculations
 */
const ACCURACY_NOTICE = {
    title: "Calculation Accuracy Notice",
    content: `
        <div class="accuracy-notice">
            <div class="notice-header">
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h4 class="notice-title">Calculation Accuracy</h4>
            </div>
            
            <div class="notice-content">
                <p class="notice-text">
                    All calculations are based on current legislation and fee schedules as of January 2025. 
                    Fees and requirements may change without notice.
                </p>
                
                <div class="accuracy-items">
                    <div class="accuracy-item">
                        <span class="item-label">FIRB Fees:</span>
                        <span class="item-status">Current as of 2024-25</span>
                    </div>
                    <div class="accuracy-item">
                        <span class="item-label">Stamp Duty Surcharges:</span>
                        <span class="item-status">Verified with state revenue offices</span>
                    </div>
                    <div class="accuracy-item">
                        <span class="item-label">Land Tax Surcharges:</span>
                        <span class="item-status">Annual rates as of 2024-25</span>
                    </div>
                    <div class="accuracy-item">
                        <span class="item-label">Legal & Conveyancing:</span>
                        <span class="item-status">Market estimates only</span>
                    </div>
                </div>
                
                <p class="notice-text">
                    <strong>Important:</strong> Always verify current fees and requirements with official government sources before making any decisions.
                </p>
            </div>
        </div>
    `
};

/**
 * Render legal disclaimer
 * @param {string} type - Type of disclaimer ('full', 'short', 'footer')
 * @returns {string} HTML string for disclaimer
 */
function renderLegalDisclaimer(type = 'full') {
    switch (type) {
        case 'short':
            return LEGAL_DISCLAIMER.short;
        case 'footer':
            return LEGAL_DISCLAIMER.footer;
        default:
            return LEGAL_DISCLAIMER.content;
    }
}

/**
 * Render accuracy notice
 * @returns {string} HTML string for accuracy notice
 */
function renderAccuracyNotice() {
    return ACCURACY_NOTICE.content;
}

/**
 * Add legal disclaimer styles
 */
function addLegalDisclaimerStyles() {
    if (document.getElementById('legal-disclaimer-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'legal-disclaimer-styles';
    style.textContent = `
        /* Legal Disclaimer Styles */
        .legal-disclaimer {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin: 1rem 0;
        }
        
        .disclaimer-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }
        
        .disclaimer-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: #92400e;
            margin: 0;
        }
        
        .disclaimer-content {
            color: #92400e;
        }
        
        .disclaimer-text {
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        
        .disclaimer-section {
            margin-bottom: 1.25rem;
        }
        
        .section-title {
            font-size: 1rem;
            font-weight: 600;
            color: #92400e;
            margin-bottom: 0.5rem;
        }
        
        .disclaimer-list {
            margin: 0.5rem 0;
            padding-left: 1.25rem;
        }
        
        .disclaimer-list li {
            margin-bottom: 0.25rem;
            line-height: 1.5;
        }
        
        .disclaimer-list a {
            color: #92400e;
            text-decoration: underline;
        }
        
        .disclaimer-list a:hover {
            color: #78350f;
        }
        
        .disclaimer-footer {
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid #f59e0b;
        }
        
        .footer-text {
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
            color: #92400e;
        }
        
        /* Short Legal Notice */
        .legal-notice-short {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 0.5rem;
            padding: 0.75rem;
            margin: 0.5rem 0;
            font-size: 0.875rem;
            color: #92400e;
        }
        
        /* Legal Footer */
        .legal-footer {
            background: #f3f4f6;
            border-top: 1px solid #e5e7eb;
            padding: 1rem;
            margin-top: 2rem;
            text-align: center;
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        /* Accuracy Notice Styles */
        .accuracy-notice {
            background: #eff6ff;
            border: 1px solid #3b82f6;
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin: 1rem 0;
        }
        
        .notice-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }
        
        .notice-title {
            font-size: 1rem;
            font-weight: 600;
            color: #1e40af;
            margin: 0;
        }
        
        .notice-content {
            color: #1e40af;
        }
        
        .notice-text {
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        
        .accuracy-items {
            margin: 1rem 0;
        }
        
        .accuracy-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #dbeafe;
        }
        
        .accuracy-item:last-child {
            border-bottom: none;
        }
        
        .item-label {
            font-weight: 500;
            color: #1e40af;
        }
        
        .item-status {
            font-size: 0.875rem;
            color: #3b82f6;
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
            .legal-disclaimer,
            .accuracy-notice {
                padding: 1rem;
                margin: 0.5rem 0;
            }
            
            .disclaimer-title,
            .notice-title {
                font-size: 1rem;
            }
            
            .accuracy-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.25rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize styles when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addLegalDisclaimerStyles);
} else {
    addLegalDisclaimerStyles();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LEGAL_DISCLAIMER,
        ACCURACY_NOTICE,
        renderLegalDisclaimer,
        renderAccuracyNotice
    };
}
