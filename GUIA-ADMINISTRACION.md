# 👑 Guía de Administración - CRESALIA

## 🎯 Cómo Ver y Gestionar TODO

### **Tienes 2 Opciones para Ver Datos:**

---

## 📊 **OPCIÓN 1: Panel Master (Recomendado)**

### **¿Qué es?**
Un panel visual donde ves TODO en tiempo real:
- 👥 Lista de compradores
- 🏪 Lista de tiendas
- 🎫 Tickets de soporte
- 📈 Estadísticas en vivo

### **Cómo Acceder:**
1. Abre: `admin-cresalia-master.html` en tu navegador
2. **Listo** - verás todo automáticamente

### **Qué Ves:**
- **Total de compradores** registrados
- **Total de tiendas** activas
- **Tickets pendientes** de soporte
- **Listas completas** con todos los datos

### **Se Actualiza:**
- **Automáticamente** cada 30 segundos
- **En tiempo real** con Supabase

---

## 🗄️ **OPCIÓN 2: Directamente en Supabase**

### **Paso 1: Entrar a Supabase**
1. Ve a: https://app.supabase.com
2. Inicia sesión
3. Selecciona tu proyecto

### **Paso 2: Ver Compradores**

**Opción A - Solo Emails:**
```
Authentication → Users
```
Aquí ves todos los emails registrados (compradores Y vendedores juntos)

**Opción B - Datos Completos:**
```
Table Editor → compradores
```
Aquí ves:
- Nombre completo
- Email
- Teléfono
- Dirección
- Total de compras
- Última compra
- etc.

### **Paso 3: Ver Tiendas**
```
Table Editor → tiendas
```
Aquí ves todas las tiendas:
- Nombre de la tienda
- Email del dueño
- Plan contratado
- Subdomain
- Si está activa
- Configuración

### **Paso 4: Ver Tickets de Soporte**
```
Table Editor → tickets_soporte
```
Aquí ves todos los reclamos/problemas:
- Quién reportó
- Qué problema tiene
- Cuándo lo reportó
- Estado (abierto/resuelto)
- Descripción completa

---

## 🆘 **Cómo Sabrás si Hay Problemas:**

### **Método 1: Panel Master (Automático)**

Deja abierto `admin-cresalia-master.html`:
- ✅ Se actualiza cada 30 segundos
- ✅ Ves tickets nuevos automáticamente
- ✅ Contador de tickets abiertos
- ✅ Alertas visuales

### **Método 2: Supabase Dashboard**

En tu proyecto Supabase:
```
Table Editor → tickets_soporte → Click "Refresh"
```

### **Método 3: Notificaciones (Próximo)**

Puedes configurar:
- 📧 Email cuando hay ticket nuevo
- 📱 SMS/WhatsApp para urgencias
- 🔔 Notificaciones de escritorio

---

## 📧 **Cómo los Usuarios Reportan Problemas:**

### **Para Compradores:**

En `index-cresalia.html`:
1. Click "Mi Cuenta"
2. Click "Reportar Problema"
3. Llena formulario
4. Se guarda en `tickets_soporte`

### **Para Vendedores:**

En `admin.html`:
1. Sección "Ayuda" o "Soporte"
2. Click "Reportar Problema Técnico"
3. Llena formulario
4. Se guarda en `tickets_soporte`

---

## 🔔 **Configurar Notificaciones por Email:**

### **En Supabase:**

1. Ve a **Database** → **Webhooks**
2. Crea nuevo webhook:
   ```
   Tabla: tickets_soporte
   Evento: INSERT (cuando se crea nuevo ticket)
   URL: https://hooks.zapier.com/... (tu webhook)
   ```

3. Conecta con:
   - **Zapier** (gratis) → envía email
   - **Make.com** (gratis) → envía email
   - **Tu email** directamente

### **Zapier (Más Fácil):**

1. Crea cuenta en Zapier.com (gratis)
2. Nuevo Zap:
   ```
   Trigger: Webhook (recibe de Supabase)
   Action: Gmail - Enviar email a carla@cresalia.com
   ```
3. Cada vez que hay ticket nuevo → recibes email

---

## 📱 **Alternativas para Monitoreo:**

### **Opción A: Email Diario**
- Resumen de tickets del día
- Nuevos usuarios registrados
- Nuevas tiendas creadas

### **Opción B: WhatsApp (Urgente)**
- Solo tickets marcados como "urgente"
- Vía Twilio o N8N

### **Opción C: Slack/Discord**
- Canal dedicado
- Notificaciones en tiempo real
- Bots automáticos

---

## 📊 **Ejemplo de Uso Diario:**

### **Rutina Matutina (5 minutos):**

1. Abrir: `admin-cresalia-master.html`
2. Revisar:
   - ✅ Tickets nuevos (si hay)
   - ✅ Nuevos compradores
   - ✅ Nuevas tiendas
   - ✅ Todo OK

3. Si hay tickets:
   - Click "Ver"
   - Leer problema
   - Responder por email
   - Marcar como "resuelto"

---

## 🗂️ **Estructura de Datos:**

### **¿Dónde está cada cosa?**

```
SUPABASE (Todo en la Nube):
│
├── 📊 Table: compradores
│   ├── Juan Pérez (nombre, email, compras)
│   ├── María López
│   └── ...
│
├── 📊 Table: tiendas  
│   ├── Librería Maravillas (nombre, plan, config)
│   ├── Tech Store
│   └── ...
│
├── 📊 Table: tickets_soporte
│   ├── Ticket #1: "Error en pago" (Juan Pérez)
│   ├── Ticket #2: "No puedo subir foto" (Librería Maravillas)
│   └── ...
│
└── 🔐 Authentication: auth.users
    └── Todos los emails (compradores + vendedores)
```

### **NO hay carpetas locales de usuarios** porque:
- Todo está en Supabase (cloud)
- Accesible desde cualquier dispositivo
- Respaldos automáticos
- Escalable infinitamente

---

## 🔐 **Seguridad:**

### **¿Otros pueden ver estos datos?**

**NO**, porque:
- ✅ Row Level Security (RLS) activado
- ✅ Cada usuario solo ve SUS datos
- ✅ Solo TÚ puedes ver todo (como admin)

### **¿Cómo ves TÚ todo?**

**En Supabase:** Tienes acceso completo porque es TU proyecto

**Panel Master:** Usa la anon key pero mostrará todo porque no hay RLS que te restrinja a ti (eres el admin del proyecto)

---

## 🚀 **Próximos Pasos:**

1. ✅ **Ahora:** Abre `admin-cresalia-master.html` y ve tus datos
2. ⏳ **Esta semana:** Ejecuta `supabase-soporte.sql` para tickets
3. ⏳ **Próxima semana:** Configura notificaciones por email

---

## 💡 **Resumen Simple:**

**¿Dónde están los compradores?**
→ En Supabase → Table Editor → compradores

**¿Cómo veo los reclamos?**
→ Abre `admin-cresalia-master.html` o Supabase → tickets_soporte

**¿Me notifica automáticamente?**
→ No por defecto, pero puedes configurar webhooks/Zapier

**¿Está todo seguro?**
→ Sí, Row Level Security + encriptación

---

**¿Quieres que configure las notificaciones automáticas por email ahora?** 📧💜




















