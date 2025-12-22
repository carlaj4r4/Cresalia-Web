// Script para agregar animación festiva a todas las comunidades
const fs = require('fs');
const path = require('path');

const comunidadesDir = path.join(__dirname, '..', 'comunidades');
const archivos = [];

// Buscar todos los index.html en las comunidades
function buscarArchivos(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            buscarArchivos(fullPath);
        } else if (item === 'index.html') {
            archivos.push(fullPath);
        }
    }
}

buscarArchivos(comunidadesDir);

console.log(`Encontrados ${archivos.length} archivos index.html`);

let modificados = 0;

for (const archivo of archivos) {
    try {
        let contenido = fs.readFileSync(archivo, 'utf8');
        let modificado = false;
        
        // Agregar CSS si no existe
        if (!contenido.includes('animacion-fiestas.css')) {
            // Buscar la línea de Font Awesome y agregar después
            const regexCSS = /(<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/[^"]+">)/;
            if (regexCSS.test(contenido)) {
                contenido = contenido.replace(regexCSS, `$1\n    <link rel="stylesheet" href="../../css/animacion-fiestas.css">`);
                modificado = true;
            }
        }
        
        // Agregar JS si no existe
        if (!contenido.includes('animacion-fiestas.js')) {
            // Buscar antes del </body>
            const regexJS = /(\s*)(<\/body>)/;
            if (regexJS.test(contenido)) {
                contenido = contenido.replace(regexJS, `$1    <!-- Animación Festiva de Fin de Año -->\n$1    <script src="../../js/animacion-fiestas.js"></script>\n$1$2`);
                modificado = true;
            }
        }
        
        if (modificado) {
            fs.writeFileSync(archivo, contenido, 'utf8');
            modificados++;
            console.log(`✓ Modificado: ${path.relative(comunidadesDir, archivo)}`);
        }
    } catch (error) {
        console.error(`✗ Error en ${archivo}:`, error.message);
    }
}

console.log(`\nTotal: ${modificados} archivos modificados`);
