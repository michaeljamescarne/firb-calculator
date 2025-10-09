/**
 * Comprehensive Form Validation System for FIRB Calculator
 * @file formValidation.js
 *
 * Features:
 * - Real-time validation with debouncing
 * - User-friendly error messages
 * - Min/max value enforcement
 * - Decimal/integer type validation
 * - Currency formatting with commas
 * - Negative number prevention
 * - Special character handling
 * - Empty vs zero distinction
 * - Visual error indicators
 */

/**
 * Validation rules configuration
 */
const VALIDATION_RULES = {
    propertyValue: {
        min: 100000,
        max: 100000000,
        allowDecimals: true,
        required: true,
        type: 'currency',
        errorMessages: {
            required: 'Property value is required',
            min: 'Property value must be at least $100,000',
            max: 'Property value cannot exceed $100,000,000',
            invalid: 'Please enter a valid property value',
            negative: 'Property value cannot be negative'
        }
    },
    address: {
        minLength: 5,
        maxLength: 200,
        required: true,
        pattern: /^[a-zA-Z0-9\s,.\-\/()#&']+$/,
        errorMessages: {
            required: 'Property address is required',
            minLength: 'Address must be at least 5 characters',
            maxLength: 'Address cannot exceed 200 characters',
            pattern: 'Address contains invalid characters. Only letters, numbers, spaces, commas, periods, hyphens, slashes, parentheses, hash, ampersand, and apostrophe are allowed.',
            invalid: 'Please enter a valid address'
        }
    },
    depositPercent: {
        min: 10,
        max: 100,
        allowDecimals: false,
        required: true,
        type: 'percentage',
        errorMessages: {
            required: 'Deposit percentage is required',
            min: 'Deposit must be at least 10%',
            max: 'Deposit cannot exceed 100%',
            invalid: 'Please enter a valid deposit percentage'
        }
    },
    propertyType: {
        required: true,
        options: ['established', 'newDwelling', 'vacant'],
        errorMessages: {
            required: 'Please select a property type',
            invalid: 'Please select a valid property type'
        }
    },
    state: {
        required: true,
        options: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'],
        errorMessages: {
            required: 'Please select a state',
            invalid: 'Please select a valid state'
        }
    },
    entityType: {
        required: true,
        options: ['individual', 'company', 'trust'],
        errorMessages: {
            required: 'Please select an entity type',
            invalid: 'Please select a valid entity type'
        }
    },
    firstHomeBuyer: {
        required: true,
        options: ['yes', 'no'],
        errorMessages: {
            required: 'Please specify if you are a first home buyer',
            invalid: 'Please select a valid option'
        }
    }
};

/**
 * Validation state tracking
 */
const validationState = {
    errors: {},
    touched: {},
    isSubmitting: false
};

/**
 * Validate a single field
 * @param {string} fieldName - Name of the field to validate
 * @param {*} value - Value to validate
 * @returns {object} - {valid: boolean, error: string|null}
 */
function validateField(fieldName, value) {
    const rules = VALIDATION_RULES[fieldName];
    if (!rules) {
        return { valid: true, error: null };
    }

    // Required check
    if (rules.required) {
        if (value === null || value === undefined || value === '') {
            return { valid: false, error: rules.errorMessages.required };
        }
    }

    // Type-specific validation
    switch (rules.type) {
        case 'currency':
            return validateCurrency(value, rules);
        case 'percentage':
            return validatePercentage(value, rules);
        default:
            break;
    }

    // String length validation
    if (rules.minLength && value.length < rules.minLength) {
        return { valid: false, error: rules.errorMessages.minLength };
    }
    if (rules.maxLength && value.length > rules.maxLength) {
        return { valid: false, error: rules.errorMessages.maxLength };
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
        return { valid: false, error: rules.errorMessages.pattern };
    }

    // Options validation (for select/radio)
    if (rules.options && !rules.options.includes(value)) {
        return { valid: false, error: rules.errorMessages.invalid };
    }

    return { valid: true, error: null };
}

/**
 * Validate currency value
 * @param {string|number} value - Currency value
 * @param {object} rules - Validation rules
 * @returns {object} - Validation result
 */
function validateCurrency(value, rules) {
    // Convert to number, handling commas
    const numericValue = typeof value === 'string'
        ? parseFloat(value.replace(/,/g, ''))
        : parseFloat(value);

    // Check if valid number
    if (isNaN(numericValue)) {
        return { valid: false, error: rules.errorMessages.invalid };
    }

    // Check for negative
    if (numericValue < 0) {
        return { valid: false, error: rules.errorMessages.negative };
    }

    // Check minimum
    if (rules.min !== undefined && numericValue < rules.min) {
        return { valid: false, error: rules.errorMessages.min };
    }

    // Check maximum
    if (rules.max !== undefined && numericValue > rules.max) {
        return { valid: false, error: rules.errorMessages.max };
    }

    // Check decimal restriction
    if (!rules.allowDecimals && numericValue % 1 !== 0) {
        return { valid: false, error: 'Whole numbers only - no decimals allowed' };
    }

    return { valid: true, error: null };
}

/**
 * Validate percentage value
 * @param {string|number} value - Percentage value
 * @param {object} rules - Validation rules
 * @returns {object} - Validation result
 */
function validatePercentage(value, rules) {
    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) {
        return { valid: false, error: rules.errorMessages.invalid };
    }

    if (numericValue < 0) {
        return { valid: false, error: 'Percentage cannot be negative' };
    }

    if (rules.min !== undefined && numericValue < rules.min) {
        return { valid: false, error: rules.errorMessages.min };
    }

    if (rules.max !== undefined && numericValue > rules.max) {
        return { valid: false, error: rules.errorMessages.max };
    }

    return { valid: true, error: null };
}

/**
 * Enhanced property value input handler with validation
 * @param {HTMLInputElement} input - Input element
 */
function handleValidatedPropertyValueInput(input) {
    // Remove all non-numeric characters except decimal point
    let rawValue = input.value.replace(/[^\d.]/g, '');

    // Prevent multiple decimal points
    const decimalCount = (rawValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
        rawValue = rawValue.substring(0, rawValue.lastIndexOf('.'));
    }

    // Limit to 2 decimal places
    const parts = rawValue.split('.');
    if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
        rawValue = parts.join('.');
    }

    // Update state with raw numeric value
    state.formData.propertyValue = rawValue;

    // Format and display with commas (only the integer part)
    if (rawValue) {
        const [integerPart, decimalPart] = rawValue.split('.');
        let formatted = formatNumberWithCommas(integerPart);
        if (decimalPart !== undefined) {
            formatted += '.' + decimalPart;
        }
        input.value = formatted;
    } else {
        input.value = '';
    }

    // Mark field as touched
    validationState.touched.propertyValue = true;

    // Debounced validation
    debouncedValidatePropertyValue(rawValue, input);
}

/**
 * Debounced property value validation
 */
const debouncedValidatePropertyValue = debounce((value, inputElement) => {
    const result = validateField('propertyValue', value);
    validationState.errors.propertyValue = result.error;

    updateFieldValidationUI(inputElement, result);
}, 500);

/**
 * Format address input for consistency
 * @param {string} address - Raw address input
 * @returns {string} - Formatted address
 */
function formatAddress(address) {
    if (!address) return '';
    
    return address
        .trim()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Enhanced address input handler with validation
 * @param {HTMLInputElement} input - Input element
 */
function handleValidatedAddressInput(input) {
    let value = input.value;

    // Remove any HTML/script tags for security
    value = sanitizeHTML(value);

    // Format the address for consistency
    value = formatAddress(value);

    // Update the input field with formatted value
    input.value = value;

    // Update state
    state.formData.address = value;

    // Mark field as touched
    validationState.touched.address = true;

    // Debounced validation
    debouncedValidateAddress(value, input);
}

/**
 * Debounced address validation
 */
const debouncedValidateAddress = debounce((value, inputElement) => {
    const result = validateField('address', value);
    validationState.errors.address = result.error;

    updateFieldValidationUI(inputElement, result);
}, 500);

/**
 * Validate select/dropdown field
 * @param {string} fieldName - Field name
 * @param {string} value - Selected value
 * @param {HTMLSelectElement} selectElement - Select element
 */
function handleValidatedSelectChange(fieldName, value, selectElement) {
    // Update state
    state.formData[fieldName] = value;

    // Mark as touched
    validationState.touched[fieldName] = true;

    // Immediate validation for selects (no debounce needed)
    const result = validateField(fieldName, value);
    validationState.errors[fieldName] = result.error;

    updateFieldValidationUI(selectElement, result);
}

/**
 * Update field UI with validation state
 * @param {HTMLElement} element - Input/select element
 * @param {object} validationResult - Result from validateField
 */
function updateFieldValidationUI(element, validationResult) {
    if (!element) return;

    const fieldId = element.id;
    const errorContainer = document.getElementById(`${fieldId}-error`);

    if (validationResult.valid) {
        // Remove error styling
        element.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        element.classList.add('border-gray-300', 'focus:ring-blue-500', 'focus:border-blue-500');

        // Hide error message
        if (errorContainer) {
            errorContainer.classList.add('hidden');
            errorContainer.textContent = '';
        }

        // Add success indicator (checkmark) for touched valid fields
        if (validationState.touched[fieldId] || validationState.touched[fieldId.replace('-', '')]) {
            addSuccessIndicator(element);
        }
    } else {
        // Add error styling
        element.classList.remove('border-gray-300', 'focus:ring-blue-500', 'focus:border-blue-500');
        element.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');

        // Show error message
        if (errorContainer) {
            errorContainer.classList.remove('hidden');
            errorContainer.textContent = validationResult.error;
        } else {
            // Create error container if it doesn't exist
            createErrorContainer(element, validationResult.error);
        }

        // Remove success indicator
        removeSuccessIndicator(element);
    }
}

/**
 * Create error message container for a field
 * @param {HTMLElement} element - Input element
 * @param {string} errorMessage - Error message to display
 */
function createErrorContainer(element, errorMessage) {
    const errorDiv = document.createElement('div');
    errorDiv.id = `${element.id}-error`;
    errorDiv.className = 'text-red-600 text-sm mt-1 flex items-center';
    errorDiv.innerHTML = `
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <span>${errorMessage}</span>
    `;

    // Insert after the input element
    element.parentNode.insertBefore(errorDiv, element.nextSibling);
}

/**
 * Add success indicator (checkmark) to valid field
 * @param {HTMLElement} element - Input element
 */
function addSuccessIndicator(element) {
    // Remove existing indicator
    removeSuccessIndicator(element);

    const indicator = document.createElement('div');
    indicator.id = `${element.id}-success`;
    indicator.className = 'absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600';
    indicator.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
    `;

    // Make parent position relative if not already
    if (window.getComputedStyle(element.parentNode).position === 'static') {
        element.parentNode.style.position = 'relative';
    }

    element.parentNode.appendChild(indicator);
}

/**
 * Remove success indicator from field
 * @param {HTMLElement} element - Input element
 */
function removeSuccessIndicator(element) {
    const existing = document.getElementById(`${element.id}-success`);
    if (existing) {
        existing.remove();
    }
}

/**
 * Validate all form fields before submission
 * @returns {boolean} - True if all fields valid
 */
function validateAllFields() {
    let isValid = true;
    const errors = {};

    // Validate each field in formData
    for (const [fieldName, value] of Object.entries(state.formData)) {
        const result = validateField(fieldName, value);

        if (!result.valid) {
            isValid = false;
            errors[fieldName] = result.error;
        }

        // Mark all fields as touched
        validationState.touched[fieldName] = true;

        // Update UI for each field
        const element = document.getElementById(getInputIdForField(fieldName));
        if (element) {
            updateFieldValidationUI(element, result);
        }
    }

    validationState.errors = errors;

    // Scroll to first error
    if (!isValid) {
        const firstErrorField = Object.keys(errors)[0];
        const firstErrorElement = document.getElementById(getInputIdForField(firstErrorField));
        if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorElement.focus();
        }
    }

    return isValid;
}

/**
 * Get input element ID from field name
 * @param {string} fieldName - Field name in state
 * @returns {string} - Input element ID
 */
function getInputIdForField(fieldName) {
    const idMap = {
        propertyValue: 'property-value',
        address: 'property-address',
        propertyType: 'property-type',
        state: 'property-state',
        entityType: 'entity-type',
        depositPercent: 'deposit-percent',
        firstHomeBuyer: 'first-home-buyer'
    };

    return idMap[fieldName] || fieldName;
}

/**
 * Enhanced calculate handler with comprehensive validation
 */
function handleValidatedCalculate() {
    // Sanitize address input
    state.formData.address = sanitizeHTML(state.formData.address);

    validationState.isSubmitting = true;

    // Validate all fields
    if (!validateAllFields()) {
        validationState.isSubmitting = false;

        // Count errors
        const errorCount = Object.keys(validationState.errors).length;
        const errorMessage = errorCount === 1
            ? 'Please fix the error above'
            : `Please fix ${errorCount} errors above`;

        showNotification(errorMessage, 'error', 5000);
        return;
    }

    // Additional business logic validation
    const propertyValue = parseFloat(state.formData.propertyValue);

    // Warning for high-value properties
    if (propertyValue > 50000000) {
        showNotification('High-value property detected. Calculations may require additional review.', 'warning', 7000);
    }

    // Warning for very low deposits
    const depositPercent = parseInt(state.formData.depositPercent);
    if (depositPercent < 20) {
        showNotification('Deposits below 20% typically require Lenders Mortgage Insurance (LMI).', 'info', 7000);
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
        validationState.isSubmitting = false;
        state.currentStep = 'results';
        render();

        showNotification('Calculation completed successfully!', 'success', 3000);
    });
}

/**
 * Clear all validation errors
 */
function clearValidationErrors() {
    validationState.errors = {};
    validationState.touched = {};

    // Clear all error containers
    document.querySelectorAll('[id$="-error"]').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
    });

    // Clear all error styling
    document.querySelectorAll('.border-red-500').forEach(el => {
        el.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        el.classList.add('border-gray-300', 'focus:ring-blue-500', 'focus:border-blue-500');
    });

    // Remove all success indicators
    document.querySelectorAll('[id$="-success"]').forEach(el => {
        el.remove();
    });
}

/**
 * Reset validation state when changing steps
 */
function resetValidationState() {
    clearValidationErrors();
    validationState.isSubmitting = false;
}

// Export functions to global scope for HTML access
if (typeof window !== 'undefined') {
    window.handleValidatedAddressInput = handleValidatedAddressInput;
    window.handleValidatedPropertyValueInput = handleValidatedPropertyValueInput;
    window.handleValidatedSelectChange = handleValidatedSelectChange;
    window.handleValidatedCalculate = handleValidatedCalculate;
    window.clearValidationErrors = clearValidationErrors;
    window.resetValidationState = resetValidationState;
}
