CXX = emcc

CXXFLAGS = -std=c++17 -O3 -Iinclude

LDFLAGS = -s WASM=1 \
          -s MODULARIZE=1 \
          -s EXPORT_NAME="createMaOsEngine" \
          -s ALLOW_MEMORY_GROWTH=1 \
          -s NO_EXIT_RUNTIME=1 \
          -s EXPORTED_RUNTIME_METHODS=ccall,cwrap

SRCS = src/vfs.cpp src/state.cpp src/animations.cpp main.cpp

OUT = ../public/core.js

all: build

build:
	$(CXX) $(CXXFLAGS) $(SRCS) -o $(OUT) $(LDFLAGS)
	@echo "✅ Compilare cu succes! core.js si core.wasm generate in /public"

clean:
	rm -f ../public/core.js ../public/core.wasm