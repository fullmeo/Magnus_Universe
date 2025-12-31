# 🚀 Magnus Dashboard 15.3 - Production Deployment

**Complete deployment guide for Magnus Dashboard in production environments**

---

## 📋 Quick Start (Choose One)

### Docker (Recommended)
```bash
docker-compose up -d
# Dashboard: http://localhost:3000
```

### Direct Node.js
```bash
npm ci --production
NODE_ENV=production npm start
```

### PM2 (Process Manager)
```bash
npm install -g pm2
npm ci --production
pm2 start server/index.js --name magnus-dashboard
pm2 startup
pm2 save
```

---

## 📦 What's Included

✅ **Complete Dashboard Application**
- Real-time pattern visualization
- WebSocket real-time updates
- RESTful API with 8 endpoints
- Magnus13 AI framework integration

✅ **Production Ready**
- Environment configuration
- Docker containerization
- Health checks built-in
- Error handling and logging

✅ **Deployment Scripts**
- `deploy.sh` - Automated deployment
- `docker-compose.yml` - Container orchestration
- `Dockerfile` - Production image
- `.env.production` - Environment config

---

## 🎯 Deployment Options

### Option 1: Docker Compose (Easiest)
```bash
cd magnus-dashboard
docker-compose up -d
```
- Auto-restart on failure
- Volume management
- Network isolation
- Health monitoring

### Option 2: Docker (Manual)
```bash
docker build -t magnus-dashboard .
docker run -d -p 3000:3000 --name dashboard magnus-dashboard
```

### Option 3: PM2 (Process Manager)
```bash
./deploy.sh pm2
```
- Process monitoring
- Auto-restart
- Log management
- Clustering support

### Option 4: Heroku (Cloud PaaS)
```bash
./deploy.sh heroku
```
- Git-based deployment
- Automatic scaling
- Built-in SSL/TLS
- CDN included

### Option 5: Direct Node.js
```bash
./deploy.sh direct
```
- Minimal setup
- Direct control
- Best for development

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/patterns` | List detected patterns |
| GET | `/api/sync-status` | Cloud sync status |
| GET | `/api/statistics` | Server statistics |
| GET | `/api/magnus` | Magnus AI status |
| POST | `/api/process` | Process request through Magnus |
| POST | `/api/magnus/analyze` | Analyze text with AI |
| GET | `/api/stats/performance` | Performance metrics |

---

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=production       # Environment mode
PORT=3000               # Server port
HOST=0.0.0.0           # Bind address
MAGNUS_AUTO_LEARN=true  # Enable learning
ENABLE_CORS=true        # Enable CORS
WS_ENABLED=true         # Enable WebSocket
LOG_LEVEL=info          # Logging level
```

### File Structure
```
magnus-dashboard/
├── server/
│   ├── index.js                    # Entry point
│   ├── dashboard-server.js         # Main server
│   ├── api-routes.js              # API endpoints
│   └── magnus-integration.js       # Magnus connection
├── public/
│   ├── index.html                 # Frontend
│   ├── dashboard-app.jsx          # React app
│   └── dashboard-styles.css       # Styles
├── docker-compose.yml             # Docker config
├── Dockerfile                     # Container image
├── deploy.sh                      # Deploy script
└── .env.production               # Production config
```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Node.js 18+ installed
- [ ] npm 8+ installed
- [ ] Dependencies: `npm ci --production`
- [ ] Environment file configured
- [ ] Firewall rules updated
- [ ] SSL/TLS certificates ready (production)

### Deployment
- [ ] Choose deployment method
- [ ] Run deployment script
- [ ] Verify server starts
- [ ] Test health endpoint
- [ ] Test API endpoints
- [ ] Test WebSocket connection

### Post-Deployment
- [ ] Monitor logs
- [ ] Check resource usage
- [ ] Verify automatic restart
- [ ] Set up monitoring alerts
- [ ] Configure backups
- [ ] Document deployment details

---

## 🔍 Monitoring

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Server Status
```bash
curl http://localhost:3000/api/statistics
```

### Performance Metrics
```bash
curl http://localhost:3000/api/stats/performance
```

### Docker Logs
```bash
docker-compose logs -f magnus-dashboard
```

### PM2 Logs
```bash
pm2 logs magnus-dashboard
```

---

## 🔐 Security Best Practices

- ✅ Use HTTPS/WSS in production
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Keep dependencies updated
- ✅ Use strong authentication
- ✅ Monitor suspicious activity
- ✅ Regular backups
- ✅ Restrict access by IP
- ✅ Enable CORS only for trusted domains
- ✅ Use environment variables for secrets

---

## 📈 Scaling

### Single Server
```bash
docker-compose up -d
# Works for <1000 concurrent users
```

### Multiple Servers
```bash
# Use Nginx as reverse proxy
# Configure load balancing
# Set up session management
```

### High Availability
```bash
# Multiple instances behind load balancer
# Redis for session store
# Database for persistence
# Distributed logging
```

---

## 🆘 Troubleshooting

**Port already in use**
```bash
PORT=3001 npm start
# or
lsof -i :3000  # Find process
kill -9 <PID>   # Kill process
```

**WebSocket connection failed**
- Check firewall allows WSS
- Verify proxy configuration
- Enable CORS if needed
- Check SSL/TLS setup

**Magnus not initializing**
- Check permissions on `.magnus` directory
- Review console logs
- Verify Magnus framework installed
- Check disk space

**High memory usage**
- Monitor garbage collection
- Check for memory leaks
- Increase heap size
- Consider clustering

---

## 📚 Additional Resources

- [API Documentation](./API-DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT-GUIDE.md)
- [Dashboard Documentation](./DASHBOARD-DOCUMENTATION.md)
- [Node.js Docs](https://nodejs.org/docs)
- [Docker Docs](https://docs.docker.com)

---

## 🎉 Ready to Deploy!

Choose your deployment method above and follow the instructions. The application is production-ready with:

✨ Real-time monitoring
✨ RESTful API
✨ WebSocket support
✨ AI integration
✨ Health checks
✨ Docker support
✨ Automatic restart
✨ Performance metrics

**Questions?** Check the documentation files or review the deployment guide.

**Status:** ✅ Production Ready
**Version:** 15.3.0
**Last Updated:** November 30, 2024
