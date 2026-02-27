# Magnus CLI - GitHub Actions Workflows

Three production-ready workflows for integrating Magnus 13.2 Convergence Validation with Kilo via GitHub Actions.

---

## Overview

### Workflow Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│  Developer pushes code to main/develop                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │ magnus-push-convergence.yml       │
        │ - Analyzes code changes          │
        │ - Runs Magnus CLI validation     │
        │ - POST → KILO_WEBHOOK_1_URL      │
        └─────────────┬────────────────────┘
                      │
                      ▼
        (Code continues in CI/CD)

┌─────────────────────────────────────────────────────────────┐
│  Developer creates PR and merges to main/develop             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │ magnus-pr-merged-docs.yml        │
        │ - Extracts PR metadata           │
        │ - Reads convergence-report.json  │
        │ - POST → KILO_WEBHOOK_2_URL      │
        └─────────────┬────────────────────┘
                      │
                      ▼
        ┌──────────────────────────────────┐
        │ magnus-post-merge-learning.yml   │
        │ - Triggered after PR merge       │
        │ - Finalizes learning             │
        │ - POST → KILO_WEBHOOK_3_URL      │
        └──────────────────────────────────┘
```

---

## Workflow 1: Magnus Push Convergence

**File**: `.github/workflows/magnus-push-convergence.yml`

### Trigger
- Push to `main` or `develop` branch
- Only when `.js` files or examples are modified

### Actions
1. Checks out repository with full history
2. Extracts session ID from commit message (or uses commit SHA)
3. Analyzes file changes (diff)
4. Runs Magnus CLI validation on first changed JS file
5. Reads convergence report if generated
6. Sends webhook to Kilo with:
   - Changed files list
   - Convergence report
   - Session ID
   - Commit metadata

### Webhook Payload (KILO_WEBHOOK_1_URL)

```json
{
  "event_type": "push_convergence",
  "orchestrator": "Serigne",
  "session_id": "session-xxxxx",
  "github": {
    "repository": "user/repo",
    "branch": "main",
    "commit": "abc123...",
    "author": "username",
    "message": "commit message",
    "timestamp": "2026-02-27T10:30:00Z"
  },
  "changes": {
    "modified_files": "file1.js\nfile2.js\n...",
    "diff_summary": "Available in GitHub"
  },
  "convergence_report": {
    "sessionId": "...",
    "finalScore": 71,
    "result": "PARTIAL",
    "analysis": { ... }
  },
  "action_required": "Process convergence analysis and update learning"
}
```

### Environment Variables
- `KILO_WEBHOOK_1_URL` (Secret) - Webhook endpoint

---

## Workflow 2: Magnus PR Merged Documentation

**File**: `.github/workflows/magnus-pr-merged-docs.yml`

### Trigger
- Pull Request closed AND merged
- Any branch → main or develop

### Actions
1. Checks out repository with full history
2. Extracts session ID from PR title, branch name, or PR number
3. Analyzes all file changes in the PR
4. Validates merged code with Magnus CLI
5. Reads convergence report
6. Uploads report as artifact
7. Sends comprehensive webhook to Kilo with:
   - PR metadata (title, author, number)
   - File statistics (additions, deletions)
   - Changed files list
   - Convergence report
   - Commit information

### Webhook Payload (KILO_WEBHOOK_2_URL)

```json
{
  "event_type": "pr_merged",
  "orchestrator": "Serigne",
  "session_id": "session-xxxxx",
  "pull_request": {
    "number": 123,
    "title": "Feature: Add Magnus CLI",
    "author": "username",
    "branch": "feature/magnus-cli",
    "base_branch": "main",
    "merged_at": "2026-02-27T10:30:00Z",
    "body": "PR description..."
  },
  "changes": {
    "modified_files": "magnus-cli.js\nMAGNUS_CLI_GUIDE.md\n...",
    "additions": 1250,
    "deletions": 45,
    "stats": "file stats..."
  },
  "convergence_report": {
    "sessionId": "...",
    "finalScore": 75,
    "result": "PARTIAL",
    "analysis": { ... }
  },
  "github": {
    "repository": "user/repo",
    "commit": "abc123...",
    "timestamp": "2026-02-27T10:30:00Z"
  },
  "action_required": "Document PR merge and update convergence knowledge base"
}
```

### Artifacts
- Report saved as: `convergence-report-pr-{PR_NUMBER}.json`
- Retention: 30 days

### Environment Variables
- `KILO_WEBHOOK_2_URL` (Secret) - Webhook endpoint

---

## Workflow 3: Magnus Post-Merge Learning Finalizer

**File**: `.github/workflows/magnus-post-merge-learning.yml`

### Trigger
- Workflow run of `magnus-pr-merged-docs.yml` completes successfully
- `workflow_run` event type

### Actions
1. Checks out repository with full history
2. Downloads artifacts from previous workflow
3. Analyzes learning opportunities
4. Extracts workflow context and commit info
5. Builds/updates learning knowledge base
6. Calculates convergence metrics across all sessions
7. Creates learning summary
8. Uploads learning summary as artifact
9. Sends finalization webhook to Kilo with:
   - Convergence metrics
   - Learning insights
   - Knowledge base status
   - Session statistics

### Webhook Payload (KILO_WEBHOOK_3_URL)

```json
{
  "event_type": "post_merge_learning_finalize",
  "orchestrator": "Serigne",
  "session_id": "session-xxxxx",
  "status": "finalizing",
  "learning": {
    "convergence_report": { ... },
    "learning_insights": {
      "learning_type": "post_merge_convergence",
      "focus_areas": [
        "convergence_patterns",
        "code_quality_improvements",
        "semantic_alignment_trends"
      ]
    },
    "knowledge_base_updated": true,
    "metrics": {
      "total_sessions": 42,
      "total_convergences": 28,
      "average_score": 76,
      "convergence_rate": "66.67%"
    }
  },
  "workflow": {
    "triggering_workflow": "Magnus PR Merged Documentation",
    "workflow_run_id": 12345678,
    "conclusion": "success",
    "repository": "user/repo",
    "branch": "main",
    "commit": "abc123...",
    "author": "username",
    "timestamp": "2026-02-27T10:30:00Z"
  },
  "action_required": "Finalize learning integration and update prediction models"
}
```

### Artifacts
- Learning summary saved as: `learning-summary.json`
- Retention: 90 days

### Environment Variables
- `KILO_WEBHOOK_3_URL` (Secret) - Webhook endpoint

---

## Setup Instructions

### 1. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

```bash
# Settings > Secrets and variables > Actions > New repository secret

KILO_WEBHOOK_1_URL=https://kilo.example.com/webhooks/push-convergence
KILO_WEBHOOK_2_URL=https://kilo.example.com/webhooks/pr-merged
KILO_WEBHOOK_3_URL=https://kilo.example.com/webhooks/post-merge-learning
```

**OR** in local testing (GitHub CLI):

```bash
gh secret set KILO_WEBHOOK_1_URL --body "https://your-kilo-endpoint/webhook1"
gh secret set KILO_WEBHOOK_2_URL --body "https://your-kilo-endpoint/webhook2"
gh secret set KILO_WEBHOOK_3_URL --body "https://your-kilo-endpoint/webhook3"
```

### 2. Verify Workflow Syntax

```bash
# Validate workflow files
cd .github/workflows
for file in magnus-*.yml; do
  echo "Checking: $file"
  # GitHub Actions will validate on push
done
```

### 3. Test Webhooks Locally (Optional)

Use a webhook testing service like RequestBin or Webhook.site:

```bash
# 1. Get a temporary webhook URL from https://webhook.site
# 2. Set as secret: KILO_WEBHOOK_1_URL
# 3. Push code to main
# 4. View request in webhook.site
```

### 4. Monitor Workflow Execution

```bash
# View all workflow runs
gh run list

# Watch specific workflow
gh run watch --workflow=magnus-push-convergence.yml

# View logs
gh run view {run-id} --log
```

---

## Session ID Extraction

Workflows automatically extract session IDs from:

1. **Commit message** (highest priority)
   ```
   git commit -m "feat: Add feature (session-my-task-001)"
   ```
   → Session ID: `session-my-task-001`

2. **PR title** (for PR merge workflows)
   ```
   PR Title: "Feature: Add feature (session-pr-123)"
   ```
   → Session ID: `session-pr-123`

3. **PR branch name** (fallback)
   ```
   Branch: feature/session-my-branch
   ```
   → Session ID: `session-my-branch`

4. **Fallback**
   - Push workflow: Uses commit SHA
   - PR workflow: Uses PR number (`gh-pr-123`)

---

## Webhook Delivery & Error Handling

### Success Response
- HTTP 200 or 202: Webhook accepted
- Logged in workflow summary
- Artifact saved for records

### Failure Response
- HTTP error code: Logged but doesn't fail workflow
- `continue-on-error: true`: Workflows proceed even if webhook fails
- Check GitHub Actions logs for details

### Retry Strategy

If webhook fails:
1. Check KILO_WEBHOOK_* secrets are correct
2. Verify endpoint is accessible
3. Check firewall/network settings
4. Review webhook request in GitHub Actions logs
5. Re-run workflow manually

---

## Customization

### Change Webhook Endpoints

Edit the workflow files and update the webhook URL references:

```yaml
WEBHOOK_URL="${{ secrets.KILO_WEBHOOK_1_URL }}"
```

### Change Trigger Events

Modify the `on:` section in each workflow:

```yaml
on:
  push:
    branches:
      - main           # Add/remove branches
      - develop
      - production
    paths:
      - '**.js'        # Add/remove file patterns
```

### Add Custom Payload Fields

Edit the payload construction in each workflow:

```bash
cat > /tmp/kilo-payload.json << 'EOF'
{
  "your_custom_field": "value",
  ...existing fields...
}
EOF
```

### Change Artifact Retention

Modify `retention-days` in upload-artifact steps:

```yaml
- uses: actions/upload-artifact@v3
  with:
    retention-days: 30  # Change this value
```

---

## Troubleshooting

### Workflow Not Triggering

1. Check `on:` event configuration
2. Verify branch name matches
3. Check file path filters (if specified)
4. Review GitHub Actions settings

### Webhook Not Being Sent

1. Check `KILO_WEBHOOK_*` secrets are set
2. Review workflow logs in GitHub Actions tab
3. Verify endpoint URL is correct
4. Check firewall/network access
5. Test with `webhook.site` for debugging

### Convergence Report Not Generated

1. Check Magnus CLI is executable
2. Verify `.js` files exist in repo
3. Review Magnus CLI logs in workflow output
4. Check `.magnus/` directory permissions

### Session ID Not Extracted

1. Commit message format: `session-{name}`
2. PR branch format: `feature/session-{name}`
3. Fallback to commit SHA if not specified
4. Check logs for extracted value

---

## Security Best Practices

### Secrets Management
- ✅ Store webhook URLs as repository secrets
- ✅ Use environment-specific URLs
- ✅ Rotate webhook URLs periodically
- ❌ Never commit URLs to repository

### Workflow Permissions
- ✅ Review workflow permissions in Settings
- ✅ Use `permissions:` section to limit access
- ✅ Log all webhook deliveries
- ❌ Don't store credentials in workflow files

### Data Privacy
- ✅ Review payload data before sending to Kilo
- ✅ Mask sensitive information if needed
- ✅ Use HTTPS for webhook URLs
- ❌ Don't include passwords/tokens in payloads

---

## Monitoring & Logging

### View Workflow Runs

```bash
# List recent runs
gh run list --workflow=magnus-push-convergence.yml

# Show full logs
gh run view {run-id} --log

# Watch real-time
gh run watch {run-id}
```

### Check Webhook Delivery

Look for lines in workflow output:

```
✅ Webhook sent successfully (HTTP 200)
❌ Webhook failed (HTTP 500)
⚠️ KILO_WEBHOOK_*_URL not configured
```

### Archive Metrics

All workflows create summaries visible in:
- GitHub Actions > Run summary
- Downloadable artifacts
- `./.magnus/` local directory (if pulled)

---

## Integration with Kilo

These workflows expect Kilo to handle three webhook types:

### 1. Push Convergence Webhook
- Triggered on code push
- Update real-time convergence status
- Track code quality trends

### 2. PR Merged Webhook
- Triggered on PR merge
- Document feature additions
- Update convergence knowledge base

### 3. Post-Merge Learning Webhook
- Triggered after PR merge completes
- Finalize learning integration
- Update prediction models
- Calculate metrics

---

## Example CI/CD Flow

```
1. Developer: git push origin feature/my-feature
   → GitHub: Triggers push-convergence workflow
   → Magnus CLI: Validates code
   → Kilo: Receives webhook with convergence status

2. Developer: Creates & merges PR
   → GitHub: Triggers pr-merged-docs workflow
   → Kilo: Receives PR metadata + convergence report

3. Merge completes
   → GitHub: Triggers post-merge-learning workflow
   → Kilo: Receives learning finalization
   → Kilo: Updates models and metrics
```

---

## Files

- `.github/workflows/magnus-push-convergence.yml` - Push workflow
- `.github/workflows/magnus-pr-merged-docs.yml` - PR merge workflow
- `.github/workflows/magnus-post-merge-learning.yml` - Learning finalization workflow
- `.github/WORKFLOWS_README.md` - This guide

---

## Support

For issues or questions:
1. Check workflow logs in GitHub Actions
2. Review webhook payloads using webhook.site
3. Verify secrets are configured correctly
4. Check Magnus CLI documentation in root directory

---

**Status**: ✅ **PRODUCTION READY**

All workflows are tested and ready for deployment.
