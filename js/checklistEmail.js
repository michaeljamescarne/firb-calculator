/**
 * Email Checklist Functionality
 * @file checklistEmail.js
 *
 * Email checklist to user via EmailJS
 */

/**
 * Show email checklist modal
 */
function showEmailChecklistModal() {
    const stats = getCompletionStats();

    const modalHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onclick="closeEmailChecklistModal(event)">
            <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6" onclick="event.stopPropagation()">
                <h3 class="text-2xl font-bold mb-4">Email Checklist</h3>

                <p class="text-gray-600 mb-4">
                    Receive your personalized document checklist via email for easy reference
                </p>

                <!-- Progress info -->
                <div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div class="text-sm text-gray-700">
                        <div class="font-semibold mb-1">Your checklist includes:</div>
                        <ul class="list-disc list-inside space-y-1">
                            <li>${stats.total} personalized documents</li>
                            <li>Current progress: ${stats.percentage}% complete</li>
                            <li>Links to obtain each document</li>
                            <li>State-specific requirements</li>
                        </ul>
                    </div>
                </div>

                <!-- Email form -->
                <form id="email-checklist-form" onsubmit="sendChecklistEmail(event); return false;">
                    <div class="mb-4">
                        <label class="block font-semibold mb-2">Your Email Address</label>
                        <input type="email"
                            id="checklist-email-input"
                            required
                            placeholder="your@email.com"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div class="mb-6">
                        <label class="flex items-start">
                            <input type="checkbox" required class="mt-1 w-4 h-4 text-blue-600">
                            <span class="ml-2 text-sm text-gray-600">
                                I agree to receive this checklist via email
                            </span>
                        </label>
                    </div>

                    <div class="flex gap-3">
                        <button type="button" onclick="closeEmailChecklistModalBtn()"
                            class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                            Cancel
                        </button>
                        <button type="submit"
                            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <span>Send Checklist</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.id = 'email-checklist-modal';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
}

/**
 * Close email checklist modal
 */
function closeEmailChecklistModalBtn() {
    const modal = document.getElementById('email-checklist-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Close modal on backdrop click
 */
function closeEmailChecklistModal(event) {
    if (event.target === event.currentTarget) {
        closeEmailChecklistModalBtn();
    }
}

/**
 * Send checklist via email
 */
async function sendChecklistEmail(event) {
    event.preventDefault();

    const emailInput = document.getElementById('checklist-email-input');
    const email = emailInput.value.trim();

    if (!email) {
        if (typeof showToast === 'function') {
            showToast('Please enter your email address', 'error');
        }
        return;
    }

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
    `;

    try {
        // Generate checklist HTML for email
        const checklistHTML = generateChecklistEmailHTML();

        // Use EmailJS if available
        if (typeof emailjs !== 'undefined' && typeof EMAILJS_SERVICE_ID !== 'undefined') {
            const templateParams = {
                to_email: email,
                to_name: 'Property Buyer',
                checklist_html: checklistHTML,
                stats_completed: getCompletionStats().completed,
                stats_total: getCompletionStats().total,
                stats_percentage: getCompletionStats().percentage
            };

            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CHECKLIST_TEMPLATE_ID, templateParams);

            closeEmailChecklistModalBtn();

            if (typeof showToast === 'function') {
                showToast(`Checklist sent to ${email}!`, 'success');
            }

        } else {
            // Fallback: Open email client
            const subject = encodeURIComponent('Your FIRB Document Checklist');
            const body = encodeURIComponent(generateChecklistPlainText());
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

            closeEmailChecklistModalBtn();

            if (typeof showToast === 'function') {
                showToast('Opening your email client...', 'info');
            }
        }

    } catch (error) {
        console.error('Error sending checklist email:', error);

        submitButton.disabled = false;
        submitButton.innerHTML = originalText;

        if (typeof showToast === 'function') {
            showToast('Failed to send email. Please try PDF export instead.', 'error');
        }

        if (typeof logError === 'function') {
            logError(error, 'sendChecklistEmail');
        }
    }
}

/**
 * Generate checklist HTML for email
 */
function generateChecklistEmailHTML() {
    const { items, grouped } = generateChecklistFromState();
    const stats = getCompletionStats();

    let html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #2563eb, #1d4ed8); color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">FIRB Document Checklist</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Personalized for Your Purchase</p>
            </div>

            <div style="background: #f3f4f6; padding: 15px; text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #2563eb;">${stats.percentage}%</div>
                <div style="color: #6b7280; font-size: 14px;">${stats.completed} of ${stats.total} items completed</div>
            </div>

            <div style="padding: 20px; background: white;">
    `;

    for (const [category, items] of Object.entries(grouped)) {
        html += `
            <div style="margin-bottom: 30px;">
                <h2 style="color: #2563eb; font-size: 18px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                    ${category}
                </h2>
        `;

        items.forEach(item => {
            html += `
                <div style="margin: 15px 0; padding: 15px; background: ${item.completed ? '#f0fdf4' : '#f9fafb'}; border-left: 4px solid ${item.completed ? '#10b981' : '#d1d5db'}; border-radius: 4px;">
                    <div style="font-weight: bold; color: #111827; margin-bottom: 5px;">
                        ${item.completed ? '✓' : '☐'} ${item.title}
                    </div>
                    <div style="font-size: 13px; color: #6b7280; margin-bottom: 8px;">
                        ${item.description}
                    </div>
                    ${item.tooltip ? `
                        <div style="font-size: 12px; color: #1e40af; background: #dbeafe; padding: 8px; border-radius: 4px; margin-bottom: 5px;">
                            💡 ${item.tooltip}
                        </div>
                    ` : ''}
                    ${item.link ? `
                        <a href="${item.link}" style="font-size: 13px; color: #2563eb; text-decoration: none;">
                            → Get this document
                        </a>
                    ` : ''}
                </div>
            `;
        });

        html += `</div>`;
    }

    html += `
            </div>

            <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                <p>Generated by FIRB Calculator</p>
                <p><a href="${window.location.origin}" style="color: #2563eb; text-decoration: none;">Visit FIRB Calculator</a></p>
            </div>
        </div>
    `;

    return html;
}

/**
 * Generate checklist plain text for email fallback
 */
function generateChecklistPlainText() {
    const { items, grouped } = generateChecklistFromState();
    const stats = getCompletionStats();

    let text = `FIRB DOCUMENT CHECKLIST\n`;
    text += `Generated: ${new Date().toLocaleDateString()}\n`;
    text += `Progress: ${stats.completed}/${stats.total} (${stats.percentage}%)\n\n`;
    text += `=========================================\n\n`;

    for (const [category, items] of Object.entries(grouped)) {
        text += `${category.toUpperCase()}\n`;
        text += `${'='.repeat(category.length)}\n\n`;

        items.forEach((item, index) => {
            text += `${index + 1}. [${item.completed ? 'X' : ' '}] ${item.title}\n`;
            text += `   ${item.description}\n`;
            if (item.link) {
                text += `   Link: ${item.link}\n`;
            }
            text += `\n`;
        });

        text += `\n`;
    }

    text += `=========================================\n`;
    text += `\nVisit ${window.location.origin} for more information\n`;

    return text;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showEmailChecklistModal,
        sendChecklistEmail
    };
}
