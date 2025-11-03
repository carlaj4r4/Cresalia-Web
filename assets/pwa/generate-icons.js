#!/usr/bin/env node

/**
 * 🎨 GENERADOR DE ICONOS PWA PARA CRESALIA
 * 
 * Este script genera automáticamente todos los iconos necesarios
 * para la PWA a partir del logo principal de Cresalia.
 * 
 * Uso: node assets/pwa/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Tamaños de iconos necesarios
const ICON_SIZES = [
  { size: 72, name: 'icon-72x72.png', description: 'Android small' },
  { size: 96, name: 'icon-96x96.png', description: 'Android medium' },
  { size: 128, name: 'icon-128x128.png', description: 'Chrome Web Store' },
  { size: 144, name: 'icon-144x144.png', description: 'Android large' },
  { size: 152, name: 'icon-152x152.png', description: 'iOS touch icon' },
  { size: 192, name: 'icon-192x192.png', description: 'Android extra large' },
  { size: 384, name: 'icon-384x384.png', description: 'Android xxl' },
  { size: 512, name: 'icon-512x512.png', description: 'Splash screen' }
];

// Iconos adicionales para shortcuts
const SHORTCUT_ICONS = [
  { name: 'shortcut-admin.png', description: 'Panel Admin', color: '#ff6b6b' },
  { name: 'shortcut-support.png', description: 'CRESALIA BOT', color: '#4ecdc4' },
  { name: 'shortcut-new-store.png', description: 'Nueva Tienda', color: '#45b7d1' }
];

// Iconos para acciones de notificaciones
const ACTION_ICONS = [
  { name: 'action-explore.png', description: 'Ver', icon: '👁️' },
  { name: 'action-close.png', description: 'Cerrar', icon: '❌' }
];

/**
 * Crear SVG base para iconos
 */
function createBaseSVG(size, content, backgroundColor = '#667eea') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Fondo con gradiente -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bg)" />
  
  <!-- Contenido -->
  <g transform="translate(${size * 0.1}, ${size * 0.1})" filter="url(#shadow)">
    ${content}
  </g>
</svg>`;
}

/**
 * Crear contenido SVG para logo principal
 */
function createMainLogoSVG(size) {
  const contentSize = size * 0.8;
  const fontSize = contentSize * 0.25;
  
  return `
    <!-- Logo principal Cresalia -->
    <rect width="${contentSize}" height="${contentSize}" rx="${contentSize * 0.1}" fill="rgba(255,255,255,0.95)" />
    
    <!-- Texto CRESALIA -->
    <text x="${contentSize/2}" y="${contentSize * 0.4}" 
          font-family="Arial, sans-serif" 
          font-size="${fontSize}" 
          font-weight="bold" 
          text-anchor="middle" 
          fill="#667eea">C</text>
          
    <text x="${contentSize/2}" y="${contentSize * 0.75}" 
          font-family="Arial, sans-serif" 
          font-size="${fontSize * 0.6}" 
          font-weight="500" 
          text-anchor="middle" 
          fill="#764ba2">SHOP</text>
  `;
}

/**
 * Crear contenido SVG para shortcuts
 */
function createShortcutSVG(size, type, color) {
  const contentSize = size * 0.8;
  const iconSize = contentSize * 0.4;
  
  let iconPath = '';
  let text = '';
  
  switch(type) {
    case 'admin':
      iconPath = `<rect x="${(contentSize-iconSize)/2}" y="${(contentSize-iconSize)/2 - 10}" width="${iconSize}" height="${iconSize * 0.6}" rx="5" fill="white"/>
                  <circle cx="${contentSize/2}" cy="${contentSize/2 + 15}" r="${iconSize * 0.2}" fill="white"/>`;
      text = 'A';
      break;
    case 'support':
      iconPath = `<circle cx="${contentSize/2}" cy="${contentSize/2}" r="${iconSize/2}" fill="white"/>
                  <path d="M${contentSize/2 - iconSize/4} ${contentSize/2} Q${contentSize/2} ${contentSize/2 + iconSize/4} ${contentSize/2 + iconSize/4} ${contentSize/2}" stroke="${color}" stroke-width="3" fill="none"/>`;
      text = '💬';
      break;
    case 'new-store':
      iconPath = `<rect x="${(contentSize-iconSize)/2}" y="${(contentSize-iconSize)/2}" width="${iconSize}" height="${iconSize}" rx="5" fill="white"/>
                  <path d="M${contentSize/2} ${contentSize/2 - iconSize/4} L${contentSize/2} ${contentSize/2 + iconSize/4} M${contentSize/2 - iconSize/4} ${contentSize/2} L${contentSize/2 + iconSize/4} ${contentSize/2}" stroke="${color}" stroke-width="4"/>`;
      text = '+';
      break;
  }
  
  return `
    <rect width="${contentSize}" height="${contentSize}" rx="${contentSize * 0.15}" fill="${color}" />
    ${iconPath}
  `;
}

/**
 * Crear SVG para iconos de acción
 */
function createActionSVG(size, type) {
  const contentSize = size * 0.8;
  
  let content = '';
  
  switch(type) {
    case 'explore':
      content = `<circle cx="${contentSize/2}" cy="${contentSize/2}" r="${contentSize * 0.3}" fill="none" stroke="white" stroke-width="6"/>
                 <circle cx="${contentSize/2}" cy="${contentSize/2}" r="${contentSize * 0.1}" fill="white"/>`;
      break;
    case 'close':
      content = `<path d="M${contentSize * 0.3} ${contentSize * 0.3} L${contentSize * 0.7} ${contentSize * 0.7} M${contentSize * 0.7} ${contentSize * 0.3} L${contentSize * 0.3} ${contentSize * 0.7}" stroke="white" stroke-width="8" stroke-linecap="round"/>`;
      break;
  }
  
  return `
    <rect width="${contentSize}" height="${contentSize}" rx="${contentSize * 0.15}" fill="#ff4757" />
    ${content}
  `;
}

/**
 * Generar todos los iconos
 */
function generateIcons() {
  console.log('🎨 Generando iconos PWA para Cresalia...\n');
  
  const iconsDir = path.join(__dirname);
  
  // Crear iconos principales
  console.log('📱 Generando iconos principales:');
  ICON_SIZES.forEach(({ size, name, description }) => {
    const svgContent = createBaseSVG(size, createMainLogoSVG(size));
    const filePath = path.join(iconsDir, name.replace('.png', '.svg'));
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`  ✅ ${name} (${size}x${size}) - ${description}`);
  });
  
  // Crear iconos de shortcuts
  console.log('\n🔗 Generando iconos de shortcuts:');
  SHORTCUT_ICONS.forEach(({ name, description, color }) => {
    const type = name.split('-')[1].split('.')[0];
    const svgContent = createBaseSVG(96, createShortcutSVG(96, type, color));
    const filePath = path.join(iconsDir, name.replace('.png', '.svg'));
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`  ✅ ${name} - ${description}`);
  });
  
  // Crear iconos de acciones
  console.log('\n🔔 Generando iconos de acciones:');
  ACTION_ICONS.forEach(({ name, description }) => {
    const type = name.split('-')[1].split('.')[0];
    const svgContent = createBaseSVG(96, createActionSVG(96, type));
    const filePath = path.join(iconsDir, name.replace('.png', '.svg'));
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`  ✅ ${name} - ${description}`);
  });
  
  // Crear README con instrucciones
  const readmeContent = `# 🎨 Iconos PWA - Cresalia

## Iconos Generados

### Iconos Principales
${ICON_SIZES.map(icon => `- **${icon.name}** (${icon.size}x${icon.size}px) - ${icon.description}`).join('\n')}

### Iconos de Shortcuts
${SHORTCUT_ICONS.map(icon => `- **${icon.name}** - ${icon.description}`).join('\n')}

### Iconos de Acciones
${ACTION_ICONS.map(icon => `- **${icon.name}** - ${icon.description}`).join('\n')}

## Conversión a PNG

Para convertir los SVG a PNG (recomendado para mejor compatibilidad):

\`\`\`bash
# Usando ImageMagick (instalar primero)
for file in *.svg; do
  convert "\$file" "\${file%.svg}.png"
done

# O usando Node.js con sharp
npm install sharp
node convert-svg-to-png.js
\`\`\`

## Personalización

Los iconos se generan automáticamente con los colores de Cresalia:
- **Primario**: #667eea
- **Secundario**: #764ba2
- **Fondo**: Gradiente lineal

Para regenerar los iconos:
\`\`\`bash
node generate-icons.js
\`\`\`
`;
  
  fs.writeFileSync(path.join(iconsDir, 'README.md'), readmeContent);
  
  console.log('\n✅ ¡Iconos PWA generados exitosamente!');
  console.log('\n💡 Nota: Los archivos son SVG. Para mejor compatibilidad,');
  console.log('   convierte a PNG usando ImageMagick o herramientas similares.');
  console.log('\n📂 Ubicación: assets/pwa/');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };
