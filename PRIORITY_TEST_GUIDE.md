# Priority Test Guide - Quick Reference

## 🎯 Test 3: Foreign National + New Dwelling (MUST WORK)

### Quick Steps:
1. Open https://michaeljamescarne.github.io/firb-calculator/
2. Click "Get Started with Eligibility Check"
3. Select **"Foreign National"**
4. Select **"New Dwelling/Apartment"**
5. Enter **1000000**
6. Select **NSW**
7. Click "See My Eligibility Result"

### ✅ Success Criteria:
```
✅ Blue "You ARE Eligible!" page
✅ Shows FIRB fee: $13,200
✅ Shows NSW surcharge: 8%
✅ "Calculate Full Costs" button visible
✅ Click button → Calculator loads
✅ Calculator shows FIRB fees (orange card)
```

### Console Output to Verify:
```javascript
[WIZARD] Foreign national selected - proceeding to next step
[WIZARD] FIRB eligibility check result: {
    result: "required",
    firbRequired: true,
    ...
}
[WIZARD] Eligibility result: {
    eligible: true,
    canProceedToCalculator: true,
    ...
}
[WIZARD] Set firbRequired: true
[CALCULATIONS] firbRequired: true citizenshipStatus: foreign
```

### What to Screenshot:
1. Eligibility result page (blue, with calculator button)
2. Calculator results page (showing FIRB fees)

---

## 🎯 Test 4: Foreign National + Established (MUST BLOCK)

### Quick Steps:
1. Restart wizard
2. Select **"Foreign National"**
3. Select **"Established Dwelling"**
4. Enter **1000000**
5. Select **VIC**
6. Click "See My Eligibility Result"

### ✅ Success Criteria:
```
✅ Red "Not Eligible" page
✅ Shows X icon
✅ Reason explains cannot buy established
✅ Shows alternatives:
   - New Dwellings
   - Off-the-Plan Properties
   - Vacant Land
❌ NO "Calculate Full Costs" button
✅ "Check Different Property Type" button visible
```

### Console Output to Verify:
```javascript
[WIZARD] FIRB eligibility check result: {
    result: "not_allowed",
    firbRequired: false,
    alternatives: [...],
    ...
}
[WIZARD] Eligibility result: {
    eligible: false,
    canProceedToCalculator: false,
    ...
}
```

### What to Screenshot:
1. Not eligible page (red, with alternatives)
2. Console output showing `not_allowed`

---

## Quick Verification Checklist

### Test 3 - Foreign National + New (ALLOWED):
- [ ] Opens wizard correctly
- [ ] Selects Foreign National
- [ ] Selects New Dwelling
- [ ] Enters price and state
- [ ] Shows blue eligible page
- [ ] **Calculator button IS shown** ✅
- [ ] Calculator button works
- [ ] Calculator shows FIRB fees
- [ ] Console logs show `canProceedToCalculator: true`
- [ ] Console logs show `firbRequired: true`

### Test 4 - Foreign National + Established (BLOCKED):
- [ ] Opens wizard correctly
- [ ] Selects Foreign National
- [ ] Selects Established Dwelling
- [ ] Enters price and state
- [ ] Shows red not eligible page
- [ ] **Calculator button NOT shown** ❌
- [ ] Shows alternatives section
- [ ] Shows "Check Different Property Type" button
- [ ] Console logs show `canProceedToCalculator: false`
- [ ] Console logs show `result: "not_allowed"`

---

## Debug Commands

Open console and run these if needed:

```javascript
// Check module loaded
window.FIRBEligibility !== undefined

// Check wizard state
wizardState.answers

// Check eligibility result
wizardState.result

// Manually test eligibility
window.FIRBEligibility.checkFIRBEligibility({
    citizenshipStatus: 'foreign',
    propertyType: 'newDwelling'
})

// Should return: { result: "required", firbRequired: true, ... }

window.FIRBEligibility.checkFIRBEligibility({
    citizenshipStatus: 'foreign',
    propertyType: 'established'
})

// Should return: { result: "not_allowed", firbRequired: false, ... }

// Run all tests
runFIRBEligibilityTests()
```

---

## Expected vs Actual

### Test 3: Foreign National + New Dwelling

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Page Color | Blue | ? | ⏳ |
| Calculator Button | Shown | ? | ⏳ |
| FIRB Fee | $13,200 | ? | ⏳ |
| Surcharge | 8% | ? | ⏳ |
| canProceedToCalculator | true | ? | ⏳ |
| firbRequired | true | ? | ⏳ |

### Test 4: Foreign National + Established

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Page Color | Red | ? | ⏳ |
| Calculator Button | NOT Shown | ? | ⏳ |
| Alternatives | Shown | ? | ⏳ |
| Alternative Types | 3 options | ? | ⏳ |
| canProceedToCalculator | false | ? | ⏳ |
| result | "not_allowed" | ? | ⏳ |

---

## What to Look For

### 🟢 GOOD Signs (Test 3):
- Blue background page
- "You ARE Eligible!" heading
- Cost boxes showing fees
- **"Calculate Full Costs" button present**
- Button has calculator icon
- Console shows `canProceedToCalculator: true`
- Console shows `firbRequired: true`

### 🔴 GOOD Signs (Test 4):
- Red background page
- "Not Eligible" heading
- X icon displayed
- Reason text explains why not allowed
- **NO calculator button**
- "Check Different Property Type" button present
- Alternatives list with 3 items
- Console shows `canProceedToCalculator: false`
- Console shows `result: "not_allowed"`

### ⚠️ BAD Signs (Failures):
- JavaScript errors in console
- Calculator button on "Not Eligible" page
- No calculator button on "Eligible" page
- Wrong FIRB fees calculated
- Module not loaded errors
- Page doesn't render

---

## If Tests Fail

### Calculator Button Missing on Test 3:
1. Check console for errors
2. Verify: `wizardState.result.canProceedToCalculator === true`
3. Check: Line 937 in js/eligibilityWizard.js
4. Verify: `eligible && canProceedToCalculator` condition

### Calculator Button Showing on Test 4:
1. Check console: Should show `canProceedToCalculator: false`
2. Verify: `wizardState.result.eligible === false`
3. Check: Rendering falls through to "else" case (line 1037)

### FIRB Module Not Working:
1. Check: `window.FIRBEligibility` is defined
2. Run: `runFIRBEligibilityTests()` to verify module
3. Check: Console shows module results
4. Verify: 18/18 tests pass

---

**Quick Test Time:** ~5 minutes for both priority tests
**Tools Needed:** Browser with DevTools
**Knowledge Required:** Basic console usage
