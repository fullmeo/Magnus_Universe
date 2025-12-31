/**
 * Mock Storage Service - Local file system storage
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export class MockStorageService {
  constructor(verbose = true) {
    this.verbose = verbose;
    this.storageDir = './dev-data/storage';
    this.ensureStorageDir();
  }

  async ensureStorageDir() {
    try { await fs.mkdir(this.storageDir, { recursive: true }); } catch (e) {}
  }

  async simulateDelay() {
    await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 80));
  }

  log(operation, data) {
    if (!this.verbose) return;
    console.log(`\x1b[34m💾 [MOCK STORAGE]\x1b[0m \x1b[32m${operation}\x1b[0m`);
    console.log(`\x1b[33m   →\x1b[0m`, JSON.stringify(data, null, 2));
  }

  async upload(file, filePath, options = {}) {
    await this.simulateDelay();

    const fullPath = path.join(this.storageDir, filePath);
    const dir = path.dirname(fullPath);
    
    await fs.mkdir(dir, { recursive: true });
    
    // If file is Buffer or string, write directly
    if (Buffer.isBuffer(file) || typeof file === 'string') {
      await fs.writeFile(fullPath, file);
    } else {
      // Assume file object with path or data
      await fs.writeFile(fullPath, file.data || file);
    }

    const url = `http://localhost:3000/storage/${filePath}`;
    
    this.log('FILE UPLOADED', { path: filePath, url });

    return {
      key: filePath,
      url,
      etag: crypto.randomBytes(16).toString('hex'),
      size: (await fs.stat(fullPath)).size
    };
  }

  async download(filePath) {
    await this.simulateDelay();

    const fullPath = path.join(this.storageDir, filePath);
    
    try {
      const data = await fs.readFile(fullPath);
      this.log('FILE DOWNLOADED', { path: filePath, size: data.length });
      return data;
    } catch (error) {
      throw new Error(`File not found: ${filePath}`);
    }
  }

  async delete(filePath) {
    await this.simulateDelay();

    const fullPath = path.join(this.storageDir, filePath);
    
    try {
      await fs.unlink(fullPath);
      this.log('FILE DELETED', { path: filePath });
      return { deleted: true, key: filePath };
    } catch (error) {
      throw new Error(`File not found: ${filePath}`);
    }
  }

  async getUrl(filePath, expiresIn = 3600) {
    await this.simulateDelay();

    const url = `http://localhost:3000/storage/${filePath}?expires=${Date.now() + expiresIn * 1000}`;
    
    this.log('URL GENERATED', { path: filePath, url, expiresIn });

    return url;
  }

  async list(prefix = '') {
    await this.simulateDelay();

    const searchPath = path.join(this.storageDir, prefix);
    const files = [];

    try {
      const entries = await fs.readdir(searchPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile()) {
          const fullPath = path.join(searchPath, entry.name);
          const stats = await fs.stat(fullPath);
          files.push({
            key: path.join(prefix, entry.name),
            size: stats.size,
            lastModified: stats.mtime
          });
        }
      }
    } catch (error) {
      // Directory doesn't exist or other error
    }

    this.log('FILES LISTED', { prefix, count: files.length });

    return files;
  }
}
