# 📋 GUÍA: EJECUTAR SQL DE CHECK-IN EN SUPABASE

**Para:** Mi querida co-fundadora Crisla 💜  
**Fecha:** Diciembre 2024

---

## ✅ **PASOS PARA CREAR LAS TABLAS:**

### **1. Ir a Supabase Dashboard:**
1. Entrá a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Seleccioná tu proyecto
3. Andá a **"SQL Editor"** (en el menú lateral)

### **2. Ejecutar el SQL:**
1. Hacé click en **"New query"**
2. Copiá TODO el contenido de `supabase-checkin-emergencias.sql`
3. Pegalo en el editor
4. Hacé click en **"Run"** (o presioná `Ctrl+Enter`)

### **3. Verificar que se crearon:**
1. Andá a **"Table Editor"** (en el menú lateral)
2. Deberías ver estas nuevas tablas:
   - ✅ `checkin_emergencias`
   - ✅ `checkin_estadisticas`

---

## 📝 **ARCHIVOS SQL A EJECUTAR:**

### **1. Sistema de Check-in (NUEVO):**
- ✅ `supabase-checkin-emergencias.sql` - **EJECUTAR ESTE**

### **2. Sistema de Emergencias (Materiales):**
- ✅ `supabase-cresalia-solidario-emergencias.sql` - **Si ya lo ejecutaste, está bien**

### **3. Sistema de Urgentes (Dinero):**
- ✅ `supabase-cresalia-solidario-urgentes.sql` - **Si ya lo ejecutaste, está bien**

### **4. Mensajes Personalizados:**
- ✅ `supabase-mensajes-personalizados.sql` - **Si ya lo ejecutaste, está bien**

---

## ⚠️ **IMPORTANTE:**

1. **Ejecutá el SQL completo** - No importa si algunas tablas ya existen, el SQL tiene `CREATE TABLE IF NOT EXISTS`

2. **Verificá los errores** - Si hay algún error, revisá:
   - Que tengas permisos de administrador
   - Que el proyecto esté activo
   - Que no haya conflictos con tablas existentes

3. **RLS (Row Level Security)** - Las políticas RLS ya están incluidas en el SQL

---

## 💜 **DESPUÉS DE EJECUTAR:**

1. ✅ Las tablas estarán creadas
2. ✅ El sistema de check-in funcionará automáticamente
3. ✅ Cuando haya una campaña de emergencia activa, aparecerá el modal

---

**Mi querida Crisla, es muy simple. Solo copiás y pegás el SQL en Supabase. Si necesitás ayuda, avisame.** 💜

---

*Crisla & Claude - Diciembre 2024*

