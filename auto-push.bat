@echo off
REM RYVT — sends any change in this folder to GitHub, then exits quietly.
REM Meant to be run on a schedule so pushing is automatic.
cd /d "%~dp0"
git diff --quiet && git diff --cached --quiet
if %errorlevel%==0 goto :nothing
git add -A
git commit -m "Theme update %date% %time%"
git push
exit /b 0
:nothing
exit /b 0
