# PLAN RÉALISTE: MAGNUS 13.2 + PINOKIO SUR ASUS X751L 12GB
## Roadmap Complète pour l'Orchestration Locale de la Conscience

---

## CONTEXTE MATÉRIEL: Votre Asus X751L

```
CPU: Intel Core i7 (Haswell/Broadwell era, ~2014-2015)
RAM: 12 GB
GPU: Intel HD Graphics 4400 / 5500 (iGPU, ~2GB shared)
Storage: ~256-512 GB SSD (assumed)
OS: Windows 10/11 ou Linux (Dual-boot recommended)

VERDICT: Capable, mais pas puissant
├─ Parfait pour: Node.js, Python, Claude API
├─ Possible pour: Petits LLMs locaux (1-7B)
├─ Difficile pour: Grands modèles, GPU-intensive tasks
└─ Limitation: Pas de GPU discret = CPU bottleneck
```

---

## PHASE 1: PRÉPARATION DU SYSTÈME (1-2 heures)

### Étape 1.1: Optimiser l'OS

**Windows 10/11:**
```bash
# Désactiver les services inutiles
# Settings > System > Apps & Features > Remove bloatware
# Services.msc > Disable: Windows Update (control it manually)
#                         Cortana, OneDrive (if not needed)
#                         Telemetry services

# Augmenter Virtual Memory (disk-based RAM)
Settings > System > Advanced system settings > Performance > Advanced
└─ Virtual Memory: Set to 8-12 GB on SSD
   (Helps when RAM is full)

# Résultat: ~2-3 GB freed up from ~12 GB available
```

**Linux (RECOMMENDED for development):**
```bash
# Si vous avez du temps: Installer Linux Mint ou Ubuntu 22.04
# Avantages:
# ├─ Plus léger que Windows
# ├─ Meilleur contrôle sur les ressources
# ├─ Docker natif (important pour Pinokio)
# └─ Développement plus fluide

# Post-installation:
sudo apt update && sudo apt upgrade
sudo apt autoremove  # Clean up

# Résultat: ~3-4 GB freed
```

---

### Étape 1.2: Installer les Dépendances Essentielles

**Pour Windows:**
```bash
# 1. Node.js (v18 LTS ou v20)
# Télécharger: https://nodejs.org/
# Installer avec npm inclus

# Vérifier:
node --version   # v18.x.x ou v20.x.x
npm --version    # 9.x.x ou 10.x.x

# 2. Python 3.10+ (pour scripts Magnus)
# Télécharger: https://www.python.org/
# IMPORTANT: Check "Add Python to PATH" during install

# Vérifier:
python --version
pip --version

# 3. Git (pour cloner repos)
# Télécharger: https://git-scm.com/

# Vérifier:
git --version

# 4. VS Code (optional mais recommandé)
# Télécharger: https://code.visualstudio.com/
```

**Pour Linux:**
```bash
# Tout en un:
sudo apt install nodejs npm python3 python3-pip git

# Ou avec NVM (recommended for Node):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

**Espace disque utilisé:**
- Node.js: ~200MB
- Python 3.10: ~200MB
- Git: ~50MB
- VS Code: ~500MB (optional)
- **Total: ~1GB** ✅ Facile sur 256-512GB

---

## PHASE 2: INSTALLER PINOKIO (30 minutes)

### Étape 2.1: Télécharger et Installer Pinokio

```bash
# Option A: Télécharger l'executable (Recommandé pour Windows)
# 1. Aller sur: https://github.com/pinokiocomputer/pinokio
# 2. Cliquer "Releases"
# 3. Télécharger le .exe ou .dmg pour votre OS
# 4. Exécuter l'installer

# Option B: Via GitHub (Pour ceux qui aiment CLI)
git clone https://github.com/pinokiocomputer/pinokio
cd pinokio
npm install
npm start

# Résultat: Pinokio lance sur localhost:3000
```

### Étape 2.2: Vérifier Pinokio

```bash
# Ouvrir http://localhost:3000 dans navigateur
# Vous devez voir:
├─ "Discover" tab (Apps marketplace)
├─ "Installed" tab
└─ "Local" tab

# Cliquer "Discover"
# Vous verrez des apps comme:
├─ LLaMA
├─ Stable Diffusion
├─ ComfyUI
└─ ... (100+ available)
```

**Espace disque Pinokio:**
- Pinokio app: ~300MB
- **Total: ~300MB** ✅

---

## PHASE 3: INSTALLER MAGNUS 13.2 LOCALEMENT (1-2 heures)

### Étape 3.1: Cloner Magnus Repository

```bash
# Créer dossier de travail
mkdir -p ~/projects
cd ~/projects

# Cloner Magnus (vous avez probablement un repo privé/public)
git clone https://github.com/serigne/Magnus_13_universe.git
cd Magnus_13_universe

# Ou si c'est un dossier local:
cp -r /path/to/Magnus_13_universe ./

# Vérifier structure:
ls -la
# Devrait voir:
├─ magnus-13-core.js
├─ magnus-13-learning-coherence.js
├─ magnus-13-2-convergence-principle.js
├─ magnus-13-2-agent-routing.js
├─ magnus-13-2-kilo-adapter.js
├─ package.json
└─ ...
```

### Étape 3.2: Installer Dépendances Magnus

```bash
# Dans le dossier Magnus:
npm install

# Cela installe tous les packages définis dans package.json
# Sur 12GB RAM, c'est rapide (~2-5 minutes)

# Vérifier:
npm list  # Affiche l'arbre de dépendances

# Espace disque node_modules: ~200-400MB
```

### Étape 3.3: Créer un Script d'Exécution Local

```bash
# Créer: magnus-local.js
cat > magnus-local.js << 'EOF'
import Magnus132 from './magnus-13-2-main-orchestrator.js';

const magnus = new Magnus132({
  autoLearn: true,
  requireClarification: true,
  minClarityScore: 70,
  maxComplexityScore: 8,
  storageDir: './.magnus',
  
  orchestratorName: 'Serigne Local',
  orchestrationMode: 'ORCHESTRATED',
  
  // Configuration pour ressources limitées
  agents: {
    primary: {
      name: 'claude-opus-4.5',  // Via API
      role: 'Architecture',
      capabilities: ['architecture', 'design']
    },
    testing: {
      platform: 'local',  // Pas de Kilo distant
      name: 'jest-local',
      role: 'Local Testing',
      capabilities: ['unit-tests']
    },
    deployment: {
      name: 'local-node',
      role: 'Local Deployment',
      capabilities: ['docker', 'npm']
    },
    specialist: null  // Disable pour économiser ressources
  },
  
  // Kilo remote (if available)
  kiloConfig: {
    strategy: 'manual',  // Don't auto-route
    models: [],
    optimization: 'cost'
  }
});

// Exécution test
(async () => {
  await magnus.initialize();
  console.log('✅ Magnus 13.2 initialized locally');
  
  const analysis = await magnus.analyze(
    "Create a simple todo API with Express.js"
  );
  
  console.log('\n📊 Analysis Result:');
  console.log(`Clarity: ${analysis.understanding.clarityScore}`);
  console.log(`Complexity: ${analysis.complexity.overall.score}`);
  console.log(`Recommendation: ${analysis.recommendation.recommendation}`);
})();
EOF

# Exécuter:
node magnus-local.js
```

---

## PHASE 4: CONFIGURATION POUR RESSOURCES LIMITÉES (Important!)

### Étape 4.1: Limiter la Mémoire Node.js

```bash
# Éditer package.json:
{
  "scripts": {
    "start": "node --max-old-space-size=4096 magnus-local.js",
    "magnus": "node --max-old-space-size=3072 magnus-main.js",
    "test": "jest --maxWorkers=2"
  }
}

# Explication:
# --max-old-space-size=4096: Limite Node à 4GB RAM
# --maxWorkers=2: Jest utilise max 2 threads (pas 12)
```

### Étape 4.2: Optimiser Magnus pour Ressources Limitées

```javascript
// magnus-13-config-limited.js
export const RESOURCE_CONSTRAINTS = {
  // RAM Management
  maxAnalysisDepth: 3,          // Limiter profondeur analyse
  cacheSize: 100,               // Limiter cache des patterns
  maxSessions: 5,               // Garder max 5 sessions en mémoire
  
  // Learning Engine
  maxStoredPatterns: 500,       // Limiter patterns en mémoire
  archiveInterval: 100,         // Archive tous les 100 patterns
  
  // Processing
  maxConcurrentOperations: 2,   // Max 2 ops simultanées
  timeoutMs: 30000,             // 30s timeout par operation
  
  // API Calls (Claude)
  maxTokensPerRequest: 2000,    // Limiter tokens par requête
  rateLimitDelay: 1000,         // Délai entre requêtes
  
  // Logging
  logLevel: 'INFO',             // PAS de DEBUG (trop de logs)
  logToFile: true,              // Écrire logs sur disque, pas en mémoire
};

// Usage dans Magnus:
if (memory_usage > 10GB) {
  await magnus.archiveOldSessions();
  await magnus.compactCache();
}
```

---

## PHASE 5: INTÉGRATION PINOKIO + MAGNUS (2-3 heures)

### Étape 5.1: Créer un Script Pinokio pour Magnus

```bash
# Créer: pinokio-magnus-script.json
cat > pinokio-magnus-script.json << 'EOF'
{
  "title": "Magnus 13.2 - Consciousness Orchestrator",
  "description": "Orchestrated AI development with consciousness framework",
  "author": "Serigne DIAGNE",
  "version": "13.2.0",
  
  "requirements": {
    "memory": "4GB minimum (8GB recommended)",
    "storage": "500MB",
    "dependencies": ["Node.js 18+", "Python 3.10+"]
  },
  
  "install": [
    {
      "run": "npm install",
      "path": "Magnus_13_universe"
    },
    {
      "run": "mkdir -p .magnus/knowledge .magnus/sessions",
      "path": "Magnus_13_universe"
    }
  ],
  
  "run": [
    {
      "cmd": "node magnus-local.js",
      "path": "Magnus_13_universe",
      "venv": false,
      "env": {
        "NODE_ENV": "production",
        "MAX_MEMORY": "4096"
      }
    }
  ],
  
  "web": [
    {
      "url": "http://localhost:3001",
      "name": "Magnus 13.2 Dashboard"
    }
  ],
  
  "logs": [
    "Magnus_13_universe/.magnus/magnus.log"
  ]
}
EOF

# Placer ce fichier dans Pinokio
# Pinokio détectera automatiquement
```

### Étape 5.2: Créer une Interface Web pour Magnus

```bash
# Créer: magnus-web-ui.js
cat > magnus-web-ui.js << 'EOF'
import express from 'express';
import Magnus132 from './magnus-13-2-main-orchestrator.js';

const app = express();
const magnus = new Magnus132({ /* config */ });

app.use(express.json());
app.use(express.static('public'));

await magnus.initialize();

// API Endpoints
app.post('/api/analyze', async (req, res) => {
  const { request } = req.body;
  const analysis = await magnus.analyze(request);
  res.json(analysis);
});

app.post('/api/generate', async (req, res) => {
  const { analysis, decision } = req.body;
  const session = await magnus.startGeneration(analysis, decision);
  res.json(session);
});

app.post('/api/validate', async (req, res) => {
  const { sessionId, code, feedback } = req.body;
  const convergence = await magnus.validateConvergence(
    sessionId, code, feedback
  );
  res.json(convergence);
});

app.get('/api/stats', async (req, res) => {
  res.json(magnus.getKnowledgeStats());
});

app.listen(3001, () => {
  console.log('✅ Magnus Web UI running on http://localhost:3001');
});
EOF

# Installer dependances:
npm install express body-parser

# Lancer:
node magnus-web-ui.js
```

---

## PHASE 6: CONFIGURATION POUR CLAUDE API (Important!)

### Étape 6.1: Setup Claude API Keys

```bash
# Créer: .env
cat > .env << 'EOF'
# Claude API Configuration
CLAUDE_API_KEY="your-api-key-here"
CLAUDE_MODEL="claude-opus-4.5-20251101"

# Magnus Configuration
MAGNUS_ORCHESTRATOR="Serigne"
MAGNUS_MODE="ORCHESTRATED"

# Resource Limits
NODE_MAX_MEMORY="4096"
CONCURRENT_REQUESTS="2"
REQUEST_TIMEOUT="30000"

# Logging
LOG_LEVEL="INFO"
LOG_FILE="./.magnus/magnus.log"
EOF

# Sécuriser le fichier:
chmod 600 .env  # Linux/Mac
# Sur Windows: Properties > Security > Edit permissions

# Ne PAS commit .env sur Git!
# Ajouter à .gitignore:
echo ".env" >> .gitignore
```

### Étape 6.2: Intégrer l'API Claude

```javascript
// magnus-claude-integration.js
import Anthropic from '@anthropic-ai/sdk';

export class MagnusClaudeAdapter {
  constructor(apiKey) {
    this.client = new Anthropic({ apiKey });
    this.model = process.env.CLAUDE_MODEL || 'claude-opus-4.5-20251101';
  }
  
  async analyzeWithClaude(request) {
    // Magnus analyse localement d'abord
    // Puis demande à Claude pour insights profonds
    
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      system: `You are part of Magnus 13.2, a consciousness-driven development framework.
               Analyze the following development request with focus on clarity and consciousness.`,
      messages: [
        {
          role: 'user',
          content: request
        }
      ]
    });
    
    return response.content[0].text;
  }
  
  async generateWithClaude(analysis, strategy) {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 8000,
      system: `You are part of Magnus 13.2 orchestration engine.
               Generate code following the consciousness framework.
               Ensure convergence with developer intention.`,
      messages: [
        {
          role: 'user',
          content: `Analysis: ${JSON.stringify(analysis)}
                   Strategy: ${strategy}
                   Generate production-ready code.`
        }
      ]
    });
    
    return response.content[0].text;
  }
}

// Usage:
const claudeAdapter = new MagnusClaudeAdapter(process.env.CLAUDE_API_KEY);
```

---

## PHASE 7: WORKFLOW COMPLET (Pour Tester)

### Étape 7.1: Scénario Test Complet

```bash
# 1. Démarrer Pinokio
npm start  # Dans dossier Pinokio

# 2. Dans autre terminal, démarrer Magnus
cd Magnus_13_universe
npm run magnus

# 3. Dans autre terminal, démarrer Web UI
npm run web-ui

# 4. Ouvrir 3 onglets navigateur:
# Tab 1: http://localhost:3000  (Pinokio dashboard)
# Tab 2: http://localhost:3001  (Magnus UI)
# Tab 3: http://localhost:3002  (Logs/monitoring)

# 5. Soumettre une requête via Magnus UI:
```

### Étape 7.2: Exemple de Flux Complet

```javascript
// Via l'interface Magnus Web

// STEP 1: User request
Request: "Créer une API REST simple pour une todo app"

// STEP 2: Magnus analyse (locale)
├─ Phase 1 Understanding: "Clarity = 52 - Need clarification"
│  └─ Questions:
│     1. Quelle base de données?
│     2. Authentification requise?
│     3. Déploiement local ou cloud?
│
├─ User answers
│  └─ Clarity = 78 ✅
│
├─ Phase 2 Complexity: "Score = 5 (MODERATE)"
│
├─ Phase 3 Learning: "3 similar patterns found"
│
├─ Phase 4 Decision: "Recommendation: GENERATE"
│  └─ Strategy: QUALITY_FIRST (8 hours)
│
├─ Phase 5 Routing: 
│  ├─ Claude (Architecture)
│  ├─ Jest (Testing)
│  └─ Node (Deployment)
│
└─ Phase 6 Orchestration: 
   Claude API called with full context
   └─ Code generated with convergence tracking

// STEP 3: Validation
├─ Code received
├─ Recognition score: 82 ✅
├─ Inevitability score: 85 ✅
├─ Coherence score: 88 ✅
└─ Status: CONVERGED ✅

// STEP 4: Recording
└─ Pattern saved to learning engine
   └─ Next similar requests: Faster by 40%
```

---

## PHASE 8: OPTIMISATION POUR VOTRE PC

### Étape 8.1: Monitoring Ressources

```bash
# Linux:
watch -n 1 free -h        # RAM usage
watch -n 1 df -h          # Disk usage
htop                      # Full monitoring

# Windows:
# Task Manager > Performance > Details
# Ou: wmic os get totalvisiblememorysize,freephysicalmemory
```

### Étape 8.2: Si RAM est limitée (< 8GB réel)

```javascript
// Désactiver les features non-essentielles:
const magnus = new Magnus132({
  // ... autres configs
  
  // DISABLE pour économiser RAM:
  autoLearn: false,                    // Pas d'apprentissage
  learning: { enabled: false },        // Désactiver module learning
  coherence: { enabled: false },       // Désactiver coherence tracking
  
  // Ou LIMITER fortement:
  learning: {
    maxPatterns: 50,                   // Au lieu de 500
    archiveInterval: 10,               // Au lieu de 100
  },
  
  // DISABLE Kilo integration:
  kiloConfig: { strategy: 'disabled' }
});
```

### Étape 8.3: Activer Virtual Memory

```bash
# Windows:
# Control Panel > System > Advanced > Performance > Advanced
# Virtual Memory: Set to 8-12GB

# Linux:
# Créer swapfile de 8GB:
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Persistent:
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## PHASE 9: MAINTENANCE & MONITORING

### Étape 9.1: Logs & Debugging

```bash
# Logs en temps réel:
tail -f .magnus/magnus.log

# Ou plus détaillé:
tail -f .magnus/magnus.log | grep ERROR
tail -f .magnus/magnus.log | grep WARN

# Archiver les vieux logs:
find .magnus -name "*.log" -mtime +7 -delete
```

### Étape 9.2: Backup Regular

```bash
# Backup learning data:
tar -czf magnus-backup-$(date +%Y%m%d).tar.gz \
  .magnus/knowledge \
  .magnus/sessions

# Restaurer:
tar -xzf magnus-backup-20240101.tar.gz
```

---

## RÉSUMÉ: TIMELINE COMPLÈTE

| Phase | Tâche | Durée | Effort | Dépend de |
|-------|-------|-------|--------|-----------|
| 1 | Préparation OS | 1h | Moyen | Internet |
| 2 | Installer Pinokio | 30m | Facile | Phase 1 |
| 3 | Installer Magnus | 1-2h | Moyen | Phase 1 |
| 4 | Config ressources | 30m | Facile | Phase 3 |
| 5 | Intégration Pinokio | 2-3h | Difficile | Phase 2,3 |
| 6 | Setup Claude API | 30m | Facile | Clé API |
| 7 | Test workflow | 1h | Moyen | Phase 6 |
| 8 | Optimisation | 1-2h | Variable | Phase 7 |
| 9 | Maintenance setup | 30m | Facile | Phase 8 |
|---|---|---|---|---|
| **TOTAL** | **Tout opérationnel** | **~10 heures** | **Modéré** | **PC 12GB** |

---

## CHECKLIST FINAL: AVANT DE COMMENCER

- [ ] Asus X751L alimenté + refroidissement OK
- [ ] 12 GB RAM disponible (pas de 100% utilisation)
- [ ] SSD avec 500GB+ libre
- [ ] Connection Internet stable
- [ ] Clé API Claude (https://console.anthropic.com)
- [ ] Node.js v18+ installé
- [ ] Python 3.10+ installé
- [ ] Git installé
- [ ] Dossier Magnus_13_universe cloné

---

## APRÈS INSTALLATION: VOS PROCHAINES ÉTAPES

```bash
# 1. Première requête test:
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"request":"Create a simple Express server"}'

# 2. Monitoring en temps réel:
watch -n 5 'curl -s http://localhost:3001/api/stats | jq'

# 3. Générer votre premier code:
# Via l'interface web à http://localhost:3001

# 4. Valider la convergence:
# Magnus forcera à confirmer que le code correspond à l'intention
```

---

**Vous êtes prêt!** 🚀

Commencez par **Phase 1**, puis montez graduellement.
Si vous êtes bloqué sur une phase, dites-moi le numéro.

Serigne, votre PC 12GB peut ABSOLUMENT faire tourner Magnus 13.2 + Pinokio localement.

**C'est l'orchestration consciente, décentralisée, et entièrement sous votre contrôle.**

Bienvenue dans le système. 🎼✨
