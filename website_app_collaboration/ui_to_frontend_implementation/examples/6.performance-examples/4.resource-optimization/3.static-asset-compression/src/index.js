// Import styles
import './styles/main.css';
import { initializeUI } from './modules/ui';
import { setupAnalytics } from './modules/analytics';
import { setupRouter } from './modules/router';

// Lazy loaded components
const DashboardComponent = () => import(/* webpackChunkName: "dashboard" */ './components/Dashboard');
const ProfileComponent = () => import(/* webpackChunkName: "profile" */ './components/Profile');
const SettingsComponent = () => import(/* webpackChunkName: "settings" */ './components/Settings');

// Initialize application
class App {
    constructor() {
        this.initialized = false;
        this.components = new Map();
    }

    async initialize() {
        if (this.initialized) return;

        // Initialize core modules
        initializeUI();
        setupAnalytics();
        setupRouter();

        // Register event listeners
        this.registerEventListeners();

        // Mark as initialized
        this.initialized = true;
        console.log('Application initialized');
    }

    registerEventListeners() {
        // Navigation handling
        document.addEventListener('click', async (e) => {
            const link = e.target.closest('a[data-route]');
            if (!link) return;

            e.preventDefault();
            const route = link.dataset.route;
            await this.loadComponent(route);
        });

        // Performance monitoring
        if ('performance' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    console.log(`Resource loaded: ${entry.name}`, {
                        duration: entry.duration,
                        size: entry.encodedBodySize
                    });
                });
            });

            observer.observe({ entryTypes: ['resource'] });
        }
    }

    async loadComponent(route) {
        try {
            let component;
            switch (route) {
                case 'dashboard':
                    component = await DashboardComponent();
                    break;
                case 'profile':
                    component = await ProfileComponent();
                    break;
                case 'settings':
                    component = await SettingsComponent();
                    break;
                default:
                    throw new Error(`Unknown route: ${route}`);
            }

            this.components.set(route, component);
            this.renderComponent(route);
        } catch (error) {
            console.error('Failed to load component:', error);
        }
    }

    renderComponent(route) {
        const component = this.components.get(route);
        if (!component) return;

        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        // Clear existing content
        mainContent.innerHTML = '';

        // Render new component
        const componentInstance = new component.default();
        mainContent.appendChild(componentInstance.render());
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.initialize().catch(error => {
        console.error('Failed to initialize application:', error);
    });
});

// Enable HMR in development
if (module.hot) {
    module.hot.accept();
}

// Export for testing
export default App; 