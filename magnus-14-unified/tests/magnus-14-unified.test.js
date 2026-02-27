/**
 * ============================================================================
 * MAGNUS 14 UNIFIED - Integration Tests
 *
 * Tests for the consciousness-through-refusal framework
 * ============================================================================
 */

import Magnus14, {
  LaBoetieRefusal,
  REFUSAL_TYPES,
  CONSCIOUSNESS_DIMENSIONS,
  ClarityRefusalError,
  ComplexityRefusalError,
  ConvergenceRefusalError
} from '../index.js';

// Test utilities
const assert = (condition, message) => {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
  console.log(`  ✓ ${message}`);
};

const testGroup = (name, fn) => {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`TEST GROUP: ${name}`);
  console.log('─'.repeat(60));
  try {
    fn();
    console.log(`  ✅ All tests passed in: ${name}\n`);
    return true;
  } catch (error) {
    console.error(`  ❌ Test failed: ${error.message}\n`);
    return false;
  }
};

const asyncTestGroup = async (name, fn) => {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`TEST GROUP: ${name}`);
  console.log('─'.repeat(60));
  try {
    await fn();
    console.log(`  ✅ All tests passed in: ${name}\n`);
    return true;
  } catch (error) {
    console.error(`  ❌ Test failed: ${error.message}\n`);
    return false;
  }
};

// ============================================================================
// TESTS
// ============================================================================

console.log('\n' + '='.repeat(70));
console.log('MAGNUS 14 UNIFIED - TEST SUITE');
console.log('='.repeat(70));

let passedGroups = 0;
let totalGroups = 0;

// Test 1: LaBoetieRefusal - Clarity Evaluation
totalGroups++;
if (testGroup('LaBoetieRefusal - Clarity Evaluation', () => {
  const refusal = new LaBoetieRefusal({ strictMode: false });

  // Test passing clarity
  const pass = refusal.evaluateClarity(85, { domain: 'test' });
  assert(pass.passed === true, 'Clarity 85 should pass (threshold 70)');
  assert(pass.score === 85, 'Score should be 85');

  // Test failing clarity
  const fail = refusal.evaluateClarity(50, { domain: 'test' });
  assert(fail.passed === false, 'Clarity 50 should fail (threshold 70)');
  assert(fail.refusal !== undefined, 'Should have refusal details');
  assert(fail.refusal.laBoetie !== undefined, 'Should have La Boétie quote');
  assert(fail.questions.length > 0, 'Should have clarification questions');

})) passedGroups++;

// Test 2: LaBoetieRefusal - Complexity Evaluation
totalGroups++;
if (testGroup('LaBoetieRefusal - Complexity Evaluation', () => {
  const refusal = new LaBoetieRefusal({ strictMode: false });

  // Test passing complexity (lower is better)
  const pass = refusal.evaluateComplexity(5, {});
  assert(pass.passed === true, 'Complexity 5 should pass (threshold 8)');

  // Test failing complexity
  const fail = refusal.evaluateComplexity(9.5, {});
  assert(fail.passed === false, 'Complexity 9.5 should fail (threshold 8)');
  assert(fail.decomposition !== undefined, 'Should have decomposition suggestion');
  assert(fail.decomposition.phases.length > 0, 'Should have decomposition phases');

})) passedGroups++;

// Test 3: LaBoetieRefusal - Convergence Evaluation
totalGroups++;
if (testGroup('LaBoetieRefusal - Convergence Evaluation', () => {
  const refusal = new LaBoetieRefusal({ strictMode: false });

  // Test passing convergence
  const pass = refusal.evaluateConvergence(80, {});
  assert(pass.passed === true, 'Convergence 80 should pass (threshold 75)');

  // Test failing convergence
  const fail = refusal.evaluateConvergence(60, {});
  assert(fail.passed === false, 'Convergence 60 should fail (threshold 75)');
  assert(fail.improvements !== undefined, 'Should have improvement suggestions');

})) passedGroups++;

// Test 4: LaBoetieRefusal - Strict Mode Errors
totalGroups++;
if (testGroup('LaBoetieRefusal - Strict Mode Errors', () => {
  const strictRefusal = new LaBoetieRefusal({ strictMode: true });

  // Test ClarityRefusalError
  let clarityErrorThrown = false;
  try {
    strictRefusal.evaluateClarity(40, {});
  } catch (e) {
    clarityErrorThrown = e instanceof ClarityRefusalError;
  }
  assert(clarityErrorThrown, 'Should throw ClarityRefusalError in strict mode');

  // Test ComplexityRefusalError
  let complexityErrorThrown = false;
  try {
    strictRefusal.evaluateComplexity(9, {});
  } catch (e) {
    complexityErrorThrown = e instanceof ComplexityRefusalError;
  }
  assert(complexityErrorThrown, 'Should throw ComplexityRefusalError in strict mode');

  // Test ConvergenceRefusalError
  let convergenceErrorThrown = false;
  try {
    strictRefusal.evaluateConvergence(50, {});
  } catch (e) {
    convergenceErrorThrown = e instanceof ConvergenceRefusalError;
  }
  assert(convergenceErrorThrown, 'Should throw ConvergenceRefusalError in strict mode');

})) passedGroups++;

// Test 5: LaBoetieRefusal - Consciousness Gate
totalGroups++;
if (testGroup('LaBoetieRefusal - Consciousness Gate', () => {
  const refusal = new LaBoetieRefusal({ strictMode: false });

  // Test passing gate
  const passAnalysis = {
    clarityScore: 80,
    complexityScore: 5,
    convergenceScore: 85
  };
  const passGate = refusal.consciousnessGate(passAnalysis);
  assert(passGate.allPassed === true, 'All evaluations should pass');
  assert(passGate.consciousnessLevel > 0, 'Should have positive consciousness level');
  assert(passGate.philosophy.state === 'CONSCIOUS_ORCHESTRATION', 'Should be in conscious state');

  // Test failing gate
  const failAnalysis = {
    clarityScore: 40,
    complexityScore: 9,
    convergenceScore: 50
  };
  const failGate = refusal.consciousnessGate(failAnalysis);
  assert(failGate.allPassed === false, 'Gate should fail');
  assert(failGate.philosophy.state === 'CONSCIOUSNESS_REQUIRED', 'Should require consciousness');
  assert(failGate.philosophy.failures.length > 0, 'Should list failures');

})) passedGroups++;

// Test 6: REFUSAL_TYPES and CONSCIOUSNESS_DIMENSIONS
totalGroups++;
if (testGroup('Philosophy Constants', () => {
  // REFUSAL_TYPES
  assert(REFUSAL_TYPES.CLARITY.threshold === 70, 'Clarity threshold should be 70');
  assert(REFUSAL_TYPES.COMPLEXITY.threshold === 8, 'Complexity threshold should be 8');
  assert(REFUSAL_TYPES.CONVERGENCE.threshold === 75, 'Convergence threshold should be 75');

  // All types have La Boétie quotes
  assert(REFUSAL_TYPES.CLARITY.laBoetie !== undefined, 'Clarity should have La Boétie quote');
  assert(REFUSAL_TYPES.COMPLEXITY.laBoetie !== undefined, 'Complexity should have La Boétie quote');
  assert(REFUSAL_TYPES.CONVERGENCE.laBoetie !== undefined, 'Convergence should have La Boétie quote');

  // CONSCIOUSNESS_DIMENSIONS
  assert(Object.keys(CONSCIOUSNESS_DIMENSIONS).length === 4, 'Should have 4 consciousness dimensions');
  assert(CONSCIOUSNESS_DIMENSIONS.SELF_AWARENESS.socrates !== undefined, 'Self-awareness should have Socrates quote');

})) passedGroups++;

// Test 7: Magnus14 - Initialization
totalGroups++;
if (testGroup('Magnus14 - Initialization', () => {
  const magnus = new Magnus14({ verbose: false });

  assert(magnus.name.includes('Magnus 14'), 'Should have correct name');
  assert(magnus.version === '14.0.0', 'Should have correct version');
  assert(magnus.initialized === false, 'Should not be initialized yet');

  magnus.initialize();
  assert(magnus.initialized === true, 'Should be initialized after initialize()');

})) passedGroups++;

// Test 8: Magnus14 - Clarity Score Calculation
totalGroups++;
if (testGroup('Magnus14 - Clarity Score Calculation', () => {
  const magnus = new Magnus14({ verbose: false, strictMode: false });

  // Minimal request should have low clarity
  const lowClarity = magnus._calculateClarityScore({
    description: 'Make app'
  });
  assert(lowClarity < 70, `Minimal request should have low clarity (got ${lowClarity})`);

  // Detailed request should have high clarity
  const highClarity = magnus._calculateClarityScore({
    description: 'Create a user authentication service with JWT tokens for a Node.js API that handles login, logout, and token refresh',
    domain: 'authentication',
    constraints: ['Use bcrypt', 'JWT expiry 1h', 'Rate limit'],
    successCriteria: 'All tests pass',
    components: ['AuthController', 'TokenService']
  });
  assert(highClarity >= 70, `Detailed request should have high clarity (got ${highClarity})`);

})) passedGroups++;

// Test 9: Magnus14 - Complexity Score Calculation
totalGroups++;
if (testGroup('Magnus14 - Complexity Score Calculation', () => {
  const magnus = new Magnus14({ verbose: false });

  // Simple request
  const lowComplexity = magnus._calculateComplexityScore({
    description: 'Create a simple REST endpoint'
  });
  assert(lowComplexity < 8, `Simple request should have low complexity (got ${lowComplexity})`);

  // Complex request
  const highComplexity = magnus._calculateComplexityScore({
    description: 'Build distributed AI-powered blockchain microservices with real-time ML',
    components: ['Service1', 'Service2', 'Service3', 'Service4', 'Service5'],
    integrations: ['Kafka', 'Redis', 'PostgreSQL', 'MongoDB'],
    constraints: ['High availability', 'Sub-10ms latency', 'GDPR compliance']
  });
  assert(highComplexity > 6, `Complex request should have high complexity (got ${highComplexity})`);

})) passedGroups++;

// Test 10: Magnus14 - Analysis Phase (Async)
totalGroups++;
await asyncTestGroup('Magnus14 - Analysis Phase', async () => {
  const magnus = new Magnus14({ verbose: false, strictMode: false });

  // Test with clear request
  const clearRequest = {
    description: 'Create a user authentication module with password hashing and JWT token generation',
    domain: 'authentication',
    constraints: ['Use bcrypt', 'JWT tokens'],
    components: ['AuthService']
  };

  const analysis = await magnus.analyze(clearRequest);
  assert(analysis.sessionId !== undefined, 'Should have session ID');
  assert(analysis.clarityScore > 0, 'Should have clarity score');
  assert(analysis.complexityScore > 0, 'Should have complexity score');
  assert(analysis.passed === true, 'Clear request should pass');

  // Test with unclear request
  const unclearRequest = {
    description: 'Make app'
  };

  const failedAnalysis = await magnus.analyze(unclearRequest);
  assert(failedAnalysis.passed === false, 'Unclear request should fail');
  assert(failedAnalysis.gateResult.allPassed === false, 'Gate should not pass');

}).then(r => { if (r) passedGroups++; });

// Test 11: Magnus14 - Full Orchestration (Async)
totalGroups++;
await asyncTestGroup('Magnus14 - Full Orchestration', async () => {
  const magnus = new Magnus14({ verbose: false, strictMode: false });

  const request = {
    description: 'Create a simple greeting function that returns a personalized message',
    domain: 'utility',
    constraints: ['Pure function', 'No side effects'],
    successCriteria: 'Returns greeting string'
  };

  // Mock generator
  const mockGenerator = async (analysis) => {
    return `
/**
 * Greeting function
 * @param {string} name - The name to greet
 * @returns {string} Personalized greeting
 */
function greet(name) {
  if (!name) {
    throw new Error('Name is required');
  }
  return \`Hello, \${name}! Welcome.\`;
}

export default greet;
    `.trim();
  };

  const result = await magnus.orchestrate(request, mockGenerator);
  assert(result.success !== undefined, 'Should have success status');
  assert(result.result !== undefined, 'Should have result');
  assert(result.result.code !== undefined, 'Should have generated code');
  assert(result.result.convergence !== undefined, 'Should have convergence data');
  assert(result.philosophy !== undefined, 'Should have philosophical summary');

}).then(r => { if (r) passedGroups++; });

// Test 12: Statistics and State Export
totalGroups++;
if (testGroup('Statistics and State Export', () => {
  const refusal = new LaBoetieRefusal({ strictMode: false });

  // Generate some refusals
  refusal.evaluateClarity(40, {});
  refusal.evaluateClarity(50, {});
  refusal.evaluateComplexity(9, {});

  const stats = refusal.getStatistics();
  assert(stats.totalRefusals === 3, 'Should have 3 refusals');
  assert(stats.byType.clarity === 2, 'Should have 2 clarity refusals');
  assert(stats.byType.complexity === 1, 'Should have 1 complexity refusal');

  const exported = refusal.exportState();
  assert(exported.refusalHistory.length === 3, 'Exported state should have history');
  assert(exported.config !== undefined, 'Exported state should have config');

})) passedGroups++;

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(70));
console.log('TEST SUMMARY');
console.log('='.repeat(70));
console.log(`  Total test groups: ${totalGroups}`);
console.log(`  Passed: ${passedGroups}`);
console.log(`  Failed: ${totalGroups - passedGroups}`);
console.log(`  Success rate: ${Math.round(passedGroups / totalGroups * 100)}%`);
console.log('='.repeat(70));

if (passedGroups === totalGroups) {
  console.log('\n  ✅ ALL TESTS PASSED\n');
  console.log('  "La liberté commence quand le système dit non."\n');
} else {
  console.log('\n  ❌ SOME TESTS FAILED\n');
  process.exit(1);
}
