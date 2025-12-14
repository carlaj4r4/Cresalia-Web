# 📝 Cómo Revisar los Registros de Chats - Guía para Carla

## 🔍 ¿Qué son los registros de chats?

Los registros de chats son un sistema de seguridad que guarda **TODAS** las conversaciones que las personas tienen con ONGs y organizaciones. Esto te permite:

- ✅ Revisar si hubo algún problema
- ✅ Ver qué mensajes se enviaron
- ✅ Identificar patrones sospechosos
- ✅ Ayudar en caso de que alguien reporte un problema

---

## 💾 ¿Dónde se guardan?

### 1. **localStorage (en el navegador)**
- Se guarda **TODO** (sin límite de 100)
- Está en el navegador de cada usuario
- **Ventaja:** Funciona siempre, incluso sin internet
- **Desventaja:** Solo lo ve el usuario en su navegador

### 2. **Supabase (base de datos en la nube)**
- Se guarda en la nube
- **Ventaja:** Lo podés ver desde cualquier lugar
- **Desventaja:** Requiere que la tabla exista en Supabase

**IMPORTANTE:** Si Supabase no está configurado o la tabla no existe, **no pasa nada**. El sistema sigue funcionando con localStorage.

---

## 🛠️ Cómo revisar los registros

### Opción 1: Desde la consola del navegador (FÁCIL)

1. Abrí cualquier página de comunidad de ayuda (Cresalia Solidario, Emergencias, etc.)
2. Presioná `F12` para abrir las herramientas de desarrollador
3. Andá a la pestaña "Console"
4. Escribí esto y presioná Enter:

```javascript
window.foroComunidad.mostrarRegistrosChats()
```

Esto te mostrará un modal con **TODOS** los registros de chats.

### Opción 2: Botón oculto (para acceso rápido)

1. En cualquier comunidad de ayuda, presioná `Ctrl + Shift + R`
2. Aparecerá un botón en la esquina inferior izquierda que dice "Registros"
3. Click en ese botón para ver todos los registros

### Opción 3: Exportar a archivo JSON

Desde el modal de registros, podés hacer click en "Exportar a JSON" y te descargará un archivo con todos los registros para revisarlos cuando quieras.

---

## 📊 ¿Qué información se guarda?

Cada registro incluye:

- ✅ **Fecha y hora** exacta
- ✅ **Qué acción** se realizó (inicio de chat, mensaje enviado, etc.)
- ✅ **Con qué ONG** se contactó
- ✅ **Preview del mensaje** (primeros 100 caracteres)
- ✅ **ID único** del registro
- ✅ **Hash del usuario** (anonimato)
- ✅ **Comunidad** donde ocurrió

**NO se guarda:**
- ❌ Direcciones exactas
- ❌ Nombres completos
- ❌ Información personal sensible

---

## ⚠️ ¿Qué pasa si localStorage se llena?

Si el navegador se queda sin espacio:

1. El sistema automáticamente elimina registros **más antiguos de 1 año**
2. Te muestra una advertencia en la consola
3. Los registros más recientes se mantienen siempre

---

## 🔐 ¿Cómo acceder a los registros de otros usuarios?

**No podés** acceder a los registros de otros usuarios desde tu navegador porque están en **su** localStorage.

Para ver registros de todos los usuarios, necesitás:

1. **Configurar Supabase** con la tabla `registro_chats_comunidades`
2. **Acceder al panel de administración** de Supabase
3. Ver todos los registros desde ahí

---

## 📋 Script SQL para crear la tabla en Supabase

Si querés guardar los registros en Supabase (recomendado), ejecutá esto en el SQL Editor de Supabase:

```sql
-- Tabla para registrar todos los chats con ONGs
CREATE TABLE IF NOT EXISTS registro_chats_comunidades (
    id TEXT PRIMARY KEY,
    usuario_hash TEXT NOT NULL,
    comunidad_slug TEXT NOT NULL,
    ong_id TEXT,
    nombre_ong TEXT,
    tipo TEXT,
    accion TEXT NOT NULL,
    mensaje_preview TEXT,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_registro_chats_usuario ON registro_chats_comunidades(usuario_hash);
CREATE INDEX IF NOT EXISTS idx_registro_chats_comunidad ON registro_chats_comunidades(comunidad_slug);
CREATE INDEX IF NOT EXISTS idx_registro_chats_fecha ON registro_chats_comunidades(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_registro_chats_ong ON registro_chats_comunidades(ong_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE registro_chats_comunidades ENABLE ROW LEVEL SECURITY;

-- Política: Solo admins pueden ver todos los registros
-- (Ajustá según tus necesidades)
CREATE POLICY "Admins pueden ver todos los registros" 
    ON registro_chats_comunidades FOR SELECT
    USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 🚨 ¿Cómo saber si hay un problema?

### Señales de alerta:

1. **Muchos chats iniciados pero pocos mensajes enviados**
   - Podría indicar que alguien está probando el sistema

2. **Mensajes con contenido sospechoso**
   - Revisá los previews de mensajes en los registros

3. **Muchos contactos a la misma ONG en poco tiempo**
   - Podría ser spam o acoso

4. **Registros que no coinciden**
   - Si ves discrepancias entre localStorage y Supabase

### Cómo revisar:

1. Exportá los registros a JSON
2. Buscá patrones sospechosos
3. Si encontrás algo, podés ver el hash del usuario y tomar acción

---

## 💡 Tips útiles

- **Revisá periódicamente:** Una vez por semana o cuando alguien reporte algo
- **Exportá los registros:** Guardá copias de seguridad periódicas
- **No borres registros a menos que sea necesario:** Son importantes para seguridad
- **Si ves algo raro:** Anotá el ID del registro y la fecha para investigar

---

## ❓ Preguntas frecuentes

**P: ¿Los usuarios pueden ver sus propios registros?**
R: No, por ahora solo vos podés verlos desde la consola o el botón oculto.

**P: ¿Se guarda el contenido completo de los mensajes?**
R: No, solo los primeros 100 caracteres como preview. El mensaje completo está en el chat privado.

**P: ¿Qué pasa si Supabase no funciona?**
R: No pasa nada. El sistema sigue funcionando con localStorage. Solo no podrás ver registros de otros usuarios.

**P: ¿Puedo eliminar registros antiguos?**
R: Sí, desde el modal de registros hay un botón "Limpiar Registros", pero te pedirá confirmación.

---

## 🆘 Si necesitás ayuda

Si tenés dudas sobre cómo revisar algo específico, podés:

1. Abrir la consola y escribir: `window.foroComunidad.registroChats`
2. Esto te mostrará todos los registros en formato JSON
3. Podés copiarlos y revisarlos

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
