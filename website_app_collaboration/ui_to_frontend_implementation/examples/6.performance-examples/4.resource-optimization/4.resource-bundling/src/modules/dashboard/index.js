// Import dependencies
import Chart from 'chart.js/auto';
import { format } from 'date-fns';
import { debounce } from 'lodash-es';

// Import styles
import './styles.css';

// Import components lazily
const StatCard = () => import(/* webpackChunkName: "stat-card" */ './components/StatCard');
const DataTable = () => import(/* webpackChunkName: "data-table" */ './components/DataTable');
const FilterPanel = () => import(/* webpackChunkName: "filter-panel" */ './components/FilterPanel');

export default class Dashboard {
    constructor() {
        this.charts = new Map();
        this.components = new Map();
        this.data = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Load data
            const { default: dashboardData } = await import(
                /* webpackChunkName: "dashboard-data" */
                './data/dashboard-data'
            );
            this.data = dashboardData;

            // Initialize components
            await this.initializeComponents();

            // Setup charts
            this.setupCharts();

            // Setup event listeners
            this.setupEventListeners();

            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            throw error;
        }
    }

    async initializeComponents() {
        // Load and initialize components
        const [
            StatCardModule,
            DataTableModule,
            FilterPanelModule
        ] = await Promise.all([
            StatCard(),
            DataTable(),
            FilterPanel()
        ]);

        // Create component instances
        this.components.set('statCard', new StatCardModule.default());
        this.components.set('dataTable', new DataTableModule.default());
        this.components.set('filterPanel', new FilterPanelModule.default());

        // Initialize each component
        for (const component of this.components.values()) {
            await component.initialize(this.data);
        }
    }

    setupCharts() {
        const visitorsCtx = document.getElementById('visitors-chart');
        const revenueCtx = document.getElementById('revenue-chart');
        const conversionCtx = document.getElementById('conversion-chart');

        if (visitorsCtx) {
            this.charts.set('visitors', new Chart(visitorsCtx, {
                type: 'line',
                data: this.getVisitorsData(),
                options: this.getChartOptions('Daily Visitors')
            }));
        }

        if (revenueCtx) {
            this.charts.set('revenue', new Chart(revenueCtx, {
                type: 'bar',
                data: this.getRevenueData(),
                options: this.getChartOptions('Revenue')
            }));
        }

        if (conversionCtx) {
            this.charts.set('conversion', new Chart(conversionCtx, {
                type: 'doughnut',
                data: this.getConversionData(),
                options: this.getChartOptions('Conversion Rate')
            }));
        }
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            this.charts.forEach(chart => chart.resize());
        }, 250));

        // Handle filter changes
        const filterPanel = this.components.get('filterPanel');
        if (filterPanel) {
            filterPanel.on('filterChange', this.handleFilterChange.bind(this));
        }

        // Handle data refresh
        const refreshButton = document.getElementById('refresh-data');
        if (refreshButton) {
            refreshButton.addEventListener('click', this.handleDataRefresh.bind(this));
        }
    }

    getVisitorsData() {
        const dates = this.getLast30Days();
        return {
            labels: dates.map(date => format(date, 'MMM d')),
            datasets: [{
                label: 'Visitors',
                data: this.data.visitors,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        };
    }

    getRevenueData() {
        const dates = this.getLast30Days();
        return {
            labels: dates.map(date => format(date, 'MMM d')),
            datasets: [{
                label: 'Revenue',
                data: this.data.revenue,
                backgroundColor: '#2ecc71',
                borderColor: '#27ae60',
                borderWidth: 1
            }]
        };
    }

    getConversionData() {
        return {
            labels: ['Converted', 'Not Converted'],
            datasets: [{
                data: [this.data.conversionRate, 100 - this.data.conversionRate],
                backgroundColor: ['#2ecc71', '#e74c3c']
            }]
        };
    }

    getChartOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            }
        };
    }

    getLast30Days() {
        const dates = [];
        for (let i = 29; i >= 0; i--) {
            dates.push(new Date(Date.now() - i * 24 * 60 * 60 * 1000));
        }
        return dates;
    }

    async handleFilterChange(filters) {
        try {
            // Update data based on filters
            const { default: filteredData } = await import(
                /* webpackChunkName: "filter-data" */
                './data/filter-data'
            );
            this.data = await filteredData(filters);

            // Update charts
            this.updateCharts();

            // Update components
            this.updateComponents();
        } catch (error) {
            console.error('Failed to apply filters:', error);
        }
    }

    async handleDataRefresh() {
        try {
            // Show loading state
            this.showLoading();

            // Fetch new data
            const { default: refreshData } = await import(
                /* webpackChunkName: "refresh-data" */
                './data/refresh-data'
            );
            this.data = await refreshData();

            // Update UI
            this.updateCharts();
            this.updateComponents();
        } catch (error) {
            console.error('Failed to refresh data:', error);
        } finally {
            // Hide loading state
            this.hideLoading();
        }
    }

    updateCharts() {
        this.charts.forEach((chart, key) => {
            switch (key) {
                case 'visitors':
                    chart.data = this.getVisitorsData();
                    break;
                case 'revenue':
                    chart.data = this.getRevenueData();
                    break;
                case 'conversion':
                    chart.data = this.getConversionData();
                    break;
            }
            chart.update();
        });
    }

    updateComponents() {
        this.components.forEach(component => {
            component.update(this.data);
        });
    }

    showLoading() {
        const container = document.querySelector('.dashboard');
        if (container) {
            container.classList.add('loading');
        }
    }

    hideLoading() {
        const container = document.querySelector('.dashboard');
        if (container) {
            container.classList.remove('loading');
        }
    }

    destroy() {
        // Cleanup charts
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();

        // Cleanup components
        this.components.forEach(component => component.destroy());
        this.components.clear();

        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
    }

    render(container) {
        container.innerHTML = `
            <div class="dashboard">
                <header class="dashboard-header">
                    <h1>Dashboard</h1>
                    <button id="refresh-data" class="button">Refresh Data</button>
                </header>

                <div id="filter-panel"></div>

                <div class="dashboard-grid">
                    <div class="chart-container">
                        <canvas id="visitors-chart"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="revenue-chart"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="conversion-chart"></canvas>
                    </div>
                </div>

                <div class="dashboard-stats"></div>
                <div class="dashboard-table"></div>
            </div>
        `;

        // Initialize after DOM is ready
        this.initialize().catch(error => {
            container.innerHTML = `
                <div class="error-message">
                    Failed to initialize dashboard: ${error.message}
                </div>
            `;
        });
    }
} 