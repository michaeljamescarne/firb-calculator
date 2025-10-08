// Investment Analysis Tool
// =========================================

// Investment state
let investmentState = {
    inputs: {
        purchasePrice: 850000,
        weeklyRent: 650,
        capitalGrowthRate: 5.0,
        holdPeriod: 10,
        vacancyRate: 4,
        managementFeePercent: 7,
        annualMaintenance: 2000,
        annualInsurance: 1500,
        councilRates: 2500,
        homeCurrencyCode: 'USD',
        exchangeRate: 0.65,
        homeCountryReturnRate: 7.0
    },
    firbCosts: null,
    calculations: null,
    scenarios: null
};

// Currency data
const currencies = {
    'USD': { name: 'US Dollar', symbol: '$', typical: 0.65 },
    'CNY': { name: 'Chinese Yuan', symbol: '¥', typical: 4.5 },
    'GBP': { name: 'British Pound', symbol: '£', typical: 0.52 },
    'EUR': { name: 'Euro', symbol: '€', typical: 0.61 },
    'SGD': { name: 'Singapore Dollar', symbol: 'S$', typical: 0.87 },
    'HKD': { name: 'Hong Kong Dollar', symbol: 'HK$', typical: 5.1 },
    'INR': { name: 'Indian Rupee', symbol: '₹', typical: 54 },
    'MYR': { name: 'Malaysian Ringgit', symbol: 'RM', typical: 3.0 }
};

// Initialize investment tool
function initInvestmentTool(firbCosts) {
    investmentState.firbCosts = firbCosts;

    // Load saved inputs
    const saved = loadFromStorage('firb_investment_inputs');
    if (saved) {
        investmentState.inputs = { ...investmentState.inputs, ...saved };
    }

    // Calculate initial results
    calculateInvestmentAnalysis();
}

// Save investment inputs
function saveInvestmentInputs() {
    saveToStorage('firb_investment_inputs', investmentState.inputs);
}

// Update investment input
function updateInvestmentInput(field, value) {
    investmentState.inputs[field] = parseFloat(value) || value;
    saveInvestmentInputs();
    calculateInvestmentAnalysis();
    renderInvestmentDisplay();
}

// Calculate comprehensive investment analysis
function calculateInvestmentAnalysis() {
    const inputs = investmentState.inputs;
    const firb = investmentState.firbCosts;

    if (!firb) {
        investmentState.calculations = null;
        return;
    }

    // Calculate total investment required
    const totalInvestment = inputs.purchasePrice + firb.grandTotal;

    // Annual rental calculations
    const annualRentGross = inputs.weeklyRent * 52;
    const vacancyLoss = annualRentGross * (inputs.vacancyRate / 100);
    const managementFees = (annualRentGross - vacancyLoss) * (inputs.managementFeePercent / 100);
    const annualRentNet = annualRentGross - vacancyLoss - managementFees;

    // Annual expenses
    const annualExpenses =
        inputs.annualMaintenance +
        inputs.annualInsurance +
        inputs.councilRates +
        managementFees +
        (firb.landTaxSurcharge || 0) +
        (firb.vacancyFee || 0);

    // Annual cash flow
    const annualCashFlow = annualRentNet - annualExpenses;

    // Rental yields
    const grossRentalYield = (annualRentGross / inputs.purchasePrice) * 100;
    const netRentalYield = (annualCashFlow / totalInvestment) * 100;

    // Year-by-year projections
    const yearlyProjections = [];
    let propertyValue = inputs.purchasePrice;
    let totalRentalIncome = 0;
    let totalExpenses = 0;

    for (let year = 1; year <= inputs.holdPeriod; year++) {
        // Property value with capital growth
        propertyValue = propertyValue * (1 + inputs.capitalGrowthRate / 100);

        // Rental income (assuming rent grows with property value)
        const yearRentGross = annualRentGross * Math.pow(1 + inputs.capitalGrowthRate / 100, year - 1);
        const yearVacancyLoss = yearRentGross * (inputs.vacancyRate / 100);
        const yearManagementFees = (yearRentGross - yearVacancyLoss) * (inputs.managementFeePercent / 100);
        const yearRentNet = yearRentGross - yearVacancyLoss - yearManagementFees;

        // Expenses
        const yearExpenses =
            inputs.annualMaintenance +
            inputs.annualInsurance +
            inputs.councilRates +
            yearManagementFees +
            (firb.landTaxSurcharge || 0);

        const yearCashFlow = yearRentNet - yearExpenses;

        totalRentalIncome += yearRentNet;
        totalExpenses += yearExpenses;

        yearlyProjections.push({
            year,
            propertyValue,
            rentalIncome: yearRentNet,
            expenses: yearExpenses,
            cashFlow: yearCashFlow,
            cumulativeCashFlow: yearlyProjections.reduce((sum, y) => sum + y.cashFlow, yearCashFlow)
        });
    }

    // Final calculations
    const finalPropertyValue = yearlyProjections[yearlyProjections.length - 1].propertyValue;
    const capitalGain = finalPropertyValue - inputs.purchasePrice;
    const totalReturn = capitalGain + totalRentalIncome - totalExpenses;
    const roi = (totalReturn / totalInvestment) * 100;
    const annualizedReturn = (Math.pow(1 + (totalReturn / totalInvestment), 1 / inputs.holdPeriod) - 1) * 100;

    // Break-even analysis
    let breakEvenYear = null;
    for (let i = 0; i < yearlyProjections.length; i++) {
        if (yearlyProjections[i].cumulativeCashFlow + (yearlyProjections[i].propertyValue - inputs.purchasePrice) >= totalInvestment) {
            breakEvenYear = i + 1;
            break;
        }
    }

    // Currency conversion
    const homeCountryInvestment = totalInvestment * inputs.exchangeRate;
    const homeCountryReturn = totalReturn * inputs.exchangeRate;
    const homeCountryAlternativeReturn = homeCountryInvestment * Math.pow(1 + inputs.homeCountryReturnRate / 100, inputs.holdPeriod);
    const homeCountryAlternativeGain = homeCountryAlternativeReturn - homeCountryInvestment;

    investmentState.calculations = {
        totalInvestment,
        annualRentGross,
        annualRentNet,
        annualExpenses,
        annualCashFlow,
        grossRentalYield,
        netRentalYield,
        totalRentalIncome,
        totalExpenses,
        capitalGain,
        finalPropertyValue,
        totalReturn,
        roi,
        annualizedReturn,
        breakEvenYear,
        yearlyProjections,
        homeCountry: {
            investment: homeCountryInvestment,
            return: homeCountryReturn,
            alternativeReturn: homeCountryAlternativeReturn,
            alternativeGain: homeCountryAlternativeGain,
            difference: homeCountryReturn - homeCountryAlternativeGain
        }
    };

    // Calculate scenarios
    calculateScenarios();
}

// Calculate best/expected/worst case scenarios
function calculateScenarios() {
    const inputs = investmentState.inputs;

    const scenarios = {
        best: calculateScenario(inputs.capitalGrowthRate + 3, inputs.vacancyRate - 2),
        expected: investmentState.calculations,
        worst: calculateScenario(inputs.capitalGrowthRate - 3, inputs.vacancyRate + 4)
    };

    investmentState.scenarios = scenarios;
}

// Calculate scenario with different parameters
function calculateScenario(growthRate, vacancyRate) {
    const originalGrowth = investmentState.inputs.capitalGrowthRate;
    const originalVacancy = investmentState.inputs.vacancyRate;

    investmentState.inputs.capitalGrowthRate = Math.max(0, growthRate);
    investmentState.inputs.vacancyRate = Math.max(0, Math.min(100, vacancyRate));

    const tempFirb = investmentState.firbCosts;
    const tempInputs = { ...investmentState.inputs };

    // Recalculate with scenario parameters
    const totalInvestment = tempInputs.purchasePrice + tempFirb.grandTotal;
    const annualRentGross = tempInputs.weeklyRent * 52;
    const vacancyLoss = annualRentGross * (tempInputs.vacancyRate / 100);
    const managementFees = (annualRentGross - vacancyLoss) * (tempInputs.managementFeePercent / 100);
    const annualRentNet = annualRentGross - vacancyLoss - managementFees;
    const annualExpenses = tempInputs.annualMaintenance + tempInputs.annualInsurance +
                          tempInputs.councilRates + managementFees + (tempFirb.landTaxSurcharge || 0);

    let propertyValue = tempInputs.purchasePrice;
    let totalRentalIncome = 0;

    for (let year = 1; year <= tempInputs.holdPeriod; year++) {
        propertyValue = propertyValue * (1 + tempInputs.capitalGrowthRate / 100);
        const yearRentNet = annualRentNet * Math.pow(1 + tempInputs.capitalGrowthRate / 100, year - 1);
        totalRentalIncome += yearRentNet;
    }

    const capitalGain = propertyValue - tempInputs.purchasePrice;
    const totalReturn = capitalGain + totalRentalIncome - (annualExpenses * tempInputs.holdPeriod);
    const roi = (totalReturn / totalInvestment) * 100;

    // Restore original values
    investmentState.inputs.capitalGrowthRate = originalGrowth;
    investmentState.inputs.vacancyRate = originalVacancy;

    return {
        growthRate: tempInputs.capitalGrowthRate,
        vacancyRate: tempInputs.vacancyRate,
        finalValue: propertyValue,
        totalReturn,
        roi,
        totalInvestment
    };
}

// Render investment analysis inputs form
function renderInvestmentInputsForm() {
    const inputs = investmentState.inputs;
    const currency = currencies[inputs.homeCurrencyCode];

    return `
        <div class="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Investment Analysis Inputs</h3>
            <p class="text-gray-600 mb-6">
                Customize your investment assumptions to see projected returns and compare with alternative investments.
            </p>

            <div class="grid md:grid-cols-2 gap-6">
                <!-- Purchase Details -->
                <div>
                    <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                        Property Details
                    </h4>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Purchase Price (AUD)</label>
                            <input
                                type="number"
                                value="${inputs.purchasePrice}"
                                onchange="updateInvestmentInput('purchasePrice', this.value)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Expected Weekly Rent (AUD)</label>
                            <input
                                type="number"
                                value="${inputs.weeklyRent}"
                                onchange="updateInvestmentInput('weeklyRent', this.value)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p class="text-xs text-gray-500 mt-1">Annual: ${formatCurrency(inputs.weeklyRent * 52)}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Expected Capital Growth Rate (%)</label>
                            <div class="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="15"
                                    step="0.5"
                                    value="${inputs.capitalGrowthRate}"
                                    onchange="updateInvestmentInput('capitalGrowthRate', this.value)"
                                    class="flex-1"
                                />
                                <span class="text-sm font-medium text-gray-900 w-12">${inputs.capitalGrowthRate}%</span>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">Historical avg: 5-7% in major cities</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Hold Period (Years)</label>
                            <input
                                type="number"
                                min="1"
                                max="30"
                                value="${inputs.holdPeriod}"
                                onchange="updateInvestmentInput('holdPeriod', this.value)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                <!-- Operating Costs -->
                <div>
                    <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Operating Costs
                    </h4>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Vacancy Rate (%)</label>
                            <div class="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    step="1"
                                    value="${inputs.vacancyRate}"
                                    onchange="updateInvestmentInput('vacancyRate', this.value)"
                                    class="flex-1"
                                />
                                <span class="text-sm font-medium text-gray-900 w-12">${inputs.vacancyRate}%</span>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">Typical: 2-6% per year</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Property Management Fee (%)</label>
                            <div class="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="15"
                                    step="0.5"
                                    value="${inputs.managementFeePercent}"
                                    onchange="updateInvestmentInput('managementFeePercent', this.value)"
                                    class="flex-1"
                                />
                                <span class="text-sm font-medium text-gray-900 w-12">${inputs.managementFeePercent}%</span>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">Typical: 6-10% of rent</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Annual Maintenance (AUD)</label>
                            <input
                                type="number"
                                value="${inputs.annualMaintenance}"
                                onchange="updateInvestmentInput('annualMaintenance', this.value)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p class="text-xs text-gray-500 mt-1">Typical: 1% of property value</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Annual Insurance (AUD)</label>
                            <input
                                type="number"
                                value="${inputs.annualInsurance}"
                                onchange="updateInvestmentInput('annualInsurance', this.value)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Annual Council Rates (AUD)</label>
                            <input
                                type="number"
                                value="${inputs.councilRates}"
                                onchange="updateInvestmentInput('councilRates', this.value)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                <!-- Home Country Comparison -->
                <div class="md:col-span-2">
                    <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Home Country Comparison
                    </h4>

                    <div class="grid md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Your Home Currency</label>
                            <select
                                onchange="updateInvestmentInput('homeCurrencyCode', this.value)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                ${Object.entries(currencies).map(([code, curr]) => `
                                    <option value="${code}" ${inputs.homeCurrencyCode === code ? 'selected' : ''}>
                                        ${curr.name} (${curr.symbol})
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Exchange Rate (AUD to ${inputs.homeCurrencyCode})</label>
                            <input
                                type="number"
                                step="0.01"
                                value="${inputs.exchangeRate}"
                                onchange="updateInvestmentInput('exchangeRate', this.value)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p class="text-xs text-gray-500 mt-1">Current typical: ${currency.typical}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Alternative Investment Return (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                value="${inputs.homeCountryReturnRate}"
                                onchange="updateInvestmentInput('homeCountryReturnRate', this.value)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p class="text-xs text-gray-500 mt-1">e.g., stocks, bonds, savings</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render investment analysis results
function renderInvestmentAnalysis() {
    if (!investmentState.calculations) {
        return `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <svg class="w-12 h-12 text-yellow-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <h3 class="text-lg font-semibold text-yellow-900 mb-2">Complete Calculator First</h3>
                <p class="text-yellow-800">
                    Please complete the FIRB calculator above to see your investment analysis.
                </p>
            </div>
        `;
    }

    const calc = investmentState.calculations;
    const inputs = investmentState.inputs;
    const currency = currencies[inputs.homeCurrencyCode];

    return `
        <!-- Investment Disclaimer -->
        <div class="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
            <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <div>
                    <h4 class="font-bold text-red-900 mb-2">Investment Risk Disclaimer</h4>
                    <ul class="text-sm text-red-800 space-y-1">
                        <li>• This analysis is based on assumptions and projections that may not reflect actual outcomes</li>
                        <li>• Property values can go down as well as up - past performance is not indicative of future results</li>
                        <li>• Rental income is not guaranteed and vacancy periods may be longer than estimated</li>
                        <li>• Currency exchange rates fluctuate and can significantly impact returns</li>
                        <li>• Additional costs may arise (repairs, legal fees, selling costs, capital gains tax)</li>
                        <li>• This is not financial advice - consult a qualified financial advisor before making investment decisions</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid md:grid-cols-4 gap-4 mb-6">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                <div class="text-sm opacity-90 mb-1">Total Investment Required</div>
                <div class="text-3xl font-bold">${formatCurrency(calc.totalInvestment)}</div>
                <div class="text-xs opacity-80 mt-2">Property + FIRB Costs</div>
            </div>

            <div class="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
                <div class="text-sm opacity-90 mb-1">Total Return (${inputs.holdPeriod} years)</div>
                <div class="text-3xl font-bold">${formatCurrency(calc.totalReturn)}</div>
                <div class="text-xs opacity-80 mt-2">Capital + Rental Income</div>
            </div>

            <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                <div class="text-sm opacity-90 mb-1">ROI</div>
                <div class="text-3xl font-bold">${calc.roi.toFixed(1)}%</div>
                <div class="text-xs opacity-80 mt-2">Annualized: ${calc.annualizedReturn.toFixed(1)}%/yr</div>
            </div>

            <div class="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                <div class="text-sm opacity-90 mb-1">Net Rental Yield</div>
                <div class="text-3xl font-bold">${calc.netRentalYield.toFixed(2)}%</div>
                <div class="text-xs opacity-80 mt-2">Gross: ${calc.grossRentalYield.toFixed(2)}%</div>
            </div>
        </div>

        <!-- Detailed Breakdown -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white p-6 rounded-xl shadow-md">
                <h4 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    Annual Cash Flow Analysis
                </h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Gross Rental Income</span>
                        <span class="font-semibold text-green-600">+${formatCurrency(calc.annualRentGross)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-500 pl-4">Less: Vacancy (${inputs.vacancyRate}%)</span>
                        <span class="text-red-600">-${formatCurrency(calc.annualRentGross * inputs.vacancyRate / 100)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-500 pl-4">Less: Management (${inputs.managementFeePercent}%)</span>
                        <span class="text-red-600">-${formatCurrency(calc.annualRentGross * inputs.managementFeePercent / 100 * (1 - inputs.vacancyRate / 100))}</span>
                    </div>
                    <div class="border-t pt-2 flex justify-between">
                        <span class="text-gray-600">Net Rental Income</span>
                        <span class="font-semibold">${formatCurrency(calc.annualRentNet)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-500">Less: Operating Expenses</span>
                        <span class="text-red-600">-${formatCurrency(calc.annualExpenses)}</span>
                    </div>
                    <div class="border-t-2 border-gray-300 pt-2 flex justify-between">
                        <span class="font-bold text-gray-900">Annual Cash Flow</span>
                        <span class="font-bold ${calc.annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}">
                            ${calc.annualCashFlow >= 0 ? '+' : ''}${formatCurrency(calc.annualCashFlow)}
                        </span>
                    </div>
                    ${calc.annualCashFlow < 0 ? `
                        <div class="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                            <strong class="text-yellow-900">Negative Cash Flow:</strong>
                            <span class="text-yellow-800">You'll need to contribute ${formatCurrency(Math.abs(calc.annualCashFlow))} per year to cover costs.</span>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-md">
                <h4 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                    ${inputs.holdPeriod}-Year Projection
                </h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Initial Property Value</span>
                        <span class="font-semibold">${formatCurrency(inputs.purchasePrice)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Projected Final Value</span>
                        <span class="font-semibold text-green-600">${formatCurrency(calc.finalPropertyValue)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Capital Gain</span>
                        <span class="font-semibold text-green-600">+${formatCurrency(calc.capitalGain)}</span>
                    </div>
                    <div class="border-t pt-2 flex justify-between text-sm">
                        <span class="text-gray-600">Total Rental Income</span>
                        <span class="text-green-600">+${formatCurrency(calc.totalRentalIncome)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Total Expenses</span>
                        <span class="text-red-600">-${formatCurrency(calc.totalExpenses)}</span>
                    </div>
                    <div class="border-t-2 border-gray-300 pt-2 flex justify-between">
                        <span class="font-bold text-gray-900">Net Profit</span>
                        <span class="font-bold text-green-600">+${formatCurrency(calc.totalReturn)}</span>
                    </div>
                    ${calc.breakEvenYear ? `
                        <div class="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                            <strong class="text-blue-900">Break-Even:</strong>
                            <span class="text-blue-800">Year ${calc.breakEvenYear} (including capital growth)</span>
                        </div>
                    ` : `
                        <div class="bg-red-50 border border-red-200 rounded p-3 text-sm">
                            <strong class="text-red-900">No Break-Even:</strong>
                            <span class="text-red-800">Investment doesn't break even within ${inputs.holdPeriod} years</span>
                        </div>
                    `}
                </div>
            </div>
        </div>

        <!-- Charts -->
        <div class="bg-white p-6 rounded-xl shadow-md mb-6">
            <h4 class="font-bold text-gray-900 mb-4">Property Value Projection</h4>
            <div id="property-value-chart" class="h-80"></div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md mb-6">
            <h4 class="font-bold text-gray-900 mb-4">Year-by-Year Cash Flow</h4>
            <div id="cash-flow-chart" class="h-80"></div>
        </div>

        <!-- Scenario Comparison -->
        ${renderScenarioComparison()}

        <!-- Home Country Comparison -->
        ${renderHomeCountryComparison()}
    `;
}

// Render scenario comparison
function renderScenarioComparison() {
    if (!investmentState.scenarios) return '';

    const scenarios = investmentState.scenarios;

    return `
        <div class="bg-white p-6 rounded-xl shadow-md mb-6">
            <h4 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Scenario Analysis
            </h4>
            <p class="text-sm text-gray-600 mb-4">
                Compare best case, expected case, and worst case projections based on different growth and vacancy assumptions.
            </p>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b-2 border-gray-300">
                            <th class="text-left py-3 px-4 font-semibold text-gray-700">Scenario</th>
                            <th class="text-right py-3 px-4 font-semibold text-gray-700">Growth Rate</th>
                            <th class="text-right py-3 px-4 font-semibold text-gray-700">Vacancy Rate</th>
                            <th class="text-right py-3 px-4 font-semibold text-gray-700">Final Value</th>
                            <th class="text-right py-3 px-4 font-semibold text-gray-700">Total Return</th>
                            <th class="text-right py-3 px-4 font-semibold text-gray-700">ROI</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-200 bg-green-50">
                            <td class="py-3 px-4">
                                <span class="font-semibold text-green-900">Best Case</span>
                                <div class="text-xs text-green-700">Higher growth, lower vacancy</div>
                            </td>
                            <td class="text-right py-3 px-4 text-green-900">${scenarios.best.growthRate.toFixed(1)}%</td>
                            <td class="text-right py-3 px-4 text-green-900">${scenarios.best.vacancyRate.toFixed(0)}%</td>
                            <td class="text-right py-3 px-4 font-semibold text-green-900">${formatCurrency(scenarios.best.finalValue)}</td>
                            <td class="text-right py-3 px-4 font-semibold text-green-900">${formatCurrency(scenarios.best.totalReturn)}</td>
                            <td class="text-right py-3 px-4 font-bold text-green-900">${scenarios.best.roi.toFixed(1)}%</td>
                        </tr>
                        <tr class="border-b border-gray-200 bg-blue-50">
                            <td class="py-3 px-4">
                                <span class="font-semibold text-blue-900">Expected Case</span>
                                <div class="text-xs text-blue-700">Your current assumptions</div>
                            </td>
                            <td class="text-right py-3 px-4 text-blue-900">${scenarios.expected.grossRentalYield.toFixed(1)}%</td>
                            <td class="text-right py-3 px-4 text-blue-900">${investmentState.inputs.vacancyRate.toFixed(0)}%</td>
                            <td class="text-right py-3 px-4 font-semibold text-blue-900">${formatCurrency(scenarios.expected.finalPropertyValue)}</td>
                            <td class="text-right py-3 px-4 font-semibold text-blue-900">${formatCurrency(scenarios.expected.totalReturn)}</td>
                            <td class="text-right py-3 px-4 font-bold text-blue-900">${scenarios.expected.roi.toFixed(1)}%</td>
                        </tr>
                        <tr class="border-b border-gray-200 bg-red-50">
                            <td class="py-3 px-4">
                                <span class="font-semibold text-red-900">Worst Case</span>
                                <div class="text-xs text-red-700">Lower growth, higher vacancy</div>
                            </td>
                            <td class="text-right py-3 px-4 text-red-900">${scenarios.worst.growthRate.toFixed(1)}%</td>
                            <td class="text-right py-3 px-4 text-red-900">${scenarios.worst.vacancyRate.toFixed(0)}%</td>
                            <td class="text-right py-3 px-4 font-semibold text-red-900">${formatCurrency(scenarios.worst.finalValue)}</td>
                            <td class="text-right py-3 px-4 font-semibold text-red-900">${formatCurrency(scenarios.worst.totalReturn)}</td>
                            <td class="text-right py-3 px-4 font-bold text-red-900">${scenarios.worst.roi.toFixed(1)}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p class="text-sm text-yellow-900">
                    <strong>Sensitivity Range:</strong>
                    Your ROI could range from <strong>${scenarios.worst.roi.toFixed(1)}%</strong> (worst case)
                    to <strong>${scenarios.best.roi.toFixed(1)}%</strong> (best case),
                    a difference of <strong>${(scenarios.best.roi - scenarios.worst.roi).toFixed(1)} percentage points</strong>.
                </p>
            </div>
        </div>
    `;
}

// Render home country comparison
function renderHomeCountryComparison() {
    if (!investmentState.calculations) return '';

    const calc = investmentState.calculations;
    const inputs = investmentState.inputs;
    const currency = currencies[inputs.homeCurrencyCode];
    const home = calc.homeCountry;

    const auPropertyBetter = home.difference > 0;

    return `
        <div class="bg-white p-6 rounded-xl shadow-md mb-6">
            <h4 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Investment Comparison: Australia vs ${currency.name}
            </h4>

            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="border-2 ${auPropertyBetter ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="font-semibold text-gray-900">Australian Property</h5>
                        ${auPropertyBetter ? '<span class="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Better Return</span>' : ''}
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Investment (AUD)</span>
                            <span class="font-semibold">${formatCurrency(calc.totalInvestment)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Investment (${inputs.homeCurrencyCode})</span>
                            <span class="font-semibold">${currency.symbol}${(home.investment).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Total Return (AUD)</span>
                            <span class="font-semibold text-green-600">${formatCurrency(calc.totalReturn)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Total Return (${inputs.homeCurrencyCode})</span>
                            <span class="font-semibold text-green-600">${currency.symbol}${(home.return).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                        </div>
                        <div class="border-t pt-2 flex justify-between">
                            <span class="font-semibold text-gray-900">ROI</span>
                            <span class="font-bold text-green-600">${calc.roi.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <div class="border-2 ${!auPropertyBetter ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="font-semibold text-gray-900">Alternative Investment</h5>
                        ${!auPropertyBetter ? '<span class="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Better Return</span>' : ''}
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Investment (${inputs.homeCurrencyCode})</span>
                            <span class="font-semibold">${currency.symbol}${(home.investment).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Return Rate</span>
                            <span class="font-semibold">${inputs.homeCountryReturnRate}% per year</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Final Value (${inputs.homeCurrencyCode})</span>
                            <span class="font-semibold">${currency.symbol}${(home.alternativeReturn).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Total Gain (${inputs.homeCurrencyCode})</span>
                            <span class="font-semibold text-green-600">${currency.symbol}${(home.alternativeGain).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                        </div>
                        <div class="border-t pt-2 flex justify-between">
                            <span class="font-semibold text-gray-900">ROI</span>
                            <span class="font-bold text-green-600">${((home.alternativeGain / home.investment) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-4 ${auPropertyBetter ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'} rounded-lg">
                <div class="flex items-center gap-3">
                    ${auPropertyBetter ? `
                        <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                    ` : `
                        <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                        </svg>
                    `}
                    <div class="flex-1">
                        <h5 class="font-bold ${auPropertyBetter ? 'text-green-900' : 'text-red-900'} mb-1">
                            ${auPropertyBetter ? 'Australian Property Investment is Better' : 'Alternative Investment is Better'}
                        </h5>
                        <p class="text-sm ${auPropertyBetter ? 'text-green-800' : 'text-red-800'}">
                            ${auPropertyBetter
                                ? `You could earn an extra ${currency.symbol}${Math.abs(home.difference).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} with Australian property`
                                : `Alternative investment could earn ${currency.symbol}${Math.abs(home.difference).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} more`
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-sm text-blue-900">
                    <strong>Currency Risk:</strong> This comparison assumes a fixed exchange rate of 1 AUD = ${inputs.exchangeRate} ${inputs.homeCurrencyCode}.
                    Currency fluctuations can significantly impact your returns. A 10% change in exchange rate would alter your ${inputs.homeCurrencyCode} returns by approximately ${currency.symbol}${(home.return * 0.1).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}.
                </p>
            </div>
        </div>
    `;
}

// Initialize charts after render
function initInvestmentCharts() {
    if (!investmentState.calculations || typeof Recharts === 'undefined') return;

    const calc = investmentState.calculations;

    // Property Value Chart
    initPropertyValueChart(calc.yearlyProjections);

    // Cash Flow Chart
    initCashFlowChart(calc.yearlyProjections);
}

// Property value projection chart
function initPropertyValueChart(projections) {
    const container = document.getElementById('property-value-chart');
    if (!container) return;

    const data = projections.map(p => ({
        year: `Year ${p.year}`,
        value: Math.round(p.propertyValue)
    }));

    // Add initial value
    data.unshift({
        year: 'Now',
        value: investmentState.inputs.purchasePrice
    });

    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

    const element = React.createElement(
        ResponsiveContainer,
        { width: '100%', height: '100%' },
        React.createElement(LineChart, { data },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3' }),
            React.createElement(XAxis, { dataKey: 'year' }),
            React.createElement(YAxis, {
                tickFormatter: (value) => `$${(value / 1000).toFixed(0)}k`
            }),
            React.createElement(Tooltip, {
                formatter: (value) => `$${value.toLocaleString()}`
            }),
            React.createElement(Legend),
            React.createElement(Line, {
                type: 'monotone',
                dataKey: 'value',
                stroke: '#3B82F6',
                strokeWidth: 3,
                name: 'Property Value',
                dot: { r: 5 }
            })
        )
    );

    ReactDOM.render(element, container);
}

// Cash flow chart
function initCashFlowChart(projections) {
    const container = document.getElementById('cash-flow-chart');
    if (!container) return;

    const data = projections.map(p => ({
        year: `Year ${p.year}`,
        cashFlow: Math.round(p.cashFlow),
        cumulative: Math.round(p.cumulativeCashFlow)
    }));

    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

    const element = React.createElement(
        ResponsiveContainer,
        { width: '100%', height: '100%' },
        React.createElement(BarChart, { data },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3' }),
            React.createElement(XAxis, { dataKey: 'year' }),
            React.createElement(YAxis, {
                tickFormatter: (value) => `$${(value / 1000).toFixed(0)}k`
            }),
            React.createElement(Tooltip, {
                formatter: (value) => `$${value.toLocaleString()}`
            }),
            React.createElement(Legend),
            React.createElement(Bar, {
                dataKey: 'cashFlow',
                fill: '#10B981',
                name: 'Annual Cash Flow'
            }),
            React.createElement(Bar, {
                dataKey: 'cumulative',
                fill: '#3B82F6',
                name: 'Cumulative Cash Flow'
            })
        )
    );

    ReactDOM.render(element, container);
}

// Update investment display
function renderInvestmentDisplay() {
    const container = document.getElementById('investment-container');
    if (container) {
        container.innerHTML = renderInvestmentInputsForm() + renderInvestmentAnalysis();

        // Initialize charts after a short delay to ensure DOM is ready
        setTimeout(() => {
            if (typeof initInvestmentCharts === 'function') {
                initInvestmentCharts();
            }
        }, 100);
    }
}
