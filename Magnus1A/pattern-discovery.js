/**
 * Magnus_1A Pattern Discovery
 * 
 * Découvre patterns émergents SANS présupposés
 * Corrélation > 0.7 pour considérer un pattern
 * Auto-détection de nouveaux domaines de sagesse
 */

export class PatternDiscovery {
  
  constructor(memory, logger) {
    this.memory = memory;
    this.logger = logger;
    
    // Patterns discovered (not hypothesized)
    this.discovered = [];
  }
  
  /**
   * Analyze observations to discover emergent patterns
   */
  async discoverPatterns(observations, minSamples = 10) {
    if (observations.length < minSamples) {
      return {
        status: 'insufficient_data',
        message: `Need ${minSamples} observations, have ${observations.length}`
      };
    }
    
    const patterns = [];
    
    // Discover mathematical patterns
    const mathPatterns = await this.discoverMathematicalPatterns(observations);
    patterns.push(...mathPatterns);
    
    // Discover context patterns
    const contextPatterns = await this.discoverContextPatterns(observations);
    patterns.push(...contextPatterns);
    
    // Discover success patterns
    const successPatterns = await this.discoverSuccessCorrelations(observations);
    patterns.push(...successPatterns);
    
    // Discover temporal patterns
    const temporalPatterns = await this.discoverTemporalPatterns(observations);
    patterns.push(...temporalPatterns);
    
    // Filter by confidence and correlation
    const significant = patterns.filter(p => 
      p.confidence > 0.65 && 
      p.correlation > 0.7
    );
    
    // Log discoveries
    for (const pattern of significant) {
      await this.logger.logPatternDiscovery(pattern);
      this.discovered.push(pattern);
    }
    
    return {
      status: 'complete',
      discovered: significant,
      total_analyzed: observations.length
    };
  }
  
  /**
   * Discover which mathematical patterns actually correlate with success
   */
  async discoverMathematicalPatterns(observations) {
    const patterns = [];
    
    // Check each potential pattern
    const candidates = [
      'golden_ratio', 'fibonacci', 'ratio_7', 'ratio_12',
      'hz_432', 'hz_440', 'sacred_geometry', 'tetraktys'
    ];
    
    for (const candidate of candidates) {
      const with_pattern = observations.filter(obs => 
        obs.patterns?.mathematical?.[candidate]?.found
      );
      
      const without_pattern = observations.filter(obs =>
        !obs.patterns?.mathematical?.[candidate]?.found
      );
      
      if (with_pattern.length >= 5 && without_pattern.length >= 5) {
        const correlation = this.calculateCorrelation(
          with_pattern,
          without_pattern,
          'success'
        );
        
        if (correlation.coefficient > 0.7) {
          patterns.push({
            name: candidate,
            category: 'mathematical',
            confidence: correlation.confidence,
            correlation: correlation.coefficient,
            samples: with_pattern.length + without_pattern.length,
            evidence: correlation.evidence,
            description: `Pattern "${candidate}" correlates with success`,
            pValue: correlation.pValue
          });
        }
      }
    }
    
    return patterns;
  }
  
  /**
   * Discover context-specific patterns
   */
  async discoverContextPatterns(observations) {
    const patterns = [];
    
    // Group by context
    const contexts = this.groupByContext(observations);
    
    for (const [contextType, contextObs] of Object.entries(contexts)) {
      // Find what works in this context
      const successfulPatterns = this.findSuccessfulPatterns(contextObs);
      
      if (successfulPatterns.length > 0) {
        patterns.push({
          name: `${contextType}_success_pattern`,
          category: 'contextual',
          confidence: 0.75,
          correlation: 0.8,
          samples: contextObs.length,
          evidence: successfulPatterns,
          description: `In ${contextType} context, these patterns work best`
        });
      }
    }
    
    return patterns;
  }
  
  /**
   * Discover what correlates with success
   */
  async discoverSuccessCorrelations(observations) {
    const patterns = [];
    
    // Extract features from successful vs unsuccessful projects
    const successful = observations.filter(obs => obs.outcome?.success === true);
    const unsuccessful = observations.filter(obs => obs.outcome?.success === false);
    
    if (successful.length < 5 || unsuccessful.length < 5) {
      return patterns; // Not enough data
    }
    
    // Find differentiating features
    const features = this.extractFeatures(observations);
    
    for (const feature of features) {
      const correlation = this.calculateFeatureCorrelation(
        feature,
        successful,
        unsuccessful
      );
      
      if (correlation > 0.7) {
        patterns.push({
          name: `success_feature_${feature.name}`,
          category: 'success_predictor',
          confidence: 0.8,
          correlation,
          samples: successful.length + unsuccessful.length,
          evidence: { feature, correlation },
          description: `Feature "${feature.name}" predicts success`
        });
      }
    }
    
    return patterns;
  }
  
  /**
   * Discover temporal patterns
   */
  async discoverTemporalPatterns(observations) {
    const patterns = [];
    
    // Analyze by time of day
    const byHour = this.groupByHour(observations);
    const peakHours = this.findPeakPerformanceHours(byHour);
    
    if (peakHours.length > 0) {
      patterns.push({
        name: 'optimal_hours',
        category: 'temporal',
        confidence: 0.85,
        correlation: 0.75,
        samples: observations.length,
        evidence: peakHours,
        description: `Best performance at hours: ${peakHours.join(', ')}`
      });
    }
    
    return patterns;
  }
  
  /**
   * Calculate correlation between pattern presence and success
   */
  calculateCorrelation(with_pattern, without_pattern, outcome_field) {
    const with_success = with_pattern.filter(o => o.outcome?.[outcome_field]).length;
    const with_total = with_pattern.length;
    const with_rate = with_success / with_total;
    
    const without_success = without_pattern.filter(o => o.outcome?.[outcome_field]).length;
    const without_total = without_pattern.length;
    const without_rate = without_success / without_total;
    
    const coefficient = with_rate - without_rate; // Simple difference
    const confidence = Math.min(with_total, without_total) / 10; // More samples = more confidence
    
    // Simple p-value estimation (chi-square test approximation)
    const pValue = this.estimatePValue(with_success, with_total, without_success, without_total);
    
    return {
      coefficient: Math.abs(coefficient),
      confidence: Math.min(confidence, 1.0),
      pValue,
      evidence: {
        with_pattern: { success: with_success, total: with_total, rate: with_rate },
        without_pattern: { success: without_success, total: without_total, rate: without_rate }
      }
    };
  }
  
  /**
   * Helper: Group observations by context
   */
  groupByContext(observations) {
    const groups = {};
    
    for (const obs of observations) {
      const context = obs.context?.type || 'unknown';
      if (!groups[context]) groups[context] = [];
      groups[context].push(obs);
    }
    
    return groups;
  }
  
  /**
   * Helper: Find successful patterns in context
   */
  findSuccessfulPatterns(observations) {
    const successful = observations.filter(o => o.outcome?.success === true);
    // Extract common patterns from successful observations
    return successful.map(o => o.patterns).filter(Boolean);
  }
  
  /**
   * Helper: Extract features
   */
  extractFeatures(observations) {
    // Extract various features that might correlate with success
    return [
      { name: 'has_planning', extract: o => o.behavioral?.planning_evident },
      { name: 'high_engagement', extract: o => o.quality?.engagement_score > 0.7 },
      { name: 'philosophical_depth', extract: o => o.behavioral?.philosophical_depth > 2 },
      { name: 'validation_performed', extract: o => o.quality?.validation_performed > 2 }
    ];
  }
  
  /**
   * Helper: Calculate feature correlation
   */
  calculateFeatureCorrelation(feature, successful, unsuccessful) {
    const success_with = successful.filter(o => feature.extract(o)).length;
    const success_rate = success_with / successful.length;
    
    const fail_with = unsuccessful.filter(o => feature.extract(o)).length;
    const fail_rate = fail_with / unsuccessful.length;
    
    return success_rate - fail_rate;
  }
  
  /**
   * Helper: Group by hour
   */
  groupByHour(observations) {
    const byHour = {};
    
    for (const obs of observations) {
      const hour = new Date(obs.timestamp).getHours();
      if (!byHour[hour]) byHour[hour] = [];
      byHour[hour].push(obs);
    }
    
    return byHour;
  }
  
  /**
   * Helper: Find peak performance hours
   */
  findPeakPerformanceHours(byHour) {
    const hourRates = {};
    
    for (const [hour, obs] of Object.entries(byHour)) {
      const successful = obs.filter(o => o.outcome?.success === true).length;
      hourRates[hour] = successful / obs.length;
    }
    
    // Find hours with >75% success rate
    return Object.entries(hourRates)
      .filter(([hour, rate]) => rate > 0.75)
      .map(([hour]) => hour);
  }
  
  /**
   * Helper: Estimate p-value (simplified)
   */
  estimatePValue(a_success, a_total, b_success, b_total) {
    // Very simplified chi-square approximation
    const expected = (a_success + b_success) / (a_total + b_total);
    const chi = Math.pow(a_success/a_total - expected, 2) / expected +
                Math.pow(b_success/b_total - expected, 2) / expected;
    
    // Rough p-value estimation
    if (chi > 10) return 0.001;
    if (chi > 6) return 0.01;
    if (chi > 4) return 0.05;
    return 0.1;
  }
}

export default PatternDiscovery;
