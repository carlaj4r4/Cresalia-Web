// ===== SISTEMA DE IA AVANZADA CRESALIA =====
// Sistema inteligente con predicciones, recomendaciones y análisis de sentimientos


class SistemaIAAvanzada {
    constructor() {
        this.modelos = {};
        this.predicciones = {};
        this.recomendaciones = {};
        this.analisisSentimientos = {};
        this.inicializar();
    }

    // Inicializar sistema de IA
    inicializar() {
        console.log('🤖 Inicializando Sistema de IA Avanzada...');
        
        // Configurar modelos de predicción
        this.configurarModelosPrediccion();
        
        // Configurar sistema de recomendaciones
        this.configurarSistemaRecomendaciones();
        
        // Configurar análisis de sentimientos
        this.configurarAnalisisSentimientos();
        
        // Configurar chatbot inteligente
        this.configurarChatbotInteligente();
        
        // Configurar optimización automática
        this.configurarOptimizacionAutomatica();
        
        console.log('✅ Sistema de IA Avanzada inicializado');
    }

    // Configurar modelos de predicción
    configurarModelosPrediccion() {
        // Modelo de predicción de demanda
        this.modelos.demanda = new ModeloPrediccionDemanda();
        
        // Modelo de predicción de precios
        this.modelos.precios = new ModeloPrediccionPrecios();
        
        // Modelo de predicción de tendencias
        this.modelos.tendencias = new ModeloPrediccionTendencias();
    }

    // Configurar sistema de recomendaciones
    configurarSistemaRecomendaciones() {
        this.sistemaRecomendaciones = new SistemaRecomendaciones();
    }

    // Configurar análisis de sentimientos
    configurarAnalisisSentimientos() {
        this.analizadorSentimientos = new AnalizadorSentimientos();
    }

    // Configurar chatbot inteligente
    configurarChatbotInteligente() {
        console.log('🤖 Chatbot configurado');
    }

    // Configurar optimización automática  
    configurarOptimizacionAutomatica() {
        console.log('⚙️ Optimización automática configurada');
    }
}

// Modelo de predicción de demanda
class ModeloPrediccionDemanda {
    constructor() {
        this.historialVentas = [];
        this.factoresEstacionales = {};
        this.patronesComportamiento = {};
    }

        // Predecir demanda para un producto
        predecirDemanda(producto, fecha) {
            const historial = this.obtenerHistorialProducto(producto);
            const factores = this.calcularFactoresDemanda(historial, fecha);
            
            return {
                demandaEsperada: this.calcularDemandaEsperada(factores),
                confianza: this.calcularConfianzaDemanda(historial),
                factores: factores,
                recomendaciones: this.generarRecomendacionesDemanda(factores)
            };
        }

        // Obtener historial del producto
        obtenerHistorialProducto(producto) {
            const ventas = JSON.parse(localStorage.getItem('ventasConfirmadas') || '[]');
            return ventas.filter(v => v.producto === producto.nombre);
        }

        // Calcular factores de demanda
        calcularFactoresDemanda(historial, fecha) {
            const factores = {
                estacionalidad: this.calcularEstacionalidad(historial, fecha),
                tendencia: this.calcularTendencia(historial),
                competencia: this.calcularCompetencia(historial),
                precio: this.calcularFactorPrecio(historial),
                promociones: this.calcularFactorPromociones(historial)
            };
            
            return factores;
        }

        // Calcular estacionalidad
        calcularEstacionalidad(historial, fecha) {
            const mes = new Date(fecha).getMonth();
            const ventasPorMes = this.agruparVentasPorMes(historial);
            
            const ventasMesActual = ventasPorMes[mes] || 0;
            const promedioGeneral = this.calcularPromedioGeneral(ventasPorMes);
            
            return ventasMesActual / Math.max(promedioGeneral, 1);
        }

        // Calcular tendencia
        calcularTendencia(historial) {
            if (historial.length < 2) return 0;
            
            const ventasRecientes = historial.slice(-7); // Últimos 7 días
            const ventasAnteriores = historial.slice(-14, -7); // 7 días anteriores
            
            const promedioReciente = this.calcularPromedio(ventasRecientes);
            const promedioAnterior = this.calcularPromedio(ventasAnteriores);
            
            return (promedioReciente - promedioAnterior) / Math.max(promedioAnterior, 1);
        }

        // Calcular competencia
        calcularCompetencia(historial) {
            // Análisis básico de competencia basado en precios
            const precios = historial.map(v => v.precio).filter(p => p > 0);
            const precioPromedio = this.calcularPromedio(precios);
            
            // Simular análisis de competencia
            return Math.random() * 0.5 + 0.5; // Factor entre 0.5 y 1.0
        }

        // Calcular factor de precio
        calcularFactorPrecio(historial) {
            const precios = historial.map(v => v.precio).filter(p => p > 0);
            if (precios.length === 0) return 1;
            
            const precioPromedio = this.calcularPromedio(precios);
            const elasticidad = this.calcularElasticidadPrecio(historial);
            
            return Math.max(0.5, 1 - (elasticidad * 0.1));
        }

        // Calcular factor de promociones
        calcularFactorPromociones(historial) {
            const promociones = historial.filter(v => v.promocion);
            return promociones.length > 0 ? 1.2 : 1.0;
        }

        // Calcular demanda esperada
        calcularDemandaEsperada(factores) {
            const base = 10; // Demanda base
            const multiplicador = Object.values(factores).reduce((acc, factor) => acc * factor, 1);
            
            return Math.round(base * multiplicador);
        }

        // Calcular confianza de demanda
        calcularConfianzaDemanda(historial) {
            if (historial.length < 7) return 'Baja';
            if (historial.length < 30) return 'Media';
            return 'Alta';
        }

        // Generar recomendaciones de demanda
        generarRecomendacionesDemanda(factores) {
            const recomendaciones = [];
            
            if (factores.estacionalidad > 1.2) {
                recomendaciones.push('Aumentar stock para temporada alta');
            }
            
            if (factores.tendencia > 0.1) {
                recomendaciones.push('Producto en crecimiento, considerar expansión');
            }
            
            if (factores.precio < 0.8) {
                recomendaciones.push('Revisar estrategia de precios');
            }
            
            return recomendaciones;
        }

        // Métodos auxiliares
        agruparVentasPorMes(historial) {
            const ventasPorMes = {};
            historial.forEach(venta => {
                const mes = new Date(venta.fecha).getMonth();
                ventasPorMes[mes] = (ventasPorMes[mes] || 0) + 1;
            });
            return ventasPorMes;
        }

        calcularPromedioGeneral(ventasPorMes) {
            const valores = Object.values(ventasPorMes);
            return valores.reduce((sum, val) => sum + val, 0) / valores.length;
        }

        calcularPromedio(datos) {
            return datos.reduce((sum, val) => sum + val, 0) / datos.length;
        }

        calcularElasticidadPrecio(historial) {
            // Cálculo simplificado de elasticidad
            return 0.5; // Elasticidad media
        }
    }

    // Modelo de predicción de precios
    class ModeloPrediccionPrecios {
        constructor() {
            this.historialPrecios = [];
            this.factoresPrecio = {};
        }

        // Predecir precio óptimo
        predecirPrecioOptimo(producto, demanda) {
            const factores = this.calcularFactoresPrecio(producto, demanda);
            
            return {
                precioOptimo: this.calcularPrecioOptimo(factores),
                rangoPrecio: this.calcularRangoPrecio(factores),
                recomendaciones: this.generarRecomendacionesPrecio(factores)
            };
        }

        // Calcular factores de precio
        calcularFactoresPrecio(producto, demanda) {
            return {
                costo: producto.costo || 0,
                competencia: this.analizarCompetencia(producto),
                demanda: demanda,
                estacionalidad: this.calcularEstacionalidadPrecio(producto),
                margen: this.calcularMargenOptimo(producto)
            };
        }

        // Analizar competencia
        analizarCompetencia(producto) {
            // Simulación de análisis de competencia
            return {
                precioPromedio: producto.precio * (0.8 + Math.random() * 0.4),
                posicionamiento: 'medio'
            };
        }

        // Calcular estacionalidad de precio
        calcularEstacionalidadPrecio(producto) {
            const mes = new Date().getMonth();
            const factoresEstacionales = {
                0: 1.1, 1: 1.2, 2: 1.0, 3: 0.9, 4: 0.8, 5: 0.7,
                6: 0.8, 7: 0.9, 8: 1.0, 9: 1.1, 10: 1.2, 11: 1.3
            };
            
            return factoresEstacionales[mes] || 1.0;
        }

        // Calcular margen óptimo
        calcularMargenOptimo(producto) {
            const margenBase = 0.3; // 30% de margen base
            const factorDemanda = demanda > 50 ? 1.2 : 0.8;
            return margenBase * factorDemanda;
        }

        // Calcular precio óptimo
        calcularPrecioOptimo(factores) {
            const costo = factores.costo;
            const margen = factores.margen;
            const estacionalidad = factores.estacionalidad;
            
            return Math.round(costo * (1 + margen) * estacionalidad);
        }

        // Calcular rango de precio
        calcularRangoPrecio(factores) {
            const precioOptimo = this.calcularPrecioOptimo(factores);
            return {
                minimo: Math.round(precioOptimo * 0.8),
                maximo: Math.round(precioOptimo * 1.2),
                recomendado: precioOptimo
            };
        }

        // Generar recomendaciones de precio
        generarRecomendacionesPrecio(factores) {
            const recomendaciones = [];
            
            if (factores.demanda > 100) {
                recomendaciones.push('Alta demanda, considera aumentar precio');
            }
            
            if (factores.estacionalidad > 1.2) {
                recomendaciones.push('Temporada alta, precio puede ser más alto');
            }
            
            if (factores.competencia.precioPromedio < factores.costo * 1.5) {
                recomendaciones.push('Competencia agresiva, revisar estrategia');
            }
            
            return recomendaciones;
        }
    }

    // Modelo de predicción de tendencias
    class ModeloPrediccionTendencias {
        constructor() {
            this.tendencias = {};
            this.patrones = {};
        }

        // Predecir tendencias
        predecirTendencias() {
            const tendencias = {
                productos: this.analizarTendenciasProductos(),
                servicios: this.analizarTendenciasServicios(),
                mercado: this.analizarTendenciasMercado(),
                tecnologia: this.analizarTendenciasTecnologia()
            };
            
            return tendencias;
        }

        // Analizar tendencias de productos
        analizarTendenciasProductos() {
            const productos = JSON.parse(localStorage.getItem('productosTienda') || '[]');
            const ventas = JSON.parse(localStorage.getItem('ventasConfirmadas') || '[]');
            
            return productos
                .filter(p => p.ventas > 0)
                .sort((a, b) => b.ventas - a.ventas)
                .slice(0, 5)
                .map(p => ({
                    nombre: p.nombre,
                    tendencia: 'creciente',
                    confianza: 'alta',
                    recomendacion: 'Mantener en catálogo'
                }));
        }

        // Analizar tendencias de servicios
        analizarTendenciasServicios() {
            const servicios = JSON.parse(localStorage.getItem('serviciosTienda') || '[]');
            
            return servicios
                .filter(s => s.reservas > 0)
                .sort((a, b) => b.reservas - a.reservas)
                .slice(0, 5)
                .map(s => ({
                    nombre: s.nombre,
                    tendencia: 'creciente',
                    confianza: 'alta',
                    recomendacion: 'Expandir oferta'
                }));
        }

        // Analizar tendencias de mercado
        analizarTendenciasMercado() {
            return {
                digitalizacion: 'creciente',
                sostenibilidad: 'creciente',
                personalizacion: 'creciente',
                recomendaciones: [
                    'Invertir en presencia digital',
                    'Considerar productos sostenibles',
                    'Personalizar experiencias'
                ]
            };
        }

        // Analizar tendencias de tecnología
        analizarTendenciasTecnologia() {
            return {
                ia: 'creciente',
                automatizacion: 'creciente',
                movil: 'creciente',
                recomendaciones: [
                    'Implementar más IA',
                    'Automatizar procesos',
                    'Optimizar para móviles'
                ]
            };
        }

    // Configurar sistema de recomendaciones
    configurarSistemaRecomendaciones() {
        this.sistemaRecomendaciones = new SistemaRecomendaciones();
    }

}

// Sistema de recomendaciones
class SistemaRecomendaciones {
    constructor() {
        this.perfilUsuario = {};
        this.historialComportamiento = {};
        this.recomendaciones = {};
    }

    // Generar recomendaciones personalizadas
    generarRecomendacionesPersonalizadas(usuario) {
        const perfil = this.analizarPerfilUsuario(usuario);
        const comportamiento = this.analizarComportamiento(usuario);
        
        return {
            productos: this.recomendarProductos(perfil, comportamiento),
            servicios: this.recomendarServicios(perfil, comportamiento),
            estrategias: this.recomendarEstrategias(perfil, comportamiento),
            oportunidades: this.identificarOportunidades(perfil, comportamiento)
        };
        }

    // Analizar perfil de usuario
    analizarPerfilUsuario(usuario) {
        const ventas = JSON.parse(localStorage.getItem('ventasConfirmadas') || '[]');
        const productos = JSON.parse(localStorage.getItem('productosTienda') || '[]');
        
        return {
            tipo: this.determinarTipoUsuario(ventas),
            preferencias: this.identificarPreferencias(productos),
            comportamiento: this.analizarComportamientoCompra(ventas),
            segmento: this.determinarSegmento(ventas)
        };
    }

    // Determinar tipo de usuario
    determinarTipoUsuario(ventas) {
        if (ventas.length === 0) return 'nuevo';
        if (ventas.length < 5) return 'ocasional';
        if (ventas.length < 20) return 'regular';
        return 'frecuente';
    }

    // Identificar preferencias
    identificarPreferencias(productos) {
        const categorias = {};
        productos.forEach(p => {
            const categoria = p.categoria || 'Sin categoría';
            categorias[categoria] = (categorias[categoria] || 0) + 1;
        });
        
        return Object.entries(categorias)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([categoria]) => categoria);
    }

    // Analizar comportamiento de compra
    analizarComportamientoCompra(ventas) {
        const montos = ventas.map(v => v.monto || 0);
        const fechas = ventas.map(v => new Date(v.fecha));
        
        return {
            gastoPromedio: this.calcularPromedio(montos),
            frecuencia: this.calcularFrecuencia(fechas),
            estacionalidad: this.calcularEstacionalidadCompra(fechas),
            horarios: this.calcularHorariosCompra(fechas)
        };
    }

    // Determinar segmento
    determinarSegmento(ventas) {
        const gastoTotal = ventas.reduce((sum, v) => sum + (v.monto || 0), 0);
        
        if (gastoTotal > 10000) return 'premium';
        if (gastoTotal > 5000) return 'medio';
        return 'básico';
    }

    // Recomendar productos
    recomendarProductos(perfil, comportamiento) {
        const productos = JSON.parse(localStorage.getItem('productosTienda') || '[]');
        
        return productos
            .filter(p => this.esRelevante(p, perfil, comportamiento))
            .sort((a, b) => this.calcularRelevancia(b, perfil, comportamiento) - this.calcularRelevancia(a, perfil, comportamiento))
            .slice(0, 5);
    }

    // Recomendar servicios
    recomendarServicios(perfil, comportamiento) {
        const servicios = JSON.parse(localStorage.getItem('serviciosTienda') || '[]');
        
        return servicios
            .filter(s => this.esRelevante(s, perfil, comportamiento))
            .sort((a, b) => this.calcularRelevancia(b, perfil, comportamiento) - this.calcularRelevancia(a, perfil, comportamiento))
            .slice(0, 5);
    }

    // Recomendar estrategias
    recomendarEstrategias(perfil, comportamiento) {
        const estrategias = [];
        
        if (perfil.tipo === 'nuevo') {
            estrategias.push('Implementar programa de bienvenida');
            estrategias.push('Ofrecer descuentos especiales');
        }
        
        if (perfil.segmento === 'premium') {
            estrategias.push('Servicio personalizado');
            estrategias.push('Productos exclusivos');
        }
        
        if (comportamiento.frecuencia < 0.5) {
            estrategias.push('Programa de fidelización');
            estrategias.push('Recordatorios automáticos');
        }
        
        return estrategias;
    }

    // Identificar oportunidades
    identificarOportunidades(perfil, comportamiento) {
        const oportunidades = [];
        
        if (perfil.preferencias.length < 3) {
            oportunidades.push('Expandir catálogo de productos');
        }
        
        if (comportamiento.gastoPromedio < 1000) {
            oportunidades.push('Upselling de productos premium');
        }
        
        if (comportamiento.frecuencia < 1) {
            oportunidades.push('Programa de recompensas');
        }
        
        return oportunidades;
    }

    // Verificar si es relevante
    esRelevante(item, perfil, comportamiento) {
        const categoria = item.categoria || 'Sin categoría';
        return perfil.preferencias.includes(categoria) || 
               item.precio <= comportamiento.gastoPromedio * 1.5;
    }

    // Calcular relevancia
    calcularRelevancia(item, perfil, comportamiento) {
        let relevancia = 0;
        
        // Relevancia por categoría
        if (perfil.preferencias.includes(item.categoria)) {
            relevancia += 10;
        }
        
        // Relevancia por precio
        if (item.precio <= comportamiento.gastoPromedio) {
            relevancia += 5;
        }
        
        // Relevancia por popularidad
        if (item.ventas > 0) {
            relevancia += item.ventas;
        }
        
        return relevancia;
    }

    // Métodos auxiliares
    calcularPromedio(datos) {
        return datos.reduce((sum, val) => sum + val, 0) / datos.length;
    }

    calcularFrecuencia(fechas) {
        if (fechas.length < 2) return 0;
        
        const primeraFecha = new Date(Math.min(...fechas));
        const ultimaFecha = new Date(Math.max(...fechas));
        const diasTranscurridos = (ultimaFecha - primeraFecha) / (1000 * 60 * 60 * 24);
        
        return fechas.length / Math.max(diasTranscurridos, 1);
    }

    calcularEstacionalidadCompra(fechas) {
        const meses = fechas.map(f => new Date(f).getMonth());
        const mesesUnicos = [...new Set(meses)];
        return mesesUnicos.length;
    }

    calcularHorariosCompra(fechas) {
        const horarios = fechas.map(f => new Date(f).getHours());
        const horarioPromedio = this.calcularPromedio(horarios);
        
        if (horarioPromedio < 12) return 'mañana';
        if (horarioPromedio < 18) return 'tarde';
        return 'noche';
    }

    // Configurar análisis de sentimientos
    configurarAnalisisSentimientos() {
        this.analizadorSentimientos = new AnalizadorSentimientos();
    }
}

// Analizador de sentimientos
class AnalizadorSentimientos {
    constructor() {
        this.palabrasPositivas = ['bueno', 'excelente', 'genial', 'fantástico', 'perfecto', 'amazing', 'great', 'wonderful'];
        this.palabrasNegativas = ['malo', 'terrible', 'horrible', 'pésimo', 'awful', 'bad', 'terrible', 'horrible'];
        this.palabrasNeutras = ['normal', 'regular', 'ok', 'fine', 'average'];
    }

    // Analizar sentimiento de texto
    analizarSentimiento(texto) {
        const palabras = texto.toLowerCase().split(/\s+/);
        
        let puntuacion = 0;
        let palabrasPositivas = 0;
        let palabrasNegativas = 0;
        let palabrasNeutras = 0;
        
        palabras.forEach(palabra => {
            if (this.palabrasPositivas.includes(palabra)) {
                puntuacion += 1;
                palabrasPositivas++;
            } else if (this.palabrasNegativas.includes(palabra)) {
                puntuacion -= 1;
                palabrasNegativas++;
            } else if (this.palabrasNeutras.includes(palabra)) {
                palabrasNeutras++;
            }
        });
        
        return {
            puntuacion: puntuacion,
            sentimiento: this.determinarSentimiento(puntuacion),
            confianza: this.calcularConfianza(palabrasPositivas, palabrasNegativas, palabrasNeutras),
            palabras: {
                positivas: palabrasPositivas,
                negativas: palabrasNegativas,
                neutras: palabrasNeutras
            }
        };
    }

    // Determinar sentimiento
    determinarSentimiento(puntuacion) {
        if (puntuacion > 0) return 'positivo';
        if (puntuacion < 0) return 'negativo';
        return 'neutral';
    }

    // Calcular confianza
    calcularConfianza(positivas, negativas, neutras) {
        const total = positivas + negativas + neutras;
        if (total === 0) return 0;
        
        const diferencia = Math.abs(positivas - negativas);
        return diferencia / total;
    }

    // Analizar sentimientos de comentarios
    analizarComentarios(comentarios) {
        const analisis = comentarios.map(comentario => ({
            ...comentario,
            sentimiento: this.analizarSentimiento(comentario.texto)
        }));
        
        return {
            comentarios: analisis,
            resumen: this.generarResumenSentimientos(analisis)
        };
    }

    // Generar resumen de sentimientos
    generarResumenSentimientos(analisis) {
        const total = analisis.length;
        const positivos = analisis.filter(a => a.sentimiento.sentimiento === 'positivo').length;
        const negativos = analisis.filter(a => a.sentimiento.sentimiento === 'negativo').length;
        const neutros = analisis.filter(a => a.sentimiento.sentimiento === 'neutral').length;
        
        return {
            total: total,
            positivos: positivos,
            negativos: negativos,
            neutros: neutros,
            porcentajePositivo: (positivos / total) * 100,
            porcentajeNegativo: (negativos / total) * 100,
            sentimientoGeneral: this.determinarSentimientoGeneral(positivos, negativos, neutros)
        };
    }

    // Determinar sentimiento general
    determinarSentimientoGeneral(positivos, negativos, neutros) {
        if (positivos > negativos && positivos > neutros) return 'positivo';
        if (negativos > positivos && negativos > neutros) return 'negativo';
        return 'neutral';
    }
}

// Inicializar sistema globalmente
window.sistemaIA = new SistemaIAAvanzada();

// Funciones globales
window.obtenerInsightsIA = function() {
    return window.sistemaIA.obtenerInsights();
};

window.mostrarDashboardIA = function() {
    const insights = window.sistemaIA.obtenerInsights();
    
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
            <h3 style="color: #667eea; margin-bottom: 20px;">🤖 Dashboard de IA Avanzada</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                    <h4 style="color: #374151; margin-bottom: 15px;">Predicciones</h4>
                    <p style="color: #666; margin: 5px 0;">Demanda: ${insights.predicciones.demanda || 'N/A'}</p>
                    <p style="color: #666; margin: 5px 0;">Precios: ${insights.predicciones.precios || 'N/A'}</p>
                    <p style="color: #666; margin: 5px 0;">Tendencias: ${insights.predicciones.tendencias || 'N/A'}</p>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                    <h4 style="color: #374151; margin-bottom: 15px;">Recomendaciones</h4>
                    <p style="color: #666; margin: 5px 0;">Productos: ${insights.recomendaciones.productos || 'N/A'}</p>
                    <p style="color: #666; margin: 5px 0;">Servicios: ${insights.recomendaciones.servicios || 'N/A'}</p>
                    <p style="color: #666; margin: 5px 0;">Estrategias: ${insights.recomendaciones.estrategias || 'N/A'}</p>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                    <h4 style="color: #374151; margin-bottom: 15px;">Optimizaciones</h4>
                    <p style="color: #666; margin: 5px 0;">Total: ${insights.optimizaciones.totalOptimizaciones || 0}</p>
                    <p style="color: #666; margin: 5px 0;">Productos: ${insights.optimizaciones.productos?.length || 0}</p>
                    <p style="color: #666; margin: 5px 0;">Recomendaciones: ${insights.optimizaciones.recomendaciones ? 'Disponibles' : 'N/A'}</p>
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

console.log('✅ Sistema de IA Avanzada cargado correctamente');
