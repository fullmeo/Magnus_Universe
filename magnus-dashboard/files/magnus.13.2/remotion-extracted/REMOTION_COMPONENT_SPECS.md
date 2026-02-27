/**
 * REMOTION MODULE - COMPONENT SPECIFICATIONS
 * 
 * Detailed specifications for each core component
 * Implementation requirements, interfaces, and validation rules
 */

# Component Specifications Guide

---

## 1. COMPOSITION BUILDER (src/composition/composition-builder.ts)

### Purpose
Construct a Remotion composition from audio analysis + metadata

### Input Contract
```typescript
Input: {
  audioBuffer: AudioBuffer | Float32Array
  audioAnalysis: AudioAnalysisResult
  metadata: CompositionMetadata
  template: CompositionTemplate
  config: SacredGeometryConfig
}
```

### Output Contract
```typescript
Output: {
  composition: CompositionData
  timeline: TimelineData
  layers: CompositionLayer[]
  synchronization: SynchronizationMap
  metadata: {
    estimatedRenderTime: number
    totalFrames: number
    fps: number
  }
}
```

### Key Methods

#### `build(input: CompositionInput): CompositionData`
**Complexity**: O(n) where n = audio samples
**Time Estimate**: < 5 seconds for 3-minute audio

Steps:
1. Validate input integrity (audio length, metadata completeness)
2. Prepare timeline infrastructure
3. Build each layer based on template
4. Apply synchronization mappings
5. Validate composition completeness
6. Return finalized composition

**Error Handling**:
- Invalid audio: throw InvalidAudioError with recovery suggestion
- Missing metadata: throw MissingMetadataError, list required fields
- Template mismatch: throw TemplateMismatchError, suggest alternatives

---

#### `buildLayer(template: LayerTemplate, analysis: AudioAnalysisResult): CompositionLayer`
**Responsibility**: Build single visualization layer

For each layer type:

**GEOMETRY layer**:
- Create 3D geometry (tetrahedron/cube/etc.)
- Apply Golden Ratio scaling
- Generate rotation animations based on beats
- Color map to frequency content
- Output: Animated 3D layer

**WAVEFORM layer**:
- Resample audio for visual accuracy
- Generate keyframes from sample data
- Apply envelope tracking
- Synchronize with beat analysis
- Output: Animated waveform layer

**SPECTRUM layer**:
- Compute FFT per time window
- Generate frequency band animations
- Highlight 432 Hz fundamental
- Apply color mapping to frequencies
- Output: Animated spectrum display

**PARTICLE layer**:
- Calculate particle positions from beat onsets
- Generate velocity vectors from frequency content
- Define lifespan from energy envelope
- Output: Particle system definition

---

#### `createKeyframes(audioData: Float32Array, duration: number): Keyframe[]`
**Responsibility**: Generate animation keyframes from audio

Algorithm:
```
1. Divide audio into time windows (10ms typical)
2. For each window:
   a. Calculate audio features (RMS, centroid, etc.)
   b. Map to animation property (scale, rotation, opacity, etc.)
   c. Determine easing function based on energy change
   d. Create keyframe with properties
3. Validate keyframe continuity
4. Optimize: merge redundant keyframes
5. Return keyframe array
```

**Validation**:
- Keyframes monotonically increasing in time
- Property values within valid ranges
- No gaps > 1 frame
- Easing functions are valid

---

#### `synchronize(analysis: AudioAnalysisResult, timeline: TimelineData): SynchronizationMap`
**Responsibility**: Map audio events to visual keyframes

Mapping strategy:
```
Beats → Layer scale pulses
Onsets → Particle bursts
Peaks → Color transitions
Sections → Geometry morphs
```

Output includes:
- Beat frame numbers
- Onset frame numbers
- Peak frame numbers
- Synchronization confidence score
- Drift detection

---

## 2. AUDIO ANALYZER (src/audio/audio-analyzer.ts)

### Purpose
Extract real-time audio features for synchronization and visualization

### Input Contract
```typescript
Input: {
  audioBuffer: AudioBuffer | Float32Array
  sampleRate: number
  windowSize: number // FFT window size
  hopSize: number // Overlap size
}
```

### Output Contract
```typescript
Output: AudioAnalysisResult {
  frequencies: Float32Array
  beats: BeatData[]
  onsets: number[]
  peaks: PeakData[]
  energy: number[]
  structure: Section[]
  fundamentalFrequency: number
  harmonics: HarmonicData[]
  // ... full AudioAnalysisResult
}
```

### Key Methods

#### `analyze(audioBuffer: AudioBuffer | Float32Array): AudioAnalysisResult`
**Complexity**: O(n log n) due to FFT
**Time Estimate**: < 5 seconds for 3-minute audio

Pipeline:
```
1. Normalize audio (peak normalization to -3dB)
2. Apply preprocessing (optional de-esser, high-pass filter)
3. Compute STFT (Short-Time Fourier Transform)
4. Extract features:
   a. Frequency analysis (FFT-based)
   b. Temporal features (RMS, energy)
   c. Spectral features (centroid, spread, flux)
   d. Perceptual features (MFCC - Mel-frequency cepstral coefficients)
5. Detect events:
   a. Beat detection (onset + tempo estimation)
   b. Onset detection (peak picking)
   c. Peak detection (prominence-based)
   d. Harmonic analysis (fundamental + overtones)
6. Segment analysis (section detection)
7. Confidence scoring for all detections
8. Return comprehensive AnalysisResult
```

---

#### `detectBeats(energy: number[], sampleRate: number, hopSize: number): BeatData[]`
**Algorithm**: Adaptive peak picking with tempo estimation

```
1. Smooth energy envelope (Gaussian kernel)
2. Detect local maxima (peaks in energy curve)
3. Calculate inter-onset intervals
4. Estimate tempo via histogram (peak IOI frequency)
5. Confirm beats against estimated tempo
6. Classify beats (downbeat vs. regular) via phase
7. Score confidence based on agreement with onset detection
8. Return beats with timing and confidence
```

**Robustness**:
- Handles tempo changes (detect tempo shifts, adjust)
- Handles off-beat emphasis (uses phase analysis)
- Handles polyrhythm (detect multiple overlapping tempos)
- Returns confidence scores for filtering

---

#### `detectOnsets(stft: number[][], sampleRate: number, hopSize: number): number[]`
**Algorithm**: Spectral flux onset detection

```
1. Compute spectral flux:
   For each time frame:
   flux[t] = sum(max(0, diff[bin, t]))
2. Smooth flux curve (median filter)
3. Detect peaks in flux
4. Filter by threshold (dynamic threshold based on mean flux)
5. Return onset times with confidence
```

---

#### `computeFundamentalFrequency(stft: number[][]): number`
**Algorithm**: Harmonic product spectrum method

```
1. Take frequency axis from STFT
2. Create harmonic products (multiply spectrum by downsampled copies)
3. Find peak in combined product spectrum
4. This peak corresponds to fundamental frequency
5. Validate against MIDI note range (20Hz - 20kHz)
6. Return fundamental frequency with confidence
```

---

#### `detectHarmonics(stft: number[][], fundamental: number, sampleRate: number): HarmonicData[]`
**Algorithm**: Harmonic series following

```
1. For each harmonic index (n = 1, 2, 3, ...):
   a. Expected frequency = fundamental × n
   b. Search in STFT around expected frequency (±1 semitone)
   c. Find peak magnitude
   d. Calculate ratio to fundamental
   e. Detect cents deviation from perfect harmonic
2. Filter harmonics by minimum magnitude threshold
3. Stop when consecutive harmonics below threshold
4. Return array of detected harmonics
```

---

## 3. GEOMETRY RENDERER (src/visualization/geometry-renderer.ts)

### Purpose
Render sacred geometry with Golden Ratio and dynamic animation

### Configuration
```typescript
Config: {
  shape: PlatonicSolid
  goldenRatioScale: number // 0.5 - 2.0
  rotationSpeed: number // degrees per second
  colorMapping: ColorMapping
  pulseResponse: boolean // respond to audio beats
  harmonicAlignment: boolean // align to harmonic series
}
```

### Key Concepts

#### Golden Ratio Implementation
```typescript
φ (phi) = (1 + √5) / 2 ≈ 1.618033988749...

Apply to:
1. Dimensions
   - Canvas aspect: φ:1 or 1:φ
   - Element sizes: scale by φ
   
2. Positioning
   - Golden rectangle positioning
   - Fibonacci spiral placement
   
3. Animation
   - Keyframe timing: proportional to φ
   - Color transitions: hue steps of 360°/φ²
   
4. Geometry
   - Vertex placement: φ-based scaling
   - Edge ratios: φ relationships
```

#### Platonic Solids Rendering

**Tetrahedron** (air element)
- 4 vertices, 6 edges, 4 triangular faces
- Vertex coordinates: tetrahedral symmetry
- Color: cyan/light blue
- Animation: rotate around axis

**Cube** (earth element)
- 8 vertices, 12 edges, 6 square faces
- Vertex coordinates: ±1 on each axis
- Color: brown/ochre
- Animation: roll/tumble

**Octahedron** (water element)
- 6 vertices, 12 edges, 8 triangular faces
- Vertex coordinates: ±1 on axes
- Color: cyan/turquoise
- Animation: spin/precess

**Dodecahedron** (universe element)
- 20 vertices, 30 edges, 12 pentagonal faces
- Vertex coordinates: φ-based (most complex)
- Color: purple/gold
- Animation: slow rotation

**Icosahedron** (matter element)
- 12 vertices, 30 edges, 20 triangular faces
- Vertex coordinates: complex φ pattern
- Color: red/orange
- Animation: flip/rotate

---

### Key Methods

#### `renderGeometry(shape: PlatonicSolid, animation: Animation): ReactComponent`
**Output**: Remotion-compatible React component

Requirements:
- Must accept frame number as prop (Remotion requirement)
- Must be pure (same input → same output)
- Must run in JS (no WebGL shaders)
- Return SVG or Canvas-based rendering

Implementation approach:
```
1. Calculate vertex positions (static)
2. Apply rotation transform (frame-dependent)
   rotation = frame * rotationSpeed * (360 / fps / duration)
3. Apply scaling animation (frame-dependent)
   scale = baseScale + audioScale * audioFeature[frame]
4. Apply color mapping (frame-dependent)
   color = mapFrequencyToColor(audioFrequency[frame])
5. Project 3D to 2D (orthographic or perspective)
6. Render edges and faces with depth sorting
7. Return SVG group
```

---

#### `applyGoldenRatio(element: Element, dimension: 'width' | 'height'): Element`
**Responsibility**: Scale element according to φ

Logic:
```
if (dimension === 'width'):
  newHeight = width / φ
  OR
  newHeight = width * φ
else:
  newWidth = height * φ
  OR
  newWidth = height / φ
```

---

#### `mapFrequencyToColor(frequency: number, colorMap: ColorMapping): string`
**Responsibility**: Map audio frequency to RGB/HSL color

For 'frequency' mode:
```
1. Normalize frequency to perceptual scale (log)
2. Map to hue (0-360°):
   hue = (log(frequency) / log(20000)) * 360
3. Set saturation based on magnitude
   saturation = min(100, magnitude * 100)
4. Set lightness based on harmonic fit
   lightness = 50 + harmonicAlignment * 20
5. Return HSL string
```

---

## 4. FREQUENCY VISUALIZER (src/visualization/frequency-visualizer.ts)

### Purpose
Display audio spectrum with 432 Hz emphasis

### Configuration
```typescript
Config: {
  displayMode: 'bars' | 'waveform' | 'surface3d'
  frequencyBands: FrequencyBand[]
  emphasize432Hz: boolean
  colorScheme: ColorScheme
  smoothing: number // 0-1, temporal smoothing
  peakHold: number // frames to hold peaks
}
```

### Key Methods

#### `visualizeSpectrum(frequencies: Float32Array, frame: number): ReactComponent`
**Responsibility**: Render FFT magnitude spectrum

Implementation:
```
1. Normalize frequencies to display range (20Hz - 20kHz)
2. Convert to log scale (perceptually uniform)
3. For each frequency bin:
   a. Calculate bar height (proportional to magnitude)
   b. Apply temporal smoothing (filter previous values)
   c. Apply peak hold (keep peak value for N frames)
   d. Map to color (freq → hue)
   e. Render bar with animation
4. Overlay 432 Hz reference line
5. Label frequency bands (bass, mid, treble)
6. Return SVG component
```

---

#### `emphasize432Hz(frequencies: Float32Array, magnitude: number): Float32Array`
**Responsibility**: Boost 432 Hz fundamental and harmonics

Algorithm:
```
1. Identify 432 Hz bin index in frequency array
2. For 432 Hz bin: multiply magnitude by (1 + emphasis)
3. For harmonic bins (864, 1296, 2160, etc.):
   magnitude *= (1 + emphasis * harmonicWeight)
   (harmonicWeight decreases with harmonic number)
4. Normalize to prevent clipping
5. Return modified frequencies
```

---

## 5. RENDERING ENGINE (src/rendering/render-engine.ts)

### Purpose
Execute Remotion composition rendering with quality validation

### Quality Presets

**FAST**
- Codec: h264
- Bitrate: 2 Mbps
- FPS: 24
- Sample: 2 (every 2 frames)
- Estimated size: ~50 MB/min
- Render time: ~30 sec per 1 min video

**BALANCED**
- Codec: vp9
- Bitrate: 4 Mbps
- FPS: 30
- Sample: 1 (every frame)
- Estimated size: ~150 MB/min
- Render time: ~2 min per 1 min video

**HIGH**
- Codec: prores (12-bit)
- Bitrate: 8 Mbps
- FPS: 60
- Sample: 1 (every frame)
- Estimated size: ~300 MB/min
- Render time: ~4 min per 1 min video

**MASTER**
- Codec: prores-hq
- Bitrate: 12+ Mbps
- FPS: 60
- Sample: 1 (every frame)
- Estimated size: ~450+ MB/min
- Render time: ~6 min per 1 min video

---

### Key Methods

#### `render(composition: CompositionData, config: RenderConfig): Promise<RenderResult>`
**Responsibility**: Execute Remotion render

Process:
```
1. Validate composition integrity
2. Determine render parameters from QualityPreset
3. Invoke Remotion CLI:
   remotion render compositions/DefaultComposition.tsx \
     --codec h264 --bitrate 4000k --fps 30 \
     --output-format mp4 --concurrency 4
4. Monitor render progress:
   - Poll status file
   - Track frame completion
   - Monitor memory/CPU
   - Estimate remaining time
5. On completion:
   - Verify output file integrity
   - Run quality validation
   - Calculate metrics
6. Return RenderResult with output path + metrics
```

---

#### `validateQuality(outputPath: string, reference: CompositionData): QualityValidationResult`
**Responsibility**: Check output quality against expectations

Validation checks:
```
1. File Integrity
   ✓ File exists and is readable
   ✓ File size > 0
   ✓ Video codec correct
   
2. Metadata
   ✓ Duration matches composition duration
   ✓ FPS matches configuration
   ✓ Resolution matches configuration
   ✓ Audio present (if expected)
   
3. Content Validation
   ✓ Frame sampling (spot-check frames)
   ✓ Color accuracy (sample pixels)
   ✓ Audio sync (compare audio envelope)
   ✓ Animation smoothness (no jumps)
   
4. Performance Metrics
   ✓ Bitrate within tolerance (±10%)
   ✓ Temporal consistency
   ✓ No frame drops
```

Return severity levels:
- Error: Critical failure, output unusable
- Warning: Quality issue, output usable
- Info: Minor issue, acceptable quality

---

## 6. MAGNUS INTEGRATION (src/integration/magnus-integration.ts)

### Purpose
Connect Remotion to Magnus 13.2 orchestration system

### Integration Points

#### 1. Agent Registration
```typescript
registerAgent(): {
  name: 'remotion-orchestrator',
  role: 'Video Composition & Visualization',
  capabilities: [
    'audio-analysis',
    'composition',
    'rendering',
    'synchronization'
  ],
  requirements: {
    minMemory: 2000, // MB
    minDiskSpace: 10000, // MB
    cpuCores: 2
  }
}
```

#### 2. Task Execution
```typescript
executeTask(input: MagnusTaskInput): MagnusTaskOutput {
  1. Parse input (composition request)
  2. Perform analysis phase (< 5 seconds)
  3. Perform composition phase (< 5 seconds)
  4. Perform rendering phase (varies by duration)
  5. Perform validation phase (< 30 seconds)
  6. Report to Magnus with:
     - sessionId
     - convergenceData
     - metrics
     - output path
}
```

#### 3. Convergence Validation
```typescript
validateConvergence(output: VideoFile, intention: string): ConvergenceData {
  1. Analyze output video
  2. Compare to intention
  3. Score multiple dimensions:
     - Recognition: Does output look intentional?
     - Inevitability: Does it feel necessary/right?
     - Coherence: Do visuals match audio perfectly?
     - Geometric: Does it follow sacred geometry?
     - Frequency: Does it represent frequencies correctly?
  4. Return ConvergenceData with overall score
  5. Return outcome: CONVERGED | PARTIAL | FAILED
}
```

#### 4. Learning Feedback
```typescript
recordLearning(session: MagnusSessionContext, outcome: ConvergenceData) {
  1. Extract decision points (template, visualizations, quality, etc.)
  2. Extract outcomes (convergence score, render time, file size, etc.)
  3. Record in Magnus learning system
  4. System learns which decisions lead to convergence
}
```

---

## 7. REST API LAYER (src/api/routes.ts)

### Endpoint Specifications

#### POST /api/remotion/compose
**Purpose**: Initiate video composition

Request validation:
- audioPath XOR audioBuffer (one required)
- metadata.duration > 0
- metadata.duration < 3600000 (max 1 hour)
- qualityPreset must be valid
- outputFormat must be valid

Response: CompositionJobResponse
- jobId: unique ID
- sessionId: Magnus session ID
- estimate: EstimateData
- status: 'queued'

---

#### GET /api/remotion/compose/:jobId
**Purpose**: Poll job status

Response: JobStatusResponse
- status: current render status
- progress: 0-100 percentage
- outputPath: (when complete)
- convergenceData: (when validated)
- errors: (if any)

---

#### POST /api/remotion/validate
**Purpose**: Validate output convergence

Request:
- outputPath: path to video file
- intention: original composition intent
- developerFeedback: optional feedback

Response:
- isValid: boolean
- convergenceScore: number
- metrics: detailed scoring breakdown
- recommendations: improvement suggestions

---

## 8. ERROR HANDLING Strategy

### Error Categories

**Input Errors** (HTTP 400)
- Invalid audio file
- Missing metadata fields
- Invalid quality preset
- Unsupported format
Recovery: Return detailed error message with valid options

**Processing Errors** (HTTP 500)
- Audio analysis failure
- Composition build failure
- Render failure
- Validation failure
Recovery: Log with context, return error ID for support

**Resource Errors** (HTTP 429)
- Disk space exhausted
- Memory exhausted
- Render queue full
Recovery: Return retry-after header, suggest optimization

**Configuration Errors** (HTTP 500)
- Invalid Remotion config
- Missing dependencies
- File permission issues
Recovery: Check logs, validate environment

---

### Error Recovery Strategies

```
Level 1: Automatic Recovery
- Retry with exponential backoff
- Fall back to lower quality preset
- Split composition into segments

Level 2: Escalation to Magnus
- Report to Magnus learning system
- Request alternative strategy
- Alert orchestrator

Level 3: Manual Intervention Required
- Notify admin
- Provide diagnostic data
- Suggest corrective actions
```

---

**Component Specifications Version**: 1.0
**Status**: Ready for Implementation
**Last Updated**: January 28, 2026
