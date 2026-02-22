# MAGNUS 15 PR #1 - AUTOMATED SCHEDULED SUBMISSION (Admin Version)
# Windows Task Scheduler Configuration

# ============================================================================
# SETUP: Automated PR Submission at FEB 6, 2026 @ 12:01 AM UTC
# ============================================================================

# IMPORTANT: This script requires Administrator privileges
# Run PowerShell as Administrator

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "MAGNUS 15 PR #1 - SCHEDULED SUBMISSION SETUP" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "[WARNING] This script requires Administrator privileges" -ForegroundColor Yellow
    Write-Host "Please run PowerShell as Administrator and re-run this script" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative: Use the backup batch file method below" -ForegroundColor Yellow
    exit 1
}

# Create directory if needed
$ScriptDir = "C:\Users\diase\Magnus_Scripts"
if (-not (Test-Path $ScriptDir)) {
    New-Item -ItemType Directory -Path $ScriptDir -Force | Out-Null
}

# ============================================================================
# STEP 1: Create the scheduled task runner script
# ============================================================================

$ScheduledScriptPath = Join-Path $ScriptDir "run-pr-submission.ps1"

$ScriptContent = @"
# Automated Magnus 15 PR Submission Script
# Runs at: February 6, 2026, 12:01 AM UTC
# GitHub User: fullmeo

Write-Host "============================================================"
Write-Host "MAGNUS 15 PR #1 - AUTOMATED SUBMISSION INITIATED"
Write-Host "============================================================"
Write-Host "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')"
Write-Host ""

# Configuration
`$MAGNUS_PR_ZIP = "C:\Users\diase\magnus-workspace\pr-1-deployment\Magnus_PR.zip"
`$DEPLOY_SCRIPT = "C:\Users\diase\Deploy_Magnus15_PR\submit-magnus-pr1-kilo.ps1"
`$LOG_FILE = "C:\Users\diase\Magnus_Scripts\submission-log.txt"

# Logging function
function Log-Message {
    param([string]`$Message, [string]`$Level = "INFO")
    `$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    `$logEntry = "[`$timestamp] [`$Level] `$Message"
    Write-Host `$logEntry
    Add-Content -Path `$LOG_FILE -Value `$logEntry
}

# Start logging
Log-Message "Automated submission process started" "START"

try {
    # Verify prerequisites
    Log-Message "Verifying prerequisites..."
    
    if (-not (Test-Path `$MAGNUS_PR_ZIP)) {
        Log-Message "ERROR: Magnus_PR.zip not found" "ERROR"
        exit 1
    }
    Log-Message "[OK] Magnus_PR.zip verified"
    
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Log-Message "ERROR: Git not found in PATH" "ERROR"
        exit 1
    }
    Log-Message "[OK] Git verified"
    
    # Run the main deployment script
    Log-Message "Launching deployment script..." "ACTION"
    & powershell -ExecutionPolicy RemoteSigned -File `$DEPLOY_SCRIPT
    
    `$exitCode = `$LASTEXITCODE
    
    if (`$exitCode -eq 0) {
        Log-Message "Deployment script completed successfully" "SUCCESS"
        Log-Message "PR submission process COMPLETED" "SUCCESS"
    }
    else {
        Log-Message "Deployment script exited with code: `$exitCode" "WARNING"
    }
}
catch {
    Log-Message "EXCEPTION: `$_" "ERROR"
    exit 1
}

Log-Message "Automated submission process finished" "END"
Write-Host ""
Write-Host "============================================================"
Write-Host "Check log file: `$LOG_FILE"
Write-Host "============================================================"
"@

$ScriptContent | Out-File -FilePath $ScheduledScriptPath -Encoding UTF8
Write-Host "[OK] Created scheduled task runner: $ScheduledScriptPath" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 2: Create Windows Task Scheduler task using schtasks.exe
# ============================================================================

$TaskName = "Magnus15_PR1_AutomatedSubmission"
$TaskRun = "powershell.exe -NoProfile -WindowStyle Normal -ExecutionPolicy RemoteSigned -File `"$ScheduledScriptPath`""

Write-Host "[INFO] Creating scheduled task..." -ForegroundColor Cyan

# Delete existing task if present
schtasks.exe /Delete /TN $TaskName /F 2>$null

# Create new task
$createResult = schtasks.exe /Create `
    /TN $TaskName `
    /TR $TaskRun `
    /SC ONCE `
    /ST 00:01 `
    /SD 02/06/2026 `
    /RL HIGHEST `
    /F

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Created scheduled task: $TaskName" -ForegroundColor Green
    Write-Host "      Scheduled for: February 6, 2026 @ 12:01 AM UTC" -ForegroundColor Green
}
else {
    Write-Host "[WARNING] Task creation returned: $createResult" -ForegroundColor Yellow
}

# ============================================================================
# STEP 3: Create backup scripts
# ============================================================================

# Batch file backup
$BatchScriptPath = Join-Path $ScriptDir "run-pr-submission.bat"
$BatchContent = @"
@echo off
REM Magnus 15 PR #1 Automated Submission (Batch Backup)

cd C:\Users\diase\Magnus_Scripts
powershell -NoProfile -ExecutionPolicy RemoteSigned -File "run-pr-submission.ps1"
pause
"@
$BatchContent | Out-File -FilePath $BatchScriptPath -Encoding ASCII
Write-Host "[OK] Created batch file backup: $BatchScriptPath" -ForegroundColor Green

# VBS silent execution
$VbsScriptPath = Join-Path $ScriptDir "run-pr-submission-silent.vbs"
$VbsContent = @"
' Magnus 15 PR #1 Automated Submission (VBS Silent)
Set objShell = CreateObject("WScript.Shell")
objShell.Run "powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File C:\Users\diase\Magnus_Scripts\run-pr-submission.ps1", 0, False
"@
$VbsScriptPath | Out-File -FilePath $VbsScriptPath -Encoding ASCII
Write-Host "[OK] Created VBS script backup: $VbsScriptPath" -ForegroundColor Green

# ============================================================================
# STEP 4: Display summary
# ============================================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "SCHEDULED SUBMISSION READY" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Scheduled Task:" -ForegroundColor White
Write-Host "  Name: Magnus15_PR1_AutomatedSubmission" -ForegroundColor White
Write-Host "  Time: February 6, 2026 @ 12:01 AM UTC" -ForegroundColor White
Write-Host ""
Write-Host "Backup Methods:" -ForegroundColor White
Write-Host "  1. Batch: C:\Users\diase\Magnus_Scripts\run-pr-submission.bat" -ForegroundColor White
Write-Host "  2. VBS: C:\Users\diase\Magnus_Scripts\run-pr-submission-silent.vbs" -ForegroundColor White
Write-Host ""
Write-Host "To verify task:" -ForegroundColor Yellow
Write-Host "  schtasks /query /tn Magnus15_PR1_AutomatedSubmission" -ForegroundColor Yellow
Write-Host ""
Write-Host "To run manually (as admin):" -ForegroundColor Yellow
Write-Host "  schtasks /run /tn Magnus15_PR1_AutomatedSubmission" -ForegroundColor Yellow
Write-Host ""
