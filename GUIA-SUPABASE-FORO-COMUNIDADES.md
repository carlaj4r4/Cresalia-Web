# 📋 Guía: Configurar Foro de Comunidades en Supabase

## 🎯 Qué hacer en Supabase

### Paso 1: Ir al SQL Editor
1. Entrá a tu dashboard de Supabase
2. Hacé clic en **"SQL Editor"** (📝) en el menú lateral
3. Hacé clic en **"New Query"**

### Paso 2: Copiar y Pegar TODO este código

**Abrí el archivo:** `supabase-comunidades-foro.sql`

**Copiá TODO el contenido del archivo** (desde la primera línea hasta la última) y pegálo en el editor SQL de Supabase.

### Paso 3: Ejecutar
1. Hacé clic en el botón **"RUN"** o presioná `Ctrl + Enter` (Windows) o `Cmd + Enter` (Mac)
2. Esperá unos segundos...

### Paso 4: Verificar
Deberías ver un mensaje de éxito. Si hay algún error, puede ser que algunas tablas ya existan (eso está bien, el `IF NOT EXISTS` las evita).

---

## ✅ Lo que se crea automáticamente:

1. **Tabla `comunidades`**: Catálogo de las 10 comunidades
2. **Tabla `posts_comunidades`**: Posts anónimos de cada comunidad
3. **Tabla `comentarios_comunidades`**: Comentarios anónimos
4. **Tabla `reacciones_comunidades`**: Para futuras reacciones/likes
5. **Políticas de seguridad (RLS)**: Protección de datos
6. **Triggers automáticos**: Para actualizar contadores

---

## 🛡️ Seguridad

- ✅ **Anonimato total**: Solo se guardan hashes, nunca emails ni datos personales
- ✅ **Row Level Security activado**: Protección a nivel de base de datos
- ✅ **Solo el autor puede editar/borrar**: Validado por hash

---

## 📝 Nota Importante

Si alguna tabla ya existe y querés recrearla, primero tenés que borrarla manualmente desde el SQL Editor:

```sql
DROP TABLE IF EXISTS reacciones_comunidades CASCADE;
DROP TABLE IF EXISTS comentarios_comunidades CASCADE;
DROP TABLE IF EXISTS posts_comunidades CASCADE;
DROP TABLE IF EXISTS comunidades CASCADE;
```

Luego ejecutás el script completo nuevamente.

---

**¡Listo!** Una vez ejecutado, el foro funcionará automáticamente en todas las comunidades. 💜

