// Lazy loading module for images and other content
export default class LazyLoadModule {
    constructor(options = {}) {
        this.options = {
            rootMargin: '50px 0px',
            threshold: 0.1,
            loadingClass: 'loading',
            loadedClass: 'loaded',
            errorClass: 'error',
            ...options
        };

        this.observer = null;
        this.elements = new Set();
        this.retryQueue = new Map();
        this.maxRetries = 3;
    }

    observe() {
        // Create Intersection Observer
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold
            }
        );

        // Start observing existing elements
        this.observeElements();
    }

    observeElements() {
        // Find all elements with data-src attribute
        document.querySelectorAll('[data-src], [data-srcset], [data-background]').forEach(element => {
            if (!this.elements.has(element)) {
                this.elements.add(element);
                this.observer.observe(element);
            }
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadElement(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    async loadElement(element) {
        const type = this.getElementType(element);
        element.classList.add(this.options.loadingClass);

        try {
            switch (type) {
                case 'image':
                    await this.loadImage(element);
                    break;
                case 'background':
                    await this.loadBackground(element);
                    break;
                case 'iframe':
                    await this.loadIframe(element);
                    break;
                case 'video':
                    await this.loadVideo(element);
                    break;
            }

            element.classList.remove(this.options.loadingClass);
            element.classList.add(this.options.loadedClass);
            this.elements.delete(element);
        } catch (error) {
            console.error(`Failed to load element:`, error);
            this.handleLoadError(element);
        }
    }

    getElementType(element) {
        if (element.hasAttribute('data-background')) {
            return 'background';
        }
        switch (element.tagName.toLowerCase()) {
            case 'img':
                return 'image';
            case 'iframe':
                return 'iframe';
            case 'video':
                return 'video';
            default:
                return 'image';
        }
    }

    loadImage(img) {
        return new Promise((resolve, reject) => {
            const src = img.dataset.src;
            const srcset = img.dataset.srcset;

            // Create new image for preloading
            const tempImage = new Image();

            tempImage.onload = () => {
                if (src) img.src = src;
                if (srcset) img.srcset = srcset;
                resolve();
            };

            tempImage.onerror = () => {
                reject(new Error(`Failed to load image: ${src}`));
            };

            // Start loading
            tempImage.src = src;
            if (srcset) tempImage.srcset = srcset;
        });
    }

    loadBackground(element) {
        return new Promise((resolve, reject) => {
            const src = element.dataset.background;
            const tempImage = new Image();

            tempImage.onload = () => {
                element.style.backgroundImage = `url(${src})`;
                resolve();
            };

            tempImage.onerror = () => {
                reject(new Error(`Failed to load background image: ${src}`));
            };

            tempImage.src = src;
        });
    }

    loadIframe(iframe) {
        return new Promise((resolve, reject) => {
            iframe.onload = () => resolve();
            iframe.onerror = () => reject(new Error('Failed to load iframe'));
            iframe.src = iframe.dataset.src;
        });
    }

    loadVideo(video) {
        return new Promise((resolve, reject) => {
            video.onloadeddata = () => resolve();
            video.onerror = () => reject(new Error('Failed to load video'));
            video.src = video.dataset.src;
            if (video.dataset.poster) {
                video.poster = video.dataset.poster;
            }
        });
    }

    handleLoadError(element) {
        element.classList.remove(this.options.loadingClass);
        element.classList.add(this.options.errorClass);

        const retryCount = this.retryQueue.get(element) || 0;
        if (retryCount < this.maxRetries) {
            this.retryQueue.set(element, retryCount + 1);
            setTimeout(() => {
                this.loadElement(element);
            }, Math.pow(2, retryCount) * 1000); // Exponential backoff
        } else {
            this.retryQueue.delete(element);
            this.elements.delete(element);
            this.showFallback(element);
        }
    }

    showFallback(element) {
        const type = this.getElementType(element);
        switch (type) {
            case 'image':
            case 'background':
                this.showImageFallback(element);
                break;
            case 'iframe':
                this.showIframeFallback(element);
                break;
            case 'video':
                this.showVideoFallback(element);
                break;
        }
    }

    showImageFallback(element) {
        const fallbackSrc = element.dataset.fallback || 'path/to/fallback.jpg';
        if (element.tagName.toLowerCase() === 'img') {
            element.src = fallbackSrc;
        } else {
            element.style.backgroundImage = `url(${fallbackSrc})`;
        }
    }

    showIframeFallback(iframe) {
        const fallbackContent = iframe.dataset.fallback || 'Content unavailable';
        const wrapper = document.createElement('div');
        wrapper.className = 'iframe-fallback';
        wrapper.textContent = fallbackContent;
        iframe.parentNode.replaceChild(wrapper, iframe);
    }

    showVideoFallback(video) {
        const fallbackContent = video.dataset.fallback || 'Video unavailable';
        const wrapper = document.createElement('div');
        wrapper.className = 'video-fallback';
        wrapper.textContent = fallbackContent;
        video.parentNode.replaceChild(wrapper, video);
    }

    // Add new element to be lazy loaded
    add(element) {
        if (!this.elements.has(element)) {
            this.elements.add(element);
            this.observer.observe(element);
        }
    }

    // Remove element from lazy loading
    remove(element) {
        this.elements.delete(element);
        this.observer.unobserve(element);
        this.retryQueue.delete(element);
    }

    // Cleanup resources
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.elements.clear();
        this.retryQueue.clear();
    }

    // Force load all remaining elements
    loadAll() {
        this.elements.forEach(element => {
            this.loadElement(element);
        });
    }

    // Get loading status
    getStatus() {
        return {
            total: this.elements.size + this.retryQueue.size,
            loading: this.elements.size,
            retrying: this.retryQueue.size
        };
    }
}

// Export singleton instance
export const lazyLoad = new LazyLoadModule(); 