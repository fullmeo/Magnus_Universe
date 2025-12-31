/**
 * Magnus Abandonment Detector
 * 
 * Detects abandoned/dead projects and analyzes why they were abandoned
 * 
 * Features:
 * - Last activity detection
 * - Progress estimation
 * - Death point identification
 * - Cause analysis
 * - Recovery recommendations
 * 
 * Abandonment causes detected:
 * - Setup friction (too hard to start)
 * - Complexity creep (grew too complex)
 * - Scope creep (requirements changed)
 * - Integration failure (external deps failed)
 * - Lost interest (no commits for months)
 * - Blocked work (stuck on hard problem)
 * - Technical debt (code became unmaintainable)
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

class AbandonmentDetector {
  constructor(config = {}) {
    this.config = {
      abandonedThresholdDays: config.abandonedThresholdDays || 90,
      dormantThresholdDays: config.dormantThresholdDays || 30,
      minCommitsToConsider: config.minCommitsToConsider || 3,
      progressIndicators: config.progressIndicators || [
        'package.json',
        'README.md',
        'src/',
        'test/',
        '.git/'
      ]
    };

    this.abandonedProjects = [];
    this.statistics = {
      projectsScanned: 0,
      abandonedCount: 0,
      dormantCount: 0,
      activeCount: 0,
      totalWastedEffort: 0
    };
  }

  /**
   * Main detection flow - find abandoned projects
   */
  async detect(projectPaths) {
    console.log(`💀 Starting abandonment detection across ${projectPaths.length} projects...`);

    const results = [];

    for (const projectPath of projectPaths) {
      try {
        const analysis = await this.analyzeProject(projectPath);
        if (analysis) {
          results.push(analysis);
          this.updateStatistics(analysis);
        }
      } catch (error) {
        console.warn(`⚠️  Could not analyze ${projectPath}: ${error.message}`);
      }
    }

    // Categorize by status
    const categorized = this.categorizeProjects(results);

    // Identify patterns
    const patterns = this.identifyAbandonmentPatterns(
      categorized.abandoned
    );

    console.log(`✅ Analysis complete:`);
    console.log(`   💀 Abandoned: ${categorized.abandoned.length}`);
    console.log(`   😴 Dormant: ${categorized.dormant.length}`);
    console.log(`   ✨ Active: ${categorized.active.length}`);

    return {
      projects: results,
      categorized,
      patterns,
      statistics: this.statistics,
      recommendations: this.generateRecommendations(categorized, patterns)
    };
  }

  /**
   * Analyze a single project
   */
  async analyzeProject(projectPath) {
    const projectName = path.basename(projectPath);
    console.log(`📊 Analyzing: ${projectName}`);

    // Check if directory exists
    try {
      await fs.access(projectPath);
    } catch {
      console.log(`   ⚠️  Directory does not exist, skipping`);
      return null;
    }

    // Get basic info
    const stats = await this.getProjectStats(projectPath);
    
    // Check if it's a Git repo
    const isGitRepo = await this.isGitRepository(projectPath);
    
    let gitInfo = null;
    if (isGitRepo) {
      gitInfo = await this.getGitInfo(projectPath);
    }

    // Estimate progress
    const progress = await this.estimateProgress(projectPath);

    // Detect death point
    const deathPoint = this.detectDeathPoint(gitInfo);

    // Analyze cause
    const cause = await this.analyzeCause(projectPath, gitInfo, progress);

    // Calculate wasted effort
    const wastedEffort = this.calculateWastedEffort(gitInfo, progress);

    // Determine status
    const status = this.determineStatus(gitInfo, stats);

    return {
      name: projectName,
      path: projectPath,
      status,
      lastModified: stats.lastModified,
      daysSinceActivity: stats.daysSinceActivity,
      progress,
      gitInfo,
      deathPoint,
      cause,
      wastedEffort,
      recoverable: this.isRecoverable(cause, progress)
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
   * Get project statistics
   */
  async getProjectStats(projectPath) {
    try {
      const stats = await fs.stat(projectPath);
      const now = Date.now();
      const daysSinceActivity = Math.floor(
        (now - stats.mtimeMs) / (1000 * 60 * 60 * 24)
      );

      return {
        lastModified: new Date(stats.mtimeMs),
        daysSinceActivity,
        size: await this.getDirectorySize(projectPath)
      };
    } catch (error) {
      return {
        lastModified: null,
        daysSinceActivity: Infinity,
        size: 0
      };
    }
  }

  /**
   * Get directory size
   */
  async getDirectorySize(dirPath) {
    try {
      const { stdout } = await execAsync(`du -sh "${dirPath}" | cut -f1`);
      return stdout.trim();
    } catch {
      return 'Unknown';
    }
  }

  /**
   * Get Git information
   */
  async getGitInfo(projectPath) {
    try {
      // Get commit history
      const { stdout: logOutput } = await execAsync(
        'git log --pretty=format:"%H|%an|%ae|%ai|%s" --all',
        { cwd: projectPath, maxBuffer: 10 * 1024 * 1024 }
      );

      const commits = logOutput.trim().split('\n').map(line => {
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

      // Get last commit
      const lastCommit = commits[0];

      // Calculate activity metrics
      const now = Date.now();
      const daysSinceLastCommit = Math.floor(
        (now - lastCommit.timestamp) / (1000 * 60 * 60 * 24)
      );

      // Get branches
      const { stdout: branchOutput } = await execAsync(
        'git branch -a',
        { cwd: projectPath }
      );
      const branches = branchOutput.trim().split('\n').map(b => b.trim());

      // Get contributors
      const contributors = [...new Set(commits.map(c => c.author))];

      // Calculate commit frequency
      const frequency = this.calculateCommitFrequency(commits);

      return {
        totalCommits: commits.length,
        lastCommit,
        daysSinceLastCommit,
        commits,
        branches: branches.length,
        contributors: contributors.length,
        frequency
      };
    } catch (error) {
      console.warn(`   Could not get Git info: ${error.message}`);
      return null;
    }
  }

  /**
   * Calculate commit frequency
   */
  calculateCommitFrequency(commits) {
    if (commits.length < 2) {
      return { perDay: 0, perWeek: 0 };
    }

    const first = commits[commits.length - 1].timestamp;
    const last = commits[0].timestamp;
    const durationDays = (last - first) / (1000 * 60 * 60 * 24);

    const perDay = commits.length / durationDays;
    const perWeek = perDay * 7;

    return {
      perDay: perDay.toFixed(2),
      perWeek: perWeek.toFixed(2)
    };
  }

  /**
   * Estimate project progress
   */
  async estimateProgress(projectPath) {
    const indicators = {
      hasPackageJson: false,
      hasReadme: false,
      hasSrc: false,
      hasTests: false,
      hasCI: false,
      hasDocs: false,
      fileCount: 0,
      codeLines: 0
    };

    try {
      // Check for key files
      const files = await fs.readdir(projectPath);

      indicators.hasPackageJson = files.includes('package.json');
      indicators.hasReadme = files.some(f => f.toLowerCase().startsWith('readme'));
      indicators.hasSrc = files.includes('src') || files.includes('lib');
      indicators.hasTests = files.some(f => 
        f.includes('test') || f.includes('spec') || f === '__tests__'
      );
      indicators.hasCI = files.some(f => 
        f === '.github' || f === '.gitlab-ci.yml' || f === '.travis.yml'
      );
      indicators.hasDocs = files.includes('docs') || files.includes('documentation');

      // Count files (rough estimate)
      indicators.fileCount = await this.countFiles(projectPath);

      // Estimate lines of code
      indicators.codeLines = await this.estimateCodeLines(projectPath);

    } catch (error) {
      console.warn(`   Could not estimate progress: ${error.message}`);
    }

    // Calculate progress percentage
    const completeness = this.calculateCompleteness(indicators);

    return {
      indicators,
      completeness,
      stage: this.determineStage(indicators, completeness)
    };
  }

  /**
   * Count files in project
   */
  async countFiles(projectPath) {
    try {
      const { stdout } = await execAsync(
        `find "${projectPath}" -type f ! -path "*/node_modules/*" ! -path "*/.git/*" | wc -l`
      );
      return parseInt(stdout.trim());
    } catch {
      return 0;
    }
  }

  /**
   * Estimate lines of code
   */
  async estimateCodeLines(projectPath) {
    try {
      const { stdout } = await execAsync(
        `find "${projectPath}" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.py" | xargs wc -l 2>/dev/null | tail -n 1 | awk '{print $1}'`,
        { cwd: projectPath }
      );
      return parseInt(stdout.trim()) || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Calculate project completeness (0-100%)
   */
  calculateCompleteness(indicators) {
    let score = 0;
    const weights = {
      hasPackageJson: 10,
      hasReadme: 10,
      hasSrc: 30,
      hasTests: 20,
      hasCI: 15,
      hasDocs: 15
    };

    for (const [key, weight] of Object.entries(weights)) {
      if (indicators[key]) {
        score += weight;
      }
    }

    return score;
  }

  /**
   * Determine development stage
   */
  determineStage(indicators, completeness) {
    if (completeness < 20) {
      return 'CONCEPT';           // Just an idea
    } else if (completeness < 40) {
      return 'EARLY';             // Started but minimal
    } else if (completeness < 60) {
      return 'DEVELOPMENT';       // Actively being built
    } else if (completeness < 80) {
      return 'ADVANCED';          // Almost done
    } else {
      return 'MATURE';            // Complete or nearly so
    }
  }

  /**
   * Detect when project died (death point)
   */
  detectDeathPoint(gitInfo) {
    if (!gitInfo || gitInfo.commits.length < 2) {
      return null;
    }

    const commits = gitInfo.commits;
    
    // Look for sudden drop in activity
    const windows = [];
    const windowSize = 10; // commits

    for (let i = 0; i < commits.length - windowSize; i += windowSize) {
      const window = commits.slice(i, i + windowSize);
      const first = window[window.length - 1].timestamp;
      const last = window[0].timestamp;
      const duration = (last - first) / (1000 * 60 * 60 * 24); // days

      windows.push({
        startDate: new Date(first),
        endDate: new Date(last),
        commits: window.length,
        velocity: window.length / duration // commits per day
      });
    }

    // Find largest drop in velocity
    let maxDrop = 0;
    let deathWindow = null;

    for (let i = 1; i < windows.length; i++) {
      const drop = windows[i - 1].velocity - windows[i].velocity;
      if (drop > maxDrop) {
        maxDrop = drop;
        deathWindow = windows[i];
      }
    }

    if (deathWindow && maxDrop > 0.1) { // Significant drop
      return {
        date: deathWindow.startDate,
        velocity: deathWindow.velocity.toFixed(3),
        dropPercentage: ((maxDrop / windows[0].velocity) * 100).toFixed(1)
      };
    }

    return null;
  }

  /**
   * Analyze why project was abandoned
   */
  async analyzeCause(projectPath, gitInfo, progress) {
    const causes = [];

    // CAUSE 1: Setup friction
    if (progress.completeness < 30 && gitInfo?.totalCommits < 10) {
      causes.push({
        type: 'SETUP_FRICTION',
        confidence: 0.8,
        evidence: 'Project abandoned early with few commits',
        description: 'Likely hit setup friction and gave up'
      });
    }

    // CAUSE 2: Complexity creep
    if (gitInfo?.commits) {
      const recentCommits = gitInfo.commits.slice(0, 10);
      const complexityKeywords = ['refactor', 'complex', 'rewrite', 'restructure'];
      const complexityCommits = recentCommits.filter(c =>
        complexityKeywords.some(k => c.message.toLowerCase().includes(k))
      );

      if (complexityCommits.length >= 3) {
        causes.push({
          type: 'COMPLEXITY_CREEP',
          confidence: 0.7,
          evidence: `${complexityCommits.length} complexity-related commits before death`,
          description: 'Project became too complex to manage'
        });
      }
    }

    // CAUSE 3: Scope creep
    if (gitInfo?.commits) {
      const recentCommits = gitInfo.commits.slice(0, 20);
      const featureCommits = recentCommits.filter(c =>
        c.message.toLowerCase().includes('add') || 
        c.message.toLowerCase().includes('feature')
      );

      if (featureCommits.length >= 10) {
        causes.push({
          type: 'SCOPE_CREEP',
          confidence: 0.65,
          evidence: `${featureCommits.length} feature additions in recent commits`,
          description: 'Scope kept expanding, never finished'
        });
      }
    }

    // CAUSE 4: Integration failure
    if (gitInfo?.commits) {
      const recentCommits = gitInfo.commits.slice(0, 15);
      const integrationKeywords = ['api', 'integration', 'external', 'service', 'auth'];
      const integrationCommits = recentCommits.filter(c =>
        integrationKeywords.some(k => c.message.toLowerCase().includes(k))
      );

      if (integrationCommits.length >= 5) {
        causes.push({
          type: 'INTEGRATION_FAILURE',
          confidence: 0.75,
          evidence: `${integrationCommits.length} integration-related commits before death`,
          description: 'Got stuck integrating external services'
        });
      }
    }

    // CAUSE 5: Lost interest
    if (gitInfo?.frequency && parseFloat(gitInfo.frequency.perWeek) < 1) {
      causes.push({
        type: 'LOST_INTEREST',
        confidence: 0.6,
        evidence: `Low commit frequency (${gitInfo.frequency.perWeek} per week)`,
        description: 'Slow progress suggests waning interest'
      });
    }

    // CAUSE 6: Blocked work
    if (gitInfo?.commits) {
      const recentCommits = gitInfo.commits.slice(0, 10);
      const blockedKeywords = ['wip', 'stuck', 'blocked', 'todo', 'temp'];
      const blockedCommits = recentCommits.filter(c =>
        blockedKeywords.some(k => c.message.toLowerCase().includes(k))
      );

      if (blockedCommits.length >= 3) {
        causes.push({
          type: 'BLOCKED_WORK',
          confidence: 0.8,
          evidence: `${blockedCommits.length} WIP/blocked commits before death`,
          description: 'Hit a blocking problem and couldn\'t proceed'
        });
      }
    }

    // CAUSE 7: Technical debt
    if (progress.codeLines > 1000 && !progress.indicators.hasTests) {
      causes.push({
        type: 'TECHNICAL_DEBT',
        confidence: 0.7,
        evidence: `${progress.codeLines} lines of code with no tests`,
        description: 'Code became unmaintainable without tests'
      });
    }

    // Default if no specific cause found
    if (causes.length === 0) {
      causes.push({
        type: 'UNKNOWN',
        confidence: 0.5,
        evidence: 'No clear pattern detected',
        description: 'Reason for abandonment unclear'
      });
    }

    // Return top cause
    causes.sort((a, b) => b.confidence - a.confidence);
    return causes[0];
  }

  /**
   * Calculate wasted effort
   */
  calculateWastedEffort(gitInfo, progress) {
    if (!gitInfo) {
      return {
        commits: 0,
        estimatedHours: 0,
        percentComplete: 0,
        description: 'No Git history available'
      };
    }

    // Rough estimate: 1 hour per commit
    const estimatedHours = gitInfo.totalCommits;

    // Lines of code: ~20 lines per hour (rough average)
    const hoursFromLines = progress.codeLines / 20;

    const totalHours = Math.max(estimatedHours, hoursFromLines);

    return {
      commits: gitInfo.totalCommits,
      estimatedHours: Math.round(totalHours),
      percentComplete: progress.completeness,
      description: `~${Math.round(totalHours)} hours invested, ${progress.completeness}% complete`
    };
  }

  /**
   * Determine project status
   */
  determineStatus(gitInfo, stats) {
    const daysSince = gitInfo?.daysSinceLastCommit ?? stats.daysSinceActivity;

    if (daysSince >= this.config.abandonedThresholdDays) {
      return 'ABANDONED';
    } else if (daysSince >= this.config.dormantThresholdDays) {
      return 'DORMANT';
    } else {
      return 'ACTIVE';
    }
  }

  /**
   * Check if project is recoverable
   */
  isRecoverable(cause, progress) {
    // High completeness = more recoverable
    if (progress.completeness >= 60) {
      return {
        recoverable: true,
        confidence: 0.8,
        reason: 'Project is well-developed, worth finishing'
      };
    }

    // Recoverable causes
    const recoverableCauses = ['SETUP_FRICTION', 'INTEGRATION_FAILURE', 'BLOCKED_WORK'];
    
    if (recoverableCauses.includes(cause.type)) {
      return {
        recoverable: true,
        confidence: 0.7,
        reason: `${cause.type} can be solved with better tooling`
      };
    }

    // Less recoverable
    if (cause.type === 'LOST_INTEREST' || cause.type === 'SCOPE_CREEP') {
      return {
        recoverable: false,
        confidence: 0.6,
        reason: `${cause.type} suggests fundamental issues`
      };
    }

    return {
      recoverable: true,
      confidence: 0.5,
      reason: 'May be worth revisiting'
    };
  }

  /**
   * Update statistics
   */
  updateStatistics(analysis) {
    this.statistics.projectsScanned++;

    if (analysis.status === 'ABANDONED') {
      this.statistics.abandonedCount++;
      this.statistics.totalWastedEffort += analysis.wastedEffort.estimatedHours;
    } else if (analysis.status === 'DORMANT') {
      this.statistics.dormantCount++;
    } else {
      this.statistics.activeCount++;
    }
  }

  /**
   * Categorize projects by status
   */
  categorizeProjects(projects) {
    return {
      abandoned: projects.filter(p => p.status === 'ABANDONED'),
      dormant: projects.filter(p => p.status === 'DORMANT'),
      active: projects.filter(p => p.status === 'ACTIVE')
    };
  }

  /**
   * Identify patterns in abandoned projects
   */
  identifyAbandonmentPatterns(abandonedProjects) {
    const patterns = {
      byCause: new Map(),
      byStage: new Map(),
      byTimeToAbandon: []
    };

    for (const project of abandonedProjects) {
      // Group by cause
      const causeType = project.cause.type;
      if (!patterns.byCause.has(causeType)) {
        patterns.byCause.set(causeType, []);
      }
      patterns.byCause.get(causeType).push(project);

      // Group by stage
      const stage = project.progress.stage;
      if (!patterns.byStage.has(stage)) {
        patterns.byStage.set(stage, []);
      }
      patterns.byStage.get(stage).push(project);

      // Track time to abandon
      if (project.gitInfo) {
        const firstCommit = project.gitInfo.commits[project.gitInfo.commits.length - 1];
        const lastCommit = project.gitInfo.commits[0];
        const lifespan = (lastCommit.timestamp - firstCommit.timestamp) / (1000 * 60 * 60 * 24);
        
        patterns.byTimeToAbandon.push({
          project: project.name,
          lifespan: Math.round(lifespan),
          cause: causeType
        });
      }
    }

    return {
      mostCommonCause: this.findMostCommon(patterns.byCause),
      mostCommonStage: this.findMostCommon(patterns.byStage),
      averageLifespan: this.calculateAverageLifespan(patterns.byTimeToAbandon),
      patterns
    };
  }

  /**
   * Find most common item in map
   */
  findMostCommon(map) {
    let max = 0;
    let most = null;

    for (const [key, items] of map.entries()) {
      if (items.length > max) {
        max = items.length;
        most = key;
      }
    }

    return { type: most, count: max };
  }

  /**
   * Calculate average lifespan
   */
  calculateAverageLifespan(lifespans) {
    if (lifespans.length === 0) return 0;
    
    const total = lifespans.reduce((sum, item) => sum + item.lifespan, 0);
    return Math.round(total / lifespans.length);
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(categorized, patterns) {
    const recommendations = [];

    // Recommendation based on most common cause
    if (patterns.mostCommonCause.type === 'SETUP_FRICTION') {
      recommendations.push({
        priority: 'HIGH',
        title: 'Setup Friction is Killing Projects',
        description: `${patterns.mostCommonCause.count} projects abandoned due to setup friction`,
        solution: 'Use CloudZero Proxy to eliminate setup overhead',
        action: 'Implement unified cloud service abstraction',
        impact: `Could save ${patterns.mostCommonCause.count} projects`
      });
    }

    // Recoverable projects
    const recoverable = categorized.abandoned.filter(p => 
      p.recoverable.recoverable && p.recoverable.confidence >= 0.7
    );

    if (recoverable.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        title: 'Recoverable Projects Identified',
        description: `${recoverable.length} abandoned projects worth revisiting`,
        solution: 'Review and restart with better tooling',
        action: 'Prioritize high-completion projects first',
        projects: recoverable.slice(0, 5).map(p => ({
          name: p.name,
          completeness: p.progress.completeness,
          reason: p.recoverable.reason
        }))
      });
    }

    // Total wasted effort
    if (this.statistics.totalWastedEffort > 100) {
      recommendations.push({
        priority: 'HIGH',
        title: 'Significant Wasted Effort',
        description: `~${this.statistics.totalWastedEffort} hours invested in abandoned projects`,
        solution: 'Prevent future abandonment with better patterns',
        action: 'Implement friction detection and early intervention',
        impact: 'Could reclaim hundreds of hours'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
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
    this.abandonedProjects = [];
    this.statistics = {
      projectsScanned: 0,
      abandonedCount: 0,
      dormantCount: 0,
      activeCount: 0,
      totalWastedEffort: 0
    };
  }
}

export default AbandonmentDetector;
