# 📋 Respuesta: Crons de Supabase y Log de Sesiones

## 🔄 **Crons de Supabase**

### **¿Qué son?**
Los **crons de Supabase** (usando la extensión `pg_cron`) son funciones SQL que se ejecutan automáticamente en intervalos programados (cada minuto, hora, día, etc.).

### **¿Para qué se usan?**
- **Limpieza de datos**: Eliminar sesiones expiradas, logs antiguos
- **Actualizaciones periódicas**: Recalcular estadísticas, actualizar estados
- **Notificaciones programadas**: Enviar recordatorios, reportes diarios
- **Sincronización**: Sincronizar datos entre tablas o servicios externos

### **Estado actual en Cresalia:**
❌ **No hay crons configurados actualmente** en tu proyecto Supabase.

### **¿Necesitas crons para seguir tiendas/usuarios?**
No necesariamente. El sistema de "seguir" (follow) normalmente funciona así:
- **Tabla de relaciones**: `seguidores` o `follows` con `seguidor_id` y `seguido_id`
- **Triggers en tiempo real**: Cuando alguien sigue, se crea el registro inmediatamente
- **No requiere cron**: Los datos se actualizan al momento de la acción

**Si quisieras agregar crons**, podrías usarlos para:
- Limpiar relaciones de seguimiento inactivas
- Actualizar contadores de seguidores
- Enviar notificaciones de nuevos seguidores (batch)

---

## 📱 **Log de Sesión en Móvil**

### **Problema identificado:**
El log de sesión no funciona en móvil porque:
1. **localStorage puede tener limitaciones** en algunos navegadores móviles
2. **Modo incógnito/privado** bloquea localStorage en iOS Safari
3. **Almacenamiento puede estar deshabilitado** por políticas del navegador

### **Solución recomendada:**

#### **Opción 1: Usar Supabase para sesiones (Recomendado)**
En lugar de solo localStorage, guardar sesiones en Supabase:

```sql
-- Tabla para sesiones (si no existe)
CREATE TABLE IF NOT EXISTS sesiones_activas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    user_agent TEXT,
    dispositivo TEXT, -- 'mobile', 'desktop', 'tablet'
    fecha_inicio TIMESTAMPTZ DEFAULT NOW(),
    fecha_ultima_actividad TIMESTAMPTZ DEFAULT NOW(),
    activa BOOLEAN DEFAULT true,
    metadata JSONB
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_sesiones_usuario ON sesiones_activas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_token ON sesiones_activas(session_token);
CREATE INDEX IF NOT EXISTS idx_sesiones_activas ON sesiones_activas(activa) WHERE activa = true;
```

#### **Opción 2: Detectar móvil y usar fallback**
Modificar `js/history-system.js` para detectar móvil y usar IndexedDB como respaldo:

```javascript
// Detectar si es móvil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Usar IndexedDB en móvil si localStorage falla
async function saveSessionHistory(sessionData) {
    try {
        localStorage.setItem('sessionHistory', JSON.stringify(sessionData));
    } catch (e) {
        if (isMobile) {
            // Fallback a IndexedDB en móvil
            await saveToIndexedDB('sessionHistory', sessionData);
        } else {
            console.error('Error guardando sesión:', e);
        }
    }
}
```

#### **Opción 3: Usar sessionStorage en móvil**
`sessionStorage` es más confiable en móviles (aunque se pierde al cerrar pestaña):

```javascript
const storage = isMobile ? sessionStorage : localStorage;
storage.setItem('sessionHistory', JSON.stringify(sessionData));
```

---

## 🎯 **Recomendaciones**

### **Para Crons:**
1. **No son necesarios** para un sistema de "seguir" básico
2. **Solo úsalos si necesitas**:
   - Limpieza automática de datos antiguos
   - Reportes programados
   - Sincronización con servicios externos

### **Para Log de Sesión en Móvil:**
1. **Implementar detección de móvil** y usar IndexedDB como respaldo
2. **O mejor aún**: Guardar sesiones en Supabase (más confiable)
3. **Verificar permisos de almacenamiento** antes de guardar

---

## 📝 **Próximos Pasos**

Si querés que implemente:
1. ✅ Sistema de "seguir" tiendas/usuarios (tablas + funciones)
2. ✅ Fix del log de sesión para móvil (IndexedDB fallback)
3. ✅ Crons básicos (limpieza de sesiones expiradas)

Decime cuál querés que haga primero.
