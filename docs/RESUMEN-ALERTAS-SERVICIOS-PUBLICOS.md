# ⚡ Resumen: Alertas de Servicios Públicos

**Fecha:** 2025-01-27

---

## ✅ **Nueva Comunidad Creada**

### **Concepto:**
Sistema para reportar cortes de servicios públicos (luz, agua, gas) y generar alertas automáticas para autoridades cuando se acumulan múltiples reportes de la misma zona.

---

## 🚀 **Características Implementadas**

### **1. Interfaz de Usuario:**
- ✅ Página principal con diseño moderno y responsive
- ✅ 4 pestañas principales:
  - 📋 Reportes Actuales (lista de cortes reportados)
  - ➕ Reportar Corte (formulario para nuevos reportes)
  - 📊 Estadísticas (métricas y gráficos)
  - ℹ️ Información (FAQ y contactos de emergencia)

### **2. Sistema de Reportes:**
- ✅ Formulario completo para reportar cortes
- ✅ Tipos de servicio: Luz, Agua, Gas, Otro
- ✅ Niveles de urgencia: Urgente, Moderado, Leve
- ✅ Ubicación: Ciudad, Provincia, Dirección (opcional)
- ✅ Descripción detallada del corte
- ✅ Autorización opcional para enviar alerta a autoridades

### **3. Visualización:**
- ✅ Lista de reportes activos con filtros
- ✅ Filtros por servicio y provincia
- ✅ Badges visuales para tipos de servicio y urgencia
- ✅ Información de fecha y número de reportes

### **4. Estadísticas:**
- ✅ Total de reportes
- ✅ Reportes del día
- ✅ Zona más afectada
- ✅ Servicio más reportado

### **5. Integración con Sistema de Alertas:**
- ✅ Detección automática de patrones (múltiples reportes en la misma zona)
- ✅ Cuando se acumulan 3+ reportes similares en 24 horas, se crea alerta
- ✅ Envío automático de email a autoridades con información consolidada
- ✅ Formato profesional del email con HTML

---

## 📋 **Estructura de la Base de Datos**

### **Tabla: `alertas_servicios_publicos`**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGSERIAL | ID único |
| `tipo_servicio` | VARCHAR(20) | luz, agua, gas, otro |
| `urgencia` | VARCHAR(20) | urgente, moderado, leve |
| `ciudad` | VARCHAR(100) | Ciudad del corte |
| `provincia` | VARCHAR(100) | Provincia |
| `direccion` | TEXT | Dirección específica (opcional) |
| `descripcion` | TEXT | Descripción del corte |
| `autorizar_alerta` | BOOLEAN | Si autoriza enviar alerta |
| `reportado_por_hash` | VARCHAR(64) | Hash del usuario (anonimato) |
| `estado` | VARCHAR(20) | activo, resuelto, cerrado |
| `num_reportes` | INTEGER | Número de reportes similares |
| `fecha_reporte` | TIMESTAMP | Fecha de creación |
| `alerta_enviada` | BOOLEAN | Si ya se envió alerta consolidada |

---

## 🔧 **Archivos Creados**

1. **`comunidades/alertas-servicios-publicos/index.html`**
   - Interfaz completa de la comunidad
   - Diseño moderno y responsive
   - 4 pestañas con funcionalidades

2. **`js/comunidad-alertas-servicios-publicos.js`**
   - Lógica de frontend
   - Carga de reportes
   - Manejo de formularios
   - Detección de patrones para alertas

3. **`supabase-alertas-servicios-publicos.sql`**
   - Esquema de base de datos
   - Índices optimizados
   - RLS (Row Level Security)
   - Triggers para actualización automática

4. **`api/alertas-servicios-enviar.js`**
   - API endpoint para enviar alertas
   - Integración con Brevo (email)
   - Formato HTML profesional
   - Envío a autoridades

---

## 📧 **Sistema de Alertas Automáticas**

### **Cómo Funciona:**

1. **Usuario reporta corte** → Se guarda en base de datos
2. **Sistema busca reportes similares** → Mismo servicio, misma zona, últimas 24 horas
3. **Si hay 3+ reportes** → Se activa la alerta automática
4. **Se envía email a autoridades** con:
   - Tipo de servicio afectado
   - Ubicación (ciudad, provincia, dirección)
   - Nivel de urgencia
   - Descripción consolidada
   - Número de reportes recibidos
   - Recomendaciones

### **Email a Autoridades:**
- Formato HTML profesional
- Información consolidada y clara
- Recomendaciones de acción
- Nota sobre autorización ciudadana

---

## 🔗 **Integraciones**

- ✅ **Supabase**: Base de datos para reportes
- ✅ **Brevo**: Envío de emails a autoridades
- ✅ **Sistema de Alertas de Emergencias**: Posible integración futura

---

## 📝 **Próximos Pasos**

1. **Ejecutar SQL:**
   - Ejecutar `supabase-alertas-servicios-publicos.sql` en Supabase

2. **Configurar Email:**
   - Verificar que `BREVO_API_KEY` esté en Vercel
   - Configurar `ADMIN_EMAIL` con el email de autoridades (si es diferente)

3. **Agregar al Menú Principal:**
   - Ya está agregado en el footer de `index-cresalia.html`
   - También agregado en `vercel.json` para routing

4. **Probar:**
   - Ir a `/comunidades/alertas-servicios-publicos/`
   - Crear algunos reportes de prueba
   - Verificar que se muestren en la lista
   - Verificar que se generen alertas cuando hay 3+ reportes similares

---

## 💡 **Casos de Uso**

### **Ejemplo Real:**
1. **3 usuarios reportan** corte de luz en "Villa Crespo, CABA" en las últimas 24 horas
2. **Sistema detecta patrón** automáticamente
3. **Se genera alerta consolidada** con:
   - Tipo: Luz
   - Zona: Villa Crespo, CABA
   - Número de reportes: 3
   - Urgencia: Según reportes
4. **Se envía email a autoridades** competentes
5. **Las autoridades reciben información clara** y pueden tomar acción

---

## 🎯 **Beneficios**

- ✅ **Ciudadanos**: Pueden reportar cortes fácilmente y ayudar a la comunidad
- ✅ **Autoridades**: Reciben información consolidada y verificada
- ✅ **Comunidad**: Mayor transparencia y comunicación
- ✅ **Cresalia**: Nueva funcionalidad útil que ayuda a la sociedad

---

## 🔒 **Privacidad y Seguridad**

- ✅ Reportes anónimos (solo hash de usuario)
- ✅ No se muestra información personal
- ✅ RLS configurado en Supabase
- ✅ Validación de datos en frontend y backend

---

## 📌 **Notas Importantes**

- Los reportes son públicos y visibles para todos
- Solo se envían alertas cuando hay múltiples reportes (reducción de falsos positivos)
- El sistema es automático pero requiere autorización del usuario
- En emergencias graves (fugas de gas, etc.), siempre llamar a 911 primero

---

**Última actualización:** 2025-01-27  
**Mantenido por:** Equipo Cresalia 💜



