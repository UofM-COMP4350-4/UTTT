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

if [ -e "$ROOT/server" ] ; then
	rm -fr "$ROOT/server/public"
	mkdir -p "$ROOT/server/public"
	cp -fr "$ROOT/client-web/deploy/"* "$ROOT/server/public/"
	echo "Copying deployable application to server public directory"
fi

echo " "
echo "Complete!"
echo " "
pause
echo " "
