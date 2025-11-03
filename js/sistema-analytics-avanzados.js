// ===== SISTEMA DE ANALYTICS AVANZADOS CRESALIA =====
// Dashboard completo de métricas y análisis en tiempo real

class SistemaAnalyticsAvanzados {
    constructor() {
        this.metricas = {};
        this.predicciones = {};
        this.tendencias = {};
        this.inicializar();
    }

    // Inicializar sistema de analytics
    inicializar() {
        console.log('📊 Inicializando Sistema de Analytics Avanzados...');
        
        // Configurar recolección de datos
        this.configurarRecoleccionDatos();
        
        // Configurar análisis en tiempo real
        this.configurarAnalisisTiempoReal();
        
        // Configurar predicciones
        this.configurarPredicciones();
        
        // Configurar reportes automáticos
        this.configurarReportesAutomaticos();
        
        console.log('✅ Sistema de Analytics Avanzados inicializado');
    }

    // Configurar recolección de datos
    configurarRecoleccionDatos() {
        // Recolectar datos de ventas
        this.recolectarDatosVentas();
        
        // Recolectar datos de usuarios
        this.recolectarDatosUsuarios();
        
        // Recolectar datos de productos
        this.recolectarDatosProductos();
        
        // Recolectar datos de comportamiento
        this.recolectarDatosComportamiento();
    }

    // Recolectar datos de ventas
    recolectarDatosVentas() {
        const ventas = JSON.parse(localStorage.getItem('ventasConfirmadas') || '[]');
        const ventasPendientes = JSON.parse(localStorage.getItem('ventasPendientes') || '[]');
        
        this.metricas.ventas = {
            total: ventas.length + ventasPendientes.length,
            confirmadas: ventas.length,
            pendientes: ventasPendientes.length,
            ingresos: this.calcularIngresos(ventas),
            promedioVenta: this.calcularPromedioVenta(ventas),
            tendencia: this.calcularTendenciaVentas(ventas)
        };
    }

    // Recolectar datos de usuarios
    recolectarDatosUsuarios() {
        const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
        const sesiones = JSON.parse(localStorage.getItem('sesionesActivas') || '[]');
        
        this.metricas.usuarios = {
            total: usuarios.length,
            activos: sesiones.length,
            nuevos: this.calcularUsuariosNuevos(usuarios),
            retencion: this.calcularRetencion(usuarios),
            engagement: this.calcularEngagement(usuarios)
        };
    }

    // Recolectar datos de productos
    recolectarDatosProductos() {
        const productos = JSON.parse(localStorage.getItem('productosTienda') || '[]');
        const servicios = JSON.parse(localStorage.getItem('serviciosTienda') || '[]');
        
        this.metricas.productos = {
            total: productos.length + servicios.length,
            productos: productos.length,
            servicios: servicios.length,
            masVendidos: this.calcularMasVendidos(productos),
            menosVendidos: this.calcularMenosVendidos(productos),
            categorias: this.calcularCategorias(productos)
        };
    }

    // Recolectar datos de comportamiento
    recolectarDatosComportamiento() {
        const actividad = JSON.parse(localStorage.getItem('actividadUsuario') || '[]');
        const navegacion = JSON.parse(localStorage.getItem('navegacionUsuario') || '[]');
        
        this.metricas.comportamiento = {
            tiempoSesion: this.calcularTiempoSesion(actividad),
            paginasMasVisitadas: this.calcularPaginasMasVisitadas(navegacion),
            patronesNavegacion: this.calcularPatronesNavegacion(navegacion),
            conversion: this.calcularConversion(actividad)
        };
    }

    // Calcular ingresos
    calcularIngresos(ventas) {
        return ventas.reduce((total, venta) => total + (venta.monto || 0), 0);
    }

    // Calcular promedio de venta
    calcularPromedioVenta(ventas) {
        if (ventas.length === 0) return 0;
        const total = this.calcularIngresos(ventas);
        return total / ventas.length;
    }

    // Calcular tendencia de ventas
    calcularTendenciaVentas(ventas) {
        if (ventas.length < 2) return 'estable';
        
        const ultimaSemana = ventas.filter(v => {
            const fecha = new Date(v.fecha);
            const hace7Dias = new Date();
            hace7Dias.setDate(hace7Dias.getDate() - 7);
            return fecha > hace7Dias;
        });
        
        const semanaAnterior = ventas.filter(v => {
            const fecha = new Date(v.fecha);
            const hace14Dias = new Date();
            hace14Dias.setDate(hace14Dias.getDate() - 14);
            const hace7Dias = new Date();
            hace7Dias.setDate(hace7Dias.getDate() - 7);
            return fecha > hace14Dias && fecha <= hace7Dias;
        });
        
        if (ultimaSemana.length > semanaAnterior.length) return 'creciendo';
        if (ultimaSemana.length < semanaAnterior.length) return 'decreciendo';
        return 'estable';
    }

    // Calcular usuarios nuevos
    calcularUsuariosNuevos(usuarios) {
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);
        
        return usuarios.filter(u => new Date(u.fechaRegistro) > hace30Dias).length;
    }

    // Calcular retención
    calcularRetencion(usuarios) {
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);
        
        const usuariosActivos = usuarios.filter(u => {
            const ultimaActividad = new Date(u.ultimaActividad || u.fechaRegistro);
            return ultimaActividad > hace30Dias;
        });
        
        return usuarios.length > 0 ? (usuariosActivos.length / usuarios.length) * 100 : 0;
    }

    // Calcular engagement
    calcularEngagement(usuarios) {
        const actividad = JSON.parse(localStorage.getItem('actividadUsuario') || '[]');
        const sesiones = JSON.parse(localStorage.getItem('sesionesActivas') || '[]');
        
        return {
            promedioSesiones: sesiones.length / Math.max(usuarios.length, 1),
            promedioActividad: actividad.length / Math.max(usuarios.length, 1),
            nivel: this.determinarNivelEngagement(actividad.length, usuarios.length)
        };
    }

    // Determinar nivel de engagement
    determinarNivelEngagement(actividad, usuarios) {
        const ratio = actividad / Math.max(usuarios, 1);
        if (ratio > 10) return 'Alto';
        if (ratio > 5) return 'Medio';
        return 'Bajo';
    }

    // Calcular productos más vendidos
    calcularMasVendidos(productos) {
        return productos
            .sort((a, b) => (b.ventas || 0) - (a.ventas || 0))
            .slice(0, 5);
    }

    // Calcular productos menos vendidos
    calcularMenosVendidos(productos) {
        return productos
            .sort((a, b) => (a.ventas || 0) - (b.ventas || 0))
            .slice(0, 5);
    }

    // Calcular categorías
    calcularCategorias(productos) {
        const categorias = {};
        productos.forEach(producto => {
            const categoria = producto.categoria || 'Sin categoría';
            categorias[categoria] = (categorias[categoria] || 0) + 1;
        });
        return categorias;
    }

    // Calcular tiempo de sesión
    calcularTiempoSesion(actividad) {
        if (actividad.length < 2) return 0;
        
        const primeraActividad = new Date(actividad[0].fecha);
        const ultimaActividad = new Date(actividad[actividad.length - 1].fecha);
        
        return (ultimaActividad.getTime() - primeraActividad.getTime()) / 1000 / 60; // en minutos
    }

    // Calcular páginas más visitadas
    calcularPaginasMasVisitadas(navegacion) {
        const paginas = {};
        navegacion.forEach(nav => {
            const pagina = nav.pagina || 'desconocida';
            paginas[pagina] = (paginas[pagina] || 0) + 1;
        });
        
        return Object.entries(paginas)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
    }

    // Calcular patrones de navegación
    calcularPatronesNavegacion(navegacion) {
        const patrones = [];
        for (let i = 0; i < navegacion.length - 1; i++) {
            const actual = navegacion[i].pagina;
            const siguiente = navegacion[i + 1].pagina;
            patrones.push(`${actual} -> ${siguiente}`);
        }
        
        const patronesFrecuentes = {};
        patrones.forEach(patron => {
            patronesFrecuentes[patron] = (patronesFrecuentes[patron] || 0) + 1;
        });
        
        return Object.entries(patronesFrecuentes)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
    }

    // Calcular conversión
    calcularConversion(actividad) {
        const visitas = actividad.filter(a => a.tipo === 'visita').length;
        const compras = actividad.filter(a => a.tipo === 'compra').length;
        
        return visitas > 0 ? (compras / visitas) * 100 : 0;
    }

    // Configurar análisis en tiempo real
    configurarAnalisisTiempoReal() {
        // Actualizar métricas cada 30 segundos
        setInterval(() => {
            this.actualizarMetricas();
        }, 30000);
        
        // Detectar cambios importantes
        this.detectarCambiosImportantes();
    }

    // Actualizar métricas
    actualizarMetricas() {
        this.recolectarDatosVentas();
        this.recolectarDatosUsuarios();
        this.recolectarDatosProductos();
        this.recolectarDatosComportamiento();
        
        // Guardar métricas
        localStorage.setItem('metricasCresalia', JSON.stringify(this.metricas));
    }

    // Detectar cambios importantes
    detectarCambiosImportantes() {
        const metricasAnteriores = JSON.parse(localStorage.getItem('metricasAnteriores') || '{}');
        
        // Detectar cambios en ventas
        if (this.metricas.ventas && metricasAnteriores.ventas) {
            const cambioVentas = this.metricas.ventas.total - metricasAnteriores.ventas.total;
            if (Math.abs(cambioVentas) > 5) {
                this.alertarCambioImportante('ventas', cambioVentas);
            }
        }
        
        // Detectar cambios en usuarios
        if (this.metricas.usuarios && metricasAnteriores.usuarios) {
            const cambioUsuarios = this.metricas.usuarios.total - metricasAnteriores.usuarios.total;
            if (cambioUsuarios > 0) {
                this.alertarCambioImportante('usuarios', cambioUsuarios);
            }
        }
        
        // Guardar métricas actuales como anteriores
        localStorage.setItem('metricasAnteriores', JSON.stringify(this.metricas));
    }

    // Alertar cambio importante
    alertarCambioImportante(tipo, cambio) {
        const mensaje = tipo === 'ventas' 
            ? `Ventas ${cambio > 0 ? 'aumentaron' : 'disminuyeron'} en ${Math.abs(cambio)}`
            : `Nuevos usuarios: ${cambio}`;
        
        this.mostrarAlertaAnalytics({
            tipo: tipo,
            mensaje: mensaje,
            cambio: cambio,
            fecha: new Date().toISOString()
        });
    }

    // Mostrar alerta de analytics
    mostrarAlertaAnalytics(alert) {
        console.log('📊 Alerta de Analytics:', alert);
        
        // Guardar alerta
        const alertas = JSON.parse(localStorage.getItem('alertasAnalytics') || '[]');
        alertas.push(alert);
        localStorage.setItem('alertasAnalytics', JSON.stringify(alertas));
        
        // Mostrar notificación
        if (window.sistemaNotificaciones) {
            window.sistemaNotificaciones.enviarNotificacion({
                titulo: '📊 Cambio en Analytics',
                mensaje: alert.mensaje,
                icono: '/favicon.ico',
                tag: 'analytics-cambio'
            });
        }
    }

    // Configurar predicciones
    configurarPredicciones() {
        // Predicciones de ventas
        this.generarPrediccionesVentas();
        
        // Predicciones de usuarios
        this.generarPrediccionesUsuarios();
        
        // Predicciones de tendencias
        this.generarPrediccionesTendencias();
    }

    // Generar predicciones de ventas
    generarPrediccionesVentas() {
        const ventas = JSON.parse(localStorage.getItem('ventasConfirmadas') || '[]');
        
        if (ventas.length < 7) return; // Necesitamos al menos una semana de datos
        
        // Calcular promedio de ventas por día
        const ventasPorDia = this.agruparVentasPorDia(ventas);
        const promedioDiario = this.calcularPromedioDiario(ventasPorDia);
        
        // Predicción para los próximos 7 días
        const prediccion = [];
        for (let i = 1; i <= 7; i++) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + i);
            
            prediccion.push({
                fecha: fecha.toISOString().split('T')[0],
                ventasEsperadas: Math.round(promedioDiario * (1 + Math.random() * 0.2 - 0.1)), // ±10% de variación
                confianza: this.calcularConfianzaPrediccion(ventas.length)
            });
        }
        
        this.predicciones.ventas = prediccion;
    }

    // Agrupar ventas por día
    agruparVentasPorDia(ventas) {
        const ventasPorDia = {};
        ventas.forEach(venta => {
            const fecha = venta.fecha.split('T')[0];
            ventasPorDia[fecha] = (ventasPorDia[fecha] || 0) + 1;
        });
        return ventasPorDia;
    }

    // Calcular promedio diario
    calcularPromedioDiario(ventasPorDia) {
        const valores = Object.values(ventasPorDia);
        return valores.reduce((sum, val) => sum + val, 0) / valores.length;
    }

    // Calcular confianza de predicción
    calcularConfianzaPrediccion(cantidadDatos) {
        if (cantidadDatos < 7) return 'Baja';
        if (cantidadDatos < 30) return 'Media';
        return 'Alta';
    }

    // Generar predicciones de usuarios
    generarPrediccionesUsuarios() {
        const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
        
        if (usuarios.length < 7) return;
        
        // Calcular crecimiento de usuarios
        const crecimiento = this.calcularCrecimientoUsuarios(usuarios);
        
        // Predicción para los próximos 30 días
        const prediccion = [];
        for (let i = 1; i <= 30; i++) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + i);
            
            prediccion.push({
                fecha: fecha.toISOString().split('T')[0],
                usuariosEsperados: Math.round(usuarios.length + (crecimiento * i)),
                confianza: this.calcularConfianzaPrediccion(usuarios.length)
            });
        }
        
        this.predicciones.usuarios = prediccion;
    }

    // Calcular crecimiento de usuarios
    calcularCrecimientoUsuarios(usuarios) {
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);
        
        const usuariosRecientes = usuarios.filter(u => 
            new Date(u.fechaRegistro) > hace30Dias
        ).length;
        
        return usuariosRecientes / 30; // Crecimiento diario promedio
    }

    // Generar predicciones de tendencias
    generarPrediccionesTendencias() {
        const tendencias = {
            productos: this.predecirTendenciasProductos(),
            servicios: this.predecirTendenciasServicios(),
            estacionalidad: this.predecirEstacionalidad()
        };
        
        this.predicciones.tendencias = tendencias;
    }

    // Predecir tendencias de productos
    predecirTendenciasProductos() {
        const productos = JSON.parse(localStorage.getItem('productosTienda') || '[]');
        
        return productos
            .filter(p => p.ventas > 0)
            .sort((a, b) => b.ventas - a.ventas)
            .slice(0, 3)
            .map(p => ({
                nombre: p.nombre,
                tendencia: 'creciente',
                confianza: 'alta'
            }));
    }

    // Predecir tendencias de servicios
    predecirTendenciasServicios() {
        const servicios = JSON.parse(localStorage.getItem('serviciosTienda') || '[]');
        
        return servicios
            .filter(s => s.reservas > 0)
            .sort((a, b) => b.reservas - a.reservas)
            .slice(0, 3)
            .map(s => ({
                nombre: s.nombre,
                tendencia: 'creciente',
                confianza: 'alta'
            }));
    }

    // Predecir estacionalidad
    predecirEstacionalidad() {
        const ventas = JSON.parse(localStorage.getItem('ventasConfirmadas') || '[]');
        const mesActual = new Date().getMonth();
        
        // Análisis básico de estacionalidad
        const estacionalidad = {
            mesActual: this.obtenerNombreMes(mesActual),
            tendencia: 'estable',
            recomendaciones: this.generarRecomendacionesEstacionales(mesActual)
        };
        
        return estacionalidad;
    }

    // Obtener nombre del mes
    obtenerNombreMes(mes) {
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return meses[mes];
    }

    // Generar recomendaciones estacionales
    generarRecomendacionesEstacionales(mes) {
        const recomendaciones = {
            0: ['Promocionar productos de invierno', 'Ofrecer servicios de calefacción'],
            1: ['Preparar ofertas de San Valentín', 'Promocionar productos románticos'],
            2: ['Ofertas de primavera', 'Servicios de limpieza'],
            3: ['Productos de Pascua', 'Servicios de jardinería'],
            4: ['Ofertas de Día de la Madre', 'Productos para el hogar'],
            5: ['Promociones de invierno', 'Servicios de mantenimiento'],
            6: ['Ofertas de vacaciones', 'Productos de verano'],
            7: ['Promociones de Día del Padre', 'Servicios de reparación'],
            8: ['Ofertas de vuelta al cole', 'Productos escolares'],
            9: ['Promociones de Halloween', 'Servicios de decoración'],
            10: ['Ofertas de Black Friday', 'Productos de Navidad'],
            11: ['Promociones navideñas', 'Servicios de fiestas']
        };
        
        return recomendaciones[mes] || ['Mantener ofertas regulares'];
    }

    // Configurar reportes automáticos
    configurarReportesAutomaticos() {
        // Reporte diario
        setInterval(() => {
            this.generarReporteDiario();
        }, 24 * 60 * 60 * 1000); // 24 horas
        
        // Reporte semanal
        setInterval(() => {
            this.generarReporteSemanal();
        }, 7 * 24 * 60 * 60 * 1000); // 7 días
    }

    // Generar reporte diario
    generarReporteDiario() {
        const reporte = {
            fecha: new Date().toISOString(),
            tipo: 'diario',
            metricas: this.metricas,
            resumen: this.generarResumenDiario()
        };
        
        this.guardarReporte(reporte);
        console.log('📊 Reporte diario generado');
    }

    // Generar reporte semanal
    generarReporteSemanal() {
        const reporte = {
            fecha: new Date().toISOString(),
            tipo: 'semanal',
            metricas: this.metricas,
            predicciones: this.predicciones,
            resumen: this.generarResumenSemanal()
        };
        
        this.guardarReporte(reporte);
        console.log('📊 Reporte semanal generado');
    }

    // Generar resumen diario
    generarResumenDiario() {
        return {
            ventas: this.metricas.ventas?.total || 0,
            usuarios: this.metricas.usuarios?.total || 0,
            ingresos: this.metricas.ventas?.ingresos || 0,
            tendencia: this.metricas.ventas?.tendencia || 'estable'
        };
    }

    // Generar resumen semanal
    generarResumenSemanal() {
        return {
            ventas: this.metricas.ventas?.total || 0,
            usuarios: this.metricas.usuarios?.total || 0,
            ingresos: this.metricas.ventas?.ingresos || 0,
            predicciones: this.predicciones,
            recomendaciones: this.generarRecomendaciones()
        };
    }

    // Generar recomendaciones
    generarRecomendaciones() {
        const recomendaciones = [];
        
        // Recomendaciones basadas en ventas
        if (this.metricas.ventas?.tendencia === 'decreciendo') {
            recomendaciones.push('Considera ofertas especiales para aumentar ventas');
        }
        
        // Recomendaciones basadas en usuarios
        if (this.metricas.usuarios?.retencion < 50) {
            recomendaciones.push('Mejora la retención de usuarios con mejores servicios');
        }
        
        // Recomendaciones basadas en productos
        if (this.metricas.productos?.menosVendidos?.length > 0) {
            recomendaciones.push('Revisa productos con pocas ventas');
        }
        
        return recomendaciones;
    }

    // Guardar reporte
    guardarReporte(reporte) {
        const reportes = JSON.parse(localStorage.getItem('reportesAnalytics') || '[]');
        reportes.push(reporte);
        
        // Mantener solo los últimos 30 reportes
        if (reportes.length > 30) {
            reportes.splice(0, reportes.length - 30);
        }
        
        localStorage.setItem('reportesAnalytics', JSON.stringify(reportes));
    }

    // Obtener dashboard completo
    obtenerDashboard() {
        return {
            metricas: this.metricas,
            predicciones: this.predicciones,
            tendencias: this.tendencias,
            reportes: JSON.parse(localStorage.getItem('reportesAnalytics') || '[]'),
            alertas: JSON.parse(localStorage.getItem('alertasAnalytics') || '[]'),
            ultimaActualizacion: new Date().toISOString()
        };
    }
}

// Inicializar sistema globalmente
window.sistemaAnalytics = new SistemaAnalyticsAvanzados();

// Funciones globales
window.obtenerDashboardAnalytics = function() {
    return window.sistemaAnalytics.obtenerDashboard();
};

window.mostrarDashboardAnalytics = function() {
    const dashboard = window.sistemaAnalytics.obtenerDashboard();
    
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
            <h3 style="color: #667eea; margin-bottom: 20px;">📊 Dashboard de Analytics</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4 style="margin: 0; color: #667eea; font-size: 2em;">${dashboard.metricas.ventas?.total || 0}</h4>
                    <p style="margin: 5px 0; color: #666;">Total Ventas</p>
                </div>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4 style="margin: 0; color: #667eea; font-size: 2em;">${dashboard.metricas.usuarios?.total || 0}</h4>
                    <p style="margin: 5px 0; color: #666;">Total Usuarios</p>
                </div>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4 style="margin: 0; color: #667eea; font-size: 2em;">$${dashboard.metricas.ventas?.ingresos || 0}</h4>
                    <p style="margin: 5px 0; color: #666;">Ingresos</p>
                </div>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4 style="margin: 0; color: #667eea; font-size: 2em;">${dashboard.metricas.usuarios?.retencion || 0}%</h4>
                    <p style="margin: 5px 0; color: #666;">Retención</p>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #374151; margin-bottom: 10px;">Predicciones</h4>
                <div style="background: #f0f9ff; padding: 15px; border-radius: 8px;">
                    <p style="margin: 0; color: #0369a1;">Próximas 7 días: ${dashboard.predicciones.ventas?.length || 0} ventas esperadas</p>
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

console.log('✅ Sistema de Analytics Avanzados cargado correctamente');










