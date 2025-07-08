import React from 'react';
import { X, Plus } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export const TopBar: React.FC = () => {
  const { openFiles, activeFile, switchToFile, closeFile, createNewFile } = useEditorStore();

  return (
    <div className="top-bar">
      <div className="tabs-container">
        {openFiles.map((file) => (
          <div
            key={file.id}
            className={`tab ${activeFile?.id === file.id ? 'active' : ''}`}
            onClick={() => switchToFile(file.id)}
          >
            <span className="tab-name">{file.name}</span>
            <button
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.id);
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button className="new-tab-btn" onClick={createNewFile}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};