// Import dependencies lazily
const loadDependencies = {
    animation: () => import('./modules/animation'),
    lazyLoad: () => import('./modules/lazy-load'),
    analytics: () => import('./modules/analytics')
};

// Initialize non-critical features
class NonCriticalFeatures {
    constructor() {
        this.initialized = false;
        this.modules = new Map();
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Load and initialize modules
            await this.loadModules();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize features
            await this.initializeFeatures();

            this.initialized = true;
            console.log('Non-critical features initialized');
        } catch (error) {
            console.error('Failed to initialize non-critical features:', error);
        }
    }

    async loadModules() {
        const modulePromises = Object.entries(loadDependencies).map(
            async ([name, loader]) => {
                try {
                    const module = await loader();
                    this.modules.set(name, module.default);
                    console.log(`Module loaded: ${name}`);
                } catch (error) {
                    console.error(`Failed to load module ${name}:`, error);
                }
            }
        );

        await Promise.all(modulePromises);
    }

    setupEventListeners() {
        // Scroll animations
        window.addEventListener('scroll', this.handleScroll.bind(this), {
            passive: true
        });

        // Form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });

        // Dynamic content loading
        const loadMoreButton = document.getElementById('load-more');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', this.loadMoreContent.bind(this));
        }
    }

    async initializeFeatures() {
        // Initialize lazy loading
        if (this.modules.has('lazyLoad')) {
            const lazyLoad = new (this.modules.get('lazyLoad'))({
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            lazyLoad.observe();
        }

        // Initialize animations
        if (this.modules.has('animation')) {
            const animation = new (this.modules.get('animation'))();
            animation.initializeAnimations();
        }

        // Initialize analytics
        if (this.modules.has('analytics')) {
            const analytics = new (this.modules.get('analytics'))();
            analytics.initialize();
        }

        // Load dynamic content
        await this.loadInitialContent();
    }

    async loadInitialContent() {
        const contentContainer = document.getElementById('content');
        if (!contentContainer) return;

        try {
            const response = await fetch('https://api.example.com/content');
            const data = await response.json();

            contentContainer.innerHTML = this.renderContent(data);
            this.initializeContentFeatures();
        } catch (error) {
            console.error('Failed to load initial content:', error);
            contentContainer.innerHTML = `
                <div class="error-message">
                    Failed to load content. Please try again later.
                </div>
            `;
        }
    }

    renderContent(data) {
        return `
            <div class="content-section fade-in">
                <h2>${data.title}</h2>
                <p>${data.description}</p>
                
                <div class="card-grid">
                    ${data.items.map(item => `
                        <div class="card slide-up">
                            <img src="data:image/svg+xml;base64,PHN2Zy8+" 
                                 data-src="${item.image}"
                                 alt="${item.title}"
                                 class="lazy">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    `).join('')}
                </div>

                <button id="load-more" class="button">Load More</button>
            </div>
        `;
    }

    initializeContentFeatures() {
        // Reinitialize lazy loading for new images
        if (this.modules.has('lazyLoad')) {
            const lazyLoad = new (this.modules.get('lazyLoad'))();
            lazyLoad.observe();
        }

        // Initialize animations for new content
        if (this.modules.has('animation')) {
            const animation = new (this.modules.get('animation'))();
            animation.initializeAnimations();
        }
    }

    handleScroll() {
        // Throttle scroll handling
        if (!this.scrollTimeout) {
            this.scrollTimeout = setTimeout(() => {
                this.scrollTimeout = null;
                this.checkScrollAnimations();
            }, 100);
        }
    }

    checkScrollAnimations() {
        if (this.modules.has('animation')) {
            const animation = this.modules.get('animation');
            animation.checkScrollAnimations();
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Form submission failed');

            // Show success message
            form.innerHTML = '<div class="success-message">Thank you for your submission!</div>';
        } catch (error) {
            console.error('Form submission error:', error);
            form.querySelector('.error-message')?.remove();
            form.insertAdjacentHTML('beforeend', `
                <div class="error-message">
                    Failed to submit form. Please try again.
                </div>
            `);
        }
    }

    async loadMoreContent() {
        const button = document.getElementById('load-more');
        if (!button) return;

        try {
            button.disabled = true;
            button.textContent = 'Loading...';

            const response = await fetch('https://api.example.com/more-content');
            const data = await response.json();

            const cardGrid = document.querySelector('.card-grid');
            if (cardGrid) {
                cardGrid.insertAdjacentHTML('beforeend', data.items.map(item => `
                    <div class="card slide-up">
                        <img src="data:image/svg+xml;base64,PHN2Zy8+"
                             data-src="${item.image}"
                             alt="${item.title}"
                             class="lazy">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                `).join(''));

                this.initializeContentFeatures();
            }

            // Update button state
            if (!data.hasMore) {
                button.remove();
            } else {
                button.disabled = false;
                button.textContent = 'Load More';
            }
        } catch (error) {
            console.error('Failed to load more content:', error);
            button.disabled = false;
            button.textContent = 'Load More';
            button.insertAdjacentHTML('afterend', `
                <div class="error-message">
                    Failed to load more content. Please try again.
                </div>
            `);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const features = new NonCriticalFeatures();
    features.initialize().catch(console.error);
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NonCriticalFeatures;
} 