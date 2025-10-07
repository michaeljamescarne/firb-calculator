// Icon helper functions for Lucide icons
// Returns HTML string for any Lucide icon

function icon(name, classes = 'w-5 h-5') {
    return `<i data-lucide="${name}" class="${classes}"></i>`;
}

// Common icon shortcuts
const icons = {
    home: (classes) => icon('home', classes || 'w-8 h-8'),
    calculator: (classes) => icon('calculator', classes || 'w-5 h-5'),
    arrowRight: (classes) => icon('arrow-right', classes || 'w-5 h-5'),
    arrowLeft: (classes) => icon('arrow-left', classes || 'w-5 h-5'),
    shield: (classes) => icon('shield', classes || 'w-5 h-5'),
    fileText: (classes) => icon('file-text', classes || 'w-5 h-5'),
    dollarSign: (classes) => icon('dollar-sign', classes || 'w-5 h-5'),
    building: (classes) => icon('building-2', classes || 'w-5 h-5'),
    globe: (classes) => icon('globe', classes || 'w-5 h-5'),
    checkCircle: (classes) => icon('check-circle', classes || 'w-6 h-6'),
    clock: (classes) => icon('clock', classes || 'w-8 h-8'),
    download: (classes) => icon('download', classes || 'w-5 h-5'),
    creditCard: (classes) => icon('credit-card', classes || 'w-5 h-5'),
    menu: (classes) => icon('menu', classes || 'w-6 h-6'),
    x: (classes) => icon('x', classes || 'w-6 h-6'),
};
