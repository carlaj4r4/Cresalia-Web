// ===== CRISLA'S SUPPORT INTEGRATION =====
// Sistema de integración completo para Crisla's Support

class CrislaSupportIntegration {
    constructor() {
        // Prevenir múltiples instancias
        if (window.crislaSupportInstance) {
            console.log('⚠️ CrislaSupportIntegration ya está inicializado');
            return window.crislaSupportInstance;
        }
        
        this.notifications = [];
        this.isConnected = false;
        this.monitoringInterval = null;
        this._notificationsLoaded = false;
        this.init();
        
        // Guardar instancia global
        window.crislaSupportInstance = this;
    }

    init() {
        this.loadNotifications();
        this.setupEventListeners();
        this.startMonitoring();
    }

    // ===== CARGA DE NOTIFICACIONES =====
    loadNotifications() {
        try {
            const stored = localStorage.getItem('crislaNotifications');
            this.notifications = stored ? JSON.parse(stored) : [];
            // Solo mostrar mensaje en la carga inicial, no en cada verificación
            if (!this._notificationsLoaded) {
                console.log('📢 Notificaciones de Crisla cargadas:', this.notifications.length);
                this._notificationsLoaded = true;
            }
        } catch (error) {
            console.error('Error cargando notificaciones:', error);
            this.notifications = [];
        }
    }

    // ===== MONITOREO AUTOMÁTICO =====
    startMonitoring() {
        // Prevenir múltiples intervalos
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        
        // Monitorear cambios en localStorage
        this.monitoringInterval = setInterval(() => {
            this.checkForNewNotifications();
        }, 5000); // Cada 5 segundos

        // Monitorear actividad del usuario
        this.monitorUserActivity();
    }

    checkForNewNotifications() {
        const currentCount = this.notifications.length;
        const previousNotifications = [...this.notifications];
        this.loadNotifications();
        
        // Solo mostrar mensaje si hay cambios reales
        if (this.notifications.length !== currentCount) {
            const newNotifications = this.notifications.slice(currentCount);
            this.processNewNotifications(newNotifications);
        }
    }

    processNewNotifications(notifications) {
        notifications.forEach(notification => {
            console.log('🔔 Nueva notificación para Crisla:', notification.type);
            this.showCrislaNotification(notification);
        });
    }

    // ===== MONITOREO DE ACTIVIDAD =====
    monitorUserActivity() {
        // Detectar nuevos pedidos
        document.addEventListener('orderCreated', (e) => {
            this.sendNotification('new_order', {
                tipo: 'pedido',
                datos: e.detail,
                usuario: this.getUserInfo()
            });
        });

        // Detectar nuevas ventas
        document.addEventListener('saleCreated', (e) => {
            this.sendNotification('new_sale', {
                tipo: 'venta',
                datos: e.detail,
                usuario: this.getUserInfo()
            });
        });

        // Detectar entradas emocionales
        document.addEventListener('emotionalEntry', (e) => {
            this.sendNotification('emotional_entry', {
                tipo: 'emocional',
                datos: e.detail,
                usuario: this.getUserInfo()
            });
        });

        // Detectar problemas técnicos
        document.addEventListener('error', (e) => {
            this.sendNotification('technical_error', {
                tipo: 'error',
                datos: {
                    message: e.message,
                    stack: e.error?.stack,
                    url: window.location.href
                },
                usuario: this.getUserInfo()
            });
        });

        // Detectar intentos de login fallidos
        document.addEventListener('loginFailed', (e) => {
            this.sendNotification('login_failed', {
                tipo: 'seguridad',
                datos: e.detail,
                usuario: this.getUserInfo()
            });
        });
    }

    // ===== ENVÍO DE NOTIFICACIONES =====
    sendNotification(type, data) {
        const notification = {
            id: Date.now() + Math.random(),
            type: type,
            data: data,
            timestamp: new Date().toISOString(),
            priority: this.getPriority(type),
            status: 'unread'
        };

        this.notifications.unshift(notification);
        
        // Mantener solo las últimas 200 notificaciones
        if (this.notifications.length > 200) {
            this.notifications.splice(200);
        }

        this.saveNotifications();
        console.log('📤 Notificación enviada a Crisla:', type);
    }

    getPriority(type) {
        const priorities = {
            'technical_error': 'high',
            'login_failed': 'high',
            'new_order': 'medium',
            'new_sale': 'medium',
            'emotional_entry': 'low'
        };
        return priorities[type] || 'medium';
    }

    saveNotifications() {
        localStorage.setItem('crislaNotifications', JSON.stringify(this.notifications));
    }

    // ===== NOTIFICACIONES VISUALES PARA CRISLA =====
    showCrislaNotification(notification) {
        // Solo mostrar si Crisla está logueada
        if (!this.isCrislaLoggedIn()) return;

        const notificationElement = this.createNotificationElement(notification);
        document.body.appendChild(notificationElement);

        // Auto-remover después de 10 segundos
        setTimeout(() => {
            if (notificationElement.parentNode) {
                notificationElement.remove();
            }
        }, 10000);
    }

    createNotificationElement(notification) {
        const element = document.createElement('div');
        element.className = `crisla-notification priority-${notification.priority}`;
        
        const icon = this.getNotificationIcon(notification.type);
        const title = this.getNotificationTitle(notification.type);
        
        element.innerHTML = `
            <div class="notification-header">
                <span class="notification-icon">${icon}</span>
                <span class="notification-title">${title}</span>
                <button class="close-notification">&times;</button>
            </div>
            <div class="notification-body">
                <p>${this.formatNotificationData(notification.data)}</p>
                <span class="notification-time">${new Date(notification.timestamp).toLocaleTimeString()}</span>
            </div>
        `;

        // Event listener para cerrar
        element.querySelector('.close-notification').addEventListener('click', () => {
            element.remove();
        });

        return element;
    }

    getNotificationIcon(type) {
        const icons = {
            'new_order': '🛒',
            'new_sale': '💰',
            'emotional_entry': '💜',
            'technical_error': '⚠️',
            'login_failed': '🔒'
        };
        return icons[type] || '📢';
    }

    getNotificationTitle(type) {
        const titles = {
            'new_order': 'Nuevo Pedido',
            'new_sale': 'Nueva Venta',
            'emotional_entry': 'Entrada Emocional',
            'technical_error': 'Error Técnico',
            'login_failed': 'Intento de Login Fallido'
        };
        return titles[type] || 'Notificación';
    }

    formatNotificationData(data) {
        if (data.tipo === 'pedido') {
            return `Pedido #${data.datos.id} por $${data.datos.total}`;
        } else if (data.tipo === 'venta') {
            return `Venta de ${data.datos.producto} por $${data.datos.total}`;
        } else if (data.tipo === 'emocional') {
            return `Entrada emocional: ${data.datos.emocion || 'Sin especificar'}`;
        } else if (data.tipo === 'error') {
            return `Error: ${data.datos.message}`;
        } else if (data.tipo === 'seguridad') {
            return `Intento de login fallido desde ${data.datos.ip || 'IP desconocida'}`;
        }
        return 'Nueva actividad detectada';
    }

    // ===== VERIFICACIÓN DE ESTADO DE CRISLA =====
    isCrislaLoggedIn() {
        // Verificar si Crisla está logueada en su sistema de soporte
        return localStorage.getItem('crislaLoggedIn') === 'true';
    }

    getUserInfo() {
        return {
            id: localStorage.getItem('userId') || 'anonymous',
            type: localStorage.getItem('userAccountType') || 'unknown',
            email: localStorage.getItem('userEmail') || 'N/A',
            tenant: localStorage.getItem('currentTenant') || 'demo-store',
            timestamp: new Date().toISOString()
        };
    }

    // ===== DASHBOARD PARA CRISLA =====
    getDashboardData() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const todayNotifications = this.notifications.filter(n => 
            new Date(n.timestamp) >= today
        );

        const stats = {
            total: this.notifications.length,
            today: todayNotifications.length,
            unread: this.notifications.filter(n => n.status === 'unread').length,
            byType: this.getNotificationsByType(),
            recent: this.notifications.slice(0, 10)
        };

        return stats;
    }

    getNotificationsByType() {
        const types = {};
        this.notifications.forEach(notification => {
            types[notification.type] = (types[notification.type] || 0) + 1;
        });
        return types;
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Escuchar eventos de login de Crisla
        window.addEventListener('crislaLoggedIn', () => {
            this.isConnected = true;
            console.log('👑 Crisla conectada al sistema de notificaciones');
        });

        // Escuchar eventos de logout de Crisla
        window.addEventListener('crislaLoggedOut', () => {
            this.isConnected = false;
            console.log('👑 Crisla desconectada del sistema de notificaciones');
        });

        // Escuchar comandos de Crisla
        window.addEventListener('crislaCommand', (e) => {
            this.handleCrislaCommand(e.detail);
        });
    }

    handleCrislaCommand(command) {
        switch (command.action) {
            case 'markAllRead':
                this.markAllAsRead();
                break;
            case 'clearNotifications':
                this.clearNotifications();
                break;
            case 'getStats':
                this.sendStatsToCrisla();
                break;
            default:
                console.log('Comando desconocido de Crisla:', command.action);
        }
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.status = 'read';
        });
        this.saveNotifications();
        console.log('✅ Todas las notificaciones marcadas como leídas');
    }

    clearNotifications() {
        this.notifications = [];
        this.saveNotifications();
        console.log('🗑️ Notificaciones limpiadas');
    }

    sendStatsToCrisla() {
        const stats = this.getDashboardData();
        window.dispatchEvent(new CustomEvent('crislaStats', { detail: stats }));
    }

    // ===== MÉTODOS PÚBLICOS =====
    getNotifications() {
        return this.notifications;
    }

    getUnreadCount() {
        return this.notifications.filter(n => n.status === 'unread').length;
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.status = 'read';
            this.saveNotifications();
        }
    }

    // ===== SIMULACIÓN DE ACTIVIDAD (PARA TESTING) =====
    simulateActivity() {
        const activities = [
            { type: 'new_order', data: { id: Date.now(), total: Math.random() * 100 + 10 } },
            { type: 'new_sale', data: { producto: 'Producto Test', total: Math.random() * 50 + 5 } },
            { type: 'emotional_entry', data: { emocion: '😊', nivel: 'feliz' } },
            { type: 'technical_error', data: { message: 'Error simulado para testing' } }
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        this.sendNotification(randomActivity.type, {
            tipo: 'simulacion',
            datos: randomActivity.data,
            usuario: this.getUserInfo()
        });
    }
}

// ===== INSTANCIA GLOBAL =====
window.crislaSupportIntegration = new CrislaSupportIntegration();

// ===== ESTILOS CSS PARA NOTIFICACIONES =====
const crislaNotificationStyles = `
    <style>
        .crisla-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 350px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            z-index: 10001;
            animation: slideIn 0.3s ease-out;
            border-left: 4px solid #7C3AED;
        }

        .crisla-notification.priority-high {
            border-left-color: #EF4444;
        }

        .crisla-notification.priority-medium {
            border-left-color: #F59E0B;
        }

        .crisla-notification.priority-low {
            border-left-color: #10B981;
        }

        .notification-header {
            display: flex;
            align-items: center;
            padding: 15px 20px 10px;
            border-bottom: 1px solid #E5E7EB;
        }

        .notification-icon {
            font-size: 24px;
            margin-right: 10px;
        }

        .notification-title {
            flex: 1;
            font-weight: 600;
            color: #1F2937;
        }

        .close-notification {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #6B7280;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .notification-body {
            padding: 10px 20px 15px;
        }

        .notification-body p {
            margin: 0 0 8px 0;
            color: #374151;
            font-size: 14px;
        }

        .notification-time {
            font-size: 12px;
            color: #9CA3AF;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        /* Estilos para el dashboard de Crisla */
        .crisla-dashboard {
            background: linear-gradient(135deg, #7C3AED, #EC4899);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
        }

        .crisla-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }

        .stat-number {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 14px;
            opacity: 0.9;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', crislaNotificationStyles);

console.log('✅ Crisla\'s Support Integration cargado');























