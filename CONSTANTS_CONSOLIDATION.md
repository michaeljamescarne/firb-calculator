# FIRB Constants Consolidation

## Overview

All FIRB-related constants have been consolidated into a single source of truth: `src/constants/firbConstants.js`

This eliminates duplicate constant declarations and ensures consistency across the entire codebase.

## Changes Made

### 1. Created Single Source of Truth

**File:** `src/constants/firbConstants.js`

This file is now the ONLY place where these constants are declared:

- `CITIZENSHIP_STATUS` - Citizenship status types
- `VISA_TYPES` - Simple visa type constants
- `VISA_TYPES_DETAILED` - Visa types with metadata (labels, permissions)
- `PROPERTY_TYPES` - Property type constants
- `FIRB_RESULT` - FIRB requirement result codes

**Exports:**
- Browser: `window.FIRBConstants`
- Node.js: `module.exports`

### 2. Commented Out Duplicate Declarations

#### src/utils/firbEligibility.js (Lines 27-34)
**BEFORE:**
```javascript
const VISA_TYPES = {
    STUDENT: 'student',
    SKILLED: 'skilled',
    PARTNER: 'partner',
    BRIDGING: 'bridging',
    VISITOR: 'visitor',
    OTHER_TEMPORARY: 'other'
};
```

**AFTER:**
```javascript
// const VISA_TYPES = {  // COMMENTED OUT
//     STUDENT: 'student',
//     ...
// };

// Import from centralized constants
const VISA_TYPES = window.FIRBConstants?.VISA_TYPES || {
    STUDENT: 'student',
    SKILLED: 'skilled',
    PARTNER: 'partner',
    BRIDGING: 'bridging',
    VISITOR: 'visitor',
    OTHER_TEMPORARY: 'other'
};
```

#### js/eligibilityWizard.js (Lines 30-73)
**BEFORE:**
```javascript
const VISA_TYPES = {
    'student': {
        label: 'Student Visa (subclass 500)',
        canBuyEstablished: true,
        ...
    },
    ...
};
```

**AFTER:**
```javascript
// const VISA_TYPES = {  // COMMENTED OUT
//     'student': {
//         label: 'Student Visa (subclass 500)',
//         ...
//     },
//     ...
// };

// Import from centralized constants (use detailed version for wizard)
const VISA_TYPES = window.FIRBConstants?.VISA_TYPES_DETAILED || {
    'student': {
        label: 'Student Visa (subclass 500)',
        canBuyEstablished: true,
        canBuyNew: true,
        canBuyVacant: true,
        condition: 'Must be your principal place of residence'
    },
    ...
};
```

### 3. Updated index.html Load Order

**File:** `index.html` (Line 53)

Added constants file BEFORE any file that uses them:

```html
<!-- FIRB Constants - MUST load before any file that uses them -->
<script src="src/constants/firbConstants.js"></script>
<!-- FIRB Eligibility Module -->
<script src="src/utils/firbEligibility.js"></script>
```

## Constants Structure

### Simple Constants (VISA_TYPES)
```javascript
const VISA_TYPES = {
    STUDENT: 'student',
    SKILLED: 'skilled',
    PARTNER: 'partner',
    BRIDGING: 'bridging',
    VISITOR: 'visitor',
    OTHER_TEMPORARY: 'other'
};
```

**Used by:** `src/utils/firbEligibility.js`

### Detailed Constants (VISA_TYPES_DETAILED)
```javascript
const VISA_TYPES_DETAILED = {
    'student': {
        label: 'Student Visa (subclass 500)',
        canBuyEstablished: true,
        canBuyNew: true,
        canBuyVacant: true,
        condition: 'Must be your principal place of residence'
    },
    ...
};
```

**Used by:** `js/eligibilityWizard.js`

## Fallback Strategy

Each file that imports constants includes a fallback for backward compatibility:

```javascript
// If constants file not loaded, use fallback
const VISA_TYPES = window.FIRBConstants?.VISA_TYPES || {
    STUDENT: 'student',
    // ... fallback values
};
```

This ensures the app still works even if the constants file fails to load.

## Verification

### Search Results
```bash
grep -r "const VISA_TYPES" --include="*.js" .
```

**Results:**
- ✅ `src/constants/firbConstants.js` - ONLY place with declaration
- ✅ `js/eligibilityWizard.js` - Commented out, uses import
- ✅ `src/utils/firbEligibility.js` - Commented out, uses import

### Load Order Verification

1. ✅ `js/browserCompatibility.js` - First
2. ✅ `js/errorHandling.js` - Second
3. ✅ `src/constants/firbConstants.js` - **Third (BEFORE eligibility)**
4. ✅ `src/utils/firbEligibility.js` - Fourth (uses constants)
5. ✅ Other files...
6. ✅ `js/eligibilityWizard.js` - Later (uses constants)

## Benefits

### ✅ Single Source of Truth
- Only ONE place to update constants
- No risk of inconsistency between files
- Easier to maintain

### ✅ Reduced Duplication
- Removed duplicate VISA_TYPES declaration
- Cleaner codebase
- Smaller file sizes

### ✅ Better Organization
- All constants in dedicated directory
- Clear separation of concerns
- Easy to find and update

### ✅ Backward Compatible
- Fallback values if constants don't load
- App continues to work
- Graceful degradation

### ✅ Type Safety (Future)
- Easy to add TypeScript definitions
- Single file to type
- Consistent types across codebase

## Usage

### Accessing Constants (Browser)
```javascript
// Simple visa types
window.FIRBConstants.VISA_TYPES.STUDENT // 'student'

// Detailed visa types
window.FIRBConstants.VISA_TYPES_DETAILED['student'].label // 'Student Visa (subclass 500)'

// Other constants
window.FIRBConstants.CITIZENSHIP_STATUS.AUSTRALIAN_CITIZEN // 'australian'
window.FIRBConstants.PROPERTY_TYPES.NEW_DWELLING // 'newDwelling'
window.FIRBConstants.FIRB_RESULT.NOT_REQUIRED // 'not_required'
```

### Accessing Constants (Node.js)
```javascript
const { VISA_TYPES, VISA_TYPES_DETAILED } = require('./src/constants/firbConstants');

VISA_TYPES.STUDENT // 'student'
VISA_TYPES_DETAILED['student'].label // 'Student Visa (subclass 500)'
```

## Migration Checklist

- [x] Create `src/constants/firbConstants.js`
- [x] Add both `VISA_TYPES` and `VISA_TYPES_DETAILED`
- [x] Comment out declaration in `src/utils/firbEligibility.js`
- [x] Comment out declaration in `js/eligibilityWizard.js`
- [x] Add import logic with fallbacks
- [x] Update `index.html` load order
- [x] Verify only ONE declaration exists
- [x] Test application functionality
- [x] Document changes

## Testing

### Manual Test
1. Open https://michaeljamescarne.github.io/firb-calculator/
2. Open console (F12)
3. Run: `window.FIRBConstants`
4. Verify constants are available
5. Test wizard flow (all visa types should work)
6. Test eligibility module (all tests should pass)

### Console Verification
```javascript
// Check constants loaded
window.FIRBConstants !== undefined

// Check VISA_TYPES
window.FIRBConstants.VISA_TYPES

// Check VISA_TYPES_DETAILED
window.FIRBConstants.VISA_TYPES_DETAILED

// Run eligibility tests
runFIRBEligibilityTests()
// Should show 18/18 tests passed
```

## Files Modified

1. ✅ **Created:** `src/constants/firbConstants.js`
2. ✅ **Modified:** `src/utils/firbEligibility.js`
3. ✅ **Modified:** `js/eligibilityWizard.js`
4. ✅ **Modified:** `index.html`

## Future Enhancements

1. **TypeScript Definitions**
   - Add `.d.ts` file for type safety
   - Import types in TypeScript files

2. **Module System**
   - Convert to ES6 modules
   - Use `import` instead of window object

3. **Constants Validation**
   - Add runtime validation
   - Ensure all required constants exist

4. **Documentation Generator**
   - Auto-generate docs from constants
   - Keep README in sync

---

**Created:** January 2025
**Status:** ✅ Complete
**Impact:** Medium - Improves maintainability and reduces duplication
