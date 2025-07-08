import React from 'react';
import { X, Settings } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    closeSettings,
    editorSettings,
    updateEditorSettings,
    theme,
    setTheme,
  } = useEditorStore();

  if (!isSettingsOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeSettings}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Settings size={20} />
            Settings
          </h2>
          <button onClick={closeSettings}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="settings-section">
            <h3>Editor</h3>
            <div className="setting-item">
              <label>Font Size</label>
              <input
                type="number"
                min="8"
                max="32"
                value={editorSettings.fontSize}
                onChange={(e) =>
                  updateEditorSettings({ fontSize: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="setting-item">
              <label>Font Family</label>
              <select
                value={editorSettings.fontFamily}
                onChange={(e) =>
                  updateEditorSettings({ fontFamily: e.target.value })
                }
              >
                <option value="'Consolas', monospace">Consolas</option>
                <option value="'Monaco', monospace">Monaco</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
              </select>
            </div>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={editorSettings.minimapEnabled}
                  onChange={(e) =>
                    updateEditorSettings({ minimapEnabled: e.target.checked })
                  }
                />
                Enable Minimap
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={editorSettings.wordWrap}
                  onChange={(e) =>
                    updateEditorSettings({ wordWrap: e.target.checked })
                  }
                />
                Word Wrap
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Theme</h3>
            <div className="theme-selector">
              <button
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                Dark
              </button>
              <button
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                Light
              </button>
              <button
                className={`theme-btn ${theme === 'neon' ? 'active' : ''}`}
                onClick={() => setTheme('neon')}
              >
                Neon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};