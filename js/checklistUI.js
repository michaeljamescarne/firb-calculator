/**
 * Document Checklist UI Rendering
 * @file checklistUI.js
 *
 * Renders the interactive document checklist page
 */

/**
 * Render document checklist page
 */
function renderDocumentChecklistPage() {
    const { items, grouped } = generateChecklistFromState();
    const stats = getCompletionStats();

    if (items.length === 0) {
        return renderEmptyChecklistPage();
    }

    return `
        <section class="py-12 bg-gray-50 min-h-screen">
            <div class="max-w-5xl mx-auto px-4">
                <!-- Header -->
                <div class="mb-8">
                    <button onclick="goToStep('results')" class="text-blue-600 mb-4 flex items-center space-x-2 hover:text-blue-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        <span>Back to Results</span>
                    </button>

                    <div class="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div class="flex-1">
                            <h1 class="text-4xl font-bold text-gray-900 mb-2">Document Checklist</h1>
                            <p class="text-gray-600 mb-4">
                                Personalized for your ${checklistState.userScenario?.state || ''}
                                ${getPropertyTypeLabel(checklistState.userScenario?.propertyType || '')} purchase
                            </p>
                        </div>

                        <!-- Action buttons -->
                        <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
                            <button onclick="printChecklist()"
                                class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                                </svg>
                                <span>Print</span>
                            </button>
                            <button onclick="exportChecklistPDF()"
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                                <span>Export PDF</span>
                            </button>
                            <button onclick="emailChecklist()"
                                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                                <span>Email</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Progress Card -->
                ${renderProgressCard(stats)}

                <!-- Important Notice -->
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div class="flex">
                        <svg class="w-6 h-6 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-yellow-800">Important</h3>
                            <p class="mt-1 text-sm text-yellow-700">
                                This checklist is personalized based on your inputs. Requirements may vary based on your specific circumstances.
                                Always consult with a qualified conveyancer, solicitor, or migration agent.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Checklist Items by Category -->
                ${renderChecklistByCategory(grouped)}

                <!-- Professional Services Recommendation -->
                ${renderProfessionalServicesCard()}

                <!-- Reset button -->
                <div class="mt-8 text-center">
                    <button onclick="resetChecklistProgress()"
                        class="text-sm text-gray-600 hover:text-gray-900 underline">
                        Reset Progress
                    </button>
                </div>
            </div>
        </section>

        <!-- Print Stylesheet -->
        <style media="print">
            .no-print {
                display: none !important;
            }
            body {
                background: white !important;
            }
            .page-break {
                page-break-before: always;
            }
        </style>
    `;
}

/**
 * Render empty checklist page
 */
function renderEmptyChecklistPage() {
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
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                        </svg>
                    </div>

                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Generate Your Checklist</h2>
                    <p class="text-xl text-gray-600 mb-8">
                        Complete your property calculation to receive a personalized document checklist
                    </p>

                    <button onclick="startEligibilityWizard()"
                        class="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                        Start Your Calculation
                    </button>
                </div>
            </div>
        </section>
    `;
}

/**
 * Render progress card
 */
function renderProgressCard(stats) {
    const percentage = stats.percentage;
    const progressColor = percentage === 100 ? 'bg-green-500' :
                         percentage >= 50 ? 'bg-blue-500' :
                         'bg-orange-500';

    return `
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">Your Progress</h3>
                    <p class="text-sm text-gray-600">${stats.completed} of ${stats.total} items completed</p>
                </div>
                <div class="text-right">
                    <div class="text-3xl font-bold ${percentage === 100 ? 'text-green-600' : 'text-blue-600'}">
                        ${percentage}%
                    </div>
                    ${percentage === 100 ? `
                        <div class="text-sm text-green-600 font-semibold">Complete! 🎉</div>
                    ` : `
                        <div class="text-sm text-gray-600">${stats.remaining} remaining</div>
                    `}
                </div>
            </div>

            <!-- Progress bar -->
            <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="${progressColor} h-3 rounded-full transition-all duration-500"
                    style="width: ${percentage}%"></div>
            </div>

            ${checklistState.lastUpdated ? `
                <div class="mt-3 text-xs text-gray-500">
                    Last updated: ${formatRelativeDate(checklistState.lastUpdated)}
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Render checklist grouped by category
 */
function renderChecklistByCategory(grouped) {
    const categories = Object.keys(grouped);

    return categories.map(category => `
        <div class="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
            <!-- Category header -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 class="text-xl font-bold text-white flex items-center">
                    ${getCategoryIcon(category)}
                    <span class="ml-2">${category}</span>
                    <span class="ml-auto text-sm font-normal opacity-90">
                        ${grouped[category].filter(i => i.completed).length}/${grouped[category].length} complete
                    </span>
                </h2>
            </div>

            <!-- Items -->
            <div class="divide-y divide-gray-200">
                ${grouped[category].map(item => renderChecklistItem(item)).join('')}
            </div>
        </div>
    `).join('');
}

/**
 * Render individual checklist item
 */
function renderChecklistItem(item) {
    return `
        <div class="p-6 hover:bg-gray-50 transition ${item.completed ? 'bg-green-50' : ''}">
            <div class="flex items-start">
                <!-- Checkbox -->
                <div class="flex-shrink-0 mt-1">
                    <button onclick="toggleChecklistItem('${item.id}')"
                        class="w-6 h-6 border-2 rounded ${item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-blue-500'}
                            flex items-center justify-center transition cursor-pointer">
                        ${item.completed ? `
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                            </svg>
                        ` : ''}
                    </button>
                </div>

                <!-- Content -->
                <div class="ml-4 flex-1">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold text-gray-900 ${item.completed ? 'line-through text-gray-500' : ''}">
                                ${item.title}
                            </h3>
                            <p class="text-sm text-gray-600 mt-1">${item.description}</p>

                            <!-- Tooltip -->
                            ${item.tooltip ? `
                                <div class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        <p class="ml-2 text-sm text-blue-900">${item.tooltip}</p>
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Link -->
                            ${item.link ? `
                                <div class="mt-3">
                                    <a href="${item.link}" target="_blank" rel="noopener noreferrer"
                                        class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                        </svg>
                                        <span>Get this document</span>
                                    </a>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Completed badge -->
                        ${item.completed ? `
                            <div class="ml-4">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                    </svg>
                                    Done
                                </span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get category icon
 */
function getCategoryIcon(category) {
    const icons = {
        'FIRB Application': `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>`,
        'State-Specific': `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>`,
        'Post-Approval': `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`,
        'Financial': `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`,
        'Professional Services': `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>`
    };

    return icons[category] || '';
}

/**
 * Render professional services recommendation card
 */
function renderProfessionalServicesCard() {
    return `
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mt-6">
            <h3 class="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <svg class="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                Recommended Professional Services
            </h3>

            <p class="text-gray-700 mb-4">
                We strongly recommend engaging these professionals to assist with your purchase:
            </p>

            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white rounded-lg p-4 border border-purple-200">
                    <div class="font-semibold text-gray-900 mb-2">Conveyancer / Solicitor</div>
                    <p class="text-sm text-gray-600 mb-3">
                        Essential for contract review, settlement, and legal compliance
                    </p>
                    <a href="https://www.lawsociety.com.au/find-a-lawyer" target="_blank" rel="noopener noreferrer"
                        class="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        Find a conveyancer →
                    </a>
                </div>

                <div class="bg-white rounded-lg p-4 border border-purple-200">
                    <div class="font-semibold text-gray-900 mb-2">Migration Agent (if applicable)</div>
                    <p class="text-sm text-gray-600 mb-3">
                        For visa and residency status clarification
                    </p>
                    <a href="https://www.mara.gov.au/search-the-register-of-migration-agents" target="_blank" rel="noopener noreferrer"
                        class="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        Find a migration agent →
                    </a>
                </div>

                <div class="bg-white rounded-lg p-4 border border-purple-200">
                    <div class="font-semibold text-gray-900 mb-2">Accountant</div>
                    <p class="text-sm text-gray-600 mb-3">
                        For tax implications and financial planning
                    </p>
                    <a href="https://www.cpaaustralia.com.au/find-a-cpa" target="_blank" rel="noopener noreferrer"
                        class="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        Find an accountant →
                    </a>
                </div>

                <div class="bg-white rounded-lg p-4 border border-purple-200">
                    <div class="font-semibold text-gray-900 mb-2">Building Inspector</div>
                    <p class="text-sm text-gray-600 mb-3">
                        For property condition assessment (established properties)
                    </p>
                    <a href="https://www.mbav.com.au/" target="_blank" rel="noopener noreferrer"
                        class="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        Find an inspector →
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderDocumentChecklistPage
    };
}
