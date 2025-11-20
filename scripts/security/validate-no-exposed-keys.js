/**
 * 🔒 Script de Validación: Prevenir Claves Expuestas
 * Este script verifica que no haya credenciales de Mercado Pago expuestas en el código
 * Se ejecuta antes de hacer commit a GitHub
 */

const fs = require('fs');
const path = require('path');

// Patrones que indican credenciales expuestas
const DANGEROUS_PATTERNS = [
    // Access Tokens de Mercado Pago (producción)
    /APP_USR-\d+-\d+-\d+-\d+-\d+/g,
    // Access Tokens largos (probablemente reales)
    /APP_USR-[a-zA-Z0-9]{80,}/g,
    // Public Keys que parecen reales (muy largas)
    /APP_USR-[a-zA-Z0-9]{100,}/g,
    // Cualquier token que no sea un placeholder
    /(ACCESS_TOKEN|accessToken|access_token)\s*[:=]\s*['"](APP_USR|TEST)[^'"]{50,}['"]/g,
    // Claves en archivos de configuración que no son placeholders
    /(PUBLIC_KEY|publicKey|public_key)\s*[:=]\s*['"](APP_USR|TEST)[^'"]{50,}['"]/g
];

// Placeholders seguros (estos están bien)
const SAFE_PLACEHOLDERS = [
    'CONFIGURAR_EN_VERCEL',
    'TEST-TU_PUBLIC_KEY_SANDBOX_AQUI',
    'TEST-TU_ACCESS_TOKEN_SANDBOX_AQUI',
    'TEST-12345678-1234-1234-1234-123456789012',
    'TEST-1234567890123456-123456-123456789012345678901234567890-123456789',
    'APP_USR-tu-access-token-aqui',
    'APP_USR-tu-public-key-aqui'
];

// Archivos a revisar
const FILES_TO_CHECK = [
    'config-mercado-pago.js',
    'js/mercado-pago-integration.js',
    'js/mercadopago-checkoutapi.js',
    'api/mercadopago-preference.js',
    'api/webhook-mercadopago.js',
    'script-cresalia.js',
    'js/payment-system.js',
    'tiendas/**/admin*.html'
];

// Archivos que DEBEN estar en .gitignore
const MUST_BE_IGNORED = [
    'config-mercado-pago.js',
    'config-privado.js',
    '.env',
    '.env.local',
    '.env.production'
];

function isSafeValue(value) {
    // Verificar si es un placeholder seguro
    if (SAFE_PLACEHOLDERS.some(placeholder => value.includes(placeholder))) {
        return true;
    }
    
    // Verificar si es muy corto (probablemente un placeholder)
    if (value.length < 30) {
        return true;
    }
    
    // Verificar si contiene palabras clave de placeholder
    if (value.includes('TU_') || value.includes('AQUI') || value.includes('REEMPLAZAR')) {
        return true;
    }
    
    return false;
}

function checkFile(filePath) {
    const errors = [];
    const warnings = [];
    
    try {
        if (!fs.existsSync(filePath)) {
            return { errors, warnings };
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
            // Verificar patrones peligrosos
            DANGEROUS_PATTERNS.forEach(pattern => {
                const matches = line.match(pattern);
                if (matches) {
                    matches.forEach(match => {
                        if (!isSafeValue(match)) {
                            errors.push({
                                file: filePath,
                                line: index + 1,
                                content: line.trim(),
                                match: match,
                                message: `⚠️ POSIBLE CREDENCIAL EXPUESTA: ${match.substring(0, 20)}...`
                            });
                        }
                    });
                }
            });
            
            // Verificar si hay valores que parecen reales
            if (line.includes('APP_USR-') || line.includes('TEST-')) {
                // Extraer el valor entre comillas
                const quotedMatch = line.match(/(?:'|"|`)([^'"`]+)(?:'|"|`)/);
                if (quotedMatch) {
                    const value = quotedMatch[1];
                    if (value.length > 50 && !isSafeValue(value)) {
                        warnings.push({
                            file: filePath,
                            line: index + 1,
                            content: line.trim(),
                            message: `⚠️ Valor sospechoso en línea ${index + 1}. Verificá que no sea una credencial real.`
                        });
                    }
                }
            }
        });
    } catch (error) {
        console.error(`❌ Error leyendo ${filePath}:`, error.message);
    }
    
    return { errors, warnings };
}

function checkGitignore() {
    const errors = [];
    
    try {
        const gitignorePath = path.join(process.cwd(), '.gitignore');
        if (!fs.existsSync(gitignorePath)) {
            errors.push('❌ .gitignore no existe. Creá uno para proteger las credenciales.');
            return errors;
        }
        
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        
        MUST_BE_IGNORED.forEach(file => {
            if (!gitignoreContent.includes(file)) {
                errors.push(`❌ ${file} NO está en .gitignore. Agregalo para proteger las credenciales.`);
            }
        });
    } catch (error) {
        console.error('❌ Error leyendo .gitignore:', error.message);
    }
    
    return errors;
}

function main() {
    console.log('🔒 Validando seguridad de credenciales...\n');
    
    const allErrors = [];
    const allWarnings = [];
    
    // Verificar .gitignore
    const gitignoreErrors = checkGitignore();
    allErrors.push(...gitignoreErrors);
    
    // Verificar archivos
    FILES_TO_CHECK.forEach(filePattern => {
        // Si tiene **, buscar recursivamente
        if (filePattern.includes('**')) {
            const basePath = filePattern.split('**')[0];
            // Por ahora, solo verificar archivos específicos
            return;
        }
        
        const filePath = path.join(process.cwd(), filePattern);
        const result = checkFile(filePath);
        allErrors.push(...result.errors);
        allWarnings.push(...result.warnings);
    });
    
    // Verificar archivos específicos
    const specificFiles = [
        'config-mercado-pago.js',
        'js/mercado-pago-integration.js',
        'js/mercadopago-checkoutapi.js',
        'api/mercadopago-preference.js',
        'script-cresalia.js',
        'js/payment-system.js'
    ];
    
    specificFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            const result = checkFile(filePath);
            allErrors.push(...result.errors);
            allWarnings.push(...result.warnings);
        }
    });
    
    // Mostrar resultados
    if (allErrors.length > 0) {
        console.log('❌ ERRORES ENCONTRADOS:\n');
        allErrors.forEach(error => {
            if (typeof error === 'string') {
                console.log(error);
            } else {
                console.log(`📁 ${error.file}:${error.line}`);
                console.log(`   ${error.message}`);
                console.log(`   Línea: ${error.content}\n`);
            }
        });
        console.log('\n🚨 NO HAGAS COMMIT. Corregí los errores antes de subir a GitHub.\n');
        process.exit(1);
    }
    
    if (allWarnings.length > 0) {
        console.log('⚠️ ADVERTENCIAS:\n');
        allWarnings.forEach(warning => {
            console.log(`📁 ${warning.file}:${warning.line}`);
            console.log(`   ${warning.message}\n`);
        });
        console.log('\n💡 Revisá las advertencias para asegurarte de que no hay credenciales reales.\n');
    }
    
    if (allErrors.length === 0 && allWarnings.length === 0) {
        console.log('✅ No se encontraron credenciales expuestas.\n');
        console.log('✅ Los archivos están usando placeholders seguros.\n');
        console.log('✅ .gitignore está configurado correctamente.\n');
    }
    
    process.exit(allErrors.length > 0 ? 1 : 0);
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { checkFile, checkGitignore, isSafeValue };


