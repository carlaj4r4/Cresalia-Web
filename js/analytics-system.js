/**
 * Sistema de Analytics y Métricas - Cresalia-Web
 * Proporciona métricas detalladas para la gestión de tiendas
 */

class AnalyticsSystem {
    constructor() {
        this.metrics = {
            tenants: [],
            sales: [],
            products: [],
            customers: [],
            subscriptions: []
        };
        this.charts = {};
        this.initialized = false;
    }

    // ===== INICIALIZACIÓN =====
    async initialize() {
        if (this.initialized) return;
        
        try {
            await this.loadMetrics();
            this.setupCharts();
            this.initialized = true;
            console.log('📊 Sistema de Analytics inicializado');
        } catch (error) {
            console.error('❌ Error inicializando analytics:', error);
        }
    }

    // ===== CARGA DE DATOS =====
    async loadMetrics() {
        try {
            // Cargar datos de tenants
            this.metrics.tenants = await this.getTenantsData();
            
            // Cargar datos de ventas
            this.metrics.sales = await this.getSalesData();
            
            // Cargar datos de productos
            this.metrics.products = await this.getProductsData();
            
            // Cargar datos de clientes
            this.metrics.customers = await this.getCustomersData();
            
            // Cargar datos de suscripciones
            this.metrics.subscriptions = await this.getSubscriptionsData();
            
        } catch (error) {
            console.error('Error cargando métricas:', error);
            // Usar datos de ejemplo si hay error
            this.loadSampleData();
        }
    }

    async getTenantsData() {
        // Intentar cargar desde API
        try {
            const response = await fetch('/api/tenants');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('API no disponible, usando datos locales');
        }
        
        // Cargar desde localStorage o datos de ejemplo
        const localData = localStorage.getItem('cresalia_tenants');
        if (localData) {
            return JSON.parse(localData);
        }
        
        return this.getSampleTenants();
    }

    async getSalesData() {
        try {
            const response = await fetch('/api/analytics/sales');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('API de ventas no disponible');
        }
        
        return this.getSampleSales();
    }

    async getProductsData() {
        try {
            const response = await fetch('/api/analytics/products');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('API de productos no disponible');
        }
        
        return this.getSampleProducts();
    }

    async getCustomersData() {
        try {
            const response = await fetch('/api/analytics/customers');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('API de clientes no disponible');
        }
        
        return this.getSampleCustomers();
    }

    async getSubscriptionsData() {
        try {
            const response = await fetch('/api/analytics/subscriptions');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('API de suscripciones no disponible');
        }
        
        return this.getSampleSubscriptions();
    }

    // ===== DATOS DE EJEMPLO =====
    loadSampleData() {
        this.metrics.tenants = this.getSampleTenants();
        this.metrics.sales = this.getSampleSales();
        this.metrics.products = this.getSampleProducts();
        this.metrics.customers = this.getSampleCustomers();
        this.metrics.subscriptions = this.getSampleSubscriptions();
    }

    getSampleTenants() {
        return [
            {
                id: 1,
                nombre: 'TechStore Argentina',
                slug: 'techstore-ar',
                plan: 'pro',
                email: 'admin@techstore.com.ar',
                fecha_creacion: '2024-01-15',
                estado: 'activo',
                productos: 45,
                ventas: 1250,
                clientes: 89
            },
            {
                id: 2,
                nombre: 'Moda Latina Boutique',
                slug: 'moda-latina',
                plan: 'basico',
                email: 'info@modalatina.com',
                fecha_creacion: '2024-02-20',
                estado: 'activo',
                productos: 23,
                ventas: 890,
                clientes: 56
            },
            {
                id: 3,
                nombre: 'Casa del Emprendedor',
                slug: 'casa-emprendedor',
                plan: 'enterprise',
                email: 'contacto@casadelemprendedor.com',
                fecha_creacion: '2024-03-10',
                estado: 'activo',
                productos: 78,
                ventas: 2100,
                clientes: 145
            },
            {
                id: 4,
                nombre: 'Arte y Diseño',
                slug: 'arte-diseno',
                plan: 'free',
                email: 'arte@artediseno.com',
                fecha_creacion: '2024-04-05',
                estado: 'activo',
                productos: 12,
                ventas: 340,
                clientes: 23
            }
        ];
    }

    getSampleSales() {
        const sales = [];
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        
        for (let i = 0; i < 6; i++) {
            sales.push({
                month: months[i],
                total: Math.floor(Math.random() * 5000) + 1000,
                count: Math.floor(Math.random() * 100) + 20
            });
        }
        
        return sales;
    }

    getSampleProducts() {
        return [
            { categoria: 'Electrónicos', cantidad: 45, porcentaje: 35 },
            { categoria: 'Ropa', cantidad: 32, porcentaje: 25 },
            { categoria: 'Hogar', cantidad: 28, porcentaje: 22 },
            { categoria: 'Deportes', cantidad: 15, porcentaje: 12 },
            { categoria: 'Otros', cantidad: 8, porcentaje: 6 }
        ];
    }

    getSampleCustomers() {
        return [
            { mes: 'Ene', nuevos: 45, total: 45 },
            { mes: 'Feb', nuevos: 32, total: 77 },
            { mes: 'Mar', nuevos: 28, total: 105 },
            { mes: 'Abr', nuevos: 35, total: 140 },
            { mes: 'May', nuevos: 42, total: 182 },
            { mes: 'Jun', nuevos: 38, total: 220 }
        ];
    }

    getSampleSubscriptions() {
        return [
            { plan: 'Free', cantidad: 15, porcentaje: 37.5 },
            { plan: 'Básico', cantidad: 12, porcentaje: 30 },
            { plan: 'Pro', cantidad: 10, porcentaje: 25 },
            { plan: 'Enterprise', cantidad: 3, porcentaje: 7.5 }
        ];
    }

    // ===== CONFIGURACIÓN DE GRÁFICOS =====
    setupCharts() {
        this.setupSalesChart();
        this.setupProductsChart();
        this.setupCustomersChart();
        this.setupSubscriptionsChart();
        this.setupRevenueChart();
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
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    setupProductsChart() {
        const ctx = document.getElementById('productsChart');
        if (!ctx) return;

        this.charts.products = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.metrics.products.map(p => p.categoria),
                datasets: [{
                    data: this.metrics.products.map(p => p.cantidad),
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

    setupCustomersChart() {
        const ctx = document.getElementById('customersChart');
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
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    setupSubscriptionsChart() {
        const ctx = document.getElementById('subscriptionsChart');
        if (!ctx) return;

        this.charts.subscriptions = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: this.metrics.subscriptions.map(s => s.plan),
                datasets: [{
                    data: this.metrics.subscriptions.map(s => s.cantidad),
                    backgroundColor: [
                        '#6B7280',
                        '#3B82F6',
                        '#7C3AED',
                        '#EC4899'
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

    setupRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        const revenueData = this.calculateRevenueByPlan();
        
        this.charts.revenue = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: revenueData.map(r => r.plan),
                datasets: [{
                    label: 'Ingresos Mensuales ($)',
                    data: revenueData.map(r => r.revenue),
                    backgroundColor: [
                        '#6B7280',
                        '#3B82F6',
                        '#7C3AED',
                        '#EC4899'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // ===== CÁLCULOS DE MÉTRICAS =====
    calculateRevenueByPlan() {
        const planPrices = {
            'free': 0,
            'basico': 29,
            'pro': 79,
            'enterprise': 199
        };

        return this.metrics.subscriptions.map(sub => ({
            plan: sub.plan,
            revenue: sub.cantidad * planPrices[sub.plan.toLowerCase()] || 0
        }));
    }

    getTotalRevenue() {
        return this.calculateRevenueByPlan().reduce((total, plan) => total + plan.revenue, 0);
    }

    getTotalTenants() {
        return this.metrics.tenants.length;
    }

    getActiveTenants() {
        return this.metrics.tenants.filter(t => t.estado === 'activo').length;
    }

    getTotalProducts() {
        return this.metrics.tenants.reduce((total, tenant) => total + tenant.productos, 0);
    }

    getTotalSales() {
        return this.metrics.tenants.reduce((total, tenant) => total + tenant.ventas, 0);
    }

    getTotalCustomers() {
        return this.metrics.tenants.reduce((total, tenant) => total + tenant.clientes, 0);
    }

    // ===== ACTUALIZACIÓN DE UI =====
    updateMetricsDisplay() {
        // Actualizar métricas principales
        this.updateElement('totalTenants', this.getTotalTenants());
        this.updateElement('activeTenants', this.getActiveTenants());
        this.updateElement('totalRevenue', '$' + this.getTotalRevenue().toLocaleString());
        this.updateElement('totalProducts', this.getTotalProducts());
        this.updateElement('totalSales', this.getTotalSales().toLocaleString());
        this.updateElement('totalCustomers', this.getTotalCustomers());

        // Actualizar métricas por plan
        this.updatePlanMetrics();
        
        // Actualizar tabla de tenants
        this.updateTenantsTable();
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    updatePlanMetrics() {
        const planStats = this.metrics.subscriptions;
        const container = document.getElementById('planMetrics');
        if (!container) return;

        const html = planStats.map(plan => `
            <div class="plan-metric">
                <div class="plan-name">${plan.plan}</div>
                <div class="plan-count">${plan.cantidad}</div>
                <div class="plan-percentage">${plan.porcentaje}%</div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    updateTenantsTable() {
        const container = document.getElementById('tenantsTable');
        if (!container) return;

        const html = this.metrics.tenants.map(tenant => `
            <tr>
                <td>
                    <div class="tenant-info">
                        <div class="tenant-name">${tenant.nombre}</div>
                        <div class="tenant-email">${tenant.email}</div>
                    </div>
                </td>
                <td>
                    <span class="plan-badge plan-${tenant.plan}">${tenant.plan}</span>
                </td>
                <td>${tenant.productos}</td>
                <td>${tenant.ventas}</td>
                <td>${tenant.clientes}</td>
                <td>
                    <span class="status-badge status-${tenant.estado}">${tenant.estado}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action" onclick="analyticsSystem.viewTenant('${tenant.slug}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action" onclick="analyticsSystem.editTenant('${tenant.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        container.innerHTML = html;
    }

    // ===== ACCIONES =====
    viewTenant(slug) {
        window.open(`tiendas/${slug}/admin.html`, '_blank');
    }

    editTenant(id) {
        console.log('Editando tenant:', id);
        // Implementar lógica de edición
    }

    // ===== EXPORTACIÓN =====
    exportMetrics() {
        const data = {
            metrics: this.metrics,
            summary: {
                totalTenants: this.getTotalTenants(),
                totalRevenue: this.getTotalRevenue(),
                totalProducts: this.getTotalProducts(),
                totalSales: this.getTotalSales(),
                totalCustomers: this.getTotalCustomers()
            },
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `cresalia-metrics-${new Date().toISOString().split('T')[0]}.json`;
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
window.analyticsSystem = new AnalyticsSystem();

// ===== INICIALIZACIÓN AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que Chart.js esté disponible
    if (typeof Chart !== 'undefined') {
        window.analyticsSystem.initialize();
    } else {
        // Cargar Chart.js dinámicamente
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            window.analyticsSystem.initialize();
        };
        document.head.appendChild(script);
    }
});

// ===== EXPORTACIÓN PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsSystem;
}
