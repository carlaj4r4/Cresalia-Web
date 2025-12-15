# 🔧 Solución: Error "Tabla no encontrada" al Registrar Comprador

## 🚨 El Problema

Cuando intentás registrar un comprador, aparece este error:
```
Error: Tabla no encontrada (PGRST205)
Error de conexión con la base de datos
```

## ✅ La Solución (MUY FÁCIL)

### Opción 1: Crear solo la tabla de compradores

#### Paso 1: Abrí Supabase
1. Andá a https://supabase.com
2. Iniciá sesión
3. Seleccioná tu proyecto de Cresalia

#### Paso 2: Abrí el SQL Editor
1. En el menú lateral izquierdo, click en **"SQL Editor"**
2. Click en **"New query"** (Nueva consulta)

#### Paso 3: Ejecutá el Script
1. Abrí el archivo `CREAR-TABLA-COMPRADORES-SUPABASE.sql` en este proyecto
2. **Copiá TODO** el contenido
3. **Pegalo** en el SQL Editor de Supabase
4. Click en **"Run"** (▶️) o presioná `Ctrl + Enter`
5. Esperá a que termine (debería decir "Success" en verde)

### Opción 2: Crear todas las tablas de una vez (RECOMENDADO)

Si también necesitás crear la tabla de tiendas, es mejor ejecutar el script completo:

1. Abrí el archivo `CREAR-TABLAS-COMPLETAS-SUPABASE.sql`
2. **Copiá TODO** el contenido
3. **Pegalo** en el SQL Editor de Supabase
4. Click en **"Run"** (▶️)
5. Esto creará **ambas tablas** (compradores y tiendas) de una vez

### Paso 4: Verificá que Funcionó
1. En Supabase, andá a **"Table Editor"** (Editor de Tablas)
2. Deberías ver la tabla **"compradores"** en la lista
3. Si la ves, ¡listo! 🎉

### Paso 5: Intentá Registrar de Nuevo
1. Volvé a la página de registro
2. **Recargá la página** (F5)
3. Intentá registrar tu comprador de nuevo
4. Debería funcionar ahora ✅

---

## ❓ ¿Por qué pasó esto?

La tabla `compradores` es necesaria para guardar la información de los compradores en Supabase. Si no existe, el sistema no puede guardar los registros.

**Es normal** que esto pase la primera vez que configurás Supabase. Solo necesitás ejecutar el script SQL una vez.

---

## 🆘 Si Sigue Sin Funcionar

### Verificá que:
1. ✅ Estás en el proyecto correcto de Supabase
2. ✅ El script SQL se ejecutó sin errores
3. ✅ La tabla "compradores" aparece en "Table Editor"
4. ✅ Recargaste la página después de crear la tabla

### Si aún no funciona:
1. Abrí la consola del navegador (F12)
2. Andá a la pestaña "Console"
3. Buscá mensajes de error
4. Copiá los mensajes y contactá a soporte

---

## 📋 Scripts SQL Disponibles

### Scripts Individuales:
- **`CREAR-TABLA-COMPRADORES-SUPABASE.sql`** - Solo crea la tabla de compradores
- **`CREAR-TABLA-TIENDAS-SUPABASE.sql`** - Solo crea la tabla de tiendas

### Script Completo:
- **`CREAR-TABLAS-COMPLETAS-SUPABASE.sql`** - Crea ambas tablas de una vez (RECOMENDADO)

**Todos los scripts se pueden ejecutar múltiples veces** sin problemas. Usan `IF NOT EXISTS` para evitar errores si las tablas ya existen.

---

## 💡 Tips

- **Usá el script completo** (`CREAR-TABLAS-COMPLETAS-SUPABASE.sql`) si necesitás crear ambas tablas
- **Guardá los scripts SQL** por si necesitás recrear las tablas en el futuro
- **No borres las tablas** una vez creadas (a menos que sepas lo que estás haciendo)
- **Si tenés dudas**, revisá la consola del navegador (F12) para ver mensajes más detallados

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
