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
