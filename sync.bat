@echo off
echo ===================================
echo   Syncing changes to GitHub...
echo ===================================
cd /d "%~dp0"
git add .
set msg=%*
if "%msg%"=="" set msg=update: auto sync changes
git commit -m "%msg%"
git push origin main
echo ===================================
echo   Done! GitHub updated.
echo ===================================
