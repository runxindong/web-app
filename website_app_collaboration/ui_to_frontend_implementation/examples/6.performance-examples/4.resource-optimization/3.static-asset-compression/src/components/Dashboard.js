// Import dependencies
import { Chart } from 'chart.js';
import { format } from 'date-fns';
import { debounce } from 'lodash-es';

// Import styles
import './Dashboard.css';

export default class Dashboard {
    constructor() {
        this.charts = new Map();
        this.data = null;
    }

    async initialize() {
        // Load data lazily
        this.data = await import(/* webpackChunkName: "dashboard-data" */ '../data/dashboard');
        
        // Initialize charts with debounced resize handler
        this.initializeCharts();
        window.addEventListener('resize', debounce(this.handleResize.bind(this), 250));
    }

    initializeCharts() {
        const visitorsCtx = document.getElementById('visitors-chart');
        const revenueCtx = document.getElementById('revenue-chart');

        if (visitorsCtx) {
            this.charts.set('visitors', new Chart(visitorsCtx, {
                type: 'line',
                data: this.getVisitorsData(),
                options: this.getChartOptions('Visitors')
            }));
        }

        if (revenueCtx) {
            this.charts.set('revenue', new Chart(revenueCtx, {
                type: 'bar',
                data: this.getRevenueData(),
                options: this.getChartOptions('Revenue')
            }));
        }
    }

    getVisitorsData() {
        const dates = this.getLast30Days();
        return {
            labels: dates.map(date => format(date, 'MMM d')),
            datasets: [{
                label: 'Daily Visitors',
                data: this.generateRandomData(30, 1000, 5000),
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
                label: 'Daily Revenue',
                data: this.generateRandomData(30, 5000, 15000),
                backgroundColor: '#2ecc71',
                borderColor: '#27ae60',
                borderWidth: 1
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
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
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

    generateRandomData(count, min, max) {
        return Array.from({ length: count }, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
        );
    }

    handleResize() {
        this.charts.forEach(chart => chart.resize());
    }

    render() {
        const container = document.createElement('div');
        container.className = 'dashboard';
        
        container.innerHTML = `
            <div class="dashboard-header">
                <h1>Dashboard</h1>
                <div class="date-range">
                    <span>Last 30 Days</span>
                </div>
            </div>
            
            <div class="dashboard-grid">
                <div class="chart-container">
                    <canvas id="visitors-chart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="revenue-chart"></canvas>
                </div>
            </div>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Total Visitors</h3>
                    <p class="stat-value">124,567</p>
                    <span class="stat-change positive">+12.5%</span>
                </div>
                <div class="stat-card">
                    <h3>Total Revenue</h3>
                    <p class="stat-value">$45,678</p>
                    <span class="stat-change positive">+8.3%</span>
                </div>
                <div class="stat-card">
                    <h3>Conversion Rate</h3>
                    <p class="stat-value">3.2%</p>
                    <span class="stat-change negative">-0.5%</span>
                </div>
            </div>
        `;

        // Initialize after DOM is ready
        setTimeout(() => this.initialize(), 0);

        return container;
    }

    destroy() {
        // Cleanup charts
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();

        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
    }
} 