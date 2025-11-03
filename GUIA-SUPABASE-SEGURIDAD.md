# 🔒 GUÍA DE SEGURIDAD SUPABASE - CRESALIA

## ⚠️ PROBLEMA ACTUAL
Las claves de Supabase están **expuestas públicamente** en el código, causando 32 advertencias de seguridad.

## ✅ SOLUCIÓN SIN CREAR NUEVO PROYECTO

### **PASO 1: Cambiar Claves en Supabase Dashboard**

1. **Accede a tu dashboard**: https://app.supabase.com
2. **Selecciona "Cresalia Tiendas"**
3. **Ve a Settings → API**
4. **Haz clic en "Reset API Keys"**
5. **Copia las nuevas claves**

### **PASO 2: Actualizar Configuración**

Reemplaza en `auth/supabase-config.js`:

```javascript
// ANTES (INSEGURO):
anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// DESPUÉS (SEGURO):
anonKey: 'sb_publishable_m2TqrW1AqMOWIIyQM4oYkA_zeyAAhmR'
```

### **PASO 3: Habilitar RLS (Row Level Security)**

En Supabase Dashboard → Authentication → Policies:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can only see their own tienda" ON tiendas
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own productos" ON productos
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own servicios" ON servicios
    FOR ALL USING (auth.uid() = user_id);
```

### **PASO 4: Configurar Autenticación Segura**

En Supabase Dashboard → Authentication → Settings:

- ✅ **Email confirmations**: ON
- ✅ **Phone confirmations**: ON  
- ✅ **Password requirements**: Strong
- ✅ **Session timeout**: 24 hours
- ✅ **Rate limiting**: ON

### **PASO 5: Verificar Seguridad**

1. **Probar login** - Debe funcionar
2. **Intentar acceder a datos de otro usuario** - Debe fallar
3. **Verificar logs** - No debe haber accesos no autorizados

## 🚨 ACCIONES INMEDIATAS

1. **CAMBIAR CLAVES** en Supabase Dashboard
2. **ACTUALIZAR** `auth/supabase-config.js`
3. **HABILITAR RLS** en todas las tablas
4. **CONFIGURAR POLÍTICAS** de seguridad
5. **PROBAR** que todo funcione

## 📋 CHECKLIST DE SEGURIDAD

- [ ] Claves cambiadas en Supabase
- [ ] Archivo de configuración actualizado
- [ ] RLS habilitado en todas las tablas
- [ ] Políticas de seguridad configuradas
- [ ] Autenticación probada
- [ ] Acceso no autorizado bloqueado

## 🔍 VERIFICACIÓN

Para verificar que la seguridad funciona:

1. **Login funciona** ✅
2. **Solo ves tus datos** ✅
3. **No puedes acceder a datos de otros** ✅
4. **No hay advertencias de seguridad** ✅

---

**💡 IMPORTANTE**: No necesitas crear un nuevo proyecto. Solo cambiar las claves y habilitar RLS.
