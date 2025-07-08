import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, Plus, Trash2 } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export const Sidebar: React.FC = () => {
  const { fileTree, openFile, createNewFile, deleteFile } = useEditorStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item) => (
      <div key={item.id} style={{ paddingLeft: `${level * 16}px` }}>
        <div className="file-item">
          {item.type === 'folder' ? (
            <>
              <button
                className="folder-toggle"
                onClick={() => toggleFolder(item.id)}
              >
                {expandedFolders.has(item.id) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                <Folder size={16} />
                <span>{item.name}</span>
              </button>
              <div className="file-actions">
                <button onClick={() => createNewFile(item.id)}>
                  <Plus size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                className="file-button"
                onClick={() => openFile(item)}
              >
                <File size={16} />
                <span>{item.name}</span>
              </button>
              <div className="file-actions">
                <button onClick={() => deleteFile(item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </>
          )}
        </div>
        {item.type === 'folder' && expandedFolders.has(item.id) && item.children && (
          <div className="folder-contents">
            {renderFileTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>EXPLORER</h3>
        <button onClick={() => createNewFile()}>
          <Plus size={16} />
        </button>
      </div>
      <div className="file-tree">
        {renderFileTree(fileTree)}
      </div>
    </div>
  );
};