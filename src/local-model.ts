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
    // Download or load a small open-source code model (e.g., Phi-2, TinyLlama)
    // For demo: use a small model from HuggingFace (offline cache recommended)
    this.generator = await pipeline('text-generation', 'Xenova/phi-2', {
      // modelPath: path.resolve(__dirname, '../../tools/ai_models/phi-2'),
      // Uncomment above and download model for full offline use
    });
  }

  async generateCode(prompt: string, maxTokens = 128): Promise<string> {
    if (!this.generator) await this.loadModel();
    const output = await this.generator(prompt, { max_new_tokens: maxTokens });
    return output[0]?.generated_text || '';
  }
}

export default LocalModel;
