# 🎯 Centros de Ayuda para Comunidades - Cresalia

**Fecha:** 27 de Enero, 2025

---

## 📋 Contexto

Las comunidades de Cresalia son **diferentes entre sí** y necesitan centros de ayuda **personalizados** según su tipo:

1. **Cresalia-Jobs** - Marketplace de empleos
2. **Comunidades de Desahogo** - Espacios de apoyo emocional
3. **Comunidades de Donaciones** - Sistema de donaciones
4. **Alerta de Servicios** - Alertas de servicios públicos

Cada una tiene necesidades, preguntas frecuentes y guías diferentes.

---

## 🎨 Diseño de Centros de Ayuda por Comunidad

### **1. Cresalia-Jobs (Marketplace de Empleos)**

**FAQs específicas:**
- ¿Cómo publico un trabajo?
- ¿Cómo me postulo a un trabajo?
- ¿Hay comisiones por publicar?
- ¿Cómo verifico que un empleador es confiable?
- ¿Puedo editar mi postulación?
- ¿Cómo contacto al empleador?

**Guías:**
- Publicar mi primer trabajo (5 min)
- Postularme a un trabajo (3 min)
- Configurar alertas de trabajos (2 min)

**Categorías:**
- 🏢 Para Empleadores
- 👤 Para Candidatos
- 💼 Tipos de Trabajo
- 🔒 Seguridad y Verificación

---

### **2. Comunidades de Desahogo**

**FAQs específicas:**
- ¿Son realmente anónimas?
- ¿Quién puede ver mis publicaciones?
- ¿Hay moderación?
- ¿Cómo reporto contenido inapropiado?
- ¿Puedo eliminar mis publicaciones?
- ¿Hay límite de publicaciones?

**Guías:**
- Crear mi primera publicación (2 min)
- Configurar privacidad (3 min)
- Reportar contenido (1 min)

**Categorías:**
- 🔒 Privacidad y Anonimato
- ✍️ Publicar y Compartir
- 🛡️ Moderación y Reportes
- 💜 Apoyo y Recursos

---

### **3. Comunidades de Donaciones**

**FAQs específicas:**
- ¿Cómo hago una donación?
- ¿Cómo creo una campaña de donación?
- ¿Hay comisiones en las donaciones?
- ¿Cómo verifico que la campaña es legítima?
- ¿Puedo donar de forma anónima?
- ¿Cómo recibo el dinero donado?

**Guías:**
- Crear mi primera campaña (5 min)
- Hacer una donación (2 min)
- Verificar una campaña (3 min)

**Categorías:**
- 💰 Para Donantes
- 🎯 Para Creadores de Campañas
- ✅ Verificación y Seguridad
- 📊 Transparencia

---

### **4. Alerta de Servicios**

**FAQs específicas:**
- ¿Cómo reporto un corte de luz?
- ¿Cómo me suscribo a alertas?
- ¿Las alertas son en tiempo real?
- ¿Puedo reportar múltiples servicios?
- ¿Cómo cambio mi ubicación?
- ¿Hay alertas por email?

**Guías:**
- Reportar mi primera alerta (2 min)
- Suscribirme a alertas (3 min)
- Configurar notificaciones (2 min)

**Categorías:**
- ⚡ Servicios Públicos
- 📍 Ubicación y Zona
- 🔔 Notificaciones
- 📧 Alertas por Email

---

## 🚀 Implementación Futura

### **Estructura de Archivos Sugerida:**

```
js/
├── centro-ayuda-widget.js          # Widget base (ya existe)
├── centro-ayuda-jobs.js            # Versión para Jobs
├── centro-ayuda-desahogo.js        # Versión para Desahogo
├── centro-ayuda-donaciones.js      # Versión para Donaciones
└── centro-ayuda-alertas.js         # Versión para Alertas

css/
├── centro-ayuda.css                # Estilos base (ya existe)
├── centro-ayuda-jobs.css            # Estilos para Jobs
├── centro-ayuda-desahogo.css        # Estilos para Desahogo
├── centro-ayuda-donaciones.css     # Estilos para Donaciones
└── centro-ayuda-alertas.css        # Estilos para Alertas
```

### **Cómo Funcionaría:**

1. **Detectar tipo de comunidad** automáticamente
2. **Cargar el centro de ayuda correspondiente**
3. **Mostrar FAQs y guías específicas**
4. **Personalizar colores y branding** según la comunidad

---

## 💡 Ejemplo de Implementación

### **Para Cresalia-Jobs:**

```javascript
// Detectar si estamos en Jobs
if (window.location.pathname.includes('/jobs') || 
    window.location.pathname.includes('/empleos')) {
    
    // Cargar centro de ayuda específico para Jobs
    const script = document.createElement('script');
    script.src = 'js/centro-ayuda-jobs.js';
    document.body.appendChild(script);
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/centro-ayuda-jobs.css';
    document.head.appendChild(link);
}
```

---

## 📊 Prioridad de Implementación

1. **Alta:** Cresalia-Jobs (marketplace activo)
2. **Media:** Comunidades de Desahogo (muchos usuarios)
3. **Media:** Comunidades de Donaciones (importante para transparencia)
4. **Baja:** Alerta de Servicios (más simple, menos FAQs)

---

## 🎯 Próximos Pasos

1. ✅ **Centro de ayuda base implementado** (para tiendas)
2. ⏳ **Crear versión para Cresalia-Jobs**
3. ⏳ **Crear versión para Comunidades de Desahogo**
4. ⏳ **Crear versión para Donaciones**
5. ⏳ **Crear versión para Alertas**

---

**Nota:** Por ahora, el centro de ayuda base está implementado para tiendas. Las comunidades pueden usar el sistema base temporalmente hasta que se creen las versiones personalizadas.

---

**Última actualización:** 27 de Enero, 2025  
**Mantenido por:** Equipo Cresalia 💜

