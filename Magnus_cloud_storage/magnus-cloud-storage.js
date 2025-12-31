/**
 * Magnus Cloud Storage
 * 
 * Persist Magnus data (learning, sessions, scans) to cloud via CloudZero
 * 
 * Features:
 * - Backup learning data to S3
 * - Archive generation sessions
 * - Store scan reports
 * - Sync between machines
 * - Disaster recovery
 */

import { getCloud } from '../lib/magnus-imports.js';
import fs from 'fs/promises';
import path from 'path';

class MagnusCloudStorage {
  constructor(config = {}) {
    this.config = {
      autoBackup: config.autoBackup !== false,
      backupInterval: config.backupInterval || 3600000, // 1 hour
      storagePrefix: config.storagePrefix || 'magnus-data',
      compressionEnabled: config.compressionEnabled !== false
    };

    this.cloud = null;
    this.backupTimer = null;
    this.initialized = false;
  }

  /**
   * Initialize CloudZero connection
   */
  async initialize() {
    if (this.initialized) return;

    console.log('🗄️  Initializing Magnus Cloud Storage...');
    
    this.cloud = await getCloud();
    
    if (this.config.autoBackup) {
      this.startAutoBackup();
    }

    this.initialized = true;
    console.log('✅ Magnus Cloud Storage ready');
  }

  /**
   * Start automatic backup timer
   */
  startAutoBackup() {
    this.backupTimer = setInterval(async () => {
      try {
        await this.backupAll();
        console.log('✅ Auto-backup completed');
      } catch (error) {
        console.error('❌ Auto-backup failed:', error.message);
      }
    }, this.config.backupInterval);

    console.log(`⏰ Auto-backup enabled (every ${this.config.backupInterval / 1000 / 60} minutes)`);
  }

  /**
   * Stop automatic backup
   */
  stopAutoBackup() {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
      this.backupTimer = null;
      console.log('⏸️  Auto-backup stopped');
    }
  }

  // ============================================================================
  // LEARNING DATA PERSISTENCE
  // ============================================================================

  /**
   * Backup learning data to cloud
   */
  async backupLearningData(learningData) {
    console.log('💾 Backing up learning data...');

    const data = {
      timestamp: Date.now(),
      version: '13.0',
      type: 'learning',
      data: learningData,
      stats: {
        patterns: Array.isArray(learningData.patterns) ? learningData.patterns.length : (learningData.patterns?.size || 0),
        estimates: learningData.estimates?.length || 0,
        actuals: learningData.actuals?.length || 0,
        failures: learningData.failures?.length || 0
      }
    };

    const json = JSON.stringify(data, null, 2);
    const buffer = Buffer.from(json);
    const filename = `${this.config.storagePrefix}/learning/knowledge-${Date.now()}.json`;

    await this.cloud.storage.upload(buffer, filename);

    console.log(`✅ Learning data backed up: ${filename}`);
    console.log(`   Patterns: ${data.stats.patterns}`);
    console.log(`   Estimates: ${data.stats.estimates}`);
    console.log(`   Actuals: ${data.stats.actuals}`);

    return { filename, stats: data.stats };
  }

  /**
   * Restore learning data from cloud
   */
  async restoreLearningData(timestamp = 'latest') {
    console.log('📥 Restoring learning data...');

    let filename;
    if (timestamp === 'latest') {
      // Get latest backup (would need list functionality)
      filename = `${this.config.storagePrefix}/learning/knowledge-latest.json`;
    } else {
      filename = `${this.config.storagePrefix}/learning/knowledge-${timestamp}.json`;
    }

    const data = await this.cloud.storage.download(filename);
    const learningData = JSON.parse(data.toString());

    console.log(`✅ Learning data restored from ${filename}`);
    return learningData.data;
  }

  // ============================================================================
  // SESSION PERSISTENCE
  // ============================================================================

  /**
   * Archive generation session
   */
  async archiveSession(sessionId, sessionData) {
    console.log(`📦 Archiving session ${sessionId}...`);

    const data = {
      sessionId,
      timestamp: Date.now(),
      version: '13.0',
      type: 'session',
      data: sessionData
    };

    const json = JSON.stringify(data, null, 2);
    const buffer = Buffer.from(json);
    const filename = `${this.config.storagePrefix}/sessions/${sessionId}.json`;

    await this.cloud.storage.upload(buffer, filename);

    console.log(`✅ Session archived: ${filename}`);
    return { filename, sessionId };
  }

  /**
   * Restore session from cloud
   */
  async restoreSession(sessionId) {
    console.log(`📥 Restoring session ${sessionId}...`);

    const filename = `${this.config.storagePrefix}/sessions/${sessionId}.json`;
    const data = await this.cloud.storage.download(filename);
    const sessionData = JSON.parse(data.toString());

    console.log(`✅ Session restored: ${sessionId}`);
    return sessionData.data;
  }

  // ============================================================================
  // SCAN REPORTS PERSISTENCE
  // ============================================================================

  /**
   * Archive scan report
   */
  async archiveScanReport(report) {
    console.log('🔍 Archiving scan report...');

    const data = {
      timestamp: report.timestamp || Date.now(),
      version: '14.0',
      type: 'scan',
      report: report,
      summary: {
        projectsScanned: report.projectsScanned || 0,
        patternsDetected: report.patterns?.length || 0,
        recommendations: report.recommendations?.length || 0
      }
    };

    const json = JSON.stringify(data, null, 2);
    const buffer = Buffer.from(json);
    const filename = `${this.config.storagePrefix}/scans/scan-${data.timestamp}.json`;

    await this.cloud.storage.upload(buffer, filename);

    console.log(`✅ Scan report archived: ${filename}`);
    console.log(`   Projects scanned: ${data.summary.projectsScanned}`);
    console.log(`   Patterns detected: ${data.summary.patternsDetected}`);

    return { filename, summary: data.summary };
  }

  /**
   * Get scan history
   */
  async getScanHistory(limit = 10) {
    console.log(`📊 Retrieving scan history (last ${limit} scans)...`);

    // Note: This would require CloudZero to support listing files
    // For now, return mock structure
    const history = {
      scans: [],
      message: 'Scan history retrieval requires CloudZero list functionality'
    };

    console.log('ℹ️  Scan history feature pending CloudZero list support');
    return history;
  }

  // ============================================================================
  // ARCHITECTURAL DECISIONS PERSISTENCE
  // ============================================================================

  /**
   * Archive architectural decision
   */
  async archiveDecision(decision) {
    console.log('🏛️  Archiving architectural decision...');

    const data = {
      timestamp: Date.now(),
      version: '13.0',
      type: 'decision',
      decision: decision
    };

    const json = JSON.stringify(data, null, 2);
    const buffer = Buffer.from(json);
    const filename = `${this.config.storagePrefix}/decisions/decision-${data.timestamp}.json`;

    await this.cloud.storage.upload(buffer, filename);

    console.log(`✅ Decision archived: ${filename}`);
    return { filename };
  }

  // ============================================================================
  // GENERATED PROJECTS BACKUP
  // ============================================================================

  /**
   * Backup entire generated project
   */
  async backupGeneratedProject(projectName, projectPath) {
    console.log(`📦 Backing up generated project: ${projectName}...`);

    try {
      // Read all files in project
      const files = await this.getAllFiles(projectPath);
      
      let totalSize = 0;
      let fileCount = 0;

      for (const file of files) {
        const content = await fs.readFile(file);
        const relativePath = path.relative(projectPath, file);
        const cloudPath = `${this.config.storagePrefix}/projects/${projectName}/${relativePath}`;

        await this.cloud.storage.upload(content, cloudPath);
        
        totalSize += content.length;
        fileCount++;
      }

      console.log(`✅ Project backed up: ${projectName}`);
      console.log(`   Files: ${fileCount}`);
      console.log(`   Size: ${(totalSize / 1024).toFixed(2)} KB`);

      return { projectName, fileCount, totalSize };
    } catch (error) {
      console.error(`❌ Project backup failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Restore generated project
   */
  async restoreGeneratedProject(projectName, targetPath) {
    console.log(`📥 Restoring project: ${projectName} to ${targetPath}...`);

    // Note: This would require CloudZero to support listing files
    console.log('ℹ️  Project restoration requires CloudZero list functionality');
    
    return {
      message: 'Project restore pending CloudZero list support',
      projectName,
      targetPath
    };
  }

  // ============================================================================
  // BACKUP ALL
  // ============================================================================

  /**
   * Backup all Magnus data
   */
  async backupAll() {
    console.log('🌐 Starting complete backup...');

    const results = {
      timestamp: Date.now(),
      learning: null,
      sessions: [],
      scans: [],
      errors: []
    };

    try {
      // Backup learning data if it exists locally
      const learningPath = './.magnus/knowledge/knowledge.json';
      try {
        const learningData = JSON.parse(await fs.readFile(learningPath, 'utf-8'));
        results.learning = await this.backupLearningData(learningData);
      } catch (error) {
        results.errors.push({ type: 'learning', error: error.message });
      }

      // Backup sessions if they exist locally
      const sessionsPath = './.magnus/sessions';
      try {
        const sessionFiles = await fs.readdir(sessionsPath);
        for (const file of sessionFiles) {
          if (file.endsWith('.json')) {
            const sessionData = JSON.parse(
              await fs.readFile(path.join(sessionsPath, file), 'utf-8')
            );
            const result = await this.archiveSession(
              path.basename(file, '.json'),
              sessionData
            );
            results.sessions.push(result);
          }
        }
      } catch (error) {
        results.errors.push({ type: 'sessions', error: error.message });
      }

      console.log('✅ Complete backup finished');
      console.log(`   Learning: ${results.learning ? 'backed up' : 'skipped'}`);
      console.log(`   Sessions: ${results.sessions.length} backed up`);
      console.log(`   Errors: ${results.errors.length}`);

      return results;
    } catch (error) {
      console.error('❌ Complete backup failed:', error.message);
      throw error;
    }
  }

  // ============================================================================
  // SYNC OPERATIONS
  // ============================================================================

  /**
   * Sync local data with cloud (bidirectional)
   */
  async sync() {
    console.log('🔄 Syncing Magnus data with cloud...');

    const syncResults = {
      uploaded: 0,
      downloaded: 0,
      conflicts: 0,
      errors: []
    };

    try {
      // Upload local changes
      await this.backupAll();
      syncResults.uploaded = 1;

      // Note: Download from cloud would require list functionality
      console.log('ℹ️  Download sync requires CloudZero list functionality');

      console.log('✅ Sync completed');
      console.log(`   Uploaded: ${syncResults.uploaded}`);
      console.log(`   Downloaded: ${syncResults.downloaded}`);

      return syncResults;
    } catch (error) {
      console.error('❌ Sync failed:', error.message);
      throw error;
    }
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Get all files recursively
   */
  async getAllFiles(dirPath, arrayOfFiles = []) {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        // Skip node_modules and hidden directories
        if (file !== 'node_modules' && !file.startsWith('.')) {
          arrayOfFiles = await this.getAllFiles(filePath, arrayOfFiles);
        }
      } else {
        arrayOfFiles.push(filePath);
      }
    }

    return arrayOfFiles;
  }

  /**
   * Get storage statistics
   */
  async getStats() {
    return {
      autoBackup: this.config.autoBackup,
      backupInterval: this.config.backupInterval,
      storagePrefix: this.config.storagePrefix,
      initialized: this.initialized,
      note: 'Cloud storage stats require CloudZero list functionality'
    };
  }

  /**
   * Cleanup - stop auto-backup
   */
  async cleanup() {
    this.stopAutoBackup();
    console.log('🧹 Magnus Cloud Storage cleaned up');
  }
}

export default MagnusCloudStorage;
