// ===== SISTEMA DE FILTROS AVANZADOS =====
// Version 1.0 - Cresalia Platform
// Autor: Carla & Claude
// Descripción: Sistema completo de filtros para productos

const FiltrosAvanzados = {
    // Estado actual de filtros
    filtrosActivos: {
        busqueda: '',
        categoria: '',
        precioMin: null,
        precioMax: null,
        disponibilidad: 'todos',
        marca: '',
        calificacion: null,
        tieneDescuento: false,
        esNuevo: false,
        envioGratis: false,
        orden: 'relevancia'
    },

    productos: [],
    productosOriginales: [],
    
    // ===== INICIALIZAR =====
    init(productos) {
        this.productos = productos;
        this.productosOriginales = [...productos];
        this.renderizarFiltros();
        this.agregarEventListeners();
    },

    // ===== RENDERIZAR FILTROS =====
    renderizarFiltros() {
        const container = document.getElementById('filtrosAvanzadosContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="filtros-avanzados-completo">
                <!-- Búsqueda Principal -->
                <div class="filtro-principal">
                    <div class="busqueda-principal">
                        <i class="fas fa-search"></i>
                        <input type="text" id="busquedaGeneral" 
                               placeholder="Buscar productos por nombre o descripción..." 
                               value="${this.filtrosActivos.busqueda}">
                    </div>
                </div>

                <!-- Filtros Rápidos -->
                <div class="filtros-rapidos">
                    <button class="filtro-rapido ${this.filtrosActivos.tieneDescuento ? 'activo' : ''}" 
                            data-filtro="descuento">
                        <i class="fas fa-tag"></i> Con Descuento
                    </button>
                    <button class="filtro-rapido ${this.filtrosActivos.esNuevo ? 'activo' : ''}" 
                            data-filtro="nuevo">
                        <i class="fas fa-star"></i> Nuevo
                    </button>
                    <button class="filtro-rapido ${this.filtrosActivos.envioGratis ? 'activo' : ''}" 
                            data-filtro="envio-gratis">
                        <i class="fas fa-shipping-fast"></i> Envío Gratis
                    </button>
                </div>

                <!-- Grid de Filtros Detallados -->
                <div class="filtros-grid">
                    <!-- Categoría -->
                    <div class="filtro-item">
                        <label><i class="fas fa-th-large"></i> Categoría</label>
                        <select id="filtroCategoria" class="form-control">
                            <option value="">Todas las categorías</option>
                            ${this.obtenerOpcionesCategorias()}
                        </select>
                    </div>

                    <!-- Rango de Precio -->
                    <div class="filtro-item">
                        <label><i class="fas fa-dollar-sign"></i> Precio</label>
                        <div class="precio-inputs">
                            <input type="number" id="precioMin" placeholder="Mín" 
                                   value="${this.filtrosActivos.precioMin || ''}">
                            <span>-</span>
                            <input type="number" id="precioMax" placeholder="Máx" 
                                   value="${this.filtrosActivos.precioMax || ''}">
                        </div>
                    </div>

                    <!-- Disponibilidad -->
                    <div class="filtro-item">
                        <label><i class="fas fa-check-circle"></i> Disponibilidad</label>
                        <select id="filtroDisponibilidad" class="form-control">
                            <option value="todos">Todos</option>
                            <option value="disponible">En Stock</option>
                            <option value="agotado">Agotado</option>
                        </select>
                    </div>

                    <!-- Marca -->
                    <div class="filtro-item">
                        <label><i class="fas fa-copyright"></i> Marca</label>
                        <select id="filtroMarca" class="form-control">
                            <option value="">Todas las marcas</option>
                            ${this.obtenerOpcionesMarcas()}
                        </select>
                    </div>

                    <!-- Calificación -->
                    <div class="filtro-item">
                        <label><i class="fas fa-star"></i> Calificación</label>
                        <select id="filtroCalificacion" class="form-control">
                            <option value="">Cualquier calificación</option>
                            <option value="5">⭐⭐⭐⭐⭐ 5 estrellas</option>
                            <option value="4">⭐⭐⭐⭐ 4+ estrellas</option>
                            <option value="3">⭐⭐⭐ 3+ estrellas</option>
                        </select>
                    </div>

                    <!-- Ordenar -->
                    <div class="filtro-item">
                        <label><i class="fas fa-sort"></i> Ordenar por</label>
                        <select id="filtroOrden" class="form-control">
                            <option value="relevancia">Relevancia</option>
                            <option value="precio-menor">Precio: Menor a Mayor</option>
                            <option value="precio-mayor">Precio: Mayor a Menor</option>
                            <option value="nombre">Nombre A-Z</option>
                            <option value="nombre-desc">Nombre Z-A</option>
                            <option value="calificacion">Mejor Calificados</option>
                            <option value="nuevo">Más Nuevos</option>
                            <option value="popular">Más Populares</option>
                        </select>
                    </div>
                </div>

                <!-- Botones de Acción -->
                <div class="filtros-acciones">
                    <button class="btn-aplicar-filtros" onclick="FiltrosAvanzados.aplicarFiltros()">
                        <i class="fas fa-filter"></i> Aplicar Filtros
                    </button>
                    <button class="btn-limpiar-filtros" onclick="FiltrosAvanzados.limpiarFiltros()">
                        <i class="fas fa-redo"></i> Limpiar
                    </button>
                    <div class="resultados-count">
                        <span id="contadorResultados">0 productos</span>
                    </div>
                </div>
            </div>
        `;
    },

    // ===== OBTENER OPCIONES DE CATEGORÍAS =====
    obtenerOpcionesCategorias() {
        const categorias = [...new Set(this.productosOriginales
            .map(p => p.categoria)
            .filter(c => c)
        )];
        
        return categorias.map(cat => 
            `<option value="${cat}">${cat}</option>`
        ).join('');
    },

    // ===== OBTENER OPCIONES DE MARCAS =====
    obtenerOpcionesMarcas() {
        const marcas = [...new Set(this.productosOriginales
            .map(p => p.marca)
            .filter(m => m)
        )];
        
        return marcas.map(marca => 
            `<option value="${marca}">${marca}</option>`
        ).join('');
    },

    // ===== AGREGAR EVENT LISTENERS =====
    agregarEventListeners() {
        // Búsqueda en tiempo real
        const busqueda = document.getElementById('busquedaGeneral');
        if (busqueda) {
            busqueda.addEventListener('input', () => {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    this.aplicarFiltros();
                }, 300);
            });
        }

        // Filtros rápidos
        document.querySelectorAll('.filtro-rapido').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filtro = btn.getAttribute('data-filtro');
                this.toggleFiltroRapido(filtro);
                btn.classList.toggle('activo');
                this.aplicarFiltros();
            });
        });

        // Auto-aplicar al cambiar selects
        ['filtroCategoria', 'filtroDisponibilidad', 'filtroMarca', 'filtroCalificacion', 'filtroOrden'].forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.addEventListener('change', () => this.aplicarFiltros());
            }
        });

        // Auto-aplicar al cambiar precios
        ['precioMin', 'precioMax'].forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.addEventListener('change', () => this.aplicarFiltros());
            }
        });
    },

    // ===== TOGGLE FILTRO RÁPIDO =====
    toggleFiltroRapido(filtro) {
        switch(filtro) {
            case 'descuento':
                this.filtrosActivos.tieneDescuento = !this.filtrosActivos.tieneDescuento;
                break;
            case 'nuevo':
                this.filtrosActivos.esNuevo = !this.filtrosActivos.esNuevo;
                break;
            case 'envio-gratis':
                this.filtrosActivos.envioGratis = !this.filtrosActivos.envioGratis;
                break;
        }
    },

    // ===== APLICAR FILTROS =====
    aplicarFiltros() {
        // Obtener valores actuales
        this.filtrosActivos.busqueda = document.getElementById('busquedaGeneral')?.value || '';
        this.filtrosActivos.categoria = document.getElementById('filtroCategoria')?.value || '';
        this.filtrosActivos.precioMin = parseFloat(document.getElementById('precioMin')?.value) || null;
        this.filtrosActivos.precioMax = parseFloat(document.getElementById('precioMax')?.value) || null;
        this.filtrosActivos.disponibilidad = document.getElementById('filtroDisponibilidad')?.value || 'todos';
        this.filtrosActivos.marca = document.getElementById('filtroMarca')?.value || '';
        this.filtrosActivos.calificacion = parseInt(document.getElementById('filtroCalificacion')?.value) || null;
        this.filtrosActivos.orden = document.getElementById('filtroOrden')?.value || 'relevancia';

        // Aplicar filtros
        let productosFiltrados = [...this.productosOriginales];

        // Búsqueda
        if (this.filtrosActivos.busqueda) {
            const termino = this.filtrosActivos.busqueda.toLowerCase();
            productosFiltrados = productosFiltrados.filter(p => 
                p.nombre.toLowerCase().includes(termino) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(termino)) ||
                (p.marca && p.marca.toLowerCase().includes(termino))
            );
        }

        // Categoría
        if (this.filtrosActivos.categoria) {
            productosFiltrados = productosFiltrados.filter(p => 
                p.categoria === this.filtrosActivos.categoria
            );
        }

        // Precio
        if (this.filtrosActivos.precioMin !== null) {
            productosFiltrados = productosFiltrados.filter(p => 
                parseFloat(p.precio) >= this.filtrosActivos.precioMin
            );
        }
        if (this.filtrosActivos.precioMax !== null) {
            productosFiltrados = productosFiltrados.filter(p => 
                parseFloat(p.precio) <= this.filtrosActivos.precioMax
            );
        }

        // Disponibilidad
        if (this.filtrosActivos.disponibilidad !== 'todos') {
            productosFiltrados = productosFiltrados.filter(p => {
                if (this.filtrosActivos.disponibilidad === 'disponible') {
                    return p.stock > 0 || p.disponible;
                } else {
                    return p.stock === 0 || !p.disponible;
                }
            });
        }

        // Marca
        if (this.filtrosActivos.marca) {
            productosFiltrados = productosFiltrados.filter(p => 
                p.marca === this.filtrosActivos.marca
            );
        }

        // Calificación
        if (this.filtrosActivos.calificacion) {
            productosFiltrados = productosFiltrados.filter(p => 
                (p.calificacion || 0) >= this.filtrosActivos.calificacion
            );
        }

        // Filtros rápidos
        if (this.filtrosActivos.tieneDescuento) {
            productosFiltrados = productosFiltrados.filter(p => p.oferta || p.descuento);
        }
        if (this.filtrosActivos.esNuevo) {
            productosFiltrados = productosFiltrados.filter(p => p.nuevo);
        }
        if (this.filtrosActivos.envioGratis) {
            productosFiltrados = productosFiltrados.filter(p => p.envioGratis);
        }

        // Ordenar
        productosFiltrados = this.ordenarProductos(productosFiltrados);

        // Actualizar productos
        this.productos = productosFiltrados;
        
        // Actualizar contador
        this.actualizarContador(productosFiltrados.length);

        // Callback para renderizar productos (debe ser definido externamente)
        if (typeof window.renderizarProductosFiltrados === 'function') {
            window.renderizarProductosFiltrados(productosFiltrados);
        }

        // Notificar
        if (typeof mostrarNotificacionElegante === 'function') {
            mostrarNotificacionElegante(`✅ ${productosFiltrados.length} productos encontrados`, 'success');
        }

        return productosFiltrados;
    },

    // ===== ORDENAR PRODUCTOS =====
    ordenarProductos(productos) {
        const orden = this.filtrosActivos.orden;
        
        return productos.sort((a, b) => {
            switch(orden) {
                case 'precio-menor':
                    return parseFloat(a.precio) - parseFloat(b.precio);
                case 'precio-mayor':
                    return parseFloat(b.precio) - parseFloat(a.precio);
                case 'nombre':
                    return a.nombre.localeCompare(b.nombre);
                case 'nombre-desc':
                    return b.nombre.localeCompare(a.nombre);
                case 'calificacion':
                    return (b.calificacion || 0) - (a.calificacion || 0);
                case 'nuevo':
                    return (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0);
                case 'popular':
                    return (b.ventas || 0) - (a.ventas || 0);
                case 'relevancia':
                default:
                    return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0);
            }
        });
    },

    // ===== LIMPIAR FILTROS =====
    limpiarFiltros() {
        this.filtrosActivos = {
            busqueda: '',
            categoria: '',
            precioMin: null,
            precioMax: null,
            disponibilidad: 'todos',
            marca: '',
            calificacion: null,
            tieneDescuento: false,
            esNuevo: false,
            envioGratis: false,
            orden: 'relevancia'
        };

        this.renderizarFiltros();
        this.agregarEventListeners();
        this.aplicarFiltros();

        if (typeof mostrarNotificacionElegante === 'function') {
            mostrarNotificacionElegante('🔄 Filtros limpiados', 'info');
        }
    },

    // ===== ACTUALIZAR CONTADOR =====
    actualizarContador(cantidad) {
        const contador = document.getElementById('contadorResultados');
        if (contador) {
            contador.textContent = `${cantidad} producto${cantidad !== 1 ? 's' : ''}`;
        }
    }
};

// Exportar para uso global
window.FiltrosAvanzados = FiltrosAvanzados;

console.log('✅ Sistema de Filtros Avanzados cargado correctamente');















