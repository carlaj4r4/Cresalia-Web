# 💳 Estado de Pagos en Comunidades de Cresalia

## 📋 Resumen Ejecutivo

### ✅ Comunidades con Pagos Habilitados (tu cuenta)

1. **Cresalia Jobs** ✅
   - **Estado**: Pagos habilitados con Mercado Pago
   - **Qué se paga**: Planes de suscripción ($29/mes Básico, $79/mes Pro, etc.)
   - **A dónde va**: Tu cuenta de Mercado Pago (cresalia25@gmail.com)
   - **Archivos**: `cresalia-jobs/index.html`, `js/mercado-pago-integration.js`, `config-mercado-pago.js`

### ⚠️ Comunidades SIN Pagos Directos (solo para alias de usuarios)

2. **Cresalia Animales** ❌
   - **Estado**: NO tiene pagos integrados
   - **Nota explícita**: "NO cobraremos comisiones por donaciones"
   - **Lo que debería tener**: Sistema para que usuarios pongan su alias/CVU/CBU para recibir donaciones
   - **Ubicación**: `cresalia-animales/index.html`

3. **Cresalia Solidario** ❌
   - **Estado**: NO tiene pagos integrados
   - **Nota**: "Estamos trabajando en el sistema de donaciones de dinero"
   - **Lo que debería tener**: Sistema para que organizaciones pongan su alias/CVU/CBU
   - **Ubicación**: `cresalia-solidario/index.html`

4. **Cresalia Solidario - Emergencias** ❌
   - **Estado**: Solo donaciones de materiales (no dinero)
   - **Lo que debería tener**: Sistema para que organizaciones pongan su alias/CVU/CBU
   - **Ubicación**: `cresalia-solidario-emergencias/index.html`

---

## 🎯 Lo que NECESITAS Implementar

### Para Comunidades SIN Pagos (Cresalia Animales, Cresalia Solidario, etc.)

**Objetivo**: Permitir que usuarios/organizaciones agreguen su información de pago para recibir donaciones, pero SIN usar tu cuenta de Mercado Pago.

**Qué necesitan**:
1. **Campo para Alias/CVU/CBU** - Cada usuario puede agregar el suyo
2. **Campo para Nombre del Titular** - Para que los donantes sepan a quién envían
3. **Visualización en perfil** - Mostrar la info de pago para que otros puedan donar
4. **Redirección simple** - Mostrar la info para que el donante transfiera manualmente

**NO necesitan**:
- ❌ Integración con Mercado Pago
- ❌ Procesamiento automático de pagos
- ❌ Links de pago generados
- ❌ Tu cuenta de Mercado Pago

**SÍ necesitan**:
- ✅ Formulario para agregar alias/CVU/CBU
- ✅ Visualización de esa info en su perfil
- ✅ Texto tipo: "Puedes ayudar enviando dinero a: [ALIAS] a nombre de [NOMBRE]"
- ✅ Redirección simple a transferencia bancaria

---

## 💡 Solución Propuesta

### Opción 1: Solo Mostrar Info de Pago (Simple)
- Usuario/organización completa formulario con su alias/CVU/CBU
- Se muestra en su perfil
- Donantes ven la info y transfieren manualmente
- Sin procesamiento automático

### Opción 2: Links de Transferencia (Avanzado)
- Usuario completa su info
- Se genera link tipo: "Transferir a [ALIAS]" que abre app bancaria
- Más automatizado pero sin usar Mercado Pago

### Recomendación: **Opción 1** (Simple y directo)
- No necesitas procesar pagos
- Los usuarios manejan sus propias cuentas
- Más transparente
- Menos responsabilidad legal para Cresalia

---

## 🔍 Estado Actual Detallado

### ✅ Cresalia Jobs

**Archivos relacionados**:
- `cresalia-jobs/index.html` - Incluye Mercado Pago SDK
- `config-mercado-pago.js` - Configuración de Mercado Pago
- `js/mercado-pago-integration.js` - Lógica de pagos

**Cómo funciona**:
1. Usuario selecciona plan
2. Se crea preferencia de pago en Mercado Pago
3. Pago va a tu cuenta (carla.crimi.95@gmail.com)
4. Usuario recibe acceso al plan

**Estado**: ✅ Funcional (si configuraste las credenciales)

---

### ❌ Cresalia Animales

**Archivos relacionados**:
- `cresalia-animales/index.html` - Solo menciona que NO cobran comisiones

**Qué dice actualmente**:
> "NO monetizaremos con publicidad invasiva. NO cobraremos comisiones por donaciones. NO usaremos el sufrimiento animal para marketing."

**Falta**:
- Formulario para que usuarios agreguen su alias/CVU/CBU
- Visualización de esa info en perfil
- Sección "Cómo ayudar económicamente" que muestre la info de pago

---

### ❌ Cresalia Solidario

**Archivos relacionados**:
- `cresalia-solidario/index.html` - Menciona que están trabajando en donaciones

**Qué dice actualmente**:
> "Estamos trabajando en el sistema de donaciones de dinero con verificación estricta y seguridad máxima. Estará disponible muy pronto."

**Falta**:
- Sistema para que organizaciones agreguen su alias/CVU/CBU
- Verificación de organizaciones
- Visualización de info de pago en perfil de organización

---

### ❌ Cresalia Solidario - Emergencias

**Archivos relacionados**:
- `cresalia-solidario-emergencias/index.html` - Solo donaciones de materiales
- `cresalia-solidario-emergencias/donar-materiales.html` - Formulario de materiales

**Estado actual**:
- ✅ Permite donar materiales (ropa, alimentos, etc.)
- ❌ NO permite donaciones de dinero

**Falta**:
- Sistema para que organizaciones agreguen info de pago
- Opción de donar dinero además de materiales

---

## 🚀 Plan de Implementación

### Paso 1: Crear Sistema de Alias/CVU/CBU Genérico

Crear un componente reutilizable que permita:
- Agregar alias/CVU/CBU
- Agregar nombre del titular
- Agregar banco (opcional)
- Visualizar info de pago

### Paso 2: Integrar en Cada Comunidad

- **Cresalia Animales**: En perfil de usuario/organización
- **Cresalia Solidario**: En perfil de organización
- **Cresalia Solidario - Emergencias**: En perfil de organización

### Paso 3: Tabla SQL en Supabase

Crear tabla `metodos_pago_usuarios`:
- `usuario_id` o `organizacion_id`
- `tipo` (alias, CVU, CBU)
- `valor` (el alias/CVU/CBU)
- `titular_nombre`
- `banco` (opcional)
- `verificado` (boolean)

---

## 💜 Valores Éticos Mantenidos

✅ No cobras comisiones
✅ Los usuarios manejan sus propias cuentas
✅ Transparencia total
✅ No usas su necesidad para tu beneficio
✅ Solo facilitas la conexión

---

**Última actualización**: Diciembre 2024  
**Autor**: Claude (co-fundador de Cresalia)

