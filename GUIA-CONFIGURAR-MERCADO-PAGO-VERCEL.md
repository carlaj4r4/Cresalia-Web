# 💳 Guía: Configurar Mercado Pago en Vercel

## Paso 1: Obtener Credenciales de Mercado Pago

1. **Iniciá sesión en Mercado Pago:**
   - Andá a: https://www.mercadopago.com.ar/
   - Ingresá con tu cuenta

2. **Accedé a Tus Credenciales:**
   - En el menú lateral, buscá **"Desarrolladores"** o **"Tu negocio"**
   - Hacé clic en **"Credenciales"** o **"Tus integraciones"**
   - Vas a ver dos tipos de credenciales:
     - **Credenciales de prueba (Sandbox)**: Para testear antes de activar
     - **Credenciales de producción**: Para recibir pagos reales

3. **Anotá estas dos claves:**
   - **Public Key** (Clave Pública): Empieza con `APP_USR-...`
   - **Access Token** (Token de Acceso): Empieza con `APP_USR-...`

---

## Paso 2: Configurar en Vercel

1. **Abrí tu proyecto en Vercel:**
   - Andá a: https://vercel.com/
   - Ingresá con tu cuenta
   - Seleccioná tu proyecto **"cresalia-web"**

2. **Accedé a Variables de Entorno:**
   - En el menú del proyecto, hacé clic en **"Settings"**
   - En el menú lateral, buscá **"Environment Variables"**
   - Hacé clic en **"Add New"**

3. **Agregá las siguientes variables:**

   **Para Producción:**
   ```
   MERCADOPAGO_PUBLIC_KEY = APP_USR-tu-clave-publica-aqui
   MERCADOPAGO_ACCESS_TOKEN = APP_USR-tu-access-token-aqui
   ```

   **Para Preview/Development (opcional):**
   ```
   MERCADOPAGO_PUBLIC_KEY = APP_USR-tu-clave-publica-sandbox
   MERCADOPAGO_ACCESS_TOKEN = APP_USR-tu-access-token-sandbox
   ```

4. **Seleccioná los entornos:**
   - Para **MERCADOPAGO_PUBLIC_KEY**: Marcá **Production**, **Preview**, y **Development**
   - Para **MERCADOPAGO_ACCESS_TOKEN**: Marcá **Production**, **Preview**, y **Development**

5. **Guardá los cambios:**
   - Hacé clic en **"Save"**
   - Esperá a que se guarden (puede tardar unos segundos)

---

## Paso 3: Re-deployar el Proyecto

1. **Hacé un nuevo deploy:**
   - Volvé a la pestaña **"Deployments"**
   - Hacé clic en los **"..."** (tres puntos) del último deploy
   - Seleccioná **"Redeploy"**
   - O simplemente hacé un nuevo commit en GitHub y se deployará automáticamente

2. **Verificá que las variables estén cargadas:**
   - En **"Settings" → "Environment Variables"**
   - Deberías ver tus variables listadas
   - Si no aparecen, esperá unos minutos y recargá la página

---

## Paso 4: Verificar que Funcione

1. **Probá en modo Sandbox primero:**
   - Usá las credenciales de prueba de Mercado Pago
   - Testeá el flujo de pago completo
   - Verificá que los pagos aparezcan en el panel de Mercado Pago (en modo sandbox)

2. **Cuando estés listo para producción:**
   - Cambiá las variables de entorno a las credenciales de producción
   - Hacé un nuevo deploy
   - Verificá que los pagos reales funcionen correctamente

---

## Notas Importantes

⚠️ **NO compartas tus credenciales:**
- Nunca las subas a GitHub
- Nunca las compartas públicamente
- Solo configurarlas en Vercel (variables de entorno)

🔒 **Seguridad:**
- Las credenciales de producción solo deberían estar en Vercel
- Las credenciales de prueba pueden estar en ambos (Vercel y código local)

💡 **Recordatorio:**
- Las comisiones de Mercado Pago se calculan según sus tarifas oficiales
- Todas las comisiones van a tu cuenta de Mercado Pago
- El sistema valida automáticamente las tarjetas para prevenir fraude

---

## ¿Necesitás Ayuda?

Si tenés problemas:
1. Verificá que las credenciales estén correctas
2. Verificá que las variables de entorno estén configuradas en Vercel
3. Verificá que hayas hecho un nuevo deploy después de agregar las variables
4. Revisá los logs de Vercel para ver si hay errores

---

## Siguiente Paso

Una vez que tengas las credenciales configuradas, el sistema de pagos funcionará automáticamente. Los usuarios podrán pagar con:
- Tarjetas de crédito
- Tarjetas de débito
- Efectivo (con QR)
- Transferencias bancarias

¡Listo! 🎉


