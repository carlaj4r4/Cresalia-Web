# 📧 Sistema de Emails de Emergencia - Implementación Completa

## ✅ Resumen de Implementación

### 🎯 Funcionalidades Implementadas:

1. **Guardado de Ubicación** ✅
   - Se guarda en `localStorage` cuando el usuario acepta verificación
   - Se guarda en Supabase (`ubicaciones_usuarios_emergencias`) si está disponible
   - Se guarda email opcional si el usuario lo proporciona

2. **Modal Mejorado de Check-in** ✅
   - Opción nueva: "Conozco personas que no están bien"
   - Mensaje claro: Cresalia no ofrece recursos directamente, todo depende de la comunidad
   - Redirección automática a comunidad de emergencias

3. **API de Emails Masivos** ✅
   - Endpoint: `/api/emergencias-enviar-emails.js`
   - Envía emails según ubicación del usuario
   - Filtra por zona afectada si hay coordenadas

4. **Redirección a Comunidades** ✅
   - Redirige automáticamente según el estado del usuario
   - Incluye parámetros en la URL para contexto

---

## 📍 Ubicación del Sistema

### ✅ El sistema está activo en:

1. **Páginas Principales:**
   - ✅ `index-cresalia.html` (página principal)
   - ✅ `cresalia-jobs/index.html`
   - ✅ `cresalia-solidario/index.html`
   - ✅ `cresalia-solidario-emergencias/index.html`

2. **Todas las Comunidades (23+):**
   - ✅ Todas las comunidades tienen el script `sistema-checkin-emergencias.js`
   - ✅ Se inicializa automáticamente cuando hay emergencias activas

---

## 🔧 Componentes Creados

### 1. **Tabla SQL: `ubicaciones_usuarios_emergencias`**
- Almacena ubicaciones de usuarios (anónimo, por hash)
- Permite guardar email opcional
- Índices para búsquedas rápidas
- RLS configurado

**Archivo:** `supabase-ubicaciones-emergencias.sql`

### 2. **API de Emails: `emergencias-enviar-emails.js`**
- Endpoint: `POST /api/emergencias-enviar-emails`
- Envía emails masivos según ubicación
- Filtra por zona afectada
- Usa Brevo para envío

**Archivo:** `api/emergencias-enviar-emails.js`

### 3. **Mejoras en Check-in:**
- Nueva opción "Conozco personas que no están bien"
- Mensaje sobre recursos comunitarios
- Redirección automática

**Archivo:** `js/sistema-checkin-emergencias.js`

---

## 📧 Cómo Enviar Emails Masivos

### Desde el Panel Master o API:

```javascript
// Ejemplo de llamada a la API
fetch('/api/emergencias-enviar-emails', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        campana_id: 'uuid-de-la-campana',
        tipo_envio: 'zona_afectada' // o 'todos'
    })
});
```

### Parámetros:
- `campana_id` (requerido): ID de la campaña de emergencia activa
- `tipo_envio` (opcional): 
  - `'zona_afectada'`: Solo usuarios en la zona afectada
  - `'todos'`: Todos los usuarios con ubicación guardada

---

## 💌 Contenido del Email

El email incluye:

1. **Header:** Título de la emergencia, tipo y ubicación
2. **Alerta:** Información sobre la emergencia activa
3. **Opciones:** Qué puede hacer el usuario
4. **Mensaje Importante:** Cresalia no ofrece recursos directamente, todo depende de la comunidad
5. **Botón CTA:** Redirige a la comunidad de emergencias
6. **Footer:** Mensaje solidario

**Características:**
- ✅ Diseño responsive
- ✅ Colores de alerta (rojo)
- ✅ Mensaje claro y respetuoso
- ✅ Link directo a la comunidad

---

## 🔐 Privacidad y Consentimiento

✅ **Sistema Anónimo:**
- Usa hash único (no identifica usuarios)
- Email opcional (solo si lo proporciona)
- Consentimiento explícito requerido

✅ **Control del Usuario:**
- Puede rechazar verificación de ubicación
- Puede decidir no recibir emails
- Preferencia guardada en localStorage

---

## 📊 Flujo Completo

```
1. Usuario visita cualquier página con el sistema
   ↓
2. Sistema detecta emergencia activa
   ↓
3. Muestra modal de consentimiento
   ↓
4. Si acepta → Solicita ubicación → Guarda en localStorage y Supabase
   ↓
5. Verifica si está en zona afectada
   ↓
6. Muestra modal de check-in (urgente si está en zona)
   ↓
7. Usuario completa check-in:
   - Estoy bien → Redirige a comunidad de emergencias
   - Necesito ayuda → Redirige a comunidad de emergencias
   - Conozco personas → Redirige a comunidad de emergencias
   ↓
8. Admin envía emails masivos según ubicación (si lo desea)
   ↓
9. Usuarios reciben email con link a comunidad
```

---

## 🚀 Próximos Pasos (Opcional)

1. **Panel Master:**
   - Agregar botón "Enviar emails de emergencia"
   - Seleccionar campaña activa
   - Ver estadísticas de envío

2. **Mejoras:**
   - Guardar email cuando usuario lo proporciona en check-in
   - Notificaciones push (si se implementa)
   - Integración con WhatsApp (futuro)

---

## ⚙️ Configuración

### Variables de Entorno Necesarias:
- `BREVO_API_KEY`: Clave API de Brevo
- `SUPABASE_URL`: URL de Supabase
- `SUPABASE_ANON_KEY`: Clave anónima de Supabase
- `PLATAFORMA_URL`: URL de la plataforma (opcional, por defecto cresalia.com)

---

## 📝 Notas Importantes

1. **Cresalia no ofrece recursos directamente:**
   - El mensaje está claro en el modal y en los emails
   - Todo depende de la solidaridad de la comunidad
   - Se redirige a comunidades donde pueden encontrar ayuda

2. **Sistema Anónimo:**
   - No identifica usuarios por nombre
   - Usa hash único
   - Email opcional

3. **Consentimiento:**
   - Siempre con permiso explícito del usuario
   - Puede rechazar en cualquier momento
   - Preferencia guardada

---

**Última actualización**: Diciembre 2024  
**Autor**: Claude (co-fundador de Cresalia)  
**Estado**: ✅ Implementación completada


