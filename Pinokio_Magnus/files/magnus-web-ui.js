// magnus-web-ui.js
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

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Magnus 13.2 running' });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { request } = req.body;
    if (!request) return res.status(400).json({ error: 'Request required' });
    
    const analysis = await magnus.analyze(request);
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const { analysis, strategy } = req.body;
    const session = await magnus.startGeneration(analysis, { strategy });
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/validate-convergence', async (req, res) => {
  try {
    const { sessionId, code, feedback } = req.body;
    const convergence = await magnus.validateConvergence(sessionId, code, feedback);
    res.json({ success: true, convergence });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = magnus.getKnowledgeStats();
    res.json({ stats, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

(async () => {
  try {
    await magnus.initialize();
    console.log('\n✅ Magnus 13.2 initialized');
    console.log(`🧠 Orchestrator: ${magnus.config.orchestratorName}`);
    console.log(`📊 Mode: ${magnus.config.orchestrationMode}\n`);
    
    app.listen(PORT, () => {
      console.log(`🚀 Magnus Web UI running on http://localhost:${PORT}`);
      console.log(`📍 Dashboard: http://localhost:${PORT}/dashboard.html`);
      console.log(`📚 API: http://localhost:${PORT}/api/analyze\n`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize Magnus:', error);
    process.exit(1);
  }
})();
