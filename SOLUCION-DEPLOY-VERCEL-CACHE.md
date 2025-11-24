# 🔧 Solución: Deploy de Vercel se Queda en Versión Antigua

## Problema
Vercel muestra una versión antigua del sitio aunque hayas hecho push de cambios nuevos.

## Soluciones Rápidas

### Opción 1: Redeploy Manual en Vercel (Más Rápido)
1. Ve a https://vercel.com
2. Entra a tu proyecto `Cresalia-Web`
3. Ve a la pestaña **"Deployments"**
4. Encontrá el último deploy (debería aparecer el más reciente con el commit `e141d55`)
5. Si aparece como "Ready" pero seguís viendo la versión antigua:
   - Click en los **3 puntos** (⋮) del deploy
   - Seleccioná **"Redeploy"**
   - Confirmá el redeploy

### Opción 2: Forzar Nuevo Deploy desde GitHub
1. Ve a tu repositorio en GitHub
2. Hacé un cambio pequeño (por ejemplo, agregar un espacio en README)
3. Hacé commit y push
4. Esto debería triggear un nuevo deploy automático

### Opción 3: Limpiar Cache del Navegador
A veces el problema es el cache de tu navegador, no Vercel:

**Chrome/Edge:**
- Presioná `Ctrl + Shift + Delete`
- Seleccioná "Imágenes y archivos en caché"
- Elegí "Última hora"
- Click en "Borrar datos"

**O en la página de Vercel:**
- Presioná `Ctrl + F5` (forzar recarga)
- O `Ctrl + Shift + R`

### Opción 4: Verificar que Vercel Detectó el Cambio
1. Ve a Vercel Dashboard
2. Click en tu proyecto
3. Ve a la pestaña **"Deployments"**
4. Verificá que el último deploy muestre el commit correcto:
   - Debería mostrar: `e141d55 - Agregado sistema de bienestar personalizado y mejoras`
5. Si no aparece, Vercel no detectó el push. Revisá la conexión GitHub-Vercel

### Opción 5: Verificar Configuración de Vercel
1. En Vercel Dashboard → Settings → Git
2. Verificá que esté conectado al repositorio correcto
3. Verificá que la rama sea `main`
4. Si no está conectado, reconectá GitHub

## Cambios Realizados en vercel.json

Agregué headers para forzar que los archivos HTML, JS y CSS no se cacheen:

```json
"headers": [
  {
    "source": "/(.*\\.(html|js|css|png|jpg|ico))",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=0, must-revalidate"
      }
    ]
  }
]
```

Esto debería prevenir el problema de cache en el futuro.

## Si Nada Funciona

1. **Desconectá y reconectá GitHub en Vercel:**
   - Settings → Git → Disconnect
   - Luego reconnect

2. **Hacé un deploy manual desde Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

3. **Verificá los logs de deploy:**
   - En Vercel Dashboard, click en el deploy
   - Ve a "Build Logs"
   - Revisá si hay errores

## Verificación Final

Para confirmar que el deploy funcionó:
1. Esperá 2-3 minutos después del push
2. Visitá: `https://cresalia-web.vercel.app/panel-bienestar-carla.html`
3. Si ves el panel de bienestar, el deploy funcionó
4. Si no, intentá con `Ctrl + Shift + R` para limpiar cache

---

**💡 Tip:** Si seguís viendo la versión antigua, el problema probablemente es el cache de tu navegador, no Vercel. Intentá abrir la página en una ventana de incógnito para verificar.

