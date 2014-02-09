#!/bin/bash

# the folder this script is in (*/bootplate/tools)
TOOLS="$(cd `dirname "$0"`; pwd)"

# application root
SRC="`dirname "$TOOLS"`"

# enyo location
ENYO="$SRC/enyo"

# deploy script location
DEPLOY="$ENYO/tools/deploy.js"

# check for node, but quietly
if command -v node >/dev/null 2>&1; then
	# use node to invoke deploy with imported parameters
	node "$DEPLOY" -T -s "$SRC" -o "$SRC/deploy" $@
else
	echo "No node found in path"
	exit 1
fi
