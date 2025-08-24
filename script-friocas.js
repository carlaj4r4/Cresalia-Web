// ===== FRIOCAS WEB - VERSIÓN 5.2 - CACHE FORZADO =====
// ===== CONFIGURACIÓN DE LA EMPRESA =====
let CONFIG_EMPRESA = {
    nombre: 'FRIOCAS',
    marca: 'FRIOCAS',
    logo: './assets/logo/logo-friocas.png',
    telefono: '+5493795015712',
    email: 'jj_refrigeracionesctes@hotmail.com',
    direccion: 'Moreno 2242, Corrientes Capital, Argentina',
    whatsapp: '5493795015712',
    facebook: 'https://www.facebook.com/share/1BowM37dJb/',
    instagram: 'https://www.instagram.com/lccarshop_?igsh=MXNyMDBmOXJ0NXI3bA==',
    adminPassword: 'FRIOCAS2024ADMIN',
    horarios: 'Lunes a Viernes: 8:00 - 12:00 y 16:00 - 20:00 | Sábados: 8:00 - 12:00 | Domingos: Cerrado',
    ventaMayorista: 'Venta por mayor y menor disponible',
    horarioComercial: 'Horario comercial: Lunes a Viernes 8:00 - 12:00 y 16:00 - 20:00 | Sábados 8:00 - 12:00 | Domingos Cerrado'
};

// Cargar configuración sincronizada si existe
function cargarConfiguracionSincronizada() {
    try {
        const configSincronizada = localStorage.getItem('CONFIG_EMPRESA');
        if (configSincronizada) {
            const config = JSON.parse(configSincronizada);
            CONFIG_EMPRESA = { ...CONFIG_EMPRESA, ...config };
            console.log('✅ Configuración de empresa cargada desde sincronización');
        }
    } catch (error) {
        console.error('Error al cargar configuración sincronizada:', error);
    }
}

// ===== DATOS DE PRODUCTOS REALES =====
let PRODUCTOS_DATA = [
    // Limpiadores
    { id: 1, nombre: 'Bug Remover', categoria: 'limpiadores', precio: 5700, descripcion: 'Removedor profesional de insectos y suciedad del parabrisas', imagen: 'assets/productos/Limpiadores/Bug Remover.jpg', stock: 15, marca: 'Professional Care' },
    { id: 2, nombre: 'Alcaline Wheels', categoria: 'limpiadores', precio: 6800, descripcion: 'Limpiador alcalino especial para llantas y ruedas', imagen: 'assets/productos/Limpiadores/Alcaline Wheels.jpg', stock: 25, marca: 'Wheel Care' },
    { id: 3, nombre: 'Iron Warning', categoria: 'limpiadores', precio: 15200, descripcion: 'Removedor de óxido y manchas de hierro en pintura', imagen: 'assets/productos/Limpiadores/Iron Warning.jpg', stock: 12, marca: 'Iron Defense' },
    { id: 4, nombre: 'CTRL Z', categoria: 'limpiadores', precio: 9200, descripcion: 'Limpiador desengrasante de alto poder para motores', imagen: 'assets/productos/Limpiadores/CTRL Z.jpg', stock: 18, marca: 'Engine Care' },
    { id: 5, nombre: 'All Clean', categoria: 'limpiadores', precio: 5850, descripcion: 'Limpiador multiuso para interior y exterior del vehículo', imagen: 'assets/productos/Limpiadores/All Clean.jpg', stock: 20, marca: 'Universal Clean' },
    { id: 6, nombre: 'Inferno Gel', categoria: 'limpiadores', precio: 7200, descripcion: 'Gel limpiador de alta temperatura para motores', imagen: 'assets/productos/Limpiadores/Inferno Gel.jpg', stock: 10, marca: 'Hot Clean' },
    { id: 7, nombre: 'Clean Vision', categoria: 'limpiadores', precio: 5700, descripcion: 'Limpiador especial para vidrios y espejos', imagen: 'assets/productos/Limpiadores/Clean Vision.jpg', stock: 22, marca: 'Glass Care' },
    
    // Shampoo
    { id: 8, nombre: 'ICE Shampoo', categoria: 'shampoo', precio: 6800, descripcion: 'Shampoo con efecto hielo para acabado brillante', imagen: 'assets/productos/shampoo/ICE.jpg', stock: 15, marca: 'Ice Effect' },
    { id: 9, nombre: 'Energy Shampoo', categoria: 'shampoo', precio: 6850, descripcion: 'Shampoo energizante con protección UV', imagen: 'assets/productos/shampoo/Energy.jpg', stock: 18, marca: 'Energy Boost' },
    { id: 10, nombre: 'Pure Foam', categoria: 'shampoo', precio: 6800, descripcion: 'Shampoo de espuma pura para lavado suave', imagen: 'assets/productos/shampoo/Pure Foam.jpg', stock: 12, marca: 'Pure Care' },
    { id: 11, nombre: 'Banana Shampoo', categoria: 'shampoo', precio: 5200, descripcion: 'Shampoo con extracto de banana para brillo natural', imagen: 'assets/productos/shampoo/Banana.jpg', stock: 14, marca: 'Natural Glow' },
    { id: 12, nombre: 'Hyper Black', categoria: 'shampoo', precio: 7450, descripcion: 'Shampoo especial para vehículos negros', imagen: 'assets/productos/shampoo/Hyper Black.jpg', stock: 16, marca: 'Black Magic' },
    { id: 13, nombre: 'Elite Shampoo', categoria: 'shampoo', precio: 7050, descripcion: 'Shampoo premium para acabado profesional', imagen: 'assets/productos/shampoo/Elite.jpg', stock: 10, marca: 'Elite Care' },
    { id: 14, nombre: 'DIP CLUB', categoria: 'shampoo', precio: 7200, descripcion: 'Shampoo exclusivo para vehículos de alta gama', imagen: 'assets/productos/shampoo/DIP CLUB.jpg', stock: 8, marca: 'VIP Care' },
    
    // Ceras Líquidas
    { id: 15, nombre: 'Extreme Detail', categoria: 'ceras', precio: 6450, descripcion: 'Cera líquida de alta duración para acabado extremo', imagen: 'assets/productos/Ceras líquidas/Extreme Detail.jpg', stock: 12, marca: 'Extreme Care' },
    { id: 16, nombre: 'Illusion Wax', categoria: 'ceras', precio: 8300, descripcion: 'Cera líquida con efecto espejo para acabado perfecto', imagen: 'assets/productos/Ceras líquidas/Illusion Wax.jpg', stock: 15, marca: 'Illusion Pro' },
    { id: 17, nombre: 'Lava Crush', categoria: 'ceras', precio: 8550, descripcion: 'Cera líquida de alta temperatura para protección máxima', imagen: 'assets/productos/Ceras líquidas/Lava Crush.jpg', stock: 10, marca: 'Lava Shield' },
    { id: 18, nombre: 'Seal It All', categoria: 'ceras', precio: 11300, descripcion: 'Sellador líquido de larga duración para protección total', imagen: 'assets/productos/Ceras líquidas/Seal It All.jpg', stock: 18, marca: 'Seal Pro' },
    { id: 19, nombre: 'The Boss', categoria: 'ceras', precio: 8550, descripcion: 'Cera líquida premium para acabado profesional', imagen: 'assets/productos/Ceras líquidas/The Boss.jpg', stock: 8, marca: 'Boss Premium' },
    
    // Iluminación
    { id: 20, nombre: 'Cree Led Mi2', categoria: 'iluminacion', precio: 32000, descripcion: 'Kit de iluminación LED Cree de alta potencia', imagen: 'assets/productos/iluminacion/Cree Led Mi2.jpg', stock: 6, marca: 'Cree Lighting' },
    
    // Revividores de Interiores
    { id: 21, nombre: 'Illusion Wax Interior', categoria: 'revividores', precio: 14000, descripcion: 'Revividor de interiores con efecto espejo', imagen: 'assets/productos/Revividores de interiores/Illusion Wax.jpg', stock: 12, marca: 'Illusion Interior' },
    { id: 22, nombre: 'Lava Crush Interior', categoria: 'revividores', precio: 15000, descripcion: 'Revividor de interiores de alta duración', imagen: 'assets/productos/Revividores de interiores/Lava Crush.jpg', stock: 10, marca: 'Lava Interior' },
    { id: 23, nombre: 'Seal It All Interior', categoria: 'revividores', precio: 13500, descripcion: 'Sellador para interiores de larga duración', imagen: 'assets/productos/Revividores de interiores/Seal It All.jpg', stock: 15, marca: 'Seal Interior' },
    { id: 24, nombre: 'The Boss Interior', categoria: 'revividores', precio: 16000, descripcion: 'Revividor premium para interiores', imagen: 'assets/productos/Revividores de interiores/The Boss.jpg', stock: 8, marca: 'Boss Interior' },
    { id: 25, nombre: 'Sneakers', categoria: 'revividores', precio: 10500, descripcion: 'Revividor especial para calzado deportivo', imagen: 'assets/productos/Revividores de interiores/Sneakers.jpg', stock: 20, marca: 'Sneaker Care' },
    { id: 26, nombre: 'Fruty Cream', categoria: 'revividores', precio: 10500, descripcion: 'Revividor con aroma frutal para interiores', imagen: 'assets/productos/Revividores de interiores/Fruty Cream.jpg', stock: 18, marca: 'Fruity Fresh' },
    { id: 27, nombre: 'Trim Leather', categoria: 'revividores', precio: 10500, descripcion: 'Revividor especial para cuero y vinilo', imagen: 'assets/productos/Revividores de interiores/Trim Leather.jpg', stock: 12, marca: 'Leather Pro' },
    { id: 28, nombre: 'Melon Fresh', categoria: 'revividores', precio: 10500, descripcion: 'Revividor con aroma a melón para frescura', imagen: 'assets/productos/Revividores de interiores/melon.jpg', stock: 16, marca: 'Melon Fresh' },
    { id: 29, nombre: 'Holy Clean', categoria: 'revividores', precio: 13000, descripcion: 'Revividor de interiores de uso general', imagen: 'assets/productos/Revividores de interiores/holy.jpg', stock: 14, marca: 'Holy Care' },
    { id: 30, nombre: 'Trim Look Candy', categoria: 'revividores', precio: 12500, descripcion: 'Revividor con acabado brillante tipo caramelo', imagen: 'assets/productos/Revividores de interiores/trim look candy.jpg', stock: 13, marca: 'Candy Shine' },
    { id: 31, nombre: 'Candy Fresh', categoria: 'revividores', precio: 10500, descripcion: 'Revividor con aroma dulce para interiores', imagen: 'assets/productos/Revividores de interiores/candy.jpg', stock: 17, marca: 'Candy Fresh' },
    { id: 32, nombre: 'Uva Fresh', categoria: 'revividores', precio: 10500, descripcion: 'Revividor con aroma a uva para frescura', imagen: 'assets/productos/Revividores de interiores/uva .jpg', stock: 15, marca: 'Uva Fresh' },
    { id: 33, nombre: 'Creme Look', categoria: 'revividores', precio: 10500, descripcion: 'Revividor con acabado cremoso para interiores', imagen: 'assets/productos/Revividores de interiores/creme look.jpg', stock: 11, marca: 'Creme Care' }
];

// Cargar productos sincronizados si existen
function cargarProductosSincronizados() {
    try {
        const productosSincronizados = localStorage.getItem('PRODUCTOS_DATA');
        if (productosSincronizados) {
            const productos = JSON.parse(productosSincronizados);
            if (Array.isArray(productos) && productos.length > 0) {
                PRODUCTOS_DATA = productos;
                console.log('✅ Productos cargados desde sincronización:', productos.length);
                return true;
            }
        }
    } catch (error) {
        console.error('Error al cargar productos sincronizados:', error);
    }
    return false;
}

// Función para debug de productos
function debugProductos() {
    console.log('🔍 DEBUG DE PRODUCTOS:');
    console.log('📊 Total de productos en PRODUCTOS_DATA:', PRODUCTOS_DATA.length);
    console.log('📋 Productos por categoría:');
    
    const categorias = {};
    PRODUCTOS_DATA.forEach(producto => {
        if (!categorias[producto.categoria]) {
            categorias[producto.categoria] = [];
        }
        categorias[producto.categoria].push(producto.nombre);
    });
    
    Object.keys(categorias).forEach(categoria => {
        console.log(`  ${categoria}: ${categorias[categoria].length} productos`);
        categorias[categoria].forEach(nombre => {
            console.log(`    - ${nombre}`);
        });
    });
    
    console.log('🎯 Productos que se están renderizando:', productosFiltrados.length);
    console.log('📱 Elemento productosGrid:', document.getElementById('productosGrid'));
    
    return {
        total: PRODUCTOS_DATA.length,
        porCategoria: categorias,
        renderizando: productosFiltrados.length
    };
}

// Función para debug del mapa
function debugMapa() {
    console.log('🗺️ DEBUG DEL MAPA:');
    console.log('📍 Coordenadas FRIOCAS:', FRIOCAS_COORDS);
    console.log('🌐 Google Maps cargado:', typeof google !== 'undefined');
    console.log('🗺️ Google Maps API:', typeof google !== 'undefined' ? typeof google.maps : 'No disponible');
    console.log('📱 Contenedor del mapa:', document.getElementById('mapaFRIOCAS'));
    console.log('🎯 Mapa inicializado:', typeof mapaFRIOCAS !== 'undefined');
    console.log('📍 Marcador creado:', typeof marcadorFRIOCAS !== 'undefined');
    
    // Verificar API Key
    const script = document.querySelector('script[src*="maps.googleapis.com"]');
    if (script) {
        const src = script.src;
        const apiKey = src.match(/key=([^&]+)/);
        console.log('🔑 API Key encontrada:', apiKey ? 'Sí' : 'No');
        if (apiKey) {
            console.log('🔑 API Key:', apiKey[1].substring(0, 10) + '...');
        }
    } else {
        console.log('❌ Script de Google Maps no encontrado');
    }
    
    // Verificar errores en consola
    console.log('🔍 Verifica la consola del navegador para errores de Google Maps');
    
    return {
        googleLoaded: typeof google !== 'undefined',
        mapsAvailable: typeof google !== 'undefined' ? typeof google.maps : false,
        containerExists: !!document.getElementById('mapaFRIOCAS'),
        mapaInitialized: typeof mapaFRIOCAS !== 'undefined',
        marcadorCreated: typeof marcadorFRIOCAS !== 'undefined'
    };
}

// Función para crear mapa estático sin API Key
function crearMapaEstatico() {
    const mapaContainer = document.getElementById('mapaFRIOCAS');
    if (!mapaContainer) {
        console.log('❌ Contenedor del mapa no encontrado');
        return;
    }
    
    // Crear mapa estático con OpenStreetMap
    const lat = FRIOCAS_COORDS.lat;
    const lng = FRIOCAS_COORDS.lng;
    const zoom = 15;
    const width = 600;
    const height = 400;
    
    // URL del mapa estático de OpenStreetMap
    const mapaUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
    
    mapaContainer.innerHTML = `
        <div style="width: 100%; height: 100%; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <iframe 
                width="100%" 
                height="100%" 
                frameborder="0" 
                scrolling="no" 
                marginheight="0" 
                marginwidth="0" 
                src="${mapaUrl}"
                style="border: 0;">
            </iframe>
        </div>
        <div style="text-align: center; margin-top: 10px; padding: 10px; background: #f8fafc; border-radius: 8px;">
            <h4 style="color: #2563eb; margin: 0 0 5px 0;">
                <i class="fas fa-map-marker-alt"></i> FRIOCAS
            </h4>
            <p style="margin: 5px 0; color: #64748b;">
                <i class="fas fa-location-dot"></i> Corrientes, Argentina
            </p>
            <p style="margin: 5px 0; color: #64748b;">
                <i class="fas fa-phone"></i> +5493795015712
            </p>
            <button onclick="abrirGoogleMaps()" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-top: 5px;">
                <i class="fas fa-external-link-alt"></i> Abrir en Google Maps
            </button>
        </div>
    `;
    
    console.log('✅ Mapa estático creado correctamente');
}

// Función para abrir Google Maps en nueva pestaña
function abrirGoogleMaps() {
    const lat = FRIOCAS_COORDS.lat;
    const lng = FRIOCAS_COORDS.lng;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
}

// ===== CARRITO DE COMPRAS =====
let carrito = [];
let productosFiltrados = PRODUCTOS_DATA;

// ===== RESTAURAR CARRITO DESDE BACKUP =====
function restaurarCarritoBackup() {
    try {
        const carritoBackup = localStorage.getItem('carritoBackup');
        if (carritoBackup) {
            const carritoRestaurado = JSON.parse(carritoBackup);
            if (Array.isArray(carritoRestaurado) && carritoRestaurado.length > 0) {
                carrito = carritoRestaurado;
                console.log('💾 Carrito restaurado desde backup:', carrito);
                mostrarNotificacion('🛒 Carrito restaurado correctamente', 'success');
                
                // Actualizar interfaz del carrito
                setTimeout(() => {
                    actualizarCarrito();
                }, 500);
                
                // Limpiar backup después de restaurar
                localStorage.removeItem('carritoBackup');
            }
        }
    } catch (error) {
        console.error('Error al restaurar carrito:', error);
    }
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
                <h3>Proceso de Compra - FRIOCAS</h3>
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
                                Envío a Domicilio (Gratis en Corrientes capital, Interior y Resistencia a cargo del cliente)
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
    }, 100);
    
    modal.style.display = 'flex';
}

function cerrarModalPago() {
    const modal = document.getElementById('modalPago');
    if (modal) {
        modal.style.display = 'none';
    }
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 100);
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
}

// ===== FUNCIONES DE PRODUCTOS =====
function renderizarProductos(productos = PRODUCTOS_DATA) {
    const productosGrid = document.getElementById('productosGrid');
    if (!productosGrid) {
        console.error('No se encontró el elemento productosGrid');
        return;
    }
    
    productosGrid.innerHTML = '';

    productos.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'producto-card';
        productoCard.style.animation = 'fadeInUp 0.6s ease-out';
        
        productoCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23f1f5f9%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b7280%22>${producto.nombre}</text></svg>'">
            <div class="producto-info">
                <span class="producto-categoria">${getCategoriaDisplayName(producto.categoria)}</span>
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <div class="producto-precio">$${producto.precio.toLocaleString('es-AR')}</div>
                <p class="producto-descripcion">${producto.descripcion}</p>
                
                <!-- Controles de cantidad y precio simplificados -->
                <div class="producto-controles">
                    <div class="cantidad-control">
                        <label for="cantidad-${producto.id}">Cantidad:</label>
                        <input type="number" id="cantidad-${producto.id}" value="1" min="1" max="${producto.stock}" onchange="calcularPrecio(${producto.id})" class="cantidad-numero">
                    </div>
                    <div class="precio-total">
                        <span>Total: $<span id="precio-total-${producto.id}">${producto.precio.toLocaleString('es-AR')}</span></span>
                    </div>
                </div>
                
                <!-- Botones de acción -->
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
    
    // Forzar visibilidad de botones después del renderizado
    setTimeout(() => {
        const botones = document.querySelectorAll('.producto-btn');
        botones.forEach(boton => {
            boton.style.opacity = '1';
            boton.style.visibility = 'visible';
            boton.style.display = 'flex';
        });
    }, 100);
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
            const respuesta = `¡Hola! Sí, tenemos ${producto.stock} unidades disponibles de ${producto.nombre}. El precio es $${producto.precio.toLocaleString('es-AR')}. ¿Te gustaría que te reserve una unidad? Puedes contactarnos al +5493795015712 o visitarnos en Moreno 2242, Corrientes Capital.`;
            addMessage(respuesta, 'bot');
        }, 1000);
        
        toggleChatbot();
    }
}

// ===== FUNCIONES DE CANTIDAD Y PRECIO =====
// Función removida para simplificar la interfaz - Los usuarios pueden escribir la cantidad directamente

// Función simplificada para calcular precio (versión producción)
function calcularPrecio(productoId) {
    const input = document.getElementById(`cantidad-${productoId}`);
    const precioTotalSpan = document.getElementById(`precio-total-${productoId}`);
    
    if (input && precioTotalSpan) {
        const cantidad = parseInt(input.value) || 1;
        
        // Precios por defecto para producción
        const preciosPorDefecto = {
            1: 2500, 2: 1800, 3: 3200, 4: 1500, 5: 2800, 6: 2200,
            7: 1900, 8: 3500, 9: 1200, 10: 2600, 11: 2100, 12: 1800,
            13: 2400, 14: 1600, 15: 2900, 16: 2000, 17: 1700, 18: 3100,
            19: 1400, 20: 2700, 21: 2300, 22: 1900, 23: 3300, 24: 1600,
            25: 2500, 26: 1800, 27: 2800, 28: 2200, 29: 1500, 30: 3000,
            31: 2000, 32: 1700, 33: 2600, 34: 1900, 35: 2400, 36: 2100
        };
        
        const precio = preciosPorDefecto[productoId] || 2000;
        const precioTotal = precio * cantidad;
        
        precioTotalSpan.textContent = `$${precioTotal.toLocaleString('es-AR')}`;
        precioTotalSpan.style.color = '#28a745';
    }
}

function agregarAlCarrito(productoId) {
    const input = document.getElementById(`cantidad-${productoId}`);
    
    if (input) {
        // Obtener información del producto desde el DOM
        const productoCard = input.closest('.producto-card');
        const nombreElement = productoCard ? productoCard.querySelector('.producto-nombre') : null;
        const precioElement = productoCard ? productoCard.querySelector('.producto-precio') : null;
        const imagenElement = productoCard ? productoCard.querySelector('.producto-imagen img') : null;
        
        if (nombreElement && precioElement) {
            const nombre = nombreElement.textContent;
            const precioTexto = precioElement.textContent.replace('$', '').replace(/\./g, '').replace(',', '');
            const precio = parseInt(precioTexto) || 0;
            const cantidad = parseInt(input.value) || 1;
            const imagen = imagenElement ? imagenElement.src : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f1f5f9"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%236b7280">Producto</text></svg>';
            
            // Verificar si el producto ya está en el carrito
            const itemExistente = carrito.find(item => item.id === productoId);
            
            if (itemExistente) {
                itemExistente.cantidad += cantidad;
            } else {
                carrito.push({
                    id: productoId,
                    nombre: nombre,
                    precio: precio,
                    cantidad: cantidad,
                    imagen: imagen
                });
            }
            
            actualizarCarrito();
            mostrarNotificacion(`${nombre} agregado al carrito (${cantidad} unidad${cantidad > 1 ? 'es' : ''})`);
        } else {
            console.error('No se pudo obtener la información del producto');
        }
    }
}

// ===== FUNCIONES DEL CARRITO =====
function actualizarCarrito() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        cartCount.textContent = totalItems;
    }
    
    renderizarCarrito();
}

function renderizarCarrito() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) {
        console.error('No se encontraron los elementos del carrito');
        return;
    }
    
    if (carrito.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted">El carrito está vacío</p>';
        cartTotal.textContent = '$0';
        return;
    }
    
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

function abrirCarrito() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        actualizarCarrito();
    }
}

// Función para reiniciar event listeners
function reiniciarEventListeners() {
    console.log('🔄 Reiniciando event listeners...');
    
            // Botones de cantidad removidos para simplificar la interfaz
    
    // Reiniciar inputs de cantidad
    const inputsCantidad = document.querySelectorAll('[onchange*="calcularPrecio"]');
    inputsCantidad.forEach(input => {
        const productoId = input.getAttribute('onchange').match(/\d+/)[0];
        input.onchange = function() {
            calcularPrecio(productoId);
        };
    });
    
    // Reiniciar botones de agregar al carrito
    const botonesAgregar = document.querySelectorAll('[onclick*="agregarAlCarrito"]');
    botonesAgregar.forEach(boton => {
        const productoId = boton.getAttribute('onclick').match(/\d+/)[0];
        boton.onclick = function() {
            agregarAlCarrito(productoId);
        };
    });
    
    console.log('✅ Event listeners reiniciados');
}

// Función de debug removida para producción

function cerrarCarrito() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reiniciar event listeners después de cerrar
        setTimeout(() => {
            reiniciarEventListeners();
        }, 100);
    }
}

// Cerrar carrito al hacer clic fuera del modal
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos sincronizados
    cargarConfiguracionSincronizada();
    cargarProductosSincronizados();
    
    // Restaurar carrito desde backup si existe
    restaurarCarritoBackup();
    
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                cerrarCarrito();
            }
        });
    }
    
    // Cerrar carrito con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const cartModal = document.getElementById('cartModal');
            if (cartModal && cartModal.classList.contains('active')) {
                cerrarCarrito();
            }
        }
    });
});

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
                <h3>Proceso de Compra - FRIOCAS</h3>
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
                                Envío a Domicilio (Gratis en Corrientes capital, Interior y Resistencia a cargo del cliente)
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
            const camposTarjeta = document.getElementById('camposTarjetaProducto');
            if (camposTarjeta) {
                if (this.value === 'credito' || this.value === 'debito') {
                    camposTarjeta.style.display = 'block';
                } else {
                    camposTarjeta.style.display = 'none';
                }
            }
        });
    });
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
                <h3>Proceso de Compra - FRIOCAS</h3>
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
                                Envío a Domicilio (Gratis en Corrientes capital, Interior y Resistencia a cargo del cliente)
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
        cantidad: window.cantidadActual || 1
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
    }
    
    // Limpiar carrito si es compra del carrito
    if (datosCompra.esCompraCarrito) {
        console.log('Limpiando carrito...');
        carrito = [];
        actualizarCarrito();
        cerrarCarrito();
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
            <title>Factura ${datos.tipoFactura} - FRIOCAS</title>
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
                <div class="watermark">FRIOCAS</div>
                
                <div class="header">
                    <img src="assets/logo/logo-friocas.png" alt="FRIOCAS" class="logo">
                    <h1>FRIOCAS</h1>
                    <h2>Factura ${datos.tipoFactura}</h2>
                </div>
                
                <div class="empresa-info">
                    <div class="campo"><strong>Empresa:</strong> FRIOCAS</div>
                    <div class="campo"><strong>Dirección:</strong> Moreno 2242, Corrientes Capital, Argentina</div>
                    <div class="campo"><strong>Teléfono:</strong> +5493795015712</div>
                    <div class="campo"><strong>Email:</strong> jj_refrigeracionesctes@hotmail.com</div>
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
                    <img src="assets/logo/logo-friocas.png" alt="FRIOCAS" style="max-width: 100px;">
                    <p><strong>FRIOCAS</strong> - Moreno 2242, Corrientes Capital, Argentina</p>
                    <p>Tel: +5493795015712 | Email: jj_refrigeracionesctes@hotmail.com</p>
                    <p>Gracias por confiar en FRIOCAS</p>
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
        🏢 FRIOCAS - Nueva Compra por Transferencia
        
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
    const container = tipo === 'ai' ? document.getElementById('chatAIMessages') : document.getElementById('chatHelpMessages');
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
    const container = tipo === 'ai' ? document.getElementById('chatAIMessages') : document.getElementById('chatHelpMessages');
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
    console.log('Inicializando FRIOCAS Web...');
    
    // Inicializar carrito
    if (typeof carrito === 'undefined') {
        window.carrito = [];
    }
    
    // Renderizar productos al cargar la página
    console.log('Renderizando productos...');
    renderizarProductos(PRODUCTOS_DATA);
    
    // Agregar mensajes de bienvenida a los chatbots después de un delay
    setTimeout(() => {
        // Mensaje de bienvenida para el chatbot de ayuda
        const chatbotMessages = document.getElementById('chatHelpMessages');
        if (chatbotMessages) {
            addMessage('help', '¡Hola! Soy el asistente de ayuda de FRIOCAS 🛠️. ¿En qué puedo ayudarte?', 'bot');
        }
        
        // Mensaje de bienvenida para el chatbot IA
        const aiChatbotMessages = document.getElementById('chatAIMessages');
        if (aiChatbotMessages) {
            addMessage('ai', '¡Hola! Soy el asistente virtual de FRIOCAS 🚗✨. Estoy aquí para ayudarte con todo lo relacionado a productos automotrices. ¿En qué puedo asistirte hoy?', 'bot');
        }
    }, 1000);
    
    console.log('FRIOCAS Web inicializada correctamente');
    
    // Inicializar mapa de Google Maps después de un delay para asegurar que la API esté cargada
    setTimeout(() => {
        console.log('🗺️ Inicializando mapa con delay...');
        inicializarMapaConRetry();
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
        
        // Hacer campos requeridos
        if (numeroTarjeta) numeroTarjeta.required = true;
        if (vencimientoTarjeta) vencimientoTarjeta.required = true;
        if (cvvTarjeta) cvvTarjeta.required = true;
        if (titularTarjeta) titularTarjeta.required = true;
        
        console.log('Campos de tarjeta mostrados y marcados como requeridos');
    } else {
        // Ocultar campos de tarjeta
        camposTarjeta.style.display = 'none';
        
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

// ===== FUNCIONES DE CHATBOT =====
function addMessage(tipo, mensaje, sender) {
    console.log('Agregando mensaje:', tipo, mensaje, sender);
    
    let container, input;
    
    if (tipo === 'ai') {
        container = document.getElementById('chatAIMessages');
        input = document.getElementById('chatAIInput');
    } else {
        container = document.getElementById('chatHelpMessages');
        input = document.getElementById('chatHelpInput');
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
    const inputId = tipo === 'ai' ? 'chatAIInput' : 'chatHelpInput';
    const input = document.getElementById(inputId);
    const message = input.value.trim();
    
    if (message) {
        console.log('🚀 Iniciando envío de mensaje:', tipo, message);
        
        // Agregar mensaje del usuario
        const userMessageElement = addMessage(tipo, message, 'user');
        console.log('✅ Mensaje del usuario agregado:', userMessageElement);
        
        // Verificar inmediatamente después de agregar
        setTimeout(() => {
            const container = tipo === 'ai' ? document.getElementById('chatAIMessages') : document.getElementById('chatHelpMessages');
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
            const container = tipo === 'ai' ? document.getElementById('chatAIMessages') : document.getElementById('chatHelpMessages');
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
    const container = document.getElementById('chatbotContainer');
    if (container) {
        container.classList.toggle('active');
    }
}

function toggleAIChatbot() {
    const container = document.getElementById('aiChatbotContainer');
    if (container) {
        container.classList.toggle('active');
    }
}

// ===== FUNCIONES DE RESERVA =====
function reservarServicio(servicio) {
    console.log('Reservando servicio:', servicio);
    mostrarNotificacion('Función de reserva en desarrollo');
}

// ===== FUNCIÓN IA INTELIGENTE PARA FRIOCAS =====
function generarRespuestaIA(mensaje) {
    const mensajeLower = mensaje.toLowerCase();
    
    // Saludos
    if (mensajeLower.includes('hola') || mensajeLower.includes('buenos días') || mensajeLower.includes('buenas')) {
        const saludos = [
            '¡Hola! Soy tu asistente virtual de FRIOCAS 🚗✨. ¿En qué puedo ayudarte hoy?',
            '¡Buen día! Bienvenido a FRIOCAS. ¿Qué producto automotriz te interesa conocer?',
            '¡Hola! Gracias por contactar con FRIOCAS. ¿Cómo puedo asistirte?'
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
        return '🕐 **Nuestros Horarios de Atención:**\n📅 Lunes a Viernes: 8:00 - 12:00 y 16:00 - 20:00\n📅 Sábados: 8:00 - 12:00\n❌ Domingos: Cerrado\n📍 Moreno 2242, Corrientes Capital\n\n¡Te esperamos!';
    }
    
    // Envíos
    if (mensajeLower.includes('envío') || mensajeLower.includes('delivery')) {
        return '🚚 **Opciones de Entrega:**\n✅ Corrientes Capital: Envío GRATIS\n🏪 Interior y Resistencia: A cargo del cliente\n🏪 Retiro en sucursal disponible\n\n¿Cuál prefieres?';
    }
    
    // Contacto
    if (mensajeLower.includes('contacto') || mensajeLower.includes('teléfono')) {
        return '📞 **Información de Contacto:**\n📱 WhatsApp: +5493795015712\n📞 Teléfono: +5493795015712\n📍 Dirección: Moreno 2242, Corrientes Capital\n\n¡Estamos aquí para ayudarte!';
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
            '¡Hola! Soy el equipo de soporte de FRIOCAS 🛠️. ¿En qué puedo ayudarte?',
            '¡Buen día! Estamos aquí para asistirte. ¿Qué necesitas?',
            '¡Hola! Gracias por contactar nuestro soporte. ¿Cómo puedo ayudarte?'
        ];
        return saludosAyuda[Math.floor(Math.random() * saludosAyuda.length)];
    }
    
    if (mensajeLower.includes('pedido') || mensajeLower.includes('compra')) {
        return '📦 ¿Tienes alguna consulta sobre tu pedido? Nuestro equipo está disponible al +5493795015712 para brindarte atención personalizada.';
    }
    
    if (mensajeLower.includes('pago') || mensajeLower.includes('error')) {
        return '💳 ¿Experimentaste algún problema con el pago? Llámanos al +5493795015712 y te asistiremos de inmediato.';
    }
    
    const respuestasAyuda = [
        '📞 Para atención personalizada, contacta directamente al +5493795015712. ¡Estamos aquí para ayudarte!',
        '📞 ¿Necesitas ayuda específica? Llámanos al +5493795015712 y con gusto te asistiremos.',
        '📞 Nuestro equipo de soporte está disponible al +5493795015712. ¡No dudes en contactarnos!'
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
                tipoTarjeta: validacion.tipoTarjeta || 'visa', // Fallback a visa si no se detecta
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
    console.log('🔒 Cerrando modal de pago...');
    
    // Buscar modal por diferentes selectores
    const modal = document.querySelector('.modal-pago') || 
                  document.getElementById('modalPago') || 
                  document.querySelector('[class*="modal"][class*="pago"]');
    
    if (modal) {
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        modal.style.zIndex = '-1';
        
        // Remover modal del DOM
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 100);
    }
    
    // Restaurar el body completamente
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.body.style.height = 'auto';
    document.body.style.paddingRight = '0';
    
    // Remover overlay si existe
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Limpiar cualquier backdrop de Bootstrap
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    // Remover clase modal-open del body
    document.body.classList.remove('modal-open');
    
    // Limpiar cualquier evento de teclado
    document.removeEventListener('keydown', handleEscapeKey);
    
    console.log('✅ Modal de pago cerrado correctamente');
    
    // Reiniciar event listeners después de un pequeño delay
    setTimeout(() => {
        reiniciarEventListeners();
    }, 200);
}

// Función para manejar tecla Escape
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        cerrarModalPago();
    }
}

// Función de emergencia para cerrar todos los modales
function cerrarTodosLosModales() {
    console.log('🚨 Función de emergencia: Cerrando todos los modales...');
    
    // Cerrar modal de pago
    cerrarModalPago();
    
    // Cerrar modal de carrito
    cerrarCarrito();
    
    // Cerrar modal de servicios
    const modalServicios = document.querySelector('.modal-servicios') || document.getElementById('modalServicios');
    if (modalServicios) {
        modalServicios.style.display = 'none';
        modalServicios.style.opacity = '0';
        modalServicios.style.visibility = 'hidden';
    }
    
    // Cerrar modal de transporte
    const modalTransporte = document.querySelector('.modal-transporte') || document.getElementById('modalTransporte');
    if (modalTransporte) {
        modalTransporte.style.display = 'none';
        modalTransporte.style.opacity = '0';
        modalTransporte.style.visibility = 'hidden';
    }
    
    // Restaurar el body completamente
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.body.style.height = 'auto';
    document.body.style.paddingRight = '0';
    document.body.style.width = 'auto';
    
    // Remover todos los backdrops
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    // Remover todas las clases modal
    document.body.classList.remove('modal-open');
    
    // Limpiar todos los overlays
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => overlay.remove());
    
    // Remover todos los event listeners de teclado
    document.removeEventListener('keydown', handleEscapeKey);
    
    console.log('✅ Todos los modales cerrados por emergencia');
    
    // Reiniciar event listeners
    setTimeout(() => {
        reiniciarEventListeners();
    }, 300);
}

// Exponer función de emergencia globalmente
window.cerrarTodosLosModales = cerrarTodosLosModales;

// Función para generar factura
function generarFactura(resultadoPago, descripcion) {
    // Validar que resultadoPago tenga todas las propiedades necesarias
    if (!resultadoPago || !resultadoPago.tipoTarjeta || !resultadoPago.ultimosDigitos) {
        console.error('❌ Error: Datos de pago incompletos para generar factura:', resultadoPago);
        mostrarNotificacionPago('❌ Error al generar factura: datos incompletos', 'error');
        return;
    }
    
    const factura = {
        numero: 'FAC-' + Date.now(),
        fecha: new Date().toLocaleDateString('es-AR'),
        hora: new Date().toLocaleTimeString('es-AR'),
        monto: resultadoPago.monto || 0,
        descripcion: descripcion || 'Compra en FRIOCAS',
        metodoPago: `${resultadoPago.tipoTarjeta.toUpperCase()} ****${resultadoPago.ultimosDigitos}`,
        transaccionId: resultadoPago.transaccionId || 'TXN' + Date.now(),
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
    const userSystem = document.getElementById('userSystem');
    if (userSystem.style.display === 'none' || userSystem.style.display === '') {
        userSystem.style.display = 'flex';
        showLoginForm();
    } else {
        userSystem.style.display = 'none';
    }
}

// Función para cerrar el sistema de usuarios
function closeUserSystem() {
    document.getElementById('userSystem').style.display = 'none';
}

// Función para mostrar el formulario de login
function showLoginForm() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
}

// Función para mostrar el formulario de registro
function showRegisterForm() {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
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

// Función para limpiar errores de usuarios
function limpiarErroresUsuarios() {
    try {
        // Limpiar localStorage de usuarios si hay problemas
        localStorage.removeItem('users');
        localStorage.removeItem('userSession');
        localStorage.removeItem('currentUser');
        console.log('✅ Sistema de usuarios limpiado');
        mostrarNotificacion('Sistema de usuarios reiniciado', 'info');
    } catch (error) {
        console.error('Error limpiando usuarios:', error);
    }
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
    const userButton = document.getElementById('userButton');
    const userButtonText = document.getElementById('userButtonText');
    
    if (currentUser) {
        // Usuario logueado
        userButtonText.textContent = currentUser.name.split(' ')[0];
        userButton.classList.add('user-logged-in');
        userButton.onclick = showUserProfile;
    } else {
        // Usuario no logueado
        userButtonText.textContent = 'Mi Cuenta';
        userButton.classList.remove('user-logged-in');
        userButton.onclick = toggleUserSystem;
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
                }
            } else {
                localStorage.removeItem('userSession');
            }
        } catch (error) {
            console.error('Error al cargar sesión:', error);
            localStorage.removeItem('userSession');
        }
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
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
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
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
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
    
    // Reiniciar event listeners después de cerrar
    setTimeout(() => {
        reiniciarEventListeners();
    }, 100);
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
            <title>Comprobante de Reserva - FRIOCAS</title>
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
            <div class="watermark">FRIOCAS</div>
            <div class="comprobante">
                <div class="header">
                    <img src="assets/logo/logo-friocas.png" alt="FRIOCAS" class="logo">
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
                    <p><strong>FRIOCAS</strong> - Moreno 2242, Corrientes Capital, Argentina</p>
                    <p>Tel: +5493795015712 | Email: jj_refrigeracionesctes@hotmail.com</p>
                    <p>Horarios: Lunes a Viernes 8:00 - 12:00 y 16:00 - 20:00 | Sábados 8:00 - 12:00 | Domingos Cerrado</p>
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
                <div class="producto-precio-total">
                    <span>Total: $<span id="precio-total-${producto.id}">${producto.precio.toLocaleString('es-AR')}</span></span>
                </div>
                <div class="producto-stock ${stockClass}">
                    <i class="fas fa-box"></i> ${stockText}
                </div>
                <div class="producto-acciones">
                    <div class="cantidad-input">
                        <input type="number" id="cantidad-${producto.id}" value="1" min="1" max="${producto.stock}" onchange="calcularPrecio(${producto.id})">
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

// Función para filtrar productos
function filtrarProductos(categoria = 'todos') {
    // Actualizar botones activos
    document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    let productosFiltrados;
    if (categoria === 'todos') {
        productosFiltrados = PRODUCTOS_DATA;
    } else {
        productosFiltrados = PRODUCTOS_DATA.filter(producto => 
            producto.categoria.toLowerCase() === categoria.toLowerCase()
        );
    }
    
    renderizarProductos(productosFiltrados);
}

// Función para agregar al carrito
function agregarAlCarrito(productoId) {
    const producto = PRODUCTOS_DATA.find(p => p.id === productoId);
    const cantidadInput = document.getElementById(`cantidad-${productoId}`);
    
    if (!producto) {
        mostrarNotificacion('Producto no encontrado', 'error');
        return;
    }
    
    const cantidad = parseInt(cantidadInput?.value) || 1;
    
    if (cantidad > producto.stock) {
        mostrarNotificacion(`Solo hay ${producto.stock} unidades disponibles`, 'error');
        return;
    }
    
    // Verificar si ya existe en el carrito
    const itemExistente = carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
        if (itemExistente.cantidad > producto.stock) {
            itemExistente.cantidad = producto.stock;
            mostrarNotificacion(`Agregado máximo disponible: ${producto.stock} unidades`, 'warning');
        }
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: cantidad,
            stock: producto.stock
        });
    }
    
    actualizarCarrito();
    mostrarNotificacion(`✅ ${producto.nombre} agregado al carrito`, 'success');
    
    console.log('🛒 Producto agregado al carrito:', producto.nombre, cantidad);
}

// ===== FUNCIONES DEL CARRITO =====

// Función para actualizar carrito
function actualizarCarrito() {
    const carritoContainer = document.getElementById('cartItems');
    const carritoTotal = document.getElementById('cartTotal');
    const carritoCantidad = document.getElementById('cartCount');
    
    if (!carritoContainer) return;
    
    if (carrito.length === 0) {
        carritoContainer.innerHTML = `
            <div class="carrito-vacio">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        if (carritoTotal) carritoTotal.textContent = '$0';
        if (carritoCantidad) {
            carritoCantidad.textContent = '0';
            carritoCantidad.style.display = 'none';
        }
        return;
    }
    
    carritoContainer.innerHTML = carrito.map(item => {
        const itemTotal = item.precio * item.cantidad;
        return `
            <div class="carrito-item">
                <img src="${item.imagen}" alt="${item.nombre}" onerror="this.src='assets/productos/placeholder.jpg'">
                <div class="carrito-item-info">
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio.toLocaleString()} x ${item.cantidad}</p>
                    <p class="item-subtotal">Subtotal: $${itemTotal.toLocaleString()}</p>
                </div>
                <div class="carrito-item-acciones">
                    <button onclick="cambiarCantidadCarrito(${item.id}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidadCarrito(${item.id}, 1)">+</button>
                    <button onclick="removerDelCarrito(${item.id})" class="btn-remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    if (carritoTotal) carritoTotal.textContent = `$${total.toLocaleString()}`;
    if (carritoCantidad) {
        carritoCantidad.textContent = totalItems;
        carritoCantidad.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
    
    // Guardar carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para mostrar carrito
function mostrarCarrito() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        actualizarCarrito();
    }
}

// Función para cerrar carrito
function cerrarCarrito() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
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
        console.log('Contenedor de servicios no encontrado - puede que no esté en esta página');
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
let mapaFRIOCAS = null;
let marcadorFRIOCAS = null;

// Coordenadas de FRIOCAS (Corrientes, Argentina)
const FRIOCAS_COORDS = {
    lat: -27.4692,
    lng: -58.8304
};

// Función para inicializar el mapa con retry
function inicializarMapaConRetry() {
    console.log('🗺️ Inicializando mapa con retry...');
    const mapaContainer = document.getElementById('mapa-friocas');
    
    if (!mapaContainer) {
        console.log('❌ Contenedor del mapa no encontrado, reintentando en 1 segundo...');
        setTimeout(inicializarMapaConRetry, 1000);
        return;
    }
    
    console.log('✅ Contenedor del mapa encontrado');
    console.log('📍 Coordenadas FRIOCAS:', FRIOCAS_COORDS);
    
    // Forzar uso de mapa estático por ahora
    console.log('🗺️ Usando mapa estático');
    crearMapaEstatico();
    
    // Verificar que se creó correctamente
    setTimeout(() => {
        const iframe = mapaContainer.querySelector('iframe');
        if (iframe) {
            console.log('✅ Mapa estático creado correctamente');
        } else {
            console.log('❌ Error creando mapa estático');
        }
    }, 1000);
}

// Función para inicializar el mapa
function inicializarMapa() {
    inicializarMapaConRetry();
}

function inicializarMapaGoogle() {
    const mapaContainer = document.getElementById('mapa-friocas');
    if (!mapaContainer) {
        console.log('Contenedor del mapa no encontrado');
        return;
    }
    
    // Verificar que las librerías necesarias estén disponibles
    if (!google.maps.Map || !google.maps.Marker || !google.maps.InfoWindow) {
        console.log('Librerías de Google Maps no están completamente cargadas, usando mapa estático...');
        crearMapaEstatico();
        return;
    }
    
    // Crear el mapa
    mapaFRIOCAS = new google.maps.Map(mapaContainer, {
        center: FRIOCAS_COORDS,
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
        marcadorFRIOCAS = new google.maps.Marker({
            position: FRIOCAS_COORDS,
            map: mapaFRIOCAS,
            title: 'FRIOCAS - Productos y Servicios Automotrices',
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
        marcadorFRIOCAS = new google.maps.Marker({
            position: FRIOCAS_COORDS,
            map: mapaFRIOCAS,
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
                        <i class="fas fa-car" style="color: #8b5cf6;"></i> FRIOCAS
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
    if (infoWindow && marcadorFRIOCAS) {
        marcadorFRIOCAS.addListener('click', () => {
            infoWindow.open(mapaFRIOCAS, marcadorFRIOCAS);
        });
        
        // Mostrar info window automáticamente después de 2 segundos
        setTimeout(() => {
            infoWindow.open(mapaFRIOCAS, marcadorFRIOCAS);
        }, 2000);
    }
    
    console.log('Mapa de FRIOCAS inicializado correctamente');
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
                const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${FRIOCAS_COORDS.lat},${FRIOCAS_COORDS.lng}`;
                
                // Abrir en nueva pestaña
                window.open(url, '_blank');
                
                mostrarNotificacion('Ruta abierta en Google Maps', 'success');
            },
            (error) => {
                console.error('Error obteniendo ubicación:', error);
                
                // Si no se puede obtener la ubicación, abrir mapa centrado en FRIOCAS
                const url = `https://www.google.com/maps/search/?api=1&query=${FRIOCAS_COORDS.lat},${FRIOCAS_COORDS.lng}`;
                window.open(url, '_blank');
                
                mostrarNotificacion('Mapa de FRIOCAS abierto', 'info');
            }
        );
    } else {
        // Fallback para navegadores que no soportan geolocalización
        const url = `https://www.google.com/maps/search/?api=1&query=${FRIOCAS_COORDS.lat},${FRIOCAS_COORDS.lng}`;
        window.open(url, '_blank');
        
        mostrarNotificacion('Mapa de FRIOCAS abierto', 'info');
    }
}

// Función para centrar el mapa en FRIOCAS
function centrarMapaFRIOCAS() {
    if (mapaFRIOCAS) {
        mapaFRIOCAS.setCenter(FRIOCAS_COORDS);
        mapaFRIOCAS.setZoom(15);
    }
}

// Función para animar el marcador
function animarMarcador() {
    if (marcadorFRIOCAS) {
        marcadorFRIOCAS.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
            marcadorFRIOCAS.setAnimation(null);
        }, 1500);
    }
}

// ===== MERCADO PAGO INTEGRATION =====
let mercadopago = null;

// Configuración de Mercado Pago (REEMPLAZAR CON TUS CREDENCIALES REALES)
const MERCADO_PAGO_CONFIG = {
    publicKey: 'APP-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // REEMPLAZAR CON TU PUBLIC KEY REAL
    accessToken: 'APP-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // REEMPLAZAR CON TU ACCESS TOKEN REAL
    preferenceId: null,
    sandbox: false // Cambiar a false para producción
};

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
            mercadopago = new MercadoPago(MERCADO_PAGO_CONFIG.publicKey);
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
                name: document.getElementById('nombreCliente')?.value || 'Cliente FRIOCAS',
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
            external_reference: `FRIOCAS_${producto.id}_${Date.now()}`,
            notification_url: window.location.origin + '/webhook-mercadopago',
            expires: true,
            expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
        };

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preference)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        MERCADO_PAGO_CONFIG.preferenceId = data.id;
        
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
                name: document.getElementById('nombreCliente')?.value || 'Cliente FRIOCAS',
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
            external_reference: `FRIOCAS_CARRITO_${Date.now()}`,
            notification_url: window.location.origin + '/webhook-mercadopago',
            expires: true,
            expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        };

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preference)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        MERCADO_PAGO_CONFIG.preferenceId = data.id;
        
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
                'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.accessToken}`
            }
        });

        if (response.ok) {
            const paymentData = await response.json();
            
            // Generar factura con datos reales de Mercado Pago
            const facturaData = {
                numero: `FRIOCAS-${paymentId}`,
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
                'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.accessToken}`
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

// ===== FUNCIONES FALTANTES DEL CARRITO =====
function limpiarCarrito() {
    if (confirm('¿Estás seguro de que quieres limpiar el carrito?')) {
        carrito = [];
        actualizarCarrito();
        mostrarNotificacion('Carrito limpiado', 'success');
    }
}

function mostrarCarrito() {
    abrirCarrito();
}

function abrirCarrito() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        actualizarCarrito();
        console.log('✅ Carrito abierto correctamente');
    }
}

function cerrarCarrito() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.body.style.position = 'static';
        console.log('✅ Carrito cerrado correctamente');
    }
}

// ===== EXPONER FUNCIONES AL CONTEXTO GLOBAL =====
window.toggleCart = function() {
    console.log('🔄 toggleCart llamado - redirigiendo a abrirCarrito');
    abrirCarrito();
};

window.agregarAlCarrito = agregarAlCarrito;
window.actualizarCarrito = actualizarCarrito;
window.abrirCarrito = abrirCarrito;
window.cerrarCarrito = cerrarCarrito;
window.limpiarCarrito = limpiarCarrito;
window.mostrarCarrito = mostrarCarrito;
// Función removida para simplificar la interfaz
// Función simple para calcular precio
window.calcularPrecio = function(precio, cantidad) {
    return precio * cantidad;
};

// ===== SISTEMA DE TRANSPORTE Y COMPROBANTES =====

// Variables globales para transporte
let precioPorKm = {
    local: 1500,        // $1,500 por km para viajes locales
    interprovincial: 2000  // $2,000 por km para viajes interprovinciales
};

let reservaActual = null;
let direccionesCalculadas = {
    origen: '',
    destino: '',
    distancia: 0,
    duracion: '',
    precio: 0
};

// ===== FUNCIONES DE TRANSPORTE =====

// Función para abrir modal de transporte
function mostrarModalTransporte() {
    const modal = document.getElementById('modalTransporte');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Inicializar mapa después de un pequeño delay para asegurar que el modal esté visible
        setTimeout(() => {
            if (!mapaTransporte) {
                inicializarMapaTransporte();
            }
        }, 500);
        
        console.log('✅ Modal de transporte abierto');
    }
}

// Función para cerrar modal de transporte
function cerrarModalTransporte() {
    const modal = document.getElementById('modalTransporte');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Limpiar formulario
        limpiarFormularioTransporte();
        console.log('✅ Modal de transporte cerrado');
    }
}

// Función para limpiar formulario de transporte
function limpiarFormularioTransporte() {
    document.getElementById('origen').value = '';
    document.getElementById('destino').value = '';
    document.getElementById('tipoViaje').value = 'local';
    document.getElementById('distanciaCalculada').textContent = '-';
    document.getElementById('duracionCalculada').textContent = '-';
    document.getElementById('precioCalculado').textContent = '$0';
    document.getElementById('btnReservarTransporte').disabled = true;
    document.getElementById('formularioReservaTransporte').style.display = 'none';
}

// Función para calcular ruta y precio
function calcularRuta() {
    const origen = document.getElementById('origen').value.trim();
    const destino = document.getElementById('destino').value.trim();
    const tipoViaje = document.getElementById('tipoViaje').value;
    
    if (!origen || !destino) {
        mostrarNotificacion('Por favor, completa origen y destino', 'error');
        return;
    }
    
    // Simular cálculo de distancia (en producción usarías Google Maps API)
    const distancia = calcularDistanciaSimulada(origen, destino);
    const duracion = calcularDuracionSimulada(distancia);
    const precio = calcularPrecioTransporte(distancia, tipoViaje);
    
    // Actualizar interfaz
    document.getElementById('distanciaCalculada').textContent = `${distancia} km`;
    document.getElementById('duracionCalculada').textContent = duracion;
    document.getElementById('precioCalculado').textContent = `$${precio.toLocaleString()}`;
    document.getElementById('btnReservarTransporte').disabled = false;
    
    // Guardar datos para la reserva
    direccionesCalculadas = {
        origen: origen,
        destino: destino,
        distancia: distancia,
        duracion: duracion,
        precio: precio
    };
    
    mostrarNotificacion(`Ruta calculada: ${distancia} km - $${precio.toLocaleString()}`, 'success');
    console.log('✅ Ruta calculada:', direccionesCalculadas);
}

// Función para calcular distancia simulada (reemplazar con Google Maps API)
function calcularDistanciaSimulada(origen, destino) {
    // Simulación simple basada en longitud de texto
    const baseDistancia = Math.abs(origen.length - destino.length) * 2 + 10;
    return Math.max(5, Math.min(200, baseDistancia)); // Entre 5 y 200 km
}

// Función para calcular duración simulada
function calcularDuracionSimulada(distancia) {
    const velocidadPromedio = 60; // km/h
    const tiempoMinutos = Math.round((distancia / velocidadPromedio) * 60);
    const horas = Math.floor(tiempoMinutos / 60);
    const minutos = tiempoMinutos % 60;
    return `${horas}h ${minutos}min`;
}

// Función para calcular precio de transporte
function calcularPrecioTransporte(distancia, tipoViaje) {
    const precioBase = precioPorKm[tipoViaje] || precioPorKm.local;
    const precioTotal = distancia * precioBase;
    
    // Aplicar descuentos o recargos según distancia
    let precioFinal = precioTotal;
    if (distancia > 100) {
        precioFinal *= 0.9; // 10% descuento para viajes largos
    } else if (distancia < 10) {
        precioFinal = Math.max(precioFinal, 8000); // Precio mínimo $8,000
    }
    
    return Math.round(precioFinal);
}

// ===== EXPONER FUNCIONES DE TRANSPORTE AL CONTEXTO GLOBAL =====
window.mostrarModalTransporte = mostrarModalTransporte;
window.cerrarModalTransporte = cerrarModalTransporte;
window.calcularRuta = calcularRuta;

// Función para cerrar modal de transporte
function cerrarModalTransporte() {
    const modal = document.getElementById('modalTransporte');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Limpiar formulario
        limpiarFormularioTransporte();
        console.log('✅ Modal de transporte cerrado');
    }
}

// Función para limpiar formulario de transporte
function limpiarFormularioTransporte() {
    document.getElementById('origen').value = '';
    document.getElementById('destino').value = '';
    document.getElementById('tipoViaje').value = 'local';
    document.getElementById('distanciaCalculada').textContent = '-';
    document.getElementById('duracionCalculada').textContent = '-';
    document.getElementById('precioCalculado').textContent = '$0';
    document.getElementById('btnReservarTransporte').disabled = true;
    document.getElementById('formularioReservaTransporte').style.display = 'none';
}

// Función para calcular ruta y precio
function calcularRuta() {
    const origen = document.getElementById('origen').value.trim();
    const destino = document.getElementById('destino').value.trim();
    const tipoViaje = document.getElementById('tipoViaje').value;
    
    if (!origen || !destino) {
        mostrarNotificacion('Por favor, completa origen y destino', 'error');
        return;
    }
    
    // Simular cálculo de distancia (en producción usarías Google Maps API)
    const distancia = calcularDistanciaSimulada(origen, destino);
    const duracion = calcularDuracionSimulada(distancia);
    const precio = calcularPrecioTransporte(distancia, tipoViaje);
    
    // Actualizar interfaz
    document.getElementById('distanciaCalculada').textContent = `${distancia} km`;
    document.getElementById('duracionCalculada').textContent = duracion;
    document.getElementById('precioCalculado').textContent = `$${precio.toLocaleString()}`;
    document.getElementById('btnReservarTransporte').disabled = false;
    
    // Guardar datos para la reserva
    direccionesCalculadas = {
        origen: origen,
        destino: destino,
        distancia: distancia,
        duracion: duracion,
        precio: precio
    };
    
    mostrarNotificacion(`Ruta calculada: ${distancia} km - $${precio.toLocaleString()}`, 'success');
    console.log('✅ Ruta calculada:', direccionesCalculadas);
}

// Función para calcular distancia simulada (reemplazar con Google Maps API)
function calcularDistanciaSimulada(origen, destino) {
    // Simulación simple basada en longitud de texto
    const baseDistancia = Math.abs(origen.length - destino.length) * 2 + 10;
    return Math.max(5, Math.min(200, baseDistancia)); // Entre 5 y 200 km
}

// Función para calcular duración simulada
function calcularDuracionSimulada(distancia) {
    const velocidadPromedio = 60; // km/h
    const tiempoMinutos = Math.round((distancia / velocidadPromedio) * 60);
    const horas = Math.floor(tiempoMinutos / 60);
    const minutos = tiempoMinutos % 60;
    return `${horas}h ${minutos}min`;
}

// Función para calcular precio de transporte
function calcularPrecioTransporte(distancia, tipoViaje) {
    const precioBase = precioPorKm[tipoViaje] || precioPorKm.local;
    const precioTotal = distancia * precioBase;
    
    // Aplicar descuentos o recargos según distancia
    let precioFinal = precioTotal;
    if (distancia > 100) {
        precioFinal *= 0.9; // 10% descuento para viajes largos
    } else if (distancia < 10) {
        precioFinal = Math.max(precioFinal, 8000); // Precio mínimo $8,000
    }
    
    return Math.round(precioFinal);
}

// Función para mostrar formulario de reserva de transporte
function mostrarFormularioReservaTransporte() {
    if (direccionesCalculadas.precio === 0) {
        mostrarNotificacion('Primero calcula la ruta', 'error');
        return;
    }
    
    document.getElementById('formularioReservaTransporte').style.display = 'block';
    document.getElementById('btnReservarTransporte').style.display = 'none';
    
    // Establecer fecha mínima como hoy
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaTransporte').min = hoy;
    
    console.log('✅ Formulario de reserva de transporte mostrado');
}

// Función para cancelar reserva de transporte
function cancelarReservaTransporte() {
    document.getElementById('formularioReservaTransporte').style.display = 'none';
    document.getElementById('btnReservarTransporte').style.display = 'block';
    limpiarFormularioReservaTransporte();
    console.log('✅ Reserva de transporte cancelada');
}

// Función para limpiar formulario de reserva
function limpiarFormularioReservaTransporte() {
    document.getElementById('nombreTransporte').value = '';
    document.getElementById('telefonoTransporte').value = '';
    document.getElementById('emailTransporte').value = '';
    document.getElementById('fechaTransporte').value = '';
    document.getElementById('horaTransporte').value = '';
    document.getElementById('comentariosTransporte').value = '';
}

// Función para confirmar reserva de transporte
function confirmarReservaTransporte() {
    const nombre = document.getElementById('nombreTransporte').value.trim();
    const telefono = document.getElementById('telefonoTransporte').value.trim();
    const email = document.getElementById('emailTransporte').value.trim();
    const fecha = document.getElementById('fechaTransporte').value;
    const hora = document.getElementById('horaTransporte').value;
    const comentarios = document.getElementById('comentariosTransporte').value.trim();
    
    if (!nombre || !telefono || !email || !fecha || !hora) {
        mostrarNotificacion('Por favor, completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Crear objeto de reserva
    const reserva = {
        id: 'TR-' + Date.now(),
        tipo: 'transporte',
        cliente: {
            nombre: nombre,
            telefono: telefono,
            email: email
        },
        viaje: {
            origen: direccionesCalculadas.origen,
            destino: direccionesCalculadas.destino,
            distancia: direccionesCalculadas.distancia,
            duracion: direccionesCalculadas.duracion,
            fecha: fecha,
            hora: hora,
            precio: direccionesCalculadas.precio
        },
        comentarios: comentarios,
        fechaReserva: new Date().toISOString(),
        estado: 'confirmada'
    };
    
    // Guardar reserva
    guardarReserva(reserva);
    
    // Mostrar opciones de comprobante
    mostrarOpcionesComprobante(reserva);
    
    // Limpiar y cerrar
    cancelarReservaTransporte();
    cerrarModalTransporte();
    
    console.log('✅ Reserva de transporte confirmada:', reserva);
}

// ===== SISTEMA DE COMPROBANTES =====

// Función para mostrar opciones de comprobante
function mostrarOpcionesComprobante(reserva) {
    const opciones = `
        <div class="modal-comprobante-overlay" id="modalComprobante">
            <div class="modal-comprobante">
                <div class="modal-comprobante-header">
                    <h3>🎉 ¡Reserva Confirmada!</h3>
                    <button onclick="cerrarModalComprobante()" class="cerrar-modal">&times;</button>
                </div>
                <div class="modal-comprobante-content">
                    <div class="reserva-info">
                        <h4>📋 Detalles de la Reserva</h4>
                        <p><strong>ID:</strong> ${reserva.id}</p>
                        <p><strong>Cliente:</strong> ${reserva.cliente.nombre}</p>
                        <p><strong>Fecha:</strong> ${formatearFecha(reserva.viaje.fecha)}</p>
                        <p><strong>Hora:</strong> ${reserva.viaje.hora}</p>
                        <p><strong>Precio:</strong> $${reserva.viaje.precio.toLocaleString()}</p>
                    </div>
                    
                    <div class="opciones-comprobante">
                        <h4>📄 ¿Cómo deseas recibir tu comprobante?</h4>
                        <div class="opciones-botones">
                            <button onclick="descargarComprobante('${reserva.id}')" class="btn-descargar">
                                <i class="fas fa-download"></i> Descargar PDF
                            </button>
                            <button onclick="enviarComprobanteEmail('${reserva.id}')" class="btn-email">
                                <i class="fas fa-envelope"></i> Enviar por Email
                            </button>
                            <button onclick="enviarComprobanteWhatsApp('${reserva.id}')" class="btn-whatsapp">
                                <i class="fab fa-whatsapp"></i> Enviar por WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', opciones);
    document.body.style.overflow = 'hidden';
}

// Función para cerrar modal de comprobante
function cerrarModalComprobante() {
    const modal = document.getElementById('modalComprobante');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
        
        // Reiniciar event listeners después de cerrar
        setTimeout(() => {
            reiniciarEventListeners();
        }, 100);
    }
}

// Función para descargar comprobante
function descargarComprobante(reservaId) {
    const reserva = obtenerReserva(reservaId);
    if (!reserva) {
        mostrarNotificacion('Reserva no encontrada', 'error');
        return;
    }
    
    generarComprobantePDF(reserva);
    mostrarNotificacion('Comprobante descargado', 'success');
}

// Función para enviar comprobante por email
function enviarComprobanteEmail(reservaId) {
    const reserva = obtenerReserva(reservaId);
    if (!reserva) {
        mostrarNotificacion('Reserva no encontrada', 'error');
        return;
    }
    
    // Simular envío por email
    mostrarNotificacion('Comprobante enviado por email', 'success');
    console.log('📧 Comprobante enviado por email a:', reserva.cliente.email);
}

// Función para enviar comprobante por WhatsApp
function enviarComprobanteWhatsApp(reservaId) {
    const reserva = obtenerReserva(reservaId);
    if (!reserva) {
        mostrarNotificacion('Reserva no encontrada', 'error');
        return;
    }
    
    // Crear mensaje de WhatsApp
    const mensaje = `🎉 ¡Tu reserva de transporte ha sido confirmada!

📋 ID: ${reserva.id}
👤 Cliente: ${reserva.cliente.nombre}
📅 Fecha: ${formatearFecha(reserva.viaje.fecha)}
🕐 Hora: ${reserva.viaje.hora}
📍 Origen: ${reserva.viaje.origen}
🎯 Destino: ${reserva.viaje.destino}
💰 Precio: $${reserva.viaje.precio.toLocaleString()}

¡Gracias por elegir FRIOCAS! 🚗✨`;
    
    const urlWhatsApp = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
    
    mostrarNotificacion('Comprobante enviado por WhatsApp', 'success');
}

// ===== INTEGRACIÓN MERCADO PAGO =====

// Función para inicializar Mercado Pago
function inicializarMercadoPago() {
    if (typeof Mercadopago !== 'undefined') {
        Mercadopago.setPublishableKey(MERCADO_PAGO_CONFIG.publicKey);
        console.log('✅ Mercado Pago inicializado');
    } else {
        console.log('⚠️ Mercado Pago no disponible - cargar SDK primero');
    }
}

// Función para procesar pago con Mercado Pago
function procesarPagoMercadoPago(datosPago, callback) {
    if (!Mercadopago) {
        console.error('❌ Mercado Pago SDK no cargado');
        callback({ success: false, error: 'SDK no disponible' });
        return;
    }
    
    const paymentData = {
        transaction_amount: parseFloat(datosPago.monto),
        description: datosPago.descripcion,
        payment_method_id: datosPago.paymentMethodId,
        payer: {
            email: datosPago.email,
            identification: {
                type: datosPago.identificationType,
                number: datosPago.identificationNumber
            }
        }
    };
    
    Mercadopago.create_payment(paymentData, callback);
}

// Función para obtener métodos de pago disponibles
function obtenerMetodosPagoMercadoPago(callback) {
    if (!Mercadopago) {
        console.error('❌ Mercado Pago SDK no cargado');
        return;
    }
    
    Mercadopago.getPaymentMethods(callback);
}

// ===== FUNCIONES DE GESTIÓN DE RESERVAS =====

// Función para guardar reserva
function guardarReserva(reserva) {
    let reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));
    console.log('✅ Reserva guardada:', reserva.id);
}

// Función para obtener reserva
function obtenerReserva(reservaId) {
    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    return reservas.find(r => r.id === reservaId);
}

// Función para generar comprobante PDF
function generarComprobantePDF(reserva) {
    // Crear contenido del PDF
    const contenido = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; border-bottom: 2px solid #667eea; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="color: #667eea; margin: 0;">FRIOCAS</h1>
                <p style="color: #666; margin: 5px 0;">Servicios de Transporte</p>
                <p style="color: #666; margin: 5px 0;">${CONFIG.direccion}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #333; margin-top: 0;">🎉 COMPROBANTE DE RESERVA</h2>
                <p style="color: #28a745; font-weight: bold; margin: 0;">Estado: CONFIRMADA</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #333;">📋 Información de la Reserva</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>ID de Reserva:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${reserva.id}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Fecha de Reserva:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formatearFecha(reserva.fechaReserva)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Tipo de Servicio:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">Transporte Privado</td>
                    </tr>
                </table>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #333;">👤 Datos del Cliente</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Nombre:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${reserva.cliente.nombre}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${reserva.cliente.telefono}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${reserva.cliente.email}</td>
                    </tr>
                </table>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #333;">🚗 Detalles del Viaje</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Origen:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${reserva.viaje.origen}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Destino:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${reserva.viaje.destino}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Distancia:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${reserva.viaje.distancia} km</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Duración estimada:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${reserva.viaje.duracion}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Fecha de viaje:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formatearFecha(reserva.viaje.fecha)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Hora de viaje:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${reserva.viaje.hora}</td>
                    </tr>
                </table>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="color: #28a745; margin-top: 0;">💰 Información de Pago</h3>
                <p style="font-size: 24px; font-weight: bold; color: #28a745; margin: 0;">
                    Precio Total: $${reserva.viaje.precio.toLocaleString()}
                </p>
            </div>
            
            ${reserva.comentarios ? `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #333;">📝 Comentarios Adicionales</h3>
                <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 0;">${reserva.comentarios}</p>
            </div>
            ` : ''}
            
            <div style="text-align: center; border-top: 2px solid #667eea; padding-top: 20px; margin-top: 30px;">
                <p style="color: #666; margin: 5px 0;">¡Gracias por elegir FRIOCAS!</p>
                <p style="color: #666; margin: 5px 0;">Para consultas: ${CONFIG.telefono}</p>
                <p style="color: #666; margin: 5px 0;">${CONFIG.email}</p>
            </div>
        </div>
    `;
    
    // Crear ventana para imprimir
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(`
        <html>
            <head>
                <title>Comprobante de Reserva - ${reserva.id}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${contenido}
                <div class="no-print" style="text-align: center; margin-top: 20px;">
                    <button onclick="window.print()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        🖨️ Imprimir Comprobante
                    </button>
                    <button onclick="window.close()" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                        ❌ Cerrar
                    </button>
                </div>
            </body>
        </html>
    `);
    ventanaImpresion.document.close();
}

// Función para formatear fecha
function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===== FUNCIONES PARA OTROS SERVICIOS =====

// Función para confirmar reserva de servicio general
function confirmarReservaServicio(servicioId, datosCliente) {
    const servicio = SERVICIOS_DATA[servicioId];
    if (!servicio) {
        mostrarNotificacion('Servicio no encontrado', 'error');
        return;
    }
    
    const reserva = {
        id: 'SR-' + Date.now(),
        tipo: 'servicio',
        servicio: {
            id: servicio.id,
            nombre: servicio.nombre,
            precio: servicio.precio,
            duracion: servicio.duracion
        },
        cliente: datosCliente,
        fechaReserva: new Date().toISOString(),
        estado: 'confirmada'
    };
    
    guardarReserva(reserva);
    mostrarOpcionesComprobante(reserva);
    
    console.log('✅ Reserva de servicio confirmada:', reserva);
}

// ===== EXPONER FUNCIONES AL CONTEXTO GLOBAL =====
window.toggleCart = toggleCart;
window.agregarAlCarrito = agregarAlCarrito;
window.actualizarCarrito = actualizarCarrito;
window.abrirCarrito = abrirCarrito;
window.cerrarCarrito = cerrarCarrito;
window.limpiarCarrito = limpiarCarrito;
window.mostrarCarrito = mostrarCarrito;
// Función removida para simplificar la interfaz
window.calcularPrecio = calcularPrecio;
window.reiniciarEventListeners = reiniciarEventListeners;
// Función de debug removida para producción
window.mostrarModalTransporte = mostrarModalTransporte;
window.cerrarModalTransporte = cerrarModalTransporte;
window.calcularRuta = calcularRuta;
window.mostrarFormularioReservaTransporte = mostrarFormularioReservaTransporte;
window.cancelarReservaTransporte = cancelarReservaTransporte;
window.confirmarReservaTransporte = confirmarReservaTransporte;
window.descargarComprobante = descargarComprobante;
window.enviarComprobanteEmail = enviarComprobanteEmail;
window.enviarComprobanteWhatsApp = enviarComprobanteWhatsApp;
window.cerrarModalComprobante = cerrarModalComprobante;
window.confirmarReservaServicio = confirmarReservaServicio;

// ===== SISTEMA DE MAPA DE TRANSPORTE =====
// Variables para el mapa de transporte
let mapaTransporte = null;
let directionsService = null;
let directionsRenderer = null;

// Función para inicializar mapa de transporte
function inicializarMapaTransporte() {
    const mapaContainer = document.getElementById('mapaTransporte');
    if (!mapaContainer) {
        console.log('Contenedor del mapa de transporte no encontrado');
        return;
    }
    
    // Verificar si Google Maps está cargado
    if (typeof google === 'undefined' || !google.maps) {
        console.log('Google Maps no está cargado aún, reintentando en 2 segundos...');
        setTimeout(inicializarMapaTransporte, 2000);
        return;
    }
    
    try {
        // Crear el mapa
        mapaTransporte = new google.maps.Map(mapaContainer, {
            center: FRIOCAS_COORDS,
            zoom: 10,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
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
                }
            ]
        });
        
        // Inicializar servicios de direcciones
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer({
            map: mapaTransporte,
            suppressMarkers: false,
            polylineOptions: {
                strokeColor: '#2563eb',
                strokeWeight: 4
            }
        });
        
        console.log('✅ Mapa de transporte inicializado correctamente');
    } catch (error) {
        console.error('❌ Error inicializando mapa de transporte:', error);
    }
}

// Función para calcular ruta usando Google Maps API
function calcularRutaGoogleMaps(origen, destino, tipoViaje) {
    if (!directionsService || !directionsRenderer) {
        console.log('Servicios de direcciones no disponibles, usando cálculo simulado');
        const distancia = calcularDistanciaSimulada(origen, destino);
        const duracion = calcularDuracionSimulada(distancia);
        const precio = calcularPrecioTransporte(distancia, tipoViaje);
        actualizarResultadosTransporte(distancia, duracion, precio, origen, destino);
        return;
    }
    
    const request = {
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
    };
    
    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            
            const route = result.routes[0];
            const leg = route.legs[0];
            
            // Extraer distancia en km
            const distanciaText = leg.distance.text;
            const distancia = parseFloat(distanciaText.replace(' km', '').replace(',', '.'));
            const duracion = leg.duration.text;
            const precio = calcularPrecioTransporte(distancia, tipoViaje);
            
            actualizarResultadosTransporte(distancia, duracion, precio, origen, destino);
            
            console.log('✅ Ruta calculada con Google Maps:', { distancia, duracion, precio });
        } else {
            console.error('❌ Error calculando ruta:', status);
            mostrarNotificacion('Error al calcular la ruta. Usando cálculo estimado.', 'warning');
            
            // Fallback a cálculo simulado
            const distancia = calcularDistanciaSimulada(origen, destino);
            const duracion = calcularDuracionSimulada(distancia);
            const precio = calcularPrecioTransporte(distancia, tipoViaje);
            actualizarResultadosTransporte(distancia, duracion, precio, origen, destino);
        }
    });
}

// Función para actualizar resultados del transporte
function actualizarResultadosTransporte(distancia, duracion, precio, origen, destino) {
    document.getElementById('distanciaCalculada').textContent = `${distancia} km`;
    document.getElementById('duracionCalculada').textContent = duracion;
    document.getElementById('precioCalculado').textContent = `$${precio.toLocaleString()}`;
    document.getElementById('btnReservarTransporte').disabled = false;
    
    // Guardar datos para la reserva
    direccionesCalculadas = {
        origen: origen,
        destino: destino,
        distancia: distancia,
        duracion: duracion,
        precio: precio
    };
    
    mostrarNotificacion(`Ruta calculada: ${distancia} km - $${precio.toLocaleString()}`, 'success');
    console.log('✅ Resultados de transporte actualizados:', direccionesCalculadas);
}

// Exponer funciones del mapa de transporte al contexto global
window.inicializarMapaTransporte = inicializarMapaTransporte;
window.calcularRutaGoogleMaps = calcularRutaGoogleMaps;
window.actualizarResultadosTransporte = actualizarResultadosTransporte;
window.debugProductos = debugProductos;
window.debugMapa = debugMapa;
window.crearMapaEstatico = crearMapaEstatico;
window.abrirGoogleMaps = abrirGoogleMaps;
