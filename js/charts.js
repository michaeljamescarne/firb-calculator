/**
 * Chart rendering functions using Recharts library
 * @file charts.js
 */

const { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = window.Recharts || {};

/**
 * Check if external libraries are loaded and ready
 * @returns {boolean} True if all libraries are available
 */
function checkExternalLibraries() {
    return !!(window.Recharts && window.React && window.ReactDOM);
}

/**
 * Wait for external libraries to load with timeout
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} True if libraries loaded, false if timeout
 */
function waitForExternalLibraries(timeout = 3000) {
    return new Promise((resolve) => {
        if (checkExternalLibraries()) {
            resolve(true);
            return;
        }
        
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            if (checkExternalLibraries()) {
                clearInterval(checkInterval);
                resolve(true);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                resolve(false);
            }
        }, 100);
    });
}

/**
 * CSS-based fallback chart when Recharts is unavailable
 * @param {Array} data - Chart data with name, value, and color
 * @param {string} title - Chart title
 */
function renderCSSBarChartFallback(data, title = 'Cost Breakdown') {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return `
        <div class="fallback-chart bg-white p-6 rounded-lg">
            <p class="text-sm text-gray-600 mb-4">
                <i data-lucide="info" class="w-4 h-4 inline mr-1"></i>
                Chart visualization unavailable. Here's your ${title.toLowerCase()}:
            </p>
            ${data.map(item => `
                <div class="mb-4">
                    <div class="flex justify-between items-center text-sm mb-2">
                        <span class="font-medium text-gray-700">${item.name}</span>
                        <span class="font-bold text-gray-900">${formatCurrency(item.value)}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div class="h-4 rounded-full flex items-center justify-end pr-2 text-xs text-white font-bold transition-all duration-500"
                            style="width: ${(item.value / total * 100).toFixed(1)}%; background: ${item.color}">
                            ${(item.value / total * 100) >= 10 ? (item.value / total * 100).toFixed(0) + '%' : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
            <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span class="text-blue-600">${formatCurrency(total)}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render animated pie chart showing cost distribution
 * @param {Object} fees - Calculated fees object
 */
function renderPieChart(fees) {
    const container = document.getElementById('pie-chart-container');
    if (!container) return;

    // Check if Recharts is available
    if (!checkExternalLibraries()) {
        console.warn('Recharts, React, or ReactDOM not loaded - using CSS fallback');

        // Prepare data for fallback chart
        const data = [
            { name: 'FIRB Fee', value: fees.firb, color: '#f97316' },
            { name: 'Stamp Duty (Foreign)', value: fees.stampDuty, color: '#dc2626' },
            { name: 'Stamp Duty (Standard)', value: fees.standard.stampDuty, color: '#3b82f6' },
            { name: 'Legal & Conveyancing', value: fees.legal + fees.standard.conveyancingLegal, color: '#8b5cf6' },
            { name: 'Inspections & Searches', value: fees.standard.buildingInspection + fees.standard.pestInspection + fees.standard.titleSearch, color: '#06b6d4' },
            { name: 'Loan Fees', value: fees.standard.loanApplicationFee + fees.standard.lendersMortgageInsurance, color: '#10b981' },
            { name: 'Other Fees', value: fees.standard.transferFee + fees.standard.mortgageRegistration + fees.standard.councilRates + fees.standard.waterRates, color: '#6b7280' }
        ].filter(item => item.value > 0);

        // Render CSS fallback
        container.innerHTML = renderCSSBarChartFallback(data, 'Cost Breakdown');

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        return;
    }

    // Prepare data for pie chart
    const data = [
        { name: 'FIRB Fee', value: fees.firb, color: '#f97316' },
        { name: 'Stamp Duty (Foreign)', value: fees.stampDuty, color: '#dc2626' },
        { name: 'Stamp Duty (Standard)', value: fees.standard.stampDuty, color: '#3b82f6' },
        { name: 'Legal & Conveyancing', value: fees.legal + fees.standard.conveyancingLegal, color: '#8b5cf6' },
        { name: 'Inspections & Searches', value: fees.standard.buildingInspection + fees.standard.pestInspection + fees.standard.titleSearch, color: '#06b6d4' },
        { name: 'Loan Fees', value: fees.standard.loanApplicationFee + fees.standard.lendersMortgageInsurance, color: '#10b981' },
        { name: 'Other Fees', value: fees.standard.transferFee + fees.standard.mortgageRegistration + fees.standard.councilRates + fees.standard.waterRates, color: '#6b7280' }
    ].filter(item => item.value > 0);

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent < 0.05) return null; // Hide labels for small slices

        return React.createElement('text', {
            x: x,
            y: y,
            fill: 'white',
            textAnchor: x > cx ? 'start' : 'end',
            dominantBaseline: 'central',
            fontSize: 12,
            fontWeight: 'bold'
        }, `${(percent * 100).toFixed(0)}%`);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return React.createElement('div', {
                style: {
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }
            }, [
                React.createElement('p', { key: 'label', style: { fontWeight: 'bold', marginBottom: '4px' } }, payload[0].name),
                React.createElement('p', { key: 'value', style: { color: payload[0].payload.color } }, formatCurrency(payload[0].value))
            ]);
        }
        return null;
    };

    const chart = React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
        React.createElement(PieChart, null,
            React.createElement(Pie, {
                data: data,
                cx: '50%',
                cy: '50%',
                labelLine: false,
                label: renderCustomizedLabel,
                outerRadius: 100,
                fill: '#8884d8',
                dataKey: 'value',
                animationBegin: 0,
                animationDuration: 800
            }, data.map((entry, index) =>
                React.createElement(Cell, { key: `cell-${index}`, fill: entry.color })
            )),
            React.createElement(Tooltip, { content: React.createElement(CustomTooltip) })
        )
    );

    ReactDOM.render(chart, container);
}

/**
 * Render donut chart for annual costs
 * @param {Object} fees - Calculated fees object
 */
function renderDonutChart(fees) {
    const container = document.getElementById('donut-chart-container');
    if (!container) return;

    // Check if Recharts is available
    if (!checkExternalLibraries()) {
        console.warn('Recharts, React, or ReactDOM not loaded - using CSS fallback');

        // Prepare data for fallback chart
        const data = [
            { name: 'Vacancy Fee', value: fees.annual.vacancyFee, color: '#f59e0b' },
            { name: 'Land Tax Surcharge', value: fees.annual.landTaxSurcharge, color: '#ef4444' },
            { name: 'Council Rates', value: fees.annual.councilRates, color: '#3b82f6' },
            { name: 'Water Rates', value: fees.annual.waterRates, color: '#06b6d4' },
            { name: 'Insurance', value: fees.annual.insurance, color: '#10b981' }
        ].filter(item => item.value > 0);

        // Render CSS fallback
        container.innerHTML = renderCSSBarChartFallback(data, 'Annual Costs');

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        return;
    }
}

/**
 * Render bar chart comparing costs across states
 * @param {Array} stateCosts - Array of state cost objects
 */
function renderBarChart(stateCosts) {
    const container = document.getElementById('bar-chart-container');
    if (!container) return;

    // Check if Recharts is available
    if (!checkExternalLibraries()) {
        console.warn('Recharts, React, or ReactDOM not loaded - using CSS fallback');

        // Sort by total cost
        const sortedData = [...stateCosts].sort((a, b) => a.total - b.total);
        const currentState = state.formData?.state || '';

        // Prepare data for fallback chart
        const data = sortedData.map(item => ({
            name: item.state + (item.state === currentState ? ' (Your Selection)' : ''),
            value: item.total,
            color: item.state === currentState ? '#3b82f6' : '#94a3b8'
        }));

        // Render CSS fallback
        container.innerHTML = renderCSSBarChartFallback(data, 'State Comparison');

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        return;
    }

    // Sort by total cost
    const sortedData = [...stateCosts].sort((a, b) => a.total - b.total);

    // Highlight current state
    const currentState = state.formData.state;

    const CustomBar = (props) => {
        const { fill, x, y, width, height, payload } = props;
        const isCurrentState = payload.state === currentState;
        const barFill = isCurrentState ? '#3b82f6' : '#94a3b8';

        return React.createElement('rect', {
            x: x,
            y: y,
            width: width,
            height: height,
            fill: barFill,
            opacity: isCurrentState ? 1 : 0.7,
            className: 'transition-opacity hover:opacity-100'
        });
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const isCurrentState = payload[0].payload.state === currentState;
            return React.createElement('div', {
                style: {
                    backgroundColor: 'white',
                    border: '2px solid ' + (isCurrentState ? '#3b82f6' : '#e5e7eb'),
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }
            }, [
                React.createElement('p', {
                    key: 'state',
                    style: {
                        fontWeight: 'bold',
                        marginBottom: '4px',
                        fontSize: '16px'
                    }
                }, payload[0].payload.state + (isCurrentState ? ' (Your Selection)' : '')),
                React.createElement('p', {
                    key: 'total',
                    style: { color: '#3b82f6', fontWeight: 'bold' }
                }, 'Total: ' + formatCurrency(payload[0].value)),
                React.createElement('p', {
                    key: 'diff',
                    style: {
                        fontSize: '12px',
                        color: payload[0].payload.difference > 0 ? '#ef4444' : '#10b981',
                        marginTop: '4px'
                    }
                }, payload[0].payload.difference === 0
                    ? 'Your selection'
                    : payload[0].payload.difference > 0
                        ? '+' + formatCurrency(payload[0].payload.difference) + ' more expensive'
                        : formatCurrency(Math.abs(payload[0].payload.difference)) + ' cheaper'
                )
            ]);
        }
        return null;
    };

    const chart = React.createElement(ResponsiveContainer, { width: '100%', height: 400 },
        React.createElement(BarChart, {
            data: sortedData,
            margin: { top: 20, right: 30, left: 20, bottom: 20 }
        }, [
            React.createElement(CartesianGrid, { key: 'grid', strokeDasharray: '3 3', opacity: 0.3 }),
            React.createElement(XAxis, {
                key: 'xaxis',
                dataKey: 'state',
                tick: { fontSize: 12 },
                interval: 0
            }),
            React.createElement(YAxis, {
                key: 'yaxis',
                tick: { fontSize: 12 },
                tickFormatter: (value) => '$' + (value / 1000).toFixed(0) + 'k'
            }),
            React.createElement(Tooltip, {
                key: 'tooltip',
                content: React.createElement(CustomTooltip),
                cursor: { fill: 'rgba(59, 130, 246, 0.1)' }
            }),
            React.createElement(Bar, {
                key: 'bar',
                dataKey: 'total',
                shape: React.createElement(CustomBar),
                animationBegin: 0,
                animationDuration: 800,
                radius: [8, 8, 0, 0]
            })
        ])
    );

    ReactDOM.render(chart, container);
}

/**
 * Add CSS for collapsible sections
 */
function addCollapsibleStyles() {
    if (document.getElementById('collapsible-styles')) return;

    const style = document.createElement('style');
    style.id = 'collapsible-styles';
    style.textContent = `
        .collapsible-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-in-out;
        }

        .info-icon {
            cursor: pointer;
            font-size: 14px;
            display: inline-block;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .animate-slide-in {
            animation: slideIn 0.5s ease-out;
        }

        @media (max-width: 768px) {
            .collapsible-content {
                font-size: 14px;
            }
        }
    `;
    document.head.appendChild(style);
}
