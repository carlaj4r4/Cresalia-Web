// ============================================
// SISTEMA DE AUTENTICACIÓN - CRESALIA
// Guard para proteger páginas administrativas
// ============================================

console.log('🛡️ Auth Guard cargado');

class AuthGuard {
    constructor() {
        this.init();
    }

    // Inicializar verificación
    init() {
        this.verificarAutenticacion();
        this.configurarRenovacionAutomatica();
        this.configurarDeteccionCierreVentana();
    }

    // Verificar si el usuario está autenticado
    verificarAutenticacion() {
        const sesionActiva = localStorage.getItem('cresalia_sesion_activa');
        const usuarioAutenticado = localStorage.getItem('cresalia_usuario_autenticado');
        const tiendaId = localStorage.getItem('cresalia_tienda_id');
        const sessionToken = localStorage.getItem('cresalia_session_token');
        
        console.log('🔍 Verificando autenticación:', {
            sesionActiva: !!sesionActiva,
            usuario: !!usuarioAutenticado,
            tienda: !!tiendaId,
            token: !!sessionToken
        });

        // Si falta algún dato, redirigir al login
        if (!sesionActiva || !usuarioAutenticado || !tiendaId || !sessionToken) {
            console.warn('❌ Autenticación fallida - Redirigiendo al login');
            this.redirigirALogin();
            return false;
        }

        // Verificar expiración del token (24 horas)
        if (!this.verificarExpiracionToken()) {
            console.warn('⏰ Token expirado - Redirigiendo al login');
            this.cerrarSesion();
            return false;
        }

        // Cargar información del usuario
        this.cargarInfoUsuario();
        
        return true;
    }

    // Verificar si el token ha expirado
    verificarExpiracionToken() {
        const tokenTimestamp = localStorage.getItem('cresalia_session_timestamp');
        
        if (!tokenTimestamp) {
            return false;
        }

        const ahora = new Date().getTime();
        const tiempoTranscurrido = ahora - parseInt(tokenTimestamp);
        const horasTranscurridas = tiempoTranscurrido / (1000 * 60 * 60);

        // El token expira después de 24 horas
        return horasTranscurridas < 24;
    }

    // Renovar el timestamp de la sesión (cuando hay actividad)
    renovarSesion() {
        const ahora = new Date().getTime();
        localStorage.setItem('cresalia_session_timestamp', ahora.toString());
        console.log('🔄 Sesión renovada');
    }

    // Configurar renovación automática cada 5 minutos
    configurarRenovacionAutomatica() {
        // Renovar al hacer cualquier click en la página
        document.addEventListener('click', () => {
            this.renovarSesion();
        });

        // Renovar periódicamente cada 5 minutos
        setInterval(() => {
            if (this.verificarExpiracionToken()) {
                this.renovarSesion();
            } else {
                this.cerrarSesion();
            }
        }, 5 * 60 * 1000); // 5 minutos
    }

    // Detectar cierre de ventana para mantener sesión
    configurarDeteccionCierreVentana() {
        window.addEventListener('beforeunload', (e) => {
            // Guardar que el usuario cerró la ventana normalmente
            localStorage.setItem('cresalia_normal_close', 'true');
        });
    }

    // Cargar información del usuario autenticado
    cargarInfoUsuario() {
        const usuarioStr = localStorage.getItem('cresalia_usuario_autenticado');
        const tiendaId = localStorage.getItem('cresalia_tienda_id');
        const planStr = localStorage.getItem('cresalia_plan_actual');

        if (usuarioStr) {
            try {
                const usuario = JSON.parse(usuarioStr);
                const plan = planStr ? JSON.parse(planStr) : { tipo: 'basic', nombre: 'Básico' };

                console.log('👤 Usuario cargado:', {
                    email: usuario.email,
                    nombre: usuario.nombre_tienda,
                    tienda: tiendaId,
                    plan: plan.tipo
                });

                // Actualizar UI si existen elementos
                this.actualizarUI(usuario, plan);

            } catch (error) {
                console.error('Error al cargar usuario:', error);
                this.cerrarSesion();
            }
        }
    }

    // Actualizar UI con información del usuario
    actualizarUI(usuario, plan) {
        // Actualizar nombre de usuario en header
        const userNameElements = document.querySelectorAll('.user-name, #userName');
        userNameElements.forEach(el => {
            el.textContent = usuario.nombre_tienda || usuario.email;
        });

        // Actualizar email
        const userEmailElements = document.querySelectorAll('.user-email, #userEmail');
        userEmailElements.forEach(el => {
            el.textContent = usuario.email;
        });

        // Actualizar plan
        const userPlanElements = document.querySelectorAll('.user-plan, #userPlan');
        userPlanElements.forEach(el => {
            el.textContent = `Plan ${plan.nombre || plan.tipo}`;
        });

        // Agregar badge de plan
        const planBadges = document.querySelectorAll('.plan-badge');
        planBadges.forEach(badge => {
            badge.textContent = plan.nombre || plan.tipo;
            badge.className = `plan-badge plan-${plan.tipo}`;
        });
    }

    // Verificar si el usuario tiene acceso a una feature según su plan
    verificarAccesoFeature(feature) {
        const planStr = localStorage.getItem('cresalia_plan_actual');
        const plan = planStr ? JSON.parse(planStr) : { tipo: 'basic' };

        const featuresPlanes = {
            'basic': ['productos', 'servicios', 'ofertas', 'respaldo_emocional'],
            'starter': ['productos', 'servicios', 'ofertas', 'respaldo_emocional', 'analytics_basico'],
            'professional': ['productos', 'servicios', 'ofertas', 'analytics_completo', 'chat_avanzado'],
            'enterprise': ['productos', 'servicios', 'ofertas', 'analytics_completo', 'chat_avanzado', 'api_access', 'soporte_prioritario']
        };

        const featuresDisponibles = featuresPlanes[plan.tipo] || featuresPlanes['basic'];
        return featuresDisponibles.includes(feature);
    }

    // Restringir acceso a respaldo emocional solo para planes básicos/starter
    verificarAccesoRespaldoEmocional() {
        const planStr = localStorage.getItem('cresalia_plan_actual');
        const plan = planStr ? JSON.parse(planStr) : { tipo: 'basic' };

        // Solo planes basic y starter tienen acceso
        const tieneAcceso = plan.tipo === 'basic' || plan.tipo === 'starter';
        
        console.log('💜 Verificando acceso a respaldo emocional:', {
            plan: plan.tipo,
            tieneAcceso: tieneAcceso
        });

        return tieneAcceso;
    }

    // Cerrar sesión
    cerrarSesion() {
        console.log('👋 Cerrando sesión...');
        
        // Limpiar datos de sesión
        localStorage.removeItem('cresalia_sesion_activa');
        localStorage.removeItem('cresalia_session_token');
        localStorage.removeItem('cresalia_session_timestamp');
        localStorage.removeItem('cresalia_usuario_autenticado');
        localStorage.removeItem('cresalia_tienda_id');
        localStorage.removeItem('cresalia_plan_actual');
        
        // Redirigir al login
        this.redirigirALogin();
    }

    // Redirigir al login
    redirigirALogin() {
        // Guardar la URL actual para redirección post-login
        // PERO solo si no contiene variables sin procesar
        const urlActual = window.location.href;
        
        // Validar que la URL no contenga variables sin procesar
        if (urlActual && 
            !urlActual.includes('{widgetUrl}') && 
            !urlActual.includes('$%7BwidgetUrl%7D') && 
            !urlActual.includes('widgetUrl') &&
            !urlActual.includes('${') &&
            !(urlActual.includes('%7B') && urlActual.includes('%7D'))) {
            localStorage.setItem('cresalia_redirect_after_login', urlActual);
        } else {
            // Si la URL contiene variables sin procesar, no guardarla
            console.warn('⚠️ URL actual contiene variables sin procesar, no se guardará para redirección');
            localStorage.removeItem('cresalia_redirect_after_login');
        }
        
        // Redirigir
        setTimeout(() => {
            window.location.href = '../../login-tienda.html';
        }, 100);
    }

    // Obtener datos del usuario actual
    getUsuarioActual() {
        const usuarioStr = localStorage.getItem('cresalia_usuario_autenticado');
        return usuarioStr ? JSON.parse(usuarioStr) : null;
    }

    // Obtener plan actual
    getPlanActual() {
        const planStr = localStorage.getItem('cresalia_plan_actual');
        return planStr ? JSON.parse(planStr) : { tipo: 'basic', nombre: 'Básico' };
    }

    // Obtener ID de tienda
    getTiendaId() {
        return localStorage.getItem('cresalia_tienda_id');
    }
}

// Crear instancia global
window.authGuard = new AuthGuard();

// Exportar funciones útiles
window.cerrarSesion = () => window.authGuard.cerrarSesion();
window.verificarAccesoFeature = (feature) => window.authGuard.verificarAccesoFeature(feature);
window.verificarAccesoRespaldoEmocional = () => window.authGuard.verificarAccesoRespaldoEmocional();
window.getUsuarioActual = () => window.authGuard.getUsuarioActual();
window.getPlanActual = () => window.authGuard.getPlanActual();
window.getTiendaId = () => window.authGuard.getTiendaId();

console.log('✅ Auth Guard inicializado correctamente');
















