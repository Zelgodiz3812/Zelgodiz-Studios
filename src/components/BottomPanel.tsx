import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export const BottomPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [consoleHistory, setConsoleHistory] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const { speak } = useEditorStore();

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [consoleHistory]);

  const executeCommand = (command: string) => {
    if (!command.trim()) return;

    try {
      // Add command to history
      setConsoleHistory(prev => [...prev, `> ${command}`]);

      // Execute JavaScript
      const result = eval(command);
      const output = result !== undefined ? String(result) : 'undefined';
      setConsoleHistory(prev => [...prev, output]);

      // Voice feedback for Riley
      if (command.includes('speak') || command.includes('say')) {
        speak('Command executed successfully');
      }
    } catch (error) {
      setConsoleHistory(prev => [...prev, `Error: ${error}`]);
      speak('Error in command execution');
    }

    setCurrentInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    }
  };

  if (!isVisible) {
    return (
      <button
        className="console-toggle"
        onClick={() => setIsVisible(true)}
      >
        <Terminal size={16} />
        Console
      </button>
    );
  }

  return (
    <div className="bottom-panel">
      <div className="panel-header">
        <div className="panel-tabs">
          <div className="panel-tab active">
            <Terminal size={16} />
            Console
          </div>
        </div>
        <button
          className="panel-close"
          onClick={() => setIsVisible(false)}
        >
          <X size={16} />
        </button>
      </div>
      <div className="console-content">
        <div ref={outputRef} className="console-output">
          {consoleHistory.map((line, index) => (
            <div key={index} className="console-line">
              {line}
            </div>
          ))}
        </div>
        <div className="console-input-container">
          <span className="console-prompt">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            className="console-input"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type JavaScript commands..."
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};