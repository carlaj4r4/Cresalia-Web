# 📧 Nota: Widget de Brevo

## Sobre el Widget de Brevo

El widget de Brevo (anteriormente Sendinblue) es una herramienta de email marketing que permite:
- **Formularios de suscripción**: Para que los usuarios se suscriban a newsletters
- **Pop-ups de email**: Para capturar emails de visitantes
- **Chat de email**: Para contacto directo con los usuarios

---

## ¿Dónde debería aparecer?

Actualmente, **NO hay un widget de Brevo implementado** en ninguna de las páginas. Si ves un widget de Brevo en `tiendas/ejemplo-tienda/index.html`, probablemente sea:

1. **Un formulario de contacto/email** que debería estar integrado con Brevo
2. **Un pop-up de suscripción** que debería estar conectado con Brevo
3. **Un chat de email** que debería estar integrado con Brevo

---

## ¿Cómo agregar el Widget de Brevo?

### Opción 1: Widget de Email Marketing (Newsletter)

Si querés agregar un formulario de suscripción a newsletter:

1. **Configurá Brevo:**
   - Andá a: https://app.brevo.com/
   - Creá una lista de contactos
   - Obtené tu API Key

2. **Agregá el formulario en las páginas:**
   - En `index-cresalia.html` (página principal)
   - En `demo-buyer-interface.html` (interfaz de compradores)
   - En `tiendas/ejemplo-tienda/index.html` (página de tienda)

3. **Integrá con Brevo:**
   - Usá la API de Brevo para suscribir usuarios
   - Guardá los emails en tu lista de contactos

---

### Opción 2: Pop-up de Email (Onboarding)

Si querés agregar un pop-up para capturar emails:

1. **Configurá Brevo:**
   - Andá a: https://app.brevo.com/
   - Creá un formulario de suscripción
   - Obtené el código del widget

2. **Agregá el código en las páginas:**
   - En `index-cresalia.html`
   - En `demo-buyer-interface.html`
   - En `tiendas/ejemplo-tienda/index.html`

---

### Opción 3: Chat de Email

Si querés agregar un chat de email:

1. **Configurá Brevo:**
   - Andá a: https://app.brevo.com/
   - Activá el chat de email
   - Obtené el código del widget

2. **Agregá el código en las páginas:**
   - En `index-cresalia.html`
   - En `demo-buyer-interface.html`
   - En `tiendas/ejemplo-tienda/index.html`

---

## ¿Querés que lo agreguemos?

Si querés que agregue el widget de Brevo en todas las páginas, decime:

1. **¿Qué tipo de widget querés?**
   - Formulario de suscripción (newsletter)
   - Pop-up de email (onboarding)
   - Chat de email
   - Otro tipo de widget

2. **¿En qué páginas querés que aparezca?**
   - `index-cresalia.html` (página principal)
   - `demo-buyer-interface.html` (interfaz de compradores)
   - `tiendas/ejemplo-tienda/index.html` (página de tienda)
   - Todas las páginas

3. **¿Tenés las credenciales de Brevo?**
   - API Key
   - Lista de contactos
   - Código del widget (si usás pop-up o chat)

---

## Nota Importante

**Brevo ya está configurado en el backend** para enviar emails automáticos (cumpleaños, aniversarios, etc.). El widget de Brevo sería para **capturar emails de usuarios** que visitan las páginas, no para enviar emails automáticos.

Si querés que agregue el widget de Brevo, decime y lo implemento en todas las páginas que necesites. 💜


