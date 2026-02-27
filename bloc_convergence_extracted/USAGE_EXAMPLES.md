# Bloc Convergence Engine - Usage Examples

## Example 1: API Endpoint Generation

### Scenario
You're generating a REST API endpoint for user authentication. You've generated code and want to validate if it converges with historical authentication implementations.

```javascript
import BlocConvergenceEngine from './magnus-13-2-bloc-convergence.js';

const engine = new BlocConvergenceEngine({
  robustnessThreshold: 2,
  logLevel: 'info'
});
await engine.initialize();

// Your analysis from Magnus
const analysis = {
  understanding: {
    clarityScore: 90,
    complexityScore: 6,
    domainContext: 'user authentication',
    constraints: [
      'Must hash passwords with bcrypt',
      'Must validate email format',
      'Must generate JWT tokens',
      'Must handle concurrent login attempts'
    ],
    assumptions: [
      { description: 'Database connection is stable' },
      { description: 'Email service is available' }
    ]
  },
  complexity: {
    overall: { score: 6 }
  }
};

// Your generated code
const generatedCode = `
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {
  constructor(db, emailService) {
    this.db = db;
    this.email = emailService;
  }

  /**
   * Authenticate user with email and password
   */
  async login(email, password) {
    try {
      // Validate email
      if (!this.isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      // Find user
      const user = await this.db.users.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return { success: true, token, user: { id: user.id, email } };
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

export default AuthService;
`;

// Scan for convergence
console.log('📚 Scanning bloc for convergence...\n');
const scan = await engine.scanBlocForConvergence(analysis, generatedCode);

// Output:
console.log('Robustness Analysis:');
console.log('  Convergence paths found:', scan.robustness.numConvergencePaths);
console.log('  Average score:', Math.round(scan.robustness.averageScore) + '%');
console.log('  Level:', scan.interpretation.level);
console.log('  Confidence:', scan.interpretation.confidence);

console.log('\nRecommendation:');
console.log('  Action:', scan.recommendation.action);
console.log('  Steps:');
scan.recommendation.steps.forEach((step, i) => {
  console.log(`    ${i + 1}. ${step}`);
});

// Record for future learning
engine.recordConvergencePath(
  'session-auth-001',
  analysis.understanding,
  scan.robustness
);

// Export state for persistence
const state = await engine.exportState();
console.log('\nState exported to ./.magnus-convergence/bloc-convergence-state.json');
```

**Expected Output:**
```
📚 Scanning bloc for convergence...

🔍 BLOC CONVERGENCE SCAN
═══════════════════════════════════════════════════════
📚 Searching historical intentions...
   Found 2 candidates
🧪 Testing convergence paths...
   ✓ 2 paths converge

📊 Robustness Analysis:
   Paths: 2
   Average Score: 86%
   Robust: ✓ YES

Robustness Analysis:
  Convergence paths found: 2
  Average score: 86%
  Level: ROBUST
  Confidence: High

Recommendation:
  Action: ACCEPT_AND_GENERALIZE
  Steps:
    1. ✓ Code converges robustly
    2. → Considere la généralisation
    3. → Candidate pour npm package
```

---

## Example 2: Data Processing Pipeline

### Scenario
Generating a data processing pipeline for ETL. Want to check if the approach converges with historical data pipeline implementations.

```javascript
const analysis = {
  understanding: {
    clarityScore: 82,
    complexityScore: 7,
    domainContext: 'data pipeline ETL',
    constraints: [
      'Must process 1M+ records daily',
      'Must handle partial failures gracefully',
      'Must log all transformations',
      'Must achieve 99.9% uptime'
    ]
  },
  complexity: {
    overall: { score: 7 }
  }
};

const generatedCode = `
class DataPipeline {
  constructor(config) {
    this.config = config;
    this.logger = this.setupLogger();
    this.metrics = new MetricsCollector();
  }

  async process(data) {
    const startTime = Date.now();
    
    try {
      // Extract
      const extracted = await this.extract(data);
      this.logger.info('Extract complete', { records: extracted.length });

      // Transform with partial failure handling
      const transformed = await this.transformWithRetry(extracted);
      this.logger.info('Transform complete', { records: transformed.length });

      // Load
      const results = await this.loadWithFallback(transformed);
      this.logger.info('Load complete', { successful: results.success, failed: results.failed });

      // Record metrics
      const duration = Date.now() - startTime;
      this.metrics.record('pipeline_duration', duration);
      this.metrics.record('records_processed', transformed.length);
      this.metrics.record('success_rate', (results.success / transformed.length) * 100);

      return { success: true, processed: results.success, failed: results.failed };
    } catch (error) {
      this.logger.error('Pipeline failed', { error: error.message, stack: error.stack });
      this.metrics.record('pipeline_failure', 1);
      throw error;
    }
  }

  async transformWithRetry(records, maxRetries = 3) {
    const results = [];

    for (const record of records) {
      let retries = 0;
      let success = false;

      while (retries < maxRetries && !success) {
        try {
          const transformed = await this.transform(record);
          results.push(transformed);
          success = true;
        } catch (error) {
          retries++;
          if (retries >= maxRetries) {
            this.logger.warn('Transform failed after retries', { record, error: error.message });
          } else {
            await this.sleep(Math.pow(2, retries) * 100); // Exponential backoff
          }
        }
      }
    }

    return results;
  }

  async loadWithFallback(records) {
    const success = [];
    const failed = [];

    for (const record of records) {
      try {
        await this.primaryLoad(record);
        success.push(record);
      } catch (error) {
        this.logger.warn('Primary load failed, trying fallback', { error: error.message });
        try {
          await this.fallbackLoad(record);
          success.push(record);
        } catch (fallbackError) {
          failed.push({ record, error: fallbackError.message });
          this.logger.error('Both loads failed', { record, error: fallbackError.message });
        }
      }
    }

    return { success, failed };
  }

  setupLogger() {
    // Logger implementation
  }
}
`;

// Scan with detailed analysis
const scan = await engine.scanBlocForConvergence(analysis, generatedCode);

// Check specific robustness metrics
if (scan.robustness.isRobust) {
  console.log('✓ Pipeline converges robustly - safe for production');
  
  // Check if specific patterns converged
  const convergencePath = scan.robustness.paths[0];
  console.log('Historical alignment:', convergencePath.convergenceScore + '%');
  
  // Semantic analysis
  console.log('Semantic details:', convergencePath.recognition);
} else if (scan.robustness.numConvergencePaths > 0) {
  console.log('◐ Pipeline is stable but not fully robust');
  console.log('→ Add more documentation and assertions');
} else {
  console.log('? Pipeline is unique - investigate further');
}

// Record for learning
engine.recordConvergencePath(
  'session-etl-001',
  analysis.understanding,
  scan.robustness
);
```

---

## Example 3: Database Query Optimization

### Scenario
Optimizing a complex database query. Want to validate if optimization converges with historical query patterns.

```javascript
// Before optimization
const slowAnalysis = {
  clarityScore: 75,
  complexityScore: 8,
  domainContext: 'database queries'
};

// After optimization
const fastAnalysis = {
  clarityScore: 85,
  complexityScore: 5,
  domainContext: 'database queries optimization'
};

const optimizedCode = `
class QueryOptimizer {
  /**
   * Get user with optimized queries using batching
   */
  async getUsersWithMetadata(userIds) {
    try {
      // Batch load users
      const users = await this.db.query(
        'SELECT id, name, email FROM users WHERE id IN (?)',
        [userIds]
      );

      if (users.length === 0) return [];

      // Batch load related metadata
      const userIdList = users.map(u => u.id);
      const metadata = await this.db.query(
        'SELECT userId, key, value FROM user_metadata WHERE userId IN (?)',
        [userIdList]
      );

      // Batch load preferences
      const preferences = await this.db.query(
        'SELECT userId, setting, value FROM user_preferences WHERE userId IN (?)',
        [userIdList]
      );

      // Merge in memory (O(n) instead of N+1 queries)
      const metadataMap = new Map();
      const preferencesMap = new Map();

      metadata.forEach(m => {
        if (!metadataMap.has(m.userId)) {
          metadataMap.set(m.userId, []);
        }
        metadataMap.get(m.userId).push({ [m.key]: m.value });
      });

      preferences.forEach(p => {
        if (!preferencesMap.has(p.userId)) {
          preferencesMap.set(p.userId, {});
        }
        preferencesMap.get(p.userId)[p.setting] = p.value;
      });

      // Assemble results
      return users.map(user => ({
        ...user,
        metadata: metadataMap.get(user.id) || [],
        preferences: preferencesMap.get(user.id) || {}
      }));
    } catch (error) {
      this.logger.error('Failed to fetch users with metadata', { error: error.message });
      throw error;
    }
  }
}
`;

const scan = await engine.scanBlocForConvergence(
  { ...fastAnalysis, complexity: { overall: { score: 5 } } },
  optimizedCode
);

// Improvement tracking
console.log('Query Optimization Results:');
console.log('  Clarity improved:', slowAnalysis.clarityScore, '→', fastAnalysis.clarityScore);
console.log('  Complexity reduced:', slowAnalysis.complexityScore, '→', fastAnalysis.complexityScore);
console.log('  Convergence level:', scan.interpretation.level);

if (scan.robustness.isRobust) {
  console.log('✓ Optimization uses proven patterns');
}
```

---

## Example 4: Error Recovery System

### Scenario
Building a resilient error recovery system. Checking if the approach converges with historical reliability patterns.

```javascript
const analysis = {
  understanding: {
    clarityScore: 88,
    complexityScore: 6,
    domainContext: 'error recovery and resilience',
    constraints: [
      'Must implement exponential backoff',
      'Must respect rate limits',
      'Must log all retry attempts',
      'Must have circuit breaker pattern'
    ]
  }
};

const code = `
class ResilientClient {
  constructor(config) {
    this.config = config;
    this.circuitBreaker = new CircuitBreaker();
    this.retryPolicy = new RetryPolicy(config.maxRetries);
  }

  async request(endpoint, options = {}) {
    try {
      // Check circuit breaker
      if (this.circuitBreaker.isOpen()) {
        throw new Error('Circuit breaker is open');
      }

      // Attempt with retries
      let lastError;
      for (let attempt = 0; attempt <= this.retryPolicy.maxRetries; attempt++) {
        try {
          const result = await this.makeRequest(endpoint, options);
          this.circuitBreaker.recordSuccess();
          return result;
        } catch (error) {
          lastError = error;

          if (this.isRetryable(error) && attempt < this.retryPolicy.maxRetries) {
            const delay = this.calculateBackoff(attempt);
            console.log(\`Retry \${attempt + 1}/\${this.retryPolicy.maxRetries} after \${delay}ms\`);
            await this.sleep(delay);
          } else {
            throw error;
          }
        }
      }

      throw lastError;
    } catch (error) {
      this.circuitBreaker.recordFailure();
      console.error('Request failed permanently:', error.message);
      throw error;
    }
  }

  calculateBackoff(attempt) {
    const base = this.retryPolicy.baseDelay;
    const jitter = Math.random() * 0.1 * base;
    return Math.min(
      base * Math.pow(2, attempt) + jitter,
      this.retryPolicy.maxDelay
    );
  }

  isRetryable(error) {
    return error.code === 'ECONNRESET' ||
           error.status === 429 ||  // Rate limit
           error.status >= 500;     // Server error
  }
}
`;

const scan = await engine.scanBlocForConvergence(
  { ...analysis, complexity: { overall: { score: 6 } } },
  code
);

// Resilience validation
console.log('Resilience Validation:');
console.log('  Pattern convergence:', scan.robustness.isRobust ? '✓ ROBUST' : '◐ STABLE');
console.log('  Patterns detected:',
  scan.semanticAnalysis.codeVocabulary.patterns.join(', ')
);

if (scan.robustness.numConvergencePaths >= 2) {
  console.log('  ✓ Error handling converges with proven patterns');
  console.log('  ✓ Safe for critical systems');
}
```

---

## Example 5: Monitoring & Statistics

### Scenario
After running multiple generations, analyze convergence patterns and trends.

```javascript
// After 50+ generations recorded
const stats = engine.generateStatistics();

console.log('Bloc Convergence Statistics:');
console.log('═══════════════════════════════════════════════════════');
console.log('Total generations recorded:', stats.totalRecorded);
console.log('\nClarity Scores:');
console.log('  Min:', Math.round(stats.clarityStats.min));
console.log('  Max:', Math.round(stats.clarityStats.max));
console.log('  Average:', Math.round(stats.clarityStats.avg));

console.log('\nComplexity Scores:');
console.log('  Min:', Math.round(stats.complexityStats.min));
console.log('  Max:', Math.round(stats.complexityStats.max));
console.log('  Average:', Math.round(stats.complexityStats.avg));

// Analyze patterns
let robustCount = 0;
let stableCount = 0;
let singularCount = 0;

engine.config.historicalIntentions.forEach(({ convergenceData }) => {
  if (convergenceData.isRobust && convergenceData.averageScore >= 85) {
    robustCount++;
  } else if (convergenceData.numConvergencePaths >= 1) {
    stableCount++;
  } else {
    singularCount++;
  }
});

const total = robustCount + stableCount + singularCount;
console.log('\nConvergence Distribution:');
console.log('  ROBUST:   ', robustCount, `(${Math.round(robustCount/total*100)}%)`);
console.log('  STABLE:   ', stableCount, `(${Math.round(stableCount/total*100)}%)`);
console.log('  SINGULAR: ', singularCount, `(${Math.round(singularCount/total*100)}%)`);

// Success metrics
const successRate = ((robustCount + stableCount) / total) * 100;
console.log('\nSuccess Metrics:');
console.log('  Convergent solutions:', Math.round(successRate) + '%');
console.log('  Avg. convergence score:', 
  Math.round(
    Array.from(engine.config.historicalIntentions.values())
      .map(d => d.convergenceData?.averageScore || 0)
      .reduce((a, b) => a + b, 0) / total
  )
);

// Export for analysis
const state = await engine.exportState();
console.log('\nExported', state.historicalIntentions.length, 'sessions for analysis');
```

---

## Example 6: Custom Constraint Categories

### Scenario
Using constraint analysis for domain-specific validation.

```javascript
const constraints = engine.constraints;

// Your domain-specific constraints
const microservicesConstraints = [
  'Must be deployed independently',
  'Must have own database',
  'Must communicate via REST API',
  'Must have circuit breaker for external calls',
  'Must implement distributed tracing'
];

const legacyConstraints = [
  'Must work with 10-year-old libraries',
  'Must maintain backward compatibility',
  'Must work without Docker',
  'Must minimize dependencies'
];

// Analyze similarity
const similarity = constraints.calculate(
  microservicesConstraints,
  legacyConstraints
);

console.log('Constraint Compatibility:');
console.log('  Microservices vs Legacy:', Math.round(similarity * 100) + '%');
console.log('  → These are fundamentally different approaches');

// Categorize each
microservicesConstraints.forEach(constraint => {
  const category = constraints.constraintCategory(constraint);
  console.log('  ' + constraint, '→', category);
});

// Output:
// Must be deployed independently → SCALABILITY
// Must have own database → COMPATIBILITY
// Must communicate via REST API → RESOURCE
// Must have circuit breaker → RELIABILITY
// Must implement distributed tracing → SECURITY
```

---

## Quick Reference

### Check Convergence Level
```javascript
if (scan.robustness.isRobust) {
  // Safe for production & generalization
}
```

### Get Recommendation
```javascript
console.log(scan.recommendation.action);
// ACCEPT_AND_GENERALIZE | ACCEPT_WITH_DOCUMENTATION | REFINE_OR_INVESTIGATE
```

### Record Successful Generation
```javascript
engine.recordConvergencePath(sessionId, intention, scan.robustness);
```

### Check Code Quality
```javascript
const quality = await engine.analyzeCodeQuality(code);
console.log('Quality score:', quality.score);
console.log('Readability:', quality.readability);
```

### Calculate Constraint Similarity
```javascript
const similarity = engine.constraints.calculate(c1, c2);
console.log('Similarity:', Math.round(similarity * 100) + '%');
```

---

These examples show BlocConvergenceEngine in real-world scenarios. Use them as templates for your own implementations.

**Key insight**: Convergence isn't binary—it's a spectrum from SINGULAR (unique) through STABLE (somewhat proven) to ROBUST (convergent with multiple paths). Use this spectrum to make informed decisions about code maturity and generalizability.
