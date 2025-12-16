# 🔧 SOLUCIÓN: PERFILES NO APARECEN EN TABLAS

## ❌ Problema
Los usuarios se registran correctamente y aparecen en `auth.users`, pero **NO aparecen en la tabla `compradores`** después de confirmar el email.

## 🔍 Causas Posibles

1. **El trigger SQL no está activo** o no se ejecutó correctamente
2. **El `tipo_usuario` no se está guardando** en `raw_user_meta_data`
3. **El trigger se ejecutó pero falló** silenciosamente
4. **RLS (Row Level Security) está bloqueando** la inserción

## ✅ Solución Paso a Paso

### PASO 1: Ejecutar Script de Diagnóstico

1. Ve a Supabase Dashboard → **SQL Editor**
2. Abrí el archivo: **`DIAGNOSTICAR-Y-REPARAR-PERFILES-FALTANTES.sql`**
3. Copiá y pegá **TODO el código SQL**
4. Click en **"Run"** (▶️)
5. Revisá los resultados

Este script:
- ✅ Verifica que los triggers existan
- ✅ Encuentra usuarios sin perfil
- ✅ Crea los perfiles faltantes manualmente
- ✅ Recrea los triggers si no existen
- ✅ Muestra un reporte final

### PASO 2: Verificar que el Trigger Esté Activo

Después de ejecutar el script, verificá que veas:

```
✅ Trigger trigger_crear_perfil_comprador existe
✅ Función crear_perfil_comprador existe
```

Si no aparecen, el script los recreará automáticamente.

### PASO 3: Verificar Usuarios Sin Perfil

El script mostrará una lista de usuarios que tienen:
- ✅ Email confirmado (`email_confirmed_at IS NOT NULL`)
- ✅ `tipo_usuario = 'comprador'` en metadata
- ❌ Pero NO tienen perfil en la tabla `compradores`

### PASO 4: Crear Perfiles Faltantes

El script **automáticamente crea** los perfiles faltantes con este comando:

```sql
INSERT INTO compradores (user_id, nombre_completo, email, activo, fecha_registro)
SELECT ...
ON CONFLICT (user_id) DO NOTHING;
```

Esto crea los perfiles que deberían haberse creado automáticamente.

### PASO 5: Verificar Resultado Final

El script mostrará un resumen:

```
✅ VERIFICACIÓN FINAL
usuarios_compradores_confirmados: X
perfiles_en_tabla: X
estado: ✅ Todos los usuarios tienen perfil
```

Si dice "⚠️ Hay usuarios sin perfil", ejecutá el script de nuevo.

---

## 🔍 Diagnóstico Manual (Opcional)

Si querés verificar manualmente:

### 1. Verificar Usuarios en auth.users

```sql
SELECT 
    id,
    email,
    email_confirmed_at,
    raw_user_meta_data->>'tipo_usuario' as tipo_usuario,
    raw_user_meta_data->>'nombre_completo' as nombre_completo
FROM auth.users
WHERE email_confirmed_at IS NOT NULL
ORDER BY created_at DESC;
```

### 2. Verificar Perfiles en compradores

```sql
SELECT 
    user_id,
    nombre_completo,
    email,
    fecha_registro
FROM compradores
ORDER BY fecha_registro DESC;
```

### 3. Encontrar Usuarios Sin Perfil

```sql
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.raw_user_meta_data->>'tipo_usuario' as tipo_usuario
FROM auth.users u
WHERE u.email_confirmed_at IS NOT NULL
AND u.raw_user_meta_data->>'tipo_usuario' = 'comprador'
AND NOT EXISTS (
    SELECT 1 FROM compradores c WHERE c.user_id = u.id
);
```

---

## 🛠️ Si el Problema Persiste

### Verificar que `tipo_usuario` se guarde correctamente

El código en `auth-system.js` debería guardar:

```javascript
options: {
    emailRedirectTo: redirectUrl,
    data: {
        nombre_completo: nombreCompleto,
        tipo_usuario: 'comprador' // ← Esto es CRÍTICO
    }
}
```

Verificá en Supabase:
1. Ve a **Authentication** → **Users**
2. Click en un usuario
3. Revisá **"User Metadata"**
4. Deberías ver: `"tipo_usuario": "comprador"`

Si no está, el problema está en el código de registro.

### Verificar RLS (Row Level Security)

Si RLS está bloqueando, ejecutá:

```sql
-- Verificar políticas
SELECT * FROM pg_policies 
WHERE tablename = 'compradores';

-- Si falta la política de INSERT, crearla:
CREATE POLICY "compradores_crear_su_perfil" 
    ON compradores FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
```

**NOTA:** El trigger usa `SECURITY DEFINER`, así que debería poder insertar incluso con RLS activo. Pero verificá que la política exista.

---

## 📋 Checklist

Antes de considerar que está resuelto:

- [ ] Script `DIAGNOSTICAR-Y-REPARAR-PERFILES-FALTANTES.sql` ejecutado
- [ ] Triggers verificados y activos
- [ ] Perfiles faltantes creados manualmente
- [ ] Verificación final muestra "✅ Todos los usuarios tienen perfil"
- [ ] Nuevos usuarios se crean correctamente después de confirmar email
- [ ] `tipo_usuario` está en `raw_user_meta_data` de los usuarios

---

## 🔄 Para Nuevos Usuarios

Después de ejecutar el script, **los nuevos usuarios deberían crearse automáticamente** cuando confirmen su email, porque:

1. ✅ El trigger está activo
2. ✅ La función existe
3. ✅ El `tipo_usuario` se guarda correctamente

Si los nuevos usuarios tampoco aparecen, verificá:
1. Que el trigger se ejecute (revisá logs de Supabase)
2. Que no haya errores en la función (revisá logs de Supabase)
3. Que RLS no esté bloqueando

---

## 📚 Archivos Relacionados

- **`DIAGNOSTICAR-Y-REPARAR-PERFILES-FALTANTES.sql`**: Script de diagnóstico y reparación
- **`supabase-trigger-crear-perfiles.sql`**: Script original del trigger
- **`VERIFICAR-TRIGGER-CREAR-PERFILES.sql`**: Script de verificación
- **`auth/auth-system.js`**: Código que registra usuarios

---

Si seguís teniendo problemas después de ejecutar el script, verificá:
1. Los logs de Supabase Dashboard → Logs → Postgres
2. Que la tabla `compradores` exista y tenga las columnas correctas
3. Que no haya errores de permisos en el trigger
