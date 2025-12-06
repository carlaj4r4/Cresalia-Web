# 🔧 Correcciones Pendientes en Comunidades

## ✅ **COMPLETADO**

### **1. Doble Sistema de Feedback - CORREGIDO**
Se comentó `sistema-feedbacks-general.js` en las siguientes comunidades (ya tienen `sistema-feedbacks-comunidades.js`):
- ✅ experiencias-sobrenaturales
- ✅ viajeros
- ✅ enfermedades-cronicas
- ✅ inmigrantes-racializados
- ✅ lgbtq-experiencias
- ✅ gamers-videojuegos
- ✅ otakus-anime-manga
- ✅ anti-bullying
- ✅ cuidadores
- ✅ adultos-mayores
- ✅ discapacidad
- ✅ madres-padres-solteros
- ✅ medicos-enfermeros
- ✅ veterinarios
- ✅ bomberos
- ✅ hombres-sobrevivientes
- ✅ mujeres-sobrevivientes
- ✅ estres-laboral

### **2. Historial Agregado - PARCIALMENTE COMPLETADO**
Se agregó el botón "Mi Historial" y la sección correspondiente en:
- ✅ enfermedades-cronicas

## ⚠️ **PENDIENTE**

### **1. Agregar Historial a Comunidades que Faltan**
Las siguientes comunidades necesitan el tab/sección "Mi Historial":
- ⚠️ Verificar individualmente cuáles no tienen `mi-historial-foro-lista`

### **2. Verificar PWA (Service Worker)**
Todas las comunidades deben tener:
- ✅ Manifest cargado (`manifest-comunidades.json`)
- ⚠️ Service Worker registrado correctamente
- ⚠️ Verificar que funcione en todas las comunidades

## 📋 **PATRÓN PARA AGREGAR HISTORIAL**

```html
<!-- Botón en el foro-header -->
<button class="btn-primary" onclick="if(window.foroComunidad) window.foroComunidad.cargarMiHistorial(); document.getElementById('mi-historial-foro').style.display = 'block'; document.getElementById('posts-container').style.display = 'none';" style="background: linear-gradient(135deg, #8b5cf6, #a78bfa);">
    <i class="fas fa-history"></i> Mi Historial
</button>

<!-- Sección de historial (después de posts-container) -->
<div id="mi-historial-foro" style="display: none;">
    <div class="info-box" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.1)); border-left-color: #8b5cf6; margin-bottom: 20px; padding: 20px; border-radius: 12px;">
        <h3 style="color: #7c3aed; margin-bottom: 10px;">📝 Mis Posts en el Foro</h3>
        <p style="margin: 0; line-height: 1.8; color: #374151;">
            Aquí podés ver todos tus posts, editarlos, pausarlos o eliminarlos.
        </p>
    </div>
    <div id="mi-historial-foro-lista" class="publicaciones-lista"></div>
</div>
```

## 📋 **PATRÓN PARA PWA**

```javascript
// Registrar Service Worker para PWA
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../../sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration.scope);
            })
            .catch(error => {
                console.log('⚠️ Service Worker no disponible (normal en desarrollo)');
            });
    });
}
```

---

**Última actualización:** 2025-01-27

