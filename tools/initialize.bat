@echo off

rem the folder this script is in
set TOOLS=%~DP0

rem git repository root
for %%d in ("%TOOLS%\..") do set ROOT=%%~fd

cd "%ROOT%"
(echo.)

echo Pulling current repository state and submodules...
git pull
git submodule update --init

(echo.)

echo Installing server node package dependencies...
call npm install "%ROOT%\server" --prefix "%ROOT%\server\node_modules"

(echo.)
echo Complete!
(echo.)
pause
