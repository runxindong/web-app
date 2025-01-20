// Import virtual list implementations
import { BasicVirtualList } from './basic-list.js';
import { DynamicHeightList } from './dynamic-height-list.js';
import { InfiniteScrollList } from './infinite-scroll-list.js';
import { GroupedVirtualList } from './grouped-list.js';

// Performance monitoring utilities
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.setupObservers();
    }

    setupObservers() {
        // Layout shifts observer
        if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
            const layoutShiftObserver = new PerformanceObserver(entries => {
                for (const entry of entries.getEntries()) {
                    if (!entry.hadRecentInput) {
                        this.recordMetric('layoutShift', entry.value);
                    }
                }
            });
            layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
            this.observers.set('layoutShift', layoutShiftObserver);
        }

        // Long tasks observer
        if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
            const longTaskObserver = new PerformanceObserver(entries => {
                for (const entry of entries.getEntries()) {
                    this.recordMetric('longTask', entry.duration);
                }
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
            this.observers.set('longTask', longTaskObserver);
        }
    }

    recordMetric(name, value) {
        const metrics = this.metrics.get(name) || [];
        metrics.push({
            value,
            timestamp: performance.now()
        });
        this.metrics.set(name, metrics);
    }

    getMetricsSummary() {
        const summary = {};
        for (const [key, values] of this.metrics.entries()) {
            summary[key] = {
                average: values.reduce((sum, item) => sum + item.value, 0) / values.length,
                max: Math.max(...values.map(item => item.value)),
                count: values.length
            };
        }
        return summary;
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.metrics.clear();
    }
}

// Main application class
class VirtualListDemo {
    constructor() {
        this.lists = new Map();
        this.performanceMonitor = new PerformanceMonitor();
        this.setupEventListeners();
    }

    initialize() {
        // Initialize basic virtual list
        this.lists.set('basic', new BasicVirtualList({
            container: document.getElementById('basic-virtual-list'),
            itemHeight: 50,
            totalItems: 10000
        }));

        // Initialize dynamic height list
        this.lists.set('dynamic', new DynamicHeightList({
            container: document.getElementById('dynamic-virtual-list'),
            contentType: 'text'
        }));

        // Initialize infinite scroll list
        this.lists.set('infinite', new InfiniteScrollList({
            container: document.getElementById('infinite-virtual-list'),
            batchSize: 50
        }));

        // Initialize grouped list
        this.lists.set('grouped', new GroupedVirtualList({
            container: document.getElementById('grouped-virtual-list'),
            groupBy: 'category'
        }));

        // Start performance monitoring
        this.startPerformanceMonitoring();
    }

    setupEventListeners() {
        // Basic list controls
        document.getElementById('total-items')?.addEventListener('change', e => {
            this.lists.get('basic')?.updateTotalItems(parseInt(e.target.value));
        });

        document.getElementById('item-height')?.addEventListener('change', e => {
            this.lists.get('basic')?.updateItemHeight(parseInt(e.target.value));
        });

        document.getElementById('update-list')?.addEventListener('click', () => {
            this.lists.get('basic')?.refresh();
        });

        // Dynamic height list controls
        document.getElementById('content-type')?.addEventListener('change', e => {
            this.lists.get('dynamic')?.updateContentType(e.target.value);
        });

        document.getElementById('toggle-collapse')?.addEventListener('click', () => {
            this.lists.get('dynamic')?.toggleAllItems();
        });

        // Infinite scroll list controls
        document.getElementById('batch-size')?.addEventListener('change', e => {
            this.lists.get('infinite')?.updateBatchSize(parseInt(e.target.value));
        });

        // Grouped list controls
        document.getElementById('group-by')?.addEventListener('change', e => {
            this.lists.get('grouped')?.updateGrouping(e.target.value);
        });

        document.getElementById('toggle-groups')?.addEventListener('click', () => {
            this.lists.get('grouped')?.toggleAllGroups();
        });

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.lists.forEach(list => list.handleResize());
        }, 150));
    }

    startPerformanceMonitoring() {
        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                const memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                document.getElementById('memory-usage').textContent = `${memoryUsage} MB`;
            }, 1000);
        }

        // Monitor rendered items
        setInterval(() => {
            const basicList = this.lists.get('basic');
            if (basicList) {
                document.getElementById('rendered-items-count').textContent = 
                    basicList.getRenderedItemsCount();
            }
        }, 500);

        // Monitor scroll position
        const updateScrollPosition = () => {
            requestAnimationFrame(() => {
                const basicList = this.lists.get('basic');
                if (basicList) {
                    document.getElementById('scroll-position').textContent = 
                        Math.round(basicList.getScrollPosition());
                }
            });
        };

        document.getElementById('basic-virtual-list')
            ?.addEventListener('scroll', updateScrollPosition);
    }

    debounce(func, wait) {
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

    destroy() {
        // Cleanup all lists
        this.lists.forEach(list => list.destroy());
        this.lists.clear();

        // Cleanup performance monitor
        this.performanceMonitor.destroy();
    }
}

// Initialize the demo when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const demo = new VirtualListDemo();
    demo.initialize();

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        demo.destroy();
    });
}); 