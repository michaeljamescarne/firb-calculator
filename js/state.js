/**
 * Application state management with race condition prevention
 * @file state.js
 */

// State locking mechanism to prevent race conditions
let stateLock = false;
const stateLockTimeout = 5000; // 5 seconds max lock time

/**
 * Acquire state lock
 * @returns {boolean} True if lock acquired successfully
 */
function acquireStateLock() {
    if (stateLock) {
        console.warn('[STATE] State is locked, operation queued');
        return false;
    }
    
    stateLock = true;
    
    // Auto-release lock after timeout to prevent deadlocks
    setTimeout(() => {
        if (stateLock) {
            console.warn('[STATE] State lock timeout - releasing lock');
            stateLock = false;
        }
    }, stateLockTimeout);
    
    return true;
}

/**
 * Release state lock
 */
function releaseStateLock() {
    stateLock = false;
}

/**
 * Execute function with state lock
 * @param {Function} fn - Function to execute
 * @param {string} operation - Operation name for logging
 * @returns {*} Function result
 */
function withStateLock(fn, operation = 'unknown') {
    if (!acquireStateLock()) {
        console.warn(`[STATE] Could not acquire lock for operation: ${operation}`);
        return null;
    }
    
    try {
        const result = fn();
        return result;
    } finally {
        releaseStateLock();
    }
}

/**
 * Global state object
 * @type {Object}
 */
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
        state: '',
        entityType: 'individual',  // individual, company, trust
        depositPercent: '30',       // Default 30% for foreign buyers
        citizenshipStatus: '',
        visaType: ''
    },
    calculatedFees: null,
    isCalculating: false,
    isProcessingPayment: false,
    savedCalculations: []
};

/**
 * Ensure formData is always properly initialized
 */
function ensureFormDataInitialized() {
    if (!state.formData) {
        console.warn('[STATE] formData was null/undefined - initializing');
        state.formData = {
            address: '',
            propertyValue: '',
            propertyType: '',
            firstHomeBuyer: '',
            state: '',
            entityType: 'individual',
            depositPercent: '30',
            citizenshipStatus: '',
            visaType: ''
        };
    }
    return state.formData;
}

/**
 * Navigate to a specific step in the application
 * @param {string} step - Step name to navigate to
 */
function goToStep(step) {
    state.currentStep = step;
    render();
    window.scrollTo(0, 0);
}

/**
 * Change the application language
 * @param {string} lang - Language code ('en', 'zh', 'vi')
 */
function changeLanguage(lang) {
    state.language = lang;
    saveToStorage('firb_language', lang);
    render();
}

/**
 * Toggle mobile menu open/closed state
 */
function toggleMobileMenu() {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    render();
}

/**
 * Update eligibility form field
 * @param {string} field - Field name to update
 * @param {string} value - New value
 */
function updateEligibility(field, value) {
    state.eligibilityData[field] = value;
}

/**
 * Update calculator form field
 * @param {string} field - Field name to update
 * @param {string} value - New value
 */
function updateForm(field, value) {
    state.formData[field] = value;
}

/**
 * Handle property value input with automatic formatting
 * @param {HTMLInputElement} input - Input element
 */
function handlePropertyValueInput(input) {
    // Remove all non-digit characters
    const rawValue = input.value.replace(/[^\d]/g, '');

    // Update state with raw numeric value
    state.formData.propertyValue = rawValue;

    // Format and display with commas
    input.value = formatNumberWithCommas(rawValue);
}

/**
 * Check eligibility and determine if FIRB is required
 */
function checkEligibility() {
    if (!state.eligibilityData.citizenship ||
        !state.eligibilityData.residency ||
        !state.eligibilityData.purposeOfPurchase) {
        showNotification('Please answer all questions', 'warning');
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

/**
 * Validate and calculate fees
 */
function handleCalculate() {
    // Sanitize address input
    state.formData.address = sanitizeHTML(state.formData.address);

    // Validation
    if (!state.formData.address ||
        !state.formData.propertyValue ||
        !state.formData.propertyType ||
        !state.formData.firstHomeBuyer ||
        !state.formData.state) {
        showNotification('Please fill all fields', 'warning');
        return;
    }

    // Validate property value
    const validation = validatePropertyValue(state.formData.propertyValue);
    if (!validation.valid) {
        showNotification(validation.error, 'error');
        return;
    }

    // Calculate fees immediately (removed artificial delay)
    state.isCalculating = true;
    render();

    // Use requestAnimationFrame for smooth UI update
    requestAnimationFrame(() => {
        state.calculatedFees = calculateAllFees(state.formData);

        // Save to calculation history and localStorage
        state.savedCalculations.unshift({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            address: state.formData.address,
            propertyValue: state.formData.propertyValue,
            state: state.formData.state,
            total: state.calculatedFees.grandTotal
        });
        state.savedCalculations = state.savedCalculations.slice(0, 5); // Keep only last 5

        // Save to localStorage
        saveToStorage('firb_calculations', state.savedCalculations);
        saveToStorage('firb_formData', state.formData);

        state.isCalculating = false;
        state.currentStep = 'results';
        render();

        showNotification('Calculation completed successfully!', 'success', 3000);
    });
}

/**
 * Handle payment button click
 */
function handlePayment() {
    state.isProcessingPayment = true;
    render();

    // Simulate payment processing
    setTimeout(() => {
        // In production, redirect to Stripe: window.open('https://buy.stripe.com/...', '_blank')
        showNotification('Payment demo: In production, this would redirect to Stripe. Your report is ready to download!', 'info', 7000);
        state.isProcessingPayment = false;
        render();
    }, 2000);
}

/**
 * Download report as text file
 * Enhanced format with detailed line items
 */
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
