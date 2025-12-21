# ✅ Resumen: Editar Perfil de Comprador

## 🎯 Funcionalidad Implementada

Se agregó una sección completa para que los compradores puedan editar su información personal desde `demo-buyer-interface.html`.

---

## 📍 Ubicación del Botón "Ir al Inicio"

**Ubicación:** En el navbar superior de `demo-buyer-interface.html`

**Ubicación exacta:**
- **Línea ~1133**: Primer elemento del navbar (`.demo-nav ul li:first-child`)
- **Texto:** "Ir al Inicio" con ícono de casa 🏠
- **Estilo:** Botón con gradiente morado/rosa (`#7C3AED` a `#EC4899`)
- **Funcionalidad:** Redirige a `index-cresalia.html` (ruta relativa, NO cierra sesión)

---

## ✏️ Sección "Editar Mi Perfil"

### **Ubicación**
- Nueva tarjeta en la sección "Mi Cuenta" (`#mi-cuenta`)
- Sección completa al hacer clic en "Editar Perfil"

### **Campos del Formulario**

1. **Correo Electrónico** 📧
   - Campo de solo lectura
   - Muestra el email actual del usuario
   - Mensaje: "El correo no se puede cambiar desde aquí. Contactá a soporte si necesitás modificarlo."

2. **DNI (Opcional)** 🆔
   - Campo de texto libre
   - Máximo 20 caracteres
   - Placeholder: "12345678"
   - Mensaje: "Solo se usa para facturación. Es opcional y se mantiene privado."

3. **Número de Celular** 📱
   - Campo requerido (`required`)
   - Tipo: `tel`
   - Placeholder: "+54 9 11 1234-5678"
   - Mensaje: "Número de contacto principal (con código de país)."

4. **Domicilio** 📍
   - **Calle y número** (requerido)
   - **Ciudad** (requerido)
   - **Provincia** (requerido)
   - **Código Postal** (opcional)

---

## 🔧 Funciones JavaScript Implementadas

### **1. `abrirEditarPerfil()`**
- Muestra la sección de edición de perfil
- Oculta otras secciones (widget de comunidades)
- Carga automáticamente los datos actuales del usuario
- Scroll suave hasta la sección

### **2. `cerrarEditarPerfil()`**
- Oculta la sección de edición de perfil

### **3. `cargarDatosPerfil()`**
- Carga los datos del usuario desde Supabase
- Carga email, teléfono, DNI, y dirección principal
- Maneja casos donde el usuario no tiene datos guardados

### **4. `guardarPerfil(event)`**
- Valida campos requeridos
- Guarda los datos en la tabla `compradores` de Supabase
- Si el usuario no existe en la tabla, crea un nuevo registro
- Si existe, actualiza el registro existente
- Guarda DNI en `user_metadata` si el campo no existe en la tabla
- Muestra mensaje de confirmación
- Recarga los datos del usuario en el widget

---

## 🗄️ Estructura de Datos en Supabase

### **Tabla: `compradores`**

```sql
- user_id (UUID) - Referencia a auth.users
- nombre_completo (TEXT)
- email (TEXT)
- telefono (TEXT) - Se actualiza desde el formulario
- direccion_principal (JSONB) - Estructura:
  {
    "calle": "...",
    "ciudad": "...",
    "provincia": "...",
    "codigo_postal": "...",
    "pais": "Argentina"
  }
- dni (TEXT) - OPCIONAL - Ver archivo AGREGAR-DNI-COMPRADORES.sql
```

### **Si el campo DNI no existe en la tabla:**
- El DNI se guardará automáticamente en `user_metadata` de Supabase Auth
- Funciona igual de bien, solo que en otra ubicación
- Es seguro y privado

---

## 📋 Archivos Modificados

1. **`demo-buyer-interface.html`**
   - ✅ Corregido botón "Ir al Inicio" (ruta relativa)
   - ✅ Agregada nueva tarjeta "Editar Mi Perfil" en "Mi Cuenta"
   - ✅ Agregada sección completa `#editar-perfil-section` con formulario
   - ✅ Agregadas funciones JavaScript: `abrirEditarPerfil`, `cerrarEditarPerfil`, `cargarDatosPerfil`, `guardarPerfil`
   - ✅ Mejorada navegación para ocultar secciones correctamente

---

## 📄 Archivos Nuevos

1. **`AGREGAR-DNI-COMPRADORES.sql`**
   - Script SQL opcional para agregar campo DNI a la tabla `compradores`
   - Solo ejecutar si querés tener el DNI en la tabla en lugar de `user_metadata`

---

## ✅ Validaciones Implementadas

- ✅ Teléfono es requerido
- ✅ Calle, Ciudad y Provincia son requeridos
- ✅ Código Postal es opcional
- ✅ DNI es opcional
- ✅ Email no se puede editar (solo lectura)

---

## 🧪 Cómo Probar

1. **Acceder al perfil:**
   - Ir a `demo-buyer-interface.html`
   - Hacer clic en "Mi Cuenta" en el navbar
   - Ver la nueva tarjeta "Editar Mi Perfil"

2. **Editar perfil:**
   - Hacer clic en "Editar Perfil"
   - Completar los campos
   - Hacer clic en "Guardar Cambios"
   - Verificar mensaje de confirmación

3. **Verificar "Ir al Inicio":**
   - Hacer clic en "Ir al Inicio" en el navbar
   - Verificar que redirige a `index-cresalia.html` sin cerrar sesión

---

## 💡 Notas Importantes

- **DNI:** Si la columna `dni` no existe en la tabla `compradores`, el sistema guardará el DNI en `user_metadata` automáticamente. Ambos métodos son válidos y seguros.
- **Email:** El email no se puede cambiar desde esta interfaz por seguridad. Si un usuario necesita cambiar su email, debe contactar a soporte.
- **Dirección:** Se guarda como JSONB en `direccion_principal` con estructura estándar.
- **Sesión:** El botón "Ir al Inicio" NO cierra la sesión, solo navega a la página principal.

---

¿Querés probar la funcionalidad ahora? 😊💜
