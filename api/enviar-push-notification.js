/**
 * API Endpoint para enviar Push Notifications
 * POST /api/enviar-push-notification
 * 
 * Requiere: npm install web-push
 */

const webpush = require('web-push');

export default async function handler(req, res) {
    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        // Verificar que VAPID keys estén configuradas
        const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
        const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

        if (!vapidPublicKey || !vapidPrivateKey) {
            return res.status(500).json({
                error: 'VAPID keys no configuradas. Configura VAPID_PUBLIC_KEY y VAPID_PRIVATE_KEY en Vercel.'
            });
        }

        // Configurar VAPID keys
        webpush.setVapidDetails(
            'mailto:cresalia@cresalia.com', // Contact email (puedes cambiarlo)
            vapidPublicKey,
            vapidPrivateKey
        );

        // Obtener datos del request
        const { user_id, titulo, mensaje, icono, url } = req.body;

        if (!user_id || !titulo || !mensaje) {
            return res.status(400).json({
                error: 'Faltan parámetros requeridos: user_id, titulo, mensaje'
            });
        }

        // Obtener suscripciones del usuario desde Supabase
        const { createClient } = require('@supabase/supabase-js');
        
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({
                error: 'Supabase no configurado'
            });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Obtener suscripciones activas del usuario
        const { data: subscriptions, error: subError } = await supabase
            .from('push_subscriptions')
            .select('*')
            .eq('user_id', user_id)
            .eq('activo', true);

        if (subError) {
            console.error('Error obteniendo suscripciones:', subError);
            return res.status(500).json({
                error: 'Error obteniendo suscripciones',
                detalles: subError.message
            });
        }

        if (!subscriptions || subscriptions.length === 0) {
            return res.status(404).json({
                error: 'Usuario no tiene suscripciones push activas'
            });
        }

        // Preparar payload de notificación
        const payload = JSON.stringify({
            title: titulo,
            body: mensaje,
            icon: icono || '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            url: url || '/',
            timestamp: Date.now()
        });

        let enviadas = 0;
        let errores = 0;
        const erroresDetalle = [];

        // Enviar notificación a cada suscripción
        for (const subscription of subscriptions) {
            try {
                const pushSubscription = {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: subscription.p256dh,
                        auth: subscription.auth
                    }
                };

                await webpush.sendNotification(pushSubscription, payload);
                enviadas++;

                // Actualizar fecha de último uso
                await supabase
                    .from('push_subscriptions')
                    .update({ fecha_ultimo_uso: new Date().toISOString() })
                    .eq('id', subscription.id);

            } catch (error) {
                errores++;
                erroresDetalle.push({
                    subscription_id: subscription.id,
                    error: error.message
                });

                // Si la suscripción expiró o es inválida, marcarla como inactiva
                if (error.statusCode === 410 || error.statusCode === 404) {
                    await supabase
                        .from('push_subscriptions')
                        .update({ activo: false })
                        .eq('id', subscription.id);
                }

                console.error(`Error enviando push a suscripción ${subscription.id}:`, error.message);
            }
        }

        return res.status(200).json({
            success: true,
            enviadas: enviadas,
            errores: errores,
            total_suscripciones: subscriptions.length,
            errores_detalle: erroresDetalle.length > 0 ? erroresDetalle : undefined
        });

    } catch (error) {
        console.error('Error en enviar-push-notification:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            detalles: error.message
        });
    }
}
