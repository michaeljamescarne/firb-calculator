/**
 * All calculation functions for FIRB fees and property costs
 * @file calculations.js
 */

/**
 * Format currency in Australian dollars
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Calculate FIRB application fee based on property value, type, first home buyer status, and entity type
 * @param {string|number} value - Property value
 * @param {string} type - Property type ('vacant', 'newDwelling', 'established')
 * @param {string} firstHome - First home buyer status ('yes' or 'no')
 * @param {string} entityType - Entity type ('individual', 'company', 'trust') - defaults to 'individual'
 * @returns {number} FIRB application fee
 */
function calculateFIRBFee(value, type, firstHome, entityType = 'individual') {
    const val = parseFloat(value);
    let baseFee = 0;

    // Vacant land has different fee structure
    if (type === 'vacant') {
        if (val < 1000000) baseFee = 7600;
        else if (val < 2000000) baseFee = 15200;
        else if (val < 3000000) baseFee = 30400;
        else baseFee = 60900;
    }
    // New dwelling or first home buyer gets reduced rates
    else if (type === 'newDwelling' || firstHome === 'yes') {
        if (val < 1000000) baseFee = 1710;
        else if (val < 2000000) baseFee = 3420;
        else if (val < 3000000) baseFee = 6840;
        else if (val < 4000000) baseFee = 13680;
        else baseFee = 27360;
    }
    // Established dwelling (standard rates)
    else {
        if (val < 1000000) baseFee = 15200;
        else if (val < 2000000) baseFee = 30400;
        else if (val < 3000000) baseFee = 60900;
        else if (val < 4000000) baseFee = 121700;
        else baseFee = 243400;
    }

    // Companies and trusts pay significantly higher fees (approximately 10x)
    // Based on total value of Australian assets, not just this property
    // Simplified calculation: multiply individual rate
    if (entityType === 'company' || entityType === 'trust') {
        // For companies/trusts, fees are much higher and tiered differently
        if (val < 1000000) return baseFee * 10;
        if (val < 2000000) return baseFee * 8;
        if (val < 5000000) return baseFee * 6;
        return baseFee * 5; // Still substantial even at high values
    }

    return baseFee;
}

/**
 * Calculate stamp duty surcharge for foreign investors by state
 * @param {string|number} value - Property value
 * @param {string} stateCode - Australian state code (NSW, VIC, QLD, SA, WA, TAS, ACT, NT)
 * @returns {number} Stamp duty surcharge amount
 */
function calculateStampDutySurcharge(value, stateCode) {
    const val = parseFloat(value);
    const rates = {
        NSW: 0.08,  // 8%
        VIC: 0.08,  // 8%
        QLD: 0.07,  // 7%
        SA: 0.07,   // 7%
        WA: 0.07,   // 7%
        TAS: 0.08,  // 8%
        ACT: 0.075, // 7.5%
        NT: 0.055   // 5.5%
    };
    return val * (rates[stateCode] || 0.08);
}

/**
 * Calculate standard stamp duty by state (paid by all buyers)
 * @param {string|number} value - Property value
 * @param {string} stateCode - Australian state code
 * @returns {number} Standard stamp duty amount
 */
function calculateStandardStampDuty(value, stateCode) {
    const val = parseFloat(value);
    
    switch(stateCode) {
        case 'NSW':
            // Progressive calculation (more accurate)
            if (val <= 351000) return val * 0.035;
            if (val <= 1168000) return 10525 + (val - 351000) * 0.045;
            return 47290 + (val - 1168000) * 0.055;
            
        case 'VIC':
            // Progressive calculation (more accurate)
            if (val <= 960000) return val * 0.05;
            return 44370 + (val - 960000) * 0.06;
            
        case 'QLD':
            // Progressive calculation (more accurate)
            if (val <= 540000) return val * 0.035;
            return 17325 + (val - 540000) * 0.045;
        
        // ADDED: Calculations for remaining states
        case 'SA':
            if (val <= 500000) return val * 0.035;
            if (val <= 1200000) return 17500 + (val - 500000) * 0.045;
            return 49000 + (val - 1200000) * 0.055;
            
        case 'WA':
            if (val <= 500000) return val * 0.04;
            if (val <= 725000) return 20000 + (val - 500000) * 0.045;
            return 30125 + (val - 725000) * 0.05;
            
        case 'TAS':
            if (val <= 350000) return val * 0.035;
            if (val <= 725000) return 12250 + (val - 350000) * 0.04;
            return 27250 + (val - 725000) * 0.045;
            
        case 'ACT':
            return val * 0.044;
            
        case 'NT':
            if (val <= 525000) return val * 0.0365;
            return 19162.50 + (val - 525000) * 0.0495;
            
        default:
            return val * 0.04;
    }
}

// ADDED: State-specific government fees
const stateTransferFees = {
    NSW: 138,
    VIC: 122,
    QLD: 196,
    SA: 164,
    WA: 195,
    TAS: 125,
    ACT: 447,
    NT: 146
};

const stateMortgageFees = {
    NSW: 148,
    VIC: 122,
    QLD: 196,
    SA: 164,
    WA: 195,
    TAS: 125,
    ACT: 338,
    NT: 146
};

/**
 * Calculate Annual Vacancy Fee for foreign owners
 * Charged annually if property is vacant for more than 6 months in a year
 * @param {string|number} propertyValue - Property value
 * @param {string} propertyType - Property type
 * @returns {number} Annual vacancy fee
 */
function calculateAnnualVacancyFee(propertyValue, propertyType) {
    const val = parseFloat(propertyValue);

    // Vacancy fee doesn't apply to vacant land
    if (propertyType === 'vacant') return 0;

    // Tiered vacancy fee structure (similar to FIRB fees)
    if (val < 1000000) return 11490;
    if (val < 1500000) return 22980;
    if (val < 2000000) return 34470;
    if (val < 3000000) return 57450;
    if (val < 4000000) return 68940;
    if (val < 5000000) return 103410;
    return 137880; // $5M+
}

/**
 * Calculate Foreign Owner Land Tax Surcharge (annual)
 * Additional land tax charged to foreign owners on top of standard land tax
 * @param {string|number} propertyValue - Property value
 * @param {string} stateCode - Australian state code
 * @returns {number} Annual land tax surcharge amount
 */
function calculateLandTaxSurcharge(propertyValue, stateCode) {
    const val = parseFloat(propertyValue);

    // Land tax surcharge rates by state (annual)
    const surchargeRates = {
        NSW: 0.02,    // 2% (on top of standard land tax)
        VIC: 0.015,   // 1.5%
        QLD: 0.02,    // 2%
        SA: 0.005,    // 0.5%
        WA: 0.04,     // 4%
        TAS: 0.015,   // 1.5%
        ACT: 0.0075,  // 0.75%
        NT: 0         // No land tax surcharge in NT
    };

    // Most states have a tax-free threshold, but surcharge still applies
    // Simplified calculation: surcharge on full property value
    // Note: Actual calculation more complex with thresholds and progressive rates
    return val * (surchargeRates[stateCode] || 0.02);
}

/**
 * Calculate Lenders Mortgage Insurance (LMI)
 * LMI is required when LVR (Loan to Value Ratio) exceeds 80%
 * @param {string|number} propertyValue - Property value
 * @param {number} depositPercent - Deposit percentage (default 30% for foreign buyers)
 * @returns {number} LMI amount
 */
function calculateLMI(propertyValue, depositPercent = 30) {
    const val = parseFloat(propertyValue);
    const loanAmount = val * ((100 - depositPercent) / 100);
    const lvr = (loanAmount / val) * 100;

    // LMI only applies if LVR > 80%
    if (lvr <= 80) return 0;

    // LMI calculation based on loan amount and LVR
    // These are approximate rates - actual LMI varies by lender
    let lmiRate = 0;

    if (lvr > 80 && lvr <= 85) {
        lmiRate = 0.017; // ~1.7%
    } else if (lvr > 85 && lvr <= 90) {
        lmiRate = 0.024; // ~2.4%
    } else if (lvr > 90 && lvr <= 95) {
        lmiRate = 0.031; // ~3.1%
    } else {
        lmiRate = 0.04; // ~4% for >95%
    }

    return loanAmount * lmiRate;
}

/**
 * Calculate all fees and return complete breakdown
 * @param {Object} formData - Form data containing property details
 * @param {string} formData.propertyValue - Property value
 * @param {string} formData.propertyType - Property type
 * @param {string} formData.firstHomeBuyer - First home buyer status
 * @param {string} formData.state - Australian state code
 * @param {string} formData.entityType - Entity type (individual, company, trust)
 * @param {number} formData.depositPercent - Deposit percentage
 * @returns {Object} Complete fee breakdown including foreign, standard, and annual fees
 */
function calculateAllFees(formData) {
    const val = parseFloat(formData.propertyValue);
    const entityType = formData.entityType || 'individual';
    const depositPercent = parseFloat(formData.depositPercent) || 30;

    // Use sophisticated FIRB eligibility logic if available
    let firbRequired = true; // Default to true for safety
    let eligibilityResult = null;
    
    if (window.FIRBEligibility?.checkFIRBEligibility && formData.citizenshipStatus && formData.propertyType) {
        try {
            eligibilityResult = window.FIRBEligibility.checkFIRBEligibility({
                citizenshipStatus: formData.citizenshipStatus,
                visaType: formData.visaType,
                propertyType: formData.propertyType,
                isOrdinarilyResident: true // Default to ordinarily resident
            });
            firbRequired = eligibilityResult.firbRequired;
            console.log('[CALCULATIONS] Using sophisticated FIRB logic:', eligibilityResult);
        } catch (error) {
            console.error('[CALCULATIONS] Error in FIRB eligibility check:', error);
            // Fallback to formData.firbRequired or default
            firbRequired = formData.firbRequired !== false;
        }
    } else {
        // Fallback to simple logic if sophisticated logic not available
        firbRequired = formData.firbRequired !== false;
        console.log('[CALCULATIONS] Using fallback FIRB logic, firbRequired:', firbRequired);
    }

    // Foreign investment fees (one-time) - only if FIRB required
    const firbFee = firbRequired ? calculateFIRBFee(
        formData.propertyValue,
        formData.propertyType,
        formData.firstHomeBuyer,
        entityType
    ) : 0;

    const stampDutySurcharge = firbRequired ? calculateStampDutySurcharge(formData.propertyValue, formData.state) : 0;
    const legalFees = firbRequired ? 2500 : 0;

    // Standard property purchase fees (one-time)
    const standardFees = {
        stampDuty: calculateStandardStampDuty(formData.propertyValue, formData.state),
        transferFee: stateTransferFees[formData.state] || 150,
        mortgageRegistration: stateMortgageFees[formData.state] || 150,
        titleSearch: 35,
        buildingInspection: 450,
        pestInspection: 350,
        conveyancingLegal: 1500,
        loanApplicationFee: 600,
        lendersMortgageInsurance: calculateLMI(val, depositPercent),
        councilRates: 400,
        waterRates: 300
    };

    // Annual fees for foreign owners - only if FIRB required
    const annualFees = {
        vacancyFee: firbRequired ? calculateAnnualVacancyFee(formData.propertyValue, formData.propertyType) : 0,
        landTaxSurcharge: firbRequired ? calculateLandTaxSurcharge(formData.propertyValue, formData.state) : 0,
        councilRates: 2400,  // Annual estimate (applies to all)
        waterRates: 1200,    // Annual estimate (applies to all)
        insurance: Math.max(800, val * 0.003) // Rough estimate: 0.3% of property value, min $800 (applies to all)
    };

    const standardTotal = Object.values(standardFees).reduce((sum, fee) => sum + fee, 0);
    const foreignTotal = firbFee + stampDutySurcharge + legalFees;
    const annualTotal = Object.values(annualFees).reduce((sum, fee) => sum + fee, 0);
    const grandTotal = foreignTotal + standardTotal;

    return {
        // One-time foreign investment fees
        firb: firbFee,
        stampDuty: stampDutySurcharge,
        legal: legalFees,
        foreignTotal: foreignTotal,

        // One-time standard fees
        standard: standardFees,
        standardTotal: standardTotal,

        // Annual ongoing fees
        annual: annualFees,
        annualTotal: annualTotal,

        // Totals
        grandTotal: grandTotal,
        firstYearTotal: grandTotal + annualTotal,

        // Metadata
        depositPercent: depositPercent,
        entityType: entityType,
        firbRequired: firbRequired,  // Include FIRB requirement status
        eligibilityResult: eligibilityResult  // Include full eligibility result
    };
}
