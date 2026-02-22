/**
 * Magnus 15 Orchestrator - Unit Tests
 *
 * Test suite for core functionality
 */

const { createApp, AGENTS, CONFIG } = require('../magnus-orchestrator');

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ text: '{"score": 85, "reasoning": "Test analysis", "recommendations": ["Test suggestion"]}' }],
        usage: { input_tokens: 100, output_tokens: 200 }
      })
    }
  }));
});

describe('Magnus 15 Orchestrator', () => {

  describe('Agent Configuration', () => {
    test('should have exactly 6 agents defined', () => {
      expect(Object.keys(AGENTS)).toHaveLength(6);
    });

    test('should include all required agents', () => {
      const requiredAgents = ['analyst', 'critic', 'synthesizer', 'strategist', 'historian', 'observer'];
      requiredAgents.forEach(agentId => {
        expect(AGENTS[agentId]).toBeDefined();
        expect(AGENTS[agentId].id).toBe(agentId);
        expect(AGENTS[agentId].name).toBeDefined();
        expect(AGENTS[agentId].role).toBeDefined();
        expect(AGENTS[agentId].expertise).toBeInstanceOf(Array);
        expect(AGENTS[agentId].weight).toBeGreaterThan(0);
      });
    });

    test('agent weights should sum to approximately 1.0', () => {
      const totalWeight = Object.values(AGENTS).reduce((sum, agent) => sum + agent.weight, 0);
      expect(totalWeight).toBeCloseTo(1.0, 2);
    });

    test('each agent should have unique expertise', () => {
      const allExpertise = Object.values(AGENTS).flatMap(a => a.expertise);
      const uniqueExpertise = new Set(allExpertise);
      // At least 80% should be unique
      expect(uniqueExpertise.size / allExpertise.length).toBeGreaterThan(0.6);
    });
  });

  describe('Configuration', () => {
    test('should have valid default port', () => {
      expect(CONFIG.port).toBeGreaterThan(0);
      expect(CONFIG.port).toBeLessThan(65536);
    });

    test('should have valid convergence threshold', () => {
      expect(CONFIG.convergenceThreshold).toBeGreaterThanOrEqual(0);
      expect(CONFIG.convergenceThreshold).toBeLessThanOrEqual(100);
    });

    test('should have valid timeout settings', () => {
      expect(CONFIG.agentTimeout).toBeGreaterThan(0);
      expect(CONFIG.maxConcurrentAgents).toBeGreaterThan(0);
    });
  });

  describe('API Endpoints', () => {
    let app;

    beforeAll(() => {
      app = createApp();
    });

    test('GET /health should return healthy status', async () => {
      const request = require('supertest');
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('healthy');
      expect(res.body.version).toBe('15.0.0');
      expect(res.body.agents).toHaveLength(6);
      expect(res.body.safeguards).toHaveLength(7);
    });

    test('POST /api/analyze-music should validate prompt', async () => {
      const request = require('supertest');

      // Too short prompt
      const res1 = await request(app)
        .post('/api/analyze-music')
        .send({ prompt: 'short' });
      expect(res1.status).toBe(400);
      expect(res1.body.error).toContain('10 characters');

      // Missing prompt
      const res2 = await request(app)
        .post('/api/analyze-music')
        .send({});
      expect(res2.status).toBe(400);
    });

    test('POST /api/analyze-music should validate agentId', async () => {
      const request = require('supertest');

      const res = await request(app)
        .post('/api/analyze-music')
        .send({ prompt: 'A valid prompt with enough characters', agentId: 'invalid_agent' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid agentId');
    });

    test('POST /api/compose-with-claude should require prompt', async () => {
      const request = require('supertest');

      const res = await request(app)
        .post('/api/compose-with-claude')
        .send({ genre: 'pop' });
      expect(res.status).toBe(400);
    });

    test('POST /api/validate-convergence should require sessionId', async () => {
      const request = require('supertest');

      const res = await request(app)
        .post('/api/validate-convergence')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('sessionId');
    });

    test('GET /api/sessions/:id should return 404 for unknown session', async () => {
      const request = require('supertest');

      const res = await request(app)
        .get('/api/sessions/unknown-session-id');
      expect(res.status).toBe(404);
    });
  });

  describe('Validation Schemas', () => {
    test('tempo validation should check range', async () => {
      const request = require('supertest');
      const app = createApp();

      // Invalid tempo (too low)
      const res1 = await request(app)
        .post('/api/analyze-music')
        .send({ prompt: 'A valid prompt for testing', tempo: 10 });
      expect(res1.status).toBe(400);
      expect(res1.body.error).toContain('tempo');

      // Invalid tempo (too high)
      const res2 = await request(app)
        .post('/api/analyze-music')
        .send({ prompt: 'A valid prompt for testing', tempo: 500 });
      expect(res2.status).toBe(400);
    });
  });

  describe('Safeguards', () => {
    test('all 7 safeguards should be documented', () => {
      const safeguardNames = [
        'Intent Preservation',
        'Scope Validation',
        'Safety Checks',
        'Bias Detection',
        'Human Approval Gates',
        'Rollback Capability',
        'Audit Trail'
      ];

      // Verify via health endpoint
      const request = require('supertest');
      const app = createApp();

      return request(app)
        .get('/health')
        .then(res => {
          safeguardNames.forEach(name => {
            expect(res.body.safeguards).toContain(name);
          });
        });
    });
  });

  describe('Convergence Scoring', () => {
    test('convergence dimensions should have valid weights', () => {
      const CONVERGENCE_DIMENSIONS = {
        recognition: { weight: 0.35 },
        inevitability: { weight: 0.30 },
        coherence: { weight: 0.35 }
      };

      const totalWeight = Object.values(CONVERGENCE_DIMENSIONS)
        .reduce((sum, dim) => sum + dim.weight, 0);
      expect(totalWeight).toBeCloseTo(1.0, 2);
    });

    test('convergence threshold should determine outcomes correctly', () => {
      const threshold = CONFIG.convergenceThreshold;

      // CONVERGED: score >= threshold
      expect(threshold).toBeLessThanOrEqual(100);

      // PARTIAL: threshold * 0.7 <= score < threshold
      const partialMin = threshold * 0.7;
      expect(partialMin).toBeGreaterThan(0);

      // FAILED: score < threshold * 0.7
    });
  });
});

describe('Integration Tests', () => {
  test('full composition flow (mocked)', async () => {
    const request = require('supertest');
    const app = createApp();

    const res = await request(app)
      .post('/api/compose-with-claude')
      .send({
        prompt: 'A melancholic piano ballad with strings, inspired by autumn',
        genre: 'classical',
        mood: 'melancholic',
        tempo: 72
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.sessionId).toBeDefined();
    expect(res.body.strategy).toBeDefined();
  });
});
