/**
 * Magnus Dashboard Launcher with Magnus 14 Integration
 *
 * Initializes the complete dashboard with:
 * - Magnus 14 project analysis framework
 * - ProjectDashboardAPI for analytics
 * - Real-time WebSocket updates
 * - REST API endpoints
 */

import DashboardServer from './dashboard-server.js';
import { initializeMagnus14, getMagnus14 } from './magnus-14-integration.js';
import ProjectDashboardAPI from '../../magnus/magnus-14/project-dashboard-api.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startDashboard() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║      MAGNUS DASHBOARD 15.3 + MAGNUS 14                    ║
║      Starting Comprehensive Project Management System     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);

  try {
    // Initialize Magnus 14
    console.log('🔧 Initializing Magnus 14...');
    const magnus14 = await initializeMagnus14();

    if (!magnus14) {
      console.warn('⚠️  Magnus 14 initialization warning - continuing with partial functionality');
    } else {
      console.log('✅ Magnus 14 initialized successfully');
    }

    // Create ProjectDashboardAPI instance
    const dashboardAPI = magnus14 ? new ProjectDashboardAPI(magnus14) : null;

    if (dashboardAPI) {
      console.log('✅ ProjectDashboardAPI created');

      // Test data fetch
      try {
        const testData = dashboardAPI.getDashboardData();
        console.log(`📊 Dashboard data ready: ${testData.projects.total} projects loaded`);
      } catch (error) {
        console.warn('⚠️  Could not fetch dashboard data:', error.message);
      }
    } else {
      console.warn('⚠️  Dashboard API not available');
    }

    // Create and start dashboard server
    const server = new DashboardServer({
      port: 3333,
      host: 'localhost',
      enableWebSocket: true,
      corsEnabled: true,
      magnus14,
      dashboardAPI
    });

    await server.start();

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║              DASHBOARD READY                              ║
║                                                           ║
║  Main Dashboard: http://localhost:3333                    ║
║  API Endpoints: http://localhost:3333/api                 ║
║                                                           ║
║  Dashboard Views:                                         ║
║  - 📊 Overview (Patterns & Sync Status)                   ║
║  - 🧠 Magnus 14 (Project Analysis)                        ║
║    - Overview (Health, Phases, Metrics)                   ║
║    - Projects (All projects list)                         ║
║    - Analysis (Domain, Complexity, Timeline, Risks)       ║
║                                                           ║
║  API Routes:                                              ║
║  - GET /api/dashboard/overview                            ║
║  - GET /api/dashboard/projects                            ║
║  - GET /api/dashboard/health                              ║
║  - GET /api/dashboard/domains                             ║
║  - GET /api/dashboard/complexity                          ║
║  - GET /api/dashboard/timeline                            ║
║  - GET /api/dashboard/confidence                          ║
║  - GET /api/dashboard/risks                               ║
║  - GET /api/dashboard/project/:projectId                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down dashboard...');
      await server.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Fatal error starting dashboard:', error);
    process.exit(1);
  }
}

// Start the dashboard
startDashboard().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
