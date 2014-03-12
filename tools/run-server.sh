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

if [ "$1" != "" ] ; then
	PORT = $1
fi

if [ "$2" != "" ] ; then
	IP = $2
fi

node "$ROOT/server/server.js"

echo " "
echo "Complete!"
echo " "
pause
echo " "
