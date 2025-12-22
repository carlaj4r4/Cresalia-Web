// ============================================
// SISTEMA DE EMAILS AUTOMÁTICOS - CRESALIA
// ============================================
// Envía emails de felicitación y bienvenida automáticamente
// Integrado con Brevo API y sincronizado con panel-master

class SistemaEmailsAutomaticos {
    constructor() {
        // Configuración de Brevo API
        this.brevoConfig = {
            apiUrl: '/api/enviar-email-brevo', // API endpoint en Vercel
            enabled: true
        };
        
        this.historialEnviados = this.cargarHistorial();
    }
    
    // Función helper para enviar email con Brevo
    async enviarEmailConBrevo(to, to_name, subject, htmlContent, templateType = null) {
        try {
            const response = await fetch(this.brevoConfig.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: to,
                    to_name: to_name,
                    subject: subject,
                    html_content: htmlContent,
                    template_type: templateType
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al enviar email');
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('❌ Error enviando email con Brevo:', error);
            throw error;
        }
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
            
            // Verificar si estamos en temporada festiva
            const ahora = new Date();
            const mes = ahora.getMonth();
            const dia = ahora.getDate();
            const esFestivo = (mes === 11 && dia >= 20) || (mes === 0 && dia <= 7);
            const mensajeFestivo = esFestivo ? '<div style="background:linear-gradient(135deg,#7C3AED 0%,#EC4899 100%);padding:20px;border-radius:12px;margin:20px 0;text-align:center;color:#ffffff;"><p style="margin:0 0 10px 0;font-size:18px;font-weight:600;">🎄 ¡Felices Fiestas! 🎉</p><p style="margin:0;font-size:14px;opacity:0.95;">Te deseamos un año lleno de buenas noticias, oportunidades y momentos especiales. Desde Cresalia, queremos que sepas que te esperan cosas increíbles. 🌟</p></div>' : '';
            
            const htmlContent = `
                <p>¡Bienvenido a Cresalia! Estamos muy contentos de tenerte con nosotros.</p>
                ${mensajeFestivo}
                <p>Como ${params.user_type === 'vendedor' ? 'vendedor' : 'comprador'}, podrás:</p>
                <ul>
                    ${params.user_type === 'vendedor' 
                        ? '<li>Crear tu tienda online</li><li>Gestionar productos y servicios</li><li>Recibir pagos de forma segura</li>'
                        : '<li>Explorar productos y servicios</li><li>Realizar compras de forma segura</li><li>Acceder a tu historial de compras</li>'
                    }
                </ul>
                <p>Si tenés alguna pregunta, no dudes en contactarnos.</p>
                <p>¡Que tengas un excelente día!</p>
            `;
            
            await this.enviarEmailConBrevo(
                params.to_email,
                params.to_name,
                '¡Bienvenido a Cresalia! 💜',
                htmlContent,
                'bienvenida'
            );
            
            this.marcarEnviado(usuario.id, 'bienvenida');
            
            // Notificar al panel master
            this.notificarPanelMaster({
                tipo: 'email_bienvenida',
                usuario: usuario.email,
                fecha: new Date().toISOString(),
                estado: 'enviado'
            });
            
            console.log('✅ Email de bienvenida enviado');
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
            
            const htmlContent = `
                <p>¡Felicitaciones por tu primera compra en Cresalia!</p>
                <p><strong>Producto:</strong> ${params.producto}</p>
                <p><strong>Monto:</strong> $${params.monto}</p>
                <p><strong>Fecha:</strong> ${params.fecha}</p>
                <p>Esperamos que disfrutes tu compra. Si necesitás ayuda, estamos acá para vos.</p>
                <p>¡Gracias por confiar en Cresalia!</p>
            `;
            
            await this.enviarEmailConBrevo(
                params.to_email,
                params.to_name,
                '🎉 ¡Felicitaciones por tu primera compra!',
                htmlContent,
                'primera_compra'
            );
            
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
            
            const htmlContent = `
                <p>¡Felicitaciones por tu primera venta en Cresalia!</p>
                <p><strong>Producto:</strong> ${params.producto}</p>
                <p><strong>Monto:</strong> $${params.monto}</p>
                <p><strong>Cliente:</strong> ${params.cliente}</p>
                <p><strong>Fecha:</strong> ${params.fecha}</p>
                <p>¡Seguí así! Estamos orgullosos de acompañarte en tu crecimiento.</p>
                <p>¡Vamos por más ventas!</p>
            `;
            
            await this.enviarEmailConBrevo(
                params.to_email,
                params.to_name,
                '🎉 ¡Felicitaciones por tu primera venta!',
                htmlContent
            );
            
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
            
            const htmlContent = `
                <p>¡Felicitaciones por tu primer turno reservado en Cresalia!</p>
                <p><strong>Servicio:</strong> ${params.servicio}</p>
                <p><strong>Cliente:</strong> ${params.cliente}</p>
                <p><strong>Fecha del turno:</strong> ${params.fecha_turno}</p>
                <p><strong>Fecha de reserva:</strong> ${params.fecha}</p>
                <p>¡Esperamos que todo salga excelente!</p>
                <p>¡Gracias por confiar en Cresalia!</p>
            `;
            
            await this.enviarEmailConBrevo(
                params.to_email,
                params.to_name,
                '🎉 ¡Felicitaciones por tu primer turno!',
                htmlContent
            );
            
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
            
            const caracteristicasHTML = params.caracteristicas && params.caracteristicas.length > 0
                ? '<ul>' + params.caracteristicas.map(c => `<li>${c}</li>`).join('') + '</ul>'
                : '<p>Acceso completo a todas las funcionalidades del plan.</p>';
            
            const htmlContent = `
                <p>¡Tu suscripción a Cresalia ha sido confirmada!</p>
                <p><strong>Plan:</strong> ${params.plan}</p>
                <p><strong>Precio:</strong> $${params.precio}</p>
                <p><strong>Fecha:</strong> ${params.fecha}</p>
                <p><strong>Características incluidas:</strong></p>
                ${caracteristicasHTML}
                <p>¡Gracias por confiar en Cresalia!</p>
            `;
            
            await this.enviarEmailConBrevo(
                params.to_email,
                params.to_name,
                '✅ Confirmación de Suscripción - Cresalia',
                htmlContent
            );
            
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


