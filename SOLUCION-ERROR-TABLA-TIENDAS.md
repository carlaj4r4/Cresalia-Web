# 🔧 Solución: Error "Tabla no encontrada" al Registrar Tienda

## 🚨 El Problema

Cuando intentás registrar una tienda, aparece este error:
```
Error: Tabla no encontrada (PGRST205)
Error de conexión con la base de datos
```

## ✅ La Solución (MUY FÁCIL)

### Paso 1: Abrí Supabase
1. Andá a https://supabase.com
2. Iniciá sesión
3. Seleccioná tu proyecto de Cresalia

### Paso 2: Abrí el SQL Editor
1. En el menú lateral izquierdo, click en **"SQL Editor"**
2. Click en **"New query"** (Nueva consulta)

### Paso 3: Ejecutá el Script
1. Abrí el archivo `CREAR-TABLA-TIENDAS-SUPABASE.sql` en este proyecto
2. **Copiá TODO** el contenido
3. **Pegalo** en el SQL Editor de Supabase
4. Click en **"Run"** (▶️) o presioná `Ctrl + Enter`
5. Esperá a que termine (debería decir "Success" en verde)

### Paso 4: Verificá que Funcionó
1. En Supabase, andá a **"Table Editor"** (Editor de Tablas)
2. Deberías ver la tabla **"tiendas"** en la lista
3. Si la ves, ¡listo! 🎉

### Paso 5: Intentá Registrar de Nuevo
1. Volvé a la página de registro
2. **Recargá la página** (F5)
3. Intentá registrar tu tienda de nuevo
4. Debería funcionar ahora ✅

---

## ❓ ¿Por qué pasó esto?

La tabla `tiendas` es necesaria para guardar la información de las tiendas en Supabase. Si no existe, el sistema no puede guardar los registros.

**Es normal** que esto pase la primera vez que configurás Supabase. Solo necesitás ejecutar el script SQL una vez.

---

## 🆘 Si Sigue Sin Funcionar

### Verificá que:
1. ✅ Estás en el proyecto correcto de Supabase
2. ✅ El script SQL se ejecutó sin errores
3. ✅ La tabla "tiendas" aparece en "Table Editor"
4. ✅ Recargaste la página después de crear la tabla

### Si aún no funciona:
1. Abrí la consola del navegador (F12)
2. Andá a la pestaña "Console"
3. Buscá mensajes de error
4. Copiá los mensajes y contactá a soporte

---

## 📋 Script SQL Completo

El archivo `CREAR-TABLA-TIENDAS-SUPABASE.sql` contiene todo lo necesario:
- ✅ Crear la tabla `tiendas`
- ✅ Crear los índices (para búsquedas rápidas)
- ✅ Configurar seguridad (RLS)
- ✅ Crear políticas de acceso
- ✅ Crear triggers automáticos

**Solo necesitás ejecutarlo UNA VEZ** y ya está.

---

## 💡 Tips

- **Guardá el script SQL** por si necesitás recrear la tabla en el futuro
- **No borres la tabla** una vez creada (a menos que sepas lo que estás haciendo)
- **Si tenés dudas**, revisá la consola del navegador (F12) para ver mensajes más detallados

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
