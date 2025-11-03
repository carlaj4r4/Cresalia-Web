// ===== SISTEMA DE NOTIFICACIONES ELEGANTE =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: 2025

class ElegantNotifications {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.init();
    }

    init() {
        // Crear contenedor si no existe
        if (!document.querySelector('.notifications-container')) {
            this.container = document.createElement('div');
            this.container.className = 'notifications-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.notifications-container');
        }
    }

    // Mostrar notificación
    show(message, type = 'info', title = null, duration = 5000) {
        const id = Date.now() + Math.random();
        const notification = this.createNotification(id, message, type, title, duration);
        
        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        // Trigger reflow para animación
        notification.offsetHeight;
        notification.classList.add('show');

        // Auto-remover después de la duración
        if (duration > 0) {
            setTimeout(() => {
                this.hide(id);
            }, duration);
        }

        return id;
    }

    // Crear elemento de notificación
    createNotification(id, message, type, title, duration) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.dataset.id = id;

        const icon = this.getIcon(type);
        const titleText = title || this.getDefaultTitle(type);

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="notification-text">
                    <div class="notification-title">${titleText}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close" onclick="elegantNotifications.hide('${id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        return notification;
    }

    // Ocultar notificación
    hide(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(id);
        }, 400); // Tiempo de la animación
    }

    // Ocultar todas las notificaciones
    hideAll() {
        this.notifications.forEach((notification, id) => {
            this.hide(id);
        });
    }

    // Obtener icono según el tipo
    getIcon(type) {
        const icons = {
            success: 'fas fa-check',
            error: 'fas fa-exclamation-triangle',
            warning: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Obtener título por defecto según el tipo
    getDefaultTitle(type) {
        const titles = {
            success: 'Éxito',
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };
        return titles[type] || titles.info;
    }

    // Métodos de conveniencia
    success(message, title = null, duration = 5000) {
        return this.show(message, 'success', title, duration);
    }

    error(message, title = null, duration = 7000) {
        return this.show(message, 'error', title, duration);
    }

    warning(message, title = null, duration = 6000) {
        return this.show(message, 'warning', title, duration);
    }

    info(message, title = null, duration = 5000) {
        return this.show(message, 'info', title, duration);
    }

    // Notificación de carga
    loading(message = 'Cargando...', title = 'Procesando') {
        const id = Date.now() + Math.random();
        const notification = document.createElement('div');
        notification.className = 'notification info loading';
        notification.dataset.id = id;

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close" onclick="elegantNotifications.hide('${id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        // Trigger reflow para animación
        notification.offsetHeight;
        notification.classList.add('show');

        return id;
    }

    // Notificación de progreso
    progress(message, progress = 0, title = 'Progreso') {
        const id = Date.now() + Math.random();
        const notification = document.createElement('div');
        notification.className = 'notification info progress';
        notification.dataset.id = id;

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-tasks"></i>
                </div>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                    <div class="progress-bar" style="width: ${progress}%; background: var(--notification-color, #3B82F6); height: 2px; border-radius: 1px; margin-top: 8px; transition: width 0.3s ease;"></div>
                </div>
                <button class="notification-close" onclick="elegantNotifications.hide('${id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        // Trigger reflow para animación
        notification.offsetHeight;
        notification.classList.add('show');

        return id;
    }

    // Actualizar progreso
    updateProgress(id, progress, message = null) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        const progressBar = notification.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }

        if (message) {
            const messageEl = notification.querySelector('.notification-message');
            if (messageEl) {
                messageEl.textContent = message;
            }
        }
    }
}

// Instancia global
const elegantNotifications = new ElegantNotifications();

// Función global para compatibilidad
function mostrarNotificacion(message, type = 'info', title = null, duration = 5000) {
    return elegantNotifications.show(message, type, title, duration);
}

// Función global para notificaciones de éxito
function mostrarExito(message, title = null) {
    return elegantNotifications.success(message, title);
}

// Función global para notificaciones de error
function mostrarError(message, title = null) {
    return elegantNotifications.error(message, title);
}

// Función global para notificaciones de advertencia
function mostrarAdvertencia(message, title = null) {
    return elegantNotifications.warning(message, title);
}

// Función global para notificaciones de información
function mostrarInfo(message, title = null) {
    return elegantNotifications.info(message, title);
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ElegantNotifications;
}























