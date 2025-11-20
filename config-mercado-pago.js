// ===== CONFIGURACIÓN MERCADO PAGO CRESALIA =====
// Configuración para Vercel (lee de variables de entorno)
// Las variables de entorno se configuran en Vercel Dashboard → Settings → Environment Variables

const CONFIG_MERCADO_PAGO = {
    // Credenciales de prueba (SANDBOX) - Para desarrollo
    sandbox: {
        publicKey: 'TEST-TU_PUBLIC_KEY_SANDBOX_AQUI',
        accessToken: 'TEST-TU_ACCESS_TOKEN_SANDBOX_AQUI'
    },
    
    // Credenciales de producción (LIVE) - Lee de variables de entorno de Vercel
    production: {
        // En Vercel, process.env está disponible en el servidor
        // Para el cliente, usamos window.__ENV__ o leemos de variables de entorno inyectadas
        publicKey: (typeof window !== 'undefined' && window.__MERCADOPAGO_PUBLIC_KEY__) 
            || (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY)
            || (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.MERCADOPAGO_PUBLIC_KEY)
            || 'CONFIGURAR_EN_VERCEL',
        accessToken: (typeof window !== 'undefined' && window.__MERCADOPAGO_ACCESS_TOKEN__)
            || (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_MERCADOPAGO_ACCESS_TOKEN)
            || (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.MERCADOPAGO_ACCESS_TOKEN)
            || 'CONFIGURAR_EN_VERCEL'
    },
    
    // Configuración de la aplicación
    app: {
        name: 'Cresalia',
        description: 'Plataforma SaaS para emprendedores y compradores',
        version: '1.0.0',
        environment: 'production',
        enabled: true,
        statement_descriptor: 'Cresalia'
    },
    
    // Configuración de suscripciones
    subscriptions: {
        free: {
            id: 'cresalia-free',
            name: 'Plan Gratuito',
            price: 0,
            interval: 'monthly'
        },
        basic: {
            id: 'cresalia-basic',
            name: 'Plan Básico',
            price: 9.99,
            interval: 'monthly'
        },
        premium: {
            id: 'cresalia-premium',
            name: 'Plan Premium',
            price: 19.99,
            interval: 'monthly'
        }
    }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG_MERCADO_PAGO;
} else {
    window.CONFIG_MERCADO_PAGO = CONFIG_MERCADO_PAGO;
}
