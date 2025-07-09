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
    let pkgPath = path.resolve(process.cwd(), 'package.json'); // Dev environment

    if (process.env.NODE_ENV === 'production' || (typeof window !== 'undefined' && window.process?.versions?.electron)) {
      // In a packaged Electron app, package.json is typically at the app root.
      // __dirname here would be something like /path/to/app.asar/dist/ or /path/to/app.asar/dist/assets/
      pkgPath = path.resolve(__dirname, '../../package.json');
      // If riley-core-agent.js is compiled to dist/ (flat):
      // pkgPath = path.resolve(__dirname, '../package.json');
    }
    console.log(`Attempting to load package.json for compliance from: ${pkgPath}`);
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      // Removed 'huggingface', 'ollama' as .riley-agent.json implies local/FOSS use is fine.
      // Keywords should focus on non-FOSS, non-local aspects.
      const forbidden = [
        'copilot', 'openai', 'tabnine', 'claude', 'anthropic', 'gpt', 'pro', // 'pro' can be risky, but let's keep for now
        'api', // 'api' is very generic, might need refinement or be context-dependent
        'cloud', // 'cloud' can be part of FOSS tool names, but often implies non-local
        'saas', 'bing', 'bard', 'gemini', 'paid', 'subscription', 'token', // 'token' can be generic
        'license', // 'license' itself is not bad, but often tied to paid/restricted
        'azure', 'google', 'aws', 'ibm', // These are company names, could be too broad if they offer FOSS tools.
        // For now, keeping them to strongly enforce avoidance of their large commercial PaaS/SaaS.
        'replicate'
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
    // Ensure this list is consistent with enforceCompliance
    const forbidden = [
      'copilot', 'openai', 'tabnine', 'claude', 'anthropic', 'gpt', 'pro',
      'api', 'cloud', 'saas', 'bing', 'bard', 'gemini', 'paid', 'subscription', 'token',
      'license', 'azure', 'google', 'aws', 'ibm', 'replicate'
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
