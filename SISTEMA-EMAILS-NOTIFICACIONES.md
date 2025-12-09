# 📧 Sistema de Emails y Notificaciones - Cresalia

## ¿Cómo funciona el sistema de emails?

### 1. **Infraestructura**
- **Proveedor**: Brevo (anteriormente Sendinblue)
- **Endpoint**: `/api/enviar-email-brevo` (API route en Vercel)
- **Método**: POST request con JSON

### 2. **Flujo de envío**

```
Usuario reporta alerta → Sistema verifica ubicación → 
Si hay alerta cercana → Solicita email (opcional) → 
Envía email vía Brevo API → Guarda log de envío
```

### 3. **Cuándo se envían emails**

**Transporte Público:**
- ✅ Cortes de servicio
- ✅ Cambios de recorrido  
- ✅ Tardanzas / Demoras
- ❌ **NO se envían por aumentos de tarifas**

**Servicios Públicos:**
- ✅ Cortes de luz
- ✅ Cortes de agua
- ✅ Cortes de gas

### 4. **Requisitos para recibir emails**

1. **Email ingresado** (opcional en el formulario)
2. **Permisos de ubicación** concedidos
3. **Alerta cercana** (dentro de 20 km de radio)
4. **Tipo de alerta** que se notifica (ver arriba)

### 5. **Cómo verificar que se enviaron**

#### Opción 1: Consola del navegador
Abre la consola (F12) y busca:
```
✅ Email de alerta enviado exitosamente: { email: "...", alertaId: "...", ... }
```

#### Opción 2: Logs en localStorage
Los logs se guardan en `localStorage` con la clave `cresalia_logs_emails`.

Para verlos en la consola:
```javascript
// Ver todos los logs
JSON.parse(localStorage.getItem('cresalia_logs_emails') || '[]')

// Ver solo los enviados exitosamente
JSON.parse(localStorage.getItem('cresalia_logs_emails') || '[]')
  .filter(log => log.estado === 'enviado')
```

#### Opción 3: Verificar en Brevo
1. Inicia sesión en [Brevo](https://app.brevo.com)
2. Ve a "Email" → "Campaigns" o "Statistics"
3. Verás los emails enviados con detalles

### 6. **Estructura del email**

Cada email incluye:
- **Asunto**: Tipo de alerta + ubicación
- **Contenido HTML**: 
  - Tipo de alerta
  - Medio de transporte / Servicio
  - Ubicación (ciudad, provincia)
  - Línea/ruta (si aplica)
  - Descripción completa
  - Link directo a la comunidad
- **Template type**: `alerta-transporte` o `alerta-servicios`

### 7. **Privacidad**

- ✅ El email **NO se muestra** en los reportes públicos
- ✅ Solo se usa para enviar notificaciones
- ✅ Se guarda en `localStorage` del navegador (local)
- ✅ No se comparte con otros usuarios
- ✅ El usuario puede elegir si ingresarlo o no

### 8. **Notificaciones Push**

Además de emails, también se envían notificaciones push del navegador:
- Requieren permisos de notificación
- Aparecen como notificaciones del sistema
- Al hacer click, abren la comunidad correspondiente

### 9. **Solución de problemas**

**No recibo emails:**
1. Verifica que ingresaste tu email en el formulario
2. Verifica que permitiste ubicación
3. Verifica que hay alertas cercanas (20 km)
4. Revisa la consola del navegador para errores
5. Verifica los logs en localStorage

**Error al enviar:**
- Revisa la consola para el error específico
- Verifica que la API de Brevo esté configurada en Vercel
- Verifica que el endpoint `/api/enviar-email-brevo` exista

### 10. **Configuración técnica**

El sistema usa:
- **Brevo API**: Para envío de emails transaccionales
- **API Route en Vercel**: `/api/enviar-email-brevo`
- **localStorage**: Para guardar email y logs
- **Geolocalización**: Para calcular distancia

---

**Nota**: Este sistema está diseñado para ser privado y no competitivo. Las insignias son solo para el usuario, y el email nunca se muestra públicamente.

