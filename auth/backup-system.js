// ===== SISTEMA DE RESPALDOS AUTOMÁTICOS - CRESALIA =====
// Protección de datos con backups automáticos locales y en la nube

class BackupSystem {
    constructor() {
        this.backupInterval = 7 * 24 * 60 * 60 * 1000; // 7 días
        this.lastBackup = localStorage.getItem('last_backup_date');
        this.autoBackupEnabled = true;
    }
    
    // ===== BACKUP COMPLETO DE DATOS =====
    async crearBackupCompleto() {
        console.log('💾 Creando backup completo...');
        
        try {
            const supabase = initSupabase();
            const user = await obtenerUsuarioActual();
            
            if (!user) {
                throw new Error('Usuario no autenticado');
            }
            
            // 1. Obtener datos de la tienda
            const tienda = await obtenerDatosTienda(user.id);
            
            // 2. Obtener configuración
            const configuracion = JSON.parse(localStorage.getItem('configuracion_tienda') || '{}');
            
            // 3. Obtener productos (si existen)
            const productos = JSON.parse(localStorage.getItem('productos_techstore') || '[]');
            
            // 4. Obtener ofertas
            const ofertas = JSON.parse(localStorage.getItem('ofertas_techstore') || '[]');
            
            // 5. Obtener diario emocional
            const diario = JSON.parse(localStorage.getItem('diario_emocional_techstore') || '[]');
            
            // 6. Crear objeto de backup
            const backup = {
                version: '1.0',
                fecha_backup: new Date().toISOString(),
                user_id: user.id,
                tienda: tienda,
                configuracion: configuracion,
                productos: productos,
                ofertas: ofertas,
                diario_emocional: diario,
                metadata: {
                    total_productos: productos.length,
                    total_ofertas: ofertas.length,
                    total_entradas_diario: diario.length,
                    plan: tienda?.plan || 'basico'
                }
            };
            
            // 7. Guardar en localStorage
            localStorage.setItem('backup_ultimo', JSON.stringify(backup));
            localStorage.setItem('last_backup_date', new Date().toISOString());
            
            // 8. Descargar como archivo
            this.descargarBackup(backup);
            
            console.log('✅ Backup completo creado');
            
            return {
                success: true,
                backup: backup,
                mensaje: 'Backup creado y descargado exitosamente'
            };
            
        } catch (error) {
            console.error('❌ Error creando backup:', error);
            return {
                success: false,
                error: error.message,
                mensaje: 'Error al crear backup'
            };
        }
    }
    
    // ===== DESCARGAR BACKUP COMO ARCHIVO =====
    descargarBackup(backup) {
        const fecha = new Date().toISOString().split('T')[0];
        const nombreArchivo = `CRESALIA-Backup-${backup.tienda?.nombre_tienda || 'tienda'}-${fecha}.json`;
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`💾 Backup descargado: ${nombreArchivo}`);
    }
    
    // ===== RESTAURAR DESDE BACKUP =====
    restaurarBackup(backupData) {
        console.log('♻️ Restaurando desde backup...');
        
        try {
            // Validar estructura del backup
            if (!backupData.version || !backupData.tienda) {
                throw new Error('Archivo de backup inválido');
            }
            
            // Restaurar datos en localStorage
            if (backupData.configuracion) {
                localStorage.setItem('configuracion_tienda', JSON.stringify(backupData.configuracion));
            }
            
            if (backupData.productos) {
                localStorage.setItem('productos_techstore', JSON.stringify(backupData.productos));
            }
            
            if (backupData.ofertas) {
                localStorage.setItem('ofertas_techstore', JSON.stringify(backupData.ofertas));
            }
            
            if (backupData.diario_emocional) {
                localStorage.setItem('diario_emocional_techstore', JSON.stringify(backupData.diario_emocional));
            }
            
            console.log('✅ Backup restaurado exitosamente');
            
            return {
                success: true,
                mensaje: 'Datos restaurados correctamente. Recarga la página.'
            };
            
        } catch (error) {
            console.error('❌ Error restaurando backup:', error);
            return {
                success: false,
                error: error.message,
                mensaje: 'Error al restaurar backup'
            };
        }
    }
    
    // ===== BACKUP AUTOMÁTICO =====
    iniciarBackupAutomatico() {
        console.log('⏰ Iniciando sistema de backup automático...');
        
        // Verificar si es momento de hacer backup
        const ahora = new Date().getTime();
        const ultimoBackup = this.lastBackup ? new Date(this.lastBackup).getTime() : 0;
        const tiempoPasado = ahora - ultimoBackup;
        
        if (tiempoPasado >= this.backupInterval || !this.lastBackup) {
            console.log('💾 Es momento de hacer backup automático');
            this.crearBackupCompleto();
        }
        
        // Programar próximo backup
        setInterval(() => {
            this.crearBackupCompleto();
        }, this.backupInterval);
        
        console.log(`✅ Backup automático configurado (cada 7 días)`);
    }
    
    // ===== BACKUP A GOOGLE DRIVE (Opcional) =====
    async subirAGoogleDrive(backup) {
        console.log('☁️ Preparando backup para Google Drive...');
        
        // Crear archivo descargable que el usuario puede subir manualmente
        this.descargarBackup(backup);
        
        return {
            success: true,
            mensaje: 'Descarga el archivo y súbelo a tu Google Drive manualmente'
        };
        
        // TODO: Implementar OAuth de Google Drive para subida automática
        // Requiere configuración adicional de Google Cloud Console
    }
}

// Inicializar sistema de backups
const backupSystem = new BackupSystem();

// Función global para crear backup manual
function crearBackupManual() {
    return backupSystem.crearBackupCompleto();
}

// Función global para restaurar backup
function restaurarDesdeArchivo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const backupData = JSON.parse(event.target.result);
                const resultado = backupSystem.restaurarBackup(backupData);
                
                if (resultado.success) {
                    alert(resultado.mensaje);
                    window.location.reload();
                } else {
                    alert(resultado.mensaje);
                }
            } catch (error) {
                alert('Error: Archivo de backup inválido');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Auto-iniciar backups automáticos (comentado por defecto)
// backupSystem.iniciarBackupAutomatico();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BackupSystem, backupSystem };
}




















