# 🔑 CONFIGURAR BREVO API KEY EN VERCEL

## ❌ Error Actual
```
❌ Error enviando email por Brevo: {"message":"Key not found","code":"unauthorized"}
```

Este error indica que la **API Key de Brevo** no está configurada correctamente en Vercel.

---

## 📋 PASO 1: Obtener tu API Key de Brevo

### 1.1. Iniciar sesión en Brevo
1. Ve a: **https://app.brevo.com/**
2. Iniciá sesión con tu cuenta de Brevo

### 1.2. Navegar a la sección de API Keys
1. En el menú lateral, buscá **"Settings"** (Configuración) o **"SMTP & API"**
2. Click en **"API Keys"** o **"SMTP & API"**

### 1.3. ¿Qué tipo de clave necesito?
⚠️ **IMPORTANTE:** Necesitás la **Clave API (MCP)**, NO la SMTP Key.

**Diferencia:**
- ❌ **SMTP Key**: Para envío por SMTP (protocolo tradicional) - **NO es la que necesitamos**
- ✅ **Clave API (MCP)**: Para REST API v3 - **ESTA es la que necesitamos**

El código usa la REST API v3 de Brevo (`https://api.brevo.com/v3/smtp/email`), por lo que necesitás una **API Key**, no una SMTP key.

### 1.4. Crear o copiar la Clave API (MCP)
1. Si no tenés una Clave API (MCP), creá una nueva:
   - Click en **"Generate a new API key"** o **"Create API Key"**
   - Seleccioná **"Clave API (MCP)"** o **"API Key (v3)"**
   - Dale un nombre descriptivo (ej: `Cresalia Production`)
   - Seleccioná los permisos necesarios:
     - ✅ **Send emails** (Enviar emails)
     - ✅ **Access account information** (Acceso a información de cuenta)
   - Click en **"Generate"** o **"Create"**

2. **Copiá la Clave API completa** (debe verse algo como: `xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxx`)
   - ⚠️ **IMPORTANTE:** La API Key solo se muestra **UNA VEZ** al crearla. Si no la copiaste, tendrás que crear una nueva.
3. **Guardala en un lugar seguro** (no la compartas públicamente)

---

## 📋 PASO 2: Configurar en Vercel

### 2.1. Acceder a Vercel Dashboard
1. Ve a: **https://vercel.com/dashboard**
2. Iniciá sesión con tu cuenta
3. Seleccioná tu proyecto: **Cresalia-Web**

### 2.2. Ir a Environment Variables
1. Click en **"Settings"** (Configuración)
2. En el menú lateral, click en **"Environment Variables"**

### 2.3. Agregar BREVO_API_KEY
1. En el campo **"Key"**, escribí: `BREVO_API_KEY`
2. En el campo **"Value"**, pegá tu API Key de Brevo (la que copiaste en el Paso 1.3)
3. **IMPORTANTE:** Seleccioná los **entornos** donde querés que esté disponible:
   - ✅ **Production** (Producción)
   - ✅ **Preview** (Preview/Staging)
   - ✅ **Development** (Desarrollo local, opcional)
4. Click en **"Save"**

### 2.4. Verificar que se guardó correctamente
- Deberías ver `BREVO_API_KEY` en la lista de variables de entorno
- El valor debería estar oculto (mostrando solo `••••••••`)

---

## 📋 PASO 3: Redesplegar la aplicación

⚠️ **CRÍTICO:** Después de agregar o modificar variables de entorno en Vercel, **DEBÉS redesplegar** la aplicación para que los cambios surtan efecto.

### Opción A: Redesplegar desde Vercel Dashboard
1. Ve a la pestaña **"Deployments"** en tu proyecto
2. Click en el menú de los 3 puntos (`⋯`) del último deployment
3. Click en **"Redeploy"**
4. Confirmá el redespliegue

### Opción B: Redesplegar desde Git
1. Hacé un commit vacío o un cambio menor:
   ```bash
   git commit --allow-empty -m "trigger: Redesplegar para aplicar BREVO_API_KEY"
   git push origin main
   ```
2. Vercel detectará el cambio y redesplegará automáticamente

---

## ✅ PASO 4: Verificar que funciona

### 4.1. Probar el endpoint
Después del redespliegue, probá enviar un email de prueba. El error debería desaparecer.

### 4.2. Revisar logs de Vercel
1. Ve a **"Deployments"** → Click en el último deployment
2. Click en **"Functions"** → Buscá `/api/enviar-email-brevo`
3. Revisá los logs para ver si hay errores

### 4.3. Verificar en la consola del navegador
Si el error persiste, revisá la consola del navegador (F12) para ver mensajes más detallados.

---

## 🔍 TROUBLESHOOTING

### ❌ Error: "Key not found" o "unauthorized"
**Causas posibles:**
1. ❌ La variable `BREVO_API_KEY` no está configurada en Vercel
2. ❌ La API Key tiene espacios al inicio o al final (copiá y pegá de nuevo)
3. ❌ La API Key está incompleta (verificá que esté completa)
4. ❌ No redesplegaste la aplicación después de agregar la variable
5. ❌ La API Key fue revocada o eliminada en Brevo

**Solución:**
1. Verificá que `BREVO_API_KEY` esté en Vercel (Settings → Environment Variables)
2. Verificá que el valor no tenga espacios
3. Verificá que la API Key esté activa en Brevo
4. Redesplegá la aplicación

---

### ❌ Error: "Invalid API key"
**Causa:** La API Key no es válida o no tiene los permisos necesarios.

**Solución:**
1. Verificá que la API Key tenga los permisos:
   - ✅ **Send emails**
   - ✅ **Access account information**
2. Si no tiene permisos, creá una nueva API Key con los permisos correctos
3. Actualizá la variable en Vercel y redesplegá

---

### ❌ Error: "Quota exceeded" o "Rate limit"
**Causa:** Has alcanzado el límite de emails de tu plan de Brevo.

**Solución:**
1. Verificá tu plan de Brevo (Free plan: 300 emails/día)
2. Esperá a que se reinicie el contador (diario)
3. Considerá actualizar tu plan si necesitás más emails

---

## 📝 VARIABLES DE ENTORNO RELACIONADAS

Además de `BREVO_API_KEY`, podés configurar estas variables opcionales:

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `BREVO_API_KEY` | **REQUERIDA** - API Key de Brevo | - |
| `ADMIN_EMAIL` | Email del administrador | `cresalia25@gmail.com` |
| `FROM_EMAIL` | Email desde el cual se envían los emails | `ADMIN_EMAIL` |
| `FROM_NAME` | Nombre que aparece como remitente | `Cresalia` |

---

## 🔐 SEGURIDAD

⚠️ **IMPORTANTE:**
- ❌ **NUNCA** expongas tu `BREVO_API_KEY` en el código del frontend
- ✅ La API Key solo debe estar en **variables de entorno de Vercel** (server-side)
- ✅ El endpoint `/api/enviar-email-brevo` es una **Serverless Function** (server-side)
- ✅ Si necesitás rotar la API Key, creá una nueva en Brevo y actualizá la variable en Vercel

---

## 📚 RECURSOS

- **Brevo Dashboard:** https://app.brevo.com/
- **Brevo API Documentation:** https://developers.brevo.com/
- **Vercel Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables

---

## ✅ CHECKLIST

Antes de considerar que está configurado correctamente:

- [ ] API Key creada en Brevo con permisos correctos
- [ ] API Key copiada correctamente (sin espacios)
- [ ] Variable `BREVO_API_KEY` agregada en Vercel
- [ ] Variable configurada para Production y Preview
- [ ] Aplicación redesplegada después de agregar la variable
- [ ] Error "Key not found" desapareció de los logs
- [ ] Emails se envían correctamente

---

Si seguís teniendo problemas después de seguir estos pasos, verificá:
1. Los logs de Vercel para ver el error exacto
2. Que la API Key esté activa en Brevo
3. Que el dominio desde el cual se envían emails esté verificado en Brevo (si es necesario)
