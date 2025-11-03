/**
 * Sistema de Analytics Individual para Tiendas - Cresalia-Web
 * Proporciona métricas específicas para cada tienda individual
 */

class StoreAnalytics {
    constructor(tenantSlug) {
        this.tenantSlug = tenantSlug;
        this.metrics = {
            sales: [],
            messages: [],
            visits: [],
            productViews: [],
            customers: [],
            orders: []
        };
        this.charts = {};
        this.initialized = false;
        this.storeData = null;
    }

    // ===== INICIALIZACIÓN =====
    async initialize() {
        if (this.initialized) return;
        
        try {
            await this.loadStoreData();
            await this.loadMetrics();
            this.setupCharts();
            this.initialized = true;
            console.log(`📊 Analytics de tienda ${this.tenantSlug} inicializado`);
        } catch (error) {
            console.error('❌ Error inicializando analytics de tienda:', error);
        }
    }

    // ===== CARGA DE DATOS =====
    async loadStoreData() {
        try {
            // Intentar cargar desde API
            const response = await fetch(`/api/${this.tenantSlug}/config`);
            if (response.ok) {
                this.storeData = await response.json();
            }
        } catch (error) {
            console.warn('API no disponible, usando datos locales');
        }
        
        // Cargar desde localStorage o datos de ejemplo
        const localData = localStorage.getItem(`cresalia_store_${this.tenantSlug}`);
        if (localData) {
            this.storeData = JSON.parse(localData);
        } else {
            this.storeData = this.getSampleStoreData();
        }
    }

    async loadMetrics() {
        try {
            // Cargar métricas desde API
            this.metrics.sales = await this.getSalesMetrics();
            this.metrics.messages = await this.getMessageMetrics();
            this.metrics.visits = await this.getVisitMetrics();
            this.metrics.productViews = await this.getProductViewMetrics();
            this.metrics.customers = await this.getCustomerMetrics();
            this.metrics.orders = await this.getOrderMetrics();
        } catch (error) {
            console.error('Error cargando métricas:', error);
            this.loadSampleMetrics();
        }
    }

    // ===== MÉTRICAS ESPECÍFICAS =====
    async getSalesMetrics() {
        try {
            const response = await fetch(`/api/${this.tenantSlug}/analytics/sales`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('API de ventas no disponible');
        }
        
        return this.getSampleSalesData();
    }

    async getMessageMetrics() {
        try {
            const response = await fetch(`/api/${this.tenantSlug}/analytics/messages`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('API de mensajes no disponible');
        }
        
        return this.getSampleMessageData();
    }

    async getVisitMetrics() {
        try {
            const response = await fetch(`/api/${this.tenantSlug}/analytics/visits`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('API de visitas no disponible');
        }
        
        return this.getSampleVisitData();
    }

    async getProductViewMetrics() {
        try {
            const response = await fetch(`/api/${this.tenantSlug}/analytics/product-views`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('API de vistas de productos no disponible');
        }
        
        return this.getSampleProductViewData();
    }

    async getCustomerMetrics() {
        try {
            const response = await fetch(`/api/${this.tenantSlug}/analytics/customers`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('API de clientes no disponible');
        }
        
        return this.getSampleCustomerData();
    }

    async getOrderMetrics() {
        try {
            const response = await fetch(`/api/${this.tenantSlug}/analytics/orders`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('API de órdenes no disponible');
        }
        
        return this.getSampleOrderData();
    }

    // ===== DATOS DE EJEMPLO =====
    getSampleStoreData() {
        return {
            nombre: 'TechStore Argentina',
            slug: this.tenantSlug,
            plan: 'pro',
            email: 'admin@techstore.com.ar',
            fecha_creacion: '2024-01-15',
            estado: 'activo',
            productos: 45,
            ventas: 1250,
            clientes: 89
        };
    }

    loadSampleMetrics() {
        this.metrics.sales = this.getSampleSalesData();
        this.metrics.messages = this.getSampleMessageData();
        this.metrics.visits = this.getSampleVisitData();
        this.metrics.productViews = this.getSampleProductViewData();
        this.metrics.customers = this.getSampleCustomerData();
        this.metrics.orders = this.getSampleOrderData();
    }

    getSampleSalesData() {
        const sales = [];
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        
        for (let i = 0; i < 6; i++) {
            sales.push({
                month: months[i],
                total: Math.floor(Math.random() * 5000) + 1000,
                count: Math.floor(Math.random() * 50) + 10,
                average: Math.floor(Math.random() * 200) + 50
            });
        }
        
        return sales;
    }

    getSampleMessageData() {
        const messages = [];
        const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        
        for (let i = 0; i < 7; i++) {
            messages.push({
                day: days[i],
                received: Math.floor(Math.random() * 20) + 5,
                responded: Math.floor(Math.random() * 18) + 3,
                responseTime: Math.floor(Math.random() * 120) + 30 // minutos
            });
        }
        
        return messages;
    }

    getSampleVisitData() {
        const visits = [];
        const hours = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'];
        
        for (let i = 0; i < 12; i++) {
            visits.push({
                hour: hours[i],
                visitors: Math.floor(Math.random() * 100) + 20,
                pageViews: Math.floor(Math.random() * 300) + 50,
                bounceRate: Math.random() * 0.4 + 0.2 // 20-60%
            });
        }
        
        return visits;
    }

    getSampleProductViewData() {
        return [
            { producto: 'iPhone 15 Pro', vistas: 245, ventas: 12, conversion: 4.9 },
            { producto: 'MacBook Air M2', vistas: 189, ventas: 8, conversion: 4.2 },
            { producto: 'AirPods Pro', vistas: 156, ventas: 15, conversion: 9.6 },
            { producto: 'iPad Air', vistas: 134, ventas: 6, conversion: 4.5 },
            { producto: 'Apple Watch', vistas: 98, ventas: 4, conversion: 4.1 }
        ];
    }

    getSampleCustomerData() {
        return [
            { mes: 'Ene', nuevos: 15, total: 15, activos: 12 },
            { mes: 'Feb', nuevos: 18, total: 33, activos: 28 },
            { mes: 'Mar', nuevos: 22, total: 55, activos: 45 },
            { mes: 'Abr', nuevos: 16, total: 71, activos: 58 },
            { mes: 'May', nuevos: 25, total: 96, activos: 78 },
            { mes: 'Jun', nuevos: 19, total: 115, activos: 89 }
        ];
    }

    getSampleOrderData() {
        return [
            { estado: 'Completadas', cantidad: 45, porcentaje: 75 },
            { estado: 'Pendientes', cantidad: 8, porcentaje: 13 },
            { estado: 'Canceladas', cantidad: 4, porcentaje: 7 },
            { estado: 'Reembolsadas', cantidad: 3, porcentaje: 5 }
        ];
    }

    // ===== CONFIGURACIÓN DE GRÁFICOS =====
    setupCharts() {
        this.setupSalesChart();
        this.setupMessageChart();
        this.setupVisitChart();
        this.setupProductViewChart();
        this.setupCustomerChart();
        this.setupOrderChart();
    }

    setupSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.metrics.sales.map(s => s.month),
                datasets: [{
                    label: 'Ventas ($)',
                    data: this.metrics.sales.map(s => s.total),
                    borderColor: '#7C3AED',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Cantidad de Ventas',
                    data: this.metrics.sales.map(s => s.count),
                    borderColor: '#EC4899',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }

    setupMessageChart() {
        const ctx = document.getElementById('messageChart');
        if (!ctx) return;

        this.charts.messages = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.metrics.messages.map(m => m.day),
                datasets: [{
                    label: 'Mensajes Recibidos',
                    data: this.metrics.messages.map(m => m.received),
                    backgroundColor: '#3B82F6',
                    borderRadius: 8
                }, {
                    label: 'Mensajes Respondidos',
                    data: this.metrics.messages.map(m => m.responded),
                    backgroundColor: '#10B981',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    setupVisitChart() {
        const ctx = document.getElementById('visitChart');
        if (!ctx) return;

        this.charts.visits = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.metrics.visits.map(v => v.hour + ':00'),
                datasets: [{
                    label: 'Visitantes',
                    data: this.metrics.visits.map(v => v.visitors),
                    borderColor: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Vistas de Página',
                    data: this.metrics.visits.map(v => v.pageViews),
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }

    setupProductViewChart() {
        const ctx = document.getElementById('productViewChart');
        if (!ctx) return;

        this.charts.productViews = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.metrics.productViews.map(p => p.producto),
                datasets: [{
                    data: this.metrics.productViews.map(p => p.vistas),
                    backgroundColor: [
                        '#7C3AED',
                        '#EC4899',
                        '#10B981',
                        '#F59E0B',
                        '#EF4444'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    setupCustomerChart() {
        const ctx = document.getElementById('customerChart');
        if (!ctx) return;

        this.charts.customers = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.metrics.customers.map(c => c.mes),
                datasets: [{
                    label: 'Nuevos Clientes',
                    data: this.metrics.customers.map(c => c.nuevos),
                    backgroundColor: '#10B981',
                    borderRadius: 8
                }, {
                    label: 'Total Clientes',
                    data: this.metrics.customers.map(c => c.total),
                    backgroundColor: '#7C3AED',
                    borderRadius: 8
                }, {
                    label: 'Clientes Activos',
                    data: this.metrics.customers.map(c => c.activos),
                    backgroundColor: '#F59E0B',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    setupOrderChart() {
        const ctx = document.getElementById('orderChart');
        if (!ctx) return;

        this.charts.orders = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: this.metrics.orders.map(o => o.estado),
                datasets: [{
                    data: this.metrics.orders.map(o => o.cantidad),
                    backgroundColor: [
                        '#10B981',
                        '#F59E0B',
                        '#EF4444',
                        '#6B7280'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // ===== CÁLCULOS DE MÉTRICAS =====
    getTotalSales() {
        return this.metrics.sales.reduce((total, sale) => total + sale.total, 0);
    }

    getTotalMessages() {
        return this.metrics.messages.reduce((total, msg) => total + msg.received, 0);
    }

    getTotalResponses() {
        return this.metrics.messages.reduce((total, msg) => total + msg.responded, 0);
    }

    getResponseRate() {
        const total = this.getTotalMessages();
        const responded = this.getTotalResponses();
        return total > 0 ? (responded / total * 100).toFixed(1) : 0;
    }

    getTotalVisits() {
        return this.metrics.visits.reduce((total, visit) => total + visit.visitors, 0);
    }

    getTotalPageViews() {
        return this.metrics.visits.reduce((total, visit) => total + visit.pageViews, 0);
    }

    getAverageBounceRate() {
        const total = this.metrics.visits.reduce((total, visit) => total + visit.bounceRate, 0);
        return (total / this.metrics.visits.length * 100).toFixed(1);
    }

    getTotalProductViews() {
        return this.metrics.productViews.reduce((total, product) => total + product.vistas, 0);
    }

    getTotalCustomers() {
        return this.metrics.customers[this.metrics.customers.length - 1]?.total || 0;
    }

    getActiveCustomers() {
        return this.metrics.customers[this.metrics.customers.length - 1]?.activos || 0;
    }

    getTotalOrders() {
        return this.metrics.orders.reduce((total, order) => total + order.cantidad, 0);
    }

    getCompletedOrders() {
        return this.metrics.orders.find(o => o.estado === 'Completadas')?.cantidad || 0;
    }

    // ===== ACTUALIZACIÓN DE UI =====
    updateMetricsDisplay() {
        // Actualizar métricas principales
        this.updateElement('totalSales', '$' + this.getTotalSales().toLocaleString());
        this.updateElement('totalMessages', this.getTotalMessages());
        this.updateElement('responseRate', this.getResponseRate() + '%');
        this.updateElement('totalVisits', this.getTotalVisits().toLocaleString());
        this.updateElement('totalPageViews', this.getTotalPageViews().toLocaleString());
        this.updateElement('bounceRate', this.getAverageBounceRate() + '%');
        this.updateElement('totalProductViews', this.getTotalProductViews().toLocaleString());
        this.updateElement('totalCustomers', this.getTotalCustomers());
        this.updateElement('activeCustomers', this.getActiveCustomers());
        this.updateElement('totalOrders', this.getTotalOrders());
        this.updateElement('completedOrders', this.getCompletedOrders());

        // Actualizar tabla de productos más vistos
        this.updateProductViewsTable();
        
        // Actualizar tabla de órdenes
        this.updateOrdersTable();
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    updateProductViewsTable() {
        const container = document.getElementById('productViewsTable');
        if (!container) return;

        const html = this.metrics.productViews.map(product => `
            <tr>
                <td>
                    <div class="product-info">
                        <div class="product-name">${product.producto}</div>
                    </div>
                </td>
                <td>${product.vistas.toLocaleString()}</td>
                <td>${product.ventas}</td>
                <td>
                    <span class="conversion-rate">${product.conversion}%</span>
                </td>
            </tr>
        `).join('');

        container.innerHTML = html;
    }

    updateOrdersTable() {
        const container = document.getElementById('ordersTable');
        if (!container) return;

        const html = this.metrics.orders.map(order => `
            <tr>
                <td>
                    <span class="status-badge status-${order.estado.toLowerCase()}">${order.estado}</span>
                </td>
                <td>${order.cantidad}</td>
                <td>${order.porcentaje}%</td>
            </tr>
        `).join('');

        container.innerHTML = html;
    }

    // ===== EXPORTACIÓN =====
    exportStoreMetrics() {
        const data = {
            store: this.storeData,
            metrics: this.metrics,
            summary: {
                totalSales: this.getTotalSales(),
                totalMessages: this.getTotalMessages(),
                responseRate: this.getResponseRate(),
                totalVisits: this.getTotalVisits(),
                totalCustomers: this.getTotalCustomers(),
                totalOrders: this.getTotalOrders()
            },
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.tenantSlug}-metrics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    // ===== ACTUALIZACIÓN AUTOMÁTICA =====
    startAutoUpdate(interval = 300000) { // 5 minutos
        setInterval(() => {
            this.loadMetrics().then(() => {
                this.updateMetricsDisplay();
                this.updateCharts();
            });
        }, interval);
    }

    updateCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.update === 'function') {
                chart.update();
            }
        });
    }

    // ===== DESTRUCCIÓN =====
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
        this.initialized = false;
    }
}

// ===== INSTANCIA GLOBAL =====
window.storeAnalytics = null;

// ===== INICIALIZACIÓN AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el slug de la tienda desde la URL o configuración
    const tenantSlug = getTenantSlug();
    
    if (tenantSlug) {
        window.storeAnalytics = new StoreAnalytics(tenantSlug);
        
        // Esperar a que Chart.js esté disponible
        if (typeof Chart !== 'undefined') {
            window.storeAnalytics.initialize();
        } else {
            // Cargar Chart.js dinámicamente
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => {
                window.storeAnalytics.initialize();
            };
            document.head.appendChild(script);
        }
    }
});

// ===== UTILIDADES =====
function getTenantSlug() {
    // Intentar obtener desde la URL
    const path = window.location.pathname;
    const match = path.match(/\/tiendas\/([^\/]+)\//);
    if (match) {
        return match[1];
    }
    
    // Intentar obtener desde localStorage
    const stored = localStorage.getItem('current_tenant_slug');
    if (stored) {
        return stored;
    }
    
    // Usar slug por defecto
    return 'ejemplo-tienda';
}

// ===== EXPORTACIÓN PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoreAnalytics;
}
