// ===== INSTALADOR DE DEPENDENCIAS DE SEGURIDAD - CRESALIA =====
// Script para instalar las dependencias de seguridad necesarias

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔒 Instalando dependencias de seguridad para Cresalia...\n');

const securityDependencies = [
    'express-rate-limit',
    'helmet',
    'express-validator'
];

try {
    console.log('📦 Instalando paquetes de seguridad...');
    
    for (const dep of securityDependencies) {
        console.log(`   Instalando ${dep}...`);
        execSync(`npm install ${dep}`, { stdio: 'inherit', cwd: __dirname });
    }
    
    console.log('\n✅ Dependencias de seguridad instaladas correctamente!');
    console.log('\n📋 Dependencias instaladas:');
    securityDependencies.forEach(dep => {
        console.log(`   ✓ ${dep}`);
    });
    
    console.log('\n🔒 Medidas de seguridad disponibles:');
    console.log('   ✓ Rate Limiting (express-rate-limit)');
    console.log('   ✓ Security Headers (helmet)');
    console.log('   ✓ Input Validation (express-validator)');
    
    console.log('\n🚀 Para activar la seguridad, reinicia el servidor:');
    console.log('   npm run dev');
    
} catch (error) {
    console.error('❌ Error instalando dependencias de seguridad:', error.message);
    console.log('\n🔧 Solución manual:');
    console.log('   cd backend');
    console.log('   npm install express-rate-limit helmet express-validator');
}























