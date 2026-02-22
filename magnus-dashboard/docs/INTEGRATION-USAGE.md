# 🔗 Infinity-13.2 Integration Layer - Usage Guide

## Overview

The **Integration Layer** coordinates between two powerful AI systems:

- **Magnus Infinity (∞)** - Self-improving meta-developer AI with continuous learning
- **Magnus 13.2** - Hermetic consciousness-driven code generation with convergence validation

Together, they create a unified system where **Infinity provides the consciousness and learning**, while **13.2 provides the hermetic wisdom and convergence**.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTEGRATED SYSTEM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐         ┌──────────────────┐         ┌─────┐ │
│  │   Infinity   │         │   Integration    │         │13.2 │ │
│  │              │  ─────▶ │     Layer        │  ─────▶ │     │ │
│  │  (Decides)   │         │                  │         │Gen. │ │
│  │              │  ◀───── │  (Coordinates)   │  ◀───── │     │ │
│  └──────────────┘         └──────────────────┘         └─────┘ │
│         │                          │                      │     │
│         │                          │                      │     │
│         └──────────────────────────┼──────────────────────┘     │
│                                    │                            │
│                               ┌────▼─────┐                      │
│                               │ Unified  │                      │
│                               │Safeguards│                      │
│                               └──────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Installation

### Prerequisites

```bash
# Install dependencies
npm install

# Ensure both systems are available
- files/magnus.13.2/magnus-13-2-main.js
- magnus-infinity-core.js
- src/infinity-13.2-integration.js
```

### Import

```javascript
import MagnusIntegrationLayer from './src/infinity-13.2-integration.js';
import MagnusInfinity from './magnus-infinity-core.js';
import Magnus132Hermetic from './files/magnus.13.2/magnus-13-2-main.js';
```

---

## Quick Start

### 1. Initialize Both Systems

```javascript
// Create instances
const infinity = new MagnusInfinity({
  autonomyLevel: 'supervised',
  confidenceThreshold: 0.7,
  enableSafeguards: true
});

const magnus132 = new Magnus132Hermetic({
  hermetic_depth: 7,
  convergence_threshold: 0.7,
  enable_learning: true
});

// Create integration layer
const integration = new MagnusIntegrationLayer(infinity, magnus132, {
  verboseLogging: true,
  requireBothSafeguards: true,
  safeguardPriority: 'strictest'
});

// Initialize
await integration.initialize();
console.log('✅ Integrated system ready');
```

### 2. Generate Code

```javascript
const result = await integration.generateCode(
  'Create a function that validates email addresses',
  {
    language: 'javascript',
    includeTests: true,
    style: 'functional'
  }
);

console.log('Generated Code:', result.code);
console.log('Convergence Score:', result.convergence.score);
console.log('Decision Confidence:', result.decision.confidence);
```

### 3. Check Status

```javascript
const status = integration.getStatus();
console.log('Success Rate:', status.successRate);
console.log('Average Latency:', status.metrics.averageLatency + 'ms');
console.log('Convergence Achieved:', status.metrics.convergenceAchieved);
```

---

## Configuration Options

### Integration Layer Config

```javascript
const config = {
  // Timeouts
  decisionTimeout: 5000,        // Max time for Infinity decision (ms)
  generationTimeout: 30000,     // Max time for 13.2 generation (ms)

  // Safeguard Coordination
  requireBothSafeguards: true,  // Both must pass (strict mode)
  safeguardPriority: 'strictest', // 'infinity', '13.2', 'strictest'

  // Error Handling
  retryAttempts: 3,             // Number of retry attempts
  fallbackMode: 'safe',         // 'safe', 'infinity-only', '13.2-only'

  // Logging
  verboseLogging: true,         // Detailed logs
  logDecisions: true            // Log all decisions
};

const integration = new MagnusIntegrationLayer(infinity, magnus132, config);
```

### Safeguard Priority Modes

| Mode | Behavior |
|------|----------|
| `'strictest'` | **Both** systems must validate (AND logic) |
| `'infinity'` | Infinity safeguards take priority |
| `'13.2'` | Magnus 13.2 convergence takes priority |

### Fallback Modes

| Mode | Behavior |
|------|----------|
| `'safe'` | Retry full integration, fail if unsuccessful |
| `'infinity-only'` | Fall back to Infinity decision engine only |
| `'13.2-only'` | Fall back to Magnus 13.2 generation only |

---

## API Reference

### `initialize()`

Initialize the integration layer and both underlying systems.

```javascript
await integration.initialize();
```

**Returns:** `Promise<boolean>`

**Emits:** `'initialized'` event

---

### `generateCode(prompt, context)`

Main method for integrated code generation.

**Parameters:**
- `prompt` (string) - Natural language description of what to generate
- `context` (object) - Additional context for generation
  - `language` - Target programming language
  - `style` - Code style preferences
  - `includeTests` - Whether to include tests
  - `includeComments` - Whether to include comments
  - Any other contextual data

**Returns:** `Promise<IntegrationResult>`

```javascript
interface IntegrationResult {
  operationId: string;
  timestamp: string;
  success: boolean;

  // Generated code
  code: string;

  // Decision metadata
  decision: {
    approved: boolean;
    confidence: number;
    reasoning: string;
  };

  // Convergence metadata
  convergence: {
    converged: boolean;
    score: number;
    hermeticAlignment: object;
  };

  // Safeguard results
  safeguards: {
    passed: boolean;
    infinity: object;
    magnus132: object;
    conflicts: array;
  };

  // Performance metrics
  performance: {
    totalLatency: number;
    decisionTime: number;
    generationTime: number;
    validationTime: number;
  };

  // System info
  systems: {
    infinity: object;
    magnus132: object;
  };
}
```

**Example:**

```javascript
const result = await integration.generateCode(
  'Create a REST API endpoint for user authentication',
  {
    language: 'javascript',
    framework: 'express',
    includeValidation: true,
    includeTests: true
  }
);

if (result.success && result.convergence.converged) {
  console.log('✅ High-quality code generated');
  console.log(result.code);
} else {
  console.log('⚠️ Generation succeeded but low convergence');
  console.log('Score:', result.convergence.score);
}
```

---

### `getStatus()`

Get current status of the integration layer.

**Returns:** `StatusObject`

```javascript
const status = integration.getStatus();

console.log({
  initialized: status.initialized,
  activeOperations: status.activeOperations,
  successRate: status.successRate,
  metrics: {
    totalOperations: status.metrics.totalOperations,
    successfulIntegrations: status.metrics.successfulIntegrations,
    convergenceAchieved: status.metrics.convergenceAchieved,
    averageLatency: status.metrics.averageLatency
  },
  systems: {
    infinity: status.systems.infinity,
    magnus132: status.systems.magnus132
  }
});
```

---

## Event Handling

The integration layer emits several events you can listen to:

### `'initialized'`

Fired when integration layer is initialized.

```javascript
integration.on('initialized', (data) => {
  console.log('Integration ready:', data.timestamp);
});
```

### `'generation-complete'`

Fired when code generation completes successfully.

```javascript
integration.on('generation-complete', (result) => {
  console.log('Code generated:', result.operationId);
  console.log('Convergence:', result.convergence.score);
});
```

### `'generation-failed'`

Fired when code generation fails.

```javascript
integration.on('generation-failed', (data) => {
  console.error('Generation failed:', data.operationId, data.error);
});
```

### `'safeguard-triggered'`

Fired when any safeguard is triggered.

```javascript
integration.on('safeguard-triggered', (event) => {
  console.log('Safeguard triggered:', event.system, event.event || event.error);
});
```

### `'infinity-decision'`

Fired when Infinity makes a decision.

```javascript
integration.on('infinity-decision', (decision) => {
  console.log('Decision:', decision.action, 'Confidence:', decision.confidence);
});
```

### `'convergence-result'`

Fired when convergence validation completes.

```javascript
integration.on('convergence-result', (result) => {
  console.log('Convergence:', result.converged ? 'YES' : 'NO', 'Score:', result.score);
});
```

---

## Error Scenarios & Handling

### Scenario 1: Infinity Decision Timeout

**Problem:** Infinity takes too long to make a decision.

**Handling:**
```javascript
try {
  const result = await integration.generateCode(prompt, context);
} catch (error) {
  if (error.message.includes('timeout')) {
    console.log('Decision timeout - consider increasing decisionTimeout config');
    // Retry with longer timeout
    integration.config.decisionTimeout = 10000;
    const result = await integration.generateCode(prompt, context);
  }
}
```

---

### Scenario 2: Low Convergence Score

**Problem:** Generated code doesn't match intention (convergence < 70%).

**Handling:**
```javascript
const result = await integration.generateCode(prompt, context);

if (!result.convergence.converged) {
  console.log('⚠️ Low convergence:', result.convergence.score);

  // Option 1: Refine prompt and retry
  const refinedPrompt = prompt + ' (ensure clean code with proper error handling)';
  const retryResult = await integration.generateCode(refinedPrompt, context);

  // Option 2: Use result but flag for review
  console.log('Code generated but requires human review');
  console.log(result.code);
}
```

---

### Scenario 3: Safeguard Conflict

**Problem:** Infinity and Magnus 13.2 disagree on safety.

**Handling:**
```javascript
const result = await integration.generateCode(prompt, context);

if (result.safeguards.conflicts.length > 0) {
  console.log('⚠️ Safeguard conflict detected');
  console.log('Conflicts:', result.safeguards.conflicts);

  // Review the specific conflict
  result.safeguards.conflicts.forEach(conflict => {
    console.log(`Type: ${conflict.type}`);
    console.log(`Infinity: ${conflict.infinity ? 'PASS' : 'FAIL'}`);
    console.log(`Magnus 13.2: ${conflict.magnus132 ? 'PASS' : 'FAIL'}`);
  });

  // Manual review required
  console.log('Manual review required before using code');
}
```

---

### Scenario 4: Complete Failure with Recovery

**Problem:** Generation fails completely.

**Handling:**
```javascript
integration.config.retryAttempts = 3;
integration.config.fallbackMode = 'safe';

try {
  const result = await integration.generateCode(prompt, context);
  console.log('Success after recovery:', result.success);
} catch (error) {
  console.error('Failed after all recovery attempts:', error.message);

  // Last resort: try fallback mode
  integration.config.fallbackMode = 'infinity-only';
  const fallbackResult = await integration.generateCode(prompt, context);

  if (fallbackResult.fallback === 'infinity-only') {
    console.log('Using Infinity-only fallback result');
    console.log('Note: No convergence validation performed');
  }
}
```

---

## Advanced Usage

### Custom Event Handling

```javascript
// Track all events
const eventLog = [];

integration.on('initialized', (data) => {
  eventLog.push({ type: 'initialized', data, timestamp: Date.now() });
});

integration.on('generation-complete', (result) => {
  eventLog.push({
    type: 'complete',
    operationId: result.operationId,
    convergence: result.convergence.score,
    timestamp: Date.now()
  });
});

integration.on('safeguard-triggered', (event) => {
  eventLog.push({
    type: 'safeguard',
    system: event.system,
    timestamp: Date.now()
  });

  // Alert on critical safeguards
  if (event.event?.severity === 'CRITICAL') {
    console.error('🚨 CRITICAL SAFEGUARD TRIGGERED');
    console.error('System:', event.system);
    console.error('Reason:', event.event.reason);
  }
});

// Analyze event log later
console.log('Total events:', eventLog.length);
console.log('Safeguard triggers:', eventLog.filter(e => e.type === 'safeguard').length);
```

---

### Batch Generation

```javascript
async function batchGenerate(prompts) {
  const results = [];

  for (const prompt of prompts) {
    try {
      const result = await integration.generateCode(prompt.text, prompt.context);
      results.push({
        prompt: prompt.text,
        success: true,
        result
      });
    } catch (error) {
      results.push({
        prompt: prompt.text,
        success: false,
        error: error.message
      });
    }
  }

  // Analyze batch results
  const successRate = results.filter(r => r.success).length / results.length;
  const avgConvergence = results
    .filter(r => r.success)
    .reduce((sum, r) => sum + r.result.convergence.score, 0) / results.length;

  console.log('Batch Results:');
  console.log('- Success Rate:', (successRate * 100).toFixed(2) + '%');
  console.log('- Avg Convergence:', avgConvergence.toFixed(2) + '%');

  return results;
}

// Use it
const prompts = [
  { text: 'Create user model', context: { language: 'javascript' } },
  { text: 'Create authentication service', context: { language: 'javascript' } },
  { text: 'Create API routes', context: { language: 'javascript' } }
];

const results = await batchGenerate(prompts);
```

---

### Monitoring & Metrics

```javascript
// Setup periodic monitoring
setInterval(() => {
  const status = integration.getStatus();

  console.log('\n📊 Integration Metrics:');
  console.log('━'.repeat(50));
  console.log('Operations:', status.metrics.totalOperations);
  console.log('Success Rate:', status.successRate);
  console.log('Avg Latency:', status.metrics.averageLatency.toFixed(0) + 'ms');
  console.log('Convergence Achieved:', status.metrics.convergenceAchieved);
  console.log('Safeguard Conflicts:', status.metrics.safeguardConflicts);
  console.log('Active Operations:', status.activeOperations);
  console.log('━'.repeat(50));

  // Alert on low success rate
  const successNum = parseFloat(status.successRate);
  if (successNum < 80) {
    console.warn('⚠️ Success rate below 80%!');
  }

  // Alert on high latency
  if (status.metrics.averageLatency > 5000) {
    console.warn('⚠️ Average latency above 5 seconds!');
  }
}, 60000); // Every minute
```

---

## Best Practices

### 1. Always Check Convergence

```javascript
const result = await integration.generateCode(prompt, context);

// Don't just check success
if (result.success && result.convergence.converged && result.convergence.score >= 80) {
  // High confidence - use code
  console.log('✅ High-quality code generated');
} else if (result.success && result.convergence.score >= 60) {
  // Medium confidence - review
  console.log('⚠️ Code generated but review recommended');
} else {
  // Low confidence - regenerate or manual implementation
  console.log('❌ Low confidence - consider manual implementation');
}
```

### 2. Handle Safeguard Conflicts Explicitly

```javascript
if (result.safeguards.conflicts.length > 0) {
  // Never ignore conflicts
  console.warn('Safeguard conflict - manual review required');

  // Log details for audit
  await logToAuditSystem({
    type: 'safeguard-conflict',
    prompt,
    conflicts: result.safeguards.conflicts,
    timestamp: result.timestamp
  });
}
```

### 3. Use Appropriate Timeouts

```javascript
// Simple operations
integration.config.decisionTimeout = 3000;
integration.config.generationTimeout = 10000;

// Complex operations
integration.config.decisionTimeout = 10000;
integration.config.generationTimeout = 60000;
```

### 4. Monitor Metrics

```javascript
// Check metrics regularly
const status = integration.getStatus();

if (parseFloat(status.safeguardConflictRate) > 10) {
  console.warn('High safeguard conflict rate - review configuration');
}

if (status.metrics.averageLatency > 10000) {
  console.warn('High latency - consider performance optimization');
}
```

---

## Troubleshooting

### Integration won't initialize

**Check:**
- Both Infinity and Magnus 13.2 instances are valid
- Required files are present
- Dependencies are installed

```javascript
console.log('Infinity initialized:', infinity.initialized);
console.log('Magnus 13.2 initialized:', magnus132.initialized);
```

---

### Low convergence scores consistently

**Solutions:**
- Provide more detailed prompts
- Include more context
- Adjust convergence threshold in Magnus 13.2 config
- Review hermetic principle alignment

---

### High safeguard conflict rate

**Solutions:**
- Review safeguard priority configuration
- Check if both systems have compatible safeguard settings
- Consider using `safeguardPriority: 'strictest'` for critical applications

---

### Timeouts occurring frequently

**Solutions:**
- Increase timeout values
- Check system performance
- Verify network connectivity (if remote components)
- Review complexity of prompts

---

## Examples

### Example 1: Simple Function Generation

```javascript
const result = await integration.generateCode(
  'Create a function to calculate factorial',
  { language: 'javascript' }
);

console.log(result.code);
// Output:
// function factorial(n) {
//   if (n <= 1) return 1;
//   return n * factorial(n - 1);
// }
```

### Example 2: Complex API Generation

```javascript
const result = await integration.generateCode(
  'Create a RESTful API for a blog with CRUD operations',
  {
    language: 'javascript',
    framework: 'express',
    database: 'mongodb',
    includeValidation: true,
    includeAuth: true,
    includeTests: true
  }
);

console.log('Convergence:', result.convergence.score + '%');
console.log('Decision Confidence:', result.decision.confidence);
console.log('Generated Code:\n', result.code);
```

### Example 3: Error Recovery

```javascript
integration.config.retryAttempts = 3;

try {
  const result = await integration.generateCode(
    'Create a complex data processing pipeline',
    { language: 'javascript' }
  );

  console.log('Success:', result.success);
  console.log('Recoveries:', integration.metrics.successfulRecoveries);
} catch (error) {
  console.error('Failed after retries:', error.message);
}
```

---

## Next Steps

1. **Run Basic Tests**: `npm test tests/integration-basic.js`
2. **Read Architecture Docs**: See [INTEGRATION-ARCHITECTURE.md](./INFINITY-13.2-INTEGRATION-ARCHITECTURE.md)
3. **Explore Examples**: Check `/examples` directory for more usage patterns
4. **Monitor Performance**: Use `getStatus()` to track integration health

---

## Support

- **Issues**: Report integration issues on GitHub
- **Questions**: Check FAQ or open a discussion
- **Contributing**: See CONTRIBUTING.md for guidelines

---

**Generated with Magnus Infinity + 13.2 Integration Layer** ✨
