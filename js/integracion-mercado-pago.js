// ===== INTEGRACIÓN MERCADO PAGO CRESALIA =====
// Sistema de pagos y suscripciones para Cresalia

class IntegracionMercadoPago {
    constructor() {
        this.config = window.CONFIG_MERCADO_PAGO;
        this.mercadoPago = null;
        this.inicializar();
    }

    // Inicializar Mercado Pago
    inicializar() {
        console.log('💳 Inicializando integración Mercado Pago...');
        
        // Cargar SDK de Mercado Pago
        this.cargarSDK();
    }

    // Cargar SDK de Mercado Pago
    cargarSDK() {
        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.onload = () => {
            this.mercadoPago = new MercadoPago(this.config[this.config.app.environment].publicKey);
            console.log('✅ SDK Mercado Pago cargado');
            console.log('🔑 Usando credenciales:', this.config.app.environment);
            this.configurarCheckout();
        };
        script.onerror = () => {
            console.error('❌ Error cargando SDK de Mercado Pago');
        };
        document.head.appendChild(script);
    }

    // Configurar Checkout Pro
    configurarCheckout() {
        console.log('🛒 Configurando Checkout Pro...');
        
        // Configurar preferencias de pago
        this.configurarPreferencias();
    }

    // Configurar preferencias de pago
    configurarPreferencias() {
        const preferencias = {
            items: [],
            back_urls: {
                success: window.location.origin + '/pago-exitoso.html',
                failure: window.location.origin + '/pago-fallido.html',
                pending: window.location.origin + '/pago-pendiente.html'
            },
            auto_return: 'approved',
            notification_url: window.location.origin + '/webhook-mercado-pago.php'
        };

        this.preferencias = preferencias;
        console.log('✅ Preferencias configuradas');
    }

    // Crear suscripción
    crearSuscripcion(planId, usuarioId) {
        const plan = this.config.subscriptions[planId];
        if (!plan) {
            throw new Error('Plan no encontrado');
        }

        const preferencia = {
            ...this.preferencias,
            items: [{
                id: plan.id,
                title: plan.name,
                quantity: 1,
                unit_price: plan.price,
                currency_id: 'ARS'
            }],
            metadata: {
                plan_id: planId,
                usuario_id: usuarioId,
                plataforma: 'Cresalia'
            }
        };

        return this.mercadoPago.checkout({
            preference: preferencia
        });
    }

    // Procesar pago exitoso
    procesarPagoExitoso(paymentId) {
        console.log('✅ Pago procesado exitosamente:', paymentId);
        
        // Actualizar estado del usuario
        this.actualizarEstadoUsuario(paymentId);
        
        // Enviar confirmación
        this.enviarConfirmacionPago(paymentId);
    }

    // Actualizar estado del usuario
    actualizarEstadoUsuario(paymentId) {
        const usuario = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
        usuario.suscripcion = {
            activa: true,
            paymentId: paymentId,
            fechaActivacion: new Date().toISOString()
        };
        
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        console.log('👤 Estado de usuario actualizado');
    }

    // Enviar confirmación de pago
    enviarConfirmacionPago(paymentId) {
        // Aquí puedes implementar envío de email o notificación
        console.log('📧 Confirmación de pago enviada');
    }

    // Verificar estado de suscripción
    verificarEstadoSuscripcion(usuarioId) {
        const usuario = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
        return usuario.suscripcion || { activa: false };
    }

    // Cancelar suscripción
    cancelarSuscripcion(usuarioId) {
        const usuario = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
        if (usuario.suscripcion) {
            usuario.suscripcion.activa = false;
            usuario.suscripcion.fechaCancelacion = new Date().toISOString();
            localStorage.setItem('usuarioActual', JSON.stringify(usuario));
            console.log('❌ Suscripción cancelada');
        }
    }
}

// Inicializar integración
window.integracionMP = new IntegracionMercadoPago();

// Funciones globales
window.crearSuscripcion = function(planId, usuarioId) {
    return window.integracionMP.crearSuscripcion(planId, usuarioId);
};

window.verificarSuscripcion = function(usuarioId) {
    return window.integracionMP.verificarEstadoSuscripcion(usuarioId);
};

// Función específica para pruebas
window.crearPagoPrueba = function(planId) {
    const plan = CONFIG_MERCADO_PAGO.subscriptions[planId];
    if (!plan) {
        throw new Error('Plan no encontrado');
    }

    console.log('🧪 Creando pago de prueba para:', plan.name);
    console.log('💰 Precio:', plan.price);
    console.log('🔑 Usando credenciales de prueba');

    // Simular proceso de pago para pruebas
    return new Promise((resolve) => {
        setTimeout(() => {
            const resultado = {
                id: 'TEST-' + Date.now(),
                status: 'approved',
                plan: plan,
                fecha: new Date().toISOString(),
                modo: 'sandbox'
            };
            console.log('✅ Pago de prueba simulado:', resultado);
            resolve(resultado);
        }, 2000);
    });
};

// Función para probar con tarjetas de prueba
window.probarConTarjetaPrueba = function(planId) {
    console.log('💳 Iniciando prueba con tarjeta de prueba...');
    console.log('📋 Tarjetas de prueba disponibles:');
    console.log('   Visa: 4509 9535 6623 3704');
    console.log('   Mastercard: 5031 7557 3453 0604');
    console.log('   CVV: Cualquier 3 dígitos');
    console.log('   Fecha: Cualquier fecha futura');
    
    return window.crearPagoPrueba(planId);
};

console.log('✅ Integración Mercado Pago cargada correctamente');
console.log('🧪 Funciones de prueba disponibles:');
console.log('   - crearPagoPrueba(planId)');
console.log('   - probarConTarjetaPrueba(planId)');
