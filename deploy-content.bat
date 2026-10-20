@echo off
:: ─────────────────────────────────────────────────────────────
:: deploy-content.bat
:: Commit perubahan data JSON dan push ke git → Vercel redeploy
:: ─────────────────────────────────────────────────────────────

echo.
echo  Saiynuddin CMS — Deploy Content to Vercel
echo  ==========================================
echo.

:: Stage hanya folder data
git add src/data/

:: Cek apakah ada yang berubah
git diff --cached --quiet
if %errorlevel% == 0 (
  echo  Tidak ada perubahan data. Tidak perlu deploy.
  echo.
  pause
  exit /b 0
)

:: Tampilkan file yang akan di-commit
echo  File yang akan di-deploy:
git diff --cached --name-only
echo.

:: Commit dengan timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set dt=%%I
set timestamp=%dt:~0,4%-%dt:~4,2%-%dt:~6,2% %dt:~8,2%:%dt:~10,2%

git commit -m "content: update data [%timestamp%]"

:: Push
echo.
echo  Mendeploy ke Vercel...
git push

echo.
echo  Selesai! Vercel akan rebuild dalam 1-2 menit.
echo  Cek: https://saiymuddin-usman.vercel.app
echo.
pause
