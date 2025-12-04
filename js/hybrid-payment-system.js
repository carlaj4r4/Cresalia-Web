// ===== CRESALIA HYBRID PAYMENT SYSTEM =====
// Suscripciones van a Cresalia, ventas van a las tiendas

class HybridPaymentSystem {
    constructor() {
        this.plans = {
            'starter': { name: 'Starter', price: 0, features: ['Tienda básica', 'Soporte email'] },
            'basico': { name: 'Básico', price: 29, features: ['Tienda completa', 'Soporte prioritario', 'Analytics básicos'] },
            'pro': { name: 'Pro', price: 79, features: ['Todo Básico', 'Chatbot IA', 'Soporte 24/7', 'Analytics avanzados'] },
            'enterprise': { name: 'Enterprise', price: 199, features: ['Todo Pro', 'Account Manager', 'Desarrollo custom', 'SLA 99%'] }
        };

        // Configuración de Cresalia (tu cuenta de Mercado Pago)
        this.cresaliaConfig = {
            name: 'Cresalia',
            email: 'crisla965@gmail.com',
            access_token: 'TU_ACCESS_TOKEN_CRESALIA', // Reemplazar con tu token real
            public_key: 'TU_PUBLIC_KEY_CRESALIA' // Reemplazar con tu key real
        };

        this.init();
    }

    init() {
        this.loadMercadoPagoSDK();
        console.log('💳 Hybrid Payment System iniciado');
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

    // ===== CONFIGURACIÓN DE PAGOS POR TIENDA (SOLO PARA VENTAS) =====
    async setupStoreSalesPayment(tenantId) {
        try {
            console.log(`🔧 Configurando pagos de VENTAS para tienda: ${tenantId}`);
            
            const config = await this.showSalesPaymentSetupModal(tenantId);
            
            if (config) {
                await this.saveSalesPaymentConfig(tenantId, config);
                return { success: true, message: 'Configuración de ventas guardada' };
            }
            
            return { success: false, error: 'Configuración cancelada' };
        } catch (error) {
            console.error('Error configurando pagos de ventas:', error);
            return { success: false, error: error.message };
        }
    }

    async showSalesPaymentSetupModal(tenantId) {
        return new Promise((resolve) => {
            const modalHTML = `
                <div id="salesPaymentSetupModal" class="payment-setup-modal">
                    <div class="payment-setup-content">
                        <div class="setup-header">
                            <h3>💳 Configurar Pagos de VENTAS</h3>
                            <button onclick="hybridPaymentSystem.closeSalesSetupModal()" class="close-btn">&times;</button>
                        </div>
                        
                        <div class="setup-info">
                            <div class="info-card">
                                <h4>🏪 Cómo Funcionan los Pagos</h4>
                                <div class="payment-flow">
                                    <div class="flow-item">
                                        <h5>💼 Suscripciones a Cresalia</h5>
                                        <p>✅ Van directamente a la cuenta de <strong>Cresalia</strong></p>
                                        <p>✅ Planes: Básico ($29 ARS), Pro ($79 ARS), Enterprise ($199 ARS)</p>
                                        <p>✅ Pagos mensuales por usar la plataforma</p>
                                    </div>
                                    
                                    <div class="flow-item">
                                        <h5>🛍️ Ventas de tu Tienda</h5>
                                        <p>✅ Van directamente a <strong>TU cuenta</strong> de Mercado Pago</p>
                                        <p>✅ Productos y servicios que vendas</p>
                                        <p>✅ 100% para ti, sin comisiones de Cresalia</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="commission-info">
                                <h4>💰 Transparencia Total</h4>
                                <ul>
                                    <li><strong>Suscripciones:</strong> Para Cresalia (uso de la plataforma)</li>
                                    <li><strong>Ventas:</strong> 100% para ti (tus productos)</li>
                                    <li><strong>Comisión Mercado Pago:</strong> Solo en ventas (no en suscripciones)</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="setup-form">
                            <h4>🔑 Configurar Pagos de VENTAS (Solo)</h4>
                            <p><em>Las suscripciones se manejan automáticamente por Cresalia</em></p>
                            
                            <div class="form-group">
                                <label>Email de tu cuenta Mercado Pago:</label>
                                <input type="email" id="mpEmail" placeholder="tu-email@ejemplo.com" required>
                            </div>
                            
                            <div class="form-group">
                                <label>Access Token de Mercado Pago:</label>
                                <input type="password" id="mpAccessToken" placeholder="APP_USR-123456789..." required>
                                <small>💡 <a href="https://www.mercadopago.com.ar/developers/panel/credentials" target="_blank">¿Cómo obtener tu Access Token?</a></small>
                            </div>
                            
                            <div class="form-group">
                                <label>Public Key de Mercado Pago:</label>
                                <input type="text" id="mpPublicKey" placeholder="APP_USR-123456789..." required>
                                <small>💡 <a href="https://www.mercadopago.com.ar/developers/panel/credentials" target="_blank">¿Cómo obtener tu Public Key?</a></small>
                            </div>
                            
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="acceptTerms" required>
                                    Entiendo que solo configuro pagos de VENTAS, las suscripciones van a Cresalia
                                </label>
                            </div>
                        </div>
                        
                        <div class="setup-actions">
                            <button onclick="hybridPaymentSystem.closeSalesSetupModal()" class="cancel-btn">
                                🚫 Cancelar
                            </button>
                            <button onclick="hybridPaymentSystem.saveSalesPaymentConfig('${tenantId}')" class="save-btn">
                                💾 Guardar Configuración
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Guardar callback
            window.hybridPaymentSystem.salesSetupCallback = resolve;
        });
    }

    async saveSalesPaymentConfig(tenantId) {
        const email = document.getElementById('mpEmail').value;
        const accessToken = document.getElementById('mpAccessToken').value;
        const publicKey = document.getElementById('mpPublicKey').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;

        if (!email || !accessToken || !publicKey || !acceptTerms) {
            alert('Por favor completa todos los campos y acepta los términos');
            return;
        }

        const config = {
            email: email,
            access_token: accessToken,
            public_key: publicKey,
            configured_at: new Date().toISOString(),
            type: 'sales_only' // Solo para ventas
        };

        try {
            const response = await fetch(`/api/tenants/${tenantId}/sales-payment-config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            
            if (result.success) {
                const verification = await this.verifySalesPaymentConfig(tenantId, config);
                
                if (verification.success) {
                    this.closeSalesSetupModal();
                    if (window.hybridPaymentSystem.salesSetupCallback) {
                        window.hybridPaymentSystem.salesSetupCallback(config);
                        window.hybridPaymentSystem.salesSetupCallback = null;
                    }
                    
                    if (window.elegantNotifications) {
                        window.elegantNotifications.show('✅ Configuración de ventas guardada exitosamente', 'success');
                    }
                } else {
                    throw new Error('Error verificando configuración: ' + verification.error);
                }
            } else {
                throw new Error(result.error || 'Error guardando configuración');
            }
        } catch (error) {
            console.error('Error guardando configuración:', error);
            alert('Error guardando configuración: ' + error.message);
        }
    }

    async verifySalesPaymentConfig(tenantId, config) {
        try {
            const response = await fetch('/api/payments/verify-sales-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({
                    tenant_id: tenantId,
                    access_token: config.access_token,
                    public_key: config.public_key,
                    type: 'sales_only'
                })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    closeSalesSetupModal() {
        const modal = document.getElementById('salesPaymentSetupModal');
        if (modal) {
            modal.remove();
        }
        if (window.hybridPaymentSystem.salesSetupCallback) {
            window.hybridPaymentSystem.salesSetupCallback(null);
            window.hybridPaymentSystem.salesSetupCallback = null;
        }
    }

    // ===== PROCESAMIENTO DE SUSCRIPCIONES (PARA CRESALIA) =====
    async processSubscriptionPayment(tenant, plan, amount) {
        try {
            console.log(`💳 Procesando suscripción para ${tenant.nombre}: $${amount} (${plan})`);
            console.log('💰 Pago procesado para suscripción Cresalia');

            // Crear preferencia con la cuenta de Cresalia
            const preference = await this.createCresaliaSubscriptionPreference(tenant, plan, amount);
            
            if (preference.success) {
                // Redirigir a Mercado Pago con la cuenta de Cresalia
                window.location.href = preference.init_point;
                return { success: true, redirect: true };
            } else {
                throw new Error(preference.error);
            }
        } catch (error) {
            console.error('Error procesando suscripción:', error);
            return { success: false, error: error.message };
        }
    }

    async createCresaliaSubscriptionPreference(tenant, plan, amount) {
        try {
            const preference = {
                items: [
                    {
                        title: `Suscripción Cresalia ${plan} - ${tenant.nombre}`,
                        unit_price: amount,
                        quantity: 1,
                        description: `Plan ${plan} de Cresalia para ${tenant.nombre}`
                    }
                ],
                payer: {
                    name: tenant.nombre,
                    email: tenant.email
                },
                back_urls: {
                    success: `${window.location.origin}/success.html?tenant=${tenant.id}&plan=${plan}&amount=${amount}&type=subscription`,
                    failure: `${window.location.origin}/failure.html?tenant=${tenant.id}&type=subscription`,
                    pending: `${window.location.origin}/pending.html?tenant=${tenant.id}&type=subscription`
                },
                auto_return: 'approved',
                external_reference: `cresalia_sub_${tenant.id}_${Date.now()}`,
                metadata: {
                    type: 'subscription',
                    plan: plan,
                    tenant_id: tenant.id,
                    tenant_name: tenant.nombre
                }
            };

            // Crear preferencia usando la configuración de Cresalia
            const response = await fetch('/api/payments/mercadopago/cresalia-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({
                    tenant_id: tenant.id,
                    preference: preference,
                    cresalia_config: this.cresaliaConfig
                })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ===== PROCESAMIENTO DE VENTAS (PARA LAS TIENDAS) =====
    async processStoreSale(tenant, product, amount) {
        try {
            console.log(`🛍️ Procesando venta para ${tenant.nombre}: $${amount}`);
            
            // Obtener configuración de ventas de la tienda
            const salesConfig = await this.getSalesPaymentConfig(tenant.id);
            
            if (!salesConfig) {
                return { 
                    success: false, 
                    error: 'Configuración de ventas no encontrada',
                    action: 'setup_sales_payment'
                };
            }

            console.log('💰 Pago procesado para venta de tienda');

            // Crear preferencia con la cuenta de la tienda
            const preference = await this.createStoreSalePreference(tenant, salesConfig, product, amount);
            
            if (preference.success) {
                // Redirigir a Mercado Pago con la cuenta de la tienda
                window.location.href = preference.init_point;
                return { success: true, redirect: true };
            } else {
                throw new Error(preference.error);
            }
        } catch (error) {
            console.error('Error procesando venta:', error);
            return { success: false, error: error.message };
        }
    }

    async createStoreSalePreference(tenant, salesConfig, product, amount) {
        try {
            const preference = {
                items: [
                    {
                        title: product.nombre || 'Producto',
                        unit_price: amount,
                        quantity: 1,
                        description: `Venta de ${tenant.nombre}`
                    }
                ],
                payer: {
                    name: tenant.nombre,
                    email: tenant.email
                },
                back_urls: {
                    success: `${window.location.origin}/success.html?tenant=${tenant.id}&product=${product.id}&amount=${amount}&type=sale`,
                    failure: `${window.location.origin}/failure.html?tenant=${tenant.id}&type=sale`,
                    pending: `${window.location.origin}/pending.html?tenant=${tenant.id}&type=sale`
                },
                auto_return: 'approved',
                external_reference: `store_sale_${tenant.id}_${Date.now()}`,
                metadata: {
                    type: 'sale',
                    tenant_id: tenant.id,
                    tenant_name: tenant.nombre,
                    product_id: product.id
                }
            };

            // Crear preferencia usando la configuración de la tienda
            const response = await fetch('/api/payments/mercadopago/store-sale', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({
                    tenant_id: tenant.id,
                    preference: preference,
                    sales_config: salesConfig
                })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getSalesPaymentConfig(tenantId) {
        try {
            const response = await fetch(`/api/tenants/${tenantId}/sales-payment-config`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });

            const result = await response.json();
            return result.success ? result.config : null;
        } catch (error) {
            console.error('Error obteniendo configuración de ventas:', error);
            return null;
        }
    }

    // ===== MÉTODOS PÚBLICOS =====
    getToken() {
        return localStorage.getItem('authToken') || '';
    }

    async setupStoreSalesPayments(tenantId) {
        return await this.setupStoreSalesPayment(tenantId);
    }

    async processSubscription(tenant, plan, amount) {
        return await this.processSubscriptionPayment(tenant, plan, amount);
    }

    async processSale(tenant, product, amount) {
        return await this.processStoreSale(tenant, product, amount);
    }
}

// ===== INSTANCIA GLOBAL =====
window.hybridPaymentSystem = new HybridPaymentSystem();

// ===== ESTILOS CSS =====
const hybridPaymentStyles = `
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
            max-width: 700px;
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

        .form-group small a {
            color: #7C3AED;
            text-decoration: none;
        }

        .form-group small a:hover {
            text-decoration: underline;
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

        @media (max-width: 768px) {
            .payment-flow {
                grid-template-columns: 1fr;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', hybridPaymentStyles);

console.log('✅ Hybrid Payment System cargado');























