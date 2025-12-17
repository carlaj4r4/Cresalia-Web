# 🔧 Configurar GitHub Actions - Cresalia

## ⚡ ¿Por qué GitHub Actions?

- ✅ **Completamente GRATIS** (2,000 minutos/mes)
- ✅ **Funciona igual que Vercel Cron Jobs**
- ✅ **No requiere plan de pago**
- ✅ **Fácil de configurar**

---

## 🚀 Configuración (3 pasos)

### **Paso 1: Obtener Service Role Key de Supabase**

1. Ve a **Supabase Dashboard**: https://supabase.com
2. Selecciona tu proyecto **"Cresalia Tiendas"**
3. Ve a **Settings** → **API**
4. Copia el **`service_role` key** (secret):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   ⚠️ **MUY IMPORTANTE**: NO uses el `anon` key, necesitás el `service_role`

### **Paso 2: Configurar Secrets en GitHub**

1. Ve a tu repositorio en GitHub:
   ```
   https://github.com/carlaj4r4/Cresalia-Web
   ```

2. Click en **Settings** (configuración del repo)

3. En el menú lateral, click en **Secrets and variables** → **Actions**

4. Click en **"New repository secret"**

5. Agregar **PRIMER secret**:
   - **Name**: `SUPABASE_URL`
   - **Value**: `https://lvdgklwcgrmfbqwghxhl.supabase.co`
   - Click **"Add secret"**

6. Click en **"New repository secret"** de nuevo

7. Agregar **SEGUNDO secret**:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: `[pegar aquí tu service_role key de Supabase]`
   - Click **"Add secret"**

### **Paso 3: Probar los Workflows**

1. Ve a **Actions** en tu repo de GitHub

2. Deberías ver:
   - `Cron - Actualizar Celebraciones`
   - `Cron - Limpiar Datos Antiguos`

3. Click en **"Cron - Actualizar Celebraciones"**

4. Click en el botón **"Run workflow"** (dropdown)

5. Click en el botón verde **"Run workflow"**

6. Espera 30-60 segundos

7. Refresca la página

8. Deberías ver un ✅ verde si funcionó

---

## 📊 Verificar que Funcionó

### **En GitHub**:
1. Ve a **Actions**
2. Click en el workflow ejecutado
3. Verás los logs:
   ```
   ✅ Secrets configurados correctamente
   Status: 200
   ✅ Aniversarios de tiendas calculados
   ✅ Aniversarios de servicios calculados
   🎉 Celebraciones actualizadas correctamente
   ```

### **En Supabase**:
```sql
-- Ver celebraciones creadas
SELECT * FROM celebraciones_ecommerce_cache 
WHERE DATE(fecha_calculo) = CURRENT_DATE
ORDER BY fecha_celebracion;

-- Ver total de celebraciones activas
SELECT COUNT(*) as total
FROM celebraciones_ecommerce_cache 
WHERE activo = true;
```

---

## 📅 Horarios de Ejecución

### **Actualizar Celebraciones**:
- **Frecuencia**: Todos los días a las 3:00 AM (UTC)
- **Hora Argentina (UTC-3)**: 12:00 AM (medianoche)
- **Qué hace**: Calcula aniversarios de tiendas y servicios

### **Limpiar Datos**:
- **Frecuencia**: Todos los domingos a las 4:00 AM (UTC)
- **Hora Argentina**: 1:00 AM
- **Qué hace**: Elimina celebraciones antiguas (>60 días)

---

## 🔄 GitHub Actions vs Vercel Cron Jobs

| Característica | GitHub Actions | Vercel Cron Jobs |
|----------------|----------------|------------------|
| **Costo** | ✅ Gratis | ❌ $20/mes (Pro) |
| **Límites** | 2,000 min/mes | 12 crons máximo |
| **Configuración** | Secrets en GitHub | Env vars en Vercel |
| **Logs** | GitHub Actions tab | Vercel Dashboard |
| **Confiabilidad** | ✅ Muy alta | ✅ Muy alta |
| **Ejecución manual** | ✅ Botón "Run workflow" | ✅ Endpoint público |

**Conclusión**: ✅ **GitHub Actions es GRATIS y funciona igual de bien**

---

## ❓ FAQ

### **¿Por qué falló mi workflow?**

**Error común**: `URL rejected: Malformed input`

**Causa**: Los secrets no están configurados o están vacíos

**Solución**:
1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Verifica que existan:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Si están vacíos, eliminalos y vuelve a crearlos

### **¿Cómo cambio el horario?**

Edita `.github/workflows/crons-celebraciones.yml`:

```yaml
schedule:
  - cron: '0 3 * * *' # 3 AM diario (UTC)
```

Ejemplos:
```
'0 */6 * * *'  # Cada 6 horas
'0 0 1 * *'    # Primer día del mes
'30 2 * * *'   # 2:30 AM diario
```

### **¿Puedo desactivar Vercel Cron Jobs?**

Sí, elimina o comenta el archivo `vercel.json`:

```json
{
  // "crons": []  <- comentado
}
```

O elimina el archivo directamente.

### **¿Cuántos minutos uso?**

Cada ejecución usa ~1 minuto:
- **Diario**: ~30 minutos/mes
- **Semanal**: ~4 minutos/mes
- **Total**: ~34 minutos de 2,000 disponibles

---

## ✅ Checklist Final

- [ ] Ejecutar `SUPABASE-SISTEMA-SEGUIR-CORREGIDO.sql` en Supabase
- [ ] Obtener `service_role` key de Supabase
- [ ] Configurar `SUPABASE_URL` en GitHub Secrets
- [ ] Configurar `SUPABASE_SERVICE_ROLE_KEY` en GitHub Secrets
- [ ] Hacer push de cambios (workflows actualizados)
- [ ] Ejecutar manualmente en GitHub Actions
- [ ] Verificar que funcionó (✅ verde)
- [ ] Verificar datos en Supabase

---

## 🎉 ¡Listo!

Una vez configurado:
- ✅ Los crons se ejecutan automáticamente
- ✅ Sin costo alguno
- ✅ Logs claros en GitHub Actions
- ✅ Funciona igual que Vercel

**¡Todo gratis y sin límites! 🚀**
