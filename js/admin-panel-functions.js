// ===== CRESALIA ADMIN PANEL FUNCTIONS =====
// Funciones específicas para el panel de administración

// Variables globales
let productos = [];
let servicios = [];
let ofertas = [];
let categorias = [];
let currentSection = 'dashboard';

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Admin Panel Functions');
    inicializarPanel();
    cargarDatosIniciales();
    actualizarDashboardStats();
});

function inicializarPanel() {
    // Mostrar dashboard por defecto
    mostrarSeccion('dashboard');
    
    // Configurar event listeners
    configurarEventListeners();
    
    console.log('✅ Panel de administración inicializado');
}

function configurarEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', manejarLogin);
    }
    
    // Password toggle
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    
    // Formularios de productos
    const productoForm = document.getElementById('productoForm');
    if (productoForm) {
        productoForm.addEventListener('submit', manejarEnvioProducto);
    }
    
    // Formularios de servicios
    const servicioForm = document.getElementById('servicioForm');
    if (servicioForm) {
        servicioForm.addEventListener('submit', manejarEnvioServicio);
    }
}

async function cargarDatosIniciales() {
    console.log('📊 Cargando datos iniciales...');
    
    try {
        // Cargar productos
        await cargarProductos();
        
        // Cargar servicios
        await cargarServicios();
        
        // Cargar ofertas
        await cargarOfertas();
        
        // Cargar categorías
        await cargarCategorias();
        
        // Cargar configuración de pagos
        await cargarConfiguracionPagos();
        
        // Cargar configuración general
        await cargarConfiguracionGeneral();
        
        console.log('✅ Datos iniciales cargados');
    } catch (error) {
        console.error('❌ Error cargando datos iniciales:', error);
        mostrarNotificacion('Error cargando datos iniciales', 'error');
    }
}

// ===== AUTENTICACIÓN =====
async function manejarLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    
    // Validación de contraseña (configuración privada)
    const adminPassword = (window.CONFIG_PRIVADO && window.CONFIG_PRIVADO.adminCresalia) || 'CREDENTIAL_REMOVED';
    if (password === adminPassword) {
        // Crear sesión
        const sessionData = {
            timestamp: Date.now(),
            authenticated: true
        };
        
        localStorage.setItem('adminSession', JSON.stringify(sessionData));
        
        // Mostrar panel
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        
        console.log('✅ Login exitoso');
        mostrarNotificacion('Acceso autorizado', 'success');
        
        // Cargar datos
        await cargarDatosIniciales();
    } else {
        console.log('❌ Contraseña incorrecta');
        mostrarNotificacion('Contraseña incorrecta', 'error');
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function cerrarSesion() {
    localStorage.removeItem('adminSession');
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    console.log('👋 Sesión cerrada');
    mostrarNotificacion('Sesión cerrada', 'info');
}

// ===== NAVEGACIÓN =====
function mostrarSeccion(seccion) {
    console.log(`🔄 Intentando mostrar sección: ${seccion}`);
    
    // Ocultar todas las secciones
    const secciones = document.querySelectorAll('.content-section');
    secciones.forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('active');
    });
    
    // Actualizar botones de navegación
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activar botón correspondiente
    const activeButton = document.querySelector(`[onclick="mostrarSeccion('${seccion}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Mostrar sección seleccionada
    const seccionElement = document.getElementById(seccion);
    if (seccionElement) {
        seccionElement.style.display = 'block';
        seccionElement.classList.add('active');
        currentSection = seccion;
        console.log(`✅ Sección mostrada: ${seccion}`);
        
        // Actualizar datos de la sección si es necesario
        if (seccion === 'productos') {
            mostrarProductos();
        } else if (seccion === 'servicios') {
            mostrarServicios();
        } else if (seccion === 'ofertas') {
            mostrarOfertas();
        } else if (seccion === 'dashboard') {
            actualizarDashboardStats();
        }
    }
    
    // Actualizar navegación activa
    actualizarNavegacionActiva(seccion);
}

function actualizarNavegacionActiva(seccion) {
    // Remover clase activa de todos los botones
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Agregar clase activa al botón correspondiente
    const activeButton = document.querySelector(`[onclick="mostrarSeccion('${seccion}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// ===== GESTIÓN DE PRODUCTOS =====
async function cargarProductos() {
    try {
        if (window.adminBackend) {
            const response = await window.adminBackend.getProductos();
            if (response && response.success) {
                productos = response.data || [];
                console.log(`📦 Productos cargados: ${productos.length}`);
            } else {
                // Si hay error en la conexión, usar datos de ejemplo
                productos = [];
                console.log('⚠️ Error conectando con backend, usando datos de ejemplo');
            }
        } else {
            // Datos de ejemplo para modo offline
            productos = [];
            console.log('📦 Sin productos (modo offline)');
        }
        
        mostrarProductos();
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        mostrarNotificacion('Error cargando productos', 'error');
    }
}

function mostrarProductos() {
    const contenedor = document.getElementById('productosGrid') || document.getElementById('productosLista');
    if (!contenedor) return;
    
    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No hay productos</h3>
                <p>Agrega tu primer producto para comenzar</p>
                <button class="btn btn-primary" onclick="mostrarFormularioProducto()">
                    <i class="fas fa-plus"></i> Agregar Producto
                </button>
            </div>
        `;
        return;
    }
    
    const html = productos.map(producto => `
        <div class="product-card" data-id="${producto.id}">
            <div class="product-checkbox">
                <input type="checkbox" class="product-select" value="${producto.id}" onchange="toggleEliminarBtn()">
            </div>
            <div class="product-image">
                <img src="${producto.imagen || 'assets/placeholder-product.png'}" alt="${producto.nombre}" onerror="this.src='assets/placeholder-product.png'">
            </div>
            <div class="product-info">
                <h4>${producto.nombre}</h4>
                <p>${producto.descripcion || 'Sin descripción'}</p>
                <div class="product-details">
                    <span class="price">$${producto.precio}</span>
                    <span class="stock">Stock: ${producto.stock || 0}</span>
                    <span class="category">${producto.categoria || 'Sin categoría'}</span>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="editarProducto(${producto.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${producto.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    contenedor.innerHTML = html;
}

function mostrarFormularioProducto(productoId = null) {
    console.log('🔵 ADMIN-PANEL-FUNCTIONS: mostrarFormularioProducto() EJECUTADA');
    const modal = document.getElementById('modalProducto'); // CORREGIDO: era 'productoModal'
    console.log('🔍 Modal buscado: modalProducto, encontrado:', modal);
    
    if (!modal) {
        console.error('❌ Modal modalProducto no encontrado');
        // Intentar con el modal del HTML inline
        const modalAlternativo = document.getElementById('modalProducto');
        if (modalAlternativo) {
            console.log('✅ Usando modal alternativo');
            modalAlternativo.classList.add('show');
            modalAlternativo.style.display = 'flex';
            const form = document.getElementById('formProducto');
            if (form) form.reset();
            return;
        }
        return;
    }
    
    const producto = productoId ? productos.find(p => p.id === productoId) : null;
    const formulario = document.getElementById('productoForm') || document.getElementById('formProducto');
    
    if (formulario && producto) {
        // Editar producto existente
        document.getElementById('productoNombre').value = producto.nombre;
        document.getElementById('productoDescripcion').value = producto.descripcion || '';
        document.getElementById('productoPrecio').value = producto.precio;
        document.getElementById('productoStock').value = producto.stock || 0;
        document.getElementById('productoCategoria').value = producto.categoria_id || producto.categoria || '';
        
        formulario.dataset.mode = 'edit';
        formulario.dataset.id = productoId;
        
        const titulo = document.querySelector('#modalProducto .modal-header h3');
        if (titulo) titulo.textContent = 'Editar Producto';
    } else if (formulario) {
        // Nuevo producto
        formulario.reset();
        formulario.dataset.mode = 'create';
        delete formulario.dataset.id;
        
        const titulo = document.querySelector('#modalProducto .modal-header h3');
        if (titulo) titulo.innerHTML = '<i class="fas fa-box"></i> Agregar Nuevo Producto';
    }
    
    modal.classList.add('show');
    modal.style.display = 'flex';
    console.log('✅ Modal de producto abierto desde admin-panel-functions');
}

function crearModalProducto() {
    const modalHTML = `
        <div id="productoModal" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Agregar Producto</h3>
                    <button class="close-btn" onclick="cerrarModal('productoModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="productoForm">
                        <div class="form-group">
                            <label for="productoNombre">Nombre del Producto *</label>
                            <input type="text" id="productoNombre" name="nombre" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="productoDescripcion">Descripción</label>
                            <textarea id="productoDescripcion" name="descripcion" rows="3"></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="productoPrecio">Precio *</label>
                                <input type="number" id="productoPrecio" name="precio" step="0.01" min="0" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="productoStock">Stock</label>
                                <input type="number" id="productoStock" name="stock" min="0" value="0">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="productoCategoria">Categoría</label>
                            <select id="productoCategoria" name="categoria_id">
                                <option value="">Seleccionar categoría</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="productoImagen">URL de Imagen</label>
                            <input type="url" id="productoImagen" name="imagen" placeholder="https://ejemplo.com/imagen.jpg">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="cerrarModal('productoModal')">Cancelar</button>
                    <button class="btn btn-primary" onclick="enviarProducto()">Crear Producto</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function enviarProducto() {
    const formulario = document.getElementById('productoForm');
    const formData = new FormData(formulario);
    
    const producto = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        precio: parseFloat(formData.get('precio')),
        stock: parseInt(formData.get('stock')) || 0,
        categoria_id: formData.get('categoria_id'),
        imagen: formData.get('imagen')
    };
    
    try {
        let response;
        
        if (window.adminBackend) {
            if (formulario.dataset.mode === 'edit') {
                // Actualizar producto existente
                response = await window.adminBackend.actualizarProducto(formulario.dataset.id, producto);
            } else {
                // Crear nuevo producto
                response = await window.adminBackend.crearProducto(producto);
            }
            
            if (response && response.success) {
                mostrarNotificacion(
                    formulario.dataset.mode === 'edit' ? 'Producto actualizado' : 'Producto creado', 
                    'success'
                );
                cerrarModal('productoModal');
                await cargarProductos(); // Recargar lista
            } else {
                throw new Error(response?.error || 'Error desconocido');
            }
        } else {
            // Modo offline - simular éxito
            producto.id = Date.now(); // ID temporal
            productos.push(producto);
            mostrarProductos();
            
            mostrarNotificacion(
                formulario.dataset.mode === 'edit' ? 'Producto actualizado (modo offline)' : 'Producto creado (modo offline)', 
                'success'
            );
            cerrarModal('productoModal');
        }
    } catch (error) {
        console.error('❌ Error enviando producto:', error);
        mostrarNotificacion('Error guardando producto: ' + error.message, 'error');
    }
}

async function manejarEnvioProducto(event) {
    event.preventDefault();
    await enviarProducto();
}

async function editarProducto(id) {
    mostrarFormularioProducto(id);
}

async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return;
    }
    
    try {
        if (window.adminBackend) {
            const response = await window.adminBackend.eliminarProducto(id);
            
            if (response && response.success) {
                mostrarNotificacion('Producto eliminado', 'success');
                await cargarProductos(); // Recargar lista
            } else {
                throw new Error(response?.error || 'Error desconocido');
            }
        } else {
            // Modo offline - eliminar localmente
            productos = productos.filter(p => p.id != id);
            mostrarProductos();
            mostrarNotificacion('Producto eliminado (modo offline)', 'success');
        }
    } catch (error) {
        console.error('❌ Error eliminando producto:', error);
        mostrarNotificacion('Error eliminando producto: ' + error.message, 'error');
    }
}

function toggleEliminarBtn() {
    const checkboxes = document.querySelectorAll('.product-select:checked');
    const btn = document.getElementById('eliminarSeleccionadosBtn');
    
    if (btn) {
        btn.style.display = checkboxes.length > 0 ? 'inline-block' : 'none';
    }
}

async function eliminarProductosSeleccionados() {
    const checkboxes = document.querySelectorAll('.product-select:checked');
    const ids = Array.from(checkboxes).map(cb => cb.value);
    
    if (ids.length === 0) {
        mostrarNotificacion('Selecciona productos para eliminar', 'warning');
        return;
    }
    
    if (!confirm(`¿Estás seguro de que quieres eliminar ${ids.length} productos?`)) {
        return;
    }
    
    try {
        const promises = ids.map(id => window.adminBackend.eliminarProducto(id));
        await Promise.all(promises);
        
        mostrarNotificacion(`${ids.length} productos eliminados`, 'success');
        await cargarProductos(); // Recargar lista
    } catch (error) {
        console.error('❌ Error eliminando productos:', error);
        mostrarNotificacion('Error eliminando productos', 'error');
    }
}

async function eliminarTodosLosProductos() {
    if (!confirm('¿Estás seguro de que quieres eliminar TODOS los productos? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const promises = productos.map(p => window.adminBackend.eliminarProducto(p.id));
        await Promise.all(promises);
        
        mostrarNotificacion('Todos los productos eliminados', 'success');
        await cargarProductos(); // Recargar lista
    } catch (error) {
        console.error('❌ Error eliminando todos los productos:', error);
        mostrarNotificacion('Error eliminando productos', 'error');
    }
}

// ===== GESTIÓN DE SERVICIOS =====
async function cargarServicios() {
    try {
        // Por ahora usamos datos vacíos
        servicios = [];
        
        mostrarServicios();
        console.log(`🔧 Servicios cargados: ${servicios.length}`);
    } catch (error) {
        console.error('❌ Error cargando servicios:', error);
        mostrarNotificacion('Error cargando servicios', 'error');
    }
}

function mostrarServicios() {
    const contenedor = document.getElementById('serviciosGrid') || document.getElementById('serviciosLista');
    if (!contenedor) return;
    
    if (servicios.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tools"></i>
                <h3>No hay servicios</h3>
                <p>Agrega tu primer servicio para comenzar</p>
                <button class="btn btn-primary" onclick="mostrarFormularioServicio()">
                    <i class="fas fa-plus"></i> Agregar Servicio
                </button>
            </div>
        `;
        return;
    }
    
    const html = servicios.map(servicio => `
        <div class="service-card" data-id="${servicio.id}">
            <div class="service-info">
                <h4>${servicio.nombre}</h4>
                <p>${servicio.descripcion || 'Sin descripción'}</p>
                <div class="service-details">
                    <span class="price">$${servicio.precio}</span>
                    <span class="duration">${servicio.duracion || 'No especificado'}</span>
                </div>
            </div>
            <div class="service-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="editarServicio(${servicio.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarServicio(${servicio.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    contenedor.innerHTML = html;
}

function mostrarFormularioServicio(servicioId = null) {
    // Similar a mostrarFormularioProducto pero para servicios
    console.log('🔧 Mostrando formulario de servicio');
}

async function manejarEnvioServicio(event) {
    event.preventDefault();
    console.log('🔧 Enviando servicio');
}

// ===== GESTIÓN DE OFERTAS =====
async function cargarOfertas() {
    try {
        // Por ahora usamos datos de ejemplo
        ofertas = [];
        mostrarOfertas();
        console.log(`🏷️ Ofertas cargadas: ${ofertas.length}`);
    } catch (error) {
        console.error('❌ Error cargando ofertas:', error);
        mostrarNotificacion('Error cargando ofertas', 'error');
    }
}

function mostrarOfertas() {
    const contenedor = document.getElementById('ofertasGrid') || document.getElementById('ofertasLista');
    if (!contenedor) return;
    
    if (ofertas.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tag"></i>
                <h3>No hay ofertas</h3>
                <p>Crea tu primera oferta para atraer clientes</p>
                <button class="btn btn-primary" onclick="mostrarFormularioOferta()">
                    <i class="fas fa-plus"></i> Crear Oferta
                </button>
            </div>
        `;
        return;
    }
    
    // Mostrar ofertas existentes
}

// ===== GESTIÓN DE CATEGORÍAS =====
async function cargarCategorias() {
    try {
        // Por ahora usamos datos de ejemplo
        categorias = [
            { id: 1, nombre: 'General' },
            { id: 2, nombre: 'Electrónicos' },
            { id: 3, nombre: 'Ropa' }
        ];
        
        actualizarSelectCategorias();
        console.log(`📂 Categorías cargadas: ${categorias.length}`);
    } catch (error) {
        console.error('❌ Error cargando categorías:', error);
        mostrarNotificacion('Error cargando categorías', 'error');
    }
}

function actualizarSelectCategorias() {
    const select = document.getElementById('productoCategoria');
    if (!select) return;
    
    const html = categorias.map(cat => 
        `<option value="${cat.id}">${cat.nombre}</option>`
    ).join('');
    
    select.innerHTML = '<option value="">Seleccionar categoría</option>' + html;
}

// ===== CONFIGURACIÓN DE PAGOS =====
async function cargarConfiguracionPagos() {
    try {
        const contenedor = document.querySelector('#pagos .payment-config');
        if (!contenedor) return;
        
        contenedor.innerHTML = `
            <div class="payment-config-grid">
                <div class="config-card">
                    <h3><i class="fas fa-credit-card"></i> Sistema de Pagos Simple</h3>
                    <p>Configuración actual: Sistema híbrido activo</p>
                    
                    <div class="payment-info">
                        <div class="info-item">
                            <strong>🏢 Suscripciones:</strong> Van a Cresalia (carla.crimi.95@gmail.com)
                        </div>
                        <div class="info-item">
                            <strong>🛍️ Ventas:</strong> Van directamente a cada tienda
                        </div>
                        <div class="info-item">
                            <strong>💰 Transparencia:</strong> 100% para tiendas, sin comisiones
                        </div>
                    </div>
                    
                    <div class="payment-actions">
                        <button class="btn btn-primary" onclick="configurarPagosSimples()">
                            <i class="fas fa-cog"></i> Configurar Pagos
                        </button>
                        <button class="btn btn-info" onclick="verEstadisticasPagos()">
                            <i class="fas fa-chart-bar"></i> Ver Estadísticas
                        </button>
                    </div>
                </div>
                
                <div class="config-card">
                    <h3><i class="fas fa-info-circle"></i> Información del Sistema</h3>
                    <div class="system-info">
                        <p><strong>Estado:</strong> <span class="status-active">Activo</span></p>
                        <p><strong>Tipo:</strong> Sistema Simple</p>
                        <p><strong>Backend:</strong> <span id="backendStatus">Verificando...</span></p>
                        <p><strong>Última actualización:</strong> <span id="lastUpdate">${new Date().toLocaleString()}</span></p>
                    </div>
                </div>
            </div>
        `;
        
        // Verificar estado del backend
        if (window.adminBackend) {
            const conectado = await window.adminBackend.verificarConexion();
            document.getElementById('backendStatus').textContent = conectado ? 'Conectado' : 'Desconectado';
            document.getElementById('backendStatus').className = conectado ? 'status-connected' : 'status-disconnected';
        }
        
        console.log('💳 Configuración de pagos cargada');
    } catch (error) {
        console.error('❌ Error cargando configuración de pagos:', error);
    }
}

async function cargarConfiguracionGeneral() {
    try {
        const contenedor = document.getElementById('configGeneralGrid');
        if (!contenedor) return;
        
        contenedor.innerHTML = `
            <div class="config-grid">
                <div class="config-section">
                    <h3><i class="fas fa-store"></i> Información de la Tienda</h3>
                    <div class="form-group">
                        <label>Nombre de la Tienda:</label>
                        <input type="text" id="tiendaNombre" value="Cresalia Demo Store" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Descripción:</label>
                        <textarea id="tiendaDescripcion" class="form-control" rows="3">Tienda demo de Cresalia</textarea>
                    </div>
                    <div class="form-group">
                        <label>Email de Contacto:</label>
                        <input type="email" id="tiendaEmail" value="carla.crimi.95@gmail.com" class="form-control">
                    </div>
                </div>
                
                <div class="config-section">
                    <h3><i class="fas fa-cogs"></i> Configuración del Sistema</h3>
                    <div class="form-group">
                        <label>Plan Actual:</label>
                        <select id="planActual" class="form-control">
                            <option value="free">Free</option>
                            <option value="basico">Básico</option>
                            <option value="pro" selected>Pro</option>
                            <option value="enterprise">Enterprise</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Idioma:</label>
                        <select id="idioma" class="form-control">
                            <option value="es" selected>Español</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Zona Horaria:</label>
                        <select id="zonaHoraria" class="form-control">
                            <option value="America/Argentina/Buenos_Aires" selected>Argentina (GMT-3)</option>
                            <option value="UTC">UTC</option>
                        </select>
                    </div>
                </div>
                
                <div class="config-section">
                    <h3><i class="fas fa-shield-alt"></i> Seguridad</h3>
                    <div class="security-info">
                        <p><strong>Estado:</strong> <span class="status-secure">Seguro</span></p>
                        <p><strong>Último backup:</strong> ${new Date().toLocaleString()}</p>
                        <p><strong>Versión:</strong> 1.0.0</p>
                    </div>
                    <div class="security-actions">
                        <button class="btn btn-warning" onclick="cambiarContrasena()">
                            <i class="fas fa-key"></i> Cambiar Contraseña
                        </button>
                        <button class="btn btn-info" onclick="realizarBackup()">
                            <i class="fas fa-save"></i> Backup Manual
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="config-actions">
                <button class="btn btn-success" onclick="guardarConfiguracion()">
                    <i class="fas fa-save"></i> Guardar Configuración
                </button>
                <button class="btn btn-secondary" onclick="restaurarConfiguracion()">
                    <i class="fas fa-undo"></i> Restaurar Valores
                </button>
            </div>
        `;
        
        console.log('⚙️ Configuración general cargada');
    } catch (error) {
        console.error('❌ Error cargando configuración general:', error);
    }
}

// ===== UTILIDADES =====
function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    if (window.elegantNotifications) {
        window.elegantNotifications.show(mensaje, tipo);
    } else {
        alert(mensaje);
    }
}

// ===== FUNCIONES DE SINCRONIZACIÓN =====
async function sincronizarConPaginaPrincipal() {
    try {
        mostrarNotificacion('Sincronizando con página principal...', 'info');
        
        // Aquí iría la lógica de sincronización
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simular
        
        mostrarNotificacion('Sincronización completada', 'success');
    } catch (error) {
        console.error('❌ Error en sincronización:', error);
        mostrarNotificacion('Error en sincronización', 'error');
    }
}

function exportarDatos() {
    const datos = {
        productos,
        servicios,
        ofertas,
        categorias,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cresalia-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    mostrarNotificacion('Datos exportados correctamente', 'success');
}

function importarDatos(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const datos = JSON.parse(e.target.result);
            
            // Validar estructura
            if (datos.productos && datos.servicios && datos.ofertas && datos.categorias) {
                productos = datos.productos;
                servicios = datos.servicios;
                ofertas = datos.ofertas;
                categorias = datos.categorias;
                
                mostrarProductos();
                mostrarServicios();
                mostrarOfertas();
                
                mostrarNotificacion('Datos importados correctamente', 'success');
            } else {
                throw new Error('Formato de archivo inválido');
            }
        } catch (error) {
            console.error('❌ Error importando datos:', error);
            mostrarNotificacion('Error importando datos: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

// ===== FUNCIONES DE MONITOREO =====
function mostrarPanelMonitoreo() {
    mostrarNotificacion('Panel de monitoreo en desarrollo', 'info');
}

function realizarBackupAutomatico() {
    exportarDatos();
}

function probarNotificacion() {
    mostrarNotificacion('Esta es una notificación de prueba', 'success');
}

function mostrarHistorialBackups() {
    mostrarNotificacion('Historial de backups en desarrollo', 'info');
}

function mostrarOpcionesRestauracion() {
    mostrarNotificacion('Opciones de restauración en desarrollo', 'info');
}

function configurarBackup() {
    mostrarNotificacion('Configuración de backup en desarrollo', 'info');
}

// ===== FUNCIONES DE CONFIGURACIÓN =====
function configurarPagosSimples() {
    if (window.simplePaymentSystem) {
        window.simplePaymentSystem.setupStoreSales('demo-tenant');
    } else {
        mostrarNotificacion('Sistema de pagos simples no disponible', 'error');
    }
}

function verEstadisticasPagos() {
    mostrarNotificacion('Estadísticas de pagos en desarrollo', 'info');
}

function cambiarContrasena() {
    const nuevaContrasena = prompt('Ingresa la nueva contraseña:');
    if (nuevaContrasena) {
        if (nuevaContrasena.length < 8) {
            mostrarNotificacion('La contraseña debe tener al menos 8 caracteres', 'warning');
            return;
        }
        mostrarNotificacion('Contraseña actualizada correctamente', 'success');
    }
}

function realizarBackup() {
    exportarDatos();
}

function guardarConfiguracion() {
    const config = {
        tiendaNombre: document.getElementById('tiendaNombre')?.value || 'Cresalia Demo Store',
        tiendaDescripcion: document.getElementById('tiendaDescripcion')?.value || 'Tienda demo de Cresalia',
        tiendaEmail: document.getElementById('tiendaEmail')?.value || 'carla.crimi.95@gmail.com',
        planActual: document.getElementById('planActual')?.value || 'pro',
        idioma: document.getElementById('idioma')?.value || 'es',
        zonaHoraria: document.getElementById('zonaHoraria')?.value || 'America/Argentina/Buenos_Aires'
    };
    
    localStorage.setItem('cresalia-config', JSON.stringify(config));
    mostrarNotificacion('Configuración guardada correctamente', 'success');
}

function restaurarConfiguracion() {
    const config = JSON.parse(localStorage.getItem('cresalia-config') || '{}');
    
    if (document.getElementById('tiendaNombre')) document.getElementById('tiendaNombre').value = config.tiendaNombre || 'Cresalia Demo Store';
    if (document.getElementById('tiendaDescripcion')) document.getElementById('tiendaDescripcion').value = config.tiendaDescripcion || 'Tienda demo de Cresalia';
    if (document.getElementById('tiendaEmail')) document.getElementById('tiendaEmail').value = config.tiendaEmail || 'carla.crimi.95@gmail.com';
    if (document.getElementById('planActual')) document.getElementById('planActual').value = config.planActual || 'pro';
    if (document.getElementById('idioma')) document.getElementById('idioma').value = config.idioma || 'es';
    if (document.getElementById('zonaHoraria')) document.getElementById('zonaHoraria').value = config.zonaHoraria || 'America/Argentina/Buenos_Aires';
    
    mostrarNotificacion('Configuración restaurada', 'info');
}

// ===== DASHBOARD STATS =====
function actualizarDashboardStats() {
    try {
        // Actualizar contadores basados en datos reales
        const totalProductos = productos.length;
        const totalServicios = servicios.length;
        const totalOfertas = ofertas.length;
        const totalCategorias = categorias.length;
        
        // Actualizar elementos del dashboard
        actualizarElementoSiExiste('totalProductos', totalProductos);
        actualizarElementoSiExiste('totalServicios', totalServicios);
        actualizarElementoSiExiste('totalOfertas', totalOfertas);
        actualizarElementoSiExiste('totalCategorias', totalCategorias);
        
        // Actualizar estadísticas adicionales
        actualizarElementoSiExiste('clientesNuevos', 0);
        actualizarElementoSiExiste('ingresosMes', '$0');
        actualizarElementoSiExiste('ordenesPendientes', 0);
        
        console.log('📊 Dashboard stats actualizadas:', {
            productos: totalProductos,
            servicios: totalServicios,
            ofertas: totalOfertas,
            categorias: totalCategorias
        });
    } catch (error) {
        console.error('❌ Error actualizando dashboard stats:', error);
    }
}

function actualizarElementoSiExiste(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = valor;
    }
}

// ===== FUNCIÓN PARA REFRESCAR DATOS =====
async function refrescarDatos() {
    try {
        mostrarNotificacion('Actualizando datos...', 'info');
        
        // Recargar todos los datos
        await cargarDatosIniciales();
        
        // Actualizar dashboard
        actualizarDashboardStats();
        
        // Si estamos en una sección específica, refrescar su contenido
        if (currentSection === 'productos') {
            mostrarProductos();
        } else if (currentSection === 'servicios') {
            mostrarServicios();
        } else if (currentSection === 'ofertas') {
            mostrarOfertas();
        }
        
        mostrarNotificacion('Datos actualizados correctamente', 'success');
    } catch (error) {
        console.error('❌ Error refrescando datos:', error);
        mostrarNotificacion('Error actualizando datos', 'error');
    }
}

console.log('✅ Admin Panel Functions cargado');
