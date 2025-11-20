// ===== INTEGRACIÓN CON PAYPAL PARA CRESALIA =====
// Sistema de pagos con PayPal Business
// Co-fundadores: Crisla & Claude

// ===== CONFIGURACIÓN PAYPAL =====
const PAYPAL_CONFIG = typeof window !== 'undefined' && window.CONFIG_PAYPAL 
    ? window.CONFIG_PAYPAL
    : {
        // Credenciales de PayPal Business
        clientId: (typeof window !== 'undefined' && window.__PAYPAL_CLIENT_ID__)
            || (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID)
            || (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.PAYPAL_CLIENT_ID)
            || 'CONFIGURAR_EN_VERCEL',
        clientSecret: (typeof window !== 'undefined' && window.__PAYPAL_CLIENT_SECRET__)
            || (typeof process !== 'undefined' && process.env && process.env.PAYPAL_CLIENT_SECRET)
            || (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.PAYPAL_CLIENT_SECRET)
            || 'CONFIGURAR_EN_VERCEL',
        
        // Configuración
        environment: 'production', // 'sandbox' o 'production'
        currency: 'USD', // PayPal usa USD como base
        locale: 'es_ES',
        enabled: true,
        
        // Configuración de privacidad
        brandName: 'Cresalia',
        statementDescriptor: 'Cresalia',
        ocultarDatosPersonales: true
    };

// Inicializar PayPal SDK
let paypalLoaded = false;

function cargarPayPalSDK() {
    return new Promise((resolve, reject) => {
        if (paypalLoaded && typeof paypal !== 'undefined') {
            resolve(paypal);
            return;
        }
        
        // Cargar PayPal SDK
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.clientId}&currency=${PAYPAL_CONFIG.currency}&locale=${PAYPAL_CONFIG.locale}`;
        script.async = true;
        
        script.onload = () => {
            paypalLoaded = true;
            console.log('✅ PayPal SDK cargado correctamente');
            resolve(paypal);
        };
        
        script.onerror = () => {
            console.error('❌ Error cargando PayPal SDK');
            reject(new Error('No se pudo cargar PayPal SDK'));
        };
        
        document.head.appendChild(script);
    });
}

// ===== CREAR ORDEN DE PAGO =====
async function crearOrdenPayPal(descripcion, monto, referenciaExterna) {
    try {
        const paypal = await cargarPayPalSDK();
        
        if (!paypal) {
            throw new Error('PayPal SDK no está disponible');
        }
        
        // El monto debe estar en USD para PayPal
        const montoUSD = typeof monto === 'number' ? monto : parseFloat(monto);
        
        return {
            purchase_units: [{
                description: descripcion,
                amount: {
                    currency_code: PAYPAL_CONFIG.currency,
                    value: montoUSD.toFixed(2)
                },
                custom_id: referenciaExterna,
                invoice_id: referenciaExterna
            }],
            application_context: {
                brand_name: PAYPAL_CONFIG.brandName,
                landing_page: 'BILLING',
                user_action: 'PAY_NOW',
                return_url: `${window.location.origin}/success.html?payment_method=paypal`,
                cancel_url: `${window.location.origin}/failure.html?payment_method=paypal`
            }
        };
    } catch (error) {
        console.error('Error creando orden PayPal:', error);
        throw error;
    }
}

// ===== CREAR BOTÓN DE PAGO PAYPAL =====
async function crearBotonPayPal(contenedorId, descripcion, monto, referenciaExterna, onApprove, onError) {
    try {
        const paypal = await cargarPayPalSDK();
        
        if (!paypal) {
            throw new Error('PayPal SDK no está disponible');
        }
        
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) {
            throw new Error(`Contenedor ${contenedorId} no encontrado`);
        }
        
        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Crear botón de PayPal
        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'paypal'
            },
            createOrder: async (data, actions) => {
                const orden = await crearOrdenPayPal(descripcion, monto, referenciaExterna);
                return actions.order.create(orden);
            },
            onApprove: async (data, actions) => {
                try {
                    const detalles = await actions.order.capture();
                    
                    if (onApprove) {
                        onApprove(detalles, data);
                    }
                    
                    console.log('✅ Pago PayPal completado:', detalles);
                    return detalles;
                } catch (error) {
                    console.error('Error capturando pago PayPal:', error);
                    if (onError) {
                        onError(error);
                    }
                    throw error;
                }
            },
            onError: (error) => {
                console.error('❌ Error en PayPal:', error);
                if (onError) {
                    onError(error);
                }
            },
            onCancel: (data) => {
                console.log('⚠️ Pago PayPal cancelado:', data);
                if (onError) {
                    onError(new Error('Pago cancelado por el usuario'));
                }
            }
        }).render(`#${contenedorId}`);
        
    } catch (error) {
        console.error('Error creando botón PayPal:', error);
        throw error;
    }
}

// ===== VERIFICAR PAGO PAYPAL =====
async function verificarPagoPayPal(ordenId) {
    try {
        // En producción, esto debería verificarse en el backend
        // Por ahora, retornamos éxito si la orden existe
        const response = await fetch(`/api/paypal/orders/${ordenId}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            throw new Error('Error verificando pago');
        }
    } catch (error) {
        console.error('Error verificando pago PayPal:', error);
        return { success: false, error: error.message };
    }
}

// ===== EXPORTAR FUNCIONES =====
if (typeof window !== 'undefined') {
    window.PayPalIntegration = {
        crearOrdenPayPal,
        crearBotonPayPal,
        verificarPagoPayPal,
        cargarPayPalSDK,
        config: PAYPAL_CONFIG
    };
    
    // Hacer disponible también como CONFIG_PAYPAL
    window.CONFIG_PAYPAL = PAYPAL_CONFIG;
}

// Si es un módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        crearOrdenPayPal,
        crearBotonPayPal,
        verificarPagoPayPal,
        cargarPayPalSDK,
        PAYPAL_CONFIG
    };
}






