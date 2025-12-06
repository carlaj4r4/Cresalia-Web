// ===== SISTEMA DE CARRITO POR TIENDA - CRESALIA =====
// Versión: 1.0
// Sistema que permite carritos separados por tienda según el plan

class CarritoPorTienda {
    constructor() {
        this.carritos = this.cargarCarritos();
        this.configuracionTienda = null;
        this.preferenciaUsuario = this.cargarPreferenciaUsuario();
        this.init();
    }

    // Cargar carritos del localStorage
    cargarCarritos() {
        const stored = localStorage.getItem('carritos_por_tienda');
        if (!stored) {
            return {
                general: [] // Carrito general (siempre disponible)
            };
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            return { general: [] };
        }
    }

    // Guardar carritos
    guardarCarritos() {
        localStorage.setItem('carritos_por_tienda', JSON.stringify(this.carritos));
        this.actualizarContadores();
    }

    // Cargar preferencia del usuario (carrito general o por tienda)
    cargarPreferenciaUsuario() {
        const stored = localStorage.getItem('preferencia_carrito_tipo');
        return stored || null; // null = preguntar, 'general' = carrito general, 'tienda' = carrito por tienda
    }

    // Guardar preferencia del usuario
    guardarPreferenciaUsuario(tipo) {
        localStorage.setItem('preferencia_carrito_tipo', tipo);
        this.preferenciaUsuario = tipo;
    }

    // Inicializar sistema
    init() {
        // Detectar configuración de la tienda actual
        this.detectarConfiguracionTienda();
    }

    // Detectar si la tienda actual tiene carrito por tienda habilitado
    async detectarConfiguracionTienda() {
        // Obtener información de la tienda actual
        const tenantSlug = this.obtenerTenantSlug();
        if (!tenantSlug) return;

        try {
            // Intentar obtener configuración desde el backend o localStorage
            const configKey = `tienda_config_${tenantSlug}`;
            const configStored = localStorage.getItem(configKey);
            
            if (configStored) {
                this.configuracionTienda = JSON.parse(configStored);
            } else {
                // Configuración por defecto según el plan
                // Esto se puede obtener del backend o del plan del tenant
                this.configuracionTienda = {
                    carrito_por_tienda_habilitado: false,
                    plan: 'free'
                };
            }
        } catch (error) {
            console.error('Error detectando configuración de tienda:', error);
            this.configuracionTienda = {
                carrito_por_tienda_habilitado: false,
                plan: 'free'
            };
        }
    }

    // Obtener tenant slug actual
    obtenerTenantSlug() {
        // Intentar obtener del subdominio
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        if (parts.length > 2 && parts[0] !== 'www' && !parts[0].match(/^\d+\.\d+\.\d+\.\d+$/)) {
            return parts[0];
        }
        
        // Intentar obtener de la URL
        const pathParts = window.location.pathname.split('/');
        if (pathParts[1] === 'tiendas' && pathParts[2]) {
            return pathParts[2];
        }
        
        // Intentar obtener de variables globales
        if (window.currentTenant) return window.currentTenant;
        if (window.tenantSlug) return window.tenantSlug;
        
        return null;
    }

    // Verificar si el plan permite carrito por tienda
    verificarPlanPermiteCarritoPorTienda(plan) {
        const planesPermitidos = ['basic', 'starter', 'pro', 'enterprise', 'enterprise_custom'];
        return planesPermitidos.includes(plan);
    }

    // Agregar producto al carrito (con lógica de carrito por tienda)
    async agregarProducto(producto, cantidad = 1) {
        const tenantSlug = this.obtenerTenantSlug();
        const tiendaId = producto.tienda_id || producto.tenant_id || tenantSlug;
        const tiendaNombre = producto.tienda_nombre || producto.tenant_nombre || 'Tienda';

        // Verificar si la tienda tiene carrito por tienda habilitado
        const tieneCarritoPorTienda = this.configuracionTienda?.carrito_por_tienda_habilitado && 
                                      this.verificarPlanPermiteCarritoPorTienda(this.configuracionTienda.plan);

        if (tieneCarritoPorTienda && !this.preferenciaUsuario) {
            // Preguntar al usuario qué tipo de carrito quiere usar
            const tipoCarrito = await this.preguntarTipoCarrito(tiendaNombre);
            if (tipoCarrito === null) {
                // Usuario canceló
                return false;
            }
            this.guardarPreferenciaUsuario(tipoCarrito);
        }

        // Determinar a qué carrito agregar
        const tipoCarrito = this.preferenciaUsuario || 'general';
        const carritoId = tipoCarrito === 'tienda' && tieneCarritoPorTienda 
            ? `tienda_${tiendaId}` 
            : 'general';

        // Inicializar carrito si no existe
        if (!this.carritos[carritoId]) {
            this.carritos[carritoId] = [];
            if (tipoCarrito === 'tienda') {
                this.carritos[carritoId].tienda_id = tiendaId;
                this.carritos[carritoId].tienda_nombre = tiendaNombre;
            }
        }

        // Verificar si el producto ya está en el carrito
        const itemExistente = this.carritos[carritoId].find(item => item.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            this.carritos[carritoId].push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: cantidad,
                imagen: producto.imagen_principal || producto.imagen,
                tienda_id: tiendaId,
                tienda_nombre: tiendaNombre,
                agregado_at: new Date().toISOString()
            });
        }

        this.guardarCarritos();
        
        const mensaje = tipoCarrito === 'tienda' 
            ? `💜 ¡Agregado al carrito de ${tiendaNombre}!`
            : '💜 ¡Agregado al carrito!';
        
        this.mostrarNotificacion(mensaje, 'success');
        
        return true;
    }

    // Preguntar al usuario qué tipo de carrito quiere usar
    preguntarTipoCarrito(tiendaNombre) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'carrito-modal-overlay';
            modal.innerHTML = `
                <div class="carrito-modal">
                    <div class="carrito-modal-header">
                        <h3><i class="fas fa-shopping-cart"></i> Tipo de Carrito</h3>
                        <button class="carrito-modal-close" onclick="this.closest('.carrito-modal-overlay').remove(); this.closest('.carrito-modal-overlay').dataset.respuesta='cancelar';">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="carrito-modal-body">
                        <p>¿Cómo quieres organizar tu carrito?</p>
                        <div class="carrito-opciones">
                            <button class="carrito-opcion" data-tipo="tienda" onclick="this.closest('.carrito-modal-overlay').dataset.respuesta='tienda'; this.closest('.carrito-modal-overlay').remove();">
                                <div class="opcion-icono">
                                    <i class="fas fa-store"></i>
                                </div>
                                <div class="opcion-contenido">
                                    <h4>Carrito de ${tiendaNombre}</h4>
                                    <p>Productos solo de esta tienda. Ideal si compras de una tienda específica.</p>
                                </div>
                            </button>
                            <button class="carrito-opcion" data-tipo="general" onclick="this.closest('.carrito-modal-overlay').dataset.respuesta='general'; this.closest('.carrito-modal-overlay').remove();">
                                <div class="opcion-icono">
                                    <i class="fas fa-shopping-bag"></i>
                                </div>
                                <div class="opcion-contenido">
                                    <h4>Carrito General</h4>
                                    <p>Productos de todas las tiendas juntos. Ideal si compras de varias tiendas.</p>
                                </div>
                            </button>
                        </div>
                        <div class="carrito-recordar">
                            <label>
                                <input type="checkbox" id="recordarPreferencia" checked>
                                <span>Recordar mi preferencia</span>
                            </label>
                        </div>
                    </div>
                </div>
            `;

            // Agregar estilos
            const styles = document.createElement('style');
            styles.textContent = `
                .carrito-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .carrito-modal {
                    background: white;
                    border-radius: 20px;
                    padding: 0;
                    max-width: 550px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    animation: slideUp 0.3s ease;
                }
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .carrito-modal-header {
                    padding: 24px;
                    border-bottom: 1px solid #E5E7EB;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .carrito-modal-header h3 {
                    margin: 0;
                    color: #1F2937;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .carrito-modal-header h3 i {
                    color: #7C3AED;
                }
                .carrito-modal-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: #6B7280;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 50%;
                    transition: all 0.2s;
                }
                .carrito-modal-close:hover {
                    background: #F3F4F6;
                    color: #1F2937;
                }
                .carrito-modal-body {
                    padding: 24px;
                }
                .carrito-modal-body > p {
                    margin: 0 0 20px 0;
                    color: #4B5563;
                    font-size: 16px;
                    font-weight: 500;
                }
                .carrito-opciones {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .carrito-opcion {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 20px;
                    border: 2px solid #E5E7EB;
                    border-radius: 16px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: left;
                    width: 100%;
                }
                .carrito-opcion:hover {
                    border-color: #7C3AED;
                    background: #F5F3FF;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
                }
                .opcion-icono {
                    width: 56px;
                    height: 56px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #7C3AED, #A78BFA);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    flex-shrink: 0;
                }
                .opcion-contenido {
                    flex: 1;
                }
                .opcion-contenido h4 {
                    margin: 0 0 6px 0;
                    color: #1F2937;
                    font-size: 18px;
                    font-weight: 600;
                }
                .opcion-contenido p {
                    margin: 0;
                    color: #6B7280;
                    font-size: 14px;
                    line-height: 1.5;
                }
                .carrito-recordar {
                    padding-top: 16px;
                    border-top: 1px solid #E5E7EB;
                }
                .carrito-recordar label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    color: #4B5563;
                    font-size: 14px;
                }
                .carrito-recordar input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                }
            `;
            document.head.appendChild(styles);

            document.body.appendChild(modal);

            // Esperar respuesta
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.closest('.carrito-modal-close')) {
                    resolve(null);
                    modal.remove();
                    styles.remove();
                }
            });

            // Verificar respuesta
            const checkResponse = setInterval(() => {
                if (modal.dataset.respuesta) {
                    clearInterval(checkResponse);
                    const respuesta = modal.dataset.respuesta;
                    const recordar = document.getElementById('recordarPreferencia')?.checked;
                    
                    if (recordar && respuesta !== 'cancelar') {
                        this.guardarPreferenciaUsuario(respuesta);
                    }
                    
                    resolve(respuesta === 'cancelar' ? null : respuesta);
                    modal.remove();
                    styles.remove();
                }
            }, 100);
        });
    }

    // Obtener carrito actual (según preferencia)
    obtenerCarritoActual() {
        if (this.preferenciaUsuario === 'tienda') {
            // Buscar carrito de tienda activo
            const tenantSlug = this.obtenerTenantSlug();
            const carritoId = `tienda_${tenantSlug}`;
            return this.carritos[carritoId] || this.carritos.general;
        }
        return this.carritos.general || [];
    }

    // Obtener todos los carritos
    obtenerTodosLosCarritos() {
        return this.carritos;
    }

    // Contar items en carrito actual
    contarItems() {
        const carrito = this.obtenerCarritoActual();
        return Array.isArray(carrito) ? carrito.reduce((total, item) => total + item.cantidad, 0) : 0;
    }

    // Actualizar contadores en la UI
    actualizarContadores() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const total = this.contarItems();
            cartCount.textContent = total;
        }

        // Actualizar carrito flotante
        const floatingCartCount = document.getElementById('floatingCartCount');
        if (floatingCartCount) {
            floatingCartCount.textContent = this.contarItems();
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje, tipo = 'info') {
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, tipo);
        } else {
            console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
        }
    }

    // Configurar carrito por tienda (para administradores)
    configurarCarritoPorTienda(habilitado, plan) {
        const tenantSlug = this.obtenerTenantSlug();
        if (!tenantSlug) return false;

        const configKey = `tienda_config_${tenantSlug}`;
        this.configuracionTienda = {
            carrito_por_tienda_habilitado: habilitado,
            plan: plan
        };
        
        localStorage.setItem(configKey, JSON.stringify(this.configuracionTienda));
        return true;
    }
}

// Inicializar globalmente
window.carritoPorTienda = new CarritoPorTienda();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CarritoPorTienda };
}

