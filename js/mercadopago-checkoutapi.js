/**
 * 💳 Integración de Mercado Pago CheckoutAPI para Cresalia
 * Usa el endpoint backend para crear preferencias de pago de forma segura
 */

(function() {
    'use strict';

    const MERCADOPAGO_CHECKOUTAPI = {
        baseUrl: window.location.protocol === 'file:' 
            ? 'https://cresalia-web.vercel.app' 
            : '',
        enabled: true
    };

    /**
     * Crear una preferencia de pago usando CheckoutAPI
     * @param {Object} options - Opciones de la preferencia
     * @param {Array} options.items - Items a pagar
     * @param {Object} options.payer - Información del pagador
     * @param {Object} options.back_urls - URLs de retorno (success, failure, pending)
     * @param {String} options.external_reference - Referencia externa (opcional)
     * @param {String} options.statement_descriptor - Alias para proteger anonimato (default: 'Cresalia')
     * @returns {Promise<Object>} - Preferencia creada
     */
    window.crearPreferenciaMercadoPago = async function(options = {}) {
        if (!MERCADOPAGO_CHECKOUTAPI.enabled) {
            throw new Error('Mercado Pago CheckoutAPI está deshabilitado');
        }

        const {
            items = [],
            payer = {},
            back_urls = {},
            external_reference = null,
            statement_descriptor = 'Cresalia',  // 🔒 Alias para proteger anonimato
            metadata = {},
            payment_methods = {}
        } = options;

        // Validaciones básicas
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('Debés proporcionar al menos un item para pagar');
        }

        // Construir el payload
        const payload = {
            items: items.map(item => ({
                title: item.title || item.nombre || 'Producto',
                description: item.description || item.descripcion || item.title || 'Producto',
                quantity: parseInt(item.quantity) || 1,
                unit_price: parseFloat(item.unit_price) || parseFloat(item.precio) || 0,
                currency_id: item.currency_id || 'ARS',
                picture_url: item.picture_url || item.imagen || null,
                category_id: item.category_id || 'others'
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
                } : undefined
            },
            back_urls: {
                success: back_urls.success || `${window.location.origin}/pago-exitoso.html`,
                failure: back_urls.failure || `${window.location.origin}/pago-fallido.html`,
                pending: back_urls.pending || `${window.location.origin}/pago-pendiente.html`
            },
            external_reference: external_reference || `cresalia_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            statement_descriptor: statement_descriptor,  // 🔒 Protege tu anonimato
            metadata: {
                ...metadata,
                platform: 'Cresalia',
                created_at: new Date().toISOString()
            },
            payment_methods: {
                installments: payment_methods.installments || 12,  // Máximo de cuotas
                excluded_payment_methods: payment_methods.excluded_payment_methods || [],
                excluded_payment_types: payment_methods.excluded_payment_types || []
            },
            auto_return: 'approved',  // Redirigir automáticamente cuando se apruebe
            expires: true,
            expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()  // Expira en 24 horas
        };

        try {
            console.log('💰 Creando preferencia de pago...', payload);

            const response = await fetch(`${MERCADOPAGO_CHECKOUTAPI.baseUrl}/api/mercadopago-preference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Error al crear la preferencia de pago');
            }

            console.log('✅ Preferencia creada:', data.preference_id);
            console.log('🔗 URL de checkout:', data.init_point);

            return {
                success: true,
                preference_id: data.preference_id,
                init_point: data.init_point,
                sandbox_init_point: data.sandbox_init_point,
                external_reference: data.external_reference,
                expires_at: data.expires_at
            };

        } catch (error) {
            console.error('❌ Error creando preferencia de pago:', error.message);
            throw error;
        }
    };

    /**
     * Redirigir al checkout de Mercado Pago
     * @param {Object} options - Opciones de la preferencia
     * @returns {Promise<void>}
     */
    window.redirigirACheckoutMercadoPago = async function(options = {}) {
        try {
            const preferencia = await window.crearPreferenciaMercadoPago(options);
            
            if (preferencia.success && preferencia.init_point) {
                console.log('🔄 Redirigiendo al checkout de Mercado Pago...');
                window.location.href = preferencia.init_point;
            } else {
                throw new Error('No se pudo obtener la URL de checkout');
            }
        } catch (error) {
            console.error('❌ Error redirigiendo al checkout:', error.message);
            alert('Error al iniciar el pago. Por favor, intentá nuevamente.');
            throw error;
        }
    };

    /**
     * Crear preferencia para suscripción
     * @param {String} planId - ID del plan (free, basic, pro, enterprise)
     * @param {Object} datosUsuario - Datos del usuario
     * @returns {Promise<Object>}
     */
    window.crearPreferenciaSuscripcion = async function(planId, datosUsuario = {}) {
        const planes = {
            free: { nombre: 'Free', precio: 0, descripcion: 'Plan gratuito' },
            basic: { nombre: 'Basic', precio: 29, descripcion: 'Plan básico' },
            pro: { nombre: 'Pro', precio: 79, descripcion: 'Plan profesional' },
            enterprise: { nombre: 'Enterprise', precio: 199, descripcion: 'Plan empresarial' }
        };

        const plan = planes[planId];
        if (!plan) {
            throw new Error('Plan no válido');
        }

        if (plan.precio === 0) {
            // Plan gratuito, no necesita pago
            return {
                success: true,
                plan: planId,
                precio: 0,
                message: 'Plan gratuito activado'
            };
        }

        return await window.crearPreferenciaMercadoPago({
            items: [
                {
                    title: `Suscripción Cresalia - ${plan.nombre}`,
                    description: plan.descripcion,
                    quantity: 1,
                    unit_price: plan.precio,
                    currency_id: 'ARS'
                }
            ],
            payer: {
                name: datosUsuario.name || datosUsuario.nombre || 'Cliente',
                surname: datosUsuario.surname || datosUsuario.apellido || 'Cresalia',
                email: datosUsuario.email || 'cliente@cresalia.com'
            },
            external_reference: `suscripcion_${planId}_${Date.now()}`,
            statement_descriptor: 'Cresalia',  // 🔒 Alias para proteger anonimato
            metadata: {
                plan: planId,
                tipo: 'suscripcion',
                usuario_id: datosUsuario.id || null
            }
        });
    };

    console.log('✅ Mercado Pago CheckoutAPI cargado correctamente');

})();


