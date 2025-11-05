// ===== SCRIPT PARA AGREGAR PROTECCIÓN A PÁGINAS ADMIN =====
// Ejecutar con: node agregar-proteccion-admin.js

const fs = require('fs');
const path = require('path');

// Lista de páginas a proteger
const paginasAdmin = [
    'panel-master-cresalia.html',
    'panel-moderacion-chat-seguro.html',
    'panel-moderacion-foro-comunidades.html',
    'panel-gestion-alertas-global.html',
    'panel-auditoria.html',
    'admin-cresalia.html',
    'tiendas/ejemplo-tienda/admin-final.html'
];

// Script de protección a agregar
const scriptProteccion = `
    <script>
        // ===== PROTECCIÓN DE PÁGINA ADMIN =====
        (function() {
            // Configuración
            const ADMIN_PASSWORD = 'TU_CONTRASEÑA_ADMIN_AQUI'; // ⚠️ CAMBIAR ESTO
            const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos
            
            // Verificar autenticación
            const stored = sessionStorage.getItem('cresalia_admin_auth');
            const storedTime = sessionStorage.getItem('cresalia_admin_auth_time');
            const now = Date.now();
            
            // Verificar si la sesión expiró
            if (!stored || !storedTime || (now - parseInt(storedTime)) > SESSION_TIMEOUT) {
                // Pedir contraseña
                const password = prompt('🔒 Acceso Restringido\\n\\nIngresa la contraseña de administrador:');
                
                if (password !== ADMIN_PASSWORD) {
                    alert('❌ Acceso denegado. Redirigiendo...');
                    window.location.href = '/index-cresalia.html';
                    return;
                }
                
                // Guardar autenticación
                sessionStorage.setItem('cresalia_admin_auth', 'authenticated');
                sessionStorage.setItem('cresalia_admin_auth_time', now.toString());
            }
        })();
    </script>
`;

// Función para agregar protección a una página
function agregarProteccion(rutaArchivo) {
    try {
        const rutaCompleta = path.join(__dirname, rutaArchivo);
        
        // Verificar que el archivo existe
        if (!fs.existsSync(rutaCompleta)) {
            console.log(`⚠️  Archivo no encontrado: ${rutaArchivo}`);
            return false;
        }
        
        // Leer el archivo
        let contenido = fs.readFileSync(rutaCompleta, 'utf8');
        
        // Verificar si ya tiene protección
        if (contenido.includes('PROTECCIÓN DE PÁGINA ADMIN')) {
            console.log(`✅ Ya tiene protección: ${rutaArchivo}`);
            return true;
        }
        
        // Buscar el tag <body>
        const bodyIndex = contenido.indexOf('<body>');
        
        if (bodyIndex === -1) {
            console.log(`⚠️  No se encontró <body> en: ${rutaArchivo}`);
            return false;
        }
        
        // Insertar el script después de <body>
        const insertIndex = contenido.indexOf('>', bodyIndex) + 1;
        contenido = contenido.slice(0, insertIndex) + scriptProteccion + contenido.slice(insertIndex);
        
        // Guardar el archivo
        fs.writeFileSync(rutaCompleta, contenido, 'utf8');
        
        console.log(`✅ Protección agregada a: ${rutaArchivo}`);
        return true;
    } catch (error) {
        console.error(`❌ Error procesando ${rutaArchivo}:`, error.message);
        return false;
    }
}

// Procesar todas las páginas
console.log('🔒 Agregando protección a páginas admin...\n');

let exitosas = 0;
let fallidas = 0;

paginasAdmin.forEach(pagina => {
    if (agregarProteccion(pagina)) {
        exitosas++;
    } else {
        fallidas++;
    }
});

console.log(`\n📊 Resumen:`);
console.log(`✅ Exitosas: ${exitosas}`);
console.log(`❌ Fallidas: ${fallidas}`);
console.log(`\n⚠️  IMPORTANTE: Cambia 'TU_CONTRASEÑA_ADMIN_AQUI' en cada archivo por tu contraseña real.`);

