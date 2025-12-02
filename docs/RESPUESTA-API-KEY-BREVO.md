# 📧 Respuesta sobre API KEY de Brevo

**Fecha:** 2025-01-27

---

## ❓ **¿Tengo que colocar nuevamente la API KEY de Brevo en Vercel?**

### ✅ **Respuesta: NO, no es necesario**

Si ya configuraste la API KEY de Brevo en Vercel anteriormente, **no necesitas volver a colocarla**. Las variables de entorno en Vercel se mantienen hasta que las elimines manualmente.

---

## 🔍 **Cómo Verificar si Está Configurada**

1. Ir a Vercel Dashboard
2. Seleccionar tu proyecto `cresalia-web`
3. Ir a **Settings** → **Environment Variables**
4. Buscar `BREVO_API_KEY`
5. Si existe, ya está configurada ✅

---

## 🔧 **Cuándo SÍ Necesitarías Reconfigurarla**

Solo necesitarías reconfigurarla si:
- ❌ La eliminaste por error
- ❌ Cambiaste de cuenta de Brevo
- ❌ Generaste una nueva API KEY
- ❌ El proyecto de Vercel es nuevo

---

## 📝 **Cómo Agregarla (Solo si no está)**

Si no está configurada, agregarla así:

1. Ir a Vercel → Settings → Environment Variables
2. Hacer clic en **"Add New"**
3. Agregar:
   - **Name:** `BREVO_API_KEY`
   - **Value:** `tu_api_key_de_brevo`
   - **Environment:** Seleccionar todas (Production, Preview, Development)
4. Hacer clic en **"Save"**
5. Hacer un nuevo deploy para que tome efecto

---

## ✅ **Conclusión**

**No necesitas volver a colocar la API KEY** si ya la configuraste antes. Las variables de entorno en Vercel persisten entre deployments.

---

**Última actualización:** 2025-01-27  
**Mantenido por:** Equipo Cresalia 💜



