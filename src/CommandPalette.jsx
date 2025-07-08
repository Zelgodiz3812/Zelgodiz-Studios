import React, { useState, useRef, useEffect } from 'react';

const DEFAULT_COMMANDS = [
  { label: 'New File', action: 'newFile' },
  { label: 'Save File', action: 'saveFile' },
  { label: 'Delete File', action: 'deleteFile' },
  { label: 'Search in Files', action: 'search' },
  { label: 'Open Settings', action: 'settings' },
  { label: 'Toggle Terminal', action: 'toggleTerminal' },
  { label: 'Show Riley Agent', action: 'showRiley' },
  { label: 'About', action: 'about' }
];

export default function CommandPalette({ onCommand, show, onClose }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(DEFAULT_COMMANDS);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef();

  useEffect(() => {
    if (show && inputRef.current) inputRef.current.focus();
  }, [show]);

  useEffect(() => {
    setFiltered(
      DEFAULT_COMMANDS.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
      )
    );
    setSelected(0);
  }, [query]);

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      setSelected(s => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter') {
      if (filtered[selected]) {
        onCommand(filtered[selected].action);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }

  if (!show) return null;

  return (
    <div style={{ position: 'fixed', top: 60, left: 0, right: 0, zIndex: 1000, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 420, background: '#23272e', borderRadius: 8, boxShadow: '0 4px 32px #000a', padding: 12 }}>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          style={{ width: '100%', padding: 10, fontSize: 18, background: '#181a20', color: '#fff', border: 'none', borderRadius: 4, marginBottom: 8 }}
        />
        <div>
          {filtered.map((cmd, i) => (
            <div
              key={cmd.action}
              style={{
                padding: 10,
                background: i === selected ? '#0ff2' : 'none',
                color: i === selected ? '#0ff' : '#fff',
                borderRadius: 4,
                cursor: 'pointer',
                marginBottom: 2
              }}
              onMouseEnter={() => setSelected(i)}
              onClick={() => {
                onCommand(cmd.action);
                onClose();
              }}
            >
              {cmd.label}
            </div>
          ))}
          {filtered.length === 0 && <div style={{ color: '#888', padding: 10 }}>No commands found.</div>}
        </div>
      </div>
    </div>
  );
}
