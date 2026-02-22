#!/usr/bin/env pwsh
# MAGNUS 15 - PR #5718 Low-Effort Monitor
# Run this periodically to check PR status

$prNumber = 5718
$repo = "Kilo-Org/kilocode"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "PR #5718 - STATUS MONITOR" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Get PR info
Write-Host "Fetching PR status..." -ForegroundColor Yellow
$prInfo = gh pr view $prNumber --repo $repo --json state,title,author,createdAt,updatedAt,mergeable --jq '.'
$state = gh pr view $prNumber --repo $repo --json state --jq '.state'
$title = gh pr view $prNumber --repo $repo --json title --jq '.title'
$author = gh pr view $prNumber --repo $repo --json author --jq '.author.login'
$created = gh pr view $prNumber --repo $repo --json createdAt --jq '.createdAt'
$updated = gh pr view $prNumber --repo $repo --json updatedAt --jq '.updatedAt'
$mergeable = gh pr view $prNumber --repo $repo --json mergeable --jq '.mergeable'

Write-Host "  State:     $state" -ForegroundColor $(if ($state -eq "OPEN") { "Green" } else { "Yellow" })
Write-Host "  Title:     $title"
Write-Host "  Author:    $author"
Write-Host "  Created:   $created"
Write-Host "  Updated:   $updated"
Write-Host "  Mergeable: $mergeable"
Write-Host ""

# Get reviews
Write-Host "Reviews:" -ForegroundColor Yellow
$reviews = gh pr view $prNumber --repo $repo --json reviews --jq '.reviews | length'
if ($reviews -eq "0") {
    Write-Host "  [NONE] No reviews yet" -ForegroundColor Gray
}
else {
    gh pr view $prNumber --repo $repo --json reviews --jq '.reviews[] | "  - \(.state) by \(.author.login): \(.body // "no comment")"'
}
Write-Host ""

# Get comments
Write-Host "Comments:" -ForegroundColor Yellow
$comments = gh pr view $prNumber --repo $repo --json comments --jq '.comments | length'
if ($comments -eq "1") {
    Write-Host "  [1] 1 comment (changeset-bot)" -ForegroundColor Gray
}
else {
    Write-Host "  [$comments] $comments comments"
}
Write-Host ""

# Check CI status
Write-Host "CI Status:" -ForegroundColor Yellow
$checks = gh pr checks $prNumber --repo $repo 2>$null | Select-Object -First 5
if ($checks) {
    $checks | ForEach-Object { Write-Host "  $_" }
}
else {
    Write-Host "  [UNKNOWN] No CI info available" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if ($state -eq "OPEN" -and $reviews -eq "0") {
    Write-Host "Status: AWAITING REVIEW" -ForegroundColor Yellow
    Write-Host "Actions:"
    Write-Host "  - Wait for maintainer feedback"
    Write-Host "  - Check back in 24-48 hours"
    Write-Host "  - Prepare responses using FEEDBACK-RESPONSE-STRATEGY.md"
}
elseif ($state -eq "MERGED") {
    Write-Host "Status: MERGED! 🎉" -ForegroundColor Green
    Write-Host "Actions:"
    Write-Host "  - Monitor production deployment"
    Write-Host "  - Track metrics (cost, latency)"
}
elseif ($state -eq "CLOSED") {
    Write-Host "Status: CLOSED" -ForegroundColor Red
    Write-Host "Actions:"
    Write-Host "  - Review feedback"
    Write-Host "  - Consider follow-up PR"
}
elseif ($reviews -gt "0") {
    Write-Host "Status: IN REVIEW" -ForegroundColor Green
    Write-Host "Actions:"
    Write-Host "  - Address feedback"
    Write-Host "  - Update based on comments"
}

Write-Host ""
Write-Host "Last checked: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')" -ForegroundColor Gray
Write-Host ""

# Quick actions menu
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "QUICK ACTIONS" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  [1] Open PR in browser"
Write-Host "  [2] Check file changes"
Write-Host "  [3] View full discussion"
Write-Host "  [4] Exit"
Write-Host ""
