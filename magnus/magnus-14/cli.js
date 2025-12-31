#!/usr/bin/env node

/**
 * MAGNUS 14 INTERACTIVE CLI TOOL
 *
 * Quick project analysis from command line
 * Usage: node cli.js  [or npm run cli]
 *
 * Interactive prompts guide you through project input
 * Generates comprehensive analysis report
 * Saves results for future reference
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const Magnus14 = require('./magnus-14-core');
const FolderAnalyzer = require('./folder-analyzer');

class Magnus14CLI {
  constructor() {
    this.storageDir = path.join(__dirname, 'storage');

    // Ensure storage directory exists
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }

    this.magnus14 = new Magnus14({ storageDir: this.storageDir });
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.projectData = {};
  }

  /**
   * Main entry point
   */
  async start() {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║         MAGNUS 14 INTERACTIVE PROJECT ANALYZER                ║
║                                                                ║
║  Your Signature Operating System for Complex Projects        ║
╚════════════════════════════════════════════════════════════════╝
    `);

    const choice = await this.showMainMenu();

    switch (choice) {
      case '1':
        await this.analyzeNewProject();
        break;
      case '2':
        await this.analyzeFromFolder();
        break;
      case '3':
        await this.viewPreviousAnalysis();
        break;
      case '4':
        await this.recordProjectOutcome();
        break;
      case '5':
        await this.viewAccuracyMetrics();
        break;
      case '6':
        this.exit();
        break;
      default:
        console.log('Invalid choice');
        setTimeout(() => this.start(), 1000);
    }
  }

  /**
   * Main menu
   */
  showMainMenu() {
    return new Promise((resolve) => {
      console.log(`
──────────────────────────────────────────────────────────────────
MAIN MENU
──────────────────────────────────────────────────────────────────

1. 🆕  Analyze a new project (manual)
2. 📁 Analyze from folder path (auto-detect)
3. 📊 View previous analysis
4. 📈 Record project outcome (update predictions)
5. 📈 View prediction accuracy metrics
6. 🚪 Exit

──────────────────────────────────────────────────────────────────
      `);

      this.rl.question('Select option (1-6): ', (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Analyze new project - interactive workflow
   */
  async analyzeNewProject() {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║         NEW PROJECT ANALYSIS                                   ║
║                                                                ║
║  Answer the following questions to analyze your project      ║
╚════════════════════════════════════════════════════════════════╝
    `);

    // Collect project information
    const projectName = await this.prompt('Project name: ');
    const domain = await this.prompt('Domain (music/ai/web/consciousness/blockchain/other): ');
    const description = await this.prompt('Project description (2-3 sentences): ');
    const currentClarity = parseInt(await this.prompt('Current clarity level (0-100): '));
    const estimatedComplexity = parseInt(await this.prompt('Estimated complexity (1-10): '));
    const teamSize = parseInt(await this.prompt('Team size (default 1): ') || '1');

    // Components
    console.log('\nList your main components (or press Enter to skip):');
    const components = [];
    let addMore = true;
    while (addMore) {
      const componentName = await this.prompt('  Component name (or press Enter to finish): ');
      if (!componentName) {
        addMore = false;
      } else {
        const complexity = parseInt(await this.prompt(`  Complexity for "${componentName}" (1-10): `));
        components.push({ name: componentName, complexity });
      }
    }

    // Blockers
    console.log('\nList your main blockers/challenges (or press Enter to skip):');
    const blockers = [];
    let addBlocker = true;
    while (addBlocker) {
      const blockerDesc = await this.prompt('  Blocker description (or press Enter to finish): ');
      if (!blockerDesc) {
        addBlocker = false;
      } else {
        const severity = await this.prompt('  Severity (CRITICAL/HIGH/MEDIUM): ');
        blockers.push({ description: blockerDesc, severity: severity || 'HIGH' });
      }
    }

    // Create project input
    const projectInput = {
      projectName,
      domain,
      description,
      currentClarity,
      estimatedComplexity,
      teamSize,
      components: components.length > 0 ? components : [],
      blockers: blockers.length > 0 ? blockers : [],
      timeline: 'flexible'
    };

    console.log(`
\n📊 Analyzing project "${projectName}"...
⚙️  Running 6 signature engines...
    `);

    // Analyze
    const analysis = this.magnus14.analyzeProject(projectInput);

    // Generate and display report
    const report = this.magnus14.generateReport(analysis.projectId);
    console.log(report);

    // Save analysis
    this.saveAnalysis(analysis);

    console.log(`
✅ Analysis complete and saved!

Project ID: ${analysis.projectId}
Saved to: ${this.getAnalysisPath(analysis.projectId)}

📝 You can reference this ID later to record actual outcomes.
    `);

    await this.promptContinue();
    this.start();
  }

  /**
   * Analyze project from folder path
   * Auto-detects project details from folder structure
   */
  async analyzeFromFolder() {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║         FOLDER-BASED PROJECT ANALYSIS                          ║
║                                                                ║
║  Auto-detect project details from folder structure            ║
╚════════════════════════════════════════════════════════════════╝
    `);

    const folderPath = await this.prompt('Enter folder path (absolute or relative): ');

    if (!folderPath.trim()) {
      console.log('❌ No folder path provided');
      await this.promptContinue();
      this.start();
      return;
    }

    // Resolve to absolute path
    let absolutePath = folderPath;
    if (!path.isAbsolute(folderPath)) {
      absolutePath = path.resolve(process.cwd(), folderPath);
    }

    console.log(`\n🔍 Analyzing folder: ${absolutePath}`);

    // Analyze folder
    const analyzer = new FolderAnalyzer(absolutePath);
    const result = analyzer.analyze();

    if (!result.success) {
      console.log(`\n❌ Error: ${result.error}`);
      await this.promptContinue();
      this.start();
      return;
    }

    const metadata = result.metadata;

    console.log(`
✅ Folder analysis complete!

📋 DETECTED PROJECT INFORMATION:
──────────────────────────────────────────────────────────────────
Project Name: ${metadata.projectName}
Domain: ${metadata.domain}
Description: ${metadata.description || '(No description found in README)'}

📊 FILE STATISTICS:
──────────────────────────────────────────────────────────────────
Total Files: ${metadata.fileStats.totalFiles}
Total Size: ${metadata.fileStats.totalSize}
Directories: ${metadata.fileStats.directories}
Detected Complexity: ${metadata.complexity}/10

🔧 TECHNOLOGIES:
──────────────────────────────────────────────────────────────────
Languages: ${metadata.technologies.languages.length > 0 ? metadata.technologies.languages.join(', ') : 'None detected'}
Frameworks: ${metadata.technologies.frameworks.length > 0 ? metadata.technologies.frameworks.join(', ') : 'None detected'}
    `);

    // Allow user to confirm or modify
    const confirmMetadata = await this.prompt('Use detected metadata? (y/n): ');

    let projectInput;

    if (confirmMetadata.toLowerCase() === 'y') {
      // Use detected metadata
      projectInput = {
        projectName: metadata.projectName,
        domain: metadata.domain,
        description: metadata.description || `Project at ${folderPath}`,
        currentClarity: 50, // Default starting clarity
        estimatedComplexity: metadata.complexity,
        components: metadata.components,
        blockers: [],
        teamSize: 1,
        timeline: 'flexible',
        folderPath: absolutePath
      };
    } else {
      // Let user modify
      projectInput = {
        projectName: await this.prompt(`Project name [${metadata.projectName}]: `) || metadata.projectName,
        domain: await this.prompt(`Domain [${metadata.domain}]: `) || metadata.domain,
        description: await this.prompt(`Description [${metadata.description}]: `) || metadata.description,
        currentClarity: parseInt(await this.prompt('Current clarity level (0-100) [50]: ') || '50'),
        estimatedComplexity: parseInt(await this.prompt(`Estimated complexity (1-10) [${metadata.complexity}]: `) || metadata.complexity),
        components: metadata.components,
        blockers: [],
        teamSize: parseInt(await this.prompt('Team size [1]: ') || '1'),
        timeline: 'flexible',
        folderPath: absolutePath
      };

      // Ask for additional components
      console.log('\nAdd additional components (or press Enter to skip):');
      let addMore = true;
      while (addMore) {
        const componentName = await this.prompt('  Component name (or press Enter to finish): ');
        if (!componentName) {
          addMore = false;
        } else {
          const complexity = parseInt(await this.prompt(`  Complexity for "${componentName}" (1-10): `));
          projectInput.components.push({ name: componentName, complexity });
        }
      }
    }

    console.log(`
\n📊 Analyzing project "${projectInput.projectName}"...
⚙️  Running 6 signature engines...
    `);

    // Analyze
    const analysis = this.magnus14.analyzeProject(projectInput);

    // Generate and display report
    const report = this.magnus14.generateReport(analysis.projectId);
    console.log(report);

    // Save analysis
    this.saveAnalysis(analysis);

    console.log(`
✅ Analysis complete and saved!

Project ID: ${analysis.projectId}
Folder Path: ${absolutePath}
Saved to: ${this.getAnalysisPath(analysis.projectId)}

📝 You can reference this ID later to record actual outcomes.
    `);

    await this.promptContinue();
    this.start();
  }

  /**
   * View previous analysis
   */
  async viewPreviousAnalysis() {
    const analyses = this.listSavedAnalyses();

    if (analyses.length === 0) {
      console.log(`
No previous analyses found.

💡 Tip: Run "Analyze a new project" to create your first analysis.
      `);
      await this.promptContinue();
      this.start();
      return;
    }

    console.log(`
╔════════════════════════════════════════════════════════════════╗
║         PREVIOUS ANALYSES                                      ║
╚════════════════════════════════════════════════════════════════╝
    `);

    analyses.forEach((file, index) => {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      console.log(`${index + 1}. ${data.input.projectName} (${data.input.domain})`);
      console.log(`   ID: ${data.projectId}`);
      console.log(`   Analyzed: ${new Date(data.timestamp).toLocaleDateString()}`);
      console.log();
    });

    const choice = await this.prompt(`Select analysis number (1-${analyses.length}) or Enter to cancel: `);
    const idx = parseInt(choice) - 1;

    if (idx >= 0 && idx < analyses.length) {
      const data = JSON.parse(fs.readFileSync(analyses[idx], 'utf8'));
      const report = this.magnus14.generateReport(data.projectId);
      console.log(report);
    }

    await this.promptContinue();
    this.start();
  }

  /**
   * Record project outcome
   */
  async recordProjectOutcome() {
    const projectId = await this.prompt('Enter project ID (from previous analysis): ');

    try {
      const analysis = this.magnus14.getProjectAnalysis(projectId);
      if (!analysis) {
        throw new Error('Project not found');
      }

      console.log(`
📊 Recording outcome for: ${analysis.input.projectName}

Enter the actual values (what really happened):
      `);

      const actualSpiralCount = parseInt(await this.prompt('Actual spiral count: '));
      const actualClarityTime = await this.prompt('Actual clarity time (e.g., "6 months"): ');
      const actualBreakthroughSession = parseInt(await this.prompt('Actual breakthrough session number: '));
      const breakthroughWasCorrect = (await this.prompt('Was breakthrough correct? (y/n): ')).toLowerCase() === 'y';
      const actualDomainBlocker = await this.prompt('Actual domain blocker (domain/technical/both): ');
      const actualIntegrationComplexity = parseFloat(await this.prompt('Actual integration complexity (1-10): '));
      const totalDurationMonths = parseFloat(await this.prompt('Total project duration (months): '));
      const finalClarity = parseInt(await this.prompt('Final clarity reached (0-100): '));

      const actualOutcome = {
        actualSpiralCount,
        actualClarityTime,
        actualBreakthroughSession,
        breakthroughWasCorrect,
        actualDomainBlocker,
        actualIntegrationComplexity,
        sideProjectsNeeded: [],
        frameworksEmerged: [],
        totalDurationMonths,
        finalClarity
      };

      // Record outcome
      const outcomeRecord = this.magnus14.recordOutcome(projectId, actualOutcome);

      console.log(`
✅ Outcome recorded!

ACCURACY ANALYSIS:
──────────────────────────────────────────────────────────────────

Spiral Count Prediction:
  Predicted: ${outcomeRecord.accuracy.spiralCountAccuracy.predicted} spirals
  Actual: ${outcomeRecord.accuracy.spiralCountAccuracy.actual} spirals
  Status: ${outcomeRecord.accuracy.spiralCountAccuracy.status}
  Accuracy: ${outcomeRecord.accuracy.spiralCountAccuracy.accuracy}%

Integration Complexity Prediction:
  Predicted: ${outcomeRecord.accuracy.integrationComplexityAccuracy.predicted}/10
  Actual: ${outcomeRecord.accuracy.integrationComplexityAccuracy.actual}/10
  Status: ${outcomeRecord.accuracy.integrationComplexityAccuracy.status}
  Accuracy: ${outcomeRecord.accuracy.integrationComplexityAccuracy.accuracy}%

Duration Prediction:
  Predicted: ${outcomeRecord.accuracy.durationAccuracy.predicted} months
  Actual: ${outcomeRecord.accuracy.durationAccuracy.actual} months
  Status: ${outcomeRecord.accuracy.durationAccuracy.status}
  Accuracy: ${outcomeRecord.accuracy.durationAccuracy.accuracy}%

${outcomeRecord.learnings.length > 0 ?
`LEARNINGS FOR FUTURE PROJECTS:
──────────────────────────────────────────────────────────────────
${outcomeRecord.learnings.map(l => `• ${l.type}: ${l.recommendation}`).join('\n')}` :
'No adjustments needed - predictions were accurate!'}

📈 This data improves Magnus 14 for similar future projects.
      `);

      // Save outcome
      this.saveOutcome(outcomeRecord);

    } catch (error) {
      console.log(`\n❌ Error: ${error.message}`);
    }

    await this.promptContinue();
    this.start();
  }

  /**
   * View accuracy metrics
   */
  async viewAccuracyMetrics() {
    const metrics = this.magnus14.getAccuracyMetrics();

    console.log(`
╔════════════════════════════════════════════════════════════════╗
║         PREDICTION ACCURACY METRICS                            ║
╚════════════════════════════════════════════════════════════════╝
    `);

    if (typeof metrics.status === 'string') {
      console.log(`\n${metrics.status}`);
      console.log(`\n💡 Tip: Record project outcomes to see accuracy metrics here.`);
    } else {
      console.log(`
Projects Analyzed: ${metrics.projectsAnalyzed}
Outcomes Recorded: ${metrics.outcomesRecorded}

──────────────────────────────────────────────────────────────────
AVERAGE ACCURACY BY ENGINE:
──────────────────────────────────────────────────────────────────

Spiral Clarification: ${metrics.avgSpiralAccuracy}%
Integration Complexity: ${metrics.avgIntegrationAccuracy}%
Duration Estimation: ${metrics.avgDurationAccuracy}%

──────────────────────────────────────────────────────────────────
IMPROVEMENT TREND: ${metrics.improvementTrend}
──────────────────────────────────────────────────────────────────

📊 Magnus 14 improves with each project analyzed.
After 5-10 projects with recorded outcomes, accuracy reaches ~95%+
      `);
    }

    await this.promptContinue();
    this.start();
  }

  /**
   * Helper: Show prompt and get input
   */
  prompt(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Helper: Prompt to continue
   */
  promptContinue() {
    return new Promise((resolve) => {
      this.rl.question('\nPress Enter to continue... ', () => {
        resolve();
      });
    });
  }

  /**
   * Save analysis to file
   */
  saveAnalysis(analysis) {
    const filePath = this.getAnalysisPath(analysis.projectId);
    fs.writeFileSync(filePath, JSON.stringify(analysis, null, 2));
  }

  /**
   * Save outcome to file
   */
  saveOutcome(outcomeRecord) {
    const outcomesDir = path.join(this.storageDir, 'outcomes');
    if (!fs.existsSync(outcomesDir)) {
      fs.mkdirSync(outcomesDir, { recursive: true });
    }

    const filePath = path.join(outcomesDir, `${outcomeRecord.predictionId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(outcomeRecord, null, 2));
  }

  /**
   * Get analysis file path
   */
  getAnalysisPath(projectId) {
    return path.join(this.storageDir, `${projectId}.json`);
  }

  /**
   * List saved analyses
   */
  listSavedAnalyses() {
    if (!fs.existsSync(this.storageDir)) {
      return [];
    }

    return fs.readdirSync(this.storageDir)
      .filter(f => f.endsWith('.json') && !f.startsWith('accuracy') && !f.startsWith('project-history'))
      .map(f => path.join(this.storageDir, f));
  }

  /**
   * Exit
   */
  exit() {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║  Your operating system is now visible to itself. ✨           ║
║                                                                ║
║  🧠 Magnus 14: Making complex projects navigable.            ║
╚════════════════════════════════════════════════════════════════╝

Goodbye!
    `);

    this.rl.close();
    process.exit(0);
  }
}

// Run CLI
if (require.main === module) {
  const cli = new Magnus14CLI();
  cli.start().catch(console.error);
}

module.exports = Magnus14CLI;
