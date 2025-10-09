/**
 * Interactive Australia Map Component
 * Shows state-by-state foreign investment costs with visual comparison
 * @file australiaMap.js
 */

/**
 * State data with foreign investment information
 */
const stateData = {
    NSW: {
        name: 'New South Wales',
        stampDutySurcharge: 8,
        landTaxSurcharge: 2.0,
        avgPropertyPrice: 1200000,
        firbProcessingDays: 30,
        specialConditions: 'Most expensive stamp duty surcharge',
        color: '#ef4444'
    },
    VIC: {
        name: 'Victoria',
        stampDutySurcharge: 8,
        landTaxSurcharge: 1.5,
        avgPropertyPrice: 950000,
        firbProcessingDays: 30,
        specialConditions: 'Moderate surcharges, strong market',
        color: '#f97316'
    },
    QLD: {
        name: 'Queensland',
        stampDutySurcharge: 7,
        landTaxSurcharge: 2.0,
        avgPropertyPrice: 750000,
        firbProcessingDays: 30,
        specialConditions: 'Lower stamp duty, warm climate',
        color: '#f59e0b'
    },
    SA: {
        name: 'South Australia',
        stampDutySurcharge: 7,
        landTaxSurcharge: 0.5,
        avgPropertyPrice: 650000,
        firbProcessingDays: 30,
        specialConditions: 'Lowest land tax surcharge',
        color: '#84cc16'
    },
    WA: {
        name: 'Western Australia',
        stampDutySurcharge: 7,
        landTaxSurcharge: 4.0,
        avgPropertyPrice: 700000,
        firbProcessingDays: 30,
        specialConditions: 'Highest land tax surcharge (4%)',
        color: '#dc2626'
    },
    TAS: {
        name: 'Tasmania',
        stampDutySurcharge: 8,
        landTaxSurcharge: 1.5,
        avgPropertyPrice: 600000,
        firbProcessingDays: 30,
        specialConditions: 'Affordable prices, growing market',
        color: '#f97316'
    },
    ACT: {
        name: 'Australian Capital Territory',
        stampDutySurcharge: 0, // ACT abolished stamp duty
        landTaxSurcharge: 0.75,
        avgPropertyPrice: 850000,
        firbProcessingDays: 30,
        specialConditions: 'No stamp duty (replaced by land tax)',
        color: '#22c55e'
    },
    NT: {
        name: 'Northern Territory',
        stampDutySurcharge: 0,
        landTaxSurcharge: 0,
        avgPropertyPrice: 550000,
        firbProcessingDays: 30,
        specialConditions: 'No foreign surcharges - best for foreign buyers!',
        color: '#10b981'
    }
};

/**
 * SVG path data for each state/territory
 * Simplified coordinates for Australia map
 */
const statePaths = {
    WA: 'M30,80 L30,280 L200,280 L200,200 L180,160 L160,140 L140,120 L120,100 L100,90 L80,85 L60,82 Z',
    NT: 'M200,40 L200,200 L320,200 L320,40 Z',
    SA: 'M200,200 L200,300 L350,300 L380,270 L380,200 Z',
    QLD: 'M320,40 L320,220 L480,200 L500,120 L450,40 Z',
    NSW: 'M350,220 L350,320 L450,340 L480,280 L480,200 Z',
    VIC: 'M350,320 L380,360 L450,360 L450,340 Z',
    TAS: 'M400,380 L420,400 L450,390 L440,370 Z',
    ACT: 'M420,310 L430,320 L440,310 L430,300 Z'
};

/**
 * Current view mode
 */
let mapViewMode = 'map'; // 'map' or 'table'

/**
 * Selected state for modal
 */
let selectedState = null;

/**
 * Render Australia map component
 * @returns {string} HTML for map component
 */
function renderAustraliaMap() {
    return `
        <div class="bg-white p-8 rounded-xl shadow-md mb-8">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-3xl font-bold">State-by-State Comparison</h2>
                <div class="flex space-x-4">
                    <button onclick="setMapViewMode('map')"
                        class="px-4 py-2 rounded-lg font-semibold transition ${mapViewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
                        Map View
                    </button>
                    <button onclick="setMapViewMode('table')"
                        class="px-4 py-2 rounded-lg font-semibold transition ${mapViewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
                        Table View
                    </button>
                    <button onclick="findCheapestState()"
                        class="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center space-x-2">
                        ${icons.dollarSign('w-4 h-4')}
                        <span>Find Cheapest State</span>
                    </button>
                </div>
            </div>

            ${mapViewMode === 'map' ? renderMapView() : renderTableView()}
        </div>

        <!-- State Detail Modal -->
        ${selectedState ? renderStateDetailModal(selectedState) : ''}
    `;
}

/**
 * Render map view
 * @returns {string} HTML for SVG map
 */
function renderMapView() {
    return `
        <div class="relative">
            <!-- Legend -->
            <div class="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-10">
                <h4 class="font-bold text-sm mb-2">Land Tax Surcharge</h4>
                <div class="space-y-1 text-xs">
                    <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 rounded" style="background: #10b981"></div>
                        <span>0% (Best)</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 rounded" style="background: #84cc16"></div>
                        <span>0.5%</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 rounded" style="background: #f59e0b"></div>
                        <span>1.5-2%</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 rounded" style="background: #dc2626"></div>
                        <span>4% (Highest)</span>
                    </div>
                </div>
            </div>

            <!-- Australia SVG Map -->
            <svg viewBox="0 0 550 450" class="w-full h-auto drop-shadow-lg" style="max-height: 600px;">
                <!-- Background with gradient -->
                <defs>
                    <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
                    </linearGradient>
                    <filter id="stateShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.1"/>
                    </filter>
                </defs>
                
                <!-- Background -->
                <rect width="550" height="450" fill="url(#mapBg)" rx="8"/>

                <!-- States -->
                ${Object.keys(statePaths).map(stateCode => `
                    <g class="state-group" data-state="${stateCode}">
                        <path
                            d="${statePaths[stateCode]}"
                            fill="${stateData[stateCode].color}"
                            stroke="#ffffff"
                            stroke-width="3"
                            class="state-path cursor-pointer transition-all duration-300 hover:opacity-100"
                            onmouseover="showStateTooltip(event, '${stateCode}')"
                            onmouseout="hideStateTooltip()"
                            onclick="showStateDetail('${stateCode}')"
                            style="opacity: 0.85; filter: url(#stateShadow);"
                        />
                        <text
                            x="${getStateLabelPosition(stateCode).x}"
                            y="${getStateLabelPosition(stateCode).y}"
                            text-anchor="middle"
                            class="font-bold text-sm fill-white pointer-events-none"
                            style="text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">
                            ${stateCode}
                        </text>
                    </g>
                `).join('')}
            </svg>

            <!-- Tooltip -->
            <div id="state-tooltip" class="absolute hidden bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl text-sm z-20 pointer-events-none" style="max-width: 300px;">
                <div id="tooltip-content"></div>
            </div>

            <p class="text-sm text-gray-500 text-center mt-4">
                Click on any state to see detailed information
            </p>
        </div>
    `;
}

/**
 * Get label position for each state
 * @param {string} stateCode - State code
 * @returns {Object} {x, y} coordinates
 */
function getStateLabelPosition(stateCode) {
    const positions = {
        WA: { x: 135, y: 175 },
        NT: { x: 285, y: 115 },
        SA: { x: 300, y: 230 },
        QLD: { x: 415, y: 135 },
        NSW: { x: 415, y: 270 },
        VIC: { x: 400, y: 340 },
        TAS: { x: 425, y: 385 },
        ACT: { x: 435, y: 305 }
    };
    return positions[stateCode] || { x: 0, y: 0 };
}

/**
 * Show state tooltip on hover
 * @param {Event} event - Mouse event
 * @param {string} stateCode - State code
 */
function showStateTooltip(event, stateCode) {
    const tooltip = document.getElementById('state-tooltip');
    const content = document.getElementById('tooltip-content');
    const data = stateData[stateCode];

    if (tooltip && content && data) {
        content.innerHTML = `
            <h4 class="font-bold mb-2">${data.name}</h4>
            <div class="space-y-1">
                <div>Land Tax Surcharge: <span class="font-bold">${data.landTaxSurcharge}%</span></div>
                <div>Stamp Duty Surcharge: <span class="font-bold">${data.stampDutySurcharge}%</span></div>
                <div>Avg Price: <span class="font-bold">${formatCurrency(data.avgPropertyPrice)}</span></div>
            </div>
            <p class="text-xs text-gray-300 mt-2">Click for details</p>
        `;

        tooltip.style.left = (event.pageX + 15) + 'px';
        tooltip.style.top = (event.pageY + 15) + 'px';
        tooltip.classList.remove('hidden');
    }

    // Highlight state on hover
    event.target.style.opacity = '1';
    event.target.style.filter = 'brightness(1.1)';
}

/**
 * Hide state tooltip
 */
function hideStateTooltip() {
    const tooltip = document.getElementById('state-tooltip');
    if (tooltip) {
        tooltip.classList.add('hidden');
    }

    // Reset all states opacity
    document.querySelectorAll('.state-path').forEach(path => {
        path.style.opacity = '0.8';
        path.style.filter = 'none';
    });
}

/**
 * Show state detail modal
 * @param {string} stateCode - State code
 */
function showStateDetail(stateCode) {
    selectedState = stateCode;
    render();
}

/**
 * Close state detail modal
 */
function closeStateDetail() {
    selectedState = null;
    render();
}

/**
 * Render state detail modal
 * @param {string} stateCode - State code
 * @returns {string} HTML for modal
 */
function renderStateDetailModal(stateCode) {
    const data = stateData[stateCode];
    if (!data) return '';

    // Calculate estimated costs for a sample property
    const sampleValue = data.avgPropertyPrice;
    const sampleData = {
        propertyValue: sampleValue.toString(),
        state: stateCode,
        propertyType: 'established',
        entityType: 'individual',
        depositPercent: '30',
        firstHomeBuyer: 'no'
    };
    const estimatedFees = calculateAllFees(sampleData);

    return `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onclick="if(event.target === this) closeStateDetail()">
            <div class="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto"
                onclick="event.stopPropagation()">
                <div class="p-8">
                    <div class="flex items-start justify-between mb-6">
                        <div>
                            <h2 class="text-3xl font-bold mb-2">${data.name}</h2>
                            <p class="text-gray-600">${stateCode}</p>
                        </div>
                        <button onclick="closeStateDetail()"
                            class="text-gray-400 hover:text-gray-600 transition">
                            ${icons.x('w-6 h-6')}
                        </button>
                    </div>

                    <!-- Key Metrics -->
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="text-sm text-gray-600 mb-1">Stamp Duty Surcharge</h4>
                            <p class="text-2xl font-bold text-blue-600">${data.stampDutySurcharge}%</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <h4 class="text-sm text-gray-600 mb-1">Land Tax Surcharge</h4>
                            <p class="text-2xl font-bold text-green-600">${data.landTaxSurcharge}%</p>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <h4 class="text-sm text-gray-600 mb-1">Avg Property Price</h4>
                            <p class="text-2xl font-bold text-purple-600">${formatCurrency(data.avgPropertyPrice)}</p>
                        </div>
                        <div class="bg-orange-50 p-4 rounded-lg">
                            <h4 class="text-sm text-gray-600 mb-1">FIRB Processing</h4>
                            <p class="text-2xl font-bold text-orange-600">${data.firbProcessingDays} days</p>
                        </div>
                    </div>

                    <!-- Special Conditions -->
                    <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                        <h4 class="font-bold text-yellow-900 mb-2">Special Conditions</h4>
                        <p class="text-yellow-800">${data.specialConditions}</p>
                    </div>

                    <!-- Cost Estimate -->
                    <div class="border-t pt-6 mb-6">
                        <h3 class="text-xl font-bold mb-4">Estimated Costs for ${formatCurrency(sampleValue)} Property</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span class="text-gray-700">FIRB Application Fee</span>
                                <span class="font-bold">${formatCurrency(estimatedFees.firb)}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span class="text-gray-700">Stamp Duty Surcharge</span>
                                <span class="font-bold">${formatCurrency(estimatedFees.stampDuty)}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span class="text-gray-700">Annual Land Tax Surcharge</span>
                                <span class="font-bold">${formatCurrency(estimatedFees.annual.landTaxSurcharge)}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-green-50 rounded border-2 border-green-300">
                                <span class="font-bold text-gray-900">First Year Total</span>
                                <span class="text-xl font-bold text-green-600">${formatCurrency(estimatedFees.firstYearTotal)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex space-x-4">
                        <button onclick="calculateForState('${stateCode}')"
                            class="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
                            Calculate for This State
                        </button>
                        <button onclick="closeStateDetail()"
                            class="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Calculate for selected state
 * @param {string} stateCode - State code
 */
function calculateForState(stateCode) {
    state.formData.state = stateCode;
    closeStateDetail();
    goToStep('calculator');
    showNotification(`State set to ${stateData[stateCode].name}`, 'success', 2000);
}

/**
 * Render table view
 * @returns {string} HTML for comparison table
 */
function renderTableView() {
    const states = Object.keys(stateData);

    return `
        <div class="overflow-x-auto">
            <table class="w-full border-collapse">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="text-left p-4 font-bold border-b-2 cursor-pointer hover:bg-gray-200"
                            onclick="sortStatesTable('name')">
                            State ${getSortIcon('name')}
                        </th>
                        <th class="text-center p-4 font-bold border-b-2 cursor-pointer hover:bg-gray-200"
                            onclick="sortStatesTable('stampDutySurcharge')">
                            Stamp Duty Surcharge ${getSortIcon('stampDutySurcharge')}
                        </th>
                        <th class="text-center p-4 font-bold border-b-2 cursor-pointer hover:bg-gray-200"
                            onclick="sortStatesTable('landTaxSurcharge')">
                            Land Tax Surcharge ${getSortIcon('landTaxSurcharge')}
                        </th>
                        <th class="text-center p-4 font-bold border-b-2 cursor-pointer hover:bg-gray-200"
                            onclick="sortStatesTable('avgPropertyPrice')">
                            Avg Price ${getSortIcon('avgPropertyPrice')}
                        </th>
                        <th class="text-center p-4 font-bold border-b-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${states.map(stateCode => {
                        const data = stateData[stateCode];
                        return `
                            <tr class="hover:bg-gray-50 transition">
                                <td class="p-4 border-b">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-4 h-4 rounded" style="background: ${data.color}"></div>
                                        <div>
                                            <div class="font-bold">${data.name}</div>
                                            <div class="text-xs text-gray-500">${stateCode}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-center p-4 border-b font-semibold">${data.stampDutySurcharge}%</td>
                                <td class="text-center p-4 border-b font-semibold">${data.landTaxSurcharge}%</td>
                                <td class="text-center p-4 border-b font-semibold">${formatCurrency(data.avgPropertyPrice)}</td>
                                <td class="text-center p-4 border-b">
                                    <button onclick="showStateDetail('${stateCode}')"
                                        class="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700 transition">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Current sort column and direction
 */
let currentSortColumn = null;
let currentSortDirection = 'asc';

/**
 * Sort states table
 * @param {string} column - Column to sort by
 */
function sortStatesTable(column) {
    if (currentSortColumn === column) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = column;
        currentSortDirection = 'asc';
    }
    render();
}

/**
 * Get sort icon for column
 * @param {string} column - Column name
 * @returns {string} HTML for sort icon
 */
function getSortIcon(column) {
    if (currentSortColumn !== column) {
        return '<span class="text-gray-400">↕</span>';
    }
    return currentSortDirection === 'asc' ? '<span>↑</span>' : '<span>↓</span>';
}

/**
 * Set map view mode
 * @param {string} mode - 'map' or 'table'
 */
function setMapViewMode(mode) {
    mapViewMode = mode;
    render();
}

/**
 * Find and show cheapest state
 */
function findCheapestState() {
    // Use current property value or default
    const propValue = parseFloat(state.formData.propertyValue) || 850000;
    const formData = {
        ...state.formData,
        propertyValue: propValue.toString(),
        propertyType: state.formData.propertyType || 'established',
        entityType: state.formData.entityType || 'individual',
        depositPercent: state.formData.depositPercent || '30'
    };

    // Calculate for all states
    const stateCosts = Object.keys(stateData).map(stateCode => {
        const tempData = { ...formData, state: stateCode };
        const fees = calculateAllFees(tempData);
        return {
            code: stateCode,
            name: stateData[stateCode].name,
            firstYearTotal: fees.firstYearTotal
        };
    });

    // Find cheapest
    const cheapest = stateCosts.reduce((best, current) =>
        current.firstYearTotal < best.firstYearTotal ? current : best
    );

    // Show result
    showNotification(
        `Cheapest state: ${cheapest.name} (${formatCurrency(cheapest.firstYearTotal)} first year)`,
        'success',
        5000
    );

    // Open detail modal for cheapest state
    showStateDetail(cheapest.code);
}
