/**
 * Smart Eligibility Wizard for FIRB Calculator
 * @file eligibilityWizard.js
 *
 * Multi-step wizard to determine FIRB eligibility BEFORE the full calculator
 * Provides clear yes/no answers with explanations and recommendations
 */

/**
 * Wizard state
 */
const wizardState = {
    step: 1,
    totalSteps: 4,
    answers: {
        citizenshipStatus: null,
        residencyStatus: null,
        visaType: null,
        propertyType: null,
        purchasePrice: null,
        state: null
    },
    result: null
};

/**
 * Visa types and their eligibility
 */
const VISA_TYPES = {
    'student': {
        label: 'Student Visa (subclass 500)',
        canBuyEstablished: true,
        canBuyNew: true,
        canBuyVacant: true,
        condition: 'Must be your principal place of residence'
    },
    'skilled': {
        label: 'Skilled Work Visa (subclass 482, 485, 186, 189)',
        canBuyEstablished: true,
        canBuyNew: true,
        canBuyVacant: true,
        condition: 'Must be your principal place of residence'
    },
    'partner': {
        label: 'Partner Visa (subclass 309, 820)',
        canBuyEstablished: true,
        canBuyNew: true,
        canBuyVacant: true,
        condition: 'Must be your principal place of residence'
    },
    'bridging': {
        label: 'Bridging Visa',
        canBuyEstablished: false,
        canBuyNew: true,
        canBuyVacant: false,
        condition: 'Only new dwellings allowed'
    },
    'visitor': {
        label: 'Visitor/Tourist Visa',
        canBuyEstablished: false,
        canBuyNew: true,
        canBuyVacant: false,
        condition: 'Only new dwellings allowed'
    },
    'other': {
        label: 'Other Temporary Visa',
        canBuyEstablished: true,
        canBuyNew: true,
        canBuyVacant: true,
        condition: 'Check specific visa conditions'
    }
};

/**
 * Property types and their characteristics
 */
const PROPERTY_TYPES_WIZARD = {
    'new': {
        label: 'New Dwelling/Apartment',
        description: 'Never been occupied, includes off-the-plan',
        generallyAllowed: true,
        firbRequired: true
    },
    'offThePlan': {
        label: 'Off-the-Plan',
        description: 'Property not yet built',
        generallyAllowed: true,
        firbRequired: true
    },
    'established': {
        label: 'Established Dwelling',
        description: 'Previously occupied residential property',
        generallyAllowed: false,
        firbRequired: true,
        requiresTemporaryResidency: true
    },
    'vacant': {
        label: 'Vacant Land',
        description: 'Undeveloped land',
        generallyAllowed: true,
        firbRequired: true,
        requiresDevelopment: true
    },
    'commercial': {
        label: 'Commercial Property',
        description: 'Office, retail, industrial',
        generallyAllowed: true,
        firbRequired: true,
        differentRules: true
    }
};

/**
 * Required documents by scenario
 */
const REQUIRED_DOCUMENTS = {
    temporary_resident: [
        'Valid Australian visa',
        'Passport',
        'Proof of temporary residency',
        'Evidence property will be principal residence',
        'FIRB application form',
        'Proof of identity',
        'Contract of sale (after FIRB approval)'
    ],
    foreign_national: [
        'Passport',
        'FIRB application form',
        'Proof of identity',
        'Proof of funds',
        'Contract of sale (after FIRB approval)',
        'Developer\'s compliance certificate (for new dwellings)',
        'Development plans (for vacant land)'
    ],
    permanent_resident: [
        'Proof of permanent residency',
        'Passport or driver\'s license',
        'Contract of sale',
        'Proof of funds'
    ]
};

/**
 * Start the eligibility wizard
 */
function startEligibilityWizard() {
    wizardState.step = 1;
    wizardState.answers = {
        citizenshipStatus: null,
        residencyStatus: null,
        visaType: null,
        propertyType: null,
        purchasePrice: null,
        state: null
    };
    wizardState.result = null;

    state.currentStep = 'eligibilityWizard';
    render();
}

/**
 * Render eligibility wizard
 */
function renderEligibilityWizard() {
    const step = wizardState.step;

    return `
        <section class="py-20 bg-gradient-to-br from-blue-50 to-white min-h-screen">
            <div class="max-w-4xl mx-auto px-4">
                <!-- Progress bar -->
                <div class="mb-8">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Step ${step} of ${wizardState.totalSteps}</span>
                        <span class="text-sm text-gray-500">${Math.round((step / wizardState.totalSteps) * 100)}% Complete</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${(step / wizardState.totalSteps) * 100}%"></div>
                    </div>
                </div>

                <!-- Wizard content -->
                <div class="bg-white rounded-lg shadow-lg p-8">
                    ${renderWizardStep(step)}
                </div>

                <!-- Navigation -->
                <div class="mt-6 flex justify-between">
                    ${step > 1 ? `
                        <button onclick="previousWizardStep()"
                            class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center space-x-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                            <span>Back</span>
                        </button>
                    ` : `
                        <button onclick="goToStep('home')"
                            class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                            Cancel
                        </button>
                    `}

                    <div class="text-sm text-gray-500 self-center">
                        Questions answered help us give you accurate advice
                    </div>
                </div>
            </div>
        </section>
    `;
}

/**
 * Render specific wizard step
 */
function renderWizardStep(step) {
    switch(step) {
        case 1:
            return renderStep1_CitizenshipStatus();
        case 2:
            return renderStep2_PropertyType();
        case 3:
            return renderStep3_PurchasePrice();
        case 4:
            return renderStep4_State();
        default:
            return '';
    }
}

/**
 * Step 1: Citizenship Status
 */
function renderStep1_CitizenshipStatus() {
    return `
        <h2 class="text-3xl font-bold mb-4">What is your citizenship status?</h2>
        <p class="text-gray-600 mb-8">This determines if you need FIRB approval and what you can buy</p>

        <div class="space-y-4">
            <label class="flex items-start p-6 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition ${wizardState.answers.citizenshipStatus === 'australian' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                <input type="radio" name="citizenship" value="australian"
                    ${wizardState.answers.citizenshipStatus === 'australian' ? 'checked' : ''}
                    onchange="handleCitizenshipChange('australian')"
                    class="mt-1 w-5 h-5 text-blue-600">
                <div class="ml-4 flex-1">
                    <div class="font-semibold text-lg">Australian Citizen</div>
                    <div class="text-sm text-gray-600 mt-1">Born in Australia or naturalized citizen</div>
                    <div class="mt-2 text-sm text-green-600 font-medium">✓ No FIRB approval needed</div>
                </div>
            </label>

            <label class="flex items-start p-6 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition ${wizardState.answers.citizenshipStatus === 'permanent' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                <input type="radio" name="citizenship" value="permanent"
                    ${wizardState.answers.citizenshipStatus === 'permanent' ? 'checked' : ''}
                    onchange="handleCitizenshipChange('permanent')"
                    class="mt-1 w-5 h-5 text-blue-600">
                <div class="ml-4 flex-1">
                    <div class="font-semibold text-lg">Permanent Resident</div>
                    <div class="text-sm text-gray-600 mt-1">Holds PR visa (subclass 186, 189, etc.)</div>
                    <div class="mt-2 text-sm text-green-600 font-medium">✓ Usually no FIRB approval needed (if ordinarily resident)</div>
                </div>
            </label>

            <label class="flex items-start p-6 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition ${wizardState.answers.citizenshipStatus === 'temporary' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                <input type="radio" name="citizenship" value="temporary"
                    ${wizardState.answers.citizenshipStatus === 'temporary' ? 'checked' : ''}
                    onchange="handleCitizenshipChange('temporary')"
                    class="mt-1 w-5 h-5 text-blue-600">
                <div class="ml-4 flex-1">
                    <div class="font-semibold text-lg">Temporary Resident</div>
                    <div class="text-sm text-gray-600 mt-1">Student, skilled worker, partner visa, etc.</div>
                    <div class="mt-2 text-sm text-orange-600 font-medium">⚠ FIRB approval required</div>
                </div>
            </label>

            <label class="flex items-start p-6 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition ${wizardState.answers.citizenshipStatus === 'foreign' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                <input type="radio" name="citizenship" value="foreign"
                    ${wizardState.answers.citizenshipStatus === 'foreign' ? 'checked' : ''}
                    onchange="handleCitizenshipChange('foreign')"
                    class="mt-1 w-5 h-5 text-blue-600">
                <div class="ml-4 flex-1">
                    <div class="font-semibold text-lg">Foreign National</div>
                    <div class="text-sm text-gray-600 mt-1">Not an Australian resident</div>
                    <div class="mt-2 text-sm text-orange-600 font-medium">⚠ FIRB approval required</div>
                </div>
            </label>
        </div>

        ${wizardState.answers.citizenshipStatus === 'temporary' ? renderVisaTypeSelection() : ''}
    `;
}

/**
 * Render visa type selection (for temporary residents)
 */
function renderVisaTypeSelection() {
    return `
        <div class="mt-6 p-6 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-lg mb-4">What type of visa do you hold?</h3>
            <select onchange="handleVisaTypeChange(this.value)"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select your visa type...</option>
                ${Object.entries(VISA_TYPES).map(([key, visa]) => `
                    <option value="${key}" ${wizardState.answers.visaType === key ? 'selected' : ''}>
                        ${visa.label}
                    </option>
                `).join('')}
            </select>
        </div>
    `;
}

/**
 * Step 2: Property Type
 */
function renderStep2_PropertyType() {
    return `
        <h2 class="text-3xl font-bold mb-4">What type of property are you looking to buy?</h2>
        <p class="text-gray-600 mb-8">Different property types have different eligibility rules</p>

        <div class="space-y-4">
            ${Object.entries(PROPERTY_TYPES_WIZARD).map(([key, prop]) => {
                const isEligible = checkPropertyEligibility(key);
                return `
                    <label class="flex items-start p-6 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition ${wizardState.answers.propertyType === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                        <input type="radio" name="propertyType" value="${key}"
                            ${wizardState.answers.propertyType === key ? 'checked' : ''}
                            onchange="handlePropertyTypeChange('${key}')"
                            class="mt-1 w-5 h-5 text-blue-600">
                        <div class="ml-4 flex-1">
                            <div class="font-semibold text-lg">${prop.label}</div>
                            <div class="text-sm text-gray-600 mt-1">${prop.description}</div>
                            ${isEligible.eligible
                                ? `<div class="mt-2 text-sm text-green-600 font-medium">✓ ${isEligible.message}</div>`
                                : `<div class="mt-2 text-sm text-red-600 font-medium">✗ ${isEligible.message}</div>`
                            }
                        </div>
                    </label>
                `;
            }).join('')}
        </div>
    `;
}

/**
 * Step 3: Purchase Price
 */
function renderStep3_PurchasePrice() {
    return `
        <h2 class="text-3xl font-bold mb-4">What is your expected purchase price?</h2>
        <p class="text-gray-600 mb-8">This affects your FIRB application fee</p>

        <div class="max-w-md">
            <label class="block font-semibold mb-2">Purchase Price (AUD)</label>
            <div class="relative">
                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-lg">$</span>
                <input type="text"
                    value="${wizardState.answers.purchasePrice ? formatNumberWithCommas(wizardState.answers.purchasePrice) : ''}"
                    oninput="handleWizardPriceInput(this)"
                    placeholder="850,000"
                    class="w-full pl-10 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <p class="text-sm text-gray-500 mt-2">Average property price in Sydney: ~$1,200,000</p>

            <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 firb-fee-estimate">
                ${wizardState.answers.purchasePrice ? `
                    <div class="flex justify-between items-center">
                        <span class="font-semibold">Estimated FIRB Fee:</span>
                        <span class="text-xl font-bold text-blue-600">${formatCurrency(estimateFIRBFee())}</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-2">Based on individual applicant. Company fees are higher.</p>
                ` : ''}
            </div>

            <button onclick="nextWizardStep()"
                ${!wizardState.answers.purchasePrice ? 'disabled' : ''}
                class="w-full mt-6 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                <span>Continue</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    `;
}

/**
 * Step 4: State
 */
function renderStep4_State() {
    return `
        <h2 class="text-3xl font-bold mb-4">Which state is the property located in?</h2>
        <p class="text-gray-600 mb-8">Stamp duty surcharges vary by state</p>

        <div class="max-w-md">
            <label class="block font-semibold mb-2">State/Territory</label>
            <select onchange="handleWizardStateChange(this.value)"
                class="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select state...</option>
                <option value="NSW" ${wizardState.answers.state === 'NSW' ? 'selected' : ''}>New South Wales (NSW)</option>
                <option value="VIC" ${wizardState.answers.state === 'VIC' ? 'selected' : ''}>Victoria (VIC)</option>
                <option value="QLD" ${wizardState.answers.state === 'QLD' ? 'selected' : ''}>Queensland (QLD)</option>
                <option value="SA" ${wizardState.answers.state === 'SA' ? 'selected' : ''}>South Australia (SA)</option>
                <option value="WA" ${wizardState.answers.state === 'WA' ? 'selected' : ''}>Western Australia (WA)</option>
                <option value="TAS" ${wizardState.answers.state === 'TAS' ? 'selected' : ''}>Tasmania (TAS)</option>
                <option value="ACT" ${wizardState.answers.state === 'ACT' ? 'selected' : ''}>Australian Capital Territory (ACT)</option>
                <option value="NT" ${wizardState.answers.state === 'NT' ? 'selected' : ''}>Northern Territory (NT)</option>
            </select>

            ${wizardState.answers.state ? `
                <div class="mt-6 p-4 bg-${wizardState.answers.state === 'NT' ? 'green' : 'blue'}-50 rounded-lg border border-${wizardState.answers.state === 'NT' ? 'green' : 'blue'}-200">
                    <div class="font-semibold mb-2">${wizardState.answers.state} Foreign Buyer Surcharge:</div>
                    ${wizardState.answers.state === 'NT'
                        ? '<div class="text-green-700 font-bold text-lg">0% - No surcharge! 🎉</div>'
                        : `<div class="text-lg">Stamp Duty: <span class="font-bold">${getStateSurcharge(wizardState.answers.state)}%</span></div>`
                    }
                </div>
            ` : ''}

            <button onclick="calculateEligibilityResult()"
                ${!wizardState.answers.state ? 'disabled' : ''}
                class="w-full mt-6 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>See My Eligibility Result</span>
            </button>
        </div>
    `;
}

/**
 * Event handlers
 */
function handleCitizenshipChange(value) {
    wizardState.answers.citizenshipStatus = value;

    // Australian citizens don't need FIRB
    if (value === 'australian') {
        showEligibilityResult({
            eligible: true,
            noFIRBRequired: true,
            reason: 'Australian citizens do not require FIRB approval',
            canProceedToCalculator: false,
            message: 'As an Australian citizen, you can purchase any residential property without FIRB approval. You only pay standard stamp duty and fees.'
        });
        return;
    }

    // For permanent residents, need more info
    if (value === 'permanent') {
        // Skip to results - usually no FIRB needed
        showEligibilityResult({
            eligible: true,
            noFIRBRequired: true,
            reason: 'Permanent residents ordinarily resident in Australia generally do not require FIRB approval',
            canProceedToCalculator: false,
            caveat: 'Note: You must be ordinarily resident in Australia. If you spend most of your time overseas, FIRB approval may be required.',
            message: 'As a permanent resident ordinarily resident in Australia, you can purchase residential property without FIRB approval.'
        });
        return;
    }

    // For temporary residents, show visa selection
    if (value === 'temporary') {
        // Re-render to show visa selection
        console.log('[WIZARD] Temporary resident selected - showing visa selection');
        render();
        return;
    }

    // For foreign nationals, proceed to next step
    if (value === 'foreign') {
        console.log('[WIZARD] Foreign national selected - proceeding to next step');
        nextWizardStep();
        return;
    }
}

function handleVisaTypeChange(value) {
    wizardState.answers.visaType = value;
    if (value) {
        nextWizardStep();
    }
}

function handlePropertyTypeChange(value) {
    wizardState.answers.propertyType = value;
    nextWizardStep();
}

function handleWizardPriceInput(input) {
    const rawValue = input.value.replace(/[^\d]/g, '');
    wizardState.answers.purchasePrice = rawValue;

    console.log('[WIZARD] Price input changed:', rawValue);

    // Don't call render() - just update the input value directly
    // This prevents re-rendering which would reset cursor position
    if (rawValue) {
        input.value = formatNumberWithCommas(rawValue);
    } else {
        input.value = '';
    }

    // Update the FIRB fee display without full re-render
    updateFIRBFeeDisplay();
}

function updateFIRBFeeDisplay() {
    const feeDisplay = document.querySelector('.firb-fee-estimate');
    const continueBtn = document.querySelector('[onclick="nextWizardStep()"]');

    if (wizardState.answers.purchasePrice) {
        const fee = estimateFIRBFee();
        if (feeDisplay) {
            feeDisplay.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="font-semibold">Estimated FIRB Fee:</span>
                    <span class="text-xl font-bold text-blue-600">${formatCurrency(fee)}</span>
                </div>
                <p class="text-xs text-gray-600 mt-2">Based on individual applicant. Company fees are higher.</p>
            `;
        }
        if (continueBtn) {
            continueBtn.disabled = false;
            continueBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    } else {
        if (feeDisplay) {
            feeDisplay.innerHTML = '';
        }
        if (continueBtn) {
            continueBtn.disabled = true;
            continueBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
}

function handleWizardStateChange(value) {
    wizardState.answers.state = value;
    render();
}

function nextWizardStep() {
    if (wizardState.step < wizardState.totalSteps) {
        wizardState.step++;
        render();
        window.scrollTo(0, 0);
    }
}

function previousWizardStep() {
    if (wizardState.step > 1) {
        wizardState.step--;
        render();
        window.scrollTo(0, 0);
    }
}

/**
 * Check property eligibility based on current answers
 */
function checkPropertyEligibility(propertyType) {
    const { citizenshipStatus, visaType } = wizardState.answers;

    // Foreign nationals
    if (citizenshipStatus === 'foreign') {
        if (propertyType === 'new' || propertyType === 'offThePlan') {
            return { eligible: true, message: 'Generally allowed for foreign buyers' };
        }
        if (propertyType === 'established') {
            return { eligible: false, message: 'Not allowed - consider new dwellings instead' };
        }
        if (propertyType === 'vacant') {
            return { eligible: true, message: 'Allowed with development approval' };
        }
        if (propertyType === 'commercial') {
            return { eligible: true, message: 'Allowed - different FIRB rules apply' };
        }
    }

    // Temporary residents
    if (citizenshipStatus === 'temporary' && visaType) {
        const visa = VISA_TYPES[visaType];
        if (!visa) return { eligible: true, message: 'Check visa conditions' };

        if (propertyType === 'established' && !visa.canBuyEstablished) {
            return { eligible: false, message: 'Your visa type does not allow established dwellings' };
        }
        if (propertyType === 'established' && visa.canBuyEstablished) {
            return { eligible: true, message: `Allowed - ${visa.condition}` };
        }
        if (propertyType === 'new' || propertyType === 'offThePlan') {
            return { eligible: true, message: 'Allowed for most visa types' };
        }
        if (propertyType === 'vacant' && !visa.canBuyVacant) {
            return { eligible: false, message: 'Your visa type does not allow vacant land' };
        }
        if (propertyType === 'vacant' && visa.canBuyVacant) {
            return { eligible: true, message: 'Allowed with development plans' };
        }
    }

    return { eligible: true, message: 'Eligibility depends on specific circumstances' };
}

/**
 * Estimate FIRB fee based on current answers
 */
function estimateFIRBFee() {
    const price = parseFloat(wizardState.answers.purchasePrice || 0);

    if (price < 1000000) return 13200;
    if (price < 2000000) return 26400;
    if (price < 3000000) return 39600;
    return 132000;
}

/**
 * Get state surcharge rate
 */
function getStateSurcharge(state) {
    const rates = {
        'NSW': 8, 'VIC': 8, 'QLD': 8, 'TAS': 8,
        'WA': 7, 'SA': 7, 'ACT': 4, 'NT': 0
    };
    return rates[state] || 8;
}

/**
 * Calculate final eligibility result
 */
function calculateEligibilityResult() {
    const { citizenshipStatus, visaType, propertyType, purchasePrice, state: stateCode } = wizardState.answers;

    const eligibility = checkPropertyEligibility(propertyType);
    const firbFee = estimateFIRBFee();
    const surcharge = getStateSurcharge(stateCode);

    const result = {
        eligible: eligibility.eligible,
        noFIRBRequired: false,
        reason: eligibility.message,
        firbFee,
        surcharge,
        state: stateCode,
        propertyType,
        citizenshipStatus,
        visaType,
        purchasePrice,
        canProceedToCalculator: eligibility.eligible
    };

    showEligibilityResult(result);
}

/**
 * Show eligibility result page
 */
function showEligibilityResult(result) {
    wizardState.result = result;
    state.currentStep = 'eligibilityResult';
    render();
    window.scrollTo(0, 0);
}

/**
 * Render eligibility result page
 */
function renderEligibilityResult() {
    const result = wizardState.result;
    if (!result) return '';

    const { eligible, noFIRBRequired, reason, firbFee, surcharge, state: stateCode,
            propertyType, citizenshipStatus, visaType, purchasePrice, canProceedToCalculator,
            message, caveat } = result;

    // For Australian citizens and PR
    if (noFIRBRequired) {
        return `
            <section class="py-20 bg-gradient-to-br from-green-50 to-white min-h-screen">
                <div class="max-w-4xl mx-auto px-4">
                    <div class="bg-white rounded-lg shadow-xl p-8 border-t-4 border-green-500">
                        <!-- Success header -->
                        <div class="text-center mb-8">
                            <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                                <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h1 class="text-4xl font-bold text-gray-900 mb-2">Great News!</h1>
                            <p class="text-xl text-gray-700">${message || reason}</p>
                        </div>

                        ${caveat ? `
                            <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div class="flex items-start">
                                    <svg class="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                    </svg>
                                    <p class="text-sm text-gray-700">${caveat}</p>
                                </div>
                            </div>
                        ` : ''}

                        <!-- What this means -->
                        <div class="bg-green-50 rounded-lg p-6 mb-6">
                            <h2 class="text-xl font-bold text-gray-900 mb-4">What This Means</h2>
                            <ul class="space-y-3">
                                <li class="flex items-start">
                                    <svg class="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                    </svg>
                                    <span class="text-gray-700">No FIRB application or approval required</span>
                                </li>
                                <li class="flex items-start">
                                    <svg class="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                    </svg>
                                    <span class="text-gray-700">No foreign buyer stamp duty surcharge</span>
                                </li>
                                <li class="flex items-start">
                                    <svg class="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                    </svg>
                                    <span class="text-gray-700">No annual vacancy fee</span>
                                </li>
                                <li class="flex items-start">
                                    <svg class="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                    </svg>
                                    <span class="text-gray-700">You can purchase any residential property type</span>
                                </li>
                            </ul>
                        </div>

                        <!-- Required documents -->
                        ${getRequiredDocumentsSection(citizenshipStatus)}

                        <!-- Actions -->
                        <div class="flex flex-col sm:flex-row gap-4 mt-8">
                            <button onclick="goToStep('home')"
                                class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-center">
                                Back to Home
                            </button>
                            <a href="https://www.firb.gov.au/" target="_blank"
                                class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center">
                                Learn More at FIRB.gov.au
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // For eligible foreign buyers / temporary residents
    if (eligible && canProceedToCalculator) {
        const propertyTypeLabel = PROPERTY_TYPES_WIZARD[propertyType]?.label || propertyType;
        const documentsKey = citizenshipStatus === 'temporary' ? 'temporary_resident' : 'foreign_national';

        return `
            <section class="py-20 bg-gradient-to-br from-blue-50 to-white min-h-screen">
                <div class="max-w-4xl mx-auto px-4">
                    <div class="bg-white rounded-lg shadow-xl p-8 border-t-4 border-blue-500">
                        <!-- Success header -->
                        <div class="text-center mb-8">
                            <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                                <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h1 class="text-4xl font-bold text-gray-900 mb-2">You ARE Eligible!</h1>
                            <p class="text-xl text-gray-700">You can purchase a ${propertyTypeLabel} in ${stateCode}</p>
                        </div>

                        <!-- Key costs summary -->
                        <div class="grid md:grid-cols-3 gap-4 mb-8">
                            <div class="bg-blue-50 rounded-lg p-6 text-center">
                                <div class="text-sm text-gray-600 mb-1">FIRB Application Fee</div>
                                <div class="text-2xl font-bold text-blue-600">${formatCurrency(firbFee)}</div>
                            </div>
                            <div class="bg-${stateCode === 'NT' ? 'green' : 'orange'}-50 rounded-lg p-6 text-center">
                                <div class="text-sm text-gray-600 mb-1">${stateCode} Stamp Duty Surcharge</div>
                                <div class="text-2xl font-bold text-${stateCode === 'NT' ? 'green' : 'orange'}-600">
                                    ${stateCode === 'NT' ? 'NONE! 🎉' : surcharge + '%'}
                                </div>
                            </div>
                            <div class="bg-gray-50 rounded-lg p-6 text-center">
                                <div class="text-sm text-gray-600 mb-1">Property Price</div>
                                <div class="text-2xl font-bold text-gray-900">${formatCurrency(purchasePrice)}</div>
                            </div>
                        </div>

                        <!-- Important conditions -->
                        <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h3 class="font-bold text-gray-900 mb-2 flex items-center">
                                <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                                Important Conditions
                            </h3>
                            <p class="text-sm text-gray-700">${reason}</p>
                            ${visaType && VISA_TYPES[visaType] ? `
                                <p class="text-sm text-gray-700 mt-2">
                                    <strong>Visa Condition:</strong> ${VISA_TYPES[visaType].condition}
                                </p>
                            ` : ''}
                        </div>

                        <!-- Required documents -->
                        ${getRequiredDocumentsSection(documentsKey)}

                        <!-- Next steps -->
                        <div class="bg-gray-50 rounded-lg p-6 mb-6">
                            <h2 class="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
                            <ol class="space-y-3">
                                <li class="flex items-start">
                                    <span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                                    <span class="text-gray-700">Apply for FIRB approval BEFORE signing contract</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                                    <span class="text-gray-700">Wait for FIRB decision (typically 30 days)</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                                    <span class="text-gray-700">Once approved, proceed with property purchase</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                                    <span class="text-gray-700">Pay stamp duty and foreign buyer surcharge at settlement</span>
                                </li>
                            </ol>
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-col sm:flex-row gap-4">
                            <button onclick="startEligibilityWizard()"
                                class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                                Start Over
                            </button>
                            <button onclick="proceedToFullCalculator()"
                                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                </svg>
                                <span>Calculate Full Costs</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // For ineligible buyers
    return `
        <section class="py-20 bg-gradient-to-br from-red-50 to-white min-h-screen">
            <div class="max-w-4xl mx-auto px-4">
                <div class="bg-white rounded-lg shadow-xl p-8 border-t-4 border-red-500">
                    <!-- Ineligible header -->
                    <div class="text-center mb-8">
                        <div class="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                            <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </div>
                        <h1 class="text-4xl font-bold text-gray-900 mb-2">Not Eligible</h1>
                        <p class="text-xl text-gray-700">You cannot purchase this property type</p>
                    </div>

                    <!-- Reason -->
                    <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h3 class="font-bold text-gray-900 mb-2">Why?</h3>
                        <p class="text-gray-700">${reason}</p>
                    </div>

                    <!-- Alternative properties -->
                    <div class="bg-blue-50 rounded-lg p-6 mb-6">
                        <h2 class="text-xl font-bold text-gray-900 mb-4">What You CAN Buy</h2>
                        <p class="text-gray-700 mb-4">Based on your situation, you are eligible to purchase:</p>
                        <ul class="space-y-2">
                            ${getAlternativeProperties(citizenshipStatus, visaType).map(alt => `
                                <li class="flex items-start">
                                    <svg class="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                    </svg>
                                    <div>
                                        <div class="font-semibold">${alt.label}</div>
                                        <div class="text-sm text-gray-600">${alt.description}</div>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button onclick="startEligibilityWizard()"
                            class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Check Different Property Type
                        </button>
                        <a href="https://www.firb.gov.au/" target="_blank"
                            class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-center">
                            Learn More at FIRB.gov.au
                        </a>
                    </div>
                </div>
            </div>
        </section>
    `;
}

/**
 * Get required documents section HTML
 */
function getRequiredDocumentsSection(key) {
    const documents = REQUIRED_DOCUMENTS[key] || REQUIRED_DOCUMENTS.foreign_national;

    return `
        <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Required Documents</h2>
            <ul class="space-y-2">
                ${documents.map(doc => `
                    <li class="flex items-start">
                        <svg class="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <span class="text-gray-700">${doc}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

/**
 * Get alternative properties for ineligible buyers
 */
function getAlternativeProperties(citizenshipStatus, visaType) {
    const alternatives = [];

    if (citizenshipStatus === 'foreign') {
        alternatives.push({
            label: 'New Dwellings',
            description: 'Brand new apartments or houses that have never been occupied'
        });
        alternatives.push({
            label: 'Off-the-Plan Properties',
            description: 'Properties not yet built - purchase before construction'
        });
        alternatives.push({
            label: 'Vacant Land',
            description: 'Undeveloped land with development approval requirements'
        });
    }

    if (citizenshipStatus === 'temporary' && visaType) {
        const visa = VISA_TYPES[visaType];
        if (visa) {
            if (visa.canBuyNew) {
                alternatives.push({
                    label: 'New Dwellings',
                    description: 'Brand new properties that meet your visa conditions'
                });
            }
            if (visa.canBuyEstablished) {
                alternatives.push({
                    label: 'Established Properties',
                    description: `Must be your principal place of residence - ${visa.condition}`
                });
            }
        }
    }

    if (alternatives.length === 0) {
        alternatives.push({
            label: 'New Dwellings',
            description: 'Generally the most accessible option for foreign buyers'
        });
    }

    return alternatives;
}

/**
 * Proceed to full calculator with wizard data
 */
function proceedToFullCalculator() {
    const { purchasePrice, state: stateCode, propertyType, citizenshipStatus, visaType } = wizardState.answers;

    console.log('[WIZARD] Proceeding to calculator with data:', {
        purchasePrice, stateCode, propertyType, citizenshipStatus, visaType
    });

    // Ensure formData object exists
    if (!state.formData) {
        state.formData = {};
    }

    // Pre-populate calculator with wizard data
    state.propertyValue = parseFloat(purchasePrice);
    state.state = stateCode;

    // Map wizard property type to calculator property type
    const propertyTypeMap = {
        'new': 'newDwelling',
        'offThePlan': 'newDwelling',
        'established': 'established',
        'vacant': 'vacantLand',
        'commercial': 'commercial'
    };
    const mappedPropertyType = propertyTypeMap[propertyType] || 'newDwelling';
    state.propertyType = mappedPropertyType;
    state.formData.propertyType = mappedPropertyType;
    state.formData.propertyValue = purchasePrice;
    state.formData.state = stateCode;

    // Transfer citizenship context to main state
    if (citizenshipStatus) {
        state.citizenshipStatus = citizenshipStatus;
        state.formData.citizenshipStatus = citizenshipStatus;
        console.log('[WIZARD] Transferred citizenship status:', citizenshipStatus);
    }

    // Transfer visa type if applicable
    if (visaType) {
        state.visaType = visaType;
        state.formData.visaType = visaType;
        console.log('[WIZARD] Transferred visa type:', visaType);
    }

    console.log('[WIZARD] Final state.formData:', state.formData);

    // Go to calculator
    goToStep('calculator');
}

// Export for use in render.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        startEligibilityWizard,
        renderEligibilityWizard,
        renderEligibilityResult,
        wizardState
    };
}
