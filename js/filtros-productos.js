// ===== SISTEMA DE FILTROS Y BÚSQUEDA DE PRODUCTOS =====

// Variables globales del sistema de filtros
let productos = [];
let resultadosFiltros = []; // Renombrado para evitar conflictos con script-cresalia.js
let paginaActual = 1;
const productosPorPagina = 12;

// Datos de ejemplo para productos (eliminados para producción)
const productosEjemplo = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    inicializarSistemaFiltros();
    cargarProductosEjemplo();
    aplicarFiltros();
});

function inicializarSistemaFiltros() {
    // Configurar event listeners
    const busquedaInput = document.getElementById('busquedaProductos');
    if (busquedaInput) {
        // Búsqueda en tiempo real
        busquedaInput.addEventListener('input', function(e) {
            const valor = e.target.value;
            mostrarSugerencias(valor);
            debounce(aplicarFiltros, 300)();
        });
        
        // Enter para buscar
        busquedaInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                ocultarSugerencias();
                buscarProductos();
            }
        });
        
        // Focus para mostrar sugerencias
        busquedaInput.addEventListener('focus', function() {
            const valor = busquedaInput.value;
            if (valor.length > 0) {
                mostrarSugerencias(valor);
            }
        });
        
        // Click fuera para ocultar sugerencias
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.busqueda-container')) {
                ocultarSugerencias();
            }
        });
    }
    
    // Cargar tiendas en el filtro
    cargarTiendasEnFiltro();
}

async function cargarProductosEjemplo() {
    // Primero intentar cargar productos reales del backend
    try {
        await cargarProductosReales();
    } catch (error) {
        console.log('⚠️ No se pudieron cargar productos:', error);
        // No cargar productos de ejemplo en producción
        productos = [];
        resultadosFiltros = [];
        actualizarResultados();
    }
}

async function cargarProductosReales() {
    // Intentar cargar desde localStorage primero (simulando backend)
    const productosGuardados = localStorage.getItem('cresalia_productos');
    
    if (productosGuardados) {
        const productosData = JSON.parse(productosGuardados);
        if (productosData.length > 0) {
            productos = productosData;
            resultadosFiltros = [...productos];
            actualizarResultados();
            return;
        }
    }
    
    // No cargar productos de ejemplo en producción - deben agregarse desde el panel
    productos = [];
    resultadosFiltros = [];
    
    // Guardar en localStorage para simular persistencia
    localStorage.setItem('cresalia_productos', JSON.stringify(productos));
    
    actualizarResultados();
}

// Función para agregar productos desde el admin de tiendas
function agregarProductoDesdeTienda(productoData) {
    const nuevoProducto = {
        id: Date.now(), // ID único temporal
        nombre: productoData.nombre,
        descripcion: productoData.descripcion,
        precio: parseFloat(productoData.precio),
        categoria: productoData.categoria || 'general',
        tienda: productoData.tienda,
        valoracion: 0,
        votos: 0,
        imagen: productoData.imagen || 'https://via.placeholder.com/300x200/F3F4F6/9CA3AF?text=Sin+Imagen',
        estado: productoData.estado || 'nuevo',
        envio: productoData.envio || 'gratis',
        stock: parseInt(productoData.stock) || 0,
        tags: productoData.tags ? productoData.tags.split(',').map(tag => tag.trim()) : []
    };
    
    // Agregar al array de productos
    productos.push(nuevoProducto);
    
    // Actualizar localStorage
    localStorage.setItem('cresalia_productos', JSON.stringify(productos));
    
    // Actualizar filtros si estamos en la página principal
    if (typeof aplicarFiltros === 'function') {
        aplicarFiltros();
    }
    
    return nuevoProducto;
}

function cargarTiendasEnFiltro() {
    const tiendas = [...new Set(productos.map(p => p.tienda))];
    const selectTienda = document.getElementById('filtroTienda');
    
    tiendas.forEach(tienda => {
        const option = document.createElement('option');
        option.value = tienda;
        option.textContent = tienda;
        selectTienda.appendChild(option);
    });
}

function buscarProductos() {
    ocultarSugerencias();
    aplicarFiltros();
}

function mostrarSugerencias(texto) {
    const suggestionsContainer = document.getElementById('busquedaSuggestions');
    if (!suggestionsContainer || texto.length < 2) {
        ocultarSugerencias();
        return;
    }
    
    // Generar sugerencias basadas en productos
    const sugerencias = generarSugerencias(texto);
    
    if (sugerencias.length === 0) {
        ocultarSugerencias();
        return;
    }
    
    const html = sugerencias.map(sugerencia => 
        `<div class="suggestion-item" onclick="seleccionarSugerencia('${sugerencia}')">
            <i class="fas fa-search"></i> ${sugerencia}
        </div>`
    ).join('');
    
    suggestionsContainer.innerHTML = html;
    suggestionsContainer.classList.add('show');
}

function ocultarSugerencias() {
    const suggestionsContainer = document.getElementById('busquedaSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.remove('show');
    }
}

function seleccionarSugerencia(sugerencia) {
    const busquedaInput = document.getElementById('busquedaProductos');
    if (busquedaInput) {
        busquedaInput.value = sugerencia;
        ocultarSugerencias();
        aplicarFiltros();
    }
}

function generarSugerencias(texto) {
    const textoLower = texto.toLowerCase();
    const sugerencias = new Set();
    
    // Buscar en nombres de productos
    productos.forEach(producto => {
        if (producto.nombre.toLowerCase().includes(textoLower)) {
            sugerencias.add(producto.nombre);
        }
        if (producto.descripcion.toLowerCase().includes(textoLower)) {
            // Extraer palabras clave de la descripción
            const palabras = producto.descripcion.toLowerCase().split(' ');
            palabras.forEach(palabra => {
                if (palabra.includes(textoLower) && palabra.length > 3) {
                    sugerencias.add(palabra.charAt(0).toUpperCase() + palabra.slice(1));
                }
            });
        }
        // Buscar en tags
        producto.tags.forEach(tag => {
            if (tag.toLowerCase().includes(textoLower)) {
                sugerencias.add(tag.charAt(0).toUpperCase() + tag.slice(1));
            }
        });
    });
    
    // Agregar categorías que coincidan
    Object.keys(categoriasDisponibles).forEach(categoria => {
        const categoriaInfo = categoriasDisponibles[categoria];
        if (categoriaInfo.nombre.toLowerCase().includes(textoLower)) {
            sugerencias.add(categoriaInfo.nombre);
        }
    });
    
    return Array.from(sugerencias).slice(0, 5); // Máximo 5 sugerencias
}

function aplicarFiltros() {
    // Validar rango de precios primero
    validarRangoPrecios();
    
    const busqueda = document.getElementById('busquedaProductos')?.value.toLowerCase() || '';
    const categoria = document.getElementById('filtroCategoria')?.value || '';
    const precioMin = parseFloat(document.getElementById('precioMin')?.value) || 0;
    const precioMax = parseFloat(document.getElementById('precioMax')?.value) || 100000;
    const ordenar = document.getElementById('ordenarPor')?.value || 'relevancia';
    const tienda = document.getElementById('filtroTienda')?.value || '';
    const valoracion = document.getElementById('filtroValoracion')?.value || '';
    const envio = document.getElementById('filtroEnvio')?.value || '';
    const estado = document.getElementById('filtroEstado')?.value || '';
    
    // Filtrar productos
    resultadosFiltros = productos.filter(producto => {
        // EXCLUIR productos eliminados u ocultos
        if (producto.eliminado === true || producto.oculto === true || producto.visible === false) {
            return false;
        }
        
        // Búsqueda por texto
        const coincideBusqueda = !busqueda || 
            producto.nombre.toLowerCase().includes(busqueda) ||
            producto.descripcion.toLowerCase().includes(busqueda) ||
            (producto.tags && producto.tags.some(tag => tag.toLowerCase().includes(busqueda)));
        
        // Categoría
        const coincideCategoria = !categoria || producto.categoria === categoria;
        
        // Precio
        const coincidePrecio = producto.precio >= precioMin && producto.precio <= precioMax;
        
        // Tienda
        const coincideTienda = !tienda || producto.tienda === tienda;
        
        // Valoración
        const coincideValoracion = !valoracion || producto.valoracion >= parseFloat(valoracion);
        
        // Envío
        const coincideEnvio = !envio || producto.envio === envio;
        
        // Estado
        const coincideEstado = !estado || producto.estado === estado;
        
        return coincideBusqueda && coincideCategoria && coincidePrecio && 
               coincideTienda && coincideValoracion && coincideEnvio && coincideEstado;
    });
    
    // Ordenar productos
    ordenarProductos(ordenar);
    
    // Actualizar visualización
    paginaActual = 1;
    actualizarResultados();
    actualizarPaginacion();
}

function ordenarProductos(ordenar) {
    switch(ordenar) {
        case 'precio-asc':
            resultadosFiltros.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio-desc':
            resultadosFiltros.sort((a, b) => b.precio - a.precio);
            break;
        case 'nombre-asc':
            resultadosFiltros.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'nombre-desc':
            resultadosFiltros.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
        case 'nuevos':
            resultadosFiltros.sort((a, b) => b.id - a.id);
            break;
        case 'valoracion':
            resultadosFiltros.sort((a, b) => b.valoracion - a.valoracion);
            break;
        default: // relevancia
            // Mantener orden original
            break;
    }
}

function actualizarResultados() {
    const container = document.getElementById('productosGrid');
    const resultadosCount = document.getElementById('resultadosCount');
    
    // Actualizar contador
    resultadosCount.textContent = `${resultadosFiltros.length} producto${resultadosFiltros.length !== 1 ? 's' : ''} encontrado${resultadosFiltros.length !== 1 ? 's' : ''}`;
    
    // Calcular productos para la página actual
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = resultadosFiltros.slice(inicio, fin);
    
    if (productosPagina.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="producto-card">
                    <div class="producto-placeholder">
                        <i class="fas fa-search"></i>
                        <h3>No se encontraron productos</h3>
                        <p>Intenta ajustar los filtros de búsqueda</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    // Generar HTML de productos
    container.innerHTML = productosPagina.map(producto => crearHTMLProducto(producto)).join('');
}

function crearHTMLProducto(producto) {
    const estrellas = generarEstrellas(producto.valoracion);
    const badge = producto.stock < 10 ? '<div class="producto-badge">¡Últimas unidades!</div>' : '';
    
    return `
        <div class="producto-card">
            ${badge}
            <div class="producto-imagen">
                <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/300x200/F3F4F6/9CA3AF?text=Sin+Imagen'">
            </div>
            <div class="producto-info">
                <div class="producto-categoria">${obtenerNombreCategoria(producto.categoria)}</div>
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <div class="producto-precio">$${producto.precio.toFixed(2)}</div>
                <div class="producto-valoracion">
                    <div class="producto-estrellas">${estrellas}</div>
                    <span class="producto-rating">(${producto.votos})</span>
                </div>
                <div class="producto-tienda">
                    <i class="fas fa-store"></i> ${producto.tienda}
                </div>
                <div class="producto-acciones">
                    <button class="btn-producto btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                        <i class="fas fa-cart-plus"></i> Agregar
                    </button>
                    <button class="btn-producto btn-detalles" onclick="verDetalles(${producto.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generarEstrellas(valoracion) {
    const estrellasCompletas = Math.floor(valoracion);
    const tieneMediaEstrella = valoracion % 1 >= 0.5;
    
    let html = '';
    for (let i = 0; i < estrellasCompletas; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    if (tieneMediaEstrella) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    const estrellasVacias = 5 - Math.ceil(valoracion);
    for (let i = 0; i < estrellasVacias; i++) {
        html += '<i class="far fa-star"></i>';
    }
    return html;
}

function obtenerNombreCategoria(categoria) {
    const categorias = {
        'tecnologia': '📱 Tecnología',
        'moda': '👗 Moda',
        'hogar': '🏠 Hogar',
        'deportes': '⚽ Deportes',
        'belleza': '💄 Belleza',
        'salud': '💊 Salud',
        'alimentacion': '🍎 Alimentación',
        'automotriz': '🚗 Automotriz',
        'libros': '📚 Libros',
        'juguetes': '🧸 Juguetes',
        'mascotas': '🐕 Mascotas',
        'viajes': '✈️ Viajes',
        'arte': '🎨 Arte',
        'musica': '🎵 Música',
        'oficina': '💼 Oficina',
        'herramientas': '🔧 Herramientas',
        'jardineria': '🌱 Jardinería',
        'fotografia': '📸 Fotografía',
        'gaming': '🎮 Gaming',
        'servicios': '🔧 Servicios'
    };
    return categorias[categoria] || categoria;
}

// Función simplificada para validar precios
function validarRangoPrecios() {
    const precioMin = document.getElementById('precioMin');
    const precioMax = document.getElementById('precioMax');
    
    if (precioMin && precioMax) {
        const min = parseInt(precioMin.value) || 0;
        const max = parseInt(precioMax.value) || 100000;
        
        // Asegurar que el mínimo no sea mayor que el máximo
        if (min > max) {
            precioMin.value = max;
        }
    }
}

function actualizarPaginacion() {
    const totalPaginas = Math.ceil(resultadosFiltros.length / productosPorPagina);
    const container = document.getElementById('paginacionProductos');
    
    if (totalPaginas <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Botón anterior
    html += `
        <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a>
        </li>
    `;
    
    // Páginas
    for (let i = 1; i <= totalPaginas; i++) {
        if (i === 1 || i === totalPaginas || (i >= paginaActual - 2 && i <= paginaActual + 2)) {
            html += `
                <li class="page-item ${i === paginaActual ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="cambiarPagina(${i})">${i}</a>
                </li>
            `;
        } else if (i === paginaActual - 3 || i === paginaActual + 3) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }
    
    // Botón siguiente
    html += `
        <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a>
        </li>
    `;
    
    container.innerHTML = html;
}

function cambiarPagina(pagina) {
    const totalPaginas = Math.ceil(resultadosFiltros.length / productosPorPagina);
    if (pagina >= 1 && pagina <= totalPaginas) {
        paginaActual = pagina;
        actualizarResultados();
        actualizarPaginacion();
        
        // Scroll hacia arriba
        document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
    }
}

function limpiarFiltros() {
    const elementos = [
        'busquedaProductos',
        'filtroCategoria', 
        'precioMin',
        'precioMax',
        'ordenarPor',
        'filtroTienda',
        'filtroValoracion',
        'filtroEnvio',
        'filtroEstado'
    ];
    
    elementos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            if (id === 'precioMin') {
                elemento.value = '0';
            } else if (id === 'precioMax') {
                elemento.value = '100000';
            } else if (id === 'ordenarPor') {
                elemento.value = 'relevancia';
            } else {
                elemento.value = '';
            }
        }
    });
    
    aplicarFiltros();
}

function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
        // Aquí se integraría con el sistema de carrito existente
        mostrarNotificacion('Producto agregado al carrito', 'success');
    }
}

function verDetalles(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
        // Aquí se abriría un modal con los detalles del producto
        mostrarNotificacion('Funcionalidad de detalles próximamente', 'info');
    }
}

// Función de utilidad para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Función de notificaciones (integrar con el sistema existente)
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Integrar con el sistema de notificaciones existente
    console.log(`Notificación ${tipo}: ${mensaje}`);
}
