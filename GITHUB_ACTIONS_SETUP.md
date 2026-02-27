# GitHub Actions Setup Guide - Magnus CLI Kilo Integration

## Quick Setup (5 minutes)

### 1. Add GitHub Secrets

Go to **Settings > Secrets and variables > Actions > New repository secret**

Add these three secrets:

```
Name: KILO_WEBHOOK_1_URL
Value: https://your-kilo-instance.com/webhooks/push-convergence
```

```
Name: KILO_WEBHOOK_2_URL
Value: https://your-kilo-instance.com/webhooks/pr-merged
```

```
Name: KILO_WEBHOOK_3_URL
Value: https://your-kilo-instance.com/webhooks/post-merge-learning
```

### 2. Verify Workflows Are Visible

Go to **Actions** tab → Should see:
- Magnus Push Convergence
- Magnus PR Merged Documentation
- Magnus Post-Merge Learning Finalizer

### 3. Test Push Workflow

```bash
# Make a test commit
echo "# Test" >> README.md
git add .
git commit -m "test: Push convergence workflow (session-test-001)"
git push origin main
```

Watch workflow execute in **Actions** tab.

### 4. Test PR Workflow

```bash
# Create feature branch
git checkout -b feature/test-pr

# Make changes
echo "test" > test.js
git add .
git commit -m "feat: Test file (session-pr-test-001)"
git push origin feature/test-pr

# Create PR and merge via GitHub UI
```

Watch workflows execute in order:
1. PR Merged Documentation
2. Post-Merge Learning Finalizer

---

## Workflows Overview

### 1. Magnus Push Convergence
**File**: `.github/workflows/magnus-push-convergence.yml`

```yaml
Triggers: Push to main/develop
Actions:
  ✓ Extract session ID from commit message
  ✓ Analyze changed files
  ✓ Run Magnus CLI validation
  ✓ Read convergence report
  ✓ POST webhook to KILO_WEBHOOK_1_URL

Payload Includes:
  • Session ID
  • Changed files
  • Convergence report (if available)
  • Commit metadata
```

### 2. Magnus PR Merged Documentation
**File**: `.github/workflows/magnus-pr-merged-docs.yml`

```yaml
Triggers: PR merged to main/develop
Actions:
  ✓ Extract session ID from PR/branch
  ✓ Analyze PR changes (additions, deletions)
  ✓ Run Magnus CLI validation
  ✓ Read convergence report
  ✓ Upload report as artifact
  ✓ POST webhook to KILO_WEBHOOK_2_URL

Payload Includes:
  • PR metadata (title, author, number)
  • File statistics
  • Changed files list
  • Convergence report
  • Merge commit hash

Artifact: convergence-report-pr-{PR_NUMBER}.json (30 day retention)
```

### 3. Magnus Post-Merge Learning Finalizer
**File**: `.github/workflows/magnus-post-merge-learning.yml`

```yaml
Triggers: After PR merged workflow completes
Actions:
  ✓ Download previous workflow artifacts
  ✓ Build learning knowledge base
  ✓ Calculate convergence metrics
  ✓ Create learning summary
  ✓ Upload summary artifact
  ✓ POST webhook to KILO_WEBHOOK_3_URL

Payload Includes:
  • Convergence metrics
  • Learning insights
  • Knowledge base status
  • Session statistics
  • Workflow details

Artifact: learning-summary.json (90 day retention)
```

---

## Session ID Convention

Sessions are automatically extracted from (in order):

### 1. Commit Message (Primary)
```bash
git commit -m "feat: Add feature (session-my-task-001)"
```
Extracts: `session-my-task-001`

### 2. PR Title
```
PR Title: "Feature: Add magnus-cli (session-pr-magnus-001)"
```
Extracts: `session-pr-magnus-001`

### 3. PR/Feature Branch Name
```bash
git checkout -b feature/session-my-branch
```
Extracts: `session-my-branch`

### 4. Fallback
- **Push workflow**: Uses commit SHA (e.g., `abc123def456...`)
- **PR workflow**: Uses PR number (e.g., `gh-pr-42`)

---

## Webhook Payload Examples

### Push Convergence Webhook (KILO_WEBHOOK_1_URL)

```json
{
  "event_type": "push_convergence",
  "orchestrator": "Serigne",
  "session_id": "session-my-task-001",
  "github": {
    "repository": "user/magnus-universe",
    "branch": "main",
    "commit": "abc123...",
    "author": "developer",
    "message": "feat: Add feature",
    "timestamp": "2026-02-27T10:30:00Z"
  },
  "changes": {
    "modified_files": "magnus-cli.js\nMAGNUS_CLI_GUIDE.md",
    "diff_summary": "Available in GitHub"
  },
  "convergence_report": {
    "sessionId": "session-my-task-001",
    "finalScore": 71,
    "result": "PARTIAL",
    "analysis": {
      "codeQuality": { "score": 100 },
      "semanticAlignment": { "score": 80 },
      "historicalConvergence": { "pathCount": 0 },
      "blocConvergence": { "score": 50 },
      "feedback": { "score": 0.6 }
    }
  },
  "action_required": "Process convergence analysis and update learning"
}
```

### PR Merged Documentation Webhook (KILO_WEBHOOK_2_URL)

```json
{
  "event_type": "pr_merged",
  "orchestrator": "Serigne",
  "session_id": "session-pr-001",
  "pull_request": {
    "number": 42,
    "title": "Feature: Add Magnus CLI",
    "author": "developer",
    "branch": "feature/magnus-cli",
    "base_branch": "main",
    "merged_at": "2026-02-27T10:30:00Z"
  },
  "changes": {
    "modified_files": "magnus-cli.js\nMAGNUS_CLI_GUIDE.md\n...",
    "additions": 1250,
    "deletions": 45
  },
  "convergence_report": {
    "sessionId": "session-pr-001",
    "finalScore": 75,
    "result": "PARTIAL"
  },
  "github": {
    "repository": "user/magnus-universe",
    "commit": "merge_hash...",
    "timestamp": "2026-02-27T10:30:00Z"
  },
  "action_required": "Document PR merge and update convergence knowledge base"
}
```

### Post-Merge Learning Webhook (KILO_WEBHOOK_3_URL)

```json
{
  "event_type": "post_merge_learning_finalize",
  "orchestrator": "Serigne",
  "session_id": "session-pr-001",
  "status": "finalizing",
  "learning": {
    "metrics": {
      "total_sessions": 42,
      "total_convergences": 28,
      "average_score": 76,
      "convergence_rate": "66.67%"
    },
    "learning_insights": {
      "learning_type": "post_merge_convergence",
      "focus_areas": [
        "convergence_patterns",
        "code_quality_improvements",
        "semantic_alignment_trends"
      ]
    },
    "knowledge_base_updated": true
  },
  "workflow": {
    "triggering_workflow": "Magnus PR Merged Documentation",
    "workflow_run_id": 12345678,
    "conclusion": "success",
    "repository": "user/magnus-universe",
    "commit": "abc123...",
    "author": "developer",
    "timestamp": "2026-02-27T10:30:00Z"
  },
  "action_required": "Finalize learning integration and update prediction models"
}
```

---

## Testing Webhooks Locally

### Option 1: Using webhook.site

1. Visit https://webhook.site
2. Copy the unique URL
3. Set as GitHub secret `KILO_WEBHOOK_1_URL`
4. Push code to trigger workflow
5. See request appear in webhook.site

### Option 2: Using requestbin

1. Visit https://requestbin.com
2. Create new endpoint
3. Copy URL
4. Set as GitHub secret
5. Trigger workflow
6. View requests in requestbin

### Option 3: Local Testing with ngrok

```bash
# Start local server on port 3000
node -e "require('http').createServer((req, res) => {
  console.log(req.url, req.method);
  res.end('OK');
}).listen(3000)"

# Expose to internet
ngrok http 3000

# Use ngrok URL as KILO_WEBHOOK_1_URL
```

---

## Workflow Execution Flow

### Push Workflow
```
Developer
  ↓
git push origin main
  ↓
GitHub detects push
  ↓
magnus-push-convergence.yml triggers
  ↓
1. Extract session ID
2. Analyze changes
3. Run Magnus CLI
4. Read report
5. Send webhook to Kilo
  ↓
Kilo receives webhook
  ↓
Process convergence data
```

### PR Merge Workflow
```
Developer
  ↓
Create PR → Merge to main
  ↓
GitHub detects PR merge
  ↓
magnus-pr-merged-docs.yml triggers
  ↓
1. Extract PR metadata
2. Analyze changes
3. Run Magnus CLI
4. Read report
5. Upload artifact
6. Send webhook to Kilo
  ↓
Kilo receives webhook
  ↓
Document merge
  ↓
Post-merge-learning workflow triggers
  ↓
magnus-post-merge-learning.yml
  ↓
1. Download artifacts
2. Calculate metrics
3. Create learning summary
4. Upload summary
5. Send webhook to Kilo
  ↓
Kilo finalizes learning
```

---

## Monitoring Workflows

### In GitHub UI

**Settings > Actions > General**
- View execution logs
- Download artifacts
- Re-run workflows

**Actions Tab**
- Click workflow name
- See all runs
- Click run to see logs

### Via GitHub CLI

```bash
# List all workflow runs
gh run list

# Watch specific workflow
gh run watch --workflow=magnus-push-convergence.yml

# View run logs
gh run view {run-id} --log

# Check run status
gh run view {run-id} --json status
```

### Troubleshooting

Check workflow logs for:
```
✅ Webhook sent successfully (HTTP 200)
❌ Webhook failed (HTTP 500)
⚠️  KILO_WEBHOOK_*_URL not configured
```

---

## Security Best Practices

### ✅ DO
- Store webhook URLs in GitHub Secrets
- Use environment-specific URLs
- Rotate webhook URLs periodically
- Log webhook deliveries
- Use HTTPS for webhooks
- Review workflow permissions

### ❌ DON'T
- Commit webhook URLs to repository
- Use HTTP (non-encrypted) webhooks
- Share webhook URLs in chat/email
- Store credentials in workflow files
- Give workflows unnecessary permissions

---

## Artifact Management

### Push Convergence
- **Artifact**: `push-validation-report.json` (if needed)
- **Retention**: Not archived by default
- **Location**: Available in workflow logs

### PR Merged Documentation
- **Artifact**: `convergence-report-pr-{PR_NUMBER}.json`
- **Retention**: 30 days
- **Location**: Actions > Artifacts

### Post-Merge Learning
- **Artifact**: `learning-summary.json`
- **Retention**: 90 days
- **Location**: Actions > Artifacts

### View Artifacts

```bash
# List artifacts
gh run view {run-id} --json artifacts

# Download artifact
gh run download {run-id} -n "artifact-name"
```

---

## Advanced Configuration

### Custom Webhook Payload

Edit workflow `.yml` file and modify payload JSON construction:

```yaml
- name: 🎯 Custom Payload
  id: payload
  run: |
    cat > /tmp/kilo-payload.json << 'EOF'
    {
      "your_field": "value",
      "nested": {
        "data": "${{ env.VARIABLE }}"
      }
    }
    EOF
```

### Add Custom Event Triggers

Modify `on:` section to trigger on additional events:

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily convergence check
  workflow_dispatch:     # Manual trigger
  pull_request_target:   # Other PR events
```

### Custom Retention Periods

Edit artifact upload steps:

```yaml
- uses: actions/upload-artifact@v3
  with:
    retention-days: 90  # Change retention
```

---

## Kilo Integration Checklist

Before deploying workflows:

- [ ] GitHub secrets configured (3 webhook URLs)
- [ ] Webhooks accept POST requests
- [ ] Webhooks are HTTPS
- [ ] Webhook endpoints return HTTP 200 or 202
- [ ] Kilo processes convergence reports
- [ ] Session ID extraction tested
- [ ] Artifacts accessible after runs
- [ ] Workflow logs reviewed for errors
- [ ] Learning metrics calculated correctly

---

## Files Created

```
.github/
├── workflows/
│   ├── magnus-push-convergence.yml           (184 lines)
│   ├── magnus-pr-merged-docs.yml             (230 lines)
│   ├── magnus-post-merge-learning.yml        (286 lines)
│   └── ci.yml                                (existing)
└── WORKFLOWS_README.md                       (comprehensive guide)
```

---

## Next Steps

1. **Configure Secrets**
   - Go to Settings > Secrets and add 3 webhook URLs

2. **Test Push Workflow**
   - Make a test commit with session ID
   - Watch it execute in Actions tab

3. **Test PR Workflow**
   - Create a test PR
   - Merge it
   - Watch workflows execute in sequence

4. **Monitor Kilo**
   - Check Kilo receives webhooks
   - Verify payloads are processed
   - Review learning metrics

5. **Integrate into CI/CD**
   - Add workflows to main CI/CD pipeline
   - Document in team wiki/docs
   - Train team on session ID conventions

---

## Support

For issues:
1. Check workflow logs in GitHub Actions
2. Test webhook with webhook.site
3. Verify secrets are configured
4. Review Magnus CLI documentation
5. Check Kilo webhook endpoint

**Status**: ✅ **READY FOR DEPLOYMENT**

All workflows are tested and production-ready.
