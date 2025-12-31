# MAGNUS API 15.4 - COMPLETE DOCUMENTATION

**Professional RESTful API for Magnus Scanner**

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Authentication](#authentication)
4. [Endpoints](#endpoints)
5. [Rate Limiting](#rate-limiting)
6. [Error Handling](#error-handling)
7. [Examples](#examples)
8. [SDKs](#sdks)

---

## 🎯 OVERVIEW

Magnus API 15.4 provides a standardized RESTful interface to all Magnus Scanner features.

### Key Features

✅ **RESTful Design** - Standard HTTP methods  
✅ **API Key Authentication** - Secure access control  
✅ **Rate Limiting** - 100 requests/hour  
✅ **OpenAPI Documentation** - Interactive API docs  
✅ **Versioning** - `/api/v1` prefix  
✅ **CORS Support** - Cross-origin requests  
✅ **Request Validation** - Input sanitization  
✅ **Error Handling** - Consistent error responses  

### Base URL

```
http://localhost:4000/api/v1
```

---

## 🚀 QUICK START

### 1. Start the API

```bash
# Set environment variables
export CLOUDZERO_ENDPOINT="https://your-endpoint.com"
export API_PORT=4000

# Launch API
node api-launcher.js

# Save the Master API Key shown in console
# 🔑 Master API Key: magnus_abc123...
```

### 2. Make Your First Request

```bash
# Test health endpoint (no auth required)
curl http://localhost:4000/health

# List patterns (requires API key)
curl -H "X-API-Key: YOUR_API_KEY" \
  http://localhost:4000/api/v1/patterns
```

### 3. View API Documentation

```
http://localhost:4000/docs
```

---

## 🔐 AUTHENTICATION

### API Keys

All endpoints (except `/health` and `/docs`) require an API key.

### Providing API Key

**Option 1: X-API-Key Header**
```bash
curl -H "X-API-Key: YOUR_API_KEY" \
  http://localhost:4000/api/v1/patterns
```

**Option 2: Authorization Header**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:4000/api/v1/patterns
```

### Generate New API Key

```bash
curl -X POST \
  -H "X-API-Key: MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"My App","permissions":["read","write"]}' \
  http://localhost:4000/api/v1/keys
```

**Response:**
```json
{
  "success": true,
  "data": {
    "apiKey": "magnus_new_key_here",
    "name": "My App",
    "permissions": ["read", "write"]
  }
}
```

---

## 📡 ENDPOINTS

### Health Check

**GET** `/health` (No auth required)

```bash
curl http://localhost:4000/health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "v1",
  "uptime": 12345,
  "timestamp": 1234567890,
  "components": {
    "magnus14": true,
    "cloudSync": true,
    "watcher": false
  }
}
```

---

### Patterns

#### List Patterns

**GET** `/api/v1/patterns`

**Query Parameters:**
- `type` (string) - Filter by pattern type
- `minConfidence` (number) - Minimum confidence (0-1)
- `project` (string) - Filter by project name
- `limit` (integer) - Results per page (default: 100)
- `offset` (integer) - Pagination offset (default: 0)

```bash
curl -H "X-API-Key: YOUR_KEY" \
  "http://localhost:4000/api/v1/patterns?minConfidence=0.8&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pattern123",
      "name": "express-setup",
      "type": "API_PATTERN",
      "confidence": 0.87,
      "occurrences": 8,
      "projects": ["project1", "project2"]
    }
  ],
  "pagination": {
    "total": 47,
    "limit": 10,
    "offset": 0,
    "count": 10
  }
}
```

#### Get Pattern by ID

**GET** `/api/v1/patterns/:id`

```bash
curl -H "X-API-Key: YOUR_KEY" \
  http://localhost:4000/api/v1/patterns/pattern123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pattern123",
    "name": "express-setup",
    "type": "API_PATTERN",
    "code": "const app = express();",
    "confidence": 0.87,
    "occurrences": 8,
    "projects": ["project1", "project2"],
    "synced": true
  }
}
```

#### Create/Sync Pattern

**POST** `/api/v1/patterns`

```bash
curl -X POST \
  -H "X-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "auth-middleware",
    "type": "FUNCTION",
    "code": "function authenticate(req, res, next) {...}",
    "confidence": 0.92
  }' \
  http://localhost:4000/api/v1/patterns
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "synced": true,
    "id": "pattern456"
  }
}
```

---

### Scans

#### Run a Scan

**POST** `/api/v1/scans`

```bash
curl -X POST \
  -H "X-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "projects": ["./project1", "./project2"],
    "options": {
      "minConfidence": 0.7
    }
  }' \
  http://localhost:4000/api/v1/scans
```

**Response:**
```json
{
  "success": true,
  "data": {
    "patterns": [...],
    "friction": [...],
    "abandoned": [...],
    "statistics": {...}
  }
}
```

#### List Scan Results

**GET** `/api/v1/scans`

```bash
curl -H "X-API-Key: YOUR_KEY" \
  "http://localhost:4000/api/v1/scans?limit=5"
```

---

### Sync

#### Get Sync Status

**GET** `/api/v1/sync/status`

```bash
curl -H "X-API-Key: YOUR_KEY" \
  http://localhost:4000/api/v1/sync/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isOnline": true,
    "lastSync": 1234567890,
    "pendingUploads": 5,
    "offlineQueue": 0,
    "conflicts": 0
  }
}
```

#### Force Sync

**POST** `/api/v1/sync/force`

```bash
curl -X POST \
  -H "X-API-Key: YOUR_KEY" \
  http://localhost:4000/api/v1/sync/force
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploaded": 5,
    "downloaded": 3,
    "resolved": 1,
    "queued": 0
  }
}
```

---

### Watcher

#### Get Watcher Status

**GET** `/api/v1/watcher/status`

```bash
curl -H "X-API-Key: YOUR_KEY" \
  http://localhost:4000/api/v1/watcher/status
```

---

### Statistics

#### Get Comprehensive Statistics

**GET** `/api/v1/statistics`

```bash
curl -H "X-API-Key: YOUR_KEY" \
  http://localhost:4000/api/v1/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "api": {
      "requests": 1000,
      "authenticated": 950,
      "rateLimited": 5,
      "errors": 2
    },
    "magnus14": {...},
    "cloudSync": {...},
    "watcher": {...}
  }
}
```

---

## ⏱️ RATE LIMITING

- **Limit:** 100 requests per hour per API key
- **Header:** Rate limit info in response headers
- **Status Code:** 429 when limit exceeded

**Rate Limit Response:**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Maximum 100 requests per hour"
}
```

---

## ❌ ERROR HANDLING

### Error Response Format

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid API key)
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## 💡 EXAMPLES

### JavaScript/Node.js

```javascript
const API_KEY = 'your_api_key';
const BASE_URL = 'http://localhost:4000/api/v1';

async function listPatterns() {
  const response = await fetch(`${BASE_URL}/patterns`, {
    headers: {
      'X-API-Key': API_KEY
    }
  });
  
  const data = await response.json();
  console.log(data);
}

async function runScan(projects) {
  const response = await fetch(`${BASE_URL}/scans`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ projects })
  });
  
  const data = await response.json();
  return data;
}

// Usage
listPatterns();
runScan(['./my-project']);
```

### Python

```python
import requests

API_KEY = 'your_api_key'
BASE_URL = 'http://localhost:4000/api/v1'

def list_patterns():
    response = requests.get(
        f'{BASE_URL}/patterns',
        headers={'X-API-Key': API_KEY}
    )
    return response.json()

def run_scan(projects):
    response = requests.post(
        f'{BASE_URL}/scans',
        headers={
            'X-API-Key': API_KEY,
            'Content-Type': 'application/json'
        },
        json={'projects': projects}
    )
    return response.json()

# Usage
patterns = list_patterns()
results = run_scan(['./my-project'])
```

### cURL

```bash
# List patterns
curl -H "X-API-Key: YOUR_KEY" \
  http://localhost:4000/api/v1/patterns

# Run scan
curl -X POST \
  -H "X-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"projects":["./project"]}' \
  http://localhost:4000/api/v1/scans

# Force sync
curl -X POST \
  -H "X-API-Key: YOUR_KEY" \
  http://localhost:4000/api/v1/sync/force
```

---

## 📦 SDKs

### JavaScript SDK

```javascript
class MagnusClient {
  constructor(apiKey, baseURL = 'http://localhost:4000/api/v1') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    return response.json();
  }

  async getPatterns(filters = {}) {
    const query = new URLSearchParams(filters);
    return this.request(`/patterns?${query}`);
  }

  async getPattern(id) {
    return this.request(`/patterns/${id}`);
  }

  async createPattern(pattern) {
    return this.request('/patterns', {
      method: 'POST',
      body: JSON.stringify(pattern)
    });
  }

  async runScan(projects, options = {}) {
    return this.request('/scans', {
      method: 'POST',
      body: JSON.stringify({ projects, options })
    });
  }

  async getSyncStatus() {
    return this.request('/sync/status');
  }

  async forceSync() {
    return this.request('/sync/force', { method: 'POST' });
  }

  async getStatistics() {
    return this.request('/statistics');
  }
}

// Usage
const client = new MagnusClient('your_api_key');
const patterns = await client.getPatterns({ minConfidence: 0.8 });
```

---

## 🔒 SECURITY BEST PRACTICES

1. **Keep API Keys Secret**
   - Never commit keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **Use HTTPS in Production**
   ```bash
   # Use behind reverse proxy with SSL
   nginx → Magnus API
   ```

3. **Implement IP Whitelisting**
   ```javascript
   const allowedIPs = ['1.2.3.4', '5.6.7.8'];
   ```

4. **Monitor Rate Limits**
   - Track API usage
   - Set up alerts
   - Scale if needed

---

## 📊 MONITORING

### Health Check

```bash
# Continuous health monitoring
while true; do
  curl http://localhost:4000/health
  sleep 60
done
```

### Statistics Tracking

```bash
# Get API statistics every 5 minutes
watch -n 300 "curl -H 'X-API-Key: YOUR_KEY' \
  http://localhost:4000/api/v1/statistics"
```

---

## 🚀 DEPLOYMENT

### Production Configuration

```bash
export API_PORT=80
export API_HOST=0.0.0.0
export NODE_ENV=production
export CLOUDZERO_ENDPOINT="https://api.magnus.com"

node api-launcher.js
```

### With PM2

```bash
pm2 start api-launcher.js --name magnus-api
pm2 save
pm2 startup
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 4000

CMD ["node", "api-launcher.js"]
```

---

## 📚 OPENAPI SPECIFICATION

Full OpenAPI 3.0 specification available at:
```
http://localhost:4000/docs
```

Can be imported into:
- Postman
- Insomnia
- Swagger UI
- OpenAPI Generator

---

**Magnus API 15.4** - Professional RESTful Interface  
Part of Magnus Scanner Ecosystem  
Built with ❤️ for seamless integration
