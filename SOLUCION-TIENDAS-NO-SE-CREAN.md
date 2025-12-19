# 🔧 Solución: Las Tiendas No Se Crean con el Script DO $$

## ❌ Problema

El script `CREAR-TIENDAS-FALTANTES.sql` muestra usuarios en el **Paso 1** (SELECT), pero **NO crea las tiendas** en el **Paso 2** (DO $$ ... END $$).

**Síntomas:**
- ✅ El SELECT funciona y muestra usuarios sin tienda
- ❌ El bloque `DO $$` no crea las tiendas
- ❌ No aparecen registros en la tabla `tiendas`

---

## 🔍 Causa

El bloque `DO $$ ... END $$` puede fallar silenciosamente por:
- **Permisos RLS (Row Level Security)**: El bloque puede no tener permisos para insertar
- **Errores silenciosos**: Los `RAISE NOTICE` no se muestran en el dashboard
- **Problemas con SECURITY DEFINER**: Puede necesitar permisos especiales

---

## ✅ Solución: Script Simplificado

He creado `CREAR-TIENDAS-FALTANTES-SIMPLE.sql` que usa **INSERT directo** en lugar de `DO $$`.

### **Ventajas:**
- ✅ Más simple y directo
- ✅ Muestra errores claramente si falla
- ✅ No depende de permisos especiales
- ✅ Usa `ON CONFLICT DO NOTHING` para evitar duplicados

---

## 📋 Pasos para Ejecutar

### **Paso 1: Abrir el Script Simplificado**

1. Abrir `CREAR-TIENDAS-FALTANTES-SIMPLE.sql`
2. Copiar **TODO** el código

### **Paso 2: Ejecutar en Supabase**

1. Ir a **Supabase Dashboard** → **SQL Editor**
2. Pegar el código completo
3. Click en **"Run"** (▶️)
4. Verificar que dice **"Success"**

### **Paso 3: Verificar Resultados**

El script ejecuta **3 pasos automáticamente**:

1. **Paso 1**: Muestra usuarios sin tienda (igual que antes)
2. **Paso 2**: Crea las tiendas usando `INSERT ... SELECT` (nuevo método)
3. **Paso 3**: Muestra las tiendas creadas (verificación)

---

## 🧪 Verificar que Funcionó

### **Opción 1: Ver en los Resultados del Script**

Después de ejecutar, deberías ver **3 resultados**:
1. Lista de usuarios sin tienda (Paso 1)
2. Mensaje de éxito del INSERT (Paso 2)
3. Lista de tiendas creadas (Paso 3)

### **Opción 2: Verificar en Table Editor**

1. Ir a **Supabase Dashboard** → **Table Editor** → **tiendas**
2. Buscar por email: `carla.crimi.95@gmail.com`
3. Deberías ver el registro con:
   - `nombre_tienda`
   - `plan`
   - `subdomain`
   - `activa: true`

---

## 🔍 Si Aún No Funciona

### **Verificar Permisos RLS**

Si el INSERT falla por RLS, ejecutar esto primero:

```sql
-- Deshabilitar RLS temporalmente para insertar (solo para este caso)
ALTER TABLE public.tiendas DISABLE ROW LEVEL SECURITY;

-- Ejecutar el script CREAR-TIENDAS-FALTANTES-SIMPLE.sql

-- Volver a habilitar RLS
ALTER TABLE public.tiendas ENABLE ROW LEVEL SECURITY;
```

### **Verificar que la Tabla Existe**

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'tiendas';
```

Debería mostrar `tiendas`.

### **Verificar Estructura de la Tabla**

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'tiendas';
```

Deberías ver columnas como: `id`, `user_id`, `nombre_tienda`, `email`, `plan`, `subdomain`, etc.

---

## 💡 Diferencia entre los Scripts

### **Script Original (`CREAR-TIENDAS-FALTANTES.sql`)**
- Usa `DO $$ ... END $$` (bloque PL/pgSQL)
- Más complejo
- Puede fallar silenciosamente
- Requiere permisos especiales

### **Script Simplificado (`CREAR-TIENDAS-FALTANTES-SIMPLE.sql`)**
- Usa `INSERT ... SELECT` directo
- Más simple
- Muestra errores claramente
- No requiere permisos especiales

---

## 📋 Checklist

- [ ] Ejecutar `CREAR-TIENDAS-FALTANTES-SIMPLE.sql` completo
- [ ] Verificar que el Paso 2 muestra "Success"
- [ ] Verificar en Table Editor que apareció el registro
- [ ] Probar login con el usuario vendedor
- [ ] Verificar que redirige a `admin-final.html` sin error 404

---

¿Probamos ejecutar el script simplificado? 😊💜
