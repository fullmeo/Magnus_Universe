# 🚨 CRITICAL PRE-LAUNCH CHECKLIST

**Status**: ⚠️ **THREE CRITICAL ITEMS MUST BE COMPLETED BEFORE FEB 6**  
**Deadline**: **TODAY (February 5, 2026)**  
**Failure to complete**: Automation will fail tomorrow  

---

## ⚠️ CRITICAL ITEM #1: FORK THE REPOSITORY

### ❌ What the script DOES NOT do:
- Create a fork on GitHub
- Convert your GitHub account to "fullmeo"
- Set up your GitHub credentials

### ✅ What YOU must do MANUALLY:

**Step 1: Go to GitHub**
```
https://github.com/Kilo-Org/kilo-gateway
```

**Step 2: Click the "Fork" button**
- Top right corner
- Creates: `https://github.com/fullmeo/kilo-gateway`
- Takes ~30 seconds

**Step 3: Verify the fork**
```
https://github.com/fullmeo/kilo-gateway
```
- Should show your fork
- Should show "forked from Kilo-Org/kilo-gateway"

### ❌ If you don't fork:
```
When script runs:
  git clone https://github.com/fullmeo/kilo-gateway.git
  ERROR: Repository not found
  FAILURE: Script exits
```

### ✅ Verification:
```powershell
# Test the clone URL
git clone https://github.com/fullmeo/kilo-gateway.git C:\test-clone

# If successful: Clone completes
# If failed: "Repository not found" or "404"
```

---

## ⚠️ CRITICAL ITEM #2: TIMEZONE CONFIGURATION

### ❌ WRONG UNDERSTANDING:
> "Script scheduled for 12:01 AM UTC on Feb 6"

**REALITY**: Windows Task Scheduler uses **LOCAL TIME**, not UTC!

### ✅ CORRECT UNDERSTANDING:

**Windows Task scheduled for**: `2026-02-06 00:01:00`
**This is**: Your LOCAL time zone
**NOT UTC** (unless your machine is set to UTC)

### 🌍 TIMEZONE MAPPING

Your location: **Paris, Île-de-France, FR**
Your timezone: **CET (Central European Time)**
UTC offset: **UTC+1** (in February, winter time)

**When Windows Task fires at 00:01 LOCAL:**
```
Windows: 2026-02-06 00:01:00 CET (Paris time)
         ↓ (convert to UTC)
UTC:     2025-02-05 23:01:00 UTC (PREVIOUS DAY!)
```

### 🎯 WHAT YOU NEED TO DO:

**Option A: Schedule for LOCAL TIME (Paris)**
```powershell
# If you want script to run at midnight Paris time:
$time = "2026-02-06 00:01:00"  # 12:01 AM Paris time

# Windows Task will fire at this local time
# Which equals 23:01 UTC on Feb 5
```

**Option B: Schedule for UTC (Convert to Paris time)**
```powershell
# If you want script to run at 12:01 AM UTC:
# Convert UTC to Paris time (Paris is UTC+1):
# 12:01 AM UTC = 1:01 AM Paris time

# Schedule Windows Task for:
$time = "2026-02-06 01:01:00"  # 1:01 AM Paris time
```

**Option C: Check your system timezone**
```powershell
# View current timezone
Get-TimeZone

# Expected output for Paris:
# Id: Romance Standard Time
# DisplayName: (UTC+01:00) Brussels, Copenhagen, Madrid, Paris
# StandardName: Central European Time
# DaylightName: Central European Summer Time
```

### ⚠️ CRITICAL: Which time do you want?

**DECIDE NOW:**

1. **LOCAL PARIS TIME** (Midnight Paris = 11 PM UTC previous day)
   ```
   Schedule for: 2026-02-06 00:01:00 (local)
   ```

2. **UTC TIME** (Midnight UTC = 1 AM Paris)
   ```
   Schedule for: 2026-02-06 01:01:00 (local)
   ```

### 🔧 If Task Already Created with Wrong Time:

```powershell
# Remove old task
Unregister-ScheduledTask -TaskName "Magnus15_PR1_AutomatedSubmission" -Confirm:$false

# Recreate with correct time
$taskTime = "2026-02-06 00:01:00"  # Your choice: LOCAL or CONVERTED

$Trigger = New-ScheduledTaskTrigger -Once -At $taskTime
$Action = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-ExecutionPolicy Bypass -File 'C:\Users\diase\Magnus_Scripts\run-pr-submission.ps1'"

Register-ScheduledTask -TaskName "Magnus15_PR1_AutomatedSubmission" `
  -Trigger $Trigger -Action $Action -RunLevel Highest
```

### ✅ Verification:

```powershell
# Check scheduled time
Get-ScheduledTask -TaskName "Magnus15_PR1_AutomatedSubmission" | `
  Get-ScheduledTaskInfo | Select-Object NextRunTime

# Expected: Shows Feb 6 at your chosen time
```

---

## ⚠️ CRITICAL ITEM #3: GIT CREDENTIALS

### ❌ What causes "push failed":
```
git push origin feat/convergence-aware-routing-magnus-15
ERROR: Authentication failed
FAILURE: PR cannot be created
```

### ✅ ENSURE GIT CREDENTIALS WORK:

**Step 1: Test git clone with authentication**
```powershell
# Try cloning your fork
git clone https://github.com/fullmeo/kilo-gateway.git C:\test-kilo-clone

# If asked for password: Good (credential helper working)
# If authentication succeeds: Ready for push
# If "Repository not found": Fork doesn't exist or not public
```

**Step 2: Configure Git Credentials (Choose ONE method)**

### METHOD A: Git Credential Manager (Easiest - Windows)

```powershell
# Install/update Git Credential Manager
git config --global credential.helper manager-core

# Test credentials
git clone https://github.com/fullmeo/kilo-gateway.git C:\test-clone

# You'll see:
# - Browser opens to GitHub
# - OR Windows credential dialog
# - OR password prompt
# - Enter credentials
# - Credentials saved for future use
```

### METHOD B: SSH Keys (More Secure)

```powershell
# Generate SSH key (if don't have one)
ssh-keygen -t ed25519 -C "your-email@example.com"
# Saves to: C:\Users\diase\.ssh\id_ed25519

# Add public key to GitHub:
# 1. Go to: https://github.com/settings/keys
# 2. Click "New SSH key"
# 3. Paste content of: C:\Users\diase\.ssh\id_ed25519.pub
# 4. Click "Add SSH key"

# Test SSH connection
ssh -T git@github.com

# Expected: "Hi fullmeo! You've successfully authenticated..."
```

**Then use SSH URL instead of HTTPS:**
```powershell
# In script, change:
$ForkUrl = "git@github.com:fullmeo/kilo-gateway.git"
# Instead of:
$ForkUrl = "https://github.com/fullmeo/kilo-gateway.git"
```

### METHOD C: Personal Access Token (GitHub)

```powershell
# Create token on GitHub:
# 1. Go to: https://github.com/settings/tokens
# 2. Click "Generate new token"
# 3. Scopes needed: repo, workflow
# 4. Copy the token

# Configure git to use token
git config --global credential.username fullmeo

# When asked for password during clone/push:
# - Enter token as password (not your GitHub password)
# - Credential manager will save it
```

### ⚠️ MOST COMMON FAILURE:

```powershell
# You'll see this error during script execution:
git push origin feat/convergence-aware-routing-magnus-15
ERROR: Authentication failed. Access denied.

# Causes:
# 1. No credentials configured
# 2. Credentials expired
# 3. Fork doesn't exist or is private
# 4. Wrong credentials (wrong GitHub account)
```

### ✅ TEST YOUR CREDENTIALS NOW:

```powershell
# Test 1: Clone your fork
Write-Host "Testing clone..."
git clone https://github.com/fullmeo/kilo-gateway.git C:\test-kilo-clone

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Clone successful - credentials work"
    Remove-Item C:\test-kilo-clone -Recurse -Force
}
else {
    Write-Host "✗ Clone failed - FIX CREDENTIALS NOW"
    Write-Host "See critical checklist for solutions"
    exit 1
}

# Test 2: Verify can push (in a test branch)
Write-Host ""
Write-Host "Testing push..."
cd C:\test-kilo-clone
git checkout -b test-branch
Add-Content -Path "test.txt" -Value "test"
git add test.txt
git commit -m "test"
git push origin test-branch

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Push successful - ready for Feb 6"
    git push origin --delete test-branch
}
else {
    Write-Host "✗ Push failed - FIX CREDENTIALS NOW"
    exit 1
}
```

---

## 📋 FINAL CRITICAL CHECKLIST

### Item 1: Fork the Repository
**Status**: 
- [ ] Fork created: https://github.com/fullmeo/kilo-gateway exists
- [ ] Fork is public
- [ ] Shows "forked from Kilo-Org/kilo-gateway"

**Action if not done**: Fork now at https://github.com/Kilo-Org/kilo-gateway/fork

---

### Item 2: Timezone Configured
**Status**:
- [ ] Timezone checked: `Get-TimeZone`
- [ ] Time chosen: LOCAL or CONVERTED to UTC
- [ ] Windows Task updated with correct time
- [ ] Verified: `Get-ScheduledTask ... | Get-ScheduledTaskInfo`

**Action if not done**:
```powershell
# Check current timezone
Get-TimeZone

# Decide: Do you want LOCAL time or UTC+1 adjusted?
# Update task with correct time
# Run: setup-scheduled-submission.ps1 again
```

---

### Item 3: Git Credentials Verified
**Status**:
- [ ] Git configured (Credential Manager OR SSH OR Token)
- [ ] Clone test successful: Can clone https://github.com/fullmeo/kilo-gateway.git
- [ ] Push test successful: Can push to fork
- [ ] Credentials will work Feb 6

**Action if not done**:
```powershell
# Choose ONE method:
# A) Git Credential Manager: git config --global credential.helper manager-core
# B) SSH Keys: ssh-keygen + add to GitHub settings
# C) Personal Access Token: Create at GitHub settings

# Test with script above
```

---

## 🎯 MUST COMPLETE TODAY

```
❌ Skip any of these → Automation fails tomorrow
✅ Complete all three → Automation succeeds

Item 1: Fork repository ______________ (5 minutes)
Item 2: Configure timezone __________ (5 minutes)
Item 3: Test git credentials ________ (10 minutes)

Total time: ~20 minutes
Failure cost: $150 PR not submitted
```

---

## 🚨 IF YOU DON'T DO THESE:

### Script executes on FEB 6 @ 12:01 AM, then:

**1. Fork missing:**
```
[00:01] Step 2/10: Cloning repository...
[00:02] Cloning from https://github.com/fullmeo/kilo-gateway.git
[00:03] ERROR: Repository not found (404)
[00:04] FAILURE: Script exits
```

**2. Wrong timezone:**
```
Windows runs at 00:01 LOCAL time (which is 11 PM UTC previous day)
If you wanted UTC: Ran 1 hour too early
If you wanted LOCAL: Ran at wrong time
Unpredictable results
```

**3. No git credentials:**
```
[00:40] Step 9/10: Pushing to fork...
[00:41] git push origin feat/...
[00:42] ERROR: Authentication failed
[00:43] FAILURE: Cannot push, PR cannot be created
```

---

## ✅ SUCCESS CRITERIA

After completing this checklist:

- [x] Fork exists at https://github.com/fullmeo/kilo-gateway
- [x] Windows Task scheduled for correct LOCAL time
- [x] Git credentials verified working
- [x] Clone test passes
- [x] Push test passes
- [x] Ready for FEB 6 @ 12:01 AM automation

---

## 🎊 AFTER YOU COMPLETE THIS CHECKLIST

```
✅ Fork: Ready
✅ Timezone: Correct
✅ Credentials: Verified

FEB 6 @ 12:01 AM: Script launches
FEB 6 @ 12:45 AM: GitHub opens
FEB 6 @ 12:50 AM: You click 3 buttons
FEB 6 @ 1:00 AM: PR #1 SUBMITTED! 🎉
```

---

## 📞 TROUBLESHOOTING

### "Repository not found"
- [ ] Did you fork? Go to https://github.com/Kilo-Org/kilo-gateway/fork
- [ ] Is fork public? Settings → "Make this repository public"
- [ ] Is fork at: https://github.com/fullmeo/kilo-gateway?

### "Authentication failed"
- [ ] Install Git Credential Manager: https://github.com/git-ecosystem/git-credential-manager
- [ ] Or generate SSH key and add to GitHub
- [ ] Or create Personal Access Token and use as password
- [ ] Test with: `git clone https://github.com/fullmeo/kilo-gateway.git`

### "Wrong timezone"
- [ ] Check: `Get-TimeZone`
- [ ] Your location: Paris (UTC+1 in February)
- [ ] Decide: LOCAL time or UTC+1 adjusted?
- [ ] Update task with correct time

---

**COMPLETE THIS CHECKLIST TODAY.**

**Without these three items, tomorrow's automation will fail.**

**Then you're ready for February 6, 2026 @ 12:01 AM.** 🚀

**Bonne chance!** 🌟
