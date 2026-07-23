# TRIZ Analysis Dashboard Integration

This guide explains how to integrate the TRIZ (Theory of Inventive Problem Solving) analysis system into the Magnus Dashboard.

## Overview

The TRIZ Dashboard provides real-time visualization and analysis of:
- **Project Convergence Status** (CONVERGED, PARTIAL, FAILED)
- **Four Pillars Metrics** (Intent Fidelity, Optimal Design, Code Consistency, Elegance Score)
- **TRIZ Prescriptions** (Ranked principles and actionable recommendations)
- **Effectiveness Metrics** (Which TRIZ principles work best for different problem types)

## Components

### 1. TRIZ API Server (`triz-api-server.js`)

A dedicated Express server providing REST endpoints for TRIZ data:

```bash
node triz-api-server.js
# Runs on http://localhost:3001
```

**Available Endpoints:**

- `GET /health` - Health check
- `GET /api/triz/projects` - List all projects with TRIZ analysis
- `GET /api/triz/projects/:filename` - Get specific project analysis
- `GET /api/triz/metrics` - Get effectiveness metrics and statistics
- `GET /api/triz/report` - Get comprehensive summary report

**Example Response:**

```json
{
  "success": true,
  "count": 2,
  "projects": [
    {
      "id": "proj_claude_code_framework",
      "name": "CLAUDE CODE FRAMEWORK",
      "createdAt": "2025-12-13T10:00:00Z",
      "complexity": "MODERATE",
      "convergence": "FAILED",
      "pillars": {
        "intentFidelity": 69,
        "optimalDesign": 50,
        "codeConsistency": 61,
        "eleganceScore": 67
      },
      "trizPrescriptions": 7,
      "failingPillars": ["intentFidelity", "optimalDesign", "codeConsistency", "eleganceScore"]
    }
  ]
}
```

### 2. Vue Component (`components/TrizAnalysisPanel.vue`)

A reusable Vue 3 component providing:

- **Summary Statistics** - Total projects, convergence breakdown
- **Project List** - Clickable cards showing project status
- **Detail View** - Full analysis including:
  - Four Pillars visualization with progress bars
  - TRIZ prescriptions grouped by priority
  - Project metrics (complexity, components, duration)

**Usage in Vue App:**

```vue
<template>
  <div id="app">
    <TrizAnalysisPanel />
  </div>
</template>

<script>
import TrizAnalysisPanel from './components/TrizAnalysisPanel.vue';

export default {
  components: {
    TrizAnalysisPanel
  }
};
</script>
```

**Environment Variables:**

```env
VUE_APP_API_URL=http://localhost:3001
```

## Setup Instructions

### Step 1: Start TRIZ API Server

```bash
cd magnus-dashboard
npm install
node triz-api-server.js
```

The server starts on `http://localhost:3001`

### Step 2: Configure Dashboard

If using an existing Vue dashboard:

1. Install the component:
   ```bash
   cp components/TrizAnalysisPanel.vue path/to/your/dashboard/src/components/
   ```

2. Register in your main app:
   ```javascript
   import TrizAnalysisPanel from './components/TrizAnalysisPanel.vue'
   app.component('TrizAnalysisPanel', TrizAnalysisPanel)
   ```

3. Add to your template:
   ```vue
   <TrizAnalysisPanel />
   ```

### Step 3: Configure API Base URL

Set the API endpoint in your `.env`:

```env
VUE_APP_API_URL=http://localhost:3001
```

Or in the component:

```javascript
const apiBase = process.env.VUE_APP_API_URL || 'http://localhost:3001'
```

## Data Flow

```
Magnus Storage
      ↓
storage-triz-analyzer.js
      ↓
triz-api-server.js (REST API)
      ↓
TrizAnalysisPanel.vue (Dashboard UI)
      ↓
User Browser
```

## API Integration Examples

### Get All Projects

```javascript
const response = await fetch('http://localhost:3001/api/triz/projects');
const data = await response.json();
console.log(data.projects);
```

### Get Specific Project

```javascript
const response = await fetch('http://localhost:3001/api/triz/projects/proj_claude_code_framework_1765618892622.json');
const data = await response.json();
console.log(data.project.trizPrescriptions);
```

### Get Metrics

```javascript
const response = await fetch('http://localhost:3001/api/triz/metrics');
const data = await response.json();
console.log(data.metrics.summary);
```

## Four Pillars Thresholds

The dashboard displays convergence status based on these thresholds:

| Pillar | Threshold | Status |
|--------|-----------|--------|
| Intent Fidelity | 85 | ✅ Pass |
| Optimal Design | 85 | ✅ Pass |
| Code Consistency | 80 | ✅ Pass |
| Elegance Score | 80 | ✅ Pass |

**Convergence Outcome:**
- **✅ CONVERGED** - All 4 pillars ≥ threshold
- **⚠️ PARTIAL** - 1-3 pillars below threshold
- **❌ FAILED** - 4 pillars below threshold

## TRIZ Prescriptions

Each failing project receives prescriptions grouped by priority:

**Priority 1** (Critical)
- Principle 1: Segmentation
- Principle 10: Prior Action

**Priority 2** (Important)
- Principle 3: Local Quality
- Principle 7: Nested Doll
- Principle 13: Inversion
- Principle 17: Universality

**Priority 3** (Refinement)
- Principle 25: Self-service

## Performance Optimization

### Caching

The TRIZ API server uses in-memory caching:

```javascript
// Add to triz-api-server.js if needed
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 }); // 10-minute cache
```

### Lazy Loading

The Vue component only loads project details when clicked:

```javascript
async loadProjectDetail(projectId) {
  // Detailed analysis fetched on demand
  const response = await axios.get(`${this.apiBase}/api/triz/projects/${projectId}`);
  this.selectedProjectDetail = response.data.project;
}
```

## Troubleshooting

### API Connection Error

```
Error: Cannot connect to http://localhost:3001
```

**Solution:**
1. Verify API server is running: `node triz-api-server.js`
2. Check port 3001 is not in use: `lsof -i :3001` (Mac/Linux) or `netstat -ano | findstr :3001` (Windows)
3. Verify TRIZ analyzer dependencies are installed

### Projects Not Loading

```
No projects available
```

**Solution:**
1. Verify Magnus storage has projects: `ls magnus/magnus-14/storage/proj_*.json`
2. Check storage path in `triz-api-server.js`
3. Run TRIZ analysis: `npm run analyze:triz:hybrid` in `magnus/magnus-14`

### Metrics Calculation Issues

**Solution:**
1. Ensure all projects have valid pillar scores
2. Check for NaN or undefined values in API response
3. Run manual analysis: `node triz-ci-formatter.js`

## Next Steps

1. **Real-time Updates**: Add WebSocket support for live analysis
2. **Effectiveness Tracking**: Track which TRIZ principles resolve the most issues
3. **Threshold Calibration**: Auto-tune thresholds based on historical data
4. **Export/Reporting**: Generate PDF reports from dashboard
5. **Mobile UI**: Responsive design for mobile monitoring

## Files Reference

| File | Purpose |
|------|---------|
| `triz-api-server.js` | REST API server providing TRIZ data |
| `components/TrizAnalysisPanel.vue` | Vue component for dashboard UI |
| `TRIZ_INTEGRATION.md` | This file |
| `../magnus/magnus-14/triz-ci-formatter.js` | CLI report formatter |
| `../magnus/magnus-14/storage/storage-triz-analyzer.js` | Core TRIZ analysis |

## Support

For issues or questions:
1. Check `.github/workflows/ci.yml` for TRIZ CI/CD integration
2. Review memory files: `.claude/projects/*/memory/*.md`
3. Run diagnostic: `npm run analyze:triz:hybrid`

---

**Status:** Production Ready (v1.0)  
**Last Updated:** 2026-07-23  
**Maintained by:** Magnus Team
