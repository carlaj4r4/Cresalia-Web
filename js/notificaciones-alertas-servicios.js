// ===== SISTEMA DE NOTIFICACIONES PARA ALERTAS DE SERVICIOS PÚBLICOS =====
// Notificaciones push y email cuando hay cortes de servicios cercanos al usuario
// Co-fundadores: Cresalia Team

class NotificacionesAlertasServicios {
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
        console.log('🔔 Inicializando sistema de notificaciones de servicios públicos...');
        
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
            
            console.log('✅ Sistema de notificaciones de servicios públicos inicializado');
        } else {
            console.log('ℹ️ Esperando permisos de notificación del usuario...');
        }
    }
    
    // Activar notificaciones (llamado desde el banner)
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
                const banner = document.getElementById('banner-permisos-notificaciones-servicios');
                if (banner) {
                    banner.style.animation = 'slideInUp 0.3s ease-out reverse';
                    setTimeout(() => banner.remove(), 300);
                }
                
                // Mostrar confirmación
                if (typeof mostrarNotificacion === 'function') {
                    mostrarNotificacion('🔔 Notificaciones activadas. Recibirás alertas sobre servicios cerca de ti.', 'success');
                } else {
                    alert('🔔 Notificaciones activadas. Recibirás alertas sobre servicios cerca de ti.');
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
        const bannerMostrado = sessionStorage.getItem('banner_notificaciones_servicios_mostrado');
        if (bannerMostrado === 'true') {
            return;
        }
        
        // Crear banner
        const banner = document.createElement('div');
        banner.id = 'banner-permisos-notificaciones-servicios';
        banner.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #059669, #047857);
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(5, 150, 105, 0.4);
            z-index: 10000;
            max-width: 350px;
            animation: slideInUp 0.3s ease-out;
        `;
        
        banner.innerHTML = `
            <div style="display: flex; align-items: start; gap: 15px;">
                <div style="font-size: 2rem;">🔔</div>
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 10px 0; font-size: 1.1rem; font-weight: 600;">
                        Recibe alertas de servicios
                    </h4>
                    <p style="margin: 0 0 15px 0; font-size: 0.9rem; line-height: 1.5; opacity: 0.95;">
                        Activa las notificaciones para recibir alertas sobre cortes de luz, agua y gas cerca de ti.
                    </p>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="window.notificacionesServicios?.activarNotificaciones()" style="
                            background: white;
                            color: #059669;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                            flex: 1;
                            font-size: 0.95rem;
                        ">Activar</button>
                        <button onclick="document.getElementById('banner-permisos-notificaciones-servicios')?.remove()" style="
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
                <button onclick="document.getElementById('banner-permisos-notificaciones-servicios')?.remove()" style="
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
        
        document.body.appendChild(banner);
        sessionStorage.setItem('banner_notificaciones_servicios_mostrado', 'true');
        
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
                const banner = document.getElementById('banner-permisos-notificaciones-servicios');
                if (banner) {
                    banner.style.animation = 'slideInUp 0.3s ease-out reverse';
                    setTimeout(() => banner.remove(), 300);
                }
                
                // Mostrar confirmación
                if (typeof mostrarNotificacion === 'function') {
                    mostrarNotificacion('🔔 Notificaciones activadas. Recibirás alertas sobre servicios cerca de ti.', 'success');
                } else {
                    alert('🔔 Notificaciones activadas. Recibirás alertas sobre servicios cerca de ti.');
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
                    
                    localStorage.setItem('cresalia_ubicacion_servicios', JSON.stringify(this.ubicacionUsuario));
                    console.log('✅ Ubicación obtenida:', this.ubicacionUsuario);
                } catch (error) {
                    console.warn('⚠️ Error al obtener ubicación:', error);
                    this.cargarUbicacionGuardada();
                }
            } else {
                console.log('ℹ️ Usuario denegó permiso de ubicación anteriormente');
                this.cargarUbicacionGuardada();
            }
        }
    }
    
    cargarUbicacionGuardada() {
        const ubicacionGuardada = localStorage.getItem('cresalia_ubicacion_servicios');
        if (ubicacionGuardada) {
            try {
                const ubicacion = JSON.parse(ubicacionGuardada);
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
    
    async obtenerUbicacion() {
        if (!('geolocation' in navigator) || !this.permisosUbicacion) {
            return;
        }
        
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                });
            });
            
            this.ubicacionUsuario = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                timestamp: Date.now()
            };
            
            localStorage.setItem('cresalia_ubicacion_servicios', JSON.stringify(this.ubicacionUsuario));
        } catch (error) {
            console.warn('⚠️ Error al obtener ubicación:', error);
        }
    }
    
    obtenerEmailUsuario() {
        const email = localStorage.getItem('cresalia_user_email') || 
                     localStorage.getItem('cresalia_servicios_email') ||
                     sessionStorage.getItem('cresalia_user_email') ||
                     localStorage.getItem('user_email');
        
        if (email) {
            this.emailUsuario = email;
            console.log('✅ Email del usuario obtenido:', this.emailUsuario);
        }
        
        const emailInput = document.getElementById('email-notificaciones');
        if (emailInput && emailInput.value.trim()) {
            const emailIngresado = emailInput.value.trim();
            this.emailUsuario = emailIngresado;
            localStorage.setItem('cresalia_user_email', emailIngresado);
            localStorage.setItem('cresalia_servicios_email', emailIngresado);
            console.log('✅ Email del usuario obtenido del formulario:', this.emailUsuario);
        }
    }
    
    iniciarVerificacionPeriodica() {
        this.verificarAlertasCercanas();
        
        setInterval(() => {
            this.verificarAlertasCercanas();
        }, this.intervaloVerificacion);
        
        setInterval(() => {
            this.obtenerUbicacion();
        }, 15 * 60 * 1000);
    }
    
    escucharNuevasAlertas() {
        if (window.alertasServiciosPublicos) {
            const originalReportar = window.alertasServiciosPublicos.reportarCorte;
            if (originalReportar) {
                window.alertasServiciosPublicos.reportarCorte = async (...args) => {
                    const resultado = await originalReportar.apply(window.alertasServiciosPublicos, args);
                    
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
    
    async verificarAlertasCercanas() {
        if (!this.ubicacionUsuario) {
            return;
        }
        
        try {
            let alertas = [];
            
            if (window.alertasServiciosPublicos && window.alertasServiciosPublicos.supabase) {
                const { data, error } = await window.alertasServiciosPublicos.supabase
                    .from('alertas_servicios_publicos')
                    .select('*')
                    .in('estado', ['no-solucionado', 'en-curso'])
                    .order('fecha_reporte', { ascending: false })
                    .limit(100);
                
                if (!error && data) {
                    alertas = data;
                }
            }
            
            const alertasCercanas = alertas.filter(alerta => {
                if (this.alertasNotificadas.has(alerta.id)) {
                    return false;
                }
                
                if (alerta.latitud && alerta.longitud) {
                    const distancia = this.calcularDistancia(
                        this.ubicacionUsuario.lat,
                        this.ubicacionUsuario.lng,
                        alerta.latitud,
                        alerta.longitud
                    );
                    return distancia <= this.radioCercania;
                }
                
                if (alerta.ciudad && alerta.provincia) {
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
            
            for (const alerta of alertasCercanas) {
                await this.notificarAlerta(alerta);
                this.alertasNotificadas.add(alerta.id);
            }
            
        } catch (error) {
            console.error('❌ Error verificando alertas cercanas:', error);
        }
    }
    
    async verificarAlertaEspecifica(alerta) {
        if (!this.ubicacionUsuario) return;
        
        if (this.alertasNotificadas.has(alerta.id)) {
            return;
        }
        
        let estaCerca = false;
        
        if (alerta.latitud && alerta.longitud) {
            const distancia = this.calcularDistancia(
                this.ubicacionUsuario.lat,
                this.ubicacionUsuario.lng,
                alerta.latitud,
                alerta.longitud
            );
            estaCerca = distancia <= this.radioCercania;
        } else if (alerta.ciudad && alerta.provincia) {
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
    
    async notificarAlerta(alerta) {
        const servicios = {
            'luz': { nombre: 'Luz / Electricidad', icono: '⚡' },
            'agua': { nombre: 'Agua', icono: '💧' },
            'gas': { nombre: 'Gas', icono: '🔥' },
            'otro': { nombre: 'Servicio', icono: '⚙️' }
        };
        
        const servicioInfo = servicios[alerta.tipo_servicio] || servicios['otro'];
        const ubicacion = `${alerta.ciudad || ''}, ${alerta.provincia || ''}`;
        
        if (this.permisosNotificacion) {
            this.enviarNotificacionPush({
                titulo: `${servicioInfo.icono} Corte de ${servicioInfo.nombre}`,
                mensaje: `Corte reportado en ${ubicacion}`,
                icono: '/assets/logo/logo-cresalia.png',
                tag: `servicios-${alerta.id}`,
                data: {
                    tipo: 'alerta-servicios',
                    alertaId: alerta.id,
                    url: `/comunidades/alertas-servicios-publicos/`
                }
            });
        }
        
        if (this.emailUsuario) {
            await this.enviarEmailAlerta(alerta, servicioInfo, ubicacion);
        }
    }
    
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
            
            setTimeout(() => {
                notificacion.close();
            }, 10000);
            
            console.log('✅ Notificación push enviada:', opciones.titulo);
        } catch (error) {
            console.error('❌ Error enviando notificación push:', error);
        }
    }
    
    async enviarEmailAlerta(alerta, servicioInfo, ubicacion) {
        if (!this.emailUsuario) return;
        
        try {
            const asunto = `${servicioInfo.icono} Corte de ${servicioInfo.nombre} - ${ubicacion}`;
            const contenido = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #059669;">Corte de ${servicioInfo.nombre}</h2>
                    <p>Hola,</p>
                    <p>Te informamos que hay un corte de servicio cerca de tu ubicación:</p>
                    <div style="background: #F3F4F6; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p><strong>Tipo:</strong> ${servicioInfo.nombre}</p>
                        <p><strong>Ubicación:</strong> ${ubicacion}</p>
                        ${alerta.direccion ? `<p><strong>Zona:</strong> ${alerta.direccion}</p>` : ''}
                        <p><strong>Urgencia:</strong> ${alerta.urgencia || 'No especificada'}</p>
                        <p><strong>Descripción:</strong> ${alerta.descripcion || 'Sin descripción'}</p>
                    </div>
                    <p>Podés ver más detalles y actualizaciones en la comunidad de Alertas de Servicios Públicos de Cresalia.</p>
                    <p style="margin-top: 30px;">
                        <a href="${window.location.origin}/comunidades/alertas-servicios-publicos/" 
                           style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                            Ver Alertas
                        </a>
                    </p>
                    <p style="color: #6B7280; font-size: 0.9rem; margin-top: 30px;">
                        Esta notificación se envió porque hay un corte cerca de tu ubicación. 
                        Si no querés recibir estas notificaciones, podés desactivarlas en la configuración.
                    </p>
                </div>
            `;
            
            if (window.sistemaEmailsAutomaticos && typeof window.sistemaEmailsAutomaticos.enviarEmailConBrevo === 'function') {
                try {
                    const resultado = await window.sistemaEmailsAutomaticos.enviarEmailConBrevo(
                        this.emailUsuario,
                        'Usuario',
                        asunto,
                        contenido,
                        'alerta-servicios'
                    );
                    
                    console.log('✅ Email de alerta enviado exitosamente:', {
                        email: this.emailUsuario,
                        alertaId: alerta.id,
                        tipo: alerta.tipo_servicio,
                        resultado: resultado
                    });
                    
                    // Guardar log de envío
                    this.guardarLogEmail({
                        email: this.emailUsuario,
                        tipo: 'alerta-servicios',
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
                        tipo: 'alerta-servicios',
                        alertaId: alerta.id,
                        fecha: new Date().toISOString(),
                        estado: 'error',
                        error: error.message
                    });
                }
            }
        } catch (error) {
            console.error('❌ Error enviando email de alerta:', error);
        }
    }
    
    async obtenerCoordenadasCiudad(ciudad, provincia) {
        const cacheKey = `coordenadas_${ciudad}_${provincia}`;
        const cache = localStorage.getItem(cacheKey);
        if (cache) {
            try {
                const coordenadas = JSON.parse(cache);
                if (Date.now() - coordenadas.timestamp < 30 * 24 * 60 * 60 * 1000) {
                    return { lat: coordenadas.lat, lng: coordenadas.lng };
                }
            } catch (error) {
                // Ignorar
            }
        }
        return null;
    }
    
    calcularDistancia(lat1, lng1, lat2, lng2) {
        const R = 6371;
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
// Ver comunidades/alertas-servicios-publicos/index.html

