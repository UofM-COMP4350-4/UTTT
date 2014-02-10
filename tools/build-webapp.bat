@echo off

rem the folder this script is in
set TOOLS=%~DP0

rem git repository root
for %%d in ("%TOOLS%\..") do set ROOT=%%~fd

(echo.)

call "%ROOT%\client-web\tools\deploy.bat"

(echo.)
echo Complete!
(echo.)
pause
