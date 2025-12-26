# ✅ Checklist: Verificar Funciones en Vercel

## Pasos a Seguir en Vercel Dashboard

### 1. Verificar Framework Preset ⚠️ CRÍTICO
**Ruta:** Settings → General → Framework Preset

- [ ] Debe estar en **"Other"** o **"No Framework"**
- [ ] Si está en "Next.js", "React", "Vue", etc. → **Cámbialo a "Other"**
- [ ] Esto es **MUY IMPORTANTE** - frameworks específicos pueden no detectar funciones en `/api/`

### 2. Verificar Build Settings
**Ruta:** Settings → Build & Development Settings

- [ ] **Build Command:** Debe estar **vacío** o ser `echo "No build needed"`
- [ ] **Output Directory:** Debe estar **vacío**
- [ ] **Install Command:** Puede estar vacío o ser `npm install` (si hay dependencias)

### 3. Verificar que el Deployment se Completó
**Ruta:** Deployments → Último deployment

- [ ] Estado debe ser **"Ready"** (verde)
- [ ] No debe estar en "Building" o "Error"
- [ ] Revisa "Build Logs" si hay errores

### 4. Verificar Functions Tab
**Ruta:** Deployments → Último deployment → **Functions** tab

- [ ] Deberías ver **11 funciones** listadas
- [ ] Si no aparecen, sigue con los pasos siguientes

### 5. Verificar que los Archivos Estén en GitHub
**Ruta:** GitHub → Tu repositorio → Carpeta `api/`

- [ ] Debe haber **11 archivos .js** en la carpeta `api/`
- [ ] Verifica que el último commit incluya estos archivos

### 6. Forzar Nuevo Deployment
Si nada funciona:

```bash
git commit --allow-empty -m "Force deploy - verify functions"
git push origin main
```

### 7. Verificar Runtime Logs
**Ruta:** Deployments → Último deployment → **Runtime Logs**

- [ ] Prueba llamar a un endpoint manualmente
- [ ] Deberías ver logs cuando se ejecuta la función
- [ ] Si no hay logs, la función no se está ejecutando

## Endpoints para Probar

Abre estas URLs en tu navegador para generar logs:

1. `https://cresalia-web.vercel.app/api/mantenimiento`
2. `https://cresalia-web.vercel.app/api/celebraciones?tipo=cumpleanos&action=consent&email=test@test.com`
3. `https://cresalia-web.vercel.app/api/support`

Después de probarlos, revisa Runtime Logs - deberías ver las ejecuciones.

## Si Aún No Funciona

1. **Verifica que no haya un `.vercelignore`** que esté excluyendo la carpeta `api/`
2. **Verifica que el proyecto esté conectado correctamente** a GitHub
3. **Intenta desconectar y reconectar** el proyecto en Vercel
4. **Contacta soporte de Vercel** si el problema persiste
