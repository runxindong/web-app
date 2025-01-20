// Import styles
import './styles/main.css';

// Import core functionality
import { initializeApp } from './core/app';
import { setupRouter } from './core/router';
import { initializeAnalytics } from './core/analytics';

// Import utilities
import { logger } from './utils/logger';
import { storage } from './utils/storage';

// Lazy loaded modules
const loadDashboard = () => import(/* webpackChunkName: "dashboard" */ './modules/dashboard');
const loadProfile = () => import(/* webpackChunkName: "profile" */ './modules/profile');
const loadSettings = () => import(/* webpackChunkName: "settings" */ './modules/settings');

// Route configuration
const routes = {
    dashboard: {
        path: '/',
        load: loadDashboard,
        preload: true
    },
    profile: {
        path: '/profile',
        load: loadProfile
    },
    settings: {
        path: '/settings',
        load: loadSettings
    }
};

// Initialize application
class Application {
    constructor() {
        this.initialized = false;
        this.modules = new Map();
    }

    async initialize() {
        try {
            logger.info('Initializing application...');

            // Initialize core functionality
            await initializeApp();
            await initializeAnalytics();

            // Setup router
            const router = setupRouter(routes);
            router.on('routeChange', this.handleRouteChange.bind(this));

            // Preload critical modules
            await this.preloadCriticalModules();

            this.initialized = true;
            logger.info('Application initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize application:', error);
            throw error;
        }
    }

    async preloadCriticalModules() {
        const criticalRoutes = Object.entries(routes)
            .filter(([, config]) => config.preload)
            .map(([key]) => key);

        await Promise.all(
            criticalRoutes.map(async (route) => {
                try {
                    const module = await routes[route].load();
                    this.modules.set(route, module);
                    logger.info(`Preloaded module: ${route}`);
                } catch (error) {
                    logger.error(`Failed to preload module ${route}:`, error);
                }
            })
        );
    }

    async handleRouteChange(route) {
        try {
            logger.info(`Route changed to: ${route}`);

            // Load module if not already loaded
            if (!this.modules.has(route)) {
                const module = await routes[route].load();
                this.modules.set(route, module);
            }

            // Render module
            const module = this.modules.get(route);
            await this.renderModule(module);

            // Update storage
            storage.set('lastRoute', route);
        } catch (error) {
            logger.error(`Failed to handle route change to ${route}:`, error);
        }
    }

    async renderModule(module) {
        const container = document.getElementById('app');
        if (!container) return;

        try {
            // Clear existing content
            container.innerHTML = '';

            // Create and render new module
            const instance = new module.default();
            await instance.render(container);
        } catch (error) {
            logger.error('Failed to render module:', error);
            container.innerHTML = '<div class="error">Failed to load content</div>';
        }
    }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new Application();
    app.initialize().catch(error => {
        console.error('Failed to start application:', error);
        document.body.innerHTML = `
            <div class="error-screen">
                <h1>Application Error</h1>
                <p>Failed to initialize the application. Please try refreshing the page.</p>
                <pre>${error.message}</pre>
            </div>
        `;
    });
});

// Enable HMR in development
if (module.hot) {
    module.hot.accept();
}

// Export for testing
export default Application; 