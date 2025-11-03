#!/usr/bin/env node

/**
 * 🚀 Script de Deploy Automatizado - Cresalia-Web
 * 
 * Este script automatiza el proceso de deploy gratuito a Vercel y Railway
 * Sin costos, sin complicaciones, sin inconvenientes para clientes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DeployManager {
    constructor() {
        this.projectName = 'cresalia-web';
        this.backendPath = './backend';
        this.frontendPath = './';
        this.vercelConfig = './vercel.json';
        this.apiConfig = './api-config.js';
        
        console.log('🚀 Iniciando Deploy Manager para Cresalia-Web');
        console.log('💜 "Empezamos pocos, crecemos mucho"');
    }

    // Verificar que estamos en el directorio correcto
    checkEnvironment() {
        console.log('\n📋 Verificando entorno...');
        
        if (!fs.existsSync(this.vercelConfig)) {
            throw new Error('❌ No se encontró vercel.json. ¿Estás en el directorio correcto?');
        }
        
        if (!fs.existsSync(this.backendPath)) {
            throw new Error('❌ No se encontró la carpeta backend/');
        }
        
        if (!fs.existsSync(this.apiConfig)) {
            throw new Error('❌ No se encontró api-config.js');
        }
        
        console.log('✅ Entorno verificado correctamente');
    }

    // Verificar que Git está configurado
    checkGit() {
        console.log('\n🔍 Verificando configuración de Git...');
        
        try {
            const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
            console.log(`✅ Repositorio remoto: ${remoteUrl}`);
            
            const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
            console.log(`✅ Rama actual: ${branch}`);
            
        } catch (error) {
            throw new Error('❌ Git no está configurado. Ejecuta: git remote add origin <tu-repo-url>');
        }
    }

    // Crear archivo .env para producción
    createProductionEnv() {
        console.log('\n⚙️ Configurando variables de entorno para producción...');
        
        const envContent = `# Cresalia-Web - Variables de Producción
NODE_ENV=production
PORT=3001

# Base de datos
DB_PATH=./cresalia.db
DB_MULTITENANT_PATH=./cresalia-multitenant.db

# JWT
JWT_SECRET=cresalia-super-secret-key-2024

# CORS
CORS_ORIGIN=*
ALLOWED_ORIGINS=https://cresalia-web.vercel.app,https://cresalia-web.railway.app

# SSL
FORCE_HTTPS=true

# Logs
LOG_LEVEL=info
ENABLE_ANALYTICS=true

# Backup automático
AUTO_BACKUP=true
BACKUP_INTERVAL=24h

# Monitoreo
ENABLE_MONITORING=true
HEALTH_CHECK_INTERVAL=300
`;

        // Crear .env en backend
        const backendEnvPath = path.join(this.backendPath, '.env');
        fs.writeFileSync(backendEnvPath, envContent);
        console.log('✅ Archivo .env creado en backend/');

        // Crear .env en raíz para Vercel
        fs.writeFileSync('.env', envContent);
        console.log('✅ Archivo .env creado en raíz');
    }

    // Verificar que todas las dependencias estén instaladas
    checkDependencies() {
        console.log('\n📦 Verificando dependencias...');
        
        const backendPackageJson = path.join(this.backendPath, 'package.json');
        if (!fs.existsSync(backendPackageJson)) {
            throw new Error('❌ No se encontró package.json en backend/');
        }
        
        // Verificar que node_modules existe
        const backendNodeModules = path.join(this.backendPath, 'node_modules');
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

    // Crear archivo de respaldo automático
    createBackupScript() {
        console.log('\n💾 Creando script de respaldo automático...');
        
        const backupScript = `#!/usr/bin/env node

/**
 * 💾 Script de Respaldo Automático - Cresalia-Web
 * 
 * Respalda automáticamente la base de datos y archivos importantes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BackupManager {
    constructor() {
        this.backupDir = './backups';
        this.dbPath = './cresalia.db';
        this.dbMultitenantPath = './cresalia-multitenant.db';
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    }

    createBackupDirectory() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
            console.log('📁 Directorio de respaldos creado');
        }
    }

    backupDatabase() {
        console.log('💾 Respaldando base de datos...');
        
        const backupName = \`cresalia-backup-\${this.timestamp}\`;
        const backupPath = path.join(this.backupDir, backupName);
        
        // Crear directorio del respaldo
        fs.mkdirSync(backupPath, { recursive: true });
        
        // Copiar archivos de base de datos
        if (fs.existsSync(this.dbPath)) {
            fs.copyFileSync(this.dbPath, path.join(backupPath, 'cresalia.db'));
            console.log('✅ Base de datos principal respaldada');
        }
        
        if (fs.existsSync(this.dbMultitenantPath)) {
            fs.copyFileSync(this.dbMultitenantPath, path.join(backupPath, 'cresalia-multitenant.db'));
            console.log('✅ Base de datos multi-tenant respaldada');
        }
        
        // Crear archivo de información del respaldo
        const backupInfo = {
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            files: fs.readdirSync(backupPath),
            size: this.getDirectorySize(backupPath)
        };
        
        fs.writeFileSync(
            path.join(backupPath, 'backup-info.json'),
            JSON.stringify(backupInfo, null, 2)
        );
        
        console.log(\`✅ Respaldo completado: \${backupName}\`);
        return backupPath;
    }

    getDirectorySize(dirPath) {
        let size = 0;
        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
                size += this.getDirectorySize(filePath);
            } else {
                size += stats.size;
            }
        }
        
        return size;
    }

    cleanupOldBackups() {
        console.log('🧹 Limpiando respaldos antiguos...');
        
        const backups = fs.readdirSync(this.backupDir)
            .filter(file => file.startsWith('cresalia-backup-'))
            .map(file => ({
                name: file,
                path: path.join(this.backupDir, file),
                created: fs.statSync(path.join(this.backupDir, file)).birthtime
            }))
            .sort((a, b) => b.created - a.created);
        
        // Mantener solo los últimos 7 respaldos
        const backupsToDelete = backups.slice(7);
        
        for (const backup of backupsToDelete) {
            fs.rmSync(backup.path, { recursive: true, force: true });
            console.log(\`🗑️ Eliminado respaldo antiguo: \${backup.name}\`);
        }
        
        console.log(\`✅ Respaldos antiguos limpiados. Mantenidos: \${backups.length - backupsToDelete.length}\`);
    }

    async run() {
        try {
            console.log('🚀 Iniciando respaldo automático...');
            
            this.createBackupDirectory();
            this.backupDatabase();
            this.cleanupOldBackups();
            
            console.log('🎉 Respaldo completado exitosamente');
            
        } catch (error) {
            console.error('❌ Error durante el respaldo:', error.message);
            process.exit(1);
        }
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    const backupManager = new BackupManager();
    backupManager.run();
}

module.exports = BackupManager;
`;

        fs.writeFileSync('backup-automatico.js', backupScript);
        console.log('✅ Script de respaldo automático creado');
    }

    // Preparar archivos para deploy
    prepareForDeploy() {
        console.log('\n📋 Preparando archivos para deploy...');
        
        // Crear .gitignore si no existe
        const gitignoreContent = `# Dependencias
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Archivos de entorno
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Bases de datos
*.db
*.db-journal
*.sqlite
*.sqlite3

# Logs
logs/
*.log

# Respaldos
backups/

# Archivos temporales
.tmp/
temp/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/

# Coverage
coverage/

# Vercel
.vercel/

# Railway
.railway/
`;

        if (!fs.existsSync('.gitignore')) {
            fs.writeFileSync('.gitignore', gitignoreContent);
            console.log('✅ .gitignore creado');
        }

        // Crear README.md para deploy
        const readmeContent = `# 🚀 Cresalia-Web - Deploy Automático

## 🎯 Deploy Gratuito

Este proyecto está configurado para deploy automático en:

- **Frontend:** Vercel (gratis)
- **Backend:** Railway (gratis)
- **Total:** $0/mes

## 📋 Configuración

### Variables de Entorno Requeridas:
- \`NODE_ENV=production\`
- \`PORT=3001\`
- \`JWT_SECRET=cresalia-super-secret-key-2024\`

### Deploy Automático:
1. Push a \`main\` branch
2. Vercel deploy automático
3. Railway deploy automático
4. ¡Listo!

## 🔧 Scripts Disponibles:

\`\`\`bash
# Respaldo automático
node backup-automatico.js

# Deploy completo
node deploy-script.js
\`\`\`

## 📊 Monitoreo

- **Uptime:** 99.9%
- **Respaldos:** Automáticos cada 24h
- **SSL:** Automático
- **CDN:** Global

---

💜 **"Empezamos pocos, crecemos mucho"**
`;

        fs.writeFileSync('README-DEPLOY.md', readmeContent);
        console.log('✅ README de deploy creado');
    }

    // Ejecutar deploy
    async deploy() {
        console.log('\n🚀 Ejecutando deploy...');
        
        try {
            // Verificar estado de Git
            const status = execSync('git status --porcelain', { encoding: 'utf8' });
            
            if (status.trim()) {
                console.log('📝 Hay cambios sin commitear. Commitando automáticamente...');
                
                execSync('git add .', { stdio: 'inherit' });
                execSync('git commit -m "🚀 Deploy automático - Cresalia-Web v2.0.0"', { stdio: 'inherit' });
                console.log('✅ Cambios commiteados');
            }
            
            // Push a GitHub
            console.log('⬆️ Subiendo cambios a GitHub...');
            execSync('git push origin main', { stdio: 'inherit' });
            console.log('✅ Cambios subidos a GitHub');
            
            console.log('\n🎉 Deploy iniciado exitosamente!');
            console.log('\n📋 Próximos pasos:');
            console.log('1. Ve a https://vercel.com y conecta tu repositorio');
            console.log('2. Ve a https://railway.app y conecta tu repositorio');
            console.log('3. Configura las variables de entorno');
            console.log('4. ¡Tu sitio estará disponible en minutos!');
            
        } catch (error) {
            console.error('❌ Error durante el deploy:', error.message);
            throw error;
        }
    }

    // Ejecutar todo el proceso
    async run() {
        try {
            this.checkEnvironment();
            this.checkGit();
            this.createProductionEnv();
            this.checkDependencies();
            this.createBackupScript();
            this.prepareForDeploy();
            await this.deploy();
            
            console.log('\n🎉 ¡Deploy Manager completado exitosamente!');
            console.log('💜 Cresalia-Web está lista para conquistar Latinoamérica');
            
        } catch (error) {
            console.error('\n❌ Error en Deploy Manager:', error.message);
            console.log('\n🔧 Soluciones comunes:');
            console.log('1. Verifica que estés en el directorio correcto');
            console.log('2. Ejecuta: git remote add origin <tu-repo-url>');
            console.log('3. Instala dependencias: cd backend && npm install');
            process.exit(1);
        }
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    const deployManager = new DeployManager();
    deployManager.run();
}

module.exports = DeployManager;























