/**
 * Magnus Integration Module
 * Connects Magnus13 framework to the dashboard server
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAGNUS_PATH = path.join(__dirname, '../../magnus');

let Magnus13 = null;
let magnus = null;

/**
 * Initialize Magnus13 framework
 */
export async function initializeMagnus() {
  try {
    // Dynamically import Magnus13
    const magnusModule = await import(`file://${MAGNUS_PATH}/magnus-13.js`);
    Magnus13 = magnusModule.default || magnusModule.Magnus13;
    
    // Create instance
    magnus = new Magnus13({
      autoLearn: true,
      storageDir: path.join(MAGNUS_PATH, '.magnus')
    });
    
    // Initialize
    await magnus.initialize();
    
    console.log('✅ Magnus13 initialized and connected');
    return magnus;
  } catch (error) {
    console.error('⚠️  Magnus13 initialization warning:', error.message);
    console.log('📍 Dashboard will work in standalone mode');
    return null;
  }
}

/**
 * Get Magnus instance
 */
export function getMagnus() {
  return magnus;
}

/**
 * Process request through Magnus
 */
export async function processThroughMagnus(request) {
  if (!magnus) {
    return {
      status: 'warning',
      message: 'Magnus not initialized',
      data: null
    };
  }

  try {
    const result = await magnus.analyze(request);
    return {
      status: 'success',
      message: result.message || 'Processed',
      data: result,
      clarity: result.clarityScore || 0,
      complexity: result.complexity || 0
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      data: null
    };
  }
}

/**
 * Get Magnus status
 */
export function getMagnusStatus() {
  if (!magnus) {
    return {
      initialized: false,
      message: 'Magnus not initialized'
    };
  }

  return {
    initialized: magnus.initialized,
    config: {
      autoLearn: magnus.config.autoLearn,
      requireClarification: magnus.config.requireClarification,
      minClarityScore: magnus.config.minClarityScore
    },
    engines: {
      understanding: magnus.understanding ? 'ready' : 'not available',
      complexity: magnus.complexity ? 'ready' : 'not available',
      learning: magnus.learning ? 'ready' : 'not available',
      coherence: magnus.coherence ? 'ready' : 'not available'
    }
  };
}
