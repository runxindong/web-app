/**
 * 数据可视化示例
 */

(() => {
    // 图表管理器
    class ChartManager {
        constructor() {
            this.charts = {
                line: null,
                bar: null,
                pie: null
            };
            
            this.dataRange = document.getElementById('chartDataRange');
            this.updateButton = document.getElementById('updateCharts');
            
            this.init();
        }

        init() {
            // 初始化图表
            this.initializeCharts();
            
            // 绑定事件
            this.updateButton?.addEventListener('click', () => this.updateAllCharts());
            this.dataRange?.addEventListener('change', () => this.updateAllCharts());
        }

        // 初始化所有图表
        initializeCharts() {
            // 折线图
            this.charts.line = echarts.init(document.getElementById('lineChart'));
            this.setupLineChart();

            // 柱状图
            this.charts.bar = echarts.init(document.getElementById('barChart'));
            this.setupBarChart();

            // 饼图
            this.charts.pie = echarts.init(document.getElementById('pieChart'));
            this.setupPieChart();

            // 响应窗口大小变化
            window.addEventListener('resize', () => {
                Object.values(this.charts).forEach(chart => {
                    chart?.resize();
                });
            });
        }

        // 设置折线图
        setupLineChart() {
            const option = {
                title: {
                    text: '访问量趋势'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['页面浏览量', '独立访客']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '页面浏览量',
                        type: 'line',
                        smooth: true,
                        data: []
                    },
                    {
                        name: '独立访客',
                        type: 'line',
                        smooth: true,
                        data: []
                    }
                ]
            };

            this.charts.line?.setOption(option);
        }

        // 设置柱状图
        setupBarChart() {
            const option = {
                title: {
                    text: '用户分布'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['新用户', '活跃用户']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '新用户',
                        type: 'bar',
                        data: []
                    },
                    {
                        name: '活跃用户',
                        type: 'bar',
                        data: []
                    }
                ]
            };

            this.charts.bar?.setOption(option);
        }

        // 设置饼图
        setupPieChart() {
            const option = {
                title: {
                    text: '流量来源'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    data: []
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: []
                    }
                ]
            };

            this.charts.pie?.setOption(option);
        }

        // 更新所有图表
        async updateAllCharts() {
            const days = this.dataRange?.value || 7;
            
            try {
                // 获取数据
                const data = await this.fetchChartData(days);
                
                // 更新各个图表
                this.updateLineChart(data.lineData);
                this.updateBarChart(data.barData);
                this.updatePieChart(data.pieData);
            } catch (error) {
                this.handleError(error);
            }
        }

        // 获取图表数据
        async fetchChartData(days) {
            const response = await fetch(`https://api.example.com/chart-data?days=${days}`);
            
            if (!response.ok) {
                throw new Error('获取数据失败');
            }
            
            return response.json();
        }

        // 更新折线图
        updateLineChart(data) {
            const option = {
                xAxis: {
                    data: data.dates
                },
                series: [
                    {
                        name: '页面浏览量',
                        data: data.pageviews
                    },
                    {
                        name: '独立访客',
                        data: data.visitors
                    }
                ]
            };

            this.charts.line?.setOption(option);
        }

        // 更新柱状图
        updateBarChart(data) {
            const option = {
                xAxis: {
                    data: data.categories
                },
                series: [
                    {
                        name: '新用户',
                        data: data.newUsers
                    },
                    {
                        name: '活跃用户',
                        data: data.activeUsers
                    }
                ]
            };

            this.charts.bar?.setOption(option);
        }

        // 更新饼图
        updatePieChart(data) {
            const option = {
                legend: {
                    data: data.map(item => item.name)
                },
                series: [
                    {
                        data: data
                    }
                ]
            };

            this.charts.pie?.setOption(option);
        }

        // 处理错误
        handleError(error) {
            console.error('Chart Error:', error);
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chart-error';
            errorMessage.textContent = error.message || '更新图表失败';
            
            document.querySelector('.chart-container')?.appendChild(errorMessage);

            // 3秒后移除错误消息
            setTimeout(() => {
                errorMessage.remove();
            }, 3000);
        }
    }

    // 数据表格管理器
    class DataGridManager {
        constructor() {
            this.grid = document.getElementById('dataGrid');
            this.exportButton = document.getElementById('exportData');
            this.printButton = document.getElementById('printData');
            this.data = [];
            
            this.init();
        }

        init() {
            // 初始化表格
            this.initializeGrid();
            
            // 绑定事件
            this.exportButton?.addEventListener('click', () => this.exportData());
            this.printButton?.addEventListener('click', () => this.printData());
        }

        // 初始化表格
        async initializeGrid() {
            try {
                // 获取数据
                this.data = await this.fetchGridData();
                
                // 渲染表格
                this.renderGrid();
            } catch (error) {
                this.handleError(error);
            }
        }

        // 获取表格数据
        async fetchGridData() {
            const response = await fetch('https://api.example.com/grid-data');
            
            if (!response.ok) {
                throw new Error('获取数据失败');
            }
            
            return response.json();
        }

        // 渲染表格
        renderGrid() {
            if (!this.grid || !this.data.length) return;

            // 创建表格头
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    ${Object.keys(this.data[0]).map(key => `
                        <th>${this.formatColumnName(key)}</th>
                    `).join('')}
                </tr>
            `;

            // 创建表格体
            const tbody = document.createElement('tbody');
            tbody.innerHTML = this.data.map(row => `
                <tr>
                    ${Object.values(row).map(value => `
                        <td>${this.formatCellValue(value)}</td>
                    `).join('')}
                </tr>
            `).join('');

            // 清空并添加新内容
            this.grid.innerHTML = '';
            this.grid.appendChild(thead);
            this.grid.appendChild(tbody);

            // 添加排序功能
            this.addSorting();
        }

        // 格式化列名
        formatColumnName(name) {
            return name
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
        }

        // 格式化单元格值
        formatCellValue(value) {
            if (value === null || value === undefined) {
                return '-';
            }
            
            if (typeof value === 'number') {
                return value.toLocaleString();
            }
            
            if (value instanceof Date) {
                return value.toLocaleDateString();
            }
            
            return value.toString();
        }

        // 添加排序功能
        addSorting() {
            const headers = this.grid.querySelectorAll('th');
            
            headers.forEach((header, index) => {
                header.style.cursor = 'pointer';
                header.addEventListener('click', () => this.sortGrid(index));
            });
        }

        // 排序表格
        sortGrid(columnIndex) {
            const tbody = this.grid.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            // 获取当前排序方向
            const currentDir = tbody.getAttribute('data-sort-dir') === 'asc' ? 'desc' : 'asc';
            tbody.setAttribute('data-sort-dir', currentDir);

            // 排序行
            rows.sort((a, b) => {
                const aValue = a.cells[columnIndex].textContent;
                const bValue = b.cells[columnIndex].textContent;
                
                return currentDir === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            });

            // 重新插入排序后的行
            rows.forEach(row => tbody.appendChild(row));
        }

        // 导出数据
        exportData() {
            // 创建CSV内容
            const headers = Object.keys(this.data[0]);
            const csv = [
                headers.join(','),
                ...this.data.map(row => 
                    headers.map(key => JSON.stringify(row[key])).join(',')
                )
            ].join('\n');

            // 创建下载链接
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'data_export.csv';
            
            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // 打印数据
        printData() {
            // 创建打印样式
            const style = document.createElement('style');
            style.textContent = `
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #dataGrid, #dataGrid * {
                        visibility: visible;
                    }
                    #dataGrid {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                }
            `;
            
            document.head.appendChild(style);
            window.print();
            document.head.removeChild(style);
        }

        // 处理错误
        handleError(error) {
            console.error('Grid Error:', error);
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'grid-error';
            errorMessage.textContent = error.message || '加载数据失败';
            
            this.grid?.parentElement?.appendChild(errorMessage);
        }
    }

    // 初始化管理器
    new ChartManager();
    new DataGridManager();
})(); 