/**
 * Mobile Optimization System
 * Handles mobile-specific features: swipe gestures, native share, PWA, lazy loading,
 * responsive navigation, and touch optimizations
 */

// Mobile state management
let mobileState = {
    isMobile: false,
    isTablet: false,
    isIOS: false,
    isAndroid: false,
    isPWA: false,
    touchStartX: 0,
    touchStartY: 0,
    swipeThreshold: 50,
    deferredPrompt: null
};

/**
 * Initialize mobile optimizations
 */
function initMobileOptimizations() {
    detectDevice();
    initSwipeGestures();
    initPullToRefresh();
    initNativeShare();
    initPWA();
    initLazyLoading();
    initMobileNavigation();
    initFloatingActionButton();
    optimizeTouchTargets();

    console.log('Mobile optimizations initialized:', mobileState);
}

/**
 * Detect device type and capabilities
 */
function detectDevice() {
    const ua = navigator.userAgent;

    // Detect mobile
    mobileState.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    // Detect tablet
    mobileState.isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);

    // Detect OS
    mobileState.isIOS = /iPhone|iPad|iPod/.test(ua);
    mobileState.isAndroid = /Android/.test(ua);

    // Detect PWA
    mobileState.isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                        window.navigator.standalone === true;

    // Add device classes to body
    if (mobileState.isMobile) document.body.classList.add('is-mobile');
    if (mobileState.isTablet) document.body.classList.add('is-tablet');
    if (mobileState.isIOS) document.body.classList.add('is-ios');
    if (mobileState.isAndroid) document.body.classList.add('is-android');
    if (mobileState.isPWA) document.body.classList.add('is-pwa');
}

/**
 * Initialize swipe gestures for wizard navigation
 */
function initSwipeGestures() {
    if (!mobileState.isMobile) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
}

function handleTouchStart(e) {
    mobileState.touchStartX = e.touches[0].clientX;
    mobileState.touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
    if (!e.changedTouches) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - mobileState.touchStartX;
    const diffY = touchEndY - mobileState.touchStartY;

    // Only handle horizontal swipes (not vertical scrolling)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > mobileState.swipeThreshold) {
        // Don't interfere with modals or specific elements
        if (e.target.closest('.modal, .carousel, .slider, input, textarea, select')) {
            return;
        }

        if (diffX > 0) {
            // Swipe right (go back)
            handleSwipeRight();
        } else {
            // Swipe left (go forward)
            handleSwipeLeft();
        }
    }
}

function handleSwipeRight() {
    // Go to previous step if on calculator
    if (state.currentStep === 'calculator' && typeof goToStep === 'function') {
        goToStep('eligibilityResult');
    } else if (state.currentStep === 'results' && typeof goToStep === 'function') {
        goToStep('calculator');
    }
}

function handleSwipeLeft() {
    // Could implement forward navigation if needed
    // Currently calculator uses buttons for forward progress
}

/**
 * Initialize pull-to-refresh functionality
 */
function initPullToRefresh() {
    if (!mobileState.isMobile) return;

    let pullStartY = 0;
    let pullMoveY = 0;
    let isPulling = false;
    const pullThreshold = 80;

    document.addEventListener('touchstart', (e) => {
        // Only trigger at top of page
        if (window.scrollY === 0) {
            pullStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (window.scrollY === 0) {
            pullMoveY = e.touches[0].clientY;
            const pullDistance = pullMoveY - pullStartY;

            if (pullDistance > 0 && pullDistance < 150) {
                isPulling = true;
                showPullToRefreshIndicator(pullDistance, pullThreshold);
            }
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        if (isPulling) {
            const pullDistance = pullMoveY - pullStartY;

            if (pullDistance > pullThreshold) {
                refreshPage();
            }

            hidePullToRefreshIndicator();
            isPulling = false;
        }
    }, { passive: true });
}

function showPullToRefreshIndicator(distance, threshold) {
    let indicator = document.getElementById('pull-to-refresh-indicator');

    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'pull-to-refresh-indicator';
        indicator.className = 'fixed top-0 left-0 right-0 flex items-center justify-center bg-blue-500 text-white transition-all';
        indicator.style.height = Math.min(distance, 80) + 'px';
        indicator.style.opacity = Math.min(distance / threshold, 1);
        indicator.innerHTML = `
            <div class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm font-medium">${distance > threshold ? 'Release to refresh' : 'Pull to refresh'}</span>
            </div>
        `;
        document.body.prepend(indicator);
    } else {
        indicator.style.height = Math.min(distance, 80) + 'px';
        indicator.style.opacity = Math.min(distance / threshold, 1);
        indicator.querySelector('span').textContent = distance > threshold ? 'Release to refresh' : 'Pull to refresh';
    }
}

function hidePullToRefreshIndicator() {
    const indicator = document.getElementById('pull-to-refresh-indicator');
    if (indicator) {
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 300);
    }
}

function refreshPage() {
    // Show loading
    const indicator = document.getElementById('pull-to-refresh-indicator');
    if (indicator) {
        indicator.querySelector('span').textContent = 'Refreshing...';
    }

    // Reload page after short delay
    setTimeout(() => {
        window.location.reload();
    }, 500);
}

/**
 * Initialize native share functionality
 */
function initNativeShare() {
    // Make share function globally available
    window.shareResults = shareResults;
}

async function shareResults() {
    if (!state.calculatedFees) {
        alert('Please complete a calculation first.');
        return;
    }

    const shareData = {
        title: 'FIRB Calculator Results',
        text: `My FIRB cost analysis: Total upfront costs of ${formatCurrency(state.calculatedFees.grandTotal)} for a ${state.formData.propertyType} property in ${state.formData.state}. Calculate yours:`,
        url: window.location.href
    };

    // Check if Web Share API is supported
    if (navigator.share) {
        try {
            await navigator.share(shareData);
            console.log('Shared successfully');

            // Track event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    method: 'Web Share API',
                    content_type: 'calculation_results'
                });
            }
        } catch (err) {
            // User cancelled or error occurred
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err);
                fallbackShare(shareData);
            }
        }
    } else {
        // Fallback for browsers without Web Share API
        fallbackShare(shareData);
    }
}

function fallbackShare(shareData) {
    // Show share modal with copy link option
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Share Your Results</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
                    <div class="flex gap-2">
                        <input type="text" readonly value="${window.location.href}" id="share-url"
                            class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                        <button onclick="copyShareLink()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Copy
                        </button>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}"
                        target="_blank" class="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        <span>Facebook</span>
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(window.location.href)}"
                        target="_blank" class="flex items-center justify-center gap-2 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600">
                        <span>Twitter</span>
                    </a>
                </div>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">
                Close
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

window.copyShareLink = function() {
    const input = document.getElementById('share-url');
    input.select();
    document.execCommand('copy');

    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('bg-green-600');
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('bg-green-600');
    }, 2000);
};

/**
 * Initialize Progressive Web App (PWA) functionality
 */
function initPWA() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent default prompt
        e.preventDefault();

        // Store event for later use
        mobileState.deferredPrompt = e;

        // Show install button after user completes calculation
        if (state.calculatedFees) {
            showInstallPrompt();
        }
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
        console.log('PWA installed');
        mobileState.deferredPrompt = null;

        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_installed', {
                event_category: 'engagement'
            });
        }
    });
}

function showInstallPrompt() {
    if (!mobileState.deferredPrompt || mobileState.isPWA) return;

    // Don't show if user dismissed before
    if (localStorage.getItem('pwa_prompt_dismissed')) return;

    const banner = document.createElement('div');
    banner.id = 'install-banner';
    banner.className = 'fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg z-40 transform translate-y-0 transition-transform';
    banner.innerHTML = `
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <div class="text-3xl">📱</div>
                <div>
                    <div class="font-bold">Install FIRB Calculator</div>
                    <div class="text-sm text-blue-100">Quick access anytime, offline support</div>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="installPWA()" class="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Install
                </button>
                <button onclick="dismissInstallPrompt()" class="text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Not Now
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);

    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (document.getElementById('install-banner')) {
            dismissInstallPrompt();
        }
    }, 10000);
}

window.installPWA = async function() {
    if (!mobileState.deferredPrompt) return;

    // Show install prompt
    mobileState.deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await mobileState.deferredPrompt.userChoice;
    console.log(`User ${outcome} the install prompt`);

    // Clear deferred prompt
    mobileState.deferredPrompt = null;

    // Remove banner
    const banner = document.getElementById('install-banner');
    if (banner) banner.remove();
};

window.dismissInstallPrompt = function() {
    const banner = document.getElementById('install-banner');
    if (banner) {
        banner.classList.add('translate-y-full');
        setTimeout(() => banner.remove(), 300);
    }

    // Remember dismissal for this session
    localStorage.setItem('pwa_prompt_dismissed', 'true');
};

/**
 * Initialize lazy loading for images and components
 */
function initLazyLoading() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Lazy load charts (only render when visible)
    if (typeof window.chartObserver === 'undefined') {
        window.chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.dataset.lazyChart) {
                    const chartId = entry.target.dataset.lazyChart;
                    if (typeof window[`init${chartId}Chart`] === 'function') {
                        window[`init${chartId}Chart`]();
                        entry.target.removeAttribute('data-lazy-chart');
                        window.chartObserver.unobserve(entry.target);
                    }
                }
            });
        });
    }
}

/**
 * Initialize mobile navigation
 */
function initMobileNavigation() {
    if (!mobileState.isMobile) return;

    // Add mobile menu toggle to header
    addMobileMenuToggle();

    // Add bottom navigation
    if (state.currentStep === 'results') {
        addBottomNavigation();
    }
}

function addMobileMenuToggle() {
    // This will be called when rendering header
    // See renderMobileHeader() function
}

function addBottomNavigation() {
    // Remove existing bottom nav
    const existing = document.getElementById('bottom-nav');
    if (existing) existing.remove();

    const nav = document.createElement('nav');
    nav.id = 'bottom-nav';
    nav.className = 'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 pb-safe';
    nav.innerHTML = `
        <div class="grid grid-cols-4 h-16">
            <button onclick="goToStep('home')" class="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span class="text-xs text-gray-600">Home</span>
            </button>
            <button onclick="typeof showEmailResultsModal === 'function' && showEmailResultsModal()" class="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span class="text-xs text-gray-600">Email</span>
            </button>
            <button onclick="typeof generateProfessionalPDF === 'function' && generateProfessionalPDF()" class="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="text-xs text-gray-600">PDF</span>
            </button>
            <button onclick="typeof shareResults === 'function' && shareResults()" class="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                <span class="text-xs text-gray-600">Share</span>
            </button>
        </div>
    `;
    document.body.appendChild(nav);

    // Add padding to body to account for bottom nav
    document.body.style.paddingBottom = '4rem';
}

/**
 * Initialize floating action button
 */
function initFloatingActionButton() {
    if (!mobileState.isMobile) return;

    // Only show on results page
    if (state.currentStep !== 'results') return;

    // Remove existing FAB
    const existing = document.getElementById('fab');
    if (existing) existing.remove();

    const fab = document.createElement('button');
    fab.id = 'fab';
    fab.className = 'fixed right-4 bottom-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-40 flex items-center justify-center';
    fab.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
    `;
    fab.onclick = showFABMenu;
    document.body.appendChild(fab);
}

function showFABMenu() {
    const menu = document.createElement('div');
    menu.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end';
    menu.onclick = (e) => {
        if (e.target === menu) menu.remove();
    };

    menu.innerHTML = `
        <div class="bg-white rounded-t-2xl w-full p-6 space-y-3 animate-slide-up">
            <div class="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>

            <button onclick="typeof showSaveScenarioModal === 'function' && showSaveScenarioModal(); this.closest('.fixed').remove();"
                class="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                </svg>
                <div class="text-left">
                    <div class="font-semibold text-gray-900">Save Scenario</div>
                    <div class="text-sm text-gray-600">Save for later comparison</div>
                </div>
            </button>

            <button onclick="typeof showEmailResultsModal === 'function' && showEmailResultsModal(); this.closest('.fixed').remove();"
                class="w-full flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <div class="text-left">
                    <div class="font-semibold text-gray-900">Email Results</div>
                    <div class="text-sm text-gray-600">Get PDF report via email</div>
                </div>
            </button>

            <button onclick="typeof generateProfessionalPDF === 'function' && generateProfessionalPDF(); this.closest('.fixed').remove();"
                class="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <div class="text-left">
                    <div class="font-semibold text-gray-900">Download PDF</div>
                    <div class="text-sm text-gray-600">Professional report</div>
                </div>
            </button>

            <button onclick="typeof shareResults === 'function' && shareResults(); this.closest('.fixed').remove();"
                class="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                <div class="text-left">
                    <div class="font-semibold text-gray-900">Share Results</div>
                    <div class="text-sm text-gray-600">Share with friends</div>
                </div>
            </button>

            <button onclick="this.closest('.fixed').remove()" class="w-full p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-semibold text-gray-700">
                Cancel
            </button>
        </div>
    `;

    document.body.appendChild(menu);
}

/**
 * Optimize touch targets for mobile
 */
function optimizeTouchTargets() {
    if (!mobileState.isMobile) return;

    // Add CSS for minimum touch target sizes
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile touch optimizations */
        @media (max-width: 768px) {
            button, a, input[type="submit"], input[type="button"] {
                min-height: 44px;
                min-width: 44px;
            }

            input[type="checkbox"], input[type="radio"] {
                min-width: 24px;
                min-height: 24px;
            }

            /* Increase spacing for better touch */
            .form-group {
                margin-bottom: 1.5rem;
            }

            /* Make form inputs larger */
            input[type="text"],
            input[type="email"],
            input[type="tel"],
            input[type="number"],
            select,
            textarea {
                min-height: 48px;
                font-size: 16px; /* Prevents zoom on iOS */
            }

            /* Bottom sheet animations */
            .animate-slide-up {
                animation: slideUp 0.3s ease-out;
            }

            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                }
                to {
                    transform: translateY(0);
                }
            }

            /* Safe area for notched devices */
            .pb-safe {
                padding-bottom: env(safe-area-inset-bottom);
            }

            /* Disable pull-to-refresh on iOS */
            body {
                overscroll-behavior-y: contain;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Add mobile-specific styles
 */
function addMobileStyles() {
    const style = document.createElement('style');
    style.id = 'mobile-styles';
    style.textContent = `
        /* Mobile-specific improvements */
        @media (max-width: 768px) {
            /* Stack all grids vertically */
            .grid {
                grid-template-columns: 1fr !important;
            }

            /* Full width modals */
            .modal > div, .fixed > div:not(#bottom-nav):not(#fab) {
                max-width: 100vw !important;
                margin: 0 !important;
                border-radius: 1rem 1rem 0 0 !important;
            }

            /* Collapsible sections are open by default on mobile */
            details[open] summary ~ * {
                animation: slideDown 0.3s ease-out;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Sticky header */
            header {
                position: sticky;
                top: 0;
                z-index: 50;
            }

            /* Reduce padding on mobile */
            .px-4 {
                padding-left: 1rem;
                padding-right: 1rem;
            }

            .py-20 {
                padding-top: 3rem;
                padding-bottom: 3rem;
            }

            /* Make charts full width */
            .recharts-wrapper {
                width: 100% !important;
            }

            /* Bottom spacing for bottom nav */
            main, section {
                padding-bottom: 5rem;
            }
        }

        /* Tablet improvements */
        @media (min-width: 769px) and (max-width: 1024px) {
            .grid-cols-3 {
                grid-template-columns: repeat(2, 1fr) !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initMobileOptimizations();
        addMobileStyles();
    });
} else {
    initMobileOptimizations();
    addMobileStyles();
}

// Export functions
if (typeof window !== 'undefined') {
    window.mobileState = mobileState;
    window.shareResults = shareResults;
    window.installPWA = installPWA;
    window.dismissInstallPrompt = dismissInstallPrompt;
    window.showFABMenu = showFABMenu;
}
