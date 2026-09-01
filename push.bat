@echo off
REM Sends whatever changed in this folder to GitHub.
REM Shopify picks it up from there on its own.
cd /d "%~dp0"
echo.
echo   Pushing RYVT theme changes...
echo.
git add -A
git commit -m "Theme update" 2>nul
if errorlevel 1 echo   (nothing new to commit)
git push
echo.
if errorlevel 1 (
  echo   Push failed - see the message above.
) else (
  echo   Done. Shopify will sync the connected theme within a minute.
)
echo.
pause
