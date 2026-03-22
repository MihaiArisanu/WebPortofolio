#include "state.h"
#include "vfs.h"
#include <emscripten.h>
#include <iostream>

VFS vfs;
State sysState;

extern "C" {

EMSCRIPTEN_KEEPALIVE
const char *getEngineStatus() {
  return "Ma Os Kernel v1.0 (C++) is online and ready!";
}

EMSCRIPTEN_KEEPALIVE
void initOS() {
  sysState.setCurrentDirId(0, vfs.getDirectoryContents(0));
  std::cout << "[Ma Os Boot] Sistemul a pornit in root." << std::endl;
}

EMSCRIPTEN_KEEPALIVE
int getCurrentDirId() { return sysState.getCurrentDirId(); }

EMSCRIPTEN_KEEPALIVE
int getSelectedIndex() { return sysState.getSelectedIndex(); }

EMSCRIPTEN_KEEPALIVE
int getCurrentDirFileCount() { return sysState.getCurrentContents().size(); }

EMSCRIPTEN_KEEPALIVE
int getFileIdAtIndex(int index) {
  const auto &contents = sysState.getCurrentContents();
  if (index >= 0 && index < contents.size())
    return contents[index];
  return -1;
}

EMSCRIPTEN_KEEPALIVE const char *getNodeName(int id) {
  const FileNode *node = vfs.getNode(id);
  return node ? node->name.c_str() : "";
}

EMSCRIPTEN_KEEPALIVE const char *getNodeType(int id) {
  const FileNode *node = vfs.getNode(id);
  return node ? node->type.c_str() : "";
}

EMSCRIPTEN_KEEPALIVE const char *getNodeSize(int id) {
  const FileNode *node = vfs.getNode(id);
  return node ? node->size.c_str() : "";
}

EMSCRIPTEN_KEEPALIVE const char *getNodeDate(int id) {
  const FileNode *node = vfs.getNode(id);
  return node ? node->date.c_str() : "";
}

EMSCRIPTEN_KEEPALIVE const char *getNodeContent(int id) {
  const FileNode *node = vfs.getNode(id);
  return node ? node->content.c_str() : "";
}

EMSCRIPTEN_KEEPALIVE void moveUp() { sysState.moveSelectionUp(); }
EMSCRIPTEN_KEEPALIVE void moveDown() { sysState.moveSelectionDown(); }

EMSCRIPTEN_KEEPALIVE void enterCurrentSelection() {
  int selected_id = sysState.getSelectedNodeId();
  const FileNode *node = vfs.getNode(selected_id);

  if (node && node->type == "dir") {
    sysState.setCurrentDirId(selected_id,
                             vfs.getDirectoryContents(selected_id));
  }
}

EMSCRIPTEN_KEEPALIVE void goBack() {
  int current_id = sysState.getCurrentDirId();
  const FileNode *current_dir = vfs.getNode(current_id);

  if (current_dir && current_dir->parent_id != -1) {
    sysState.setCurrentDirId(current_dir->parent_id,
                             vfs.getDirectoryContents(current_dir->parent_id));
  }
}
}

int main() {
  initOS();
  return 0;
}