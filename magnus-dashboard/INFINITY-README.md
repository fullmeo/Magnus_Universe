# Magnus ∞ (Infinity) - Self-Improving AI System

## Quick Start

```bash
# Test the system
npm run infinity:test

# Launch with default config (core only, no dashboard/API)
npm run infinity

# Launch with full ecosystem (dashboard + API)
npm run infinity:full

# Launch and auto-start the ∞ Loop
npm run infinity:auto

# Direct launch
node run-infinity.js
```

## What is Magnus ∞?

**Magnus ∞** is a self-improving AI system that learns, decides, improves, and explains itself while remaining under human oversight. It implements a continuous **∞ Loop** of:

```
Observe → Learn → Decide → Validate → Act → Explain → Improve → [LOOP]
```

### Key Features

✅ **Self-Improving** - Learns from every interaction and improves autonomously
✅ **Transparent** - Explains every decision in detail
✅ **Safe** - 7-layer safeguard system with armed kill switch
✅ **Supervised** - Requires human approval in supervised mode
✅ **Auditable** - Complete event logging and decision tracking
✅ **Modular** - Scanner, Dashboard, API, Cloud Sync (all optional)

## Architecture

```
┌────────────────────────────────────────┐
│     MAGNUS ∞ INFINITY CORE             │
│  Self-Improving Meta-Developer AI      │
└────────────────────────────────────────┘
         ↓
    ∞ LOOP ENGINE
    ↓         ↓         ↓         ↓
  Learning  Decision Safeguard Transparency
  Engine    Engine   System    Layer
    ↓         ↓         ↓         ↓
    └─────────┬─────────┘
              │
    ┌─────────┼──────────┐
    ↓         ↓          ↓
  Scanner  Dashboard   API
  (Magnus14)(Optional) (Optional)
    ↓         ↓         ↓
  Pattern   Real-time  REST
  Detection Monitoring Endpoints
```

## System Components

### 1. Magnus 14 Scanner ✅
- **Status**: Ready (with fallback mock)
- **Purpose**: Detects code patterns, friction points, quality issues
- **Source**: Integrated from Magnus Scanner 14
- **File**: `magnus-14.js`

### 2. Learning Engine ✅
- **Status**: Initialized
- **Purpose**: Processes observations and updates knowledge
- **Capabilities**: Pattern recognition, learning curves, memory
- **File**: `magnus-infinity-core.js`

### 3. Decision Engine ✅
- **Status**: Ready
- **Purpose**: Makes autonomous decisions with confidence scoring
- **Capabilities**: Decision evaluation, confidence thresholds, approval requests
- **File**: `magnus-infinity-core.js`

### 4. Transparency Layer ✅
- **Status**: Active
- **Purpose**: Explains all decisions and reasoning
- **Levels**: basic, detailed, complete
- **File**: `magnus-infinity-core.js`

### 5. Safeguard System ✅
- **Status**: Armed
- **Layers**: 7 protection levels
- **Features**: Input validation, risk assessment, ethical constraints, resource limits, rollback capability, audit trail, kill switch
- **File**: `magnus-infinity-core.js`

### 6. Dashboard (Optional) 🎨
- **Port**: 3000
- **Features**: Real-time monitoring, WebSocket updates, visual analytics
- **Enable**: `ENABLE_DASHBOARD=true`
- **File**: `dashboard-server.js`

### 7. API (Optional) 🔌
- **Port**: 4000
- **Features**: REST endpoints for integration, authentication, rate limiting
- **Enable**: `ENABLE_API=true`
- **File**: `magnus-api.js`

### 8. Cloud Sync (Optional) ☁️
- **Status**: Disabled (requires CloudZero endpoint)
- **Features**: Remote backup, cross-device sync
- **Enable**: Set `CLOUDZERO_ENDPOINT` and `CLOUDZERO_API_KEY`
- **File**: `magnus-cloud-sync.js`

## Running the System

### Option 1: Minimal Core (Recommended for Testing)
```bash
npm run infinity:test
# or
env ENABLE_DASHBOARD=false ENABLE_API=false AUTO_START=false node run-infinity.js
```

**Output:**
- ✅ Magnus 14 Scanner ready
- ✅ Learning Engine initialized
- ✅ Decision Engine ready
- ✅ Safeguards armed
- System waits for manual `start()` command

### Option 2: Core Only (Default)
```bash
npm run infinity
# or
node run-infinity.js
```

**Features:**
- No web servers (ports 3000/4000 stay free)
- No auto-start (manual control)
- Full core functionality

### Option 3: Full Ecosystem (with Dashboard & API)
```bash
npm run infinity:full
# or
env ENABLE_DASHBOARD=true ENABLE_API=true node run-infinity.js
```

**Features:**
- Dashboard: http://localhost:3000
- API: http://localhost:4000
- Real-time monitoring
- REST integration

### Option 4: Auto-Start Loop
```bash
npm run infinity:auto
# or
env AUTO_START=true node run-infinity.js
```

**Features:**
- Automatically starts ∞ Loop after 3 seconds
- Press Ctrl+C to stop gracefully
- No dashboard/API overhead

## Configuration

### Environment Variables

```bash
# User identification
export USER=serigne
export AUTONOMY_LEVEL=supervised         # supervised, semi-autonomous, autonomous

# Components
export ENABLE_DASHBOARD=true             # true/false
export ENABLE_API=true                   # true/false
export ENABLE_SCANNER=true               # true/false
export ENABLE_CLOUD_SYNC=false           # requires CloudZero endpoint

# Ports
export DASHBOARD_PORT=3000               # custom port for dashboard
export API_PORT=4000                     # custom port for API

# Learning Configuration
export LEARNING_RATE=0.1                 # 0.0-1.0
export CONFIDENCE_THRESHOLD=0.7          # 0.0-1.0

# CloudZero Integration (optional)
export CLOUDZERO_ENDPOINT=https://api.cloudzero.com
export CLOUDZERO_API_KEY=your-api-key

# Auto-Start
export AUTO_START=false                  # true to auto-start ∞ Loop
export AUTONOMY_LEVEL=supervised         # safety first
```

### Launcher Configuration Example

```javascript
import launchInfinity from './infinity-launcher.js';

const system = await launchInfinity({
  userId: 'serigne',
  autonomyLevel: 'supervised',           // Human approval required
  enableScanner: true,                   // Pattern detection
  enableCloudSync: false,                // Remote backup
  enableDashboard: true,                 // Web UI
  enableAPI: true,                       // REST API
  dashboardPort: 3000,
  apiPort: 4000,
  learningRate: 0.1,                     // Speed of learning
  confidenceThreshold: 0.7,              // Decision confidence minimum
  enableSelfImprovement: true,           // Allow improvements
  enableSafeguards: true,                // Enable protection
  explainabilityLevel: 'detailed'        // Explanation detail
});
```

## The ∞ Loop Phases

### Phase 1: Observe 👁️
- Gather patterns from codebase
- Monitor performance metrics
- Analyze user feedback
- Identify opportunities

### Phase 2: Learn 🧠
- Process observations
- Update knowledge base
- Recognize patterns
- Calculate confidence scores

### Phase 3: Decide 🤔
- Evaluate improvements
- Generate solutions
- Score alternatives
- Select best action

### Phase 4: Validate 🛡️
- Check 7-layer safeguards
- Verify ethical constraints
- Assess risk level
- Check kill switch

### Phase 5: Act ⚡
- Request human approval (if supervised)
- Execute approved actions
- Apply improvements
- Monitor results

### Phase 6: Explain 📝
- Log all decisions
- Justify improvements
- Document changes
- Provide transparency

### Phase 7: Improve 📈
- Analyze results
- Update metrics
- Refine algorithms
- Return to Observe

## Autonomy Modes

### Supervised (Recommended) 🛡️
```bash
AUTONOMY_LEVEL=supervised npm run infinity
```
- AI makes decisions
- Requires human approval for significant changes
- All actions logged
- Kill switch armed
- **Best for:** Testing, development, production

### Semi-Autonomous ⚠️
```bash
AUTONOMY_LEVEL=semi-autonomous npm run infinity
```
- AI executes low-risk improvements
- Logs all actions for review
- Human can override
- Kill switch armed
- **Best for:** Optimized production with oversight

### Autonomous 🔴
```bash
AUTONOMY_LEVEL=autonomous npm run infinity
```
- AI makes all decisions without approval
- Complete transparency via logs
- All safeguards active
- Kill switch armed
- **Use with caution**

## Safety Features

### 7-Layer Safeguard System

1. **Input Validation** - Verify data integrity
2. **Risk Assessment** - Evaluate impact potential
3. **Ethical Constraints** - Check ethical boundaries
4. **Resource Limits** - Prevent resource exhaustion
5. **Rollback Capability** - Prepare undo operations
6. **Audit Trail** - Log all actions
7. **Kill Switch** - Emergency shutdown (always armed)

### Kill Switch

The kill switch is **always armed** and can be triggered by:

```bash
# Manual trigger from terminal
Ctrl+C

# Automatic triggers
- Critical errors
- Safeguard violations
- Resource exhaustion
- Security breaches
```

## Monitoring the System

### Command Line Monitoring

```javascript
// Get system status
const status = system.infinity.getStatus();
console.log(status);
// Output:
// {
//   initialized: true,
//   running: true,
//   cycleCount: 42,
//   metrics: {
//     totalDecisions: 156,
//     autonomousDecisions: 120,
//     humanOverrides: 8,
//     safeguardBlocks: 12,
//     improvementsMade: 34,
//     successRate: 0.95
//   }
// }
```

### Real-Time Events

```javascript
system.infinity.on('cycle-start', (cycle) => {
  console.log(`♾️  Cycle ${cycle.number} starting`);
});

system.infinity.on('cycle-complete', (cycle) => {
  console.log(`✅ Cycle ${cycle.number} completed in ${cycle.duration}ms`);
});

system.infinity.on('improvement', (improvement) => {
  console.log(`📈 Improvement: ${improvement.type}`);
});

system.infinity.on('safeguard-block', (event) => {
  console.log(`🛡️  Blocked: ${event.reason}`);
});

system.infinity.on('kill-switch', (event) => {
  console.log(`🔴 KILL SWITCH: ${event.reason}`);
});
```

### Dashboard Monitoring (if enabled)

Access the real-time dashboard at **http://localhost:3000** when running with `ENABLE_DASHBOARD=true`:

- Live cycle counter
- Real-time metrics
- Event stream
- Performance charts
- Improvement logs
- Decision history

### API Monitoring (if enabled)

Query the REST API at **http://localhost:4000** endpoints:

- `GET /api/health` - Server health
- `GET /api/magnus` - System status
- `POST /api/process` - Analyze code
- `GET /api/patterns` - Detected patterns
- `GET /api/statistics` - Usage stats

## Usage Examples

### Example 1: Test and Verify
```bash
npm run infinity:test
```
Expected output: System initializes, all components ready, no auto-start

### Example 2: Run with Monitoring
```bash
ENABLE_DASHBOARD=true npm run infinity
# Open browser: http://localhost:3000
```
Expected: Dashboard loads with real-time updates

### Example 3: Start the Loop
```bash
npm run infinity

# In Node REPL:
> await system.infinity.start()
# System begins ∞ Loop (watch console for cycle messages)

> await system.infinity.stop()
# System stops gracefully
```

### Example 4: Scan Code
```bash
npm run infinity

# In Node REPL:
> const results = await system.magnus14.scan(['/path/to/code'])
> console.log(results)
```

### Example 5: Auto-Run
```bash
npm run infinity:auto
# Automatically starts ∞ Loop after 3 seconds
# System runs until Ctrl+C
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port
lsof -i :3000
kill -9 <PID>

# Or use different port
DASHBOARD_PORT=3001 npm run infinity:full
```

### Scanner Not Found
```bash
# System automatically uses mock implementation
# To use full scanner:
# 1. Ensure C:\Users\diase\magnus-scanner-14 exists
# 2. System will auto-load from that location
```

### CloudZero Not Available
```bash
# Cloud Sync is optional - system works without it
# To disable explicitly:
ENABLE_CLOUD_SYNC=false npm run infinity
```

### Kill Switch Triggered
```bash
# System has emergency shutdown
# Check console for reason
# Fix the issue and restart:
npm run infinity
```

## File Structure

```
magnus-dashboard/
├── run-infinity.js              # Main launcher script
├── infinity-launcher.js         # System orchestrator
├── magnus-infinity-core.js      # Core AI engine (18KB)
├── magnus-14.js                 # Scanner wrapper (3.6K)
├── magnus-api.js                # REST API (20K)
├── magnus-cloud-sync.js         # Cloud integration (6.2K)
├── dashboard-server.js          # Web server
├── test-infinity.js             # Test suite
├── INFINITY-LAUNCH-GUIDE.md     # Detailed guide
├── INFINITY-README.md           # This file
├── package.json                 # npm scripts
└── public/
    └── index.html               # Web dashboard
```

## Performance

- **Initialization**: ~2-3 seconds
- **Cycle Duration**: 1-5 seconds (depending on operations)
- **Memory Footprint**: 50-100MB baseline
- **CPU Usage**: Low idle, increases during analysis
- **Dashboard Refresh**: 60 FPS WebSocket updates

## Next Steps

1. **Start Simple**: `npm run infinity:test`
2. **Explore Components**: Review the source code
3. **Add Dashboard**: `npm run infinity:full`
4. **Start the Loop**: Call `system.infinity.start()`
5. **Monitor Events**: Watch console output

## Support

- **Documentation**: See `INFINITY-LAUNCH-GUIDE.md`
- **Test Script**: `npm run infinity:test`
- **Dashboard**: http://localhost:3000 (when enabled)
- **API Docs**: http://localhost:4000 (when enabled)

## License

MIT

---

**Magnus ∞ - Self-Improving AI with Transparency and Safety** 🔮✨♾️

*Remember: Every cycle is an opportunity to learn, improve, and explain. The system remains under human oversight with armed safeguards at all times.*
