/**
 * Magnus Dashboard - React Application
 *
 * Main React component for Magnus Dashboard 15.3
 * Real-time pattern visualization and monitoring
 *
 * Features:
 * - Pattern network visualization
 * - Real-time sync status
 * - Statistics dashboard
 * - Watcher monitoring
 * - Interactive controls
 * - Magnus 14 project analysis integration
 */

import React, { useState, useEffect, useRef } from 'react';
import { Magnus14Dashboard } from './magnus-14-components.jsx';

// ============================================================================
// Main Dashboard Component
// ============================================================================

function MagnusDashboard() {
  const [patterns, setPatterns] = useState([]);
  const [syncStatus, setSyncStatus] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [connected, setConnected] = useState(false);
  const [realTimeEvents, setRealTimeEvents] = useState([]);
  const [view, setView] = useState('overview'); // overview, patterns, sync, watcher, magnus14

  const wsRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    connectWebSocket();
    fetchInitialData();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      
      // Subscribe to events
      ws.send(JSON.stringify({
        type: 'subscribe',
        events: ['sync-completed', 'pattern-synced', 'pattern-detected', 'alert-raised']
      }));
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      
      // Reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    wsRef.current = ws;
  };

  const handleWebSocketMessage = (message) => {
    console.log('WebSocket message:', message);
    
    // Add to real-time events
    setRealTimeEvents(prev => [message, ...prev].slice(0, 50));
    
    // Handle specific message types
    switch (message.type) {
      case 'sync-completed':
        fetchSyncStatus();
        fetchPatterns();
        break;
        
      case 'pattern-synced':
      case 'pattern-detected':
        fetchPatterns();
        break;
        
      default:
        // Handle other message types
        break;
    }
  };

  const fetchInitialData = async () => {
    await Promise.all([
      fetchPatterns(),
      fetchSyncStatus(),
      fetchStatistics()
    ]);
  };

  const fetchPatterns = async () => {
    try {
      const response = await fetch('/api/patterns');
      const data = await response.json();
      
      if (data.success) {
        setPatterns(data.patterns);
      }
    } catch (error) {
      console.error('Error fetching patterns:', error);
    }
  };

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/sync/status');
      const data = await response.json();
      
      if (data.success) {
        setSyncStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching sync status:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics');
      const data = await response.json();
      
      if (data.success) {
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const forceSync = async () => {
    try {
      const response = await fetch('/api/sync/force', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        alert('Sync completed successfully');
        fetchSyncStatus();
      }
    } catch (error) {
      console.error('Error forcing sync:', error);
      alert('Sync failed: ' + error.message);
    }
  };

  return (
    <div className="magnus-dashboard">
      {/* Header */}
      <Header 
        connected={connected}
        view={view}
        onViewChange={setView}
      />

      {/* Main Content */}
      <div className="dashboard-content">
        {view === 'overview' && (
          <OverviewView
            patterns={patterns}
            syncStatus={syncStatus}
            statistics={statistics}
            realTimeEvents={realTimeEvents}
            onForceSync={forceSync}
          />
        )}

        {view === 'patterns' && (
          <PatternsView
            patterns={patterns}
            onRefresh={fetchPatterns}
          />
        )}

        {view === 'sync' && (
          <SyncView
            syncStatus={syncStatus}
            onForceSync={forceSync}
            onRefresh={fetchSyncStatus}
          />
        )}

        {view === 'watcher' && (
          <WatcherView
            realTimeEvents={realTimeEvents}
          />
        )}

        {view === 'magnus14' && (
          <Magnus14Dashboard websocket={wsRef.current} />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Header Component
// ============================================================================

function Header({ connected, view, onViewChange }) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1>🧠 Magnus Dashboard</h1>
        <span className="version">v15.3</span>
      </div>

      <nav className="header-nav">
        <button
          className={view === 'overview' ? 'active' : ''}
          onClick={() => onViewChange('overview')}
        >
          📊 Overview
        </button>
        <button
          className={view === 'patterns' ? 'active' : ''}
          onClick={() => onViewChange('patterns')}
        >
          ⭐ Patterns
        </button>
        <button
          className={view === 'sync' ? 'active' : ''}
          onClick={() => onViewChange('sync')}
        >
          🌩️ Sync
        </button>
        <button
          className={view === 'watcher' ? 'active' : ''}
          onClick={() => onViewChange('watcher')}
        >
          👁️ Watcher
        </button>
        <button
          className={view === 'magnus14' ? 'active' : ''}
          onClick={() => onViewChange('magnus14')}
        >
          🧠 Magnus 14
        </button>
      </nav>

      <div className="header-right">
        <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// Overview View
// ============================================================================

function OverviewView({ patterns, syncStatus, statistics, realTimeEvents, onForceSync }) {
  const patternCount = patterns.length;
  const highConfidencePatterns = patterns.filter(p => p.confidence >= 0.8).length;
  const syncedPatterns = patterns.filter(p => p.synced).length;

  return (
    <div className="overview-view">
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Patterns"
          value={patternCount}
          icon="⭐"
          color="blue"
        />
        <StatsCard
          title="High Confidence"
          value={highConfidencePatterns}
          subtitle={`${patternCount > 0 ? ((highConfidencePatterns / patternCount) * 100).toFixed(0) : 0}%`}
          icon="✅"
          color="green"
        />
        <StatsCard
          title="Synced"
          value={syncedPatterns}
          subtitle={syncStatus?.isOnline ? 'Online' : 'Offline'}
          icon="🌩️"
          color="purple"
        />
        <StatsCard
          title="Cache Hit Rate"
          value={statistics?.cloudSync?.cache?.hitRate || '0%'}
          icon="⚡"
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Pattern Network Visualization */}
        <div className="card pattern-network">
          <h2>Pattern Network</h2>
          <PatternNetwork patterns={patterns.slice(0, 20)} />
        </div>

        {/* Sync Status */}
        <div className="card sync-status">
          <h2>Sync Status</h2>
          {syncStatus && (
            <div className="sync-info">
              <div className="sync-stat">
                <span className="label">Status:</span>
                <span className={`value ${syncStatus.isOnline ? 'online' : 'offline'}`}>
                  {syncStatus.isOnline ? '🟢 Online' : '🔴 Offline'}
                </span>
              </div>
              <div className="sync-stat">
                <span className="label">Last Sync:</span>
                <span className="value">
                  {syncStatus.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : 'Never'}
                </span>
              </div>
              <div className="sync-stat">
                <span className="label">Pending:</span>
                <span className="value">{syncStatus.pendingUploads || 0}</span>
              </div>
              <button className="sync-button" onClick={onForceSync}>
                🔄 Force Sync
              </button>
            </div>
          )}
        </div>

        {/* Real-Time Events */}
        <div className="card realtime-events">
          <h2>Real-Time Events</h2>
          <div className="events-list">
            {realTimeEvents.slice(0, 10).map((event, index) => (
              <div key={index} className="event-item">
                <span className="event-type">{event.type}</span>
                <span className="event-time">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Stats Card Component
// ============================================================================

function StatsCard({ title, value, subtitle, icon, color }) {
  return (
    <div className={`stats-card ${color}`}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3>{title}</h3>
        <div className="card-value">{value}</div>
        {subtitle && <div className="card-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}

// ============================================================================
// Pattern Network Visualization
// ============================================================================

function PatternNetwork({ patterns }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || patterns.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Simple network visualization
    patterns.forEach((pattern, index) => {
      const angle = (index / patterns.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.35;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;

      // Draw node
      ctx.beginPath();
      ctx.arc(x, y, 5 + (pattern.confidence * 10), 0, Math.PI * 2);
      ctx.fillStyle = pattern.confidence >= 0.8 ? '#4CAF50' : '#FFC107';
      ctx.fill();

      // Draw connections to center
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(x, y);
      ctx.strokeStyle = `rgba(100, 100, 100, ${pattern.confidence * 0.5})`;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.fillText(pattern.name?.substring(0, 10) || 'pattern', x + 10, y);
    });

    // Draw center node
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#2196F3';
    ctx.fill();

  }, [patterns]);

  return (
    <div className="pattern-network-container">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{ width: '100%', height: 'auto' }}
      />
      <div className="network-legend">
        <div className="legend-item">
          <span className="legend-dot high"></span>
          High Confidence (&gt;80%)
        </div>
        <div className="legend-item">
          <span className="legend-dot medium"></span>
          Medium Confidence
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Patterns View
// ============================================================================

function PatternsView({ patterns, onRefresh }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('confidence');

  const filteredPatterns = patterns.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'high') return p.confidence >= 0.8;
    if (filter === 'synced') return p.synced;
    return true;
  });

  const sortedPatterns = [...filteredPatterns].sort((a, b) => {
    if (sortBy === 'confidence') return (b.confidence || 0) - (a.confidence || 0);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'type') return (a.type || '').localeCompare(b.type || '');
    return 0;
  });

  return (
    <div className="patterns-view">
      <div className="view-header">
        <h2>Patterns ({filteredPatterns.length})</h2>
        <div className="view-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Patterns</option>
            <option value="high">High Confidence</option>
            <option value="synced">Synced Only</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="confidence">Sort by Confidence</option>
            <option value="name">Sort by Name</option>
            <option value="type">Sort by Type</option>
          </select>
          <button onClick={onRefresh}>🔄 Refresh</button>
        </div>
      </div>

      <div className="patterns-grid">
        {sortedPatterns.map((pattern, index) => (
          <PatternCard key={index} pattern={pattern} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Pattern Card Component
// ============================================================================

function PatternCard({ pattern }) {
  return (
    <div className="pattern-card">
      <div className="pattern-header">
        <h3>{pattern.name || 'Unnamed Pattern'}</h3>
        <span className={`pattern-badge ${pattern.type?.toLowerCase()}`}>
          {pattern.type || 'UNKNOWN'}
        </span>
      </div>
      
      <div className="pattern-confidence">
        <div className="confidence-bar">
          <div 
            className="confidence-fill"
            style={{ width: `${(pattern.confidence || 0) * 100}%` }}
          ></div>
        </div>
        <span className="confidence-value">
          {((pattern.confidence || 0) * 100).toFixed(0)}%
        </span>
      </div>

      <div className="pattern-meta">
        <div className="meta-item">
          <span className="meta-label">Occurrences:</span>
          <span className="meta-value">{pattern.occurrences || 0}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Projects:</span>
          <span className="meta-value">
            {pattern.projects?.length || Array.from(pattern.projects || []).length || 0}
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Synced:</span>
          <span className="meta-value">{pattern.synced ? '✅' : '⏳'}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Sync View
// ============================================================================

function SyncView({ syncStatus, onForceSync, onRefresh }) {
  return (
    <div className="sync-view">
      <div className="view-header">
        <h2>Cloud Synchronization</h2>
        <div className="view-controls">
          <button onClick={onRefresh}>🔄 Refresh</button>
          <button onClick={onForceSync} className="primary">⚡ Force Sync</button>
        </div>
      </div>

      {syncStatus && (
        <div className="sync-details">
          <div className="detail-card">
            <h3>Connection Status</h3>
            <div className={`status-indicator ${syncStatus.isOnline ? 'online' : 'offline'}`}>
              {syncStatus.isOnline ? '🟢 Online' : '🔴 Offline'}
            </div>
          </div>

          <div className="detail-card">
            <h3>Last Sync</h3>
            <div className="detail-value">
              {syncStatus.lastSync 
                ? new Date(syncStatus.lastSync).toLocaleString()
                : 'Never synced'
              }
            </div>
          </div>

          <div className="detail-card">
            <h3>Pending Uploads</h3>
            <div className="detail-value">
              {syncStatus.pendingUploads || 0} items
            </div>
          </div>

          <div className="detail-card">
            <h3>Offline Queue</h3>
            <div className="detail-value">
              {syncStatus.offlineQueue || 0} operations
            </div>
          </div>

          <div className="detail-card">
            <h3>Conflicts</h3>
            <div className="detail-value">
              {syncStatus.conflicts || 0} unresolved
            </div>
          </div>

          <div className="detail-card">
            <h3>Sync Count</h3>
            <div className="detail-value">
              {syncStatus.syncCount || 0} total
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Watcher View
// ============================================================================

function WatcherView({ realTimeEvents }) {
  return (
    <div className="watcher-view">
      <div className="view-header">
        <h2>Real-Time Watcher</h2>
      </div>

      <div className="events-timeline">
        {realTimeEvents.map((event, index) => (
          <div key={index} className="timeline-event">
            <div className="event-timestamp">
              {new Date(event.timestamp).toLocaleTimeString()}
            </div>
            <div className="event-details">
              <span className={`event-type-badge ${event.type}`}>
                {event.type}
              </span>
              {event.data && (
                <pre className="event-data">
                  {JSON.stringify(event.data, null, 2).substring(0, 200)}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MagnusDashboard;
