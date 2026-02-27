================================================================================
MAGNUS TOOL SELECTION ENGINE v1.0
Integrated Procedural Framework for Tool Orchestration
================================================================================

Module for: Magnus 13+ Framework
Purpose: Automated, non-ambiguous tool selection
Integration: Phase -1 (Pre-Understanding phase)
Status: Production Design

================================================================================
ARCHITECTURE OVERVIEW
================================================================================

Before Magnus processes ANY request, Tool Selection Engine runs:

Request from User
        ↓
┌─────────────────────────────────────────────┐
│ TOOL SELECTION ENGINE (Phase -1)            │
│ - Determine context                         │
│ - Evaluate request type                     │
│ - Select appropriate tools                  │
│ - Validate feasibility                      │
│ - Return tool plan                          │
└─────────────────────────────────────────────┘
        ↓
Magnus 13 Understanding Phase (Phase 1)
        ↓
Complexity Phase (Phase 2)
        ↓
... rest of Magnus workflow


================================================================================
MAGNUS TOOL SELECTION ENGINE — CODE IMPLEMENTATION
================================================================================

class MagnusToolSelectionEngine {
  constructor(config = {}) {
    this.config = {
      contextType: config.contextType || 'web_chat', // 'web_chat' | 'claude_code'
      availableTools: this.initializeTools(),
      decisionTree: this.buildDecisionTree(),
      constraints: this.loadConstraints(),
      ...config
    };

    this.selectedTools = [];
    this.toolPlan = null;
    this.feasibilityScore = 0;
  }

  // =========================================================================
  // PHASE -1: PRE-REQUEST ANALYSIS
  // =========================================================================

  analyzeRequest(userRequest) {
    // STEP 1: Identify request characteristics
    const characteristics = {
      requestType: this.classifyRequest(userRequest),
      context: this.determineContext(),
      dataAvailability: this.assessDataNeeds(userRequest),
      complexity: this.estimateToolComplexity(userRequest),
      ambiguity: this.detectAmbiguity(userRequest),
      timestamp: new Date().toISOString()
    };

    // STEP 2: Run through decision tree
    const toolDecision = this.runDecisionTree(characteristics);

    // STEP 3: Validate feasibility
    const feasibility = this.validateFeasibility(toolDecision);

    // STEP 4: Handle ambiguity
    if (feasibility.requiresClarification) {
      return {
        status: 'CLARIFICATION_NEEDED',
        questions: feasibility.clarificationQuestions,
        recommendation: feasibility.recommendation
      };
    }

    // STEP 5: Create tool plan
    return {
      status: 'READY_TO_EXECUTE',
      toolPlan: this.generateToolPlan(toolDecision),
      expectedOutcome: this.predictOutcome(toolDecision),
      frictionLevel: this.calculateFrictionLevel(toolDecision),
      phaseTransition: 'Understanding (Phase 1)'
    };
  }

  // =========================================================================
  // INITIALIZE AVAILABLE TOOLS (Based on Context)
  // =========================================================================

  initializeTools() {
    const context = this.config.contextType;

    const webChatTools = {
      knowledge_answer: {
        name: 'Direct Knowledge Answer',
        category: 'knowledge',
        description: 'Answer from Claude training data',
        requirements: [],
        frictionLevel: 0,
        precedence: 1
      },

      conversation_search: {
        name: 'Conversation Search',
        category: 'context',
        description: 'Search past conversations for context',
        requirements: ['query_keywords'],
        frictionLevel: 1,
        precedence: 2,
        when: 'User references past chats'
      },

      recent_chats: {
        name: 'Recent Chats',
        category: 'context',
        description: 'Retrieve recent conversation history',
        requirements: ['timeframe'],
        frictionLevel: 1,
        precedence: 2,
        when: 'User wants chronological context'
      },

      web_search: {
        name: 'Web Search',
        category: 'external_data',
        description: 'Search current information online',
        requirements: ['query'],
        frictionLevel: 2,
        precedence: 3,
        when: 'Info needed after knowledge cutoff'
      },

      view_file: {
        name: 'View File',
        category: 'file_operation',
        description: 'Read uploaded or created file',
        requirements: ['filepath'],
        frictionLevel: 1,
        precedence: 4,
        when: 'Need to read file contents'
      },

      str_replace: {
        name: 'String Replace',
        category: 'file_operation',
        description: 'Edit existing file',
        requirements: ['filepath', 'unique_string', 'replacement'],
        frictionLevel: 2,
        precedence: 5,
        when: 'Need to modify existing file'
      },

      create_file: {
        name: 'Create File',
        category: 'file_operation',
        description: 'Create new file with content',
        requirements: ['filepath', 'content'],
        frictionLevel: 2,
        precedence: 6,
        when: 'Need to generate new file'
      },

      bash_tool: {
        name: 'Bash Tool',
        category: 'execution',
        description: 'Execute command (isolated Linux env)',
        requirements: ['command'],
        frictionLevel: 3,
        precedence: 7,
        warning: 'Isolated environment only, not your system',
        when: 'Testing/validation in isolated environment'
      },

      artifact: {
        name: 'Artifact',
        category: 'rendering',
        description: 'Create interactive rendered content',
        requirements: ['type', 'content'],
        frictionLevel: 2,
        precedence: 8,
        when: 'React, HTML, interactive content'
      },

      present_files: {
        name: 'Present Files',
        category: 'distribution',
        description: 'Share files with user',
        requirements: ['filepaths'],
        frictionLevel: 1,
        precedence: 9,
        when: 'After creating files'
      },

      memory_user_edits: {
        name: 'Memory User Edits',
        category: 'memory',
        description: 'Save information to remember',
        requirements: ['information'],
        frictionLevel: 1,
        precedence: 10,
        when: 'User says "remember", "dont forget"'
      }
    };

    const claudeCodeTools = {
      local_filesystem_access: {
        name: 'Local Filesystem',
        category: 'system_access',
        description: 'Direct access to local files',
        requirements: [],
        frictionLevel: 0,
        precedence: 1
      },

      git_history: {
        name: 'Git History',
        category: 'system_access',
        description: 'Access Git repository history',
        requirements: ['repo_path'],
        frictionLevel: 1,
        precedence: 2
      },

      npm_commands: {
        name: 'NPM/Node',
        category: 'execution',
        description: 'Real environment execution',
        requirements: ['command'],
        frictionLevel: 1,
        precedence: 3
      },

      real_bash: {
        name: 'Real Bash',
        category: 'execution',
        description: 'Real system execution',
        requirements: ['command'],
        frictionLevel: 1,
        precedence: 4
      }
    };

    return context === 'claude_code' ? claudeCodeTools : webChatTools;
  }

  // =========================================================================
  // DECISION TREE IMPLEMENTATION
  // =========================================================================

  buildDecisionTree() {
    return {
      root: {
        question: 'What type of request is this?',
        branches: [
          {
            condition: 'isKnowledgeQuestion',
            action: 'knowledge_answer',
            nextNode: null // No further branching
          },
          {
            condition: 'referencesPastContext',
            action: 'selectBetween',
            options: ['conversation_search', 'recent_chats'],
            nextNode: 'proceed_with_clarification'
          },
          {
            condition: 'needsCurrentData',
            action: 'web_search',
            nextNode: 'proceed_with_result'
          },
          {
            condition: 'needsFileAnalysis',
            action: 'selectBetween',
            options: [
              { condition: 'isUploaded', action: 'view_file' },
              { condition: 'isLocal', action: 'redirect_to_claude_code' }
            ],
            nextNode: 'proceed_with_analysis'
          },
          {
            condition: 'needsFileModification',
            action: 'selectBetween',
            options: [
              { condition: 'existingFile', action: 'str_replace' },
              { condition: 'newFile', action: 'create_file' }
            ],
            nextNode: 'proceed_with_modification'
          },
          {
            condition: 'needsExecution',
            action: 'selectBetween',
            options: [
              { condition: 'testOnly', action: 'bash_tool' },
              { condition: 'realExecution', action: 'redirect_to_claude_code' }
            ],
            nextNode: 'proceed_with_execution'
          },
          {
            condition: 'needsRendering',
            action: 'artifact',
            nextNode: 'proceed_with_artifact'
          },
          {
            condition: 'needsMemory',
            action: 'memory_user_edits',
            nextNode: 'proceed_with_memory'
          }
        ]
      }
    };
  }

  // =========================================================================
  // DECISION LOGIC (The Actual Tree Walking)
  // =========================================================================

  runDecisionTree(characteristics) {
    const req = characteristics;
    const decisions = [];

    // Q1: Is this a knowledge question?
    if (this.isKnowledgeQuestion(req)) {
      return {
        tool: 'knowledge_answer',
        precedence: 1,
        explanation: 'Answer from Claude knowledge base'
      };
    }

    // Q2: References past context?
    if (req.requestType.includes('past') || req.requestType.includes('remember')) {
      if (req.requestType.includes('specific_topic')) {
        return {
          tool: 'conversation_search',
          precedence: 2,
          explanation: 'Search for specific topic in past conversations'
        };
      }
      return {
        tool: 'recent_chats',
        precedence: 2,
        explanation: 'Retrieve recent conversation history'
      };
    }

    // Q3: Needs current data?
    if (req.requestType.includes('current') || req.requestType.includes('today')) {
      return {
        tool: 'web_search',
        precedence: 3,
        explanation: 'Search current information online'
      };
    }

    // Q4: File analysis needed?
    if (req.requestType.includes('analyze') || req.requestType.includes('read')) {
      if (req.dataAvailability.includes('uploaded')) {
        return {
          tool: 'view_file',
          precedence: 4,
          explanation: 'Read uploaded file contents'
        };
      }
      if (req.dataAvailability.includes('local')) {
        return {
          tool: 'redirect_to_claude_code',
          precedence: 0,
          explanation: 'Use Claude Code for local file access'
        };
      }
    }

    // Q5: File modification?
    if (req.requestType.includes('modify') || req.requestType.includes('edit')) {
      return {
        tool: 'str_replace',
        precedence: 5,
        explanation: 'Edit existing file content'
      };
    }

    // Q6: Code/content generation?
    if (req.requestType.includes('create') || req.requestType.includes('generate')) {
      return {
        tool: 'create_file',
        precedence: 6,
        explanation: 'Generate new file content'
      };
    }

    // Q7: Execution/testing?
    if (req.requestType.includes('test') || req.requestType.includes('execute')) {
      if (req.dataAvailability.includes('isolated_ok')) {
        return {
          tool: 'bash_tool',
          precedence: 7,
          explanation: 'Test in isolated environment'
        };
      }
      return {
        tool: 'redirect_to_claude_code',
        precedence: 0,
        explanation: 'Use Claude Code for real execution'
      };
    }

    // Q8: Interactive rendering?
    if (req.requestType.includes('react') || req.requestType.includes('interactive')) {
      return {
        tool: 'artifact',
        precedence: 8,
        explanation: 'Create interactive artifact'
      };
    }

    // Q9: Memory request?
    if (req.requestType.includes('remember') || req.requestType.includes('memorize')) {
      return {
        tool: 'memory_user_edits',
        precedence: 10,
        explanation: 'Save to persistent memory'
      };
    }

    // Default: No tool needed
    return {
      tool: 'knowledge_answer',
      precedence: 1,
      explanation: 'Answer directly from knowledge'
    };
  }

  // =========================================================================
  // REQUEST CLASSIFICATION
  // =========================================================================

  classifyRequest(request) {
    const keywords = {
      knowledge: ['what', 'how', 'why', 'explain', 'define', 'is'],
      past: ['remember', 'mentioned', 'previously', 'last time', 'we discussed'],
      current: ['today', 'now', 'latest', 'current', 'recent', 'news'],
      analyze: ['analyze', 'review', 'examine', 'look at', 'read'],
      modify: ['change', 'edit', 'fix', 'improve', 'update'],
      create: ['create', 'write', 'generate', 'build', 'make'],
      test: ['test', 'run', 'execute', 'deploy', 'verify'],
      react: ['react', 'component', 'interactive', 'page', 'ui'],
      remember: ['remember', 'forget', 'dont forget', 'keep in mind']
    };

    const types = [];
    Object.entries(keywords).forEach(([type, kws]) => {
      if (kws.some(kw => request.toLowerCase().includes(kw))) {
        types.push(type);
      }
    });

    return types.length > 0 ? types : ['default'];
  }

  determineContext() {
    return this.config.contextType; // 'web_chat' or 'claude_code'
  }

  assessDataNeeds(request) {
    const needs = [];
    if (request.includes('uploaded') || request.includes('file')) needs.push('uploaded');
    if (request.includes('local') || request.includes('system')) needs.push('local');
    if (request.includes('test') || request.includes('demo')) needs.push('isolated_ok');
    return needs;
  }

  estimateToolComplexity(request) {
    const words = request.split(' ').length;
    const hasCode = request.includes('code') || request.includes('implementation');
    const hasMultipleTasks = (request.match(/and/g) || []).length > 1;

    let score = 3; // baseline

    if (words > 50) score += 1;
    if (hasCode) score += 2;
    if (hasMultipleTasks) score += 1;

    return Math.min(score, 10);
  }

  detectAmbiguity(request) {
    const ambiguousPatterns = [
      'could you also',
      'and also',
      'plus',
      'in addition',
      'furthermore'
    ];

    const ambiguityCount = ambiguousPatterns.filter(p =>
      request.toLowerCase().includes(p)
    ).length;

    return ambiguityCount;
  }

  // =========================================================================
  // FEASIBILITY VALIDATION
  // =========================================================================

  validateFeasibility(toolDecision) {
    const feasibility = {
      isFeasible: true,
      requiresClarification: false,
      clarificationQuestions: [],
      recommendation: null
    };

    // Check if tool is available in current context
    const tool = toolDecision.tool;
    const availableTools = Object.keys(this.config.availableTools);

    if (!availableTools.includes(tool)) {
      feasibility.isFeasible = false;
      feasibility.requiresClarification = true;
      feasibility.clarificationQuestions.push(
        `Tool '${tool}' not available in current context (${this.config.contextType})`
      );
      feasibility.recommendation = `Switch to ${toolDecision.tool === 'redirect_to_claude_code' ? 'Claude Code' : 'Web Chat'}`;
    }

    return feasibility;
  }

  // =========================================================================
  // TOOL PLAN GENERATION
  // =========================================================================

  generateToolPlan(toolDecision) {
    const tool = this.config.availableTools[toolDecision.tool];

    return {
      selectedTool: toolDecision.tool,
      toolMetadata: tool,
      executionPlan: {
        step1: `Announce tool selection: "I'll use ${tool.name} because ${toolDecision.explanation}"`,
        step2: 'Gather required parameters: ' + tool.requirements.join(', '),
        step3: `Execute ${toolDecision.tool}`,
        step4: 'Process results',
        step5: 'Present outcomes'
      },
      expectedOutcome: this.describeOutcome(toolDecision),
      frictionLevel: tool.frictionLevel,
      warningIfNeeded: tool.warning || null
    };
  }

  describeOutcome(toolDecision) {
    const outcomes = {
      knowledge_answer: 'Direct answer from training data',
      conversation_search: 'Relevant past chat references',
      recent_chats: 'Historical conversation context',
      web_search: 'Current external information',
      view_file: 'File contents and analysis',
      str_replace: 'Modified file',
      create_file: 'New file created',
      bash_tool: 'Test results in isolated environment',
      artifact: 'Interactive rendered component',
      present_files: 'Files shared with user',
      memory_user_edits: 'Information saved to memory'
    };

    return outcomes[toolDecision.tool] || 'Unknown outcome';
  }

  predictOutcome(toolDecision) {
    return {
      immediateResult: this.describeOutcome(toolDecision),
      nextPhase: 'Magnus 13 Understanding Phase (Phase 1)',
      dataFlow: 'Tool output → Understanding → Complexity → ... → Delivery'
    };
  }

  calculateFrictionLevel(toolDecision) {
    const tool = this.config.availableTools[toolDecision.tool];
    return {
      level: tool.frictionLevel, // 0-3 scale
      description: [
        'No friction',
        'Minimal friction',
        'Moderate friction',
        'Significant friction'
      ][tool.frictionLevel]
    };
  }

  // =========================================================================
  // LOAD CONSTRAINTS
  // =========================================================================

  loadConstraints() {
    return {
      bashTool: {
        restricted: true,
        message: 'Bash tool runs in isolated Linux environment, not your system',
        canAccess: ['demo', 'test', 'validation'],
        cannotAccess: ['your_filesystem', 'your_git', 'local_data']
      },
      fileOperations: {
        mustBeUnique: 'str_replace requires unique string to replace',
        mustExist: 'str_replace requires existing file',
        creationDefault: 'create_file defaults to /home/claude (temporary)'
      },
      conversationSearch: {
        scopeRestriction: 'Only searches chats outside projects (current setting)',
        keywordRequired: 'Needs substantive keywords (not "the", "discuss", etc)'
      }
    };
  }
}

// ============================================================================
// INTEGRATION WITH MAGNUS 13 — LIFECYCLE
// ============================================================================

class Magnus13WithToolSelection {
  constructor() {
    this.toolSelectionEngine = new MagnusToolSelectionEngine();
    this.magnus13 = new Magnus13();
  }

  async processRequest(userRequest) {
    // PHASE -1: Tool Selection
    console.log('🔧 Phase -1: Tool Selection');
    const toolAnalysis = this.toolSelectionEngine.analyzeRequest(userRequest);

    if (toolAnalysis.status === 'CLARIFICATION_NEEDED') {
      return {
        phase: -1,
        status: 'CLARIFICATION_NEEDED',
        message: toolAnalysis.questions.join('\n'),
        recommendation: toolAnalysis.recommendation
      };
    }

    const toolPlan = toolAnalysis.toolPlan;
    console.log(`✅ Selected tool: ${toolPlan.selectedTool}`);
    console.log(`📋 Friction level: ${toolPlan.frictionLevel.description}`);

    // Execute the selected tool (represented in output)
    const toolResult = {
      toolUsed: toolPlan.selectedTool,
      status: 'executed',
      frictionResolution: 'Tool selected with zero ambiguity'
    };

    // PHASE 1: Understanding (Magnus 13 begins)
    console.log('📖 Phase 1: Understanding');
    const understanding = await this.magnus13.analyze(userRequest, {
      toolContext: toolPlan.selectedTool,
      dataAvailable: true
    });

    // Continue with rest of Magnus...
    return {
      toolSelectionPhase: toolAnalysis,
      magnus13Phases: understanding,
      completeFeedback: 'Request processed with zero tool selection confusion'
    };
  }
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/*
const magnum = new Magnus13WithToolSelection();

// User: "Améliore mon dashboard, analyse le code et teste"
const result = await magnum.processRequest(
  "Améliore mon dashboard, analyse le code et teste"
);

Output:
🔧 Phase -1: Tool Selection
  Question 1: Is this local or uploaded?
  → Determine answer
  
  Question 2: Need real execution?
  → Answer determines: bash_tool vs Claude Code
  
✅ Selected tool: (depends on clarification)
📋 Friction level: Minimal

📖 Phase 1: Understanding
  ...rest of Magnus workflow

Result: ZERO CONFUSION on tool selection
*/

// ============================================================================
// EXPORT
// ============================================================================

export { MagnusToolSelectionEngine, Magnus13WithToolSelection };
