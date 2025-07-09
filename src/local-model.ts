// local-model.ts
// Loads and runs a local open-source code model for Riley (Node.js, FOSS only)
// Uses transformers.js for browser/Node.js inference (MIT licensed)

import { pipeline } from '@xenova/transformers';
import path from 'path';

export class LocalModel {
  private static instance: LocalModel;
  private generator: any;

  private constructor() {}

  static async getInstance() {
    if (!LocalModel.instance) {
      LocalModel.instance = new LocalModel();
      await LocalModel.instance.loadModel();
    }
    return LocalModel.instance;
  }

  async loadModel() {
    // Load the locally trained model from codegen_training/model
    // Path adjusted for packaged app structure, assuming model is at app root/codegen_training/model
    // and this script is in app root/dist/assets/ or app root/dist/
    let modelPath = path.resolve(__dirname, '../codegen_training/model'); // Common for dev (vite serving from root)

    // In a packaged app, __dirname might be like /path/to/app.asar/dist or /path/to/app.asar/dist/assets
    // and the model would be at /path/to/app.asar/codegen_training/model
    if (process.env.NODE_ENV === 'production' || (typeof app !== 'undefined' && app.isPackaged)) { // app is an Electron module
        // More robustly, try to determine app root if possible, or assume a structure
        // If this file is in 'src' which becomes 'dist/src' or 'dist/assets', need to go up.
        // Assuming 'codegen_training/model' is at the root of the asar.
        modelPath = path.resolve(__dirname, '../../codegen_training/model');
        // If vite bundles everything into a flat 'dist' and local-model.js is in 'dist':
        // modelPath = path.resolve(__dirname, '../codegen_training/model');
        // If __dirname is the asar root itself for some reason (less likely for renderer code):
        // modelPath = path.resolve(__dirname, './codegen_training/model');

        // A common pattern for Electron resources:
        // modelPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'codegen_training/model');
        // This would require configuring electron-builder to unpack the model.
        // For now, let's stick with the relative path assuming it's packed in asar.
    }
    console.log(`Attempting to load model from: ${modelPath}`);
    this.generator = await pipeline('text-generation', modelPath);
  }

  async generateCode(prompt: string, maxTokens = 128): Promise<string> {
    if (!this.generator) await this.loadModel();
    const output = await this.generator(prompt, { max_new_tokens: maxTokens });
    return output[0]?.generated_text || '';
  }
}

export default LocalModel;
