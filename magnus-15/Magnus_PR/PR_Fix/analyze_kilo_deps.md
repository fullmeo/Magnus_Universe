# ANALYSE DES DÉPENDANCES MANQUANTES - PR#5718

## 1. LES FICHIERS REVERTÉS

D'après le commit revert `7e4f03c`, les fichiers supprimés étaient :

```
src/gateway/router/convergence/
├── convergence-scorer.ts         (702 lignes)
├── magnus-opus-loop.ts           (558 lignes)
├── magnus-pattern-engine.ts      (614 lignes)
└── scorer-magnus-15.ts           (386 lignes)
```

**Message d'erreur du revert :**
> "Remove convergence/ directory (PR Kilo-Org#5718 - **missing util/types dependencies**)"

---

## 2. DÉPENDANCES PROBABLES MANQUANTES

Basé sur les noms de fichiers et la structure Kilo, voici les imports manquants probables :

### A. `convergence-scorer.ts` (702 lignes)
**Imports probables :**
```typescript
import { CodeMetrics, ComplexityScore } from '@/util/types';
import { ConvergenceReport, ScoringResult } from '@/util/types';
import { LLMResponse, TokenUsage } from '@/util/types';
```

**Fichiers dépendants manquants :**
- ❌ `src/util/types/code-metrics.ts`
- ❌ `src/util/types/convergence-report.ts`
- ❌ `src/util/types/llm-types.ts`

### B. `magnus-opus-loop.ts` (558 lignes)
**Imports probables :**
```typescript
import { OpusLoopState, FeedbackCycle } from '@/util/types';
import { ReviewResult, RefinementStrategy } from '@/util/types';
```

**Fichiers dépendants manquants :**
- ❌ `src/util/types/opus-loop.ts`
- ❌ `src/util/types/feedback.ts`

### C. `magnus-pattern-engine.ts` (614 lignes)
**Imports probables :**
```typescript
import { CodePattern, PatternDetectionResult } from '@/util/types';
import { QualityMetric, PatternScore } from '@/util/types';
```

**Fichiers dépendants manquants :**
- ❌ `src/util/types/patterns.ts`
- ❌ `src/util/types/metrics.ts`

### D. `scorer-magnus-15.ts` (386 lignes)
**Imports probables :**
```typescript
import { MagnusScore, ConvergenceOutcome } from '@/util/types';
import { RecognitionScore, InevitabilityScore, CoherenceScore } from '@/util/types';
```

**Fichiers dépendants manquants :**
- ❌ `src/util/types/magnus-scores.ts`

---

## 3. FICHIERS DE CONFIGURATION

Le revert a aussi supprimé :

```
config/
├── convergence-routing.yaml      (344 lignes) ← Dépendances YAML
└── magnus-15-patterns.yaml       (391 lignes) ← Dépendances YAML
```

**Problèmes :**
- Loaders YAML manquants ?
- Validation schemas manquants ?

---

## 4. STRUCTURE ESTIMÉE DE `src/util/types/`

Voici ce qui **devrait exister** dans Kilo mais n'existe pas :

```
src/util/types/
├── index.ts                              (exports centralisés)
├── code-metrics.ts
│   └── export interface CodeMetrics {
│       complexity: number;
│       lines: number;
│       cyclomaticComplexity: number;
│       maintainabilityIndex: number;
│     }
├── convergence-report.ts
│   └── export interface ConvergenceReport {
│       sessionId: string;
│       intentAnalysis: IntentAnalysis;
│       recognitionScore: number;
│       inevitabilityScore: number;
│       coherenceScore: number;
│       outcome: 'CONVERGED' | 'PARTIAL' | 'FAILED';
│     }
├── magnus-scores.ts
│   └── export type MagnusScore = {
│       recognition: number;   // 0-100
│       inevitability: number; // 0-100
│       coherence: number;     // 0-100
│     }
├── patterns.ts
│   └── export enum CodePattern {
│       COMPLEXITY_SPIRAL = 'COMPLEXITY_SPIRAL',
│       VALIDATION_GAPS = 'VALIDATION_GAPS',
│       DOMAIN_FIRST = 'DOMAIN_FIRST',
│       // ... 10 patterns total
│     }
├── opus-loop.ts
│   └── export interface OpusLoopState {
│       iteration: number;
│       feedback: string;
│       score: number;
│       status: 'ACTIVE' | 'CONVERGED' | 'FAILED';
│     }
├── feedback.ts
│   └── export interface FeedbackCycle {
│       developerFeedback: string;
│       agentRefinement: string;
│       metrics: MagnusScore;
│     }
└── llm-types.ts
    └── export interface LLMResponse {
        content: string;
        tokenUsage: { input: number; output: number };
        model: string;
      }
```

---

## 5. PROBABLE ROOT CAUSE

Le revert note : **"missing util/types dependencies"**

Cela signifie probablement :

❌ **Scénario 1** (le plus probable) :
- Vous avez écrit `convergence-scorer.ts` qui importe `@/util/types/convergence-report`
- Ce fichier n'existe PAS dans le repo Kilo
- Vous aviez oublié de l'ajouter à la PR
- À la merge, TypeScript compile et échoue
- Revert automatique

❌ **Scénario 2** :
- Le fichier existe mais pas exporté depuis `src/util/types/index.ts`
- Les imports échouent au runtime

❌ **Scénario 3** :
- Dépendance circulaire entre convergence/ et util/types/
- Build échoue

---

## 6. ACTION REQUISE POUR FIX

### Step 1 : Identifiez les erreurs exactes
```bash
cd Kilo-Org/kilocode
git checkout feat/convergence-aware-routing-magnus-15
npm run build 2>&1 | tee build-errors.log
# → Capture les erreurs TypeScript
```

### Step 2 : Pour chaque erreur, créez le fichier manquant
```bash
# Exemple : si erreur "Cannot find module '@/util/types/convergence-report'"
touch src/util/types/convergence-report.ts
# Puis définissez les types
```

### Step 3 : Validez les imports
```typescript
// src/util/types/index.ts
export * from './code-metrics';
export * from './convergence-report';
export * from './magnus-scores';
export * from './patterns';
export * from './opus-loop';
export * from './feedback';
export * from './llm-types';
```

### Step 4 : Re-build
```bash
npm run build
# → Devrait compiler proprement
```

### Step 5 : Re-test
```bash
npm test -- --testPathPattern="convergence"
npm run test:patterns
npm run test:routing
```

### Step 6 : Re-merge
```bash
git push origin feat/convergence-aware-routing-magnus-15
# → Créer PR, merge
```

---

## 7. INTÉGRATION AVEC T1-D

**Important :** Avant de re-merger, assurez-vous que :

✅ `src/util/types/convergence-report.ts` inclut les champs T1-D :
```typescript
export interface ConvergenceReport {
  // Existing fields
  intentAnalysis: IntentAnalysis;
  
  // NEW T1-D fields (from your empirical validation)
  clarity: number;           // 0-100
  entropy: number;           // Shannon entropy
  divergenceRisk: number;    // P(diverge | k)
  
  // T1-D calibration
  gamma: number;             // 0.034 (Sonnet-level)
  C: number;                 // 0.093 (baseline)
  
  // Recognition/Inevitability/Coherence
  recognitionScore: number;
  inevitabilityScore: number;
  coherenceScore: number;
  
  outcome: 'CONVERGED' | 'PARTIAL' | 'FAILED';
}
```

✅ `convergence-scorer.ts` utilise la formule T1-D :
```typescript
const divergenceRisk = 0.093 * Math.exp(-0.034 * (clarity - 70));
```

---

## RÉSUMÉ

**Le problème :** Fichiers de types manquants dans `src/util/types/`

**La solution :** 
1. Identifier les types exacts nécessaires
2. Créer les fichiers `.ts` manquants
3. Exporter depuis `index.ts`
4. Re-compiler & tester
5. Re-merger

**Timeline :** 2-3 heures de travail

**Criticité :** HAUTE (bloque le lancement Feb 24)

