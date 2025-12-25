# 🔑 Configuración de VAPID Keys para Push Notifications

## 📋 ¿Qué son las VAPID Keys?

Las **VAPID keys** (Voluntary Application Server Identification) son un par de claves criptográficas que permiten que tu servidor se identifique ante los servicios de push del navegador (Chrome, Firefox, etc.) para enviar notificaciones push a los usuarios.

## 🚀 Pasos para Configurar

### 1. Instalar dependencia

```bash
npm install web-push
```

### 2. Generar VAPID Keys

```bash
node scripts/generar-vapid-keys.js
```

Esto generará dos keys:
- **VAPID_PUBLIC_KEY**: Segura de exponer públicamente (frontend)
- **VAPID_PRIVATE_KEY**: ⚠️ NUNCA exponer (solo backend)

### 3. Configurar en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a **Settings** → **Environment Variables**
3. Agrega estas dos variables:

#### VAPID_PUBLIC_KEY
```
[Pega aquí la VAPID_PUBLIC_KEY generada]
```

**Ambientes**: Production, Preview, Development

#### VAPID_PRIVATE_KEY
```
[Pega aquí la VAPID_PRIVATE_KEY generada]
```

**Ambientes**: Production, Preview, Development  
⚠️ **IMPORTANTE**: Esta key es privada, nunca la expongas en el frontend

4. Haz clic en **"Save"**

### 4. Configurar en el Frontend

La `VAPID_PUBLIC_KEY` también debe estar disponible en el frontend. Ya está configurada en `js/inject-env-vars.js` para leerla de:
- `window.__VAPID_PUBLIC_KEY__`
- Variable de entorno `VAPID_PUBLIC_KEY`

**Para que funcione en el frontend**, también debes agregar `VAPID_PUBLIC_KEY` como variable de entorno en Vercel, y se inyectará automáticamente.

### 5. Verificar que funcione

1. Haz un deploy a Vercel
2. Abre tu sitio en el navegador
3. Abre la consola del navegador (F12)
4. Deberías ver:
   - `✅ Service Worker registrado`
   - `✅ Push subscription creada exitosamente`
   - `✅ Suscripción guardada en Supabase`

## 📚 Cómo Funciona el Sistema

### Flujo Completo:

1. **Usuario visita el sitio** → El Service Worker se registra
2. **Usuario permite notificaciones** → Se crea una suscripción push
3. **Suscripción se guarda** → Se almacena en `push_subscriptions` (Supabase)
4. **Servidor envía push** → Llama a `/api/enviar-push-notification`
5. **API procesa** → Busca suscripciones del usuario en Supabase
6. **web-push envía** → Usa VAPID keys para autenticarse
7. **Navegador recibe** → Service Worker muestra la notificación
8. **Notificación aparece** → Incluso si la página está cerrada

## 🔧 Endpoint de Push Notifications

El endpoint `/api/enviar-push-notification` acepta:

```json
{
  "user_id": "uuid-del-usuario",
  "titulo": "Título de la notificación",
  "mensaje": "Mensaje de la notificación",
  "icono": "/icons/icon-192x192.png",
  "url": "/ruta-a-abrir"
}
```

Respuesta exitosa:
```json
{
  "success": true,
  "enviadas": 2,
  "errores": 0,
  "total_suscripciones": 2
}
```

## ⚠️ Seguridad

- **VAPID_PRIVATE_KEY**: 
  - ⚠️ NUNCA debe estar en el frontend
  - ⚠️ NUNCA en repositorios públicos
  - ✅ Solo en variables de entorno de Vercel
  - ✅ Solo en el backend/API

- **VAPID_PUBLIC_KEY**: 
  - ✅ Es segura de exponer públicamente
  - ✅ Puede estar en el frontend
  - ✅ Se usa para crear suscripciones

## 🔄 Regenerar Keys

Si necesitas regenerar las keys (por seguridad o cambio de dominio):

```bash
node scripts/generar-vapid-keys.js
```

Luego actualiza las variables en Vercel con las nuevas keys.

**⚠️ Nota**: Si regeneras las keys, todos los usuarios deberán re-suscribirse a push notifications.

## ✅ Checklist de Verificación

- [ ] `web-push` instalado (`npm install web-push`)
- [ ] VAPID keys generadas (`node scripts/generar-vapid-keys.js`)
- [ ] `VAPID_PUBLIC_KEY` configurada en Vercel
- [ ] `VAPID_PRIVATE_KEY` configurada en Vercel
- [ ] Tabla `push_subscriptions` creada en Supabase
- [ ] Service Worker registrado correctamente
- [ ] Push subscription creada en el navegador
- [ ] Suscripción guardada en Supabase
- [ ] Endpoint `/api/enviar-push-notification` funciona

## 🐛 Troubleshooting

### "VAPID keys no configuradas"
- Verifica que las variables estén en Vercel
- Verifica que los nombres sean exactos: `VAPID_PUBLIC_KEY` y `VAPID_PRIVATE_KEY`
- Haz un nuevo deploy después de agregar las variables

### "Usuario no tiene suscripciones push activas"
- El usuario debe permitir notificaciones primero
- Verifica que el Service Worker esté registrado
- Verifica que la tabla `push_subscriptions` exista en Supabase

### "Error creando push subscription"
- Verifica que `VAPID_PUBLIC_KEY` esté disponible en el frontend
- Verifica que el formato de la key sea correcto (base64 URL-safe)
- Verifica que el Service Worker esté activo

### Notificaciones no aparecen
- Verifica permisos del navegador
- Verifica que el Service Worker esté registrado
- Verifica la consola del navegador para errores
- Verifica que el endpoint `/api/enviar-push-notification` esté funcionando

## 📖 Recursos

- [Web Push Protocol](https://web.dev/push-notifications-overview/)
- [VAPID Specification (RFC 8292)](https://tools.ietf.org/html/rfc8292)
- [web-push Library](https://github.com/web-push-libs/web-push)
