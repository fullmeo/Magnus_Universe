import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, AlertCircle, CheckCircle, Clock, Target, BarChart3, GitBranch, Zap } from 'lucide-react';

// ============================================================================
// MAGNUS DASHBOARD v2.0 - COMPLETE IMPLEMENTATION
// Incorporates all Magnus 13 improvements audit recommendations
// ============================================================================

const MagnusDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [syncStatus, setSyncStatus] = useState('synced');
  const [learningMode, setLearningMode] = useState(true);

  // ============================================================================
  // QUANTIFIED METRICS SYSTEM (FIX 4: Replaces subjective scores)
  // ============================================================================

  const projectMetrics = {
    'tserouf-v4.1': {
      name: 'Tserouf v4.1 (Hardened)',
      phase: 'Hardening',
      status: 'complete',
      metrics: {
        // Code Quality (Objective)
        testCoverage: { value: 65, target: 80, unit: '%' },
        cyclomaticComplexity: { value: 4.2, target: 5, unit: 'avg' },
        vulnerabilities: { value: 0, target: 0, unit: 'found' },
        technicalDebt: { value: 8, target: 5, unit: '%' },
        codeLines: { value: 3050, target: 5000, unit: 'LOC' },
        
        // Complexity Management
        complexityScore: { value: 7.8, target: 8, unit: '/10' },
        clarityScore: { value: 92, target: 85, unit: '%' },
        
        // Testing
        testCount: { value: 24, target: 40, unit: 'tests' },
        passRate: { value: 100, target: 95, unit: '%' },
        edgeCaseCoverage: { value: 65, target: 80, unit: '%' },
        
        // Performance
        bundleSize: { value: 342, target: 300, unit: 'KB' },
        renderTime: { value: 45, target: 50, unit: 'ms' },
        mobileScore: { value: 78, target: 85, unit: 'PageSpeed' },
        
        // Business Metrics
        timeToValue: { value: 2, target: 3, unit: 'min' },
        userRetention: { value: 12, target: 25, unit: '%' },
        engagementScore: { value: 6.3, target: 8, unit: '/10' },
      },
      
      // EFFORT ESTIMATION (FIX 2: Replaces vague estimates)
      estimation: {
        complexity: 7.8,
        baseEffort: 31.2, // complexity × 4
        skillFactors: {
          junior: { multiplier: 1.5, hours: 46.8 },
          mid: { multiplier: 1.0, hours: 31.2 },
          senior: { multiplier: 0.7, hours: 21.8 },
          expert: { multiplier: 0.5, hours: 15.6 }
        },
        parallelization: {
          '1-dev': { factor: 1.0, hours: 31.2, timeline: '1 week' },
          '2-devs': { factor: 1.6, hours: 19.5, timeline: '5 days' },
          '3-devs': { factor: 2.0, hours: 15.6, timeline: '4 days' },
        },
        testingOverhead: 0.4, // 40% testing
        totalWithTesting: 43.7,
      },

      // RISK MATRIX (FIX 3: Active risk tracking)
      risks: [
        {
          id: 'R001',
          description: 'Mobile performance degradation',
          severity: 'HIGH',
          probability: 0.8,
          impact: 'High',
          mitigation: 'Implement progressive enhancement',
          status: 'mitigating',
          materialized: false,
          daysTracked: 12
        },
        {
          id: 'R002',
          description: 'Name database limitation',
          severity: 'HIGH',
          probability: 0.95,
          impact: 'Critical',
          mitigation: 'ML-based transliteration',
          status: 'planned',
          materialized: true,
          daysTracked: 8,
          resolutionPlan: 'Phase 6 implementation'
        },
        {
          id: 'R003',
          description: 'Canvas accessibility',
          severity: 'MEDIUM',
          probability: 0.7,
          impact: 'Medium',
          mitigation: 'Add ARIA labels + text fallback',
          status: 'planned',
          materialized: false,
          daysTracked: 5
        }
      ],

      // TESTING FRAMEWORK (FIX 1: Phase 5 Implementation)
      testing: {
        phase: 'Phase 5: Testing & Validation',
        status: 'in_progress',
        categories: [
          {
            name: 'Unit Tests',
            total: 24,
            passing: 24,
            coverage: 65,
            target: 80
          },
          {
            name: 'Integration Tests',
            total: 8,
            passing: 8,
            coverage: 55,
            target: 85
          },
          {
            name: 'Security Tests',
            total: 12,
            passing: 12,
            coverage: 100,
            target: 100
          },
          {
            name: 'Accessibility Tests',
            total: 6,
            passing: 4,
            coverage: 40,
            target: 80
          }
        ],
        securityVulnerabilities: [
          { id: 'S001', severity: 'CRITICAL', status: 'FIXED', type: 'XSS' },
          { id: 'S002', severity: 'HIGH', status: 'FIXED', type: 'Microphone Perms' },
          { id: 'S003', severity: 'MEDIUM', status: 'FIXED', type: 'Input Validation' }
        ]
      },

      // DECISION SUPPORT SYSTEM (FIX 5: Automation)
      decisions: [
        {
          id: 'D001',
          decision: 'Voice Detection Implementation',
          clarity: 90,
          complexity: 6.5,
          recommendation: 'GENERATE',
          strategy: 'ITERATIVE_REFINEMENT',
          confidence: 0.92,
          made: '2025-12-20',
          outcome: 'SUCCESS',
          timeToExecution: '2 hours'
        },
        {
          id: 'D002',
          decision: 'Strategy B: Sephiroth Focus',
          clarity: 95,
          complexity: 8.0,
          recommendation: 'GENERATE',
          strategy: 'MODULAR_CONSTRUCTION',
          confidence: 0.98,
          made: '2025-12-21',
          outcome: 'SUCCESS',
          timeToExecution: '3 hours'
        },
        {
          id: 'D003',
          decision: 'Security Hardening (v4.1)',
          clarity: 92,
          complexity: 7.5,
          recommendation: 'GENERATE',
          strategy: 'SINGLE_PASS',
          confidence: 0.95,
          made: '2025-12-22',
          outcome: 'SUCCESS',
          timeToExecution: '2 hours'
        }
      ],

      // LEARNING LOOP (FIX 6: Retrospective)
      learnings: [
        {
          category: 'Estimation',
          learning: 'Complexity scoring accuracy: 96%',
          impact: 'HIGH',
          applied: true,
          nextProjectAdjustment: 'Increase confidence margin'
        },
        {
          category: 'Process',
          learning: 'Phase 5 Testing should be formal',
          impact: 'HIGH',
          applied: false,
          nextProjectAdjustment: 'Add 40% testing overhead to estimates'
        },
        {
          category: 'Technical',
          learning: 'Hebrew input validation critical',
          impact: 'MEDIUM',
          applied: true,
          nextProjectAdjustment: 'Create validation template for i18n'
        },
        {
          category: 'Risk',
          learning: 'Name database is primary blocker',
          impact: 'CRITICAL',
          applied: true,
          nextProjectAdjustment: 'Expand to 500+ names before launch'
        }
      ]
    },

    'magnus-13-v2': {
      name: 'Magnus 13 v2.0 (Framework)',
      phase: 'Design',
      status: 'planning',
      metrics: {
        complexity: { value: 8.5, target: 8, unit: '/10' },
        clarityScore: { value: 88, target: 85, unit: '%' },
        componentCount: { value: 9, target: 10, unit: 'modules' },
        documentationCoverage: { value: 75, target: 90, unit: '%' },
      },
      estimation: {
        complexity: 8.5,
        baseEffort: 34,
        phases: [
          { name: 'Phase 1: Quick Wins', hours: 12, timeline: '1-2 weeks' },
          { name: 'Phase 2: Medium-term', hours: 24, timeline: '2-4 weeks' },
          { name: 'Phase 3: Strategic', hours: 45, timeline: '1-3 months' },
          { name: 'Total Effort', hours: 81, timeline: '3-6 months' }
        ]
      }
    }
  };

  // ============================================================================
  // DECISION SUPPORT SYSTEM (DSS)
  // ============================================================================

  const evaluateDecision = (clarity, complexity) => {
    if (clarity < 70) {
      return {
        recommendation: 'CLARIFY',
        reasoning: 'Clarity below minimum threshold',
        confidence: 0.95,
        nextStep: 'Request more details'
      };
    }

    if (complexity > 9) {
      return {
        recommendation: 'DECOMPOSE',
        reasoning: 'Complexity exceeds safe threshold',
        confidence: 0.90,
        nextStep: 'Break into smaller phases'
      };
    }

    const strategies = [
      { threshold: 3, strategy: 'SINGLE_PASS', name: 'Single-Pass Generation' },
      { threshold: 5, strategy: 'ITERATIVE_REFINEMENT', name: 'Iterative Refinement' },
      { threshold: 7, strategy: 'MODULAR_CONSTRUCTION', name: 'Modular Construction' },
      { threshold: 10, strategy: 'PHASED_DEVELOPMENT', name: 'Phased Development' }
    ];

    const selectedStrategy = strategies.reduce((prev, curr) =>
      complexity <= curr.threshold ? curr : prev
    );

    return {
      recommendation: 'GENERATE',
      strategy: selectedStrategy.strategy,
      strategyName: selectedStrategy.name,
      confidence: Math.min(0.98, 0.7 + (clarity / 100) * 0.3),
      reasoning: `Clarity ${clarity}/100, Complexity ${complexity}/10 → ${selectedStrategy.name}`
    };
  };

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Project Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          label="Total Projects"
          value={Object.keys(projectMetrics).length}
          icon="📊"
          trend="+1 this week"
        />
        <MetricCard
          label="Avg Complexity"
          value="8.2"
          unit="/10"
          icon="📈"
          trend="stable"
        />
        <MetricCard
          label="Risk Score"
          value="6.5"
          unit="/10"
          icon="⚠️"
          trend="-2.1 (improving)"
          status="warning"
        />
      </div>

      {/* Projects Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400">ACTIVE PROJECTS</h3>
        {Object.entries(projectMetrics).map(([key, project]) => (
          <ProjectCard
            key={key}
            project={project}
            isSelected={selectedProject === key}
            onSelect={() => setSelectedProject(key)}
          />
        ))}
      </div>
    </div>
  );

  const renderMetricsTab = () => {
    if (!selectedProject) {
      return <div className="text-slate-400 text-sm">Select a project to view metrics</div>;
    }

    const metrics = projectMetrics[selectedProject].metrics;

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">{projectMetrics[selectedProject].name}</h3>

        {/* Code Quality Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-purple-400">CODE QUALITY</h4>
          <MetricRow label="Test Coverage" current={metrics.testCoverage.value} target={metrics.testCoverage.target} unit="%" />
          <MetricRow label="Cyclomatic Complexity" current={metrics.cyclomaticComplexity.value} target={metrics.cyclomaticComplexity.target} unit="avg" />
          <MetricRow label="Known Vulnerabilities" current={metrics.vulnerabilities.value} target={metrics.vulnerabilities.target} unit="found" />
          <MetricRow label="Technical Debt" current={metrics.technicalDebt.value} target={metrics.technicalDebt.target} unit="%" />
        </div>

        {/* Performance Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-blue-400">PERFORMANCE</h4>
          <MetricRow label="Bundle Size" current={metrics.bundleSize.value} target={metrics.bundleSize.target} unit="KB" />
          <MetricRow label="Render Time" current={metrics.renderTime.value} target={metrics.renderTime.target} unit="ms" />
          <MetricRow label="Mobile Score" current={metrics.mobileScore.value} target={metrics.mobileScore.target} unit="PageSpeed" />
        </div>

        {/* Business Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-pink-400">BUSINESS METRICS</h4>
          <MetricRow label="User Retention" current={metrics.userRetention.value} target={metrics.userRetention.target} unit="%" />
          <MetricRow label="Engagement Score" current={metrics.engagementScore.value} target={metrics.engagementScore.target} unit="/10" />
        </div>
      </div>
    );
  };

  const renderEffortTab = () => {
    if (!selectedProject) {
      return <div className="text-slate-400 text-sm">Select a project to view effort estimates</div>;
    }

    const est = projectMetrics[selectedProject].estimation;

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">{projectMetrics[selectedProject].name}</h3>

        <div className="space-y-4">
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">Complexity Score</div>
            <div className="text-3xl font-bold">{est.complexity}/10</div>
          </div>

          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">Base Effort (Complexity × 4)</div>
            <div className="text-3xl font-bold">{est.baseEffort.toFixed(1)} hours</div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-300">By Skill Level</h4>
            {Object.entries(est.skillFactors || {}).map(([level, data]) => (
              <div key={level} className="flex justify-between items-center bg-slate-800/20 p-3 rounded">
                <span className="text-sm capitalize">{level}</span>
                <span className="font-mono text-sm">{data.hours.toFixed(1)}h ({data.multiplier}x)</span>
              </div>
            ))}
          </div>

          {est.phases && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-300">Timeline by Phase</h4>
              {est.phases.map((phase, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-800/20 p-3 rounded">
                  <span className="text-sm">{phase.name}</span>
                  <span className="font-mono text-sm">{phase.hours}h ({phase.timeline})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRisksTab = () => {
    if (!selectedProject) {
      return <div className="text-slate-400 text-sm">Select a project to view risks</div>;
    }

    const risks = projectMetrics[selectedProject].risks || [];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{projectMetrics[selectedProject].name}</h3>
        
        {risks.map((risk, idx) => (
          <div key={idx} className="bg-slate-800/40 rounded-lg p-4 border-l-4 border-red-500">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm">{risk.description}</h4>
              <span className={`text-xs px-2 py-1 rounded ${
                risk.severity === 'HIGH' ? 'bg-red-500/20 text-red-300' :
                risk.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {risk.severity}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-3">
              <div>Probability: {(risk.probability * 100).toFixed(0)}%</div>
              <div>Status: {risk.status}</div>
              <div>Tracked: {risk.daysTracked} days</div>
              <div>Materialized: {risk.materialized ? '✓' : '✗'}</div>
            </div>
            <div className="text-sm text-slate-300">
              <strong>Mitigation:</strong> {risk.mitigation}
            </div>
            {risk.resolutionPlan && (
              <div className="text-sm text-slate-300 mt-2">
                <strong>Plan:</strong> {risk.resolutionPlan}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderDecisionsTab = () => {
    if (!selectedProject) {
      return <div className="text-slate-400 text-sm">Select a project to view decisions</div>;
    }

    const decisions = projectMetrics[selectedProject].decisions || [];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{projectMetrics[selectedProject].name}</h3>
        
        {decisions.map((decision, idx) => {
          const dss = evaluateDecision(decision.clarity, decision.complexity);
          return (
            <div key={idx} className="bg-slate-800/40 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-sm">{decision.decision}</h4>
                <span className={`text-xs px-2 py-1 rounded font-bold ${
                  decision.outcome === 'SUCCESS'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {decision.outcome}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-400 mb-3">
                <div>Clarity: {decision.clarity}%</div>
                <div>Complexity: {decision.complexity}/10</div>
                <div>Confidence: {(decision.confidence * 100).toFixed(0)}%</div>
              </div>
              <div className="bg-slate-900/40 p-3 rounded space-y-1 text-sm">
                <div><strong>Recommendation:</strong> {dss.recommendation}</div>
                <div><strong>Strategy:</strong> {decision.strategy}</div>
                <div><strong>Reasoning:</strong> {dss.reasoning}</div>
                <div><strong>Execution Time:</strong> {decision.timeToExecution}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLearningsTab = () => {
    if (!selectedProject) {
      return <div className="text-slate-400 text-sm">Select a project to view learnings</div>;
    }

    const learnings = projectMetrics[selectedProject].learnings || [];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{projectMetrics[selectedProject].name} - Retrospective</h3>
        
        {learnings.map((learning, idx) => (
          <div key={idx} className="bg-slate-800/40 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm">{learning.learning}</h4>
              <span className={`text-xs px-2 py-1 rounded ${
                learning.applied ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {learning.applied ? '✓ Applied' : 'Pending'}
              </span>
            </div>
            <div className="text-xs text-slate-400 mb-2">Category: {learning.category}</div>
            <div className="text-sm text-slate-300">
              <strong>Impact:</strong> {learning.impact}
            </div>
            <div className="text-sm text-slate-300 mt-2">
              <strong>Next Project:</strong> {learning.nextProjectAdjustment}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">🧠 MAGNUS DASHBOARD v2.0</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLearningMode(!learningMode)}
              className={`px-3 py-1 text-xs rounded font-semibold transition ${
                learningMode
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {learningMode ? '📚 Learning ON' : '📚 Learning OFF'}
            </button>
            <div className={`text-xs px-3 py-1 rounded font-mono ${
              syncStatus === 'synced'
                ? 'bg-green-500/20 text-green-300'
                : 'bg-yellow-500/20 text-yellow-300'
            }`}>
              {syncStatus === 'synced' ? '✓ Synced' : '⟳ Syncing...'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Project List */}
        <div className="w-80 border-r border-slate-700/50 bg-slate-900/20 overflow-y-auto">
          <div className="p-4 space-y-3">
            <h2 className="text-sm font-bold text-slate-400 px-2">PROJECTS</h2>
            {Object.entries(projectMetrics).map(([key, project]) => (
              <button
                key={key}
                onClick={() => setSelectedProject(key)}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  selectedProject === key
                    ? 'bg-purple-600/30 border border-purple-500/50'
                    : 'bg-slate-800/20 border border-transparent hover:bg-slate-800/40'
                }`}
              >
                <div className="font-semibold text-sm mb-1">{project.name}</div>
                <div className="text-xs text-slate-400">{project.phase}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {/* Tabs */}
          <div className="border-b border-slate-700/50 bg-slate-900/20 sticky top-0 z-10">
            <div className="flex overflow-x-auto px-6">
              {[
                { id: 'overview', label: '📊 Overview' },
                { id: 'metrics', label: '📈 Metrics' },
                { id: 'effort', label: '⏱️ Effort' },
                { id: 'risks', label: '⚠️ Risks' },
                { id: 'decisions', label: '🎯 Decisions' },
                { id: 'learnings', label: '📚 Learnings' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 border-b-2 transition text-sm font-semibold whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-6">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'metrics' && renderMetricsTab()}
            {activeTab === 'effort' && renderEffortTab()}
            {activeTab === 'risks' && renderRisksTab()}
            {activeTab === 'decisions' && renderDecisionsTab()}
            {activeTab === 'learnings' && renderLearningsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const MetricCard = ({ label, value, unit, icon, trend, status }) => (
  <div className={`rounded-lg p-4 border ${
    status === 'warning'
      ? 'bg-red-500/10 border-red-500/30'
      : 'bg-slate-800/30 border-slate-700/50'
  }`}>
    <div className="text-sm text-slate-400 mb-2">{label}</div>
    <div className="flex items-baseline gap-2 mb-2">
      <span className="text-3xl font-bold">{value}</span>
      {unit && <span className="text-sm text-slate-400">{unit}</span>}
    </div>
    <div className="text-xs text-slate-500">{trend}</div>
  </div>
);

const ProjectCard = ({ project, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full text-left p-4 rounded-lg border transition ${
      isSelected
        ? 'bg-purple-600/20 border-purple-500/50'
        : 'bg-slate-800/20 border-slate-700/30 hover:bg-slate-800/40'
    }`}
  >
    <div className="flex items-start justify-between mb-2">
      <h4 className="font-semibold text-sm">{project.name}</h4>
      <span className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-300">
        {project.phase}
      </span>
    </div>
    <div className="text-xs text-slate-500">{project.status}</div>
  </button>
);

const MetricRow = ({ label, current, target, unit }) => {
  const percentage = (current / target) * 100;
  const isGood = current <= target;

  return (
    <div className="flex items-center justify-between bg-slate-800/20 p-3 rounded">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-mono text-sm">
            {current.toFixed(current % 1 ? 1 : 0)} / {target} {unit}
          </div>
          <div className={`text-xs ${isGood ? 'text-green-400' : 'text-red-400'}`}>
            {percentage.toFixed(0)}%
          </div>
        </div>
        <div className={`w-24 h-2 rounded-full bg-slate-700 overflow-hidden`}>
          <div
            className={`h-full transition ${isGood ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default MagnusDashboard;
