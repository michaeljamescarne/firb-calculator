/**
 * Professional PDF Export System
 * Generates comprehensive FIRB calculation reports with cover page, executive summary,
 * detailed calculations, compliance checklist, next steps, and appendix
 */

// PDF Configuration
const PDF_CONFIG = {
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    margins: {
        top: 25,
        bottom: 25,
        left: 20,
        right: 20
    },
    colors: {
        primary: [37, 99, 235], // Blue-600
        secondary: [71, 85, 105], // Slate-600
        success: [34, 197, 94], // Green-500
        warning: [234, 179, 8], // Yellow-500
        danger: [239, 68, 68], // Red-500
        lightGray: [243, 244, 246], // Gray-100
        darkGray: [75, 85, 99] // Gray-600
    },
    fonts: {
        heading: 16,
        subheading: 14,
        body: 10,
        small: 8
    }
};

/**
 * Generate and download professional PDF report
 */
async function generateProfessionalPDF() {
    try {
        // Get jsPDF from global scope
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF(PDF_CONFIG.orientation, PDF_CONFIG.unit, PDF_CONFIG.format);

        const fees = state.calculatedFees;
        if (!fees) {
            alert('No calculation results available. Please complete a calculation first.');
            return;
        }

        // Get user inputs for the report
        const userInfo = await getUserInfoForPDF();
        if (!userInfo) return; // User cancelled

        let currentPage = 1;

        // 1. COVER PAGE
        await addCoverPage(doc, fees, userInfo);
        currentPage++;

        // 2. EXECUTIVE SUMMARY
        doc.addPage();
        addExecutiveSummary(doc, fees, userInfo, currentPage);
        currentPage++;

        // 3. DETAILED CALCULATIONS (multiple pages)
        doc.addPage();
        const calcPages = addDetailedCalculations(doc, fees, currentPage);
        currentPage += calcPages;

        // 4. VISUAL CHARTS
        doc.addPage();
        await addVisualCharts(doc, currentPage);
        currentPage++;

        // 5. COST OPTIMIZATION INSIGHTS
        if (optimizerState.optimizations) {
            doc.addPage();
            addCostOptimization(doc, currentPage);
            currentPage++;
        }

        // 6. COMPLIANCE CHECKLIST
        doc.addPage();
        addComplianceChecklist(doc, fees, currentPage);
        currentPage++;

        // 7. NEXT STEPS & TIMELINE
        doc.addPage();
        addNextSteps(doc, fees, currentPage);
        currentPage++;

        // 8. APPENDIX
        doc.addPage();
        const appendixPages = addAppendix(doc, currentPage);
        currentPage += appendixPages;

        // Add page numbers and footers to all pages
        addHeadersFooters(doc, doc.internal.getNumberOfPages(), userInfo.preparedDate);

        // Save the PDF
        const filename = `FIRB_Report_${userInfo.propertyAddress.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);

    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Please try again.');
    }
}

/**
 * Prompt user for report information
 */
function getUserInfoForPDF() {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-xl font-bold text-gray-900 mb-4">PDF Report Information</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Property Address/Description</label>
                        <input type="text" id="pdf-property-address"
                            class="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="e.g., 123 Collins St, Melbourne VIC 3000"
                            value="${state.formData.propertyValue ? 'Property valued at ' + formatCurrency(state.formData.propertyValue) : ''}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Prepared For (Your Name)</label>
                        <input type="text" id="pdf-user-name"
                            class="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="e.g., John Smith">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                        <input type="email" id="pdf-user-email"
                            class="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="e.g., john@example.com">
                    </div>
                </div>
                <div class="flex gap-3 mt-6">
                    <button onclick="this.closest('.fixed').remove(); window.pdfResolve(null);"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onclick="window.submitPDFInfo()"
                        class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Generate PDF
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        window.pdfResolve = resolve;
        window.submitPDFInfo = () => {
            const propertyAddress = document.getElementById('pdf-property-address').value || 'Property';
            const userName = document.getElementById('pdf-user-name').value || 'Prospective Buyer';
            const userEmail = document.getElementById('pdf-user-email').value || '';

            modal.remove();
            resolve({
                propertyAddress,
                userName,
                userEmail,
                preparedDate: new Date().toLocaleDateString('en-AU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            });
        };
    });
}

/**
 * Add cover page
 */
async function addCoverPage(doc, fees, userInfo) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background gradient effect (using rectangles)
    doc.setFillColor(...PDF_CONFIG.colors.primary);
    doc.rect(0, 0, pageWidth, 80, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text('FIRB COST ANALYSIS', pageWidth / 2, 35, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont(undefined, 'normal');
    doc.text('Foreign Investment Review Board', pageWidth / 2, 45, { align: 'center' });
    doc.text('Complete Cost Breakdown & Report', pageWidth / 2, 55, { align: 'center' });

    // Property information box
    doc.setFillColor(...PDF_CONFIG.colors.lightGray);
    doc.roundedRect(20, 95, pageWidth - 40, 40, 3, 3, 'F');

    doc.setTextColor(...PDF_CONFIG.colors.darkGray);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Property:', 25, 105);
    doc.setFont(undefined, 'normal');
    doc.text(userInfo.propertyAddress, 25, 112);

    doc.setFont(undefined, 'bold');
    doc.text('Prepared For:', 25, 122);
    doc.setFont(undefined, 'normal');
    doc.text(userInfo.userName, 25, 129);

    // Key metrics boxes
    const boxY = 150;
    const boxWidth = (pageWidth - 50) / 2;

    // Total Investment box
    doc.setFillColor(...PDF_CONFIG.colors.primary);
    doc.roundedRect(20, boxY, boxWidth - 5, 35, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('TOTAL UPFRONT COSTS', pageWidth / 4, boxY + 10, { align: 'center' });
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(formatCurrency(fees.grandTotal), pageWidth / 4, boxY + 25, { align: 'center' });

    // Eligibility box
    const isEligible = state.isEligible && state.isEligible.required;
    const eligibilityColor = isEligible ? PDF_CONFIG.colors.success : PDF_CONFIG.colors.danger;
    doc.setFillColor(...eligibilityColor);
    doc.roundedRect(pageWidth / 2 + 2.5, boxY, boxWidth - 5, 35, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('FIRB ELIGIBILITY', 3 * pageWidth / 4, boxY + 10, { align: 'center' });
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(isEligible ? 'ELIGIBLE ✓' : 'NOT ELIGIBLE ✗', 3 * pageWidth / 4, boxY + 25, { align: 'center' });

    // Date and branding
    doc.setTextColor(...PDF_CONFIG.colors.darkGray);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Prepared on: ' + userInfo.preparedDate, pageWidth / 2, 200, { align: 'center' });

    // Branding
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('FIRB Calculator', pageWidth / 2, 220, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Professional Property Investment Analysis', pageWidth / 2, 227, { align: 'center' });

    // Disclaimer box at bottom
    doc.setFillColor(255, 249, 235); // Light yellow
    doc.roundedRect(20, pageHeight - 60, pageWidth - 40, 35, 3, 3, 'F');
    doc.setTextColor(146, 64, 14); // Dark orange
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text('IMPORTANT DISCLAIMER', 25, pageHeight - 54);
    doc.setFont(undefined, 'normal');
    const disclaimerText = 'This report is for informational purposes only and does not constitute financial, legal, or tax advice. ' +
        'All calculations are estimates based on current regulations and the information provided. ' +
        'You should consult with qualified professionals before making any property purchase decisions.';
    const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - 50);
    doc.text(disclaimerLines, 25, pageHeight - 48);
}

/**
 * Add executive summary page
 */
function addExecutiveSummary(doc, fees, userInfo, pageNum) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Page title
    doc.setFontSize(PDF_CONFIG.fonts.heading);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...PDF_CONFIG.colors.primary);
    doc.text('EXECUTIVE SUMMARY', PDF_CONFIG.margins.left, 40);

    // Key findings
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setTextColor(...PDF_CONFIG.colors.darkGray);
    doc.text('Key Findings', PDF_CONFIG.margins.left, 55);

    const findings = [
        `Total upfront investment required: ${formatCurrency(fees.grandTotal)}`,
        `FIRB application fee: ${formatCurrency(fees.firbApplicationFee)}`,
        `Total stamp duty (including surcharge): ${formatCurrency(fees.stampDuty + fees.surchargeStampDuty)}`,
        `Property type: ${state.formData.propertyType === 'new' ? 'New dwelling/apartment' : 'Established dwelling'} in ${state.formData.state}`
    ];

    if (fees.landTaxSurcharge && fees.landTaxSurcharge > 0) {
        findings.push(`Annual land tax surcharge: ${formatCurrency(fees.landTaxSurcharge)}`);
    }

    doc.setFontSize(PDF_CONFIG.fonts.body);
    doc.setFont(undefined, 'normal');
    let yPos = 65;
    findings.forEach(finding => {
        doc.setFillColor(...PDF_CONFIG.colors.primary);
        doc.circle(PDF_CONFIG.margins.left + 2, yPos - 2, 1, 'F');
        doc.text(finding, PDF_CONFIG.margins.left + 6, yPos);
        yPos += 7;
    });

    // Cost breakdown summary table
    yPos += 10;
    doc.autoTable({
        startY: yPos,
        head: [['Cost Component', 'Amount', '% of Total']],
        body: [
            ['FIRB Application Fee', formatCurrency(fees.firbApplicationFee),
                ((fees.firbApplicationFee / fees.grandTotal) * 100).toFixed(1) + '%'],
            ['Base Stamp Duty', formatCurrency(fees.stampDuty),
                ((fees.stampDuty / fees.grandTotal) * 100).toFixed(1) + '%'],
            ['Foreign Buyer Surcharge', formatCurrency(fees.surchargeStampDuty),
                ((fees.surchargeStampDuty / fees.grandTotal) * 100).toFixed(1) + '%'],
            fees.landTaxSurcharge > 0
                ? ['Land Tax Surcharge (Annual)', formatCurrency(fees.landTaxSurcharge), 'N/A']
                : null
        ].filter(Boolean),
        foot: [['TOTAL UPFRONT COSTS', formatCurrency(fees.grandTotal), '100%']],
        theme: 'grid',
        headStyles: {
            fillColor: PDF_CONFIG.colors.primary,
            fontSize: PDF_CONFIG.fonts.body,
            fontStyle: 'bold'
        },
        footStyles: {
            fillColor: PDF_CONFIG.colors.darkGray,
            fontSize: PDF_CONFIG.fonts.body,
            fontStyle: 'bold'
        },
        styles: { fontSize: PDF_CONFIG.fonts.body },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    // Eligibility status
    yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.text('Eligibility Status', PDF_CONFIG.margins.left, yPos);

    const isEligible = state.isEligible && state.isEligible.required;
    yPos += 10;
    doc.setFontSize(PDF_CONFIG.fonts.body);
    doc.setFont(undefined, 'normal');

    if (isEligible) {
        doc.setTextColor(...PDF_CONFIG.colors.success);
        doc.text('✓ ELIGIBLE - FIRB approval required for this purchase', PDF_CONFIG.margins.left, yPos);
        doc.setTextColor(...PDF_CONFIG.colors.darkGray);
        doc.text('You must apply for and receive FIRB approval before signing a contract.', PDF_CONFIG.margins.left, yPos + 7);
    } else {
        doc.setTextColor(...PDF_CONFIG.colors.danger);
        doc.text('✗ NOT ELIGIBLE - FIRB approval may not be required', PDF_CONFIG.margins.left, yPos);
        doc.setTextColor(...PDF_CONFIG.colors.darkGray);
        doc.text('Based on your inputs, you may not need FIRB approval. Verify with a professional.',
            PDF_CONFIG.margins.left, yPos + 7);
    }

    // Recommendation
    yPos += 20;
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...PDF_CONFIG.colors.primary);
    doc.text('Recommendation', PDF_CONFIG.margins.left, yPos);

    yPos += 10;
    doc.setFontSize(PDF_CONFIG.fonts.body);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...PDF_CONFIG.colors.darkGray);

    const recommendation = isEligible
        ? 'Proceed with FIRB application immediately. Budget ' + formatCurrency(fees.grandTotal) +
          ' for upfront costs. Review the compliance checklist and timeline on page 6.'
        : 'Verify your eligibility status with an immigration lawyer before proceeding. ' +
          'If you are a temporary resident, you will likely need FIRB approval.';

    const recLines = doc.splitTextToSize(recommendation, pageWidth - PDF_CONFIG.margins.left - PDF_CONFIG.margins.right);
    doc.text(recLines, PDF_CONFIG.margins.left, yPos);
}

/**
 * Add detailed calculations pages
 */
function addDetailedCalculations(doc, fees, startPage) {
    const pageWidth = doc.internal.pageSize.getWidth();
    let pages = 0;

    // Page title
    doc.setFontSize(PDF_CONFIG.fonts.heading);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...PDF_CONFIG.colors.primary);
    doc.text('DETAILED COST BREAKDOWN', PDF_CONFIG.margins.left, 40);

    // Property details
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setTextColor(...PDF_CONFIG.colors.darkGray);
    doc.text('Property Details', PDF_CONFIG.margins.left, 55);

    const propertyDetails = [
        ['Purchase Price', formatCurrency(state.formData.propertyValue)],
        ['Property Type', state.formData.propertyType === 'new' ? 'New Dwelling/Apartment' : 'Established Dwelling'],
        ['State/Territory', state.formData.state],
        ['First Time Buyer', state.formData.firstTimeBuyer ? 'Yes' : 'No'],
        ['Entity Type', state.formData.entityType === 'individual' ? 'Individual' : 'Company/Trust']
    ];

    doc.autoTable({
        startY: 62,
        body: propertyDetails,
        theme: 'plain',
        styles: {
            fontSize: PDF_CONFIG.fonts.body,
            cellPadding: 2
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 60 },
            1: { cellWidth: 'auto' }
        },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    // FIRB Application Fee Breakdown
    let yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.text('1. FIRB Application Fee', PDF_CONFIG.margins.left, yPos);

    yPos += 7;
    doc.setFontSize(PDF_CONFIG.fonts.body);
    doc.setFont(undefined, 'normal');
    const firbDesc = state.formData.entityType === 'individual'
        ? 'Individual applicant rate based on purchase price'
        : 'Entity (company/trust) rate - significantly higher than individual rates';
    doc.text(firbDesc, PDF_CONFIG.margins.left, yPos);

    doc.autoTable({
        startY: yPos + 5,
        body: [
            ['Base FIRB Fee', formatCurrency(fees.firbApplicationFee)],
            ['Processing Time', '30-60 days (typical)'],
            ['Payment', 'Due at application submission']
        ],
        theme: 'striped',
        styles: { fontSize: PDF_CONFIG.fonts.body },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 60 }
        },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    // Stamp Duty Breakdown
    yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.text('2. Stamp Duty', PDF_CONFIG.margins.left, yPos);

    doc.autoTable({
        startY: yPos + 7,
        head: [['Component', 'Amount', 'Notes']],
        body: [
            ['Base Stamp Duty', formatCurrency(fees.stampDuty),
                state.formData.state + ' rate'],
            ['Foreign Buyer Surcharge', formatCurrency(fees.surchargeStampDuty),
                fees.surchargeStampDuty > 0 ? 'Additional surcharge for foreign buyers' : 'N/A']
        ],
        foot: [['Total Stamp Duty', formatCurrency(fees.stampDuty + fees.surchargeStampDuty), '']],
        theme: 'grid',
        headStyles: {
            fillColor: PDF_CONFIG.colors.primary,
            fontSize: PDF_CONFIG.fonts.body
        },
        footStyles: {
            fillColor: PDF_CONFIG.colors.darkGray,
            fontStyle: 'bold'
        },
        styles: { fontSize: PDF_CONFIG.fonts.body },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    // Land Tax (if applicable)
    if (fees.landTaxSurcharge && fees.landTaxSurcharge > 0) {
        yPos = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(PDF_CONFIG.fonts.subheading);
        doc.setFont(undefined, 'bold');
        doc.text('3. Annual Land Tax Surcharge', PDF_CONFIG.margins.left, yPos);

        yPos += 7;
        doc.setFontSize(PDF_CONFIG.fonts.body);
        doc.setFont(undefined, 'normal');
        doc.text('Ongoing annual obligation for foreign owners:', PDF_CONFIG.margins.left, yPos);

        doc.autoTable({
            startY: yPos + 5,
            body: [
                ['Annual Surcharge', formatCurrency(fees.landTaxSurcharge)],
                ['Payment Frequency', 'Annually'],
                ['Note', 'Continues each year you own the property']
            ],
            theme: 'striped',
            styles: { fontSize: PDF_CONFIG.fonts.body },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 60 }
            },
            margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
        });
    }

    // State comparison table
    if (doc.lastAutoTable.finalY > 200) {
        doc.addPage();
        pages++;
        yPos = 40;
    } else {
        yPos = doc.lastAutoTable.finalY + 15;
    }

    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...PDF_CONFIG.colors.primary);
    doc.text('State Comparison', PDF_CONFIG.margins.left, yPos);

    yPos += 7;
    doc.setFontSize(PDF_CONFIG.fonts.small);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...PDF_CONFIG.colors.darkGray);
    doc.text('What the same property would cost in other states/territories:', PDF_CONFIG.margins.left, yPos);

    // Generate state comparison data
    const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
    const comparisonData = states.map(st => {
        const calc = calculateFees({
            ...state.formData,
            state: st
        });
        return [
            st,
            formatCurrency(calc.firbApplicationFee),
            formatCurrency(calc.stampDuty + calc.surchargeStampDuty),
            formatCurrency(calc.grandTotal),
            st === state.formData.state ? '← Current' : ''
        ];
    });

    doc.autoTable({
        startY: yPos + 5,
        head: [['State', 'FIRB Fee', 'Total Stamp Duty', 'Total Cost', '']],
        body: comparisonData,
        theme: 'grid',
        headStyles: {
            fillColor: PDF_CONFIG.colors.primary,
            fontSize: PDF_CONFIG.fonts.small
        },
        styles: { fontSize: PDF_CONFIG.fonts.small },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    return pages;
}

/**
 * Add visual charts page
 */
async function addVisualCharts(doc, pageNum) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Page title
    doc.setFontSize(PDF_CONFIG.fonts.heading);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...PDF_CONFIG.colors.primary);
    doc.text('VISUAL ANALYSIS', PDF_CONFIG.margins.left, 40);

    // Cost breakdown chart
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setTextColor(...PDF_CONFIG.colors.darkGray);
    doc.text('Cost Breakdown', PDF_CONFIG.margins.left, 55);

    const fees = state.calculatedFees;

    // Create a simple bar chart using rectangles
    const chartY = 65;
    const chartHeight = 60;
    const barWidth = 35;
    const spacing = 10;

    const components = [
        { label: 'FIRB Fee', value: fees.firbApplicationFee, color: PDF_CONFIG.colors.primary },
        { label: 'Base Duty', value: fees.stampDuty, color: PDF_CONFIG.colors.secondary },
        { label: 'Surcharge', value: fees.surchargeStampDuty, color: PDF_CONFIG.colors.warning }
    ];

    const maxValue = Math.max(...components.map(c => c.value));

    let xPos = PDF_CONFIG.margins.left;
    components.forEach(comp => {
        const barHeight = (comp.value / maxValue) * chartHeight;
        const barY = chartY + chartHeight - barHeight;

        doc.setFillColor(...comp.color);
        doc.rect(xPos, barY, barWidth, barHeight, 'F');

        doc.setFontSize(PDF_CONFIG.fonts.small);
        doc.setTextColor(...PDF_CONFIG.colors.darkGray);
        doc.text(comp.label, xPos + barWidth / 2, chartY + chartHeight + 5, { align: 'center' });
        doc.text(formatCurrency(comp.value), xPos + barWidth / 2, chartY + chartHeight + 10, { align: 'center' });

        xPos += barWidth + spacing;
    });

    // Try to capture investment chart if available
    const investmentChartEl = document.getElementById('investment-property-chart');
    if (investmentChartEl && typeof html2canvas !== 'undefined') {
        try {
            doc.setFontSize(PDF_CONFIG.fonts.subheading);
            doc.setTextColor(...PDF_CONFIG.colors.darkGray);
            doc.text('Investment Projection', PDF_CONFIG.margins.left, chartY + chartHeight + 25);

            const canvas = await html2canvas(investmentChartEl, {
                scale: 2,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - PDF_CONFIG.margins.left - PDF_CONFIG.margins.right;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            doc.addImage(imgData, 'PNG', PDF_CONFIG.margins.left, chartY + chartHeight + 30, imgWidth, Math.min(imgHeight, 80));
        } catch (err) {
            console.warn('Could not capture investment chart:', err);
        }
    }
}

/**
 * Add cost optimization insights
 */
function addCostOptimization(doc, pageNum) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Page title
    doc.setFontSize(PDF_CONFIG.fonts.heading);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...PDF_CONFIG.colors.primary);
    doc.text('COST OPTIMIZATION OPPORTUNITIES', PDF_CONFIG.margins.left, 40);

    const opts = optimizerState.optimizations;
    if (!opts) return;

    // Total potential savings
    doc.setFillColor(...PDF_CONFIG.colors.success);
    doc.roundedRect(PDF_CONFIG.margins.left, 50, pageWidth - 2 * PDF_CONFIG.margins.left, 25, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDF_CONFIG.fonts.body);
    doc.text('Maximum Potential Savings', PDF_CONFIG.margins.left + 5, 58);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(formatCurrency(opts.totalPotentialSavings), PDF_CONFIG.margins.left + 5, 68);

    // Optimization strategies
    let yPos = 85;
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...PDF_CONFIG.colors.darkGray);
    doc.text('Strategies', PDF_CONFIG.margins.left, yPos);

    const strategies = [];

    // Property type
    if (opts.propertyType.savings > 0) {
        strategies.push([
            'Switch to New Property',
            formatCurrency(opts.propertyType.savings),
            'Low',
            'Immediate'
        ]);
    }

    // State arbitrage
    if (opts.stateArbitrage.maxSavings > 0) {
        const best = opts.stateArbitrage.bestAlternative;
        strategies.push([
            `Consider ${best.city}`,
            formatCurrency(best.savings),
            'Medium',
            'Future purchase'
        ]);
    }

    // Timing
    if (opts.timing.top3Pathways[0].worthIt) {
        const pathway = opts.timing.top3Pathways[0];
        strategies.push([
            `Wait for PR (${pathway.visaCode})`,
            formatCurrency(pathway.totalSavings),
            'High',
            `${pathway.yearsToWait} years`
        ]);
    }

    // Structure
    if (opts.structure.maxSavings > 0) {
        strategies.push([
            opts.structure.bestOption.structure,
            formatCurrency(opts.structure.maxSavings),
            'High',
            'Legal advice required'
        ]);
    }

    if (strategies.length > 0) {
        doc.autoTable({
            startY: yPos + 7,
            head: [['Strategy', 'Potential Savings', 'Complexity', 'Timeframe']],
            body: strategies,
            theme: 'grid',
            headStyles: {
                fillColor: PDF_CONFIG.colors.primary,
                fontSize: PDF_CONFIG.fonts.body
            },
            styles: { fontSize: PDF_CONFIG.fonts.body },
            margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
        });

        yPos = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(PDF_CONFIG.fonts.small);
        doc.setFont(undefined, 'italic');
        doc.setTextColor(...PDF_CONFIG.colors.darkGray);
        const disclaimer = 'Note: These are potential savings only. Consult with qualified professionals before implementing any strategy.';
        const lines = doc.splitTextToSize(disclaimer, pageWidth - 2 * PDF_CONFIG.margins.left);
        doc.text(lines, PDF_CONFIG.margins.left, yPos);
    }
}

/**
 * Add compliance checklist page
 */
function addComplianceChecklist(doc, fees, pageNum) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Page title
    doc.setFontSize(PDF_CONFIG.fonts.heading);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...PDF_CONFIG.colors.primary);
    doc.text('COMPLIANCE CHECKLIST', PDF_CONFIG.margins.left, 40);

    // Documents required
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setTextColor(...PDF_CONFIG.colors.darkGray);
    doc.text('Documents Required for FIRB Application', PDF_CONFIG.margins.left, 55);

    const documents = [
        ['☐', 'Completed FIRB application form'],
        ['☐', 'Proof of identity (passport copy)'],
        ['☐', 'Visa documentation (current visa details)'],
        ['☐', 'Contract of sale or option to purchase'],
        ['☐', 'Property valuation or purchase price evidence'],
        ['☐', 'Application fee payment receipt'],
        ['☐', 'Trust deed (if purchasing through trust)'],
        ['☐', 'Company registration (if purchasing through company)']
    ];

    doc.autoTable({
        startY: 62,
        body: documents,
        theme: 'plain',
        styles: {
            fontSize: PDF_CONFIG.fonts.body,
            cellPadding: 2
        },
        columnStyles: {
            0: { cellWidth: 8, fontStyle: 'bold' },
            1: { cellWidth: 'auto' }
        },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    // Key deadlines
    let yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.text('Key Deadlines', PDF_CONFIG.margins.left, yPos);

    const deadlines = [
        ['FIRB Application', 'BEFORE signing contract of sale', 'Critical'],
        ['Application Fee Payment', 'At time of application submission', 'Critical'],
        ['FIRB Decision', '30-60 days (typically)', 'Expected'],
        ['Stamp Duty Payment', 'Within 30 days of settlement (varies by state)', 'Critical'],
        ['Settlement', 'Only after FIRB approval received', 'Critical']
    ];

    doc.autoTable({
        startY: yPos + 7,
        head: [['Milestone', 'Timing', 'Priority']],
        body: deadlines,
        theme: 'grid',
        headStyles: {
            fillColor: PDF_CONFIG.colors.primary,
            fontSize: PDF_CONFIG.fonts.body
        },
        styles: { fontSize: PDF_CONFIG.fonts.body },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    // Annual obligations
    yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.text('Annual Obligations', PDF_CONFIG.margins.left, yPos);

    const obligations = [
        ['☐', 'Land tax surcharge payment', fees.landTaxSurcharge > 0 ? formatCurrency(fees.landTaxSurcharge) + '/year' : 'N/A'],
        ['☐', 'Annual vacancy fee (if left vacant)', '$5,500 - $11,000 (if applicable)'],
        ['☐', 'Property tax returns', 'If rental income earned'],
        ['☐', 'FIRB compliance reporting', 'If required by approval conditions']
    ];

    doc.autoTable({
        startY: yPos + 7,
        body: obligations,
        theme: 'striped',
        styles: { fontSize: PDF_CONFIG.fonts.body },
        columnStyles: {
            0: { cellWidth: 8, fontStyle: 'bold' },
            1: { cellWidth: 80 },
            2: { cellWidth: 'auto' }
        },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    // Important notes
    yPos = doc.lastAutoTable.finalY + 10;
    doc.setFillColor(255, 243, 224); // Light orange
    doc.roundedRect(PDF_CONFIG.margins.left, yPos, pageWidth - 2 * PDF_CONFIG.margins.left, 25, 3, 3, 'F');

    doc.setFontSize(PDF_CONFIG.fonts.small);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(194, 65, 12); // Dark orange
    doc.text('⚠ IMPORTANT', PDF_CONFIG.margins.left + 5, yPos + 6);
    doc.setFont(undefined, 'normal');
    const warning = 'Do NOT sign a contract of sale before receiving FIRB approval. Signing without approval may result in ' +
        'penalties, forced sale, and criminal prosecution.';
    const warningLines = doc.splitTextToSize(warning, pageWidth - 2 * PDF_CONFIG.margins.left - 10);
    doc.text(warningLines, PDF_CONFIG.margins.left + 5, yPos + 12);
}

/**
 * Add next steps page
 */
function addNextSteps(doc, fees, pageNum) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Page title
    doc.setFontSize(PDF_CONFIG.fonts.heading);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...PDF_CONFIG.colors.primary);
    doc.text('NEXT STEPS & ACTION PLAN', PDF_CONFIG.margins.left, 40);

    // Immediate actions
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setTextColor(...PDF_CONFIG.colors.darkGray);
    doc.text('Immediate Actions (This Week)', PDF_CONFIG.margins.left, 55);

    const immediateActions = [
        ['1', 'Verify visa status and eligibility', 'Confirm with immigration lawyer'],
        ['2', 'Prepare required documents', 'See compliance checklist'],
        ['3', 'Budget for upfront costs', formatCurrency(fees.grandTotal)],
        ['4', 'Engage qualified advisors', 'Lawyer, accountant, mortgage broker']
    ];

    doc.autoTable({
        startY: 62,
        body: immediateActions,
        theme: 'striped',
        styles: { fontSize: PDF_CONFIG.fonts.body },
        columnStyles: {
            0: { cellWidth: 10, fontStyle: 'bold', halign: 'center' },
            1: { cellWidth: 70, fontStyle: 'bold' },
            2: { cellWidth: 'auto' }
        },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    // Short-term (1-3 months)
    let yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.text('Short-term (1-3 Months)', PDF_CONFIG.margins.left, yPos);

    const shortTermActions = [
        ['5', 'Complete FIRB application', 'Submit with fee payment'],
        ['6', 'Property search and inspection', 'Only inspect, do not sign contracts'],
        ['7', 'Arrange pre-approval for finance', 'Foreign buyer lending criteria'],
        ['8', 'Await FIRB decision', '30-60 days typical processing']
    ];

    doc.autoTable({
        startY: yPos + 7,
        body: shortTermActions,
        theme: 'striped',
        styles: { fontSize: PDF_CONFIG.fonts.body },
        columnStyles: {
            0: { cellWidth: 10, fontStyle: 'bold', halign: 'center' },
            1: { cellWidth: 70, fontStyle: 'bold' },
            2: { cellWidth: 'auto' }
        },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    // After FIRB approval
    yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.text('After FIRB Approval', PDF_CONFIG.margins.left, yPos);

    const postApprovalActions = [
        ['9', 'Sign contract of sale', 'Only after approval received'],
        ['10', 'Pay stamp duty', 'Within state deadlines'],
        ['11', 'Arrange building inspection', 'Due diligence'],
        ['12', 'Finalize mortgage approval', 'Formal loan approval'],
        ['13', 'Prepare for settlement', 'Coordinate with solicitor'],
        ['14', 'Settle property purchase', 'Transfer of ownership']
    ];

    doc.autoTable({
        startY: yPos + 7,
        body: postApprovalActions,
        theme: 'striped',
        styles: { fontSize: PDF_CONFIG.fonts.body },
        columnStyles: {
            0: { cellWidth: 10, fontStyle: 'bold', halign: 'center' },
            1: { cellWidth: 70, fontStyle: 'bold' },
            2: { cellWidth: 'auto' }
        },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    // Professional contacts
    yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.text('Recommended Professional Services', PDF_CONFIG.margins.left, yPos);

    const professionals = [
        ['Immigration Lawyer', 'Verify visa status and FIRB eligibility'],
        ['Property Lawyer/Conveyancer', 'Contract review and settlement'],
        ['Tax Accountant', 'Tax implications and structuring'],
        ['Mortgage Broker', 'Foreign buyer financing options'],
        ['Financial Advisor', 'Investment strategy and planning']
    ];

    doc.autoTable({
        startY: yPos + 7,
        body: professionals,
        theme: 'grid',
        headStyles: {
            fillColor: PDF_CONFIG.colors.primary,
            fontSize: PDF_CONFIG.fonts.body
        },
        styles: { fontSize: PDF_CONFIG.fonts.body },
        columnStyles: {
            0: { cellWidth: 60, fontStyle: 'bold' },
            1: { cellWidth: 'auto' }
        },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    // Contact information
    yPos = doc.lastAutoTable.finalY + 10;
    doc.setFillColor(...PDF_CONFIG.colors.lightGray);
    doc.roundedRect(PDF_CONFIG.margins.left, yPos, pageWidth - 2 * PDF_CONFIG.margins.left, 20, 3, 3, 'F');

    doc.setFontSize(PDF_CONFIG.fonts.small);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...PDF_CONFIG.colors.darkGray);
    doc.text('Questions about this report?', PDF_CONFIG.margins.left + 5, yPos + 7);
    doc.setFont(undefined, 'normal');
    doc.text('Visit our website or contact a qualified professional for personalized advice.',
        PDF_CONFIG.margins.left + 5, yPos + 13);
}

/**
 * Add appendix pages
 */
function addAppendix(doc, startPage) {
    const pageWidth = doc.internal.pageSize.getWidth();
    let pages = 0;

    // Page title
    doc.setFontSize(PDF_CONFIG.fonts.heading);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...PDF_CONFIG.colors.primary);
    doc.text('APPENDIX', PDF_CONFIG.margins.left, 40);

    // A. Source References
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setTextColor(...PDF_CONFIG.colors.darkGray);
    doc.text('A. Source References', PDF_CONFIG.margins.left, 55);

    const sources = [
        ['FIRB', 'Foreign Investment Review Board - firb.gov.au'],
        ['ATO', 'Australian Taxation Office - ato.gov.au'],
        ['State Revenue Offices', 'Individual state revenue office websites'],
        ['Legislation', 'Foreign Acquisitions and Takeovers Act 1975']
    ];

    doc.autoTable({
        startY: 62,
        body: sources,
        theme: 'plain',
        styles: { fontSize: PDF_CONFIG.fonts.small },
        columnStyles: {
            0: { cellWidth: 40, fontStyle: 'bold' },
            1: { cellWidth: 'auto' }
        },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    // B. Glossary
    let yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.text('B. Glossary of Terms', PDF_CONFIG.margins.left, yPos);

    const glossary = [
        ['FIRB', 'Foreign Investment Review Board - Australian government body that reviews foreign investment'],
        ['Stamp Duty', 'State tax on property transfers, calculated as percentage of purchase price'],
        ['Foreign Buyer Surcharge', 'Additional stamp duty charged to foreign (non-Australian) buyers'],
        ['Land Tax', 'Annual tax on land ownership (separate from stamp duty)'],
        ['Settlement', 'Final step in property purchase when ownership transfers'],
        ['Established Dwelling', 'Existing/second-hand residential property'],
        ['New Dwelling', 'Newly constructed property or off-the-plan purchase']
    ];

    doc.autoTable({
        startY: yPos + 7,
        body: glossary,
        theme: 'striped',
        styles: { fontSize: PDF_CONFIG.fonts.small },
        columnStyles: {
            0: { cellWidth: 50, fontStyle: 'bold' },
            1: { cellWidth: 'auto' }
        },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
    });

    // C. Assumptions
    yPos = doc.lastAutoTable.finalY + 15;
    if (yPos > 240) {
        doc.addPage();
        pages++;
        yPos = 40;
    }

    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...PDF_CONFIG.colors.darkGray);
    doc.text('C. Assumptions Used in Calculations', PDF_CONFIG.margins.left, yPos);

    yPos += 7;
    doc.setFontSize(PDF_CONFIG.fonts.small);
    doc.setFont(undefined, 'normal');
    const assumptions = [
        '• All calculations based on current regulations as of the report date',
        '• Property type and price as specified in inputs',
        '• Foreign buyer status applies (not Australian citizen or permanent resident)',
        '• Standard FIRB application (not fast-tracked)',
        '• No exemptions or special circumstances',
        '• Rates and fees subject to change by government',
        '• Additional costs (legal fees, inspections, etc.) not included',
        '• Investment projections use estimated growth rates - actual may vary'
    ];

    assumptions.forEach(assumption => {
        doc.text(assumption, PDF_CONFIG.margins.left, yPos);
        yPos += 5;
    });

    // D. Frequently Asked Questions (excerpt)
    yPos += 10;
    doc.setFontSize(PDF_CONFIG.fonts.subheading);
    doc.setFont(undefined, 'bold');
    doc.text('D. Common Questions', PDF_CONFIG.margins.left, yPos);

    const faqs = [
        {
            q: 'Do I need FIRB approval before signing a contract?',
            a: 'Yes. You must receive FIRB approval BEFORE signing any contract of sale. Signing without approval can result in serious penalties.'
        },
        {
            q: 'How long does FIRB approval take?',
            a: 'Typically 30-60 days, but can vary. Apply early and do not commit to purchase until approved.'
        },
        {
            q: 'Can I get a refund if my application is rejected?',
            a: 'No. FIRB application fees are non-refundable regardless of the outcome.'
        },
        {
            q: 'What happens if I leave the property vacant?',
            a: 'Foreign owners may face annual vacancy fees ($5,500-$11,000+) if property is vacant for more than 6 months per year.'
        }
    ];

    yPos += 10;
    faqs.forEach(faq => {
        if (yPos > 250) {
            doc.addPage();
            pages++;
            yPos = 40;
        }

        doc.setFontSize(PDF_CONFIG.fonts.small);
        doc.setFont(undefined, 'bold');
        doc.text('Q: ' + faq.q, PDF_CONFIG.margins.left, yPos);
        yPos += 5;

        doc.setFont(undefined, 'normal');
        const answerLines = doc.splitTextToSize('A: ' + faq.a, pageWidth - 2 * PDF_CONFIG.margins.left);
        doc.text(answerLines, PDF_CONFIG.margins.left, yPos);
        yPos += answerLines.length * 4 + 6;
    });

    return pages;
}

/**
 * Add headers and footers to all pages
 */
function addHeadersFooters(doc, totalPages, preparedDate) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Skip header/footer on cover page
        if (i === 1) continue;

        // Header
        doc.setDrawColor(...PDF_CONFIG.colors.lightGray);
        doc.setLineWidth(0.5);
        doc.line(PDF_CONFIG.margins.left, 15, pageWidth - PDF_CONFIG.margins.right, 15);

        doc.setFontSize(PDF_CONFIG.fonts.small);
        doc.setTextColor(...PDF_CONFIG.colors.darkGray);
        doc.setFont(undefined, 'normal');
        doc.text('FIRB Cost Analysis Report', PDF_CONFIG.margins.left, 12);
        doc.text(preparedDate, pageWidth - PDF_CONFIG.margins.right, 12, { align: 'right' });

        // Footer
        doc.line(PDF_CONFIG.margins.left, pageHeight - 15, pageWidth - PDF_CONFIG.margins.right, pageHeight - 15);

        doc.setFontSize(PDF_CONFIG.fonts.small);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

        doc.setFontSize(PDF_CONFIG.fonts.small - 1);
        doc.setFont(undefined, 'italic');
        doc.text('This report is for informational purposes only. Seek professional advice.',
            pageWidth / 2, pageHeight - 6, { align: 'center' });
    }
}

// Export function for use in main app
if (typeof window !== 'undefined') {
    window.generateProfessionalPDF = generateProfessionalPDF;
}
