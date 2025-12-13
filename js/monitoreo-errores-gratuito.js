// ===== SISTEMA DE MONITOREO DE ERRORES 100% GRATUITO =====
// Alternativa a Sentry - Guarda errores en localStorage y permite exportar

class MonitoreoErrores {
    constructor() {
        this.maxErrores = 1000; // Máximo de errores guardados
        this.errores = this.cargarErrores();
        this.configurarErrorHandling();
        console.log('✅ Sistema de monitoreo de errores activado (gratuito)');
    }
    
    cargarErrores() {
        try {
            const guardados = localStorage.getItem('errores_log');
            return guardados ? JSON.parse(guardados) : [];
        } catch (e) {
            return [];
        }
    }
    
    guardarErrores() {
        try {
            // Mantener solo los últimos N errores
            if (this.errores.length > this.maxErrores) {
                this.errores = this.errores.slice(-this.maxErrores);
            }
            localStorage.setItem('errores_log', JSON.stringify(this.errores));
        } catch (e) {
            console.error('Error guardando errores:', e);
        }
    }
    
    registrarError(error, contexto = {}) {
        const errorInfo = {
            id: Date.now() + Math.random(),
            mensaje: error.message || String(error),
            stack: error.stack || '',
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            contexto: contexto,
            tipo: error.name || 'Error'
        };
        
        this.errores.push(errorInfo);
        this.guardarErrores();
        
        // Mostrar en consola
        console.error('🚨 Error registrado:', errorInfo);
        
        // Si hay más de 50 errores, mostrar advertencia
        if (this.errores.length > 50) {
            console.warn('⚠️ Tienes muchos errores registrados. Considera revisarlos.');
        }
    }
    
    configurarErrorHandling() {
        // Capturar errores globales de JavaScript
        window.addEventListener('error', (event) => {
            this.registrarError(event.error || event.message, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });
        
        // Capturar promesas rechazadas
        window.addEventListener('unhandledrejection', (event) => {
            this.registrarError(event.reason, {
                tipo: 'Unhandled Promise Rejection'
            });
        });
        
        // Override console.error para capturar también
        const originalError = console.error;
        console.error = (...args) => {
            originalError.apply(console, args);
            // Solo registrar si parece un error real
            if (args[0] && typeof args[0] === 'object' && args[0].message) {
                this.registrarError(args[0], { fuente: 'console.error' });
            }
        };
    }
    
    // Obtener errores recientes
    obtenerErroresRecientes(limite = 50) {
        return this.errores.slice(-limite).reverse();
    }
    
    // Obtener errores por tipo
    obtenerErroresPorTipo(tipo) {
        return this.errores.filter(e => e.tipo === tipo);
    }
    
    // Contar errores por día
    contarErroresPorDia() {
        const porDia = {};
        this.errores.forEach(error => {
            const dia = error.timestamp.split('T')[0];
            porDia[dia] = (porDia[dia] || 0) + 1;
        });
        return porDia;
    }
    
    // Exportar errores como JSON
    exportarErrores() {
        const datos = {
            exportado: new Date().toISOString(),
            total: this.errores.length,
            errores: this.errores,
            resumen: {
                porTipo: {},
                porDia: this.contarErroresPorDia()
            }
        };
        
        // Contar por tipo
        this.errores.forEach(e => {
            datos.resumen.porTipo[e.tipo] = (datos.resumen.porTipo[e.tipo] || 0) + 1;
        });
        
        const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `errores-cresalia-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Errores exportados');
    }
    
    // Limpiar errores antiguos (más de 30 días)
    limpiarErroresAntiguos() {
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);
        
        this.errores = this.errores.filter(e => {
            return new Date(e.timestamp) > hace30Dias;
        });
        this.guardarErrores();
        console.log('✅ Errores antiguos limpiados');
    }
    
    // Limpiar todos los errores
    limpiarTodos() {
        this.errores = [];
        this.guardarErrores();
        console.log('✅ Todos los errores eliminados');
    }
}

// Inicializar globalmente
window.monitoreoErrores = new MonitoreoErrores();

// Función global para registrar errores manualmente
window.registrarError = (error, contexto) => {
    window.monitoreoErrores.registrarError(error, contexto);
};

// Exportar funciones útiles
window.verErrores = () => {
    return window.monitoreoErrores.obtenerErroresRecientes(50);
};

window.exportarErrores = () => {
    window.monitoreoErrores.exportarErrores();
};

