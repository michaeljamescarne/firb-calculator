/**
 * Cost Optimization Tool
 * Suggests ways to minimize FIRB costs through property type, location, timing, and structure optimization
 */

let optimizerState = {
    currentScenario: null,
    optimizations: null,
    userPreferences: {
        willingnessToWait: 12, // months
        locationFlexibility: 'medium', // low, medium, high
        considerJointPurchase: false
    }
};

// Major city equivalents for comparison
const cityEquivalents = {
    'Sydney': { state: 'NSW', tier: 'tier1', avgPrice: 1200000 },
    'Melbourne': { state: 'VIC', tier: 'tier1', avgPrice: 900000 },
    'Brisbane': { state: 'QLD', tier: 'tier2', avgPrice: 750000 },
    'Perth': { state: 'WA', tier: 'tier2', avgPrice: 650000 },
    'Adelaide': { state: 'SA', tier: 'tier2', avgPrice: 600000 },
    'Canberra': { state: 'ACT', tier: 'tier2', avgPrice: 850000 },
    'Darwin': { state: 'NT', tier: 'tier3', avgPrice: 550000 },
    'Hobart': { state: 'TAS', tier: 'tier3', avgPrice: 650000 }
};

// Visa pathway timelines (approximate months to permanent residency)
const visaPathways = {
    'temporary': {
        '482-TSS': { months: 36, description: 'Temporary Skill Shortage (TSS) visa pathway' },
        '485-Graduate': { months: 24, description: 'Post-study work visa to skilled migration' },
        '500-Student': { months: 48, description: 'Student visa to skilled migration' },
        '457-Convert': { months: 24, description: 'Convert existing 457 to PR' }
    },
    'skilled': {
        '189-Skilled': { months: 12, description: 'Skilled Independent visa (in progress)' },
        '190-StateNominated': { months: 18, description: 'State nominated skilled visa' },
        '491-Regional': { months: 60, description: 'Regional skilled visa (5 years to PR)' }
    },
    'family': {
        'Partner': { months: 24, description: 'Partner visa pathway' },
        'Parent': { months: 48, description: 'Parent visa pathway' }
    }
};

// Transport and lifestyle factors for different cities
const lifestyleFactors = {
    'Sydney': {
        avgCommute: 35,
        publicTransportScore: 8,
        jobMarket: 10,
        lifestyle: 'Major global city, beaches, high cost of living',
        airports: 'Sydney Airport (international hub)'
    },
    'Melbourne': {
        avgCommute: 32,
        publicTransportScore: 9,
        jobMarket: 9,
        lifestyle: 'Culture capital, arts, coffee, four seasons',
        airports: 'Melbourne Airport (international hub)'
    },
    'Brisbane': {
        avgCommute: 28,
        publicTransportScore: 7,
        jobMarket: 8,
        lifestyle: 'Subtropical climate, outdoor lifestyle, growing city',
        airports: 'Brisbane Airport (international)'
    },
    'Perth': {
        avgCommute: 30,
        publicTransportScore: 6,
        jobMarket: 7,
        lifestyle: 'Mining hub, isolated, great beaches, sunny',
        airports: 'Perth Airport (limited international)'
    },
    'Adelaide': {
        avgCommute: 25,
        publicTransportScore: 7,
        jobMarket: 6,
        lifestyle: 'Wine regions, festivals, affordable, relaxed pace',
        airports: 'Adelaide Airport (limited international)'
    },
    'Canberra': {
        avgCommute: 22,
        publicTransportScore: 6,
        jobMarket: 8,
        lifestyle: 'Government jobs, planned city, cold winters',
        airports: 'Canberra Airport (domestic focus)'
    },
    'Darwin': {
        avgCommute: 18,
        publicTransportScore: 4,
        jobMarket: 5,
        lifestyle: 'Tropical, remote, small population, laid-back',
        airports: 'Darwin Airport (limited flights)'
    },
    'Hobart': {
        avgCommute: 20,
        publicTransportScore: 5,
        jobMarket: 5,
        lifestyle: 'Cool climate, nature, small city charm, tourism',
        airports: 'Hobart Airport (mostly domestic)'
    }
};

/**
 * Initialize cost optimizer with current calculation
 */
function initCostOptimizer(currentCalculation) {
    optimizerState.currentScenario = currentCalculation;
    optimizerState.optimizations = calculateOptimizations(currentCalculation);

    // Load saved preferences
    const saved = localStorage.getItem('firb_optimizer_preferences');
    if (saved) {
        optimizerState.userPreferences = JSON.parse(saved);
    }

    renderCostOptimizer();
}

/**
 * Calculate all possible optimizations
 */
function calculateOptimizations(current) {
    const optimizations = {
        propertyType: calculatePropertyTypeOptimization(current),
        stateArbitrage: calculateStateArbitrage(current),
        timing: calculateTimingOptimization(current),
        structure: calculateStructureOptimization(current),
        totalPotentialSavings: 0
    };

    // Calculate total potential savings (best case scenario)
    optimizations.totalPotentialSavings =
        (optimizations.propertyType.savings || 0) +
        (optimizations.stateArbitrage.maxSavings || 0) +
        (optimizations.timing.maxSavings || 0) +
        (optimizations.structure.maxSavings || 0);

    return optimizations;
}

/**
 * 1. PROPERTY TYPE OPTIMIZATION
 * Compare established dwelling vs new apartment
 */
function calculatePropertyTypeOptimization(current) {
    const purchasePrice = current.inputs?.purchasePrice;

    // Validate purchase price
    if (!purchasePrice || isNaN(purchasePrice) || purchasePrice <= 0) {
        console.error('[OPTIMIZER] ERROR: Invalid purchasePrice in calculatePropertyTypeOptimization:', purchasePrice);
        return null;
    }

    console.log('[OPTIMIZER] Calculating property type optimization for price:', purchasePrice);

    const currentType = current.inputs.propertyType;

    // Calculate costs for both property types at same price
    const establishedCosts = calculateCostsForType(purchasePrice, 'established', current.inputs.state);
    const newCosts = calculateCostsForType(purchasePrice, 'new', current.inputs.state);

    const savings = establishedCosts.grandTotal - newCosts.grandTotal;
    const savingsPercent = (savings / establishedCosts.grandTotal) * 100;

    return {
        currentType: currentType,
        currentCost: current.grandTotal,
        establishedCost: establishedCosts.grandTotal,
        newCost: newCosts.grandTotal,
        savings: savings,
        savingsPercent: savingsPercent,
        recommendation: savings > 0 ? 'new' : 'established',
        details: {
            stampDutyDiff: establishedCosts.stampDuty - newCosts.stampDuty,
            surchargeStampDutyDiff: establishedCosts.surchargeStampDuty - newCosts.surchargeStampDuty,
            landTaxDiff: (establishedCosts.landTaxSurcharge || 0) - (newCosts.landTaxSurcharge || 0)
        }
    };
}

/**
 * Calculate FIRB costs for a specific property type
 */
function calculateCostsForType(price, type, state) {
    const tempInputs = {
        propertyType: type,
        purchasePrice: price,
        state: state,
        firstTimeBuyer: false,
        ownsOtherAustralianProperty: false
    };

    return calculateFees(tempInputs);
}

/**
 * 2. STATE ARBITRAGE CALCULATOR
 * Show equivalent properties in different states
 */
function calculateStateArbitrage(current) {
    const currentState = current.inputs.state;
    const currentPrice = current.inputs.purchasePrice;
    const propertyType = current.inputs.propertyType;

    const comparisons = [];

    // Compare with all states
    for (const state of ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']) {
        if (state === currentState) continue;

        const stateCosts = calculateCostsForType(currentPrice, propertyType, state);
        const savings = current.grandTotal - stateCosts.grandTotal;
        const savingsPercent = (savings / current.grandTotal) * 100;

        // Find major city in this state
        const city = Object.keys(cityEquivalents).find(c => cityEquivalents[c].state === state);

        comparisons.push({
            state: state,
            city: city || state,
            totalCost: stateCosts.grandTotal,
            savings: savings,
            savingsPercent: savingsPercent,
            lifestyle: city ? lifestyleFactors[city] : null,
            breakdown: {
                firbFee: stateCosts.firbApplicationFee,
                stampDuty: stateCosts.stampDuty,
                surcharge: stateCosts.surchargeStampDuty,
                landTax: stateCosts.landTaxSurcharge || 0
            }
        });
    }

    // Sort by savings (highest first)
    comparisons.sort((a, b) => b.savings - a.savings);

    return {
        currentState: currentState,
        currentCost: current.grandTotal,
        comparisons: comparisons,
        bestAlternative: comparisons[0],
        maxSavings: comparisons[0].savings,
        top3: comparisons.slice(0, 3)
    };
}

/**
 * 3. TIMING OPTIMIZER
 * Calculate savings from waiting for PR
 */
function calculateTimingOptimization(current) {
    const purchasePrice = current.inputs.purchasePrice;
    const currentCost = current.grandTotal;

    // Calculate cost as permanent resident (no FIRB fees, no surcharges)
    const prCost = calculatePRCosts(current.inputs);
    const totalSavings = currentCost - prCost;
    const savingsPercent = (totalSavings / currentCost) * 100;

    // Generate visa pathway options
    const pathwayOptions = [];

    for (const category in visaPathways) {
        for (const visaCode in visaPathways[category]) {
            const pathway = visaPathways[category][visaCode];
            const monthlySavings = totalSavings / pathway.months;

            pathwayOptions.push({
                category: category,
                visaCode: visaCode,
                description: pathway.description,
                monthsToWait: pathway.months,
                yearsToWait: (pathway.months / 12).toFixed(1),
                totalSavings: totalSavings,
                monthlySavings: monthlySavings,
                worthIt: pathway.months <= 24 && totalSavings > 50000, // Reasonable wait if > $50k savings
                costBenefit: totalSavings / pathway.months // Dollars saved per month of waiting
            });
        }
    }

    // Sort by cost-benefit ratio
    pathwayOptions.sort((a, b) => b.costBenefit - a.costBenefit);

    // Calculate property appreciation during wait
    const appreciationEstimates = [
        { rate: 3, label: 'Conservative (3% p.a.)' },
        { rate: 5, label: 'Moderate (5% p.a.)' },
        { rate: 7, label: 'Optimistic (7% p.a.)' }
    ];

    const opportunityCosts = appreciationEstimates.map(est => {
        const scenarios = pathwayOptions.slice(0, 3).map(pathway => {
            const years = pathway.monthsToWait / 12;
            const futurePrice = purchasePrice * Math.pow(1 + (est.rate / 100), years);
            const priceIncrease = futurePrice - purchasePrice;
            const netPosition = pathway.totalSavings - priceIncrease;

            return {
                pathway: pathway.visaCode,
                monthsToWait: pathway.monthsToWait,
                feesSaved: pathway.totalSavings,
                priceIncrease: priceIncrease,
                netPosition: netPosition,
                stillWorthIt: netPosition > 0
            };
        });

        return {
            growthRate: est.rate,
            label: est.label,
            scenarios: scenarios
        };
    });

    return {
        currentCost: currentCost,
        prCost: prCost,
        totalSavings: totalSavings,
        savingsPercent: savingsPercent,
        pathwayOptions: pathwayOptions,
        top3Pathways: pathwayOptions.slice(0, 3),
        opportunityCosts: opportunityCosts,
        breakdown: {
            firbFeeSavings: current.firbApplicationFee,
            surchargeStampDutySavings: current.surchargeStampDuty,
            landTaxSavings: current.landTaxSurcharge || 0
        }
    };
}

/**
 * Calculate costs for permanent resident (no foreign buyer fees)
 */
function calculatePRCosts(inputs) {
    const stateCode = inputs.state;
    const price = inputs.purchasePrice;
    const propertyType = inputs.propertyType;
    const firstTime = inputs.firstTimeBuyer;

    // Get standard stamp duty (no surcharge)
    const stampDuty = calculateStampDuty(stateCode, price, propertyType, firstTime, false); // false = not foreign

    return {
        firbFee: 0,
        stampDuty: stampDuty,
        surchargeStampDuty: 0,
        landTaxSurcharge: 0,
        grandTotal: stampDuty
    };
}

/**
 * 4. STRUCTURE OPTIMIZATION
 * Joint purchase, trust, company structures
 */
function calculateStructureOptimization(current) {
    const purchasePrice = current.inputs.purchasePrice;
    const currentCost = current.grandTotal;

    const options = [];

    // Option 1: Joint purchase with Australian citizen/PR (50/50)
    const jointPurchase = {
        structure: 'Joint Purchase (50/50 with Australian)',
        description: 'Purchase 50% share jointly with an Australian citizen or permanent resident',
        howItWorks: 'Only your 50% share is subject to FIRB application and foreign buyer surcharges',
        calculations: {
            yourShare: purchasePrice * 0.5,
            partnerShare: purchasePrice * 0.5,
            firbFee: current.firbApplicationFee, // Still need FIRB approval
            yourStampDuty: calculateStampDuty(current.inputs.state, purchasePrice * 0.5, current.inputs.propertyType, false, true),
            partnerStampDuty: calculateStampDuty(current.inputs.state, purchasePrice * 0.5, current.inputs.propertyType, false, false),
            yourSurcharge: current.surchargeStampDuty * 0.5,
            totalCost: 0
        },
        savings: 0,
        risks: [
            'Co-ownership disputes',
            'Relationship breakdown implications',
            'Exit strategy complexity',
            'Financing may be more difficult'
        ],
        requirements: [
            'Australian citizen or PR co-buyer',
            'Both parties must qualify for financing',
            'Legal agreement required',
            'FIRB approval still needed for your share'
        ],
        legalAdviceRequired: true
    };

    jointPurchase.calculations.totalCost =
        jointPurchase.calculations.firbFee +
        jointPurchase.calculations.yourStampDuty +
        jointPurchase.calculations.partnerStampDuty +
        jointPurchase.calculations.yourSurcharge;

    jointPurchase.savings = currentCost - jointPurchase.calculations.totalCost;
    jointPurchase.savingsPercent = (jointPurchase.savings / currentCost) * 100;

    options.push(jointPurchase);

    // Option 2: Company structure
    const companyStructure = {
        structure: 'Australian Company (with Australian directors)',
        description: 'Purchase through a company with majority Australian director control',
        howItWorks: 'If company has majority Australian directors/shareholders, may reduce foreign buyer surcharges',
        calculations: {
            setupCosts: 5000, // Company setup, ASIC fees
            ongoingCosts: 3000, // Annual accounting, compliance
            stampDuty: current.stampDuty,
            potentialSurchargeReduction: current.surchargeStampDuty * 0.5, // Estimated 50% reduction
            totalFirstYear: 0
        },
        savings: 0,
        risks: [
            'Complex tax implications',
            'Ongoing compliance costs',
            'Capital gains tax on sale',
            'May not eliminate all foreign buyer duties',
            'FIRB may still classify as foreign'
        ],
        requirements: [
            'Majority Australian directors required',
            'Legal and tax advice essential',
            'Annual financial statements',
            'ASIC compliance',
            'May still need FIRB approval'
        ],
        legalAdviceRequired: true
    };

    companyStructure.calculations.totalFirstYear =
        current.firbApplicationFee +
        companyStructure.calculations.setupCosts +
        companyStructure.calculations.stampDuty +
        (current.surchargeStampDuty - companyStructure.calculations.potentialSurchargeReduction);

    companyStructure.savings = currentCost - companyStructure.calculations.totalFirstYear;
    companyStructure.savingsPercent = (companyStructure.savings / currentCost) * 100;

    options.push(companyStructure);

    // Option 3: Trust structure
    const trustStructure = {
        structure: 'Discretionary Trust',
        description: 'Purchase through a discretionary family trust',
        howItWorks: 'Trust may provide tax benefits and asset protection, but still subject to foreign buyer rules if foreign person is beneficiary',
        calculations: {
            setupCosts: 3000, // Trust deed, legal fees
            ongoingCosts: 2000, // Annual tax returns
            stampDuty: current.stampDuty,
            surcharge: current.surchargeStampDuty, // Usually no reduction
            totalFirstYear: 0
        },
        savings: 0,
        benefits: [
            'Asset protection',
            'Tax planning flexibility',
            'Estate planning benefits',
            'Income distribution options'
        ],
        risks: [
            'Still subject to foreign buyer surcharges',
            'Complex tax implications',
            'Ongoing compliance costs',
            'May complicate financing'
        ],
        requirements: [
            'Professional legal setup required',
            'Annual tax returns',
            'FIRB approval still needed',
            'Trustee responsibilities'
        ],
        legalAdviceRequired: true
    };

    trustStructure.calculations.totalFirstYear =
        current.firbApplicationFee +
        trustStructure.calculations.setupCosts +
        trustStructure.calculations.stampDuty +
        trustStructure.calculations.surcharge;

    trustStructure.savings = currentCost - trustStructure.calculations.totalFirstYear;
    trustStructure.savingsPercent = (trustStructure.savings / currentCost) * 100;

    options.push(trustStructure);

    // Sort by savings
    options.sort((a, b) => b.savings - a.savings);

    return {
        currentCost: currentCost,
        options: options,
        bestOption: options[0],
        maxSavings: options[0].savings,
        disclaimer: 'These are estimates only. Structure optimization has complex legal and tax implications. You MUST seek professional legal and tax advice before proceeding with any structure.'
    };
}

/**
 * Update optimizer preference
 */
function updateOptimizerPreference(field, value) {
    optimizerState.userPreferences[field] = value;
    localStorage.setItem('firb_optimizer_preferences', JSON.stringify(optimizerState.userPreferences));
    renderCostOptimizer();
}

/**
 * Render cost optimizer tool
 */
function renderCostOptimizer() {
    const container = document.getElementById('optimizer-container');
    if (!container) return;

    const opts = optimizerState.optimizations;
    if (!opts) return;

    container.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-6 mt-8">
            <!-- Header -->
            <div class="border-b pb-4 mb-6">
                <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span class="text-3xl">💡</span>
                    Cost Optimization Strategies
                </h2>
                <p class="text-gray-600 mt-2">
                    Potential ways to reduce your FIRB and property purchase costs
                </p>
            </div>

            <!-- Total Potential Savings Card -->
            ${renderTotalSavingsCard(opts)}

            <!-- Optimization Categories -->
            <div class="space-y-6 mt-6">
                ${renderPropertyTypeOptimization(opts.propertyType)}
                ${renderStateArbitrage(opts.stateArbitrage)}
                ${renderTimingOptimization(opts.timing)}
                ${renderStructureOptimization(opts.structure)}
            </div>

            <!-- Action Plan Generator -->
            ${renderActionPlan(opts)}

            <!-- Disclaimers -->
            ${renderOptimizationDisclaimers()}
        </div>
    `;
}

/**
 * Render total potential savings card
 */
function renderTotalSavingsCard(opts) {
    const maxSavings = opts.totalPotentialSavings;
    const current = optimizerState.currentScenario.grandTotal;
    const savingsPercent = (maxSavings / current) * 100;

    return `
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
            <div class="flex items-center justify-between">
                <div>
                    <div class="text-sm font-medium text-green-800 mb-1">Maximum Potential Savings</div>
                    <div class="text-4xl font-bold text-green-900">${formatCurrency(maxSavings)}</div>
                    <div class="text-sm text-green-700 mt-1">
                        ${savingsPercent.toFixed(1)}% of total costs
                    </div>
                </div>
                <div class="text-6xl">🎯</div>
            </div>
            <div class="mt-4 text-sm text-green-800">
                <strong>Note:</strong> This is the theoretical maximum if you implemented <em>all</em> strategies below.
                Individual circumstances vary.
            </div>
        </div>
    `;
}

/**
 * Render property type optimization
 */
function renderPropertyTypeOptimization(opt) {
    const isCurrentlyNew = opt.currentType === 'new';
    const savings = opt.savings;

    if (isCurrentlyNew || savings <= 0) {
        return `
            <div class="border rounded-lg p-6 bg-gray-50">
                <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <span class="text-2xl">🏘️</span>
                    1. Property Type Optimization
                </h3>
                <div class="bg-blue-50 border border-blue-200 rounded p-4">
                    <p class="text-blue-900">
                        ✅ You're already choosing the most cost-effective property type (new apartment/dwelling).
                        New properties typically have lower stamp duty surcharges.
                    </p>
                </div>
            </div>
        `;
    }

    return `
        <div class="border rounded-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <span class="text-2xl">🏘️</span>
                1. Property Type Optimization
            </h3>

            <div class="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-lg font-bold text-green-900">
                            Switch to New Apartment
                        </div>
                        <div class="text-3xl font-bold text-green-900 mt-1">
                            Save ${formatCurrency(savings)}
                        </div>
                        <div class="text-sm text-green-700">
                            ${opt.savingsPercent.toFixed(1)}% reduction in total costs
                        </div>
                    </div>
                    <div class="text-5xl">💰</div>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
                <div class="border rounded p-4">
                    <div class="text-sm font-medium text-gray-600 mb-2">Current: Established Dwelling</div>
                    <div class="text-2xl font-bold text-gray-900">${formatCurrency(opt.establishedCost)}</div>
                    <div class="mt-3 space-y-1 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Stamp Duty:</span>
                            <span class="font-medium">${formatCurrency(optimizerState.currentScenario.stampDuty)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Surcharge:</span>
                            <span class="font-medium">${formatCurrency(optimizerState.currentScenario.surchargeStampDuty)}</span>
                        </div>
                    </div>
                </div>

                <div class="border-2 border-green-300 rounded p-4 bg-green-50">
                    <div class="text-sm font-medium text-green-800 mb-2">Alternative: New Apartment</div>
                    <div class="text-2xl font-bold text-green-900">${formatCurrency(opt.newCost)}</div>
                    <div class="mt-3 space-y-1 text-sm">
                        <div class="flex justify-between">
                            <span class="text-green-700">Stamp Duty:</span>
                            <span class="font-medium text-green-900">${formatCurrency(opt.establishedCost - savings - opt.details.surchargeStampDutyDiff)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-green-700">Surcharge:</span>
                            <span class="font-medium text-green-900">${formatCurrency(optimizerState.currentScenario.surchargeStampDuty - opt.details.surchargeStampDutyDiff)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-4 text-sm text-gray-700">
                <strong>Why new is cheaper:</strong> Many states offer stamp duty concessions for new/off-the-plan properties,
                and some reduce foreign buyer surcharges on new construction to encourage development.
            </div>
        </div>
    `;
}

/**
 * Render state arbitrage comparison
 */
function renderStateArbitrage(arb) {
    const top3 = arb.top3.filter(c => c.savings > 0);

    if (top3.length === 0) {
        return `
            <div class="border rounded-lg p-6 bg-gray-50">
                <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <span class="text-2xl">🗺️</span>
                    2. Location Arbitrage
                </h3>
                <div class="bg-blue-50 border border-blue-200 rounded p-4">
                    <p class="text-blue-900">
                        ✅ You're already in the most cost-effective state for this property type and price.
                    </p>
                </div>
            </div>
        `;
    }

    return `
        <div class="border rounded-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <span class="text-2xl">🗺️</span>
                2. Location Arbitrage
            </h3>

            <div class="mb-4">
                <p class="text-gray-700">
                    The same property type at the same price would cost less in these states:
                </p>
            </div>

            <div class="space-y-4">
                ${top3.map((comp, idx) => renderStateComparison(comp, idx)).join('')}
            </div>

            <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <div class="font-medium text-yellow-900 mb-2">⚖️ Consider the trade-offs:</div>
                <ul class="text-sm text-yellow-800 space-y-1 ml-4">
                    <li>• Job opportunities and career prospects</li>
                    <li>• Distance from family/friends and international airports</li>
                    <li>• Lifestyle and climate preferences</li>
                    <li>• Property value growth potential</li>
                    <li>• Rental demand and yields</li>
                </ul>
            </div>
        </div>
    `;
}

/**
 * Render individual state comparison
 */
function renderStateComparison(comp, index) {
    const medal = ['🥇', '🥈', '🥉'][index];
    const lifestyle = comp.lifestyle;

    return `
        <div class="border rounded-lg p-4 ${index === 0 ? 'border-green-300 bg-green-50' : 'bg-gray-50'}">
            <div class="flex items-start justify-between mb-3">
                <div>
                    <div class="text-lg font-bold text-gray-900">
                        ${medal} ${comp.city} (${comp.state})
                    </div>
                    <div class="text-2xl font-bold ${index === 0 ? 'text-green-900' : 'text-gray-900'} mt-1">
                        Save ${formatCurrency(comp.savings)}
                    </div>
                    <div class="text-sm text-gray-600">
                        ${comp.savingsPercent.toFixed(1)}% cheaper than ${arb.currentState}
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-sm text-gray-600">Total cost</div>
                    <div class="text-lg font-bold text-gray-900">${formatCurrency(comp.totalCost)}</div>
                </div>
            </div>

            ${lifestyle ? `
                <div class="mt-3 pt-3 border-t border-gray-200">
                    <div class="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <div class="text-gray-600">Avg. Commute</div>
                            <div class="font-medium">${lifestyle.avgCommute} mins</div>
                        </div>
                        <div>
                            <div class="text-gray-600">Job Market</div>
                            <div class="font-medium">${lifestyle.jobMarket}/10</div>
                        </div>
                        <div class="col-span-2">
                            <div class="text-gray-600">Lifestyle</div>
                            <div class="font-medium">${lifestyle.lifestyle}</div>
                        </div>
                        <div class="col-span-2">
                            <div class="text-gray-600">Airport Access</div>
                            <div class="font-medium text-xs">${lifestyle.airports}</div>
                        </div>
                    </div>
                </div>
            ` : ''}

            <div class="mt-3 pt-3 border-t border-gray-200">
                <details class="text-sm">
                    <summary class="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                        Cost Breakdown
                    </summary>
                    <div class="mt-2 space-y-1 ml-4">
                        <div class="flex justify-between">
                            <span class="text-gray-600">FIRB Fee:</span>
                            <span>${formatCurrency(comp.breakdown.firbFee)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Stamp Duty:</span>
                            <span>${formatCurrency(comp.breakdown.stampDuty)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Surcharge:</span>
                            <span>${formatCurrency(comp.breakdown.surcharge)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Land Tax:</span>
                            <span>${formatCurrency(comp.breakdown.landTax)}</span>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    `;
}

/**
 * Render timing optimization
 */
function renderTimingOptimization(timing) {
    const top3 = timing.top3Pathways;

    return `
        <div class="border rounded-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <span class="text-2xl">⏰</span>
                3. Timing Optimization
            </h3>

            <div class="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-lg font-bold text-purple-900">
                            Wait for Permanent Residency
                        </div>
                        <div class="text-3xl font-bold text-purple-900 mt-1">
                            Save ${formatCurrency(timing.totalSavings)}
                        </div>
                        <div class="text-sm text-purple-700">
                            ${timing.savingsPercent.toFixed(1)}% of total costs eliminated
                        </div>
                    </div>
                    <div class="text-5xl">⏳</div>
                </div>
            </div>

            <div class="mb-4">
                <p class="text-gray-700 mb-2">
                    <strong>What you save as a PR:</strong>
                </p>
                <div class="grid grid-cols-3 gap-3 text-sm">
                    <div class="bg-gray-50 rounded p-3">
                        <div class="text-gray-600">FIRB Fee</div>
                        <div class="font-bold text-gray-900">${formatCurrency(timing.breakdown.firbFeeSavings)}</div>
                    </div>
                    <div class="bg-gray-50 rounded p-3">
                        <div class="text-gray-600">Surcharge</div>
                        <div class="font-bold text-gray-900">${formatCurrency(timing.breakdown.surchargeStampDutySavings)}</div>
                    </div>
                    <div class="bg-gray-50 rounded p-3">
                        <div class="text-gray-600">Land Tax</div>
                        <div class="font-bold text-gray-900">${formatCurrency(timing.breakdown.landTaxSavings)}</div>
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <h4 class="font-bold text-gray-900 mb-3">Potential PR Pathways:</h4>
                <div class="space-y-3">
                    ${top3.map(pathway => renderPathwayOption(pathway)).join('')}
                </div>
            </div>

            <!-- Opportunity Cost Analysis -->
            ${renderOpportunityCostAnalysis(timing.opportunityCosts)}
        </div>
    `;
}

/**
 * Render individual pathway option
 */
function renderPathwayOption(pathway) {
    const isWorthIt = pathway.worthIt;

    return `
        <div class="border rounded p-4 ${isWorthIt ? 'border-green-300 bg-green-50' : 'bg-gray-50'}">
            <div class="flex items-start justify-between mb-2">
                <div>
                    <div class="font-bold text-gray-900">${pathway.visaCode}</div>
                    <div class="text-sm text-gray-700">${pathway.description}</div>
                </div>
                ${isWorthIt ? '<div class="text-2xl">✅</div>' : ''}
            </div>

            <div class="grid grid-cols-3 gap-3 mt-3 text-sm">
                <div>
                    <div class="text-gray-600">Time to PR</div>
                    <div class="font-bold">${pathway.yearsToWait} years</div>
                </div>
                <div>
                    <div class="text-gray-600">Total Saved</div>
                    <div class="font-bold">${formatCurrency(pathway.totalSavings)}</div>
                </div>
                <div>
                    <div class="text-gray-600">Per Month</div>
                    <div class="font-bold">${formatCurrency(pathway.monthlySavings)}</div>
                </div>
            </div>

            ${isWorthIt ? `
                <div class="mt-2 text-sm text-green-800">
                    💡 <strong>Good option:</strong> Waiting ${pathway.yearsToWait} years to save ${formatCurrency(pathway.totalSavings)} may be worthwhile.
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Render opportunity cost analysis
 */
function renderOpportunityCostAnalysis(opportunityCosts) {
    return `
        <div class="mt-4 p-4 bg-orange-50 border border-orange-200 rounded">
            <h4 class="font-bold text-orange-900 mb-3">⚠️ Opportunity Cost: Property Price Growth</h4>
            <p class="text-sm text-orange-800 mb-3">
                While waiting for PR saves on fees, property prices may increase. Here's the net position under different growth scenarios:
            </p>

            <div class="space-y-4">
                ${opportunityCosts.map(opp => `
                    <details class="text-sm">
                        <summary class="cursor-pointer font-medium text-orange-900 hover:text-orange-700">
                            ${opp.label}
                        </summary>
                        <div class="mt-3 space-y-2">
                            ${opp.scenarios.map(scenario => `
                                <div class="bg-white rounded p-3 border ${scenario.stillWorthIt ? 'border-green-300' : 'border-red-300'}">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="font-medium">${scenario.pathway} (${scenario.monthsToWait} months)</span>
                                        <span class="text-lg">${scenario.stillWorthIt ? '✅' : '❌'}</span>
                                    </div>
                                    <div class="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <div class="text-gray-600">Fees Saved</div>
                                            <div class="font-medium text-green-700">+${formatCurrency(scenario.feesSaved)}</div>
                                        </div>
                                        <div>
                                            <div class="text-gray-600">Price Increase</div>
                                            <div class="font-medium text-red-700">-${formatCurrency(scenario.priceIncrease)}</div>
                                        </div>
                                        <div class="col-span-2">
                                            <div class="text-gray-600">Net Position</div>
                                            <div class="font-bold ${scenario.netPosition > 0 ? 'text-green-900' : 'text-red-900'}">
                                                ${scenario.netPosition > 0 ? '+' : ''}${formatCurrency(scenario.netPosition)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </details>
                `).join('')}
            </div>

            <div class="mt-3 text-xs text-orange-800">
                <strong>Interpretation:</strong> Green ✅ means waiting still puts you ahead financially. Red ❌ means property appreciation outweighs fee savings.
            </div>
        </div>
    `;
}

/**
 * Render structure optimization
 */
function renderStructureOptimization(structure) {
    const options = structure.options;

    return `
        <div class="border rounded-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <span class="text-2xl">🏢</span>
                4. Purchase Structure Optimization
            </h3>

            <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                <div class="flex items-start gap-2">
                    <span class="text-2xl">⚖️</span>
                    <div class="text-sm text-red-900">
                        <strong>LEGAL ADVICE REQUIRED:</strong> These structures have complex legal, tax, and regulatory implications.
                        You MUST consult a qualified lawyer and tax accountant before proceeding.
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                ${options.map((opt, idx) => renderStructureOption(opt, idx)).join('')}
            </div>
        </div>
    `;
}

/**
 * Render individual structure option
 */
function renderStructureOption(opt, index) {
    const isBest = index === 0 && opt.savings > 0;

    return `
        <details class="border rounded-lg ${isBest ? 'border-green-300 bg-green-50' : 'bg-gray-50'}" ${isBest ? 'open' : ''}>
            <summary class="cursor-pointer p-4 hover:bg-gray-100">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-bold text-gray-900">${opt.structure}</div>
                        <div class="text-sm text-gray-600 mt-1">${opt.description}</div>
                    </div>
                    <div class="text-right">
                        ${opt.savings > 0 ? `
                            <div class="text-lg font-bold ${isBest ? 'text-green-900' : 'text-gray-900'}">
                                Save ${formatCurrency(opt.savings)}
                            </div>
                            <div class="text-sm text-gray-600">
                                ${opt.savingsPercent.toFixed(1)}% reduction
                            </div>
                        ` : `
                            <div class="text-lg font-bold text-gray-900">
                                ${formatCurrency(Math.abs(opt.savings))} more
                            </div>
                            <div class="text-sm text-gray-600">
                                May have other benefits
                            </div>
                        `}
                    </div>
                </div>
            </summary>

            <div class="p-4 border-t">
                <div class="mb-4">
                    <h5 class="font-medium text-gray-900 mb-2">How it works:</h5>
                    <p class="text-sm text-gray-700">${opt.howItWorks}</p>
                </div>

                ${opt.calculations ? `
                    <div class="mb-4">
                        <h5 class="font-medium text-gray-900 mb-2">Cost breakdown:</h5>
                        <div class="bg-white rounded border p-3 space-y-2 text-sm">
                            ${Object.entries(opt.calculations).map(([key, value]) => {
                                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                return `
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">${label}:</span>
                                        <span class="font-medium">${typeof value === 'number' ? formatCurrency(value) : value}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}

                ${opt.benefits ? `
                    <div class="mb-4">
                        <h5 class="font-medium text-gray-900 mb-2">✅ Benefits:</h5>
                        <ul class="text-sm text-gray-700 space-y-1 ml-4">
                            ${opt.benefits.map(b => `<li>• ${b}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${opt.risks ? `
                    <div class="mb-4">
                        <h5 class="font-medium text-gray-900 mb-2">⚠️ Risks & Considerations:</h5>
                        <ul class="text-sm text-gray-700 space-y-1 ml-4">
                            ${opt.risks.map(r => `<li>• ${r}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${opt.requirements ? `
                    <div class="mb-4">
                        <h5 class="font-medium text-gray-900 mb-2">📋 Requirements:</h5>
                        <ul class="text-sm text-gray-700 space-y-1 ml-4">
                            ${opt.requirements.map(r => `<li>• ${r}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        </details>
    `;
}

/**
 * Render personalized action plan
 */
function renderActionPlan(opts) {
    // Build recommended actions based on savings
    const actions = [];

    if (opts.propertyType.savings > 10000) {
        actions.push({
            priority: 'high',
            action: 'Consider switching to a new apartment/dwelling',
            savings: opts.propertyType.savings,
            complexity: 'Low',
            timeframe: 'Immediate'
        });
    }

    if (opts.stateArbitrage.maxSavings > 20000) {
        const best = opts.stateArbitrage.bestAlternative;
        actions.push({
            priority: 'medium',
            action: `Explore properties in ${best.city} (${best.state})`,
            savings: best.savings,
            complexity: 'Medium',
            timeframe: 'Consider for next purchase'
        });
    }

    if (opts.timing.top3Pathways[0].worthIt) {
        const pathway = opts.timing.top3Pathways[0];
        actions.push({
            priority: 'medium',
            action: `Pursue ${pathway.visaCode} pathway to PR`,
            savings: pathway.totalSavings,
            complexity: 'High',
            timeframe: `${pathway.yearsToWait} years`
        });
    }

    if (opts.structure.maxSavings > 15000) {
        actions.push({
            priority: 'low',
            action: `Consult lawyer about ${opts.structure.bestOption.structure}`,
            savings: opts.structure.maxSavings,
            complexity: 'High',
            timeframe: 'Before contract signing'
        });
    }

    if (actions.length === 0) {
        return `
            <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-center gap-2">
                    <span class="text-2xl">👍</span>
                    <div>
                        <h4 class="font-bold text-blue-900">You're already optimized!</h4>
                        <p class="text-sm text-blue-800 mt-1">
                            Based on your current inputs, there are no significant cost-saving opportunities available.
                            You're making cost-effective choices.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    // Sort by savings (highest first)
    actions.sort((a, b) => b.savings - a.savings);

    return `
        <div class="mt-8 border-t pt-6">
            <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <span class="text-2xl">📋</span>
                Your Personalized Action Plan
            </h3>

            <div class="space-y-3">
                ${actions.map((action, idx) => `
                    <div class="flex items-start gap-4 p-4 border rounded-lg ${
                        action.priority === 'high' ? 'border-green-300 bg-green-50' :
                        action.priority === 'medium' ? 'border-yellow-300 bg-yellow-50' :
                        'border-gray-300 bg-gray-50'
                    }">
                        <div class="text-2xl font-bold ${
                            action.priority === 'high' ? 'text-green-900' :
                            action.priority === 'medium' ? 'text-yellow-900' :
                            'text-gray-900'
                        }">${idx + 1}</div>
                        <div class="flex-1">
                            <div class="font-bold text-gray-900">${action.action}</div>
                            <div class="text-sm text-gray-600 mt-1">
                                Potential savings: <span class="font-bold">${formatCurrency(action.savings)}</span> |
                                Complexity: ${action.complexity} |
                                Timeframe: ${action.timeframe}
                            </div>
                        </div>
                        <div class="px-3 py-1 rounded text-xs font-medium ${
                            action.priority === 'high' ? 'bg-green-200 text-green-900' :
                            action.priority === 'medium' ? 'bg-yellow-200 text-yellow-900' :
                            'bg-gray-200 text-gray-900'
                        }">
                            ${action.priority.toUpperCase()}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Render disclaimers
 */
function renderOptimizationDisclaimers() {
    return `
        <div class="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
            <h4 class="font-bold text-red-900 text-lg mb-3">⚠️ Important Disclaimers</h4>
            <div class="space-y-2 text-sm text-red-900">
                <p>
                    <strong>1. Not Financial or Legal Advice:</strong> These suggestions are for informational purposes only.
                    They do not constitute financial, legal, or tax advice.
                </p>
                <p>
                    <strong>2. Individual Circumstances Vary:</strong> Your personal situation, visa status, timeline, and goals
                    may make certain strategies unsuitable.
                </p>
                <p>
                    <strong>3. Regulations Change:</strong> FIRB rules, stamp duty rates, and visa requirements change frequently.
                    Always verify current regulations.
                </p>
                <p>
                    <strong>4. Professional Advice Essential:</strong> Before implementing any optimization strategy, consult:
                </p>
                <ul class="ml-6 space-y-1">
                    <li>• Licensed Australian immigration lawyer (for visa pathways)</li>
                    <li>• Qualified property lawyer (for purchase structures)</li>
                    <li>• Registered tax accountant (for tax implications)</li>
                    <li>• Licensed financial advisor (for investment decisions)</li>
                </ul>
                <p class="mt-3">
                    <strong>5. Opportunity Costs:</strong> Saving on fees but missing out on property growth, rental income,
                    or life opportunities may not be optimal for your situation.
                </p>
                <p>
                    <strong>6. No Guarantees:</strong> Property values, rental yields, visa processing times, and policy changes
                    are unpredictable. Projections are estimates only.
                </p>
            </div>
        </div>
    `;
}

// Export functions for use in main app
if (typeof window !== 'undefined') {
    window.initCostOptimizer = initCostOptimizer;
    window.updateOptimizerPreference = updateOptimizerPreference;
}
