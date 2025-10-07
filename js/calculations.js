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
function calculateFIRBFee(value, type, firstHome) {
    const val = parseFloat(value);
    
    // Vacant land has different fee structure
    if (type === 'vacant') {
        if (val < 300000) return 1710;
        if (val < 1000000) return 7600;
        if (val < 2000000) return 15200;
        return 30400;
    }
    
    // New dwelling or first home buyer gets reduced rates
    if (type === 'newDwelling' || firstHome === 'yes') {
        if (val < 1000000) return 1710;
        if (val < 2000000) return 3420;
        if (val < 3000000) return 6840;
        return 13680;
    }
    
    // Established dwelling (standard rates)
    if (val < 1000000) return 15200;
    if (val < 2000000) return 30400;
    if (val < 3000000) return 60900;
    return 121700;
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
function calculateStandardStampDuty(value, stateCode) {
    const val = parseFloat(value);
    
    switch(stateCode) {
        case 'NSW':
            if (val <= 351000) return val * 0.035;
            if (val <= 1168000) return 10525 + (val - 351000) * 0.045;
            return 47290 + (val - 1168000) * 0.055;
            
        case 'VIC':
            if (val <= 960000) return val * 0.05;
            return 44370 + (val - 960000) * 0.06;
            
        case 'QLD':
            if (val <= 540000) return val * 0.035;
            return 17325 + (val - 540000) * 0.045;
            
        default:
            // Generic calculation for other states
            return val * 0.04;
    }
}

// Calculate all fees and return complete breakdown
function calculateAllFees(formData) {
    const val = parseFloat(formData.propertyValue);
    
    // Foreign investment fees
    const firbFee = calculateFIRBFee(formData.propertyValue, formData.propertyType, formData.firstHomeBuyer);
    const stampDutySurcharge = calculateStampDutySurcharge(formData.propertyValue, formData.state);
    const legalFees = 2500;
    
    // Standard property purchase fees
    const standardFees = {
        stampDuty: calculateStandardStampDuty(formData.propertyValue, formData.state),
        transferFee: 150,
        mortgageRegistration: 150,
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
