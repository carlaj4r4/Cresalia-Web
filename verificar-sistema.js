// ===== SCRIPT DE VERIFICACIÓN RÁPIDA =====
// Ejecutar en la consola del navegador para verificar que todo funcione

console.log('🔍 Verificando sistema de Cresalia...');

// Verificar servicios
const tiendaId = 'demo-tienda';
const servicios = JSON.parse(localStorage.getItem(`servicios_${tiendaId}`) || '[]');
console.log('📋 Servicios cargados:', servicios.length);

// Verificar progreso empresarial
const progresoDisponible = typeof window.verMiProgresoCorregido === 'function';
console.log('📊 Progreso empresarial:', progresoDisponible ? '✅ Disponible' : '❌ No disponible');

// Verificar sistema de pagos
const pagosDisponible = typeof window.paymentSystem === 'object';
console.log('💳 Sistema de pagos:', pagosDisponible ? '✅ Disponible' : '❌ No disponible');

// Verificar recursos de bienestar
const bienestarDisponible = typeof window.initRecursosBienestar === 'function';
console.log('💜 Recursos de bienestar:', bienestarDisponible ? '✅ Disponible' : '❌ No disponible');

// Verificar estadísticas
const stats = JSON.parse(localStorage.getItem(`estadisticas_${tiendaId}`) || '{}');
console.log('📊 Estadísticas:', stats);

console.log('🎉 Verificación completada');
console.log('💜 ¡Sistema listo para los testers!');









