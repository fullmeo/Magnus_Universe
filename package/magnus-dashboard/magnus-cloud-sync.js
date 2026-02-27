/**
 * Magnus Cloud Sync 15.2
 *
 * Handles cloud synchronization for the Magnus ecosystem
 * Optional component that enables:
 * - Remote session storage
 * - Cross-device synchronization
 * - Cloud backup of analysis results
 */

import EventEmitter from 'events';

class MagnusCloudSync extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      cloudZeroEndpoint: config.cloudZeroEndpoint || process.env.CLOUDZERO_ENDPOINT,
      apiKey: config.apiKey || process.env.CLOUDZERO_API_KEY,
      userId: config.userId || 'default-user',
      autoSync: config.autoSync !== false,
      syncInterval: config.syncInterval || 30000, // 30 seconds
      enableLocalCache: config.enableLocalCache !== false,
      ...config
    };

    this.initialized = false;
    this.syncing = false;
    this.cache = new Map();
    this.syncQueue = [];
    this.lastSyncTime = null;
  }

  /**
   * Initialize cloud sync
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Verify cloud endpoint is configured
      if (!this.config.cloudZeroEndpoint) {
        console.log('⏸️  Cloud Sync disabled (no CloudZero endpoint configured)');
        this.initialized = false;
        return;
      }

      // Test connection to cloud endpoint
      await this.testConnection();
      this.initialized = true;

      // Start auto-sync if enabled
      if (this.config.autoSync) {
        this.startAutoSync();
      }

      console.log('✅ Cloud Sync initialized');
    } catch (error) {
      console.warn('⚠️  Cloud Sync unavailable:', error.message);
      this.initialized = false;
    }
  }

  /**
   * Test connection to cloud
   */
  async testConnection() {
    if (!this.config.cloudZeroEndpoint) {
      throw new Error('CloudZero endpoint not configured');
    }

    try {
      const response = await fetch(
        `${this.config.cloudZeroEndpoint}/health`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      if (!response.ok) {
        throw new Error(`Connection test failed: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to connect to CloudZero: ${error.message}`);
    }
  }

  /**
   * Sync data to cloud
   */
  async syncToCloud(data, options = {}) {
    if (!this.initialized) {
      return { success: false, cached: true, message: 'Cloud sync not initialized' };
    }

    try {
      this.syncing = true;
      this.emit('sync-start', { data });

      const response = await fetch(
        `${this.config.cloudZeroEndpoint}/api/v1/sync`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'X-User-Id': this.config.userId
          },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            data,
            metadata: options
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }

      this.lastSyncTime = Date.now();
      this.emit('sync-complete', { success: true });
      return { success: true, timestamp: this.lastSyncTime };
    } catch (error) {
      // Store in queue for later sync
      this.syncQueue.push({ data, options, timestamp: Date.now() });
      this.emit('sync-failed', { error: error.message, queued: true });
      return { success: false, cached: true, error: error.message };
    } finally {
      this.syncing = false;
    }
  }

  /**
   * Fetch data from cloud
   */
  async fetchFromCloud(userId = null) {
    if (!this.initialized) {
      return null;
    }

    try {
      const targetUserId = userId || this.config.userId;
      const response = await fetch(
        `${this.config.cloudZeroEndpoint}/api/v1/data/${targetUserId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch from cloud:', error.message);
      return null;
    }
  }

  /**
   * Cache data locally
   */
  cacheData(key, value, ttl = 3600000) {
    if (!this.config.enableLocalCache) return;

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Get cached data
   */
  getCachedData(key) {
    const item = this.cache.get(key);

    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Start auto-sync loop
   */
  startAutoSync() {
    this.autoSyncInterval = setInterval(async () => {
      // Sync queued items
      if (this.syncQueue.length > 0 && !this.syncing) {
        const item = this.syncQueue.shift();
        await this.syncToCloud(item.data, item.options);
      }
    }, this.config.syncInterval);
  }

  /**
   * Stop auto-sync
   */
  stopAutoSync() {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = null;
    }
  }

  /**
   * Get sync status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      syncing: this.syncing,
      lastSyncTime: this.lastSyncTime,
      queueLength: this.syncQueue.length,
      cacheSize: this.cache.size,
      endpoint: this.config.cloudZeroEndpoint ? '✅' : '❌'
    };
  }

  /**
   * Shutdown cloud sync
   */
  async shutdown() {
    this.stopAutoSync();

    // Sync any remaining items in queue asynchronously (limit concurrent operations)
    const maxConcurrent = 3;
    const syncPromises = [];

    // Process queue in batches to avoid blocking
    while (this.syncQueue.length > 0) {
      // Take up to maxConcurrent items from queue
      const batch = [];
      while (batch.length < maxConcurrent && this.syncQueue.length > 0) {
        batch.push(this.syncQueue.shift());
      }

      // Process batch asynchronously
      const batchPromises = batch.map(item =>
        this.syncToCloud(item.data, item.options).catch(error => {
          console.error('Failed to sync queued item:', error.message);
        })
      );

      syncPromises.push(...batchPromises);

      // If we have too many concurrent promises, wait for some to complete
      if (syncPromises.length >= maxConcurrent * 2) {
        await Promise.allSettled(syncPromises.splice(0, maxConcurrent));
      }
    }

    // Wait for all remaining promises to complete
    if (syncPromises.length > 0) {
      await Promise.allSettled(syncPromises);
    }

    // If there are still items in queue, log warning but don't block shutdown
    if (this.syncQueue.length > 0) {
      console.warn(`⚠️  ${this.syncQueue.length} items remain in sync queue during shutdown`);
    }

    this.initialized = false;
    this.emit('shutdown');
  }
}

export default MagnusCloudSync;
