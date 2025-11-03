# 📱 Guía Simple: PWA y Alertas de Emergencia

## 🎯 PWA (Progressive Web App)

### ❌ **NO necesita tablas en Supabase**

El PWA funciona **solo con archivos**:
- ✅ `comunidades/manifest-comunidades.json` (ya está creado)
- ✅ `sw.js` (Service Worker - ya está creado)
- ✅ Meta tags en cada HTML (ya están agregados)

**¡Ya está funcionando!** Los usuarios pueden:
- Instalar la app en su móvil (botón "Agregar a pantalla de inicio")
- Usarla offline (caché automático)
- Recibir notificaciones push (cuando las configuremos)

---

## 🚨 Alertas de Emergencia

### ✅ **SÍ necesita tablas en Supabase** (ya creadas)

### 1️⃣ Ejecutar el SQL (si aún no lo hiciste)

Ve a **Supabase Dashboard → SQL Editor** y ejecuta:
```sql
-- El archivo completo está en: supabase-alertas-emergencia-comunidades.sql
```

**Solo necesitas ejecutarlo UNA VEZ**. Crea estas tablas:
- `alertas_emergencia_comunidades` - Para guardar las alertas
- `alertas_vistas_usuarios` - Para saber qué usuarios ya vieron qué alertas

---

### 2️⃣ Cómo activar una alerta (crear una alerta nueva)

Ve a **Supabase Dashboard → Table Editor → `alertas_emergencia_comunidades`** y haz clic en **"Insert row"**:

#### Ejemplo 1: Alerta de tormenta
```sql
INSERT INTO alertas_emergencia_comunidades (
    tipo,
    titulo,
    descripcion,
    severidad,
    pais,
    provincia,
    ciudad,
    activa,
    fecha_expiracion,
    comunidades_afectadas
) VALUES (
    'tormenta',                                    -- Tipo
    '⚠️ Alerta Meteorológica: Tormenta Intensa',  -- Título
    'Se esperan lluvias intensas y vientos fuertes en las próximas 24 horas. Se recomienda no salir innecesariamente y estar atento a los comunicados oficiales.',  -- Descripción
    'alta',                                        -- Severidad: baja, media, alta, critica
    'Argentina',                                   -- País (opcional)
    'Buenos Aires',                                -- Provincia (opcional)
    'CABA',                                        -- Ciudad (opcional)
    true,                                          -- activa = true
    NOW() + INTERVAL '48 hours',                  -- Expira en 48 horas
    ARRAY['estres-laboral', 'mujeres-sobrevivientes']  -- Comunidades afectadas (NULL = todas)
);
```

#### Ejemplo 2: Alerta crítica de inundación
```sql
INSERT INTO alertas_emergencia_comunidades (
    tipo,
    titulo,
    descripcion,
    severidad,
    pais,
    provincia,
    activa,
    enlace_oficial,
    comunidades_afectadas
) VALUES (
    'inundacion',
    '🚨 ALERTA CRÍTICA: Inundaciones',
    'Zonas afectadas por inundaciones. Evacuar áreas bajas. Información oficial actualizada.',
    'critica',                                     -- Máxima prioridad
    'Argentina',
    'Buenos Aires',
    true,
    'https://www.gcba.gob.ar/alertas',            -- Link oficial
    NULL                                           -- NULL = todas las comunidades ven esta alerta
);
```

#### Ejemplo 3: Alerta de corte de servicios
```sql
INSERT INTO alertas_emergencia_comunidades (
    tipo,
    titulo,
    descripcion,
    severidad,
    ciudad,
    activa,
    fecha_expiracion
) VALUES (
    'corte_luz',
    '⚡ Corte de Energía Programado',
    'Corte de luz programado mañana de 9:00 a 15:00 hs en zona centro. Planificar actividades.',
    'media',
    'CABA',
    true,
    NOW() + INTERVAL '36 hours'
);
```

---

### 3️⃣ Cómo se enteran los usuarios

**Automáticamente** cuando:
1. **Visitan cualquier comunidad** → El sistema JavaScript consulta Supabase
2. **Busca alertas activas** → `activa = true` y `fecha_expiracion > NOW()`
3. **Muestra la alerta** → Banner rojo/amarillo en la parte superior de la pantalla
4. **Notificación push** → Si el usuario dio permisos, recibe notificación en móvil

**No necesitas hacer nada más.** El sistema funciona solo.

---

### 4️⃣ Desactivar una alerta

Opción A: En Table Editor de Supabase
- Busca la alerta
- Cambia `activa` de `true` a `false`
- Guarda

Opción B: Con SQL
```sql
UPDATE alertas_emergencia_comunidades 
SET activa = false 
WHERE id = 1;  -- Cambia el ID
```

---

### 5️⃣ Tipos de alertas disponibles

- `inundacion`
- `incendio`
- `terremoto`
- `tormenta`
- `tornado`
- `tsunami`
- `pandemia`
- `corte_luz`
- `corte_gas`
- `corte_agua`
- `accidente`
- `seguridad`
- `otro`

---

### 6️⃣ Severidad de alertas

- `baja` → Banner azul/verde (información)
- `media` → Banner amarillo (precaución)
- `alta` → Banner naranja (atención)
- `critica` → Banner rojo (emergencia) + Notificación push obligatoria

---

### 7️⃣ Comunidades afectadas

- **`NULL`** → La alerta se muestra en **TODAS** las comunidades
- **`ARRAY['estres-laboral', 'mujeres-sobrevivientes']`** → Solo se muestra en esas comunidades específicas

---

## 📋 Resumen rápido

### PWA:
- ✅ **No necesita configuración en Supabase**
- ✅ **Ya funciona** con los archivos creados
- ✅ Usuarios pueden instalar la app desde el navegador móvil

### Alertas:
1. ✅ Ejecuta el SQL `supabase-alertas-emergencia-comunidades.sql` **UNA VEZ**
2. ✅ Inserta alertas en la tabla `alertas_emergencia_comunidades`
3. ✅ Los usuarios las ven **automáticamente** cuando visitan comunidades
4. ✅ Se desactivan automáticamente cuando `fecha_expiracion` pasa

---

## 🎯 ¿Querés crear alertas desde un panel web?

Podría crear un panel de administración simple donde puedas:
- Crear alertas con formulario
- Ver alertas activas
- Editar/desactivar alertas

¿Te sirve? Solo decime "sí" y lo creo. 💜

