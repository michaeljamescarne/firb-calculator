// FAQ System with Search, Filtering, Analytics, and SEO
// =========================================================

// State management
let faqData = null;
let faqState = {
    searchQuery: '',
    selectedCategory: 'all',
    expandedQuestions: new Set(),
    questionAnalytics: {}, // Track views and feedback
    sortBy: 'popular' // 'popular', 'recent', 'alphabetical'
};

// Load FAQ data from JSON
async function loadFAQData() {
    try {
        const response = await fetch('data/faq.json');
        faqData = await response.json();

        // Load analytics from localStorage
        const stored = localStorage.getItem('firb_faq_analytics');
        if (stored) {
            faqState.questionAnalytics = JSON.parse(stored);
        }

        return faqData;
    } catch (error) {
        console.error('Failed to load FAQ data:', error);
        return null;
    }
}

// Initialize FAQ system
async function initFAQSystem() {
    await loadFAQData();

    // Set up event delegation for FAQ interactions
    document.addEventListener('click', handleFAQClick);
}

// Save analytics to localStorage
function saveAnalytics() {
    try {
        localStorage.setItem('firb_faq_analytics', JSON.stringify(faqState.questionAnalytics));
    } catch (error) {
        console.error('Failed to save analytics:', error);
    }
}

// Track question view
function trackQuestionView(questionId) {
    if (!faqState.questionAnalytics[questionId]) {
        faqState.questionAnalytics[questionId] = {
            views: 0,
            helpful: 0,
            notHelpful: 0,
            lastViewed: null
        };
    }

    faqState.questionAnalytics[questionId].views++;
    faqState.questionAnalytics[questionId].lastViewed = Date.now();
    saveAnalytics();
}

// Track feedback
function trackFeedback(questionId, helpful) {
    if (!faqState.questionAnalytics[questionId]) {
        faqState.questionAnalytics[questionId] = {
            views: 0,
            helpful: 0,
            notHelpful: 0,
            lastViewed: null
        };
    }

    if (helpful) {
        faqState.questionAnalytics[questionId].helpful++;
    } else {
        faqState.questionAnalytics[questionId].notHelpful++;
    }

    saveAnalytics();
}

// Get question analytics
function getQuestionAnalytics(questionId) {
    const defaultAnalytics = { views: 0, helpful: 0, notHelpful: 0 };
    return faqState.questionAnalytics[questionId] || defaultAnalytics;
}

// Toggle question expanded state
function toggleQuestion(questionId) {
    if (faqState.expandedQuestions.has(questionId)) {
        faqState.expandedQuestions.delete(questionId);
    } else {
        faqState.expandedQuestions.add(questionId);
        trackQuestionView(questionId);
    }
    renderFAQSection();
}

// Handle feedback
function handleFeedback(questionId, helpful) {
    trackFeedback(questionId, helpful);

    // Show thank you message
    showNotification(
        helpful ? 'Thank you for your feedback!' : 'We\'ll work on improving this answer.',
        'success'
    );

    // Update the UI to show feedback was recorded
    const feedbackBtn = document.getElementById(`feedback-${questionId}`);
    if (feedbackBtn) {
        feedbackBtn.innerHTML = `
            <span class="text-green-600 text-sm font-medium">
                ✓ Thank you for your feedback
            </span>
        `;
    }
}

// Navigate to calculator with scenario
function navigateToCalculatorScenario(scenario) {
    if (scenario) {
        // Pre-fill calculator with scenario data
        if (scenario.propertyType) {
            state.formData.propertyType = scenario.propertyType;
        }
        if (scenario.entityType) {
            state.formData.entityType = scenario.entityType;
        }

        // Navigate to calculator
        if (scenario.action === 'calculate') {
            navigateToStep('calculator');
        } else if (scenario.action === 'map') {
            navigateToStep('home');
            // Scroll to map section
            setTimeout(() => {
                const mapSection = document.querySelector('.australia-map-section');
                if (mapSection) {
                    mapSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }

        showNotification('Calculator pre-filled with scenario details', 'success');
    }
}

// Filter questions based on search and category
function filterQuestions() {
    if (!faqData) return [];

    let allQuestions = [];

    // Collect all questions from all categories
    faqData.categories.forEach(category => {
        category.questions.forEach(question => {
            allQuestions.push({
                ...question,
                categoryId: category.id,
                categoryName: category.name,
                categoryIcon: category.icon
            });
        });
    });

    // Filter by category
    if (faqState.selectedCategory !== 'all') {
        allQuestions = allQuestions.filter(q => q.categoryId === faqState.selectedCategory);
    }

    // Filter by search query
    if (faqState.searchQuery.trim()) {
        const query = faqState.searchQuery.toLowerCase();
        allQuestions = allQuestions.filter(q => {
            return q.question.toLowerCase().includes(query) ||
                   q.answer.toLowerCase().includes(query) ||
                   q.keywords.some(k => k.toLowerCase().includes(query));
        });
    }

    // Sort questions
    allQuestions.sort((a, b) => {
        if (faqState.sortBy === 'popular') {
            // Sort by combined score: popular flag + views
            const scoreA = (a.popular ? 10000 : 0) + (getQuestionAnalytics(a.id).views * 10);
            const scoreB = (b.popular ? 10000 : 0) + (getQuestionAnalytics(b.id).views * 10);
            return scoreB - scoreA;
        } else if (faqState.sortBy === 'alphabetical') {
            return a.question.localeCompare(b.question);
        } else if (faqState.sortBy === 'recent') {
            const timeA = getQuestionAnalytics(a.id).lastViewed || 0;
            const timeB = getQuestionAnalytics(b.id).lastViewed || 0;
            return timeB - timeA;
        }
        return 0;
    });

    return allQuestions;
}

// Get related questions
function getRelatedQuestions(questionId, currentQuestion) {
    if (!currentQuestion.relatedQuestions || currentQuestion.relatedQuestions.length === 0) {
        return [];
    }

    const related = [];

    faqData.categories.forEach(category => {
        category.questions.forEach(question => {
            if (currentQuestion.relatedQuestions.includes(question.id)) {
                related.push({
                    ...question,
                    categoryName: category.name
                });
            }
        });
    });

    return related;
}

// Render single FAQ item
function renderFAQItem(question) {
    const isExpanded = faqState.expandedQuestions.has(question.id);
    const analytics = getQuestionAnalytics(question.id);
    const relatedQuestions = getRelatedQuestions(question.id, question);

    return `
        <div class="faq-item border-b border-gray-200 last:border-b-0" data-question-id="${question.id}">
            <button
                onclick="toggleQuestion('${question.id}')"
                class="w-full flex items-start justify-between py-6 text-left hover:bg-gray-50 transition-colors px-6 -mx-6"
                aria-expanded="${isExpanded}"
            >
                <div class="flex-1 pr-4">
                    <div class="flex items-center gap-3 mb-1">
                        ${question.popular ? `
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                ⭐ Popular
                            </span>
                        ` : ''}
                        <span class="text-xs text-gray-500">
                            ${analytics.views > 0 ? `${analytics.views} views` : ''}
                        </span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900">
                        ${question.question}
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">
                        ${question.categoryName}
                    </p>
                </div>
                <div class="flex-shrink-0 ml-4">
                    <svg
                        class="w-6 h-6 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </div>
            </button>

            ${isExpanded ? `
                <div class="pb-6 px-6 -mx-6 animate-fadeIn">
                    <div class="prose prose-blue max-w-none">
                        <p class="text-gray-700 leading-relaxed">
                            ${question.answer}
                        </p>
                    </div>

                    ${question.officialSources && question.officialSources.length > 0 ? `
                        <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                            <h4 class="text-sm font-semibold text-blue-900 mb-2">
                                📚 Official Sources
                            </h4>
                            <ul class="space-y-1">
                                ${question.officialSources.map(source => `
                                    <li>
                                        <a
                                            href="${source.url}"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                                        >
                                            ${source.title}
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                            </svg>
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${question.calculatorScenario ? `
                        <div class="mt-4">
                            <button
                                onclick='navigateToCalculatorScenario(${JSON.stringify(question.calculatorScenario)})'
                                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                </svg>
                                Calculate this scenario
                            </button>
                        </div>
                    ` : ''}

                    ${relatedQuestions.length > 0 ? `
                        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 class="text-sm font-semibold text-gray-900 mb-3">
                                🔗 Related Questions
                            </h4>
                            <ul class="space-y-2">
                                ${relatedQuestions.slice(0, 3).map(related => `
                                    <li>
                                        <button
                                            onclick="toggleQuestion('${related.id}')"
                                            class="text-sm text-blue-600 hover:text-blue-800 hover:underline text-left"
                                        >
                                            ${related.question}
                                        </button>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    <div class="mt-6 pt-6 border-t border-gray-200">
                        <div id="feedback-${question.id}">
                            <p class="text-sm text-gray-700 mb-3">Was this helpful?</p>
                            <div class="flex gap-3">
                                <button
                                    onclick="handleFeedback('${question.id}', true)"
                                    class="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                >
                                    👍 Yes
                                </button>
                                <button
                                    onclick="handleFeedback('${question.id}', false)"
                                    class="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                >
                                    👎 No
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Render FAQ section (main component)
function renderFAQSection() {
    if (!faqData) {
        return '<div class="text-center py-8 text-gray-500">Loading FAQs...</div>';
    }

    const filteredQuestions = filterQuestions();
    const totalQuestions = faqData.metadata.totalQuestions;

    return `
        <div class="faq-section">
            <!-- Header -->
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gray-900 mb-4">
                    Frequently Asked Questions
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Everything you need to know about FIRB, foreign property investment, and compliance requirements in Australia.
                </p>
            </div>

            <!-- Search and Filters -->
            <div class="mb-8 space-y-4">
                <!-- Search Bar -->
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="faq-search"
                        placeholder="Search questions, answers, or keywords..."
                        value="${faqState.searchQuery}"
                        onkeyup="handleFAQSearch(event)"
                        class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                    ${faqState.searchQuery ? `
                        <button
                            onclick="clearFAQSearch()"
                            class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    ` : ''}
                </div>

                <!-- Category Filters -->
                <div class="flex flex-wrap gap-2">
                    <button
                        onclick="setFAQCategory('all')"
                        class="px-4 py-2 rounded-lg font-medium transition-colors ${
                            faqState.selectedCategory === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }"
                    >
                        All (${totalQuestions})
                    </button>
                    ${faqData.categories.map(category => `
                        <button
                            onclick="setFAQCategory('${category.id}')"
                            class="px-4 py-2 rounded-lg font-medium transition-colors ${
                                faqState.selectedCategory === category.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }"
                        >
                            ${category.name} (${category.questions.length})
                        </button>
                    `).join('')}
                </div>

                <!-- Sort Options -->
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600">
                        ${filteredQuestions.length} ${filteredQuestions.length === 1 ? 'question' : 'questions'} found
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-600">Sort by:</span>
                        <select
                            id="faq-sort"
                            onchange="setFAQSort(event.target.value)"
                            class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="popular" ${faqState.sortBy === 'popular' ? 'selected' : ''}>Most Popular</option>
                            <option value="alphabetical" ${faqState.sortBy === 'alphabetical' ? 'selected' : ''}>Alphabetical</option>
                            <option value="recent" ${faqState.sortBy === 'recent' ? 'selected' : ''}>Recently Viewed</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Jump to Category Navigation (when showing all) -->
            ${faqState.selectedCategory === 'all' && !faqState.searchQuery ? `
                <div class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Jump to Category:</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        ${faqData.categories.map(category => `
                            <a
                                href="#category-${category.id}"
                                class="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                            >
                                <div class="flex-shrink-0">
                                    ${renderIcon(category.icon, 'w-6 h-6 text-blue-600')}
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900">${category.name}</div>
                                    <div class="text-sm text-gray-500">${category.questions.length} questions</div>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- FAQ Items -->
            <div class="bg-white rounded-xl shadow-md">
                ${filteredQuestions.length > 0 ? `
                    ${faqState.selectedCategory === 'all' && !faqState.searchQuery ?
                        // Group by category when showing all
                        faqData.categories.map(category => {
                            const categoryQuestions = filteredQuestions.filter(q => q.categoryId === category.id);
                            if (categoryQuestions.length === 0) return '';

                            return `
                                <div id="category-${category.id}" class="border-b border-gray-200 last:border-b-0">
                                    <div class="p-6 bg-gray-50">
                                        <div class="flex items-center gap-3">
                                            ${renderIcon(category.icon, 'w-6 h-6 text-blue-600')}
                                            <h3 class="text-xl font-bold text-gray-900">${category.name}</h3>
                                            <span class="text-sm text-gray-500">(${categoryQuestions.length})</span>
                                        </div>
                                    </div>
                                    <div class="divide-y divide-gray-200">
                                        ${categoryQuestions.map(q => renderFAQItem(q)).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')
                    :
                        // Show flat list when filtering
                        filteredQuestions.map(q => renderFAQItem(q)).join('')
                    }
                ` : `
                    <div class="p-12 text-center">
                        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                        <p class="text-gray-600 mb-4">
                            Try adjusting your search or filter to find what you're looking for.
                        </p>
                        <button
                            onclick="clearFAQSearch(); setFAQCategory('all')"
                            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                `}
            </div>

            <!-- Still have questions? -->
            <div class="mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white text-center">
                <h3 class="text-2xl font-bold mb-3">Still have questions?</h3>
                <p class="text-blue-100 mb-6 max-w-2xl mx-auto">
                    Can't find the answer you're looking for? Use our calculator to get personalized cost estimates or contact a FIRB specialist.
                </p>
                <div class="flex flex-wrap gap-4 justify-center">
                    <button
                        onclick="navigateToStep('calculator')"
                        class="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                    >
                        Try the Calculator
                    </button>
                    <a
                        href="https://firb.gov.au/contact-us"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-semibold inline-flex items-center gap-2"
                    >
                        Contact FIRB
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Generate Schema.org FAQPage markup for SEO
function generateFAQSchema() {
    if (!faqData) return '';

    const allQuestions = [];
    faqData.categories.forEach(category => {
        category.questions.forEach(question => {
            allQuestions.push(question);
        });
    });

    const schemaQuestions = allQuestions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer
        }
    }));

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": schemaQuestions
    };

    return `
        <script type="application/ld+json">
        ${JSON.stringify(schema, null, 2)}
        </script>
    `;
}

// Event handlers
function handleFAQClick(event) {
    // Handled by inline onclick handlers
}

function handleFAQSearch(event) {
    faqState.searchQuery = event.target.value;
    renderFAQSection();
    updateFAQDisplay();
}

function clearFAQSearch() {
    faqState.searchQuery = '';
    document.getElementById('faq-search').value = '';
    renderFAQSection();
    updateFAQDisplay();
}

function setFAQCategory(categoryId) {
    faqState.selectedCategory = categoryId;
    renderFAQSection();
    updateFAQDisplay();
}

function setFAQSort(sortBy) {
    faqState.sortBy = sortBy;
    renderFAQSection();
    updateFAQDisplay();
}

function updateFAQDisplay() {
    const container = document.getElementById('faq-container');
    if (container) {
        container.innerHTML = renderFAQSection();
    }
}

// Render popular questions for home page
function renderPopularFAQs(limit = 6) {
    if (!faqData) return '';

    const allQuestions = [];
    faqData.categories.forEach(category => {
        category.questions.forEach(question => {
            if (question.popular) {
                allQuestions.push({
                    ...question,
                    categoryName: category.name,
                    categoryIcon: category.icon
                });
            }
        });
    });

    // Sort by views
    allQuestions.sort((a, b) => (b.views || 0) - (a.views || 0));

    const topQuestions = allQuestions.slice(0, limit);

    return `
        <div class="popular-faqs">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">
                    Popular Questions
                </h2>
                <p class="text-lg text-gray-600">
                    Quick answers to the most common questions about FIRB and foreign property investment
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                ${topQuestions.map(q => `
                    <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div class="flex items-start gap-3 mb-3">
                            ${renderIcon(q.categoryIcon, 'w-5 h-5 text-blue-600 flex-shrink-0 mt-1')}
                            <h3 class="font-semibold text-gray-900 leading-tight">
                                ${q.question}
                            </h3>
                        </div>
                        <p class="text-sm text-gray-600 mb-4 line-clamp-3">
                            ${q.answer.substring(0, 150)}...
                        </p>
                        <button
                            onclick="navigateToStep('faq'); setTimeout(() => toggleQuestion('${q.id}'), 100);"
                            class="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                        >
                            Read more
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>
                `).join('')}
            </div>

            <div class="text-center">
                <button
                    onclick="navigateToStep('faq')"
                    class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                    View All FAQs
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// Helper function to render Lucide icons (simple version)
function renderIcon(iconName, classes = '') {
    const icons = {
        'FileText': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
        'UserCheck': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
        'DollarSign': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
        'AlertTriangle': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
        'Home': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
        'HelpCircle': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    };

    return icons[iconName] || '';
}
