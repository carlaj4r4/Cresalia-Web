# 🔍 Verificar Deployment en Vercel

## Problema: No aparecen logs ni cron jobs

### Pasos para Verificar:

1. **Verificar que el deployment se completó:**
   - Ve a Vercel Dashboard → Tu proyecto
   - Revisa el último deployment
   - Debe estar en estado "Ready" (verde)
   - Si está en "Building" o "Error", hay un problema

2. **Verificar Functions:**
   - En el deployment, haz clic en "Functions"
   - Deberías ver 11 funciones listadas
   - Si ves menos, algunos endpoints no se desplegaron

3. **Verificar Logs:**
   - Ve a "Runtime Logs" (no Build Logs)
   - Los Runtime Logs muestran cuando las funciones se ejecutan
   - Si no hay logs, las funciones no se están llamando

4. **Probar un endpoint manualmente:**
   ```
   https://cresalia-web.vercel.app/api/celebraciones?tipo=cumpleanos&action=consent&email=test@test.com
   ```
   - Esto debería generar un log en Runtime Logs

## Posibles Causas:

### 1. Deployment no completado
- **Solución:** Espera a que termine el build o revisa los Build Logs

### 2. Error en el código
- **Solución:** Revisa Build Logs para ver errores de sintaxis

### 3. Variables de entorno faltantes
- **Solución:** Verifica que todas las variables estén configuradas en Vercel

### 4. Límite de funciones excedido
- **Solución:** Verifica que tengas exactamente 11 funciones (no más)

## Comandos Útiles:

### Verificar endpoints localmente:
```bash
# Listar todos los archivos en api/
ls api/*.js
```

### Contar funciones:
```bash
# Debería mostrar 11 archivos
ls api/*.js | wc -l
```

## Endpoints que deberían estar activos (11):

1. ✅ api/admin.js
2. ✅ api/ai-chat.js
3. ✅ api/celebraciones.js
4. ✅ api/comunidades-api.js
5. ✅ api/enviar-email-brevo.js
6. ✅ api/enviar-push-notification.js
7. ✅ api/jobs.js
8. ✅ api/mantenimiento.js
9. ✅ api/mercadopago-preference.js
10. ✅ api/support.js
11. ✅ api/webhook-mercadopago.js

## Si el problema persiste:

1. **Forzar nuevo deployment:**
   - Haz un commit vacío: `git commit --allow-empty -m "Force deploy"`
   - Push: `git push origin main`

2. **Verificar en Vercel CLI:**
   ```bash
   vercel ls
   vercel inspect
   ```

3. **Revisar Build Logs:**
   - En Vercel Dashboard → Último deployment → "Build Logs"
   - Busca errores de compilación
