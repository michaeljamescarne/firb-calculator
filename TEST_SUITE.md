# Test Suite Documentation

## Overview
Comprehensive test suite validating all FIRB Calculator calculations against official government sources. Ensures accuracy and compliance with Australian taxation and FIRB regulations.

## Test Coverage

### 1. FIRB Fee Tier Boundary Tests (10 tests)
Tests all tier boundaries to ensure correct fee application:
- **Tier 1**: Under $1M (13,200 individual / 26,400 company)
- **Tier 2**: $1M-$1,999,999 (26,400 individual / 52,800 company)
- **Tier 3**: $2M-$2,999,999 (39,600 individual / 79,200 company)
- **Tier 4**: $3M-$4,999,999 (52,800 individual / 105,600 company)
- **Tier 5**: $5M-$9,999,999 (79,200 individual / 158,400 company)
- **Tier 6**: $10M+ (105,600 individual / 211,200 company)

**Boundary tests:**
- Just below threshold (e.g., $999,999)
- Exact threshold (e.g., $1,000,000)
- Just above threshold (e.g., $1,000,001)

**Source:** [FIRB Guidance Note 12 - Fees](https://firb.gov.au/guidance-resources/guidance-notes/gn12)

### 2. State Stamp Duty Tests (9 tests)

**NSW (4 tests):**
- $500,000 property
- $1,000,000 property
- $3,000,000 property
- $5,000,000 property

**Source:** [Revenue NSW Transfer Duty Calculator](https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty)

**VIC (3 tests):**
- $600,000 property
- $1,500,000 property
- $2,000,000 property

**Source:** [SRO VIC Duty Calculator](https://www.sro.vic.gov.au/calculators)

**QLD (2 tests):**
- $750,000 property
- $2,500,000 property

**Source:** [QLD Transfer Duty Calculator](https://www.qld.gov.au/housing/buying-owning-home/transfer-duty-calculator)

### 3. Land Tax Threshold Tests (2 tests)
- NSW land tax threshold (verify $1,075,000 threshold)
- VIC land tax threshold (verify $50,000 threshold)

**Sources:**
- [Revenue NSW Land Tax](https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/land-tax)
- [SRO VIC Land Tax](https://www.sro.vic.gov.au/land-tax)

### 4. Edge Case Tests (6 tests)
- Minimum value ($1)
- Very high value ($50,000,000)
- Decimal precision ($1,234,567.89)
- Exact tier boundary ($1,000,000)
- Just above boundary ($1,000,001)
- Company vs individual comparison

## Running Tests

### In Browser Console:
```javascript
// Run all tests
const results = runAllTests();

// Generate summary report
const report = generateTestReport();
console.log(report);

// Generate HTML report
const htmlReport = generateHTMLReport();
document.body.innerHTML = htmlReport;
```

### Test Structure:
```javascript
const testCase = new TestCase(
    'Test name',
    'Category',
    {
        // Inputs
        propertyValue: 1000000,
        propertyType: 'new',
        state: 'NSW',
        entityType: 'individual'
    },
    {
        // Expected outputs
        firbApplicationFee: 26400,
        stampDuty: 40490
    },
    'Source reference'
);

const result = testCase.run();
```

## Test Results

### Pass/Fail Criteria:
- **PASS**: Calculated value within $1 of expected (rounding tolerance)
- **FAIL**: Difference exceeds $1 tolerance
- **Discrepancy**: Exact dollar difference displayed

### Expected Output:
```
=== TEST RESULTS ===

Category: FIRB Fees
✅ FIRB Tier 1 - Just below $1M threshold
   Expected: $13,200 | Actual: $13,200 | Difference: $0
✅ FIRB Tier 1 - Exactly $1M
   Expected: $26,400 | Actual: $26,400 | Difference: $0
...

=== SUMMARY ===
Total Tests: 27
Passed: 27
Failed: 0
Success Rate: 100%
```

## Validation Sources

### Official Government Calculators:

1. **FIRB Fees:**
   - [FIRB Guidance Note 12](https://firb.gov.au/guidance-resources/guidance-notes/gn12)
   - [FIRB Fee Schedule](https://firb.gov.au/guidance-resources/guidance-notes/gn12#fee-schedule)

2. **NSW:**
   - [Transfer Duty Calculator](https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty)
   - [Foreign Purchaser Additional Duty](https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty/foreign-person-duty)
   - [Land Tax Calculator](https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/land-tax)

3. **VIC:**
   - [Duty Calculator](https://www.sro.vic.gov.au/calculators)
   - [Additional Duty for Foreign Purchasers](https://www.sro.vic.gov.au/additional-duty-foreign-purchasers)
   - [Land Tax Calculator](https://www.sro.vic.gov.au/land-tax)

4. **QLD:**
   - [Transfer Duty Calculator](https://www.qld.gov.au/housing/buying-owning-home/transfer-duty-calculator)
   - [Additional Foreign Acquirer Duty](https://www.qld.gov.au/housing/buying-owning-home/foreign-ownership)

5. **WA:**
   - [Transfer Duty Information](https://www.wa.gov.au/organisation/department-of-finance/transfer-duty)
   - [Foreign Buyer Duty Surcharge](https://www.wa.gov.au/organisation/department-of-finance/transfer-duty-rates-and-exemptions)

6. **SA:**
   - [Land Tax Information](https://www.revenuesa.sa.gov.au/taxes-and-duties/land-tax)
   - [Foreign Investor Duty Surcharge](https://www.revenuesa.sa.gov.au/taxes-and-duties/stamp-duty/foreign-investor-duty-surcharge)

7. **TAS:**
   - [Duty Information](https://www.sro.tas.gov.au/property-duty)
   - [Foreign Investor Duty Surcharge](https://www.sro.tas.gov.au/property-duty/foreign-investor-duty-surcharge)

8. **ACT:**
   - [Conveyance Duty](https://www.revenue.act.gov.au/duties/conveyance-duty)
   - [Foreign Investor Duty Surcharge](https://www.revenue.act.gov.au/duties/foreign-investor-duty-surcharge)

9. **NT:**
   - [Stamp Duty Information](https://nt.gov.au/property/land-title-and-valuations/stamp-duty)

## Adding New Test Cases

### Template:
```javascript
const newTest = new TestCase(
    'Descriptive test name',
    'Category (FIRB Fees, Stamp Duty, Land Tax, Edge Cases)',
    {
        propertyValue: 1500000,
        propertyType: 'new', // or 'established'
        state: 'NSW',
        entityType: 'individual', // or 'company'
        firstHome: false, // optional
        vacantLand: false  // optional
    },
    {
        // Add expected values for validation
        firbApplicationFee: 26400,
        stampDuty: 64990,
        foreignBuyerSurcharge: 120000,
        // ... other fields
    },
    'Official source URL or reference'
);

// Add to appropriate test array
firbFeeTierTests.push(newTest);
// or nswStampDutyTests.push(newTest);
// or vicStampDutyTests.push(newTest);
// etc.
```

### Running Individual Test:
```javascript
const myTest = new TestCase(...);
const result = myTest.run();

if (result.passed) {
    console.log('✅ Test passed');
} else {
    console.log('❌ Test failed');
    console.log(`Discrepancy: $${result.discrepancy}`);
}
```

## Known Discrepancies

### Rounding Differences:
Some state calculators round at different stages, leading to $1-2 differences. Our tolerance allows $1 variance.

### Tier Boundaries:
If a test fails at a tier boundary:
1. Check the official FIRB guidance for current fees
2. Verify the calculation logic in `js/calculations.js`
3. Update expected values if regulations changed

### State Duty Changes:
State duties change annually (usually July 1). Update expected values when:
- State budgets announce new rates
- Thresholds change
- Surcharge rates adjust

## Maintenance Schedule

### Annual Review (July 1):
- Update all state duty expected values
- Verify FIRB fee schedule hasn't changed
- Check for new regulations

### Quarterly Review:
- Run full test suite
- Document any failures
- Update sources if URLs changed

### Before Major Release:
- Run full test suite
- Verify 100% pass rate
- Update documentation

## Test Categories

| Category | Tests | Purpose |
|----------|-------|---------|
| FIRB Fees | 10 | Validate tier boundaries and fee calculations |
| Stamp Duty | 9 | Verify state transfer duty calculations |
| Land Tax | 2 | Test threshold and annual tax calculations |
| Edge Cases | 6 | Ensure robustness with extreme values |
| **Total** | **27** | **Comprehensive validation** |

## Success Criteria

✅ **100% Pass Rate Required**
- All 27 tests must pass
- Discrepancies must be within $1 tolerance
- Any failure requires investigation

✅ **Official Source Validation**
- Each test links to official calculator
- Expected values verified manually
- Sources reviewed annually

✅ **Coverage Completeness**
- All FIRB tiers tested
- Major states covered (NSW, VIC, QLD)
- Edge cases included
- Both individual and company entities

## Troubleshooting

### Test Failures:

**"FIRB fee mismatch"**
- Check `calculations.js` getFIRBFee() function
- Verify tier thresholds match official guidance
- Ensure individual vs company logic correct

**"Stamp duty discrepancy"**
- Verify state-specific calculation in getStampDuty()
- Check for recent rate changes
- Confirm property type (new/established) handled correctly

**"Land tax incorrect"**
- Review getLandTax() calculation
- Verify threshold values
- Check progressive rate tiers

### All Tests Failing:
1. Ensure `calculations.js` loaded before test-suite.js
2. Verify `calculateFees()` function exists
3. Check browser console for errors

## Future Enhancements

### Additional Test Categories:
- [ ] First home buyer exemptions/concessions
- [ ] Vacant land calculations
- [ ] Off-the-plan purchases
- [ ] All states (WA, SA, TAS, ACT, NT)
- [ ] Multiple property scenarios
- [ ] Investment property vs owner-occupied

### Automation:
- [ ] Automated test runner on deployment
- [ ] CI/CD integration
- [ ] Email alerts on test failures
- [ ] Annual reminder for rate updates

### Reporting:
- [ ] Visual dashboard with charts
- [ ] Historical test results tracking
- [ ] Regression detection
- [ ] Export results to CSV/PDF

---

**Version:** 1.0.0
**Last Updated:** January 2025
**Test Count:** 27 tests
**Expected Pass Rate:** 100%
**Tolerance:** ±$1 for rounding
