#!/usr/bin/env node

/**
 * 🚀 Setup Deploy - Cresalia-Web
 * 
 * Script que prepara todo para el deploy gratuito
 * Sin costos, sin complicaciones, sin inconvenientes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SetupDeploy {
    constructor() {
        this.projectName = 'cresalia-web';
        console.log('🚀 Setup Deploy Cresalia-Web');
        console.log('💜 "Empezamos pocos, crecemos mucho"');
    }

    // Verificar que estamos listos para deploy
    checkReady() {
        console.log('\n📋 Verificando que todo esté listo...');
        
        const requiredFiles = [
            'vercel.json',
            'railway.json',
            'deploy-script.js',
            'monitoring-system.js',
            'api-config.js',
            'backend/package.json',
            'backend/server-multitenancy.js'
        ];
        
        for (const file of requiredFiles) {
            if (!fs.existsSync(file)) {
                throw new Error(`❌ Archivo requerido no encontrado: ${file}`);
            }
        }
        
        console.log('✅ Todos los archivos requeridos están presentes');
    }

    // Crear archivos de configuración adicionales
    createConfigFiles() {
        console.log('\n⚙️ Creando archivos de configuración...');
        
        // Crear .vercelignore
        const vercelIgnore = `# Archivos a ignorar en Vercel
node_modules/
*.log
.env.local
.env.development.local
.env.test.local
.env.production.local
backups/
.tmp/
temp/
.DS_Store
Thumbs.db
`;

        fs.writeFileSync('.vercelignore', vercelIgnore);
        console.log('✅ .vercelignore creado');

        // Crear Procfile para Railway
        const procfile = `web: npm start
`;

        fs.writeFileSync('Procfile', procfile);
        console.log('✅ Procfile creado');

        // Crear nixpacks.toml para Railway
        const nixpacksToml = `[phases.setup]
nixPkgs = ["nodejs", "npm"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build || true"]

[start]
cmd = "npm start"
`;

        fs.writeFileSync('nixpacks.toml', nixpacksToml);
        console.log('✅ nixpacks.toml creado');
    }

    // Verificar configuración de Git
    checkGitConfig() {
        console.log('\n🔍 Verificando configuración de Git...');
        
        try {
            // Verificar que tenemos un repositorio Git
            execSync('git status', { stdio: 'pipe' });
            console.log('✅ Repositorio Git configurado');
            
            // Verificar rama
            const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
            console.log(`✅ Rama actual: ${branch}`);
            
            // Verificar remote
            try {
                const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
                console.log(`✅ Repositorio remoto: ${remoteUrl}`);
            } catch (error) {
                console.log('⚠️ No hay repositorio remoto configurado');
                console.log('   Ejecuta: git remote add origin <tu-repo-url>');
            }
            
        } catch (error) {
            throw new Error('❌ Git no está configurado. Ejecuta: git init');
        }
    }

    // Crear script de inicio para Railway
    createRailwayStartScript() {
        console.log('\n🚂 Creando script de inicio para Railway...');
        
        const startScript = `#!/bin/bash

# Railway Start Script - Cresalia-Web
echo "🚀 Iniciando Cresalia-Web en Railway..."
echo "💜 Empezamos pocos, crecemos mucho"

# Verificar que Node.js está disponible
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node --version)
echo "✅ Node.js versión: $NODE_VERSION"

# Verificar que npm está disponible
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar que la base de datos existe
if [ ! -f "cresalia.db" ]; then
    echo "🗄️ Inicializando base de datos..."
    npm run init-multitenancy
fi

# Iniciar servidor
echo "🎉 Iniciando servidor Cresalia-Web..."
npm start
`;

        fs.writeFileSync('start-railway.sh', startScript);
        
        // Hacer el script ejecutable
        try {
            execSync('chmod +x start-railway.sh');
            console.log('✅ Script de inicio para Railway creado');
        } catch (error) {
            console.log('⚠️ No se pudo hacer ejecutable el script (Windows)');
        }
    }

    // Crear documentación de deploy
    createDeployDocs() {
        console.log('\n📚 Creando documentación de deploy...');
        
        const deployDocs = `# 🚀 Deploy Cresalia-Web - Guía Completa

## 📋 Resumen
Esta guía te permite hacer deploy de Cresalia-Web **100% gratis** usando Vercel y Railway.

## 🎯 URLs de Deploy

### Frontend (Vercel):
- **URL:** https://cresalia-web.vercel.app
- **Costo:** $0/mes (gratis)
- **Límites:** 100GB bandwidth/mes

### Backend (Railway):
- **URL:** https://cresalia-backend-production.up.railway.app
- **Costo:** $0/mes (dentro del crédito)
- **Límites:** $5 crédito/mes

## 📝 Pasos para Deploy

### 1. Preparar el Código
\`\`\`bash
# Ejecutar setup
node setup-deploy.js

# Verificar que todo esté listo
node deploy-script.js
\`\`\`

### 2. Deploy en Vercel
1. Ir a [vercel.com](https://vercel.com)
2. Conectar con GitHub
3. Importar proyecto \`cresalia-web\`
4. Deploy automático

### 3. Deploy en Railway
1. Ir a [railway.app](https://railway.app)
2. Conectar con GitHub
3. Seleccionar carpeta \`backend/\`
4. Deploy automático

## 🔧 Scripts Disponibles

\`\`\`bash
# Setup completo
node setup-deploy.js

# Deploy automático
node deploy-script.js

# Respaldo automático
node backup-automatico.js

# Monitoreo
node monitoring-system.js
\`\`\`

## 📊 Monitoreo

El sistema incluye monitoreo automático:
- ✅ Verificación cada 5 minutos
- ✅ Alertas automáticas
- ✅ Logs detallados
- ✅ Estadísticas de uptime

## 🔒 Seguridad

- ✅ SSL/HTTPS automático
- ✅ CORS configurado
- ✅ Headers de seguridad
- ✅ Variables de entorno seguras

## 💰 Costos Reales

- **Vercel:** $0/mes
- **Railway:** $0/mes (dentro del crédito)
- **Total:** $0/mes

## 🆘 Soporte

Si tienes problemas:
1. Revisar logs en Vercel/Railway
2. Ejecutar \`node monitoring-system.js\`
3. Contactar soporte

---

💜 **"Empezamos pocos, crecemos mucho"**
`;

        fs.writeFileSync('DEPLOY-GUIDE.md', deployDocs);
        console.log('✅ Documentación de deploy creada');
    }

    // Verificar dependencias
    checkDependencies() {
        console.log('\n📦 Verificando dependencias...');
        
        // Verificar backend
        const backendPackageJson = path.join('backend', 'package.json');
        if (!fs.existsSync(backendPackageJson)) {
            throw new Error('❌ No se encontró package.json en backend/');
        }
        
        // Verificar node_modules del backend
        const backendNodeModules = path.join('backend', 'node_modules');
        if (!fs.existsSync(backendNodeModules)) {
            console.log('📦 Instalando dependencias del backend...');
            try {
                execSync('cd backend && npm install', { stdio: 'inherit' });
                console.log('✅ Dependencias del backend instaladas');
            } catch (error) {
                throw new Error('❌ Error al instalar dependencias del backend');
            }
        } else {
            console.log('✅ Dependencias del backend ya instaladas');
        }
    }

    // Ejecutar setup completo
    async run() {
        try {
            console.log('🚀 Iniciando setup de deploy...');
            
            this.checkReady();
            this.createConfigFiles();
            this.checkGitConfig();
            this.createRailwayStartScript();
            this.createDeployDocs();
            this.checkDependencies();
            
            console.log('\n🎉 Setup completado exitosamente!');
            console.log('\n📋 Próximos pasos:');
            console.log('1. Ejecutar: node deploy-script.js');
            console.log('2. Ir a https://vercel.com y conectar tu repositorio');
            console.log('3. Ir a https://railway.app y conectar tu repositorio');
            console.log('4. ¡Tu sitio estará disponible en minutos!');
            
            console.log('\n💜 Cresalia-Web está lista para conquistar Latinoamérica');
            
        } catch (error) {
            console.error('\n❌ Error en setup:', error.message);
            console.log('\n🔧 Soluciones comunes:');
            console.log('1. Verifica que estés en el directorio correcto');
            console.log('2. Ejecuta: git init');
            console.log('3. Ejecuta: git remote add origin <tu-repo-url>');
            process.exit(1);
        }
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    const setup = new SetupDeploy();
    setup.run();
}

module.exports = SetupDeploy;























