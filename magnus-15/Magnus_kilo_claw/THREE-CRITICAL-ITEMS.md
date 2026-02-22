# ⚠️ THREE CRITICAL ITEMS YOU MUST COMPLETE TODAY

These three items are **NON-NEGOTIABLE**. Without them, the automation WILL FAIL on Feb 6.

---

## 1️⃣ FORK THE REPOSITORY TO `fullmeo`

### What the Script Does NOT Do:
❌ Create a fork on GitHub  
❌ Set up your GitHub account  
❌ Generate credentials  

### What YOU Must Do:
✅ Go to: https://github.com/Kilo-Org/kilo-gateway  
✅ Click: **Fork** button (top right)  
✅ Result: https://github.com/fullmeo/kilo-gateway created  

### Why This is Critical:
The script executes this line:
```powershell
git clone https://github.com/fullmeo/kilo-gateway.git
```

**If the fork doesn't exist, this fails immediately.**

### Test It Works:
```powershell
git clone https://github.com/fullmeo/kilo-gateway.git C:\test-clone
# Must succeed without "Repository not found" error
```

### Time Required:
**5 minutes** (30 seconds to fork, rest for verification)

### Status:
- [ ] Fork created at https://github.com/fullmeo/kilo-gateway
- [ ] Can clone: `git clone https://github.com/fullmeo/kilo-gateway.git`
- [ ] Contains all original Kilo files

---

## 2️⃣ UNDERSTAND TIMEZONE - Windows Task Uses LOCAL Time

### The Critical Misunderstanding:
❌ Wrong: "Task scheduled for 00:01 UTC"  
✅ Correct: "Task scheduled for 00:01 LOCAL TIME"  

### Why This Matters:
Windows Task Scheduler uses **YOUR LOCAL TIMEZONE**, not UTC.

### Your Timezone (Paris):
```
Get-TimeZone

Output:
Id: Central European Standard Time
DisplayName: (UTC+01:00) Brussels, Copenhagen, Madrid, Paris
```

### Time Conversion Example:
```
Windows Task fires at: 2026-02-06 00:01:00 (LOCAL)

Your location: Paris (UTC+1 in February)
Converts to UTC: 2026-02-05 23:01:00 (PREVIOUS DAY at 11 PM UTC)

Important: Task fires EVENING OF FEB 5, not morning of FEB 6!
```

### What You Must Do:
1. Run: `Get-TimeZone` to confirm your timezone
2. Calculate what time 00:01 local = UTC
3. Set alarms accordingly
4. Be awake/alert at that time

### Example Times (when task fires at 00:01 LOCAL):

**Paris (UTC+1)**:
- Windows: 00:01 AM Feb 6 (midnight Paris)
- UTC: 23:01 PM Feb 5 (11 PM Feb 5)
- **You should be awake**: Evening of Feb 5

**New York (UTC-5)**:
- Windows: 00:01 AM Feb 6 (midnight EST)
- UTC: 05:01 AM Feb 6 (morning)
- **You should be awake**: Evening of Feb 5

**Tokyo (UTC+9)**:
- Windows: 00:01 AM Feb 6 (midnight JST)
- UTC: 15:01 PM Feb 5 (3 PM Feb 5)
- **You should be awake**: Afternoon of Feb 5

### Test Your Understanding:
```powershell
# Verify timezone
Get-TimeZone

# Calculate Feb 6 midnight in UTC
$localTime = [DateTime]"2026-02-06 00:01:00"
$utcTime = [System.TimeZoneInfo]::ConvertTimeToUtc($localTime, [System.TimeZoneInfo]::Local)

Write-Host "Local time: $localTime"
Write-Host "UTC time: $utcTime"
```

### Status:
- [ ] Timezone identified: `Get-TimeZone`
- [ ] Feb 6 00:01 local time calculated
- [ ] UTC equivalent time known
- [ ] Alarms set for correct time
- [ ] Prepared to be awake/alert

---

## 3️⃣ GIT CREDENTIALS - Ensure `git push` Works

### The Problem:
Without credentials configured, `git push` FAILS:
```
git push origin feat/convergence-aware-routing-magnus-15
ERROR: Authentication failed
FAILURE: Script stops, PR cannot be created
```

### What the Script Needs:
```powershell
git push origin feat/convergence-aware-routing-magnus-15
```

This requires GitHub authentication to work.

### Three Methods (Choose ONE):

### METHOD 1: GitHub CLI (Easiest)
```powershell
# Install: https://cli.github.com/
# Login:
gh auth login

# Follow browser prompts
# Verify:
gh auth status

# Should show: Logged in to github.com as fullmeo
```

**Advantage**: Automatic credential management, simple  
**Time**: 5 minutes

### METHOD 2: Git Credential Manager (Windows Default)
```powershell
# Check if installed:
git credential-manager --version

# If yes, test:
git clone https://github.com/fullmeo/kilo-gateway.git

# Windows will show browser popup to approve
# Credentials cached automatically
```

**Advantage**: Built-in to modern Git  
**Time**: 3 minutes

### METHOD 3: SSH Key (Most Secure)
```powershell
# Generate key:
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add to GitHub:
# 1. Go to: https://github.com/settings/keys
# 2. Copy: cat $HOME\.ssh\id_ed25519.pub
# 3. Paste into GitHub
# 4. Save

# Test:
ssh -T git@github.com
# Should show: Hi fullmeo! You've successfully authenticated...
```

**Advantage**: Most secure, no password needed  
**Time**: 10 minutes

### Test Before Feb 6:
```powershell
# Clone your fork
git clone https://github.com/fullmeo/kilo-gateway.git

# This will prompt for credentials (browser or dialog)
# IMPORTANT: It should NOT fail

# If fails with "Authentication failed":
#   - Check credentials are configured
#   - Try gh auth login
#   - Try SSH keys
#   - Try credential manager

# If succeeds:
#   - ✓ Credentials are working
#   - ✓ git push will work on Feb 6
```

### Status:
- [ ] Git user configured: `git config --global user.name`
- [ ] Authentication method chosen (gh / credential manager / SSH)
- [ ] Credentials tested: `git clone https://github.com/fullmeo/kilo-gateway.git`
- [ ] Clone succeeded without authentication errors
- [ ] Ready for Feb 6

---

## 🎯 VERIFICATION CHECKLIST

### 1. Fork
```powershell
# Verify fork exists
Start-Process "https://github.com/fullmeo/kilo-gateway"

# Verify can clone
git clone https://github.com/fullmeo/kilo-gateway.git test
# Should succeed

# Status:
[ ] Fork exists
[ ] Clone works
```

### 2. Timezone
```powershell
# Check timezone
Get-TimeZone

# Calculate exact time
$localTime = [DateTime]"2026-02-06 00:01:00"
$utcTime = [System.TimeZoneInfo]::ConvertTimeToUtc($localTime, [System.TimeZoneInfo]::Local)
Write-Host "Task fires LOCAL: $localTime"
Write-Host "Which equals UTC: $utcTime"

# Status:
[ ] Timezone verified
[ ] Local time calculated
[ ] UTC equivalent known
[ ] Alarms set
```

### 3. Credentials
```powershell
# Test clone with auth
git clone https://github.com/fullmeo/kilo-gateway.git test2

# Should NOT fail with authentication error
# May show dialog/browser - that's OK, approve it

# Test push
cd test2
git checkout -b test
echo "test" > test.txt
git add .
git commit -m "test"
git push origin test

# Should succeed

# Clean up
git push origin --delete test

# Status:
[ ] Clone works
[ ] Push works
[ ] Credentials configured
```

---

## ⏰ DO THIS TODAY (FEB 5)

**Morning/Afternoon:**
```
1. Fork repo: 5 min (go to GitHub, click fork)
2. Check timezone: 5 min (run Get-TimeZone, calculate)
3. Test credentials: 10 min (run clone/push test)

Total: 20 minutes
```

**Evening:**
```
4. Integrate scripts: Copy to Deploy_Magnus15_PR
5. Verify task scheduler: Check Feb 6 00:01 local time
6. Final checks: All files in place
7. Sleep: You need it!
```

---

## 🚨 IF ANY OF THESE FAILS

### Fork doesn't exist:
❌ `git clone https://github.com/fullmeo/kilo-gateway.git` fails with "not found"  
✅ Solution: Go to https://github.com/Kilo-Org/kilo-gateway/fork and fork again

### Wrong timezone:
❌ Task fires at wrong time  
✅ Solution: Run `Get-TimeZone`, recalculate, set alarms for your timezone

### Credentials don't work:
❌ `git push` fails with "Authentication failed"  
✅ Solution: 
- Try: `gh auth login`
- Or: Configure SSH keys
- Or: Use credential manager
- Test: `git clone https://github.com/fullmeo/kilo-gateway.git`

---

## ✅ SUCCESS CRITERIA

After completing all three items:

```
✓ Fork created and accessible
✓ Timezone verified and understood
✓ Git credentials configured and tested
✓ Script can clone repo
✓ Script can push to fork
✓ Ready for Feb 6 automation
```

---

## 🎊 FINAL SUMMARY

| Item | Action | Status |
|------|--------|--------|
| **1. Fork** | Go to GitHub, click fork button | [ ] Done |
| **2. Timezone** | Run Get-TimeZone, calculate local time | [ ] Done |
| **3. Credentials** | Test git clone + push | [ ] Done |

---

## 🚀 READY FOR TOMORROW

Once these three items are complete:

**Feb 6 @ 00:01 LOCAL TIME:**
- Windows Task triggers automatically
- Script clones YOUR fork
- Script pushes with YOUR credentials
- PR #1 is created

**Everything else is already prepared.**

---

**These three items are ESSENTIAL.**

**Without them, automation fails.**

**With them, automation succeeds.** ✅

**Do this today. Be ready tomorrow.** 🚀

**Bonne chance!** 🌟
