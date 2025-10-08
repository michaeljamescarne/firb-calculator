/**
 * Sophisticated Scenario Comparison System
 * @file scenarioComparison.js
 *
 * Allows users to save, compare, and analyze multiple property scenarios
 * Features: side-by-side comparison, visual charts, filtering, sorting, export
 */

/**
 * Maximum number of saved scenarios
 */
const MAX_SCENARIOS = 5;

/**
 * Scenario storage key
 */
const SCENARIOS_STORAGE_KEY = 'firb_saved_scenarios';

/**
 * Comparison state
 */
const comparisonState = {
    scenarios: [],
    sortColumn: 'totalFirstYearCost',
    sortDirection: 'asc',
    filters: {
        state: 'all',
        propertyType: 'all',
        priceMin: 0,
        priceMax: Infinity
    }
};

/**
 * Initialize comparison system
 */
function initScenarioComparison() {
    loadSavedScenarios();
}

/**
 * Load saved scenarios from localStorage
 */
function loadSavedScenarios() {
    try {
        const saved = localStorage.getItem(SCENARIOS_STORAGE_KEY);
        if (saved) {
            comparisonState.scenarios = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading saved scenarios:', error);
        if (typeof logError === 'function') {
            logError(error, 'loadSavedScenarios');
        }
    }
}

/**
 * Save scenarios to localStorage
 */
function saveScenariosToStorage() {
    try {
        localStorage.setItem(SCENARIOS_STORAGE_KEY, JSON.stringify(comparisonState.scenarios));
        return { success: true };
    } catch (error) {
        console.error('Error saving scenarios:', error);
        if (typeof logError === 'function') {
            logError(error, 'saveScenariosToStorage');
        }
        return { success: false, error: error.message };
    }
}

/**
 * Create scenario object from current calculation
 */
function createScenarioFromCalculation(name, fees) {
    if (!fees) {
        console.error('No calculation fees provided');
        return null;
    }

    return {
        id: Date.now().toString(),
        name: name || `Scenario ${comparisonState.scenarios.length + 1}`,
        createdAt: new Date().toISOString(),

        // Property details
        propertyValue: state.propertyValue || 0,
        propertyType: state.propertyType || 'newDwelling',
        state: state.state || 'NSW',
        address: state.propertyAddress || '',

        // Costs
        firbFee: fees.firbFee || 0,
        stampDuty: fees.stampDuty || 0,
        foreignSurcharge: fees.foreignSurcharge || 0,
        totalStampDuty: (fees.stampDuty || 0) + (fees.foreignSurcharge || 0),
        legalFees: fees.legalFees || 0,
        inspectionFees: fees.inspectionFees || 0,
        lmiPremium: fees.lmiPremium || 0,
        totalFirstYearCost: fees.totalFirstYearCost || 0,

        // Annual costs
        landTax: fees.landTax || 0,
        landTaxSurcharge: fees.landTaxSurcharge || 0,
        annualVacancyFee: fees.annualVacancyFee || 0,
        councilRates: fees.councilRates || 0,
        strataFees: fees.strataFees || 0,
        totalAnnualCost: (fees.landTax || 0) + (fees.landTaxSurcharge || 0) +
                         (fees.annualVacancyFee || 0) + (fees.councilRates || 0) +
                         (fees.strataFees || 0),

        // Eligibility
        eligibilityStatus: determineEligibilityStatus(),

        // ROI (if available)
        roiProjection: calculateROIProjection(fees),

        // Full fees object for reference
        fullFees: fees
    };
}

/**
 * Determine eligibility status based on current state
 */
function determineEligibilityStatus() {
    // Check if user is eligible based on wizard or calculator state
    if (wizardState && wizardState.result) {
        return wizardState.result.eligible ? 'Eligible' : 'Not Eligible';
    }

    // Default assumption for calculator direct entry
    return 'Check Required';
}

/**
 * Calculate ROI projection if investment data available
 */
function calculateROIProjection(fees) {
    // Check if investment calculator was used
    if (typeof investmentState !== 'undefined' && investmentState.rentalYield > 0) {
        const annualRent = state.propertyValue * (investmentState.rentalYield / 100);
        const annualCosts = (fees.landTax || 0) + (fees.landTaxSurcharge || 0) +
                           (fees.councilRates || 0) + (fees.strataFees || 0);
        const netAnnualIncome = annualRent - annualCosts;
        const roi = (netAnnualIncome / state.propertyValue) * 100;

        return {
            rentalYield: investmentState.rentalYield,
            annualRent,
            netAnnualIncome,
            roi: roi.toFixed(2)
        };
    }

    return null;
}

/**
 * Save current calculation as scenario
 */
function saveCurrentScenario(name) {
    // Check if at max capacity
    if (comparisonState.scenarios.length >= MAX_SCENARIOS) {
        if (typeof showToast === 'function') {
            showToast(`Maximum ${MAX_SCENARIOS} scenarios reached. Delete one to add more.`, 'error');
        }
        return { success: false, error: 'Maximum scenarios reached' };
    }

    // Check if name already exists
    const nameExists = comparisonState.scenarios.some(s => s.name === name);
    if (nameExists) {
        if (typeof showToast === 'function') {
            showToast('A scenario with this name already exists', 'error');
        }
        return { success: false, error: 'Name already exists' };
    }

    // Create scenario from current calculation
    const scenario = createScenarioFromCalculation(name, state.calculatedFees);
    if (!scenario) {
        return { success: false, error: 'No calculation available to save' };
    }

    // Add to scenarios
    comparisonState.scenarios.push(scenario);

    // Save to localStorage
    const saveResult = saveScenariosToStorage();

    if (saveResult.success && typeof showToast === 'function') {
        showToast(`Scenario "${name}" saved successfully!`, 'success');
    }

    return saveResult;
}

/**
 * Delete scenario by ID
 */
function deleteScenario(id) {
    const index = comparisonState.scenarios.findIndex(s => s.id === id);
    if (index === -1) {
        return { success: false, error: 'Scenario not found' };
    }

    const scenarioName = comparisonState.scenarios[index].name;
    comparisonState.scenarios.splice(index, 1);

    const saveResult = saveScenariosToStorage();

    if (saveResult.success && typeof showToast === 'function') {
        showToast(`Scenario "${scenarioName}" deleted`, 'info');
    }

    return saveResult;
}

/**
 * Edit scenario name
 */
function editScenarioName(id, newName) {
    const scenario = comparisonState.scenarios.find(s => s.id === id);
    if (!scenario) {
        return { success: false, error: 'Scenario not found' };
    }

    // Check if new name already exists (excluding current scenario)
    const nameExists = comparisonState.scenarios.some(s => s.name === newName && s.id !== id);
    if (nameExists) {
        if (typeof showToast === 'function') {
            showToast('A scenario with this name already exists', 'error');
        }
        return { success: false, error: 'Name already exists' };
    }

    const oldName = scenario.name;
    scenario.name = newName;

    const saveResult = saveScenariosToStorage();

    if (saveResult.success && typeof showToast === 'function') {
        showToast(`Renamed "${oldName}" to "${newName}"`, 'success');
    }

    return saveResult;
}

/**
 * Get filtered and sorted scenarios
 */
function getFilteredScenarios() {
    let filtered = [...comparisonState.scenarios];

    // Apply filters
    const { state: stateFilter, propertyType, priceMin, priceMax } = comparisonState.filters;

    if (stateFilter !== 'all') {
        filtered = filtered.filter(s => s.state === stateFilter);
    }

    if (propertyType !== 'all') {
        filtered = filtered.filter(s => s.propertyType === propertyType);
    }

    filtered = filtered.filter(s =>
        s.propertyValue >= priceMin && s.propertyValue <= priceMax
    );

    // Apply sorting
    filtered.sort((a, b) => {
        const aVal = a[comparisonState.sortColumn];
        const bVal = b[comparisonState.sortColumn];

        if (comparisonState.sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    return filtered;
}

/**
 * Find lowest cost scenario
 */
function findLowestCostScenario(scenarios) {
    if (scenarios.length === 0) return null;

    return scenarios.reduce((lowest, current) =>
        current.totalFirstYearCost < lowest.totalFirstYearCost ? current : lowest
    );
}

/**
 * Calculate savings compared to most expensive
 */
function calculateSavings(scenario, scenarios) {
    if (scenarios.length <= 1) return 0;

    const mostExpensive = scenarios.reduce((max, current) =>
        current.totalFirstYearCost > max.totalFirstYearCost ? current : max
    );

    return mostExpensive.totalFirstYearCost - scenario.totalFirstYearCost;
}

/**
 * Set sort column and direction
 */
function setSortColumn(column) {
    if (comparisonState.sortColumn === column) {
        // Toggle direction
        comparisonState.sortDirection = comparisonState.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        comparisonState.sortColumn = column;
        comparisonState.sortDirection = 'asc';
    }

    render();
}

/**
 * Set filter
 */
function setComparisonFilter(filterType, value) {
    if (filterType === 'priceRange') {
        comparisonState.filters.priceMin = value.min;
        comparisonState.filters.priceMax = value.max;
    } else {
        comparisonState.filters[filterType] = value;
    }

    render();
}

/**
 * Clear all filters
 */
function clearComparisonFilters() {
    comparisonState.filters = {
        state: 'all',
        propertyType: 'all',
        priceMin: 0,
        priceMax: Infinity
    };
    render();
}

/**
 * Get traffic light color for metric
 */
function getTrafficLightColor(value, metricType, allValues) {
    if (allValues.length === 0) return 'gray';

    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min;

    // For cost metrics, lower is better (green)
    if (metricType === 'cost') {
        if (value === min) return 'green';
        if (value <= min + (range * 0.33)) return 'yellow-green';
        if (value <= min + (range * 0.66)) return 'yellow';
        return 'red';
    }

    // For ROI metrics, higher is better (green)
    if (metricType === 'roi') {
        if (value === max) return 'green';
        if (value >= max - (range * 0.33)) return 'yellow-green';
        if (value >= max - (range * 0.66)) return 'yellow';
        return 'red';
    }

    return 'gray';
}

/**
 * Render save scenario modal
 */
function showSaveScenarioModal() {
    if (!state.calculatedFees) {
        if (typeof showToast === 'function') {
            showToast('Please calculate fees first', 'error');
        }
        return;
    }

    const suggestedName = `${state.state} ${getPropertyTypeLabel(state.propertyType)} - ${formatCurrency(state.propertyValue)}`;

    const modalHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onclick="closeModal(event)">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onclick="event.stopPropagation()">
                <h3 class="text-2xl font-bold mb-4">Save Scenario</h3>

                <div class="mb-4">
                    <p class="text-sm text-gray-600 mb-2">
                        You have ${comparisonState.scenarios.length} of ${MAX_SCENARIOS} scenarios saved
                    </p>

                    ${comparisonState.scenarios.length >= MAX_SCENARIOS ? `
                        <div class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            Maximum scenarios reached. Delete one to save this calculation.
                        </div>
                    ` : ''}
                </div>

                ${comparisonState.scenarios.length < MAX_SCENARIOS ? `
                    <div class="mb-4">
                        <label class="block font-semibold mb-2">Scenario Name</label>
                        <input type="text"
                            id="scenario-name-input"
                            value="${suggestedName}"
                            placeholder="e.g., Sydney Apartment"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            maxlength="50">
                        <p class="text-xs text-gray-500 mt-1">Max 50 characters</p>
                    </div>

                    <div class="mb-6 p-4 bg-gray-50 rounded-lg text-sm">
                        <div class="font-semibold mb-2">This scenario includes:</div>
                        <ul class="space-y-1 text-gray-700">
                            <li>• Property: ${formatCurrency(state.propertyValue)} in ${state.state}</li>
                            <li>• Type: ${getPropertyTypeLabel(state.propertyType)}</li>
                            <li>• Total First Year: ${formatCurrency(state.calculatedFees.totalFirstYearCost)}</li>
                            <li>• Annual Ongoing: ${formatCurrency(
                                (state.calculatedFees.landTax || 0) +
                                (state.calculatedFees.landTaxSurcharge || 0) +
                                (state.calculatedFees.councilRates || 0) +
                                (state.calculatedFees.strataFees || 0)
                            )}</li>
                        </ul>
                    </div>

                    <div class="flex gap-3">
                        <button onclick="closeSaveScenarioModal()"
                            class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                            Cancel
                        </button>
                        <button onclick="saveScenarioFromModal()"
                            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Save Scenario
                        </button>
                    </div>
                ` : `
                    <button onclick="closeSaveScenarioModal()"
                        class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                        Close
                    </button>
                `}
            </div>
        </div>
    `;

    // Add to body
    const modalContainer = document.createElement('div');
    modalContainer.id = 'save-scenario-modal';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
}

/**
 * Close save scenario modal
 */
function closeSaveScenarioModal() {
    const modal = document.getElementById('save-scenario-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Save scenario from modal
 */
function saveScenarioFromModal() {
    const input = document.getElementById('scenario-name-input');
    const name = input.value.trim();

    if (!name) {
        if (typeof showToast === 'function') {
            showToast('Please enter a scenario name', 'error');
        }
        return;
    }

    const result = saveCurrentScenario(name);

    if (result.success) {
        closeSaveScenarioModal();

        // Offer to go to comparison page
        if (typeof showToast === 'function') {
            showToast('Scenario saved! View comparison?', 'success', 5000);
        }

        // Auto-navigate after 2 seconds
        setTimeout(() => {
            goToStep('compare');
        }, 2000);
    }
}

/**
 * Close modal on backdrop click
 */
function closeModal(event) {
    if (event.target === event.currentTarget) {
        closeSaveScenarioModal();
    }
}

/**
 * Get property type label
 */
function getPropertyTypeLabel(type) {
    const labels = {
        'newDwelling': 'New Dwelling',
        'established': 'Established',
        'vacantLand': 'Vacant Land',
        'commercial': 'Commercial'
    };
    return labels[type] || type;
}

/**
 * Show edit scenario modal
 */
function showEditScenarioModal(id) {
    const scenario = comparisonState.scenarios.find(s => s.id === id);
    if (!scenario) return;

    const modalHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onclick="closeEditModal(event)">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onclick="event.stopPropagation()">
                <h3 class="text-2xl font-bold mb-4">Edit Scenario Name</h3>

                <div class="mb-4">
                    <label class="block font-semibold mb-2">Scenario Name</label>
                    <input type="text"
                        id="edit-scenario-name-input"
                        value="${scenario.name}"
                        placeholder="e.g., Sydney Apartment"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        maxlength="50">
                </div>

                <div class="flex gap-3">
                    <button onclick="closeEditScenarioModal()"
                        class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                        Cancel
                    </button>
                    <button onclick="saveEditedScenarioName('${id}')"
                        class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.id = 'edit-scenario-modal';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
}

/**
 * Close edit modal
 */
function closeEditScenarioModal() {
    const modal = document.getElementById('edit-scenario-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Close edit modal on backdrop click
 */
function closeEditModal(event) {
    if (event.target === event.currentTarget) {
        closeEditScenarioModal();
    }
}

/**
 * Save edited scenario name
 */
function saveEditedScenarioName(id) {
    const input = document.getElementById('edit-scenario-name-input');
    const newName = input.value.trim();

    if (!newName) {
        if (typeof showToast === 'function') {
            showToast('Please enter a scenario name', 'error');
        }
        return;
    }

    const result = editScenarioName(id, newName);

    if (result.success) {
        closeEditScenarioModal();
        render();
    }
}

/**
 * Confirm delete scenario
 */
function confirmDeleteScenario(id) {
    const scenario = comparisonState.scenarios.find(s => s.id === id);
    if (!scenario) return;

    if (confirm(`Delete scenario "${scenario.name}"? This cannot be undone.`)) {
        const result = deleteScenario(id);
        if (result.success) {
            render();
        }
    }
}

// Initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        initScenarioComparison();
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveCurrentScenario,
        deleteScenario,
        editScenarioName,
        getFilteredScenarios,
        comparisonState
    };
}
