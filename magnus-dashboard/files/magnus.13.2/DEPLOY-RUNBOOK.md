# 🚀 MAGNUS 13.2 DEPLOYMENT RUNBOOK
**Version:** 1.0 | **Last Updated:** 2026-01-01 | **Owner:** DevOps Team

---

## 📋 QUICK REFERENCE

### Pre-Deployment Checklist
- [ ] All CI/CD checks passing (unit, performance, security)
- [ ] Nightly regression tests green
- [ ] Load tests completed successfully
- [ ] Security scan clean (no critical vulnerabilities)
- [ ] Release notes prepared and reviewed

### Deployment Commands
```bash
# Staging deployment
npm run deploy:staging

# Production deployment
npm run deploy:production

# Rollback
npm run rollback
```

### Monitoring Dashboards
- **Application Health:** https://monitoring.example.com/magnus/health
- **Performance Metrics:** https://monitoring.example.com/magnus/performance
- **Error Tracking:** https://monitoring.example.com/magnus/errors

---

## 🎯 DEPLOYMENT PROCESS

### Phase 1: Pre-Deployment (30 minutes)

#### 1.1 Code Quality Gates
```bash
# Run full test suite
npm run ci

# Verify no regressions
npm run test:regression

# Check security
npm run security:scan
```

**Success Criteria:**
- ✅ All tests passing (96.9%+ success rate)
- ✅ No critical security vulnerabilities
- ✅ Performance within baselines
- ✅ Coverage > 85%

#### 1.2 Environment Preparation
```bash
# Update staging environment
kubectl set image deployment/magnus-staging magnus=magnus:staging

# Verify staging deployment
kubectl rollout status deployment/magnus-staging
```

### Phase 2: Staging Deployment (15 minutes)

#### 2.1 Deploy to Staging
```bash
# Blue-green deployment
kubectl apply -f k8s/staging/

# Wait for rollout
kubectl rollout status deployment/magnus-staging
```

#### 2.2 Staging Validation
```bash
# Health check
curl -f https://staging-api.example.com/health

# Load test staging
npm run test:load -- --env=staging

# Performance validation
npm run test:performance -- --env=staging
```

**Staging Success Criteria:**
- ✅ Health checks passing
- ✅ Load tests successful
- ✅ Performance metrics within 5% of production
- ✅ No errors in application logs

### Phase 3: Production Deployment (30 minutes)

#### 3.1 Production Deployment
```bash
# Blue-green deployment with canary
kubectl apply -f k8s/production/

# Canary deployment (10% traffic)
kubectl set image deployment/magnus-canary magnus=magnus:latest

# Monitor canary for 30 minutes
kubectl logs -f deployment/magnus-canary
```

#### 3.2 Canary Validation (30 minutes)
**Monitor these metrics:**
- Error rate < 0.1%
- Latency < 500ms (95th percentile)
- CPU usage < 70%
- Memory usage < 80%

```bash
# Automated canary checks
npm run canary:check

# Manual validation
curl -f https://api.example.com/health
curl -f https://api.example.com/v1/analyze -X POST -d '{"request":"test"}'
```

#### 3.3 Full Production Rollout
```bash
# If canary successful, complete rollout
kubectl set image deployment/magnus-production magnus=magnus:latest

# Verify rollout
kubectl rollout status deployment/magnus-production
```

### Phase 4: Post-Deployment (15 minutes)

#### 4.1 Final Validation
```bash
# Production health checks
npm run health:check -- --env=production

# Alert verification
# Check that monitoring alerts are working
```

#### 4.2 Documentation Update
- Update version in monitoring dashboards
- Update API documentation if needed
- Notify stakeholders of successful deployment

---

## 🚨 INCIDENT RESPONSE

### Immediate Actions (First 5 minutes)
1. **Assess Impact:** Check error rates and user impact
2. **Stop Deployment:** If < 50% success rate, initiate rollback
3. **Alert Team:** Notify on-call engineer and stakeholders
4. **Isolate Issue:** Check logs and metrics for root cause

### Rollback Procedure (10 minutes)
```bash
# Emergency rollback
kubectl rollout undo deployment/magnus-production

# Verify rollback
kubectl rollout status deployment/magnus-production

# Confirm health
curl -f https://api.example.com/health
```

### Investigation (30-60 minutes)
1. **Log Analysis:** Review application and infrastructure logs
2. **Metric Correlation:** Compare with baseline performance
3. **Code Review:** Check recent changes for issues
4. **External Factors:** Verify infrastructure and dependencies

---

## 📊 MONITORING & ALERTS

### Key Metrics to Monitor
| Metric | Threshold | Alert Level |
|--------|-----------|-------------|
| Error Rate | > 0.1% | 🚨 Critical |
| Latency (95th) | > 500ms | ⚠️ Warning |
| CPU Usage | > 70% | ⚠️ Warning |
| Memory Usage | > 80% | 🚨 Critical |
| Test Coverage | < 85% | ⚠️ Warning |
| Mutation Score | < 90% | ⚠️ Warning |

### Alert Response Times
- **🚨 Critical:** Respond within 5 minutes
- **⚠️ Warning:** Respond within 30 minutes
- **ℹ️ Info:** Log and monitor trends

### Dashboard URLs
- **Production Health:** https://grafana.example.com/d/magnus-prod
- **Performance Trends:** https://grafana.example.com/d/magnus-perf
- **Error Tracking:** https://sentry.example.com/magnus

---

## 👥 TEAM CONTACTS

### On-Call Engineers
- **Primary:** devops-oncall@example.com | +1-555-0123
- **Secondary:** devops-secondary@example.com | +1-555-0124
- **Escalation:** devops-manager@example.com | +1-555-0125

### Stakeholders
- **Product Owner:** product@example.com
- **Engineering Lead:** eng-lead@example.com
- **Security Team:** security@example.com

### Communication Channels
- **Slack:** #magnus-deployments
- **Email:** magnus-alerts@example.com
- **PagerDuty:** magnus-production

---

## 🔄 MAINTENANCE PROCEDURES

### Weekly Tasks
- [ ] Review nightly regression reports
- [ ] Update performance baselines
- [ ] Security vulnerability scans
- [ ] Log rotation and cleanup

### Monthly Tasks
- [ ] Full security assessment
- [ ] Performance optimization review
- [ ] Dependency updates
- [ ] Disaster recovery testing

### Quarterly Tasks
- [ ] Architecture review
- [ ] Load testing with increased capacity
- [ ] Compliance audits
- [ ] Team knowledge updates

---

## 📈 SUCCESS METRICS

### Deployment Success Criteria
- **Uptime:** 99.9%+ during deployment window
- **Performance:** < 5% degradation from baseline
- **Errors:** Zero critical errors post-deployment
- **Monitoring:** All alerts functioning correctly

### Long-term Health Metrics
- **MTTR:** < 30 minutes for incidents
- **MTBF:** > 30 days between incidents
- **Test Coverage:** Maintain > 85%
- **Performance:** Continuous improvement

---

**Document Owner:** DevOps Team
**Review Cycle:** Monthly
**Last Reviewed:** 2026-01-01