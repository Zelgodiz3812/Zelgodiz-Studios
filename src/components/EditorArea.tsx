import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { useEditorStore } from '../store/editorStore';

export const EditorArea: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { activeFile, updateFileContent, editorSettings, theme } = useEditorStore();

  useEffect(() => {
    if (editorRef.current && !monacoEditorRef.current) {
      // Initialize Monaco Editor
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: '',
        language: 'javascript',
        theme: theme === 'dark' ? 'vs-dark' : theme === 'light' ? 'light' : 'hc-black',
        fontSize: editorSettings.fontSize,
        fontFamily: editorSettings.fontFamily,
        automaticLayout: true,
        minimap: { enabled: editorSettings.minimapEnabled },
        wordWrap: editorSettings.wordWrap ? 'on' : 'off',
        lineNumbers: 'on',
        glyphMargin: true,
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
        renderWhitespace: 'selection',
        scrollBeyondLastLine: false,
      });

      // Handle content changes
      monacoEditorRef.current.onDidChangeModelContent(() => {
        if (activeFile && monacoEditorRef.current) {
          const value = monacoEditorRef.current.getValue();
          updateFileContent(activeFile.id, value);
        }
      });
    }

    return () => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
        monacoEditorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (monacoEditorRef.current && activeFile) {
      const language = getLanguageFromFileName(activeFile.name);
      const model = monaco.editor.createModel(activeFile.content, language);
      monacoEditorRef.current.setModel(model);
    }
  }, [activeFile]);

  useEffect(() => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.updateOptions({
        fontSize: editorSettings.fontSize,
        fontFamily: editorSettings.fontFamily,
        minimap: { enabled: editorSettings.minimapEnabled },
        wordWrap: editorSettings.wordWrap ? 'on' : 'off',
      });
    }
  }, [editorSettings]);

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'py':
        return 'python';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="editor-area">
      {activeFile ? (
        <div ref={editorRef} className="monaco-editor-container" />
      ) : (
        <div className="welcome-screen">
          <h2>Welcome to Riley VS Code Studio</h2>
          <p>Select a file from the explorer or create a new one to start coding.</p>
        </div>
      )}
    </div>
  );
};