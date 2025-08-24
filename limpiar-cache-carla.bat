@echo off
echo ========================================
echo    LIMPIADOR DE CACHE - CARLA
echo ========================================
echo.
echo Abriendo limpiador de cache...
echo.
echo 1. Haz clic en "Limpiar Cache"
echo 2. Espera a que se complete
echo 3. Ve a "Ir a Carla"
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

start "" "limpiar-cache.html"

echo.
echo Limpiador abierto en el navegador.
echo.
echo Si los errores persisten:
echo 1. Presiona Ctrl + Shift + R para recarga forzada
echo 2. O presiona F12 y en la pestaña Network marca "Disable cache"
echo.
pause

