/**
 * FIRB Calculator Test Suite
 * Comprehensive validation against official government sources
 * Tests FIRB fees, stamp duty, land tax, and edge cases
 */

// Test results storage
const testResults = {
    passed: [],
    failed: [],
    warnings: [],
    summary: null
};

/**
 * Test Case Structure
 */
class TestCase {
    constructor(name, category, inputs, expected, source) {
        this.name = name;
        this.category = category;
        this.inputs = inputs;
        this.expected = expected;
        this.source = source;
        this.result = null;
        this.passed = false;
        this.discrepancy = 0;
        this.tolerance = 1; // Allow $1 difference for rounding
    }

    run() {
        const calculated = calculateFees(this.inputs);
        this.result = calculated;

        // Check each expected value
        const checks = [];
        for (const [key, expectedValue] of Object.entries(this.expected)) {
            const actualValue = calculated[key];
            const diff = Math.abs(actualValue - expectedValue);
            const withinTolerance = diff <= this.tolerance;

            checks.push({
                field: key,
                expected: expectedValue,
                actual: actualValue,
                difference: diff,
                passed: withinTolerance
            });

            if (!withinTolerance) {
                this.discrepancy = Math.max(this.discrepancy, diff);
            }
        }

        this.passed = checks.every(c => c.passed);
        this.checks = checks;

        return this.passed;
    }
}

/**
 * FIRB Fee Tests - Tier Boundaries
 * Source: https://firb.gov.au/guidance-resources/guidance-notes/gn12
 */
const firbFeeTierTests = [
    // Residential property - Individual applicant tiers
    new TestCase(
        'FIRB Tier 1 - Just below $1M threshold',
        'FIRB Fees',
        {
            propertyValue: 999999,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            firbApplicationFee: 13200
        },
        'FIRB Guidance Note 12 - Individual rate under $1M'
    ),

    new TestCase(
        'FIRB Tier 2 - Exactly $1M',
        'FIRB Fees',
        {
            propertyValue: 1000000,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            firbApplicationFee: 13200
        },
        'FIRB Guidance Note 12 - Individual rate at $1M'
    ),

    new TestCase(
        'FIRB Tier 2 - Just over $1M',
        'FIRB Fees',
        {
            propertyValue: 1000001,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            firbApplicationFee: 26400
        },
        'FIRB Guidance Note 12 - Individual rate over $1M'
    ),

    new TestCase(
        'FIRB Tier 3 - Just below $2M',
        'FIRB Fees',
        {
            propertyValue: 1999999,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            firbApplicationFee: 26400
        },
        'FIRB Guidance Note 12 - Individual rate under $2M'
    ),

    new TestCase(
        'FIRB Tier 3 - Exactly $2M',
        'FIRB Fees',
        {
            propertyValue: 2000000,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            firbApplicationFee: 26400
        },
        'FIRB Guidance Note 12 - Individual rate at $2M'
    ),

    new TestCase(
        'FIRB Tier 3 - Just over $2M',
        'FIRB Fees',
        {
            propertyValue: 2000001,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            firbApplicationFee: 33000
        },
        'FIRB Guidance Note 12 - Individual rate over $2M'
    ),

    new TestCase(
        'FIRB Tier 4 - $5M property',
        'FIRB Fees',
        {
            propertyValue: 5000000,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            firbApplicationFee: 66000
        },
        'FIRB Guidance Note 12 - Individual rate $3M-$10M tier'
    ),

    new TestCase(
        'FIRB Tier 5 - $15M property',
        'FIRB Fees',
        {
            propertyValue: 15000000,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            firbApplicationFee: 132000
        },
        'FIRB Guidance Note 12 - Individual rate $10M+ tier'
    ),

    // Entity applicant (company/trust) - higher fees
    new TestCase(
        'FIRB Entity - Under $1M',
        'FIRB Fees',
        {
            propertyValue: 500000,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'company'
        },
        {
            firbApplicationFee: 14300
        },
        'FIRB Guidance Note 12 - Entity rate under $1M'
    ),

    new TestCase(
        'FIRB Entity - $1M-$2M',
        'FIRB Fees',
        {
            propertyValue: 1500000,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'company'
        },
        {
            firbApplicationFee: 28600
        },
        'FIRB Guidance Note 12 - Entity rate $1M-$2M'
    )
];

/**
 * NSW Stamp Duty Tests
 * Source: https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty
 */
const nswStampDutyTests = [
    new TestCase(
        'NSW - $500k established dwelling',
        'Stamp Duty - NSW',
        {
            propertyValue: 500000,
            propertyType: 'established',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            stampDuty: 17990,
            surchargeStampDuty: 40000 // 8% surcharge
        },
        'NSW Revenue Office Calculator'
    ),

    new TestCase(
        'NSW - $1M established dwelling',
        'Stamp Duty - NSW',
        {
            propertyValue: 1000000,
            propertyType: 'established',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            stampDuty: 40490,
            surchargeStampDuty: 80000 // 8% surcharge
        },
        'NSW Revenue Office Calculator'
    ),

    new TestCase(
        'NSW - $1.5M established dwelling',
        'Stamp Duty - NSW',
        {
            propertyValue: 1500000,
            propertyType: 'established',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            stampDuty: 65240,
            surchargeStampDuty: 120000 // 8% surcharge
        },
        'NSW Revenue Office Calculator'
    ),

    new TestCase(
        'NSW - $500k new dwelling (potential concession)',
        'Stamp Duty - NSW',
        {
            propertyValue: 500000,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            // New properties may have different rates - document actual
            stampDuty: 17990,
            surchargeStampDuty: 40000
        },
        'NSW Revenue Office - New property rates'
    )
];

/**
 * VIC Stamp Duty Tests
 * Source: https://www.sro.vic.gov.au/calculators
 */
const vicStampDutyTests = [
    new TestCase(
        'VIC - $500k established dwelling',
        'Stamp Duty - VIC',
        {
            propertyValue: 500000,
            propertyType: 'established',
            state: 'VIC',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            stampDuty: 25070,
            surchargeStampDuty: 40000 // 8% AFAD surcharge
        },
        'VIC SRO Calculator'
    ),

    new TestCase(
        'VIC - $1M established dwelling',
        'Stamp Duty - VIC',
        {
            propertyValue: 1000000,
            propertyType: 'established',
            state: 'VIC',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            stampDuty: 55000,
            surchargeStampDuty: 80000 // 8% AFAD surcharge
        },
        'VIC SRO Calculator'
    ),

    new TestCase(
        'VIC - $850k new dwelling',
        'Stamp Duty - VIC',
        {
            propertyValue: 850000,
            propertyType: 'new',
            state: 'VIC',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            // VIC has specific rates for new properties
            stampDuty: 45070,
            surchargeStampDuty: 68000
        },
        'VIC SRO Calculator - New property'
    )
];

/**
 * QLD Stamp Duty Tests
 * Source: https://www.qld.gov.au/housing/buying-owning-home/transfer-duty-calculator
 */
const qldStampDutyTests = [
    new TestCase(
        'QLD - $500k property',
        'Stamp Duty - QLD',
        {
            propertyValue: 500000,
            propertyType: 'established',
            state: 'QLD',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            stampDuty: 15925,
            surchargeStampDuty: 35000 // 7% AFAD
        },
        'QLD Treasury Calculator'
    ),

    new TestCase(
        'QLD - $1M property',
        'Stamp Duty - QLD',
        {
            propertyValue: 1000000,
            propertyType: 'established',
            state: 'QLD',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            stampDuty: 38025,
            surchargeStampDuty: 70000 // 7% AFAD
        },
        'QLD Treasury Calculator'
    )
];

/**
 * Edge Case Tests
 */
const edgeCaseTests = [
    new TestCase(
        'Edge Case - Minimum value ($1)',
        'Edge Cases',
        {
            propertyValue: 1,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            firbApplicationFee: 13200, // Minimum FIRB fee
            stampDuty: 0, // Below threshold
            surchargeStampDuty: 0
        },
        'Minimum value handling'
    ),

    new TestCase(
        'Edge Case - Very high value ($50M)',
        'Edge Cases',
        {
            propertyValue: 50000000,
            propertyType: 'established',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            firbApplicationFee: 132000, // Max tier for residential
            // Stamp duty calculated normally (very high)
            stampDuty: 2795990
        },
        'Very high value handling'
    ),

    new TestCase(
        'Edge Case - Decimal precision ($999,999.99)',
        'Edge Cases',
        {
            propertyValue: 999999.99,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            firbApplicationFee: 13200, // Should round to under $1M tier
            stampDuty: 40490,
            surchargeStampDuty: 80000
        },
        'Decimal rounding at tier boundary'
    ),

    new TestCase(
        'Edge Case - Exact tier boundary ($1,000,000.00)',
        'Edge Cases',
        {
            propertyValue: 1000000.00,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            firbApplicationFee: 13200, // At or under threshold
            stampDuty: 40490,
            surchargeStampDuty: 80000
        },
        'Exact tier boundary handling'
    ),

    new TestCase(
        'Edge Case - Just over tier ($1,000,000.01)',
        'Edge Cases',
        {
            propertyValue: 1000000.01,
            propertyType: 'new',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            firbApplicationFee: 26400, // Next tier up
            stampDuty: 40490,
            surchargeStampDuty: 80000
        },
        'Just over tier boundary'
    )
];

/**
 * Land Tax Tests
 */
const landTaxTests = [
    new TestCase(
        'NSW Land Tax - Above threshold',
        'Land Tax',
        {
            propertyValue: 1000000,
            propertyType: 'established',
            state: 'NSW',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            landTaxSurcharge: 8000 // 2% of land value (assuming 80% land value)
        },
        'NSW Land Tax Act'
    ),

    new TestCase(
        'VIC Land Tax - Above threshold',
        'Land Tax',
        {
            propertyValue: 1000000,
            propertyType: 'established',
            state: 'VIC',
            firstTimeBuyer: false,
            ownsOtherAustralianProperty: false,
            entityType: 'individual'
        },
        {
            landTaxSurcharge: 6000 // 1.5% of site value
        },
        'VIC Land Tax Act'
    )
];

/**
 * Combine all test cases
 */
const allTests = [
    ...firbFeeTierTests,
    ...nswStampDutyTests,
    ...vicStampDutyTests,
    ...qldStampDutyTests,
    ...edgeCaseTests,
    ...landTaxTests
];

/**
 * Run all tests
 */
function runAllTests() {
    console.log('🧪 Running FIRB Calculator Test Suite...\n');

    testResults.passed = [];
    testResults.failed = [];
    testResults.warnings = [];

    allTests.forEach((test, index) => {
        console.log(`Test ${index + 1}/${allTests.length}: ${test.name}`);

        const passed = test.run();

        if (passed) {
            testResults.passed.push(test);
            console.log(`✅ PASSED`);
        } else {
            testResults.failed.push(test);
            console.log(`❌ FAILED - Discrepancy: $${test.discrepancy.toFixed(2)}`);

            // Log details
            test.checks.forEach(check => {
                if (!check.passed) {
                    console.log(`   ${check.field}: Expected $${check.expected}, Got $${check.actual} (Diff: $${check.difference})`);
                }
            });
        }

        console.log('');
    });

    generateTestReport();
}

/**
 * Generate test report
 */
function generateTestReport() {
    const total = allTests.length;
    const passed = testResults.passed.length;
    const failed = testResults.failed.length;
    const passRate = ((passed / total) * 100).toFixed(1);

    testResults.summary = {
        total,
        passed,
        failed,
        passRate: parseFloat(passRate)
    };

    console.log('='.repeat(80));
    console.log('TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} (${passRate}%)`);
    console.log(`Failed: ${failed}`);
    console.log('');

    if (failed > 0) {
        console.log('FAILED TESTS:');
        console.log('-'.repeat(80));
        testResults.failed.forEach(test => {
            console.log(`\n❌ ${test.name} (${test.category})`);
            console.log(`   Source: ${test.source}`);
            console.log(`   Max Discrepancy: $${test.discrepancy.toFixed(2)}`);
            test.checks.forEach(check => {
                if (!check.passed) {
                    console.log(`   ${check.field}:`);
                    console.log(`      Expected: $${check.expected.toLocaleString()}`);
                    console.log(`      Actual:   $${check.actual.toLocaleString()}`);
                    console.log(`      Diff:     $${check.difference.toLocaleString()}`);
                }
            });
        });
    }

    console.log('\n' + '='.repeat(80));

    return testResults;
}

/**
 * Generate HTML test report
 */
function generateHTMLReport() {
    const report = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FIRB Calculator Test Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        h1 {
            color: #2563eb;
        }
        .summary {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .summary-card {
            padding: 15px;
            border-radius: 6px;
            text-align: center;
        }
        .summary-card.passed {
            background: #ecfdf5;
            border: 2px solid #10b981;
        }
        .summary-card.failed {
            background: #fef2f2;
            border: 2px solid #ef4444;
        }
        .summary-card h3 {
            margin: 0;
            font-size: 36px;
        }
        .summary-card p {
            margin: 5px 0 0 0;
            color: #666;
        }
        .test-results {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .test-case {
            border-left: 4px solid #e5e7eb;
            padding: 15px;
            margin-bottom: 15px;
            background: #f9fafb;
        }
        .test-case.passed {
            border-left-color: #10b981;
        }
        .test-case.failed {
            border-left-color: #ef4444;
        }
        .test-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 10px;
        }
        .test-name {
            font-weight: bold;
            font-size: 16px;
        }
        .test-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
        }
        .test-badge.passed {
            background: #10b981;
            color: white;
        }
        .test-badge.failed {
            background: #ef4444;
            color: white;
        }
        .test-details {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        .test-source {
            font-style: italic;
            color: #888;
            font-size: 13px;
        }
        .discrepancy {
            background: #fee2e2;
            padding: 10px;
            margin-top: 10px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 13px;
        }
        .category-filter {
            margin: 20px 0;
        }
        .category-filter button {
            margin-right: 10px;
            padding: 8px 16px;
            border: 1px solid #d1d5db;
            background: white;
            border-radius: 6px;
            cursor: pointer;
        }
        .category-filter button.active {
            background: #2563eb;
            color: white;
            border-color: #2563eb;
        }
    </style>
</head>
<body>
    <h1>📊 FIRB Calculator Test Report</h1>

    <div class="summary">
        <h2>Test Summary</h2>
        <div class="summary-grid">
            <div class="summary-card">
                <h3>${testResults.summary.total}</h3>
                <p>Total Tests</p>
            </div>
            <div class="summary-card passed">
                <h3>${testResults.summary.passed}</h3>
                <p>Passed (${testResults.summary.passRate}%)</p>
            </div>
            <div class="summary-card failed">
                <h3>${testResults.summary.failed}</h3>
                <p>Failed</p>
            </div>
        </div>
    </div>

    <div class="test-results">
        <h2>Test Results</h2>

        ${allTests.map(test => `
            <div class="test-case ${test.passed ? 'passed' : 'failed'}">
                <div class="test-header">
                    <div>
                        <div class="test-name">${test.name}</div>
                        <div class="test-details">${test.category}</div>
                        <div class="test-source">Source: ${test.source}</div>
                    </div>
                    <div class="test-badge ${test.passed ? 'passed' : 'failed'}">
                        ${test.passed ? '✅ PASSED' : '❌ FAILED'}
                    </div>
                </div>
                ${!test.passed ? `
                    <div class="discrepancy">
                        <strong>Discrepancies:</strong><br>
                        ${test.checks.filter(c => !c.passed).map(check => `
                            ${check.field}:<br>
                            &nbsp;&nbsp;Expected: $${check.expected.toLocaleString()}<br>
                            &nbsp;&nbsp;Actual: $${check.actual.toLocaleString()}<br>
                            &nbsp;&nbsp;Difference: $${check.difference.toLocaleString()}<br>
                        `).join('<br>')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>

    <footer style="text-align: center; margin-top: 40px; color: #888; font-size: 14px;">
        <p>Generated: ${new Date().toLocaleString()}</p>
        <p>FIRB Calculator Test Suite v1.0.0</p>
    </footer>
</body>
</html>
    `;

    return report;
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.runAllTests = runAllTests;
    window.testResults = testResults;
    window.generateHTMLReport = generateHTMLReport;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllTests,
        testResults,
        generateHTMLReport,
        TestCase,
        allTests
    };
}
