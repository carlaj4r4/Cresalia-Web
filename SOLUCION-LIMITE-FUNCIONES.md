# 🚨 SOLUCIÓN: Límite de 12 Serverless Functions

## ⚠️ **PROBLEMA:**
- **Tienes:** 30 funciones serverless
- **Límite Hobby:** 12 funciones
- **Solución:** Consolidar funciones relacionadas

---

## 📊 **PLAN DE CONSOLIDACIÓN:**

### **GRUPO 1: Cumpleaños (4 → 1 función)**
- ✅ `cumpleanos-resumen.js`
- ✅ `cumpleanos-interacciones.js`
- ✅ `cumpleaneros-compradores.js`
- ✅ `compradores-cumple-consent.js`
- **→ Consolidar en:** `api/cumpleanos.js` (con query param `?action=resumen|interacciones|compradores|consent`)

### **GRUPO 2: Aniversarios (2 → 1 función)**
- ✅ `aniversarios-celebracion.js`
- ✅ `aniversarios-configuracion.js`
- **→ Consolidar en:** `api/aniversarios.js` (con query param `?action=celebracion|configuracion`)

### **GRUPO 3: Comunidades (9 → 1 función)**
- ✅ `caminando-juntos.js`
- ✅ `injusticias-vividas.js`
- ✅ `espiritualidad-fe.js`
- ✅ `libertad-economica.js`
- ✅ `sanando-abandonos.js`
- ✅ `libertad-emocional.js`
- ✅ `desahogo-libre.js`
- ✅ `animales.js`
- ✅ `maternidad.js`
- **→ Consolidar en:** `api/comunidades.js` (con query param `?slug=nombre-comunidad`)

### **GRUPO 4: Jobs (3 → 1 función)**
- ✅ `jobs-calificaciones-empleados.js`
- ✅ `jobs-calificaciones.js`
- ✅ `jobs-verificacion-pago.js`
- **→ Consolidar en:** `api/jobs.js` (con query param `?action=calificaciones|calificaciones-empleados|verificacion-pago`)

### **GRUPO 5: Mantenimiento (2 → 1 función)**
- ✅ `mantenimiento-estado.js`
- ✅ `mantenimiento-notificar.js`
- **→ Consolidar en:** `api/mantenimiento.js` (con query param `?action=estado|notificar`)

---

## 📋 **RESULTADO FINAL:**

**Antes:** 30 funciones
**Después:** ~12 funciones (dentro del límite)

### **Funciones que se mantienen:**
1. `webhook-mercadopago.js` (webhook específico)
2. `mercadopago-preference.js` (preferencia específica)
3. `reportes-maltrato.js` (reporte específico)
4. `alertas-servicios-enviar.js` (alerta específica)
5. `emergencias-enviar-emails.js` (emergencia específica)
6. `reportar-error.js` (error específico)
7. `admin-tenants.js` (admin específico)
8. `admin-reportes.js` (admin específico)
9. `historias-corazon.js` (historia específica)
10. `tasks/cumpleanos.js` (cron job, no cuenta como función)

### **Funciones consolidadas:**
11. `cumpleanos.js` (4 funciones → 1)
12. `aniversarios.js` (2 funciones → 1)
13. `comunidades.js` (9 funciones → 1)
14. `jobs.js` (3 funciones → 1)
15. `mantenimiento.js` (2 funciones → 1)

**Total:** 10 funciones + 5 consolidadas = **15 funciones** ❌

**Necesitamos consolidar más...**

---

## 🎯 **PLAN MEJORADO:**

### **Consolidar Admin (2 → 1)**
- `admin-tenants.js` + `admin-reportes.js` → `api/admin.js?action=tenants|reportes`

### **Consolidar Reportes/Alertas (3 → 1)**
- `reportes-maltrato.js` + `alertas-servicios-enviar.js` + `emergencias-enviar-emails.js` → `api/reportes.js?type=maltrato|alertas|emergencias`

**Total final:** ~10 funciones ✅

---

## ⚡ **IMPLEMENTACIÓN:**

Voy a crear las funciones consolidadas ahora.





