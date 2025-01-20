export class InfiniteScrollList {
    constructor(options) {
        this.container = options.container;
        this.batchSize = options.batchSize || 50;
        this.itemHeight = 80; // Fixed height for simplicity
        this.buffer = 5; // Number of items to render above/below viewport
        this.loadingThreshold = 0.8; // Load more when scrolled 80% through current items

        this.items = [];
        this.visibleItems = new Map();
        this.scrollTop = 0;
        this.containerHeight = 0;
        this.totalHeight = 0;
        this.loading = false;
        this.hasMore = true;
        this.currentPage = 0;

        this.initialize();
    }

    initialize() {
        // Get container dimensions
        this.containerHeight = this.container.clientHeight;

        // Setup scroll handler
        this.container.addEventListener('scroll', this.handleScroll.bind(this));

        // Setup resize observer
        this.resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === this.container) {
                    this.handleResize();
                }
            }
        });
        this.resizeObserver.observe(this.container);

        // Load initial batch
        this.loadMoreItems();
    }

    async loadMoreItems() {
        if (this.loading || !this.hasMore) return;

        this.loading = true;
        this.showLoadingIndicator();

        try {
            // Simulate API call
            const newItems = await this.fetchItems();
            
            if (newItems.length === 0) {
                this.hasMore = false;
                this.hideLoadingIndicator();
                return;
            }

            // Add new items
            this.items = [...this.items, ...newItems];
            this.currentPage++;

            // Update total height
            this.totalHeight = this.items.length * this.itemHeight;
            this.container.querySelector('.virtual-list-content').style.height = `${this.totalHeight}px`;

            // Render new items if they should be visible
            this.render();
        } catch (error) {
            console.error('Failed to load items:', error);
            this.showError('Failed to load more items. Please try again.');
        } finally {
            this.loading = false;
            this.hideLoadingIndicator();
        }
    }

    async fetchItems() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate batch of items
        const startIndex = this.items.length;
        const items = [];

        for (let i = 0; i < this.batchSize; i++) {
            const index = startIndex + i;
            items.push({
                id: index,
                title: `Item ${index + 1}`,
                description: `Description for item ${index + 1}`,
                image: `https://via.placeholder.com/60x60?text=${index + 1}`,
                timestamp: new Date(Date.now() - Math.random() * 10000000000)
            });
        }

        // Simulate end of data after 1000 items
        if (startIndex >= 1000) {
            return [];
        }

        return items;
    }

    handleScroll() {
        requestAnimationFrame(() => {
            this.scrollTop = this.container.scrollTop;

            // Check if we need to load more items
            const scrolledPercentage = (this.scrollTop + this.containerHeight) / this.totalHeight;
            if (scrolledPercentage > this.loadingThreshold) {
                this.loadMoreItems();
            }

            this.render();
        });
    }

    render() {
        performance.mark('render-start');

        // Calculate visible range
        const startIndex = Math.floor(this.scrollTop / this.itemHeight) - this.buffer;
        const endIndex = Math.ceil((this.scrollTop + this.containerHeight) / this.itemHeight) + this.buffer;

        // Clamp indices
        const firstIndex = Math.max(0, startIndex);
        const lastIndex = Math.min(this.items.length - 1, endIndex);

        // Get currently visible items
        const currentlyVisible = new Set(this.visibleItems.keys());
        const shouldBeVisible = new Set();

        // Update visible items
        for (let i = firstIndex; i <= lastIndex; i++) {
            const item = this.items[i];
            shouldBeVisible.add(item.id);

            if (!this.visibleItems.has(item.id)) {
                const element = this.createItem(item);
                element.style.position = 'absolute';
                element.style.top = `${i * this.itemHeight}px`;
                element.style.height = `${this.itemHeight}px`;
                this.visibleItems.set(item.id, element);

                this.container.querySelector('.virtual-list-content').appendChild(element);
            }
        }

        // Remove items that are no longer visible
        for (const id of currentlyVisible) {
            if (!shouldBeVisible.has(id)) {
                const element = this.visibleItems.get(id);
                element.remove();
                this.visibleItems.delete(id);
            }
        }

        performance.mark('render-end');
        performance.measure('render', 'render-start', 'render-end');
    }

    createItem(item) {
        const element = document.createElement('div');
        element.className = 'list-item';
        
        const date = new Date(item.timestamp).toLocaleDateString();
        element.innerHTML = `
            <div class="item-content">
                <img src="${item.image}" alt="${item.title}" class="item-image">
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <span class="item-date">${date}</span>
                </div>
            </div>
        `;

        return element;
    }

    showLoadingIndicator() {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.hidden = false;
        }
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.hidden = true;
        }
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        const existingError = this.container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        this.container.appendChild(errorElement);
        setTimeout(() => errorElement.remove(), 3000);
    }

    updateBatchSize(size) {
        this.batchSize = size;
    }

    handleResize() {
        this.containerHeight = this.container.clientHeight;
        this.render();
    }

    reset() {
        // Clear all data and start over
        this.items = [];
        this.visibleItems.forEach(element => element.remove());
        this.visibleItems.clear();
        this.currentPage = 0;
        this.hasMore = true;
        this.totalHeight = 0;
        this.container.querySelector('.virtual-list-content').style.height = '0px';

        // Load initial batch
        this.loadMoreItems();
    }

    destroy() {
        // Remove scroll listener
        this.container.removeEventListener('scroll', this.handleScroll);

        // Disconnect resize observer
        this.resizeObserver.disconnect();

        // Clear all items
        this.visibleItems.forEach(element => element.remove());
        this.visibleItems.clear();

        // Remove loading indicator
        this.hideLoadingIndicator();
    }
} 