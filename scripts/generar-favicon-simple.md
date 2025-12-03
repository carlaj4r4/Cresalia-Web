# 🎨 Generar Favicon.ico desde Logo PNG

## Opción 1: Herramienta Online (Más Fácil) ⭐

### Paso 1: Convertir PNG a ICO
1. Ve a: https://convertio.co/png-ico/
2. O: https://favicon.io/favicon-converter/
3. Sube tu archivo: `assets/logo/logo-cresalia.png`
4. Descarga el `favicon.ico` generado

### Paso 2: Guardar en el Proyecto
1. Mueve el `favicon.ico` descargado a la **raíz del proyecto** (donde está `index-cresalia.html`)
2. Reemplaza el `favicon.ico` antiguo si existe

### Paso 3: Verificar en HTML
El HTML ya está configurado para usar:
- `/favicon.ico` (si existe)
- `/assets/logo/logo-cresalia.png` (fallback)

## Opción 2: Script Node.js

Si tenés Node.js instalado:

```bash
# Instalar dependencias
npm install sharp

# Generar favicon
node scripts/generar-favicon.js
```

Esto generará un `favicon.png` que luego podés convertir a `.ico` usando la Opción 1.

## Opción 3: Usar el PNG Directamente

Si no querés crear un `.ico`, el HTML ya está configurado para usar el PNG directamente. Solo necesitás esperar a que el navegador actualice su caché.

## Verificación

Después de crear el favicon.ico:
1. Guardalo en la raíz: `/favicon.ico`
2. Espera el deploy en Vercel (2-3 minutos)
3. Limpia la caché del navegador: `Ctrl+Shift+Delete`
4. Recarga con hard refresh: `Ctrl+Shift+R`
5. Verifica en modo incógnito

## Nota

Los navegadores cachean los favicons muy agresivamente. Puede tomar varias horas para que se actualice completamente, incluso después de limpiar la caché.

