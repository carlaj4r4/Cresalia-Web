/**
 * 💳 API Endpoint: Crear Preferencia de Pago - Mercado Pago CheckoutAPI
 * Este endpoint crea una preferencia de pago usando el Access Token de Mercado Pago
 * Permite procesar múltiples métodos de pago (tarjetas, efectivo, transferencias)
 */

const { createClient } = require('@supabase/supabase-js');

// Función para aplicar CORS
function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Función para obtener el Access Token de Mercado Pago
function getMercadoPagoAccessToken() {
    // Leer de variables de entorno de Vercel
    return process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN_PROD || null;
}

// Función para obtener la Public Key (opcional, para validación)
function getMercadoPagoPublicKey() {
    return process.env.MERCADOPAGO_PUBLIC_KEY || process.env.MERCADOPAGO_PUBLIC_KEY_PROD || null;
}

module.exports = async (req, res) => {
    applyCors(res);
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            message: 'Método no permitido. Usa POST para crear una preferencia.' 
        });
    }
    
    try {
        const accessToken = getMercadoPagoAccessToken();
        
        if (!accessToken || accessToken === 'CONFIGURAR_EN_VERCEL') {
            return res.status(500).json({
                success: false,
                message: 'MERCADOPAGO_ACCESS_TOKEN no está configurado en Vercel. Por favor, configurá tus credenciales en Settings → Environment Variables.',
                error: 'ACCESS_TOKEN_NOT_CONFIGURED'
            });
        }
        
        // Parsear el body de la request
        const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        
        const {
            items = [],           // Array de items a pagar
            payer = {},           // Información del pagador
            back_urls = {},       // URLs de retorno (success, failure, pending)
            external_reference = null,  // Referencia externa (para identificar el pago)
            statement_descriptor = 'Cresalia',  // Descripción que aparece en el estado de cuenta (protege anonimato)
            metadata = {},        // Metadatos adicionales
            notification_url = null,  // URL para webhooks
            expires = true,       // Si la preferencia expira
            expiration_date_from = null,
            expiration_date_to = null,
            auto_return = 'approved',  // 'approved' | 'all' | null
            payment_methods = {}  // Configuración de métodos de pago
        } = payload;
        
        // Validaciones básicas
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debés proporcionar al menos un item para pagar.',
                error: 'INVALID_ITEMS'
            });
        }
        
        // Validar que cada item tenga los campos necesarios
        for (const item of items) {
            if (!item.title || !item.quantity || item.unit_price === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Cada item debe tener: title, quantity y unit_price.',
                    error: 'INVALID_ITEM_FORMAT'
                });
            }
        }
        
        // Construir la preferencia para Mercado Pago CheckoutAPI
        const preference = {
            items: items.map(item => ({
                id: item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: item.title,
                description: item.description || item.title,
                picture_url: item.picture_url || null,
                category_id: item.category_id || 'others',
                quantity: parseInt(item.quantity) || 1,
                currency_id: item.currency_id || 'ARS',
                unit_price: parseFloat(item.unit_price) || 0
            })),
            payer: {
                name: payer.name || payer.nombre || 'Cliente',
                surname: payer.surname || payer.apellido || 'Cresalia',
                email: payer.email || 'cliente@cresalia.com',
                phone: payer.phone ? {
                    area_code: payer.phone.area_code || '',
                    number: payer.phone.number || payer.phone || ''
                } : undefined,
                identification: payer.identification ? {
                    type: payer.identification.type || 'DNI',
                    number: payer.identification.number || ''
                } : undefined,
                address: payer.address ? {
                    zip_code: payer.address.zip_code || '',
                    street_name: payer.address.street_name || '',
                    street_number: payer.address.street_number || 0
                } : undefined
            },
            back_urls: {
                success: back_urls.success || `${req.headers.origin || 'https://cresalia-web.vercel.app'}/pago-exitoso`,
                failure: back_urls.failure || `${req.headers.origin || 'https://cresalia-web.vercel.app'}/pago-fallido`,
                pending: back_urls.pending || `${req.headers.origin || 'https://cresalia-web.vercel.app'}/pago-pendiente`
            },
            auto_return: auto_return,
            external_reference: external_reference || `cresalia_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            notification_url: notification_url || `${req.headers.origin || 'https://cresalia-web.vercel.app'}/api/webhook-mercadopago`,
            statement_descriptor: statement_descriptor,  // 🔒 Protege tu anonimato: esto es lo que aparece en el estado de cuenta
            metadata: {
                ...metadata,
                platform: 'Cresalia',
                created_at: new Date().toISOString(),
                version: '1.0.0'
            },
            payment_methods: {
                excluded_payment_methods: payment_methods.excluded_payment_methods || [],
                excluded_payment_types: payment_methods.excluded_payment_types || [],
                installments: payment_methods.installments || 12,  // Máximo de cuotas
                default_payment_method_id: payment_methods.default_payment_method_id || null,
                default_installments: payment_methods.default_installments || null
            },
            expires: expires,
            expiration_date_from: expiration_date_from || null,
            expiration_date_to: expiration_date_to || (expires ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null),  // Expira en 24 horas
            additional_info: payload.additional_info || ''
        };
        
        // Llamar a la API de Mercado Pago para crear la preferencia
        const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'X-Idempotency-Key': preference.external_reference  // Previene duplicados
            },
            body: JSON.stringify(preference)
        });
        
        if (!mpResponse.ok) {
            const errorText = await mpResponse.text();
            console.error('❌ Error de Mercado Pago:', mpResponse.status, errorText);
            
            try {
                const errorData = JSON.parse(errorText);
                return res.status(mpResponse.status).json({
                    success: false,
                    message: errorData.message || 'Error al crear la preferencia de pago.',
                    error: errorData.error || 'MERCADOPAGO_API_ERROR',
                    details: errorData.cause || []
                });
            } catch (parseError) {
                return res.status(mpResponse.status).json({
                    success: false,
                    message: 'Error al crear la preferencia de pago. Verificá tus credenciales.',
                    error: 'MERCADOPAGO_API_ERROR',
                    details: errorText
                });
            }
        }
        
        const preferenceData = await mpResponse.json();
        
        // Opcional: Guardar la preferencia en Supabase para tracking
        try {
            const supabaseUrl = process.env.SUPABASE_URL;
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
            
            if (supabaseUrl && supabaseKey) {
                const supabase = createClient(supabaseUrl, supabaseKey);
                
                // Intentar guardar en la tabla de preferencias (si existe)
                await supabase
                    .from('payment_preferences')
                    .insert({
                        id: preferenceData.id,
                        external_reference: preference.external_reference,
                        init_point: preferenceData.init_point,
                        sandbox_init_point: preferenceData.sandbox_init_point,
                        payer_email: payer.email,
                        items: items,
                        amount: items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0),
                        status: 'pending',
                        created_at: new Date().toISOString(),
                        expires_at: preference.expiration_date_to
                    })
                    .catch(err => {
                        // Si la tabla no existe, solo loguear el error
                        console.warn('⚠️ No se pudo guardar la preferencia en Supabase:', err.message);
                    });
            }
        } catch (supabaseError) {
            console.warn('⚠️ Error conectando con Supabase:', supabaseError.message);
            // Continuar aunque falle Supabase
        }
        
        // Retornar la respuesta exitosa
        return res.status(200).json({
            success: true,
            preference_id: preferenceData.id,
            init_point: preferenceData.init_point,  // URL para redirigir al checkout
            sandbox_init_point: preferenceData.sandbox_init_point,  // URL de sandbox (si aplica)
            external_reference: preference.external_reference,
            expires_at: preference.expiration_date_to,
            message: 'Preferencia de pago creada correctamente. Redirigí al usuario a init_point.'
        });
        
    } catch (error) {
        console.error('❌ Error en /api/mercadopago-preference:', error.message);
        console.error('Stack:', error.stack);
        
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear la preferencia de pago.',
            error: error.message
        });
    }
};


