// riley-core-agent.ts
// Riley Genesis Code Agent for Zelgodiz Studio
// Enforces FOSS, local-only, and compliance lock at runtime

import fs from 'fs';
import path from 'path';
import LocalModel from './local-model';

const complianceLock = require('../.riley-agent.json');

export class RileyCoreAgent {
  private config: any;
  constructor() {
    this.config = complianceLock;
    this.enforceCompliance();
  }

  enforceCompliance() {
    // Check for forbidden dependencies in package.json
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      const forbidden = [
        'copilot', 'openai', 'tabnine', 'claude', 'anthropic', 'gpt', 'pro', 'api', 'cloud', 'saas', 'bing', 'bard', 'gemini', 'paid', 'subscription', 'token', 'license', 'azure', 'google', 'aws', 'ibm', 'huggingface', 'ollama', 'replicate'
      ];
      const allDeps = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}));
      for (const dep of allDeps) {
        for (const bad of forbidden) {
          if (dep.toLowerCase().includes(bad)) {
            throw new Error(`❌ Forbidden dependency detected: ${dep} (matches '${bad}')\nRemove this to comply with FOSS/local-only policy.`);
          }
        }
      }
    }
  }

  static isFOSSCompliant() {
    // Always true if no error thrown in enforceCompliance
    return true;
  }

  getPrompt() {
    return this.config.complianceLockPrompt;
  }

  getInitPrompt() {
    return this.config.initiationPrompt;
  }

  // Example: refuse to use any forbidden API at runtime
  static refuseForbiddenAPI(apiName: string) {
    const forbidden = [
      'copilot', 'openai', 'tabnine', 'claude', 'anthropic', 'gpt', 'pro', 'api', 'cloud', 'saas', 'bing', 'bard', 'gemini', 'paid', 'subscription', 'token', 'license', 'azure', 'google', 'aws', 'ibm', 'huggingface', 'ollama', 'replicate'
    ];
    for (const bad of forbidden) {
      if (apiName.toLowerCase().includes(bad)) {
        throw new Error(`❌ Forbidden API usage: ${apiName}`);
      }
    }
  }

  // Riley's local code generation using a bundled open-source model
  async generateCode(prompt: string, maxTokens = 128): Promise<string> {
    const model = await LocalModel.getInstance();
    return await model.generateCode(prompt, maxTokens);
  }
}

export default new RileyCoreAgent();
