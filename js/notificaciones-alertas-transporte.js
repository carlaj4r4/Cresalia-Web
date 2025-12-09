// ===== SISTEMA DE NOTIFICACIONES PARA ALERTAS DE TRANSPORTE =====
// Notificaciones push y email cuando hay alertas cercanas al usuario
// Co-fundadores: Cresalia Team

class NotificacionesAlertasTransporte {
    constructor() {
        this.ubicacionUsuario = null;
        this.permisosUbicacion = false;
        this.permisosNotificacion = false;
        this.emailUsuario = null;
        this.alertasNotificadas = new Set(); // IDs de alertas ya notificadas
        this.radioCercania = 20; // Radio en km para considerar "cercano"
        this.intervaloVerificacion = 5 * 60 * 1000; // Verificar cada 5 minutos
        this.init();
    }
    
    async init() {
        console.log('🔔 Inicializando sistema de notificaciones de transporte...');
        
        // Solicitar permisos (mostrará banner si es necesario)
        await this.solicitarPermisos();
        
        // Si ya tiene permisos, continuar con la inicialización
        if (this.permisosNotificacion) {
            // Obtener ubicación del usuario
            await this.obtenerUbicacion();
            
            // Obtener email del usuario (si está disponible)
            this.obtenerEmailUsuario();
            
            // Iniciar verificación periódica
            this.iniciarVerificacionPeriodica();
            
            // Escuchar nuevas alertas en tiempo real
            this.escucharNuevasAlertas();
            
            console.log('✅ Sistema de notificaciones de transporte inicializado');
        } else {
            console.log('ℹ️ Esperando permisos de notificación del usuario...');
        }
    }
    
    // Solicitar permisos de ubicación y notificaciones
    async solicitarPermisos() {
        // Permisos de notificaciones
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                // Mostrar banner para solicitar permisos (requiere interacción del usuario)
                this.mostrarBannerPermisosNotificaciones();
            } else {
                this.permisosNotificacion = Notification.permission === 'granted';
                if (this.permisosNotificacion) {
                    console.log('✅ Permisos de notificación ya concedidos');
                }
            }
        }
    }
    
    // Mostrar banner para solicitar permisos de notificaciones
    mostrarBannerPermisosNotificaciones() {
        // Verificar si ya se mostró el banner en esta sesión
        const bannerMostrado = sessionStorage.getItem('banner_notificaciones_transporte_mostrado');
        if (bannerMostrado === 'true') {
            return;
        }
        
        // Crear banner
        const banner = document.createElement('div');
        banner.id = 'banner-permisos-notificaciones-transporte';
        banner.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #2563EB, #3B82F6);
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(37, 99, 235, 0.4);
            z-index: 10000;
            max-width: 350px;
            animation: slideInUp 0.3s ease-out;
        `;
        
        banner.innerHTML = `
            <div style="display: flex; align-items: start; gap: 15px;">
                <div style="font-size: 2rem;">🔔</div>
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 10px 0; font-size: 1.1rem; font-weight: 600;">
                        Recibe alertas de transporte
                    </h4>
                    <p style="margin: 0 0 15px 0; font-size: 0.9rem; line-height: 1.5; opacity: 0.95;">
                        Activa las notificaciones para recibir alertas sobre cortes, cambios de recorrido y demoras cerca de ti.
                    </p>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="window.notificacionesTransporte?.activarNotificaciones()" style="
                            background: white;
                            color: #2563EB;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                            flex: 1;
                            font-size: 0.95rem;
                        ">Activar</button>
                        <button onclick="document.getElementById('banner-permisos-notificaciones-transporte')?.remove()" style="
                            background: rgba(255,255,255,0.2);
                            color: white;
                            border: none;
                            padding: 10px 15px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 0.9rem;
                        ">Ahora no</button>
                    </div>
                </div>
                <button onclick="document.getElementById('banner-permisos-notificaciones-transporte')?.remove()" style="
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
            </div>
        `;
        
        // Agregar animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInUp {
                from {
                    transform: translateY(100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(banner);
        sessionStorage.setItem('banner_notificaciones_transporte_mostrado', 'true');
        
        // Auto-cerrar después de 30 segundos
        setTimeout(() => {
            if (banner.parentNode) {
                banner.style.animation = 'slideInUp 0.3s ease-out reverse';
                setTimeout(() => banner.remove(), 300);
            }
        }, 30000);
    }
    
    // Activar notificaciones (llamado desde el botón)
    async activarNotificaciones() {
        if (!('Notification' in window)) {
            alert('Tu navegador no soporta notificaciones');
            return;
        }
        
        try {
            const permission = await Notification.requestPermission();
            this.permisosNotificacion = permission === 'granted';
            
            if (this.permisosNotificacion) {
                console.log('✅ Permisos de notificación concedidos');
                
                // Cerrar banner
                const banner = document.getElementById('banner-permisos-notificaciones-transporte');
                if (banner) {
                    banner.style.animation = 'slideInUp 0.3s ease-out reverse';
                    setTimeout(() => banner.remove(), 300);
                }
                
                // Mostrar confirmación
                if (typeof mostrarNotificacion === 'function') {
                    mostrarNotificacion('🔔 Notificaciones activadas. Recibirás alertas sobre transporte cerca de ti.', 'success');
                } else {
                    alert('🔔 Notificaciones activadas. Recibirás alertas sobre transporte cerca de ti.');
                }
                
                // Continuar con la inicialización
                await this.obtenerUbicacion();
                this.obtenerEmailUsuario();
                this.iniciarVerificacionPeriodica();
                this.escucharNuevasAlertas();
            } else {
                if (typeof mostrarNotificacion === 'function') {
                    mostrarNotificacion('⚠️ Las notificaciones fueron denegadas. Puedes activarlas desde la configuración de tu navegador.', 'warning');
                }
            }
        } catch (error) {
            console.warn('⚠️ Error al solicitar permisos de notificación:', error);
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('⚠️ Error al activar notificaciones. Por favor, intenta nuevamente.', 'error');
            }
        }
    }
        
        // Permisos de ubicación
        if ('geolocation' in navigator) {
            // Verificar si ya se concedió permiso anteriormente
            const consentimiento = localStorage.getItem('cresalia_geolocalizacion_consentimiento');
            
            if (consentimiento !== 'denegado' && consentimiento !== 'denied') {
                try {
                    const position = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0
                        });
                    });
                    
                    this.permisosUbicacion = true;
                    this.ubicacionUsuario = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: Date.now()
                    };
                    
                    // Guardar ubicación
                    localStorage.setItem('cresalia_ubicacion_transporte', JSON.stringify(this.ubicacionUsuario));
                    console.log('✅ Ubicación obtenida:', this.ubicacionUsuario);
                } catch (error) {
                    console.warn('⚠️ Error al obtener ubicación:', error);
                    // Intentar cargar ubicación guardada
                    this.cargarUbicacionGuardada();
                }
            } else {
                console.log('ℹ️ Usuario denegó permiso de ubicación anteriormente');
                this.cargarUbicacionGuardada();
            }
        }
    }
    
    // Cargar ubicación guardada
    cargarUbicacionGuardada() {
        const ubicacionGuardada = localStorage.getItem('cresalia_ubicacion_transporte');
        if (ubicacionGuardada) {
            try {
                const ubicacion = JSON.parse(ubicacionGuardada);
                // Verificar que no sea muy antigua (más de 1 hora)
                if (Date.now() - ubicacion.timestamp < 3600000) {
                    this.ubicacionUsuario = ubicacion;
                    this.permisosUbicacion = true;
                    console.log('✅ Ubicación guardada cargada:', this.ubicacionUsuario);
                }
            } catch (error) {
                console.warn('⚠️ Error al cargar ubicación guardada:', error);
            }
        }
    }
    
    // Obtener ubicación del usuario
    async obtenerUbicacion() {
        if (!('geolocation' in navigator)) {
            console.warn('⚠️ Geolocalización no disponible');
            return;
        }
        
        if (!this.permisosUbicacion) {
            return;
        }
        
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutos
                });
            });
            
            this.ubicacionUsuario = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                timestamp: Date.now()
            };
            
            // Guardar ubicación
            localStorage.setItem('cresalia_ubicacion_transporte', JSON.stringify(this.ubicacionUsuario));
        } catch (error) {
            console.warn('⚠️ Error al obtener ubicación:', error);
        }
    }
    
    // Obtener email del usuario (si está disponible)
    obtenerEmailUsuario() {
        // Intentar obtener desde localStorage o sessionStorage
        const email = localStorage.getItem('cresalia_user_email') || 
                     localStorage.getItem('cresalia_transporte_email') ||
                     sessionStorage.getItem('cresalia_user_email') ||
                     localStorage.getItem('user_email');
        
        if (email) {
            this.emailUsuario = email;
            console.log('✅ Email del usuario obtenido:', this.emailUsuario);
        }
        
        // También verificar si hay un input de email en la página
        const emailInput = document.getElementById('email-notificaciones');
        if (emailInput && emailInput.value.trim()) {
            const emailIngresado = emailInput.value.trim();
            this.emailUsuario = emailIngresado;
            localStorage.setItem('cresalia_user_email', emailIngresado);
            localStorage.setItem('cresalia_transporte_email', emailIngresado);
            console.log('✅ Email del usuario obtenido del formulario:', this.emailUsuario);
        }
    }
    
    // Iniciar verificación periódica de alertas
    iniciarVerificacionPeriodica() {
        // Verificar inmediatamente
        this.verificarAlertasCercanas();
        
        // Verificar periódicamente
        setInterval(() => {
            this.verificarAlertasCercanas();
        }, this.intervaloVerificacion);
        
        // Actualizar ubicación periódicamente (cada 15 minutos)
        setInterval(() => {
            this.obtenerUbicacion();
        }, 15 * 60 * 1000);
    }
    
    // Escuchar nuevas alertas en tiempo real
    escucharNuevasAlertas() {
        // Si hay un sistema de transporte activo, escuchar nuevos reportes
        if (window.comunidadTransporte) {
            // Interceptar el método de reportar alerta
            const originalReportar = window.comunidadTransporte.reportarAlerta;
            if (originalReportar) {
                window.comunidadTransporte.reportarAlerta = async (...args) => {
                    const resultado = await originalReportar.apply(window.comunidadTransporte, args);
                    
                    // Verificar si la nueva alerta está cerca
                    if (resultado && this.ubicacionUsuario) {
                        setTimeout(() => {
                            this.verificarAlertaEspecifica(resultado);
                        }, 2000);
                    }
                    
                    return resultado;
                };
            }
        }
    }
    
    // Verificar alertas cercanas
    async verificarAlertasCercanas() {
        if (!this.ubicacionUsuario) {
            console.log('ℹ️ No hay ubicación disponible para verificar alertas');
            return;
        }
        
        try {
            let alertas = [];
            
            // Obtener alertas desde Supabase o localStorage
            if (window.comunidadTransporte && window.comunidadTransporte.supabase) {
                const { data, error } = await window.comunidadTransporte.supabase
                    .from('alertas_transporte_publico')
                    .select('*')
                    .eq('estado', 'activa')
                    .order('fecha_reporte', { ascending: false })
                    .limit(100);
                
                if (!error && data) {
                    alertas = data;
                }
            } else {
                // Modo local
                const alertasKey = 'alertas_transporte_publico';
                const alertasGuardadas = localStorage.getItem(alertasKey);
                if (alertasGuardadas) {
                    alertas = JSON.parse(alertasGuardadas)
                        .filter(a => a.estado === 'activa');
                }
            }
            
            // Filtrar alertas cercanas y no notificadas
            const alertasCercanas = alertas.filter(alerta => {
                // Solo alertas de tipo "corte", "cambio-recorrido" o "tardanza" (NO "aumento")
                if (alerta.tipo_alerta !== 'corte' && 
                    alerta.tipo_alerta !== 'cambio-recorrido' && 
                    alerta.tipo_alerta !== 'tardanza') {
                    return false;
                }
                
                // Verificar si ya fue notificada
                if (this.alertasNotificadas.has(alerta.id)) {
                    return false;
                }
                
                // Verificar si está cerca (si tiene coordenadas)
                if (alerta.latitud && alerta.longitud) {
                    const distancia = this.calcularDistancia(
                        this.ubicacionUsuario.lat,
                        this.ubicacionUsuario.lng,
                        alerta.latitud,
                        alerta.longitud
                    );
                    return distancia <= this.radioCercania;
                }
                
                // Si no tiene coordenadas, verificar por ciudad/provincia
                if (alerta.ciudad && alerta.provincia) {
                    // Obtener coordenadas aproximadas de la ciudad
                    const coordenadasCiudad = await this.obtenerCoordenadasCiudad(alerta.ciudad, alerta.provincia);
                    if (coordenadasCiudad) {
                        const distancia = this.calcularDistancia(
                            this.ubicacionUsuario.lat,
                            this.ubicacionUsuario.lng,
                            coordenadasCiudad.lat,
                            coordenadasCiudad.lng
                        );
                        return distancia <= this.radioCercania;
                    }
                }
                
                return false;
            });
            
            // Notificar alertas cercanas
            for (const alerta of alertasCercanas) {
                await this.notificarAlerta(alerta);
                this.alertasNotificadas.add(alerta.id);
            }
            
        } catch (error) {
            console.error('❌ Error verificando alertas cercanas:', error);
        }
    }
    
    // Verificar una alerta específica
    async verificarAlertaEspecifica(alerta) {
        if (!this.ubicacionUsuario) return;
        
        // Solo alertas de tipo "corte", "cambio-recorrido" o "tardanza" (NO "aumento")
        if (alerta.tipo_alerta !== 'corte' && 
            alerta.tipo_alerta !== 'cambio-recorrido' && 
            alerta.tipo_alerta !== 'tardanza') {
            return;
        }
        
        // Verificar si ya fue notificada
        if (this.alertasNotificadas.has(alerta.id)) {
            return;
        }
        
        let estaCerca = false;
        
        // Verificar si está cerca (si tiene coordenadas)
        if (alerta.latitud && alerta.longitud) {
            const distancia = this.calcularDistancia(
                this.ubicacionUsuario.lat,
                this.ubicacionUsuario.lng,
                alerta.latitud,
                alerta.longitud
            );
            estaCerca = distancia <= this.radioCercania;
        } else if (alerta.ciudad && alerta.provincia) {
            // Obtener coordenadas aproximadas de la ciudad
            const coordenadasCiudad = await this.obtenerCoordenadasCiudad(alerta.ciudad, alerta.provincia);
            if (coordenadasCiudad) {
                const distancia = this.calcularDistancia(
                    this.ubicacionUsuario.lat,
                    this.ubicacionUsuario.lng,
                    coordenadasCiudad.lat,
                    coordenadasCiudad.lng
                );
                estaCerca = distancia <= this.radioCercania;
            }
        }
        
        if (estaCerca) {
            await this.notificarAlerta(alerta);
            this.alertasNotificadas.add(alerta.id);
        }
    }
    
    // Notificar una alerta (push + email)
    async notificarAlerta(alerta) {
        const tiposAlerta = {
            'corte': { nombre: 'Corte de Servicio', icono: '🚫' },
            'cambio-recorrido': { nombre: 'Cambio de Recorrido', icono: '🔄' },
            'tardanza': { nombre: 'Tardanza / Demora', icono: '⏰' }
        };
        
        const tipoInfo = tiposAlerta[alerta.tipo_alerta] || { nombre: 'Alerta', icono: '🚌' };
        const tipoAlerta = tipoInfo.nombre;
        const icono = tipoInfo.icono;
        const medio = this.getMedioTransporte(alerta.medio_transporte);
        const ubicacion = `${alerta.ciudad || ''}, ${alerta.provincia || ''}`;
        
        // Notificación push
        if (this.permisosNotificacion) {
            this.enviarNotificacionPush({
                titulo: `${icono} Alerta de Transporte`,
                mensaje: `${tipoAlerta} en ${medio} - ${ubicacion}`,
                icono: '/assets/logo/logo-cresalia.png',
                tag: `transporte-${alerta.id}`,
                data: {
                    tipo: 'alerta-transporte',
                    alertaId: alerta.id,
                    url: `/comunidades/transporte-publico/`
                }
            });
        }
        
        // Email
        if (this.emailUsuario) {
            await this.enviarEmailAlerta(alerta, tipoAlerta, medio, ubicacion);
        }
    }
    
    // Enviar notificación push
    enviarNotificacionPush(opciones) {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }
        
        try {
            const notificacion = new Notification(opciones.titulo, {
                body: opciones.mensaje,
                icon: opciones.icono || '/favicon.ico',
                badge: '/assets/logo/logo-cresalia.png',
                tag: opciones.tag,
                data: opciones.data,
                requireInteraction: false,
                silent: false
            });
            
            notificacion.onclick = () => {
                window.focus();
                if (opciones.data && opciones.data.url) {
                    window.location.href = opciones.data.url;
                }
                notificacion.close();
            };
            
            // Cerrar automáticamente después de 10 segundos
            setTimeout(() => {
                notificacion.close();
            }, 10000);
            
            console.log('✅ Notificación push enviada:', opciones.titulo);
        } catch (error) {
            console.error('❌ Error enviando notificación push:', error);
        }
    }
    
    // Enviar email de alerta
    async enviarEmailAlerta(alerta, tipoAlerta, medio, ubicacion) {
        if (!this.emailUsuario) return;
        
        try {
            const asunto = `🚌 ${tipoAlerta} - ${medio} en ${ubicacion}`;
            const contenido = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563EB;">${tipoAlerta} de Transporte</h2>
                    <p>Hola,</p>
                    <p>Te informamos que hay una alerta de transporte cerca de tu ubicación:</p>
                    <div style="background: #F3F4F6; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p><strong>Tipo:</strong> ${tipoAlerta}</p>
                        <p><strong>Medio:</strong> ${medio}</p>
                        <p><strong>Ubicación:</strong> ${ubicacion}</p>
                        ${alerta.linea_ruta ? `<p><strong>Línea/Ruta:</strong> ${alerta.linea_ruta}</p>` : ''}
                        <p><strong>Descripción:</strong> ${alerta.descripcion || alerta.contenido || 'Sin descripción'}</p>
                    </div>
                    <p>Podés ver más detalles y actualizaciones en la comunidad de Transporte Público de Cresalia.</p>
                    <p style="margin-top: 30px;">
                        <a href="${window.location.origin}/comunidades/transporte-publico/" 
                           style="background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                            Ver Alertas
                        </a>
                    </p>
                    <p style="color: #6B7280; font-size: 0.9rem; margin-top: 30px;">
                        Esta notificación se envió porque hay una alerta cerca de tu ubicación. 
                        Si no querés recibir estas notificaciones, podés desactivarlas en la configuración.
                    </p>
                </div>
            `;
            
            // Usar sistema de emails automáticos si está disponible
            if (window.sistemaEmailsAutomaticos && typeof window.sistemaEmailsAutomaticos.enviarEmailConBrevo === 'function') {
                try {
                    const resultado = await window.sistemaEmailsAutomaticos.enviarEmailConBrevo(
                        this.emailUsuario,
                        'Usuario',
                        asunto,
                        contenido,
                        'alerta-transporte'
                    );
                    
                    console.log('✅ Email de alerta enviado exitosamente:', {
                        email: this.emailUsuario,
                        alertaId: alerta.id,
                        tipo: alerta.tipo_alerta,
                        resultado: resultado
                    });
                    
                    // Guardar log de envío
                    this.guardarLogEmail({
                        email: this.emailUsuario,
                        tipo: 'alerta-transporte',
                        alertaId: alerta.id,
                        fecha: new Date().toISOString(),
                        estado: 'enviado',
                        resultado: resultado
                    });
                } catch (error) {
                    console.error('❌ Error al enviar email:', error);
                    
                    // Guardar log de error
                    this.guardarLogEmail({
                        email: this.emailUsuario,
                        tipo: 'alerta-transporte',
                        alertaId: alerta.id,
                        fecha: new Date().toISOString(),
                        estado: 'error',
                        error: error.message
                    });
                }
            } else {
                console.warn('⚠️ Sistema de emails no disponible');
            }
        } catch (error) {
            console.error('❌ Error enviando email de alerta:', error);
        }
    }
    
    // Obtener coordenadas de una ciudad (usando geocodificación)
    async obtenerCoordenadasCiudad(ciudad, provincia) {
        // Intentar desde localStorage primero
        const cacheKey = `coordenadas_${ciudad}_${provincia}`;
        const cache = localStorage.getItem(cacheKey);
        if (cache) {
            try {
                const coordenadas = JSON.parse(cache);
                // Verificar que no sea muy antiguo (más de 30 días)
                if (Date.now() - coordenadas.timestamp < 30 * 24 * 60 * 60 * 1000) {
                    return { lat: coordenadas.lat, lng: coordenadas.lng };
                }
            } catch (error) {
                // Ignorar error de parse
            }
        }
        
        // Si no hay cache, usar geocodificación (requiere API externa)
        // Por ahora, retornar null y usar solo alertas con coordenadas explícitas
        // En el futuro se puede integrar con Google Maps Geocoding API o similar
        return null;
    }
    
    // Calcular distancia entre dos puntos (fórmula de Haversine)
    calcularDistancia(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    // Obtener nombre del medio de transporte
    getMedioTransporte(medio) {
        const medios = {
            'colectivo': 'Colectivo',
            'tren': 'Tren',
            'subte': 'Subte',
            'trolebus': 'Trolebús',
            'otro': 'Transporte'
        };
        return medios[medio] || 'Transporte';
    }
    
    // Guardar log de envío de email
    guardarLogEmail(logData) {
        try {
            const logs = JSON.parse(localStorage.getItem('cresalia_logs_emails') || '[]');
            logs.unshift(logData);
            
            // Mantener solo los últimos 50 logs
            if (logs.length > 50) {
                logs.pop();
            }
            
            localStorage.setItem('cresalia_logs_emails', JSON.stringify(logs));
        } catch (error) {
            console.warn('⚠️ Error guardando log de email:', error);
        }
    }
    
    // Obtener logs de emails
    obtenerLogsEmails() {
        try {
            return JSON.parse(localStorage.getItem('cresalia_logs_emails') || '[]');
        } catch (error) {
            return [];
        }
    }
}

// La inicialización se hace manualmente desde el HTML para mejor control
// Ver comunidades/transporte-publico/index.html

