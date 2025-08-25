# 🚀 Guía de Despliegue - FRIOCAS Web

## 📋 Pasos para Subir a GitHub y Vercel

### **Paso 1: Preparar GitHub**

1. **Crear repositorio en GitHub:**
   - Ve a [github.com](https://github.com)
   - Haz clic en "New repository"
   - Nombre: `friocas-web`
   - Descripción: "Sistema web completo para FRIOCAS"
   - **NO** inicializar con README (ya tenemos uno)
   - Haz clic en "Create repository"

2. **Subir archivos a GitHub:**
   ```bash
   # En la carpeta del proyecto
   git init
   git add .
   git commit -m "Versión 8.0 - Lista para producción"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/friocas-web.git
   git push -u origin main
   ```

### **Paso 2: Configurar Vercel**

1. **Crear cuenta en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Regístrate con tu cuenta de GitHub

2. **Importar proyecto:**
   - Haz clic en "New Project"
   - Selecciona el repositorio `friocas-web`
   - Framework Preset: **Other**
   - Root Directory: `./` (por defecto)
   - Build Command: **dejar vacío**
   - Output Directory: **dejar vacío**
   - Install Command: **dejar vacío**

3. **Configurar variables de entorno (opcional):**
   - En la configuración del proyecto
   - Variables:
     - `MERCADO_PAGO_PUBLIC_KEY`: Tu Public Key
     - `MERCADO_PAGO_ACCESS_TOKEN`: Tu Access Token

4. **Desplegar:**
   - Haz clic en "Deploy"
   - Espera a que termine el despliegue

### **Paso 3: Configurar Mercado Pago**

1. **Obtener credenciales reales:**
   - Ve a [mercadopago.com.ar](https://mercadopago.com.ar)
   - Accede a tu cuenta Business
   - Ve a "Desarrolladores" > "Credenciales"
   - Copia tu **Public Key** y **Access Token**

2. **Actualizar el código:**
   - En `script-friocas.js` línea 4361-4364:
   ```javascript
   const MERCADO_PAGO_CONFIG = {
       publicKey: 'APP-TU-PUBLIC-KEY-REAL',
       accessToken: 'APP-TU-ACCESS-TOKEN-REAL',
       preferenceId: null,
       sandbox: false
   };
   ```

3. **Configurar webhooks (opcional):**
   - En Mercado Pago > Desarrolladores > Webhooks
   - URL: `https://tu-dominio.vercel.app/webhook-mercadopago`
   - Eventos: `payment.created`, `payment.updated`

### **Paso 4: Configurar Dominio Personalizado**

1. **En Vercel:**
   - Ve a Settings > Domains
   - Agrega tu dominio personalizado
   - Sigue las instrucciones de DNS

2. **En tu proveedor de DNS:**
   - Agrega los registros CNAME que te indique Vercel
   - Espera a que se propague (puede tardar hasta 24 horas)

## 🔧 Configuración Post-Despliegue

### **Verificar Funcionalidades**

1. **Página principal:**
   - ✅ Catálogo de productos
   - ✅ Búsqueda por categoría
   - ✅ Carrito de compras
   - ✅ Cálculo de precios

2. **Sistema de pagos:**
   - ✅ Mercado Pago (con credenciales reales)
   - ✅ Métodos de pago alternativos
   - ✅ Generación de facturas

3. **Panel de administración:**
   - ✅ Acceso con `Ctrl + Alt + A`
   - ✅ Credenciales: admin / FRIOCAS2024ADMIN
   - ✅ Gestión de productos y configuración

4. **Soporte de Carla:**
   - ✅ Acceso con `Ctrl + Alt + C`
   - ✅ Credenciales: carla / FRIOCAS2024CARLA
   - ✅ Sistema de atención al cliente

### **Configurar HTTPS**

- Vercel proporciona HTTPS automáticamente
- No necesitas configuración adicional

### **Configurar Analytics (Opcional)**

1. **Google Analytics:**
   - Crear cuenta en [analytics.google.com](https://analytics.google.com)
   - Obtener ID de seguimiento
   - Agregar al código HTML

2. **Facebook Pixel:**
   - Crear pixel en [business.facebook.com](https://business.facebook.com)
   - Obtener código de seguimiento
   - Agregar al código HTML

## 🚨 Solución de Problemas

### **Error: "Mercado Pago no funciona"**

**Causa:** Credenciales de prueba en producción
**Solución:**
1. Verificar que `sandbox: false` en la configuración
2. Usar credenciales reales de producción
3. Verificar que el dominio esté en la lista blanca de Mercado Pago

### **Error: "Página no carga"**

**Causa:** Problemas de DNS o configuración
**Solución:**
1. Verificar que el dominio apunte a Vercel
2. Esperar propagación de DNS (hasta 24 horas)
3. Verificar logs en Vercel Dashboard

### **Error: "Acceso denegado al panel"**

**Causa:** Problemas con el sistema de seguridad
**Solución:**
1. Verificar que `security-system.js` esté cargado
2. Limpiar caché del navegador
3. Usar credenciales correctas

## 📞 Soporte Post-Despliegue

### **Contacto Técnico**
- **Email:** carla.crimi.95@gmail.com
- **WhatsApp:** +5493795015712

### **Documentación Adicional**
- [README.md](README.md) - Documentación completa
- [Vercel Docs](https://vercel.com/docs) - Documentación de Vercel
- [Mercado Pago Docs](https://www.mercadopago.com.ar/developers) - Documentación de MP

---

**¡Tu sitio web FRIOCAS está listo para producción! 🎉**


