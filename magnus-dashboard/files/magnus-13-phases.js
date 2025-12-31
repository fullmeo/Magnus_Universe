/**
 * MAGNUS 13 PHASES: TREE OF LIFE IMPLEMENTATION
 * =============================================
 *
 * Each phase corresponds to a Sephirah on the Tree of Life.
 * Each phase has sacred attributes and cosmic correspondences.
 *
 * Phase 3: Architecture & Design - Enhanced with Sacred Geometry
 *
 * This file implements the metaphysical attributes for each phase.
 */
import { SacredGeometryDetector } from './sacred-geometry-detector.js';

class Magnus13Phases {
  constructor() {
    // Initialize Sacred Geometry Detector for Phase 3
    this.sacredGeometryDetector = new SacredGeometryDetector();
    
    // Complete Tree of Life with all correspondences
    this.treeOfLife = [
      {
        name: 'Ain Soph',
        level: -1,
        hebrew: 'אין סוף',
        meaning: 'The Unmanifested',
        color: '#000000',
        planetary: 'None',
        tarot: 'The Void',
        element: 'Spirit',
        principle: 'Pure Potential',
        challenge: 'Maintaining purity of intention',
        gift: 'Unlimited possibility',
        shadow: 'Formlessness',
        virtue: 'Humility',
        vice: 'Attachment to form'
      },
      {
        name: 'Keter',
        level: 1,
        hebrew: 'כתר',
        meaning: 'The Crown',
        color: '#FFFFFF',
        planetary: 'Neptune',
        tarot: 'The Fool',
        element: 'Fire',
        principle: 'Unity of Purpose',
        challenge: 'Maintaining clarity of vision',
        gift: 'Divine inspiration',
        shadow: 'Ego inflation',
        virtue: 'Humility',
        vice: 'Arrogance'
      },
      {
        name: 'Chokmah',
        level: 2,
        hebrew: 'חכמה',
        meaning: 'Wisdom/Will',
        color: '#E6E6FA',
        planetary: 'Uranus',
        tarot: 'The Magician',
        element: 'Air',
        principle: 'Creative Will',
        challenge: 'Channeling inspiration',
        gift: 'Innovation',
        shadow: 'Scattered energy',
        virtue: 'Courage',
        vice: 'Impulsiveness'
      },
      {
        name: 'Binah',
        level: 3,
        hebrew: 'בינה',
        meaning: 'Understanding',
        color: '#8A2BE2',
        planetary: 'Saturn',
        tarot: 'The High Priestess',
        element: 'Water',
        principle: 'Structured Understanding',
        challenge: 'Balancing form and freedom',
        gift: 'Deep comprehension',
        shadow: 'Rigidity',
        virtue: 'Patience',
        vice: 'Stubbornness'
      },
      {
        name: 'Chesed',
        level: 4,
        hebrew: 'חסד',
        meaning: 'Mercy/Expansion',
        color: '#00FFFF',
        planetary: 'Jupiter',
        tarot: 'The Empress',
        element: 'Earth',
        principle: 'Compassionate Growth',
        challenge: 'Balancing expansion with boundaries',
        gift: 'Generosity',
        shadow: 'Overextension',
        virtue: 'Kindness',
        vice: 'Indulgence'
      },
      {
        name: 'Gevurah',
        level: 5,
        hebrew: 'גבורה',
        meaning: 'Severity/Discipline',
        color: '#FF4500',
        planetary: 'Mars',
        tarot: 'The Emperor',
        element: 'Fire',
        principle: 'Righteous Discipline',
        challenge: 'Balancing strength with compassion',
        gift: 'Courage',
        shadow: 'Ruthlessness',
        virtue: 'Discipline',
        vice: 'Cruelty'
      },
      {
        name: 'Tiphareth',
        level: 6,
        hebrew: 'תפארת',
        meaning: 'Beauty/Balance',
        color: '#FFFF00',
        planetary: 'Sun',
        tarot: 'The Lovers',
        element: 'Air',
        principle: 'Harmonic Balance',
        challenge: 'Maintaining center in chaos',
        gift: 'Beauty',
        shadow: 'Ego',
        virtue: 'Sacrifice',
        vice: 'Pride'
      },
      {
        name: 'Netzach',
        level: 7,
        hebrew: 'נצח',
        meaning: 'Victory/Intuition',
        color: '#32CD32',
        planetary: 'Venus',
        tarot: 'The Chariot',
        element: 'Water',
        principle: 'Creative Victory',
        challenge: 'Balancing emotion with reason',
        gift: 'Intuition',
        shadow: 'Obsession',
        virtue: 'Perseverance',
        vice: 'Stubbornness'
      },
      {
        name: 'Hod',
        level: 8,
        hebrew: 'הוד',
        meaning: 'Splendor/Intellect',
        color: '#1E90FF',
        planetary: 'Mercury',
        tarot: 'Strength',
        element: 'Air',
        principle: 'Intellectual Clarity',
        challenge: 'Balancing analysis with action',
        gift: 'Logic',
        shadow: 'Overthinking',
        virtue: 'Humility',
        vice: 'Arrogance'
      },
      {
        name: 'Yesod',
        level: 9,
        hebrew: 'יסוד',
        meaning: 'Foundation/Dreams',
        color: '#FFD700',
        planetary: 'Moon',
        tarot: 'The Hermit',
        element: 'Water',
        principle: 'Subconscious Foundation',
        challenge: 'Integrating conscious and unconscious',
        gift: 'Intuition',
        shadow: 'Delusion',
        virtue: 'Discernment',
        vice: 'Deception'
      },
      {
        name: 'Malkhuth',
        level: 10,
        hebrew: 'מלכות',
        meaning: 'The Kingdom',
        color: '#FF69B4',
        planetary: 'Earth',
        tarot: 'The World',
        element: 'Earth',
        principle: 'Physical Manifestation',
        challenge: 'Maintaining spiritual connection in matter',
        gift: 'Embodiment',
        shadow: 'Materialism',
        virtue: 'Service',
        vice: 'Greed'
      }
    ];
  }

  /**
   * Get phase by level
   */
  getPhase(level) {
    return this.treeOfLife.find(sephirah => sephirah.level === level);
  }

  /**
   * Get all phases
   */
  getAllPhases() {
    return this.treeOfLife;
  }

  /**
   * Get phase correspondences
   */
  getPhaseCorrespondences(level) {
    const phase = this.getPhase(level);
    if (!phase) return null;

    return {
      sephirah: phase.name,
      hebrew: phase.hebrew,
      meaning: phase.meaning,
      color: phase.color,
      planetary: phase.planetary,
      tarot: phase.tarot,
      element: phase.element,
      principle: phase.principle,
      challenge: phase.challenge,
      gift: phase.gift,
      shadow: phase.shadow,
      virtue: phase.virtue,
      vice: phase.vice
    };
  }

  /**
   * Get sacred timing for phase
   */
  getPhaseTiming(level) {
    const phase = this.getPhase(level);
    if (!phase) return null;

    const timings = {
      daily: this.getDailyTiming(phase),
      weekly: this.getWeeklyTiming(phase),
      monthly: this.getMonthlyTiming(phase),
      yearly: this.getYearlyTiming(phase)
    };

    return {
      correspondences: this.getPhaseCorrespondences(level),
      timings
    };
  }

  /**
   * Get daily timing
   */
  getDailyTiming(phase) {
    const times = {
      'Ain Soph': 'Midnight (12:00 AM) - Time of pure potential',
      'Keter': 'Dawn (6:00 AM) - Time of new inspiration',
      'Chokmah': 'Morning (9:00 AM) - Time of creative energy',
      'Binah': 'Noon (12:00 PM) - Time of structured thinking',
      'Chesed': 'Afternoon (3:00 PM) - Time of compassionate action',
      'Gevurah': 'Evening (6:00 PM) - Time of disciplined focus',
      'Tiphareth': 'Dusk (9:00 PM) - Time of harmonic balance',
      'Netzach': 'Night (12:00 AM) - Time of intuitive insight',
      'Hod': 'Late Night (3:00 AM) - Time of intellectual clarity',
      'Yesod': 'Pre-dawn (6:00 AM) - Time of subconscious integration',
      'Malkhuth': 'Full Day (All Day) - Time of manifestation'
    };

    return times[phase.name] || 'Any time aligned with phase energy';
  }

  /**
   * Get weekly timing
   */
  getWeeklyTiming(phase) {
    const days = {
      'Ain Soph': 'Saturday (Saturn day) - Time of contemplation',
      'Keter': 'Sunday (Sun day) - Time of inspiration',
      'Chokmah': 'Monday (Moon day) - Time of intuition',
      'Binah': 'Tuesday (Mars day) - Time of structure',
      'Chesed': 'Wednesday (Mercury day) - Time of communication',
      'Gevurah': 'Thursday (Jupiter day) - Time of discipline',
      'Tiphareth': 'Friday (Venus day) - Time of beauty',
      'Netzach': 'Saturday (Saturn day) - Time of perseverance',
      'Hod': 'Sunday (Sun day) - Time of clarity',
      'Yesod': 'Monday (Moon day) - Time of dreams',
      'Malkhuth': 'Tuesday (Mars day) - Time of action'
    };

    return days[phase.name] || 'Any day aligned with phase energy';
  }

  /**
   * Get monthly timing
   */
  getMonthlyTiming(phase) {
    const lunarPhases = {
      'Ain Soph': 'New Moon - Time of new beginnings',
      'Keter': 'Waxing Crescent - Time of inspiration growing',
      'Chokmah': 'First Quarter - Time of decisive action',
      'Binah': 'Waxing Gibbous - Time of refinement',
      'Chesed': 'Full Moon - Time of maximum energy',
      'Gevurah': 'Waning Gibbous - Time of release',
      'Tiphareth': 'Last Quarter - Time of balance',
      'Netzach': 'Waning Crescent - Time of introspection',
      'Hod': 'Balsamic Moon - Time of preparation',
      'Yesod': 'Dark Moon - Time of deep subconscious work',
      'Malkhuth': 'Any lunar phase - Time of manifestation'
    };

    return lunarPhases[phase.name] || 'Any lunar phase aligned with phase energy';
  }

  /**
   * Get yearly timing
   */
  getYearlyTiming(phase) {
    const seasons = {
      'Ain Soph': 'Winter Solstice - Time of inner reflection',
      'Keter': 'Spring Equinox - Time of new inspiration',
      'Chokmah': 'Spring - Time of creative growth',
      'Binah': 'Late Spring - Time of structured development',
      'Chesed': 'Summer - Time of expansive energy',
      'Gevurah': 'Late Summer - Time of disciplined focus',
      'Tiphareth': 'Autumn Equinox - Time of balance',
      'Netzach': 'Autumn - Time of intuitive harvest',
      'Hod': 'Late Autumn - Time of intellectual reflection',
      'Yesod': 'Winter - Time of deep foundation work',
      'Malkhuth': 'Any season - Time of manifestation'
    };

    return seasons[phase.name] || 'Any season aligned with phase energy';
  }

  /**
   * Get phase-specific practices
   */
  getPhasePractices(level) {
    const phase = this.getPhase(level);
    if (!phase) return null;

    const practices = {
      'Ain Soph': [
        'Meditation on pure potential',
        'Setting sacred intention',
        'Cleansing mental clutter'
      ],
      'Keter': [
        'Vision board creation',
        'Divine inspiration practices',
        'Crown chakra meditation'
      ],
      'Chokmah': [
        'Creative brainstorming',
        'Willpower exercises',
        'Third eye meditation'
      ],
      'Binah': [
        'Structured analysis',
        'Deep understanding practices',
        'Root chakra grounding'
      ],
      'Chesed': [
        'Compassionate action',
        'Generous giving',
        'Heart chakra opening'
      ],
      'Gevurah': [
        'Discipline training',
        'Boundary setting',
        'Solar plexus strengthening'
      ],
      'Tiphareth': [
        'Beauty appreciation',
        'Harmonic balance practices',
        'Heart center meditation'
      ],
      'Netzach': [
        'Intuitive development',
        'Creative visualization',
        'Sacral chakra activation'
      ],
      'Hod': [
        'Intellectual study',
        'Logical analysis',
        'Throat chakra expression'
      ],
      'Yesod': [
        'Dream work',
        'Subconscious integration',
        'Crown chakra connection'
      ],
      'Malkhuth': [
        'Physical manifestation',
        'Service to others',
        'Earth element grounding'
      ]
    };

    return {
      correspondences: this.getPhaseCorrespondences(level),
      practices: practices[phase.name] || ['General phase practices']
    };
  }

  /**
   * Get phase-specific challenges and solutions
   */
  getPhaseChallenges(level) {
    const phase = this.getPhase(level);
    if (!phase) return null;

    return {
      correspondences: this.getPhaseCorrespondences(level),
      challenge: phase.challenge,
      shadow: phase.shadow,
      virtue: phase.virtue,
      vice: phase.vice,
      solutions: this.getChallengeSolutions(phase)
    };
  }

  /**
   * Get solutions for phase challenges
   */
  getChallengeSolutions(phase) {
    const solutions = {
      'Ain Soph': [
        'Maintain pure intention through meditation',
        'Avoid premature attachment to form',
        'Practice presence in the moment'
      ],
      'Keter': [
        'Ground inspiration in practical action',
        'Balance ego with humility',
        'Seek divine guidance regularly'
      ],
      'Chokmah': [
        'Channel energy through focused practice',
        'Avoid scattered efforts',
        'Cultivate disciplined creativity'
      ],
      'Binah': [
        'Embrace flexibility within structure',
        'Allow for organic growth',
        'Balance logic with intuition'
      ],
      'Chesed': [
        'Set healthy boundaries',
        'Practice discernment in giving',
        'Avoid burnout through balance'
      ],
      'Gevurah': [
        'Temper strength with compassion',
        'Avoid unnecessary harshness',
        'Practice righteous discipline'
      ],
      'Tiphareth': [
        'Maintain center in all circumstances',
        'Balance ego with service',
        'Seek true beauty in simplicity'
      ],
      'Netzach': [
        'Balance emotion with reason',
        'Avoid obsessive attachment',
        'Cultivate healthy perseverance'
      ],
      'Hod': [
        'Balance analysis with action',
        'Avoid overthinking paralysis',
        'Practice humble intellectual inquiry'
      ],
      'Yesod': [
        'Integrate conscious and unconscious',
        'Practice discernment in dreams',
        'Avoid delusion through grounding'
      ],
      'Malkhuth': [
        'Maintain spiritual connection in matter',
        'Practice mindful embodiment',
        'Avoid materialism through service'
      ]
    };

    return solutions[phase.name] || ['General challenge solutions'];
  }

  /**
   * Get complete phase guide
   */
  getCompletePhaseGuide(level) {
    const phase = this.getPhase(level);
    if (!phase) return null;

    return {
      phase: this.getPhaseCorrespondences(level),
      timing: this.getPhaseTiming(level),
      practices: this.getPhasePractices(level),
      challenges: this.getPhaseChallenges(level),
      integration: this.getIntegrationGuidance(level)
    };
  }

  /**
   * Get integration guidance for phase
   */
  getIntegrationGuidance(level) {
    const phase = this.getPhase(level);
    if (!phase) return null;

    return {
      before: `Prepare for ${phase.name} by ${this.getPreparation(phase)}`,
      during: `While in ${phase.name}, focus on ${this.getFocus(phase)}`,
      after: `After ${phase.name}, integrate by ${this.getIntegration(phase)}`,
      warning: `Beware of ${phase.shadow} in ${phase.name}`
    };
  }

  /**
   * Get preparation for phase
   */
  getPreparation(phase) {
    const preparations = {
      'Ain Soph': 'clearing mental clutter and setting pure intention',
      'Keter': 'opening to divine inspiration and setting clear vision',
      'Chokmah': 'cultivating creative energy and focused will',
      'Binah': 'grounding inspiration in structured understanding',
      'Chesed': 'opening heart to compassionate expansion',
      'Gevurah': 'strengthening discipline and setting boundaries',
      'Tiphareth': 'seeking balance and harmonic integration',
      'Netzach': 'developing intuition and creative perseverance',
      'Hod': 'clarifying thoughts and organizing ideas',
      'Yesod': 'connecting conscious and unconscious minds',
      'Malkhuth': 'grounding spiritual energy in physical action'
    };

    return preparations[phase.name] || 'general preparation';
  }

  /**
   * Get focus for phase
   */
  getFocus(phase) {
    const focuses = {
      'Ain Soph': 'maintaining pure potential without premature form',
      'Keter': 'receiving and understanding divine inspiration',
      'Chokmah': 'channeling creative will into focused action',
      'Binah': 'structuring understanding and creating form',
      'Chesed': 'expanding with compassion and generosity',
      'Gevurah': 'applying disciplined focus and righteous boundaries',
      'Tiphareth': 'achieving harmonic balance and beauty',
      'Netzach': 'following intuition and creative victory',
      'Hod': 'clarifying thoughts and organizing systematically',
      'Yesod': 'integrating subconscious and conscious awareness',
      'Malkhuth': 'manifesting spiritual energy in physical reality'
    };

    return focuses[phase.name] || 'general focus';
  }

  /**
   * Get integration for phase
   */
  getIntegration(phase) {
    const integrations = {
      'Ain Soph': 'integrating pure potential into conscious awareness',
      'Keter': 'grounding inspiration in practical vision',
      'Chokmah': 'channeling creative energy into productive action',
      'Binah': 'integrating structure with inspired understanding',
      'Chesed': 'balancing expansion with healthy boundaries',
      'Gevurah': 'integrating discipline with compassionate action',
      'Tiphareth': 'maintaining balance in all aspects of life',
      'Netzach': 'harmonizing intuition with rational thought',
      'Hod': 'organizing intellectual insights into coherent systems',
      'Yesod': 'integrating subconscious wisdom with conscious action',
      'Malkhuth': 'embodiment of spiritual principles in daily life'
    };

    return integrations[phase.name] || 'general integration';
  }
}

// Export the enhanced phases with Sacred Geometry integration
export {
  Magnus13Phases
};

export default Magnus13Phases;