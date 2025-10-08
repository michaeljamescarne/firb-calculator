# Document Checklist System Documentation

## Overview

The Document Checklist System generates personalized, interactive checklists of required documents based on user's specific property purchase scenario. Tracks progress, provides guidance, and offers multiple export/share options.

**Purpose:** Guide users through the document gathering process with a personalized, trackable checklist tailored to their citizenship status, property type, and location.

**Files:**
- `js/documentChecklist.js` - Core logic, data, generation (620 lines)
- `js/checklistUI.js` - UI rendering, progress tracking (430 lines)
- `js/checklistEmail.js` - Email functionality (220 lines)

**Created:** Phase 21 - January 2025

---

## Features

### 1. Personalized Generation

**Adapts Based On:**
- **Citizenship Status** (Australian/PR/Temporary/Foreign)
- **Visa Type** (Student, Skilled, Partner, Bridging, Visitor)
- **Property Type** (New Dwelling, Established, Vacant Land, Commercial)
- **State/Territory** (NSW, VIC, QLD, SA, WA, TAS, ACT, NT)
- **Entity Type** (Individual vs Company/Trust)
- **First Home Owner** status

**Smart Filtering:**
- Only shows relevant documents
- State-specific requirements
- Property type-specific needs
- Entity structure documents

### 2. Document Categories

**FIRB Application** (8-12 documents):
- Completed FIRB application form
- Passport (certified copy)
- Proof of visa status (if temporary resident)
- Company incorporation (if purchasing via company)
- Ownership structure diagram (if company)
- Property details
- Proof of funds / finance pre-approval
- Developer's certificate (if off-the-plan)

**State-Specific** (1-3 documents):
- Additional ID verification (NSW)
- First home owner declaration (VIC, if applicable)
- Transfer of land forms (all states)

**Post-Approval** (2-4 documents):
- FIRB approval certificate
- Signed contract of sale
- Building inspection report (established only)
- Pest inspection report (established only)

**Additional** (2-3 documents):
- Tax File Number
- Conveyancer/solicitor details
- Accountant details

### 3. Interactive Checklist

**Checkboxes:**
- Click to mark complete/incomplete
- Visual checkmarks (✓)
- Green highlight for completed items
- Line-through text for done items

**Progress Tracking:**
- X/Y items completed
- Percentage complete (%)
- Progress bar (color-coded)
- "Remaining" count
- Last updated timestamp

**Item Details:**
- Title
- Description
- Tooltip with helpful info (💡)
- Link to obtain document (→)
- Completed badge

### 4. Progress Persistence

**localStorage Storage:**
- Saves checkbox states
- Stores user scenario
- Tracks last updated time
- Automatic save on checkbox toggle

**Load on Return:**
- Restores previous progress
- Maintains scenario context
- Shows last updated date

**Reset Function:**
- Clear all progress
- Confirmation dialog
- Cannot be undone

### 5. Export Options

**Print:**
- Browser print dialog
- Print-optimized stylesheet
- Includes all categories and items
- Checkboxes visible
- Page breaks where needed

**PDF Export:**
- Professional branded PDF
- Blue header with logo
- Progress bar visualization
- Scenario details section
- Categorized checklist
- Checkboxes (☐ / ✓)
- Item descriptions
- Clickable links
- Page numbers
- Footer branding
- Auto-download as `FIRB-Document-Checklist-YYYY-MM-DD.pdf`

**Email:**
- Send to user's email
- HTML formatted
- Color-coded by completion
- All links included
- Mobile-friendly
- EmailJS integration (optional)
- Fallback to mailto: link

### 6. Guidance Features

**Tooltips:**
- Helpful explanations for each document
- Certification requirements
- Processing times
- Special conditions

**Links:**
- Direct links to government portals
- Application forms
- Information pages
- "Get this document" CTAs

**Professional Services:**
- Recommended services card
- Conveyancer/solicitor
- Migration agent
- Accountant
- Building inspector
- Links to find professionals

**Important Notices:**
- Yellow banner with warning icon
- Consultation recommendations
- Disclaimer text

---

## Document Database

### Structure

Each document has:
```javascript
{
    title: 'Document Name',
    category: 'FIRB Application',
    description: 'Brief description',
    link: 'https://...',
    tooltip: 'Helpful guidance',
    requiredFor: ['all', 'NSW', 'temporary', etc.]
}
```

### Tags System

Documents tagged with:
- **all** - Required for everyone
- **temporary** / **bridging** - Visa-specific
- **company** - Entity type
- **newDwelling** / **established** / **vacantLand** / **commercial** - Property type
- **NSW** / **VIC** / **QLD** etc. - State-specific
- **NSW-firstHome** - Special conditions

### Dynamic Generation

Process:
1. Collect user scenario tags
2. Filter documents by tags
3. Group by category
4. Sort within categories
5. Load saved progress
6. Render checklist

---

## User Workflows

### Workflow 1: Generate Checklist from Results

1. User completes calculation
2. Sees results page
3. Clicks "Document Checklist" button
4. Checklist generated based on:
   - Property type entered
   - State selected
   - Citizenship from wizard (if used)
5. Personalized checklist displayed
6. Shows X/Y documents required

### Workflow 2: Track Progress

1. User views checklist
2. Gathers first document
3. Clicks checkbox to mark complete
4. Item turns green with checkmark
5. Progress bar updates
6. Returns later - progress restored
7. Continues checking off items
8. Reaches 100% - "Complete! 🎉"

### Workflow 3: Export as PDF

1. User has checklist with some items checked
2. Clicks "Export PDF" button
3. PDF generates with:
   - Current progress (X%)
   - Scenario details
   - All items (checked and unchecked)
   - Links to get documents
4. Downloads automatically
5. Opens PDF in viewer
6. Prints or shares with advisor

### Workflow 4: Email Checklist

1. User wants checklist on phone
2. Clicks "Email" button
3. Modal opens
4. Enters email address
5. Checks consent box
6. Clicks "Send Checklist"
7. Receives HTML email
8. Email shows:
   - Progress (X%)
   - All categories
   - Completed items (green)
   - Pending items (gray)
   - All links clickable

### Workflow 5: Print Checklist

1. User prefers paper copy
2. Clicks "Print" button
3. Browser print dialog opens
4. Preview shows:
   - Checklist formatted for paper
   - Action buttons hidden
   - Checkboxes ready to print
5. Prints physical copy
6. Uses paper to track offline

---

## Technical Implementation

### Data Structure

**Checklist State:**
```javascript
const checklistState = {
    items: [],                    // Filtered document objects
    completedItems: new Set(),    // IDs of checked items
    userScenario: {               // User's scenario
        citizenshipStatus: 'temporary',
        visaType: 'student',
        propertyType: 'newDwelling',
        state: 'NSW',
        entityType: 'individual',
        isFirstHome: false
    },
    lastUpdated: '2025-01-15T...' // ISO timestamp
};
```

**Document Object:**
```javascript
{
    id: 'firbForm',
    title: 'Completed FIRB Application Form',
    category: 'FIRB Application',
    description: 'Official application form...',
    link: 'https://firb.gov.au/apply',
    tooltip: 'Submit online through...',
    requiredFor: ['all'],
    completed: false
}
```

### Key Functions

**documentChecklist.js:**
- `generatePersonalizedChecklist(scenario)` - Filter documents
- `toggleChecklistItem(itemId)` - Check/uncheck
- `saveChecklistProgress()` - Save to localStorage
- `loadChecklistProgress()` - Restore state
- `getCompletionStats()` - Calculate progress
- `resetChecklistProgress()` - Clear all
- `exportChecklistPDF()` - Generate PDF
- `generateChecklistFromState()` - Create from current state

**checklistUI.js:**
- `renderDocumentChecklistPage()` - Main page
- `renderEmptyChecklistPage()` - No scenario state
- `renderProgressCard(stats)` - Progress visualization
- `renderChecklistByCategory(grouped)` - Categories
- `renderChecklistItem(item)` - Individual item
- `getCategoryIcon(category)` - SVG icons
- `renderProfessionalServicesCard()` - Recommendations

**checklistEmail.js:**
- `showEmailChecklistModal()` - Email dialog
- `sendChecklistEmail(event)` - Send via EmailJS
- `generateChecklistEmailHTML()` - HTML email template
- `generateChecklistPlainText()` - Plain text fallback

### Storage

**localStorage Key:**
```javascript
const CHECKLIST_STORAGE_KEY = 'firb_checklist_progress';
```

**Stored Data:**
```javascript
{
    completedItems: ['firbForm', 'passport', 'visaProof'],
    userScenario: {...},
    lastUpdated: '2025-01-15T10:30:00Z'
}
```

**Storage Size:**
- ~2KB typical
- ~5KB maximum
- Well within 5MB limit

### PDF Generation

**Uses jsPDF:**
- Header with blue branding
- Progress bar (visual)
- Scenario details table
- Categorized items
- Checkboxes (□ ✓)
- Clickable links
- Page numbers
- Multi-page support

**Layout:**
- A4 page size
- 14mm margins
- Categories with gray backgrounds
- Items with checkboxes
- Descriptions in smaller font
- Links in blue

### Email Integration

**EmailJS (if configured):**
```javascript
emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_CHECKLIST_TEMPLATE_ID,
    {
        to_email: email,
        checklist_html: html,
        stats_completed: X,
        stats_total: Y,
        stats_percentage: Z
    }
);
```

**Fallback:**
- Opens mailto: link
- Pre-fills subject
- Includes plain text checklist
- User's email client handles

---

## Responsive Design

### Desktop (≥1024px)
- Two-column action buttons
- Wide progress card
- Full item details visible
- Tooltips fully expanded

### Tablet (768px - 1023px)
- Two-column buttons
- Narrower content
- Tooltips wrapped

### Mobile (<768px)
- Single column layout
- Stacked action buttons
- Compact progress card
- Touch-friendly checkboxes (44×44px)
- Tooltips collapsed initially

---

## Customization

### Adding New Documents

1. Add to `DOCUMENT_DATABASE`:
```javascript
newDocument: {
    title: 'Document Name',
    category: 'Category',
    description: 'Description',
    link: 'https://...',
    tooltip: 'Helpful info',
    requiredFor: ['tag1', 'tag2']
}
```

2. Document appears automatically for matching scenarios

### Adding New Tags

1. Define in `generatePersonalizedChecklist()`:
```javascript
if (scenario.newCondition) {
    tags.add('newTag');
}
```

2. Tag documents with `requiredFor: ['newTag']`

### Customizing Categories

Categories automatically derived from documents. To add new:
1. Set `category: 'New Category'` on documents
2. Add icon to `getCategoryIcon()` function

---

## Progress Tracking

### Completion Calculation

```javascript
completed = completedItems.size
total = items.length
percentage = (completed / total) * 100
remaining = total - completed
```

### Progress Bar Colors

- 0-49%: Orange (`bg-orange-500`)
- 50-99%: Blue (`bg-blue-500`)
- 100%: Green (`bg-green-500`)

### Completion Badge

At 100%:
- "Complete! 🎉" message
- Green color scheme
- Celebration indicator

---

## Error Handling

### Missing Scenario
```javascript
if (items.length === 0) {
    renderEmptyChecklistPage();
    // Shows "Generate Your Checklist" CTA
}
```

### localStorage Unavailable
```javascript
try {
    localStorage.setItem(...);
} catch (error) {
    logError(error);
    // Continue without persistence
}
```

### PDF Export Failure
```javascript
try {
    doc.save(...);
    showToast('PDF downloaded!', 'success');
} catch (error) {
    showToast('Failed to generate PDF', 'error');
}
```

### Email Send Failure
```javascript
try {
    await emailjs.send(...);
    showToast('Email sent!', 'success');
} catch (error) {
    // Fall back to mailto:
    window.location.href = `mailto:...`;
}
```

---

## Testing Checklist

### Scenario Generation
- [x] Australian citizen (minimal docs)
- [x] Permanent resident (no FIRB docs)
- [x] Temporary resident + student visa
- [x] Temporary resident + bridging visa
- [x] Foreign national
- [x] Company purchase (extra docs)
- [x] Each state (8 states)
- [x] Each property type (4 types)
- [x] First home owner (VIC)

### Progress Tracking
- [x] Check item (toggle on)
- [x] Uncheck item (toggle off)
- [x] Progress bar updates
- [x] Percentage calculates
- [x] Save to localStorage
- [x] Load on page reload
- [x] Reset progress

### Export Functions
- [x] Print checklist
- [x] Print stylesheet applies
- [x] PDF export generates
- [x] PDF includes all data
- [x] PDF has correct filename
- [x] Email modal opens
- [x] Email sends (with EmailJS)
- [x] Email fallback works

### UI Components
- [x] Empty state displays
- [x] Categories render
- [x] Items render
- [x] Checkboxes clickable
- [x] Tooltips display
- [x] Links work
- [x] Professional services card
- [x] Important notice banner

### Responsive
- [x] Mobile layout
- [x] Tablet layout
- [x] Desktop layout
- [x] Touch targets (min 44px)
- [x] Action buttons responsive

---

## Performance

### Load Time
- ~15KB JavaScript (uncompressed)
- No external dependencies (except EmailJS, optional)
- Renders in < 100ms

### Storage
- ~2KB per saved checklist
- Minimal localStorage usage
- No server storage required

### PDF Generation
- 2-4 seconds for typical checklist
- Depends on number of items
- jsPDF library already loaded

---

## Future Enhancements

### Potential Features
- [ ] Sub-checklists (e.g., "Documents for conveyancer")
- [ ] Document upload/attachment
- [ ] Due dates for documents
- [ ] Reminders/notifications
- [ ] Share checklist with team
- [ ] Collaborative completion tracking
- [ ] Document templates/samples
- [ ] AI document scanner (verify completeness)
- [ ] Integration with document storage (Google Drive, Dropbox)
- [ ] Multi-language support
- [ ] Voice-guided checklist

### Analytics to Track
- Completion rates
- Time to complete
- Most commonly incomplete documents
- Print vs PDF vs email usage
- Reset frequency
- Category-specific bottlenecks

---

## Maintenance

### Regular Updates
- Review document database (quarterly)
- Update government links (as needed)
- Verify FIRB requirements (annually, July 1)
- Update state-specific docs (when regulations change)
- Test all export functions (monthly)

### Document Database Updates

When requirements change:
1. Update `DOCUMENT_DATABASE` object
2. Adjust `requiredFor` tags
3. Update links
4. Update tooltips
5. Test affected scenarios

---

## Support Resources

### Official Links

**FIRB:**
- Application Portal: https://firb.gov.au/apply-for-approval
- Guidance Notes: https://firb.gov.au/guidance-resources/guidance-notes
- Contact: https://firb.gov.au/contact-us

**State Revenue Offices:**
- NSW: https://www.revenue.nsw.gov.au/
- VIC: https://www.sro.vic.gov.au/
- QLD: https://www.qld.gov.au/
- SA: https://www.revenuesa.sa.gov.au/
- WA: https://www.wa.gov.au/
- TAS: https://www.sro.tas.gov.au/
- ACT: https://www.revenue.act.gov.au/
- NT: https://nt.gov.au/

**Professional Bodies:**
- Law Society: https://www.lawsociety.com.au/
- Migration Agents: https://www.mara.gov.au/
- CPAs: https://www.cpaaustralia.com.au/
- Building Inspectors: https://www.mbav.com.au/

---

## API Reference

### Global Functions

**Checklist Management:**
- `generatePersonalizedChecklist(scenario)` - Generate checklist
- `toggleChecklistItem(itemId)` - Toggle checkbox
- `resetChecklistProgress()` - Clear all progress
- `showChecklistModal()` - Open checklist page

**Export Functions:**
- `printChecklist()` - Browser print
- `exportChecklistPDF()` - Generate PDF
- `emailChecklist()` - Send via email

**Progress:**
- `getCompletionStats()` - Get stats object
- `getCompletionPercentage()` - Get % complete

**Storage:**
- `saveChecklistProgress()` - Save state
- `loadChecklistProgress()` - Load state

### Global State

**checklistState:**
```javascript
{
    items: [],              // Array of document objects
    completedItems: Set(),  // Set of completed IDs
    userScenario: {},       // User scenario object
    lastUpdated: null       // ISO timestamp string
}
```

---

## Credits

**Libraries Used:**
- jsPDF - PDF generation
- EmailJS (optional) - Email delivery

**Built With:**
- Vanilla JavaScript
- Tailwind CSS
- localStorage API

---

**Version:** 21.0
**Created:** January 2025
**Last Updated:** January 2025
**Maintainer:** FIRB Calculator Team
**Status:** ✅ Production Ready
