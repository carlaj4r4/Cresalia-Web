// ===== CONFIGURACIÓN PAYPAL BUSINESS CRESALIA =====
// Configuración para PayPal Business
// Las variables de entorno se configuran en Vercel Dashboard → Settings → Environment Variables

const CONFIG_PAYPAL = {
    // Credenciales de PayPal Business
    // Obtén estas credenciales desde: https://developer.paypal.com/dashboard/applications/sandbox (sandbox)
    // o https://developer.paypal.com/dashboard/applications/live (producción)
    
    sandbox: {
        clientId: 'TU_CLIENT_ID_SANDBOX_AQUI',
        clientSecret: 'TU_CLIENT_SECRET_SANDBOX_AQUI'
    },
    
    production: {
        // Lee de variables de entorno de Vercel
        clientId: (typeof window !== 'undefined' && window.__PAYPAL_CLIENT_ID__)
            || (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID)
            || (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.PAYPAL_CLIENT_ID)
            || 'CONFIGURAR_EN_VERCEL',
        clientSecret: (typeof process !== 'undefined' && process.env && process.env.PAYPAL_CLIENT_SECRET)
            || (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.PAYPAL_CLIENT_SECRET)
            || 'CONFIGURAR_EN_VERCEL'
    },
    
    // Configuración de la aplicación
    app: {
        name: 'Cresalia',
        description: 'Plataforma SaaS para emprendedores y compradores',
        version: '1.0.0',
        environment: 'production', // 'sandbox' o 'production'
        enabled: true,
        brandName: 'Cresalia',
        statementDescriptor: 'Cresalia'
    },
    
    // Configuración de moneda
    currency: {
        default: 'USD', // PayPal usa USD como base
        supported: ['USD', 'EUR', 'GBP', 'MXN', 'BRL', 'ARS'] // Monedas soportadas
    }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG_PAYPAL;
} else {
    window.CONFIG_PAYPAL = CONFIG_PAYPAL;
}






