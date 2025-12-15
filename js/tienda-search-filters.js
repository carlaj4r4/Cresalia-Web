// ===== SISTEMA DE BÚSQUEDA Y FILTROS PARA TIENDAS INDIVIDUALES - CRESALIA =====
// Sistema de búsqueda y filtros que se integra con las tiendas de los clientes

console.log('🔍 Inicializando sistema de búsqueda para tiendas individuales...');

class TiendaSearchSystem {
    constructor() {
        this.productos = [];
        this.filtrosActivos = {
            busqueda: '',
            categoria: '',
            precioMin: '',
            precioMax: '',
            rating: '',
            disponibilidad: 'todos'
        };
        this.ordenamiento = 'relevancia';
        this.cargarProductos();
        this.inicializarEventos();
    }

    // ===== CARGAR PRODUCTOS =====
    cargarProductos() {
        // Cargar productos desde localStorage de la tienda específica
        const tiendaId = this.obtenerTiendaId();
        const productosData = localStorage.getItem(`cresalia_productos_${tiendaId}`) || 
                             localStorage.getItem('cresalia_productos') || '[]';
        
        this.productos = JSON.parse(productosData);
        console.log(`📦 ${this.productos.length} productos cargados para la tienda`);
    }

    // ===== OBTENER ID DE TIENDA =====
    obtenerTiendaId() {
        // Intentar obtener el ID de la tienda desde la URL o localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const tiendaId = urlParams.get('tienda') || 
                        localStorage.getItem('cresalia_current_tenant') || 
                        'default';
        return tiendaId;
    }

    // ===== INICIALIZAR EVENTOS =====
    inicializarEventos() {
        // Búsqueda en tiempo real
        const searchInput = document.getElementById('tienda-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filtrosActivos.busqueda = e.target.value;
                this.aplicarFiltros();
            });
        }

        // Filtros de categoría
        const categoriaSelect = document.getElementById('tienda-categoria');
        if (categoriaSelect) {
            categoriaSelect.addEventListener('change', (e) => {
                this.filtrosActivos.categoria = e.target.value;
                this.aplicarFiltros();
            });
        }

        // Filtros de precio
        const precioMin = document.getElementById('tienda-precio-min');
        const precioMax = document.getElementById('tienda-precio-max');
        if (precioMin) {
            precioMin.addEventListener('input', (e) => {
                this.filtrosActivos.precioMin = e.target.value;
                this.aplicarFiltros();
            });
        }
        if (precioMax) {
            precioMax.addEventListener('input', (e) => {
                this.filtrosActivos.precioMax = e.target.value;
                this.aplicarFiltros();
            });
        }

        // Ordenamiento
        const ordenSelect = document.getElementById('tienda-orden');
        if (ordenSelect) {
            ordenSelect.addEventListener('change', (e) => {
                this.ordenamiento = e.target.value;
                this.aplicarFiltros();
            });
        }

        // Botón limpiar filtros
        const btnLimpiar = document.getElementById('btn-limpiar-filtros');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => this.limpiarFiltros());
        }
    }

    // ===== APLICAR FILTROS =====
    aplicarFiltros() {
        // Primero filtrar productos eliminados u ocultos
        let productosFiltrados = this.productos.filter(producto => {
            // EXCLUIR productos eliminados u ocultos
            return !(producto.eliminado === true || producto.oculto === true || producto.visible === false);
        });

        // Filtro de búsqueda
        if (this.filtrosActivos.busqueda) {
            const busqueda = this.filtrosActivos.busqueda.toLowerCase();
            productosFiltrados = productosFiltrados.filter(producto =>
                producto.nombre?.toLowerCase().includes(busqueda) ||
                producto.descripcion?.toLowerCase().includes(busqueda) ||
                producto.categoria?.toLowerCase().includes(busqueda) ||
                producto.tags?.some(tag => tag.toLowerCase().includes(busqueda))
            );
        }

        // Filtro de categoría
        if (this.filtrosActivos.categoria && this.filtrosActivos.categoria !== 'todas') {
            productosFiltrados = productosFiltrados.filter(producto =>
                producto.categoria === this.filtrosActivos.categoria
            );
        }

        // Filtro de precio
        if (this.filtrosActivos.precioMin) {
            productosFiltrados = productosFiltrados.filter(producto =>
                parseFloat(producto.precio) >= parseFloat(this.filtrosActivos.precioMin)
            );
        }
        if (this.filtrosActivos.precioMax) {
            productosFiltrados = productosFiltrados.filter(producto =>
                parseFloat(producto.precio) <= parseFloat(this.filtrosActivos.precioMax)
            );
        }

        // Filtro de rating
        if (this.filtrosActivos.rating) {
            productosFiltrados = productosFiltrados.filter(producto =>
                producto.rating >= parseFloat(this.filtrosActivos.rating)
            );
        }

        // Filtro de disponibilidad
        if (this.filtrosActivos.disponibilidad !== 'todos') {
            productosFiltrados = productosFiltrados.filter(producto => {
                if (this.filtrosActivos.disponibilidad === 'disponible') {
                    return producto.stock > 0;
                } else if (this.filtrosActivos.disponibilidad === 'agotado') {
                    return producto.stock === 0;
                }
                return true;
            });
        }

        // Ordenamiento
        productosFiltrados = this.ordenarProductos(productosFiltrados);

        // Mostrar resultados
        this.mostrarProductos(productosFiltrados);
        this.mostrarEstadisticas(productosFiltrados);
    }

    // ===== ORDENAR PRODUCTOS =====
    ordenarProductos(productos) {
        switch (this.ordenamiento) {
            case 'precio_asc':
                return productos.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
            case 'precio_desc':
                return productos.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
            case 'nombre_asc':
                return productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
            case 'nombre_desc':
                return productos.sort((a, b) => b.nombre.localeCompare(a.nombre));
            case 'rating':
                return productos.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'nuevos':
                return productos.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
            default:
                return productos;
        }
    }

    // ===== MOSTRAR PRODUCTOS =====
    mostrarProductos(productos) {
        const container = document.getElementById('productos-container');
        if (!container) return;

        if (productos.length === 0) {
            container.innerHTML = `
                <div class="no-productos">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta ajustar los filtros de búsqueda</p>
                    <button class="btn-limpiar" onclick="tiendaSearchSystem.limpiarFiltros()">
                        Limpiar Filtros
                    </button>
                </div>
            `;
            return;
        }

        const productosHTML = productos.map(producto => this.generarHTMLProducto(producto)).join('');
        container.innerHTML = productosHTML;
    }

    // ===== GENERAR HTML DEL PRODUCTO =====
    generarHTMLProducto(producto) {
        const rating = producto.rating || 0;
        const estrellas = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
        const stockClass = producto.stock > 0 ? 'disponible' : 'agotado';
        
        return `
            <div class="producto-card ${stockClass}" data-id="${producto.id}">
                <div class="producto-imagen">
                    <img src="${producto.imagen || 'assets/img/producto-default.jpg'}" 
                         alt="${producto.nombre}" 
                         onerror="this.src='assets/img/producto-default.jpg'">
                    <div class="producto-badges">
                        ${producto.descuento ? `<span class="badge-descuento">-${producto.descuento}%</span>` : ''}
                        ${producto.nuevo ? '<span class="badge-nuevo">Nuevo</span>' : ''}
                    </div>
                </div>
                <div class="producto-info">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <p class="producto-descripcion">${producto.descripcion?.substring(0, 100)}...</p>
                    <div class="producto-rating">
                        <span class="estrellas">${estrellas}</span>
                        <span class="rating-numero">(${rating})</span>
                    </div>
                    <div class="producto-precio">
                        ${producto.precio_original ? 
                            `<span class="precio-original">$${producto.precio_original}</span>` : ''}
                        <span class="precio-actual">$${producto.precio}</span>
                    </div>
                    <div class="producto-stock">
                        <span class="stock-texto ${stockClass}">
                            ${producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
                        </span>
                    </div>
                </div>
                <div class="producto-acciones">
                    <button class="btn-ver" onclick="tiendaSearchSystem.verProducto(${producto.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-agregar" 
                            onclick="tiendaSearchSystem.agregarAlCarrito(${producto.id})"
                            ${producto.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> 
                        ${producto.stock > 0 ? 'Agregar' : 'Agotado'}
                    </button>
                </div>
            </div>
        `;
    }

    // ===== MOSTRAR ESTADÍSTICAS =====
    mostrarEstadisticas(productos) {
        const estadisticas = document.getElementById('estadisticas-busqueda');
        if (!estadisticas) return;

        const total = this.productos.length;
        const mostrados = productos.length;
        const categorias = [...new Set(this.productos.map(p => p.categoria))].length;

        estadisticas.innerHTML = `
            <div class="stats-container">
                <span class="stat-item">
                    <i class="fas fa-box"></i>
                    ${mostrados} de ${total} productos
                </span>
                <span class="stat-item">
                    <i class="fas fa-tags"></i>
                    ${categorias} categorías
                </span>
                ${this.filtrosActivos.busqueda ? `
                    <span class="stat-item">
                        <i class="fas fa-search"></i>
                        Buscando: "${this.filtrosActivos.busqueda}"
                    </span>
                ` : ''}
            </div>
        `;
    }

    // ===== LIMPIAR FILTROS =====
    limpiarFiltros() {
        this.filtrosActivos = {
            busqueda: '',
            categoria: '',
            precioMin: '',
            precioMax: '',
            rating: '',
            disponibilidad: 'todos'
        };
        this.ordenamiento = 'relevancia';

        // Limpiar campos del formulario
        const searchInput = document.getElementById('tienda-search');
        const categoriaSelect = document.getElementById('tienda-categoria');
        const precioMin = document.getElementById('tienda-precio-min');
        const precioMax = document.getElementById('tienda-precio-max');
        const ordenSelect = document.getElementById('tienda-orden');

        if (searchInput) searchInput.value = '';
        if (categoriaSelect) categoriaSelect.value = 'todas';
        if (precioMin) precioMin.value = '';
        if (precioMax) precioMax.value = '';
        if (ordenSelect) ordenSelect.value = 'relevancia';

        this.aplicarFiltros();
    }

    // ===== CARGAR CATEGORÍAS =====
    cargarCategorias() {
        const categorias = [...new Set(this.productos.map(p => p.categoria).filter(Boolean))];
        const categoriaSelect = document.getElementById('tienda-categoria');
        
        if (categoriaSelect) {
            categoriaSelect.innerHTML = `
                <option value="todas">Todas las categorías</option>
                ${categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
            `;
        }
    }

    // ===== ACCIONES DE PRODUCTOS =====
    verProducto(id) {
        const producto = this.productos.find(p => p.id === id);
        if (producto) {
            // Abrir modal de producto o navegar a página de detalle
            this.mostrarModalProducto(producto);
        }
    }

    agregarAlCarrito(id) {
        const producto = this.productos.find(p => p.id === id);
        if (producto && producto.stock > 0) {
            // Implementar lógica de carrito
            if (typeof agregarAlCarrito === 'function') {
                agregarAlCarrito(producto);
            } else {
                // Carrito básico
                let carrito = JSON.parse(localStorage.getItem('tienda_carrito') || '[]');
                const existente = carrito.find(item => item.id === id);
                
                if (existente) {
                    existente.cantidad += 1;
                } else {
                    carrito.push({...producto, cantidad: 1});
                }
                
                localStorage.setItem('tienda_carrito', JSON.stringify(carrito));
                
                // Mostrar notificación
                if (typeof mostrarNotificacion === 'function') {
                    mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
                }
            }
        }
    }

    mostrarModalProducto(producto) {
        const modal = document.createElement('div');
        modal.className = 'modal-producto';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${producto.nombre}</h3>
                    <button class="btn-cerrar" onclick="this.closest('.modal-producto').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="producto-detalle">
                        <img src="${producto.imagen || 'assets/img/producto-default.jpg'}" alt="${producto.nombre}">
                        <div class="producto-info-detalle">
                            <p class="descripcion-completa">${producto.descripcion}</p>
                            <div class="precio-detalle">
                                <span class="precio">$${producto.precio}</span>
                                ${producto.precio_original ? 
                                    `<span class="precio-original">$${producto.precio_original}</span>` : ''}
                            </div>
                            <div class="stock-detalle">
                                Stock: ${producto.stock} unidades
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-agregar" onclick="tiendaSearchSystem.agregarAlCarrito(${producto.id})">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // ===== INICIALIZAR SISTEMA =====
    inicializar() {
        this.cargarProductos();
        this.cargarCategorias();
        this.aplicarFiltros();
    }
}

// ===== INICIALIZAR SISTEMA =====
let tiendaSearchSystem;
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('tienda-search') || document.getElementById('productos-container')) {
        tiendaSearchSystem = new TiendaSearchSystem();
        tiendaSearchSystem.inicializar();
    }
});

// ===== EXPORTAR PARA USO GLOBAL =====
window.tiendaSearchSystem = tiendaSearchSystem;






















