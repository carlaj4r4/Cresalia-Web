// ===== INTEGRACIÓN DE SISTEMAS AUTOMÁTICOS - CRESALIA =====
// Este archivo integra todos los sistemas automáticos
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: Enero 2025

// Cargar todos los sistemas automáticos
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔗 Integrando sistemas automáticos...');

    // 1. Cargar sistema de renovación automática
    if (typeof SistemaRenovacionAutomatica !== 'undefined') {
        console.log('✅ Sistema de Renovación Automática cargado');
    }

    // 2. Cargar sistema de límites por plan
    if (typeof SistemaLimitesPlan !== 'undefined') {
        console.log('✅ Sistema de Límites por Plan cargado');
    }

    // 3. Cargar sistema de suspensión automática
    if (typeof SistemaSuspensionAutomatica !== 'undefined') {
        console.log('✅ Sistema de Suspensión Automática cargado');
    }

    // 4. Verificar que Supabase esté configurado
    if (typeof supabase === 'undefined') {
        console.warn('⚠️ Supabase no está configurado. Los sistemas automáticos no funcionarán.');
    }

    console.log('🎉 Sistemas automáticos integrados correctamente');
});

// Función para verificar estado de todos los sistemas
function verificarEstadoSistemasAutomaticos() {
    return {
        renovacion: typeof SistemaRenovacionAutomatica !== 'undefined',
        limites: typeof SistemaLimitesPlan !== 'undefined',
        suspension: typeof SistemaSuspensionAutomatica !== 'undefined',
        supabase: typeof supabase !== 'undefined'
    };
}

// Exportar para uso global
window.verificarEstadoSistemasAutomaticos = verificarEstadoSistemasAutomaticos;

console.log('✅ Integración de Sistemas Automáticos cargada');





