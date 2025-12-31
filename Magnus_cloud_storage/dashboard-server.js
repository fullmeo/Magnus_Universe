/**
 * Magnus Dashboard Server
 * 
 * Express server for Magnus Dashboard 15.3
 * Provides API endpoints and serves static dashboard
 * 
 * Features:
 * - RESTful API endpoints
 * - WebSocket for real-time updates
 * - Pattern data serving
 * - Scan results API
 * - Statistics endpoints
 * - Health monitoring
 */

import express from 'express';
import { createServer } from 'http';
import { Server as WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DashboardServer {
  constructor(config = {}) {
    this.config = {
      port: config.port || 3000,
      host: config.host || 'localhost',
      enableWebSocket: config.enableWebSocket !== false,
      corsEnabled: config.corsEnabled !== false,
      staticDir: config.staticDir || path.join(__dirname, '../dashboard/public')
    };

    this.app = express();
    this.server = createServer(this.app);
    this.wss = null;
    this.clients = new Set();
    
    // Data stores (would be provided by Magnus components)
    this.magnus14 = config.magnus14 || null;
    this.cloudSync = config.cloudSync || null;
    this.watcher = config.watcher || null;

    this.statistics = {
      requests: 0,
      wsConnections: 0,
      activeClients: 0
    };

    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }

  /**
   * Setup Express middleware
   */
  setupMiddleware() {
    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // CORS
    if (this.config.corsEnabled) {
      this.app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        if (req.method === 'OPTIONS') {
          return res.sendStatus(200);
        }
        
        next();
      });
    }

    // Request logging
    this.app.use((req, res, next) => {
      this.statistics.requests++;
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });

    // Static files
    this.app.use(express.static(this.config.staticDir));
  }

  /**
   * Setup API routes
   */
  setupRoutes() {
    // Health check
    this.app.get('/api/health', (req, res) => {
      res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: Date.now(),
        statistics: this.statistics
      });
    });

    // Get all patterns
    this.app.get('/api/patterns', async (req, res) => {
      try {
        const filters = {
          type: req.query.type,
          minConfidence: parseFloat(req.query.minConfidence) || 0,
          project: req.query.project
        };

        let patterns = [];

        if (this.cloudSync) {
          patterns = await this.cloudSync.getPatterns(filters);
        }

        res.json({
          success: true,
          patterns,
          count: patterns.length
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get pattern by ID
    this.app.get('/api/patterns/:id', async (req, res) => {
      try {
        const { id } = req.params;

        if (this.cloudSync) {
          const patterns = await this.cloudSync.getPatterns();
          const pattern = patterns.find(p => p.id === id);

          if (pattern) {
            return res.json({
              success: true,
              pattern
            });
          }
        }

        res.status(404).json({
          success: false,
          error: 'Pattern not found'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get scan results
    this.app.get('/api/scans', async (req, res) => {
      try {
        let results = [];

        if (this.cloudSync) {
          const scanResults = await this.cloudSync.cache.getAllPatterns();
          results = scanResults;
        }

        res.json({
          success: true,
          results,
          count: results.length
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get statistics
    this.app.get('/api/statistics', async (req, res) => {
      try {
        const stats = {
          server: this.statistics,
          magnus14: this.magnus14?.getStatistics?.() || null,
          cloudSync: this.cloudSync?.getStatistics?.() || null,
          watcher: this.watcher?.getStatistics?.() || null
        };

        res.json({
          success: true,
          statistics: stats
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get sync status
    this.app.get('/api/sync/status', async (req, res) => {
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
          status
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Force sync
    this.app.post('/api/sync/force', async (req, res) => {
      try {
        if (!this.cloudSync) {
          return res.status(503).json({
            success: false,
            error: 'Cloud sync not available'
          });
        }

        const result = await this.cloudSync.forceSync();

        // Broadcast to WebSocket clients
        this.broadcast({
          type: 'sync-completed',
          data: result
        });

        res.json({
          success: true,
          result
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get watcher status
    this.app.get('/api/watcher/status', (req, res) => {
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
          status
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Dashboard home (serves React app)
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(this.config.staticDir, 'index.html'));
    });

    // Catch-all for React Router
    this.app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(this.config.staticDir, 'index.html'));
      }
    });
  }

  /**
   * Setup WebSocket server
   */
  setupWebSocket() {
    if (!this.config.enableWebSocket) {
      return;
    }

    this.wss = new WebSocketServer({ server: this.server });

    this.wss.on('connection', (ws, req) => {
      console.log(`WebSocket client connected from ${req.socket.remoteAddress}`);
      
      this.clients.add(ws);
      this.statistics.wsConnections++;
      this.statistics.activeClients = this.clients.size;

      // Send initial connection message
      ws.send(JSON.stringify({
        type: 'connected',
        timestamp: Date.now(),
        message: 'Connected to Magnus Dashboard'
      }));

      // Handle messages from client
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleWebSocketMessage(ws, data);
        } catch (error) {
          console.error('Invalid WebSocket message:', error);
        }
      });

      // Handle disconnection
      ws.on('close', () => {
        console.log('WebSocket client disconnected');
        this.clients.delete(ws);
        this.statistics.activeClients = this.clients.size;
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
        this.statistics.activeClients = this.clients.size;
      });
    });

    // Setup event listeners for Magnus components
    this.setupMagnusEventListeners();
  }

  /**
   * Handle WebSocket messages from clients
   */
  handleWebSocketMessage(ws, data) {
    switch (data.type) {
      case 'ping':
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: Date.now()
        }));
        break;

      case 'subscribe':
        // Client subscribes to specific events
        ws.subscriptions = data.events || [];
        ws.send(JSON.stringify({
          type: 'subscribed',
          events: ws.subscriptions
        }));
        break;

      default:
        console.warn('Unknown WebSocket message type:', data.type);
    }
  }

  /**
   * Setup event listeners for Magnus components
   */
  setupMagnusEventListeners() {
    // Cloud Sync events
    if (this.cloudSync) {
      this.cloudSync.on('sync-started', () => {
        this.broadcast({
          type: 'sync-started',
          timestamp: Date.now()
        });
      });

      this.cloudSync.on('sync-completed', (summary) => {
        this.broadcast({
          type: 'sync-completed',
          data: summary,
          timestamp: Date.now()
        });
      });

      this.cloudSync.on('pattern-synced', (pattern) => {
        this.broadcast({
          type: 'pattern-synced',
          data: pattern,
          timestamp: Date.now()
        });
      });

      this.cloudSync.on('conflict-resolved', ({ conflict, resolution }) => {
        this.broadcast({
          type: 'conflict-resolved',
          data: { conflict, resolution },
          timestamp: Date.now()
        });
      });
    }

    // Watcher events
    if (this.watcher) {
      this.watcher.on?.('pattern-detected', (pattern) => {
        this.broadcast({
          type: 'pattern-detected',
          data: pattern,
          timestamp: Date.now()
        });
      });

      this.watcher.on?.('alert-raised', (alert) => {
        this.broadcast({
          type: 'alert-raised',
          data: alert,
          timestamp: Date.now()
        });
      });

      this.watcher.on?.('suggestion-generated', (suggestion) => {
        this.broadcast({
          type: 'suggestion-generated',
          data: suggestion,
          timestamp: Date.now()
        });
      });
    }
  }

  /**
   * Broadcast message to all connected WebSocket clients
   */
  broadcast(message) {
    const data = JSON.stringify(message);

    for (const client of this.clients) {
      if (client.readyState === 1) { // WebSocket.OPEN
        // Check if client is subscribed to this event type
        if (!client.subscriptions || client.subscriptions.includes(message.type)) {
          client.send(data);
        }
      }
    }
  }

  /**
   * Start the server
   */
  async start() {
    return new Promise((resolve, reject) => {
      try {
        this.server.listen(this.config.port, this.config.host, () => {
          console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║         MAGNUS DASHBOARD 15.3 - RUNNING               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

🌐 Dashboard URL: http://${this.config.host}:${this.config.port}
📡 API Endpoint: http://${this.config.host}:${this.config.port}/api
${this.config.enableWebSocket ? '🔌 WebSocket: ws://' + this.config.host + ':' + this.config.port : ''}

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
   * Stop the server
   */
  async stop() {
    return new Promise((resolve) => {
      console.log('🛑 Stopping Magnus Dashboard...');

      // Close WebSocket connections
      for (const client of this.clients) {
        client.close();
      }
      this.clients.clear();

      // Close WebSocket server
      if (this.wss) {
        this.wss.close();
      }

      // Close HTTP server
      this.server.close(() => {
        console.log('✅ Magnus Dashboard stopped');
        resolve();
      });
    });
  }

  /**
   * Get server statistics
   */
  getStatistics() {
    return {
      ...this.statistics,
      uptime: process.uptime(),
      clients: this.clients.size
    };
  }
}

export default DashboardServer;
