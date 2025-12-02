# ⚠️ Nota: Error de Conexión a Supabase

## 🔍 Error Reportado

```
Error: Failed to run sql query: connect ECONNREFUSED 2600:1f1e:75b:4b0b:a432:635b:538e:ea66:5432
```

## 💡 Solución

Este error ocurre cuando:
1. **El proyecto de Supabase estaba pausado** y acabas de reanudarlo
2. **La conexión aún no está completamente activa** (puede tardar unos minutos)

### Pasos para Resolver:

1. **Esperar 2-5 minutos** después de reanudar el proyecto
2. **Verificar el estado** en el panel de Supabase
3. **Intentar nuevamente** ejecutar el SQL

### Si el Error Persiste:

1. Verificar que el proyecto esté **activo** (no pausado)
2. Verificar las **credenciales** en `config-supabase-seguro.js`
3. Verificar que la **URL de Supabase** sea correcta
4. Intentar desde el **SQL Editor** de Supabase directamente

---

## 📝 SQL a Ejecutar

Una vez que la conexión esté activa, ejecutar:

```sql
-- Ver archivo: supabase-historias-corazon-cresalia.sql
```

---

## ✅ Estado del Proyecto

- ✅ Proyecto reanudado
- ⏳ Tiempo disponible hasta febrero
- ✅ Sistema de historias actualizado para TODOS los vendedores (no solo VIP)



