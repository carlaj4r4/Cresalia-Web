# 📧 Guía: Sistema de Emails Automáticos para Alertas

## ✅ Lo Que Implementamos

Tu sistema ahora puede:

1. ✅ **Pedir consentimiento** a usuarios para compartir ubicación
2. ✅ **Guardar ubicaciones** de usuarios en Supabase
3. ✅ **Enviar emails automáticos** cuando se crea una alerta
4. ✅ **Filtrar por proximidad** (global vs local)
5. ✅ **Usar tu API de Brevo** que ya está en Vercel

---

## 📋 PASO 1: Instalar SQL en Supabase

### **En AMBOS Proyectos** (E-commerce y Comunidades)

1. Abrir Supabase → SQL Editor
2. Copiar TODO de: `SUPABASE-UBICACIONES-USUARIOS-ALERTAS.sql`
3. Pegar → RUN

✅ Esto crea:
- Tabla `usuarios_ubicaciones_alertas` (guarda ubicaciones con consentimiento)
- Tabla `alertas_emails_enviados` (log de emails enviados)
- Función `buscar_usuarios_en_radio_alerta()` (encuentra usuarios cercanos)
- Trigger automático para nuevas alertas

---

## 📋 PASO 2: Agregar Scripts JavaScript

### **2.1 En `index-cresalia.html`**

Agregar antes de `</body>`:

```html
<!-- Sistema de Registro de Ubicación -->
<script src="/js/sistema-registro-ubicacion-alertas.js"></script>

<!-- Sistema de Envío de Emails -->
<script src="/js/sistema-envio-emails-alertas.js"></script>
```

### **2.2 En `demo-buyer-interface.html`**

Lo mismo:

```html
<script src="/js/sistema-registro-ubicacion-alertas.js"></script>
<script src="/js/sistema-envio-emails-alertas.js"></script>
```

### **2.3 En Panel Master (donde se crean alertas)**

```html
<script src="/js/sistema-envio-emails-alertas.js"></script>
```

---

## 📋 PASO 3: Configurar Variables de Entorno en Vercel

Vercel → Settings → Environment Variables

**Agregar**:
```
BREVO_API_KEY = tu_api_key_actual
BREVO_SENDER_EMAIL = alertas@cresalia.com
SUPABASE_SERVICE_ROLE_KEY = tu_service_role_key
```

**Dónde encontrar**:
- `BREVO_API_KEY`: Ya la tenés configurada
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase → Settings → API → service_role key

---

## 🎯 Cómo Funciona

### **Flujo Completo**:

1. **Usuario visita tu sitio**
   - Ve un modal preguntando si quiere recibir alertas
   - Acepta y comparte su ubicación
   - Se guarda en `usuarios_ubicaciones_alertas`

2. **Admin crea una alerta** (desde Panel Master)
   - Se guarda en `alertas_emergencia_comunidades`
   - Trigger automático detecta la nueva alerta

3. **Sistema busca usuarios** a notificar
   - Si es **global**: TODOS los que aceptaron alertas globales
   - Si es **local**: Solo los dentro del radio

4. **API envía emails** vía Brevo
   - Template bonito con toda la info
   - Botones de acción según el tipo de alerta
   - Se registra en `alertas_emails_enviados`

5. **Usuario recibe email**
   - Email profesional con toda la información
   - Botones para ayudar (si es global)
   - Info de ubicación y severidad

---

## 📧 Ejemplo de Email que Recibirán

**Subject**: 🌊 ALERTA CRÍTICA: Inundación en Buenos Aires

**Contenido**:
- Banner con icono y severidad
- Descripción detallada
- Tiempo sin servicio (si aplica)
- Botones de "Donar" (si es global)
- Ubicación y radio de afectación
- Link a información oficial

---

## 🔒 Privacidad y Consentimiento

El sistema **respeta completamente** la privacidad:

✅ **Consentimiento explícito**: Modal claro explicando todo
✅ **Opt-in**: Solo reciben los que aceptaron
✅ **Revocable**: Pueden deshabilitar cuando quieran
✅ **Configuración**: Eligen qué tipos de alertas recibir
✅ **Radio personalizado**: Cada usuario define su radio

---

## 🎨 Personalización

### **Usuarios Pueden Configurar**:

```javascript
// Activar/desactivar alertas globales
sistemaUbicacionAlertas.actualizarConfiguracion({
    alertas_globales: true,
    alertas_locales: true,
    alertas_criticas_solo: false,
    radio_alertas_km: 10
});
```

### **Admin Puede**:

- Crear alertas normales (se envían emails automáticamente)
- Reenviar emails de una alerta: `sistemaEnvioEmailsAlertas.reenviarEmails(alertaId)`

---

## 📊 Estadísticas

### **Ver cuántos usuarios registrados**:

```sql
SELECT 
    COUNT(*) as total_usuarios,
    COUNT(*) FILTER (WHERE acepto_recibir_alertas = true) as aceptan_alertas,
    COUNT(*) FILTER (WHERE alertas_globales = true) as quieren_globales
FROM usuarios_ubicaciones_alertas;
```

### **Ver emails enviados de una alerta**:

```sql
SELECT * FROM alertas_emails_enviados 
WHERE alerta_id = 123
ORDER BY fecha_envio DESC;
```

---

## ⚡ Rendimiento

El sistema está optimizado:

- ✅ **Índices** en todas las consultas importantes
- ✅ **Envío en lotes** (50 emails por request a Brevo)
- ✅ **Pausa entre lotes** para no saturar la API
- ✅ **Async/await** para no bloquear

---

## 🐛 Troubleshooting

### **"No se envían emails"**

1. Verificar que `BREVO_API_KEY` esté en Vercel
2. Verificar logs: Vercel → Functions → Ver logs
3. Verificar en Supabase: `SELECT * FROM alertas_emails_enviados`

### **"Los usuarios no ven el modal"**

1. Verificar que el script esté cargado
2. Abrir consola: debería ver "📍 Inicializando sistema de registro de ubicación..."
3. Limpiar localStorage: `localStorage.removeItem('alertas_ubicacion_consentimiento')`

### **"Error de permisos en RLS"**

El API usa `SUPABASE_SERVICE_ROLE_KEY` que bypasea RLS automáticamente.

---

## 🚀 Próximos Pasos Opcionales

Podrías agregar:

1. **Dashboard de estadísticas**: Cuántos emails enviados, tasa de apertura
2. **Notificaciones push**: Complementar los emails
3. **SMS**: Para alertas críticas
4. **Historial**: Los usuarios ven alertas pasadas que recibieron

---

## 💜 Resumen Ultra Simple

```
1. Usuario acepta recibir alertas → Se guarda su ubicación
2. Admin crea alerta → Trigger automático
3. Sistema busca usuarios cercanos
4. API envía emails vía Brevo
5. Usuarios reciben notificación profesional
```

**TODO automático, ninguna intervención manual** ✅

---

¿Necesitás ayuda con la instalación? 😊
