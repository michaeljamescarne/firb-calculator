/**
 * Personalized Document Checklist System
 * @file documentChecklist.js
 *
 * Generates customized document checklists based on user scenario
 * Features: progress tracking, save/load, print, PDF export, email
 */

/**
 * Storage key for checklist progress
 */
const CHECKLIST_STORAGE_KEY = 'firb_checklist_progress';

/**
 * Checklist state
 */
const checklistState = {
    items: [],
    completedItems: new Set(),
    userScenario: null,
    lastUpdated: null
};

/**
 * Document database with links and tooltips
 */
const DOCUMENT_DATABASE = {
    // FIRB Application Documents
    firbForm: {
        title: 'Completed FIRB Application Form',
        category: 'FIRB Application',
        description: 'Official application form for foreign investment approval',
        link: 'https://firb.gov.au/apply-for-approval',
        tooltip: 'Submit online through the FIRB portal. Processing time typically 30 days.',
        requiredFor: ['all']
    },
    passport: {
        title: 'Copy of Passport (Certified)',
        category: 'FIRB Application',
        description: 'Certified copy of your passport identification pages',
        link: 'https://www.servicesaustralia.gov.au/certified-copies',
        tooltip: 'Must be certified by a Justice of the Peace, police officer, or similar authority',
        requiredFor: ['all']
    },
    visaProof: {
        title: 'Proof of Visa Status',
        category: 'FIRB Application',
        description: 'Evidence of your current Australian visa',
        link: 'https://immi.homeaffairs.gov.au/visas/already-have-a-visa/check-visa-details-and-conditions/check-conditions-online',
        tooltip: 'VEVO (Visa Entitlement Verification Online) printout or visa grant letter',
        requiredFor: ['temporary', 'bridging']
    },
    companyIncorporation: {
        title: 'Certificate of Incorporation',
        category: 'FIRB Application',
        description: 'Company registration certificate',
        link: 'https://asic.gov.au/',
        tooltip: 'Required if purchasing through a company structure',
        requiredFor: ['company']
    },
    ownershipStructure: {
        title: 'Ownership Structure Diagram',
        category: 'FIRB Application',
        description: 'Chart showing company ownership and beneficial owners',
        link: 'https://firb.gov.au/guidance-resources/guidance-notes',
        tooltip: 'Must show all shareholders with >10% ownership and ultimate beneficial owners',
        requiredFor: ['company']
    },
    propertyDetails: {
        title: 'Property Details',
        category: 'FIRB Application',
        description: 'Contract of sale or property address details',
        link: null,
        tooltip: 'Include property address, purchase price, and settlement date',
        requiredFor: ['all']
    },
    proofOfFunds: {
        title: 'Proof of Funds / Finance Pre-Approval',
        category: 'FIRB Application',
        description: 'Bank statements or loan pre-approval letter',
        link: null,
        tooltip: 'Show you have sufficient funds for deposit and purchase costs',
        requiredFor: ['all']
    },
    developerCertificate: {
        title: "Developer's Foreign Investment Certificate",
        category: 'FIRB Application',
        description: 'Certificate from developer confirming FIRB compliance',
        link: null,
        tooltip: 'Required for off-the-plan purchases. Developer should provide this.',
        requiredFor: ['offThePlan', 'newDwelling']
    },

    // State-Specific Documents
    nswIDVerification: {
        title: 'Additional ID Verification (NSW)',
        category: 'State-Specific',
        description: 'Extra identification documents for NSW purchases',
        link: 'https://www.revenue.nsw.gov.au/',
        tooltip: 'May include driver license, Medicare card, or utility bills',
        requiredFor: ['NSW']
    },
    vicFirstHomeOwner: {
        title: 'First Home Owner Declaration (VIC)',
        category: 'State-Specific',
        description: 'Declaration if claiming first home owner benefits',
        link: 'https://www.sro.vic.gov.au/first-home-owner',
        tooltip: 'Only applicable if eligible for First Home Owner Grant',
        requiredFor: ['VIC-firstHome']
    },
    transferOfLandNSW: {
        title: 'Transfer of Land Form (NSW)',
        category: 'State-Specific',
        description: 'NSW property transfer documentation',
        link: 'https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property',
        tooltip: 'Prepared by your conveyancer or solicitor',
        requiredFor: ['NSW']
    },
    transferOfLandVIC: {
        title: 'Transfer of Land Form (VIC)',
        category: 'State-Specific',
        description: 'VIC property transfer documentation',
        link: 'https://www.land.vic.gov.au/',
        tooltip: 'Prepared by your conveyancer or solicitor',
        requiredFor: ['VIC']
    },
    transferOfLandQLD: {
        title: 'Transfer of Land Form (QLD)',
        category: 'State-Specific',
        description: 'QLD property transfer documentation',
        link: 'https://www.qld.gov.au/law/housing-and-neighbours/buying-and-selling-a-property',
        tooltip: 'Prepared by your conveyancer or solicitor',
        requiredFor: ['QLD']
    },
    transferOfLandSA: {
        title: 'Transfer of Land Form (SA)',
        category: 'State-Specific',
        description: 'SA property transfer documentation',
        link: 'https://www.sa.gov.au/',
        tooltip: 'Prepared by your conveyancer or solicitor',
        requiredFor: ['SA']
    },
    transferOfLandWA: {
        title: 'Transfer of Land Form (WA)',
        category: 'State-Specific',
        description: 'WA property transfer documentation',
        link: 'https://www.wa.gov.au/',
        tooltip: 'Prepared by your conveyancer or solicitor',
        requiredFor: ['WA']
    },
    transferOfLandTAS: {
        title: 'Transfer of Land Form (TAS)',
        category: 'State-Specific',
        description: 'TAS property transfer documentation',
        link: 'https://www.tas.gov.au/',
        tooltip: 'Prepared by your conveyancer or solicitor',
        requiredFor: ['TAS']
    },
    transferOfLandACT: {
        title: 'Transfer of Land Form (ACT)',
        category: 'State-Specific',
        description: 'ACT property transfer documentation',
        link: 'https://www.act.gov.au/',
        tooltip: 'Prepared by your conveyancer or solicitor',
        requiredFor: ['ACT']
    },
    transferOfLandNT: {
        title: 'Transfer of Land Form (NT)',
        category: 'State-Specific',
        description: 'NT property transfer documentation',
        link: 'https://nt.gov.au/',
        tooltip: 'Prepared by your conveyancer or solicitor',
        requiredFor: ['NT']
    },

    // Post-Approval Documents
    firbApproval: {
        title: 'FIRB Approval Certificate',
        category: 'Post-Approval',
        description: 'Your official FIRB approval notification',
        link: null,
        tooltip: 'Keep this certificate. You\'ll need it at settlement and for future reference.',
        requiredFor: ['all']
    },
    contractOfSale: {
        title: 'Signed Contract of Sale',
        category: 'Post-Approval',
        description: 'Executed purchase contract',
        link: null,
        tooltip: 'Only sign after receiving FIRB approval',
        requiredFor: ['all']
    },
    buildingInspection: {
        title: 'Building Inspection Report',
        category: 'Post-Approval',
        description: 'Professional building inspection',
        link: null,
        tooltip: 'Highly recommended for established properties. Not applicable for off-the-plan.',
        requiredFor: ['established', 'vacantLand']
    },
    pestInspection: {
        title: 'Pest Inspection Report',
        category: 'Post-Approval',
        description: 'Professional pest and termite inspection',
        link: null,
        tooltip: 'Highly recommended for established properties, especially in humid climates.',
        requiredFor: ['established']
    },

    // Additional Documents
    identityProof: {
        title: 'Additional Proof of Identity',
        category: 'FIRB Application',
        description: 'Driver license, birth certificate, or other ID',
        link: null,
        tooltip: 'May be required in addition to passport',
        requiredFor: ['all']
    },
    taxFileNumber: {
        title: 'Tax File Number (if applicable)',
        category: 'Financial',
        description: 'Australian Tax File Number',
        link: 'https://www.ato.gov.au/individuals-and-families/tax-file-number',
        tooltip: 'Required for property income tax purposes',
        requiredFor: ['all']
    },
    solicitorDetails: {
        title: 'Conveyancer/Solicitor Details',
        category: 'Professional Services',
        description: 'Details of your legal representative',
        link: null,
        tooltip: 'Engage before signing any contracts',
        requiredFor: ['all']
    }
};

/**
 * Generate personalized checklist based on user scenario
 */
function generatePersonalizedChecklist(scenario) {
    const items = [];

    // Determine user tags based on scenario
    const tags = new Set(['all']);

    // Citizenship/residency tags
    if (scenario.citizenshipStatus === 'temporary') {
        tags.add('temporary');
        if (scenario.visaType === 'bridging') {
            tags.add('bridging');
        }
    }

    // Entity type tags
    if (scenario.entityType === 'company') {
        tags.add('company');
    }

    // Property type tags
    if (scenario.propertyType) {
        tags.add(scenario.propertyType);
        if (scenario.propertyType === 'newDwelling' || scenario.propertyType === 'offThePlan') {
            tags.add('offThePlan');
            tags.add('newDwelling');
        }
    }

    // State tags
    if (scenario.state) {
        tags.add(scenario.state);
    }

    // First home owner tag
    if (scenario.isFirstHome) {
        tags.add(`${scenario.state}-firstHome`);
    }

    // Filter documents based on tags
    for (const [key, doc] of Object.entries(DOCUMENT_DATABASE)) {
        const isRequired = doc.requiredFor.some(req => tags.has(req));

        if (isRequired) {
            items.push({
                id: key,
                ...doc,
                completed: checklistState.completedItems.has(key)
            });
        }
    }

    // Group by category
    const grouped = {};
    items.forEach(item => {
        if (!grouped[item.category]) {
            grouped[item.category] = [];
        }
        grouped[item.category].push(item);
    });

    checklistState.items = items;
    checklistState.userScenario = scenario;

    return { items, grouped };
}

/**
 * Toggle checklist item completion
 */
function toggleChecklistItem(itemId) {
    if (checklistState.completedItems.has(itemId)) {
        checklistState.completedItems.delete(itemId);
    } else {
        checklistState.completedItems.add(itemId);
    }

    // Update item in state
    const item = checklistState.items.find(i => i.id === itemId);
    if (item) {
        item.completed = checklistState.completedItems.has(itemId);
    }

    // Save progress
    saveChecklistProgress();

    // Re-render
    render();
}

/**
 * Save checklist progress to localStorage
 */
function saveChecklistProgress() {
    try {
        const data = {
            completedItems: Array.from(checklistState.completedItems),
            userScenario: checklistState.userScenario,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(data));
        checklistState.lastUpdated = data.lastUpdated;

    } catch (error) {
        console.error('Error saving checklist progress:', error);
        if (typeof logError === 'function') {
            logError(error, 'saveChecklistProgress');
        }
    }
}

/**
 * Load checklist progress from localStorage
 */
function loadChecklistProgress() {
    try {
        const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            checklistState.completedItems = new Set(data.completedItems || []);
            checklistState.userScenario = data.userScenario;
            checklistState.lastUpdated = data.lastUpdated;
            return true;
        }
    } catch (error) {
        console.error('Error loading checklist progress:', error);
        if (typeof logError === 'function') {
            logError(error, 'loadChecklistProgress');
        }
    }
    return false;
}

/**
 * Calculate completion percentage
 */
function getCompletionPercentage() {
    if (checklistState.items.length === 0) return 0;
    return Math.round((checklistState.completedItems.size / checklistState.items.length) * 100);
}

/**
 * Get completion stats
 */
function getCompletionStats() {
    return {
        completed: checklistState.completedItems.size,
        total: checklistState.items.length,
        remaining: checklistState.items.length - checklistState.completedItems.size,
        percentage: getCompletionPercentage()
    };
}

/**
 * Reset checklist progress
 */
function resetChecklistProgress() {
    if (confirm('Reset all checklist progress? This cannot be undone.')) {
        checklistState.completedItems.clear();
        checklistState.items.forEach(item => {
            item.completed = false;
        });
        saveChecklistProgress();

        if (typeof showToast === 'function') {
            showToast('Checklist progress reset', 'info');
        }

        render();
    }
}

/**
 * Print checklist
 */
function printChecklist() {
    window.print();
}

/**
 * Export checklist as PDF
 */
async function exportChecklistPDF() {
    try {
        if (typeof showToast === 'function') {
            showToast('Generating checklist PDF...', 'info', 3000);
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const stats = getCompletionStats();
        const { grouped } = generatePersonalizedChecklist(checklistState.userScenario);

        // Header with branding
        doc.setFillColor(37, 99, 235); // Blue
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('FIRB Document Checklist', 14, 20);

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('Personalized for Your Purchase', 14, 28);

        // Progress bar
        const progressWidth = 180;
        const progressX = 14;
        const progressY = 35;

        doc.setFillColor(255, 255, 255);
        doc.rect(progressX, progressY, progressWidth, 3, 'F');

        doc.setFillColor(34, 197, 94); // Green
        doc.rect(progressX, progressY, (progressWidth * stats.percentage) / 100, 3, 'F');

        // Reset text color
        doc.setTextColor(0, 0, 0);

        let yPos = 50;

        // Stats
        doc.setFontSize(10);
        doc.text(`Progress: ${stats.completed}/${stats.total} items completed (${stats.percentage}%)`, 14, yPos);
        yPos += 5;
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yPos);
        yPos += 10;

        // Scenario details
        if (checklistState.userScenario) {
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text('Your Scenario:', 14, yPos);
            yPos += 6;

            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');

            const scenario = checklistState.userScenario;
            if (scenario.state) {
                doc.text(`State: ${scenario.state}`, 14, yPos);
                yPos += 5;
            }
            if (scenario.propertyType) {
                doc.text(`Property Type: ${getPropertyTypeLabel(scenario.propertyType)}`, 14, yPos);
                yPos += 5;
            }
            if (scenario.citizenshipStatus) {
                doc.text(`Status: ${scenario.citizenshipStatus}`, 14, yPos);
                yPos += 5;
            }

            yPos += 5;
        }

        // Checklist items by category
        const categories = Object.keys(grouped);

        for (const category of categories) {
            const items = grouped[category];

            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            // Category header
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setFillColor(243, 244, 246); // Gray background
            doc.rect(14, yPos - 5, 182, 8, 'F');
            doc.text(category, 16, yPos);
            yPos += 10;

            // Items
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');

            items.forEach(item => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }

                // Checkbox
                const checkboxSize = 4;
                doc.rect(14, yPos - 3, checkboxSize, checkboxSize);

                // Checkmark if completed
                if (item.completed) {
                    doc.setFont(undefined, 'bold');
                    doc.text('✓', 14.5, yPos + 0.5);
                    doc.setFont(undefined, 'normal');
                }

                // Item text
                const itemText = doc.splitTextToSize(item.title, 160);
                doc.text(itemText, 20, yPos);
                yPos += itemText.length * 5;

                // Description
                if (item.description) {
                    doc.setFontSize(8);
                    doc.setTextColor(100, 100, 100);
                    const descText = doc.splitTextToSize(item.description, 160);
                    doc.text(descText, 20, yPos);
                    yPos += descText.length * 4;
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(9);
                }

                // Link
                if (item.link) {
                    doc.setTextColor(37, 99, 235);
                    doc.textWithLink('→ Get this document', 20, yPos, { url: item.link });
                    doc.setTextColor(0, 0, 0);
                    yPos += 5;
                }

                yPos += 3;
            });

            yPos += 5;
        }

        // Footer on all pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128);
            doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
            doc.text('Generated by FIRB Calculator', doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });
        }

        // Save
        doc.save(`FIRB-Document-Checklist-${new Date().toISOString().split('T')[0]}.pdf`);

        if (typeof showToast === 'function') {
            showToast('Checklist PDF downloaded!', 'success');
        }

    } catch (error) {
        console.error('Error exporting checklist PDF:', error);
        if (typeof showToast === 'function') {
            showToast('Failed to generate PDF', 'error');
        }
        if (typeof logError === 'function') {
            logError(error, 'exportChecklistPDF');
        }
    }
}

/**
 * Email checklist to user
 */
function emailChecklist() {
    if (typeof showEmailChecklistModal === 'function') {
        showEmailChecklistModal();
    } else {
        if (typeof showToast === 'function') {
            showToast('Email functionality not available', 'error');
        }
    }
}

/**
 * Generate checklist from current state
 */
function generateChecklistFromState() {
    const scenario = {
        citizenshipStatus: state.citizenshipStatus || (wizardState?.answers?.citizenshipStatus),
        visaType: state.visaType || (wizardState?.answers?.visaType),
        propertyType: state.propertyType,
        state: state.state,
        entityType: state.entityType || 'individual',
        isFirstHome: state.isFirstHome || false
    };

    return generatePersonalizedChecklist(scenario);
}

/**
 * Show checklist modal
 */
function showChecklistModal() {
    // Generate checklist from current state
    generateChecklistFromState();

    // Navigate to checklist page
    state.currentStep = 'checklist';
    render();
}

// Initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        loadChecklistProgress();
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generatePersonalizedChecklist,
        toggleChecklistItem,
        getCompletionStats,
        exportChecklistPDF,
        showChecklistModal
    };
}
