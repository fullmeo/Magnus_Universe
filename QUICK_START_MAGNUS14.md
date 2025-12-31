# Magnus 14 - Quick Start Guide
**Last Updated**: 2025-12-13
**Status**: ✅ **FULLY OPERATIONAL**

---

## What is Magnus 14?

Magnus 14 is a **6-engine project analysis framework** that predicts:
- How many decision-making spirals your project needs
- Technical vs domain blockers
- Integration complexity multipliers
- POC requirements and risk validation
- Timeline estimates with confidence levels

**Current Projects Analyzed**:
1. Claude Code Framework
2. Fuzzy Oracle MVP

---

## Quick Access

### 🖥️ View Dashboard
```
http://localhost:3333
```
Real-time project analysis, statistics, and WebSocket updates.

### 📡 Access REST API
```
Base URL: http://localhost:3333/api/magnus14
```

### 💻 Use CLI
```bash
cd Magnus_13_universe
node magnus/magnus-14/cli.js
```

---

## Common Tasks

### 📊 View Existing Project Analysis

#### Via CLI
```bash
node magnus/magnus-14/cli.js
→ Select Option 2 (View previous analysis)
→ Select project
→ Full report displays
```

#### Via API
```bash
# List all projects
curl http://localhost:3333/api/magnus14/projects

# Get specific project
curl http://localhost:3333/api/magnus14/projects/proj_fuzzy_oracle_mvp_1765640343312

# Generate report
curl http://localhost:3333/api/magnus14/report/proj_fuzzy_oracle_mvp_1765640343312
```

### 🆕 Analyze New Project

#### Via CLI
```bash
node magnus/magnus-14/cli.js
→ Select Option 1 (Analyze new project)
→ Answer questions:
   - Project name
   - Domain
   - Description
   - Current clarity (0-100)
   - Estimated complexity (1-10)
   - Components (comma-separated names)
   - Blockers (comma-separated)
→ Report generates automatically
```

#### Via API
```bash
curl -X POST http://localhost:3333/api/magnus14/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "My Project",
    "domain": "ai",
    "description": "My project description",
    "currentClarity": 50,
    "estimatedComplexity": 7,
    "components": [
      {"name": "component1", "complexity": 8},
      {"name": "component2", "complexity": 6}
    ],
    "blockers": [],
    "teamSize": 3,
    "timeline": "flexible"
  }'
```

### 📈 Record Project Outcome (After Completion)

After your project finishes, record the actual results to improve Magnus 14's accuracy:

#### Via CLI
```bash
node magnus/magnus-14/cli.js
→ Select Option 3 (Record project outcome)
→ Enter Project ID
→ Answer questions about actual results
→ Accuracy metrics display
```

#### Via API
```bash
curl -X POST http://localhost:3333/api/magnus14/outcomes/proj_fuzzy_oracle_mvp_1765640343312 \
  -H "Content-Type: application/json" \
  -d '{
    "actualSpiralCount": 3,
    "actualIntegrationComplexity": 9,
    "actualDurationMonths": 15,
    "actualClarityTime": "4 months",
    "actualBreakthroughSession": 2,
    "breakthroughWasCorrect": true,
    "actualDomainBlocker": "technical",
    "finalClarity": 95
  }'
```

### 📊 View Accuracy Metrics

See how well Magnus 14 predicts after recording outcomes:

#### Via CLI
```bash
node magnus/magnus-14/cli.js
→ Select Option 4 (View prediction accuracy)
→ Displays: Average accuracy, improvement trend, comparisons
```

#### Via API
```bash
curl http://localhost:3333/api/magnus14/accuracy
```

---

## Understanding the Analysis

### The 6 Engines Explained

#### 1. 🌀 Spiral Clarification Engine
Predicts how many decision-making cycles you need:
- **Spiral 1**: Understand the problem surface
- **Spiral 2**: Learn domain vocabulary
- **Spiral 3**: Map pedagogy (how to teach others)

**Your Metric**: Expected spiral count (typically 2-4)

#### 2. 🎯 Domain-First Analyzer
Identifies whether your blocker is DOMAIN or TECHNICAL:
- Domain blocker: Need to understand the field
- Technical blocker: Need to validate architecture
- Ratio tells you how one dominates

**Your Metrics**: Domain complexity, Technical complexity, Real blocker ratio

#### 3. ⚡ POC Validator Engine
Determines critical assumptions that need validation:
- Identifies HIGH/MEDIUM/LOW risk assumptions
- Recommends POC scope and duration
- Estimates confidence gain per POC

**Your Metrics**: Assumptions to validate, POC duration, confidence multiplier

#### 4. 🔧 Integration Complexity
Predicts integration challenges (hardest part!):
- Components can be built independently
- Integration reveals hidden coupling
- You'll likely UNDERESTIMATE this

**Your Metrics**: Integration complexity (1-10), Underestimation warning

#### 5. 🚀 Side Project Resolver
Determines if you need side projects:
- Deep dives into specific challenges
- Can unblock main project
- Helpful when main project stalls

**Your Metrics**: Expected side projects, trigger conditions

#### 6. 🌱 Framework Evolution Engine
Predicts how your approach will evolve:
- New frameworks emerge during project
- Better understanding of domain
- Patterns across multiple projects

**Your Metrics**: Emerging framework, evolution trigger

---

## Reading Your Results

### Duration Estimate
```
Total: 14.5 months @ 86% confidence

Breakdown:
- Clarity spirals: 3.5 months
- POC validation: 1 month
- Integration: 10 months

Interpretation:
- Likely range: 12-17 months
- 86% confidence = pretty good
- 95%+ means high certainty
```

### Spiral Progression
```
Spiral 1: 69% clarity (1.5-2.2 weeks)
  Focus: problem_surface

Spiral 2: 83% clarity (2.5-3.4 weeks) ← Breakthrough expected here
  Focus: domain_vocabulary

Spiral 3: 97% clarity (3.5-4.6 weeks)
  Focus: pedagogy_mapping

Interpretation:
- You'll need ~3 major clarification rounds
- Session 2 is likely when "aha moment" happens
- Final spiral brings domain mastery
```

### Integration Multiplier
```
Components: 6 average complexity 6.5/10
Integration Complexity: 10/10
Multiplier: ×1.75
Underestimation: 54%

Interpretation:
- Integration is HARDEST part
- You'll likely underestimate by 54%
- If you estimate 6 weeks integration, plan for 9+ weeks
```

### Critical Assumptions
```
1. Is blockchain necessary vs database?
   Risk: HIGH
   Validation: Build latency POC

2. Can we detect patterns in behavior?
   Risk: HIGH
   Validation: Test on sample data

Interpretation:
- These 2 assumptions are make-or-break
- Each POC might take 1 week
- Validating reduces risk by 60%
```

---

## Current Projects

### Project 1: Claude Code Framework
```
ID: proj_claude_code_framework_1765618892622
Domain: blockchain, consciousness
Components: 1
Duration: 14.5 months @ 86%
Real Blocker: Technical
```

**View**:
- CLI: `node magnus/magnus-14/cli.js` → Option 2
- API: `/api/magnus14/projects/proj_claude_code_framework_1765618892622`

### Project 2: Fuzzy Oracle MVP
```
ID: proj_fuzzy_oracle_mvp_1765640343312
Domain: blockchain
Components: 6
Duration: 14.5 months @ 86%
Real Blocker: Technical
```

**View**:
- CLI: `node magnus/magnus-14/cli.js` → Option 2
- API: `/api/magnus14/projects/proj_fuzzy_oracle_mvp_1765640343312`

---

## System Health

### Check Dashboard Status
```bash
curl http://localhost:3333/api/health
```

### Check Magnus 14 Status
```bash
curl http://localhost:3333/api/magnus14/status
```

### Restart Dashboard
```bash
pm2 restart magnus-dashboard
```

### View Logs
```bash
pm2 logs magnus-dashboard
pm2 logs magnus-dashboard --lines 50  # Last 50 lines
```

---

## File Locations

```
Magnus_13_universe/
├── magnus/
│   └── magnus-14/
│       ├── magnus-14-core.js          ← Main framework
│       ├── cli.js                     ← CLI interface
│       ├── storage/                   ← Saved projects
│       │   ├── proj_claude_code_*.json
│       │   └── proj_fuzzy_oracle_*.json
│       └── engines/
│           ├── spiral-clarification-engine.js
│           ├── domain-first-analyzer.js
│           ├── poc-validator-engine.js
│           ├── integration-complexity-predictor.js
│           ├── side-project-resolver-engine.js
│           └── framework-evolution-engine.js
├── magnus-dashboard/
│   └── server/
│       ├── dashboard-server.js        ← Main server
│       ├── magnus-14-integration.js   ← API integration
│       └── magnus-14-api-routes.js    ← REST endpoints
└── pm2-ecosystem.json                 ← Process config
```

---

## Troubleshooting

### "Project not found"
- Verify project ID is correct
- Check `magnus/magnus-14/storage/` directory
- Try listing projects: `/api/magnus14/projects`

### API not responding
```bash
# Check if running
pm2 list

# Restart if needed
pm2 restart magnus-dashboard

# View logs
pm2 logs magnus-dashboard
```

### Report won't generate
- Ensure project is fully analyzed (not partial)
- Check for errors: `pm2 logs magnus-dashboard`
- Try retrieving project data first via API

### Storage not loading
- Verify `storageDir` is passed to Magnus14 constructor
- Check file exists: `ls magnus/magnus-14/storage/`
- Ensure permissions allow file read

---

## API Reference

### List All Projects
```
GET /api/magnus14/projects
Returns: [{ projectId, projectName, domain, timestamp }, ...]
```

### Get Project Details
```
GET /api/magnus14/projects/{projectId}
Returns: Complete analysis with all 6 engine results
```

### Analyze New Project
```
POST /api/magnus14/analyze
Body: { projectName, domain, description, ... }
Returns: { success, projectId, analysis }
```

### Get Full Report
```
GET /api/magnus14/report/{projectId}
Returns: Formatted text report for printing/viewing
```

### Record Outcome
```
POST /api/magnus14/outcomes/{projectId}
Body: { actualSpiralCount, actualDurationMonths, ... }
Returns: { success, accuracy, learnings }
```

### Get Accuracy Metrics
```
GET /api/magnus14/accuracy
Returns: { avgSpiralAccuracy, avgIntegrationAccuracy, ... }
```

### Get Learning Stats
```
GET /api/magnus14/learning
Returns: { projectsAnalyzed, outcomesRecorded, learnings }
```

### System Status
```
GET /api/magnus14/status
Returns: { initialized, version, projectsCount, ... }
```

---

## Key Numbers to Remember

### Spiral Timing
- Typical duration: 3-4 spirals
- Time per spiral: 1-2 months
- Total clarity phase: 3-4 months

### Integration Reality
- Components built 70% of time
- Integration consumes 30-50% extra
- You'll underestimate by 30-50%

### POC Value
- Removes 60% of risk
- Takes 1-2 weeks usually
- Can save months later

### Confidence Levels
- 70-80%: Good baseline
- 80-90%: Strong prediction
- 90%+: High certainty
- <70%: High uncertainty, need more clarity

---

## Quick Examples

### Analyze blockchain oracle project
```bash
curl -X POST http://localhost:3333/api/magnus14/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Price Oracle",
    "domain": "blockchain",
    "description": "Decentralized price oracle with multi-chain support",
    "currentClarity": 60,
    "estimatedComplexity": 8,
    "components": [
      {"name": "smart-contract", "complexity": 8},
      {"name": "oracle-nodes", "complexity": 7},
      {"name": "price-aggregation", "complexity": 6}
    ],
    "blockers": [],
    "teamSize": 2
  }'
```

### After 15 months, record actual results
```bash
curl -X POST http://localhost:3333/api/magnus14/outcomes/proj_price_oracle_1234567890 \
  -H "Content-Type: application/json" \
  -d '{
    "actualSpiralCount": 3,
    "actualIntegrationComplexity": 9,
    "actualDurationMonths": 16,
    "actualClarityTime": "4 months",
    "actualBreakthroughSession": 2,
    "breakthroughWasCorrect": true,
    "actualDomainBlocker": "technical",
    "finalClarity": 92
  }'
```

### Compare prediction vs reality
```bash
curl http://localhost:3333/api/magnus14/accuracy

# Returns: Spiral accuracy 87%, Integration accuracy 91%, Duration 85%
```

---

## Next Steps

1. **View existing analyses** (Fuzzy Oracle, Claude Code Framework)
2. **Understand the 6 engines** and what they predict
3. **Analyze your own project** using the framework
4. **Track as you execute** - record actual outcomes
5. **Improve Magnus 14** - with real data from your project
6. **Validate predictions** - compare estimated vs actual after 14+ months

---

**Magnus 14 is your Signature Operating System for Complex Projects** ✨

Use it to understand your projects before building them.
