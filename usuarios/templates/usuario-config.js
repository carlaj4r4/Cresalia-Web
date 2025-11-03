// ==================== CONFIGURACIÓN DE USUARIO ====================

// Configuración específica del usuario
const USUARIO_CONFIG = {
    id: '{{ID_USUARIO}}',
    nombre: '{{NOMBRE_USUARIO}}',
    email: '{{EMAIL_USUARIO}}',
    telefono: '{{TELEFONO_USUARIO}}',
    fechaNacimiento: '{{FECHA_NACIMIENTO}}',
    preferencias: '{{PREFERENCIAS_USUARIO}}',
    direcciones: {{DIRECCIONES_USUARIO}},
    metodosPago: {{METODOS_PAGO_USUARIO}}
};

// ==================== INICIALIZACIÓN DEL USUARIO ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('👤 Inicializando perfil de usuario:', USUARIO_CONFIG.nombre);
    
    // Cargar estadísticas del usuario
    cargarEstadisticasUsuario();
    
    // Cargar pedidos del usuario
    cargarPedidosUsuario();
    
    // Cargar favoritos del usuario
    cargarFavoritosUsuario();
    
    // Configurar formulario de perfil
    configurarFormularioPerfil();
    
    // Cargar direcciones del usuario
    cargarDireccionesUsuario();
});

// ==================== FUNCIONES DEL USUARIO ====================

async function cargarEstadisticasUsuario() {
    try {
        const response = await fetch(`/api/usuarios/${USUARIO_CONFIG.id}/estadisticas`);
        const stats = await response.json();
        
        // Actualizar estadísticas en la UI
        document.getElementById('totalPedidos').textContent = stats.totalPedidos || 0;
        document.getElementById('totalGastado').textContent = `$${(stats.totalGastado || 0).toLocaleString()}`;
        document.getElementById('productosFavoritos').textContent = stats.productosFavoritos || 0;
        document.getElementById('tiendasSeguidas').textContent = stats.tiendasSeguidas || 0;
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

async function cargarPedidosUsuario() {
    try {
        const response = await fetch(`/api/usuarios/${USUARIO_CONFIG.id}/pedidos`);
        const pedidos = await response.json();
        
        const pedidosList = document.getElementById('pedidosList');
        if (pedidosList && pedidos.length > 0) {
            pedidosList.innerHTML = pedidos.map(pedido => `
                <div class="pedido-card mb-3 p-3 border rounded">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <strong>Pedido #${pedido.numero_orden}</strong>
                            <br><small class="text-muted">${new Date(pedido.created_at).toLocaleDateString()}</small>
                        </div>
                        <div class="col-md-3">
                            <span class="badge bg-${pedido.estado === 'completado' ? 'success' : 'warning'}">${pedido.estado}</span>
                        </div>
                        <div class="col-md-3">
                            <strong>$${pedido.total.toLocaleString()}</strong>
                        </div>
                        <div class="col-md-3">
                            <button class="btn btn-outline-primary btn-sm" onclick="verDetallePedido('${pedido.id}')">
                                <i class="fas fa-eye"></i> Ver Detalle
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error cargando pedidos:', error);
    }
}

async function cargarFavoritosUsuario() {
    try {
        const response = await fetch(`/api/usuarios/${USUARIO_CONFIG.id}/favoritos`);
        const favoritos = await response.json();
        
        const favoritosList = document.getElementById('favoritosList');
        if (favoritosList && favoritos.length > 0) {
            favoritosList.innerHTML = favoritos.map(producto => `
                <div class="favorito-card mb-3 p-3 border rounded">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${producto.imagen_principal}" alt="${producto.nombre}" class="img-fluid rounded" style="width: 60px; height: 60px; object-fit: cover;">
                        </div>
                        <div class="col-md-4">
                            <h6>${producto.nombre}</h6>
                            <small class="text-muted">${producto.tienda_nombre}</small>
                        </div>
                        <div class="col-md-3">
                            <strong>$${producto.precio.toLocaleString()}</strong>
                        </div>
                        <div class="col-md-3">
                            <button class="btn btn-primary btn-sm me-2" onclick="agregarAlCarrito('${producto.id}')">
                                <i class="fas fa-shopping-cart"></i> Comprar
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="quitarDeFavoritos('${producto.id}')">
                                <i class="fas fa-heart-broken"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error cargando favoritos:', error);
    }
}

function configurarFormularioPerfil() {
    const perfilForm = document.getElementById('perfilForm');
    if (perfilForm) {
        perfilForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const datosActualizados = {
                nombre: document.getElementById('nombre').value,
                telefono: document.getElementById('telefono').value,
                fechaNacimiento: document.getElementById('fechaNacimiento').value,
                preferencias: document.getElementById('preferencias').value
            };
            
            try {
                const response = await fetch(`/api/usuarios/${USUARIO_CONFIG.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosActualizados)
                });
                
                if (response.ok) {
                    mostrarNotificacion('Perfil actualizado correctamente', 'success');
                    // Actualizar configuración local
                    Object.assign(USUARIO_CONFIG, datosActualizados);
                } else {
                    mostrarNotificacion('Error al actualizar el perfil', 'error');
                }
            } catch (error) {
                console.error('Error actualizando perfil:', error);
                mostrarNotificacion('Error de conexión', 'error');
            }
        });
    }
}

function cargarDireccionesUsuario() {
    const direccionesList = document.getElementById('direccionesList');
    if (direccionesList && USUARIO_CONFIG.direcciones.length > 0) {
        direccionesList.innerHTML = USUARIO_CONFIG.direcciones.map((direccion, index) => `
            <div class="direccion-card mb-3 p-3 border rounded">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h6>${direccion.tipo}</h6>
                        <p class="mb-1">${direccion.direccion}</p>
                        <small class="text-muted">${direccion.ciudad}, ${direccion.codigo_postal}</small>
                    </div>
                    <div class="col-md-4 text-end">
                        <button class="btn btn-outline-primary btn-sm me-2" onclick="editarDireccion(${index})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="eliminarDireccion(${index})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// ==================== FUNCIONES AUXILIARES ====================

function agregarDireccion() {
    // Implementar modal para agregar nueva dirección
    console.log('➕ Agregando nueva dirección');
}

function editarDireccion(index) {
    // Implementar modal para editar dirección
    console.log('✏️ Editando dirección:', index);
}

function eliminarDireccion(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
        // Implementar eliminación de dirección
        console.log('🗑️ Eliminando dirección:', index);
    }
}

function verDetallePedido(pedidoId) {
    // Implementar modal o página de detalle del pedido
    console.log('👁️ Viendo detalle del pedido:', pedidoId);
}

function quitarDeFavoritos(productoId) {
    // Implementar lógica para quitar de favoritos
    console.log('💔 Quitando de favoritos:', productoId);
}

function cerrarSesion() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Limpiar datos de sesión
        localStorage.removeItem('usuario_sesion');
        sessionStorage.clear();
        
        // Redirigir al inicio
        window.location.href = '../../index-cresalia.html';
    }
}

function mostrarNotificacion(mensaje, tipo) {
    // Implementar sistema de notificaciones
    console.log(`📢 ${tipo.toUpperCase()}: ${mensaje}`);
}

// ==================== INTEGRACIÓN CON CRESALIA ====================

// Función para conectar con el sistema principal de Cresalia
function conectarConCresalia() {
    // Enviar datos del usuario al sistema principal
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'USUARIO_LOADED',
            data: USUARIO_CONFIG
        }, '*');
    }
}

// Llamar cuando el perfil esté completamente cargado
window.addEventListener('load', conectarConCresalia);























