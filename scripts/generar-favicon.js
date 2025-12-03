/**
 * Script para generar favicon.ico desde logo-cresalia.png
 * 
 * Uso:
 *   node scripts/generar-favicon.js
 * 
 * Requiere: npm install sharp (o usar herramienta online)
 */

const fs = require('fs');
const path = require('path');

// Verificar si sharp está disponible
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.log('⚠️ Sharp no está instalado. Instalando...');
    console.log('💡 Ejecutá: npm install sharp');
    console.log('\n📋 Alternativa: Usá una herramienta online:');
    console.log('   1. https://convertio.co/png-ico/');
    console.log('   2. https://favicon.io/favicon-converter/');
    console.log('   3. Subí tu logo-cresalia.png');
    console.log('   4. Descargá el favicon.ico generado');
    console.log('   5. Guardalo en la raíz del proyecto como favicon.ico');
    process.exit(1);
}

async function generarFavicon() {
    const logoPath = path.join(__dirname, '..', 'assets', 'logo', 'logo-cresalia.png');
    const faviconPath = path.join(__dirname, '..', 'favicon.ico');
    
    // Verificar que el logo existe
    if (!fs.existsSync(logoPath)) {
        console.error('❌ No se encontró el logo en:', logoPath);
        console.log('💡 Asegurate de que el archivo logo-cresalia.png existe en assets/logo/');
        process.exit(1);
    }
    
    try {
        console.log('🔄 Generando favicon.ico desde logo-cresalia.png...');
        
        // Leer la imagen
        const image = sharp(logoPath);
        const metadata = await image.metadata();
        
        console.log(`📐 Tamaño original: ${metadata.width}x${metadata.height}px`);
        
        // Crear favicon.ico con múltiples tamaños (16x16, 32x32, 48x48)
        // Nota: sharp no puede crear .ico directamente, pero podemos crear un PNG optimizado
        // Para un .ico real, necesitarías usar otra herramienta
        
        // Crear versión 32x32 (tamaño estándar para favicon)
        const favicon32 = await image
            .resize(32, 32, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 0 }
            })
            .png()
            .toBuffer();
        
        // Guardar como favicon.png (temporal)
        const faviconPngPath = path.join(__dirname, '..', 'favicon.png');
        fs.writeFileSync(faviconPngPath, favicon32);
        
        console.log('✅ Favicon generado como favicon.png (32x32px)');
        console.log('⚠️  Nota: Para crear un .ico real, necesitás usar una herramienta online:');
        console.log('   1. https://convertio.co/png-ico/');
        console.log('   2. Subí el favicon.png generado');
        console.log('   3. Descargá el favicon.ico');
        console.log('   4. Reemplazá favicon.png por favicon.ico en la raíz');
        console.log('\n💡 O podés usar el favicon.png directamente en el HTML');
        
    } catch (error) {
        console.error('❌ Error generando favicon:', error.message);
        console.log('\n💡 Alternativa: Usá una herramienta online:');
        console.log('   https://convertio.co/png-ico/');
        process.exit(1);
    }
}

// Ejecutar
generarFavicon();

