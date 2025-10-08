# Scenario Comparison System Documentation

## Overview

The Scenario Comparison System allows users to save up to 5 property calculations, compare them side-by-side, analyze cost differences, and export or share comparisons.

**Purpose:** Enable informed decision-making by comparing multiple property investment scenarios with visual analytics and smart insights.

**Files:**
- `js/scenarioComparison.js` - Core scenario management and storage
- `js/comparisonUI.js` - Comparison table and charts rendering
- `js/comparisonExport.js` - PDF export and link sharing

**Created:** Phase 20 - January 2025

---

## Features

### 1. Scenario Management

**Save Scenarios:**
- Maximum 5 scenarios per user
- Stored in localStorage
- Unique names required
- Auto-suggested names (`NSW New Dwelling - $850,000`)
- Created timestamp tracking

**Edit Scenarios:**
- Rename scenarios
- Duplicate name detection
- Real-time validation

**Delete Scenarios:**
- Confirmation dialog
- Immediate removal from storage
- Cannot be undone

### 2. Comparison Table

**Columns Displayed:**
1. **Scenario** - Name, address, save date, lowest cost badge
2. **Property** - Value, type, state
3. **FIRB Fee** - Application fee
4. **Stamp Duty** - Total including surcharge
5. **First Year Total** - All upfront costs with traffic light
6. **Annual Ongoing** - Yearly costs with traffic light
7. **Eligibility** - Status badge (Eligible/Not Eligible/Check Required)
8. **Actions** - Edit and delete buttons

**Smart Features:**
- **Lowest Cost Highlight** - Green background for cheapest option
- **Savings Display** - Shows cost difference vs lowest (`+$X vs lowest`)
- **Traffic Light System:**
  - 🟢 Green: Best value (lowest cost)
  - 🟡 Yellow-Green: Good value
  - 🟡 Yellow: Average value
  - 🔴 Red: Highest cost
- **Sortable Columns** - Click any column header to sort
- **Responsive Design** - Desktop table, mobile cards

### 3. Visual Comparisons

**Cost Comparison Bar Chart:**
- Horizontal bars showing first year total cost
- Percentage-based width (relative to max)
- Green bar for lowest cost
- Blue bars for others

**Annual Costs Chart:**
- Comparison of ongoing yearly expenses
- Orange color coding
- Percentage visualization

**ROI Radar Chart:**
- Only shown if ROI data available
- Displays yield, annual rent, net income
- Easy at-a-glance profitability comparison

### 4. Filtering & Sorting

**Filters:**
- **State Filter** - NSW, VIC, QLD, SA, WA, TAS, ACT, NT, All
- **Property Type Filter** - New Dwelling, Established, Vacant Land, Commercial, All
- **Clear Filters Button** - Reset all filters instantly

**Sorting:**
- Click any column header to sort
- Ascending/descending toggle
- Visual arrow indicators (↑ ↓)
- Preserved across filter changes

### 5. PDF Export

**Features:**
- Professional multi-page PDF
- Summary section (lowest/highest cost, difference)
- Detailed comparison table (all 7 columns)
- Individual scenario breakdowns
- Page numbers and footer
- Auto-download as `FIRB-Comparison-YYYY-MM-DD.pdf`

**PDF Sections:**
1. Title and generation date
2. Summary metrics
3. Comparison table
4. Individual scenario details with full cost breakdown

**Styling:**
- Blue headers (RGB: 37, 99, 235)
- Grid theme
- Optimized column widths
- Paginated for long comparisons

### 6. Share via Link

**How It Works:**
1. Encodes scenario data to base64
2. Appends to URL as `?comparison=...`
3. Anyone with link can view read-only comparison
4. No server-side storage required

**Shareable Data Includes:**
- Scenario names
- Property details (value, type, state)
- All cost calculations
- Created timestamp

**Share Modal Features:**
- Copy to clipboard button
- Full URL display
- Read-only notice
- What's included list

**Shared View:**
- Blue banner indicating shared/read-only mode
- All charts and tables visible
- "Create Your Own" CTA button
- No edit/delete actions available

---

## User Workflows

### Workflow 1: Save & Compare Multiple Properties

1. User completes eligibility wizard
2. Sees calculation results
3. Clicks "Save Scenario" button
4. Enters custom name (e.g., "Sydney Apartment")
5. Clicks "Save" → Auto-redirected to comparison page
6. Repeats for other properties (up to 5 total)
7. Views side-by-side comparison with:
   - Lowest cost highlighted in green
   - Traffic lights showing relative value
   - Bar charts visualizing costs
   - Savings vs best option displayed

### Workflow 2: Filter & Sort Comparisons

1. User has 5 saved scenarios across different states
2. Selects "NSW" from state filter
3. Table shows only NSW properties
4. Clicks "First Year Total" column header
5. Scenarios sort by cost (lowest first)
6. Clicks again to reverse order (highest first)
7. Identifies best and worst NSW options instantly

### Workflow 3: Export Comparison

1. User has 3+ scenarios saved
2. Clicks "Export PDF" button
3. PDF generates with all data
4. Downloads automatically
5. Opens PDF to see:
   - Summary: Lowest ($X), Highest ($Y), Difference ($Z)
   - Comparison table with all scenarios
   - Detailed breakdown for each property
6. Shares PDF with financial advisor

### Workflow 4: Share Comparison

1. User wants to share comparison with partner
2. Clicks "Share" button
3. Modal opens with shareable link
4. Clicks "Copy" button
5. Pastes link in email/message
6. Partner opens link and sees:
   - Read-only comparison page
   - All charts and data visible
   - Blue banner explaining shared view
   - Option to "Create Your Own"

---

## Technical Implementation

### Data Structure

**Scenario Object:**
```javascript
{
    id: '1234567890',
    name: 'Sydney Apartment',
    createdAt: '2025-01-15T10:30:00.000Z',

    // Property details
    propertyValue: 850000,
    propertyType: 'newDwelling',
    state: 'NSW',
    address: '123 George St, Sydney',

    // Costs
    firbFee: 13200,
    stampDuty: 35000,
    foreignSurcharge: 68000,
    totalStampDuty: 103000,
    legalFees: 2000,
    inspectionFees: 800,
    lmiPremium: 12000,
    totalFirstYearCost: 131000,

    // Annual costs
    landTax: 5000,
    landTaxSurcharge: 2000,
    annualVacancyFee: 0,
    councilRates: 2400,
    strataFees: 4000,
    totalAnnualCost: 13400,

    // Eligibility
    eligibilityStatus: 'Eligible',

    // ROI (optional)
    roiProjection: {
        rentalYield: 3.5,
        annualRent: 29750,
        netAnnualIncome: 16350,
        roi: 1.92
    },

    // Full fees object reference
    fullFees: {...}
}
```

**Comparison State:**
```javascript
const comparisonState = {
    scenarios: [], // Array of scenario objects
    sortColumn: 'totalFirstYearCost', // Current sort column
    sortDirection: 'asc', // 'asc' or 'desc'
    filters: {
        state: 'all',
        propertyType: 'all',
        priceMin: 0,
        priceMax: Infinity
    }
};
```

### Storage

**localStorage Key:**
```javascript
const SCENARIOS_STORAGE_KEY = 'firb_saved_scenarios';
```

**Save to Storage:**
```javascript
function saveScenariosToStorage() {
    try {
        localStorage.setItem(
            SCENARIOS_STORAGE_KEY,
            JSON.stringify(comparisonState.scenarios)
        );
        return { success: true };
    } catch (error) {
        // Handle quota exceeded, etc.
        return { success: false, error: error.message };
    }
}
```

**Load from Storage:**
```javascript
function loadSavedScenarios() {
    try {
        const saved = localStorage.getItem(SCENARIOS_STORAGE_KEY);
        if (saved) {
            comparisonState.scenarios = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading scenarios:', error);
    }
}
```

### Key Functions

**scenarioComparison.js:**
- `initScenarioComparison()` - Initialize on page load
- `createScenarioFromCalculation(name, fees)` - Create scenario object
- `saveCurrentScenario(name)` - Save current calculation
- `deleteScenario(id)` - Remove scenario
- `editScenarioName(id, newName)` - Update scenario name
- `getFilteredScenarios()` - Apply filters and sorting
- `findLowestCostScenario(scenarios)` - Find best value
- `calculateSavings(scenario, scenarios)` - Compute difference vs best
- `setSortColumn(column)` - Update sorting
- `setComparisonFilter(filterType, value)` - Apply filter

**comparisonUI.js:**
- `renderScenarioComparison()` - Main comparison page
- `renderEmptyComparisonPage()` - No scenarios state
- `renderComparisonFilters()` - Filter controls
- `renderVisualComparisons(scenarios)` - Charts section
- `renderComparisonTable(scenarios, lowestCost)` - Data table
- `renderCostComparisonChart(scenarios)` - Bar chart
- `renderAnnualCostChart(scenarios)` - Annual costs bars
- `renderROIRadarChart(scenarios)` - ROI visualization
- `getTrafficLightColor(value, metricType, allValues)` - Color coding
- `renderTrafficLight(color)` - Indicator dot

**comparisonExport.js:**
- `exportComparisonPDF()` - Generate and download PDF
- `shareComparison()` - Create shareable link
- `showShareModal(url, scenarioCount)` - Share dialog
- `copyShareLink()` - Copy to clipboard
- `loadSharedComparison()` - Parse URL params
- `renderSharedComparisonPage()` - Read-only view

### Integration Points

**Results Page (resultsDashboard.js):**
```html
<button onclick="showSaveScenarioModal()">
    Save Scenario
</button>
```

**Navigation (render.js):**
```javascript
case 'compare':
    content += renderScenarioComparison();
    break;
case 'sharedCompare':
    content += renderSharedComparisonPage();
    break;
```

**Home Page:**
- Link to comparison page in navigation
- "View Saved Comparisons" in footer

---

## Traffic Light Logic

**For Cost Metrics (Lower is Better):**
- 🟢 Green: Value === Min (lowest cost)
- 🟡 Yellow-Green: Value <= Min + 33% of range
- 🟡 Yellow: Value <= Min + 66% of range
- 🔴 Red: Value > Min + 66% of range

**For ROI Metrics (Higher is Better):**
- 🟢 Green: Value === Max (highest ROI)
- 🟡 Yellow-Green: Value >= Max - 33% of range
- 🟡 Yellow: Value >= Max - 66% of range
- 🔴 Red: Value < Max - 66% of range

**Example:**
If first year costs are: [$100K, $120K, $150K, $180K]
- Min: $100K, Max: $180K, Range: $80K
- $100K = 🟢 Green (lowest)
- $120K = 🟡 Yellow-Green (within 33%)
- $150K = 🟡 Yellow (within 66%)
- $180K = 🔴 Red (highest)

---

## Error Handling

### Validation Errors

**Maximum Scenarios:**
```javascript
if (comparisonState.scenarios.length >= MAX_SCENARIOS) {
    showToast(`Maximum ${MAX_SCENARIOS} scenarios reached. Delete one to add more.`, 'error');
    return { success: false };
}
```

**Duplicate Names:**
```javascript
const nameExists = comparisonState.scenarios.some(s => s.name === name);
if (nameExists) {
    showToast('A scenario with this name already exists', 'error');
    return { success: false };
}
```

**No Calculation Available:**
```javascript
if (!state.calculatedFees) {
    showToast('Please calculate fees first', 'error');
    return;
}
```

### Storage Errors

**localStorage Quota Exceeded:**
- Try-catch wraps all storage operations
- Returns `{ success: false, error: message }` on failure
- Logs error via `logError()` function
- Shows user-friendly toast notification

**Data Corruption:**
- JSON parse errors caught
- Falls back to empty scenarios array
- Doesn't crash application

---

## Responsive Design

### Desktop (≥1024px)
- Full comparison table (8 columns)
- Side-by-side action buttons
- Horizontal filters
- Wide charts

### Tablet (768px - 1023px)
- Scrollable table
- Stacked action buttons
- Reduced column widths

### Mobile (<768px)
- Card-based layout (no table)
- Vertical action buttons
- Simplified charts
- Touch-friendly controls (min 44×44px)

---

## Performance

### Optimization Strategies

**Local Storage:**
- ~3KB per scenario
- Max 5 scenarios = ~15KB
- Well within 5MB localStorage limit
- No server calls required

**Rendering:**
- Only filtered scenarios rendered
- Charts use simplified SVG/divs (no heavy libs)
- Lazy load charts (100ms delay)
- Debounced filter/sort updates

**PDF Generation:**
- Uses jsPDF library (already loaded)
- Async generation with loading toast
- Streams to download (no memory bloat)
- 2-5 seconds for 5 scenarios

**URL Sharing:**
- Base64 encoding (no server)
- Compressed data structure
- ~500 chars per scenario
- Max URL length ~5KB (safe for all browsers)

---

## Testing Checklist

### Scenario Management
- [x] Save scenario (valid name)
- [x] Save scenario (duplicate name) - Error shown
- [x] Save scenario (max reached) - Error shown
- [x] Edit scenario name
- [x] Edit scenario name (duplicate) - Error shown
- [x] Delete scenario
- [x] Delete scenario (confirm dialog)

### Comparison Table
- [x] Display all scenarios
- [x] Lowest cost highlighted (green background)
- [x] Savings calculation accurate
- [x] Traffic lights color-coded correctly
- [x] Sort by each column (asc/desc)
- [x] Edit button opens modal
- [x] Delete button shows confirmation
- [x] Mobile card layout responsive

### Filtering
- [x] State filter works
- [x] Property type filter works
- [x] Multiple filters combine correctly
- [x] Clear filters resets all
- [x] "No results" message shown when filtered empty
- [x] Filter count displayed

### Charts
- [x] Cost comparison bars render
- [x] Annual cost bars render
- [x] ROI chart shows when data available
- [x] ROI chart hidden when no data
- [x] Bar widths proportional
- [x] Colors match traffic lights

### PDF Export
- [x] PDF generates successfully
- [x] Filename includes date
- [x] Summary section accurate
- [x] Table includes all scenarios
- [x] Individual details complete
- [x] Page numbers correct
- [x] Multi-page layout works

### Share Feature
- [x] Share link generates
- [x] Copy to clipboard works
- [x] Shared URL includes data
- [x] Shared view loads correctly
- [x] Read-only mode enforced
- [x] "Create Your Own" CTA works

### Edge Cases
- [x] 0 scenarios (empty state)
- [x] 1 scenario (no comparison)
- [x] 5 scenarios (max capacity)
- [x] localStorage unavailable (error handling)
- [x] Invalid shared URL (graceful failure)
- [x] Very long scenario names (truncation)

---

## Browser Compatibility

### Tested Browsers
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Safari 17+ (iOS/macOS)
- ✅ Edge 120+
- ✅ Samsung Internet 23+

### Required Features
- localStorage (>IE8)
- JSON.parse/stringify (>IE8)
- base64 encode/decode (>IE10)
- flexbox/grid (>IE11)

### Polyfills
- Handled by browserCompatibility.js
- Array.find, Array.from, Object.assign

---

## Future Enhancements

### Potential Features
- [ ] Increase max scenarios to 10 (premium)
- [ ] Scenario categories/tags
- [ ] Export to Excel/CSV
- [ ] Print-friendly comparison page
- [ ] Email comparison directly
- [ ] Save comparison snapshots
- [ ] Scenario versioning/history
- [ ] Cloud sync (account required)
- [ ] Collaborative sharing (multi-user edit)
- [ ] Advanced charts (radar, scatter, heatmap)
- [ ] Scenario notes/comments
- [ ] Cost change alerts
- [ ] Favorite/star scenarios

### Analytics to Track
- Scenarios saved per user
- Most compared property types
- Average scenarios per comparison
- PDF download rate
- Share link usage
- Filter usage patterns
- Sort preferences
- Time on comparison page

---

## Maintenance

### Regular Updates
- Review max scenario limit (quarterly)
- Test localStorage quota handling (monthly)
- Update PDF styling (as needed)
- Add new filter options (as requested)
- Optimize chart performance (if slow)

### Data Migration
If data structure changes:
1. Check version number in scenario object
2. Migrate old format to new format
3. Save migrated data
4. Log migration success

```javascript
function migrateScenarios() {
    const scenarios = loadSavedScenarios();
    scenarios.forEach(s => {
        if (!s.version || s.version < 2) {
            // Migrate to v2 format
            s.newField = calculateNewField(s);
            s.version = 2;
        }
    });
    saveScenariosToStorage();
}
```

---

## Support & Troubleshooting

### Common Issues

**Issue:** "Maximum scenarios reached" when I have fewer than 5
- **Cause:** localStorage may have corrupted data
- **Fix:** Clear browser data, refresh page

**Issue:** Comparison table shows different values than results page
- **Cause:** Scenario saved from old calculation
- **Fix:** Delete and re-save scenario with updated calculation

**Issue:** PDF export fails
- **Cause:** Browser blocking popups or jsPDF library not loaded
- **Fix:** Allow popups, check console for errors, refresh page

**Issue:** Share link doesn't work
- **Cause:** URL too long (>8KB) or special characters
- **Fix:** Reduce number of scenarios in share, or export PDF instead

**Issue:** Traffic lights all gray
- **Cause:** All scenarios have same cost (no range)
- **Fix:** This is expected behavior (no relative comparison possible)

---

## API Reference

### Global Functions

**Save & Manage:**
- `showSaveScenarioModal()` - Open save dialog
- `saveCurrentScenario(name)` - Save with name
- `deleteScenario(id)` - Remove scenario
- `editScenarioName(id, newName)` - Rename

**Filter & Sort:**
- `setComparisonFilter(filterType, value)` - Apply filter
- `clearComparisonFilters()` - Reset filters
- `setSortColumn(column)` - Sort by column

**Export & Share:**
- `exportComparisonPDF()` - Generate PDF
- `shareComparison()` - Create link
- `loadSharedComparison()` - Load from URL

**UI Helpers:**
- `showEditScenarioModal(id)` - Edit name dialog
- `confirmDeleteScenario(id)` - Delete confirmation
- `getPropertyTypeLabel(type)` - Format type

### Global State

**comparisonState:**
```javascript
{
    scenarios: [], // Array of scenario objects
    sortColumn: 'totalFirstYearCost',
    sortDirection: 'asc',
    filters: {
        state: 'all',
        propertyType: 'all',
        priceMin: 0,
        priceMax: Infinity
    }
}
```

---

## Credits

**Libraries Used:**
- jsPDF - PDF generation
- jsPDF-AutoTable - Table plugin for jsPDF

**Built With:**
- Vanilla JavaScript (no frameworks)
- Tailwind CSS (via CDN)
- localStorage API
- Base64 encoding

---

**Version:** 20.0
**Created:** January 2025
**Last Updated:** January 2025
**Maintainer:** FIRB Calculator Team
**Status:** ✅ Production Ready
