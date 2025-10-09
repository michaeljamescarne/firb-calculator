/**
 * Enhanced UI/UX Design System
 * Inspired by modern design principles for professional, consistent styling
 */

/**
 * Enhanced Design System with Professional Spacing and Layout
 */
function initializeEnhancedDesignSystem() {
    if (document.getElementById('enhanced-design-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'enhanced-design-styles';
    style.textContent = `
        /* Enhanced Design System - Professional Spacing & Layout */
        
        /* ===== SPACING SYSTEM ===== */
        :root {
            --spacing-xs: 0.5rem;    /* 8px */
            --spacing-sm: 1rem;      /* 16px */
            --spacing-md: 1.5rem;    /* 24px */
            --spacing-lg: 2rem;      /* 32px */
            --spacing-xl: 3rem;      /* 48px */
            --spacing-2xl: 4rem;     /* 64px */
            --spacing-3xl: 6rem;     /* 96px */
            --spacing-4xl: 8rem;     /* 128px */
            
            /* Section Spacing */
            --section-padding: 5rem;
            --section-gap: 2rem;
            
            /* Card Spacing */
            --card-padding: 2rem;
            --card-gap: 1.5rem;
            --card-border-radius: 1rem;
            
            /* Border System */
            --border-width: 1px;
            --border-color: #e5e7eb;
            --border-color-light: #f3f4f6;
            --border-color-dark: #d1d5db;
        }
        
        /* ===== SECTION IMPROVEMENTS ===== */
        
        /* Enhanced Section Spacing */
        .section-enhanced {
            padding: var(--section-padding) 0;
            margin-bottom: var(--section-gap);
        }
        
        .section-enhanced:last-child {
            margin-bottom: 0;
        }
        
        /* Section Borders and Separation */
        .section-bordered {
            border-top: var(--border-width) solid var(--border-color-light);
            padding-top: var(--spacing-2xl);
        }
        
        .section-bordered:first-child {
            border-top: none;
            padding-top: 0;
        }
        
        /* ===== CARD SYSTEM ===== */
        
        /* Professional Card Design */
        .card-enhanced {
            background: white;
            border: var(--border-width) solid var(--border-color);
            border-radius: var(--card-border-radius);
            padding: var(--card-padding);
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
        }
        
        .card-enhanced:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            transform: translateY(-2px);
        }
        
        /* Card Grid with Enhanced Spacing */
        .card-grid-enhanced {
            display: grid;
            gap: var(--card-gap);
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        
        .card-grid-enhanced.grid-cols-2 {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .card-grid-enhanced.grid-cols-3 {
            grid-template-columns: repeat(3, 1fr);
        }
        
        /* ===== HOME PAGE IMPROVEMENTS ===== */
        
        /* Hero Section Enhancement */
        .hero-section-enhanced {
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
            padding: var(--spacing-4xl) 0;
            position: relative;
            overflow: hidden;
        }
        
        .hero-section-enhanced::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23e2e8f0" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
        }
        
        .hero-container-enhanced {
            max-width: 80rem;
            margin: 0 auto;
            padding: 0 var(--spacing-md);
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-3xl);
            align-items: center;
            position: relative;
            z-index: 1;
        }
        
        /* Information Cards with Borders */
        .info-card-enhanced {
            background: white;
            border: var(--border-width) solid var(--border-color);
            border-radius: var(--card-border-radius);
            padding: var(--card-padding);
            margin-bottom: var(--spacing-lg);
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        
        .info-card-enhanced:last-child {
            margin-bottom: 0;
        }
        
        .info-card-enhanced h3 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: var(--spacing-sm);
            padding-bottom: var(--spacing-sm);
            border-bottom: var(--border-width) solid var(--border-color-light);
        }
        
        .info-card-enhanced p {
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: var(--spacing-sm);
        }
        
        .info-card-enhanced ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .info-card-enhanced li {
            padding: var(--spacing-xs) 0;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }
        
        .info-card-enhanced li::before {
            content: '✓';
            color: #10b981;
            font-weight: bold;
            font-size: 0.875rem;
        }
        
        /* ===== POPULAR FAQS ENHANCEMENT ===== */
        
        .popular-faqs-enhanced {
            padding: var(--spacing-3xl) 0;
        }
        
        .popular-faqs-enhanced .faq-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: var(--spacing-xl);
            margin-bottom: var(--spacing-2xl);
        }
        
        .faq-card-enhanced {
            background: white;
            border: var(--border-width) solid var(--border-color);
            border-radius: var(--card-border-radius);
            padding: var(--card-padding);
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .faq-card-enhanced::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #1d4ed8);
        }
        
        .faq-card-enhanced:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            transform: translateY(-4px);
            border-color: #3b82f6;
        }
        
        .faq-card-enhanced .faq-header {
            display: flex;
            align-items: flex-start;
            gap: var(--spacing-sm);
            margin-bottom: var(--spacing-md);
        }
        
        .faq-card-enhanced .faq-icon {
            width: 2rem;
            height: 2rem;
            background: #eff6ff;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 0.125rem;
        }
        
        .faq-card-enhanced .faq-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
            line-height: 1.4;
            margin: 0;
        }
        
        .faq-card-enhanced .faq-preview {
            color: #6b7280;
            font-size: 0.875rem;
            line-height: 1.5;
            margin-bottom: var(--spacing-md);
        }
        
        .faq-card-enhanced .faq-link {
            color: #3b82f6;
            font-size: 0.875rem;
            font-weight: 500;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: var(--spacing-xs);
            transition: color 0.2s ease;
        }
        
        .faq-card-enhanced .faq-link:hover {
            color: #1d4ed8;
        }
        
        /* ===== FOOTER ENHANCEMENT ===== */
        
        .footer-enhanced {
            background: #111827;
            color: white;
            padding: var(--spacing-3xl) 0 var(--spacing-xl);
        }
        
        .footer-enhanced .footer-container {
            max-width: 80rem;
            margin: 0 auto;
            padding: 0 var(--spacing-md);
        }
        
        .footer-enhanced .footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--spacing-2xl);
            margin-bottom: var(--spacing-2xl);
        }
        
        .footer-enhanced .footer-section {
            display: flex;
            flex-direction: column;
        }
        
        .footer-enhanced .footer-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: white;
            margin-bottom: var(--spacing-md);
            padding-bottom: var(--spacing-sm);
            border-bottom: 2px solid #374151;
        }
        
        .footer-enhanced .footer-description {
            color: #9ca3af;
            font-size: 0.875rem;
            line-height: 1.5;
            margin-bottom: var(--spacing-md);
        }
        
        .footer-enhanced .footer-links {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
        }
        
        .footer-enhanced .footer-link {
            color: #9ca3af;
            text-decoration: none;
            font-size: 0.875rem;
            padding: var(--spacing-xs) 0;
            transition: color 0.2s ease;
            border-bottom: 1px solid transparent;
        }
        
        .footer-enhanced .footer-link:hover {
            color: white;
            border-bottom-color: #3b82f6;
        }
        
        .footer-enhanced .footer-bottom {
            border-top: 1px solid #374151;
            padding-top: var(--spacing-lg);
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
        }
        
        /* ===== RESPONSIVE DESIGN ===== */
        
        @media (max-width: 768px) {
            :root {
                --section-padding: 3rem;
                --card-padding: 1.5rem;
                --spacing-3xl: 4rem;
                --spacing-4xl: 5rem;
            }
            
            .hero-container-enhanced {
                grid-template-columns: 1fr;
                gap: var(--spacing-xl);
                text-align: center;
            }
            
            .popular-faqs-enhanced .faq-grid {
                grid-template-columns: 1fr;
                gap: var(--spacing-lg);
            }
            
            .footer-enhanced .footer-grid {
                grid-template-columns: 1fr;
                gap: var(--spacing-lg);
            }
            
            .card-grid-enhanced {
                grid-template-columns: 1fr;
            }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
            .card-grid-enhanced.grid-cols-3 {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .popular-faqs-enhanced .faq-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        /* ===== ACCESSIBILITY ===== */
        
        .card-enhanced:focus-within {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }
        
        .faq-card-enhanced:focus-within {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }
        
        /* ===== ANIMATIONS ===== */
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .card-enhanced {
            animation: fadeInUp 0.6s ease-out;
        }
        
        .faq-card-enhanced {
            animation: fadeInUp 0.6s ease-out;
        }
        
        .faq-card-enhanced:nth-child(2) {
            animation-delay: 0.1s;
        }
        
        .faq-card-enhanced:nth-child(3) {
            animation-delay: 0.2s;
        }
        
        .faq-card-enhanced:nth-child(4) {
            animation-delay: 0.3s;
        }
        
        .faq-card-enhanced:nth-child(5) {
            animation-delay: 0.4s;
        }
        
        .faq-card-enhanced:nth-child(6) {
            animation-delay: 0.5s;
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize enhanced design system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedDesignSystem);
} else {
    initializeEnhancedDesignSystem();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeEnhancedDesignSystem
    };
}
