# 🛠️ Sistema de Mantenimiento - Cresalia

**Fecha:** 2025-01-27

---

## 🎯 **Propósito**

Sistema completo para gestionar el mantenimiento de la plataforma Cresalia, incluyendo:
- ✅ Página de mantenimiento bonita y educada
- ✅ Notificación automática por email a usuarios registrados
- ✅ Redirección automática de usuarios a la página de mantenimiento
- ✅ Panel de gestión desde el Panel Master

---

## 📋 **Componentes**

### 1. **Página de Mantenimiento (`mantenimiento.html`)**
Página bonita que se muestra a los usuarios cuando la plataforma está en mantenimiento.

**Características:**
- 🎨 Diseño moderno y educado
- 💜 Mensaje agradecido y comprensivo
- ⏰ Verificación automática cada 30 segundos
- 📧 Información de contacto

---

### 2. **API de Estado (`api/mantenimiento-estado.js`)**
Endpoint para obtener y actualizar el estado de mantenimiento.

**Endpoints:**
- `GET /api/mantenimiento/estado` - Obtener estado actual
- `POST /api/mantenimiento/estado` - Actualizar estado

**Payload POST:**
```json
{
  "activo": true,
  "mensaje": "Mensaje personalizado opcional",
  "fechaFinEstimada": "2025-01-27T15:00:00Z"
}
```

---

### 3. **API de Notificación (`api/mantenimiento-notificar.js`)**
Endpoint para enviar emails a usuarios registrados cuando se activa el mantenimiento.

**Endpoint:**
- `POST /api/mantenimiento/notificar`

**Características:**
- 📧 Envía emails a todos los usuarios registrados (compradores y tiendas)
- 💌 Mensaje educado, agradecido y comprensivo
- 📝 Incluye mensaje personalizado si se proporciona
- 📅 Incluye fecha estimada de fin si se proporciona

---

### 4. **Sistema de Verificación (`js/sistema-mantenimiento.js`)**
Script que verifica automáticamente si el mantenimiento está activo y redirige a los usuarios.

**Características:**
- ✅ Verifica cada 1 minuto
- 🔄 Redirige automáticamente si el mantenimiento está activo
- 🚫 Excluye rutas de API, assets, etc.
- ⚡ No intrusivo

---

### 5. **Panel de Gestión (`js/gestion-mantenimiento.js`)**
Sistema para gestionar el mantenimiento desde el Panel Master.

**Funcionalidades:**
- 👀 Ver estado actual
- 🔧 Activar/desactivar mantenimiento
- 📝 Agregar mensaje personalizado
- 📅 Establecer fecha estimada de fin
- 📧 Enviar notificaciones automáticamente

---

## 🚀 **Cómo Usar**

### **Paso 1: Configurar Variables de Entorno**

En Vercel, agregar:
```env
BREVO_API_KEY=tu_api_key_de_brevo
ADMIN_EMAIL=cresalia25@gmail.com
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_key_de_supabase
```

### **Paso 2: Ejecutar SQL**

Ejecutar `supabase-mantenimiento-plataforma.sql` en Supabase para crear la tabla.

### **Paso 3: Activar Mantenimiento**

1. Ir a `panel-master-cresalia.html`
2. Iniciar sesión con: `CRESALIA2025!`
3. Ir a la sección "Mantenimiento"
4. Hacer clic en "Actualizar Estado"
5. Configurar:
   - ✅ Activar mantenimiento
   - 📅 (Opcional) Fecha fin estimada
   - 📝 (Opcional) Mensaje personalizado
6. Hacer clic en "Activar Mantenimiento"
7. Confirmar la acción

### **Paso 4: Desactivar Mantenimiento**

1. Ir a la sección "Mantenimiento" en el Panel Master
2. Hacer clic en "Desactivar Mantenimiento"
3. Confirmar la acción

---

## 📧 **Emails Enviados**

### **Contenido del Email:**

- ✅ **Título:** "🛠️ Mantenimiento Programado"
- ✅ **Saludo personalizado:** Con el nombre del usuario
- ✅ **Mensaje agradecido:** "Gracias por tu paciencia y comprensión"
- ✅ **Mensaje de disculpa:** "Lamentamos profundamente cualquier inconveniente"
- ✅ **Información adicional:** Si se proporciona mensaje personalizado
- ✅ **Fecha estimada:** Si se proporciona fecha de fin
- ✅ **Link a página de mantenimiento**
- ✅ **Contacto:** Email de soporte

### **Formato:**
- 🎨 HTML bonito con estilos
- 📱 Responsive
- 💜 Colores de marca Cresalia

---

## 🔧 **Integración en Páginas**

### **Agregar Verificación Automática:**

En cualquier página HTML, agregar antes de `</body>`:

```html
<!-- Sistema de Verificación de Mantenimiento -->
<script src="js/sistema-mantenimiento.js"></script>
```

**Páginas donde ya está integrado:**
- ✅ `index-cresalia.html`

**Páginas recomendadas para agregar:**
- `demo-buyer-interface.html`
- `panel-master-cresalia.html` (excluida automáticamente)
- Páginas de tiendas
- Comunidades

---

## ⚙️ **Configuración Avanzada**

### **Rutas Excluidas:**

Por defecto, estas rutas NO redirigen a mantenimiento:
- `/mantenimiento.html`
- `/api/`
- `/assets/`
- `/css/`
- `/js/`
- `/icons/`

Para agregar más rutas excluidas, editar `js/sistema-mantenimiento.js`:

```javascript
excluirRutas: [
    '/mantenimiento.html',
    '/api/',
    '/tu-ruta-personalizada/'
]
```

---

## 📊 **Base de Datos**

### **Tabla: `mantenimiento_plataforma`**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGSERIAL | ID único |
| `activo` | BOOLEAN | Estado del mantenimiento |
| `mensaje` | TEXT | Mensaje personalizado |
| `fecha_inicio` | TIMESTAMP | Fecha de inicio |
| `fecha_fin` | TIMESTAMP | Fecha de fin |
| `fecha_fin_estimada` | TIMESTAMP | Fecha estimada de fin |
| `creado_en` | TIMESTAMP | Fecha de creación |
| `actualizado_en` | TIMESTAMP | Última actualización |

---

## 🔐 **Seguridad**

- ✅ Solo administradores pueden activar/desactivar (vía Panel Master)
- ✅ RLS (Row Level Security) en Supabase: lectura pública, escritura solo para backend
- ✅ Validación de datos en APIs
- ✅ Manejo de errores robusto

---

## 📝 **Mensajes del Sistema**

### **Página de Mantenimiento:**
- 💜 "Gracias por tu paciencia y comprensión"
- 🙏 "Lamentamos profundamente cualquier inconveniente"
- 💜 "Estaremos de vuelta muy pronto"

### **Email:**
- 💌 Mensaje personalizado con nombre del usuario
- 📧 Educado, agradecido y comprensivo
- 🔗 Link a página de mantenimiento

---

## 🐛 **Troubleshooting**

### **Problema: No se redirige a mantenimiento**

**Solución:**
1. Verificar que `js/sistema-mantenimiento.js` esté cargado
2. Verificar que la ruta no esté excluida
3. Verificar estado en `/api/mantenimiento/estado`

### **Problema: No se envían emails**

**Solución:**
1. Verificar `BREVO_API_KEY` en Vercel
2. Verificar logs en Vercel
3. Verificar que haya usuarios registrados con email

### **Problema: Panel no muestra estado**

**Solución:**
1. Verificar que `js/gestion-mantenimiento.js` esté cargado
2. Verificar conexión con API
3. Revisar consola del navegador

---

## 🎨 **Personalización**

### **Mensaje de la Página:**

Editar `mantenimiento.html` para cambiar los mensajes.

### **Mensaje del Email:**

Editar `api/mantenimiento-notificar.js`, función `enviarNotificaciones()`.

---

## ✅ **Checklist de Implementación**

- [ ] Ejecutar SQL en Supabase
- [ ] Configurar variables de entorno en Vercel
- [ ] Agregar `js/sistema-mantenimiento.js` a páginas principales
- [ ] Probar activación/desactivación desde Panel Master
- [ ] Verificar que se envíen emails correctamente
- [ ] Verificar redirección automática

---

**Última actualización:** 2025-01-27  
**Mantenido por:** Equipo Cresalia 💜



