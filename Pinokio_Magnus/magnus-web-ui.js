/**
 * Magnus 13.2 Web UI Server for Pinokio
 *
 * Express server with WebSocket support for real-time updates
 * Designed to run via Pinokio 1-click launch
 */

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import Magnus132 from './magnus-13-2-main-orchestrator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 3001;

// Connected WebSocket clients
const clients = new Set();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Magnus
const magnus = new Magnus132({
  autoLearn: true,
  minClarityScore: 70,
  maxComplexityScore: 8,
  storageDir: './.magnus',
  orchestratorName: 'Serigne',
  orchestrationMode: 'ORCHESTRATED',
  agents: {
    primary: { name: 'claude-opus-4.5', role: 'Architecture', capabilities: ['architecture', 'design', 'synthesis'] },
    testing: { name: 'jest', role: 'Testing', capabilities: ['unit-tests', 'integration-tests'] },
    deployment: { name: 'node', role: 'Deployment', capabilities: ['docker', 'npm', 'git'] }
  }
});

// Broadcast to all WebSocket clients
function broadcast(message) {
  const data = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === 1) {
      client.send(data);
    }
  }
}

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected');
  clients.add(ws);

  ws.send(JSON.stringify({ type: 'connected', message: 'Connected to Magnus 13.2' }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      }
    } catch (e) {
      console.error('WebSocket message error:', e);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('🔌 WebSocket client disconnected');
  });
});

// === API ROUTES ===

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Magnus 13.2 running',
    uptime: process.uptime(),
    clients: clients.size
  });
});

// Analyze request
app.post('/api/analyze', async (req, res) => {
  try {
    const { request } = req.body;
    if (!request) return res.status(400).json({ error: 'Request required' });

    console.log(`📊 Analyzing: "${request.substring(0, 50)}..."`);
    const analysis = await magnus.analyze(request);

    broadcast({ type: 'analysis-complete', data: analysis });
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('❌ Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate code
app.post('/api/generate', async (req, res) => {
  try {
    const { analysis, strategy } = req.body;

    console.log(`🎬 Starting generation with strategy: ${strategy?.name || 'default'}`);
    const session = await magnus.startGeneration(analysis, { strategy });

    broadcast({ type: 'generation-started', data: session });
    res.json({ success: true, session });
  } catch (error) {
    console.error('❌ Generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Validate convergence
app.post('/api/validate-convergence', async (req, res) => {
  try {
    const { sessionId, code, feedback } = req.body;

    console.log(`✓ Validating convergence for session: ${sessionId}`);
    const convergence = await magnus.validateConvergence(sessionId, code, feedback);

    broadcast({ type: 'convergence-validated', data: convergence });
    res.json({ success: true, convergence });
  } catch (error) {
    console.error('❌ Convergence error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get stats
app.get('/api/stats', (req, res) => {
  try {
    const stats = magnus.getKnowledgeStats();
    res.json({
      stats,
      timestamp: new Date().toISOString(),
      wsClients: clients.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// === SERVER STARTUP ===
(async () => {
  try {
    await magnus.initialize();

    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║       MAGNUS 13.2 - CONSCIOUSNESS ORCHESTRATOR        ║
║                     via Pinokio                       ║
╚═══════════════════════════════════════════════════════╝
`);
    console.log(`✅ Magnus 13.2 initialized`);
    console.log(`🧠 Orchestrator: ${magnus.config.orchestratorName}`);
    console.log(`📊 Mode: ${magnus.config.orchestrationMode}\n`);

    server.listen(PORT, () => {
      console.log(`🚀 Server: http://localhost:${PORT}`);
      console.log(`📍 Dashboard: http://localhost:${PORT}/dashboard`);
      console.log(`📚 API: http://localhost:${PORT}/api/analyze`);
      console.log(`🔌 WebSocket: ws://localhost:${PORT}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize Magnus:', error);
    process.exit(1);
  }
})();
