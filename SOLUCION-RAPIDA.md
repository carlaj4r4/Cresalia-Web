# 🚨 Solución Rápida a Errores

## Errores Detectados

1. ❌ **Error 400 en GitHub Actions**: `column "nombre_servicio" does not exist`
2. ❌ **Vista insegura**: `top_tiendas_seguidas` con SECURITY DEFINER

---

## ✅ Solución en 3 Pasos

### **Paso 1: Ejecutar Script de Diagnóstico** (1 minuto)

1. Ve a **Supabase SQL Editor**: https://supabase.com/dashboard/project/lvdgklwcgrmfbqwghxhl/sql

2. Abre el archivo: **`DIAGNOSTICAR-Y-CORREGIR.sql`**

3. Copia **TODO** el contenido

4. Pega en Supabase SQL Editor

5. Click **"Run"** ▶️

6. **Verás resultados en 4 secciones**:
   ```
   === COLUMNAS DE LA TABLA SERVICIOS ===
   (lista de columnas)
   
   === VISTA TOP_TIENDAS_SEGUIDAS ===
   (si existe o no)
   
   === FUNCIONES EXISTENTES ===
   (lista de funciones)
   
   ✅ Vista eliminada correctamente
   ✅ Función obtener_top_tiendas_seguidas existe
   === PRUEBA DE FUNCIÓN ===
   servicios_procesados: 0 (o número)
   
   === CELEBRACIONES CREADAS HOY ===
   (lista de celebraciones)
   ```

---

### **Paso 2: Verificar Resultado** (30 segundos)

**Deberías ver**:
- ✅ `Vista eliminada correctamente`
- ✅ `Función obtener_top_tiendas_seguidas existe`
- ✅ `servicios_procesados: X` (cualquier número, incluso 0 está bien)

**Si ves errores**:
- Copia el mensaje de error completo
- Mándamelo para que te ayude

---

### **Paso 3: Re-ejecutar GitHub Actions** (1 minuto)

1. Ve a: https://github.com/carlaj4r4/Cresalia-Web/actions

2. Click en **"Cron - Actualizar Celebraciones"**

3. Click **"Run workflow"** (azul)

4. Click **"Run workflow"** (verde)

5. Espera 1 minuto y refresca

6. **Ahora DEBERÍA ver**:
   ```
   ✅ Secrets configurados correctamente
   Status: 200
   Response: 0
   ✅ Aniversarios de tiendas calculados
   Status: 200
   Response: 0
   ✅ Aniversarios de servicios calculados  <-- ESTO AHORA FUNCIONA
   🎉 Celebraciones actualizadas correctamente
   ```

---

## 🔍 ¿Por qué pasó esto?

### **Error 1: `nombre_servicio` no existe**

**Problema**: La tabla `servicios` en tu Supabase usa otra columna para el nombre (ej: `nombre`, `title`, etc.)

**Solución**: El script `DIAGNOSTICAR-Y-CORREGIR.sql` detecta automáticamente qué columna usar:
- Busca en orden: `nombre`, `nombre_servicio`, `title`, `titulo`
- Usa la primera que encuentre
- Si no existe tabla `servicios`, retorna 0 sin error

### **Error 2: Vista `top_tiendas_seguidas`**

**Problema**: La vista vieja con `SECURITY DEFINER` todavía existía en Supabase

**Solución**: El script la elimina y usa la función segura `obtener_top_tiendas_seguidas()`

---

## ✅ Resultado Final Esperado

**En GitHub Actions**:
```
✅ Secrets configurados correctamente
✅ Aniversarios de tiendas calculados (Status: 200)
✅ Aniversarios de servicios calculados (Status: 200)
🎉 Celebraciones actualizadas correctamente
```

**En Supabase** (Query Editor):
```sql
-- Ver celebraciones creadas hoy
SELECT tipo_celebracion, entidad_tipo, nombre, fecha_celebracion
FROM celebraciones_ecommerce_cache 
WHERE DATE(fecha_calculo) = CURRENT_DATE;
```

**Advertencia de Supabase**:
- ❌ Ya NO debe aparecer: "View public.top_tiendas_seguidas is defined with the SECURITY DEFINER property"

---

## 🆘 Si Todavía Hay Errores

**Si después de ejecutar el script sigues viendo errores en GitHub Actions**:

1. Copia el error completo de GitHub Actions
2. Ejecuta en Supabase:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'servicios' 
   AND table_schema = 'public';
   ```
3. Mándame ambos resultados y te ayudo

---

## 💡 Explicación Técnica

El script `DIAGNOSTICAR-Y-CORREGIR.sql` hace:

1. **Diagnóstico**:
   - Lista columnas de tabla `servicios`
   - Verifica si existe vista problemática
   - Lista funciones existentes

2. **Corrección**:
   - Elimina vista `top_tiendas_seguidas`
   - Crea función dinámica que detecta columna correcta
   - Maneja errores sin fallar

3. **Verificación**:
   - Confirma que vista fue eliminada
   - Confirma que función existe
   - Prueba la función
   - Muestra celebraciones creadas

---

## 📋 Resumen

1. ⏳ Ejecutar `DIAGNOSTICAR-Y-CORREGIR.sql` en Supabase
2. ⏳ Verificar que dice "✅ Vista eliminada"
3. ⏳ Re-ejecutar GitHub Actions workflow
4. ✅ Debería funcionar sin errores

**¿Algún problema? Avisame! 😊**
