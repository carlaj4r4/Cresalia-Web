# 🔧 QUÉ CAMBIAR EN SUPABASE

## 📋 **RESUMEN:**

En Supabase **NO necesitas cambiar nada**, solo necesitas **ejecutar los archivos SQL** que faltan y **verificar que la configuración esté correcta**.

---

## ✅ **LO QUE YA TIENES (NO CAMBIAR):**

### **1. Configuración de Supabase:**
Tu archivo `config-supabase-seguro.js` ya tiene:
- ✅ URL de tu proyecto: `https://zbomxayytvwjbdzbegcw.supabase.co`
- ✅ Clave anónima (pública): Ya configurada
- ⚠️ Clave de servicio: `REEMPLAZA_CON_TU_SERVICE_ROLE_KEY_LOCALMENTE`

**Esta clave de servicio NO es necesaria para la mayoría de funcionalidades**, solo para operaciones administrativas especiales.

---

## 🔍 **QUÉ VERIFICAR EN SUPABASE:**

### **1. Verificar que las tablas existan:**

En Supabase Dashboard → Table Editor, verifica que tengas estas tablas:

#### **Tablas del Chat Seguro (NUEVO):**
- ✅ `conversaciones_chat_seguro`
- ✅ `mensajes_chat_seguro`
- ✅ `grupos_chat_seguro`
- ✅ `miembros_grupos_chat`
- ✅ `reportes_chat_seguro`
- ✅ `bloqueos_chat_seguro`
- ✅ `verificaciones_chat_seguro`
- ✅ `moderacion_automatica_chat`

#### **Otras tablas importantes:**
- `comunidades` (para comunidades)
- `foro_mensajes` (para foros)
- `feedbacks_generales` (para feedbacks)
- `alertas_emergencia` (para alertas)
- `checkin_emergencias` (para check-in)
- `tiendas` (para el SaaS principal)
- `productos` (para productos)
- Y todas las demás que necesites

---

### **2. Verificar Row Level Security (RLS):**

En Supabase Dashboard → Authentication → Policies:

Verifica que las tablas importantes tengan RLS habilitado:
- ✅ `conversaciones_chat_seguro` - RLS habilitado
- ✅ `mensajes_chat_seguro` - RLS habilitado
- ✅ `reportes_chat_seguro` - RLS habilitado
- ✅ Y todas las demás tablas

---

### **3. Verificar Políticas de Seguridad:**

Las políticas deben estar configuradas para:
- ✅ Usuarios solo ven sus propios datos
- ✅ Moderadores pueden ver reportes
- ✅ Cualquiera puede crear reportes
- ✅ Solo usuarios autenticados pueden crear mensajes

---

## 📝 **ARCHIVOS SQL QUE DEBES EJECUTAR:**

### **Si falta el Chat Seguro:**
```sql
-- Ejecutar este archivo:
supabase-chat-seguro.sql
```

### **Si faltan otras funcionalidades:**
Revisa qué sistemas necesitas y ejecuta los SQL correspondientes:
- `supabase-comunidades-foro.sql` - Para comunidades
- `supabase-checkin-emergencias.sql` - Para check-in
- `supabase-alertas-emergencia-comunidades.sql` - Para alertas
- `supabase-feedbacks-comunidades.sql` - Para feedbacks
- Y otros según necesites

---

## 🔑 **CLAVE DE SERVICIO (OPCIONAL):**

### **¿Qué es la Service Role Key?**
Es una clave especial que permite hacer operaciones administrativas sin restricciones de RLS.

### **¿Cuándo la necesitas?**
- ✅ Para operaciones administrativas en el panel de moderación
- ✅ Para operaciones que requieren acceso a todos los datos
- ✅ Para funciones especiales del sistema

### **¿Cómo obtenerla?**
1. Ve a Supabase Dashboard
2. Settings → API
3. Copia la **"service_role" key** (⚠️ NO la anon key)
4. Reemplázala en `config-supabase-seguro.js`:
   ```javascript
   serviceRoleKey: 'TU_SERVICE_ROLE_KEY_AQUI'
   ```

### **⚠️ IMPORTANTE:**
- **NUNCA** subas esta clave a GitHub
- **NUNCA** la expongas en el frontend
- Solo úsala en el backend o en scripts locales

---

## ✅ **CHECKLIST DE VERIFICACIÓN:**

- [ ] Todas las tablas necesarias existen
- [ ] Row Level Security (RLS) habilitado en tablas importantes
- [ ] Políticas de seguridad configuradas
- [ ] Clave anónima configurada en `config-supabase-seguro.js`
- [ ] (Opcional) Clave de servicio configurada si la necesitas
- [ ] Todas las funciones SQL ejecutadas

---

## 🎯 **RESUMEN:**

**NO necesitas cambiar nada en Supabase**, solo:
1. ✅ Ejecutar los archivos SQL que faltan
2. ✅ Verificar que las tablas existan
3. ✅ Verificar que RLS esté habilitado
4. ✅ (Opcional) Configurar la Service Role Key si la necesitas

**Todo lo demás ya está configurado correctamente.**

---

**💜 Todo está listo - Crisla & Claude**

