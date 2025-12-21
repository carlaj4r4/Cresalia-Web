# 🔧 Solución: Registro de Tiendas y Error 404

## ❌ Problemas Encontrados

1. **Usuarios se crean en `auth.users` pero NO en la tabla `tiendas`**
2. **Error 404 al iniciar sesión o entrar a "Mi Cuenta"**
3. **El trigger SQL no está creando los registros automáticamente**

---

## 🔍 Causa Raíz

### **Problema 1: Trigger SQL no funciona**

El trigger `trigger_crear_perfil_tienda` debería crear el registro en `tiendas` automáticamente cuando:
- Se crea un usuario con `tipo_usuario = 'vendedor'` o `'emprendedor'`
- O cuando el usuario tiene `nombre_tienda` en `user_metadata`

**Posibles causas:**
- El trigger no está configurado en Supabase
- El trigger está deshabilitado
- Hay un error en el trigger que no se está mostrando

### **Problema 2: Código del cliente falla por RLS**

Cuando el código intenta crear el registro desde el cliente:
- Si no hay sesión (requiere confirmación de email), retorna sin crear
- Si hay sesión pero RLS bloquea, falla silenciosamente

### **Problema 3: Login falla si no hay tienda**

Cuando el usuario hace login:
- `obtenerDatosTienda()` busca la tienda
- Si no existe, retorna `null`
- El login falla con error "Tu tienda no está activa"
- La redirección causa 404

---

## ✅ Soluciones Implementadas

### **1. Mejorar `obtenerDatosTienda()` con fallback**

**Antes:**
```javascript
async function obtenerDatosTienda(userId) {
    const { data, error } = await client
        .from('tiendas')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    if (error) return null;
    return data;
}
```

**Después:**
```javascript
async function obtenerDatosTienda(userId) {
    // Intentar obtener la tienda
    const { data, error } = await client
        .from('tiendas')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    // Si no existe, intentar crearla desde metadata
    if (error && error.code === 'PGRST116') {
        // Obtener datos del usuario
        const { data: { user } } = await client.auth.getUser();
        
        // Crear tienda desde metadata
        const { data: nuevaTienda } = await client
            .from('tiendas')
            .insert([{
                user_id: userId,
                nombre_tienda: user.user_metadata?.nombre_tienda || 'Mi Tienda',
                email: user.email,
                plan: user.user_metadata?.plan || 'basico',
                // ...
            }])
            .select()
            .single();
        
        return nuevaTienda;
    }
    
    return data;
}
```

### **2. Mejorar `loginCliente()` para crear tienda si no existe**

```javascript
// Si no hay tienda, intentar crearla desde metadata
if (!tienda) {
    const nombreTienda = data.user.user_metadata?.nombre_tienda || 'Mi Tienda';
    const plan = data.user.user_metadata?.plan || 'basico';
    
    // Crear tienda
    const { data: nuevaTienda } = await supabase
        .from('tiendas')
        .insert([{
            user_id: data.user.id,
            nombre_tienda: nombreTienda,
            email: data.user.email,
            plan: plan,
            // ...
        }])
        .select()
        .single();
    
    tienda = nuevaTienda;
}
```

### **3. Corregir redirección en `login-tienda.html`**

**Antes:**
```javascript
window.location.replace('tiendas/ejemplo-tienda/admin.html');
```

**Después:**
```javascript
window.location.replace('tiendas/ejemplo-tienda/admin-final.html');
```

### **4. Mejorar `verificarAccesoAdmin()` con fallback**

Similar a `loginCliente()`, ahora intenta crear la tienda si no existe.

---

## 📋 Verificar Trigger SQL en Supabase

### **Paso 1: Verificar que el trigger existe**

1. Ir a **Supabase Dashboard** → **SQL Editor**
2. Ejecutar:
```sql
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name LIKE '%crear_perfil%';
```

3. Deberías ver:
   - `trigger_crear_perfil_comprador`
   - `trigger_crear_perfil_tienda`

### **Paso 2: Si no existe, crear el trigger**

1. Ir a **Supabase Dashboard** → **SQL Editor**
2. Abrir el archivo `supabase-trigger-crear-perfiles.sql`
3. Copiar TODO el código
4. Pegar en SQL Editor
5. Click en **"Run"** (▶️)
6. Verificar que dice **"Success"**

### **Paso 3: Probar el trigger**

1. Crear un nuevo usuario vendedor desde `registro-tienda.html`
2. Verificar en **Supabase Dashboard** → **Table Editor** → **tiendas**
3. Deberías ver el nuevo registro

---

## 🧪 Cómo Verificar las Correcciones

### **Test 1: Registro de nueva tienda**

1. Ir a `registro-tienda.html`
2. Completar el formulario
3. Click en "Crear Tienda"
4. Verificar en consola:
   - ✅ `✅ Usuario creado en Auth: [id]`
   - ✅ `✅ Perfil de tienda creado inmediatamente` (si hay sesión)
   - O: `⚠️ No hay sesión inmediata` (normal si requiere confirmación)
5. Verificar en Supabase:
   - **Table Editor** → **tiendas** → Debería aparecer el registro

### **Test 2: Login después de registro**

1. Confirmar email (si es necesario)
2. Ir a `login-tienda.html`
3. Iniciar sesión
4. Verificar en consola:
   - ✅ `✅ Login exitoso`
   - ✅ `✅ Tienda creada exitosamente después del login` (si no existía)
5. Verificar redirección:
   - Debe ir a `tiendas/ejemplo-tienda/admin-final.html`
   - NO debe aparecer error 404

### **Test 3: Verificar trigger SQL**

1. Crear un usuario manualmente en Supabase:
```sql
INSERT INTO auth.users (email, encrypted_password, raw_user_meta_data)
VALUES (
    'test@ejemplo.com',
    crypt('password123', gen_salt('bf')),
    '{"tipo_usuario": "vendedor", "nombre_tienda": "Tienda Test", "plan": "basico"}'::jsonb
);
```

2. Verificar en **Table Editor** → **tiendas**
3. Debería aparecer automáticamente el registro

---

## 🚨 Si el Trigger No Funciona

### **Opción 1: Verificar logs del trigger**

1. Ir a **Supabase Dashboard** → **Logs** → **Postgres Logs**
2. Buscar errores relacionados con `crear_perfil_tienda`
3. Si hay errores, corregirlos

### **Opción 2: Ejecutar función manualmente**

```sql
-- Obtener el ID del usuario
SELECT id FROM auth.users WHERE email = 'tu-email@ejemplo.com';

-- Ejecutar la función manualmente
SELECT crear_perfil_tienda();
```

### **Opción 3: Crear registro manualmente**

Si el trigger no funciona, crear el registro manualmente:

```sql
INSERT INTO public.tiendas (user_id, nombre_tienda, email, plan, subdomain, activa, fecha_creacion)
VALUES (
    'USER_ID_AQUI',
    'Nombre de la Tienda',
    'email@ejemplo.com',
    'basico',
    'nombre-tienda',
    true,
    NOW()
);
```

---

## 📋 Checklist de Verificación

- [ ] Trigger SQL está configurado en Supabase
- [ ] `obtenerDatosTienda()` tiene fallback para crear tienda
- [ ] `loginCliente()` crea tienda si no existe
- [ ] `verificarAccesoAdmin()` crea tienda si no existe
- [ ] Redirección usa `admin-final.html` (no `admin.html`)
- [ ] No hay errores 404 al iniciar sesión
- [ ] Los registros aparecen en la tabla `tiendas`

---

## 💡 Recomendación

**El trigger SQL es la solución ideal**, pero el código ahora tiene **fallbacks** para crear la tienda si el trigger no funciona. Esto asegura que:

1. ✅ Si el trigger funciona → Todo automático
2. ✅ Si el trigger no funciona → El código crea la tienda al hacer login
3. ✅ No hay errores 404 → La redirección es correcta

---

¿Probamos crear una tienda nueva para verificar que funciona? 😊💜

