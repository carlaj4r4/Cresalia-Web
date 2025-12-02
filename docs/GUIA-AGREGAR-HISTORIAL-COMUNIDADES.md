# 📝 Guía: Agregar Historial a Comunidades con Foro

## ✅ Ya Implementado

Las siguientes comunidades YA tienen historial:
1. ✅ Alertas de Servicios Públicos
2. ✅ Viajeros  
3. ✅ Experiencias Sobrenaturales
4. ✅ Injusticias Vividas (recién agregado)

---

## 🔧 Pasos para Agregar Historial a Otras Comunidades

### 1. Agregar Tab "Mi Historial" en el HTML

En el archivo `comunidades/[nombre-comunidad]/index.html`, buscar los tabs y agregar:

```html
<button class="tab-btn" onclick="[nombreComunidad].mostrarTab('mi-historial')">
    <i class="fas fa-history"></i> Mi Historial
</button>
```

### 2. Agregar Contenido del Tab

Después del tab de foro, agregar:

```html
<!-- Tab: Mi Historial -->
<div id="tab-mi-historial" class="tab-content">
    <div class="foro-header">
        <h2><i class="fas fa-history"></i> Mi Historial de Publicaciones</h2>
        <p style="color: #6b7280; margin-top: 10px; margin-bottom: 20px;">
            Aquí puedes ver todas tus publicaciones, editarlas, pausarlas o eliminarlas. Tu anonimato está protegido.
        </p>
    </div>
    <div id="mi-historial-foro-lista" class="publicaciones-lista"></div>
</div>
```

### 3. Actualizar función mostrarTab (si existe)

En el JavaScript de la comunidad, actualizar la función `mostrarTab`:

```javascript
mostrarTab(tabId) {
    // ... código existente ...
    
    // Si es el tab de historial, cargar el historial
    if (tabId === 'mi-historial' && window.foroComunidad) {
        window.foroComunidad.cargarMiHistorial();
    }
}
```

---

## ✅ Funciones Ya Disponibles

El sistema de foro (`sistema-foro-comunidades.js`) ya tiene todas las funciones necesarias:

- ✅ `cargarMiHistorial()` - Carga los posts del usuario
- ✅ `mostrarMiHistorial(posts)` - Muestra los posts en formato de cards
- ✅ `editarPost(postId)` - Placeholder para edición futura
- ✅ `pausarPost(postId)` - Pausa o reactiva posts
- ✅ `eliminarPost(postId)` - Elimina posts permanentemente

Funciones globales:
- ✅ `window.editarPostForo(postId)`
- ✅ `window.pausarPostForo(postId)`
- ✅ `window.eliminarPostForo(postId)`

---

## 📋 Comunidades que Necesitan Historial

1. ⏳ Espiritualidad y Fe
2. ⏳ Libertad Económica
3. ⏳ Sanando Abandonos
4. ⏳ Libertad Emocional
5. ⏳ Desahogo Libre
6. ⏳ Caminando Juntos
7. ⏳ Duelo Perinatal
8. ⏳ Mujeres Sobrevivientes
9. ⏳ Madres/Padres Solteros
10. ⏳ Hombres Sobrevivientes
11. ⏳ Enfermedades Crónicas
12. ⏳ Inmigrantes Racializados
13. ⏳ Cuidadores
14. ⏳ Adultos Mayores
15. ⏳ LGBTQ Experiencias
16. ⏳ Otakus/Anime/Manga
17. ⏳ Gamers/Videojuegos
18. ⏳ Discapacidad
19. ⏳ Anti-Bullying
20. ⏳ Médicos/Enfermeros
21. ⏳ Veterinarios
22. ⏳ Estrés Laboral
23. ⏳ Bomberos
24. ⏳ Maternidad (tiene sistema propio)
25. ⏳ Cresalia Animales
26. ⏳ Cresalia Solidario
27. ⏳ Cresalia Solidario - Emergencias

---

## 💡 Notas Importantes

- Las tablas de Supabase YA tienen el campo `estado` para pausar/reactivar
- El sistema usa `autor_hash` para mantener anonimato
- Solo el usuario puede ver/editar/eliminar sus propios posts
- Todas las funciones ya están en `sistema-foro-comunidades.js`

---

**Última actualización**: Diciembre 2024  
**Autor**: Claude (co-fundador de Cresalia)


