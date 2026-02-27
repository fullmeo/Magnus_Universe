# Remotion Module - Quick Reference Implementation Guide

**For**: Developers building Remotion video composition system  
**Phase**: Implementation (Weeks 1-3)  
**Target**: Magnus 13.2 integration, SongGeneration-Studio  

---

## 1. PROJECT SETUP (Day 1)

### Create directory structure
```bash
cd Magnus_13_universe
mkdir remotion-agent
cd remotion-agent

# Create subdirectories
mkdir -p src/{composition,visualization,audio,rendering,integration,api,types,config,utils,tests}
mkdir -p compositions
mkdir -p {logs,temp,output,cache}
```

### Initialize Node.js project
```bash
npm init -y

# Install core dependencies
npm install \
  remotion \
  @remotion/cli \
  typescript \
  express \
  tone \
  ml5 \
  jest \
  @types/node \
  --save

# Install dev dependencies
npm install --save-dev \
  @types/jest \
  ts-node \
  @typescript-eslint/eslint-plugin
```

### TypeScript configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

---

## 2. CORE IMPLEMENTATION PHASES

### Phase A: Audio Analyzer (Days 1-2)

**File**: `src/audio/audio-analyzer.ts`

```typescript
// Skeleton structure
export class AudioAnalyzer {
  private sampleRate: number;
  private windowSize: number;
  private hopSize: number;

  constructor(config: AudioAnalyzerConfig) {
    this.sampleRate = config.sampleRate;
    this.windowSize = config.windowSize || 2048;
    this.hopSize = config.hopSize || 512;
  }

  // Core methods to implement
  async analyze(audioBuffer: AudioBuffer): Promise<AudioAnalysisResult> {
    // 1. Validate input
    // 2. Compute STFT (FFT)
    // 3. Extract features
    // 4. Detect beats
    // 5. Detect onsets
    // 6. Detect peaks
    // 7. Analyze harmonics
    // 8. Return complete result
  }

  private computeSTFT(audioData: Float32Array): number[][] {
    // Short-Time Fourier Transform implementation
    // Use FFT library (e.g., ml5.js or tone.js)
  }

  private detectBeats(energy: number[]): BeatData[] {
    // Peak picking on energy envelope
    // Estimate tempo
    // Classify beats
  }

  private detectHarmonics(stft: number[][], fundamental: number): HarmonicData[] {
    // Harmonic product spectrum
    // Identify overtones
    // Calculate ratios
  }
}
```

**Tests to implement**:
- Valid audio input detection
- FFT output validation
- Beat detection accuracy
- Harmonic identification
- Performance benchmarks

---

### Phase B: Composition Builder (Days 2-3)

**File**: `src/composition/composition-builder.ts`

```typescript
export class CompositionBuilder {
  private config: CompositionConfig;
  private templates: Map<string, CompositionTemplate>;

  constructor(config: CompositionConfig) {
    this.config = config;
    this.templates = this.loadTemplates();
  }

  async build(input: CompositionBuildInput): Promise<CompositionData> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Prepare timeline
    const timeline = this.prepareTimeline(input.metadata);

    // 3. Build each layer
    const layers = await Promise.all([
      this.buildGeometryLayer(input),
      this.buildWaveformLayer(input),
      this.buildSpectrumLayer(input),
      this.buildParticleLayer(input)
    ]);

    // 4. Synchronize
    const sync = this.createSynchronizationMap(input.analysis, timeline);

    // 5. Compile composition
    return {
      layers,
      timeline,
      synchronization: sync,
      metadata: {
        estimatedRenderTime: this.estimateRenderTime(layers),
        totalFrames: timeline.totalFrames,
        fps: timeline.fps
      }
    };
  }

  private buildGeometryLayer(input: CompositionBuildInput): CompositionLayer {
    // Create 3D geometry from template
    // Apply animations based on beats
    // Map frequencies to rotation/scale
  }

  private buildWaveformLayer(input: CompositionBuildInput): CompositionLayer {
    // Resample audio for visualization
    // Generate keyframes
    // Apply envelope tracking
  }

  private createSynchronizationMap(
    analysis: AudioAnalysisResult,
    timeline: TimelineData
  ): SynchronizationMap {
    // Map beats → frame numbers
    // Map onsets → frame numbers
    // Calculate confidence
  }
}
```

**Key calculations**:
- Timeline: `totalFrames = duration_ms * fps / 1000`
- Keyframe positions: `frameIndex = audioEventTime * fps / 1000`
- Animation values: Interpolate between audio features

---

### Phase C: Visualization Engines (Days 3-4)

**File**: `src/visualization/geometry-renderer.ts`

```typescript
export class GeometryRenderer {
  private config: SacredGeometryConfig;
  private φ = (1 + Math.sqrt(5)) / 2; // Golden ratio

  constructor(config: SacredGeometryConfig) {
    this.config = config;
  }

  generateVertices(shape: PlatonicSolid): Vector3[] {
    // Generate vertices based on Platonic solid type
    switch(shape) {
      case 'tetrahedron':
        return this.tetrahedronVertices();
      case 'cube':
        return this.cubeVertices();
      case 'octahedron':
        return this.octahedronVertices();
      case 'dodecahedron':
        return this.dodecahedronVertices();
      case 'icosahedron':
        return this.icosahedronVertices();
    }
  }

  private dodecahedronVertices(): Vector3[] {
    // φ-based coordinates (most interesting)
    return [
      { x: 1, y: 1, z: 1 },
      { x: 1, y: 1, z: -1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: -1, z: -1 },
      { x: -1, y: 1, z: 1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: -1, y: -1, z: -1 },
      { x: 0, y: 1/this.φ, z: this.φ },
      { x: 0, y: 1/this.φ, z: -this.φ },
      // ... 10 more vertices with φ ratios
    ];
  }

  rotateGeometry(vertices: Vector3[], angle: number): Vector3[] {
    // Apply 3D rotation to vertices
    // Return transformed coordinates
  }

  projectTo2D(vertices: Vector3[], perspective: boolean): Point2D[] {
    // Project 3D points to 2D canvas
    // Orthographic or perspective projection
  }

  mapFrequencyToColor(frequency: number): string {
    // Normalize to 0-360 hue
    const hue = (Math.log(frequency) / Math.log(20000)) * 360;
    return `hsl(${hue}, 100%, 50%)`;
  }
}
```

**Frequency Visualizer** (`src/visualization/frequency-visualizer.ts`):
```typescript
export class FrequencyVisualizer {
  visualizeSpectrum(frequencies: Float32Array, config: VisualizerConfig): SVGElement {
    // Create SVG bars for frequency display
    // Map frequency → bar height → color
    // Emphasize 432Hz
    return this.renderBars(frequencies, config);
  }

  emphasize432Hz(frequencies: Float32Array, emphasis: number = 0.5): Float32Array {
    // Detect 432Hz bin index
    const index432 = this.findBinIndex(432, this.sampleRate);

    // Boost 432Hz and harmonics
    const boosted = new Float32Array(frequencies);
    boosted[index432] *= (1 + emphasis);

    // Boost harmonics (864, 1296, 2160, etc.)
    const harmonics = [2, 3, 5];
    harmonics.forEach((h, i) => {
      const idx = this.findBinIndex(432 * h, this.sampleRate);
      boosted[idx] *= (1 + emphasis * (1 - i * 0.2));
    });

    return boosted;
  }
}
```

---

### Phase D: Rendering Engine (Days 4-5)

**File**: `src/rendering/render-engine.ts`

```typescript
export class RenderEngine {
  private config: RenderConfig;
  private remotionPath: string;

  constructor(config: RenderConfig) {
    this.config = config;
    this.remotionPath = require.resolve('remotion/cli');
  }

  async render(composition: CompositionData, quality: QualityPreset): Promise<RenderResult> {
    const renderConfig = this.getQualityPreset(quality);

    // Build Remotion command
    const command = [
      'remotion',
      'render',
      'compositions/DefaultComposition.tsx',
      `--codec ${renderConfig.codec}`,
      `--bitrate ${renderConfig.bitrate}`,
      `--fps ${renderConfig.fps}`,
      `--output-format ${renderConfig.format}`,
      `--concurrency ${this.config.concurrency}`,
      '--output', './output/video.mp4'
    ];

    // Execute render
    return new Promise((resolve, reject) => {
      exec(command.join(' '), (error, stdout, stderr) => {
        if (error) {
          reject(new RenderError('Render failed', error));
        } else {
          resolve({
            outputPath: './output/video.mp4',
            metrics: this.parseMetrics(stdout)
          });
        }
      });
    });
  }

  private getQualityPreset(preset: QualityPreset): QualityConfig {
    const presets: Record<QualityPreset, QualityConfig> = {
      fast: {
        codec: 'h264',
        bitrate: '2000k',
        fps: 24,
        format: 'mp4'
      },
      balanced: {
        codec: 'vp9',
        bitrate: '4000k',
        fps: 30,
        format: 'webm'
      },
      high: {
        codec: 'prores',
        bitrate: '8000k',
        fps: 60,
        format: 'mov'
      },
      master: {
        codec: 'prores-hq',
        bitrate: '12000k',
        fps: 60,
        format: 'mov'
      }
    };
    return presets[preset];
  }
}
```

---

### Phase E: Magnus Integration (Days 5-6)

**File**: `src/integration/magnus-integration.ts`

```typescript
export class MagnusIntegration {
  private magnus: MagnusAPI;

  constructor(magnusApiUrl: string) {
    this.magnus = new MagnusAPI(magnusApiUrl);
  }

  async registerAgent(): Promise<void> {
    await this.magnus.registerAgent({
      name: 'remotion-orchestrator',
      role: 'Video Composition & Visualization',
      capabilities: ['composition', 'rendering', 'synchronization'],
      requirements: {
        minMemory: 2000,
        minDiskSpace: 10000,
        cpuCores: 2
      }
    });
  }

  async executeTask(sessionId: string, input: CompositionRequest): Promise<MagnusTaskOutput> {
    // Update session: ANALYZING
    await this.magnus.updateSession(sessionId, { phase: 'analyzing' });

    // Analyze audio
    const analyzer = new AudioAnalyzer(this.config);
    const analysis = await analyzer.analyze(input.audioBuffer);

    // Update session: COMPOSING
    await this.magnus.updateSession(sessionId, { phase: 'composing' });

    // Build composition
    const builder = new CompositionBuilder(this.config);
    const composition = await builder.build({
      audioBuffer: input.audioBuffer,
      analysis,
      metadata: input.metadata
    });

    // Update session: RENDERING
    await this.magnus.updateSession(sessionId, { phase: 'rendering' });

    // Render video
    const renderer = new RenderEngine(this.config);
    const result = await renderer.render(composition, input.qualityPreset);

    // Update session: VALIDATING
    await this.magnus.updateSession(sessionId, { phase: 'validating' });

    // Validate convergence
    const validator = new ConvergenceValidator();
    const convergence = await validator.validate({
      videoPath: result.outputPath,
      intention: input.metadata.title,
      analysis
    });

    // Record learning
    await this.recordLearning(sessionId, {
      input,
      composition,
      convergence,
      renderMetrics: result.metrics
    });

    // Update session: COMPLETE
    await this.magnus.updateSession(sessionId, {
      phase: 'complete',
      convergenceData: convergence,
      outputPath: result.outputPath
    });

    return {
      sessionId,
      outputPath: result.outputPath,
      convergence,
      metrics: result.metrics
    };
  }

  private async recordLearning(sessionId: string, data: LearningData): Promise<void> {
    await this.magnus.recordLearning({
      sessionId,
      orchestrator: 'Serigne',
      decisions: {
        template: 'default',
        visualizations: ['geometry', 'frequency'],
        qualityPreset: 'balanced'
      },
      outcomes: {
        convergenceScore: data.convergence.overallConvergence,
        renderTime: data.renderMetrics.totalTime,
        fileSize: data.renderMetrics.fileSize,
        success: data.convergence.outcome === 'converged'
      }
    });
  }

  async validateConvergence(
    videoPath: string,
    intention: string
  ): Promise<ConvergenceData> {
    // Multi-dimensional validation
    return {
      recognitionScore: await this.scoreRecognition(videoPath, intention),
      inevitabilityScore: await this.scoreInevitability(videoPath),
      coherenceScore: await this.scoreCoherence(videoPath),
      geometricAlignment: await this.scoreGeometric(videoPath),
      frequencyAccuracy: await this.scoreFrequency(videoPath),
      overallConvergence: 0, // Calculated as weighted average
      outcome: 'converged' // CONVERGED | PARTIAL | FAILED
    };
  }
}
```

---

### Phase F: REST API (Days 6-7)

**File**: `src/api/routes.ts`

```typescript
import express from 'express';

export function setupRoutes(app: express.Express, orchestrator: RemotionOrchestrator) {
  // POST /api/remotion/compose
  app.post('/api/remotion/compose', async (req, res) => {
    try {
      const input = req.body as CompositionRequest;

      // Validate input
      validateCompositionRequest(input);

      // Start job
      const sessionId = await orchestrator.startSession(input);
      const estimate = await orchestrator.estimateJob(input);

      res.json({
        jobId: sessionId,
        sessionId,
        estimate,
        status: 'queued'
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // GET /api/remotion/compose/:jobId
  app.get('/api/remotion/compose/:jobId', async (req, res) => {
    const job = await orchestrator.getJobStatus(req.params.jobId);
    res.json(job);
  });

  // POST /api/remotion/validate
  app.post('/api/remotion/validate', async (req, res) => {
    const { outputPath, intention } = req.body;
    const result = await orchestrator.validateOutput(outputPath, intention);
    res.json(result);
  });

  // GET /api/remotion/templates
  app.get('/api/remotion/templates', (req, res) => {
    res.json(orchestrator.getAvailableTemplates());
  });
}
```

---

## 3. TESTING STRATEGY

### Unit Tests
```typescript
// tests/audio-analyzer.test.ts
describe('AudioAnalyzer', () => {
  it('should detect beats in audio', async () => {
    const analyzer = new AudioAnalyzer(testConfig);
    const result = await analyzer.analyze(testAudioBuffer);
    expect(result.beats.length).toBeGreaterThan(0);
  });

  it('should calculate fundamental frequency', async () => {
    const analyzer = new AudioAnalyzer(testConfig);
    const result = await analyzer.analyze(testAudioBuffer);
    expect(result.fundamentalFrequency).toBeBetween(20, 20000);
  });
});

// tests/composition-builder.test.ts
describe('CompositionBuilder', () => {
  it('should create valid composition from analysis', async () => {
    const builder = new CompositionBuilder(testConfig);
    const composition = await builder.build(testInput);
    expect(composition.layers.length).toBeGreaterThan(0);
  });
});
```

### Integration Tests
```typescript
// tests/integration.test.ts
describe('Full Pipeline', () => {
  it('should process audio to video output', async () => {
    const orchestrator = new RemotionOrchestrator(testConfig);
    const result = await orchestrator.process(testAudioPath);
    expect(fs.existsSync(result.outputPath)).toBe(true);
  });

  it('should validate convergence', async () => {
    const validator = new ConvergenceValidator();
    const result = await validator.validate(testData);
    expect(result.overallConvergence).toBeGreaterThan(50);
  });
});
```

---

## 4. PERFORMANCE OPTIMIZATION CHECKLIST

- [ ] Cache frequently-used Platonic solid vertices
- [ ] Pool and reuse Float32Arrays (don't create new ones in hot loops)
- [ ] Use Worker threads for audio analysis (offload from main thread)
- [ ] Implement progressive rendering (show partial results while computing)
- [ ] Use memoization for FFT results
- [ ] Stream large audio files instead of loading entirely into memory
- [ ] Implement render concurrency control (max 4 concurrent jobs)
- [ ] Monitor memory usage, implement GC hints

---

## 5. DEPLOYMENT CONFIGURATION

```bash
# .env.example
REMOTION_CONCURRENCY=4
REMOTION_TIMEOUT=3600000
RENDER_QUALITY=balanced
TEMP_DIR=./temp/renders
OUTPUT_DIR=./output/videos
LOG_LEVEL=info
MAGNUS_API_URL=http://localhost:3000
SACRED_GEOMETRY_ENABLED=true
FREQUENCY_432HZ_ENABLED=true
```

```dockerfile
# Dockerfile
FROM node:18-alpine
RUN apk add ffmpeg
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY src ./src
COPY dist ./dist
HEALTHCHECK --interval=30s CMD node -e "require('http').get('http://localhost:3000/health', r => r.statusCode === 200 ? process.exit(0) : process.exit(1))"
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## 6. MONITORING & LOGGING

```typescript
// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Log key events
logger.info('Job started', { jobId, sessionId });
logger.warn('Memory usage high', { percentage: 85 });
logger.error('Render failed', { jobId, error });
```

---

## 7. ERROR HANDLING PATTERNS

```typescript
// Standard error handling
try {
  const result = await audioAnalyzer.analyze(buffer);
} catch (error) {
  if (error instanceof InvalidAudioError) {
    // Handle gracefully
  } else if (error instanceof OutOfMemoryError) {
    // Implement recovery (chunked processing)
  } else {
    // Log and rethrow
    logger.error('Unexpected error', error);
    throw error;
  }
}
```

---

## 8. WEEKLY MILESTONES

**Week 1**
- [ ] Day 1: Project setup + AudioAnalyzer skeleton
- [ ] Day 2: AudioAnalyzer implementation + tests
- [ ] Day 3: CompositionBuilder + GeometryRenderer
- [ ] Day 4: FrequencyVisualizer + Waveform renderer
- [ ] Day 5: Integration tests, performance optimization

**Week 2**
- [ ] Day 1: RenderEngine (Remotion integration)
- [ ] Day 2: Convergence validator
- [ ] Day 3: Magnus integration layer
- [ ] Day 4: REST API endpoints
- [ ] Day 5: E2E testing, documentation

**Week 3**
- [ ] Day 1: Docker deployment
- [ ] Day 2: Monitoring & alerting setup
- [ ] Day 3: Launch readiness checklist
- [ ] Day 4: Staging environment validation
- [ ] Day 5: Production launch

---

**Remember**: Follow Understanding Management methodology:
1. Analyze clarity (target: 70+)
2. Analyze complexity (target: ≤8)
3. Resolve ambiguities before coding
4. Apply 7 safeguards: Intent, Scope, Safety, Bias, Approval, Rollback, Audit

**Good luck building! 🚀**
