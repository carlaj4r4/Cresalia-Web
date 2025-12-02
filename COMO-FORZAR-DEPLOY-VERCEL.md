# 🔄 Cómo Forzar un Nuevo Deploy en Vercel

## Problema
Vercel muestra una versión antigua aunque hayas hecho push de cambios.

## Solución Rápida (2 minutos)

### 1. Ve al Dashboard de Vercel
- https://vercel.com/dashboard
- Entrá a tu proyecto `Cresalia-Web`

### 2. Forzar Redeploy Manual
1. Click en la pestaña **"Deployments"** (arriba)
2. Buscá el deploy más reciente (debería mostrar el commit `6e52dcb`)
3. Si no aparece, o si aparece pero seguís viendo versión antigua:
   - Click en los **3 puntos** (⋮) del deploy más reciente
   - Seleccioná **"Redeploy"**
   - Confirmá

### 3. Esperar 1-2 minutos
- El deploy tardará aproximadamente 1-2 minutos
- Verás el estado cambiando: "Building" → "Ready"

### 4. Limpiar Cache del Navegador
Después del deploy, limpiá el cache:

**Opción A: Recarga forzada**
- Presioná `Ctrl + Shift + R` (Windows/Linux)
- O `Cmd + Shift + R` (Mac)

**Opción B: Modo incógnito**
- Abrí una ventana de incógnito
- Visitá: `https://cresalia-web.vercel.app`

**Opción C: Limpiar cache completo**
- `Ctrl + Shift + Delete`
- Seleccioná "Caché e imágenes almacenadas"
- "Última hora"
- "Borrar datos"

## Si el Problema Persiste

### Verificar que Vercel Detectó el Push
1. En Vercel Dashboard → Deployments
2. Verificá que el último commit sea: `6e52dcb - Fix cache: Agregado Cache-Control header`
3. Si no aparece, Vercel no detectó el push

### Reconectar GitHub (Si no detecta)
1. Vercel Dashboard → Settings → Git
2. Click en **"Disconnect"**
3. Luego **"Connect Git Repository"** de nuevo
4. Seleccioná tu repositorio `Cresalia-Web`

### Deploy Manual con CLI (Alternativa)
Si nada funciona, podés hacer deploy manual:

```bash
# Instalar Vercel CLI (solo una vez)
npm install -g vercel

# Login
vercel login

# Deploy de producción
vercel --prod
```

## Cambios Realizados

Ya agregué headers anti-cache en `vercel.json`:
- Los archivos HTML, JS y CSS no se cachearán
- Esto previene el problema en el futuro

## Verificación

Para verificar que funcionó:
1. Esperá 2-3 minutos después del redeploy
2. Visitá: `https://cresalia-web.vercel.app/panel-bienestar-carla.html`
3. Si ves el nuevo panel de bienestar, ¡funcionó!
4. Si no, intentá en modo incógnito o limpiá el cache

---

**💡 Tip:** Después de un redeploy, siempre limpiá el cache del navegador con `Ctrl + Shift + R`



