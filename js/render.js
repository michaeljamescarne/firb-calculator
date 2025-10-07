function renderHome() {
    return `
        <section class="bg-gradient-to-br from-blue-50 to-white py-20">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <h1 class="text-5xl font-bold mb-6">${t('hero')}</h1>
                <p class="text-xl text-gray-600 mb-8">${t('subtitle')}</p>
                <button onclick="goToStep('eligibility')" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 inline-flex items-center space-x-2">
                    <span>${t('cta')}</span>
                    ${icons.arrowRight()}
                </button>
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
                                    ${icon('file-text', 'w-5 h-5 text-blue-600 mr-2')}
                                    <h3 class="font-bold">FIRB Fee</h3>
                                </div>
                                <p class="text-sm text-gray-600">$1,710 to $243,400+ depending on property value</p>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow-sm">
                                <div class="flex items-center mb-2">
                                    ${icon('dollar-sign', 'w-5 h-5 text-blue-600 mr-2')}
                                    <h3 class="font-bold">Stamp Duty Surcharge</h3>
                                </div>
                                <p class="text-sm text-gray-600">Additional 7-8% of property value</p>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow-sm">
                                <div class="flex items-center mb-2">
                                    ${icon('building-2', 'w-5 h-5 text-blue-600 mr-2')}
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
                            ${icon('calculator', 'w-8 h-8 text-blue-600')}
                        </div>
                        <h3 class="text-xl font-semibold mb-2">${t('accurateCalc')}</h3>
                        <p class="text-gray-600">${t('accurateDesc')}</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            ${icon('clock', 'w-8 h-8 text-blue-600')}
                        </div>
                        <h3 class="text-xl font-semibold mb-2">${t('instantResults')}</h3>
                        <p class="text-gray-600">${t('instantDesc')}</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            ${icon('shield', 'w-8 h-8 text-blue-600')}
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
                                ${icon('file-text', 'w-5 h-5 text-orange-500 mr-2')}
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
                                ${icon('check-circle', 'w-5 h-5 text-green-500 mr-2')}
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
                        <button onclick="goToStep('eligibility')" class="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition inline-flex items-center space-x-2">
                            ${icon('shield', 'w-5 h-5')}
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
                                ${icon('check-circle', 'w-6 h-6 text-green-500 mr-3 flex-shrink-0')}
                                <span class="text-gray-700">Complete FIRB application fee calculation</span>
                            </li>
                            <li class="flex items-start">
                                ${icon('check-circle', 'w-6 h-6 text-green-500 mr-3 flex-shrink-0')}
                                <span class="text-gray-700">State-specific stamp duty surcharge analysis</span>
                            </li>
                            <li class="flex items-start">
                                ${icon('check-circle', 'w-6 h-6 text-green-500 mr-3 flex-shrink-0')}
                                <span class="text-gray-700">Detailed breakdown of all associated costs</span>
                            </li>
                            <li class="flex items-start">
                                ${icon('check-circle', 'w-6 h-6 text-green-500 mr-3 flex-shrink-0')}
                                <span class="text-gray-700">Payment timeline and methods guidance</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4">
                <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">Understanding the Fees</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-white p-8 rounded-lg shadow-sm">
                        <div class="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            ${icon('file-text', 'w-6 h-6 text-white')}
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">FIRB Application Fee</h3>
                        <p class="text-gray-600 mb-4">Paid to the Australian Government (Foreign Investment Review Board) for property purchase approval</p>
                        <p class="text-sm text-gray-500">Payment: Direct to Australian Treasury</p>
                    </div>
                    <div class="bg-white p-8 rounded-lg shadow-sm">
                        <div class="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            ${icon('dollar-sign', 'w-6 h-6 text-white')}
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Stamp Duty Surcharge</h3>
                        <p class="text-gray-600 mb-4">Additional state-based tax for foreign buyers (varies by state: 7-8% of property value)</p>
                        <p class="text-sm text-gray-500">Payment: State Revenue Office at settlement</p>
                    </div>
                    <div class="bg-white p-8 rounded-lg shadow-sm">
                        <div class="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            ${icon('globe', 'w-6 h-6 text-white')}
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
                <button onclick="goToStep('eligibility')" class="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition inline-flex items-center space-x-2">
                    <span>Start Your Calculation</span>
                    ${icons.arrowRight()}
                </button>
            </div>
        </section>
    `;
}
