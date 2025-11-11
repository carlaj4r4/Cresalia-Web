// ===== CONFIGURACIÓN DE SUPABASE =====
// Sistema de autenticación para múltiples tiendas CRESALIA

// CONFIGURACIÓN SEGURA - NO EXPONER CLAVES REALES
const SUPABASE_CONFIG = {
    // 🔗 URL de tu proyecto (desde Supabase Dashboard → Settings → API)
    url: 'https://lvdgklwcgrmfbqwghxhl.supabase.co',
    
    // 🔑 Clave anónima (pública) - Reemplaza con tu nueva clave
    anonKey: 'PEGA_AQUI_TU_NUEVA_CLAVE_API_PUBLICABLE',
    
    // Configuración de autenticación
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
};

// Inicializar cliente de Supabase
let supabase = null;

// Función para inicializar Supabase
function initSupabase() {
    if (typeof supabase === 'undefined' || !supabase) {
        console.log('🔐 Inicializando Supabase...');
        
        // Cargar librería de Supabase
        if (typeof window.supabase !== 'undefined') {
            supabase = window.supabase.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey,
                { auth: SUPABASE_CONFIG.auth }
            );
            console.log('✅ Supabase inicializado');
            window.SUPABASE_CLIENT = supabase;
        } else {
            console.error('❌ Librería de Supabase no cargada');
        }
    }
    if (typeof window !== 'undefined' && supabase) {
        window.SUPABASE_CLIENT = supabase;
    }
    return supabase;
}

// Hacer la función disponible globalmente
window.initSupabase = initSupabase;

// Función para verificar si el usuario está autenticado
async function verificarSesion() {
    const supabase = initSupabase();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
        console.error('Error verificando sesión:', error);
        return null;
    }
    
    return session;
}

// Función para obtener datos del usuario actual
async function obtenerUsuarioActual() {
    const supabase = initSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
        console.error('Error obteniendo usuario:', error);
        return null;
    }
    
    return user;
}

// Función para obtener datos de la tienda del usuario
async function obtenerDatosTienda(userId) {
    const supabase = initSupabase();
    
    const { data, error } = await supabase
        .from('tiendas')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    if (error) {
        console.error('Error obteniendo datos de tienda:', error);
        return null;
    }
    
    return data;
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG,
        initSupabase,
        verificarSesion,
        obtenerUsuarioActual,
        obtenerDatosTienda
    };
}

