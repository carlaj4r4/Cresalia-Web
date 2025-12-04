// ===== CRESALIA USER STATUS SYSTEM =====
// Sistema automático de activo/inactivo para usuarios y tenants

class UserStatusSystem {
    constructor() {
        this.statusConfig = {
            // Tiempos de inactividad (en milisegundos)
            INACTIVE_THRESHOLD: 30 * 24 * 60 * 60 * 1000, // 30 días
            SUSPENDED_THRESHOLD: 60 * 24 * 60 * 60 * 1000, // 60 días
            DELETED_THRESHOLD: 90 * 24 * 60 * 60 * 1000, // 90 días
            
            // Frecuencia de verificación
            CHECK_INTERVAL: 24 * 60 * 60 * 1000, // 24 horas
            
            // Notificaciones
            WARNING_DAYS: [7, 3, 1], // Días antes de suspender
        };
        
        this.init();
    }

    init() {
        this.startStatusMonitoring();
        this.setupEventListeners();
        console.log('🔄 User Status System iniciado');
    }

    // ===== MONITOREO AUTOMÁTICO =====
    startStatusMonitoring() {
        // Verificar estado cada 24 horas
        setInterval(() => {
            this.checkAllUsersStatus();
        }, this.statusConfig.CHECK_INTERVAL);

        // Verificar inmediatamente al iniciar
        this.checkAllUsersStatus();
    }

    async checkAllUsersStatus() {
        try {
            console.log('🔍 Verificando estado de todos los usuarios...');
            
            // Obtener todos los usuarios
            const users = await this.getAllUsers();
            
            for (const user of users) {
                await this.checkUserStatus(user);
            }
            
            console.log('✅ Verificación de estados completada');
        } catch (error) {
            console.error('❌ Error verificando estados:', error);
        }
    }

    async getAllUsers() {
        try {
            if (window.adminBackend) {
                const response = await window.adminBackend.getEstadisticas();
                return response.users || [];
            }
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
        }
        return [];
    }

    async checkUserStatus(user) {
        const now = Date.now();
        const lastActivity = new Date(user.last_activity || user.created_at).getTime();
        const daysInactive = (now - lastActivity) / (24 * 60 * 60 * 1000);

        let newStatus = user.status || 'active';

        // Determinar nuevo estado
        if (daysInactive >= this.statusConfig.DELETED_THRESHOLD / (24 * 60 * 60 * 1000)) {
            newStatus = 'deleted';
        } else if (daysInactive >= this.statusConfig.SUSPENDED_THRESHOLD / (24 * 60 * 60 * 1000)) {
            newStatus = 'suspended';
        } else if (daysInactive >= this.statusConfig.INACTIVE_THRESHOLD / (24 * 60 * 60 * 1000)) {
            newStatus = 'inactive';
        }

        // Si el estado cambió, actualizar
        if (newStatus !== user.status) {
            await this.updateUserStatus(user.id, newStatus, daysInactive);
        }

        // Enviar notificaciones de advertencia
        this.checkWarningNotifications(user, daysInactive);
    }

    async updateUserStatus(userId, newStatus, daysInactive) {
        try {
            const updateData = {
                status: newStatus,
                status_updated_at: new Date().toISOString(),
                days_inactive: Math.floor(daysInactive)
            };

            // Actualizar en backend
            if (window.adminBackend) {
                await window.adminBackend.updateUserStatus(userId, updateData);
            }

            // Notificar a Crisla's Support
            this.notifyCrislaStatusChange(userId, newStatus, daysInactive);

            console.log(`🔄 Usuario ${userId} actualizado a estado: ${newStatus}`);
        } catch (error) {
            console.error('Error actualizando estado de usuario:', error);
        }
    }

    // ===== NOTIFICACIONES DE ADVERTENCIA =====
    checkWarningNotifications(user, daysInactive) {
        const daysUntilSuspension = (this.statusConfig.SUSPENDED_THRESHOLD / (24 * 60 * 60 * 1000)) - daysInactive;
        
        if (this.statusConfig.WARNING_DAYS.includes(Math.floor(daysUntilSuspension))) {
            this.sendWarningNotification(user, daysUntilSuspension);
        }
    }

    sendWarningNotification(user, daysLeft) {
        const notification = {
            type: 'user_warning',
            data: {
                user_id: user.id,
                user_email: user.email,
                days_left: daysLeft,
                action: 'suspension_warning'
            },
            timestamp: new Date().toISOString()
        };

        // Enviar a Crisla's Support
        if (window.crislaSupportIntegration) {
            window.crislaSupportIntegration.sendNotification('user_warning', notification.data);
        }

        // Enviar email al usuario (si está implementado)
        this.sendEmailWarning(user, daysLeft);
    }

    sendEmailWarning(user, daysLeft) {
        // Aquí se implementaría el envío de email
        console.log(`📧 Enviando advertencia: ${daysLeft} días hasta suspensión`);
    }

    // ===== NOTIFICACIÓN A CRISLA =====
    notifyCrislaStatusChange(userId, newStatus, daysInactive) {
        const notification = {
            type: 'user_status_change',
            data: {
                user_id: userId,
                new_status: newStatus,
                days_inactive: Math.floor(daysInactive),
                action: this.getStatusAction(newStatus)
            },
            timestamp: new Date().toISOString()
        };

        if (window.crislaSupportIntegration) {
            window.crislaSupportIntegration.sendNotification('user_status_change', notification.data);
        }
    }

    getStatusAction(status) {
        const actions = {
            'inactive': 'Marcado como inactivo',
            'suspended': 'Cuenta suspendida',
            'deleted': 'Cuenta eliminada',
            'active': 'Cuenta reactivada'
        };
        return actions[status] || 'Estado actualizado';
    }

    // ===== GESTIÓN DE ACTIVIDAD =====
    recordUserActivity(userId, activityType = 'general') {
        const activity = {
            user_id: userId,
            activity_type: activityType,
            timestamp: new Date().toISOString(),
            ip: this.getUserIP(),
            user_agent: navigator.userAgent
        };

        // Guardar actividad
        this.saveUserActivity(activity);

        // Actualizar última actividad
        this.updateLastActivity(userId);
    }

    saveUserActivity(activity) {
        const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
        activities.unshift(activity);
        
        // Mantener solo las últimas 1000 actividades
        if (activities.length > 1000) {
            activities.splice(1000);
        }
        
        localStorage.setItem('userActivities', JSON.stringify(activities));
    }

    updateLastActivity(userId) {
        const lastActivity = {
            user_id: userId,
            last_activity: new Date().toISOString()
        };

        // Actualizar en backend
        if (window.adminBackend) {
            window.adminBackend.updateLastActivity(userId, lastActivity);
        }
    }

    getUserIP() {
        // En un entorno real, esto se obtendría del servidor
        return 'client-side';
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Registrar actividad en eventos importantes
        const activityEvents = [
            'click', 'keypress', 'scroll', 'mousemove'
        ];

        let activityTimer;
        activityEvents.forEach(event => {
            document.addEventListener(event, () => {
                clearTimeout(activityTimer);
                activityTimer = setTimeout(() => {
                    this.recordUserActivity(this.getCurrentUserId(), 'interaction');
                }, 30000); // Registrar cada 30 segundos de actividad
            });
        });

        // Registrar actividad específica
        document.addEventListener('orderCreated', (e) => {
            this.recordUserActivity(this.getCurrentUserId(), 'order_created');
        });

        document.addEventListener('saleCreated', (e) => {
            this.recordUserActivity(this.getCurrentUserId(), 'sale_created');
        });

        document.addEventListener('login', (e) => {
            this.recordUserActivity(this.getCurrentUserId(), 'login');
        });
    }

    getCurrentUserId() {
        return localStorage.getItem('userId') || 'anonymous';
    }

    // ===== GESTIÓN MANUAL =====
    async suspendUser(userId, reason = 'Manual suspension') {
        await this.updateUserStatus(userId, 'suspended', 0);
        
        const notification = {
            type: 'manual_suspension',
            data: {
                user_id: userId,
                reason: reason,
                suspended_by: 'admin'
            }
        };

        if (window.crislaSupportIntegration) {
            window.crislaSupportIntegration.sendNotification('manual_suspension', notification.data);
        }
    }

    async reactivateUser(userId) {
        await this.updateUserStatus(userId, 'active', 0);
        
        const notification = {
            type: 'user_reactivated',
            data: {
                user_id: userId,
                reactivated_by: 'admin'
            }
        };

        if (window.crislaSupportIntegration) {
            window.crislaSupportIntegration.sendNotification('user_reactivated', notification.data);
        }
    }

    // ===== REPORTES =====
    getStatusReport() {
        const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
        const now = Date.now();
        
        const report = {
            total_users: activities.length,
            active_today: activities.filter(a => 
                (now - new Date(a.timestamp).getTime()) < 24 * 60 * 60 * 1000
            ).length,
            active_week: activities.filter(a => 
                (now - new Date(a.timestamp).getTime()) < 7 * 24 * 60 * 60 * 1000
            ).length,
            active_month: activities.filter(a => 
                (now - new Date(a.timestamp).getTime()) < 30 * 24 * 60 * 60 * 1000
            ).length,
            last_check: new Date().toISOString()
        };

        return report;
    }

    // ===== MÉTODOS PÚBLICOS =====
    getStatusConfig() {
        return this.statusConfig;
    }

    updateStatusConfig(newConfig) {
        this.statusConfig = { ...this.statusConfig, ...newConfig };
        console.log('⚙️ Configuración de estados actualizada');
    }

    forceStatusCheck() {
        this.checkAllUsersStatus();
    }
}

// ===== INSTANCIA GLOBAL =====
window.userStatusSystem = new UserStatusSystem();

console.log('✅ User Status System cargado');























