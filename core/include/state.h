#ifndef STATE_H
#define STATE_H

#include <vector>

class State {
private:
  int current_dir_id;
  int selected_index;
  std::vector<int> current_contents;

public:
  State();

  int getCurrentDirId() const;
  void setCurrentDirId(int id, const std::vector<int> &new_contents);

  const std::vector<int> &getCurrentContents() const;
  int getSelectedIndex() const;
  int getSelectedNodeId() const;
  void moveSelectionUp();
  void moveSelectionDown();

  void resetSelection();
};

#endif