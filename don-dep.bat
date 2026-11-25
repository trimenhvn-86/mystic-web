@echo off
chcp 65001 >nul
echo === Don dep file thua tren GitHub (ban sao du an bi long trong thu muc public) ===
git rm -r -f --ignore-unmatch public/components public/content public/lib public/pages public/public public/scripts public/styles public/README.md public/SANITY_SETUP.md public/next.config.js public/package.json public/package-lock.json public/postcss.config.js public/tailwind.config.js tools/seed
if exist public\components rmdir /s /q public\components
if exist public\content rmdir /s /q public\content
if exist public\lib rmdir /s /q public\lib
if exist public\pages rmdir /s /q public\pages
if exist public\public rmdir /s /q public\public
if exist public\scripts rmdir /s /q public\scripts
if exist public\styles rmdir /s /q public\styles
if exist tools\seed rmdir /s /q tools\seed
echo.
echo Xong. Bay gio chay capnhat.bat de day len GitHub.
pause
