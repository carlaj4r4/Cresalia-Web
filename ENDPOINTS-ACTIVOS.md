# 📋 Endpoints Activos en Vercel

## Estado Actual: 13 endpoints (Límite: 12)

### Lista de Endpoints:

1. ✅ `api/admin.js` - Panel de administración
2. ✅ `api/ai-chat.js` - Chatbot IA
3. ⚠️ `api/aniversarios.js` - **REDUNDANTE** (consolidado en celebraciones.js)
4. ✅ `api/celebraciones.js` - **NUEVO** (consolida: cumpleaños, aniversarios, historias)
5. ⚠️ `api/compradores-cumple-consent.js` - **REDUNDANTE** (consolidado en celebraciones.js)
6. ✅ `api/comunidades-api.js` - API de comunidades
7. ✅ `api/enviar-email-brevo.js` - Envío de emails
8. ✅ `api/enviar-push-notification.js` - Push notifications
9. ✅ `api/jobs.js` - Sistema de trabajos
10. ✅ `api/mantenimiento.js` - Mantenimiento del sistema
11. ✅ `api/mercadopago-preference.js` - Preferencias de Mercado Pago
12. ✅ `api/support.js` - Soporte al usuario
13. ✅ `api/webhook-mercadopago.js` - Webhook de Mercado Pago

## 🔧 Solución: Eliminar Redundantes

### Endpoints a Eliminar:
- ❌ `api/aniversarios.js` → Funcionalidad movida a `api/celebraciones.js?tipo=aniversario`
- ❌ `api/compradores-cumple-consent.js` → Funcionalidad movida a `api/celebraciones.js?tipo=cumpleanos`

### Resultado Final: 11 endpoints ✅

## 📝 Migración de URLs

### Antes → Después:

**Aniversarios:**
- `GET /api/aniversarios?action=celebracion&tipo=tienda&slug=...`
- → `GET /api/celebraciones?tipo=aniversario&action=celebracion&tipo=tienda&slug=...`

**Cumpleaños:**
- `GET /api/compradores-cumple-consent?email=...`
- → `GET /api/celebraciones?tipo=cumpleanos&action=consent&email=...`

- `POST /api/compradores-cumple-consent`
- → `POST /api/celebraciones?tipo=cumpleanos&action=consent`
