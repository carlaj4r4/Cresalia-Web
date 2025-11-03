@echo off
echo ====================================
echo   CAMBIAR NOMBRE DEL REPOSITORIO
echo ====================================
echo.
echo IMPORTANTE: Primero renombra el repositorio en GitHub
echo 1. Anda a: https://github.com/carlaj4r4/friocas-web/settings
echo 2. Cambia el nombre a: Cresalia-Web
echo 3. Luego ejecuta este script de nuevo
echo.
pause

cd /d "C:\Users\carla\Cresalia-Web"

echo.
echo Actualizando remoto a: Cresalia-Web...
git remote set-url origin https://github.com/carlaj4r4/Cresalia-Web.git

echo.
echo Verificando...
git remote -v

echo.
echo ====================================
echo    REMOTO ACTUALIZADO
echo ====================================
echo Ahora podes usar: git push
pause

