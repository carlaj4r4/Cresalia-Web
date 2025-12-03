# 🔧 SOLUCIÓN: PREVIEW TIENE CAMBIOS, PRODUCTION NO

## ⚠️ **PROBLEMA:**
- ✅ **Preview:** `https://cresalia-web-carlaj4r4s-projects.vercel.app` - Tiene los cambios nuevos
- ❌ **Production:** `https://cresalia-web.vercel.app` - No tiene los cambios

---

## 🎯 **SOLUCIÓN: PROMOVER PREVIEW A PRODUCTION**

### **Opción 1: Promover desde Vercel Dashboard (MÁS RÁPIDO)**

1. **Ve a Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Abre el proyecto **"cresalia-web"**

2. **Ve a la pestaña "Deployments":**
   - Deberías ver una lista de deploys
   - Busca el deploy que tiene los cambios (el más reciente con status "Ready")

3. **Promover a Production:**
   - Haz clic en los **"..."** (tres puntos) del deploy con los cambios
   - Selecciona **"Promote to Production"**
   - Confirma

4. **Verificar:**
   - Espera 1-2 minutos
   - Visita `https://cresalia-web.vercel.app/index-cresalia.html`
   - Deberías ver los cambios

---

### **Opción 2: Redeploy de Production**

Si no puedes promover, haz un redeploy:

1. **Ve a Vercel Dashboard → Deployments**
2. **Busca el deploy de Production** (el que está marcado como "Production")
3. **Haz clic en "..." → "Redeploy"**
4. **Confirma**
5. **Espera** a que termine (1-2 minutos)

---

### **Opción 3: Deploy Manual desde CLI**

```bash
# 1. Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# 2. Iniciar sesión
vercel login

# 3. Hacer deploy de producción
vercel --prod
```

---

## 🔍 **VERIFICAR DIFERENCIAS**

### **Cambios que deberían aparecer en Production:**

1. ✅ **Favicon corregido** (rutas absolutas)
2. ✅ **Logo completo** (no solo "C")
3. ✅ **Sistema de notificaciones push** (diálogo después de 3 segundos)
4. ✅ **Widget Brevo con logo** personalizado
5. ✅ **CSP actualizado** para Brevo
6. ✅ **Manifest PWA** actualizado con iconos SVG

---

## 📋 **CHECKLIST:**

- [ ] Identifiqué el deploy con los cambios (preview)
- [ ] Promoví el preview a production
- [ ] O hice redeploy de production
- [ ] Verifiqué que `https://cresalia-web.vercel.app` tenga los cambios
- [ ] Limpié cache del navegador (`Ctrl + Shift + R`)

---

## 🆘 **SI NO PUEDES PROMOVER:**

### **Verificar Configuración de Production:**

1. **Ve a Settings → Git**
2. **Verifica que la branch de Production sea "main"**
3. **Si no, cámbiala a "main"**

### **Forzar Deploy de Production:**

1. **Haz un commit vacío:**
   ```bash
   git commit --allow-empty -m "🚀 Forzar deploy production"
   git push origin main
   ```

2. **Esto debería activar un nuevo deploy de production**

---

## 💡 **POR QUÉ PASA ESTO:**

- **Preview deploys:** Se crean automáticamente con cada push
- **Production deploys:** Solo se actualizan cuando:
  - Promueves un preview manualmente
  - Haces push a la branch de production (si está configurada)
  - Haces redeploy manual

**Solución:** Promover el preview o hacer redeploy de production.

---

**💜 "Empezamos pocos, crecemos mucho"**

