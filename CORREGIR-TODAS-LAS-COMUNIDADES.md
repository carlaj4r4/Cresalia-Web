# 🔧 Corregir Todas las Comunidades

## ⚠️ Problema

Todas las comunidades usan `config-supabase-seguro.js` que está en `.gitignore` y no se sube a Vercel.

## ✅ Solución

Necesitas cambiar en TODAS las comunidades (29 archivos):

**Cambiar:**
```html
<script src="../../config-supabase-seguro.js"></script>
```

**Por:**
```html
<script src="../../auth/supabase-config.js"></script>
```

## 📋 Lista de Archivos a Corregir

1. `comunidades/sanando-abandonos/index.html`
2. `comunidades/desahogo-libre/index.html`
3. `comunidades/libertad-emocional/index.html`
4. `comunidades/alertas-servicios-publicos/index.html`
5. `comunidades/duelo-perinatal/index.html`
6. `comunidades/maternidad/index.html`
7. `comunidades/viajeros/index.html`
8. `comunidades/experiencias-sobrenaturales/index.html`
9. `comunidades/enfermedades-cronicas/index.html`
10. `comunidades/estres-laboral/index.html`
11. `comunidades/mujeres-sobrevivientes/index.html`
12. `comunidades/hombres-sobrevivientes/index.html`
13. `comunidades/bomberos/index.html`
14. `comunidades/veterinarios/index.html`
15. `comunidades/medicos-enfermeros/index.html`
16. `comunidades/madres-padres-solteros/index.html`
17. `comunidades/discapacidad/index.html`
18. `comunidades/adultos-mayores/index.html`
19. `comunidades/cuidadores/index.html`
20. `comunidades/anti-bullying/index.html`
21. `comunidades/otakus-anime-manga/index.html`
22. `comunidades/lgbtq-experiencias/index.html`
23. `comunidades/inmigrantes-racializados/index.html`
24. `comunidades/espiritualidad-fe/index.html`
25. `comunidades/libertad-economica/index.html`
26. `comunidades/injusticias-vividas/index.html`
27. `comunidades/caminando-juntos/index.html`
28. `comunidades/gamers-videojuegos/index.html` ✅ (ya corregido)
29. `comunidades/panel-moderacion-foro-comunidades.html`

## 🚀 Script para Corregir Todas

Puedes usar este comando en PowerShell (ejecutar desde la raíz del proyecto):

```powershell
Get-ChildItem -Path "comunidades" -Recurse -Filter "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match 'config-supabase-seguro\.js') {
        $newContent = $content -replace 'config-supabase-seguro\.js', 'auth/supabase-config.js'
        Set-Content -Path $_.FullName -Value $newContent -NoNewline
        Write-Host "✅ Corregido: $($_.FullName)"
    }
}
```

## 📝 Nota

Ya corregí:
- ✅ `comunidades/gamers-videojuegos/index.html`
- ✅ `js/sistema-foro-comunidades.js` (mejorado para cargar mejor desde localStorage)

El resto de comunidades necesitan el mismo cambio.

