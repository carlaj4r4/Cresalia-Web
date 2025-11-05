// ===== CRESALIA PAYMENT SYSTEM =====
// Sistema de pagos integrado con Mercado Pago y Stripe

class PaymentSystem {
    constructor() {
        this.providers = {
            mercadopago: {
                name: 'Mercado Pago',
                publicKey: 'TEST-12345678-1234-1234-1234-123456789012', // Reemplazar con tu clave real
                accessToken: 'TEST-1234567890123456-123456-123456789012345678901234567890-123456789', // Reemplazar con tu token real
                sandbox: true // Cambiar a false en producción
            },
            stripe: {
                name: 'Stripe',
                publicKey: 'pk_test_123456789012345678901234567890123456789012345678901234567890', // Reemplazar con tu clave real
                secretKey: 'sk_test_123456789012345678901234567890123456789012345678901234567890', // Solo en backend
                sandbox: true
            }
        };
        
        this.init();
    }

    init() {
        this.loadPaymentScripts();
        console.log('💳 Payment System iniciado');
    }

    // ===== CARGA DE SCRIPTS =====
    loadPaymentScripts() {
        // Cargar Mercado Pago SDK
        if (!document.querySelector('script[src*="mercadopago"]')) {
            const mpScript = document.createElement('script');
            mpScript.src = 'https://sdk.mercadopago.com/js/v2';
            mpScript.onload = () => {
                window.MercadoPago = new window.MercadoPago(this.providers.mercadopago.publicKey);
                console.log('✅ Mercado Pago SDK cargado');
            };
            document.head.appendChild(mpScript);
        }

        // Cargar Stripe SDK
        if (!document.querySelector('script[src*="stripe"]')) {
            const stripeScript = document.createElement('script');
            stripeScript.src = 'https://js.stripe.com/v3/';
            stripeScript.onload = () => {
                window.stripe = window.Stripe(this.providers.stripe.publicKey);
                console.log('✅ Stripe SDK cargado');
            };
            document.head.appendChild(stripeScript);
        }
    }

    // ===== PROCESAMIENTO DE PAGOS =====
    async processPayment(tenant, plan, amount) {
        try {
            console.log(`💳 Procesando pago para ${tenant.nombre}: $${amount} (${plan})`);
            
            // Mostrar modal de pago
            const paymentMethod = await this.showPaymentModal(tenant, plan, amount);
            
            if (!paymentMethod) {
                return { success: false, error: 'Pago cancelado por el usuario' };
            }

            // Procesar según el método elegido
            let result;
            if (paymentMethod === 'mercadopago') {
                result = await this.processMercadoPagoPayment(tenant, plan, amount);
            } else if (paymentMethod === 'stripe') {
                result = await this.processStripePayment(tenant, plan, amount);
            }

            return result;
        } catch (error) {
            console.error('Error procesando pago:', error);
            return { success: false, error: error.message };
        }
    }

    // ===== MODAL DE SELECCIÓN DE PAGO =====
    async showPaymentModal(tenant, plan, amount) {
        return new Promise((resolve) => {
            const modalHTML = `
                <div id="paymentModal" class="payment-modal">
                    <div class="payment-modal-content">
                        <div class="payment-header">
                            <h3>💳 Método de Pago</h3>
                            <button onclick="window.paymentSystem.closePaymentModal()" class="close-btn">&times;</button>
                        </div>
                        
                        <div class="payment-info">
                            <p><strong>Plan:</strong> ${plan}</p>
                            <p><strong>Monto:</strong> $${amount}</p>
                            <p><strong>Tienda:</strong> ${tenant.nombre}</p>
                        </div>
                        
                        <div class="payment-methods">
                            <button onclick="window.paymentSystem.selectPaymentMethod('mercadopago')" class="payment-btn mercadopago-btn">
                                <img src="https://imgmp.mlstatic.com/org-img/banners/ar/medios/online/468X60.jpg" alt="Mercado Pago">
                                <span>Mercado Pago</span>
                            </button>
                            
                            <button onclick="window.paymentSystem.selectPaymentMethod('stripe')" class="payment-btn stripe-btn">
                                <img src="https://js.stripe.com/v3/fingerprinted/img/1f0fbb9d0f1b06d3c2f8c8c8c8c8c8c8.svg" alt="Stripe">
                                <span>Tarjeta de Crédito</span>
                            </button>
                        </div>
                        
                        <div class="payment-security">
                            <p>🔒 Pagos 100% seguros</p>
                            <p>💜 Tu información está protegida</p>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Guardar callback
            window.paymentSystem.paymentCallback = resolve;
        });
    }

    selectPaymentMethod(method) {
        console.log('💳 Método de pago seleccionado:', method);
        if (window.paymentSystem.paymentCallback) {
            window.paymentSystem.paymentCallback(method);
            window.paymentSystem.paymentCallback = null;
        }
        this.closePaymentModal();
    }

    closePaymentModal() {
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.remove();
        }
    }

    // ===== MERCADO PAGO =====
    async processMercadoPagoPayment(tenant, plan, amount) {
        try {
            // Crear preferencia de pago
            const preference = {
                items: [{
                    title: `Suscripción ${plan} - ${tenant.nombre}`,
                    unit_price: amount,
                    quantity: 1
                }],
                payer: {
                    // Solo email para verificación interna
                    // El nombre comercial será "Cresalia"
                    email: tenant.email
                },
                statement_descriptor: 'Cresalia', // Lo que verá el cliente
                back_urls: {
                    success: `${window.location.origin}/success.html?tenant=${tenant.id}&plan=${plan}`,
                    failure: `${window.location.origin}/failure.html?tenant=${tenant.id}`,
                    pending: `${window.location.origin}/pending.html?tenant=${tenant.id}`
                },
                auto_return: 'approved',
                external_reference: `cresalia_${tenant.id}_${Date.now()}`,
                metadata: {
                    // NO incluir datos personales
                    plataforma: 'cresalia',
                    tipo: 'suscripcion'
                }
            };

            // Crear preferencia en el backend
            const response = await fetch('/api/payments/mercadopago/preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(preference)
            });

            const result = await response.json();
            
            if (result.success) {
                // Redirigir a Mercado Pago
                window.location.href = result.init_point;
                return { success: true, redirect: true };
            } else {
                throw new Error(result.error || 'Error creando preferencia de pago');
            }
        } catch (error) {
            console.error('Error con Mercado Pago:', error);
            return { success: false, error: error.message };
        }
    }

    // ===== STRIPE =====
    async processStripePayment(tenant, plan, amount) {
        try {
            // Crear intención de pago
            const response = await fetch('/api/payments/stripe/intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({
                    amount: amount * 100, // Stripe usa centavos
                    currency: 'usd',
                    metadata: {
                        tenant_id: tenant.id,
                        plan: plan,
                        tenant_name: tenant.nombre
                    }
                })
            });

            const result = await response.json();
            
            if (result.success) {
                // Mostrar formulario de Stripe
                return await this.showStripeForm(result.client_secret, tenant, plan, amount);
            } else {
                throw new Error(result.error || 'Error creando intención de pago');
            }
        } catch (error) {
            console.error('Error con Stripe:', error);
            return { success: false, error: error.message };
        }
    }

    async showStripeForm(clientSecret, tenant, plan, amount) {
        return new Promise((resolve) => {
            const formHTML = `
                <div id="stripeModal" class="stripe-modal">
                    <div class="stripe-modal-content">
                        <div class="stripe-header">
                            <h3>💳 Tarjeta de Crédito</h3>
                            <button onclick="paymentSystem.closeStripeModal()" class="close-btn">&times;</button>
                        </div>
                        
                        <div class="stripe-info">
                            <p><strong>Plan:</strong> ${plan} - $${amount}</p>
                        </div>
                        
                        <form id="stripe-form">
                            <div id="card-element"></div>
                            <button type="submit" id="stripe-submit" class="stripe-submit-btn">
                                💳 Pagar $${amount}
                            </button>
                        </form>
                        
                        <div class="stripe-security">
                            <p>🔒 Procesado por Stripe</p>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', formHTML);
            
            // Configurar Stripe Elements
            const elements = window.stripe.elements();
            const cardElement = elements.create('card');
            cardElement.mount('#card-element');
            
            // Manejar envío del formulario
            document.getElementById('stripe-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitButton = document.getElementById('stripe-submit');
                submitButton.disabled = true;
                submitButton.textContent = 'Procesando...';
                
                try {
                    const result = await window.stripe.confirmCardPayment(clientSecret, {
                        payment_method: {
                            card: cardElement
                        }
                    });
                    
                    if (result.error) {
                        throw new Error(result.error.message);
                    } else {
                        resolve({ success: true, payment_intent: result.paymentIntent });
                    }
                } catch (error) {
                    resolve({ success: false, error: error.message });
                } finally {
                    this.closeStripeModal();
                }
            });
        });
    }

    closeStripeModal() {
        const modal = document.getElementById('stripeModal');
        if (modal) {
            modal.remove();
        }
    }

    // ===== UTILIDADES =====
    getToken() {
        return localStorage.getItem('authToken') || '';
    }

    // ===== MÉTODOS PÚBLICOS =====
    async createSubscription(tenant, plan, amount) {
        return await this.processPayment(tenant, plan, amount);
    }

    async renewSubscription(tenant, plan, amount) {
        return await this.processPayment(tenant, plan, amount);
    }
}

// ===== INSTANCIA GLOBAL =====
window.paymentSystem = new PaymentSystem();

// ===== ESTILOS CSS =====
const paymentStyles = `
    <style>
        .payment-modal, .stripe-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        .payment-modal-content, .stripe-modal-content {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        }

        .payment-header, .stripe-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .payment-methods {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin: 20px 0;
        }

        .payment-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            padding: 15px;
            border: 2px solid #E5E7EB;
            border-radius: 10px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
        }

        .payment-btn:hover {
            border-color: #7C3AED;
            transform: translateY(-2px);
        }

        .payment-btn img {
            height: 30px;
        }

        #card-element {
            padding: 15px;
            border: 2px solid #E5E7EB;
            border-radius: 8px;
            margin: 20px 0;
        }

        .stripe-submit-btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #7C3AED, #EC4899);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
        }

        .stripe-submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', paymentStyles);

console.log('✅ Payment System cargado');














