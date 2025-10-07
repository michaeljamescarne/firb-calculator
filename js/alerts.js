/**
 * Intelligent Alerts System for FIRB Calculator
 * Provides contextual warnings, information, and savings opportunities
 * @file alerts.js
 */

/**
 * Alert types and their styling
 */
const ALERT_TYPES = {
    WARNING: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: '⚠️',
        iconColor: 'text-red-600',
        textColor: 'text-red-900',
        titleColor: 'text-red-900'
    },
    INFO: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'ℹ️',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-900',
        titleColor: 'text-blue-900'
    },
    SUCCESS: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: '💡',
        iconColor: 'text-green-600',
        textColor: 'text-green-900',
        titleColor: 'text-green-900'
    },
    PENALTY: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: '⚖️',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-900',
        titleColor: 'text-orange-900'
    }
};

/**
 * Calculate FIRB application deadline based on expected settlement date
 * FIRB typically takes 30 days, recommend applying 60 days before settlement
 * @returns {Object} Deadline information
 */
function calculateFIRBDeadline() {
    const today = new Date();
    const recommendedDate = new Date(today);
    recommendedDate.setDate(today.getDate() + 60); // 60 days from now for typical 90-day settlement

    const urgentDate = new Date(today);
    urgentDate.setDate(today.getDate() + 30); // 30 days from now

    return {
        recommended: recommendedDate.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' }),
        urgent: urgentDate.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' }),
        daysFromNow: 60
    };
}

/**
 * Generate alerts based on eligibility data (for eligibility result page)
 * @returns {Array} Array of alert objects
 */
function generateEligibilityAlerts() {
    const alerts = [];
    const { citizenship, residency, purposeOfPurchase } = state.eligibilityData;

    // WARNING: Non-resident restrictions
    if (citizenship === 'foreign' && residency === 'notResident') {
        alerts.push({
            type: 'WARNING',
            title: 'Property Type Restrictions Apply',
            message: 'As a foreign non-resident, you can ONLY purchase new dwellings or vacant land for development. Established dwellings are NOT permitted.',
            action: 'Select "New dwelling" or "Vacant land" when calculating fees.'
        });
    }

    // WARNING: Temporary resident restrictions
    if ((citizenship === 'foreign' || citizenship === 'australian') && residency === 'temporary') {
        alerts.push({
            type: 'WARNING',
            title: 'One Established Dwelling Limit',
            message: 'Temporary residents can purchase ONE established dwelling as their principal residence. Investment properties must be new dwellings.',
            action: purposeOfPurchase === 'investment'
                ? 'For investment, select "New dwelling" when calculating.'
                : 'Ensure this will be your principal place of residence.'
        });
    }

    // PENALTY: FIRB non-compliance
    if (state.isEligible && state.isEligible.required) {
        alerts.push({
            type: 'PENALTY',
            title: 'FIRB Application Mandatory',
            message: 'Purchasing without FIRB approval carries severe penalties up to $187,800 for individuals or $939,000 for corporations.',
            action: 'Apply for FIRB approval BEFORE signing any contracts.'
        });
    }

    // INFO: New dwelling benefits
    if (residency === 'notResident' || (residency === 'temporary' && purposeOfPurchase === 'investment')) {
        alerts.push({
            type: 'INFO',
            title: 'New Dwellings Have No Purchase Restrictions',
            message: 'New dwellings and off-the-plan properties can be purchased by all foreign buyers without additional restrictions.',
            action: 'Consider new developments for more flexibility.'
        });
    }

    // INFO: FIRB timeline
    if (state.isEligible && state.isEligible.required) {
        const deadline = calculateFIRBDeadline();
        alerts.push({
            type: 'INFO',
            title: 'FIRB Application Timeline',
            message: `FIRB approval typically takes 30 days. For a standard 90-day settlement, you should apply by ${deadline.recommended}.`,
            action: 'Start gathering required documents now.'
        });
    }

    return alerts;
}

/**
 * Generate alerts for calculator form page
 * @returns {Array} Array of alert objects
 */
function generateCalculatorAlerts() {
    const alerts = [];
    const { citizenship, residency, purposeOfPurchase } = state.eligibilityData;
    const { propertyType, state: stateCode, entityType } = state.formData;

    // WARNING: Property type mismatch with eligibility
    if (propertyType && citizenship === 'foreign' && residency === 'notResident') {
        if (propertyType === 'established') {
            alerts.push({
                type: 'WARNING',
                title: 'You Are NOT Eligible to Purchase This Property Type',
                message: 'Foreign non-residents cannot purchase established dwellings. Your FIRB application will be rejected.',
                action: 'Change property type to "New dwelling" or "Vacant land".'
            });
        }
    }

    // WARNING: Temporary resident established dwelling for investment
    if (propertyType === 'established' && residency === 'temporary' && purposeOfPurchase === 'investment') {
        alerts.push({
            type: 'WARNING',
            title: 'Established Dwellings Only for Principal Residence',
            message: 'Temporary residents can only buy established dwellings as their principal residence, not for investment.',
            action: 'Either change to "New dwelling" or change purchase purpose to "Primary residence".'
        });
    }

    // WARNING: Company/Trust significantly higher fees
    if (entityType === 'company' || entityType === 'trust') {
        alerts.push({
            type: 'WARNING',
            title: 'Entity Structure Increases FIRB Fees 5-10x',
            message: `Companies and trusts pay dramatically higher FIRB fees than individuals (up to 10x for properties under $1M).`,
            action: 'Consider purchasing as an individual if possible to save tens of thousands of dollars.'
        });
    }

    // INFO: NT has 0% surcharge
    if (stateCode && stateCode !== 'NT') {
        alerts.push({
            type: 'INFO',
            title: 'Northern Territory Has 0% Foreign Surcharge',
            message: 'NT has no foreign land tax surcharge. Consider properties in Darwin or other NT locations to reduce annual costs.',
            action: 'Compare costs with NT properties for significant savings.'
        });
    }

    // INFO: Vacancy fee warning for dwellings
    if (propertyType === 'established' || propertyType === 'newDwelling') {
        alerts.push({
            type: 'INFO',
            title: 'Annual Vacancy Fee Applies to Empty Properties',
            message: 'If this property is vacant for more than 6 months in a year, you must pay an annual vacancy fee ranging from $11,490 to $137,880.',
            action: 'Ensure property is occupied or rented to avoid this fee.'
        });
    }

    // SUCCESS: Vacant land - no vacancy fee
    if (propertyType === 'vacant') {
        alerts.push({
            type: 'SUCCESS',
            title: 'Vacant Land Exempt from Vacancy Fee',
            message: 'The annual vacancy fee does not apply to vacant land, only to dwellings.',
            action: 'You will not pay vacancy fees during the development phase.'
        });
    }

    return alerts;
}

/**
 * Generate alerts for results dashboard page
 * @param {Object} fees - Calculated fees object
 * @returns {Array} Array of alert objects
 */
function generateResultsAlerts(fees) {
    const alerts = [];
    const { citizenship, residency, purposeOfPurchase } = state.eligibilityData;
    const { propertyType, state: stateCode, entityType, propertyValue } = state.formData;
    const propValue = parseFloat(propertyValue);

    // WARNING: High vacancy fee
    if (fees.annual.vacancyFee > 0) {
        alerts.push({
            type: 'WARNING',
            title: `Annual Vacancy Fee: ${formatCurrency(fees.annual.vacancyFee)}`,
            message: 'This fee is charged EVERY YEAR if the property is vacant for more than 6 months. Over 10 years, this adds up to ' + formatCurrency(fees.annual.vacancyFee * 10) + '.',
            action: 'Rent out the property or use it as your principal residence to avoid this fee.'
        });
    }

    // SAVINGS: Switching to new dwelling
    if (propertyType === 'established' && residency !== 'temporary') {
        const newDwellingData = { ...state.formData, propertyType: 'newDwelling' };
        const newDwellingFees = calculateAllFees(newDwellingData);
        const savings = fees.firstYearTotal - newDwellingFees.firstYearTotal;

        if (savings > 10000) {
            alerts.push({
                type: 'SUCCESS',
                title: `Switching to New Dwelling Could Save ${formatCurrency(savings)}`,
                message: `New dwellings often have lower stamp duty and no vacancy fee risk initially. First year total would be ${formatCurrency(newDwellingFees.firstYearTotal)}.`,
                action: 'Consider new off-the-plan properties for significant savings.'
            });
        }
    }

    // SAVINGS: Best state comparison
    if (stateCode && fees.firstYearTotal > 0) {
        const states = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'];
        let cheapestState = stateCode;
        let cheapestCost = fees.firstYearTotal;

        states.forEach(s => {
            if (s !== stateCode) {
                const tempData = { ...state.formData, state: s };
                const tempFees = calculateAllFees(tempData);
                if (tempFees.firstYearTotal < cheapestCost) {
                    cheapestState = s;
                    cheapestCost = tempFees.firstYearTotal;
                }
            }
        });

        if (cheapestState !== stateCode) {
            const savings = fees.firstYearTotal - cheapestCost;
            if (savings > 5000) {
                alerts.push({
                    type: 'SUCCESS',
                    title: `Save ${formatCurrency(savings)} by Purchasing in ${cheapestState}`,
                    message: `${cheapestState} has lower foreign buyer surcharges. First year total would be ${formatCurrency(cheapestCost)} instead of ${formatCurrency(fees.firstYearTotal)}.`,
                    action: `Consider properties in ${cheapestState} for significant cost savings.`
                });
            }
        }
    }

    // INFO: High land tax surcharge states
    if (stateCode === 'WA') {
        alerts.push({
            type: 'INFO',
            title: 'Western Australia Has Highest Foreign Land Tax (4%)',
            message: `WA charges the highest foreign land tax surcharge in Australia at 4% annually. This costs you ${formatCurrency(fees.annual.landTaxSurcharge)} per year.`,
            action: 'Factor this ongoing cost into your long-term investment decision.'
        });
    }

    // WARNING: Low deposit = LMI required
    if (fees.standard.lendersMortgageInsurance > 0) {
        const depositPercent = parseFloat(state.formData.depositPercent);
        alerts.push({
            type: 'WARNING',
            title: `Lenders Mortgage Insurance: ${formatCurrency(fees.standard.lendersMortgageInsurance)}`,
            message: `Your ${depositPercent}% deposit requires LMI. Increasing to 20% deposit would eliminate this ${formatCurrency(fees.standard.lendersMortgageInsurance)} cost.`,
            action: 'Consider saving a larger deposit to avoid LMI.'
        });
    }

    // PENALTY: Total cost reminder
    alerts.push({
        type: 'PENALTY',
        title: 'Remember: FIRB Application Required BEFORE Purchase',
        message: 'Do not sign contracts or pay deposits before receiving FIRB approval. Processing takes 30 days. Penalties for non-compliance start at $187,800.',
        action: 'Apply for FIRB as your first step in the purchasing process.'
    });

    // SUCCESS: Temporary resident eligibility reminder
    if (residency === 'temporary' && propertyType === 'established' && purposeOfPurchase === 'primary') {
        alerts.push({
            type: 'SUCCESS',
            title: 'As a Temporary Resident, You Can Purchase This Established Dwelling',
            message: 'Temporary residents are allowed to purchase ONE established dwelling as their principal residence.',
            action: 'Ensure you will live in this property as your primary home.'
        });
    }

    return alerts;
}

/**
 * Render an alert component
 * @param {Object} alert - Alert object with type, title, message, action
 * @returns {string} HTML string for alert
 */
function renderAlert(alert) {
    const style = ALERT_TYPES[alert.type];

    return `
        <div class="${style.bg} border ${style.border} p-5 rounded-lg mb-4 animate-fade-in">
            <div class="flex items-start">
                <div class="flex-shrink-0 text-2xl mr-3">
                    ${style.icon}
                </div>
                <div class="flex-1">
                    <h4 class="font-bold ${style.titleColor} text-lg mb-2">${alert.title}</h4>
                    <p class="${style.textColor} text-sm mb-2 leading-relaxed">${alert.message}</p>
                    ${alert.action ? `
                        <div class="mt-3 pt-3 border-t ${style.border}">
                            <p class="${style.textColor} text-sm font-semibold">
                                <span class="mr-2">→</span>${alert.action}
                            </p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Render alerts section
 * @param {Array} alerts - Array of alert objects
 * @param {string} title - Section title
 * @returns {string} HTML string for alerts section
 */
function renderAlertsSection(alerts, title = 'Important Alerts') {
    if (!alerts || alerts.length === 0) {
        return '';
    }

    return `
        <div class="bg-white p-6 rounded-xl shadow-md mb-8">
            <h3 class="text-2xl font-bold mb-6 flex items-center">
                ${icons.shield('w-6 h-6 text-gray-700 mr-2')}
                ${title}
            </h3>
            <div class="space-y-4">
                ${alerts.map(alert => renderAlert(alert)).join('')}
            </div>
        </div>
    `;
}

/**
 * Get contextual alerts for eligibility result page
 * @returns {string} HTML for alerts
 */
function getEligibilityAlertsHTML() {
    const alerts = generateEligibilityAlerts();
    return renderAlertsSection(alerts, 'Important Information for Your Purchase');
}

/**
 * Get contextual alerts for calculator form page
 * @returns {string} HTML for alerts
 */
function getCalculatorAlertsHTML() {
    const alerts = generateCalculatorAlerts();
    return renderAlertsSection(alerts, 'Important Alerts');
}

/**
 * Get contextual alerts for results dashboard
 * @param {Object} fees - Calculated fees
 * @returns {string} HTML for alerts
 */
function getResultsAlertsHTML(fees) {
    const alerts = generateResultsAlerts(fees);
    return renderAlertsSection(alerts, 'Critical Alerts & Savings Opportunities');
}

/**
 * Add inline alert styles if not already added
 */
function addAlertStyles() {
    if (document.getElementById('alert-styles')) return;

    const style = document.createElement('style');
    style.id = 'alert-styles';
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .animate-fade-in {
            animation: fadeIn 0.4s ease-out;
        }

        @media (max-width: 768px) {
            .alert-section {
                font-size: 14px;
            }
        }
    `;
    document.head.appendChild(style);
}
