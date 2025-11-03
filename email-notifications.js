// ========================================
// SISTEMA DE NOTIFICACIONES POR EMAIL
// CRESALIA SaaS - Powered by EmailJS
// ========================================

/**
 * EmailJS es un servicio gratuito que permite enviar emails desde el frontend
 * sin necesidad de un servidor backend.
 * 
 * CONFIGURACIÓN INICIAL:
 * 1. Ve a https://www.emailjs.com/
 * 2. Crea una cuenta gratuita
 * 3. Crea un servicio de email (Gmail, Outlook, etc.)
 * 4. Crea un template de email
 * 5. Obtén tu Public Key
 * 6. Actualiza las constantes abajo
 */

// ===== CONFIGURACIÓN =====
const EMAIL_CONFIG = {
    serviceID: 'TU_SERVICE_ID', // Reemplazar con tu Service ID de EmailJS
    publicKey: 'TU_PUBLIC_KEY', // Reemplazar con tu Public Key de EmailJS
    templates: {
        reservaCliente: 'template_reserva_cliente', // Template para el cliente
        reservaProveedor: 'template_reserva_proveedor', // Template para el proveedor
        cancelacion: 'template_cancelacion'
    }
};

// ===== INICIALIZACIÓN =====
function inicializarEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAIL_CONFIG.publicKey !== 'TU_PUBLIC_KEY') {
        emailjs.init(EMAIL_CONFIG.publicKey);
        console.log('✅ EmailJS inicializado');
        return true;
    } else {
        console.log('ℹ️ EmailJS no configurado - emails deshabilitados');
        return false;
    }
}

// ===== ENVIAR EMAIL DE CONFIRMACIÓN AL CLIENTE =====
async function enviarEmailConfirmacionCliente(reserva, tiendaInfo) {
    if (!inicializarEmailJS()) {
        console.log('📧 Modo simulación: Email de confirmación enviado al cliente');
        return { success: true, simulado: true };
    }
    
    try {
        const templateParams = {
            to_name: reserva.cliente,
            to_email: reserva.email,
            from_name: tiendaInfo.nombre,
            servicio_nombre: reserva.servicioNombre,
            fecha: new Date(reserva.fecha).toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            hora: reserva.hora,
            duracion: reserva.duracion + ' minutos',
            precio: '$' + reserva.precio.toFixed(2),
            notas: reserva.notas || 'Sin notas adicionales',
            numero_reserva: '#' + reserva.id,
            tienda_email: tiendaInfo.email,
            tienda_telefono: tiendaInfo.telefono || 'No especificado',
            tienda_direccion: tiendaInfo.direccion || 'No especificado'
        };
        
        await emailjs.send(
            EMAIL_CONFIG.serviceID,
            EMAIL_CONFIG.templates.reservaCliente,
            templateParams
        );
        
        console.log('✅ Email de confirmación enviado al cliente:', reserva.email);
        return { success: true, simulado: false };
    } catch (error) {
        console.error('❌ Error enviando email al cliente:', error);
        return { success: false, error: error.message };
    }
}

// ===== ENVIAR EMAIL DE NOTIFICACIÓN AL PROVEEDOR =====
async function enviarEmailNotificacionProveedor(reserva, tiendaInfo) {
    if (!inicializarEmailJS()) {
        console.log('📧 Modo simulación: Notificación enviada al proveedor');
        return { success: true, simulado: true };
    }
    
    try {
        const templateParams = {
            to_name: tiendaInfo.nombre_propietario || 'Proveedor',
            to_email: tiendaInfo.email,
            cliente_nombre: reserva.cliente,
            cliente_email: reserva.email,
            cliente_telefono: reserva.telefono || 'No proporcionado',
            servicio_nombre: reserva.servicioNombre,
            fecha: new Date(reserva.fecha).toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            hora: reserva.hora,
            duracion: reserva.duracion + ' minutos',
            precio: '$' + reserva.precio.toFixed(2),
            notas: reserva.notas || 'Sin notas adicionales',
            numero_reserva: '#' + reserva.id
        };
        
        await emailjs.send(
            EMAIL_CONFIG.serviceID,
            EMAIL_CONFIG.templates.reservaProveedor,
            templateParams
        );
        
        console.log('✅ Notificación enviada al proveedor:', tiendaInfo.email);
        return { success: true, simulado: false };
    } catch (error) {
        console.error('❌ Error enviando notificación al proveedor:', error);
        return { success: false, error: error.message };
    }
}

// ===== ENVIAR EMAIL DE CANCELACIÓN =====
async function enviarEmailCancelacion(reserva, tiendaInfo, motivoCancelacion = '') {
    if (!inicializarEmailJS()) {
        console.log('📧 Modo simulación: Email de cancelación enviado');
        return { success: true, simulado: true };
    }
    
    try {
        const templateParams = {
            to_name: reserva.cliente,
            to_email: reserva.email,
            from_name: tiendaInfo.nombre,
            servicio_nombre: reserva.servicioNombre,
            fecha: new Date(reserva.fecha).toLocaleDateString('es-AR'),
            hora: reserva.hora,
            numero_reserva: '#' + reserva.id,
            motivo: motivoCancelacion || 'No especificado',
            tienda_email: tiendaInfo.email,
            tienda_telefono: tiendaInfo.telefono || 'No especificado'
        };
        
        await emailjs.send(
            EMAIL_CONFIG.serviceID,
            EMAIL_CONFIG.templates.cancelacion,
            templateParams
        );
        
        console.log('✅ Email de cancelación enviado');
        return { success: true, simulado: false };
    } catch (error) {
        console.error('❌ Error enviando email de cancelación:', error);
        return { success: false, error: error.message };
    }
}

// ===== FUNCIÓN PRINCIPAL: PROCESAR RESERVA =====
async function procesarNuevaReserva(datosReserva) {
    try {
        // Obtener información de la tienda
        const tiendaActual = JSON.parse(localStorage.getItem('tienda_actual') || '{}');
        const config = JSON.parse(localStorage.getItem('techstore_configuracion') || '{}');
        
        const tiendaInfo = {
            nombre: tiendaActual.nombre_tienda || config.nombreTienda || 'Mi Tienda',
            email: tiendaActual.email || config.emailContacto || '',
            telefono: config.telefono || '',
            direccion: config.direccion || '',
            nombre_propietario: tiendaActual.nombre_propietario || ''
        };
        
        // Crear objeto de reserva completo
        const reserva = {
            id: Date.now(),
            ...datosReserva,
            fecha: datosReserva.fecha || new Date().toISOString(),
            estado: 'pendiente',
            fechaCreacion: new Date().toISOString()
        };
        
        // Guardar en localStorage
        let reservasArray = JSON.parse(localStorage.getItem('techstore_reservas') || '[]');
        reservasArray.push(reserva);
        localStorage.setItem('techstore_reservas', JSON.stringify(reservasArray));
        
        // Guardar en Supabase si está disponible
        if (typeof supabase !== 'undefined' && tiendaActual.id) {
            try {
                await supabase.from('reservas_servicios').insert([{
                    servicio_id: reserva.servicioId,
                    tienda_id: tiendaActual.id,
                    nombre_cliente: reserva.cliente,
                    email_cliente: reserva.email,
                    telefono_cliente: reserva.telefono,
                    fecha_reserva: reserva.fecha,
                    duracion: reserva.duracion,
                    estado: 'pendiente',
                    notas: reserva.notas,
                    precio_cobrado: reserva.precio
                }]);
                console.log('✅ Reserva guardada en Supabase');
            } catch (error) {
                console.log('Info: Reserva guardada solo localmente');
            }
        }
        
        // ENVIAR EMAILS
        const resultados = {
            cliente: { success: false },
            proveedor: { success: false }
        };
        
        // Email al cliente (confirmación)
        if (reserva.email) {
            resultados.cliente = await enviarEmailConfirmacionCliente(reserva, tiendaInfo);
        }
        
        // Email al proveedor (notificación)
        if (tiendaInfo.email) {
            resultados.proveedor = await enviarEmailNotificacionProveedor(reserva, tiendaInfo);
        }
        
        // Mostrar resultado
        if (resultados.cliente.simulado || resultados.proveedor.simulado) {
            mostrarNotificacion('✅ Reserva creada (Emails en modo demo)', 'success');
        } else if (resultados.cliente.success && resultados.proveedor.success) {
            mostrarNotificacion('✅ Reserva creada y emails enviados', 'success');
        } else if (resultados.cliente.success || resultados.proveedor.success) {
            mostrarNotificacion('⚠️ Reserva creada. Algunos emails no se enviaron', 'warning');
        } else {
            mostrarNotificacion('✅ Reserva creada (sin notificaciones por email)', 'success');
        }
        
        return { success: true, reserva, resultados };
        
    } catch (error) {
        console.error('❌ Error procesando reserva:', error);
        mostrarNotificacion('❌ Error al procesar la reserva', 'error');
        return { success: false, error: error.message };
    }
}

// ===== TEMPLATES DE EMAIL (HTML) =====
/**
 * NOTA: Estos templates deben crearse en EmailJS
 * Aquí está el HTML sugerido para cada template
 */

const TEMPLATE_EMAIL_CLIENTE = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #E5E7EB; }
        .footer { background: #F9FAFB; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; }
        .info-box { background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .button { background: #7C3AED; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 ¡Reserva Confirmada!</h1>
            <p>CRESALIA SaaS</p>
        </div>
        <div class="content">
            <p>Hola <strong>{{to_name}}</strong>,</p>
            <p>Tu reserva ha sido confirmada exitosamente en <strong>{{from_name}}</strong>.</p>
            
            <div class="info-box">
                <h3>📋 Detalles de tu Reserva:</h3>
                <p><strong>Número de Reserva:</strong> {{numero_reserva}}</p>
                <p><strong>Servicio:</strong> {{servicio_nombre}}</p>
                <p><strong>Fecha:</strong> {{fecha}}</p>
                <p><strong>Hora:</strong> {{hora}}</p>
                <p><strong>Duración:</strong> {{duracion}}</p>
                <p><strong>Precio:</strong> {{precio}}</p>
            </div>
            
            <div class="info-box">
                <h3>📍 Información del Proveedor:</h3>
                <p><strong>Email:</strong> {{tienda_email}}</p>
                <p><strong>Teléfono:</strong> {{tienda_telefono}}</p>
                <p><strong>Dirección:</strong> {{tienda_direccion}}</p>
            </div>
            
            <p><strong>Notas:</strong> {{notas}}</p>
            
            <p style="margin-top: 20px;">Por favor, llega puntual a tu cita. Si necesitas cancelar o reprogramar, contáctanos lo antes posible.</p>
        </div>
        <div class="footer">
            <p>Gracias por confiar en <strong>{{from_name}}</strong></p>
            <p style="font-size: 12px; color: #6B7280;">Powered by CRESALIA SaaS - www.cresalia.com</p>
        </div>
    </div>
</body>
</html>
`;

const TEMPLATE_EMAIL_PROVEEDOR = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981, #34D399); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #E5E7EB; }
        .alert { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 15px 0; border-radius: 4px; }
        .info-box { background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 Nueva Reserva Recibida</h1>
        </div>
        <div class="content">
            <p>Hola <strong>{{to_name}}</strong>,</p>
            
            <div class="alert">
                <strong>⚠️ Tienes una nueva reserva que requiere tu atención</strong>
            </div>
            
            <div class="info-box">
                <h3>📋 Detalles de la Reserva:</h3>
                <p><strong>Número:</strong> {{numero_reserva}}</p>
                <p><strong>Servicio:</strong> {{servicio_nombre}}</p>
                <p><strong>Fecha:</strong> {{fecha}}</p>
                <p><strong>Hora:</strong> {{hora}}</p>
                <p><strong>Duración:</strong> {{duracion}}</p>
                <p><strong>Precio:</strong> {{precio}}</p>
            </div>
            
            <div class="info-box">
                <h3>👤 Información del Cliente:</h3>
                <p><strong>Nombre:</strong> {{cliente_nombre}}</p>
                <p><strong>Email:</strong> {{cliente_email}}</p>
                <p><strong>Teléfono:</strong> {{cliente_telefono}}</p>
            </div>
            
            <p><strong>Notas del Cliente:</strong> {{notas}}</p>
            
            <p style="margin-top: 20px;">Recuerda confirmar la cita con el cliente y preparar todo lo necesario.</p>
        </div>
        <div style="background: #F9FAFB; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="font-size: 12px; color: #6B7280;">Powered by CRESALIA SaaS - Panel de Administración</p>
        </div>
    </div>
</body>
</html>
`;

// ===== EJEMPLO DE USO =====
/**
 * Para usar este sistema:
 * 
 * 1. Cuando un cliente hace una reserva:
 * 
 * const datosReserva = {
 *     servicioNombre: 'Corte de Cabello',
 *     servicioId: 123,
 *     cliente: 'Juan Pérez',
 *     email: 'juan@ejemplo.com',
 *     telefono: '+54 9 11 1234-5678',
 *     fecha: new Date('2024-10-15T14:30:00'),
 *     hora: '14:30',
 *     duracion: 45,
 *     precio: 1500,
 *     categoria: 'peluqueria',
 *     notas: 'Cliente prefiere corte clásico'
 * };
 * 
 * await procesarNuevaReserva(datosReserva);
 * 
 * Esto automáticamente:
 * - Guarda la reserva en localStorage
 * - Guarda en Supabase (si está configurado)
 * - Envía email al cliente
 * - Envía email al proveedor
 */

// ===== EXPORTAR FUNCIONES =====
if (typeof window !== 'undefined') {
    window.EmailNotifications = {
        procesarNuevaReserva,
        enviarEmailConfirmacionCliente,
        enviarEmailNotificacionProveedor,
        enviarEmailCancelacion,
        inicializarEmailJS,
        EMAIL_CONFIG,
        TEMPLATE_EMAIL_CLIENTE,
        TEMPLATE_EMAIL_PROVEEDOR
    };
}




















