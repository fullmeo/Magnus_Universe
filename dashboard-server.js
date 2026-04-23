/**
 * Magnus Universe - Dashboard Server
 * Secure Express server for the Magnus Universe dashboard
 */

import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = 'localhost';

class DashboardServer {
  constructor(options = {}) {
    this.port   = options.port || DEFAULT_PORT;
    this.host   = options.host || DEFAULT_HOST;
    this.core   = options.core || null;   // optional MagnusCore instance
    this.app    = express();
    this.server = null;
    this._startedAt = new Date().toISOString();

    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // Body parsing
    this.app.use(express.json({ limit: '1mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '1mb' }));

    // Static files
    const publicPath = join(__dirname, 'public');
    this.app.use(express.static(publicPath));

    // CORS headers for local dashboard use
    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', `http://${this.host}:${this.port}`);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      }
      next();
    });

    // Request logging
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
      });
      next();
    });

    // Remove server fingerprinting
    this.app.disable('x-powered-by');

    // -------------------------------------------------------------------------
    // Content Security Policy — nonce-based approach prevents XSS and injection
    // -------------------------------------------------------------------------
    this.app.use((req, res, next) => {
      const nonce = randomUUID();
      res.setHeader(
        'Content-Security-Policy',
        `default-src 'self'; ` +
        `script-src 'self' 'nonce-${nonce}' https://unpkg.com https://cdn.jsdelivr.net; ` +
        `style-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net; ` +
        `img-src 'self' data: https:; ` +
        `font-src 'self' data: https:; ` +
        `connect-src 'self' ws: wss: https://unpkg.com https://cdn.jsdelivr.net; ` +
        `base-uri 'self'; ` +
        `form-action 'self'; ` +
        `frame-ancestors 'none'`
      );
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.locals.nonce = nonce;
      next();
    });
  }

  setupRoutes() {
    // Basic liveness probe — always fast, no I/O
    this.app.get('/health', (req, res) => {
      const body = {
        status:    'ok',
        uptime:    process.uptime(),
        startedAt: this._startedAt,
        timestamp: new Date().toISOString()
      };
      if (this.core) {
        const storageStatus = this.core.hasStorageErrors() ? 'degraded' : 'ok';
        body.storage = storageStatus;
        body.storageErrors = this.core.getStorageErrors().length;
      }
      res.json(body);
    });

    // Detailed storage health — reads file stats from disk
    this.app.get('/health/storage', (req, res) => {
      if (!this.core) {
        return res.status(503).json({
          error: 'MagnusCore not attached — pass { core } to DashboardServer constructor'
        });
      }
      const report = this.core.healthReport();
      const httpStatus = report.status === 'ok' ? 200 : 207;
      res.status(httpStatus).json(report);
    });

    // Dashboard index — exposes nonce to templates
    this.app.get('/', (req, res) => {
      res.json({
        name:    'Magnus Universe Dashboard',
        version: '1.0.0',
        nonce:   res.locals.nonce
      });
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Not Found' });
    });

    // Error handler
    this.app.use((err, req, res, _next) => {
      console.error('[DashboardServer] Error:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = createServer(this.app);
      this.server.listen(this.port, this.host, () => {
        console.log(`[DashboardServer] Running at http://${this.host}:${this.port}`);
        resolve(this.server);
      });
      this.server.on('error', reject);
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      if (!this.server) return resolve();
      this.server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

export default DashboardServer;
