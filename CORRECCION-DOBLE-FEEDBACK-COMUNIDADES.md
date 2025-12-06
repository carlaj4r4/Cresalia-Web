# 🔧 Corrección: Doble Sistema de Feedback en Comunidades

## 🎯 PROBLEMA IDENTIFICADO

Algunas comunidades tienen **dos sistemas de feedback activos simultáneamente**:
1. `sistema-feedbacks-comunidades.js` ✅ (Correcto - específico para comunidades)
2. `sistema-feedbacks-general.js` ❌ (Incorrecto - es para la plataforma general)

Esto causa:
- ❌ Botones duplicados
- ❌ Confusión para usuarios
- ❌ Datos mezclados
- ❌ Mala experiencia de usuario

---

## 📊 ESTADO ACTUAL

### ✅ **Comunidades CORRECTAS** (solo tienen `sistema-feedbacks-comunidades.js`):
- ✅ duelo-perinatal
- ✅ maternidad
- ✅ viajeros (tiene comentado el general)
- ✅ experiencias-sobrenaturales (tiene comentado el general)
- ✅ enfermedades-cronicas (tiene comentado el general)
- ✅ estres-laboral (tiene comentado el general)
- ✅ mujeres-sobrevivientes (tiene comentado el general)
- ✅ hombres-sobrevivientes (tiene comentado el general)
- ✅ bomberos (tiene comentado el general)
- ✅ veterinarios (tiene comentado el general)
- ✅ medicos-enfermeros (tiene comentado el general)
- ✅ madres-padres-solteros (tiene comentado el general)
- ✅ discapacidad (tiene comentado el general)
- ✅ adultos-mayores (tiene comentado el general)
- ✅ cuidadores (tiene comentado el general)
- ✅ anti-bullying (tiene comentado el general)
- ✅ otakus-anime-manga (tiene comentado el general)
- ✅ gamers-videojuegos (tiene comentado el general)
- ✅ lgbtq-experiencias (tiene comentado el general)
- ✅ inmigrantes-racializados (tiene comentado el general)
- ✅ espiritualidad-fe (tiene comentado el general)
- ✅ libertad-economica (tiene comentado el general)
- ✅ libertad-emocional (tiene comentado el general)
- ✅ desahogo-libre (tiene comentado el general)
- ✅ sanando-abandonos (tiene comentado el general)
- ✅ injusticias-vividas (tiene comentado el general)
- ✅ caminando-juntos (tiene comentado el general)

### ❌ **Comunidades CON PROBLEMA** (tienen ambos sistemas):
- ❌ **alertas-servicios-publicos** - Tiene `sistema-feedbacks-general.js` activo

---

## 🔧 SOLUCIÓN

### **Regla General:**
- ✅ **Comunidades:** Solo usar `sistema-feedbacks-comunidades.js`
- ✅ **Página principal (`index-cresalia.html`):** Solo usar `sistema-feedbacks-general.js`
- ✅ **Tiendas:** Solo usar `sistema-feedbacks.js` (para feedbacks de compradores)

---

## 📝 ACCIONES A REALIZAR

### **1. Corregir `alertas-servicios-publicos/index.html`:**

**Eliminar o comentar:**
```html
<!-- ELIMINAR ESTA LÍNEA: -->
<script src="../../js/sistema-feedbacks-general.js"></script>
```

**Asegurar que tenga:**
```html
<!-- MANTENER ESTA LÍNEA: -->
<script src="../../js/sistema-feedbacks-comunidades.js"></script>
```

**Y en la inicialización:**
```javascript
// Inicializar sistema de feedbacks de comunidad
if (typeof SistemaFeedbacksComunidades !== 'undefined') {
    feedbacksComunidad = new SistemaFeedbacksComunidades('alertas-servicios-publicos');
    window.feedbacksComunidad = feedbacksComunidad;
}
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Después de corregir, verificar que:

- [ ] Solo hay UN botón de feedback visible
- [ ] El botón dice algo relacionado con la comunidad (no "Feedback General")
- [ ] Al hacer click, abre el modal correcto de feedback de comunidad
- [ ] No hay errores en consola del navegador
- [ ] Los feedbacks se guardan en la tabla correcta (`feedbacks_comunidades`)

---

## 🎯 DIFERENCIAS ENTRE SISTEMAS

### **`sistema-feedbacks-comunidades.js`:**
- ✅ Específico para comunidades
- ✅ Feedback sobre la experiencia en la comunidad
- ✅ Guarda en tabla `feedbacks_comunidades`
- ✅ Botón contextualizado a la comunidad

### **`sistema-feedbacks-general.js`:**
- ✅ Para feedback general de la plataforma
- ✅ Feedback sobre Cresalia en general
- ✅ Guarda en tabla diferente
- ✅ Solo debe estar en `index-cresalia.html`

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Corregir `alertas-servicios-publicos/index.html`
2. ✅ Verificar que no haya otros archivos con el problema
3. ✅ Probar en navegador que funcione correctamente
4. ✅ Documentar la corrección

---

*Creado para corregir el problema de doble feedback en comunidades 💜*

