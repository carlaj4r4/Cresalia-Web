/**
 * 🚨 SISTEMA DE ALERTAS INTELIGENTE - CRESALIA
 * Solidaridad Global + Proximidad Local
 * 
 * Características:
 * - Desastres naturales → TODOS se enteran (solidaridad)
 * - Emergencias locales → Solo usuarios cercanos (proximidad)
 * - Presión a autoridades → Severidad aumenta con horas sin servicio
 * - Redirección a donaciones → Integración con sistema existente
 */

class SistemaAlertasInteligente {
    constructor() {
        this.alertas = [];
        this.miUbicacion = null;
        this.configuracion = {
            solicitarUbicacion: true,
            notificacionesGlobales: true, // Desastres naturales
            notificacionesLocales: true,  // Emergencias cercanas
            radioMaximo: 50 // km
        };
        
        this.inicializar();
    }
    
    async inicializar() {
        console.log('🚨 Sistema de Alertas Inteligente inicializado');
        
        // Cargar configuración guardada
        this.cargarConfiguracion();
        
        // Obtener ubicación del usuario (con consentimiento)
        await this.obtenerUbicacion();
        
        // Cargar alertas
        await this.cargarAlertasInteligentes();
        
        // Actualizar cada 5 minutos
        setInterval(() => this.cargarAlertasInteligentes(), 5 * 60 * 1000);
    }
    
    cargarConfiguracion() {
        const config = localStorage.getItem('cresalia_alertas_config');
        if (config) {
            try {
                this.configuracion = { ...this.configuracion, ...JSON.parse(config) };
            } catch (e) {
                console.error('Error cargando configuración:', e);
            }
        }
    }
    
    guardarConfiguracion() {
        localStorage.setItem('cresalia_alertas_config', JSON.stringify(this.configuracion));
    }
    
    async obtenerUbicacion() {
        // Primero intentar ubicación guardada (menos de 1 hora)
        const ubicacionGuardada = localStorage.getItem('cresalia_ubicacion_usuario');
        if (ubicacionGuardada) {
            try {
                const ubicacion = JSON.parse(ubicacionGuardada);
                const fechaGuardada = new Date(ubicacion.fecha);
                const horasTranscurridas = (new Date() - fechaGuardada) / (1000 * 60 * 60);
                
                if (horasTranscurridas < 1) {
                    this.miUbicacion = {
                        lat: ubicacion.latitud || ubicacion.lat,
                        lng: ubicacion.longitud || ubicacion.lng
                    };
                    console.log('✅ Usando ubicación guardada para alertas');
                    return;
                }
            } catch (e) {
                console.log('⚠️ Error cargando ubicación guardada');
            }
        }
        
        // Si no hay ubicación reciente, solicitar (si el usuario permite)
        if (this.configuracion.solicitarUbicacion && navigator.geolocation) {
            try {
                const posicion = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: false,
                        timeout: 10000,
                        maximumAge: 600000 // 10 minutos
                    });
                });
                
                this.miUbicacion = {
                    lat: posicion.coords.latitude,
                    lng: posicion.coords.longitude
                };
                
                // Guardar ubicación
                localStorage.setItem('cresalia_ubicacion_usuario', JSON.stringify({
                    latitud: this.miUbicacion.lat,
                    longitud: this.miUbicacion.lng,
                    fecha: new Date().toISOString()
                }));
                
                console.log('✅ Ubicación obtenida para alertas inteligentes');
            } catch (error) {
                console.log('ℹ️ No se pudo obtener ubicación. Solo se mostrarán alertas globales.');
                this.miUbicacion = null;
            }
        }
    }
    
    async cargarAlertasInteligentes() {
        try {
            // Si no hay Supabase configurado, salir
            if (typeof supabase === 'undefined') {
                console.log('ℹ️ Supabase no configurado para alertas');
                return;
            }
            
            // Obtener hash del usuario (si está logueado)
            const usuarioHash = this.obtenerUsuarioHash();
            
            // Llamar a función RPC con ubicación del usuario
            const { data, error } = await supabase.rpc('obtener_alertas_inteligentes', {
                p_usuario_lat: this.miUbicacion?.lat || null,
                p_usuario_lng: this.miUbicacion?.lng || null,
                p_usuario_hash: usuarioHash
            });
            
            if (error) {
                console.error('Error obteniendo alertas:', error);
                return;
            }
            
            this.alertas = data || [];
            this.mostrarAlertas();
            
        } catch (error) {
            console.error('Error en sistema de alertas:', error);
        }
    }
    
    obtenerUsuarioHash() {
        // Si hay usuario logueado, usar su ID
        // Si no, generar hash único por dispositivo
        let hash = localStorage.getItem('cresalia_usuario_hash');
        if (!hash) {
            hash = 'usuario_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('cresalia_usuario_hash', hash);
        }
        return hash;
    }
    
    mostrarAlertas() {
        this.alertas.forEach(alerta => {
            // Filtrar por configuración del usuario
            if (alerta.alcance === 'global' && !this.configuracion.notificacionesGlobales) {
                return; // Usuario desactivó notificaciones globales
            }
            
            if (alerta.alcance === 'local' && !this.configuracion.notificacionesLocales) {
                return; // Usuario desactivó notificaciones locales
            }
            
            this.mostrarAlerta(alerta);
        });
    }
    
    mostrarAlerta(alerta) {
        // Usar el sistema de notificaciones elegantes si existe
        if (typeof elegantNotifications !== 'undefined') {
            const config = this.generarConfigNotificacion(alerta);
            elegantNotifications.show(config);
        } else {
            // Fallback: notificación básica
            this.mostrarNotificacionBasica(alerta);
        }
    }
    
    generarConfigNotificacion(alerta) {
        const esGlobal = alerta.alcance === 'global';
        const distanciaTexto = alerta.distancia_usuario_km 
            ? ` (${Math.round(alerta.distancia_usuario_km)} km de distancia)`
            : '';
        
        return {
            titulo: `${this.getIconoPorTipo(alerta.tipo)} ${alerta.titulo}`,
            mensaje: alerta.descripcion + distanciaTexto,
            tipo: this.getTipoPorSeveridad(alerta.severidad),
            duracion: esGlobal ? 0 : 10000, // Globales no se cierran solas
            botones: this.generarBotones(alerta),
            onClose: () => this.marcarComoVista(alerta.id)
        };
    }
    
    generarBotones(alerta) {
        const botones = [];
        const esGlobal = alerta.alcance === 'global';
        
        if (esGlobal) {
            // Desastres globales → Opciones de ayuda
            botones.push({
                texto: '💵 Donar Dinero',
                onclick: () => window.location.href = alerta.url_donacion_dinero
            });
            
            botones.push({
                texto: '📦 Donar Materiales',
                onclick: () => window.location.href = alerta.url_donacion_materiales
            });
            
            if (alerta.total_personas_ayudando > 0) {
                botones.push({
                    texto: `💜 ${alerta.total_personas_ayudando} personas ayudando`,
                    onclick: () => this.verEstadisticas(alerta)
                });
            }
        } else {
            // Emergencias locales → Información + Reportar
            if (alerta.horas_sin_servicio > 0) {
                botones.push({
                    texto: `⏰ Lleva ${alerta.dias_sin_servicio} días sin servicio`,
                    onclick: () => this.verDetalles(alerta)
                });
            }
            
            botones.push({
                texto: '📍 Ver en Mapa',
                onclick: () => this.verEnMapa(alerta)
            });
            
            botones.push({
                texto: '✓ Reportar Estado',
                onclick: () => this.reportarEstado(alerta)
            });
        }
        
        return botones;
    }
    
    getIconoPorTipo(tipo) {
        const iconos = {
            'inundacion': '🌊',
            'incendio': '🔥',
            'terremoto': '🌍',
            'tornado': '🌪️',
            'tsunami': '🌊',
            'pandemia': '🏥',
            'corte_luz': '💡',
            'corte_gas': '⛽',
            'corte_agua': '💧',
            'accidente': '🚗',
            'seguridad': '🚨'
        };
        return iconos[tipo] || '⚠️';
    }
    
    getTipoPorSeveridad(severidad) {
        const tipos = {
            'critica': 'error',
            'alta': 'warning',
            'media': 'info',
            'baja': 'info'
        };
        return tipos[severidad] || 'info';
    }
    
    async marcarComoVista(alertaId) {
        try {
            const usuarioHash = this.obtenerUsuarioHash();
            
            await supabase.from('alertas_vistas_usuarios').insert({
                alerta_id: alertaId,
                usuario_hash: usuarioHash
            });
            
            console.log('✅ Alerta marcada como vista');
        } catch (error) {
            console.log('⚠️ Error marcando alerta como vista:', error);
        }
    }
    
    async registrarAyuda(alertaId, tipoAyuda, monto = 0) {
        try {
            const { data, error } = await supabase.rpc('registrar_ayuda', {
                p_alerta_id: alertaId,
                p_tipo_ayuda: tipoAyuda,
                p_monto: monto
            });
            
            if (error) throw error;
            
            if (typeof elegantNotifications !== 'undefined') {
                elegantNotifications.show({
                    titulo: '💜 ¡Gracias por tu ayuda!',
                    mensaje: 'Tu solidaridad hace la diferencia',
                    tipo: 'success',
                    duracion: 5000
                });
            }
            
            // Recargar alertas para actualizar contadores
            await this.cargarAlertasInteligentes();
            
        } catch (error) {
            console.error('Error registrando ayuda:', error);
        }
    }
    
    verEstadisticas(alerta) {
        const mensaje = `
📊 Estadísticas de Ayuda

💵 Donado: $${alerta.total_donaciones_dinero}
📦 Materiales: ${alerta.total_donaciones_materiales}
👥 Personas: ${alerta.total_personas_ayudando}
        `;
        
        if (typeof elegantNotifications !== 'undefined') {
            elegantNotifications.show({
                titulo: '💜 Solidaridad en Acción',
                mensaje: mensaje,
                tipo: 'success',
                duracion: 8000
            });
        } else {
            alert(mensaje);
        }
    }
    
    verDetalles(alerta) {
        // Mostrar detalles completos
        console.log('Detalles de alerta:', alerta);
    }
    
    verEnMapa(alerta) {
        if (alerta.coordenadas) {
            const lat = alerta.coordenadas.lat;
            const lng = alerta.coordenadas.lng;
            window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
        }
    }
    
    reportarEstado(alerta) {
        // Abrir modal para reportar estado actual
        console.log('Reportar estado de:', alerta);
    }
    
    mostrarNotificacionBasica(alerta) {
        // Fallback simple
        const mensaje = `${this.getIconoPorTipo(alerta.tipo)} ${alerta.titulo}\n\n${alerta.descripcion}`;
        console.log(mensaje);
    }
    
    // ===== CONFIGURACIÓN DEL USUARIO =====
    
    activarNotificacionesGlobales(activo) {
        this.configuracion.notificacionesGlobales = activo;
        this.guardarConfiguracion();
    }
    
    activarNotificacionesLocales(activo) {
        this.configuracion.notificacionesLocales = activo;
        this.guardarConfiguracion();
    }
    
    configurarRadio(km) {
        this.configuracion.radioMaximo = km;
        this.guardarConfiguracion();
    }
}

// ===== INICIALIZACIÓN GLOBAL =====

// Inicializar automáticamente cuando se cargue la página
let sistemaAlertasInteligente;

document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que Supabase esté disponible
    setTimeout(() => {
        sistemaAlertasInteligente = new SistemaAlertasInteligente();
        
        // Hacer disponible globalmente
        window.sistemaAlertasInteligente = sistemaAlertasInteligente;
        
        console.log('✅ Sistema de Alertas Inteligente cargado');
    }, 2000);
});
