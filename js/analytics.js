/**
 * Analytics and Conversion Tracking System
 * Provides comprehensive tracking for SEO, SEM, and conversion optimization
 */

/**
 * Google Analytics 4 Configuration
 */
const GA_CONFIG = {
    measurementId: 'G-XXXXXXXXXX', // Replace with actual GA4 measurement ID
    config: {
        page_title: 'FIRB Calculator',
        page_location: window.location.href,
        custom_map: {
            'custom_parameter_1': 'calculator_usage',
            'custom_parameter_2': 'faq_engagement',
            'custom_parameter_3': 'conversion_funnel'
        }
    }
};

/**
 * Conversion Events Configuration
 */
const CONVERSION_EVENTS = {
    // Calculator Events
    calculatorStarted: {
        event_name: 'calculator_started',
        parameters: {
            step: 'eligibility',
            user_type: 'unknown'
        }
    },
    calculatorCompleted: {
        event_name: 'calculator_completed',
        parameters: {
            property_value: null,
            state: null,
            total_cost: null
        }
    },
    
    // FAQ Events
    faqViewed: {
        event_name: 'faq_viewed',
        parameters: {
            question_id: null,
            category: null,
            helpful: null
        }
    },
    faqSearched: {
        event_name: 'faq_searched',
        parameters: {
            search_term: null,
            results_count: null
        }
    },
    
    // Engagement Events
    pageViewed: {
        event_name: 'page_view',
        parameters: {
            page_title: null,
            page_location: null,
            page_path: null
        }
    },
    timeOnPage: {
        event_name: 'engagement_time_msec',
        parameters: {
            engagement_time_msec: null
        }
    },
    
    // Conversion Events
    pdfExported: {
        event_name: 'pdf_exported',
        parameters: {
            export_type: 'results',
            file_size: null
        }
    },
    emailSent: {
        event_name: 'email_sent',
        parameters: {
            email_type: 'results',
            recipient_count: 1
        }
    },
    scenarioSaved: {
        event_name: 'scenario_saved',
        parameters: {
            scenario_name: null,
            property_value: null
        }
    }
};

/**
 * Initialize Google Analytics 4
 */
function initializeGoogleAnalytics() {
    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_CONFIG.measurementId}`;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_CONFIG.measurementId, GA_CONFIG.config);
    
    console.log('Google Analytics 4 initialized');
}

/**
 * Track conversion event
 * @param {string} eventName - Name of the event
 * @param {Object} parameters - Event parameters
 */
function trackConversionEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
        console.log(`Conversion event tracked: ${eventName}`, parameters);
    } else {
        console.warn('Google Analytics not initialized');
    }
}

/**
 * Track calculator usage
 * @param {string} action - Action taken (started, completed, step_changed)
 * @param {Object} data - Additional data
 */
function trackCalculatorUsage(action, data = {}) {
    const eventMap = {
        'started': 'calculator_started',
        'completed': 'calculator_completed',
        'step_changed': 'calculator_step_changed',
        'error': 'calculator_error'
    };
    
    const eventName = eventMap[action] || 'calculator_action';
    const parameters = {
        action: action,
        ...data,
        timestamp: new Date().toISOString()
    };
    
    trackConversionEvent(eventName, parameters);
}

/**
 * Track FAQ engagement
 * @param {string} action - Action taken (viewed, searched, helpful, not_helpful)
 * @param {Object} data - Additional data
 */
function trackFAQEngagement(action, data = {}) {
    const eventMap = {
        'viewed': 'faq_viewed',
        'searched': 'faq_searched',
        'helpful': 'faq_helpful',
        'not_helpful': 'faq_not_helpful',
        'shared': 'faq_shared'
    };
    
    const eventName = eventMap[action] || 'faq_action';
    const parameters = {
        action: action,
        ...data,
        timestamp: new Date().toISOString()
    };
    
    trackConversionEvent(eventName, parameters);
}

/**
 * Track page performance metrics
 */
function trackPerformanceMetrics() {
    // Track Core Web Vitals
    if ('web-vital' in window) {
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                trackConversionEvent('web_vital_lcp', {
                    value: Math.round(entry.startTime),
                    metric_name: 'LCP'
                });
            }
        }).observe({entryTypes: ['largest-contentful-paint']});
        
        // First Input Delay
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                trackConversionEvent('web_vital_fid', {
                    value: Math.round(entry.processingStart - entry.startTime),
                    metric_name: 'FID'
                });
            }
        }).observe({entryTypes: ['first-input']});
        
        // Cumulative Layout Shift
        new PerformanceObserver((entryList) => {
            let clsValue = 0;
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            trackConversionEvent('web_vital_cls', {
                value: Math.round(clsValue * 1000) / 1000,
                metric_name: 'CLS'
            });
        }).observe({entryTypes: ['layout-shift']});
    }
}

/**
 * Track user journey and funnel
 */
function trackUserJourney() {
    const journey = {
        entry_point: document.referrer || 'direct',
        landing_page: window.location.pathname,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: new Date().toISOString()
    };
    
    // Store in session storage for funnel tracking
    sessionStorage.setItem('user_journey', JSON.stringify(journey));
    
    trackConversionEvent('user_journey_started', journey);
}

/**
 * Track conversion funnel steps
 * @param {string} step - Funnel step name
 * @param {Object} data - Step data
 */
function trackFunnelStep(step, data = {}) {
    const funnelSteps = [
        'landing',
        'calculator_started',
        'eligibility_completed',
        'property_details_entered',
        'calculation_completed',
        'results_viewed',
        'pdf_exported',
        'email_sent'
    ];
    
    const stepIndex = funnelSteps.indexOf(step);
    const parameters = {
        funnel_step: step,
        step_index: stepIndex,
        step_name: step.replace(/_/g, ' '),
        ...data,
        timestamp: new Date().toISOString()
    };
    
    trackConversionEvent('funnel_step', parameters);
}

/**
 * Track search engine optimization metrics
 */
function trackSEOMetrics() {
    // Track organic search traffic
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    
    if (utmSource || document.referrer.includes('google') || document.referrer.includes('bing')) {
        trackConversionEvent('seo_traffic', {
            traffic_source: utmSource || 'organic',
            medium: utmMedium || 'search',
            campaign: utmCampaign || 'organic',
            referrer: document.referrer,
            search_keywords: urlParams.get('q') || 'unknown'
        });
    }
    
    // Track page load performance
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        trackConversionEvent('page_load_time', {
            load_time_ms: loadTime,
            page_url: window.location.href
        });
    });
}

/**
 * Track mobile-specific metrics
 */
function trackMobileMetrics() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        trackConversionEvent('mobile_usage', {
            device_type: 'mobile',
            user_agent: navigator.userAgent,
            touch_support: 'ontouchstart' in window,
            orientation: screen.orientation ? screen.orientation.type : 'unknown'
        });
    }
}

/**
 * Enhanced ecommerce tracking for calculator results
 * @param {Object} calculationData - Calculator results data
 */
function trackEcommerceCalculation(calculationData) {
    const ecommerceData = {
        transaction_id: `calc_${Date.now()}`,
        value: calculationData.totalCost || 0,
        currency: 'AUD',
        items: [
            {
                item_id: 'firb_fee',
                item_name: 'FIRB Application Fee',
                category: 'Government Fees',
                quantity: 1,
                price: calculationData.firbFee || 0
            },
            {
                item_id: 'stamp_duty_surcharge',
                item_name: 'Stamp Duty Surcharge',
                category: 'Government Fees',
                quantity: 1,
                price: calculationData.stampDutySurcharge || 0
            },
            {
                item_id: 'land_tax_surcharge',
                item_name: 'Land Tax Surcharge',
                category: 'Government Fees',
                quantity: 1,
                price: calculationData.landTaxSurcharge || 0
            }
        ]
    };
    
    trackConversionEvent('purchase', ecommerceData);
}

/**
 * Initialize all analytics tracking
 */
function initializeAnalytics() {
    // Initialize Google Analytics
    initializeGoogleAnalytics();
    
    // Track initial user journey
    trackUserJourney();
    
    // Track SEO metrics
    trackSEOMetrics();
    
    // Track mobile metrics
    trackMobileMetrics();
    
    // Track performance metrics
    trackPerformanceMetrics();
    
    console.log('Analytics system initialized');
}

/**
 * A/B Testing Framework
 */
const AB_TESTING = {
    tests: {
        'hero_cta_button': {
            variants: ['primary', 'secondary'],
            current: 'primary'
        },
        'faq_layout': {
            variants: ['accordion', 'cards'],
            current: 'accordion'
        }
    },
    
    trackVariant: function(testName, variant, conversion) {
        trackConversionEvent('ab_test', {
            test_name: testName,
            variant: variant,
            conversion: conversion,
            timestamp: new Date().toISOString()
        });
    }
};

// Initialize analytics when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalytics);
} else {
    initializeAnalytics();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        trackConversionEvent,
        trackCalculatorUsage,
        trackFAQEngagement,
        trackFunnelStep,
        trackEcommerceCalculation,
        AB_TESTING
    };
}
