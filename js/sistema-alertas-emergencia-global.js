// ===== SISTEMA DE ALERTAS DE EMERGENCIA GLOBAL - CRESALIA =====
// Sistema integrado en todo el ecosistema Cresalia

class SistemaAlertasEmergenciaGlobal {
    constructor() {
        this.alertas = [];
        this.reportes = [];
        this.donaciones = [];
        this.verificacion = new VerificacionAntiFraude();
        this.notificaciones = {
            mostrar: (mensaje, tipo = 'info') => {
                console.log(`🚨 ALERTA: ${mensaje} (${tipo})`);
                // Implementación básica de notificaciones
                if (typeof mostrarNotificacion === 'function') {
                    mostrarNotificacion(mensaje, tipo);
                }
            }
        };
        this.inicializar();
    }
    
    inicializar() {
        console.log('🚨 Sistema de Alertas de Emergencia Global inicializado');
        this.configurarEventos();
        this.configurarNotificaciones();
        this.cargarAlertasActivas();
    }
    
    configurarEventos() {
        // Eventos globales de emergencia
        window.addEventListener('emergencia:reportar', (e) => this.manejarReporteEmergencia(e));
        window.addEventListener('emergencia:donar', (e) => this.manejarDonacionEmergencia(e));
        window.addEventListener('emergencia:verificar', (e) => this.verificarAlerta(e));
        
        // Eventos de geolocalización
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => this.obtenerUbicacionActual(pos),
                (err) => this.manejarErrorGeolocalizacion(err)
            );
        }
    }
    
    configurarNotificaciones() {
        // Solicitar permisos de notificación
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('✅ Permisos de notificación concedidos');
                }
            });
        }
    }
    
    cargarAlertasActivas() {
        // Cargar alertas activas desde localStorage
        const alertasGuardadas = JSON.parse(localStorage.getItem('alertas_emergencia') || '[]');
        this.alertas = alertasGuardadas.filter(alerta => alerta.activa);
        
        // Mostrar alertas activas
        this.mostrarAlertasActivas();
    }
    
    // ===== CREAR ALERTA DE EMERGENCIA =====
    crearAlerta(tipo, ubicacion, severidad, descripcion, evidencia = null) {
        const alerta = {
            id: Date.now(),
            tipo,
            ubicacion,
            severidad,
            descripcion,
            evidencia,
            fecha: new Date().toISOString(),
            verificada: false,
            activa: true,
            reportes: [],
            donaciones: []
        };
        
        this.alertas.push(alerta);
        this.guardarAlertas();
        this.notificarUsuarios(alerta);
        this.mostrarAlertaEmergencia(alerta);
        
        return alerta;
    }
    
    // ===== REPORTAR EMERGENCIA =====
    reportarEmergencia(usuario, tipo, ubicacion, descripcion, evidencia = null) {
        const reporte = {
            id: Date.now(),
            usuario,
            tipo,
            ubicacion,
            descripcion,
            evidencia,
            fecha: new Date().toISOString(),
            verificada: false,
            confianza: 0
        };
        
        // Verificar reporte
        const esValido = this.verificacion.verificarReporte(reporte);
        
        if (esValido) {
            this.reportes.push(reporte);
            this.guardarReportes();
            
            // Crear alerta si es necesario
            this.crearAlerta(tipo, ubicacion, 'media', descripcion, evidencia);
            
            this.mostrarNotificacion('✅ Reporte de emergencia enviado correctamente', 'success');
        } else {
            this.mostrarNotificacion('❌ Reporte no verificado. Intenta nuevamente.', 'error');
        }
        
        return reporte;
    }
    
    // ===== NOTIFICAR USUARIOS =====
    notificarUsuarios(alerta) {
        // Notificación push
        this.enviarNotificacionPush(alerta);
        
        // Email de emergencia
        this.enviarEmailEmergencia(alerta);
        
        // WhatsApp (si está habilitado)
        this.enviarWhatsAppEmergencia(alerta);
        
        // Notificación en la interfaz
        this.mostrarAlertaEmergencia(alerta);
    }
    
    enviarNotificacionPush(alerta) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notificacion = new Notification(`🚨 Alerta de Emergencia - ${alerta.tipo}`, {
                body: alerta.descripcion,
                icon: '/assets/logo/logo-cresalia.png',
                badge: '/assets/logo/logo-cresalia.png',
                tag: `emergencia-${alerta.id}`,
                requireInteraction: true,
                actions: [
                    { action: 'ver', title: 'Ver Detalles' },
                    { action: 'donar', title: 'Donar' }
                ]
            });
            
            notificacion.onclick = () => {
                this.mostrarDetallesAlerta(alerta);
                notificacion.close();
            };
        }
    }
    
    enviarEmailEmergencia(alerta) {
        // Implementar envío de email de emergencia
        console.log('📧 Enviando email de emergencia:', alerta);
    }
    
    enviarWhatsAppEmergencia(alerta) {
        // Implementar envío de WhatsApp de emergencia
        console.log('📱 Enviando WhatsApp de emergencia:', alerta);
    }
    
    // ===== MOSTRAR ALERTA EN INTERFAZ =====
    mostrarAlertaEmergencia(alerta) {
        const alertaElement = document.createElement('div');
        alertaElement.id = `alerta-emergencia-${alerta.id}`;
        alertaElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.obtenerColorSeveridad(alerta.severidad)};
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.5s ease-out;
        `;
        
        alertaElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <div>
                    <h4 style="margin: 0; font-size: 1.1rem;">🚨 ${alerta.tipo.toUpperCase()}</h4>
                    <p style="margin: 5px 0 0; font-size: 0.9rem; opacity: 0.9;">${alerta.ubicacion.nombre || 'Ubicación no especificada'}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; padding: 0; margin-left: 10px;">
                    ×
                </button>
            </div>
            <p style="margin: 0 0 15px; font-size: 0.9rem; line-height: 1.4;">${alerta.descripcion}</p>
            <div style="display: flex; gap: 10px;">
                <button onclick="sistemaAlertas.mostrarDetallesAlerta(${JSON.stringify(alerta).replace(/"/g, '&quot;')})" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                    Ver Detalles
                </button>
                <button onclick="sistemaAlertas.abrirDonaciones(${alerta.id})" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                    Donar
                </button>
            </div>
        `;
        
        document.body.appendChild(alertaElement);
        
        // Auto-remover después de 30 segundos
        setTimeout(() => {
            if (alertaElement.parentNode) {
                alertaElement.remove();
            }
        }, 30000);
    }
    
    mostrarAlertasActivas() {
        this.alertas.forEach(alerta => {
            if (alerta.activa) {
                this.mostrarAlertaEmergencia(alerta);
            }
        });
    }
    
    // ===== MOSTRAR DETALLES DE ALERTA =====
    mostrarDetallesAlerta(alerta) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 16px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <h3 style="margin: 0; color: #1F2937;">🚨 Detalles de Emergencia</h3>
                    <button onclick="cerrarModalSeguro(this)" style="background: #6B7280; color: white; border: none; padding: 8px 12px; border-radius: 50%; cursor: pointer; font-size: 18px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                        ×
                    </button>
                </div>
                
                <div style="background: #F8FAFC; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px; color: #374151;">${alerta.tipo.toUpperCase()}</h4>
                    <p style="margin: 0 0 10px; color: #6B7280;">📍 ${alerta.ubicacion.nombre || 'Ubicación no especificada'}</p>
                    <p style="margin: 0; color: #6B7280;">⏰ ${new Date(alerta.fecha).toLocaleString('es-ES')}</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px; color: #374151;">Descripción</h4>
                    <p style="margin: 0; color: #6B7280; line-height: 1.6;">${alerta.descripcion}</p>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="sistemaAlertas.abrirDonaciones(${alerta.id})" style="background: #10B981; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        💰 Donar Ahora
                    </button>
                    <button onclick="sistemaAlertas.compartirAlerta(${alerta.id})" style="background: #8B5CF6; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        📤 Compartir
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar al hacer click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // ===== SISTEMA DE DONACIONES =====
    abrirDonaciones(alertaId) {
        const alerta = this.alertas.find(a => a.id === alertaId);
        if (!alerta) return;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10002;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 16px; max-width: 500px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <h3 style="margin: 0; color: #1F2937;">💰 Donar para Emergencia</h3>
                    <button onclick="cerrarModalSeguro(this)" style="background: #6B7280; color: white; border: none; padding: 8px 12px; border-radius: 50%; cursor: pointer; font-size: 18px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                        ×
                    </button>
                </div>
                
                <div style="background: #F8FAFC; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px; color: #374151;">${alerta.tipo.toUpperCase()}</h4>
                    <p style="margin: 0; color: #6B7280;">${alerta.descripcion}</p>
                </div>
                
                <form onsubmit="sistemaAlertas.procesarDonacion(event, ${alertaId})">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 600;">Monto de donación</label>
                        <input type="number" id="montoDonacion" placeholder="0.00" min="1" step="0.01" required style="width: 100%; padding: 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 1rem;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 600;">Método de pago</label>
                        <select id="metodoPago" required style="width: 100%; padding: 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 1rem;">
                            <option value="">Seleccionar método</option>
                            <option value="mercadopago">MercadoPago</option>
                            <option value="transferencia">Transferencia bancaria</option>
                            <option value="tarjeta">Tarjeta de crédito/débito</option>
                        </select>
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button type="submit" style="background: #10B981; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                            💰 Donar Ahora
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    procesarDonacion(event, alertaId) {
        event.preventDefault();
        
        const monto = parseFloat(document.getElementById('montoDonacion').value);
        const metodo = document.getElementById('metodoPago').value;
        
        const donacion = {
            id: Date.now(),
            alertaId,
            monto,
            metodo,
            fecha: new Date().toISOString(),
            estado: 'pendiente'
        };
        
        this.donaciones.push(donacion);
        this.guardarDonaciones();
        
        this.mostrarNotificacion('✅ Donación procesada correctamente', 'success');
        cerrarModalSeguro(event.target);
    }
    
    // ===== UTILIDADES =====
    obtenerColorSeveridad(severidad) {
        const colores = {
            'baja': '#10B981',
            'media': '#F59E0B',
            'alta': '#EF4444',
            'critica': '#DC2626'
        };
        return colores[severidad] || colores.media;
    }
    
    obtenerUbicacionActual(position) {
        this.ubicacionActual = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            nombre: 'Ubicación actual'
        };
    }
    
    manejarErrorGeolocalizacion(error) {
        console.log('Error de geolocalización:', error);
    }
    
    guardarAlertas() {
        localStorage.setItem('alertas_emergencia', JSON.stringify(this.alertas));
    }
    
    guardarReportes() {
        localStorage.setItem('reportes_emergencia', JSON.stringify(this.reportes));
    }
    
    guardarDonaciones() {
        localStorage.setItem('donaciones_emergencia', JSON.stringify(this.donaciones));
    }
    
    mostrarNotificacion(mensaje, tipo) {
        if (window.mostrarNotificacion) {
            window.mostrarNotificacion(mensaje, tipo);
        } else {
            console.log(`${tipo.toUpperCase()}: ${mensaje}`);
        }
    }
}

// Clase para verificación anti-fraude
class VerificacionAntiFraude {
    verificarReporte(reporte) {
        // Verificaciones básicas
        if (!reporte.descripcion || reporte.descripcion.length < 10) {
            return false;
        }
        
        if (!reporte.ubicacion || !reporte.ubicacion.lat || !reporte.ubicacion.lng) {
            return false;
        }
        
        // Verificar patrones sospechosos
        const palabrasSospechosas = ['test', 'prueba', 'fake', 'falso'];
        const descripcionLower = reporte.descripcion.toLowerCase();
        
        for (const palabra of palabrasSospechosas) {
            if (descripcionLower.includes(palabra)) {
                return false;
            }
        }
        
        return true;
    }
}

// Instancia global
window.sistemaAlertas = new SistemaAlertasEmergenciaGlobal();

// CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

console.log('🚨 Sistema de Alertas de Emergencia Global cargado');
