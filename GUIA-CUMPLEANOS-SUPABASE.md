# 🎂 Guía: Configurar Cumpleaños Automático en Supabase

## 📋 Paso 1: Ejecutar SQL en Supabase

1. **Abrí Supabase** → Tu proyecto → **SQL Editor** (menú lateral izquierdo)
2. **Copiá y pegá** este bloque completo:

```sql
-- ============================================================
-- CONFIGURACIÓN DE CUMPLEAÑOS PARA COMPRADORES
-- Ejecutar UNA SOLA VEZ en Supabase SQL Editor
-- ============================================================

BEGIN;

-- 1. Agregar columnas a tu tabla de compradores
-- ⚠️ IMPORTANTE: Si tu tabla NO se llama "compradores", 
-- cambiá el nombre en la línea siguiente
ALTER TABLE compradores
    ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE,
    ADD COLUMN IF NOT EXISTS acepta_cumple_publico BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS acepta_cumple_descuento BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS mensaje_cumple_publico TEXT,
    ADD COLUMN IF NOT EXISTS cumple_ultima_notificacion TIMESTAMP WITH TIME ZONE;

-- 2. Tabla de historial de celebraciones y cupones
CREATE TABLE IF NOT EXISTS cumpleanos_historial (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT CHECK (tipo IN ('usuario', 'tenant')) NOT NULL,
    referencia_slug TEXT NOT NULL,
    fecha DATE NOT NULL,
    cupón_generado TEXT,
    beneficio TEXT,
    mensaje TEXT,
    enviado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cumpleanos_historial_tipo_fecha
    ON cumpleanos_historial(tipo, fecha DESC);

-- 3. Interacciones públicas (abrazos y mensajes)
CREATE TABLE IF NOT EXISTS cumpleanos_interacciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referencia TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('abrazo', 'mensaje')) NOT NULL,
    autor TEXT,
    mensaje TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cumpleanos_interacciones_referencia
    ON cumpleanos_interacciones(referencia, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cumpleanos_interacciones_tipo
    ON cumpleanos_interacciones(tipo);

COMMIT;
```

3. **Hacé clic en "Run"** (botón verde arriba a la derecha)
4. **Esperá** a que aparezca "Success" ✅

---

## 🔧 Paso 2: Configurar Variables en Vercel

1. **Abrí Vercel** → Tu proyecto → **Settings** → **Environment Variables**
2. **Agregá estas 3 variables** (si no las tenés ya):

| Nombre | Valor | Descripción |
|--------|-------|-------------|
| `SUPABASE_URL` | `https://tu-proyecto.supabase.co` | URL de tu proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` (tu key completa) | Service Role Key (la encontrás en Supabase → Settings → API) |
| `SUPABASE_COMPRADORES_TABLE` | `compradores` | Nombre exacto de tu tabla (si se llama diferente, cambiá esto) |

3. **Guardá** cada variable
4. **Redeploy** tu proyecto (Vercel → Deployments → "Redeploy" en el último deployment)

---

## ✅ Paso 3: Verificar que Funciona

### A. Verificar en Supabase

1. **Table Editor** → Abrí tu tabla `compradores`
2. **Verificá** que aparezcan estas columnas nuevas:
   - ✅ `fecha_nacimiento`
   - ✅ `acepta_cumple_publico`
   - ✅ `acepta_cumple_descuento`
   - ✅ `mensaje_cumple_publico`
   - ✅ `cumple_ultima_notificacion`

### B. Probar desde la Interfaz

1. **Abrí** `demo-buyer-interface.html` en tu navegador
2. **Buscá** la sección "🎂 Preferencias de cumpleaños"
3. **Ingresá** un email que exista en tu tabla `compradores`
4. **Marcá** "Quiero aparecer en Cumpleañeros del Mes"
5. **Completá** fecha y mensaje (opcional)
6. **Hacé clic** en "Guardar preferencias"
7. **Deberías ver** un mensaje de éxito ✅

### C. Verificar en Supabase (después de guardar)

1. **Table Editor** → `compradores`
2. **Buscá** la fila del email que usaste
3. **Verificá** que:
   - `acepta_cumple_publico` = `true` ✅
   - `fecha_nacimiento` = la fecha que pusiste ✅
   - `mensaje_cumple_publico` = el mensaje (si lo pusiste) ✅

---

## 🎯 ¿Qué Tabla Usar?

**Tu tabla se llama `compradores`** (según lo que me dijiste).

- ✅ El código ya está configurado para usar `compradores` por defecto
- ✅ Si tu tabla tiene otro nombre, cambiá la variable `SUPABASE_COMPRADORES_TABLE` en Vercel
- ✅ También cambiá `ALTER TABLE compradores` en el SQL por el nombre real

---

## 🚨 Troubleshooting

### Error: "relation 'compradores' does not exist"
- **Solución**: Tu tabla tiene otro nombre. Verificá en Supabase → Table Editor cuál es el nombre exacto y actualizá `SUPABASE_COMPRADORES_TABLE` en Vercel.

### Error: "column 'acepta_cumple_publico' does not exist"
- **Solución**: Ejecutá el SQL del Paso 1 nuevamente (es seguro, usa `IF NOT EXISTS`).

### No aparece en la portada después de guardar
- **Verificá** que `acepta_cumple_publico = true` en Supabase
- **Verificá** que `fecha_nacimiento` esté completa
- **Esperá** unos segundos y recargá la página de cumpleañeros

---

## 💜 Listo!

Una vez que hagas estos 3 pasos, **todo funciona automáticamente**:
- Los compradores pueden activar/desactivar su visibilidad desde la interfaz
- No necesitás entrar a Supabase manualmente
- Los cambios se guardan instantáneamente
- Aparecen en la portada automáticamente cuando activan el consentimiento

¡Cualquier duda, avisame! 💜


