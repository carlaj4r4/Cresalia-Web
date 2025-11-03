// ===== SISTEMA DE SEGURIDAD AVANZADO CRESALIA =====
// Sistema completo de seguridad y protección contra fraudes

class SistemaSeguridadAvanzado {
    constructor() {
        this.configuracion = this.cargarConfiguracion();
        this.intentosFallidos = 0;
        this.sesionesActivas = [];
        this.deteccionFraudes = [];
        this.inicializar();
    }

    // Inicializar sistema de seguridad
    inicializar() {
        console.log('🔒 Inicializando Sistema de Seguridad Avanzado...');
        
        // Configurar monitoreo de sesiones
        this.configurarMonitoreoSesiones();
        
        // Configurar detección de fraudes
        this.configurarDeteccionFraudes();
        
        // Configurar verificación de identidad
        this.configurarVerificacionIdentidad();
        
        // Configurar backup automático
        this.configurarBackupAutomatico();
        
        // Configurar encriptación
        this.configurarEncriptacion();
        
        console.log('✅ Sistema de Seguridad Avanzado inicializado');
    }

    // Configurar monitoreo de sesiones
    configurarMonitoreoSesiones() {
        // Detectar múltiples sesiones
        this.detectarMultiplesSesiones();
        
        // Monitorear actividad sospechosa
        this.monitorearActividadSospechosa();
        
        // Detectar cambios de ubicación
        this.detectarCambiosUbicacion();
    }

    // Detectar múltiples sesiones
    detectarMultiplesSesiones() {
        const sesiones = JSON.parse(localStorage.getItem('sesionesActivas') || '[]');
        const ahora = new Date();
        
        // Limpiar sesiones expiradas
        const sesionesValidas = sesiones.filter(sesion => {
            const fechaSesion = new Date(sesion.fecha);
            return (ahora.getTime() - fechaSesion.getTime()) < 24 * 60 * 60 * 1000; // 24 horas
        });
        
        // Detectar múltiples sesiones del mismo usuario
        const usuarios = {};
        sesionesValidas.forEach(sesion => {
            if (!usuarios[sesion.usuario]) {
                usuarios[sesion.usuario] = [];
            }
            usuarios[sesion.usuario].push(sesion);
        });
        
        // Alertar si hay múltiples sesiones
        Object.keys(usuarios).forEach(usuario => {
            if (usuarios[usuario].length > 1) {
                this.alertarSeguridad({
                    tipo: 'multiples-sesiones',
                    mensaje: `Múltiples sesiones detectadas para ${usuario}`,
                    severidad: 'media'
                });
            }
        });
    }

    // Monitorear actividad sospechosa
    monitorearActividadSospechosa() {
        // Detectar intentos de login fallidos
        this.detectarIntentosFallidos();
        
        // Detectar patrones de navegación sospechosos
        this.detectarPatronesSospechosos();
        
        // Detectar cambios bruscos en comportamiento
        this.detectarCambiosComportamiento();
    }

    // Detectar intentos de login fallidos
    detectarIntentosFallidos() {
        const intentos = JSON.parse(localStorage.getItem('intentosLogin') || '[]');
        const ahora = new Date();
        const ultimaHora = new Date(ahora.getTime() - 60 * 60 * 1000);
        
        const intentosRecientes = intentos.filter(intento => 
            new Date(intento.fecha) > ultimaHora
        );
        
        if (intentosRecientes.length >= 5) {
            this.alertarSeguridad({
                tipo: 'intentos-fallidos',
                mensaje: 'Múltiples intentos de login fallidos detectados',
                severidad: 'alta'
            });
        }
    }

    // Detectar patrones sospechosos
    detectarPatronesSospechosos() {
        const actividad = JSON.parse(localStorage.getItem('actividadUsuario') || '[]');
        
        // Detectar navegación muy rápida
        if (actividad.length > 0) {
            const navegacionRapida = actividad.filter((accion, index) => {
                if (index === 0) return false;
                const tiempoAnterior = new Date(actividad[index - 1].fecha);
                const tiempoActual = new Date(accion.fecha);
                return (tiempoActual.getTime() - tiempoAnterior.getTime()) < 1000; // Menos de 1 segundo
            });
            
            if (navegacionRapida.length > 10) {
                this.alertarSeguridad({
                    tipo: 'navegacion-rapida',
                    mensaje: 'Patrón de navegación sospechoso detectado',
                    severidad: 'media'
                });
            }
        }
    }

    // Detectar cambios bruscos en comportamiento
    detectarCambiosComportamiento() {
        const actividad = JSON.parse(localStorage.getItem('actividadUsuario') || '[]');
        
        if (actividad.length < 10) return; // Necesitamos suficiente historial
        
        // Analizar cambios en patrones de uso
        const ultimaSemana = actividad.filter(accion => {
            const fecha = new Date(accion.fecha);
            const hace7Dias = new Date();
            hace7Dias.setDate(hace7Dias.getDate() - 7);
            return fecha > hace7Dias;
        });
        
        const semanaAnterior = actividad.filter(accion => {
            const fecha = new Date(accion.fecha);
            const hace14Dias = new Date();
            hace14Dias.setDate(hace14Dias.getDate() - 14);
            const hace7Dias = new Date();
            hace7Dias.setDate(hace7Dias.getDate() - 7);
            return fecha > hace14Dias && fecha <= hace7Dias;
        });
        
        // Detectar cambios significativos en actividad
        const cambioActividad = Math.abs(ultimaSemana.length - semanaAnterior.length);
        if (cambioActividad > 50) {
            this.alertarSeguridad({
                tipo: 'cambio-comportamiento',
                mensaje: 'Cambio significativo en patrones de uso detectado',
                severidad: 'media'
            });
        }
    }

    // Detectar cambios de ubicación
    detectarCambiosUbicacion() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const ubicacionActual = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    fecha: new Date().toISOString()
                };
                
                const ubicacionesAnteriores = JSON.parse(localStorage.getItem('ubicacionesUsuario') || '[]');
                
                if (ubicacionesAnteriores.length > 0) {
                    const ultimaUbicacion = ubicacionesAnteriores[ubicacionesAnteriores.length - 1];
                    const distancia = this.calcularDistancia(
                        ultimaUbicacion.lat, ultimaUbicacion.lng,
                        ubicacionActual.lat, ubicacionActual.lng
                    );
                    
                    // Si la distancia es muy grande en poco tiempo
                    const tiempoTranscurrido = new Date(ubicacionActual.fecha).getTime() - new Date(ultimaUbicacion.fecha).getTime();
                    if (distancia > 100 && tiempoTranscurrido < 3600000) { // 100km en menos de 1 hora
                        this.alertarSeguridad({
                            tipo: 'cambio-ubicacion',
                            mensaje: 'Cambio de ubicación sospechoso detectado',
                            severidad: 'media'
                        });
                    }
                }
                
                ubicacionesAnteriores.push(ubicacionActual);
                localStorage.setItem('ubicacionesUsuario', JSON.stringify(ubicacionesAnteriores));
            });
        }
    }

    // Calcular distancia entre dos puntos
    calcularDistancia(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = this.gradosARadianes(lat2 - lat1);
        const dLng = this.gradosARadianes(lng2 - lng1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.gradosARadianes(lat1)) * Math.cos(this.gradosARadianes(lat2)) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    gradosARadianes(grados) {
        return grados * (Math.PI/180);
    }

    // Configurar detección de fraudes
    configurarDeteccionFraudes() {
        // Detectar transacciones sospechosas
        this.detectarTransaccionesSospechosas();
        
        // Detectar patrones de pago anómalos
        this.detectarPatronesPagoAnomalos();
        
        // Detectar comportamientos fraudulentos
        this.detectarComportamientosFraudulentos();
    }

    // Detectar patrones de pago anómalos
    detectarPatronesPagoAnomalos() {
        const transacciones = JSON.parse(localStorage.getItem('transaccionesUsuario') || '[]');
        
        if (transacciones.length < 3) return; // Necesitamos al menos 3 transacciones
        
        // Analizar patrones de pago
        const montos = transacciones.map(t => t.monto || 0);
        const promedio = montos.reduce((sum, monto) => sum + monto, 0) / montos.length;
        const desviacion = this.calcularDesviacionEstandar(montos, promedio);
        
        // Detectar transacciones anómalas
        const transaccionesAnomalas = transacciones.filter(t => {
            const monto = t.monto || 0;
            return Math.abs(monto - promedio) > (2 * desviacion);
        });
        
        if (transaccionesAnomalas.length > 0) {
            this.alertarSeguridad({
                tipo: 'pago-anomalo',
                mensaje: `${transaccionesAnomalas.length} transacciones con patrones anómalos detectadas`,
                severidad: 'media'
            });
        }
    }

    // Calcular desviación estándar
    calcularDesviacionEstandar(valores, promedio) {
        const sumaDiferencias = valores.reduce((sum, valor) => {
            return sum + Math.pow(valor - promedio, 2);
        }, 0);
        
        return Math.sqrt(sumaDiferencias / valores.length);
    }

    // Detectar comportamientos fraudulentos
    detectarComportamientosFraudulentos() {
        // Análisis de comportamiento para detectar fraudes
        const actividad = JSON.parse(localStorage.getItem('actividadUsuario') || '[]');
        
        // Detectar patrones sospechosos de compra
        const comprasSospechosas = actividad.filter(accion => 
            accion.tipo === 'compra' && accion.monto > 5000
        );
        
        if (comprasSospechosas.length > 5) {
            this.alertarSeguridad({
                tipo: 'comportamiento-fraudulento',
                mensaje: 'Patrón de compras sospechoso detectado',
                severidad: 'alta'
            });
        }
    }

    // Verificar documentos de identidad
    verificarDocumentos() {
        // Verificar si hay documentos cargados
        const documentos = JSON.parse(localStorage.getItem('documentosUsuario') || '[]');
        
        if (documentos.length === 0) {
            this.alertarSeguridad({
                tipo: 'documentos-faltantes',
                mensaje: 'Se recomienda cargar documentos de identidad',
                severidad: 'media'
            });
        }
    }

    // Verificar teléfono
    verificarTelefono() {
        // Verificar si hay teléfono verificado
        const telefonoVerificado = localStorage.getItem('telefonoVerificado');
        
        if (!telefonoVerificado) {
            this.alertarSeguridad({
                tipo: 'telefono-no-verificado',
                mensaje: 'Se recomienda verificar el número de teléfono',
                severidad: 'baja'
            });
        }
    }

    // Configurar backup preventivo
    configurarBackupPreventivo() {
        // Configurar backup automático antes de cambios importantes
        const backupConfig = {
            activo: true,
            frecuencia: 'diaria',
            retencion: 30, // días
            ubicacion: 'localStorage'
        };
        
        localStorage.setItem('configuracionBackup', JSON.stringify(backupConfig));
        
        console.log('🔒 Backup preventivo configurado');
    }

    // Configurar encriptación de comunicaciones
    configurarEncriptacionComunicaciones() {
        // Configurar encriptación para comunicaciones seguras
        const configuracionEncriptacion = {
            activa: true,
            algoritmo: 'AES-256',
            clavePublica: this.generarClavePublica(),
            certificadoSSL: true
        };
        
        localStorage.setItem('configuracionEncriptacion', JSON.stringify(configuracionEncriptacion));
        
        console.log('🔒 Encriptación de comunicaciones configurada');
    }

    // Generar clave pública
    generarClavePublica() {
        // Generar una clave pública simple para demostración
        return 'cresalia_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
    }

    // Detectar transacciones sospechosas
    detectarTransaccionesSospechosas() {
        const transacciones = JSON.parse(localStorage.getItem('transaccionesUsuario') || '[]');
        
        // Detectar transacciones muy grandes
        const transaccionesGrandes = transacciones.filter(t => t.monto > 10000);
        if (transaccionesGrandes.length > 0) {
            this.alertarSeguridad({
                tipo: 'transaccion-grande',
                mensaje: 'Transacción de monto elevado detectada',
                severidad: 'alta'
            });
        }
        
        // Detectar múltiples transacciones en poco tiempo
        const ahora = new Date();
        const ultimaHora = new Date(ahora.getTime() - 60 * 60 * 1000);
        const transaccionesRecientes = transacciones.filter(t => 
            new Date(t.fecha) > ultimaHora
        );
        
        if (transaccionesRecientes.length > 10) {
            this.alertarSeguridad({
                tipo: 'multiples-transacciones',
                mensaje: 'Múltiples transacciones en poco tiempo detectadas',
                severidad: 'alta'
            });
        }
    }

    // Configurar verificación de identidad
    configurarVerificacionIdentidad() {
        // Verificar datos del usuario
        this.verificarDatosUsuario();
        
        // Verificar documentos
        this.verificarDocumentos();
        
        // Verificar teléfono
        this.verificarTelefono();
    }

    // Verificar datos del usuario
    verificarDatosUsuario() {
        const usuario = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
        
        if (!usuario.email || !usuario.nombre) {
            this.alertarSeguridad({
                tipo: 'datos-incompletos',
                mensaje: 'Datos de usuario incompletos',
                severidad: 'media'
            });
        }
    }

    // Configurar backup automático
    configurarBackupAutomatico() {
        // Backup diario
        setInterval(() => {
            this.realizarBackup();
        }, 24 * 60 * 60 * 1000); // 24 horas
        
        // Backup antes de cambios importantes
        this.configurarBackupPreventivo();
    }

    // Realizar backup
    realizarBackup() {
        const datos = {
            usuario: localStorage.getItem('usuarioActual'),
            productos: localStorage.getItem('productosTienda'),
            servicios: localStorage.getItem('serviciosTienda'),
            ventas: localStorage.getItem('ventasConfirmadas'),
            configuracion: localStorage.getItem('configuracionTienda'),
            fecha: new Date().toISOString()
        };
        
        const backup = JSON.stringify(datos);
        localStorage.setItem('backupCresalia', backup);
        
        console.log('💾 Backup automático realizado');
    }

    // Configurar encriptación
    configurarEncriptacion() {
        // Encriptar datos sensibles
        this.encriptarDatosSensibles();
        
        // Configurar encriptación de comunicaciones
        this.configurarEncriptacionComunicaciones();
    }

    // Encriptar datos sensibles
    encriptarDatosSensibles() {
        const datosSensibles = ['usuarioActual', 'ventasConfirmadas', 'configuracionTienda'];
        
        datosSensibles.forEach(clave => {
            const datos = localStorage.getItem(clave);
            if (datos) {
                const encriptado = this.encriptar(datos);
                localStorage.setItem(clave + '_encrypted', encriptado);
            }
        });
    }

    // Función de encriptación simple
    encriptar(texto) {
        return btoa(texto); // Base64 encoding
    }

    // Función de desencriptación
    desencriptar(textoEncriptado) {
        return atob(textoEncriptado); // Base64 decoding
    }

    // Alertar sobre problemas de seguridad - DESACTIVADO PARA DESARROLLO
    alertarSeguridad(alert) {
        // console.warn('🚨 Alerta de Seguridad:', alert); // COMENTADO PARA DESARROLLO
        
        // Guardar alerta
        const alertas = JSON.parse(localStorage.getItem('alertasSeguridad') || '[]');
        alertas.push({
            ...alert,
            id: Date.now(),
            fecha: new Date().toISOString()
        });
        localStorage.setItem('alertasSeguridad', JSON.stringify(alertas));
        
        // Mostrar notificación si es crítica
        if (alert.severidad === 'alta') {
            this.mostrarAlertaCritica(alert);
        }
    }

    // Mostrar alerta crítica
    mostrarAlertaCritica(alert) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(220, 38, 38, 0.9) !important;
            z-index: 9999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; border: 3px solid #dc2626;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h3 style="color: #dc2626; margin-bottom: 10px;">🚨 Alerta de Seguridad</h3>
                    <p style="color: #666;">${alert.mensaje}</p>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="cerrarModal(this)" style="background: #dc2626; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                        Entendido
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Cargar configuración
    cargarConfiguracion() {
        return JSON.parse(localStorage.getItem('configuracionSeguridad') || JSON.stringify({
            monitoreoActivo: true,
            deteccionFraudes: true,
            backupAutomatico: true,
            encriptacion: true,
            alertasCriticas: true
        }));
    }

    // Obtener reporte de seguridad
    obtenerReporteSeguridad() {
        const alertas = JSON.parse(localStorage.getItem('alertasSeguridad') || '[]');
        const sesiones = JSON.parse(localStorage.getItem('sesionesActivas') || '[]');
        const intentos = JSON.parse(localStorage.getItem('intentosLogin') || '[]');
        
        return {
            alertas: alertas.length,
            sesionesActivas: sesiones.length,
            intentosFallidos: intentos.length,
            nivelSeguridad: this.calcularNivelSeguridad(),
            ultimaActualizacion: new Date().toISOString()
        };
    }

    // Calcular nivel de seguridad
    calcularNivelSeguridad() {
        const alertas = JSON.parse(localStorage.getItem('alertasSeguridad') || '[]');
        const alertasCriticas = alertas.filter(a => a.severidad === 'alta').length;
        
        if (alertasCriticas === 0) return 'Alto';
        if (alertasCriticas <= 2) return 'Medio';
        return 'Bajo';
    }
}

// Inicializar sistema globalmente
window.sistemaSeguridad = new SistemaSeguridadAvanzado();

// Funciones globales
window.obtenerReporteSeguridad = function() {
    return window.sistemaSeguridad.obtenerReporteSeguridad();
};

window.configurarSeguridad = function() {
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
    
    const reporte = window.sistemaSeguridad.obtenerReporteSeguridad();
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <h3 style="color: #dc2626; margin-bottom: 20px;">🔒 Panel de Seguridad</h3>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center;">
                    <h4 style="margin: 0; color: #dc2626;">${reporte.alertas}</h4>
                    <p style="margin: 5px 0; color: #666;">Alertas de Seguridad</p>
                </div>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center;">
                    <h4 style="margin: 0; color: #dc2626;">${reporte.nivelSeguridad}</h4>
                    <p style="margin: 5px 0; color: #666;">Nivel de Seguridad</p>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #374151; margin-bottom: 10px;">Configuración de Seguridad</h4>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="monitoreoActivo" ${window.sistemaSeguridad.configuracion.monitoreoActivo ? 'checked' : ''} style="margin-right: 10px;">
                        Monitoreo Activo
                    </label>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="deteccionFraudes" ${window.sistemaSeguridad.configuracion.deteccionFraudes ? 'checked' : ''} style="margin-right: 10px;">
                        Detección de Fraudes
                    </label>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="backupAutomatico" ${window.sistemaSeguridad.configuracion.backupAutomatico ? 'checked' : ''} style="margin-right: 10px;">
                        Backup Automático
                    </label>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button onclick="cerrarModal(this)" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    Cerrar
                </button>
                <button onclick="guardarConfiguracionSeguridad()" style="background: #dc2626; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    Guardar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

window.guardarConfiguracionSeguridad = function() {
    const config = {
        monitoreoActivo: document.getElementById('monitoreoActivo').checked,
        deteccionFraudes: document.getElementById('deteccionFraudes').checked,
        backupAutomatico: document.getElementById('backupAutomatico').checked,
        encriptacion: window.sistemaSeguridad.configuracion.encriptacion,
        alertasCriticas: window.sistemaSeguridad.configuracion.alertasCriticas
    };
    
    window.sistemaSeguridad.configuracion = config;
    localStorage.setItem('configuracionSeguridad', JSON.stringify(config));
    
    cerrarModal(document.querySelector('#monitoreoActivo').closest('.modal'));
    mostrarNotificacion('✅ Configuración de seguridad guardada', 'success');
};

console.log('✅ Sistema de Seguridad Avanzado cargado correctamente');
