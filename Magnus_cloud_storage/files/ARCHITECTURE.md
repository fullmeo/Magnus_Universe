# Magnus 13 Architecture

## System Overview

Magnus 13 is a cognitive engine for AI code generation that prioritizes **understanding** over **constraints**. It's built on the principle that the bottleneck in AI code generation isn't resources (tokens, iterations) but rather:

1. **Requirement ambiguity** (users don't always know what they want)
2. **Context collapse** (AI forgets architectural decisions)
3. **Integration complexity** (pieces don't fit together)
4. **Quality validation** (no feedback on whether code actually works)

## Architectural Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│              (Conversational / API / CLI)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   DECISION ENGINE                           │
│                  (Magnus13AI Core)                          │
│                                                             │
│  Input: Problem Description                                │
│  Output: Decision (CLARIFY / GENERATE / BLOCK)             │
└──────┬──────────┬──────────┬──────────┬──────────┬─────────┘
       │          │          │          │          │
       ▼          ▼          ▼          ▼          ▼
┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────┐
│ Require- ││Complexity││Architect.││ Quality  ││ Learning │
│  ments   ││ Analyzer ││ Context  ││Validator ││ Database │
│Clarifier ││          ││          ││          ││          │
└──────────┘└──────────┘└──────────┘└──────────┘└──────────┘
```

## Component Deep Dive

### 1. Magnus13AI Core

**Responsibility**: Orchestrate the understanding and decision-making process

**Key Methods**:
- `decide(problemDescription)`: Main entry point
- `understandProblem()`: Deep requirement analysis
- `checkContinuity()`: Load architectural context
- `decideArchitecture()`: Make architectural decisions
- `generateExecutionPlan()`: Create phased execution plan
- `recordMetrics()`: Learn from outcomes

**State Machine**:
```
START
  ├─> AMBIGUOUS → CLARIFICATION_REQUIRED
  ├─> IMPOSSIBLE → CANNOT_GENERATE
  ├─> INFEASIBLE → INFEASIBLE (constraints can't be met)
  └─> UNDERSTOOD → READY_TO_GENERATE
```

### 2. RequirementsClarifier

**Responsibility**: Detect ambiguities and generate clarifying questions

**Ambiguity Detection Pattern**:
```javascript
{
  indicators: [/auth|login|user/gi],      // Words that suggest need
  clarifiers: [/jwt|oauth|api key/gi],    // Words that clarify
  ambiguous: indicators.present && !clarifiers.present
}
```

**Question Priority**:
- **CRITICAL**: Blocks generation (auth method, data storage)
- **IMPORTANT**: Affects architecture (scale, security level)
- **MINOR**: Affects implementation (styling, testing)

**Output Format**:
```javascript
{
  priority: 'CRITICAL',
  question: 'How should users authenticate?',
  options: ['JWT', 'OAuth2', 'API keys', 'No auth'],
  impact: 'Determines security architecture',
  defaultSuggestion: 'JWT with refresh tokens'
}
```

### 3. ComplexityAnalyzer

**Responsibility**: Multidimensional complexity assessment

**Dimensions** (each scored 0-10):

1. **Structural**: Code organization, module boundaries
   - Indicators: file count, layers mentioned, architecture patterns
   
2. **Domain**: Problem space knowledge requirements
   - Categories: General (3), Web (4), Distributed Systems (7), Crypto (9)
   
3. **Algorithmic**: Computational complexity
   - Indicators: optimization mentions, data structures, math operations
   
4. **Integration**: External dependencies
   - Types: REST API (3), Database (4), WebSocket (5), Message Queue (5)
   
5. **State**: State management complexity
   - Indicators: global state, persistence, state machines, multi-user
   
6. **Concurrency**: Async/parallel complexity
   - Indicators: async patterns, race conditions, worker threads

**Composite Score Calculation**:
```javascript
composite = 
  structural * 0.2 +
  domain * 0.25 +
  algorithmic * 0.15 +
  integration * 0.2 +
  state * 0.1 +
  concurrency * 0.1
```

**Scope Determination**:
```javascript
composite < 3  → SINGLE_ARTIFACT
composite < 5  → MULTI_ARTIFACT
composite < 7  → MODULAR_SYSTEM
composite >= 7 → ITERATIVE_PROJECT
```

### 4. ArchitecturalContext

**Responsibility**: Maintain architectural decisions across sessions

**Architecture Decision Record (ADR)**:
```javascript
{
  timestamp: '2025-11-24T15:30:00Z',
  sessionId: 'magnus13-1234567890',
  problem: 'Build authentication system',
  options: [
    { name: 'JWT', pros: [...], cons: [...] },
    { name: 'OAuth2', pros: [...], cons: [...] }
  ],
  decision: 'JWT with httpOnly cookies',
  rationale: [
    'Simple to implement',
    'Good security with httpOnly',
    'No third-party dependencies'
  ],
  whenToReconsider: [
    'If multi-tenant requirements emerge',
    'If SSO becomes necessary'
  ]
}
```

**Continuity Calculation**:
```javascript
// Check if current problem relates to previous decisions
relevance = calculateRelevance(currentProblem, previousDecisions);
if (relevance.score > 0.5) {
  // Apply relevant architectural decisions
  applyContext(relevance.applicableDecisions);
}
```

### 5. QualityValidator

**Responsibility**: Enforce quality gates through actual validation

**Validation Categories** (weighted):

1. **Syntax** (30%): Code must parse/compile
   - JavaScript/TypeScript parsing
   - JSON validation
   - Bracket balance checking
   
2. **Security** (30%): No vulnerabilities
   - Hardcoded secrets detection
   - Injection vulnerability patterns
   - Insecure storage patterns
   
3. **Functionality** (20%): Core features work
   - Error handling presence
   - Input validation patterns
   - Entry point detection
   
4. **Maintainability** (10%): Code quality
   - File size checks
   - Comment density
   - Naming conventions
   
5. **Performance** (10%): No obvious bottlenecks
   - Nested loop detection
   - DOM-in-loop patterns
   - Polling antipatterns

**Quality Score**:
```javascript
overallScore = 
  syntaxScore * 0.3 +
  securityScore * 0.3 +
  functionalityScore * 0.2 +
  maintainabilityScore * 0.1 +
  performanceScore * 0.1

passed = criticalIssues.length === 0 && overallScore >= 0.6
```

### 6. LearningDatabase

**Responsibility**: Record outcomes and improve estimates

**Metrics Recorded**:
```javascript
{
  timestamp: '2025-11-24T15:30:00Z',
  sessionId: 'magnus13-1234567890',
  problem: 'Build React todo app',
  complexity: { scope: 'MULTI_ARTIFACT', dimensions: {...} },
  
  // Estimates vs Actuals
  estimatedTokens: 2000,
  actualTokens: 2400,
  estimationError: 0.20, // 20% over
  
  // Quality
  qualityScore: 0.85,
  testsPassed: 15,
  testsTotal: 15,
  
  // Success
  completedPhases: 3,
  totalPhases: 3,
  success: true
}
```

**Learning Algorithm**:
```javascript
// Find similar projects
similar = findSimilar(currentProblem, currentComplexity);

// Calculate average actual/estimated ratio
avgRatio = mean(similar.map(p => p.actual / p.estimated));
stdDev = standardDeviation(ratios);

// Adjust estimate
adjustedEstimate = baseEstimate * avgRatio;
confidence = stdDev < 0.3 ? 'HIGH' : stdDev < 0.6 ? 'MEDIUM' : 'LOW';
```

## Data Flow

### New Problem Flow

```
1. User provides problem description
   ↓
2. RequirementsClarifier detects ambiguities
   ├─> Ambiguous? → Return questions
   └─> Clear? → Continue
   ↓
3. Check impossibility patterns
   ├─> Impossible? → Return alternatives
   └─> Possible? → Continue
   ↓
4. ComplexityAnalyzer: Multidimensional analysis
   ↓
5. ArchitecturalContext: Check for relevant past decisions
   ↓
6. Generate architectural options
   ↓
7. Analyze tradeoffs
   ↓
8. Select best architecture (record ADR)
   ↓
9. Generate execution plan with learning-adjusted estimates
   ↓
10. Validate feasibility
    ├─> Infeasible? → Return recommendations
    └─> Feasible? → Return plan
```

### Generation + Learning Flow

```
1. Execute generation plan
   ↓
2. Generate code
   ↓
3. QualityValidator: Validate generated code
   ├─> Failed? → Return issues
   └─> Passed? → Continue
   ↓
4. Record actual metrics
   ↓
5. LearningDatabase: Update patterns
   ↓
6. Improve future estimates
```

### Continuation Flow

```
1. User provides new problem related to previous work
   ↓
2. ArchitecturalContext: Load previous sessions
   ↓
3. Calculate relevance to past decisions
   ↓
4. Apply relevant architectural context
   ↓
5. Maintain consistency with previous decisions
   ↓
6. Proceed with decision flow
```

## Key Algorithms

### Ambiguity Detection

```python
def detect_ambiguity(description, pattern):
    has_indicator = any(indicator.test(description) 
                       for indicator in pattern.indicators)
    has_clarifier = any(clarifier.test(description) 
                       for clarifier in pattern.clarifiers)
    
    return has_indicator and not has_clarifier
```

### Complexity Composite Calculation

```python
def calculate_composite(dimensions):
    weighted = sum(
        dimensions[d].score * weights[d]
        for d in dimensions
    )
    
    max_score = max(d.score for d in dimensions.values())
    max_dimension = [d for d in dimensions 
                     if dimensions[d].score == max_score][0]
    
    return {
        'score': weighted,
        'maxDimension': max_dimension,
        'maxScore': max_score
    }
```

### Similarity Matching

```python
def find_similar(problem, complexity):
    candidates = database.all_records()
    
    scores = []
    for candidate in candidates:
        # Compare problem text similarity
        text_sim = cosine_similarity(
            vectorize(problem),
            vectorize(candidate.problem)
        )
        
        # Compare complexity profile
        complexity_sim = 1 - mean(
            abs(complexity.dimensions[d] - candidate.complexity.dimensions[d]) / 10
            for d in complexity.dimensions
        )
        
        # Combined score
        score = text_sim * 0.4 + complexity_sim * 0.6
        scores.append((candidate, score))
    
    # Return top matches
    return sorted(scores, key=lambda x: x[1], reverse=True)[:5]
```

### Estimate Adjustment

```python
def adjust_estimate(base_estimate, similar_projects):
    if not similar_projects:
        return base_estimate, 'LOW'
    
    ratios = [p.actual / p.estimated for p in similar_projects]
    avg_ratio = mean(ratios)
    std_dev = stdev(ratios)
    
    adjusted = base_estimate * avg_ratio
    confidence = 'HIGH' if std_dev < 0.3 else 'MEDIUM' if std_dev < 0.6 else 'LOW'
    
    return adjusted, confidence
```

## Design Patterns

### 1. Strategy Pattern (Architecture Selection)

```javascript
class ArchitectureStrategy {
  execute(context) { /* abstract */ }
}

class MonolithicStrategy extends ArchitectureStrategy {
  execute(context) {
    return { structure: 'Single codebase', ... };
  }
}

class MicroservicesStrategy extends ArchitectureStrategy {
  execute(context) {
    return { structure: 'Independent services', ... };
  }
}
```

### 2. Template Method Pattern (Validation)

```javascript
class Validator {
  async validate(code) {
    const results = {
      syntax: await this.validateSyntax(code),
      security: await this.validateSecurity(code),
      // ...
    };
    return this.calculateOverall(results);
  }
  
  // Subclasses override specific validation methods
  validateSyntax(code) { /* abstract */ }
}
```

### 3. Observer Pattern (Metrics Recording)

```javascript
class LearningDatabase {
  constructor() {
    this.observers = [];
  }
  
  async record(metrics) {
    await this.store(metrics);
    this.notify(metrics);
  }
  
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  notify(metrics) {
    this.observers.forEach(obs => obs.update(metrics));
  }
}
```

### 4. Chain of Responsibility (Ambiguity Detection)

```javascript
class AmbiguityDetector {
  constructor() {
    this.handlers = [
      new AuthAmbiguityHandler(),
      new StorageAmbiguityHandler(),
      new ScaleAmbiguityHandler()
    ];
  }
  
  detect(description) {
    return this.handlers
      .map(h => h.check(description))
      .flat()
      .filter(amb => amb !== null);
  }
}
```

## Performance Considerations

### 1. Lazy Loading

```javascript
// Don't load full learning database on startup
class Magnus13AI {
  get learningDatabase() {
    if (!this._learningDatabase) {
      this._learningDatabase = new LearningDatabase();
    }
    return this._learningDatabase;
  }
}
```

### 2. Caching

```javascript
// Cache complexity analysis for repeated descriptions
const complexityCache = new Map();

async function analyzeComplexity(description) {
  if (complexityCache.has(description)) {
    return complexityCache.get(description);
  }
  
  const result = await actualAnalysis(description);
  complexityCache.set(description, result);
  return result;
}
```

### 3. Parallel Validation

```javascript
// Run validation categories in parallel
const results = await Promise.all([
  validateSyntax(code),
  validateSecurity(code),
  validateFunctionality(code),
  validateMaintainability(code),
  validatePerformance(code)
]);
```

## Extension Points

### 1. Custom Clarifiers

```javascript
class CustomClarifier extends RequirementsClarifier {
  buildAmbiguityPatterns() {
    return {
      ...super.buildAmbiguityPatterns(),
      myDomain: [
        {
          type: 'my_ambiguity',
          indicators: [/my pattern/gi],
          clarifiers: [/my clarifier/gi],
          // ...
        }
      ]
    };
  }
}
```

### 2. Custom Validators

```javascript
class CustomValidator extends QualityValidator {
  async validateCustom(code) {
    // Your validation logic
  }
  
  async validate(code) {
    const baseResults = await super.validate(code);
    const customResults = await this.validateCustom(code);
    return this.merge(baseResults, customResults);
  }
}
```

### 3. Custom Complexity Dimensions

```javascript
class CustomComplexityAnalyzer extends ComplexityAnalyzer {
  async analyzeMultidimensional(requirements, context) {
    const base = await super.analyzeMultidimensional(requirements, context);
    const custom = this.analyzeCustomDimension(requirements);
    return { ...base, dimensions: { ...base.dimensions, custom } };
  }
}
```

## Testing Strategy

### Unit Tests

```javascript
// Test individual components
describe('RequirementsClarifier', () => {
  it('detects authentication ambiguity', () => {
    const clarifier = new RequirementsClarifier();
    const result = clarifier.detectAmbiguities('Build app with users');
    expect(result.critical).toContainEqual(
      expect.objectContaining({ type: 'authentication' })
    );
  });
});
```

### Integration Tests

```javascript
// Test component interactions
describe('Magnus13AI Decision Flow', () => {
  it('clarifies ambiguous requirements', async () => {
    const magnus = new Magnus13AI();
    const result = await magnus.decide('Build web app');
    expect(result.phase).toBe('CLARIFICATION_REQUIRED');
    expect(result.questions.length).toBeGreaterThan(0);
  });
});
```

### End-to-End Tests

```javascript
// Test complete flows
describe('Complete Generation Flow', () => {
  it('generates and validates code', async () => {
    const magnus = new Magnus13AI();
    const decision = await magnus.decide(clearRequirements);
    const code = await generate(decision);
    const validation = await magnus.qualityValidator.validate(code);
    expect(validation.passed).toBe(true);
  });
});
```

## Deployment Considerations

### Environment Variables

```javascript
MAGNUS_TOKEN_BUDGET=10000
MAGNUS_MAX_ITERATIONS=4
MAGNUS_STRICT_MODE=false
MAGNUS_ENABLE_LEARNING=true
MAGNUS_DB_PATH=/data/learning.db
```

### Monitoring

```javascript
// Key metrics to monitor
- Clarification rate (% of requests requiring clarification)
- Impossibility detection rate (% correctly identified)
- Estimation accuracy (avg % error)
- Quality scores (avg validation score)
- Learning improvement trend (accuracy over time)
```

### Scaling

```javascript
// Horizontal scaling
- Stateless Magnus13AI instances
- Shared LearningDatabase (Redis/PostgreSQL)
- Distributed ArchitecturalContext (consistent across instances)

// Vertical scaling
- Cache complexity analysis results
- Lazy-load learning database
- Parallel validation execution
```

## Future Architecture Evolution

### Magnus 13.1: Real-time Validation

```
Generation Loop:
  while generating:
    validate_incremental(code)
    if quality_drops:
      adjust_generation()
```

### Magnus 13.2: Multi-agent System

```
Specialist Agents:
  - Security Expert (deep security analysis)
  - Performance Expert (optimization recommendations)
  - Domain Expert (domain-specific validation)
  
Magnus 13 orchestrates specialist consultation
```

### Magnus 13.3: Self-Reflection

```
Post-Generation:
  reflect_on_generated_code()
  identify_improvement_opportunities()
  iteratively_improve()
```

---

This architecture document describes Magnus 13 as of v13.0. The system is designed to evolve, with each component independently upgradeable while maintaining the core understanding-first philosophy.
