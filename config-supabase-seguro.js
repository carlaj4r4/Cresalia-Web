// ===== CONFIGURACIÓN SEGURA DE SUPABASE =====
// IMPORTANTE: Reemplaza estas claves con las reales de tu dashboard

const SUPABASE_CONFIG = {
    // 🔗 URL de tu proyecto (copia desde Supabase Dashboard → Settings → API)
    url: 'https://zbomxayytvwjbdzbegcw.supabase.co',
    
    // 🔑 Clave anónima (pública) - Segura para frontend
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpib214YXl5dHZ3amJkemJlZ2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwODczMDMsImV4cCI6MjA3NzY2MzMwM30.ZYpckr8rPaN1vAemdjHxPSe6QvF6R1Ylic6JoNKnsBA',
    
    // 🔐 Clave de servicio (privada) - SOLO para backend
    // ⚠️ IMPORTANTE: Esta clave NO debe estar en GitHub
    // Si necesitás esta clave en producción, usá variables de entorno
    // Por ahora, las comunidades funcionan solo con anonKey (pública)
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
    if (SUPABASE_CONFIG.anonKey.includes('REEMPLAZA') || 
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





