@echo off
chcp 65001 >nul
echo ================================
echo   CAP NHAT TRIMENH.COM LEN GITHUB
echo ================================
echo.

cd /d "%~dp0"

echo [1/4] Kiem tra thay doi...
git status
echo.

echo [2/4] Them tat ca file thay doi...
git add -A
echo.

echo [3/4] Luu lai (commit)...
set /p COMMIT_MSG="Nhap mo ta ngan cho lan cap nhat nay (VD: sua domain www): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Cap nhat trimenh.com
git commit -m "%COMMIT_MSG%"
echo.

echo [4/4] Day len GitHub (Vercel se tu dong build lai)...
git push origin main
echo.

echo ================================
echo   XONG! Vao Vercel Dashboard doi
echo   1-2 phut de xem trang thai
echo   "Ready" (mau xanh) la xong.
echo ================================
echo.
pause
