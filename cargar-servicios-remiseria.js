// ===== SCRIPT RÁPIDO PARA CARGAR SERVICIOS DE REMISERÍA =====
// Ejecutar en la consola del navegador para cargar servicios inmediatamente

console.log('🚗 Cargando servicios de remisería...');

const serviciosRemiseria = [
    {
        id: 'remis_1',
        nombre: 'Servicio de Remisería Estándar',
        descripcion: 'Servicio de remisería profesional con chofer experimentado. Vehículos cómodos y seguros para todos tus viajes.',
        precio: 150.00,
        duracion: 'Viaje completo',
        categoria: 'transporte',
        fechaCreacion: new Date().toISOString(),
        disponible: true,
        contacto: 'WhatsApp: +54 9 11 1234-5678',
        horarios: '24/7 - Disponible siempre'
    },
    {
        id: 'remis_2', 
        nombre: 'Remisería Ejecutiva Premium',
        descripcion: 'Servicio premium con vehículos de alta gama. Ideal para ejecutivos, eventos especiales y ocasiones importantes.',
        precio: 250.00,
        duracion: 'Viaje completo',
        categoria: 'transporte',
        fechaCreacion: new Date().toISOString(),
        disponible: true,
        contacto: 'WhatsApp: +54 9 11 1234-5678',
        horarios: 'Lunes a Viernes 6:00-22:00'
    },
    {
        id: 'remis_3',
        nombre: 'Remisería Nocturna',
        descripcion: 'Servicio especializado nocturno con máxima seguridad. Disponible cuando más lo necesites.',
        precio: 200.00,
        duracion: 'Viaje completo',
        categoria: 'transporte',
        fechaCreacion: new Date().toISOString(),
        disponible: true,
        contacto: 'WhatsApp: +54 9 11 1234-5678',
        horarios: '22:00-06:00'
    }
];

// Cargar servicios
const tiendaId = 'demo-tienda';
localStorage.setItem(`servicios_${tiendaId}`, JSON.stringify(serviciosRemiseria));

console.log('✅ Servicios de remisería cargados:', serviciosRemiseria.length);

// Actualizar estadísticas
if (window.actualizarEstadisticas) {
    window.actualizarEstadisticas();
}

// Mostrar notificación
if (window.mostrarNotificacion) {
    window.mostrarNotificacion('🚗 Servicios de remisería cargados correctamente', 'success');
} else {
    alert('✅ Servicios de remisería cargados correctamente');
}

console.log('💜 ¡Listo para los testers! Los servicios de remisería están cargados.');









