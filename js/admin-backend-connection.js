// ===== CRESALIA ADMIN BACKEND CONNECTION =====
// Sistema de conexión automática entre admin panel y backend

class AdminBackendConnection {
    constructor() {
        this.baseURL = 'http://localhost:3001';
        this.currentTenant = this.getCurrentTenant();
        this.authToken = this.getAuthToken();
    }

    // ===== GESTIÓN DE TENANT =====
    getCurrentTenant() {
        // Obtener tenant desde URL o localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const tenant = urlParams.get('tenant') || localStorage.getItem('currentTenant') || 'demo-store';
        localStorage.setItem('currentTenant', tenant);
        return tenant;
    }

    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    setAuthToken(token) {
        localStorage.setItem('authToken', token);
        this.authToken = token;
    }

    // ===== AUTENTICACIÓN =====
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-Slug': this.currentTenant
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (data.success) {
                this.setAuthToken(data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, error: 'Error de conexión' };
        }
    }

    async register(tenantData) {
        try {
            const response = await fetch(`${this.baseURL}/api/tenants/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tenantData)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en registro:', error);
            return { success: false, error: 'Error de conexión' };
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('currentTenant');
        this.authToken = null;
        window.location.href = 'landing-cresalia-DEFINITIVO.html';
    }

    // ===== GESTIÓN DE PRODUCTOS =====
    async getProductos() {
        try {
            const response = await fetch(`${this.baseURL}/api/${this.currentTenant}/productos`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'X-Tenant-Slug': this.currentTenant
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo productos:', error);
            return { success: false, error: 'Error de conexión' };
        }
    }

    async crearProducto(producto) {
        try {
            const response = await fetch(`${this.baseURL}/api/${this.currentTenant}/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`,
                    'X-Tenant-Slug': this.currentTenant
                },
                body: JSON.stringify(producto)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creando producto:', error);
            return { success: false, error: 'Error de conexión' };
        }
    }

    async actualizarProducto(id, producto) {
        try {
            const response = await fetch(`${this.baseURL}/api/${this.currentTenant}/productos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`,
                    'X-Tenant-Slug': this.currentTenant
                },
                body: JSON.stringify(producto)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error actualizando producto:', error);
            return { success: false, error: 'Error de conexión' };
        }
    }

    async eliminarProducto(id) {
        try {
            const response = await fetch(`${this.baseURL}/api/${this.currentTenant}/productos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'X-Tenant-Slug': this.currentTenant
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error eliminando producto:', error);
            return { success: false, error: 'Error de conexión' };
        }
    }

    // ===== MÉTODOS DE SUSCRIPCIÓN =====
    
    async updateTenantSubscription(tenantId, subscriptionData) {
        try {
            const response = await fetch(`${this.baseURL}/api/tenants/${tenantId}/subscription`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify(subscriptionData)
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('✅ Suscripción actualizada:', result);
            return result;
        } catch (error) {
            console.error('❌ Error actualizando suscripción:', error);
            throw error;
        }
    }

    async renewSubscription(tenantId, months = 1, transactionId = null) {
        try {
            const response = await fetch(`${this.baseURL}/api/subscriptions/${tenantId}/renew`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({ months, transaction_id: transactionId })
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('✅ Suscripción renovada:', result);
            return result;
        } catch (error) {
            console.error('❌ Error renovando suscripción:', error);
            throw error;
        }
    }

    async downgradeSubscription(tenantId, reason = 'Payment failed') {
        try {
            const response = await fetch(`${this.baseURL}/api/subscriptions/${tenantId}/downgrade`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({ reason })
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('✅ Suscripción degradada:', result);
            return result;
        } catch (error) {
            console.error('❌ Error degradando suscripción:', error);
            throw error;
        }
    }

    async getSubscriptionStats() {
        try {
            const response = await fetch(`${this.baseURL}/api/subscriptions/stats`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('📊 Estadísticas de suscripciones:', result);
            return result;
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            throw error;
        }
    }

    async getSubscriptionMonitor() {
        try {
            const response = await fetch(`${this.baseURL}/api/subscriptions/monitor`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('👁️ Monitoreo de suscripciones:', result);
            return result;
        } catch (error) {
            console.error('❌ Error obteniendo monitoreo:', error);
            throw error;
        }
    }

    // ===== GESTIÓN DE ÓRDENES =====
    async getOrdenes() {
        try {
            const response = await fetch(`${this.baseURL}/api/${this.currentTenant}/ordenes`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'X-Tenant-Slug': this.currentTenant
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo órdenes:', error);
            return { success: false, error: 'Error de conexión' };
        }
    }

    // ===== GESTIÓN DE CONFIGURACIÓN =====
    async getConfiguracion() {
        try {
            const response = await fetch(`${this.baseURL}/api/${this.currentTenant}/config`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'X-Tenant-Slug': this.currentTenant
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo configuración:', error);
            return { success: false, error: 'Error de conexión' };
        }
    }

    async actualizarConfiguracion(config) {
        try {
            const response = await fetch(`${this.baseURL}/api/${this.currentTenant}/config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`,
                    'X-Tenant-Slug': this.currentTenant
                },
                body: JSON.stringify(config)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error actualizando configuración:', error);
            return { success: false, error: 'Error de conexión' };
        }
    }

    // ===== ESTADÍSTICAS =====
    async getEstadisticas() {
        try {
            const response = await fetch(`${this.baseURL}/api/${this.currentTenant}/stats`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'X-Tenant-Slug': this.currentTenant
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return { success: false, error: 'Error de conexión' };
        }
    }

    // ===== VERIFICACIÓN DE CONEXIÓN =====
    async verificarConexion() {
        try {
            const response = await fetch(`${this.baseURL}/api/health`);
            const data = await response.json();
            return data.status === 'ok';
        } catch (error) {
            console.error('Error verificando conexión:', error);
            return false;
        }
    }

    // ===== NOTIFICACIONES =====
    mostrarNotificacion(mensaje, tipo = 'info') {
        if (window.elegantNotifications) {
            window.elegantNotifications.show(mensaje, tipo);
        } else {
            alert(mensaje);
        }
    }
}

// ===== INSTANCIA GLOBAL =====
window.adminBackend = new AdminBackendConnection();

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔗 Admin Backend Connection inicializado');
    
    // Verificar conexión
    const conectado = await window.adminBackend.verificarConexion();
    if (!conectado) {
        console.warn('⚠️ Backend no disponible, funcionando en modo offline');
        window.adminBackend.mostrarNotificacion('Modo offline activado', 'warning');
    } else {
        console.log('✅ Backend conectado correctamente');
    }
});

console.log('✅ Admin Backend Connection cargado');
