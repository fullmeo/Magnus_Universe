# Pattern Detection - Detailed Documentation

## Overview

The pattern detection engine analyzes source code to identify quality patterns that influence routing decisions. Each pattern has:

- **Pattern ID**: Unique identifier
- **Severity**: High, Medium, Low
- **Threshold**: Quantitative trigger value
- **Example**: Concrete code that triggers the pattern
- **Known False Positives**: Cases where the detector may trigger incorrectly

---

## Quality Patterns

### CYCLE_DETECTION (High Severity)

**Description**: Detects excessive cyclomatic complexity (nested conditionals, loops).

**Threshold**: `nested_conditionals > 3`

**Triggers**:
```python
# TRIGGERS - Nested if statements > 3 levels
def complex_function(x):
    if x > 0:
        if x > 10:
            if x > 100:
                if x > 1000:  # ← 4 levels
                    return True
    return False
```

**Does NOT Trigger**:
```python
# OK - Guard clauses (early returns)
def simple_function(x):
    if x <= 0:
        return False
    if x > 1000:
        return True
    # Only 2 levels max
    return x > 100
```

**Known False Positives**:
- State machines with legitimate nested states
- Parsers with hierarchical structures

---

### VALIDATION_GAP (High Severity)

**Description**: Missing or insufficient input validation.

**Threshold**: `missing_validation_check == True`

**Triggers**:
```typescript
// TRIGGERS - No validation before operation
async function createUser(email: string, age: number) {
    // No null/empty checks
    // No type validation
    const user = await db.create({ email, age });
    return user;
}
```

**Does NOT Trigger**:
```typescript
// OK - Proper validation
async function createUser(email: string, age: number) {
    if (!email || typeof email !== 'string') {
        throw new ValidationError('Invalid email');
    }
    if (typeof age !== 'number' || age < 0) {
        throw new ValidationError('Invalid age');
    }
    // Validated - proceed
    const user = await db.create({ email, age });
    return user;
}
```

**Known False Positives**:
- Trusted internal calls (already validated at boundary)
- TypeScript with strict null checks

---

### ARCHITECTURE_DRIFT (Medium Severity)

**Description**: Code organization deviates from project structure conventions.

**Threshold**: `file_to_directory_mismatch > 0`

**Triggers**:
```text
# TRIGGERS - File in wrong directory
src/
  utils/
    auth.ts          ← Should be in /auth/
  auth/
    helper.ts        ← Should be in /utils/
```

**Does NOT Trigger**:
```text
# OK - Organized correctly
src/
  auth/
    login.ts
    register.ts
  utils/
    validation.ts
    formatting.ts
```

**Known False Positives**:
- Shared utilities used across modules
- Feature-flagged code in temporary locations

---

### COUPLING_COMPLEXITY (Medium Severity)

**Description**: Excessive inter-module dependencies.

**Threshold**: `import_count > 15 OR dependency_depth > 5`

**Triggers**:
```typescript
// TRIGGERS - High coupling
import { auth } from './auth';
import { logger } from './logger';
import { cache } from './cache';
import { metrics } from './metrics';
import { config } from './config';
import { database } from './database';
// ... 15+ imports all in one file
```

**Does NOT Trigger**:
```typescript
// OK - Low coupling via dependency injection
import { Container } from './container';
const auth = container.auth;
const logger = container.logger;
```

**Known False Positives**:
- Barrel files (index.ts re-exporting)
- Configuration aggregation files

---

### CONTINUOUS_IMPROVEMENT (Medium Severity)

**Description**: Iterative refinement patterns detected.

**Threshold**: `refinement_markers > 0`

**Triggers**:
```python
# TRIGGERS - TODO/FIXME comments indicate refinement
def calculate(x):
    # TODO: Refactor after API v2
    # FIXME: Handle edge case X
    return x * 2
```

**Does NOT Trigger**:
```python
# OK - Clean code
def calculate(x):
    return x * 2
```

**Known False Positives**:
- Legitimate technical debt tracking
- Known limitations that won't be fixed

---

### CODE_CONSISTENCY (Medium Severity)

**Description**: Inconsistent patterns across codebase.

**Threshold**: `style_violations > 3`

**Triggers**:
```typescript
// TRIGGERS - Mixed naming/styles
function getUserInfo(id: string) {        // camelCase
    const user_data = db.find(id);       // snake_case
    return { UserName: user_data.name }; // PascalCase
}
```

**Does NOT Trigger**:
```typescript
// OK - Consistent style
function getUserInfo(id: string) {
    const userData = db.find(id);
    return { userName: userData.name };
}
```

**Known False Positives**:
- Interacting with external APIs (different conventions)
- Legacy code sections being phased out

---

### COGNITIVE_COMPLEXITY (Medium Severity)

**Description**: Multi-level abstraction understanding required.

**Threshold**: `cognitive_load_score > 21`

**Triggers**:
```typescript
// TRIGGERS - High cognitive load
function process(data) {
    return data
        .filter(x => x.active)
        .map(x => x.value)
        .reduce((acc, val) => {
            if (val > 100 && (acc.count > 0 || val < 1000)) {
                return { ...acc, values: [...acc.values, val] };
            } else if (val <= 100 && acc.count === 0) {
                return { ...acc, count: acc.count + 1 };
            }
            return acc;
        }, { count: 0, values: [] });
}
```

**Does NOT Trigger**:
```typescript
// OK - Readable, linear flow
function process(data) {
    const activeItems = data.filter(x => x.active);
    const values = activeItems.map(x => x.value);
    return values.reduce((acc, val) => acc + val, 0);
}
```

**Known False Positives**:
- Domain-specific complexity (financial calculations)
- Legitimate algorithm complexity

---

### BUSINESS_LOGIC_PRIORITY (Low Severity)

**Description**: Domain logic properly prioritized.

**Threshold**: `boilerplate_ratio > 0.7`

**Triggers**:
```typescript
// TRIGGERS - Too much boilerplate
class UserService {
    private logger: Logger;
    private config: Config;
    private metrics: Metrics;
    private cache: Cache;
    private tracer: Tracer;
    
    async create(user: User) {
        // 50 lines of DI and setup
        // 5 lines of actual logic
    }
}
```

**Does NOT Trigger**:
```typescript
// OK - Balanced
class UserService {
    constructor(
        private db: Database,
        private logger: Logger
    ) {}
    
    async create(user: User) {
        // 10 lines of validation
        // 5 lines of domain logic
        // 5 lines of persistence
    }
}
```

**Known False Positives**:
- Framework-required boilerplate (decorators, DI)
- Enterprise patterns with intentional layering

---

### SELF_DOCUMENTING (Low Severity)

**Description**: Code clarity through naming and structure.

**Threshold**: `comment_to_code_ratio < 0.05 AND name_length_avg < 15`

**Triggers**:
```typescript
// TRIGGERS - Cryptic names
function f(x: any): any {
    const a = x.a;
    return a.b ? a.c.d : null;
}
```

**Does NOT Trigger**:
```typescript
// OK - Self-documenting
interface OrderConfirmation {
    orderId: string;
    confirmationNumber: string;
    estimatedDelivery: Date;
}

async function generateOrderConfirmation(order: Order): Promise<OrderConfirmation> {
    // Clear intent from names
}
```

**Known False Positives**:
- Well-known abbreviations (ID, API, URL)
- Mathematical variables (x, y, z)

---

### EVIDENCE_BASED (Low Severity)

**Description**: Decisions backed by data/metrics.

**Threshold**: `metric_checks == 0`

**Triggers**:
```python
# TRIGGERS - No performance/validation checks
def process(data):
    result = transform(data)
    return result  # No validation, no metrics
```

**Does NOT Trigger**:
```python
# OK - Evidence-based
def process(data):
    start = time.perf_counter()
    result = transform(data)
    duration = time.perf_counter() - start
    
    if duration > 1000:
        logger.warning(f"Slow transformation: {duration}ms")
    
    validate(result)  # Evidence of correctness
    return result
```

**Known False Positives**:
- Hot paths where metrics add overhead
- Simple pure functions with guaranteed properties

---

## Pattern Weights Summary

| Pattern | Severity | Weight | Default Priority |
|---------|----------|--------|------------------|
| CYCLE_DETECTION | High | 0.15 | 1 |
| VALIDATION_GAP | High | 0.15 | 2 |
| ARCHITECTURE_DRIFT | Medium | 0.10 | 3 |
| COUPLING_COMPLEXITY | Medium | 0.10 | 4 |
| CONTINUOUS_IMPROVEMENT | Medium | 0.10 | 5 |
| CODE_CONSISTENCY | Medium | 0.10 | 6 |
| COGNITIVE_COMPLEXITY | Medium | 0.10 | 7 |
| BUSINESS_LOGIC_PRIORITY | Low | 0.05 | 8 |
| SELF_DOCUMENTING | Low | 0.05 | 9 |
| EVIDENCE_BASED | Low | 0.05 | 10 |
