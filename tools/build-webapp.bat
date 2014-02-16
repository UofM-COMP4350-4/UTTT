@echo off

rem the folder this script is in
set TOOLS=%~DP0

rem git repository root
for %%d in ("%TOOLS%\..") do set ROOT=%%~fd

(echo.)

call "%ROOT%\client-web\tools\deploy.bat"

if exist "%ROOT%\server" (
	if exist "%ROOT%\server\public" rmdir "%ROOT%\server\public" /S /Q
	mkdir "%ROOT%\server\public"
	xcopy "%ROOT%\client-web\deploy\*" "%ROOT%\server\public\" /q /s /e /y > nul
	echo Copying deployable application to server public directory
)
(echo.)
echo Complete!
(echo.)
pause
