import { describe, it, expect } from 'vitest';
import rileyCoreAgent from '../src/riley-core-agent';

describe('RileyCoreAgent', () => {
  it('should enforce FOSS compliance', () => {
    expect(rileyCoreAgent.constructor.isFOSSCompliant()).toBe(true);
  });

  it('should return compliance prompt', () => {
    expect(typeof rileyCoreAgent.getPrompt()).toBe('string');
  });

  it('should return initiation prompt', () => {
    expect(typeof rileyCoreAgent.getInitPrompt()).toBe('string');
  });

  it('should refuse forbidden API', () => {
    expect(() => rileyCoreAgent.constructor.refuseForbiddenAPI('copilot')).toThrow();
  });

  it('should generate code from local model', async () => {
    const code = await rileyCoreAgent.generateCode('Write a hello world in Python', 32);
    expect(typeof code).toBe('string');
    expect(code.length).toBeGreaterThan(0);
  }, 60000); // allow up to 60s for model load
});
