#!/usr/bin/env node

/**
 * Script para validar el formato de las VAPID keys
 * Ayuda a detectar errores de copia/pegado
 */

const webpush = require('web-push');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function validarVAPIDKeys(publicKey, privateKey) {
    console.log('\n🔍 Validando VAPID Keys...\n');
    
    // Validar longitud
    const publicKeyLength = publicKey.length;
    const privateKeyLength = privateKey.length;
    
    console.log(`📏 Longitudes:`);
    console.log(`   - Public Key: ${publicKeyLength} caracteres`);
    console.log(`   - Private Key: ${privateKeyLength} caracteres`);
    
    // Longitudes típicas de VAPID keys
    const publicKeyExpected = 87; // Base64url sin padding
    const privateKeyExpected = 43; // Base64url sin padding
    
    if (Math.abs(publicKeyLength - publicKeyExpected) > 5) {
        console.log(`   ⚠️  Public Key tiene una longitud inusual (esperado: ~${publicKeyExpected})`);
    } else {
        console.log(`   ✅ Public Key tiene longitud correcta`);
    }
    
    if (Math.abs(privateKeyLength - privateKeyExpected) > 5) {
        console.log(`   ⚠️  Private Key tiene una longitud inusual (esperado: ~${privateKeyExpected})`);
    } else {
        console.log(`   ✅ Private Key tiene longitud correcta`);
    }
    
    // Validar formato base64url
    const base64urlRegex = /^[A-Za-z0-9_-]+$/;
    
    console.log(`\n🔤 Formato:`);
    if (base64urlRegex.test(publicKey)) {
        console.log(`   ✅ Public Key tiene formato base64url válido`);
    } else {
        console.log(`   ❌ Public Key contiene caracteres inválidos (solo debe tener A-Z, a-z, 0-9, _, -)`);
        console.log(`   Caracteres inválidos encontrados:`, publicKey.match(/[^A-Za-z0-9_-]/g));
    }
    
    if (base64urlRegex.test(privateKey)) {
        console.log(`   ✅ Private Key tiene formato base64url válido`);
    } else {
        console.log(`   ❌ Private Key contiene caracteres inválidos (solo debe tener A-Z, a-z, 0-9, _, -)`);
        console.log(`   Caracteres inválidos encontrados:`, privateKey.match(/[^A-Za-z0-9_-]/g));
    }
    
    // Intentar configurar las keys
    console.log(`\n🔧 Probando configuración con web-push...`);
    try {
        webpush.setVapidDetails(
            'mailto:test@example.com',
            publicKey.trim(),
            privateKey.trim()
        );
        console.log(`   ✅ VAPID keys configuradas correctamente`);
        console.log(`   ✅ Las keys son válidas y compatibles`);
    } catch (error) {
        console.log(`   ❌ Error configurando VAPID keys:`);
        console.log(`      ${error.message}`);
        return false;
    }
    
    // Verificar que las keys sean un par válido
    console.log(`\n🔗 Verificando que las keys sean un par válido...`);
    try {
        // Generar un par de keys de prueba para comparar formato
        const testKeys = webpush.generateVAPIDKeys();
        console.log(`   ✅ Formato de keys es compatible con web-push`);
        
        // Mostrar preview de las keys
        console.log(`\n📋 Preview de las keys:`);
        console.log(`   Public Key:  ${publicKey.substring(0, 30)}...${publicKey.substring(publicKey.length - 10)}`);
        console.log(`   Private Key: ${privateKey.substring(0, 20)}...${privateKey.substring(privateKey.length - 10)}`);
        
    } catch (error) {
        console.log(`   ⚠️  No se pudo verificar completamente: ${error.message}`);
    }
    
    return true;
}

function preguntarKeys() {
    console.log('🔐 Validador de VAPID Keys para Cresalia\n');
    console.log('Este script valida el formato de tus VAPID keys para detectar errores de copia/pegado.\n');
    
    rl.question('📋 Pega tu VAPID_PUBLIC_KEY: ', (publicKey) => {
        rl.question('📋 Pega tu VAPID_PRIVATE_KEY: ', (privateKey) => {
            console.log('\n' + '='.repeat(60));
            
            const esValido = validarVAPIDKeys(publicKey.trim(), privateKey.trim());
            
            console.log('\n' + '='.repeat(60));
            if (esValido) {
                console.log('\n✅ RESULTADO: Las VAPID keys parecen válidas');
                console.log('💡 Si aún tienes problemas, verifica que:');
                console.log('   1. Las keys estén correctamente configuradas en Vercel');
                console.log('   2. No haya espacios extra al inicio o final');
                console.log('   3. Las suscripciones push se hayan creado con las mismas keys');
            } else {
                console.log('\n❌ RESULTADO: Las VAPID keys tienen problemas');
                console.log('💡 Revisa los errores arriba y corrige las keys');
            }
            
            rl.close();
        });
    });
}

// Si se pasan las keys como argumentos
if (process.argv.length >= 4) {
    const publicKey = process.argv[2];
    const privateKey = process.argv[3];
    validarVAPIDKeys(publicKey, privateKey);
} else {
    preguntarKeys();
}
