/**
 * FIRB Constants - Single Source of Truth
 *
 * All FIRB-related constants consolidated in one place.
 * This is the ONLY file that should declare these constants.
 *
 * @file firbConstants.js
 */

/**
 * Citizenship status constants
 */
const CITIZENSHIP_STATUS = {
    AUSTRALIAN_CITIZEN: 'australian',
    PERMANENT_RESIDENT: 'permanent',
    TEMPORARY_RESIDENT: 'temporary',
    FOREIGN_NATIONAL: 'foreign'
};

/**
 * Visa type constants (simple string values)
 */
const VISA_TYPES = {
    STUDENT: 'student',           // Subclass 500
    SKILLED: 'skilled',           // Subclass 482, 485, 189, 190
    PARTNER: 'partner',           // Subclass 309, 820
    BRIDGING: 'bridging',         // Bridging visas
    VISITOR: 'visitor',           // Tourist visas
    OTHER_TEMPORARY: 'other'      // Other temporary visas
};

/**
 * Visa types with detailed metadata (for UI display and eligibility rules)
 * This is used by the wizard for display labels and permission checks
 */
const VISA_TYPES_DETAILED = {
    'student': {
        label: 'Student Visa (subclass 500)',
        canBuyEstablished: true,
        canBuyNew: true,
        canBuyVacant: true,
        condition: 'Must be your principal place of residence'
    },
    'skilled': {
        label: 'Skilled Work Visa (subclass 482, 485, 186, 189)',
        canBuyEstablished: true,
        canBuyNew: true,
        canBuyVacant: true,
        condition: 'Must be your principal place of residence'
    },
    'partner': {
        label: 'Partner Visa (subclass 309, 820)',
        canBuyEstablished: true,
        canBuyNew: true,
        canBuyVacant: true,
        condition: 'Must be your principal place of residence'
    },
    'bridging': {
        label: 'Bridging Visa',
        canBuyEstablished: false,
        canBuyNew: true,
        canBuyVacant: false,
        condition: 'Only new dwellings allowed'
    },
    'visitor': {
        label: 'Visitor/Tourist Visa',
        canBuyEstablished: false,
        canBuyNew: true,
        canBuyVacant: false,
        condition: 'Only new dwellings allowed'
    },
    'other': {
        label: 'Other Temporary Visa',
        canBuyEstablished: true,
        canBuyNew: true,
        canBuyVacant: true,
        condition: 'Check specific visa conditions'
    }
};

/**
 * Property type constants
 */
const PROPERTY_TYPES = {
    NEW_DWELLING: 'newDwelling',        // Brand new, never occupied
    ESTABLISHED: 'established',          // Previously occupied
    OFF_THE_PLAN: 'offThePlan',         // Not yet built
    VACANT_LAND: 'vacantLand',          // Undeveloped land
    COMMERCIAL: 'commercial'             // Commercial property
};

/**
 * FIRB requirement result codes
 */
const FIRB_RESULT = {
    NOT_REQUIRED: 'not_required',
    REQUIRED: 'required',
    CONDITIONAL: 'conditional',
    NOT_ALLOWED: 'not_allowed'
};

// Browser export (for use in HTML via script tag)
if (typeof window !== 'undefined') {
    window.FIRBConstants = {
        CITIZENSHIP_STATUS,
        VISA_TYPES,
        VISA_TYPES_DETAILED,
        PROPERTY_TYPES,
        FIRB_RESULT
    };
}

// Node.js export (for use in modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CITIZENSHIP_STATUS,
        VISA_TYPES,
        VISA_TYPES_DETAILED,
        PROPERTY_TYPES,
        FIRB_RESULT
    };
}
