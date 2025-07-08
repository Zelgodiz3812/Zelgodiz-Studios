import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

export default function Editor() {
  const editorRef = useRef(null);

  useEffect(() => {
    monaco.editor.create(editorRef.current, {
      value: "// Welcome to Zelgodiz Studio\n",
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true
    });
  }, []);

  return <div ref={editorRef} style={{ flex: 1, height: '60%' }} />;
}
