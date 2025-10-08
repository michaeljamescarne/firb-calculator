/**
 * Cross-Browser Compatibility Layer for FIRB Calculator
 * @file browserCompatibility.js
 *
 * Ensures compatibility across:
 * - Chrome (latest)
 * - Firefox (latest)
 * - Safari (desktop + iOS)
 * - Edge (latest)
 * - Samsung Internet
 *
 * Addresses:
 * - CSS Grid/Flexbox inconsistencies
 * - localStorage availability
 * - Feature detection
 * - Polyfills for missing features
 * - Browser-specific bugs
 */

/**
 * Browser detection utility
 */
const BrowserDetect = {
    isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
    isFirefox: /Firefox/.test(navigator.userAgent),
    isSafari: /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),
    isEdge: /Edg/.test(navigator.userAgent),
    isSamsungInternet: /SamsungBrowser/.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent),

    /**
     * Get browser name
     */
    getName() {
        if (this.isSamsungInternet) return 'Samsung Internet';
        if (this.isEdge) return 'Edge';
        if (this.isChrome) return 'Chrome';
        if (this.isFirefox) return 'Firefox';
        if (this.isSafari) return 'Safari';
        return 'Unknown';
    },

    /**
     * Get browser version
     */
    getVersion() {
        const ua = navigator.userAgent;
        let match;

        if (this.isChrome) {
            match = ua.match(/Chrome\/(\d+)/);
        } else if (this.isFirefox) {
            match = ua.match(/Firefox\/(\d+)/);
        } else if (this.isSafari) {
            match = ua.match(/Version\/(\d+)/);
        } else if (this.isEdge) {
            match = ua.match(/Edg\/(\d+)/);
        } else if (this.isSamsungInternet) {
            match = ua.match(/SamsungBrowser\/(\d+)/);
        }

        return match ? parseInt(match[1]) : 0;
    }
};

/**
 * Feature detection
 */
const FeatureDetect = {
    /**
     * Check if localStorage is available and working
     */
    hasLocalStorage() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Check if sessionStorage is available
     */
    hasSessionStorage() {
        try {
            const test = '__sessionStorage_test__';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Check for CSS Grid support
     */
    hasCSSGrid() {
        return CSS.supports('display', 'grid');
    },

    /**
     * Check for CSS Flexbox support
     */
    hasFlexbox() {
        return CSS.supports('display', 'flex');
    },

    /**
     * Check for IntersectionObserver support
     */
    hasIntersectionObserver() {
        return 'IntersectionObserver' in window;
    },

    /**
     * Check for MutationObserver support
     */
    hasMutationObserver() {
        return 'MutationObserver' in window;
    },

    /**
     * Check for Service Worker support
     */
    hasServiceWorker() {
        return 'serviceWorker' in navigator;
    },

    /**
     * Check for Web Share API support
     */
    hasWebShare() {
        return 'share' in navigator;
    },

    /**
     * Check for async/await support
     */
    hasAsyncAwait() {
        try {
            eval('(async () => {})');
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Check for ES6 module support
     */
    hasES6Modules() {
        return 'noModule' in document.createElement('script');
    },

    /**
     * Check for fetch API support
     */
    hasFetch() {
        return 'fetch' in window;
    },

    /**
     * Check for Promise support
     */
    hasPromise() {
        return 'Promise' in window;
    },

    /**
     * Check for Array.from support
     */
    hasArrayFrom() {
        return 'from' in Array;
    },

    /**
     * Check for Object.assign support
     */
    hasObjectAssign() {
        return 'assign' in Object;
    }
};

/**
 * Storage fallback for browsers without localStorage
 */
class StorageFallback {
    constructor() {
        this.data = {};
    }

    setItem(key, value) {
        this.data[key] = String(value);
    }

    getItem(key) {
        return this.data.hasOwnProperty(key) ? this.data[key] : null;
    }

    removeItem(key) {
        delete this.data[key];
    }

    clear() {
        this.data = {};
    }

    key(index) {
        const keys = Object.keys(this.data);
        return keys[index] || null;
    }

    get length() {
        return Object.keys(this.data).length;
    }
}

/**
 * Ensure localStorage is available, use fallback if not
 */
function ensureStorage() {
    if (!FeatureDetect.hasLocalStorage()) {
        console.warn('localStorage not available, using in-memory fallback');
        window.localStorage = new StorageFallback();
    }

    if (!FeatureDetect.hasSessionStorage()) {
        console.warn('sessionStorage not available, using in-memory fallback');
        window.sessionStorage = new StorageFallback();
    }
}

/**
 * Polyfills for older browsers
 */
function loadPolyfills() {
    // Array.from polyfill
    if (!FeatureDetect.hasArrayFrom()) {
        Array.from = function(arrayLike) {
            return Array.prototype.slice.call(arrayLike);
        };
    }

    // Object.assign polyfill
    if (!FeatureDetect.hasObjectAssign()) {
        Object.assign = function(target) {
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            const to = Object(target);

            for (let i = 1; i < arguments.length; i++) {
                const nextSource = arguments[i];

                if (nextSource != null) {
                    for (const key in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, key)) {
                            to[key] = nextSource[key];
                        }
                    }
                }
            }

            return to;
        };
    }

    // String.prototype.includes polyfill
    if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
            if (search instanceof RegExp) {
                throw TypeError('first argument must not be a RegExp');
            }
            if (start === undefined) { start = 0; }
            return this.indexOf(search, start) !== -1;
        };
    }

    // Array.prototype.find polyfill
    if (!Array.prototype.find) {
        Array.prototype.find = function(predicate) {
            if (this == null) {
                throw TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw TypeError('predicate must be a function');
            }
            const list = Object(this);
            const length = list.length >>> 0;
            const thisArg = arguments[1];

            for (let i = 0; i < length; i++) {
                const value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        };
    }

    // Promise polyfill (simple version for basic usage)
    if (!FeatureDetect.hasPromise()) {
        console.warn('Browser does not support Promises. Some features may not work.');
        // For production, load a full Promise polyfill from CDN
        // <script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>
    }
}

/**
 * Fix CSS Grid/Flexbox inconsistencies
 */
function fixLayoutInconsistencies() {
    const style = document.createElement('style');
    style.id = 'browser-layout-fixes';
    style.textContent = `
        /* Firefox flexbox fixes */
        @-moz-document url-prefix() {
            .flex {
                min-width: 0;
                min-height: 0;
            }

            /* Fix flex item overflow in Firefox */
            .flex > * {
                min-width: 0;
            }
        }

        /* Safari flexbox fixes */
        @supports (-webkit-appearance: none) {
            /* Fix Safari flex shrink bug */
            .flex {
                flex-shrink: 1;
            }

            /* Fix Safari grid gap issues */
            .grid {
                grid-gap: inherit;
            }
        }

        /* Edge-specific fixes */
        @supports (-ms-ime-align: auto) {
            /* Fix Edge grid auto-placement */
            .grid {
                -ms-grid-columns: auto;
                -ms-grid-rows: auto;
            }
        }

        /* Samsung Internet fixes */
        .grid,
        .flex {
            /* Ensure proper layout calculation */
            contain: layout;
        }

        /* Universal grid/flex fallback */
        @supports not (display: grid) {
            .grid {
                display: flex;
                flex-wrap: wrap;
            }

            .grid > * {
                flex: 1 1 auto;
            }
        }

        /* Flexbox gap fallback for older browsers */
        @supports not (gap: 1rem) {
            .flex.gap-2 > * + *,
            .flex.space-x-2 > * + * {
                margin-left: 0.5rem;
            }

            .flex.gap-4 > * + *,
            .flex.space-x-4 > * + * {
                margin-left: 1rem;
            }

            .flex.space-y-2 > * + *,
            .grid.gap-2 > * + * {
                margin-top: 0.5rem;
            }

            .flex.space-y-4 > * + *,
            .grid.gap-4 > * + * {
                margin-top: 1rem;
            }
        }
    `;

    if (!document.getElementById('browser-layout-fixes')) {
        document.head.appendChild(style);
    }
}

/**
 * Fix number input inconsistencies across browsers
 */
function fixNumberInputs() {
    // Safari and some browsers don't support inputmode
    if (!('inputMode' in document.createElement('input'))) {
        const numberInputs = document.querySelectorAll('input[type="number"], input[inputmode="decimal"]');
        numberInputs.forEach(input => {
            input.setAttribute('pattern', '[0-9]*');
        });
    }

    // Ensure consistent number formatting
    const style = document.createElement('style');
    style.id = 'number-input-fixes';
    style.textContent = `
        /* Remove number input spinners consistently across browsers */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type="number"] {
            -moz-appearance: textfield;
            appearance: textfield;
        }

        /* Ensure consistent height */
        input[type="number"],
        input[type="text"],
        select {
            height: auto;
            min-height: 44px;
        }
    `;

    if (!document.getElementById('number-input-fixes')) {
        document.head.appendChild(style);
    }
}

/**
 * Fix date input handling (Safari has different UI)
 */
function fixDateInputs() {
    // Safari doesn't support date input type well
    if (BrowserDetect.isSafari) {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            // Convert to text input with placeholder
            input.type = 'text';
            input.placeholder = 'DD/MM/YYYY';
            input.setAttribute('pattern', '\\d{2}/\\d{2}/\\d{4}');
        });
    }
}

/**
 * Browser-specific CSS fixes
 */
function applyBrowserSpecificFixes() {
    const browserClass = 'browser-' + BrowserDetect.getName().toLowerCase().replace(/\s+/g, '-');
    document.documentElement.classList.add(browserClass);

    // Add mobile class
    if (BrowserDetect.isIOS || BrowserDetect.isAndroid) {
        document.documentElement.classList.add('mobile');
    }

    const style = document.createElement('style');
    style.id = 'browser-specific-fixes';
    style.textContent = `
        /* Safari-specific fixes */
        .browser-safari input,
        .browser-safari select,
        .browser-safari textarea {
            -webkit-appearance: none;
            border-radius: 0.5rem;
        }

        .browser-safari button {
            -webkit-appearance: none;
        }

        /* Firefox-specific fixes */
        .browser-firefox input::-moz-focus-inner,
        .browser-firefox button::-moz-focus-inner {
            border: 0;
            padding: 0;
        }

        /* Edge-specific fixes */
        .browser-edge select::-ms-expand {
            display: none;
        }

        /* Samsung Internet fixes */
        .browser-samsung-internet {
            -webkit-tap-highlight-color: transparent;
        }

        /* iOS-specific fixes */
        .mobile input,
        .mobile select,
        .mobile textarea {
            font-size: 16px !important;
        }
    `;

    if (!document.getElementById('browser-specific-fixes')) {
        document.head.appendChild(style);
    }
}

/**
 * Console error monitoring
 */
function monitorConsoleErrors() {
    const originalError = console.error;
    const errors = [];

    console.error = function(...args) {
        errors.push({
            timestamp: new Date().toISOString(),
            message: args.join(' '),
            browser: BrowserDetect.getName(),
            version: BrowserDetect.getVersion()
        });

        // Only keep last 50 errors
        if (errors.length > 50) {
            errors.shift();
        }

        originalError.apply(console, args);
    };

    // Expose for debugging
    window.__firbErrors = errors;
}

/**
 * Feature availability warnings
 */
function checkFeatureAvailability() {
    const warnings = [];

    if (!FeatureDetect.hasServiceWorker()) {
        warnings.push('Service Workers not supported - PWA features disabled');
    }

    if (!FeatureDetect.hasWebShare()) {
        warnings.push('Web Share API not supported - using fallback share modal');
    }

    if (!FeatureDetect.hasIntersectionObserver()) {
        warnings.push('IntersectionObserver not supported - lazy loading disabled');
    }

    if (!FeatureDetect.hasCSSGrid()) {
        warnings.push('CSS Grid not supported - using flexbox fallback');
    }

    if (!FeatureDetect.hasPromise()) {
        warnings.push('Promises not supported - some features may not work');
    }

    if (warnings.length > 0) {
        console.warn('Browser compatibility warnings:', warnings);
    }

    return warnings;
}

/**
 * Initialize browser compatibility layer
 */
function initBrowserCompatibility() {
    console.log('Initializing browser compatibility...');
    console.log('Browser:', BrowserDetect.getName(), BrowserDetect.getVersion());

    // Load polyfills first
    loadPolyfills();

    // Ensure storage is available
    ensureStorage();

    // Apply layout fixes
    fixLayoutInconsistencies();

    // Fix input inconsistencies
    fixNumberInputs();
    fixDateInputs();

    // Apply browser-specific fixes
    applyBrowserSpecificFixes();

    // Monitor console errors
    monitorConsoleErrors();

    // Check feature availability
    const warnings = checkFeatureAvailability();

    // Show warning banner if critical features missing
    if (warnings.length > 0) {
        showBrowserWarning(warnings);
    }

    console.log('Browser compatibility initialized');
}

/**
 * Show browser compatibility warning
 */
function showBrowserWarning(warnings) {
    // Only show for critical missing features
    const critical = warnings.filter(w =>
        w.includes('Promise') ||
        w.includes('CSS Grid')
    );

    if (critical.length === 0) return;

    const banner = document.createElement('div');
    banner.id = 'browser-warning';
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #fef3c7;
        border-bottom: 2px solid #f59e0b;
        padding: 1rem;
        z-index: 99999;
        text-align: center;
        font-size: 14px;
    `;

    banner.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
            <strong>Browser Compatibility Notice:</strong>
            Your browser may not support all features. For the best experience, please use the latest version of
            Chrome, Firefox, Safari, or Edge.
            <button onclick="this.parentElement.parentElement.remove()"
                style="margin-left: 1rem; padding: 0.5rem 1rem; background: white; border: 1px solid #f59e0b; border-radius: 0.25rem; cursor: pointer;">
                Dismiss
            </button>
        </div>
    `;

    document.body.insertBefore(banner, document.body.firstChild);
}

/**
 * Export browser info for debugging
 */
function getBrowserInfo() {
    return {
        name: BrowserDetect.getName(),
        version: BrowserDetect.getVersion(),
        userAgent: navigator.userAgent,
        features: {
            localStorage: FeatureDetect.hasLocalStorage(),
            sessionStorage: FeatureDetect.hasSessionStorage(),
            cssGrid: FeatureDetect.hasCSSGrid(),
            flexbox: FeatureDetect.hasFlexbox(),
            intersectionObserver: FeatureDetect.hasIntersectionObserver(),
            mutationObserver: FeatureDetect.hasMutationObserver(),
            serviceWorker: FeatureDetect.hasServiceWorker(),
            webShare: FeatureDetect.hasWebShare(),
            fetch: FeatureDetect.hasFetch(),
            promise: FeatureDetect.hasPromise()
        },
        platform: {
            isIOS: BrowserDetect.isIOS,
            isAndroid: BrowserDetect.isAndroid,
            isMobile: BrowserDetect.isIOS || BrowserDetect.isAndroid
        }
    };
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrowserCompatibility);
} else {
    initBrowserCompatibility();
}

// Expose for debugging
window.__browserInfo = getBrowserInfo();
