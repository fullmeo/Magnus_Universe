# GUIDE D'INTÉGRATION: DASHBOARD 3.0 AVEC MAGNUS 15

## 📋 Vue d'ensemble

Dashboard 3.0 est une interface de visualisation temps réel pour Magnus 15 qui montre:

- ✅ Les 6 agents en action simultanément
- ✅ Flux d'événements en temps réel avec priorités
- ✅ État de conscience dynamique
- ✅ Système de mémoire 4-tiers
- ✅ Charts interactifs
- ✅ Contrôles de simulation

---

## 🚀 INSTALLATION RAPIDE

### Étape 1: Copier le fichier

```bash
# Dans ~/pinokio/api/magnus/public/
cp dashboard-3-0.html dashboard.html
```

### Étape 2: Mettre à jour magnus-web-ui.js

Ajouter cette route:

```javascript
// Servir le dashboard
app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// WebSocket pour streaming temps réel (optionnel)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

app.get('/ws', (req, res) => {
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    // Envoyer les événements au client
    eventBus.on('event', (event) => {
      ws.send(JSON.stringify(event));
    });
  });
});
```

### Étape 3: Intégrer EventBus

Connecter le dashboard à votre EventBus Magnus 15:

```javascript
// Dans magnus-web-ui.js
import { EventBus } from './core/event-bus.js';

const eventBus = new EventBus();

// Émettre les événements vers le dashboard
app.post('/api/event', (req, res) => {
  const event = req.body;
  eventBus.emit('event', event);
  res.json({ success: true });
});
```

### Étape 4: Démarrer

```bash
cd ~/pinokio/api/magnus
npm start

# Ouvrir http://localhost:3001/dashboard.html
```

---

## 🎮 CONTRÔLES DASHBOARD

### Boutons Principaux

```
▶️ Start Consciousness
  └─ Lance les cycles de conscience
  └─ Active tous les agents
  └─ Démarre le flux d'événements

⏸️ Pause
  └─ Arrête temporairement la simulation
  └─ Les métriques restent affichées

🔄 Reset
  └─ Réinitialise tous les compteurs
  └─ Vide l'historique d'événements

📥 Export Session
  └─ Télécharge le JSON avec:
     ├─ Cycles complétés
     ├─ Statistiques agents
     ├─ Tous les événements
     └─ État de conscience final
```

### Filtres d'Événements

```
All     → Affiche tous les événements
🔴 Critical → Erreurs système
🟠 High    → Avertissements importants
🟡 Normal  → Événements standards
🟢 Low     → Événements info
```

---

## 🧠 PANELS VISUALISATION

### 1. Agent Cards (6 agents)

Chaque agent affiche:

```
┌─────────────────────┐
│ 🔍 ANALYST         │
├─────────────────────┤
│ Status: Idle        │
│                     │
│ Analyses: 3         │
│ Avg Time: 342ms     │
│ Progress: ████░░░   │
└─────────────────────┘
```

**Agents disponibles:**
- 🔍 Analyst (Pattern recognition)
- ⭐ Critic (Quality evaluation)
- 🔗 Synthesizer (Insight generation)
- 🎯 Strategist (Action planning)
- 📚 Historian (Memory management)
- 👁️ Observer (Health monitoring)

### 2. Consciousness State Panel

```
Current State:    processing
Awareness Level:  analytical
Cycle Count:      5
Events Processed: 47
```

### 3. Memory Visualization

4 niveaux de mémoire:
- Short-Term: Rapide, limité
- Long-Term: Persistent
- Procedural: Apprentissage
- Reflexive: Auto-évaluation

### 4. Real-Time Charts

**Agent Activity (Radar Chart)**
- Montre le niveau d'activité de chaque agent
- Met à jour toutes les secondes

**Event Priority (Donut Chart)**
- Distribution des priorités d'événements
- Critical/High/Normal/Low

### 5. Event Stream

Affiche en temps réel:
```
[10:34:25] consciousness.perception.input
Event from consciousness-loop [HIGH]

[10:34:26] agent.analyst.analysis.done
Analysis completed [NORMAL]

[10:34:27] agent.critic.review.done
Quality score: 7.2/10 [NORMAL]
```

---

## 🔌 INTÉGRATION AVEC VOS AGENTS

### Option 1: Dashboard Autonome (Simulation)

Le dashboard inclus une simulation auto-contenue. Pas besoin de backend.

```bash
# Juste ouvrir le fichier
open public/dashboard.html
```

### Option 2: Connecter à Magnus 15 Backend

Modifier pour recevoir des événements réels:

```javascript
// Dans le dashboard JavaScript
// Remplacer la simulation par:

const eventSource = new EventSource('/api/events');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  addEvent(data.type, data.source, data.priority, data.message);
  updateDashboard();
};
```

### Option 3: WebSocket Pour Temps Réel

```javascript
// Plus rapide et bidirectionnel
const ws = new WebSocket('ws://localhost:3001/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  handleEvent(data);
};

// Envoyer des commandes au backend
function startConsciousness() {
  ws.send(JSON.stringify({ command: 'start' }));
}
```

---

## 📊 MÉTRIQUES DISPONIBLES

### Agent Metrics

```javascript
state.agents = {
  analyst: {
    count: 0,        // Nombre d'analyses
    time: 0,         // Temps moyen
    state: 'idle'    // État actuel
  },
  critic: {
    count: 0,        // Nombre de critiques
    score: 0,        // Score de qualité
    state: 'idle'
  },
  // ... tous les agents
}
```

### Consciousness Metrics

```javascript
state.consciousness = {
  state: 'idle',                    // idle/processing/convergent
  awarenessLevel: 'reactive',       // reactive/analytical/strategic
  eventCount: 0                     // Total d'événements
}
```

### Memory Metrics

```javascript
state.memory = {
  shortTerm: 45,      // %
  longTerm: 32,       // %
  procedural: 58,     // %
  reflexive: 71       // %
}
```

---

## 🎨 PERSONNALISATION

### Changer les couleurs

```css
:root {
  --primary: #667eea;      /* Bleu principl */
  --secondary: #764ba2;    /* Violet */
  --accent: #f093fb;       /* Rose */
  --success: #4caf50;      /* Vert */
  --warning: #ff9800;      /* Orange */
  --danger: #f44336;       /* Rouge */
}
```

### Ajouter un agent

```html
<!-- Dupliquer un agent-card et modifier: -->
<div class="agent-card">
  <div class="agent-header">
    <div class="agent-icon">🆕</div>
    <div class="agent-info">
      <h3>NewAgent</h3>
      <div class="agent-status">
        <div class="status-dot active" id="newagent-status"></div>
        <span id="newagent-state">Idle</span>
      </div>
    </div>
  </div>
  <!-- ... -->
</div>
```

### Ajouter une métrique

```javascript
// Dans updateDashboard()
document.getElementById('newmetric').textContent = state.agents.newagent.value;
```

---

## 🔧 TROUBLESHOOTING

### Dashboard ne se charge pas

```bash
# Vérifier que le fichier est au bon endroit
ls -la ~/pinokio/api/magnus/public/dashboard.html

# Vérifier le serveur Express
npm start
# Accéder à http://localhost:3001
```

### Les événements ne s'affichent pas

```javascript
// Vérifier que addEvent() est appelé
console.log('Event added:', event);

// Vérifier le WebSocket (si utilisé)
ws.onopen = () => console.log('Connected!');
ws.onerror = (err) => console.error('WebSocket error:', err);
```

### Charts ne se mettent pas à jour

```javascript
// Vérifier que updateCharts() est appelé
// Vérifier que Chart.js est chargé

// Dans la console:
console.log(Chart); // Doit afficher la classe Chart
```

---

## 📈 EXEMPLE: INTÉGRATION COMPLÈTE

```javascript
// magnus-web-ui.js

import express from 'express';
import path from 'path';
import { EventBus } from './core/event-bus.js';
import { ConsciousnessLoop } from './consciousness/consciousness-loop.js';

const app = express();
const eventBus = new EventBus();
const consciousness = new ConsciousnessLoop(eventBus);

// Servir le dashboard
app.use(express.static('public'));

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API pour obtenir les événements
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const listener = (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  eventBus.on('event', listener);

  req.on('close', () => {
    eventBus.off('event', listener);
  });
});

// API pour contrôler la conscience
app.post('/api/control', (req, res) => {
  const { command } = req.body;
  
  switch (command) {
    case 'start':
      consciousness.start();
      res.json({ status: 'started' });
      break;
    case 'pause':
      consciousness.pause();
      res.json({ status: 'paused' });
      break;
    case 'reset':
      consciousness.reset();
      res.json({ status: 'reset' });
      break;
  }
});

app.listen(3001, () => {
  console.log('🚀 Magnus 15 Dashboard running on http://localhost:3001');
  consciousness.start();
});
```

---

## 🎯 PROCHAINES ÉTAPES

1. **Copier dashboard-3-0.html** → public/dashboard.html
2. **Vérifier magnus-web-ui.js** → Routes et EventBus
3. **Tester localement** → http://localhost:3001/dashboard.html
4. **Configurer dans pinokio.json** → Web endpoint
5. **Lancer dans Pinokio** → Visualiser les agents!

---

## 💾 EXPORT SESSION

Le dashboard peut exporter complètement une session:

```json
{
  "timestamp": "2024-01-25T...",
  "cycles": 42,
  "agents": {
    "analyst": { "count": 42, "time": 345, "state": "idle" },
    "critic": { "count": 41, "score": 7.2, "state": "idle" },
    ...
  },
  "events": [
    { "id": "evt-xxx", "type": "consciousness.perception.input", ... },
    ...
  ],
  "consciousness": {
    "state": "convergent",
    "awarenessLevel": "strategic",
    "eventCount": 1200
  }
}
```

Parfait pour analyser, partager, ou relancer!

---

**Le Dashboard 3.0 est PRÊT!** 🎼✨
