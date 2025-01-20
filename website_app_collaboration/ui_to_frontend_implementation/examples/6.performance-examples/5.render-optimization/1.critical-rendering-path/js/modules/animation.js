// Animation module for handling scroll-based and interactive animations
export default class AnimationModule {
    constructor() {
        this.animatedElements = new Set();
        this.observer = null;
        this.rafId = null;
    }

    initializeAnimations() {
        // Setup Intersection Observer for scroll-based animations
        this.setupIntersectionObserver();

        // Initialize existing animated elements
        this.initializeExistingElements();

        // Setup resize handler
        this.setupResizeHandler();

        // Start animation loop
        this.startAnimationLoop();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );
    }

    initializeExistingElements() {
        // Find all elements with animation classes
        document.querySelectorAll('.fade-in, .slide-up').forEach(element => {
            this.observer.observe(element);
        });
    }

    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            // Debounce resize handling
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    startAnimationLoop() {
        const animate = () => {
            this.updateAnimations();
            this.rafId = requestAnimationFrame(animate);
        };
        this.rafId = requestAnimationFrame(animate);
    }

    stopAnimationLoop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    updateAnimations() {
        this.animatedElements.forEach(element => {
            const animation = element.animation;
            if (animation && !animation.finished) {
                this.updateElementAnimation(element);
            } else {
                this.animatedElements.delete(element);
            }
        });
    }

    animateElement(element) {
        // Define animation based on element classes
        if (element.classList.contains('fade-in')) {
            this.createFadeInAnimation(element);
        } else if (element.classList.contains('slide-up')) {
            this.createSlideUpAnimation(element);
        }
    }

    createFadeInAnimation(element) {
        const animation = element.animate(
            [
                { opacity: 0 },
                { opacity: 1 }
            ],
            {
                duration: 500,
                easing: 'ease-out',
                fill: 'forwards'
            }
        );

        element.animation = animation;
        this.animatedElements.add(element);
    }

    createSlideUpAnimation(element) {
        const animation = element.animate(
            [
                {
                    opacity: 0,
                    transform: 'translateY(20px)'
                },
                {
                    opacity: 1,
                    transform: 'translateY(0)'
                }
            ],
            {
                duration: 500,
                easing: 'ease-out',
                fill: 'forwards'
            }
        );

        element.animation = animation;
        this.animatedElements.add(element);
    }

    updateElementAnimation(element) {
        const animation = element.animation;
        if (!animation) return;

        // Check if element is still in viewport
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

        if (!isVisible && !animation.finished) {
            animation.pause();
        } else if (isVisible && animation.playState === 'paused') {
            animation.play();
        }
    }

    handleResize() {
        // Recalculate positions and update animations
        this.animatedElements.forEach(element => {
            this.updateElementAnimation(element);
        });
    }

    // Add new element to be animated
    addElement(element, animationType = 'fade-in') {
        element.classList.add(animationType);
        this.observer.observe(element);
    }

    // Remove element from animations
    removeElement(element) {
        this.animatedElements.delete(element);
        this.observer.unobserve(element);
    }

    // Cleanup resources
    destroy() {
        this.stopAnimationLoop();
        this.observer.disconnect();
        this.animatedElements.clear();
    }

    // Performance optimization methods
    optimizeForLowPower() {
        this.animatedElements.forEach(element => {
            const animation = element.animation;
            if (animation) {
                animation.updatePlaybackRate(0.5);
            }
        });
    }

    optimizeForHighPerformance() {
        this.animatedElements.forEach(element => {
            const animation = element.animation;
            if (animation) {
                animation.updatePlaybackRate(1);
            }
        });
    }

    // Utility methods
    isAnimating(element) {
        return this.animatedElements.has(element);
    }

    pauseAll() {
        this.animatedElements.forEach(element => {
            const animation = element.animation;
            if (animation) {
                animation.pause();
            }
        });
    }

    resumeAll() {
        this.animatedElements.forEach(element => {
            const animation = element.animation;
            if (animation) {
                animation.play();
            }
        });
    }
}

// Export singleton instance
export const animation = new AnimationModule(); 