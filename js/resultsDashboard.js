/**
 * Enhanced Results Dashboard with visualizations and comparison metrics
 * @file resultsDashboard.js
 */

/**
 * Render enhanced results dashboard with charts and comparisons
 * @returns {string} HTML string for enhanced results dashboard
 */
function renderResultsDashboard() {
    if (!state.calculatedFees) return '';

    const fees = state.calculatedFees;
    const propertyValue = parseFloat(state.formData.propertyValue);

    return `
        <section class="py-20 bg-gray-50 min-h-screen">
            <div class="max-w-7xl mx-auto px-4">
                <button onclick="goToStep('calculator')" class="text-blue-600 mb-8 flex items-center space-x-2">
                    ${icons.arrowLeft('w-5 h-5')}
                    <span>${t('back')}</span>
                </button>

                <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <!-- Main Content -->
                    <div class="lg:col-span-3">
                        <!-- Summary Cards -->
                        ${renderSummaryCards(fees)}

                        <!-- Critical Alerts -->
                        ${typeof getResultsAlertsHTML === 'function' ? getResultsAlertsHTML(fees) : ''}

                        <!-- Visualization Section -->
                        ${renderVisualizationSection(fees)}

                        <!-- Comparison Metrics -->
                        ${renderComparisonMetrics(fees, propertyValue)}

                        <!-- Detailed Breakdown with Collapsible Sections -->
                        ${renderDetailedBreakdown(fees)}

                        <!-- Investment Analysis Tool -->
                        <div id="investment-container" class="mt-8">
                            ${typeof renderInvestmentInputsForm === 'function' && typeof renderInvestmentAnalysis === 'function'
                                ? renderInvestmentInputsForm() + renderInvestmentAnalysis()
                                : ''}
                        </div>

                        <!-- Cost Optimization Tool -->
                        <div id="optimizer-container" class="mt-8">
                        </div>

                        <!-- Action Buttons -->
                        ${renderActionButtons()}
                    </div>

                    <!-- Scenarios Sidebar -->
                    <div class="lg:col-span-1">
                        ${renderScenariosSidebarPanel()}
                    </div>
                </div>

                <!-- Save Scenario Modal -->
                ${typeof renderSaveScenarioModal === 'function' ? renderSaveScenarioModal() : ''}
            </div>
        </section>
    `;
}

/**
 * Render summary cards at top of dashboard
 * @param {Object} fees - Calculated fees object
 * @returns {string} HTML string for summary cards
 */
function renderSummaryCards(fees) {
    const isEligible = state.isEligible && state.isEligible.required;

    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            <!-- Total Upfront Cost Card -->
            <div class="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-sm font-semibold uppercase tracking-wide opacity-90">${t('upfrontCosts')}</h3>
                    ${icons.dollarSign('w-5 h-5 opacity-75')}
                </div>
                <div class="text-4xl font-bold mb-1">${formatCurrency(fees.grandTotal)}</div>
                <p class="text-xs text-blue-100">${t('upfrontCostsDesc')}</p>
            </div>

            <!-- FIRB Fee Card - Only show if FIRB required -->
            ${fees.firbRequired ? `
                <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500 transform hover:scale-105 transition-transform duration-300">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-xs font-semibold text-gray-600 uppercase">${t('firbAppFee')}</h3>
                        ${icons.fileText('w-4 h-4 text-orange-500')}
                    </div>
                    <div class="text-2xl font-bold text-gray-900">${formatCurrency(fees.firb)}</div>
                    <p class="text-xs text-gray-500 mt-1">${state.formData.entityType !== 'individual' ? '⚠️ Entity rate' : 'Individual rate'}</p>
                </div>
            ` : `
                <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 transform hover:scale-105 transition-transform duration-300">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-xs font-semibold text-gray-600 uppercase">FIRB Fee</h3>
                        ${icons.checkCircle('w-4 h-4 text-green-500')}
                    </div>
                    <div class="text-2xl font-bold text-green-600">$0</div>
                    <p class="text-xs text-gray-500 mt-1">✓ No FIRB required</p>
                </div>
            `}

            <!-- Total Stamp Duty Card -->
            <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 transform hover:scale-105 transition-transform duration-300">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xs font-semibold text-gray-600 uppercase">Total Stamp Duty</h3>
                    ${icons.creditCard('w-4 h-4 text-red-500')}
                </div>
                <div class="text-2xl font-bold text-gray-900">${formatCurrency(fees.stampDuty + fees.standard.stampDuty)}</div>
                <p class="text-xs text-gray-500 mt-1">Incl. surcharge</p>
            </div>

            <!-- First Year Total Card -->
            <div class="bg-gradient-to-br from-green-600 to-emerald-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xs font-semibold uppercase tracking-wide opacity-90">${t('firstYearTotal')}</h3>
                    ${icons.calendar('w-5 h-5 opacity-75')}
                </div>
                <div class="text-2xl font-bold">${formatCurrency(fees.firstYearTotal)}</div>
                <p class="text-xs text-green-100 mt-1">Upfront + Annual</p>
            </div>

            <!-- Approval Status Badge (Full Width) -->
            <div class="lg:col-span-5 ${isEligible ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'} p-4 rounded-xl flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    ${isEligible ? icons.shield('w-6 h-6 text-orange-600') : icons.checkCircle('w-6 h-6 text-green-600')}
                    <div>
                        <h4 class="font-bold ${isEligible ? 'text-orange-900' : 'text-green-900'}">${isEligible ? 'FIRB Approval Required' : 'FIRB Not Required'}</h4>
                        <p class="text-sm ${isEligible ? 'text-orange-700' : 'text-green-700'}">${state.isEligible?.note || ''}</p>
                    </div>
                </div>
                ${isEligible ? '<span class="bg-orange-200 text-orange-900 px-4 py-2 rounded-full text-sm font-semibold">Action Required</span>' : '<span class="bg-green-200 text-green-900 px-4 py-2 rounded-full text-sm font-semibold">Eligible</span>'}
            </div>
        </div>
    `;
}

/**
 * Render visualization section with charts
 * @param {Object} fees - Calculated fees object
 * @returns {string} HTML string for visualization section
 */
function renderVisualizationSection(fees) {
    return `
        <div class="bg-white p-8 rounded-xl shadow-md mb-8">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
                ${icons.calculator('w-6 h-6 text-blue-600 mr-2')}
                Cost Analysis & Visualizations
            </h2>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Pie Chart: Cost Distribution -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-4 text-center">Cost Distribution</h3>
                    <div id="pie-chart-container" class="w-full" style="min-height: 300px;"></div>
                </div>

                <!-- Donut Chart: Annual Costs -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-4 text-center">Annual Ongoing Costs Breakdown</h3>
                    <div id="donut-chart-container" class="w-full" style="min-height: 300px;"></div>
                </div>
            </div>

            <!-- Bar Chart: State Comparison (Full Width) -->
            <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-4 text-center">Cost Comparison Across Australian States</h3>
                <div id="bar-chart-container" class="w-full" style="min-height: 400px;"></div>
                <p class="text-xs text-gray-500 text-center mt-4">
                    Based on ${formatCurrency(parseFloat(state.formData.propertyValue))} ${state.formData.propertyType} property
                </p>
            </div>
        </div>
    `;
}

/**
 * Render comparison metrics showing cost differences
 * @param {Object} fees - Calculated fees object
 * @param {number} propertyValue - Property value
 * @returns {string} HTML string for comparison metrics
 */
function renderComparisonMetrics(fees, propertyValue) {
    // Calculate comparison scenarios
    const comparisons = calculateComparisonScenarios(fees, propertyValue);

    return `
        <div class="bg-white p-8 rounded-xl shadow-md mb-8">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
                ${icons.globe('w-6 h-6 text-purple-600 mr-2')}
                Comparison Metrics
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- State Comparison -->
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                    <div class="flex items-center mb-3">
                        ${icons.building('w-5 h-5 text-blue-600 mr-2')}
                        <h3 class="font-semibold text-gray-900">Best State for Savings</h3>
                    </div>
                    <div class="mb-2">
                        <span class="text-3xl font-bold text-blue-600">${comparisons.bestState.state}</span>
                    </div>
                    <p class="text-sm text-gray-700">
                        You would save <span class="font-bold text-green-600">${formatCurrency(comparisons.bestState.savings)}</span>
                        compared to ${state.formData.state}
                    </p>
                    <p class="text-xs text-gray-500 mt-2">
                        ${comparisons.bestState.state} first year total: ${formatCurrency(comparisons.bestState.total)}
                    </p>
                </div>

                <!-- Citizenship Comparison -->
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                    <div class="flex items-center mb-3">
                        ${icons.shield('w-5 h-5 text-green-600 mr-2')}
                        <h3 class="font-semibold text-gray-900">Australian Citizen Cost</h3>
                    </div>
                    <div class="mb-2">
                        <span class="text-3xl font-bold text-green-600">${formatCurrency(comparisons.citizenCost)}</span>
                    </div>
                    <p class="text-sm text-gray-700">
                        Foreign buyer premium: <span class="font-bold text-orange-600">${formatCurrency(comparisons.foreignPremium)}</span>
                    </p>
                    <p class="text-xs text-gray-500 mt-2">
                        ${Math.round((comparisons.foreignPremium / comparisons.citizenCost) * 100)}% more than citizens pay
                    </p>
                </div>

                <!-- Property Type Comparison -->
                <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                    <div class="flex items-center mb-3">
                        ${icons.home('w-5 h-5 text-purple-600 mr-2')}
                        <h3 class="font-semibold text-gray-900">Property Type Impact</h3>
                    </div>
                    <div class="mb-2">
                        <span class="text-2xl font-bold text-purple-600">${comparisons.propertyTypeComparison.difference}</span>
                    </div>
                    <p class="text-sm text-gray-700">
                        ${comparisons.propertyTypeComparison.message}
                    </p>
                    <p class="text-xs text-gray-500 mt-2">
                        ${comparisons.propertyTypeComparison.details}
                    </p>
                </div>
            </div>

            <!-- Worst State Warning -->
            ${comparisons.worstState.difference > 0 ? `
                <div class="mt-6 bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            ⚠️
                        </div>
                        <div class="ml-3">
                            <h4 class="font-semibold text-red-900">Most Expensive State: ${comparisons.worstState.state}</h4>
                            <p class="text-sm text-red-700 mt-1">
                                Buying in ${comparisons.worstState.state} would cost you an additional
                                <span class="font-bold">${formatCurrency(comparisons.worstState.difference)}</span>
                                more than your current selection (${state.formData.state}).
                            </p>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Render detailed breakdown with collapsible sections
 * @param {Object} fees - Calculated fees object
 * @returns {string} HTML string for detailed breakdown
 */
function renderDetailedBreakdown(fees) {
    return `
        <div class="bg-white p-8 rounded-xl shadow-md mb-8">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
                ${icons.fileText('w-6 h-6 text-gray-700 mr-2')}
                Detailed Cost Breakdown
            </h2>

            <!-- Foreign Investment Fees (Collapsible) - Only show if FIRB required -->
            ${fees.firbRequired ? `
                <div class="border border-orange-200 rounded-lg mb-4">
                    <button onclick="toggleSection('foreign-fees')"
                        class="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 transition-colors rounded-t-lg">
                        <div class="flex items-center">
                            ${icons.globe('w-5 h-5 text-orange-600 mr-3')}
                            <h3 class="text-lg font-semibold text-gray-900">${t('foreignInvestmentFees')}</h3>
                        </div>
                        <div class="flex items-center space-x-4">
                            <span class="text-xl font-bold text-orange-600">${formatCurrency(fees.foreignTotal)}</span>
                            <span id="foreign-fees-icon" class="transform transition-transform">▼</span>
                        </div>
                    </button>
                    <div id="foreign-fees" class="collapsible-content">
                        <div class="p-4 space-y-3">
                            ${renderFeeLineItem('firbAppFee', 'FIRB Application Fee', fees.firb, 'paidToGov', 'This fee is paid to the Australian Treasury for FIRB review and approval.')}
                            ${renderFeeLineItem('stampSurcharge', 'Foreign Buyer Stamp Duty Surcharge', fees.stampDuty, 'addStateTax', `Additional ${state.formData.state} state tax of 7-8% for foreign purchasers.`)}
                            ${renderFeeLineItem('legalFeesCard', 'Legal & Conveyancing Fees', fees.legal, 'profFees', 'Professional fees for FIRB application assistance and legal representation.')}
                        </div>
                    </div>
                </div>
            ` : `
                <div class="border border-green-200 rounded-lg mb-4 bg-green-50 p-4">
                    <div class="flex items-center">
                        ${icons.checkCircle('w-5 h-5 text-green-600 mr-3')}
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">No Foreign Investment Fees Required</h3>
                            <p class="text-sm text-gray-600 mt-1">As an Australian citizen or permanent resident (ordinarily resident), you are exempt from FIRB fees and foreign buyer surcharges.</p>
                        </div>
                    </div>
                </div>
            `}

            <!-- Standard Property Fees (Collapsible) -->
            <div class="border border-blue-200 rounded-lg mb-4">
                <button onclick="toggleSection('standard-fees')"
                    class="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 transition-colors rounded-t-lg">
                    <div class="flex items-center">
                        ${icons.home('w-5 h-5 text-blue-600 mr-3')}
                        <h3 class="text-lg font-semibold text-gray-900">${t('standardPropertyFees')}</h3>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-xl font-bold text-blue-600">${formatCurrency(fees.standardTotal)}</span>
                        <span id="standard-fees-icon" class="transform transition-transform">▼</span>
                    </div>
                </button>
                <div id="standard-fees" class="collapsible-content">
                    <div class="p-4 space-y-3">
                        ${renderFeeLineItem('standardStampDuty', 'Standard Stamp Duty', fees.standard.stampDuty, null, 'Base stamp duty paid by all property buyers in ' + state.formData.state)}
                        ${renderFeeLineItem('transferFee', 'Transfer Fee', fees.standard.transferFee, null, 'Government fee for property title transfer registration')}
                        ${renderFeeLineItem('mortgageReg', 'Mortgage Registration', fees.standard.mortgageRegistration, null, 'Fee to register mortgage on property title')}
                        ${renderFeeLineItem('legalConveyancing', 'Conveyancing & Legal', fees.standard.conveyancingLegal, null, 'Legal fees for property settlement and contract review')}
                        ${renderFeeLineItem('buildingPest', 'Building & Pest Inspections', fees.standard.buildingInspection + fees.standard.pestInspection, null, 'Professional property inspections before purchase')}
                        ${renderFeeLineItem('loanApp', 'Loan Application Fee', fees.standard.loanApplicationFee, null, 'Bank fee for processing your home loan application')}
                        ${fees.standard.lendersMortgageInsurance > 0 ? renderFeeLineItem('lmi', 'Lenders Mortgage Insurance', fees.standard.lendersMortgageInsurance, null, `Required when deposit < 20% (Your LVR: ${Math.round((1 - parseFloat(state.formData.depositPercent) / 100) * 100)}%)`) : ''}
                        ${renderFeeLineItem('titleSearch', 'Title Search', fees.standard.titleSearch, null, 'Search to verify property ownership and encumbrances')}
                        ${renderFeeLineItem('councilWater', 'Council & Water Rates', fees.standard.councilRates + fees.standard.waterRates, null, 'Quarterly council and water charges (prorated at settlement)')}
                    </div>
                </div>
            </div>

            <!-- Annual Ongoing Fees (Collapsible) -->
            <div class="border border-green-200 rounded-lg">
                <button onclick="toggleSection('annual-fees')"
                    class="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 transition-colors rounded-t-lg">
                    <div class="flex items-center">
                        ${icons.calendar('w-5 h-5 text-green-600 mr-3')}
                        <h3 class="text-lg font-semibold text-gray-900">${t('annualFees')}</h3>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-xl font-bold text-green-600">${formatCurrency(fees.annualTotal)}/year</span>
                        <span id="annual-fees-icon" class="transform transition-transform">▼</span>
                    </div>
                </button>
                <div id="annual-fees" class="collapsible-content">
                    <div class="p-4 space-y-3">
                        ${fees.annual.vacancyFee > 0 ? renderFeeLineItem('vacancyFee', 'Annual Vacancy Fee', fees.annual.vacancyFee, 'vacancyFeeDesc', 'Mandatory annual fee if property is vacant for more than 6 months') : ''}
                        ${renderFeeLineItem('landTaxSurcharge', 'Foreign Owner Land Tax Surcharge', fees.annual.landTaxSurcharge, 'landTaxSurchargeDesc', `${state.formData.state} charges ${getLandTaxRate(state.formData.state)} annually on top of standard land tax`)}
                        ${renderFeeLineItem('annualCouncilRates', 'Council Rates', fees.annual.councilRates, null, 'Annual local council rates for property services')}
                        ${renderFeeLineItem('annualWaterRates', 'Water Rates', fees.annual.waterRates, null, 'Annual water and sewerage charges')}
                        ${renderFeeLineItem('annualInsurance', 'Property Insurance', fees.annual.insurance, null, 'Annual building and contents insurance (estimated)')}
                    </div>
                    <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div class="flex items-start">
                            <span class="text-2xl mr-3">💡</span>
                            <div>
                                <h4 class="font-semibold text-yellow-900">10-Year Cost Projection</h4>
                                <p class="text-sm text-yellow-800 mt-1">
                                    Over 10 years, your annual costs will total approximately
                                    <span class="font-bold">${formatCurrency(fees.annualTotal * 10)}</span>
                                    (assuming no rate increases). Add this to your upfront costs for true ownership cost.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render individual fee line item with tooltip
 * @param {string} labelKey - Translation key for label
 * @param {string} fallbackLabel - Fallback label if translation missing
 * @param {number} amount - Fee amount
 * @param {string} descKey - Translation key for description (optional)
 * @param {string} customDesc - Custom description (optional)
 * @returns {string} HTML string for fee line item
 */
function renderFeeLineItem(labelKey, fallbackLabel, amount, descKey, customDesc) {
    const label = t(labelKey) || fallbackLabel;
    const description = descKey ? t(descKey) : customDesc;

    return `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
            <div class="flex items-center flex-1">
                <span class="font-semibold text-gray-900">${label}</span>
                ${description ? `
                    <div class="relative ml-2">
                        <button class="info-icon text-gray-400 hover:text-blue-600 transition-colors"
                            onmouseover="showTooltip(this, '${escapeHTML(description).replace(/'/g, "\\'")}')"
                            onmouseout="hideTooltip(this)">
                            ℹ️
                        </button>
                    </div>
                ` : ''}
            </div>
            <span class="text-lg font-bold text-gray-900 ml-4">${formatCurrency(amount)}</span>
        </div>
    `;
}

/**
 * Render action buttons for payment and download
 * @returns {string} HTML string for action buttons
 */
function renderActionButtons() {
    return `
        <div class="bg-white p-8 rounded-xl shadow-md">
            <div class="bg-blue-50 p-6 rounded-lg mb-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-xl font-bold mb-1">${t('ourServiceFee')}</h3>
                        <p class="text-sm text-gray-600">${t('detailedReport')}</p>
                    </div>
                    <span class="text-3xl font-bold text-blue-600">$50</span>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <button onclick="showSaveScenarioModal()"
                    class="bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transform hover:scale-105 transition-all flex items-center justify-center space-x-2">
                    ${icons.fileText('w-5 h-5')}
                    <span>Save Scenario</span>
                </button>
                <button onclick="typeof generateProfessionalPDF === 'function' && generateProfessionalPDF()"
                    class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all flex items-center justify-center space-x-2">
                    ${icons.download('w-5 h-5')}
                    <span>PDF Report</span>
                </button>
            </div>
            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <button onclick="typeof showEmailResultsModal === 'function' && showEmailResultsModal()"
                    class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all flex items-center justify-center space-x-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span>Email Results</span>
                </button>
                <button onclick="typeof showChecklistModal === 'function' && showChecklistModal()"
                    class="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-4 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-600 transform hover:scale-105 transition-all flex items-center justify-center space-x-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                    <span>Document Checklist</span>
                </button>
            </div>
            <div class="grid md:grid-cols-2 gap-4 mb-6">
                <button onclick="handlePayment()"
                    ${state.isProcessingPayment ? 'disabled' : ''}
                    class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all flex items-center justify-center space-x-2 ${state.isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}">
                    ${icons.dollarSign('w-5 h-5')}
                    <span>${state.isProcessingPayment ? t('processing') : t('proceedPayment')}</span>
                </button>
                <button onclick="downloadReport()" class="bg-gray-100 text-gray-900 px-6 py-4 rounded-lg font-semibold hover:bg-gray-200 transform hover:scale-105 transition-all flex items-center justify-center space-x-2">
                    ${icons.download('w-5 h-5')}
                    <span>${t('downloadReport')}</span>
                </button>
            </div>

            <p class="text-sm text-gray-500 text-center">${t('estimates')}</p>
        </div>
    `;
}

/**
 * Render scenarios sidebar panel
 * @returns {string} HTML for scenarios sidebar
 */
function renderScenariosSidebarPanel() {
    return `
        <div class="bg-white p-6 rounded-xl shadow-md sticky top-24">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold">Saved Scenarios</h3>
                <div class="flex space-x-2">
                    <button onclick="exportScenariosJSON()" title="Export" class="text-gray-600 hover:text-blue-600">
                        ${icons.download('w-4 h-4')}
                    </button>
                    <button onclick="importScenariosJSON()" title="Import" class="text-gray-600 hover:text-blue-600">
                        ${icons.fileText('w-4 h-4')}
                    </button>
                </div>
            </div>

            ${typeof renderScenariosSidebar === 'function' ? renderScenariosSidebar() : '<p class="text-sm text-gray-500">Loading...</p>'}

            <button id="compare-scenarios-btn"
                onclick="showScenarioComparison()"
                disabled
                class="w-full mt-6 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition opacity-50 cursor-not-allowed">
                Select 2-3 to Compare
            </button>

            ${typeof getLastSavedIndicatorHTML === 'function' ? `
                <div class="mt-4 pt-4 border-t border-gray-200">
                    ${getLastSavedIndicatorHTML()}
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Toggle collapsible section visibility
 * @param {string} sectionId - ID of section to toggle
 */
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const icon = document.getElementById(sectionId + '-icon');

    if (section && icon) {
        const isOpen = section.style.maxHeight && section.style.maxHeight !== '0px';

        if (isOpen) {
            section.style.maxHeight = '0px';
            icon.style.transform = 'rotate(0deg)';
        } else {
            section.style.maxHeight = section.scrollHeight + 'px';
            icon.style.transform = 'rotate(180deg)';
        }
    }
}

/**
 * Show tooltip on hover
 * @param {HTMLElement} element - Element to show tooltip near
 * @param {string} text - Tooltip text
 */
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg max-w-xs';
    tooltip.style.bottom = '100%';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%) translateY(-8px)';
    tooltip.style.whiteSpace = 'normal';
    tooltip.textContent = text;
    tooltip.id = 'active-tooltip';

    element.parentElement.style.position = 'relative';
    element.parentElement.appendChild(tooltip);
}

/**
 * Hide tooltip
 * @param {HTMLElement} element - Element that had tooltip
 */
function hideTooltip(element) {
    const tooltip = document.getElementById('active-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

/**
 * Calculate comparison scenarios for different states, citizenship, property types
 * @param {Object} currentFees - Current calculated fees
 * @param {number} propertyValue - Property value
 * @returns {Object} Comparison data
 */
function calculateComparisonScenarios(currentFees, propertyValue) {
    const states = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'];
    const currentState = state.formData.state;

    // Calculate costs for all states
    const stateCosts = states.map(stateCode => {
        const tempFormData = { ...state.formData, state: stateCode };
        const fees = calculateAllFees(tempFormData);
        return {
            state: stateCode,
            total: fees.firstYearTotal,
            difference: fees.firstYearTotal - currentFees.firstYearTotal
        };
    });

    // Find best and worst states
    const sortedStates = stateCosts.sort((a, b) => a.total - b.total);
    const bestState = sortedStates[0];
    const worstState = sortedStates[sortedStates.length - 1];

    // Calculate Australian citizen cost (no FIRB fee, no surcharges)
    const citizenUpfront = currentFees.standardTotal;
    const citizenAnnual = currentFees.annual.councilRates + currentFees.annual.waterRates + currentFees.annual.insurance;
    const citizenTotal = citizenUpfront + citizenAnnual;
    const foreignPremium = currentFees.firstYearTotal - citizenTotal;

    // Property type comparison
    let propertyTypeComparison = { difference: 'N/A', message: '', details: '' };
    if (state.formData.propertyType === 'established') {
        const newDwellingData = { ...state.formData, propertyType: 'newDwelling' };
        const newDwellingFees = calculateAllFees(newDwellingData);
        const diff = newDwellingFees.firstYearTotal - currentFees.firstYearTotal;
        propertyTypeComparison = {
            difference: diff > 0 ? `+${formatCurrency(diff)}` : formatCurrency(Math.abs(diff)),
            message: diff > 0 ? 'New dwelling costs more' : 'New dwelling saves money',
            details: `New dwelling first year total: ${formatCurrency(newDwellingFees.firstYearTotal)}`
        };
    } else if (state.formData.propertyType === 'newDwelling') {
        const establishedData = { ...state.formData, propertyType: 'established' };
        const establishedFees = calculateAllFees(establishedData);
        const diff = currentFees.firstYearTotal - establishedFees.firstYearTotal;
        propertyTypeComparison = {
            difference: formatCurrency(diff),
            message: 'Premium for new dwelling',
            details: `Established dwelling would cost: ${formatCurrency(establishedFees.firstYearTotal)}`
        };
    } else {
        propertyTypeComparison = {
            difference: '$0',
            message: 'Vacant land - no vacancy fee',
            details: 'Vacancy fee only applies to dwellings'
        };
    }

    return {
        bestState: {
            state: bestState.state,
            total: bestState.total,
            savings: currentFees.firstYearTotal - bestState.total
        },
        worstState: {
            state: worstState.state,
            total: worstState.total,
            difference: worstState.total - currentFees.firstYearTotal
        },
        citizenCost: citizenTotal,
        foreignPremium: foreignPremium,
        propertyTypeComparison: propertyTypeComparison,
        allStateCosts: stateCosts
    };
}

/**
 * Get land tax surcharge rate for display
 * @param {string} stateCode - State code
 * @returns {string} Formatted rate string
 */
function getLandTaxRate(stateCode) {
    const rates = {
        NSW: '2.0%', VIC: '1.5%', QLD: '2.0%', SA: '0.5%',
        WA: '4.0%', TAS: '1.5%', ACT: '0.75%', NT: '0%'
    };
    return rates[stateCode] || '2.0%';
}

/**
 * Initialize charts after dashboard render
 * Must be called after DOM is ready
 */
function initializeDashboardCharts() {
    console.log('[CHARTS DEBUG] initializeDashboardCharts called');
    console.log('[CHARTS DEBUG] state.calculatedFees:', state.calculatedFees);
    console.log('[CHARTS DEBUG] window.Recharts:', typeof window.Recharts);
    console.log('[CHARTS DEBUG] window.React:', typeof window.React);
    console.log('[CHARTS DEBUG] window.ReactDOM:', typeof window.ReactDOM);
    
    if (!state.calculatedFees) {
        console.warn('[CHARTS DEBUG] No calculated fees available');
        return;
    }

    const fees = state.calculatedFees;
    console.log('[CHARTS DEBUG] Fees object:', fees);
    
    const comparisons = calculateComparisonScenarios(fees, parseFloat(state.formData.propertyValue));
    console.log('[CHARTS DEBUG] Comparisons calculated:', comparisons);

    // Check if chart containers exist
    const pieContainer = document.getElementById('pie-chart-container');
    const donutContainer = document.getElementById('donut-chart-container');
    const barContainer = document.getElementById('bar-chart-container');
    
    console.log('[CHARTS DEBUG] Pie container:', pieContainer);
    console.log('[CHARTS DEBUG] Donut container:', donutContainer);
    console.log('[CHARTS DEBUG] Bar container:', barContainer);

    // Render Pie Chart
    console.log('[CHARTS DEBUG] Rendering pie chart...');
    renderPieChart(fees);

    // Render Donut Chart
    console.log('[CHARTS DEBUG] Rendering donut chart...');
    renderDonutChart(fees);

    // Render Bar Chart
    console.log('[CHARTS DEBUG] Rendering bar chart...');
    renderBarChart(comparisons.allStateCosts);
    
    console.log('[CHARTS DEBUG] All charts rendered');
}
