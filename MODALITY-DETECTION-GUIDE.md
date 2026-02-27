# Modality Detection Guide

Magnus Infinity Modality Detector identifies project types (web, mobile, data) for multi-modal code generation.

---

## 📖 What is Modality Detection?

Modality detection analyzes project structure to determine its primary domain:

| Modality | Description | Typical Files |
|----------|-------------|---------------|
| **web** | Web applications (React, Vue, Angular, Next.js) | `.jsx`, `.tsx`, `.vue`, `.js`, `.ts`, `.html`, `.css` |
| **mobile** | Mobile applications (React Native, Flutter, Swift, Kotlin) | `.swift`, `.kt`, `.java`, `.dart` |
| **data** | Data science & engineering (Python, Spark, SQL) | `.py`, `.ipynb`, `.sql`, `.scala` |

---

## 🚀 How to Use It

### Basic Usage

```javascript
import { ModalityDetector } from './magnus-dashboard/modality-detector.js';

const detector = new ModalityDetector();
const result = await detector.detectModality('/path/to/project');

console.log(result.primary);      // 'web', 'mobile', 'data', or 'unknown'
console.log(result.confidence);   // 0.0 to 1.0
console.log(result.scores);       // { web: 0.85, mobile: 0.12, data: 0.03 }
console.log(result.isMultiModal); // true if multiple modalities detected
```

### Advanced Configuration

```javascript
const detector = new ModalityDetector({
  baseDir: '/project/path',           // Project root directory
  minConfidence: 0.6                   // Minimum confidence threshold (default: 0.6)
});
```

---

## 📊 Understanding Accuracy & Confidence

### Confidence Scores

| Score Range | Interpretation |
|-------------|----------------|
| 0.0 - 0.4 | Uncertain / Unknown modality |
| 0.4 - 0.6 | Low confidence (needs review) |
| 0.6 - 0.8 | Moderate confidence |
| 0.8 - 1.0 | High confidence |

### Accuracy Estimate

The detector provides an `accuracyEstimate` in results:

```javascript
result.accuracyEstimate; // 0.60 to 0.95 based on:
                         // - Score spread between modalities
                         // - Number of strong indicators found
                         // - Pattern consistency
```

### Boost Factors

Confidence can be boosted by:

| Factor | Max Boost | Description |
|--------|-----------|-------------|
| Modality boost | +12% | Web gets higher boost |
| Pattern match | +10% | Patterns matching detected modality |
| Magnus 14 | +12% | Enhanced analysis from Magnus 14 Scanner |

---

## 🔧 Troubleshooting

### Low Confidence Results

**Problem:** `confidence: 0.45` or `primary: 'unknown'`

**Solutions:**
1. Check if project has clear file types (add more `.js`, `.py`, etc.)
2. Ensure dependencies are detected (add `package.json` or `requirements.txt`)
3. Add modality-specific patterns in source files

### Wrong Modality Detected

**Problem:** Web project detected as data

**Solutions:**
1. Add web-specific dependencies (`react`, `vue`, `@angular/core`)
2. Add web patterns (`useState`, `useEffect`, `<template>`)
3. Remove data patterns that might confuse detection

### Mixed Modality Projects

**Problem:** Project has multiple types (e.g., web + data)

**Solutions:**
1. Use `result.isMultiModal` to detect mixed projects
2. Check `result.secondary` for additional modalities
3. Configure thresholds appropriately

---

## 📚 API Reference

### Class: ModalityDetector

#### Constructor Options

```typescript
interface ModalityDetectorConfig {
  baseDir?: string;           // Project root (default: process.cwd())
  minConfidence?: number;     // Minimum confidence (default: 0.6)
}
```

#### detectModality(projectPath)

Returns detection results:

```typescript
interface ModalityResult {
  primary: string;           // 'web' | 'mobile' | 'data' | 'unknown'
  secondary: string[];       // Additional modalities
  scores: {                  // Raw scores for each modality
    web: number;
    mobile: number;
    data: number;
  };
  confidence: number;        // Final confidence (0.0 - 1.0)
  baseConfidence: number;    // Confidence before boosts
  confidenceBoost: number;   // Modality-specific boost
  patternMatchBoost: number; // Pattern matching boost
  isMultiModal: boolean;     // True if multiple modalities
  detectionTime: number;     // Time in ms
  projectInfo: {             // Project statistics
    totalFiles: number;
    fileTypes: Record<string, number>;
    dependencyCount: number;
    strongIndicatorsFound: number;
  };
  magnus14Insights: object;  // Magnus 14 analysis (if available)
  patternMemory: object;     // Historical detection data
  accuracyEstimate: number;  // Estimated accuracy (0.60 - 0.95)
}
```

#### Key Methods

| Method | Description |
|--------|-------------|
| `calculateWebScore()` | Calculate web modality score |
| `calculateMobileScore()` | Calculate mobile modality score |
| `calculateDataScore()` | Calculate data modality score |
| `applyNegativePatterns()` | Apply penalty for conflicting patterns |
| `determinePrimaryModality()` | Select highest-scoring modality |
| `calculatePatternMatchingBoost()` | Apply +10% boost for matching patterns |

---

## 🎯 Best Practices

### For Web Projects

```javascript
// Ensure these patterns are present:
- useState, useEffect, useCallback (React)
- <template>, <script>, <style> (Vue)
- @Component, @NgModule (Angular)
// Dependencies:
- react, vue, @angular/core, next, gatsby
```

### For Mobile Projects

```javascript
// Ensure these patterns are present:
- View, Text, StyleSheet (React Native)
- StatelessWidget, StatefulWidget (Flutter)
- import UIKit, UIViewController (Swift)
- import androidx, Activity (Kotlin)
// Dependencies:
- react-native, expo, flutter
```

### For Data Projects

```javascript
// Ensure these patterns are present:
- pandas, numpy, sklearn (Python)
- DataFrame, .fit, model (ML)
- SparkSession, RDD (Spark)
- DAG, PythonOperator (Airflow)
// Dependencies:
- pandas, tensorflow, pytorch, pyspark, airflow
```

---

## 📈 Accuracy Targets

| Version | Target Accuracy | Notes |
|---------|-----------------|-------|
| v0.9 | 60% | Initial release |
| **v1.0** | **75%+** | **Current target - achieves via:** |
| | | - Strong indicator weighting |
| | | - Negative pattern penalties |
| | | - Pattern matching boost |
| | | - Higher confidence thresholds |

---

## 🔗 Related Documentation

- [Magnus 14 Framework](./magnus-14/magnus-14-core.js)
- [Pattern Detector](./Magnus_cloud_storage/pattern-detector.js)
- [Bias Detector](./Magnus_cloud_storage/bias-detector.js)
- [Magnus Infinity Core](./magnus-dashboard/magnus-infinity-core.js)
