/**
 * Comparison Export & Share Features
 * @file comparisonExport.js
 *
 * PDF export and link sharing for scenario comparisons
 */

/**
 * Export comparison as PDF
 */
async function exportComparisonPDF() {
    try {
        if (typeof showToast === 'function') {
            showToast('Generating comparison PDF...', 'info', 3000);
        }

        const scenarios = getFilteredScenarios();
        if (scenarios.length < 2) {
            if (typeof showToast === 'function') {
                showToast('Need at least 2 scenarios to export', 'error');
            }
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('Scenario Comparison Report', 14, 20);

        // Subtitle
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 27);
        doc.text(`${scenarios.length} scenarios compared`, 14, 32);

        let yPos = 42;

        // Summary section
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Summary', 14, yPos);
        yPos += 7;

        const lowestCost = findLowestCostScenario(scenarios);
        const highestCost = scenarios.reduce((max, s) =>
            s.totalFirstYearCost > max.totalFirstYearCost ? s : max
        );

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Lowest Cost: ${lowestCost.name} - ${formatCurrency(lowestCost.totalFirstYearCost)}`, 14, yPos);
        yPos += 5;
        doc.text(`Highest Cost: ${highestCost.name} - ${formatCurrency(highestCost.totalFirstYearCost)}`, 14, yPos);
        yPos += 5;
        doc.text(`Difference: ${formatCurrency(highestCost.totalFirstYearCost - lowestCost.totalFirstYearCost)}`, 14, yPos);
        yPos += 10;

        // Comparison table
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Detailed Comparison', 14, yPos);
        yPos += 7;

        const tableData = scenarios.map(scenario => [
            scenario.name,
            formatCurrency(scenario.propertyValue),
            scenario.state,
            formatCurrency(scenario.firbFee),
            formatCurrency(scenario.totalStampDuty),
            formatCurrency(scenario.totalFirstYearCost),
            formatCurrency(scenario.totalAnnualCost)
        ]);

        doc.autoTable({
            startY: yPos,
            head: [['Scenario', 'Property Value', 'State', 'FIRB Fee', 'Stamp Duty', 'First Year', 'Annual']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235], fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            styles: { cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 25 },
                2: { cellWidth: 15 },
                3: { cellWidth: 22 },
                4: { cellWidth: 22 },
                5: { cellWidth: 25 },
                6: { cellWidth: 22 }
            }
        });

        yPos = doc.lastAutoTable.finalY + 10;

        // Breakdown for each scenario
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Individual Scenario Details', 14, yPos);
        yPos += 7;

        scenarios.forEach((scenario, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`${index + 1}. ${scenario.name}`, 14, yPos);
            yPos += 6;

            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');

            const details = [
                ['Property Details', ''],
                ['Value:', formatCurrency(scenario.propertyValue)],
                ['Type:', getPropertyTypeLabel(scenario.propertyType)],
                ['State:', scenario.state],
                ['', ''],
                ['First Year Costs', ''],
                ['FIRB Fee:', formatCurrency(scenario.firbFee)],
                ['Stamp Duty:', formatCurrency(scenario.stampDuty)],
                ['Foreign Surcharge:', formatCurrency(scenario.foreignSurcharge)],
                ['Legal Fees:', formatCurrency(scenario.legalFees)],
                ['Total First Year:', formatCurrency(scenario.totalFirstYearCost)],
                ['', ''],
                ['Annual Ongoing Costs', ''],
                ['Land Tax:', formatCurrency(scenario.landTax)],
                ['Council Rates:', formatCurrency(scenario.councilRates)],
                ['Strata Fees:', formatCurrency(scenario.strataFees)],
                ['Total Annual:', formatCurrency(scenario.totalAnnualCost)]
            ];

            doc.autoTable({
                startY: yPos,
                body: details,
                theme: 'plain',
                styles: { fontSize: 9, cellPadding: 1 },
                columnStyles: {
                    0: { cellWidth: 50, fontStyle: 'bold' },
                    1: { cellWidth: 40 }
                }
            });

            yPos = doc.lastAutoTable.finalY + 8;
        });

        // Footer on last page
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128);
            doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
            doc.text('Generated by FIRB Calculator', doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });
        }

        // Save the PDF
        doc.save(`FIRB-Comparison-${new Date().toISOString().split('T')[0]}.pdf`);

        if (typeof showToast === 'function') {
            showToast('Comparison PDF downloaded!', 'success');
        }

    } catch (error) {
        console.error('Error exporting comparison PDF:', error);
        if (typeof showToast === 'function') {
            showToast('Failed to generate PDF', 'error');
        }
        if (typeof logError === 'function') {
            logError(error, 'exportComparisonPDF');
        }
    }
}

/**
 * Share comparison via link
 */
function shareComparison() {
    try {
        const scenarios = getFilteredScenarios();
        if (scenarios.length < 2) {
            if (typeof showToast === 'function') {
                showToast('Need at least 2 scenarios to share', 'error');
            }
            return;
        }

        // Create shareable data (simplified version)
        const shareData = {
            version: 1,
            created: new Date().toISOString(),
            scenarios: scenarios.map(s => ({
                name: s.name,
                propertyValue: s.propertyValue,
                propertyType: s.propertyType,
                state: s.state,
                firbFee: s.firbFee,
                totalStampDuty: s.totalStampDuty,
                totalFirstYearCost: s.totalFirstYearCost,
                totalAnnualCost: s.totalAnnualCost
            }))
        };

        // Encode to base64
        const encoded = btoa(JSON.stringify(shareData));

        // Create shareable URL (would be your actual domain)
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?comparison=${encoded}`;

        // Show share modal
        showShareModal(shareUrl, scenarios.length);

    } catch (error) {
        console.error('Error creating share link:', error);
        if (typeof showToast === 'function') {
            showToast('Failed to create share link', 'error');
        }
        if (typeof logError === 'function') {
            logError(error, 'shareComparison');
        }
    }
}

/**
 * Show share modal
 */
function showShareModal(url, scenarioCount) {
    const modalHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onclick="closeShareModal(event)">
            <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6" onclick="event.stopPropagation()">
                <h3 class="text-2xl font-bold mb-4">Share Comparison</h3>

                <p class="text-gray-600 mb-4">
                    Share this comparison of ${scenarioCount} scenarios with others via link
                </p>

                <div class="mb-4">
                    <label class="block text-sm font-semibold mb-2">Shareable Link</label>
                    <div class="flex gap-2">
                        <input type="text"
                            id="share-url-input"
                            value="${url}"
                            readonly
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm">
                        <button onclick="copyShareLink()"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                            <span>Copy</span>
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">
                        This link includes your comparison data. Anyone with the link can view it.
                    </p>
                </div>

                <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div class="font-semibold text-sm mb-2">What's included:</div>
                    <ul class="text-sm text-gray-700 space-y-1">
                        <li>• Property details and costs for all ${scenarioCount} scenarios</li>
                        <li>• Side-by-side comparison table</li>
                        <li>• Cost comparison charts</li>
                    </ul>
                </div>

                <button onclick="closeShareModalBtn()"
                    class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                    Close
                </button>
            </div>
        </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.id = 'share-comparison-modal';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
}

/**
 * Close share modal
 */
function closeShareModalBtn() {
    const modal = document.getElementById('share-comparison-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Close modal on backdrop click
 */
function closeShareModal(event) {
    if (event.target === event.currentTarget) {
        closeShareModalBtn();
    }
}

/**
 * Copy share link to clipboard
 */
function copyShareLink() {
    const input = document.getElementById('share-url-input');
    input.select();
    input.setSelectionRange(0, 99999); // For mobile

    try {
        document.execCommand('copy');
        if (typeof showToast === 'function') {
            showToast('Link copied to clipboard!', 'success');
        }
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        if (typeof showToast === 'function') {
            showToast('Failed to copy link', 'error');
        }
    }
}

/**
 * Load shared comparison from URL
 */
function loadSharedComparison() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const comparisonData = urlParams.get('comparison');

        if (!comparisonData) return false;

        // Decode and parse
        const decoded = atob(comparisonData);
        const data = JSON.parse(decoded);

        if (data.version !== 1 || !data.scenarios || data.scenarios.length === 0) {
            throw new Error('Invalid comparison data');
        }

        // Show shared comparison view
        renderSharedComparison(data);

        return true;

    } catch (error) {
        console.error('Error loading shared comparison:', error);
        if (typeof showToast === 'function') {
            showToast('Failed to load shared comparison', 'error');
        }
        return false;
    }
}

/**
 * Render shared comparison (read-only view)
 */
function renderSharedComparison(data) {
    // Create temporary scenarios for display
    const tempScenarios = data.scenarios.map((s, i) => ({
        ...s,
        id: `shared-${i}`,
        createdAt: data.created
    }));

    // Store in a temporary state
    window.sharedComparisonData = tempScenarios;

    // Navigate to a special shared comparison view
    state.currentStep = 'sharedCompare';
    render();
}

/**
 * Render shared comparison page (read-only)
 */
function renderSharedComparisonPage() {
    const scenarios = window.sharedComparisonData || [];

    if (scenarios.length === 0) {
        return renderEmptyComparisonPage();
    }

    const lowestCost = scenarios.reduce((min, s) =>
        s.totalFirstYearCost < min.totalFirstYearCost ? s : min
    );

    return `
        <section class="py-12 bg-gray-50 min-h-screen">
            <div class="max-w-7xl mx-auto px-4">
                <!-- Header -->
                <div class="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center space-x-3">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                        </svg>
                        <div>
                            <div class="font-bold text-gray-900">Shared Comparison</div>
                            <div class="text-sm text-gray-600">This is a read-only view. Create your own to edit.</div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 class="text-4xl font-bold text-gray-900 mb-2">Scenario Comparison</h1>
                        <p class="text-gray-600">${scenarios.length} scenarios • Shared on ${new Date(scenarios[0].createdAt).toLocaleDateString()}</p>
                    </div>

                    <div class="mt-4 md:mt-0">
                        <button onclick="startEligibilityWizard()"
                            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Create Your Own
                        </button>
                    </div>
                </div>

                ${renderVisualComparisons(scenarios)}

                <!-- Simplified comparison table for shared view -->
                <div class="bg-white rounded-lg shadow-sm overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Scenario</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Property</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">FIRB Fee</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stamp Duty</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">First Year Total</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Annual Ongoing</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${scenarios.map(scenario => {
                                const isLowest = scenario.id === lowestCost.id;

                                return `
                                    <tr class="${isLowest ? 'bg-green-50' : 'hover:bg-gray-50'}">
                                        <td class="px-4 py-4">
                                            <div class="font-semibold">${scenario.name}</div>
                                            ${isLowest ? '<div class="text-xs text-green-600 font-bold mt-1">LOWEST COST</div>' : ''}
                                        </td>
                                        <td class="px-4 py-4">
                                            <div class="font-semibold">${formatCurrency(scenario.propertyValue)}</div>
                                            <div class="text-sm text-gray-600">${scenario.state} • ${getPropertyTypeLabel(scenario.propertyType)}</div>
                                        </td>
                                        <td class="px-4 py-4">${formatCurrency(scenario.firbFee)}</td>
                                        <td class="px-4 py-4">${formatCurrency(scenario.totalStampDuty)}</td>
                                        <td class="px-4 py-4"><span class="font-bold">${formatCurrency(scenario.totalFirstYearCost)}</span></td>
                                        <td class="px-4 py-4">${formatCurrency(scenario.totalAnnualCost)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    `;
}

// Check for shared comparison on page load
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        if (window.location.search.includes('comparison=')) {
            loadSharedComparison();
        }
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        exportComparisonPDF,
        shareComparison,
        loadSharedComparison,
        renderSharedComparisonPage
    };
}
