import React, { useState } from 'react';
import FileHandler from './fileHandler.js';
import MonacoEditor from '@monaco-editor/react';
import { Terminal } from 'xterm';
import RileyPanel from './RileyPanel.jsx';
import CommandPalette from './CommandPalette.jsx';

function VSCodeLayout() {
  const [files, setFiles] = useState(FileHandler.listFiles());
  const [activeTab, setActiveTab] = useState(files[0] || '');
  const [code, setCode] = useState(activeTab ? FileHandler.loadFile(activeTab) : '');

  // Open file in editor
  function openFile(name) {
    setActiveTab(name);
    setCode(FileHandler.loadFile(name));
  }

  // Save file from editor
  function saveFile() {
    if (activeTab) {
      FileHandler.saveFile(activeTab, code);
      setFiles(FileHandler.listFiles());
    }
  }

  // Create new file
  function newFile() {
    let name = prompt('Enter new file name:');
    if (name && !files.includes(name)) {
      FileHandler.saveFile(name, '');
      setFiles(FileHandler.listFiles());
      setActiveTab(name);
      setCode('');
    }
  }

  // Delete file
  function deleteFile(name) {
    if (window.confirm(`Delete ${name}?`)) {
      FileHandler.deleteFile(name);
      const updated = FileHandler.listFiles();
      setFiles(updated);
      if (activeTab === name) {
        setActiveTab(updated[0] || '');
        setCode(updated[0] ? FileHandler.loadFile(updated[0]) : '');
      }
    }
  }

  React.useEffect(() => {
    // Terminal setup
    const term = new Terminal();
    term.open(document.getElementById('xterm-container'));
    term.write('Welcome to Zelgodiz Studio\r\n');
    return () => term.dispose();
  }, []);

  return (
    <>
      <CommandPalette />
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1e1e1e' }}>
      {/* Top bar */}
      <div style={{ height: 32, background: '#222', color: '#fff', display: 'flex', alignItems: 'center', paddingLeft: 12 }}>
        Zelgodiz Studio — VS Code Style
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ width: 220, background: '#23272e', color: '#fff', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 10, borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>Files</b>
            <button onClick={newFile} style={{ background: '#0ff', color: '#111', border: 'none', borderRadius: 3, padding: '2px 8px', cursor: 'pointer' }}>+</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {files.map(f => (
              <div key={f} style={{ padding: 8, cursor: 'pointer', background: activeTab === f ? '#333' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span onClick={() => openFile(f)}>{f}</span>
                <button onClick={() => deleteFile(f)} style={{ background: 'none', color: '#f55', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #333', padding: 10 }}>
            <RileyPanel />
          </div>
        </div>
        {/* Main area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Tabs */}
          <div style={{ height: 32, background: '#222', color: '#fff', display: 'flex', alignItems: 'center' }}>
            {files.map(f => (
              <div key={f} style={{ padding: '0 16px', cursor: 'pointer', borderBottom: activeTab === f ? '2px solid #0ff' : 'none' }} onClick={() => openFile(f)}>{f}</div>
            ))}
            {activeTab && <button onClick={saveFile} style={{ marginLeft: 'auto', background: '#0ff', color: '#111', border: 'none', borderRadius: 3, padding: '2px 12px', cursor: 'pointer' }}>Save</button>}
          </div>
          {/* Editor */}
          <div style={{ flex: 1, minHeight: 0 }}>
            {activeTab ? (
              <MonacoEditor
                width="100%"
                height="100%"
                language={activeTab.endsWith('.ts') ? 'typescript' : activeTab.endsWith('.js') ? 'javascript' : 'html'}
                theme="vs-dark"
                value={code}
                onChange={setCode}
                options={{ fontSize: 16, minimap: { enabled: false } }}
              />
            ) : (
              <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No file open</div>
            )}
          </div>
          {/* Terminal */}
          <div style={{ height: 180, background: '#181818', borderTop: '1px solid #333' }}>
            <div id="xterm-container" style={{ width: '100%', height: '100%' }} />
          </div>
          {/* Status bar */}
          <div style={{ height: 24, background: '#222', color: '#fff', display: 'flex', alignItems: 'center', paddingLeft: 12 }}>
            Status: Ready
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default VSCodeLayout;
