#!/usr/bin/env pwsh
# ============================================================================
# MAGNUS 15 - LOCAL VALIDATION SCRIPT (PowerShell)
# Validates the implementation without external dependencies
# ============================================================================

$ErrorActionPreference = "Continue"

# Configuration
$CONFIG = @{
    RequiredFiles = @(
        "Magnus_PR_Light/src/gateway/router/optimization/quality-pattern-detector.ts",
        "Magnus_PR_Light/src/gateway/router/optimization/routing-optimizer.ts",
        "Magnus_PR_Light/src/gateway/router/optimization/quality-review-cycle.ts",
        "Magnus_PR_Light/src/gateway/router/optimization/index.ts",
        "Magnus_PR_Light/config/routing-config.yaml",
        "Magnus_PR_Light/README.md",
        "Magnus_PR_Light/PR-TEMPLATE.md"
    )
    RequiredPatterns = @(
        "CYCLE_DETECTION",
        "VALIDATION_GAP",
        "ARCHITECTURE_DRIFT",
        "COUPLING_COMPLEXITY",
        "BUSINESS_LOGIC_PRIORITY",
        "LEARNING_MOMENTUM",
        "SELF_OPTIMIZATION",
        "ITERATIVE_IMPROVEMENT",
        "QUALITY_HARMONY",
        "CONFIDENCE_BUILDING"
    )
}

function Write-ValidationHeader {
    Write-Host ""
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host "MAGNUS 15 - LOCAL VALIDATION" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host ""
}

function Test-FileExists {
    param([string]$Filepath)
    return Test-Path $Filepath
}

function Test-PatternInFile {
    param(
        [string]$Pattern,
        [string]$Filepath
    )
    try {
        $content = Get-Content $Filepath -Raw -ErrorAction SilentlyContinue
        return $content -contains $Pattern -or $content -match $Pattern
    }
    catch {
        return $false
    }
}

function Test-YamlConfig {
    param([string]$Filepath)
    try {
        $content = Get-Content $Filepath -Raw -ErrorAction SilentlyContinue
        
        $checks = @{
            QualityWeights = $content -match "quality_weights"
            CostWeights = $content -match "cost_weights"
            LatencyWeights = $content -match "latency_weights"
            PatternThresholds = $content -match "patterns:" -or $content -match "thresholds"
        }
        
        return @{
            Valid = ($checks.Values -contains $true).Count -eq 4
            Checks = $checks
        }
    }
    catch {
        return @{ Valid = $false; Error = $_ }
    }
}

function Test-PRTemplate {
    param([string]$Filepath)
    try {
        $content = Get-Content $Filepath -Raw -ErrorAction SilentlyContinue
        
        $checks = @{
            Summary = $content -match "## Summary" -or $content -match "# Summary"
            Problem = $content -match "## Problem" -or $content -match "# Problem"
            Solution = $content -match "## Solution" -or $content -match "# Solution"
            Metrics = $content -match "## Metrics" -or $content -match "## Results" -or $content -match "# Results"
            Testing = $content -match "## Testing" -or $content -match "# Testing"
        }
        
        return @{
            Valid = ($checks.Values -contains $true).Count -eq 5
            Checks = $checks
        }
    }
    catch {
        return @{ Valid = $false; Error = $_ }
    }
}

# ============================================================================
# MAIN VALIDATION
# ============================================================================

Write-ValidationHeader

$results = @{
    Timestamp = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    Files = @{
        Checked = 0
        Passed = 0
        Failed = 0
        Details = @()
    }
    Patterns = @{
        Total = $CONFIG.RequiredPatterns.Count
        Found = 0
        Missing = @()
        Details = @()
    }
    Config = @{
        Valid = $false
        Details = @{}
    }
    Template = @{
        Valid = $false
        Details = @{}
    }
    Summary = @{
        OverallStatus = "PENDING"
        ReadyForSubmission = $false
    }
}

# 1. Check required files
Write-Host "📁 Checking Required Files..." -ForegroundColor Yellow
Write-Host ("-" * 40)

foreach ($file in $CONFIG.RequiredFiles) {
    $exists = Test-FileExists $file
    $results.Files.Checked++
    
    if ($exists) {
        $results.Files.Passed++
        Write-Host "  ✓ $file" -ForegroundColor Green
        $results.Files.Details += @{ File = $file; Exists = $true; Status = "✓" }
    }
    else {
        $results.Files.Failed++
        Write-Host "  ✗ $file" -ForegroundColor Red
        $results.Files.Details += @{ File = $file; Exists = $false; Status = "✗" }
    }
}

Write-Host ""

# 2. Check patterns
Write-Host "🔍 Checking Pattern Definitions..." -ForegroundColor Yellow
Write-Host ("-" * 40)

$patternsFile = "Magnus_PR_Light/src/gateway/router/optimization/quality-pattern-detector.ts"

foreach ($pattern in $CONFIG.RequiredPatterns) {
    $found = Test-PatternInFile -Pattern $pattern -Filepath $patternsFile
    
    if ($found) {
        $results.Patterns.Found++
        Write-Host "  ✓ $pattern" -ForegroundColor Green
    }
    else {
        $results.Patterns.Missing += $pattern
        Write-Host "  ✗ $pattern" -ForegroundColor Red
    }
}

Write-Host ""

# 3. Validate configuration
Write-Host "⚙️ Validating Configuration..." -ForegroundColor Yellow
Write-Host ("-" * 40)

$configFile = "Magnus_PR_Light/config/routing-config.yaml"
if (Test-Path $configFile) {
    $configCheck = Test-YamlConfig -Filepath $configFile
    $results.Config.Valid = $configCheck.Valid
    $results.Config.Details = $configCheck
    
    Write-Host "  Status: $(if ($configCheck.Valid) { '✓' } else { '✗' })" -ForegroundColor $(if ($configCheck.Valid) { 'Green' } else { 'Red' })
    
    foreach ($key in $configCheck.Checks.Keys) {
        $value = $configCheck.Checks[$key]
        Write-Host "    $(if ($value) { '✓' } else { '✗' }) $key" -ForegroundColor $(if ($value) { 'Green' } else { 'Red' })
    }
}
else {
    Write-Host "  ✗ Configuration file not found: $configFile" -ForegroundColor Red
}

Write-Host ""

# 4. Validate PR template
Write-Host "📝 Validating PR Template..." -ForegroundColor Yellow
Write-Host ("-" * 40)

$templateFile = "Magnus_PR_Light/PR-TEMPLATE.md"
if (Test-Path $templateFile) {
    $templateCheck = Test-PRTemplate -Filepath $templateFile
    $results.Template.Valid = $templateCheck.Valid
    $results.Template.Details = $templateCheck
    
    Write-Host "  Status: $(if ($templateCheck.Valid) { '✓' } else { '✗' })" -ForegroundColor $(if ($templateCheck.Valid) { 'Green' } else { 'Red' })
    
    foreach ($key in $templateCheck.Checks.Keys) {
        $value = $templateCheck.Checks[$key]
        Write-Host "    $(if ($value) { '✓' } else { '✗' }) $key" -ForegroundColor $(if ($value) { 'Green' } else { 'Red' })
    }
}
else {
    Write-Host "  ✗ Template file not found: $templateFile" -ForegroundColor Red
}

Write-Host ""

# 5. Calculate summary
$filesOk = $results.Files.Failed -eq 0
$patternsOk = $results.Patterns.Missing.Count -eq 0
$configOk = $results.Config.Valid
$templateOk = $results.Template.Valid

$results.Summary.ReadyForSubmission = $filesOk -and $patternsOk -and $configOk -and $templateOk

if ($results.Summary.ReadyForSubmission) {
    $results.Summary.OverallStatus = "✅ READY"
    Write-Host ("=" * 60) -ForegroundColor Green
    Write-Host "✅ VALIDATION PASSED - READY FOR SUBMISSION" -ForegroundColor Green
    Write-Host ("=" * 60) -ForegroundColor Green
}
else {
    $results.Summary.OverallStatus = "❌ ISSUES FOUND"
    Write-Host ("=" * 60) -ForegroundColor Red
    Write-Host "❌ VALIDATION FAILED - FIX ISSUES BEFORE SUBMISSION" -ForegroundColor Red
    Write-Host ("=" * 60) -ForegroundColor Red
}

# 6. Print summary
Write-Host ""
Write-Host "📊 VALIDATION SUMMARY" -ForegroundColor Yellow
Write-Host ("-" * 40)
Write-Host "  Files: $($results.Files.Passed)/$($results.Files.Checked) passed"
Write-Host "  Patterns: $($results.Patterns.Found)/$($results.Patterns.Total) found"
Write-Host "  Config: $(if ($configOk) { '✓' } else { '✗' })"
Write-Host "  Template: $(if ($templateOk) { '✓' } else { '✗' })"
Write-Host "  Overall: $($results.Summary.OverallStatus)"

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "Timestamp: $($results.Timestamp)" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""

# Save results
$results | ConvertTo-Json -Depth 10 | Out-File -FilePath "validation-results.json" -Encoding UTF8
Write-Host "📄 Results saved to: validation-results.json" -ForegroundColor Cyan
Write-Host ""

# Exit with appropriate code
if ($results.Summary.ReadyForSubmission) {
    exit 0
}
else {
    exit 1
}
