# 🎨 Personalización Visual: Disponible en TODOS los Planes

## Decisión Estratégica

**La personalización de colores y estilos para celebraciones está disponible en TODOS los planes** (Básico, Pro, Enterprise), sin restricciones.

### Razón:

1. **Es un día especial**: Cumpleaños y aniversarios son momentos únicos que merecen reconocimiento
2. **Genera engagement**: Las tiendas/servicios se sienten valoradas y celebradas
3. **Diferenciación**: Pocas plataformas ofrecen esto sin restricciones
4. **Genera contenido**: Los banners personalizados hacen la plataforma más atractiva

### Limitaciones:

- **Aniversario de Cresalia**: NO es personalizable (colores fijos de marca)
- **Duración**: La personalización solo se aplica durante el mes de celebración
- **Sincronización**: Los colores se aplican tanto en la portada de Cresalia como en la página de la tienda/servicio

---

## Implementación Técnica

- La tabla `aniversarios_personalizacion` NO tiene campo de plan
- Cualquier tienda/servicio puede crear personalizaciones
- Los colores se aplican automáticamente en `index-cresalia.html` durante el mes de celebración
- Los colores también se sincronizan con la página individual de la tienda/servicio

---

## Nota sobre Servicios vs Tiendas

- **Tiendas**: Tienen su propia tabla `tiendas` y personalizaciones
- **Servicios**: Tienen su propia tabla `servicios` y personalizaciones separadas
- Ambos aparecen en secciones diferentes en `index-cresalia.html`
- Ambos pueden personalizar sus celebraciones independientemente


