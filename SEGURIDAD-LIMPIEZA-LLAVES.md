# Guía de Limpieza y Rotación de Llaves Sensibles

Este checklist te ayuda a reaccionar rápido si sospechás que alguna credencial pudo filtrarse.

## 1. Github
- **Tokens personales**: entra en [Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens) y revocá todo lo que no reconozcas. Generá nuevos tokens solo cuando sea necesario, con el menor scope posible.
- **SSH / GPG**: en [Settings → SSH and GPG keys](https://github.com/settings/keys) elimina claves antiguas o que no identifiques.
- **Seguridad avanzada**:
  - Activá 2FA si no estaba habilitada.
  - En `Settings → Password and authentication` forzá 2FA para colaboradores.
  - Revisá periódicamente el [Security Log](https://github.com/settings/security-log).

## 2. Vercel y Supabase
- Rota las variables (`Environment Variables`) donde residan API Keys externas (Mercado Pago, Supabase `service_role`, Brevo, etc.).
- Utilizá valores distintos para entornos `Production`, `Preview` y `Development`.
- Documentá cada rotación (fecha, responsable, motivo) en este archivo.

## 3. Servicios externos
- **Brevo / Mercado Pago / Paypal / Mapbox**: Revocá las claves desde el panel oficial y crea nuevas.
- **Integraciones personalizadas**: identifica todos los `.env` locales o scripts automatizados donde estén guardadas claves y actualizalos.

## 4. Repositorio
- Ejecutá el script `node scripts/security/scan-exposed-keys.js` para detectar patrones sospechosos.
- Revisá commit history (`git log`) buscando si alguna credencial quedó en un punto antiguo. Si se filtró, considera eliminarla con `git filter-repo` o marcar el repo como comprometido y rotar.
- Evitá subir archivos `.env` o configuraciones reales. Usá archivos `*.ejemplo.js` o `*.sample`.

## 5. Comunicación Interna
- Registrá en este archivo los incidentes detectados (fecha, qué se expuso, cómo se mitigó).
- Si hay múltiples integrantes, informá y forzá cambio de contraseñas.

## 6. Automatizaciones
- Configurá recordatorios mensuales para revisar tokens.
- Activá alertas de login en GitHub y Vercel.
- Usa el `Panel de Seguridad (panel-seguridad-monitor.html)` para detectar cambios raros (force-push, deletes, nuevos colaboradores).

> Cuando tengas dudas, avisame. Mejor rotar una acces key de más que dejar una expuesta. 💜



