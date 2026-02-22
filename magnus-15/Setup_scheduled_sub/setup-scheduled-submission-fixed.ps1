# MAGNUS 15 PR #1 - AUTOMATED SCHEDULED SUBMISSION
# Windows Task Scheduler Configuration

# ============================================================================
# SETUP: Automated PR Submission at FEB 6, 2026 @ 12:01 AM UTC
# ============================================================================

# This script sets up Windows Task Scheduler to automatically run the
# Magnus 15 PR submission at the exact launch time.

# ============================================================================
# STEP 1: Create the scheduled task runner script
# ============================================================================

# Create directory if needed
$ScriptDir = "C:\Users\diase\Magnus_Scripts"
if (-not (Test-Path $ScriptDir)) {
    New-Item -ItemType Directory -Path $ScriptDir -Force | Out-Null
}

# Create the PowerShell runner script
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
        Log-Message "ERROR: Magnus_PR.zip not found at `$MAGNUS_PR_ZIP" "ERROR"
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
    Log-Message "Stack trace: `(`$_.ScriptStackTrace)" "ERROR"
    exit 1
}

Log-Message "Automated submission process finished" "END"
Write-Host ""
Write-Host "============================================================"
Write-Host "Check log file: `$LOG_FILE"
Write-Host "============================================================"
"@

$ScriptContent | Out-File -FilePath $ScheduledScriptPath -Encoding UTF8
Write-Host "[OK] Created scheduled task runner: $ScheduledScriptPath"

# ============================================================================
# STEP 2: Create Windows Task Scheduler task
# ============================================================================

# Configuration
$TaskName = "Magnus15_PR1_AutomatedSubmission"
$TaskDescription = "Automated Magnus 15 PR #1 submission to Kilo Gateway at launch time"
$TaskScriptPath = $ScheduledScriptPath

# Create task trigger (one-time for FEB 6, 2026)
$Trigger = New-ScheduledTaskTrigger `
    -Once `
    -At "2026-02-06 00:01:00"

# Create task action
$Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -WindowStyle Normal -ExecutionPolicy RemoteSigned -File `"$TaskScriptPath`""

# Create task settings
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable

# Register the task
try {
    # First, try to remove existing task if it exists
    Unregister-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue -Confirm:$false
    
    # Register new task
    Register-ScheduledTask `
        -TaskName $TaskName `
        -Description $TaskDescription `
        -Trigger $Trigger `
        -Action $Action `
        -Settings $Settings `
        -RunLevel Highest `
        -Force
    
    Write-Host "[OK] Created scheduled task: $TaskName"
    Write-Host "      Scheduled for: February 6, 2026 @ 12:01 AM UTC"
    Write-Host "      Script: $TaskScriptPath"
}
catch {
    Write-Host "[ERROR] Failed to create scheduled task: $_"
    exit 1
}

# ============================================================================
# STEP 3: Create backup scheduler using alternative methods
# ============================================================================

# Method 2: Create a batch file backup scheduler
$BatchScriptPath = Join-Path $ScriptDir "run-pr-submission.bat"
$BatchContent = @"
@echo off
REM Magnus 15 PR #1 Automated Submission (Batch Backup)
REM Runs PowerShell script for PR submission

cd C:\Users\diase\Magnus_Scripts
powershell -NoProfile -ExecutionPolicy RemoteSigned -File "run-pr-submission.ps1"
pause
"@

$BatchContent | Out-File -FilePath $BatchScriptPath -Encoding ASCII
Write-Host "[OK] Created batch file backup: $BatchScriptPath"

# Method 3: Create a VBS script for silent execution
$VbsScriptPath = Join-Path $ScriptDir "run-pr-submission-silent.vbs"
$VbsContent = @"
' Magnus 15 PR #1 Automated Submission (VBS Silent)
Set objShell = CreateObject("WScript.Shell")
objShell.Run "powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File C:\Users\diase\Magnus_Scripts\run-pr-submission.ps1", 0, False
"@

$VbsContent | Out-File -FilePath $VbsScriptPath -Encoding ASCII
Write-Host "[OK] Created VBS script backup: $VbsScriptPath"

# ============================================================================
# STEP 4: Display scheduled task information
# ============================================================================

Write-Host ""
Write-Host "============================================================"
Write-Host "TASK SCHEDULER CONFIGURATION COMPLETE"
Write-Host "============================================================"
Write-Host ""

# Get and display task info
try {
    $Task = Get-ScheduledTask -TaskName $TaskName
    Write-Host "Task Name: $($Task.TaskName)"
    Write-Host "Status: $($Task.State)"
    Write-Host "Description: $($Task.Description)"
    Write-Host ""
    
    # Get trigger details
    $Trigger = $Task.Triggers[0]
    Write-Host "Trigger Details:"
    Write-Host "  Type: $($Trigger.CimClass.CimClassName)"
    Write-Host "  Date/Time: $($Trigger.StartBoundary)"
    Write-Host ""
    
    Write-Host "Execution:"
    Write-Host "  Script: $TaskScriptPath"
    Write-Host "  Log File: C:\Users\diase\Magnus_Scripts\submission-log.txt"
    Write-Host ""
    
    Write-Host "============================================================"
    Write-Host "AUTOMATED SUBMISSION READY"
    Write-Host "Will automatically run on: February 6, 2026 @ 12:01 AM UTC"
    Write-Host "============================================================"
    Write-Host ""
    
    Write-Host "Manual Execution Options:"
    Write-Host ""
    Write-Host "1. To run NOW (for testing):"
    Write-Host "   Start-ScheduledTask -TaskName '$TaskName'"
    Write-Host ""
    Write-Host "2. To view task status:"
    Write-Host "   Get-ScheduledTask -TaskName '$TaskName' | Get-ScheduledTaskInfo"
    Write-Host ""
    Write-Host "3. To disable task (if needed):"
    Write-Host "   Disable-ScheduledTask -TaskName '$TaskName'"
    Write-Host ""
    Write-Host "4. To remove task:"
    Write-Host "   Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"
}
catch {
    Write-Host "[WARNING] Could not retrieve task information: $_"
    Write-Host "[OK] Task may still be created successfully"
}
