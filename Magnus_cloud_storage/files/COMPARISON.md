# Magnus 12 vs Magnus 13: Side-by-Side Comparison

## Scenario 1: Ambiguous Request

### Request
```
"Build a user authentication system"
```

### Magnus 12 Response
```javascript
{
  decision: 'GENERATE',
  assessment: {
    scope: 'MULTI_ARTIFACT',
    complexity: {
      level: 'MODERATE',
      signals: { authentication: true, integration: true }
    }
  },
  strategy: {
    name: 'Layered Generation',
    tokenBudget: 6000,
    artifacts: '2-4'
  }
}

// Magnus 12 would proceed to generate code, making implicit assumptions
```

**Problems**:
- Doesn't question what "authentication system" means
- Assumes backend availability
- Doesn't ask about auth strategy (JWT? sessions? OAuth?)
- Makes hidden assumptions about scope

### Magnus 13 Response
```javascript
{
  clarificationNeeded: true,
  canProceed: false,
  understanding: {
    clarityScore: 42,
    ambiguities: [
      {
        type: 'SCOPE_AMBIGUITY',
        severity: 'HIGH',
        question: 'Authentication system can include: registration, login, password reset, 2FA, OAuth, roles/permissions - which specifically?'
      },
      {
        type: 'TECHNICAL_AMBIGUITY',
        severity: 'HIGH',
        question: 'Do you have a backend, or should this be frontend-only? (Auth requires backend)'
      },
      {
        type: 'TECHNICAL_AMBIGUITY',
        severity: 'MEDIUM',
        question: 'Prefer JWT (stateless), sessions (stateful), or third-party (Auth0/Supabase)?'
      }
    ]
  },
  recommendation: 'CLARIFY',
  reasoning: [
    {
      type: 'CLARITY',
      issue: 'Clarity score 42 below threshold 70',
      impact: 'HIGH - Likely to build wrong thing',
      action: 'Must clarify before proceeding'
    }
  ]
}

// Magnus 13 BLOCKS and requires clarification
```

**Improvements**:
- Detects ambiguity explicitly
- Asks prioritized clarification questions
- Refuses to proceed until requirements are clear
- Explains WHY clarification is needed

---

## Scenario 2: Complex System

### Request
```
"Build a real-time collaborative code editor with AI completion, 
video chat, version control, and plugin system"
```

### Magnus 12 Response
```javascript
{
  decision: 'GENERATE',
  assessment: {
    scope: 'MODULAR_SYSTEM', // Based on counting features
    complexity: {
      level: 'COMPLEX',
      signals: { 
        multiFile: true, 
        integration: true, 
        architecture: true 
      }
    }
  },
  strategy: {
    name: 'Module-by-Module',
    tokenBudget: 15000,
    artifacts: '5-8'
  }
}

// Magnus 12 thinks it can handle this in 15k tokens
```

**Problems**:
- Underestimates complexity dramatically
- Treats all "COMPLEX" problems equally
- No analysis of WHY it's complex
- 15k tokens is laughably insufficient

### Magnus 13 Response
```javascript
{
  canProceed: false,
  recommendation: 'DECOMPOSE',
  complexity: {
    dimensions: {
      domain: { score: 6, level: 'INTERMEDIATE' },
      technical: { score: 9, level: 'HIGH' },      // ← Real-time sync
      integration: { score: 8, level: 'HIGH' },    // ← Multiple services
      scale: { score: 5, level: 'LARGE' },
      novelty: { score: 6, level: 'INNOVATIVE' }
    },
    bottleneck: { dimension: 'technical', score: 9 },
    overall: { score: 9, level: 'EXPERT' }
  },
  decomposition: {
    why: 'Complexity score 9 is too high for single-session generation',
    bottleneck: 'technical',
    approach: 'Separate by technical layers',
    phases: [
      'Phase 1: Core editor (no real-time, no AI)',
      'Phase 2: Real-time collaboration (operational transforms)',
      'Phase 3: AI completion integration',
      'Phase 4: Video chat (WebRTC)',
      'Phase 5: Plugin system',
      'Phase 6: Version control integration'
    ]
  },
  reasoning: [
    {
      type: 'COMPLEXITY',
      issue: 'Complexity score 9 exceeds threshold 8',
      impact: 'HIGH - Cannot generate reliably in single session',
      action: 'Break down into smaller, manageable pieces'
    }
  ]
}

// Magnus 13 BLOCKS and provides decomposition plan
```

**Improvements**:
- Identifies specific bottleneck (technical complexity)
- Recognizes this is beyond AI generation in one shot
- Provides actionable decomposition strategy
- Explains which phase addresses which concern

---

## Scenario 3: Security Risk

### Request
```
"Create an API client that calls Anthropic with API key in the frontend code"
```

### Magnus 12 Response
```javascript
{
  decision: 'BLOCKED',
  assessment: {
    scope: 'BLOCKED',
    securityRisks: ['Exposed secrets']
  },
  message: 'Security risks: Exposed secrets'
}

// Magnus 12 blocks correctly but gives minimal guidance
```

**Good**: Detects the security issue  
**Limited**: No explanation of WHY or HOW to fix

### Magnus 13 Response
```javascript
{
  canProceed: false,
  recommendation: 'BLOCKED',
  complexity: {
    dimensions: {
      domain: { score: 3, level: 'STANDARD' },
      technical: { 
        score: 8, 
        level: 'HIGH',
        aspects: ['security'], // ← Explicitly flagged
        warning: 'Security complexity high - requires careful approach'
      }
    }
  },
  understanding: {
    risks: [
      {
        risk: 'CRITICAL: API keys exposed in frontend',
        probability: 'CERTAIN',
        mitigation: 'MUST use backend proxy'
      }
    ]
  },
  reasoning: [
    {
      type: 'SECURITY',
      issue: 'API keys cannot be exposed in client-side code',
      impact: 'CRITICAL - Keys will be stolen and abused',
      action: 'Redesign with backend proxy'
    }
  ],
  alternative: {
    description: 'Backend proxy pattern',
    architecture: 'Frontend → Backend Proxy → Anthropic API',
    why: 'API keys stay server-side, frontend makes requests to your backend',
    example: 'POST /api/chat → Your server → Anthropic API'
  }
}

// Magnus 13 blocks AND provides solution architecture
```

**Improvements**:
- Explains WHY it's a security issue
- Quantifies the risk (CRITICAL, CERTAIN)
- Provides alternative architecture
- Gives concrete example of solution

---

## Scenario 4: Learning Over Time

### Request (repeated 3 times)
```
"Create a React dashboard with charts"
```

### Magnus 12 Response (All 3 times)
```javascript
// First time
{ 
  tokensEstimated: 2000,
  iterationsEstimated: 2
}

// Second time (identical)
{ 
  tokensEstimated: 2000,
  iterationsEstimated: 2
}

// Third time (still identical)
{ 
  tokensEstimated: 2000,
  iterationsEstimated: 2
}

// Magnus 12 never learns from experience
```

### Magnus 13 Response (Learns and adapts)
```javascript
// First time
Generation 1: {
  estimated: { tokens: 2000, iterations: 2 },
  actual:    { tokens: 3500, iterations: 3 },
  variance:  { tokens: +75%, iterations: +50% }
}
// Records outcome, updates pattern knowledge

// Second time
Generation 2: {
  estimated: { tokens: 3500, iterations: 3 }, // ← Adjusted!
  learnedRecommendations: [
    {
      type: 'ESTIMATION',
      recommendation: 'For MULTI_ARTIFACT:MODERATE:CLEAR patterns, multiply estimate by 1.75x',
      confidence: 'MEDIUM' // Based on 2 samples
    }
  ]
}

// Third time
Generation 3: {
  estimated: { tokens: 3500, iterations: 3 },
  learnedRecommendations: [
    {
      type: 'ESTIMATION',
      recommendation: 'For MULTI_ARTIFACT:MODERATE:CLEAR patterns, multiply estimate by 1.75x',
      confidence: 'HIGH' // Based on 3 samples
    }
  ]
}

// Magnus 13 learns: estimates converge to reality
```

**Key difference**: Magnus 13 has a feedback loop. Estimates improve over time.

---

## Scenario 5: Multi-Session Development

### Request
```
Session 1: "Build a REST API for task management"
Session 2: "Add real-time updates to the API"
```

### Magnus 12 Response
```javascript
// Session 1
{
  decision: 'GENERATE',
  strategy: 'Layered Generation',
  // ... generates REST API with Express
}

// Session 2 (separate, no memory)
{
  decision: 'GENERATE',
  strategy: 'Layered Generation',
  // ... generates real-time code
  // BUT: Might use different framework, patterns, conventions
  // LOST: Why Express was chosen
  // LOST: API structure and routes
  // LOST: Data models and validation rules
}

// Sessions are isolated - coherence is lost
```

### Magnus 13 Response
```javascript
// Session 1
const session1 = await magnus.startGeneration(analysis1);

await magnus.recordArchitecturalDecision({
  decision: 'REST API with Express Router',
  rationale: 'Standard pattern, widely supported, easy to extend',
  alternatives: ['Fastify', 'Koa'],
  consequences: ['RESTful conventions', 'Middleware chain', 'Route versioning']
});

await magnus.recordArchitecturalDecision({
  decision: 'MongoDB with Mongoose',
  rationale: 'Flexible schema for rapid iteration',
  consequences: ['NoSQL queries', 'Document model', 'No joins']
});

// Session 2 (resume with context)
const context = await magnus.resumeSession(session1.sessionId);

/*
context = {
  decisions: [
    { decision: 'REST API with Express Router', rationale: '...', consequences: [...] },
    { decision: 'MongoDB with Mongoose', rationale: '...', consequences: [...] }
  ],
  existingArtifacts: [
    { name: 'routes/tasks.js', type: 'FILE', exports: ['router'] },
    { name: 'models/Task.js', type: 'FILE', exports: ['Task'] }
  ],
  continuityGuidance: [
    {
      type: 'ARCHITECTURE',
      instruction: 'Maintain consistency with previous architectural decisions',
      details: [
        '- REST API with Express Router: Standard pattern, widely supported',
        '- MongoDB with Mongoose: Flexible schema for rapid iteration'
      ]
    },
    {
      type: 'ARTIFACTS',
      instruction: 'Integrate with existing artifacts',
      details: [
        '- routes/tasks.js (FILE): Task routes',
        '- models/Task.js (FILE): Task data model'
      ]
    }
  ]
}
*/

// Session 2 generation now knows:
// ✓ Use Express (not another framework)
// ✓ Extend existing routes/tasks.js
// ✓ Use Task model from models/Task.js
// ✓ Follow established conventions
```

**Improvements**:
- Architectural decisions are preserved
- Context flows between sessions
- Consistency is maintained
- Rationale is available for review

---

## Scenario 6: Impossible Request

### Request
```
"Build a production-ready cryptocurrency trading bot with 
automated trading across 10 exchanges"
```

### Magnus 12 Response
```javascript
{
  decision: 'GENERATE',
  assessment: {
    scope: 'ITERATIVE_PROJECT', // Recognizes it's big
    complexity: { level: 'SYSTEMIC' }
  },
  strategy: {
    name: 'Iterative Development',
    approach: 'Multi-session development with priorities'
  }
}

// Magnus 12 optimistically proceeds
// Will generate partial implementation that's dangerous to use
```

### Magnus 13 Response
```javascript
{
  canProceed: false,
  recommendation: 'EXPERT_REQUIRED',
  complexity: {
    dimensions: {
      domain: { 
        score: 9, 
        level: 'EXPERT',
        warning: 'Financial trading requires deep expertise',
        expertise: {
          required: true,
          domains: ['finance', 'trading'],
          recommendation: 'Consider consulting domain experts'
        }
      },
      technical: { score: 8, level: 'HIGH' },
      integration: { score: 9, level: 'HIGH' }
    },
    bottleneck: { dimension: 'domain', score: 9 },
    overall: { score: 9, level: 'EXPERT' }
  },
  reasoning: [
    {
      type: 'DOMAIN_EXPERTISE',
      issue: 'Financial trading is an expert domain requiring specialized knowledge',
      impact: 'CRITICAL - Incorrect implementation leads to financial loss',
      action: 'This requires human expert oversight, not AI generation'
    },
    {
      type: 'LIABILITY',
      issue: 'Production trading system has real financial consequences',
      impact: 'CRITICAL - Bugs result in real money loss',
      action: 'AI-generated trading code needs extensive review and testing'
    }
  ],
  alternative: {
    description: 'Start with learning/paper trading',
    phases: [
      'Phase 1: Paper trading simulator (no real money)',
      'Phase 2: Single-exchange integration with limits',
      'Phase 3: Extensive backtesting and validation',
      'Phase 4: Limited live trading with circuit breakers',
      'Phase 5: Gradual scale-up with expert oversight'
    ],
    warning: 'Even with this approach, consult financial and legal experts'
  }
}

// Magnus 13 pushes back appropriately
```

**Key insight**: Magnus 13 knows its limits and says so.

---

## Key Differences Summary

| Aspect | Magnus 12 | Magnus 13 |
|--------|-----------|-----------|
| **Ambiguity handling** | Proceeds with assumptions | Blocks and clarifies |
| **Complexity measurement** | Single score | Multi-dimensional profile |
| **Learning** | None | Continuous from outcomes |
| **Context** | Per-session | Cross-session coherence |
| **Security** | Basic pattern matching | Risk analysis with alternatives |
| **Limits** | Optimistic | Knows when to say "no" |
| **Feedback** | None | Records and learns |
| **Decisions** | Implicit | Explicit with rationale |
| **Quality** | Guidelines | Measured success rates |

---

## When to Use Each

### Use Magnus 12 When:
- Requirements are crystal clear
- Complexity is definitively low
- Single-session generation is sufficient
- You want simple heuristics without overhead

### Use Magnus 13 When:
- Requirements may be ambiguous
- Complexity is uncertain or high
- Multi-session development is likely
- You want AI that learns and improves
- You need architectural continuity
- You want AI that knows its limits

---

## The Fundamental Difference

**Magnus 12**: "Here's what I can do within my constraints"  
**Magnus 13**: "Here's what we need to understand before I can help"

Magnus 12 is a **resource manager**.  
Magnus 13 is an **understanding partner**.

---

## Evolution Path

```
Magnus 12:  Constraint Management
              ↓
Magnus 13:  Understanding Management
              ↓
Magnus 14?: Collaborative Intelligence
```

Magnus 13 isn't just "better Magnus 12" — it's a fundamentally different approach to AI code generation.
