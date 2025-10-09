/**
 * Enhanced Progress Indicators and Navigation System
 * Provides clear visual feedback for user progress through multi-step flows
 */

/**
 * Progress indicator component for multi-step processes
 * @param {Object} config - Configuration object
 * @param {Array} config.steps - Array of step objects with {id, title, description, status}
 * @param {number} config.currentStep - Current step index (0-based)
 * @param {boolean} config.showDescriptions - Whether to show step descriptions
 * @returns {string} HTML string for progress indicator
 */
function renderProgressIndicator(config = {}) {
    const { steps = [], currentStep = 0, showDescriptions = true } = config;
    
    if (!steps.length) return '';
    
    return `
        <div class="progress-indicator">
            <div class="progress-bar mb-8">
                <div class="progress-fill" style="width: ${((currentStep + 1) / steps.length) * 100}%"></div>
            </div>
            
            <div class="steps-container">
                ${steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isPending = index > currentStep;
                    
                    return `
                        <div class="step-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isPending ? 'pending' : ''}">
                            <div class="step-circle">
                                ${isCompleted ? 
                                    '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>' :
                                    `<span class="step-number">${index + 1}</span>`
                                }
                            </div>
                            <div class="step-content">
                                <h3 class="step-title">${step.title}</h3>
                                ${showDescriptions && step.description ? `<p class="step-description">${step.description}</p>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * Breadcrumb navigation component
 * @param {Array} breadcrumbs - Array of breadcrumb objects with {label, href, active}
 * @returns {string} HTML string for breadcrumb navigation
 */
function renderBreadcrumbs(breadcrumbs = []) {
    if (!breadcrumbs.length) return '';
    
    return `
        <nav class="breadcrumb-nav" aria-label="Breadcrumb">
            <ol class="breadcrumb-list">
                ${breadcrumbs.map((crumb, index) => `
                    <li class="breadcrumb-item ${crumb.active ? 'active' : ''}">
                        ${crumb.href && !crumb.active ? 
                            `<a href="${crumb.href}" class="breadcrumb-link">${crumb.label}</a>` :
                            `<span class="breadcrumb-current">${crumb.label}</span>`
                        }
                        ${index < breadcrumbs.length - 1 ? 
                            '<svg class="breadcrumb-separator" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>' :
                            ''
                        }
                    </li>
                `).join('')}
            </ol>
        </nav>
    `;
}

/**
 * Step navigation component with previous/next buttons
 * @param {Object} config - Configuration object
 * @param {Function} config.onPrevious - Previous step handler
 * @param {Function} config.onNext - Next step handler
 * @param {boolean} config.canGoPrevious - Whether previous button should be enabled
 * @param {boolean} config.canGoNext - Whether next button should be enabled
 * @param {string} config.previousText - Text for previous button
 * @param {string} config.nextText - Text for next button
 * @returns {string} HTML string for step navigation
 */
function renderStepNavigation(config = {}) {
    const {
        onPrevious = () => {},
        onNext = () => {},
        canGoPrevious = true,
        canGoNext = true,
        previousText = 'Previous',
        nextText = 'Next'
    } = config;
    
    return `
        <div class="step-navigation">
            <div class="nav-buttons">
                <button 
                    class="btn-secondary ${!canGoPrevious ? 'disabled' : ''}" 
                    onclick="${canGoPrevious ? onPrevious.toString() : ''}"
                    ${!canGoPrevious ? 'disabled' : ''}
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    ${previousText}
                </button>
                
                <button 
                    class="btn-primary ${!canGoNext ? 'disabled' : ''}" 
                    onclick="${canGoNext ? onNext.toString() : ''}"
                    ${!canGoNext ? 'disabled' : ''}
                >
                    ${nextText}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

/**
 * Add progress indicator styles
 */
function addProgressIndicatorStyles() {
    if (document.getElementById('progress-indicator-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'progress-indicator-styles';
    style.textContent = `
        /* Progress Indicator Styles */
        .progress-indicator {
            margin: 2rem 0;
        }
        
        .steps-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            position: relative;
            margin-top: 2rem;
        }
        
        .steps-container::before {
            content: '';
            position: absolute;
            top: 1.5rem;
            left: 1.5rem;
            right: 1.5rem;
            height: 2px;
            background: var(--color-neutral-200);
            z-index: 1;
        }
        
        .step-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            z-index: 2;
            flex: 1;
        }
        
        .step-circle {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-bottom: 0.75rem;
            transition: all 0.3s ease;
        }
        
        .step-item.completed .step-circle {
            background: var(--color-success-500);
            color: white;
            box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
        }
        
        .step-item.current .step-circle {
            background: var(--color-primary-500);
            color: white;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
            transform: scale(1.1);
        }
        
        .step-item.pending .step-circle {
            background: var(--color-neutral-200);
            color: var(--color-neutral-500);
        }
        
        .step-number {
            font-size: 1rem;
            font-weight: 600;
        }
        
        .step-content {
            max-width: 8rem;
        }
        
        .step-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--color-neutral-900);
            margin-bottom: 0.25rem;
        }
        
        .step-description {
            font-size: 0.75rem;
            color: var(--color-neutral-500);
            line-height: 1.4;
        }
        
        .step-item.current .step-title {
            color: var(--color-primary-600);
        }
        
        .step-item.completed .step-title {
            color: var(--color-success-600);
        }
        
        /* Breadcrumb Styles */
        .breadcrumb-nav {
            margin: 1rem 0;
        }
        
        .breadcrumb-list {
            display: flex;
            align-items: center;
            list-style: none;
            padding: 0;
            margin: 0;
            flex-wrap: wrap;
        }
        
        .breadcrumb-item {
            display: flex;
            align-items: center;
        }
        
        .breadcrumb-link {
            color: var(--color-primary-600);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
        }
        
        .breadcrumb-link:hover {
            color: var(--color-primary-700);
            text-decoration: underline;
        }
        
        .breadcrumb-current {
            color: var(--color-neutral-500);
            font-weight: 500;
        }
        
        .breadcrumb-separator {
            width: 1rem;
            height: 1rem;
            margin: 0 0.5rem;
            color: var(--color-neutral-400);
        }
        
        /* Step Navigation Styles */
        .step-navigation {
            margin: 2rem 0;
            padding: 1.5rem 0;
            border-top: 1px solid var(--color-neutral-200);
        }
        
        .nav-buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
        
        .btn-primary.disabled,
        .btn-secondary.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .btn-primary.disabled:hover,
        .btn-secondary.disabled:hover {
            transform: none;
            box-shadow: inherit;
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
            .steps-container {
                flex-direction: column;
                gap: 1rem;
            }
            
            .steps-container::before {
                display: none;
            }
            
            .step-item {
                flex-direction: row;
                text-align: left;
                width: 100%;
            }
            
            .step-circle {
                margin-right: 1rem;
                margin-bottom: 0;
                flex-shrink: 0;
            }
            
            .step-content {
                max-width: none;
                flex: 1;
            }
            
            .nav-buttons {
                flex-direction: column;
                width: 100%;
            }
            
            .nav-buttons button {
                width: 100%;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize styles when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addProgressIndicatorStyles);
} else {
    addProgressIndicatorStyles();
}
