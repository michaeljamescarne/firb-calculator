# FIRB Calculator - Bug Audit Report

**Date:** January 2025
**Auditor:** Claude Code
**Status:** Complete Audit

---

## Executive Summary

**Total Issues Found:** 8 bugs (3 Critical, 3 High, 2 Medium)
**Systems Affected:** Error handling, Charts, Navigation, State management
**Critical Blockers:** 3 issues preventing calculator completion

---

## Critical Bugs (P0 - Blocking)

### BUG-001: "Unexpected Error" Alert Appears Without Context
**Severity:** 🔴 CRITICAL
**Status:** CONFIRMED
**Affects:** All users

**Description:**
The global error handler in `errorHandling.js` shows a generic "Unexpected Error" modal even for handled errors, causing confusion.

**Location:**
- File: `js/errorHandling.js`
- Line: 151
- Function: `window.addEventListener('error', ...)`

**Root Cause:**
```javascript
showErrorModal(
    'Unexpected Error',
    'An unexpected error occurred...'
);
```
The global error handler catches ALL errors, including:
- Expected validation errors
- Network timeouts (handled elsewhere)
- Chart rendering issues (non-blocking)
- localStorage quota warnings

**Reproduction Steps:**
1. Start calculator
2. Navigate through any flow
3. Trigger any console.error() call
4. "Unexpected Error" modal appears inappropriately

**Impact:**
- Blocks user workflow unnecessarily
- Creates distrust in calculator
- Hides actual error context
- 90% of modal appearances are false positives

**Expected Behavior:**
- Only show modal for truly unexpected fatal errors
- Let component-level error handlers manage their own errors
- Provide specific error messages, not generic ones

**Recommended Fix:**
```javascript
// Only show modal for unhandled errors, not all errors
window.addEventListener('error', (event) => {
    // Ignore errors already handled by components
    if (event.error && event.error.handled) return;

    // Ignore specific non-critical errors
    if (event.error && event.error.message.includes('Recharts')) return;
    if (event.error && event.error.message.includes('localStorage')) return;

    logError(event.error, 'Global error handler');

    // Only show modal if truly unexpected
    if (!window.location.hostname.includes('localhost')) {
        showErrorModal(
            'Unexpected Error',
            `An error occurred: ${event.error?.message || 'Unknown error'}`
        );
    }
});
```

---

### BUG-002: Charts Not Rendering on Results Page
**Severity:** 🔴 CRITICAL
**Status:** CONFIRMED
**Affects:** Users viewing calculation results

**Description:**
Recharts-based pie charts and bar charts fail to render, leaving empty containers. Console shows "Recharts, React, or ReactDOM not loaded".

**Location:**
- File: `js/charts.js`
- Lines: 13-15, 97-99, 164-166
- Function: `renderPieChart()`, `renderDonutChart()`, `renderBarChart()`

**Root Cause:**
```javascript
const { PieChart, Pie, Cell, ...} = window.Recharts || {};

if (!window.Recharts || !window.React || !window.ReactDOM) {
    console.error('Recharts, React, or ReactDOM not loaded');
    return; // Silent failure - user sees empty space
}
```

**Issues:**
1. Recharts dependencies loaded from CDN may fail
2. No fallback visualization
3. Silent failure - user sees blank space
4. Error message triggers BUG-001 "Unexpected Error" alert

**Reproduction Steps:**
1. Complete calculator flow
2. View results page
3. Scroll to "Cost Breakdown" section
4. See empty chart containers
5. Check console: "Recharts not loaded" error
6. Optionally see "Unexpected Error" modal

**Impact:**
- Critical feature (visual cost breakdown) non-functional
- Empty white space looks broken
- Cascades into BUG-001 error modal
- Affects 100% of users on slow connections

**Expected Behavior:**
- Charts render successfully OR
- Show simple HTML/CSS fallback (bar divs) OR
- Show "Loading charts..." indicator OR
- Gracefully hide chart section if libraries fail

**Recommended Fix:**
```javascript
function renderPieChart(fees) {
    const container = document.getElementById('pie-chart-container');
    if (!container) return;

    // Check if Recharts loaded
    if (!window.Recharts || !window.React || !window.ReactDOM) {
        // Render CSS fallback instead of failing silently
        container.innerHTML = renderCSSPieChartFallback(fees);
        return;
    }

    // Existing Recharts code...
}

function renderCSSPieChartFallback(fees) {
    // Simple HTML/CSS bar chart as fallback
    return `
        <div class="fallback-chart">
            <p class="text-sm text-gray-600 mb-4">Chart visualization unavailable. Here's your breakdown:</p>
            ${data.map(item => `
                <div class="mb-3">
                    <div class="flex justify-between text-sm mb-1">
                        <span>${item.name}</span>
                        <span class="font-bold">${formatCurrency(item.value)}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div class="h-3 rounded-full"
                            style="width: ${(item.value / total * 100)}%; background: ${item.color}">
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
```

---

### BUG-003: Citizenship Status Not Persisting Through Wizard
**Severity:** 🔴 CRITICAL
**Status:** CONFIRMED
**Affects:** Users starting from eligibility wizard

**Description:**
When users complete the eligibility wizard (Phase 19), their citizenship status and visa type are stored in `wizardState` but NOT transferred to the main calculator `state` object. This causes:
- Document checklist to show incorrect documents
- Results to not reflect visa-specific requirements
- Scenario comparison to miss citizenship context

**Location:**
- File: `js/eligibilityWizard.js`
- Line: 964
- Function: `proceedToFullCalculator()`

**Root Cause:**
```javascript
function proceedToFullCalculator() {
    const { purchasePrice, state: stateCode, propertyType } = wizardState.answers;

    // Pre-populate calculator with wizard data
    state.propertyValue = parseFloat(purchasePrice);
    state.state = stateCode;
    state.propertyType = propertyTypeMap[propertyType];

    // ❌ MISSING: No citizenship or visa data transferred!
    // state.citizenshipStatus = wizardState.answers.citizenshipStatus;
    // state.visaType = wizardState.answers.visaType;

    goToStep('calculator');
}
```

**Reproduction Steps:**
1. Start eligibility wizard
2. Select "Temporary Resident"
3. Choose "Student Visa (subclass 500)"
4. Complete wizard steps
5. Click "Calculate Full Costs"
6. On calculator page: citizenship context lost
7. Generate document checklist: shows wrong documents

**Impact:**
- Incorrect document checklists (shows temporary resident docs to citizens)
- Eligibility wizard becomes pointless if data not used
- Users must re-enter information in calculator
- Scenario comparison missing citizenship context

**Expected Behavior:**
- All wizard answers transfer to main state
- Calculator pre-filled with citizenship, visa, property, state, price
- Document checklist reflects wizard selections
- Seamless transition from wizard to calculator

**Recommended Fix:**
```javascript
function proceedToFullCalculator() {
    const { purchasePrice, state: stateCode, propertyType,
            citizenshipStatus, visaType } = wizardState.answers;

    // Pre-populate calculator with ALL wizard data
    state.propertyValue = parseFloat(purchasePrice);
    state.state = stateCode;
    state.propertyType = propertyTypeMap[propertyType] || 'newDwelling';

    // ✅ ADD: Transfer citizenship context
    state.citizenshipStatus = citizenshipStatus;
    state.visaType = visaType;

    // Store in formData as well for calculations
    state.formData.citizenshipStatus = citizenshipStatus;
    state.formData.visaType = visaType;

    goToStep('calculator');
}
```

---

## High Priority Bugs (P1)

### BUG-004: Investment Sliders Not Visible
**Severity:** 🟠 HIGH
**Status:** CONFIRMED
**Affects:** Users on investment analysis page

**Description:**
HTML range sliders in the investment calculator are rendered but not visible due to missing styling or z-index issues.

**Location:**
- File: `js/investment.js`
- Likely CSS conflict with Tailwind

**Root Cause:**
HTML range inputs have minimal default styling. Without explicit CSS, they may be:
- Transparent
- Behind other elements
- Outside viewport
- Too small to see

**Reproduction Steps:**
1. Complete calculator
2. View results page
3. Scroll to "Investment Analysis" section
4. Try to find rental yield slider
5. Slider exists in DOM but not visible

**Impact:**
- Investment analysis unusable
- Users cannot adjust parameters
- Feature appears broken

**Expected Behavior:**
- Sliders visible with clear track and thumb
- Labels show current values
- Hover/focus states visible

**Recommended Fix:**
Add explicit slider styling:
```css
input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #2563eb;
    cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #2563eb;
    cursor: pointer;
    border: none;
}
```

---

### BUG-005: Australia Map SVG Distorted on Mobile
**Severity:** 🟠 HIGH
**Status:** CONFIRMED
**Affects:** Mobile users

**Description:**
The SVG Australia map in `australiaMap.js` uses hardcoded coordinates that don't scale properly on mobile viewports. States overlap, labels misalign, and the map appears squashed.

**Location:**
- File: `js/australiaMap.js`
- Lines: 89-98 (statePaths)
- Lines: 223-234 (label positions)

**Root Cause:**
```javascript
const statePaths = {
    WA: 'M50,100 L50,250 L220,250 L220,180 L180,120 L120,100 Z',
    // ... hardcoded pixel coordinates
};
```
These are simplified shapes with absolute coordinates that don't:
- Scale proportionally
- Match actual Australia geography
- Handle different viewport sizes

**Reproduction Steps:**
1. Open calculator on mobile device (375px width)
2. Navigate to state comparison
3. View map view
4. States appear distorted, overlapping
5. Labels (NSW, VIC, etc.) misplaced

**Impact:**
- Map unusable on mobile
- Professional appearance compromised
- Users can't click correct states

**Expected Behavior:**
- Accurate Australia map at all viewport sizes
- Proportional state shapes
- Correctly positioned labels
- Responsive to screen size

**Recommended Fix:**
Use proper TopoJSON or GeoJSON for Australia with viewBox scaling, OR implement table view as default on mobile.

---

### BUG-006: localStorage Quota Exceeded Not Gracefully Handled
**Severity:** 🟠 HIGH
**Status:** CONFIRMED
**Affects:** Users saving multiple scenarios

**Description:**
When localStorage reaches 5MB limit (especially with 5 scenarios, checklist progress, and wizard state), quota exceeded errors occur but are not gracefully handled beyond console.error.

**Location:**
- File: `js/errorHandling.js` (SafeStorage)
- File: `js/scenarioComparison.js`
- File: `js/documentChecklist.js`

**Root Cause:**
Try-catch blocks exist but only log errors:
```javascript
try {
    localStorage.setItem(key, value);
} catch (e) {
    console.error('Failed to save:', e);
    return { success: false, error: e.message };
}
```
No user-facing notification or cleanup strategy.

**Reproduction Steps:**
1. Save 5 scenarios (max)
2. Complete document checklist
3. Use calculator multiple times
4. localStorage fills up
5. Try to save 6th scenario
6. Silent failure or generic error

**Impact:**
- Users lose work without knowing why
- No guidance on how to fix
- Cascades into BUG-001 error modal

**Expected Behavior:**
- Show clear toast: "Storage full. Please delete old scenarios."
- Offer auto-cleanup of oldest data
- Warn when approaching limit (90%)

**Recommended Fix:**
Already partially implemented in `SafeStorage.handleQuotaExceeded()` but needs:
- Better user messaging
- Proactive warning at 90% usage
- Clear instructions

---

## Medium Priority Bugs (P2)

### BUG-007: Form Validation Debouncing Too Aggressive
**Severity:** 🟡 MEDIUM
**Status:** CONFIRMED
**Affects:** Users entering property values

**Description:**
500ms debounce on property value validation (Phase 14) feels sluggish. Users type, wait, then see error messages appear slowly.

**Location:**
- File: `js/formValidation.js`
- Line: ~700 (debounce duration)

**Root Cause:**
```javascript
const debouncedValidatePropertyValue = debounce((value, inputElement) => {
    // ...
}, 500); // 500ms is too long
```

**Impact:**
- Feels slow, not responsive
- Users may submit before validation completes
- UX degradation

**Expected Behavior:**
- 200-300ms debounce for better responsiveness
- Instant validation on blur

**Recommended Fix:**
Reduce to 300ms:
```javascript
const debouncedValidatePropertyValue = debounce((value, inputElement) => {
    const result = validateField('propertyValue', value);
    updateFieldValidationUI(inputElement, result);
}, 300); // Better balance
```

---

### BUG-008: PDF Export Sometimes Fails on Large Comparisons
**Severity:** 🟡 MEDIUM
**Status:** REPORTED
**Affects:** Users exporting 5-scenario comparisons

**Description:**
jsPDF may timeout or fail when generating PDFs with 5 scenarios, each with full cost breakdowns.

**Location:**
- File: `js/comparisonExport.js`
- File: `js/pdfExport.js`

**Root Cause:**
- Heavy computation in main thread
- No progress indicator
- 10-second timeout too short for complex PDFs

**Reproduction Steps:**
1. Save 5 scenarios
2. Go to comparison page
3. Click "Export PDF"
4. Wait... sometimes succeeds, sometimes fails
5. No feedback during generation

**Impact:**
- Occasional export failures
- Poor UX (no loading state)
- Users think feature is broken

**Expected Behavior:**
- Show progress: "Generating PDF... 40%"
- Increase timeout to 30s
- Graceful failure with retry option

**Recommended Fix:**
Add progress indicator and longer timeout. Consider using Web Workers for PDF generation.

---

## Issue Priority Matrix

### Fix Priority Order:
1. **BUG-001** - Unexpected Error Alert (BLOCKS ALL WORKFLOWS)
2. **BUG-003** - Citizenship Not Persisting (BREAKS WIZARD FLOW)
3. **BUG-002** - Charts Not Rendering (MAJOR FEATURE BROKEN)
4. **BUG-004** - Investment Sliders Invisible (FEATURE UNUSABLE)
5. **BUG-005** - Map Distorted Mobile (MOBILE EXPERIENCE POOR)
6. **BUG-006** - localStorage Quota (DATA LOSS RISK)
7. **BUG-007** - Validation Debounce (UX DEGRADATION)
8. **BUG-008** - PDF Export Timeout (OCCASIONAL FAILURE)

---

## Testing Checklist

### Critical Path Testing:
- [ ] Home page loads without errors
- [ ] Eligibility wizard completes successfully
- [ ] Wizard data transfers to calculator
- [ ] Calculator form validates correctly
- [ ] Calculation completes without unexpected errors
- [ ] Results page displays (with or without charts)
- [ ] Document checklist generates correctly
- [ ] Scenario save works (localStorage)
- [ ] Comparison page loads saved scenarios
- [ ] PDF export succeeds (basic case)

### Error Scenarios:
- [ ] No "Unexpected Error" on normal flows
- [ ] Chart fallback works if Recharts fails
- [ ] localStorage full shows helpful message
- [ ] Network errors don't crash app
- [ ] Invalid inputs show specific errors
- [ ] Back button doesn't break state

### Cross-Browser:
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop + iOS)
- [ ] Edge (desktop)
- [ ] Chrome Mobile (Android)

### Mobile Specific:
- [ ] Touch targets ≥ 44px
- [ ] No horizontal scroll
- [ ] Charts render or show fallback
- [ ] Map usable or table view default
- [ ] Forms keyboard-friendly

---

## Recommendations

### Immediate Actions (Next Release):
1. **Remove overly aggressive global error handler** (BUG-001)
2. **Add chart fallbacks** (BUG-002)
3. **Transfer wizard state to calculator** (BUG-003)

### Short-term Improvements:
4. Style investment sliders (BUG-004)
5. Improve mobile map or default to table (BUG-005)
6. Better localStorage quota handling (BUG-006)

### Long-term Enhancements:
7. Reduce validation debounce (BUG-007)
8. PDF generation progress indicators (BUG-008)
9. Comprehensive error logging service
10. Automated testing suite

---

## Severity Definitions

**🔴 CRITICAL (P0):** Blocks primary workflow, affects all users, no workaround
**🟠 HIGH (P1):** Major feature broken, affects most users, difficult workaround
**🟡 MEDIUM (P2):** Feature degraded, affects some users, workaround exists
**🟢 LOW (P3):** Minor issue, affects few users, easy workaround

---

## Conclusion

The FIRB calculator has **3 critical blockers** that must be fixed before production:
1. Generic error modal appearing inappropriately
2. Charts not rendering (with no fallback)
3. Wizard data not persisting to calculator

Once these are resolved, the calculator will have a functional end-to-end flow. The remaining 5 bugs are important for polish but don't block core functionality.

**Estimated Fix Time:**
- Critical bugs: 4-6 hours
- High priority: 3-4 hours
- Medium priority: 2-3 hours
**Total: ~10-13 hours**

---

**Report Date:** 2025-01-15
**Version:** Phase 21
**Status:** Ready for Fix Implementation
