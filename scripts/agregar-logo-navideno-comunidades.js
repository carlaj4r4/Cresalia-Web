// Script para agregar logo navideño a todas las comunidades
const fs = require('fs');
const path = require('path');

const comunidadesDir = path.join(__dirname, '..', 'comunidades');

function agregarLogoNavidenoAComunidad(archivo) {
    try {
        let contenido = fs.readFileSync(archivo, 'utf8');
        
        // Verificar si ya tiene el logo navideño
        if (contenido.includes('logo-navideno.css') || contenido.includes('logo-navideno.js')) {
            console.log(`⏭️  Ya tiene logo navideño: ${archivo}`);
            return false;
        }
        
        let modificado = false;
        
        // Agregar CSS del logo navideño después de animacion-fiestas.css
        if (contenido.includes('animacion-fiestas.css')) {
            contenido = contenido.replace(
                /(<link[^>]*animacion-fiestas\.css[^>]*>)/i,
                '$1\n    <link rel="stylesheet" href="../../css/logo-navideno.css">'
            );
            modificado = true;
        } else if (contenido.includes('</head>')) {
            // Si no tiene animacion-fiestas, agregarlo antes de </head>
            contenido = contenido.replace(
                /(<\/head>)/i,
                '    <link rel="stylesheet" href="../../css/logo-navideno.css">\n$1'
            );
            modificado = true;
        }
        
        // Agregar JS del logo navideño después de animacion-fiestas.js
        if (contenido.includes('animacion-fiestas.js')) {
            contenido = contenido.replace(
                /(<script[^>]*animacion-fiestas\.js[^>]*><\/script>)/i,
                '$1\n    <script src="../../js/logo-navideno.js"></script>'
            );
            modificado = true;
        } else if (contenido.includes('</body>')) {
            // Si no tiene animacion-fiestas.js, agregarlo antes de </body>
            contenido = contenido.replace(
                /(<\/body>)/i,
                '    <script src="../../js/logo-navideno.js"></script>\n$1'
            );
            modificado = true;
        }
        
        if (modificado) {
            fs.writeFileSync(archivo, contenido, 'utf8');
            console.log(`✅ Logo navideño agregado: ${archivo}`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`❌ Error procesando ${archivo}:`, error.message);
        return false;
    }
}

function procesarComunidades() {
    const comunidades = fs.readdirSync(comunidadesDir, { withFileTypes: true });
    let procesadas = 0;
    let exitosas = 0;
    
    comunidades.forEach(comunidad => {
        if (comunidad.isDirectory()) {
            const indexPath = path.join(comunidadesDir, comunidad.name, 'index.html');
            if (fs.existsSync(indexPath)) {
                procesadas++;
                if (agregarLogoNavidenoAComunidad(indexPath)) {
                    exitosas++;
                }
            }
        }
    });
    
    console.log(`\n📊 Resumen:`);
    console.log(`   Total procesadas: ${procesadas}`);
    console.log(`   Exitosas: ${exitosas}`);
    console.log(`   Ya tenían: ${procesadas - exitosas}`);
}

// Ejecutar
console.log('🎄 Agregando logo navideño a todas las comunidades...\n');
procesarComunidades();
console.log('\n✨ ¡Proceso completado!');
