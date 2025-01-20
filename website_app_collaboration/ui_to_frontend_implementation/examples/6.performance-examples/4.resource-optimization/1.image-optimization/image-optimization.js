// Intersection Observer for lazy loading
document.addEventListener('DOMContentLoaded', function() {
    // Lazy loading with Intersection Observer
    const lazyImages = document.querySelectorAll('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Blur-up loading
    const blurUpImages = document.querySelectorAll('img.blur-up');
    
    const blurUpObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadBlurUpImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    });

    blurUpImages.forEach(img => blurUpObserver.observe(img));
});

// Function to load lazy images
function loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    // Create a new image to preload
    const preloadImage = new Image();
    
    preloadImage.onload = function() {
        img.src = src;
        img.classList.add('loaded');
    };
    
    preloadImage.src = src;
}

// Function to handle blur-up loading
function loadBlurUpImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    // Create a new image to preload
    const preloadImage = new Image();
    
    preloadImage.onload = function() {
        img.src = src;
        img.classList.add('loaded');
    };
    
    preloadImage.src = src;
}

// Performance monitoring
const imageLoadTimes = new Map();

// Monitor image loading performance
function monitorImagePerformance() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        const startTime = performance.now();
        
        img.addEventListener('load', () => {
            const endTime = performance.now();
            const loadTime = endTime - startTime;
            
            imageLoadTimes.set(img.src, loadTime);
            
            // Log performance data
            console.log(`Image loaded: ${img.src}`);
            console.log(`Load time: ${loadTime.toFixed(2)}ms`);
        });
        
        img.addEventListener('error', () => {
            console.error(`Failed to load image: ${img.src}`);
        });
    });
}

// Initialize performance monitoring
monitorImagePerformance();

// Responsive image loading helper
function handleResponsiveImages() {
    const images = document.querySelectorAll('img[srcset]');
    
    images.forEach(img => {
        // Log which image version was chosen
        console.log(`Chosen source: ${img.currentSrc}`);
    });
}

// Initialize responsive image handling
window.addEventListener('load', handleResponsiveImages);

// WebP support detection
function checkWebPSupport() {
    const elem = document.createElement('canvas');
    
    if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    
    return false;
}

// Add WebP support class to body
document.body.classList.toggle('webp', checkWebPSupport());

// Export utilities for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadImage,
        loadBlurUpImage,
        checkWebPSupport,
        imageLoadTimes
    };
} 