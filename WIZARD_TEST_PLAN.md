# Wizard Integration Test Plan

## Purpose
Verify that the eligibility wizard correctly uses the centralized FIRB eligibility module.

## Prerequisites
- Open https://michaeljamescarne.github.io/firb-calculator/
- Open browser console (F12)
- Clear console before each test

## Test Cases

### Test 1: Australian Citizen
**Steps:**
1. Click "Get Started with Eligibility Check"
2. Select "Australian Citizen"
3. Check console output

**Expected Results:**
- ✅ Console shows: `[WIZARD] Using FIRB module result for Australian citizen:`
- ✅ Result page shows green "Great News!" header
- ✅ Message includes "Australian citizens do not require FIRB approval for residential property purchases"
- ✅ Shows checkmarks for:
  - No FIRB application required
  - No foreign buyer stamp duty surcharge
  - No annual vacancy fee
  - Can purchase any residential property type

**Console Verification:**
```javascript
// Should see in console:
[WIZARD] Using FIRB module result for Australian citizen: {
    result: "not_required",
    firbRequired: false,
    reason: "Australian citizens do not require FIRB approval..."
}
```

---

### Test 2: Permanent Resident
**Steps:**
1. Click "Get Started with Eligibility Check"
2. Select "Permanent Resident"
3. Check console output

**Expected Results:**
- ✅ Console shows: `[WIZARD] Using FIRB module result for PR:`
- ✅ Result page shows green "Great News!" header
- ✅ Message mentions "ordinarily resident in Australia"
- ✅ Shows caveat about ordinarily resident requirement

**Console Verification:**
```javascript
// Should see in console:
[WIZARD] Using FIRB module result for PR: {
    result: "not_required",
    firbRequired: false,
    reason: "Permanent residents ordinarily resident in Australia..."
}
```

---

### Test 3: Foreign National → New Dwelling (ALLOWED)
**Steps:**
1. Click "Get Started with Eligibility Check"
2. Select "Foreign National"
3. Select "New Dwelling/Apartment"
4. Enter price: 1000000
5. Select state: NSW
6. Click "See My Eligibility Result"

**Expected Results:**
- ✅ Console shows: `[WIZARD] FIRB eligibility check result:` with full object
- ✅ Result page shows blue "You ARE Eligible!" header
- ✅ Shows FIRB fee: $13,200
- ✅ Shows NSW stamp duty surcharge: 8%
- ✅ Shows purchase price: $1,000,000
- ✅ "Calculate Full Costs" button available

**Console Verification:**
```javascript
// Should see in console:
[WIZARD] FIRB eligibility check result: {
    result: "required",
    firbRequired: true,
    reason: "Foreign nationals can purchase new dwellings with FIRB approval...",
    metadata: { allowed: true, ... }
}

[WIZARD] Eligibility result: {
    eligible: true,
    noFIRBRequired: false,
    firbFee: 13200,
    surcharge: 8,
    canProceedToCalculator: true
}
```

---

### Test 4: Foreign National → Established (NOT ALLOWED)
**Steps:**
1. Click "Get Started with Eligibility Check"
2. Select "Foreign National"
3. Select "Established Dwelling"
4. Enter price: 1000000
5. Select state: VIC
6. Click "See My Eligibility Result"

**Expected Results:**
- ✅ Console shows result with `result: "not_allowed"`
- ✅ Result page shows red "Not Eligible" header
- ✅ Reason explains foreign nationals cannot buy established
- ✅ Shows alternative options:
  - New Dwellings
  - Off-the-Plan Properties
  - Vacant Land
- ✅ "Check Different Property Type" button available

**Console Verification:**
```javascript
// Should see in console:
[WIZARD] FIRB eligibility check result: {
    result: "not_allowed",
    firbRequired: false,
    reason: "Foreign nationals cannot purchase established dwellings...",
    alternatives: ["New dwellings", "Off-the-plan", "Vacant land with development"]
}

[WIZARD] Eligibility result: {
    eligible: false,
    noFIRBRequired: false,
    canProceedToCalculator: false,
    alternatives: [...]
}
```

---

### Test 5: Student Visa → Established (CONDITIONAL)
**Steps:**
1. Click "Get Started with Eligibility Check"
2. Select "Temporary Resident"
3. Select "Student Visa (subclass 500)" from dropdown
4. Select "Established Dwelling"
5. Enter price: 800000
6. Select state: QLD
7. Click "See My Eligibility Result"

**Expected Results:**
- ✅ Console shows result with `result: "conditional"`
- ✅ Result page shows blue "You ARE Eligible!" header
- ✅ Shows FIRB fee: $13,200
- ✅ Shows conditions in yellow box:
  - "Must be your principal place of residence"
  - "Limited to one property"
  - "Cannot rent out while on visa"
  - "Must sell upon leaving Australia"
- ✅ "Calculate Full Costs" button available

**Console Verification:**
```javascript
// Should see in console:
[WIZARD] FIRB eligibility check result: {
    result: "conditional",
    firbRequired: true,
    conditions: "Must be your principal place of residence. Limited to one property...",
    metadata: { allowed: true, ... }
}

[WIZARD] Eligibility result: {
    eligible: true,
    noFIRBRequired: false,
    conditions: "Must be your principal place of residence...",
    firbFee: 13200,
    canProceedToCalculator: true
}
```

---

### Test 6: Bridging Visa → Vacant Land (NOT ALLOWED)
**Steps:**
1. Click "Get Started with Eligibility Check"
2. Select "Temporary Resident"
3. Select "Bridging Visa" from dropdown
4. Select "Vacant Land"
5. Enter price: 500000
6. Select state: WA
7. Click "See My Eligibility Result"

**Expected Results:**
- ✅ Console shows result with `result: "not_allowed"`
- ✅ Result page shows red "Not Eligible" header
- ✅ Shows alternatives (New Dwellings only for bridging visa)

**Console Verification:**
```javascript
// Should see in console:
[WIZARD] FIRB eligibility check result: {
    result: "not_allowed",
    firbRequired: false,
    reason: "Bridging visa holders cannot purchase vacant land..."
}
```

---

### Test 7: Property Type Display (Real-time eligibility)
**Steps:**
1. Start wizard, select "Foreign National"
2. Step 2 shows property type options
3. Check each property option's eligibility message

**Expected Results:**
- ✅ "New Dwelling" shows: ✓ "Foreign nationals can purchase new dwellings with FIRB approval..."
- ✅ "Established" shows: ✗ "Foreign nationals cannot purchase established dwellings..."
- ✅ "Vacant Land" shows: ✓ "Foreign nationals can purchase vacant land with FIRB approval..."
- ✅ Console logs `[WIZARD] checkPropertyEligibility result:` for each check

---

### Test 8: Module Fallback (If module fails)
**Steps:**
1. In console, temporarily break the module:
   ```javascript
   window.FIRBEligibility = undefined
   ```
2. Start wizard
3. Complete flow as Foreign National

**Expected Results:**
- ✅ Console shows: `[WIZARD] FIRBEligibility module not loaded - using fallback logic`
- ✅ Wizard still works using old hardcoded logic
- ✅ No errors or crashes

---

## Verification Checklist

### Console Output Checks
- [ ] `[WIZARD] Using FIRB module result for Australian citizen:` appears
- [ ] `[WIZARD] Using FIRB module result for PR:` appears
- [ ] `[WIZARD] checkPropertyEligibility result:` appears
- [ ] `[WIZARD] FIRB eligibility check result:` appears
- [ ] `[WIZARD] Eligibility result:` shows final mapped result

### UI Checks
- [ ] Australian citizen → Green success page
- [ ] Permanent resident → Green success page with caveat
- [ ] Foreign national + new dwelling → Blue eligible page
- [ ] Foreign national + established → Red not eligible page
- [ ] Student + established → Blue eligible with yellow conditions
- [ ] All results show correct FIRB fees
- [ ] All results show correct state surcharges

### Error Handling
- [ ] Module not loaded → fallback works
- [ ] Invalid inputs → proper error messages
- [ ] Console errors → try-catch prevents crashes

---

## Success Criteria

✅ **PASS** if:
1. All 8 test cases produce expected results
2. Console shows FIRB module is being used
3. Result messages come from centralized module
4. No JavaScript errors in console
5. Wizard flow completes successfully
6. Fallback logic works when module unavailable

❌ **FAIL** if:
1. Module not being called (missing console logs)
2. JavaScript errors occur
3. Results don't match FIRB module output
4. Wizard breaks or freezes
5. Fallback doesn't work

---

## Post-Deployment Verification

After deploying changes, run the "Run Eligibility Tests" button:
```
1. Visit https://michaeljamescarne.github.io/firb-calculator/
2. Click green "Run Eligibility Tests" button
3. Open console (F12)
4. Verify all 18 tests pass
5. Check console shows detailed test output
```

Expected console output:
```
========================================
🧪 RUNNING FIRB ELIGIBILITY TESTS
========================================

✅ Test 1: Australian citizen - new dwelling - PASSED
✅ Test 2: Australian citizen - established dwelling - PASSED
... (16 more tests)

========================================
📊 TEST RESULTS SUMMARY
========================================
Total Tests: 18
✅ Passed: 18
❌ Failed: 0
📈 Pass Rate: 100.0%
⏱️  Duration: ~5ms
========================================
```

---

**Created:** January 2025
**Test Duration:** ~10 minutes for full suite
**Automation:** Can be scripted using Playwright/Cypress
