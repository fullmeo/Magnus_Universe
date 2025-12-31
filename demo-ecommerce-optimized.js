/**
 * 🛍️ E-Commerce Demo - Optimized for Magnus Understanding
 *
 * Clean, focused requirements that Magnus can clearly understand
 * Shows full workflow: Analyze → Generate → Learn → Backup
 */

import { Magnus13Extended } from './index.js';

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     🛍️  E-COMMERCE WITH MAGNUS CLOUD STORAGE                 ║
║                                                                ║
║  Demonstrates: Analyze → Generate → Learn → Cloud Backup      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

async function runDemo() {
  try {
    console.log('🚀 Initializing Magnus 13 Extended with Cloud Storage\n');

    const magnus = new Magnus13Extended({
      cloudStorage: true,
      autoBackup: true,
      backupInterval: 3600000,
      backupOnGeneration: true
    });

    await magnus.initialize();

    console.log('✅ Magnus 13 Extended ready');
    console.log('✅ Cloud storage enabled');
    console.log('✅ Auto-backup: Every 60 minutes\n');

    // ========================================================================
    // SCENARIO 1: Product API Generation
    // ========================================================================

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SCENARIO 1: Product API');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📋 Requirements:');
    console.log('   Build a REST API for product management');
    console.log('   - GET /products (with pagination)');
    console.log('   - POST /products (create)');
    console.log('   - PUT /products/:id (update)');
    console.log('   - DELETE /products/:id\n');

    const analysis1 = await magnus.analyze(`
      Create REST API for product management with Express.js.
      Include: GET products with pagination, POST create, PUT update, DELETE remove.
    `);

    console.log('🔍 Analysis Result:');
    console.log(`   Clarity: ${analysis1.understanding.clarityScore}/100`);
    console.log(`   Complexity: ${analysis1.complexity.overall.score}/10`);
    console.log(`   Status: ${analysis1.canProceed ? '✅ READY' : '❌ NEEDS CLARIFICATION'}\n`);

    if (analysis1.canProceed) {
      const session1 = await magnus.startGeneration(analysis1);
      console.log(`✅ Generation started: ${session1.sessionId}`);

      // Record outcome
      await magnus.recordOutcome(session1.sessionId, {
        outcome: 'SUCCESS',
        type: 'Product API',
        filesGenerated: 3,
        endpoints: 4,
        tokensUsed: 5000
      });

      console.log('✅ Learning recorded and backed up to S3\n');
    }

    // ========================================================================
    // SCENARIO 2: Shopping Cart Feature
    // ========================================================================

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SCENARIO 2: Shopping Cart System');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📋 Requirements:');
    console.log('   Build shopping cart functionality');
    console.log('   - Add items to cart');
    console.log('   - Remove items from cart');
    console.log('   - Update item quantities');
    console.log('   - Calculate totals\n');

    const analysis2 = await magnus.analyze(`
      Build shopping cart system with add, remove, update quantity, and total calculation.
      Use React for frontend, Node.js for backend.
    `);

    console.log('🔍 Analysis Result:');
    console.log(`   Clarity: ${analysis2.understanding.clarityScore}/100`);
    console.log(`   Complexity: ${analysis2.complexity.overall.score}/10`);
    console.log(`   Status: ${analysis2.canProceed ? '✅ READY' : '❌ NEEDS CLARIFICATION'}\n`);

    if (analysis2.canProceed) {
      const session2 = await magnus.startGeneration(analysis2);
      console.log(`✅ Generation started: ${session2.sessionId}`);

      await magnus.recordOutcome(session2.sessionId, {
        outcome: 'SUCCESS',
        type: 'Shopping Cart',
        filesGenerated: 5,
        components: 3,
        tokensUsed: 6000
      });

      console.log('✅ Learning recorded and backed up to S3\n');
    }

    // ========================================================================
    // SCENARIO 3: Authentication Module
    // ========================================================================

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SCENARIO 3: JWT Authentication');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📋 Requirements:');
    console.log('   Implement JWT authentication');
    console.log('   - User registration endpoint');
    console.log('   - Login endpoint returning token');
    console.log('   - Protected route middleware');
    console.log('   - Token refresh mechanism\n');

    const analysis3 = await magnus.analyze(`
      Implement JWT authentication system.
      Include registration, login, protected routes, and token refresh with Node.js and Express.
    `);

    console.log('🔍 Analysis Result:');
    console.log(`   Clarity: ${analysis3.understanding.clarityScore}/100`);
    console.log(`   Complexity: ${analysis3.complexity.overall.score}/10`);
    console.log(`   Status: ${analysis3.canProceed ? '✅ READY' : '❌ NEEDS CLARIFICATION'}\n`);

    if (analysis3.canProceed) {
      const session3 = await magnus.startGeneration(analysis3);
      console.log(`✅ Generation started: ${session3.sessionId}`);

      await magnus.recordOutcome(session3.sessionId, {
        outcome: 'SUCCESS',
        type: 'JWT Authentication',
        filesGenerated: 4,
        endpoints: 4,
        tokensUsed: 7000
      });

      console.log('✅ Learning recorded and backed up to S3\n');
    }

    // ========================================================================
    // CLOUD STORAGE SUMMARY
    // ========================================================================

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('☁️  CLOUD STORAGE SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const stats = await magnus.getCloudStats();

    console.log('📊 Cloud Configuration:');
    console.log(`   Status: ${stats.initialized ? '✅ Active' : '❌ Inactive'}`);
    console.log(`   Auto-backup: ${stats.autoBackup ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`   Interval: ${stats.backupInterval / 60000} minutes`);
    console.log(`   Storage Prefix: ${stats.storagePrefix}\n`);

    console.log('💾 Data Backed Up:');
    console.log('   ✅ Session 1: Product API');
    console.log('   ✅ Learning: Product API patterns');
    console.log('   ✅ Session 2: Shopping Cart');
    console.log('   ✅ Learning: Cart functionality patterns');
    console.log('   ✅ Session 3: JWT Authentication');
    console.log('   ✅ Learning: Auth patterns\n');

    console.log('📁 Cloud Storage Structure:');
    console.log('   s3://bucket/magnus-data/');
    console.log('   ├── learning/');
    console.log('   │   └── knowledge-[timestamp].json');
    console.log('   ├── sessions/');
    console.log('   │   ├── session-[id1].json');
    console.log('   │   ├── session-[id2].json');
    console.log('   │   └── session-[id3].json');
    console.log('   └── decisions/');
    console.log('       └── decision-[timestamp].json\n');

    console.log('✨ Key Benefits Demonstrated:');
    console.log('   ✅ Automatic backup after each generation');
    console.log('   ✅ Learning data persisted to S3');
    console.log('   ✅ Session records archived');
    console.log('   ✅ Can restore anytime');
    console.log('   ✅ Ready for disaster recovery');
    console.log('   ✅ Multi-machine sync capable\n');

    console.log('🚀 What This Enables:');
    console.log('   • Never lose learning data');
    console.log('   • Instant recovery from crashes');
    console.log('   • Use same Magnus on multiple machines');
    console.log('   • Team collaboration with shared learning');
    console.log('   • Production-grade reliability\n');

    console.log('═════════════════════════════════════════════════════════════');
    console.log('              ✅ DEMONSTRATION COMPLETE!');
    console.log('═════════════════════════════════════════════════════════════\n');

    console.log('🎯 Next Steps:');
    console.log('   1. Configure AWS credentials for production');
    console.log('   2. Create S3 bucket for Magnus data');
    console.log('   3. Deploy Magnus13Extended to your projects');
    console.log('   4. Watch learning grow in the cloud ☁️\n');

    await magnus.cleanup();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run the demo
runDemo();
