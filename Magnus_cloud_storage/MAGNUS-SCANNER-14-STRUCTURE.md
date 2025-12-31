# Magnus Scanner 14.0 - File Structure & Organization

## 📁 RECOMMENDED DIRECTORY STRUCTURE

```
magnus-scanner-14/
├── README.md                           # Main documentation
├── package.json                        # NPM configuration
├── .gitignore                         # Git ignore rules
│
├── src/                               # Source code
│   ├── core/                          # Core detection engines
│   │   ├── pattern-detector.js        ✅ (650 lines, 21 KB)
│   │   ├── friction-detector.js       ✅ (540 lines, 16 KB)
│   │   ├── abandonment-detector.js    ✅ (640 lines, 23 KB)
│   │   └── confidence-scorer.js       ✅ (470 lines, 18 KB)
│   │
│   ├── bias/                          # Bias detection & mitigation
│   │   └── bias-detector.js           ⚠️  (needs recreation - 470 lines)
│   │
│   ├── scanner/                       # Main scanner orchestrator
│   │   └── magnus-scanner.js          🔲 (TODO - 500 lines)
│   │
│   ├── integration/                   # Magnus 13 integration
│   │   └── magnus-14.js               🔲 (TODO - 300 lines)
│   │
│   ├── cli/                           # Command-line interface
│   │   ├── magnus-scanner-cli.js      🔲 (TODO - 200 lines)
│   │   └── commands/                  # CLI command handlers
│   │       ├── scan.js
│   │       ├── report.js
│   │       ├── explain.js
│   │       ├── generate.js
│   │       └── watch.js
│   │
│   ├── reporting/                     # Report generation
│   │   ├── report-generator.js        🔲 (TODO - 300 lines)
│   │   └── templates/
│   │       ├── html-template.js
│   │       ├── markdown-template.js
│   │       └── json-template.js
│   │
│   └── utils/                         # Utility functions
│       ├── file-utils.js
│       ├── git-utils.js
│       └── format-utils.js
│
├── examples/                          # Usage examples
│   ├── basic-scan.js
│   ├── multi-project-scan.js
│   └── custom-config.js
│
├── test/                              # Tests
│   ├── pattern-detector.test.js
│   ├── friction-detector.test.js
│   ├── abandonment-detector.test.js
│   └── confidence-scorer.test.js
│
├── docs/                              # Documentation
│   ├── API.md                         # API documentation
│   ├── CONFIGURATION.md               # Configuration guide
│   ├── EXAMPLES.md                    # Real-world examples
│   └── ARCHITECTURE.md                # Architecture overview
│
└── data/                              # Scanner data storage
    ├── scans/                         # Scan results
    ├── reports/                       # Generated reports
    └── history/                       # Learning history
```

---

## 📦 CURRENT FILES LOCATION

**All detector files are currently in:**
```
/mnt/user-data/outputs/
```

**Files created:**
```
✅ pattern-detector.js       (21 KB, 650 lines)
✅ friction-detector.js       (16 KB, 540 lines)
✅ abandonment-detector.js    (23 KB, 640 lines)
✅ confidence-scorer.js       (18 KB, 470 lines)
```

**Missing files:**
```
⚠️  bias-detector.js          (needs recreation from previous session)
🔲 magnus-scanner.js          (TODO - main orchestrator)
🔲 magnus-14.js               (TODO - Magnus 13 integration)
🔲 magnus-scanner-cli.js      (TODO - CLI interface)
🔲 report-generator.js        (TODO - reporting)
```

---

## 🎯 RECOMMENDED SETUP STEPS

### Step 1: Create Project Directory
```bash
mkdir -p ~/magnus-scanner-14
cd ~/magnus-scanner-14

# Create subdirectories
mkdir -p src/core
mkdir -p src/bias
mkdir -p src/scanner
mkdir -p src/integration
mkdir -p src/cli/commands
mkdir -p src/reporting/templates
mkdir -p src/utils
mkdir -p examples
mkdir -p test
mkdir -p docs
mkdir -p data/{scans,reports,history}
```

### Step 2: Move Detector Files
```bash
# Move files from /mnt/user-data/outputs to src/core/
cp /mnt/user-data/outputs/pattern-detector.js src/core/
cp /mnt/user-data/outputs/friction-detector.js src/core/
cp /mnt/user-data/outputs/abandonment-detector.js src/core/
cp /mnt/user-data/outputs/confidence-scorer.js src/core/
```

### Step 3: Initialize NPM Project
```bash
npm init -y

# Install dependencies
npm install commander chalk ora cli-table3
npm install --save-dev jest @types/node
```

### Step 4: Create package.json scripts
```json
{
  "name": "magnus-scanner-14",
  "version": "1.0.0",
  "description": "Magnus Scanner 14.0 - Proactive pattern detection and friction analysis",
  "main": "src/scanner/magnus-scanner.js",
  "bin": {
    "magnus-scanner": "./src/cli/magnus-scanner-cli.js"
  },
  "scripts": {
    "scan": "node src/cli/magnus-scanner-cli.js scan",
    "report": "node src/cli/magnus-scanner-cli.js report",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "keywords": [
    "code-analysis",
    "pattern-detection",
    "friction-detection",
    "project-scanner"
  ],
  "author": "Serigne",
  "license": "MIT"
}
```

---

## 🔧 FILE DEPENDENCIES

### Import Chain
```javascript
// MagnusScanner imports all detectors
magnus-scanner.js
  ├── pattern-detector.js
  ├── friction-detector.js
  ├── abandonment-detector.js
  ├── confidence-scorer.js
  └── bias-detector.js

// Magnus14 extends Magnus13 and uses MagnusScanner
magnus-14.js
  ├── magnus-13-extended.js (from previous work)
  └── magnus-scanner.js

// CLI uses Magnus14
magnus-scanner-cli.js
  └── magnus-14.js

// ReportGenerator uses output from MagnusScanner
report-generator.js
  └── magnus-scanner.js results
```

---

## 📝 USAGE WORKFLOW

### 1. Basic Scan
```javascript
import MagnusScanner from './src/scanner/magnus-scanner.js';

const scanner = new MagnusScanner();

const results = await scanner.scan([
  '/path/to/project1',
  '/path/to/project2'
]);

console.log(results);
```

### 2. With Magnus 14 Integration
```javascript
import Magnus14 from './src/integration/magnus-14.js';

const magnus = new Magnus14();
await magnus.initialize();

// Scan projects
const scanResults = await magnus.scan([...projects]);

// Get recommendations
const recommendations = magnus.getRecommendations(scanResults);

// Generate code if needed
if (recommendations.shouldGenerate) {
  await magnus.generate(recommendations.pattern);
}
```

### 3. Via CLI
```bash
# Scan projects
magnus-scanner scan ~/projects

# Generate report
magnus-scanner report --format html --output ./report.html

# Explain a pattern
magnus-scanner explain --pattern "express-setup"

# Generate from pattern
magnus-scanner generate --from-pattern "api-route-handler"

# Watch for changes
magnus-scanner watch ~/projects
```

---

## 🎨 FILE RELATIONSHIPS

```
┌─────────────────────────────────────────────────────────────┐
│                     CLI Layer                                │
│  magnus-scanner-cli.js                                      │
│  (User commands: scan, report, explain, generate)          │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│              Integration Layer                               │
│  magnus-14.js                                               │
│  (Extends Magnus 13, adds proactive scanning)              │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│              Scanner Layer                                   │
│  magnus-scanner.js                                          │
│  (Orchestrates all detectors, generates insights)          │
└───┬────────┬──────────┬──────────┬─────────┬───────────────┘
    │        │          │          │         │
┌───▼───┐┌──▼───┐┌─────▼──┐┌─────▼──┐┌────▼────┐
│Pattern││Friction││Abandon││Confidence││  Bias  │
│Detector││Detector││Detector││  Scorer  ││Detector│
└───────┘└───────┘└────────┘└─────────┘└─────────┘
   │        │         │           │          │
   └────────┴─────────┴───────────┴──────────┘
                       │
              ┌────────▼──────────┐
              │  Report Generator  │
              │  (HTML/MD/JSON)   │
              └───────────────────┘
```

---

## 💾 DATA FLOW

```
1. User runs: magnus-scanner scan ~/projects

2. CLI → Magnus14 → MagnusScanner → All Detectors

3. Detectors return raw results

4. ConfidenceScorer scores all results

5. BiasDetector checks for false positives

6. MagnusScanner aggregates and prioritizes

7. ReportGenerator creates output

8. Results saved to: data/scans/scan-[timestamp].json

9. Report saved to: data/reports/report-[timestamp].html
```

---

## 🔄 INTEGRATION WITH EXISTING MAGNUS

### Magnus 13 Extended Integration
```javascript
// Magnus 14 extends Magnus 13 Extended
import Magnus13Extended from './magnus-13-extended.js';
import MagnusScanner from './scanner/magnus-scanner.js';

class Magnus14 extends Magnus13Extended {
  constructor(config) {
    super(config);
    
    // Add scanner
    this.scanner = new MagnusScanner({
      biasDetector: config.biasDetector
    });
  }

  // Override analyze to include scanning
  async analyze(request, options = {}) {
    // First, do normal Magnus 13 analysis
    const analysis = await super.analyze(request, options);

    // Then, if project paths provided, scan for patterns
    if (options.scanProjects) {
      const scanResults = await this.scanner.scan(options.scanProjects);
      
      // Add scan insights to analysis
      analysis.scanInsights = {
        patterns: scanResults.patterns,
        friction: scanResults.friction,
        recommendations: scanResults.recommendations
      };
    }

    return analysis;
  }
}
```

---

## 📊 CURRENT PROGRESS

**Completed: 4/9 core modules (44%)**

✅ PatternDetector (650 lines)
✅ FrictionDetector (540 lines)
✅ AbandonmentDetector (640 lines)
✅ ConfidenceScorer (470 lines)

**TODO: 5 modules remaining**

🔲 BiasDetector (470 lines) - needs recreation
🔲 MagnusScanner (500 lines) - main orchestrator
🔲 Magnus14 (300 lines) - integration layer
🔲 CLI (200 lines) - command interface
🔲 ReportGenerator (300 lines) - output formatting

**Total lines written: 2,300+ / ~5,200 target (44%)**

---

## 🎯 NEXT STEPS RECOMMENDATION

**Option A: Complete Core First**
1. Recreate BiasDetector (from previous session notes)
2. Create MagnusScanner (orchestrates everything)
3. Test the core system end-to-end

**Option B: Make it Usable Now**
1. Create basic CLI (without full features)
2. Create simple ReportGenerator
3. Can scan immediately, add features later

**Option C: Integration First**
1. Create Magnus14 integration
2. Test with Magnus 13 workflow
3. Add CLI/reports after validation

---

## 💡 RECOMMENDED WORKFLOW

I recommend **Option A** - complete the core first:

1. **Recreate BiasDetector** (I have the specs from earlier)
2. **Create MagnusScanner** (ties everything together)
3. **Test on real projects** (your actual code!)
4. **Then add CLI/Reports** (user-facing layer)

This ensures the foundation is solid before building UI.

**Ready to continue?** 🚀
