// ===== INYECCIÓN DE VARIABLES DE ENTORNO PARA VERCEL =====
// Este script lee las variables de entorno de Vercel y las inyecta en window
// Las variables de entorno se configuran en Vercel Dashboard → Settings → Environment Variables

(function() {
    'use strict';
    
    // Vercel inyecta las variables de entorno en process.env en el servidor
    // Para el cliente, necesitamos leerlas de una forma diferente
    // En Vercel, las variables de entorno están disponibles en el servidor durante el build
    // pero no directamente en el cliente a menos que se expongan explícitamente
    
    // Intentar leer de múltiples fuentes posibles
    const getEnvVar = (name, defaultValue = null) => {
        // 1. Intentar desde window.__ENV__ (si se inyecta manualmente)
        if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[name]) {
            return window.__ENV__[name];
        }
        
        // 2. Intentar desde window con nombre específico
        const windowName = `__${name}__`;
        if (typeof window !== 'undefined' && window[windowName]) {
            return window[windowName];
        }
        
        // 3. Intentar desde process.env (solo funciona en servidor/build time)
        if (typeof process !== 'undefined' && process.env && process.env[name]) {
            return process.env[name];
        }
        
        // 4. Intentar desde NEXT_PUBLIC_ (para compatibilidad con Next.js)
        if (typeof process !== 'undefined' && process.env && process.env[`NEXT_PUBLIC_${name}`]) {
            return process.env[`NEXT_PUBLIC_${name}`];
        }
        
        return defaultValue;
    };
    
    // Inyectar variables de Supabase
    if (typeof window !== 'undefined') {
        window.__SUPABASE_URL__ = getEnvVar('SUPABASE_URL', 'https://lvdgklwcgrmfbqwghxhl.supabase.co');
        // Fallback con anon key pública del proyecto (segura para frontend)
        window.__SUPABASE_ANON_KEY__ = getEnvVar('SUPABASE_ANON_KEY', 'sb_publishable_m2TqrW1AqMOWIIyQM4oYkA_zeyAAhmR');
        window.__SUPABASE_SERVICE_ROLE_KEY__ = getEnvVar('SUPABASE_SERVICE_ROLE_KEY', null);
        
        // Inyectar variables de Mercado Pago
        // ⚠️ IMPORTANTE: Solo PUBLIC_KEY en el cliente (ACCESS_TOKEN es privado y va en el servidor)
        window.__MERCADOPAGO_PUBLIC_KEY__ = getEnvVar('MERCADOPAGO_PUBLIC_KEY', null);
        window.MERCADOPAGO_PUBLIC_KEY = window.__MERCADOPAGO_PUBLIC_KEY__;
        // ACCESS_TOKEN NO se expone en el cliente - se usa solo en el backend/API
        
        // Inyectar variables de Cresalia Payment
        window.__CRESALIA_PAYMENT_EMAIL__ = getEnvVar('CRESALIA_PAYMENT_EMAIL', null);
        window.__CRESALIA_MP_ALIAS__ = getEnvVar('CRESALIA_MP_ALIAS', null);
        window.__CRESALIA_PAYMENT_PHONE__ = getEnvVar('CRESALIA_PAYMENT_PHONE', null);
        window.CRESALIA_PAYMENT_EMAIL = window.__CRESALIA_PAYMENT_EMAIL__;
        window.CRESALIA_MP_ALIAS = window.__CRESALIA_MP_ALIAS__;
        window.CRESALIA_PAYMENT_PHONE = window.__CRESALIA_PAYMENT_PHONE__;
        
        console.log('✅ Variables de entorno inyectadas');
    }
})();

