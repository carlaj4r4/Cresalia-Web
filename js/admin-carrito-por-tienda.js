// ===== ADMIN: CONFIGURACIÓN DE CARRITO POR TIENDA =====
// Para que los vendedores puedan activar/desactivar el carrito por tienda

class AdminCarritoPorTienda {
    constructor() {
        this.tenantSlug = this.obtenerTenantSlug();
        this.configuracion = this.cargarConfiguracion();
        this.init();
    }

    // Obtener tenant slug
    obtenerTenantSlug() {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        if (parts.length > 2 && parts[0] !== 'www' && !parts[0].match(/^\d+\.\d+\.\d+\.\d+$/)) {
            return parts[0];
        }
        
        const pathParts = window.location.pathname.split('/');
        if (pathParts[1] === 'tiendas' && pathParts[2]) {
            return pathParts[2];
        }
        
        if (window.currentTenant) return window.currentTenant;
        if (window.tenantSlug) return window.tenantSlug;
        
        return 'default';
    }

    // Cargar configuración
    cargarConfiguracion() {
        const stored = localStorage.getItem(`tienda_config_${this.tenantSlug}`);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return this.getConfiguracionDefault();
            }
        }
        return this.getConfiguracionDefault();
    }

    // Configuración por defecto
    getConfiguracionDefault() {
        // Obtener plan actual (puede venir del backend o localStorage)
        const plan = this.obtenerPlanActual();
        const permiteCarritoPorTienda = this.verificarPlanPermite(plan);
        
        return {
            carrito_por_tienda_habilitado: false, // Por defecto desactivado
            plan: plan,
            permite_carrito_por_tienda: permiteCarritoPorTienda
        };
    }

    // Obtener plan actual
    obtenerPlanActual() {
        // Intentar obtener del backend o localStorage
        const planStored = localStorage.getItem(`tienda_plan_${this.tenantSlug}`);
        if (planStored) return planStored;
        
        // Intentar obtener de variables globales
        if (window.currentTenantPlan) return window.currentTenantPlan;
        if (window.tenantPlan) return window.tenantPlan;
        
        return 'free';
    }

    // Verificar si el plan permite carrito por tienda
    verificarPlanPermite(plan) {
        if (!window.PLANES_CONFIG) return false;
        const planConfig = window.PLANES_CONFIG[plan];
        return planConfig?.carrito_por_tienda === true;
    }

    // Guardar configuración
    guardarConfiguracion() {
        localStorage.setItem(`tienda_config_${this.tenantSlug}`, JSON.stringify(this.configuracion));
        
        // Sincronizar con sistema de carrito por tienda
        if (window.carritoPorTienda) {
            window.carritoPorTienda.configurarCarritoPorTienda(
                this.configuracion.carrito_por_tienda_habilitado,
                this.configuracion.plan
            );
        }
        
        this.mostrarNotificacion('✅ Configuración guardada', 'success');
    }

    // Inicializar
    init() {
        // Crear interfaz de administración si estamos en panel admin
        if (this.esPanelAdmin()) {
            this.crearInterfazAdmin();
        }
    }

    // Verificar si estamos en panel admin
    esPanelAdmin() {
        return window.location.pathname.includes('admin') || 
               document.getElementById('admin-panel') !== null ||
               document.querySelector('.admin-container') !== null;
    }

    // Crear interfaz de administración
    crearInterfazAdmin() {
        // Buscar sección de configuración o crear una nueva
        let configSection = document.getElementById('carrito-por-tienda-config');
        
        if (!configSection) {
            // Crear sección en el panel admin
            configSection = document.createElement('div');
            configSection.id = 'carrito-por-tienda-config';
            configSection.className = 'admin-config-section';
            
            // Buscar dónde insertar (panel de configuración o al final del body)
            const adminPanel = document.getElementById('admin-panel') || 
                             document.querySelector('.admin-container') ||
                             document.body;
            
            adminPanel.appendChild(configSection);
        }
        
        const permiteCarrito = this.verificarPlanPermite(this.configuracion.plan);
        
        configSection.innerHTML = `
            <div class="admin-config-card">
                <div class="admin-config-header">
                    <h3><i class="fas fa-shopping-cart"></i> Carrito por Tienda</h3>
                    ${!permiteCarrito ? `
                        <span class="badge badge-warning">
                            <i class="fas fa-exclamation-triangle"></i> No disponible en tu plan
                        </span>
                    ` : ''}
                </div>
                <div class="admin-config-body">
                    ${permiteCarrito ? `
                        <p class="config-description">
                            Permite que los compradores elijan entre un carrito exclusivo de tu tienda 
                            o un carrito general con productos de todas las tiendas.
                        </p>
                        <div class="config-switch">
                            <label class="switch-label">
                                <input type="checkbox" 
                                       id="carritoPorTiendaToggle" 
                                       ${this.configuracion.carrito_por_tienda_habilitado ? 'checked' : ''}
                                       ${!permiteCarrito ? 'disabled' : ''}>
                                <span class="switch-slider"></span>
                                <span class="switch-text">
                                    ${this.configuracion.carrito_por_tienda_habilitado ? 'Habilitado' : 'Deshabilitado'}
                                </span>
                            </label>
                        </div>
                        <div class="config-info">
                            <i class="fas fa-info-circle"></i>
                            <span>Cuando está habilitado, los compradores verán una opción para elegir el tipo de carrito al agregar su primer producto.</span>
                        </div>
                        <button class="btn-save-config" onclick="window.adminCarritoPorTienda.guardar()">
                            <i class="fas fa-save"></i> Guardar Configuración
                        </button>
                    ` : `
                        <div class="config-upgrade">
                            <i class="fas fa-lock"></i>
                            <p>Esta funcionalidad está disponible en planes <strong>Básico</strong> y superiores.</p>
                            <button class="btn-upgrade" onclick="window.mostrarPlanes && window.mostrarPlanes()">
                                <i class="fas fa-arrow-up"></i> Ver Planes
                            </button>
                        </div>
                    `}
                </div>
            </div>
            ${this.getStyles()}
        `;
        
        // Agregar evento al toggle
        const toggle = document.getElementById('carritoPorTiendaToggle');
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                this.configuracion.carrito_por_tienda_habilitado = e.target.checked;
                const text = toggle.nextElementSibling.nextElementSibling;
                if (text) {
                    text.textContent = e.target.checked ? 'Habilitado' : 'Deshabilitado';
                }
            });
        }
    }

    // Guardar configuración
    guardar() {
        const toggle = document.getElementById('carritoPorTiendaToggle');
        if (toggle) {
            this.configuracion.carrito_por_tienda_habilitado = toggle.checked;
        }
        this.guardarConfiguracion();
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje, tipo = 'info') {
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, tipo);
        } else {
            alert(mensaje);
        }
    }

    // Estilos
    getStyles() {
        return `
        <style>
            .admin-config-section {
                margin: 20px 0;
            }
            .admin-config-card {
                background: white;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                border: 1px solid #E5E7EB;
            }
            .admin-config-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 16px;
                border-bottom: 2px solid #E5E7EB;
            }
            .admin-config-header h3 {
                margin: 0;
                color: #1F2937;
                font-size: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .admin-config-header h3 i {
                color: #7C3AED;
            }
            .badge {
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .badge-warning {
                background: #FEF3C7;
                color: #92400E;
            }
            .config-description {
                color: #4B5563;
                margin-bottom: 20px;
                line-height: 1.6;
            }
            .config-switch {
                margin: 24px 0;
            }
            .switch-label {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
            }
            .switch-label input[type="checkbox"] {
                width: 50px;
                height: 26px;
                appearance: none;
                background: #CBD5F5;
                border-radius: 999px;
                position: relative;
                cursor: pointer;
                transition: background 0.3s;
            }
            .switch-label input[type="checkbox"]:checked {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
            }
            .switch-label input[type="checkbox"]::after {
                content: '';
                position: absolute;
                top: 3px;
                left: 3px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                transition: transform 0.3s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .switch-label input[type="checkbox"]:checked::after {
                transform: translateX(24px);
            }
            .switch-text {
                font-weight: 600;
                color: #1F2937;
            }
            .config-info {
                background: #EFF6FF;
                border-left: 4px solid #3B82F6;
                padding: 12px 16px;
                border-radius: 8px;
                margin: 20px 0;
                display: flex;
                align-items: start;
                gap: 12px;
                color: #1E40AF;
                font-size: 14px;
            }
            .config-info i {
                margin-top: 2px;
            }
            .btn-save-config {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s;
                margin-top: 20px;
            }
            .btn-save-config:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
            }
            .config-upgrade {
                text-align: center;
                padding: 40px 20px;
                background: linear-gradient(135deg, #F5F3FF, #EDE9FE);
                border-radius: 12px;
            }
            .config-upgrade i {
                font-size: 48px;
                color: #7C3AED;
                margin-bottom: 16px;
            }
            .config-upgrade p {
                color: #4B5563;
                margin-bottom: 20px;
            }
            .btn-upgrade {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s;
            }
            .btn-upgrade:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
            }
        </style>
        `;
    }
}

// Inicializar en panel admin
if (window.location.pathname.includes('admin') || document.getElementById('admin-panel')) {
    window.adminCarritoPorTienda = new AdminCarritoPorTienda();
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdminCarritoPorTienda };
}

