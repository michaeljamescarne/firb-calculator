/**
 * Scenario Comparison UI Rendering
 * @file comparisonUI.js
 *
 * Renders the comparison table, charts, and controls
 */

/**
 * Render scenario comparison page
 */
function renderScenarioComparison() {
    const scenarios = getFilteredScenarios();
    const lowestCost = findLowestCostScenario(scenarios);

    if (comparisonState.scenarios.length === 0) {
        return renderEmptyComparisonPage();
    }

    return `
        <section class="py-12 bg-gray-50 min-h-screen">
            <div class="max-w-7xl mx-auto px-4">
                <!-- Header -->
                <div class="mb-8">
                    <button onclick="goToStep('home')" class="text-blue-600 mb-4 flex items-center space-x-2 hover:text-blue-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        <span>Back to Home</span>
                    </button>

                    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 class="text-4xl font-bold text-gray-900 mb-2">Compare Scenarios</h1>
                            <p class="text-gray-600">
                                ${comparisonState.scenarios.length} of ${MAX_SCENARIOS} scenarios saved
                                ${scenarios.length < comparisonState.scenarios.length ?
                                    ` • Showing ${scenarios.length} filtered` : ''}
                            </p>
                        </div>

                        <div class="mt-4 md:mt-0 flex gap-3">
                            ${scenarios.length >= 2 ? `
                                <button onclick="exportComparisonPDF()"
                                    class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    <span>Export PDF</span>
                                </button>
                                <button onclick="shareComparison()"
                                    class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                                    </svg>
                                    <span>Share</span>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>

                ${renderComparisonFilters()}

                ${scenarios.length === 0 ?
                    renderNoFilteredScenarios() :
                    `
                        ${scenarios.length >= 2 ? renderVisualComparisons(scenarios) : ''}
                        ${renderComparisonTable(scenarios, lowestCost)}
                    `
                }
            </div>
        </section>
    `;
}

/**
 * Render empty comparison page
 */
function renderEmptyComparisonPage() {
    return `
        <section class="py-20 bg-gray-50 min-h-screen">
            <div class="max-w-4xl mx-auto px-4 text-center">
                <button onclick="goToStep('home')" class="text-blue-600 mb-8 inline-flex items-center space-x-2 hover:text-blue-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    <span>Back to Home</span>
                </button>

                <div class="bg-white rounded-lg shadow-lg p-12">
                    <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                        <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                    </div>

                    <h2 class="text-3xl font-bold text-gray-900 mb-4">No Saved Scenarios Yet</h2>
                    <p class="text-xl text-gray-600 mb-8">
                        Calculate fees for different properties and save them here for side-by-side comparison
                    </p>

                    <div class="bg-blue-50 p-6 rounded-lg mb-8 text-left">
                        <h3 class="font-bold text-lg mb-3">How to compare scenarios:</h3>
                        <ol class="space-y-2 text-gray-700">
                            <li class="flex items-start">
                                <span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                                <span>Use the calculator to calculate fees for a property</span>
                            </li>
                            <li class="flex items-start">
                                <span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                                <span>Click "Save Scenario" on the results page</span>
                            </li>
                            <li class="flex items-start">
                                <span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                                <span>Repeat for different properties (max ${MAX_SCENARIOS} scenarios)</span>
                            </li>
                            <li class="flex items-start">
                                <span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                                <span>Compare costs, savings, and ROI side-by-side</span>
                            </li>
                        </ol>
                    </div>

                    <button onclick="startEligibilityWizard()"
                        class="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                        Start Your First Calculation
                    </button>
                </div>
            </div>
        </section>
    `;
}

/**
 * Render filters
 */
function renderComparisonFilters() {
    const hasFilters = comparisonState.filters.state !== 'all' ||
                      comparisonState.filters.propertyType !== 'all' ||
                      comparisonState.filters.priceMin > 0 ||
                      comparisonState.filters.priceMax < Infinity;

    return `
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex flex-wrap gap-4 items-end">
                <!-- State filter -->
                <div class="flex-1 min-w-[200px]">
                    <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select onchange="setComparisonFilter('state', this.value)"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="all">All States</option>
                        <option value="NSW" ${comparisonState.filters.state === 'NSW' ? 'selected' : ''}>NSW</option>
                        <option value="VIC" ${comparisonState.filters.state === 'VIC' ? 'selected' : ''}>VIC</option>
                        <option value="QLD" ${comparisonState.filters.state === 'QLD' ? 'selected' : ''}>QLD</option>
                        <option value="SA" ${comparisonState.filters.state === 'SA' ? 'selected' : ''}>SA</option>
                        <option value="WA" ${comparisonState.filters.state === 'WA' ? 'selected' : ''}>WA</option>
                        <option value="TAS" ${comparisonState.filters.state === 'TAS' ? 'selected' : ''}>TAS</option>
                        <option value="ACT" ${comparisonState.filters.state === 'ACT' ? 'selected' : ''}>ACT</option>
                        <option value="NT" ${comparisonState.filters.state === 'NT' ? 'selected' : ''}>NT</option>
                    </select>
                </div>

                <!-- Property type filter -->
                <div class="flex-1 min-w-[200px]">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select onchange="setComparisonFilter('propertyType', this.value)"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="all">All Types</option>
                        <option value="newDwelling" ${comparisonState.filters.propertyType === 'newDwelling' ? 'selected' : ''}>New Dwelling</option>
                        <option value="established" ${comparisonState.filters.propertyType === 'established' ? 'selected' : ''}>Established</option>
                        <option value="vacantLand" ${comparisonState.filters.propertyType === 'vacantLand' ? 'selected' : ''}>Vacant Land</option>
                        <option value="commercial" ${comparisonState.filters.propertyType === 'commercial' ? 'selected' : ''}>Commercial</option>
                    </select>
                </div>

                <!-- Clear filters button -->
                ${hasFilters ? `
                    <button onclick="clearComparisonFilters()"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                        Clear Filters
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Render no filtered scenarios message
 */
function renderNoFilteredScenarios() {
    return `
        <div class="bg-white rounded-lg shadow-sm p-12 text-center">
            <p class="text-xl text-gray-600 mb-4">No scenarios match your filters</p>
            <button onclick="clearComparisonFilters()"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Clear All Filters
            </button>
        </div>
    `;
}

/**
 * Render visual comparisons (charts)
 */
function renderVisualComparisons(scenarios) {
    return `
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <!-- Cost comparison bar chart -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Total First Year Cost</h3>
                <div id="cost-comparison-chart" class="h-64">
                    ${renderCostComparisonChart(scenarios)}
                </div>
            </div>

            <!-- Annual costs comparison -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Annual Ongoing Costs</h3>
                <div id="annual-comparison-chart" class="h-64">
                    ${renderAnnualCostChart(scenarios)}
                </div>
            </div>
        </div>

        ${scenarios.some(s => s.roiProjection) ? `
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">ROI Comparison</h3>
                <div id="roi-radar-chart" class="h-80">
                    ${renderROIRadarChart(scenarios)}
                </div>
            </div>
        ` : ''}
    `;
}

/**
 * Render cost comparison bar chart (simplified)
 */
function renderCostComparisonChart(scenarios) {
    const maxCost = Math.max(...scenarios.map(s => s.totalFirstYearCost));

    return `
        <div class="space-y-3">
            ${scenarios.map(scenario => {
                const percentage = (scenario.totalFirstYearCost / maxCost) * 100;
                const isLowest = scenario.id === findLowestCostScenario(scenarios)?.id;

                return `
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span class="font-medium truncate pr-2">${scenario.name}</span>
                            <span class="font-bold ${isLowest ? 'text-green-600' : 'text-gray-900'}">
                                ${formatCurrency(scenario.totalFirstYearCost)}
                            </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                            <div class="h-full rounded-full transition-all ${isLowest ? 'bg-green-500' : 'bg-blue-500'}"
                                style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

/**
 * Render annual cost chart
 */
function renderAnnualCostChart(scenarios) {
    const maxCost = Math.max(...scenarios.map(s => s.totalAnnualCost));

    return `
        <div class="space-y-3">
            ${scenarios.map(scenario => {
                const percentage = maxCost > 0 ? (scenario.totalAnnualCost / maxCost) * 100 : 0;

                return `
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span class="font-medium truncate pr-2">${scenario.name}</span>
                            <span class="font-bold text-gray-900">
                                ${formatCurrency(scenario.totalAnnualCost)}
                            </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-6">
                            <div class="h-full bg-orange-500 rounded-full transition-all"
                                style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

/**
 * Render ROI radar chart (simplified representation)
 */
function renderROIRadarChart(scenarios) {
    const scenariosWithROI = scenarios.filter(s => s.roiProjection);

    if (scenariosWithROI.length === 0) {
        return '<p class="text-gray-500 text-center">No ROI data available</p>';
    }

    return `
        <div class="grid grid-cols-1 md:grid-cols-${Math.min(scenariosWithROI.length, 3)} gap-4">
            ${scenariosWithROI.map(scenario => `
                <div class="text-center p-4 border border-gray-200 rounded-lg">
                    <div class="font-semibold mb-2 truncate">${scenario.name}</div>
                    <div class="text-3xl font-bold text-green-600 mb-1">
                        ${scenario.roiProjection.roi}%
                    </div>
                    <div class="text-sm text-gray-600">
                        <div>Yield: ${scenario.roiProjection.rentalYield}%</div>
                        <div>Annual: ${formatCurrency(scenario.roiProjection.netAnnualIncome)}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Render comparison table
 */
function renderComparisonTable(scenarios, lowestCost) {
    const allFirstYearCosts = scenarios.map(s => s.totalFirstYearCost);
    const allAnnualCosts = scenarios.map(s => s.totalAnnualCost);

    return `
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <!-- Desktop table -->
            <div class="hidden lg:block overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Scenario
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onclick="setSortColumn('propertyValue')">
                                Property
                                ${renderSortIcon('propertyValue')}
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onclick="setSortColumn('firbFee')">
                                FIRB Fee
                                ${renderSortIcon('firbFee')}
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onclick="setSortColumn('totalStampDuty')">
                                Stamp Duty
                                ${renderSortIcon('totalStampDuty')}
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onclick="setSortColumn('totalFirstYearCost')">
                                First Year Total
                                ${renderSortIcon('totalFirstYearCost')}
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onclick="setSortColumn('totalAnnualCost')">
                                Annual Ongoing
                                ${renderSortIcon('totalAnnualCost')}
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Eligibility
                            </th>
                            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${scenarios.map(scenario => {
                            const isLowest = lowestCost && scenario.id === lowestCost.id;
                            const savings = calculateSavings(scenario, scenarios);
                            const firstYearColor = getTrafficLightColor(scenario.totalFirstYearCost, 'cost', allFirstYearCosts);
                            const annualColor = getTrafficLightColor(scenario.totalAnnualCost, 'cost', allAnnualCosts);

                            return `
                                <tr class="${isLowest ? 'bg-green-50' : 'hover:bg-gray-50'}">
                                    <td class="px-4 py-4">
                                        <div class="font-semibold text-gray-900">${scenario.name}</div>
                                        ${scenario.address ? `<div class="text-sm text-gray-500">${scenario.address}</div>` : ''}
                                        <div class="text-xs text-gray-500 mt-1">
                                            Saved ${formatRelativeDate(scenario.createdAt)}
                                        </div>
                                        ${isLowest ? `
                                            <div class="inline-block mt-2 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
                                                LOWEST COST
                                            </div>
                                        ` : savings > 0 ? `
                                            <div class="text-xs text-red-600 mt-1">
                                                +${formatCurrency(savings)} vs lowest
                                            </div>
                                        ` : ''}
                                    </td>
                                    <td class="px-4 py-4">
                                        <div class="font-semibold">${formatCurrency(scenario.propertyValue)}</div>
                                        <div class="text-sm text-gray-600">${getPropertyTypeLabel(scenario.propertyType)}</div>
                                        <div class="text-sm text-gray-600">${scenario.state}</div>
                                    </td>
                                    <td class="px-4 py-4">
                                        <div class="font-semibold">${formatCurrency(scenario.firbFee)}</div>
                                    </td>
                                    <td class="px-4 py-4">
                                        <div class="font-semibold">${formatCurrency(scenario.totalStampDuty)}</div>
                                        <div class="text-xs text-gray-500">
                                            +${formatCurrency(scenario.foreignSurcharge)} surcharge
                                        </div>
                                    </td>
                                    <td class="px-4 py-4">
                                        <div class="flex items-center space-x-2">
                                            ${renderTrafficLight(firstYearColor)}
                                            <span class="font-bold">${formatCurrency(scenario.totalFirstYearCost)}</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4">
                                        <div class="flex items-center space-x-2">
                                            ${renderTrafficLight(annualColor)}
                                            <span class="font-semibold">${formatCurrency(scenario.totalAnnualCost)}</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4">
                                        <span class="inline-block px-2 py-1 text-xs font-semibold rounded ${
                                            scenario.eligibilityStatus === 'Eligible' ? 'bg-green-100 text-green-800' :
                                            scenario.eligibilityStatus === 'Not Eligible' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }">
                                            ${scenario.eligibilityStatus}
                                        </span>
                                    </td>
                                    <td class="px-4 py-4">
                                        <div class="flex items-center justify-center space-x-2">
                                            <button onclick="showEditScenarioModal('${scenario.id}')"
                                                class="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                                title="Edit name">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                </svg>
                                            </button>
                                            <button onclick="confirmDeleteScenario('${scenario.id}')"
                                                class="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                                title="Delete">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Mobile cards -->
            <div class="lg:hidden divide-y divide-gray-200">
                ${scenarios.map(scenario => {
                    const isLowest = lowestCost && scenario.id === lowestCost.id;
                    const savings = calculateSavings(scenario, scenarios);

                    return `
                        <div class="p-4 ${isLowest ? 'bg-green-50' : ''}">
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex-1">
                                    <h3 class="font-bold text-lg">${scenario.name}</h3>
                                    ${isLowest ? `
                                        <div class="inline-block mt-1 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
                                            LOWEST COST
                                        </div>
                                    ` : ''}
                                </div>
                                <div class="flex space-x-2">
                                    <button onclick="showEditScenarioModal('${scenario.id}')"
                                        class="p-2 text-blue-600">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>
                                    <button onclick="confirmDeleteScenario('${scenario.id}')"
                                        class="p-2 text-red-600">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <div class="text-gray-600">Property</div>
                                    <div class="font-semibold">${formatCurrency(scenario.propertyValue)}</div>
                                    <div class="text-gray-600">${scenario.state} • ${getPropertyTypeLabel(scenario.propertyType)}</div>
                                </div>
                                <div>
                                    <div class="text-gray-600">FIRB Fee</div>
                                    <div class="font-semibold">${formatCurrency(scenario.firbFee)}</div>
                                </div>
                                <div>
                                    <div class="text-gray-600">First Year Total</div>
                                    <div class="font-bold text-lg">${formatCurrency(scenario.totalFirstYearCost)}</div>
                                    ${savings > 0 && !isLowest ? `
                                        <div class="text-xs text-red-600">+${formatCurrency(savings)} vs lowest</div>
                                    ` : ''}
                                </div>
                                <div>
                                    <div class="text-gray-600">Annual Ongoing</div>
                                    <div class="font-semibold">${formatCurrency(scenario.totalAnnualCost)}</div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * Render sort icon
 */
function renderSortIcon(column) {
    if (comparisonState.sortColumn !== column) {
        return `
            <svg class="w-4 h-4 inline ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
        `;
    }

    return comparisonState.sortDirection === 'asc' ? `
        <svg class="w-4 h-4 inline ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
        </svg>
    ` : `
        <svg class="w-4 h-4 inline ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
    `;
}

/**
 * Render traffic light indicator
 */
function renderTrafficLight(color) {
    const colorMap = {
        'green': 'bg-green-500',
        'yellow-green': 'bg-yellow-400',
        'yellow': 'bg-yellow-500',
        'red': 'bg-red-500',
        'gray': 'bg-gray-400'
    };

    return `
        <div class="w-3 h-3 rounded-full ${colorMap[color] || colorMap.gray}" title="${color}"></div>
    `;
}

/**
 * Format relative date
 */
function formatRelativeDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderScenarioComparison
    };
}
