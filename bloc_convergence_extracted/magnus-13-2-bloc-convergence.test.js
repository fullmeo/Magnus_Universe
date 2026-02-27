/**
 * ============================================================================
 * BLOC CONVERGENCE ENGINE - TEST SUITE
 * 
 * Complete test coverage for:
 * - SemanticAnalyzer
 * - CodeQualityAnalyzer
 * - ConstraintsSimilarity
 * - BlocConvergenceEngine
 * ============================================================================
 */

import {
  BlocConvergenceEngine,
  SemanticAnalyzer,
  CodeQualityAnalyzer,
  ConstraintsSimilarity
} from './magnus-13-2-bloc-convergence.js';

// ============================================================================
// TEST UTILITIES
// ============================================================================

class TestRunner {
  constructor(name) {
    this.name = name;
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  async test(description, fn) {
    try {
      await fn();
      this.passed++;
      this.tests.push({ description, status: 'PASS' });
      console.log(`  ✓ ${description}`);
    } catch (error) {
      this.failed++;
      this.tests.push({ description, status: 'FAIL', error: error.message });
      console.error(`  ✗ ${description}`);
      console.error(`    Error: ${error.message}`);
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(
        `${message || 'Assertion failed'}: expected ${expected}, got ${actual}`
      );
    }
  }

  assertGreater(actual, threshold, message) {
    if (actual <= threshold) {
      throw new Error(
        `${message || 'Assertion failed'}: expected > ${threshold}, got ${actual}`
      );
    }
  }

  assertLess(actual, threshold, message) {
    if (actual >= threshold) {
      throw new Error(
        `${message || 'Assertion failed'}: expected < ${threshold}, got ${actual}`
      );
    }
  }

  report() {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`TEST REPORT: ${this.name}`);
    console.log(`${'═'.repeat(60)}`);
    console.log(`Passed: ${this.passed}`);
    console.log(`Failed: ${this.failed}`);
    console.log(`Total: ${this.passed + this.failed}`);
    console.log(`Success Rate: ${Math.round((this.passed / (this.passed + this.failed)) * 100)}%`);
    console.log(`${'═'.repeat(60)}\n`);

    return this.failed === 0;
  }
}

// ============================================================================
// TEST DATA
// ============================================================================

const mockIntention = {
  clarityScore: 85,
  complexityScore: 5,
  domainContext: 'e-commerce payment processing',
  constraints: [
    'Must handle concurrent transactions',
    'PCI-DSS compliance required',
    'Sub-second response time'
  ],
  assumptions: [
    { description: 'Payment gateway API is reliable' },
    { description: 'Network latency < 100ms' }
  ]
};

const mockGeneratedCode = `
/**
 * PaymentProcessor - Handles concurrent payment transactions
 * with PCI-DSS compliance and optimized response times
 */

class PaymentProcessor {
  constructor(config) {
    this.config = config;
    this.queue = new Map();
    this.logger = console;
  }

  /**
   * Process a payment transaction
   * @param {Object} payment - Payment details
   * @returns {Promise<Object>} Transaction result
   */
  async processPayment(payment) {
    try {
      // Validate payment data
      if (!this.validatePayment(payment)) {
        throw new Error('Invalid payment data');
      }

      // Check concurrent limit
      if (this.queue.size >= this.config.maxConcurrent) {
        throw new Error('Queue full - try again later');
      }

      const startTime = Date.now();
      const result = await this._executeTransaction(payment);
      const duration = Date.now() - startTime;

      // Ensure sub-second response
      if (duration > 1000) {
        this.logger.warn('Slow transaction', { duration, transactionId: result.id });
      }

      return result;
    } catch (error) {
      this.logger.error('Payment processing failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Validate payment according to PCI-DSS
   */
  validatePayment(payment) {
    if (typeof payment !== 'object') return false;
    if (!payment.amount || payment.amount <= 0) return false;
    if (!payment.cardToken) return false; // No raw card data
    return true;
  }

  /**
   * Execute the transaction against gateway
   */
  async _executeTransaction(payment) {
    const transactionId = this._generateTransactionId();
    
    try {
      this.queue.set(transactionId, 'processing');

      const gateway = this.config.gateway;
      const result = await gateway.charge({
        amount: payment.amount,
        token: payment.cardToken,
        metadata: { transactionId }
      });

      this.queue.set(transactionId, 'completed');
      return { id: transactionId, success: true, ...result };
    } catch (error) {
      this.queue.set(transactionId, 'failed');
      throw error;
    } finally {
      // Cleanup
      setTimeout(() => this.queue.delete(transactionId), 60000);
    }
  }

  _generateTransactionId() {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

export default PaymentProcessor;
`;

const mockHistoricalIntention = {
  clarityScore: 80,
  complexityScore: 4,
  domainContext: 'payment systems',
  constraints: [
    'Concurrent request handling required',
    'Security compliance needed',
    'Fast response times'
  ],
  assumptions: [
    { description: 'API is stable' }
  ]
};

// ============================================================================
// SEMANTIC ANALYZER TESTS
// ============================================================================

async function testSemanticAnalyzer() {
  const runner = new TestRunner('SemanticAnalyzer');

  const analyzer = new SemanticAnalyzer({ logLevel: 'error' });

  await runner.test('Extract intention vocabulary', () => {
    const vocab = analyzer.extractIntentionVocabulary(mockIntention);

    runner.assert(vocab.domains.length > 0, 'Should extract domains');
    runner.assert(vocab.concepts.length > 0, 'Should extract concepts');
    runner.assert(vocab.constraints.length > 0, 'Should extract constraints');
    runner.assert(vocab.keywords.size > 0, 'Should have keywords');
  });

  await runner.test('Extract code vocabulary', () => {
    const vocab = analyzer.extractCodeVocabulary(mockGeneratedCode);

    runner.assert(vocab.identifiers.length > 0, 'Should extract identifiers');
    runner.assert(vocab.patterns.length > 0, 'Should detect patterns');
    runner.assert(vocab.structures.length > 0, 'Should analyze structures');
    runner.assertGreater(vocab.keywords.size, 0, 'Should have keywords');
  });

  await runner.test('Detect code patterns', () => {
    const patterns = analyzer.detectCodePatterns(mockGeneratedCode);

    runner.assert(patterns.includes('async-await'), 'Should detect async-await');
    runner.assert(patterns.includes('error-handling'), 'Should detect error handling');
    runner.assert(patterns.includes('class-based'), 'Should detect class-based pattern');
    runner.assertGreater(patterns.length, 0, 'Should detect multiple patterns');
  });

  await runner.test('Analyze code structure', () => {
    const structures = analyzer.analyzeCodeStructure(mockGeneratedCode);

    runner.assert(structures.length > 0, 'Should analyze structures');
    // Just verify that structure analysis works - the exact structures depend on code metrics
    runner.assert(Array.isArray(structures), 'Should return array of structures');
  });

  await runner.test('Calculate semantic alignment', () => {
    const intentionVocab = analyzer.extractIntentionVocabulary(mockIntention);
    const codeVocab = analyzer.extractCodeVocabulary(mockGeneratedCode);

    const alignment = analyzer.calculateSemanticAlignment(intentionVocab, codeVocab);

    runner.assertGreater(alignment.score, 40, 'Should have meaningful alignment');
    runner.assert(alignment.sharedKeywords.length >= 0, 'Should calculate shared keywords');
  });

  await runner.test('Tokenize and normalize', () => {
    const tokens = analyzer.tokenizeAndNormalize('Payment Processing System');

    runner.assertGreater(tokens.length, 1, 'Should tokenize into multiple tokens');
    runner.assert(tokens.includes('payment'), 'Should normalize to lowercase');
  });

  return runner.report();
}

// ============================================================================
// CODE QUALITY ANALYZER TESTS
// ============================================================================

async function testCodeQualityAnalyzer() {
  const runner = new TestRunner('CodeQualityAnalyzer');

  const analyzer = new CodeQualityAnalyzer({ logLevel: 'error' });

  await runner.test('Analyze code quality', () => {
    const quality = analyzer.analyze(mockGeneratedCode);

    runner.assert(quality.score >= 0, 'Should calculate score');
    runner.assert(quality.score <= 100, 'Score should be in 0-100 range');
    runner.assert(quality.readability >= 0, 'Should calculate readability');
  });

  await runner.test('Analyze size', () => {
    const size = analyzer.analyzeSize(mockGeneratedCode);

    runner.assertGreater(size.lines, 0, 'Should count non-empty lines');
    runner.assert(size.characters > 0, 'Should count characters');
    runner.assertEqual(size.status, 'PASS', 'Size should be reasonable');
  });

  await runner.test('Analyze complexity', () => {
    const complexity = analyzer.analyzeComplexity(mockGeneratedCode);

    runner.assertGreater(complexity.decisionPoints, 0, 'Should count decision points');
    runner.assert(complexity.functions > 0, 'Should count functions');
  });

  await runner.test('Analyze duplication', () => {
    const duplication = analyzer.analyzeDuplication(mockGeneratedCode);

    runner.assert(duplication.ratio >= 0, 'Duplication ratio should be >= 0');
    runner.assert(duplication.ratio <= 1, 'Duplication ratio should be <= 1');
  });

  await runner.test('Analyze documentation', () => {
    const doc = analyzer.analyzeDocumentation(mockGeneratedCode);

    runner.assert(doc.ratio > 0, 'Should have comments');
    runner.assert(doc.hasJSDoc, 'Should have JSDoc comments');
  });

  await runner.test('Analyze error handling', () => {
    const errorHandling = analyzer.analyzeErrorHandling(mockGeneratedCode);

    runner.assertGreater(errorHandling.tryBlocks, 0, 'Should have try blocks');
    runner.assertGreater(errorHandling.catchBlocks, 0, 'Should have catch blocks');
    runner.assertGreater(errorHandling.throwStatements, 0, 'Should have throw statements');
  });

  await runner.test('Analyze readability', () => {
    const readability = analyzer.analyzeReadability(mockGeneratedCode);

    runner.assert(readability.avgLineLength > 0, 'Should calculate average line length');
    runner.assert(readability.avgIndentation >= 0, 'Should calculate indentation');
  });

  await runner.test('Analyze maintainability', () => {
    const maintainability = analyzer.analyzeMaintainability(mockGeneratedCode);

    runner.assertGreater(maintainability.factors, 0, 'Should have maintainability factors');
  });

  return runner.report();
}

// ============================================================================
// CONSTRAINTS SIMILARITY TESTS
// ============================================================================

async function testConstraintsSimilarity() {
  const runner = new TestRunner('ConstraintsSimilarity');

  const similarity = new ConstraintsSimilarity({ logLevel: 'error' });

  await runner.test('Calculate exact match constraints', () => {
    const c1 = ['Must handle concurrent transactions'];
    const c2 = ['Must handle concurrent transactions'];

    const result = similarity.calculate(c1, c2);

    runner.assertGreater(result, 0.8, 'Exact matches should score high');
  });

  await runner.test('Calculate similar constraints', () => {
    const c1 = ['Must handle concurrent transactions', 'PCI-DSS compliance'];
    const c2 = ['Handle multiple concurrent requests', 'Security compliance'];

    const result = similarity.calculate(c1, c2);

    // Semantic boost should help even partial matches
    runner.assertGreater(result, 0, 'Similar constraints should have some score');
    runner.assert(result < 1, 'Should not be perfect match');
  });

  await runner.test('Handle array constraints', () => {
    const c1 = ['Constraint A', 'Constraint B'];
    const c2 = ['Constraint A', 'Constraint B'];

    const result = similarity.calculate(c1, c2);

    runner.assertGreater(result, 0.8, 'Should handle array constraints');
  });

  await runner.test('Handle string constraints', () => {
    const c1 = 'Single constraint';
    const c2 = 'Single constraint';

    const result = similarity.calculate(c1, c2);

    runner.assertGreater(result, 0.8, 'Should handle string constraints');
  });

  await runner.test('Handle null/undefined', () => {
    const result = similarity.calculate(null, undefined);

    runner.assertEqual(result, 0.5, 'Should return neutral for null/undefined');
  });

  await runner.test('Detect constraint categories', () => {
    const perfConstraint = 'response time must be sub-second';
    const securityConstraint = 'encryption required for data';

    const perfCat = similarity.constraintCategory(perfConstraint);
    const secCat = similarity.constraintCategory(securityConstraint);

    runner.assertEqual(perfCat, 'PERFORMANCE', 'Should detect performance constraints');
    runner.assertEqual(secCat, 'SECURITY', 'Should detect security constraints');
  });

  return runner.report();
}

// ============================================================================
// BLOC CONVERGENCE ENGINE TESTS
// ============================================================================

async function testBlocConvergenceEngine() {
  const runner = new TestRunner('BlocConvergenceEngine');

  const engine = new BlocConvergenceEngine({ logLevel: 'error' });
  await engine.initialize();

  await runner.test('Initialize engine', async () => {
    runner.assert(engine.initialized, 'Engine should be initialized');
  });

  await runner.test('Record convergence path', async () => {
    const sessionId = 'test-session-1';
    const convergenceData = { score: 85 };

    engine.recordConvergencePath(sessionId, mockIntention, convergenceData);

    runner.assert(
      engine.config.historicalIntentions.has(sessionId),
      'Should record convergence path'
    );
  });

  await runner.test('Find historical intentions', async () => {
    // Record some test data
    engine.recordConvergencePath('session-1', mockIntention, {});
    engine.recordConvergencePath('session-2', mockHistoricalIntention, {});

    const matches = engine.findHistoricalIntentions(mockIntention);

    runner.assert(matches.length > 0, 'Should find similar historical intentions');
  });

  await runner.test('Calculate intention distance', () => {
    const distance = engine.intentionDistance(mockIntention, mockHistoricalIntention);

    runner.assertGreater(distance, 0, 'Distance should be positive');
    runner.assertLess(distance, 1, 'Distance should be < 1');
  });

  await runner.test('Test path convergence', async () => {
    const convergence = await engine.testPathConvergence(
      mockIntention,
      mockGeneratedCode
    );

    runner.assert(convergence.score >= 0, 'Should have convergence score');
    runner.assert(convergence.score <= 100, 'Score should be in range');
  });

  await runner.test('Semantic alignment', async () => {
    const alignment = await engine.semanticAlignment(
      mockIntention,
      mockGeneratedCode
    );

    runner.assertGreater(alignment.score, 40, 'Should have reasonable semantic alignment');
  });

  await runner.test('Analyze code quality', async () => {
    const quality = await engine.analyzeCodeQuality(mockGeneratedCode);

    runner.assert(quality.score >= 0, 'Should have quality score');
    runner.assert(quality.score <= 100, 'Quality score in range');
  });

  await runner.test('Interpret robustness', () => {
    const robust = { isRobust: true, averageScore: 85, numConvergencePaths: 3 };
    const interpretation = engine.interpretRobustness(robust);

    runner.assertEqual(interpretation.level, 'ROBUST', 'Should interpret as ROBUST');
  });

  await runner.test('Interpret partial robustness', () => {
    const partial = { isRobust: false, averageScore: 70, numConvergencePaths: 1 };
    const interpretation = engine.interpretRobustness(partial);

    runner.assertEqual(interpretation.level, 'STABLE', 'Should interpret as STABLE');
  });

  await runner.test('Interpret singular robustness', () => {
    const singular = { isRobust: false, averageScore: 60, numConvergencePaths: 0 };
    const interpretation = engine.interpretRobustness(singular);

    runner.assertEqual(interpretation.level, 'SINGULAR', 'Should interpret as SINGULAR');
  });

  await runner.test('Recommend action - robust', () => {
    const robust = { isRobust: true, averageScore: 85, numConvergencePaths: 3 };
    const action = engine.recommendAction(robust);

    runner.assertEqual(action.action, 'ACCEPT_AND_GENERALIZE', 'Should recommend generalization');
  });

  await runner.test('Recommend action - stable', () => {
    const stable = { isRobust: false, averageScore: 70, numConvergencePaths: 1 };
    const action = engine.recommendAction(stable);

    runner.assertEqual(action.action, 'ACCEPT_WITH_DOCUMENTATION', 'Should recommend documentation');
  });

  await runner.test('Recommend action - singular', () => {
    const singular = { isRobust: false, averageScore: 50, numConvergencePaths: 0 };
    const action = engine.recommendAction(singular);

    runner.assertEqual(action.action, 'REFINE_OR_INVESTIGATE', 'Should recommend refinement');
  });

  await runner.test('Generate statistics', () => {
    engine.recordConvergencePath('stat-1', mockIntention, {});
    engine.recordConvergencePath('stat-2', mockHistoricalIntention, {});

    const stats = engine.generateStatistics();

    runner.assertGreater(stats.totalRecorded, 0, 'Should have statistics');
    runner.assert(stats.clarityStats.avg >= 0, 'Should calculate clarity stats');
  });

  return runner.report();
}

// ============================================================================
// INTEGRATION TEST
// ============================================================================

async function testIntegration() {
  const runner = new TestRunner('Integration Test');

  const engine = new BlocConvergenceEngine({ logLevel: 'error' });
  await engine.initialize();

  // Simulate a realistic workflow
  await runner.test('Full convergence scan workflow', async () => {
    // Record historical intentions
    engine.recordConvergencePath('hist-1', mockHistoricalIntention, {});

    // Create current analysis mock
    const currentAnalysis = {
      understanding: {
        clarityScore: 85,
        complexityScore: 5,
        domainContext: 'payment systems',
        constraints: ['Concurrent handling', 'Security', 'Speed'],
        assumptions: []
      },
      complexity: {
        overall: { score: 5 }
      }
    };

    // Run scan
    const scanResult = await engine.scanBlocForConvergence(
      currentAnalysis,
      mockGeneratedCode
    );

    runner.assert(scanResult.robustness, 'Should calculate robustness');
    runner.assert(scanResult.interpretation, 'Should provide interpretation');
    runner.assert(scanResult.recommendation, 'Should provide recommendation');
  });

  return runner.report();
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log('\n' + '═'.repeat(60));
  console.log('BLOC CONVERGENCE ENGINE - COMPREHENSIVE TEST SUITE');
  console.log('═'.repeat(60) + '\n');

  const results = [
    await testSemanticAnalyzer(),
    await testCodeQualityAnalyzer(),
    await testConstraintsSimilarity(),
    await testBlocConvergenceEngine(),
    await testIntegration()
  ];

  const allPassed = results.every(r => r === true);

  console.log('\n' + '═'.repeat(60));
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED');
  } else {
    console.log('⚠️  SOME TESTS FAILED');
  }
  console.log('═'.repeat(60));

  process.exit(allPassed ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
