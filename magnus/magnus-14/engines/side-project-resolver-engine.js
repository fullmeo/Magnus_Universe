/**
 * SIDE PROJECT RESOLVER ENGINE
 *
 * When you get blocked on main project, suggest focused side project.
 * Side project ROI: 3-5x (solves multiple future projects).
 *
 * Core Pattern:
 * - Blockers in main project → Solutions in side project
 * - Side project knowledge → Integrated back to main project
 * - Pattern: Main project stalled 4+ sessions → Create side project
 * - Duration: 1-month focused work → Major breakthrough
 */

class SideProjectResolverEngine {
  constructor() {
    this.name = 'Side Project Resolver Engine';
    this.version = '14.1';
  }

  analyze(projectInput) {
    const detectedBlockers = projectInput.blockers || [];
    const suggestedProjects = this.suggestSideProjects(detectedBlockers, projectInput);

    return {
      blockerCount: detectedBlockers.length,
      severityDistribution: this.calculateSeverityDistribution(detectedBlockers),

      sideProjectsNeeded: suggestedProjects,
      expectedSideProjectCount: Math.min(Math.ceil(detectedBlockers.filter(b => b.severity === 'HIGH' || b.severity === 'CRITICAL').length / 2), 3),

      triggerCondition: 'When main project blocked for 3-4+ sessions without breakthrough',
      expectedDuration: '4-8 sessions (1-2 weeks focus)',
      expectedOutput: 'Knowledge artifact applicable to main project + 2-3 future projects',
      roi: '3-5x (each side project unlocks multiple future projects)',

      recommendation: this.generateRecommendation(detectedBlockers, suggestedProjects),

      confidence: 0.85
    };
  }

  suggestSideProjects(blockers, projectInput) {
    const suggestions = [];

    blockers.forEach((blocker, index) => {
      if (blocker.severity === 'HIGH' || blocker.severity === 'CRITICAL') {
        const focus = this.deriveFocus(blocker.description);

        suggestions.push({
          order: suggestions.length + 1,
          mainBlocker: blocker.description,
          suggestedSideProject: `${projectInput.projectName}-${focus.replace(/\s+/g, '_')}-poc`,
          focus: focus,
          goal: `Resolve blocker: "${blocker.description}"`,
          estimatedDuration: '4-8 sessions (1-2 weeks)',
          expectedOutput: `Knowledge artifact + working POC for ${focus}`,
          expectedROI: '3-5x (applicable to main project + future projects)',
          triggerTiming: `When main project stalls on this blocker (3-4+ sessions)`
        });
      }
    });

    return suggestions;
  }

  deriveFocus(blockerDescription) {
    const desc = blockerDescription?.toLowerCase() || '';

    // Pattern matching for side project focus
    const focusMap = {
      'latency': 'Real-time performance',
      'real-time': 'Real-time sync',
      'music': 'Music theory',
      'accompaniment': 'Accompaniment generation',
      'data': 'Data structure design',
      'detection': 'Pattern detection',
      'sync': 'State synchronization',
      'async': 'Async flow',
      'learning': 'Learning algorithm',
      'model': 'ML model training',
      'audio': 'Audio processing',
      'integration': 'Component integration'
    };

    for (const [key, value] of Object.entries(focusMap)) {
      if (desc.includes(key)) {
        return value;
      }
    }

    // Fallback: use first noun-like word
    const words = desc.split(/\s+/);
    return words.find(w => w.length > 4) || 'Core challenge';
  }

  calculateSeverityDistribution(blockers) {
    const distribution = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0
    };

    blockers.forEach(b => {
      const severity = b.severity || 'MEDIUM';
      if (distribution.hasOwnProperty(severity)) {
        distribution[severity]++;
      }
    });

    return distribution;
  }

  generateRecommendation(blockers, suggestedProjects) {
    if (suggestedProjects.length === 0) {
      return `No high-severity blockers detected.

Side projects are optional but recommended when:
- Main project progression slows (stalled for 3-4+ sessions)
- A specific technical challenge needs deep exploration
- Cross-cutting knowledge could benefit multiple projects

When ready, create focused 1-2 week side project to advance knowledge.`;
    }

    if (suggestedProjects.length <= 2) {
      return `${suggestedProjects.length} side project(s) recommended to resolve high-severity blockers.

Pattern: Create side project when main project blocks
├─ Typical trigger: After 3-4 sessions without breakthrough
├─ Side project duration: 1-2 weeks focused work
├─ Expected outcome: Knowledge artifact solves main blocker + future projects
└─ ROI: 3-5x (applicable beyond immediate problem)

First side project: "${suggestedProjects[0]?.suggestedSideProject}"
Focus: ${suggestedProjects[0]?.focus}
Expected result: Unblock main project + create reusable knowledge`;

    } else {
      return `${suggestedProjects.length} side projects recommended.

Recommended sequencing:
${suggestedProjects.map((p, i) => `${i + 1}. ${p.focus} (resolves: ${p.mainBlocker})`).join('\n')}

Strategy: Create side projects sequentially as blockers emerge.
- Don't create all at once
- Wait for blocker to manifest in main project
- Each side project typically solves 1-2 critical blockers + enables future work

Pattern ROI: 3-5x per side project`;
    }
  }
}

module.exports = SideProjectResolverEngine;
