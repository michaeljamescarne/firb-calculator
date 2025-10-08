/**
 * Email System for FIRB Calculator
 * Handles email delivery of results, newsletter signup, lead capture, and auto-responders
 * Uses EmailJS for client-side email sending without backend
 */

// EmailJS Configuration
const EMAILJS_CONFIG = {
    serviceId: 'YOUR_EMAILJS_SERVICE_ID', // Replace with your EmailJS service ID
    templateId: 'YOUR_EMAILJS_TEMPLATE_ID', // Replace with your EmailJS template ID
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY' // Replace with your EmailJS public key
};

// Email system state
let emailSystemState = {
    leads: [],
    lastEmailSent: null,
    emailCount: 0
};

/**
 * Initialize EmailJS
 */
function initEmailJS() {
    // EmailJS will be loaded from CDN
    // Initialize with public key when library is available
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialized');
    } else {
        console.warn('EmailJS library not loaded');
    }
}

/**
 * Show email results modal
 */
function showEmailResultsModal() {
    if (!state.calculatedFees) {
        alert('Please complete a calculation first before sending results.');
        return;
    }

    const modal = document.createElement('div');
    modal.id = 'email-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = renderEmailModal();
    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEmailModal();
        }
    });
}

/**
 * Render email modal HTML
 */
function renderEmailModal() {
    return `
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-lg">
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-2xl font-bold text-white mb-2">
                            📧 Email Your FIRB Results
                        </h2>
                        <p class="text-blue-100 text-sm">
                            Receive a detailed PDF report and save your calculation for later
                        </p>
                    </div>
                    <button onclick="closeEmailModal()" class="text-white hover:text-gray-200">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Form -->
            <form id="email-results-form" class="p-6 space-y-6">
                <!-- Contact Information -->
                <div class="space-y-4">
                    <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Your Contact Information
                    </h3>

                    <div>
                        <label for="email-address" class="block text-sm font-medium text-gray-700 mb-1">
                            Email Address <span class="text-red-500">*</span>
                        </label>
                        <input type="email" id="email-address" required
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="your.email@example.com">
                        <p class="text-xs text-gray-500 mt-1">We'll send your PDF report to this address</p>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label for="user-name" class="block text-sm font-medium text-gray-700 mb-1">
                                Full Name (Optional)
                            </label>
                            <input type="text" id="user-name"
                                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="John Smith">
                        </div>
                        <div>
                            <label for="user-phone" class="block text-sm font-medium text-gray-700 mb-1">
                                Phone (Optional)
                            </label>
                            <input type="tel" id="user-phone"
                                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="+61 400 000 000">
                        </div>
                    </div>
                </div>

                <!-- What You'll Receive -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 class="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        What You'll Receive
                    </h3>
                    <ul class="space-y-2 text-sm text-blue-800">
                        <li class="flex items-start gap-2">
                            <span class="text-blue-600 mt-0.5">📄</span>
                            <span><strong>Professional PDF Report</strong> - Complete FIRB cost breakdown with calculations</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-blue-600 mt-0.5">💾</span>
                            <span><strong>Save Scenario Link</strong> - Access your calculation anytime online</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-blue-600 mt-0.5">📊</span>
                            <span><strong>Executive Summary</strong> - Key findings and recommendations</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-blue-600 mt-0.5">🎯</span>
                            <span><strong>Next Steps Guide</strong> - Action plan with timeline and contacts</span>
                        </li>
                    </ul>
                </div>

                <!-- Newsletter Signup -->
                <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                        <input type="checkbox" id="newsletter-signup"
                            class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                        <div class="flex-1">
                            <label for="newsletter-signup" class="font-medium text-gray-900 cursor-pointer">
                                📬 Get FIRB Updates & Property Investment Tips
                            </label>
                            <p class="text-sm text-gray-600 mt-1">
                                Receive monthly updates on FIRB regulations, stamp duty changes, visa pathways,
                                and expert property investment tips for foreign buyers in Australia.
                            </p>
                        </div>
                    </div>

                    <!-- Property Interest Segmentation -->
                    <div id="property-interests" class="mt-4 pl-7 space-y-2" style="display: none;">
                        <p class="text-sm font-medium text-gray-700 mb-2">
                            I'm interested in: <span class="text-gray-500">(helps us send relevant content)</span>
                        </p>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="interest-checkbox" value="investment-property">
                                <span class="text-gray-700">Investment Properties</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="interest-checkbox" value="residential-home">
                                <span class="text-gray-700">Residential Home</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="interest-checkbox" value="new-development">
                                <span class="text-gray-700">New Developments</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="interest-checkbox" value="visa-pathway">
                                <span class="text-gray-700">Visa Pathways</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Free Consultation CTA -->
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                        <input type="checkbox" id="consultation-interest"
                            class="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500">
                        <div class="flex-1">
                            <label for="consultation-interest" class="font-medium text-green-900 cursor-pointer">
                                🎁 Yes, I'd like a FREE 15-minute consultation call
                            </label>
                            <p class="text-sm text-green-700 mt-1">
                                Speak with a FIRB specialist about your specific situation. No obligation.
                                We'll review your calculation and answer your questions.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- GDPR Consent -->
                <div class="border-t pt-4">
                    <div class="space-y-3">
                        <div class="flex items-start gap-3">
                            <input type="checkbox" id="privacy-consent" required
                                class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                            <label for="privacy-consent" class="text-sm text-gray-700 cursor-pointer">
                                I agree to the <a href="#" onclick="showPrivacyPolicy(event)" class="text-blue-600 hover:underline">Privacy Policy</a>
                                and consent to receive my FIRB calculation results via email. <span class="text-red-500">*</span>
                            </label>
                        </div>

                        <p class="text-xs text-gray-500 pl-7">
                            We respect your privacy. Your email will only be used to send your requested report and
                            updates you've subscribed to. You can unsubscribe anytime. We never sell your data.
                        </p>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="flex gap-3">
                    <button type="button" onclick="closeEmailModal()"
                        class="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" id="send-email-btn"
                        class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <span>Send My Results</span>
                    </button>
                </div>

                <!-- Sending Status -->
                <div id="email-status" class="hidden"></div>
            </form>
        </div>
    `;
}

/**
 * Close email modal
 */
function closeEmailModal() {
    const modal = document.getElementById('email-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Initialize email form handlers
 */
function initEmailFormHandlers() {
    document.addEventListener('DOMContentLoaded', () => {
        // Handle newsletter checkbox to show/hide interests
        document.addEventListener('change', (e) => {
            if (e.target && e.target.id === 'newsletter-signup') {
                const interestsDiv = document.getElementById('property-interests');
                if (interestsDiv) {
                    interestsDiv.style.display = e.target.checked ? 'block' : 'none';
                }
            }
        });

        // Handle form submission
        document.addEventListener('submit', async (e) => {
            if (e.target && e.target.id === 'email-results-form') {
                e.preventDefault();
                await handleEmailSubmission();
            }
        });
    });
}

/**
 * Handle email form submission
 */
async function handleEmailSubmission() {
    const form = document.getElementById('email-results-form');
    const btn = document.getElementById('send-email-btn');
    const statusDiv = document.getElementById('email-status');

    // Get form values
    const emailAddress = document.getElementById('email-address').value;
    const userName = document.getElementById('user-name').value || 'Prospective Buyer';
    const userPhone = document.getElementById('user-phone').value || '';
    const newsletterSignup = document.getElementById('newsletter-signup').checked;
    const consultationInterest = document.getElementById('consultation-interest').checked;
    const privacyConsent = document.getElementById('privacy-consent').checked;

    if (!privacyConsent) {
        alert('Please accept the privacy policy to continue.');
        return;
    }

    // Get property interests
    const interests = [];
    document.querySelectorAll('.interest-checkbox:checked').forEach(cb => {
        interests.push(cb.value);
    });

    // Disable button and show loading
    btn.disabled = true;
    btn.innerHTML = `
        <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Sending...</span>
    `;

    try {
        // 1. Generate PDF (if not already generated)
        let pdfBlob = null;
        if (typeof generateProfessionalPDFBlob === 'function') {
            pdfBlob = await generateProfessionalPDFBlob({
                propertyAddress: state.formData.propertyValue ? 'Property valued at ' + formatCurrency(state.formData.propertyValue) : 'Property',
                userName: userName,
                userEmail: emailAddress,
                preparedDate: new Date().toLocaleDateString('en-AU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            });
        }

        // 2. Create lead record
        const lead = {
            email: emailAddress,
            name: userName,
            phone: userPhone,
            timestamp: new Date().toISOString(),
            calculationData: {
                purchasePrice: state.formData.propertyValue,
                propertyType: state.formData.propertyType,
                state: state.formData.state,
                totalCost: state.calculatedFees.grandTotal,
                firbFee: state.calculatedFees.firbApplicationFee,
                stampDuty: state.calculatedFees.stampDuty + state.calculatedFees.surchargeStampDuty
            },
            preferences: {
                newsletter: newsletterSignup,
                interests: interests,
                consultation: consultationInterest
            },
            consent: {
                privacy: privacyConsent,
                marketing: newsletterSignup,
                timestamp: new Date().toISOString()
            }
        };

        // 3. Store lead locally
        storeLead(lead);

        // 4. Send email via EmailJS
        const emailSent = await sendEmailViaEmailJS(lead, pdfBlob);

        if (emailSent) {
            // Show success message
            statusDiv.className = 'bg-green-50 border border-green-200 rounded-lg p-4 text-green-800';
            statusDiv.innerHTML = `
                <div class="flex items-start gap-3">
                    <svg class="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <h4 class="font-semibold mb-1">✅ Email Sent Successfully!</h4>
                        <p class="text-sm">
                            Check your inbox at <strong>${emailAddress}</strong> for your FIRB results.
                            ${newsletterSignup ? 'You\'ve been subscribed to our newsletter.' : ''}
                            ${consultationInterest ? 'We\'ll contact you soon to schedule your free consultation.' : ''}
                        </p>
                    </div>
                </div>
            `;
            statusDiv.classList.remove('hidden');

            // Close modal after 3 seconds
            setTimeout(() => {
                closeEmailModal();
            }, 3000);

            // Track event (if analytics available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_results_sent', {
                    event_category: 'engagement',
                    event_label: newsletterSignup ? 'with_newsletter' : 'no_newsletter'
                });
            }
        } else {
            throw new Error('Email service unavailable');
        }

    } catch (error) {
        console.error('Email send error:', error);

        // Show error message
        statusDiv.className = 'bg-red-50 border border-red-200 rounded-lg p-4 text-red-800';
        statusDiv.innerHTML = `
            <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                    <h4 class="font-semibold mb-1">Error Sending Email</h4>
                    <p class="text-sm">
                        We couldn't send your email right now. Please try downloading the PDF instead,
                        or copy your results manually. Your calculation has been saved locally.
                    </p>
                </div>
            </div>
        `;
        statusDiv.classList.remove('hidden');

        // Re-enable button
        btn.disabled = false;
        btn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>Send My Results</span>
        `;
    }
}

/**
 * Send email via EmailJS service
 */
async function sendEmailViaEmailJS(lead, pdfBlob) {
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS not loaded. Email functionality requires EmailJS library.');
        return false;
    }

    try {
        // Prepare email parameters
        const templateParams = {
            to_email: lead.email,
            to_name: lead.name,
            reply_to: lead.email,

            // Calculation summary
            property_type: state.formData.propertyType === 'new' ? 'New Dwelling/Apartment' : 'Established Dwelling',
            property_state: state.formData.state,
            purchase_price: formatCurrency(state.formData.propertyValue),
            total_cost: formatCurrency(state.calculatedFees.grandTotal),
            firb_fee: formatCurrency(state.calculatedFees.firbApplicationFee),
            stamp_duty: formatCurrency(state.calculatedFees.stampDuty + state.calculatedFees.surchargeStampDuty),

            // Additional info
            newsletter_signup: lead.preferences.newsletter ? 'Yes' : 'No',
            consultation_requested: lead.preferences.consultation ? 'Yes' : 'No',
            interests: lead.preferences.interests.join(', ') || 'Not specified',

            // Call to actions
            save_scenario_link: window.location.origin + window.location.pathname + '#saved',
            consultation_link: window.location.origin + window.location.pathname + '#consultation',

            // Metadata
            sent_date: new Date().toLocaleDateString('en-AU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        // Note: EmailJS has limitations with PDF attachments
        // For production, you'd want to:
        // 1. Upload PDF to cloud storage (S3, Firebase, etc.)
        // 2. Include download link in email
        // 3. Or use a backend service to handle attachments

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );

        console.log('Email sent successfully:', response);

        // Update state
        emailSystemState.lastEmailSent = new Date().toISOString();
        emailSystemState.emailCount++;

        return true;

    } catch (error) {
        console.error('EmailJS error:', error);
        return false;
    }
}

/**
 * Store lead in localStorage and optionally send to CRM
 */
function storeLead(lead) {
    // Get existing leads
    const leads = JSON.parse(localStorage.getItem('firb_leads') || '[]');

    // Add new lead
    leads.push(lead);

    // Store back to localStorage
    localStorage.setItem('firb_leads', JSON.stringify(leads));

    // Update state
    emailSystemState.leads.push(lead);

    // TODO: Send to external CRM/marketing automation
    // sendToCRM(lead);

    console.log('Lead stored:', lead);
}

/**
 * Generate PDF as Blob for email attachment
 */
async function generateProfessionalPDFBlob(userInfo) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('portrait', 'mm', 'a4');

        const fees = state.calculatedFees;

        // Generate all pages (simplified version for email)
        // Use the same functions from pdfExport.js
        if (typeof addCoverPage === 'function') {
            await addCoverPage(doc, fees, userInfo);
        }

        doc.addPage();
        if (typeof addExecutiveSummary === 'function') {
            addExecutiveSummary(doc, fees, userInfo, 2);
        }

        // Return as Blob
        return doc.output('blob');
    } catch (error) {
        console.error('PDF generation error:', error);
        return null;
    }
}

/**
 * Show privacy policy modal
 */
function showPrivacyPolicy(event) {
    if (event) event.preventDefault();

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-900">Privacy Policy</h2>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="p-6 space-y-4 text-sm text-gray-700">
                <section>
                    <h3 class="font-bold text-gray-900 mb-2">Data Collection</h3>
                    <p>We collect your email address, name (optional), and phone number (optional) when you request your FIRB calculation results. We also collect information about your property search preferences and calculation details.</p>
                </section>

                <section>
                    <h3 class="font-bold text-gray-900 mb-2">How We Use Your Data</h3>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>To send you your requested FIRB calculation results and PDF report</li>
                        <li>To provide customer support and answer your questions</li>
                        <li>To send you newsletter updates (only if you opt in)</li>
                        <li>To contact you about consultation requests (only if you opt in)</li>
                        <li>To improve our services and user experience</li>
                    </ul>
                </section>

                <section>
                    <h3 class="font-bold text-gray-900 mb-2">Data Sharing</h3>
                    <p>We never sell your personal data. We may share your information with:</p>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Email service providers (EmailJS) to deliver your results</li>
                        <li>Analytics services (Google Analytics) in anonymized form</li>
                        <li>Professional advisors (only if you request a consultation)</li>
                    </ul>
                </section>

                <section>
                    <h3 class="font-bold text-gray-900 mb-2">Your Rights (GDPR Compliance)</h3>
                    <ul class="list-disc pl-5 space-y-1">
                        <li><strong>Access:</strong> Request a copy of your data</li>
                        <li><strong>Rectification:</strong> Correct inaccurate data</li>
                        <li><strong>Erasure:</strong> Request deletion of your data</li>
                        <li><strong>Portability:</strong> Receive your data in portable format</li>
                        <li><strong>Objection:</strong> Object to processing of your data</li>
                        <li><strong>Withdraw Consent:</strong> Unsubscribe from communications anytime</li>
                    </ul>
                </section>

                <section>
                    <h3 class="font-bold text-gray-900 mb-2">Data Retention</h3>
                    <p>We retain your data for as long as necessary to provide our services or as required by law. You can request deletion at any time by contacting us.</p>
                </section>

                <section>
                    <h3 class="font-bold text-gray-900 mb-2">Security</h3>
                    <p>We use industry-standard security measures to protect your data, including encryption and secure servers.</p>
                </section>

                <section>
                    <h3 class="font-bold text-gray-900 mb-2">Contact Us</h3>
                    <p>For privacy concerns or to exercise your rights, contact us at: <a href="mailto:privacy@firbcalculator.com" class="text-blue-600 hover:underline">privacy@firbcalculator.com</a></p>
                </section>

                <section>
                    <p class="text-xs text-gray-500 italic">Last updated: January 2025</p>
                </section>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

/**
 * Export leads for CRM integration
 */
function exportLeads() {
    const leads = JSON.parse(localStorage.getItem('firb_leads') || '[]');

    if (leads.length === 0) {
        alert('No leads to export.');
        return;
    }

    // Convert to CSV
    const csv = convertLeadsToCSV(leads);

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firb_leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Convert leads to CSV format
 */
function convertLeadsToCSV(leads) {
    const headers = ['Timestamp', 'Email', 'Name', 'Phone', 'Purchase Price', 'State', 'Total Cost', 'Newsletter', 'Consultation', 'Interests'];
    const rows = leads.map(lead => [
        lead.timestamp,
        lead.email,
        lead.name,
        lead.phone,
        lead.calculationData.purchasePrice,
        lead.calculationData.state,
        lead.calculationData.totalCost,
        lead.preferences.newsletter ? 'Yes' : 'No',
        lead.preferences.consultation ? 'Yes' : 'No',
        lead.preferences.interests.join('; ')
    ]);

    return [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
}

/**
 * Unsubscribe from newsletter
 */
function handleUnsubscribe(email) {
    const leads = JSON.parse(localStorage.getItem('firb_leads') || '[]');
    const updatedLeads = leads.map(lead => {
        if (lead.email === email) {
            lead.preferences.newsletter = false;
            lead.unsubscribed = new Date().toISOString();
        }
        return lead;
    });

    localStorage.setItem('firb_leads', JSON.stringify(updatedLeads));

    alert('You have been unsubscribed from our newsletter.');
}

// Initialize email system
if (typeof window !== 'undefined') {
    window.showEmailResultsModal = showEmailResultsModal;
    window.closeEmailModal = closeEmailModal;
    window.showPrivacyPolicy = showPrivacyPolicy;
    window.exportLeads = exportLeads;
    window.handleUnsubscribe = handleUnsubscribe;

    // Initialize EmailJS when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEmailJS);
    } else {
        initEmailJS();
    }

    // Initialize form handlers
    initEmailFormHandlers();
}
