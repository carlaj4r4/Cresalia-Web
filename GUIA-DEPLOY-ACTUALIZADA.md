# 🚀 GUÍA DE DEPLOY ACTUALIZADA - CRESALIA

## ✅ **CHECKLIST PRE-DEPLOY**

### **1. Verificar Archivos Críticos:**
- ✅ `vercel.json` - Configurado
- ✅ `manifest.json` - Configurado (PWA)
- ✅ `.gitignore` - Configurado (protege credenciales)
- ✅ `index-cresalia.html` - Página principal
- ✅ Todas las comunidades en `/comunidades/`
- ✅ Sistema de tiendas en `/tiendas/`

### **2. Archivos de Configuración:**
- ⚠️ `config-supabase-seguro.js` - **NO debe subirse con credenciales reales**
- ⚠️ `config-privado.js` - **NO debe subirse**
- ✅ Usar variables de entorno en Vercel

---

## 📋 **PASO A PASO PARA DEPLOY**

### **PASO 1: Preparar el Repositorio**

```bash
# 1. Verificar que estás en la rama correcta
git branch

# 2. Verificar cambios pendientes
git status

# 3. Agregar todos los cambios
git add .

# 4. Hacer commit con mensaje descriptivo
git commit -m "✨ Actualización completa: sistema de distancias, aniversarios, foros y feedbacks en todas las comunidades"

# 5. Subir cambios a GitHub
git push origin main
```

---

### **PASO 2: Verificar en Vercel**

#### **2.1. Ir a Vercel Dashboard:**
1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión
3. Busca tu proyecto **Cresalia-Web**

#### **2.2. Verificar Configuración:**
- **Framework Preset:** Other
- **Root Directory:** `./`
- **Build Command:** (vacío o `echo 'Static site - no build needed'`)
- **Output Directory:** `./`
- **Install Command:** (vacío)

---

### **PASO 3: Configurar Variables de Entorno**

#### **En Vercel → Settings → Environment Variables:**

**🔐 SUPABASE (OBLIGATORIO):**
```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

**💳 MERCADO PAGO (si lo usas):**
```
MERCADOPAGO_PUBLIC_KEY=tu_public_key
MERCADOPAGO_ACCESS_TOKEN=tu_access_token
MERCADOPAGO_ENVIRONMENT=production
```

**🔑 OTRAS (opcionales):**
```
ADMIN_PASSWORD=tu_contraseña_segura
```

**⚠️ IMPORTANTE:**
- Marca todas como **"Production"**
- También marca para **"Preview"** y **"Development"** si quieres

---

### **PASO 4: Hacer Deploy**

#### **Opción A: Deploy Automático (Recomendado)**
1. Si tu repositorio está conectado a Vercel, cada `git push` hará deploy automático
2. Ve a **Deployments** en Vercel
3. Espera a que termine el build (1-2 minutos)
4. Verifica que el status sea **"Ready"**

#### **Opción B: Deploy Manual**
1. En Vercel Dashboard, haz clic en **"Deployments"**
2. Haz clic en **"..."** → **"Redeploy"**
3. Selecciona la última versión
4. Haz clic en **"Redeploy"**

---

### **PASO 5: Verificar el Deploy**

#### **5.1. Verificar URL de Producción:**
- Tu sitio estará en: `https://tu-proyecto.vercel.app`
- O en tu dominio personalizado si lo configuraste

#### **5.2. Probar Funcionalidades:**
- ✅ Página principal carga correctamente
- ✅ Comunidades funcionan
- ✅ Sistema de distancias funciona
- ✅ Aniversarios se muestran
- ✅ Foros y feedbacks funcionan
- ✅ Tiendas cargan correctamente

#### **5.3. Verificar en Móvil:**
- Abre el sitio en tu celular
- Verifica que el PWA funcione
- Prueba las notificaciones

---

## 🔧 **SOLUCIÓN DE PROBLEMAS COMUNES**

### **Problema 1: "Build Failed"**
**Solución:**
- Verifica que no haya errores de sintaxis en los archivos
- Revisa los logs en Vercel → Deployments → (tu deploy) → Build Logs

### **Problema 2: "404 en algunas páginas"**
**Solución:**
- Verifica que `vercel.json` tenga los rewrites correctos
- Asegúrate de que las rutas en `vercel.json` coincidan con tus archivos

### **Problema 3: "Supabase no funciona"**
**Solución:**
- Verifica que las variables de entorno estén configuradas
- Revisa que `config-supabase-seguro.js` use las variables de entorno
- Verifica que las claves sean correctas

### **Problema 4: "PWA no funciona"**
**Solución:**
- Verifica que `manifest.json` esté en la raíz
- Asegúrate de que los iconos existan en `/icons/`
- Verifica que el service worker esté configurado

---

## 📝 **NOTAS IMPORTANTES**

### **Seguridad:**
- ⚠️ **NUNCA** subas `config-supabase-seguro.js` con credenciales reales a GitHub
- ⚠️ **NUNCA** subas `config-privado.js` a GitHub
- ✅ Usa variables de entorno en Vercel para credenciales

### **Performance:**
- El sitio es estático, así que debería cargar rápido
- Las imágenes deberían estar optimizadas
- Los scripts deberían estar minificados (opcional)

### **Actualizaciones Futuras:**
- Cada vez que hagas `git push`, Vercel hará deploy automático
- Puedes ver el historial de deploys en Vercel Dashboard
- Puedes hacer rollback a versiones anteriores si algo falla

---

## 🎉 **¡LISTO!**

Una vez que el deploy esté completo:
1. Comparte la URL con tus usuarios
2. Verifica que todo funcione correctamente
3. Monitorea los logs por si hay errores
4. ¡Disfruta tu plataforma en producción! 🚀

---

## 📞 **SOPORTE**

Si tienes problemas:
1. Revisa los logs en Vercel
2. Verifica la consola del navegador (F12)
3. Revisa que todas las variables de entorno estén configuradas
4. Verifica que los archivos estén en las rutas correctas








