# 🧪 Guía de Pagos de Prueba - Cresalia

## 📋 PASO 1: Obtener Credenciales de Prueba

### 🔑 En tu Panel de Mercado Pago:
1. Ve a **"Desarrolladores"** → **"Mis aplicaciones"**
2. Selecciona tu aplicación
3. Ve a **"Credenciales de Prueba"**
4. Copia:
   - **Public Key** (empieza con TEST-)
   - **Access Token** (empieza con TEST-)

## 📋 PASO 2: Configurar en Cresalia

### 🔧 En `config-mercado-pago.js`:
```javascript
sandbox: {
    publicKey: 'TEST-TU_PUBLIC_KEY_REAL_AQUI',
    accessToken: 'TEST-TU_ACCESS_TOKEN_REAL_AQUI'
}
```

## 📋 PASO 3: Probar Pagos

### 💳 Tarjetas de Prueba:
- **Visa**: 4509 9535 6623 3704
- **Mastercard**: 5031 7557 3453 0604
- **American Express**: 3753 651535 56885

### 📅 Datos de Prueba:
- **CVV**: Cualquier 3 dígitos
- **Fecha**: Cualquier fecha futura
- **Nombre**: Cualquier nombre

## 📋 PASO 4: Probar en Cresalia

### 🚀 Cómo Probar:
1. Ve a **admin.html**
2. Haz clic en **"Suscripciones"**
3. Selecciona un plan (ej: Plan Básico)
4. Haz clic en **"Proceder al Pago"**
5. Usa las tarjetas de prueba

## ✅ Resultados Esperados:
- **Pago procesado** exitosamente
- **Plan activado** en la interfaz
- **Notificación** de confirmación
- **Sin dinero real** involucrado

## 🔒 Seguridad:
- **Solo funciona** en modo sandbox
- **No se cobra** dinero real
- **Perfecto** para desarrollo










