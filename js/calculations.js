// All calculation functions for FIRB fees and property costs

// Format currency in Australian dollars
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Calculate FIRB application fee based on property value, type, and first home buyer status
// UPDATED: Added higher brackets for expensive properties ($3M-$4M+)
function calculateFIRBFee(value, type, firstHome) {
    const val = parseFloat(value);
    
    // Vacant land has different fee structure
    if (type === 'vacant') {
        if (val < 1000000) return 7600;
        if (val < 2000000) return 15200;
        if (val < 3000000) return 30400;
        return 60900; // UPDATED: Added higher bracket
    }
    
    // New dwelling or first home buyer gets reduced rates
    if (type === 'newDwelling' || firstHome === 'yes') {
        if (val < 1000000) return 1710;
        if (val < 2000000) return 3420;
        if (val < 3000000) return 6840;
        if (val < 4000000) return 13680;
        return 27360; // UPDATED: Added $4M+ bracket
    }
    
    // Established dwelling (standard rates)
    if (val < 1000000) return 15200;
    if (val < 2000000) return 30400;
    if (val < 3000000) return 60900;
    if (val < 4000000) return 121700;
    return 243400; // UPDATED: Added $4M+ bracket
}

// Calculate stamp duty surcharge for foreign investors by state
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

// Calculate standard stamp duty by state (paid by all buyers)
// UPDATED: Added calculations for all states/territories
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

// Calculate all fees and return complete breakdown
// UPDATED: Now uses state-specific transfer and mortgage fees
function calculateAllFees(formData) {
    const val = parseFloat(formData.propertyValue);
    
    // Foreign investment fees
    const firbFee = calculateFIRBFee(formData.propertyValue, formData.propertyType, formData.firstHomeBuyer);
    const stampDutySurcharge = calculateStampDutySurcharge(formData.propertyValue, formData.state);
    const legalFees = 2500;
    
    // Standard property purchase fees (UPDATED with state-specific fees)
    const standardFees = {
        stampDuty: calculateStandardStampDuty(formData.propertyValue, formData.state),
        transferFee: stateTransferFees[formData.state] || 150,
        mortgageRegistration: stateMortgageFees[formData.state] || 150,
        titleSearch: 35,
        buildingInspection: 450,
        pestInspection: 350,
        conveyancingLegal: 1500,
        loanApplicationFee: 600,
        lendersMortgageInsurance: val > 800000 && val * 0.8 > 640000 ? val * 0.02 : 0,
        councilRates: 400,
        waterRates: 300
    };
    
    const standardTotal = Object.values(standardFees).reduce((sum, fee) => sum + fee, 0);
    const foreignTotal = firbFee + stampDutySurcharge + legalFees;
    const grandTotal = foreignTotal + standardTotal;
    
    return {
        firb: firbFee,
        stampDuty: stampDutySurcharge,
        legal: legalFees,
        standard: standardFees,
        foreignTotal: foreignTotal,
        standardTotal: standardTotal,
        grandTotal: grandTotal
    };
}
