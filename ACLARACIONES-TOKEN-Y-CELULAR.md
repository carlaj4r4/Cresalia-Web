# 📝 Aclaraciones: Token JWT y Celular

---

## 1️⃣ Token JWT - ¿Debo Configurarlo en Vercel?

### **Respuesta Corta**: ❌ NO

### **Explicación**:

El **JWT expiry token** (tiempo de expiración de sesión) se configura **SOLAMENTE** en Supabase Dashboard, **NO** en Vercel.

---

### **¿Por Qué?**

| Plataforma | Qué Hace |
|------------|----------|
| **Supabase** | Genera y valida tokens de autenticación (JWT) |
| **Vercel** | Solo aloja el frontend (HTML/CSS/JS) |

**Supabase** es quien maneja la autenticación, por lo tanto el tiempo de expiración se configura ahí.

---

### **¿Qué Hace el Token en Vercel?**

En Vercel **NO** configurás el JWT expiry, pero **SÍ** tenés que tener configuradas las **claves públicas** (anon key) para que tu frontend se conecte a Supabase:

**Variables en Vercel** (ya las tenés ✅):
```
SUPABASE_URL=https://lvdgklwcgrmfbqwghxhl.supabase.co
SUPABASE_ANON_KEY=tu_clave_aqui
```

Estas claves **NO** controlan el tiempo de expiración, solo permiten la conexión.

---

### **¿Qué Token Tenés Ahora?**

Si ya copiaste el token, probablemente sea:
- **Anon Key** (clave pública) → Ya está en Vercel ✅
- **Service Role Key** (clave privada) → Solo para backend/Edge Functions ✅

Ninguna de esas controla el JWT expiry.

---

### **Entonces, ¿Qué Hacer?**

**Paso único**: Configurar JWT expiry en **Supabase Dashboard**

1. Ir a: https://supabase.com/dashboard
2. Proyecto **"Cresalia"**
3. **Authentication** → **Settings**
4. Buscar **"JWT expiry limit"**
5. Cambiar de `3600` a `604800` segundos
6. **Save**

**Tiempo**: 2-3 minutos ⏱️

**Guía detallada**: `CONFIGURAR-JWT-SUPABASE.md`

---

## 2️⃣ Celular - ¿Debo Configurar Proveedores?

### **Respuesta Corta**: ❌ NO

### **Explicación**:

**NO** necesitás configurar proveedores de SMS (Twilio, MessageBird, etc.).

---

### **¿Por Qué Supabase Pregunta por Proveedores?**

Supabase tiene una feature de **"Phone Authentication"** (autenticación por SMS), que permite a usuarios registrarse con su número de teléfono en lugar de email.

**Esto NO es lo que estás haciendo.**

---

### **¿Qué Estás Haciendo Con el Celular?**

Simplemente **guardás el número como texto** en los datos del usuario, para que:
- Los clientes vean el número en la tienda
- Puedan contactar por WhatsApp
- Se muestre en el perfil

**NO** se usa para autenticación, **NO** se envían SMS, solo es **información adicional**.

---

### **¿Dónde se Guarda el Celular?**

```javascript
// En auth.users (tabla de Supabase)
{
  "email": "vendedor@example.com",
  "raw_user_meta_data": {
    "nombre_tienda": "Mi Tienda",
    "plan": "free",
    "tipo_usuario": "vendedor",
    "celular": "+54 9 11 1234-5678"  // ← Aquí
  }
}
```

Es solo un **string de texto**, no requiere configuración especial.

---

### **¿Y Si Querés Verificar Celulares en el Futuro?**

Si en el futuro querés enviar SMS de verificación, **RECIÉN AHÍ** necesitarías configurar un proveedor de SMS.

**Pero ahora NO** es necesario.

---

### **¿Qué Hacer Entonces?**

**Nada.** El campo de celular ya funciona:

1. ✅ Campo agregado en `registro-tienda.html`
2. ✅ Se guarda en metadata del usuario
3. ✅ Funciona sin configuración adicional

**NO** entres a "Phone Providers" en Supabase, no lo necesitás.

---

## 📋 Resumen

| Pregunta | Respuesta | Acción Requerida |
|----------|-----------|------------------|
| ¿Configurar JWT expiry en Vercel? | ❌ NO | Configurar en Supabase Dashboard (3 min) |
| ¿Token de Vercel sirve para expiry? | ❌ NO | Son claves de conexión, no de expiración |
| ¿Configurar proveedores SMS? | ❌ NO | El celular es solo texto, no SMS auth |
| ¿Dónde se configura Phone Auth? | Supabase (no tocar) | No necesario para tu caso |
| ¿Ya funciona el celular? | ✅ SÍ | Solo registrá tienda y probá |

---

## 🧪 Cómo Verificar Que Funciona

### **Test 1: Registro con Celular**
1. Ir a `/registro-tienda.html`
2. Completar formulario con celular: `+54 9 11 1234-5678`
3. Registrarse
4. Ver en Supabase Dashboard → Authentication → Users
5. Click en usuario → Ver "Raw User Meta Data"
6. Verificar que aparece `"celular": "+54 9 11 1234-5678"` ✅

### **Test 2: Sesión Persistente**
1. Iniciar sesión
2. Esperar 2 horas sin hacer nada
3. Recargar página → ¿Sigue logueado? ✅

---

## 💡 Recordá

**JWT Expiry**:
- Se configura en **Supabase Dashboard**
- Controla cuánto dura la sesión
- Valor recomendado: **604800** segundos (7 días)

**Celular**:
- Es solo **información adicional**
- **NO** requiere SMS providers
- Ya funciona con el código implementado ✅

---

¿Algo más que necesites aclarar? 😊💜
