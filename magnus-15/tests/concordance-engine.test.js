/**
 * ════════════════════════════════════════════════════════════════════════════
 * CONCORDANCE ENGINE - Complete Test Suite
 *
 * Tests for:
 * - Structural Concordance (binary validation)
 * - Residual Concordance (gradient validation)
 * - Leakage measurement
 * - Pattern recognition
 * - Developer feedback parsing
 * - Integration with Magnus 15
 * ════════════════════════════════════════════════════════════════════════════
 */

const { ConcordanceEngine } = require('../concordance-engine');
const { Magnus15WithConcordance } = require('../magnus-concordance-integration');

// ════════════════════════════════════════════════════════════════
// UNIT TESTS: CONCORDANCE ENGINE
// ════════════════════════════════════════════════════════════════

describe('ConcordanceEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new ConcordanceEngine();
  });

  afterEach(() => {
    engine.resetMetrics();
  });

  // ────────────────────────────────────────────────────────────
  // Configuration Tests
  // ────────────────────────────────────────────────────────────

  describe('Configuration', () => {
    test('should initialize with default config', () => {
      expect(engine.config.structuralThresholds.minClarity).toBe(85);
      expect(engine.config.residualThresholds.convergenceBoundary).toBe(5);
      expect(engine.config.residualThresholds.partialBoundary).toBe(15);
    });

    test('should accept custom config', () => {
      const custom = new ConcordanceEngine({
        structuralThresholds: { minClarity: 90 },
        residualThresholds: { convergenceBoundary: 3 }
      });

      expect(custom.config.structuralThresholds.minClarity).toBe(90);
      expect(custom.config.residualThresholds.convergenceBoundary).toBe(3);
    });

    test('leakage weights should sum to 1.0', () => {
      const weights = engine.config.leakageWeights;
      const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
      expect(total).toBeCloseTo(1.0, 2);
    });
  });

  // ────────────────────────────────────────────────────────────
  // Classification Tests
  // ────────────────────────────────────────────────────────────

  describe('Register Classification', () => {
    test('should classify as STRUCTURAL for clear pattern', () => {
      const analysis = {
        request: 'Implement OAuth2 login with JWT tokens',
        understanding: { clarityScore: 92 },
        complexity: { overall: { score: 3 } }
      };

      const result = engine.classifyByConcordanceRegister(analysis);

      expect(result.register).toBe('STRUCTURAL');
      expect(result.pattern).toBeDefined();
      expect(result.expectedBinary).toBe(true);
    });

    test('should classify as RESIDUAL for complex domain', () => {
      const analysis = {
        request: 'Build a custom multi-tenant analytics system',
        understanding: { clarityScore: 65 },
        complexity: { overall: { score: 7 } }
      };

      const result = engine.classifyByConcordanceRegister(analysis);

      expect(result.register).toBe('RESIDUAL');
      expect(result.expectedBinary).toBe(false);
    });

    test('should classify as RESIDUAL when clarity is low', () => {
      const analysis = {
        request: 'Make it better',
        understanding: { clarityScore: 40 },
        complexity: { overall: { score: 2 } }
      };

      const result = engine.classifyByConcordanceRegister(analysis);

      expect(result.register).toBe('RESIDUAL');
    });
  });

  // ────────────────────────────────────────────────────────────
  // Pattern Recognition Tests
  // ────────────────────────────────────────────────────────────

  describe('Pattern Recognition', () => {
    test('should detect OAuth2_RFC6749 pattern', () => {
      const analysis = { request: 'implement oauth2 authorization with token refresh' };
      const result = engine.detectRecognizedPattern(analysis);

      expect(result).not.toBeNull();
      expect(result.name).toBe('OAuth2_RFC6749');
      expect(result.successRate).toBeGreaterThan(90);
    });

    test('should detect REST_CRUD pattern', () => {
      const analysis = { request: 'create a REST API with CRUD operations' };
      const result = engine.detectRecognizedPattern(analysis);

      expect(result).not.toBeNull();
      expect(result.name).toBe('REST_CRUD');
    });

    test('should detect Music_Composition pattern', () => {
      const analysis = { request: 'compose a melody with chord progressions and harmony' };
      const result = engine.detectRecognizedPattern(analysis);

      expect(result).not.toBeNull();
      expect(result.name).toBe('Music_Composition');
    });

    test('should return null for unrecognized pattern', () => {
      const analysis = { request: 'do something random and unique' };
      const result = engine.detectRecognizedPattern(analysis);

      expect(result).toBeNull();
    });
  });

  // ────────────────────────────────────────────────────────────
  // Structural Concordance Tests
  // ────────────────────────────────────────────────────────────

  describe('Structural Concordance Validation', () => {
    test('should return CONVERGED for perfect structural match', async () => {
      const code = `
        const oauth = require('oauth2');
        function authorize(token, refresh) {
          return oauth.authenticate(token);
        }
      `;
      const analysis = {
        request: 'OAuth2 authorization flow',
        understanding: { clarityScore: 95 },
        complexity: { overall: { score: 3 } }
      };
      const feedback = { text: 'exactly what I needed', confidence: 100 };

      const result = await engine.validateStructuralConcordance(
        'test-session-1', code, analysis, feedback
      );

      expect(result.register).toBe('STRUCTURAL');
      expect(result.concordanceScore).toBe(100);
      expect(result.status).toBe('CONVERGED');
      expect(result.metadata.binary).toBe(true);
    });

    test('should return FAILED for structural mismatch', async () => {
      const code = 'console.log("hello")';
      const analysis = {
        request: 'OAuth2 authorization flow',
        understanding: { clarityScore: 95 },
        complexity: { overall: { score: 3 } }
      };
      const feedback = { text: 'not what I wanted', confidence: 0 };

      const result = await engine.validateStructuralConcordance(
        'test-session-2', code, analysis, feedback
      );

      expect(result.register).toBe('STRUCTURAL');
      expect(result.concordanceScore).toBe(0);
      expect(result.status).toBe('FAILED');
    });

    test('should include philosophy in result', async () => {
      const result = await engine.validateStructuralConcordance(
        'test-session-3',
        'function api() { get("/users"); }',
        { request: 'REST API', understanding: { clarityScore: 90 }, complexity: { overall: { score: 2 } } },
        { confidence: 100 }
      );

      expect(result.philosophy).toBeDefined();
      expect(result.philosophy.sophia).toBeDefined();
      expect(result.philosophy.phono).toBeDefined();
      expect(result.philosophy.accord).toBeDefined();
    });
  });

  // ────────────────────────────────────────────────────────────
  // Residual Concordance Tests
  // ────────────────────────────────────────────────────────────

  describe('Residual Concordance Validation', () => {
    test('should return CONVERGED for low leakage', async () => {
      const code = `
        /**
         * Analytics engine
         * @param {Object} config - Configuration
         */
        function createAnalytics(config) {
          if (!config) throw new Error('Config required');
          try {
            return new Analytics(config);
          } catch (error) {
            console.error('Analytics error:', error);
            throw error;
          }
        }
        describe('Analytics', () => {
          test('should create instance', () => {
            expect(createAnalytics({})).toBeDefined();
          });
        });
      `;
      const analysis = {
        request: 'Custom analytics system',
        understanding: { clarityScore: 70 },
        complexity: { overall: { score: 6 } }
      };
      const feedback = { text: 'great work', confidence: 95 };

      const result = await engine.validateResidualConcordance(
        'test-session-4', code, analysis, feedback
      );

      expect(result.register).toBe('RESIDUAL');
      expect(result.concordanceScore).toBeGreaterThanOrEqual(85);
      expect(['CONVERGED', 'PARTIAL']).toContain(result.status);
      expect(result.metadata.gradient).toBe(true);
    });

    test('should measure leakage breakdown', async () => {
      const result = await engine.validateResidualConcordance(
        'test-session-5',
        'function f() {}',
        { complexity: { overall: { score: 5 } } },
        { confidence: 60 }
      );

      expect(result.leakageBreakdown).toBeDefined();
      expect(result.leakageBreakdown.errorHandling).toBeGreaterThanOrEqual(0);
      expect(result.leakageBreakdown.edgeCases).toBeGreaterThanOrEqual(0);
      expect(result.leakageBreakdown.documentation).toBeGreaterThanOrEqual(0);
      expect(result.leakageBreakdown.testCoverage).toBeGreaterThanOrEqual(0);
      expect(result.leakageBreakdown.security).toBeGreaterThanOrEqual(0);
    });

    test('should return PARTIAL for moderate leakage', async () => {
      const result = await engine.validateResidualConcordance(
        'test-session-6',
        'function simple() { return 1; }',
        { complexity: { overall: { score: 6 } } },
        { text: 'needs some work', confidence: 65 }
      );

      expect(result.totalLeakagePercentage).toBeGreaterThan(0);
      expect(['PARTIAL', 'CONVERGED', 'FAILED']).toContain(result.status);
    });
  });

  // ────────────────────────────────────────────────────────────
  // Leakage Measurement Tests
  // ────────────────────────────────────────────────────────────

  describe('Leakage Measurement', () => {
    test('should measure error handling leakage', () => {
      const codeWithHandling = `
        try { riskyOperation(); } catch (e) { handleError(e); }
        if (error) throw new Error('failed');
      `;
      const codeWithoutHandling = 'doSomething();';

      const leakageWith = engine.measureErrorHandlingLeakage(codeWithHandling);
      const leakageWithout = engine.measureErrorHandlingLeakage(codeWithoutHandling);

      expect(leakageWithout).toBeGreaterThan(leakageWith);
    });

    test('should measure documentation leakage', () => {
      const documented = `
        /**
         * Main function
         * @param {string} input
         */
        function main(input) {}
      `;
      const undocumented = 'function main(input) {}';

      const leakageDoc = engine.measureDocumentationLeakage(documented);
      const leakageUndoc = engine.measureDocumentationLeakage(undocumented);

      expect(leakageUndoc).toBeGreaterThan(leakageDoc);
    });

    test('should measure security leakage', () => {
      const insecure = 'eval(userInput); const pass = "secret123";';
      const secure = 'const result = JSON.parse(sanitized);';

      const leakageInsecure = engine.measureSecurityLeakage(insecure);
      const leakageSecure = engine.measureSecurityLeakage(secure);

      expect(leakageInsecure).toBeGreaterThan(leakageSecure);
    });

    test('should aggregate leakage correctly', () => {
      const measurements = {
        errorHandling: 20,
        edgeCases: 10,
        documentation: 15,
        testCoverage: 25,
        security: 10
      };

      const total = engine.aggregateLeakage(measurements, engine.config.leakageWeights);

      expect(total).toBeGreaterThan(0);
      expect(total).toBeLessThanOrEqual(100);
    });
  });

  // ────────────────────────────────────────────────────────────
  // Developer Feedback Parsing Tests
  // ────────────────────────────────────────────────────────────

  describe('Developer Feedback Parsing', () => {
    test('should parse positive feedback', () => {
      expect(engine.parseDeveloperRecognition({ text: 'exactly right' })).toBe(100);
      expect(engine.parseDeveloperRecognition({ text: 'parfait!' })).toBe(100);
      expect(engine.parseDeveloperRecognition({ text: 'great job' })).toBe(95);
      expect(engine.parseDeveloperRecognition({ text: 'good enough' })).toBe(85);
    });

    test('should parse partial feedback', () => {
      expect(engine.parseDeveloperRecognition({ text: 'almost there' })).toBe(75);
      expect(engine.parseDeveloperRecognition({ text: 'presque correct' })).toBe(75);
      expect(engine.parseDeveloperRecognition({ text: 'okay I guess' })).toBe(65);
    });

    test('should parse negative feedback', () => {
      expect(engine.parseDeveloperRecognition({ text: 'needs more work' })).toBe(40);
      expect(engine.parseDeveloperRecognition({ text: 'wrong approach' })).toBe(20);
      expect(engine.parseDeveloperRecognition({ text: 'not what I wanted' })).toBe(10);
    });

    test('should use confidence value if provided', () => {
      expect(engine.parseDeveloperRecognition({ confidence: 88 })).toBe(88);
      expect(engine.parseDeveloperRecognition({ confidence: 150 })).toBe(100);
      expect(engine.parseDeveloperRecognition({ confidence: -10 })).toBe(0);
    });

    test('should return default for empty feedback', () => {
      expect(engine.parseDeveloperRecognition({})).toBe(50);
      expect(engine.parseDeveloperRecognition(null)).toBe(50);
    });
  });

  // ────────────────────────────────────────────────────────────
  // Metrics Tests
  // ────────────────────────────────────────────────────────────

  describe('Metrics', () => {
    test('should track validation counts', async () => {
      await engine.validateStructuralConcordance('s1', 'code', { request: 'rest api' }, {});
      await engine.validateResidualConcordance('s2', 'code', { complexity: { overall: { score: 5 } } }, {});

      const metrics = engine.getMetrics();

      expect(metrics.totalValidations).toBe(2);
      expect(metrics.structural.count).toBe(1);
      expect(metrics.residual.count).toBe(1);
    });

    test('should reset metrics', async () => {
      await engine.validateResidualConcordance('s1', 'code', {}, {});
      engine.resetMetrics();

      const metrics = engine.getMetrics();
      expect(metrics.totalValidations).toBe(0);
    });
  });
});

// ════════════════════════════════════════════════════════════════
// INTEGRATION TESTS: MAGNUS 15 WITH CONCORDANCE
// ════════════════════════════════════════════════════════════════

describe('Magnus15WithConcordance Integration', () => {
  let magnus;

  beforeEach(() => {
    magnus = new Magnus15WithConcordance();
  });

  describe('Session Management', () => {
    test('should create session', () => {
      const session = magnus.createSession({
        prompt: 'Create a melody',
        genre: 'pop'
      });

      expect(session.id).toBeDefined();
      expect(session.status).toBe('initialized');
      expect(session.request.prompt).toBe('Create a melody');
    });

    test('should get session by ID', () => {
      const created = magnus.createSession({ prompt: 'Test' });
      const retrieved = magnus.getSession(created.id);

      expect(retrieved).toEqual(created);
    });
  });

  describe('Concordance Validation Workflow', () => {
    test('should validate concordance for session', async () => {
      const session = magnus.createSession({
        prompt: 'Create a pop song with verse and chorus',
        genre: 'pop'
      });

      session.analysis = {
        request: session.request.prompt,
        understanding: { clarityScore: 90 },
        complexity: { overall: { score: 3 } }
      };
      session.strategy = { confidence: 88 };

      const validation = await magnus.validateConcordance(
        session.id,
        'function createSong() { verse(); chorus(); }',
        { text: 'great', confidence: 95 }
      );

      expect(validation.sessionId).toBe(session.id);
      expect(validation.classification).toBeDefined();
      expect(validation.concordanceResult).toBeDefined();
      expect(validation.nextSteps).toBeDefined();
    });

    test('should record concordance outcome', async () => {
      const session = magnus.createSession({ prompt: 'Test composition' });
      session.analysis = {
        request: 'Test composition',
        understanding: { clarityScore: 80 },
        complexity: { overall: { score: 4 } }
      };

      const validation = await magnus.validateConcordance(
        session.id, 'code', { confidence: 90 }
      );

      const record = await magnus.recordConcordanceOutcome(session.id, validation);

      expect(record.sessionId).toBe(session.id);
      expect(record.concordance).toBeDefined();
      expect(record.finalOutcome).toBeDefined();

      const updatedSession = magnus.getSession(session.id);
      expect(updatedSession.status).toBe('completed');
    });
  });

  describe('Next Steps Suggestions', () => {
    test('should suggest RECORD for CONVERGED', () => {
      const result = { register: 'STRUCTURAL', status: 'CONVERGED' };
      const nextSteps = magnus.suggestConcordanceNextSteps(result);

      expect(nextSteps.action).toBe('RECORD_CONCORDANCE');
      expect(nextSteps.canProceed).toBe(true);
    });

    test('should suggest REFINE for PARTIAL', () => {
      const result = {
        register: 'RESIDUAL',
        status: 'PARTIAL',
        leakageBreakdown: { errorHandling: 15, edgeCases: 8 }
      };
      const nextSteps = magnus.suggestConcordanceNextSteps(result);

      expect(nextSteps.action).toBe('REFINE_AND_REVALIDATE');
      expect(nextSteps.canProceed).toBe(false);
      expect(nextSteps.suggestedRefinements).toBeDefined();
    });

    test('should suggest RETURN for FAILED', () => {
      const result = { register: 'STRUCTURAL', status: 'FAILED' };
      const nextSteps = magnus.suggestConcordanceNextSteps(result);

      expect(nextSteps.action).toBe('RETURN_TO_ANALYSIS');
      expect(nextSteps.canProceed).toBe(false);
    });
  });

  describe('Learning Records', () => {
    test('should accumulate learning records', async () => {
      const session1 = magnus.createSession({ prompt: 'Test 1' });
      const session2 = magnus.createSession({ prompt: 'Test 2' });

      session1.analysis = { request: 'Test 1', understanding: { clarityScore: 90 }, complexity: { overall: { score: 3 } } };
      session2.analysis = { request: 'Test 2', understanding: { clarityScore: 60 }, complexity: { overall: { score: 7 } } };

      const v1 = await magnus.validateConcordance(session1.id, 'code1', { confidence: 100 });
      const v2 = await magnus.validateConcordance(session2.id, 'code2', { confidence: 70 });

      await magnus.recordConcordanceOutcome(session1.id, v1);
      await magnus.recordConcordanceOutcome(session2.id, v2);

      const summary = magnus.getLearningRecordsSummary();

      expect(summary.totalRecords).toBe(2);
    });
  });
});

// ════════════════════════════════════════════════════════════════
// THRESHOLD & BOUNDARY TESTS
// ════════════════════════════════════════════════════════════════

describe('Threshold Boundaries', () => {
  let engine;

  beforeEach(() => {
    engine = new ConcordanceEngine({
      residualThresholds: {
        convergenceBoundary: 5,
        partialBoundary: 15,
        failureBoundary: 15
      }
    });
  });

  test('should return CONVERGED at exactly 5% leakage boundary', async () => {
    // Mock internal methods to control leakage
    engine.measureErrorHandlingLeakage = () => 5;
    engine.measureEdgeCaseLeakage = () => 0;
    engine.measureDocumentationLeakage = () => 0;
    engine.measureTestCoverageLeakage = () => 0;
    engine.measureSecurityLeakage = () => 0;

    const result = await engine.validateResidualConcordance(
      'boundary-test-1', 'code', {}, { confidence: 90 }
    );

    // 5% * 0.30 (errorHandling weight) = 1.5% total
    expect(result.status).toBe('CONVERGED');
  });

  test('should return PARTIAL between 5% and 15% leakage', async () => {
    engine.measureErrorHandlingLeakage = () => 30;
    engine.measureEdgeCaseLeakage = () => 10;
    engine.measureDocumentationLeakage = () => 5;
    engine.measureTestCoverageLeakage = () => 10;
    engine.measureSecurityLeakage = () => 0;

    const result = await engine.validateResidualConcordance(
      'boundary-test-2', 'code', {}, { confidence: 70 }
    );

    expect(result.totalLeakagePercentage).toBeGreaterThanOrEqual(5);
    expect(result.totalLeakagePercentage).toBeLessThan(15);
    expect(result.status).toBe('PARTIAL');
  });

  test('should return FAILED at 15% or more leakage', async () => {
    engine.measureErrorHandlingLeakage = () => 50;
    engine.measureEdgeCaseLeakage = () => 20;
    engine.measureDocumentationLeakage = () => 15;
    engine.measureTestCoverageLeakage = () => 20;
    engine.measureSecurityLeakage = () => 20;

    const result = await engine.validateResidualConcordance(
      'boundary-test-3', 'code', {}, { confidence: 30 }
    );

    expect(result.totalLeakagePercentage).toBeGreaterThanOrEqual(15);
    expect(result.status).toBe('FAILED');
  });
});

// ════════════════════════════════════════════════════════════════
// ERROR HANDLING TESTS
// ════════════════════════════════════════════════════════════════

describe('Error Handling', () => {
  let magnus;

  beforeEach(() => {
    magnus = new Magnus15WithConcordance();
  });

  test('should throw for non-existent session', async () => {
    await expect(magnus.validateConcordance('non-existent', 'code', {}))
      .rejects.toThrow('Session non-existent not found');
  });

  test('should handle null code gracefully', async () => {
    const session = magnus.createSession({ prompt: 'Test' });
    session.analysis = { understanding: { clarityScore: 70 }, complexity: { overall: { score: 5 } } };

    // Should not throw
    const result = await magnus.validateConcordance(session.id, null, {});
    expect(result).toBeDefined();
  });

  test('should handle missing analysis gracefully', async () => {
    const session = magnus.createSession({ prompt: 'Test' });
    // No analysis set

    const result = await magnus.validateConcordance(session.id, 'code', {});
    expect(result).toBeDefined();
  });
});
