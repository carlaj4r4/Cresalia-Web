# 🚀 DEPLOY RÁPIDO - CRESALIA

## ⚡ **COMANDOS RÁPIDOS**

```bash
# 1. Verificar que todo esté listo
node scripts/verificar-pre-deploy.js

# 2. Agregar todos los cambios
git add .

# 3. Hacer commit
git commit -m "✨ Deploy: Sistema completo de distancias, aniversarios, foros y feedbacks"

# 4. Subir a GitHub (esto activará deploy automático en Vercel)
git push origin main
```

---

## ✅ **CHECKLIST RÁPIDO**

- [ ] Ejecuté `node scripts/verificar-pre-deploy.js` y no hay errores
- [ ] Verifiqué que `config-supabase-seguro.js` no tenga credenciales hardcodeadas
- [ ] Las variables de entorno están configuradas en Vercel
- [ ] Hice commit de todos los cambios
- [ ] Hice push a GitHub

---

## 🔧 **CONFIGURACIÓN EN VERCEL**

### **Variables de Entorno (Settings → Environment Variables):**

```
SUPABASE_URL=https://zbomxayytvwjbdzbegcw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Marca todas como "Production", "Preview" y "Development"**

---

## 📱 **VERIFICAR DESPUÉS DEL DEPLOY**

1. Abre tu URL de Vercel
2. Verifica que la página principal carga
3. Prueba una comunidad
4. Verifica que los aniversarios se muestran
5. Prueba el sistema de distancias

---

## 🆘 **SI ALGO FALLA**

1. Ve a Vercel Dashboard → Deployments
2. Haz clic en el último deploy
3. Revisa los "Build Logs"
4. Busca errores en rojo
5. Corrige y vuelve a hacer push

---

## 🎉 **¡LISTO!**

Una vez que veas "Ready" en Vercel, tu sitio está en producción! 🚀








