# 🚨 Panel de Gestión de Alertas Global - Resumen

## ✅ **Lo que he creado:**

### 📄 **Archivo:** `panel-gestion-alertas-global.html`

**Ubicación:** Raíz del proyecto (al lado de `panel-master-cresalia.html`)

---

## 🎯 **Funcionalidades del Panel:**

### 1️⃣ **Crear Nueva Alerta** (Tab "Crear Nueva Alerta")
- ✅ Formulario completo para crear alertas
- ✅ Tipo de alerta (inundación, incendio, tormenta, etc.)
- ✅ Severidad (baja, media, alta, crítica)
- ✅ Título y descripción
- ✅ Ubicación (país, provincia, ciudad)
- ✅ Radio de afectación en km
- ✅ Enlace oficial
- ✅ Fecha de expiración
- ✅ **Selección de comunidades afectadas** (puedes elegir todas o específicas)

### 2️⃣ **Ver Alertas Activas** (Tab "Alertas Activas")
- ✅ Lista de todas las alertas actualmente activas
- ✅ Muestra: tipo, severidad, ubicación, comunidades afectadas
- ✅ Botones para desactivar o eliminar
- ✅ Se actualiza automáticamente

### 3️⃣ **Ver Todas las Alertas** (Tab "Todas las Alertas")
- ✅ Histórico completo de alertas
- ✅ Incluye activas e inactivas
- ✅ Puedes activar/desactivar alertas existentes
- ✅ Puedes eliminar alertas

---

## 🔗 **Cómo acceder al Panel:**

### Opción 1: Desde Panel Master
1. Abre `panel-master-cresalia.html`
2. Busca el botón **"🚨 Gestionar Alertas Global"** en la barra de navegación
3. Click → Se abre en nueva pestaña

### Opción 2: Directo
- Abre directamente: `panel-gestion-alertas-global.html`

---

## 🌐 **Conexión con TODAS las páginas:**

### ✅ **Ya conectado automáticamente:**

1. **Todas las Comunidades:**
   - ✅ `comunidades/estres-laboral/index.html`
   - ✅ `comunidades/mujeres-sobrevivientes/index.html`
   - ✅ `comunidades/hombres-sobrevivientes/index.html`
   - ✅ `comunidades/lgbtq-experiencias/index.html`
   - ✅ `comunidades/anti-bullying/index.html`
   - ✅ `comunidades/discapacidad/index.html`
   - ✅ `comunidades/inmigrantes-racializados/index.html`
   - ✅ `comunidades/adultos-mayores/index.html`
   - ✅ `comunidades/cuidadores/index.html`
   - ✅ `comunidades/enfermedades-cronicas/index.html`

   **Sistema usado:** `js/sistema-alertas-comunidades.js`
   - Se carga automáticamente en cada comunidad
   - Consulta Supabase y muestra alertas activas
   - Muestra banner rojo/amarillo en la parte superior

2. **Páginas Públicas Globales:**
   - ✅ `landing-cresalia-DEFINITIVO.html` (tiene `sistema-alertas-emergencia-global.js`)

### ⚠️ **Para agregar a otras páginas públicas:**

Si querés que otras páginas públicas (como `index-cresalia.html`, `index.html`, etc.) también muestren alertas:

1. Agrega estos scripts antes del `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="config-supabase-seguro.js"></script>
<script src="js/sistema-alertas-comunidades.js"></script>
<script>
    // Inicializar alertas globales (sin comunidad específica)
    document.addEventListener('DOMContentLoaded', () => {
        // Puedes usar 'global' como slug o null
        window.alertasGlobal = new SistemaAlertasComunidades('global');
    });
</script>
```

---

## 🎯 **Cómo funciona:**

### Flujo completo:

1. **Creas alerta en el panel:**
   - Llenás el formulario
   - Seleccionás comunidades (o "Todas")
   - Guardás

2. **La alerta se guarda en Supabase:**
   - Tabla: `alertas_emergencia_comunidades`
   - Campos: tipo, título, descripción, severidad, ubicación, comunidades afectadas, fecha expiración, etc.

3. **Usuarios ven la alerta automáticamente:**
   - Al visitar cualquier comunidad (o página pública con el sistema)
   - El JavaScript consulta Supabase
   - Si hay alertas activas para esa comunidad (o globales)
   - Se muestra un banner en la parte superior

4. **Las alertas se muestran por:**
   - Severidad (crítica primero)
   - Fecha (más recientes primero)
   - Ubicación (si es relevante para el usuario)

---

## 🔧 **Configuración necesaria:**

### 1. Ejecutar SQL en Supabase:
```sql
-- Ya deberías tener ejecutado:
-- supabase-alertas-emergencia-comunidades.sql
```

### 2. Configurar Supabase Keys:
- El panel usa `serviceRoleKey` para crear/editar/eliminar
- Las páginas públicas usan `anonKey` para solo leer
- Ya está configurado en `config-supabase-seguro.js`

---

## 💡 **Ejemplo de uso:**

### Crear alerta de tormenta:

1. Abre el panel
2. Tab "Crear Nueva Alerta"
3. Completa:
   - Tipo: `tormenta`
   - Severidad: `alta`
   - Título: `⚠️ Alerta Meteorológica: Tormenta Intensa`
   - Descripción: `Se esperan lluvias intensas y vientos fuertes. Mantenerse a salvo.`
   - Provincia: `Buenos Aires`
   - Fecha expiración: `Mañana a las 20:00`
   - Comunidades: Marca todas o selecciona específicas
4. Click "Crear Alerta"
5. ✅ **Automáticamente se mostrará en todas las comunidades seleccionadas**

---

## 📋 **Nota sobre Cresalia Jobs:**

✅ **No hay problema** con haber movido `cresalia-jobs` fuera de `comunidades/`

Las referencias en las comunidades usan `../cresalia-jobs/index.html` que funciona correctamente porque:
- `cresalia-jobs/` está en la raíz del proyecto
- `../` desde `comunidades/` sube un nivel y encuentra `cresalia-jobs/`

**Todo está bien conectado.** 💜

---

## 🎯 **Próximos pasos (opcional):**

Si querés agregar alertas a más páginas públicas:
1. Solo agregá los scripts mencionados arriba
2. El sistema funcionará automáticamente
3. Las alertas se mostrarán según la configuración que hagas en el panel

---

## ✅ **Resumen:**

- ✅ Panel creado y funcional
- ✅ Botón agregado al Panel Master
- ✅ Conectado con todas las comunidades (automático)
- ✅ Sistema funciona con Supabase
- ✅ Alertas se muestran automáticamente
- ✅ No hay problemas con las rutas de cresalia-jobs

**¡Todo listo para usar!** 🎉

