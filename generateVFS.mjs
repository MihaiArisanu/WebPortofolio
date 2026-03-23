import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-03-21',
});

async function generateVFS() {
    console.log('📡 Fetching VFS data from Sanity CMS...');

    const files = await client.fetch(`*[_type == "osFile"] | order(nodeId asc)`);

    let cppCode = `#include "vfs.h"\n\n`;
    cppCode += `VFS::VFS() {\n`;

    files.forEach(file => {
        let safeContent = "";

        if (file.content) {
            safeContent = file.content
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\n/g, '\\n');
        }

        const date = file.date || "2026-03-21";
        const size = file.size || "4.0 K";

        cppCode += `    addNode(${file.nodeId}, "${file.name}", "${file.type}", "${size}", "${date}", "${safeContent}", ${file.parentId});\n`;
    });

    cppCode += `}\n\n`;

    cppCode += `int VFS::addNode(int id, std::string name, std::string type, std::string size, std::string date, std::string content, int parent_id) {
    FileNode node;
    node.id = id;
    node.name = name;
    node.type = type;
    node.size = size;
    node.date = date;
    node.content = content;
    node.parent_id = parent_id;

    nodes.push_back(node);

    if (parent_id != -1) {
        for (auto& p : nodes) {
            if (p.id == parent_id && p.type == "dir") {
                p.children_ids.push_back(node.id);
                break;
            }
        }
    }
    return node.id;
}

const FileNode* VFS::getNode(int id) const {
    for (const auto& node : nodes) {
        if (node.id == id) return &node;
    }
    return nullptr;
}

std::vector<int> VFS::getDirectoryContents(int dir_id) const {
    const FileNode* dir = getNode(dir_id);
    if (dir && dir->type == "dir") {
        return dir->children_ids;
    }
    return {};
}\n`;

    const outputPath = path.resolve('./core/src/vfs.cpp');
    fs.writeFileSync(outputPath, cppCode);

    console.log(`✅ Succes! C++ a fost generat corect.`);
}

generateVFS().catch(console.error);