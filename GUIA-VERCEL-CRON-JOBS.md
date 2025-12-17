# 🚀 Guía: Vercel Cron Jobs + GitHub Actions - Cresalia

## ⚡ ¿Qué son los Cron Jobs?

Los **cron jobs** son tareas programadas que se ejecutan automáticamente en intervalos específicos.

---

## 📋 Crons Implementados

### 1. **Actualizar Celebraciones** 🎂
- **Frecuencia**: Todos los días a las 3:00 AM (UTC)
- **Archivo**: `api/cron/celebraciones.js`
- **Qué hace**:
  - Calcula aniversarios de tiendas
  - Calcula aniversarios de servicios
  - Cachea resultados en Supabase

### 2. **Limpiar Datos Antiguos** 🧹
- **Frecuencia**: Domingos a las 4:00 AM (UTC)
- **Archivo**: `api/cron/limpiar.js`
- **Qué hace**:
  - Elimina celebraciones de más de 60 días
  - Limpia datos inactivos de más de 30 días
  - Optimiza la base de datos

---

## 🔧 Instalación

### **Paso 1: Ejecutar SQL en Supabase**

1. Ve a **Supabase SQL Editor**
2. Ejecuta: `SUPABASE-CRONS-CORREGIDO.sql`
3. Verifica que las tablas se crearon:
   ```sql
   SELECT * FROM celebraciones_ecommerce_cache;
   SELECT * FROM historias_corazon;
   ```

### **Paso 2: Configurar Variables de Entorno en Vercel**

Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
CRON_SECRET=genera_un_secret_aleatorio_aquí
```

**Importante**: El `CRON_SECRET` es opcional pero recomendado para seguridad.

### **Paso 3: Configurar GitHub Secrets**

Ve a tu repo en GitHub → **Settings** → **Secrets and variables** → **Actions**:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### **Paso 4: Deploy a Vercel**

```bash
# Desde la carpeta del proyecto
git add .
git commit -m "feat: agregar Vercel cron jobs"
git push
```

Vercel automáticamente detectará `vercel.json` y configurará los crons.

---

## 📊 Verificar que Funciona

### **Vercel Cron Jobs**

1. Ve a tu proyecto en **Vercel Dashboard**
2. Click en **Logs**
3. Filtra por `/api/cron/`
4. Deberías ver ejecuciones diarias a las 3 AM

### **GitHub Actions**

1. Ve a tu repo en GitHub
2. Click en **Actions**
3. Verás los workflows:
   - `Cron - Actualizar Celebraciones`
   - `Cron - Limpiar Datos Antiguos`
4. Cada workflow muestra su historial de ejecuciones

### **Ejecutar Manualmente**

**En Vercel**:
```bash
curl -X GET "https://tu-dominio.vercel.app/api/cron/celebraciones" \
  -H "Authorization: Bearer TU_CRON_SECRET"
```

**En GitHub Actions**:
1. Ve a **Actions**
2. Selecciona el workflow
3. Click en **Run workflow**

**En Supabase**:
```sql
-- Ejecutar manualmente
SELECT calcular_aniversarios_tiendas_uuid();
SELECT calcular_aniversarios_servicios();
```

---

## 🎨 Usar en el Frontend

### **JavaScript - Obtener Celebraciones**

```javascript
// Obtener celebraciones del mes
async function cargarCelebraciones() {
    const supabase = initSupabase();
    
    const { data, error } = await supabase
        .rpc('obtener_celebraciones_mes', { p_tipo: 'ecommerce' });
    
    if (error) {
        console.error('Error:', error);
        return [];
    }
    
    return data || [];
}

// Renderizar en HTML
const celebraciones = await cargarCelebraciones();
celebraciones.forEach(cel => {
    console.log(`🎉 ${cel.nombre} cumple ${cel.metadata.anios} años!`);
});
```

### **JavaScript - Obtener Historias**

```javascript
async function cargarHistorias() {
    const supabase = initSupabase();
    
    const { data, error } = await supabase
        .rpc('obtener_historias_publicas', { p_limite: 10 });
    
    return data || [];
}
```

---

## 💰 Límites y Costos

### **Vercel Cron Jobs**
- **Hobby Plan (Gratis)**: ❌ No disponible
- **Pro Plan ($20/mes)**: ✅ **12 crons** incluidos
- **Enterprise**: Ilimitado

### **GitHub Actions**
- **Gratis**: ✅ **2,000 minutos/mes** incluidos
- **Pro**: 3,000 minutos/mes
- Cada ejecución usa ~1 minuto

### **Recomendación**
✅ **Usar ambos como respaldo**:
- **Vercel** como principal (más confiable)
- **GitHub Actions** como respaldo (gratis)

---

## 🔄 Diferencias: Vercel vs GitHub Actions

| Característica | Vercel Cron Jobs | GitHub Actions |
|----------------|------------------|----------------|
| **Límites gratis** | ❌ 0 (requiere Pro) | ✅ 2,000 min/mes |
| **Configuración** | Muy simple | Un poco más compleja |
| **Confiabilidad** | Muy alta | Alta |
| **Logs** | En Vercel Dashboard | En GitHub Actions |
| **Ejecución manual** | Sí (con curl) | Sí (botón en GitHub) |
| **Costos** | $20/mes Pro Plan | Gratis hasta 2,000 min |

---

## 🎯 Estrategia Recomendada

### **Opción 1: Solo Vercel (Recomendado si tenés Pro)**
- Más simple
- Todo en un lugar
- Mejor integración

### **Opción 2: Solo GitHub Actions (Recomendado si no tenés Pro)**
- Completamente gratis
- Confiable
- Fácil de monitorear

### **Opción 3: Ambos (Máxima confiabilidad)**
- **Vercel** a las 3:00 AM
- **GitHub Actions** a las 3:05 AM (respaldo)
- Si Vercel falla, GitHub lo ejecuta

---

## ❓ FAQ

### **¿Qué pasa si un cron falla?**
- **Vercel**: Verás el error en los logs del Dashboard
- **GitHub Actions**: El workflow mostrará el error y te enviará email
- **Solución**: Ejecuta manualmente la función en Supabase

### **¿Puedo cambiar el horario?**
Sí, edita el `schedule` en `vercel.json` o `.github/workflows/*.yml`:

```javascript
// vercel.json
"schedule": "0 3 * * *"  // 3 AM diario
"schedule": "0 */6 * * *"  // Cada 6 horas
"schedule": "0 0 1 * *"  // Primer día del mes
```

### **¿Cómo verifico que funcionó?**
```sql
-- Ver celebraciones creadas hoy
SELECT * FROM celebraciones_ecommerce_cache 
WHERE DATE(fecha_calculo) = CURRENT_DATE;

-- Ver total de celebraciones activas
SELECT COUNT(*) FROM celebraciones_ecommerce_cache WHERE activo = true;
```

### **¿Puedo usar solo uno de los dos?**
Sí, elige el que prefieras:
- **Vercel**: Más simple, requiere Pro Plan
- **GitHub Actions**: Gratis, igual de confiable

---

## 🚀 Próximos Pasos

1. ✅ Ejecutar `SUPABASE-CRONS-CORREGIDO.sql` en Supabase
2. ✅ Configurar variables de entorno en Vercel
3. ✅ Configurar secrets en GitHub
4. ✅ Hacer push de los cambios
5. ✅ Verificar que los crons se ejecuten correctamente

**¡Todo listo para producción! 🎉**
