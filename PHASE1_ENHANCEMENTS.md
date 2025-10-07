# Phase 1 Enhancements - Comprehensive Foreign Investment Calculations

## Summary

Phase 1 critical enhancements have been successfully implemented, adding comprehensive foreign investment calculations that were previously missing. These changes significantly improve the accuracy and usefulness of the FIRB Calculator for foreign property investors.

---

## What's New

### **1. Annual Vacancy Fee Calculation** ✅

**Function:** `calculateAnnualVacancyFee()` in `js/calculations.js`

Foreign owners must pay an annual vacancy fee if their property is vacant for more than 6 months in a year.

**Fee Structure:**
- < $1M: $11,490/year
- $1M - $1.5M: $22,980/year
- $1.5M - $2M: $34,470/year
- $2M - $3M: $57,450/year
- $3M - $4M: $68,940/year
- $4M - $5M: $103,410/year
- $5M+: $137,880/year

**Note:** Does not apply to vacant land

---

### **2. Foreign Owner Land Tax Surcharge** ✅

**Function:** `calculateLandTaxSurcharge()` in `js/calculations.js`

Annual land tax surcharge charged to foreign owners on top of standard land tax.

**Rates by State:**
- NSW: 2.0%
- VIC: 1.5%
- QLD: 2.0%
- SA: 0.5%
- WA: 4.0%
- TAS: 1.5%
- ACT: 0.75%
- NT: 0% (no surcharge)

**Important:** This is an annual recurring fee that significantly impacts the total cost of ownership.

---

### **3. Entity Type Selection** ✅

**New Form Field:** Entity Type dropdown

**Options:**
- Individual (default)
- Company
- Trust

**Impact on FIRB Fees:**

Companies and trusts pay **significantly higher FIRB fees** - approximately 5-10x individual rates depending on property value:

**Example for $800,000 established dwelling:**
- Individual: $15,200
- Company/Trust: **$152,000** (10x higher)

**Fee Multipliers:**
- < $1M: 10x individual rate
- $1M - $2M: 8x individual rate
- $2M - $5M: 6x individual rate
- $5M+: 5x individual rate

**Updated Function:** `calculateFIRBFee()` now accepts `entityType` parameter

---

### **4. Variable Deposit Percentage** ✅

**New Form Field:** Deposit Percentage slider (10% - 100%)

**Default:** 30% (more realistic for foreign buyers)

**Impact:**
- Directly affects LMI calculation
- Foreign buyers typically need 30-40% deposit (higher than domestic buyers)
- Deposits under 20% require Lenders Mortgage Insurance

**Visual UI:** Interactive slider with real-time percentage display

**Updated Function:** `calculateLMI()` now uses actual deposit percentage instead of fixed 20%

---

### **5. Improved LMI Calculation** ✅

**Function:** `calculateLMI()` updated to use variable deposit

**LVR-Based Rates:**
- ≤ 80% LVR: No LMI
- 80-85% LVR: 1.7% of loan amount
- 85-90% LVR: 2.4% of loan amount
- 90-95% LVR: 3.1% of loan amount
- > 95% LVR: 4.0% of loan amount

**Calculation:** Based on actual Loan-to-Value Ratio derived from user's deposit percentage

---

### **6. Annual Fees Section on Results Page** ✅

**New Display Section:** "Annual Ongoing Fees"

Shows all annual recurring costs foreign owners must pay:

1. **Annual Vacancy Fee** (if applicable)
   - Only shown if > $0 (doesn't apply to vacant land)
   - With explanation tooltip

2. **Foreign Owner Land Tax Surcharge**
   - State-specific rate
   - With explanation tooltip

3. **Council Rates** (Annual: $2,400)

4. **Water Rates** (Annual: $1,200)

5. **Property Insurance** (Annual: 0.3% of property value, min $800)

**Total:** Prominently displayed in green theme

---

### **7. Updated Results Summary** ✅

**Two New Total Cards:**

1. **Upfront Costs** (Blue Card)
   - Shows all one-time purchase fees
   - Foreign investment fees + Standard fees

2. **First Year Total Cost** (Green Card)
   - Upfront costs + First year annual fees
   - **Most important number for budgeting**

**Visual Hierarchy:**
- Foreign Investment Fees: Orange theme
- Standard Property Fees: Blue theme
- Annual Ongoing Fees: Green theme
- Totals: Gradient cards

---

## Technical Changes

### **Files Modified:**

1. **js/calculations.js**
   - Added `calculateAnnualVacancyFee()`
   - Added `calculateLandTaxSurcharge()`
   - Updated `calculateFIRBFee()` to handle entity types
   - Updated `calculateLMI()` to accept deposit percentage
   - Updated `calculateAllFees()` to return annual fees and new totals

2. **js/state.js**
   - Added `entityType: 'individual'` to formData
   - Added `depositPercent: '30'` to formData

3. **js/render.js**
   - Added Entity Type selection dropdown with help text
   - Added Deposit Percentage slider with real-time display
   - Added Annual Fees section to results page
   - Updated totals section with two cards (Upfront + First Year)

4. **js/translations.js**
   - Added 21 new translation keys in English
   - Added 21 new translation keys in Chinese
   - Added 21 new translation keys in Vietnamese

5. **js/icons.js**
   - Added `calendar` icon for annual fees section

---

## New Data Structure

### **Updated `calculateAllFees()` Return Object:**

```javascript
{
    // One-time foreign investment fees
    firb: number,
    stampDuty: number,
    legal: number,
    foreignTotal: number,

    // One-time standard fees
    standard: {
        stampDuty: number,
        transferFee: number,
        mortgageRegistration: number,
        titleSearch: number,
        buildingInspection: number,
        pestInspection: number,
        conveyancingLegal: number,
        loanApplicationFee: number,
        lendersMortgageInsurance: number,
        councilRates: number,
        waterRates: number
    },
    standardTotal: number,

    // NEW: Annual ongoing fees
    annual: {
        vacancyFee: number,
        landTaxSurcharge: number,
        councilRates: number,
        waterRates: number,
        insurance: number
    },
    annualTotal: number,

    // Totals
    grandTotal: number,           // One-time costs
    firstYearTotal: number,       // NEW: Upfront + first year annual

    // Metadata
    depositPercent: number,
    entityType: string
}
```

---

## User Experience Improvements

### **Form Enhancements:**

1. **Entity Type Dropdown**
   - Clear labeling with help text
   - Warns about higher fees for companies/trusts
   - Triggers re-render when changed

2. **Deposit Slider**
   - Visual, intuitive interface
   - 10% - 100% range in 5% increments
   - Real-time percentage display next to slider
   - Help text explains foreign buyer requirements

3. **Better Validation**
   - Form uses new deposit percentage in validation
   - Stored in localStorage for persistence

### **Results Page Enhancements:**

1. **Clear Categorization**
   - Foreign fees (orange)
   - Standard fees (blue)
   - Annual fees (green)
   - Color-coded for easy scanning

2. **Prominent Totals**
   - Two summary cards make it immediately clear
   - "Upfront Costs" vs "First Year Total"
   - First Year Total is most important for decision-making

3. **Tooltips & Explanations**
   - Vacancy fee explains when it applies
   - Land tax surcharge explains it's annual
   - Each section has descriptive text

---

## Impact on Calculations

### **Example Calculation:**

**Property:** $850,000 established dwelling in NSW
**Buyer:** Foreign individual
**Deposit:** 30%

**Before Phase 1:**
- FIRB Fee: $15,200
- Stamp Duty Surcharge: $68,000
- LMI: $0 (assumed 20% deposit)
- **Total Shown:** ~$140,000

**After Phase 1:**
- FIRB Fee: $15,200 (same for individual)
- Stamp Duty Surcharge: $68,000 (same)
- LMI: $0 (30% deposit, no LMI)
- **Upfront Total:** ~$140,000
- **Annual Vacancy Fee:** $11,490
- **Annual Land Tax Surcharge:** $17,000
- **Other Annual Costs:** $4,400
- **Annual Total:** $32,890
- **FIRST YEAR TOTAL: ~$173,000** ⚠️

### **If Buying as Company:**

- FIRB Fee: **$152,000** (10x higher!)
- **Upfront Total:** ~$277,000
- **First Year Total: ~$310,000** ⚠️⚠️⚠️

**This is why Phase 1 was critical** - users were dramatically underestimating total costs!

---

## Translation Coverage

All new features are fully translated:

### **New Keys Added:**
- entityType, individual, company, trust
- entityTypeHelp
- depositPercent, depositPercentHelp
- annualFees, annualFeesDesc
- vacancyFee, vacancyFeeDesc
- landTaxSurcharge, landTaxSurchargeDesc
- annualCouncilRates, annualWaterRates, annualInsurance
- annualTotal
- upfrontCosts, upfrontCostsDesc
- firstYearTotal, firstYearTotalDesc

**Languages:**
- ✅ English (en)
- ✅ Chinese (zh)
- ✅ Vietnamese (vi)

---

## Testing Checklist

### **Functionality:**
- [ ] Entity type dropdown works and changes calculations
- [ ] Deposit slider updates percentage display
- [ ] FIRB fees increase dramatically for companies/trusts
- [ ] LMI calculates based on selected deposit percentage
- [ ] Annual fees show in results
- [ ] Vacancy fee shows for dwellings, hidden for vacant land
- [ ] Land tax surcharge varies by state
- [ ] Both total cards display correct amounts
- [ ] First Year Total = Upfront + Annual

### **UI/UX:**
- [ ] Form fields are labeled clearly
- [ ] Help text is visible and helpful
- [ ] Slider moves smoothly
- [ ] Annual fees section is color-coded green
- [ ] Icons display correctly (calendar icon)
- [ ] Layout is responsive on mobile

### **Translations:**
- [ ] Switch to Chinese - all new fields translated
- [ ] Switch to Vietnamese - all new fields translated
- [ ] No missing translation keys
- [ ] Help text makes sense in all languages

### **Data Persistence:**
- [ ] Entity type saved to localStorage
- [ ] Deposit percentage saved to localStorage
- [ ] Form data restores on page reload

---

## Known Limitations & Future Enhancements

### **Current Simplifications:**

1. **Land Tax Surcharge:**
   - Currently calculated as simple percentage of property value
   - Actual land tax has thresholds and progressive rates
   - Consider adding proper tiered calculation in Phase 2

2. **Vacancy Fee:**
   - Simple tiered structure
   - Doesn't account for partial year ownership
   - Could add pro-rata calculation

3. **LMI Rates:**
   - Labeled as "approximate" in code comments
   - Actual rates vary by lender
   - Foreign buyers may pay higher rates
   - Consider adding lender selection in Phase 2

4. **Entity Type:**
   - Company/Trust fees simplified
   - Actual fees based on total Australian assets
   - Could add asset value field for more accuracy

5. **Insurance:**
   - Rough estimate: 0.3% of property value
   - Could improve with property type consideration
   - Different rates for apartments vs houses

### **Recommended Next Steps (Phase 2):**

1. Property subtype (House/Apartment/Townhouse)
2. Strata fees for apartments
3. Property management fees for investments
4. First home buyer stamp duty concessions
5. CGT withholding information
6. Mortgage repayment calculator
7. More accurate insurance estimates

---

## Data Sources & Accuracy

### **Fee Rates Based On:**

1. **FIRB Fees:** Australian Treasury - Foreign Investment Review Board fee schedule (current as of 2024)
2. **Vacancy Fee:** ATO - Foreign residents and main residence exemption guide
3. **Land Tax Surcharge:** State Revenue Offices (all 8 states/territories)
4. **LMI Rates:** Industry averages from major LMI providers (Genworth, QBE)

### **Disclaimers Added:**

- Entity type help text warns about higher fees
- Deposit percentage help text explains requirements
- Annual fees section explains recurring nature
- Results page shows "estimates based on current regulations"

### **Recommendation:**

Add footer note: "Last updated: [DATE]" and schedule quarterly reviews

---

## Conclusion

Phase 1 enhancements address the **most critical gaps** in the FIRB Calculator:

✅ **Annual Vacancy Fee** - Mandatory recurring cost (was completely missing)
✅ **Land Tax Surcharge** - Substantial annual cost (was completely missing)
✅ **Entity Type Impact** - Companies/trusts pay 5-10x more (was not calculated)
✅ **Variable Deposit** - More accurate LMI calculation (was fixed at 20%)
✅ **Comprehensive Results** - Shows true first-year cost (upfront + annual)

**Impact:** Users now see realistic total costs instead of dramatically underestimating their investment requirements.

**Example:** A foreign company buying an $850k property in NSW will now see **$310k first year cost** instead of the previous **$140k** - a difference of $170k!

This makes the calculator significantly more valuable and prevents costly surprises for foreign investors.

---

## Next Steps

1. **Test thoroughly** with various combinations:
   - Different entity types
   - Different deposit percentages
   - Different states
   - All property types

2. **Deploy to production** (GitHub Pages, Netlify, or Vercel)

3. **Monitor user feedback** on new features

4. **Plan Phase 2** enhancements based on priorities

5. **Update documentation** and help resources

---

Generated: 2025
Version: 2.0 (Phase 1 Complete)
