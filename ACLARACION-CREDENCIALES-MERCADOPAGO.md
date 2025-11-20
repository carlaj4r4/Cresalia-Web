# 🔑 Aclaración: Credenciales de Mercado Pago

## ❓ ¿Por qué hay DOS variables diferentes?

Mercado Pago te da **DOS credenciales diferentes**:

### 1️⃣ Public Key (Clave Pública)
- **Nombre en Vercel**: `MERCADOPAGO_PUBLIC_KEY`
- **Empieza con**: `APP_USR-...` (producción) o `TEST-...` (sandbox)
- **Ejemplo**: `APP_USR-12345678-12345678901234567890123456789012-123456-12345678901234567890123456789012-12345678`
- **¿Para qué se usa?**
  - Se usa en el **frontend** (navegador del cliente)
  - Es **segura de compartir** (puede estar en el código)
  - Se usa para inicializar el SDK de Mercado Pago en el navegador

### 2️⃣ Access Token (Token de Acceso)
- **Nombre en Vercel**: `MERCADOPAGO_ACCESS_TOKEN`
- **Empieza con**: `APP_USR-...` (producción) o `TEST-...` (sandbox)
- **Ejemplo**: `APP_USR-87654321-87654321098765432109876543210987-654321-87654321098765432109876543210987-87654321`
- **¿Para qué se usa?**
  - Se usa **SOLO en el backend** (servidor)
  - ⚠️ **ES SECRETA** - Nunca la compartas
  - Se usa para crear preferencias de pago, consultar pagos, etc.

### 🔍 ¿Son iguales?

**NO**, son **completamente diferentes**. Cada una tiene un propósito distinto:
- **Public Key**: Para el cliente (navegador)
- **Access Token**: Para el servidor (backend)

---

## ⏰ Duración de las Credenciales

### Credenciales de Prueba (TEST)
- **Duración**: **No expiran** (permanentes)
- **Uso**: Para testear antes de activar pagos reales
- **Empiezan con**: `TEST-...`
- **Ventaja**: Podés probar todo sin riesgo

### Credenciales de Producción (APP_USR)
- **Duración**: **Permanentes** (no expiran)
- **Uso**: Para recibir pagos reales
- **Empiezan con**: `APP_USR-...`
- **Importante**: Solo usalas cuando estés listo para recibir pagos reales

### 🔄 ¿Puedo cambiar de prueba a producción?

**Sí**, podés:
1. Usar credenciales de prueba para desarrollar
2. Cuando estés listo, cambiá a credenciales de producción
3. Solo cambiá las variables en Vercel y hacé un nuevo deploy

---

## 🌐 URL de Webhooks - ¿Se puede cambiar?

### ¿Qué es la URL de Webhook?

Es la URL donde Mercado Pago envía notificaciones cuando se completa un pago.

**Ejemplo**: `https://cresalia-web.vercel.app/api/webhook-mercadopago`

### ¿Se puede cambiar?

**Sí**, podés cambiarla cuando quieras:

1. **En Mercado Pago:**
   - Andá a **"Desarrolladores"** → **"Webhooks"**
   - Buscá tu webhook actual
   - Hacé clic en **"Editar"** o **"Modificar"**
   - Cambiá la URL
   - Guardá los cambios

2. **En el código:**
   - El endpoint ya está en: `api/webhook-mercadopago.js`
   - Si cambiás el dominio, actualizá la URL en Mercado Pago

### ⚠️ Importante

- **Una URL por vez**: Solo podés tener una URL activa
- **Verificación**: Mercado Pago verificará que la URL responda correctamente
- **Tiempo de actualización**: Los cambios pueden tardar unos minutos en aplicarse

---

## 🔒 Cambiar el Alias (Statement Descriptor)

### Paso a Paso

1. **Iniciá sesión en Mercado Pago:**
   - https://www.mercadopago.com.ar/
   - Ingresá con tu cuenta

2. **Accedé a Configuración:**
   - Menú lateral → **"Tu negocio"** → **"Configuración"**
   - O: **"Tu negocio"** → **"Pagos"** → **"Configuración"**

3. **Buscá "Descripción en estado de cuenta":**
   - También puede aparecer como:
     - "Statement Descriptor"
     - "Alias comercial"
     - "Descripción comercial"
     - "Nombre en estado de cuenta"

4. **Configurá tu alias:**
   - Escribí: **"CRESALIA"** (o el que prefieras)
   - **Límites:**
     - Máximo 22 caracteres
     - Solo letras, números y espacios
     - No caracteres especiales (@, #, $, etc.)

5. **Guardá los cambios:**
   - Hacé clic en **"Guardar"** o **"Aplicar"**
   - Esperá a que se guarde (puede tardar unos minutos)

6. **Verificá que esté configurado:**
   - Hacé un pago de prueba
   - Verificá en tu estado de cuenta que aparezca el alias
   - Si aparece tu nombre real, el alias no está configurado correctamente

### ⚠️ Nota Importante

- **Tiempo de actualización**: Los cambios pueden tardar hasta 24 horas en aplicarse
- **Verificación**: Hacé un pago de prueba para verificar que funcione
- **No uses tu nombre real**: Usá un alias genérico como "CRESALIA"

---

## 📊 Actualización de Comisiones

### Nueva Comisión de Mercado Pago: 6.17%

Las comisiones de Mercado Pago ahora son **6.17%** (actualizada 2024).

**Esto afecta:**
- ✅ Cálculos de comisiones en los paneles de las tiendas
- ✅ Ejemplos de transparencia de precios
- ✅ Desglose de comisiones para vendedores

**Se actualizará en:**
- `js/mercado-pago-integration.js`
- Paneles de administración de tiendas
- Cualquier lugar donde se muestren comisiones

---

## ❓ Sobre MCP Server

No encontré información específica sobre "MCP Server" en Mercado Pago. Podría ser:

1. **Model Context Protocol (MCP)**: Un protocolo de AI, no relacionado con Mercado Pago
2. **Error de tipeo**: Tal vez quisiste decir otra cosa
3. **Funcionalidad nueva**: Algo que no está documentado públicamente

**¿Podrías aclarar?**
- ¿Dónde viste mencionado "MCP Server"?
- ¿En qué contexto apareció?
- ¿Es algo que te pidió Mercado Pago o algo que viste en la documentación?

Con esa información, puedo ayudarte mejor. 💜

---

## ✅ Resumen Rápido

1. **Dos credenciales diferentes:**
   - `MERCADOPAGO_PUBLIC_KEY` (frontend)
   - `MERCADOPAGO_ACCESS_TOKEN` (backend)

2. **Credenciales de prueba:**
   - No expiran
   - Usalas para desarrollar

3. **URL de webhooks:**
   - Se puede cambiar cuando quieras
   - Actualizá en el panel de Mercado Pago

4. **Alias:**
   - Se cambia en "Tu negocio" → "Configuración"
   - Puede tardar hasta 24 horas en aplicarse

5. **Comisiones:**
   - Actualizadas a 6.9%
   - Se actualizarán en los paneles

---

¡Cualquier duda, preguntame! 💜


