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

    // Initialize FAQ system
    if (typeof initFAQSystem === 'function') {
        initFAQSystem();
    }

    // Initialize Timeline system
    if (typeof initTimelineSystem === 'function') {
        initTimelineSystem();
    }

    // Check critical modules are loaded
    console.log('[MAIN DEBUG] Checking critical modules on initialization...');
    console.log('[MAIN DEBUG] window.FIRBEligibility:', typeof window.FIRBEligibility);
    console.log('[MAIN DEBUG] window.FIRBConstants:', typeof window.FIRBConstants);
    console.log('[MAIN DEBUG] window.state:', typeof window.state);
    
    if (typeof window.FIRBEligibility === 'undefined') {
        console.error('❌ CRITICAL: FIRB Eligibility module not loaded on initialization!');
        console.error('This will cause eligibility wizard to use fallback logic');
    }

    // Render the initial page
    render();

    // Initialize Lucide icons
    lucide.createIcons();

    console.log('FIRB Calculator initialized successfully');
    console.log('Current step:', state.currentStep);
});

/**
 * Run FIRB Eligibility Tests
 * This function runs the comprehensive test suite and displays results
 */
function runFIRBEligibilityTests() {
    console.log('\n\n========================================');
    console.log('🧪 RUNNING FIRB ELIGIBILITY TESTS');
    console.log('========================================\n');

    try {
        // Check if the module is loaded
        console.log('[MAIN DEBUG] Checking FIRB Eligibility module on page load...');
        console.log('[MAIN DEBUG] window.FIRBEligibility:', typeof window.FIRBEligibility);
        console.log('[MAIN DEBUG] window.FIRBConstants:', typeof window.FIRBConstants);
        
        if (typeof window.FIRBEligibility === 'undefined') {
            console.error('❌ ERROR: FIRB Eligibility module not loaded!');
            console.error('Make sure src/utils/firbEligibility.js is included in index.html');
            showToast('FIRB Eligibility module not loaded', 'error');
            return;
        }

        const { runEligibilityTests } = window.FIRBEligibility;

        if (typeof runEligibilityTests !== 'function') {
            console.error('❌ ERROR: runEligibilityTests function not found!');
            showToast('Test function not found', 'error');
            return;
        }

        // Run the tests
        console.log('Starting test execution...\n');
        const startTime = performance.now();

        const results = runEligibilityTests();

        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);

        // Display summary
        console.log('\n========================================');
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('========================================');
        console.log(`Total Tests: ${results.totalTests}`);
        console.log(`✅ Passed: ${results.passed}`);
        console.log(`❌ Failed: ${results.failed}`);
        console.log(`📈 Pass Rate: ${results.passRate}%`);
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log('========================================\n');

        // Display detailed results
        console.log('📋 DETAILED TEST RESULTS:');
        console.log('----------------------------------------');
        results.results.forEach((result, index) => {
            const icon = result.passed ? '✅' : '❌';
            const status = result.passed ? 'PASS' : 'FAIL';
            console.log(`${icon} Test ${index + 1}: ${result.test} - ${status}`);

            if (!result.passed && result.error) {
                console.log(`   Error: ${result.error}`);
            } else if (!result.passed) {
                console.log(`   Expected:`, result.expected);
                console.log(`   Got:`, result.actual);
            }
        });
        console.log('----------------------------------------\n');

        // Show toast notification
        if (results.failed === 0) {
            showToast(`All ${results.totalTests} tests passed! 🎉`, 'success', 7000);
            console.log('🎉 ALL TESTS PASSED! 🎉\n');
        } else {
            showToast(`${results.failed} test(s) failed. Check console for details.`, 'error', 7000);
            console.log(`⚠️  ${results.failed} test(s) failed. Review output above.\n`);
        }

        // Display some example results
        console.log('📝 EXAMPLE TEST RESULTS:');
        console.log('----------------------------------------');

        // Show first 3 successful tests
        const successfulTests = results.results.filter(r => r.passed).slice(0, 3);
        successfulTests.forEach(result => {
            if (result.fullResult) {
                console.log(`\n✅ ${result.test}`);
                console.log('   Input:', {
                    citizenship: result.fullResult.citizenshipStatus,
                    visa: result.fullResult.visaType,
                    property: result.fullResult.propertyType
                });
                console.log('   Result:', result.fullResult.result);
                console.log('   FIRB Required:', result.fullResult.firbRequired);
                console.log('   Reason:', result.fullResult.reason);
            }
        });
        console.log('----------------------------------------\n');

        console.log('✨ Test execution complete. Check output above for details.\n');
        console.log('========================================\n\n');

    } catch (error) {
        console.error('\n❌ ERROR RUNNING TESTS:', error);
        console.error('Stack:', error.stack);
        showToast('Error running tests: ' + error.message, 'error');
    }
}
