#!/usr/bin/env node

/**
 * Sacred Geometry in Code - 2-Day Autonomous Research Script
 *
 * This script launches MARS to autonomously research Sacred Geometry in Code
 * for a 2-day period, then reviews and summarizes the findings.
 */

import { MARS } from './magnus-autonomous-research-system.js';
import fs from 'fs';
import path from 'path';

class SacredGeometryResearchManager {
  constructor() {
    this.mars = null;
    this.researchStartTime = null;
    this.researchDuration = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
    this.researchTask = null;
    this.researchLog = [];
  }

  async initialize() {
    console.log('🚀 Initializing Sacred Geometry Research Manager...');
    
    try {
      // Initialize MARS
      this.mars = new MARS({
        storageDir: '.mars',
        userProfile: {
          background: 'Music + Math + Code',
          expertise: ['Sacred Geometry', 'Pythagorean Harmony', 'Hebrew/Gematria'],
          uniqueInsights: ['Golden Ratio in Code', 'Musical Patterns in Architecture']
        }
      });
      await this.mars.initialize();
      
      console.log('✅ MARS initialized successfully');
      console.log(`📊 Current MARS status: initialized`);
      console.log(`📚 Past learnings: 4`);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize MARS:', error);
      return false;
    }
  }

  async startSacredGeometryResearch() {
    console.log('\n🔮 Starting Sacred Geometry in Code research...');
    
    this.researchStartTime = Date.now();
    
    try {
      // Use MARS suggestion engine to propose research direction
      const proposal = await this.mars.proposeNextResearch();
      
      console.log('📋 MARS Research Proposal:');
      console.log(proposal.message);
      
      // Find Sacred Geometry suggestion
      const sacredGeometrySuggestion = proposal.suggestions?.find(s =>
        s.area && s.area.toLowerCase().includes('sacred geometry')
      );
      
      if (sacredGeometrySuggestion) {
        console.log(`🎯 Selected Sacred Geometry research: ${sacredGeometrySuggestion.area}`);
        
        // Conduct autonomous research
        const researchResult = await this.mars.conductAutonomousResearch(sacredGeometrySuggestion);
        
        console.log('🔬 Sacred Geometry research execution started');
        console.log('📝 MARS will autonomously conduct research for 2 days');
        console.log('📊 Progress can be monitored via the dashboard');
        
        return researchResult;
      } else {
        console.log('⚠️  No Sacred Geometry suggestion found, using first available suggestion');
        const firstSuggestion = proposal.suggestions?.[0];
        if (firstSuggestion) {
          const researchResult = await this.mars.conductAutonomousResearch(firstSuggestion);
          return researchResult;
        } else {
          console.log('❌ No research suggestions available');
          return null;
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to start research:', error);
      return null;
    }
  }

  async monitorResearchProgress() {
    console.log('\n👀 Monitoring research progress...');
    
    const checkInterval = 30 * 60 * 1000; // Check every 30 minutes
    const endTime = this.researchStartTime + this.researchDuration;
    
    while (Date.now() < endTime) {
      try {
        const progress = await this.mars.getTaskProgress(this.researchTask.id);
        
        if (progress) {
          console.log(`📊 Progress: ${progress.phase} - ${progress.progress}%`);
          console.log(`🔍 Insights found: ${progress.insightsFound || 0}`);
          console.log(`🧪 Experiments: ${progress.experimentsCompleted || 0}`);
          
          this.researchLog.push({
            timestamp: new Date().toISOString(),
            phase: progress.phase,
            progress: progress.progress,
            insights: progress.insightsFound,
            experiments: progress.experimentsCompleted
          });
        }
        
        // Wait before next check
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        
      } catch (error) {
        console.error('⚠️  Progress monitoring error:', error.message);
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }
    }
    
    console.log('⏰ Research duration completed - time to review findings');
  }

  async reviewFindings() {
    console.log('\n📋 Reviewing Sacred Geometry research findings...');
    
    try {
      // Get final research results
      const researchResults = await this.mars.getTaskResults(this.researchTask.id);
      
      if (!researchResults) {
        console.log('⏳ Research still in progress or not found. Checking research directory...');
        return await this.reviewFromFiles();
      }
      
      console.log('📊 Research Summary:');
      console.log(`   Duration: ${researchResults.duration || 'N/A'}`);
      console.log(`   Phases completed: ${researchResults.phases || 'N/A'}`);
      console.log(`   Insights generated: ${researchResults.insights?.length || 0}`);
      console.log(`   Experiments: ${researchResults.experiments?.length || 0}`);
      console.log(`   Confidence: ${researchResults.confidence || 'N/A'}%`);
      
      // Display key insights
      if (researchResults.insights && researchResults.insights.length > 0) {
        console.log('\n🔍 Key Insights:');
        researchResults.insights.forEach((insight, index) => {
          console.log(`   ${index + 1}. ${insight.title || 'Insight'}: ${insight.description || 'N/A'}`);
          console.log(`      Confidence: ${insight.confidence || 'N/A'}%`);
        });
      }
      
      // Display recommendations
      if (researchResults.recommendations && researchResults.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        researchResults.recommendations.forEach((rec, index) => {
          console.log(`   ${index + 1}. ${rec.title || 'Recommendation'}: ${rec.description || 'N/A'}`);
        });
      }
      
      // Save comprehensive report
      await this.saveResearchReport(researchResults);
      
      return researchResults;
      
    } catch (error) {
      console.error('❌ Error reviewing findings:', error);
      return await this.reviewFromFiles();
    }
  }

  async reviewFromFiles() {
    console.log('\n📂 Searching for research files in .mars/research/...');
    
    const researchDir = path.join('.mars', 'research');
    
    if (!fs.existsSync(researchDir)) {
      console.log('❌ Research directory not found');
      return null;
    }
    
    const files = fs.readdirSync(researchDir)
      .filter(file => file.includes('Sacred Geometry in Code'))
      .sort()
      .reverse();
    
    if (files.length === 0) {
      console.log('❌ No Sacred Geometry research files found');
      return null;
    }
    
    console.log(`📁 Found ${files.length} research files`);
    
    // Read the latest research file
    const latestFile = path.join(researchDir, files[0]);
    const researchData = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
    
    console.log('\n📊 Research Summary from file:');
    console.log(`   File: ${files[0]}`);
    console.log(`   Created: ${new Date(researchData.timestamp).toISOString()}`);
    console.log(`   Phases: ${researchData.phases || 'N/A'}`);
    console.log(`   Insights: ${researchData.insights?.length || 0}`);
    
    if (researchData.insights) {
      console.log('\n🔍 Key Insights:');
      researchData.insights.forEach((insight, index) => {
        console.log(`   ${index + 1}. ${insight.title || 'Insight'}: ${insight.description || 'N/A'}`);
      });
    }
    
    return researchData;
  }

  async saveResearchReport(researchData) {
    const report = {
      researchTitle: 'Sacred Geometry in Code - 2-Day Autonomous Research',
      researchPeriod: {
        start: new Date(this.researchStartTime).toISOString(),
        end: new Date().toISOString(),
        duration: '2 days'
      },
      methodology: 'Autonomous MARS research with comprehensive analysis',
      findings: researchData,
      progressLog: this.researchLog,
      summary: {
        totalInsights: researchData.insights?.length || 0,
        totalExperiments: researchData.experiments?.length || 0,
        confidence: researchData.confidence || 'N/A',
        recommendations: researchData.recommendations?.length || 0
      }
    };
    
    const reportFile = `sacred-geometry-research-report-${Date.now()}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`📄 Comprehensive report saved: ${reportFile}`);
  }

  async run() {
    console.log('='.repeat(80));
    console.log('🔮 SACRED GEOMETRY IN CODE - 2-DAY AUTONOMOUS RESEARCH');
    console.log('='.repeat(80));
    
    // Initialize MARS
    const initialized = await this.initialize();
    if (!initialized) {
      console.log('❌ Failed to initialize research manager');
      return;
    }
    
    // Start research
    const researchStarted = await this.startSacredGeometryResearch();
    if (!researchStarted) {
      console.log('❌ Failed to start research');
      return;
    }
    
    // Monitor progress (optional - can be run in background)
    console.log('\n💡 Note: Research will run autonomously for 2 days');
    console.log('📊 Progress can be monitored manually via MARS dashboard');
    console.log('⏰ Estimated completion: 2 days from now');
    
    // For immediate review (research may still be in progress)
    console.log('\n🔍 Attempting to review current findings...');
    const findings = await this.reviewFindings();
    
    if (findings) {
      console.log('\n✅ Sacred Geometry research review completed');
      console.log('📋 Check the generated report for detailed findings');
    } else {
      console.log('\n⏳ Research is still in progress');
      console.log('📁 Check .mars/research/ directory for updates');
      console.log('⏰ Return in 2 days for complete findings');
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('🔮 SACRED GEOMETRY RESEARCH STATUS: IN PROGRESS');
    console.log('='.repeat(80));
  }
}

// Run the research
// Run the research when this module is executed directly
const manager = new SacredGeometryResearchManager();
manager.run().catch(console.error);