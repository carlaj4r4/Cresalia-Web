# 🔧 Solución: Usuarios Vendedores sin Tienda

## ❌ Problema

Los usuarios vendedores aparecen en `auth.users` pero **NO** aparecen en la tabla `tiendas`.

**Ejemplo:**
```
| id                                   | email                          | tipo      |
| ------------------------------------ | ------------------------------ | --------- |
| 78936580-ac43-443f-8c95-c7133eeecfe9 | carla.crimi.95@gmail.com       | vendedor  |
```

Este usuario existe en `auth.users` pero **NO** tiene su registro en `tiendas`.

---

## 🔍 Causa

El **trigger SQL** `trigger_crear_perfil_tienda` no se ejecutó cuando se creó el usuario. Esto puede pasar si:
- El trigger no está configurado en Supabase
- El trigger falló silenciosamente
- El usuario se creó antes de configurar el trigger

---

## ✅ Soluciones

### **Opción 1: Crear Tiendas Manualmente con SQL (RECOMENDADO)**

Este script crea las tiendas faltantes para todos los usuarios vendedores existentes.

#### **Paso 1: Verificar usuarios sin tienda**

1. Ir a **Supabase Dashboard** → **SQL Editor**
2. Ejecutar este query para ver qué usuarios necesitan tienda:

```sql
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'tipo_usuario' as tipo_usuario,
    u.raw_user_meta_data->>'nombre_tienda' as nombre_tienda,
    u.raw_user_meta_data->>'plan' as plan
FROM auth.users u
LEFT JOIN public.tiendas t ON t.user_id = u.id
WHERE (u.raw_user_meta_data->>'tipo_usuario' IN ('vendedor', 'emprendedor') 
       OR u.raw_user_meta_data->>'nombre_tienda' IS NOT NULL)
  AND t.id IS NULL;
```

#### **Paso 2: Crear tiendas faltantes**

1. Abrir el archivo `CREAR-TIENDAS-FALTANTES.sql`
2. Copiar TODO el código
3. Pegar en **Supabase Dashboard** → **SQL Editor**
4. Click en **"Run"** (▶️)
5. Verificar que dice **"Success"**

El script:
- ✅ Busca usuarios vendedores sin tienda
- ✅ Crea registros en `tiendas` usando los datos de `user_metadata`
- ✅ Genera subdomain único automáticamente
- ✅ Maneja errores sin romper nada

#### **Paso 3: Verificar que se crearon**

```sql
SELECT 
    t.id,
    t.user_id,
    t.nombre_tienda,
    t.email,
    t.plan,
    t.subdomain,
    t.activa
FROM public.tiendas t
ORDER BY t.fecha_creacion DESC;
```

Deberías ver el nuevo registro para `carla.crimi.95@gmail.com`.

---

### **Opción 2: El Fallback Creará la Tienda al Hacer Login**

Si el usuario hace login, el código JavaScript tiene un **fallback** que crea la tienda automáticamente si no existe.

**Cómo funciona:**
1. Usuario hace login en `login-tienda.html`
2. El código llama a `obtenerDatosTienda(userId)`
3. Si no encuentra la tienda, intenta crearla desde `user_metadata`
4. Si tiene éxito, redirige a `admin-final.html`

**Para probar:**
1. Ir a `login-tienda.html`
2. Iniciar sesión con `carla.crimi.95@gmail.com`
3. Verificar en consola:
   - `⚠️ Tienda no encontrada, intentando crear desde metadata del usuario...`
   - `✅ Tienda creada exitosamente desde metadata`
4. Verificar en Supabase que apareció el registro en `tiendas`

---

### **Opción 3: Verificar y Configurar el Trigger SQL**

Si el trigger no está configurado, los **nuevos usuarios** tampoco tendrán tienda automáticamente.

#### **Paso 1: Verificar que el trigger existe**

```sql
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name LIKE '%crear_perfil%';
```

Deberías ver:
- `trigger_crear_perfil_comprador`
- `trigger_crear_perfil_tienda`

#### **Paso 2: Si no existe, crearlo**

1. Abrir `supabase-trigger-crear-perfiles.sql`
2. Copiar TODO el código
3. Pegar en **Supabase Dashboard** → **SQL Editor**
4. Click en **"Run"** (▶️)
5. Verificar que dice **"Success"**

---

## 📋 Checklist de Verificación

- [ ] Ejecutar `CREAR-TIENDAS-FALTANTES.sql` para crear tiendas faltantes
- [ ] Verificar en `tiendas` que apareció el registro
- [ ] Verificar que el trigger `trigger_crear_perfil_tienda` existe
- [ ] Probar login con el usuario vendedor
- [ ] Verificar que redirige a `admin-final.html` sin error 404
- [ ] Verificar que el panel de admin carga correctamente

---

## 🧪 Probar la Solución

### **Test 1: Verificar que la tienda se creó**

1. Ir a **Supabase Dashboard** → **Table Editor** → **tiendas**
2. Buscar por email: `carla.crimi.95@gmail.com`
3. Deberías ver el registro

### **Test 2: Probar login**

1. Ir a `login-tienda.html`
2. Iniciar sesión con `carla.crimi.95@gmail.com`
3. Verificar redirección a `admin-final.html`
4. Verificar que el panel carga correctamente

### **Test 3: Crear nueva tienda**

1. Ir a `registro-tienda.html`
2. Crear una nueva tienda
3. Verificar en Supabase que:
   - Aparece en `auth.users`
   - Aparece en `tiendas` (automáticamente por el trigger)

---

## 💡 Recomendación

**Ejecutar `CREAR-TIENDAS-FALTANTES.sql`** es la solución más rápida y segura para usuarios existentes. Luego, verificar que el trigger esté configurado para que los nuevos usuarios se creen automáticamente.

---

¿Querés que te guíe paso a paso para ejecutar el script SQL? 😊💜
