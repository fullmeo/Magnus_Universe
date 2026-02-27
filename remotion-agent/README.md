# Remotion Agent

**Video Composition Module for Magnus 13.2**

Generate synchronized video compositions for music with sacred geometry visualization, 432Hz frequency emphasis, and Pythagorean harmonic structure.

## Features

- **Sacred Geometry Visualization** - Golden Ratio (φ) and Platonic solids (tetrahedron, cube, octahedron, dodecahedron, icosahedron)
- **432Hz Frequency Emphasis** - Natural frequency alignment and harmonic detection
- **Audio Analysis** - FFT, beat detection, onset detection, harmonic analysis
- **Multiple Output Formats** - MP4, WebM, GIF, MOV, MKV, HEVC
- **Quality Presets** - Fast, Balanced, High, Master
- **Magnus Integration** - Full integration with Magnus 13.2 orchestration
- **Convergence Validation** - 5-dimensional scoring system

## Quick Start

### Installation

```bash
cd remotion-agent
npm install
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Docker

```bash
docker-compose up -d
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/remotion/compose` | POST | Initiate video composition |
| `/api/remotion/compose/:jobId` | GET | Poll job status |
| `/api/remotion/validate` | POST | Validate output convergence |
| `/api/remotion/templates` | GET | List available templates |
| `/api/remotion/jobs` | GET | List all jobs |
| `/api/remotion/health` | GET | Health check |

## Example Request

```bash
curl -X POST http://localhost:3001/api/remotion/compose \
  -H "Content-Type: application/json" \
  -d '{
    "audioPath": "/path/to/audio.wav",
    "metadata": {
      "title": "Sacred Harmony",
      "duration": 180000,
      "tempo": 120,
      "key": "C Major"
    },
    "outputFormat": "mp4",
    "qualityPreset": "balanced",
    "options": {
      "enableSacredGeometry": true,
      "enable432Hz": true
    }
  }'
```

## Architecture

```
remotion-agent/
├── src/
│   ├── audio/              # Audio analysis (FFT, beat detection)
│   ├── composition/        # Composition building
│   ├── visualization/      # Geometry, spectrum, waveform renderers
│   ├── rendering/          # Remotion render engine
│   ├── integration/        # Magnus & convergence validation
│   ├── api/                # REST API routes
│   ├── types/              # TypeScript definitions
│   ├── config/             # Configuration & defaults
│   └── utils/              # Logger, error handling
├── compositions/           # Remotion React components
└── tests/                  # Unit & integration tests
```

## Core Components

### 1. Audio Analyzer
Extracts features from audio for synchronization:
- FFT analysis
- Beat detection
- Onset detection
- Harmonic analysis
- 432Hz alignment detection

### 2. Composition Builder
Builds Remotion compositions with:
- Timeline construction
- Layer generation
- Animation keyframes
- Synchronization mapping

### 3. Geometry Renderer
Sacred geometry visualization:
- Golden Ratio (φ = 1.618...)
- Platonic solids
- 3D to 2D projection
- Beat-reactive animations

### 4. Frequency Visualizer
Spectrum display with:
- 432Hz emphasis
- Multiple display modes
- Peak hold
- Color mapping

### 5. Render Engine
Video rendering:
- Remotion CLI wrapper
- Progress monitoring
- Quality validation
- Multiple output formats

### 6. Convergence Validator
5-dimensional scoring:
- **Recognition** (30%) - Does output match vision?
- **Inevitability** (20%) - Does it feel necessary?
- **Coherence** (30%) - Perfect audio/visual sync?
- **Geometric Alignment** (10%) - Sacred geometry adherence?
- **Frequency Accuracy** (10%) - 432Hz representation?

## Sacred Constants

```typescript
const PHI = 1.618033988749894848204586834365638117720309179805762862135;
const FREQUENCY_432HZ = 432;
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];
```

## Quality Presets

| Preset | Codec | Bitrate | FPS | Est. Size/min | Est. Time/min |
|--------|-------|---------|-----|---------------|---------------|
| fast | H.264 | 2 Mbps | 24 | ~50 MB | 30 sec |
| balanced | H.264 | 4 Mbps | 30 | ~150 MB | 2 min |
| high | ProRes | 8 Mbps | 60 | ~300 MB | 4 min |
| master | ProRes | 12 Mbps | 60 | ~450 MB | 6 min |

## Environment Variables

```env
PORT=3001
HOST=localhost
NODE_ENV=development
MAGNUS_API_URL=http://localhost:3000
MAGNUS_ENABLED=true
SACRED_GEOMETRY_ENABLED=true
FREQUENCY_432HZ_ENABLED=true
GOLDEN_RATIO_MODE=true
REMOTION_CONCURRENCY=4
RENDER_QUALITY=balanced
```

## License

MIT

---

**Architecture Status**: ✓ COMPLETE
**System**: Magnus 13.2 Integration
**Golden Ratio (φ)**: 1.618033988749894

*Designed with Understanding Management methodology*
