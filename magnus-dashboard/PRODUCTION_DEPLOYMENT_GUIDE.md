# Magnus 14 Phase 3 - Production Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (unit, integration, e2e)
- [ ] No console errors or warnings
- [ ] Code review completed
- [ ] Security vulnerabilities resolved
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed (WCAG 2.1 AA)

### Documentation
- [ ] API documentation complete (Swagger/OpenAPI)
- [ ] Component documentation updated
- [ ] Setup guide documented
- [ ] Troubleshooting guide created
- [ ] Changelog updated
- [ ] README refreshed

### Infrastructure
- [ ] Staging environment tested
- [ ] Monitoring configured
- [ ] Error tracking setup (Sentry/LogRocket)
- [ ] Backup strategy documented
- [ ] Disaster recovery tested
- [ ] Load balancing configured
- [ ] SSL/TLS certificates valid

### Data & Security
- [ ] Database migrations tested
- [ ] Data encryption enabled
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] CSRF protection enabled
- [ ] Authentication/authorization working
- [ ] Secrets management configured

---

## Deployment Steps

### Step 1: Pre-Deployment Verification

```bash
# 1. Verify Node.js version
node --version  # Should be 16+

# 2. Verify npm packages
npm list

# 3. Run test suite
npm test

# 4. Check for security vulnerabilities
npm audit

# 5. Run linter
npm run lint

# 6. Build dashboard
npm run build
```

### Step 2: Staging Deployment

```bash
# 1. Create staging branch
git checkout -b deploy/staging

# 2. Set staging environment variables
cp .env.example .env.staging
# Edit .env.staging with staging configuration

# 3. Install dependencies
npm install

# 4. Start on staging server
NODE_ENV=staging npm start

# 5. Run smoke tests
npm run test:smoke

# 6. Performance testing
npm run test:performance

# 7. Load testing
npm run test:load
```

### Step 3: Staging Validation

**Checklist:**
- [ ] Dashboard loads without errors
- [ ] Magnus 14 tab visible and functional
- [ ] All 11 API endpoints responding
- [ ] WebSocket events broadcasting
- [ ] Forms submitting successfully
- [ ] Visualizations rendering
- [ ] Error handling working
- [ ] No memory leaks
- [ ] Database connections stable
- [ ] Logging working properly

### Step 4: Production Deployment

```bash
# 1. Create production branch
git checkout -b deploy/production

# 2. Tag release version
git tag -a v3.1.0 -m "Phase 3 - REST API + Dashboard"

# 3. Set production environment variables
cp .env.example .env.production
# Edit .env.production with production configuration

# 4. Install production dependencies
npm ci --production

# 5. Restart dashboard service
systemctl restart magnus-dashboard

# 6. Verify services running
systemctl status magnus-dashboard

# 7. Check application health
curl http://localhost:3000/api/magnus14/status
```

### Step 5: Post-Deployment Verification

```bash
# 1. Verify services healthy
systemctl status magnus-dashboard

# 2. Check logs for errors
tail -f /var/log/magnus-dashboard/error.log

# 3. Monitor performance
watch -n 5 'curl -s http://localhost:3000/api/magnus14/status | jq'

# 4. Test critical user flows
npm run test:critical-flows

# 5. Check error tracking
# Visit Sentry dashboard for any issues

# 6. Review monitoring metrics
# Check Prometheus/Grafana dashboards
```

---

## Environment Configuration

### .env.staging

```env
NODE_ENV=staging
PORT=3000
HOST=0.0.0.0

# Magnus 14
MAGNUS_14_PATH=./magnus/magnus-14
MAGNUS_14_STORAGE=./storage/magnus-14

# WebSocket
WEBSOCKET_ENABLED=true
WEBSOCKET_HEARTBEAT=30000

# Logging
LOG_LEVEL=debug
LOG_FORMAT=json

# Database (if applicable)
DB_HOST=staging-db.example.com
DB_PORT=5432
DB_NAME=magnus_14_staging
DB_USER=magnus_staging
DB_PASSWORD=*** (from secrets)

# Security
CORS_ORIGIN=https://staging.example.com
RATE_LIMIT=100/15min
HELMET_ENABLED=true

# Monitoring
SENTRY_DSN=https://key@sentry.io/project
MONITORING_ENABLED=true
```

### .env.production

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Magnus 14
MAGNUS_14_PATH=./magnus/magnus-14
MAGNUS_14_STORAGE=/data/magnus-14/storage

# WebSocket
WEBSOCKET_ENABLED=true
WEBSOCKET_HEARTBEAT=30000

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_OUTPUT=/var/log/magnus-dashboard/

# Database
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_NAME=magnus_14_production
DB_USER=magnus_prod
DB_PASSWORD=*** (from AWS Secrets Manager/HashiCorp Vault)

# Security
CORS_ORIGIN=https://dashboard.example.com
RATE_LIMIT=1000/15min
HELMET_ENABLED=true
HTTPS_ONLY=true

# Monitoring
SENTRY_DSN=https://key@sentry.io/project
MONITORING_ENABLED=true
NEW_RELIC_LICENSE_KEY=***

# Caching
REDIS_URL=redis://prod-redis:6379
CACHE_TTL=3600
```

---

## Systemd Service Configuration

Create `/etc/systemd/system/magnus-dashboard.service`:

```ini
[Unit]
Description=Magnus Dashboard Service
After=network.target

[Service]
Type=simple
User=magnus
WorkingDirectory=/opt/magnus-dashboard
ExecStart=/usr/local/bin/node server/index.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment="NODE_ENV=production"
Environment="PORT=3000"

# Security
PrivateTmp=yes
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/data/magnus-14/storage

[Install]
WantedBy=multi-user.target
```

**Enable service:**
```bash
sudo systemctl enable magnus-dashboard
sudo systemctl start magnus-dashboard
```

---

## Monitoring & Health Checks

### Health Check Configuration

**Application Health:**
```bash
curl -I http://localhost:3000/api/magnus14/status
```

**Load Balancer Health Check:**
```
Path: /api/magnus14/status
Interval: 30 seconds
Timeout: 5 seconds
Healthy Threshold: 2
Unhealthy Threshold: 3
```

### Logging Configuration

**Structured Logging:**
```javascript
// All logs should follow this format
{
  "timestamp": "2025-12-10T06:00:00Z",
  "level": "info",
  "message": "Project analyzed",
  "projectId": "proj_xxxxx",
  "duration": 245,
  "status": "success"
}
```

**Log Aggregation:**
- Send logs to ELK Stack, Datadog, or CloudWatch
- Set retention to 30 days minimum
- Configure alerts for errors

### Monitoring Metrics

**Key Metrics to Monitor:**

| Metric | Threshold | Action |
|--------|-----------|--------|
| API Response Time | >500ms | Alert & Investigate |
| Error Rate | >1% | Page on-call |
| CPU Usage | >80% | Scale horizontally |
| Memory Usage | >90% | Restart service |
| WebSocket Connections | >1000 | Scale |
| Disk Space | <10% | Alert |

---

## Backup & Disaster Recovery

### Backup Strategy

**Daily Backups:**
```bash
# Backup Magnus 14 storage
tar -czf /backups/magnus-14-$(date +%Y%m%d).tar.gz \
  /data/magnus-14/storage/

# Upload to cloud storage
aws s3 cp /backups/magnus-14-*.tar.gz s3://backups/magnus-14/
```

**Retention Policy:**
- Daily backups: 7 days
- Weekly backups: 4 weeks
- Monthly backups: 12 months

### Disaster Recovery Plan

**Recovery Time Objective (RTO):** 1 hour
**Recovery Point Objective (RPO):** 1 hour

**Recovery Procedure:**
1. Restore from latest backup
2. Verify data integrity
3. Start application services
4. Run health checks
5. Restore DNS if needed
6. Monitor for issues

---

## Rollback Procedure

If critical issues occur post-deployment:

### Immediate Rollback (<5 minutes)

```bash
# 1. Stop new version
systemctl stop magnus-dashboard

# 2. Revert code to previous version
git checkout v3.0.0
npm ci --production

# 3. Start previous version
systemctl start magnus-dashboard

# 4. Verify health
curl http://localhost:3000/api/magnus14/status

# 5. Update load balancer to remove instance if needed
```

### Data Rollback (if database changes)

```bash
# 1. Restore database from backup
pg_restore -d magnus_14 backup-$(date -d yesterday +%Y%m%d).sql

# 2. Verify data integrity
SELECT COUNT(*) FROM projects;

# 3. Run consistency checks
npm run check:data-integrity
```

---

## Performance Tuning

### Node.js Optimization

```bash
# Enable clustering for multi-core systems
NODE_OPTIONS="--max-old-space-size=4096" npm start

# Use clustering module
npm install cluster-worker

# Enable V8 code caching
NODE_OPTIONS="--expose-gc" npm start
```

### Reverse Proxy (Nginx)

```nginx
upstream magnus_dashboard {
  least_conn;
  server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
  server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
  keepalive 32;
}

server {
  listen 443 ssl http2;
  server_name dashboard.example.com;

  # SSL
  ssl_certificate /etc/ssl/certs/example.com.crt;
  ssl_certificate_key /etc/ssl/private/example.com.key;

  # Compression
  gzip on;
  gzip_types text/plain text/css application/json;
  gzip_min_length 1024;

  # Caching
  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m;

  # Proxy settings
  location / {
    proxy_pass http://magnus_dashboard;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # WebSocket support
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }

  # API caching
  location /api/magnus14/accuracy {
    proxy_pass http://magnus_dashboard;
    proxy_cache api_cache;
    proxy_cache_valid 200 1h;
    add_header X-Cache-Status $upstream_cache_status;
  }
}
```

### Database Optimization

```sql
-- Create indexes
CREATE INDEX idx_projects_domain ON projects(domain);
CREATE INDEX idx_projects_timestamp ON projects(timestamp DESC);
CREATE INDEX idx_outcomes_projectid ON outcomes(projectId);

-- Analyze tables
ANALYZE projects;
ANALYZE outcomes;

-- Enable query caching
SET SESSION query_cache_type = ON;
```

---

## Security Checklist

- [ ] HTTPS/TLS enforced (latest TLS 1.3)
- [ ] HTTP headers secured (CSP, X-Frame-Options, etc.)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (output encoding)
- [ ] CSRF tokens implemented
- [ ] Authentication/authorization working
- [ ] Secrets not in code/logs
- [ ] Regular security updates
- [ ] Vulnerability scanning enabled
- [ ] Penetration testing scheduled
- [ ] Security headers verified

---

## Incident Response

### Critical Error (Production Down)

1. **Alert Team:** Page on-call engineer
2. **Assess Impact:** Check affected services
3. **Immediate Actions:**
   - Check service logs
   - Verify database connectivity
   - Check API response times
   - Review recent deployments
4. **Remediation:**
   - Rollback if deployment-related
   - Restart service if resource issue
   - Scale if load-related
5. **Communication:** Update status page
6. **Post-Incident:** Root cause analysis

### Performance Degradation

1. **Gather Metrics:** Response times, CPU, memory
2. **Identify Bottleneck:** API, database, memory
3. **Implement Fix:** Scale, optimize, restart
4. **Monitor Recovery:** Ensure metrics return to normal
5. **Document:** Add to runbook

### Data Loss

1. **STOP ALL WRITES:** Prevent further damage
2. **Assess Extent:** How much data lost?
3. **Restore from Backup:** Use point-in-time recovery
4. **Verify Integrity:** Run consistency checks
5. **Enable Writes:** Resume normal operation
6. **Investigate Cause:** Prevent recurrence

---

## Maintenance Windows

### Scheduled Maintenance (Monthly)

**Windows:** Sunday 2-4 AM UTC

**Activities:**
- Security updates
- Dependency updates
- Database maintenance
- Backup verification
- Log rotation

**Communication:**
- Notify users 1 week in advance
- Send reminder 24 hours before
- Publish status updates during
- Confirm completion after

---

## Documentation Links

- [API Documentation](./API_DOCUMENTATION.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Component Reference](./COMPONENT_REFERENCE.md)
- [Operations Runbook](./OPERATIONS_RUNBOOK.md)

---

## Support & Escalation

**L1 Support:** First response <1 hour
**L2 Engineering:** <2 hours for critical
**L3 Architecture:** On-call

**Contact:**
- Email: devops@example.com
- Slack: #magnus-dashboard
- PagerDuty: Magnus Dashboard On-Call

---

## Sign-Off

- [ ] Release Manager: _________________
- [ ] Engineering Lead: _________________
- [ ] Operations Lead: _________________
- [ ] Security Officer: _________________

**Release Date:** ________________
**Deployed By:** ________________
**Version:** 3.1.0

---

Generated: 2025-12-10
Last Updated: 2025-12-10
