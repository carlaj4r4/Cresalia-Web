// ============================================
// SCRIPT DE LIMPIEZA: URLs Inválidas
// ============================================
// Ejecuta este código en la consola del navegador (F12)
// para limpiar cualquier URL inválida guardada

(function() {
    console.log('🧹 Iniciando limpieza de URLs inválidas...');
    
    // Limpiar localStorage
    const urlGuardada = localStorage.getItem('cresalia_redirect_after_login');
    if (urlGuardada) {
        console.log('📋 URL guardada encontrada:', urlGuardada);
        
        // Verificar si contiene variables sin procesar
        if (urlGuardada.includes('{widgetUrl}') || 
            urlGuardada.includes('$%7BwidgetUrl%7D') || 
            urlGuardada.includes('widgetUrl') ||
            urlGuardada.includes('${') ||
            (urlGuardada.includes('%7B') && urlGuardada.includes('%7D'))) {
            console.warn('⚠️ URL inválida detectada, eliminando...');
            localStorage.removeItem('cresalia_redirect_after_login');
            console.log('✅ URL inválida eliminada');
        } else {
            console.log('✅ URL válida, manteniendo');
        }
    } else {
        console.log('ℹ️ No hay URL guardada');
    }
    
    // Limpiar también otras posibles URLs relacionadas
    const keysToCheck = [
        'cresalia_widget_acceso_activo',
        'cresalia_widget_comunidad_activo',
        'cresalia_redirect_after_login'
    ];
    
    keysToCheck.forEach(key => {
        const value = localStorage.getItem(key);
        if (value && (value.includes('{widgetUrl}') || 
                      value.includes('$%7BwidgetUrl%7D') || 
                      value.includes('widgetUrl'))) {
            console.warn(`⚠️ Eliminando ${key} con valor inválido`);
            localStorage.removeItem(key);
        }
    });
    
    // Limpiar sessionStorage también
    sessionStorage.clear();
    console.log('✅ sessionStorage limpiado');
    
    console.log('✅ Limpieza completada');
    console.log('🔄 Recarga la página (F5) para aplicar los cambios');
})();
