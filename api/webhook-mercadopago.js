/**
 * 🔔 Webhook de Mercado Pago - CheckoutAPI
 * Recibe notificaciones de pagos desde Mercado Pago
 * 
 * 🔐 SEGURIDAD: ACCESS_TOKEN solo se usa en el servidor para verificar pagos
 * 
 * Configuración en MercadoPago:
 * - URL del webhook: https://tu-dominio.vercel.app/api/webhook-mercadopago
 * - Eventos: payment, merchant_order
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
    // Log INMEDIATO al inicio para verificar que el endpoint se está ejecutando
    console.log('🔔 [WEBHOOK] ========== INICIO WEBHOOK ==========');
    console.log('🔔 [WEBHOOK] Endpoint llamado:', new Date().toISOString());
    console.log('🔔 [WEBHOOK] Método HTTP:', req.method);
    console.log('🔔 [WEBHOOK] URL:', req.url);
    
    applyCors(res);
    
    if (req.method === 'OPTIONS') {
        console.log('🔔 [WEBHOOK] OPTIONS request - retornando 200');
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        console.log('🔔 [WEBHOOK] Método no permitido:', req.method);
        return res.status(405).json({
            success: false,
            message: 'Método no permitido. Solo se aceptan POST requests.'
        });
    }
    
    // Verificar que hay body
    if (!req.body || Object.keys(req.body).length === 0) {
        console.warn('⚠️ [WEBHOOK] Body vacío o no parseado');
        console.warn('⚠️ [WEBHOOK] Content-Type:', req.headers['content-type']);
    }
    
    // ⚡ CRÍTICO: Responder INMEDIATAMENTE para evitar 429
    // Vercel Hobby plan tiene límites estrictos de rate limiting
    // Si el webhook tarda > 1 segundo en responder, puede dar 429
    // Responder 200 OK ANTES de cualquier procesamiento pesado
    
    // Enviar respuesta inmediatamente
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'X-Webhook-Status': 'received'
    });
    
    res.end(JSON.stringify({
        success: true,
        message: 'Webhook recibido correctamente',
        received_at: new Date().toISOString()
    }));
    
    // IMPORTANTE: No hacer nada más después de res.end()
    // El procesamiento debe ser completamente asíncrono
    
    // Log inmediato (antes del procesamiento asíncrono) para que aparezca en Vercel
    // Estos logs aparecerán SIEMPRE en Vercel, incluso si el procesamiento es asíncrono
    const timestamp = new Date().toISOString();
    const webhookType = req.body?.type || req.body?.action || 'desconocido';
    const webhookId = req.body?.data?.id || req.body?.id || 'sin ID';
    
    console.log('🔔 [WEBHOOK] ========================================');
    console.log('🔔 [WEBHOOK] Webhook recibido de MercadoPago');
    console.log('🔔 [WEBHOOK] Timestamp:', timestamp);
    console.log('🔔 [WEBHOOK] Método HTTP:', req.method);
    console.log('🔔 [WEBHOOK] URL:', req.url);
    console.log('🔔 [WEBHOOK] Tipo de notificación:', webhookType);
    console.log('🔔 [WEBHOOK] ID de notificación:', webhookId);
    console.log('🔔 [WEBHOOK] Headers importantes:', {
        'content-type': req.headers['content-type'] || 'ausente',
        'x-signature': req.headers['x-signature'] ? 'presente' : 'ausente',
        'x-request-id': req.headers['x-request-id'] || 'ausente',
        'user-agent': req.headers['user-agent']?.substring(0, 50) || 'ausente'
    });
    console.log('🔔 [WEBHOOK] Body tiene keys:', req.body ? Object.keys(req.body).join(', ') : 'body vacío');
    console.log('🔔 [WEBHOOK] ========================================');
    console.log('🔔 [WEBHOOK] NOTA: Si no ves más logs después de esto, el webhook se procesó correctamente de forma asíncrona.');
    
    // Procesar de forma asíncrona (después de que la respuesta se envió)
    // Usar process.nextTick para asegurar que la respuesta se envió primero
    process.nextTick(async () => {
        try {
            // Log inmediato para que aparezca en Vercel
            console.log('🔔 [WEBHOOK] Iniciando procesamiento asíncrono');
            console.log('🔔 [WEBHOOK] Body recibido:', JSON.stringify(req.body).substring(0, 200));
            
            const { type, data, action, api_version, date_created, id, live_mode, user_id } = req.body;
            
            // Obtener headers de Mercado Pago
            const xSignature = req.headers['x-signature'] || req.headers['x-signature'] || null;
            const xRequestId = req.headers['x-request-id'] || req.headers['x-request-id'] || null;
            
            const notificationType = type || action;
            const notificationId = data?.id || id;
            
            console.log('🔔 [WEBHOOK] Tipo:', notificationType);
            console.log('🔔 [WEBHOOK] ID:', notificationId);
            console.log('🔔 [WEBHOOK] Headers:', { 
                xSignature: xSignature ? 'presente' : 'ausente', 
                xRequestId: xRequestId || 'ausente' 
            });
            
            // Verificar que viene de Mercado Pago (validación básica)
            if (!xRequestId && !id) {
                console.warn('⚠️ Webhook sin identificadores, puede no ser de Mercado Pago');
                // Continuar de todas formas, pero loguear
            }
        
            // Procesar según el tipo de notificación
            // Manejar diferentes formatos de webhook de MercadoPago
            // notificationType ya está declarado arriba (línea 119)
            
            if (notificationType === 'payment' || notificationType === 'payment.created' || notificationType === 'payment.updated') {
                const paymentId = data?.id || id;
                
                if (!paymentId) {
                    console.warn('⚠️ Webhook de pago sin ID');
                    return; // Ya respondimos 200, solo loguear
                }
            
                // Obtener detalles del pago desde Mercado Pago
                const accessToken = getMercadoPagoAccessToken();
                
                if (!accessToken) {
                    console.error('❌ MERCADOPAGO_ACCESS_TOKEN no configurado');
                    return; // Ya respondimos 200, solo loguear
                }
                
                // Consultar el pago en Mercado Pago
                let payment;
                try {
                    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (!mpResponse.ok) {
                        console.error('❌ Error consultando pago en Mercado Pago:', mpResponse.status);
                        // Si es 429, esperar un poco y reintentar
                        if (mpResponse.status === 429) {
                            console.warn('⚠️ Rate limit de MercadoPago, esperando 2 segundos...');
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            // Reintentar una vez
                            const retryResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,
                                    'Content-Type': 'application/json'
                                }
                            });
                            if (retryResponse.ok) {
                                payment = await retryResponse.json();
                            } else {
                                console.error('❌ Error en reintento:', retryResponse.status);
                                return;
                            }
                        } else {
                            return; // Ya respondimos 200, solo loguear
                        }
                    } else {
                        payment = await mpResponse.json();
                    }
                } catch (fetchError) {
                    console.error('❌ Error de red consultando pago:', fetchError.message);
                    return; // Ya respondimos 200, solo loguear
                }
            
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
            
                console.log('✅ Pago procesado correctamente:', payment.id);
                
            } else if (notificationType === 'merchant_order' || notificationType === 'merchant_order.created' || notificationType === 'merchant_order.updated') {
                // Procesar orden de comercio
                const orderId = data?.id || id;
                
                console.log('📦 Orden recibida:', orderId);
                
                // Aquí podrías procesar la orden
                // Por ahora, solo loguear
                
            } else if (notificationType === 'mp-connect' || notificationType === 'application.authorized') {
                // Webhook de MP Connect (cuando se autoriza una aplicación)
                console.log('🔗 MP Connect - Aplicación autorizada:', {
                    user_id: user_id,
                    action: action,
                    live_mode: live_mode
                });
                
                // No necesitamos hacer nada especial, solo loguear
                
            } else {
                console.warn('⚠️ Tipo de webhook desconocido:', notificationType, 'Datos:', req.body);
                
                // Aún así, loguear para debugging
            }
            
        } catch (error) {
            // Ya respondimos 200, solo loguear el error
            console.error('❌ Error procesando webhook (asíncrono):', error.message);
            console.error('Stack:', error.stack);
        }
    });
};
