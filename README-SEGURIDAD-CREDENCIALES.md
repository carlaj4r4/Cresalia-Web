# 🔒 Guía de Seguridad: Proteger Credenciales de Mercado Pago

## 🎯 ¿Por qué es importante?

**NUNCA** debés subir credenciales reales de Mercado Pago a GitHub. Si lo hacés:
- ❌ Cualquiera puede usar tus credenciales
- ❌ Pueden hacer pagos en tu nombre
- ❌ Pueden acceder a tu cuenta de Mercado Pago
- ❌ Pueden robar dinero

---

## ✅ Solución Implementada

### 1. **Scripts de Validación**

He creado scripts que verifican automáticamente que no haya credenciales expuestas:

- `scripts/security/validate-no-exposed-keys.js` - Valida archivos antes de commit
- `scripts/security/pre-commit-hook.js` - Hook de pre-commit (opcional)

### 2. **Variables de Entorno**

Todos los archivos ahora usan **solo variables de entorno** o placeholders seguros:

- ✅ `CONFIGURAR_EN_VERCEL` - Placeholder seguro
- ✅ `window.__MERCADOPAGO_PUBLIC_KEY__` - Variable de entorno
- ✅ `process.env.MERCADOPAGO_ACCESS_TOKEN` - Variable de entorno

### 3. **.gitignore Actualizado**

El `.gitignore` ahora incluye:
- ✅ `config-mercado-pago.js` - Archivo de configuración
- ✅ `*.real.js` - Archivos con credenciales reales
- ✅ `*.local.js` - Archivos locales
- ✅ `*.prod.js` - Archivos de producción

---

## 🚀 Cómo Usar los Scripts de Seguridad

### Opción 1: Validación Manual

```bash
# Validar archivos manualmente
npm run validate-security
```

### Opción 2: Pre-commit Hook (Recomendado)

```bash
# Instalar el hook (solo una vez)
npm run pre-commit
```

**Nota**: El hook se ejecutará automáticamente antes de cada commit y te avisará si hay credenciales expuestas.

---

## ✅ Checklist de Seguridad

Antes de hacer commit, verificá:

- [ ] **No hay credenciales reales en el código**
- [ ] **Solo se usan variables de entorno o placeholders**
- [ ] **`.gitignore` incluye los archivos de configuración**
- [ ] **Las credenciales están solo en Vercel (variables de entorno)**
- [ ] **Los archivos con credenciales reales no están en el repositorio**

---

## 🆘 Si Encontrás Credenciales Expuestas

### Paso 1: Remover las Credenciales

1. **Buscá en el código** dónde están las credenciales
2. **Reemplazalas** con placeholders o variables de entorno
3. **Verificá** que no estén en el historial de Git

### Paso 2: Rotar las Credenciales

1. **Andá a Mercado Pago** → **"Desarrolladores"** → **"Credenciales"**
2. **Revocá las credenciales expuestas**
3. **Creá nuevas credenciales**
4. **Actualizá las variables en Vercel**

### Paso 3: Limpiar el Historial de Git

```bash
# Remover del historial de Git (CUIDADO: esto reescribe el historial)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch config-mercado-pago.js" \
  --prune-empty --tag-name-filter cat -- --all
```

---

## 💡 Mejores Prácticas

### ✅ HACER:

1. **Usar variables de entorno** en Vercel
2. **Usar placeholders** en el código
3. **Verificar antes de commit** con los scripts
4. **Revisar .gitignore** regularmente
5. **Rotar credenciales** si se exponen

### ❌ NO HACER:

1. **NO hardcodear** credenciales en el código
2. **NO subir** archivos con credenciales reales
3. **NO compartir** credenciales públicamente
4. **NO usar** credenciales de producción en desarrollo
5. **NO ignorar** advertencias de seguridad

---

## 📋 Archivos Actualizados

He actualizado los siguientes archivos para usar solo variables de entorno:

- ✅ `script-cresalia.js` - Usa variables de entorno
- ✅ `js/payment-system.js` - Usa variables de entorno
- ✅ `config-mercado-pago.js` - Solo placeholders seguros
- ✅ `api/mercadopago-preference.js` - Lee de variables de entorno
- ✅ `.gitignore` - Protege archivos con credenciales

---

## 🎉 Conclusión

**Tus credenciales están protegidas**. Los scripts de validación te ayudarán a prevenir que se expongan accidentalmente.

**Recordá:**
- ✅ Solo usá variables de entorno en Vercel
- ✅ Usá placeholders en el código
- ✅ Verificá antes de commit
- ✅ Rotá credenciales si se exponen

---

¡Éxitos con tu integración segura! 💜


