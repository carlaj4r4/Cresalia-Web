// ===== SISTEMA DE NOTIFICACIONES PUSH CRESALIA =====
// Sistema avanzado de notificaciones en tiempo real

class SistemaNotificacionesPush {
    constructor() {
        this.notificaciones = [];
        this.suscritos = [];
        this.configuracion = this.cargarConfiguracion();
        this.inicializar();
    }

    // Inicializar el sistema
    inicializar() {
        console.log('🔔 Inicializando Sistema de Notificaciones Push...');
        
        // Verificar soporte del navegador
        if (!('Notification' in window)) {
            console.warn('⚠️ Este navegador no soporta notificaciones');
            return;
        }

        // Solicitar permisos
        this.solicitarPermisos();
        
        // Configurar Service Worker
        this.configurarServiceWorker();
        
        // Inicializar notificaciones en tiempo real
        this.inicializarTiempoReal();
        
        console.log('✅ Sistema de Notificaciones Push inicializado');
    }

    // Solicitar permisos de notificación
    async solicitarPermisos() {
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('✅ Permisos de notificación concedidos');
                this.mostrarNotificacionBienvenida();
            }
        }
    }

    // Configurar Service Worker
    configurarServiceWorker() {
        // Solo registrar Service Worker si estamos en un servidor (no en file://)
        if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registrado');
                })
                .catch(error => {
                    console.warn('⚠️ Service Worker no disponible en desarrollo local:', error.message);
                });
        } else {
            console.log('ℹ️ Service Worker no disponible en desarrollo local');
        }
    }

    // Inicializar notificaciones en tiempo real
    inicializarTiempoReal() {
        // Verificar si el usuario ha deshabilitado las notificaciones
        if (!this.configuracion.activas) {
            console.log('🔕 Notificaciones deshabilitadas por el usuario');
            return;
        }

        // Simular notificaciones automáticas - MUY POCO FRECUENTES
        setInterval(() => {
            this.verificarNotificacionesAutomaticas();
        }, 1800000); // Cada 30 minutos (antes era 5 minutos)

        // Notificaciones de turnos - Solo si están habilitadas
        if (this.configuracion.tipos.turnos) {
            this.configurarNotificacionesTurnos();
        }
        
        // Notificaciones de pagos - Solo si están habilitadas
        if (this.configuracion.tipos.pagos) {
            this.configurarNotificacionesPagos();
        }
        
        // Notificaciones de ofertas - Solo si están habilitadas
        if (this.configuracion.tipos.ofertas) {
            this.configurarNotificacionesOfertas();
        }
    }

    // Verificar notificaciones automáticas
    verificarNotificacionesAutomaticas() {
        const ahora = new Date();
        
        // Verificar turnos próximos
        this.verificarTurnosProximos();
        
        // Verificar pagos pendientes
        this.verificarPagosPendientes();
        
        // Verificar ofertas especiales
        this.verificarOfertasEspeciales();
    }

    // Configurar notificaciones de turnos
    configurarNotificacionesTurnos() {
        const turnos = JSON.parse(localStorage.getItem('turnosProgramados') || '[]');
        const ahora = new Date();
        
        turnos.forEach(turno => {
            const fechaTurno = new Date(turno.fecha + 'T' + turno.hora);
            const tiempoRestante = fechaTurno.getTime() - ahora.getTime();
            
            // Notificar 1 hora antes
            if (tiempoRestante > 0 && tiempoRestante <= 3600000 && tiempoRestante > 3300000) {
                this.enviarNotificacion({
                    titulo: '📅 Turno Próximo',
                    mensaje: `Tu turno con ${turno.cliente} es en 1 hora`,
                    icono: '/favicon.ico',
                    tag: 'turno-proximo'
                });
            }
        });
    }

    // Configurar notificaciones de pagos
    configurarNotificacionesPagos() {
        const ventasPendientes = JSON.parse(localStorage.getItem('ventasPendientes') || '[]');
        
        if (ventasPendientes.length > 0) {
            this.enviarNotificacion({
                titulo: '💳 Pago Pendiente',
                mensaje: `Tienes ${ventasPendientes.length} pagos pendientes de confirmar`,
                icono: '/favicon.ico',
                tag: 'pago-pendiente'
            });
        }
    }

    // Configurar notificaciones de ofertas
    configurarNotificacionesOfertas() {
        const ofertas = JSON.parse(localStorage.getItem('ofertasActivas') || '[]');
        
        if (ofertas.length > 0) {
            this.enviarNotificacion({
                titulo: '🎉 Ofertas Activas',
                mensaje: `Tienes ${ofertas.length} ofertas activas`,
                icono: '/favicon.ico',
                tag: 'ofertas-activas'
            });
        }
    }

    // Enviar notificación
    enviarNotificacion(opciones) {
        // Verificar si el usuario ha deshabilitado las notificaciones
        if (!this.configuracion.activas) {
            console.log('🔕 Notificación bloqueada - usuario deshabilitó notificaciones');
            return;
        }

        if (Notification.permission === 'granted') {
            const notificacion = new Notification(opciones.titulo, {
                body: opciones.mensaje,
                icon: opciones.icono || '/favicon.ico',
                tag: opciones.tag || 'cresalia',
                requireInteraction: false, // NUNCA forzar interacción
                silent: true, // SIEMPRE silenciosas
                badge: '/favicon.ico'
            });

            // Manejar clic en notificación
            notificacion.onclick = function() {
                window.focus();
                notificacion.close();
            };

            // Auto-cerrar después de 3 segundos (más rápido)
            setTimeout(() => {
                notificacion.close();
            }, 3000);

            // Guardar en historial
            this.guardarNotificacion(opciones);
        }
    }

    // Guardar notificación en historial
    guardarNotificacion(opciones) {
        const notificacion = {
            id: Date.now(),
            titulo: opciones.titulo,
            mensaje: opciones.mensaje,
            fecha: new Date().toISOString(),
            leida: false,
            tipo: opciones.tipo || 'general'
        };

        this.notificaciones.push(notificacion);
        localStorage.setItem('notificacionesCresalia', JSON.stringify(this.notificaciones));
    }

    // Mostrar notificación de bienvenida
    mostrarNotificacionBienvenida() {
        // Solo mostrar bienvenida si el usuario no ha deshabilitado las notificaciones
        if (this.configuracion.activas && this.configuracion.tipos.general) {
            this.enviarNotificacion({
                titulo: '🎉 ¡Bienvenido a Cresalia!',
                mensaje: 'Las notificaciones están activadas. ¡Te mantendremos informado!',
                icono: '/favicon.ico',
                tag: 'bienvenida'
            });
        }
    }

    // Verificar turnos próximos
    verificarTurnosProximos() {
        const turnos = JSON.parse(localStorage.getItem('turnosProgramados') || '[]');
        const ahora = new Date();
        
        turnos.forEach(turno => {
            const fechaTurno = new Date(turno.fecha + 'T' + turno.hora);
            const tiempoRestante = fechaTurno.getTime() - ahora.getTime();
            
            // Notificar 30 minutos antes
            if (tiempoRestante > 0 && tiempoRestante <= 1800000 && tiempoRestante > 1500000) {
                this.enviarNotificacion({
                    titulo: '⏰ Turno en 30 minutos',
                    mensaje: `Tu turno con ${turno.cliente} es en 30 minutos`,
                    icono: '/favicon.ico',
                    tag: 'turno-30min'
                });
            }
        });
    }

    // Verificar pagos pendientes
    verificarPagosPendientes() {
        const ventasPendientes = JSON.parse(localStorage.getItem('ventasPendientes') || '[]');
        
        if (ventasPendientes.length > 0) {
            this.enviarNotificacion({
                titulo: '💰 Recordatorio de Pagos',
                mensaje: `Tienes ${ventasPendientes.length} pagos pendientes`,
                icono: '/favicon.ico',
                tag: 'recordatorio-pagos'
            });
        }
    }

    // Verificar ofertas especiales
    verificarOfertasEspeciales() {
        const ofertas = JSON.parse(localStorage.getItem('ofertasActivas') || '[]');
        
        if (ofertas.length > 0) {
            this.enviarNotificacion({
                titulo: '🔥 Ofertas Especiales',
                mensaje: `Tienes ${ofertas.length} ofertas activas`,
                icono: '/favicon.ico',
                tag: 'ofertas-especiales'
            });
        }
    }

    // Cargar configuración
    cargarConfiguracion() {
        return JSON.parse(localStorage.getItem('configuracionNotificaciones') || JSON.stringify({
            activas: true,
            sonido: false, // Por defecto sin sonido
            vibrar: false, // Por defecto sin vibración
            tipos: {
                turnos: true,
                pagos: false, // Por defecto menos notificaciones
                ofertas: false, // Por defecto menos notificaciones
                general: false // Por defecto menos notificaciones
            }
        }));
    }

    // Guardar configuración
    guardarConfiguracion() {
        localStorage.setItem('configuracionNotificaciones', JSON.stringify(this.configuracion));
    }

    // Obtener historial de notificaciones
    obtenerHistorial() {
        return JSON.parse(localStorage.getItem('notificacionesCresalia') || '[]');
    }

    // Marcar como leída
    marcarComoLeida(id) {
        const notificacion = this.notificaciones.find(n => n.id === id);
        if (notificacion) {
            notificacion.leida = true;
            this.guardarNotificacion(notificacion);
        }
    }

    // Limpiar notificaciones antiguas
    limpiarAntiguas() {
        const hace7Dias = new Date();
        hace7Dias.setDate(hace7Dias.getDate() - 7);
        
        this.notificaciones = this.notificaciones.filter(n => 
            new Date(n.fecha) > hace7Dias
        );
        
        localStorage.setItem('notificacionesCresalia', JSON.stringify(this.notificaciones));
    }
}

// Inicializar sistema globalmente
window.sistemaNotificaciones = new SistemaNotificacionesPush();

// Funciones globales para uso en otros archivos
window.enviarNotificacionPush = function(opciones) {
    window.sistemaNotificaciones.enviarNotificacion(opciones);
};

window.configurarNotificaciones = function() {
    // Abrir modal de configuración
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0,0,0,0.8) !important;
        z-index: 999999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%;">
            <h3 style="color: #667eea; margin-bottom: 20px;">🔔 Configurar Notificaciones</h3>
            
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="notificacionesActivas" ${window.sistemaNotificaciones.configuracion.activas ? 'checked' : ''} style="margin-right: 10px;">
                    Activar notificaciones
                </label>
            </div>
            
            <div style="margin-bottom: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <h5 style="margin: 0 0 10px 0; color: #1f2937;">💡 Configuración Recomendada</h5>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Para una experiencia menos molesta, recomendamos mantener solo las notificaciones de turnos activas.</p>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="notificacionesSonido" ${window.sistemaNotificaciones.configuracion.sonido ? 'checked' : ''} style="margin-right: 10px;">
                    Sonido en notificaciones
                </label>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="notificacionesVibrar" ${window.sistemaNotificaciones.configuracion.vibrar ? 'checked' : ''} style="margin-right: 10px;">
                    Vibrar en notificaciones
                </label>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: space-between; margin-top: 20px;">
                <div style="display: flex; gap: 10px;">
                    <button onclick="deshabilitarNotificaciones(); cerrarModal(this)" style="background: #dc2626; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                        🔕 Deshabilitar
                    </button>
                    <button onclick="habilitarNotificaciones(); cerrarModal(this)" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                        🔔 Habilitar
                    </button>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="cerrarModal(this)" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                        Cancelar
                    </button>
                    <button onclick="guardarConfiguracionNotificaciones()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

window.guardarConfiguracionNotificaciones = function() {
    const config = {
        activas: document.getElementById('notificacionesActivas').checked,
        sonido: document.getElementById('notificacionesSonido').checked,
        vibrar: document.getElementById('notificacionesVibrar').checked,
        tipos: window.sistemaNotificaciones.configuracion.tipos
    };
    
    window.sistemaNotificaciones.configuracion = config;
    window.sistemaNotificaciones.guardarConfiguracion();
    
    cerrarModal(document.querySelector('#notificacionesActivas').closest('.modal'));
    mostrarNotificacion('✅ Configuración de notificaciones guardada', 'success');
};

// Función para deshabilitar completamente las notificaciones
window.deshabilitarNotificaciones = function() {
    window.sistemaNotificaciones.configuracion.activas = false;
    window.sistemaNotificaciones.guardarConfiguracion();
    
    if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('🔕 Notificaciones deshabilitadas', 'info');
    } else {
        alert('🔕 Notificaciones deshabilitadas');
    }
    
    console.log('🔕 Usuario deshabilitó las notificaciones');
};

// Función para habilitar notificaciones
window.habilitarNotificaciones = function() {
    window.sistemaNotificaciones.configuracion.activas = true;
    window.sistemaNotificaciones.guardarConfiguracion();
    
    if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('🔔 Notificaciones habilitadas', 'success');
    } else {
        alert('🔔 Notificaciones habilitadas');
    }
    
    console.log('🔔 Usuario habilitó las notificaciones');
};

console.log('✅ Sistema de Notificaciones Push cargado correctamente');
