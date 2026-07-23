<template>
  <div class="triz-analysis-panel">
    <div class="header">
      <h1>🧠 TRIZ Analysis Dashboard</h1>
      <div class="controls">
        <button @click="refreshData" class="btn-refresh">🔄 Refresh</button>
        <button @click="exportReport" class="btn-export">📥 Export</button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="summary-stats" v-if="metrics">
      <div class="stat-card">
        <div class="stat-value">{{ metrics.summary.total }}</div>
        <div class="stat-label">Total Projects</div>
      </div>
      <div class="stat-card converged">
        <div class="stat-value">{{ metrics.summary.converged }}</div>
        <div class="stat-label">Converged ✅</div>
      </div>
      <div class="stat-card partial">
        <div class="stat-value">{{ metrics.summary.partial }}</div>
        <div class="stat-label">Partial ⚠️</div>
      </div>
      <div class="stat-card failed">
        <div class="stat-value">{{ metrics.summary.failed }}</div>
        <div class="stat-label">Failed ❌</div>
      </div>
    </div>

    <!-- Projects List -->
    <div class="projects-section">
      <h2>Projects</h2>
      <div class="projects-list" v-if="projects.length > 0">
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card"
          :class="project.outcome.toLowerCase()"
          @click="selectedProject = project"
        >
          <div class="project-header">
            <div class="project-name">{{ project.name }}</div>
            <div class="project-outcome">{{ getOutcomeEmoji(project.outcome) }} {{ project.outcome }}</div>
          </div>
          <div class="project-info">
            <span class="complexity">📊 {{ project.complexity }}</span>
            <span class="prescriptions">🔧 {{ project.trizPrescriptions }} principles</span>
          </div>
        </div>
      </div>
      <div v-else class="no-data">No projects available</div>
    </div>

    <!-- Selected Project Detail -->
    <div class="detail-section" v-if="selectedProject">
      <div class="detail-header">
        <h2>{{ selectedProject.name }}</h2>
        <button @click="selectedProject = null" class="btn-close">✕</button>
      </div>

      <!-- Four Pillars -->
      <div class="four-pillars">
        <h3>📊 Four Pillars</h3>
        <div class="pillars-grid">
          <div class="pillar" v-for="(value, key) in selectedProjectDetail.pillars" :key="key">
            <div class="pillar-name">{{ formatPillarName(key) }}</div>
            <div class="pillar-bar">
              <div class="bar-fill" :style="{ width: value + '%' }"></div>
            </div>
            <div class="pillar-value">{{ value }}/100</div>
            <div class="pillar-status" :class="getStatus(value, getThreshold(key))">
              {{ getStatus(value, getThreshold(key)) === 'pass' ? '✅ Pass' : '❌ Fail' }}
            </div>
          </div>
        </div>
      </div>

      <!-- TRIZ Prescriptions -->
      <div class="prescriptions" v-if="selectedProjectDetail.trizPrescriptions.length > 0">
        <h3>🔧 TRIZ Prescriptions</h3>
        <div class="failing-pillars">
          <strong>Failing Pillars:</strong>
          {{ selectedProjectDetail.failingPillars.join(', ') }}
        </div>

        <div class="prescriptions-list">
          <div
            v-for="(prescription, idx) in selectedProjectDetail.trizPrescriptions"
            :key="idx"
            class="prescription-card"
            :class="'priority-' + prescription.priority"
          >
            <div class="prescription-header">
              <div class="principle-number">Principle {{ prescription.principleNumber }}</div>
              <div class="principle-name">{{ prescription.principleName }}</div>
              <div class="priority">Priority {{ prescription.priority }}</div>
            </div>
            <div class="prescription-diagnosis">
              <strong>Diagnosis:</strong> {{ prescription.diagnosis }}
            </div>
            <div class="prescription-action">
              <strong>Action:</strong> {{ prescription.application }}
            </div>
          </div>
        </div>
      </div>

      <!-- Metrics -->
      <div class="project-metrics" v-if="selectedProjectDetail.metrics">
        <h3>📈 Project Metrics</h3>
        <div class="metrics-grid">
          <div class="metric">
            <span class="metric-label">Clarity:</span>
            <span class="metric-value">{{ selectedProjectDetail.metrics.initialClarity }}% → {{ selectedProjectDetail.metrics.expectedConvergenceClarity }}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Components:</span>
            <span class="metric-value">{{ selectedProjectDetail.metrics.componentCount }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Domain Complexity:</span>
            <span class="metric-value">{{ selectedProjectDetail.metrics.domainComplexity }}/10</span>
          </div>
          <div class="metric">
            <span class="metric-label">Technical Complexity:</span>
            <span class="metric-value">{{ selectedProjectDetail.metrics.technicalComplexity }}/10</span>
          </div>
          <div class="metric">
            <span class="metric-label">Estimated Duration:</span>
            <span class="metric-value">{{ selectedProjectDetail.metrics.estimatedMonths }} months</span>
          </div>
          <div class="metric">
            <span class="metric-label">Confidence:</span>
            <span class="metric-value">{{ selectedProjectDetail.metrics.overallConfidence }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TrizAnalysisPanel',
  data() {
    return {
      projects: [],
      metrics: null,
      selectedProject: null,
      selectedProjectDetail: null,
      apiBase: process.env.VUE_APP_API_URL || 'http://localhost:3001'
    };
  },
  watch: {
    selectedProject: {
      async handler(newProject) {
        if (newProject) {
          await this.loadProjectDetail(newProject.id);
        }
      }
    }
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    async refreshData() {
      try {
        await Promise.all([
          this.loadProjects(),
          this.loadMetrics()
        ]);
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    },
    async loadProjects() {
      try {
        const response = await axios.get(`${this.apiBase}/api/triz/projects`);
        this.projects = response.data.projects || [];
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    },
    async loadMetrics() {
      try {
        const response = await axios.get(`${this.apiBase}/api/triz/metrics`);
        this.metrics = response.data.metrics || null;
      } catch (error) {
        console.error('Error loading metrics:', error);
      }
    },
    async loadProjectDetail(projectId) {
      try {
        // Find project file by matching name to id
        const response = await axios.get(`${this.apiBase}/api/triz/projects/${projectId}`);
        this.selectedProjectDetail = response.data.project;
      } catch (error) {
        console.error('Error loading project detail:', error);
      }
    },
    getOutcomeEmoji(outcome) {
      switch (outcome) {
        case 'CONVERGED': return '✅';
        case 'PARTIAL': return '⚠️';
        case 'FAILED': return '❌';
        default: return '❓';
      }
    },
    getStatus(value, threshold) {
      return value >= threshold ? 'pass' : 'fail';
    },
    getThreshold(pillarKey) {
      const thresholds = {
        intentFidelity: 85,
        optimalDesign: 85,
        codeConsistency: 80,
        eleganceScore: 80
      };
      return thresholds[pillarKey] || 80;
    },
    formatPillarName(key) {
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    },
    exportReport() {
      const data = JSON.stringify({
        metrics: this.metrics,
        projects: this.projects,
        exportedAt: new Date().toISOString()
      }, null, 2);

      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `triz-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
};
</script>

<style scoped>
.triz-analysis-panel {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 20px;
}

.header h1 {
  margin: 0;
  color: #333;
  font-size: 28px;
}

.controls {
  display: flex;
  gap: 10px;
}

.btn-refresh, .btn-export, .btn-close {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.btn-refresh:hover, .btn-export:hover {
  background: #0056b3;
}

.btn-close {
  background: #dc3545;
  padding: 4px 12px;
}

.btn-close:hover {
  background: #c82333;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.stat-card.converged {
  border-left: 4px solid #28a745;
}

.stat-card.partial {
  border-left: 4px solid #ffc107;
}

.stat-card.failed {
  border-left: 4px solid #dc3545;
}

.projects-section h2 {
  color: #333;
  margin-bottom: 15px;
}

.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.project-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.project-card.converged {
  border-left: 4px solid #28a745;
}

.project-card.partial {
  border-left: 4px solid #ffc107;
}

.project-card.failed {
  border-left: 4px solid #dc3545;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.project-name {
  font-weight: bold;
  color: #333;
  flex: 1;
}

.project-outcome {
  font-weight: bold;
  font-size: 12px;
  white-space: nowrap;
}

.project-info {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #666;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 20px;
}

.detail-section {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 15px;
}

.detail-header h2 {
  margin: 0;
  color: #333;
}

.four-pillars h3 {
  color: #333;
  margin-top: 0;
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.pillar {
  text-align: center;
}

.pillar-name {
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
  font-size: 12px;
}

.pillar-bar {
  width: 100%;
  height: 20px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.3s ease;
}

.pillar-value {
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.pillar-status {
  font-size: 12px;
  font-weight: bold;
}

.pillar-status.pass {
  color: #28a745;
}

.pillar-status.fail {
  color: #dc3545;
}

.prescriptions h3 {
  color: #333;
  margin-top: 30px;
}

.failing-pillars {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
}

.prescriptions-list {
  display: grid;
  gap: 15px;
}

.prescription-card {
  background: #f8f9fa;
  border-left: 4px solid #007bff;
  border-radius: 4px;
  padding: 15px;
}

.prescription-card.priority-1 {
  border-left-color: #dc3545;
  background: rgba(220, 53, 69, 0.05);
}

.prescription-card.priority-2 {
  border-left-color: #ffc107;
  background: rgba(255, 193, 7, 0.05);
}

.prescription-card.priority-3 {
  border-left-color: #28a745;
  background: rgba(40, 167, 69, 0.05);
}

.prescription-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 14px;
}

.principle-number {
  color: #007bff;
}

.principle-name {
  flex: 1;
  color: #333;
}

.priority {
  font-size: 12px;
  color: #666;
}

.prescription-diagnosis,
.prescription-action {
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.5;
}

.prescription-diagnosis strong,
.prescription-action strong {
  color: #333;
}

.project-metrics h3 {
  color: #333;
  margin-top: 30px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.metric {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.metric-label {
  font-weight: bold;
  color: #333;
}

.metric-value {
  color: #666;
}
</style>
