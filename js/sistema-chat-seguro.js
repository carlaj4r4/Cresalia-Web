// ===== CRESALIA CHAT SEGURO =====
// Sistema de chat seguro entre usuarios con moderación automática y protección avanzada
// Co-fundadores: Crisla & Claude

class SistemaChatSeguro {
    constructor() {
        this.supabase = null;
        this.usuarioHash = null;
        this.usuarioActual = null;
        this.conversaciones = [];
        this.grupos = [];
        this.mensajes = new Map(); // Map<conversacion_id, mensajes[]>
        this.filtrosModeracion = this.inicializarFiltros();
        this.init();
    }
    
    async init() {
        // Inicializar Supabase
        if (typeof window.supabase !== 'undefined' && window.SUPABASE_CONFIG) {
            try {
                const config = window.SUPABASE_CONFIG;
                if (config.url && config.anonKey && !config.anonKey.includes('REEMPLAZA')) {
                    this.supabase = window.supabase.createClient(config.url, config.anonKey);
                    console.log('✅ Cresalia Chat Seguro: Supabase inicializado');
                }
            } catch (error) {
                console.error('❌ Error inicializando Supabase:', error);
            }
        }
        
        // Generar hash de usuario
        this.usuarioHash = this.generarHashUsuario();
        this.usuarioActual = this.cargarUsuarioActual();
        
        // Cargar bloqueos
        await this.cargarBloqueos();
        
        console.log('✅ Cresalia Chat Seguro inicializado');
    }
    
    generarHashUsuario() {
        let hash = localStorage.getItem('cresalia_chat_usuario_hash');
        if (!hash) {
            const random = Math.random().toString(36).substring(2) + Date.now().toString(36);
            hash = btoa(random).substring(0, 32);
            localStorage.setItem('cresalia_chat_usuario_hash', hash);
        }
        return hash;
    }
    
    cargarUsuarioActual() {
        return {
            id: this.usuarioHash,
            nombre: localStorage.getItem('cresalia_chat_usuario_nombre') || 'Usuario',
            verificado: localStorage.getItem('cresalia_chat_usuario_verificado') === 'true',
            edad: parseInt(localStorage.getItem('cresalia_chat_usuario_edad')) || null,
            es_menor: localStorage.getItem('cresalia_chat_usuario_menor') === 'true'
        };
    }
    
    // ===== FILTROS DE MODERACIÓN =====
    inicializarFiltros() {
        return {
            palabrasProhibidas: [
                // Palabras ofensivas (ejemplos básicos - en producción sería más completo)
                'palabra1', 'palabra2' // Reemplazar con lista real
            ],
            palabrasAcoso: [
                'acoso1', 'acoso2' // Reemplazar con patrones de acoso
            ],
            patronesSpam: [
                /(.)\1{10,}/, // Caracteres repetidos
                /(http|https|www\.){3,}/i, // Múltiples URLs
                /[A-Z]{20,}/ // Muchas mayúsculas
            ],
            patronesPhishing: [
                /ingresa.*contraseña/i,
                /envia.*dinero/i,
                /verifica.*cuenta.*urgente/i
            ]
        };
    }
    
    // ===== MODERACIÓN AUTOMÁTICA =====
    moderarMensaje(mensaje) {
        const resultado = {
            seguro: true,
            nivelRiesgo: 'bajo',
            razon: null,
            mensajeEditado: mensaje,
            accion: 'permitir'
        };
        
        const mensajeLower = mensaje.toLowerCase();
        
        // 1. Verificar palabras prohibidas
        const palabraProhibida = this.filtrosModeracion.palabrasProhibidas.find(p => 
            mensajeLower.includes(p.toLowerCase())
        );
        
        if (palabraProhibida) {
            resultado.seguro = false;
            resultado.nivelRiesgo = 'alto';
            resultado.razon = 'Contiene palabras prohibidas';
            resultado.mensajeEditado = this.reemplazarPalabrasProhibidas(mensaje);
            resultado.accion = 'editar';
            return resultado;
        }
        
        // 2. Verificar acoso
        const palabraAcoso = this.filtrosModeracion.palabrasAcoso.find(p => 
            mensajeLower.includes(p.toLowerCase())
        );
        
        if (palabraAcoso) {
            resultado.seguro = false;
            resultado.nivelRiesgo = 'critico';
            resultado.razon = 'Posible acoso detectado';
            resultado.accion = 'bloquear';
            return resultado;
        }
        
        // 3. Verificar spam
        const patronSpam = this.filtrosModeracion.patronesSpam.find(p => p.test(mensaje));
        if (patronSpam) {
            resultado.seguro = false;
            resultado.nivelRiesgo = 'medio';
            resultado.razon = 'Posible spam detectado';
            resultado.accion = 'bloquear';
            return resultado;
        }
        
        // 4. Verificar phishing
        const patronPhishing = this.filtrosModeracion.patronesPhishing.find(p => p.test(mensaje));
        if (patronPhishing) {
            resultado.seguro = false;
            resultado.nivelRiesgo = 'critico';
            resultado.razon = 'Posible intento de phishing';
            resultado.accion = 'bloquear';
            return resultado;
        }
        
        return resultado;
    }
    
    reemplazarPalabrasProhibidas(mensaje) {
        let mensajeEditado = mensaje;
        this.filtrosModeracion.palabrasProhibidas.forEach(palabra => {
            const regex = new RegExp(palabra, 'gi');
            mensajeEditado = mensajeEditado.replace(regex, '***');
        });
        return mensajeEditado;
    }
    
    // ===== CARGAR BLOQUEOS =====
    async cargarBloqueos() {
        if (!this.supabase) return;
        
        try {
            const { data, error } = await this.supabase
                .from('bloqueos_chat_seguro')
                .select('bloqueado_id')
                .eq('bloqueador_id', this.usuarioHash)
                .eq('activo', true);
            
            if (error) throw error;
            
            this.usuariosBloqueados = new Set(data?.map(b => b.bloqueado_id) || []);
        } catch (error) {
            console.error('Error cargando bloqueos:', error);
            this.usuariosBloqueados = new Set();
        }
    }
    
    // ===== ENVIAR MENSAJE =====
    async enviarMensaje(conversacionId, mensaje, opciones = {}) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con Supabase');
            return;
        }
        
        // Verificar que el usuario no esté bloqueado
        const conversacion = this.conversaciones.find(c => c.id === conversacionId);
        if (conversacion) {
            const otroUsuarioId = conversacion.usuario1_id === this.usuarioHash 
                ? conversacion.usuario2_id 
                : conversacion.usuario1_id;
            
            if (this.usuariosBloqueados?.has(otroUsuarioId)) {
                this.mostrarError('No puedes enviar mensajes a este usuario');
                return;
            }
        }
        
        // Moderar mensaje
        const moderacion = this.moderarMensaje(mensaje);
        
        if (moderacion.accion === 'bloquear') {
            this.mostrarError('Tu mensaje no pudo ser enviado. Contenido no permitido.');
            
            // Guardar log de moderación
            await this.guardarLogModeracion(null, moderacion);
            return;
        }
        
        try {
            const mensajeData = {
                conversacion_id: conversacionId,
                remitente_id: this.usuarioHash,
                remitente_nombre: this.usuarioActual.nombre,
                remitente_verificado: this.usuarioActual.verificado,
                mensaje: moderacion.mensajeEditado,
                mensaje_original: moderacion.accion === 'editar' ? mensaje : null,
                moderado: moderacion.accion !== 'permitir',
                nivel_riesgo: moderacion.nivelRiesgo,
                razon_bloqueo: moderacion.razon,
                contenido_editado: moderacion.accion === 'editar',
                mensaje_temporal: opciones.temporal || false,
                tiempo_vida_minutos: opciones.tiempoVida || null,
                solo_una_vez: opciones.soloUnaVez || false
            };
            
            const { data, error } = await this.supabase
                .from('mensajes_chat_seguro')
                .insert([mensajeData])
                .select();
            
            if (error) throw error;
            
            // Si fue moderado, guardar log
            if (moderacion.accion !== 'permitir') {
                await this.guardarLogModeracion(data[0].id, moderacion);
            }
            
            // Si es mensaje temporal, programar eliminación
            if (opciones.temporal && opciones.tiempoVida) {
                setTimeout(() => {
                    this.eliminarMensaje(data[0].id);
                }, opciones.tiempoVida * 60 * 1000);
            }
            
            return data[0];
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            this.mostrarError('Error al enviar mensaje: ' + error.message);
            throw error;
        }
    }
    
    // ===== GUARDAR LOG DE MODERACIÓN =====
    async guardarLogModeracion(mensajeId, moderacion) {
        if (!this.supabase) return;
        
        try {
            await this.supabase
                .from('moderacion_automatica_chat')
                .insert([{
                    mensaje_id: mensajeId,
                    tipo_deteccion: this.determinarTipoDeteccion(moderacion),
                    confianza: this.calcularConfianza(moderacion),
                    accion: moderacion.accion,
                    mensaje_editado: moderacion.mensajeEditado
                }]);
        } catch (error) {
            console.error('Error guardando log de moderación:', error);
        }
    }
    
    determinarTipoDeteccion(moderacion) {
        if (moderacion.razon?.includes('prohibidas')) return 'palabra_prohibida';
        if (moderacion.razon?.includes('acoso')) return 'acoso';
        if (moderacion.razon?.includes('spam')) return 'spam';
        if (moderacion.razon?.includes('phishing')) return 'phishing';
        return 'otro';
    }
    
    calcularConfianza(moderacion) {
        if (moderacion.nivelRiesgo === 'critico') return 0.95;
        if (moderacion.nivelRiesgo === 'alto') return 0.85;
        if (moderacion.nivelRiesgo === 'medio') return 0.70;
        return 0.50;
    }
    
    // ===== CREAR CONVERSACIÓN =====
    async crearConversacion(usuario2Id, usuario2Nombre, usuario2Verificado = false, usuario2Edad = null) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con Supabase');
            return;
        }
        
        // Verificar si ya existe conversación
        const conversacionExistente = this.conversaciones.find(c => 
            (c.usuario1_id === this.usuarioHash && c.usuario2_id === usuario2Id) ||
            (c.usuario1_id === usuario2Id && c.usuario2_id === this.usuarioHash)
        );
        
        if (conversacionExistente) {
            return conversacionExistente;
        }
        
        // Verificar bloqueos
        if (this.usuariosBloqueados?.has(usuario2Id)) {
            this.mostrarError('No puedes iniciar una conversación con este usuario');
            return null;
        }
        
        // Protección de menores
        if (this.usuarioActual.es_menor) {
            if (!usuario2Verificado) {
                this.mostrarError('Los menores solo pueden chatear con usuarios verificados');
                return null;
            }
        }
        
        if (usuario2Edad && usuario2Edad < 18) {
            if (!this.usuarioActual.verificado) {
                this.mostrarError('Solo usuarios verificados pueden chatear con menores');
                return null;
            }
        }
        
        try {
            const conversacionData = {
                usuario1_id: this.usuarioHash,
                usuario1_nombre: this.usuarioActual.nombre,
                usuario1_verificado: this.usuarioActual.verificado,
                usuario1_edad: this.usuarioActual.edad,
                usuario2_id: usuario2Id,
                usuario2_nombre: usuario2Nombre,
                usuario2_verificado: usuario2Verificado,
                usuario2_edad: usuario2Edad
            };
            
            const { data, error } = await this.supabase
                .from('conversaciones_chat_seguro')
                .insert([conversacionData])
                .select();
            
            if (error) throw error;
            
            this.conversaciones.push(data[0]);
            return data[0];
        } catch (error) {
            console.error('Error creando conversación:', error);
            this.mostrarError('Error al crear conversación: ' + error.message);
            throw error;
        }
    }
    
    // ===== CARGAR CONVERSACIONES =====
    async cargarConversaciones() {
        if (!this.supabase) {
            // Modo local
            this.conversaciones = JSON.parse(localStorage.getItem('conversaciones_chat_seguro') || '[]');
            return;
        }
        
        try {
            const { data, error } = await this.supabase
                .from('conversaciones_chat_seguro')
                .select('*')
                .or(`usuario1_id.eq.${this.usuarioHash},usuario2_id.eq.${this.usuarioHash}`)
                .eq('estado', 'activa')
                .order('fecha_ultimo_mensaje', { ascending: false });
            
            if (error) throw error;
            
            this.conversaciones = data || [];
        } catch (error) {
            console.error('Error cargando conversaciones:', error);
            this.conversaciones = [];
        }
    }
    
    // ===== CARGAR MENSAJES =====
    async cargarMensajes(conversacionId) {
        if (!this.supabase) {
            // Modo local
            const mensajes = JSON.parse(localStorage.getItem(`mensajes_chat_${conversacionId}`) || '[]');
            this.mensajes.set(conversacionId, mensajes);
            return mensajes;
        }
        
        try {
            const { data, error } = await this.supabase
                .from('mensajes_chat_seguro')
                .select('*')
                .eq('conversacion_id', conversacionId)
                .eq('eliminado', false)
                .order('fecha_envio', { ascending: true });
            
            if (error) throw error;
            
            this.mensajes.set(conversacionId, data || []);
            return data || [];
        } catch (error) {
            console.error('Error cargando mensajes:', error);
            return [];
        }
    }
    
    // ===== REPORTAR MENSAJE =====
    async reportarMensaje(mensajeId, tipoReporte, descripcion, evidencia = []) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con Supabase');
            return;
        }
        
        try {
            // Obtener información del mensaje
            const mensaje = Array.from(this.mensajes.values())
                .flat()
                .find(m => m.id === mensajeId);
            
            if (!mensaje) {
                this.mostrarError('Mensaje no encontrado');
                return;
            }
            
            const reporteData = {
                tipo_reporte: tipoReporte,
                mensaje_id: mensajeId,
                conversacion_id: mensaje.conversacion_id,
                reportado_por: this.usuarioHash,
                reportado_por_nombre: this.usuarioActual.nombre,
                reportado_usuario_id: mensaje.remitente_id,
                reportado_usuario_nombre: mensaje.remitente_nombre,
                descripcion: descripcion,
                evidencia: evidencia
            };
            
            const { data, error } = await this.supabase
                .from('reportes_chat_seguro')
                .insert([reporteData])
                .select();
            
            if (error) throw error;
            
            this.mostrarExito('Reporte enviado. Gracias por ayudar a mantener Cresalia seguro.');
            return data[0];
        } catch (error) {
            console.error('Error reportando mensaje:', error);
            this.mostrarError('Error al reportar: ' + error.message);
            throw error;
        }
    }
    
    // ===== BLOQUEAR USUARIO =====
    async bloquearUsuario(usuarioId, razon = null) {
        if (!this.supabase) {
            // Modo local
            if (!this.usuariosBloqueados) this.usuariosBloqueados = new Set();
            this.usuariosBloqueados.add(usuarioId);
            localStorage.setItem('usuarios_bloqueados_chat', JSON.stringify(Array.from(this.usuariosBloqueados)));
            return;
        }
        
        try {
            const { data, error } = await this.supabase
                .from('bloqueos_chat_seguro')
                .insert([{
                    bloqueador_id: this.usuarioHash,
                    bloqueado_id: usuarioId,
                    razon: razon,
                    tipo_bloqueo: 'usuario'
                }])
                .select();
            
            if (error) throw error;
            
            this.usuariosBloqueados.add(usuarioId);
            this.mostrarExito('Usuario bloqueado correctamente');
            return data[0];
        } catch (error) {
            console.error('Error bloqueando usuario:', error);
            this.mostrarError('Error al bloquear usuario: ' + error.message);
            throw error;
        }
    }
    
    // ===== ELIMINAR MENSAJE =====
    async eliminarMensaje(mensajeId) {
        if (!this.supabase) return;
        
        try {
            await this.supabase
                .from('mensajes_chat_seguro')
                .update({
                    eliminado: true,
                    eliminado_por: 'usuario',
                    fecha_eliminacion: new Date().toISOString()
                })
                .eq('id', mensajeId);
        } catch (error) {
            console.error('Error eliminando mensaje:', error);
        }
    }
    
    // ===== UTILIDADES =====
    mostrarError(mensaje) {
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, 'error');
        } else {
            alert('❌ ' + mensaje);
        }
    }
    
    mostrarExito(mensaje) {
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, 'success');
        } else {
            alert('✅ ' + mensaje);
        }
    }
}

// Instancia global
window.sistemaChatSeguro = new SistemaChatSeguro();

