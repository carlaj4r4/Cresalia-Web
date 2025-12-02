#!/usr/bin/env node

/**
 * Script de Verificación Pre-Deploy
 * Verifica que todo esté listo antes de hacer deploy
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando proyecto antes del deploy...\n');

let errores = [];
let advertencias = [];
let exitosas = [];

// 1. Verificar que vercel.json existe
console.log('1️⃣ Verificando vercel.json...');
if (fs.existsSync('vercel.json')) {
    exitosas.push('✅ vercel.json existe');
    try {
        const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
        if (vercelConfig.redirects && vercelConfig.redirects.length > 0) {
            exitosas.push('✅ vercel.json tiene redirects configurados');
        }
    } catch (e) {
        errores.push('❌ vercel.json tiene errores de sintaxis');
    }
} else {
    errores.push('❌ vercel.json no existe');
}

// 2. Verificar que manifest.json existe
console.log('2️⃣ Verificando manifest.json...');
if (fs.existsSync('manifest.json')) {
    exitosas.push('✅ manifest.json existe');
} else {
    advertencias.push('⚠️ manifest.json no existe (PWA puede no funcionar)');
}

// 3. Verificar que index-cresalia.html existe
console.log('3️⃣ Verificando página principal...');
if (fs.existsSync('index-cresalia.html')) {
    exitosas.push('✅ index-cresalia.html existe');
} else {
    errores.push('❌ index-cresalia.html no existe');
}

// 4. Verificar que config-supabase-seguro.js no tenga credenciales hardcodeadas
console.log('4️⃣ Verificando seguridad de credenciales...');
if (fs.existsSync('config-supabase-seguro.js')) {
    const contenido = fs.readFileSync('config-supabase-seguro.js', 'utf8');
    
    // Verificar si tiene credenciales hardcodeadas (básico)
    if (contenido.includes('REEMPLAZA') || contenido.includes('tu_')) {
        exitosas.push('✅ config-supabase-seguro.js usa placeholders (correcto)');
    } else if (contenido.includes('process.env') || contenido.includes('window.__ENV__')) {
        exitosas.push('✅ config-supabase-seguro.js usa variables de entorno');
    } else {
        advertencias.push('⚠️ config-supabase-seguro.js puede tener credenciales hardcodeadas - verifica antes de hacer commit');
    }
} else {
    advertencias.push('⚠️ config-supabase-seguro.js no existe');
}

// 5. Verificar que .gitignore protege archivos sensibles
console.log('5️⃣ Verificando .gitignore...');
if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    if (gitignore.includes('config-supabase-seguro.js') || gitignore.includes('config-privado.js')) {
        exitosas.push('✅ .gitignore protege archivos sensibles');
    } else {
        advertencias.push('⚠️ .gitignore puede no proteger todos los archivos sensibles');
    }
} else {
    advertencias.push('⚠️ .gitignore no existe');
}

// 6. Verificar estructura de carpetas importantes
console.log('6️⃣ Verificando estructura de carpetas...');
const carpetasImportantes = [
    'comunidades',
    'tiendas',
    'js',
    'css',
    'assets'
];

carpetasImportantes.forEach(carpeta => {
    if (fs.existsSync(carpeta)) {
        exitosas.push(`✅ Carpeta ${carpeta} existe`);
    } else {
        advertencias.push(`⚠️ Carpeta ${carpeta} no existe`);
    }
});

// 7. Verificar que package.json existe
console.log('7️⃣ Verificando package.json...');
if (fs.existsSync('package.json')) {
    exitosas.push('✅ package.json existe');
} else {
    advertencias.push('⚠️ package.json no existe');
}

// Resumen
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(50));

console.log(`\n✅ Exitosas: ${exitosas.length}`);
exitosas.forEach(msg => console.log(`   ${msg}`));

if (advertencias.length > 0) {
    console.log(`\n⚠️ Advertencias: ${advertencias.length}`);
    advertencias.forEach(msg => console.log(`   ${msg}`));
}

if (errores.length > 0) {
    console.log(`\n❌ Errores: ${errores.length}`);
    errores.forEach(msg => console.log(`   ${msg}`));
    console.log('\n🚨 HAY ERRORES - Corrígelos antes de hacer deploy');
    process.exit(1);
} else {
    console.log('\n🎉 ¡Todo listo para deploy!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. git add .');
    console.log('   2. git commit -m "Preparado para deploy"');
    console.log('   3. git push origin main');
    console.log('   4. Verifica el deploy en Vercel Dashboard');
    process.exit(0);
}

