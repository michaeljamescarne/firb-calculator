# Manual Test Results - FIRB Calculator

**Test Date:** January 2025
**Test URL:** https://michaeljamescarne.github.io/firb-calculator/
**Browser:** Chrome/Safari/Firefox
**Tester:** Manual Verification

---

## Test Summary

| Test # | Scenario | Status | Notes |
|--------|----------|--------|-------|
| 1 | Australian Citizen | ⏳ PENDING | - |
| 2 | Permanent Resident | ⏳ PENDING | - |
| 3 | Foreign National + New Dwelling | ⏳ PENDING | Priority test |
| 4 | Foreign National + Established | ⏳ PENDING | Priority test |
| 5 | Student Visa + Established | ⏳ PENDING | - |
| 6 | Bridging Visa + Vacant Land | ⏳ PENDING | - |
| 7 | Property Type Display | ⏳ PENDING | - |
| 8 | Module Fallback | ⏳ PENDING | - |

---

## Test 1: Australian Citizen

### Steps Performed:
1. ✅ Opened https://michaeljamescarne.github.io/firb-calculator/
2. ✅ Clicked "Get Started with Eligibility Check"
3. ✅ Selected "Australian Citizen"
4. ✅ Opened browser console (F12)

### Expected Results:
- [ ] Console shows: `[WIZARD] Using FIRB module result for Australian citizen:`
- [ ] Result page shows green "Great News!" header
- [ ] Message includes "Australian citizens do not require FIRB approval"
- [ ] Shows checkmarks for:
  - [ ] No FIRB application required
  - [ ] No foreign buyer stamp duty surcharge
  - [ ] No annual vacancy fee
  - [ ] Can purchase any residential property type
- [ ] No "Calculate Full Costs" button (citizens don't need calculator for FIRB)
- [ ] Shows "Back to Home" button
- [ ] Shows "Learn More at FIRB.gov.au" link

### Actual Results:
```
Status: ⏳ PENDING MANUAL TEST

Console Output:
[To be filled after manual test]

UI Display:
[To be filled after manual test]

Screenshots:
[Attach if needed]
```

### Result: ⏳ PENDING

---

## Test 2: Permanent Resident

### Steps Performed:
1. ✅ Clicked "Get Started with Eligibility Check"
2. ✅ Selected "Permanent Resident"
3. ✅ Checked console output

### Expected Results:
- [ ] Console shows: `[WIZARD] Using FIRB module result for PR:`
- [ ] Result page shows green "Great News!" header
- [ ] Message mentions "ordinarily resident in Australia"
- [ ] Shows caveat: "You must be ordinarily resident in Australia. If you spend most of your time overseas, FIRB approval may be required."
- [ ] No "Calculate Full Costs" button
- [ ] Shows "Back to Home" button

### Actual Results:
```
Status: ⏳ PENDING MANUAL TEST

Console Output:
[To be filled after manual test]

UI Display:
[To be filled after manual test]
```

### Result: ⏳ PENDING

---

## Test 3: Foreign National → New Dwelling (ALLOWED) ⭐ PRIORITY

### Steps Performed:
1. ✅ Clicked "Get Started with Eligibility Check"
2. ✅ Selected "Foreign National"
3. ✅ Selected "New Dwelling/Apartment"
4. ✅ Entered price: 1000000
5. ✅ Selected state: NSW
6. ✅ Clicked "See My Eligibility Result"

### Expected Results:
- [ ] Console shows: `[WIZARD] FIRB eligibility check result:` with full object
- [ ] Console shows: `result: "required"`
- [ ] Console shows: `firbRequired: true`
- [ ] Result page shows blue "You ARE Eligible!" header
- [ ] Shows 3 cost boxes:
  - [ ] FIRB Application Fee: $13,200
  - [ ] NSW Stamp Duty Surcharge: 8%
  - [ ] Property Price: $1,000,000
- [ ] Shows yellow "Important Conditions" box with reason
- [ ] Shows "Next Steps" section (4 steps)
- [ ] **Shows "Calculate Full Costs" button** ✅
- [ ] Shows "Start Over" button

### Actual Results:
```
Status: ⏳ PENDING MANUAL TEST

Console Output Expected:
[WIZARD] Foreign national selected - proceeding to next step
[WIZARD] Calculating eligibility with: {
    citizenshipStatus: 'foreign',
    visaType: null,
    propertyType: 'new',
    purchasePrice: '1000000',
    stateCode: 'NSW'
}
[WIZARD] FIRB eligibility check result: {
    result: "required",
    firbRequired: true,
    reason: "Foreign nationals can purchase new dwellings with FIRB approval...",
    metadata: { allowed: true, stampDutySurcharge: true, ... }
}
[WIZARD] Eligibility result: {
    eligible: true,
    noFIRBRequired: false,
    firbFee: 13200,
    surcharge: 8,
    canProceedToCalculator: true
}

Actual Console Output:
[To be filled after manual test]

UI Display:
[To be filled after manual test]
```

### Calculator Progression Test:
- [ ] Clicked "Calculate Full Costs" button
- [ ] Calculator loaded successfully
- [ ] Console shows: `[WIZARD] Set firbRequired: true`
- [ ] Calculator shows FIRB fees:
  - [ ] FIRB Fee card shows $13,200 (orange border)
  - [ ] Stamp duty surcharge calculated
  - [ ] Foreign Investment Fees section visible
  - [ ] Annual vacancy fee shown
  - [ ] Annual land tax surcharge shown

### Result: ⏳ PENDING

---

## Test 4: Foreign National → Established (NOT ALLOWED) ⭐ PRIORITY

### Steps Performed:
1. ✅ Clicked "Get Started with Eligibility Check"
2. ✅ Selected "Foreign National"
3. ✅ Selected "Established Dwelling"
4. ✅ Entered price: 1000000
5. ✅ Selected state: VIC
6. ✅ Clicked "See My Eligibility Result"

### Expected Results:
- [ ] Console shows: `result: "not_allowed"`
- [ ] Console shows: `firbRequired: false` (no FIRB because not allowed at all)
- [ ] Result page shows red "Not Eligible" header
- [ ] Shows X icon (red)
- [ ] Reason explains: "Foreign nationals cannot purchase established dwellings..."
- [ ] Shows "What You CAN Buy" section with alternatives:
  - [ ] New Dwellings
  - [ ] Off-the-Plan Properties
  - [ ] Vacant Land (with development approval)
- [ ] **NO "Calculate Full Costs" button** ❌
- [ ] Shows "Check Different Property Type" button
- [ ] Shows "Learn More at FIRB.gov.au" link

### Actual Results:
```
Status: ⏳ PENDING MANUAL TEST

Console Output Expected:
[WIZARD] FIRB eligibility check result: {
    result: "not_allowed",
    firbRequired: false,
    reason: "Foreign nationals cannot purchase established dwellings...",
    alternatives: ["New dwellings", "Off-the-plan properties", "Vacant land with development approval"]
}
[WIZARD] Eligibility result: {
    eligible: false,
    noFIRBRequired: false,
    canProceedToCalculator: false,
    alternatives: [...]
}

Actual Console Output:
[To be filled after manual test]

UI Display:
[To be filled after manual test]
```

### Button Verification:
- [ ] "Calculate Full Costs" button is NOT shown
- [ ] "Check Different Property Type" button IS shown
- [ ] Clicking "Check Different Property Type" restarts wizard

### Result: ⏳ PENDING

---

## Test 5: Student Visa → Established (CONDITIONAL)

### Steps Performed:
1. ✅ Clicked "Get Started with Eligibility Check"
2. ✅ Selected "Temporary Resident"
3. ✅ Selected "Student Visa (subclass 500)" from dropdown
4. ✅ Selected "Established Dwelling"
5. ✅ Entered price: 800000
6. ✅ Selected state: QLD
7. ✅ Clicked "See My Eligibility Result"

### Expected Results:
- [ ] Console shows: `result: "conditional"`
- [ ] Console shows: `firbRequired: true`
- [ ] Result page shows blue "You ARE Eligible!" header
- [ ] Shows FIRB fee: $13,200
- [ ] Shows conditions in yellow box:
  - [ ] "Must be your principal place of residence"
  - [ ] "Limited to one property"
  - [ ] "Cannot rent out while on visa"
  - [ ] "Must sell upon leaving Australia"
- [ ] Shows "Calculate Full Costs" button
- [ ] Shows "Start Over" button

### Actual Results:
```
Status: ⏳ PENDING MANUAL TEST

Console Output:
[To be filled after manual test]

UI Display:
[To be filled after manual test]
```

### Result: ⏳ PENDING

---

## Test 6: Bridging Visa → Vacant Land (NOT ALLOWED)

### Steps Performed:
1. ✅ Clicked "Get Started with Eligibility Check"
2. ✅ Selected "Temporary Resident"
3. ✅ Selected "Bridging Visa" from dropdown
4. ✅ Selected "Vacant Land"
5. ✅ Entered price: 500000
6. ✅ Selected state: WA
7. ✅ Clicked "See My Eligibility Result"

### Expected Results:
- [ ] Console shows: `result: "not_allowed"`
- [ ] Result page shows red "Not Eligible" header
- [ ] Shows alternatives (New Dwellings only for bridging visa)
- [ ] NO "Calculate Full Costs" button
- [ ] Shows "Check Different Property Type" button

### Actual Results:
```
Status: ⏳ PENDING MANUAL TEST

Console Output:
[To be filled after manual test]

UI Display:
[To be filled after manual test]
```

### Result: ⏳ PENDING

---

## Test 7: Property Type Display (Real-time Eligibility)

### Steps Performed:
1. ✅ Started wizard
2. ✅ Selected "Foreign National"
3. ✅ Observed Step 2 (property type options)
4. ✅ Checked each property option's eligibility message

### Expected Results:
- [ ] "New Dwelling" shows: ✓ "Foreign nationals can purchase new dwellings with FIRB approval..."
- [ ] "Established" shows: ✗ "Foreign nationals cannot purchase established dwellings..."
- [ ] "Vacant Land" shows: ✓ "Foreign nationals can purchase vacant land with FIRB approval..."
- [ ] Console logs `[WIZARD] checkPropertyEligibility result:` for each check

### Actual Results:
```
Status: ⏳ PENDING MANUAL TEST

UI Display:
[To be filled after manual test]
```

### Result: ⏳ PENDING

---

## Test 8: Module Fallback (Error Handling)

### Steps Performed:
1. ✅ Opened browser console
2. ✅ Ran: `window.FIRBEligibility = undefined`
3. ✅ Started wizard
4. ✅ Completed flow as Foreign National

### Expected Results:
- [ ] Console shows: `[WIZARD] FIRBEligibility module not loaded - using fallback logic`
- [ ] Wizard still works using old hardcoded logic
- [ ] No errors or crashes
- [ ] Results display correctly

### Actual Results:
```
Status: ⏳ PENDING MANUAL TEST

Console Output:
[To be filled after manual test]

UI Display:
[To be filled after manual test]
```

### Result: ⏳ PENDING

---

## Critical Tests Summary

### ⭐ Test 3: Foreign National + New Dwelling
**Expected:** ALLOWED with calculator button
**Priority:** HIGH
**Key Checks:**
- ✅ Blue "You ARE Eligible!" page
- ✅ Shows "Calculate Full Costs" button
- ✅ Calculator shows FIRB fees
- ✅ `firbRequired = true`

### ⭐ Test 4: Foreign National + Established
**Expected:** NOT ALLOWED with alternatives
**Priority:** HIGH
**Key Checks:**
- ✅ Red "Not Eligible" page
- ❌ NO "Calculate Full Costs" button
- ✅ Shows alternatives
- ✅ `canProceedToCalculator = false`

---

## Issues Found

### Issue 1: [If any]
**Test:**
**Description:**
**Expected:**
**Actual:**
**Severity:**
**Fix Required:**

---

## Testing Instructions for Manual Verification

### Setup:
1. Open https://michaeljamescarne.github.io/firb-calculator/
2. Open DevTools (F12 or Cmd+Option+I)
3. Go to Console tab
4. Clear console before each test

### For Each Test:
1. Follow the steps exactly as listed
2. Check console output
3. Verify UI matches expected results
4. Take screenshots if needed
5. Document actual vs expected
6. Mark test as PASS ✅ or FAIL ❌

### Console Commands for Debugging:
```javascript
// Check if module loaded
window.FIRBEligibility

// Check wizard state
wizardState.answers

// Check current result
wizardState.result

// Run eligibility tests
runFIRBEligibilityTests()

// Check formData
state.formData
```

---

## Next Steps

1. **Manual Testing:**
   - [ ] Run Test 3 (FN + New Dwelling)
   - [ ] Run Test 4 (FN + Established)
   - [ ] Document results
   - [ ] Take screenshots

2. **If Tests Pass:**
   - [ ] Update this document with PASS ✅
   - [ ] Complete remaining tests
   - [ ] Mark feature as verified

3. **If Tests Fail:**
   - [ ] Document exact failure
   - [ ] Add to Issues Found section
   - [ ] Create fix plan
   - [ ] Re-test after fix

---

**Status:** ⏳ PENDING MANUAL VERIFICATION
**Last Updated:** January 2025
**Next Action:** Run Test 3 and Test 4 manually
