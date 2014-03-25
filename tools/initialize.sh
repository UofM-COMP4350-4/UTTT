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

echo "Pulling current repository state and submodules..."
git pull
git submodule update --init

echo " "

echo "Installing server node package dependencies..."
npm install "$ROOT/server" --prefix "$ROOT/server/node_modules"

echo " "
echo "Complete!"
echo " "
pause
echo " "
