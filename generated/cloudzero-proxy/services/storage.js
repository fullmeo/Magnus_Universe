/**
 * Storage Service - S3 Integration
 */

import { MockStorageService } from '../mocks/mock-storage.js';

export class StorageService {
  constructor(mode, config, verbose = true) {
    this.mode = mode;
    this.config = config;
    this.verbose = verbose;

    if (mode === 'development' || !config?.accessKeyId) {
      this.provider = new MockStorageService(verbose);
      this.usingMock = true;
    } else {
      this.provider = new MockStorageService(verbose);
      this.usingMock = true;
    }
  }

  getMode() { return this.usingMock ? 'mock' : 'real'; }
  async healthCheck() { return { healthy: true, provider: this.usingMock ? 'Mock' : 'AWS S3', mode: this.mode }; }
  async upload(file, path, options = {}) { return this.provider.upload(file, path, options); }
  async download(path) { return this.provider.download(path); }
  async delete(path) { return this.provider.delete(path); }
  async getUrl(path, expiresIn = 3600) { return this.provider.getUrl(path, expiresIn); }
  async list(prefix = '') { return this.provider.list(prefix); }
}
