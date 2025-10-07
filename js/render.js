// All render functions for each page/section

// Render home page
function renderHome() {
    return `
        <section class="bg-gradient-to-br from-blue-50 to-white py-20">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <h1 class="text-5xl font-bold mb-6">${t('hero')}</h1>
                <p class="text-xl text-gray-600 mb-8">${t('subtitle')}</p>
                <button onclick="goToStep('eligibility')" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 inline-flex items-center space-x-2">
                    <span>${t('cta')}</span>
                    <span>→</span>
                </button>
            </div>
        </section>

        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4">
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="text-center">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-3xl">📊</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">${t('accurateCalc')}</h3>
                        <p class="text-gray-600">${t('accurateDesc')}</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-3xl">⚡</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">${t('instantResults')}</h3>
                        <p class="text-gray-600">${t('instantDesc')}</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-3xl">🛡️</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">${t('complianceAssured')}</h3>
                        <p class="text-gray-600">${t('complianceDesc')}</p>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Render eligibility checker page
function renderEligibility() {
    return `
        <section class="py-20 bg-gray-50 min-h-screen">
            <div class="max-w-3xl mx-auto px-4">
                <button onclick="goToStep('home')" class="text-blue-600 mb-8">← ${t('back')}</button>
                <div class="bg-white p-8 rounded-lg">
                    <h2 class="text-3xl font-bold mb-6">${t('checkEligibility')}</h2>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block font-semibold mb-3">${t('citizenshipQ')}</label>
                            <div class="space-y-2">
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="citizenship" value="australian" onchange="updateEligibility('citizenship', 'australian')" class="mr-3">
                                    <span>${t('ausC')}</span>
                                </label>
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="citizenship" value="foreign" onchange="updateEligibility('citizenship', 'foreign')" class="mr-3">
                                    <span>${t('foreignC')}</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold mb-3">${t('residencyQ')}</label>
                            <div class="space-y-2">
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="residency" value="permanent" onchange="updateEligibility('residency', 'permanent')" class="mr-3">
                                    <span>${t('permRes')}</span>
                                </label>
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="residency" value="temporary" onchange="updateEligibility('residency', 'temporary')" class="mr-3">
                                    <span>${t('tempRes')}</span>
                                </label>
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="residency" value="notResident" onchange="updateEligibility('residency', 'notResident')" class="mr-3">
                                    <span>${t('notRes')}</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold mb-3">${t('purposeQ')}</label>
                            <div class="space-y-2">
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="purpose" value="primary" onchange="updateEligibility('purposeOfPurchase', 'primary')" class="mr-3">
                                    <span>${t('primary')}</span>
                                </label>
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="purpose" value="investment" onchange="updateEligibility('purposeOfPurchase', 'investment')" class="mr-3">
                                    <span>${t('invest')}</span>
                                </label>
                            </div>
                        </div>

                        <button onclick="checkEligibility()" class="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2">
                            <span>🛡️</span>
                            <span>${t('checkElig')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Render eligibility result page
function renderEligibilityResult() {
    const eligible = state.isEligible;
    if (!eligible) return '';

    if (eligible.required) {
        return `
            <section class="py-20 bg-gray-50 min-h-screen">
                <div class="max-w-3xl mx-auto px-4">
                    <button onclick="goToStep('eligibility')" class="text-blue-600 mb-8">← ${t('back')}</button>
                    <div class="bg-white p-8 rounded-lg text-center">
                        <div class="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span class="text-5xl">📋</span>
                        </div>
                        <h2 class="text-3xl font-bold mb-4">${t('firbReq')}</h2>
                        <p class="text-lg text-gray-600 mb-4">${t('firbReqMsg')}</p>
                        <div class="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                            <p class="text-sm text-gray-700">${eligible.note}</p>
                        </div>
                        <button onclick="goToStep('calculator')" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 inline-flex items-center space-x-2">
                            <span>${t('proceedCalc')}</span>
                            <span>→</span>
                        </button>
                    </div>
                </div>
            </section>
        `;
    } else {
        return `
            <section class="py-20 bg-gray-50 min-h-screen">
                <div class="max-w-3xl mx-auto px-4">
                    <button onclick="goToStep('eligibility')" class="text-blue-600 mb-8">← ${t('back')}</button>
                    <div class="bg-white p-8 rounded-lg text-center">
                        <div class="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span class="text-5xl">✅</span>
                        </div>
                        <h2 class="text-3xl font-bold mb-4">${t('noFirb')}</h2>
                        <p class="text-lg text-gray-600 mb-4">${t('noFirbMsg')}</p>
                        <div class="bg-green-50 p-4 rounded-lg mb-6 text-left">
                            <p class="text-sm text-gray-700">${eligible.note}</p>
                        </div>
                        <button onclick="goToStep('home')" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700">
                            ${t('returnHome')}
                        </button>
                    </div>
                </div>
            </section>
        `;
    }
}

// Render calculator form page
function renderCalculator() {
    return `
        <section class="py-20 bg-gray-50 min-h-screen">
            <div class="max-w-3xl mx-auto px-4">
                <button onclick="goToStep('eligibilityResult')" class="text-blue-600 mb-8">← ${t('back')}</button>
                
                ${state.savedCalculations.length > 0 ? `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p class="text-sm text-blue-900">
                            ⏱️ You have ${state.savedCalculations.length} saved calculation${state.savedCalculations.length > 1 ? 's' : ''} from this session
                        </p>
                    </div>
                ` : ''}
                
                <div class="bg-white p-8 rounded-lg">
                    <h2 class="text-3xl font-bold mb-8">${t('propCalc')}</h2>
                    <div class="space-y-6">
                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p class="text-sm text-yellow-900">
                                🛡️ ${t('sessionData')}
                            </p>
                        </div>
                        
                        <div>
                            <label class="block font-semibold mb-2">${t('propAddress')}</label>
                            <input type="text" id="address" onchange="updateForm('address', this.value)" placeholder="${t('enterAddress')}" class="w-full px-4 py-3 border rounded-lg">
                        </div>

                        <div>
                            <label class="block font-semibold mb-2">${t('purchasePrice')}</label>
                            <input type="number" id="propertyValue" onchange="updateForm('propertyValue', this.value)" placeholder="850000" class="w-full px-4 py-3 border rounded-lg">
                        </div>

                        <div>
                            <label class="block font-semibold mb-2">${t('propType')}</label>
                            <select id="propertyType" onchange="updateForm('propertyType', this.value)" class="w-full px-4 py-3 border rounded-lg">
                                <option value="">${t('selectType')}</option>
                                <option value="established">${t('established')}</option>
                                <option value="newDwelling">${t('newDwelling')}</option>
                                <option value="vacant">${t('vacant')}</option>
                            </select>
                        </div>

                        <div>
                            <label class="block font-semibold mb-2">${t('state')}</label>
                            <select id="state" onchange="updateForm('state', this.value)" class="w-full px-4 py-3 border rounded-lg">
                                <option value="">${t('selectState')}</option>
                                <option value="NSW">NSW</option>
                                <option value="VIC">VIC</option>
                                <option value="QLD">QLD</option>
                                <option value="SA">SA</option>
                                <option value="WA">WA</option>
                                <option value="TAS">TAS</option>
                                <option value="ACT">ACT</option>
                                <option value="NT">NT</option>
                            </select>
                        </div>

                        <div>
                            <label class="block font-semibold mb-2">${t('firstHome')}</label>
                            <div class="flex space-x-4">
                                <label class="flex items-center">
                                    <input type="radio" name="firstHome" value="yes" onchange="updateForm('firstHomeBuyer', 'yes')" class="mr-2">
                                    Yes
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="firstHome" value="no" onchange="updateForm('firstHomeBuyer', 'no')" class="mr-2">
                                    No
                                </label>
                            </div>
                        </div>

                        <button onclick="handleCalculate()" ${state.isCalculating ? 'disabled' : ''} class="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center space-x-2">
                            ${state.isCalculating ? `
                                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>${t('calculating')}</span>
                            ` : `
                                <span>📊 ${t('calcFees')}</span>
                            `}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Render results page
function renderResults() {
    if (!state.calculatedFees) return '';
    const fees = state.calculatedFees;

    return `
        <section class="py-20 bg-gray-50 min-h-screen">
            <div class="max-w-4xl mx-auto px-4">
                <button onclick="goToStep('calculator')" class="text-blue-600 mb-8">← ${t('back')}</button>
                <div class="bg-white p-8 rounded-lg">
                    <h2 class="text-3xl font-bold mb-8">${t('feeBreakdown')}</h2>
                    
                    <div class="mb-12">
                        <h3 class="text-2xl font-bold mb-6">🌏 ${t('foreignInvestmentFees')}</h3>
                        <div class="space-y-4 mb-6">
                            <div class="p-6 bg-orange-50 rounded-lg border border-orange-200">
                                <div class="flex justify-between">
                                    <div>
                                        <h4 class="font-semibold text-lg">${t('firbAppFee')}</h4>
                                        <p class="text-sm text-gray-600">${t('paidToGov')}</p>
                                    </div>
                                    <span class="text-2xl font-bold">${formatCurrency(fees.firb)}</span>
                                </div>
                            </div>
                            
                            <div class="p-6 bg-orange-50 rounded-lg border border-orange-200">
                                <div class="flex justify-between">
                                    <div>
                                        <h4 class="font-semibold text-lg">${t('stampSurcharge')}</h4>
                                        <p class="text-sm text-gray-600">${t('addStateTax')}</p>
                                    </div>
                                    <span class="text-2xl font-bold">${formatCurrency(fees.stampDuty)}</span>
                                </div>
                            </div>
                            
                            <div class="p-6 bg-orange-50 rounded-lg border border-orange-200">
                                <div class="flex justify-between">
                                    <div>
                                        <h4 class="font-semibold text-lg">${t('legalFeesCard')}</h4>
                                        <p class="text-sm text-gray-600">${t('profFees')}</p>
                                    </div>
                                    <span class="text-2xl font-bold">${formatCurrency(fees.legal)}</span>
                                </div>
                            </div>

                            <div class="bg-orange-100 p-4 rounded-lg">
                                <div class="flex justify-between items-center">
                                    <h4 class="text-xl font-bold">${t('foreignTotal')}</h4>
                                    <span class="text-2xl font-bold text-orange-600">${formatCurrency(fees.foreignTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mb-12">
                        <h3 class="text-2xl font-bold mb-6">🏠 ${t('standardPropertyFees')}</h3>
                        <p class="text-sm text-gray-600 mb-6">${t('allBuyersPay')}</p>
                        
                        <div class="space-y-3 mb-6">
                            <div class="p-4 bg-blue-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('standardStampDuty')}</span>
                                <span class="font-bold">${formatCurrency(fees.standard.stampDuty)}</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('transferFee')} & ${t('mortgageReg')}</span>
                                <span class="font-bold">${formatCurrency(fees.standard.transferFee + fees.standard.mortgageRegistration)}</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('legalConveyancing')}</span>
                                <span class="font-bold">${formatCurrency(fees.standard.conveyancingLegal)}</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('buildingPest')}</span>
                                <span class="font-bold">${formatCurrency(fees.standard.buildingInspection + fees.standard.pestInspection + fees.standard.titleSearch)}</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('loanApp')}</span>
                                <span class="font-bold">${formatCurrency(fees.standard.loanApplicationFee)}</span>
                            </div>
                            ${fees.standard.lendersMortgageInsurance > 0 ? `
                                <div class="p-4 bg-gray-50 rounded-lg flex justify-between">
                                    <span class="font-semibold">Lenders Mortgage Insurance</span>
                                    <span class="font-bold">${formatCurrency(fees.standard.lendersMortgageInsurance)}</span>
                                </div>
                            ` : ''}
                            <div class="p-4 bg-gray-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('councilWater')}</span>
                                <span class="font-bold">${formatCurrency(fees.standard.councilRates + fees.standard.waterRates)}</span>
                            </div>

                            <div class="bg-blue-100 p-4 rounded-lg">
                                <div class="flex justify-between items-center">
                                    <h4 class="text-xl font-bold">${t('standardTotal')}</h4>
                                    <span class="text-2xl font-bold text-blue-600">${formatCurrency(fees.standardTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="border-t-2 pt-6 mb-8">
                        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg text-white">
                            <div class="flex justify-between items-center">
                                <h3 class="text-2xl font-bold">${t('totalCosts')}</h3>
                                <span class="text-4xl font-bold">${formatCurrency(fees.grandTotal)}</span>
                            </div>
                            <p class="text-sm text-blue-100 mt-2">${t('allFees')}</p>
                        </div>
                    </div>

                    <div class="bg-blue-50 p-6 rounded-lg mb-8">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="text-xl font-bold mb-1">${t('ourServiceFee')}</h3>
                                <p class="text-sm text-gray-600">${t('detailedReport')}</p>
                            </div>
                            <span class="text-2xl font-bold text-blue-600">$50</span>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4 mb-6">
                        <button onclick="handlePayment()" ${state.isProcessingPayment ? 'disabled' : ''} class="bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400">
                            ${state.isProcessingPayment ? `⏳ ${t('processing')}` : `💳 ${t('proceedPayment')}`}
                        </button>
                        <button onclick="downloadReport()" class="bg-gray-100 text-gray-900 px-6 py-4 rounded-lg font-semibold hover:bg-gray-200">
                            📥 ${t('downloadReport')}
                        </button>
                    </div>

                    <p class="text-sm text-gray-500 text-center">${t('estimates')}</p>
                </div>
            </div>
        </section>
    `;
}

// Render header
function renderHeader() {
    return `
        <header class="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2 cursor-pointer" onclick="goToStep('home')">
                        <span class="text-3xl">🏠</span>
                        <span class="text-xl font-semibold">FIRB Calculator</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="changeLanguage('en')" class="px-3 py-1 rounded text-sm ${state.language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600'}">EN</button>
                        <button onclick="changeLanguage('zh')" class="px-3 py-1 rounded text-sm ${state.language === 'zh' ? 'bg-blue-600 text-white' : 'text-gray-600'}">中文</button>
                        <button onclick="changeLanguage('vi')" class="px-3 py-1 rounded text-sm ${state.language === 'vi' ? 'bg-blue-600 text-white' : 'text-gray-600'}">VI</button>
                    </div>
                </div>
            </div>
        </header>
    `;
}

// Render footer
function renderFooter() {
    return `
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-7xl mx-auto px-4">
                <div class="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 class="text-lg font-bold mb-4">FIRB Calculator</h3>
                        <p class="text-gray-400">Professional fee calculations</p>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold mb-4">${t('quickLinks')}</h3>
                        <button onclick="goToStep('home')" class="block text-gray-400 hover:text-white mb-2">${t('navHome')}</button>
                        <button onclick="goToStep('eligibility')" class="block text-gray-400 hover:text-white">${t('navCalculator')}</button>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold mb-4">${t('contact')}</h3>
                        <p class="text-gray-400">support@firbcalculator.com.au</p>
                    </div>
                </div>
                <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 FIRB Calculator. ${t('allRights')}</p>
                </div>
            </div>
        </footer>
    `;
}

// Main render function - puts everything together
function render() {
    const app = document.getElementById('app');
    let content = renderHeader();

    switch(state.currentStep) {
        case 'home':
            content += renderHome();
            break;
        case 'eligibility':
            content += renderEligibility();
            break;
        case 'eligibilityResult':
            content += renderEligibilityResult();
            break;
        case 'calculator':
            content += renderCalculator();
            break;
        case 'results':
            content += renderResults();
            break;
    }

    content += renderFooter();
    app.innerHTML = content;
}
