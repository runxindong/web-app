// Analytics module for performance monitoring and reporting
export default class AnalyticsModule {
    constructor() {
        this.metrics = new Map();
        this.marks = new Map();
        this.observers = new Map();
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;

        // Initialize performance observers
        this.setupPerformanceObservers();

        // Track initial page metrics
        this.trackInitialMetrics();

        // Setup event listeners
        this.setupEventListeners();

        this.initialized = true;
    }

    setupPerformanceObservers() {
        // Long Tasks observer
        if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
            const longTaskObserver = new PerformanceObserver(entries => {
                entries.getEntries().forEach(entry => {
                    this.recordMetric('longTasks', {
                        duration: entry.duration,
                        startTime: entry.startTime,
                        name: entry.name
                    });
                });
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
            this.observers.set('longTask', longTaskObserver);
        }

        // Layout Shifts observer
        if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
            const layoutShiftObserver = new PerformanceObserver(entries => {
                entries.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        this.recordMetric('layoutShifts', {
                            value: entry.value,
                            startTime: entry.startTime
                        });
                    }
                });
            });
            layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
            this.observers.set('layoutShift', layoutShiftObserver);
        }

        // First Paint and First Contentful Paint observer
        if (PerformanceObserver.supportedEntryTypes.includes('paint')) {
            const paintObserver = new PerformanceObserver(entries => {
                entries.getEntries().forEach(entry => {
                    this.recordMetric(entry.name, {
                        startTime: entry.startTime
                    });
                });
            });
            paintObserver.observe({ entryTypes: ['paint'] });
            this.observers.set('paint', paintObserver);
        }

        // Largest Contentful Paint observer
        if (PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
            const lcpObserver = new PerformanceObserver(entries => {
                const lastEntry = entries.getEntries().pop();
                this.recordMetric('largestContentfulPaint', {
                    startTime: lastEntry.startTime,
                    size: lastEntry.size,
                    element: lastEntry.element?.tagName
                });
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.set('lcp', lcpObserver);
        }

        // First Input Delay observer
        if (PerformanceObserver.supportedEntryTypes.includes('first-input')) {
            const fidObserver = new PerformanceObserver(entries => {
                entries.getEntries().forEach(entry => {
                    this.recordMetric('firstInputDelay', {
                        startTime: entry.startTime,
                        processingStart: entry.processingStart,
                        processingEnd: entry.processingEnd,
                        duration: entry.duration
                    });
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            this.observers.set('fid', fidObserver);
        }

        // Resource timing observer
        const resourceObserver = new PerformanceObserver(entries => {
            entries.getEntries().forEach(entry => {
                this.recordResourceTiming(entry);
            });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
    }

    trackInitialMetrics() {
        // Navigation Timing
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            this.recordMetric('navigationTiming', {
                dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcpConnection: navigation.connectEnd - navigation.connectStart,
                serverResponse: navigation.responseEnd - navigation.requestStart,
                domInteractive: navigation.domInteractive,
                domComplete: navigation.domComplete,
                loadEvent: navigation.loadEventEnd - navigation.loadEventStart
            });
        }

        // Memory usage
        if (performance.memory) {
            this.recordMetric('memory', {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            });
        }
    }

    setupEventListeners() {
        // Track user interactions
        document.addEventListener('click', this.handleUserInteraction.bind(this), true);
        document.addEventListener('keydown', this.handleUserInteraction.bind(this), true);
        document.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 100), { passive: true });

        // Track page visibility changes
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        // Track errors
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }

    recordMetric(name, value) {
        const metrics = this.metrics.get(name) || [];
        metrics.push({
            value,
            timestamp: performance.now()
        });
        this.metrics.set(name, metrics);

        // Report if metric exceeds threshold
        this.checkMetricThreshold(name, value);
    }

    recordResourceTiming(entry) {
        const metrics = {
            name: entry.name,
            type: entry.initiatorType,
            duration: entry.duration,
            size: entry.transferSize,
            startTime: entry.startTime
        };

        this.recordMetric(`resource-${entry.initiatorType}`, metrics);
    }

    handleUserInteraction(event) {
        this.recordMetric('userInteraction', {
            type: event.type,
            target: event.target.tagName,
            timestamp: performance.now()
        });
    }

    handleScroll() {
        const metrics = {
            scrollY: window.scrollY,
            maxScroll: Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            )
        };
        this.recordMetric('scroll', metrics);
    }

    handleVisibilityChange() {
        this.recordMetric('visibility', {
            state: document.visibilityState,
            timestamp: performance.now()
        });
    }

    handleError(error) {
        this.recordMetric('error', {
            message: error.message,
            filename: error.filename,
            lineno: error.lineno,
            colno: error.colno,
            timestamp: performance.now()
        });
    }

    handlePromiseRejection(event) {
        this.recordMetric('unhandledRejection', {
            reason: event.reason?.message || 'Unknown reason',
            timestamp: performance.now()
        });
    }

    checkMetricThreshold(name, value) {
        const thresholds = {
            firstContentfulPaint: 2000,
            largestContentfulPaint: 2500,
            firstInputDelay: 100,
            layoutShifts: 0.1
        };

        if (thresholds[name] && value > thresholds[name]) {
            console.warn(`Performance threshold exceeded for ${name}: ${value}`);
            this.reportPerfIssue(name, value, thresholds[name]);
        }
    }

    reportPerfIssue(metric, value, threshold) {
        // Send to analytics service
        this.sendToAnalytics({
            type: 'performance_issue',
            metric,
            value,
            threshold,
            timestamp: performance.now()
        });
    }

    sendToAnalytics(data) {
        // Implementation would depend on analytics service
        console.log('Analytics data:', data);
    }

    getMetrics() {
        const result = {};
        for (const [key, value] of this.metrics.entries()) {
            result[key] = value;
        }
        return result;
    }

    getMetricsSummary() {
        const summary = {};
        for (const [key, values] of this.metrics.entries()) {
            if (Array.isArray(values)) {
                summary[key] = {
                    count: values.length,
                    average: this.average(values.map(v => v.value)),
                    min: this.min(values.map(v => v.value)),
                    max: this.max(values.map(v => v.value))
                };
            }
        }
        return summary;
    }

    // Utility methods
    average(arr) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    min(arr) {
        return Math.min(...arr);
    }

    max(arr) {
        return Math.max(...arr);
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Cleanup
    destroy() {
        // Disconnect all observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        // Clear metrics
        this.metrics.clear();
        this.marks.clear();

        // Remove event listeners
        document.removeEventListener('click', this.handleUserInteraction);
        document.removeEventListener('keydown', this.handleUserInteraction);
        document.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('error', this.handleError);
        window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
    }
}

// Export singleton instance
export const analytics = new AnalyticsModule(); 