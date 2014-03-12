#!/bin/bash

# functions

pause(){
   read -n 1 -p "Press any key to continue..."
}

# mainline

# the folder this script is in
TOOLS="$(cd `dirname "$0"`; pwd)"

# git repository root
ROOT="`dirname "$TOOLS"`"

cd "$ROOT"
echo " "

echo "Pulling in latest changes for the repository and submodules..."
git pull
git submodule update --init

echo " "
echo "Complete!"
echo " "
pause
echo " "
