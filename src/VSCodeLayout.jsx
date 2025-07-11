import React, { useState, useEffect, useCallback } from 'react';
// const FileHandler = require('./fileHandler.js'); // Old localStorage handler
const FileHandlerNodeFS = require('./FileHandlerNodeFS.js'); // New Node.js fs handler
import MonacoEditor from '@monaco-editor/react';
import { Terminal } from 'xterm';
import RileyPanel from './RileyPanel.jsx';
import CommandPalette from './CommandPalette.jsx'; // Assuming CommandPalette is ready

// Helper to get file extension for Monaco language
const getLanguageFromPath = (filePath) => {
  if (!filePath) return 'plaintext';
  const extension = filePath.split('.').pop().toLowerCase();
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'json':
      return 'json';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'md':
      return 'markdown';
    case 'py':
      return 'python';
    case 'java':
      return 'java';
    case 'c':
    case 'h':
      return 'c';
    case 'cpp':
    case 'hpp':
      return 'cpp';
    default:
      return 'plaintext';
  }
};


function VSCodeLayout() {
  const [currentDirectory, setCurrentDirectory] = useState(FileHandlerNodeFS.resolvePath(process.cwd())); // Start in current working directory
  const [directoryFiles, setDirectoryFiles] = useState([]);
  const [openTabs, setOpenTabs] = useState([]); // Stores { path: string, name: string, content: string, originalContent: string }
  const [activeTabPath, setActiveTabPath] = useState(null);
  const [isCommandPaletteVisible, setIsCommandPaletteVisible] = useState(false);


  const refreshDirectoryFiles = useCallback(() => {
    const files = FileHandlerNodeFS.listFiles(currentDirectory);
    setDirectoryFiles(files);
  }, [currentDirectory]);

  useEffect(() => {
    refreshDirectoryFiles();
  }, [refreshDirectoryFiles]);

  // Open file or navigate directory
  function handleItemClick(itemPath, isDirectory) {
    if (isDirectory) {
      setCurrentDirectory(itemPath);
    } else {
      // Check if already open
      const existingTab = openTabs.find(tab => tab.path === itemPath);
      if (existingTab) {
        setActiveTabPath(itemPath);
      } else {
        const content = FileHandlerNodeFS.loadFile(itemPath) || '';
        const newTab = {
          path: itemPath,
          name: FileHandlerNodeFS.basename(itemPath),
          content: content,
          originalContent: content // To track changes for saving
        };
        setOpenTabs(prevTabs => [...prevTabs, newTab]);
        setActiveTabPath(itemPath);
      }
    }
  }

  // Update content of the active tab
  function handleEditorChange(newContent) {
    setOpenTabs(tabs =>
      tabs.map(tab =>
        tab.path === activeTabPath ? { ...tab, content: newContent } : tab
      )
    );
  }

  const activeTabData = openTabs.find(tab => tab.path === activeTabPath);

  // Save active file
  function saveActiveFile() {
    if (activeTabData) {
      FileHandlerNodeFS.saveFile(activeTabData.path, activeTabData.content);
      // Update originalContent after saving
      setOpenTabs(tabs =>
        tabs.map(tab =>
          tab.path === activeTabPath ? { ...tab, originalContent: tab.content } : tab
        )
      );
      refreshDirectoryFiles(); // Refresh sidebar in case file was new
    }
  }

  // Close tab
  function closeTab(tabPathToClose, e) {
    if (e) e.stopPropagation(); // Prevent click from bubbling to tab selection

    const tabToClose = openTabs.find(tab => tab.path === tabPathToClose);
    if (tabToClose && tabToClose.content !== tabToClose.originalContent) {
      if (!window.confirm(`File ${tabToClose.name} has unsaved changes. Close anyway?`)) {
        return;
      }
    }

    setOpenTabs(tabs => tabs.filter(tab => tab.path !== tabPathToClose));
    if (activeTabPath === tabPathToClose) {
      const remainingTabs = openTabs.filter(tab => tab.path !== tabPathToClose);
      setActiveTabPath(remainingTabs.length > 0 ? remainingTabs[0].path : null);
    }
  }


  // Create new file
  function handleNewFile() {
    let name = prompt('Enter new file name (e.g., newFile.txt):');
    if (name) {
      const newFilePath = FileHandlerNodeFS.resolvePath(currentDirectory, name);
      if (FileHandlerNodeFS.saveFile(newFilePath, '')) { // Save empty file
        refreshDirectoryFiles();
        handleItemClick(newFilePath, false); // Open the new file
      } else {
        alert(`Failed to create file: ${newFilePath}`);
      }
    }
  }

  function handleNewFolder() {
    let name = prompt('Enter new folder name:');
    if (name) {
      const newFolderPath = FileHandlerNodeFS.resolvePath(currentDirectory, name);
      if (FileHandlerNodeFS.createDirectory(newFolderPath)) {
        refreshDirectoryFiles();
      } else {
        alert(`Failed to create folder: ${newFolderPath}`);
      }
    }
  }

  // Delete file or folder
  function handleDeleteItem(itemPath, itemName, isDirectory) {
    if (window.confirm(`Are you sure you want to delete ${itemName}? This cannot be undone.`)) {
      // Close tab if it's open
      const existingTab = openTabs.find(tab => tab.path === itemPath);
      if (existingTab) {
        // Simulate a close event without confirmation if it's the item being deleted
        setOpenTabs(tabs => tabs.filter(tab => tab.path !== itemPath));
        if (activeTabPath === itemPath) {
          const remainingTabs = openTabs.filter(tab => tab.path !== itemPath);
          setActiveTabPath(remainingTabs.length > 0 ? remainingTabs[0].path : null);
        }
      }

      if (FileHandlerNodeFS.deleteFile(itemPath)) { // deleteFile should handle both files and dirs (if empty or made recursive)
        refreshDirectoryFiles();
      } else {
        alert(`Failed to delete ${itemName}. Ensure directory is empty if it's a folder.`);
      }
    }
  }

  // Go to parent directory
  function goUpDirectory() {
    const parentDir = FileHandlerNodeFS.dirname(currentDirectory);
    if (parentDir !== currentDirectory) { // Avoid getting stuck at root
        setCurrentDirectory(parentDir);
    }
  }

  useEffect(() => {
    // Terminal setup
    const termContainer = document.getElementById('xterm-container');
    if (!termContainer) return;

    const term = new Terminal({ convertEol: true, theme: { background: '#181818' } });
    term.open(termContainer);
    term.write('Welcome to Zelgodiz Studio (NodeFS Mode)\r\n');
    // Example: You could try to pipe Node's process.stdout to terminal, but that's complex.
    // For now, it's a simple output terminal.

    // Simple command handling example (not a full shell)
    let currentLine = '';
    term.onData(e => {
        if (e === '\r') { // Enter
            term.write('\r\n');
            if (currentLine.trim() === 'ls') {
                directoryFiles.forEach(f => term.write(`${f.name}${f.isDirectory ? '/' : ''}\r\n`));
            } else if (currentLine.trim() === 'clear') {
                term.clear();
            } else if (currentLine.trim()) {
                term.write(`Unknown command: ${currentLine}\r\n`);
            }
            currentLine = '';
        } else if (e === '\u007F') { // Backspace
            if (currentLine.length > 0) {
                term.write('\b \b');
                currentLine = currentLine.slice(0, -1);
            }
        } else {
            term.write(e);
            currentLine += e;
        }
    });


    return () => term.dispose();
  }, [directoryFiles]); // Re-run if directoryFiles changes, for 'ls' command example

  // Command Palette handler
  const handleCommandPaletteAction = (action) => {
    setIsCommandPaletteVisible(false); // Close palette after action
    switch (action) {
      case 'newFile':
        handleNewFile();
        break;
      case 'saveFile':
        saveActiveFile();
        break;
      case 'deleteFile':
        if (activeTabData) {
          // To make this work, handleDeleteItem needs to be callable without an event
          // or we need a slightly different approach for command palette deletion.
          // For now, let's assume we want to delete the active file.
          // handleDeleteItem(activeTabData.path, activeTabData.name, false);
          // This requires `activeTabData` to be available and the item to be a file.
          // A more generic delete command would need to prompt the user or use a selection.
          alert("Delete File command needs refinement. For now, use the 'x' button in the file explorer or tab.");
          console.log('CommandPalette action: deleteFile (for active file)', activeTabData ? activeTabData.path : 'No active file');
        } else {
          alert("No active file to delete.");
        }
        break;
      case 'toggleTerminal':
        // This would require managing terminal visibility state
        alert("Toggle Terminal command not yet implemented.");
        console.log('CommandPalette action: toggleTerminal');
        break;
      case 'showRiley':
        // This would require managing Riley panel visibility or focus
        alert("Show Riley Agent command not yet implemented.");
        console.log('CommandPalette action: showRiley');
        break;
      case 'settings':
        alert("Settings command not yet implemented.");
        console.log('CommandPalette action: settings');
        break;
      case 'about':
        alert("Zelgodiz Studio - Alpha. Built with Electron, React, Monaco, Xterm, and Transformers.js.");
        console.log('CommandPalette action: about');
        break;
      default:
        console.log('CommandPalette action:', action);
    }
  };

  // Keyboard shortcut for Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        setIsCommandPaletteVisible(prev => !prev);
      }
      if (event.key === 'Escape' && isCommandPaletteVisible) {
        setIsCommandPaletteVisible(false);
      }
      // Save shortcut (Ctrl+S or Cmd+S)
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveActiveFile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabData, isCommandPaletteVisible]); // Include activeTabData to ensure saveActiveFile has latest closure

  return (
    <>
      <CommandPalette
        show={isCommandPaletteVisible}
        onClose={() => setIsCommandPaletteVisible(false)}
        onCommand={handleCommandPaletteAction}
      />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1e1e1e', color: '#ccc' }}>
        {/* Top bar - Can be enhanced with menus */}
        <div style={{ height: 32, background: '#3c3c3c', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 12px', borderBottom: '1px solid #000' }}>
          Zelgodiz Studio (NodeFS)
          <button onClick={() => setIsCommandPaletteVisible(true)} style={{ marginLeft: 'auto', background: '#555', color: '#fff', border: 'none', padding: '4px 8px'}}>Commands...</button>
        </div>

        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {/* Sidebar */}
          <div style={{ width: 250, background: '#252526', color: '#ccc', display: 'flex', flexDirection: 'column', borderRight: '1px solid #000' }}>
            <div style={{ padding: 10, borderBottom: '1px solid #3c3c3c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <b>Files</b>
              <div>
                <button onClick={handleNewFile} title="New File" style={buttonStyle}>NF</button>
                <button onClick={handleNewFolder} title="New Folder" style={buttonStyle}>ND</button>
              </div>
            </div>
            <div style={{ padding: '5px 10px', borderBottom: '1px solid #3c3c3c' }}>
              <button onClick={goUpDirectory} style={{...buttonStyle, width: '100%', textAlign: 'left' }} disabled={FileHandlerNodeFS.dirname(currentDirectory) === currentDirectory}>
                ⬆️ ..
              </button>
              <div style={{ fontSize: '0.8em', color: '#888', wordBreak: 'break-all' }}>{currentDirectory}</div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', paddingTop: 5 }}>
              {directoryFiles.sort((a,b) => { // Sort: folders first, then by name
                  if (a.isDirectory && !b.isDirectory) return -1;
                  if (!a.isDirectory && b.isDirectory) return 1;
                  return a.name.localeCompare(b.name);
                }).map(item => (
                <div key={item.path}
                     style={{ padding: '4px 10px', cursor: 'pointer', background: activeTabPath === item.path ? '#094771' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                     onClick={() => handleItemClick(item.path, item.isDirectory)}
                     title={item.path}
                >
                  <span>{item.isDirectory ? '📁' : '📄'} {item.name}</span>
                  {!item.isDirectory && // Show delete only for files for now, or implement recursive delete for folders
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.path, item.name, item.isDirectory); }} style={{ background: 'none', color: '#c75151', border: 'none', cursor: 'pointer', fontWeight: 'bold', padding: '0 5px' }}>×</button>
                  }
                   {item.isDirectory &&
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.path, item.name, item.isDirectory); }} style={{ background: 'none', color: '#c75151', border: 'none', cursor: 'pointer', fontWeight: 'bold', padding: '0 5px' }}>🗑️</button>
                  }
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #3c3c3c', minHeight: 200, display:'flex', flexDirection:'column' }}> {/* Riley Panel Area */}
              <RileyPanel />
            </div>
          </div>

          {/* Main area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Tabs */}
            <div style={{ height: 35, background: '#2d2d2d', color: '#ccc', display: 'flex', alignItems: 'center', flexShrink: 0, overflowX: 'auto', borderBottom: '1px solid #000' }}>
              {openTabs.map(tab => (
                <div key={tab.path}
                     style={{ padding: '0 10px', height: '100%', lineHeight: '35px', cursor: 'pointer', borderRight: '1px solid #252526', background: activeTabPath === tab.path ? '#1e1e1e' : '#2d2d2d', borderBottom: activeTabPath === tab.path ? '2px solid #007acc' : 'none', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
                     onClick={() => setActiveTabPath(tab.path)}
                     title={tab.path}
                >
                  {tab.name}
                  {tab.content !== tab.originalContent && <span style={{color: '#007acc', marginLeft: 4}}>*</span>}
                  <button onClick={(e) => closeTab(tab.path, e)} style={{ background: 'none', color: '#ccc', border: 'none', cursor: 'pointer', marginLeft: 8, fontWeight: 'bold', fontSize: 14 }}>×</button>
                </div>
              ))}
              {openTabs.length > 0 && activeTabData && <button onClick={saveActiveFile} style={{ marginLeft: 'auto', background: '#007acc', color: '#fff', border: 'none', borderRadius: 3, padding: '4px 10px', cursor: 'pointer', marginRight: 5, height: '80%', alignSelf: 'center' }}>Save</button>}
            </div>
            {/* Editor */}
            <div style={{ flex: 1, background: '#1e1e1e', minHeight: 0 }}>
              {activeTabData ? (
                <MonacoEditor
                  key={activeTabData.path} // Important: re-mount editor if path changes
                  width="100%"
                  height="100%"
                  language={getLanguageFromPath(activeTabData.path)}
                  theme="vs-dark" // Standard VS Code dark theme
                  value={activeTabData.content}
                  onChange={handleEditorChange}
                  options={{ fontSize: 14, minimap: { enabled: true }, scrollBeyondLastLine: false, automaticLayout: true }}
                  onMount={(editor, monaco) => { /* You can store editor/monaco instances here if needed */ }}
                />
              ) : (
                <div style={{ color: '#888', textAlign: 'center', marginTop: 40, fontSize: 18 }}>
                  No file open. Select a file from the sidebar or create a new one.
                </div>
              )}
            </div>
            {/* Terminal */}
            <div style={{ height: 200, background: '#181818', borderTop: '1px solid #000', overflow: 'hidden', flexShrink: 0 }}>
              <div id="xterm-container" style={{ width: '100%', height: '100%' }} />
            </div>
            {/* Status bar */}
            <div style={{ height: 22, background: '#007acc', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '0.9em', flexShrink: 0 }}>
              {activeTabData ? `${activeTabData.name} (${activeTabData.path})` : 'Status: Ready'}
              {activeTabData && (activeTabData.content !== activeTabData.originalContent) && <span style={{marginLeft: 'auto', fontStyle: 'italic' }}>Unsaved Changes</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const buttonStyle = {
  background: '#3c3c3c', color: '#fff', border: '1px solid #555', borderRadius: 3,
  padding: '2px 8px', cursor: 'pointer', marginLeft: 5
};

export default VSCodeLayout;
