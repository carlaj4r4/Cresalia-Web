// ===== CRESALIA - PLATAFORMA SAAS MULTI-TENANT =====
// ===== CONFIGURACIÓN DEMO =====
const CONFIG_EMPRESA = {
    nombre: 'Cresalia',
    marca: 'CRESALIA',
    logo: './assets/logo/logo-cresalia.png',
    telefono: '+54 11 XXXX-XXXX',
    email: 'contacto@cresalia.com',
    direccion: 'Argentina',
    whatsapp: '5411XXXXXXXX',
    facebook: 'https://www.facebook.com/cresalia',
    instagram: 'https://www.instagram.com/cresalia_oficial',
    adminPassword: '[CONFIGURACIÓN PRIVADA]', // Mover a variables de entorno
    horarios: 'Soporte 24/7 - Siempre disponible para vos 💜',
    ventaMayorista: 'Planes desde $10,000 ARS/mes',
    horarioComercial: 'Soporte disponible 24/7'
};

// ===== SISTEMA DE GEOLOCALIZACIÓN Y DISTANCIAS =====
let ubicacionUsuarioGlobal = null;

// Obtener ubicación del usuario (reutilizable)
async function obtenerUbicacionUsuarioGlobal() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            console.log('⚠️ Geolocalización no disponible en este navegador');
            resolve(null);
            return;
        }
        
        // Verificar si ya tenemos la ubicación guardada
        const ubicacionGuardada = localStorage.getItem('cresalia_ubicacion_usuario');
        if (ubicacionGuardada) {
            try {
                const ubicacion = JSON.parse(ubicacionGuardada);
                const fechaGuardada = new Date(ubicacion.fecha);
                const ahora = new Date();
                const horasTranscurridas = (ahora - fechaGuardada) / (1000 * 60 * 60);
                
                // Si la ubicación tiene menos de 1 hora, usarla (evita solicitar permiso de nuevo)
                if (horasTranscurridas < 1) {
                    ubicacionUsuarioGlobal = ubicacion;
                    console.log('✅ Ubicación cargada desde cache (evita solicitar permiso de nuevo):', ubicacion);
                    resolve(ubicacion);
                    return;
                }
            } catch (error) {
                console.log('⚠️ Error cargando ubicación guardada:', error);
            }
        }
        
        // Verificar si ya se concedió permiso anteriormente (evita pedir múltiples veces)
        const consentimiento = localStorage.getItem('cresalia_geolocalizacion_consentimiento');
        if (consentimiento === 'denegado' || consentimiento === 'denied') {
            console.log('ℹ️ Usuario denegó permiso de ubicación anteriormente, usando ubicación guardada si existe');
            resolve(null);
            return;
        }
        
        // Solicitar nueva ubicación solo si no hay una guardada reciente
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const ubicacion = {
                    latitud: position.coords.latitude,
                    longitud: position.coords.longitude,
                    fecha: new Date().toISOString()
                };
                
                ubicacionUsuarioGlobal = ubicacion;
                localStorage.setItem('cresalia_ubicacion_usuario', JSON.stringify(ubicacion));
                console.log('✅ Ubicación del usuario obtenida:', ubicacion);
                resolve(ubicacion);
            },
            (error) => {
                console.log('⚠️ Error obteniendo ubicación:', error.message);
                resolve(null);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 3600000 // 1 hora
            }
        );
    });
}

// Calcular distancia entre dos puntos (fórmula de Haversine)
function calcularDistanciaGlobal(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;
    return Math.round(distancia * 10) / 10; // Redondear a 1 decimal
}

// Cargar ubicaciones de tiendas desde Supabase o localStorage
async function cargarUbicacionesTiendas(tiendaId) {
    let ubicaciones = [];
    
    // Intentar cargar desde Supabase
    if (window.supabase || window.SUPABASE_CLIENT) {
        const supabase = window.supabase || window.SUPABASE_CLIENT;
        
        try {
            const { data, error } = await supabase
                .from('ubicaciones_tiendas')
                .select('*')
                .eq('tienda_id', tiendaId)
                .eq('estado', 'activo');
            
            if (!error && data && data.length > 0) {
                ubicaciones = data;
                console.log('✅ Ubicaciones de tienda cargadas desde Supabase:', ubicaciones.length);
                
                // Guardar en localStorage como backup
                localStorage.setItem(`ubicaciones_${tiendaId}`, JSON.stringify(ubicaciones));
            }
        } catch (supabaseError) {
            console.log('⚠️ Error cargando ubicaciones desde Supabase:', supabaseError);
        }
    }
    
    // Si no hay en Supabase, intentar desde localStorage
    if (ubicaciones.length === 0) {
        const ubicacionesGuardadas = localStorage.getItem(`ubicaciones_${tiendaId}`);
        if (ubicacionesGuardadas) {
            ubicaciones = JSON.parse(ubicacionesGuardadas);
            console.log('✅ Ubicaciones de tienda cargadas desde localStorage:', ubicaciones.length);
        }
    }
    
    return ubicaciones;
}

// Calcular distancias para tiendas
async function calcularDistanciasTiendas(tiendas) {
    if (!ubicacionUsuarioGlobal) {
        await obtenerUbicacionUsuarioGlobal();
    }
    
    if (!ubicacionUsuarioGlobal) {
        console.log('⚠️ No se pudo obtener la ubicación del usuario');
        return tiendas;
    }
    
    for (let tienda of tiendas) {
        // Cargar ubicaciones de la tienda
        const ubicaciones = await cargarUbicacionesTiendas(tienda.id || tienda.slug);
        
        if (ubicaciones.length > 0) {
            // Usar la primera ubicación activa
            const ubicacion = ubicaciones[0];
            
            if (ubicacion.latitud && ubicacion.longitud) {
                tienda.distancia = calcularDistanciaGlobal(
                    ubicacionUsuarioGlobal.latitud,
                    ubicacionUsuarioGlobal.longitud,
                    parseFloat(ubicacion.latitud),
                    parseFloat(ubicacion.longitud)
                );
                tienda.ubicacion = ubicacion;
            } else {
                tienda.distancia = null;
            }
        } else {
            tienda.distancia = null;
        }
    }
    
    return tiendas;
}

// ===== DATOS DE PRODUCTOS REALES =====
const PRODUCTOS_DATA = [
    // Los productos se cargarán dinámicamente desde el panel de administración
    // o desde el backend multi-tenant
    // Array vacío para evitar productos fantasma
];



// ===== CARRITO DE COMPRAS =====
let carrito = [];
let productosFiltrados = PRODUCTOS_DATA;

// ===== SINCRONIZACIÓN CON PANEL DE ADMINISTRACIÓN =====
function sincronizarProductosConAdmin() {
    console.log('🔄 Sincronizando productos con panel de administración...');
    
    // Verificar si hay productos guardados en el panel de administración
    const productosAdmin = localStorage.getItem('productosAUTO');
    
    if (productosAdmin) {
        try {
            const productosGuardados = JSON.parse(productosAdmin);
            if (productosGuardados.length > 0) {
                console.log('✅ Usando productos del panel de administración:', productosGuardados.length);
                // Actualizar PRODUCTOS_DATA con los productos del admin
                PRODUCTOS_DATA.length = 0; // Limpiar array
                PRODUCTOS_DATA.push(...productosGuardados); // Agregar productos del admin
                productosFiltrados = [...PRODUCTOS_DATA];
                console.log('✅ Productos sincronizados desde panel de administración');
                return;
            }
        } catch (error) {
            console.error('❌ Error al cargar productos del admin:', error);
        }
    }
    
    // Si no hay productos del admin, guardar los productos por defecto
    console.log('💾 Guardando productos por defecto en localStorage...');
    localStorage.setItem('productosAUTO', JSON.stringify(PRODUCTOS_DATA));
    console.log('✅ Productos por defecto guardados para el panel de administración');
}

// ===== FUNCIÓN PARA ACTUALIZAR PRODUCTOS DESDE ADMIN =====
function actualizarProductosDesdeAdmin() {
    console.log('🔄 Actualizando productos desde panel de administración...');
    
    const productosAdmin = localStorage.getItem('productosAUTO');
    if (productosAdmin) {
        try {
            const productosGuardados = JSON.parse(productosAdmin);
            if (productosGuardados.length > 0) {
                // Actualizar PRODUCTOS_DATA
                PRODUCTOS_DATA.length = 0;
                PRODUCTOS_DATA.push(...productosGuardados);
                productosFiltrados = [...PRODUCTOS_DATA];
                
                // Re-renderizar productos si estamos en la página principal
                const productosGrid = document.getElementById('productosGrid');
                if (productosGrid && typeof renderizarProductos === 'function') {
                    renderizarProductos(PRODUCTOS_DATA);
                }
                
                console.log('✅ Productos actualizados desde panel de administración');
            }
        } catch (error) {
            console.error('❌ Error al actualizar productos:', error);
        }
    }
}

// ===== LISTENER PARA CAMBIOS EN LOCALSTORAGE =====
window.addEventListener('storage', function(e) {
    if (e.key === 'productosAUTO') {
        console.log('🔄 Cambio detectado en productos del panel de administración');
        actualizarProductosDesdeAdmin();
    }
});

// ===== FUNCIÓN PARA FORZAR ACTUALIZACIÓN DESDE ADMIN =====
function forzarActualizacionProductos() {
    console.log('🔄 Forzando actualización de productos...');
    actualizarProductosDesdeAdmin();
}

// ===== FUNCIONES DE PAGO Y MODALES =====
function pagarProducto(productoId) {
    const producto = PRODUCTOS_DATA.find(p => p.id === productoId);
    const cantidadInput = document.getElementById(`cantidad-${productoId}`);
    
    if (!producto) {
        mostrarNotificacion('Producto no encontrado');
        return;
    }
    
    const cantidad = parseInt(cantidadInput?.value) || 1;
    const precioTotal = producto.precio * cantidad;
    
    // Guardar datos del producto para la factura
    window.productoActual = producto;
    window.cantidadActual = cantidad;
    window.esCompraCarrito = false; // Flag to indicate single product purchase
    
    mostrarModalPagoProducto(producto, cantidad, precioTotal);
}

function mostrarModalPagoProducto(producto, cantidad, precioTotal) {
    const modal = document.getElementById('modalPago');
    const contenido = document.getElementById('modalPagoContenido');
    
    if (!modal || !contenido) {
        console.error('No se encontraron los elementos del modal de pago');
        return;
    }
    
    contenido.innerHTML = `
        <div class="modal-pago">
            <div class="modal-pago-header">
                <h3>Proceso de Compra - AUTO-EJEMPLO</h3>
                <button onclick="cerrarModalPago()" class="cerrar-modal">&times;</button>
            </div>
            <div class="modal-pago-content">
                <!-- Resumen del producto -->
                <div class="producto-resumen">
                    <div class="producto-resumen-info">
                        <h4>Resumen del Producto</h4>
                        <div class="producto-resumen-item">
                            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-resumen-imagen" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23f1f5f9%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b7280%22>${producto.nombre}</text></svg>'">
                            <div class="producto-resumen-detalle">
                                <span class="producto-resumen-nombre">${producto.nombre}</span>
                                <span class="producto-resumen-cantidad">x${cantidad}</span>
                                <span class="producto-resumen-precio">$${precioTotal.toLocaleString('es-AR')}</span>
                            </div>
                        </div>
                        <p class="precio-final">Total: <span id="precioTotalModalProducto">$${precioTotal.toLocaleString('es-AR')}</span></p>
                    </div>
                </div>
                
                <!-- Formulario de facturación -->
                <form id="formularioFacturacionProducto" class="formulario-facturacion">
                    <!-- Tipo de Factura -->
                    <div class="seccion-factura">
                        <h4>Tipo de Factura</h4>
                        <div class="opciones-factura">
                            <label class="opcion-factura">
                                <input type="radio" name="tipoFacturaProducto" value="A" required>
                                <span class="checkmark"></span>
                                Factura A
                            </label>
                            <label class="opcion-factura">
                                <input type="radio" name="tipoFacturaProducto" value="B" required>
                                <span class="checkmark"></span>
                                Factura B
                            </label>
                            <label class="opcion-factura">
                                <input type="radio" name="tipoFacturaProducto" value="C" required>
                                <span class="checkmark"></span>
                                Factura C
                            </label>
                        </div>
                    </div>
                    
                    <!-- Datos del Cliente -->
                    <div class="seccion-datos">
                        <h4>Datos del Cliente</h4>
                        <div class="campos-factura">
                            <div class="campo-grupo">
                                <label for="nombreClienteProducto">Nombre / Razón Social:</label>
                                <input type="text" id="nombreClienteProducto" name="nombreCliente" required>
                            </div>
                            <div class="campo-grupo">
                                <label for="cuitClienteProducto">CUIT / CUIL / DNI:</label>
                                <input type="text" id="cuitClienteProducto" name="cuitCliente" required>
                            </div>
                            <div class="campo-grupo">
                                <label for="emailClienteProducto">Email:</label>
                                <input type="email" id="emailClienteProducto" name="emailCliente" required>
                            </div>
                            <div class="campo-grupo">
                                <label for="telefonoClienteProducto">Teléfono:</label>
                                <input type="tel" id="telefonoClienteProducto" name="telefonoCliente" required>
                            </div>
                            <div class="campo-grupo">
                                <label for="direccionClienteProducto">Dirección:</label>
                                <input type="text" id="direccionClienteProducto" name="direccionCliente" required>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Método de Pago -->
                    <div class="seccion-pago">
                        <h4>Método de Pago</h4>
                        <div class="opciones-pago-detalladas">
                            <label class="opcion-pago-detallada">
                                <input type="radio" name="metodoPagoProducto" value="credito" required>
                                <span class="checkmark-pago"></span>
                                Tarjeta de Crédito
                            </label>
                            <label class="opcion-pago-detallada">
                                <input type="radio" name="metodoPagoProducto" value="debito" required>
                                <span class="checkmark-pago"></span>
                                Tarjeta de Débito
                            </label>
                            <label class="opcion-pago-detallada">
                                <input type="radio" name="metodoPagoProducto" value="transferencia" required>
                                <span class="checkmark-pago"></span>
                                Transferencia
                            </label>
                            <label class="opcion-pago-detallada">
                                <input type="radio" name="metodoPagoProducto" value="efectivo" required>
                                <span class="checkmark-pago"></span>
                                Efectivo
                            </label>
                        </div>
                        
                        <!-- Preview de tarjeta -->
                        <div class="tarjeta-preview" id="previewTarjetaProducto" style="display: none;">
                            <div class="tarjeta-front">
                                <div class="tarjeta-chip"></div>
                                <div class="tarjeta-numero" id="prev-numero-Producto">•••• •••• •••• ••••</div>
                                <div class="tarjeta-row">
                                    <div>
                                        <div class="tarjeta-label">Titular</div>
                                        <div id="prev-titular-Producto">TU NOMBRE</div>
                                    </div>
                                    <div>
                                        <div class="tarjeta-label">Vence</div>
                                        <div id="prev-venc-Producto">MM/AA</div>
                                    </div>
                                </div>
                            </div>
                            <div class="tarjeta-back">
                                <div class="tarjeta-strip"></div>
                                <div class="tarjeta-row" style="justify-content: flex-end;">
                                    <div>
                                        <div class="tarjeta-label" style="color:#e2e8f0;">CVV</div>
                                        <div class="tarjeta-cvv" id="prev-cvv-Producto">•••</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Campos de tarjeta (condicionales) -->
                        <div id="camposTarjetaProducto" class="campos-tarjeta" style="display: none;">
                            <div class="campos-tarjeta-fila">
                                <div class="campo-grupo">
                                    <label for="numeroTarjetaProducto">Número de Tarjeta:</label>
                                    <input type="text" id="numeroTarjetaProducto" name="numeroTarjeta" maxlength="16">
                                </div>
                                <div class="campo-grupo">
                                    <label for="vencimientoTarjetaProducto">Vencimiento (MM/AA):</label>
                                    <input type="text" id="vencimientoTarjetaProducto" name="vencimientoTarjeta" placeholder="MM/AA">
                                </div>
                            </div>
                            <div class="campos-tarjeta-fila">
                                <div class="campo-grupo">
                                    <label for="cvvTarjetaProducto">CVV:</label>
                                    <input type="text" id="cvvTarjetaProducto" name="cvvTarjeta" maxlength="4">
                                </div>
                                <div class="campo-grupo">
                                    <label for="titularTarjetaProducto">Titular:</label>
                                    <input type="text" id="titularTarjetaProducto" name="titularTarjeta">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Opción de Entrega -->
                    <div class="seccion-entrega">
                        <h4>Opción de Entrega</h4>
                        <div class="opciones-entrega">
                            <label class="opcion-entrega">
                                <input type="radio" name="tipoEntrega" value="domicilio" required>
                                <span class="checkmark-entrega"></span>
                                Envío a Domicilio (Solo gratis en Ciudad Ejemplo. Interior y otras ciudades a cargo del cliente)
                            </label>
                            <label class="opcion-entrega">
                                <input type="radio" name="tipoEntrega" value="sucursal" required>
                                <span class="checkmark-entrega"></span>
                                Retiro en Sucursal
                            </label>
                        </div>
                    </div>
                    
                    <!-- Entrega de Factura -->
                    <div class="seccion-factura-entrega">
                        <h4>Entrega de Factura</h4>
                        <div class="opciones-factura-entrega">
                            <label class="opcion-factura-entrega">
                                <input type="checkbox" name="entregaFactura" value="descargar">
                                <span class="checkmark-factura"></span>
                                Descargar Factura
                            </label>
                            <label class="opcion-factura-entrega">
                                <input type="checkbox" name="entregaFactura" value="email">
                                <span class="checkmark-factura"></span>
                                Enviar por Email
                            </label>
                            <label class="opcion-factura-entrega">
                                <input type="checkbox" name="entregaFactura" value="whatsapp">
                                <span class="checkmark-factura"></span>
                                Enviar por WhatsApp
                            </label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-pago-footer">
                <button onclick="cerrarModalPago()" class="btn-cancelar">Cancelar</button>
                <button onclick="procesarCompra()" class="btn-confirmar">Confirmar Compra</button>
            </div>
        </div>
    `;
    
    // Event listener para mostrar/ocultar campos de tarjeta
    setTimeout(() => {
        document.querySelectorAll('input[name="metodoPagoProducto"]').forEach(radio => {
            radio.addEventListener('change', function() {
                manejarCamposTarjeta(this.value, 'Producto');
            });
        });
        ['numeroTarjetaProducto','vencimientoTarjetaProducto','cvvTarjetaProducto','titularTarjetaProducto'].forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.addEventListener('input', () => actualizarPreviewTarjeta('Producto'));
            }
        });
    }, 100);
    
    modal.style.display = 'flex';
}

function cerrarModalPago() {
    const modal = document.getElementById('modalPago');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Notificación NO intrusiva (según preferencia de Carla)
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-sutil';
    
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    const colores = {
        success: '#10B981',
        error: '#EF4444',
        info: '#7C3AED',
        warning: '#F59E0B'
    };
    
    notificacion.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: white;
        color: #1F2937;
        padding: 14px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        border-left: 4px solid ${colores[tipo]};
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        max-width: 350px;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    notificacion.innerHTML = `
        <i class="fas ${iconos[tipo]}" style="color: ${colores[tipo]}; font-size: 18px;"></i>
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    // Aparecer suavemente
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
        notificacion.style.opacity = '1';
    }, 10);
    
    // Desaparecer automáticamente después de 2.5 segundos
    setTimeout(() => {
        notificacion.style.transform = 'translateX(400px)';
        notificacion.style.opacity = '0';
        setTimeout(() => notificacion.remove(), 300);
    }, 2500);
}

// ===== FUNCIONES DE PRODUCTOS =====
function renderizarProductos(productos = PRODUCTOS_DATA) {
    console.log('🔍 Buscando elemento productosGrid...');
    const productosGrid = document.getElementById('productosGrid');
    if (!productosGrid) {
        console.error('No se encontró el elemento productosGrid');
        console.log('Elementos disponibles con productos:', document.querySelectorAll('[id*="productos"]'));
        return;
    }
    
    // Sincronizar productos con el panel de administración antes de renderizar
    sincronizarProductosConAdmin();
    
    // Usar productosFiltrados que puede contener productos actualizados del admin
    const productosARenderizar = productos === PRODUCTOS_DATA ? productosFiltrados : productos;
    
    console.log('Elemento productosGrid encontrado, renderizando', productosARenderizar.length, 'productos');
    productosGrid.innerHTML = '';

    productosARenderizar.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'producto-card';
        productoCard.style.animation = 'fadeInUp 0.6s ease-out';
        
        // Generar stock si no existe
        const stock = producto.stock || Math.floor(Math.random() * 101);
        const stockClass = stock === 0 ? 'sin-stock' : stock <= 10 ? 'bajo-stock' : stock <= 30 ? 'medio-stock' : 'alto-stock';
        const stockText = stock === 0 ? 'Sin stock' : stock <= 10 ? `Solo ${stock} disponibles` : stock <= 30 ? `${stock} disponibles` : `${stock} disponibles`;
        
        productoCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <div class="producto-info">
                <span class="producto-categoria">${getCategoriaDisplayName(producto.categoria)}</span>
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <div class="producto-stock ${stockClass}">
                    <i class="fas fa-box"></i>
                    <span class="stock-text">${stockText}</span>
                    <span class="stock-indicator"></span>
                </div>
                <div class="producto-precio">$${producto.precio.toLocaleString('es-AR')}</div>
                <p class="producto-descripcion">${producto.descripcion}</p>
                
                <div class="producto-controles">
                    <div class="cantidad-control">
                        <label for="cantidad-${producto.id}">Cantidad:</label>
                        <div class="cantidad-input">
                            <button type="button" class="cantidad-btn" onclick="cambiarCantidadProducto(${producto.id}, -1)">-</button>
                            <input type="number" id="cantidad-${producto.id}" value="1" min="1" max="${producto.stock}" onchange="calcularPrecio(${producto.id})" class="cantidad-numero">
                            <button type="button" class="cantidad-btn" onclick="cambiarCantidadProducto(${producto.id}, 1)">+</button>
                        </div>
                    </div>
                    <div class="precio-total">
                        <span>Total: $<span id="precio-total-${producto.id}">${producto.precio.toLocaleString('es-AR')}</span></span>
                    </div>
                </div>
                
                <div class="producto-botones">
                    <button class="producto-btn agregar-btn" onclick="agregarAlCarrito(${producto.id})">
                        <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                    </button>
                    <button class="producto-btn pagar-btn" onclick="pagarProducto(${producto.id})">
                        <i class="fas fa-credit-card"></i> Pagar Ahora
                    </button>
                </div>
            </div>
        `;
        
        productosGrid.appendChild(productoCard);
    });
}

function getCategoriaDisplayName(categoria) {
    const categorias = {
        'limpiadores': 'Limpiadores',
        'shampoo': 'Shampoo',
        'ceras': 'Ceras Líquidas',
        'revividores': 'Revividores',
        'iluminacion': 'Iluminación'
    };
    return categorias[categoria] || categoria;
}

function filtrarProductos(categoria) {
    const filtros = document.querySelectorAll('.filtro-btn');
    filtros.forEach(btn => btn.classList.remove('active'));
    
    const botonActivo = document.querySelector(`[data-categoria="${categoria}"]`);
    if (botonActivo) {
        botonActivo.classList.add('active');
    }
    
    let productosFiltrados;
    if (categoria === 'todos') {
        productosFiltrados = PRODUCTOS_DATA;
    } else {
        productosFiltrados = PRODUCTOS_DATA.filter(producto => producto.categoria === categoria);
    }
    
    // Aplicar búsqueda actual si existe
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase().trim();
    if (searchTerm && searchTerm !== '') {
        productosFiltrados = productosFiltrados.filter(producto => 
            producto.nombre.toLowerCase().includes(searchTerm) ||
            producto.descripcion.toLowerCase().includes(searchTerm) ||
            producto.categoria.toLowerCase().includes(searchTerm) ||
            producto.marca.toLowerCase().includes(searchTerm)
        );
    }
    
    renderizarProductos(productosFiltrados);
}

function consultarProducto(productoId) {
    const producto = PRODUCTOS_DATA.find(p => p.id === productoId);
    if (producto) {
        const mensaje = `Hola! Me interesa el producto ${producto.nombre} ($${producto.precio.toLocaleString('es-AR')}). ¿Tienen stock disponible?`;
        addMessage(mensaje, 'user');
        
        setTimeout(() => {
            const respuesta = `¡Hola! Sí, tenemos ${producto.nombre} disponible. El precio es $${producto.precio.toLocaleString('es-AR')}. ¿Te gustaría que te reserve una unidad? Puedes contactarnos al +5491123456789 o visitarnos en Av. Principal 123, Ciudad Ejemplo.`;
            addMessage(respuesta, 'bot');
        }, 1000);
        
        toggleChatbot();
    }
}

// ===== FUNCIONES DE CANTIDAD Y PRECIO =====
function cambiarCantidadProducto(productoId, cambio) {
    const input = document.getElementById(`cantidad-${productoId}`);
    const producto = PRODUCTOS_DATA.find(p => p.id === productoId);
    
    if (producto && input) {
        let nuevaCantidad = parseInt(input.value) + cambio;
        nuevaCantidad = Math.max(1, Math.min(nuevaCantidad, producto.stock));
        input.value = nuevaCantidad;
        calcularPrecio(productoId);
    }
}

function calcularPrecio(productoId) {
    const input = document.getElementById(`cantidad-${productoId}`);
    const precioTotalSpan = document.getElementById(`precio-total-${productoId}`);
    const producto = PRODUCTOS_DATA.find(p => p.id === productoId);
    
    if (producto && input && precioTotalSpan) {
        const cantidad = parseInt(input.value) || 1;
        const precioTotal = producto.precio * cantidad;
        precioTotalSpan.textContent = precioTotal.toLocaleString('es-AR');
    }
}

async function agregarAlCarrito(productoId) {
    const input = document.getElementById(`cantidad-${productoId}`);
    const producto = PRODUCTOS_DATA.find(p => p.id === productoId);
    
    if (!producto) return;
    
    const cantidad = parseInt(input?.value) || 1;
    
    // Si existe el sistema de carrito por tienda, usarlo
    if (window.carritoPorTienda) {
        const resultado = await window.carritoPorTienda.agregarProducto(producto, cantidad);
        if (resultado) {
            // Actualizar carrito global para compatibilidad
            carrito = window.carritoPorTienda.obtenerCarritoActual();
            actualizarCarrito();
            
            // Actualizar badge del carrito
            if (typeof actualizarBadgeDespuesDeAgregar === 'function') {
                actualizarBadgeDespuesDeAgregar();
            }
            
            // Actualizar carrito flotante
            if (typeof actualizarCarritoFlotante === 'function') {
                actualizarCarritoFlotante();
            }
        }
        return;
    }
    
    // Sistema de carrito tradicional (compatibilidad)
    if (input) {
        // Verificar si el producto ya está en el carrito
        const itemExistente = carrito.find(item => item.id === productoId);
        
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: cantidad,
                imagen: producto.imagen
            });
        }
        
        actualizarCarrito();
        
        // Actualizar badge del carrito
        if (typeof actualizarBadgeDespuesDeAgregar === 'function') {
            actualizarBadgeDespuesDeAgregar();
        }
        
        // Mostrar notificación mejorada
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(`${producto.nombre} agregado al carrito (${cantidad} unidad${cantidad > 1 ? 'es' : ''})`, 'success');
        } else {
            mostrarNotificacion(`${producto.nombre} agregado al carrito 💜`, 'success');
        }
        
        // Actualizar carrito flotante
        if (typeof actualizarCarritoFlotante === 'function') {
            actualizarCarritoFlotante();
        }
    }
}

// ===== FUNCIONES DEL CARRITO =====
function actualizarCarrito() {
    // Si existe el sistema de carrito por tienda, usarlo
    if (window.carritoPorTienda) {
        const totalItems = window.carritoPorTienda.contarItems();
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
        // Sincronizar carrito global para compatibilidad
        carrito = window.carritoPorTienda.obtenerCarritoActual();
        return;
    }
    
    // Sistema tradicional
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        cartCount.textContent = totalItems;
    }
    
    renderizarCarrito();
    
    // Actualizar carrito flotante si existe la función
    if (typeof actualizarCarritoFlotante === 'function') {
        actualizarCarritoFlotante();
    }
}

function renderizarCarrito() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartEmptyMessage = document.getElementById('cartEmptyMessage');
    const cartBtnLimpiar = document.getElementById('cartBtnLimpiar');
    const cartBtnFinalizar = document.getElementById('cartBtnFinalizar');
    
    if (!cartItems || !cartTotal) {
        console.error('No se encontraron los elementos del carrito');
        return;
    }
    
    if (carrito.length === 0) {
        // Mostrar mensaje de carrito vacío
        if (cartEmptyMessage) cartEmptyMessage.style.display = 'block';
        if (cartBtnLimpiar) cartBtnLimpiar.style.display = 'none';
        if (cartBtnFinalizar) cartBtnFinalizar.style.display = 'none';
        cartTotal.textContent = '$0';
        if (cartSubtotal) cartSubtotal.textContent = '$0';
        return;
    }
    
    // Ocultar mensaje de carrito vacío y mostrar botones
    if (cartEmptyMessage) cartEmptyMessage.style.display = 'none';
    if (cartBtnLimpiar) cartBtnLimpiar.style.display = 'flex';
    if (cartBtnFinalizar) cartBtnFinalizar.style.display = 'flex';
    
    cartItems.innerHTML = carrito.map(item => `
        <div class="cart-item">
            <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23f1f5f9%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b7280%22>${item.nombre}</text></svg>'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.nombre}</div>
                <div class="cart-item-price">$${(item.precio * item.cantidad).toLocaleString('es-AR')}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="cambiarCantidadCarrito(${item.id}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button class="quantity-btn" onclick="cambiarCantidadCarrito(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removerDelCarrito(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    cartTotal.textContent = `$${total.toLocaleString('es-AR')}`;
    
    // Actualizar subtotal si existe
    if (cartSubtotal) {
        cartSubtotal.textContent = `$${total.toLocaleString('es-AR')}`;
    }
}

function cambiarCantidadCarrito(productoId, cambio) {
    const item = carrito.find(item => item.id === productoId);
    if (!item) return;
    
    item.cantidad += cambio;
    
    if (item.cantidad <= 0) {
        removerDelCarrito(productoId);
    } else {
        actualizarCarrito();
    }
}

function removerDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    actualizarCarrito();
}

function toggleCart() {
    // Asegurar disponibilidad global
    if (typeof window !== 'undefined' && !window.toggleCart) {
        window.toggleCart = toggleCart;
    }
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.toggle('active');
        // Si se está abriendo, actualizar el contenido
        if (cartModal.classList.contains('active')) {
            actualizarCarrito();
        }
    }
}

// ===== FUNCIÓN CHECKOUT PARA CARRITO =====
function checkout() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío');
        return;
    }
    
    // Guardar datos del carrito para la factura
    window.carritoActual = carrito;
    window.esCompraCarrito = true; // Flag to indicate cart purchase
    
    mostrarModalPagoCarrito();
}

function mostrarModalPagoCarrito() {
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    const modal = document.getElementById('modalPago');
    const contenido = document.getElementById('modalPagoContenido');
    
    if (!modal || !contenido) {
        console.error('No se encontraron los elementos del modal de pago');
        return;
    }
    
    contenido.innerHTML = `
        <div class="modal-pago">
            <div class="modal-pago-header">
                <h3>Proceso de Compra - AUTO-EJEMPLO</h3>
                <button onclick="cerrarModalPago()" class="cerrar-modal">&times;</button>
            </div>
            <div class="modal-pago-content">
                <!-- Resumen del carrito -->
                <div class="producto-resumen">
                    <div class="producto-resumen-info">
                        <h4>Resumen del Carrito</h4>
                        <div class="carrito-resumen-items">
                            ${carrito.map(item => `
                                <div class="carrito-resumen-item">
                                    <img src="${item.imagen}" alt="${item.nombre}" class="carrito-resumen-imagen" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23f1f5f9%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b7280%22>${item.nombre}</text></svg>'">
                                    <div class="carrito-resumen-detalle">
                                        <span class="carrito-resumen-nombre">${item.nombre}</span>
                                        <span class="carrito-resumen-cantidad">x${item.cantidad}</span>
                                        <span class="carrito-resumen-precio">$${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <p class="precio-final">Total: <span id="precioTotalModal">$${total.toLocaleString('es-AR')}</span></p>
                    </div>
                </div>
                
                <!-- Formulario de facturación -->
                <form id="formularioFacturacion" class="formulario-facturacion">
                    <!-- Tipo de Factura -->
                    <div class="seccion-factura">
                        <h4>Tipo de Factura</h4>
                        <div class="opciones-factura">
                            <label class="opcion-factura">
                                <input type="radio" name="tipoFactura" value="A" required>
                                <span class="checkmark"></span>
                                Factura A
                            </label>
                            <label class="opcion-factura">
                                <input type="radio" name="tipoFactura" value="B" required>
                                <span class="checkmark"></span>
                                Factura B
                            </label>
                            <label class="opcion-factura">
                                <input type="radio" name="tipoFactura" value="C" required>
                                <span class="checkmark"></span>
                                Factura C
                            </label>
                        </div>
                    </div>
                    
                    <!-- Datos del Cliente -->
                    <div class="seccion-datos">
                        <h4>Datos del Cliente</h4>
                        <div class="campos-factura">
                            <div class="campo-grupo">
                                <label for="nombreClienteCarrito">Nombre / Razón Social:</label>
                                <input type="text" id="nombreClienteCarrito" name="nombreCliente" required>
                            </div>
                            <div class="campo-grupo">
                                <label for="cuitClienteCarrito">CUIT / CUIL / DNI:</label>
                                <input type="text" id="cuitClienteCarrito" name="cuitCliente" required>
                            </div>
                            <div class="campo-grupo">
                                <label for="emailClienteCarrito">Email:</label>
                                <input type="email" id="emailClienteCarrito" name="emailCliente" required>
                            </div>
                            <div class="campo-grupo">
                                <label for="telefonoClienteCarrito">Teléfono:</label>
                                <input type="tel" id="telefonoClienteCarrito" name="telefonoCliente" required>
                            </div>
                            <div class="campo-grupo">
                                <label for="direccionClienteCarrito">Dirección:</label>
                                <input type="text" id="direccionClienteCarrito" name="direccionCliente" required>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Método de Pago -->
                    <div class="seccion-pago">
                        <h4>Método de Pago</h4>
                        <div class="opciones-pago-detalladas">
                            <label class="opcion-pago-detallada">
                                <input type="radio" name="metodoPago" value="credito" required>
                                <span class="checkmark-pago"></span>
                                Tarjeta de Crédito
                            </label>
                            <label class="opcion-pago-detallada">
                                <input type="radio" name="metodoPago" value="debito" required>
                                <span class="checkmark-pago"></span>
                                Tarjeta de Débito
                            </label>
                            <label class="opcion-pago-detallada">
                                <input type="radio" name="metodoPago" value="transferencia" required>
                                <span class="checkmark-pago"></span>
                                Transferencia
                            </label>
                            <label class="opcion-pago-detallada">
                                <input type="radio" name="metodoPago" value="efectivo" required>
                                <span class="checkmark-pago"></span>
                                Efectivo
                            </label>
                        </div>
                        
                        <!-- Preview de tarjeta -->
                        <div class="tarjeta-preview" id="previewTarjetaCarrito" style="display: none;">
                            <div class="tarjeta-front">
                                <div class="tarjeta-chip"></div>
                                <div class="tarjeta-numero" id="prev-numero-Carrito">•••• •••• •••• ••••</div>
                                <div class="tarjeta-row">
                                    <div>
                                        <div class="tarjeta-label">Titular</div>
                                        <div id="prev-titular-Carrito">TU NOMBRE</div>
                                    </div>
                                    <div>
                                        <div class="tarjeta-label">Vence</div>
                                        <div id="prev-venc-Carrito">MM/AA</div>
                                    </div>
                                </div>
                            </div>
                            <div class="tarjeta-back">
                                <div class="tarjeta-strip"></div>
                                <div class="tarjeta-row" style="justify-content: flex-end;">
                                    <div>
                                        <div class="tarjeta-label" style="color:#e2e8f0;">CVV</div>
                                        <div class="tarjeta-cvv" id="prev-cvv-Carrito">•••</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Campos de tarjeta (condicionales) -->
                        <div id="camposTarjetaCarrito" class="campos-tarjeta" style="display: none;">
                            <div class="campos-tarjeta-fila">
                                <div class="campo-grupo">
                                    <label for="numeroTarjetaCarrito">Número de Tarjeta:</label>
                                    <input type="text" id="numeroTarjetaCarrito" name="numeroTarjeta" maxlength="16">
                                </div>
                                <div class="campo-grupo">
                                    <label for="vencimientoTarjetaCarrito">Vencimiento (MM/AA):</label>
                                    <input type="text" id="vencimientoTarjetaCarrito" name="vencimientoTarjeta" placeholder="MM/AA">
                                </div>
                            </div>
                            <div class="campos-tarjeta-fila">
                                <div class="campo-grupo">
                                    <label for="cvvTarjetaCarrito">CVV:</label>
                                    <input type="text" id="cvvTarjetaCarrito" name="cvvTarjeta" maxlength="4">
                                </div>
                                <div class="campo-grupo">
                                    <label for="titularTarjetaCarrito">Titular:</label>
                                    <input type="text" id="titularTarjetaCarrito" name="titularTarjeta">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Opción de Entrega -->
                    <div class="seccion-entrega">
                        <h4>Opción de Entrega</h4>
                        <div class="opciones-entrega">
                            <label class="opcion-entrega">
                                <input type="radio" name="opcionEntrega" value="domicilio" required>
                                <span class="checkmark-entrega"></span>
                                Envío a Domicilio (Solo gratis en Ciudad Ejemplo. Interior y otras ciudades a cargo del cliente)
                            </label>
                            <label class="opcion-entrega">
                                <input type="radio" name="opcionEntrega" value="sucursal" required>
                                <span class="checkmark-entrega"></span>
                                Retiro en Sucursal
                            </label>
                        </div>
                    </div>
                    
                    <!-- Entrega de Factura -->
                    <div class="seccion-factura-entrega">
                        <h4>Entrega de Factura</h4>
                        <div class="opciones-factura-entrega">
                            <label class="opcion-factura-entrega">
                                <input type="checkbox" name="entregaFactura" value="descargar">
                                <span class="checkmark-factura"></span>
                                Descargar Factura
                            </label>
                            <label class="opcion-factura-entrega">
                                <input type="checkbox" name="entregaFactura" value="email">
                                <span class="checkmark-factura"></span>
                                Enviar por Email
                            </label>
                            <label class="opcion-factura-entrega">
                                <input type="checkbox" name="entregaFactura" value="whatsapp">
                                <span class="checkmark-factura"></span>
                                Enviar por WhatsApp
                            </label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-pago-footer">
                <button onclick="cerrarModalPago()" class="btn-cancelar">Cancelar</button>
                <button onclick="procesarCompra()" class="btn-confirmar">Confirmar Compra</button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    
    // Event listener para mostrar/ocultar campos de tarjeta
    setTimeout(() => {
        document.querySelectorAll('input[name="metodoPago"]').forEach(radio => {
            radio.addEventListener('change', function() {
                manejarCamposTarjeta(this.value, 'Carrito');
            });
        });
        ['numeroTarjetaCarrito','vencimientoTarjetaCarrito','cvvTarjetaCarrito','titularTarjetaCarrito'].forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.addEventListener('input', () => actualizarPreviewTarjeta('Carrito'));
            }
        });
    }, 100);
    
    // Agregar campo de cupón después de crear el formulario
    setTimeout(() => {
        if (typeof SistemaCupones !== 'undefined' && SistemaCupones.mostrarCampoCupon) {
            SistemaCupones.mostrarCampoCupon('campo-cupon-checkout');
        }
    }, 200);
}

function mostrarModalPagoCarrito() {
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    const modal = document.getElementById('modalPago');
    const contenido = document.getElementById('modalPagoContenido');
    
    if (!modal || !contenido) {
        console.error('No se encontraron los elementos del modal de pago');
        return;
    }
    
    contenido.innerHTML = `
        <div class="modal-pago">
            <div class="modal-pago-header">
                <h3>Proceso de Compra - AUTO-EJEMPLO</h3>
                <button onclick="cerrarModalPago()" class="cerrar-modal">&times;</button>
            </div>
            <div class="modal-pago-content">
                <!-- Resumen del carrito -->
                <div class="producto-resumen">
                    <div class="producto-resumen-info">
                        <h4>Resumen del Carrito</h4>
                        <div class="carrito-resumen-items">
                            ${carrito.map(item => `
                                <div class="carrito-resumen-item">
                                    <img src="${item.imagen}" alt="${item.nombre}" class="carrito-resumen-imagen" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23f1f5f9%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b7280%22>${item.nombre}</text></svg>'">
                                    <div class="carrito-resumen-detalle">
                                        <span class="carrito-resumen-nombre">${item.nombre}</span>
                                        <span class="carrito-resumen-cantidad">x${item.cantidad}</span>
                                        <span class="carrito-resumen-precio">$${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <p class="precio-final">Total: <span id="precioTotalModal">$${total.toLocaleString('es-AR')}</span></p>
                    </div>
                </div>
                
                <!-- Formulario de facturación -->
                <form id="formularioFacturacion" class="formulario-facturacion">
                    <!-- Tipo de Factura -->
                    <div class="seccion-factura">
                        <h4>Tipo de Factura</h4>
                        <div class="opciones-factura">
                            <label class="opcion-factura">
                                <input type="radio" name="tipoFactura" value="A" required>
                                <span class="checkmark"></span>
                                Factura A
                            </label>
                            <label class="opcion-factura">
                                <input type="radio" name="tipoFactura" value="B" required>
                                <span class="checkmark"></span>
                                Factura B
                            </label>
                            <label class="opcion-factura">
                                <input type="radio" name="tipoFactura" value="C" required>
                                <span class="checkmark"></span>
                                Factura C
                            </label>
                        </div>
                    </div>
                    
                    <!-- Datos del Cliente -->
                    <div class="seccion-datos">
                        <h4>Datos del Cliente</h4>
                        <div class="campos-factura">
                            <div class="campo-grupo">
                                <label for="nombreClienteCarrito">Nombre / Razón Social:</label>
                                <input type="text" id="nombreClienteCarrito" name="nombreCliente" required>
                            </div>
                            <div class="campo-grupo">
                                <label for="cuitClienteCarrito">CUIT / CUIL / DNI:</label>
                                <input type="text" id="cuitClienteCarrito" name="cuitCliente" required>
                            </div>
                            <div class="campo-grupo">
                                <label for="emailClienteCarrito">Email:</label>
                                <input type="email" id="emailClienteCarrito" name="emailCliente" required>
                            </div>
                            <div class="campo-grupo">
                                <label for="telefonoClienteCarrito">Teléfono:</label>
                                <input type="tel" id="telefonoClienteCarrito" name="telefonoCliente" required>
                            </div>
                            <div class="campo-grupo">
                                <label for="direccionClienteCarrito">Dirección:</label>
                                <input type="text" id="direccionClienteCarrito" name="direccionCliente" required>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Método de Pago -->
                    <div class="seccion-pago">
                        <h4>Método de Pago</h4>
                        <div class="opciones-pago-detalladas">
                            <label class="opcion-pago-detallada">
                                <input type="radio" name="metodoPago" value="credito" required>
                                <span class="checkmark-pago"></span>
                                Tarjeta de Crédito
                            </label>
                            <label class="opcion-pago-detallada">
                                <input type="radio" name="metodoPago" value="debito" required>
                                <span class="checkmark-pago"></span>
                                Tarjeta de Débito
                            </label>
                            <label class="opcion-pago-detallada">
                                <input type="radio" name="metodoPago" value="transferencia" required>
                                <span class="checkmark-pago"></span>
                                Transferencia
                            </label>
                            <label class="opcion-pago-detallada">
                                <input type="radio" name="metodoPago" value="efectivo" required>
                                <span class="checkmark-pago"></span>
                                Efectivo
                            </label>
                        </div>
                        
                        <!-- Campos de tarjeta (condicionales) -->
                        <div id="camposTarjetaCarrito" class="campos-tarjeta" style="display: none;">
                            <div class="campos-tarjeta-fila">
                                <div class="campo-grupo">
                                    <label for="numeroTarjetaCarrito">Número de Tarjeta:</label>
                                    <input type="text" id="numeroTarjetaCarrito" name="numeroTarjeta" maxlength="16">
                                </div>
                                <div class="campo-grupo">
                                    <label for="vencimientoTarjetaCarrito">Vencimiento (MM/AA):</label>
                                    <input type="text" id="vencimientoTarjetaCarrito" name="vencimientoTarjeta" placeholder="MM/AA">
                                </div>
                            </div>
                            <div class="campos-tarjeta-fila">
                                <div class="campo-grupo">
                                    <label for="cvvTarjetaCarrito">CVV:</label>
                                    <input type="text" id="cvvTarjetaCarrito" name="cvvTarjeta" maxlength="4">
                                </div>
                                <div class="campo-grupo">
                                    <label for="titularTarjetaCarrito">Titular:</label>
                                    <input type="text" id="titularTarjetaCarrito" name="titularTarjeta">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Opción de Entrega -->
                    <div class="seccion-entrega">
                        <h4>Opción de Entrega</h4>
                        <div class="opciones-entrega">
                            <label class="opcion-entrega">
                                <input type="radio" name="opcionEntrega" value="domicilio" required>
                                <span class="checkmark-entrega"></span>
                                Envío a Domicilio (Solo gratis en Ciudad Ejemplo. Interior y otras ciudades a cargo del cliente)
                            </label>
                            <label class="opcion-entrega">
                                <input type="radio" name="opcionEntrega" value="sucursal" required>
                                <span class="checkmark-entrega"></span>
                                Retiro en Sucursal
                            </label>
                        </div>
                    </div>
                    
                    <!-- Entrega de Factura -->
                    <div class="seccion-factura-entrega">
                        <h4>Entrega de Factura</h4>
                        <div class="opciones-factura-entrega">
                            <label class="opcion-factura-entrega">
                                <input type="checkbox" name="entregaFactura" value="descargar">
                                <span class="checkmark-factura"></span>
                                Descargar Factura
                            </label>
                            <label class="opcion-factura-entrega">
                                <input type="checkbox" name="entregaFactura" value="email">
                                <span class="checkmark-factura"></span>
                                Enviar por Email
                            </label>
                            <label class="opcion-factura-entrega">
                                <input type="checkbox" name="entregaFactura" value="whatsapp">
                                <span class="checkmark-factura"></span>
                                Enviar por WhatsApp
                            </label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-pago-footer">
                <button onclick="cerrarModalPago()" class="btn-cancelar">Cancelar</button>
                <button onclick="procesarCompra()" class="btn-confirmar">Confirmar Compra</button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    
    // Event listener para mostrar/ocultar campos de tarjeta
    document.querySelectorAll('input[name="metodoPago"]').forEach(radio => {
        radio.addEventListener('change', function() {
            manejarCamposTarjeta(this.value, 'Carrito');
        });
    });
    
    // Agregar campo de cupón si SistemaCupones está disponible
    setTimeout(() => {
        if (typeof SistemaCupones !== 'undefined' && SistemaCupones.mostrarCampoCupon) {
            SistemaCupones.mostrarCampoCupon('formularioFacturacion');
        }
    }, 100);
}

function cerrarModalPago() {
    const modal = document.getElementById('modalPago');
    if (modal) {
        modal.style.display = 'none';
    }
}

function procesarCompra() {
    console.log('Iniciando procesamiento de compra...');
    
    // Determinar qué formulario usar
    const formProducto = document.getElementById('formularioFacturacionProducto');
    const formCarrito = document.getElementById('formularioFacturacion');
    
    let form;
    if (formProducto && formProducto.style.display !== 'none') {
        form = formProducto;
        console.log('Usando formulario de producto individual');
    } else if (formCarrito) {
        form = formCarrito;
        console.log('Usando formulario de carrito');
    } else {
        console.error('No se encontró ningún formulario válido');
        mostrarNotificacion('Error: No se encontró el formulario de pago');
        return;
    }
    
    // Crear FormData primero
    const formData = new FormData(form);
    
    // Verificar método de pago y ajustar campos de tarjeta
    const metodoPagoSeleccionado = formData.get('metodoPago') || formData.get('metodoPagoProducto');
    console.log('Método de pago seleccionado:', metodoPagoSeleccionado);
    
    // Determinar el tipo de formulario (Producto o Carrito)
    const esFormularioCarrito = form.querySelector('#camposTarjetaCarrito') !== null;
    const tipoFormulario = esFormularioCarrito ? 'Carrito' : 'Producto';
    
    // Ajustar campos de tarjeta según el método de pago
    if (metodoPagoSeleccionado) {
        manejarCamposTarjeta(metodoPagoSeleccionado, tipoFormulario);
    }
    
    // Validar formulario
    console.log('Validando formulario...');
    console.log('Formulario válido:', form.checkValidity());
    
    // Verificar campos requeridos individualmente
    const camposRequeridos = form.querySelectorAll('[required]');
    console.log('Campos requeridos encontrados:', camposRequeridos.length);
    camposRequeridos.forEach(campo => {
        console.log(`Campo ${campo.name}:`, campo.value, 'Válido:', campo.checkValidity());
    });
    
    if (!form.checkValidity()) {
        console.log('Formulario inválido, mostrando errores...');
        form.reportValidity();
        return;
    }
    // Manejar campos específicos según el tipo de formulario
    let tipoFactura, metodoPago;
    if (form === formProducto) {
        tipoFactura = formData.get('tipoFacturaProducto');
        metodoPago = formData.get('metodoPagoProducto');
    } else {
        tipoFactura = formData.get('tipoFactura');
        metodoPago = formData.get('metodoPago');
    }
    
    // Obtener cupón aplicado si existe
    const cuponAplicado = window.cuponAplicado || null;
    
    const datosCompra = {
        tipoFactura: tipoFactura,
        nombreCliente: formData.get('nombreCliente'),
        cuitCliente: formData.get('cuitCliente'),
        emailCliente: formData.get('emailCliente'),
        telefonoCliente: formData.get('telefonoCliente'),
        direccionCliente: formData.get('direccionCliente'),
        metodoPago: metodoPago,
        numeroTarjeta: formData.get('numeroTarjeta'),
        vencimientoTarjeta: formData.get('vencimientoTarjeta'),
        cvvTarjeta: formData.get('cvvTarjeta'),
        titularTarjeta: formData.get('titularTarjeta'),
        opcionEntrega: formData.get('opcionEntrega') || formData.get('tipoEntrega'), // Compatibilidad con ambos formularios
        entregaFactura: formData.getAll('entregaFactura'),
        esCompraCarrito: window.esCompraCarrito || false,
        carrito: window.carritoActual || [],
        producto: window.productoActual || null,
        cantidad: window.cantidadActual || 1,
        cupon: cuponAplicado ? {
            codigo: cuponAplicado.codigo,
            descuento: cuponAplicado.descuento,
            cupon_id: cuponAplicado.cupon?.id
        } : null
    };
    
    console.log('Datos de entrega encontrados:', {
        opcionEntrega: formData.get('opcionEntrega'),
        tipoEntrega: formData.get('tipoEntrega'),
        opcionEntregaFinal: datosCompra.opcionEntrega
    });
    
    console.log('Datos de compra obtenidos:', datosCompra);
    
    // Verificar datos mínimos
    console.log('Verificando datos mínimos:', {
        tipoFactura: datosCompra.tipoFactura,
        nombreCliente: datosCompra.nombreCliente,
        metodoPago: datosCompra.metodoPago,
        opcionEntrega: datosCompra.opcionEntrega
    });
    
    if (!datosCompra.tipoFactura || !datosCompra.nombreCliente || !datosCompra.metodoPago || !datosCompra.opcionEntrega) {
        console.error('Faltan datos requeridos en el formulario');
        mostrarNotificacion('Error: Por favor complete todos los campos requeridos');
        return;
    }
    
    // Generar factura
    console.log('Generando factura...');
    generarFactura(datosCompra);
    
    // Enviar factura según método de pago
    if (datosCompra.metodoPago === 'transferencia') {
        console.log('Enviando factura por transferencia...');
        enviarFacturaTransferencia(datosCompra);
    } else {
        console.log('Enviando factura al cliente...');
        enviarFacturaCliente(datosCompra);
    }
    
    // Descargar factura automáticamente si no hay opciones seleccionadas
    if (!datosCompra.entregaFactura || datosCompra.entregaFactura.length === 0) {
        console.log('Descargando factura automáticamente...');
        setTimeout(() => {
            descargarFactura(window.facturaActual.html);
        }, 1000);
    }
    
    // Guardar pedido en historial del usuario si está logueado
    if (currentUser) {
        console.log('Guardando pedido en historial del usuario...');
        
        let orderData;
        if (datosCompra.esCompraCarrito) {
            // Pedido del carrito
            orderData = {
                id: 'ORD-' + Date.now(),
                date: new Date().toISOString(),
                products: datosCompra.carrito.map(item => ({
                    id: item.id,
                    name: item.nombre,
                    price: item.precio,
                    quantity: item.cantidad,
                    image: item.imagen
                })),
                total: datosCompra.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0),
                status: 'completado',
                paymentMethod: datosCompra.metodoPago,
                deliveryMethod: datosCompra.opcionEntrega,
                invoiceNumber: window.facturaActual?.numero || 'N/A'
            };
        } else {
            // Pedido individual
            orderData = {
                id: 'ORD-' + Date.now(),
                date: new Date().toISOString(),
                products: [{
                    id: datosCompra.producto.id,
                    name: datosCompra.producto.nombre,
                    price: datosCompra.producto.precio,
                    quantity: datosCompra.cantidad,
                    image: datosCompra.producto.imagen
                }],
                total: datosCompra.producto.precio * datosCompra.cantidad,
                status: 'completado',
                paymentMethod: datosCompra.metodoPago,
                deliveryMethod: datosCompra.opcionEntrega,
                invoiceNumber: window.facturaActual?.numero || 'N/A'
            };
        }
        
        addOrderToUserHistory(orderData);
        console.log('✅ Pedido guardado en historial del usuario:', orderData);
        
        // Guardar en Supabase (historial_compras) - async
        guardarHistorialCompraSupabase(datosCompra, orderData).catch(err => {
            console.error('Error guardando en Supabase:', err);
        });
        
        // Verificar si es primera compra y enviar email - async
        if (window.sistemaEmailsCresalia) {
            verificarPrimeraCompra(datosCompra.emailCliente).then(esPrimeraCompra => {
                if (esPrimeraCompra) {
                    window.sistemaEmailsCresalia.procesarEvento('primera_compra', {
                        id: datosCompra.emailCliente,
                        email: datosCompra.emailCliente,
                        nombre: datosCompra.nombreCliente
                    }, {
                        producto: datosCompra.esCompraCarrito 
                            ? `${datosCompra.carrito.length} productos` 
                            : datosCompra.producto?.nombre || 'Producto',
                        monto: orderData.total
                    }).catch(err => {
                        console.error('Error enviando email:', err);
                    });
                }
            }).catch(err => {
                console.error('Error verificando primera compra:', err);
            });
        }
    }
    
    // Limpiar carrito si es compra del carrito
    if (datosCompra.esCompraCarrito) {
        console.log('Limpiando carrito...');
        carrito = [];
        actualizarCarrito();
        toggleCart();
    }
    
    cerrarModalPago();
    mostrarNotificacion('¡Compra procesada exitosamente! Factura generada.');
    console.log('Procesamiento de compra completado');
}

function generarFactura(datos) {
    const numeroFactura = generarNumeroFactura();
    const fecha = new Date().toLocaleDateString('es-AR');
    const hora = new Date().toLocaleTimeString('es-AR');
    
    // Determinar productos y total
    let productosHTML = '';
    let total = 0;
    
    if (datos.esCompraCarrito && datos.carrito) {
        // Compra del carrito
        productosHTML = datos.carrito.map(item => `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precio.toLocaleString('es-AR')}</td>
                <td>$${(item.precio * item.cantidad).toLocaleString('es-AR')}</td>
            </tr>
        `).join('');
        total = datos.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    } else if (datos.producto) {
        // Compra individual
        productosHTML = `
            <tr>
                <td>${datos.producto.nombre}</td>
                <td>${datos.cantidad}</td>
                <td>$${datos.producto.precio.toLocaleString('es-AR')}</td>
                <td>$${(datos.producto.precio * datos.cantidad).toLocaleString('es-AR')}</td>
            </tr>
        `;
        total = datos.producto.precio * datos.cantidad;
    }
    
    const facturaHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Factura ${datos.tipoFactura} - AUTO-EJEMPLO</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f9; }
                .factura { background: white; max-width: 800px; margin: 0 auto; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative; }
                .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 8rem; color: rgba(37, 99, 235, 0.1); font-weight: bold; pointer-events: none; z-index: 1; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; position: relative; z-index: 2; }
                .logo { max-width: 150px; margin-bottom: 10px; }
                .empresa-info { margin-bottom: 20px; }
                .cliente-info { margin-bottom: 30px; }
                .factura-detalle { margin-bottom: 30px; }
                .productos-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .productos-table th, .productos-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
                .productos-table th { background: #2563eb; color: white; font-weight: bold; }
                .total { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 20px; border-radius: 8px; text-align: right; font-size: 1.2em; font-weight: bold; position: relative; z-index: 2; }
                .footer { margin-top: 30px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; position: relative; z-index: 2; }
                .campo { margin-bottom: 10px; }
                .campo strong { color: #2563eb; }
                @media print { body { background: white; } .factura { box-shadow: none; } }
            </style>
        </head>
        <body>
            <div class="factura">
                <div class="watermark">AUTO-EJEMPLO</div>
                
                <div class="header">
                    <img src="assets/logo/logo-ejemplo.png" alt="AUTO-EJEMPLO" class="logo">
                    <h1>AUTO-EJEMPLO</h1>
                    <h2>Factura ${datos.tipoFactura}</h2>
                </div>
                
                <div class="empresa-info">
                    <div class="campo"><strong>Empresa:</strong> AUTO-EJEMPLO</div>
                    <div class="campo"><strong>Dirección:</strong> Av. Principal 123, Ciudad Ejemplo, Argentina</div>
                    <div class="campo"><strong>Teléfono:</strong> +5491123456789</div>
                    <div class="campo"><strong>Email:</strong> info@auto-ejemplo.com</div>
                    <div class="campo"><strong>Fecha:</strong> ${fecha} - ${hora}</div>
                    <div class="campo"><strong>N° Factura:</strong> ${numeroFactura}</div>
                </div>
                
                <div class="cliente-info">
                    <h3>Datos del Cliente</h3>
                    <div class="campo"><strong>Nombre/Razón Social:</strong> ${datos.nombreCliente}</div>
                    <div class="campo"><strong>CUIT/CUIL/DNI:</strong> ${datos.cuitCliente}</div>
                    <div class="campo"><strong>Email:</strong> ${datos.emailCliente}</div>
                    <div class="campo"><strong>Teléfono:</strong> ${datos.telefonoCliente}</div>
                    <div class="campo"><strong>Dirección:</strong> ${datos.direccionCliente}</div>
                </div>
                
                <div class="factura-detalle">
                    <h3>Detalle de Productos</h3>
                    <table class="productos-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productosHTML}
                        </tbody>
                    </table>
                </div>
                
                <div class="total">
                    <h3>Total: $${total.toLocaleString('es-AR')}</h3>
                    <p><strong>Método de Pago:</strong> ${obtenerNombreMetodoPago(datos.metodoPago)}</p>
                    <p><strong>Opción de Entrega:</strong> ${datos.opcionEntrega === 'domicilio' ? 'Envío a Domicilio' : 'Retiro en Sucursal'}</p>
                </div>
                
                <div class="footer">
                    <img src="assets/logo/logo-ejemplo.png" alt="AUTO-EJEMPLO" style="max-width: 100px;">
                    <p><strong>AUTO-EJEMPLO</strong> - Av. Principal 123, Ciudad Ejemplo, Argentina</p>
                    <p>Tel: +5491123456789 | Email: info@auto-ejemplo.com</p>
                    <p>Gracias por confiar en AUTO-EJEMPLO</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    // Guardar factura para uso posterior
    window.facturaActual = {
        html: facturaHTML,
        datos: datos,
        numero: numeroFactura
    };
}

function generarNumeroFactura() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FRI-${año}${mes}${dia}-${random}`;
}

function obtenerNombreMetodoPago(metodo) {
    const metodos = {
        'credito': 'Tarjeta de Crédito',
        'debito': 'Tarjeta de Débito',
        'transferencia': 'Transferencia',
        'efectivo': 'Efectivo'
    };
    return metodos[metodo] || metodo;
}

// ===== FUNCIÓN PARA DESCARGAR FACTURA =====
function descargarFactura(html) {
    try {
        console.log('Descargando factura...');
        
        // Crear una nueva ventana
        const ventana = window.open('', '_blank', 'width=800,height=1000,scrollbars=yes,resizable=yes');
        
        if (ventana) {
            // Escribir el contenido HTML en la nueva ventana
            ventana.document.write(html);
            ventana.document.close();
            
            // Esperar un momento para que se cargue el contenido
            setTimeout(() => {
                ventana.print();
                mostrarNotificacion('✅ Factura descargada correctamente');
            }, 500);
        } else {
            console.error('No se pudo abrir la ventana de impresión');
            mostrarNotificacion('❌ Error al descargar la factura');
        }
    } catch (error) {
        console.error('Error al descargar factura:', error);
        mostrarNotificacion('❌ Error al descargar la factura');
    }
}

// ===== FUNCIÓN PARA ENVIAR FACTURA POR EMAIL =====
function enviarFacturaEmail(email, factura) {
    // Simular envío de email
    mostrarNotificacion(`📧 Factura enviada por email a ${email}`);
}

// ===== FUNCIÓN PARA ENVIAR FACTURA POR WHATSAPP =====
function enviarFacturaWhatsApp(telefono, factura) {
    const mensaje = encodeURIComponent(`Hola! Tu factura ${factura.numero} está lista. Puedes descargarla desde el sistema.`);
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
}

// ===== FUNCIÓN PARA ENVIAR FACTURA AL CLIENTE =====
function enviarFacturaCliente(datos) {
    const factura = window.facturaActual;
    if (!factura) {
        console.error('No se encontró la factura actual');
        return;
    }
    
    console.log('Opciones de entrega de factura:', datos.entregaFactura);
    
    // Si no hay opciones seleccionadas, descargar por defecto
    if (!datos.entregaFactura || datos.entregaFactura.length === 0) {
        console.log('No hay opciones de entrega seleccionadas, descargando factura por defecto');
        descargarFactura(factura.html);
        return;
    }
    
    datos.entregaFactura.forEach(opcion => {
        console.log('Procesando opción de entrega:', opcion);
        switch (opcion) {
            case 'descargar':
                descargarFactura(factura.html);
                break;
            case 'email':
                enviarFacturaEmail(datos.emailCliente, factura);
                break;
            case 'whatsapp':
                enviarFacturaWhatsApp(datos.telefonoCliente, factura);
                break;
        }
    });
}

// ===== FUNCIÓN PARA ENVIAR FACTURA POR TRANSFERENCIA =====
function enviarFacturaTransferencia(datos) {
    const factura = window.facturaActual;
    if (!factura) return;
    
    // Enviar a WhatsApp de la empresa
    const mensajeEmpresa = `
        🏢 Cresalia - Nueva Compra por Transferencia
        
        Cliente: ${datos.nombreCliente}
        Total: $${datos.esCompraCarrito ? 
            datos.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0).toLocaleString('es-AR') :
            (datos.producto.precio * datos.cantidad).toLocaleString('es-AR')
        }
        
        N° Factura: ${factura.numero}
        
        Por favor, procesar la transferencia y confirmar al cliente.
    `;
    
    const mensajeCodificado = encodeURIComponent(mensajeEmpresa);
    window.open(`https://wa.me/${CONFIG_EMPRESA.whatsapp}?text=${mensajeCodificado}`, '_blank');
    
    // Procesar opciones de entrega del cliente
    datos.entregaFactura.forEach(opcion => {
        switch (opcion) {
            case 'descargar':
                descargarFactura(factura.html);
                break;
            case 'email':
                enviarFacturaEmail(datos.emailCliente, factura);
                break;
            case 'whatsapp':
                enviarFacturaWhatsApp(datos.telefonoCliente, factura);
                break;
        }
    });
}

// ===== FUNCIONES DE NAVEGACIÓN =====
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

function navbarScrollEffect() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(37, 99, 235, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'linear-gradient(135deg, var(--primary-blue) 0%, var(--violet) 100%)';
                navbar.style.backdropFilter = 'none';
            }
        }
    });
}

// ===== ANIMACIONES AL SCROLL =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    document.querySelectorAll('.servicio-card, .ayuda-card, .contacto-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Filtros de productos
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const categoria = this.getAttribute('data-categoria');
            filtrarProductos(categoria);
        });
    });
    
    // Búsqueda en tiempo real
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            buscarProductos();
        });
    }
}

// ===== FUNCIONES DE BÚSQUEDA =====
function buscarProductos() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        productosFiltrados = PRODUCTOS_DATA;
    } else {
        productosFiltrados = PRODUCTOS_DATA.filter(producto => 
            producto.nombre.toLowerCase().includes(searchTerm) ||
            producto.descripcion.toLowerCase().includes(searchTerm) ||
            producto.categoria.toLowerCase().includes(searchTerm) ||
            producto.marca.toLowerCase().includes(searchTerm)
        );
    }
    
    renderizarProductos(productosFiltrados);
}

// ===== FUNCIÓN DE DEPURACIÓN PARA MENSAJES =====
function debugUserMessageStyles(selectedElement) {
    console.log('🔍 Iniciando depuración de estilos para mensaje del usuario...');
    
    let userMessageElement = selectedElement;
    const data = {};

    if (userMessageElement && userMessageElement.classList.contains('user-message')) {
        const computedStyles = window.getComputedStyle(userMessageElement);
        const parentComputedStyles = window.getComputedStyle(userMessageElement.parentElement);

        data.userMessageStyles = {
            display: computedStyles.getPropertyValue('display'),
            visibility: computedStyles.getPropertyValue('visibility'),
            opacity: computedStyles.getPropertyValue('opacity'),
            position: computedStyles.getPropertyValue('position'),
            zIndex: computedStyles.getPropertyValue('z-index'),
            clipPath: computedStyles.getPropertyValue('clip-path'),
            width: computedStyles.getPropertyValue('width'),
            height: computedStyles.getPropertyValue('height'),
            overflow: computedStyles.getPropertyValue('overflow'),
            backgroundColor: computedStyles.getPropertyValue('background-color'),
            color: computedStyles.getPropertyValue('color')
        };

        data.parentStyles = {
            display: parentComputedStyles.getPropertyValue('display'),
            visibility: parentComputedStyles.getPropertyValue('visibility'),
            opacity: parentComputedStyles.getPropertyValue('opacity'),
            position: parentComputedStyles.getPropertyValue('position'),
            zIndex: parentComputedStyles.getPropertyValue('z-index'),
            clipPath: parentComputedStyles.getPropertyValue('clip-path'),
            overflow: parentComputedStyles.getPropertyValue('overflow'),
            height: parentComputedStyles.getPropertyValue('height'),
            maxHeight: parentComputedStyles.getPropertyValue('max-height')
        };
        
        console.log('📊 Estilos del mensaje del usuario:', data.userMessageStyles);
        console.log('📊 Estilos del contenedor padre:', data.parentStyles);
        
        // Verificar si el mensaje es visible
        const isVisible = computedStyles.display !== 'none' && 
                         computedStyles.visibility !== 'hidden' && 
                         parseFloat(computedStyles.opacity) > 0;
        
        console.log('👁️ ¿El mensaje es visible?', isVisible);
        
        if (!isVisible) {
            console.warn('⚠️ El mensaje del usuario NO es visible. Revisando posibles causas...');
        }
        
    } else {
        console.error('❌ No se encontró un elemento con clase "user-message"');
    }
    
    return data;
}

// ===== FUNCIÓN GLOBAL PARA DEPURACIÓN DESDE CONSOLA =====
window.debugChatbotMessage = function(element) {
    if (!element) {
        console.log('🔍 Selecciona un elemento en el inspector y ejecuta: debugChatbotMessage($0)');
        return;
    }
    return debugUserMessageStyles(element);
};

// ===== FUNCIÓN PARA VERIFICAR Y RESTAURAR MENSAJES =====
function verificarMensajesChatbot(tipo) {
    const container = tipo === 'ai' ? document.getElementById('aiChatbotMessages') : document.getElementById('chatbotMessages');
    if (!container) return;
    
    const userMessages = container.querySelectorAll('.user-message');
    const botMessages = container.querySelectorAll('.bot-message');
    
    console.log(`🔍 Verificación de mensajes en chatbot ${tipo}:`);
    console.log(`- Mensajes del usuario: ${userMessages.length}`);
    console.log(`- Mensajes del bot: ${botMessages.length}`);
    console.log(`- Total de elementos: ${container.children.length}`);
    
    // Verificar que cada mensaje del usuario sea visible
    userMessages.forEach((msg, index) => {
        const styles = window.getComputedStyle(msg);
        const isVisible = styles.display !== 'none' && 
                         styles.visibility !== 'hidden' && 
                         parseFloat(styles.opacity) > 0;
        
        if (!isVisible) {
            console.warn(`⚠️ Mensaje del usuario ${index + 1} no es visible, restaurando...`);
            msg.style.display = 'flex';
            msg.style.visibility = 'visible';
            msg.style.opacity = '1';
        }
    });
    
    return {
        userMessages: userMessages.length,
        botMessages: botMessages.length,
        total: container.children.length
    };
}

// ===== FUNCIÓN GLOBAL PARA VERIFICAR CHATBOTS =====
window.verificarChatbots = function() {
    console.log('🔍 Verificando ambos chatbots...');
    const aiStatus = verificarMensajesChatbot('ai');
    const helpStatus = verificarMensajesChatbot('help');
    
    return { ai: aiStatus, help: helpStatus };
};

// ===== FUNCIÓN PARA MONITOREAR CAMBIOS EN EL DOM =====
function monitorearCambiosChatbot(tipo) {
    const container = tipo === 'ai' ? document.getElementById('aiChatbotMessages') : document.getElementById('chatbotMessages');
    if (!container) return;
    
    // Crear un observador de mutaciones
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                console.log('🔍 Cambio detectado en chatbot', tipo);
                console.log('Tipo de cambio:', mutation.type);
                console.log('Nodos agregados:', mutation.addedNodes.length);
                console.log('Nodos removidos:', mutation.removedNodes.length);
                
                if (mutation.removedNodes.length > 0) {
                    console.warn('⚠️ Elementos removidos:', mutation.removedNodes);
                }
            }
        });
    });
    
    // Configurar el observador
    observer.observe(container, {
        childList: true,
        subtree: true
    });
    
    console.log('👁️ Monitoreo activado para chatbot', tipo);
    return observer;
}

// ===== FUNCIÓN GLOBAL PARA ACTIVAR MONITOREO =====
window.activarMonitoreoChatbots = function() {
    console.log('🔍 Activando monitoreo de chatbots...');
    const aiObserver = monitorearCambiosChatbot('ai');
    const helpObserver = monitorearCambiosChatbot('help');
    
    return { ai: aiObserver, help: helpObserver };
};

// ===== FUNCIÓN PARA VERIFICAR CSS CONFLICTIVO =====
window.verificarCSSConflictivo = function() {
    console.log('🔍 Verificando CSS conflictivo...');
    
    // Verificar si hay estilos que oculten .user-message
    const styleSheets = document.styleSheets;
    let reglasConflictivas = [];
    
    for (let i = 0; i < styleSheets.length; i++) {
        try {
            const rules = styleSheets[i].cssRules || styleSheets[i].rules;
            for (let j = 0; j < rules.length; j++) {
                const rule = rules[j];
                if (rule.selectorText && rule.selectorText.includes('.user-message')) {
                    console.log('📋 Regla CSS encontrada:', rule.selectorText);
                    console.log('📋 Estilos:', rule.style.cssText);
                    
                    // Verificar si hay estilos que oculten
                    if (rule.style.display === 'none' || 
                        rule.style.visibility === 'hidden' || 
                        rule.style.opacity === '0') {
                        reglasConflictivas.push(rule);
                        console.warn('⚠️ Regla conflictiva encontrada:', rule.selectorText);
                    }
                }
            }
        } catch (e) {
            console.log('No se pudo acceder a la hoja de estilos:', e);
        }
    }
    
    return reglasConflictivas;
};

// ===== FUNCIÓN PARA FORZAR VISIBILIDAD =====
window.forzarVisibilidadMensajes = function() {
    console.log('🔧 Forzando visibilidad de mensajes...');
    
    const userMessages = document.querySelectorAll('.user-message');
    userMessages.forEach((msg, index) => {
        console.log(`🔧 Aplicando estilos forzados al mensaje ${index + 1}`);
        
        msg.style.setProperty('display', 'flex', 'important');
        msg.style.setProperty('visibility', 'visible', 'important');
        msg.style.setProperty('opacity', '1', 'important');
        msg.style.setProperty('background', 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', 'important');
        msg.style.setProperty('color', 'white', 'important');
        msg.style.setProperty('padding', '0.75rem', 'important');
        msg.style.setProperty('border-radius', '15px', 'important');
        msg.style.setProperty('box-shadow', '0 4px 15px rgba(99, 102, 241, 0.4)', 'important');
        msg.style.setProperty('margin-bottom', '0.5rem', 'important');
        msg.style.setProperty('max-width', '80%', 'important');
        msg.style.setProperty('align-self', 'flex-end', 'important');
    });
    
    console.log(`✅ Estilos forzados aplicados a ${userMessages.length} mensajes`);
};

// ===== INICIALIZACIÓN DE LA PÁGINA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando Cresalia...');
    
    // Inicializar carrito
    if (typeof carrito === 'undefined') {
        window.carrito = [];
    }
    
    // Cargar carrito desde localStorage
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    
    // Inicializar badge del carrito
    if (typeof inicializarBadgeCarrito === 'function') {
        inicializarBadgeCarrito();
    }
    
    // Inicializar carrito (oculto al cargar)
    if (typeof inicializarCarritoAlCargar === 'function') {
        inicializarCarritoAlCargar();
    }
    
    // Limpiar bloqueos de interfaz al cargar
    if (typeof limpiarBloqueosInterfaz === 'function') {
        limpiarBloqueosInterfaz();
    }
    
    // Renderizar productos al cargar la página
    console.log('🎨 Renderizando productos...');
    console.log('📦 PRODUCTOS_DATA disponible:', PRODUCTOS_DATA ? 'Sí' : 'No');
    console.log('📦 Cantidad de productos:', PRODUCTOS_DATA ? PRODUCTOS_DATA.length : 0);
    renderizarProductos(PRODUCTOS_DATA);
    
    // Agregar mensajes de bienvenida a los chatbots después de un delay
    setTimeout(() => {
        // Mensaje de bienvenida para el chatbot de ayuda
        const chatbotMessages = document.getElementById('chatbotMessages');
        if (chatbotMessages) {
            addMessage('help', '¡Hola! Soy el asistente de ayuda de Cresalia 🛠️. ¿En qué puedo ayudarte?', 'bot');
        }
        
        // Mensaje de bienvenida para el chatbot IA
        const aiChatbotMessages = document.getElementById('aiChatbotMessages');
        if (aiChatbotMessages) {
            addMessage('ai', '¡Hola! Soy el asistente virtual de Cresalia 💜. Estoy aquí para ayudarte con todo sobre nuestra plataforma. ¿En qué puedo asistirte hoy?', 'bot');
        }
    }, 1000);
    
    console.log('Cresalia inicializada correctamente');
    
    // Inicializar mapa de Google Maps después de un delay para asegurar que la API esté cargada
    setTimeout(() => {
        inicializarMapa();
    }, 2000);
    
    // Inicializar Mercado Pago
    setTimeout(() => {
        inicializarMercadoPago();
    }, 3000);
});

// ===== FUNCIÓN PARA MANEJAR CAMPOS DE TARJETA =====
function manejarCamposTarjeta(metodoPago, tipoFormulario) {
    console.log('Manejando campos de tarjeta:', metodoPago, tipoFormulario);
    
    const sufijo = tipoFormulario === 'Producto' ? 'Producto' : 'Carrito';
    const camposTarjeta = document.getElementById(`camposTarjeta${sufijo}`);
    const preview = document.getElementById(`previewTarjeta${sufijo}`);
    
    if (!camposTarjeta) {
        console.error(`No se encontró el contenedor de campos de tarjeta para ${tipoFormulario}`);
        return;
    }
    
    // Obtener todos los campos de tarjeta
    const numeroTarjeta = document.getElementById(`numeroTarjeta${sufijo}`);
    const vencimientoTarjeta = document.getElementById(`vencimientoTarjeta${sufijo}`);
    const cvvTarjeta = document.getElementById(`cvvTarjeta${sufijo}`);
    const titularTarjeta = document.getElementById(`titularTarjeta${sufijo}`);
    
    if (metodoPago === 'credito' || metodoPago === 'debito') {
        // Mostrar campos de tarjeta
        camposTarjeta.style.display = 'block';
        if (preview) preview.style.display = 'grid';
        
        // Hacer campos requeridos
        if (numeroTarjeta) numeroTarjeta.required = true;
        if (vencimientoTarjeta) vencimientoTarjeta.required = true;
        if (cvvTarjeta) cvvTarjeta.required = true;
        if (titularTarjeta) titularTarjeta.required = true;
        
        console.log('Campos de tarjeta mostrados y marcados como requeridos');
    } else {
        // Ocultar campos de tarjeta
        camposTarjeta.style.display = 'none';
        if (preview) preview.style.display = 'none';
        
        // Quitar requerimiento
        if (numeroTarjeta) numeroTarjeta.required = false;
        if (vencimientoTarjeta) vencimientoTarjeta.required = false;
        if (cvvTarjeta) cvvTarjeta.required = false;
        if (titularTarjeta) titularTarjeta.required = false;
        
        // Limpiar valores
        if (numeroTarjeta) numeroTarjeta.value = '';
        if (vencimientoTarjeta) vencimientoTarjeta.value = '';
        if (cvvTarjeta) cvvTarjeta.value = '';
        if (titularTarjeta) titularTarjeta.value = '';
        
        console.log('Campos de tarjeta ocultos y limpiados');
    }
}

// Actualizar preview de tarjeta en vivo
function actualizarPreviewTarjeta(tipoFormulario) {
    const sufijo = tipoFormulario === 'Producto' ? 'Producto' : 'Carrito';
    const numero = document.getElementById(`numeroTarjeta${sufijo}`)?.value || '';
    const venc = document.getElementById(`vencimientoTarjeta${sufijo}`)?.value || '';
    const cvv = document.getElementById(`cvvTarjeta${sufijo}`)?.value || '';
    const titular = document.getElementById(`titularTarjeta${sufijo}`)?.value || '';

    const numeroPrev = document.getElementById(`prev-numero-${sufijo}`);
    const vencPrev = document.getElementById(`prev-venc-${sufijo}`);
    const cvvPrev = document.getElementById(`prev-cvv-${sufijo}`);
    const titularPrev = document.getElementById(`prev-titular-${sufijo}`);

    if (numeroPrev) {
        const limpio = numero.replace(/\D/g, '').padEnd(16, '•').slice(0,16).replace(/(.{4})/g, '$1 ').trim();
        numeroPrev.textContent = limpio || '•••• •••• •••• ••••';
    }
    if (vencPrev) vencPrev.textContent = venc || 'MM/AA';
    if (cvvPrev) cvvPrev.textContent = (cvv || '•••').padEnd(3, '•');
    if (titularPrev) titularPrev.textContent = titular || 'TU NOMBRE';
}

// ===== FUNCIONES DE CHATBOT =====
function addMessage(tipo, mensaje, sender) {
    console.log('Agregando mensaje:', tipo, mensaje, sender);
    
    let container, input;
    
    if (tipo === 'ai') {
        container = document.getElementById('aiChatbotMessages');
        input = document.getElementById('aiChatInput');
    } else {
        container = document.getElementById('chatbotMessages');
        input = document.getElementById('chatInput');
    }
    
    if (!container) {
        console.error('No se encontró el contenedor de mensajes para:', tipo);
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    
    const time = new Date().toLocaleTimeString('es-AR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Limpiar el mensaje de posibles caracteres especiales
    const mensajeLimpio = mensaje.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    messageDiv.innerHTML = `
        <div class="message-text">${mensajeLimpio}</div>
        <div class="message-time" style="font-size: 0.7rem; opacity: 0.7; margin-top: 4px;">${time}</div>
    `;
    
    // Limpiar elementos sueltos o mal estructurados antes de agregar el nuevo mensaje
    const elementosSueltos = container.querySelectorAll('.message-text:not(.user-message .message-text):not(.bot-message .message-text)');
    elementosSueltos.forEach(elemento => {
        console.warn('Eliminando elemento suelto:', elemento);
        elemento.remove();
    });
    
    // Agregar el mensaje al contenedor
    container.appendChild(messageDiv);
    
    // 🎯 NUEVO: Crear ticket automáticamente si es un mensaje del usuario en el chat de soporte
    if (sender === 'user' && tipo === 'help') {
        crearTicketDesdeChat(mensaje, time);
    }
    
    // Función mejorada para scroll al final
    const scrollToBottom = () => {
        if (container) {
            // Usar scrollIntoView para un scroll más suave
            const lastMessage = container.lastElementChild;
            if (lastMessage) {
                lastMessage.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'end',
                    inline: 'nearest'
                });
            } else {
                // Fallback al método tradicional
                container.scrollTop = container.scrollHeight;
            }
        }
    };
    
    // Intentar scroll con múltiples intentos para asegurar que funcione
    scrollToBottom();
    setTimeout(scrollToBottom, 100);
    setTimeout(scrollToBottom, 300);
    setTimeout(scrollToBottom, 500);
    
    // Debug: verificar que el mensaje se agregó correctamente
    console.log('Mensaje agregado al contenedor:', container.children.length, 'mensajes totales');
    console.log('Último mensaje:', messageDiv);
    
    // Asegurar que el mensaje sea visible después de agregarlo
    setTimeout(() => {
        if (messageDiv && messageDiv.style) {
            messageDiv.style.opacity = '1';
            messageDiv.style.visibility = 'visible';
        }
    }, 50);
    
    // Función de depuración para verificar estilos de mensajes
    if (tipo === 'ai' && sender === 'user') {
        setTimeout(() => {
            debugUserMessageStyles(messageDiv);
            
            // Verificación adicional: forzar estilos visibles
            const computedStyles = window.getComputedStyle(messageDiv);
            console.log('🔍 Verificación adicional de estilos:');
            console.log('- Background:', computedStyles.backgroundColor);
            console.log('- Color:', computedStyles.color);
            console.log('- Width:', computedStyles.width);
            console.log('- Height:', computedStyles.height);
            console.log('- Margin:', computedStyles.margin);
            console.log('- Padding:', computedStyles.padding);
            
            // Si el mensaje no es visible, forzar estilos
            if (computedStyles.backgroundColor === 'rgba(0, 0, 0, 0)' || 
                computedStyles.backgroundColor === 'transparent') {
                console.warn('⚠️ Mensaje sin fondo, aplicando estilos forzados...');
                messageDiv.style.setProperty('background', 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', 'important');
                messageDiv.style.setProperty('color', 'white', 'important');
                messageDiv.style.setProperty('padding', '0.75rem', 'important');
                messageDiv.style.setProperty('border-radius', '15px', 'important');
                messageDiv.style.setProperty('box-shadow', '0 4px 15px rgba(99, 102, 241, 0.4)', 'important');
            }
        }, 100);
    }
    
    // Limpiar input si es mensaje del usuario
    if (sender === 'user' && input) {
        input.value = '';
    }
    
    // Retornar el elemento creado para referencia
    return messageDiv;
}

function sendMessage(tipo) {
    const inputId = tipo === 'ai' ? 'aiChatInput' : 'chatInput';
    const input = document.getElementById(inputId);
    const message = input.value.trim();
    
    if (message) {
        console.log('🚀 Iniciando envío de mensaje:', tipo, message);
        
        // Agregar mensaje del usuario
        const userMessageElement = addMessage(tipo, message, 'user');
        console.log('✅ Mensaje del usuario agregado:', userMessageElement);
        
        // Verificar inmediatamente después de agregar
        setTimeout(() => {
            const container = tipo === 'ai' ? document.getElementById('aiChatbotMessages') : document.getElementById('chatbotMessages');
            const userMessages = container.querySelectorAll('.user-message');
            console.log('🔍 Verificación inmediata - Mensajes del usuario:', userMessages.length);
            
            // Verificar si el mensaje que acabamos de agregar sigue ahí
            if (userMessageElement && !container.contains(userMessageElement)) {
                console.error('❌ ¡EL MENSAJE DEL USUARIO DESAPARECIÓ!');
                console.log('Mensaje original:', userMessageElement);
                console.log('Contenedor actual:', container);
            }
        }, 100);
        
        // Esperar antes de agregar la respuesta del bot
        setTimeout(() => {
            const container = tipo === 'ai' ? document.getElementById('aiChatbotMessages') : document.getElementById('chatbotMessages');
            console.log('🤖 Preparando respuesta del bot...');
            
            // Verificar estado antes de la respuesta
            const userMessagesBefore = container.querySelectorAll('.user-message');
            console.log('📊 Antes de respuesta - Mensajes del usuario:', userMessagesBefore.length);
            
            let respuesta;
            if (tipo === 'ai') {
                respuesta = generarRespuestaIA(message);
            } else {
                respuesta = generarRespuestaAyuda(message);
            }
            
            // Agregar respuesta del bot
            const botMessageElement = addMessage(tipo, respuesta, 'bot');
            console.log('✅ Respuesta del bot agregada:', botMessageElement);
            
            // Verificar después de agregar la respuesta
            setTimeout(() => {
                const userMessagesAfter = container.querySelectorAll('.user-message');
                console.log('📊 Después de respuesta - Mensajes del usuario:', userMessagesAfter.length);
                
                if (userMessagesAfter.length < userMessagesBefore.length) {
                    console.error('❌ ¡SE PERDIERON MENSAJES DEL USUARIO!');
                    console.log('Antes:', userMessagesBefore.length, 'Después:', userMessagesAfter.length);
                }
                
                // Forzar scroll al final
                container.scrollTop = container.scrollHeight;
            }, 200);
        }, 1500);
    }
}

function toggleChatbot() {
    // Asegurar disponibilidad global
    if (typeof window !== 'undefined' && !window.toggleChatbot) {
        window.toggleChatbot = toggleChatbot;
    }
    
    // Buscar el modal principal de chatbot (chatbot-modal)
    const modal = document.getElementById('chatbotModal');
    
    if (!modal) {
        console.error('❌ No se encontró el modal del chatbot (id: chatbotModal)');
        return;
    }
    
    // Verificar estado actual
    const computedStyle = window.getComputedStyle(modal);
    const isCurrentlyVisible = computedStyle.display !== 'none' && 
                               modal.classList.contains('active');
    
    if (isCurrentlyVisible) {
        // Cerrar modal
        modal.style.display = 'none';
        modal.classList.remove('active');
        console.log('✅ Chatbot cerrado');
    } else {
        // Abrir modal
        modal.style.display = 'flex';
        modal.classList.add('active');
        console.log('✅ Chatbot abierto');
        
        // Enfocar el input si existe
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) {
                input.focus();
            }
        }, 100);
    }
}

function toggleAIChatbot() {
    // Asegurar disponibilidad global
    if (typeof window !== 'undefined' && !window.toggleAIChatbot) {
        window.toggleAIChatbot = toggleAIChatbot;
    }
    
    // Buscar el modal principal de chatbot IA (ai-chatbot-modal)
    const modal = document.getElementById('aiChatbotModal');
    
    if (!modal) {
        console.error('❌ No se encontró el modal del AI chatbot (id: aiChatbotModal)');
        return;
    }
    
    // Verificar estado actual
    const computedStyle = window.getComputedStyle(modal);
    const isCurrentlyVisible = computedStyle.display !== 'none' && 
                               modal.classList.contains('active');
    
    if (isCurrentlyVisible) {
        // Cerrar modal
        modal.style.display = 'none';
        modal.classList.remove('active');
        console.log('✅ AI Chatbot cerrado');
    } else {
        // Abrir modal
        modal.style.display = 'flex';
        modal.classList.add('active');
        console.log('✅ AI Chatbot abierto');
        
        // Enfocar el input si existe
        setTimeout(() => {
            const input = document.getElementById('aiChatInput');
            if (input) {
                input.focus();
            }
        }, 100);
    }
}

// ===== FUNCIONES DE RESERVA =====
function reservarServicio(servicio) {
    console.log('Reservando servicio:', servicio);
    mostrarNotificacion('Función de reserva en desarrollo');
}

// ===== FUNCIÓN IA INTELIGENTE PARA CRESALIA =====
function generarRespuestaIA(mensaje) {
    const mensajeLower = mensaje.toLowerCase();
    
    // Saludos
    if (mensajeLower.includes('hola') || mensajeLower.includes('buenos días') || mensajeLower.includes('buenas')) {
        const saludos = [
            '¡Hola! Soy tu asistente virtual de Cresalia 💜. ¿En qué puedo ayudarte hoy?',
            '¡Buen día! Bienvenido a Cresalia. ¿En qué puedo asistirte?',
            '¡Hola! Gracias por contactar con Cresalia. ¿Cómo puedo ayudarte?'
        ];
        return saludos[Math.floor(Math.random() * saludos.length)];
    }
    
    // Productos específicos
    if (mensajeLower.includes('bug remover') || mensajeLower.includes('removedor')) {
        return '🐛 **Bug Remover** - Nuestro removedor profesional de insectos y suciedad del parabrisas.\n💰 Precio: $8,500\n📦 Stock: 15 unidades\n\n¿Te gustaría conocer más detalles?';
    }
    
    if (mensajeLower.includes('ice shampoo') || mensajeLower.includes('ice')) {
        return '❄️ **ICE Shampoo** - Shampoo con efecto hielo para un acabado brillante y duradero.\n💰 Precio: $12,500\n📦 Stock: 15 unidades\n\n¿Te interesa este producto?';
    }
    
    if (mensajeLower.includes('extreme detail') || mensajeLower.includes('extreme')) {
        return '🔥 **Extreme Detail** - Cera líquida de alta duración para máxima protección.\n💰 Precio: $18,000\n📦 Stock: 12 unidades\n\n¿Te gustaría saber más?';
    }
    
    // Categorías
    if (mensajeLower.includes('limpiador') || mensajeLower.includes('limpiadores')) {
        return '🧽 **Nuestros Limpiadores Especializados:**\n• Bug Remover - $8,500\n• Alcaline Wheels - $12,000\n• Iron Warning - $15,000\n• CTRL Z - $9,500\n\n¿Cuál te llama más la atención?';
    }
    
    if (mensajeLower.includes('shampoo') || mensajeLower.includes('shampoos')) {
        return '🧴 **Nuestros Shampoos Profesionales:**\n• ICE Shampoo - $12,500\n• Energy Shampoo - $13,500\n• Pure Foam - $14,500\n• Banana Shampoo - $15,500\n\n¿Cuál te gustaría conocer mejor?';
    }
    
    // Precios
    if (mensajeLower.includes('precio') || mensajeLower.includes('costo') || mensajeLower.includes('cuánto')) {
        return '💰 **Nuestros Rangos de Precios:**\n• Limpiadores: $8,000 - $15,000\n• Shampoos: $12,000 - $16,000\n• Ceras: $16,000 - $19,000\n\n¿Qué categoría te interesa explorar?';
    }
    
    // Horarios
    if (mensajeLower.includes('horario') || mensajeLower.includes('abierto')) {
        return '🕐 **Nuestros Horarios de Atención:**\n📅 Lunes a Viernes\n⏰ 8:00 - 12:00 y 16:00 - 20:00\n📍 Av. Principal 123, Ciudad Ejemplo\n\n¡Te esperamos!';
    }
    
    // Envíos
    if (mensajeLower.includes('envío') || mensajeLower.includes('delivery')) {
        return '🚚 **Opciones de Entrega:**\n✅ Ciudad Ejemplo: Envío GRATIS\n🏪 Interior y otras ciudades: A cargo del cliente\n🏪 Retiro en sucursal disponible\n\n¿Cuál prefieres?';
    }
    
    // Contacto
    if (mensajeLower.includes('contacto') || mensajeLower.includes('teléfono')) {
        return '📞 **Información de Contacto:**\n📱 WhatsApp: +5491123456789\n📞 Teléfono: +5491123456789\n📍 Dirección: Av. Principal 123, Ciudad Ejemplo\n\n¡Estamos aquí para ayudarte!';
    }
    
    const respuestasGenericas = [
        '🤔 ¿Podrías ser más específico? Puedo ayudarte con productos, precios, horarios, envíos y contacto. ¡Escribe el nombre del producto que te interesa!',
        '💡 ¿Qué te gustaría saber? Puedo informarte sobre nuestros productos, precios, horarios o envíos. ¡Solo dime qué necesitas!',
        '🎯 ¿En qué puedo ayudarte? Conozco todos nuestros productos automotrices, precios y servicios. ¡Cuéntame qué buscas!'
    ];
    return respuestasGenericas[Math.floor(Math.random() * respuestasGenericas.length)];
}

function generarRespuestaAyuda(mensaje) {
    const mensajeLower = mensaje.toLowerCase();
    
    if (mensajeLower.includes('hola') || mensajeLower.includes('ayuda')) {
        const saludosAyuda = [
            '¡Hola! Soy el equipo de soporte de Cresalia 🛠️. ¿En qué puedo ayudarte?',
            '¡Buen día! Estamos aquí para asistirte. ¿Qué necesitas?',
            '¡Hola! Gracias por contactar nuestro soporte. ¿Cómo puedo ayudarte?'
        ];
        return saludosAyuda[Math.floor(Math.random() * saludosAyuda.length)];
    }
    
    if (mensajeLower.includes('pedido') || mensajeLower.includes('compra')) {
        return '📦 ¿Tienes alguna consulta sobre tu pedido? Nuestro equipo está disponible al +5491123456789 para brindarte atención personalizada.';
    }
    
    if (mensajeLower.includes('pago') || mensajeLower.includes('error')) {
        return '💳 ¿Experimentaste algún problema con el pago? Llámanos al +5491123456789 y te asistiremos de inmediato.';
    }
    
    const respuestasAyuda = [
        '📞 Para atención personalizada, contacta directamente al +5491123456789. ¡Estamos aquí para ayudarte!',
        '📞 ¿Necesitas ayuda específica? Llámanos al +5491123456789 y con gusto te asistiremos.',
        '📞 Nuestro equipo de soporte está disponible al +5491123456789. ¡No dudes en contactarnos!'
    ];
    return respuestasAyuda[Math.floor(Math.random() * respuestasAyuda.length)];
}

// ===== VALIDACIÓN SEGURA DE TARJETAS =====

// Algoritmo de Luhn para validar números de tarjeta
function validarLuhn(numeroTarjeta) {
    const digitos = numeroTarjeta.replace(/\D/g, '').split('').map(Number);
    
    if (digitos.length < 13 || digitos.length > 19) {
        return false;
    }
    
    let suma = 0;
    let esPar = false;
    
    // Recorrer de derecha a izquierda
    for (let i = digitos.length - 1; i >= 0; i--) {
        let digito = digitos[i];
        
        if (esPar) {
            digito *= 2;
            if (digito > 9) {
                digito -= 9;
            }
        }
        
        suma += digito;
        esPar = !esPar;
    }
    
    return suma % 10 === 0;
}

// Detectar tipo de tarjeta
function detectarTipoTarjeta(numeroTarjeta) {
    const numero = numeroTarjeta.replace(/\D/g, '');
    
    // Patrones de tarjetas
    const patrones = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    };
    
    for (const [tipo, patron] of Object.entries(patrones)) {
        if (patron.test(numero)) {
            return tipo;
        }
    }
    
    return 'desconocida';
}

// Validar CVV
function validarCVV(cvv, tipoTarjeta) {
    const cvvLimpio = cvv.replace(/\D/g, '');
    
    if (tipoTarjeta === 'amex') {
        return cvvLimpio.length === 4;
    } else {
        return cvvLimpio.length === 3;
    }
}

// Validar fecha de expiración
function validarFechaExpiracion(mes, año) {
    const mesActual = new Date().getMonth() + 1;
    const añoActual = new Date().getFullYear();
    
    const mesTarjeta = parseInt(mes);
    const añoTarjeta = parseInt('20' + año);
    
    if (añoTarjeta < añoActual) {
        return false;
    }
    
    if (añoTarjeta === añoActual && mesTarjeta < mesActual) {
        return false;
    }
    
    return mesTarjeta >= 1 && mesTarjeta <= 12;
}

// Validar tarjeta completa
function validarTarjetaCompleta(numero, cvv, mes, año) {
    const errores = [];
    
    // Validar número de tarjeta
    if (!numero || numero.replace(/\D/g, '').length < 13) {
        errores.push('Número de tarjeta inválido');
    } else if (!validarLuhn(numero)) {
        errores.push('Número de tarjeta no válido (algoritmo de Luhn)');
    }
    
    // Detectar tipo de tarjeta
    const tipoTarjeta = detectarTipoTarjeta(numero);
    if (tipoTarjeta === 'desconocida') {
        errores.push('Tipo de tarjeta no reconocido');
    }
    
    // Validar CVV
    if (!validarCVV(cvv, tipoTarjeta)) {
        errores.push(`CVV inválido (debe tener ${tipoTarjeta === 'amex' ? '4' : '3'} dígitos)`);
    }
    
    // Validar fecha
    if (!validarFechaExpiracion(mes, año)) {
        errores.push('Fecha de expiración inválida o tarjeta vencida');
    }
    
    return {
        esValida: errores.length === 0,
        errores: errores,
        tipoTarjeta: tipoTarjeta
    };
}

// Función para procesar pago seguro
function procesarPagoSeguro(datosTarjeta, monto, descripcion) {
    console.log('🔒 Iniciando procesamiento seguro de pago...');
    
    // Validar tarjeta
    const validacion = validarTarjetaCompleta(
        datosTarjeta.numero,
        datosTarjeta.cvv,
        datosTarjeta.mes,
        datosTarjeta.año
    );
    
    if (!validacion.esValida) {
        mostrarNotificacionPago('❌ Error de validación: ' + validacion.errores.join(', '), 'error');
        return false;
    }
    
    // Simular procesamiento seguro
    mostrarNotificacionPago('🔒 Procesando pago de forma segura...', 'info');
    
    // Simular delay de procesamiento
    setTimeout(() => {
        // Simular verificación 3D Secure
        mostrarNotificacionPago('🔐 Verificando con banco emisor...', 'info');
        
        setTimeout(() => {
            // Simular resultado exitoso
            const resultado = {
                exitoso: Math.random() > 0.1, // 90% de éxito
                transaccionId: 'TXN' + Date.now(),
                monto: monto,
                tipoTarjeta: validacion.tipoTarjeta,
                ultimosDigitos: datosTarjeta.numero.slice(-4),
                timestamp: new Date().toISOString()
            };
            
            if (resultado.exitoso) {
                mostrarNotificacionPago('✅ Pago procesado exitosamente', 'success');
                console.log('💳 Pago exitoso:', resultado);
                
                // Generar factura
                generarFactura(resultado, descripcion);
                
                // Limpiar formulario
                limpiarFormularioPago();
                
                // Cerrar modal
                cerrarModalPago();
                
            } else {
                mostrarNotificacionPago('❌ Pago rechazado por el banco', 'error');
                console.log('💳 Pago rechazado:', resultado);
            }
        }, 2000);
        
    }, 1500);
    
    return true;
}

// Función para mostrar notificaciones de pago
function mostrarNotificacionPago(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion-pago notificacion-${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-pago-contenido">
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    // Agregar estilos
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#10B981' : tipo === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notificacion.remove(), 300);
        }
    }, 4000);
}

// Función para limpiar formulario de pago
function limpiarFormularioPago() {
    const campos = ['numeroTarjeta', 'cvv', 'mes', 'año', 'titular'];
    campos.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) elemento.value = '';
    });
}

// Función para cerrar modal de pago
function cerrarModalPago() {
    const modal = document.querySelector('.modal-pago');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

// Función para generar factura
function generarFactura(resultadoPago, descripcion) {
    const factura = {
        numero: 'FAC-' + Date.now(),
        fecha: new Date().toLocaleDateString('es-AR'),
        hora: new Date().toLocaleTimeString('es-AR'),
        monto: resultadoPago.monto,
        descripcion: descripcion,
        metodoPago: `${resultadoPago.tipoTarjeta.toUpperCase()} ****${resultadoPago.ultimosDigitos}`,
        transaccionId: resultadoPago.transaccionId,
        estado: 'PAGADO'
    };
    
    console.log('🧾 Factura generada:', factura);
    
    // Aquí se podría enviar la factura por email o WhatsApp
    mostrarNotificacionPago('🧾 Factura generada y enviada', 'success');
}

// ===== SISTEMA DE TICKETS PARA CARLA =====

// Función para crear ticket automáticamente desde el chat
function crearTicketDesdeChat(mensaje, tiempo) {
    console.log('🎯 Creando ticket desde chat de soporte...');
    
    const ticket = {
        id: 'TKT-' + Date.now(),
        fecha: new Date().toISOString(),
        hora: tiempo,
        cliente: 'Cliente Web',
        email: 'cliente@web.com',
        telefono: 'No especificado',
        asunto: 'Consulta desde Chat de Soporte',
        mensaje: mensaje,
        categoria: 'general',
        prioridad: 'media',
        estado: 'pendiente',
        fuente: 'chat_soporte',
        atendidoPor: null,
        respuestas: [],
        tiempoResolucion: null
    };
    
    // Guardar ticket en localStorage
    guardarTicket(ticket);
    
    // Mostrar notificación al cliente
    mostrarNotificacionTicket('✅ Tu consulta ha sido registrada. Te responderemos pronto.', 'success');
    
    console.log('🎯 Ticket creado:', ticket);
}

// Función para guardar ticket en localStorage
function guardarTicket(ticket) {
    let tickets = JSON.parse(localStorage.getItem('ticketsCarla') || '[]');
    tickets.push(ticket);
    localStorage.setItem('ticketsCarla', JSON.stringify(tickets));
    
    // También guardar en el sistema general para sincronización
    let ticketsGenerales = JSON.parse(localStorage.getItem('ticketsSoporte') || '[]');
    ticketsGenerales.push(ticket);
    localStorage.setItem('ticketsSoporte', JSON.stringify(ticketsGenerales));
    
    console.log('💾 Ticket guardado en localStorage');
}

// Función para mostrar notificación de ticket
function mostrarNotificacionTicket(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion-ticket notificacion-${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-ticket-contenido">
            <i class="fas fa-ticket-alt"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    // Agregar estilos
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: ${tipo === 'success' ? '#10B981' : tipo === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideInLeft 0.3s ease-out;
        max-width: 400px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.style.animation = 'slideOutLeft 0.3s ease';
            setTimeout(() => notificacion.remove(), 300);
        }
    }, 5000);
}

// Función para obtener todos los tickets
function obtenerTickets() {
    return JSON.parse(localStorage.getItem('ticketsCarla') || '[]');
}

// Función para actualizar estado de ticket
function actualizarEstadoTicket(ticketId, nuevoEstado) {
    let tickets = obtenerTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (ticket) {
        ticket.estado = nuevoEstado;
        if (nuevoEstado === 'resuelto') {
            ticket.tiempoResolucion = new Date().toISOString();
        }
        localStorage.setItem('ticketsCarla', JSON.stringify(tickets));
        console.log('✅ Estado del ticket actualizado:', ticketId, nuevoEstado);
    }
}

// Función para agregar respuesta a ticket
function agregarRespuestaTicket(ticketId, respuesta) {
    let tickets = obtenerTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (ticket) {
        ticket.respuestas.push({
            fecha: new Date().toISOString(),
            respuesta: respuesta,
            atendidoPor: 'Carla'
        });
        localStorage.setItem('ticketsCarla', JSON.stringify(tickets));
        console.log('💬 Respuesta agregada al ticket:', ticketId);
    }
}

// Función para obtener estadísticas de tickets
function obtenerEstadisticasTickets() {
    const tickets = obtenerTickets();
    
    return {
        total: tickets.length,
        pendientes: tickets.filter(t => t.estado === 'pendiente').length,
        enProceso: tickets.filter(t => t.estado === 'en_proceso').length,
        resueltos: tickets.filter(t => t.estado === 'resuelto').length,
        urgentes: tickets.filter(t => t.prioridad === 'alta' || t.prioridad === 'urgente').length
    };
}

// ===== INICIALIZACIÓN DEL SISTEMA DE TICKETS =====
console.log('🎯 Sistema de tickets para Carla inicializado');
console.log('💡 Los mensajes del chat de soporte crean tickets automáticamente');
console.log('🔐 Acceso exclusivo: Ctrl + Alt + Shift + C');

// ===== SISTEMA DE USUARIOS =====

// Configuración del sistema de usuarios
const USER_CONFIG = {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
    maxLoginAttempts: 5
};

// Variables globales del sistema de usuarios
let currentUser = null;
let userLoginAttempts = 0;

// ===== FUNCIONES DEL SISTEMA DE USUARIOS =====

// Función para mostrar/ocultar el sistema de usuarios
function toggleUserSystem() {
    // Asegurar disponibilidad global
    if (typeof window !== 'undefined' && !window.toggleUserSystem) {
        window.toggleUserSystem = toggleUserSystem;
    }
    const userSystem = document.getElementById('userSystem');
    if (!userSystem) {
        console.error('No se encontró el elemento userSystem');
        return;
    }
    
    // Verificar si está oculto (display: none o vacío)
    const isHidden = userSystem.style.display === 'none' || 
                     userSystem.style.display === '' || 
                     window.getComputedStyle(userSystem).display === 'none';
    
    if (isHidden) {
        userSystem.style.display = 'flex';
        showLoginForm();
    } else {
        userSystem.style.display = 'none';
    }
}

// Función para cerrar el sistema de usuarios
function closeUserSystem() {
    const userSystem = document.getElementById('userSystem');
    if (userSystem) {
        userSystem.style.display = 'none';
    }
}

// Asegurar que todas las funciones estén disponibles globalmente INMEDIATAMENTE
(function() {
    'use strict';
    // Asignar funciones a window tan pronto como se definan
    if (typeof window !== 'undefined') {
        // Estas funciones se asignarán cuando se definan más abajo
        // Pero también las asignamos aquí para asegurar disponibilidad
        setTimeout(function() {
            if (typeof toggleUserSystem === 'function') window.toggleUserSystem = toggleUserSystem;
            if (typeof toggleChatbot === 'function') window.toggleChatbot = toggleChatbot;
            if (typeof toggleAIChatbot === 'function') window.toggleAIChatbot = toggleAIChatbot;
            if (typeof toggleCart === 'function') window.toggleCart = toggleCart;
            if (typeof showLoginForm === 'function') window.showLoginForm = showLoginForm;
            if (typeof showRegisterForm === 'function') window.showRegisterForm = showRegisterForm;
            if (typeof closeUserSystem === 'function') window.closeUserSystem = closeUserSystem;
            if (typeof togglePassword === 'function') window.togglePassword = togglePassword;
        }, 0);
    }
})();

// Función para mostrar el formulario de login
function showLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.classList.add('active');
    }
    if (registerForm) {
        registerForm.classList.remove('active');
    }
}

// Función para mostrar el formulario de registro
function showRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) {
        registerForm.classList.add('active');
    }
    if (loginForm) {
        loginForm.classList.remove('active');
    }
}

// Función para alternar visibilidad de contraseña
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.nextElementSibling;
    const icon = toggleBtn.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Función para registrar un nuevo usuario
function registerUser(userData) {
    try {
        // Obtener usuarios existentes
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Verificar si el email ya existe
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }
        
        // Crear nuevo usuario
        const newUser = {
            id: 'USER-' + Date.now(),
            ...userData,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            orders: [],
            services: [],
            isActive: true
        };
        
        // Agregar usuario a la lista
        users.push(newUser);
        
        // Guardar en localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        console.log('✅ Usuario registrado:', newUser);
        return newUser;
        
    } catch (error) {
        console.error('❌ Error al registrar usuario:', error);
        throw error;
    }
}

// Función para autenticar usuario
function loginUser(email, password) {
    try {
        // Obtener usuarios
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Buscar usuario por email
        const user = users.find(u => u.email === email && u.isActive);
        
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        
        // Verificar contraseña
        if (user.password !== password) {
            throw new Error('Contraseña incorrecta');
        }
        
        // Actualizar último login
        user.lastLogin = new Date().toISOString();
        localStorage.setItem('users', JSON.stringify(users));
        
        console.log('✅ Usuario autenticado:', user);
        return user;
        
    } catch (error) {
        console.error('❌ Error al autenticar usuario:', error);
        throw error;
    }
}

// Función para iniciar sesión de usuario
function startUserSession(user) {
    currentUser = user;
    
    // Guardar sesión en localStorage
    const session = {
        userId: user.id,
        email: user.email,
        name: user.name,
        timestamp: new Date().getTime()
    };
    
    localStorage.setItem('userSession', JSON.stringify(session));
    
    // Actualizar interfaz
    updateUserInterface();
    
    // Cerrar sistema de usuarios
    closeUserSystem();
    
    // Mostrar notificación
    mostrarNotificacion(`¡Bienvenido ${user.name}!`, 'success');
    
    console.log('👤 Sesión de usuario iniciada:', user.name);
}

// Función para cerrar sesión de usuario
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('userSession');
    
    // Actualizar interfaz
    updateUserInterface();
    
    // Mostrar notificación
    mostrarNotificacion('Sesión cerrada correctamente', 'info');
    
    console.log('👤 Sesión de usuario cerrada');
}

// Función para actualizar la interfaz según el estado del usuario
function updateUserInterface() {
    const userButton = document.getElementById('userButton') || document.getElementById('userAccountBtn');
    const userButtonText = document.getElementById('userButtonText');
    
    // Obtener los botones de login y signup del navbar (buscar por contenido del onclick)
    const allNavItems = document.querySelectorAll('.navbar-nav .nav-item');
    const loginButtonItem = Array.from(allNavItems).find(item => {
        const btn = item.querySelector('button[onclick*="showLoginForm"]');
        return btn !== null;
    });
    const signupButtonItem = Array.from(allNavItems).find(item => {
        const btn = item.querySelector('button[onclick*="showRegisterForm"]');
        return btn !== null;
    });
    
    if (currentUser) {
        // Usuario logueado - ocultar botones de login/signup, mostrar botón Mi Cuenta
        if (userButtonText) {
            userButtonText.textContent = currentUser.name.split(' ')[0];
        }
        if (userButton) {
            userButton.classList.add('user-logged-in');
            userButton.style.display = 'block';
            userButton.onclick = function() {
                showUserProfile();
                return false;
            };
        }
        
        // Ocultar botones de login/signup
        if (loginButtonItem) loginButtonItem.style.display = 'none';
        if (signupButtonItem) signupButtonItem.style.display = 'none';
    } else {
        // Usuario no logueado - mostrar botones de login/signup, ocultar botón Mi Cuenta
        if (userButtonText) {
            userButtonText.textContent = 'Mi Cuenta';
        }
        if (userButton) {
            userButton.classList.remove('user-logged-in');
            userButton.style.display = 'none';
            userButton.onclick = function() {
                toggleUserSystem();
                return false;
            };
        }
        
        // Mostrar botones de login/signup
        if (loginButtonItem) loginButtonItem.style.display = 'list-item';
        if (signupButtonItem) signupButtonItem.style.display = 'list-item';
    }
}

// Función para mostrar perfil del usuario
function showUserProfile() {
    if (!currentUser) return;
    
    // Crear modal del perfil
    const modal = document.createElement('div');
    modal.className = 'user-profile-modal';
    modal.innerHTML = `
        <div class="user-profile-container">
            <div class="user-profile-header">
                <h3><i class="fas fa-user-circle"></i> Mi Perfil</h3>
                <button onclick="closeUserProfile()" class="close-btn">&times;</button>
            </div>
            <div class="user-profile-content">
                <div class="user-info">
                    <h4>${currentUser.name}</h4>
                    <p><i class="fas fa-envelope"></i> ${currentUser.email}</p>
                    <p><i class="fas fa-phone"></i> ${currentUser.phone}</p>
                    <p><i class="fas fa-calendar"></i> Miembro desde: ${new Date(currentUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="user-stats">
                    <div class="stat-item">
                        <i class="fas fa-shopping-bag"></i>
                        <span>${currentUser.orders.length} Pedidos</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-tools"></i>
                        <span>${currentUser.services.length} Servicios</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button onclick="showUserOrders()" class="user-action-btn">
                        <i class="fas fa-history"></i> Ver Historial
                    </button>
                    <button onclick="logoutUser()" class="user-action-btn logout">
                        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Función para cerrar perfil del usuario
function closeUserProfile() {
    const modal = document.querySelector('.user-profile-modal');
    if (modal) {
        modal.remove();
    }
}

// Función para mostrar historial de pedidos
function showUserOrders() {
    if (!currentUser) return;
    
    // Crear modal del historial
    const modal = document.createElement('div');
    modal.className = 'user-orders-modal';
    modal.innerHTML = `
        <div class="user-orders-container">
            <div class="user-orders-header">
                <h3><i class="fas fa-history"></i> Mi Historial</h3>
                <button onclick="closeUserOrders()" class="close-btn">&times;</button>
            </div>
            <div class="user-orders-content">
                <div class="orders-tabs">
                    <button class="tab-btn active" onclick="switchOrdersTab('products')">
                        <i class="fas fa-shopping-bag"></i> Productos
                    </button>
                    <button class="tab-btn" onclick="switchOrdersTab('services')">
                        <i class="fas fa-tools"></i> Servicios
                    </button>
                </div>
                <div id="ordersContent" class="orders-content">
                    ${renderUserOrders()}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Función para cerrar historial de pedidos
function closeUserOrders() {
    const modal = document.querySelector('.user-orders-modal');
    if (modal) {
        modal.remove();
    }
}

// Función para cambiar pestaña de pedidos
function switchOrdersTab(tab) {
    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Actualizar contenido
    const content = document.getElementById('ordersContent');
    if (tab === 'products') {
        content.innerHTML = renderUserOrders();
    } else {
        content.innerHTML = renderUserServices();
    }
}

// Función para renderizar pedidos de productos
function renderUserOrders() {
    if (!currentUser || currentUser.orders.length === 0) {
        return `
            <div class="no-orders">
                <i class="fas fa-shopping-bag"></i>
                <h4>No tienes pedidos aún</h4>
                <p>¡Haz tu primera compra para ver tu historial aquí!</p>
            </div>
        `;
    }
    
    return currentUser.orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <h5>Pedido #${order.id}</h5>
                <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div class="order-products">
                ${order.products.map(product => `
                    <div class="order-product">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-info">
                            <h6>${product.name}</h6>
                            <p>Cantidad: ${product.quantity}</p>
                            <p>Precio: $${product.price}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <strong>Total: $${order.total}</strong>
            </div>
        </div>
    `).join('');
}

// Función para renderizar servicios contratados
function renderUserServices() {
    if (!currentUser || currentUser.services.length === 0) {
        return `
            <div class="no-services">
                <i class="fas fa-tools"></i>
                <h4>No tienes servicios contratados</h4>
                <p>¡Contrata un servicio para ver tu historial aquí!</p>
            </div>
        `;
    }
    
    return currentUser.services.map(service => `
        <div class="service-item">
            <div class="service-header">
                <h5>${service.name}</h5>
                <span class="service-status ${service.status}">${service.status}</span>
            </div>
            <div class="service-info">
                <p><i class="fas fa-calendar"></i> Fecha: ${new Date(service.date).toLocaleDateString()}</p>
                <p><i class="fas fa-dollar-sign"></i> Precio: $${service.price}</p>
                <p><i class="fas fa-info-circle"></i> ${service.description}</p>
            </div>
        </div>
    `).join('');
}

// Función para agregar pedido al historial del usuario
// ===== GUARDAR HISTORIAL DE COMPRA EN SUPABASE =====
async function guardarHistorialCompraSupabase(datosCompra, orderData) {
    try {
        // Obtener cliente de Supabase
        const supabase = window.SUPABASE_CLIENT || (window.supabase && typeof window.supabase.from === 'function' ? window.supabase : null);
        
        if (!supabase || typeof supabase.from !== 'function') {
            console.warn('⚠️ Supabase no disponible, guardando solo en localStorage');
            return;
        }
        
        // Determinar tienda (por ahora usar 'tienda-general' si no hay tienda específica)
        const tiendaId = datosCompra.tiendaId || 'tienda-general';
        const tiendaNombre = datosCompra.tiendaNombre || 'Cresalia';
        
        // Preparar productos para guardar
        const productos = orderData.products || [];
        
        // Guardar cada producto como una compra separada en historial_compras
        for (const producto of productos) {
            const compraData = {
                comprador_email: datosCompra.emailCliente,
                comprador_nombre: datosCompra.nombreCliente,
                tienda_id: tiendaId,
                tienda_nombre: tiendaNombre,
                vendedor_email: datosCompra.vendedorEmail || 'cresalia25@gmail.com',
                producto_nombre: producto.name,
                producto_id: producto.id,
                precio: producto.price,
                cantidad: producto.quantity,
                total_pagado: producto.price * producto.quantity,
                metodo_pago: datosCompra.metodoPago,
                estado: 'completado',
                direccion_entrega: datosCompra.direccionCliente,
                datos_adicionales: {
                    invoiceNumber: orderData.invoiceNumber,
                    deliveryMethod: datosCompra.opcionEntrega,
                    fecha_compra: orderData.date
                }
            };
            
            const { data, error } = await supabase
                .from('historial_compras')
                .insert([compraData])
                .select();
            
            if (error) {
                console.error('❌ Error guardando compra en Supabase:', error);
            } else {
                console.log('✅ Compra guardada en Supabase:', data);
            }
        }
        
        // También guardar en historial_pagos_completo si existe
        const pagoData = {
            tienda_id: tiendaId,
            comprador_email: datosCompra.emailCliente,
            monto: orderData.total,
            moneda: 'ARS',
            tipo_pago: 'compra',
            estado_pago: 'aprobado',
            metodo_pago: datosCompra.metodoPago,
            referencia_pago: orderData.invoiceNumber,
            descripcion: `Compra de ${productos.length} producto(s)`,
            monto_neto: orderData.total,
            datos_adicionales: {
                productos: productos,
                invoiceNumber: orderData.invoiceNumber
            }
        };
        
        const { data: pagoDataResult, error: pagoError } = await supabase
            .from('historial_pagos_completo')
            .insert([pagoData])
            .select();
        
        if (pagoError) {
            console.warn('⚠️ Error guardando pago en historial_pagos_completo (tabla puede no existir):', pagoError);
        } else {
            console.log('✅ Pago guardado en historial_pagos_completo:', pagoDataResult);
        }
        
    } catch (error) {
        console.error('❌ Error en guardarHistorialCompraSupabase:', error);
    }
}

// ===== VERIFICAR SI ES PRIMERA COMPRA =====
async function verificarPrimeraCompra(emailComprador) {
    try {
        const supabase = window.SUPABASE_CLIENT || (window.supabase && typeof window.supabase.from === 'function' ? window.supabase : null);
        
        if (!supabase || typeof supabase.from !== 'function') {
            // Fallback: verificar en localStorage
            const historial = JSON.parse(localStorage.getItem('historial_compras') || '[]');
            return historial.filter(c => c.comprador_email === emailComprador).length === 0;
        }
        
        // Verificar en Supabase
        const { data, error } = await supabase
            .from('historial_compras')
            .select('id')
            .eq('comprador_email', emailComprador)
            .limit(1);
        
        if (error) {
            console.warn('⚠️ Error verificando primera compra:', error);
            return true; // Asumir que es primera compra si hay error
        }
        
        return !data || data.length === 0;
    } catch (error) {
        console.error('❌ Error en verificarPrimeraCompra:', error);
        return true; // Asumir que es primera compra si hay error
    }
}

function addOrderToUserHistory(orderData) {
    if (!currentUser) return;
    
    try {
        // Obtener usuarios actualizados
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            // Agregar pedido al usuario
            users[userIndex].orders.push(orderData);
            
            // Actualizar usuario actual
            currentUser = users[userIndex];
            
            // Guardar cambios
            localStorage.setItem('users', JSON.stringify(users));
            
            console.log('✅ Pedido agregado al historial del usuario:', orderData);
        }
    } catch (error) {
        console.error('❌ Error al agregar pedido al historial:', error);
    }
}

// Función para agregar servicio al historial del usuario
function addServiceToUserHistory(serviceData) {
    if (!currentUser) return;
    
    try {
        // Obtener usuarios actualizados
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            // Agregar servicio al usuario
            users[userIndex].services.push(serviceData);
            
            // Actualizar usuario actual
            currentUser = users[userIndex];
            
            // Guardar cambios
            localStorage.setItem('users', JSON.stringify(users));
            
            console.log('✅ Servicio agregado al historial del usuario:', serviceData);
        }
    } catch (error) {
        console.error('❌ Error al agregar servicio al historial:', error);
    }
}

// ===== EVENTOS DEL SISTEMA DE USUARIOS =====

// Configurar eventos cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay una sesión activa
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            const now = new Date().getTime();
            
            // Verificar si la sesión no ha expirado
            if (now - session.timestamp < USER_CONFIG.sessionTimeout) {
                // Buscar usuario
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.id === session.userId);
                
                if (user) {
                    startUserSession(user);
                } else {
                    localStorage.removeItem('userSession');
                    updateUserInterface(); // Actualizar interfaz si no hay usuario
                }
            } else {
                localStorage.removeItem('userSession');
                updateUserInterface(); // Actualizar interfaz si la sesión expiró
            }
        } catch (error) {
            console.error('Error al cargar sesión:', error);
            localStorage.removeItem('userSession');
            updateUserInterface(); // Actualizar interfaz si hay error
        }
    } else {
        // No hay sesión, actualizar interfaz para mostrar botones de login/signup
        updateUserInterface();
    }
    
    // Configurar eventos de formularios
    setupUserFormEvents();
});

// Configurar eventos de formularios
function setupUserFormEvents() {
    // Formulario de registro
    const registerForm = document.getElementById('registerUserForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUserRegistration();
        });
    }
    
    // Formulario de login
    const loginForm = document.getElementById('loginUserForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUserLogin();
        });
    }
}

// Manejar registro de usuario
function handleUserRegistration() {
    const name = document.getElementById('registerNameModal').value.trim();
            const email = document.getElementById('registerEmailModal').value.trim();
    const phone = document.getElementById('registerPhoneModal').value.trim();
    const password = document.getElementById('registerPasswordModal').value;
    const confirmPassword = document.getElementById('registerConfirmPasswordModal').value;
    
    // Validaciones
    if (!name || !email || !phone || !password || !confirmPassword) {
        mostrarNotificacion('Por favor, completa todos los campos', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        mostrarNotificacion('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (password.length < 6) {
        mostrarNotificacion('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    try {
        // Registrar usuario
        const userData = {
            name,
            email,
            phone,
            password
        };
        
        const newUser = registerUser(userData);
        
        // Iniciar sesión automáticamente
        startUserSession(newUser);
        
        // Limpiar formulario
        document.getElementById('registerUserForm').reset();
        
        mostrarNotificacion('¡Cuenta creada exitosamente!', 'success');
        
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

// Manejar login de usuario
function handleUserLogin() {
            const email = document.getElementById('loginEmailModal').value.trim();
            const password = document.getElementById('loginPasswordModal').value;
    
    // Validaciones
    if (!email || !password) {
        mostrarNotificacion('Por favor, completa todos los campos', 'error');
        return;
    }
    
    try {
        // Intentar login
        const user = loginUser(email, password);
        
        // Iniciar sesión
        startUserSession(user);
        
        // Limpiar formulario
        document.getElementById('loginUserForm').reset();
        
        // Resetear intentos de login
        userLoginAttempts = 0;
        
    } catch (error) {
        userLoginAttempts++;
        mostrarNotificacion(error.message, 'error');
        
        // Bloquear después de muchos intentos
        if (userLoginAttempts >= USER_CONFIG.maxLoginAttempts) {
            mostrarNotificacion('Demasiados intentos fallidos. Intenta más tarde.', 'error');
            document.getElementById('loginPassword').disabled = true;
            setTimeout(() => {
                document.getElementById('loginPassword').disabled = false;
                userLoginAttempts = 0;
            }, 30000); // 30 segundos
        }
    }
}

// ===== INICIALIZACIÓN FINAL =====

// ===== SISTEMA DE SERVICIOS =====

// Configuración de servicios
const SERVICIOS_DATA = {
    'aire-acondicionado': {
        id: 'aire-acondicionado',
        nombre: 'Aire Acondicionado',
        descripcion: 'Servicio y reparación de sistemas de aire acondicionado y calefacción.',
        precio: 25000,
        icono: 'fas fa-snowflake',
        duracion: '2-4 horas',
        incluye: [
            'Recarga de gas refrigerante',
            'Limpieza de filtros',
            'Verificación de compresor',
            'Prueba de temperatura',
            'Mantenimiento preventivo'
        ]
    },
    'transporte': {
        id: 'transporte',
        nombre: 'Transporte Privado',
        descripcion: 'Servicios de traslado local e interprovincial con comodidad y seguridad.',
        precio: 8000,
        icono: 'fas fa-bus',
        duracion: 'Variable',
        incluye: [
            'Traslado local por km',
            'Servicio interprovincial',
            'Seguridad y comodidad',
            'Horarios flexibles',
            'Acompañamiento'
        ]
    },
    'taller': {
        id: 'taller',
        nombre: 'Taller Mecánico',
        descripcion: 'Diagnóstico computarizado, cambio de aceite, alineación y balanceo.',
        precio: 15000,
        icono: 'fas fa-wrench',
        duracion: '1-3 horas',
        incluye: [
            'Diagnóstico computarizado',
            'Cambio de aceite',
            'Alineación y balanceo',
            'Verificación general',
            'Reporte técnico'
        ]
    },
    'lubricentro': {
        id: 'lubricentro',
        nombre: 'Lubricentro',
        descripcion: 'Cambio de aceite express, filtros, limpieza de inyectores.',
        precio: 20000,
        icono: 'fas fa-oil-can',
        duracion: '30-60 minutos',
        incluye: [
            'Cambio de aceite express',
            'Filtros de aceite y aire',
            'Limpieza de inyectores',
            'Verificación de niveles',
            'Limpieza del área'
        ]
    },
    'detailing': {
        id: 'detailing',
        nombre: 'Detailing',
        descripcion: 'Lavado completo, pulido y encerado, limpieza de motor.',
        precio: 30000,
        icono: 'fas fa-spray-can',
        duracion: '2-4 horas',
        incluye: [
            'Lavado completo exterior',
            'Pulido y encerado',
            'Limpieza de motor',
            'Acondicionamiento interior',
            'Tratamiento de plásticos'
        ]
    },
    'gestion': {
        id: 'gestion',
        nombre: 'Gestión',
        descripcion: 'Transferencia de vehículos, renovación de licencias, inscripción.',
        precio: 40000,
        icono: 'fas fa-file-contract',
        duracion: 'Variable',
        incluye: [
            'Transferencia de vehículos',
            'Renovación de licencias',
            'Inscripción de vehículos',
            'Tramitación de documentación',
            'Asesoramiento legal'
        ]
    }
};

// Variables globales del sistema de servicios
let servicioSeleccionado = null;

// ===== FUNCIONES DEL SISTEMA DE SERVICIOS =====

// Función para mostrar modal de servicio
function mostrarModalServicio(servicioId) {
    // Verificar que SERVICIOS_DATA existe y es válido
    if (!SERVICIOS_DATA || typeof SERVICIOS_DATA !== 'object') {
        console.error('SERVICIOS_DATA no está definido o es inválido');
        mostrarNotificacion('Error al cargar los servicios. Inténtalo de nuevo.', 'error');
        return;
    }
    
    // Buscar el servicio por ID en el objeto SERVICIOS_DATA
    const servicio = Object.values(SERVICIOS_DATA).find(s => s && s.id === servicioId);
    if (!servicio) {
        console.error('Servicio no encontrado:', servicioId);
        mostrarNotificacion(`Servicio "${servicioId}" no encontrado. Inténtalo de nuevo.`, 'error');
        return;
    }
    
    servicioSeleccionado = servicio;
    
    // Actualizar título del modal
    document.getElementById('modalServicioTitulo').innerHTML = `
        <i class="${servicio.icono}"></i> ${servicio.nombre}
    `;
    
    // Actualizar resumen del servicio
    actualizarResumenServicio(servicio);
    
    // Prellenar datos si el usuario está logueado
    if (currentUser) {
        document.getElementById('servicioCliente').value = currentUser.name;
        document.getElementById('servicioEmail').value = currentUser.email;
        document.getElementById('servicioTelefono').value = currentUser.phone;
    }
    
    // Mostrar modal
    document.getElementById('modalServicio').style.display = 'flex';
    
    console.log('🔧 Modal de servicio abierto:', servicio.nombre);
}

// Función para cerrar modal de servicio
function cerrarModalServicio() {
    document.getElementById('modalServicio').style.display = 'none';
    servicioSeleccionado = null;
    
    // Limpiar formulario
    document.getElementById('formContratarServicio').reset();
    
    console.log('🔧 Modal de servicio cerrado');
}

// Función para actualizar resumen del servicio
function actualizarResumenServicio(servicio) {
    const resumen = document.getElementById('servicioResumen');
    
    // Verificar que servicio.incluye sea un array válido
    const serviciosIncluidos = Array.isArray(servicio.incluye) ? servicio.incluye : [];
    
    resumen.innerHTML = `
        <div class="resumen-item">
            <span>Servicio:</span>
            <span>${servicio.nombre || 'N/A'}</span>
        </div>
        <div class="resumen-item">
            <span>Precio:</span>
            <span>$${(servicio.precio || 0).toLocaleString('es-AR')}</span>
        </div>
        <div class="resumen-item">
            <span>Duración estimada:</span>
            <span>${servicio.duracion || 'Variable'}</span>
        </div>
        <div class="resumen-item">
            <span>Incluye:</span>
            <span></span>
        </div>
        <ul style="margin: 10px 0; padding-left: 20px; color: var(--gray-600);">
            ${serviciosIncluidos.length > 0 
                ? serviciosIncluidos.map(item => `<li>${item}</li>`).join('')
                : '<li>Servicios básicos incluidos</li>'
            }
        </ul>
    `;
}

// Función para procesar contratación de servicio
function procesarContratacionServicio(formData) {
    try {
        // Crear objeto del servicio contratado
        const servicioContratado = {
            id: 'SVC-' + Date.now(),
            servicioId: servicioSeleccionado.id,
            nombre: servicioSeleccionado.nombre,
            precio: servicioSeleccionado.precio,
            descripcion: servicioSeleccionado.descripcion,
            duracion: servicioSeleccionado.duracion,
            incluye: servicioSeleccionado.incluye,
            cliente: formData.get('servicioCliente'),
            telefono: formData.get('servicioTelefono'),
            email: formData.get('servicioEmail'),
            vehiculo: formData.get('servicioVehiculo'),
            descripcionProblema: formData.get('servicioDescripcion'),
            fecha: formData.get('servicioFecha'),
            hora: formData.get('servicioHora'),
            urgencia: formData.get('servicioUrgencia'),
            fechaContratacion: new Date().toISOString(),
            estado: 'pendiente',
            status: 'pendiente'
        };
        
        // Guardar en localStorage
        guardarServicioContratado(servicioContratado);
        
        // Agregar al historial del usuario si está logueado
        if (currentUser) {
            addServiceToUserHistory(servicioContratado);
        }
        
        // Generar comprobante de reserva
        const comprobante = generarComprobanteReserva(servicioContratado);
        
        // Crear ticket automático
        crearTicketServicio(servicioContratado);
        
        // Cerrar modal
        cerrarModalServicio();
        
        // Mostrar notificación de éxito
        mostrarNotificacion(`✅ Servicio "${servicioSeleccionado.nombre}" contratado exitosamente. Te contactaremos pronto.`, 'success');
        
        // Descargar comprobante automáticamente
        setTimeout(() => {
            descargarComprobante(comprobante);
        }, 1000);
        
        console.log('✅ Servicio contratado:', servicioContratado);
        
    } catch (error) {
        console.error('❌ Error al procesar contratación:', error);
        mostrarNotificacion('❌ Error al procesar la contratación. Intenta nuevamente.', 'error');
    }
}

// Función para guardar servicio contratado
function guardarServicioContratado(servicio) {
    try {
        // Obtener servicios existentes
        const servicios = JSON.parse(localStorage.getItem('serviciosContratados') || '[]');
        
        // Agregar nuevo servicio
        servicios.push(servicio);
        
        // Guardar en localStorage
        localStorage.setItem('serviciosContratados', JSON.stringify(servicios));
        
        console.log('✅ Servicio guardado en localStorage');
        
    } catch (error) {
        console.error('❌ Error al guardar servicio:', error);
        throw error;
    }
}

// Función para generar comprobante de reserva
function generarComprobanteReserva(servicio) {
    const numeroComprobante = generarNumeroComprobante();
    const fechaActual = new Date().toLocaleDateString('es-AR');
    const horaActual = new Date().toLocaleTimeString('es-AR');
    
    const comprobanteHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Comprobante de Reserva - Cresalia</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    background: #f5f5f5; 
                }
                .comprobante { 
                    background: white; 
                    max-width: 800px; 
                    margin: 0 auto; 
                    padding: 30px; 
                    border-radius: 10px; 
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
                    position: relative; 
                }
                .watermark { 
                    position: absolute; 
                    top: 50%; 
                    left: 50%; 
                    transform: translate(-50%, -50%) rotate(-45deg); 
                    font-size: 8rem; 
                    color: rgba(37, 99, 235, 0.1); 
                    font-weight: bold; 
                    pointer-events: none; 
                    z-index: 1; 
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 30px; 
                    position: relative; 
                    z-index: 2; 
                }
                .logo { 
                    max-width: 120px; 
                    margin-bottom: 15px; 
                }
                .title { 
                    color: #2563eb; 
                    font-size: 2rem; 
                    font-weight: bold; 
                    margin-bottom: 10px; 
                }
                .subtitle { 
                    color: #6b7280; 
                    font-size: 1.1rem; 
                }
                .comprobante-info { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 20px; 
                    margin-bottom: 30px; 
                    position: relative; 
                    z-index: 2; 
                }
                .info-section { 
                    background: #f8fafc; 
                    padding: 20px; 
                    border-radius: 10px; 
                    border-left: 4px solid #2563eb; 
                }
                .info-section h3 { 
                    color: #2563eb; 
                    margin-bottom: 15px; 
                    font-size: 1.2rem; 
                }
                .info-item { 
                    display: flex; 
                    justify-content: space-between; 
                    margin-bottom: 8px; 
                    padding: 5px 0; 
                }
                .info-label { 
                    font-weight: 600; 
                    color: #374151; 
                }
                .info-value { 
                    color: #6b7280; 
                }
                .servicio-details { 
                    background: #f0f9ff; 
                    padding: 20px; 
                    border-radius: 10px; 
                    margin-bottom: 30px; 
                    position: relative; 
                    z-index: 2; 
                }
                .servicio-details h3 { 
                    color: #2563eb; 
                    margin-bottom: 15px; 
                    font-size: 1.3rem; 
                }
                .servicio-item { 
                    display: flex; 
                    justify-content: space-between; 
                    margin-bottom: 10px; 
                    padding: 8px 0; 
                    border-bottom: 1px solid #e5e7eb; 
                }
                .servicio-item:last-child { 
                    border-bottom: none; 
                }
                .servicio-label { 
                    font-weight: 600; 
                    color: #374151; 
                }
                .servicio-value { 
                    color: #6b7280; 
                }
                .footer { 
                    text-align: center; 
                    margin-top: 30px; 
                    padding-top: 20px; 
                    border-top: 2px solid #e5e7eb; 
                    position: relative; 
                    z-index: 2; 
                }
                .footer p { 
                    color: #6b7280; 
                    margin-bottom: 5px; 
                }
                .footer strong { 
                    color: #2563eb; 
                }
                .qr-code { 
                    text-align: center; 
                    margin: 20px 0; 
                    position: relative; 
                    z-index: 2; 
                }
                .qr-placeholder { 
                    width: 100px; 
                    height: 100px; 
                    background: #f3f4f6; 
                    border: 2px dashed #d1d5db; 
                    display: inline-flex; 
                    align-items: center; 
                    justify-content: center; 
                    border-radius: 10px; 
                    color: #9ca3af; 
                    font-size: 0.8rem; 
                }
                @media print {
                    body { background: white; }
                    .comprobante { box-shadow: none; }
                }
            </style>
        </head>
        <body>
            <div class="watermark">CRESALIA</div>
            <div class="comprobante">
                <div class="header">
                    <img src="assets/logo/logo-cresalia.png" alt="Cresalia" class="logo">
                    <h1 class="title">COMPROBANTE DE RESERVA</h1>
                    <p class="subtitle">Servicio Automotriz Profesional</p>
                </div>
                
                <div class="comprobante-info">
                    <div class="info-section">
                        <h3>Información del Cliente</h3>
                        <div class="info-item">
                            <span class="info-label">Nombre:</span>
                            <span class="info-value">${servicio.cliente}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Teléfono:</span>
                            <span class="info-value">${servicio.telefono}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email:</span>
                            <span class="info-value">${servicio.email}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Vehículo:</span>
                            <span class="info-value">${servicio.vehiculo}</span>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3>Información de la Reserva</h3>
                        <div class="info-item">
                            <span class="info-label">N° Comprobante:</span>
                            <span class="info-value">${numeroComprobante}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Fecha de Reserva:</span>
                            <span class="info-value">${fechaActual}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Hora de Reserva:</span>
                            <span class="info-value">${horaActual}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Estado:</span>
                            <span class="info-value" style="color: #059669; font-weight: 600;">CONFIRMADO</span>
                        </div>
                    </div>
                </div>
                
                <div class="servicio-details">
                    <h3>Detalles del Servicio</h3>
                    <div class="servicio-item">
                        <span class="servicio-label">Servicio:</span>
                        <span class="servicio-value">${servicio.nombre}</span>
                    </div>
                    <div class="servicio-item">
                        <span class="servicio-label">Precio:</span>
                        <span class="servicio-value">$${servicio.precio.toLocaleString('es-AR')}</span>
                    </div>
                    <div class="servicio-item">
                        <span class="servicio-label">Duración estimada:</span>
                        <span class="servicio-value">${servicio.duracion}</span>
                    </div>
                    <div class="servicio-item">
                        <span class="servicio-label">Fecha programada:</span>
                        <span class="servicio-value">${servicio.fecha}</span>
                    </div>
                    <div class="servicio-item">
                        <span class="servicio-label">Hora programada:</span>
                        <span class="servicio-value">${servicio.hora}</span>
                    </div>
                    <div class="servicio-item">
                        <span class="servicio-label">Nivel de urgencia:</span>
                        <span class="servicio-value">${servicio.urgencia.toUpperCase()}</span>
                    </div>
                </div>
                
                <div class="qr-code">
                    <div class="qr-placeholder">
                        QR<br>Code
                    </div>
                    <p style="color: #6b7280; font-size: 0.9rem;">Escanea para verificar</p>
                </div>
                
                <div class="footer">
                    <p><strong>Cresalia</strong> - Buenos Aires, Argentina</p>
                    <p>Tel: +54 11 XXXX-XXXX | Email: hola@cresalia.com</p>
                    <p>Horarios: Lunes a Viernes 8:00 - 12:00 y 16:00 - 20:00</p>
                    <p style="margin-top: 15px; font-size: 0.9rem; color: #9ca3af;">
                        Este comprobante confirma tu reserva. Presenta este documento al llegar.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    // Guardar comprobante para uso posterior
    window.comprobanteActual = {
        html: comprobanteHTML,
        datos: servicio,
        numero: numeroComprobante
    };
    
    return comprobanteHTML;
}

// Función para generar número de comprobante
function generarNumeroComprobante() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RES-${año}${mes}${dia}-${random}`;
}

// Función para descargar comprobante
function descargarComprobante(html) {
    try {
        console.log('Descargando comprobante...');
        
        // Crear una nueva ventana
        const ventana = window.open('', '_blank', 'width=800,height=1000,scrollbars=yes,resizable=yes');
        
        if (ventana) {
            // Escribir el contenido HTML en la nueva ventana
            ventana.document.write(html);
            ventana.document.close();
            
            // Esperar un momento para que se cargue el contenido
            setTimeout(() => {
                ventana.print();
                mostrarNotificacion('✅ Comprobante descargado correctamente');
            }, 500);
        } else {
            console.error('No se pudo abrir la ventana de impresión');
            mostrarNotificacion('❌ Error al descargar el comprobante');
        }
    } catch (error) {
        console.error('Error al descargar comprobante:', error);
        mostrarNotificacion('❌ Error al descargar el comprobante');
    }
}

// Función para crear ticket automático del servicio
function crearTicketServicio(servicio) {
    try {
        const ticket = {
            id: 'TKT-SVC-' + Date.now(),
            fecha: new Date().toISOString(),
            hora: new Date().toLocaleTimeString('es-AR'),
            cliente: servicio.cliente,
            email: servicio.email,
            telefono: servicio.telefono,
            asunto: `Servicio: ${servicio.nombre}`,
            mensaje: `Servicio contratado: ${servicio.nombre}\n\nVehículo: ${servicio.vehiculo}\nDescripción: ${servicio.descripcionProblema}\nFecha: ${servicio.fecha} a las ${servicio.hora}\nUrgencia: ${servicio.urgencia}\nPrecio: $${servicio.precio.toLocaleString('es-AR')}`,
            categoria: 'servicio',
            prioridad: servicio.urgencia === 'muy_urgente' ? 'alta' : servicio.urgencia === 'urgente' ? 'media' : 'baja',
            estado: 'pendiente',
            fuente: 'contratacion_servicio',
            atendidoPor: null,
            respuestas: [],
            tiempoResolucion: null,
            servicioId: servicio.id
        };
        
        // Guardar ticket
        guardarTicket(ticket);
        
        console.log('✅ Ticket de servicio creado:', ticket);
        
    } catch (error) {
        console.error('❌ Error al crear ticket de servicio:', error);
    }
}

// Función para obtener servicios contratados
function obtenerServiciosContratados() {
    try {
        return JSON.parse(localStorage.getItem('serviciosContratados') || '[]');
    } catch (error) {
        console.error('❌ Error al obtener servicios:', error);
        return [];
    }
}

// Función para actualizar estado de servicio
function actualizarEstadoServicio(servicioId, nuevoEstado) {
    try {
        const servicios = obtenerServiciosContratados();
        const servicioIndex = servicios.findIndex(s => s.id === servicioId);
        
        if (servicioIndex !== -1) {
            servicios[servicioIndex].estado = nuevoEstado;
            servicios[servicioIndex].status = nuevoEstado;
            localStorage.setItem('serviciosContratados', JSON.stringify(servicios));
            
            console.log('✅ Estado de servicio actualizado:', servicioId, nuevoEstado);
        }
        
    } catch (error) {
        console.error('❌ Error al actualizar estado de servicio:', error);
    }
}

// ===== FUNCIONES DE PRODUCTOS =====

// Función para mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'info') {
    console.log('🔔 Notificación:', mensaje, tipo);
    
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${mensaje}</span>
    `;
    
    // Agregar al body
    document.body.appendChild(notificacion);
    
    // Mostrar con animación
    setTimeout(() => notificacion.classList.add('mostrar'), 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => document.body.removeChild(notificacion), 300);
    }, 5000);
}

// Función para renderizar productos
function renderizarProductos(productos) {
    const productosGrid = document.getElementById('productosGrid');
    if (!productosGrid) return;
    
    productosGrid.innerHTML = '';
    
    productos.forEach(producto => {
        const stockClass = producto.stock === 0 ? 'sin-stock' : producto.stock <= 5 ? 'bajo' : '';
        const stockText = producto.stock === 0 ? 'Sin stock' : producto.stock <= 5 ? `Solo ${producto.stock} disponibles` : `${producto.stock} disponibles`;
        
        const productoCard = document.createElement('div');
        productoCard.className = 'producto-card';
        productoCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <div class="producto-info">
                <span class="producto-categoria">${producto.categoria}</span>
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <div class="producto-marca">Marca: ${producto.marca}</div>
                <div class="producto-precio">$${producto.precio.toLocaleString('es-AR')}</div>
                <div class="producto-stock ${stockClass}">
                    <i class="fas fa-box"></i> ${stockText}
                </div>
                <div class="producto-acciones">
                    <div class="cantidad-input">
                        <button onclick="cambiarCantidadProducto(${producto.id}, -1)">-</button>
                        <input type="number" id="cantidad-${producto.id}" value="1" min="1" max="${producto.stock}">
                        <button onclick="cambiarCantidadProducto(${producto.id}, 1)">+</button>
                    </div>
                    <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id})" ${producto.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> Agregar al Carrito
                    </button>
                    <button class="btn-pagar-ahora" onclick="pagarProducto(${producto.id})" ${producto.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-credit-card"></i> Pagar Ahora
                    </button>
                </div>
            </div>
        `;
        
        productosGrid.appendChild(productoCard);
    });
}

// Función duplicada eliminada - usar la primera definición

// Función duplicada eliminada - usar la primera definición

// ===== FUNCIONES DEL CARRITO =====

// Función para actualizar carrito
function actualizarCarrito() {
    const carritoCount = document.getElementById('carritoCount');
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    if (carritoCount) {
        carritoCount.textContent = totalItems;
        carritoCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
    
    console.log('🛒 Carrito actualizado:', carrito);
}

// Función para mostrar carrito
function mostrarCarrito() {
    const modal = document.getElementById('cartContainer');
    if (!modal) {
        console.error('No se encontró el modal del carrito');
        return;
    }
    
    const carritoContent = document.getElementById('cartItems');
    if (!carritoContent) {
        console.error('No se encontró el contenedor de items del carrito');
        return;
    }
    
    if (carrito.length === 0) {
        carritoContent.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos para comenzar</p>
            </div>
        `;
    } else {
        let carritoHTML = '<div class="cart-items">';
        
        carrito.forEach(item => {
            carritoHTML += `
                <div class="cart-item">
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.nombre}</div>
                        <div class="cart-item-price">$${item.precio.toLocaleString('es-AR')}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button class="quantity-btn" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    </div>
                    <div class="cart-item-total">$${(item.precio * item.cantidad).toLocaleString('es-AR')}</div>
                    <button class="cart-remove" onclick="removerDelCarrito(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        
        carritoHTML += `
            </div>
            <div class="cart-total">
                <h4>Total: $${total.toLocaleString('es-AR')}</h4>
            </div>
            <div class="cart-actions">
                <button class="cart-btn clear" onclick="limpiarCarrito()">
                    <i class="fas fa-trash"></i> Limpiar
                </button>
                <button class="cart-btn checkout" onclick="pagarCarrito()">
                    <i class="fas fa-credit-card"></i> Pagar
                </button>
            </div>
        `;
        
        carritoContent.innerHTML = carritoHTML;
    }
    
    modal.style.display = 'flex';
    console.log('🛒 Carrito mostrado');
}

// Función para cerrar carrito
function cerrarCarrito() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('active');
    }
}

// Función para cambiar cantidad en carrito
function cambiarCantidadCarrito(productoId, cambio) {
    const item = carrito.find(item => item.id === productoId);
    if (!item) return;
    
    const nuevaCantidad = item.cantidad + cambio;
    
    if (nuevaCantidad <= 0) {
        removerDelCarrito(productoId);
    } else if (nuevaCantidad <= item.stock) {
        item.cantidad = nuevaCantidad;
        actualizarCarrito();
    } else {
        mostrarNotificacion('No hay suficiente stock disponible', 'error');
    }
}

// Función para remover del carrito
function removerDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    actualizarCarrito();
    mostrarNotificacion('Producto removido del carrito', 'info');
}

// Función para limpiar carrito
function limpiarCarrito() {
    carrito = [];
    actualizarCarrito();
    mostrarNotificacion('Carrito limpiado', 'info');
}

// Función para pagar carrito
function pagarCarrito() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'error');
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    // Guardar datos del carrito para la factura
    window.carritoActual = [...carrito];
    window.totalCarrito = total;
    window.esCompraCarrito = true; // Flag to indicate cart purchase
    
    mostrarModalPagoCarrito(carrito, total);
}

// Función para cambiar cantidad de producto
function cambiarCantidad(productoId, cambio) {
    const input = document.getElementById(`cantidad-${productoId}`);
    if (!input) return;
    
    const nuevaCantidad = parseInt(input.value) + cambio;
    const producto = PRODUCTOS_DATA.find(p => p.id === productoId);
    
    if (nuevaCantidad >= 1 && nuevaCantidad <= producto.stock) {
        input.value = nuevaCantidad;
    }
}

// ===== SISTEMA DE SERVICIOS =====

// Función para renderizar servicios
function renderizarServicios(servicios) {
    const container = document.getElementById('serviciosGrid');
    if (!container) {
        console.error('No se encontró el contenedor de servicios');
        return;
    }
    
    // Verificar que servicios sea válido
    if (!servicios || typeof servicios !== 'object') {
        console.error('Datos de servicios inválidos:', servicios);
        return;
    }
    
    // Convertir el objeto de servicios a array usando las claves
    const serviciosArray = Object.keys(servicios).map(key => servicios[key]);
    
    container.innerHTML = serviciosArray.map(servicio => {
        // Verificar que el servicio tenga todas las propiedades necesarias
        if (!servicio || !servicio.nombre || !servicio.descripcion || !servicio.precio) {
            console.error('Servicio inválido:', servicio);
            return '';
        }
        
        // Verificar que servicio.incluye sea un array válido
        const serviciosIncluidos = Array.isArray(servicio.incluye) ? servicio.incluye.length : 0;
        
        return `
            <div class="servicio-card">
                <div class="servicio-icon">
                    <i class="${servicio.icono || 'fas fa-cog'}"></i>
                </div>
                <div class="servicio-info">
                    <h3 class="servicio-nombre">${servicio.nombre}</h3>
                    <p class="servicio-descripcion">${servicio.descripcion}</p>
                    <div class="servicio-precio">$${servicio.precio.toLocaleString()}</div>
                    <div class="servicio-detalles">
                        <span><i class="fas fa-clock"></i> ${servicio.duracion || 'Variable'}</span>
                        <span><i class="fas fa-list"></i> ${serviciosIncluidos} servicios incluidos</span>
                    </div>
                    <button onclick="mostrarModalServicio('${servicio.id}')" class="btn-servicio">
                        <i class="fas fa-calendar-check"></i> Reservar Servicio
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ===== INICIALIZACIÓN FINAL =====

// ===== GOOGLE MAPS FUNCTIONS =====
let mapaAUTO = null;
let marcadorAUTO = null;

// Coordenadas de AUTO-EJEMPLO (Ciudad Ejemplo, Argentina)
const AUTO_COORDS = {
    lat: -34.6037,
    lng: -58.3816
};

// Función para inicializar el mapa
function inicializarMapa() {
    const mapaContainer = document.getElementById('mapa-cresalia');
    if (!mapaContainer) {
        console.log('Contenedor del mapa no encontrado');
        return;
    }
    
    // Verificar si Google Maps está cargado
    if (typeof google === 'undefined' || !google.maps) {
        console.log('Google Maps no está cargado aún, reintentando en 2 segundos...');
        setTimeout(inicializarMapa, 2000);
        return;
    }
    
    // Verificar que las librerías necesarias estén disponibles
    if (!google.maps.Map || !google.maps.Marker || !google.maps.InfoWindow) {
        console.log('Librerías de Google Maps no están completamente cargadas, reintentando...');
        setTimeout(inicializarMapa, 2000);
        return;
    }
    
    // Crear el mapa
    mapaCRESALIA = new google.maps.Map(mapaContainer, {
        center: CRESALIA_COORDS,
        zoom: 15,
        styles: [
            {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#c9d6e6' }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#757575' }]
            }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
    });
    
    // Crear el marcador personalizado con manejo de errores
    try {
        marcadorCRESALIA = new google.maps.Marker({
            position: CRESALIA_COORDS,
            map: mapaCRESALIA,
            title: 'CRESALIA - Plataforma SaaS E-commerce',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#2563eb" stroke="#ffffff" stroke-width="2"/>
                        <circle cx="20" cy="20" r="8" fill="#ffffff"/>
                        <text x="20" y="25" text-anchor="middle" fill="#2563eb" font-family="Arial" font-size="12" font-weight="bold">F</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 20)
            },
            animation: google.maps.Animation.DROP
        });
    } catch (error) {
        console.error('Error creando marcador del mapa:', error);
        // Crear marcador simple sin icono personalizado
        marcadorCRESALIA = new google.maps.Marker({
            position: CRESALIA_COORDS,
            map: mapaCRESALIA,
            title: 'FRIOCAS - Productos y Servicios Automotrices'
        });
    }
    
    // Crear la ventana de información con manejo de errores
    let infoWindow;
    try {
        infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; max-width: 250px;">
                    <h3 style="color: #2563eb; margin: 0 0 10px 0; font-size: 16px;">
                        <i class="fas fa-store" style="color: #8b5cf6;"></i> CRESALIA
                    </h3>
                    <p style="margin: 5px 0; color: #475569;">
                        <strong>Productos y Servicios Automotrices</strong>
                    </p>
                    <p style="margin: 5px 0; color: #64748b;">
                        <i class="fas fa-map-marker-alt" style="color: #ef4444;"></i> Corrientes, Argentina
                    </p>
                    <p style="margin: 5px 0; color: #64748b;">
                        <i class="fas fa-phone" style="color: #10b981;"></i> +5493795015712
                    </p>
                    <div style="margin-top: 10px;">
                        <button onclick="obtenerRuta()" style="background: #2563eb; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-route"></i> Obtener Ruta
                        </button>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('Error creando ventana de información:', error);
        infoWindow = null;
    }
    
    // Mostrar info window al hacer clic en el marcador
    if (infoWindow && marcadorCRESALIA) {
        marcadorCRESALIA.addListener('click', () => {
            infoWindow.open(mapaCRESALIA, marcadorCRESALIA);
        });
        
        // Mostrar info window automáticamente después de 2 segundos
        setTimeout(() => {
            infoWindow.open(mapaCRESALIA, marcadorCRESALIA);
        }, 2000);
    }
    
    console.log('Mapa de CRESALIA inicializado correctamente');
}

// Función para obtener ruta
function obtenerRuta() {
    if (navigator.geolocation) {
        // Mostrar notificación de carga
        mostrarNotificacion('Obteniendo tu ubicación...', 'info');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // Crear URL de Google Maps con ruta
                const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${CRESALIA_COORDS.lat},${CRESALIA_COORDS.lng}`;
                
                // Abrir en nueva pestaña
                window.open(url, '_blank');
                
                mostrarNotificacion('Ruta abierta en Google Maps', 'success');
            },
            (error) => {
                console.error('Error obteniendo ubicación:', error);
                
                // Si no se puede obtener la ubicación, abrir mapa centrado en CRESALIA
                const url = `https://www.google.com/maps/search/?api=1&query=${CRESALIA_COORDS.lat},${CRESALIA_COORDS.lng}`;
                window.open(url, '_blank');
                
                mostrarNotificacion('Mapa de CRESALIA abierto', 'info');
            }
        );
    } else {
        // Fallback para navegadores que no soportan geolocalización
        const url = `https://www.google.com/maps/search/?api=1&query=${CRESALIA_COORDS.lat},${CRESALIA_COORDS.lng}`;
        window.open(url, '_blank');
        
        mostrarNotificacion('Mapa de CRESALIA abierto', 'info');
    }
}

// Función para centrar el mapa en CRESALIA
function centrarMapaCRESALIA() {
    if (mapaCRESALIA) {
        mapaCRESALIA.setCenter(CRESALIA_COORDS);
        mapaCRESALIA.setZoom(15);
    }
}

// Función para animar el marcador
function animarMarcador() {
    if (marcadorCRESALIA) {
        marcadorCRESALIA.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
            marcadorCRESALIA.setAnimation(null);
        }, 1500);
    }
}

// ===== MERCADO PAGO INTEGRATION =====
let mercadopago = null;

// Configuración de Mercado Pago (REEMPLAZAR CON TUS CREDENCIALES REALES)
const MERCADO_PAGO_RUNTIME_CONFIG = (() => {
    if (typeof window !== 'undefined' && window.MERCADO_PAGO_CONFIG) {
        return window.MERCADO_PAGO_CONFIG;
    }

    // ⚠️ SEGURIDAD: NUNCA hardcodees credenciales reales aquí
    // Usá solo variables de entorno o placeholders
    const defaults = {
        publicKey: window.__MERCADOPAGO_PUBLIC_KEY__ || window.MERCADOPAGO_PUBLIC_KEY || 'CONFIGURAR_EN_VERCEL',
        accessToken: window.__MERCADOPAGO_ACCESS_TOKEN__ || window.MERCADOPAGO_ACCESS_TOKEN || 'CONFIGURAR_EN_VERCEL',
        preferenceId: null
    };

    if (typeof window !== 'undefined') {
        window.MERCADO_PAGO_CONFIG = defaults;
    }

    return defaults;
})();

// Inicializar Mercado Pago
function inicializarMercadoPago() {
    try {
        // Verificar si estamos ejecutando localmente
        if (window.location.protocol === 'file:') {
            console.log('⚠️ Mercado Pago desactivado - Ejecutando localmente');
            console.log('💡 Para usar Mercado Pago, necesitas un servidor web y credenciales reales');
            return false;
        }
        
        if (typeof MercadoPago !== 'undefined') {
            mercadopago = new MercadoPago(MERCADO_PAGO_RUNTIME_CONFIG.publicKey);
            console.log('Mercado Pago inicializado correctamente');
            return true;
        } else {
            console.log('Mercado Pago SDK no está cargado aún, reintentando...');
            setTimeout(inicializarMercadoPago, 1000);
            return false;
        }
    } catch (error) {
        console.error('Error inicializando Mercado Pago:', error);
        return false;
    }
}

// Crear preferencia de pago para un producto
async function crearPreferenciaProducto(producto, cantidad = 1) {
    try {
        if (!mercadopago) {
            throw new Error('Mercado Pago no está inicializado');
        }

        const preference = {
            items: [
                {
                    id: producto.id,
                    title: producto.nombre,
                    description: producto.descripcion,
                    picture_url: producto.imagen || 'https://friocas.com/assets/logo/logo-friocas.png',
                    category_id: 'auto_parts',
                    quantity: cantidad,
                    unit_price: producto.precio
                }
            ],
            payer: {
                name: document.getElementById('nombreCliente')?.value || 'Cliente CRESALIA',
                email: document.getElementById('emailCliente')?.value || 'cliente@friocas.com',
                phone: {
                    number: document.getElementById('telefonoCliente')?.value || '+5493795015712'
                }
            },
            back_urls: {
                success: window.location.origin + '/success.html',
                failure: window.location.origin + '/failure.html',
                pending: window.location.origin + '/pending.html'
            },
            auto_return: 'approved',
            external_reference: `CRESALIA_${producto.id}_${Date.now()}`,
            notification_url: window.location.origin + '/webhook-mercadopago',
            expires: true,
            expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
        };

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MERCADO_PAGO_RUNTIME_CONFIG.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preference)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        MERCADO_PAGO_RUNTIME_CONFIG.preferenceId = data.id;
        
        console.log('Preferencia de pago creada:', data.id);
        return data.id;

    } catch (error) {
        console.error('Error creando preferencia de pago:', error);
        
        // Manejo específico para errores de Mercado Pago
        if (error.message.includes('404') || error.message.includes('Not Found')) {
            console.log('⚠️ Error 404 de Mercado Pago - Verificar credenciales y configuración');
            mostrarNotificacion('Error de configuración de pagos. Contacta al administrador.', 'error');
        } else if (window.location.protocol === 'file:') {
            console.log('⚠️ Ejecutando localmente - Mercado Pago requiere un servidor web');
            mostrarNotificacion('Los pagos no están disponibles en modo local. Usa un servidor web.', 'warning');
        } else {
            mostrarNotificacion('Error al procesar el pago. Inténtalo de nuevo.', 'error');
        }
        return null;
    }
}

// Crear preferencia de pago para el carrito
async function crearPreferenciaCarrito(productos) {
    try {
        if (!mercadopago) {
            throw new Error('Mercado Pago no está inicializado');
        }

        const items = productos.map(item => ({
            id: item.id,
            title: item.nombre,
            description: item.descripcion,
            picture_url: item.imagen || 'https://friocas.com/assets/logo/logo-friocas.png',
            category_id: 'auto_parts',
            quantity: item.cantidad,
            unit_price: item.precio
        }));

        const total = productos.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

        const preference = {
            items: items,
            payer: {
                name: document.getElementById('nombreCliente')?.value || 'Cliente CRESALIA',
                email: document.getElementById('emailCliente')?.value || 'cliente@friocas.com',
                phone: {
                    number: document.getElementById('telefonoCliente')?.value || '+5493795015712'
                }
            },
            back_urls: {
                success: window.location.origin + '/success.html',
                failure: window.location.origin + '/failure.html',
                pending: window.location.origin + '/pending.html'
            },
            auto_return: 'approved',
            external_reference: `CRESALIA_CARRITO_${Date.now()}`,
            notification_url: window.location.origin + '/webhook-mercadopago',
            expires: true,
            expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        };

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MERCADO_PAGO_RUNTIME_CONFIG.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preference)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        MERCADO_PAGO_RUNTIME_CONFIG.preferenceId = data.id;
        
        console.log('Preferencia de carrito creada:', data.id);
        return data.id;

    } catch (error) {
        console.error('Error creando preferencia de carrito:', error);
        mostrarNotificacion('Error al procesar el carrito. Inténtalo de nuevo.', 'error');
        return null;
    }
}

// Función para procesar pago con Mercado Pago
async function procesarPagoMercadoPago(producto, cantidad = 1) {
    try {
        mostrarNotificacion('Procesando pago con Mercado Pago...', 'info');
        
        const preferenceId = await crearPreferenciaProducto(producto, cantidad);
        
        if (preferenceId) {
            // Abrir checkout de Mercado Pago
            mercadopago.checkout({
                preference: {
                    id: preferenceId
                },
                render: {
                    container: '.cho-container',
                    label: 'Pagar con Mercado Pago'
                }
            });
            
            mostrarNotificacion('Redirigiendo a Mercado Pago...', 'success');
        }
    } catch (error) {
        console.error('Error procesando pago:', error);
        mostrarNotificacion('Error al procesar el pago. Inténtalo de nuevo.', 'error');
    }
}

// Función para procesar pago del carrito con Mercado Pago
async function procesarCarritoMercadoPago() {
    try {
        if (carrito.length === 0) {
            mostrarNotificacion('El carrito está vacío', 'error');
            return;
        }

        mostrarNotificacion('Procesando carrito con Mercado Pago...', 'info');
        
        const preferenceId = await crearPreferenciaCarrito(carrito);
        
        if (preferenceId) {
            // Abrir checkout de Mercado Pago
            mercadopago.checkout({
                preference: {
                    id: preferenceId
                },
                render: {
                    container: '.cho-container',
                    label: 'Pagar Carrito con Mercado Pago'
                }
            });
            
            mostrarNotificacion('Redirigiendo a Mercado Pago...', 'success');
        }
    } catch (error) {
        console.error('Error procesando carrito:', error);
        mostrarNotificacion('Error al procesar el carrito. Inténtalo de nuevo.', 'error');
    }
}

// Función para manejar respuesta de pago
function manejarRespuestaPago(status, paymentId) {
    switch (status) {
        case 'approved':
            mostrarNotificacion('¡Pago aprobado! Procesando tu pedido...', 'success');
            // Aquí puedes agregar lógica para actualizar inventario, enviar emails, etc.
            setTimeout(() => {
                generarFacturaMercadoPago(paymentId);
            }, 2000);
            break;
            
        case 'pending':
            mostrarNotificacion('Pago pendiente. Te notificaremos cuando se confirme.', 'warning');
            break;
            
        case 'rejected':
            mostrarNotificacion('Pago rechazado. Inténtalo de nuevo.', 'error');
            break;
            
        default:
            mostrarNotificacion('Estado de pago desconocido.', 'info');
    }
}

// Función para generar factura después del pago exitoso
async function generarFacturaMercadoPago(paymentId) {
    try {
        // Obtener detalles del pago
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${MERCADO_PAGO_RUNTIME_CONFIG.accessToken}`
            }
        });

        if (response.ok) {
            const paymentData = await response.json();
            
            // Generar factura con datos reales de Mercado Pago
            const facturaData = {
                numero: `CRESALIA-${paymentId}`,
                fecha: new Date().toLocaleDateString('es-AR'),
                cliente: paymentData.payer.name,
                email: paymentData.payer.email,
                items: paymentData.additional_info.items,
                total: paymentData.transaction_amount,
                metodoPago: paymentData.payment_method.type,
                estado: paymentData.status
            };
            
            // Generar y descargar factura
            generarFactura(facturaData);
            
            // Limpiar carrito si es necesario
            if (window.esCompraCarrito) {
                limpiarCarrito();
            }
            
            mostrarNotificacion('Factura generada y descargada automáticamente', 'success');
        }
    } catch (error) {
        console.error('Error generando factura:', error);
        mostrarNotificacion('Error generando factura, pero el pago fue exitoso', 'warning');
    }
}

// Función para verificar estado de pago
async function verificarEstadoPago(paymentId) {
    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${MERCADO_PAGO_RUNTIME_CONFIG.accessToken}`
            }
        });

        if (response.ok) {
            const paymentData = await response.json();
            return paymentData.status;
        }
    } catch (error) {
        console.error('Error verificando estado de pago:', error);
    }
    return null;
}

// ===== FUNCIONALIDAD DE TECLA ESC PARA CERRAR MODALES =====
document.addEventListener('keydown', function(event) {
    // Cerrar modal de carrito con ESC
    if (event.key === 'Escape') {
        const cartModal = document.getElementById('cartModal');
        if (cartModal && cartModal.classList.contains('active')) {
            cerrarCarrito();
            event.preventDefault();
        }
    }
});

// ===== SISTEMA DE USUARIOS =====

// Función para toggle del sistema de usuarios
function toggleUserSystem() {
    // Verificar si hay usuario logueado
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    const userActual = localStorage.getItem('user_actual');
    
    if (userActual) {
        // Usuario logueado - mostrar menú
        mostrarMenuUsuario(tipoUsuario);
    } else {
        // No logueado - mostrar opciones de registro/login
        mostrarOpcionesAcceso();
    }
}

// Mostrar menú de usuario logueado
function mostrarMenuUsuario(tipo) {
    const user = JSON.parse(localStorage.getItem('user_actual') || '{}');
    const email = user.email || 'Usuario';
    
    const modalHTML = `
        <div id="userModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 99999;">
            <div style="background: white; border-radius: 20px; padding: 30px; max-width: 400px; width: 90%; text-align: center;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #EF4444, #F43F5E); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <i class="fas fa-user" style="font-size: 32px; color: white;"></i>
                </div>
                <h2 style="margin-bottom: 10px; color: #333;">${email}</h2>
                <p style="color: #666; margin-bottom: 30px; font-size: 14px;">
                    ${tipo === 'vendedor' ? '🏪 Vendedor' : '🛒 Comprador'}
                </p>
                
                <button onclick="irAPerfil('${tipo}')" style="width: 100%; padding: 12px; margin-bottom: 10px; background: linear-gradient(135deg, #EF4444, #F43F5E); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 600;">
                    <i class="fas fa-user-edit"></i> Mi Perfil
                </button>
                
                ${tipo === 'comprador' ? `
                    <button onclick="verMisCompras()" style="width: 100%; padding: 12px; margin-bottom: 10px; background: white; color: #EF4444; border: 2px solid #EF4444; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 600;">
                        <i class="fas fa-shopping-bag"></i> Mis Compras
                    </button>
                ` : ''}
                
                <button onclick="cerrarSesionUsuario()" style="width: 100%; padding: 12px; margin-bottom: 15px; background: white; color: #dc2626; border: 2px solid #dc2626; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 600;">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
                
                <button onclick="cerrarModalUsuario()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Mostrar opciones de acceso (login/registro)
function mostrarOpcionesAcceso() {
    const modalHTML = `
        <div id="userModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 99999;">
            <div style="background: white; border-radius: 20px; padding: 40px; max-width: 450px; width: 90%; text-align: center;">
                <h2 style="margin-bottom: 10px; color: #333;">¡Únete a CRESALIA! 💜</h2>
                <p style="color: #666; margin-bottom: 30px;">Crea tu cuenta para comenzar</p>
                
                <button onclick="window.location.href='registro-inicial.html'" style="width: 100%; padding: 15px; margin-bottom: 15px; background: linear-gradient(135deg, #EF4444, #F43F5E); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                    <i class="fas fa-user-plus"></i> Crear Cuenta
                </button>
                
                <button onclick="window.location.href='login-comprador.html'" style="width: 100%; padding: 15px; margin-bottom: 20px; background: white; color: #EF4444; border: 2px solid #EF4444; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                    <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
                </button>
                
                <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 10px;">
                    <p style="color: #666; font-size: 14px; margin-bottom: 10px;">¿Quieres vender?</p>
                    <a href="registro-tienda.html" style="color: #667eea; text-decoration: none; font-weight: 600;">
                        <i class="fas fa-store"></i> Crea tu Tienda
                    </a>
                </div>
                
                <button onclick="cerrarModalUsuario()" style="margin-top: 20px; background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Cerrar modal de usuario
function cerrarModalUsuario() {
    const modal = document.getElementById('userModal');
    if (modal) {
        modal.remove();
    }
}

// Ir a perfil según tipo
function irAPerfil(tipo) {
    if (tipo === 'vendedor') {
        window.location.href = 'tiendas/ejemplo-tienda/admin-final.html';
    } else {
        window.location.href = 'demo-buyer-interface.html';
    }
}

// Ver mis compras
function verMisCompras() {
    // Intentar usar el sistema de historiales si está disponible
    if (window.mostrarHistorialCompras && typeof window.mostrarHistorialCompras === 'function') {
        window.mostrarHistorialCompras();
    } else if (window.historySystem && typeof window.historySystem.showHistoryModal === 'function') {
        window.historySystem.showHistoryModal('comprador');
    } else {
        // Fallback: redirigir a la página dedicada
        window.location.href = 'mis-compras.html';
    }
}

// Cerrar sesión
async function cerrarSesionUsuario() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        // Limpiar localStorage
        localStorage.removeItem('tipo_usuario');
        localStorage.removeItem('user_actual');
        localStorage.removeItem('tienda_actual');
        localStorage.removeItem('login_tipo');
        
        // Si hay Supabase, cerrar sesión
        if (typeof window.supabase !== 'undefined' && window.supabase) {
            try {
                await window.supabase.auth.signOut();
            } catch (error) {
                console.log('Error cerrando sesión Supabase:', error);
            }
        }
        
        mostrarNotificacion('Sesión cerrada correctamente', 'info');
        
        // Recargar página
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Actualizar botón de usuario al cargar
document.addEventListener('DOMContentLoaded', function() {
    const userButton = document.getElementById('userButtonText');
    const userActual = localStorage.getItem('user_actual');
    
    if (userActual && userButton) {
        try {
            const user = JSON.parse(userActual);
            const nombre = user.email?.split('@')[0] || 'Usuario';
            userButton.textContent = nombre;
        } catch (error) {
            console.log('Error cargando usuario:', error);
        }
    }
    
    // Cargar idioma guardado
    cargarIdiomaGuardado();
});

// ===== SISTEMA DE IDIOMAS =====

// Toggle del selector de idiomas
function toggleLanguageSelector() {
    const modalHTML = `
        <div id="languageModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            animation: fadeIn 0.3s ease;
        ">
            <div style="
                background: white;
                border-radius: 20px;
                padding: 35px;
                max-width: 500px;
                width: 90%;
                animation: slideInUp 0.4s ease;
            ">
                <h2 style="margin: 0 0 10px 0; color: #333; text-align: center;">
                    🌍 Selecciona tu Idioma
                </h2>
                <p style="text-align: center; color: #666; margin-bottom: 30px; font-size: 14px;">
                    Choose Your Language
                </p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <button onclick="cambiarIdioma('es')" style="padding: 15px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                        🇪🇸 Español
                    </button>
                    
                    <button onclick="cambiarIdioma('en')" style="padding: 15px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                        🇬🇧 English
                    </button>
                    
                    <button onclick="cambiarIdioma('pt')" style="padding: 15px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                        🇧🇷 Português
                    </button>
                    
                    <button onclick="cambiarIdioma('fr')" style="padding: 15px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                        🇫🇷 Français
                    </button>
                    
                    <button onclick="cambiarIdioma('de')" style="padding: 15px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                        🇩🇪 Deutsch
                    </button>
                    
                    <button onclick="cambiarIdioma('it')" style="padding: 15px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                        🇮🇹 Italiano
                    </button>
                </div>
                
                <button onclick="cerrarLanguageModal()" style="
                    width: 100%;
                    margin-top: 20px;
                    padding: 12px;
                    background: #6b7280;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    Cerrar
                </button>
            </div>
        </div>
        
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Cerrar modal de idiomas
function cerrarLanguageModal() {
    const modal = document.getElementById('languageModal');
    if (modal) {
        modal.remove();
    }
}

// ===== SISTEMA DE TIENDAS CON DISTANCIAS =====
let todasLasTiendas = [];
let tiendasFiltradas = [];

// Cargar tiendas desde localStorage o Supabase
async function cargarTiendas() {
    try {
        let tiendas = [];
        
        // Intentar cargar desde Supabase
        // Verificar que Supabase esté disponible y sea un cliente válido
        const supabase = window.SUPABASE_CLIENT || (window.supabase && typeof window.supabase.createClient === 'function' ? window.initSupabase() : null);
        
        if (supabase && typeof supabase.from === 'function') {
            try {
                // Cargar tiendas desde Supabase (ajustar según tu estructura de tabla)
                const { data, error } = await supabase
                    .from('tiendas')
                    .select('*')
                    .eq('activo', true)
                    .limit(50);
                
                if (!error && data && data.length > 0) {
                    tiendas = data;
                    console.log('✅ Tiendas cargadas desde Supabase:', tiendas.length);
                }
            } catch (supabaseError) {
                console.log('⚠️ Error cargando tiendas desde Supabase:', supabaseError);
            }
        }
        
        // Si no hay en Supabase, intentar desde localStorage
        if (tiendas.length === 0) {
            // Buscar todas las tiendas guardadas en localStorage
            const keys = Object.keys(localStorage);
            const tiendasKeys = keys.filter(key => key.startsWith('tienda_') && key !== 'tienda_actual');
            
            tiendas = tiendasKeys.map(key => {
                try {
                    const tienda = JSON.parse(localStorage.getItem(key));
                    return {
                        id: tienda.id || key.replace('tienda_', ''),
                        slug: tienda.slug || tienda.id || key.replace('tienda_', ''),
                        nombre: tienda.nombre || tienda.nombreTienda || 'Tienda sin nombre',
                        descripcion: tienda.descripcion || tienda.descripcionTienda || '',
                        categoria: tienda.categoria || 'general',
                        imagen: tienda.imagenesVideos?.logo || tienda.logo || './assets/logo/logo-cresalia.png',
                        activo: true
                    };
                } catch (e) {
                    return null;
                }
            }).filter(t => t !== null);
            
            console.log('✅ Tiendas cargadas desde localStorage:', tiendas.length);
        }
        
        // Calcular distancias
        if (tiendas.length > 0) {
            await calcularDistanciasTiendas(tiendas);
        }
        
        todasLasTiendas = tiendas;
        tiendasFiltradas = [...tiendas];
        
        // Renderizar tiendas
        renderizarTiendas(tiendas);
        
        // Configurar listener para búsqueda
        const busquedaInput = document.getElementById('busquedaTiendas');
        if (busquedaInput) {
            busquedaInput.addEventListener('input', aplicarFiltrosTiendas);
        }
        
    } catch (error) {
        console.error('❌ Error cargando tiendas:', error);
    }
}

// Renderizar tiendas en el grid
function renderizarTiendas(tiendas) {
    const tiendasGrid = document.getElementById('tiendasGrid');
    if (!tiendasGrid) return;
    
    if (tiendas.length === 0) {
        tiendasGrid.innerHTML = `
            <div class="tienda-card" style="grid-column: 1 / -1;">
                <div class="tienda-placeholder">
                    <i class="fas fa-store"></i>
                    <h3>No hay tiendas disponibles</h3>
                    <p>Las tiendas aparecerán aquí cuando nuestros usuarios comiencen a usarlas</p>
                </div>
            </div>
        `;
        return;
    }
    
    tiendasGrid.innerHTML = '';
    tiendas.forEach(tienda => {
        const tiendaCard = crearTiendaCard(tienda);
        tiendasGrid.innerHTML += tiendaCard;
    });
}

// Crear tarjeta de tienda
function crearTiendaCard(tienda) {
    const distanciaHTML = tienda.distancia !== null && tienda.distancia !== undefined 
        ? `<div style="display: inline-flex; align-items: center; gap: 6px; background: #D1FAE5; color: #065F46; padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 0.9rem; margin-top: 10px;">
            <i class="fas fa-map-marker-alt"></i> ${tienda.distancia} km
          </div>`
        : '';
    
    const ubicacionHTML = tienda.ubicacion 
        ? `<div style="margin-top: 12px; padding: 12px; background: #F9FAFB; border-radius: 8px; border-left: 3px solid #8B5CF6;">
            <div style="font-size: 0.9rem; color: #6B7280; line-height: 1.4;">
                <i class="fas fa-map-marker-alt" style="color: #8B5CF6;"></i> ${tienda.ubicacion.direccion || 'Ubicación disponible'}
            </div>
            ${tienda.ubicacion.direccion ? `
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tienda.ubicacion.direccion)}" 
                   target="_blank" 
                   style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #8B5CF6; text-decoration: none; margin-top: 6px; font-weight: 500;">
                    <i class="fas fa-external-link-alt"></i> Ver en Google Maps
                </a>
            ` : ''}
          </div>`
        : '';
    
    return `
        <div class="tienda-card" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s, box-shadow 0.3s;">
            <div style="text-align: center; margin-bottom: 15px;">
                <img src="${tienda.imagen}" alt="${tienda.nombre}" 
                     style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #E5E7EB;">
            </div>
            <h3 style="text-align: center; color: #111827; margin-bottom: 10px; font-size: 1.2rem;">${tienda.nombre}</h3>
            <p style="text-align: center; color: #6B7280; font-size: 0.9rem; margin-bottom: 15px; line-height: 1.5;">
                ${tienda.descripcion || 'Tienda creada con Cresalia'}
            </p>
            ${distanciaHTML}
            ${ubicacionHTML}
            <div style="margin-top: 15px; text-align: center;">
                <a href="tiendas/${tienda.slug || tienda.id}/index.html" 
                   style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #A78BFA); color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: transform 0.2s;"
                   onmouseover="this.style.transform='scale(1.05)'"
                   onmouseout="this.style.transform='scale(1)'">
                    <i class="fas fa-store"></i> Visitar Tienda
                </a>
            </div>
        </div>
    `;
}

// Aplicar filtros de tiendas
function aplicarFiltrosTiendas() {
    const busqueda = document.getElementById('busquedaTiendas')?.value.toLowerCase() || '';
    const masCercano = document.getElementById('masCercanoTiendas')?.checked || false;
    const radioBusqueda = parseFloat(document.getElementById('radioBusquedaTiendas')?.value) || 0;
    
    let tiendasFiltradas = [...todasLasTiendas];
    
    // Filtro por búsqueda
    if (busqueda) {
        tiendasFiltradas = tiendasFiltradas.filter(tienda => 
            tienda.nombre.toLowerCase().includes(busqueda) ||
            tienda.descripcion?.toLowerCase().includes(busqueda) ||
            tienda.categoria?.toLowerCase().includes(busqueda)
        );
    }
    
    // Filtro por radio de búsqueda (distancia)
    if (radioBusqueda > 0) {
        tiendasFiltradas = tiendasFiltradas.filter(tienda => {
            if (tienda.distancia === null || tienda.distancia === undefined) {
                return false; // Excluir tiendas sin ubicación si hay radio activo
            }
            return parseFloat(tienda.distancia) <= radioBusqueda;
        });
    }
    
    // Ordenamiento
    if (masCercano) {
        // Ordenar por distancia (los que tienen distancia primero, luego los que no)
        tiendasFiltradas.sort((a, b) => {
            const distA = a.distancia !== null && a.distancia !== undefined ? parseFloat(a.distancia) : Infinity;
            const distB = b.distancia !== null && b.distancia !== undefined ? parseFloat(b.distancia) : Infinity;
            return distA - distB;
        });
    }
    
    // Actualizar variable global
    window.tiendasFiltradas = tiendasFiltradas;
    
    // Renderizar tiendas filtradas
    renderizarTiendas(tiendasFiltradas);
}

// Inicializar sistema de tiendas al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar tiendas después de un pequeño delay para asegurar que todo esté listo
    setTimeout(() => {
        cargarTiendas();
    }, 1000);
});

// Cambiar idioma
function cambiarIdioma(codigoIdioma) {
    console.log('🌍 Cambiando idioma a:', codigoIdioma);
    
    // Guardar preferencia
    localStorage.setItem('idioma_preferido', codigoIdioma);
    
    // Actualizar bandera en navbar
    const banderas = {
        'es': '🇪🇸',
        'en': '🇬🇧',
        'pt': '🇧🇷',
        'fr': '🇫🇷',
        'de': '🇩🇪',
        'it': '🇮🇹'
    };
    
    const flagElement = document.getElementById('currentLanguageFlag');
    if (flagElement) {
        flagElement.textContent = banderas[codigoIdioma];
    }
    
    // Aplicar traducciones
    if (typeof aplicarTraducciones === 'function') {
        aplicarTraducciones(codigoIdioma);
    } else {
        console.log('Sistema i18n cargando...');
        setTimeout(() => {
            if (typeof aplicarTraducciones === 'function') {
                aplicarTraducciones(codigoIdioma);
            }
        }, 500);
    }
    
    // Cerrar modal
    cerrarLanguageModal();
    
    // Mostrar notificación
    const mensajes = {
        'es': 'Idioma cambiado a Español',
        'en': 'Language changed to English',
        'pt': 'Idioma alterado para Português',
        'fr': 'Langue changée en Français',
        'de': 'Sprache geändert zu Deutsch',
        'it': 'Lingua cambiata in Italiano'
    };
    
    mostrarNotificacion(mensajes[codigoIdioma], 'success');
}

// Cargar idioma guardado al iniciar
function cargarIdiomaGuardado() {
    const idiomaGuardado = localStorage.getItem('idioma_preferido') || 'es';
    
    // Actualizar bandera
    const banderas = {
        'es': '🇪🇸',
        'en': '🇬🇧',
        'pt': '🇧🇷',
        'fr': '🇫🇷',
        'de': '🇩🇪',
        'it': '🇮🇹'
    };
    
    const flagElement = document.getElementById('currentLanguageFlag');
    if (flagElement) {
        flagElement.textContent = banderas[idiomaGuardado];
    }
    
    // Aplicar traducciones si el sistema está cargado
    if (typeof aplicarTraducciones === 'function') {
        aplicarTraducciones(idiomaGuardado);
    }
}

// ===== ASIGNACIÓN GLOBAL DE FUNCIONES =====
// Asegurar que todas las funciones estén disponibles globalmente
// Esto se ejecuta después de que todas las funciones estén definidas
(function() {
    'use strict';
    if (typeof window !== 'undefined') {
        // Asignar funciones críticas
        if (typeof toggleUserSystem === 'function') window.toggleUserSystem = toggleUserSystem;
        if (typeof toggleChatbot === 'function') window.toggleChatbot = toggleChatbot;
        if (typeof toggleAIChatbot === 'function') window.toggleAIChatbot = toggleAIChatbot;
        if (typeof toggleCart === 'function') window.toggleCart = toggleCart;
        if (typeof showLoginForm === 'function') window.showLoginForm = showLoginForm;
        if (typeof showRegisterForm === 'function') window.showRegisterForm = showRegisterForm;
        if (typeof closeUserSystem === 'function') window.closeUserSystem = closeUserSystem;
        if (typeof togglePassword === 'function') window.togglePassword = togglePassword;
        
        console.log('✅ Funciones globales asignadas correctamente');
    }
})();
