# 👥 Arquitectura de Usuarios - CRESALIA

## 🎯 Dos Tipos de Usuarios

### 1. 🛒 **COMPRADORES** (Usuarios/Clientes)
- **Qué hacen:** Compran productos en las tiendas
- **Registro:** Simple (nombre, email, contraseña)
- **Panel:** Perfil de usuario, historial de compras
- **Tabla:** `compradores`

### 2. 🏪 **VENDEDORES** (Dueños de Tiendas)
- **Qué hacen:** Venden productos, gestionan tienda
- **Registro:** Completo (nombre tienda, email, contraseña, plan)
- **Panel:** Admin completo con productos, ventas, etc.
- **Tabla:** `tiendas`

---

## 🗄️ Estructura de Base de Datos

### **Tabla: auth.users (Automática de Supabase)**
```
Contiene TODOS los usuarios (compradores Y vendedores)
- id (UUID)
- email
- encrypted_password
- user_metadata (tipo_usuario: 'comprador' o 'vendedor')
```

### **Tabla: compradores**
```
Solo los usuarios que compran
- id (UUID)
- user_id → auth.users.id
- nombre_completo
- email
- telefono
- direccion_principal (JSON)
- direcciones_adicionales (JSON array)
- favoritos (JSON array de product_ids)
- activo
- fecha_registro
- ultima_compra
- total_compras
```

### **Tabla: tiendas** ✅ (Ya creada)
```
Solo los usuarios que venden
- id (UUID)
- user_id → auth.users.id
- nombre_tienda
- email
- plan
- subdomain
- activa
- fecha_creacion
- configuracion (JSON)
```

---

## 🔄 Flujo de Usuario

### **FLUJO COMPRADOR:**

```
1. Usuario visita → index-cresalia.html (página principal)
   ↓
2. Ve productos de todas las tiendas
   ↓
3. Quiere comprar → Click en "Comprar"
   ↓
4. Sistema verifica: ¿Tiene cuenta?
   ├─ NO → Redirige a registro-comprador.html
   └─ SÍ → Redirige a login-comprador.html
   ↓
5. Después del login → Vuelve a index-cresalia.html
   ↓
6. Ahora puede:
   - Agregar al carrito
   - Ver su perfil
   - Historial de compras
   - Favoritos
```

### **FLUJO VENDEDOR:**

```
1. Usuario visita → registro-inicial.html
   ↓
2. Selecciona "Quiero Vender"
   ↓
3. registro-tienda.html → Crea su tienda
   ↓
4. login-tienda.html → Inicia sesión
   ↓
5. tiendas/ejemplo-tienda/admin.html → Panel admin
   ↓
6. Ve SU tienda personalizada:
   - Su nombre de tienda
   - Sus productos
   - Sus ventas
   - Su configuración
```

---

## 🔐 Seguridad y Separación

### **¿Cómo se distinguen?**

**Método 1: Verificar en qué tabla están**
```javascript
// Al hacer login
const { data: user } = await supabase.auth.getUser();

// Verificar si es vendedor
const { data: tienda } = await supabase
    .from('tiendas')
    .select('*')
    .eq('user_id', user.id)
    .single();

if (tienda) {
    // Es vendedor → Redirigir a admin
} else {
    // Es comprador → Redirigir a index
}
```

**Método 2: user_metadata**
```javascript
// Al registrarse, guardamos tipo
user_metadata: { tipo_usuario: 'comprador' }
// O
user_metadata: { tipo_usuario: 'vendedor' }
```

### **¿Pueden ser ambos?**

**SÍ**, alguien puede:
- Comprar en otras tiendas (tabla `compradores`)
- Y vender en su propia tienda (tabla `tiendas`)
- Necesitaría 2 cuentas diferentes o un sistema más complejo

---

## 📁 Archivos Creados

### **Para Vendedores:**
- ✅ `registro-tienda.html` - Registro
- ✅ `login-tienda.html` - Login
- ✅ `tiendas/ejemplo-tienda/admin.html` - Panel admin

### **Para Compradores:**
- ✅ `registro-comprador.html` - Registro
- ✅ `login-comprador.html` - Login
- ⏳ `perfil-comprador.html` - Perfil (próximo)
- ⏳ `mis-compras.html` - Historial (próximo)

### **Página Inicial:**
- ✅ `registro-inicial.html` - Selector: ¿Comprar o Vender?
- ✅ `index-cresalia.html` - Catálogo de productos

---

## 🚀 Próximos Pasos

### **Para Lanzar Mínimo Viable:**

1. ✅ Registro y login de vendedores (LISTO)
2. ✅ Panel admin para vendedores (LISTO)
3. ✅ Registro y login de compradores (LISTO)
4. ⏳ Crear tabla `compradores` en Supabase
5. ⏳ Perfil de comprador
6. ⏳ Sistema de carrito
7. ⏳ Proceso de compra

---

## 💡 Recomendación

**Para LANZAR YA:**

Fase 1 (Esta semana):
- ✅ Sistema de vendedores COMPLETO
- ✅ Los vendedores pueden crear tiendas
- ⏳ Compradores pueden VER productos
- ⏳ Compradores contactan por WhatsApp (sin cuenta)

Fase 2 (Próximas semanas):
- Sistema completo de compradores
- Carrito y checkout
- Historial de compras

**¿Te parece bien este enfoque?** 💜




















