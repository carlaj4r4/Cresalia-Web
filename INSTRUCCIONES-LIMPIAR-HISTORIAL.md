# 🔒 INSTRUCCIONES PARA LIMPIAR HISTORIAL DE GIT

## ⚠️ IMPORTANTE: Esto es destructivo y requiere force push

### ✅ Pasos completados automáticamente:
1. ✅ Archivos con credenciales eliminados del historial
2. ✅ Reflog limpiado
3. ✅ Garbage collection ejecutado

### 🔄 Pasos que DEBES hacer manualmente:

#### 1. **Verificar que las credenciales fueron eliminadas:**
```bash
git log --all --source --all -p | grep -i "APP_USR\|CRESALIA2025"
```

Si no aparece nada, ¡perfecto! Si aparecen, necesitamos continuar.

#### 2. **Hacer force push a GitHub:**
```bash
git push origin --force --all
git push origin --force --tags
```

⚠️ **ADVERTENCIA**: Esto sobrescribe el historial en GitHub. Asegúrate de que:
- No hay otros colaboradores trabajando
- Tienes un backup local
- Estás seguro de que quieres hacer esto

#### 3. **Si hay otros colaboradores:**
Deben hacer:
```bash
git fetch origin
git reset --hard origin/main
```

#### 4. **Alternativa más segura (si hay colaboradores):**
En lugar de force push, puedes:
1. Crear un nuevo repositorio limpio
2. Copiar solo los archivos actuales
3. Hacer un commit inicial

---

## 🛡️ PREVENCIÓN FUTURA:

1. **NUNCA** subir archivos con credenciales
2. **SIEMPRE** usar variables de entorno
3. **VERIFICAR** .gitignore antes de commits
4. **REVISAR** cambios antes de push

---

## 📝 NOTA:

Las credenciales que estaban expuestas:
- ✅ Mercado Pago: Ya eliminaste la cuenta (correcto)
- ✅ Contraseña admin: Debes cambiarla en `config-privado.js`

---

**💜 Creado con preocupación por tu seguridad - Crisla & Claude**

