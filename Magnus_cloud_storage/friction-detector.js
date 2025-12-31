/**
 * Magnus Friction Detector
 * 
 * Analyzes Git history to detect development friction points
 * 
 * Features:
 * - Git commit analysis
 * - Blocked work detection
 * - Time waste calculation
 * - Recurring problem identification
 * - Solution recommendations
 * 
 * Friction types detected:
 * - Setup friction (CloudZero solves this!)
 * - Integration friction (API, external services)
 * - Testing friction (test setup, failures)
 * - Deployment friction (CI/CD, builds)
 * - Configuration friction (env vars, config files)
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

class FrictionDetector {
  constructor(config = {}) {
    this.config = {
      minCommitsForFriction: config.minCommitsForFriction || 3,
      timeThresholdHours: config.timeThresholdHours || 2,
      lookbackDays: config.lookbackDays || 90,
      frictionKeywords: config.frictionKeywords || [
        'fix', 'bug', 'error', 'issue', 'problem',
        'stuck', 'blocked', 'failing', 'broken',
        'wip', 'temp', 'todo', 'hack'
      ],
      setupKeywords: config.setupKeywords || [
        'setup', 'config', 'install', 'init',
        'stripe', 'payment', 'auth', 'database',
        'aws', 's3', 'env', 'credentials'
      ]
    };

    this.frictions = [];
    this.statistics = {
      projectsAnalyzed: 0,
      totalCommits: 0,
      frictionPoints: 0,
      estimatedTimeWasted: 0
    };
  }

  /**
   * Main detection flow - analyze Git history for friction
   */
  async detect(projectPaths) {
    console.log(`🔥 Starting friction detection across ${projectPaths.length} projects...`);

    const allFrictions = [];

    for (const projectPath of projectPaths) {
      try {
        const friction = await this.analyzeProject(projectPath);
        if (friction) {
          allFrictions.push(friction);
        }
        this.statistics.projectsAnalyzed++;
      } catch (error) {
        console.warn(`⚠️  Could not analyze ${projectPath}: ${error.message}`);
      }
    }

    // Group frictions by type
    const grouped = this.groupFrictionsByType(allFrictions);

    // Calculate total time wasted
    const totalWasted = allFrictions.reduce(
      (sum, f) => sum + (f.estimatedTimeWasted || 0), 0
    );
    this.statistics.estimatedTimeWasted = totalWasted;

    console.log(`✅ Found ${allFrictions.length} friction points`);
    console.log(`⏱️  Estimated time wasted: ${(totalWasted / 60).toFixed(1)} hours`);

    return {
      frictions: allFrictions,
      grouped,
      statistics: this.statistics,
      recommendations: this.generateRecommendations(grouped)
    };
  }

  /**
   * Analyze a single project's Git history
   */
  async analyzeProject(projectPath) {
    console.log(`📊 Analyzing: ${path.basename(projectPath)}`);

    // Check if it's a Git repo
    const isGitRepo = await this.isGitRepository(projectPath);
    if (!isGitRepo) {
      console.log(`   ⚠️  Not a Git repository, skipping`);
      return null;
    }

    // Get commit history
    const commits = await this.getCommitHistory(projectPath);
    this.statistics.totalCommits += commits.length;

    if (commits.length === 0) {
      return null;
    }

    // Analyze commits for friction patterns
    const frictionPoints = this.analyzeCommits(commits, projectPath);

    // Detect blocked work periods
    const blockedPeriods = this.detectBlockedPeriods(commits);

    // Identify recurring problems
    const recurringProblems = this.identifyRecurringProblems(commits);

    // Calculate time wasted
    const timeWasted = this.calculateTimeWasted(
      frictionPoints,
      blockedPeriods,
      recurringProblems
    );

    this.statistics.frictionPoints += frictionPoints.length;

    return {
      project: path.basename(projectPath),
      path: projectPath,
      totalCommits: commits.length,
      frictionPoints,
      blockedPeriods,
      recurringProblems,
      estimatedTimeWasted: timeWasted,
      severity: this.calculateSeverity(frictionPoints, timeWasted)
    };
  }

  /**
   * Check if directory is a Git repository
   */
  async isGitRepository(projectPath) {
    try {
      await execAsync('git rev-parse --git-dir', { cwd: projectPath });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get Git commit history
   */
  async getCommitHistory(projectPath) {
    const since = new Date();
    since.setDate(since.getDate() - this.config.lookbackDays);
    const sinceDate = since.toISOString().split('T')[0];

    try {
      const { stdout } = await execAsync(
        `git log --since="${sinceDate}" --pretty=format:"%H|%an|%ae|%ai|%s" --no-merges`,
        { cwd: projectPath, maxBuffer: 10 * 1024 * 1024 }
      );

      if (!stdout.trim()) {
        return [];
      }

      const commits = stdout.trim().split('\n').map(line => {
        const [hash, author, email, date, message] = line.split('|');
        return {
          hash,
          author,
          email,
          date: new Date(date),
          message,
          timestamp: new Date(date).getTime()
        };
      });

      return commits;
    } catch (error) {
      console.warn(`   Could not get Git history: ${error.message}`);
      return [];
    }
  }

  /**
   * Analyze commits for friction patterns
   */
  analyzeCommits(commits, projectPath) {
    const frictionPoints = [];

    for (const commit of commits) {
      const message = commit.message.toLowerCase();

      // Check for friction keywords
      const frictionType = this.detectFrictionType(message);

      if (frictionType) {
        frictionPoints.push({
          type: frictionType,
          commit: commit.hash.substring(0, 7),
          date: commit.date,
          message: commit.message,
          author: commit.author,
          project: path.basename(projectPath)
        });
      }
    }

    return frictionPoints;
  }

  /**
   * Detect friction type from commit message
   */
  detectFrictionType(message) {
    const patterns = {
      SETUP_FRICTION: [
        /setup|config|install|init/i,
        /stripe.*setup|payment.*config/i,
        /auth.*setup|authentication.*config/i,
        /database.*setup|db.*config/i,
        /aws.*config|s3.*setup/i,
        /env.*var|credential|api.*key/i
      ],
      INTEGRATION_FRICTION: [
        /integration.*fix|api.*error/i,
        /external.*service|third.*party/i,
        /webhook|callback.*issue/i,
        /cors|cross.*origin/i
      ],
      TESTING_FRICTION: [
        /test.*fail|failing.*test/i,
        /test.*setup|jest.*config/i,
        /mock.*issue|stub.*problem/i,
        /test.*env|testing.*environment/i
      ],
      DEPLOYMENT_FRICTION: [
        /deploy.*fail|deployment.*error/i,
        /build.*fail|build.*error/i,
        /ci.*fail|pipeline.*error/i,
        /docker.*issue|container.*problem/i
      ],
      CONFIGURATION_FRICTION: [
        /config.*fix|configuration.*error/i,
        /env.*issue|environment.*problem/i,
        /settings.*bug|options.*error/i
      ],
      BUG_FIX: [
        /fix.*bug|bug.*fix/i,
        /resolve.*issue|issue.*resolved/i,
        /patch|hotfix/i
      ],
      BLOCKED_WORK: [
        /wip|work.*in.*progress/i,
        /temp|temporary.*fix/i,
        /hack|workaround/i,
        /stuck|blocked/i
      ]
    };

    for (const [type, regexList] of Object.entries(patterns)) {
      for (const regex of regexList) {
        if (regex.test(message)) {
          return type;
        }
      }
    }

    // Check for general friction keywords
    const hasFrictionKeyword = this.config.frictionKeywords.some(keyword =>
      message.includes(keyword)
    );

    if (hasFrictionKeyword) {
      return 'GENERAL_FRICTION';
    }

    return null;
  }

  /**
   * Detect blocked work periods (multiple commits on same issue)
   */
  detectBlockedPeriods(commits) {
    const blockedPeriods = [];
    const issueGroups = new Map();

    // Group commits by issue/topic
    for (const commit of commits) {
      const message = commit.message.toLowerCase();
      
      // Extract issue keywords
      const keywords = message
        .match(/\b\w+\b/g)
        .filter(word => word.length > 3)
        .slice(0, 3)
        .join(' ');

      if (!issueGroups.has(keywords)) {
        issueGroups.set(keywords, []);
      }
      issueGroups.get(keywords).push(commit);
    }

    // Find groups with multiple commits (indicating blocked work)
    for (const [keywords, group] of issueGroups.entries()) {
      if (group.length >= this.config.minCommitsForFriction) {
        const startTime = group[group.length - 1].timestamp;
        const endTime = group[0].timestamp;
        const duration = (endTime - startTime) / (1000 * 60 * 60); // hours

        if (duration >= this.config.timeThresholdHours) {
          blockedPeriods.push({
            issue: keywords,
            commits: group.length,
            duration: duration.toFixed(1),
            startDate: new Date(startTime),
            endDate: new Date(endTime),
            messages: group.map(c => c.message)
          });
        }
      }
    }

    return blockedPeriods;
  }

  /**
   * Identify recurring problems (same type of friction multiple times)
   */
  identifyRecurringProblems(commits) {
    const problems = new Map();

    for (const commit of commits) {
      const frictionType = this.detectFrictionType(commit.message.toLowerCase());
      
      if (frictionType) {
        if (!problems.has(frictionType)) {
          problems.set(frictionType, []);
        }
        problems.get(frictionType).push(commit);
      }
    }

    const recurring = [];

    for (const [type, occurrences] of problems.entries()) {
      if (occurrences.length >= this.config.minCommitsForFriction) {
        recurring.push({
          type,
          occurrences: occurrences.length,
          firstSeen: occurrences[occurrences.length - 1].date,
          lastSeen: occurrences[0].date,
          examples: occurrences.slice(0, 3).map(c => c.message)
        });
      }
    }

    return recurring.sort((a, b) => b.occurrences - a.occurrences);
  }

  /**
   * Calculate estimated time wasted
   */
  calculateTimeWasted(frictionPoints, blockedPeriods, recurringProblems) {
    let totalMinutes = 0;

    // Time per friction point (average)
    const minutesPerFriction = {
      SETUP_FRICTION: 120,        // 2 hours average for setup
      INTEGRATION_FRICTION: 90,   // 1.5 hours for integrations
      TESTING_FRICTION: 60,       // 1 hour for test issues
      DEPLOYMENT_FRICTION: 90,    // 1.5 hours for deploy issues
      CONFIGURATION_FRICTION: 45, // 45 min for config
      BUG_FIX: 30,               // 30 min average bug fix
      BLOCKED_WORK: 60,          // 1 hour blocked
      GENERAL_FRICTION: 30       // 30 min general
    };

    // Add friction points time
    for (const friction of frictionPoints) {
      totalMinutes += minutesPerFriction[friction.type] || 30;
    }

    // Add blocked periods time
    for (const period of blockedPeriods) {
      totalMinutes += parseFloat(period.duration) * 60;
    }

    // Add recurring problems penalty (they waste more time)
    for (const problem of recurringProblems) {
      const penalty = problem.occurrences * 15; // 15 min per recurrence
      totalMinutes += penalty;
    }

    return Math.round(totalMinutes);
  }

  /**
   * Calculate severity of friction
   */
  calculateSeverity(frictionPoints, timeWasted) {
    const hoursWasted = timeWasted / 60;

    if (hoursWasted >= 8 || frictionPoints.length >= 10) {
      return 'HIGH';
    } else if (hoursWasted >= 4 || frictionPoints.length >= 5) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  /**
   * Group frictions by type
   */
  groupFrictionsByType(allFrictions) {
    const grouped = new Map();

    for (const projectFriction of allFrictions) {
      for (const friction of projectFriction.frictionPoints) {
        if (!grouped.has(friction.type)) {
          grouped.set(friction.type, {
            type: friction.type,
            count: 0,
            projects: new Set(),
            examples: []
          });
        }

        const group = grouped.get(friction.type);
        group.count++;
        group.projects.add(friction.project);
        
        if (group.examples.length < 5) {
          group.examples.push({
            project: friction.project,
            message: friction.message,
            date: friction.date
          });
        }
      }
    }

    return Array.from(grouped.values()).map(g => ({
      ...g,
      projects: Array.from(g.projects),
      affectedProjects: g.projects.size
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Generate recommendations based on friction analysis
   */
  generateRecommendations(groupedFrictions) {
    const recommendations = [];

    for (const friction of groupedFrictions) {
      const rec = this.getRecommendationForFriction(friction);
      if (rec) {
        recommendations.push(rec);
      }
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get specific recommendation for friction type
   */
  getRecommendationForFriction(friction) {
    const recommendations = {
      SETUP_FRICTION: {
        title: 'Setup Friction Detected',
        description: `Found ${friction.count} setup-related issues across ${friction.affectedProjects} projects`,
        solution: 'Use CloudZero Proxy to eliminate cloud service setup friction',
        impact: 'HIGH',
        priority: 10,
        action: 'Generate unified cloud service proxy (CloudZero pattern)',
        example: 'CloudZero already solves this! Stripe, S3, Auth0, etc. in one simple API'
      },
      INTEGRATION_FRICTION: {
        title: 'Integration Friction Detected',
        description: `Found ${friction.count} integration issues across ${friction.affectedProjects} projects`,
        solution: 'Create integration abstraction layer',
        impact: 'HIGH',
        priority: 9,
        action: 'Generate integration wrapper with error handling',
        example: 'Abstract external APIs behind unified interface'
      },
      TESTING_FRICTION: {
        title: 'Testing Friction Detected',
        description: `Found ${friction.count} test-related issues across ${friction.affectedProjects} projects`,
        solution: 'Standardize test setup and configuration',
        impact: 'MEDIUM',
        priority: 7,
        action: 'Create test setup template with common mocks',
        example: 'Jest config template + common test utilities'
      },
      DEPLOYMENT_FRICTION: {
        title: 'Deployment Friction Detected',
        description: `Found ${friction.count} deployment issues across ${friction.affectedProjects} projects`,
        solution: 'Improve CI/CD pipeline and deployment process',
        impact: 'HIGH',
        priority: 8,
        action: 'Create standardized deployment configuration',
        example: 'GitHub Actions template + Docker setup'
      },
      CONFIGURATION_FRICTION: {
        title: 'Configuration Friction Detected',
        description: `Found ${friction.count} config issues across ${friction.affectedProjects} projects`,
        solution: 'Centralize configuration management',
        impact: 'MEDIUM',
        priority: 6,
        action: 'Create configuration template and validator',
        example: 'Config schema + environment validator'
      }
    };

    return recommendations[friction.type] || null;
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return this.statistics;
  }

  /**
   * Reset detector
   */
  reset() {
    this.frictions = [];
    this.statistics = {
      projectsAnalyzed: 0,
      totalCommits: 0,
      frictionPoints: 0,
      estimatedTimeWasted: 0
    };
  }
}

export default FrictionDetector;
