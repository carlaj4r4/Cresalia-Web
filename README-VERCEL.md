# 🚀 Guía para Deploy en Vercel

## Pasos para Subir tu SaaS a Vercel:

### 1. **Preparación:**
- ✅ Todos los archivos están listos
- ✅ Sistema de pagos configurado con Mercado Pago
- ✅ Tablas de Supabase listas (`supabase-pagos-suscripciones.sql`)
- ✅ Webhook configurado (`api/webhook-mercadopago.js`)
- ✅ Archivo `vercel.json` creado

### 2. **Instalar Vercel CLI (si no lo tienes):**
```bash
npm install -g vercel
```

### 3. **Login en Vercel:**
```bash
vercel login
```

### 4. **Deploy desde la carpeta del proyecto:**
```bash
cd C:\Users\carla\Cresalia-Web
vercel
```

### 5. **Seguir las instrucciones:**
- ¿Configurar proyecto? → **Sí**
- ¿A qué proyecto lo quieres asociar? → Crear nuevo proyecto o seleccionar existente
- ¿En qué directorio está tu código? → **.** (directorio actual)

Beneficios:
- ✅ HTTPS automático (necesario para Mercado Pago)
- ✅ Sin errores de CORS o file://
- ✅ Dominio gratuito proporcionado
- ✅ Deploy automático en cada push a Git

### 6. **Configurar Variables de Entorno (opcional):**
Si necesitas variables de entorno, en el dashboard de Vercel:
- Settings → Environment Variables
- Agregar:
  - `MERCADOPAGO_ACCESS_TOKEN` = tu access token
  - `MERCADOPAGO_PUBLIC_KEY` = tu public key
  - `SUPABASE_URL` = tu URL de Supabase
  - `SUPABASE_KEY` = tu key de Supabase

### 7. **Configurar Webhook de Mercado Pago:**
Una vez tengas tu URL de Vercel:
1. Ve a tu dashboard de Mercado Pago
2. Configuración → Webhooks
3. URL: `https://tu-proyecto.vercel.app/webhook-mercadopago`
4. Eventos: payment.created, payment.updated

## ✅ **Sistema de Pagos Implementado:**
- ✅ Mercado Pago integrado con tus claves reales
- ✅ Pago con QR
- ✅ Validación de tarjetas (algoritmo de Luhn)
- ✅ Protección anti-fraude y robo de identidad
- ✅ Comisiones automáticas: FREE 0.8%, BASIC/PRO 1.2%, ENTERPRISE 0.8%
- ✅ Todas las comisiones van a tu cuenta de Mercado Pago

## 📊 **Tablas de Supabase Creadas:**
Ejecuta `supabase-pagos-suscripciones.sql` en tu proyecto de Supabase:
- `suscripciones` - Gestión de planes
- `pagos_suscripciones` - Pagos de suscripciones
- `pagos_ventas` - Pagos de productos/servicios
- `webhooks_mercadopago` - Registro de webhooks
- `tarjetas_bloqueadas` - Sistema anti-fraude
- `intentos_pago` - Auditoría de pagos
- `comisiones_cresalia` - Comisiones acumuladas

## 🛡️ **Seguridad Implementada:**
- ✅ Validación de tarjetas con algoritmo de Luhn
- ✅ Detección de tarjetas vencidas
- ✅ Bloqueo de tarjetas sospechosas
- ✅ Validación de nombres para prevenir robo de identidad
- ✅ Auditoría completa de todos los intentos de pago

¡Tu SaaS está listo para producción! 🎉


