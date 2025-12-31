/**
 * 🌌 Magnus Universe - Smart Import Helper
 *
 * Resolves imports intelligently from any location
 * Handles both relative and absolute imports
 *
 * Usage:
 *   import { getCloud, getMagnus, getProject } from './lib/magnus-imports.js';
 *
 *   const cloud = await getCloud();
 *   const magnus = await getMagnus();
 *   const cloudzero = await getProject('cloudzero');
 */

import path from 'path';
import { fileURLToPath } from 'url';

// Get Magnus Universe root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MAGNUS_ROOT = path.resolve(__dirname, '..');

/**
 * Get CloudZero Proxy (cloud services API)
 * @returns {Promise<Object>} Cloud proxy instance
 */
export async function getCloud() {
  const { cloud } = await import('../generated/cloudzero-proxy/cloudzero-proxy.js');
  return cloud;
}

/**
 * Get Magnus 13 Framework
 * @returns {Promise<Object>} Magnus framework instance
 */
export async function getMagnus() {
  const { default: Magnus13 } = await import('../magnus/magnus-13.js');
  return new Magnus13();
}

/**
 * Get Magnus 13 Extended (with cloud storage)
 * @returns {Promise<Object>} Magnus13Extended framework instance
 */
export async function getMagnusExtended() {
  const { default: Magnus13Extended } = await import('../magnus/magnus-13-extended.js');
  return new Magnus13Extended();
}

/**
 * Get Magnus Cloud Storage module
 * @returns {Promise<Class>} MagnusCloudStorage class
 */
export async function getMagnusCloudStorage() {
  const { default: MagnusCloudStorage } = await import('../magnus/magnus-cloud-storage.js');
  return MagnusCloudStorage;
}

/**
 * Get specific generated project
 * @param {string} projectName - Project name (e.g., 'cloudzero')
 * @returns {Promise<Object>} Project exports
 */
export async function getProject(projectName) {
  try {
    // Map project names to their actual directory and file names
    const projectMap = {
      'cloudzero': { dir: 'cloudzero-proxy', file: 'cloudzero-proxy.js' }
    };

    const config = projectMap[projectName] || { dir: projectName, file: `${projectName}.js` };
    const projectPath = `../generated/${config.dir}/${config.file}`;
    return await import(projectPath);
  } catch (error) {
    throw new Error(`Project "${projectName}" not found in generated/ directory. Error: ${error.message}`);
  }
}

/**
 * Get all available projects
 * @returns {Promise<Array>} List of available projects
 */
export async function listProjects() {
  return ['cloudzero'];
}

/**
 * Get Magnus root directory path
 * @returns {string} Absolute path to Magnus Universe root
 */
export function getMagnusRoot() {
  return MAGNUS_ROOT;
}

/**
 * Resolve path relative to Magnus root
 * @param {string} relativePath - Path relative to Magnus root
 * @returns {string} Absolute path
 */
export function resolveMagnusPath(relativePath) {
  return path.resolve(MAGNUS_ROOT, relativePath);
}

/**
 * Quick access to all exports
 * @returns {Promise<Object>} All Magnus Universe exports
 */
export async function getMagnusUniverse() {
  return {
    cloud: await getCloud(),
    magnus: await getMagnus(),
    root: getMagnusRoot(),
    projects: {
      cloudzero: await getProject('cloudzero')
    }
  };
}

// Default export for convenience
export default {
  getCloud,
  getMagnus,
  getMagnusExtended,
  getMagnusCloudStorage,
  getProject,
  listProjects,
  getMagnusRoot,
  resolveMagnusPath,
  getMagnusUniverse
};
