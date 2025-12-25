# 🔑 Configuración de VAPID Keys para Push Notifications

## 📋 Pasos para Configurar

### 1. Generar VAPID Keys

Ejecuta:
```bash
node scripts/generar-vapid-keys.js
```

Esto mostrará las keys en la consola. **Copia esas keys** (no están en este archivo por seguridad).

### 2. Configurar en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega estas variables:

**VAPID_PUBLIC_KEY**
```
[Pega aquí tu VAPID_PUBLIC_KEY generada]
```

**VAPID_PRIVATE_KEY** (⚠️ NUNCA exponer esta en el frontend)
```
[Pega aquí tu VAPID_PRIVATE_KEY generada]
```

**⚠️ IMPORTANTE**: Las keys reales NO deben estar en este archivo ni en ningún archivo del repositorio.

4. Asegúrate de seleccionar todos los ambientes (Production, Preview, Development)
5. Haz clic en "Save"

### 3. Configurar en el Frontend

La VAPID_PUBLIC_KEY también debe estar disponible en el frontend. Se puede:
- Inyectar vía `inject-env-vars.js`
- O definir en el código (es pública, no es problema exponerla)

### 4. Verificar

Después de configurar:
1. Haz un deploy
2. Abre la consola del navegador
3. Deberías ver: "✅ Push subscription creada exitosamente"

## 📚 Recursos

- [Web Push Protocol](https://web.dev/push-notifications-overview/)
- [VAPID Specification](https://tools.ietf.org/html/rfc8292)

## ⚠️ Seguridad

- **VAPID_PRIVATE_KEY**: NUNCA debe estar en el frontend o en repositorios públicos
- **VAPID_PUBLIC_KEY**: Es segura de exponer públicamente
- Las keys son específicas del dominio, no las compartas entre proyectos
- **NUNCA commitees archivos con keys reales**

## 🔄 Regenerar Keys

Si necesitas regenerar las keys:
```bash
node scripts/generar-vapid-keys.js
```

Luego actualiza las variables en Vercel con las nuevas keys.
