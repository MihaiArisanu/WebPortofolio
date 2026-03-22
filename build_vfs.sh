#!/bin/bash

PROJECT_DIR=~/Work/ma-os-portfolio
CORE_DIR=$PROJECT_DIR/core
EMSDK_ENV=$PROJECT_DIR/emsdk/emsdk_env.sh

echo "Generare VFS..."
cd "$PROJECT_DIR" || exit
node generateVFS.mjs

echo "Încărcare mediul Emscripten..."
cd "$CORE_DIR" || exit
source "$EMSDK_ENV"

echo "Compilare proiect..."
make

echo "Build finalizat!"

echo "Sincronizare cu GitHub..."
cd "$PROJECT_DIR" || exit

if [[ -n $(git status -s) ]]; then
    echo "S-au detectat modificări. Se face commit..."
    git add .
    
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
    git commit -m "Auto-build & Sanity update: $TIMESTAMP"
    
    echo "Se trimit datele pe GitHub..."
    git push origin main
    echo "Push finalizat cu succes!"
else
    echo "Nu există modificări noi de salvat pe Git."
fi
