# 🚀 Tier 1 - Phase 1A: Modality Detection - Implementation Plan

**Project:** Magnus Infinity Multi-Modal Generation
**Phase:** 1A - Modality Detection
**Duration:** Week 1-2
**Status:** 🏗️ **IN PROGRESS**
**Start Date:** 2026-01-04

---

## 🎯 Phase 1A Objectives

Extend the Magnus 14 Scanner to detect and classify code modalities (web, mobile, data) with autonomous classification capabilities.

### Success Criteria
- ✅ Detect web application patterns (React, Vue, Angular, HTML/CSS)
- ✅ Detect mobile application patterns (React Native, Flutter, Swift, Kotlin)
- ✅ Detect data application patterns (Python data science, SQL, ETL)
- ✅ Track modality in pattern memory
- ✅ Autonomous modality classification with >80% accuracy
- ✅ Integration with existing Magnus Infinity decision engine

---

## 📊 Architecture Overview

### Current State (Tier 0)
```
Magnus 14 Scanner
  ↓
Pattern Detection (general)
  ↓
Learning Engine
  ↓
Autonomous Decisions
```

### Target State (Phase 1A)
```
Magnus 14 Scanner + Modality Detector
  ↓
Pattern Detection (modality-aware)
  ↓
Learning Engine (modality tracking)
  ↓
Autonomous Decisions (modality-specific)
  ↓
Generator Selection (future Phase 1B)
```

---

## 🏗️ Implementation Tasks

### Task 1: Modality Detection Engine
**File:** `magnus-dashboard/modality-detector.js`
**Priority:** HIGH
**Estimated Time:** 2-3 hours

**Features:**
- Detect web modality (React, Vue, Angular, HTML/CSS/JS)
- Detect mobile modality (React Native, Flutter, Swift, Kotlin, Java)
- Detect data modality (Python, SQL, Spark, Airflow, Pandas)
- Confidence scoring for each modality
- Multi-modality support (hybrid projects)

**Implementation:**
```javascript
class ModalityDetector {
  detectModality(codebase) {
    return {
      web: this.detectWebModality(codebase),
      mobile: this.detectMobileModality(codebase),
      data: this.detectDataModality(codebase),
      primary: this.determinePrimaryModality(),
      confidence: this.calculateModalityConfidence()
    };
  }
}
```

### Task 2: Extend Magnus 14 Scanner
**File:** `magnus-dashboard/magnus-14-simple.js` (enhance existing)
**Priority:** HIGH
**Estimated Time:** 1-2 hours

**Enhancements:**
- Add modality detection to scan process
- Include modality in pattern results
- Track modality-specific patterns
- Update pattern confidence based on modality

**Changes:**
```javascript
async scanProject(projectPath) {
  // Existing scan logic
  const patterns = await this.detectPatterns(projectPath);

  // NEW: Detect modality
  const modality = await this.modalityDetector.detectModality(projectPath);

  return {
    patterns,
    modality,  // NEW
    friction: this.calculateFriction(patterns),
    avgConfidence: this.calculateAverageConfidence(patterns)
  };
}
```

### Task 3: Pattern Memory Enhancement
**File:** `magnus-dashboard/magnus-infinity-core.js` (enhance existing)
**Priority:** MEDIUM
**Estimated Time:** 1 hour

**Enhancements:**
- Track modality in pattern memory
- Store modality-specific pattern frequencies
- Enable modality-based pattern retrieval

**Changes:**
```javascript
async rememberPattern(pattern) {
  const key = pattern.name || pattern.type;
  if (!this.patternMemory.has(key)) {
    this.patternMemory.set(key, {
      pattern,
      seenCount: 1,
      modality: pattern.modality,  // NEW
      modalityBreakdown: {         // NEW
        web: 0,
        mobile: 0,
        data: 0
      },
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      confidence: pattern.confidence || 0.8
    });
  } else {
    const memory = this.patternMemory.get(key);
    memory.seenCount++;
    memory.lastSeen = Date.now();

    // NEW: Track modality
    if (pattern.modality) {
      memory.modalityBreakdown[pattern.modality]++;
    }
  }
}
```

### Task 4: Modality-Aware Decision Making
**File:** `magnus-dashboard/magnus-infinity-core.js` (enhance existing)
**Priority:** MEDIUM
**Estimated Time:** 1 hour

**Enhancements:**
- Consider modality in decision confidence
- Adjust thresholds based on modality
- Track modality-specific decision history

**Logic:**
```javascript
async evaluatePattern(pattern) {
  const baseConfidence = pattern.confidence || 0.5;

  // NEW: Modality-specific confidence adjustment
  const modalityBoost = this.getModalityConfidenceBoost(pattern.modality);
  const adjustedConfidence = Math.min(1.0, baseConfidence * modalityBoost);

  return {
    pattern: pattern.pattern,
    confidence: adjustedConfidence,
    modality: pattern.modality,  // NEW
    recommendation: this.generateRecommendation(pattern)
  };
}
```

### Task 5: Testing & Validation
**File:** `magnus-dashboard/test-modality-detection.js` (new)
**Priority:** HIGH
**Estimated Time:** 1 hour

**Test Cases:**
- Web project detection (React, Vue, Angular)
- Mobile project detection (React Native, Flutter)
- Data project detection (Python data science)
- Hybrid project detection (multi-modality)
- Accuracy validation (>80% target)

---

## 🎨 Modality Detection Patterns

### Web Modality Indicators
```javascript
webPatterns: {
  react: {
    files: ['*.jsx', '*.tsx', 'package.json'],
    imports: ['react', 'react-dom'],
    patterns: ['useState', 'useEffect', 'Component'],
    confidence: 0.9
  },
  vue: {
    files: ['*.vue', 'package.json'],
    imports: ['vue'],
    patterns: ['<template>', '<script>', '<style>'],
    confidence: 0.9
  },
  angular: {
    files: ['*.component.ts', 'angular.json'],
    imports: ['@angular/core'],
    patterns: ['@Component', '@NgModule'],
    confidence: 0.9
  },
  html: {
    files: ['*.html', '*.css', '*.js'],
    patterns: ['<html>', '<div>', 'getElementById'],
    confidence: 0.7
  }
}
```

### Mobile Modality Indicators
```javascript
mobilePatterns: {
  reactNative: {
    files: ['*.jsx', '*.tsx', 'package.json'],
    imports: ['react-native'],
    patterns: ['View', 'Text', 'StyleSheet'],
    confidence: 0.9
  },
  flutter: {
    files: ['*.dart', 'pubspec.yaml'],
    imports: ['flutter/'],
    patterns: ['Widget', 'StatelessWidget', 'StatefulWidget'],
    confidence: 0.9
  },
  swift: {
    files: ['*.swift', '*.xcodeproj'],
    patterns: ['import UIKit', 'class.*UIViewController'],
    confidence: 0.85
  },
  kotlin: {
    files: ['*.kt', 'build.gradle'],
    imports: ['androidx.', 'android.'],
    patterns: ['Activity', 'Fragment'],
    confidence: 0.85
  }
}
```

### Data Modality Indicators
```javascript
dataPatterns: {
  pythonDataScience: {
    files: ['*.py', 'requirements.txt', '*.ipynb'],
    imports: ['pandas', 'numpy', 'sklearn', 'tensorflow', 'pytorch'],
    patterns: ['pd.DataFrame', 'np.array', 'model.fit'],
    confidence: 0.9
  },
  sql: {
    files: ['*.sql'],
    patterns: ['SELECT', 'FROM', 'WHERE', 'JOIN'],
    confidence: 0.85
  },
  spark: {
    files: ['*.py', '*.scala'],
    imports: ['pyspark', 'org.apache.spark'],
    patterns: ['SparkSession', 'DataFrame', 'RDD'],
    confidence: 0.9
  },
  airflow: {
    files: ['*.py', 'dags/'],
    imports: ['airflow'],
    patterns: ['DAG', 'PythonOperator', 'task'],
    confidence: 0.9
  }
}
```

---

## 🔍 Detection Algorithm

### Step 1: File Analysis
```javascript
1. Scan project directory structure
2. Identify file types and extensions
3. Count files by type
4. Calculate file type distribution
```

### Step 2: Import/Dependency Analysis
```javascript
1. Read package.json / requirements.txt / build.gradle
2. Extract dependencies
3. Match against modality patterns
4. Calculate dependency scores
```

### Step 3: Code Pattern Analysis
```javascript
1. Scan code files for patterns
2. Match against modality-specific patterns
3. Calculate pattern frequency
4. Compute pattern confidence
```

### Step 4: Modality Scoring
```javascript
1. Combine file, dependency, and pattern scores
2. Weight scores (files: 30%, deps: 40%, patterns: 30%)
3. Calculate per-modality confidence
4. Determine primary modality (highest confidence)
5. Identify secondary modalities (>0.5 confidence)
```

---

## 📈 Success Metrics

### Technical Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Detection Accuracy | >80% | Manual validation on test projects |
| Detection Speed | <2 seconds | Time to detect modality |
| Confidence Score | 0.7-1.0 | Average confidence for correct detections |
| False Positive Rate | <10% | Incorrect modality assignments |

### Integration Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Pattern Memory Integration | 100% | Modality tracked in all patterns |
| Decision Engine Integration | 100% | Modality considered in decisions |
| Scanner Integration | 100% | Modality included in scan results |

---

## 🧪 Testing Strategy

### Unit Tests
- Test individual modality detectors (web, mobile, data)
- Test confidence scoring algorithms
- Test edge cases (empty projects, multi-modality)

### Integration Tests
- Test with Magnus 14 Scanner
- Test with Learning Engine
- Test with Decision Engine

### Validation Tests
- Test on known web projects (React, Vue, Angular)
- Test on known mobile projects (React Native, Flutter)
- Test on known data projects (Python data science)
- Test on hybrid projects

### Test Projects
```
test-projects/
  ├── web-react/          # React web app
  ├── web-vue/            # Vue web app
  ├── mobile-react-native/ # React Native app
  ├── mobile-flutter/     # Flutter app
  ├── data-python/        # Python data science
  └── hybrid-web-mobile/  # Multi-modality project
```

---

## 🚀 Implementation Steps

### Day 1: Core Implementation
- [x] Create ModalityDetector class
- [x] Implement web modality detection
- [x] Implement mobile modality detection
- [x] Implement data modality detection

### Day 2: Integration
- [ ] Integrate with Magnus 14 Scanner
- [ ] Update pattern memory tracking
- [ ] Test basic detection

### Day 3: Enhancement
- [ ] Add modality-aware decision making
- [ ] Implement confidence scoring
- [ ] Create test suite

### Day 4: Validation
- [ ] Test on real projects
- [ ] Validate accuracy (>80% target)
- [ ] Document results

---

## 📚 Deliverables

### Code Files (New)
1. ✅ **modality-detector.js** - Core modality detection engine
2. **test-modality-detection.js** - Test suite
3. **modality-patterns.json** - Pattern definitions (optional)

### Code Files (Enhanced)
4. **magnus-14-simple.js** - Enhanced with modality detection
5. **magnus-infinity-core.js** - Enhanced pattern memory & decisions

### Documentation
6. **MODALITY-DETECTION-GUIDE.md** - User guide
7. **TIER-1-PHASE-1A-COMPLETION.md** - Completion report

---

## 🎯 Next Phase Preview

### Phase 1B: Generator Framework (Week 3-4)
Once modality detection is complete, we'll create:
- Web generator (React, Vue, Angular)
- Mobile generator (React Native, Flutter)
- Data generator (Spark, Airflow)
- Factory pattern for generator selection

The modality detection from Phase 1A will feed directly into generator selection!

---

**Phase Status:** 🏗️ IN PROGRESS
**Started:** 2026-01-04
**Target Completion:** 2026-01-18 (2 weeks)
**Current Task:** Implementing ModalityDetector class

Let's build the future! 🚀
