/**
 * REMOTION AGENT - GEOMETRY RENDERER
 *
 * Renders sacred geometry with Golden Ratio (φ) and Platonic solids
 * Provides 3D to 2D projection and animation support
 * Integrates with audio analysis for reactive visualizations
 */

import {
  Vector3,
  PlatonicSolid,
  SacredGeometryConfig,
  SacredGeometryData,
  Edge,
  Face,
  ColorMapping,
  AudioAnalysisResult,
  SACRED_CONSTANTS
} from '../types';
import { createLogger, RemotionLogger } from '../utils/logger';
import { platonicSolids } from '../config/defaults';

// ============================================================================
// GEOMETRY RENDERER TYPES
// ============================================================================

export interface GeometryRenderConfig {
  width: number;
  height: number;
  perspective?: boolean;
  fov?: number;
  cameraDistance?: number;
  wireframe?: boolean;
  fillFaces?: boolean;
  faceOpacity?: number;
  edgeColor?: string;
  edgeWidth?: number;
  enableGlow?: boolean;
  glowIntensity?: number;
}

export interface Point2D {
  x: number;
  y: number;
  depth?: number;
}

export interface RenderFrame {
  rotation: { x: number; y: number; z: number };
  scale: number;
  opacity: number;
  hue: number;
  pulseIntensity: number;
}

export interface RenderedGeometry {
  vertices2D: Point2D[];
  edges: Array<{ start: Point2D; end: Point2D; color: string }>;
  faces: Array<{ points: Point2D[]; color: string; opacity: number }>;
  center: Point2D;
  boundingBox: { minX: number; maxX: number; minY: number; maxY: number };
}

// ============================================================================
// GEOMETRY RENDERER CLASS
// ============================================================================

export class GeometryRenderer {
  private config: Required<GeometryRenderConfig>;
  private logger: RemotionLogger;
  private vertexCache: Map<string, Vector3[]> = new Map();

  // Sacred constants
  private readonly PHI = SACRED_CONSTANTS.PHI;
  private readonly PHI_SQUARED = SACRED_CONSTANTS.PHI_SQUARED;
  private readonly PHI_INVERSE = SACRED_CONSTANTS.PHI_INVERSE;
  private readonly FIBONACCI = SACRED_CONSTANTS.FIBONACCI;

  constructor(config: GeometryRenderConfig) {
    this.config = {
      width: config.width,
      height: config.height,
      perspective: config.perspective ?? true,
      fov: config.fov ?? 60,
      cameraDistance: config.cameraDistance ?? 5,
      wireframe: config.wireframe ?? true,
      fillFaces: config.fillFaces ?? true,
      faceOpacity: config.faceOpacity ?? 0.3,
      edgeColor: config.edgeColor ?? '#00ffff',
      edgeWidth: config.edgeWidth ?? 2,
      enableGlow: config.enableGlow ?? true,
      glowIntensity: config.glowIntensity ?? 0.5
    };
    this.logger = createLogger();
  }

  /**
   * Render geometry for a specific frame
   */
  render(
    shape: PlatonicSolid,
    frame: RenderFrame,
    colorMapping?: ColorMapping
  ): RenderedGeometry {
    // Get or generate vertices
    const vertices = this.getVertices(shape);

    // Apply transformations
    const transformed = this.applyTransformations(vertices, frame);

    // Project to 2D
    const vertices2D = this.projectTo2D(transformed);

    // Get edges and faces
    const { edges: edgeIndices, faces: faceIndices } = this.getEdgesAndFaces(shape);

    // Build edge render data
    const edges = edgeIndices.map(edge => {
      const start = vertices2D[edge.start];
      const end = vertices2D[edge.end];
      const color = this.calculateEdgeColor(edge, frame, colorMapping);
      return { start, end, color };
    });

    // Build face render data (sorted by depth for proper rendering)
    const faces = this.buildFaces(faceIndices, vertices2D, transformed, frame, colorMapping);

    // Calculate center and bounding box
    const center = this.calculateCenter(vertices2D);
    const boundingBox = this.calculateBoundingBox(vertices2D);

    return {
      vertices2D,
      edges,
      faces,
      center,
      boundingBox
    };
  }

  /**
   * Generate SVG path data for the geometry
   */
  toSVGPath(rendered: RenderedGeometry, includeGlow: boolean = true): string {
    let svg = '';

    // Add glow filter definition if enabled
    if (this.config.enableGlow && includeGlow) {
      svg += this.generateGlowFilter();
    }

    // Render faces first (background)
    if (this.config.fillFaces) {
      for (const face of rendered.faces) {
        const pathData = face.points.map((p, i) =>
          `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`
        ).join(' ') + ' Z';

        svg += `<path d="${pathData}" fill="${face.color}" fill-opacity="${face.opacity}" />`;
      }
    }

    // Render edges (foreground)
    if (this.config.wireframe) {
      for (const edge of rendered.edges) {
        const filterAttr = this.config.enableGlow ? ' filter="url(#glow)"' : '';
        svg += `<line x1="${edge.start.x.toFixed(2)}" y1="${edge.start.y.toFixed(2)}" ` +
               `x2="${edge.end.x.toFixed(2)}" y2="${edge.end.y.toFixed(2)}" ` +
               `stroke="${edge.color}" stroke-width="${this.config.edgeWidth}"${filterAttr} />`;
      }
    }

    return svg;
  }

  /**
   * Generate React-compatible render props
   */
  toRenderProps(rendered: RenderedGeometry): {
    faces: Array<{ d: string; fill: string; fillOpacity: number }>;
    edges: Array<{ x1: number; y1: number; x2: number; y2: number; stroke: string }>;
  } {
    const faces = rendered.faces.map(face => ({
      d: face.points.map((p, i) =>
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
      ).join(' ') + ' Z',
      fill: face.color,
      fillOpacity: face.opacity
    }));

    const edges = rendered.edges.map(edge => ({
      x1: edge.start.x,
      y1: edge.start.y,
      x2: edge.end.x,
      y2: edge.end.y,
      stroke: edge.color
    }));

    return { faces, edges };
  }

  /**
   * Get vertices for a Platonic solid
   */
  private getVertices(shape: PlatonicSolid): Vector3[] {
    const cacheKey = shape;
    if (this.vertexCache.has(cacheKey)) {
      return this.vertexCache.get(cacheKey)!;
    }

    let vertices: Vector3[];

    switch (shape) {
      case 'tetrahedron':
        vertices = this.generateTetrahedron();
        break;
      case 'cube':
        vertices = this.generateCube();
        break;
      case 'octahedron':
        vertices = this.generateOctahedron();
        break;
      case 'dodecahedron':
        vertices = this.generateDodecahedron();
        break;
      case 'icosahedron':
        vertices = this.generateIcosahedron();
        break;
      case 'merkaba':
        vertices = this.generateMerkaba();
        break;
      case 'torus':
        vertices = this.generateTorus();
        break;
      case 'spiral':
        vertices = this.generateGoldenSpiral();
        break;
      default:
        vertices = this.generateDodecahedron();
    }

    this.vertexCache.set(cacheKey, vertices);
    this.logger.sacredGeometry('vertices_generated', shape, { count: vertices.length });

    return vertices;
  }

  /**
   * Generate Tetrahedron vertices (Fire element)
   */
  private generateTetrahedron(): Vector3[] {
    const a = 1;
    return [
      { x: a, y: a, z: a },
      { x: a, y: -a, z: -a },
      { x: -a, y: a, z: -a },
      { x: -a, y: -a, z: a }
    ];
  }

  /**
   * Generate Cube vertices (Earth element)
   */
  private generateCube(): Vector3[] {
    const a = 1;
    return [
      { x: -a, y: -a, z: -a },
      { x: a, y: -a, z: -a },
      { x: a, y: a, z: -a },
      { x: -a, y: a, z: -a },
      { x: -a, y: -a, z: a },
      { x: a, y: -a, z: a },
      { x: a, y: a, z: a },
      { x: -a, y: a, z: a }
    ];
  }

  /**
   * Generate Octahedron vertices (Air element)
   */
  private generateOctahedron(): Vector3[] {
    const a = 1;
    return [
      { x: a, y: 0, z: 0 },
      { x: -a, y: 0, z: 0 },
      { x: 0, y: a, z: 0 },
      { x: 0, y: -a, z: 0 },
      { x: 0, y: 0, z: a },
      { x: 0, y: 0, z: -a }
    ];
  }

  /**
   * Generate Dodecahedron vertices (Universe/Ether element)
   * Uses Golden Ratio (φ) for vertex positions
   */
  private generateDodecahedron(): Vector3[] {
    const phi = this.PHI;
    const phiInv = this.PHI_INVERSE;

    return [
      // Cube vertices
      { x: 1, y: 1, z: 1 },
      { x: 1, y: 1, z: -1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: -1, z: -1 },
      { x: -1, y: 1, z: 1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: -1, y: -1, z: -1 },
      // Rectangle vertices (φ-based)
      { x: 0, y: phiInv, z: phi },
      { x: 0, y: phiInv, z: -phi },
      { x: 0, y: -phiInv, z: phi },
      { x: 0, y: -phiInv, z: -phi },
      { x: phiInv, y: phi, z: 0 },
      { x: phiInv, y: -phi, z: 0 },
      { x: -phiInv, y: phi, z: 0 },
      { x: -phiInv, y: -phi, z: 0 },
      { x: phi, y: 0, z: phiInv },
      { x: phi, y: 0, z: -phiInv },
      { x: -phi, y: 0, z: phiInv },
      { x: -phi, y: 0, z: -phiInv }
    ];
  }

  /**
   * Generate Icosahedron vertices (Water element)
   * Uses Golden Ratio (φ) for vertex positions
   */
  private generateIcosahedron(): Vector3[] {
    const phi = this.PHI;

    return [
      { x: 0, y: 1, z: phi },
      { x: 0, y: 1, z: -phi },
      { x: 0, y: -1, z: phi },
      { x: 0, y: -1, z: -phi },
      { x: 1, y: phi, z: 0 },
      { x: 1, y: -phi, z: 0 },
      { x: -1, y: phi, z: 0 },
      { x: -1, y: -phi, z: 0 },
      { x: phi, y: 0, z: 1 },
      { x: phi, y: 0, z: -1 },
      { x: -phi, y: 0, z: 1 },
      { x: -phi, y: 0, z: -1 }
    ];
  }

  /**
   * Generate Merkaba (Star Tetrahedron) vertices
   * Two interlocking tetrahedra representing light body
   */
  private generateMerkaba(): Vector3[] {
    const a = 1;
    // Upper tetrahedron
    const upper: Vector3[] = [
      { x: 0, y: a * 1.5, z: 0 },
      { x: a, y: -a * 0.5, z: a },
      { x: a, y: -a * 0.5, z: -a },
      { x: -a, y: -a * 0.5, z: 0 }
    ];
    // Lower tetrahedron (inverted)
    const lower: Vector3[] = [
      { x: 0, y: -a * 1.5, z: 0 },
      { x: -a, y: a * 0.5, z: -a },
      { x: -a, y: a * 0.5, z: a },
      { x: a, y: a * 0.5, z: 0 }
    ];

    return [...upper, ...lower];
  }

  /**
   * Generate Torus vertices
   */
  private generateTorus(): Vector3[] {
    const vertices: Vector3[] = [];
    const majorRadius = 1;
    const minorRadius = 0.4;
    const majorSegments = 24;
    const minorSegments = 12;

    for (let i = 0; i < majorSegments; i++) {
      const u = (i / majorSegments) * Math.PI * 2;
      for (let j = 0; j < minorSegments; j++) {
        const v = (j / minorSegments) * Math.PI * 2;

        const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
        const y = minorRadius * Math.sin(v);
        const z = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);

        vertices.push({ x, y, z });
      }
    }

    return vertices;
  }

  /**
   * Generate Golden Spiral vertices
   */
  private generateGoldenSpiral(): Vector3[] {
    const vertices: Vector3[] = [];
    const turns = 3;
    const pointsPerTurn = 36;
    const totalPoints = turns * pointsPerTurn;

    for (let i = 0; i < totalPoints; i++) {
      const t = i / pointsPerTurn;
      const angle = t * Math.PI * 2;
      const radius = Math.pow(this.PHI, t / (Math.PI * 2)) * 0.1;

      const x = radius * Math.cos(angle);
      const y = t * 0.1; // Spiral upward
      const z = radius * Math.sin(angle);

      vertices.push({ x, y, z });
    }

    return vertices;
  }

  /**
   * Get edges and faces for a shape
   */
  private getEdgesAndFaces(shape: PlatonicSolid): {
    edges: Edge[];
    faces: Face[];
  } {
    switch (shape) {
      case 'tetrahedron':
        return {
          edges: [
            { start: 0, end: 1 }, { start: 0, end: 2 }, { start: 0, end: 3 },
            { start: 1, end: 2 }, { start: 1, end: 3 }, { start: 2, end: 3 }
          ],
          faces: [
            { vertices: [0, 1, 2] }, { vertices: [0, 1, 3] },
            { vertices: [0, 2, 3] }, { vertices: [1, 2, 3] }
          ]
        };

      case 'cube':
        return {
          edges: [
            { start: 0, end: 1 }, { start: 1, end: 2 }, { start: 2, end: 3 }, { start: 3, end: 0 },
            { start: 4, end: 5 }, { start: 5, end: 6 }, { start: 6, end: 7 }, { start: 7, end: 4 },
            { start: 0, end: 4 }, { start: 1, end: 5 }, { start: 2, end: 6 }, { start: 3, end: 7 }
          ],
          faces: [
            { vertices: [0, 1, 2, 3] }, { vertices: [4, 5, 6, 7] },
            { vertices: [0, 1, 5, 4] }, { vertices: [2, 3, 7, 6] },
            { vertices: [0, 3, 7, 4] }, { vertices: [1, 2, 6, 5] }
          ]
        };

      case 'octahedron':
        return {
          edges: [
            { start: 0, end: 2 }, { start: 0, end: 3 }, { start: 0, end: 4 }, { start: 0, end: 5 },
            { start: 1, end: 2 }, { start: 1, end: 3 }, { start: 1, end: 4 }, { start: 1, end: 5 },
            { start: 2, end: 4 }, { start: 2, end: 5 }, { start: 3, end: 4 }, { start: 3, end: 5 }
          ],
          faces: [
            { vertices: [0, 2, 4] }, { vertices: [0, 4, 3] },
            { vertices: [0, 3, 5] }, { vertices: [0, 5, 2] },
            { vertices: [1, 2, 4] }, { vertices: [1, 4, 3] },
            { vertices: [1, 3, 5] }, { vertices: [1, 5, 2] }
          ]
        };

      case 'merkaba':
        return {
          edges: [
            // Upper tetrahedron
            { start: 0, end: 1 }, { start: 0, end: 2 }, { start: 0, end: 3 },
            { start: 1, end: 2 }, { start: 2, end: 3 }, { start: 3, end: 1 },
            // Lower tetrahedron
            { start: 4, end: 5 }, { start: 4, end: 6 }, { start: 4, end: 7 },
            { start: 5, end: 6 }, { start: 6, end: 7 }, { start: 7, end: 5 }
          ],
          faces: [
            { vertices: [0, 1, 2] }, { vertices: [0, 2, 3] },
            { vertices: [0, 3, 1] }, { vertices: [1, 2, 3] },
            { vertices: [4, 5, 6] }, { vertices: [4, 6, 7] },
            { vertices: [4, 7, 5] }, { vertices: [5, 6, 7] }
          ]
        };

      default:
        // Default simplified edges for complex shapes
        return { edges: [], faces: [] };
    }
  }

  /**
   * Apply rotation and scale transformations
   */
  private applyTransformations(vertices: Vector3[], frame: RenderFrame): Vector3[] {
    const { rotation, scale } = frame;
    const transformed: Vector3[] = [];

    for (const v of vertices) {
      let { x, y, z } = v;

      // Rotation around X axis
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      y = y1;
      z = z1;

      // Rotation around Y axis
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const x1 = x * cosY + z * sinY;
      const z2 = -x * sinY + z * cosY;
      x = x1;
      z = z2;

      // Rotation around Z axis
      const cosZ = Math.cos(rotation.z);
      const sinZ = Math.sin(rotation.z);
      const x2 = x * cosZ - y * sinZ;
      const y2 = x * sinZ + y * cosZ;
      x = x2;
      y = y2;

      // Apply scale
      x *= scale;
      y *= scale;
      z *= scale;

      transformed.push({ x, y, z });
    }

    return transformed;
  }

  /**
   * Project 3D vertices to 2D screen coordinates
   */
  private projectTo2D(vertices: Vector3[]): Point2D[] {
    const { width, height, perspective, fov, cameraDistance } = this.config;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) * 0.3;

    const points: Point2D[] = [];

    if (perspective) {
      // Perspective projection
      const fovRad = (fov * Math.PI) / 180;
      const f = 1 / Math.tan(fovRad / 2);

      for (const v of vertices) {
        const z = v.z + cameraDistance;
        const factor = f / (z > 0.1 ? z : 0.1);

        points.push({
          x: centerX + v.x * scale * factor,
          y: centerY - v.y * scale * factor,
          depth: z
        });
      }
    } else {
      // Orthographic projection
      for (const v of vertices) {
        points.push({
          x: centerX + v.x * scale,
          y: centerY - v.y * scale,
          depth: v.z
        });
      }
    }

    return points;
  }

  /**
   * Build face render data with depth sorting
   */
  private buildFaces(
    faceIndices: Face[],
    vertices2D: Point2D[],
    vertices3D: Vector3[],
    frame: RenderFrame,
    colorMapping?: ColorMapping
  ): Array<{ points: Point2D[]; color: string; opacity: number }> {
    const faces: Array<{ points: Point2D[]; color: string; opacity: number; avgDepth: number }> = [];

    for (const face of faceIndices) {
      const points = face.vertices.map(i => vertices2D[i]);
      const avgDepth = face.vertices.reduce((sum, i) => sum + (vertices2D[i].depth || 0), 0) / face.vertices.length;

      // Calculate face normal for backface culling and shading
      const v0 = vertices3D[face.vertices[0]];
      const v1 = vertices3D[face.vertices[1]];
      const v2 = vertices3D[face.vertices[2]];

      // Simple normal calculation
      const ux = v1.x - v0.x, uy = v1.y - v0.y, uz = v1.z - v0.z;
      const vx = v2.x - v0.x, vy = v2.y - v0.y, vz = v2.z - v0.z;
      const nz = ux * vy - uy * vx; // Z component of cross product

      // Backface culling - only render front-facing faces
      if (nz > 0) {
        const color = this.calculateFaceColor(frame, colorMapping, avgDepth);
        const opacity = this.config.faceOpacity * (0.5 + nz * 0.5);

        faces.push({ points, color, opacity, avgDepth });
      }
    }

    // Sort by depth (painter's algorithm)
    faces.sort((a, b) => b.avgDepth - a.avgDepth);

    return faces.map(({ points, color, opacity }) => ({ points, color, opacity }));
  }

  /**
   * Calculate edge color based on frame state
   */
  private calculateEdgeColor(edge: Edge, frame: RenderFrame, colorMapping?: ColorMapping): string {
    const baseHue = frame.hue;
    const pulse = frame.pulseIntensity;

    // Apply golden ratio color shift
    const hue = (baseHue + edge.start * (360 / this.PHI)) % 360;
    const saturation = 80 + pulse * 20;
    const lightness = 50 + pulse * 30;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * Calculate face color based on frame state
   */
  private calculateFaceColor(frame: RenderFrame, colorMapping?: ColorMapping, depth?: number): string {
    const baseHue = frame.hue;
    const depthFactor = depth ? Math.max(0.3, 1 - depth * 0.1) : 1;

    const hue = baseHue;
    const saturation = 60 * depthFactor;
    const lightness = 30 * depthFactor;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * Calculate center of vertices
   */
  private calculateCenter(vertices: Point2D[]): Point2D {
    const sum = vertices.reduce(
      (acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }),
      { x: 0, y: 0 }
    );
    return {
      x: sum.x / vertices.length,
      y: sum.y / vertices.length
    };
  }

  /**
   * Calculate bounding box
   */
  private calculateBoundingBox(vertices: Point2D[]): {
    minX: number; maxX: number; minY: number; maxY: number;
  } {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const v of vertices) {
      minX = Math.min(minX, v.x);
      maxX = Math.max(maxX, v.x);
      minY = Math.min(minY, v.y);
      maxY = Math.max(maxY, v.y);
    }

    return { minX, maxX, minY, maxY };
  }

  /**
   * Generate SVG glow filter
   */
  private generateGlowFilter(): string {
    const intensity = this.config.glowIntensity;
    return `
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="${3 * intensity}" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    `;
  }

  /**
   * Apply Golden Ratio scaling to a value
   */
  applyGoldenRatio(value: number, power: number = 1): number {
    return value * Math.pow(this.PHI, power);
  }

  /**
   * Get Fibonacci sequence value
   */
  getFibonacci(index: number): number {
    if (index < this.FIBONACCI.length) {
      return this.FIBONACCI[index];
    }
    // Calculate beyond cached values
    let a = this.FIBONACCI[this.FIBONACCI.length - 2];
    let b = this.FIBONACCI[this.FIBONACCI.length - 1];
    for (let i = this.FIBONACCI.length; i <= index; i++) {
      const temp = a + b;
      a = b;
      b = temp;
    }
    return b;
  }

  /**
   * Create frame state from audio analysis at a given time
   */
  createFrameFromAudio(
    time: number,
    analysis: AudioAnalysisResult,
    fps: number,
    baseRotationSpeed: number = 0.01
  ): RenderFrame {
    // Find relevant audio data
    const nearbyBeat = analysis.beats.find(b => Math.abs(b.time - time) < 100);
    const pulseIntensity = nearbyBeat ? nearbyBeat.strength : 0;

    // Calculate rotation based on time and phi
    const rotation = {
      x: time * baseRotationSpeed * this.PHI_INVERSE,
      y: time * baseRotationSpeed,
      z: time * baseRotationSpeed * this.PHI_INVERSE * 0.5
    };

    // Scale with beat pulse
    const scale = 1 + pulseIntensity * 0.3;

    // Hue from spectral centroid
    const frameIndex = Math.floor((time / 1000) * fps);
    const centroidIndex = Math.min(
      analysis.spectralCentroid.length - 1,
      Math.floor((frameIndex / fps) * analysis.spectralCentroid.length / (analysis.duration / 1000))
    );
    const centroid = analysis.spectralCentroid[centroidIndex] || 1000;
    const hue = (Math.log(centroid) / Math.log(10000)) * 360;

    return {
      rotation,
      scale,
      opacity: 1,
      hue,
      pulseIntensity
    };
  }
}

export default GeometryRenderer;
