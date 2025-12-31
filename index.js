/**
 * 🌌 Magnus Universe - Central Export Hub
 *
 * Import point for all generated projects and magnus framework
 * Zero-friction access from anywhere in Magnus Universe
 *
 * Usage:
 *   // From any project file:
 *   import { cloud } from '../Magnus_13_universe/index.js';
 *   await cloud.payment.charge(1000, 'eur');
 *
 *   // Or with npm/node path resolution:
 *   import { cloud } from 'magnus-universe';
 */

// CloudZero Proxy - Anti-friction API for cloud services
export { cloud, CloudZeroProxy } from './generated/cloudzero-proxy/cloudzero-proxy.js';

// Magnus Framework (core orchestrator)
export { default as Magnus13 } from './magnus/magnus-13.js';

// Magnus Extended (with cloud storage)
export { default as Magnus13Extended } from './magnus/magnus-13-extended.js';

// Magnus Cloud Storage
export { default as MagnusCloudStorage } from './magnus/magnus-cloud-storage.js';

// Export all generated projects
export const projects = {
  cloudzero: {
    cloud: (await import('./generated/cloudzero-proxy/cloudzero-proxy.js')).cloud,
    path: './generated/cloudzero-proxy/'
  }
};

// Export Magnus ecosystem
export const magnus = {
  core: (await import('./magnus/magnus-13-core.js')).default,
  learning: (await import('./magnus/magnus-13-learning-coherence.js')).default,
  main: (await import('./magnus/magnus-13.js')).default,
  extended: (await import('./magnus/magnus-13-extended.js')).default,
  cloudStorage: (await import('./magnus/magnus-cloud-storage.js')).default,
  path: './magnus/'
};

/**
 * Convenience function for quick access
 * Usage: const { cloud } = await getMagnusUniverseExports();
 */
export async function getMagnusUniverseExports() {
  return {
    cloud: (await import('./generated/cloudzero-proxy/cloudzero-proxy.js')).cloud,
    projects,
    magnus
  };
}

export default {
  cloud: (await import('./generated/cloudzero-proxy/cloudzero-proxy.js')).cloud,
  projects,
  magnus,
  getMagnusUniverseExports
};
