#!/usr/bin/env pwsh
# MAGNUS 15 - Quick Validation

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "MAGNUS 15 - LOCAL VALIDATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$filesOk = $true
$patternsOk = $true
$configOk = $false
$templateOk = $false

# Check files
Write-Host "Checking Required Files..." -ForegroundColor Yellow
$requiredFiles = @(
    "Magnus_PR_Light/src/gateway/router/optimization/quality-pattern-detector.ts",
    "Magnus_PR_Light/src/gateway/router/optimization/routing-optimizer.ts",
    "Magnus_PR_Light/src/gateway/router/optimization/quality-review-cycle.ts",
    "Magnus_PR_Light/src/gateway/router/optimization/index.ts",
    "Magnus_PR_Light/config/routing-config.yaml",
    "Magnus_PR_Light/README.md",
    "Magnus_PR_Light/PR-TEMPLATE.md"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    }
    else {
        Write-Host "  [MISSING] $file" -ForegroundColor Red
        $filesOk = $false
    }
}

Write-Host ""

# Check patterns (using actual names from file)
Write-Host "Checking Pattern Definitions..." -ForegroundColor Yellow
$patternsFile = "Magnus_PR_Light/src/gateway/router/optimization/quality-pattern-detector.ts"
$requiredPatterns = @("CYCLE_DETECTION", "VALIDATION_GAP", "ARCHITECTURE_DRIFT", "COUPLING_COMPLEXITY", "BUSINESS_LOGIC_PRIORITY", "SELF_DOCUMENTING", "CONTINUOUS_IMPROVEMENT", "CODE_CONSISTENCY", "EVIDENCE_BASED", "COGNITIVE_COMPLEXITY")

if (Test-Path $patternsFile) {
    $content = Get-Content $patternsFile -Raw
    foreach ($pattern in $requiredPatterns) {
        if ($content -match $pattern) {
            Write-Host "  [OK] $pattern" -ForegroundColor Green
        }
        else {
            Write-Host "  [MISSING] $pattern" -ForegroundColor Red
            $patternsOk = $false
        }
    }
}
else {
    Write-Host "  [MISSING] Patterns file not found" -ForegroundColor Red
    $patternsOk = $false
}

Write-Host ""

# Check config - using correct YAML keys
Write-Host "Validating Configuration..." -ForegroundColor Yellow
$configFile = "Magnus_PR_Light/config/routing-config.yaml"
if (Test-Path $configFile) {
    $configContent = Get-Content $configFile -Raw
    $hasQualityWeights = $configContent.Contains("quality_weights:") -or $configContent -match "quality_weights:`n"
    $hasCostWeight = $configContent.Contains("cost_weight:")
    $hasLatencyWeight = $configContent.Contains("latency_weight:")
    $hasModelProfiles = $configContent.Contains("model_profiles:")
    $hasPatternWeights = $configContent.Contains("pattern_weights:")
    Write-Host "  quality_weights: $(if ($hasQualityWeights) { '[OK]' } else { '[FAIL]' })" -ForegroundColor $(if ($hasQualityWeights) { 'Green' } else { 'Red' })
    Write-Host "  cost_weight: $(if ($hasCostWeight) { '[OK]' } else { '[FAIL]' })" -ForegroundColor $(if ($hasCostWeight) { 'Green' } else { 'Red' })
    Write-Host "  latency_weight: $(if ($hasLatencyWeight) { '[OK]' } else { '[FAIL]' })" -ForegroundColor $(if ($hasLatencyWeight) { 'Green' } else { 'Red' })
    Write-Host "  model_profiles: $(if ($hasModelProfiles) { '[OK]' } else { '[FAIL]' })" -ForegroundColor $(if ($hasModelProfiles) { 'Green' } else { 'Red' })
    Write-Host "  pattern_weights: $(if ($hasPatternWeights) { '[OK]' } else { '[FAIL]' })" -ForegroundColor $(if ($hasPatternWeights) { 'Green' } else { 'Red' })
    $configOk = $hasQualityWeights -and $hasCostWeight -and $hasLatencyWeight -and $hasModelProfiles -and $hasPatternWeights
}
else {
    Write-Host "  [MISSING] Configuration file not found" -ForegroundColor Red
}

Write-Host ""

# Check template - using actual content sections
Write-Host "Validating PR Template..." -ForegroundColor Yellow
$templateFile = "Magnus_PR_Light/PR-TEMPLATE.md"
if (Test-Path $templateFile) {
    $templateContent = Get-Content $templateFile -Raw
    $hasTitle = $templateContent -match "^# Pattern-Based Routing Optimization"
    $hasProblem = $templateContent -match "## Problem"
    $hasSolution = $templateContent -match "## Solution"
    $hasResults = $templateContent -match "## Results"
    $hasImplementation = $templateContent -match "## Technical Implementation"
    Write-Host "  Title: $(if ($hasTitle) { '[OK]' } else { '[FAIL]' })" -ForegroundColor $(if ($hasTitle) { 'Green' } else { 'Red' })
    Write-Host "  Problem: $(if ($hasProblem) { '[OK]' } else { '[FAIL]' })" -ForegroundColor $(if ($hasProblem) { 'Green' } else { 'Red' })
    Write-Host "  Solution: $(if ($hasSolution) { '[OK]' } else { '[FAIL]' })" -ForegroundColor $(if ($hasSolution) { 'Green' } else { 'Red' })
    Write-Host "  Results/Metrics: $(if ($hasResults) { '[OK]' } else { '[FAIL]' })" -ForegroundColor $(if ($hasResults) { 'Green' } else { 'Red' })
    Write-Host "  Implementation: $(if ($hasImplementation) { '[OK]' } else { '[FAIL]' })" -ForegroundColor $(if ($hasImplementation) { 'Green' } else { 'Red' })
    $templateOk = $hasTitle -and $hasProblem -and $hasSolution -and $hasResults -and $hasImplementation
}
else {
    Write-Host "  [MISSING] Template file not found" -ForegroundColor Red
}

Write-Host ""

# Summary
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "VALIDATION SUMMARY" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Files:      $(if ($filesOk) { '[PASS]' } else { '[FAIL]' })" -ForegroundColor $(if ($filesOk) { 'Green' } else { 'Red' })
Write-Host "  Patterns:   $(if ($patternsOk) { '[PASS]' } else { '[FAIL]' })" -ForegroundColor $(if ($patternsOk) { 'Green' } else { 'Red' })
Write-Host "  Config:     $(if ($configOk) { '[PASS]' } else { '[FAIL]' })" -ForegroundColor $(if ($configOk) { 'Green' } else { 'Red' })
Write-Host "  Template:   $(if ($templateOk) { '[PASS]' } else { '[FAIL]' })" -ForegroundColor $(if ($templateOk) { 'Green' } else { 'Red' })
Write-Host ""

if ($filesOk -and $patternsOk -and $configOk -and $templateOk) {
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "VALIDATION PASSED - READY FOR SUBMISSION" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host "VALIDATION FAILED - FIX ISSUES BEFORE SUBMISSION" -ForegroundColor Red
    Write-Host "============================================================" -ForegroundColor Red
    exit 1
}
