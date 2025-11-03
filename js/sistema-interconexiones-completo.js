// ===== SISTEMA DE INTERCONEXIONES COMPLETO CRESALIA =====
// Sistema que conecta todos los módulos y funcionalidades

class SistemaInterconexionesCompleto {
    constructor() {
        this.modulos = {};
        this.conexiones = {};
        this.estado = {};
        this.inicializar();
    }

    // Inicializar sistema de interconexiones
    inicializar() {
        console.log('🔗 Inicializando Sistema de Interconexiones Completo...');
        
        // Configurar módulos principales
        this.configurarModulos();
        
        // Configurar conexiones entre módulos
        this.configurarConexiones();
        
        // Configurar sincronización de datos
        this.configurarSincronizacion();
        
        // Configurar monitoreo de estado
        this.configurarMonitoreo();
        
        console.log('✅ Sistema de Interconexiones Completo inicializado');
    }

    // Configurar módulos principales
    configurarModulos() {
        this.modulos = {
            // Módulos de negocio
            ventas: {
                nombre: 'Sistema de Ventas',
                estado: 'activo',
                dependencias: ['productos', 'clientes', 'pagos'],
                funcionalidades: ['crearVenta', 'confirmarPago', 'generarComprobante']
            },
            productos: {
                nombre: 'Gestión de Productos',
                estado: 'activo',
                dependencias: ['categorias', 'inventario'],
                funcionalidades: ['crearProducto', 'actualizarStock', 'categorizar']
            },
            servicios: {
                nombre: 'Gestión de Servicios',
                estado: 'activo',
                dependencias: ['turnos', 'calendario'],
                funcionalidades: ['crearServicio', 'programarTurno', 'confirmarReserva']
            },
            
            // Módulos de comunicación
            notificaciones: {
                nombre: 'Sistema de Notificaciones',
                estado: 'activo',
                dependencias: ['usuarios', 'eventos'],
                funcionalidades: ['enviarNotificacion', 'configurarAlertas', 'programarRecordatorios']
            },
            chatbot: {
                nombre: 'Chatbot IA',
                estado: 'activo',
                dependencias: ['conocimiento', 'usuarios'],
                funcionalidades: ['procesarMensaje', 'generarRespuesta', 'aprenderInteraccion']
            },
            
            // Módulos de análisis
            analytics: {
                nombre: 'Analytics Avanzados',
                estado: 'activo',
                dependencias: ['ventas', 'usuarios', 'comportamiento'],
                funcionalidades: ['generarMetricas', 'crearReportes', 'predecirTendencias']
            },
            ia: {
                nombre: 'IA Avanzada',
                estado: 'activo',
                dependencias: ['datos', 'modelos', 'algoritmos'],
                funcionalidades: ['predecirDemanda', 'optimizarPrecios', 'recomendarProductos']
            },
            
            // Módulos de seguridad
            seguridad: {
                nombre: 'Sistema de Seguridad',
                estado: 'activo',
                dependencias: ['autenticacion', 'autorizacion'],
                funcionalidades: ['verificarIdentidad', 'detectarFraudes', 'monitorearActividad']
            },
            auditoria: {
                nombre: 'Sistema de Auditoría',
                estado: 'activo',
                dependencias: ['eventos', 'usuarios'],
                funcionalidades: ['registrarEvento', 'generarReporte', 'analizarPatrones']
            },
            
            // Módulos de comunidad
            comunidadVendedores: {
                nombre: 'Comunidad de Vendedores',
                estado: 'activo',
                dependencias: ['usuarios', 'reportes'],
                funcionalidades: ['reportarFraude', 'bloquearUsuario', 'gestionarComunidad']
            },
            comunidadCompradores: {
                nombre: 'Comunidad de Compradores',
                estado: 'activo',
                dependencias: ['usuarios', 'valoraciones'],
                funcionalidades: ['valorarTienda', 'reportarProblema', 'gestionarFavoritos']
            },
            
            // Módulos de bienestar
            bienestar: {
                nombre: 'Sistema de Bienestar',
                estado: 'activo',
                dependencias: ['usuarios', 'contenido'],
                funcionalidades: ['mostrarRecursos', 'programarRecordatorios', 'personalizarContenido']
            },
            motivacion: {
                nombre: 'Sistema Motivacional',
                estado: 'activo',
                dependencias: ['usuarios', 'logros'],
                funcionalidades: ['mostrarDesafios', 'otorgarLogros', 'generarMotivacion']
            }
        };
    }

    // Configurar conexiones entre módulos
    configurarConexiones() {
        this.conexiones = {
            // Conexiones de datos
            datos: {
                ventas: ['productos', 'clientes', 'pagos'],
                productos: ['categorias', 'inventario', 'ventas'],
                servicios: ['turnos', 'calendario', 'reservas'],
                usuarios: ['ventas', 'comunidad', 'bienestar']
            },
            
            // Conexiones de eventos
            eventos: {
                nuevaVenta: ['notificaciones', 'analytics', 'auditoria'],
                nuevoProducto: ['inventario', 'categorias', 'analytics'],
                nuevoServicio: ['turnos', 'calendario', 'notificaciones'],
                nuevoUsuario: ['notificaciones', 'bienestar', 'comunidad'],
                pagoConfirmado: ['ventas', 'notificaciones', 'analytics'],
                reporteFraude: ['seguridad', 'comunidad', 'auditoria']
            },
            
            // Conexiones de funcionalidades
            funcionalidades: {
                dashboard: ['analytics', 'ventas', 'usuarios', 'productos'],
                reportes: ['analytics', 'auditoria', 'ventas'],
                configuracion: ['usuarios', 'seguridad', 'notificaciones'],
                comunidad: ['usuarios', 'reportes', 'valoraciones']
            }
        };
    }

    // Configurar sincronización de datos
    configurarSincronizacion() {
        // Sincronización automática cada 30 segundos
        setInterval(() => {
            this.sincronizarDatos();
        }, 30000);
        
        // Sincronización en eventos importantes
        this.configurarSincronizacionEventos();
    }

    // Sincronizar datos entre módulos
    sincronizarDatos() {
        console.log('🔄 Sincronizando datos entre módulos...');
        
        // Sincronizar datos de ventas
        this.sincronizarVentas();
        
        // Sincronizar datos de usuarios
        this.sincronizarUsuarios();
        
        // Sincronizar datos de productos
        this.sincronizarProductos();
        
        // Sincronizar datos de servicios
        this.sincronizarServicios();
        
        console.log('✅ Datos sincronizados correctamente');
    }

    // Sincronizar datos de ventas
    sincronizarVentas() {
        const ventas = JSON.parse(localStorage.getItem('ventasConfirmadas') || '[]');
        const ventasPendientes = JSON.parse(localStorage.getItem('ventasPendientes') || '[]');
        
        // Sincronizar con analytics
        if (window.sistemaAnalytics) {
            window.sistemaAnalytics.actualizarMetricas();
        }
        
        // Sincronizar con IA
        if (window.sistemaIA && typeof window.sistemaIA.optimizarPrecios === 'function') {
            window.sistemaIA.optimizarPrecios();
        } else {
            console.log('⚠️ Sistema IA no disponible o función no encontrada');
        }
        
        // Sincronizar con notificaciones
        if (window.sistemaNotificaciones) {
            this.verificarNotificacionesVentas(ventas, ventasPendientes);
        }
    }

    // Sincronizar datos de usuarios
    sincronizarUsuarios() {
        const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
        const sesiones = JSON.parse(localStorage.getItem('sesionesActivas') || '[]');
        
        // Sincronizar con seguridad
        if (window.sistemaSeguridad) {
            window.sistemaSeguridad.detectarMultiplesSesiones();
        }
        
        // Sincronizar con bienestar
        if (window.sistemaBienestar) {
            this.verificarBienestarUsuarios(usuarios);
        }
    }

    // Sincronizar datos de productos
    sincronizarProductos() {
        const productos = JSON.parse(localStorage.getItem('productosTienda') || '[]');
        
        // Sincronizar con inventario
        this.verificarStockProductos(productos);
        
        // Sincronizar con categorías
        this.verificarCategoriasProductos(productos);
    }

    // Sincronizar datos de servicios
    sincronizarServicios() {
        const servicios = JSON.parse(localStorage.getItem('serviciosTienda') || '[]');
        const turnos = JSON.parse(localStorage.getItem('turnosProgramados') || '[]');
        
        // Sincronizar con calendario
        this.verificarDisponibilidadServicios(servicios, turnos);
    }

    // Configurar sincronización en eventos
    configurarSincronizacionEventos() {
        // Evento: Nueva venta
        this.registrarEvento('nuevaVenta', (datos) => {
            this.procesarNuevaVenta(datos);
        });
        
        // Evento: Nuevo producto
        this.registrarEvento('nuevoProducto', (datos) => {
            this.procesarNuevoProducto(datos);
        });
        
        // Evento: Nuevo servicio
        this.registrarEvento('nuevoServicio', (datos) => {
            this.procesarNuevoServicio(datos);
        });
        
        // Evento: Nuevo usuario
        this.registrarEvento('nuevoUsuario', (datos) => {
            this.procesarNuevoUsuario(datos);
        });
    }

    // Procesar nueva venta
    procesarNuevaVenta(datos) {
        console.log('💰 Procesando nueva venta:', datos);
        
        // Actualizar analytics
        if (window.sistemaAnalytics) {
            window.sistemaAnalytics.actualizarMetricas();
        }
        
        // Enviar notificación
        if (window.sistemaNotificaciones) {
            window.sistemaNotificaciones.enviarNotificacion({
                titulo: '💰 Nueva Venta',
                mensaje: `Venta de $${datos.monto} registrada`,
                icono: '/favicon.ico',
                tag: 'nueva-venta'
            });
        }
        
        // Actualizar IA
        if (window.sistemaIA && typeof window.sistemaIA.optimizarPrecios === 'function') {
            window.sistemaIA.optimizarPrecios();
        } else {
            console.log('⚠️ Sistema IA no disponible o función no encontrada');
        }
    }

    // Procesar nuevo producto
    procesarNuevoProducto(datos) {
        console.log('📦 Procesando nuevo producto:', datos);
        
        // Actualizar inventario
        this.actualizarInventario(datos);
        
        // Enviar notificación
        if (window.sistemaNotificaciones) {
            window.sistemaNotificaciones.enviarNotificacion({
                titulo: '📦 Nuevo Producto',
                mensaje: `Producto "${datos.nombre}" agregado al catálogo`,
                icono: '/favicon.ico',
                tag: 'nuevo-producto'
            });
        }
    }

    // Procesar nuevo servicio
    procesarNuevoServicio(datos) {
        console.log('🔧 Procesando nuevo servicio:', datos);
        
        // Actualizar calendario
        this.actualizarCalendario(datos);
        
        // Enviar notificación
        if (window.sistemaNotificaciones) {
            window.sistemaNotificaciones.enviarNotificacion({
                titulo: '🔧 Nuevo Servicio',
                mensaje: `Servicio "${datos.nombre}" agregado`,
                icono: '/favicon.ico',
                tag: 'nuevo-servicio'
            });
        }
    }

    // Procesar nuevo usuario
    procesarNuevoUsuario(datos) {
        console.log('👤 Procesando nuevo usuario:', datos);
        
        // Enviar mensaje de bienvenida
        if (window.enviarMensajeBienvenida) {
            window.enviarMensajeBienvenida(datos.email, datos.nombre, datos.tipo);
        }
        
        // Enviar notificación
        if (window.sistemaNotificaciones) {
            window.sistemaNotificaciones.enviarNotificacion({
                titulo: '👤 Nuevo Usuario',
                mensaje: `Usuario "${datos.nombre}" se ha registrado`,
                icono: '/favicon.ico',
                tag: 'nuevo-usuario'
            });
        }
    }

    // Configurar monitoreo de estado
    configurarMonitoreo() {
        // Monitoreo cada 60 segundos
        setInterval(() => {
            this.monitorearEstado();
        }, 60000);
        
        // Monitoreo de salud del sistema
        this.configurarMonitoreoSalud();
    }

    // Configurar monitoreo de salud
    configurarMonitoreoSalud() {
        // Verificar salud del sistema cada 5 minutos
        setInterval(() => {
            this.verificarSaludSistema();
        }, 5 * 60 * 1000);
    }

    // Verificar salud del sistema
    verificarSaludSistema() {
        const salud = {
            memoria: this.verificarMemoria(),
            rendimiento: this.verificarRendimiento(),
            conexiones: this.verificarConexiones(),
            datos: this.verificarIntegridadDatos()
        };
        
        // Alertar si hay problemas de salud
        if (salud.memoria < 0.8 || salud.rendimiento < 0.7) {
            this.alertarProblemasSalud(salud);
        }
    }

    // Verificar memoria
    verificarMemoria() {
        if (performance.memory) {
            const memoriaUsada = performance.memory.usedJSHeapSize;
            const memoriaTotal = performance.memory.totalJSHeapSize;
            return memoriaUsada / memoriaTotal;
        }
        return 1; // Asumir que está bien si no hay información
    }

    // Verificar rendimiento
    verificarRendimiento() {
        const inicio = performance.now();
        
        // Simular operación
        JSON.parse(localStorage.getItem('ventasConfirmadas') || '[]');
        
        const fin = performance.now();
        const tiempo = fin - inicio;
        
        return tiempo < 100 ? 1 : tiempo < 500 ? 0.8 : 0.5;
    }

    // Verificar conexiones
    verificarConexiones() {
        const conexionesActivas = Object.keys(this.conexiones).length;
        const conexionesEsperadas = 4; // Datos, eventos, funcionalidades, etc.
        
        return Math.min(conexionesActivas / conexionesEsperadas, 1);
    }

    // Verificar integridad de datos
    verificarIntegridadDatos() {
        try {
            JSON.parse(localStorage.getItem('ventasConfirmadas') || '[]');
            JSON.parse(localStorage.getItem('productosTienda') || '[]');
            JSON.parse(localStorage.getItem('serviciosTienda') || '[]');
            return 1;
        } catch (error) {
            return 0;
        }
    }

    // Alertar problemas de salud
    alertarProblemasSalud(salud) {
        console.warn('⚠️ Problemas de salud del sistema detectados:', salud);
        
        if (window.sistemaNotificaciones) {
            window.sistemaNotificaciones.enviarNotificacion({
                titulo: '⚠️ Salud del Sistema',
                mensaje: 'Se detectaron problemas de rendimiento',
                icono: '/favicon.ico',
                tag: 'salud-sistema'
            });
        }
    }

    // Monitorear estado del sistema
    monitorearEstado() {
        const estado = {
            modulos: this.verificarEstadoModulos(),
            conexiones: this.verificarEstadoConexiones(),
            datos: this.verificarEstadoDatos(),
            rendimiento: this.verificarRendimiento()
        };
        
        this.estado = estado;
        
        // Guardar estado
        localStorage.setItem('estadoSistemaCresalia', JSON.stringify(estado));
        
        // Alertar si hay problemas
        this.verificarProblemas(estado);
    }

    // Verificar estado de módulos
    verificarEstadoModulos() {
        const estadoModulos = {};
        
        Object.keys(this.modulos).forEach(modulo => {
            estadoModulos[modulo] = {
                estado: this.modulos[modulo].estado,
                dependencias: this.verificarDependencias(modulo),
                funcionalidades: this.verificarFuncionalidades(modulo)
            };
        });
        
        return estadoModulos;
    }

    // Verificar estado de conexiones
    verificarEstadoConexiones() {
        const estadoConexiones = {};
        
        Object.keys(this.conexiones).forEach(tipo => {
            estadoConexiones[tipo] = this.verificarConexionesTipo(tipo);
        });
        
        return estadoConexiones;
    }

    // Verificar estado de datos
    verificarEstadoDatos() {
        return {
            ventas: JSON.parse(localStorage.getItem('ventasConfirmadas') || '[]').length,
            productos: JSON.parse(localStorage.getItem('productosTienda') || '[]').length,
            servicios: JSON.parse(localStorage.getItem('serviciosTienda') || '[]').length,
            usuarios: JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]').length,
            notificaciones: JSON.parse(localStorage.getItem('notificacionesCresalia') || '[]').length
        };
    }

    // Verificar rendimiento
    verificarRendimiento() {
        const inicio = performance.now();
        
        // Simular operaciones
        JSON.parse(localStorage.getItem('ventasConfirmadas') || '[]');
        JSON.parse(localStorage.getItem('productosTienda') || '[]');
        JSON.parse(localStorage.getItem('serviciosTienda') || '[]');
        
        const fin = performance.now();
        const tiempo = fin - inicio;
        
        return {
            tiempoOperacion: tiempo,
            nivel: tiempo < 100 ? 'excelente' : tiempo < 500 ? 'bueno' : 'lento'
        };
    }

    // Verificar problemas
    verificarProblemas(estado) {
        const problemas = [];
        
        // Verificar módulos inactivos
        Object.keys(estado.modulos).forEach(modulo => {
            if (estado.modulos[modulo].estado !== 'activo') {
                problemas.push(`Módulo ${modulo} inactivo`);
            }
        });
        
        // Verificar rendimiento lento
        if (estado.rendimiento.nivel === 'lento') {
            problemas.push('Rendimiento del sistema lento');
        }
        
        // Alertar si hay problemas
        if (problemas.length > 0) {
            this.alertarProblemas(problemas);
        }
    }

    // Alertar problemas
    alertarProblemas(problemas) {
        console.warn('⚠️ Problemas detectados en el sistema:', problemas);
        
        // Enviar notificación
        if (window.sistemaNotificaciones) {
            window.sistemaNotificaciones.enviarNotificacion({
                titulo: '⚠️ Problemas del Sistema',
                mensaje: `Se detectaron ${problemas.length} problemas`,
                icono: '/favicon.ico',
                tag: 'problemas-sistema'
            });
        }
    }

    // Verificar notificaciones de ventas
    verificarNotificacionesVentas(ventas, ventasPendientes) {
        if (ventasPendientes.length > 0) {
            window.sistemaNotificaciones.enviarNotificacion({
                titulo: '💰 Pagos Pendientes',
                mensaje: `Tienes ${ventasPendientes.length} pagos pendientes`,
                icono: '/favicon.ico',
                tag: 'pagos-pendientes'
            });
        }
    }

    // Verificar bienestar de usuarios
    verificarBienestarUsuarios(usuarios) {
        // Verificar si hay usuarios que necesiten bienestar
        const usuariosNecesitanBienestar = usuarios.filter(u => 
            !u.ultimoAccesoBienestar || 
            new Date(u.ultimoAccesoBienestar) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        
        if (usuariosNecesitanBienestar.length > 0) {
            console.log('💜 Usuarios que necesitan bienestar:', usuariosNecesitanBienestar.length);
        }
    }

    // Verificar stock de productos
    verificarStockProductos(productos) {
        const productosBajoStock = productos.filter(p => p.stock < 10);
        
        if (productosBajoStock.length > 0) {
            console.log('📦 Productos con stock bajo:', productosBajoStock.length);
        }
    }

    // Verificar categorías de productos
    verificarCategoriasProductos(productos) {
        const productosSinCategoria = productos.filter(p => !p.categoria);
        
        if (productosSinCategoria.length > 0) {
            console.log('📂 Productos sin categoría:', productosSinCategoria.length);
        }
    }

    // Verificar disponibilidad de servicios
    verificarDisponibilidadServicios(servicios, turnos) {
        const serviciosOcupados = servicios.filter(s => {
            const turnosServicio = turnos.filter(t => t.servicio === s.nombre);
            return turnosServicio.length >= s.capacidad;
        });
        
        if (serviciosOcupados.length > 0) {
            console.log('🔧 Servicios con capacidad completa:', serviciosOcupados.length);
        }
    }

    // Métodos auxiliares
    verificarDependencias(modulo) {
        const dependencias = this.modulos[modulo].dependencias || [];
        return dependencias.map(dep => ({
            modulo: dep,
            estado: this.modulos[dep] ? this.modulos[dep].estado : 'no encontrado'
        }));
    }

    verificarFuncionalidades(modulo) {
        const funcionalidades = this.modulos[modulo].funcionalidades || [];
        return funcionalidades.map(func => ({
            nombre: func,
            estado: 'disponible'
        }));
    }

    verificarConexionesTipo(tipo) {
        const conexiones = this.conexiones[tipo] || {};
        return Object.keys(conexiones).map(conexion => ({
            nombre: conexion,
            estado: 'activa'
        }));
    }

    actualizarInventario(datos) {
        // Actualizar inventario del producto
        const productos = JSON.parse(localStorage.getItem('productosTienda') || '[]');
        const producto = productos.find(p => p.nombre === datos.nombre);
        
        if (producto) {
            producto.stock = (producto.stock || 0) + (datos.cantidad || 1);
            localStorage.setItem('productosTienda', JSON.stringify(productos));
        }
    }

    actualizarCalendario(datos) {
        // Actualizar calendario con nuevo servicio
        const turnos = JSON.parse(localStorage.getItem('turnosProgramados') || '[]');
        // Lógica para actualizar calendario
    }

    registrarEvento(evento, callback) {
        // Registrar callback para evento
        if (!this.eventos) {
            this.eventos = {};
        }
        
        if (!this.eventos[evento]) {
            this.eventos[evento] = [];
        }
        
        this.eventos[evento].push(callback);
    }

    dispararEvento(evento, datos) {
        // Disparar evento y ejecutar callbacks
        if (this.eventos && this.eventos[evento]) {
            this.eventos[evento].forEach(callback => {
                try {
                    callback(datos);
                } catch (error) {
                    console.error(`Error en callback del evento ${evento}:`, error);
                }
            });
        }
    }

    // Obtener estado completo del sistema
    obtenerEstadoCompleto() {
        return {
            modulos: this.modulos,
            conexiones: this.conexiones,
            estado: this.estado,
            ultimaActualizacion: new Date().toISOString()
        };
    }

    // Obtener reporte de interconexiones
    obtenerReporteInterconexiones() {
        const estado = this.obtenerEstadoCompleto();
        
        return {
            totalModulos: Object.keys(estado.modulos).length,
            modulosActivos: Object.values(estada.modulos).filter(m => m.estado === 'activo').length,
            totalConexiones: Object.keys(estado.conexiones).length,
            estadoGeneral: this.calcularEstadoGeneral(estado),
            recomendaciones: this.generarRecomendaciones(estado)
        };
    }

    calcularEstadoGeneral(estado) {
        const modulosActivos = Object.values(estado.modulos).filter(m => m.estado === 'activo').length;
        const totalModulos = Object.keys(estado.modulos).length;
        
        if (modulosActivos === totalModulos) return 'Excelente';
        if (modulosActivos >= totalModulos * 0.8) return 'Bueno';
        return 'Necesita atención';
    }

    generarRecomendaciones(estado) {
        const recomendaciones = [];
        
        // Recomendaciones basadas en estado de módulos
        Object.keys(estado.modulos).forEach(modulo => {
            if (estado.modulos[modulo].estado !== 'activo') {
                recomendaciones.push(`Revisar módulo ${modulo}`);
            }
        });
        
        // Recomendaciones basadas en rendimiento
        if (estado.rendimiento && estado.rendimiento.nivel === 'lento') {
            recomendaciones.push('Optimizar rendimiento del sistema');
        }
        
        return recomendaciones;
    }
}

// Inicializar sistema globalmente
window.sistemaInterconexiones = new SistemaInterconexionesCompleto();

// Funciones globales
window.obtenerEstadoSistema = function() {
    return window.sistemaInterconexiones.obtenerEstadoCompleto();
};

window.obtenerReporteInterconexiones = function() {
    return window.sistemaInterconexiones.obtenerReporteInterconexiones();
};

window.mostrarDashboardInterconexiones = function() {
    const reporte = window.sistemaInterconexiones.obtenerReporteInterconexiones();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0,0,0,0.8) !important;
        z-index: 999999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 30px; max-width: 90vw; max-height: 90vh; width: 90%; overflow-y: auto;">
            <h3 style="color: #667eea; margin-bottom: 20px;">🔗 Dashboard de Interconexiones</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4 style="margin: 0; color: #667eea; font-size: 2em;">${reporte.totalModulos}</h4>
                    <p style="margin: 5px 0; color: #666;">Total Módulos</p>
                </div>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4 style="margin: 0; color: #667eea; font-size: 2em;">${reporte.modulosActivos}</h4>
                    <p style="margin: 5px 0; color: #666;">Módulos Activos</p>
                </div>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4 style="margin: 0; color: #667eea; font-size: 2em;">${reporte.totalConexiones}</h4>
                    <p style="margin: 5px 0; color: #666;">Total Conexiones</p>
                </div>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4 style="margin: 0; color: #667eea; font-size: 2em;">${reporte.estadoGeneral}</h4>
                    <p style="margin: 5px 0; color: #666;">Estado General</p>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #374151; margin-bottom: 10px;">Recomendaciones</h4>
                <div style="background: #f0f9ff; padding: 15px; border-radius: 8px;">
                    ${reporte.recomendaciones.map(rec => `<p style="margin: 5px 0; color: #0369a1;">• ${rec}</p>`).join('')}
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button onclick="cerrarModal(this)" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

console.log('✅ Sistema de Interconexiones Completo cargado correctamente');
