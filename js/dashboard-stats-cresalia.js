// ===== SISTEMA DE ESTADÍSTICAS DINÁMICAS - CRESALIA =====
// Actualiza las estadísticas del dashboard con datos reales

console.log('📊 Inicializando sistema de estadísticas Cresalia...');

// ===== FUNCIÓN PARA ACTUALIZAR ESTADÍSTICAS DEL DASHBOARD =====

function actualizarEstadisticasDashboard() {
    console.log('📊 Actualizando estadísticas del dashboard...');
    
    try {
        // ===== CONTAR PRODUCTOS REALES =====
        let totalProductos = 0;
        let totalCategorias = 0;
        
        // Contar productos desde localStorage
        const productosData = localStorage.getItem('cresalia_productos');
        if (productosData) {
            try {
                const productos = JSON.parse(productosData);
                if (Array.isArray(productos)) {
                    totalProductos = productos.length;
                    console.log(`📦 Productos encontrados: ${totalProductos}`);
                    
                    // Contar categorías únicas
                    const categorias = new Set();
                    productos.forEach(producto => {
                        if (producto.categoria) {
                            categorias.add(producto.categoria);
                        }
                    });
                    totalCategorias = categorias.size;
                    console.log(`🏷️ Categorías encontradas: ${totalCategorias}`);
                }
            } catch (error) {
                console.error('❌ Error parseando productos:', error);
            }
        }
        
        // También contar productos desde tiendas individuales
        const tiendas = JSON.parse(localStorage.getItem('cresalia_tiendas') || '[]');
        let productosTiendas = 0;
        let categoriasTiendas = new Set();
        
        tiendas.forEach(tienda => {
            if (tienda.productos && Array.isArray(tienda.productos)) {
                productosTiendas += tienda.productos.length;
                tienda.productos.forEach(producto => {
                    if (producto.categoria) {
                        categoriasTiendas.add(producto.categoria);
                    }
                });
            }
        });
        
        // Sumar todos los productos
        const totalProductosFinal = totalProductos + productosTiendas;
        const totalCategoriasFinal = Math.max(totalCategorias, categoriasTiendas.size);
        
        console.log(`📊 Totales finales - Productos: ${totalProductosFinal}, Categorías: ${totalCategoriasFinal}`);
        
        // ===== ACTUALIZAR ELEMENTOS DEL DOM =====
        
        // Actualizar productos
        const elementoProductos = document.getElementById('total-productos');
        if (elementoProductos) {
            elementoProductos.textContent = totalProductosFinal;
            elementoProductos.style.color = totalProductosFinal > 0 ? '#22c55e' : '#ef4444';
        }
        
        // Actualizar categorías
        const elementoCategorias = document.getElementById('total-categorias');
        if (elementoCategorias) {
            elementoCategorias.textContent = totalCategoriasFinal;
            elementoCategorias.style.color = totalCategoriasFinal > 0 ? '#22c55e' : '#ef4444';
        }
        
        // ===== CONTAR VENTAS DEL DÍA =====
        let ventasHoy = 0;
        const hoy = new Date().toDateString();
        
        // Contar ventas desde localStorage
        const ventasData = localStorage.getItem('cresalia_ventas');
        if (ventasData) {
            try {
                const ventas = JSON.parse(ventasData);
                if (Array.isArray(ventas)) {
                    ventasHoy = ventas.filter(venta => {
                        const fechaVenta = new Date(venta.fecha).toDateString();
                        return fechaVenta === hoy;
                    }).length;
                }
            } catch (error) {
                console.error('❌ Error parseando ventas:', error);
            }
        }
        
        // Actualizar ventas
        const elementoVentas = document.getElementById('ventas-hoy');
        if (elementoVentas) {
            elementoVentas.textContent = ventasHoy;
            elementoVentas.style.color = ventasHoy > 0 ? '#22c55e' : '#6b7280';
        }
        
        // ===== CONTAR CLIENTES NUEVOS =====
        let clientesNuevos = 0;
        
        // Contar clientes nuevos del día
        const clientesData = localStorage.getItem('cresalia_clientes');
        if (clientesData) {
            try {
                const clientes = JSON.parse(clientesData);
                if (Array.isArray(clientes)) {
                    clientesNuevos = clientes.filter(cliente => {
                        const fechaCliente = new Date(cliente.fecha_registro).toDateString();
                        return fechaCliente === hoy;
                    }).length;
                }
            } catch (error) {
                console.error('❌ Error parseando clientes:', error);
            }
        }
        
        // Actualizar clientes nuevos
        const elementoClientes = document.getElementById('clientes-nuevos');
        if (elementoClientes) {
            elementoClientes.textContent = clientesNuevos;
            elementoClientes.style.color = clientesNuevos > 0 ? '#22c55e' : '#6b7280';
        }
        
        console.log('✅ Estadísticas actualizadas exitosamente');
        console.log(`📊 Resumen: ${totalProductosFinal} productos, ${totalCategoriasFinal} categorías, ${ventasHoy} ventas hoy, ${clientesNuevos} clientes nuevos`);
        
    } catch (error) {
        console.error('❌ Error actualizando estadísticas:', error);
    }
}

// ===== FUNCIÓN PARA CARGAR PRODUCTOS EN EL DASHBOARD =====

function cargarProductosEnDashboard() {
    console.log('📦 Cargando productos en el dashboard...');
    
    try {
        const productosData = localStorage.getItem('cresalia_productos');
        const productosContainer = document.getElementById('productos-recientes');
        
        if (!productosContainer) {
            console.log('⚠️ Contenedor de productos no encontrado');
            return;
        }
        
        if (!productosData) {
            productosContainer.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-box-open"></i>
                    <p>No hay productos registrados</p>
                    <small>Los productos aparecerán aquí cuando los agregues</small>
                </div>
            `;
            return;
        }
        
        const productos = JSON.parse(productosData);
        
        if (!Array.isArray(productos) || productos.length === 0) {
            productosContainer.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-box-open"></i>
                    <p>No hay productos registrados</p>
                    <small>Los productos aparecerán aquí cuando los agregues</small>
                </div>
            `;
            return;
        }
        
        // Mostrar los últimos 5 productos
        const productosRecientes = productos.slice(-5).reverse();
        
        productosContainer.innerHTML = productosRecientes.map(producto => `
            <div class="producto-item">
                <div class="producto-info">
                    <h4>${producto.nombre || 'Producto sin nombre'}</h4>
                    <p class="producto-precio">$${producto.precio || '0'}</p>
                    <span class="producto-categoria">${producto.categoria || 'Sin categoría'}</span>
                </div>
                <div class="producto-acciones">
                    <button class="btn-ver" onclick="verProducto('${producto.id || ''}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        console.log(`✅ ${productosRecientes.length} productos cargados en el dashboard`);
        
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
    }
}

// ===== FUNCIÓN PARA INICIALIZAR DASHBOARD =====

function inicializarDashboard() {
    console.log('🚀 Inicializando dashboard Cresalia...');
    
    // Actualizar estadísticas
    actualizarEstadisticasDashboard();
    
    // Cargar productos
    cargarProductosEnDashboard();
    
    // Actualizar cada 30 segundos
    setInterval(actualizarEstadisticasDashboard, 30000);
    
    console.log('✅ Dashboard inicializado');
}

// ===== EXPORTAR FUNCIONES =====

window.actualizarEstadisticasDashboard = actualizarEstadisticasDashboard;
window.cargarProductosEnDashboard = cargarProductosEnDashboard;
window.inicializarDashboard = inicializarDashboard;

// ===== OPTIMIZACIÓN PARA NOTEBOOKS CON POCA RAM =====

// Configuración de rendimiento
const PERFORMANCE_CONFIG = {
    updateInterval: 60000, // Actualizar cada minuto en lugar de 30 segundos
    maxProductsDisplay: 3, // Mostrar solo 3 productos en lugar de 5
    enableCaching: true, // Habilitar caché para evitar recálculos
    lazyLoading: true // Cargar datos solo cuando sea necesario
};

// Cache para evitar recálculos innecesarios
let statsCache = {
    lastUpdate: 0,
    data: null,
    cacheDuration: 30000 // 30 segundos de caché
};

// ===== FUNCIÓN OPTIMIZADA PARA ACTUALIZAR ESTADÍSTICAS =====

function actualizarEstadisticasDashboardOptimizado() {
    const now = Date.now();
    
    // Usar caché si está disponible y no ha expirado
    if (PERFORMANCE_CONFIG.enableCaching && 
        statsCache.data && 
        (now - statsCache.lastUpdate) < statsCache.cacheDuration) {
        console.log('📊 Usando datos en caché');
        aplicarEstadisticasACache(statsCache.data);
        return;
    }
    
    console.log('📊 Actualizando estadísticas del dashboard (optimizado)...');
    
    try {
        // Cálculo optimizado de estadísticas
        const stats = calcularEstadisticasOptimizado();
        
        // Actualizar caché
        statsCache.data = stats;
        statsCache.lastUpdate = now;
        
        // Aplicar a la interfaz
        aplicarEstadisticasACache(stats);
        
        console.log('✅ Estadísticas actualizadas (optimizado)');
        
    } catch (error) {
        console.error('❌ Error actualizando estadísticas:', error);
    }
}

// ===== FUNCIÓN OPTIMIZADA PARA CALCULAR ESTADÍSTICAS =====

function calcularEstadisticasOptimizado() {
    const stats = {
        productos: 0,
        categorias: 0,
        ventas: 0,
        clientes: 0
    };
    
    try {
        // Contar productos de manera eficiente
        const productosData = localStorage.getItem('cresalia_productos');
        if (productosData) {
            const productos = JSON.parse(productosData);
            if (Array.isArray(productos)) {
                stats.productos = productos.length;
                
                // Contar categorías únicas de manera eficiente
                const categorias = new Set();
                productos.forEach(producto => {
                    if (producto.categoria) {
                        categorias.add(producto.categoria);
                    }
                });
                stats.categorias = categorias.size;
            }
        }
        
        // Contar ventas del día de manera eficiente
        const hoy = new Date().toDateString();
        const ventasData = localStorage.getItem('cresalia_ventas');
        if (ventasData) {
            const ventas = JSON.parse(ventasData);
            if (Array.isArray(ventas)) {
                stats.ventas = ventas.filter(venta => {
                    const fechaVenta = new Date(venta.fecha).toDateString();
                    return fechaVenta === hoy;
                }).length;
            }
        }
        
        // Contar clientes nuevos del día de manera eficiente
        const clientesData = localStorage.getItem('cresalia_clientes');
        if (clientesData) {
            const clientes = JSON.parse(clientesData);
            if (Array.isArray(clientes)) {
                stats.clientes = clientes.filter(cliente => {
                    const fechaCliente = new Date(cliente.fecha_registro).toDateString();
                    return fechaCliente === hoy;
                }).length;
            }
        }
        
    } catch (error) {
        console.error('❌ Error calculando estadísticas:', error);
    }
    
    return stats;
}

// ===== FUNCIÓN PARA APLICAR ESTADÍSTICAS DESDE CACHÉ =====

function aplicarEstadisticasACache(stats) {
    // Actualizar productos
    const elementoProductos = document.getElementById('total-productos');
    if (elementoProductos) {
        elementoProductos.textContent = stats.productos;
        elementoProductos.style.color = stats.productos > 0 ? '#22c55e' : '#ef4444';
    }
    
    // Actualizar categorías
    const elementoCategorias = document.getElementById('total-categorias');
    if (elementoCategorias) {
        elementoCategorias.textContent = stats.categorias;
        elementoCategorias.style.color = stats.categorias > 0 ? '#22c55e' : '#ef4444';
    }
    
    // Actualizar ventas
    const elementoVentas = document.getElementById('ventas-hoy');
    if (elementoVentas) {
        elementoVentas.textContent = stats.ventas;
        elementoVentas.style.color = stats.ventas > 0 ? '#22c55e' : '#6b7280';
    }
    
    // Actualizar clientes
    const elementoClientes = document.getElementById('clientes-nuevos');
    if (elementoClientes) {
        elementoClientes.textContent = stats.clientes;
        elementoClientes.style.color = stats.clientes > 0 ? '#22c55e' : '#6b7280';
    }
}

// ===== FUNCIÓN OPTIMIZADA PARA CARGAR PRODUCTOS =====

function cargarProductosEnDashboardOptimizado() {
    console.log('📦 Cargando productos en el dashboard (optimizado)...');
    
    try {
        const productosData = localStorage.getItem('cresalia_productos');
        const productosContainer = document.getElementById('productos-recientes');
        
        if (!productosContainer) {
            console.log('⚠️ Contenedor de productos no encontrado');
            return;
        }
        
        if (!productosData) {
            productosContainer.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-box-open"></i>
                    <p>No hay productos registrados</p>
                    <small>Los productos aparecerán aquí cuando los agregues</small>
                </div>
            `;
            return;
        }
        
        const productos = JSON.parse(productosData);
        
        if (!Array.isArray(productos) || productos.length === 0) {
            productosContainer.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-box-open"></i>
                    <p>No hay productos registrados</p>
                    <small>Los productos aparecerán aquí cuando los agregues</small>
                </div>
            `;
            return;
        }
        
        // Mostrar solo los últimos productos según la configuración de rendimiento
        const productosRecientes = productos.slice(-PERFORMANCE_CONFIG.maxProductsDisplay).reverse();
        
        productosContainer.innerHTML = productosRecientes.map(producto => `
            <div class="producto-item">
                <div class="producto-info">
                    <h4>${producto.nombre || 'Producto sin nombre'}</h4>
                    <p class="producto-precio">$${producto.precio || '0'}</p>
                    <span class="producto-categoria">${producto.categoria || 'Sin categoría'}</span>
                </div>
                <div class="producto-acciones">
                    <button class="btn-ver" onclick="verProducto('${producto.id || ''}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        console.log(`✅ ${productosRecientes.length} productos cargados (optimizado)`);
        
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
    }
}

// ===== FUNCIÓN OPTIMIZADA PARA INICIALIZAR DASHBOARD =====

function inicializarDashboardOptimizado() {
    console.log('🚀 Inicializando dashboard Cresalia (optimizado para rendimiento)...');
    
    // Actualizar estadísticas
    actualizarEstadisticasDashboardOptimizado();
    
    // Cargar productos
    cargarProductosEnDashboardOptimizado();
    
    // Actualizar cada minuto en lugar de cada 30 segundos
    setInterval(actualizarEstadisticasDashboardOptimizado, PERFORMANCE_CONFIG.updateInterval);
    
    console.log('✅ Dashboard inicializado (optimizado)');
}

// ===== AUTO-INICIALIZACIÓN OPTIMIZADA =====

document.addEventListener('DOMContentLoaded', function() {
    // Usar lazy loading - solo inicializar cuando sea necesario
    if (PERFORMANCE_CONFIG.lazyLoading) {
        // Inicializar solo si estamos en la sección dashboard
        const isDashboardVisible = document.getElementById('dashboard') && 
                                 !document.getElementById('dashboard').style.display === 'none';
        
        if (isDashboardVisible) {
            setTimeout(inicializarDashboardOptimizado, 1000);
        } else {
            // Inicializar cuando se muestre el dashboard
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'style' &&
                        mutation.target.id === 'dashboard' &&
                        !mutation.target.style.display) {
                        inicializarDashboardOptimizado();
                        observer.disconnect();
                    }
                });
            });
            
            const dashboardElement = document.getElementById('dashboard');
            if (dashboardElement) {
                observer.observe(dashboardElement, { attributes: true });
            }
        }
    } else {
        // Inicialización normal
        setTimeout(inicializarDashboardOptimizado, 1000);
    }
});
