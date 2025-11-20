/**
 * 🔔 Webhook de Mercado Pago - CheckoutAPI
 * Recibe notificaciones de pagos desde Mercado Pago
 */

const { createClient } = require('@supabase/supabase-js');

// Función para aplicar CORS
function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-signature, x-request-id');
}

// Función para obtener el Access Token (para verificar webhooks)
function getMercadoPagoAccessToken() {
    return process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN_PROD || null;
}

// Función para verificar la firma del webhook (opcional, pero recomendado)
function verificarFirmaWebhook(data, signature, secret) {
    // Mercado Pago usa HMAC-SHA256 para firmar webhooks
    // Por ahora, verificamos que venga de Mercado Pago por IP o header
    // En producción, implementá la verificación completa de firma
    return true; // Simplificado por ahora
}

module.exports = async (req, res) => {
    applyCors(res);
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Método no permitido. Solo se aceptan POST requests.'
        });
    }
    
    try {
        const { type, data } = req.body;
        
        // Obtener headers de Mercado Pago
        const xSignature = req.headers['x-signature'] || req.headers['x-signature'] || null;
        const xRequestId = req.headers['x-request-id'] || req.headers['x-request-id'] || null;
        
        console.log('🔔 Webhook recibido:', type, data?.id);
        console.log('📋 Headers:', { xSignature: xSignature ? 'presente' : 'ausente', xRequestId });
        
        // Verificar que viene de Mercado Pago (validación básica)
        if (!xRequestId) {
            console.warn('⚠️ Webhook sin x-request-id, puede no ser de Mercado Pago');
            // Continuar de todas formas, pero loguear
        }
        
        // Procesar según el tipo de notificación
        if (type === 'payment') {
            const paymentId = data?.id;
            
            if (!paymentId) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de pago no proporcionado'
                });
            }
            
            // Obtener detalles del pago desde Mercado Pago
            const accessToken = getMercadoPagoAccessToken();
            
            if (!accessToken) {
                console.error('❌ MERCADOPAGO_ACCESS_TOKEN no configurado');
                return res.status(500).json({
                    success: false,
                    message: 'Error de configuración del servidor'
                });
            }
            
            // Consultar el pago en Mercado Pago
            const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!mpResponse.ok) {
                console.error('❌ Error consultando pago en Mercado Pago:', mpResponse.status);
                return res.status(500).json({
                    success: false,
                    message: 'Error al consultar el pago'
                });
            }
            
            const payment = await mpResponse.json();
            
            console.log('💳 Pago recibido:', {
                id: payment.id,
                status: payment.status,
                status_detail: payment.status_detail,
                external_reference: payment.external_reference,
                transaction_amount: payment.transaction_amount,
                payment_method_id: payment.payment_method_id
            });
            
            // Guardar en Supabase (opcional)
            try {
                const supabaseUrl = process.env.SUPABASE_URL;
                const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
                
                if (supabaseUrl && supabaseKey) {
                    const supabase = createClient(supabaseUrl, supabaseKey);
                    
                    // Intentar guardar en la tabla de pagos (si existe)
                    await supabase
                        .from('payment_webhooks')
                        .insert({
                            payment_id: payment.id,
                            external_reference: payment.external_reference,
                            status: payment.status,
                            status_detail: payment.status_detail,
                            transaction_amount: payment.transaction_amount,
                            currency_id: payment.currency_id,
                            payment_method_id: payment.payment_method_id,
                            payer_email: payment.payer?.email,
                            payer_name: payment.payer?.first_name,
                            payer_surname: payment.payer?.last_name,
                            payment_data: payment,
                            received_at: new Date().toISOString(),
                            x_request_id: xRequestId
                        })
                        .catch(err => {
                            console.warn('⚠️ No se pudo guardar el webhook en Supabase:', err.message);
                            // Continuar aunque falle Supabase
                        });
                    
                    // Si el pago está aprobado, actualizar la suscripción o venta
                    if (payment.status === 'approved') {
                        console.log('✅ Pago aprobado, actualizando suscripción...');
                        
                        // Aquí podrías actualizar la suscripción en Supabase
                        // Ejemplo:
                        // await supabase
                        //     .from('tenants')
                        //     .update({ plan: 'premium', payment_status: 'active' })
                        //     .eq('external_reference', payment.external_reference);
                    }
                }
            } catch (supabaseError) {
                console.warn('⚠️ Error conectando con Supabase:', supabaseError.message);
                // Continuar aunque falle Supabase
            }
            
            // Retornar éxito
            return res.status(200).json({
                success: true,
                message: 'Webhook procesado correctamente',
                payment_id: payment.id,
                status: payment.status
            });
            
        } else if (type === 'merchant_order') {
            // Procesar orden de comercio
            const orderId = data?.id;
            
            console.log('📦 Orden recibida:', orderId);
            
            // Aquí podrías procesar la orden
            // Por ahora, solo retornamos éxito
            
            return res.status(200).json({
                success: true,
                message: 'Webhook de orden procesado correctamente',
                order_id: orderId
            });
            
        } else {
            console.warn('⚠️ Tipo de webhook desconocido:', type);
            
            return res.status(200).json({
                success: true,
                message: 'Webhook recibido pero no procesado',
                type: type
            });
        }
        
    } catch (error) {
        console.error('❌ Error procesando webhook:', error.message);
        console.error('Stack:', error.stack);
        
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al procesar el webhook',
            error: error.message
        });
    }
};
