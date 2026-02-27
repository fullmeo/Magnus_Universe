#!/usr/bin/env node
/**
 * Magnus CLI - Command Line Interface
 *
 * Provides command-line access to Magnus multi-modal generation
 */

import { MultiModalGenerator } from './multi-modal-generator.js';
import { ModalityDetector } from './modality-detector.js';
import path from 'path';

const VERSION = '1.0.0';

class MagnusCLI {
  constructor() {
    this.generator = new MultiModalGenerator({
      verbose: true,
      autoDetect: true
    });

    this.detector = new ModalityDetector();
  }

  /**
   * Show help message
   */
  showHelp() {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║              MAGNUS CLI - Multi-Modal Generator       ║
║                                                       ║
║                    Version ${VERSION}                     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

USAGE:
  magnus <command> [options]

COMMANDS:
  detect [path]              Detect project modality
  generate <name>            Generate new project
  info                       Show system information
  test                       Run integration tests
  help                       Show this help message
  version                    Show version

DETECT OPTIONS:
  --path <path>             Path to analyze (default: current directory)
  --verbose                 Show detailed detection info

GENERATE OPTIONS:
  --framework <name>        Framework to use (react, vue, angular, etc.)
  --modality <type>         Force modality (web, mobile, data)
  --features <list>         Comma-separated features
  --backend                 Include backend
  --output <path>           Output directory

EXAMPLES:
  magnus detect                              # Detect current project
  magnus detect --path ./my-project          # Detect specific project
  magnus generate my-app --framework react   # Generate React app
  magnus generate api --modality data        # Generate data pipeline
  magnus info                                # Show capabilities

For more information: https://github.com/magnus-ai/magnus-cli
`);
  }

  /**
   * Show version
   */
  showVersion() {
    console.log(`Magnus CLI v${VERSION}`);
  }

  /**
   * Detect modality command
   */
  async detectCommand(args) {
    const projectPath = args.path || process.cwd();

    console.log(`\n🔍 Detecting modality for: ${projectPath}\n`);

    try {
      const result = await this.detector.detectModality(projectPath);

      console.log('✅ Detection Complete\n');
      console.log(`Primary Modality:  ${result.primary}`);
      console.log(`Confidence:        ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`Multi-Modal:       ${result.isMultiModal ? 'Yes' : 'No'}`);

      if (result.secondary.length > 0) {
        console.log(`Secondary:         ${result.secondary.join(', ')}`);
      }

      console.log('\nModality Scores:');
      console.log(`  Web:     ${(result.scores.web * 100).toFixed(1)}%`);
      console.log(`  Mobile:  ${(result.scores.mobile * 100).toFixed(1)}%`);
      console.log(`  Data:    ${(result.scores.data * 100).toFixed(1)}%`);

      console.log(`\nDetection Time: ${result.detectionTime}ms`);
      console.log(`Files Analyzed: ${result.projectInfo?.totalFiles || 0}`);

      if (result.accuracyEstimate) {
        console.log(`Accuracy Estimate: ${(result.accuracyEstimate * 100).toFixed(1)}%`);
      }

    } catch (error) {
      console.error('\n❌ Detection failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Generate command
   */
  async generateCommand(name, args) {
    if (!name) {
      console.error('❌ Error: Project name is required');
      console.log('Usage: magnus generate <name> [options]');
      process.exit(1);
    }

    console.log(`\n🚀 Generating project: ${name}\n`);

    const specification = {
      name: name,
      projectPath: args.output || path.join(process.cwd(), name),
      framework: args.framework || 'react',
      features: args.features ? args.features.split(',').map(f => f.trim()) : [],
      includeBackend: args.backend || false
    };

    console.log('📋 Configuration:');
    console.log(`   Name:      ${specification.name}`);
    console.log(`   Framework: ${specification.framework}`);
    console.log(`   Features:  ${specification.features.join(', ') || 'none'}`);
    console.log(`   Backend:   ${specification.includeBackend ? 'yes' : 'no'}`);
    console.log(`   Output:    ${specification.projectPath}`);
    console.log();

    try {
      const result = await this.generator.generate(specification, {
        modality: args.modality
      });

      if (result.success) {
        console.log('✅ Generation Complete\n');
        console.log(`Modality Used:     ${result.modality}`);
        console.log(`Generator:         ${result.generator}`);
        console.log(`Generation Time:   ${result.metadata.generationTime}ms`);

        if (result.metadata.detection) {
          console.log(`Detection Used:    ${result.metadata.detection.primary} (${(result.metadata.detection.confidence * 100).toFixed(1)}%)`);
        }

        console.log('\n🎉 Project generated successfully!');
        console.log(`\nNext steps:`);
        console.log(`  cd ${name}`);
        console.log(`  npm install`);
        console.log(`  npm start`);

      } else {
        console.error('\n❌ Generation failed:', result.error);
        process.exit(1);
      }

    } catch (error) {
      console.error('\n❌ Generation error:', error.message);
      process.exit(1);
    }
  }

  /**
   * Info command
   */
  async infoCommand() {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║              MAGNUS SYSTEM INFORMATION                ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

Version:        ${VERSION}
Node Version:   ${process.version}
Platform:       ${process.platform}

Available Generators:
`);

    const generators = this.generator.getAvailableGenerators();

    for (const modality of generators) {
      const caps = this.generator.getGeneratorCapabilities(modality);
      console.log(`  📦 ${modality.toUpperCase()}`);
      console.log(`     Frameworks: ${caps.frameworks?.length || 0}`);
      console.log(`     Features:   ${caps.features?.length || 0}`);
      console.log(`     Templates:  ${caps.templates?.length || 0}`);
    }

    console.log(`
Modality Detection:
  ✅ Web Application Detection
  ✅ Mobile Application Detection
  ✅ Data Pipeline Detection
  ✅ Auto-Detection Flow
  ✅ Pattern Memory Tracking

Features:
  ✅ Autonomous Pattern Detection
  ✅ Multi-Modal Code Generation
  ✅ Template-Based Generation
  ✅ Framework Support
  ✅ Specification Validation
`);
  }

  /**
   * Test command
   */
  async testCommand() {
    console.log('\n🧪 Running integration tests...\n');

    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      const { stdout, stderr } = await execAsync('node test-multi-modal-generator.js', {
        cwd: process.cwd()
      });

      console.log(stdout);

      if (stderr) {
        console.error(stderr);
      }

    } catch (error) {
      console.error('❌ Tests failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Parse command line arguments
   */
  parseArgs(argv) {
    const args = {};
    let current = null;

    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];

      if (arg.startsWith('--')) {
        current = arg.substring(2);
        args[current] = true;
      } else if (current) {
        args[current] = arg;
        current = null;
      }
    }

    return args;
  }

  /**
   * Run CLI
   */
  async run(argv) {
    const args = argv.slice(2);

    if (args.length === 0) {
      this.showHelp();
      return;
    }

    const command = args[0];
    const commandArgs = this.parseArgs(args.slice(1));

    try {
      switch (command) {
        case 'help':
        case '--help':
        case '-h':
          this.showHelp();
          break;

        case 'version':
        case '--version':
        case '-v':
          this.showVersion();
          break;

        case 'detect':
          await this.detectCommand(commandArgs);
          break;

        case 'generate':
          await this.generateCommand(args[1], commandArgs);
          break;

        case 'info':
          await this.infoCommand();
          break;

        case 'test':
          await this.testCommand();
          break;

        default:
          console.error(`❌ Unknown command: ${command}`);
          console.log('Run "magnus help" for usage information');
          process.exit(1);
      }

    } catch (error) {
      console.error('❌ Error:', error.message);
      if (commandArgs.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

// Run CLI if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new MagnusCLI();
  cli.run(process.argv).catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { MagnusCLI };
export default MagnusCLI;
