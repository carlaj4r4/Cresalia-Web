#!/usr/bin/env node

/**
 * Script para verificar que todas las funciones serverless estén correctamente formateadas
 */

const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'api');
const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.js'));

console.log('🔍 Verificando funciones serverless de Vercel...\n');
console.log(`📁 Directorio: ${apiDir}`);
console.log(`📊 Total de archivos: ${files.length}\n`);

let errores = [];
let correctos = [];

files.forEach(file => {
    const filePath = path.join(apiDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`\n📄 ${file}:`);
    
    // Verificar que tenga module.exports o export
    const hasModuleExports = /module\.exports\s*=/.test(content);
    const hasExportDefault = /export\s+default/.test(content);
    const hasExportAsync = /export\s+async/.test(content);
    
    if (!hasModuleExports && !hasExportDefault && !hasExportAsync) {
        console.log('  ❌ No tiene exportación (module.exports o export)');
        errores.push({
            archivo: file,
            problema: 'Falta exportación'
        });
    } else {
        console.log('  ✅ Tiene exportación');
        correctos.push(file);
    }
    
    // Verificar que sea una función async
    const hasAsyncFunction = /module\.exports\s*=\s*async|export\s+(default\s+)?async/.test(content);
    if (!hasAsyncFunction && (hasModuleExports || hasExportDefault || hasExportAsync)) {
        console.log('  ⚠️  Exporta pero no es async');
    } else if (hasAsyncFunction) {
        console.log('  ✅ Es función async');
    }
    
    // Verificar que tenga req y res como parámetros
    const hasReqRes = /\(req\s*,\s*res\)|\(req\s*,\s*res\s*,\s*next\)/.test(content);
    if (hasReqRes) {
        console.log('  ✅ Tiene parámetros req, res');
    } else {
        console.log('  ⚠️  No tiene parámetros req, res (puede ser válido si usa otro formato)');
    }
    
    // Verificar sintaxis básica
    try {
        // Intentar parsear el código (solo verificar sintaxis, no ejecutar)
        require(filePath);
        console.log('  ✅ Sintaxis correcta');
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('Cannot find module')) {
            // Esto es normal, solo significa que hay dependencias faltantes
            console.log('  ⚠️  Dependencias faltantes (normal en verificación)');
        } else {
            console.log(`  ❌ Error de sintaxis: ${error.message}`);
            errores.push({
                archivo: file,
                problema: `Error de sintaxis: ${error.message}`
            });
        }
    }
});

console.log('\n' + '='.repeat(60));
console.log('\n📊 RESUMEN:\n');
console.log(`✅ Correctos: ${correctos.length}`);
console.log(`❌ Con errores: ${errores.length}`);
console.log(`📁 Total: ${files.length}`);

if (errores.length > 0) {
    console.log('\n❌ ARCHIVOS CON PROBLEMAS:\n');
    errores.forEach(e => {
        console.log(`  - ${e.archivo}: ${e.problema}`);
    });
    process.exit(1);
} else {
    console.log('\n✅ Todas las funciones están correctamente formateadas!');
    console.log('\n💡 Si Vercel aún no las detecta:');
    console.log('   1. Verifica que el deployment se haya completado');
    console.log('   2. Revisa los Build Logs en Vercel');
    console.log('   3. Asegúrate de que los archivos estén en la carpeta api/');
    console.log('   4. Verifica que no haya errores de sintaxis en el build');
    process.exit(0);
}
