/**
 * API Endpoint para enviar Push Notifications
 * POST /api/enviar-push-notification
 * 
 * Requiere: npm install web-push
 */

const webpush = require('web-push');

module.exports = async (req, res) => {
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        // Verificar que VAPID keys estén configuradas
        const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
        const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

        if (!vapidPublicKey || !vapidPrivateKey) {
            console.error('❌ VAPID keys no configuradas');
            return res.status(500).json({
                error: 'VAPID keys no configuradas. Configura VAPID_PUBLIC_KEY y VAPID_PRIVATE_KEY en Vercel.',
                tiene_public_key: !!vapidPublicKey,
                tiene_private_key: !!vapidPrivateKey
            });
        }

        // Validar formato de VAPID keys
        // Public key debe ser base64url (87 caracteres típicamente)
        // Private key debe ser base64url (43 caracteres típicamente)
        const publicKeyLength = vapidPublicKey.length;
        const privateKeyLength = vapidPrivateKey.length;
        
        console.log('🔍 Validando VAPID keys:');
        console.log(`  - Public Key length: ${publicKeyLength} (esperado: ~87)`);
        console.log(`  - Private Key length: ${privateKeyLength} (esperado: ~43)`);
        console.log(`  - Public Key preview: ${vapidPublicKey.substring(0, 20)}...`);
        console.log(`  - Private Key preview: ${vapidPrivateKey.substring(0, 20)}...`);

        // Intentar configurar VAPID keys con mejor manejo de errores
        try {
            // Limpiar las keys: remover espacios, saltos de línea, etc.
            const cleanPublicKey = vapidPublicKey.trim().replace(/\s+/g, '');
            const cleanPrivateKey = vapidPrivateKey.trim().replace(/\s+/g, '');
            
            // Validar que las keys no estén vacías después de limpiar
            if (!cleanPublicKey || !cleanPrivateKey) {
                throw new Error('VAPID keys están vacías después de limpiar');
            }
            
            // Intentar decodificar la public key para validar formato
            try {
                const decoded = Buffer.from(cleanPublicKey, 'base64url');
                if (decoded.length !== 65) {
                    console.warn(`⚠️ Public key decodificada tiene ${decoded.length} bytes (esperado: 65)`);
                    console.warn('💡 Esto puede causar problemas. Verifica que las keys sean correctas.');
                }
            } catch (decodeError) {
                console.warn('⚠️ No se pudo decodificar la public key para validar:', decodeError.message);
            }
            
            webpush.setVapidDetails(
                'mailto:cresalia@cresalia.com', // Contact email
                cleanPublicKey,
                cleanPrivateKey
            );
            console.log('✅ VAPID keys configuradas correctamente');
        } catch (vapidError) {
            console.error('❌ Error configurando VAPID keys:', vapidError.message);
            console.error('💡 Sugerencias:');
            console.error('   1. Verifica que las keys no tengan espacios extra');
            console.error('   2. Verifica que las keys estén en formato base64url');
            console.error('   3. Regenera las keys si es necesario usando: node scripts/generar-vapid-keys.js');
            return res.status(500).json({
                error: 'Error configurando VAPID keys',
                detalles: vapidError.message,
                public_key_length: publicKeyLength,
                private_key_length: privateKeyLength,
                sugerencia: 'Verifica que las keys estén correctamente formateadas en Vercel (sin espacios, formato base64url)'
            });
        }

        // Obtener datos del request
        const { user_id, titulo, mensaje, icono, url } = req.body;

        if (!user_id || !titulo || !mensaje) {
            return res.status(400).json({
                error: 'Faltan parámetros requeridos: user_id, titulo, mensaje'
            });
        }

        // Obtener suscripciones del usuario desde Supabase
        const { createClient } = require('@supabase/supabase-js');
        
        // Intentar múltiples nombres de variables para compatibilidad (igual que en cron-mensaje-festivo.js)
        const supabaseUrl = process.env.SUPABASE_URL_TIENDAS 
            || process.env.NEXT_PUBLIC_SUPABASE_URL_TIENDAS
            || process.env.SUPABASE_URL 
            || 'https://lvdgklwcgrmfbqwghxhl.supabase.co';
            
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY_TIENDAS
            || process.env.SUPABASE_SERVICE_ROLE_KEY
            || process.env.SUPABASE_ANON_KEY_TIENDAS
            || process.env.SUPABASE_ANON_KEY;

        if (!supabaseKey) {
            console.error('❌ Supabase KEY no configurada');
            console.error('Variables buscadas:', [
                'SUPABASE_SERVICE_ROLE_KEY_TIENDAS',
                'SUPABASE_SERVICE_ROLE_KEY',
                'SUPABASE_ANON_KEY_TIENDAS',
                'SUPABASE_ANON_KEY'
            ]);
            return res.status(500).json({
                error: 'Supabase no configurado',
                supabase_url: supabaseUrl,
                tiene_url: !!supabaseUrl,
                tiene_key: !!supabaseKey
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

                console.log(`📤 Enviando push a suscripción ${subscription.id} (endpoint: ${subscription.endpoint.substring(0, 50)}...)`);

                await webpush.sendNotification(pushSubscription, payload);
                enviadas++;
                console.log(`✅ Push enviado exitosamente a suscripción ${subscription.id}`);

                // Actualizar fecha de último uso
                await supabase
                    .from('push_subscriptions')
                    .update({ fecha_ultimo_uso: new Date().toISOString() })
                    .eq('id', subscription.id);

            } catch (error) {
                errores++;
                const errorInfo = {
                    subscription_id: subscription.id,
                    error: error.message,
                    statusCode: error.statusCode,
                    endpoint: subscription.endpoint ? subscription.endpoint.substring(0, 50) : 'N/A'
                };
                erroresDetalle.push(errorInfo);

                console.error(`❌ Error enviando push a suscripción ${subscription.id}:`, {
                    message: error.message,
                    statusCode: error.statusCode,
                    code: error.code,
                    endpoint: subscription.endpoint ? subscription.endpoint.substring(0, 50) : 'N/A'
                });

                // Si la suscripción expiró o es inválida, marcarla como inactiva
                if (error.statusCode === 410 || error.statusCode === 404 || error.statusCode === 401) {
                    console.log(`⚠️ Marcando suscripción ${subscription.id} como inactiva (status: ${error.statusCode})`);
                    await supabase
                        .from('push_subscriptions')
                        .update({ activo: false })
                        .eq('id', subscription.id);
                }
            }
        }

        console.log(`\n📊 Resumen de envío:`);
        console.log(`   - Total suscripciones: ${subscriptions.length}`);
        console.log(`   - Enviadas exitosamente: ${enviadas}`);
        console.log(`   - Errores: ${errores}`);
        
        return res.status(200).json({
            success: true,
            enviadas: enviadas,
            errores: errores,
            total_suscripciones: subscriptions.length,
            errores_detalle: erroresDetalle.length > 0 ? erroresDetalle : undefined,
            vapid_configurado: !!(vapidPublicKey && vapidPrivateKey),
            supabase_configurado: !!(supabaseUrl && supabaseKey)
        });

    } catch (error) {
        console.error('Error en enviar-push-notification:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            detalles: error.message
        });
    }
}
