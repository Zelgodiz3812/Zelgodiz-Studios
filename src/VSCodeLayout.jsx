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
  const [showPalette, setShowPalette] = useState(false);
  const [showRiley, setShowRiley] = useState(true); // Assuming Riley is visible by default
  const [showTerminal, setShowTerminal] = useState(true); // Assuming terminal is visible by default

  // Command Palette Handler
  function handleCommand(commandAction) {
    console.log('Command executed:', commandAction);
    switch (commandAction) {
      case 'newFile':
        newFile();
        break;
      case 'saveFile':
        saveFile();
        break;
      case 'deleteFile':
        // For delete, we need a way to specify which file.
        // This might require enhancing the command palette or context.
        // For now, let's prompt or delete active.
        if (activeTab) deleteFile(activeTab);
        else alert('No active file to delete.');
        break;
      case 'search':
        alert('Search in Files: Not yet implemented.');
        break;
      case 'settings':
        alert('Open Settings: Not yet implemented.');
        break;
      case 'toggleTerminal':
        setShowTerminal(prev => !prev);
        break;
      case 'showRiley':
        setShowRiley(prev => !prev);
        break;
      case 'about':
        alert('Zelgodiz Studio: Offline AI IDE by Zelgodiz Industries.');
        break;
      default:
        console.warn('Unknown command:', commandAction);
    }
    setShowPalette(false); // Close palette after command
  }

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
    // Command Palette Shortcut
    const handleGlobalKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        setShowPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);

    // Terminal Setup Effect
    React.useEffect(() => {
      let term;
      if (showTerminal) {
        const container = document.getElementById('xterm-container');
        if (container) {
          term = new Terminal();
          term.open(container);
          term.write('Welcome to Zelgodiz Studio\r\n');
        }
      }
      return () => {
        if (term) {
          term.dispose();
        }
      };
    }, [showTerminal]); // Re-run when showTerminal changes

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []); // Main effect for global keydown, runs once

  return (
    <>
      <CommandPalette show={showPalette} onCommand={handleCommand} onClose={() => setShowPalette(false)} />
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1e1e1e' }}>
      {/* Top bar */}
      <div style={{ height: 32, background: '#222', color: '#fff', display: 'flex', alignItems: 'center', paddingLeft: 12, justifyContent: 'space-between' }}>
        <span>Zelgodiz Studio — VS Code Style</span>
        <button
          onClick={() => setShowPalette(true)}
          style={{ background: '#0af', color: '#fff', border: 'none', borderRadius: 3, padding: '2px 12px', cursor: 'pointer', marginRight: '10px' }}
        >
          Commands (Ctrl+Shift+P)
        </button>
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
          {showRiley && (
            <div style={{ borderTop: '1px solid #333', padding: 10, minHeight: '200px' /* Ensure Riley panel has some space */ }}>
              <RileyPanel />
            </div>
          )}
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
          {showTerminal && (
            <div style={{ height: 180, background: '#181818', borderTop: '1px solid #333' }}>
              <div id="xterm-container" style={{ width: '100%', height: '100%' }} />
            </div>
          )}
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
