/**
 * Professional Design System for FIRB Calculator
 * Enhanced color palette, typography, and component styles
 */

// Professional color palette
const DESIGN_SYSTEM = {
    colors: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe', 
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a'
        },
        success: {
            50: '#ecfdf5',
            100: '#d1fae5',
            500: '#10b981',
            600: '#059669',
            700: '#047857'
        },
        warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309'
        },
        error: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c'
        },
        neutral: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827'
        }
    },
    typography: {
        fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
        },
        fontSize: {
            'xs': '0.75rem',
            'sm': '0.875rem',
            'base': '1rem',
            'lg': '1.125rem',
            'xl': '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem'
        },
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800'
        }
    },
    spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem'
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    borderRadius: {
        sm: '0.125rem',
        base: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px'
    }
};

/**
 * Apply professional design system to the application
 */
function applyDesignSystem() {
    const style = document.createElement('style');
    style.id = 'design-system-styles';
    style.textContent = `
        /* Professional Design System Styles */
        
        /* Import Inter font */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        /* Root variables */
        :root {
            --color-primary-50: #eff6ff;
            --color-primary-100: #dbeafe;
            --color-primary-500: #3b82f6;
            --color-primary-600: #2563eb;
            --color-primary-700: #1d4ed8;
            --color-success-500: #10b981;
            --color-warning-500: #f59e0b;
            --color-error-500: #ef4444;
            --color-neutral-50: #f9fafb;
            --color-neutral-100: #f3f4f6;
            --color-neutral-500: #6b7280;
            --color-neutral-900: #111827;
        }
        
        /* Enhanced Typography */
        body {
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-weight: 400;
            line-height: 1.6;
            color: var(--color-neutral-900);
        }
        
        h1, h2, h3, h4, h5, h6 {
            font-weight: 700;
            line-height: 1.2;
            color: var(--color-neutral-900);
        }
        
        h1 { font-size: 2.25rem; }
        h2 { font-size: 1.875rem; }
        h3 { font-size: 1.5rem; }
        h4 { font-size: 1.25rem; }
        h5 { font-size: 1.125rem; }
        h6 { font-size: 1rem; }
        
        /* Professional Button Styles */
        .btn-primary {
            background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
            color: white;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            border: none;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }
        
        .btn-primary:active {
            transform: translateY(0);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .btn-secondary {
            background: white;
            color: var(--color-primary-600);
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            border: 2px solid var(--color-primary-200);
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-secondary:hover {
            background: var(--color-primary-50);
            border-color: var(--color-primary-300);
            transform: translateY(-1px);
        }
        
        /* Professional Card Styles */
        .card {
            background: white;
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid var(--color-neutral-100);
            transition: all 0.2s ease;
        }
        
        .card:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            transform: translateY(-2px);
        }
        
        .card-elevated {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        /* Enhanced Form Styles */
        .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid var(--color-neutral-200);
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.2s ease;
            background: white;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--color-primary-500);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-input.error {
            border-color: var(--color-error-500);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .form-input.success {
            border-color: var(--color-success-500);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        
        /* Professional Progress Indicators */
        .progress-bar {
            width: 100%;
            height: 0.5rem;
            background: var(--color-neutral-200);
            border-radius: 0.25rem;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600));
            border-radius: 0.25rem;
            transition: width 0.3s ease;
        }
        
        /* Enhanced Alert Styles */
        .alert {
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            border: 1px solid;
            margin: 1rem 0;
        }
        
        .alert-success {
            background: var(--color-success-50);
            border-color: var(--color-success-200);
            color: var(--color-success-700);
        }
        
        .alert-warning {
            background: var(--color-warning-50);
            border-color: var(--color-warning-200);
            color: var(--color-warning-700);
        }
        
        .alert-error {
            background: var(--color-error-50);
            border-color: var(--color-error-200);
            color: var(--color-error-700);
        }
        
        .alert-info {
            background: var(--color-primary-50);
            border-color: var(--color-primary-200);
            color: var(--color-primary-700);
        }
        
        /* Professional Loading States */
        .loading-spinner {
            width: 1.5rem;
            height: 1.5rem;
            border: 2px solid var(--color-neutral-200);
            border-top: 2px solid var(--color-primary-500);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Skeleton Loading */
        .skeleton {
            background: linear-gradient(90deg, var(--color-neutral-200) 25%, var(--color-neutral-100) 50%, var(--color-neutral-200) 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        /* Professional Gradients */
        .gradient-primary {
            background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
        }
        
        .gradient-success {
            background: linear-gradient(135deg, var(--color-success-500), var(--color-success-600));
        }
        
        .gradient-warning {
            background: linear-gradient(135deg, var(--color-warning-500), var(--color-warning-600));
        }
        
        /* Enhanced Spacing */
        .space-y-4 > * + * {
            margin-top: 1rem;
        }
        
        .space-y-6 > * + * {
            margin-top: 1.5rem;
        }
        
        .space-y-8 > * + * {
            margin-top: 2rem;
        }
        
        /* Professional Shadows */
        .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
        
        /* Responsive Design Enhancements */
        @media (max-width: 768px) {
            .card {
                margin: 0.5rem;
                border-radius: 0.75rem;
            }
            
            .btn-primary, .btn-secondary {
                width: 100%;
                justify-content: center;
            }
            
            h1 { font-size: 1.875rem; }
            h2 { font-size: 1.5rem; }
            h3 { font-size: 1.25rem; }
        }
        
        /* Dark mode support (future enhancement) */
        @media (prefers-color-scheme: dark) {
            :root {
                --color-neutral-50: #1f2937;
                --color-neutral-100: #374151;
                --color-neutral-900: #f9fafb;
            }
        }
        
        /* Hero Section Styles */
        .hero-section {
            background: linear-gradient(135deg, var(--color-primary-50) 0%, white 50%, var(--color-primary-50) 100%);
            padding: 4rem 0;
            position: relative;
            overflow: hidden;
        }
        
        .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23e5e7eb" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
        }
        
        .hero-container {
            max-width: 80rem;
            margin: 0 auto;
            padding: 0 1rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
            position: relative;
            z-index: 1;
        }
        
        .hero-content {
            text-align: left;
        }
        
        .hero-title {
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1.1;
            color: var(--color-neutral-900);
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .hero-subtitle {
            font-size: 1.25rem;
            color: var(--color-neutral-600);
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .hero-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .btn-large {
            padding: 1rem 2rem;
            font-size: 1.125rem;
            font-weight: 600;
        }
        
        .hero-visual {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .hero-card {
            background: white;
            border-radius: 1.5rem;
            padding: 2rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid var(--color-neutral-100);
            transform: rotate(3deg);
            transition: all 0.3s ease;
        }
        
        .hero-card:hover {
            transform: rotate(0deg) scale(1.05);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .card-icon {
            width: 4rem;
            height: 4rem;
            background: var(--color-primary-100);
            border-radius: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
        }
        
        .card-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--color-neutral-900);
            margin-bottom: 0.75rem;
        }
        
        .card-description {
            color: var(--color-neutral-600);
            line-height: 1.5;
        }
        
        /* Mobile Responsive Hero */
        @media (max-width: 768px) {
            .hero-section {
                padding: 2rem 0;
            }
            
            .hero-container {
                grid-template-columns: 1fr;
                gap: 2rem;
                text-align: center;
            }
            
            .hero-content {
                text-align: center;
            }
            
            .hero-title {
                font-size: 2.5rem;
            }
            
            .hero-subtitle {
                font-size: 1.125rem;
            }
            
            .hero-actions {
                justify-content: center;
            }
            
            .hero-card {
                transform: none;
                margin: 0 auto;
            }
            
            .hero-card:hover {
                transform: scale(1.02);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize design system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDesignSystem);
} else {
    applyDesignSystem();
}
