/**
 * FIRB Eligibility Checker
 * @file firbEligibility.js
 *
 * Determines whether FIRB approval is required based on citizenship status,
 * visa type, and property type for foreign property buyers in Australia.
 *
 * @module firbEligibility
 * @version 1.0.0
 * @created January 2025
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
 * Visa type constants
 * COMMENTED OUT - Now using centralized constants from src/constants/firbConstants.js
 */
// const VISA_TYPES = {
//     STUDENT: 'student',           // Subclass 500
//     SKILLED: 'skilled',           // Subclass 482, 485, 189, 190
//     PARTNER: 'partner',           // Subclass 309, 820
//     BRIDGING: 'bridging',         // Bridging visas
//     VISITOR: 'visitor',           // Tourist visas
//     OTHER_TEMPORARY: 'other'      // Other temporary visas
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

/**
 * Check if FIRB approval is required for a property purchase
 *
 * @param {Object} params - Parameters object
 * @param {string} params.citizenshipStatus - One of CITIZENSHIP_STATUS values
 * @param {string} [params.visaType] - One of VISA_TYPES values (required if temporary resident)
 * @param {string} params.propertyType - One of PROPERTY_TYPES values
 * @param {boolean} [params.isOrdinarilyResident=true] - Whether PR is ordinarily resident in Australia
 *
 * @returns {Object} Result object with eligibility information
 * @returns {string} return.result - One of FIRB_RESULT values
 * @returns {boolean} return.firbRequired - Whether FIRB approval is required
 * @returns {string} return.reason - Explanation of the decision
 * @returns {string} [return.conditions] - Any conditions that apply
 * @returns {Array<string>} [return.alternatives] - Alternative property types if not allowed
 * @returns {Object} return.metadata - Additional information
 *
 * @example
 * // Australian citizen purchasing any property
 * const result = checkFIRBEligibility({
 *   citizenshipStatus: 'australian',
 *   propertyType: 'established'
 * });
 * // Returns: { result: 'not_required', firbRequired: false, ... }
 *
 * @example
 * // Foreign national purchasing new dwelling
 * const result = checkFIRBEligibility({
 *   citizenshipStatus: 'foreign',
 *   propertyType: 'newDwelling'
 * });
 * // Returns: { result: 'required', firbRequired: true, ... }
 *
 * @example
 * // Temporary resident (student) purchasing established property
 * const result = checkFIRBEligibility({
 *   citizenshipStatus: 'temporary',
 *   visaType: 'student',
 *   propertyType: 'established'
 * });
 * // Returns: { result: 'conditional', firbRequired: true, conditions: '...', ... }
 */
function checkFIRBEligibility({
    citizenshipStatus,
    visaType = null,
    propertyType,
    isOrdinarilyResident = true
}) {
    console.log('[FIRB_ELIGIBILITY] Checking eligibility:', {
        citizenshipStatus, visaType, propertyType, isOrdinarilyResident
    });

    // Validate required parameters
    if (!citizenshipStatus) {
        console.error('[FIRB_ELIGIBILITY] ERROR: citizenshipStatus is required');
        throw new Error('citizenshipStatus is required');
    }

    if (!propertyType) {
        console.error('[FIRB_ELIGIBILITY] ERROR: propertyType is required');
        throw new Error('propertyType is required');
    }

    // Validate citizenship status
    const validCitizenshipStatuses = Object.values(CITIZENSHIP_STATUS);
    if (!validCitizenshipStatuses.includes(citizenshipStatus)) {
        console.error('[FIRB_ELIGIBILITY] ERROR: Invalid citizenshipStatus:', citizenshipStatus);
        throw new Error(`Invalid citizenshipStatus: ${citizenshipStatus}. Must be one of: ${validCitizenshipStatuses.join(', ')}`);
    }

    // Validate property type
    const validPropertyTypes = Object.values(PROPERTY_TYPES);
    if (!validPropertyTypes.includes(propertyType)) {
        console.error('[FIRB_ELIGIBILITY] ERROR: Invalid propertyType:', propertyType);
        throw new Error(`Invalid propertyType: ${propertyType}. Must be one of: ${validPropertyTypes.join(', ')}`);
    }

    // Temporary residents must provide visa type
    if (citizenshipStatus === CITIZENSHIP_STATUS.TEMPORARY_RESIDENT && !visaType) {
        console.error('[FIRB_ELIGIBILITY] ERROR: visaType is required for temporary residents');
        throw new Error('visaType is required for temporary residents');
    }

    // Build base result object
    const baseResult = {
        citizenshipStatus,
        visaType,
        propertyType,
        citizenshipLabel: getCitizenshipLabel(citizenshipStatus),
        propertyTypeLabel: getPropertyTypeDescription(propertyType),
        timestamp: new Date().toISOString()
    };

    // RULE 1: Australian Citizens
    if (citizenshipStatus === CITIZENSHIP_STATUS.AUSTRALIAN_CITIZEN) {
        console.log('[FIRB_ELIGIBILITY] Australian citizen - FIRB not required');
        return {
            ...baseResult,
            result: FIRB_RESULT.NOT_REQUIRED,
            firbRequired: false,
            reason: 'Australian citizens do not require FIRB approval for residential property purchases',
            metadata: {
                exemptionType: 'citizenship',
                stampDutySurcharge: false,
                landTaxSurcharge: false,
                vacancyFee: false
            }
        };
    }

    // RULE 2: Permanent Residents
    if (citizenshipStatus === CITIZENSHIP_STATUS.PERMANENT_RESIDENT) {
        if (isOrdinarilyResident) {
            console.log('[FIRB_ELIGIBILITY] Permanent resident (ordinarily resident) - FIRB not required');
            return {
                ...baseResult,
                result: FIRB_RESULT.NOT_REQUIRED,
                firbRequired: false,
                reason: 'Permanent residents ordinarily resident in Australia do not require FIRB approval',
                conditions: 'You must be ordinarily resident in Australia (spending majority of time in Australia)',
                metadata: {
                    exemptionType: 'permanent_residency',
                    stampDutySurcharge: false,
                    landTaxSurcharge: false,
                    vacancyFee: false,
                    ordinarilyResidentRequired: true
                }
            };
        } else {
            console.log('[FIRB_ELIGIBILITY] Permanent resident (NOT ordinarily resident) - FIRB required');
            return {
                ...baseResult,
                result: FIRB_RESULT.REQUIRED,
                firbRequired: true,
                reason: 'Permanent residents who are NOT ordinarily resident in Australia require FIRB approval',
                conditions: 'You are treated as a foreign person if you spend most of your time overseas',
                metadata: {
                    exemptionType: 'none',
                    stampDutySurcharge: true,
                    landTaxSurcharge: true,
                    vacancyFee: true,
                    ordinarilyResidentRequired: true
                }
            };
        }
    }

    // RULE 3: Foreign Nationals
    if (citizenshipStatus === CITIZENSHIP_STATUS.FOREIGN_NATIONAL) {
        return checkForeignNationalEligibility(propertyType, baseResult);
    }

    // RULE 4: Temporary Residents
    if (citizenshipStatus === CITIZENSHIP_STATUS.TEMPORARY_RESIDENT) {
        return checkTemporaryResidentEligibility(propertyType, visaType, baseResult);
    }

    // Should never reach here due to validation
    console.error('[FIRB_ELIGIBILITY] ERROR: Unexpected code path reached');
    throw new Error('Unexpected eligibility check state');
}

/**
 * Check eligibility for foreign nationals
 * @private
 */
function checkForeignNationalEligibility(propertyType, baseResult) {
    console.log('[FIRB_ELIGIBILITY] Checking foreign national eligibility for:', propertyType);

    // New dwellings - ALLOWED
    if (propertyType === PROPERTY_TYPES.NEW_DWELLING || propertyType === PROPERTY_TYPES.OFF_THE_PLAN) {
        return {
            ...baseResult,
            result: FIRB_RESULT.REQUIRED,
            firbRequired: true,
            reason: 'Foreign nationals can purchase new dwellings and off-the-plan properties with FIRB approval',
            conditions: 'Property must be brand new and never previously occupied',
            metadata: {
                allowed: true,
                stampDutySurcharge: true,
                landTaxSurcharge: true,
                vacancyFee: true,
                estimatedProcessingDays: '30-60'
            }
        };
    }

    // Established dwellings - NOT ALLOWED
    if (propertyType === PROPERTY_TYPES.ESTABLISHED) {
        return {
            ...baseResult,
            result: FIRB_RESULT.NOT_ALLOWED,
            firbRequired: false,
            reason: 'Foreign nationals are NOT permitted to purchase established dwellings',
            conditions: 'Established properties are reserved for Australian citizens, permanent residents, and temporary residents',
            alternatives: [
                'New dwelling/apartment (brand new)',
                'Off-the-plan property (not yet built)',
                'Vacant land (with development approval)'
            ],
            metadata: {
                allowed: false,
                prohibition: 'Foreign nationals cannot buy established residential property'
            }
        };
    }

    // Vacant land - CONDITIONAL
    if (propertyType === PROPERTY_TYPES.VACANT_LAND) {
        return {
            ...baseResult,
            result: FIRB_RESULT.CONDITIONAL,
            firbRequired: true,
            reason: 'Foreign nationals can purchase vacant land with FIRB approval and development conditions',
            conditions: 'You must: (1) Obtain FIRB approval, (2) Commence continuous construction within 4 years, (3) Complete construction within 4 years of commencement',
            metadata: {
                allowed: true,
                stampDutySurcharge: true,
                landTaxSurcharge: true,
                vacancyFee: false,
                developmentRequired: true,
                timeframeYears: 4,
                estimatedProcessingDays: '30-60'
            }
        };
    }

    // Commercial property - ALLOWED (different rules)
    if (propertyType === PROPERTY_TYPES.COMMERCIAL) {
        return {
            ...baseResult,
            result: FIRB_RESULT.REQUIRED,
            firbRequired: true,
            reason: 'Foreign nationals can purchase commercial property with FIRB approval under different rules',
            conditions: 'Commercial property acquisitions have different thresholds and requirements. Consult FIRB for commercial property guidelines.',
            metadata: {
                allowed: true,
                differentRules: true,
                thresholdBased: true,
                estimatedProcessingDays: '40-90'
            }
        };
    }

    // Fallback (should not reach here)
    console.error('[FIRB_ELIGIBILITY] ERROR: Unhandled property type for foreign national:', propertyType);
    throw new Error(`Unhandled property type for foreign national: ${propertyType}`);
}

/**
 * Check eligibility for temporary residents
 * @private
 */
function checkTemporaryResidentEligibility(propertyType, visaType, baseResult) {
    console.log('[FIRB_ELIGIBILITY] Checking temporary resident eligibility for:', propertyType, visaType);

    // Define visa-specific rules
    const visaRules = {
        [VISA_TYPES.STUDENT]: {
            canBuyEstablished: true,
            canBuyNew: true,
            canBuyVacant: true,
            mustBeResidence: true,
            mustSellOnDeparture: true,
            condition: 'Must be your principal place of residence'
        },
        [VISA_TYPES.SKILLED]: {
            canBuyEstablished: true,
            canBuyNew: true,
            canBuyVacant: true,
            mustBeResidence: true,
            mustSellOnDeparture: true,
            condition: 'Must be your principal place of residence'
        },
        [VISA_TYPES.PARTNER]: {
            canBuyEstablished: true,
            canBuyNew: true,
            canBuyVacant: true,
            mustBeResidence: true,
            mustSellOnDeparture: true,
            condition: 'Must be your principal place of residence'
        },
        [VISA_TYPES.BRIDGING]: {
            canBuyEstablished: false,
            canBuyNew: true,
            canBuyVacant: false,
            mustBeResidence: true,
            mustSellOnDeparture: true,
            condition: 'Only new dwellings allowed'
        },
        [VISA_TYPES.VISITOR]: {
            canBuyEstablished: false,
            canBuyNew: true,
            canBuyVacant: false,
            mustBeResidence: false,
            mustSellOnDeparture: true,
            condition: 'Only new dwellings allowed (investment only)'
        },
        [VISA_TYPES.OTHER_TEMPORARY]: {
            canBuyEstablished: true,
            canBuyNew: true,
            canBuyVacant: true,
            mustBeResidence: true,
            mustSellOnDeparture: true,
            condition: 'Check specific visa conditions'
        }
    };

    const rules = visaRules[visaType];
    if (!rules) {
        console.error('[FIRB_ELIGIBILITY] ERROR: Unknown visa type:', visaType);
        throw new Error(`Unknown visa type: ${visaType}`);
    }

    // Check new dwellings
    if (propertyType === PROPERTY_TYPES.NEW_DWELLING || propertyType === PROPERTY_TYPES.OFF_THE_PLAN) {
        if (rules.canBuyNew) {
            return {
                ...baseResult,
                result: FIRB_RESULT.REQUIRED,
                firbRequired: true,
                reason: 'Temporary residents can purchase new dwellings with FIRB approval',
                conditions: `${rules.condition}. You must sell the property within 3 months of your visa expiring or leaving Australia permanently.`,
                metadata: {
                    allowed: true,
                    visaType,
                    stampDutySurcharge: true,
                    landTaxSurcharge: true,
                    vacancyFee: true,
                    mustBeResidence: rules.mustBeResidence,
                    mustSellOnDeparture: rules.mustSellOnDeparture,
                    estimatedProcessingDays: '30-60'
                }
            };
        }
    }

    // Check established dwellings
    if (propertyType === PROPERTY_TYPES.ESTABLISHED) {
        if (rules.canBuyEstablished) {
            return {
                ...baseResult,
                result: FIRB_RESULT.CONDITIONAL,
                firbRequired: true,
                reason: 'Temporary residents can purchase established dwellings with FIRB approval under specific conditions',
                conditions: `STRICT CONDITIONS APPLY: (1) ${rules.condition}, (2) Maximum ONE established dwelling at a time, (3) Must sell within 3 months of visa expiry or departure, (4) Cannot rent out the property, (5) Must live in the property as your main residence`,
                metadata: {
                    allowed: true,
                    visaType,
                    stampDutySurcharge: true,
                    landTaxSurcharge: true,
                    vacancyFee: true,
                    mustBeResidence: true,
                    mustSellOnDeparture: true,
                    cannotRentOut: true,
                    maximumProperties: 1,
                    estimatedProcessingDays: '30-60'
                }
            };
        } else {
            return {
                ...baseResult,
                result: FIRB_RESULT.NOT_ALLOWED,
                firbRequired: false,
                reason: `Your visa type (${visaType}) does not permit purchasing established dwellings`,
                conditions: rules.condition,
                alternatives: [
                    'New dwelling/apartment (brand new)',
                    'Off-the-plan property (not yet built)'
                ],
                metadata: {
                    allowed: false,
                    visaType,
                    prohibition: `${visaType} visa holders cannot buy established dwellings`
                }
            };
        }
    }

    // Check vacant land
    if (propertyType === PROPERTY_TYPES.VACANT_LAND) {
        if (rules.canBuyVacant) {
            return {
                ...baseResult,
                result: FIRB_RESULT.CONDITIONAL,
                firbRequired: true,
                reason: 'Temporary residents can purchase vacant land with FIRB approval and development conditions',
                conditions: `${rules.condition}. You must: (1) Commence continuous construction within 4 years, (2) Complete within 4 years of commencement, (3) Property must be your residence, (4) Sell within 3 months of visa expiry`,
                metadata: {
                    allowed: true,
                    visaType,
                    stampDutySurcharge: true,
                    landTaxSurcharge: true,
                    vacancyFee: false,
                    developmentRequired: true,
                    timeframeYears: 4,
                    mustBeResidence: true,
                    mustSellOnDeparture: true,
                    estimatedProcessingDays: '30-60'
                }
            };
        } else {
            return {
                ...baseResult,
                result: FIRB_RESULT.NOT_ALLOWED,
                firbRequired: false,
                reason: `Your visa type (${visaType}) does not permit purchasing vacant land`,
                conditions: rules.condition,
                alternatives: [
                    'New dwelling/apartment (brand new)',
                    'Off-the-plan property (not yet built)'
                ],
                metadata: {
                    allowed: false,
                    visaType,
                    prohibition: `${visaType} visa holders cannot buy vacant land`
                }
            };
        }
    }

    // Check commercial property
    if (propertyType === PROPERTY_TYPES.COMMERCIAL) {
        return {
            ...baseResult,
            result: FIRB_RESULT.REQUIRED,
            firbRequired: true,
            reason: 'Temporary residents can purchase commercial property with FIRB approval',
            conditions: 'Commercial property acquisitions have different rules. Consult FIRB for specific requirements.',
            metadata: {
                allowed: true,
                visaType,
                differentRules: true,
                estimatedProcessingDays: '40-90'
            }
        };
    }

    // Fallback
    console.error('[FIRB_ELIGIBILITY] ERROR: Unhandled property type for temporary resident:', propertyType);
    throw new Error(`Unhandled property type for temporary resident: ${propertyType}`);
}

/**
 * Get human-readable citizenship label
 *
 * @param {string} citizenshipStatus - Citizenship status code
 * @returns {string} Human-readable label
 *
 * @example
 * getCitizenshipLabel('australian')  // Returns: "Australian Citizen"
 * getCitizenshipLabel('temporary')   // Returns: "Temporary Resident"
 */
function getCitizenshipLabel(citizenshipStatus) {
    const labels = {
        [CITIZENSHIP_STATUS.AUSTRALIAN_CITIZEN]: 'Australian Citizen',
        [CITIZENSHIP_STATUS.PERMANENT_RESIDENT]: 'Permanent Resident',
        [CITIZENSHIP_STATUS.TEMPORARY_RESIDENT]: 'Temporary Resident',
        [CITIZENSHIP_STATUS.FOREIGN_NATIONAL]: 'Foreign National'
    };

    return labels[citizenshipStatus] || 'Unknown Status';
}

/**
 * Get human-readable property type description
 *
 * @param {string} propertyType - Property type code
 * @returns {string} Human-readable description
 *
 * @example
 * getPropertyTypeDescription('newDwelling')  // Returns: "New Dwelling"
 * getPropertyTypeDescription('established')  // Returns: "Established Dwelling"
 */
function getPropertyTypeDescription(propertyType) {
    const descriptions = {
        [PROPERTY_TYPES.NEW_DWELLING]: 'New Dwelling',
        [PROPERTY_TYPES.ESTABLISHED]: 'Established Dwelling',
        [PROPERTY_TYPES.OFF_THE_PLAN]: 'Off-the-Plan',
        [PROPERTY_TYPES.VACANT_LAND]: 'Vacant Land',
        [PROPERTY_TYPES.COMMERCIAL]: 'Commercial Property'
    };

    return descriptions[propertyType] || 'Unknown Property Type';
}

/**
 * Run comprehensive eligibility tests
 * Tests all combinations of citizenship and property types
 *
 * @returns {Object} Test results object
 * @returns {number} return.totalTests - Total number of tests run
 * @returns {number} return.passed - Number of tests that passed
 * @returns {number} return.failed - Number of tests that failed
 * @returns {Array<Object>} return.results - Detailed test results
 *
 * @example
 * const testResults = runEligibilityTests();
 * console.log(`${testResults.passed}/${testResults.totalTests} tests passed`);
 */
function runEligibilityTests() {
    console.log('[FIRB_ELIGIBILITY] Running comprehensive eligibility tests...');

    const tests = [
        // Australian Citizens - All properties allowed, no FIRB
        {
            name: 'Australian citizen - new dwelling',
            params: { citizenshipStatus: 'australian', propertyType: 'newDwelling' },
            expected: { firbRequired: false, result: 'not_required' }
        },
        {
            name: 'Australian citizen - established dwelling',
            params: { citizenshipStatus: 'australian', propertyType: 'established' },
            expected: { firbRequired: false, result: 'not_required' }
        },
        {
            name: 'Australian citizen - vacant land',
            params: { citizenshipStatus: 'australian', propertyType: 'vacantLand' },
            expected: { firbRequired: false, result: 'not_required' }
        },

        // Permanent Residents (ordinarily resident)
        {
            name: 'PR (ordinarily resident) - established dwelling',
            params: { citizenshipStatus: 'permanent', propertyType: 'established', isOrdinarilyResident: true },
            expected: { firbRequired: false, result: 'not_required' }
        },
        {
            name: 'PR (NOT ordinarily resident) - established dwelling',
            params: { citizenshipStatus: 'permanent', propertyType: 'established', isOrdinarilyResident: false },
            expected: { firbRequired: true, result: 'required' }
        },

        // Foreign Nationals
        {
            name: 'Foreign national - new dwelling',
            params: { citizenshipStatus: 'foreign', propertyType: 'newDwelling' },
            expected: { firbRequired: true, result: 'required' }
        },
        {
            name: 'Foreign national - established dwelling',
            params: { citizenshipStatus: 'foreign', propertyType: 'established' },
            expected: { firbRequired: false, result: 'not_allowed' }
        },
        {
            name: 'Foreign national - vacant land',
            params: { citizenshipStatus: 'foreign', propertyType: 'vacantLand' },
            expected: { firbRequired: true, result: 'conditional' }
        },
        {
            name: 'Foreign national - commercial',
            params: { citizenshipStatus: 'foreign', propertyType: 'commercial' },
            expected: { firbRequired: true, result: 'required' }
        },

        // Temporary Residents - Student Visa
        {
            name: 'Student visa - new dwelling',
            params: { citizenshipStatus: 'temporary', visaType: 'student', propertyType: 'newDwelling' },
            expected: { firbRequired: true, result: 'required' }
        },
        {
            name: 'Student visa - established dwelling',
            params: { citizenshipStatus: 'temporary', visaType: 'student', propertyType: 'established' },
            expected: { firbRequired: true, result: 'conditional' }
        },
        {
            name: 'Student visa - vacant land',
            params: { citizenshipStatus: 'temporary', visaType: 'student', propertyType: 'vacantLand' },
            expected: { firbRequired: true, result: 'conditional' }
        },

        // Temporary Residents - Bridging Visa (restricted)
        {
            name: 'Bridging visa - new dwelling',
            params: { citizenshipStatus: 'temporary', visaType: 'bridging', propertyType: 'newDwelling' },
            expected: { firbRequired: true, result: 'required' }
        },
        {
            name: 'Bridging visa - established dwelling',
            params: { citizenshipStatus: 'temporary', visaType: 'bridging', propertyType: 'established' },
            expected: { firbRequired: false, result: 'not_allowed' }
        },
        {
            name: 'Bridging visa - vacant land',
            params: { citizenshipStatus: 'temporary', visaType: 'bridging', propertyType: 'vacantLand' },
            expected: { firbRequired: false, result: 'not_allowed' }
        },

        // Temporary Residents - Visitor Visa (most restricted)
        {
            name: 'Visitor visa - new dwelling',
            params: { citizenshipStatus: 'temporary', visaType: 'visitor', propertyType: 'newDwelling' },
            expected: { firbRequired: true, result: 'required' }
        },
        {
            name: 'Visitor visa - established dwelling',
            params: { citizenshipStatus: 'temporary', visaType: 'visitor', propertyType: 'established' },
            expected: { firbRequired: false, result: 'not_allowed' }
        }
    ];

    const results = [];
    let passed = 0;
    let failed = 0;

    tests.forEach((test, index) => {
        try {
            const result = checkFIRBEligibility(test.params);
            const testPassed = result.firbRequired === test.expected.firbRequired &&
                              result.result === test.expected.result;

            if (testPassed) {
                passed++;
                console.log(`✅ Test ${index + 1}: ${test.name} - PASSED`);
            } else {
                failed++;
                console.error(`❌ Test ${index + 1}: ${test.name} - FAILED`);
                console.error('  Expected:', test.expected);
                console.error('  Got:', { firbRequired: result.firbRequired, result: result.result });
            }

            results.push({
                test: test.name,
                passed: testPassed,
                expected: test.expected,
                actual: { firbRequired: result.firbRequired, result: result.result },
                fullResult: result
            });
        } catch (error) {
            failed++;
            console.error(`❌ Test ${index + 1}: ${test.name} - ERROR:`, error.message);
            results.push({
                test: test.name,
                passed: false,
                error: error.message
            });
        }
    });

    const summary = {
        totalTests: tests.length,
        passed,
        failed,
        passRate: ((passed / tests.length) * 100).toFixed(1),
        results
    };

    console.log(`\n[FIRB_ELIGIBILITY] Test Summary: ${passed}/${tests.length} tests passed (${summary.passRate}%)`);

    return summary;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Main function
        checkFIRBEligibility,

        // Helper functions
        getCitizenshipLabel,
        getPropertyTypeDescription,

        // Testing
        runEligibilityTests,

        // Constants
        CITIZENSHIP_STATUS,
        VISA_TYPES,
        PROPERTY_TYPES,
        FIRB_RESULT
    };
}

// Browser global export
if (typeof window !== 'undefined') {
    window.FIRBEligibility = {
        checkFIRBEligibility,
        getCitizenshipLabel,
        getPropertyTypeDescription,
        runEligibilityTests,
        CITIZENSHIP_STATUS,
        VISA_TYPES,
        PROPERTY_TYPES,
        FIRB_RESULT
    };
}
