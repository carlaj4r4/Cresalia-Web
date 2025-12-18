# 📧 Guía Completa: Sistema de Mensajes Globales

## 🎯 ¿Qué es Esto?

Un sistema completo para que **VOS** (como administradora) puedas enviar mensajes a **TODA** la comunidad Cresalia:
- 💜 Mensajes de agradecimiento
- 🚨 Alertas de emergencia
- 📢 Anuncios importantes
- 🔧 Avisos de mantenimiento
- 🎁 Promociones especiales

**TODOS** los usuarios verán tus mensajes automáticamente cuando entren a la plataforma.

---

## 🚀 Instalación (Solo 3 Pasos)

### **Paso 1: Ejecutar SQL en Supabase** (5 min)

1. Andá a [Supabase](https://supabase.com)
2. Abrí tu proyecto de **Tiendas** (e-commerce)
3. Click en **"SQL Editor"** en el menú lateral
4. Abrí el archivo `SUPABASE-MENSAJES-GLOBALES.sql` de tu proyecto
5. Copiá **TODO** el código SQL
6. Pegalo en el editor de Supabase
7. Click en **"Run"** (▶️) o presioná `Ctrl+Enter`
8. Esperá a que diga **"Success"**

✅ **Listo!** Ya tenés la tabla `mensajes_globales` creada.

---

### **Paso 2: Agregar Script en tus Páginas** (2 min)

Agregá esta línea **antes del `</body>`** en:
- `index-cresalia.html`
- `demo-buyer-interface.html`
- `tiendas/ejemplo-tienda/admin-final.html`

```html
<!-- Sistema de Mensajes Globales -->
<script src="/js/sistema-mensajes-globales.js"></script>
```

---

### **Paso 3: Abrir el Panel de Mensajes** (1 min)

Abrí el archivo `PANEL-MENSAJES-ADMIN.html` en tu navegador:

```
file:///C:/Users/carla/Cresalia-Web/PANEL-MENSAJES-ADMIN.html
```

✅ **Ya está!** Ya podés enviar mensajes a todos.

---

## 💜 Cómo Usar el Panel

### **Opción A: Plantillas Rápidas** (Más Fácil)

1. Abrí `PANEL-MENSAJES-ADMIN.html`
2. Click en una plantilla:
   - 💜 **Mensaje de Agradecimiento** - Ya viene con tu mensaje de agradecimiento
   - 🚨 **Alerta de Emergencia** - Para emergencias urgentes
   - 🔧 **Mantenimiento** - Para avisar de mantenimientos
   - 📢 **Anuncio** - Para comunicados generales

3. Editá el mensaje si querés
4. Click en **"Enviar Mensaje"**

✅ **LISTO!** Todos los usuarios lo verán la próxima vez que entren.

---

### **Opción B: Mensaje Personalizado**

1. Completá el formulario:
   - **Tipo**: Elegí el tipo de mensaje
   - **Destinatarios**: A quién va (todos, compradores, vendedores, etc.)
   - **Prioridad**: Normal, Alta o Crítica
   - **Título**: El título del mensaje
   - **Mensaje**: Tu mensaje completo
   - **Icono**: Un emoji (opcional) ej: 💜, 🚨, 🎉
   - **Duración**: Cuántos días estará activo (opcional)

2. Opciones avanzadas:
   - ☑️ **Reproducir sonido**: Para emergencias (solo si es crítico)
   - ☑️ **No cerrar automáticamente**: El usuario debe cerrarlo manualmente

3. Click en **"Enviar Mensaje"**

---

## 📋 Tipos de Mensajes

### **💜 Agradecimiento**
**Cuándo usar**: Para agradecer a la comunidad
**Ejemplo**:
```
Título: ¡Gracias por estar aquí! 💜
Mensaje: Querida comunidad, quiero agradecerles de corazón 
por confiar en Cresalia. Juntos estamos construyendo 
algo hermoso. - El equipo de Cresalia
```

---

### **🚨 Emergencia**
**Cuándo usar**: Para alertas urgentes
**Características**: 
- Prioridad CRÍTICA
- Con sonido
- No se cierra automáticamente
- Color rojo

**Ejemplo**:
```
Título: 🚨 Alerta de Emergencia en Zona Centro
Mensaje: Se reportó una emergencia en la zona centro. 
Mantente seguro y sigue las indicaciones de las autoridades.
```

---

### **📢 Anuncio**
**Cuándo usar**: Para comunicados importantes
**Ejemplo**:
```
Título: 📢 Nueva Funcionalidad en Cresalia
Mensaje: Hemos agregado un nuevo sistema de mensajería 
para que puedas contactar directamente con los vendedores.
```

---

### **🔧 Mantenimiento**
**Cuándo usar**: Para avisar de mantenimientos programados
**Ejemplo**:
```
Título: Mantenimiento Programado 🔧
Mensaje: Mañana de 2 a 4 AM realizaremos mantenimiento. 
Algunas funciones pueden no estar disponibles.
Duración: 1 día
```

---

### **🎁 Promoción**
**Cuándo usar**: Para ofertas y promociones
**Ejemplo**:
```
Título: ¡50% OFF en toda la plataforma! 🎁
Mensaje: Esta semana tenemos descuentos especiales 
en todos los productos. ¡No te lo pierdas!
Duración: 7 días
```

---

## 📊 Ver Estadísticas

En el panel verás:
- ✅ **Total de lecturas**: Cuántas personas vieron el mensaje
- 👥 **Destinatarios**: A quiénes fue enviado
- 🚩 **Prioridad**: Nivel de urgencia
- 📅 **Fecha de envío**: Cuándo lo enviaste

---

## 🎨 Cómo se Ven los Mensajes

### **Para los Usuarios**:

Los mensajes aparecen automáticamente usando el sistema **elegant-notifications** que ya tenés:

- **Información** (azul): Para anuncios generales
- **Éxito** (verde): Para mensajes positivos y agradecimientos
- **Advertencia** (amarillo): Para mantenimientos y avisos
- **Error** (rojo): Para emergencias

**Se muestran**:
- Al abrir la página
- Elegante y no intrusivo
- Se puede cerrar con una X
- Desaparece automáticamente (excepto emergencias críticas)

---

## 🔒 Seguridad

### **Solo la administradora puede enviar mensajes**:
- La tabla tiene RLS (Row Level Security) configurado
- Solo el email de administración puede crear/editar/eliminar
- Todos los demás solo pueden **leer**

### **Control Total**:
- Podés desactivar cualquier mensaje en cualquier momento
- Los mensajes tienen fecha de inicio y fin
- Se guardan todas las lecturas para estadísticas

---

## 🔄 Flujo Completo

### **Cuando VOS enviás un mensaje**:
1. Completás el formulario en `PANEL-MENSAJES-ADMIN.html`
2. Click en "Enviar"
3. Se guarda en Supabase (tabla `mensajes_globales`)

### **Cuando un usuario entra a Cresalia**:
1. La página carga el script `sistema-mensajes-globales.js`
2. Se conecta a Supabase
3. Busca mensajes activos para ese tipo de usuario
4. Muestra los mensajes que no haya visto antes
5. Marca el mensaje como leído
6. Guarda la lectura en Supabase

---

## 💡 Consejos de Uso

### **Para Agradecimientos**:
- Enviá mensajes sinceros y personales
- Firmá con "El equipo de Cresalia" o sin firma
- Usá emojis de corazón 💜
- Prioridad: ALTA (para que lo vean)

### **Para Emergencias**:
- Prioridad: CRÍTICA
- Activá el sonido
- Marcá como persistente
- Sé clara y específica

### **Para Anuncios**:
- Prioridad: NORMAL
- Agregá un botón de acción si hay más info
- Establecé fecha de fin si es temporal

### **Para Mantenimientos**:
- Avisá con anticipación
- Especificá horario exacto
- Marcá duración corta (1-2 días)

---

## 📱 Funciona En Todo

✅ **Desktop**
✅ **Mobile**
✅ **Tablet**
✅ **PWA**
✅ **Todos los navegadores**

---

## 🎯 Ejemplos Prácticos

### **Ejemplo 1: Agradecer a la Comunidad**

```
Tipo: Agradecimiento
Destinatarios: Todos
Prioridad: Alta
Título: ¡Gracias por hacer de Cresalia tu casa! 💜
Mensaje: 
Querida comunidad,

Queremos tomarnos un momento para agradecerles de corazón 
por confiar en Cresalia. Cada venta, cada compra, cada 
mensaje... todo eso construye esta hermosa comunidad que 
somos juntos.

Gracias por estar aquí. Gracias por creer en nosotros.

Con mucho cariño,
El equipo de Cresalia 💜
```

---

### **Ejemplo 2: Alerta de Emergencia**

```
Tipo: Emergencia
Destinatarios: Todos
Prioridad: Crítica
Título: 🚨 Alerta Climática - Precaución
Mensaje: 
Se pronostica mal tiempo en varias zonas. 
Por favor, tomen precauciones:

- Eviten salir si no es necesario
- Mantengan contacto con sus seres queridos
- Sigan las indicaciones de las autoridades

El equipo de Cresalia está con ustedes. ¡Cuídense! 💜
```

---

### **Ejemplo 3: Nuevo Sistema**

```
Tipo: Anuncio
Destinatarios: Todos
Prioridad: Normal
Título: 🎉 ¡Nueva funcionalidad disponible!
Mensaje: 
Ahora podés recibir notificaciones personalizadas 
sobre tus productos favoritos, nuevas ofertas y más.

¡Configurá tus preferencias en "Mi Cuenta" > "Notificaciones"!
Duración: 7 días
```

---

## ❓ Preguntas Frecuentes

### **¿Los mensajes se envían por email?**
No, aparecen directamente en la plataforma cuando el usuario entra.

### **¿Puedo borrar un mensaje después de enviarlo?**
Sí, podés desactivarlo y dejará de mostrarse.

### **¿Puedo ver quién leyó el mensaje?**
Sí, en el panel verás el total de lecturas.

### **¿Cuánto tiempo permanece un mensaje?**
El tiempo que vos elijas. Si no especificás, se queda activo hasta que lo desactives.

### **¿Los usuarios pueden responder?**
No directamente, pero podés agregar un botón con link a un formulario de contacto.

### **¿Puedo programar mensajes para el futuro?**
No en esta versión, pero es fácil de agregar si lo necesitás.

---

## 🚀 Próximos Pasos Sugeridos

1. **Probá el sistema** enviando un mensaje de prueba
2. **Enviá tu primer mensaje de agradecimiento** a la comunidad
3. **Configurá alertas de emergencia** por si las necesitás
4. **Usá el panel regularmente** para mantener a la comunidad informada

---

## 💬 Mensaje Final

Este sistema te da **control total** sobre la comunicación con tu comunidad. 

Usalo para:
- ✅ Agradecer y motivar
- ✅ Mantener informados
- ✅ Coordinar en emergencias
- ✅ Anunciar novedades
- ✅ Construir comunidad

**Porque en Cresalia, todos SOMOS importantes.** 💜

---

¿Necesitás ayuda o querés agregar alguna función? ¡Decime y lo hacemos! 😊
