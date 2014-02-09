#!/bin/bash

# functions

function pause(){
   read -n 1 -p "Press any key to continue..."
}

# mainline

# the folder this script is in
TOOLS="$(cd `dirname "$0"`; pwd)"

# git repository root
ROOT="`dirname "$TOOLS"`"

echo " "

"$ROOT/client-web/tools/deploy.sh"

echo " "
echo "Complete!"
echo " "
pause
