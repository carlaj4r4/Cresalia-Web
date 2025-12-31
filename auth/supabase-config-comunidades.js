// ===== CONFIGURACIÓN DE SUPABASE PARA COMUNIDADES =====
// Sistema de autenticación para comunidades CRESALIA
// Usa el proyecto SEPARADO de Supabase para comunidades

// CONFIGURACIÓN SEGURA - NO EXPONER CLAVES REALES
const SUPABASE_CONFIG_COMUNIDADES = {
    // 🔗 URL del proyecto de Comunidades (se puede inyectar vía env en Vercel)
    url: (typeof window !== 'undefined' && (window.__SUPABASE_URL_COMUNIDADES__ || window.NEXT_PUBLIC_SUPABASE_URL_COMUNIDADES)) ||
         (typeof process !== 'undefined' && process.env && (process.env.SUPABASE_URL_COMUNIDADES || process.env.NEXT_PUBLIC_SUPABASE_URL_COMUNIDADES)) ||
         'https://zbomxayytvwjbdzbegcw.supabase.co',
    
    // 🔑 Clave anónima (pública). Se espera que venga de env; sin fallback para evitar exponerla.
    anonKey: (typeof window !== 'undefined' && (window.__SUPABASE_ANON_KEY_COMUNIDADES__ || window.NEXT_PUBLIC_SUPABASE_ANON_KEY_COMUNIDADES)) ||
             (typeof process !== 'undefined' && process.env && (process.env.SUPABASE_ANON_KEY_COMUNIDADES || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_COMUNIDADES)) ||
             '',
    
    // Configuración de autenticación
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
};

// Inicializar cliente de Supabase para comunidades
let supabaseClientComunidades = null;

// Función para inicializar Supabase para comunidades (con espera si es necesario)
function initSupabaseComunidades() {
    if (typeof supabaseClientComunidades === 'undefined' || !supabaseClientComunidades) {
        console.log('🔐 Inicializando Supabase para Comunidades...');
        
        if (!SUPABASE_CONFIG_COMUNIDADES.anonKey) {
            console.error('❌ SUPABASE_ANON_KEY_COMUNIDADES no está configurada. Define la variable de entorno.');
            return null;
        }
        
        // Esperar a que la librería esté disponible (hasta 5 segundos)
        let attempts = 0;
        const maxAttempts = 50; // 50 intentos x 100ms = 5 segundos
        
        const tryInit = () => {
            if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
                try {
                    supabaseClientComunidades = window.supabase.createClient(
                        SUPABASE_CONFIG_COMUNIDADES.url,
                        SUPABASE_CONFIG_COMUNIDADES.anonKey,
                        { auth: SUPABASE_CONFIG_COMUNIDADES.auth }
                    );
                    
                    // Validar que el cliente se creó correctamente
                    if (!supabaseClientComunidades || typeof supabaseClientComunidades.from !== 'function') {
                        throw new Error('El cliente de Supabase no se creó correctamente');
                    }
                    
                    console.log('✅ Supabase Comunidades inicializado correctamente');
                    console.log('🔍 URL:', SUPABASE_CONFIG_COMUNIDADES.url);
                    console.log('🔍 Cliente validado - método from disponible:', typeof supabaseClientComunidades.from);
                    
                    if (typeof window !== 'undefined') {
                        window.SUPABASE_CLIENT_COMUNIDADES = supabaseClientComunidades;
                        window.SUPABASE_CONFIG_COMUNIDADES = SUPABASE_CONFIG_COMUNIDADES;
                    }
                    return supabaseClientComunidades;
                } catch (error) {
                    console.error('❌ Error creando cliente de Supabase Comunidades:', error);
                    attempts++;
                    if (attempts < maxAttempts) {
                        console.log(`⏳ Reintentando inicialización... (intento ${attempts}/${maxAttempts})`);
                        setTimeout(tryInit, 100);
                        return null;
                    }
                    return null;
                }
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    console.log(`⏳ Esperando SDK de Supabase... (intento ${attempts}/${maxAttempts})`);
                    setTimeout(tryInit, 100);
                    return null;
                } else {
                    console.error('❌ Librería de Supabase no se cargó después de 5 segundos');
                    console.error('💡 Verifica que el script de Supabase esté cargado antes de este archivo');
                    console.error('💡 URL esperada del SDK: https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
                    return null;
                }
            }
        };
        
        return tryInit();
    }
    
    if (typeof window !== 'undefined' && supabaseClientComunidades) {
        window.SUPABASE_CLIENT_COMUNIDADES = supabaseClientComunidades;
        window.SUPABASE_CONFIG_COMUNIDADES = SUPABASE_CONFIG_COMUNIDADES;
    }
    return supabaseClientComunidades;
}

// Inicializar automáticamente cuando el DOM esté listo
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => initSupabaseComunidades(), 100);
        });
    } else {
        setTimeout(() => initSupabaseComunidades(), 100);
    }
}

// Hacer la función disponible globalmente
window.initSupabaseComunidades = initSupabaseComunidades;

// Función para verificar si el usuario está autenticado (comunidades)
async function verificarSesionComunidades() {
    const client = initSupabaseComunidades();
    if (!client) return null;
    
    const { data: { session }, error } = await client.auth.getSession();
    
    if (error) {
        console.error('Error verificando sesión en comunidades:', error);
        return null;
    }
    
    return session;
}

// Función para obtener datos del usuario actual (comunidades)
async function obtenerUsuarioActualComunidades() {
    const client = initSupabaseComunidades();
    if (!client) return null;
    
    const { data: { user }, error } = await client.auth.getUser();
    
    if (error) {
        console.error('Error obteniendo usuario en comunidades:', error);
        return null;
    }
    
    return user;
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG_COMUNIDADES,
        initSupabaseComunidades,
        verificarSesionComunidades,
        obtenerUsuarioActualComunidades
    };
}
