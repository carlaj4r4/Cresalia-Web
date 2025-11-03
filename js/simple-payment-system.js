// ===== CRESALIA SIMPLE PAYMENT SYSTEM =====
// Sistema simplificado: suscripciones por link, ventas por MP personal

class SimplePaymentSystem {
    constructor() {
        this.plans = {
            'starter': { name: 'Starter', price: 0, features: ['Tienda básica', 'Soporte email'] },
            'basico': { name: 'Básico', price: 29, features: ['Tienda completa', 'Soporte prioritario', 'Analytics básicos'] },
            'pro': { name: 'Pro', price: 79, features: ['Todo Básico', 'Chatbot IA', 'Soporte 24/7', 'Analytics avanzados'] },
            'enterprise': { name: 'Enterprise', price: 199, features: ['Todo Pro', 'Account Manager', 'Desarrollo custom', 'SLA 99%'] }
        };

        // Tu información para recibir suscripciones
        this.cresaliaInfo = {
            name: 'Cresalia',
            email: 'carla.crimi.95@gmail.com',
            alias: 'cresalia.07.mp', // Cambia por tu alias de Mercado Pago (opcional)
            phone: '+543794735061', // Cambia por tu teléfono real
            description: 'Suscripción Cresalia'
        };

        this.init();
    }

    init() {
        this.loadMercadoPagoSDK();
        console.log('💳 Simple Payment System iniciado');
    }

    loadMercadoPagoSDK() {
        if (!document.querySelector('script[src*="mercadopago"]')) {
            const mpScript = document.createElement('script');
            mpScript.src = 'https://sdk.mercadopago.com/js/v2';
            mpScript.onload = () => {
                console.log('✅ Mercado Pago SDK cargado');
            };
            document.head.appendChild(mpScript);
        }
    }

    // ===== CONFIGURACIÓN SIMPLE DE VENTAS =====
    async setupSimpleStoreSales(tenantId) {
        try {
            console.log(`🔧 Configurando ventas simples para tienda: ${tenantId}`);
            
            const config = await this.showSimpleSalesSetupModal(tenantId);
            
            if (config) {
                await this.saveSimpleSalesConfig(tenantId, config);
                return { success: true, message: 'Configuración de ventas guardada' };
            }
            
            return { success: false, error: 'Configuración cancelada' };
        } catch (error) {
            console.error('Error configurando ventas simples:', error);
            return { success: false, error: error.message };
        }
    }

    async showSimpleSalesSetupModal(tenantId) {
        return new Promise((resolve) => {
            const modalHTML = `
                <div id="simpleSalesSetupModal" class="payment-setup-modal">
                    <div class="payment-setup-content">
                        <div class="setup-header">
                            <h3>💳 Configurar Ventas (Súper Simple)</h3>
                            <button onclick="simplePaymentSystem.closeSimpleSetupModal()" class="close-btn">&times;</button>
                        </div>
                        
                        <div class="setup-info">
                            <div class="info-card">
                                <h4>🏪 Cómo Funcionan los Pagos</h4>
                                <div class="payment-flow">
                                    <div class="flow-item">
                                        <h5>💼 Suscripciones a Cresalia</h5>
                                        <p>✅ Te pagan a tu cuenta personal de Mercado Pago</p>
                                        <p>✅ Planes: Básico ($29), Pro ($79), Enterprise ($199)</p>
                                        <p>✅ Links automáticos para que te paguen</p>
                                    </div>
                                    
                                    <div class="flow-item">
                                        <h5>🛍️ Ventas de tu Tienda</h5>
                                        <p>✅ Van a TU cuenta personal de Mercado Pago</p>
                                        <p>✅ Solo necesitas tu email de MP</p>
                                        <p>✅ 100% para ti, sin comisiones de Cresalia</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="commission-info">
                                <h4>💰 Súper Transparente</h4>
                                <ul>
                                    <li><strong>Suscripciones:</strong> Te pagan a cresalia.mp</li>
                                    <li><strong>Ventas:</strong> 100% para ti</li>
                                    <li><strong>Sin complicaciones:</strong> Cuentas personales normales</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="setup-form">
                            <h4>📧 Solo Necesitas tu Email de Mercado Pago</h4>
                            <p><em>No necesitas ser developer, solo tu cuenta personal</em></p>
                            
                            <div class="form-group">
                                <label>Email de tu cuenta personal de Mercado Pago:</label>
                                <input type="email" id="mpEmail" placeholder="tu-email@ejemplo.com" required>
                                <small>💡 El mismo email que usas para Mercado Pago personal</small>
                            </div>
                            
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="acceptTerms" required>
                                    Entiendo que solo configuro ventas, las suscripciones van a Cresalia
                                </label>
                            </div>
                        </div>
                        
                        <div class="setup-actions">
                            <button onclick="simplePaymentSystem.closeSimpleSetupModal()" class="cancel-btn">
                                🚫 Cancelar
                            </button>
                            <button onclick="simplePaymentSystem.saveSimpleSalesConfig('${tenantId}')" class="save-btn">
                                💾 Guardar (Súper Fácil)
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Guardar callback
            window.simplePaymentSystem.simpleSetupCallback = resolve;
        });
    }

    async saveSimpleSalesConfig(tenantId) {
        const email = document.getElementById('mpEmail').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;

        if (!email || !acceptTerms) {
            if (window.elegantNotifications) {
                window.elegantNotifications.show('Por favor completa el email y acepta los términos', 'warning');
            }
            return;
        }

        const config = {
            email: email,
            configured_at: new Date().toISOString(),
            type: 'simple_sales'
        };

        try {
            const response = await fetch(`/api/tenants/${tenantId}/simple-sales-config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            
            if (result.success) {
                this.closeSimpleSetupModal();
                if (window.simplePaymentSystem.simpleSetupCallback) {
                    window.simplePaymentSystem.simpleSetupCallback(config);
                    window.simplePaymentSystem.simpleSetupCallback = null;
                }
                
                if (window.elegantNotifications) {
                    window.elegantNotifications.show('✅ Configuración súper simple guardada!', 'success');
                }
            } else {
                throw new Error(result.error || 'Error guardando configuración');
            }
        } catch (error) {
            console.error('Error guardando configuración:', error);
            if (window.elegantNotifications) {
                window.elegantNotifications.show('Error guardando configuración: ' + error.message, 'error');
            }
        }
    }

    closeSimpleSetupModal() {
        const modal = document.getElementById('simpleSalesSetupModal');
        if (modal) {
            modal.remove();
        }
        if (window.simplePaymentSystem.simpleSetupCallback) {
            window.simplePaymentSystem.simpleSetupCallback(null);
            window.simplePaymentSystem.simpleSetupCallback = null;
        }
    }

    // ===== SUSCRIPCIONES SIMPLES (LINK PARA CRESALIA) =====
    async processSimpleSubscription(tenant, plan, amount) {
        try {
            console.log(`💳 Procesando suscripción simple para ${tenant.nombre}: $${amount} (${plan})`);
            console.log(`💰 Pago va a Cresalia: ${this.cresaliaInfo.email}`);

            // Mostrar modal con link de pago
            const paymentLink = await this.showSimpleSubscriptionModal(tenant, plan, amount);
            
            if (paymentLink) {
                return { success: true, redirect: true, link: paymentLink };
            }
            
            return { success: false, error: 'Pago cancelado' };
        } catch (error) {
            console.error('Error procesando suscripción simple:', error);
            return { success: false, error: error.message };
        }
    }

    async showSimpleSubscriptionModal(tenant, plan, amount) {
        return new Promise((resolve) => {
            const modalHTML = `
                <div id="simpleSubscriptionModal" class="payment-setup-modal">
                    <div class="payment-setup-content">
                        <div class="setup-header">
                            <h3>💳 Suscripción ${plan} - $${amount}</h3>
                            <button onclick="simplePaymentSystem.closeSimpleSubscriptionModal()" class="close-btn">&times;</button>
                        </div>
                        
                        <div class="subscription-info">
                            <div class="info-card">
                                <h4>🏢 Suscripción para Cresalia</h4>
                                <p><strong>Plan:</strong> ${plan}</p>
                                <p><strong>Monto:</strong> $${amount}</p>
                                <p><strong>Tienda:</strong> ${tenant.nombre}</p>
                                <p><strong>Recibe:</strong> ${this.cresaliaInfo.email}</p>
                            </div>
                            
                            <div class="payment-methods">
                                <h4>💳 Métodos de Pago Disponibles</h4>
                                
                                <button onclick="simplePaymentSystem.generateMercadoPagoLink('${tenant.id}', '${plan}', ${amount})" class="payment-method-btn">
                                    <img src="https://imgmp.mlstatic.com/org-img/banners/ar/medios/online/468X60.jpg" alt="Mercado Pago">
                                    <span>Pagar con Mercado Pago</span>
                                </button>
                                
                                <button onclick="simplePaymentSystem.generateQRCode('${tenant.id}', '${plan}', ${amount})" class="payment-method-btn">
                                    <span>📱</span>
                                    <span>Pagar con QR</span>
                                </button>
                                
                                <button onclick="simplePaymentSystem.generateBankTransfer('${tenant.id}', '${plan}', ${amount})" class="payment-method-btn">
                                    <span>🏦</span>
                                    <span>Transferencia Bancaria</span>
                                </button>
                            </div>
                            
                            <div class="payment-security">
                                <p>🔒 Pago 100% seguro</p>
                                <p>💜 Tu información está protegida</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Guardar callback
            window.simplePaymentSystem.subscriptionCallback = resolve;
        });
    }

    generateMercadoPagoLink(tenantId, plan, amount) {
        // Generar link de Mercado Pago
        const link = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${this.generatePreferenceId(tenantId, plan, amount)}`;
        
        // Copiar al portapapeles
        navigator.clipboard.writeText(link).then(() => {
            if (window.elegantNotifications) {
                window.elegantNotifications.show('✅ Link copiado al portapapeles! Envíalo por WhatsApp o email.', 'success');
            }
        });
        
        this.closeSimpleSubscriptionModal();
        if (window.simplePaymentSystem.subscriptionCallback) {
            window.simplePaymentSystem.subscriptionCallback(link);
            window.simplePaymentSystem.subscriptionCallback = null;
        }
    }

    generateQRCode(tenantId, plan, amount) {
        // Generar QR para pago
        const qrData = {
            tenant_id: tenantId,
            plan: plan,
            amount: amount,
            recipient: this.cresaliaInfo.email,
            timestamp: Date.now()
        };
        
        // Mostrar QR (en producción usarías una librería de QR)
        if (window.elegantNotifications) {
            window.elegantNotifications.show('📱 QR generado! (En producción se mostraría el código QR)', 'info');
        }
        
        this.closeSimpleSubscriptionModal();
        if (window.simplePaymentSystem.subscriptionCallback) {
            window.simplePaymentSystem.subscriptionCallback('qr_generated');
            window.simplePaymentSystem.subscriptionCallback = null;
        }
    }

    generateBankTransfer(tenantId, plan, amount) {
        // Generar datos para transferencia
        const transferData = {
            recipient: 'Cresalia',
            email: this.cresaliaInfo.email,
            amount: amount,
            plan: plan,
            reference: `Cresalia ${plan} - ${tenantId}`
        };
        
        const transferInfo = `
            Datos para Transferencia:
            
            Destinatario: Cresalia
            Email: ${transferData.email}
            Monto: $${transferData.amount}
            Concepto: ${transferData.reference}
            
            (Copia esta información para la transferencia)
        `;
        
        navigator.clipboard.writeText(transferInfo).then(() => {
            if (window.elegantNotifications) {
                window.elegantNotifications.show('✅ Datos de transferencia copiados!', 'success');
            }
        });
        
        this.closeSimpleSubscriptionModal();
        if (window.simplePaymentSystem.subscriptionCallback) {
            window.simplePaymentSystem.subscriptionCallback('transfer_data');
            window.simplePaymentSystem.subscriptionCallback = null;
        }
    }

    generatePreferenceId(tenantId, plan, amount) {
        // Generar ID único para la preferencia
        return `cresalia_${tenantId}_${plan}_${Date.now()}`;
    }

    closeSimpleSubscriptionModal() {
        const modal = document.getElementById('simpleSubscriptionModal');
        if (modal) {
            modal.remove();
        }
    }

    // ===== VENTAS SIMPLES (MP PERSONAL) =====
    async processSimpleSale(tenant, product, amount) {
        try {
            console.log(`🛍️ Procesando venta simple para ${tenant.nombre}: $${amount}`);
            
            // Obtener configuración simple de la tienda
            const salesConfig = await this.getSimpleSalesConfig(tenant.id);
            
            if (!salesConfig) {
                return { 
                    success: false, 
                    error: 'Configuración de ventas no encontrada',
                    action: 'setup_simple_sales'
                };
            }

            console.log(`💰 Pago va a la tienda: ${salesConfig.email}`);

            // Crear link de pago simple
            const paymentLink = this.generateSimplePaymentLink(tenant, salesConfig, product, amount);
            
            return { success: true, link: paymentLink };
        } catch (error) {
            console.error('Error procesando venta simple:', error);
            return { success: false, error: error.message };
        }
    }

    generateSimplePaymentLink(tenant, salesConfig, product, amount) {
        // Generar link simple de Mercado Pago
        const preferenceId = `store_sale_${tenant.id}_${Date.now()}`;
        const link = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
        
        // Guardar en backend
        this.saveSimpleSale(tenant.id, product, amount, preferenceId, salesConfig.email);
        
        return link;
    }

    async saveSimpleSale(tenantId, product, amount, preferenceId, storeEmail) {
        try {
            const response = await fetch('/api/payments/simple-sale', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({
                    tenant_id: tenantId,
                    product: product,
                    amount: amount,
                    preference_id: preferenceId,
                    store_email: storeEmail
                })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error guardando venta simple:', error);
            return { success: false, error: error.message };
        }
    }

    async getSimpleSalesConfig(tenantId) {
        try {
            const response = await fetch(`/api/tenants/${tenantId}/simple-sales-config`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });

            const result = await response.json();
            return result.success ? result.config : null;
        } catch (error) {
            console.error('Error obteniendo configuración simple:', error);
            return null;
        }
    }

    // ===== MÉTODOS PÚBLICOS =====
    getToken() {
        return localStorage.getItem('authToken') || '';
    }

    async setupStoreSales(tenantId) {
        return await this.setupSimpleStoreSales(tenantId);
    }

    async processSubscription(tenant, plan, amount) {
        return await this.processSimpleSubscription(tenant, plan, amount);
    }

    async processSale(tenant, product, amount) {
        return await this.processSimpleSale(tenant, product, amount);
    }
}

// ===== INSTANCIA GLOBAL =====
window.simplePaymentSystem = new SimplePaymentSystem();

// ===== ESTILOS CSS =====
const simplePaymentStyles = `
    <style>
        .payment-setup-modal {
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
            overflow-y: auto;
        }

        .payment-setup-content {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }

        .setup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #F3F4F6;
        }

        .setup-header h3 {
            color: #7C3AED;
            margin: 0;
        }

        .payment-flow {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }

        .flow-item {
            background: #F8FAFC;
            border: 2px solid #E2E8F0;
            border-radius: 12px;
            padding: 20px;
        }

        .flow-item h5 {
            color: #374151;
            margin: 0 0 15px 0;
            font-size: 18px;
        }

        .flow-item p {
            margin: 8px 0;
            color: #6B7280;
            font-size: 14px;
        }

        .info-card {
            background: #F0F9FF;
            border: 2px solid #0EA5E9;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .info-card h4 {
            color: #0369A1;
            margin: 0 0 15px 0;
        }

        .commission-info {
            background: #F0FDF4;
            border: 2px solid #22C55E;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .commission-info h4 {
            color: #15803D;
            margin: 0 0 15px 0;
        }

        .commission-info ul {
            margin: 0;
            padding-left: 20px;
        }

        .commission-info li {
            margin-bottom: 8px;
            color: #374151;
        }

        .setup-form {
            margin: 20px 0;
        }

        .setup-form h4 {
            color: #374151;
            margin-bottom: 20px;
        }

        .setup-form p {
            color: #6B7280;
            font-style: italic;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #374151;
        }

        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #E5E7EB;
            border-radius: 8px;
            font-size: 16px;
        }

        .form-group input:focus {
            outline: none;
            border-color: #7C3AED;
        }

        .form-group small {
            display: block;
            margin-top: 5px;
            color: #6B7280;
            font-size: 14px;
        }

        .setup-actions {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
            margin-top: 30px;
        }

        .cancel-btn, .save-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .cancel-btn {
            background: #EF4444;
            color: white;
        }

        .cancel-btn:hover {
            background: #DC2626;
        }

        .save-btn {
            background: linear-gradient(135deg, #7C3AED, #EC4899);
            color: white;
        }

        .save-btn:hover {
            background: linear-gradient(135deg, #6D28D9, #DB2777);
        }

        .payment-methods {
            margin: 20px 0;
        }

        .payment-methods h4 {
            color: #374151;
            margin-bottom: 20px;
        }

        .payment-method-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            width: 100%;
            padding: 15px;
            margin-bottom: 15px;
            border: 2px solid #E5E7EB;
            border-radius: 10px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
        }

        .payment-method-btn:hover {
            border-color: #7C3AED;
            transform: translateY(-2px);
        }

        .payment-method-btn img {
            height: 30px;
        }

        .payment-method-btn span {
            font-size: 18px;
            font-weight: 600;
        }

        .subscription-info {
            text-align: center;
        }

        .subscription-info .info-card {
            text-align: left;
        }

        .payment-security {
            background: #F0FDF4;
            border: 2px solid #22C55E;
            border-radius: 12px;
            padding: 15px;
            margin-top: 20px;
        }

        .payment-security p {
            margin: 5px 0;
            color: #15803D;
            font-weight: 600;
        }

        @media (max-width: 768px) {
            .payment-flow {
                grid-template-columns: 1fr;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', simplePaymentStyles);

console.log('✅ Simple Payment System cargado');
