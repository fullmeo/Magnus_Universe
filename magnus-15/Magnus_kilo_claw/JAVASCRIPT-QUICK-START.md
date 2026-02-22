# 🚀 MAGNUS 15 JAVASCRIPT - QUICK START

**Status**: Ready to code Feb 14, 2026  
**Timeline**: 5 days (Feb 14-18)  
**Goal**: Feature-parity with Python, npm-ready  

---

## 📋 SETUP (10 minutes)

### 1. Create Project Directory
```bash
mkdir magnus-convergence-validator-js
cd magnus-convergence-validator-js

# Initialize git
git init
git remote add origin https://github.com/Kilo-Org/magnus-convergence-validator.git
```

### 2. Copy Configuration Files
Copy these from `/outputs/`:
- `package.json`
- `tsconfig.json`
- `jest.config.js`
- `.eslintrc.json`
- `.gitignore`

### 3. Install Dependencies
```bash
npm install
```

**Output**: All packages installed, ready to code.

---

## 🏗️ CREATE PROJECT STRUCTURE

```bash
# Create directories
mkdir -p src/{analyzers,validators,types}
mkdir -p tests/__tests__
mkdir -p examples/{simple-api,over-engineered,incomplete}

# Create empty starter files
touch src/index.ts
touch src/cli.ts
touch src/convergence-validator.ts
touch src/types.ts
touch src/analyzers/{constraint-parser,code-analyzer,llm-judge}.ts
touch src/validators/{recognition,inevitability,coherence}.ts
touch tests/__tests__/integration.test.ts
```

---

## 🔥 DAY 1: CORE SETUP (Feb 14 - 2 hours)

### Task 1: Create Types File (`src/types.ts`)

```typescript
export interface CodeMetrics {
  totalLines: number;
  functions: FunctionDef[];
  classes: ClassDef[];
  variables: string[];
  totalUnits: number;
  complexity: number;
  nesting: number;
}

export interface FunctionDef {
  name: string;
  line: number;
  complexity: number;
  nesting: number;
}

export interface ClassDef {
  name: string;
  line: number;
  methods: string[];
}

export interface Constraint {
  text: string;
  type: 'explicit' | 'implicit';
  keywords: string[];
}

export interface ConstraintSet {
  explicit: Constraint[];
  implicit: Constraint[];
  raw: string;
  count: number;
}

export interface PillarScore {
  score: number;
  components: Record<string, number>;
  evidence: Record<string, any>;
}

export interface ConvergenceReport {
  verdict: 'CONVERGED' | 'PARTIAL' | 'NON_CONVERGED';
  scores: {
    recognition: number;
    inevitability: number;
    coherence: number;
  };
  details: {
    recognition: PillarScore;
    inevitability: PillarScore;
    coherence: PillarScore;
  };
  reproducibility: {
    model: string;
    seed: number;
    timestamp: string;
  };
}
```

**Time**: 30 min  
**Deliverable**: Complete type definitions ✅

---

### Task 2: Create Analyzers Skeleton

**src/analyzers/constraint-parser.ts**:
```typescript
import type { Constraint, ConstraintSet } from '../types';

export class ConstraintParser {
  static parse(intentContent: string): ConstraintSet {
    const explicit: Constraint[] = [];
    const implicit: Constraint[] = [];

    const lines = intentContent.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const lower = trimmed.toLowerCase();
      const keywords = this.extractKeywords(trimmed);

      if (/must|required|shall/i.test(lower)) {
        explicit.push({ text: trimmed, type: 'explicit', keywords });
      } else if (/should|prefer|could/i.test(lower)) {
        implicit.push({ text: trimmed, type: 'implicit', keywords });
      }
    }

    return { explicit, implicit, raw: intentContent, count: explicit.length + implicit.length };
  }

  private static extractKeywords(text: string): string[] {
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'is', 'are', 'be',
      'must', 'required', 'shall', 'should', 'could', 'prefer'
    ]);

    const words = text.match(/\b\w+\b/g) || [];
    return words
      .map(w => w.toLowerCase())
      .filter(w => w.length > 3 && !commonWords.has(w));
  }
}
```

**src/analyzers/code-analyzer.ts**:
```typescript
import * as esprima from 'esprima';
import type { CodeMetrics, FunctionDef, ClassDef } from '../types';

export class CodeAnalyzer {
  static analyze(code: string): CodeMetrics {
    try {
      const ast = esprima.parseModule(code, { range: true, tokens: true });
      
      const functions: FunctionDef[] = [];
      const classes: ClassDef[] = [];
      const variables = new Set<string>();

      this.walkAST(ast, (node: any) => {
        if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
          functions.push({
            name: node.id?.name || 'anonymous',
            line: node.loc?.start.line || 0,
            complexity: this.computeComplexity(node),
            nesting: this.computeNesting(node)
          });
        } else if (node.type === 'ClassDeclaration') {
          classes.push({
            name: node.id?.name || 'anonymous',
            line: node.loc?.start.line || 0,
            methods: node.body?.body
              ?.filter((m: any) => m.type === 'MethodDefinition')
              ?.map((m: any) => m.key.name) || []
          });
        } else if (node.type === 'VariableDeclarator' && node.id?.name) {
          variables.add(node.id.name);
        }
      });

      const lines = code.split('\n');
      const avgComplexity = functions.length > 0
        ? functions.reduce((sum, f) => sum + f.complexity, 0) / functions.length
        : 1;

      return {
        totalLines: lines.length,
        functions,
        classes,
        variables: Array.from(variables),
        totalUnits: functions.length + classes.length,
        complexity: avgComplexity,
        nesting: Math.max(...functions.map(f => f.nesting), 0)
      };
    } catch (e) {
      console.warn('Parse error:', e);
      return {
        totalLines: code.split('\n').length,
        functions: [],
        classes: [],
        variables: [],
        totalUnits: 0,
        complexity: 1,
        nesting: 0
      };
    }
  }

  private static computeComplexity(node: any): number {
    let complexity = 1;
    this.walkAST(node, (child: any) => {
      if (['IfStatement', 'ForStatement', 'WhileStatement', 'CatchClause', 'SwitchCase'].includes(child.type)) {
        complexity++;
      } else if (child.type === 'LogicalExpression' && (child.operator === '&&' || child.operator === '||')) {
        complexity++;
      }
    });
    return complexity;
  }

  private static computeNesting(node: any, depth = 0): number {
    let maxDepth = depth;
    this.walkAST(node, (child: any) => {
      if (['IfStatement', 'ForStatement', 'WhileStatement', 'BlockStatement'].includes(child.type)) {
        maxDepth = Math.max(maxDepth, this.computeNesting(child, depth + 1));
      }
    });
    return maxDepth;
  }

  private static walkAST(node: any, callback: (node: any) => void): void {
    callback(node);
    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        if (Array.isArray(node[key])) {
          node[key].forEach((child: any) => this.walkAST(child, callback));
        } else if (node[key].type) {
          this.walkAST(node[key], callback);
        }
      }
    }
  }
}
```

**src/analyzers/llm-judge.ts**:
```typescript
import Anthropic from '@anthropic-ai/sdk';

export class LLMJudge {
  private client: Anthropic;
  private model = 'claude-3-5-sonnet-20241022';

  constructor(apiKey?: string) {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('ANTHROPIC_API_KEY not set');
    this.client = new Anthropic({ apiKey: key });
  }

  async evaluate(prompt: string, maxTokens = 1024): Promise<Record<string, any>> {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: maxTokens,
        temperature: 0,
        system: 'Tu es rigoureux. Réponds SEULEMENT en JSON valide.',
        messages: [{ role: 'user', content: prompt }]
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      return JSON.parse(text);
    } catch (e) {
      console.warn('LLM error:', e);
      return { error: 'llm_failed', fallback: true };
    }
  }
}
```

**Time**: 1.5 hours  
**Deliverable**: All analyzers ready ✅

---

## ✅ BUILD CHECKLIST (Feb 14-18)

### Day 1 (Feb 14)
- [ ] Types file complete
- [ ] All analyzer files created + tested
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors

### Day 2 (Feb 15)
- [ ] Recognition validator complete
- [ ] Unit tests for Recognition
- [ ] `npm test` passes

### Day 3 (Feb 16)
- [ ] Inevitability validator complete
- [ ] Alternative generation working
- [ ] Unit tests passing

### Day 4 (Feb 17)
- [ ] Coherence validator complete
- [ ] Main ConvergenceValidator class done
- [ ] CLI interface working
- [ ] All tests passing

### Day 5 (Feb 18)
- [ ] Full integration test
- [ ] Performance verified (<60s)
- [ ] npm publish ready
- [ ] README + docs complete

---

## 🎯 QUICK COMMANDS

```bash
# Development
npm run build          # Compile TypeScript
npm run dev            # Build + run CLI
npm test               # Run all tests
npm run test:watch    # Watch mode
npm run lint          # Check code

# Publishing (Feb 24)
npm run prepublish    # Final checks
npm publish           # Publish to npm
```

---

## 📊 FEATURES TO BUILD (IN ORDER)

**Week 1 (Feb 14-18)**:
1. ✅ Analyzers (types, constraint parser, code analyzer, LLM judge)
2. ✅ Recognition validator
3. ✅ Inevitability validator
4. ✅ Coherence validator
5. ✅ Main orchestrator class
6. ✅ CLI interface
7. ✅ Unit + integration tests
8. ✅ npm package ready

**Week 2 (Feb 18-24)**:
- Launch with Python version
- Community support
- Bug fixes (if any)
- Prepare Phase 6

---

## 🚀 NEXT STEP

**Start with**: Create types file (`src/types.ts`) today

**Time to first working code**: 1 hour

**Status**: READY TO CODE 🧠

---

**Questions?** Check `JAVASCRIPT-IMPLEMENTATION-GUIDE.md` for detailed specs.

**Ready?** `git init` and start. 🔥
