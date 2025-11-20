# 🎂 Visión: Sistema de Aniversarios y Celebraciones Cresalia

## 💜 Concepto General

Cresalia reconoce y celebra **múltiples hitos importantes** tanto para compradores como para tiendas/servicios, creando una experiencia emocional y comercialmente valiosa.

---

## 🎯 Tipos de Celebraciones

### Para Compradores:
1. **🎂 Cumpleaños del comprador**
   - Beneficio: 70% OFF en productos seleccionados
   - Aparece en portada si acepta consentimiento

2. **🎉 Aniversario en Cresalia**
   - Se calcula automáticamente desde `fecha_registro`
   - Beneficio: Descuento especial o cupón
   - Aparece en portada si acepta consentimiento

### Para Tiendas/Servicios:
1. **🎂 Cumpleaños del fundador/responsable**
   - Beneficio: **Plan Enterprise gratis por 1 mes**
   - Aparece en portada si acepta consentimiento
   - Pueden crear combos/descuentos especiales para su mes

2. **🏢 Aniversario de creación del negocio**
   - Fecha de fundación de la tienda/servicio
   - Beneficio: Plan Enterprise gratis por 1 mes
   - Pueden crear combos/descuentos especiales

3. **🎊 Aniversario en Cresalia**
   - Se calcula desde `fecha_registro` o `fecha_creacion`
   - Beneficio: Plan Enterprise gratis por 1 mes
   - Pueden crear combos/descuentos especiales

---

## 💰 Sistema de Combos/Descuentos Especiales

### Para Tiendas/Servicios:

Las tiendas pueden crear **combos o descuentos especiales** durante su mes de celebración:

- **Título y descripción** del combo
- **Descuento porcentual** (ej: 30% OFF) o **monto fijo**
- **Productos/servicios incluidos** en el combo
- **Vigencia** (fecha inicio y fin)
- **Banner/imagen** promocional
- **Destacado**: Opción para aparecer en portada de Cresalia

### Beneficios Comerciales:

1. **Para Cresalia**:
   - Más engagement en la plataforma
   - Más ventas = más comisiones
   - Contenido promocional atractivo
   - Diferenciación competitiva

2. **Para Tiendas**:
   - Mayor visibilidad durante su mes especial
   - Oportunidad de aumentar ventas
   - Reconocimiento público
   - Plan Enterprise gratis = más herramientas

3. **Para Compradores**:
   - Descuentos exclusivos
   - Oportunidad de descubrir nuevas tiendas
   - Sensación de comunidad y celebración

---

## 🎨 Experiencia de Usuario

### Compradores:
- Ven en la portada quiénes celebran este mes
- Pueden enviar abrazos y mensajes
- Reciben descuentos automáticos en su cumpleaños/aniversario
- Descubren combos especiales de tiendas que celebran

### Tiendas:
- Reciben notificación antes de su mes de celebración
- Pueden crear combos/descuentos desde su panel
- Aparecen destacadas en la portada durante su mes
- Reciben Plan Enterprise gratis automáticamente
- Ven métricas de sus combos (vistas, usos)

---

## 📊 Métricas y Analytics

- **Combos creados** por mes
- **Combos más vistos/usados**
- **Tiendas que más celebran**
- **Engagement** (abrazos, mensajes)
- **Conversión** (combos → ventas)

---

## 🚀 Implementación Técnica

### Base de Datos:
- ✅ Columnas en `compradores` para múltiples tipos de aniversarios
- ✅ Columnas en `tiendas`/`tenants` para múltiples tipos de aniversarios
- ✅ Tabla `aniversarios_combos` para combos/descuentos especiales
- ✅ Tabla `cumpleanos_historial` extendida para múltiples tipos
- ✅ Tabla `cumpleanos_interacciones` extendida para múltiples tipos

### APIs:
- `GET /api/aniversarios-combos?mes=11` - Listar combos del mes
- `POST /api/aniversarios-combos` - Crear combo (tienda)
- `GET /api/aniversarios-resumen?mes=11` - Resumen del mes
- `GET /api/cumpleaneros-home?mes=11&tipo=cumpleanos|aniversario_negocio|aniversario_cresalia`

### Frontend:
- Panel de tienda: Crear/editar combos especiales
- Portada: Mostrar celebraciones del mes con filtros por tipo
- Panel admin: Ver métricas y gestionar combos destacados

---

## 💡 Próximos Pasos

1. ✅ Esquema SQL completo creado
2. ⏳ Crear APIs para combos
3. ⏳ Panel de tienda para crear combos
4. ⏳ Actualizar portada para mostrar múltiples tipos
5. ⏳ Sistema de notificaciones anticipadas (15 días antes)
6. ⏳ Dashboard de métricas para tiendas

---

## 🎯 Objetivo Final

Crear un **ecosistema de celebración** que:
- Reconozca a cada persona/negocio en sus momentos especiales
- Genere valor comercial para todos
- Fortalezca la comunidad Cresalia
- Diferencie la plataforma de la competencia

**"En Cresalia, cada celebración es una oportunidad de crecer juntos"** 💜


