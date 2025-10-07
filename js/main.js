// Main initialization file
// This file initializes the application when the page loads

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Render the initial page
    render();
    
    // ADDED: Initialize Lucide icons
    lucide.createIcons();
    
    console.log('FIRB Calculator initialized successfully');
    console.log('Current step:', state.currentStep);
});
