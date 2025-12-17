# 🚀 Cómo Probar GitHub Actions - Guía Rápida

## ✅ Pre-requisitos

Confirmaste que las variables YA están configuradas en GitHub:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

---

## 🎯 Paso 1: Ejecutar SQL en Supabase

1. Ve a **Supabase SQL Editor**: https://supabase.com/dashboard/project/lvdgklwcgrmfbqwghxhl/sql/new

2. Copia **TODO** el contenido de: `SUPABASE-SISTEMA-SEGUIR-CORREGIDO.sql`

3. Pega en el SQL Editor y click **"Run"**

4. Deberías ver: `Success. No rows returned`

5. Verifica que las tablas se crearon:
   ```sql
   -- Ver tablas creadas
   SELECT tablename 
   FROM pg_tables 
   WHERE tablename IN ('seguidores_ecommerce', 'seguidores_comunidad', 'contadores_seguidores')
   AND schemaname = 'public';
   
   -- Debe mostrar 3 filas
   ```

6. Verifica que RLS está habilitado:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'contadores_seguidores';
   
   -- Debe mostrar: rowsecurity = true
   ```

---

## 🎯 Paso 2: Ejecutar Cron de Celebraciones en GitHub

1. Ve a: **https://github.com/carlaj4r4/Cresalia-Web/actions**

2. En el menú lateral izquierdo, busca:
   ```
   Cron - Actualizar Celebraciones
   ```

3. Click en ese workflow

4. Verás un botón azul **"Run workflow"** (arriba a la derecha)

5. Click en **"Run workflow"**

6. Aparecerá un dropdown, click en el botón verde **"Run workflow"**

7. Espera **1 minuto** y refresca la página

8. **Resultado esperado**: ✅ Verde con mensaje "Celebraciones actualizadas correctamente"

---

## 🎯 Paso 3: Verificar Resultados en Supabase

Si el workflow terminó con ✅ verde, verifica en Supabase:

```sql
-- Ver celebraciones creadas HOY
SELECT 
    tipo_celebracion,
    entidad_tipo,
    nombre,
    fecha_celebracion,
    DATE(fecha_calculo) as calculado_hoy
FROM celebraciones_ecommerce_cache 
WHERE DATE(fecha_calculo) = CURRENT_DATE
ORDER BY fecha_celebracion;

-- Ver total de celebraciones activas
SELECT 
    tipo_celebracion,
    COUNT(*) as total
FROM celebraciones_ecommerce_cache 
WHERE activo = true
GROUP BY tipo_celebracion;
```

---

## ❌ Si hay Errores

### **Error: "SUPABASE_URL no está configurado"**
**Solución**:
1. Ve a: https://github.com/carlaj4r4/Cresalia-Web/settings/secrets/actions
2. Verifica que existe `SUPABASE_URL`
3. Si no existe, crealo con: `https://lvdgklwcgrmfbqwghxhl.supabase.co`

### **Error: "Status: 404" o "function not found"**
**Solución**:
1. El SQL no se ejecutó correctamente en Supabase
2. Ve a Supabase SQL Editor
3. Ejecuta de nuevo `SUPABASE-SISTEMA-SEGUIR-CORREGIDO.sql` completo
4. Vuelve a ejecutar el workflow en GitHub

### **Error: "Status: 401" o "unauthorized"**
**Solución**:
1. El `SUPABASE_SERVICE_ROLE_KEY` está mal o vacío
2. Ve a Supabase Dashboard → Settings → API
3. Copia el **service_role** key (NO el anon key)
4. Ve a GitHub Secrets y actualiza `SUPABASE_SERVICE_ROLE_KEY`

---

## 📊 Ver Logs Detallados

Si el workflow falla:

1. Click en el workflow que falló (con ❌ rojo)
2. Click en el job "actualizar-celebraciones"
3. Verás cada paso:
   - ✅ Verificar secrets configurados
   - ✅ Calcular aniversarios de tiendas
   - ✅ Calcular aniversarios de servicios
4. Click en el paso que falló para ver el error detallado

---

## 🎉 Resultado Esperado Final

**En GitHub Actions**:
```
✅ Secrets configurados correctamente
Status: 200
Response: 5 (o número de aniversarios calculados)
✅ Aniversarios de tiendas calculados
Status: 200
Response: 3 (o número de servicios calculados)
✅ Aniversarios de servicios calculados
🎉 Celebraciones actualizadas correctamente
```

**En Supabase**:
- Verás registros en `celebraciones_ecommerce_cache`
- Con `fecha_calculo = hoy`
- Y `activo = true`

---

## ⏰ Ejecución Automática

Una vez que funcione manualmente, GitHub Actions ejecutará **automáticamente**:

- **Celebraciones**: Todos los días a las 3:00 AM UTC (12:00 AM Argentina)
- **Limpieza**: Domingos a las 4:00 AM UTC (1:00 AM Argentina)

**No necesitás hacer nada más**, se ejecuta solo!

---

## 📝 Resumen de Pasos

1. ✅ Ejecutar `SUPABASE-SISTEMA-SEGUIR-CORREGIDO.sql` en Supabase
2. ✅ Ir a GitHub Actions
3. ✅ Ejecutar workflow "Cron - Actualizar Celebraciones"
4. ✅ Verificar resultado en GitHub (✅ verde)
5. ✅ Verificar datos en Supabase

**¡Eso es todo! 🚀**

---

## 💡 Tips

- **No te preocupes si no hay muchas celebraciones**: Solo se calculan aniversarios del mes actual
- **Probá la limpieza después**: Una vez que funcione celebraciones, probá el workflow de limpieza
- **Horario UTC**: Los crons usan UTC (3 horas adelante de Argentina)

**Si algo no funciona, avisame y vemos el error juntos!** 😊
