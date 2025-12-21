# 🎯 PLAN DE CONSOLIDACIÓN: 30 → 12 Funciones

## 📊 **ESTADO ACTUAL:**
- **Funciones actuales:** 30
- **Límite Hobby:** 12
- **Necesitamos eliminar:** 18 funciones

---

## ✅ **CONSOLIDACIONES PLANEADAS:**

### **1. Cumpleaños (4 → 1)** ✅ HECHO
- `cumpleanos-resumen.js` → `cumpleanos.js?action=resumen`
- `cumpleanos-interacciones.js` → `cumpleanos.js?action=interacciones`
- `cumpleaneros-compradores.js` → `cumpleanos.js?action=compradores`
- `compradores-cumple-consent.js` → `cumpleanos.js?action=consent`

### **2. Aniversarios (2 → 1)**
- `aniversarios-celebracion.js` → `aniversarios.js?action=celebracion`
- `aniversarios-configuracion.js` → `aniversarios.js?action=configuracion`

### **3. Comunidades API (9 → 1)**
- `caminando-juntos.js` → `comunidades-api.js?slug=caminando-juntos`
- `injusticias-vividas.js` → `comunidades-api.js?slug=injusticias-vividas`
- `espiritualidad-fe.js` → `comunidades-api.js?slug=espiritualidad-fe`
- `libertad-economica.js` → `comunidades-api.js?slug=libertad-economica`
- `sanando-abandonos.js` → `comunidades-api.js?slug=sanando-abandonos`
- `libertad-emocional.js` → `comunidades-api.js?slug=libertad-emocional`
- `desahogo-libre.js` → `comunidades-api.js?slug=desahogo-libre`
- `animales.js` → `comunidades-api.js?slug=animales`
- `maternidad.js` → `comunidades-api.js?slug=maternidad`

### **4. Jobs (3 → 1)**
- `jobs-calificaciones-empleados.js` → `jobs.js?action=calificaciones-empleados`
- `jobs-calificaciones.js` → `jobs.js?action=calificaciones`
- `jobs-verificacion-pago.js` → `jobs.js?action=verificacion-pago`

### **5. Mantenimiento (2 → 1)**
- `mantenimiento-estado.js` → `mantenimiento.js?action=estado`
- `mantenimiento-notificar.js` → `mantenimiento.js?action=notificar`

### **6. Admin (2 → 1)**
- `admin-tenants.js` → `admin.js?action=tenants`
- `admin-reportes.js` → `admin.js?action=reportes`

### **7. Reportes/Alertas (3 → 1)**
- `reportes-maltrato.js` → `reportes.js?type=maltrato`
- `alertas-servicios-enviar.js` → `reportes.js?type=alertas`
- `emergencias-enviar-emails.js` → `reportes.js?type=emergencias`

---

## 📋 **RESULTADO FINAL:**

### **Funciones que se mantienen (10):**
1. `webhook-mercadopago.js` (webhook específico)
2. `mercadopago-preference.js` (preferencia específica)
3. `historias-corazon.js` (historia específica)
4. `reportar-error.js` (error específico)
5. `cumpleanos.js` (consolidada - 4 funciones)
6. `aniversarios.js` (consolidada - 2 funciones)
7. `comunidades-api.js` (consolidada - 9 funciones)
8. `jobs.js` (consolidada - 3 funciones)
9. `mantenimiento.js` (consolidada - 2 funciones)
10. `admin.js` (consolidada - 2 funciones)
11. `reportes.js` (consolidada - 3 funciones)

**Total: 11 funciones** ✅ (dentro del límite de 12)

---

## ⚡ **PRÓXIMOS PASOS:**

1. ✅ Crear `api/cumpleanos.js` (HECHO)
2. Crear `api/aniversarios.js`
3. Crear `api/comunidades-api.js`
4. Crear `api/jobs.js`
5. Crear `api/mantenimiento.js`
6. Crear `api/admin.js`
7. Crear `api/reportes.js`
8. Actualizar `vercel.json` con los nuevos rewrites
9. Eliminar funciones antiguas
10. Probar que todo funciona

---

**💜 "Empezamos pocos, crecemos mucho"**





