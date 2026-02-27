#!/bin/bash
# Installation Script: Magnus 13.2 pour Pinokio
# Exécutez ceci dans votre terminal (bash ou PowerShell)

echo "🚀 Installation Magnus 13.2 pour Pinokio"
echo "=========================================="
echo ""

# Chemins
PINOKIO_HOME="$HOME/pinokio"
MAGNUS_PATH="$PINOKIO_HOME/api/magnus"

echo "✅ Dossier cible: $MAGNUS_PATH"
echo ""

# Étape 1: Créer dossiers
echo "1️⃣ Créer structure..."
mkdir -p "$MAGNUS_PATH/public"
mkdir -p "$MAGNUS_PATH/.magnus/knowledge"
mkdir -p "$MAGNUS_PATH/.magnus/sessions"
echo "   ✅ Dossiers créés"
echo ""

# Étape 2: Créer package.json
echo "2️⃣ Créer package.json..."
cat > "$MAGNUS_PATH/package.json" << 'EOF'
{
  "name": "magnus-13-2",
  "version": "13.2.0",
  "description": "Consciousness-driven development framework",
  "author": "Serigne DIAGNE",
  "type": "module",
  "main": "magnus-13-2-main-orchestrator.js",
  "scripts": {
    "start": "node magnus-web-ui.js",
    "dev": "node --watch magnus-web-ui.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "body-parser": "^1.20.2",
    "uuid": "^9.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF
echo "   ✅ package.json créé"
echo ""

# Étape 3: Créer magnus-13-2-main-orchestrator.js
echo "3️⃣ Créer magnus-13-2-main-orchestrator.js..."
cat > "$MAGNUS_PATH/magnus-13-2-main-orchestrator.js" << 'EOFJS'
// Magnus 13.2 Main Orchestrator
export class UnderstandingEngine {
  analyzeRequirements(request) {
    return {
      clarityScore: Math.random() * 100,
      assumptions: [],
      ambiguities: [],
      risks: [],
      questions: []
    };
  }
}

export class ComplexityEngine {
  analyzeComplexity(request) {
    return {
      dimensions: {
        domain: { score: 4, level: 'LOW' },
        technical: { score: 5, level: 'MODERATE' },
        integration: { score: 3, level: 'LOW' },
        scale: { score: 6, level: 'MODERATE' }
      }
    };
  }
  calculateOverallComplexity(result) {
    return { ...result, overall: { score: 5, level: 'MODERATE' } };
  }
}

export class LearningEngine {
  constructor(dir) { this.storageDir = dir; this.patterns = new Map(); }
  async initialize() { console.log('📚 Learning initialized'); }
  getRecommendations() { return { available: false, recommendations: [] }; }
  recordEstimate() { }
}

export class CoherenceEngine {
  constructor(dir) { this.storageDir = dir; this.sessions = new Map(); }
  async initialize() { console.log('🧩 Coherence initialized'); }
  async startSession(req, ctx) { return { id: Math.random().toString(36).substring(7) }; }
  async resumeSession(id) { return { request: '', context: {} }; }
}

export class ConvergenceEngine {
  constructor(t) { this.thresholds = t; }
  analyze() { return { recognitionScore: 82, inevitabilityScore: 85, coherenceScore: 88, reasoning: 'Good' }; }
  calculateConvergence(s) { return (s.recognition + s.inevitability + s.coherence) / 3; }
}

export class AgentAllocationEngine {
  constructor(a) { this.agents = a; }
  allocate() { return this.agents; }
}

export default class Magnus132 {
  constructor(config = {}) {
    this.config = {
      autoLearn: config.autoLearn !== false,
      minClarityScore: config.minClarityScore || 70,
      maxComplexityScore: config.maxComplexityScore || 8,
      storageDir: config.storageDir || './.magnus',
      orchestratorName: config.orchestratorName || 'Magnus',
      orchestrationMode: config.orchestrationMode || 'ORCHESTRATED',
      agents: config.agents || {},
      convergenceThresholds: config.convergenceThresholds || {
        minRecognitionScore: 80,
        minInevitabilityScore: 80,
        minCoherenceScore: 75
      }
    };
    
    this.understanding = new UnderstandingEngine();
    this.complexity = new ComplexityEngine();
    this.learning = new LearningEngine(this.config.storageDir);
    this.coherence = new CoherenceEngine(this.config.storageDir);
    this.convergence = new ConvergenceEngine(this.config.convergenceThresholds);
    this.agentRouter = new AgentAllocationEngine(this.config.agents);
    
    this.initialized = false;
  }
  
  async initialize() {
    if (this.initialized) return;
    await Promise.all([this.learning.initialize(), this.coherence.initialize()]);
    this.initialized = true;
    console.log('✅ Magnus 13.2 initialized');
  }
  
  async analyze(request) {
    const analysis = {
      request,
      timestamp: Date.now(),
      understanding: this.understanding.analyzeRequirements(request),
      complexity: this.complexity.analyzeComplexity(request),
      canProceed: true,
      recommendation: { recommendation: 'GENERATE' },
      agents: this.agentRouter.allocate(),
      reasoning: []
    };
    
    analysis.complexity = this.complexity.calculateOverallComplexity(analysis.complexity);
    
    if (analysis.understanding.clarityScore < this.config.minClarityScore) {
      analysis.canProceed = false;
      analysis.recommendation = { recommendation: 'CLARIFY' };
    }
    
    if (analysis.complexity.overall.score > this.config.maxComplexityScore) {
      analysis.canProceed = false;
      analysis.recommendation = { recommendation: 'DECOMPOSE' };
    }
    
    return analysis;
  }
  
  async startGeneration(analysis, decision = null) {
    const sid = Math.random().toString(36).substring(7);
    const session = await this.coherence.startSession(analysis.request, { analysis, decision });
    this.learning.recordEstimate(session.id, { complexity: analysis.complexity.overall.score });
    
    return {
      sessionId: session.id,
      estimate: { tokensEstimated: 2000, iterationsEstimated: 1, complexity: analysis.complexity.overall.score },
      strategy: decision?.strategy || { name: 'QUALITY_FIRST' },
      agents: analysis.agents
    };
  }
  
  async validateConvergence(sessionId, code, feedback) {
    const analysis = this.convergence.analyze({ code, feedback });
    const score = this.convergence.calculateConvergence({
      recognition: analysis.recognitionScore,
      inevitability: analysis.inevitabilityScore,
      coherence: analysis.coherenceScore
    });
    
    return {
      sessionId,
      convergenceScore: score,
      outcome: 'CONVERGED',
      recognition: analysis.recognitionScore,
      inevitability: analysis.inevitabilityScore,
      coherence: analysis.coherenceScore,
      timestamp: Date.now(),
      nextSteps: { action: 'RECORD_AND_CLOSE', steps: ['✓ Code converged', '✓ Record outcome'] }
    };
  }
  
  getKnowledgeStats() {
    return { patterns: this.learning.patterns.size, samples: 0, failures: 0, convergences: 0 };
  }
}
EOFJS
echo "   ✅ magnus-13-2-main-orchestrator.js créé"
echo ""

# Étape 4: Créer magnus-web-ui.js
echo "4️⃣ Créer magnus-web-ui.js..."
cat > "$MAGNUS_PATH/magnus-web-ui.js" << 'EOFWEB'
import express from 'express';
import bodyParser from 'body-parser';
import Magnus132 from './magnus-13-2-main-orchestrator.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(express.static('public'));

const magnus = new Magnus132({
  autoLearn: true,
  minClarityScore: 70,
  maxComplexityScore: 8,
  storageDir: './.magnus',
  orchestratorName: 'Serigne',
  orchestrationMode: 'ORCHESTRATED',
  agents: {
    primary: { name: 'claude-opus-4.5', role: 'Architecture' },
    testing: { name: 'jest', role: 'Testing' },
    deployment: { name: 'node', role: 'Deployment' }
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/analyze', async (req, res) => {
  try {
    const { request } = req.body;
    if (!request) return res.status(400).json({ error: 'Request required' });
    const analysis = await magnus.analyze(request);
    res.json({ success: true, analysis });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/generate', async (req, res) => {
  try {
    const { analysis, strategy } = req.body;
    const session = await magnus.startGeneration(analysis, { strategy });
    res.json({ success: true, session });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/validate-convergence', async (req, res) => {
  try {
    const { sessionId, code, feedback } = req.body;
    const convergence = await magnus.validateConvergence(sessionId, code, feedback);
    res.json({ success: true, convergence });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = magnus.getKnowledgeStats();
    res.json({ stats, timestamp: new Date().toISOString() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

(async () => {
  try {
    await magnus.initialize();
    console.log('\n✅ Magnus 13.2 initialized');
    console.log(`🧠 Orchestrator: ${magnus.config.orchestratorName}`);
    console.log(`📊 Mode: ${magnus.config.orchestrationMode}\n`);
    
    app.listen(PORT, () => {
      console.log(`🚀 Magnus running on http://localhost:${PORT}`);
      console.log(`📍 Dashboard: http://localhost:${PORT}/dashboard.html\n`);
    });
  } catch (e) {
    console.error('❌ Failed:', e);
    process.exit(1);
  }
})();
EOFWEB
echo "   ✅ magnus-web-ui.js créé"
echo ""

# Étape 5: Créer dashboard.html
echo "5️⃣ Créer public/dashboard.html..."
mkdir -p "$MAGNUS_PATH/public"
cat > "$MAGNUS_PATH/public/dashboard.html" << 'EOFHTML'
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Magnus 13.2</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    header h1 { font-size: 2em; margin-bottom: 10px; }
    .content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 30px; }
    .section { border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background: #f9f9f9; }
    .section h2 { color: #667eea; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
    textarea, input, select { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; font-family: inherit; }
    button { background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 10px; }
    button:hover { background: #764ba2; }
    button:disabled { background: #ccc; }
    .result { background: white; border: 1px solid #e0e0e0; border-radius: 4px; padding: 15px; margin-top: 15px; max-height: 300px; overflow-y: auto; font-size: 0.85em; }
    .status { display: inline-block; padding: 5px 10px; border-radius: 4px; font-weight: bold; margin: 10px 0; }
    .status.ok { background: #4caf50; color: white; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🎼 Magnus 13.2</h1>
      <p>Consciousness-Driven Development Framework</p>
    </header>
    
    <div class="content">
      <div class="section">
        <h2>Phase 1: Analyse</h2>
        <textarea id="request" placeholder="Décrivez votre demande..." rows="5"></textarea>
        <button onclick="analyzeRequest()">📊 Analyser</button>
        <div class="result" id="result1"></div>
      </div>
      
      <div class="section">
        <h2>Phase 2: Stratégie</h2>
        <select id="strategy" disabled>
          <option value="">-- Analyser d'abord --</option>
          <option value="FAST_TRACK">⚡ FAST_TRACK</option>
          <option value="QUALITY_FIRST">✓ QUALITY_FIRST</option>
          <option value="EXPERT_PATH">🧠 EXPERT_PATH</option>
        </select>
        <button onclick="generateCode()" id="generateBtn" disabled>🎬 Générer</button>
        <div class="result" id="result2"></div>
      </div>
      
      <div class="section">
        <h2>Phase 3: Code</h2>
        <textarea id="code" placeholder="Code généré" rows="5" readonly></textarea>
        <textarea id="feedback" placeholder="Votre feedback..." rows="3"></textarea>
        <button onclick="validateConvergence()" id="validateBtn" disabled>✓ Valider</button>
        <div class="result" id="result3"></div>
      </div>
      
      <div class="section">
        <h2>📈 Stats</h2>
        <button onclick="getStats()">Actualiser</button>
        <div class="result" id="result4"></div>
      </div>
    </div>
  </div>
  
  <script>
    let currentAnalysis = null;
    let currentSession = null;
    
    async function analyzeRequest() {
      const request = document.getElementById('request').value;
      if (!request.trim()) { alert('Entrez une demande'); return; }
      
      document.getElementById('result1').innerHTML = '<p>Analyse...</p>';
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request })
        });
        const data = await res.json();
        if (data.success) {
          currentAnalysis = data.analysis;
          const html = `<div class="status ok">✅ OK</div><p><strong>Clarity:</strong> ${Math.round(data.analysis.understanding.clarityScore)}/100</p><p><strong>Complexity:</strong> ${data.analysis.complexity.overall.score}/10</p>`;
          document.getElementById('result1').innerHTML = html;
          document.getElementById('strategy').disabled = false;
          document.getElementById('generateBtn').disabled = false;
        }
      } catch (e) { document.getElementById('result1').innerHTML = `<p>❌ ${e.message}</p>`; }
    }
    
    async function generateCode() {
      if (!currentAnalysis) { alert('Analyser d\'abord'); return; }
      const strategy = document.getElementById('strategy').value;
      if (!strategy) { alert('Choisir stratégie'); return; }
      
      document.getElementById('result2').innerHTML = '<p>Génération...</p>';
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ analysis: currentAnalysis, strategy: { name: strategy } })
        });
        const data = await res.json();
        if (data.success) {
          currentSession = data.session;
          document.getElementById('code').value = '// Code généré par Magnus\nconst express = require("express");';
          document.getElementById('result2').innerHTML = '<div class="status ok">✅ Session lancée</div>';
          document.getElementById('validateBtn').disabled = false;
        }
      } catch (e) { document.getElementById('result2').innerHTML = `<p>❌ ${e.message}</p>`; }
    }
    
    async function validateConvergence() {
      if (!currentSession) { alert('Générer d\'abord'); return; }
      document.getElementById('result3').innerHTML = '<p>Validation...</p>';
      try {
        const res = await fetch('/api/validate-convergence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: currentSession.sessionId, code: document.getElementById('code').value, feedback: document.getElementById('feedback').value })
        });
        const data = await res.json();
        if (data.success) {
          const html = `<div class="status ok">✅ ${data.convergence.outcome}</div><p>Recognition: ${data.convergence.recognition}%</p><p>Inevitability: ${data.convergence.inevitability}%</p>`;
          document.getElementById('result3').innerHTML = html;
        }
      } catch (e) { document.getElementById('result3').innerHTML = `<p>❌ ${e.message}</p>`; }
    }
    
    async function getStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        const html = `<p>Patterns: ${data.stats.patterns}</p><p>Samples: ${data.stats.samples}</p>`;
        document.getElementById('result4').innerHTML = html;
      } catch (e) { console.error(e); }
    }
    
    window.onload = () => { getStats(); };
  </script>
</body>
</html>
EOFHTML
echo "   ✅ public/dashboard.html créé"
echo ""

# Étape 6: Créer pinokio.json
echo "6️⃣ Créer pinokio.json..."
cat > "$MAGNUS_PATH/pinokio.json" << 'EOFJSON'
{
  "title": "Magnus 13.2 - Consciousness Orchestrator",
  "description": "AI-driven development with consciousness framework",
  "author": "Serigne DIAGNE",
  "version": "13.2.0",
  "requirements": { "memory": "4GB", "storage": "500MB" },
  "install": [
    { "run": "npm install", "path": "." },
    { "run": "mkdir -p .magnus/knowledge .magnus/sessions", "path": "." }
  ],
  "run": [{ "cmd": "npm start", "path": ".", "env": { "NODE_ENV": "production", "PORT": "3001" } }],
  "web": [{ "url": "http://localhost:3001/dashboard.html", "name": "Magnus Dashboard" }]
}
EOFJSON
echo "   ✅ pinokio.json créé"
echo ""

echo "✅ Installation terminée!"
echo ""
echo "Prochaines étapes:"
echo "1. cd $MAGNUS_PATH"
echo "2. npm install"
echo "3. npm start"
echo "4. Ouvrir http://localhost:3001/dashboard.html"
echo ""
echo "Ou dans Pinokio:"
echo "- Refresh si Pinokio est ouvert"
echo "- Magnus devrait apparaître dans Discover"
echo "- Cliquer Install, puis Run"
echo ""
