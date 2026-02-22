Title: CI / Regression Automation Hardening

Owner: Kilo

Description:
Harden CI pipelines, implement nightly regression runs, isolate flaky tests, and provide auto-fail alerts.

Tasks:
- Add nightly regression job
- Implement flaky-test detection & quarantine
- Integrate notifications (Slack/email)
- Ensure artifacts and logs persisted for failed runs

Acceptance Criteria:
- Nightly regression runs with pass/fail reports
- Flaky test rate <1%

Labels: ci, tests, priority:high
