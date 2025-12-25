/**
 * Script para agregar el tema festivo a todas las páginas de comunidades
 * Ejecutar con: node scripts/agregar-tema-festivo-comunidades.js
 */

const fs = require('fs');
const path = require('path');

const comunidadesDir = path.join(__dirname, '..', 'comunidades');
const cssPath = '../../css/tema-festivo-temporada.css';
const jsPath = '../../js/tema-festivo-temporada.js';

// Leer todas las carpetas de comunidades
const carpetas = fs.readdirSync(comunidadesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

console.log(`📁 Encontradas ${carpetas.length} comunidades\n`);

let actualizadas = 0;
let errores = 0;

carpetas.forEach(carpeta => {
    const indexPath = path.join(comunidadesDir, carpeta, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
        console.log(`⚠️  ${carpeta}: No existe index.html`);
        return;
    }
    
    try {
        let contenido = fs.readFileSync(indexPath, 'utf8');
        let modificado = false;
        
        // CSS se carga dinámicamente por el JS, no necesita agregarse al HTML
        // Solo verificamos que no esté ya agregado manualmente
        const cssPattern = /tema-festivo-temporada\.css/;
        if (cssPattern.test(contenido)) {
            // Si ya existe, no hacer nada
            console.log(`   ℹ️  ${carpeta}: Ya tiene referencia al CSS festivo`);
        }
        
        // Agregar JS si no existe
        const jsPattern = /tema-festivo-temporada\.js/;
        const jsScriptPattern = /<script[^>]*logo-navideno\.js[^>]*><\/script>/i;
        
        if (!jsPattern.test(contenido)) {
            // Buscar donde está logo-navideno.js y agregar después
            if (jsScriptPattern.test(contenido)) {
                contenido = contenido.replace(
                    jsScriptPattern,
                    (match) => {
                        modificado = true;
                        return `${match}\n    \n    <!-- Tema Festivo Temporal (20 dic - 7 ene) -->\n    <script src="${jsPath}"></script>`;
                    }
                );
            } else {
                // Si no hay logo-navideno.js, buscar antes de </body>
                const bodyClosePattern = /<\/body>/i;
                if (bodyClosePattern.test(contenido)) {
                    contenido = contenido.replace(
                        bodyClosePattern,
                        (match) => {
                            modificado = true;
                            return `    \n    <!-- Tema Festivo Temporal (20 dic - 7 ene) -->\n    <script src="${jsPath}"></script>\n${match}`;
                        }
                    );
                }
            }
        }
        
        if (modificado) {
            fs.writeFileSync(indexPath, contenido, 'utf8');
            console.log(`✅ ${carpeta}: Tema festivo agregado`);
            actualizadas++;
        } else {
            console.log(`ℹ️  ${carpeta}: Ya tenía el tema festivo o no se pudo agregar`);
        }
        
    } catch (error) {
        console.error(`❌ ${carpeta}: Error - ${error.message}`);
        errores++;
    }
});

console.log(`\n📊 Resumen:`);
console.log(`   ✅ Actualizadas: ${actualizadas}`);
console.log(`   ❌ Errores: ${errores}`);
console.log(`   📁 Total comunidades: ${carpetas.length}`);
console.log(`\n🎄✨ ¡Tema festivo agregado a las comunidades!`);