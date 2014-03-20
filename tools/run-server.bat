@echo off

rem the folder this script is in
set TOOLS=%~DP0

rem git repository root
for %%d in ("%TOOLS%\..") do set ROOT=%%~fd

cd "%ROOT%"
(echo.)

if not "%1" == "" (
	SET PORT=%1
)

if not "%2" == "" (
	SET IP=%2
)

if not exist "%ROOT%\server\gamedata" mkdir "%ROOT%\server\gamedata"

node "%ROOT%\server\server.js"

(echo.)
echo Complete!
(echo.)
pause
