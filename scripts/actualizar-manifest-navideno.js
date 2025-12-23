// Script para actualizar manifest.json con logo navideño durante temporada festiva
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const manifestPath = path.join(__dirname, '..', 'manifest.json');
const logoPath = path.join(__dirname, '..', 'assets', 'logo', 'logo-cresalia.png');
// Intentar primero JPG, luego PNG
const logoNavidenoJPG = path.join(__dirname, '..', 'assets', 'logo', 'logo-cresalia-navideno.jpg');
const logoNavidenoPNG = path.join(__dirname, '..', 'assets', 'logo', 'logo-cresalia-navideno.png');

// Verificar si estamos en temporada navideña (20 dic - 7 ene)
function esTemporadaNavidena() {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = ahora.getMonth(); // 0-11 (0 = enero)
    const dia = ahora.getDate();
    
    // 20 de diciembre - 7 de enero
    const fechaInicio = new Date(año, 11, 20); // 20 de diciembre
    const fechaFin = new Date(año + 1, 0, 7); // 7 de enero del año siguiente
    
    return ahora >= fechaInicio && ahora <= fechaFin;
}

// Generar logo navideño usando Canvas (Node.js)
function generarLogoNavideno() {
    // Nota: Para usar Canvas en Node.js necesitaríamos instalar 'canvas'
    // Por ahora, vamos a actualizar el manifest para que use el logo normal
    // pero con un parámetro de versión navideña
    // En producción, se podría generar la imagen con moño navideño
    
    console.log('🎄 Generando logo navideño para PWA...');
    
    // Por ahora, simplemente copiamos el logo original
    // En el futuro, se podría usar una librería como 'canvas' para dibujar el moño
    if (fs.existsSync(logoPath)) {
        try {
            fs.copyFileSync(logoPath, logoNavidenoPath);
            console.log('✅ Logo navideño preparado (usando logo base por ahora)');
            return true;
        } catch (error) {
            console.error('❌ Error copiando logo:', error.message);
            return false;
        }
    } else {
        console.warn('⚠️ Logo original no encontrado, usando logo por defecto');
        return false;
    }
}

// Actualizar manifest.json
function actualizarManifest() {
    try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        const esNavideno = esTemporadaNavidena();
        
        if (esNavideno) {
            console.log('🎄 Es temporada navideña, actualizando manifest con logo navideño...');
            
            // Generar logo navideño si no existe
            if (!fs.existsSync(logoNavidenoPath)) {
                generarLogoNavideno();
            }
            
            // Actualizar todas las referencias de iconos
            if (manifest.icons && Array.isArray(manifest.icons)) {
                manifest.icons = manifest.icons.map(icon => ({
                    ...icon,
                    src: icon.src.includes('logo-cresalia-navideno') 
                        ? icon.src 
                        : icon.src.replace('logo-cresalia.png', 'logo-cresalia-navideno.png?v=navideno')
                }));
            }
            
            // Actualizar shortcuts
            if (manifest.shortcuts && Array.isArray(manifest.shortcuts)) {
                manifest.shortcuts = manifest.shortcuts.map(shortcut => {
                    if (shortcut.icons && Array.isArray(shortcut.icons)) {
                        shortcut.icons = shortcut.icons.map(icon => ({
                            ...icon,
                            src: icon.src.includes('logo-cresalia-navideno')
                                ? icon.src
                                : icon.src.replace('logo-cresalia.png', `logo-cresalia-navideno.${extensionLogoNavideno}?v=navideno`)
                        }));
                    }
                    return shortcut;
                });
            }
            
            console.log('✅ Manifest actualizado con logo navideño');
        } else {
            console.log('📅 No es temporada navideña, usando logo normal');
            
            // Restaurar logo normal si está usando navideño
            if (manifest.icons && Array.isArray(manifest.icons)) {
                const tieneNavideno = manifest.icons.some(icon => icon.src.includes('logo-cresalia-navideno'));
                if (tieneNavideno) {
                    manifest.icons = manifest.icons.map(icon => ({
                        ...icon,
                        src: icon.src.replace('logo-cresalia-navideno.png?v=navideno', 'logo-cresalia.png?v=6.0')
                    }));
                    
                    if (manifest.shortcuts && Array.isArray(manifest.shortcuts)) {
                        manifest.shortcuts = manifest.shortcuts.map(shortcut => {
                            if (shortcut.icons && Array.isArray(shortcut.icons)) {
                                shortcut.icons = shortcut.icons.map(icon => ({
                                    ...icon,
                                    src: icon.src.replace('logo-cresalia-navideno.png?v=navideno', 'logo-cresalia.png')
                                }));
                            }
                            return shortcut;
                        });
                    }
                    
                    console.log('✅ Manifest restaurado con logo normal');
                }
            }
        }
        
        // Guardar manifest actualizado
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
        console.log('✅ Manifest.json guardado correctamente');
        
        return true;
    } catch (error) {
        console.error('❌ Error actualizando manifest:', error.message);
        return false;
    }
}

// Ejecutar
console.log('🎄 Actualizando manifest.json para PWA navideño...\n');
actualizarManifest();
console.log('\n✨ ¡Proceso completado!');
