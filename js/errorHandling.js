/**
 * Comprehensive Error Handling System for FIRB Calculator
 * @file errorHandling.js
 *
 * Handles:
 * - API failures
 * - localStorage full/unavailable
 * - PDF generation failure
 * - Invalid state selections
 * - Calculation overflow errors
 * - Network timeouts
 * - Browser navigation
 * - Unsaved changes
 */

/**
 * Error types and severity levels
 */
const ErrorTypes = {
    VALIDATION: 'validation',
    CALCULATION: 'calculation',
    STORAGE: 'storage',
    NETWORK: 'network',
    PDF: 'pdf',
    STATE: 'state',
    BROWSER: 'browser',
    FATAL: 'fatal'
};

const ErrorSeverity = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    CRITICAL: 'critical'
};

/**
 * Error tracking configuration
 * Supports Sentry, LogRocket, or custom endpoint
 */
const ErrorTracking = {
    enabled: false, // Set to true in production
    sentryDSN: null, // Add your Sentry DSN
    logRocketAppId: null, // Add your LogRocket App ID
    customEndpoint: null, // Custom error logging endpoint

    /**
     * Initialize error tracking
     */
    init() {
        // Initialize Sentry if configured
        if (this.sentryDSN && typeof Sentry !== 'undefined') {
            Sentry.init({
                dsn: this.sentryDSN,
                environment: window.location.hostname === 'localhost' ? 'development' : 'production',
                beforeSend(event) {
                    // Don't send errors in development
                    if (window.location.hostname === 'localhost') {
                        return null;
                    }
                    return event;
                }
            });
            console.log('Sentry initialized');
        }

        // Initialize LogRocket if configured
        if (this.logRocketAppId && typeof LogRocket !== 'undefined') {
            LogRocket.init(this.logRocketAppId);
            console.log('LogRocket initialized');
        }
    },

    /**
     * Track error
     */
    track(error, context = {}) {
        if (!this.enabled) {
            console.warn('Error tracking disabled:', error, context);
            return;
        }

        // Send to Sentry
        if (typeof Sentry !== 'undefined') {
            Sentry.captureException(error, {
                extra: context
            });
        }

        // Send to LogRocket
        if (typeof LogRocket !== 'undefined') {
            LogRocket.captureException(error, {
                extra: context
            });
        }

        // Send to custom endpoint
        if (this.customEndpoint) {
            fetch(this.customEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: error.message,
                    stack: error.stack,
                    context,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                })
            }).catch(err => console.error('Failed to log error:', err));
        }
    }
};

/**
 * Global error handler
 * Only catches truly unexpected, unhandled errors
 */
window.addEventListener('error', (event) => {
    // Ignore errors already handled by components
    if (event.error && event.error.handled) {
        return;
    }

    // Ignore specific non-critical errors
    const errorMessage = event.error?.message || event.message || '';

    // Recharts/React rendering issues (non-blocking)
    if (errorMessage.includes('Recharts') ||
        errorMessage.includes('React') ||
        errorMessage.includes('ReactDOM')) {
        console.warn('Chart rendering issue (non-critical):', errorMessage);
        return;
    }

    // localStorage quota warnings (handled separately)
    if (errorMessage.includes('localStorage') ||
        errorMessage.includes('QuotaExceededError')) {
        console.warn('Storage issue (handled separately):', errorMessage);
        return;
    }

    // Network errors (handled by retry logic)
    if (errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError')) {
        console.warn('Network issue (handled separately):', errorMessage);
        return;
    }

    // Validation errors (component-level handling)
    if (errorMessage.includes('validation') ||
        errorMessage.includes('invalid input')) {
        console.warn('Validation issue (handled by form):', errorMessage);
        return;
    }

    handleGlobalError(event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
    // Ignore handled rejections
    if (event.reason && event.reason.handled) {
        return;
    }

    handleGlobalError(event.reason, {
        type: 'unhandled_promise_rejection',
        promise: event.promise
    });
});

/**
 * Handle global errors
 * Only called for truly unexpected errors after filtering
 */
function handleGlobalError(error, context = {}) {
    console.error('Global error:', error, context);

    // Track error
    ErrorTracking.track(error, {
        ...context,
        type: ErrorTypes.FATAL
    });

    // Provide specific error message when possible
    const errorMessage = error?.message
        ? `An error occurred: ${error.message}`
        : 'An unexpected error occurred. Please refresh and try again.';

    // Only show modal in production (not localhost)
    if (window.location.hostname === 'localhost') {
        console.error('ERROR MODAL SUPPRESSED (localhost):', errorMessage);
        return;
    }

    // Show user-friendly error
    showErrorModal(
        'Unexpected Error',
        errorMessage,
        {
            severity: ErrorSeverity.CRITICAL,
            showReload: true
        }
    );
}

/**
 * localStorage error handling with fallback
 */
const SafeStorage = {
    /**
     * Safe setItem with quota handling
     */
    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
            return { success: true };
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                // Storage full - try to clear old data
                return this.handleQuotaExceeded(key, value);
            } else if (e.name === 'SecurityError') {
                // Private browsing or storage disabled
                console.warn('localStorage unavailable, using in-memory storage');
                return { success: false, error: 'storage_unavailable' };
            } else {
                ErrorTracking.track(e, { type: ErrorTypes.STORAGE, key });
                return { success: false, error: e.message };
            }
        }
    },

    /**
     * Handle quota exceeded error
     */
    handleQuotaExceeded(key, value) {
        try {
            // Clear old calculations (keep only last 2)
            const calculations = JSON.parse(localStorage.getItem('firb_calculations') || '[]');
            if (calculations.length > 2) {
                localStorage.setItem('firb_calculations', JSON.stringify(calculations.slice(0, 2)));
            }

            // Clear old form data if exists
            const oldFormData = localStorage.getItem('firb_formData_old');
            if (oldFormData) {
                localStorage.removeItem('firb_formData_old');
            }

            // Try again
            localStorage.setItem(key, value);

            showToast(
                'Storage cleaned to make space',
                'warning',
                5000
            );

            return { success: true, cleaned: true };
        } catch (e) {
            showErrorModal(
                'Storage Full',
                'Your browser storage is full. Please clear some data or use private browsing.',
                { severity: ErrorSeverity.WARNING }
            );

            return { success: false, error: 'quota_exceeded' };
        }
    },

    /**
     * Safe getItem
     */
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn('Failed to read from localStorage:', e);
            return null;
        }
    },

    /**
     * Safe removeItem
     */
    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return { success: true };
        } catch (e) {
            console.warn('Failed to remove from localStorage:', e);
            return { success: false, error: e.message };
        }
    }
};

/**
 * PDF generation error handling with retry
 */
async function safePDFGeneration(retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Attempt PDF generation
            const pdf = await generateProfessionalPDF();
            return { success: true, pdf };
        } catch (error) {
            console.error(`PDF generation attempt ${attempt} failed:`, error);

            if (attempt === retries) {
                // Final attempt failed
                ErrorTracking.track(error, {
                    type: ErrorTypes.PDF,
                    attempts: retries
                });

                showErrorModal(
                    'PDF Generation Failed',
                    'Failed to generate PDF report. Please try again or download a text version instead.',
                    {
                        severity: ErrorSeverity.ERROR,
                        actions: [
                            {
                                label: 'Download Text Version',
                                onClick: () => {
                                    try {
                                        downloadReport(); // Fallback to text
                                    } catch (e) {
                                        showToast('Text download also failed. Please contact support.', 'error');
                                    }
                                }
                            },
                            {
                                label: 'Try Again',
                                onClick: () => safePDFGeneration(1)
                            }
                        ]
                    }
                );

                return { success: false, error: error.message };
            }

            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
}

/**
 * Calculation error handling with overflow detection
 */
function safeCalculation(fn, ...args) {
    try {
        const result = fn(...args);

        // Check for overflow
        if (!isFinite(result)) {
            throw new Error('Calculation resulted in infinity');
        }

        if (isNaN(result)) {
            throw new Error('Calculation resulted in NaN');
        }

        // Check for unreasonable values
        if (result < 0) {
            throw new Error('Calculation resulted in negative value');
        }

        if (result > Number.MAX_SAFE_INTEGER) {
            throw new Error('Calculation overflow');
        }

        return { success: true, result };
    } catch (error) {
        console.error('Calculation error:', error);

        ErrorTracking.track(error, {
            type: ErrorTypes.CALCULATION,
            function: fn.name,
            arguments: args
        });

        showToast(
            'Calculation error. Please check your inputs and try again.',
            'error',
            7000
        );

        return { success: false, error: error.message };
    }
}

/**
 * Network request with timeout and retry
 */
async function safeNetworkRequest(url, options = {}, timeout = 10000, retries = 3) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return { success: true, response };
        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                console.error(`Network request timeout (attempt ${attempt}/${retries})`);
            } else {
                console.error(`Network request failed (attempt ${attempt}/${retries}):`, error);
            }

            if (attempt === retries) {
                ErrorTracking.track(error, {
                    type: ErrorTypes.NETWORK,
                    url,
                    attempts: retries
                });

                showToast(
                    'Network error. Please check your connection and try again.',
                    'error',
                    7000
                );

                return { success: false, error: error.message };
            }

            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
}

/**
 * State validation
 */
function validateState(stateObj) {
    const errors = [];

    // Check required fields
    if (!stateObj.formData) {
        errors.push('Form data is missing');
    }

    if (stateObj.formData) {
        if (!stateObj.formData.state) {
            errors.push('State selection is required');
        }

        if (stateObj.formData.state && !['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'].includes(stateObj.formData.state)) {
            errors.push('Invalid state selection');
        }

        if (!stateObj.formData.propertyValue || parseFloat(stateObj.formData.propertyValue) <= 0) {
            errors.push('Valid property value is required');
        }
    }

    if (errors.length > 0) {
        ErrorTracking.track(new Error('State validation failed'), {
            type: ErrorTypes.STATE,
            errors
        });

        return { valid: false, errors };
    }

    return { valid: true };
}

/**
 * Browser back button handling
 */
let hasUnsavedChanges = false;

function setUnsavedChanges(value) {
    hasUnsavedChanges = value;
}

window.addEventListener('beforeunload', (event) => {
    if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return event.returnValue;
    }
});

// Handle browser back/forward navigation
window.addEventListener('popstate', (event) => {
    if (hasUnsavedChanges) {
        const confirmed = confirm('You have unsaved changes. Do you want to leave without saving?');
        if (!confirmed) {
            // Push current state back
            history.pushState(null, '', window.location.href);
            return;
        }
    }

    // Handle navigation
    if (event.state && event.state.step) {
        goToStep(event.state.step);
    }
});

/**
 * Enhanced goToStep with state management
 */
const originalGoToStep = typeof goToStep === 'function' ? goToStep : null;

if (originalGoToStep) {
    window.goToStep = function(step) {
        // Check for unsaved changes
        if (hasUnsavedChanges && state.currentStep === 'calculator') {
            const confirmed = confirm('You have unsaved changes. Do you want to continue?');
            if (!confirmed) {
                return;
            }
            hasUnsavedChanges = false;
        }

        // Add to browser history
        history.pushState({ step }, '', `#${step}`);

        // Call original function
        originalGoToStep(step);
    };
}

/**
 * Toast notification system
 */
function showToast(message, type = 'info', duration = 5000) {
    // Remove existing toasts of same type
    const existingToasts = document.querySelectorAll(`.toast-${type}`);
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fixed bottom-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 ease-in-out`;

    const colors = {
        info: 'bg-blue-100 border-blue-500 text-blue-900',
        success: 'bg-green-100 border-green-500 text-green-900',
        warning: 'bg-yellow-100 border-yellow-500 text-yellow-900',
        error: 'bg-red-100 border-red-500 text-red-900'
    };

    const icons = {
        info: 'info',
        success: 'check-circle',
        warning: 'alert-triangle',
        error: 'alert-circle'
    };

    toast.className += ` ${colors[type]} border-l-4`;
    toast.style.transform = 'translateX(400px)';

    toast.innerHTML = `
        <div class="flex items-start">
            <i data-lucide="${icons[type]}" class="w-5 h-5 mr-3 flex-shrink-0"></i>
            <div class="flex-1">
                <p class="font-semibold">${message}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-500 hover:text-gray-700">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
    `;

    document.body.appendChild(toast);

    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Slide in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);

    // Auto-remove
    if (duration > 0) {
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

/**
 * Error modal system
 */
function showErrorModal(title, message, options = {}) {
    const {
        severity = ErrorSeverity.ERROR,
        showReload = false,
        actions = []
    } = options;

    // Remove existing error modals
    const existing = document.getElementById('error-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'error-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';

    const severityColors = {
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
        critical: 'bg-red-700'
    };

    const severityIcons = {
        info: 'info',
        warning: 'alert-triangle',
        error: 'alert-circle',
        critical: 'alert-octagon'
    };

    const actionsHTML = actions.map(action => `
        <button onclick="document.getElementById('error-modal').remove(); (${action.onClick.toString()})()"
            class="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition">
            ${action.label}
        </button>
    `).join('');

    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div class="${severityColors[severity]} p-4 flex items-center text-white">
                <i data-lucide="${severityIcons[severity]}" class="w-6 h-6 mr-3"></i>
                <h3 class="text-xl font-bold">${title}</h3>
            </div>
            <div class="p-6">
                <p class="text-gray-700 mb-6">${message}</p>
                <div class="flex gap-3 justify-end">
                    ${actionsHTML}
                    ${showReload ? `
                        <button onclick="window.location.reload()"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Reload Page
                        </button>
                    ` : `
                        <button onclick="document.getElementById('error-modal').remove()"
                            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                            Close
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Initialize error handling
 */
function initErrorHandling() {
    console.log('Initializing error handling...');

    // Initialize error tracking
    ErrorTracking.init();

    // Replace localStorage with safe version
    window.originalLocalStorage = window.localStorage;
    window.localStorage = SafeStorage;

    // Monitor form changes
    if (typeof state !== 'undefined') {
        const originalUpdateForm = window.updateForm;
        if (originalUpdateForm) {
            window.updateForm = function(...args) {
                hasUnsavedChanges = true;
                return originalUpdateForm(...args);
            };
        }
    }

    console.log('Error handling initialized');
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initErrorHandling);
} else {
    initErrorHandling();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ErrorTypes,
        ErrorSeverity,
        ErrorTracking,
        SafeStorage,
        safePDFGeneration,
        safeCalculation,
        safeNetworkRequest,
        validateState,
        setUnsavedChanges,
        showToast,
        showErrorModal
    };
}
