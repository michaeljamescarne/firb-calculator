/**
 * Scenario Management System for FIRB Calculator
 * Handles saving, loading, comparing, and exporting scenarios
 * @file scenarios.js
 */

/**
 * Auto-save state
 */
let autoSaveInterval = null;
let lastAutoSave = null;

/**
 * Initialize scenarios system
 */
function initScenariosSystem() {
    // Start auto-save timer (every 30 seconds)
    startAutoSave();

    // Load last auto-saved data
    loadAutoSavedData();

    // Update last saved indicator every minute
    setInterval(updateLastSavedIndicator, 60000);
}

/**
 * Start auto-save timer
 */
function startAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }

    autoSaveInterval = setInterval(() => {
        autoSaveProgress();
    }, 30000); // 30 seconds
}

/**
 * Auto-save current form progress
 */
function autoSaveProgress() {
    const autoSaveData = {
        timestamp: Date.now(),
        currentStep: state.currentStep,
        eligibilityData: state.eligibilityData,
        formData: state.formData,
        isEligible: state.isEligible
    };

    if (saveToStorage('firb_autosave', autoSaveData)) {
        lastAutoSave = Date.now();
        updateLastSavedIndicator();
    }
}

/**
 * Load auto-saved data on page load
 */
function loadAutoSavedData() {
    const autoSaveData = loadFromStorage('firb_autosave');

    if (autoSaveData && autoSaveData.timestamp) {
        // Only restore if less than 24 hours old
        const age = Date.now() - autoSaveData.timestamp;
        if (age < 24 * 60 * 60 * 1000) {
            // Restore state
            if (autoSaveData.eligibilityData) {
                state.eligibilityData = autoSaveData.eligibilityData;
            }
            if (autoSaveData.formData) {
                state.formData = autoSaveData.formData;
            }
            if (autoSaveData.isEligible) {
                // TEMPORARY FIX: Don't restore old eligibility data to prevent overriding new calculations
                console.log('[SCENARIOS] Skipping restoration of old eligibility data:', autoSaveData.isEligible);
                // state.isEligible = autoSaveData.isEligible;
            }

            lastAutoSave = autoSaveData.timestamp;

            // TEMPORARY FIX: Disable session restoration notification
            console.log('[SCENARIOS] Session restoration disabled - not showing notification');
            // showNotification('Your previous session was restored', 'info', 3000);
        }
    }
}

/**
 * Update last saved indicator in UI
 */
function updateLastSavedIndicator() {
    const indicator = document.getElementById('last-saved-indicator');
    if (!indicator || !lastAutoSave) return;

    const minutesAgo = Math.floor((Date.now() - lastAutoSave) / 60000);

    let text = '';
    if (minutesAgo === 0) {
        text = 'Saved just now';
    } else if (minutesAgo === 1) {
        text = 'Saved 1 minute ago';
    } else if (minutesAgo < 60) {
        text = `Saved ${minutesAgo} minutes ago`;
    } else {
        const hoursAgo = Math.floor(minutesAgo / 60);
        text = hoursAgo === 1 ? 'Saved 1 hour ago' : `Saved ${hoursAgo} hours ago`;
    }

    indicator.textContent = text;
}

/**
 * Get last saved indicator HTML
 * @returns {string} HTML for indicator
 */
function getLastSavedIndicatorHTML() {
    if (!lastAutoSave) return '';

    return `
        <div class="flex items-center space-x-2 text-xs text-gray-500">
            ${icons.checkCircle('w-3 h-3 text-green-500')}
            <span id="last-saved-indicator"></span>
        </div>
    `;
}

/**
 * Save current state as named scenario
 * @param {string} name - Scenario name
 * @returns {boolean} Success status
 */
function saveScenario(name) {
    if (!name || name.trim() === '') {
        showNotification('Please enter a scenario name', 'warning');
        return false;
    }

    // Validate that we have data to save
    if (!state.calculatedFees) {
        showNotification('Please calculate fees first', 'warning');
        return false;
    }

    const scenario = {
        id: Date.now(),
        name: name.trim(),
        timestamp: Date.now(),
        eligibilityData: state.eligibilityData,
        formData: state.formData,
        isEligible: state.isEligible,
        fees: state.calculatedFees
    };

    // Load existing scenarios
    const scenarios = loadScenarios();

    // Add new scenario
    scenarios.push(scenario);

    // Save back to storage
    if (saveToStorage('firb_scenarios', scenarios)) {
        showNotification(`Scenario "${name}" saved successfully`, 'success', 3000);
        render(); // Re-render to update scenarios list
        return true;
    }

    return false;
}

/**
 * Load all saved scenarios
 * @returns {Array} Array of scenario objects
 */
function loadScenarios() {
    const scenarios = loadFromStorage('firb_scenarios');
    return scenarios || [];
}

/**
 * Delete a scenario by ID
 * @param {number} id - Scenario ID
 * @returns {boolean} Success status
 */
function deleteScenario(id) {
    const scenarios = loadScenarios();
    const filtered = scenarios.filter(s => s.id !== id);

    if (saveToStorage('firb_scenarios', filtered)) {
        showNotification('Scenario deleted', 'info', 2000);
        render();
        return true;
    }

    return false;
}

/**
 * Load a scenario and apply it to current state
 * @param {number} id - Scenario ID
 */
function loadScenario(id) {
    const scenarios = loadScenarios();
    const scenario = scenarios.find(s => s.id === id);

    if (!scenario) {
        showNotification('Scenario not found', 'error');
        return;
    }

    // Apply scenario data to state
    state.eligibilityData = scenario.eligibilityData;
    state.formData = scenario.formData;
    state.isEligible = scenario.isEligible;
    state.calculatedFees = scenario.fees;
    state.currentStep = 'results';

    showNotification(`Loaded scenario: ${scenario.name}`, 'success', 2000);
    render();
}

/**
 * Render scenarios sidebar
 * @returns {string} HTML for scenarios sidebar
 */
function renderScenariosSidebar() {
    const scenarios = loadScenarios();

    if (scenarios.length === 0) {
        return `
            <div class="bg-gray-50 p-4 rounded-lg text-center">
                <p class="text-sm text-gray-500">No saved scenarios yet</p>
                <p class="text-xs text-gray-400 mt-2">Calculate fees and save your first scenario</p>
            </div>
        `;
    }

    return `
        <div class="space-y-3">
            ${scenarios.map(scenario => `
                <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-900">${escapeHTML(scenario.name)}</h4>
                            <p class="text-xs text-gray-500 mt-1">
                                ${new Date(scenario.timestamp).toLocaleDateString('en-AU', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <input type="checkbox"
                            id="compare-${scenario.id}"
                            onchange="toggleScenarioCompare(${scenario.id})"
                            class="w-4 h-4 text-blue-600 rounded">
                    </div>

                    <div class="text-sm text-gray-600 mb-3">
                        <div class="flex justify-between">
                            <span>Property Value:</span>
                            <span class="font-semibold">${formatCurrency(parseFloat(scenario.formData.propertyValue))}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>State:</span>
                            <span class="font-semibold">${scenario.formData.state}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>First Year Total:</span>
                            <span class="font-bold text-green-600">${formatCurrency(scenario.fees.firstYearTotal)}</span>
                        </div>
                    </div>

                    <div class="flex space-x-2">
                        <button onclick="loadScenario(${scenario.id})"
                            class="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-blue-700 transition">
                            Load
                        </button>
                        <button onclick="deleteScenario(${scenario.id})"
                            class="bg-red-100 text-red-700 px-3 py-2 rounded text-xs font-semibold hover:bg-red-200 transition">
                            Delete
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * State for scenario comparison
 */
let selectedScenariosForCompare = [];

/**
 * Toggle scenario selection for comparison
 * @param {number} id - Scenario ID
 */
function toggleScenarioCompare(id) {
    const index = selectedScenariosForCompare.indexOf(id);

    if (index > -1) {
        selectedScenariosForCompare.splice(index, 1);
    } else {
        if (selectedScenariosForCompare.length >= 3) {
            showNotification('You can compare up to 3 scenarios', 'warning');
            // Uncheck the checkbox
            const checkbox = document.getElementById(`compare-${id}`);
            if (checkbox) checkbox.checked = false;
            return;
        }
        selectedScenariosForCompare.push(id);
    }

    updateCompareButton();
}

/**
 * Update compare button visibility and state
 */
function updateCompareButton() {
    const compareBtn = document.getElementById('compare-scenarios-btn');
    if (!compareBtn) return;

    if (selectedScenariosForCompare.length >= 2) {
        compareBtn.disabled = false;
        compareBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        compareBtn.textContent = `Compare ${selectedScenariosForCompare.length} Scenarios`;
    } else {
        compareBtn.disabled = true;
        compareBtn.classList.add('opacity-50', 'cursor-not-allowed');
        compareBtn.textContent = 'Select 2-3 to Compare';
    }
}

/**
 * Show scenario comparison
 */
function showScenarioComparison() {
    if (selectedScenariosForCompare.length < 2) {
        showNotification('Please select at least 2 scenarios to compare', 'warning');
        return;
    }

    const scenarios = loadScenarios();
    const compareScenarios = selectedScenariosForCompare
        .map(id => scenarios.find(s => s.id === id))
        .filter(s => s !== undefined);

    if (compareScenarios.length < 2) {
        showNotification('Selected scenarios not found', 'error');
        return;
    }

    // Store for comparison view
    state.comparingScenarios = compareScenarios;
    state.currentStep = 'compare';
    render();
}

/**
 * Render scenario comparison view
 * @returns {string} HTML for comparison view
 */
function renderScenarioComparison() {
    const scenarios = state.comparingScenarios;

    if (!scenarios || scenarios.length < 2) {
        return '<div>No scenarios to compare</div>';
    }

    // Find best scenario (lowest first year total)
    const bestScenario = scenarios.reduce((best, current) =>
        current.fees.firstYearTotal < best.fees.firstYearTotal ? current : best
    );

    return `
        <section class="py-20 bg-gray-50 min-h-screen">
            <div class="max-w-7xl mx-auto px-4">
                <button onclick="goToStep('results'); state.comparingScenarios = null;"
                    class="text-blue-600 mb-8 flex items-center space-x-2">
                    ${icons.arrowLeft('w-5 h-5')}
                    <span>Back to Results</span>
                </button>

                <div class="bg-white p-8 rounded-xl shadow-md">
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-3xl font-bold">Scenario Comparison</h2>
                        <button onclick="exportComparisonPDF()"
                            class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center space-x-2">
                            ${icons.download('w-5 h-5')}
                            <span>Export as PDF</span>
                        </button>
                    </div>

                    <!-- Comparison Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr class="bg-gray-100">
                                    <th class="text-left p-4 font-bold text-gray-700 border-b-2">Item</th>
                                    ${scenarios.map(s => `
                                        <th class="text-center p-4 border-b-2 ${s.id === bestScenario.id ? 'bg-green-50' : ''}">
                                            <div class="font-bold text-gray-900">${escapeHTML(s.name)}</div>
                                            ${s.id === bestScenario.id ? '<div class="text-xs text-green-600 font-semibold mt-1">✓ Best Option</div>' : ''}
                                        </th>
                                    `).join('')}
                                </tr>
                            </thead>
                            <tbody class="text-sm">
                                ${renderComparisonRow('Property Details', null, scenarios, true)}
                                ${renderComparisonRow('Property Value', s => formatCurrency(parseFloat(s.formData.propertyValue)), scenarios)}
                                ${renderComparisonRow('State', s => s.formData.state, scenarios)}
                                ${renderComparisonRow('Property Type', s => s.formData.propertyType, scenarios)}
                                ${renderComparisonRow('Entity Type', s => s.formData.entityType, scenarios)}
                                ${renderComparisonRow('Deposit %', s => s.formData.depositPercent + '%', scenarios)}

                                ${renderComparisonRow('Foreign Investment Fees', null, scenarios, true)}
                                ${renderComparisonRow('FIRB Application Fee', s => formatCurrency(s.fees.firb), scenarios, bestScenario)}
                                ${renderComparisonRow('Stamp Duty Surcharge', s => formatCurrency(s.fees.stampDuty), scenarios, bestScenario)}
                                ${renderComparisonRow('Legal Fees', s => formatCurrency(s.fees.legal), scenarios, bestScenario)}
                                ${renderComparisonRow('Foreign Total', s => formatCurrency(s.fees.foreignTotal), scenarios, bestScenario, true)}

                                ${renderComparisonRow('Standard Property Fees', null, scenarios, true)}
                                ${renderComparisonRow('Standard Stamp Duty', s => formatCurrency(s.fees.standard.stampDuty), scenarios, bestScenario)}
                                ${renderComparisonRow('Other Fees', s => formatCurrency(s.fees.standardTotal - s.fees.standard.stampDuty), scenarios, bestScenario)}
                                ${renderComparisonRow('Standard Total', s => formatCurrency(s.fees.standardTotal), scenarios, bestScenario, true)}

                                ${renderComparisonRow('Annual Ongoing Fees', null, scenarios, true)}
                                ${renderComparisonRow('Vacancy Fee', s => formatCurrency(s.fees.annual.vacancyFee), scenarios, bestScenario)}
                                ${renderComparisonRow('Land Tax Surcharge', s => formatCurrency(s.fees.annual.landTaxSurcharge), scenarios, bestScenario)}
                                ${renderComparisonRow('Other Annual Costs', s => formatCurrency(s.fees.annualTotal - s.fees.annual.vacancyFee - s.fees.annual.landTaxSurcharge), scenarios, bestScenario)}
                                ${renderComparisonRow('Annual Total', s => formatCurrency(s.fees.annualTotal), scenarios, bestScenario, true)}

                                ${renderComparisonRow('Totals', null, scenarios, true)}
                                ${renderComparisonRow('Upfront Costs', s => formatCurrency(s.fees.grandTotal), scenarios, bestScenario, true)}
                                ${renderComparisonRow('First Year Total', s => formatCurrency(s.fees.firstYearTotal), scenarios, bestScenario, true, 'text-xl font-bold')}
                                ${renderComparisonRow('10-Year Total', s => formatCurrency(s.fees.grandTotal + (s.fees.annualTotal * 10)), scenarios, bestScenario, true, 'text-lg font-bold')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Savings Summary -->
                    <div class="mt-8 grid grid-cols-1 md:grid-cols-${scenarios.length} gap-4">
                        ${scenarios.map(s => {
                            const savings = s.fees.firstYearTotal - bestScenario.fees.firstYearTotal;
                            return `
                                <div class="p-4 rounded-lg ${s.id === bestScenario.id ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-50'}">
                                    <h4 class="font-bold mb-2">${escapeHTML(s.name)}</h4>
                                    ${s.id === bestScenario.id ? `
                                        <p class="text-green-600 font-bold">✓ Lowest Cost</p>
                                    ` : `
                                        <p class="text-red-600">+${formatCurrency(savings)} more than best option</p>
                                    `}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </section>
    `;
}

/**
 * Render a comparison table row
 * @param {string} label - Row label
 * @param {Function} valueFunc - Function to extract value from scenario
 * @param {Array} scenarios - Array of scenarios
 * @param {Object} bestScenario - Best scenario object (for highlighting)
 * @param {boolean} isBold - Whether to bold the row
 * @param {string} extraClasses - Additional CSS classes
 * @returns {string} HTML for table row
 */
function renderComparisonRow(label, valueFunc, scenarios, bestScenario = null, isBold = false, extraClasses = '') {
    if (!valueFunc) {
        // Header row
        return `
            <tr class="bg-gray-50">
                <td colspan="${scenarios.length + 1}" class="p-4 font-bold text-gray-800 border-t-2">${label}</td>
            </tr>
        `;
    }

    return `
        <tr class="hover:bg-gray-50 ${isBold ? 'bg-blue-50' : ''}">
            <td class="p-4 text-gray-700 ${isBold ? 'font-bold' : ''} border-b">${label}</td>
            ${scenarios.map(s => {
                const value = valueFunc(s);
                const isBest = bestScenario && s.id === bestScenario.id;
                return `
                    <td class="text-center p-4 border-b ${isBest ? 'bg-green-50 font-semibold' : ''} ${extraClasses}">
                        ${value}
                    </td>
                `;
            }).join('')}
        </tr>
    `;
}

/**
 * Export comparison as PDF
 */
function exportComparisonPDF() {
    // For now, use print dialog which allows "Save as PDF"
    // In production, could use jsPDF library for more control
    window.print();
    showNotification('Use "Save as PDF" in the print dialog', 'info', 5000);
}

/**
 * Export scenarios as JSON file
 */
function exportScenariosJSON() {
    const scenarios = loadScenarios();

    if (scenarios.length === 0) {
        showNotification('No scenarios to export', 'warning');
        return;
    }

    const dataStr = JSON.stringify(scenarios, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firb-scenarios-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Scenarios exported successfully', 'success', 3000);
}

/**
 * Import scenarios from JSON file
 */
function importScenariosJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedScenarios = JSON.parse(event.target.result);

                if (!Array.isArray(importedScenarios)) {
                    throw new Error('Invalid format');
                }

                const existingScenarios = loadScenarios();
                const merged = [...existingScenarios, ...importedScenarios];

                if (saveToStorage('firb_scenarios', merged)) {
                    showNotification(`Imported ${importedScenarios.length} scenarios`, 'success', 3000);
                    render();
                }
            } catch (error) {
                showNotification('Invalid JSON file', 'error');
                console.error('Import error:', error);
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

/**
 * Render save scenario modal
 * @returns {string} HTML for modal
 */
function renderSaveScenarioModal() {
    return `
        <div id="save-scenario-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold mb-4">Save Scenario</h3>
                <p class="text-gray-600 mb-6">Give this calculation a name so you can load or compare it later.</p>

                <input type="text"
                    id="scenario-name-input"
                    placeholder="e.g., Sydney Apartment, Melbourne House"
                    class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-6"
                    maxlength="50">

                <div class="flex space-x-4">
                    <button onclick="closeSaveScenarioModal()"
                        class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300">
                        Cancel
                    </button>
                    <button onclick="confirmSaveScenario()"
                        class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                        Save
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Show save scenario modal
 */
function showSaveScenarioModal() {
    const modal = document.getElementById('save-scenario-modal');
    if (modal) {
        modal.classList.remove('hidden');
        const input = document.getElementById('scenario-name-input');
        if (input) {
            input.focus();
            input.value = '';
        }
    }
}

/**
 * Close save scenario modal
 */
function closeSaveScenarioModal() {
    const modal = document.getElementById('save-scenario-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

/**
 * Confirm and save scenario
 */
function confirmSaveScenario() {
    const input = document.getElementById('scenario-name-input');
    if (input && input.value.trim()) {
        if (saveScenario(input.value.trim())) {
            closeSaveScenarioModal();
        }
    } else {
        showNotification('Please enter a scenario name', 'warning');
    }
}
