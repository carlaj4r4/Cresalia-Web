// ===== ARCHIVO DE EJEMPLO - CONFIGURACIÓN PRIVADA =====
// Copia este archivo como "config-privado.js" y configura tus credenciales
// IMPORTANTE: config-privado.js está en .gitignore y NO se subirá al repositorio

const CONFIG_PRIVADO = {
    // Contraseñas de administración
    adminCresalia: 'TU_CONTRASEÑA_PERSONAL_AQUI',
    
    // Configuraciones sensibles
    secretKey: 'tu-clave-secreta-personalizada',
    
    // Tokens y API keys (si las hay)
    // apiKey: 'tu-api-key-aqui',
    
    // Base de datos (si fuera necesaria)
    // dbPassword: 'password-de-base-de-datos'
};

// Exportar solo si estamos en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG_PRIVADO;
}

// Hacer disponible globalmente en el navegador
if (typeof window !== 'undefined') {
    window.CONFIG_PRIVADO = CONFIG_PRIVADO;
}






















