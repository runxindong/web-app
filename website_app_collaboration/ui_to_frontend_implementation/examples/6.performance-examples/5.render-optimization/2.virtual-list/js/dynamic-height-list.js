export class DynamicHeightList {
    constructor(options) {
        this.container = options.container;
        this.contentType = options.contentType;
        this.itemHeights = new Map();
        this.totalHeight = 0;
        this.visibleItems = new Map();
        this.itemPositions = [];
        this.scrollTop = 0;
        this.containerHeight = 0;
        this.buffer = 3; // Number of items to render above/below viewport
        this.expandedItems = new Set();

        // Sample data
        this.items = this.generateItems(100);

        this.initialize();
    }

    initialize() {
        // Get container dimensions
        this.containerHeight = this.container.clientHeight;

        // Calculate initial item heights and positions
        this.calculateItemHeights();
        this.calculateItemPositions();

        // Set content height
        const content = this.container.querySelector('.virtual-list-content');
        content.style.height = `${this.totalHeight}px`;

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

        // Initial render
        this.render();
    }

    generateItems(count) {
        return Array.from({ length: count }, (_, index) => ({
            id: index,
            title: `Item ${index + 1}`,
            content: this.generateContent(index),
            type: this.getRandomType()
        }));
    }

    generateContent(index) {
        const paragraphs = Math.floor(Math.random() * 3) + 1;
        return Array.from({ length: paragraphs }, () => 
            `This is a sample paragraph for item ${index + 1}. ` +
            `It contains some random text to demonstrate dynamic height content. `.repeat(Math.random() * 2 + 1)
        ).join('\n\n');
    }

    getRandomType() {
        const types = ['text', 'card', 'image'];
        return types[Math.floor(Math.random() * types.length)];
    }

    calculateItemHeights() {
        // Create temporary container for measurements
        const measureContainer = document.createElement('div');
        measureContainer.style.position = 'absolute';
        measureContainer.style.visibility = 'hidden';
        measureContainer.style.width = `${this.container.clientWidth}px`;
        document.body.appendChild(measureContainer);

        // Measure each item
        this.items.forEach(item => {
            const element = this.createItem(item);
            measureContainer.appendChild(element);
            this.itemHeights.set(item.id, element.offsetHeight);
        });

        // Cleanup
        document.body.removeChild(measureContainer);

        // Calculate total height
        this.totalHeight = Array.from(this.itemHeights.values()).reduce((sum, height) => sum + height, 0);
    }

    calculateItemPositions() {
        let currentPosition = 0;
        this.itemPositions = this.items.map(item => {
            const position = currentPosition;
            currentPosition += this.itemHeights.get(item.id);
            return {
                index: item.id,
                top: position,
                bottom: currentPosition,
                height: this.itemHeights.get(item.id)
            };
        });
    }

    findVisibleRange() {
        const start = this.itemPositions.findIndex(pos => pos.bottom > this.scrollTop);
        const end = this.itemPositions.findIndex(pos => pos.top > this.scrollTop + this.containerHeight);

        return {
            start: Math.max(0, start - this.buffer),
            end: end === -1 ? this.items.length - 1 : end + this.buffer
        };
    }

    handleScroll() {
        requestAnimationFrame(() => {
            this.scrollTop = this.container.scrollTop;
            this.render();
        });
    }

    render() {
        performance.mark('render-start');

        const { start, end } = this.findVisibleRange();
        const currentlyVisible = new Set(this.visibleItems.keys());
        const shouldBeVisible = new Set();

        // Update visible items
        for (let i = start; i <= end; i++) {
            const item = this.items[i];
            shouldBeVisible.add(item.id);

            if (!this.visibleItems.has(item.id)) {
                const element = this.createItem(item);
                element.style.position = 'absolute';
                element.style.top = `${this.itemPositions[i].top}px`;
                this.visibleItems.set(item.id, element);

                this.container.querySelector('.virtual-list-content').appendChild(element);

                // Restore expanded state if necessary
                if (this.expandedItems.has(item.id)) {
                    this.expandItem(element, item);
                }
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
        element.className = `list-item expandable-item ${item.type}`;
        element.dataset.id = item.id;

        switch (item.type) {
            case 'card':
                element.innerHTML = `
                    <div class="card-header">
                        <h3>${item.title}</h3>
                        <button class="expand-button">▼</button>
                    </div>
                    <div class="item-content" style="display: none;">
                        ${item.content}
                    </div>
                `;
                break;
            case 'image':
                element.innerHTML = `
                    <div class="card-header">
                        <h3>${item.title}</h3>
                        <button class="expand-button">▼</button>
                    </div>
                    <div class="item-content" style="display: none;">
                        <img src="https://via.placeholder.com/300x200" alt="Placeholder">
                        <p>${item.content}</p>
                    </div>
                `;
                break;
            default:
                element.innerHTML = `
                    <div class="card-header">
                        <h3>${item.title}</h3>
                        <button class="expand-button">▼</button>
                    </div>
                    <div class="item-content" style="display: none;">
                        <p>${item.content}</p>
                    </div>
                `;
        }

        // Add click handler
        element.querySelector('.card-header').addEventListener('click', () => {
            this.toggleItem(element, item);
        });

        return element;
    }

    toggleItem(element, item) {
        if (this.expandedItems.has(item.id)) {
            this.collapseItem(element, item);
        } else {
            this.expandItem(element, item);
        }
    }

    expandItem(element, item) {
        const content = element.querySelector('.item-content');
        const button = element.querySelector('.expand-button');
        
        content.style.display = 'block';
        button.textContent = '▲';
        element.classList.add('expanded');
        this.expandedItems.add(item.id);

        // Measure new height
        const newHeight = element.offsetHeight;
        const oldHeight = this.itemHeights.get(item.id);
        const heightDiff = newHeight - oldHeight;

        // Update heights and positions
        this.itemHeights.set(item.id, newHeight);
        this.updatePositionsAfter(item.id, heightDiff);
    }

    collapseItem(element, item) {
        const content = element.querySelector('.item-content');
        const button = element.querySelector('.expand-button');
        
        content.style.display = 'none';
        button.textContent = '▼';
        element.classList.remove('expanded');
        this.expandedItems.delete(item.id);

        // Measure new height
        const newHeight = element.offsetHeight;
        const oldHeight = this.itemHeights.get(item.id);
        const heightDiff = newHeight - oldHeight;

        // Update heights and positions
        this.itemHeights.set(item.id, newHeight);
        this.updatePositionsAfter(item.id, heightDiff);
    }

    updatePositionsAfter(itemId, heightDiff) {
        const startIndex = this.items.findIndex(item => item.id === itemId) + 1;
        
        // Update positions for all following items
        for (let i = startIndex; i < this.itemPositions.length; i++) {
            this.itemPositions[i].top += heightDiff;
            this.itemPositions[i].bottom += heightDiff;
        }

        // Update total height
        this.totalHeight += heightDiff;
        this.container.querySelector('.virtual-list-content').style.height = `${this.totalHeight}px`;

        // Update positions of visible items
        this.visibleItems.forEach((element, id) => {
            const position = this.itemPositions.find(pos => pos.index === id);
            if (position) {
                element.style.top = `${position.top}px`;
            }
        });
    }

    toggleAllItems() {
        const allExpanded = this.expandedItems.size === this.items.length;
        
        if (allExpanded) {
            // Collapse all
            this.expandedItems.clear();
            this.visibleItems.forEach((element) => {
                const content = element.querySelector('.item-content');
                const button = element.querySelector('.expand-button');
                content.style.display = 'none';
                button.textContent = '▼';
                element.classList.remove('expanded');
            });
        } else {
            // Expand all
            this.items.forEach(item => this.expandedItems.add(item.id));
            this.visibleItems.forEach((element) => {
                const content = element.querySelector('.item-content');
                const button = element.querySelector('.expand-button');
                content.style.display = 'block';
                button.textContent = '▲';
                element.classList.add('expanded');
            });
        }

        // Recalculate heights and positions
        this.calculateItemHeights();
        this.calculateItemPositions();
        this.container.querySelector('.virtual-list-content').style.height = `${this.totalHeight}px`;
        this.render();
    }

    updateContentType(type) {
        this.contentType = type;
        this.items = this.generateItems(this.items.length);
        this.itemHeights.clear();
        this.expandedItems.clear();
        
        // Recalculate everything
        this.calculateItemHeights();
        this.calculateItemPositions();
        this.container.querySelector('.virtual-list-content').style.height = `${this.totalHeight}px`;
        
        // Clear and re-render
        this.visibleItems.forEach(element => element.remove());
        this.visibleItems.clear();
        this.render();
    }

    handleResize() {
        this.containerHeight = this.container.clientHeight;
        
        // Recalculate heights and positions
        this.calculateItemHeights();
        this.calculateItemPositions();
        this.container.querySelector('.virtual-list-content').style.height = `${this.totalHeight}px`;
        
        // Re-render
        this.render();
    }

    destroy() {
        // Remove scroll listener
        this.container.removeEventListener('scroll', this.handleScroll);

        // Disconnect resize observer
        this.resizeObserver.disconnect();

        // Clear all items
        this.visibleItems.forEach(element => element.remove());
        this.visibleItems.clear();
        this.itemHeights.clear();
        this.expandedItems.clear();
    }
} 