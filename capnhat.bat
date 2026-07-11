@echo off
cd /d "%~dp0"
echo ========================================
echo   Dang cap nhat code TriMenh len GitHub
echo ========================================
echo.

git add .
git commit -m "Cap nhat website %date% %time%"
git push origin main --force

echo.
echo ========================================
echo   XONG! Neu khong thay dong loi mau do
echo   o tren, code da len GitHub thanh cong.
echo ========================================
pause