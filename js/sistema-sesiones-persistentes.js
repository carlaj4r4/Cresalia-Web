/**
 * 🔐 Sistema de Sesiones Persistentes
 * Mantiene las sesiones activas por más tiempo
 * Auto-renueva tokens antes de que expiren
 */

(function() {
    console.log('🔐 Sistema de sesiones persistentes cargando...');

    let renovacionInterval = null;

    // Inicializar sistema de sesiones
    async function inicializarSesionesPersistentes() {
        const supabase = initSupabase();
        
        if (!supabase) {
            console.warn('⚠️ No se pudo inicializar Supabase para sesiones');
            return;
        }

        try {
            // Verificar sesión actual
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('❌ Error obteniendo sesión:', error);
                return;
            }

            if (session) {
                console.log('✅ Sesión activa encontrada');
                console.log('👤 Usuario:', session.user.email);
                
                // Configurar auto-renovación
                configurarAutoRenovacion(supabase);
                
                // Escuchar cambios de estado
                escucharCambiosAuth(supabase);
            } else {
                console.log('ℹ️ No hay sesión activa');
            }

        } catch (error) {
            console.error('❌ Error en sistema de sesiones:', error);
        }
    }

    // Configurar renovación automática de token
    function configurarAutoRenovacion(supabase) {
        // Limpiar interval anterior si existe
        if (renovacionInterval) {
            clearInterval(renovacionInterval);
        }

        // Renovar cada 50 minutos (antes de que expire a 60 min)
        renovacionInterval = setInterval(async () => {
            try {
                const { data, error } = await supabase.auth.refreshSession();
                
                if (error) {
                    console.error('❌ Error renovando sesión:', error);
                    
                    // Si falla la renovación, intentar obtener sesión de nuevo
                    const { data: { session } } = await supabase.auth.getSession();
                    
                    if (!session) {
                        console.warn('⚠️ Sesión perdida, limpiando...');
                        limpiarSesionLocal();
                    }
                } else {
                    console.log('🔄 Sesión renovada automáticamente');
                    console.log('⏰ Próxima renovación en 50 minutos');
                }
            } catch (error) {
                console.error('❌ Error crítico renovando sesión:', error);
            }
        }, 50 * 60 * 1000); // 50 minutos
        
        console.log('✅ Auto-renovación configurada (cada 50 min)');
    }

    // Escuchar cambios de autenticación
    function escucharCambiosAuth(supabase) {
        supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔐 Cambio de estado de auth:', event);
            
            switch (event) {
                case 'SIGNED_IN':
                    console.log('✅ Usuario autenticado');
                    break;
                    
                case 'SIGNED_OUT':
                    console.log('👋 Usuario cerró sesión');
                    limpiarSesionLocal();
                    break;
                    
                case 'TOKEN_REFRESHED':
                    console.log('✅ Token renovado exitosamente');
                    break;
                    
                case 'USER_UPDATED':
                    console.log('ℹ️ Usuario actualizado');
                    break;
                    
                default:
                    console.log('ℹ️ Evento de auth:', event);
            }
        });
    }

    // Limpiar datos de sesión local
    function limpiarSesionLocal() {
        try {
            localStorage.removeItem('cresalia_sesion_activa');
            localStorage.removeItem('cresalia_session_token');
            localStorage.removeItem('cresalia_user_data');
            localStorage.removeItem('plan-actual');
            console.log('🧹 Sesión local limpiada');
        } catch (error) {
            console.error('❌ Error limpiando sesión:', error);
        }
    }

    // Proteger localStorage de limpieza accidental
    function protegerSesion() {
        const CLAVES_PROTEGIDAS = [
            'cresalia_sesion_activa',
            'cresalia_session_token',
            'cresalia_user_data',
            'sb-' // Prefijo de Supabase
        ];
        
        // Backup del método clear original
        const originalClear = localStorage.clear.bind(localStorage);
        
        // Sobrescribir clear
        localStorage.clear = function() {
            const respaldo = {};
            
            // Guardar claves protegidas
            CLAVES_PROTEGIDAS.forEach(clave => {
                Object.keys(localStorage).forEach(key => {
                    if (key.includes(clave)) {
                        respaldo[key] = localStorage.getItem(key);
                    }
                });
            });
            
            // Limpiar todo
            originalClear();
            
            // Restaurar claves protegidas
            Object.keys(respaldo).forEach(key => {
                localStorage.setItem(key, respaldo[key]);
            });
            
            console.log('🛡️ localStorage limpiado pero sesión protegida');
        };
    }

    // Función para esperar a que initSupabase esté disponible
    function esperarInitSupabase(callback, maxIntentos = 10, intento = 0) {
        if (typeof initSupabase !== 'undefined' && typeof initSupabase === 'function') {
            callback();
        } else if (intento < maxIntentos) {
            setTimeout(() => esperarInitSupabase(callback, maxIntentos, intento + 1), 500);
        } else {
            console.warn('⚠️ initSupabase no está disponible después de varios intentos');
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            protegerSesion();
            esperarInitSupabase(inicializarSesionesPersistentes);
        });
    } else {
        protegerSesion();
        esperarInitSupabase(inicializarSesionesPersistentes);
    }

    console.log('✅ Sistema de sesiones persistentes cargado');
})();
