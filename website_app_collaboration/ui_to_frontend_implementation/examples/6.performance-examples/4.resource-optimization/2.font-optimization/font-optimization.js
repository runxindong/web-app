// Font loading performance monitoring
const fontLoadingMetrics = {
    startTime: performance.now(),
    fonts: new Map(),
    stages: {
        critical: null,
        nonCritical: null
    }
};

// Font loading observer
const fontLoadingObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach(entry => {
        const fontName = entry.name.split('/').pop();
        fontLoadingMetrics.fonts.set(fontName, {
            duration: entry.duration,
            size: entry.encodedBodySize,
            timeToLoad: entry.startTime - fontLoadingMetrics.startTime
        });
        
        updateMetricsDisplay();
    });
});

// Start observing font loading performance
if (PerformanceObserver.supportedEntryTypes.includes('resource')) {
    fontLoadingObserver.observe({
        entryTypes: ['resource'],
        buffered: true
    });
}

// Font loading stages monitoring
document.fonts.ready.then(() => {
    fontLoadingMetrics.stages.critical = performance.now() - fontLoadingMetrics.startTime;
    updateMetricsDisplay();
});

// Font subsetting demonstration
function demonstrateFontSubsetting() {
    const customSubsetFont = new FontFace(
        'Roboto Custom',
        'url(fonts/roboto-custom-subset.woff2)',
        {
            display: 'swap',
            unicodeRange: 'U+0000-007F' // Basic Latin only
        }
    );

    customSubsetFont.load().then(font => {
        document.fonts.add(font);
        document.documentElement.classList.add('custom-subset-loaded');
    }).catch(error => {
        console.error('Failed to load custom subset font:', error);
    });
}

// Variable font demonstration
function setupVariableFontDemo() {
    const weightSlider = document.createElement('input');
    weightSlider.type = 'range';
    weightSlider.min = '100';
    weightSlider.max = '900';
    weightSlider.value = '400';
    weightSlider.className = 'weight-slider';

    const weightDemo = document.querySelector('.weight-demo');
    weightDemo.prepend(weightSlider);

    weightSlider.addEventListener('input', (e) => {
        const weight = e.target.value;
        weightDemo.style.fontWeight = weight;
    });
}

// Performance metrics display
function updateMetricsDisplay() {
    const metricsContainer = document.getElementById('font-metrics');
    const sizesContainer = document.getElementById('font-sizes');

    if (!metricsContainer || !sizesContainer) return;

    // Clear existing content
    metricsContainer.innerHTML = '';
    sizesContainer.innerHTML = '';

    // Display loading times
    if (fontLoadingMetrics.stages.critical) {
        addMetric(metricsContainer, 'Critical Fonts Load Time', 
                 `${Math.round(fontLoadingMetrics.stages.critical)}ms`);
    }

    // Display font sizes
    fontLoadingMetrics.fonts.forEach((data, fontName) => {
        addMetric(sizesContainer, fontName, 
                 `${Math.round(data.size / 1024)}KB`);
        addMetric(metricsContainer, `${fontName} Load Time`,
                 `${Math.round(data.duration)}ms`);
    });
}

function addMetric(container, label, value) {
    const metricItem = document.createElement('div');
    metricItem.className = 'metric-item';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'metric-label';
    labelSpan.textContent = label;
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'metric-value';
    valueSpan.textContent = value;
    
    metricItem.appendChild(labelSpan);
    metricItem.appendChild(valueSpan);
    container.appendChild(metricItem);
}

// Font feature detection
function checkFontFeatureSupport() {
    const features = {
        variableFonts: 'CSS.supports("font-variation-settings", "normal")',
        fontLoading: '"fonts" in document',
        fontDisplay: 'CSS.supports("font-display", "swap")',
        unicodeRange: 'CSS.supports("unicode-range", "U+0-7F")'
    };

    const supportList = document.createElement('div');
    supportList.className = 'feature-support';

    Object.entries(features).forEach(([feature, test]) => {
        try {
            const supported = eval(test);
            addMetric(supportList, feature, supported ? '✓' : '✗');
        } catch (e) {
            addMetric(supportList, feature, '✗');
        }
    });

    document.getElementById('font-metrics').appendChild(supportList);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    demonstrateFontSubsetting();
    setupVariableFontDemo();
    checkFontFeatureSupport();
});

// Export utilities for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fontLoadingMetrics,
        demonstrateFontSubsetting,
        setupVariableFontDemo,
        checkFontFeatureSupport
    };
} 