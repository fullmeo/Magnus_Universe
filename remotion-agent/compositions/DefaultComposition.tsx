/**
 * REMOTION AGENT - DEFAULT COMPOSITION
 *
 * React/Remotion composition template for video rendering
 * Integrates sacred geometry, frequency visualization, and waveforms
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';

// Sacred constants
const PHI = 1.618033988749894;
const PHI_INVERSE = 0.618033988749894;

// ============================================================================
// TYPES
// ============================================================================

interface CompositionProps {
  composition?: {
    layers: Array<{
      id: string;
      type: string;
      animations: Array<{
        property: string;
        keyframes: Array<{ frameNumber: number; value: number }>;
      }>;
      properties: Record<string, unknown>;
    }>;
    timeline: {
      fps: number;
      duration: number;
      totalFrames: number;
    };
    synchronization: {
      beatFrames: number[];
      onsetFrames: number[];
    };
    sacredGeometry?: {
      shape: string;
      vertices: Array<{ x: number; y: number; z: number }>;
      edges: Array<{ start: number; end: number }>;
    };
  };
  audioPath?: string;
}

// ============================================================================
// HELPER HOOKS
// ============================================================================

function useAnimatedValue(
  animations: CompositionProps['composition']['layers'][0]['animations'],
  property: string,
  defaultValue: number = 0
): number {
  const frame = useCurrentFrame();
  const animation = animations?.find(a => a.property === property);

  if (!animation || animation.keyframes.length === 0) {
    return defaultValue;
  }

  const keyframes = animation.keyframes.sort((a, b) => a.frameNumber - b.frameNumber);

  // Find surrounding keyframes
  let prevKf = keyframes[0];
  let nextKf = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (frame >= keyframes[i].frameNumber && frame <= keyframes[i + 1].frameNumber) {
      prevKf = keyframes[i];
      nextKf = keyframes[i + 1];
      break;
    }
  }

  if (frame <= prevKf.frameNumber) return prevKf.value as number;
  if (frame >= nextKf.frameNumber) return nextKf.value as number;

  // Interpolate
  return interpolate(
    frame,
    [prevKf.frameNumber, nextKf.frameNumber],
    [prevKf.value as number, nextKf.value as number],
    { easing: Easing.inOut(Easing.ease) }
  );
}

function useBeatPulse(beatFrames: number[] = [], decayFrames: number = 10): number {
  const frame = useCurrentFrame();

  let pulse = 0;
  for (const beatFrame of beatFrames) {
    const diff = frame - beatFrame;
    if (diff >= 0 && diff < decayFrames) {
      const beatPulse = 1 - (diff / decayFrames);
      pulse = Math.max(pulse, beatPulse);
    }
  }

  return pulse;
}

// ============================================================================
// GEOMETRY COMPONENT
// ============================================================================

interface GeometryLayerProps {
  animations: CompositionProps['composition']['layers'][0]['animations'];
  properties: Record<string, unknown>;
  beatFrames: number[];
  sacredGeometry?: CompositionProps['composition']['sacredGeometry'];
}

const GeometryLayer: React.FC<GeometryLayerProps> = ({
  animations,
  properties,
  beatFrames,
  sacredGeometry
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const rotation = useAnimatedValue(animations, 'rotation', 0);
  const scale = useAnimatedValue(animations, 'scale', 1);
  const hue = useAnimatedValue(animations, 'hue', 180);
  const pulse = useBeatPulse(beatFrames, 15);

  const centerX = width / 2;
  const centerY = height / 2;
  const baseSize = Math.min(width, height) * 0.3;

  // Default dodecahedron-like shape
  const points = useMemo(() => {
    if (sacredGeometry?.vertices && sacredGeometry.vertices.length > 0) {
      return sacredGeometry.vertices;
    }

    // Generate default vertices for a dodecahedron projection
    const vertices: Array<{ x: number; y: number; z: number }> = [];
    const numPoints = 12;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const layer = Math.floor(i / 4);
      const z = (layer - 1) * 0.5;

      vertices.push({
        x: Math.cos(angle + layer * 0.5) * (1 - Math.abs(z) * 0.3),
        y: Math.sin(angle + layer * 0.5) * (1 - Math.abs(z) * 0.3),
        z
      });
    }

    return vertices;
  }, [sacredGeometry]);

  // Project 3D to 2D with rotation
  const projected = useMemo(() => {
    const rad = (rotation * Math.PI) / 180;
    const cosR = Math.cos(rad);
    const sinR = Math.sin(rad);

    return points.map(p => {
      // Rotate around Y axis
      const x1 = p.x * cosR + p.z * sinR;
      const z1 = -p.x * sinR + p.z * cosR;

      // Perspective projection
      const perspective = 3 / (3 + z1);
      const finalScale = scale * (1 + pulse * 0.3);

      return {
        x: centerX + x1 * baseSize * finalScale * perspective,
        y: centerY + p.y * baseSize * finalScale * perspective,
        depth: z1
      };
    });
  }, [points, rotation, scale, pulse, centerX, centerY, baseSize]);

  // Generate edges
  const edges = useMemo(() => {
    if (sacredGeometry?.edges && sacredGeometry.edges.length > 0) {
      return sacredGeometry.edges;
    }

    // Default edge connections
    const e: Array<{ start: number; end: number }> = [];
    for (let i = 0; i < points.length; i++) {
      e.push({ start: i, end: (i + 1) % points.length });
      if (i < points.length - 4) {
        e.push({ start: i, end: i + 4 });
      }
    }
    return e;
  }, [points.length, sacredGeometry]);

  const color = `hsl(${hue}, 80%, ${50 + pulse * 30}%)`;
  const glowColor = `hsl(${hue}, 100%, 70%)`;

  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render edges */}
        {edges.map((edge, i) => {
          const start = projected[edge.start];
          const end = projected[edge.end];
          if (!start || !end) return null;

          const avgDepth = (start.depth + end.depth) / 2;
          const opacity = 0.3 + (avgDepth + 1) * 0.35;

          return (
            <line
              key={i}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={color}
              strokeWidth={2 + pulse * 2}
              opacity={opacity}
              filter="url(#glow)"
            />
          );
        })}

        {/* Render vertices */}
        {projected.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3 + pulse * 3}
            fill={glowColor}
            opacity={0.5 + (p.depth + 1) * 0.25}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// SPECTRUM COMPONENT
// ============================================================================

interface SpectrumLayerProps {
  animations: CompositionProps['composition']['layers'][0]['animations'];
  properties: Record<string, unknown>;
  beatFrames: number[];
}

const SpectrumLayer: React.FC<SpectrumLayerProps> = ({
  animations,
  properties,
  beatFrames
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const intensity = useAnimatedValue(animations, 'intensity', 0.5);
  const pulse = useBeatPulse(beatFrames, 10);

  const barCount = 64;
  const barWidth = (width * 0.8) / barCount;
  const maxHeight = height * 0.2;
  const startX = width * 0.1;
  const baseY = height * 0.85;

  // Generate spectrum bars
  const bars = useMemo(() => {
    const result = [];
    for (let i = 0; i < barCount; i++) {
      // Simulate frequency response
      const freq = (i / barCount) * 20000;
      const isNear432 = Math.abs(freq - 432) < 50 || Math.abs(freq - 864) < 50;

      // Create varied heights based on "frequency"
      const baseHeight = Math.sin(i * 0.2 + frame * 0.05) * 0.3 + 0.5;
      const height = baseHeight * intensity * (1 + pulse * 0.5) * maxHeight;

      // Color based on frequency (rainbow)
      const hue = (i / barCount) * 270;
      const isEmphasis = isNear432 && (properties as any)?.emphasize432Hz;

      result.push({
        x: startX + i * barWidth,
        height,
        color: isEmphasis ? '#FFD700' : `hsl(${hue}, 80%, ${40 + intensity * 30}%)`,
        isEmphasis
      });
    }
    return result;
  }, [frame, barCount, intensity, pulse, maxHeight, startX, barWidth, properties]);

  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        {bars.map((bar, i) => (
          <React.Fragment key={i}>
            <rect
              x={bar.x}
              y={baseY - bar.height}
              width={barWidth - 2}
              height={bar.height}
              fill={bar.color}
              opacity={0.8}
            />
            {bar.isEmphasis && (
              <rect
                x={bar.x - 2}
                y={baseY - bar.height - 2}
                width={barWidth + 2}
                height={bar.height + 4}
                fill={bar.color}
                opacity={0.3}
                filter="url(#glow)"
              />
            )}
          </React.Fragment>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// WAVEFORM COMPONENT
// ============================================================================

interface WaveformLayerProps {
  animations: CompositionProps['composition']['layers'][0]['animations'];
  properties: Record<string, unknown>;
  beatFrames: number[];
}

const WaveformLayer: React.FC<WaveformLayerProps> = ({
  animations,
  properties,
  beatFrames
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const amplitude = useAnimatedValue(animations, 'amplitude', 0.5);
  const pulse = useBeatPulse(beatFrames, 8);

  const centerY = height / 2;
  const maxAmplitude = height * 0.3 * (1 + pulse * 0.5);

  // Generate waveform path
  const path = useMemo(() => {
    const points: string[] = [];
    const sampleCount = 256;

    for (let i = 0; i < sampleCount; i++) {
      const x = (i / sampleCount) * width;
      const t = i / sampleCount + frame * 0.01;

      // Simulate audio waveform
      const wave =
        Math.sin(t * Math.PI * 4) * 0.5 +
        Math.sin(t * Math.PI * 8) * 0.3 +
        Math.sin(t * Math.PI * 16) * 0.2;

      const y = centerY - wave * amplitude * maxAmplitude;

      points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }

    return points.join(' ');
  }, [frame, width, centerY, amplitude, maxAmplitude]);

  const color = `hsl(${180 + pulse * 60}, 80%, 60%)`;

  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="50%" stopColor="#ff00ff" />
            <stop offset="100%" stopColor="#ffff00" />
          </linearGradient>
        </defs>
        <path
          d={path}
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth={2 + pulse * 2}
          opacity={0.6}
        />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={1}
          opacity={0.8}
          filter="url(#glow)"
        />
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// BACKGROUND COMPONENT
// ============================================================================

interface BackgroundLayerProps {
  animations: CompositionProps['composition']['layers'][0]['animations'];
  properties: Record<string, unknown>;
}

const BackgroundLayer: React.FC<BackgroundLayerProps> = ({ animations, properties }) => {
  const brightness = useAnimatedValue(animations, 'brightness', 1);

  const baseColor = (properties as any)?.color || '#0a0a1a';

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${baseColor} 0%, #000000 100%)`,
        filter: `brightness(${brightness})`
      }}
    />
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================

export const DefaultComposition: React.FC<CompositionProps> = ({ composition, audioPath }) => {
  const { fps } = useVideoConfig();

  if (!composition) {
    // Fallback to demo content
    return (
      <AbsoluteFill style={{ backgroundColor: '#0a0a1a' }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: 32,
          fontFamily: 'monospace'
        }}>
          Remotion Agent - Sacred Geometry
        </div>
      </AbsoluteFill>
    );
  }

  const beatFrames = composition.synchronization?.beatFrames || [];

  return (
    <AbsoluteFill>
      {composition.layers.map((layer) => {
        switch (layer.type) {
          case 'background':
            return (
              <BackgroundLayer
                key={layer.id}
                animations={layer.animations}
                properties={layer.properties}
              />
            );
          case 'geometry':
            return (
              <GeometryLayer
                key={layer.id}
                animations={layer.animations}
                properties={layer.properties}
                beatFrames={beatFrames}
                sacredGeometry={composition.sacredGeometry}
              />
            );
          case 'spectrum':
            return (
              <SpectrumLayer
                key={layer.id}
                animations={layer.animations}
                properties={layer.properties}
                beatFrames={beatFrames}
              />
            );
          case 'waveform':
            return (
              <WaveformLayer
                key={layer.id}
                animations={layer.animations}
                properties={layer.properties}
                beatFrames={beatFrames}
              />
            );
          default:
            return null;
        }
      })}
    </AbsoluteFill>
  );
};

export default DefaultComposition;
