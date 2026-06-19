@echo off
set "PATH=C:\Program Files\Git\bin;C:\Program Files\nodejs;%PATH%"
echo ============================================
echo   Crystal of Atlan - Push Update ke Railway
echo ============================================
echo.

set /p msg="Tulis pesan update (contoh: tambah fitur baru): "
if "%msg%"=="" set msg=update

echo.
echo [1/3] Menambahkan semua perubahan...
git add .

echo [2/3] Commit perubahan...
git commit -m "%msg%"

echo [3/3] Push ke GitHub (Railway akan auto-update)...
git push origin main

echo.
echo ============================================
echo   SELESAI! Railway sedang redeploy (~2-3 menit)
echo   Cek: https://railway.com/project/7e9046e7-cea9-4769-ae6b-3a7d1864ce32
echo ============================================
echo.
pause
