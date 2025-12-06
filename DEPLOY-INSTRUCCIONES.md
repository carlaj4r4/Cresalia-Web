# 🚀 Instrucciones de Deploy - Cresalia Web

## ✅ Cambios Incluidos en Este Deploy

### Nuevas Funcionalidades:
- ✅ **Sistema de carrito por tienda** (activar/desactivar según plan)
- ✅ **Listas separadas de favoritos** (servicios, tiendas, favoritos generales)
- ✅ **Límite de 100 servicios** con recordatorio de antigüedad
- ✅ **Correcciones de seguridad en Supabase** (vistas y funciones)

### Archivos Nuevos:
- `js/carrito-por-tienda.js` - Sistema de carritos por tienda
- `js/admin-carrito-por-tienda.js` - Panel admin para configurar carrito
- `supabase-wishlist-favoritos.sql` - Tablas opcionales para wishlist
- `supabase-corregir-advertencias-seguridad.sql` - Script de corrección de seguridad
- `supabase-corregir-funciones-especificas.sql` - Corrección específica de funciones

### Archivos Modificados:
- `index-cresalia.html` - Integración de carrito por tienda
- `admin-cresalia.html` - Panel admin con configuración de carrito
- `script-cresalia.js` - Integración con nuevo sistema de carrito
- `core/wishlist-favoritos.js` - Listas separadas y límites
- `js/plan-system.js` - Configuración de planes con carrito por tienda
- `manifest.json` - PWA mejorado
- Varios archivos CSS con mejoras

---

## 🚀 PASOS PARA DEPLOY EN VERCEL

### Opción 1: Deploy Automático (Recomendado)

Si ya tienes Vercel conectado con GitHub:

1. **Los cambios ya están en GitHub** ✅
   - El código se ha subido automáticamente
   - Vercel detectará los cambios y hará deploy automático

2. **Verificar el Deploy:**
   - Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
   - Busca tu proyecto "Cresalia-Web"
   - Verás el nuevo deploy en progreso
   - Espera 1-2 minutos para que complete

3. **Verificar que Funciona:**
   - Abre tu URL de Vercel (ej: `https://cresalia-web.vercel.app`)
   - Prueba agregar un producto al carrito
   - Verifica que aparezca el modal de selección de tipo de carrito (si la tienda tiene el plan adecuado)

---

### Opción 2: Deploy Manual

Si no tienes Vercel conectado o quieres hacerlo manualmente:

#### Paso 1: Instalar Vercel CLI (si no lo tienes)
```bash
npm i -g vercel
```

#### Paso 2: Login en Vercel
```bash
vercel login
```

#### Paso 3: Deploy
```bash
vercel --prod
```

#### Paso 4: Seguir las instrucciones
- Vercel te preguntará algunas cosas
- Acepta las configuraciones por defecto
- El deploy comenzará automáticamente

---

## 🔧 CONFIGURACIÓN POST-DEPLOY

### 1. Verificar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables, asegúrate de tener:

```
NODE_ENV=production
```

### 2. Verificar Dominio

Si tienes dominio personalizado:
- Ve a Settings → Domains
- Verifica que esté configurado correctamente
- SSL se configura automáticamente

### 3. Verificar Funcionalidades

Después del deploy, prueba:

- ✅ **Carrito por tienda:**
  - Agregar producto a carrito
  - Verificar que aparezca el modal de selección (si aplica)
  
- ✅ **Wishlist:**
  - Agregar a favoritos
  - Verificar listas separadas (servicios, tiendas, favoritos)
  
- ✅ **Panel Admin:**
  - Acceder a `admin-cresalia.html`
  - Verificar sección de configuración de carrito por tienda

---

## 📊 VERIFICACIÓN DE DEPLOY

### Checklist Post-Deploy:

- [ ] Código subido a GitHub ✅
- [ ] Deploy completado en Vercel
- [ ] URL accesible (sin errores 404)
- [ ] Carrito por tienda funcionando
- [ ] Wishlist con listas separadas funcionando
- [ ] Panel admin accesible
- [ ] Sin errores en consola del navegador
- [ ] Responsive funcionando en móvil

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Si el deploy falla:

1. **Revisar logs en Vercel:**
   - Ve a Deployments → Click en el deploy fallido
   - Revisa los logs de error

2. **Problemas comunes:**
   - **Error de build:** Verificar que no haya errores de sintaxis
   - **Error 404:** Verificar `vercel.json` está correcto
   - **Variables de entorno:** Verificar que estén configuradas

3. **Rollback si es necesario:**
   - En Vercel Dashboard → Deployments
   - Click en el deploy anterior que funcionaba
   - Click en "Promote to Production"

---

## 🔐 SEGURIDAD POST-DEPLOY

### Verificar en Supabase:

1. **Ejecutar scripts de corrección:**
   - Si aún no lo hiciste, ejecuta `supabase-corregir-funciones-especificas.sql`
   - Esto corregirá las advertencias de seguridad

2. **Verificar Security Advisor:**
   - Ve a Supabase → Security Advisor
   - Deberías ver 0 Errors y 0 Warnings (o menos que antes)

---

## 📝 NOTAS IMPORTANTES

### Carrito por Tienda:
- Solo funciona en planes: Basic, Starter, Pro, Enterprise
- El vendedor puede activar/desactivar desde el panel admin
- Los compradores verán un modal la primera vez que agreguen un producto

### Wishlist:
- Funciona completamente con localStorage (no requiere Supabase)
- Si quieres sincronización en la nube, ejecuta `supabase-wishlist-favoritos.sql`
- Límite de 100 servicios por lista

### Supabase:
- Los scripts SQL son opcionales
- Solo necesarios si quieres persistencia en la nube
- El sistema funciona perfectamente sin ellos

---

## 🎉 ¡Deploy Completado!

Una vez que el deploy esté completo:

1. ✅ Tu aplicación estará en producción
2. ✅ Todas las nuevas funcionalidades estarán disponibles
3. ✅ Los usuarios podrán usar el carrito por tienda
4. ✅ Las listas de favoritos estarán organizadas

**¡Cresalia está lista para conquistar el mercado!** 🚀💜

---

*Última actualización: $(date)*
*Versión: 1.0.0*

