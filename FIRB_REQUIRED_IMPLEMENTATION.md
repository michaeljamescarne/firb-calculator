# firbRequired Implementation

## Overview

Implemented conditional FIRB fee calculation and display based on citizenship status. Australian citizens and permanent residents (ordinarily resident) are exempt from FIRB fees, stamp duty surcharges, and foreign owner annual fees.

## Changes Made

### 1. js/calculations.js

#### calculateAllFees() Function (Lines 262-337)

**Added firbRequired Check:**
```javascript
// Check if FIRB is required (for foreign nationals, temporary residents)
// Australian citizens and permanent residents (ordinarily resident) are exempt
const firbRequired = formData.firbRequired !== false; // Default to true for backward compatibility

console.log('[CALCULATIONS] firbRequired:', firbRequired, 'citizenshipStatus:', formData.citizenshipStatus);
```

**Conditional Fee Calculation:**
```javascript
// Foreign investment fees (one-time) - only if FIRB required
const firbFee = firbRequired ? calculateFIRBFee(...) : 0;
const stampDutySurcharge = firbRequired ? calculateStampDutySurcharge(...) : 0;
const legalFees = firbRequired ? 2500 : 0;
```

**Conditional Annual Fees:**
```javascript
// Annual fees for foreign owners - only if FIRB required
const annualFees = {
    vacancyFee: firbRequired ? calculateAnnualVacancyFee(...) : 0,
    landTaxSurcharge: firbRequired ? calculateLandTaxSurcharge(...) : 0,
    councilRates: 2400,  // Applies to all
    waterRates: 1200,    // Applies to all
    insurance: Math.max(800, val * 0.003) // Applies to all
};
```

**Return Value:**
```javascript
return {
    // ... other fields
    firbRequired: firbRequired  // Include FIRB requirement status
};
```

---

### 2. js/eligibilityWizard.js

#### proceedToFullCalculator() Function (Lines 1271-1275)

**Set firbRequired Flag:**
```javascript
// Determine if FIRB is required based on citizenship status
// Australian citizens and permanent residents (ordinarily resident) are exempt
const firbRequired = citizenshipStatus !== 'australian' && citizenshipStatus !== 'permanent';
state.formData.firbRequired = firbRequired;
console.log('[WIZARD] Set firbRequired:', firbRequired);
```

**Truth Table:**
| Citizenship Status | firbRequired |
|-------------------|--------------|
| 'australian'      | false ❌     |
| 'permanent'       | false ❌     |
| 'temporary'       | true ✅      |
| 'foreign'         | true ✅      |

---

### 3. js/resultsDashboard.js

#### FIRB Fee Card Display (Lines 90-109)

**Before:**
```javascript
<!-- FIRB Fee Card -->
<div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
    <div class="text-2xl font-bold">${formatCurrency(fees.firb)}</div>
    <p class="text-xs text-gray-500 mt-1">Individual rate</p>
</div>
```

**After:**
```javascript
${fees.firbRequired ? `
    <!-- FIRB Required -->
    <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
        <h3 class="text-xs font-semibold text-gray-600 uppercase">FIRB Application Fee</h3>
        <div class="text-2xl font-bold text-gray-900">${formatCurrency(fees.firb)}</div>
        <p class="text-xs text-gray-500 mt-1">Individual rate</p>
    </div>
` : `
    <!-- No FIRB Required -->
    <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
        <h3 class="text-xs font-semibold text-gray-600 uppercase">FIRB Fee</h3>
        <div class="text-2xl font-bold text-green-600">$0</div>
        <p class="text-xs text-gray-500 mt-1">✓ No FIRB required</p>
    </div>
`}
```

#### Detailed Breakdown Section (Lines 291-323)

**Before:**
```javascript
<!-- Foreign Investment Fees (Collapsible) -->
<div class="border border-orange-200 rounded-lg mb-4">
    <!-- Always shown -->
</div>
```

**After:**
```javascript
${fees.firbRequired ? `
    <!-- Foreign Investment Fees (Collapsible) -->
    <div class="border border-orange-200 rounded-lg mb-4">
        <button onclick="toggleSection('foreign-fees')">...</button>
        <div id="foreign-fees">
            <div class="p-4 space-y-3">
                ${renderFeeLineItem('firbAppFee', 'FIRB Application Fee', fees.firb, ...)}
                ${renderFeeLineItem('stampSurcharge', 'Foreign Buyer Stamp Duty Surcharge', fees.stampDuty, ...)}
                ${renderFeeLineItem('legalFeesCard', 'Legal & Conveyancing Fees', fees.legal, ...)}
            </div>
        </div>
    </div>
` : `
    <!-- No FIRB Required Message -->
    <div class="border border-green-200 rounded-lg mb-4 bg-green-50 p-4">
        <div class="flex items-center">
            ${icons.checkCircle('w-5 h-5 text-green-600 mr-3')}
            <div>
                <h3 class="text-lg font-semibold text-gray-900">No Foreign Investment Fees Required</h3>
                <p class="text-sm text-gray-600 mt-1">As an Australian citizen or permanent resident (ordinarily resident), you are exempt from FIRB fees and foreign buyer surcharges.</p>
            </div>
        </div>
    </div>
`}
```

---

## User Flow

### Flow 1: Australian Citizen → Calculator

1. **Wizard:** User selects "Australian Citizen"
2. **Wizard Result:** Shows green success page, NO calculator button
3. **Direct Calculator Access:** User can still access calculator directly
4. **Calculator:**
   - `formData.firbRequired = false` (or undefined, defaults to true)
   - FIRB fee = $0
   - Stamp duty surcharge = $0
   - Legal fees = $0
   - Annual vacancy fee = $0
   - Annual land tax surcharge = $0
5. **Results Display:**
   - FIRB card shows: "$0" with green checkmark "✓ No FIRB required"
   - Detailed breakdown shows: "No Foreign Investment Fees Required" with explanation
   - Annual fees exclude vacancy fee and land tax surcharge

---

### Flow 2: Foreign National → Wizard → Calculator

1. **Wizard:** User selects "Foreign National"
2. **Wizard:** User selects "New Dwelling"
3. **Wizard:** User enters price: $1,000,000, state: NSW
4. **Wizard Result:**
   - Shows blue "You ARE Eligible!" page
   - Sets `wizardState.answers.citizenshipStatus = 'foreign'`
   - Shows "Calculate Full Costs" button
5. **Calculator Transfer:**
   - `proceedToFullCalculator()` runs
   - Sets `state.formData.firbRequired = true` (because citizenshipStatus !== 'australian' && !== 'permanent')
   - Console logs: `[WIZARD] Set firbRequired: true`
6. **Calculator:**
   - `formData.firbRequired = true`
   - FIRB fee = $13,200
   - Stamp duty surcharge = $80,000 (8% of $1M)
   - Legal fees = $2,500
   - Annual vacancy fee = calculated
   - Annual land tax surcharge = calculated
7. **Results Display:**
   - FIRB card shows: "$13,200" with orange border
   - Detailed breakdown shows collapsible "Foreign Investment Fees" section
   - Annual fees include vacancy fee and land tax surcharge

---

### Flow 3: Permanent Resident → Wizard → Calculator

1. **Wizard:** User selects "Permanent Resident"
2. **Wizard Result:**
   - Shows green success page with caveat about ordinarily resident
   - NO calculator button (because no FIRB required)
3. **Direct Calculator Access:** User can still access calculator directly
4. **Calculator:**
   - If user came through wizard: `formData.firbRequired = false`
   - If user accessed directly: `formData.firbRequired = undefined` → defaults to `true`
5. **Results Display:** Same as Australian Citizen (no FIRB fees)

**Note:** Permanent residents who are NOT ordinarily resident should be treated as foreign persons and require FIRB approval.

---

## Backward Compatibility

### Default Behavior
```javascript
const firbRequired = formData.firbRequired !== false; // Default to true for backward compatibility
```

**Why default to true?**
- Existing users who access calculator directly (without wizard) should still see FIRB fees
- Safer to show fees when unsure than to hide them incorrectly
- Only when explicitly set to `false` (from wizard for citizens/PR) are fees excluded

### Migration Path

**Users accessing calculator directly:**
- `formData.firbRequired` is `undefined`
- `firbRequired !== false` evaluates to `true`
- FIRB fees are calculated and shown ✅

**Users coming from wizard (citizen/PR):**
- Wizard sets `formData.firbRequired = false`
- `firbRequired !== false` evaluates to `false`
- FIRB fees are set to $0 ✅

**Users coming from wizard (foreign/temporary):**
- Wizard sets `formData.firbRequired = true`
- `firbRequired !== false` evaluates to `true`
- FIRB fees are calculated ✅

---

## Test Scenarios

### ✅ TEST 1: Australian Citizen (No FIRB)

**Setup:**
```javascript
state.formData = {
    citizenshipStatus: 'australian',
    firbRequired: false,
    propertyValue: 1000000,
    propertyType: 'established',
    state: 'NSW'
};
```

**Expected Results:**
```javascript
fees = {
    firb: 0,
    stampDuty: 0,
    legal: 0,
    foreignTotal: 0,
    annual: {
        vacancyFee: 0,
        landTaxSurcharge: 0,
        councilRates: 2400,
        waterRates: 1200,
        insurance: 3000
    },
    firbRequired: false
}
```

**UI Display:**
- FIRB card: Green "$0" with "✓ No FIRB required"
- Detailed breakdown: "No Foreign Investment Fees Required" message
- Annual fees: Only council rates, water rates, insurance (no vacancy/land tax surcharge)

---

### ✅ TEST 2: Foreign National (FIRB Required)

**Setup:**
```javascript
state.formData = {
    citizenshipStatus: 'foreign',
    firbRequired: true,
    propertyValue: 1000000,
    propertyType: 'newDwelling',
    state: 'NSW',
    entityType: 'individual'
};
```

**Expected Results:**
```javascript
fees = {
    firb: 13200,
    stampDuty: 80000,  // 8% of $1M
    legal: 2500,
    foreignTotal: 95700,
    annual: {
        vacancyFee: 13200,
        landTaxSurcharge: calculated,
        councilRates: 2400,
        waterRates: 1200,
        insurance: 3000
    },
    firbRequired: true
}
```

**UI Display:**
- FIRB card: Orange "$13,200" with "Individual rate"
- Detailed breakdown: Collapsible "Foreign Investment Fees" section
- Annual fees: All fees including vacancy and land tax surcharge

---

### ✅ TEST 3: Direct Calculator Access (Backward Compatibility)

**Setup:**
```javascript
state.formData = {
    // No citizenshipStatus
    // No firbRequired (undefined)
    propertyValue: 1000000,
    propertyType: 'newDwelling',
    state: 'NSW'
};
```

**Expected Results:**
```javascript
firbRequired = undefined !== false → true

fees = {
    firb: 13200,  // Calculated
    stampDuty: 80000,
    legal: 2500,
    foreignTotal: 95700,
    firbRequired: true
}
```

**UI Display:**
- Shows all FIRB fees (default safe behavior)
- User can see full cost breakdown

---

## Console Logging

### Calculation Log
```javascript
[CALCULATIONS] firbRequired: true citizenshipStatus: foreign
[CALCULATIONS] firbRequired: false citizenshipStatus: australian
```

### Wizard Transfer Log
```javascript
[WIZARD] Transferred citizenship status: foreign
[WIZARD] Set firbRequired: true
[WIZARD] Final state.formData: { firbRequired: true, citizenshipStatus: 'foreign', ... }
```

---

## Edge Cases

### 1. Permanent Resident NOT Ordinarily Resident
**Current Handling:** Treated as exempt (firbRequired = false)
**Should Be:** Treated as foreign (firbRequired = true)
**TODO:** Add `isOrdinarilyResident` flag to wizard and check in proceedToFullCalculator()

### 2. Entity Type (Company/Trust)
**Current Handling:** Fees multiply by 5-10x when entityType = 'company' or 'trust'
**With firbRequired = false:** Fee = 0 regardless of entity type ✅

### 3. Missing citizenshipStatus
**Current Handling:** Default to firbRequired = true (safe default) ✅
**Result:** FIRB fees are calculated and shown

---

## Benefits

✅ **Accurate Cost Calculation**
   - Citizens/PRs see $0 FIRB fees
   - Foreign nationals see correct fees

✅ **Clear UI Communication**
   - Green checkmark shows "No FIRB required"
   - Orange card shows FIRB fee amount
   - Explanation message for citizens/PRs

✅ **Backward Compatible**
   - Defaults to showing fees when unsure
   - Existing calculator users unaffected

✅ **Wizard Integration**
   - Seamlessly transfers citizenship context
   - Calculator reflects wizard eligibility determination

✅ **Console Debugging**
   - Clear logs show firbRequired calculation
   - Easy to trace citizenship → fees flow

---

## Future Enhancements

1. **Ordinarily Resident Check for PRs**
   - Add checkbox in wizard: "I spend most of my time in Australia"
   - If unchecked, treat as foreign person (firbRequired = true)

2. **Citizenship Badge in Results**
   - Show badge: "Australian Citizen - No FIRB Required"
   - Add icon and explanation tooltip

3. **Cost Comparison Widget**
   - Show side-by-side: Citizen cost vs Foreign cost
   - Highlight savings for citizens/PRs

4. **FIRB Exemption Checker**
   - Additional tool to verify exemption eligibility
   - Links to official FIRB guidance

---

**Created:** January 2025
**Status:** ✅ Implemented
**Impact:** High - Provides accurate cost calculation for all citizenship types
