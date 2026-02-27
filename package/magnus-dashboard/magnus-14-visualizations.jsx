/**
 * Magnus 14 Canvas Visualizations
 *
 * Native Canvas API implementations for Magnus 14 dashboards
 * Features:
 * - 6-Engine Radar Chart (circular multi-axis visualization)
 * - Accuracy Metrics Dashboard (stat cards + progress bars)
 * - Learning Trend Chart (line chart with history)
 * - No external chart libraries (pure Canvas)
 */

// ============================================================================
// 6-Engine Radar Chart Component
// ============================================================================

export function SixEngineRadar({ analysisData, size = 400 }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current || !analysisData) return;
    drawSixEngineRadar(canvasRef.current, analysisData, size);
  }, [analysisData, size]);

  return (
    <div className="radar-container">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
      />
      <div className="radar-legend">
        <div className="legend-row">
          <span className="legend-dot spiral"></span>
          <span>Spiral Analysis</span>
        </div>
        <div className="legend-row">
          <span className="legend-dot domain"></span>
          <span>Domain Analysis</span>
        </div>
        <div className="legend-row">
          <span className="legend-dot poc"></span>
          <span>PoC Analysis</span>
        </div>
        <div className="legend-row">
          <span className="legend-dot integration"></span>
          <span>Integration Analysis</span>
        </div>
        <div className="legend-row">
          <span className="legend-dot sideproject"></span>
          <span>Side Project Analysis</span>
        </div>
        <div className="legend-row">
          <span className="legend-dot framework"></span>
          <span>Framework Analysis</span>
        </div>
      </div>
    </div>
  );
}

function drawSixEngineRadar(canvas, analysisData, size) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = (size / 2) * 0.75;
  const numAxes = 6;

  // Engine data (normalized to 0-1 scale)
  const engineNames = [
    'Spiral',
    'Domain',
    'PoC',
    'Integration',
    'Side Project',
    'Framework'
  ];

  const engineColors = [
    '#FF6B6B', // Spiral - Red
    '#4ECDC4', // Domain - Teal
    '#45B7D1', // PoC - Blue
    '#96CEB4', // Integration - Green
    '#FFEAA7', // Side Project - Yellow
    '#DDA15E'  // Framework - Brown
  ];

  const engineValues = [
    analysisData?.spiral?.confidence || 0.5,
    analysisData?.domain?.confidence || 0.5,
    analysisData?.poc?.confidence || 0.5,
    analysisData?.integration?.confidence || 0.5,
    analysisData?.sideProject?.confidence || 0.5,
    analysisData?.framework?.confidence || 0.5
  ];

  // Clear canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Draw background grid (concentric circles)
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    const radius = (maxRadius / 5) * i;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw percentage labels on right edge
  ctx.fillStyle = '#999';
  ctx.font = '11px Arial';
  ctx.textAlign = 'center';
  for (let i = 1; i <= 5; i++) {
    const y = centerY - (maxRadius / 5) * i;
    ctx.fillText(`${i * 20}%`, size - 20, y + 4);
  }

  // Draw axes
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  for (let i = 0; i < numAxes; i++) {
    const angle = (i / numAxes) * Math.PI * 2 - Math.PI / 2;
    const x = centerX + Math.cos(angle) * maxRadius;
    const y = centerY + Math.sin(angle) * maxRadius;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Draw engine labels
    const labelDist = maxRadius + 25;
    const labelX = centerX + Math.cos(angle) * labelDist;
    const labelY = centerY + Math.sin(angle) * labelDist;

    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(engineNames[i], labelX, labelY);
  }

  // Draw data polygon
  ctx.fillStyle = 'rgba(33, 150, 243, 0.2)';
  ctx.strokeStyle = '#2196F3';
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i < numAxes; i++) {
    const angle = (i / numAxes) * Math.PI * 2 - Math.PI / 2;
    const radius = engineValues[i] * maxRadius;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw data points
  for (let i = 0; i < numAxes; i++) {
    const angle = (i / numAxes) * Math.PI * 2 - Math.PI / 2;
    const radius = engineValues[i] * maxRadius;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    ctx.fillStyle = engineColors[i];
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw value label at point
    ctx.fillStyle = '#333';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    const offset = 15;
    const labelAngle = (i / numAxes) * Math.PI * 2 - Math.PI / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius + offset);
    const labelY = centerY + Math.sin(labelAngle) * (radius + offset);
    ctx.fillText(`${(engineValues[i] * 100).toFixed(0)}%`, labelX, labelY);
  }

  // Draw center circle
  ctx.fillStyle = '#2196F3';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
  ctx.fill();
}

// ============================================================================
// Learning Metrics Chart Component
// ============================================================================

export function LearningMetricsChart({ metrics, width = 600, height = 300 }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current || !metrics) return;
    drawLearningChart(canvasRef.current, metrics, width, height);
  }, [metrics, width, height]);

  return (
    <div className="chart-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          border: '1px solid #e0e0e0',
          borderRadius: '4px'
        }}
      />
    </div>
  );
}

function drawLearningChart(canvas, metrics, width, height) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Clear canvas
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, width, height);

  // Draw grid
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const y = padding + ((height - padding * 2) / 10) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Draw axes
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.stroke();

  // Draw Y-axis labels
  ctx.fillStyle = '#666';
  ctx.font = '11px Arial';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 10; i++) {
    const y = padding + ((height - padding * 2) / 10) * i;
    ctx.fillText(`${100 - i * 10}%`, padding - 8, y + 4);
  }

  // Draw sample data points (placeholder)
  const dataPoints = [
    { x: 0, accuracy: 0.65 },
    { x: 1, accuracy: 0.68 },
    { x: 2, accuracy: 0.72 },
    { x: 3, accuracy: 0.75 },
    { x: 4, accuracy: 0.78 },
    { x: 5, accuracy: 0.82 }
  ];

  // Draw trend line
  ctx.strokeStyle = '#2196F3';
  ctx.lineWidth = 2;
  ctx.beginPath();

  dataPoints.forEach((point, index) => {
    const x = padding + (chartWidth / (dataPoints.length - 1)) * point.x;
    const y = height - padding - (point.accuracy * chartHeight);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Draw data points
  ctx.fillStyle = '#2196F3';
  dataPoints.forEach((point) => {
    const x = padding + (chartWidth / (dataPoints.length - 1)) * point.x;
    const y = height - padding - (point.accuracy * chartHeight);

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw 70% threshold line
  const thresholdY = height - padding - (0.7 * chartHeight);
  ctx.strokeStyle = '#FF9800';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(padding, thresholdY);
  ctx.lineTo(width - padding, thresholdY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#FF9800';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Target (70%)', width - padding + 5, thresholdY);

  // X-axis label
  ctx.fillStyle = '#666';
  ctx.font = '11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Analysis Count', (padding + width - padding) / 2, height - 10);
}

// ============================================================================
// Accuracy Tracker Component
// ============================================================================

export function AccuracyTracker({ accuracyData, width = 300 }) {
  return (
    <div className="accuracy-tracker">
      <div className="tracker-metric">
        <div className="metric-label">Spiral Accuracy</div>
        <div className="metric-bar-container">
          <div
            className="metric-bar-fill"
            style={{
              width: `${(accuracyData?.spiralAccuracy || 0) * 100}%`,
              backgroundColor: '#FF6B6B'
            }}
          />
        </div>
        <div className="metric-value">
          {((accuracyData?.spiralAccuracy || 0) * 100).toFixed(0)}%
        </div>
      </div>

      <div className="tracker-metric">
        <div className="metric-label">Integration Accuracy</div>
        <div className="metric-bar-container">
          <div
            className="metric-bar-fill"
            style={{
              width: `${(accuracyData?.integrationAccuracy || 0) * 100}%`,
              backgroundColor: '#96CEB4'
            }}
          />
        </div>
        <div className="metric-value">
          {((accuracyData?.integrationAccuracy || 0) * 100).toFixed(0)}%
        </div>
      </div>

      <div className="tracker-metric">
        <div className="metric-label">Duration Accuracy</div>
        <div className="metric-bar-container">
          <div
            className="metric-bar-fill"
            style={{
              width: `${(accuracyData?.durationAccuracy || 0) * 100}%`,
              backgroundColor: '#45B7D1'
            }}
          />
        </div>
        <div className="metric-value">
          {((accuracyData?.durationAccuracy || 0) * 100).toFixed(0)}%
        </div>
      </div>

      <div className="tracker-metric highlight">
        <div className="metric-label">Overall Accuracy</div>
        <div className="metric-bar-container">
          <div
            className="metric-bar-fill"
            style={{
              width: `${(accuracyData?.overallAccuracy || 0) * 100}%`,
              backgroundColor: '#9C27B0'
            }}
          />
        </div>
        <div className="metric-value">
          {((accuracyData?.overallAccuracy || 0) * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Domain Parameters Heatmap Component
// ============================================================================

export function DomainParametersHeatmap({ domains, width = 500 }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current || !domains || domains.length === 0) return;
    drawDomainHeatmap(canvasRef.current, domains, width);
  }, [domains, width]);

  return (
    <div className="heatmap-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={Math.max(200, domains?.length * 30 || 200)}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
      />
    </div>
  );
}

function drawDomainHeatmap(canvas, domains, width) {
  if (!canvas || !domains) return;

  const ctx = canvas.getContext('2d');
  const height = canvas.height;
  const cellHeight = 24;
  const padding = 150;

  // Clear canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Draw domain names and parameters
  domains.forEach((domain, index) => {
    const y = padding + index * cellHeight;

    // Draw domain name
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(domain.name, 120, y + 16);

    // Draw parameter bars
    const params = domain.parameters || {};
    const spiralMult = params.spiralMultiplier || 1.0;
    const integrationMult = params.integrationMultiplier || 1.75;
    const durationMult = params.durationMultiplier || 1.0;

    // Spiral multiplier bar
    drawParameterBar(
      ctx,
      130,
      y + 4,
      100,
      8,
      spiralMult / 2,
      '#FF6B6B'
    );

    // Integration multiplier bar
    drawParameterBar(
      ctx,
      240,
      y + 4,
      100,
      8,
      integrationMult / 2,
      '#96CEB4'
    );

    // Duration multiplier bar
    drawParameterBar(
      ctx,
      350,
      y + 4,
      100,
      8,
      durationMult / 2,
      '#45B7D1'
    );
  });

  // Draw column headers
  ctx.fillStyle = '#666';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Spiral', 180, padding - 10);
  ctx.fillText('Integration', 290, padding - 10);
  ctx.fillText('Duration', 400, padding - 10);
}

function drawParameterBar(ctx, x, y, width, height, value, color) {
  // Background
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(x, y, width, height);

  // Value bar
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width * Math.min(value, 1), height);

  // Border
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
}

// ============================================================================
// Mini Chart Component (for cards)
// ============================================================================

export function MiniChart({ type = 'bar', data = [], color = '#2196F3' }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    if (type === 'bar') {
      drawMiniBarChart(ctx, data, width, height, color);
    } else if (type === 'line') {
      drawMiniLineChart(ctx, data, width, height, color);
    }
  }, [type, data, color]);

  return (
    <canvas
      ref={canvasRef}
      width={100}
      height={50}
      style={{
        width: '100%',
        height: 'auto',
        display: 'block'
      }}
    />
  );
}

function drawMiniBarChart(ctx, data, width, height, color) {
  if (!data || data.length === 0) return;

  const padding = 4;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const barWidth = chartWidth / data.length - 2;

  const maxValue = Math.max(...data);

  data.forEach((value, index) => {
    const x = padding + index * (barWidth + 2);
    const barHeight = (value / maxValue) * chartHeight;
    const y = height - padding - barHeight;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth, barHeight);
  });
}

function drawMiniLineChart(ctx, data, width, height, color) {
  if (!data || data.length === 0) return;

  const padding = 4;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxValue = Math.max(...data);

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  data.forEach((value, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index;
    const y = height - padding - (value / maxValue) * chartHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Fill under line
  ctx.strokeStyle = 'transparent';
  ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', ', 0.1)');
  ctx.lineTo(width - padding, height - padding);
  ctx.lineTo(padding, height - padding);
  ctx.closePath();
  ctx.fill();
}

export default {
  SixEngineRadar,
  LearningMetricsChart,
  AccuracyTracker,
  DomainParametersHeatmap,
  MiniChart
};
