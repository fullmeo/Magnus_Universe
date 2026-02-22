# Magnus 15 Orchestrator

**Multi-Agent Music Composition System with Claude Sonnet 4.5**

Production-ready orchestration engine featuring 6 specialized AI agents, 8th Principle convergence validation, and comprehensive safeguards.

## Quick Start

```bash
# Install dependencies
npm install

# Set your Anthropic API key
export ANTHROPIC_API_KEY=your-api-key

# Start the server
npm start

# Open the dashboard
open http://localhost:3001/dashboard.html
```

## Features

### 6 Specialized Agents

| Agent | Role | Weight |
|-------|------|--------|
| **Analyst** | Music theory, harmony, rhythm, structure analysis | 20% |
| **Critic** | Artistic merit, emotional impact, creative evaluation | 15% |
| **Synthesizer** | Sound design, timbres, textures, sonic palettes | 18% |
| **Strategist** | Composition structure, arrangement, development | 22% |
| **Historian** | Historical context, genre influences, style references | 12% |
| **Observer** | Audience reception, market fit, engagement prediction | 13% |

### 8th Principle Convergence

Three-dimensional validation ensuring composition quality:

- **Recognition** (35%): Does output match the intended vision?
- **Inevitability** (30%): Does the composition feel necessary and right?
- **Coherence** (35%): Are all elements unified and consistent?

**Outcomes:**
- `CONVERGED` (≥75%): Ready for production
- `PARTIAL` (50-74%): Human review recommended
- `FAILED` (<50%): Significant revision needed

### 7 Magnus Safeguards

1. **Intent Preservation**: User request always remains primary
2. **Scope Validation**: Agents don't exceed their expertise boundaries
3. **Safety Checks**: Comprehensive error handling and input validation
4. **Bias Detection**: Musical taste agnostic evaluation
5. **Human Approval Gates**: Session tracking for approval workflows
6. **Rollback Capability**: Previous versions maintained for recovery
7. **Audit Trail**: Complete logging of all decisions

## API Endpoints

### POST /api/compose-with-claude

Full multi-agent orchestration with all 6 agents.

```bash
curl -X POST http://localhost:3001/api/compose-with-claude \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A melancholic piano ballad with string orchestration, inspired by late autumn evenings",
    "genre": "classical",
    "mood": "melancholic",
    "tempo": 72,
    "key": "D minor"
  }'
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid",
  "strategy": {
    "composition": {
      "structure": "Intro-Verse-Chorus-Bridge-Chorus-Outro",
      "progressions": ["Dm-Gm-C-F", "Dm-Am-Bb-A"],
      "key": "D minor",
      "tempo": 72,
      "instrumentation": ["piano", "strings", "cello", "violin"]
    },
    "agents": {
      "analyst": { "score": 92, "reasoning": "..." },
      "critic": { "score": 88, "reasoning": "..." },
      "synthesizer": { "score": 90, "reasoning": "..." },
      "strategist": { "score": 94, "reasoning": "..." },
      "historian": { "score": 85, "reasoning": "..." },
      "observer": { "score": 87, "reasoning": "..." }
    },
    "convergence": {
      "recognition": 88,
      "inevitability": 85,
      "coherence": 90,
      "outcome": "CONVERGED"
    },
    "confidence": 89.2
  }
}
```

### POST /api/analyze-music

Single agent analysis for quick insights.

```bash
curl -X POST http://localhost:3001/api/analyze-music \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Analyze the harmonic structure of a jazz ballad in Bb major",
    "agentId": "analyst"
  }'
```

### POST /api/validate-convergence

Re-validate an existing session's convergence.

```bash
curl -X POST http://localhost:3001/api/validate-convergence \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id"
  }'
```

### GET /api/sessions/:id

Retrieve a saved session with full strategy and audit trail.

```bash
curl http://localhost:3001/api/sessions/your-session-id
```

### POST /api/sessions/:id/rollback

Rollback to a previous strategy version (Safeguard 6).

```bash
curl -X POST http://localhost:3001/api/sessions/your-session-id/rollback \
  -H "Content-Type: application/json" \
  -d '{"versionIndex": -1}'
```

### GET /health

Health check with system metrics.

```bash
curl http://localhost:3001/health
```

## Configuration

### Environment Variables

```bash
# Server
PORT=3001                           # Server port

# Claude API
CLAUDE_MODEL=claude-sonnet-4-5-20241022  # Model to use
MAX_TOKENS=4096                     # Max tokens per request
ANTHROPIC_API_KEY=sk-...            # Your API key

# Orchestration
CONVERGENCE_THRESHOLD=75            # Minimum convergence score
AGENT_TIMEOUT=60000                 # Agent timeout (ms)
MAX_CONCURRENT_AGENTS=3             # Parallel agent limit

# Storage
SESSION_DIR=./sessions              # Session persistence directory
LOG_DIR=./logs                      # Log file directory

# Debug
DEBUG=true                          # Enable debug logging
```

### .env File

```bash
# Create .env file
cat > .env << EOF
ANTHROPIC_API_KEY=your-api-key
PORT=3001
CLAUDE_MODEL=claude-sonnet-4-5-20241022
CONVERGENCE_THRESHOLD=75
DEBUG=false
EOF
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Magnus 15 Orchestrator                    │
├─────────────────────────────────────────────────────────────┤
│  Express.js Server                                          │
│  ├── /api/compose-with-claude (POST)                        │
│  ├── /api/analyze-music (POST)                              │
│  ├── /api/validate-convergence (POST)                       │
│  ├── /api/sessions/:id (GET)                                │
│  └── /health (GET)                                          │
├─────────────────────────────────────────────────────────────┤
│  Agent Orchestrator                                         │
│  ├── Concurrent Execution (batched)                         │
│  ├── Strategy Synthesis                                     │
│  └── Conflict Resolution                                    │
├─────────────────────────────────────────────────────────────┤
│  6 Specialized Agents                                       │
│  ┌─────────┬─────────┬─────────────┐                       │
│  │ Analyst │ Critic  │ Synthesizer │                       │
│  ├─────────┼─────────┼─────────────┤                       │
│  │Strategist│Historian│  Observer  │                       │
│  └─────────┴─────────┴─────────────┘                       │
├─────────────────────────────────────────────────────────────┤
│  Convergence Validator (8th Principle)                      │
│  ├── Recognition (35%)                                      │
│  ├── Inevitability (30%)                                    │
│  └── Coherence (35%)                                        │
├─────────────────────────────────────────────────────────────┤
│  7 Safeguards                                               │
│  Intent │ Scope │ Safety │ Bias │ Approval │ Rollback │ Audit│
├─────────────────────────────────────────────────────────────┤
│  Session Manager (JSON persistence)                         │
│  └── Versioning │ Rollback │ Audit Trail                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │  Claude Sonnet 4.5 API  │
              └─────────────────────────┘
```

## Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY magnus-orchestrator.js ./
RUN mkdir -p sessions logs
EXPOSE 3001
CMD ["node", "magnus-orchestrator.js"]
```

```bash
# Build and run
docker build -t magnus-15-orchestrator .
docker run -p 3001:3001 -e ANTHROPIC_API_KEY=your-key magnus-15-orchestrator
```

## Testing

```javascript
// tests/orchestrator.test.js
const { createApp, AGENTS, CONFIG } = require('./magnus-orchestrator');
const request = require('supertest');

describe('Magnus 15 Orchestrator', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('health check returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('healthy');
  });

  test('has 6 specialized agents', () => {
    expect(Object.keys(AGENTS)).toHaveLength(6);
    expect(AGENTS.analyst).toBeDefined();
    expect(AGENTS.critic).toBeDefined();
    expect(AGENTS.synthesizer).toBeDefined();
    expect(AGENTS.strategist).toBeDefined();
    expect(AGENTS.historian).toBeDefined();
    expect(AGENTS.observer).toBeDefined();
  });

  test('agent weights sum to 1.0', () => {
    const totalWeight = Object.values(AGENTS).reduce((sum, a) => sum + a.weight, 0);
    expect(totalWeight).toBeCloseTo(1.0, 2);
  });

  test('analyze-music validates prompt length', async () => {
    const res = await request(app)
      .post('/api/analyze-music')
      .send({ prompt: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('at least 10 characters');
  });

  test('compose-with-claude requires prompt', async () => {
    const res = await request(app)
      .post('/api/compose-with-claude')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('prompt');
  });
});
```

Run tests:
```bash
npm test
```

## Examples

### Pop Song Composition

```bash
curl -X POST http://localhost:3001/api/compose-with-claude \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create an upbeat summer pop song with catchy hooks and danceable rhythm",
    "genre": "pop",
    "mood": "energetic",
    "tempo": 120
  }'
```

### Jazz Arrangement

```bash
curl -X POST http://localhost:3001/api/compose-with-claude \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A sophisticated jazz arrangement with walking bass, brush drums, and piano trio format",
    "genre": "jazz",
    "mood": "smooth",
    "key": "Bb major",
    "instruments": ["piano", "upright bass", "drums", "saxophone"]
  }'
```

### Film Score

```bash
curl -X POST http://localhost:3001/api/compose-with-claude \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Epic orchestral film score for a fantasy adventure scene with heroic themes",
    "genre": "classical",
    "mood": "dramatic",
    "tempo": 140
  }'
```

## Troubleshooting

### Common Issues

**API Key Not Set**
```
Error: Could not load Anthropic API key
```
Solution: Set `ANTHROPIC_API_KEY` environment variable

**Agent Timeout**
```
Error: Agent timeout
```
Solution: Increase `AGENT_TIMEOUT` or reduce prompt complexity

**Low Convergence Score**
```
outcome: "PARTIAL" or "FAILED"
```
Solution: Provide more specific details in your prompt

## License

MIT License - See LICENSE file for details

---

**Magnus 15 Orchestrator** - Phase 5 Production Release
*Multi-agent music composition with consciousness emergence*
