// ============================================
// SISTEMA DE EMAILS AUTOMÁTICOS - CRESALIA
// ============================================
// Envía emails de felicitación y bienvenida automáticamente
// Integrado con EmailJS y sincronizado con panel-master

class SistemaEmailsAutomaticos {
    constructor() {
        // Configuración de EmailJS (debes configurar tu cuenta)
        this.emailJSConfig = {
            serviceID: 'service_cresalia',
            templateBienvenida: 'template_bienvenida',
            templatePrimeraCompra: 'template_primera_compra',
            templatePrimeraVenta: 'template_primera_venta',
            templatePrimerTurno: 'template_primer_turno',
            templateSuscripcion: 'template_suscripcion',
            publicKey: 'TU_PUBLIC_KEY_EMAILJS' // Reemplazar con tu clave real
        };
        
        this.historialEnviados = this.cargarHistorial();
    }
    
    // Cargar historial de emails enviados
    cargarHistorial() {
        return JSON.parse(localStorage.getItem('historial_emails_cresalia') || '{}');
    }
    
    // Guardar historial
    guardarHistorial() {
        localStorage.setItem('historial_emails_cresalia', JSON.stringify(this.historialEnviados));
    }
    
    // Verificar si ya se envió un email de este tipo
    yaEnviado(userId, tipo) {
        return this.historialEnviados[userId] && this.historialEnviados[userId][tipo];
    }
    
    // Marcar como enviado
    marcarEnviado(userId, tipo) {
        if (!this.historialEnviados[userId]) {
            this.historialEnviados[userId] = {};
        }
        this.historialEnviados[userId][tipo] = {
            enviado: true,
            fecha: new Date().toISOString()
        };
        this.guardarHistorial();
    }
    
    // ============================================
    // EMAIL DE BIENVENIDA
    // ============================================
    async enviarBienvenida(usuario) {
        if (this.yaEnviado(usuario.id, 'bienvenida')) {
            console.log('✅ Email de bienvenida ya enviado anteriormente');
            return;
        }
        
        const params = {
            to_email: usuario.email,
            to_name: usuario.nombre,
            user_type: usuario.tipo === 'vendedor' ? 'vendedor' : 'comprador',
            fecha: new Date().toLocaleDateString('es-ES')
        };
        
        try {
            console.log('📧 Enviando email de bienvenida...');
            
            // Simular envío (en producción, usar EmailJS)
            // await emailjs.send(this.emailJSConfig.serviceID, this.emailJSConfig.templateBienvenida, params, this.emailJSConfig.publicKey);
            
            this.marcarEnviado(usuario.id, 'bienvenida');
            
            // Notificar al panel master
            this.notificarPanelMaster({
                tipo: 'email_bienvenida',
                usuario: usuario.email,
                fecha: new Date().toISOString(),
                estado: 'enviado'
            });
            
            console.log('✅ Email de bienvenida enviado a', usuario.email);
            return { success: true, mensaje: 'Email de bienvenida enviado' };
            
        } catch (error) {
            console.error('❌ Error enviando email de bienvenida:', error);
            
            // Notificar error al panel master
            this.notificarPanelMaster({
                tipo: 'email_bienvenida',
                usuario: usuario.email,
                fecha: new Date().toISOString(),
                estado: 'error',
                error: error.message
            });
            
            return { success: false, error: error.message };
        }
    }
    
    // ============================================
    // EMAIL PRIMERA COMPRA
    // ============================================
    async enviarFelicitacionPrimeraCompra(usuario, detallesCompra) {
        if (this.yaEnviado(usuario.id, 'primera_compra')) {
            console.log('✅ Email de primera compra ya enviado anteriormente');
            return;
        }
        
        const params = {
            to_email: usuario.email,
            to_name: usuario.nombre,
            producto: detallesCompra.producto,
            monto: detallesCompra.monto,
            fecha: new Date().toLocaleDateString('es-ES')
        };
        
        try {
            console.log('🎉 Enviando felicitación por primera compra...');
            
            // Simular envío (en producción, usar EmailJS)
            // await emailjs.send(this.emailJSConfig.serviceID, this.emailJSConfig.templatePrimeraCompra, params, this.emailJSConfig.publicKey);
            
            this.marcarEnviado(usuario.id, 'primera_compra');
            
            // Notificar al panel master
            this.notificarPanelMaster({
                tipo: 'email_primera_compra',
                usuario: usuario.email,
                detalles: detallesCompra,
                fecha: new Date().toISOString(),
                estado: 'enviado'
            });
            
            console.log('✅ ¡Felicitación por primera compra enviada!');
            return { success: true, mensaje: '¡Felicitación enviada!' };
            
        } catch (error) {
            console.error('❌ Error enviando felicitación:', error);
            this.notificarPanelMaster({
                tipo: 'email_primera_compra',
                usuario: usuario.email,
                fecha: new Date().toISOString(),
                estado: 'error',
                error: error.message
            });
            return { success: false, error: error.message };
        }
    }
    
    // ============================================
    // EMAIL PRIMERA VENTA
    // ============================================
    async enviarFelicitacionPrimeraVenta(usuario, detallesVenta) {
        if (this.yaEnviado(usuario.id, 'primera_venta')) {
            console.log('✅ Email de primera venta ya enviado anteriormente');
            return;
        }
        
        const params = {
            to_email: usuario.email,
            to_name: usuario.nombre,
            producto: detallesVenta.producto,
            monto: detallesVenta.monto,
            cliente: detallesVenta.cliente,
            fecha: new Date().toLocaleDateString('es-ES')
        };
        
        try {
            console.log('🎉 Enviando felicitación por primera venta...');
            
            // Simular envío (en producción, usar EmailJS)
            // await emailjs.send(this.emailJSConfig.serviceID, this.emailJSConfig.templatePrimeraVenta, params, this.emailJSConfig.publicKey);
            
            this.marcarEnviado(usuario.id, 'primera_venta');
            
            // Notificar al panel master
            this.notificarPanelMaster({
                tipo: 'email_primera_venta',
                usuario: usuario.email,
                detalles: detallesVenta,
                fecha: new Date().toISOString(),
                estado: 'enviado'
            });
            
            console.log('✅ ¡Felicitación por primera venta enviada! 🎉 Vamos por más!');
            return { success: true, mensaje: '¡Felicitación enviada! Vamos por más!' };
            
        } catch (error) {
            console.error('❌ Error enviando felicitación:', error);
            this.notificarPanelMaster({
                tipo: 'email_primera_venta',
                usuario: usuario.email,
                fecha: new Date().toISOString(),
                estado: 'error',
                error: error.message
            });
            return { success: false, error: error.message };
        }
    }
    
    // ============================================
    // EMAIL PRIMER TURNO/SERVICIO
    // ============================================
    async enviarFelicitacionPrimerTurno(usuario, detallesTurno) {
        if (this.yaEnviado(usuario.id, 'primer_turno')) {
            console.log('✅ Email de primer turno ya enviado anteriormente');
            return;
        }
        
        const params = {
            to_email: usuario.email,
            to_name: usuario.nombre,
            servicio: detallesTurno.servicio,
            cliente: detallesTurno.cliente,
            fecha_turno: detallesTurno.fecha,
            fecha: new Date().toLocaleDateString('es-ES')
        };
        
        try {
            console.log('🎉 Enviando felicitación por primer turno...');
            
            // Simular envío (en producción, usar EmailJS)
            // await emailjs.send(this.emailJSConfig.serviceID, this.emailJSConfig.templatePrimerTurno, params, this.emailJSConfig.publicKey);
            
            this.marcarEnviado(usuario.id, 'primer_turno');
            
            // Notificar al panel master
            this.notificarPanelMaster({
                tipo: 'email_primer_turno',
                usuario: usuario.email,
                detalles: detallesTurno,
                fecha: new Date().toISOString(),
                estado: 'enviado'
            });
            
            console.log('✅ ¡Felicitación por primer turno enviada! 🎉');
            return { success: true, mensaje: '¡Felicitación enviada! Vamos por más!' };
            
        } catch (error) {
            console.error('❌ Error enviando felicitación:', error);
            this.notificarPanelMaster({
                tipo: 'email_primer_turno',
                usuario: usuario.email,
                fecha: new Date().toISOString(),
                estado: 'error',
                error: error.message
            });
            return { success: false, error: error.message };
        }
    }
    
    // ============================================
    // EMAIL SUSCRIPCIÓN
    // ============================================
    async enviarConfirmacionSuscripcion(usuario, datosSuscripcion) {
        const params = {
            to_email: usuario.email,
            to_name: usuario.nombre,
            plan: datosSuscripcion.plan,
            precio: datosSuscripcion.precio,
            caracteristicas: datosSuscripcion.caracteristicas || [],
            fecha: new Date().toLocaleDateString('es-ES')
        };
        
        try {
            console.log('📧 Enviando confirmación de suscripción...');
            
            // Simular envío (en producción, usar EmailJS)
            // await emailjs.send(this.emailJSConfig.serviceID, this.emailJSConfig.templateSuscripcion, params, this.emailJSConfig.publicKey);
            
            // Notificar al panel master
            this.notificarPanelMaster({
                tipo: 'email_suscripcion',
                usuario: usuario.email,
                plan: datosSuscripcion.plan,
                fecha: new Date().toISOString(),
                estado: 'enviado'
            });
            
            console.log('✅ Confirmación de suscripción enviada');
            return { success: true, mensaje: 'Confirmación de suscripción enviada' };
            
        } catch (error) {
            console.error('❌ Error enviando confirmación de suscripción:', error);
            this.notificarPanelMaster({
                tipo: 'email_suscripcion',
                usuario: usuario.email,
                plan: datosSuscripcion.plan,
                fecha: new Date().toISOString(),
                estado: 'error',
                error: error.message
            });
            return { success: false, error: error.message };
        }
    }
    
    // ============================================
    // NOTIFICACIÓN AL PANEL MASTER
    // ============================================
    notificarPanelMaster(datos) {
        try {
            // Guardar en localStorage para que panel-master pueda leer
            const notificaciones = JSON.parse(localStorage.getItem('notificaciones_master_cresalia') || '[]');
            notificaciones.unshift({
                ...datos,
                id: Date.now().toString(),
                timestamp: new Date().toISOString()
            });
            
            // Mantener solo las últimas 100 notificaciones
            if (notificaciones.length > 100) {
                notificaciones.splice(100);
            }
            
            localStorage.setItem('notificaciones_master_cresalia', JSON.stringify(notificaciones));
            console.log('📊 Notificación enviada al Panel Master');
            
        } catch (error) {
            console.error('❌ Error notificando al Panel Master:', error);
        }
    }
    
    // ============================================
    // FUNCIÓN PRINCIPAL: DETECTAR Y ENVIAR
    // ============================================
    async procesarEvento(evento, usuario, detalles) {
        console.log(`📧 Procesando evento: ${evento}`);
        
        switch(evento) {
            case 'registro':
                return await this.enviarBienvenida(usuario);
                
            case 'primera_compra':
                return await this.enviarFelicitacionPrimeraCompra(usuario, detalles);
                
            case 'primera_venta':
                return await this.enviarFelicitacionPrimeraVenta(usuario, detalles);
                
            case 'primer_turno':
                return await this.enviarFelicitacionPrimerTurno(usuario, detalles);
                
            case 'suscripcion':
                return await this.enviarConfirmacionSuscripcion(usuario, detalles);
                
            default:
                console.warn('⚠️ Evento no reconocido:', evento);
                return { success: false, error: 'Evento no reconocido' };
        }
    }
}

// Instancia global
const sistemaEmailsCresalia = new SistemaEmailsAutomaticos();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.sistemaEmailsCresalia = sistemaEmailsCresalia;
}

console.log('💜 Sistema de Emails Automáticos Cresalia inicializado');


