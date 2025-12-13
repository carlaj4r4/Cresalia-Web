// ===== SCRIPT DE BACKUP AUTOMÁTICO PARA SUPABASE =====
// Ejecutar con: node scripts/backup-supabase.js
// Requiere: @supabase/supabase-js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración - Leer desde variables de entorno o archivo de config
const SUPABASE_URL = (process.env.SUPABASE_URL || '').trim();
const SUPABASE_SERVICE_KEY = (process.env.SUPABASE_SERVICE_KEY || '').trim(); // Necesitas service key (no anon key)

// Validación mejorada
if (!SUPABASE_URL) {
    console.error('❌ Error: SUPABASE_URL no está configurado');
    console.error('💡 Verifica que hayas creado el secret "SUPABASE_URL" en GitHub:');
    console.error('   1. Ve a Settings → Secrets and variables → Actions');
    console.error('   2. Click en "New repository secret"');
    console.error('   3. Name: SUPABASE_URL');
    console.error('   4. Value: https://tu-proyecto.supabase.co');
    process.exit(1);
}

if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ Error: SUPABASE_SERVICE_KEY no está configurado');
    console.error('💡 Verifica que hayas creado el secret "SUPABASE_SERVICE_KEY" en GitHub:');
    console.error('   1. Ve a Settings → Secrets and variables → Actions');
    console.error('   2. Click en "New repository secret"');
    console.error('   3. Name: SUPABASE_SERVICE_KEY');
    console.error('   4. Value: tu-service-role-key-aqui');
    process.exit(1);
}

// Validar formato de URL
if (!SUPABASE_URL.startsWith('http://') && !SUPABASE_URL.startsWith('https://')) {
    console.error('❌ Error: SUPABASE_URL debe ser una URL válida (debe empezar con http:// o https://)');
    console.error('💡 URL recibida:', SUPABASE_URL || '(vacío)');
    console.error('💡 Ejemplo correcto: https://zbomxayytvwjbdzbegcw.supabase.co');
    process.exit(1);
}

// Validar que la service key tenga el formato correcto
if (SUPABASE_SERVICE_KEY.length < 100) {
    console.warn('⚠️  Advertencia: SUPABASE_SERVICE_KEY parece ser muy corta');
    console.warn('💡 Asegúrate de usar la service_role key (no la anon key)');
    console.warn('💡 La service_role key es mucho más larga (generalmente más de 200 caracteres)');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

class BackupSupabase {
    constructor() {
        this.backupDir = path.join(__dirname, '../backups');
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        this.crearDirectorio();
    }
    
    crearDirectorio() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
            console.log('📁 Directorio de backups creado:', this.backupDir);
        }
    }
    
    async hacerBackupTabla(nombreTabla) {
        try {
            console.log(`📊 Respaldando tabla: ${nombreTabla}...`);
            
            const { data, error } = await supabase
                .from(nombreTabla)
                .select('*');
            
            if (error) throw error;
            
            const backupPath = path.join(this.backupDir, `${nombreTabla}_${this.timestamp}.json`);
            fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
            
            console.log(`✅ ${nombreTabla}: ${data.length} registros respaldados`);
            return { tabla: nombreTabla, registros: data.length, path: backupPath };
        } catch (error) {
            console.error(`❌ Error respaldando ${nombreTabla}:`, error.message);
            return { tabla: nombreTabla, error: error.message };
        }
    }
    
    async hacerBackupCompleto() {
        console.log('💾 Iniciando backup completo de Supabase...\n');
        
        // Lista de tablas importantes (ajusta según tu esquema)
        const tablas = [
            'tenants',
            'tiendas',
            'productos',
            'ordenes',
            'orden_items',
            'usuarios',
            'feedbacks',
            'posts_comunidades',
            'comentarios_foro',
            'tickets_soporte',
            // Agrega más tablas según necesites
        ];
        
        const resultados = [];
        const backupInfo = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            tablas: []
        };
        
        for (const tabla of tablas) {
            const resultado = await this.hacerBackupTabla(tabla);
            resultados.push(resultado);
            
            if (resultado.registros !== undefined) {
                backupInfo.tablas.push({
                    nombre: tabla,
                    registros: resultado.registros,
                    archivo: path.basename(resultado.path)
                });
            }
            
            // Esperar un poco entre backups para no sobrecargar
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Guardar información del backup
        const infoPath = path.join(this.backupDir, `backup-info_${this.timestamp}.json`);
        fs.writeFileSync(infoPath, JSON.stringify(backupInfo, null, 2));
        
        console.log('\n✅ Backup completo finalizado');
        console.log(`📁 Ubicación: ${this.backupDir}`);
        console.log(`📄 Info guardada en: backup-info_${this.timestamp}.json`);
        
        // Resumen
        const exitosos = resultados.filter(r => r.registros !== undefined).length;
        const errores = resultados.filter(r => r.error).length;
        console.log(`\n📊 Resumen: ${exitosos} tablas respaldadas, ${errores} errores`);
        
        return { exitosos, errores, resultados, infoPath };
    }
    
    limpiarBackupsAntiguos(diasRetencion = 30) {
        console.log(`🧹 Limpiando backups más antiguos de ${diasRetencion} días...`);
        
        const ahora = new Date();
        const archivos = fs.readdirSync(this.backupDir);
        let eliminados = 0;
        
        archivos.forEach(archivo => {
            const archivoPath = path.join(this.backupDir, archivo);
            const stats = fs.statSync(archivoPath);
            const diasAntiguedad = (ahora - stats.mtime) / (1000 * 60 * 60 * 24);
            
            if (diasAntiguedad > diasRetencion) {
                fs.unlinkSync(archivoPath);
                eliminados++;
                console.log(`🗑️  Eliminado: ${archivo}`);
            }
        });
        
        console.log(`✅ ${eliminados} archivos antiguos eliminados`);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const backup = new BackupSupabase();
    
    backup.hacerBackupCompleto()
        .then(() => {
            // Limpiar backups antiguos después de crear uno nuevo
            backup.limpiarBackupsAntiguos(30);
            console.log('\n✨ Proceso de backup completado');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Error fatal:', error);
            process.exit(1);
        });
}

module.exports = { BackupSupabase };

