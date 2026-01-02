// ===== SISTEMA DE NOTIFICACIONES PUSH CRESALIA =====
// Sistema avanzado de notificaciones en tiempo real con Push API

class SistemaNotificacionesPush {
    constructor() {
        this.notificaciones = [];
        this.suscritos = [];
        this.configuracion = this.cargarConfiguracion();
        this.serviceWorkerRegistration = null;
        this.vapidPublicKey = null;
        this.isMobile = /Mobi|Android/i.test(navigator.userAgent || '');
        this.inicializar();
    }

    // Inicializar el sistema
    async inicializar() {
        console.log('🔔 Inicializando Sistema de Notificaciones Push...');
        
        // Verificar soporte del navegador
        if (!('Notification' in window)) {
            console.warn('⚠️ Este navegador no soporta notificaciones');
            return;
        }

        // En móvil, evitar pedir permisos automáticamente para no mostrar errores/diálogos molestos
        if (this.isMobile && Notification.permission === 'default') {
            console.log('ℹ️ Móvil detectado: no se solicitarán notificaciones automáticamente');
            return;
        }

        // Verificar si el permiso ya fue denegado anteriormente (evitar errores en móviles)
        const permisoAnterior = localStorage.getItem('cresalia_notificaciones_permiso');
        if (permisoAnterior === 'denied' && Notification.permission === 'denied') {
            console.log('ℹ️ Permiso de notificaciones denegado anteriormente, no se intentará solicitar de nuevo');
            return;
        }

        // Cargar VAPID public key
        this.vapidPublicKey = window.__VAPID_PUBLIC_KEY__ || null;
        if (!this.vapidPublicKey) {
            console.warn('⚠️ VAPID_PUBLIC_KEY no configurada. Las notificaciones push no funcionarán cuando la página esté cerrada.');
        }

        // Solicitar permisos (solo si no están denegados)
        try {
            await this.solicitarPermisos();
        } catch (error) {
            console.warn('⚠️ Error al solicitar permisos de notificación (puede ser normal en algunos móviles):', error);
            // No detener la inicialización si falla la solicitud de permisos
        }
        
        // Configurar Service Worker
        try {
            await this.configurarServiceWorker();
        } catch (error) {
            console.warn('⚠️ Error configurando Service Worker:', error);
        }
        
        // Crear suscripción push (si es posible)
        if (this.serviceWorkerRegistration) {
            try {
                await this.crearSuscripcionPush();
            } catch (error) {
                console.warn('⚠️ Error creando suscripción push:', error);
            }
        }
        
        // Inicializar notificaciones en tiempo real
        this.inicializarTiempoReal();
        
        console.log('✅ Sistema de Notificaciones Push inicializado');
    }

    // Solicitar permisos de notificación (solo una vez, centralizado)
    async solicitarPermisos() {
        // En móvil, no solicitar automáticamente (se hace bajo acción del usuario)
        if (this.isMobile && Notification.permission === 'default') {
            console.log('ℹ️ Móvil detectado: se omite solicitud automática de permisos de notificación');
            return;
        }

        // Verificar si el permiso ya está concedido o denegado (persiste entre sesiones)
        if (Notification.permission !== 'default') {
            console.log(`ℹ️ Permiso de notificaciones: ${Notification.permission}`);
            // Si ya está concedido, no hacer nada más
            if (Notification.permission === 'granted') {
                return;
            }
            // Si está denegado, guardar en localStorage para no volver a intentar
            if (Notification.permission === 'denied') {
                localStorage.setItem('cresalia_notificaciones_permiso', 'denied');
                return;
            }
        }

        // Verificar si ya se solicitó anteriormente y fue denegado
        const permisoAnterior = localStorage.getItem('cresalia_notificaciones_permiso');
        if (permisoAnterior === 'denied') {
            console.log('ℹ️ Usuario denegó permiso de notificaciones anteriormente');
            return;
        }

        // Verificar si ya se solicitó en esta sesión (evitar múltiples solicitudes simultáneas)
        const yaSolicitado = sessionStorage.getItem('notificaciones_permiso_solicitado');
        if (yaSolicitado === 'true') {
            console.log('ℹ️ Permisos de notificación ya fueron solicitados en esta sesión');
            return;
        }

        // Marcar como solicitado antes de pedir (para evitar múltiples solicitudes)
        sessionStorage.setItem('notificaciones_permiso_solicitado', 'true');

        // Esperar un poco antes de solicitar (mejor UX)
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const permission = await Notification.requestPermission();
            
            // Guardar el resultado en localStorage para persistir entre sesiones
            localStorage.setItem('cresalia_notificaciones_permiso', permission);
            
            if (permission === 'granted') {
                console.log('✅ Permisos de notificación concedidos');
                this.mostrarNotificacionBienvenida();
            } else {
                console.log(`ℹ️ Permiso de notificaciones: ${permission}`);
            }
        } catch (error) {
            console.warn('⚠️ Error al solicitar permisos de notificación:', error);
            // En móviles, algunos navegadores pueden lanzar errores
            // Guardar como denegado para no volver a intentar
            if (error.name === 'NotAllowedError' || error.name === 'TypeError') {
                localStorage.setItem('cresalia_notificaciones_permiso', 'denied');
            }
        }
    }

    // Configurar Service Worker
    async configurarServiceWorker() {
        // Solo registrar Service Worker si estamos en un servidor (no en file://)
        if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                this.serviceWorkerRegistration = registration;
                console.log('✅ Service Worker registrado');
            } catch (error) {
                console.warn('⚠️ Service Worker no disponible:', error.message);
            }
        } else {
            console.log('ℹ️ Service Worker no disponible en desarrollo local');
        }
    }

    // Crear suscripción push usando Push API
    async crearSuscripcionPush() {
        if (!this.serviceWorkerRegistration) {
            console.warn('⚠️ Service Worker no registrado, no se puede crear suscripción push');
            return;
        }

        if (!this.vapidPublicKey) {
            console.warn('⚠️ VAPID_PUBLIC_KEY no configurada, no se puede crear suscripción push');
            return;
        }

        if (Notification.permission !== 'granted') {
            console.log('ℹ️ Permisos de notificación no concedidos aún');
            return;
        }

        try {
            // Convertir VAPID key de base64 a Uint8Array
            const applicationServerKey = this.urlBase64ToUint8Array(this.vapidPublicKey);

            // Crear suscripción
            const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            });

            console.log('✅ Push subscription creada exitosamente');

            // Guardar suscripción en Supabase
            await this.guardarSuscripcionEnSupabase(subscription);

            return subscription;
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                console.warn('⚠️ Permisos de push denegados por el usuario');
            } else {
                console.error('❌ Error creando push subscription:', error);
            }
            return null;
        }
    }

    // Convertir VAPID key de base64 URL-safe a Uint8Array
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Guardar suscripción en Supabase
    async guardarSuscripcionEnSupabase(subscription) {
        try {
            const supabase = await this.obtenerSupabase();
            if (!supabase) {
                console.warn('⚠️ Supabase no disponible, no se guardó la suscripción');
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.warn('⚠️ Usuario no autenticado, no se guardó la suscripción');
                return;
            }

            // Extraer datos de la suscripción
            const subscriptionData = {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')),
                    auth: this.arrayBufferToBase64(subscription.getKey('auth'))
                }
            };

            // Detectar dispositivo y navegador
            const userAgent = navigator.userAgent;
            const dispositivo = this.detectarDispositivo(userAgent);
            const navegador = this.detectarNavegador(userAgent);

            // Insertar o actualizar suscripción
            const { data, error } = await supabase
                .from('push_subscriptions')
                .upsert({
                    user_id: user.id,
                    endpoint: subscriptionData.endpoint,
                    p256dh: subscriptionData.keys.p256dh,
                    auth: subscriptionData.keys.auth,
                    user_agent: userAgent,
                    dispositivo: dispositivo,
                    navegador: navegador,
                    activo: true,
                    fecha_ultimo_uso: new Date().toISOString()
                }, {
                    onConflict: 'user_id,endpoint'
                });

            if (error) {
                console.error('❌ Error guardando suscripción en Supabase:', error);
            } else {
                console.log('✅ Suscripción guardada en Supabase');
            }
        } catch (error) {
            console.error('❌ Error en guardarSuscripcionEnSupabase:', error);
        }
    }

    // Convertir ArrayBuffer a Base64
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        bytes.forEach((byte) => {
            binary += String.fromCharCode(byte);
        });
        return window.btoa(binary);
    }

    // Detectar tipo de dispositivo
    detectarDispositivo(userAgent) {
        if (/mobile|android|iphone|ipad/i.test(userAgent)) {
            return 'mobile';
        } else if (/tablet|ipad/i.test(userAgent)) {
            return 'tablet';
        }
        return 'desktop';
    }

    // Detectar navegador
    detectarNavegador(userAgent) {
        if (userAgent.includes('Chrome')) return 'chrome';
        if (userAgent.includes('Firefox')) return 'firefox';
        if (userAgent.includes('Safari')) return 'safari';
        if (userAgent.includes('Edge')) return 'edge';
        return 'other';
    }

    // Obtener cliente Supabase
    async obtenerSupabase() {
        if (typeof window.initSupabase === 'function') {
            return await window.initSupabase();
        }
        if (typeof window.supabase !== 'undefined') {
            return window.supabase;
        }
        return null;
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
        }, 1800000); // Cada 30 minutos

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

    // Enviar notificación (usando Notification API cuando la página está abierta)
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
                requireInteraction: false,
                silent: true,
                badge: '/favicon.ico'
            });

            // Manejar clic en notificación
            notificacion.onclick = function() {
                window.focus();
                notificacion.close();
            };

            // Auto-cerrar después de 3 segundos
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
            sonido: false,
            vibrar: false,
            tipos: {
                turnos: true,
                pagos: false,
                ofertas: false,
                general: false
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
    if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('✅ Configuración de notificaciones guardada', 'success');
    }
};

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
