# INSTRUCTIONS KILO CODE
## Mise à Jour: Magnus 13.2 → 14 avec UI Enrichie

---

## CONTEXTE

Vous avez une TodoList active:
```
* ~~Read existing package.json and magnus-dashboard structure~~
* Review existing Pinokio files (magnus-web-ui.js, pinokio.json, dashboard.html)
* Update magnus-web-ui.js with full Magnus 14 integration
* Update dashboard.html with enhanced UI
* Update pinokio.json with correct configuration
```

**Kilo Code doit exécuter ces tasks.**

---

## TASK 1: Review Existing Pinokio Files

### 1.1: Vérifier magnus-web-ui.js

**Objectif:** Lire le fichier actuel et identifier ce qui doit être amélioré.

```kilo
{
  "action": "read_file",
  "path": "~/pinokio/api/magnus/magnus-web-ui.js",
  "description": "Read current Express server setup"
}
```

**Vérifications à faire:**
- [ ] Express middleware configuré?
- [ ] Routes `/api/analyze`, `/api/generate`, `/api/validate-convergence`?
- [ ] Morgan logging?
- [ ] CORS enabled?
- [ ] Error handling?

---

### 1.2: Vérifier dashboard.html

```kilo
{
  "action": "read_file",
  "path": "~/pinokio/api/magnus/public/dashboard.html",
  "description": "Read current dashboard interface"
}
```

**Vérifications à faire:**
- [ ] Phase 1/2/3 sections?
- [ ] Real-time feedback?
- [ ] Charts/graphs?
- [ ] Session history?
- [ ] Export functionality?

---

### 1.3: Vérifier pinokio.json

```kilo
{
  "action": "read_file",
  "path": "~/pinokio/api/magnus/pinokio.json",
  "description": "Read Pinokio configuration"
}
```

**Vérifications à faire:**
- [ ] Web endpoint correct?
- [ ] Installation commands OK?
- [ ] Environment variables?
- [ ] Port configuration?

---

## TASK 2: Update magnus-web-ui.js (Magnus 14)

### Nouveautés à ajouter:

```javascript
// 1. Enhanced Error Handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: err.message });
});

// 2. Request Logging
import morgan from 'morgan';
app.use(morgan('combined'));

// 3. CORS Support
import cors from 'cors';
app.use(cors());

// 4. NEW: Session Management
const sessions = new Map();

app.post('/api/sessions', (req, res) => {
  const sessionId = uuidv4();
  sessions.set(sessionId, { createdAt: Date.now(), steps: [] });
  res.json({ sessionId });
});

// 5. NEW: History Endpoint
app.get('/api/sessions/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// 6. NEW: Export Endpoint
app.get('/api/export/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  
  const json = JSON.stringify(session, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=session-${req.params.sessionId}.json`);
  res.send(json);
});

// 7. NEW: Metrics Endpoint
app.get('/api/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    sessions: sessions.size,
    timestamp: Date.now()
  });
});
```

### Package.json updates:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "body-parser": "^1.20.2",
    "uuid": "^9.0.0",
    "morgan": "^1.10.0",
    "cors": "^2.8.5"
  }
}
```

---

## TASK 3: Update dashboard.html (Enhanced UI)

### Nouveautés:

```html
<!-- 1. HEADER avec Stats -->
<header>
  <h1>🎼 Magnus 14</h1>
  <div class="stats-header">
    <span>Uptime: <span id="uptime">--</span></span>
    <span>Sessions: <span id="sessionCount">--</span></span>
    <span>Memory: <span id="memory">--</span></span>
  </div>
</header>

<!-- 2. SESSION SELECTOR -->
<div class="session-selector">
  <select id="sessionHistory">
    <option value="">-- New Session --</option>
  </select>
  <button onclick="loadSession()">Load</button>
  <button onclick="exportSession()">📥 Export</button>
</div>

<!-- 3. REAL-TIME CHARTS -->
<div class="charts">
  <canvas id="clarityChart"></canvas>
  <canvas id="complexityChart"></canvas>
</div>

<!-- 4. FEEDBACK HISTORY -->
<div class="history">
  <h3>Session History</h3>
  <div id="timeline"></div>
</div>

<!-- 5. CONSOLE OUTPUT -->
<div class="console">
  <h3>📋 Console</h3>
  <div id="consoleOutput"></div>
</div>
```

### CSS Enhancements:

```css
/* Dark Mode Toggle */
body.dark-mode {
  background: #1e1e1e;
  color: #e0e0e0;
}

/* Charts Container */
.charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}

/* Timeline */
.timeline {
  border-left: 3px solid #667eea;
  padding-left: 20px;
}

.timeline-item {
  margin: 20px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

/* Console */
.console {
  background: #1e1e1e;
  color: #00ff00;
  padding: 15px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  max-height: 300px;
  overflow-y: auto;
}
```

### JavaScript Enhancements:

```javascript
// 1. Real-time Metrics
setInterval(async () => {
  const res = await fetch('/api/metrics');
  const data = await res.json();
  document.getElementById('uptime').textContent = 
    Math.floor(data.uptime) + 's';
  document.getElementById('memory').textContent = 
    (data.memory.heapUsed / 1024 / 1024).toFixed(1) + 'MB';
}, 1000);

// 2. Session History
async function loadSessionHistory() {
  const sessions = await fetch('/api/sessions').then(r => r.json());
  const select = document.getElementById('sessionHistory');
  sessions.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `Session ${s.id.substring(0, 8)} - ${new Date(s.createdAt).toLocaleString()}`;
    select.appendChild(opt);
  });
}

// 3. Export Session
async function exportSession() {
  const sessionId = document.getElementById('sessionHistory').value;
  if (!sessionId) { alert('Select session first'); return; }
  window.location.href = `/api/export/${sessionId}`;
}

// 4. Console Logging
function addLog(message, level = 'info') {
  const console = document.getElementById('consoleOutput');
  const line = document.createElement('div');
  line.className = `log-${level}`;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  console.appendChild(line);
  console.scrollTop = console.scrollHeight;
}

// 5. Chart Integration (Chart.js)
import Chart from 'chart.js/auto';

const clarityChart = new Chart(
  document.getElementById('clarityChart'),
  {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Clarity Score',
        data: [],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)'
      }]
    },
    options: { responsive: true, maintainAspectRatio: true }
  }
);
```

---

## TASK 4: Update pinokio.json

```json
{
  "title": "Magnus 14 - Consciousness Orchestrator",
  "description": "Advanced consciousness-driven development with full integration",
  "author": "Serigne DIAGNE",
  "version": "14.0.0",
  
  "requirements": {
    "memory": "4GB minimum (8GB recommended)",
    "storage": "1GB",
    "node": "18.0.0+"
  },
  
  "install": [
    {
      "run": "npm install",
      "path": "."
    },
    {
      "run": "mkdir -p .magnus/{knowledge,sessions,exports,logs}",
      "path": "."
    },
    {
      "run": "npm run build",
      "path": "."
    }
  ],
  
  "run": [
    {
      "cmd": "npm start",
      "path": ".",
      "env": {
        "NODE_ENV": "production",
        "PORT": "3001",
        "LOG_LEVEL": "info"
      }
    }
  ],
  
  "web": [
    {
      "url": "http://localhost:3001/dashboard.html",
      "name": "Magnus Dashboard",
      "description": "Main consciousness orchestration interface"
    },
    {
      "url": "http://localhost:3001/api/metrics",
      "name": "Metrics API",
      "description": "Real-time system metrics"
    }
  ],
  
  "logs": [
    ".magnus/logs/magnus.log"
  ],
  
  "about": {
    "name": "Magnus 14",
    "description": "A consciousness-driven development framework that orchestrates AI-assisted coding through structured analysis, convergence validation, and continuous learning.",
    "links": {
      "documentation": "https://github.com/serigne/Magnus",
      "repository": "https://github.com/serigne/Magnus_14_universe"
    }
  }
}
```

---

## TASK 5: Package.json Updates

```json
{
  "name": "magnus-14",
  "version": "14.0.0",
  "description": "Consciousness-driven development framework - v14",
  "author": "Serigne DIAGNE",
  "type": "module",
  "main": "magnus-14-main-orchestrator.js",
  "scripts": {
    "start": "node magnus-web-ui.js",
    "dev": "node --watch magnus-web-ui.js",
    "build": "echo 'Build process would go here'",
    "test": "echo 'Tests would go here'",
    "logs": "tail -f .magnus/logs/magnus.log"
  },
  "dependencies": {
    "express": "^4.18.2",
    "body-parser": "^1.20.2",
    "uuid": "^9.0.0",
    "morgan": "^1.10.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {},
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## KILO CODE EXECUTION PLAN

### Phase 1: Review (10 min)

```
Step 1: Read magnus-web-ui.js
  └─ Report what's there, what's missing
  
Step 2: Read dashboard.html
  └─ Report current state
  
Step 3: Read pinokio.json
  └─ Report configuration
```

### Phase 2: Update (30 min)

```
Step 4: Update magnus-web-ui.js
  ├─ Add Morgan logging
  ├─ Add CORS support
  ├─ Add session management
  ├─ Add metrics endpoints
  └─ Test connectivity

Step 5: Update dashboard.html
  ├─ Add stats header
  ├─ Add session selector
  ├─ Add charts (Chart.js)
  ├─ Add console output
  └─ Add export button

Step 6: Update pinokio.json
  └─ New structure, new endpoints
```

### Phase 3: Verification (10 min)

```
Step 7: Test endpoints
  ├─ GET /health
  ├─ POST /api/analyze
  ├─ GET /api/metrics
  └─ GET /api/export/{sessionId}

Step 8: Verify UI
  ├─ Dashboard loads
  ├─ Real-time stats update
  ├─ Charts render
  └─ Export works
```

---

## KILO CODE COMMANDS

Pour que Kilo Code exécute cela, utilisez:

```bash
# Dans Kilo Code CLI:

kilo task "Review current Pinokio files and report structure"
kilo task "Update magnus-web-ui.js with Morgan, CORS, session management"
kilo task "Update dashboard.html with enhanced UI, charts, and export"
kilo task "Update pinokio.json with Magnus 14 configuration"
kilo task "Verify all endpoints working and test complete workflow"
```

Ou directement dans VS Code avec Kilo Extension:
```
Ctrl+Shift+K → New Kilo Task → Copier les instructions
```

---

## RÉSULTAT FINAL

Après ces updates:

```
✅ Magnus 14 fully integrated
✅ Express server optimized (logging, CORS, error handling)
✅ Dashboard with real-time metrics
✅ Session management & history
✅ Export functionality
✅ Charts and visualization
✅ Pinokio full integration
✅ Ready for production
```

---

**Comment voulez-vous procéder?**

A) Je crée les fichiers complets prêts à copier-coller?
B) Vous exécutez cela via Kilo Code?
C) Vous voulez des instructions plus détaillées pour une partie?

