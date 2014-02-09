@ECHO OFF

REM the folder this script is in (*/bootplate/tools)
SET TOOLS=%~DP0

REM application source location
for %%d in ("%TOOLS%\..") do SET SRC=%%~fd

REM enyo location
SET ENYO=%SRC%\enyo

REM deploy script location
SET DEPLOY=%ENYO%\tools\deploy.js

REM node location
SET NODE=node.exe

REM use node to invoke deploy.js with imported parameters
%NODE% "%DEPLOY%" -T -s "%SRC%" -o "%SRC%\deploy" %*
