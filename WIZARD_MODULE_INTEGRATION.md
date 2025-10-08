# Eligibility Wizard - FIRB Module Integration

## Overview

The eligibility wizard has been updated to use the centralized `checkFIRBEligibility()` function from `src/utils/firbEligibility.js` instead of maintaining its own separate eligibility logic.

## What Changed

### Before
- Wizard had its own custom eligibility checking logic in `checkPropertyEligibility()`
- Separate hardcoded rules for each citizenship status and property type
- Duplicate logic that could get out of sync with other parts of the app

### After
- Wizard now uses the centralized `window.FIRBEligibility.checkFIRBEligibility()` function
- Single source of truth for all FIRB eligibility rules
- Consistent eligibility checking across the entire application
- Automatic fallback to old logic if module not available

## Modified Functions

### 1. `checkPropertyEligibility(propertyType)` (Lines 565-622)

**Purpose:** Check if a property type is eligible based on current wizard answers

**Changes:**
- Now calls `checkFIRBEligibility()` from the FIRB module
- Maps wizard property types to module property types
- Converts module result format to wizard format
- Includes fallback logic if module not loaded

**Example:**
```javascript
// Old way (hardcoded logic)
if (citizenshipStatus === 'foreign' && propertyType === 'established') {
    return { eligible: false, message: 'Not allowed' };
}

// New way (centralized module)
const result = checkFIRBEligibility({
    citizenshipStatus: 'foreign',
    propertyType: 'established'
});
// result.result === 'not_allowed'
```

### 2. `calculateEligibilityResult()` (Lines 666-772)

**Purpose:** Calculate final eligibility when user completes all wizard steps

**Changes:**
- Calls `checkFIRBEligibility()` instead of using custom logic
- Stores full FIRB module result in `result.firbModuleResult`
- Maps module properties (conditions, alternatives, etc.) to wizard result
- Includes comprehensive error handling and fallback

**Result Format:**
```javascript
{
    eligible: boolean,              // Can purchase this property?
    noFIRBRequired: boolean,        // Is FIRB approval needed?
    reason: string,                 // Main reason/explanation
    conditions: string,             // Any conditions (from module)
    alternatives: string[],         // Alternative options (from module)
    firbFee: number,               // Estimated FIRB fee
    surcharge: number,             // State surcharge %
    state: string,                 // State code
    propertyType: string,          // Property type
    citizenshipStatus: string,     // Citizenship status
    visaType: string,              // Visa type (if applicable)
    purchasePrice: number,         // Purchase price
    canProceedToCalculator: boolean, // Can continue to full calculator?
    firbModuleResult: object       // Full result from FIRB module
}
```

### 3. `handleCitizenshipChange(value)` (Lines 435-517)

**Purpose:** Handle citizenship status selection (Step 1)

**Changes:**
- For Australian citizens: Calls module to get official reason text
- For Permanent Residents: Calls module to get official reason text
- Falls back to hardcoded messages if module not available
- Logs module usage for debugging

## Property Type Mapping

The wizard uses simplified property type codes that are mapped to the module's property types:

```javascript
const propertyTypeMap = {
    'new': 'newDwelling',           // New dwelling/apartment
    'offThePlan': 'newDwelling',    // Off-the-plan (treated as new)
    'established': 'established',    // Established dwelling
    'vacant': 'vacantLand',         // Vacant land
    'commercial': 'commercial'       // Commercial property
};
```

## Error Handling

The integration includes multiple layers of error handling:

1. **Module Check:** Verifies FIRB module is loaded before use
2. **Try-Catch:** Wraps all module calls in error handlers
3. **Fallback Logic:** Uses original wizard logic if module fails
4. **Console Logging:** Detailed logs for debugging

## Testing the Integration

### Test Scenarios

1. **Australian Citizen**
   - Select "Australian Citizen"
   - Should see message from FIRB module
   - Console should show: `[WIZARD] Using FIRB module result for Australian citizen`

2. **Permanent Resident**
   - Select "Permanent Resident"
   - Should see message from FIRB module
   - Console should show: `[WIZARD] Using FIRB module result for PR`

3. **Foreign National → New Dwelling**
   - Select "Foreign National"
   - Select "New Dwelling/Apartment"
   - Enter price: $1,000,000
   - Select state: NSW
   - Should show: Eligible with FIRB required
   - Console should show full FIRB result

4. **Foreign National → Established**
   - Select "Foreign National"
   - Select "Established Dwelling"
   - Should show: NOT ALLOWED with alternatives
   - Console should show `result.result === 'not_allowed'`

5. **Student Visa → Established**
   - Select "Temporary Resident"
   - Select "Student Visa"
   - Select "Established Dwelling"
   - Should show: Eligible with conditions
   - Console should show conditional result

### Console Commands

```javascript
// Check if module is loaded
window.FIRBEligibility

// Run all FIRB tests
runFIRBEligibilityTests()

// Check wizard state
wizardState.answers

// Manually test eligibility
window.FIRBEligibility.checkFIRBEligibility({
    citizenshipStatus: 'foreign',
    propertyType: 'established'
})
```

## Benefits

### 1. Consistency
- Single source of truth for all eligibility rules
- Same logic used everywhere in the app

### 2. Maintainability
- Only need to update rules in one place
- Easier to add new rules or conditions

### 3. Testability
- Centralized module has comprehensive test suite (18 tests)
- Can verify wizard uses correct logic

### 4. Reliability
- Fallback logic ensures wizard still works if module fails
- Error handling prevents crashes

### 5. Flexibility
- Easy to add new property types or citizenship statuses
- Module provides structured result format

## Backwards Compatibility

The integration maintains backwards compatibility:

- **Module not loaded:** Wizard uses original fallback logic
- **Module fails:** Error is caught and fallback is used
- **API changes:** Wizard can be updated independently

## Future Enhancements

1. **Remove fallback logic** once module is proven stable
2. **Use module's conditions** to display more detailed requirements
3. **Leverage alternatives** to suggest better property options
4. **Add metadata** from module (surcharges, fees, timelines)

## Files Modified

- `js/eligibilityWizard.js` - Updated eligibility checking functions
- `index.html` - Already includes `src/utils/firbEligibility.js`

## Related Documentation

- [FIRB Eligibility Module README](src/utils/README.md)
- [Test Output Example](TEST_OUTPUT_EXAMPLE.md)
- [FIRB Module Source](src/utils/firbEligibility.js)

---

**Created:** January 2025
**Status:** ✅ Completed
**Impact:** High - Centralizes all eligibility logic
