// ============================================
// SISTEMA DE INTERCONEXIONES - CRESALIA
// Conecta todos los módulos del sistema
// ============================================

console.log('🔗 Sistema de interconexiones cargado');

class SistemaInterconexiones {
    constructor() {
        this.modulosDisponibles = {};
        this.init();
    }

    init() {
        console.log('🚀 Inicializando interconexiones...');
        this.registrarModulos();
        this.configurarEventos();
        this.sincronizarDatos();
    }

    // Registrar módulos disponibles
    registrarModulos() {
        this.modulosDisponibles = {
            auth: {
                nombre: 'Autenticación',
                archivos: ['auth-guard.js', 'auth-system.js'],
                funciones: ['verificarAutenticacion', 'cerrarSesion']
            },
            productos: {
                nombre: 'Gestión de Productos',
                archivos: ['admin-productos.html'],
                funciones: ['guardarProducto', 'eliminarProducto']
            },
            servicios: {
                nombre: 'Gestión de Servicios',
                archivos: ['admin-servicios.html'],
                funciones: ['guardarServicio', 'eliminarServicio']
            },
            ofertas: {
                nombre: 'Gestión de Ofertas',
                archivos: ['admin-ofertas.html'],
                funciones: ['guardarOferta', 'eliminarOferta']
            },
            pagos: {
                nombre: 'Sistema de Pagos',
                archivos: ['admin-pagos.html'],
                funciones: ['procesarPago', 'configurarAutodebito']
            },
            analytics: {
                nombre: 'Analytics',
                archivos: ['admin-analytics.html'],
                funciones: ['cargarEstadisticas', 'generarGraficas']
            },
            respaldoEmocional: {
                nombre: 'Respaldo Emocional',
                archivos: ['admin-bienestar.html'],
                funciones: ['guardarEntrada', 'verHistorial'],
                soloPlanes: ['basic', 'starter'] // ✅ SOLO para planes básicos/starter
            },
            chatbot: {
                nombre: 'Chatbot y Soporte',
                archivos: ['tienda-search-chatbot.css'],
                funciones: ['iniciarChat', 'enviarMensaje']
            }
        };

        console.log('📦 Módulos registrados:', Object.keys(this.modulosDisponibles));
    }

    // Configurar eventos entre módulos
    configurarEventos() {
        // Evento: Al guardar un producto
        window.addEventListener('producto:guardado', (e) => {
            console.log('✅ Producto guardado:', e.detail);
            this.sincronizarProductos();
        });

        // Evento: Al cambiar de plan
        window.addEventListener('plan:cambiado', (e) => {
            console.log('🔄 Plan cambiado:', e.detail);
            this.actualizarAccesosSegunPlan(e.detail.nuevoPlan);
        });

        // Evento: Al iniciar sesión
        window.addEventListener('sesion:iniciada', (e) => {
            console.log('👤 Sesión iniciada:', e.detail);
            this.cargarDatosUsuario();
        });

        // Evento: Al cerrar sesión
        window.addEventListener('sesion:cerrada', () => {
            console.log('👋 Sesión cerrada');
            this.limpiarDatosLocales();
        });
    }

    // Sincronizar datos entre módulos
    sincronizarDatos() {
        // Sincronizar productos entre admin y tienda pública
        this.sincronizarProductos();
        
        // Sincronizar configuración de la tienda
        this.sincronizarConfiguracion();
        
        // Sincronizar datos del usuario
        this.cargarDatosUsuario();
    }

    // Sincronizar productos
    sincronizarProductos() {
        const tiendaId = this.getTiendaId();
        if (!tiendaId) return;

        const productos = localStorage.getItem(`productos_${tiendaId}`);
        if (productos) {
            console.log('🔄 Productos sincronizados para tienda:', tiendaId);
            
            // Actualizar contador en el dashboard
            const productosArray = JSON.parse(productos);
            this.actualizarContador('productos', productosArray.length);
        }
    }

    // Sincronizar configuración
    sincronizarConfiguracion() {
        const tiendaId = this.getTiendaId();
        if (!tiendaId) return;

        const config = localStorage.getItem(`config_${tiendaId}`);
        if (config) {
            console.log('⚙️ Configuración sincronizada');
        }
    }

    // Cargar datos del usuario actual
    cargarDatosUsuario() {
        if (typeof window.authGuard !== 'undefined') {
            const usuario = window.authGuard.getUsuarioActual();
            const plan = window.authGuard.getPlanActual();
            
            if (usuario) {
                console.log('👤 Datos cargados:', {
                    email: usuario.email,
                    plan: plan.tipo
                });
            }
        }
    }

    // Actualizar accesos según plan (IMPORTANTE: Respaldo emocional solo para basic/starter)
    actualizarAccesosSegunPlan(plan) {
        const planTipo = plan.tipo || plan;
        
        console.log('🔐 Actualizando accesos para plan:', planTipo);

        // Verificar cada módulo
        Object.entries(this.modulosDisponibles).forEach(([key, modulo]) => {
            if (modulo.soloPlanes) {
                const tieneAcceso = modulo.soloPlanes.includes(planTipo);
                
                console.log(`${tieneAcceso ? '✅' : '❌'} ${modulo.nombre} - Plan ${planTipo}`);
                
                // Ocultar/mostrar elementos según acceso
                if (key === 'respaldoEmocional') {
                    this.configurarAccesoRespaldoEmocional(tieneAcceso);
                }
            }
        });
    }

    // Configurar acceso a respaldo emocional
    configurarAccesoRespaldoEmocional(tieneAcceso) {
        // Buscar elementos del respaldo emocional en la interfaz
        const elementos = [
            document.querySelector('[href*="admin-bienestar"]'),
            document.querySelector('.respaldo-emocional'),
            document.querySelector('#bienestar-tab')
        ];

        elementos.forEach(el => {
            if (el) {
                if (tieneAcceso) {
                    el.style.display = '';
                    el.removeAttribute('disabled');
                } else {
                    el.style.display = 'none';
                    el.setAttribute('disabled', 'true');
                }
            }
        });

        // Agregar mensaje si no tiene acceso
        if (!tieneAcceso) {
            const mensajeRestricted = document.createElement('div');
            mensajeRestricted.className = 'feature-restricted';
            mensajeRestricted.innerHTML = `
                <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; border-radius: 10px; margin: 20px 0;">
                    <p style="margin: 0; color: #92400E; font-weight: 600;">
                        💼 El respaldo emocional está disponible solo para emprendimientos pequeños (planes Básico y Starter).
                    </p>
                    <p style="margin: 5px 0 0 0; color: #92400E; font-size: 14px;">
                        Tu plan actual está enfocado en herramientas empresariales avanzadas.
                    </p>
                </div>
            `;
        }

        console.log(tieneAcceso ? '✅ Respaldo emocional habilitado' : '❌ Respaldo emocional deshabilitado');
    }

    // Actualizar contador en dashboard
    actualizarContador(tipo, valor) {
        const elemento = document.getElementById(`total${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
        if (elemento) {
            elemento.textContent = valor;
        }
    }

    // Obtener ID de tienda actual
    getTiendaId() {
        if (typeof window.authGuard !== 'undefined') {
            return window.authGuard.getTiendaId();
        }
        return localStorage.getItem('cresalia_tienda_id');
    }

    // Limpiar datos locales
    limpiarDatosLocales() {
        console.log('🧹 Limpiando datos locales...');
        // Mantener solo configuración básica
        const keysAMantener = ['cresalia_theme', 'cresalia_language'];
        
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cresalia_') && !keysAMantener.includes(key)) {
                localStorage.removeItem(key);
            }
        });
    }

    // Verificar disponibilidad de un módulo
    verificarDisponibilidad(modulo) {
        const moduloInfo = this.modulosDisponibles[modulo];
        if (!moduloInfo) {
            console.warn(`⚠️ Módulo no encontrado: ${modulo}`);
            return false;
        }

        // Si el módulo tiene restricción de planes
        if (moduloInfo.soloPlanes) {
            const plan = window.authGuard ? window.authGuard.getPlanActual() : { tipo: 'basic' };
            const tieneAcceso = moduloInfo.soloPlanes.includes(plan.tipo);
            
            if (!tieneAcceso) {
                console.warn(`🔒 Acceso denegado a ${moduloInfo.nombre} - Plan requerido: ${moduloInfo.soloPlanes.join(' o ')}`);
            }
            
            return tieneAcceso;
        }

        return true;
    }

    // Emitir evento personalizado
    emitirEvento(nombreEvento, datos) {
        const evento = new CustomEvent(nombreEvento, { detail: datos });
        window.dispatchEvent(evento);
        console.log('📢 Evento emitido:', nombreEvento, datos);
    }
}

// Crear instancia global
window.sistemaInterconexiones = new SistemaInterconexiones();

// Exportar funciones útiles
window.verificarDisponibilidadModulo = (modulo) => window.sistemaInterconexiones.verificarDisponibilidad(modulo);
window.emitirEvento = (nombre, datos) => window.sistemaInterconexiones.emitirEvento(nombre, datos);

// Al cargar la página, actualizar accesos según plan
window.addEventListener('DOMContentLoaded', () => {
    if (typeof window.authGuard !== 'undefined') {
        const plan = window.authGuard.getPlanActual();
        window.sistemaInterconexiones.actualizarAccesosSegunPlan(plan);
    }
});

console.log('✅ Sistema de interconexiones inicializado correctamente');
















