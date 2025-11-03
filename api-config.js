// ==================== CONFIGURACIÓN API FRIOCAS ====================

const API_CONFIG = {
    // URL base del backend - detecta automáticamente el entorno
    BASE_URL: (() => {
        // Si estamos en Vercel (producción)
        if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
            return 'https://cresalia-web.vercel.app/api';
        }
        // Si estamos en Railway
        if (typeof window !== 'undefined' && window.location.hostname.includes('railway.app')) {
            return 'https://cresalia-backend-production.up.railway.app/api';
        }
        // Desarrollo local
        return 'http://localhost:3001/api';
    })(),
    
    // Endpoints principales
    ENDPOINTS: {
        // Productos
        PRODUCTOS: '/productos',
        PRODUCTO_DETALLE: (id) => `/productos/${id}`,
        CATEGORIAS: '/categorias',
        
        // Usuarios
        USUARIOS_REGISTRO: '/usuarios/registro',
        USUARIOS_LOGIN: '/usuarios/login',
        USUARIOS_PERFIL: (id) => `/usuarios/${id}`,
        
        // Carrito y órdenes
        CARRITO: '/carrito',
        CARRITO_USUARIO: (usuarioId) => `/carrito/${usuarioId}`,
        ORDENES: '/ordenes',
        ORDENES_USUARIO: (usuarioId) => `/ordenes/usuario/${usuarioId}`,
        
        // Wishlist
        WISHLIST: (usuarioId) => `/wishlist/${usuarioId}`,
        WISHLIST_AGREGAR: '/wishlist/agregar',
        WISHLIST_REMOVER: '/wishlist/remover',
        
        // Cupones
        CUPONES_VALIDAR: '/cupones/validar',
        
        // Estadísticas
        STATS: '/stats',
        
        // Test
        TEST: '/test'
    },
    
    // Headers por defecto
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// ==================== CLASE API MANAGER ====================

class FRIOCASApiManager {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.headers = { ...API_CONFIG.DEFAULT_HEADERS };
        this.isConnected = false;
        this.testConnection();
    }
    
    // Probar conexión con el backend
    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.TEST}`);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Conexión con backend FRIOCAS establecida:', data.mensaje);
                this.isConnected = true;
                this.showNotification('Backend conectado', 'success');
            } else {
                throw new Error('Backend no responde');
            }
        } catch (error) {
            console.warn('⚠️ Backend no disponible, usando modo offline:', error.message);
            this.isConnected = false;
            this.showNotification('Modo offline activado', 'warning');
        }
    }
    
    // Método genérico para hacer requests
    async makeRequest(endpoint, options = {}) {
        if (!this.isConnected) {
            throw new Error('Backend no disponible');
        }
        
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: { ...this.headers, ...options.headers },
            ...options
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en request API:', error);
            throw error;
        }
    }
    
    // ==================== PRODUCTOS ====================
    
    async getProductos(filtros = {}) {
        const params = new URLSearchParams(filtros);
        return await this.makeRequest(`${API_CONFIG.ENDPOINTS.PRODUCTOS}?${params}`);
    }
    
    async getProducto(id) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.PRODUCTO_DETALLE(id));
    }
    
    async getCategorias() {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.CATEGORIAS);
    }
    
    // ==================== USUARIOS ====================
    
    async registrarUsuario(datosUsuario) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.USUARIOS_REGISTRO, {
            method: 'POST',
            body: JSON.stringify(datosUsuario)
        });
    }
    
    async loginUsuario(credenciales) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.USUARIOS_LOGIN, {
            method: 'POST',
            body: JSON.stringify(credenciales)
        });
    }
    
    async getPerfilUsuario(id) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.USUARIOS_PERFIL(id));
    }
    
    // ==================== CARRITO ====================
    
    async getCarrito(usuarioId) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.CARRITO_USUARIO(usuarioId));
    }
    
    async agregarAlCarrito(usuarioId, item) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.CARRITO, {
            method: 'POST',
            body: JSON.stringify({
                usuario_id: usuarioId,
                ...item
            })
        });
    }
    
    async actualizarCarrito(usuarioId, itemId, cantidad) {
        return await this.makeRequest(`${API_CONFIG.ENDPOINTS.CARRITO}/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({
                usuario_id: usuarioId,
                cantidad: cantidad
            })
        });
    }
    
    async removerDelCarrito(usuarioId, itemId) {
        return await this.makeRequest(`${API_CONFIG.ENDPOINTS.CARRITO}/${itemId}`, {
            method: 'DELETE',
            body: JSON.stringify({ usuario_id: usuarioId })
        });
    }
    
    async limpiarCarrito(usuarioId) {
        return await this.makeRequest(`${API_CONFIG.ENDPOINTS.CARRITO}/limpiar`, {
            method: 'POST',
            body: JSON.stringify({ usuario_id: usuarioId })
        });
    }
    
    // ==================== ÓRDENES ====================
    
    async crearOrden(datosOrden) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.ORDENES, {
            method: 'POST',
            body: JSON.stringify(datosOrden)
        });
    }
    
    async getOrdenesUsuario(usuarioId) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.ORDENES_USUARIO(usuarioId));
    }
    
    async getOrden(id) {
        return await this.makeRequest(`${API_CONFIG.ENDPOINTS.ORDENES}/${id}`);
    }
    
    // ==================== WISHLIST ====================
    
    async getWishlist(usuarioId) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.WISHLIST(usuarioId));
    }
    
    async agregarAWishlist(usuarioId, productoId) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.WISHLIST_AGREGAR, {
            method: 'POST',
            body: JSON.stringify({
                usuario_id: usuarioId,
                producto_id: productoId
            })
        });
    }
    
    async removerDeWishlist(usuarioId, productoId) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.WISHLIST_REMOVER, {
            method: 'POST',
            body: JSON.stringify({
                usuario_id: usuarioId,
                producto_id: productoId
            })
        });
    }
    
    // ==================== CUPONES ====================
    
    async validarCupon(codigo) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.CUPONES_VALIDAR, {
            method: 'POST',
            body: JSON.stringify({ codigo: codigo })
        });
    }
    
               // ==================== ESTADÍSTICAS ====================

           async getEstadisticas() {
               return await this.makeRequest(API_CONFIG.ENDPOINTS.STATS);
           }

           // ==================== SOPORTE ====================

           async getClientes() {
               return await this.makeRequest('/soporte/clientes');
           }

           async getOrdenes() {
               return await this.makeRequest('/soporte/ordenes');
           }

           async getOrdenDetalle(id) {
               return await this.makeRequest(`/soporte/ordenes/${id}`);
           }

           async actualizarEstadoOrden(id, estado, notas = '') {
               return await this.makeRequest(`/soporte/ordenes/${id}/estado`, {
                   method: 'PUT',
                   body: JSON.stringify({ estado, notas })
               });
           }

           async getReporteVentas(fechaInicio = null, fechaFin = null) {
               const params = new URLSearchParams();
               if (fechaInicio) params.append('fecha_inicio', fechaInicio);
               if (fechaFin) params.append('fecha_fin', fechaFin);
               
               return await this.makeRequest(`/soporte/reportes/ventas?${params}`);
           }

           async getProductosVendidos(limite = 10) {
               return await this.makeRequest(`/soporte/reportes/productos-vendidos?limite=${limite}`);
           }
    
    // ==================== UTILIDADES ====================
    
    showNotification(mensaje, tipo = 'info') {
        // Crear notificación no intrusiva
        const notification = document.createElement('div');
        notification.className = `api-notification api-notification-${tipo}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : tipo === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${mensaje}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Sincronizar carrito local con backend
    async sincronizarCarrito(usuarioId) {
        if (!this.isConnected) return;
        
        try {
            const carritoLocal = JSON.parse(localStorage.getItem('friocas_carrito') || '[]');
            const carritoBackend = await this.getCarrito(usuarioId);
            
            // Si hay diferencias, sincronizar
            if (JSON.stringify(carritoLocal) !== JSON.stringify(carritoBackend)) {
                // Implementar lógica de sincronización
                console.log('🔄 Sincronizando carrito...');
            }
        } catch (error) {
            console.error('Error al sincronizar carrito:', error);
        }
    }
}

// ==================== INSTANCIA GLOBAL ====================

// Crear instancia global del API Manager
window.friocasAPI = new FRIOCASApiManager();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FRIOCASApiManager, API_CONFIG };
}
