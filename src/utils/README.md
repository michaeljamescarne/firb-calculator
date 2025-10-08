# FIRB Eligibility Checker

A comprehensive JavaScript module for checking Foreign Investment Review Board (FIRB) eligibility for property purchases in Australia.

## Overview

This module determines whether FIRB approval is required based on:
- Citizenship status (Australian, Permanent Resident, Temporary Resident, Foreign National)
- Visa type (for temporary residents)
- Property type (New Dwelling, Established, Vacant Land, Commercial)

## Installation

```javascript
// Node.js / ES6
import { checkFIRBEligibility } from './src/utils/firbEligibility.js';

// Browser (via script tag)
<script src="src/utils/firbEligibility.js"></script>
// Access via: window.FIRBEligibility.checkFIRBEligibility()
```

## Quick Start

```javascript
// Example 1: Australian citizen
const result = checkFIRBEligibility({
    citizenshipStatus: 'australian',
    propertyType: 'established'
});
console.log(result.firbRequired); // false
console.log(result.reason); // "Australian citizens do not require FIRB approval..."

// Example 2: Foreign national
const result2 = checkFIRBEligibility({
    citizenshipStatus: 'foreign',
    propertyType: 'newDwelling'
});
console.log(result2.firbRequired); // true
console.log(result2.reason); // "Foreign nationals can purchase new dwellings..."

// Example 3: Temporary resident (student)
const result3 = checkFIRBEligibility({
    citizenshipStatus: 'temporary',
    visaType: 'student',
    propertyType: 'established'
});
console.log(result3.firbRequired); // true
console.log(result3.conditions); // Specific conditions for student visa holders
```

## API Reference

### `checkFIRBEligibility(params)`

Main function to check FIRB eligibility.

**Parameters:**
- `citizenshipStatus` (string, required): One of:
  - `'australian'` - Australian Citizen
  - `'permanent'` - Permanent Resident
  - `'temporary'` - Temporary Resident
  - `'foreign'` - Foreign National

- `propertyType` (string, required): One of:
  - `'newDwelling'` - Brand new, never occupied
  - `'established'` - Previously occupied
  - `'offThePlan'` - Not yet built
  - `'vacantLand'` - Undeveloped land
  - `'commercial'` - Commercial property

- `visaType` (string, required if temporary resident): One of:
  - `'student'` - Student Visa (subclass 500)
  - `'skilled'` - Skilled Visa (subclass 482, 485, 189, 190)
  - `'partner'` - Partner Visa (subclass 309, 820)
  - `'bridging'` - Bridging Visa
  - `'visitor'` - Tourist/Visitor Visa
  - `'other'` - Other temporary visa

- `isOrdinarilyResident` (boolean, optional): For permanent residents only. Default: `true`

**Returns:**

Object with the following properties:

```javascript
{
    result: string,           // 'not_required' | 'required' | 'conditional' | 'not_allowed'
    firbRequired: boolean,    // Whether FIRB approval is required
    reason: string,           // Explanation of the decision
    conditions: string,       // Any conditions that apply (optional)
    alternatives: string[],   // Alternative property types if not allowed (optional)
    citizenshipStatus: string,
    visaType: string,
    propertyType: string,
    citizenshipLabel: string,
    propertyTypeLabel: string,
    timestamp: string,        // ISO date string
    metadata: {              // Additional information
        allowed: boolean,
        stampDutySurcharge: boolean,
        landTaxSurcharge: boolean,
        vacancyFee: boolean,
        // ... other metadata based on scenario
    }
}
```

### Helper Functions

#### `getCitizenshipLabel(citizenshipStatus)`

Converts citizenship status code to human-readable label.

```javascript
getCitizenshipLabel('australian')  // "Australian Citizen"
getCitizenshipLabel('temporary')   // "Temporary Resident"
```

#### `getPropertyTypeDescription(propertyType)`

Converts property type code to human-readable description.

```javascript
getPropertyTypeDescription('newDwelling')  // "New Dwelling"
getPropertyTypeDescription('established')  // "Established Dwelling"
```

#### `runEligibilityTests()`

Runs comprehensive test suite. Returns test results object.

```javascript
const results = runEligibilityTests();
console.log(`${results.passed}/${results.totalTests} tests passed`);
// Outputs: "18/18 tests passed"
```

## Usage Examples

### Example 1: Complete Wizard Integration

```javascript
function handleEligibilityCheck(formData) {
    try {
        const result = checkFIRBEligibility({
            citizenshipStatus: formData.citizenship,
            visaType: formData.visaType,
            propertyType: formData.propertyType
        });

        if (result.firbRequired) {
            showFIRBRequiredMessage(result);
        } else {
            showNoFIRBRequiredMessage(result);
        }

        // Display conditions if any
        if (result.conditions) {
            showConditionsPanel(result.conditions);
        }

        // Show alternatives if property not allowed
        if (result.alternatives) {
            showAlternatives(result.alternatives);
        }

        return result;
    } catch (error) {
        console.error('Eligibility check failed:', error);
        showErrorMessage(error.message);
    }
}
```

### Example 2: Check All Property Types

```javascript
function checkAllPropertyTypes(citizenshipStatus, visaType) {
    const propertyTypes = ['newDwelling', 'established', 'offThePlan', 'vacantLand', 'commercial'];

    const results = propertyTypes.map(propertyType => {
        const result = checkFIRBEligibility({
            citizenshipStatus,
            visaType,
            propertyType
        });

        return {
            propertyType: result.propertyTypeLabel,
            allowed: result.result !== 'not_allowed',
            firbRequired: result.firbRequired,
            reason: result.reason
        };
    });

    return results;
}

// Usage
const studentResults = checkAllPropertyTypes('temporary', 'student');
console.table(studentResults);
```

### Example 3: Calculate Estimated Fees

```javascript
function calculateTotalCosts(purchasePrice, result) {
    const costs = {
        purchasePrice: purchasePrice,
        firbFee: 0,
        stampDuty: calculateStampDuty(purchasePrice, result.metadata.stampDutySurcharge),
        landTax: result.metadata.landTaxSurcharge ? estimateLandTax(purchasePrice) : 0,
        vacancyFee: result.metadata.vacancyFee ? estimateVacancyFee(purchasePrice) : 0
    };

    // Calculate FIRB fee based on purchase price
    if (result.firbRequired) {
        if (purchasePrice < 1000000) costs.firbFee = 13200;
        else if (purchasePrice < 2000000) costs.firbFee = 26400;
        else if (purchasePrice < 3000000) costs.firbFee = 39600;
        else costs.firbFee = 132000;
    }

    costs.total = costs.purchasePrice + costs.firbFee + costs.stampDuty + costs.landTax + costs.vacancyFee;

    return costs;
}
```

### Example 4: Display Results in UI

```javascript
function displayEligibilityResult(result) {
    const html = `
        <div class="eligibility-result ${result.firbRequired ? 'firb-required' : 'no-firb'}">
            <h2>${result.firbRequired ? '✓ FIRB Approval Required' : '✓ No FIRB Approval Needed'}</h2>

            <div class="result-badge ${result.result}">
                ${result.result.toUpperCase().replace('_', ' ')}
            </div>

            <div class="reason">
                <strong>Why:</strong> ${result.reason}
            </div>

            ${result.conditions ? `
                <div class="conditions">
                    <strong>⚠️ Conditions:</strong>
                    <p>${result.conditions}</p>
                </div>
            ` : ''}

            ${result.alternatives ? `
                <div class="alternatives">
                    <strong>Alternative Options:</strong>
                    <ul>
                        ${result.alternatives.map(alt => `<li>${alt}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            <div class="metadata">
                <div class="surcharge-info">
                    <span>Stamp Duty Surcharge: ${result.metadata.stampDutySurcharge ? 'YES (+8%)' : 'NO'}</span>
                    <span>Land Tax Surcharge: ${result.metadata.landTaxSurcharge ? 'YES' : 'NO'}</span>
                    <span>Vacancy Fee: ${result.metadata.vacancyFee ? 'YES' : 'NO'}</span>
                </div>
            </div>

            ${result.firbRequired ? `
                <div class="processing-time">
                    <strong>Estimated Processing:</strong> ${result.metadata.estimatedProcessingDays || '30-60'} days
                </div>
            ` : ''}
        </div>
    `;

    document.getElementById('results-container').innerHTML = html;
}
```

### Example 5: Validation Before Form Submission

```javascript
function validatePurchaseForm(formData) {
    const errors = [];

    // Check citizenship status
    if (!formData.citizenshipStatus) {
        errors.push('Please select your citizenship status');
    }

    // Check visa type for temporary residents
    if (formData.citizenshipStatus === 'temporary' && !formData.visaType) {
        errors.push('Please select your visa type');
    }

    // Check property type
    if (!formData.propertyType) {
        errors.push('Please select a property type');
    }

    // If validation passes, check eligibility
    if (errors.length === 0) {
        try {
            const result = checkFIRBEligibility(formData);

            // Block submission if property not allowed
            if (result.result === 'not_allowed') {
                errors.push(`This property type is not available for your citizenship status. ${result.reason}`);
            }

            return { valid: errors.length === 0, result, errors };
        } catch (error) {
            errors.push(error.message);
        }
    }

    return { valid: false, errors };
}
```

## FIRB Rules Summary

### Australian Citizens
- ✅ Can purchase any property type
- ✅ No FIRB approval required
- ✅ No foreign surcharges

### Permanent Residents (Ordinarily Resident)
- ✅ Can purchase any property type
- ✅ No FIRB approval required
- ✅ No foreign surcharges
- ⚠️ Must be ordinarily resident in Australia

### Permanent Residents (NOT Ordinarily Resident)
- ⚠️ Treated as foreign persons
- ⚠️ FIRB approval required
- ⚠️ Foreign surcharges apply

### Foreign Nationals
- ✅ New dwellings: ALLOWED (FIRB required)
- ✅ Off-the-plan: ALLOWED (FIRB required)
- ❌ Established: NOT ALLOWED
- ⚠️ Vacant land: ALLOWED with development conditions (FIRB required)
- ✅ Commercial: ALLOWED (FIRB required, different rules)

### Temporary Residents

#### Student / Skilled / Partner Visas
- ✅ New dwellings: ALLOWED (FIRB required)
- ⚠️ Established: ALLOWED with strict conditions (FIRB required)
  - Must be principal residence
  - Maximum 1 property
  - Cannot rent out
  - Must sell on departure
- ⚠️ Vacant land: ALLOWED with development conditions (FIRB required)

#### Bridging Visas
- ✅ New dwellings: ALLOWED (FIRB required)
- ❌ Established: NOT ALLOWED
- ❌ Vacant land: NOT ALLOWED

#### Visitor Visas
- ✅ New dwellings: ALLOWED for investment (FIRB required)
- ❌ Established: NOT ALLOWED
- ❌ Vacant land: NOT ALLOWED

## Constants

```javascript
// Citizenship statuses
CITIZENSHIP_STATUS.AUSTRALIAN_CITIZEN  // 'australian'
CITIZENSHIP_STATUS.PERMANENT_RESIDENT  // 'permanent'
CITIZENSHIP_STATUS.TEMPORARY_RESIDENT  // 'temporary'
CITIZENSHIP_STATUS.FOREIGN_NATIONAL    // 'foreign'

// Visa types
VISA_TYPES.STUDENT        // 'student'
VISA_TYPES.SKILLED        // 'skilled'
VISA_TYPES.PARTNER        // 'partner'
VISA_TYPES.BRIDGING       // 'bridging'
VISA_TYPES.VISITOR        // 'visitor'
VISA_TYPES.OTHER_TEMPORARY // 'other'

// Property types
PROPERTY_TYPES.NEW_DWELLING   // 'newDwelling'
PROPERTY_TYPES.ESTABLISHED    // 'established'
PROPERTY_TYPES.OFF_THE_PLAN   // 'offThePlan'
PROPERTY_TYPES.VACANT_LAND    // 'vacantLand'
PROPERTY_TYPES.COMMERCIAL     // 'commercial'

// Result types
FIRB_RESULT.NOT_REQUIRED  // 'not_required'
FIRB_RESULT.REQUIRED      // 'required'
FIRB_RESULT.CONDITIONAL   // 'conditional'
FIRB_RESULT.NOT_ALLOWED   // 'not_allowed'
```

## Error Handling

The module throws errors for invalid inputs:

```javascript
try {
    const result = checkFIRBEligibility({
        citizenshipStatus: 'invalid',  // Invalid value
        propertyType: 'newDwelling'
    });
} catch (error) {
    console.error(error.message);
    // "Invalid citizenshipStatus: invalid. Must be one of: australian, permanent, temporary, foreign"
}
```

## Testing

Run the built-in test suite:

```javascript
const testResults = runEligibilityTests();

console.log(`Total Tests: ${testResults.totalTests}`);
console.log(`Passed: ${testResults.passed}`);
console.log(`Failed: ${testResults.failed}`);
console.log(`Pass Rate: ${testResults.passRate}%`);

// View detailed results
testResults.results.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.test}`);
});
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills for optional chaining)
- Node.js 12+

## License

MIT

## Contributing

Please ensure all tests pass before submitting changes:

```javascript
const results = runEligibilityTests();
if (results.failed > 0) {
    console.error('Tests failed!');
}
```

## Resources

- [FIRB Official Website](https://firb.gov.au/)
- [FIRB Guidance Notes](https://firb.gov.au/guidance-resources/guidance-notes)
- [Residential Land Application Form](https://firb.gov.au/apply-for-approval)

## Version History

- **1.0.0** (January 2025) - Initial release
  - Complete eligibility checking for all citizenship types
  - Support for all visa types
  - Comprehensive test suite
  - Full documentation

---

**Created:** January 2025
**Status:** ✅ Production Ready
