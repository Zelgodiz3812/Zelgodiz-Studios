import { describe, it, expect, vi, beforeEach } from 'vitest';
import rileyCoreAgent from '../src/riley-core-agent';
import path from 'path'; // Import path for mocking

// Mock the LocalModel's actual model loading and generation for this specific test,
// as it's slow and not the focus of riley-core-agent's unit test for this part.
// We are primarily testing that rileyCoreAgent calls generateCode.
// The LocalModel itself would have its own integration tests (which would be slower).

// Mock the pipeline function from @xenova/transformers
vi.mock('@xenova/transformers', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    pipeline: vi.fn().mockResolvedValue(
      // Mock generator function
      vi.fn().mockResolvedValue([{ generated_text: 'Mocked code output' }])
    ),
  };
});


describe('RileyCoreAgent', () => {
  beforeEach(() => {
    // Mock window.electronEnv for the test environment
    // @ts-ignore
    global.window = {
      electronEnv: {
        getAppPath: () => process.cwd(), // Or a specific mock path
        pathJoin: (...args) => path.join(...args),
        pathResolve: (...args) => path.resolve(...args),
      },
    };

    // Reset mocks if they are stateful between tests, though pipeline mock above is stateless for now
    vi.clearAllMocks(); // Clears all mocks, including the pipeline mock if needed for other tests
  });

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
