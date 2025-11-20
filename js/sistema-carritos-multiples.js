// ===== SISTEMA DE CARRITOS MÚLTIPLES - CRESALIA =====
// Permite a los compradores tener:
// 1. Carrito por tienda (cada tienda tiene su propio carrito)
// 2. Carrito global (combina productos de múltiples tiendas)
// 3. Nombres personalizados para cada carrito
// 4. Comparación de totales entre carritos
// 5. Compartir carritos (actualmente con localStorage, preparado para Supabase)
// Versión: 2.0
// Autor: Claude para Cresalia
// Fecha: 2025
// Nota: Este sistema funciona completamente con localStorage, no requiere Supabase.
//       Sin embargo, se puede mejorar con Supabase para sincronizar entre dispositivos.

class SistemaCarritosMultiples {
    constructor() {
        this.carritosPorTienda = {}; // { tienda_id: [productos] }
        this.carritoGlobal = []; // Productos de todas las tiendas
        this.modoCarrito = 'global'; // 'global' o 'tienda'
        this.tiendaActual = null; // ID de la tienda actual si está en modo 'tienda'
        this.nombresCarritos = {}; // { tienda_id: 'Nombre personalizado' }
        this.carritosCompartidos = {}; // { carrito_id: { datos, compartido_por, fecha } }
        this.personalizacionesCarrito = {}; // { tienda_id: PersonalizacionCarritoVendedor }
        this.sincronizacionTimer = null;
        this.ultimaHuellaSincronizacion = null;
        this.usuarioActual = this.obtenerUsuarioActual();
        
        this.handleStorageChange = this.handleStorageChange.bind(this);
        window.addEventListener('storage', this.handleStorageChange);
        
        this.cargarCarritos();
        this.initUI();
        this.aplicarPersonalizaciones();
        this.programarSincronizacion();
        console.log('🛒 Sistema de Carritos Múltiples inicializado');
    }

    handleStorageChange(event) {
        if (event.key === 'cresalia_user_data' || event.key === 'cresalia_sesion_activa') {
            this.actualizarUsuarioActual();
            this.programarSincronizacion(true);
        }
    }

    obtenerUsuarioActual() {
        try {
            const data = localStorage.getItem('cresalia_user_data');
            if (!data) return null;
            return JSON.parse(data);
        } catch (error) {
            console.warn('⚠️ No se pudo obtener el usuario actual del carrito:', error);
            return null;
        }
    }

    actualizarUsuarioActual() {
        this.usuarioActual = this.obtenerUsuarioActual();
    }

    programarSincronizacion(force = false) {
        if (force) {
            if (this.sincronizacionTimer) {
                clearTimeout(this.sincronizacionTimer);
                this.sincronizacionTimer = null;
            }
            this.sincronizarConBackend();
            return;
        }
        
        if (this.sincronizacionTimer) {
            clearTimeout(this.sincronizacionTimer);
        }
        
        this.sincronizacionTimer = setTimeout(() => {
            this.sincronizacionTimer = null;
            this.sincronizarConBackend();
        }, 1500);
    }

    generarHashCarrito(texto = '') {
        if (!texto) return `carrito-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        try {
            return btoa(unescape(encodeURIComponent(texto))).replace(/=+$/g, '');
        } catch (error) {
            return `hash-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        }
    }

    obtenerURLRecuperacion(slug) {
        if (!slug || slug === 'global') {
            return window.location.origin + '/index-cresalia.html';
        }
        const base = window.location.origin.replace(/\/$/, '');
        return `${base}/tiendas/${slug}/index.html`;
    }

    async sincronizarConBackend() {
        this.actualizarUsuarioActual();
        const usuario = this.usuarioActual;
        
        if (!usuario || !usuario.email) {
            // Sin usuario autenticado no sincronizamos (privacidad)
            return;
        }
        
        const globalPorTienda = {};
        (this.carritoGlobal || []).forEach(item => {
            const slug = item.tienda_id || item.tienda_slug || item.tiendaId || item.tenant_slug || null;
            if (!slug || slug === 'global') return;
            if (!globalPorTienda[slug]) {
                globalPorTienda[slug] = [];
            }
            globalPorTienda[slug].push(item);
        });
        
        const huella = JSON.stringify({
            global: globalPorTienda,
            tiendas: this.carritosPorTienda,
            modo: this.modoCarrito
        });
        
        if (huella === this.ultimaHuellaSincronizacion) {
            return;
        }
        
        const todasLasTiendas = new Set([
            ...Object.keys(this.carritosPorTienda || {}),
            ...Object.keys(globalPorTienda || {})
        ]);
        
        if (this.tiendaActual) {
            todasLasTiendas.add(this.tiendaActual);
        }
        
        if (todasLasTiendas.size === 0) {
            this.ultimaHuellaSincronizacion = huella;
            return;
        }
        
        const peticiones = [];
        const now = new Date().toISOString();
        
        const enviarRegistro = (slug, items, modo) => {
            if (!slug || slug === 'global') return;
            
            const itemsNormalizados = (items || []).map(item => ({
                id: item.id,
                nombre: item.nombre || item.name || 'Producto',
                cantidad: item.cantidad || 1,
                precio: item.precio || item.price || 0,
                imagen: item.imagen || item.image || null,
                tienda_nombre: item.tienda_nombre || item.tiendaName || this.nombresCarritos[slug] || slug
            }));
            
            const total = itemsNormalizados.reduce((sum, item) => sum + ((item.precio || 0) * (item.cantidad || 1)), 0);
            const carritoNombre = modo === 'global'
                ? (this.nombresCarritos.global || `Carrito Global ${this.nombresCarritos[slug] || slug}`)
                : (this.nombresCarritos[slug] || itemsNormalizados[0]?.tienda_nombre || slug);
            
            const payload = {
                tienda_slug: slug,
                buyer_email: usuario.email,
                buyer_nombre: usuario.nombre || usuario.name || '',
                modo,
                carrito_nombre: carritoNombre,
                items: itemsNormalizados,
                total,
                carrito_global: modo === 'global',
                preferencia: this.modoCarrito,
                link_recuperacion: this.obtenerURLRecuperacion(slug),
                ultima_interaccion: now,
                carrito_hash: this.generarHashCarrito(itemsNormalizados.map(item => `${item.id}:${item.cantidad}:${item.precio}`).join('|'))
            };
            
            peticiones.push(
                fetch('/api/carritos/activity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }).catch(error => {
                    console.warn('⚠️ Error sincronizando carrito con backend:', error);
                })
            );
        };
        
        todasLasTiendas.forEach(slug => {
            const itemsTienda = this.carritosPorTienda[slug] || [];
            const itemsGlobal = globalPorTienda[slug] || [];
            
            enviarRegistro(slug, itemsTienda, 'tienda');
            enviarRegistro(slug, itemsGlobal, 'global');
        });
        
        if (peticiones.length > 0) {
            await Promise.all(peticiones);
        }
        
        this.ultimaHuellaSincronizacion = huella;
    }
    
    // Cargar carritos desde localStorage
    cargarCarritos() {
        try {
            const carritosGuardados = localStorage.getItem('cresalia_carritos_tiendas');
            if (carritosGuardados) {
                this.carritosPorTienda = JSON.parse(carritosGuardados);
            }
            
            const globalGuardado = localStorage.getItem('cresalia_carrito_global');
            if (globalGuardado) {
                this.carritoGlobal = JSON.parse(globalGuardado);
            }
            
            const modoGuardado = localStorage.getItem('cresalia_modo_carrito');
            if (modoGuardado) {
                this.modoCarrito = modoGuardado;
            }
            
            // Cargar nombres personalizados de carritos
            const nombresGuardados = localStorage.getItem('cresalia_nombres_carritos');
            if (nombresGuardados) {
                this.nombresCarritos = JSON.parse(nombresGuardados);
            }
            
            // Cargar carritos compartidos
            const compartidosGuardados = localStorage.getItem('cresalia_carritos_compartidos');
            if (compartidosGuardados) {
                this.carritosCompartidos = JSON.parse(compartidosGuardados);
            }
        } catch (error) {
            console.error('Error cargando carritos:', error);
        }
    }
    
    // Guardar carritos en localStorage
    guardarCarritos() {
        try {
            localStorage.setItem('cresalia_carritos_tiendas', JSON.stringify(this.carritosPorTienda));
            localStorage.setItem('cresalia_carrito_global', JSON.stringify(this.carritoGlobal));
            localStorage.setItem('cresalia_modo_carrito', this.modoCarrito);
            localStorage.setItem('cresalia_nombres_carritos', JSON.stringify(this.nombresCarritos));
            localStorage.setItem('cresalia_carritos_compartidos', JSON.stringify(this.carritosCompartidos));
        } catch (error) {
            console.error('Error guardando carritos:', error);
        }
        
        this.programarSincronizacion();
    }
    
    // Inicializar UI
    initUI() {
        this.crearSelectorCarrito();
        this.actualizarContadorCarrito();
        this.injectarEstilos();
    }
    
    // Inyectar estilos CSS
    injectarEstilos() {
        if (!document.getElementById('carritos-multiples-styles')) {
            const styles = document.createElement('style');
            styles.id = 'carritos-multiples-styles';
            styles.textContent = `
                .selector-tipo-carrito {
                    margin: 10px 0;
                    padding: 15px;
                    background: #F9FAFB;
                    border-radius: 12px;
                    border: 2px solid #E5E7EB;
                }
                
                .carrito-selector-container {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                }
                
                .carrito-selector-label {
                    flex: 1;
                    min-width: 200px;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    padding: 12px;
                    border: 2px solid #E5E7EB;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                }
                
                .carrito-selector-label:hover {
                    border-color: #667eea;
                    background: #F5F3FF;
                }
                
                .carrito-selector-label input[type="radio"]:checked + span {
                    color: #667eea;
                    font-weight: 600;
                }
                
                .carrito-selector-label input[type="radio"]:checked ~ small {
                    color: #667eea;
                }
                
                .carrito-selector-label input[type="radio"] {
                    margin-right: 8px;
                }
                
                .carrito-selector-label span {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 500;
                    color: #374151;
                }
                
                .carrito-selector-label small {
                    font-size: 0.85rem;
                    color: #6B7280;
                    margin-left: 24px;
                }
                
                .carrito-badge-tienda {
                    display: inline-block;
                    padding: 2px 8px;
                    background: #667eea;
                    color: white;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    margin-left: 5px;
                }
                
                .carrito-resumen-info {
                    margin-top: 8px;
                    padding: 8px;
                    background: #F3F4F6;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    color: #374151;
                }
                
                .carrito-resumen-info strong {
                    color: #667eea;
                }
                
                .carrito-selector-label.activo {
                    border-color: #667eea;
                    background: #F5F3FF;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
                }
                
                .carrito-nombre-editable {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    margin-top: 5px;
                }
                
                .carrito-nombre-editable input {
                    flex: 1;
                    padding: 4px 8px;
                    border: 1px solid #D1D5DB;
                    border-radius: 4px;
                    font-size: 0.85rem;
                }
                
                .carrito-nombre-editable button {
                    padding: 4px 8px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.75rem;
                }
                
                .carrito-acciones {
                    display: flex;
                    gap: 8px;
                    margin-top: 10px;
                    flex-wrap: wrap;
                }
                
                .carrito-btn-accion {
                    padding: 6px 12px;
                    border: 1px solid #D1D5DB;
                    border-radius: 6px;
                    background: white;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                }
                
                .carrito-btn-accion:hover {
                    background: #F3F4F6;
                    border-color: #667eea;
                }
                
                .carrito-comparacion-panel {
                    margin-top: 20px;
                    padding: 15px;
                    background: #FFFFFF;
                    border: 2px solid #E5E7EB;
                    border-radius: 12px;
                }
                
                .carrito-comparacion-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                
                .carrito-comparacion-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }
                
                .carrito-comparacion-item {
                    padding: 12px;
                    border: 2px solid #E5E7EB;
                    border-radius: 8px;
                    background: #F9FAFB;
                }
                
                .carrito-comparacion-item.activo {
                    border-color: #667eea;
                    background: #F5F3FF;
                }
                
                .carrito-comparacion-item h4 {
                    margin: 0 0 8px 0;
                    font-size: 0.9rem;
                    color: #374151;
                }
                
                .carrito-comparacion-item .total {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #667eea;
                    margin: 5px 0;
                }
                
                .carrito-compartir-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10000;
                    align-items: center;
                    justify-content: center;
                }
                
                .carrito-compartir-modal.activo {
                    display: flex;
                }
                
                .carrito-compartir-content {
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                }
                
                .carrito-link-compartido {
                    display: flex;
                    gap: 8px;
                    margin-top: 10px;
                    padding: 10px;
                    background: #F3F4F6;
                    border-radius: 6px;
                }
                
                .carrito-link-compartido input {
                    flex: 1;
                    padding: 6px;
                    border: 1px solid #D1D5DB;
                    border-radius: 4px;
                }
                
                .carrito-link-compartido button {
                    padding: 6px 12px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    // Crear selector de tipo de carrito
    crearSelectorCarrito() {
        // Buscar si ya existe el selector
        let selector = document.getElementById('selector-tipo-carrito');
        
        if (!selector) {
            // Crear selector si no existe
            selector = document.createElement('div');
            selector.id = 'selector-tipo-carrito';
            selector.className = 'selector-tipo-carrito';
        }
        
        // Generar HTML con todos los carritos disponibles
        const resumen = this.obtenerResumen();
        let carritosHTML = `
            <div class="carrito-selector-container">
                <label class="carrito-selector-label">
                    <input type="radio" name="tipo-carrito" value="global" ${this.modoCarrito === 'global' ? 'checked' : ''} 
                           onchange="window.sistemaCarritosMultiples.cambiarModoCarrito('global')">
                    <span>
                        <i class="fas fa-shopping-bag"></i> 
                        ${this.nombresCarritos['global'] || 'Carrito Global'}
                        <button class="carrito-btn-editar-nombre" onclick="window.sistemaCarritosMultiples.editarNombreCarrito('global', event)" style="margin-left: 8px; background: none; border: none; cursor: pointer; font-size: 0.75rem; color: #667eea;">
                            <i class="fas fa-edit"></i>
                        </button>
                    </span>
                    <small>Combina productos de todas las tiendas</small>
                    <div class="carrito-resumen-info">
                        <strong>$${resumen.global.total.toFixed(2)}</strong> • ${resumen.global.productos} productos
                    </div>
                    <div class="carrito-acciones">
                        <button class="carrito-btn-accion" onclick="window.sistemaCarritosMultiples.compartirCarrito('global')">
                            <i class="fas fa-share-alt"></i> Compartir
                        </button>
                        <button class="carrito-btn-accion" onclick="window.sistemaCarritosMultiples.mostrarComparacion()">
                            <i class="fas fa-balance-scale"></i> Comparar
                        </button>
                    </div>
                </label>
        `;
        
        // Agregar carritos por tienda
        Object.keys(this.carritosPorTienda).forEach(tiendaId => {
            const carrito = this.carritosPorTienda[tiendaId];
            const nombreCarrito = this.nombresCarritos[tiendaId] || (carrito[0]?.tienda_nombre || `Tienda ${tiendaId}`);
            const resumenTienda = resumen.porTienda[tiendaId] || { total: 0, productos: 0 };
            const esActivo = this.modoCarrito === 'tienda' && this.tiendaActual === tiendaId;
            
            carritosHTML += `
                <label class="carrito-selector-label ${esActivo ? 'activo' : ''}">
                    <input type="radio" name="tipo-carrito" value="tienda-${tiendaId}" ${esActivo ? 'checked' : ''}
                           onchange="window.sistemaCarritosMultiples.cambiarModoCarrito('tienda', '${tiendaId}')">
                    <span>
                        <i class="fas fa-store"></i> 
                        ${nombreCarrito}
                        <button class="carrito-btn-editar-nombre" onclick="window.sistemaCarritosMultiples.editarNombreCarrito('${tiendaId}', event)" style="margin-left: 8px; background: none; border: none; cursor: pointer; font-size: 0.75rem; color: #667eea;">
                            <i class="fas fa-edit"></i>
                        </button>
                    </span>
                    <small>Carrito específico de esta tienda</small>
                    <div class="carrito-resumen-info">
                        <strong>$${resumenTienda.total.toFixed(2)}</strong> • ${resumenTienda.productos} productos
                    </div>
                    <div class="carrito-acciones">
                        <button class="carrito-btn-accion" onclick="window.sistemaCarritosMultiples.compartirCarrito('${tiendaId}')">
                            <i class="fas fa-share-alt"></i> Compartir
                        </button>
                    </div>
                </label>
            `;
        });
        
        carritosHTML += `</div>`;
        
        // Agregar panel de comparación si hay múltiples carritos
        if (Object.keys(this.carritosPorTienda).length > 0) {
            carritosHTML += `<div id="carrito-comparacion-panel" style="display: none;"></div>`;
        }
        
        selector.innerHTML = carritosHTML;
        
        // Insertar antes del carrito o en el header
        if (!selector.parentElement) {
            const cartButton = document.querySelector('.cart-button, .btn-carrito, [onclick*="carrito"]');
            if (cartButton && cartButton.parentElement) {
                cartButton.parentElement.insertBefore(selector, cartButton);
            } else {
                document.body.appendChild(selector);
            }
        }
    }
    
    // Cambiar modo de carrito
    cambiarModoCarrito(modo, tiendaId = null) {
        if (modo === 'tienda' && tiendaId) {
            this.modoCarrito = 'tienda';
            this.tiendaActual = tiendaId;
        } else {
            this.modoCarrito = 'global';
            this.tiendaActual = null;
        }
        
        this.guardarCarritos();
        this.actualizarContadorCarrito();
        this.crearSelectorCarrito(); // Refrescar UI
        
        if (window.elegantNotifications) {
            const nombreCarrito = modo === 'global' 
                ? (this.nombresCarritos['global'] || 'Carrito Global')
                : (this.nombresCarritos[tiendaId] || 'Carrito de Tienda');
            window.elegantNotifications.show(
                `🛒 Cambiaste a: ${nombreCarrito}`,
                'success'
            );
        }
    }
    
    // Cargar personalización del carrito para una tienda
    obtenerPersonalizacionCarrito(tiendaId) {
        if (!tiendaId) return null;
        
        if (!this.personalizacionesCarrito[tiendaId]) {
            // Intentar cargar desde el sistema de personalización
            if (window.PersonalizacionCarritoVendedor) {
                this.personalizacionesCarrito[tiendaId] = new window.PersonalizacionCarritoVendedor(tiendaId);
            }
        }
        
        return this.personalizacionesCarrito[tiendaId];
    }
    
    // Aplicar personalizaciones de carritos
    aplicarPersonalizaciones() {
        // Aplicar estilos globales si hay personalización de tienda actual
        if (this.tiendaActual) {
            const personalizacion = this.obtenerPersonalizacionCarrito(this.tiendaActual);
            if (personalizacion) {
                personalizacion.aplicarPersonalizacion();
            }
        }
    }
    
    // Preguntar al comprador qué tipo de carrito usar
    preguntarTipoCarrito(tiendaId, tiendaNombre, callback) {
        // Verificar si ya se preguntó antes (preferencia guardada)
        const preferenciaGuardada = localStorage.getItem(`cresalia_preferencia_carrito_${tiendaId}`);
        
        if (preferenciaGuardada) {
            // Usar la preferencia guardada
            callback(preferenciaGuardada);
            return;
        }
        
        // Si no hay preferencia, preguntar al usuario
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;';
        modal.innerHTML = `
            <div style="background: white; border-radius: 16px; padding: 32px; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="font-size: 64px; margin-bottom: 16px;">🛒</div>
                    <h3 style="color: #374151; margin: 0 0 8px 0;">¿Qué tipo de carrito prefieres?</h3>
                    <p style="color: #6B7280; margin: 0;">Estás en ${tiendaNombre || 'esta tienda'}</p>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                    <button onclick="seleccionarTipoCarrito('tienda', true)" 
                            style="padding: 16px; border: 2px solid #667eea; border-radius: 12px; background: #F5F3FF; color: #667eea; cursor: pointer; text-align: left; transition: all 0.3s;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="font-size: 24px;">🏪</div>
                            <div>
                                <strong style="display: block; margin-bottom: 4px;">Carrito de la Tienda</strong>
                                <small style="color: #6B7280;">Solo productos de ${tiendaNombre || 'esta tienda'}</small>
                            </div>
                        </div>
                    </button>
                    
                    <button onclick="seleccionarTipoCarrito('global', true)" 
                            style="padding: 16px; border: 2px solid #E5E7EB; border-radius: 12px; background: white; color: #374151; cursor: pointer; text-align: left; transition: all 0.3s;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="font-size: 24px;">🛍️</div>
                            <div>
                                <strong style="display: block; margin-bottom: 4px;">Carrito Global</strong>
                                <small style="color: #6B7280;">Combina productos de todas las tiendas</small>
                            </div>
                        </div>
                    </button>
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #F3F4F6; border-radius: 8px;">
                    <input type="checkbox" id="recordarPreferencia" style="width: 18px; height: 18px; cursor: pointer;">
                    <label for="recordarPreferencia" style="color: #6B7280; cursor: pointer; font-size: 0.9rem;">Recordar mi preferencia para esta tienda</label>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Función para seleccionar tipo de carrito
        window.seleccionarTipoCarrito = (tipo, recordar = false) => {
            const recordarPreferencia = document.getElementById('recordarPreferencia')?.checked || recordar;
            
            if (recordarPreferencia && tipo === 'tienda') {
                localStorage.setItem(`cresalia_preferencia_carrito_${tiendaId}`, 'tienda');
            } else if (recordarPreferencia && tipo === 'global') {
                localStorage.setItem(`cresalia_preferencia_carrito_${tiendaId}`, 'global');
            }
            
            modal.remove();
            delete window.seleccionarTipoCarrito;
            callback(tipo);
        };
    }
    
    // Agregar producto al carrito
    agregarAlCarrito(producto, tiendaId, tiendaNombre) {
        if (!producto || !tiendaId) {
            console.error('Producto o tiendaId faltante');
            return false;
        }
        
        // Si estamos en una tienda específica, verificar si hay preferencia guardada
        // Si no hay preferencia, preguntar al usuario
        const preferenciaGuardada = localStorage.getItem(`cresalia_preferencia_carrito_${tiendaId}`);
        
        if (tiendaId && tiendaId !== 'global' && !preferenciaGuardada && !this.modoCarrito) {
            this.preguntarTipoCarrito(tiendaId, tiendaNombre, (tipo) => {
                this.cambiarModoCarrito(tipo, tipo === 'tienda' ? tiendaId : null);
                this.continuarAgregarAlCarrito(producto, tiendaId, tiendaNombre);
            });
            return true;
        }
        
        return this.continuarAgregarAlCarrito(producto, tiendaId, tiendaNombre);
    }
    
    // Continuar agregando producto al carrito (después de preguntar tipo si era necesario)
    continuarAgregarAlCarrito(producto, tiendaId, tiendaNombre) {
        // Verificar stock bajo y alertar
        const personalizacion = this.obtenerPersonalizacionCarrito(tiendaId);
        let alertaStock = null;
        if (personalizacion) {
            alertaStock = personalizacion.obtenerAlertaStockBajo(producto);
        }
        
        const productoConTienda = {
            ...producto,
            tienda_id: tiendaId,
            tienda_nombre: tiendaNombre || 'Tienda',
            agregado_at: new Date().toISOString()
        };
        
        if (this.modoCarrito === 'global') {
            // Agregar al carrito global
            const existente = this.carritoGlobal.find(item => 
                item.id === producto.id && item.tienda_id === tiendaId
            );
            
            if (existente) {
                existente.cantidad += (producto.cantidad || 1);
            } else {
                this.carritoGlobal.push({
                    ...productoConTienda,
                    cantidad: producto.cantidad || 1
                });
            }
        } else {
            // Agregar al carrito de la tienda específica
            if (!this.carritosPorTienda[tiendaId]) {
                this.carritosPorTienda[tiendaId] = [];
            }
            
            const existente = this.carritosPorTienda[tiendaId].find(item => item.id === producto.id);
            
            if (existente) {
                existente.cantidad += (producto.cantidad || 1);
            } else {
                this.carritosPorTienda[tiendaId].push({
                    ...productoConTienda,
                    cantidad: producto.cantidad || 1
                });
            }
        }
        
        this.guardarCarritos();
        this.actualizarContadorCarrito();
        this.crearSelectorCarrito(); // Refrescar selector con nuevos totales
        
        // Notificación personalizada o por defecto
        let mensajeNotificacion = `✅ ${producto.nombre || 'Producto'} agregado al carrito ${this.modoCarrito === 'global' ? 'global' : 'de la tienda'}`;
        if (personalizacion) {
            const mensajePersonalizado = personalizacion.obtenerMensaje('productoAgregado');
            if (mensajePersonalizado) {
                mensajeNotificacion = `✅ ${producto.nombre || 'Producto'}: ${mensajePersonalizado}`;
            }
        }
        
        if (window.elegantNotifications) {
            window.elegantNotifications.show(mensajeNotificacion, 'success');
            
            // Mostrar alerta de stock bajo si aplica
            if (alertaStock && alertaStock.mostrar) {
                setTimeout(() => {
                    window.elegantNotifications.show(alertaStock.mensaje, alertaStock.tipo);
                }, 500);
            }
        }
        
        return true;
    }
    
    // Obtener carrito actual (según el modo)
    obtenerCarritoActual() {
        if (this.modoCarrito === 'global') {
            return this.carritoGlobal;
        } else if (this.tiendaActual && this.carritosPorTienda[this.tiendaActual]) {
            return this.carritosPorTienda[this.tiendaActual];
        }
        return [];
    }
    
    // Obtener todos los carritos (para checkout global)
    obtenerTodosLosCarritos() {
        const todos = [];
        
        // Agregar carrito global
        todos.push(...this.carritoGlobal);
        
        // Agregar carritos por tienda
        Object.values(this.carritosPorTienda).forEach(carrito => {
            todos.push(...carrito);
        });
        
        // Eliminar duplicados (si un producto está en ambos)
        const unicos = [];
        const vistos = new Set();
        
        todos.forEach(item => {
            const key = `${item.id}_${item.tienda_id}`;
            if (!vistos.has(key)) {
                vistos.add(key);
                unicos.push(item);
            }
        });
        
        return unicos;
    }
    
    // Actualizar contador de carrito
    actualizarContadorCarrito() {
        const carritoActual = this.obtenerCarritoActual();
        const totalItems = carritoActual.reduce((sum, item) => sum + (item.cantidad || 1), 0);
        
        // Actualizar contador en el header
        const contadores = document.querySelectorAll('.cart-count, .cart-badge, [data-cart-count]');
        contadores.forEach(contador => {
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'flex' : 'none';
        });
        
        // Actualizar total
        const total = carritoActual.reduce((sum, item) => sum + ((item.precio || 0) * (item.cantidad || 1)), 0);
        const totalElements = document.querySelectorAll('.cart-total, [data-cart-total]');
        totalElements.forEach(el => {
            el.textContent = `$${total.toFixed(2)}`;
        });
    }
    
    // Eliminar producto del carrito
    eliminarDelCarrito(productoId, tiendaId) {
        if (this.modoCarrito === 'global') {
            this.carritoGlobal = this.carritoGlobal.filter(item => 
                !(item.id === productoId && item.tienda_id === tiendaId)
            );
        } else if (tiendaId && this.carritosPorTienda[tiendaId]) {
            this.carritosPorTienda[tiendaId] = this.carritosPorTienda[tiendaId].filter(
                item => item.id !== productoId
            );
        }
        
        this.guardarCarritos();
        this.actualizarContadorCarrito();
    }
    
    // Actualizar cantidad de un producto
    actualizarCantidad(productoId, tiendaId, nuevaCantidad) {
        if (nuevaCantidad <= 0) {
            this.eliminarDelCarrito(productoId, tiendaId);
            return;
        }
        
        if (this.modoCarrito === 'global') {
            const item = this.carritoGlobal.find(item => 
                item.id === productoId && item.tienda_id === tiendaId
            );
            if (item) {
                item.cantidad = nuevaCantidad;
            }
        } else if (tiendaId && this.carritosPorTienda[tiendaId]) {
            const item = this.carritosPorTienda[tiendaId].find(item => item.id === productoId);
            if (item) {
                item.cantidad = nuevaCantidad;
            }
        }
        
        this.guardarCarritos();
        this.actualizarContadorCarrito();
    }
    
    // Limpiar carrito actual
    limpiarCarritoActual() {
        if (this.modoCarrito === 'global') {
            this.carritoGlobal = [];
        } else if (this.tiendaActual && this.carritosPorTienda[this.tiendaActual]) {
            this.carritosPorTienda[this.tiendaActual] = [];
        }
        
        this.guardarCarritos();
        this.actualizarContadorCarrito();
    }
    
    // Limpiar todos los carritos
    limpiarTodosLosCarritos() {
        this.carritoGlobal = [];
        this.carritosPorTienda = {};
        this.guardarCarritos();
        this.actualizarContadorCarrito();
    }
    
    // Obtener resumen de carritos
    obtenerResumen() {
        const resumen = {
            global: {
                items: this.carritoGlobal.length,
                total: this.carritoGlobal.reduce((sum, item) => sum + ((item.precio || 0) * (item.cantidad || 1)), 0),
                productos: this.carritoGlobal.reduce((sum, item) => sum + (item.cantidad || 1), 0)
            },
            porTienda: {}
        };
        
        Object.keys(this.carritosPorTienda).forEach(tiendaId => {
            const carrito = this.carritosPorTienda[tiendaId];
            resumen.porTienda[tiendaId] = {
                items: carrito.length,
                total: carrito.reduce((sum, item) => sum + ((item.precio || 0) * (item.cantidad || 1)), 0),
                productos: carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0)
            };
        });
        
        return resumen;
    }
    
    // Renderizar carrito en modal
    renderizarCarrito() {
        const carritoActual = this.obtenerCarritoActual();
        
        // Obtener personalización si es carrito de tienda
        let personalizacion = null;
        let mensajeVacio = 'Tu carrito está vacío';
        let mensajeVacioDesc = 'Agrega productos para comenzar';
        
        if (this.modoCarrito === 'tienda' && this.tiendaActual) {
            personalizacion = this.obtenerPersonalizacionCarrito(this.tiendaActual);
            if (personalizacion) {
                mensajeVacio = personalizacion.obtenerMensaje('carritoVacio') || mensajeVacio;
                mensajeVacioDesc = personalizacion.obtenerMensaje('mensajeCarritoVacio') || mensajeVacioDesc;
                personalizacion.aplicarPersonalizacion();
            }
        }
        
        if (carritoActual.length === 0) {
            return `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>${mensajeVacio}</p>
                    <small>${mensajeVacioDesc}</small>
                </div>
            `;
        }
        
        // Agrupar por tienda si es carrito global
        if (this.modoCarrito === 'global') {
            const porTienda = {};
            carritoActual.forEach(item => {
                if (!porTienda[item.tienda_id]) {
                    porTienda[item.tienda_id] = [];
                }
                porTienda[item.tienda_id].push(item);
            });
            
            return Object.keys(porTienda).map(tiendaId => {
                const items = porTienda[tiendaId];
                const tiendaNombre = items[0].tienda_nombre || 'Tienda';
                const subtotal = items.reduce((sum, item) => sum + ((item.precio || 0) * (item.cantidad || 1)), 0);
                
                return `
                    <div class="cart-tienda-group">
                        <div class="cart-tienda-header">
                            <i class="fas fa-store"></i>
                            <strong>${tiendaNombre}</strong>
                            <span class="cart-subtotal-tienda">$${subtotal.toFixed(2)}</span>
                        </div>
                        ${items.map(item => this.renderizarItemCarrito(item)).join('')}
                    </div>
                `;
            }).join('');
        } else {
            return carritoActual.map(item => this.renderizarItemCarrito(item)).join('');
        }
    }
    
    renderizarItemCarrito(item) {
        const total = (item.precio || 0) * (item.cantidad || 1);
        
        // Verificar stock bajo
        let alertaStockHTML = '';
        const personalizacion = this.obtenerPersonalizacionCarrito(item.tienda_id);
        if (personalizacion) {
            const alertaStock = personalizacion.obtenerAlertaStockBajo(item);
            if (alertaStock && alertaStock.mostrar) {
                alertaStockHTML = `<div class="cart-item-stock-alert" style="padding: 8px; background: #FEF3C7; border-radius: 6px; margin-top: 8px; color: #92400E; font-size: 0.85rem;">
                    <i class="fas fa-exclamation-triangle"></i> ${alertaStock.mensaje}
                </div>`;
            }
        }
        
        return `
            <div class="cart-item" data-producto-id="${item.id}" data-tienda-id="${item.tienda_id}">
                <div class="cart-item-info">
                    <h4>${item.nombre || 'Producto'}</h4>
                    ${item.tienda_nombre && this.modoCarrito === 'global' ? 
                        `<small class="cart-item-tienda">${item.tienda_nombre}</small>` : ''}
                    <div class="cart-item-price">$${item.precio?.toFixed(2) || '0.00'}</div>
                    ${alertaStockHTML}
                </div>
                <div class="cart-item-controls">
                    <button class="cart-btn-qty" onclick="window.sistemaCarritosMultiples.actualizarCantidad('${item.id}', '${item.tienda_id}', ${(item.cantidad || 1) - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="cart-item-qty">${item.cantidad || 1}</span>
                    <button class="cart-btn-qty" onclick="window.sistemaCarritosMultiples.actualizarCantidad('${item.id}', '${item.tienda_id}', ${(item.cantidad || 1) + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-item-total">
                    <strong>$${total.toFixed(2)}</strong>
                    <button class="cart-btn-remove" onclick="window.sistemaCarritosMultiples.eliminarDelCarrito('${item.id}', '${item.tienda_id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    // Procesar checkout
    async procesarCheckout() {
        const carritoActual = this.obtenerCarritoActual();
        
        if (carritoActual.length === 0) {
            if (window.elegantNotifications) {
                window.elegantNotifications.show('Tu carrito está vacío', 'warning');
            }
            return;
        }
        
        // Si es carrito global, agrupar por tienda para crear órdenes separadas
        if (this.modoCarrito === 'global') {
            const porTienda = {};
            carritoActual.forEach(item => {
                if (!porTienda[item.tienda_id]) {
                    porTienda[item.tienda_id] = [];
                }
                porTienda[item.tienda_id].push(item);
            });
            
            // Crear una orden por cada tienda
            for (const [tiendaId, items] of Object.entries(porTienda)) {
                await this.crearOrdenPorTienda(tiendaId, items);
            }
        } else {
            // Crear una sola orden para la tienda actual
            await this.crearOrdenPorTienda(this.tiendaActual, carritoActual);
        }
        
        // Limpiar carrito después del checkout
        this.limpiarCarritoActual();
    }
    
    async crearOrdenPorTienda(tiendaId, items) {
        // Aquí se integraría con el backend para crear la orden
        console.log(`📦 Creando orden para tienda ${tiendaId}:`, items);
        
        // TODO: Integrar con backend para crear orden real
        // Por ahora, solo loguear
    }
    
    // Establecer tienda actual (cuando el usuario está navegando una tienda específica)
    establecerTiendaActual(tiendaId) {
        this.tiendaActual = tiendaId;
        
        // Verificar si hay una preferencia guardada para esta tienda
        const preferencia = localStorage.getItem(`cresalia_preferencia_carrito_${tiendaId}`);
        if (preferencia) {
            this.cambiarModoCarrito(preferencia, preferencia === 'tienda' ? tiendaId : null);
        }
        
        // Aplicar personalización del carrito de esta tienda
        this.aplicarPersonalizaciones();
        
        this.actualizarContadorCarrito();
    }
    
    // Editar nombre de un carrito
    editarNombreCarrito(carritoId, event) {
        event.stopPropagation(); // Evitar que se active el radio button
        
        const nombreActual = this.nombresCarritos[carritoId] || 
                            (carritoId === 'global' ? 'Carrito Global' : 
                            (this.carritosPorTienda[carritoId]?.[0]?.tienda_nombre || `Tienda ${carritoId}`));
        
        const nuevoNombre = prompt(`Editar nombre del carrito:`, nombreActual);
        
        if (nuevoNombre && nuevoNombre.trim() !== '') {
            this.nombresCarritos[carritoId] = nuevoNombre.trim();
            this.guardarCarritos();
            this.crearSelectorCarrito(); // Refrescar UI
            
            if (window.elegantNotifications) {
                window.elegantNotifications.show(
                    `✅ Nombre del carrito actualizado a: ${nuevoNombre.trim()}`,
                    'success'
                );
            }
        }
    }
    
    // Mostrar comparación de carritos
    mostrarComparacion() {
        const panel = document.getElementById('carrito-comparacion-panel');
        if (!panel) return;
        
        const resumen = this.obtenerResumen();
        const estaVisible = panel.style.display !== 'none';
        
        if (estaVisible) {
            panel.style.display = 'none';
            return;
        }
        
        let comparacionHTML = `
            <div class="carrito-comparacion-header">
                <h3><i class="fas fa-balance-scale"></i> Comparación de Carritos</h3>
                <button class="carrito-btn-accion" onclick="document.getElementById('carrito-comparacion-panel').style.display='none'">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
            <div class="carrito-comparacion-grid">
        `;
        
        // Carrito Global
        comparacionHTML += `
            <div class="carrito-comparacion-item ${this.modoCarrito === 'global' ? 'activo' : ''}">
                <h4><i class="fas fa-shopping-bag"></i> ${this.nombresCarritos['global'] || 'Carrito Global'}</h4>
                <div class="total">$${resumen.global.total.toFixed(2)}</div>
                <div><strong>${resumen.global.productos}</strong> productos</div>
                <div><strong>${resumen.global.items}</strong> items diferentes</div>
                <button class="carrito-btn-accion" style="margin-top: 10px; width: 100%;" 
                        onclick="window.sistemaCarritosMultiples.cambiarModoCarrito('global')">
                    ${this.modoCarrito === 'global' ? '✓ Activo' : 'Usar este carrito'}
                </button>
            </div>
        `;
        
        // Carritos por tienda
        Object.keys(this.carritosPorTienda).forEach(tiendaId => {
            const resumenTienda = resumen.porTienda[tiendaId];
            const nombreCarrito = this.nombresCarritos[tiendaId] || 
                                (this.carritosPorTienda[tiendaId]?.[0]?.tienda_nombre || `Tienda ${tiendaId}`);
            const esActivo = this.modoCarrito === 'tienda' && this.tiendaActual === tiendaId;
            
            comparacionHTML += `
                <div class="carrito-comparacion-item ${esActivo ? 'activo' : ''}">
                    <h4><i class="fas fa-store"></i> ${nombreCarrito}</h4>
                    <div class="total">$${resumenTienda.total.toFixed(2)}</div>
                    <div><strong>${resumenTienda.productos}</strong> productos</div>
                    <div><strong>${resumenTienda.items}</strong> items diferentes</div>
                    <button class="carrito-btn-accion" style="margin-top: 10px; width: 100%;" 
                            onclick="window.sistemaCarritosMultiples.cambiarModoCarrito('tienda', '${tiendaId}')">
                        ${esActivo ? '✓ Activo' : 'Usar este carrito'}
                    </button>
                </div>
            `;
        });
        
        comparacionHTML += `</div>`;
        
        // Resumen comparativo
        const todosLosTotales = [
            resumen.global.total,
            ...Object.values(resumen.porTienda).map(t => t.total)
        ];
        const totalMaximo = Math.max(...todosLosTotales);
        const totalMinimo = Math.min(...todosLosTotales);
        const diferencia = totalMaximo - totalMinimo;
        
        if (diferencia > 0) {
            comparacionHTML += `
                <div style="margin-top: 15px; padding: 12px; background: #F0F9FF; border-radius: 8px; border-left: 4px solid #667eea;">
                    <strong>Resumen:</strong><br>
                    <small>Diferencia entre carritos: $${diferencia.toFixed(2)}</small><br>
                    <small>Carrito más caro: $${totalMaximo.toFixed(2)}</small><br>
                    <small>Carrito más barato: $${totalMinimo.toFixed(2)}</small>
                </div>
            `;
        }
        
        panel.innerHTML = comparacionHTML;
        panel.style.display = 'block';
        
        // Scroll suave al panel
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Compartir carrito
    compartirCarrito(carritoId) {
        let datosCarrito;
        let nombreCarrito;
        
        if (carritoId === 'global') {
            datosCarrito = this.carritoGlobal;
            nombreCarrito = this.nombresCarritos['global'] || 'Carrito Global';
        } else {
            datosCarrito = this.carritosPorTienda[carritoId] || [];
            nombreCarrito = this.nombresCarritos[carritoId] || 
                          (datosCarrito[0]?.tienda_nombre || `Tienda ${carritoId}`);
        }
        
        if (datosCarrito.length === 0) {
            if (window.elegantNotifications) {
                window.elegantNotifications.show(
                    'Este carrito está vacío. Agrega productos para compartirlo.',
                    'warning'
                );
            }
            return;
        }
        
        // Crear ID único para el carrito compartido
        const carritoCompartidoId = `cresalia_carrito_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Guardar en localStorage (en producción, esto se guardaría en Supabase)
        this.carritosCompartidos[carritoCompartidoId] = {
            carrito_id: carritoId,
            datos: datosCarrito,
            nombre: nombreCarrito,
            compartido_por: 'Usuario', // En producción, usaría el ID del usuario autenticado
            fecha: new Date().toISOString(),
            expira_en: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
        };
        this.guardarCarritos();
        
        // Generar URL para compartir (en producción, sería una URL real de la plataforma)
        const urlCompartida = `${window.location.origin}${window.location.pathname}?carrito_compartido=${carritoCompartidoId}`;
        
        // Mostrar modal para compartir
        this.mostrarModalCompartir(nombreCarrito, urlCompartida, carritoCompartidoId);
    }
    
    // Mostrar modal para compartir carrito
    mostrarModalCompartir(nombreCarrito, urlCompartida, carritoCompartidoId) {
        // Buscar o crear modal
        let modal = document.getElementById('carrito-compartir-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'carrito-compartir-modal';
            modal.className = 'carrito-compartir-modal';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div class="carrito-compartir-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3><i class="fas fa-share-alt"></i> Compartir Carrito</h3>
                    <button onclick="document.getElementById('carrito-compartir-modal').classList.remove('activo')" 
                            style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6B7280;">
                        ×
                    </button>
                </div>
                <p><strong>${nombreCarrito}</strong></p>
                <p style="font-size: 0.9rem; color: #6B7280;">
                    Comparte este enlace para que otros puedan ver tu carrito. El enlace expirará en 30 días.
                </p>
                <div class="carrito-link-compartido">
                    <input type="text" id="carrito-link-input" value="${urlCompartida}" readonly>
                    <button onclick="window.sistemaCarritosMultiples.copiarLinkCompartido()">
                        <i class="fas fa-copy"></i> Copiar
                    </button>
                </div>
                <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="carrito-btn-accion" onclick="window.sistemaCarritosMultiples.compartirEnWhatsApp('${urlCompartida}', '${nombreCarrito}')">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                    <button class="carrito-btn-accion" onclick="window.sistemaCarritosMultiples.compartirEnEmail('${urlCompartida}', '${nombreCarrito}')">
                        <i class="fas fa-envelope"></i> Email
                    </button>
                </div>
                <div style="margin-top: 15px; padding: 10px; background: #FEF3C7; border-radius: 6px; font-size: 0.85rem;">
                    <strong>Nota:</strong> Por ahora, los carritos compartidos se guardan localmente. 
                    En el futuro, se sincronizarán con Supabase para compartir entre dispositivos.
                </div>
            </div>
        `;
        
        modal.classList.add('activo');
        
        // Cerrar al hacer clic fuera del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('activo');
            }
        });
    }
    
    // Copiar link compartido
    copiarLinkCompartido() {
        const input = document.getElementById('carrito-link-input');
        if (input) {
            input.select();
            input.setSelectionRange(0, 99999); // Para móviles
            document.execCommand('copy');
            
            if (window.elegantNotifications) {
                window.elegantNotifications.show(
                    '✅ Enlace copiado al portapapeles',
                    'success'
                );
            }
            
            // Cerrar modal después de copiar
            setTimeout(() => {
                const modal = document.getElementById('carrito-compartir-modal');
                if (modal) {
                    modal.classList.remove('activo');
                }
            }, 1000);
        }
    }
    
    // Compartir en WhatsApp
    compartirEnWhatsApp(url, nombreCarrito) {
        const mensaje = encodeURIComponent(`Mira mi carrito "${nombreCarrito}" en Cresalia: ${url}`);
        window.open(`https://wa.me/?text=${mensaje}`, '_blank');
    }
    
    // Compartir por Email
    compartirEnEmail(url, nombreCarrito) {
        const asunto = encodeURIComponent(`Carrito compartido: ${nombreCarrito}`);
        const cuerpo = encodeURIComponent(`Hola,\n\nQuiero compartir contigo mi carrito "${nombreCarrito}" en Cresalia:\n\n${url}\n\n¡Míralo cuando puedas!`);
        window.location.href = `mailto:?subject=${asunto}&body=${cuerpo}`;
    }
    
    // Cargar carrito compartido (cuando alguien accede con el link)
    cargarCarritoCompartido(carritoCompartidoId) {
        const carritoCompartido = this.carritosCompartidos[carritoCompartidoId];
        
        if (!carritoCompartido) {
            if (window.elegantNotifications) {
                window.elegantNotifications.show(
                    'El carrito compartido no se encontró o ha expirado.',
                    'error'
                );
            }
            return false;
        }
        
        // Verificar si expiró
        if (new Date(carritoCompartido.expira_en) < new Date()) {
            if (window.elegantNotifications) {
                window.elegantNotifications.show(
                    'Este carrito compartido ha expirado.',
                    'warning'
                );
            }
            return false;
        }
        
        // Mostrar modal para importar el carrito
        const confirmar = confirm(
            `¿Deseas importar el carrito "${carritoCompartido.nombre}"?\n\n` +
            `Tiene ${carritoCompartido.datos.length} productos.\n\n` +
            `Esto agregará los productos a tu carrito actual.`
        );
        
        if (confirmar) {
            // Agregar productos al carrito actual
            carritoCompartido.datos.forEach(producto => {
                this.agregarAlCarrito(
                    producto,
                    producto.tienda_id,
                    producto.tienda_nombre
                );
            });
            
            if (window.elegantNotifications) {
                window.elegantNotifications.show(
                    `✅ Carrito "${carritoCompartido.nombre}" importado exitosamente`,
                    'success'
                );
            }
            
            return true;
        }
        
        return false;
    }
}

// Instancia global
window.sistemaCarritosMultiples = new SistemaCarritosMultiples();

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    if (window.sistemaCarritosMultiples) {
        window.sistemaCarritosMultiples.initUI();
        
        // Detectar si hay un carrito compartido en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const carritoCompartidoId = urlParams.get('carrito_compartido');
        
        if (carritoCompartidoId) {
            // Esperar un poco para asegurar que todo está cargado
            setTimeout(() => {
                window.sistemaCarritosMultiples.cargarCarritoCompartido(carritoCompartidoId);
                // Limpiar la URL después de cargar
                const nuevaUrl = window.location.pathname;
                window.history.replaceState({}, document.title, nuevaUrl);
            }, 500);
        }
    }
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SistemaCarritosMultiples };
}

