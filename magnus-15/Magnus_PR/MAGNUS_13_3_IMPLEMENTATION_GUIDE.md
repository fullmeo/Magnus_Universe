# MAGNUS 13.3 - GUIDE D'IMPLÉMENTATION PRATIQUE

## Executive Summary

Avec la publication du source code Kilo (6 février 2026), Magnus passe d'une architecture **opaque** à une architecture **auditable et contributive**. Ce guide détaille les étapes concrètes pour intégrer la transparence Kilo.

---

## Timeline: Février - Avril 2026

### SEMAINE 1: 6-12 février (Kilo Release)

**Jour 1: Kilo release day**
```bash
# 1. Clone les repos
mkdir -p ~/kilo-org-sources
cd ~/kilo-org-sources
git clone https://github.com/Kilo-Org/kilo-gateway.git
git clone https://github.com/Kilo-Org/kilo-cloud.git

# 2. Explore structure basique
find kilo-gateway -type f -name "*.js" | head -20
find kilo-cloud -type f -name "*.js" | head -20
```

**Objectifs semaine 1:**
- [ ] Cloner tous les repos Kilo
- [ ] Faire un `tree` structure overview
- [ ] Identifier les fichiers clés (routing, cache, adapters)
- [ ] Créer audit checklist initial

**Fichiers clés à chercher:**
```
kilo-gateway/
  ├── routing/
  │   ├── router.js              ← PRIORITÉ
  │   ├── algorithms.js
  │   └── strategies.js
  ├── cache-layer/
  │   ├── cache.js               ← PRIORITÉ
  │   ├── session-manager.js
  │   └── persistence.js
  ├── model-adapters/
  │   ├── xai-adapter.js          ← PRIORITÉ
  │   ├── mistral-adapter.js      ← PRIORITÉ
  │   └── kawaipilot-adapter.js   ← PRIORITÉ
  └── resilience/
      ├── fallback.js
      ├── circuit-breaker.js
      └── retry-strategies.js
```

---

### SEMAINE 2: 13-19 février (Deep Analysis)

**Tâche 1: Analyser le routing algorithm**

```javascript
// Dans kilo-gateway/routing/router.js, chercher:
// 1. Fonction principale de routing
// 2. Paramètres de décision (cost, latency, availability)
// 3. Déterminisme (y a-t-il du random?)

const analysis = {
  file: 'router.js',
  mainFunction: null,         // À remplir
  parameters: [],             // À remplir
  isDeterministic: null,      // À remplir
  timeComplexity: null,       // À remplir
  findings: []
};

// Exemple finding:
// "Router uses round-robin by default, but supports cost-optimized mode"
// → Impact: Peut être déterministe si on choisit le bon mode
```

**Tâche 2: Analyser la couche cache**

```javascript
// Dans kilo-gateway/cache-layer/cache.js, chercher:
// 1. TTL par défaut
// 2. Stratégie de persistance (Redis, Memory, etc)
// 3. Clés de cache (comment sont composées?)
// 4. Session tracking

const cacheAnalysis = {
  ttl: null,                  // À remplir (ex: 3600)
  storage: null,              // À remplir (ex: 'REDIS')
  sessionPersistent: null,    // À remplir (true/false)
  keyPattern: null,           // À remplir (ex: 'session:${id}:${model}')
  hitRate: null,              // À remplir (si métrique disponible)
};

// Impact pour Magnus:
// Si TTL court → cache moins fiable
// Si sessionPersistent → on peut tracer l'état entre requêtes
```

**Tâche 3: Analyser les adaptateurs de modèles**

Pour chaque fichier `*-adapter.js`:

```javascript
// xai-adapter.js → À extraire:
const xaiAdapter = {
  model: 'xai',
  optimalTemperature: null,    // À chercher
  optimalTopP: null,           // À chercher
  contextWindow: null,         // À chercher (important!)
  specializations: [],         // À chercher (description)
  limitations: [],             // À chercher
  costProfile: null,           // À chercher
};

// Exemple pour Magnus:
// xai: { temperature: 0.6, topP: 0.85, context: 8192, specialized: ['clarity', 'explanation'] }
```

**Checklist semaine 2:**
- [ ] Router algorithm document complet
- [ ] Cache configuration document
- [ ] Adapters comparison table (xai vs mistral vs kawaipilot)
- [ ] Audit findings document

---

### SEMAINE 3: 20-26 février (Integration Development)

**Tâche 1: Créer KiloGatewayAnalyzer**

```bash
# Structurer l'analyse en classes
cd ~/magnus_13_3
cat > gateway-analyzer-findings.md << 'EOF'
# Kilo Gateway Analysis Results

## Routing Algorithm
- Default: Round-robin
- Deterministic: YES (no Math.random found)
- Models supported: [xai, mistral, kawaipilot, ...]
- Fallback chain: [primary, secondary, tertiary]

## Cache Layer
- Storage: Redis
- TTL default: 3600s
- Session persistence: YES
- Key pattern: session:{sessionId}:{model}

## Model Adapters
### XAI
- Temperature: 0.7
- TopP: 0.9
- Context: 8192
- Specialty: Reasoning & explanation

### Mistral
- Temperature: 0.7
- TopP: 0.9
- Context: 4096
- Specialty: Efficiency & multilingual

### Kawaipilot
- Temperature: 0.5
- TopP: 0.85
- Context: 2048
- Specialty: Testing & validation
EOF
```

**Tâche 2: Mettre à jour KiloIntegrationAdapterV2**

```bash
# Tester les analyzers
node << 'EOF'
import KiloIntegrationAdapterV2 from './kilo-integration-adapter-v2.js';

const kilo = new KiloIntegrationAdapterV2({
  kiloSourcePath: '/home/claude/kilo-org-sources'
});

await kilo.initialize();

// Test 1: Analyze routing
const routing = await kilo.kiloAdapter.analyzeRoutingLogic();
console.log('Routing:', routing);

// Test 2: Analyze cache
const cache = await kilo.kiloAdapter.analyzeCachingLayer();
console.log('Cache:', cache);

// Test 3: Get optimal params
const params = await kilo.optimizeParametersFromSource();
console.log('Optimized params:', params);
EOF
```

**Tâche 3: Créer BlocConvergenceEngine**

```bash
# Tester l'analyse de blocs
node << 'EOF'
import BlocConvergenceEngine from './bloc-convergence-engine.js';

const engine = new BlocConvergenceEngine(null, null);

const testCode = `
function getData() {
  try {
    const result = fetch('/api/data');
    if (!result) throw new Error('No data');
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
`;

const blocs = engine.identifyBlocs(testCode);
console.log('Identified blocs:', blocs);

const analysis = await engine.analyzeBloc(blocs[0], {});
console.log('Bloc analysis:', analysis);
EOF
```

**Checklist semaine 3:**
- [ ] KiloGatewayAnalyzer fully tested
- [ ] KiloIntegrationAdapterV2 initializes correctly
- [ ] BlocConvergenceEngine identifies and analyzes blocs
- [ ] Integration tests pass

---

### SEMAINE 4: 27-28 février (Magnus 13.3 Beta)

**Tâche 1: Intégrer dans Magnus 13.3 main**

```javascript
// Dans magnus-13-3-main.js, vérifier:

const magnus = new Magnus133({
  orchestratorName: 'Serigne',
  kiloSourcePath: '/home/claude/kilo-org-sources',
  kiloConfig: {
    sourcePath: './kilo-org-sources',
    auditLevel: 'PRODUCTION',
    convergenceAware: true
  }
});

await magnus.initialize();

// Test 1: Analyze request
const analysis = await magnus.analyze('Build a REST API for my app');
console.log(analysis.recommendation);

// Test 2: Start generation
const generation = await magnus.startGeneration(analysis);
console.log(generation.sessionId);

// Test 3: Validate convergence
const validation = await magnus.validateConvergence(
  generation.sessionId,
  generatedCode,
  developerFeedback
);
console.log(validation.outcome);
```

**Tâche 2: Beta testing avec des cas réels**

```
Test cases:
1. Simple request (clarity ≥ 80, complexity ≤ 3)
   → Expected: FAST_TRACK strategy, CONVERGED
   
2. Moderate request (clarity 70-80, complexity 4-6)
   → Expected: QUALITY_FIRST strategy, validation via Kilo
   
3. Complex request (clarity < 70, complexity > 6)
   → Expected: CLARIFY or DECOMPOSE, audit recommandations
```

---

## MARS-AVRIL 2026: Production & Contributions

### Mars 1-14: Testing & Refinement

```bash
# Test suite
npm test magnus-13-3

# Coverage report
npm coverage

# Performance benchmarks
npm run benchmark:kilo-integration
npm run benchmark:bloc-convergence
```

### Mars 15-21: Bloc Engine Finalization

Finaliser les heuristiques pour:
- Recognition score calculation
- Inevitability assessment
- Coherence scoring

### Mars 22-28: First Convergence-Driven Generation

```javascript
// Exemple d'utilisation réelle

const analysis = await magnus.analyze(
  'Build a comprehensive user authentication system'
);

// Kilo audit
await magnus.auditKiloSource();

const generation = await magnus.startGeneration(analysis, {
  strategy: { name: 'QUALITY_FIRST' },
  agents: analysis.agents
});

// Générer le code...
const generatedCode = await generateCodeViaAPI(...);

// Valider via Bloc Engine
const validation = await magnus.validateConvergence(
  generation.sessionId,
  generatedCode,
  developerFeedback
);

// Enregistrer learnings
await magnus.recordConvergenceOutcome(
  generation.sessionId,
  validation,
  'APPROVED'
);
```

### Avril 1+: Kilo Contributions

**Contribution 1: Convergence-Driven Model Router**

```javascript
// PR pour Kilo
// Title: "Convergence-driven model allocation for better code generation"
// 
// Problem: Current routing is cost/latency optimized, not convergence optimized
// Solution: New routing strategy that allocates models based on:
//   - Recognition phase: Use xai (best for clarity)
//   - Inevitability phase: Use mistral (best for logic)
//   - Coherence phase: Use kawaipilot (best for testing)

const proposal = await magnus.proposeKiloContribution('ROUTING_ENHANCEMENT', {
  title: 'Convergence-driven model allocation',
  description: '...',
  targetRepository: 'kilo-gateway',
  targetComponent: 'routing/convergence-router.js',
  convergencePattern: 'three-phase-model-allocation',
  efficiency: 'Improves convergence scores by 15-25%',
  estimatedCredits: 150
});
```

**Contribution 2: Session State Tracing**

```javascript
// PR pour Kilo Cloud
// Title: "Session state tracing for convergence analysis"
//
// Allows tracking the convergence score progression through a session

const proposal = await magnus.proposeKiloContribution('STATE_TRACING', {
  title: 'Convergence progression tracking',
  targetRepository: 'kilo-cloud',
  targetComponent: 'session-manager/convergence-tracing.js',
  efficiency: 'Enables post-mortem convergence analysis',
  estimatedCredits: 200
});
```

**Contribution 3: Educational Data Privacy**

```javascript
// PR pour Kilo Cloud
// Title: "RGPD-compliant educational institution support"
//
// For use in educational settings (like AESH), ensures no data persistence

const proposal = await magnus.proposeKiloContribution('EDUCATION_SUPPORT', {
  title: 'RGPD-compliant data handling for educational institutions',
  targetRepository: 'kilo-cloud',
  targetComponent: 'compliance/education-privacy.js',
  robustnessGain: 'Enables educational market adoption',
  estimatedCredits: 300  // Major feature
});
```

---

## Implementation Checklist

### Phase 1: Source Analysis (Week 1-2)
- [ ] Clone Kilo repositories
- [ ] Document routing algorithm
- [ ] Document cache configuration
- [ ] Profile each model adapter
- [ ] Create audit findings document

### Phase 2: Development (Week 3-4)
- [ ] Implement KiloGatewayAnalyzer
- [ ] Implement KiloIntegrationAdapterV2
- [ ] Implement BlocConvergenceEngine
- [ ] Unit tests for each component
- [ ] Integration tests

### Phase 3: Magnus Integration (Week 4)
- [ ] Update Magnus133 main class
- [ ] Integrate Bloc Engine into validateConvergence
- [ ] Audit & Trust tracking
- [ ] Beta testing with real requests

### Phase 4: Production (Mars)
- [ ] Performance optimization
- [ ] Bloc Engine heuristic refinement
- [ ] Production deployment
- [ ] Monitoring setup

### Phase 5: Contributions (Avril)
- [ ] Submit convergence-router PR
- [ ] Submit state-tracing PR
- [ ] Submit education-privacy PR
- [ ] Earn credits & recognition

---

## Success Metrics

### By end of Février
```
✓ Kilo source fully analyzed
✓ Magnus 13.3 beta functional
✓ Bloc convergence accuracy ≥ 70%
```

### By end of Mars
```
✓ Kilo integration production-ready
✓ Bloc convergence accuracy ≥ 85%
✓ Trust score system fully operational
```

### By end of Avril
```
✓ 3+ PRs merged to Kilo
✓ €600+ credits earned
✓ Community recognition (potential Amsterdam trip)
✓ Magnus 13.3 production release
```

---

## Debugging Guide

### Issue: KiloGatewayAnalyzer can't find source files
```bash
# Check paths
ls -la ~/kilo-org-sources/
ls -la ~/kilo-org-sources/kilo-gateway/

# Verify paths in config
grep kiloSourcePath config.js
```

### Issue: Bloc identification too aggressive/conservative
```javascript
// Adjust thresholds in BlocConvergenceEngine
const BLOC_START_THRESHOLD = 5;  // min lines for a bloc
const BLOC_END_THRESHOLD = 3;    // min lines to close

// Or adjust regex patterns in isBlocStart()
```

### Issue: Trust score too low
```javascript
// Check discrepancies
const report = await magnus.auditKiloSource();
console.log(report.discrepancies);

// If expected behavior differs from actual:
// 1. Update expected behavior
// 2. Or adjust discrepancy severity weights
```

---

## Files Reference

```
/home/claude/
├── MAGNUS_13_3_INTEGRATION_ARCHITECTURE.md  ← Main architecture doc
├── magnus-13-3-main.js                      ← Main orchestrator
├── kilo-integration-adapter-v2.js            ← Kilo integration
├── bloc-convergence-engine.js                ← Bloc analysis
├── gateway-analyzer-findings.md              ← Audit results
├── test/
│   ├── test-kilo-integration.js
│   ├── test-bloc-convergence.js
│   └── test-magnus-13-3.js
├── examples/
│   ├── example-api-generation.js
│   ├── example-contribution-proposal.js
│   └── example-convergence-validation.js
└── .magnus/
    ├── knowledge/                           ← Learning database
    ├── sessions/                            ← Session history
    └── audits/                              ← Audit reports
```

---

## Quick Start Command

```bash
# 1. Setup
git clone kilo repos into ~/kilo-org-sources

# 2. Initialize Magnus
node << 'EOF'
import Magnus133 from './magnus-13-3-main.js';

const magnus = new Magnus133({
  orchestratorName: 'Serigne',
  kiloSourcePath: './kilo-org-sources'
});

await magnus.initialize();
console.log('✓ Magnus 13.3 ready');
EOF

# 3. Analyze and generate
node magnus-cli.js analyze "your request here"

# 4. Propose contribution
node magnus-cli.js contribute --type ROUTING_ENHANCEMENT ...
```

---

*Document créé par Serigne DIAGNE*
*Magnus 13.3 Integration Guide*
*Dernière mise à jour: 3 février 2026*
