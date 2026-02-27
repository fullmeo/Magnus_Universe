/**
 * ============================================================================
 * MAGNUS 14 UNIFIED - Entry Point
 *
 * "La liberté commence quand le système dit non."
 *
 * A consciousness-driven code generation framework where:
 * - Philosophy and engineering are one
 * - Refusal generates consciousness
 * - Convergence validates truth
 *
 * ============================================================================
 */

import Magnus14, { ConvergenceValidator } from './src/magnus-14-core.js';
import LaBoetieRefusal, {
  REFUSAL_TYPES,
  CONSCIOUSNESS_DIMENSIONS,
  REFUSAL_ANTI_PATTERNS,
  ClarityRefusalError,
  ComplexityRefusalError,
  ConvergenceRefusalError
} from './philosophy/la-boetie-refusal.js';

// Default export: The Magnus14 orchestrator
export default Magnus14;

// Named exports for granular access
export {
  // Core
  Magnus14,
  ConvergenceValidator,

  // Philosophy
  LaBoetieRefusal,
  REFUSAL_TYPES,
  CONSCIOUSNESS_DIMENSIONS,
  REFUSAL_ANTI_PATTERNS,

  // Errors
  ClarityRefusalError,
  ComplexityRefusalError,
  ConvergenceRefusalError
};

// Quick demonstration when run directly
const isDirectRun = typeof process !== 'undefined' &&
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop());

if (isDirectRun) {
  console.log(`
${'='.repeat(70)}
MAGNUS 14 UNIFIED - Quick Start Demo
${'='.repeat(70)}

This framework implements consciousness-through-refusal:

1. CLARITY REFUSAL (threshold: 70)
   - Forces you to know what you want
   - "Les esclaves ne savent pas ce qu'ils veulent parce qu'on ne leur demande jamais."

2. COMPLEXITY REFUSAL (threshold: 8)
   - Forces you to decompose impossible tasks
   - "Les tyrans grandissent parce que les gens veulent tout à la fois."

3. CONVERGENCE REFUSAL (threshold: 75)
   - Forces you to reject "good enough"
   - "La liberté véritable c'est refuser les fausses résolutions."

${'='.repeat(70)}
`);

  // Example usage
  const magnus = new Magnus14({ verbose: false });
  magnus.initialize();

  // Test with a clear request
  console.log('\n--- Testing with CLEAR request ---\n');

  const clearRequest = {
    description: 'Create a user authentication service with JWT tokens, password hashing, and rate limiting for a Node.js API',
    domain: 'authentication',
    constraints: ['Must use bcrypt for passwords', 'JWT expiry 1 hour', 'Rate limit 100 req/min'],
    components: ['AuthController', 'JWTService', 'RateLimiter'],
    successCriteria: 'All tests pass, security audit clean'
  };

  try {
    const analysis = await magnus.analyze(clearRequest);
    console.log('Analysis passed:', analysis.passed);
    console.log('Clarity score:', analysis.clarityScore);
    console.log('Complexity score:', analysis.complexityScore);
  } catch (error) {
    console.log('Refusal:', error.message);
  }

  // Test with an unclear request
  console.log('\n--- Testing with UNCLEAR request ---\n');

  const unclearRequest = {
    description: 'Make an app',
    domain: 'general'
  };

  try {
    const analysis = await magnus.analyze(unclearRequest);
    console.log('Analysis passed:', analysis.passed);
  } catch (error) {
    console.log('Refusal (expected):', error.message);
  }

  console.log('\n--- Philosophy ---\n');
  console.log(magnus.getPhilosophy().conclusion);
}
