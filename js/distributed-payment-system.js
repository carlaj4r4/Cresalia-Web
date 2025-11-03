// ===== CRESALIA DISTRIBUTED PAYMENT SYSTEM =====
// Sistema de pagos distribuido - cada tienda recibe sus propios pagos

class DistributedPaymentSystem {
    constructor() {
        this.plans = {
            'starter': { name: 'Starter', price: 0, features: ['Tienda básica', 'Soporte email'] },
            'basico': { name: 'Básico', price: 29, features: ['Tienda completa', 'Soporte prioritario', 'Analytics básicos'] },
            'pro': { name: 'Pro', price: 79, features: ['Todo Básico', 'Chatbot IA', 'Soporte 24/7', 'Analytics avanzados'] },
            'enterprise': { name: 'Enterprise', price: 199, features: ['Todo Pro', 'Account Manager', 'Desarrollo custom', 'SLA 99%'] }
        };

        this.init();
    }

    init() {
        this.loadMercadoPagoSDK();
        console.log('💳 Distributed Payment System iniciado');
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

    // ===== CONFIGURACIÓN DE PAGOS POR TIENDA =====
    async setupStorePayment(tenantId) {
        try {
            console.log(`🔧 Configurando pagos para tienda: ${tenantId}`);
            
            // Mostrar modal de configuración
            const config = await this.showPaymentSetupModal(tenantId);
            
            if (config) {
                await this.savePaymentConfig(tenantId, config);
                return { success: true, message: 'Configuración de pagos guardada' };
            }
            
            return { success: false, error: 'Configuración cancelada' };
        } catch (error) {
            console.error('Error configurando pagos:', error);
            return { success: false, error: error.message };
        }
    }

    async showPaymentSetupModal(tenantId) {
        return new Promise((resolve) => {
            const modalHTML = `
                <div id="paymentSetupModal" class="payment-setup-modal">
                    <div class="payment-setup-content">
                        <div class="setup-header">
                            <h3>💳 Configurar Pagos para tu Tienda</h3>
                            <button onclick="distributedPaymentSystem.closeSetupModal()" class="close-btn">&times;</button>
                        </div>
                        
                        <div class="setup-info">
                            <div class="info-card">
                                <h4>🏪 Tu Tienda Recibe sus Propios Pagos</h4>
                                <p>✅ <strong>100% transparente:</strong> Todos los pagos van directamente a tu cuenta</p>
                                <p>✅ <strong>Sin intermediarios:</strong> Cresalia NO toca tu dinero</p>
                                <p>✅ <strong>Comisión de Cresalia:</strong> Solo se descuenta de la suscripción mensual</p>
                            </div>
                            
                            <div class="commission-info">
                                <h4>💰 Cómo Funcionan las Comisiones</h4>
                                <ul>
                                    <li><strong>Ventas de productos:</strong> 100% para ti</li>
                                    <li><strong>Suscripción a Cresalia:</strong> Se descuenta automáticamente</li>
                                    <li><strong>Comisión Mercado Pago:</strong> Se descuenta de cada pago</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="setup-form">
                            <h4>🔑 Configurar tu Cuenta de Mercado Pago</h4>
                            
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
                                    Acepto que mi cuenta de Mercado Pago reciba los pagos directamente
                                </label>
                            </div>
                        </div>
                        
                        <div class="setup-actions">
                            <button onclick="distributedPaymentSystem.closeSetupModal()" class="cancel-btn">
                                🚫 Cancelar
                            </button>
                            <button onclick="distributedPaymentSystem.savePaymentConfig('${tenantId}')" class="save-btn">
                                💾 Guardar Configuración
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Guardar callback
            window.distributedPaymentSystem.setupCallback = resolve;
        });
    }

    async savePaymentConfig(tenantId) {
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
            configured_at: new Date().toISOString()
        };

        try {
            // Guardar en backend
            const response = await fetch(`/api/tenants/${tenantId}/payment-config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            
            if (result.success) {
                // Verificar configuración
                const verification = await this.verifyPaymentConfig(tenantId, config);
                
                if (verification.success) {
                    this.closeSetupModal();
                    if (window.distributedPaymentSystem.setupCallback) {
                        window.distributedPaymentSystem.setupCallback(config);
                        window.distributedPaymentSystem.setupCallback = null;
                    }
                    
                    // Mostrar éxito
                    if (window.elegantNotifications) {
                        window.elegantNotifications.show('✅ Configuración de pagos guardada exitosamente', 'success');
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

    async verifyPaymentConfig(tenantId, config) {
        try {
            // Verificar que las credenciales funcionan
            const response = await fetch('/api/payments/verify-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({
                    tenant_id: tenantId,
                    access_token: config.access_token,
                    public_key: config.public_key
                })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    closeSetupModal() {
        const modal = document.getElementById('paymentSetupModal');
        if (modal) {
            modal.remove();
        }
        if (window.distributedPaymentSystem.setupCallback) {
            window.distributedPaymentSystem.setupCallback(null);
            window.distributedPaymentSystem.setupCallback = null;
        }
    }

    // ===== PROCESAMIENTO DE PAGOS DISTRIBUIDO =====
    async processDistributedPayment(tenant, plan, amount) {
        try {
            // Obtener configuración de pagos de la tienda
            const paymentConfig = await this.getPaymentConfig(tenant.id);
            
            if (!paymentConfig) {
                return { 
                    success: false, 
                    error: 'Configuración de pagos no encontrada',
                    action: 'setup_payment'
                };
            }

            // Calcular comisión de Cresalia
            const cresaliaCommission = this.calculateCresaliaCommission(amount);
            const netAmount = amount - cresaliaCommission;

            console.log(`💳 Procesando pago distribuido:`);
            console.log(`   Tienda: ${tenant.nombre}`);
            console.log(`   Monto total: $${amount}`);
            console.log(`   Comisión Cresalia: $${cresaliaCommission}`);
            console.log(`   Neto para tienda: $${netAmount}`);

            // Crear preferencia con la cuenta de la tienda
            const preference = await this.createStorePreference(tenant, paymentConfig, plan, amount, netAmount);
            
            if (preference.success) {
                // Redirigir a Mercado Pago con la cuenta de la tienda
                window.location.href = preference.init_point;
                return { success: true, redirect: true };
            } else {
                throw new Error(preference.error);
            }
        } catch (error) {
            console.error('Error procesando pago distribuido:', error);
            return { success: false, error: error.message };
        }
    }

    calculateCresaliaCommission(amount) {
        // Comisión del 10% para Cresalia
        return Math.round(amount * 0.1 * 100) / 100;
    }

    async createStorePreference(tenant, paymentConfig, plan, totalAmount, netAmount) {
        try {
            const preference = {
                items: [
                    {
                        title: `Suscripción ${plan} - ${tenant.nombre}`,
                        unit_price: totalAmount,
                        quantity: 1
                    }
                ],
                payer: {
                    name: tenant.nombre,
                    email: tenant.email
                },
                back_urls: {
                    success: `${window.location.origin}/success.html?tenant=${tenant.id}&plan=${plan}&amount=${totalAmount}`,
                    failure: `${window.location.origin}/failure.html?tenant=${tenant.id}`,
                    pending: `${window.location.origin}/pending.html?tenant=${tenant.id}`
                },
                auto_return: 'approved',
                external_reference: `cresalia_${tenant.id}_${Date.now()}`,
                // Información de comisión
                metadata: {
                    cresalia_commission: this.calculateCresaliaCommission(totalAmount),
                    net_amount: netAmount,
                    plan: plan
                }
            };

            // Crear preferencia usando la configuración de la tienda
            const response = await fetch('/api/payments/mercadopago/store-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({
                    tenant_id: tenant.id,
                    preference: preference,
                    payment_config: paymentConfig
                })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getPaymentConfig(tenantId) {
        try {
            const response = await fetch(`/api/tenants/${tenantId}/payment-config`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });

            const result = await response.json();
            return result.success ? result.config : null;
        } catch (error) {
            console.error('Error obteniendo configuración:', error);
            return null;
        }
    }

    // ===== GESTIÓN DE COMISIONES =====
    async processCresaliaCommission(tenantId, transactionId, amount) {
        try {
            const commission = this.calculateCresaliaCommission(amount);
            
            // Registrar comisión en base de datos
            const response = await fetch('/api/payments/commission', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({
                    tenant_id: tenantId,
                    transaction_id: transactionId,
                    amount: amount,
                    commission: commission,
                    commission_rate: 0.1 // 10%
                })
            });

            const result = await response.json();
            
            if (result.success) {
                // Notificar a Crisla sobre la comisión
                this.notifyCrislaCommission(tenantId, amount, commission);
            }
            
            return result;
        } catch (error) {
            console.error('Error procesando comisión:', error);
            return { success: false, error: error.message };
        }
    }

    notifyCrislaCommission(tenantId, amount, commission) {
        const notification = {
            type: 'commission_earned',
            data: {
                tenant_id: tenantId,
                transaction_amount: amount,
                commission_amount: commission,
                commission_rate: '10%',
                action: 'commission_processed'
            }
        };

        if (window.crislaSupportIntegration) {
            window.crislaSupportIntegration.sendNotification('commission_earned', notification.data);
        }
    }

    // ===== MÉTODOS PÚBLICOS =====
    getToken() {
        return localStorage.getItem('authToken') || '';
    }

    async setupStorePayments(tenantId) {
        return await this.setupStorePayment(tenantId);
    }

    async processPayment(tenant, plan, amount) {
        return await this.processDistributedPayment(tenant, plan, amount);
    }
}

// ===== INSTANCIA GLOBAL =====
window.distributedPaymentSystem = new DistributedPaymentSystem();

// ===== ESTILOS CSS =====
const distributedPaymentStyles = `
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
    </style>
`;

document.head.insertAdjacentHTML('beforeend', distributedPaymentStyles);

console.log('✅ Distributed Payment System cargado');























