# 📧 ACLARACIÓN: SISTEMA DE EMAILS AUTOMÁTICOS

**Para:** Carla (Co-fundadora de Cresalia)  
**Fecha:** Enero 2025

---

## ❓ ¿ES DE BREVO?

**SÍ, pero es diferente del widget de chat.**

### **Dos sistemas diferentes de Brevo:**

1. **`sistema-emails-automaticos.js`** ✅
   - **Propósito:** Enviar emails automáticos (felicitaciones, bienvenidas, etc.)
   - **Usa:** Brevo API (backend)
   - **Endpoint:** `/api/enviar-email-brevo` (Vercel Serverless Function)
   - **Cuándo se usa:** Automáticamente cuando hay eventos (cumpleaños, registros, etc.)

2. **`widget-brevo-chat.js`** ✅
   - **Propósito:** Widget de chat en vivo para atención al cliente
   - **Usa:** Brevo Conversations (frontend)
   - **CHAT_ID:** `690dfda549b4965c230fab76`
   - **Cuándo se usa:** Siempre visible en el panel de administración

---

## 🔍 DIFERENCIAS

| Característica | Sistema de Emails | Widget de Chat |
|----------------|-------------------|----------------|
| **Tipo** | Backend API | Frontend Widget |
| **Propósito** | Envío automático de emails | Chat en vivo |
| **Configuración** | API Key en Vercel | CHAT_ID en código |
| **Cuándo funciona** | Eventos automáticos | Siempre visible |
| **Requiere cuenta** | ✅ Sí (Brevo API) | ✅ Sí (Brevo Conversations) |

---

## ✅ RESUMEN

**Ambos usan Brevo, pero son servicios diferentes:**
- **Emails automáticos:** Para enviar emails programados
- **Widget de chat:** Para atención al cliente en tiempo real

**El mensaje "💜 Sistema de Emails Automáticos Cresalia inicializado" es normal** - significa que el sistema está listo para enviar emails automáticos cuando sea necesario.

---

**💜 Todo está funcionando correctamente.**



