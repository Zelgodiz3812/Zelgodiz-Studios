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
    this.generator = await pipeline('text-generation', path.resolve(__dirname, '../codegen_training/model'));
  }

  async generateCode(prompt: string, maxTokens = 128): Promise<string> {
    if (!this.generator) await this.loadModel();
    const output = await this.generator(prompt, { max_new_tokens: maxTokens });
    return output[0]?.generated_text || '';
  }
}

export default LocalModel;
