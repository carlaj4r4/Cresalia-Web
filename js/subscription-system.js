// ===== CRESALIA SUBSCRIPTION SYSTEM =====
// Sistema automático de renovación de planes de suscripción

class SubscriptionSystem {
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
        this.startSubscriptionMonitoring();
        this.setupEventListeners();
        console.log('💳 Subscription System iniciado');
    }

    // ===== MONITOREO AUTOMÁTICO =====
    startSubscriptionMonitoring() {
        // Verificar suscripciones cada 6 horas
        setInterval(() => {
            this.checkAllSubscriptions();
        }, 6 * 60 * 60 * 1000);

        // Verificar inmediatamente
        this.checkAllSubscriptions();
    }

    async checkAllSubscriptions() {
        try {
            console.log('💳 Verificando todas las suscripciones...');
            
            // Obtener todos los tenants
            const tenants = await this.getAllTenants();
            
            for (const tenant of tenants) {
                await this.checkTenantSubscription(tenant);
            }
            
            console.log('✅ Verificación de suscripciones completada');
        } catch (error) {
            console.error('❌ Error verificando suscripciones:', error);
        }
    }

    async getAllTenants() {
        try {
            if (window.adminBackend) {
                const response = await window.adminBackend.getEstadisticas();
                return response.tenants || [];
            }
        } catch (error) {
            console.error('Error obteniendo tenants:', error);
        }
        return [];
    }

    async checkTenantSubscription(tenant) {
        const now = new Date();
        const subscriptionEnd = new Date(tenant.subscription_end || tenant.created_at);
        const daysUntilExpiry = Math.ceil((subscriptionEnd - now) / (24 * 60 * 60 * 1000));

        // Si la suscripción expiró
        if (daysUntilExpiry <= 0) {
            await this.handleExpiredSubscription(tenant);
        }
        // Si expira pronto (7, 3, 1 días)
        else if ([7, 3, 1].includes(daysUntilExpiry)) {
            await this.sendExpiryWarning(tenant, daysUntilExpiry);
        }

        // Verificar método de pago válido
        await this.validatePaymentMethod(tenant);
    }

    async handleExpiredSubscription(tenant) {
        console.log(`⏰ Suscripción expirada para tenant: ${tenant.nombre}`);
        
        // Intentar renovación automática si tiene método de pago
        const hasValidPayment = await this.hasValidPaymentMethod(tenant);
        
        if (hasValidPayment) {
            await this.attemptAutoRenewal(tenant);
        } else {
            await this.downgradeToFree(tenant);
        }
    }

    async hasValidPaymentMethod(tenant) {
        // Verificar si tiene método de pago válido
        // Esto se conectaría con Stripe, PayPal, etc.
        return tenant.payment_method && tenant.payment_method.status === 'active';
    }

    async attemptAutoRenewal(tenant) {
        try {
            console.log(`🔄 Intentando renovación automática para: ${tenant.nombre}`);
            
            // ⚠️ IMPORTANTE: Notificar ANTES de procesar el pago
            await this.sendPreRenewalNotification(tenant);
            
            // Esperar 24 horas para que puedan cancelar si quieren
            await this.waitForCancellationPeriod(tenant);
            
            // Verificar si cancelaron durante el período de gracia
            const wasCancelled = await this.checkIfCancelled(tenant);
            if (wasCancelled) {
                console.log(`🚫 Renovación cancelada por el usuario: ${tenant.nombre}`);
                return;
            }
            
            // Procesar pago solo después del período de gracia
            const paymentResult = await this.processPayment(tenant);
            
            if (paymentResult.success) {
                await this.renewSubscription(tenant, paymentResult);
                console.log(`✅ Renovación exitosa para: ${tenant.nombre}`);
            } else {
                await this.handleRenewalFailure(tenant, paymentResult.error);
                console.log(`❌ Renovación fallida para: ${tenant.nombre}: ${paymentResult.error}`);
            }
        } catch (error) {
            console.error('Error en renovación automática:', error);
            await this.handleRenewalFailure(tenant, error.message);
        }
    }

    async processPayment(tenant) {
        // Simular procesamiento de pago
        // En producción, esto se conectaría con Stripe/PayPal
        try {
            const plan = this.plans[tenant.plan];
            const amount = plan.price;
            
            // Simular procesamiento
            const success = Math.random() > 0.1; // 90% éxito para demo
            
            return {
                success: success,
                transaction_id: success ? `txn_${Date.now()}` : null,
                error: success ? null : 'Payment method declined'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async renewSubscription(tenant, paymentResult) {
        const newEndDate = new Date();
        newEndDate.setMonth(newEndDate.getMonth() + 1); // Renovar por 1 mes

        const renewalData = {
            subscription_end: newEndDate.toISOString(),
            last_payment: new Date().toISOString(),
            payment_status: 'active',
            transaction_id: paymentResult.transaction_id
        };

        // Actualizar en backend
        if (window.adminBackend) {
            await window.adminBackend.updateTenantSubscription(tenant.id, renewalData);
        }

        // Notificar renovación exitosa
        this.notifySuccessfulRenewal(tenant, renewalData);
    }

    async downgradeToFree(tenant) {
        console.log(`⬇️ Degradando a plan gratuito: ${tenant.nombre}`);
        
        const downgradeData = {
            plan: 'starter',
            subscription_end: null,
            payment_status: 'expired',
            features_disabled: this.getDisabledFeatures(tenant.plan)
        };

        // Actualizar en backend
        if (window.adminBackend) {
            await window.adminBackend.updateTenantSubscription(tenant.id, downgradeData);
        }

        // Notificar degradación
        this.notifyDowngrade(tenant, downgradeData);
        
        // Deshabilitar características premium
        this.disablePremiumFeatures(tenant);
    }

    getDisabledFeatures(currentPlan) {
        const featuresToDisable = [];
        
        if (['basico', 'pro', 'enterprise'].includes(currentPlan)) {
            featuresToDisable.push('analytics_avanzados');
        }
        
        if (['pro', 'enterprise'].includes(currentPlan)) {
            featuresToDisable.push('chatbot_ia', 'soporte_24_7');
        }
        
        if (currentPlan === 'enterprise') {
            featuresToDisable.push('account_manager', 'desarrollo_custom');
        }
        
        return featuresToDisable;
    }

    disablePremiumFeatures(tenant) {
        // Deshabilitar características en el frontend
        if (window.chatbotIASystem && !this.plans[tenant.plan].features.includes('Chatbot IA')) {
            window.chatbotIASystem.disable();
        }
        
        // Mostrar notificación al usuario
        this.showDowngradeNotification(tenant);
    }

    async sendExpiryWarning(tenant, daysLeft) {
        const notification = {
            type: 'subscription_expiry_warning',
            data: {
                tenant_id: tenant.id,
                tenant_name: tenant.nombre,
                plan: tenant.plan,
                days_left: daysLeft,
                action: 'renewal_reminder'
            },
            timestamp: new Date().toISOString()
        };

        // Notificar a Crisla's Support
        if (window.crislaSupportIntegration) {
            window.crislaSupportIntegration.sendNotification('subscription_expiry_warning', notification.data);
        }

        // Enviar email al usuario
        this.sendExpiryEmail(tenant, daysLeft);
    }

    async validatePaymentMethod(tenant) {
        if (!tenant.payment_method) return;
        
        // Verificar si el método de pago sigue siendo válido
        // Esto se conectaría con la API de Stripe/PayPal
        const isValid = await this.checkPaymentMethodValidity(tenant.payment_method);
        
        if (!isValid) {
            await this.markPaymentMethodInvalid(tenant);
        }
    }

    async checkPaymentMethodValidity(paymentMethod) {
        // Simular verificación
        // En producción, esto verificaría con Stripe/PayPal
        return Math.random() > 0.05; // 95% válido para demo
    }

    async markPaymentMethodInvalid(tenant) {
        const updateData = {
            payment_method: {
                ...tenant.payment_method,
                status: 'invalid',
                invalid_since: new Date().toISOString()
            }
        };

        if (window.adminBackend) {
            await window.adminBackend.updateTenantSubscription(tenant.id, updateData);
        }

        // Notificar a Crisla
        this.notifyInvalidPaymentMethod(tenant);
    }

    // ===== NOTIFICACIONES =====
    notifySuccessfulRenewal(tenant, renewalData) {
        const notification = {
            type: 'subscription_renewed',
            data: {
                tenant_id: tenant.id,
                tenant_name: tenant.nombre,
                plan: tenant.plan,
                renewal_date: renewalData.subscription_end,
                transaction_id: renewalData.transaction_id,
                action: 'renewal_success'
            }
        };

        if (window.crislaSupportIntegration) {
            window.crislaSupportIntegration.sendNotification('subscription_renewed', notification.data);
        }
    }

    notifyDowngrade(tenant, downgradeData) {
        const notification = {
            type: 'subscription_downgraded',
            data: {
                tenant_id: tenant.id,
                tenant_name: tenant.nombre,
                old_plan: tenant.plan,
                new_plan: downgradeData.plan,
                disabled_features: downgradeData.features_disabled,
                action: 'downgrade_completed'
            }
        };

        if (window.crislaSupportIntegration) {
            window.crislaSupportIntegration.sendNotification('subscription_downgraded', notification.data);
        }
    }

    notifyInvalidPaymentMethod(tenant) {
        const notification = {
            type: 'invalid_payment_method',
            data: {
                tenant_id: tenant.id,
                tenant_name: tenant.nombre,
                plan: tenant.plan,
                action: 'payment_method_issue'
            }
        };

        if (window.crislaSupportIntegration) {
            window.crislaSupportIntegration.sendNotification('invalid_payment_method', notification.data);
        }
    }

    showDowngradeNotification(tenant) {
        const message = `⚠️ Tu plan ha expirado. Has sido movido al plan Starter gratuito.`;
        
        if (window.elegantNotifications) {
            window.elegantNotifications.show(message, 'warning');
        }
    }

    sendExpiryEmail(tenant, daysLeft) {
        // Implementar envío de email
        console.log(`📧 Enviando email de expiración: ${daysLeft} días restantes`);
    }

    // ===== SISTEMA EMPÁTICO DE RENOVACIÓN =====
    
    async sendPreRenewalNotification(tenant) {
        const plan = this.plans[tenant.plan];
        const amount = plan.price;
        
        const notification = {
            type: 'pre_renewal_notification',
            data: {
                tenant_id: tenant.id,
                tenant_name: tenant.nombre,
                tenant_email: tenant.email,
                plan: tenant.plan,
                amount: amount,
                renewal_date: new Date().toISOString(),
                action: 'renewal_warning'
            },
            timestamp: new Date().toISOString()
        };

        // Notificar a Crisla's Support
        if (window.crislaSupportIntegration) {
            window.crislaSupportIntegration.sendNotification('pre_renewal_notification', notification.data);
        }

        // Enviar email empático al usuario
        this.sendEmpatheticRenewalEmail(tenant, amount);
        
        // Mostrar notificación en la tienda
        this.showRenewalWarningInStore(tenant, amount);
    }

    async waitForCancellationPeriod(tenant) {
        // Esperar 24 horas (en producción sería 24 * 60 * 60 * 1000)
        // Para demo, usamos 5 segundos
        return new Promise(resolve => {
            console.log(`⏰ Período de gracia de 24 horas iniciado para: ${tenant.nombre}`);
            setTimeout(resolve, 5000); // 5 segundos para demo
        });
    }

    async checkIfCancelled(tenant) {
        // Verificar si el usuario canceló durante el período de gracia
        const cancellationKey = `cancelled_renewal_${tenant.id}`;
        return localStorage.getItem(cancellationKey) === 'true';
    }

    sendEmpatheticRenewalEmail(tenant, amount) {
        const emailContent = `
            Hola ${tenant.nombre},

            Esperamos que estés teniendo un gran éxito con tu tienda en Cresalia! 🎉

            Tu suscripción ${tenant.plan} ($${amount}/mes) se renovará automáticamente en 24 horas.

            💜 Entendemos que las cosas pueden cambiar y queremos ser flexibles contigo.

            Si necesitas:
            - Pausar tu suscripción temporalmente
            - Cambiar a un plan más económico
            - Cancelar por cualquier motivo
            - Hablar sobre tu situación

            Solo responde a este email o contáctanos. Estamos aquí para ayudarte.

            Con cariño,
            El equipo de Cresalia 💜

            P.D.: Si no respondes en 24 horas, procederemos con la renovación automática.
        `;
        
        console.log('📧 Email empático enviado');
    }

    showRenewalWarningInStore(tenant, amount) {
        const warningHTML = `
            <div id="renewalWarning" class="renewal-warning-modal">
                <div class="renewal-warning-content">
                    <div class="warning-header">
                        <h3>💜 Renovación de Suscripción</h3>
                        <button onclick="subscriptionSystem.closeRenewalWarning()" class="close-btn">&times;</button>
                    </div>
                    
                    <div class="warning-body">
                        <p>Tu suscripción <strong>${tenant.plan}</strong> se renovará automáticamente en <strong>24 horas</strong> por <strong>$${amount}</strong>.</p>
                        
                        <p>💜 <strong>Entendemos que las cosas pueden cambiar.</strong></p>
                        
                        <p>Si necesitas ayuda o quieres hacer cambios, estamos aquí para ti.</p>
                    </div>
                    
                    <div class="warning-actions">
                        <button onclick="subscriptionSystem.cancelRenewal('${tenant.id}')" class="cancel-btn">
                            🚫 Cancelar Renovación
                        </button>
                        <button onclick="subscriptionSystem.contactSupport('${tenant.id}')" class="support-btn">
                            💬 Hablar con Soporte
                        </button>
                        <button onclick="subscriptionSystem.closeRenewalWarning()" class="continue-btn">
                            ✅ Continuar con Renovación
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', warningHTML);
    }

    cancelRenewal(tenantId) {
        // Marcar como cancelado
        const cancellationKey = `cancelled_renewal_${tenantId}`;
        localStorage.setItem(cancellationKey, 'true');
        
        // Notificar a Crisla
        const notification = {
            type: 'renewal_cancelled',
            data: {
                tenant_id: tenantId,
                action: 'user_cancelled_renewal'
            }
        };

        if (window.crislaSupportIntegration) {
            window.crislaSupportIntegration.sendNotification('renewal_cancelled', notification.data);
        }

        // Mostrar confirmación
        if (window.elegantNotifications) {
            window.elegantNotifications.show('✅ Renovación cancelada. Tu suscripción expirará al final del período actual.', 'success');
        }

        this.closeRenewalWarning();
    }

    contactSupport(tenantId) {
        // Abrir chat de soporte o redirigir
        const subject = encodeURIComponent('Necesito ayuda con mi suscripción - Cresalia');
        const body = encodeURIComponent(`Hola,\n\nNecesito ayuda con mi suscripción.\n\nMi ID de tienda: ${tenantId}\n\nGracias.`);
        window.location.href = `mailto:crisla965@gmail.com?subject=${subject}&body=${body}`;
        
        this.closeRenewalWarning();
    }

    closeRenewalWarning() {
        const modal = document.getElementById('renewalWarning');
        if (modal) {
            modal.remove();
        }
    }

    // ===== GESTIÓN MANUAL =====
    async manualRenewal(tenantId, months = 1) {
        const tenant = await this.getTenant(tenantId);
        if (!tenant) return false;

        const newEndDate = new Date();
        newEndDate.setMonth(newEndDate.getMonth() + months);

        const renewalData = {
            subscription_end: newEndDate.toISOString(),
            last_payment: new Date().toISOString(),
            payment_status: 'active',
            transaction_id: `manual_${Date.now()}`,
            renewed_by: 'admin'
        };

        if (window.adminBackend) {
            await window.adminBackend.updateTenantSubscription(tenantId, renewalData);
        }

        this.notifySuccessfulRenewal(tenant, renewalData);
        return true;
    }

    async changePlan(tenantId, newPlan) {
        const tenant = await this.getTenant(tenantId);
        if (!tenant) return false;

        const planChangeData = {
            plan: newPlan,
            plan_changed_at: new Date().toISOString(),
            previous_plan: tenant.plan
        };

        if (window.adminBackend) {
            await window.adminBackend.updateTenantSubscription(tenantId, planChangeData);
        }

        // Notificar cambio de plan
        const notification = {
            type: 'plan_changed',
            data: {
                tenant_id: tenantId,
                old_plan: tenant.plan,
                new_plan: newPlan,
                action: 'plan_change'
            }
        };

        if (window.crislaSupportIntegration) {
            window.crislaSupportIntegration.sendNotification('plan_changed', notification.data);
        }

        return true;
    }

    // ===== REPORTES =====
    getSubscriptionReport() {
        return {
            total_subscriptions: 0,
            active_subscriptions: 0,
            expiring_soon: 0,
            expired: 0,
            renewal_success_rate: 0,
            last_check: new Date().toISOString()
        };
    }

    // ===== MÉTODOS PÚBLICOS =====
    getPlans() {
        return this.plans;
    }

    getPlanFeatures(plan) {
        return this.plans[plan]?.features || [];
    }

    forceSubscriptionCheck() {
        this.checkAllSubscriptions();
    }

    setupEventListeners() {
        // Escuchar cambios de plan desde el admin
        document.addEventListener('planChanged', (e) => {
            this.changePlan(e.detail.tenantId, e.detail.newPlan);
        });
    }
}

// ===== INSTANCIA GLOBAL =====
window.subscriptionSystem = new SubscriptionSystem();

// ===== ESTILOS CSS EMPÁTICOS =====
const empatheticStyles = `
    <style>
        .renewal-warning-modal {
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
            animation: fadeIn 0.3s ease;
        }

        .renewal-warning-content {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        }

        .warning-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #F3F4F6;
        }

        .warning-header h3 {
            color: #7C3AED;
            margin: 0;
            font-size: 24px;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #6B7280;
            transition: color 0.2s;
        }

        .close-btn:hover {
            color: #374151;
        }

        .warning-body {
            margin-bottom: 25px;
            text-align: left;
        }

        .warning-body p {
            margin-bottom: 15px;
            line-height: 1.6;
            color: #374151;
        }

        .warning-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .cancel-btn, .support-btn, .continue-btn {
            padding: 12px 20px;
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
            transform: translateY(-1px);
        }

        .support-btn {
            background: #3B82F6;
            color: white;
        }

        .support-btn:hover {
            background: #2563EB;
            transform: translateY(-1px);
        }

        .continue-btn {
            background: linear-gradient(135deg, #10B981, #059669);
            color: white;
        }

        .continue-btn:hover {
            background: linear-gradient(135deg, #059669, #047857);
            transform: translateY(-1px);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(30px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 600px) {
            .renewal-warning-content {
                padding: 20px;
                margin: 20px;
            }
            
            .warning-actions {
                gap: 10px;
            }
            
            .cancel-btn, .support-btn, .continue-btn {
                padding: 10px 16px;
                font-size: 14px;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', empatheticStyles);

console.log('✅ Subscription System cargado');
