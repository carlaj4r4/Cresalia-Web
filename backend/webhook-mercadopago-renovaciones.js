// ===== WEBHOOK PARA RENOVACIONES AUTOMÁTICAS - CRESALIA =====
// Endpoint especializado para procesar webhooks de Mercado Pago
// relacionados con renovaciones de suscripciones
// Versión: 1.0
// Autor: Claude para Cresalia

const express = require('express');
const crypto = require('crypto');

// Este endpoint debe integrarse en server-multitenancy.js

async function procesarWebhookRenovacion(req, res) {
    try {
        const { type, action, data } = req.body;
        
        // Validar firma del webhook (seguridad)
        const signature = req.headers['x-signature'];
        const isValid = validarFirmaWebhook(signature, req.body);
        
        if (!isValid) {
            console.error('❌ Firma de webhook inválida');
            return res.status(401).json({ error: 'Firma inválida' });
        }

        console.log(`📥 Webhook recibido: ${type} - ${action}`);

        // Procesar según el tipo de evento
        if (type === 'payment') {
            if (action === 'payment.updated' || action === 'payment.created') {
                await procesarWebhookPago(data.id);
            }
        }

        // Responder inmediatamente a Mercado Pago (importante)
        res.status(200).json({ received: true });

    } catch (error) {
        console.error('❌ Error procesando webhook:', error);
        res.status(500).json({ error: 'Error interno' });
    }
}

async function procesarWebhookPago(paymentId) {
    try {
        console.log(`💰 Procesando pago: ${paymentId}`);

        // Obtener información del pago de Mercado Pago
        // (Necesitas tener configurado el access token de Mercado Pago)
        const mercadopago = require('mercadopago');
        mercadopago.configure({
            access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
        });

        const payment = await mercadopago.payment.findById(paymentId);
        
        if (!payment) {
            console.error('❌ Pago no encontrado en Mercado Pago');
            return;
        }

        const paymentData = payment.body;
        const externalReference = paymentData.external_reference;

        // Verificar si es una renovación
        if (externalReference && externalReference.startsWith('renewal_') || externalReference.startsWith('auto_renewal_')) {
            const subscriptionId = extraerSubscriptionId(externalReference);
            
            if (paymentData.status === 'approved') {
                // Pago exitoso - Renovar suscripción
                console.log(`✅ Pago aprobado para renovación: ${subscriptionId}`);
                await procesarRenovacionExitosa(subscriptionId, paymentId);
            } else if (paymentData.status === 'rejected') {
                // Pago rechazado - Registrar intento fallido
                console.log(`❌ Pago rechazado para renovación: ${subscriptionId}`);
                await procesarRenovacionRechazada(subscriptionId, paymentId);
            }
        }

        // Guardar webhook en base de datos para auditoría
        await guardarWebhook(paymentData);

    } catch (error) {
        console.error('❌ Error procesando pago:', error);
    }
}

async function procesarRenovacionExitosa(subscriptionId, paymentId) {
    try {
        // Aquí llamarías al sistema de renovación automática
        // Por ahora, actualizar directamente en la base de datos
        
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // Obtener suscripción
        const { data: suscripcion, error: suscripcionError } = await supabase
            .from('suscripciones')
            .select('*')
            .eq('id', subscriptionId)
            .single();

        if (suscripcionError || !suscripcion) {
            console.error('❌ Error obteniendo suscripción:', suscripcionError);
            return;
        }

        // Calcular nueva fecha de vencimiento
        const nuevaFechaVencimiento = new Date();
        nuevaFechaVencimiento.setDate(nuevaFechaVencimiento.getDate() + 30);

        // Actualizar suscripción
        const { error: updateError } = await supabase
            .from('suscripciones')
            .update({
                estado: 'activa',
                fecha_vencimiento: nuevaFechaVencimiento.toISOString(),
                fecha_renovacion: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', suscripcion.id);

        if (updateError) {
            console.error('❌ Error actualizando suscripción:', updateError);
            return;
        }

        // Registrar pago
        const planData = obtenerDatosPlan(suscripcion.plan);
        const { error: pagoError } = await supabase
            .from('pagos_suscripciones')
            .insert({
                suscripcion_id: suscripcion.id,
                tienda_id: suscripcion.tienda_id,
                monto: planData.precio,
                comision: planData.precio * 0.029,
                metodo_pago: 'mercadopago',
                estado: 'aprobado',
                payment_id: paymentId,
                external_reference: `renewal_${suscripcion.id}_${Date.now()}`,
                fecha_pago: new Date().toISOString()
            });

        if (pagoError) {
            console.error('❌ Error registrando pago:', pagoError);
        }

        // Reactivar tienda si estaba suspendida
        const { error: tiendaError } = await supabase
            .from('tiendas')
            .update({
                plan: suscripcion.plan,
                estado: 'activa',
                razon_suspension: null,
                fecha_suspension: null
            })
            .eq('id', suscripcion.tienda_id);

        if (tiendaError) {
            console.error('❌ Error reactivando tienda:', tiendaError);
        }

        console.log(`✅ Renovación procesada exitosamente: ${subscriptionId}`);

    } catch (error) {
        console.error('❌ Error procesando renovación exitosa:', error);
    }
}

async function procesarRenovacionRechazada(subscriptionId, paymentId) {
    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // Registrar intento fallido
        const { error: intentoError } = await supabase
            .from('intentos_renovacion')
            .insert({
                suscripcion_id: subscriptionId,
                estado: 'fallido',
                error: 'Pago rechazado por Mercado Pago',
                fecha_intento: new Date().toISOString()
            });

        if (intentoError) {
            console.error('❌ Error registrando intento fallido:', intentoError);
        }

        // Verificar si se debe suspender (3 intentos fallidos)
        const { data: intentos, error: intentosError } = await supabase
            .from('intentos_renovacion')
            .select('*')
            .eq('suscripcion_id', subscriptionId)
            .eq('estado', 'fallido');

        if (intentosError) {
            console.error('❌ Error obteniendo intentos:', intentosError);
            return;
        }

        if (intentos.length >= 3) {
            // Suspender tienda
            const { data: suscripcion } = await supabase
                .from('suscripciones')
                .select('tienda_id')
                .eq('id', subscriptionId)
                .single();

            if (suscripcion) {
                await supabase
                    .from('tiendas')
                    .update({
                        plan: 'free',
                        estado: 'suspendida',
                        razon_suspension: 'pago_fallido',
                        fecha_suspension: new Date().toISOString()
                    })
                    .eq('id', suscripcion.tienda_id);

                console.log(`🚫 Tienda suspendida por fallos de pago: ${suscripcion.tienda_id}`);
            }
        }

    } catch (error) {
        console.error('❌ Error procesando renovación rechazada:', error);
    }
}

function validarFirmaWebhook(signature, body) {
    try {
        const secretKey = process.env.MERCADOPAGO_SECRET_KEY || process.env.MERCADOPAGO_ACCESS_TOKEN;
        
        if (!secretKey || !signature) {
            console.warn('⚠️ Firma o secret key no configurada');
            return true; // En desarrollo, permitir sin validación
        }

        const hash = crypto
            .createHmac('sha256', secretKey)
            .update(JSON.stringify(body))
            .digest('hex');

        return hash === signature;
    } catch (error) {
        console.error('❌ Error validando firma:', error);
        return false;
    }
}

function extraerSubscriptionId(externalReference) {
    // Formato: renewal_SUBSCRIPTION_ID_TIMESTAMP o auto_renewal_SUBSCRIPTION_ID_TIMESTAMP
    const parts = externalReference.split('_');
    if (parts.length >= 3) {
        return parts.slice(1, -1).join('_'); // Tomar todo excepto el prefijo y el timestamp
    }
    return null;
}

function obtenerDatosPlan(plan) {
    const planes = {
        free: { nombre: 'Free', precio: 0 },
        basic: { nombre: 'Básico', precio: 29 },
        pro: { nombre: 'Pro', precio: 79 },
        enterprise: { nombre: 'Enterprise', precio: 199 }
    };
    return planes[plan] || planes.free;
}

async function guardarWebhook(paymentData) {
    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { error } = await supabase
            .from('webhooks_mercadopago')
            .insert({
                action: 'payment.updated',
                type: 'payment',
                data_id: paymentData.id.toString(),
                data: paymentData,
                procesado: true,
                fecha_recepcion: new Date().toISOString(),
                fecha_procesamiento: new Date().toISOString()
            });

        if (error) {
            console.error('❌ Error guardando webhook:', error);
        }
    } catch (error) {
        console.error('❌ Error guardando webhook:', error);
    }
}

module.exports = {
    procesarWebhookRenovacion,
    procesarWebhookPago,
    procesarRenovacionExitosa,
    procesarRenovacionRechazada,
    validarFirmaWebhook
};





