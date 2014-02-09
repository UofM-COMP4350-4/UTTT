@echo off

rem the folder this script is in
set TOOLS=%~DP0

rem git repository root
for %%d in ("%TOOLS%\..") do set ROOT=%%~fd

cd "%ROOT%"
(echo.)

echo Pulling in latest changes for the repository and submodules...
git pull
git submodule update --init

(echo.)
echo Complete!
(echo.)
pause
