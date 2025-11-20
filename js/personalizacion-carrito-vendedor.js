// ===== SISTEMA DE PERSONALIZACIÓN DEL CARRITO PARA VENDEDORES - CRESALIA =====
// Permite a los vendedores personalizar la interfaz y comportamiento de su carrito
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: 2025

class PersonalizacionCarritoVendedor {
    constructor(tiendaId) {
        this.tiendaId = tiendaId || 'default';
        this.config = this.cargarConfiguracion();
        this.planActual = localStorage.getItem('plan-actual') || 'free';
    }
    
    // Cargar configuración desde localStorage
    cargarConfiguracion() {
        const key = `carrito_personalizacion_${this.tiendaId}`;
        const config = localStorage.getItem(key);
        
        if (config) {
            try {
                return JSON.parse(config);
            } catch (error) {
                console.warn('Error cargando configuración del carrito:', error);
            }
        }
        
        // Configuración por defecto
        return {
            // Personalización visual
            usarColoresTienda: true, // Si true, usa los colores de la tienda
            colores: {
                primario: '#667EEA',
                secundario: '#764BA2',
                acento: '#EC4899',
                fondo: '#FFFFFF',
                texto: '#374151'
            },
            mostrarLogo: true, // Mostrar logo de la tienda en el carrito
            logo: null, // Logo personalizado para el carrito (si no, usa el de la tienda)
            
            // Mensajes personalizados
            mensajes: {
                carritoVacio: 'Tu carrito está vacío',
                mensajeCarritoVacio: 'Agrega algunos productos para comenzar',
                productoAgregado: 'Producto agregado al carrito',
                antesCheckout: '¡Estás a un paso de completar tu compra!',
                gracias: '¡Gracias por tu compra!'
            },
            
            // Configuración de comportamiento
            minimoCompra: 0, // 0 = sin mínimo
            costoEnvio: 0, // 0 = gratis, -1 = calcular, número = costo fijo
            mostrarCostoEnvio: true,
            opcionesEntrega: {
                recogerTienda: true,
                envio: true,
                mensajeria: false
            },
            
            // Alertas de stock
            alertarStockBajo: true,
            umbralStock: 5, // Alertar cuando hay menos de 5 unidades
            
            // Descuentos automáticos
            descuentos: {
                activo: false,
                porCantidad: [], // [{ cantidad: 10, descuento: 10 }]
                porMonto: [] // [{ monto: 100, descuento: 5 }]
            },
            
            // Imagen de fondo (opcional)
            imagenFondo: null,
            usarImagenFondo: false
        };
    }
    
    // Guardar configuración
    guardarConfiguracion() {
        const key = `carrito_personalizacion_${this.tiendaId}`;
        localStorage.setItem(key, JSON.stringify(this.config));
        console.log('✅ Configuración del carrito guardada');
        
        // Aplicar cambios inmediatamente si el carrito está visible
        this.aplicarPersonalizacion();
    }
    
    // Aplicar personalización al carrito
    aplicarPersonalizacion() {
        // Obtener colores (de la tienda o personalizados)
        let colores = { ...this.config.colores };
        
        if (this.config.usarColoresTienda) {
            // Intentar obtener colores de la personalización de la tienda
            const persTienda = window.personalizacionTienda;
            if (persTienda && persTienda.config && persTienda.config.colores) {
                colores.primario = persTienda.config.colores.primario || colores.primario;
                colores.secundario = persTienda.config.colores.secundario || colores.secundario;
                colores.acento = persTienda.config.colores.acento || colores.acento;
            }
        }
        
        // Aplicar colores como CSS variables
        const root = document.documentElement;
        root.style.setProperty('--carrito-color-primario', colores.primario);
        root.style.setProperty('--carrito-color-secundario', colores.secundario);
        root.style.setProperty('--carrito-color-acento', colores.acento);
        root.style.setProperty('--carrito-color-fondo', colores.fondo);
        root.style.setProperty('--carrito-color-texto', colores.texto);
        
        // Aplicar logo si está configurado
        if (this.config.mostrarLogo) {
            let logoSrc = this.config.logo;
            if (!logoSrc && window.personalizacionTienda && window.personalizacionTienda.config) {
                logoSrc = window.personalizacionTienda.config.logo;
            }
            
            if (logoSrc) {
                const logoElements = document.querySelectorAll('.carrito-logo-tienda, [data-carrito-logo]');
                logoElements.forEach(el => {
                    el.src = logoSrc;
                    el.style.display = 'block';
                });
            }
        }
        
        // Aplicar imagen de fondo si está configurada
        if (this.config.usarImagenFondo && this.config.imagenFondo) {
            const carritoContainer = document.querySelector('.selector-tipo-carrito, .cart-container, [data-carrito-container]');
            if (carritoContainer) {
                carritoContainer.style.backgroundImage = `url(${this.config.imagenFondo})`;
                carritoContainer.style.backgroundSize = 'cover';
                carritoContainer.style.backgroundPosition = 'center';
            }
        }
    }
    
    // Obtener mensaje personalizado
    obtenerMensaje(tipo) {
        return this.config.mensajes[tipo] || '';
    }
    
    // Verificar si hay mínimo de compra
    verificarMinimoCompra(total) {
        if (this.config.minimoCompra > 0 && total < this.config.minimoCompra) {
            return {
                cumple: false,
                mensaje: `El monto mínimo de compra es $${this.config.minimoCompra.toFixed(2)}. Te faltan $${(this.config.minimoCompra - total).toFixed(2)}.`
            };
        }
        return { cumple: true };
    }
    
    // Calcular costo de envío
    calcularCostoEnvio() {
        if (this.config.costoEnvio === 0) {
            return 0; // Gratis
        } else if (this.config.costoEnvio === -1) {
            // Calcular según distancia (por ahora, simulado)
            return 500; // Simulado
        } else {
            return this.config.costoEnvio; // Costo fijo
        }
    }
    
    // Verificar stock bajo y alertar
    verificarStockBajo(producto) {
        if (!this.config.alertarStockBajo) return false;
        
        const stock = producto.stock || 0;
        return stock > 0 && stock <= this.config.umbralStock;
    }
    
    // Obtener alerta de stock bajo
    obtenerAlertaStockBajo(producto) {
        if (this.verificarStockBajo(producto)) {
            return {
                mostrar: true,
                mensaje: `⚠️ ¡Últimas ${producto.stock} unidades disponibles!`,
                tipo: 'warning'
            };
        }
        return { mostrar: false };
    }
    
    // Calcular descuento automático
    calcularDescuento(cantidad, montoTotal) {
        if (!this.config.descuentos.activo) return 0;
        
        let descuento = 0;
        
        // Descuento por cantidad
        this.config.descuentos.porCantidad.forEach(regla => {
            if (cantidad >= regla.cantidad) {
                descuento = Math.max(descuento, regla.descuento);
            }
        });
        
        // Descuento por monto
        this.config.descuentos.porMonto.forEach(regla => {
            if (montoTotal >= regla.monto) {
                descuento = Math.max(descuento, regla.descuento);
            }
        });
        
        return descuento;
    }
}

// Función global para abrir personalización del carrito
window.abrirPersonalizacionCarrito = function(tiendaId) {
    console.log('🛒 Abriendo personalización del carrito...');
    
    const personalizacion = new PersonalizacionCarritoVendedor(tiendaId);
    
    const modal = document.createElement('div');
    modal.id = 'modalPersonalizacionCarrito';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999999;';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 24px; max-width: 900px; width: 95%; max-height: 90vh; overflow-y: auto;">
            <div style="background: linear-gradient(135deg, #667EEA, #764BA2); color: white; padding: 32px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 16px;">🛒</div>
                <h2 style="margin: 0;">Personalización del Carrito</h2>
                <p style="margin: 8px 0 0; opacity: 0.95;">Personaliza la interfaz y comportamiento de tu carrito</p>
            </div>
            
            <div style="padding: 32px;">
                <form id="formPersonalizacionCarrito" onsubmit="guardarPersonalizacionCarrito(event, '${tiendaId}'); return false;">
                    
                    <!-- Colores -->
                    <h3 style="margin: 0 0 20px 0; color: #374151; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px;">
                        <i class="fas fa-palette"></i> Colores del Carrito
                    </h3>
                    
                    <div style="margin-bottom: 24px;">
                        <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; cursor: pointer;">
                            <input type="checkbox" id="usarColoresTienda" ${personalizacion.config.usarColoresTienda ? 'checked' : ''} 
                                   onchange="toggleColoresPersonalizados()" style="width: 20px; height: 20px; cursor: pointer;">
                            <span style="font-weight: 600;">Usar colores de la tienda</span>
                        </label>
                        
                        <div id="coloresPersonalizados" style="display: ${personalizacion.config.usarColoresTienda ? 'none' : 'grid'}; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Color Primario</label>
                                <input type="color" id="carritoColorPrimario" value="${personalizacion.config.colores.primario}" style="width: 100%; height: 50px; border: 2px solid #E5E7EB; border-radius: 12px; cursor: pointer;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Color Secundario</label>
                                <input type="color" id="carritoColorSecundario" value="${personalizacion.config.colores.secundario}" style="width: 100%; height: 50px; border: 2px solid #E5E7EB; border-radius: 12px; cursor: pointer;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Color de Acento</label>
                                <input type="color" id="carritoColorAcento" value="${personalizacion.config.colores.acento}" style="width: 100%; height: 50px; border: 2px solid #E5E7EB; border-radius: 12px; cursor: pointer;">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Logo -->
                    <h3 style="margin: 0 0 20px 20px 0; color: #374151; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px; margin-top: 32px;">
                        <i class="fas fa-image"></i> Logo en el Carrito
                    </h3>
                    
                    <div style="margin-bottom: 24px;">
                        <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; cursor: pointer;">
                            <input type="checkbox" id="mostrarLogoCarrito" ${personalizacion.config.mostrarLogo ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                            <span style="font-weight: 600;">Mostrar logo de la tienda en el carrito</span>
                        </label>
                        
                        <div id="logoPersonalizadoContainer" style="display: ${personalizacion.config.mostrarLogo ? 'block' : 'none'};">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Logo personalizado (opcional, si no se usa el de la tienda)</label>
                            <input type="file" id="carritoLogoPersonalizado" accept="image/*" onchange="previsualizarLogoCarrito(this)" style="width: 100%; padding: 14px; border: 2px solid #E5E7EB; border-radius: 12px;">
                            <div id="previewLogoCarrito" style="margin-top: 16px; text-align: center; display: ${personalizacion.config.logo ? 'block' : 'none'};">
                                <img id="imgPreviewLogoCarrito" src="${personalizacion.config.logo || ''}" style="max-width: 200px; max-height: 100px; border-radius: 12px; border: 2px solid #E5E7EB;">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Mensajes -->
                    <h3 style="margin: 0 0 20px 0; color: #374151; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px; margin-top: 32px;">
                        <i class="fas fa-comment-dots"></i> Mensajes Personalizados
                    </h3>
                    
                    <div style="display: grid; gap: 16px; margin-bottom: 24px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Mensaje cuando el carrito está vacío</label>
                            <input type="text" id="mensajeCarritoVacio" value="${personalizacion.config.mensajes.carritoVacio}" 
                                   placeholder="Tu carrito está vacío" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Mensaje al agregar producto</label>
                            <input type="text" id="mensajeProductoAgregado" value="${personalizacion.config.mensajes.productoAgregado}" 
                                   placeholder="Producto agregado al carrito" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Mensaje antes del checkout</label>
                            <input type="text" id="mensajeAntesCheckout" value="${personalizacion.config.mensajes.antesCheckout}" 
                                   placeholder="¡Estás a un paso de completar tu compra!" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                        </div>
                    </div>
                    
                    <!-- Comportamiento -->
                    <h3 style="margin: 0 0 20px 0; color: #374151; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px; margin-top: 32px;">
                        <i class="fas fa-cogs"></i> Configuración de Comportamiento
                    </h3>
                    
                    <div style="display: grid; gap: 16px; margin-bottom: 24px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Mínimo de compra ($)</label>
                            <input type="number" id="minimoCompra" value="${personalizacion.config.minimoCompra}" min="0" step="0.01"
                                   placeholder="0 = sin mínimo" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Costo de envío</label>
                            <select id="costoEnvio" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                                <option value="0" ${personalizacion.config.costoEnvio === 0 ? 'selected' : ''}>Gratis</option>
                                <option value="-1" ${personalizacion.config.costoEnvio === -1 ? 'selected' : ''}>Calcular automáticamente</option>
                                <option value="custom" ${personalizacion.config.costoEnvio > 0 ? 'selected' : ''}>Costo fijo</option>
                            </select>
                            <input type="number" id="costoEnvioFijo" value="${personalizacion.config.costoEnvio > 0 ? personalizacion.config.costoEnvio : ''}" 
                                   min="0" step="0.01" placeholder="Ingresa el costo fijo" 
                                   style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; margin-top: 8px; display: ${personalizacion.config.costoEnvio > 0 ? 'block' : 'none'};">
                        </div>
                    </div>
                    
                    <!-- Alertas de Stock -->
                    <h3 style="margin: 0 0 20px 0; color: #374151; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px; margin-top: 32px;">
                        <i class="fas fa-exclamation-triangle"></i> Alertas de Stock
                    </h3>
                    
                    <div style="margin-bottom: 24px;">
                        <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; cursor: pointer;">
                            <input type="checkbox" id="alertarStockBajo" ${personalizacion.config.alertarStockBajo ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                            <span style="font-weight: 600;">Alertar cuando el stock esté bajo</span>
                        </label>
                        
                        <div id="configStockBajo" style="display: ${personalizacion.config.alertarStockBajo ? 'block' : 'none'};">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Umbral de stock bajo (unidades)</label>
                            <input type="number" id="umbralStock" value="${personalizacion.config.umbralStock}" min="1" 
                                   placeholder="5" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                            <small style="color: #6B7280; display: block; margin-top: 4px;">Se alertará cuando queden menos unidades que este número</small>
                        </div>
                    </div>
                    
                    <!-- Botones -->
                    <div style="display: flex; gap: 12px; padding-top: 20px; border-top: 2px solid #E5E7EB; margin-top: 32px;">
                        <button type="button" onclick="document.getElementById('modalPersonalizacionCarrito').remove()" 
                                style="flex: 1; background: #F3F4F6; color: #374151; border: none; padding: 16px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                            Cancelar
                        </button>
                        <button type="submit" 
                                style="flex: 2; background: linear-gradient(135deg, #667EEA, #764BA2); color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                            <i class="fas fa-save"></i> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Actualizar visibilidad del costo de envío fijo
    document.getElementById('costoEnvio').addEventListener('change', function() {
        const costoFijoInput = document.getElementById('costoEnvioFijo');
        costoFijoInput.style.display = this.value === 'custom' ? 'block' : 'none';
    });
    
    // Actualizar visibilidad de configuración de stock
    document.getElementById('alertarStockBajo').addEventListener('change', function() {
        document.getElementById('configStockBajo').style.display = this.checked ? 'block' : 'none';
    });
    
    // Actualizar visibilidad del logo personalizado
    document.getElementById('mostrarLogoCarrito').addEventListener('change', function() {
        document.getElementById('logoPersonalizadoContainer').style.display = this.checked ? 'block' : 'none';
    });
};

// Función para toggle de colores personalizados
window.toggleColoresPersonalizados = function() {
    const usarColoresTienda = document.getElementById('usarColoresTienda').checked;
    document.getElementById('coloresPersonalizados').style.display = usarColoresTienda ? 'none' : 'grid';
};

// Función para previsualizar logo
window.previsualizarLogoCarrito = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imgPreviewLogoCarrito').src = e.target.result;
            document.getElementById('previewLogoCarrito').style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
};

// Función para guardar personalización
window.guardarPersonalizacionCarrito = function(event, tiendaId) {
    event.preventDefault();
    
    const personalizacion = new PersonalizacionCarritoVendedor(tiendaId);
    
    // Guardar configuración
    personalizacion.config.usarColoresTienda = document.getElementById('usarColoresTienda').checked;
    personalizacion.config.colores.primario = document.getElementById('carritoColorPrimario').value;
    personalizacion.config.colores.secundario = document.getElementById('carritoColorSecundario').value;
    personalizacion.config.colores.acento = document.getElementById('carritoColorAcento').value;
    
    personalizacion.config.mostrarLogo = document.getElementById('mostrarLogoCarrito').checked;
    
    // Guardar logo si se subió uno nuevo
    const logoInput = document.getElementById('carritoLogoPersonalizado');
    if (logoInput.files && logoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            personalizacion.config.logo = e.target.result;
            personalizacion.guardarConfiguracion();
            cerrarModalPersonalizacion();
        };
        reader.readAsDataURL(logoInput.files[0]);
    } else {
        // Mensajes
        personalizacion.config.mensajes.carritoVacio = document.getElementById('mensajeCarritoVacio').value;
        personalizacion.config.mensajes.productoAgregado = document.getElementById('mensajeProductoAgregado').value;
        personalizacion.config.mensajes.antesCheckout = document.getElementById('mensajeAntesCheckout').value;
        
        // Comportamiento
        personalizacion.config.minimoCompra = parseFloat(document.getElementById('minimoCompra').value) || 0;
        
        const costoEnvioSelect = document.getElementById('costoEnvio').value;
        if (costoEnvioSelect === 'custom') {
            personalizacion.config.costoEnvio = parseFloat(document.getElementById('costoEnvioFijo').value) || 0;
        } else {
            personalizacion.config.costoEnvio = parseInt(costoEnvioSelect);
        }
        
        // Alertas de stock
        personalizacion.config.alertarStockBajo = document.getElementById('alertarStockBajo').checked;
        personalizacion.config.umbralStock = parseInt(document.getElementById('umbralStock').value) || 5;
        
        personalizacion.guardarConfiguracion();
        cerrarModalPersonalizacion();
    }
    
    function cerrarModalPersonalizacion() {
        const modal = document.getElementById('modalPersonalizacionCarrito');
        if (modal) {
            modal.remove();
        }
        
        if (window.elegantNotifications) {
            window.elegantNotifications.show('✅ Personalización del carrito guardada exitosamente', 'success');
        } else {
            alert('✅ Personalización del carrito guardada exitosamente');
        }
    }
};

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PersonalizacionCarritoVendedor };
}

// Hacer disponible globalmente
window.PersonalizacionCarritoVendedor = PersonalizacionCarritoVendedor;

