/**
 * API Routes for Magnus Dashboard
 * Provides REST endpoints for dashboard functionality
 */

import { getMagnus, getMagnusStatus, processThroughMagnus } from './magnus-integration.js';

export function setupApiRoutes(app, server, wss) {
  /**
   * GET /api/health - Server health check
   */
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: Date.now(),
      server: 'running'
    });
  });

  /**
   * GET /api/magnus - Magnus status and information
   */
  app.get('/api/magnus', (req, res) => {
    const magnus = getMagnus();
    const status = getMagnusStatus();
    
    res.json({
      initialized: !!magnus,
      status: status,
      message: magnus ? 'Magnus13 connected' : 'Magnus13 not initialized'
    });
  });

  /**
   * POST /api/process - Process request through Magnus
   */
  app.post('/api/process', async (req, res) => {
    try {
      const { request, context } = req.body;
      
      if (!request) {
        return res.status(400).json({
          error: 'Missing request field'
        });
      }

      const result = await processThroughMagnus(request);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  });

  /**
   * GET /api/patterns - Get detected patterns
   */
  app.get('/api/patterns', (req, res) => {
    const magnus = getMagnus();
    
    if (!magnus) {
      return res.json({
        patterns: [],
        message: 'No patterns available - Magnus not initialized'
      });
    }

    // Return mock patterns or real ones from Magnus
    res.json({
      patterns: [
        {
          id: 'pattern-1',
          name: 'Code Understanding Pattern',
          detected: true,
          strength: 0.95,
          lastUpdated: Date.now()
        },
        {
          id: 'pattern-2',
          name: 'Complexity Analysis Pattern',
          detected: true,
          strength: 0.87,
          lastUpdated: Date.now()
        }
      ],
      count: 2
    });
  });

  /**
   * GET /api/sync-status - Get cloud sync status
   */
  app.get('/api/sync-status', (req, res) => {
    res.json({
      status: 'idle',
      lastSync: Date.now(),
      syncedItems: 0,
      pendingItems: 0,
      connected: true
    });
  });

  /**
   * GET /api/statistics - Get dashboard statistics
   */
  app.get('/api/statistics', (req, res) => {
    const magnus = getMagnus();
    
    res.json({
      uptime: process.uptime(),
      requests: 0,
      connections: wss.clients.size,
      magnus: !!magnus,
      timestamp: Date.now()
    });
  });

  /**
   * GET /api/events - Get recent events
   */
  app.get('/api/events', (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    
    res.json({
      events: [],
      count: 0,
      limit: limit
    });
  });

  /**
   * POST /api/magnus/analyze - Analyze text with Magnus
   */
  app.post('/api/magnus/analyze', async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Missing text field' });
      }

      const result = await processThroughMagnus(text);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/stats/performance - Performance metrics
   */
  app.get('/api/stats/performance', (req, res) => {
    const memoryUsage = process.memoryUsage();
    
    res.json({
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024)
      },
      uptime: process.uptime(),
      timestamp: Date.now()
    });
  });

  /**
   * WebSocket: Broadcast pattern updates
   */
  function broadcastPatternUpdate(pattern) {
    const message = JSON.stringify({
      type: 'pattern-detected',
      pattern: pattern,
      timestamp: Date.now()
    });

    wss.clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(message);
      }
    });
  }

  /**
   * WebSocket: Broadcast sync updates
   */
  function broadcastSyncUpdate(syncData) {
    const message = JSON.stringify({
      type: 'sync-completed',
      data: syncData,
      timestamp: Date.now()
    });

    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  }

  return {
    broadcastPatternUpdate,
    broadcastSyncUpdate
  };
}
