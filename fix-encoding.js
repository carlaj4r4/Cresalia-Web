// Script para arreglar la codificación del archivo admin.html
const fs = require('fs');
const path = require('path');

const filePath = './tiendas/ejemplo-tienda/admin.html';

console.log('🔧 Arreglando codificación del archivo...');

try {
    // Leer el archivo
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Reemplazos comunes de caracteres mal codificados
    const replacements = {
        'bsicos': 'básicos',
        'Rpidas': 'Rápidas', 
        'Administracin': 'Administración',
        'Navegacin': 'Navegación',
        'seccin': 'sección',
        'Configuracin': 'Configuración',
        'Cmo': '¿Cómo',
        'ltima': 'Última',
        'Ao': 'Año',
        'Creacin': 'Creación',
        '': 'á',
        '': 'é', 
        '': 'í',
        '': 'ó',
        '': 'ú',
        '': 'ñ',
        '': '¿',
        '': '¡',
        '': 'ü',
        '': 'Ü',
        '': 'Ñ',
        '': 'Á',
        '': 'É',
        '': 'Í', 
        '': 'Ó',
        '': 'Ú',
        '': '°',
        '': '€',
        '': '£',
        '': '¥',
        '': '¢',
        '': '§',
        '': '¶',
        '': '†',
        '': '‡',
        '': '•',
        '': '‰',
        '': '′',
        '': '″',
        '': '‹',
        '': '›',
        '': '™',
        '': '⁄',
        '': '‹',
        '': '›',
        '': 'Œ',
        '': 'œ',
        '': 'Š',
        '': 'š',
        '': 'Ÿ',
        '': 'Ž',
        '': 'ž',
        '': 'ƒ',
        '': 'ˆ',
        '': '˜',
        '': '–',
        '': '—',
        '': '‚',
        '': '„',
        '': '…',
        '': '‰',
        '': '‹',
        '': '›',
        '': '€',
        '': '€',
        '': '€'
    };
    
    let fixedContent = content;
    
    // Aplicar reemplazos
    for (const [wrong, correct] of Object.entries(replacements)) {
        fixedContent = fixedContent.replace(new RegExp(wrong, 'g'), correct);
    }
    
    // Escribir el archivo corregido
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    
    console.log('✅ ¡Archivo corregido exitosamente!');
    console.log('📁 Archivo:', filePath);
    console.log('🔤 Codificación: UTF-8');
    console.log('');
    console.log('💡 Ahora recarga la página en tu navegador para ver los cambios.');
    
} catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('💡 Asegúrate de que:');
    console.log('   1. El archivo existe en la ruta correcta');
    console.log('   2. Tienes permisos para escribir en el archivo');
    console.log('   3. El archivo no está abierto en otro programa');
}















