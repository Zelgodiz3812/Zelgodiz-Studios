import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

export default function TerminalPanel() {
  const terminalRef = useRef(null);

  useEffect(() => {
    const term = new Terminal();
    term.open(terminalRef.current);
    term.writeln('Welcome to the Zelgodiz terminal.');
    term.write('$ ');
  }, []);

  return <div ref={terminalRef} style={{ height: '40%', background: '#000' }} />;
}
