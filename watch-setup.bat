@echo off
REM Run this ONCE. It tells Windows to check this folder every 3 minutes and
REM push anything new to GitHub, so changes reach Shopify on their own.
schtasks /create /tn "RYVT theme auto-push" /tr "\"%~dp0auto-push.bat\"" /sc minute /mo 3 /f
echo.
if errorlevel 1 (
  echo   Could not create the task. Try running this file as administrator:
  echo   right-click it and choose "Run as administrator".
) else (
  echo   Done. Changes now reach GitHub by themselves, every 3 minutes.
  echo.
  echo   To stop it later:  schtasks /delete /tn "RYVT theme auto-push" /f
)
echo.
pause
