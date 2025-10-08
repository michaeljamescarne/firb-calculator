/**
 * Mobile-Specific Bug Fixes for FIRB Calculator
 * @file mobileFixes.js
 *
 * Addresses common mobile issues:
 * - Horizontal scrolling prevention
 * - Touch target sizing
 * - Chart overflow fixes
 * - Modal scrolling
 * - iOS-specific fixes (zoom, safe area)
 * - Viewport height issues
 */

/**
 * Initialize all mobile fixes
 */
function initMobileFixes() {
    preventHorizontalScroll();
    fixIOSInputZoom();
    fixIOSSafeArea();
    fixViewportHeight();
    fixModalScrolling();
    fixChartOverflow();
    enforceTouchTargetSizes();
    fixIOSFixedPositioning();
    handleOrientationChange();

    console.log('Mobile fixes initialized');
}

/**
 * Prevent horizontal scrolling on mobile
 * Common causes: elements wider than viewport, negative margins, absolute positioning
 */
function preventHorizontalScroll() {
    // Add CSS to prevent overflow
    const style = document.createElement('style');
    style.id = 'horizontal-scroll-fix';
    style.textContent = `
        /* Prevent horizontal scroll */
        html, body {
            overflow-x: hidden;
            max-width: 100vw;
            position: relative;
        }

        /* Ensure all containers respect viewport width */
        * {
            max-width: 100%;
        }

        /* Fix for elements that need to overflow (like modals) */
        .modal-container,
        .dropdown-menu,
        .tooltip {
            max-width: none;
        }

        /* Ensure images don't cause overflow */
        img {
            max-width: 100%;
            height: auto;
        }

        /* Fix for tables */
        table {
            max-width: 100%;
            overflow-x: auto;
            display: block;
        }

        /* Fix for pre/code blocks */
        pre, code {
            max-width: 100%;
            overflow-x: auto;
        }

        /* Container width fixes */
        .max-w-7xl,
        .max-w-4xl,
        .max-w-3xl {
            max-width: calc(100vw - 2rem);
        }
    `;

    if (!document.getElementById('horizontal-scroll-fix')) {
        document.head.appendChild(style);
    }
}

/**
 * Fix iOS input zoom issue
 * iOS Safari zooms in when input font-size < 16px
 */
function fixIOSInputZoom() {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

    if (isIOS) {
        const style = document.createElement('style');
        style.id = 'ios-input-zoom-fix';
        style.textContent = `
            /* Prevent iOS zoom on input focus */
            input[type="text"],
            input[type="number"],
            input[type="email"],
            input[type="tel"],
            select,
            textarea {
                font-size: 16px !important;
            }

            /* Adjust placeholder size */
            input::placeholder,
            textarea::placeholder {
                font-size: 16px !important;
            }

            /* Small screens can use smaller font after this fix */
            @media (max-width: 640px) {
                input[type="text"],
                input[type="number"],
                input[type="email"],
                input[type="tel"],
                select,
                textarea {
                    font-size: 16px !important;
                    padding: 0.75rem !important;
                }
            }
        `;

        if (!document.getElementById('ios-input-zoom-fix')) {
            document.head.appendChild(style);
        }
    }
}

/**
 * Fix iOS safe area insets for notch/dynamic island
 */
function fixIOSSafeArea() {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

    if (isIOS) {
        const style = document.createElement('style');
        style.id = 'ios-safe-area-fix';
        style.textContent = `
            /* iOS Safe Area Support */
            body {
                padding-top: env(safe-area-inset-top);
                padding-bottom: env(safe-area-inset-bottom);
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
            }

            /* Fixed headers respect safe area */
            header.sticky,
            header.fixed {
                padding-top: max(1rem, env(safe-area-inset-top));
            }

            /* Bottom navigation respects safe area */
            .bottom-nav,
            .fab-container {
                padding-bottom: max(1rem, env(safe-area-inset-bottom));
            }

            /* Modals respect safe area */
            .modal-content {
                padding-top: max(1rem, env(safe-area-inset-top));
                padding-bottom: max(1rem, env(safe-area-inset-bottom));
            }

            /* Notched device adjustments */
            @supports (padding: max(0px)) {
                .px-4 {
                    padding-left: max(1rem, env(safe-area-inset-left)) !important;
                    padding-right: max(1rem, env(safe-area-inset-right)) !important;
                }
            }
        `;

        if (!document.getElementById('ios-safe-area-fix')) {
            document.head.appendChild(style);
        }
    }
}

/**
 * Fix viewport height issues (100vh problem on mobile)
 * Mobile browsers' address bar affects vh units
 */
function fixViewportHeight() {
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    const style = document.createElement('style');
    style.id = 'viewport-height-fix';
    style.textContent = `
        /* Use CSS custom property for accurate viewport height */
        .min-h-screen {
            min-height: 100vh;
            min-height: calc(var(--vh, 1vh) * 100);
        }

        /* Full-screen modals */
        .modal-fullscreen {
            height: 100vh;
            height: calc(var(--vh, 1vh) * 100);
        }
    `;

    if (!document.getElementById('viewport-height-fix')) {
        document.head.appendChild(style);
    }
}

/**
 * Fix modal scrolling on mobile
 * Prevent body scroll when modal open, enable modal scroll
 */
function fixModalScrolling() {
    const style = document.createElement('style');
    style.id = 'modal-scroll-fix';
    style.textContent = `
        /* Modal scrolling fixes */
        .modal-open {
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
        }

        .modal-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            z-index: 9999;
        }

        .modal-content {
            max-height: calc(100vh - 2rem);
            max-height: calc(var(--vh, 1vh) * 100 - 2rem);
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }

        /* Prevent modal content from causing horizontal scroll */
        .modal-content > * {
            max-width: 100%;
        }

        /* Mobile-specific modal styles */
        @media (max-width: 768px) {
            .modal-content {
                max-height: calc(100vh - 1rem);
                max-height: calc(var(--vh, 1vh) * 100 - 1rem);
                margin: 0.5rem;
                border-radius: 1rem 1rem 0 0;
            }

            /* Bottom sheet style on mobile */
            .modal-container {
                align-items: flex-end;
            }
        }
    `;

    if (!document.getElementById('modal-scroll-fix')) {
        document.head.appendChild(style);
    }

    // Add/remove body class when modal opens/closes
    observeModalState();
}

/**
 * Observe modal state and toggle body scroll lock
 */
function observeModalState() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const hasModal = document.querySelector('[class*="modal"]');
                if (hasModal && hasModal.style.display !== 'none') {
                    document.body.classList.add('modal-open');
                } else {
                    document.body.classList.remove('modal-open');
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Fix chart overflow on mobile
 */
function fixChartOverflow() {
    const style = document.createElement('style');
    style.id = 'chart-overflow-fix';
    style.textContent = `
        /* Chart container fixes */
        .recharts-wrapper,
        .recharts-surface,
        [class*="chart"] {
            max-width: 100% !important;
            overflow: visible !important;
        }

        /* Ensure chart containers are responsive */
        .recharts-responsive-container {
            width: 100% !important;
            min-width: 0 !important;
        }

        /* Chart parent containers */
        [class*="chart-container"] {
            max-width: 100%;
            overflow-x: auto;
            overflow-y: visible;
            -webkit-overflow-scrolling: touch;
        }

        /* Mobile chart adjustments */
        @media (max-width: 768px) {
            .recharts-wrapper {
                font-size: 12px;
            }

            /* Smaller chart heights on mobile */
            .recharts-responsive-container {
                min-height: 250px !important;
                max-height: 350px !important;
            }

            /* Hide chart legends on very small screens */
            @media (max-width: 480px) {
                .recharts-legend-wrapper {
                    font-size: 10px;
                }
            }
        }
    `;

    if (!document.getElementById('chart-overflow-fix')) {
        document.head.appendChild(style);
    }

    // Watch for dynamically added charts
    watchForCharts();
}

/**
 * Watch for dynamically added charts and ensure they're responsive
 */
function watchForCharts() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const charts = document.querySelectorAll('.recharts-wrapper');
                charts.forEach(chart => {
                    const parent = chart.parentElement;
                    if (parent && !parent.classList.contains('chart-container-fixed')) {
                        parent.style.maxWidth = '100%';
                        parent.style.overflowX = 'auto';
                        parent.classList.add('chart-container-fixed');
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Enforce minimum touch target sizes (44x44px)
 */
function enforceTouchTargetSizes() {
    const style = document.createElement('style');
    style.id = 'touch-target-fix';
    style.textContent = `
        /* Minimum touch target sizes */
        button,
        a,
        input[type="button"],
        input[type="submit"],
        input[type="reset"],
        .btn,
        .clickable,
        [onclick],
        [role="button"] {
            min-width: 44px;
            min-height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        /* Radio buttons and checkboxes */
        input[type="radio"],
        input[type="checkbox"] {
            min-width: 24px;
            min-height: 24px;
            cursor: pointer;
        }

        /* Ensure labels are tappable too */
        label {
            cursor: pointer;
            min-height: 44px;
            display: flex;
            align-items: center;
        }

        /* Icon-only buttons */
        button:empty,
        button > svg:only-child,
        a > svg:only-child {
            padding: 12px;
            min-width: 44px;
            min-height: 44px;
        }

        /* Range sliders */
        input[type="range"] {
            min-height: 44px;
            cursor: pointer;
        }

        /* Increase tap area for small elements */
        .tap-area-expand {
            position: relative;
        }

        .tap-area-expand::before {
            content: '';
            position: absolute;
            top: -12px;
            left: -12px;
            right: -12px;
            bottom: -12px;
            z-index: -1;
        }
    `;

    if (!document.getElementById('touch-target-fix')) {
        document.head.appendChild(style);
    }
}

/**
 * Fix iOS fixed positioning issues
 * iOS Safari has issues with position: fixed when keyboard is open
 */
function fixIOSFixedPositioning() {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

    if (isIOS) {
        const style = document.createElement('style');
        style.id = 'ios-fixed-position-fix';
        style.textContent = `
            /* iOS fixed positioning fixes */
            .sticky,
            .fixed {
                -webkit-transform: translateZ(0);
                transform: translateZ(0);
            }

            /* Prevent fixed elements from jumping when keyboard opens */
            @supports (-webkit-overflow-scrolling: touch) {
                .fixed {
                    position: -webkit-sticky;
                    position: sticky;
                }

                /* Keep header sticky on iOS */
                header.sticky,
                header.fixed {
                    position: -webkit-sticky;
                    position: sticky;
                    top: 0;
                    z-index: 50;
                }
            }
        `;

        if (!document.getElementById('ios-fixed-position-fix')) {
            document.head.appendChild(style);
        }

        // Handle input focus/blur to adjust fixed elements
        handleIOSKeyboard();
    }
}

/**
 * Handle iOS keyboard show/hide events
 */
function handleIOSKeyboard() {
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            // Hide fixed elements when keyboard opens
            const fixedElements = document.querySelectorAll('.fixed, .sticky');
            fixedElements.forEach(el => {
                el.style.position = 'absolute';
            });
        });

        input.addEventListener('blur', () => {
            // Restore fixed elements when keyboard closes
            setTimeout(() => {
                const fixedElements = document.querySelectorAll('.fixed, .sticky');
                fixedElements.forEach(el => {
                    el.style.position = '';
                });
            }, 300);
        });
    });
}

/**
 * Handle orientation change
 */
function handleOrientationChange() {
    window.addEventListener('orientationchange', () => {
        // Recalculate viewport height
        setTimeout(() => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);

            // Trigger re-layout of charts
            const charts = document.querySelectorAll('.recharts-wrapper');
            charts.forEach(chart => {
                const event = new Event('resize');
                window.dispatchEvent(event);
            });
        }, 100);
    });
}

/**
 * Add mobile-specific responsive utilities
 */
function addMobileResponsiveStyles() {
    const style = document.createElement('style');
    style.id = 'mobile-responsive-utilities';
    style.textContent = `
        /* Mobile-first responsive utilities */

        /* Prevent text from being too small */
        @media (max-width: 640px) {
            body {
                font-size: 16px;
            }

            h1 { font-size: 1.75rem; }
            h2 { font-size: 1.5rem; }
            h3 { font-size: 1.25rem; }
            h4 { font-size: 1.125rem; }
            h5 { font-size: 1rem; }
            h6 { font-size: 0.875rem; }
        }

        /* Stack elements vertically on mobile */
        @media (max-width: 768px) {
            .grid,
            .flex {
                flex-direction: column;
            }

            .md\\:grid-cols-2,
            .md\\:grid-cols-3,
            .md\\:grid-cols-4 {
                grid-template-columns: 1fr !important;
            }

            /* Full width on mobile */
            .md\\:w-1\\/2,
            .md\\:w-1\\/3,
            .md\\:w-1\\/4 {
                width: 100% !important;
            }
        }

        /* Increase spacing on mobile for easier tapping */
        @media (max-width: 640px) {
            .space-x-2 > * + *,
            .space-y-2 > * + * {
                margin-left: 0.75rem !important;
                margin-top: 0.75rem !important;
            }

            .gap-2 {
                gap: 0.75rem !important;
            }
        }

        /* Mobile padding adjustments */
        @media (max-width: 640px) {
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
            .p-8 { padding: 1.5rem; }
        }

        /* Hide scrollbars on mobile but keep functionality */
        @media (max-width: 768px) {
            ::-webkit-scrollbar {
                width: 0;
                height: 0;
            }

            * {
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
        }
    `;

    if (!document.getElementById('mobile-responsive-utilities')) {
        document.head.appendChild(style);
    }
}

/**
 * Debug mode - show viewport dimensions
 */
function enableMobileDebug() {
    if (window.location.search.includes('debug=mobile')) {
        const debugDiv = document.createElement('div');
        debugDiv.id = 'mobile-debug';
        debugDiv.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            font-size: 12px;
            z-index: 99999;
            border-radius: 5px;
            font-family: monospace;
        `;

        function updateDebug() {
            debugDiv.innerHTML = `
                <div>Viewport: ${window.innerWidth}x${window.innerHeight}</div>
                <div>Screen: ${screen.width}x${screen.height}</div>
                <div>Device Pixel Ratio: ${window.devicePixelRatio}</div>
                <div>Orientation: ${screen.orientation ? screen.orientation.type : 'unknown'}</div>
                <div>User Agent: ${navigator.userAgent.substring(0, 30)}...</div>
            `;
        }

        document.body.appendChild(debugDiv);
        updateDebug();

        window.addEventListener('resize', updateDebug);
        window.addEventListener('orientationchange', updateDebug);
    }
}

/**
 * Initialize on DOM ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initMobileFixes();
        addMobileResponsiveStyles();
        enableMobileDebug();
    });
} else {
    initMobileFixes();
    addMobileResponsiveStyles();
    enableMobileDebug();
}
