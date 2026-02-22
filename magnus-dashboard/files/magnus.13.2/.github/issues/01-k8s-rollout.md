Title: Production K8s Rollout

Owner: Claude Code

Description:
Finalize Kubernetes manifests, Helm charts, and deployment pipeline for staging→production promotion. Implement canary deployments and health checks.

Tasks:
- Finalize Helm charts and manifests
- Create staging environment and deploy services
- Implement canary deployment strategy and automated rollback
- Add readiness & liveness probes
- Validate service discovery and secrets management

Acceptance Criteria:
- Staging cluster runs all services
- Canary flows are automated with rollback
- Health checks return green under 100 concurrent users

Labels: infra, k8s, priority:high
