#ifndef VFS_H
#define VFS_H

#include <string>
#include <vector>

struct FileNode {
  int id;
  std::string name;
  std::string type;
  std::string size;
  std::string date;
  std::string content;
  int parent_id;
  std::vector<int> children_ids;
};

class VFS {
private:
  std::vector<FileNode> nodes;
  int next_id;

public:
  VFS();

  int addNode(int id, std::string name, std::string type, std::string size,
              std::string date, std::string content, int parent_id);

  const FileNode *getNode(int id) const;
  const FileNode *getNodeByName(int parent_id, const std::string &name) const;

  std::vector<int> getDirectoryContents(int dir_id) const;
};

#endif