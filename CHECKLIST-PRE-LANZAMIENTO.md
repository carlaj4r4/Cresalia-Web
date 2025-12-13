# 📋 CHECKLIST PRE-LANZAMIENTO - CRESALIA

**Fecha:** 2025-01-27  
**Estado Actual:** 🟢 90% Completo  
**Última Actualización:** Después de correcciones de registro y widgets

---

## ✅ **YA COMPLETADO RECIENTEMENTE**

### Registro y Autenticación:
- ✅ Registro de compradores funcionando
- ✅ Registro de vendedores/tiendas funcionando  
- ✅ Registro de emprendedores/servicios profesionales funcionando
- ✅ Triggers SQL para crear perfiles automáticamente
- ✅ Mejor manejo de errores en registro

### Widgets y UI:
- ✅ Widget de feedbacks visible en móvil
- ✅ Widget de creación de cuenta posicionado correctamente
- ✅ Widgets con espaciado consistente (120px entre cada uno)
- ✅ Sistema de monitoreo de errores gratuito activado
- ✅ Script de backup de Supabase creado

### Sistemas Implementados:
- ✅ Panel super-admin completo
- ✅ Onboarding automatizado
- ✅ Sistema de monitoreo de errores (gratuito, alternativo a Sentry)
- ✅ Sistema de backup de Supabase (script creado, falta automatizar)

---

## 🔴 **CRÍTICO - Hacer ANTES del Lanzamiento Público**

### 1. **Testing Manual Exhaustivo** ⏳ PENDIENTE
**Tiempo estimado:** 3-5 días  
**Prioridad:** 🔴 CRÍTICA

**Qué probar:**
- [ ] **Registro y Login:**
  - [ ] Registrar comprador nuevo
  - [ ] Registrar vendedor nuevo
  - [ ] Registrar emprendedor nuevo
  - [ ] Login de cada tipo de usuario
  - [ ] Recuperación de contraseña
  - [ ] Confirmación de email (si está habilitada)

- [ ] **Flujo de Compra Completo:**
  - [ ] Agregar productos al carrito
  - [ ] Completar checkout
  - [ ] Proceso de pago (modo sandbox)
  - [ ] Recibir confirmación de compra
  - [ ] Ver historial de compras

- [ ] **Panel de Admin de Tienda:**
  - [ ] Agregar productos
  - [ ] Editar productos
  - [ ] Eliminar productos
  - [ ] Ver ventas
  - [ ] Gestionar pedidos
  - [ ] Configurar tienda

- [ ] **Comunidades:**
  - [ ] Crear post en diferentes comunidades
  - [ ] Ver historial de posts
  - [ ] Sistema de moderación (si aplica)
  - [ ] Reportar contenido

- [ ] **Widgets:**
  - [ ] Widget de soporte funciona
  - [ ] Widget de feedbacks funciona
  - [ ] Widget de cuenta funciona
  - [ ] Chatbot IA funciona
  - [ ] Todos visibles en móvil

- [ ] **Pagos y Suscripciones:**
  - [ ] Crear suscripción (modo sandbox)
  - [ ] Renovación automática (simular)
  - [ ] Suspensión por falta de pago
  - [ ] Cambio de plan

**Cómo hacerlo:**
1. Crear lista de verificación (checklist)
2. Probar cada funcionalidad paso a paso
3. Documentar cualquier error encontrado
4. Priorizar errores críticos vs menores

---

### 2. **Configurar Variables de Entorno en Vercel** ⏳ PENDIENTE
**Tiempo estimado:** 30 minutos  
**Prioridad:** 🔴 CRÍTICA (cuando Mercado Pago apruebe)

**Qué configurar:**
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `MERCADOPAGO_ACCESS_TOKEN` (cuando lo tengas)
- [ ] `MERCADOPAGO_SECRET_KEY` (opcional)
- [ ] `FRONTEND_URL` (https://cresalia-web.vercel.app)
- [ ] `BACKEND_URL` (si tienes backend separado)

**Cómo hacerlo:**
1. Ir a Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
2. Agregar cada variable
3. Seleccionar ambientes (Production, Preview, Development)
4. Guardar

**Estado:** ⏳ Esperando aprobación de cuenta de Mercado Pago

---

### 3. **Configurar Webhooks de Mercado Pago** ⏳ PENDIENTE
**Tiempo estimado:** 15 minutos  
**Prioridad:** 🔴 CRÍTICA (cuando Mercado Pago apruebe)

**Qué configurar:**
- [ ] URL de webhook para suscripciones Cresalia:
  ```
  https://tu-dominio-vercel.app/api/payments/mercadopago/cresalia-webhook
  ```
- [ ] URL de webhook para ventas de tiendas:
  ```
  https://tu-dominio-vercel.app/api/payments/mercadopago/store-sale-webhook
  ```
- [ ] Eventos a recibir:
  - [ ] `payment.created`
  - [ ] `payment.updated`
  - [ ] `subscription.updated` (si aplica)

**Cómo hacerlo:**
1. Ir a Mercado Pago Dashboard → Desarrolladores → Webhooks
2. Agregar nueva URL
3. Seleccionar eventos
4. Probar con modo sandbox

**Estado:** ⏳ Esperando aprobación de cuenta de Mercado Pago

---

### 4. **Automatizar Backups de Supabase** ⏳ PENDIENTE
**Tiempo estimado:** 1-2 horas  
**Prioridad:** 🔴 CRÍTICA

**Qué hacer:**
- [ ] Ejecutar manualmente el script `scripts/backup-supabase.js` una vez
- [ ] Configurar cron job o GitHub Actions para backups automáticos:
  - [ ] Backup diario a las 2 AM
  - [ ] Retener últimos 7 backups
  - [ ] Enviar notificación si falla
- [ ] Probar restauración de un backup (importante!)

**Cómo hacerlo:**
Ver `BACKUP-SUPABASE-GUIA.md` para instrucciones detalladas.

**Opciones:**
1. **GitHub Actions** (gratis, recomendado):
   - Crear `.github/workflows/backup-daily.yml`
   - Ejecutar diariamente
   - Subir backup a GitHub Releases o Secrets

2. **Cron en servidor propio** (si tienes):
   - Configurar cron: `0 2 * * * node scripts/backup-supabase.js`

3. **Supabase tiene backups automáticos** (verificar en dashboard):
   - Revisar frecuencia
   - Verificar cómo restaurar

---

### 5. **Ejecutar Trigger SQL en Supabase** ✅ LISTO (verificar)
**Tiempo estimado:** 5 minutos  
**Prioridad:** 🔴 CRÍTICA

**Qué hacer:**
- [ ] Ir a Supabase Dashboard → SQL Editor
- [ ] Ejecutar `supabase-trigger-crear-perfiles.sql`
- [ ] Verificar que no haya errores
- [ ] Probar registro de usuario nuevo para confirmar que funciona

**Estado:** ✅ Script creado, falta ejecutarlo si aún no lo hiciste

---

## 🟡 **IMPORTANTE - Hacer DESPUÉS del Testing Crítico**

### 6. **Documentación de Usuario Final** ✅ LISTO (implementar UI)
**Tiempo estimado:** 2-3 semanas (implementación)  
**Prioridad:** 🟡 ALTA

**Estado Actual:**
- ✅ Documentación completa creada (`docs/GUIAS-PASO-A-PASO.md`)
- ✅ FAQ completo (`docs/FAQ-COMPLETO.md`)
- ✅ Diseño del Centro de Ayuda (`docs/CENTRO-AYUDA-INTERACTIVO-DISENO.md`)
- ❌ Centro de Ayuda interactivo NO implementado (solo diseño)

**Qué falta:**
- [ ] Crear página HTML del Centro de Ayuda
- [ ] Implementar búsqueda inteligente
- [ ] Integrar con documentación existente
- [ ] Agregar enlace visible en todas las páginas

**Recomendación:** 
- Para lanzamiento beta: usar documentación existente (ya está completa)
- Para lanzamiento público: implementar centro interactivo

---

### 7. **Sistema de Notificaciones por Email** ⏳ PENDIENTE
**Tiempo estimado:** 1 semana  
**Prioridad:** 🟡 ALTA

**Qué implementar:**
- [ ] Emails de bienvenida (compradores, vendedores, emprendedores)
- [ ] Confirmación de pago
- [ ] Recordatorio de renovación próxima
- [ ] Notificación de suspensión
- [ ] Notificación de reactivación

**Opciones de servicios:**
- **Resend** (recomendado): Gratis hasta 3,000 emails/mes
- **SendGrid**: Gratis hasta 100 emails/día
- **Mailgun**: Gratis hasta 5,000 emails/mes
- **Brevo (Sendinblue)**: Ya lo usas para chat, también tiene email

**Estado:** Ya tienes estructura (`sistemaEmailsCresalia`), falta integrar servicio

---

### 8. **Optimización de Performance** ⏳ MEJORAS MENORES
**Tiempo estimado:** 1 semana  
**Prioridad:** 🟡 MEDIA

**Qué optimizar:**
- [ ] Lazy loading de imágenes (mejorar carga inicial)
- [ ] Minificar CSS y JS (reducir tamaño de archivos)
- [ ] Caché más agresivo (mejorar velocidad)
- [ ] Optimizar queries a Supabase (reducir llamadas innecesarias)
- [ ] Code splitting (cargar solo lo necesario)

**Estado:** Funcional, pero puede mejorarse

---

## 🟢 **OPCIONAL - Mejoras Futuras**

### 9. **SEO Completo**
- [ ] Meta tags optimizados en todas las páginas
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Schema.org markup

**Prioridad:** 🟢 MEDIA (mejora orgánica pero no crítico)

---

### 10. **Límites de Carrito y Favoritos**
- [ ] Límite de 50 productos en carrito
- [ ] Límite de 100 favoritos
- [ ] Mensajes cuando se alcancen límites

**Prioridad:** 🟢 BAJA (funciona sin límites)

---

## 📊 **RESUMEN DE PRIORIDADES**

### **🔴 CRÍTICO (Hacer AHORA):**
1. ✅ Ejecutar trigger SQL en Supabase (5 min)
2. ⏳ Testing manual exhaustivo (3-5 días)
3. ⏳ Configurar variables de entorno en Vercel (30 min) - cuando Mercado Pago apruebe
4. ⏳ Configurar webhooks de Mercado Pago (15 min) - cuando Mercado Pago apruebe
5. ⏳ Automatizar backups (1-2 horas)

### **🟡 IMPORTANTE (Hacer después del testing):**
6. ⏳ Implementar centro de ayuda interactivo (2-3 semanas)
7. ⏳ Sistema de notificaciones por email (1 semana)
8. ⏳ Optimización de performance (1 semana)

### **🟢 OPCIONAL (Futuro):**
9. SEO completo
10. Límites de carrito/favoritos

---

## 🎯 **PLAN DE ACCIÓN SUGERIDO**

### **Esta Semana:**
1. ✅ Ejecutar trigger SQL
2. ⏳ Testing manual exhaustivo (3-5 días)
3. ⏳ Automatizar backups (1-2 horas)

### **Próxima Semana (cuando Mercado Pago apruebe):**
1. ⏳ Configurar variables de entorno en Vercel
2. ⏳ Configurar webhooks de Mercado Pago
3. ⏳ Probar flujo de pago completo

### **Después del Lanzamiento Beta:**
1. Implementar centro de ayuda interactivo
2. Sistema de notificaciones por email
3. Optimizaciones de performance

---

## 💜 **RECOMENDACIÓN FINAL**

**Para lanzamiento BETA (recomendado):**
- ✅ Haz el testing manual exhaustivo
- ✅ Ejecuta el trigger SQL
- ✅ Automatiza los backups
- ⏳ Configura variables de entorno (cuando Mercado Pago apruebe)
- ⏳ Configura webhooks (cuando Mercado Pago apruebe)

**Con esto puedes lanzar con 10-20 usuarios beta y probar todo en producción real.**

**Para lanzamiento PÚBLICO:**
- Todo lo anterior +
- Implementar centro de ayuda
- Sistema de emails
- Optimizaciones

---

**Última actualización:** 27 de Enero, 2025  
**Estado:** 🟢 90% Completo - Listo para Beta Controlado

