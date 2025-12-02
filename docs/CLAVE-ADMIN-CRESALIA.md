# 🔑 Clave de Acceso - admin-cresalia.html

**Fecha:** 2025-01-27

---

## ✅ **Clave Configurada**

La contraseña para acceder a `admin-cresalia.html` es:

```
CRESALIA2025!
```

---

## 🔍 **Cómo Funciona**

El sistema busca la contraseña en este orden:

1. **`window.CONFIG_PRIVADO.adminCresalia`** (de `config-privado.js`) ✅
2. **`process.env.ADMIN_PASSWORD`** (variables de entorno - solo en Node.js)
3. Si no encuentra ninguna, **no permite acceso**

---

## 📝 **Archivo de Configuración**

La contraseña está configurada en:
- **Archivo:** `config-privado.js`
- **Variable:** `CONFIG_PRIVADO.adminCresalia`
- **Valor actual:** `'CRESALIA2025!'`

---

## 🔒 **Cambiar la Contraseña**

Si querés cambiar la contraseña:

1. Abrí `config-privado.js`
2. Cambiá el valor de `adminCresalia`:
   ```javascript
   adminCresalia: resolvePrivConfig('ADMIN_CRESALIA_PASSWORD', 'TU_NUEVA_CONTRASEÑA'),
   ```
3. Guardá el archivo

---

## ⚠️ **Importante**

- El archivo `config-privado.js` está en `.gitignore` (no se sube a GitHub)
- **NO compartas** esta contraseña públicamente
- Si la cambiás, recordá cuál es (o guardala en un lugar seguro)

---

## 🚀 **Cómo Acceder**

1. Abrí `admin-cresalia.html` en tu navegador
2. Ingresá la contraseña: `CRESALIA2025!`
3. Hacé clic en "Acceder al Panel"

---

**Última actualización:** 2025-01-27  
**Mantenido por:** Equipo Cresalia 💜


