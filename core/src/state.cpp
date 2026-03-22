#include "state.h"

State::State() {
  current_dir_id = 0;
  selected_index = 0;
  current_contents.clear();
}

int State::getCurrentDirId() const { return current_dir_id; }

void State::setCurrentDirId(int id, const std::vector<int> &new_contents) {
  current_dir_id = id;
  current_contents = new_contents;
  resetSelection();
}

const std::vector<int> &State::getCurrentContents() const {
  return current_contents;
}

int State::getSelectedIndex() const { return selected_index; }

int State::getSelectedNodeId() const {
  if (current_contents.empty() || selected_index < 0 ||
      selected_index >= current_contents.size()) {
    return -1;
  }
  return current_contents[selected_index];
}

void State::moveSelectionUp() {
  if (selected_index > 0) {
    selected_index--;
  }
}

void State::moveSelectionDown() {
  if (current_contents.empty())
    return;

  if (selected_index < current_contents.size() - 1) {
    selected_index++;
  }
}

void State::resetSelection() { selected_index = 0; }