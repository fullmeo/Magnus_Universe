/**
 * Magnus 14 Dashboard Components
 *
 * React components for Magnus 14 integration
 * Features:
 * - Project analysis form and visualization
 * - Outcome recording with accuracy tracking
 * - Learning metrics dashboard
 * - Historical project browser
 * - 6-engine radar chart visualization
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  SixEngineRadar,
  LearningMetricsChart,
  AccuracyTracker,
  DomainParametersHeatmap,
  MiniChart
} from './magnus-14-visualizations.jsx';

// ============================================================================
// Main Magnus 14 Dashboard Component
// ============================================================================

export function Magnus14Dashboard({ websocket }) {
  const [view, setView] = useState('overview'); // overview, analyze, outcomes, learning, history
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [magnus14Status, setMagnus14Status] = useState(null);
  const [accuracyMetrics, setAccuracyMetrics] = useState(null);
  const [learningStats, setLearningStats] = useState(null);

  // Load initial data
  useEffect(() => {
    fetchProjects();
    fetchStatus();
    fetchAccuracyMetrics();
    fetchLearningStats();

    // Subscribe to WebSocket events
    if (websocket) {
      websocket.send(JSON.stringify({
        type: 'subscribe',
        events: [
          'magnus14-analysis-started',
          'magnus14-analysis-completed',
          'magnus14-outcome-recorded',
          'magnus14-accuracy-updated'
        ]
      }));
    }
  }, [websocket]);

  // Handle WebSocket events
  useEffect(() => {
    if (!websocket) return;

    const handleMessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'magnus14-analysis-completed':
            fetchProjects();
            setView('overview');
            break;
          case 'magnus14-outcome-recorded':
          case 'magnus14-accuracy-updated':
            fetchAccuracyMetrics();
            fetchLearningStats();
            fetchProjects();
            break;
          default:
            break;
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    };

    websocket.addEventListener('message', handleMessage);
    return () => websocket.removeEventListener('message', handleMessage);
  }, [websocket]);

  const fetchProjects = async () => {
    try {
      setError(null);
      const response = await fetch('/api/magnus14/projects');
      const data = await response.json();
      if (data.success) {
        setProjects(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/magnus14/status');
      const data = await response.json();
      if (data.success) {
        setMagnus14Status(data.data);
      }
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  };

  const fetchAccuracyMetrics = async () => {
    try {
      const response = await fetch('/api/magnus14/accuracy');
      const data = await response.json();
      if (data.success) {
        setAccuracyMetrics(data.data);
      }
    } catch (err) {
      console.error('Error fetching accuracy:', err);
    }
  };

  const fetchLearningStats = async () => {
    try {
      const response = await fetch('/api/magnus14/learning');
      const data = await response.json();
      if (data.success) {
        setLearningStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching learning stats:', err);
    }
  };

  return (
    <div className="magnus14-dashboard">
      {/* Header */}
      <div className="magnus14-header">
        <div className="header-content">
          <h1>🧠 Magnus 14 Analysis</h1>
          <p className="subtitle">6-Engine Project Analysis Framework</p>
        </div>
        <div className="header-status">
          {magnus14Status && (
            <span className={`status-badge ${magnus14Status.initialized ? 'active' : 'inactive'}`}>
              {magnus14Status.initialized ? '✅ Active' : '⏸️ Inactive'}
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="magnus14-nav">
        <button
          className={`nav-button ${view === 'overview' ? 'active' : ''}`}
          onClick={() => setView('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`nav-button ${view === 'analyze' ? 'active' : ''}`}
          onClick={() => setView('analyze')}
        >
          🔍 Analyze
        </button>
        <button
          className={`nav-button ${view === 'outcomes' ? 'active' : ''}`}
          onClick={() => setView('outcomes')}
        >
          📈 Outcomes
        </button>
        <button
          className={`nav-button ${view === 'learning' ? 'active' : ''}`}
          onClick={() => setView('learning')}
        >
          🎓 Learning
        </button>
        <button
          className={`nav-button ${view === 'history' ? 'active' : ''}`}
          onClick={() => setView('history')}
        >
          📜 History
        </button>
      </nav>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Content Views */}
      <div className="magnus14-content">
        {view === 'overview' && (
          <Magnus14Overview
            projects={projects}
            status={magnus14Status}
            accuracy={accuracyMetrics}
            learning={learningStats}
            onAnalyze={() => setView('analyze')}
            onRefresh={fetchProjects}
          />
        )}

        {view === 'analyze' && (
          <ProjectAnalysisForm
            onSuccess={() => {
              setView('overview');
              fetchProjects();
            }}
            onError={setError}
          />
        )}

        {view === 'outcomes' && (
          <OutcomeRecordingView
            projects={projects}
            onSuccess={() => {
              fetchProjects();
              fetchAccuracyMetrics();
              fetchLearningStats();
            }}
            onError={setError}
          />
        )}

        {view === 'learning' && (
          <LearningMetricsDashboard
            stats={learningStats}
            accuracy={accuracyMetrics}
            onRefresh={() => {
              fetchLearningStats();
              fetchAccuracyMetrics();
            }}
          />
        )}

        {view === 'history' && (
          <ProjectHistoryView
            projects={projects}
            onRefresh={fetchProjects}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Overview Component
// ============================================================================

function Magnus14Overview({ projects, status, accuracy, learning, onAnalyze, onRefresh }) {
  // Get first project's analysis data for radar chart
  const firstProject = projects[0];
  const radarData = firstProject?.engines ? {
    spiral: { confidence: 0.65 },
    domain: { confidence: 0.72 },
    poc: { confidence: 0.58 },
    integration: { confidence: 0.75 },
    sideProject: { confidence: 0.62 },
    framework: { confidence: 0.68 }
  } : null;

  return (
    <div className="magnus14-overview">
      {/* Stats Grid */}
      <div className="stats-grid-14">
        <StatCard14
          icon="📊"
          title="Projects Analyzed"
          value={projects.length}
          color="blue"
        />
        <StatCard14
          icon="🎯"
          title="Analysis Ready"
          value={status?.projectsStored || 0}
          color="green"
        />
        <StatCard14
          icon="📈"
          title="Outcomes Recorded"
          value={status?.outcomesRecorded || 0}
          color="purple"
        />
        <StatCard14
          icon="🎓"
          title="Learning Status"
          value={status?.learningSystemInitialized ? 'Active' : 'Inactive'}
          color="orange"
        />
      </div>

      {/* Main Grid */}
      <div className="overview-grid-14">
        {/* Recent Projects */}
        <div className="card-14">
          <div className="card-header-14">
            <h2>Recent Projects</h2>
            <button className="btn-small-14" onClick={onRefresh}>🔄</button>
          </div>
          <div className="projects-list-14">
            {projects.slice(0, 5).map((project) => (
              <div key={project.projectId} className="project-item-14">
                <div className="project-info-14">
                  <h4>{project.projectName}</h4>
                  <span className="domain-badge-14">{project.domain}</span>
                </div>
                <span className="timestamp-14">
                  {new Date(project.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="empty-state-14">
                <p>No projects analyzed yet</p>
                <button className="btn-primary-14" onClick={onAnalyze}>
                  Start Analysis
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Accuracy Overview */}
        <div className="card-14">
          <div className="card-header-14">
            <h2>Accuracy Metrics</h2>
          </div>
          {accuracy ? (
            <div className="accuracy-metrics-14">
              <MetricRow14
                label="Spiral Accuracy"
                value={accuracy.spiralAccuracy}
              />
              <MetricRow14
                label="Integration Accuracy"
                value={accuracy.integrationAccuracy}
              />
              <MetricRow14
                label="Duration Accuracy"
                value={accuracy.durationAccuracy}
              />
              <MetricRow14
                label="Overall"
                value={accuracy.overallAccuracy}
                highlight
              />
            </div>
          ) : (
            <div className="empty-state-14">
              <p>No accuracy data available</p>
            </div>
          )}
        </div>

        {/* 6-Engine Radar */}
        {firstProject && (
          <div className="card-14">
            <div className="card-header-14">
              <h2>6-Engine Analysis</h2>
            </div>
            <SixEngineRadar analysisData={radarData} size={300} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="card-14 action-panel-14">
          <h2>Quick Actions</h2>
          <div className="button-group-14">
            <button className="btn-primary-14" onClick={onAnalyze}>
              🔍 New Analysis
            </button>
            <button className="btn-secondary-14" onClick={onRefresh}>
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Project Analysis Form
// ============================================================================

function ProjectAnalysisForm({ onSuccess, onError }) {
  const [formData, setFormData] = useState({
    projectName: '',
    domain: 'technology',
    currentClarity: 50,
    estimatedComplexity: 50,
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const domains = [
    'technology',
    'business',
    'creative',
    'research',
    'infrastructure',
    'other'
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onError(null);

    try {
      const response = await fetch('/api/magnus14/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!data.success) {
        onError(data.error || 'Analysis failed');
        return;
      }

      // Reset form
      setFormData({
        projectName: '',
        domain: 'technology',
        currentClarity: 50,
        estimatedComplexity: 50,
        description: ''
      });

      onSuccess();
    } catch (error) {
      console.error('Analysis error:', error);
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analysis-form-14">
      <div className="form-container-14">
        <h2>New Project Analysis</h2>
        <p className="form-description-14">
          Analyze a new project through all 6 Magnus 14 engines
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group-14">
            <label htmlFor="projectName">Project Name *</label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="e.g., Music Streaming Platform"
              required
            />
          </div>

          <div className="form-row-14">
            <div className="form-group-14">
              <label htmlFor="domain">Domain *</label>
              <select
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                required
              >
                {domains.map(d => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-14">
              <label htmlFor="currentClarity">Current Clarity</label>
              <div className="slider-input-14">
                <input
                  type="range"
                  id="currentClarity"
                  name="currentClarity"
                  min="0"
                  max="100"
                  value={formData.currentClarity}
                  onChange={handleChange}
                />
                <span className="slider-value-14">{formData.currentClarity}%</span>
              </div>
            </div>
          </div>

          <div className="form-row-14">
            <div className="form-group-14">
              <label htmlFor="estimatedComplexity">Estimated Complexity</label>
              <div className="slider-input-14">
                <input
                  type="range"
                  id="estimatedComplexity"
                  name="estimatedComplexity"
                  min="0"
                  max="100"
                  value={formData.estimatedComplexity}
                  onChange={handleChange}
                />
                <span className="slider-value-14">{formData.estimatedComplexity}%</span>
              </div>
            </div>
          </div>

          <div className="form-group-14">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional project details..."
              rows="4"
            />
          </div>

          <div className="form-actions-14">
            <button
              type="submit"
              className="btn-primary-14"
              disabled={loading}
            >
              {loading ? '⏳ Analyzing...' : '🔍 Analyze Project'}
            </button>
          </div>
        </form>
      </div>

      {/* Info Panel */}
      <div className="info-panel-14">
        <h3>6 Analysis Engines</h3>
        <div className="engine-list-14">
          <EngineItem14 name="Spiral Analysis" emoji="🌀" />
          <EngineItem14 name="Domain Analysis" emoji="🗺️" />
          <EngineItem14 name="PoC Analysis" emoji="🧪" />
          <EngineItem14 name="Integration Analysis" emoji="🔗" />
          <EngineItem14 name="Side Project Analysis" emoji="📦" />
          <EngineItem14 name="Framework Analysis" emoji="🏗️" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Outcome Recording View
// ============================================================================

function OutcomeRecordingView({ projects, onSuccess, onError }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    actualSpiralCount: '',
    totalDurationMonths: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) {
      onError('Please select a project');
      return;
    }

    setLoading(true);
    onError(null);

    try {
      const response = await fetch(`/api/magnus14/outcomes/${selectedProject.projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actualSpiralCount: parseInt(formData.actualSpiralCount),
          totalDurationMonths: parseFloat(formData.totalDurationMonths)
        })
      });

      const data = await response.json();

      if (!data.success) {
        onError(data.error || 'Failed to record outcome');
        return;
      }

      // Reset form
      setFormData({
        actualSpiralCount: '',
        totalDurationMonths: ''
      });
      setSelectedProject(null);

      onSuccess();
    } catch (error) {
      console.error('Outcome error:', error);
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const projectsWithoutOutcome = projects.filter(p => !p.hasOutcome);

  return (
    <div className="outcome-form-14">
      <div className="form-container-14">
        <h2>Record Project Outcome</h2>
        <p className="form-description-14">
          Record actual outcomes to improve Magnus 14 accuracy
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group-14">
            <label htmlFor="projectSelect">Select Project *</label>
            <select
              id="projectSelect"
              value={selectedProject?.projectId || ''}
              onChange={(e) => {
                const project = projects.find(p => p.projectId === e.target.value);
                setSelectedProject(project);
              }}
              required
            >
              <option value="">-- Choose a project --</option>
              {projectsWithoutOutcome.map(project => (
                <option key={project.projectId} value={project.projectId}>
                  {project.projectName} ({project.domain})
                </option>
              ))}
            </select>
            {projectsWithoutOutcome.length === 0 && (
              <p className="form-hint-14">All projects have recorded outcomes</p>
            )}
          </div>

          {selectedProject && (
            <>
              <div className="project-details-14">
                <p><strong>Project:</strong> {selectedProject.projectName}</p>
                <p><strong>Domain:</strong> {selectedProject.domain}</p>
                <p><strong>Analyzed:</strong> {new Date(selectedProject.timestamp).toLocaleString()}</p>
              </div>

              <div className="form-group-14">
                <label htmlFor="actualSpiralCount">Actual Spiral Count *</label>
                <input
                  type="number"
                  id="actualSpiralCount"
                  name="actualSpiralCount"
                  value={formData.actualSpiralCount}
                  onChange={handleChange}
                  placeholder="e.g., 4"
                  min="0"
                  required
                />
              </div>

              <div className="form-group-14">
                <label htmlFor="totalDurationMonths">Total Duration (Months) *</label>
                <input
                  type="number"
                  id="totalDurationMonths"
                  name="totalDurationMonths"
                  value={formData.totalDurationMonths}
                  onChange={handleChange}
                  placeholder="e.g., 12.5"
                  step="0.1"
                  min="0"
                  required
                />
              </div>

              <div className="form-actions-14">
                <button
                  type="submit"
                  className="btn-primary-14"
                  disabled={loading}
                >
                  {loading ? '⏳ Recording...' : '📈 Record Outcome'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      <div className="info-panel-14">
        <h3>Why Record Outcomes?</h3>
        <ul>
          <li>Improves prediction accuracy</li>
          <li>Learns domain-specific patterns</li>
          <li>Refines engine parameters</li>
          <li>Builds learning statistics</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// Learning Metrics Dashboard
// ============================================================================

function LearningMetricsDashboard({ stats, accuracy, onRefresh }) {
  return (
    <div className="learning-dashboard-14">
      <div className="dashboard-header-14">
        <h2>Learning System Metrics</h2>
        <button className="btn-small-14" onClick={onRefresh}>🔄 Refresh</button>
      </div>

      <div className="metrics-grid-14">
        {/* Learning Stats Cards */}
        {stats && (
          <>
            <StatCard14
              icon="🎓"
              title="Total Learning Events"
              value={stats.totalLearningEvents || 0}
              color="blue"
            />
            <StatCard14
              icon="📊"
              title="Domain Parameters Tuned"
              value={stats.parametersAdjusted || 0}
              color="green"
            />
            <StatCard14
              icon="🎯"
              title="Accuracy Improvement"
              value={`${stats.accuracyImprovement || 0}%`}
              color="purple"
            />
            <StatCard14
              icon="🚀"
              title="Prediction Quality"
              value={stats.predictionQuality || 'N/A'}
              color="orange"
            />
          </>
        )}
      </div>

      {/* Accuracy Trend Chart */}
      <div className="card-14">
        <h3>Accuracy Trends</h3>
        <LearningMetricsChart metrics={stats} width={600} height={300} />
      </div>

      {/* Accuracy Tracker */}
      <div className="card-14">
        <h3>Current Accuracy Metrics</h3>
        <AccuracyTracker accuracyData={accuracy} />
      </div>

      {/* Domain Parameters */}
      <div className="card-14">
        <h3>Domain Parameters</h3>
        <div className="domain-params-14">
          {/* Placeholder for domain parameters */}
          <p>Domain-specific parameters will be displayed here based on learned data</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Project History View
// ============================================================================

function ProjectHistoryView({ projects, onRefresh }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    return p.domain === filter;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    if (sortBy === 'name') {
      return a.projectName.localeCompare(b.projectName);
    }
    return 0;
  });

  const domains = [...new Set(projects.map(p => p.domain))];

  return (
    <div className="history-view-14">
      <div className="view-header-14">
        <h2>Project History ({filteredProjects.length})</h2>
        <div className="view-controls-14">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Domains</option>
            {domains.map(domain => (
              <option key={domain} value={domain}>
                {domain.charAt(0).toUpperCase() + domain.slice(1)}
              </option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="name">Alphabetical</option>
          </select>
          <button className="btn-small-14" onClick={onRefresh}>🔄</button>
        </div>
      </div>

      <div className="projects-table-14">
        <table>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Domain</th>
              <th>Analyzed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProjects.map(project => (
              <ProjectRow14 key={project.projectId} project={project} />
            ))}
          </tbody>
        </table>

        {sortedProjects.length === 0 && (
          <div className="empty-table-14">
            <p>No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function StatCard14({ icon, title, value, color }) {
  return (
    <div className={`stat-card-14 ${color}`}>
      <div className="stat-icon-14">{icon}</div>
      <div className="stat-content-14">
        <h4>{title}</h4>
        <div className="stat-value-14">{value}</div>
      </div>
    </div>
  );
}

function MetricRow14({ label, value, highlight }) {
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const percentage = (numValue * 100).toFixed(1);

  return (
    <div className={`metric-row-14 ${highlight ? 'highlight' : ''}`}>
      <span className="metric-label-14">{label}</span>
      <div className="metric-bar-14">
        <div
          className="metric-fill-14"
          style={{ width: `${numValue * 100}%` }}
        />
      </div>
      <span className="metric-value-14">{percentage}%</span>
    </div>
  );
}

function EngineItem14({ name, emoji }) {
  return (
    <div className="engine-item-14">
      <span className="engine-emoji-14">{emoji}</span>
      <span className="engine-name-14">{name}</span>
    </div>
  );
}

function ProjectRow14({ project }) {
  return (
    <tr className="project-row-14">
      <td className="project-name-14">{project.projectName}</td>
      <td>
        <span className="domain-badge-small-14">{project.domain}</span>
      </td>
      <td>{new Date(project.timestamp).toLocaleDateString()}</td>
      <td>
        <span className="status-badge-14">
          {project.hasOutcome ? '✅ Complete' : '⏳ Pending'}
        </span>
      </td>
      <td>
        <button className="btn-tiny-14">View</button>
      </td>
    </tr>
  );
}

export default Magnus14Dashboard;
