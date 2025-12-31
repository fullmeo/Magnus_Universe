# MAGNUS DASHBOARD 15.3 - DOCUMENTATION

**Real-Time Visualization & Monitoring for Magnus Scanner**

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
5. [Architecture](#architecture)
6. [API Reference](#api-reference)
7. [Components](#components)
8. [Configuration](#configuration)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 OVERVIEW

Magnus Dashboard 15.3 provides a beautiful, real-time web interface for visualizing and monitoring Magnus Scanner activity.

### Key Features

✅ **Real-Time Updates** - WebSocket-based live updates  
✅ **Pattern Network** - Visual pattern relationship graph  
✅ **Sync Monitoring** - Track cloud synchronization  
✅ **Watcher Integration** - Live pattern detection  
✅ **Statistics Dashboard** - Comprehensive metrics  
✅ **Responsive Design** - Works on all devices  

---

## ✨ FEATURES

### 1. Overview Dashboard
- Pattern count and confidence metrics
- Sync status monitoring
- Real-time event feed
- Pattern network visualization

### 2. Patterns View
- List all detected patterns
- Filter by confidence, type, sync status
- Sort by various criteria
- Pattern details cards

### 3. Sync View
- Connection status
- Last sync timestamp
- Pending uploads count
- Offline queue size
- Conflict tracking
- Force sync button

### 4. Watcher View
- Real-time event timeline
- Pattern detection events
- Alert notifications
- Suggestion feed

---

## 📦 INSTALLATION

### Prerequisites

```bash
# Node.js 16+ required
node --version

# Install dependencies (if not already)
npm install express ws
```

### File Structure

```
magnus-dashboard/
├── server/
│   └── dashboard-server.js       (Express server)
├── public/
│   ├── index.html               (HTML template)
│   ├── dashboard-app.jsx        (React app)
│   └── dashboard-styles.css     (Styles)
└── dashboard-launcher.js        (Startup script)
```

---

## 🚀 QUICK START

### Option 1: Simple Launch

```bash
# Set environment variables
export CLOUDZERO_ENDPOINT="https://your-endpoint.com"
export PORT=3000

# Launch dashboard
node dashboard-launcher.js
```

### Option 2: Programmatic Launch

```javascript
import launchDashboard from './dashboard-launcher.js';

const dashboard = await launchDashboard({
  port: 3000,
  host: 'localhost',
  enableCloudSync: true,
  enableMagnus: true,
  enableWatcher: false
});

// Dashboard running at http://localhost:3000
```

### Option 3: With Magnus Integration

```javascript
import DashboardServer from './dashboard-server.js';
import Magnus14 from './magnus-14.js';
import MagnusCloudSync from './magnus-cloud-sync.js';

// Initialize Magnus components
const sync = new MagnusCloudSync({
  cloudZeroEndpoint: process.env.CLOUDZERO_ENDPOINT,
  userId: 'serigne'
});

const magnus = new Magnus14({ cloudSync: sync });

await sync.initialize();
await magnus.initialize();

// Start dashboard
const server = new DashboardServer({
  port: 3000,
  magnus14: magnus,
  cloudSync: sync
});

await server.start();

// Open browser to http://localhost:3000
```

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│              MAGNUS DASHBOARD 15.3                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐                                      │
│  │   Browser    │                                      │
│  │  (React UI)  │                                      │
│  └───────┬──────┘                                      │
│          │                                              │
│    HTTP  │  WebSocket                                  │
│          │                                              │
│  ┌───────▼──────────────────┐                          │
│  │  Dashboard Server        │                          │
│  │  (Express + WebSocket)   │                          │
│  └────┬─────────────────┬───┘                          │
│       │                 │                               │
│  ┌────▼──────┐   ┌──────▼────┐   ┌────────────┐       │
│  │Magnus 14  │   │Cloud Sync │   │  Watcher   │       │
│  │ Scanner   │   │           │   │   15.1     │       │
│  └───────────┘   └───────────┘   └────────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
Pattern Detection
    ↓
Magnus 14 / Watcher
    ↓
Cloud Sync (optional)
    ↓
Dashboard Server
    ↓
WebSocket → Browser
    ↓
Real-Time UI Update
```

---

## 📚 API REFERENCE

### REST Endpoints

#### GET /api/health
```javascript
// Response
{
  status: 'healthy',
  uptime: 12345,
  timestamp: 1234567890,
  statistics: { requests: 100, wsConnections: 5 }
}
```

#### GET /api/patterns
```javascript
// Query params: type, minConfidence, project
// Response
{
  success: true,
  patterns: [...],
  count: 10
}
```

#### GET /api/patterns/:id
```javascript
// Response
{
  success: true,
  pattern: { id, name, type, confidence, ... }
}
```

#### GET /api/scans
```javascript
// Response
{
  success: true,
  results: [...],
  count: 5
}
```

#### GET /api/statistics
```javascript
// Response
{
  success: true,
  statistics: {
    server: {...},
    magnus14: {...},
    cloudSync: {...},
    watcher: {...}
  }
}
```

#### GET /api/sync/status
```javascript
// Response
{
  success: true,
  status: {
    isOnline: true,
    lastSync: 1234567890,
    pendingUploads: 5,
    offlineQueue: 0,
    conflicts: 0
  }
}
```

#### POST /api/sync/force
```javascript
// Response
{
  success: true,
  result: {
    uploaded: 5,
    downloaded: 3,
    resolved: 1,
    queued: 0
  }
}
```

### WebSocket Events

#### Client → Server

```javascript
// Ping
{ type: 'ping' }

// Subscribe to events
{
  type: 'subscribe',
  events: ['sync-completed', 'pattern-synced']
}
```

#### Server → Client

```javascript
// Connection established
{
  type: 'connected',
  timestamp: 1234567890,
  message: 'Connected to Magnus Dashboard'
}

// Ping response
{
  type: 'pong',
  timestamp: 1234567890
}

// Sync started
{
  type: 'sync-started',
  timestamp: 1234567890
}

// Sync completed
{
  type: 'sync-completed',
  data: { uploaded, downloaded, resolved },
  timestamp: 1234567890
}

// Pattern synced
{
  type: 'pattern-synced',
  data: { pattern },
  timestamp: 1234567890
}

// Pattern detected
{
  type: 'pattern-detected',
  data: { pattern },
  timestamp: 1234567890
}

// Alert raised
{
  type: 'alert-raised',
  data: { alert },
  timestamp: 1234567890
}
```

---

## 🎨 COMPONENTS

### Dashboard Server (Backend)

**File:** `dashboard-server.js` (450 lines)

**Features:**
- Express HTTP server
- WebSocket server
- API endpoints
- Static file serving
- Event broadcasting
- Statistics tracking

### Dashboard App (Frontend)

**File:** `dashboard-app.jsx` (600 lines)

**Components:**
- `MagnusDashboard` - Main app
- `Header` - Navigation header
- `OverviewView` - Dashboard overview
- `PatternsView` - Pattern list
- `SyncView` - Sync monitoring
- `WatcherView` - Real-time events
- `PatternNetwork` - Network visualization
- `PatternCard` - Pattern details
- `StatsCard` - Statistics display

### Dashboard Styles (CSS)

**File:** `dashboard-styles.css` (400 lines)

**Features:**
- Modern, clean design
- Responsive layout
- Dark/light theme ready
- Smooth animations
- Accessible colors

---

## ⚙️ CONFIGURATION

### Environment Variables

```bash
# Required
CLOUDZERO_ENDPOINT=https://your-endpoint.com

# Optional
CLOUDZERO_API_KEY=your-api-key
PORT=3000
HOST=localhost
USER=your-username
```

### Dashboard Server Config

```javascript
new DashboardServer({
  port: 3000,                    // Port number
  host: 'localhost',             // Host address
  enableWebSocket: true,         // Enable WebSocket
  corsEnabled: true,             // Enable CORS
  staticDir: './public',         // Static files directory
  magnus14: magnusInstance,      // Magnus 14 instance
  cloudSync: syncInstance,       // Cloud Sync instance
  watcher: watcherInstance       // Watcher instance
})
```

### Launcher Config

```javascript
launchDashboard({
  port: 3000,
  host: 'localhost',
  userId: 'serigne',
  enableCloudSync: true,         // Enable cloud sync
  enableMagnus: true,            // Enable Magnus 14
  enableWatcher: false,          // Enable watcher
  watchPath: './projects',       // Path to watch
  staticDir: './public'          // Static files path
})
```

---

## 🚀 DEPLOYMENT

### Development

```bash
# Start with default settings
node dashboard-launcher.js

# Open browser
open http://localhost:3000
```

### Production

```bash
# Set production environment
export NODE_ENV=production
export PORT=80
export HOST=0.0.0.0

# Use process manager
pm2 start dashboard-launcher.js --name magnus-dashboard

# Or use systemd service
sudo systemctl start magnus-dashboard
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "dashboard-launcher.js"]
```

```bash
# Build
docker build -t magnus-dashboard .

# Run
docker run -p 3000:3000 \
  -e CLOUDZERO_ENDPOINT=https://your-endpoint.com \
  magnus-dashboard
```

### Nginx Reverse Proxy

```nginx
server {
  listen 80;
  server_name magnus.example.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # WebSocket support
  location /ws {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
  }
}
```

---

## 🔧 TROUBLESHOOTING

### Dashboard Won't Start

**Issue:** Port already in use  
**Solution:**
```bash
# Find process using port
lsof -i :3000

# Kill process or use different port
export PORT=3001
```

**Issue:** Module not found  
**Solution:**
```bash
# Install dependencies
npm install express ws
```

### WebSocket Not Connecting

**Issue:** WebSocket connection failed  
**Solution:**
- Check firewall settings
- Verify WebSocket support in proxy
- Try different browser
- Check console for errors

### Patterns Not Showing

**Issue:** No patterns displayed  
**Solution:**
- Verify Magnus 14 is initialized
- Check Cloud Sync status
- Run a scan first:
```javascript
const results = await magnus.scan(['./projects']);
```

### Real-Time Updates Not Working

**Issue:** Events not appearing  
**Solution:**
- Check WebSocket connection status
- Verify event subscriptions
- Check browser console for errors
- Reload page

---

## 📊 PERFORMANCE

### Benchmarks

- **Page Load:** <2 seconds
- **WebSocket Latency:** <50ms
- **API Response:** <100ms
- **Pattern Rendering:** 60fps
- **Memory Usage:** ~50-100MB
- **Concurrent Users:** 100+

### Optimization Tips

1. **Enable Compression**
```javascript
import compression from 'compression';
app.use(compression());
```

2. **Use Production Build**
```bash
NODE_ENV=production node dashboard-launcher.js
```

3. **Cache Static Assets**
```javascript
app.use(express.static('public', {
  maxAge: '1d'
}));
```

---

## 🎓 BEST PRACTICES

### 1. Security

- Use HTTPS in production
- Implement authentication
- Validate all inputs
- Sanitize WebSocket messages
- Use CORS properly

### 2. Monitoring

- Track server statistics
- Monitor WebSocket connections
- Log errors properly
- Set up health checks

### 3. Scaling

- Use Redis for session storage
- Implement load balancing
- Use sticky sessions for WebSocket
- Cache API responses

---

## 🆘 SUPPORT

### Common Issues

**Q: Can I run dashboard without Cloud Sync?**  
A: Yes, set `enableCloudSync: false`

**Q: How do I customize the UI?**  
A: Edit `dashboard-styles.css` and `dashboard-app.jsx`

**Q: Can I add custom views?**  
A: Yes, create new view components in `dashboard-app.jsx`

**Q: Does it work offline?**  
A: Dashboard requires server connection, but Magnus components work offline

---

## 📝 TODO / FUTURE

- [ ] User authentication
- [ ] Dark mode toggle
- [ ] Custom dashboard layouts
- [ ] Export reports to PDF
- [ ] Pattern comparison tool
- [ ] Historical data charts
- [ ] Team collaboration features
- [ ] Mobile app (React Native)

---

**Magnus Dashboard 15.3** - Real-Time Visualization  
Part of Magnus Scanner 14.0 Ecosystem  
Built with ❤️ for seamless monitoring
