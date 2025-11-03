// ===== LIMPIEZA DE DATOS CRESALIA =====
// Script para limpiar completamente los datos del sistema

console.log('🧹 Iniciando limpieza de datos CRESALIA...');

// Limpiar localStorage
console.log('🗑️ Limpiando localStorage...');
localStorage.removeItem('cresaliaData');
localStorage.removeItem('cresaliaConfig');
localStorage.removeItem('cresaliaSession');
localStorage.removeItem('cresaliaCart');

// Limpiar sessionStorage
console.log('🗑️ Limpiando sessionStorage...');
sessionStorage.removeItem('cresaliaData');
sessionStorage.removeItem('cresaliaConfig');
sessionStorage.removeItem('cresaliaSession');
sessionStorage.removeItem('cresaliaCart');

// Limpiar datos específicos de Cresalia
console.log('🔄 Configurando datos de Cresalia...');
localStorage.setItem('cresalia-config', JSON.stringify({
    tiendaNombre: 'Cresalia Demo Store',
    tiendaDescripcion: 'Tienda demo de Cresalia - Sistema SaaS completo',
    tiendaEmail: 'carla.crimi.95@gmail.com',
    planActual: 'pro',
    idioma: 'es',
    zonaHoraria: 'America/Argentina/Buenos_Aires',
    sistemaPagos: 'simple',
    ultimaActualizacion: new Date().toISOString()
}));

// Limpiar datos de productos (reemplazar con datos de Cresalia)
console.log('📦 Configurando productos de Cresalia...');
localStorage.setItem('cresalia-productos', JSON.stringify([
    {
        id: 1,
        nombre: 'Producto Demo Cresalia',
        descripcion: 'Producto de demostración del sistema Cresalia',
        precio: 99.99,
        stock: 10,
        categoria: 'Demo',
        activo: 1,
        imagen: 'assets/placeholder-product.png'
    }
]));

// Limpiar datos de servicios
console.log('🔧 Configurando servicios de Cresalia...');
localStorage.setItem('cresalia-servicios', JSON.stringify([
    {
        id: 1,
        nombre: 'Consultoría Cresalia',
        descripcion: 'Servicio de consultoría para emprendedores',
        precio: 150,
        duracion: '1 hora',
        activo: 1
    }
]));

// Limpiar datos de ofertas
console.log('🏷️ Configurando ofertas de Cresalia...');
localStorage.setItem('cresalia-ofertas', JSON.stringify([]));

// Limpiar datos de categorías
console.log('📂 Configurando categorías de Cresalia...');
localStorage.setItem('cresalia-categorias', JSON.stringify([
    { id: 1, nombre: 'General' },
    { id: 2, nombre: 'Demo' },
    { id: 3, nombre: 'Servicios' }
]));

// Configurar sistema de pagos simple
console.log('💳 Configurando sistema de pagos...');
localStorage.setItem('cresalia-pagos', JSON.stringify({
    tipo: 'simple',
    cresaliaEmail: 'carla.crimi.95@gmail.com',
    cresaliaAlias: 'cresalia.07.mp',
    configurado: true,
    ultimaConfiguracion: new Date().toISOString()
}));

// Limpiar cookies relacionadas con FRIOCAS
console.log('🍪 Limpiando cookies...');
const cookies = document.cookie.split(';');
cookies.forEach(cookie => {
    const name = cookie.split('=')[0].trim();
    if (name.toLowerCase().includes('friocas')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
});

// Limpiar referencias en el DOM
console.log('🔍 Limpiando referencias en el DOM...');
const elements = document.querySelectorAll('*');
elements.forEach(element => {
    // Limpiar atributos que contengan FRIOCAS
    Array.from(element.attributes).forEach(attr => {
        if (attr.value && attr.value.toLowerCase().includes('friocas')) {
            element.removeAttribute(attr.name);
        }
    });
    
    // Limpiar texto que contenga FRIOCAS
    if (element.textContent && element.textContent.includes('FRIOCAS')) {
        element.textContent = element.textContent.replace(/FRIOCAS/gi, 'Cresalia');
    }
});

// Configurar notificaciones
console.log('🔔 Configurando notificaciones...');
if (window.elegantNotifications) {
    window.elegantNotifications.show('✅ Datos de FRIOCAS limpiados correctamente', 'success');
}

// Recargar página después de 2 segundos
setTimeout(() => {
    console.log('🔄 Recargando página...');
    window.location.reload();
}, 2000);

console.log('✅ Limpieza completada. Recargando página en 2 segundos...');



