import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";

export default function EditorPane() {
  const container = useRef(null);

  useEffect(() => {
    if (container.current) {
      monaco.editor.create(container.current, {
        value: "// Welcome to Zelgodiz Studio!\n",
        language: "javascript",
        theme: "vs-dark"
      });
    }
  }, []);

  return <div id="editor-container" ref={container} style={{ height: "100%", width: "100%" }} />;
}
