================================================================================
TOOL SELECTION ENGINE v2.0 — COMPLETE INTEGRATION
Extended Decision Tree Including ALL Claude Capabilities
================================================================================

Précédent: Tool Selection v1.0 (Procedural context: web_chat vs claude_code)
Nouveau: Tool Selection v2.0 (Includes capability tools: API, Vision, MCP, etc)

Purpose: Make Magnus 13 work with ENTIRE Claude ecosystem, not just chat tools

================================================================================
EXPANDED DECISION TREE: 4 LEVELS OF TOOL SELECTION
================================================================================

LEVEL 1: CONTEXT DETERMINATION (v1.0)
──────────────────────────────────────────────────────────────────────────
Where are we?
  └─ Web chat (claude.ai)?
  └─ Claude Code (terminal)?

This determines WHAT SET OF TOOLS is available.


LEVEL 2: CAPABILITY SELECTION (NEW - v2.0)
──────────────────────────────────────────────────────────────────────────
What do we NEED to do?
  
  Basic Info?
    └─ Knowledge + Web Search + Memory → Web Chat

  File Analysis?
    ├─ Local → Claude Code
    └─ Uploaded → Web Chat + Vision (optional)

  Create/Generate?
    ├─ Simple file → create_file
    ├─ Interactive → artifact
    └─ Standalone app → Claude API

  Data Processing?
    ├─ One-time → Web Chat
    ├─ Batch 100+ → Claude API (Batch Processing)
    └─ Real-time → MCP Servers

  Integration Needed?
    ├─ GitHub → GitHub MCP
    ├─ Slack → Slack MCP
    ├─ Stripe → Stripe MCP
    └─ Email → Gmail MCP


LEVEL 3: EFFICIENCY OPTIMIZATION (NEW - v2.0)
──────────────────────────────────────────────────────────────────────────
How can we do it BEST?

  Single analysis?
    └─ Web Chat (free) or API (flexible)

  Multiple analyses (100+)?
    └─ Batch API (50% cheaper)

  Repeating pattern?
    └─ Prompt Caching (faster + cheaper)

  Complex reasoning?
    └─ Tool Use (agents) + Chain-of-Thought

  Image/Visual input?
    └─ Vision API


LEVEL 4: AGENTIC CAPABILITY (NEW - v2.0)
──────────────────────────────────────────────────────────────────────────
Should Claude DECIDE which tools to use?

  Yes → Tool Use (agentic)
         Claude decides: analyze → evaluate → suggest → post
         One prompt, multiple internal steps

  No → Explicit tool selection (user/Magnus decides)


================================================================================
COMPLETE DECISION TREE v2.0 — FLOWCHART
================================================================================

User Request
    ↓
┌─────────────────────────────────┐
│ LEVEL 1: Context?               │
│ Web Chat vs Claude Code         │
└─────────────────────────────────┘
    ↓
    ├─→ Web Chat?
    │   ↓
    │   ┌──────────────────────────────────┐
    │   │ LEVEL 2: What capability needed? │
    │   └──────────────────────────────────┘
    │   ↓
    │   ├─→ Info lookup?
    │   │   └─ Knowledge + Web Search + Memory
    │   │
    │   ├─→ File analysis (uploaded)?
    │   │   ├─ Simple → view_file
    │   │   └─ Image → Vision API
    │   │
    │   ├─→ Create content?
    │   │   ├─ Static file → create_file
    │   │   └─ Interactive → artifact
    │   │
    │   ├─→ Need integration?
    │   │   ├─ Post to Slack → Slack MCP
    │   │   ├─ Create GitHub issue → GitHub MCP
    │   │   └─ Track cost → Stripe MCP
    │   │
    │   └─→ Complex autonomous task?
    │       └─ Tool Use (agent decides what to do)
    │
    └─→ Claude Code?
        ↓
        ┌──────────────────────────────────┐
        │ LEVEL 2: What capability needed? │
        └──────────────────────────────────┘
        ↓
        ├─→ Local file analysis?
        │   └─ Direct filesystem access
        │
        ├─→ Git operations?
        │   └─ Git history, commits
        │
        ├─→ Real environment execution?
        │   └─ npm/node/bash (real system)
        │
        └─→ At scale (100+ items)?
            └─ → Switch to Claude API + Batch


All paths →
        ↓
┌─────────────────────────────────────────┐
│ LEVEL 3: Optimization                   │
│ Batch? Caching? Agents?                 │
└─────────────────────────────────────────┘
        ↓
Tool Plan Generated (with optimal approach)


================================================================================
PRACTICAL EXAMPLES: v2.0 IN ACTION
================================================================================

EXAMPLE 1: Simple Query (No change from v1)
────────────────────────────────────────────────────────────────────────────
User: "Qu'est-ce que Magnus 13?"

Decision Tree:
  Level 1: Context = Web Chat ✓
  Level 2: Capability = Knowledge ✓
  Level 3: Optimization = Direct answer ✓
  
Tool: knowledge_answer
Friction: 0


EXAMPLE 2: Local File Analysis (No change from v1)
────────────────────────────────────────────────────────────────────────────
User: "Analyse mon magnus-13-core.js"

Decision Tree:
  Level 1: Context = Web Chat
  Level 2: Capability = File analysis (local)
  Level 2.1: Is uploaded? NO → Local file
  Level 3: Optimization = Claude Code (full access)

Tool: Redirect to Claude Code
Friction: 0


EXAMPLE 3: Create Standalone App (NEW in v2)
────────────────────────────────────────────────────────────────────────────
User: "Create a Magnus analysis API service"

Decision Tree:
  Level 1: Context = Web Chat
  Level 2: Capability = Create application
  Level 2.1: Type? API service (standalone)
  Level 3: Optimization = Claude API (programmatic)
  Level 4: Agentic? Could be autonomous

Tool Plan:
  1. Create MagnusAPIClient class (create_file)
  2. Implement using Claude API
  3. Could add Tool Use for autonomous decisions

Outcome: 
  ```javascript
  const client = new MagnusAPIClient(apiKey);
  const decision = await client.analyze(request);
  ```

Friction: 1 (clear that API needed)


EXAMPLE 4: Batch Analysis (NEW in v2)
────────────────────────────────────────────────────────────────────────────
User: "Analyze 500 code files for patterns"

Decision Tree:
  Level 1: Context = (either)
  Level 2: Capability = Data processing (batch)
  Level 2.1: Scale? 500 items
  Level 3: Optimization = Batch API (50% cheaper)

Tool Plan:
  1. Prepare batch (create input file)
  2. Submit to Batch API
  3. Wait for results
  4. Process results

Cost: $2.50 (vs $5 regular API)
Speed: 24 hours (acceptable for non-urgent)

Friction: 2 (need to understand batch workflow)


EXAMPLE 5: Vision Analysis (NEW in v2)
────────────────────────────────────────────────────────────────────────────
User: "Analyze this architecture diagram and suggest risks"
[Uploads PNG of system diagram]

Decision Tree:
  Level 1: Context = Web Chat
  Level 2: Capability = File analysis + Visual understanding
  Level 2.1: Has image? YES
  Level 3: Optimization = Vision API

Tool:
  1. view_file (read diagram)
  2. Vision API (analyze image)
  3. knowledge (suggest improvements)

Friction: 1


EXAMPLE 6: Integrated Workflow (NEW in v2)
────────────────────────────────────────────────────────────────────────────
User: "Analyze my code, then post results to Slack and create GitHub issues"

Decision Tree:
  Level 1: Context = Web Chat
  Level 2: Capability = Multi-step integration
  Level 2.1: Needs: analyze + communicate + track
  Level 3: Optimization = Tool Use (agent) OR explicit chain
  Level 4: Agentic? YES

Tool Plan (Agentic):
  → Give Claude Tool Use with: analyze, slack_post, github_issue
  → Claude decides: "First analyze, then post, then create issues"
  → All in one agent loop

Or (Explicit):
  → Step 1: analyze (Web Chat or Claude Code)
  → Step 2: slack_post (Slack MCP)
  → Step 3: github_issue (GitHub MCP)

Friction: 2-3 (complex, but clear)


EXAMPLE 7: Financial Integration (NEW - Stripe!)
────────────────────────────────────────────────────────────────────────────
User: "Show me how much each Magnus project has cost in Stripe payments"

Decision Tree:
  Level 1: Context = Web Chat
  Level 2: Capability = External data integration
  Level 2.1: Source? Stripe (MCP available!)
  Level 3: Optimization = Direct Stripe MCP query

Tool:
  → Connect to Stripe MCP
  → Query transactions tagged "Magnus"
  → Group by project
  → Display results

Result: "Project A: $145 | Project B: $230 | Project C: $89"

Friction: 0 (if Stripe MCP enabled)


================================================================================
IMPLEMENTATION: EXTENDING TOOL SELECTION ENGINE
================================================================================

class MagnusToolSelectionEngineV2 extends MagnusToolSelectionEngine {
  
  // Previous: Level 1 (Context) already implemented
  // New: Add Levels 2-4
  
  async analyzeRequest(userRequest) {
    // Level 1: Already done (context determination)
    const context = this.determineContext();
    
    // NEW: Level 2 - Capability assessment
    const requiredCapabilities = this.assessCapabilities(userRequest);
    
    // NEW: Level 3 - Optimization
    const optimization = this.optimizeTools(requiredCapabilities);
    
    // NEW: Level 4 - Agentic decision
    const shouldBeAgentic = this.assessAgenticNeeds(userRequest);
    
    return {
      context,
      capabilities: requiredCapabilities,
      optimization,
      shouldBeAgentic,
      toolPlan: this.generateCompletePlan(...)
    };
  }

  assessCapabilities(request) {
    // What can Claude actually DO?
    // Returns: ['analyze', 'integrate', 'visualize', 'automate', etc]
    
    const capabilities = [];
    
    if (request.includes('analyze') || request.includes('review')) {
      capabilities.push('analysis');
    }
    
    if (request.includes('create') || request.includes('generate')) {
      capabilities.push('generation');
    }
    
    if (request.includes('image') || request.includes('screenshot')) {
      capabilities.push('vision');
    }
    
    if (request.includes('slack') || request.includes('github') || request.includes('email')) {
      capabilities.push('integration');
    }
    
    if (request.includes('batch') || request.includes('100+')) {
      capabilities.push('batch_processing');
    }
    
    if (request.includes('agent') || request.includes('autonomous')) {
      capabilities.push('agentic');
    }
    
    return capabilities;
  }

  optimizeTools(capabilities) {
    // Given what we need to do, what's the BEST way?
    
    const optimization = {
      shouldUseAPI: false,
      shouldUseBatch: false,
      shouldUseCaching: false,
      shouldUseVision: false,
      shouldUseMCP: [],
      shouldBeAgentic: false
    };
    
    if (capabilities.includes('batch_processing')) {
      optimization.shouldUseBatch = true; // 50% cheaper
    }
    
    if (capabilities.includes('integration')) {
      optimization.shouldUseMCP = this.identifyMCPServers(capabilities);
    }
    
    if (capabilities.includes('vision')) {
      optimization.shouldUseVision = true; // Use Vision API
    }
    
    if (capabilities.includes('agentic')) {
      optimization.shouldBeAgentic = true; // Use Tool Use
    }
    
    // If standalone app needed
    if (capabilities.includes('generation') && 
        this.isStandaloneApp(capabilities)) {
      optimization.shouldUseAPI = true;
    }
    
    return optimization;
  }

  assessAgenticNeeds(request) {
    // Should Claude decide what to do (agent), or should we?
    
    const complexity = this.estimateWorkflowComplexity(request);
    const multiStep = (request.match(/then|next|after/gi) || []).length > 0;
    const autonomous = request.includes('autonomous') || request.includes('agent');
    
    return complexity > 5 || multiStep > 2 || autonomous;
  }

  identifyMCPServers(capabilities) {
    // Which MCP servers do we need?
    
    const required = [];
    
    if (capabilities.some(c => c.includes('slack'))) required.push('slack');
    if (capabilities.some(c => c.includes('github'))) required.push('github');
    if (capabilities.some(c => c.includes('stripe'))) required.push('stripe');
    if (capabilities.some(c => c.includes('email'))) required.push('gmail');
    if (capabilities.some(c => c.includes('drive'))) required.push('google_drive');
    
    return required;
  }

  generateCompletePlan(analysis) {
    // Generate complete tool plan with ALL information
    
    return {
      // Level 1 result
      context: analysis.context,
      contextTools: this.getToolsForContext(analysis.context),
      
      // Level 2 result
      requiredCapabilities: analysis.capabilities,
      capabilityTools: this.getToolsForCapabilities(analysis.capabilities),
      
      // Level 3 result
      optimization: analysis.optimization,
      optimizationDetails: this.explainOptimization(analysis.optimization),
      
      // Level 4 result
      shouldBeAgentic: analysis.shouldBeAgentic,
      agentInstructions: analysis.shouldBeAgentic ? 
        this.generateAgentPrompt(analysis) : null,
      
      // Final recommendation
      recommendation: this.formRecommendation(analysis),
      expectedOutcome: this.describeOutcome(analysis),
      frictionLevel: this.calculateFriction(analysis),
      
      // Next steps
      steps: this.generateActionPlan(analysis)
    };
  }

  formRecommendation(analysis) {
    // Create a clear, actionable recommendation
    
    let recommendation = `Context: ${analysis.context}\n`;
    recommendation += `Capabilities needed: ${analysis.capabilities.join(', ')}\n`;
    
    if (analysis.optimization.shouldUseAPI) {
      recommendation += `→ Use Claude API (${analysis.optimization.shouldBeBatch ? 'Batch mode' : 'Regular'})\n`;
    }
    
    if (analysis.optimization.shouldUseMCP.length > 0) {
      recommendation += `→ Enable MCP Servers: ${analysis.optimization.shouldUseMCP.join(', ')}\n`;
    }
    
    if (analysis.shouldBeAgentic) {
      recommendation += `→ Use Tool Use (agent can decide steps)\n`;
    }
    
    return recommendation;
  }
}


================================================================================
INTEGRATION WITH MAGNUS 13: v2.0 ARCHITECTURE
================================================================================

Now Magnus can leverage the FULL Claude ecosystem:

┌──────────────────────────────────────────────────────────────────────────┐
│ User Request                                                             │
└──────────────────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE -1: TOOL SELECTION ENGINE v2.0                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                          │
│ Level 1: Context (Web vs Terminal)                                      │
│ Level 2: Capability (Info, Analysis, Integration, etc)                  │
│ Level 3: Optimization (API, Batch, Caching, Vision, etc)                │
│ Level 4: Agentic (Should Claude decide what to do?)                     │
│                                                                          │
│ Output: Complete tool plan with optimization                            │
│ Friction: Minimized                                                      │
│ Clarity: 99%+                                                            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: UNDERSTANDING (Magnus 13)                                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Now with full knowledge of:                                              │
│ - Available tools (Claude + MCP + API)                                   │
│ - Optimal approach (batch? API? agent?)                                  │
│ - Feasibility (is it possible with selected tools?)                      │
│ - Cost implications (batch cheaper, API costs, etc)                      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: COMPLEXITY + OPTIMIZATION                                       │
│ Now can account for:                                                     │
│ - Tool complexity contribution                                           │
│ - Efficiency gains (batch 50% cheaper, etc)                              │
│ - Agentic overhead (but simplified final result)                         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│ PHASES 3-9: EXECUTION WITH FULL TOOLKIT                                  │
│ Can now:                                                                  │
│ - Use Claude API for standalone apps                                     │
│ - Leverage Vision for image analysis                                     │
│ - Integrate with GitHub, Slack, Stripe, Gmail                            │
│ - Use Batch API for 100+ items                                           │
│ - Implement agents with Tool Use                                         │
│ - All optimized and tracked                                              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
    ↓
Production-Quality Outcome (with full Claude power)


================================================================================
PRACTICAL BENEFITS FOR SERIGNE
================================================================================

Current (Without v2.0):
  ✗ Can't leverage API for standalone Magnus apps
  ✗ Can't use Vision for diagram analysis
  ✗ Can't integrate with GitHub/Slack automatically
  ✗ No batch processing capability
  ✗ Stripe connected but not used

With Tool Selection Engine v2.0:
  ✓ Magnus can suggest: "Use Claude API for this"
  ✓ Vision analysis available: "Let me analyze that diagram"
  ✓ Auto-integration: "I'll post to Slack when done"
  ✓ Batch analysis: "Process 500 items efficiently"
  ✓ Cost tracking: "Stripe shows your project costs"


================================================================================
DEPLOYMENT: TOOL SELECTION ENGINE v2.0
================================================================================

PHASE 1: Code (This week)
  ☐ Extend MagnusToolSelectionEngine class
  ☐ Add capability assessment
  ☐ Add optimization logic
  ☐ Add agentic decision logic

PHASE 2: Integration (Next week)
  ☐ Connect to Magnus Phase 1
  ☐ Pass tool context to Understanding
  ☐ Update complexity calculation

PHASE 3: Documentation (Next 2 weeks)
  ☐ Update decision tree visuals
  ☐ Write MCP integration guide
  ☐ Create API wrapper tutorial
  ☐ Document Vision examples

PHASE 4: Deployment (Month 2)
  ☐ Enable MCP servers
  ☐ Set up Claude API
  ☐ Deploy Magnus with full toolkit
  ☐ Monitor and iterate


================================================================================
CONCLUSION
================================================================================

Tool Selection Engine v2.0 transforms Magnus from a GOOD framework into an
EXCELLENT framework by:

✓ Understanding FULL Claude capability set
✓ Selecting optimal tools automatically
✓ Minimizing friction through clarity
✓ Enabling integration with entire ecosystem
✓ Supporting scale (batch processing)
✓ Supporting autonomy (agents/Tool Use)

This is what makes Magnus truly the "Visionnaire" orchestrator.


================================================================================
END OF v2.0 INTEGRATION GUIDE
================================================================================
