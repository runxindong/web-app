export class BasicVirtualList {
    constructor(options) {
        this.container = options.container;
        this.itemHeight = options.itemHeight;
        this.totalItems = options.totalItems;
        this.buffer = 5; // Number of items to render above/below viewport

        this.visibleItems = new Map();
        this.scrollTop = 0;
        this.containerHeight = 0;
        this.totalHeight = 0;

        this.initialize();
    }

    initialize() {
        // Get container dimensions
        this.containerHeight = this.container.clientHeight;
        this.totalHeight = this.totalItems * this.itemHeight;

        // Set content height
        const content = this.container.querySelector('.virtual-list-content');
        content.style.height = `${this.totalHeight}px`;

        // Setup scroll handler
        this.container.addEventListener('scroll', this.handleScroll.bind(this));

        // Initial render
        this.render();

        // Setup resize observer
        this.resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === this.container) {
                    this.handleResize();
                }
            }
        });
        this.resizeObserver.observe(this.container);
    }

    handleScroll() {
        requestAnimationFrame(() => {
            this.scrollTop = this.container.scrollTop;
            this.render();
        });
    }

    render() {
        // Calculate visible range
        const startIndex = Math.floor(this.scrollTop / this.itemHeight) - this.buffer;
        const endIndex = Math.ceil((this.scrollTop + this.containerHeight) / this.itemHeight) + this.buffer;

        // Clamp indices
        const firstIndex = Math.max(0, startIndex);
        const lastIndex = Math.min(this.totalItems - 1, endIndex);

        // Get currently visible items
        const currentlyVisible = new Set(this.visibleItems.keys());
        const shouldBeVisible = new Set();

        // Update visible items
        for (let i = firstIndex; i <= lastIndex; i++) {
            shouldBeVisible.add(i);

            if (!this.visibleItems.has(i)) {
                // Create and position new item
                const item = this.createItem(i);
                item.style.position = 'absolute';
                item.style.top = `${i * this.itemHeight}px`;
                item.style.height = `${this.itemHeight}px`;
                this.visibleItems.set(i, item);

                // Add to DOM
                this.container.querySelector('.virtual-list-content').appendChild(item);
            }
        }

        // Remove items that are no longer visible
        for (const index of currentlyVisible) {
            if (!shouldBeVisible.has(index)) {
                const item = this.visibleItems.get(index);
                item.remove();
                this.visibleItems.delete(index);
            }
        }

        // Update performance metrics
        performance.mark('render-end');
        performance.measure('render', 'render-end');
    }

    createItem(index) {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.textContent = `Item ${index + 1}`;
        return item;
    }

    handleResize() {
        // Update container dimensions
        this.containerHeight = this.container.clientHeight;

        // Re-render with new dimensions
        this.render();
    }

    // Public methods
    updateTotalItems(count) {
        this.totalItems = count;
        this.totalHeight = this.totalItems * this.itemHeight;
        this.container.querySelector('.virtual-list-content').style.height = `${this.totalHeight}px`;
        this.render();
    }

    updateItemHeight(height) {
        this.itemHeight = height;
        this.totalHeight = this.totalItems * this.itemHeight;
        this.container.querySelector('.virtual-list-content').style.height = `${this.totalHeight}px`;
        
        // Update positions of visible items
        this.visibleItems.forEach((item, index) => {
            item.style.height = `${this.itemHeight}px`;
            item.style.top = `${index * this.itemHeight}px`;
        });
    }

    refresh() {
        // Clear all items
        this.visibleItems.forEach(item => item.remove());
        this.visibleItems.clear();

        // Re-render
        this.render();
    }

    getRenderedItemsCount() {
        return this.visibleItems.size;
    }

    getScrollPosition() {
        return this.scrollTop;
    }

    destroy() {
        // Remove scroll listener
        this.container.removeEventListener('scroll', this.handleScroll);

        // Disconnect resize observer
        this.resizeObserver.disconnect();

        // Clear all items
        this.visibleItems.forEach(item => item.remove());
        this.visibleItems.clear();
    }
} 