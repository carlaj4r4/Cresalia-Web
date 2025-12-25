/**
 * Script para generar VAPID keys para Push Notifications
 * Ejecutar con: node scripts/generar-vapid-keys.js
 * 
 * Requiere: npm install web-push
 */

const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

console.log('🔑 Generando VAPID keys para Push Notifications...\n');

try {
    // Generar las keys
    const vapidKeys = webpush.generateVAPIDKeys();
    
    console.log('✅ VAPID Keys generadas exitosamente!\n');
    console.log('📋 Copia estas keys y configúralas en Vercel:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 VAPID_PUBLIC_KEY:');
    console.log(vapidKeys.publicKey);
    console.log('\n🔐 VAPID_PRIVATE_KEY:');
    console.log(vapidKeys.privateKey);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Guardar en archivo .env.example (no en .env real por seguridad)
    const envExamplePath = path.join(__dirname, '..', '.env.example');
    let envContent = '';
    
    if (fs.existsSync(envExamplePath)) {
        envContent = fs.readFileSync(envExamplePath, 'utf8');
    }
    
    // Agregar o actualizar las keys en .env.example
    const lines = envContent.split('\n');
    const newLines = [];
    let publicKeyFound = false;
    let privateKeyFound = false;
    
    lines.forEach(line => {
        if (line.startsWith('VAPID_PUBLIC_KEY=')) {
            newLines.push(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
            publicKeyFound = true;
        } else if (line.startsWith('VAPID_PRIVATE_KEY=')) {
            newLines.push(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
            privateKeyFound = true;
        } else {
            newLines.push(line);
        }
    });
    
    if (!publicKeyFound) {
        newLines.push(`\n# VAPID Keys para Push Notifications`);
        newLines.push(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
    }
    if (!privateKeyFound) {
        newLines.push(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
    }
    
    fs.writeFileSync(envExamplePath, newLines.join('\n'), 'utf8');
    console.log('📝 Keys agregadas a .env.example (NO committear .env con keys reales)\n');
    
    // Crear archivo de documentación (SIN las keys reales por seguridad)
    const docPath = path.join(__dirname, '..', 'CONFIGURAR-VAPID-KEYS.md');
    const docContent = `# 🔑 Configuración de VAPID Keys para Push Notifications

## 📋 Pasos para Configurar

### 1. Generar VAPID Keys

Ejecuta:
\`\`\`bash
node scripts/generar-vapid-keys.js
\`\`\`

Esto mostrará las keys en la consola. **Copia esas keys** (no están en este archivo por seguridad).

### 2. Configurar en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega estas variables:

**VAPID_PUBLIC_KEY**
\`\`\`
[Pega aquí tu VAPID_PUBLIC_KEY generada]
\`\`\`

**VAPID_PRIVATE_KEY** (⚠️ NUNCA exponer esta en el frontend)
\`\`\`
[Pega aquí tu VAPID_PRIVATE_KEY generada]
\`\`\`

**⚠️ IMPORTANTE**: Las keys reales NO deben estar en este archivo ni en ningún archivo del repositorio.

4. Asegúrate de seleccionar todos los ambientes (Production, Preview, Development)
5. Haz clic en "Save"

### 3. Configurar en el Frontend

La VAPID_PUBLIC_KEY también debe estar disponible en el frontend. Se puede:
- Inyectar vía \`inject-env-vars.js\`
- O definir en el código (es pública, no es problema exponerla)

### 4. Verificar

Después de configurar:
1. Haz un deploy
2. Abre la consola del navegador
3. Deberías ver: "✅ Push subscription creada exitosamente"

## 📚 Recursos

- [Web Push Protocol](https://web.dev/push-notifications-overview/)
- [VAPID Specification](https://tools.ietf.org/html/rfc8292)

## ⚠️ Seguridad

- **VAPID_PRIVATE_KEY**: NUNCA debe estar en el frontend o en repositorios públicos
- **VAPID_PUBLIC_KEY**: Es segura de exponer públicamente
- Las keys son específicas del dominio, no las compartas entre proyectos
- **NUNCA commitees archivos con keys reales**

## 🔄 Regenerar Keys

Si necesitas regenerar las keys:
\`\`\`bash
node scripts/generar-vapid-keys.js
\`\`\`

Luego actualiza las variables en Vercel con las nuevas keys.
`;

    fs.writeFileSync(docPath, docContent, 'utf8');
    console.log('📖 Documentación creada: CONFIGURAR-VAPID-KEYS.md\n');
    
    console.log('⚠️  IMPORTANTE:');
    console.log('   1. Copia las keys y configúralas en Vercel (Environment Variables)');
    console.log('   2. La VAPID_PUBLIC_KEY también debe estar disponible en el frontend');
    console.log('   3. NUNCA commitees .env con las keys reales\n');
    
} catch (error) {
    if (error.message.includes('Cannot find module')) {
        console.error('❌ Error: web-push no está instalado\n');
        console.log('📦 Instala la dependencia:');
        console.log('   npm install web-push\n');
    } else {
        console.error('❌ Error generando keys:', error.message);
    }
    process.exit(1);
}
