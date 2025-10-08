// FIRB Journey Timeline System
// =========================================

// Timeline data structure
const firbJourneySteps = [
    {
        id: 'step-1',
        number: 1,
        title: 'Determine Eligibility',
        duration: '1-2 days',
        estimatedDays: 2,
        icon: 'UserCheck',
        color: 'blue',
        description: 'Understand if you need FIRB approval and what type of property you can purchase',
        keyActions: [
            'Check your visa status and residency type',
            'Understand property type restrictions (established vs new)',
            'Review foreign investment rules for your situation',
            'Use our eligibility checker to confirm requirements'
        ],
        documentsNeeded: [
            'Valid passport',
            'Current visa grant notice',
            'Proof of residency status (if applicable)'
        ],
        commonPitfalls: [
            'Assuming all visa types have the same property restrictions',
            'Not checking if you\'re considered a "foreign person"',
            'Confusing temporary and permanent resident rules',
            'Overlooking state-specific surcharges and conditions'
        ],
        tips: [
            'Start early - understanding eligibility prevents costly mistakes',
            'Temporary residents can only buy one established property to live in',
            'New properties and vacant land have fewer restrictions'
        ],
        costRange: null,
        mandatory: true
    },
    {
        id: 'step-2',
        number: 2,
        title: 'Find Property',
        duration: '2-12 weeks',
        estimatedDays: 42,
        icon: 'Home',
        color: 'green',
        description: 'Search for suitable property that meets FIRB requirements and your budget',
        keyActions: [
            'Engage a buyer\'s agent (optional but recommended)',
            'Research suburbs and property values',
            'Inspect properties that meet FIRB eligibility criteria',
            'Calculate total costs including FIRB fees and surcharges',
            'Arrange finance pre-approval with your lender'
        ],
        documentsNeeded: [
            'Proof of funds or finance pre-approval',
            'Identification documents',
            'Employment verification (for loans)',
            'Bank statements (for loan application)'
        ],
        commonPitfalls: [
            'Not factoring in stamp duty surcharge (7-8% extra)',
            'Choosing established property when only eligible for new',
            'Underestimating total upfront costs',
            'Not getting finance pre-approval before property hunting',
            'Missing auction deadlines due to FIRB timing'
        ],
        tips: [
            'Use our calculator to estimate total costs before committing',
            'Consider states with lower surcharges (NT, ACT)',
            'Get finance pre-approval to strengthen your negotiating position',
            'Factor in ongoing costs like land tax surcharge'
        ],
        costRange: 'Variable (property dependent)',
        mandatory: true
    },
    {
        id: 'step-3',
        number: 3,
        title: 'Apply for FIRB Approval',
        duration: '30 days (standard) or 10 days (expedited)',
        estimatedDays: 30,
        icon: 'FileText',
        color: 'orange',
        description: 'Submit your FIRB application and pay the required fee',
        keyActions: [
            'Create account on FIRB online portal',
            'Complete application form with property details',
            'Upload all required supporting documents',
            'Pay FIRB application fee (non-refundable)',
            'Submit application and note reference number',
            'Track application status via portal'
        ],
        documentsNeeded: [
            'Passport (certified copy)',
            'Visa grant notice',
            'Property details (address, price, type)',
            'Contract of sale (if available)',
            'Proof of funds or finance approval',
            'Australian residential address (or overseas address)'
        ],
        commonPitfalls: [
            'Applying too late (should apply before signing contract)',
            'Incomplete application causing delays',
            'Incorrect property information',
            'Not keeping FIRB reference number',
            'Assuming fees are refundable if denied',
            'Missing the 30-day processing timeframe in settlement timing'
        ],
        tips: [
            'Apply as soon as you find a property of interest',
            'Include "subject to FIRB approval" in any contract',
            'Expedited processing available for additional fee if urgent',
            'Keep all correspondence and reference numbers',
            'FIRB approval typically valid for 12 months'
        ],
        costRange: '$13,200 - $243,400+',
        mandatory: true,
        calculator: true
    },
    {
        id: 'step-4',
        number: 4,
        title: 'Receive FIRB Approval',
        duration: '1 day',
        estimatedDays: 1,
        icon: 'CheckCircle',
        color: 'green',
        description: 'Receive "no objection" notification from FIRB',
        keyActions: [
            'Download approval certificate from FIRB portal',
            'Read all conditions attached to approval carefully',
            'Note approval expiry date (usually 12 months)',
            'Provide copy to your solicitor/conveyancer',
            'Provide copy to your lender (if applicable)',
            'Store safely for settlement and future compliance'
        ],
        documentsNeeded: [
            'FIRB approval certificate (no objection notification)'
        ],
        commonPitfalls: [
            'Not reading approval conditions thoroughly',
            'Missing approval expiry date',
            'Losing approval documentation',
            'Not informing solicitor/lender immediately',
            'Misunderstanding conditions (e.g., must occupy if temporary resident)'
        ],
        tips: [
            'Print multiple copies and store digitally',
            'Highlight key conditions and expiry date',
            'If conditions are unclear, seek legal advice',
            'Approval is property-specific - can\'t be transferred'
        ],
        costRange: null,
        mandatory: true
    },
    {
        id: 'step-5',
        number: 5,
        title: 'Make Offer',
        duration: '1-7 days',
        estimatedDays: 3,
        icon: 'TrendingUp',
        color: 'purple',
        description: 'Negotiate and make an offer on the property',
        keyActions: [
            'Decide on offer price based on market research',
            'Engage solicitor/conveyancer to review contract',
            'Include "subject to FIRB approval" clause (if not yet approved)',
            'Include finance clause if applicable',
            'Include building/pest inspection clause',
            'Negotiate terms with vendor',
            'Be prepared to pay holding deposit'
        ],
        documentsNeeded: [
            'FIRB approval certificate',
            'Finance pre-approval letter',
            'Deposit funds (typically 10% of purchase price)',
            'Identification documents'
        ],
        commonPitfalls: [
            'Making unconditional offer without FIRB approval',
            'Not including inspection clauses',
            'Insufficient cooling-off period',
            'Not getting legal advice on contract terms',
            'Overpaying due to emotional decision-making',
            'Not having deposit funds readily available'
        ],
        tips: [
            'Always include FIRB approval condition if not yet received',
            'Get independent legal advice before signing',
            'Don\'t waive important conditions in competitive market',
            'Keep emotions in check during negotiations'
        ],
        costRange: null,
        mandatory: true
    },
    {
        id: 'step-6',
        number: 6,
        title: 'Exchange Contracts',
        duration: '1-3 days',
        estimatedDays: 2,
        icon: 'FileSignature',
        color: 'indigo',
        description: 'Sign contracts and pay deposit to formalize the purchase',
        keyActions: [
            'Review final contract with your solicitor',
            'Sign contract of sale',
            'Pay deposit (usually 10% of purchase price)',
            'Receive signed contract from vendor',
            'Note settlement date (typically 30-90 days from exchange)',
            'Begin loan application process (if not completed)',
            'Arrange building/pest inspections if conditional'
        ],
        documentsNeeded: [
            'Signed contract of sale',
            'Deposit payment receipt',
            'FIRB approval certificate',
            'Solicitor/conveyancer engagement letter',
            'Finance approval (or in progress)'
        ],
        commonPitfalls: [
            'Not reading fine print before signing',
            'Missing cooling-off period deadlines',
            'Deposit funds not cleared in time',
            'Not understanding settlement timeline',
            'Forgetting to notify lender of contract exchange',
            'Missing inspection deadlines if conditional'
        ],
        tips: [
            'Never sign without legal advice',
            'Ensure deposit funds are cleared before settlement deadline',
            'Keep all contract documentation safe',
            'Set reminders for all important dates',
            'Typical settlement period is 6-12 weeks'
        ],
        costRange: '10% deposit + legal fees ($1,500-$3,000)',
        mandatory: true
    },
    {
        id: 'step-7',
        number: 7,
        title: 'Settlement',
        duration: '1-2 days',
        estimatedDays: 1,
        icon: 'Key',
        color: 'yellow',
        description: 'Complete the purchase and receive property ownership',
        keyActions: [
            'Final loan approval and funds release from lender',
            'Pay stamp duty and stamp duty surcharge to state revenue',
            'Pay balance of purchase price',
            'Pay solicitor/conveyancer fees',
            'Transfer of title completed',
            'Receive keys to property',
            'Notify FIRB of settlement within 30 days',
            'Set up utilities and insurance'
        ],
        documentsNeeded: [
            'Final loan approval documents',
            'Stamp duty payment receipt',
            'Transfer of title documents',
            'Final settlement statement',
            'Property insurance policy'
        ],
        commonPitfalls: [
            'Insufficient funds for stamp duty surcharge (7-8% extra)',
            'Missing stamp duty payment deadline (30-90 days)',
            'Not notifying FIRB of settlement (30-day deadline)',
            'No insurance coverage from settlement day',
            'Forgetting to set up utilities before moving in',
            'Not doing final inspection before settlement'
        ],
        tips: [
            'Do final walk-through inspection on settlement day',
            'Have all funds ready 2-3 days before settlement',
            'Arrange property insurance to start on settlement date',
            'Keep all receipts and settlement documents',
            'Foreign buyers must notify FIRB within 30 days of settlement'
        ],
        costRange: 'Balance + stamp duty surcharge + fees',
        mandatory: true,
        calculator: true
    },
    {
        id: 'step-8',
        number: 8,
        title: 'Annual Compliance',
        duration: 'Ongoing (every year)',
        estimatedDays: 365,
        icon: 'Calendar',
        color: 'red',
        description: 'Meet ongoing FIRB obligations and compliance requirements',
        keyActions: [
            'Submit annual vacancy fee return to ATO by June 30',
            'Pay vacancy fee if property vacant >183 days',
            'Pay annual land tax surcharge (if applicable)',
            'Maintain proof of occupancy or rental',
            'Keep property insurance current',
            'If temporary resident: sell within 3 months of visa expiry',
            'Notify FIRB if selling property',
            'Maintain compliance with all FIRB approval conditions'
        ],
        documentsNeeded: [
            'Proof of occupancy (utility bills, tenancy agreements)',
            'Rental income records',
            'Property management reports',
            'Land tax assessment notices',
            'Vacancy fee returns (ATO)'
        ],
        commonPitfalls: [
            'Missing annual vacancy fee return deadline (automatic fee applies)',
            'Insufficient proof of occupancy (must be 183+ days)',
            'Not understanding land tax surcharge is annual',
            'Forgetting to sell when visa expires (temporary residents)',
            'Not notifying FIRB when disposing of property',
            'Claiming property is rented when not genuinely marketed'
        ],
        tips: [
            'Set annual calendar reminders for June 30 vacancy fee return',
            'Keep detailed records of occupancy/rental (utilities, tenants)',
            'Budget for ongoing land tax surcharge (0.5-4% annually)',
            'If temporary resident becomes PR, conditions cease',
            'Vacancy fee equals original FIRB application fee (annually)',
            'Genuine rental means advertised at market rates'
        ],
        costRange: 'Land tax surcharge + vacancy fee (if vacant)',
        mandatory: true,
        ongoing: true,
        calculator: true
    }
];

// Timeline state
let timelineState = {
    completedSteps: new Set(),
    currentStep: 'step-1',
    userDates: {}, // { 'step-1': '2025-01-15', ... }
    personalized: false,
    userInputs: null // Will be populated from calculator
};

// Initialize timeline system
function initTimelineSystem() {
    // Load progress from localStorage
    const savedProgress = loadFromStorage('firb_timeline_progress');
    if (savedProgress) {
        timelineState.completedSteps = new Set(savedProgress.completedSteps || []);
        timelineState.currentStep = savedProgress.currentStep || 'step-1';
        timelineState.userDates = savedProgress.userDates || {};
    }
}

// Save timeline progress
function saveTimelineProgress() {
    const progressData = {
        completedSteps: Array.from(timelineState.completedSteps),
        currentStep: timelineState.currentStep,
        userDates: timelineState.userDates,
        lastUpdated: Date.now()
    };
    saveToStorage('firb_timeline_progress', progressData);
}

// Toggle step completion
function toggleStepComplete(stepId) {
    if (timelineState.completedSteps.has(stepId)) {
        timelineState.completedSteps.delete(stepId);
    } else {
        timelineState.completedSteps.add(stepId);

        // Show celebration if this completes the journey
        if (timelineState.completedSteps.size === firbJourneySteps.length) {
            showCelebration();
        } else {
            // Show success animation for individual step
            showStepCompletionAnimation(stepId);
        }
    }

    saveTimelineProgress();
    renderTimelineDisplay();
}

// Set current step
function setCurrentStep(stepId) {
    timelineState.currentStep = stepId;
    saveTimelineProgress();
    renderTimelineDisplay();
}

// Celebration animation when all steps complete
function showCelebration() {
    showNotification('🎉 Congratulations! You\'ve completed your FIRB journey!', 'success');

    // Create confetti effect
    const celebration = document.createElement('div');
    celebration.className = 'fixed inset-0 pointer-events-none z-50';
    celebration.innerHTML = `
        <div class="celebration-confetti">
            ${'🎉'.repeat(50).split('').map((emoji, i) =>
                `<div class="confetti-piece" style="left: ${Math.random() * 100}%; animation-delay: ${Math.random() * 2}s;">${emoji}</div>`
            ).join('')}
        </div>
    `;
    document.body.appendChild(celebration);

    // Add confetti styles
    if (!document.getElementById('celebration-styles')) {
        const style = document.createElement('style');
        style.id = 'celebration-styles';
        style.textContent = `
            .confetti-piece {
                position: absolute;
                top: -10%;
                font-size: 2rem;
                animation: confetti-fall 3s linear forwards;
            }
            @keyframes confetti-fall {
                to {
                    transform: translateY(110vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove after animation
    setTimeout(() => {
        celebration.remove();
    }, 3000);
}

// Step completion animation
function showStepCompletionAnimation(stepId) {
    const stepElement = document.querySelector(`[data-step-id="${stepId}"]`);
    if (stepElement) {
        stepElement.classList.add('step-complete-animation');
        setTimeout(() => {
            stepElement.classList.remove('step-complete-animation');
        }, 1000);
    }
}

// Calculate personalized timeline based on user inputs
function calculatePersonalizedTimeline(userInputs) {
    timelineState.personalized = true;
    timelineState.userInputs = userInputs;

    const today = new Date();
    let currentDate = new Date(today);

    // Calculate dates for each step
    firbJourneySteps.forEach(step => {
        timelineState.userDates[step.id] = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + step.estimatedDays);
    });

    saveTimelineProgress();
}

// Generate ICS calendar file for a step
function addStepToCalendar(stepId) {
    const step = firbJourneySteps.find(s => s.id === stepId);
    if (!step) return;

    const stepDate = timelineState.userDates[stepId] || new Date();
    const endDate = new Date(stepDate);
    endDate.setDate(endDate.getDate() + step.estimatedDays);

    // Format dates for ICS (YYYYMMDDTHHMMSS)
    const formatICSDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//FIRB Calculator//Timeline//EN',
        'BEGIN:VEVENT',
        `UID:${stepId}@firbcalculator.com.au`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(stepDate)}`,
        `DTEND:${formatICSDate(endDate)}`,
        `SUMMARY:FIRB Step ${step.number}: ${step.title}`,
        `DESCRIPTION:${step.description}\\n\\nKey Actions:\\n${step.keyActions.join('\\n')}`,
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'DESCRIPTION:Reminder: FIRB step tomorrow',
        'ACTION:DISPLAY',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');

    // Create download link
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `firb-${step.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);

    showNotification(`📅 Calendar event for "${step.title}" downloaded`, 'success');
}

// Export all steps to calendar
function addAllStepsToCalendar() {
    if (!timelineState.personalized) {
        showNotification('Please complete the calculator first to generate personalized dates', 'info');
        return;
    }

    firbJourneySteps.forEach(step => {
        setTimeout(() => addStepToCalendar(step.id), 100);
    });
}

// Show step detail modal
function showStepDetail(stepId) {
    const step = firbJourneySteps.find(s => s.id === stepId);
    if (!step) return;

    const isCompleted = timelineState.completedSteps.has(stepId);
    const isCurrent = timelineState.currentStep === stepId;
    const stepDate = timelineState.userDates[stepId];

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.onclick = (e) => {
        if (e.target === modal) closeStepDetail();
    };

    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-${step.color}-100 flex items-center justify-center">
                        ${renderIcon(step.icon, 'w-6 h-6 text-' + step.color + '-600')}
                    </div>
                    <div>
                        <div class="text-sm text-gray-500">Step ${step.number} of ${firbJourneySteps.length}</div>
                        <h2 class="text-2xl font-bold text-gray-900">${step.title}</h2>
                    </div>
                </div>
                <button onclick="closeStepDetail()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <div class="p-6 space-y-6">
                <!-- Status Banner -->
                <div class="flex items-center justify-between p-4 rounded-lg ${isCompleted ? 'bg-green-50 border border-green-200' : isCurrent ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}">
                    <div class="flex items-center gap-3">
                        ${isCompleted ? '<svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' : ''}
                        ${isCurrent ? '<svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>' : ''}
                        <span class="font-semibold ${isCompleted ? 'text-green-900' : isCurrent ? 'text-blue-900' : 'text-gray-700'}">
                            ${isCompleted ? 'Completed' : isCurrent ? 'Current Step' : 'Not Started'}
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-600">Duration: ${step.duration}</span>
                        ${stepDate ? `<span class="text-sm font-medium text-${step.color}-600">Due: ${stepDate.toLocaleDateString()}</span>` : ''}
                    </div>
                </div>

                <!-- Description -->
                <div>
                    <p class="text-gray-700 text-lg">${step.description}</p>
                </div>

                <!-- Key Actions -->
                <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                        Key Actions Required
                    </h3>
                    <ul class="space-y-2">
                        ${step.keyActions.map(action => `
                            <li class="flex items-start gap-2">
                                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                <span class="text-gray-700">${action}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Documents Needed -->
                <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Documents Needed
                    </h3>
                    <ul class="space-y-2">
                        ${step.documentsNeeded.map(doc => `
                            <li class="flex items-start gap-2">
                                <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                                <span class="text-gray-700">${doc}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Common Pitfalls -->
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 class="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                        Common Pitfalls to Avoid
                    </h3>
                    <ul class="space-y-2">
                        ${step.commonPitfalls.map(pitfall => `
                            <li class="flex items-start gap-2">
                                <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                                </svg>
                                <span class="text-red-900">${pitfall}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Tips -->
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 class="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                        </svg>
                        Pro Tips
                    </h3>
                    <ul class="space-y-2">
                        ${step.tips.map(tip => `
                            <li class="flex items-start gap-2">
                                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                <span class="text-green-900">${tip}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                ${step.costRange ? `
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div class="flex items-center gap-2 mb-2">
                            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <h3 class="text-lg font-bold text-yellow-900">Estimated Costs</h3>
                        </div>
                        <p class="text-yellow-900">${step.costRange}</p>
                        ${step.calculator ? `
                            <button
                                onclick="closeStepDetail(); navigateToStep('calculator');"
                                class="mt-3 inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                </svg>
                                Calculate exact costs
                            </button>
                        ` : ''}
                    </div>
                ` : ''}

                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <button
                        onclick="toggleStepComplete('${step.id}'); closeStepDetail();"
                        class="inline-flex items-center px-6 py-3 ${isCompleted ? 'bg-gray-200 text-gray-700' : 'bg-green-600 text-white'} rounded-lg hover:opacity-90 transition-opacity font-semibold"
                    >
                        ${isCompleted ? '✓ Mark as Incomplete' : '✓ Mark as Complete'}
                    </button>

                    ${!isCurrent ? `
                        <button
                            onclick="setCurrentStep('${step.id}'); closeStepDetail();"
                            class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            Set as Current Step
                        </button>
                    ` : ''}

                    ${timelineState.personalized ? `
                        <button
                            onclick="addStepToCalendar('${step.id}')"
                            class="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                        >
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Add to Calendar
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.id = 'step-detail-modal';
}

// Close step detail modal
function closeStepDetail() {
    const modal = document.getElementById('step-detail-modal');
    if (modal) {
        modal.remove();
    }
}

// Render timeline component
function renderTimelineComponent(layout = 'horizontal') {
    const isMobile = window.innerWidth < 768;
    const actualLayout = isMobile ? 'vertical' : layout;

    const completedCount = timelineState.completedSteps.size;
    const totalSteps = firbJourneySteps.length;
    const progressPercent = (completedCount / totalSteps) * 100;

    return `
        <div class="firb-timeline">
            <!-- Header -->
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-3">Your FIRB Journey</h2>
                <p class="text-lg text-gray-600 mb-4">
                    Complete guide from eligibility check to annual compliance
                </p>

                <!-- Progress Bar -->
                <div class="mb-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Overall Progress</span>
                        <span class="text-sm font-medium text-gray-700">${completedCount} of ${totalSteps} steps</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            class="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                            style="width: ${progressPercent}%"
                        ></div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-3">
                    ${timelineState.personalized ? `
                        <button
                            onclick="addAllStepsToCalendar()"
                            class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Export All to Calendar
                        </button>
                    ` : ''}

                    <button
                        onclick="showEmailReminderForm()"
                        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        Email Reminders
                    </button>

                    <button
                        onclick="resetTimelineProgress()"
                        class="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                    >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        Reset Progress
                    </button>
                </div>
            </div>

            <!-- Timeline -->
            <div class="timeline-container ${actualLayout === 'vertical' ? 'timeline-vertical' : 'timeline-horizontal'}">
                ${actualLayout === 'vertical' ? renderVerticalTimeline() : renderHorizontalTimeline()}
            </div>
        </div>
    `;
}

// Render horizontal timeline (desktop)
function renderHorizontalTimeline() {
    return `
        <div class="relative">
            <!-- Progress Line -->
            <div class="absolute top-8 left-0 right-0 h-1 bg-gray-200">
                <div
                    class="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                    style="width: ${(timelineState.completedSteps.size / firbJourneySteps.length) * 100}%"
                ></div>
            </div>

            <!-- Steps -->
            <div class="grid grid-cols-${Math.min(firbJourneySteps.length, 4)} gap-4">
                ${firbJourneySteps.map(step => renderTimelineStep(step, 'horizontal')).join('')}
            </div>
        </div>
    `;
}

// Render vertical timeline (mobile)
function renderVerticalTimeline() {
    return `
        <div class="space-y-6">
            ${firbJourneySteps.map((step, index) => `
                <div class="relative ${index < firbJourneySteps.length - 1 ? 'pb-6' : ''}">
                    ${index < firbJourneySteps.length - 1 ? `
                        <div class="absolute top-12 left-6 bottom-0 w-1 bg-gray-200">
                            ${timelineState.completedSteps.has(step.id) ? `
                                <div class="h-full bg-gradient-to-b from-green-500 to-blue-500"></div>
                            ` : ''}
                        </div>
                    ` : ''}
                    ${renderTimelineStep(step, 'vertical')}
                </div>
            `).join('')}
        </div>
    `;
}

// Render single timeline step
function renderTimelineStep(step, layout) {
    const isCompleted = timelineState.completedSteps.has(step.id);
    const isCurrent = timelineState.currentStep === step.id;
    const stepDate = timelineState.userDates[step.id];

    if (layout === 'horizontal') {
        return `
            <div
                class="timeline-step cursor-pointer"
                data-step-id="${step.id}"
                onclick="showStepDetail('${step.id}')"
            >
                <!-- Step Circle -->
                <div class="relative z-10 flex flex-col items-center mb-4">
                    <div class="w-16 h-16 rounded-full border-4 ${isCompleted ? 'bg-green-500 border-green-500' : isCurrent ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'} flex items-center justify-center mb-2 transition-all duration-300 hover:scale-110">
                        ${isCompleted ? `
                            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                        ` : `
                            <span class="text-2xl font-bold ${isCurrent ? 'text-white' : 'text-gray-400'}">${step.number}</span>
                        `}
                    </div>
                    ${isCurrent ? '<div class="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Current</div>' : ''}
                </div>

                <!-- Step Content -->
                <div class="text-center">
                    <h3 class="font-bold text-gray-900 mb-1">${step.title}</h3>
                    <p class="text-sm text-gray-500 mb-2">${step.duration}</p>
                    ${stepDate ? `<p class="text-xs text-${step.color}-600 font-medium">${stepDate.toLocaleDateString()}</p>` : ''}
                </div>
            </div>
        `;
    } else {
        // Vertical layout
        return `
            <div
                class="timeline-step flex gap-4 cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
                data-step-id="${step.id}"
                onclick="showStepDetail('${step.id}')"
            >
                <!-- Step Circle -->
                <div class="flex-shrink-0">
                    <div class="w-12 h-12 rounded-full border-4 ${isCompleted ? 'bg-green-500 border-green-500' : isCurrent ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'} flex items-center justify-center">
                        ${isCompleted ? `
                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                        ` : `
                            <span class="text-lg font-bold ${isCurrent ? 'text-white' : 'text-gray-400'}">${step.number}</span>
                        `}
                    </div>
                </div>

                <!-- Step Content -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                        <h3 class="font-bold text-gray-900">${step.title}</h3>
                        ${isCurrent ? '<span class="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Current</span>' : ''}
                    </div>
                    <p class="text-sm text-gray-600 mb-1">${step.description}</p>
                    <div class="flex items-center gap-3 text-xs text-gray-500">
                        <span>⏱️ ${step.duration}</span>
                        ${stepDate ? `<span class="text-${step.color}-600 font-medium">📅 ${stepDate.toLocaleDateString()}</span>` : ''}
                    </div>
                </div>

                <!-- Chevron -->
                <div class="flex-shrink-0 flex items-center">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </div>
            </div>
        `;
    }
}

// Reset timeline progress
function resetTimelineProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        timelineState.completedSteps.clear();
        timelineState.currentStep = 'step-1';
        timelineState.userDates = {};
        saveTimelineProgress();
        renderTimelineDisplay();
        showNotification('Timeline progress reset', 'info');
    }
}

// Show email reminder form
function showEmailReminderForm() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.onclick = (e) => {
        if (e.target === modal) closeEmailForm();
    };

    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full p-6" onclick="event.stopPropagation()">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-900">Email Reminders</h3>
                <button onclick="closeEmailForm()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <p class="text-gray-600 mb-4">
                Get email reminders for important FIRB deadlines and steps
            </p>

            <form onsubmit="submitEmailReminder(event)" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        id="reminder-email"
                        required
                        placeholder="your.email@example.com"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Remind me about:</label>
                    <div class="space-y-2 max-h-48 overflow-y-auto">
                        ${firbJourneySteps.map(step => `
                            <label class="flex items-center">
                                <input
                                    type="checkbox"
                                    name="reminder-steps"
                                    value="${step.id}"
                                    ${!timelineState.completedSteps.has(step.id) ? 'checked' : ''}
                                    class="mr-2"
                                />
                                <span class="text-sm text-gray-700">${step.title}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p class="text-sm text-blue-900">
                        <strong>Note:</strong> This is a demo feature. In production, this would integrate with an email service.
                    </p>
                </div>

                <div class="flex gap-3">
                    <button
                        type="submit"
                        class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Subscribe
                    </button>
                    <button
                        type="button"
                        onclick="closeEmailForm()"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.id = 'email-reminder-modal';
}

// Close email form
function closeEmailForm() {
    const modal = document.getElementById('email-reminder-modal');
    if (modal) {
        modal.remove();
    }
}

// Submit email reminder (demo)
function submitEmailReminder(event) {
    event.preventDefault();
    const email = document.getElementById('reminder-email').value;
    const checkedSteps = Array.from(document.querySelectorAll('input[name="reminder-steps"]:checked'))
        .map(cb => cb.value);

    // Demo: Just save to localStorage
    saveToStorage('firb_email_reminders', {
        email,
        steps: checkedSteps,
        subscribedAt: Date.now()
    });

    closeEmailForm();
    showNotification(`✉️ Reminder subscription saved for ${email}`, 'success');
}

// Update timeline display
function renderTimelineDisplay() {
    const container = document.getElementById('timeline-container');
    if (container) {
        container.innerHTML = renderTimelineComponent();
        addTimelineStyles();
    }
}

// Add timeline styles
function addTimelineStyles() {
    if (document.getElementById('timeline-styles')) return;

    const style = document.createElement('style');
    style.id = 'timeline-styles';
    style.textContent = `
        .timeline-horizontal {
            padding: 2rem 0;
        }

        .timeline-vertical {
            padding: 1rem 0;
        }

        .timeline-step {
            position: relative;
        }

        .step-complete-animation {
            animation: stepComplete 1s ease;
        }

        @keyframes stepComplete {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
            animation: fadeIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Helper function to render icons
function renderIcon(iconName, classes) {
    const icons = {
        'UserCheck': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
        'Home': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
        'FileText': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
        'CheckCircle': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
        'TrendingUp': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`,
        'FileSignature': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`,
        'Key': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>`,
        'Calendar': `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
    };
    return icons[iconName] || '';
}
