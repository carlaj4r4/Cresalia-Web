// ===== ARCHIVO DE EJEMPLO - CONFIGURACIÓN SEGURA DE SUPABASE =====
// Copia este archivo como "config-supabase-seguro.js" y configura tus credenciales
// IMPORTANTE: config-supabase-seguro.js está en .gitignore y NO se subirá al repositorio

const SUPABASE_CONFIG = {
    // 🔗 URL de tu proyecto (copia desde Supabase Dashboard → Settings → API)
    url: 'REEMPLAZA_CON_TU_URL_DE_SUPABASE',
    
    // 🔑 Clave anónima (pública) - Segura para frontend
    // Copia desde Supabase Dashboard → Settings → API → anon/public key
    anonKey: 'REEMPLAZA_CON_TU_ANON_KEY',
    
    // 🔐 Clave de servicio (privada) - SOLO para backend
    // ⚠️ IMPORTANTE: Esta clave NO debe estar en GitHub
    // Si necesitás esta clave en producción, usá variables de entorno
    // Por ahora, las comunidades funcionan solo con anonKey (pública)
    // Copia desde Supabase Dashboard → Settings → API → service_role key
    serviceRoleKey: 'REEMPLAZA_CON_TU_SERVICE_ROLE_KEY_LOCALMENTE',
    
    // Configuración de seguridad
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Por seguridad
        flowType: 'pkce' // Mayor seguridad
    }
};

// Función para validar configuración
function validarConfiguracion() {
    if (SUPABASE_CONFIG.url.includes('REEMPLAZA') || 
        SUPABASE_CONFIG.anonKey.includes('REEMPLAZA') || 
        SUPABASE_CONFIG.serviceRoleKey.includes('REEMPLAZA')) {
        console.error('🚨 CONFIGURACIÓN INCOMPLETA: Reemplaza las claves por las reales');
        return false;
    }
    return true;
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}

// Hacer disponible globalmente
window.SUPABASE_CONFIG = SUPABASE_CONFIG;

