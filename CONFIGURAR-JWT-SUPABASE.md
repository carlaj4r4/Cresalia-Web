# ⏰ Configurar JWT Expiry en Supabase Dashboard

## 🎯 Problema

Las sesiones expiran muy rápido (usuarios se quejan).

**Causa**: JWT expiry configurado a 1 hora (3600 segundos) por defecto.

---

## ✅ Solución: Aumentar a 7 Días

### **PASO 1: Ir a Configuración de Auth**

1. Ir a: https://supabase.com/dashboard
2. Seleccionar proyecto **"Cresalia"** (tiendas)
3. Barra lateral → **Authentication** (🔐)
4. Click en **"Settings"**

---

### **PASO 2: Buscar JWT Settings**

Scroll hacia abajo hasta encontrar:
- **"JWT expiry limit"**
- O **"Session timeout"**
- O **"Token settings"**

---

### **PASO 3: Cambiar el Valor**

**Configuración ACTUAL** (probablemente):
```
3600 segundos (1 hora)
```

**Cambiar A**:
```
604800 segundos (7 días)
```

O elegir una opción del dropdown si hay opciones predefinidas:
- 1 hora
- 24 horas  
- **7 días** ← Seleccionar esta
- 30 días
- Personalizado

---

### **PASO 4: Guardar**

Click en botón **"Save"** o **"Update"**

---

## 🔄 Otros Ajustes Recomendados

### **Refresh Token Rotation**

- **Opción**: "Enable Refresh Token Rotation"
- **Estado**: ✅ **Enabled** (marcar como habilitado)

### **Refresh Token Reuse Interval**

- **Valor**: 10 segundos (por defecto está bien)

---

## ✅ Resultado

Después de este cambio:

| Antes | Ahora |
|-------|-------|
| Sesión expira en 1 hora | Sesión expira en 7 días |
| Usuario debe loguearse a diario | Usuario permanece logueado 1 semana |
| Token se renueva cada 59 min | Token se renueva cada 50 min (automático) |

---

## 🧪 Cómo Verificar

1. **Iniciar sesión** en el panel
2. **Cerrar pestaña** (NO logout)
3. **Volver al día siguiente**
4. **Abrir panel de nuevo**
5. **Verificar**: ¿Sigue logueado? ✅

O en Console (F12):
```javascript
// Ver cuándo expira el token
const session = await supabaseClient.auth.getSession();
const expiresAt = new Date(session.data.session.expires_at * 1000);
console.log('Token expira el:', expiresAt);
```

---

## 🔍 Si No Encuentras JWT Expiry

### **Alternativa 1: Buscar en la Configuración**

1. Authentication → Settings
2. Usar `Ctrl + F` en la página
3. Buscar: "JWT" o "expiry" o "timeout"

### **Alternativa 2: Ver Documentación**

https://supabase.com/docs/guides/auth/sessions/session-management

### **Alternativa 3: Contactar Soporte de Supabase**

Si no aparece la opción, puede ser que esté en:
- Project Settings → General → JWT Settings

---

## 💜 También Se Implementó

Además de aumentar el JWT expiry, se agregó:

1. ✅ Auto-renovación de token cada 50 minutos
2. ✅ Protección de localStorage
3. ✅ Monitoreo de cambios de sesión

Con AMBAS cosas (JWT expiry largo + auto-refresh), las sesiones durarán mucho más tiempo ✅

---

¿Ya encontraste la opción de JWT expiry en el Dashboard? 😊
