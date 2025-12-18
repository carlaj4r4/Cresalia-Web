/**
 * 🔔 Configuración de Notificaciones Push - Panel de Administración
 * 
 * Sistema para que vendedores/emprendedores gestionen sus preferencias
 * de notificaciones push desde el panel de administración
 */

// Configuración por defecto
const PREFERENCIAS_NOTIF_DEFAULT = {
    activas: true,
    tipos: {
        ventas: true,
        mensajes: true,
        turnos: true,
        stock: true,
        pagos: true,
        comentarios: true,
        promociones: false,
        seguidores: true
    }
};

/**
 * Cargar preferencias de notificaciones
 */
function cargarPreferenciasNotif() {
    const preferencias = localStorage.getItem('preferencias_notificaciones_cresalia');
    if (preferencias) {
        return JSON.parse(preferencias);
    }
    return PREFERENCIAS_NOTIF_DEFAULT;
}

/**
 * Guardar preferencias de notificaciones
 */
function guardarPreferenciasNotif() {
    const preferencias = {
        activas: document.getElementById('notificacionesActivasGeneral')?.checked ?? true,
        tipos: {
            ventas: document.getElementById('notifVentas')?.checked ?? true,
            mensajes: document.getElementById('notifMensajes')?.checked ?? true,
            turnos: document.getElementById('notifTurnos')?.checked ?? true,
            stock: document.getElementById('notifStock')?.checked ?? true,
            pagos: document.getElementById('notifPagos')?.checked ?? true,
            comentarios: document.getElementById('notifComentarios')?.checked ?? true,
            promociones: document.getElementById('notifPromociones')?.checked ?? false,
            seguidores: document.getElementById('notifSeguidores')?.checked ?? true
        },
        ultimaActualizacion: new Date().toISOString()
    };
    
    localStorage.setItem('preferencias_notificaciones_cresalia', JSON.stringify(preferencias));
    
    // Actualizar sistema de notificaciones si existe
    if (window.sistemaNotificaciones) {
        window.sistemaNotificaciones.configuracion = preferencias;
        console.log('✅ Preferencias de notificaciones actualizadas');
    }
    
    // Mostrar feedback
    mostrarFeedbackGuardado();
}

/**
 * Activar/desactivar notificaciones generales
 */
function toggleNotificacionesGenerales(activo) {
    if (activo) {
        // Solicitar permisos si no están concedidos
        solicitarPermisosNotificaciones();
    } else {
        // Desactivar todas las notificaciones
        const checkboxes = document.querySelectorAll('#categoriasNotificaciones input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
            cb.disabled = true;
        });
    }
    
    // Actualizar estado visual
    document.getElementById('categoriasNotificaciones').style.opacity = activo ? '1' : '0.5';
    
    guardarPreferenciasNotif();
}

/**
 * Solicitar permisos de notificaciones
 */
async function solicitarPermisosNotificaciones() {
    if (!('Notification' in window)) {
        alert('❌ Tu navegador no soporta notificaciones push.');
        return false;
    }
    
    if (Notification.permission === 'granted') {
        console.log('✅ Permisos ya concedidos');
        actualizarEstadoPermiso('granted');
        habilitarCategoriasNotif();
        return true;
    }
    
    if (Notification.permission === 'denied') {
        alert('❌ Los permisos de notificaciones están bloqueados. \n\nPara habilitarlos:\n1. Click en el ícono de candado en la barra de direcciones\n2. Busca "Notificaciones"\n3. Cambia a "Permitir"');
        actualizarEstadoPermiso('denied');
        return false;
    }
    
    try {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            console.log('✅ Permisos concedidos');
            actualizarEstadoPermiso('granted');
            habilitarCategoriasNotif();
            
            // Mostrar notificación de bienvenida
            new Notification('🎉 ¡Notificaciones Activadas!', {
                body: 'Ya podés recibir notificaciones de tu tienda en tiempo real',
                icon: '/assets/logo/logo-cresalia.png',
                badge: '/assets/logo/logo-cresalia.png'
            });
            
            return true;
        } else {
            console.log('ℹ️ Permisos denegados por el usuario');
            actualizarEstadoPermiso('denied');
            return false;
        }
    } catch (error) {
        console.error('Error solicitando permisos:', error);
        return false;
    }
}

/**
 * Actualizar estado visual del permiso
 */
function actualizarEstadoPermiso(permission) {
    const estadoDiv = document.getElementById('estadoPermisoNotif');
    if (!estadoDiv) return;
    
    if (permission === 'granted') {
        estadoDiv.innerHTML = `
            <div style="background: #ECFDF5; border: 2px solid #10B981; border-radius: 12px; padding: 20px;">
                <i class="fas fa-check-circle" style="color: #10B981; font-size: 32px;"></i>
                <h4 style="margin: 10px 0 5px 0; color: #10B981;">✅ Notificaciones Activadas</h4>
                <p style="margin: 0; color: #6B7280; font-size: 14px;">Ya estás recibiendo notificaciones en tiempo real</p>
            </div>
        `;
    } else if (permission === 'denied') {
        estadoDiv.innerHTML = `
            <div style="background: #FEF2F2; border: 2px solid #EF4444; border-radius: 12px; padding: 20px;">
                <i class="fas fa-times-circle" style="color: #EF4444; font-size: 32px;"></i>
                <h4 style="margin: 10px 0 5px 0; color: #EF4444;">❌ Notificaciones Bloqueadas</h4>
                <p style="margin: 5px 0; color: #6B7280; font-size: 14px;">Los permisos están bloqueados en tu navegador</p>
                <button onclick="mostrarInstruccionesDesbloquear()" style="margin-top: 10px; background: #EF4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    📖 Ver cómo desbloquear
                </button>
            </div>
        `;
    } else {
        estadoDiv.innerHTML = `
            <div style="background: #FEF3C7; border: 2px solid #F59E0B; border-radius: 12px; padding: 20px;">
                <i class="fas fa-bell-slash" style="color: #F59E0B; font-size: 32px;"></i>
                <h4 style="margin: 10px 0 5px 0; color: #F59E0B;">⚠️ Permisos Pendientes</h4>
                <p style="margin: 5px 0; color: #6B7280; font-size: 14px;">Activá las notificaciones para recibir alertas en tiempo real</p>
                <button onclick="solicitarPermisosNotificaciones()" style="margin-top: 10px; background: #F59E0B; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    🔔 Activar Notificaciones
                </button>
            </div>
        `;
    }
}

/**
 * Habilitar checkboxes de categorías
 */
function habilitarCategoriasNotif() {
    const checkboxes = document.querySelectorAll('#categoriasNotificaciones input[type="checkbox"]');
    checkboxes.forEach(cb => cb.disabled = false);
    document.getElementById('categoriasNotificaciones').style.opacity = '1';
}

/**
 * Mostrar instrucciones para desbloquear
 */
function mostrarInstruccionesDesbloquear() {
    const navegador = detectarNavegador();
    let instrucciones = '';
    
    if (navegador === 'chrome') {
        instrucciones = `
            <strong>En Google Chrome:</strong><br>
            1. Click en el ícono de <i class="fas fa-lock"></i> candado (o información) en la barra de direcciones<br>
            2. Busca "Notificaciones"<br>
            3. Selecciona "Permitir"<br>
            4. Recarga la página
        `;
    } else if (navegador === 'firefox') {
        instrucciones = `
            <strong>En Firefox:</strong><br>
            1. Click en el ícono de <i class="fas fa-shield-alt"></i> escudo en la barra de direcciones<br>
            2. Ve a "Permisos"<br>
            3. Activa "Notificaciones"<br>
            4. Recarga la página
        `;
    } else if (navegador === 'safari') {
        instrucciones = `
            <strong>En Safari:</strong><br>
            1. Ve a Safari → Preferencias<br>
            2. Selecciona la pestaña "Sitios web"<br>
            3. Click en "Notificaciones"<br>
            4. Encuentra este sitio y selecciona "Permitir"<br>
            5. Recarga la página
        `;
    } else {
        instrucciones = `
            <strong>Pasos generales:</strong><br>
            1. Busca la configuración de sitio en tu navegador<br>
            2. Encuentra la sección de "Notificaciones"<br>
            3. Permite las notificaciones para este sitio<br>
            4. Recarga la página
        `;
    }
    
    alert(`📖 Cómo desbloquear notificaciones:\n\n${instrucciones.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '')}`);
}

/**
 * Detectar navegador
 */
function detectarNavegador() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome') && !ua.includes('Edge')) return 'chrome';
    if (ua.includes('Firefox')) return 'firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari';
    if (ua.includes('Edge')) return 'edge';
    return 'otro';
}

/**
 * Probar notificación
 */
async function probarNotificacionPush() {
    // Verificar permisos
    if (Notification.permission !== 'granted') {
        const concedido = await solicitarPermisosNotificaciones();
        if (!concedido) return;
    }
    
    // Enviar notificación de prueba
    try {
        const notification = new Notification('🧪 Notificación de Prueba', {
            body: '¡Funciona correctamente! Ya estás recibiendo notificaciones de tu tienda.',
            icon: '/assets/logo/logo-cresalia.png',
            badge: '/assets/logo/logo-cresalia.png',
            tag: 'prueba',
            requireInteraction: false,
            vibrate: [200, 100, 200],
            data: {
                url: window.location.href,
                tipo: 'prueba'
            }
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        console.log('✅ Notificación de prueba enviada');
        
        // Mostrar feedback
        setTimeout(() => {
            alert('✅ ¡Notificación enviada!\n\nSi la viste, significa que todo funciona correctamente.');
        }, 500);
        
    } catch (error) {
        console.error('Error enviando notificación de prueba:', error);
        alert('❌ Error enviando notificación de prueba.\n\nVerifica que los permisos estén activados.');
    }
}

/**
 * Inicializar tab de notificaciones
 */
function inicializarTabNotificaciones() {
    // Verificar estado actual del permiso
    if ('Notification' in window) {
        actualizarEstadoPermiso(Notification.permission);
    }
    
    // Cargar preferencias guardadas
    const preferencias = cargarPreferenciasNotif();
    
    // Actualizar checkboxes
    if (document.getElementById('notificacionesActivasGeneral')) {
        document.getElementById('notificacionesActivasGeneral').checked = preferencias.activas;
    }
    
    if (document.getElementById('notifVentas')) {
        document.getElementById('notifVentas').checked = preferencias.tipos.ventas;
    }
    if (document.getElementById('notifMensajes')) {
        document.getElementById('notifMensajes').checked = preferencias.tipos.mensajes;
    }
    if (document.getElementById('notifTurnos')) {
        document.getElementById('notifTurnos').checked = preferencias.tipos.turnos;
    }
    if (document.getElementById('notifStock')) {
        document.getElementById('notifStock').checked = preferencias.tipos.stock;
    }
    if (document.getElementById('notifPagos')) {
        document.getElementById('notifPagos').checked = preferencias.tipos.pagos;
    }
    if (document.getElementById('notifComentarios')) {
        document.getElementById('notifComentarios').checked = preferencias.tipos.comentarios;
    }
    if (document.getElementById('notifPromociones')) {
        document.getElementById('notifPromociones').checked = preferencias.tipos.promociones;
    }
    if (document.getElementById('notifSeguidores')) {
        document.getElementById('notifSeguidores').checked = preferencias.tipos.seguidores;
    }
    
    // Habilitar/deshabilitar categorías según estado general
    if (!preferencias.activas) {
        const checkboxes = document.querySelectorAll('#categoriasNotificaciones input[type="checkbox"]');
        checkboxes.forEach(cb => cb.disabled = true);
        document.getElementById('categoriasNotificaciones').style.opacity = '0.5';
    }
}

/**
 * Mostrar feedback de guardado
 */
function mostrarFeedbackGuardado() {
    // Crear elemento de feedback temporal
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    feedback.innerHTML = `
        <i class="fas fa-check-circle"></i> Preferencias guardadas
    `;
    
    document.body.appendChild(feedback);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        feedback.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

/**
 * Verificar si una notificación debe enviarse según preferencias
 */
function debeEnviarNotificacion(tipo) {
    const preferencias = cargarPreferenciasNotif();
    
    if (!preferencias.activas) {
        return false;
    }
    
    return preferencias.tipos[tipo] ?? false;
}

/**
 * Enviar notificación si está habilitada
 */
function enviarNotificacionSiHabilitada(tipo, titulo, opciones) {
    if (!debeEnviarNotificacion(tipo)) {
        console.log(`🔕 Notificación de tipo "${tipo}" deshabilitada por el usuario`);
        return false;
    }
    
    if (Notification.permission !== 'granted') {
        console.warn('⚠️ Permisos de notificación no concedidos');
        return false;
    }
    
    try {
        const notification = new Notification(titulo, {
            icon: '/assets/logo/logo-cresalia.png',
            badge: '/assets/logo/logo-cresalia.png',
            ...opciones
        });
        
        console.log(`✅ Notificación de tipo "${tipo}" enviada`);
        return true;
    } catch (error) {
        console.error('Error enviando notificación:', error);
        return false;
    }
}

// CSS para las animaciones
const styles = document.createElement('style');
styles.textContent = `
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
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styles);

// Hacer funciones disponibles globalmente
window.cargarPreferenciasNotif = cargarPreferenciasNotif;
window.guardarPreferenciasNotif = guardarPreferenciasNotif;
window.toggleNotificacionesGenerales = toggleNotificacionesGenerales;
window.solicitarPermisosNotificaciones = solicitarPermisosNotificaciones;
window.actualizarEstadoPermiso = actualizarEstadoPermiso;
window.probarNotificacionPush = probarNotificacionPush;
window.inicializarTabNotificaciones = inicializarTabNotificaciones;
window.debeEnviarNotificacion = debeEnviarNotificacion;
window.enviarNotificacionSiHabilitada = enviarNotificacionSiHabilitada;

console.log('🔔 Sistema de configuración de notificaciones cargado');
