/**
 * Enhanced Form Components with Professional Styling and Better Validation
 * Provides improved form inputs, validation feedback, and user experience
 */

/**
 * Enhanced form input component with validation states
 * @param {Object} config - Input configuration
 * @returns {string} HTML string for enhanced form input
 */
function renderEnhancedInput(config = {}) {
    const {
        id,
        name,
        type = 'text',
        label,
        placeholder,
        value = '',
        required = false,
        disabled = false,
        error = '',
        success = false,
        helpText = '',
        icon = null,
        onInput = '',
        onFocus = '',
        onBlur = '',
        attributes = {}
    } = config;
    
    const inputId = id || name;
    const hasError = error && error.length > 0;
    const inputClasses = [
        'form-input',
        hasError ? 'error' : '',
        success ? 'success' : '',
        icon ? 'pl-10' : ''
    ].filter(Boolean).join(' ');
    
    const additionalAttributes = Object.entries(attributes)
        .map(([key, val]) => `${key}="${val}"`)
        .join(' ');
    
    return `
        <div class="form-group">
            ${label ? `
                <label for="${inputId}" class="form-label">
                    ${label}
                    ${required ? '<span class="required-indicator">*</span>' : ''}
                </label>
            ` : ''}
            
            <div class="input-container">
                ${icon ? `
                    <div class="input-icon">
                        ${icon}
                    </div>
                ` : ''}
                
                <input
                    id="${inputId}"
                    name="${name}"
                    type="${type}"
                    class="${inputClasses}"
                    placeholder="${placeholder || ''}"
                    value="${value}"
                    ${required ? 'required' : ''}
                    ${disabled ? 'disabled' : ''}
                    ${onInput ? `oninput="${onInput}"` : ''}
                    ${onFocus ? `onfocus="${onFocus}"` : ''}
                    ${onBlur ? `onblur="${onBlur}"` : ''}
                    ${additionalAttributes}
                />
                
                ${success ? `
                    <div class="input-success-icon">
                        <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                ` : ''}
            </div>
            
            ${hasError ? `
                <div class="form-error" id="${inputId}-error">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    ${error}
                </div>
            ` : ''}
            
            ${helpText ? `
                <div class="form-help">
                    ${helpText}
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Enhanced select component with search functionality
 * @param {Object} config - Select configuration
 * @returns {string} HTML string for enhanced select
 */
function renderEnhancedSelect(config = {}) {
    const {
        id,
        name,
        label,
        options = [],
        value = '',
        required = false,
        disabled = false,
        error = '',
        helpText = '',
        placeholder = 'Select an option',
        onChange = '',
        searchable = false
    } = config;
    
    const selectId = id || name;
    const hasError = error && error.length > 0;
    const selectClasses = [
        'form-select',
        hasError ? 'error' : ''
    ].filter(Boolean).join(' ');
    
    return `
        <div class="form-group">
            ${label ? `
                <label for="${selectId}" class="form-label">
                    ${label}
                    ${required ? '<span class="required-indicator">*</span>' : ''}
                </label>
            ` : ''}
            
            <div class="select-container">
                <select
                    id="${selectId}"
                    name="${name}"
                    class="${selectClasses}"
                    ${required ? 'required' : ''}
                    ${disabled ? 'disabled' : ''}
                    ${onChange ? `onchange="${onChange}"` : ''}
                >
                    <option value="" disabled ${!value ? 'selected' : ''}>${placeholder}</option>
                    ${options.map(option => `
                        <option value="${option.value}" ${option.value === value ? 'selected' : ''}>
                            ${option.label}
                        </option>
                    `).join('')}
                </select>
                
                <div class="select-arrow">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </div>
            </div>
            
            ${hasError ? `
                <div class="form-error" id="${selectId}-error">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    ${error}
                </div>
            ` : ''}
            
            ${helpText ? `
                <div class="form-help">
                    ${helpText}
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Enhanced range slider component
 * @param {Object} config - Range configuration
 * @returns {string} HTML string for enhanced range slider
 */
function renderEnhancedRange(config = {}) {
    const {
        id,
        name,
        label,
        min = 0,
        max = 100,
        step = 1,
        value = 50,
        disabled = false,
        error = '',
        helpText = '',
        showLabels = true,
        showValue = true,
        onInput = '',
        onChange = ''
    } = config;
    
    const rangeId = id || name;
    const hasError = error && error.length > 0;
    const rangeClasses = [
        'form-range',
        hasError ? 'error' : ''
    ].filter(Boolean).join(' ');
    
    return `
        <div class="form-group">
            ${label ? `
                <label for="${rangeId}" class="form-label">
                    ${label}
                    ${showValue ? `<span class="range-value">${value}</span>` : ''}
                </label>
            ` : ''}
            
            <div class="range-container">
                <input
                    id="${rangeId}"
                    name="${name}"
                    type="range"
                    class="${rangeClasses}"
                    min="${min}"
                    max="${max}"
                    step="${step}"
                    value="${value}"
                    ${disabled ? 'disabled' : ''}
                    ${onInput ? `oninput="${onInput}"` : ''}
                    ${onChange ? `onchange="${onChange}"` : ''}
                />
                
                ${showLabels ? `
                    <div class="range-labels">
                        <span class="range-min">${min}</span>
                        <span class="range-max">${max}</span>
                    </div>
                ` : ''}
            </div>
            
            ${hasError ? `
                <div class="form-error" id="${rangeId}-error">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    ${error}
                </div>
            ` : ''}
            
            ${helpText ? `
                <div class="form-help">
                    ${helpText}
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Add enhanced form component styles
 */
function addEnhancedFormStyles() {
    if (document.getElementById('enhanced-form-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'enhanced-form-styles';
    style.textContent = `
        /* Enhanced Form Component Styles */
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--color-neutral-700);
            margin-bottom: 0.5rem;
        }
        
        .required-indicator {
            color: var(--color-error-500);
            margin-left: 0.25rem;
        }
        
        .input-container {
            position: relative;
        }
        
        .input-icon {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-neutral-400);
            z-index: 2;
        }
        
        .input-success-icon {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 2;
        }
        
        .form-input.pl-10 {
            padding-left: 2.5rem;
        }
        
        .form-input.pr-10 {
            padding-right: 2.5rem;
        }
        
        .form-select {
            width: 100%;
            padding: 0.75rem 2.5rem 0.75rem 1rem;
            border: 2px solid var(--color-neutral-200);
            border-radius: 0.5rem;
            font-size: 1rem;
            background: white;
            appearance: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .form-select:focus {
            outline: none;
            border-color: var(--color-primary-500);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-select.error {
            border-color: var(--color-error-500);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .select-container {
            position: relative;
        }
        
        .select-arrow {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-neutral-400);
            pointer-events: none;
        }
        
        .form-range {
            width: 100%;
            height: 0.5rem;
            border-radius: 0.25rem;
            background: var(--color-neutral-200);
            outline: none;
            appearance: none;
            cursor: pointer;
        }
        
        .form-range::-webkit-slider-thumb {
            appearance: none;
            width: 1.25rem;
            height: 1.25rem;
            border-radius: 50%;
            background: var(--color-primary-500);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
        }
        
        .form-range::-webkit-slider-thumb:hover {
            background: var(--color-primary-600);
            transform: scale(1.1);
        }
        
        .form-range::-moz-range-thumb {
            width: 1.25rem;
            height: 1.25rem;
            border-radius: 50%;
            background: var(--color-primary-500);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
        }
        
        .form-range::-moz-range-thumb:hover {
            background: var(--color-primary-600);
            transform: scale(1.1);
        }
        
        .range-container {
            margin: 0.5rem 0;
        }
        
        .range-labels {
            display: flex;
            justify-content: space-between;
            margin-top: 0.5rem;
            font-size: 0.75rem;
            color: var(--color-neutral-500);
        }
        
        .range-value {
            font-weight: 600;
            color: var(--color-primary-600);
            margin-left: 0.5rem;
        }
        
        .form-error {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: var(--color-error-600);
            font-weight: 500;
        }
        
        .form-help {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: var(--color-neutral-500);
        }
        
        /* Form validation states */
        .form-input:valid:not(:placeholder-shown) {
            border-color: var(--color-success-500);
        }
        
        .form-input:invalid:not(:placeholder-shown) {
            border-color: var(--color-error-500);
        }
        
        /* Focus states */
        .form-input:focus,
        .form-select:focus,
        .form-range:focus {
            outline: none;
            border-color: var(--color-primary-500);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        /* Disabled states */
        .form-input:disabled,
        .form-select:disabled,
        .form-range:disabled {
            background: var(--color-neutral-100);
            color: var(--color-neutral-400);
            cursor: not-allowed;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
            .form-input,
            .form-select {
                font-size: 16px; /* Prevents zoom on iOS */
            }
            
            .form-group {
                margin-bottom: 1.25rem;
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .form-input,
            .form-select {
                background: var(--color-neutral-800);
                border-color: var(--color-neutral-600);
                color: var(--color-neutral-100);
            }
            
            .form-label {
                color: var(--color-neutral-200);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize styles when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addEnhancedFormStyles);
} else {
    addEnhancedFormStyles();
}
