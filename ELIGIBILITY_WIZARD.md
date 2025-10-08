# Eligibility Wizard Documentation

## Overview

The Smart Eligibility Wizard is a 4-step guided flow that determines FIRB eligibility **BEFORE** users see the full calculator. It provides clear yes/no answers with explanations, required documents, and recommendations.

**Purpose:** Simplify the user journey by quickly determining eligibility and FIRB requirements before overwhelming users with detailed calculations.

**File:** `js/eligibilityWizard.js`

**Created:** Phase 19 - January 2025

---

## User Flow

### Step 1: Citizenship Status
**Question:** "What is your citizenship status?"

**Options:**
1. **Australian Citizen**
   - ✅ No FIRB approval needed
   - Shows immediate result page (green)
   - Can purchase any property type

2. **Permanent Resident**
   - ✅ Usually no FIRB approval needed (if ordinarily resident)
   - Shows immediate result page (green)
   - Note: Must be ordinarily resident in Australia

3. **Temporary Resident**
   - ⚠️ FIRB approval required
   - Shows visa type dropdown
   - Continues to Step 2

4. **Foreign National**
   - ⚠️ FIRB approval required
   - Continues to Step 2

### Step 2: Property Type
**Question:** "What type of property are you looking to buy?"

**Options:**
- **New Dwelling/Apartment** - Generally allowed for all foreign buyers
- **Off-the-Plan** - Generally allowed for all foreign buyers
- **Established Dwelling** - Only allowed for temporary residents (conditions apply)
- **Vacant Land** - Allowed with development requirements
- **Commercial Property** - Allowed with different FIRB rules

**Smart Eligibility Checking:**
- Real-time eligibility display (✓ or ✗) based on citizenship and visa type
- Explanatory messages for each option
- Prevents selection of ineligible options

### Step 3: Purchase Price
**Question:** "What is your expected purchase price?"

**Features:**
- Currency input with automatic comma formatting
- Real-time FIRB fee estimation
- Average property price reference (Sydney: ~$1,200,000)
- Validation: Must enter a price to continue

### Step 4: State Selection
**Question:** "Which state is the property located in?"

**Features:**
- Dropdown with all 8 states/territories
- Shows foreign buyer surcharge rate for selected state
- NT highlighted (0% surcharge - No surcharge! 🎉)
- Final step before result calculation

---

## Result Pages

### 1. Australian Citizens / PR (No FIRB Required)
**Layout:** Green theme with success checkmark

**Content:**
- "Great News!" headline
- Confirmation message
- "What This Means" section:
  - No FIRB application required
  - No foreign buyer stamp duty surcharge
  - No annual vacancy fee
  - Can purchase any property type
- Required Documents section (proof of citizenship/PR)
- Actions:
  - Back to Home
  - Learn More at FIRB.gov.au

### 2. Eligible Foreign Buyers / Temporary Residents
**Layout:** Blue theme with success checkmark

**Content:**
- "You ARE Eligible!" headline
- Property type and state confirmation
- **Key Costs Summary (3 cards):**
  - FIRB Application Fee: $13,200 - $132,000
  - State Stamp Duty Surcharge: 0% - 8%
  - Property Price
- **Important Conditions:**
  - Property type restrictions
  - Visa conditions (if applicable)
- **Required Documents:**
  - Passport, visa, FIRB form, proof of funds, etc.
  - Different lists for temporary vs foreign nationals
- **Next Steps (4-step process):**
  1. Apply for FIRB approval BEFORE signing contract
  2. Wait for FIRB decision (typically 30 days)
  3. Once approved, proceed with purchase
  4. Pay stamp duty at settlement
- **Actions:**
  - Start Over
  - Calculate Full Costs (proceeds to main calculator with pre-filled data)

### 3. Ineligible Buyers
**Layout:** Red theme with X icon

**Content:**
- "Not Eligible" headline
- Reason explanation
- **"What You CAN Buy" section:**
  - Alternative property types based on citizenship/visa
  - For foreign nationals: New dwellings, off-the-plan, vacant land
  - For temporary residents: Varies by visa type
- **Actions:**
  - Check Different Property Type (restart wizard)
  - Learn More at FIRB.gov.au

---

## Visa Types Supported

### Student Visa (subclass 500)
- ✅ Can buy established (principal residence)
- ✅ Can buy new dwellings
- ✅ Can buy vacant land
- **Condition:** Must be principal place of residence

### Skilled Work Visa (subclass 482, 485, 186, 189)
- ✅ Can buy established (principal residence)
- ✅ Can buy new dwellings
- ✅ Can buy vacant land
- **Condition:** Must be principal place of residence

### Partner Visa (subclass 309, 820)
- ✅ Can buy established (principal residence)
- ✅ Can buy new dwellings
- ✅ Can buy vacant land
- **Condition:** Must be principal place of residence

### Bridging Visa
- ❌ Cannot buy established
- ✅ Can buy new dwellings only
- ❌ Cannot buy vacant land
- **Condition:** Only new dwellings allowed

### Visitor/Tourist Visa
- ❌ Cannot buy established
- ✅ Can buy new dwellings only
- ❌ Cannot buy vacant land
- **Condition:** Only new dwellings allowed

### Other Temporary Visa
- ✅ Can buy established (check conditions)
- ✅ Can buy new dwellings
- ✅ Can buy vacant land
- **Condition:** Check specific visa conditions

---

## Required Documents by Scenario

### Temporary Residents
- Valid Australian visa
- Passport
- Proof of temporary residency
- Evidence property will be principal residence
- FIRB application form
- Proof of identity
- Contract of sale (after FIRB approval)

### Foreign Nationals
- Passport
- FIRB application form
- Proof of identity
- Proof of funds
- Contract of sale (after FIRB approval)
- Developer's compliance certificate (for new dwellings)
- Development plans (for vacant land)

### Permanent Residents
- Proof of permanent residency
- Passport or driver's license
- Contract of sale
- Proof of funds

---

## Technical Implementation

### State Management

```javascript
const wizardState = {
    step: 1,
    totalSteps: 4,
    answers: {
        citizenshipStatus: null,
        residencyStatus: null,
        visaType: null,
        propertyType: null,
        purchasePrice: null,
        state: null
    },
    result: null
};
```

### Key Functions

**Navigation:**
- `startEligibilityWizard()` - Initialize wizard
- `nextWizardStep()` - Advance to next step
- `previousWizardStep()` - Go back one step
- `showEligibilityResult(result)` - Display result page

**Rendering:**
- `renderEligibilityWizard()` - Main wizard UI
- `renderEligibilityResult()` - Result page UI
- `renderStep1_CitizenshipStatus()` - Step 1 UI
- `renderStep2_PropertyType()` - Step 2 UI
- `renderStep3_PurchasePrice()` - Step 3 UI
- `renderStep4_State()` - Step 4 UI

**Logic:**
- `checkPropertyEligibility(propertyType)` - Check if property type allowed
- `calculateEligibilityResult()` - Calculate final eligibility
- `estimateFIRBFee()` - Calculate FIRB fee based on price
- `getStateSurcharge(state)` - Get stamp duty surcharge rate
- `getAlternativeProperties()` - Get alternative property types
- `proceedToFullCalculator()` - Pre-fill calculator with wizard data

**Event Handlers:**
- `handleCitizenshipChange(value)`
- `handleVisaTypeChange(value)`
- `handlePropertyTypeChange(value)`
- `handleWizardPriceInput(input)`
- `handleWizardStateChange(value)`

---

## Integration with Main Calculator

### Pre-population
When user clicks "Calculate Full Costs" from eligible result page:

```javascript
function proceedToFullCalculator() {
    // Pre-populate calculator with wizard data
    state.propertyValue = parseFloat(purchasePrice);
    state.state = stateCode;

    // Map wizard property type to calculator property type
    const propertyTypeMap = {
        'new': 'newDwelling',
        'offThePlan': 'newDwelling',
        'established': 'established',
        'vacant': 'vacantLand',
        'commercial': 'commercial'
    };
    state.propertyType = propertyTypeMap[propertyType];

    // Navigate to calculator
    goToStep('calculator');
}
```

### Entry Points
**Primary CTA (Home Page Hero):**
```html
<button onclick="startEligibilityWizard()">
    Get Started
</button>
```

**Secondary CTAs:**
- Home page eligibility section
- Bottom CTA section
- Navigation menu

---

## UX Features

### Progress Indicator
- Visual progress bar (width: X%)
- "Step X of 4" label
- Percentage complete display

### Smart Validation
- Prevents proceeding without required answers
- Disabled "Continue" buttons until valid input
- Real-time eligibility checking on Step 2

### Visual Feedback
- Selected options highlighted (blue border + background)
- Green checkmarks for eligible options
- Red X marks for ineligible options
- Warning icons for important conditions

### Responsive Design
- Mobile-first layout
- Single column forms on mobile
- Grid layout for cards on desktop
- Touch-friendly button sizes (44x44px minimum)

### Accessibility
- Radio buttons for single selections
- Clear labels and descriptions
- High contrast colors
- Keyboard navigation support

---

## Data Sources

### FIRB Fees (FY 2024-25)
- Under $1M: $13,200
- $1M - $2M: $26,400
- $2M - $3M: $39,600
- $3M+: $132,000

### State Surcharges
- NSW, VIC, QLD, TAS: 8%
- WA, SA: 7%
- ACT: 4%
- NT: 0% (highlighted as competitive advantage)

---

## Future Enhancements

### Potential Additions
- [ ] Save wizard progress (localStorage)
- [ ] Email eligibility report
- [ ] Print-friendly result page
- [ ] Share result via link
- [ ] Add exemptions (main residence exemption for PR, etc.)
- [ ] Add first home buyer considerations
- [ ] Video explainers for each step
- [ ] Chat support integration
- [ ] Multi-language support
- [ ] Historical rate comparison

### Analytics Tracking
- Track completion rate by step
- Track drop-off points
- Most common citizenship status
- Most common property types
- Average purchase price entered
- State distribution

---

## Testing Checklist

### User Flows
- [x] Australian citizen flow (immediate eligible result)
- [x] Permanent resident flow (immediate eligible result)
- [x] Temporary resident + new dwelling (eligible)
- [x] Temporary resident + established (check visa conditions)
- [x] Foreign national + new dwelling (eligible)
- [x] Foreign national + established (ineligible)
- [x] Each visa type eligibility logic
- [x] NT special case (0% surcharge highlight)

### Validation
- [x] Price input formatting (commas)
- [x] Price input validation (numbers only)
- [x] FIRB fee calculation accuracy
- [x] State surcharge rate accuracy
- [x] Button disable/enable logic

### Integration
- [x] Wizard state management
- [x] Navigation between steps
- [x] Progress bar updates
- [x] Result page display
- [x] Pre-population of main calculator
- [x] JavaScript syntax validation

### Responsive
- [ ] Mobile (375px - iPhone SE)
- [ ] Mobile (414px - iPhone 14 Pro)
- [ ] Tablet (768px - iPad)
- [ ] Desktop (1440px)
- [ ] Touch target sizes (min 44x44px)

### Browser Compatibility
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Error Handling

### Validation Errors
- Empty price input: Disable continue button
- Invalid state selection: Disable continue button
- No property type selected: Wait for selection

### Edge Cases
- Browser back button: Wizard state preserved
- Page refresh: Wizard resets (by design)
- Invalid visa type: Fallback to general eligibility rules

---

## Performance

### Load Time
- ~20KB JavaScript (uncompressed)
- No external dependencies
- Renders in < 100ms

### Optimization
- Functions only called when needed
- Conditional rendering (no unnecessary DOM)
- Debounced input handlers (if needed)

---

## Maintenance

### Data Updates
- Review FIRB fees annually (1 July)
- Review state surcharges annually
- Update visa subclass numbers as needed
- Update required documents as regulations change

### Code Updates
- Keep in sync with FIRB.gov.au policy changes
- Update property type definitions if regulations change
- Add new visa types as immigration policy evolves

---

## Support Resources

### Official Links
- FIRB Website: https://firb.gov.au/
- FIRB Guidance Note 12: https://firb.gov.au/guidance-resources/guidance-notes/gn12
- Department of Home Affairs (Visas): https://immi.homeaffairs.gov.au/

### Internal Links
- Main Calculator: `goToStep('calculator')`
- Timeline Page: `goToStep('timeline')`
- FAQ Page: `goToStep('faq')`

---

**Version:** 19.0
**Created:** January 2025
**Last Updated:** January 2025
**Maintainer:** FIRB Calculator Team
**Status:** ✅ Production Ready
