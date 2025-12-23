// Script para actualizar todas las comunidades para usar supabase-config-comunidades.js
const fs = require('fs');
const path = require('path');

const comunidadesDir = path.join(__dirname, '..', 'comunidades');

function actualizarSupabaseEnComunidad(archivo) {
    try {
        let contenido = fs.readFileSync(archivo, 'utf8');
        let modificado = false;
        
        // Reemplazar supabase-config.js por supabase-config-comunidades.js
        if (contenido.includes('supabase-config.js') && !contenido.includes('supabase-config-comunidades.js')) {
            contenido = contenido.replace(
                /supabase-config\.js/g,
                'supabase-config-comunidades.js'
            );
            modificado = true;
        }
        
        if (modificado) {
            fs.writeFileSync(archivo, contenido, 'utf8');
            console.log(`✅ Actualizado: ${archivo}`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`❌ Error procesando ${archivo}:`, error.message);
        return false;
    }
}

function procesarComunidades() {
    const comunidades = fs.readdirSync(comunidadesDir, { withFileTypes: true });
    let procesadas = 0;
    let exitosas = 0;
    
    comunidades.forEach(comunidad => {
        if (comunidad.isDirectory()) {
            const indexPath = path.join(comunidadesDir, comunidad.name, 'index.html');
            if (fs.existsSync(indexPath)) {
                procesadas++;
                if (actualizarSupabaseEnComunidad(indexPath)) {
                    exitosas++;
                }
            }
        }
    });
    
    console.log(`\n📊 Resumen:`);
    console.log(`   Total procesadas: ${procesadas}`);
    console.log(`   Actualizadas: ${exitosas}`);
    console.log(`   Ya tenían la configuración correcta: ${procesadas - exitosas}`);
}

// Ejecutar
console.log('🔧 Actualizando configuración de Supabase en todas las comunidades...\n');
console.log('📝 Cambiando a proyecto de Comunidades: https://zbomxayytvwjbdzbegcw.supabase.co\n');
procesarComunidades();
console.log('\n✨ ¡Proceso completado!');
