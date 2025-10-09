// Utility functions for FIRB Calculator

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} str - The string to sanitize
 * @returns {string} - The sanitized string
 */
function sanitizeHTML(str) {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Escape HTML special characters
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Format number with commas for better readability
 * @param {number|string} num - The number to format
 * @returns {string} - Formatted number string
 */
function formatNumberWithCommas(num) {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Parse formatted number string (remove commas)
 * @param {string} str - The formatted number string
 * @returns {number} - Parsed number
 */
function parseFormattedNumber(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/,/g, ''));
}

/**
 * Validate property value
 * @param {number|string} value - Property value to validate
 * @returns {object} - {valid: boolean, error: string}
 */
function validatePropertyValue(value) {
    const val = parseFloat(value);

    if (isNaN(val)) {
        return { valid: false, error: 'Please enter a valid number' };
    }

    if (val <= 0) {
        return { valid: false, error: 'Property value must be greater than 0' };
    }

    if (val < 100000) {
        return { valid: false, error: 'Property value seems unusually low. Please verify the amount.' };
    }

    if (val > 100000000) {
        return { valid: false, error: 'Property value seems unusually high. Please verify the amount.' };
    }

    return { valid: true, error: null };
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('error', 'success', 'info', 'warning')
 * @param {number} duration - Duration in milliseconds (default 5000)
 */
function showNotification(message, type = 'info', duration = 5000) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 ease-in-out`;

    // Set colors based on type
    const colors = {
        error: 'bg-red-100 border-red-500 text-red-900',
        success: 'bg-green-100 border-green-500 text-green-900',
        info: 'bg-blue-100 border-blue-500 text-blue-900',
        warning: 'bg-yellow-100 border-yellow-500 text-yellow-900'
    };

    notification.className += ` ${colors[type] || colors.info} border-l-4`;

    // Get icon based on type
    const iconNames = {
        error: 'alert-circle',
        success: 'check-circle',
        info: 'info',
        warning: 'alert-triangle'
    };

    notification.innerHTML = `
        <div class="flex items-start">
            <i data-lucide="${iconNames[type] || 'info'}" class="w-5 h-5 mr-3 flex-shrink-0"></i>
            <div class="flex-1">
                <p class="font-semibold">${escapeHTML(message)}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-500 hover:text-gray-700">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Initialize Lucide icons for the notification
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Slide in animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

/**
 * Debounce function to limit rate of function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Save data to localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 * @returns {boolean} - Success status
 */
function saveToStorage(key, data) {
    try {
        const serialized = JSON.stringify(data);
        
        // Check if data is too large
        if (serialized.length > 5 * 1024 * 1024) { // 5MB limit
            console.warn(`[STORAGE] Data too large for ${key}: ${serialized.length} bytes`);
            return false;
        }
        
        localStorage.setItem(key, serialized);
        return true;
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.warn('[STORAGE] Quota exceeded, attempting cleanup');
            
            // Try to free up space by removing old data
            if (cleanupStorage()) {
                try {
                    localStorage.setItem(key, JSON.stringify(data));
                    return true;
                } catch (e2) {
                    console.error('[STORAGE] Still quota exceeded after cleanup');
                    return false;
                }
            }
        }
        
        console.error('Failed to save to localStorage:', e);
        return false;
    }
}

/**
 * Cleanup old storage data to free up space
 * @returns {boolean} Success status
 */
function cleanupStorage() {
    try {
        const keysToRemove = [];
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        // Find old keys
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('firb_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data && data.timestamp && (now - data.timestamp) > maxAge) {
                        keysToRemove.push(key);
                    }
                } catch (e) {
                    // If we can't parse it, it's probably corrupted - remove it
                    keysToRemove.push(key);
                }
            }
        }
        
        // Remove old keys
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            console.log(`[STORAGE] Cleaned up old data: ${key}`);
        });
        
        return keysToRemove.length > 0;
    } catch (e) {
        console.error('[STORAGE] Cleanup failed:', e);
        return false;
    }
}

/**
 * Load data from localStorage with error handling
 * @param {string} key - Storage key
 * @returns {any} - Retrieved data or null
 */
function loadFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Failed to load from localStorage:', e);
        return null;
    }
}

/**
 * Clear specific item from localStorage
 * @param {string} key - Storage key to clear
 */
function clearStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error('Failed to clear from localStorage:', e);
    }
}
