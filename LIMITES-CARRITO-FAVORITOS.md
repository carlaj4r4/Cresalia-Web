# 🛒 LÍMITES DE CARRITO Y FAVORITOS - CRESALIA

## 📊 Estado Actual

### **Carrito de Compras:**
❌ **Actualmente NO hay límites implementados**
- El carrito usa `localStorage` y no tiene restricciones de cantidad de productos
- Técnicamente, el límite sería el tamaño máximo de `localStorage` del navegador (generalmente 5-10 MB)
- **Recomendación:** Implementar un límite razonable (ej. 50-100 productos diferentes)

### **Lista de Favoritos:**
❌ **Actualmente NO hay límites implementados**
- Los favoritos se guardan en `localStorage` (cliente) y en `compradores.favoritos` (JSONB) en Supabase
- No hay restricción de cantidad de productos favoritos
- **Recomendación:** Implementar un límite razonable (ej. 100-200 productos)

---

## 💡 Recomendaciones de Límites

### **Límites Sugeridos:**

#### **Carrito de Compras:**
- **Máximo de productos diferentes:** 50
- **Máximo de unidades totales:** 200
- **Motivo:** Evitar carritos demasiado grandes que afecten el rendimiento

#### **Lista de Favoritos:**
- **Máximo de productos:** 100
- **Motivo:** Mantener la lista útil y no abrumadora

---

## ✅ Implementación Actual

### **Sistema de Favoritos:**
- ✅ **Archivo:** `core/wishlist-favoritos.js`
- ✅ **Funcionalidad:** Agregar, quitar, vaciar lista de deseos
- ✅ **Persistencia:** localStorage + sincronización con backend (si está logueado)
- ❌ **Límites:** No implementados

### **Sistema de Carrito:**
- ✅ **Ubicación:** Varios archivos (ej. `demo-buyer-interface.html`, `script-cresalia.js`)
- ✅ **Funcionalidad:** Agregar, actualizar cantidad, eliminar productos
- ✅ **Persistencia:** localStorage
- ❌ **Límites:** No implementados

---

## 📝 Listas Personalizadas (Distintas de Favoritos)

### **Estado Actual:**
❌ **NO existe sistema de listas personalizadas**

### **Funcionalidad Actual:**
- Solo existe **Favoritos** (wishlist)
- No hay opción para crear listas personalizadas (ej. "Lista de cumpleaños", "Lista de regalos", "Lista de deseos para comprar después")

### **Recomendación para Futuro:**
Si deseas implementar listas personalizadas, necesitarías:

1. **Nueva tabla en Supabase:**
   ```sql
   CREATE TABLE listas_personalizadas (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       comprador_id UUID REFERENCES compradores(id) ON DELETE CASCADE,
       nombre_lista TEXT NOT NULL,
       descripcion TEXT,
       productos JSONB DEFAULT '[]'::jsonb,
       publica BOOLEAN DEFAULT false,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Frontend:**
   - UI para crear/editar listas
   - Selector de lista al agregar productos
   - Página para gestionar todas las listas

3. **Límites sugeridos:**
   - **Máximo de listas:** 10 por comprador
   - **Máximo de productos por lista:** 50

---

## 🚀 Próximos Pasos Recomendados

### **1. Implementar Límites de Carrito:**
- Agregar validación al agregar productos
- Mostrar mensaje cuando se alcanza el límite
- Sugerir proceder al checkout si el carrito está lleno

### **2. Implementar Límites de Favoritos:**
- Agregar validación al agregar a favoritos
- Mostrar mensaje cuando se alcanza el límite
- Sugerir eliminar productos antiguos

### **3. (Opcional) Implementar Listas Personalizadas:**
- Crear tabla en Supabase
- Desarrollar UI para gestionar listas
- Integrar con el sistema de productos existente

---

## 💜 Nota

Actualmente, el sistema de favoritos y carrito funcionan sin límites, lo cual puede ser suficiente para la mayoría de usuarios. Sin embargo, implementar límites razonables puede mejorar la experiencia y el rendimiento del sistema.

---

*Creado con amor por Claude, tu co-fundador 💜*





