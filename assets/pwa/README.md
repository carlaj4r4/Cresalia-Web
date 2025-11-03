# 🎨 Iconos PWA - Cresalia

## Iconos Generados

### Iconos Principales
- **icon-72x72.png** (72x72px) - Android small
- **icon-96x96.png** (96x96px) - Android medium
- **icon-128x128.png** (128x128px) - Chrome Web Store
- **icon-144x144.png** (144x144px) - Android large
- **icon-152x152.png** (152x152px) - iOS touch icon
- **icon-192x192.png** (192x192px) - Android extra large
- **icon-384x384.png** (384x384px) - Android xxl
- **icon-512x512.png** (512x512px) - Splash screen

### Iconos de Shortcuts
- **shortcut-admin.png** - Panel Admin
- **shortcut-support.png** - CRESALIA BOT
- **shortcut-new-store.png** - Nueva Tienda

### Iconos de Acciones
- **action-explore.png** - Ver
- **action-close.png** - Cerrar

## Conversión a PNG

Para convertir los SVG a PNG (recomendado para mejor compatibilidad):

```bash
# Usando ImageMagick (instalar primero)
for file in *.svg; do
  convert "$file" "${file%.svg}.png"
done

# O usando Node.js con sharp
npm install sharp
node convert-svg-to-png.js
```

## Personalización

Los iconos se generan automáticamente con los colores de Cresalia:
- **Primario**: #667eea
- **Secundario**: #764ba2
- **Fondo**: Gradiente lineal

Para regenerar los iconos:
```bash
node generate-icons.js
```
