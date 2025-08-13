// Configuración de imágenes para FRIOCAS
// Actualiza estas rutas con tus imágenes reales

const CONFIG_IMAGENES = {
    // Logo de la empresa
    logo: "./assets/logo/logo-friocas.png",
    
    // Productos
    productos: {
        revividorInteriores: "./assets/productos/revividor-interiores.jpg",
        pastillasFreno: "./assets/productos/pastillas-freno.jpg",
        amortiguadores: "./assets/productos/amortiguadores.jpg",
        bateria: "./assets/productos/bateria.jpg",
        aceite: "./assets/productos/aceite.jpg",
        rotorFreno: "./assets/productos/rotor-freno.jpg",
        resortes: "./assets/productos/resortes.jpg",
        alternador: "./assets/productos/alternador.jpg"
    },
    
    // Ofertas
    ofertas: {
        filtroAceite: "./assets/ofertas/filtro-aceite.jpg",
        aceiteSintetico: "./assets/ofertas/aceite-sintetico.jpg",
        pastillasFreno: "./assets/ofertas/pastillas-freno.jpg",
        rotorFreno: "./assets/ofertas/rotor-freno.jpg"
    }
};

// Función para obtener imagen con fallback
function obtenerImagen(ruta, fallback = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop") {
    return ruta || fallback;
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG_IMAGENES, obtenerImagen };
} else {
    window.CONFIG_IMAGENES = CONFIG_IMAGENES;
    window.obtenerImagen = obtenerImagen;
}
