# Magnus Dashboard 15.3 - Deployment Guide

## Quick Start

```bash
cd /path/to/magnus-dashboard
npm install
npm start
```

Dashboard: http://localhost:3000

---

## Production Deployment

### 1. Environment Setup

```bash
# Copy production config
cp .env.production .env

# Update with your settings
PORT=3000
HOST=your-server-ip
NODE_ENV=production
```

### 2. System Requirements

- Node.js 18+
- npm 8+
- 512MB RAM minimum
- Stable internet connection

### 3. Deployment Options

#### Option A: Direct Node.js
```bash
npm install --production
NODE_ENV=production npm start
```

#### Option B: PM2 Process Manager
```bash
npm install -g pm2
npm install --production
pm2 start server/index.js --name "magnus-dashboard"
pm2 save
pm2 startup
```

#### Option C: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t magnus-dashboard .
docker run -p 3000:3000 magnus-dashboard
```

#### Option D: Heroku
```bash
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
git push heroku main
```

### 4. Production Checklist

- [ ] Update `.env.production` with correct values
- [ ] Set NODE_ENV=production
- [ ] Enable SSL/TLS (HTTPS)
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test health endpoint: `/api/health`
- [ ] Verify WebSocket connection
- [ ] Set up auto-restart (PM2, systemd, etc.)

### 5. API Endpoints

```
GET  /api/health           - Server health
GET  /api/patterns         - Detected patterns
GET  /api/sync-status      - Sync status
GET  /api/statistics       - Server statistics
GET  /api/magnus           - Magnus status
POST /api/process          - Process request
POST /api/magnus/analyze   - Analyze text
WS   ws://host:port        - WebSocket
```

### 6. Monitoring

```bash
# Check logs
tail -f /var/log/magnus-dashboard.log

# Monitor performance
curl http://localhost:3000/api/stats/performance

# Health check
curl http://localhost:3000/api/health
```

### 7. Scaling

For multiple instances, use:
- Nginx as reverse proxy
- Load balancer (HAProxy, AWS ELB, etc.)
- Redis for session management
- PM2 cluster mode

### 8. Troubleshooting

**Port already in use:**
```bash
PORT=3001 npm start
```

**WebSocket connection failed:**
- Check firewall allows WebSocket
- Verify SSL/TLS setup
- Check proxy configuration

**Magnus not initializing:**
- Check `.magnus` directory permissions
- Verify Magnus framework installation
- Review console logs for errors

### 9. Security Best Practices

- Use HTTPS/WSS for production
- Implement rate limiting
- Configure CORS properly
- Validate all inputs
- Keep dependencies updated
- Monitor for suspicious activity
- Use strong authentication
- Backup data regularly

---

**Support**: Check API-DOCUMENTATION.md for detailed API docs
**Status**: Tested on Node.js 18+, Recommended for production use
