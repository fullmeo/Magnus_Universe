# STARTING THE MAGNUS SYSTEM 🚀

## Complete Setup & Launch Guide

---

## System Components

You have **two main ways** to interact with Magnus 14:

### 1. **Magnus 14 CLI** (Interactive Terminal)
- Direct command-line interface
- Project analysis & management
- Outcome recording
- Accuracy metrics viewing

### 2. **Magnus Dashboard** (Web Interface)
- Real-time visualization
- WebSocket live updates
- RESTful API endpoints
- Pattern visualization

---

## Part 1: Running Magnus 14 CLI

### **Quick Start**

```bash
# Navigate to root directory
cd C:\Users\diase\OneDrive\Bureau\Magnus_13_universe

# Run Magnus 14 CLI
node magnus/magnus-14/cli.js
```

### **What You See**

```
══════════════════════════════════════════════════════════════════════
║ Magnus 14 - Transcendental Signature Framework                       ║
║ Version 14.0.0 | 2025-12-13T10:03:21.707Z                            ║
══════════════════════════════════════════════════════════════════════

╔════════════════════════════════════════════════════════════════╗
║         MAGNUS 14 INTERACTIVE PROJECT ANALYZER                ║
║                                                                ║
║  Your Signature Operating System for Complex Projects        ║
╚════════════════════════════════════════════════════════════════╝

MAIN MENU
──────────────────────────────────────────────────────────────────
1. 🆕  Analyze a new project
2. 📊 View previous analysis
3. 📈 Record project outcome (update predictions)
4. 📈 View prediction accuracy metrics
5. 🚪 Exit

Select option (1-5):
```

### **Available Actions**

#### **Option 1: Analyze a New Project** 🆕
```
Provide:
├─ Project Name
├─ Domain (music, ai, web, consciousness, blockchain, other)
├─ Description
├─ Current Clarity Level (0-100)
├─ Estimated Complexity (1-10)
├─ Components (name + complexity)
├─ Blockers (description + severity)
├─ Team Size
└─ Timeline

Output:
├─ Spiral Analysis (3-5 spirals needed, timing)
├─ Domain Analysis (domain vs technical blocker)
├─ POC Analysis (critical assumptions)
├─ Integration Analysis (1.75x multiplier)
├─ Side Project Analysis (blockers → side projects)
├─ Framework Analysis (emerging frameworks)
└─ Final Estimate (total months + confidence)
```

#### **Option 2: View Previous Analysis** 📊
```
Shows the Claude Code Framework analysis:
├─ Project ID: proj_claude_code_framework_1765618892622
├─ All 6 engine analyses
├─ Final estimate: 14.5 months, 86% confidence
└─ Detailed recommendations
```

#### **Option 3: Record Project Outcome** 📈
```
Input actual project results:
├─ Project ID (which project to record for)
├─ Actual Spiral Count (how many spirals happened)
├─ Actual Integration Complexity (1-10)
├─ Actual Duration (months)

Output:
├─ Accuracy calculations
├─ Learning extracted
├─ Parameter adjustments
└─ Recommendations for improvement
```

#### **Option 4: View Accuracy Metrics** 📈
```
Shows current prediction accuracy:
├─ Average accuracy across all projects
├─ Per-project breakdown
├─ Domain-specific accuracy
├─ Learning readiness (Initial/Learning/Proficient/Expert)
└─ Parameter adjustments made
```

#### **Option 5: Exit** 🚪
```
Closes Magnus 14 CLI gracefully
```

---

## Part 2: Running Magnus Dashboard Server

### **Start the Dashboard**

```bash
# Navigate to root directory
cd C:\Users\diase\OneDrive\Bureau\Magnus_13_universe

# Start the dashboard server
node magnus-dashboard/server/index.js
```

### **What Happens**

```
╔═══════════════════════════════════════════════════════════╗
║         MAGNUS DASHBOARD 15.3 - STARTING             ║
╚═══════════════════════════════════════════════════════════╝

🧠 Initializing Magnus 13...
🧠 Initializing Magnus 14...
✅ Magnus 14 initialized successfully

╔═══════════════════════════════════════════════════════════╗
║         MAGNUS DASHBOARD 15.3 - RUNNING               ║
╚═══════════════════════════════════════════════════════════╝

🌐 Dashboard URL: http://localhost:3000
📡 API Endpoint: http://localhost:3000/api
🔌 WebSocket: ws://localhost:3000

✅ Server ready
```

### **Access Points**

After starting the dashboard:

1. **Web Dashboard**: http://localhost:3000
2. **API Endpoints**: http://localhost:3000/api
3. **Magnus 14 API**: http://localhost:3000/api/magnus14
4. **WebSocket**: ws://localhost:3000

### **API Endpoints Available**

```
GET  /api/health                    → Server health
GET  /api/patterns                  → All patterns
GET  /api/patterns/:id              → Specific pattern
GET  /api/scans                     → Scan results
GET  /api/statistics                → Overall statistics

GET  /api/magnus14/status           → Magnus 14 status
POST /api/magnus14/analyze          → Analyze new project
GET  /api/magnus14/projects         → List all projects
GET  /api/magnus14/projects/:id     → Get project analysis
GET  /api/magnus14/outcomes/:id     → Get project outcome
POST /api/magnus14/outcomes/:id     → Record outcome
GET  /api/magnus14/accuracy         → Prediction accuracy
GET  /api/magnus14/domains          → Learned domains
GET  /api/magnus14/learning         → Learning statistics
GET  /api/magnus14/report/:id       → Full report
```

---

## Part 3: Typical Workflow

### **Scenario: Analyze a New Project**

**Step 1: Start Magnus 14 CLI**
```bash
cd C:\Users\diase\OneDrive\Bureau\Magnus_13_universe
node magnus/magnus-14/cli.js
```

**Step 2: Select Option 1 (Analyze New Project)**
```
Select option (1-5): 1
```

**Step 3: Provide Project Details**
```
Project name: My AI System
Domain: ai
Description: Real-time ML inference engine for music analysis
Current clarity level: 55
Estimated complexity: 7
...
```

**Step 4: Get Analysis**
Magnus 14 returns:
- Spiral clarification: 4 spirals, 4-5 months
- Domain analysis: Domain is primary blocker
- POC analysis: ML accuracy assumption needs validation
- Integration: 1.75x multiplier applies
- Final estimate: 12 months, 86% confidence

**Step 5: Execute Project**
(You work on the project for ~12 months)

**Step 6: Record Outcome**
```
Select option (1-5): 3
Project ID: proj_my_ai_system_1765618892622
Actual spirals: 4
Actual complexity: 9
Actual duration: 11 months
```

**Step 7: Check Learning**
```
Select option (1-5): 4
```

View how accurately Magnus 14 predicted this project.

---

## Part 4: Dashboard Server Usage

### **Real-Time Project Monitoring**

Once dashboard is running, you can:

1. **Analyze Project via API**
```bash
curl -X POST http://localhost:3000/api/magnus14/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "New Project",
    "domain": "blockchain",
    "description": "Real-time dapp",
    "currentClarity": 50,
    "estimatedComplexity": 8
  }'
```

2. **Get Project Status**
```bash
curl http://localhost:3000/api/magnus14/status
```

3. **View Accuracy Metrics**
```bash
curl http://localhost:3000/api/magnus14/accuracy
```

4. **Record Outcome via API**
```bash
curl -X POST http://localhost:3000/api/magnus14/outcomes/proj_id \
  -H "Content-Type: application/json" \
  -d '{
    "actualSpiralCount": 4,
    "actualIntegrationComplexity": 9,
    "actualDurationMonths": 12
  }'
```

---

## Part 5: File Locations

### **Project Storage**
```
magnus/magnus-14/storage/
├── proj_claude_code_framework_1765618892622.json
├── proj_my_project_[timestamp].json
└── outcome_proj_id_[timestamp].json
```

### **Documentation**
```
Root directory:
├── MAGNUS_14_DEEP_DIVE.md              (Complete guide)
├── MAGNUS_14_QUICK_REFERENCE.md        (Quick lookup)
├── MAGNUS_14_VISUAL_GUIDE.md           (Diagrams)
├── MAGNUS_14_INDEX.md                  (Navigation)
└── START_MAGNUS_SYSTEM.md              (This file)
```

### **Source Code**
```
magnus/magnus-14/
├── magnus-14-core.js                   (Orchestrator)
├── cli.js                              (CLI tool)
├── engines/                            (6 engines)
│   ├── spiral-clarification-engine.js
│   ├── domain-first-analyzer.js
│   ├── poc-validator-engine.js
│   ├── integration-complexity-predictor.js
│   ├── side-project-resolver-engine.js
│   └── framework-evolution-engine.js
└── learning/
    └── prediction-improver.js          (Learning system)

magnus-dashboard/server/
├── dashboard-server.js                 (Main server)
├── magnus-14-integration.js            (Dashboard bridge)
├── magnus-14-api-routes.js            (API endpoints)
└── index.js                            (Entry point)
```

---

## Part 6: Troubleshooting

### **CLI Won't Start**

**Problem**: Module not found error
```
Error: Cannot find module 'magnus/magnus-14/cli.js'
```

**Solution**: Make sure you're in the root directory
```bash
cd C:\Users\diase\OneDrive\Bureau\Magnus_13_universe
node magnus/magnus-14/cli.js  # ✅ Correct
```

### **Dashboard Server Port Already in Use**

**Problem**: Port 3000 is occupied
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**: Use a different port
```bash
PORT=3001 node magnus-dashboard/server/index.js
```

Or kill the existing process:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID [PID_NUMBER] /F
```

### **Projects Not Showing**

**Problem**: No projects in storage
```
Error: No projects found
```

**Solution**: Analyze a new project first
```
Select option (1-5): 1
(follow prompts to analyze)
```

---

## Part 7: Workflows

### **Workflow 1: Quick Analysis**
```
1. Start CLI: node magnus/magnus-14/cli.js
2. Option 1: Analyze new project
3. Get instant predictions
4. Exit
```
**Time**: 5-10 minutes

### **Workflow 2: Full Project Lifecycle**
```
1. Start CLI: Analyze new project
2. (Execute project: 3-12 months)
3. Start CLI: Record outcome
4. View accuracy metrics
5. Next project gets refined predictions
```
**Time**: 3-12 months + 10 minutes setup

### **Workflow 3: Dashboard Monitoring**
```
1. Start dashboard: node magnus-dashboard/server/index.js
2. Analyze projects via API
3. Monitor in real-time via WebSocket
4. Record outcomes via API
5. Track accuracy improvement
```
**Time**: Continuous operation

### **Workflow 4: Complete System**
```
1. Terminal 1: Start Magnus 14 CLI
2. Terminal 2: Start Dashboard Server
3. Use CLI for analysis
4. Use Dashboard for visualization
5. Use API for programmatic access
```
**Time**: Parallel operation

---

## Part 8: Quick Commands Reference

### **Magnus 14 CLI**
```bash
# Start CLI (interactive)
node magnus/magnus-14/cli.js

# Select options in menu
1 = Analyze new project
2 = View previous analysis
3 = Record outcome
4 = View accuracy metrics
5 = Exit
```

### **Dashboard Server**
```bash
# Start server (runs continuously)
node magnus-dashboard/server/index.js

# Different port
PORT=3001 node magnus-dashboard/server/index.js

# Stop server
Ctrl+C (graceful shutdown)
```

### **API Calls**
```bash
# Test server
curl http://localhost:3000/api/health

# Analyze project
curl -X POST http://localhost:3000/api/magnus14/analyze \
  -H "Content-Type: application/json" \
  -d '{...}'

# Check status
curl http://localhost:3000/api/magnus14/status
```

---

## Part 9: Next Steps

### **To Get Started**

1. **Try CLI Analysis**
   ```bash
   cd C:\Users\diase\OneDrive\Bureau\Magnus_13_universe
   node magnus/magnus-14/cli.js
   # Select option 2 to view Claude Code Framework analysis
   ```

2. **Understand the System**
   - Read: MAGNUS_14_DEEP_DIVE.md
   - Reference: MAGNUS_14_QUICK_REFERENCE.md
   - Visualize: MAGNUS_14_VISUAL_GUIDE.md

3. **Analyze Your Own Project**
   ```bash
   node magnus/magnus-14/cli.js
   # Select option 1 and follow prompts
   ```

4. **Run Dashboard for Visualization**
   ```bash
   # In another terminal
   node magnus-dashboard/server/index.js
   ```

5. **Record Outcomes to Improve Accuracy**
   ```bash
   node magnus/magnus-14/cli.js
   # Select option 3 after project completes
   ```

---

## Part 10: Support & Documentation

### **Files to Reference**

| File | Purpose |
|------|---------|
| MAGNUS_14_DEEP_DIVE.md | Complete system explanation |
| MAGNUS_14_QUICK_REFERENCE.md | Fast lookup tables |
| MAGNUS_14_VISUAL_GUIDE.md | ASCII diagrams |
| MAGNUS_14_INDEX.md | Master index |
| START_MAGNUS_SYSTEM.md | This file |

### **Key Concepts**

- **Spirals**: How many clarification rounds needed
- **Domain First**: Domain > Technical blocker
- **POC**: Validate assumptions before commitment
- **Integration**: 1.75x multiplier (your signature)
- **Side Projects**: Resolve blockers at 3-4 session mark
- **Framework**: Emerges from complex projects

---

## Summary

**Magnus 14 provides two interfaces:**

✅ **CLI** - Interactive terminal for analysis
✅ **Dashboard** - Web interface with API

**Typical usage:**
1. Analyze project with CLI or API
2. Get predictions from 6 engines
3. Execute project
4. Record actual outcomes
5. Learning system refines predictions
6. Next similar project has better estimates

**Your accuracy improves with each project** → By project 10: 95%+ accuracy 🎯

---

**Ready to use Magnus 14?**

```bash
cd C:\Users\diase\OneDrive\Bureau\Magnus_13_universe
node magnus/magnus-14/cli.js
```

🚀 **Let's analyze some projects!** 🧠✨

