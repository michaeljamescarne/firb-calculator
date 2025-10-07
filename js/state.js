// Application state management

// Global state object
const state = {
    currentStep: 'home',
    mobileMenuOpen: false,
    language: 'en',
    eligibilityData: {
        citizenship: '',
        residency: '',
        visaType: '', // ADDED: For future use (optional field)
        purposeOfPurchase: ''
    },
    isEligible: null,
    formData: {
        address: '',
        propertyValue: '',
        propertyType: '',
        firstHomeBuyer: '',
        state: ''
    },
    calculatedFees: null,
    isCalculating: false,
    isProcessingPayment: false,
    savedCalculations: []
};

// Navigation functions
function goToStep(step) {
    state.currentStep = step;
    render();
    window.scrollTo(0, 0);
}

function changeLanguage(lang) {
    state.language = lang;
    render();
}

// Toggle mobile menu
function toggleMobileMenu() {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    render();
}

// Update functions for eligibility form
function updateEligibility(field, value) {
    state.eligibilityData[field] = value;
}

// Update functions for calculator form
function updateForm(field, value) {
    state.formData[field] = value;
}

// Check eligibility and determine if FIRB is required
function checkEligibility() {
    if (!state.eligibilityData.citizenship || 
        !state.eligibilityData.residency || 
        !state.eligibilityData.purposeOfPurchase) {
        alert('Please answer all questions');
        return;
    }

    let requiresFIRB = false;
    let eligibilityNote = '';

    if (state.eligibilityData.citizenship === 'australian' && 
        state.eligibilityData.residency === 'permanent') {
        requiresFIRB = false;
        eligibilityNote = 'As an Australian citizen and permanent resident, you are exempt from FIRB requirements for residential property purchases.';
    } else if (state.eligibilityData.citizenship === 'foreign') {
        requiresFIRB = true;
        if (state.eligibilityData.residency === 'notResident') {
            eligibilityNote = 'As a foreign non-resident, you need FIRB approval. You can only purchase new dwellings or vacant land for development.';
        } else if (state.eligibilityData.residency === 'temporary') {
            eligibilityNote = 'As a temporary resident, you need FIRB approval. You may purchase one established dwelling as your principal residence.';
        } else {
            eligibilityNote = 'As a foreign citizen, you need FIRB approval.';
        }
    } else if (state.eligibilityData.residency === 'temporary' || 
               state.eligibilityData.residency === 'notResident') {
        requiresFIRB = true;
        eligibilityNote = 'Based on your residency status, FIRB approval is required.';
    }

    state.isEligible = requiresFIRB 
        ? { required: true, note: eligibilityNote } 
        : { required: false, note: eligibilityNote };
    
    state.currentStep = 'eligibilityResult';
    render();
}

// Validate and calculate fees
function handleCalculate() {
    // Validation
    if (!state.formData.address || 
        !state.formData.propertyValue || 
        !state.formData.propertyType || 
        !state.formData.firstHomeBuyer || 
        !state.formData.state) {
        alert('Please fill all fields');
        return;
    }

    const val = parseFloat(state.formData.propertyValue);
    if (isNaN(val) || val <= 0) {
        alert('Please enter a valid property value');
        return;
    }
    if (val < 100000) {
        alert('Property value seems unusually low. Please verify the amount.');
        return;
    }

    // Show calculating state
    state.isCalculating = true;
    render();

    // Simulate calculation delay for better UX
    setTimeout(() => {
        state.calculatedFees = calculateAllFees(state.formData);
        
        // Save to calculation history
        state.savedCalculations.unshift({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            address: state.formData.address,
            propertyValue: state.formData.propertyValue,
            state: state.formData.state,
            total: state.calculatedFees.grandTotal
        });
        state.savedCalculations = state.savedCalculations.slice(0, 5); // Keep only last 5

        state.isCalculating = false;
        state.currentStep = 'results';
        render();
    }, 1500);
}

// Handle payment button click
function handlePayment() {
    state.isProcessingPayment = true;
    render();
    
    setTimeout(() => {
        // In production, redirect to Stripe: window.open('https://buy.stripe.com/...', '_blank')
        alert('Payment demo: In production, this would redirect to Stripe.\n\nYour report is ready to download!');
        state.isProcessingPayment = false;
        render();
    }, 2000);
}

// Download report as text file
// UPDATED: Enhanced format with detailed line items from Test Code
function downloadReport() {
    const fees = state.calculatedFees;
    const lmiLine = fees.standard.lendersMortgageInsurance > 0 
        ? `Lenders Mortgage Insurance: ${formatCurrency(fees.standard.lendersMortgageInsurance)}\n`
        : '';
    
    const content = `FIRB FEE CALCULATOR REPORT
Generated: ${new Date().toLocaleDateString('en-AU')}

PROPERTY DETAILS
Address: ${state.formData.address}
Purchase Price: ${formatCurrency(parseFloat(state.formData.propertyValue))}
Property Type: ${state.formData.propertyType}
State: ${state.formData.state}

========================================
FOREIGN INVESTMENT FEES
========================================
FIRB Application Fee: ${formatCurrency(fees.firb)}
Stamp Duty Surcharge: ${formatCurrency(fees.stampDuty)}
Legal Fees: ${formatCurrency(fees.legal)}

Foreign Investment Total: ${formatCurrency(fees.foreignTotal)}

========================================
STANDARD PROPERTY PURCHASE FEES
========================================
Standard Stamp Duty: ${formatCurrency(fees.standard.stampDuty)}
Transfer Fee: ${formatCurrency(fees.standard.transferFee)}
Mortgage Registration: ${formatCurrency(fees.standard.mortgageRegistration)}
Conveyancing & Legal: ${formatCurrency(fees.standard.conveyancingLegal)}
Building Inspection: ${formatCurrency(fees.standard.buildingInspection)}
Pest Inspection: ${formatCurrency(fees.standard.pestInspection)}
Loan Application: ${formatCurrency(fees.standard.loanApplicationFee)}
${lmiLine}Title Search: ${formatCurrency(fees.standard.titleSearch)}
Council Rates: ${formatCurrency(fees.standard.councilRates)}
Water Rates: ${formatCurrency(fees.standard.waterRates)}

Standard Fees Total: ${formatCurrency(fees.standardTotal)}

========================================
TOTAL ESTIMATED COSTS: ${formatCurrency(fees.grandTotal)}
========================================

IMPORTANT: FIRB approval must be obtained BEFORE purchasing property.

This is an estimate based on current regulations. Actual fees may vary.
For official advice, consult with a qualified property lawyer or FIRB specialist.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FIRB-Report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
