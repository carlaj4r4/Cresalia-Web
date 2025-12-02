# 🔑 Guía de Acceso a Paneles - Cresalia

**Fecha:** 2025-01-27

---

## 📋 **Resumen de Paneles**

### 🎯 **Panel Master (panel-master-cresalia.html)**
**Propósito:** Panel principal para gestionar notificaciones personalizadas y alertas de emergencias

**Ubicación:** `/panel-master-cresalia.html`

**Contraseña:** `CRESALIA2025!`

**Funciones:**
- 📢 Gestionar notificaciones personalizadas para todo el SaaS
- 🚨 Configurar alertas de emergencias
- 📊 Ver estadísticas generales
- 👥 Gestionar usuarios (compradores, tiendas, servicios)

**Cómo acceder:**
1. Abrir `panel-master-cresalia.html` en tu navegador
2. Ingresar la contraseña: `CRESALIA2025!`
3. Hacer clic en "Acceder al Panel"

---

### 👑 **Super Admin Dashboard (super-admin/dashboard.html)**
**Propósito:** Dashboard para gestión de tenants, reportes consolidados y métricas globales

**Ubicación:** `/super-admin/dashboard.html`

**Código de acceso:** `CRESALIA_MASTER_2025`

**Funciones:**
- 📊 Ver métricas globales (MRR, tenants activos, etc.)
- 🏢 Gestionar tenants (suspend/activate/change plan)
- 📈 Ver reportes consolidados
- 💰 Gestionar suscripciones y facturación

**Cómo acceder - Método 1 (Hotkey):**
1. Ir a cualquier página del sitio (ej: `index-cresalia.html`)
2. Presionar: `Ctrl + Alt + Shift + S` (las 4 teclas juntas)
3. Se abrirá un modal pidiendo el código
4. Ingresar: `CRESALIA_MASTER_2025`
5. Hacer clic en "Acceder"
6. Serás redirigido automáticamente a `/super-admin/dashboard.html`

**Cómo acceder - Método 2 (Directo):**
1. Abrir directamente `/super-admin/dashboard.html`
2. Si no estás autenticado, serás redirigido al home
3. Usar el Método 1 (Hotkey) para autenticarte primero

---

### 🔐 **Panel de Administración General (admin-cresalia.html)**
**Propósito:** Panel de administración general para gestión del SaaS

**Ubicación:** `/admin-cresalia.html`

**Contraseña:** `CRESALIA2025!`

**Funciones:**
- 📊 Dashboard general
- 🛍️ Gestión de productos y servicios
- 👥 Gestión de usuarios
- ⚙️ Configuraciones generales

---

### 🛡️ **Panel de Seguridad (panel-seguridad-monitor.html)**
**Propósito:** Monitoreo de seguridad y auditoría

**Ubicación:** `/panel-seguridad-monitor.html`

**Nota:** Este panel no requiere autenticación adicional, pero puede tener sus propias protecciones.

---

### 💜 **Panel de Bienestar Emocional (crisla-respaldo-emocional.html)**
**Propósito:** Centro de crisis emocional y apoyo a vendedores

**Ubicación:** `/crisla-respaldo-emocional.html`

**Nota:** Este panel se enfoca en urgencias emocionales y alertas automáticas.

---

## 🔑 **Credenciales Resumidas**

| Panel | Contraseña/Código | Método de Acceso |
|-------|-------------------|------------------|
| **Panel Master** | `CRESALIA2025!` | Abrir página directamente |
| **Super Admin** | `CRESALIA_MASTER_2025` | Hotkey: `Ctrl+Alt+Shift+S` |
| **Admin General** | `CRESALIA2025!` | Abrir página directamente |

---

## ⚠️ **Problemas Comunes**

### ❌ "Acceso denegado" en Super Admin Dashboard

**Solución:**
1. Asegúrate de estar autenticado primero usando el hotkey (`Ctrl+Alt+Shift+S`)
2. Verifica que estés usando el código correcto: `CRESALIA_MASTER_2025`
3. La sesión expira después de 30 minutos, vuelve a autenticarte si pasó mucho tiempo

### ❌ Panel Master no muestra la contraseña

**Solución:**
1. Verifica que `config-privado.js` esté cargado (debe estar en el HTML)
2. La contraseña es: `CRESALIA2025!`
3. Si no funciona, verifica que el archivo `config-privado.js` tenga la contraseña correcta

### ❌ Redirecciones a paneles incorrectos

**Solución:**
- Algunos paneles pueden estar redirigiendo automáticamente
- Usa los accesos directos documentados arriba
- Si un panel te redirige, verifica que estés usando la URL correcta

---

## 🚀 **Recomendaciones**

1. **Guardar accesos:** Guarda estas credenciales en un gestor de contraseñas seguro
2. **Uso de hotkeys:** El hotkey del Super Admin funciona desde cualquier página que cargue `security-config-updated.js`
3. **Sesiones:** Las sesiones del Super Admin duran 30 minutos, luego expiran automáticamente
4. **Múltiples paneles:** Podés tener varios paneles abiertos al mismo tiempo en diferentes pestañas

---

## 📝 **Notas Técnicas**

- **Panel Master** usa `config-privado.js` para la contraseña
- **Super Admin** usa `security-config-updated.js` para el sistema de autenticación
- Ambos sistemas son independientes y pueden tener diferentes contraseñas
- La autenticación del Super Admin se guarda en `sessionStorage` (se borra al cerrar la pestaña)

---

**Última actualización:** 2025-01-27  
**Mantenido por:** Equipo Cresalia 💜


