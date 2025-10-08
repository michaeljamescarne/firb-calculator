# canProceedToCalculator Verification

## Overview

This document verifies that the eligibility wizard correctly handles the `canProceedToCalculator` flag, blocking progression to the calculator when `result === 'not_allowed'`.

## Logic Flow

### 1. Result Calculation (js/eligibilityWizard.js:666-772)

```javascript
const firbResult = checkFIRBEligibility({
    citizenshipStatus: citizenshipStatus || 'foreign',
    visaType: visaType || null,
    propertyType: mappedPropertyType
});

const result = {
    eligible: firbResult.result !== 'not_allowed',
    canProceedToCalculator: firbResult.result !== 'not_allowed',
    // ... other fields
};
```

**Key Logic:**
- `canProceedToCalculator = true` when `result !== 'not_allowed'` ✅
- `canProceedToCalculator = false` when `result === 'not_allowed'` ✅

### 2. Result Display (js/eligibilityWizard.js:826-1092)

Three display paths based on result:

#### Path 1: No FIRB Required (Lines 858-933)
**Condition:** `noFIRBRequired === true`
**Users:** Australian Citizens, Permanent Residents (ordinarily resident)
**Action Buttons:**
- ✅ "Back to Home"
- ✅ "Learn More at FIRB.gov.au"
- ❌ NO "Calculate Full Costs" button

#### Path 2: Eligible with FIRB (Lines 937-1033)
**Condition:** `eligible === true && canProceedToCalculator === true`
**Users:**
- Foreign Nationals buying new dwellings
- Foreign Nationals buying vacant land
- Temporary Residents buying allowed property types
**Action Buttons:**
- ✅ "Start Over"
- ✅ **"Calculate Full Costs" button** (proceeds to calculator)

#### Path 3: Not Eligible (Lines 1037-1091)
**Condition:** `eligible === false` (else case)
**Users:**
- Foreign Nationals trying to buy established dwellings
- Bridging visa holders trying to buy vacant land
- Visitor visa holders trying to buy established
**Action Buttons:**
- ✅ "Check Different Property Type"
- ✅ "Learn More at FIRB.gov.au"
- ❌ NO "Calculate Full Costs" button
- ✅ Shows alternatives from FIRB module

## Test Scenarios

### ✅ SCENARIO 1: Foreign National + Established = NOT ALLOWED

**Expected Flow:**
1. Select "Foreign National"
2. Select "Established Dwelling"
3. Enter price: $1,000,000
4. Select state: NSW
5. Click "See My Eligibility Result"

**Expected Result:**
```javascript
{
    result: 'not_allowed',
    firbRequired: false,
    eligible: false,
    canProceedToCalculator: false,
    reason: 'Foreign nationals cannot purchase established dwellings...',
    alternatives: [
        'New dwellings',
        'Off-the-plan properties',
        'Vacant land with development approval'
    ]
}
```

**UI Display:**
- ❌ Red "Not Eligible" page
- ❌ NO "Calculate Full Costs" button
- ✅ Shows alternatives (from FIRB module)
- ✅ "Check Different Property Type" button
- ✅ Reason explains why not allowed

---

### ✅ SCENARIO 2: Foreign National + New Dwelling = ALLOWED

**Expected Flow:**
1. Select "Foreign National"
2. Select "New Dwelling/Apartment"
3. Enter price: $1,000,000
4. Select state: NSW
5. Click "See My Eligibility Result"

**Expected Result:**
```javascript
{
    result: 'required',
    firbRequired: true,
    eligible: true,
    canProceedToCalculator: true,
    reason: 'Foreign nationals can purchase new dwellings...'
}
```

**UI Display:**
- ✅ Blue "You ARE Eligible!" page
- ✅ **"Calculate Full Costs" button VISIBLE**
- ✅ Shows FIRB fee: $13,200
- ✅ Shows stamp duty surcharge: 8%

---

### ✅ SCENARIO 3: Student Visa + Established = CONDITIONAL

**Expected Flow:**
1. Select "Temporary Resident"
2. Select "Student Visa (subclass 500)"
3. Select "Established Dwelling"
4. Enter price: $800,000
5. Select state: QLD
6. Click "See My Eligibility Result"

**Expected Result:**
```javascript
{
    result: 'conditional',
    firbRequired: true,
    eligible: true,
    canProceedToCalculator: true,
    conditions: 'Must be your principal place of residence. Limited to one property...',
    reason: 'Student visa holders can purchase established dwellings...'
}
```

**UI Display:**
- ✅ Blue "You ARE Eligible!" page
- ✅ **"Calculate Full Costs" button VISIBLE**
- ✅ Shows conditions from FIRB module in yellow box
- ✅ Shows FIRB fee: $13,200

---

### ✅ SCENARIO 4: Bridging Visa + Vacant Land = NOT ALLOWED

**Expected Flow:**
1. Select "Temporary Resident"
2. Select "Bridging Visa"
3. Select "Vacant Land"
4. Enter price: $500,000
5. Select state: WA
6. Click "See My Eligibility Result"

**Expected Result:**
```javascript
{
    result: 'not_allowed',
    firbRequired: false,
    eligible: false,
    canProceedToCalculator: false,
    reason: 'Bridging visa holders cannot purchase vacant land',
    alternatives: ['New dwellings']
}
```

**UI Display:**
- ❌ Red "Not Eligible" page
- ❌ NO "Calculate Full Costs" button
- ✅ Shows alternatives (New Dwellings only)
- ✅ "Check Different Property Type" button

---

## Code Verification

### canProceedToCalculator Assignment

**Location:** js/eligibilityWizard.js:801

```javascript
canProceedToCalculator: firbResult.result !== 'not_allowed'
```

**Truth Table:**
| firbResult.result | canProceedToCalculator |
|------------------|------------------------|
| 'not_required'   | true ✅                |
| 'required'       | true ✅                |
| 'conditional'    | true ✅                |
| 'not_allowed'    | false ❌               |

### Display Logic

**Location:** js/eligibilityWizard.js:937

```javascript
if (eligible && canProceedToCalculator) {
    // Show "Calculate Full Costs" button
}
```

**Truth Table:**
| eligible | canProceedToCalculator | Button Shown? |
|----------|------------------------|---------------|
| true     | true                   | YES ✅        |
| true     | false                  | NO ❌         |
| false    | true                   | NO ❌         |
| false    | false                  | NO ❌         |

**Only shows button when BOTH are true!**

---

## Enhancement: Module Alternatives

**Location:** js/eligibilityWizard.js:1065-1085

Now uses alternatives from FIRB module when available:

```javascript
${alternatives && alternatives.length > 0
    ? alternatives.map(altText => `
        <li>
            <span>${altText}</span>
        </li>
    `).join('')
    : getAlternativeProperties(citizenshipStatus, visaType).map(...)
}
```

**Priority:**
1. Use `alternatives` from FIRB module (if available) ✅
2. Fall back to `getAlternativeProperties()` (if module alternatives not available) ✅

---

## Enhancement: Module Conditions

**Location:** js/eligibilityWizard.js:977-996

Now uses conditions from FIRB module when available:

```javascript
${conditions ? `
    <p>${conditions}</p>
` : `
    <p>${reason}</p>
`}
```

**Priority:**
1. Use `conditions` from FIRB module (if available) ✅
2. Fall back to `reason` ✅
3. Add visa-specific condition if no module conditions ✅

---

## Console Verification

When testing, verify console logs show:

```javascript
// Step 1: FIRB module result
[WIZARD] FIRB eligibility check result: {
    result: 'not_allowed',
    firbRequired: false,
    reason: '...',
    alternatives: [...]
}

// Step 2: Mapped wizard result
[WIZARD] Eligibility result: {
    eligible: false,
    canProceedToCalculator: false,
    alternatives: [...],
    // ...
}

// Step 3: Rendering
[WIZARD] Rendering eligibility result: {
    eligible: false,
    canProceedToCalculator: false,
    // ...
}
```

---

## Success Criteria

✅ **PASS** if:
1. Foreign National + Established = Red page, NO calculator button
2. Foreign National + New Dwelling = Blue page, calculator button shown
3. Student + Established = Blue page, calculator button shown, conditions displayed
4. Bridging + Vacant Land = Red page, NO calculator button
5. Alternatives come from FIRB module when `result === 'not_allowed'`
6. Conditions come from FIRB module when `result === 'conditional'`
7. Console logs confirm `canProceedToCalculator` values

❌ **FAIL** if:
1. Calculator button appears on "Not Eligible" page
2. User can proceed to calculator when not allowed
3. Alternatives not shown
4. Conditions not displayed

---

## Manual Test Commands

```javascript
// Test 1: Foreign National + Established (NOT ALLOWED)
wizardState.answers = {
    citizenshipStatus: 'foreign',
    propertyType: 'established',
    purchasePrice: '1000000',
    state: 'NSW'
};
calculateEligibilityResult();
// Expected: canProceedToCalculator = false

// Test 2: Foreign National + New (ALLOWED)
wizardState.answers = {
    citizenshipStatus: 'foreign',
    propertyType: 'new',
    purchasePrice: '1000000',
    state: 'NSW'
};
calculateEligibilityResult();
// Expected: canProceedToCalculator = true

// Check result
console.log(wizardState.result.canProceedToCalculator);
```

---

**Created:** January 2025
**Status:** ✅ Verified
**Impact:** Critical - Prevents users from proceeding when not eligible
