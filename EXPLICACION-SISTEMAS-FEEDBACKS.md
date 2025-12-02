# 📝 Explicación de los Sistemas de Feedbacks - Cresalia

## 🤔 Diferencia entre los Dos Sistemas

### 1️⃣ **`sistema-feedbacks.js` (FeedbackSystem)**
**¿Qué es?**
- Sistema para que los **COMPRADORES** califiquen y comenten sobre las **TIENDAS**

**¿Dónde se usa?**
- En las páginas de tiendas individuales: `tiendas/ejemplo-tienda/index.html`
- Solo aparece cuando hay un contenedor `<div id="feedbacksContainer">`

**¿Qué permite?**
- ⭐ Calificaciones de 1-5 estrellas
- 💬 Comentarios sobre la tienda
- 👍 Sistema de votos "útil"
- 📊 Estadísticas (promedio, distribución de estrellas)
- 📝 Respuestas de la tienda a los comentarios

**Ejemplo:**
```
Comprador: "⭐⭐⭐⭐⭐ Excelente servicio, muy buena atención"
```

---

### 2️⃣ **`sistema-feedbacks-general.js` (SistemaFeedbacksGeneral)**
**¿Qué es?**
- Sistema para que los **USUARIOS** le den feedback a **CARLA** sobre la **PLATAFORMA CRESALIA**

**¿Dónde se usa?**
- En `index-cresalia.html` (página principal)
- Crea un botón flotante circular

**¿Qué permite?**
- 😤 Reclamos
- 💡 Recomendaciones
- 🎯 Consejos
- 🙏 Agradecimientos
- ✨ Sugerencias
- 🐛 Reportar problemas
- 💭 Comentarios generales

**Ejemplo:**
```
Usuario: "💡 Recomendación: Me gustaría que agreguen filtros por zona"
```

---

## 🎯 Resumen

| Sistema | Para quién | Sobre qué | Dónde se muestra |
|---------|-----------|-----------|------------------|
| **sistema-feedbacks.js** | Compradores | Tiendas individuales | Páginas de tiendas |
| **sistema-feedbacks-general.js** | Usuarios | Plataforma Cresalia | index-cresalia.html |

---

## 💡 Decisión a Tomar

En `index-cresalia.html` hay **dos scripts de feedbacks**:
1. `sistema-feedbacks.js` - Solo funciona si hay contenedor de feedbacks (probablemente no se muestra)
2. `sistema-feedbacks-general.js` - Crea botón flotante para feedback sobre la plataforma

**Opciones:**
1. **Mantener solo el general** en index-cresalia.html (feedback sobre la plataforma)
2. **Mover el general a otra ubicación** (por ejemplo, footer)
3. **Eliminar el de tiendas** de index-cresalia.html (solo debería estar en páginas de tiendas)

¿Qué preferís?



