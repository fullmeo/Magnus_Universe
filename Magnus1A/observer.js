/**
 * Magnus_1A Neutral Observer
 * 
 * Observe TOUT sans présupposés
 * Ne privilégie AUCUN pattern a priori
 * Collecte données brutes pour analyse empirique
 */

export class Observer {
  
  constructor(logger) {
    this.logger = logger;
  }
  
  /**
   * Observe une activité de Serigne (requête, génération, etc.)
   */
  async observe(activity) {
    const observation = {
      timestamp: Date.now(),
      type: activity.type,
      context: activity.context || {},
      
      // Extraction de ALL patterns possibles (sans biais)
      patterns: {
        mathematical: this.detectMathematicalPatterns(activity),
        structural: this.detectStructuralPatterns(activity),
        philosophical: this.detectPhilosophicalPatterns(activity),
        temporal: this.detectTemporalPatterns(activity),
        linguistic: this.detectLinguisticPatterns(activity),
        quality: this.detectQualityIndicators(activity),
        behavioral: this.detectBehavioralPatterns(activity)
      },
      
      // Raw data
      raw: activity
    };
    
    // Log observation
    await this.logger.logObservation({
      type: 'NEUTRAL_OBSERVATION',
      context: activity.context?.project || 'General',
      details: this.formatObservation(observation),
      data: observation
    });
    
    return observation;
  }
  
  /**
   * Detect mathematical patterns (ALL, not just favored ones)
   */
  detectMathematicalPatterns(activity) {
    const text = this.extractText(activity);
    const numbers = this.extractNumbers(activity);
    
    const patterns = {
      golden_ratio: this.findGoldenRatio(numbers, text),
      fibonacci: this.findFibonacci(numbers, text),
      ratio_7: this.findRatioOf7(numbers, text),
      ratio_12: this.findRatioOf12(numbers, text),
      hz_432: this.findFrequency432(text),
      hz_440: this.findFrequency440(text),
      pi: this.findPi(numbers, text),
      sqrt_2: this.findSqrt2(numbers, text),
      euler: this.findEuler(numbers, text),
      prime_numbers: this.findPrimes(numbers),
      powers_of_2: this.findPowersOf2(numbers),
      tetraktys: this.findTetraktys(text),
      sacred_geometry: this.findSacredGeometry(text),
      
      // ANY other numerical patterns
      custom_ratios: this.findCustomRatios(numbers),
      repeated_numbers: this.findRepeatedNumbers(numbers),
      sequences: this.findSequences(numbers)
    };
    
    // Return only patterns actually found
    return Object.entries(patterns)
      .filter(([key, value]) => value.found)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }
  
  /**
   * Detect structural patterns
   */
  detectStructuralPatterns(activity) {
    const structure = activity.structure || {};
    
    return {
      symmetry: this.detectSymmetry(structure),
      recursion: this.detectRecursion(structure),
      fractals: this.detectFractals(structure),
      layering: this.detectLayering(structure),
      modularity: this.detectModularity(structure),
      hierarchy: this.detectHierarchy(structure)
    };
  }
  
  /**
   * Detect philosophical references
   */
  detectPhilosophicalPatterns(activity) {
    const text = this.extractText(activity);
    
    const philosophies = {
      pythagorean: /pythagore|pythagorean|tétraktys|tetraktys/i,
      hermetic: /hermetic|hermes|as above so below/i,
      alchemical: /alchim|transmutation|solve et coagula/i,
      sacred_geometry: /sacred geometry|géométrie sacrée|flower of life/i,
      taoist: /tao|yin yang|wu wei/i,
      stoic: /stoic|stoïc|marcus aurelius/i,
      platonic: /plato|platonic|forms|ideas/i,
      neoplatonic: /neoplatonic|plotinus/i,
      
      // ANY philosophical reference
      general_philosophy: /philosophy|philosophie|principle|principe/i
    };
    
    const found = {};
    for (const [key, regex] of Object.entries(philosophies)) {
      if (regex.test(text)) {
        found[key] = {
          found: true,
          matches: text.match(regex)
        };
      }
    }
    
    return found;
  }
  
  /**
   * Detect temporal patterns
   */
  detectTemporalPatterns(activity) {
    return {
      time_of_day: new Date().getHours(),
      day_of_week: new Date().getDay(),
      session_start: activity.session?.start_time,
      duration: activity.session?.duration,
      frequency: activity.frequency, // How often this type of activity
      
      // Patterns in timing
      rhythms: this.detectRhythms(activity),
      peaks: this.detectPeakTimes(activity)
    };
  }
  
  /**
   * Detect linguistic patterns
   */
  detectLinguisticPatterns(activity) {
    const text = this.extractText(activity);
    
    return {
      word_count: text.split(/\s+/).length,
      complexity: this.calculateLinguisticComplexity(text),
      tone: this.detectTone(text),
      certainty: this.detectCertaintyLevel(text),
      question_count: (text.match(/\?/g) || []).length,
      
      // Specific markers
      contains_because: /because|parce que|car/i.test(text),
      contains_requirements: /require|need|must|doit/i.test(text),
      contains_vision: /vision|imagine|contemplat/i.test(text),
      contains_simplification: /simple|just|juste|basic/i.test(text)
    };
  }
  
  /**
   * Detect quality indicators
   */
  detectQualityIndicators(activity) {
    return {
      validation_performed: activity.validations?.length || 0,
      modifications_made: activity.modifications?.length || 0,
      questions_asked: activity.questions?.length || 0,
      time_spent_analyzing: activity.analysis_time,
      acceptance_as_is: activity.accepted_without_change || false,
      
      // Serigne's engagement level
      engagement_score: this.calculateEngagementScore(activity)
    };
  }
  
  /**
   * Detect behavioral patterns
   */
  detectBehavioralPatterns(activity) {
    return {
      request_length: activity.request?.length || 0,
      detail_level: this.assessDetailLevel(activity),
      planning_evident: this.detectPlanningEvidence(activity),
      philosophical_depth: this.assessPhilosophicalDepth(activity),
      
      // Signs of fatigue or rush
      signs_of_fatigue: this.detectFatigueSigns(activity),
      signs_of_rush: this.detectRushSigns(activity)
    };
  }
  
  /**
   * Helper: Extract text from activity
   */
  extractText(activity) {
    let text = '';
    if (activity.request) text += activity.request;
    if (activity.description) text += ' ' + activity.description;
    if (activity.context?.description) text += ' ' + activity.context.description;
    return text.toLowerCase();
  }
  
  /**
   * Helper: Extract numbers from activity
   */
  extractNumbers(activity) {
    const text = this.extractText(activity);
    const matches = text.match(/\d+\.?\d*/g);
    return matches ? matches.map(n => parseFloat(n)) : [];
  }
  
  /**
   * Helper: Find Golden Ratio
   */
  findGoldenRatio(numbers, text) {
    const phi = 1.618;
    const tolerance = 0.05;
    
    // Check explicit mentions
    if (/golden ratio|φ|phi|1\.618/i.test(text)) {
      return { found: true, explicit: true, type: 'textual' };
    }
    
    // Check numbers close to phi
    for (const num of numbers) {
      if (Math.abs(num - phi) < tolerance) {
        return { found: true, explicit: false, type: 'numerical', value: num };
      }
    }
    
    // Check ratios between numbers
    for (let i = 0; i < numbers.length - 1; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        const ratio = numbers[j] / numbers[i];
        if (Math.abs(ratio - phi) < tolerance) {
          return { 
            found: true, 
            explicit: false, 
            type: 'ratio', 
            values: [numbers[i], numbers[j]], 
            ratio 
          };
        }
      }
    }
    
    return { found: false };
  }
  
  /**
   * Helper: Find Fibonacci
   */
  findFibonacci(numbers, text) {
    const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597];
    
    if (/fibonacci/i.test(text)) {
      return { found: true, explicit: true, type: 'textual' };
    }
    
    const fibFound = numbers.filter(n => fib.includes(Math.round(n)));
    if (fibFound.length >= 2) {
      return { found: true, explicit: false, type: 'numerical', values: fibFound };
    }
    
    return { found: false };
  }
  
  /**
   * Helper: Find ratio of 7
   */
  findRatioOf7(numbers, text) {
    const seven = 7;
    const tolerance = 0.1;
    
    for (const num of numbers) {
      if (Math.abs(num - seven) < tolerance || Math.abs(num % seven) < tolerance) {
        return { found: true, type: 'numerical', value: num };
      }
    }
    
    if (/ratio.*7|7.*ratio/i.test(text)) {
      return { found: true, type: 'textual' };
    }
    
    return { found: false };
  }
  
  /**
   * Helper: Find 432 Hz
   */
  findFrequency432(text) {
    if (/432\s*hz|432\s*hertz/i.test(text)) {
      return { found: true, explicit: true };
    }
    return { found: false };
  }
  
  /**
   * Helper: Format observation for logging
   */
  formatObservation(observation) {
    const patterns = observation.patterns;
    let formatted = 'Patterns Detected:\n\n';
    
    for (const [category, categoryPatterns] of Object.entries(patterns)) {
      const found = Object.keys(categoryPatterns).length;
      if (found > 0) {
        formatted += `${category.toUpperCase()}: ${found} patterns\n`;
        for (const [pattern, data] of Object.entries(categoryPatterns)) {
          formatted += `  - ${pattern}: ${JSON.stringify(data)}\n`;
        }
        formatted += '\n';
      }
    }
    
    return formatted;
  }
  
  /**
   * Stub methods (to be implemented based on needs)
   */
  findRatioOf12(numbers, text) { return { found: false }; }
  findFrequency440(text) { return { found: false }; }
  findPi(numbers, text) { return { found: false }; }
  findSqrt2(numbers, text) { return { found: false }; }
  findEuler(numbers, text) { return { found: false }; }
  findPrimes(numbers) { return { found: false }; }
  findPowersOf2(numbers) { return { found: false }; }
  findTetraktys(text) { return { found: false }; }
  findSacredGeometry(text) { 
    return /sacred geometry|géométrie sacrée/i.test(text) ? 
      { found: true } : { found: false };
  }
  findCustomRatios(numbers) { return { found: false }; }
  findRepeatedNumbers(numbers) { return { found: false }; }
  findSequences(numbers) { return { found: false }; }
  
  detectSymmetry(structure) { return null; }
  detectRecursion(structure) { return null; }
  detectFractals(structure) { return null; }
  detectLayering(structure) { return null; }
  detectModularity(structure) { return null; }
  detectHierarchy(structure) { return null; }
  
  detectRhythms(activity) { return null; }
  detectPeakTimes(activity) { return null; }
  
  calculateLinguisticComplexity(text) { return text.split(/\s+/).length > 100 ? 'high' : 'low'; }
  detectTone(text) { return 'neutral'; }
  detectCertaintyLevel(text) { return 0.5; }
  
  calculateEngagementScore(activity) { 
    let score = 0;
    if (activity.validations?.length > 0) score += 0.3;
    if (activity.questions?.length > 0) score += 0.3;
    if (activity.modifications?.length > 0) score += 0.4;
    return score;
  }
  
  assessDetailLevel(activity) { 
    const length = activity.request?.length || 0;
    if (length > 200) return 'high';
    if (length > 50) return 'medium';
    return 'low';
  }
  
  detectPlanningEvidence(activity) { 
    const text = this.extractText(activity);
    return /plan|phase|step|étape/i.test(text);
  }
  
  assessPhilosophicalDepth(activity) {
    const patterns = this.detectPhilosophicalPatterns(activity);
    return Object.keys(patterns).length;
  }
  
  detectFatigueSigns(activity) {
    return {
      quick_acceptance: activity.accepted_without_change,
      low_validation: (activity.validations?.length || 0) < 2,
      no_questions: (activity.questions?.length || 0) === 0
    };
  }
  
  detectRushSigns(activity) {
    return {
      short_request: (activity.request?.length || 0) < 30,
      simplification_words: /simple|just|quick|rapide/i.test(this.extractText(activity))
    };
  }
}

export default Observer;
