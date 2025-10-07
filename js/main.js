/**
 * Main initialization file
 * This file initializes the application when the page loads
 * @file main.js
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Load saved form data from localStorage
    const savedFormData = loadFromStorage('firb_formData');
    if (savedFormData) {
        // Restore form data, but sanitize any string inputs
        state.formData = {
            ...state.formData,
            ...savedFormData,
            address: sanitizeHTML(savedFormData.address || '')
        };
    }

    // Load saved calculations from localStorage
    const savedCalculations = loadFromStorage('firb_calculations');
    if (savedCalculations && Array.isArray(savedCalculations)) {
        state.savedCalculations = savedCalculations;
    }

    // Load saved language preference
    const savedLanguage = loadFromStorage('firb_language');
    if (savedLanguage) {
        state.language = savedLanguage;
    }

    // Initialize scenarios system (auto-save, etc.)
    if (typeof initScenariosSystem === 'function') {
        initScenariosSystem();
    }

    // Render the initial page
    render();

    // Initialize Lucide icons
    lucide.createIcons();

    console.log('FIRB Calculator initialized successfully');
    console.log('Current step:', state.currentStep);
});
