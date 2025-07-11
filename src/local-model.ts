// local-model.ts
// Loads and runs a local open-source code model for Riley (Node.js, FOSS only)
// Uses transformers.js for browser/Node.js inference (MIT licensed)

import { pipeline } from '@xenova/transformers';
// import path from 'path'; // No longer directly needed from Node.js 'path' if using exposed electronEnv

// Augment the Window interface to inform TypeScript about electronEnv
declare global {
  interface Window {
    electronEnv: {
      getAppPath: () => string;
      pathJoin: (...args: string[]) => string;
      pathResolve: (...args: string[]) => string; // Added pathResolve to preload
    };
  }
}

export class LocalModel {
  private static instance: LocalModel;
  private generator: any;
  private modelPath: string;

  private constructor() {
    // Construct the model path using exposed functions from preload.js
    // This ensures the path is correct both in development and in packaged app.
    if (window.electronEnv && typeof window.electronEnv.getAppPath === 'function' && typeof window.electronEnv.pathJoin === 'function') {
      const appPath = window.electronEnv.getAppPath();
      this.modelPath = window.electronEnv.pathJoin(appPath, 'codegen_training', 'model');
      console.log(`[LocalModel] Resolved model path to: ${this.modelPath}`);
    } else {
      // Fallback or error if electronEnv is not available (e.g. running in a pure browser without Electron context)
      // This might happen if Vite's HMR tries to run this outside Electron, or if preload script fails.
      console.error("[LocalModel] electronEnv not found on window. Cannot determine model path. Ensure preload script is working.");
      // Attempt a relative path as a last resort, though it's unlikely to work reliably in packaged app
      this.modelPath = '../codegen_training/model';
      console.warn(`[LocalModel] Falling back to potentially unreliable model path: ${this.modelPath}`);
    }
  }

  static async getInstance() {
    if (!LocalModel.instance) {
      LocalModel.instance = new LocalModel();
      // No await loadModel() here, constructor sets the path, loadModel is called on first generation.
    }
    return LocalModel.instance;
  }

  async loadModel() {
    if (this.generator) return; // Already loaded

    console.log(`[LocalModel] Attempting to load model from: ${this.modelPath}`);
    try {
      // Transformers.js can often resolve paths correctly if they are absolute or relative to a known base.
      // For Electron, providing an absolute path derived from app.getAppPath() is most robust.
      this.generator = await pipeline('text-generation', this.modelPath);
      console.log("[LocalModel] Model loaded successfully.");
    } catch (error) {
      console.error(`[LocalModel] Failed to load model from ${this.modelPath}:`, error);
      // Rethrow or handle as appropriate for your application
      throw error;
    }
  }

  async generateCode(prompt: string, maxTokens = 128): Promise<string> {
    if (!this.generator) {
      await this.loadModel(); // Ensure model is loaded before generating
    }
    try {
      const output = await this.generator(prompt, { max_new_tokens: maxTokens });
      return output[0]?.generated_text || '';
    } catch (error) {
      console.error("[LocalModel] Error during code generation:", error);
      return `Error generating code: ${error.message}`;
    }
  }
}

export default LocalModel; // Export the class itself, instance will be managed by consumers or a central service.
                           // Or, export an instance: export default await LocalModel.getInstance(); (if top-level await is supported)
                           // For simplicity with existing riley-core-agent, let's assume it handles getInstance.
                           // The current riley-core-agent.ts does `import LocalModel from './local-model';` and then `const model = await LocalModel.getInstance();`
                           // So exporting the class is correct.
