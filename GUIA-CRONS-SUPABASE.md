# 🔄 Guía de Crons de Supabase - Cresalia

## ⚡ ¿Qué son los Crons?

Los **crons** son trabajos programados que se ejecutan automáticamente en intervalos específicos (cada minuto, hora, día, semana, etc.).

## 📋 Crons Implementados en Cresalia

### 1. **Calcular Aniversarios de Tiendas** 🎂
- **Frecuencia**: Todos los días a las 3:00 AM
- **Función**: `calcular_aniversarios_tiendas()`
- **Qué hace**: 
  - Lee todas las tiendas activas
  - Identifica cuáles cumplen años este mes
  - Cachea los datos en `celebraciones_cache`
  - Incluye: logo, descripción, ubicación, años cumplidos

### 2. **Calcular Aniversarios de Servicios** 🔧
- **Frecuencia**: Todos los días a las 3:15 AM
- **Función**: `calcular_aniversarios_servicios()`
- **Qué hace**:
  - Lee todos los servicios activos
  - Identifica cumpleaños del mes
  - Cachea en `celebraciones_cache`

### 3. **Limpiar Celebraciones Antiguas** 🧹
- **Frecuencia**: Domingos a las 4:00 AM
- **Función**: `limpiar_celebraciones_antiguas()`
- **Qué hace**:
  - Elimina celebraciones de más de 60 días
  - Elimina celebraciones inactivas de más de 30 días
  - Optimiza la base de datos

---

## 🚀 Instalación

### **Opción 1: Con pg_cron (Recomendado)**

Si tu plan de Supabase incluye `pg_cron`:

1. Ve a **Supabase SQL Editor**
2. Ejecuta el archivo completo: `SUPABASE-CRONS-CELEBRACIONES.sql`
3. Verifica que los crons se crearon:
   ```sql
   SELECT * FROM cron.job;
   ```

### **Opción 2: Sin pg_cron (Alternativa)**

Si `pg_cron` no está disponible, tienes 3 opciones:

#### **A) Vercel Cron Jobs** (Recomendado para Vercel)

1. Crea un archivo en tu proyecto: `api/cron/celebraciones.js`
   ```javascript
   import { createClient } from '@supabase/supabase-js';
   
   export default async function handler(req, res) {
     const supabase = createClient(
       process.env.SUPABASE_URL,
       process.env.SUPABASE_SERVICE_ROLE_KEY
     );
     
     // Calcular aniversarios
     const { data: tiendas } = await supabase.rpc('calcular_aniversarios_tiendas');
     const { data: servicios } = await supabase.rpc('calcular_aniversarios_servicios');
     
     res.json({ success: true, tiendas, servicios });
   }
   ```

2. Configura en `vercel.json`:
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/celebraciones",
         "schedule": "0 3 * * *"
       }
     ]
   }
   ```

#### **B) GitHub Actions**

Crea `.github/workflows/crons-celebraciones.yml`:
```yaml
name: Actualizar Celebraciones

on:
  schedule:
    - cron: '0 3 * * *' # 3 AM todos los días
  workflow_dispatch: # Permitir ejecución manual

jobs:
  actualizar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Ejecutar funciones
        run: |
          curl -X POST '${{ secrets.SUPABASE_URL }}/rest/v1/rpc/calcular_aniversarios_tiendas' \
            -H "apikey: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}"
```

#### **C) Ejecución Manual**

Ejecuta estas funciones manualmente cada mes:
```sql
SELECT calcular_aniversarios_tiendas();
SELECT calcular_aniversarios_servicios();
```

---

## 📊 Verificar que Funciona

### 1. **Ver Crons Programados**
```sql
SELECT * FROM cron.job;
```

### 2. **Ver Historial de Ejecuciones**
```sql
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 20;
```

### 3. **Ver Celebraciones Cacheadas**
```sql
SELECT * FROM celebraciones_cache 
WHERE activo = true
ORDER BY fecha_celebracion DESC;
```

### 4. **Probar Función Manualmente**
```sql
-- Calcular aniversarios ahora
SELECT calcular_aniversarios_tiendas();

-- Ver resultados
SELECT * FROM obtener_celebraciones_mes();
```

---

## 🎨 Usar en el Frontend

### **JavaScript - Obtener Celebraciones**

```javascript
// En cumpleaneros-home.js
async function cargarCelebracionesDesdeSupabase() {
    const supabase = initSupabase();
    
    // Opción 1: Desde cache (rápido)
    const { data: celebraciones } = await supabase
        .from('celebraciones_cache')
        .select('*')
        .eq('activo', true)
        .gte('fecha_celebracion', new Date().toISOString().split('T')[0])
        .order('fecha_celebracion', { ascending: true });
    
    // Opción 2: Usando función RPC (más flexible)
    const { data: celebracionesMes } = await supabase
        .rpc('obtener_celebraciones_mes');
    
    return celebraciones || [];
}
```

### **JavaScript - Obtener Historias de Corazón**

```javascript
// En historias-corazon-cresalia.js
async function cargarHistoriasDesdeSupabase() {
    const supabase = initSupabase();
    
    const { data: historias } = await supabase
        .rpc('obtener_historias_publicas', { limite: 10 });
    
    return historias || [];
}
```

---

## 🔧 Gestión de Crons

### **Desactivar un Cron**
```sql
SELECT cron.unschedule('calcular-aniversarios-tiendas');
```

### **Reactivar un Cron**
```sql
SELECT cron.schedule(
    'calcular-aniversarios-tiendas',
    '0 3 * * *',
    $$SELECT calcular_aniversarios_tiendas();$$
);
```

### **Ver Errores de un Cron Específico**
```sql
SELECT * FROM cron.job_run_details 
WHERE jobid = (
    SELECT jobid FROM cron.job 
    WHERE jobname = 'calcular-aniversarios-tiendas'
) 
ORDER BY start_time DESC;
```

---

## 💡 Sintaxis de Cron

La sintaxis de cron es: `minuto hora día mes día_semana`

| Ejemplo | Descripción |
|---------|-------------|
| `0 3 * * *` | Todos los días a las 3:00 AM |
| `0 */4 * * *` | Cada 4 horas |
| `0 0 1 * *` | Primer día de cada mes a medianoche |
| `0 0 * * 0` | Todos los domingos a medianoche |
| `*/5 * * * *` | Cada 5 minutos |

---

## 🎯 Beneficios de Usar Crons

1. **Rendimiento**: Los datos están pre-calculados y cacheados
2. **Menos carga**: El frontend solo lee datos, no calcula
3. **Actualización automática**: Sin intervención manual
4. **Escalabilidad**: Supabase maneja la ejecución
5. **Confiabilidad**: Se ejecuta aunque nadie visite el sitio

---

## ❓ FAQ

### **¿Cuánto cuesta pg_cron en Supabase?**
- **Gratis**: En el plan Free (con límites)
- **Pro**: Sin límites adicionales
- **Enterprise**: Personalizado

### **¿Qué pasa si un cron falla?**
Los errores se registran en `cron.job_run_details`. Puedes configurar notificaciones.

### **¿Puedo ejecutar crons más seguido?**
Sí, pero ten cuidado con los límites de tu plan. Para actualizaciones muy frecuentes (cada minuto), considera usar Realtime de Supabase.

### **¿Cómo depurar un cron que no funciona?**
1. Ejecuta la función manualmente: `SELECT calcular_aniversarios_tiendas();`
2. Revisa los logs: `SELECT * FROM cron.job_run_details ORDER BY start_time DESC;`
3. Verifica permisos de la función

---

## 📚 Próximos Pasos

1. ✅ Ejecutar `SUPABASE-CRONS-CELEBRACIONES.sql` en Supabase
2. ✅ Verificar que los crons se crearon
3. ✅ Actualizar frontend para usar `celebraciones_cache`
4. ✅ Probar con datos reales
5. ✅ Configurar notificaciones de errores (opcional)
