/**
 * Magnus 14 Storage Bridge
 * Bridges Magnus 14's JSON file storage with dashboard
 *
 * Responsibilities:
 * - Load historical project data from files
 * - Watch for file changes (CLI-generated analyses)
 * - Emit events for real-time updates
 * - Manage storage directory
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readdirSync, readFileSync, watch } from 'fs';
import { EventEmitter } from 'events';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAGNUS_14_PATH = path.join(__dirname, '../../magnus/magnus-14');
const STORAGE_PATH = path.join(MAGNUS_14_PATH, 'storage');

// Event emitter for storage changes
export const storageEvents = new EventEmitter();

/**
 * Load all projects from storage directory
 */
export async function loadMagnus14Projects() {
  try {
    if (!existsSync(STORAGE_PATH)) {
      console.log('📁 Storage directory not found, creating...');
      return [];
    }

    const files = readdirSync(STORAGE_PATH)
      .filter(f => f.endsWith('.json') && f.startsWith('proj_'))
      .sort()
      .reverse(); // Most recent first

    const projects = [];

    for (const file of files) {
      try {
        const filePath = path.join(STORAGE_PATH, file);
        const content = readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        projects.push({
          projectId: data.projectId,
          projectName: data.input?.projectName || 'Unknown',
          domain: data.input?.domain || 'unknown',
          timestamp: data.timestamp,
          clarity: data.input?.currentClarity || 0,
          complexity: data.input?.estimatedComplexity || 0,
          finalEstimate: data.finalEstimate || {},
          engines: {
            spiral: data.spiralAnalysis || {},
            domain: data.domainAnalysis || {},
            poc: data.pocAnalysis || {},
            integration: data.integrationAnalysis || {},
            sideProject: data.sideProjectAnalysis || {},
            framework: data.frameworkAnalysis || {}
          }
        });
      } catch (error) {
        console.warn(`⚠️  Could not parse ${file}:`, error.message);
      }
    }

    console.log(`✅ Loaded ${projects.length} projects from storage`);
    return projects;
  } catch (error) {
    console.error('Error loading projects:', error.message);
    return [];
  }
}

/**
 * Load all outcomes from storage
 */
export async function loadMagnus14Outcomes() {
  try {
    const outcomesPath = path.join(STORAGE_PATH, 'outcomes');

    if (!existsSync(outcomesPath)) {
      return [];
    }

    const files = readdirSync(outcomesPath)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse();

    const outcomes = [];

    for (const file of files) {
      try {
        const filePath = path.join(outcomesPath, file);
        const content = readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        outcomes.push({
          projectId: data.predictionId || data.projectId,
          timestamp: data.timestamp,
          accuracy: data.accuracy || {},
          learnings: data.learnings || [],
          recommendations: data.recommendations || []
        });
      } catch (error) {
        console.warn(`⚠️  Could not parse ${file}:`, error.message);
      }
    }

    console.log(`✅ Loaded ${outcomes.length} outcomes from storage`);
    return outcomes;
  } catch (error) {
    console.error('Error loading outcomes:', error.message);
    return [];
  }
}

/**
 * Watch storage directory for new files (from CLI)
 * Emits 'project-created' and 'outcome-recorded' events
 */
export function watchStorageDirectory() {
  try {
    if (!existsSync(STORAGE_PATH)) {
      console.log('📁 Storage directory not yet created');
      return;
    }

    let fileCache = new Set(readdirSync(STORAGE_PATH));

    const watcher = watch(STORAGE_PATH, { recursive: true }, (eventType, filename) => {
      if (!filename) return;

      // Skip outcomes directory at this level (handled separately)
      if (filename.includes('outcomes')) return;

      // Check if file is new
      const fullPath = path.join(STORAGE_PATH, filename);

      if (!fileCache.has(filename) && filename.endsWith('.json') && filename.startsWith('proj_')) {
        fileCache.add(filename);

        // Small delay to ensure file is fully written
        setTimeout(() => {
          try {
            const content = readFileSync(fullPath, 'utf8');
            const data = JSON.parse(content);

            console.log(`🆕 New project detected: ${data.projectId}`);

            storageEvents.emit('project-created', {
              projectId: data.projectId,
              projectName: data.input?.projectName,
              domain: data.input?.domain,
              timestamp: data.timestamp
            });
          } catch (error) {
            console.warn(`⚠️  Could not process new file ${filename}:`, error.message);
          }
        }, 500);
      }
    });

    // Also watch outcomes directory
    const outcomesPath = path.join(STORAGE_PATH, 'outcomes');
    if (existsSync(outcomesPath)) {
      const outcomeWatcher = watch(outcomesPath, (eventType, filename) => {
        if (!filename || !filename.endsWith('.json')) return;

        const fullPath = path.join(outcomesPath, filename);

        setTimeout(() => {
          try {
            const content = readFileSync(fullPath, 'utf8');
            const data = JSON.parse(content);

            console.log(`📊 Outcome recorded: ${data.predictionId}`);

            storageEvents.emit('outcome-recorded', {
              projectId: data.predictionId,
              accuracy: data.accuracy,
              timestamp: data.timestamp
            });
          } catch (error) {
            console.warn(`⚠️  Could not process outcome ${filename}:`, error.message);
          }
        }, 500);
      });
    }

    console.log('👀 Storage watcher initialized');
    return watcher;
  } catch (error) {
    console.error('Error setting up storage watcher:', error.message);
    return null;
  }
}

/**
 * Get storage statistics
 */
export function getStorageStats() {
  try {
    const stats = {
      storageExists: existsSync(STORAGE_PATH),
      projectCount: 0,
      outcomeCount: 0,
      totalSize: 0,
      path: STORAGE_PATH
    };

    if (stats.storageExists) {
      const files = readdirSync(STORAGE_PATH);
      stats.projectCount = files.filter(f => f.endsWith('.json') && f.startsWith('proj_')).length;

      const outcomesPath = path.join(STORAGE_PATH, 'outcomes');
      if (existsSync(outcomesPath)) {
        stats.outcomeCount = readdirSync(outcomesPath).filter(f => f.endsWith('.json')).length;
      }
    }

    return stats;
  } catch (error) {
    console.error('Error getting storage stats:', error.message);
    return {
      storageExists: false,
      projectCount: 0,
      outcomeCount: 0,
      totalSize: 0,
      path: STORAGE_PATH
    };
  }
}

/**
 * Initialize storage (load data and watch for changes)
 * Called from server/index.js at startup
 */
export async function initializeMagnus14Storage() {
  try {
    console.log('\n📦 Initializing Magnus 14 Storage...');

    // Load historical data
    const projects = await loadMagnus14Projects();
    const outcomes = await loadMagnus14Outcomes();

    console.log(`   └─ Projects: ${projects.length}`);
    console.log(`   └─ Outcomes: ${outcomes.length}`);

    // Start watching for changes
    watchStorageDirectory();

    const stats = getStorageStats();
    console.log(`✅ Storage initialized - ${stats.projectCount} projects, ${stats.outcomeCount} outcomes`);

    return {
      projects,
      outcomes,
      stats
    };
  } catch (error) {
    console.error('⚠️  Storage initialization warning:', error.message);
    return {
      projects: [],
      outcomes: [],
      stats: getStorageStats()
    };
  }
}

/**
 * Setup WebSocket event forwarding
 * Broadcasts storage events to connected clients
 */
export function setupStorageEventBroadcasting(broadcast) {
  // Forward project-created events
  storageEvents.on('project-created', (data) => {
    broadcast({
      type: 'magnus14-analysis-completed',
      projectId: data.projectId,
      projectName: data.projectName,
      domain: data.domain,
      timestamp: data.timestamp
    });
  });

  // Forward outcome-recorded events
  storageEvents.on('outcome-recorded', (data) => {
    broadcast({
      type: 'magnus14-outcome-recorded',
      projectId: data.projectId,
      accuracy: data.accuracy,
      timestamp: data.timestamp
    });
  });

  console.log('✅ Storage event broadcasting initialized');
}

export default {
  loadMagnus14Projects,
  loadMagnus14Outcomes,
  watchStorageDirectory,
  getStorageStats,
  initializeMagnus14Storage,
  setupStorageEventBroadcasting,
  storageEvents
};
