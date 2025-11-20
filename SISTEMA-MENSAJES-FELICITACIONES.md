# 🎉 Sistema de Mensajes de Felicitaciones Personalizados

## Mensajes según Tipo de Usuario y Celebración

### Para Tiendas/Servicios (Panel de Administración):

**Cuando ingresan a su panel durante su mes de celebración:**

1. **Cumpleaños del Fundador:**
   - Mensaje: "¡Felicidades y bienvenido, [nombre de la tienda/servicio]! 🎂"
   - Color: Usa los colores personalizados de la celebración

2. **Aniversario del Negocio:**
   - Mensaje: "¡Felicidades y bienvenido, [nombre de la tienda/servicio]! 🎊"
   - Color: Usa los colores personalizados de la celebración

3. **Aniversario en Cresalia:**
   - Mensaje: "¡Felicidades y bienvenido, [nombre de la tienda/servicio]! Gracias por ser parte de Cresalia 🎉"
   - Color: Colores oficiales de Cresalia (no personalizable)

4. **Día normal (sin celebración):**
   - Mensaje: "Bienvenido, [nombre de la tienda/servicio]"
   - Color: Colores por defecto del sistema

---

### Para Compradores (Panel de Comprador):

**Cuando inician sesión durante su mes de celebración:**

1. **Cumpleaños:**
   - Mensaje: "¡Bienvenido y Feliz Cumpleaños, [nombre del comprador]! 🎂"
   - Color: Colores cálidos (dorado/naranja)

2. **Aniversario en Cresalia:**
   - Mensaje: "¡Bienvenido y Feliz Aniversario, [nombre del comprador]! Gracias por ser parte de Cresalia 🎉"
   - Color: Colores oficiales de Cresalia

3. **Día normal (sin celebración):**
   - Mensaje: "Bienvenido, [nombre del comprador]"
   - Color: Colores por defecto del sistema

---

## Integración con Sistema de Bienestar Emocional

- Los colores personalizados se aplican automáticamente al sistema de bienestar
- Los mensajes aparecen en la parte superior del panel
- Los colores se sincronizan con los banners de celebración

---

## Implementación Técnica

- Tabla `bienestar_personalizacion` almacena colores y mensajes
- Se consulta al cargar el panel
- Si hay celebración activa, se aplican colores y mensajes personalizados
- Si no hay celebración, se usan valores por defecto


