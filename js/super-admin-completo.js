// ===== PANEL SUPER-ADMIN COMPLETO - CRESALIA =====
// Sistema completo de gestión para super administrador
// Version: 1.0
// Autor: Auto

class SuperAdminCompleto {
    constructor() {
        this.supabase = null;
        this.tenants = [];
        this.stats = {
            totalTenants: 0,
            activeTenants: 0,
            suspendedTenants: 0,
            totalMRR: 0,
            totalRevenue: 0,
            growthRate: 0
        };
        this.init();
    }

    async init() {
        // Inicializar Supabase
        if (typeof initSupabase === 'function') {
            this.supabase = initSupabase();
        } else if (typeof supabase !== 'undefined') {
            this.supabase = supabase;
        }

        if (!this.supabase) {
            console.error('❌ No se pudo inicializar Supabase');
            return;
        }

        console.log('✅ Super Admin Completo inicializado');
        await this.cargarDashboard();
    }

    // ===== DASHBOARD Y MÉTRICAS =====
    async cargarDashboard() {
        await this.cargarEstadisticasGlobales();
        await this.cargarTodosTenants();
        this.actualizarDashboard();
    }

    async cargarEstadisticasGlobales() {
        try {
            // Cargar todos los tenants
            const { data: tenants, error } = await this.supabase
                .from('tiendas')
                .select('*, suscripciones(plan, estado, precio_mensual)');

            if (error) throw error;

            this.tenants = tenants || [];

            // Calcular estadísticas
            this.stats.totalTenants = this.tenants.length;
            this.stats.activeTenants = this.tenants.filter(t => t.activa).length;
            this.stats.suspendedTenants = this.tenants.filter(t => !t.activa).length;

            // Calcular MRR (Monthly Recurring Revenue)
            this.stats.totalMRR = 0;
            tenants.forEach(tenant => {
                if (tenant.suscripciones && tenant.suscripciones.length > 0) {
                    const suscripcion = tenant.suscripciones[0];
                    if (suscripcion.estado === 'activa') {
                        this.stats.totalMRR += parseFloat(suscripcion.precio_mensual || 0);
                    }
                }
            });

            // Calcular crecimiento
            const lastMonth = await this.calcularCrecimientoMesPasado();
            this.stats.growthRate = lastMonth;

        } catch (error) {
            console.error('❌ Error cargando estadísticas:', error);
        }
    }

    async calcularCrecimientoMesPasado() {
        try {
            const now = new Date();
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            
            const { count } = await this.supabase
                .from('tiendas')
                .select('*', { count: 'exact', head: true })
                .lte('fecha_creacion', lastMonth.toISOString());

            const currentCount = this.tenants.length;
            const lastMonthCount = count || 0;
            
            if (lastMonthCount === 0) return 0;
            
            return ((currentCount - lastMonthCount) / lastMonthCount) * 100;
        } catch (error) {
            return 0;
        }
    }

    actualizarDashboard() {
        // Actualizar cards de estadísticas
        const totalTenantsEl = document.getElementById('totalTenants');
        if (totalTenantsEl) {
            totalTenantsEl.textContent = this.stats.totalTenants;
        }

        const activeTenantsEl = document.getElementById('activeTenants');
        if (activeTenantsEl) {
            activeTenantsEl.textContent = this.stats.activeTenants;
        }

        const totalMRREl = document.getElementById('totalMRR');
        if (totalMRREl) {
            totalMRREl.textContent = `$${this.stats.totalMRR.toLocaleString('es-AR')} ARS`;
        }

        const growthRateEl = document.getElementById('growthRate');
        if (growthRateEl) {
            const growth = this.stats.growthRate;
            growthRateEl.textContent = `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
            growthRateEl.className = growth >= 0 ? 'stat-change up' : 'stat-change down';
        }
    }

    // ===== GESTIÓN DE TENANTS =====
    async cargarTodosTenants() {
        try {
            const { data: tenants, error } = await this.supabase
                .from('tiendas')
                .select(`
                    *,
                    suscripciones(plan, estado, precio_mensual, fecha_vencimiento),
                    productos(count),
                    historial_ventas(count)
                `)
                .order('fecha_creacion', { ascending: false });

            if (error) throw error;

            this.tenants = tenants || [];
            this.renderTenantsTable();
        } catch (error) {
            console.error('❌ Error cargando tenants:', error);
        }
    }

    renderTenantsTable() {
        const tbody = document.getElementById('tenantsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.tenants.map(tenant => {
            const suscripcion = tenant.suscripciones?.[0] || {};
            const plan = suscripcion.plan || 'free';
            const estado = tenant.activa ? 'activa' : 'suspendida';
            const productosCount = tenant.productos?.[0]?.count || 0;
            const ventasCount = tenant.historial_ventas?.[0]?.count || 0;
            const mrr = parseFloat(suscripcion.precio_mensual || 0);

            return `
                <tr>
                    <td>
                        <div class="tenant-name">${tenant.nombre_tienda || 'Sin nombre'}</div>
                        <div class="tenant-slug">${tenant.subdomain || tenant.id}</div>
                    </td>
                    <td>
                        <span class="plan-badge plan-${plan}">${plan.toUpperCase()}</span>
                    </td>
                    <td>
                        <span class="status-badge status-${estado}">${estado === 'activa' ? 'Activa' : 'Suspendida'}</span>
                    </td>
                    <td>$${mrr.toLocaleString('es-AR')} ARS</td>
                    <td>${productosCount}</td>
                    <td>${ventasCount}</td>
                    <td>${new Date(tenant.fecha_creacion).toLocaleDateString('es-AR')}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-icon-small btn-view" onclick="superAdmin.verTenant('${tenant.id}')" title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon-small btn-edit" onclick="superAdmin.editarTenant('${tenant.id}')" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            ${tenant.activa ? `
                                <button class="btn-icon-small btn-danger" onclick="superAdmin.suspenderTenant('${tenant.id}')" title="Suspender">
                                    <i class="fas fa-pause"></i>
                                </button>
                            ` : `
                                <button class="btn-icon-small btn-success" onclick="superAdmin.activarTenant('${tenant.id}')" title="Activar">
                                    <i class="fas fa-play"></i>
                                </button>
                            `}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // ===== ACCIONES DE TENANTS =====
    async activarTenant(tenantId) {
        if (!confirm('¿Estás segura de activar este tenant?')) return;

        try {
            const { error } = await this.supabase
                .from('tiendas')
                .update({ activa: true })
                .eq('id', tenantId);

            if (error) throw error;

            this.mostrarNotificacion('✅ Tenant activado correctamente', 'success');
            await this.cargarTodosTenants();
            await this.cargarEstadisticasGlobales();
        } catch (error) {
            console.error('❌ Error activando tenant:', error);
            this.mostrarNotificacion('❌ Error al activar tenant', 'error');
        }
    }

    async suspenderTenant(tenantId) {
        if (!confirm('¿Estás segura de suspender este tenant? Los usuarios no podrán acceder.')) return;

        try {
            const { error } = await this.supabase
                .from('tiendas')
                .update({ activa: false })
                .eq('id', tenantId);

            if (error) throw error;

            this.mostrarNotificacion('⚠️ Tenant suspendido correctamente', 'warning');
            await this.cargarTodosTenants();
            await this.cargarEstadisticasGlobales();
        } catch (error) {
            console.error('❌ Error suspendiendo tenant:', error);
            this.mostrarNotificacion('❌ Error al suspender tenant', 'error');
        }
    }

    async cancelarTenant(tenantId) {
        if (!confirm('⚠️ ADVERTENCIA: Esto cancelará permanentemente el tenant. ¿Estás segura?')) return;
        
        const confirmacion = prompt('Escribe "CANCELAR" para confirmar:');
        if (confirmacion !== 'CANCELAR') {
            this.mostrarNotificacion('❌ Cancelación no confirmada', 'error');
            return;
        }

        try {
            const { error } = await this.supabase
                .from('tiendas')
                .update({ activa: false, cancelada: true })
                .eq('id', tenantId);

            if (error) throw error;

            this.mostrarNotificacion('🗑️ Tenant cancelado', 'error');
            await this.cargarTodosTenants();
            await this.cargarEstadisticasGlobales();
        } catch (error) {
            console.error('❌ Error cancelando tenant:', error);
            this.mostrarNotificacion('❌ Error al cancelar tenant', 'error');
        }
    }

    verTenant(tenantId) {
        const tenant = this.tenants.find(t => t.id === tenantId);
        if (!tenant) return;

        // Mostrar modal con detalles
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Detalles del Tenant</h2>
                    <button onclick="this.closest('.modal-overlay').remove()" class="btn-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Nombre:</label>
                            <span>${tenant.nombre_tienda || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <label>Email:</label>
                            <span>${tenant.email || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <label>Subdomain:</label>
                            <span>${tenant.subdomain || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <label>Plan:</label>
                            <span>${tenant.suscripciones?.[0]?.plan || 'free'}</span>
                        </div>
                        <div class="info-item">
                            <label>Estado:</label>
                            <span>${tenant.activa ? 'Activa' : 'Suspendida'}</span>
                        </div>
                        <div class="info-item">
                            <label>Fecha Creación:</label>
                            <span>${new Date(tenant.fecha_creacion).toLocaleString('es-AR')}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    editarTenant(tenantId) {
        // Abrir modal de edición
        this.verTenant(tenantId); // Por ahora, usar el mismo modal
    }

    // ===== GESTIÓN DE SUSCRIPCIONES =====
    async cambiarPlanTenant(tenantId, nuevoPlan) {
        if (!confirm(`¿Cambiar plan a ${nuevoPlan}?`)) return;

        try {
            const precios = {
                'free': 0,
                'basic': 29000,
                'pro': 79000,
                'enterprise': 199000
            };

            const { error } = await this.supabase
                .from('suscripciones')
                .update({
                    plan: nuevoPlan,
                    precio_mensual: precios[nuevoPlan],
                    updated_at: new Date().toISOString()
                })
                .eq('tienda_id', tenantId);

            if (error) throw error;

            this.mostrarNotificacion(`✅ Plan cambiado a ${nuevoPlan}`, 'success');
            await this.cargarTodosTenants();
            await this.cargarEstadisticasGlobales();
        } catch (error) {
            console.error('❌ Error cambiando plan:', error);
            this.mostrarNotificacion('❌ Error al cambiar plan', 'error');
        }
    }

    // ===== REPORTES Y ESTADÍSTICAS =====
    async generarReporte(fechaInicio, fechaFin) {
        try {
            const reporte = {
                periodo: {
                    inicio: fechaInicio,
                    fin: fechaFin
                },
                tenants: {
                    total: this.stats.totalTenants,
                    activos: this.stats.activeTenants,
                    suspendidos: this.stats.suspendedTenants
                },
                ingresos: {
                    mrr: this.stats.totalMRR,
                    crecimiento: this.stats.growthRate
                },
                fechaGeneracion: new Date().toISOString()
            };

            // Convertir a CSV o JSON
            const csv = this.convertirReporteACSV(reporte);
            this.descargarArchivo(csv, `reporte-cresalia-${new Date().toISOString().split('T')[0]}.csv`);

            this.mostrarNotificacion('📊 Reporte generado', 'success');
        } catch (error) {
            console.error('❌ Error generando reporte:', error);
            this.mostrarNotificacion('❌ Error al generar reporte', 'error');
        }
    }

    convertirReporteACSV(reporte) {
        let csv = 'Reporte Cresalia\n\n';
        csv += `Período: ${reporte.periodo.inicio} - ${reporte.periodo.fin}\n\n`;
        csv += 'Métrica,Valor\n';
        csv += `Total Tenants,${reporte.tenants.total}\n`;
        csv += `Tenants Activos,${reporte.tenants.activos}\n`;
        csv += `Tenants Suspendidos,${reporte.tenants.suspendidos}\n`;
        csv += `MRR Total,$${reporte.ingresos.mrr}\n`;
        csv += `Tasa de Crecimiento,${reporte.ingresos.crecimiento}%\n`;
        return csv;
    }

    descargarArchivo(contenido, nombreArchivo) {
        const blob = new Blob([contenido], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // ===== NOTIFICACIONES =====
    mostrarNotificacion(mensaje, tipo = 'info') {
        const notificacion = document.createElement('div');
        notificacion.className = `super-admin-notification ${tipo}`;
        notificacion.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${mensaje}</span>
            </div>
        `;

        document.body.appendChild(notificacion);

        setTimeout(() => {
            notificacion.classList.add('show');
        }, 10);

        setTimeout(() => {
            notificacion.classList.remove('show');
            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }

    // ===== EXPORTAR FUNCIONES GLOBALES =====
    getGlobalMethods() {
        return {
            activarTenant: (id) => this.activarTenant(id),
            suspenderTenant: (id) => this.suspenderTenant(id),
            cancelarTenant: (id) => this.cancelarTenant(id),
            verTenant: (id) => this.verTenant(id),
            editarTenant: (id) => this.editarTenant(id),
            cambiarPlan: (id, plan) => this.cambiarPlanTenant(id, plan),
            generarReporte: (inicio, fin) => this.generarReporte(inicio, fin)
        };
    }
}

// Inicializar globalmente
let superAdmin;
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        superAdmin = new SuperAdminCompleto();
        window.superAdmin = superAdmin;
        
        // Exportar métodos globales
        const methods = superAdmin.getGlobalMethods();
        Object.assign(window, methods);
    });
}

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SuperAdminCompleto };
}

