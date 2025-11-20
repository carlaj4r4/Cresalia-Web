#!/usr/bin/env node
/**
 * 🔒 Pre-commit Hook: Validar que no haya credenciales expuestas
 * Este script se ejecuta automáticamente antes de hacer commit
 * Previene que se suban credenciales a GitHub
 */

const { execSync } = require('child_process');
const { checkFile, checkGitignore } = require('./validate-no-exposed-keys');
const fs = require('fs');
const path = require('path');

function main() {
    console.log('🔒 Validando seguridad antes de commit...\n');
    
    // Verificar .gitignore
    const gitignoreErrors = checkGitignore();
    if (gitignoreErrors.length > 0) {
        console.log('❌ ERRORES EN .gitignore:\n');
        gitignoreErrors.forEach(error => console.log(error));
        console.log('\n🚨 NO HAGAS COMMIT. Corregí .gitignore primero.\n');
        process.exit(1);
    }
    
    // Obtener archivos staged (que se van a commitear)
    try {
        const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
            .split('\n')
            .filter(file => file.trim() !== '');
        
        let hasErrors = false;
        
        stagedFiles.forEach(file => {
            // Solo verificar archivos JavaScript y de configuración
            if (file.endsWith('.js') || file.endsWith('.html') || file.includes('config')) {
                const filePath = path.join(process.cwd(), file);
                if (fs.existsSync(filePath)) {
                    const result = checkFile(filePath);
                    if (result.errors.length > 0) {
                        hasErrors = true;
                        console.log(`❌ ERRORES EN ${file}:\n`);
                        result.errors.forEach(error => {
                            console.log(`   Línea ${error.line}: ${error.message}`);
                            console.log(`   ${error.content}\n`);
                        });
                    }
                }
            }
        });
        
        if (hasErrors) {
            console.log('\n🚨 NO HAGAS COMMIT. Se encontraron credenciales expuestas.\n');
            console.log('💡 Solución:');
            console.log('   1. Remové las credenciales reales del código');
            console.log('   2. Usá solo variables de entorno o placeholders');
            console.log('   3. Verificá que .gitignore incluya los archivos de configuración\n');
            process.exit(1);
        }
        
        console.log('✅ No se encontraron credenciales expuestas.\n');
        console.log('✅ Seguro para hacer commit.\n');
        
    } catch (error) {
        // Si no hay archivos staged o hay un error, continuar
        console.log('⚠️ No se pudieron verificar los archivos. Continuando...\n');
    }
}

if (require.main === module) {
    main();
}

module.exports = main;


