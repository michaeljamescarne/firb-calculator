/**
 * Render functions for FIRB Calculator UI
 * @file render.js
 */

/**
 * Main render function - orchestrates rendering of the entire application
 */
function render() {
    const app = document.getElementById('app');
    if (!app) {
        console.error('App element not found!');
        return;
    }

    let content = '';

    // Header (always shown)
    content += renderHeader();

    // Render current step
    switch(state.currentStep) {
        case 'home':
            content += renderHome();
            break;
        case 'eligibilityWizard':
            content += typeof renderEligibilityWizard === 'function' ? renderEligibilityWizard() : renderHome();
            break;
        case 'eligibility':
            content += renderEligibility();
            break;
        case 'eligibilityResult':
            console.log('[RENDER.JS DEBUG] eligibilityResult case - renderEligibilityResult type:', typeof renderEligibilityResult);
            if (typeof renderEligibilityResult === 'function') {
                console.log('[RENDER.JS DEBUG] Calling renderEligibilityResult()');
                content += renderEligibilityResult();
            } else {
                console.log('[RENDER.JS DEBUG] renderEligibilityResult not a function, calling renderHome()');
                content += renderHome();
            }
            break;
        case 'calculator':
            content += renderCalculator();
            break;
        case 'results':
            content += renderResultsDashboard();
            break;
        case 'compare':
            content += typeof renderScenarioComparison === 'function' ? renderScenarioComparison() : '';
            break;
        case 'sharedCompare':
            content += typeof renderSharedComparisonPage === 'function' ? renderSharedComparisonPage() : '';
            break;
        case 'checklist':
            content += typeof renderDocumentChecklistPage === 'function' ? renderDocumentChecklistPage() : '';
            break;
        case 'faq':
            content += renderFAQPage();
            break;
        case 'timeline':
            content += renderTimelinePage();
            break;
        default:
            content += renderHome();
    }

    // Footer (always shown)
    content += renderFooter();

    app.innerHTML = content;

    // Re-initialize Lucide icons after rendering
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Add alert styles (needed for all pages with alerts)
    if (typeof addAlertStyles === 'function') {
        addAlertStyles();
    }

    // Add deposit slider styles
    addDepositSliderStyles();

    // Initialize dashboard charts if on results page
    if (state.currentStep === 'results' && state.calculatedFees) {
        // Add collapsible styles
        if (typeof addCollapsibleStyles === 'function') {
            addCollapsibleStyles();
        }
        // Initialize investment tool
        if (typeof initInvestmentTool === 'function') {
            initInvestmentTool(state.calculatedFees);
        }
        // Initialize cost optimizer
        if (typeof initCostOptimizer === 'function') {
            initCostOptimizer(state.calculatedFees);
        }
        // Initialize charts after DOM is ready
        setTimeout(() => {
            if (typeof initializeDashboardCharts === 'function') {
                initializeDashboardCharts();
            }
            if (typeof initInvestmentCharts === 'function') {
                initInvestmentCharts();
            }
        }, 100);
        
        // Retry chart initialization if libraries failed to load
        setTimeout(() => {
            if (!window.Recharts || !window.React || !window.ReactDOM) {
                console.warn('[CHARTS] External libraries not loaded, retrying chart initialization...');
                if (typeof initializeDashboardCharts === 'function') {
                    initializeDashboardCharts();
                }
            }
        }, 2000);
    }
}

/**
 * Render header component with navigation
 * @returns {string} HTML string for header
 */
function renderHeader() {
    return `
        <header class="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2 cursor-pointer" onclick="goToStep('home')">
                        ${icons.home('w-8 h-8 text-blue-600')}
                        <span class="text-xl font-semibold">FIRB Calculator</span>
                    </div>

                    <div class="flex items-center space-x-4">
                        <nav class="hidden md:flex space-x-6">
                            <button onclick="goToStep('home')" class="text-gray-700 hover:text-blue-600">${t('navHome')}</button>
                            <button onclick="goToStep('eligibility')" class="text-gray-700 hover:text-blue-600">${t('navCalculator')}</button>
                            <button onclick="goToStep('timeline')" class="text-gray-700 hover:text-blue-600">Timeline</button>
                            <button onclick="goToStep('faq')" class="text-gray-700 hover:text-blue-600">FAQs</button>
                        </nav>

                        <div class="flex space-x-2">
                            <button onclick="changeLanguage('en')" class="px-3 py-1 rounded text-sm ${state.language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600'}">EN</button>
                            <button onclick="changeLanguage('zh')" class="px-3 py-1 rounded text-sm ${state.language === 'zh' ? 'bg-blue-600 text-white' : 'text-gray-600'}">中文</button>
                            <button onclick="changeLanguage('vi')" class="px-3 py-1 rounded text-sm ${state.language === 'vi' ? 'bg-blue-600 text-white' : 'text-gray-600'}">VI</button>
                        </div>

                        <button onclick="toggleMobileMenu()" class="md:hidden">
                            ${state.mobileMenuOpen ? icons.x() : icons.menu()}
                        </button>
                    </div>
                </div>

                ${state.mobileMenuOpen ? `
                    <div class="py-4 border-t mt-4 md:hidden">
                        <button onclick="goToStep('home'); toggleMobileMenu();" class="block w-full text-left py-2">${t('navHome')}</button>
                        <button onclick="goToStep('eligibility'); toggleMobileMenu();" class="block w-full text-left py-2">${t('navCalculator')}</button>
                        <button onclick="goToStep('timeline'); toggleMobileMenu();" class="block w-full text-left py-2">Timeline</button>
                        <button onclick="goToStep('faq'); toggleMobileMenu();" class="block w-full text-left py-2">FAQs</button>
                    </div>
                ` : ''}
            </div>
        </header>
    `;
}

/**
 * Render home page with information and CTA
 * @returns {string} HTML string for home page
 */
function renderHome() {
    return `
        <section class="hero-section-enhanced">
            <div class="hero-container-enhanced">
                <div class="hero-content">
                    <h1 class="hero-title">${t('hero')}</h1>
                    <p class="hero-subtitle">${t('subtitle')}</p>
                    <div class="hero-actions">
                        <button onclick="startEligibilityWizard()" class="btn-primary btn-large">
                            <span>${t('cta')}</span>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                            </svg>
                        </button>
                        <button onclick="runFIRBEligibilityTests()" class="btn-secondary btn-large">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>Run Eligibility Tests</span>
                        </button>
                    </div>
                </div>
                <div class="hero-visual">
                    <div class="hero-card">
                        <div class="card-icon">
                            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                        </div>
                        <h3 class="card-title">Professional FIRB Calculator</h3>
                        <p class="card-description">Accurate fee calculations for foreign property investors</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4">
                <div class="max-w-4xl mx-auto mb-16">
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-100">
                        <h2 class="text-3xl font-bold mb-6 text-center">What Are Foreign Investment Property Fees?</h2>
                        <p class="mb-4 text-gray-700">
                            Foreign Investment Property Fees are mandatory charges that foreign investors must pay when purchasing residential real estate in Australia.
                        </p>
                        <div class="grid md:grid-cols-3 gap-4 my-6">
                            <div class="bg-white p-4 rounded-lg shadow-sm">
                                <div class="flex items-center mb-2">
                                    ${icons.fileText('w-5 h-5 text-blue-600 mr-2')}
                                    <h3 class="font-bold">FIRB Fee</h3>
                                </div>
                                <p class="text-sm text-gray-600">$1,710 to $243,400+ depending on property value</p>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow-sm">
                                <div class="flex items-center mb-2">
                                    ${icons.dollarSign('w-5 h-5 text-blue-600 mr-2')}
                                    <h3 class="font-bold">Stamp Duty Surcharge</h3>
                                </div>
                                <p class="text-sm text-gray-600">Additional 7-8% of property value</p>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow-sm">
                                <div class="flex items-center mb-2">
                                    ${icons.building('w-5 h-5 text-blue-600 mr-2')}
                                    <h3 class="font-bold">Legal Fees</h3>
                                </div>
                                <p class="text-sm text-gray-600">Professional representation fees</p>
                            </div>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p class="text-sm text-blue-800"><strong>Important:</strong> FIRB approval must be obtained BEFORE purchasing property.</p>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-8 mb-16">
                    <div class="text-center">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            ${icons.calculator('w-8 h-8 text-blue-600')}
                        </div>
                        <h3 class="text-xl font-semibold mb-2">${t('accurateCalc')}</h3>
                        <p class="text-gray-600">${t('accurateDesc')}</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            ${icons.clock('w-8 h-8 text-blue-600')}
                        </div>
                        <h3 class="text-xl font-semibold mb-2">${t('instantResults')}</h3>
                        <p class="text-gray-600">${t('instantDesc')}</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            ${icons.shield('w-8 h-8 text-blue-600')}
                        </div>
                        <h3 class="text-xl font-semibold mb-2">${t('complianceAssured')}</h3>
                        <p class="text-gray-600">${t('complianceDesc')}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4">
                <div class="max-w-4xl mx-auto">
                    <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">When Are These Fees Required?</h2>
                    <p class="text-lg text-gray-600 mb-8 text-center">Foreign investment fees are required in specific circumstances when purchasing Australian residential property:</p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-12">
                        <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
                            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                ${icons.fileText('w-5 h-5 text-orange-500 mr-2')}
                                FIRB Fees Required
                            </h3>
                            <ul class="space-y-3">
                                <li class="flex items-start text-gray-700">
                                    <span class="text-orange-500 mr-2">•</span>
                                    <span>Foreign citizens purchasing any Australian residential property</span>
                                </li>
                                <li class="flex items-start text-gray-700">
                                    <span class="text-orange-500 mr-2">•</span>
                                    <span>Temporary residents buying established dwellings or vacant land</span>
                                </li>
                                <li class="flex items-start text-gray-700">
                                    <span class="text-orange-500 mr-2">•</span>
                                    <span>Non-residents making any residential property investment</span>
                                </li>
                                <li class="flex items-start text-gray-700">
                                    <span class="text-orange-500 mr-2">•</span>
                                    <span>Companies/trusts with foreign ownership purchasing residential property</span>
                                </li>
                            </ul>
                        </div>

                        <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                ${icons.checkCircle('w-5 h-5 text-green-500 mr-2')}
                                Fees NOT required if you are:
                            </h3>
                            <ul class="space-y-3">
                                <li class="flex items-start text-gray-700">
                                    <span class="text-green-500 mr-2">✓</span>
                                    <span>An Australian citizen or permanent resident</span>
                                </li>
                                <li class="flex items-start text-gray-700">
                                    <span class="text-green-500 mr-2">✓</span>
                                    <span>A New Zealand citizen with Special Category Visa (subclass 444)</span>
                                </li>
                                <li class="flex items-start text-gray-700">
                                    <span class="text-green-500 mr-2">✓</span>
                                    <span>A temporary resident buying a new dwelling to live in</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="bg-blue-50 p-8 rounded-lg text-center border border-blue-200">
                        <h3 class="text-2xl font-bold text-gray-900 mb-4">Not sure if you need FIRB approval?</h3>
                        <p class="text-gray-600 mb-6">Find out in less than 2 minutes with our quick eligibility assessment</p>
                        <button onclick="startEligibilityWizard()" class="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition inline-flex items-center space-x-2">
                            ${icons.shield('w-5 h-5')}
                            <span>Take Our Free Eligibility Test</span>
                            ${icons.arrowRight()}
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4">
                <div class="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Service</h2>
                        <p class="text-lg text-gray-600 mb-8">
                            We provide comprehensive fee calculations for foreign investors purchasing Australian residential property, ensuring you understand all costs upfront.
                        </p>
                        <div class="bg-blue-600 text-white p-6 rounded-lg">
                            <h3 class="text-2xl font-bold mb-2">Service Fee: $50</h3>
                            <p class="text-blue-100">One-time fee per property application covering detailed fee breakdown and compliance guidance</p>
                        </div>
                    </div>
                    <div class="bg-gray-50 p-8 rounded-lg shadow-sm">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6">What's Included:</h3>
                        <ul class="space-y-4">
                            <li class="flex items-start">
                                ${icons.checkCircle('w-6 h-6 text-green-500 mr-3 flex-shrink-0')}
                                <span class="text-gray-700">Complete FIRB application fee calculation</span>
                            </li>
                            <li class="flex items-start">
                                ${icons.checkCircle('w-6 h-6 text-green-500 mr-3 flex-shrink-0')}
                                <span class="text-gray-700">State-specific stamp duty surcharge analysis</span>
                            </li>
                            <li class="flex items-start">
                                ${icons.checkCircle('w-6 h-6 text-green-500 mr-3 flex-shrink-0')}
                                <span class="text-gray-700">Detailed breakdown of all associated costs</span>
                            </li>
                            <li class="flex items-start">
                                ${icons.checkCircle('w-6 h-6 text-green-500 mr-3 flex-shrink-0')}
                                <span class="text-gray-700">Payment timeline and methods guidance</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4">
                ${typeof renderAustraliaMap === 'function' ? renderAustraliaMap() : ''}
            </div>
        </section>

        <section class="section-enhanced section-bordered bg-gray-50">
            <div class="max-w-7xl mx-auto px-4">
                ${typeof renderPopularFAQs === 'function' ? renderPopularFAQs(6) : ''}
            </div>
        </section>

        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4">
                <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">Understanding the Fees</h2>
                <div class="grid md:grid-cols-3 gap-10">
                    <div class="bg-white p-8 rounded-lg shadow-sm">
                        <div class="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            ${icons.fileText('w-6 h-6 text-white')}
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">FIRB Application Fee</h3>
                        <p class="text-gray-600 mb-4">Paid to the Australian Government (Foreign Investment Review Board) for property purchase approval</p>
                        <p class="text-sm text-gray-500">Payment: Direct to Australian Treasury</p>
                    </div>
                    <div class="bg-white p-8 rounded-lg shadow-sm">
                        <div class="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            ${icons.dollarSign('w-6 h-6 text-white')}
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Stamp Duty Surcharge</h3>
                        <p class="text-gray-600 mb-4">Additional state-based tax for foreign buyers (varies by state: 7-8% of property value)</p>
                        <p class="text-sm text-gray-500">Payment: State Revenue Office at settlement</p>
                    </div>
                    <div class="bg-white p-8 rounded-lg shadow-sm">
                        <div class="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            ${icons.globe('w-6 h-6 text-white')}
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Legal & Conveyancing</h3>
                        <p class="text-gray-600 mb-4">Professional fees for legal representation and property transfer</p>
                        <p class="text-sm text-gray-500">Payment: Direct to your legal representative</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20 bg-blue-600">
            <div class="max-w-4xl mx-auto text-center px-4">
                <h2 class="text-3xl font-bold text-white mb-6">Ready to calculate your fees?</h2>
                <p class="text-xl text-blue-100 mb-8">Get your comprehensive fee breakdown in minutes</p>
                <button onclick="startEligibilityWizard()" class="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition inline-flex items-center space-x-2">
                    <span>Start Your Calculation</span>
                    ${icons.arrowRight()}
                </button>
            </div>
        </section>
    `;
}

/**
 * Render eligibility questionnaire
 * @returns {string} HTML string for eligibility form
 */
function renderEligibility() {
    return `
        <section class="py-20 bg-gray-50 min-h-screen">
            <div class="max-w-3xl mx-auto px-4">
                <button onclick="goToStep('home')" class="text-blue-600 mb-8 flex items-center space-x-2">
                    ${icons.arrowLeft('w-5 h-5')}
                    <span>${t('back')}</span>
                </button>
                <div class="bg-white p-8 rounded-lg">
                    <h2 class="text-3xl font-bold mb-6">${t('checkEligibility')}</h2>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block font-semibold mb-3">${t('citizenshipQ')}</label>
                            <div class="space-y-2">
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="citizenship" value="australian" 
                                        ${state.eligibilityData.citizenship === 'australian' ? 'checked' : ''} 
                                        onchange="updateEligibility('citizenship', 'australian'); render();" 
                                        class="mr-3" />
                                    <span>${t('ausC')}</span>
                                </label>
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="citizenship" value="foreign" 
                                        ${state.eligibilityData.citizenship === 'foreign' ? 'checked' : ''} 
                                        onchange="updateEligibility('citizenship', 'foreign'); render();" 
                                        class="mr-3" />
                                    <span>${t('foreignC')}</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold mb-3">${t('residencyQ')}</label>
                            <div class="space-y-2">
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="residency" value="permanent" 
                                        ${state.eligibilityData.residency === 'permanent' ? 'checked' : ''} 
                                        onchange="updateEligibility('residency', 'permanent'); render();" 
                                        class="mr-3" />
                                    <span>${t('permRes')}</span>
                                </label>
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="residency" value="temporary" 
                                        ${state.eligibilityData.residency === 'temporary' ? 'checked' : ''} 
                                        onchange="updateEligibility('residency', 'temporary'); render();" 
                                        class="mr-3" />
                                    <span>${t('tempRes')}</span>
                                </label>
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="residency" value="notResident" 
                                        ${state.eligibilityData.residency === 'notResident' ? 'checked' : ''} 
                                        onchange="updateEligibility('residency', 'notResident'); render();" 
                                        class="mr-3" />
                                    <span>${t('notRes')}</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold mb-3">${t('purposeQ')}</label>
                            <div class="space-y-2">
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="purpose" value="primary" 
                                        ${state.eligibilityData.purposeOfPurchase === 'primary' ? 'checked' : ''} 
                                        onchange="updateEligibility('purposeOfPurchase', 'primary'); render();" 
                                        class="mr-3" />
                                    <span>${t('primary')}</span>
                                </label>
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="purpose" value="investment" 
                                        ${state.eligibilityData.purposeOfPurchase === 'investment' ? 'checked' : ''} 
                                        onchange="updateEligibility('purposeOfPurchase', 'investment'); render();" 
                                        class="mr-3" />
                                    <span>${t('invest')}</span>
                                </label>
                            </div>
                        </div>

                        <button onclick="checkEligibility()" class="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2">
                            ${icons.shield('w-5 h-5')}
                            <span>${t('checkElig')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

/**
 * Render eligibility result page
 * @returns {string} HTML string for eligibility result
 */
function renderEligibilityResult() {
    const isRequired = state.isEligible && state.isEligible.required;
    
    return `
        <section class="py-20 bg-gray-50 min-h-screen">
            <div class="max-w-3xl mx-auto px-4">
                <button onclick="goToStep('eligibility')" class="text-blue-600 mb-8 flex items-center space-x-2">
                    ${icons.arrowLeft('w-5 h-5')}
                    <span>${t('back')}</span>
                </button>
                <div class="bg-white p-8 rounded-lg text-center">
                    ${isRequired ? `
                        <div class="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            ${icons.fileText('w-10 h-10 text-orange-600')}
                        </div>
                        <h2 class="text-3xl font-bold mb-4">${t('firbReq')}</h2>
                        <p class="text-lg text-gray-600 mb-4">${t('firbReqMsg')}</p>
                        ${state.isEligible?.note ? `<p class="text-sm text-gray-500 mb-8 bg-gray-50 p-4 rounded">${state.isEligible.note}</p>` : ''}
                        <button onclick="goToStep('calculator')" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 inline-flex items-center space-x-2">
                            <span>${t('proceedCalc')}</span>
                            ${icons.arrowRight()}
                        </button>
                    ` : `
                        <div class="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            ${icons.checkCircle('w-10 h-10 text-green-600')}
                        </div>
                        <h2 class="text-3xl font-bold mb-4">${t('noFirb')}</h2>
                        <p class="text-lg text-gray-600 mb-4">${t('noFirbMsg')}</p>
                        ${state.isEligible?.note ? `<p class="text-sm text-gray-500 mb-8 bg-gray-50 p-4 rounded">${state.isEligible.note}</p>` : ''}
                        <button onclick="goToStep('home')" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700">${t('returnHome')}</button>
                    `}
                </div>

                <!-- Contextual Alerts -->
                ${typeof getEligibilityAlertsHTML === 'function' ? getEligibilityAlertsHTML() : ''}
            </div>
        </section>
    `;
}

/**
 * Render calculator form for property details
 * @returns {string} HTML string for calculator form
 */
function renderCalculator() {
    return `
        <section class="py-20 bg-gray-50 min-h-screen">
            <div class="max-w-3xl mx-auto px-4">
                <button onclick="goToStep('eligibilityResult')" class="text-blue-600 mb-8 flex items-center space-x-2">
                    ${icons.arrowLeft('w-5 h-5')}
                    <span>${t('back')}</span>
                </button>
                <div class="bg-white p-8 rounded-lg">
                    <h2 class="text-3xl font-bold mb-8">${t('propCalc')}</h2>
                    <div class="space-y-6">
                        <div>
                            <label class="block font-semibold mb-2" for="property-address">
                                ${t('propAddress')}
                                <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <input type="text"
                                    id="property-address"
                                    value="${escapeHTML(state.formData.address)}"
                                    oninput="handleValidatedAddressInput(this)"
                                    onfocus="showAddressSuggestions(this)"
                                    onblur="hideAddressSuggestions()"
                                    placeholder="${t('enterAddress')}"
                                    aria-label="${t('propAddress')}"
                                    aria-required="true"
                                    aria-invalid="false"
                                    autocomplete="street-address"
                                    maxlength="200"
                                    class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                </div>
                                <!-- Address suggestions dropdown -->
                                <div id="address-suggestions" class="hidden absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <div class="p-2 text-sm text-gray-500 border-b">Common Australian address formats:</div>
                                    <div class="p-2 hover:bg-gray-50 cursor-pointer" onclick="selectAddressSuggestion('123 Main Street, Suburb, NSW 2000')">123 Main Street, Suburb, NSW 2000</div>
                                    <div class="p-2 hover:bg-gray-50 cursor-pointer" onclick="selectAddressSuggestion('456 Collins Street, Melbourne, VIC 3000')">456 Collins Street, Melbourne, VIC 3000</div>
                                    <div class="p-2 hover:bg-gray-50 cursor-pointer" onclick="selectAddressSuggestion('789 Queen Street, Brisbane, QLD 4000')">789 Queen Street, Brisbane, QLD 4000</div>
                                    <div class="p-2 hover:bg-gray-50 cursor-pointer" onclick="selectAddressSuggestion('321 King William Street, Adelaide, SA 5000')">321 King William Street, Adelaide, SA 5000</div>
                                    <div class="p-2 hover:bg-gray-50 cursor-pointer" onclick="selectAddressSuggestion('654 St Georges Terrace, Perth, WA 6000')">654 St Georges Terrace, Perth, WA 6000</div>
                                </div>
                            </div>
                            <div id="property-address-error" class="hidden text-red-600 text-sm mt-1 flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                </svg>
                                <span></span>
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold mb-2" for="property-value">
                                ${t('purchasePrice')}
                                <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                                <input type="text"
                                    id="property-value"
                                    value="${formatNumberWithCommas(state.formData.propertyValue)}"
                                    oninput="handleValidatedPropertyValueInput(this)"
                                    placeholder="850,000"
                                    aria-label="${t('purchasePrice')}"
                                    aria-required="true"
                                    aria-invalid="false"
                                    inputmode="decimal"
                                    class="w-full pl-8 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                            </div>
                            <p class="text-xs text-gray-500 mt-1">Enter amount in AUD (e.g., 850,000 or 850,000.50)</p>
                            <div id="property-value-error" class="hidden text-red-600 text-sm mt-1 flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                </svg>
                                <span></span>
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold mb-2" for="property-type">
                                ${t('propType')}
                                <span class="text-red-500">*</span>
                            </label>
                            <select id="property-type"
                                value="${state.formData.propertyType}"
                                onchange="handleValidatedSelectChange('propertyType', this.value, this); render();"
                                aria-label="${t('propType')}"
                                aria-required="true"
                                aria-invalid="false"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                <option value="">${t('selectType')}</option>
                                <option value="established" ${state.formData.propertyType === 'established' ? 'selected' : ''}>${t('established')}</option>
                                <option value="newDwelling" ${state.formData.propertyType === 'newDwelling' ? 'selected' : ''}>${t('newDwelling')}</option>
                                <option value="vacant" ${state.formData.propertyType === 'vacant' ? 'selected' : ''}>${t('vacant')}</option>
                            </select>
                            <div id="property-type-error" class="hidden text-red-600 text-sm mt-1 flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                </svg>
                                <span></span>
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold mb-2" for="property-state">
                                ${t('state')}
                                <span class="text-red-500">*</span>
                            </label>
                            <select id="property-state"
                                value="${state.formData.state}"
                                onchange="handleValidatedSelectChange('state', this.value, this); render();"
                                aria-label="${t('state')}"
                                aria-required="true"
                                aria-invalid="false"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                <option value="">${t('selectState')}</option>
                                <option value="NSW" ${state.formData.state === 'NSW' ? 'selected' : ''}>NSW</option>
                                <option value="VIC" ${state.formData.state === 'VIC' ? 'selected' : ''}>VIC</option>
                                <option value="QLD" ${state.formData.state === 'QLD' ? 'selected' : ''}>QLD</option>
                                <option value="SA" ${state.formData.state === 'SA' ? 'selected' : ''}>SA</option>
                                <option value="WA" ${state.formData.state === 'WA' ? 'selected' : ''}>WA</option>
                                <option value="TAS" ${state.formData.state === 'TAS' ? 'selected' : ''}>TAS</option>
                                <option value="ACT" ${state.formData.state === 'ACT' ? 'selected' : ''}>ACT</option>
                                <option value="NT" ${state.formData.state === 'NT' ? 'selected' : ''}>NT</option>
                            </select>
                            <div id="property-state-error" class="hidden text-red-600 text-sm mt-1 flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                </svg>
                                <span></span>
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold mb-2" for="entity-type">
                                ${t('entityType')}
                                <span class="text-red-500">*</span>
                            </label>
                            <select id="entity-type"
                                value="${state.formData.entityType}"
                                onchange="handleValidatedSelectChange('entityType', this.value, this); render();"
                                aria-label="${t('entityType')}"
                                aria-required="true"
                                aria-invalid="false"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                <option value="individual" ${state.formData.entityType === 'individual' ? 'selected' : ''}>${t('individual')}</option>
                                <option value="company" ${state.formData.entityType === 'company' ? 'selected' : ''}>${t('company')}</option>
                                <option value="trust" ${state.formData.entityType === 'trust' ? 'selected' : ''}>${t('trust')}</option>
                            </select>
                            <p class="text-xs text-gray-500 mt-1">${t('entityTypeHelp')}</p>
                        </div>

                        <div>
                            <label class="block font-semibold mb-2" for="deposit-percent">${t('depositPercent')}</label>
                            <div class="flex items-center space-x-4">
                                <div class="flex-1 relative">
                                    <input type="range"
                                        id="deposit-percent"
                                        min="10"
                                        max="100"
                                        step="5"
                                        value="${state.formData.depositPercent}"
                                        oninput="updateForm('depositPercent', this.value); document.getElementById('deposit-value').textContent = this.value + '%';"
                                        aria-label="${t('depositPercent')}"
                                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer deposit-slider" />
                                </div>
                                <span id="deposit-value" class="text-lg font-bold text-blue-600 w-16 text-right">${state.formData.depositPercent}%</span>
                            </div>
                            <div class="flex justify-between text-xs text-gray-600 mt-3 px-2 font-medium">
                                <span class="bg-gray-100 px-2 py-1 rounded">10%</span>
                                <span class="bg-gray-100 px-2 py-1 rounded">20%</span>
                                <span class="bg-gray-100 px-2 py-1 rounded">30%</span>
                                <span class="bg-gray-100 px-2 py-1 rounded">40%</span>
                                <span class="bg-gray-100 px-2 py-1 rounded">50%</span>
                                <span class="bg-gray-100 px-2 py-1 rounded">60%</span>
                                <span class="bg-gray-100 px-2 py-1 rounded">70%</span>
                                <span class="bg-gray-100 px-2 py-1 rounded">80%</span>
                                <span class="bg-gray-100 px-2 py-1 rounded">90%</span>
                                <span class="bg-gray-100 px-2 py-1 rounded">100%</span>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">${t('depositPercentHelp')}</p>
                        </div>

                        <div>
                            <label class="block font-semibold mb-2">
                                ${t('firstHome')}
                                <span class="text-red-500">*</span>
                            </label>
                            <div class="flex space-x-4" role="radiogroup" aria-label="${t('firstHome')}">
                                <label class="flex items-center px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${state.formData.firstHomeBuyer === 'yes' ? 'bg-blue-50 border-blue-500' : ''}">
                                    <input type="radio" name="firstHome" value="yes"
                                        ${state.formData.firstHomeBuyer === 'yes' ? 'checked' : ''}
                                        onchange="handleValidatedSelectChange('firstHomeBuyer', 'yes', this); render();"
                                        aria-label="Yes, first home buyer"
                                        class="mr-2 w-4 h-4" />
                                    <span class="font-medium">Yes</span>
                                </label>
                                <label class="flex items-center px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${state.formData.firstHomeBuyer === 'no' ? 'bg-blue-50 border-blue-500' : ''}">
                                    <input type="radio" name="firstHome" value="no"
                                        ${state.formData.firstHomeBuyer === 'no' ? 'checked' : ''}
                                        onchange="handleValidatedSelectChange('firstHomeBuyer', 'no', this); render();"
                                        aria-label="No, not first home buyer"
                                        class="mr-2 w-4 h-4" />
                                    <span class="font-medium">No</span>
                                </label>
                            </div>
                            <div id="first-home-buyer-error" class="hidden text-red-600 text-sm mt-1 flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                </svg>
                                <span></span>
                            </div>
                        </div>

                        <button onclick="handleValidatedCalculate()"
                            ${state.isCalculating ? 'disabled' : ''}
                            class="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all">
                            ${icons.calculator('w-5 h-5')}
                            <span>${state.isCalculating ? t('calculating') : t('calcFees')}</span>
                        </button>
                        <p class="text-xs text-gray-500 text-center mt-2">
                            <span class="text-red-500">*</span> Required fields
                        </p>
                    </div>

                    <!-- Contextual Alerts -->
                    ${typeof getCalculatorAlertsHTML === 'function' ? getCalculatorAlertsHTML() : ''}
                </div>
            </div>
        </section>
    `;
}

/**
 * Render results page with fee breakdown
 * @returns {string} HTML string for results page
 */
function renderResults() {
    if (!state.calculatedFees) return '';
    
    const fees = state.calculatedFees;
    
    return `
        <section class="py-20 bg-gray-50 min-h-screen">
            <div class="max-w-4xl mx-auto px-4">
                <button onclick="goToStep('calculator')" class="text-blue-600 mb-8 flex items-center space-x-2">
                    ${icons.arrowLeft('w-5 h-5')}
                    <span>${t('back')}</span>
                </button>
                <div class="bg-white p-8 rounded-lg">
                    <h2 class="text-3xl font-bold mb-8">${t('feeBreakdown')}</h2>
                    
                    <div class="mb-12">
                        <h3 class="text-2xl font-bold mb-6 flex items-center">
                            ${icons.globe('w-6 h-6 text-orange-600 mr-2')}
                            ${t('foreignInvestmentFees')}
                        </h3>
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
                        <h3 class="text-2xl font-bold mb-6 flex items-center">
                            ${icons.home('w-6 h-6 text-blue-600 mr-2')}
                            ${t('standardPropertyFees')}
                        </h3>
                        <p class="text-sm text-gray-600 mb-6">${t('allBuyersPay')}</p>
                        
                        <div class="space-y-3 mb-6">
                            <div class="p-4 bg-blue-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('standardStampDuty')}</span>
                                <span class="font-bold">${formatCurrency(fees.standard.stampDuty)}</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('transferFee')}</span>
                                <span class="font-bold">${formatCurrency(fees.standard.transferFee)}</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('mortgageReg')}</span>
                                <span class="font-bold">${formatCurrency(fees.standard.mortgageRegistration)}</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('legalConveyancing')}</span>
                                <span class="font-bold">${formatCurrency(fees.standard.conveyancingLegal)}</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('buildingPest')}</span>
                                <span class="font-bold">${formatCurrency(fees.standard.buildingInspection + fees.standard.pestInspection)}</span>
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
                                <span class="font-semibold">Title Search</span>
                                <span class="font-bold">${formatCurrency(fees.standard.titleSearch)}</span>
                            </div>
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

                    <div class="mb-12">
                        <h3 class="text-2xl font-bold mb-6 flex items-center">
                            ${icons.calendar('w-6 h-6 text-green-600 mr-2')}
                            ${t('annualFees')}
                        </h3>
                        <p class="text-sm text-gray-600 mb-6">${t('annualFeesDesc')}</p>

                        <div class="space-y-3 mb-6">
                            ${fees.annual.vacancyFee > 0 ? `
                                <div class="p-4 bg-green-50 rounded-lg flex justify-between">
                                    <div>
                                        <span class="font-semibold">${t('vacancyFee')}</span>
                                        <p class="text-xs text-gray-600">${t('vacancyFeeDesc')}</p>
                                    </div>
                                    <span class="font-bold">${formatCurrency(fees.annual.vacancyFee)}</span>
                                </div>
                            ` : ''}
                            <div class="p-4 bg-green-50 rounded-lg flex justify-between">
                                <div>
                                    <span class="font-semibold">${t('landTaxSurcharge')}</span>
                                    <p class="text-xs text-gray-600">${t('landTaxSurchargeDesc')}</p>
                                </div>
                                <span class="font-bold">${formatCurrency(fees.annual.landTaxSurcharge)}</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('annualCouncilRates')}</span>
                                <span class="font-bold">${formatCurrency(fees.annual.councilRates)}</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('annualWaterRates')}</span>
                                <span class="font-bold">${formatCurrency(fees.annual.waterRates)}</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg flex justify-between">
                                <span class="font-semibold">${t('annualInsurance')}</span>
                                <span class="font-bold">${formatCurrency(fees.annual.insurance)}</span>
                            </div>

                            <div class="bg-green-100 p-4 rounded-lg">
                                <div class="flex justify-between items-center">
                                    <h4 class="text-xl font-bold">${t('annualTotal')}</h4>
                                    <span class="text-2xl font-bold text-green-600">${formatCurrency(fees.annualTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="border-t-2 pt-6 mb-8">
                        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg text-white mb-4">
                            <div class="flex justify-between items-center">
                                <h3 class="text-2xl font-bold">${t('upfrontCosts')}</h3>
                                <span class="text-4xl font-bold">${formatCurrency(fees.grandTotal)}</span>
                            </div>
                            <p class="text-sm text-blue-100 mt-2">${t('upfrontCostsDesc')}</p>
                        </div>
                        <div class="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-lg text-white">
                            <div class="flex justify-between items-center">
                                <h3 class="text-2xl font-bold">${t('firstYearTotal')}</h3>
                                <span class="text-4xl font-bold">${formatCurrency(fees.firstYearTotal)}</span>
                            </div>
                            <p class="text-sm text-green-100 mt-2">${t('firstYearTotalDesc')}</p>
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
                        <button onclick="handlePayment()"
                            ${state.isProcessingPayment ? 'disabled' : ''}
                            class="bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2 ${state.isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}">
                            ${icons.dollarSign('w-5 h-5')}
                            <span>${state.isProcessingPayment ? t('processing') : t('proceedPayment')}</span>
                        </button>
                        <button onclick="downloadReport()" class="bg-gray-100 text-gray-900 px-6 py-4 rounded-lg font-semibold hover:bg-gray-200 flex items-center justify-center space-x-2">
                            ${icons.download('w-5 h-5')}
                            <span>${t('downloadReport')}</span>
                        </button>
                    </div>

                    <p class="text-sm text-gray-500 text-center">${t('estimates')}</p>
                </div>
            </div>
        </section>
    `;
}

/**
 * Render FAQ page
 * @returns {string} HTML string for FAQ page
 */
function renderFAQPage() {
    return `
        <section class="py-20 bg-gray-50 min-h-screen">
            <div class="max-w-7xl mx-auto px-4">
                <button onclick="goToStep('home')" class="text-blue-600 mb-8 flex items-center space-x-2">
                    ${icons.arrowLeft('w-5 h-5')}
                    <span>${t('back')}</span>
                </button>

                <div id="faq-container">
                    ${typeof renderFAQSection === 'function' ? renderFAQSection() : '<div class="text-center py-12">Loading FAQs...</div>'}
                </div>
            </div>

            ${typeof generateFAQSchema === 'function' ? generateFAQSchema() : ''}
        </section>
    `;
}

/**
 * Render Timeline page
 * @returns {string} HTML string for timeline page
 */
function renderTimelinePage() {
    return `
        <section class="py-20 bg-gray-50 min-h-screen">
            <div class="max-w-7xl mx-auto px-4">
                <button onclick="goToStep('home')" class="text-blue-600 mb-8 flex items-center space-x-2">
                    ${icons.arrowLeft('w-5 h-5')}
                    <span>${t('back')}</span>
                </button>

                <div id="timeline-container">
                    ${typeof renderTimelineComponent === 'function' ? renderTimelineComponent() : '<div class="text-center py-12">Loading timeline...</div>'}
                </div>
            </div>
        </section>
    `;
}

/**
 * Render footer component
 * @returns {string} HTML string for footer
 */
function renderFooter() {
    const lastUpdated = typeof getLastUpdatedString === 'function' ? getLastUpdatedString() : 'January 2025';
    const dataVersion = typeof DATA_VERSION !== 'undefined' ? DATA_VERSION.version : '2024-25';
    const needsUpdate = typeof needsReview === 'function' ? needsReview() : false;

    return `
        <footer class="footer-enhanced">
            <div class="footer-container">
                <!-- Data freshness indicator -->
                <div class="mb-8 p-4 bg-gray-800 rounded-lg border ${needsUpdate ? 'border-yellow-600' : 'border-green-600'}">
                    <div class="flex items-center justify-between flex-wrap gap-4">
                        <div class="flex items-center space-x-3">
                            ${needsUpdate
                                ? '<svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>'
                                : '<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>'
                            }
                            <div>
                                <p class="text-sm font-semibold ${needsUpdate ? 'text-yellow-500' : 'text-green-500'}">
                                    ${needsUpdate ? 'Data Review Recommended' : 'Data Current'}
                                </p>
                                <p class="text-xs text-gray-400">
                                    Financial Year ${dataVersion} • Last Updated: ${lastUpdated}
                                </p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-400">FIRB Fees • Stamp Duty • Land Tax</p>
                            <p class="text-xs text-gray-500">All rates verified from official sources</p>
                        </div>
                    </div>
                </div>

                <div class="footer-grid">
                    <div>
                        <h3 class="text-lg font-bold mb-4">FIRB Calculator</h3>
                        <p class="text-gray-400">Professional fee calculations for foreign property investors</p>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold mb-4">${t('quickLinks')}</h3>
                        <div class="space-y-3">
                            <button onclick="goToStep('home')" class="block w-full text-left text-gray-400 hover:text-white transition-colors py-1">${t('navHome')}</button>
                            <button onclick="goToStep('eligibility')" class="block w-full text-left text-gray-400 hover:text-white transition-colors py-1">${t('navCalculator')}</button>
                            <button onclick="goToStep('timeline')" class="block w-full text-left text-gray-400 hover:text-white transition-colors py-1">Timeline</button>
                            <button onclick="goToStep('faq')" class="block w-full text-left text-gray-400 hover:text-white transition-colors py-1">FAQs</button>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold mb-4">Official Sources</h3>
                        <a href="https://firb.gov.au/" target="_blank" class="block text-gray-400 hover:text-white mb-2 text-sm">FIRB.gov.au</a>
                        <a href="https://www.revenue.nsw.gov.au/" target="_blank" class="block text-gray-400 hover:text-white mb-2 text-sm">Revenue NSW</a>
                        <a href="https://www.sro.vic.gov.au/" target="_blank" class="block text-gray-400 hover:text-white mb-2 text-sm">SRO Victoria</a>
                        <a href="https://www.ato.gov.au/" target="_blank" class="block text-gray-400 hover:text-white text-sm">ATO</a>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold mb-4">${t('contact')}</h3>
                        <p class="text-gray-400 text-sm mb-4">support@firbcalculator.com.au</p>
                        <p class="text-xs text-gray-500">
                            Disclaimer: This calculator provides estimates only. Consult with qualified professionals for official advice.
                        </p>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 FIRB Calculator. All calculations are estimates based on current legislation. Always verify with official sources and consult qualified professionals.</p>
                </div>
            </div>
        </footer>
    `;
}

/**
 * Add deposit slider styles for better visibility
 */
function addDepositSliderStyles() {
    // Check if styles already added
    if (document.getElementById('deposit-slider-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'deposit-slider-styles';
    style.textContent = `
        .deposit-slider {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            cursor: pointer;
            outline: none;
            height: 8px;
        }
        
        .deposit-slider::-webkit-slider-track {
            background: #e5e7eb;
            height: 8px;
            border-radius: 4px;
            border: none;
            outline: none;
        }
        
        .deposit-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 3px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            margin-top: -8px;
            transition: all 0.2s ease;
        }
        
        .deposit-slider::-webkit-slider-thumb:hover {
            background: #2563eb;
            transform: scale(1.1);
        }
        
        .deposit-slider::-moz-range-track {
            background: #e5e7eb;
            height: 8px;
            border-radius: 4px;
            border: none;
            outline: none;
        }
        
        .deposit-slider::-moz-range-thumb {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 3px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
        }
        
        .deposit-slider::-moz-range-thumb:hover {
            background: #2563eb;
            transform: scale(1.1);
        }
        
        .deposit-slider::-ms-track {
            background: #e5e7eb;
            height: 8px;
            border-radius: 4px;
            border: none;
            outline: none;
        }
        
        .deposit-slider::-ms-thumb {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 3px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
        }
        
        .deposit-slider::-ms-thumb:hover {
            background: #2563eb;
            transform: scale(1.1);
        }
        
        /* Ensure the track is always visible */
        .deposit-slider:focus {
            outline: none;
        }
        
        .deposit-slider:focus::-webkit-slider-track {
            background: #d1d5db;
        }
        
        .deposit-slider:focus::-moz-range-track {
            background: #d1d5db;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Show address suggestions dropdown
 * @param {HTMLInputElement} input - Address input element
 */
function showAddressSuggestions(input) {
    const suggestions = document.getElementById('address-suggestions');
    if (suggestions) {
        suggestions.classList.remove('hidden');
    }
}

/**
 * Hide address suggestions dropdown
 */
function hideAddressSuggestions() {
    // Delay hiding to allow for click events
    setTimeout(() => {
        const suggestions = document.getElementById('address-suggestions');
        if (suggestions) {
            suggestions.classList.add('hidden');
        }
    }, 200);
}

/**
 * Select an address suggestion
 * @param {string} address - Selected address
 */
function selectAddressSuggestion(address) {
    const input = document.getElementById('property-address');
    if (input) {
        input.value = address;
        handleValidatedAddressInput(input);
    }
    hideAddressSuggestions();
}
