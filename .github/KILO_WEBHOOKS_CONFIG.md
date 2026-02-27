# Kilo Webhooks Configuration

Magnus CLI integrates with Kilo through 3 GitHub Actions webhooks.

## Quick Reference

| Workflow | Webhook Secret | Event | Purpose |
|----------|---|---|---|
| Push Convergence | `KILO_WEBHOOK_1_URL` | Push to main/develop | Real-time code validation |
| PR Merged Documentation | `KILO_WEBHOOK_2_URL` | PR merged | Document merge + convergence |
| Post-Merge Learning | `KILO_WEBHOOK_3_URL` | After PR merge workflow | Finalize learning |

## GitHub Secrets to Configure

### 1. KILO_WEBHOOK_1_URL
**Purpose**: Push convergence analysis
**Trigger**: Push to main/develop
**Payload**: Changed files + convergence report
**Expected Response**: HTTP 200/202

Example value:
```
https://kilo.example.com/api/webhooks/push-convergence
```

### 2. KILO_WEBHOOK_2_URL
**Purpose**: PR merge documentation
**Trigger**: PR merged
**Payload**: PR metadata + convergence report
**Expected Response**: HTTP 200/202
**Artifacts**: convergence-report-pr-{NUMBER}.json

Example value:
```
https://kilo.example.com/api/webhooks/pr-merged
```

### 3. KILO_WEBHOOK_3_URL
**Purpose**: Learning finalization
**Trigger**: Post-merge workflow completes
**Payload**: Learning metrics + knowledge base updates
**Expected Response**: HTTP 200/202
**Artifacts**: learning-summary.json

Example value:
```
https://kilo.example.com/api/webhooks/post-merge-learning
```

## Webhook Headers

All webhooks include standard headers:

```
Content-Type: application/json
User-Agent: GitHub-Hookshot/...
X-GitHub-Delivery: {UUID}
X-GitHub-Event: workflow_run
```

## Expected Kilo Behavior

### On KILO_WEBHOOK_1_URL (Push)
1. Receive push convergence data
2. Update real-time status
3. Notify connected agents
4. Store convergence metrics
5. Return HTTP 200/202

### On KILO_WEBHOOK_2_URL (PR Merge)
1. Receive PR metadata
2. Log merge event
3. Store convergence report
4. Update knowledge base
5. Trigger analysis agents
6. Return HTTP 200/202

### On KILO_WEBHOOK_3_URL (Learning)
1. Receive learning metrics
2. Update prediction models
3. Recalculate trends
4. Finalize session
5. Prepare for next cycle
6. Return HTTP 200/202

## Test Configuration

For testing, use webhook.site:

1. Go to https://webhook.site
2. Copy the unique URL
3. Add as GitHub secret:
   ```
   KILO_WEBHOOK_1_URL = https://webhook.site/unique-id
   ```
4. Trigger workflow (push code)
5. See request appear in webhook.site
6. Review payload structure
7. Verify all fields are present

## Payload Structure

Each webhook includes these root fields:

```json
{
  "event_type": "push_convergence|pr_merged|post_merge_learning_finalize",
  "orchestrator": "Serigne",
  "session_id": "session-xxx or gh-pr-xxx or commit-sha",
  "status": "success|finalizing|error",
  "github": {
    "repository": "org/repo",
    "branch": "main/develop",
    "commit": "hash",
    "author": "username",
    "timestamp": "ISO8601"
  },
  "convergence_report": { /* optional */ },
  "learning": { /* optional */ },
  "action_required": "Description of expected Kilo action"
}
```

## Error Handling

If webhook fails:

1. **HTTP 4xx errors**: Check payload validity
2. **HTTP 5xx errors**: Kilo endpoint issue
3. **Timeout (>30s)**: Network or processing issue
4. **Connection refused**: Endpoint not running

Workflows have `continue-on-error: true`, so failures don't block CI/CD.

Check GitHub Actions logs for webhook status:
```
✅ Webhook sent successfully (HTTP 200)
❌ Webhook failed (HTTP 500): error details
⚠️  KILO_WEBHOOK_*_URL not configured
```

## Security Considerations

### URL Storage
- ✅ Store in GitHub Secrets (encrypted)
- ❌ Never commit to repository
- ❌ Never share in plaintext

### Endpoint Security
- ✅ Use HTTPS only
- ✅ Implement authentication if needed
- ❌ Don't use HTTP (unencrypted)

### Payload Data
- ✅ Include minimal necessary data
- ✅ Sanitize sensitive information
- ❌ Don't include passwords/tokens

## Monitoring

Monitor webhook delivery in:
1. GitHub Actions logs
2. Kilo webhook logs
3. webhook.site (for testing)
4. Network monitoring tools

## Troubleshooting

### Webhook Not Being Called
1. Check workflow trigger conditions
2. Verify branch matches (main/develop)
3. Check file path filters
4. Review GitHub Actions permissions

### Webhook Called But Not Received
1. Verify URL is correct
2. Check endpoint is running
3. Test with curl:
   ```bash
   curl -X POST https://your-webhook-url \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```
4. Check firewall rules

### Webhook Received But Not Processed
1. Review Kilo webhook logs
2. Check payload structure
3. Verify session ID extraction
4. Check orchestrator value ("Serigne")

## Configuration Checklist

- [ ] Three webhook URLs obtained from Kilo
- [ ] KILO_WEBHOOK_1_URL configured as GitHub Secret
- [ ] KILO_WEBHOOK_2_URL configured as GitHub Secret
- [ ] KILO_WEBHOOK_3_URL configured as GitHub Secret
- [ ] Webhooks tested with test payload
- [ ] Kilo processing webhooks correctly
- [ ] Session IDs being extracted properly
- [ ] Learning metrics calculated
- [ ] Artifacts being archived

## Kilo Webhook Endpoints

Contact your Kilo administrator for these URLs:

```
KILO_WEBHOOK_1_URL = ?  (Push convergence)
KILO_WEBHOOK_2_URL = ?  (PR merged)
KILO_WEBHOOK_3_URL = ?  (Learning finalization)
```

Or if self-hosting Kilo:

```
KILO_WEBHOOK_1_URL = https://your-kilo/api/webhooks/push-convergence
KILO_WEBHOOK_2_URL = https://your-kilo/api/webhooks/pr-merged
KILO_WEBHOOK_3_URL = https://your-kilo/api/webhooks/post-merge-learning
```

---

**Created**: 2026-02-27
**Version**: 1.0.0
**Status**: ✅ Production Ready
