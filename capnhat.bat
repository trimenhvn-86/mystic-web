@echo off
cd /d "%~dp0"
echo ========================================
echo   Kiem tra cau truc truoc khi cap nhat
echo ========================================
echo.

set LOI=0
for %%F in (pages lib components content public styles scripts) do (
  if exist "pages\%%F" (
    echo [CANH BAO] Phat hien "pages\%%F" bi long sai - can xoa truoc khi tiep tuc!
    set LOI=1
  )
)

if %LOI%==1 (
  echo.
  echo ========================================
  echo   DA DUNG LAI - vui long xoa cac folder
  echo   bi canh bao o tren roi chay lai file nay.
  echo ========================================
  pause
  exit /b
)

echo Cau truc OK, dang cap nhat...
git add .
git commit -m "Cap nhat website %date% %time%"
git push origin main --force

echo.
echo ========================================
echo   XONG! Neu khong thay dong loi mau do
echo   o tren, code da len GitHub thanh cong.
echo ========================================
pause