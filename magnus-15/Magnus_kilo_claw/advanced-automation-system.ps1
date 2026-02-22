# MAGNUS 15 PR #1 - ADVANCED AUTOMATED SUBMISSION SYSTEM
# Complete automation with backup methods and monitoring

# This system includes:
# 1. Primary: Windows Task Scheduler (exact time trigger)
# 2. Backup 1: Countdown timer with auto-execution
# 3. Backup 2: Manual launch with pre-configured environment
# 4. Monitoring: Real-time status tracking and logging

# ============================================================================
# INSTALLATION & EXECUTION GUIDE
# ============================================================================

<#
STEP 1: Install the task scheduler (ONE TIME - Before Feb 6)
========================================================================
Run as Administrator:
    powershell -ExecutionPolicy RemoteSigned -File "setup-scheduled-submission.ps1"

This will:
  ✓ Create C:\Users\diase\Magnus_Scripts directory
  ✓ Create runner scripts (PowerShell, Batch, VBS)
  ✓ Register Windows Task for Feb 6, 2026 @ 12:01 AM UTC
  ✓ Create log file for monitoring

STEP 2: Verify the task (Optional but recommended)
========================================================================
    Get-ScheduledTask -TaskName "Magnus15_PR1_AutomatedSubmission"
    Get-ScheduledTaskInfo -TaskName "Magnus15_PR1_AutomatedSubmission"

STEP 3: Test the submission (Optional - do a day before)
========================================================================
    Start-ScheduledTask -TaskName "Magnus15_PR1_AutomatedSubmission"

This will execute the submission with a test trigger.

STEP 4: Monitor execution (On Feb 6)
========================================================================
    # Check if task ran
    Get-EventLog -LogName System -Source TaskScheduler -Newest 10
    
    # View submission log
    Get-Content "C:\Users\diase\Magnus_Scripts\submission-log.txt" -Tail 50

WHAT HAPPENS ON FEB 6, 12:01 AM UTC:
========================================================================
1. Windows Task Scheduler triggers automatically
2. PowerShell runner script executes
3. submit-magnus-pr1-kilo.ps1 launches
4. All steps automated:
   - Fork Kilo repo
   - Clone to local
   - Extract Magnus_PR.zip
   - Copy files
   - Run tests
   - Commit & push
   - Create PR
5. Log written to: C:\Users\diase\Magnus_Scripts\submission-log.txt
6. Browser opens to GitHub PR creation page
7. Final manual step: You click "Create pull request" on GitHub
#>

# ============================================================================
# BACKUP METHOD 1: Countdown Timer (For manual control)
# ============================================================================

# Save this as: C:\Users\diase\Magnus_Scripts\countdown-and-submit.ps1

$CountdownScript = @'
# Countdown Timer - Magnus 15 PR #1 Submission
# Monitors time until Feb 6, 2026 @ 12:01 AM UTC, then auto-executes

param(
    [string]$TargetTime = "2026-02-06 00:01:00",
    [string]$TimeZone = "UTC"
)

$LaunchTime = [DateTime]::Parse($TargetTime)
$ExecutionScript = "C:\Users\diase\Deploy_Magnus15_PR\submit-magnus-pr1-kilo.ps1"

Write-Host "════════════════════════════════════════════════════"
Write-Host "MAGNUS 15 PR #1 - COUNTDOWN TIMER"
Write-Host "════════════════════════════════════════════════════"
Write-Host "Target Launch: $LaunchTime UTC"
Write-Host "Execution Script: $ExecutionScript"
Write-Host ""

# Monitor countdown
while ($true) {
    $Now = [DateTime]::UtcNow
    $TimeRemaining = $LaunchTime - $Now
    
    if ($TimeRemaining.TotalSeconds -le 0) {
        Write-Host ""
        Write-Host "════════════════════════════════════════════════════"
        Write-Host "⏰ LAUNCH TIME REACHED! EXECUTING SUBMISSION..."
        Write-Host "════════════════════════════════════════════════════"
        Write-Host ""
        
        # Execute the submission script
        & powershell -ExecutionPolicy RemoteSigned -File $ExecutionScript
        
        Write-Host ""
        Write-Host "════════════════════════════════════════════════════"
        Write-Host "✓ SUBMISSION COMPLETED"
        Write-Host "════════════════════════════════════════════════════"
        break
    }
    
    # Display countdown
    $days = [int]$TimeRemaining.TotalDays
    $hours = [int]$TimeRemaining.Hours
    $minutes = [int]$TimeRemaining.Minutes
    $seconds = [int]$TimeRemaining.Seconds
    
    $status = "[$days days, $($hours.ToString('00')):$($minutes.ToString('00')):$($seconds.ToString('00'))] Waiting for launch..."
    Write-Host -NoNewline "`r$status"
    
    # Sleep for 1 second
    Start-Sleep -Seconds 1
}
'@

Set-Content -Path "C:\Users\diase\Magnus_Scripts\countdown-and-submit.ps1" -Value $CountdownScript
Write-Host "✓ Created countdown timer script"

# ============================================================================
# BACKUP METHOD 2: Monitoring Dashboard
# ============================================================================

# Save this as: C:\Users\diase\Magnus_Scripts\monitor-submission.ps1

$MonitorScript = @'
# Real-time monitoring of Magnus 15 PR submission
# Shows status, logs, and system information

param(
    [int]$RefreshIntervalSeconds = 5
)

function Show-Dashboard {
    Clear-Host
    
    Write-Host "════════════════════════════════════════════════════════════"
    Write-Host "MAGNUS 15 PR #1 - SUBMISSION MONITORING DASHBOARD"
    Write-Host "════════════════════════════════════════════════════════════"
    Write-Host "Last Updated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')"
    Write-Host ""
    
    # Task Status
    Write-Host "SCHEDULED TASK STATUS:"
    $Task = Get-ScheduledTask -TaskName "Magnus15_PR1_AutomatedSubmission" -ErrorAction SilentlyContinue
    if ($Task) {
        Write-Host "  Name: $($Task.TaskName)"
        Write-Host "  State: $($Task.State)"
        $Info = Get-ScheduledTaskInfo -Task $Task
        Write-Host "  Last Run: $($Info.LastRunTime)"
        Write-Host "  Last Result: $($Info.LastTaskResult)"
        Write-Host "  Next Run: $($Info.NextRunTime)"
    }
    else {
        Write-Host "  ✗ Task not found - may need setup"
    }
    Write-Host ""
    
    # Log File Status
    Write-Host "SUBMISSION LOG:"
    $LogFile = "C:\Users\diase\Magnus_Scripts\submission-log.txt"
    if (Test-Path $LogFile) {
        $LogContent = Get-Content $LogFile | Select-Object -Last 10
        foreach ($Line in $LogContent) {
            Write-Host "  $Line"
        }
        Write-Host ""
        Write-Host "  Total log lines: $(Get-Content $LogFile | Measure-Object -Line | Select-Object -ExpandProperty Lines)"
    }
    else {
        Write-Host "  (No log yet)"
    }
    Write-Host ""
    
    # File Verification
    Write-Host "FILE VERIFICATION:"
    $Files = @(
        "C:\Users\diase\magnus-workspace\pr-1-deployment\Magnus_PR.zip",
        "C:\Users\diase\Deploy_Magnus15_PR\submit-magnus-pr1-kilo.ps1",
        "C:\Users\diase\Magnus_Scripts\run-pr-submission.ps1"
    )
    
    foreach ($File in $Files) {
        if (Test-Path $File) {
            $Size = (Get-Item $File).Length / 1KB
            Write-Host "  ✓ $File ($([math]::Round($Size))KB)"
        }
        else {
            Write-Host "  ✗ $File (NOT FOUND)"
        }
    }
    Write-Host ""
    
    # System Status
    Write-Host "SYSTEM STATUS:"
    Write-Host "  PowerShell Version: $($PSVersionTable.PSVersion)"
    Write-Host "  OS: $(Get-WmiObject win32_operatingsystem | Select-Object -ExpandProperty Caption)"
    Write-Host "  Internet: $(Test-Connection 8.8.8.8 -Count 1 -Quiet ? 'Connected' : 'Offline')"
    Write-Host "  Git Available: $(Get-Command git -ErrorAction SilentlyContinue ? 'Yes' : 'No')"
    Write-Host ""
    
    Write-Host "════════════════════════════════════════════════════════════"
    Write-Host "Refreshing every $RefreshIntervalSeconds seconds... (Press Ctrl+C to stop)"
    Write-Host "════════════════════════════════════════════════════════════"
}

# Main monitoring loop
while ($true) {
    Show-Dashboard
    Start-Sleep -Seconds $RefreshIntervalSeconds
}
'@

Set-Content -Path "C:\Users\diase\Magnus_Scripts\monitor-submission.ps1" -Value $MonitorScript
Write-Host "✓ Created monitoring dashboard"

# ============================================================================
# BACKUP METHOD 3: Emergency Manual Launch
# ============================================================================

# Save this as: C:\Users\diase\Magnus_Scripts\launch-now.ps1

$EmergencyScript = @'
# Emergency Manual Launch Script
# Use this if scheduled task fails for any reason

Write-Host "════════════════════════════════════════════════════"
Write-Host "MAGNUS 15 PR #1 - EMERGENCY MANUAL LAUNCH"
Write-Host "════════════════════════════════════════════════════"
Write-Host ""

$Response = Read-Host "Launch Magnus 15 PR submission NOW? (yes/no)"

if ($Response -eq "yes") {
    Write-Host ""
    Write-Host "Launching submission script..."
    Write-Host ""
    
    & powershell -ExecutionPolicy RemoteSigned -File "C:\Users\diase\Deploy_Magnus15_PR\submit-magnus-pr1-kilo.ps1"
}
else {
    Write-Host "Launch cancelled."
}
'@

Set-Content -Path "C:\Users\diase\Magnus_Scripts\launch-now.ps1" -Value $EmergencyScript
Write-Host "✓ Created emergency launch script"

# ============================================================================
# CREATE COMPLETE AUTOMATION GUIDE
# ============================================================================

$GuideContent = @'
# MAGNUS 15 PR #1 - AUTOMATED SUBMISSION GUIDE

## Quick Start

### Option 1: Automatic (Recommended)
1. Run ONCE before Feb 6:
   ```powershell
   powershell -ExecutionPolicy RemoteSigned -File "setup-scheduled-submission.ps1"
   ```
2. On Feb 6 @ 12:01 AM UTC: Automatic execution
3. Monitor with:
   ```powershell
   powershell -File "monitor-submission.ps1"
   ```

### Option 2: Countdown Timer
```powershell
powershell -File "countdown-and-submit.ps1"
```
This displays countdown and auto-executes at launch time.

### Option 3: Manual Emergency
```powershell
powershell -File "launch-now.ps1"
```
Use if scheduled task fails.

## What Gets Automated

✓ Fork Kilo repository
✓ Clone to local machine
✓ Create feature branch
✓ Extract Magnus_PR.zip
✓ Copy all files to correct locations
✓ Run npm tests
✓ Commit all changes
✓ Push to fork
✓ Open GitHub PR creation page
✓ Log all steps for monitoring

## What Requires Manual Intervention

1. GitHub PR Creation (final step)
   - Browser will open automatically
   - Fill title and description
   - Click "Create pull request"
   - Done!

## Monitoring

Check logs:
```
Get-Content "C:\Users\diase\Magnus_Scripts\submission-log.txt" -Tail 50
```

View task status:
```
Get-ScheduledTask -TaskName "Magnus15_PR1_AutomatedSubmission"
Get-ScheduledTaskInfo -TaskName "Magnus15_PR1_AutomatedSubmission"
```

## Troubleshooting

If task doesn't run at scheduled time:
1. Check system clock (must be accurate)
2. Ensure computer is powered on at 12:01 AM UTC
3. Manually launch: `powershell -File "launch-now.ps1"`
4. Check Windows Event Viewer for Task Scheduler errors

## Files Created

- `run-pr-submission.ps1` - Main execution script
- `run-pr-submission.bat` - Batch backup
- `run-pr-submission-silent.vbs` - VBS silent backup
- `countdown-and-submit.ps1` - Countdown timer
- `monitor-submission.ps1` - Status monitor
- `launch-now.ps1` - Emergency manual launch
- `submission-log.txt` - Execution log
- Windows Task: "Magnus15_PR1_AutomatedSubmission"

## Final Result

✓ Feb 6, 2026 @ 12:01 AM UTC: Automation triggers
✓ ~4 hours: All steps execute automatically
✓ ~4:00 AM: PR creation page opens in browser
✓ You click 3 buttons on GitHub
✓ PR #1 SUBMITTED! 🎉
'@

Set-Content -Path "C:\Users\diase\Magnus_Scripts\AUTOMATION_GUIDE.md" -Value $GuideContent
Write-Host "✓ Created automation guide"

# ============================================================================
# FINAL SETUP SUMMARY
# ============================================================================

Write-Host ""
Write-Host "════════════════════════════════════════════════════"
Write-Host "AUTOMATION SYSTEM SETUP COMPLETE"
Write-Host "════════════════════════════════════════════════════"
Write-Host ""
Write-Host "Scripts Created:"
Write-Host "  ✓ countdown-and-submit.ps1"
Write-Host "  ✓ monitor-submission.ps1"
Write-Host "  ✓ launch-now.ps1"
Write-Host "  ✓ AUTOMATION_GUIDE.md"
Write-Host ""
Write-Host "Location: C:\Users\diase\Magnus_Scripts\"
Write-Host ""
Write-Host "Next Steps:"
Write-Host "  1. Run: powershell -ExecutionPolicy RemoteSigned -File 'setup-scheduled-submission.ps1'"
Write-Host "  2. On Feb 6: Wait for automatic execution at 12:01 AM UTC"
Write-Host "  3. Monitor: powershell -File 'monitor-submission.ps1'"
Write-Host "  4. Manual: powershell -File 'launch-now.ps1' (if needed)"
Write-Host ""
Write-Host "════════════════════════════════════════════════════"
