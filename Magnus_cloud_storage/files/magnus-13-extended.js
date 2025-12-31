/**
 * Magnus 13 Extended
 * 
 * Magnus 13 with CloudZero Storage integration
 * 
 * Features:
 * - All Magnus 13 capabilities
 * - Automatic cloud backup
 * - Session persistence
 * - Learning data sync
 * - Disaster recovery
 */

import Magnus13 from './magnus-13.js';
import MagnusCloudStorage from './magnus-cloud-storage.js';

class Magnus13Extended extends Magnus13 {
  constructor(config = {}) {
    super(config);
    
    this.cloudConfig = {
      enabled: config.cloudStorage !== false,
      autoBackup: config.autoBackup !== false,
      backupInterval: config.backupInterval || 3600000, // 1 hour
      backupOnGeneration: config.backupOnGeneration !== false
    };

    this.cloudStorage = new MagnusCloudStorage({
      autoBackup: this.cloudConfig.autoBackup,
      backupInterval: this.cloudConfig.backupInterval
    });
  }

  /**
   * Initialize Magnus + Cloud Storage
   */
  async initialize() {
    if (this.initialized) return;

    console.log('🌌 Initializing Magnus 13 Extended...');

    // Initialize base Magnus
    await super.initialize();

    // Initialize Cloud Storage if enabled
    if (this.cloudConfig.enabled) {
      try {
        await this.cloudStorage.initialize();
        console.log('✅ Cloud Storage initialized');
      } catch (error) {
        console.warn('⚠️  Cloud Storage initialization failed:', error.message);
        console.warn('   Continuing without cloud backup...');
      }
    }

    this.initialized = true;
    console.log('🌌 Magnus 13 Extended ready');
  }

  /**
   * Analyze with cloud backup
   */
  async analyze(request, options = {}) {
    const analysis = await super.analyze(request, options);

    // Optionally backup analysis
    if (options.cloudBackup && this.cloudConfig.enabled) {
      try {
        await this.cloudStorage.archiveDecision({
          type: 'ANALYSIS',
          request,
          analysis,
          timestamp: Date.now()
        });
        console.log('☁️  Analysis backed up to cloud');
      } catch (error) {
        console.warn('⚠️  Analysis backup failed:', error.message);
      }
    }

    return analysis;
  }

  /**
   * Start generation with cloud backup
   */
  async startGeneration(analysis, options = {}) {
    const session = await super.startGeneration(analysis, options);

    // Backup session to cloud
    if (this.cloudConfig.backupOnGeneration && this.cloudConfig.enabled) {
      try {
        await this.cloudStorage.archiveSession(session.sessionId, {
          analysis,
          session,
          timestamp: Date.now()
        });
        console.log(`☁️  Session ${session.sessionId} backed up to cloud`);
      } catch (error) {
        console.warn('⚠️  Session backup failed:', error.message);
      }
    }

    return session;
  }

  /**
   * Record outcome with cloud backup
   */
  async recordOutcome(sessionId, outcome) {
    const result = await super.recordOutcome(sessionId, outcome);

    // Backup learning data to cloud
    if (this.cloudConfig.enabled) {
      try {
        const learningData = {
          patterns: Array.from(this.learning.patterns.entries()),
          estimates: this.learning.estimates,
          actuals: this.learning.actuals,
          failures: this.learning.failures,
          metrics: this.learning.metrics
        };

        await this.cloudStorage.backupLearningData(learningData);
        console.log('☁️  Learning data backed up to cloud');
      } catch (error) {
        console.warn('⚠️  Learning backup failed:', error.message);
      }
    }

    return result;
  }

  /**
   * Record failure with cloud logging
   */
  async recordFailure(sessionId, failure) {
    await super.recordFailure(sessionId, failure);

    // Log failure to cloud
    if (this.cloudConfig.enabled) {
      try {
        await this.cloudStorage.archiveDecision({
          type: 'FAILURE',
          sessionId,
          failure,
          timestamp: Date.now()
        });
        console.log('☁️  Failure logged to cloud');
      } catch (error) {
        console.warn('⚠️  Failure logging failed:', error.message);
      }
    }
  }

  /**
   * Backup all Magnus data to cloud
   */
  async backupToCloud() {
    if (!this.cloudConfig.enabled) {
      console.log('ℹ️  Cloud storage not enabled');
      return null;
    }

    console.log('🌐 Backing up all Magnus data...');
    
    try {
      const results = await this.cloudStorage.backupAll();
      console.log('✅ Backup completed successfully');
      return results;
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      throw error;
    }
  }

  /**
   * Restore learning data from cloud
   */
  async restoreFromCloud(timestamp = 'latest') {
    if (!this.cloudConfig.enabled) {
      console.log('ℹ️  Cloud storage not enabled');
      return null;
    }

    console.log('📥 Restoring Magnus data from cloud...');
    
    try {
      const learningData = await this.cloudStorage.restoreLearningData(timestamp);
      
      // Restore into Magnus
      this.learning.patterns = new Map(learningData.patterns || []);
      this.learning.estimates = learningData.estimates || [];
      this.learning.actuals = learningData.actuals || [];
      this.learning.failures = learningData.failures || [];
      
      console.log('✅ Data restored from cloud');
      return learningData;
    } catch (error) {
      console.error('❌ Restore failed:', error.message);
      throw error;
    }
  }

  /**
   * Sync with cloud (bidirectional)
   */
  async syncWithCloud() {
    if (!this.cloudConfig.enabled) {
      console.log('ℹ️  Cloud storage not enabled');
      return null;
    }

    console.log('🔄 Syncing with cloud...');
    
    try {
      const results = await this.cloudStorage.sync();
      console.log('✅ Sync completed');
      return results;
    } catch (error) {
      console.error('❌ Sync failed:', error.message);
      throw error;
    }
  }

  /**
   * Get cloud storage stats
   */
  async getCloudStats() {
    if (!this.cloudConfig.enabled) {
      return { enabled: false };
    }

    return await this.cloudStorage.getStats();
  }

  /**
   * Generate report with cloud backup
   */
  generateReport(analysis) {
    const report = super.generateReport(analysis);

    // Add cloud storage info
    report.cloudStorage = {
      enabled: this.cloudConfig.enabled,
      autoBackup: this.cloudConfig.autoBackup,
      backupInterval: this.cloudConfig.backupInterval
    };

    return report;
  }

  /**
   * Cleanup
   */
  async cleanup() {
    if (this.cloudStorage) {
      await this.cloudStorage.cleanup();
    }
    console.log('🧹 Magnus 13 Extended cleaned up');
  }
}

export default Magnus13Extended;
