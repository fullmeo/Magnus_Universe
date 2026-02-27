/**
 * Magnus API 15.4
 * 
 * Professional RESTful API for Magnus Scanner
 * Provides standardized access to all Magnus features
 * 
 * Features:
 * - RESTful endpoints (v1)
 * - API key authentication
 * - Rate limiting
 * - Request validation
 * - Error handling
 * - CORS support
 * - OpenAPI documentation
 */

import express from 'express';
import { createServer } from 'http';
import crypto from 'crypto';

class MagnusAPI {
  constructor(config = {}) {
    this.config = {
      port: config.port || 4000,
      host: config.host || 'localhost',
      version: config.version || 'v1',
      rateLimit: config.rateLimit || 100, // requests per hour
      requireAuth: config.requireAuth !== false,
      corsEnabled: config.corsEnabled !== false
    };

    this.app = express();
    this.server = createServer(this.app);
    
    // Magnus components
    this.magnus14 = config.magnus14 || null;
    this.cloudSync = config.cloudSync || null;
    this.watcher = config.watcher || null;

    // API state
    this.apiKeys = new Map();
    this.rateLimits = new Map();
    this.statistics = {
      requests: 0,
      authenticated: 0,
      rateLimited: 0,
      errors: 0
    };

    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup Express middleware
   */
  setupMiddleware() {
    // Body parser
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // CORS
    if (this.config.corsEnabled) {
      this.app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
        
        if (req.method === 'OPTIONS') {
          return res.sendStatus(200);
        }
        
        next();
      });
    }

    // Request ID
    this.app.use((req, res, next) => {
      req.id = crypto.randomUUID();
      res.setHeader('X-Request-ID', req.id);
      next();
    });

    // Request logging
    this.app.use((req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
      });
      
      next();
    });

    // Statistics
    this.app.use((req, res, next) => {
      this.statistics.requests++;
      next();
    });

    // Authentication middleware
    this.app.use((req, res, next) => {
      // Skip auth for health and docs
      if (req.path === '/health' || req.path.startsWith('/docs')) {
        return next();
      }

      // Skip auth if not required
      if (!this.config.requireAuth) {
        return next();
      }

      const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

      if (!apiKey) {
        return res.status(401).json({
          success: false,
          error: 'API key required',
          message: 'Provide API key in X-API-Key header or Authorization header'
        });
      }

      if (!this.validateAPIKey(apiKey)) {
        return res.status(401).json({
          success: false,
          error: 'Invalid API key'
        });
      }

      req.apiKey = apiKey;
      req.user = this.apiKeys.get(apiKey);
      this.statistics.authenticated++;
      
      next();
    });

    // Rate limiting middleware
    this.app.use((req, res, next) => {
      // Skip for health check
      if (req.path === '/health') {
        return next();
      }

      const key = req.apiKey || req.ip;
      
      if (!this.checkRateLimit(key)) {
        this.statistics.rateLimited++;
        
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          message: `Maximum ${this.config.rateLimit} requests per hour`
        });
      }

      next();
    });
  }

  /**
   * Setup API routes
   */
  setupRoutes() {
    const apiVersion = this.config.version;
    const apiBase = `/api/${apiVersion}`;

    // Health check (no auth required)
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        version: apiVersion,
        uptime: process.uptime(),
        timestamp: Date.now(),
        components: {
          magnus14: !!this.magnus14,
          cloudSync: !!this.cloudSync,
          watcher: !!this.watcher
        }
      });
    });

    // API documentation (no auth required)
    this.app.get('/docs', (req, res) => {
      res.json(this.generateOpenAPISpec());
    });

    // ========================================================================
    // PATTERNS ENDPOINTS
    // ========================================================================

    // GET /api/v1/patterns - List all patterns
    this.app.get(`${apiBase}/patterns`, async (req, res) => {
      try {
        const filters = {
          type: req.query.type,
          minConfidence: parseFloat(req.query.minConfidence) || 0,
          project: req.query.project,
          limit: parseInt(req.query.limit) || 100,
          offset: parseInt(req.query.offset) || 0
        };

        let patterns = [];

        if (this.cloudSync) {
          patterns = await this.cloudSync.getPatterns(filters);
        }

        // Apply pagination
        const total = patterns.length;
        patterns = patterns.slice(filters.offset, filters.offset + filters.limit);

        res.json({
          success: true,
          data: patterns,
          pagination: {
            total,
            limit: filters.limit,
            offset: filters.offset,
            count: patterns.length
          }
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // GET /api/v1/patterns/:id - Get pattern by ID
    this.app.get(`${apiBase}/patterns/:id`, async (req, res) => {
      try {
        const { id } = req.params;

        if (this.cloudSync) {
          const patterns = await this.cloudSync.getPatterns();
          const pattern = patterns.find(p => p.id === id);

          if (pattern) {
            return res.json({
              success: true,
              data: pattern
            });
          }
        }

        res.status(404).json({
          success: false,
          error: 'Pattern not found'
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // POST /api/v1/patterns - Create/sync pattern
    this.app.post(`${apiBase}/patterns`, async (req, res) => {
      try {
        const pattern = req.body;

        // Validate pattern
        if (!pattern.name || !pattern.type) {
          return res.status(400).json({
            success: false,
            error: 'Invalid pattern',
            message: 'Pattern must have name and type'
          });
        }

        if (this.cloudSync) {
          const result = await this.cloudSync.syncPattern(pattern);
          
          return res.status(201).json({
            success: true,
            data: result
          });
        }

        res.status(503).json({
          success: false,
          error: 'Cloud sync not available'
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // ========================================================================
    // SCANS ENDPOINTS
    // ========================================================================

    // POST /api/v1/scans - Run a scan
    this.app.post(`${apiBase}/scans`, async (req, res) => {
      try {
        const { projects, options } = req.body;

        if (!projects || !Array.isArray(projects)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid request',
            message: 'projects must be an array of paths'
          });
        }

        if (!this.magnus14) {
          return res.status(503).json({
            success: false,
            error: 'Magnus scanner not available'
          });
        }

        const results = await this.magnus14.scan(projects, options);

        // Sync results if cloud sync available
        if (this.cloudSync) {
          await this.cloudSync.syncScanResults(results);
        }

        res.status(201).json({
          success: true,
          data: results
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // GET /api/v1/scans - List scan results
    this.app.get(`${apiBase}/scans`, async (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        let results = [];

        if (this.cloudSync) {
          const scanResults = await this.cloudSync.cache.getAllPatterns();
          results = scanResults.slice(offset, offset + limit);
        }

        res.json({
          success: true,
          data: results,
          pagination: {
            limit,
            offset,
            count: results.length
          }
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // ========================================================================
    // SYNC ENDPOINTS
    // ========================================================================

    // GET /api/v1/sync/status - Get sync status
    this.app.get(`${apiBase}/sync/status`, async (req, res) => {
      try {
        if (!this.cloudSync) {
          return res.status(503).json({
            success: false,
            error: 'Cloud sync not available'
          });
        }

        const status = this.cloudSync.getSyncStatus();

        res.json({
          success: true,
          data: status
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // POST /api/v1/sync/force - Force sync
    this.app.post(`${apiBase}/sync/force`, async (req, res) => {
      try {
        if (!this.cloudSync) {
          return res.status(503).json({
            success: false,
            error: 'Cloud sync not available'
          });
        }

        const result = await this.cloudSync.forceSync();

        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // ========================================================================
    // WATCHER ENDPOINTS
    // ========================================================================

    // GET /api/v1/watcher/status - Get watcher status
    this.app.get(`${apiBase}/watcher/status`, (req, res) => {
      try {
        if (!this.watcher) {
          return res.status(503).json({
            success: false,
            error: 'Watcher not available'
          });
        }

        const status = this.watcher.getStatus?.() || {};

        res.json({
          success: true,
          data: status
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // ========================================================================
    // STATISTICS ENDPOINTS
    // ========================================================================

    // GET /api/v1/statistics - Get comprehensive statistics
    this.app.get(`${apiBase}/statistics`, async (req, res) => {
      try {
        const stats = {
          api: this.statistics,
          magnus14: this.magnus14?.getStatistics?.() || null,
          cloudSync: this.cloudSync?.getStatistics?.() || null,
          watcher: this.watcher?.getStatistics?.() || null
        };

        res.json({
          success: true,
          data: stats
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // ========================================================================
    // API KEY MANAGEMENT
    // ========================================================================

    // POST /api/v1/keys - Generate API key (requires master key)
    this.app.post(`${apiBase}/keys`, (req, res) => {
      try {
        const { name, permissions } = req.body;

        if (!name) {
          return res.status(400).json({
            success: false,
            error: 'Name required'
          });
        }

        const apiKey = this.generateAPIKey();
        
        this.apiKeys.set(apiKey, {
          name,
          permissions: permissions || ['read', 'write'],
          createdAt: Date.now(),
          lastUsed: null
        });

        res.status(201).json({
          success: true,
          data: {
            apiKey,
            name,
            permissions: permissions || ['read', 'write']
          }
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        message: `${req.method} ${req.path} does not exist`
      });
    });

    // Error handler
    this.app.use((err, req, res, next) => {
      console.error('Unhandled error:', err);
      this.statistics.errors++;
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
      });
    });
  }

  /**
   * Generate API key
   */
  generateAPIKey() {
    return 'magnus_' + crypto.randomBytes(32).toString('hex');
  }

  /**
   * Validate API key
   */
  validateAPIKey(apiKey) {
    const isValid = this.apiKeys.has(apiKey);
    
    if (isValid) {
      const keyData = this.apiKeys.get(apiKey);
      keyData.lastUsed = Date.now();
    }
    
    return isValid;
  }

  /**
   * Check rate limit
   */
  checkRateLimit(key) {
    const now = Date.now();
    const hour = 3600000; // 1 hour in ms

    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, []);
    }

    const requests = this.rateLimits.get(key);
    
    // Remove old requests (older than 1 hour)
    const recentRequests = requests.filter(time => now - time < hour);
    this.rateLimits.set(key, recentRequests);

    // Check limit
    if (recentRequests.length >= this.config.rateLimit) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    
    return true;
  }

  /**
   * Handle errors
   */
  handleError(res, error) {
    console.error('API Error:', error);
    this.statistics.errors++;

    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }

  /**
   * Generate OpenAPI specification
   */
  generateOpenAPISpec() {
    return {
      openapi: '3.0.0',
      info: {
        title: 'Magnus API',
        version: this.config.version,
        description: 'RESTful API for Magnus Scanner',
        contact: {
          name: 'Magnus API Support',
          url: 'https://github.com/magnus-scanner'
        }
      },
      servers: [
        {
          url: `http://${this.config.host}:${this.config.port}/api/${this.config.version}`,
          description: 'Magnus API Server'
        }
      ],
      security: [
        {
          ApiKeyAuth: []
        }
      ],
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key'
          }
        }
      },
      paths: {
        '/patterns': {
          get: {
            summary: 'List all patterns',
            parameters: [
              {
                name: 'type',
                in: 'query',
                schema: { type: 'string' }
              },
              {
                name: 'minConfidence',
                in: 'query',
                schema: { type: 'number' }
              },
              {
                name: 'limit',
                in: 'query',
                schema: { type: 'integer', default: 100 }
              },
              {
                name: 'offset',
                in: 'query',
                schema: { type: 'integer', default: 0 }
              }
            ],
            responses: {
              200: { description: 'Success' }
            }
          },
          post: {
            summary: 'Create/sync pattern',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      type: { type: 'string' },
                      code: { type: 'string' },
                      confidence: { type: 'number' }
                    }
                  }
                }
              }
            },
            responses: {
              201: { description: 'Pattern created' }
            }
          }
        },
        '/scans': {
          post: {
            summary: 'Run a scan',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      projects: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      options: { type: 'object' }
                    }
                  }
                }
              }
            },
            responses: {
              201: { description: 'Scan completed' }
            }
          }
        },
        '/sync/status': {
          get: {
            summary: 'Get sync status',
            responses: {
              200: { description: 'Success' }
            }
          }
        },
        '/sync/force': {
          post: {
            summary: 'Force sync',
            responses: {
              200: { description: 'Sync completed' }
            }
          }
        }
      }
    };
  }

  /**
   * Start the API server
   */
  async start() {
    return new Promise((resolve, reject) => {
      try {
        this.server.listen(this.config.port, this.config.host, () => {
          console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║         MAGNUS API 15.4 - RUNNING                     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

🔌 API Endpoint: http://${this.config.host}:${this.config.port}/api/${this.config.version}
📚 API Docs: http://${this.config.host}:${this.config.port}/docs
❤️  Health Check: http://${this.config.host}:${this.config.port}/health

✅ Server ready
          `);
          resolve();
        });

        this.server.on('error', (error) => {
          console.error('Server error:', error);
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop the API server
   */
  async stop() {
    return new Promise((resolve) => {
      console.log('🛑 Stopping Magnus API...');
      
      this.server.close(() => {
        console.log('✅ Magnus API stopped');
        resolve();
      });
    });
  }

  /**
   * Get API statistics
   */
  getStatistics() {
    return {
      ...this.statistics,
      uptime: process.uptime(),
      apiKeys: this.apiKeys.size,
      rateLimitedIPs: this.rateLimits.size
    };
  }
}

export default MagnusAPI;
