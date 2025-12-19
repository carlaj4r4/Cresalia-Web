# 🚨 Ayuda: Proyectos de Supabase "Borrados"

## ❌ Situación

Los dos proyectos de Supabase (Tiendas y Comunidades) aparecen como "no existen".

---

## 🔍 Verificación: ¿Realmente están borrados?

### **Paso 1: Verificar en Supabase Dashboard**

1. Ir a **https://app.supabase.com**
2. Iniciar sesión con tu cuenta
3. Verificar:
   - ¿Aparecen los proyectos pero están **pausados**?
   - ¿Aparecen pero con estado **"Inactive"**?
   - ¿Realmente no aparecen en la lista?

### **Paso 2: Verificar estado del proyecto**

Si los proyectos aparecen pero están pausados:

1. Click en el proyecto
2. Verificar el estado:
   - **"Paused"** → Se puede reactivar
   - **"Inactive"** → Puede estar inactivo por inactividad
   - **"Deleted"** → Realmente borrado

---

## 💡 Posibles Causas (NO relacionadas con el código)

### **1. Pausa automática por inactividad**

Supabase puede pausar proyectos gratuitos después de 7 días de inactividad.

**Solución:**
- Ir al dashboard
- Click en el proyecto pausado
- Click en **"Restore"** o **"Resume"**

### **2. Límite de proyectos alcanzado**

Si tienes el plan gratuito, puedes tener un límite de proyectos.

**Solución:**
- Verificar cuántos proyectos tienes
- Eliminar proyectos no usados si es necesario

### **3. Problema de facturación**

Si hay un problema con el método de pago (aunque sea gratis).

**Solución:**
- Verificar en **Settings** → **Billing**
- Verificar que no haya problemas

### **4. Cambio de cuenta**

Si cambiaste de cuenta de email o te logueaste con otra cuenta.

**Solución:**
- Verificar que estés logueado con la cuenta correcta
- Verificar el email asociado

---

## ✅ Solución: Recrear los Proyectos

Si realmente están borrados, puedes recrearlos:

### **Paso 1: Crear Proyecto "Tiendas"**

1. Ir a **https://app.supabase.com**
2. Click en **"New Project"**
3. Llenar:
   - **Name**: `Cresalia Tiendas` (o el nombre que tenías)
   - **Database Password**: (crear una nueva, guardarla)
   - **Region**: `South America (São Paulo)`
4. Click en **"Create new project"**
5. Esperar 2-3 minutos

### **Paso 2: Obtener Credenciales del Proyecto "Tiendas"**

1. En el proyecto, ir a **Settings** → **API**
2. Copiar:
   - **Project URL**: `https://xxxx.supabase.co`
   - **anon public key**: `eyJ...`
   - **service_role key**: (para Edge Functions)

### **Paso 3: Actualizar Configuración**

Actualizar `auth/supabase-config.js`:

```javascript
const SUPABASE_CONFIG = {
    proyectos: {
        tiendas: {
            url: 'https://TU-NUEVO-PROYECTO.supabase.co',
            anonKey: 'TU-NUEVA-ANON-KEY'
        },
        comunidades: {
            url: 'https://TU-NUEVO-PROYECTO-2.supabase.co',
            anonKey: 'TU-NUEVA-ANON-KEY-2'
        }
    }
};
```

### **Paso 4: Crear Proyecto "Comunidades"**

Repetir los pasos 1-3 para el segundo proyecto.

### **Paso 5: Ejecutar Scripts SQL**

Para cada proyecto, ejecutar en **SQL Editor**:

1. **Proyecto "Tiendas"**:
   - `CREAR-TABLA-TIENDAS-SUPABASE.sql`
   - `CREAR-TABLA-COMPRADORES-SUPABASE.sql`
   - `supabase-trigger-crear-perfiles.sql`
   - Otros scripts necesarios

2. **Proyecto "Comunidades"**:
   - `SUPABASE-ALERTAS-COMPLETO-AMBOS-PROYECTOS.sql`
   - `SUPABASE-MENSAJES-GLOBALES-FINAL.sql`
   - Otros scripts necesarios

---

## 🔐 Configurar Variables de Entorno en Vercel

Después de recrear los proyectos, actualizar en **Vercel**:

1. Ir a **Vercel Dashboard** → Tu proyecto → **Settings** → **Environment Variables**
2. Actualizar:
   - `SUPABASE_URL` (para Tiendas)
   - `SUPABASE_ANON_KEY` (para Tiendas)
   - `SUPABASE_SERVICE_ROLE_KEY` (para Tiendas)
   - Variables para Comunidades (si aplica)

---

## 📋 Checklist de Recuperación

- [ ] Verificar en Supabase Dashboard si los proyectos están pausados
- [ ] Si están pausados, reactivarlos
- [ ] Si están borrados, recrearlos
- [ ] Obtener nuevas credenciales (URL y keys)
- [ ] Actualizar `auth/supabase-config.js`
- [ ] Actualizar variables de entorno en Vercel
- [ ] Ejecutar scripts SQL necesarios
- [ ] Verificar que las tablas se crearon correctamente
- [ ] Probar login/registro

---

## 🆘 Contactar Soporte de Supabase

Si los proyectos realmente fueron borrados sin tu acción:

1. Ir a **https://supabase.com/support**
2. Explicar la situación
3. Proporcionar:
   - Email de la cuenta
   - Nombres de los proyectos
   - Fecha aproximada de cuando desaparecieron

**Supabase puede tener backups** y puede ayudar a recuperar los proyectos.

---

## ⚠️ Importante: Verificar el Código

**He verificado TODO el código y commits recientes:**

✅ **NO hay comandos SQL destructivos** (DROP DATABASE, DELETE PROJECT, etc.)  
✅ **NO hay código que borre proyectos**  
✅ **Solo hay modificaciones en JavaScript/HTML**  
✅ **Los scripts SQL son solo de creación** (CREATE TABLE, CREATE FUNCTION, etc.)

**Conclusión:** El código NO pudo haber borrado los proyectos. La causa debe ser externa (Supabase, facturación, inactividad, etc.).

---

## 💡 Recomendación Inmediata

1. **Verificar en Supabase Dashboard** si están pausados
2. **Si están pausados** → Reactivarlos
3. **Si están borrados** → Contactar soporte de Supabase primero
4. **Si no se pueden recuperar** → Recrear los proyectos siguiendo los pasos arriba

---

¿Querés que te ayude a verificar el estado de los proyectos o a recrearlos? 😊💜
