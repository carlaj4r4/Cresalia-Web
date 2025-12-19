/**
 * 📧 SISTEMA DE MENSAJES GLOBALES - CRESALIA
 * 
 * Sistema completo para que la administradora pueda enviar mensajes a TODOS los usuarios:
 * - Alertas de emergencia
 * - Mensajes de agradecimiento
 * - Anuncios importantes
 * - Mantenimientos programados
 * - Promociones especiales
 */

class SistemaMensajesGlobales {
    constructor() {
        this.mensajesActivos = [];
        this.mensajesMostrados = new Set();
        this.checkInterval = null;
        this.inicializar();
    }
    
    async inicializar() {
        console.log('📧 Inicializando Sistema de Mensajes Globales...');
        
        // Esperar a que initSupabase esté disponible
        await this.esperarInitSupabase();
        
        // Cargar mensajes inmediatamente
        await this.cargarMensajes();
        
        // Verificar nuevos mensajes cada 30 segundos
        this.checkInterval = setInterval(() => {
            this.cargarMensajes();
        }, 30000);
        
        console.log('✅ Sistema de Mensajes Globales inicializado');
    }
    
    /**
     * Esperar a que initSupabase esté disponible
     */
    async esperarInitSupabase(maxIntentos = 10, intento = 0) {
        if (typeof initSupabase !== 'undefined' && typeof initSupabase === 'function') {
            return true;
        } else if (intento < maxIntentos) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return this.esperarInitSupabase(maxIntentos, intento + 1);
        } else {
            console.warn('⚠️ initSupabase no está disponible después de varios intentos');
            return false;
        }
    }
    
    /**
     * Cargar mensajes activos desde Supabase
     */
    async cargarMensajes() {
        try {
            // Verificar que initSupabase esté disponible
            if (typeof initSupabase === 'undefined' || typeof initSupabase !== 'function') {
                console.log('ℹ️ Supabase aún no está disponible, reintentando...');
                setTimeout(() => this.cargarMensajes(), 1000);
                return;
            }
            
            // Obtener cliente Supabase
            const supabase = initSupabase();
            
            if (!supabase || typeof supabase.rpc !== 'function') {
                console.log('ℹ️ Supabase no configurado para mensajes o rpc no disponible');
                return;
            }
            
            const tipoUsuario = this.obtenerTipoUsuario();
            
            // Obtener mensajes activos
            const { data, error } = await supabase.rpc('obtener_mensajes_activos', {
                p_tipo_usuario: tipoUsuario
            });
            
            if (error) {
                console.warn('⚠️ Error cargando mensajes:', error);
                return;
            }
            
            if (data && data.length > 0) {
                console.log(`📧 ${data.length} mensajes activos cargados`);
                this.procesarMensajes(data);
            } else {
                console.log('ℹ️ No hay mensajes activos');
            }
            
        } catch (error) {
            console.error('❌ Error en cargarMensajes:', error);
        }
    }
    
    /**
     * Procesar y mostrar mensajes
     */
    procesarMensajes(mensajes) {
        mensajes.forEach(mensaje => {
            // Verificar si ya se mostró este mensaje
            const yaVisto = localStorage.getItem(`mensaje_visto_${mensaje.id}`);
            
            if (!yaVisto && !this.mensajesMostrados.has(mensaje.id)) {
                this.mostrarMensaje(mensaje);
                this.mensajesMostrados.add(mensaje.id);
                
                // Marcar como visto localmente
                localStorage.setItem(`mensaje_visto_${mensaje.id}`, new Date().toISOString());
                
                // Marcar como leído en Supabase (opcional, para estadísticas)
                this.marcarComoLeido(mensaje.id);
            }
        });
    }
    
    /**
     * Mostrar mensaje usando el sistema de notificaciones elegante
     */
    mostrarMensaje(mensaje) {
        console.log(`📧 Mostrando mensaje: ${mensaje.titulo}`);
        
        // Determinar duración
        let duracion = 8000; // 8 segundos por defecto
        
        if (mensaje.prioridad === 'critica') {
            duracion = 0; // No se cierra automáticamente
        } else if (mensaje.prioridad === 'alta') {
            duracion = 15000; // 15 segundos
        } else if (mensaje.persistente) {
            duracion = 0; // No se cierra automáticamente
        }
        
        // Agregar icono al mensaje si existe
        const mensajeConIcono = mensaje.icono 
            ? `${mensaje.icono} ${mensaje.mensaje}`
            : mensaje.mensaje;
        
        // Agregar botón de acción si existe
        let mensajeFinal = mensajeConIcono;
        if (mensaje.url_accion && mensaje.boton_texto) {
            mensajeFinal += `<br><br><a href="${mensaje.url_accion}" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">${mensaje.boton_texto}</a>`;
        }
        
        // Mostrar usando elegant-notifications si está disponible
        if (typeof elegantNotifications !== 'undefined') {
            elegantNotifications.show(
                mensajeFinal,
                mensaje.estilo || 'info',
                mensaje.titulo,
                duracion
            );
        } else {
            // Fallback: alert simple
            alert(`${mensaje.titulo}\n\n${mensaje.mensaje}`);
        }
        
        // Reproducir sonido si está configurado (solo para emergencias)
        if (mensaje.sonido && mensaje.tipo === 'emergencia') {
            this.reproducirSonidoAlerta();
        }
    }
    
    /**
     * Marcar mensaje como leído en Supabase
     */
    async marcarComoLeido(mensajeId) {
        try {
            // Verificar que initSupabase esté disponible
            if (typeof initSupabase === 'undefined' || typeof initSupabase !== 'function') {
                return; // Silenciosamente fallar si no está disponible
            }
            
            const supabase = initSupabase();
            if (!supabase || typeof supabase.rpc !== 'function') {
                return;
            }
            
            const dispositivo = this.detectarDispositivo();
            
            const { data, error } = await supabase.rpc('marcar_mensaje_leido', {
                p_mensaje_id: mensajeId,
                p_dispositivo: dispositivo
            });
            
            if (error) {
                console.warn('⚠️ Error marcando mensaje como leído:', error);
            } else {
                console.log(`✅ Mensaje ${mensajeId} marcado como leído`);
            }
        } catch (error) {
            console.error('❌ Error en marcarComoLeido:', error);
        }
    }
    
    /**
     * Obtener tipo de usuario actual
     */
    obtenerTipoUsuario() {
        try {
            const userData = localStorage.getItem('cresalia_user_data');
            if (userData) {
                const data = JSON.parse(userData);
                return data.tipo || 'comprador';
            }
        } catch (error) {
            console.warn('⚠️ Error obteniendo tipo de usuario:', error);
        }
        return 'comprador'; // Default
    }
    
    /**
     * Detectar tipo de dispositivo
     */
    detectarDispositivo() {
        const ua = navigator.userAgent;
        if (/mobile/i.test(ua)) return 'mobile';
        if (/tablet/i.test(ua)) return 'tablet';
        return 'desktop';
    }
    
    /**
     * Reproducir sonido de alerta
     */
    reproducirSonidoAlerta() {
        try {
            // Crear sonido simple con Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            
            console.log('🔊 Sonido de alerta reproducido');
        } catch (error) {
            console.warn('⚠️ No se pudo reproducir sonido de alerta:', error);
        }
    }
    
    /**
     * Limpiar mensajes antiguos del localStorage
     */
    limpiarMensajesAntiguos() {
        try {
            const ahora = new Date();
            const diasExpiracion = 7; // Limpiar mensajes mayores a 7 días
            
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('mensaje_visto_')) {
                    const fecha = localStorage.getItem(key);
                    const fechaVisto = new Date(fecha);
                    const diasTranscurridos = (ahora - fechaVisto) / (1000 * 60 * 60 * 24);
                    
                    if (diasTranscurridos > diasExpiracion) {
                        localStorage.removeItem(key);
                        console.log(`🗑️ Mensaje antiguo eliminado: ${key}`);
                    }
                }
            });
        } catch (error) {
            console.warn('⚠️ Error limpiando mensajes antiguos:', error);
        }
    }
    
    /**
     * Destruir el sistema (cleanup)
     */
    destruir() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        console.log('🛑 Sistema de Mensajes Globales detenido');
    }
}

// ============================================
// 🎨 PANEL DE ADMINISTRACIÓN (Solo para Admin)
// ============================================

class PanelMensajesAdmin {
    /**
     * Enviar mensaje global a todos los usuarios
     */
    async enviarMensaje(datos) {
        try {
            const mensaje = {
                tipo: datos.tipo || 'anuncio',
                titulo: datos.titulo,
                mensaje: datos.mensaje,
                destinatarios: datos.destinatarios || 'todos',
                prioridad: datos.prioridad || 'normal',
                estilo: datos.estilo || 'info',
                icono: datos.icono || '',
                sonido: datos.sonido || false,
                persistente: datos.persistente || false,
                url_accion: datos.url_accion || null,
                boton_texto: datos.boton_texto || null,
                fecha_fin: datos.fecha_fin || null,
                activo: true
            };
            
            const { data, error } = await supabase
                .from('mensajes_globales')
                .insert([mensaje])
                .select();
            
            if (error) throw error;
            
            console.log('✅ Mensaje enviado correctamente:', data);
            return { success: true, data };
            
        } catch (error) {
            console.error('❌ Error enviando mensaje:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Obtener todos los mensajes (admin)
     */
    async obtenerTodosMensajes() {
        try {
            // Verificar que initSupabase esté disponible
            if (typeof initSupabase === 'undefined' || typeof initSupabase !== 'function') {
                throw new Error('Supabase no está disponible');
            }
            
            const supabase = initSupabase();
            if (!supabase || typeof supabase.from !== 'function') {
                throw new Error('Supabase no configurado correctamente');
            }
            
            const { data, error } = await supabase
                .from('mensajes_globales')
                .select('*')
                .order('creado_en', { ascending: false });
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error obteniendo mensajes:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Desactivar mensaje
     */
    async desactivarMensaje(mensajeId) {
        try {
            // Verificar que initSupabase esté disponible
            if (typeof initSupabase === 'undefined' || typeof initSupabase !== 'function') {
                throw new Error('Supabase no está disponible');
            }
            
            const supabase = initSupabase();
            if (!supabase || typeof supabase.from !== 'function') {
                throw new Error('Supabase no configurado correctamente');
            }
            
            const { data, error } = await supabase
                .from('mensajes_globales')
                .update({ activo: false })
                .eq('id', mensajeId)
                .select();
            
            if (error) throw error;
            
            console.log('✅ Mensaje desactivado:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error desactivando mensaje:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Ver estadísticas de un mensaje
     */
    async verEstadisticas(mensajeId) {
        try {
            const { data, error } = await supabase.rpc('estadisticas_mensaje', {
                p_mensaje_id: mensajeId
            });
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            return { success: false, error: error.message };
        }
    }
}

// ============================================
// 🚀 INICIALIZACIÓN AUTOMÁTICA
// ============================================

// Inicializar sistema automáticamente cuando carga la página
let sistemaMensajesGlobales;
let panelMensajesAdmin;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema de mensajes para todos los usuarios
    sistemaMensajesGlobales = new SistemaMensajesGlobales();
    
    // Limpiar mensajes antiguos (una vez al día)
    const ultimaLimpieza = localStorage.getItem('ultima_limpieza_mensajes');
    const ahora = new Date();
    
    if (!ultimaLimpieza || (ahora - new Date(ultimaLimpieza)) > 86400000) {
        sistemaMensajesGlobales.limpiarMensajesAntiguos();
        localStorage.setItem('ultima_limpieza_mensajes', ahora.toISOString());
    }
    
    // Inicializar panel admin (solo para Carla)
    panelMensajesAdmin = new PanelMensajesAdmin();
    
    console.log('✅ Sistema de Mensajes Globales cargado completamente');
});

// Hacer disponibles globalmente
window.sistemaMensajesGlobales = sistemaMensajesGlobales;
window.panelMensajesAdmin = panelMensajesAdmin;

// ============================================
// 📝 EJEMPLOS DE USO PARA ADMIN
// ============================================

/*
// EJEMPLO 1: Enviar mensaje de agradecimiento
await panelMensajesAdmin.enviarMensaje({
    tipo: 'agradecimiento',
    titulo: '¡Gracias por estar aquí! 💜',
    mensaje: 'Querida comunidad, queremos agradecerles de corazón por confiar en Cresalia. Juntos estamos construyendo algo hermoso. - El equipo de Cresalia',
    destinatarios: 'todos',
    prioridad: 'alta',
    estilo: 'success',
    icono: '💜',
    persistente: false
});

// EJEMPLO 2: Enviar alerta de emergencia
await panelMensajesAdmin.enviarMensaje({
    tipo: 'emergencia',
    titulo: '🚨 Alerta de Emergencia en Zona Centro',
    mensaje: 'Se reportó una emergencia en la zona centro. Por favor, mantente seguro y sigue las indicaciones de las autoridades.',
    destinatarios: 'todos',
    prioridad: 'critica',
    estilo: 'error',
    icono: '🚨',
    sonido: true,
    persistente: true
});

// EJEMPLO 3: Anuncio de mantenimiento
await panelMensajesAdmin.enviarMensaje({
    tipo: 'mantenimiento',
    titulo: 'Mantenimiento Programado',
    mensaje: 'Mañana realizaremos mantenimiento del sistema de 2 a 4 AM. Algunas funciones pueden no estar disponibles.',
    destinatarios: 'todos',
    prioridad: 'normal',
    estilo: 'warning',
    icono: '🔧',
    fecha_fin: new Date(Date.now() + 24*60*60*1000).toISOString() // 24 horas
});

// EJEMPLO 4: Ver estadísticas de un mensaje
const stats = await panelMensajesAdmin.verEstadisticas('MENSAJE_ID_AQUI');
console.log(stats);

// EJEMPLO 5: Desactivar un mensaje
await panelMensajesAdmin.desactivarMensaje('MENSAJE_ID_AQUI');
*/

console.log('📧 Sistema de Mensajes Globales de Cresalia v1.0');
