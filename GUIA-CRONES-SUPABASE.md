# ⏰ Guía: Configurar Crones en Supabase

## 🎯 ¿Qué Son los Crones?

Los **crones** (cron jobs) son tareas programadas que se ejecutan automáticamente en intervalos regulares.

**Ejemplos**:
- Limpiar datos antiguos cada día
- Enviar reportes semanales
- Actualizar estadísticas cada hora
- Verificar alertas de emergencia cada 5 minutos

---

## 📍 Dónde Configurarlos en Supabase

### **Opción 1: Database → Cron Jobs (Recomendado)**

1. **Ir a**: https://supabase.com/dashboard
2. **Seleccionar proyecto** (Cresalia Tiendas o Comunidades)
3. **Barra lateral** → **Database**
4. **Click en** **"Cron Jobs"** o **"Scheduled Jobs"**

### **Opción 2: SQL Editor (pg_cron)**

Si no aparece la opción visual, usar **pg_cron** directamente en SQL Editor:

```sql
-- Ejemplo: Ejecutar función cada día a las 2 AM
SELECT cron.schedule(
    'limpiar-datos-antiguos',  -- Nombre del cron
    '0 2 * * *',                -- Cada día a las 2 AM
    $$SELECT limpiar_datos_antiguos();$$
);
```

---

## 🔧 Cómo Crear un Cron Job

### **PASO 1: Crear la Función SQL**

Primero, necesitás una función que haga el trabajo:

```sql
-- Ejemplo: Limpiar alertas antiguas
CREATE OR REPLACE FUNCTION limpiar_alertas_antiguas()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Eliminar alertas inactivas de hace más de 30 días
    DELETE FROM alertas_emergencia_comunidades
    WHERE activa = false
    AND created_at < NOW() - INTERVAL '30 days';
    
    RAISE NOTICE 'Alertas antiguas limpiadas: %', ROW_COUNT;
END;
$$;
```

### **PASO 2: Programar el Cron**

#### **Opción A: Desde el Dashboard (si está disponible)**

1. **Database** → **Cron Jobs** → **"New Cron Job"**
2. **Nombre**: `limpiar-alertas-diario`
3. **Schedule**: `0 2 * * *` (cada día a las 2 AM)
4. **SQL**: `SELECT limpiar_alertas_antiguas();`
5. **Save**

#### **Opción B: Desde SQL Editor**

```sql
-- Habilitar extensión pg_cron (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Crear cron job
SELECT cron.schedule(
    'limpiar-alertas-diario',  -- Nombre único
    '0 2 * * *',                -- Cron expression (cada día a las 2 AM)
    $$SELECT limpiar_alertas_antiguas();$$
);
```

---

## 📅 Formato de Cron Expression

El formato es: `minuto hora día mes día-semana`

| Ejemplo | Descripción |
|---------|-------------|
| `0 2 * * *` | Cada día a las 2:00 AM |
| `0 */6 * * *` | Cada 6 horas |
| `0 0 * * 0` | Cada domingo a medianoche |
| `*/15 * * * *` | Cada 15 minutos |
| `0 9 * * 1-5` | Cada día laboral a las 9 AM |

**Formato completo**:
```
┌───────────── minuto (0 - 59)
│ ┌───────────── hora (0 - 23)
│ │ ┌───────────── día del mes (1 - 31)
│ │ │ ┌───────────── mes (1 - 12)
│ │ │ │ ┌───────────── día de la semana (0 - 6) (0 = domingo)
│ │ │ │ │
* * * * *
```

---

## 🧪 Verificar que Funcionan

### **Ver Crones Activos**:

```sql
-- Ver todos los crones programados
SELECT * FROM cron.job;

-- Ver historial de ejecuciones
SELECT * FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 10;
```

### **Probar Manualmente**:

```sql
-- Ejecutar función manualmente para probar
SELECT limpiar_alertas_antiguas();
```

---

## 🚨 Problemas Comunes

### **1. "pg_cron extension not found"**

**Solución**:
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

**Nota**: Algunos planes de Supabase (Free/Hobby) pueden no tener pg_cron habilitado.

### **2. "Cron job not executing"**

**Verificar**:
1. ¿La función existe y funciona?
2. ¿El cron expression es correcto?
3. ¿Hay errores en los logs?

**Ver logs**:
```sql
SELECT * FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'tu-cron-name')
ORDER BY start_time DESC;
```

### **3. "Permission denied"**

**Solución**: Usar `SECURITY DEFINER` en la función:

```sql
CREATE OR REPLACE FUNCTION mi_funcion()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER  -- ← Esto permite ejecutar con permisos del creador
AS $$
BEGIN
    -- Tu código aquí
END;
$$;
```

---

## 💡 Ejemplos Útiles para Cresalia

### **1. Limpiar Alertas Antiguas (Diario)**

```sql
CREATE OR REPLACE FUNCTION limpiar_alertas_antiguas()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM alertas_emergencia_comunidades
    WHERE activa = false
    AND created_at < NOW() - INTERVAL '30 days';
END;
$$;

SELECT cron.schedule(
    'limpiar-alertas-diario',
    '0 2 * * *',
    $$SELECT limpiar_alertas_antiguas();$$
);
```

### **2. Actualizar Estadísticas (Cada Hora)**

```sql
CREATE OR REPLACE FUNCTION actualizar_estadisticas_alertas()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Actualizar vista materializada o tabla de estadísticas
    REFRESH MATERIALIZED VIEW estadisticas_alertas;
END;
$$;

SELECT cron.schedule(
    'actualizar-estadisticas-hora',
    '0 * * * *',
    $$SELECT actualizar_estadisticas_alertas();$$
);
```

### **3. Enviar Recordatorios (Diario a las 9 AM)**

```sql
CREATE OR REPLACE FUNCTION enviar_recordatorios_turnos()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Llamar a Edge Function que envía emails
    -- (esto requiere configuración adicional)
END;
$$;

SELECT cron.schedule(
    'recordatorios-turnos',
    '0 9 * * *',
    $$SELECT enviar_recordatorios_turnos();$$
);
```

---

## 🔍 Verificar Estado de Crones

### **Listar Todos los Crones**:

```sql
SELECT 
    jobid,
    schedule,
    command,
    nodename,
    nodeport,
    database,
    username,
    active
FROM cron.job
ORDER BY jobid;
```

### **Ver Últimas Ejecuciones**:

```sql
SELECT 
    j.jobname,
    jd.start_time,
    jd.end_time,
    jd.status,
    jd.return_message
FROM cron.job j
LEFT JOIN cron.job_run_details jd ON j.jobid = jd.jobid
ORDER BY jd.start_time DESC
LIMIT 20;
```

---

## ⚠️ Limitaciones del Plan Free

**Supabase Free Plan** puede tener limitaciones:
- ❌ **pg_cron puede no estar disponible**
- ❌ **Límite de ejecuciones por día**
- ❌ **No hay interfaz visual de cron jobs**

**Alternativas**:
1. **Vercel Cron Jobs** (si usás Vercel)
2. **Edge Functions con triggers** (Supabase)
3. **Servicio externo** (cron-job.org, EasyCron)

---

## 🎯 Para Tu Caso Específico

Si los crones **NO funcionan**, puede ser porque:

1. **Plan Free**: pg_cron no está habilitado
2. **Extensión no instalada**: Necesitás ejecutar `CREATE EXTENSION pg_cron;`
3. **Permisos**: La función necesita `SECURITY DEFINER`

**Solución Rápida**:
```sql
-- Verificar si pg_cron está disponible
SELECT * FROM pg_available_extensions WHERE name = 'pg_cron';

-- Si está disponible, habilitarlo
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Verificar crones existentes
SELECT * FROM cron.job;
```

---

## 📋 Checklist

- [ ] ¿Tenés acceso a Database → Cron Jobs en Dashboard?
- [ ] ¿Ejecutaste `CREATE EXTENSION pg_cron;`?
- [ ] ¿Creaste la función SQL que querés ejecutar?
- [ ] ¿Programaste el cron con `cron.schedule()`?
- [ ] ¿Verificaste que se ejecutó con `cron.job_run_details`?

---

¿Querés que te ayude a crear un cron específico para tu caso? 😊💜
