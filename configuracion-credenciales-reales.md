# 🔑 Configuración de Credenciales Reales - Cresalia

## 📋 PASO 1: Obtener tus Credenciales Reales

### 🔍 En tu Panel de Mercado Pago:
1. Ve a **"Desarrolladores"** → **"Mis aplicaciones"**
2. Selecciona tu aplicación
3. Ve a **"Credenciales de Producción"**
4. Copia:
   - **Public Key** (empieza con APP-)
   - **Access Token** (empieza con APP-)

## 📋 PASO 2: Configurar en Cresalia

### 🔧 En `config-mercado-pago.js`:
```javascript
production: {
    publicKey: 'APP-TU_PUBLIC_KEY_REAL_AQUI',
    accessToken: 'APP-TU_ACCESS_TOKEN_REAL_AQUI'
}
```

## ⚠️ IMPORTANTE - SEGURIDAD:

### 🔒 NUNCA COMPARTAS:
- ❌ **Access Token** (secreta)
- ❌ **Public Key** en código público
- ❌ **Credenciales** en repositorios

### ✅ SÍ PUEDES COMPARTIR:
- ✅ **Public Key** en frontend (es segura)
- ✅ **Configuración** sin credenciales
- ✅ **Documentación** sin datos sensibles

## 🧪 PRUEBAS CON CREDENCIALES REALES:

### 💳 Tarjetas de Prueba (funcionan con credenciales reales):
- **Visa**: `4509 9535 6623 3704`
- **Mastercard**: `5031 7557 3453 0604`
- **CVV**: Cualquier 3 dígitos
- **Fecha**: Cualquier fecha futura

### 🔄 Modo de Prueba:
- **Mercado Pago** tiene modo de prueba incluso con credenciales reales
- **No se cobra** dinero real
- **Perfecto** para desarrollo

## 📊 CONFIGURACIÓN ACTUAL:

```javascript
// En config-mercado-pago.js
environment: 'production' // Usando credenciales reales
```

## 🚀 PRÓXIMOS PASOS:

1. **Reemplaza** las credenciales en `config-mercado-pago.js`
2. **Prueba** con tarjetas de prueba
3. **Verifica** que todo funcione
4. **Guarda** el archivo en `.gitignore`

## 🔐 SEGURIDAD ADICIONAL:

- **Archivo en .gitignore** ✅
- **No subir a GitHub** ✅
- **Solo en tu computadora** ✅
- **Backup seguro** ✅










