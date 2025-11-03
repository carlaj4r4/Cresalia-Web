// ===== INTEGRACIÓN DE PRODUCTOS CON PÁGINA PRINCIPAL =====

// Función para agregar producto desde el admin de tiendas
function agregarProductoATienda() {
    // Obtener datos del formulario (esto se conectaría con el formulario real)
    const productoData = {
        nombre: document.getElementById('nombreProducto')?.value || 'Producto de Prueba',
        descripcion: document.getElementById('descripcionProducto')?.value || 'Descripción del producto',
        precio: document.getElementById('precioProducto')?.value || '99.99',
        categoria: obtenerCategoriaSeleccionada()?.categoria || 'tecnologia',
        tienda: obtenerNombreTienda(),
        imagen: document.getElementById('imagenProducto')?.value || '',
        estado: document.getElementById('estadoProducto')?.value || 'nuevo',
        envio: document.getElementById('envioProducto')?.value || 'gratis',
        stock: document.getElementById('stockProducto')?.value || '10',
        tags: document.getElementById('tagsProducto')?.value || ''
    };
    
    // Validar datos requeridos
    if (!productoData.nombre || !productoData.precio) {
        mostrarNotificacion('⚠️ Por favor completa al menos el nombre y precio del producto', 'warning');
        return false;
    }
    
    // Agregar producto al sistema global
    if (typeof agregarProductoDesdeTienda === 'function') {
        const nuevoProducto = agregarProductoDesdeTienda(productoData);
        mostrarNotificacion(`✅ Producto "${nuevoProducto.nombre}" agregado exitosamente`, 'success');
        return true;
    } else {
        // Fallback: guardar en localStorage
        guardarProductoLocal(productoData);
        mostrarNotificacion(`✅ Producto "${productoData.nombre}" guardado localmente`, 'success');
        return true;
    }
}

function obtenerNombreTienda() {
    // Intentar obtener el nombre de la tienda desde diferentes fuentes
    const tenantInfo = window.tenantInfo;
    if (tenantInfo && tenantInfo.nombre) {
        return tenantInfo.nombre;
    }
    
    const titulo = document.querySelector('title');
    if (titulo) {
        return titulo.textContent.split(' - ')[0];
    }
    
    return 'Mi Tienda';
}

function guardarProductoLocal(productoData) {
    const productosExistentes = JSON.parse(localStorage.getItem('cresalia_productos') || '[]');
    
    const nuevoProducto = {
        id: Date.now(),
        nombre: productoData.nombre,
        descripcion: productoData.descripcion,
        precio: parseFloat(productoData.precio),
        categoria: productoData.categoria,
        tienda: productoData.tienda,
        valoracion: 0,
        votos: 0,
        imagen: productoData.imagen || 'https://via.placeholder.com/300x200/F3F4F6/9CA3AF?text=Sin+Imagen',
        estado: productoData.estado,
        envio: productoData.envio,
        stock: parseInt(productoData.stock),
        tags: productoData.tags ? productoData.tags.split(',').map(tag => tag.trim()) : []
    };
    
    productosExistentes.push(nuevoProducto);
    localStorage.setItem('cresalia_productos', JSON.stringify(productosExistentes));
    
    return nuevoProducto;
}

// Función para sincronizar productos entre páginas
function sincronizarProductos() {
    // Esta función se ejecuta cuando se carga la página principal
    // para asegurar que los productos estén actualizados
    const productosGuardados = localStorage.getItem('cresalia_productos');
    if (productosGuardados && typeof cargarProductosReales === 'function') {
        cargarProductosReales();
    }
}

// Función para crear formulario de producto en el admin
function crearFormularioProducto(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const categoriaData = cargarCategoriaTienda();
    
    const html = `
        <div class="producto-form-container">
            <h3><i class="fas fa-plus-circle"></i> Agregar Nuevo Producto</h3>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label for="nombreProducto" class="form-label">
                            <i class="fas fa-tag"></i> Nombre del Producto *
                        </label>
                        <input type="text" id="nombreProducto" class="form-control" placeholder="Ej: iPhone 15 Pro" required>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="precioProducto" class="form-label">
                            <i class="fas fa-dollar-sign"></i> Precio *
                        </label>
                        <input type="number" id="precioProducto" class="form-control" step="0.01" placeholder="99.99" required>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="categoriaProducto" class="form-label">
                            <i class="fas fa-tags"></i> Categoría
                        </label>
                        <select id="categoriaProducto" class="form-select">
                            <option value="">Selecciona una categoría...</option>
                            <option value="tecnologia" ${categoriaData?.categoria === 'tecnologia' ? 'selected' : ''}>📱 Tecnología</option>
                            <option value="moda" ${categoriaData?.categoria === 'moda' ? 'selected' : ''}>👗 Moda</option>
                            <option value="hogar" ${categoriaData?.categoria === 'hogar' ? 'selected' : ''}>🏠 Hogar</option>
                            <option value="deportes" ${categoriaData?.categoria === 'deportes' ? 'selected' : ''}>⚽ Deportes</option>
                            <option value="belleza" ${categoriaData?.categoria === 'belleza' ? 'selected' : ''}>💄 Belleza</option>
                            <option value="salud" ${categoriaData?.categoria === 'salud' ? 'selected' : ''}>💊 Salud</option>
                            <option value="alimentacion" ${categoriaData?.categoria === 'alimentacion' ? 'selected' : ''}>🍎 Alimentación</option>
                            <option value="automotriz" ${categoriaData?.categoria === 'automotriz' ? 'selected' : ''}>🚗 Automotriz</option>
                            <option value="libros" ${categoriaData?.categoria === 'libros' ? 'selected' : ''}>📚 Libros</option>
                            <option value="juguetes" ${categoriaData?.categoria === 'juguetes' ? 'selected' : ''}>🧸 Juguetes</option>
                            <option value="mascotas" ${categoriaData?.categoria === 'mascotas' ? 'selected' : ''}>🐕 Mascotas</option>
                            <option value="viajes" ${categoriaData?.categoria === 'viajes' ? 'selected' : ''}>✈️ Viajes</option>
                            <option value="arte" ${categoriaData?.categoria === 'arte' ? 'selected' : ''}>🎨 Arte</option>
                            <option value="musica" ${categoriaData?.categoria === 'musica' ? 'selected' : ''}>🎵 Música</option>
                            <option value="oficina" ${categoriaData?.categoria === 'oficina' ? 'selected' : ''}>💼 Oficina</option>
                            <option value="herramientas" ${categoriaData?.categoria === 'herramientas' ? 'selected' : ''}>🔧 Herramientas</option>
                            <option value="jardineria" ${categoriaData?.categoria === 'jardineria' ? 'selected' : ''}>🌱 Jardinería</option>
                            <option value="fotografia" ${categoriaData?.categoria === 'fotografia' ? 'selected' : ''}>📸 Fotografía</option>
                            <option value="gaming" ${categoriaData?.categoria === 'gaming' ? 'selected' : ''}>🎮 Gaming</option>
                            <option value="servicios" ${categoriaData?.categoria === 'servicios' ? 'selected' : ''}>🔧 Servicios</option>
                        </select>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="stockProducto" class="form-label">
                            <i class="fas fa-boxes"></i> Stock Disponible
                        </label>
                        <input type="number" id="stockProducto" class="form-control" value="10" min="0">
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label for="descripcionProducto" class="form-label">
                            <i class="fas fa-align-left"></i> Descripción
                        </label>
                        <textarea id="descripcionProducto" class="form-control" rows="3" placeholder="Describe tu producto..."></textarea>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="imagenProducto" class="form-label">
                            <i class="fas fa-image"></i> URL de Imagen
                        </label>
                        <input type="url" id="imagenProducto" class="form-control" placeholder="https://ejemplo.com/imagen.jpg">
                    </div>
                    
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group mb-3">
                                <label for="estadoProducto" class="form-label">
                                    <i class="fas fa-badge-check"></i> Estado
                                </label>
                                <select id="estadoProducto" class="form-select">
                                    <option value="nuevo">Nuevo</option>
                                    <option value="usado">Usado</option>
                                    <option value="reacondicionado">Reacondicionado</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="col-6">
                            <div class="form-group mb-3">
                                <label for="envioProducto" class="form-label">
                                    <i class="fas fa-truck"></i> Envío
                                </label>
                                <select id="envioProducto" class="form-select">
                                    <option value="gratis">Envío Gratis</option>
                                    <option value="rapido">Envío Rápido</option>
                                    <option value="local">Retiro Local</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="tagsProducto" class="form-label">
                            <i class="fas fa-hashtag"></i> Tags (separados por comas)
                        </label>
                        <input type="text" id="tagsProducto" class="form-control" placeholder="smartphone, apple, premium, camera">
                    </div>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="limpiarFormularioProducto()">
                    <i class="fas fa-eraser"></i> Limpiar
                </button>
                <button type="button" class="btn btn-primary" onclick="agregarProductoATienda()">
                    <i class="fas fa-plus"></i> Agregar Producto
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function limpiarFormularioProducto() {
    document.getElementById('nombreProducto').value = '';
    document.getElementById('precioProducto').value = '';
    document.getElementById('descripcionProducto').value = '';
    document.getElementById('imagenProducto').value = '';
    document.getElementById('stockProducto').value = '10';
    document.getElementById('tagsProducto').value = '';
}

// CSS para el formulario
const productoFormCSS = `
.producto-form-container {
    background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
    border-radius: 20px;
    padding: 30px;
    border: 2px solid #F9A8D4;
    margin-bottom: 30px;
}

.producto-form-container h3 {
    color: var(--primary-purple, #7C3AED);
    margin-bottom: 25px;
    font-weight: 600;
}

.form-group label {
    font-weight: 600;
    color: var(--primary-purple, #7C3AED);
    margin-bottom: 8px;
}

.form-group label i {
    margin-right: 8px;
    color: var(--pink-accent, #EC4899);
}

.form-control, .form-select {
    border: 2px solid #E5E7EB;
    border-radius: 10px;
    padding: 12px 15px;
    transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
    border-color: var(--primary-purple, #7C3AED);
    box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.25);
}

.form-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 25px;
    padding-top: 25px;
    border-top: 2px solid #F9A8D4;
}

.form-actions .btn {
    padding: 12px 25px;
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.form-actions .btn:hover {
    transform: translateY(-2px);
}
`;

// Inyectar CSS
if (!document.getElementById('producto-form-css')) {
    const style = document.createElement('style');
    style.id = 'producto-form-css';
    style.textContent = productoFormCSS;
    document.head.appendChild(style);
}























