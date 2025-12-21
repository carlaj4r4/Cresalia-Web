# 🔄 Cómo Reconectar Vercel con GitHub

Si los cambios aparecen en GitHub pero no en Vercel, necesitás reconectar el repositorio.

## 📋 Pasos para Reconectar

### Opción 1: Desde el Dashboard de Vercel (Recomendado)

1. **Ir a Vercel Dashboard**
   - Entrá a https://vercel.com/dashboard
   - Seleccioná tu proyecto `cresalia-web`

2. **Ir a Settings → Git**
   - En el menú lateral, click en "Settings"
   - Luego click en "Git"

3. **Desconectar y Reconectar**
   - Click en "Disconnect" (si aparece)
   - Luego click en "Connect Git Repository"
   - Seleccioná tu repositorio `Cresalia-Web`
   - Autorizá los permisos si te lo pide

4. **Verificar Configuración**
   - Framework Preset: "Other" o "Vite" (según tu setup)
   - Root Directory: `./` (raíz del proyecto)
   - Build Command: (dejar vacío si es estático)
   - Output Directory: `./` (o el directorio donde están tus archivos HTML)

5. **Guardar y Redesplegar**
   - Click en "Save"
   - Vercel debería iniciar un nuevo deploy automáticamente

### Opción 2: Eliminar y Recrear el Proyecto

Si la opción 1 no funciona:

1. **Eliminar Proyecto Actual**
   - Settings → General → Scroll hasta el final
   - Click en "Delete Project"
   - Confirmá la eliminación

2. **Crear Nuevo Proyecto**
   - Click en "Add New Project"
   - Seleccioná tu repositorio `Cresalia-Web`
   - Configurá:
     - Framework: "Other"
     - Root Directory: `./`
   - Click en "Deploy"

### Opción 3: Forzar Deploy Manual

Si solo querés forzar un deploy sin reconectar:

1. **Desde Vercel CLI** (si lo tenés instalado):
   ```bash
   vercel --prod
   ```

2. **Desde el Dashboard**:
   - Deployments → Click en "..." (tres puntos) del último deploy
   - "Redeploy" → "Redeploy without Build Cache"

## ✅ Verificar que Funcionó

1. Esperá 2-3 minutos después del deploy
2. Visitá tu URL de producción: `https://cresalia-web.vercel.app`
3. Hacé un hard refresh: `Ctrl+Shift+R` (Windows) o `Cmd+Shift+R` (Mac)
4. Verificá que los cambios aparezcan

## 🔍 Troubleshooting

- **Si sigue sin funcionar**: Verificá que el commit que querés desplegar esté en la rama `main`
- **Si hay errores de build**: Revisá los logs en Vercel → Deployments → Click en el deploy fallido
- **Si el favicon no aparece**: Verificá que el archivo exista en `/assets/logo/logo-cresalia.png` y que las rutas sean absolutas (`/assets/...`)

## 📝 Nota sobre el Favicon

El favicon ahora usa directamente el logo PNG de Cresalia. Si necesitás un `.ico` específico:
1. Convertí `logo-cresalia.png` a `.ico` usando una herramienta online
2. Guardalo como `favicon.ico` en la raíz del proyecto
3. El HTML ya está configurado para usar el PNG, pero podés agregar también el `.ico` como fallback





