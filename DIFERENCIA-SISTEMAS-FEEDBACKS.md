# 📝 Diferencia entre los Sistemas de Feedbacks

## 🎯 **1. `sistema-feedbacks.js` (FeedbackSystem)**

### ¿Para quién?
**COMPRADORES** que compraron productos/servicios de una **TIENDA específica**

### ¿Sobre qué?
Calificaciones y comentarios sobre **esa tienda en particular**

### ¿Qué permite?
- ⭐ Calificaciones de 1-5 estrellas
- 💬 Comentarios sobre la experiencia de compra
- 👍 Sistema de "útil" 
- 📝 Respuestas de la tienda
- 📊 Estadísticas (promedio de estrellas, distribución)

### ¿Dónde se usa?
- Páginas de tiendas individuales: `tiendas/ejemplo-tienda/index.html`
- Solo se muestra si hay un contenedor `<div id="feedbacksContainer">`
- **NO crea botón flotante**, solo se renderiza en el HTML

### Ejemplo:
```
Comprador compra en "Tienda de Ropa"
→ Deja feedback: ⭐⭐⭐⭐⭐ "Excelente calidad, entrega rápida"
```

---

## 💜 **2. `sistema-feedbacks-general.js` (SistemaFeedbacksGeneral)**

### ¿Para quién?
**USUARIOS** que usan la **PLATAFORMA CRESALIA**

### ¿Sobre qué?
Feedback sobre la **plataforma en general** (no sobre tiendas específicas)

### ¿Qué permite?
- 😤 Reclamos sobre la plataforma
- 💡 Recomendaciones de mejora
- 🎯 Consejos
- 🙏 Agradecimientos
- ✨ Sugerencias de nuevas funcionalidades
- 🐛 Reportar problemas técnicos
- 💭 Comentarios generales

### ¿Dónde se usa?
- `index-cresalia.html` (página principal)
- **SÍ crea un botón flotante** circular en `bottom: 20px, right: 100px`

### Ejemplo:
```
Usuario usa Cresalia
→ Deja feedback: 💡 "Me gustaría que agreguen filtros por zona"
```

---

## 🤔 **Respuesta a tu pregunta:**

**¿El de tiendas es para que las tiendas te den feedbacks a vos o para que el comprador deje feedbacks de las tiendas?**

**Respuesta:** Es para que **los COMPRADORES dejen feedbacks sobre las TIENDAS**.

Por ejemplo:
- Comprador compra en "Tienda de Ropa"
- Comprador deja calificación ⭐⭐⭐⭐⭐ y comentario sobre su experiencia
- Eso ayuda a la tienda a mejorar y a otros compradores a decidir

---

## 💡 **Decisión para `index-cresalia.html`:**

Como ambos están en `index-cresalia.html`:
- El de **tiendas** probablemente NO se muestra (porque no hay contenedor)
- El **general** SÍ se muestra (crea botón flotante)

**Opciones:**
1. ✅ **Eliminar el de tiendas** de `index-cresalia.html` (solo debería estar en páginas de tiendas)
2. ✅ **Mover el general a otra posición** (ej: footer o sección específica)
3. ✅ **Mantener ambos** pero asegurar que no se superpongan

¿Qué preferís?



