# 🧹 Guía: Limpiar Datos de Ejemplo de Supabase

## 🔍 Verificar si hay datos de ejemplo

### **1. Verificar Productos de Ejemplo:**

En Supabase SQL Editor, ejecuta:

```sql
-- Ver todos los productos
SELECT * FROM productos;

-- Ver productos de ejemplo (ajustar según tus datos de ejemplo)
SELECT * FROM productos 
WHERE nombre LIKE '%ejemplo%' 
   OR nombre LIKE '%demo%'
   OR nombre LIKE '%test%'
   OR tienda_id LIKE '%ejemplo%';
```

### **2. Verificar Servicios de Ejemplo:**

```sql
-- Ver todos los servicios
SELECT * FROM servicios;

-- Ver servicios de ejemplo
SELECT * FROM servicios 
WHERE nombre LIKE '%ejemplo%' 
   OR nombre LIKE '%demo%'
   OR nombre LIKE '%test%'
   OR tienda_id LIKE '%ejemplo%';
```

---

## 🗑️ Eliminar Datos de Ejemplo

### **Opción 1: Eliminar por tienda_id de ejemplo**

```sql
-- Eliminar productos de tiendas de ejemplo
DELETE FROM productos 
WHERE tienda_id = 'ejemplo-tienda' 
   OR tienda_id LIKE '%ejemplo%'
   OR tienda_id LIKE '%demo%';

-- Eliminar servicios de tiendas de ejemplo
DELETE FROM servicios 
WHERE tienda_id = 'ejemplo-tienda' 
   OR tienda_id LIKE '%ejemplo%'
   OR tienda_id LIKE '%demo%';
```

### **Opción 2: Eliminar todos los productos/servicios (si estás empezando)**

⚠️ **CUIDADO:** Esto elimina TODOS los productos y servicios.

```sql
-- Eliminar todos los productos
DELETE FROM productos;

-- Eliminar todos los servicios
DELETE FROM servicios;
```

### **Opción 3: Eliminar solo productos/servicios específicos**

```sql
-- Ver primero qué productos quieres eliminar
SELECT id, nombre, tienda_id FROM productos WHERE nombre = 'Nombre del Producto';

-- Eliminar por ID específico
DELETE FROM productos WHERE id = 123;
```

---

## ✅ Verificar que no se carguen datos de ejemplo

### **En el código:**

1. ✅ `index-cresalia.html`: Servicios de ejemplo eliminados
2. ✅ `admin-cresalia.js`: Productos de ejemplo eliminados
3. ✅ `js/filtros-productos.js`: No carga productos de ejemplo

### **En Supabase:**

- Verifica que las tablas `productos` y `servicios` estén vacías o solo tengan datos reales
- Si hay datos de ejemplo, elimínalos usando los comandos SQL de arriba

---

## 📝 Nota Importante

Los productos y servicios deben agregarse **desde el panel de administración**, no desde código.

Si ves productos/servicios apareciendo, verifica:
1. ✅ Que no estén en Supabase (tablas `productos` y `servicios`)
2. ✅ Que no estén en `localStorage` del navegador
3. ✅ Que el código no los esté cargando desde archivos

---

## 🔄 Limpiar localStorage

Si hay datos guardados localmente en el navegador:

```javascript
// En la consola del navegador (F12):
localStorage.removeItem('productosCRESALIA');
localStorage.removeItem('serviciosCRESALIA');
localStorage.removeItem('cresalia-productos');
localStorage.removeItem('cresalia-servicios');
```

---

## ✅ Resultado Final

Después de limpiar:
- ✅ No deberían aparecer productos de ejemplo
- ✅ No deberían aparecer servicios de ejemplo
- ✅ Solo productos/servicios agregados desde el panel admin



