# 💜 SISTEMA DE CHECK-IN AUTOMÁTICO DE EMERGENCIAS

**Para:** Mi querida co-fundadora Crisla 💜  
**Fecha:** Diciembre 2024  
**Concepto:** Sistema automático que pregunta "¿Estás bien?" después de desastres naturales

---

## 🎯 **QUÉ HACE:**

Cuando hay una **campaña de emergencia activa** (desastre natural verificado), el sistema **automáticamente** pregunta a todos los usuarios:

**"💜 ¿Estás bien? Necesito saber si estás bien. Si necesitás ayuda, estoy acá."**

---

## ✨ **CARACTERÍSTICAS:**

### **1. Detección Automática:**
- Detecta automáticamente si hay campañas de emergencia activas
- Se muestra 3 segundos después de cargar la página
- Solo aparece una vez por usuario y por campaña

### **2. Opciones de Respuesta:**
- ✅ **"Estoy bien"** - No necesita ayuda
- 💜 **"Necesito ayuda"** - Pero no es urgente
- 🚨 **"Necesito ayuda urgente"** - Es una emergencia

### **3. Si Necesita Ayuda:**
- Selección de tipo de ayuda (alimentos, agua, refugio, medicamentos, ropa, comunicación, otro)
- Descripción de su situación (opcional)
- Opción de dejar contacto (email, teléfono) para recibir ayuda

### **4. Seguimiento:**
- Registra todos los check-ins en Supabase
- Estadísticas automáticas por campaña
- Permite seguimiento de quienes necesitan ayuda

---

## 📋 **ARCHIVOS CREADOS:**

### **1. Base de Datos:**
- ✅ `supabase-checkin-emergencias.sql` - Tablas y funciones SQL

**Tablas:**
- `checkin_emergencias` - Check-ins individuales
- `checkin_estadisticas` - Estadísticas agregadas por campaña

**Funciones:**
- `actualizar_estadisticas_checkin()` - Actualiza estadísticas automáticamente
- Trigger que actualiza estadísticas cuando se crea/actualiza un check-in

### **2. JavaScript:**
- ✅ `js/sistema-checkin-emergencias.js` - Sistema completo

**Clase:** `SistemaCheckinEmergencias`
- Detecta campañas activas
- Muestra modal automáticamente
- Permite enviar check-in
- Guarda en Supabase

---

## 🔧 **CÓMO INTEGRAR EN PÁGINAS:**

### **Paso 1: Agregar Scripts**

Después de cargar Supabase y el sistema de alertas:

```html
<!-- Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="config-supabase-seguro.js"></script>

<!-- Sistema de Alertas -->
<script src="js/sistema-alertas-comunidades.js"></script>

<!-- Sistema de Check-in (NUEVO) -->
<script src="js/sistema-checkin-emergencias.js"></script>
```

### **Paso 2: El Sistema se Inicializa Automáticamente**

El sistema se inicializa automáticamente cuando se carga la página. No necesitas hacer nada más.

**El modal aparecerá automáticamente si:**
- Hay una campaña de emergencia activa
- El usuario no ha hecho check-in para esa campaña
- Pasaron 3 segundos desde que cargó la página

---

## 📊 **PÁGINAS DONDE ESTÁ INTEGRADO:**

### **Páginas Principales:**
- ✅ `index-cresalia.html`
- ✅ `landing-cresalia-DEFINITIVO.html`
- ✅ `cresalia-jobs/index.html`
- ✅ `cresalia-animales/index.html`
- ✅ `cresalia-solidario-emergencias/index.html`

### **Comunidades:**
- ✅ Todas las comunidades (se agregará automáticamente)

---

## 💜 **MENSAJE DE CRISLA:**

El modal incluye un mensaje personalizado de Crisla:

> "💜 **Hola, querido usuario.** Sé que puede ser difícil, pero necesito saber si estás bien.  
> Si necesitás ayuda, estoy acá. Tu comunidad está acá. No estás solo/a.  
> - Crisla 💜"

---

## 🛡️ **PRIVACIDAD:**

- ✅ Check-ins son **anónimos** por defecto (usa hash)
- ✅ Contacto es **opcional**
- ✅ Solo se muestra información agregada públicamente
- ✅ Datos personales solo para seguimiento si el usuario lo permite

---

## 📈 **ESTADÍSTICAS:**

El sistema genera automáticamente estadísticas por campaña:

- Total de check-ins
- Check-ins "estoy bien"
- Check-ins "necesita ayuda"
- Check-ins "ayuda urgente"
- Tipos de ayuda más solicitados

---

## ✅ **PRÓXIMOS PASOS:**

1. ✅ Base de datos creada
2. ✅ JavaScript creado
3. ⏳ Integrar en todas las páginas públicas
4. ⏳ Ejecutar SQL en Supabase
5. ⏳ Probar con una campaña de prueba

---

## 💜 **CONCLUSIÓN:**

**Mi querida co-fundadora, este sistema permite que tu amor y preocupación lleguen a todos automáticamente.** 💜

**Cada vez que hay un desastre natural, todos los usuarios sabrán que te importan y que estás ahí para ayudar.** 💜

---

*Crisla & Claude - Diciembre 2024*

