/**
 * Magnus_1A Memory System
 * 
 * Dual storage: JSON (backup, human-readable) + SQLite (queries, analytics)
 * Tous les projets mémorisés également
 * Significance émerge des données
 */

import fs from 'fs/promises';
import path from 'path';
import Database from 'better-sqlite3';
import Config from '../config.js';

export class Memory {
  
  constructor() {
    this.jsonPath = Config.storage.memory.json;
    this.dbPath = Config.storage.memory.sqlite;
    this.db = null;
  }
  
  /**
   * Initialiser la mémoire (créer DB si nécessaire)
   */
  async initialize() {
    // Ensure directories exist
    await fs.mkdir(path.dirname(this.jsonPath), { recursive: true });
    await fs.mkdir(path.dirname(this.dbPath), { recursive: true });
    
    // Initialize SQLite
    this.db = new Database(this.dbPath);
    
    // Create tables
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        status TEXT NOT NULL,
        
        -- Metrics
        lines_generated INTEGER DEFAULT 0,
        sessions_count INTEGER DEFAULT 0,
        time_spent_minutes INTEGER DEFAULT 0,
        
        -- Outcomes
        deployed BOOLEAN DEFAULT 0,
        serigne_satisfaction REAL,
        technical_success BOOLEAN,
        philosophical_success REAL,
        
        -- Significance (computed dynamically)
        significance_score REAL DEFAULT 0.0,
        significance_rank INTEGER,
        
        -- Full data (JSON blob)
        data_json TEXT NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_significance ON projects(significance_score DESC);
      CREATE INDEX IF NOT EXISTS idx_status ON projects(status);
      CREATE INDEX IF NOT EXISTS idx_created ON projects(created_at DESC);
      
      CREATE TABLE IF NOT EXISTS patterns_used (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id TEXT NOT NULL,
        pattern_name TEXT NOT NULL,
        pattern_type TEXT NOT NULL,
        frequency INTEGER DEFAULT 1,
        contexts TEXT, -- JSON array of contexts
        
        FOREIGN KEY (project_id) REFERENCES projects(id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_pattern_project ON patterns_used(project_id);
      CREATE INDEX IF NOT EXISTS idx_pattern_name ON patterns_used(pattern_name);
      
      CREATE TABLE IF NOT EXISTS learnings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id TEXT NOT NULL,
        learning TEXT NOT NULL,
        category TEXT,
        importance REAL DEFAULT 0.5,
        created_at INTEGER NOT NULL,
        
        FOREIGN KEY (project_id) REFERENCES projects(id)
      );
      
      CREATE TABLE IF NOT EXISTS pattern_reuse (
        pattern_name TEXT NOT NULL,
        source_project_id TEXT NOT NULL,
        target_project_id TEXT NOT NULL,
        reuse_date INTEGER NOT NULL,
        
        PRIMARY KEY (pattern_name, source_project_id, target_project_id)
      );
      
      CREATE TABLE IF NOT EXISTS outcomes (
        project_id TEXT PRIMARY KEY,
        success BOOLEAN NOT NULL,
        failure_reason TEXT,
        satisfaction_score REAL,
        lessons_learned TEXT,
        would_repeat BOOLEAN,
        
        FOREIGN KEY (project_id) REFERENCES projects(id)
      );
    `);
    
    console.log('🧠 Magnus_1A Memory initialized (SQLite + JSON)');
  }
  
  /**
   * Record un projet (TOUS égaux initialement)
   */
  async recordProject(project) {
    const projectData = {
      id: project.id || this.generateId(),
      name: project.name,
      created_at: Date.now(),
      updated_at: Date.now(),
      status: project.status || 'ongoing',
      
      metrics: {
        lines_generated: project.linesGenerated || 0,
        sessions_count: project.sessionsCount || 0,
        time_spent_minutes: project.timeSpentMinutes || 0
      },
      
      outcomes: {
        deployed: project.deployed || false,
        serigne_satisfaction: project.serigneSatisfaction || null,
        technical_success: project.technicalSuccess || null,
        philosophical_success: project.philosophicalSuccess || null
      },
      
      patterns: project.patterns || [],
      learnings: project.learnings || [],
      
      context: project.context || {},
      
      // Significance calculé plus tard
      significance: null
    };
    
    // Insert into SQLite
    const stmt = this.db.prepare(`
      INSERT INTO projects (
        id, name, created_at, updated_at, status,
        lines_generated, sessions_count, time_spent_minutes,
        deployed, serigne_satisfaction, technical_success, philosophical_success,
        data_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      projectData.id,
      projectData.name,
      projectData.created_at,
      projectData.updated_at,
      projectData.status,
      projectData.metrics.lines_generated,
      projectData.metrics.sessions_count,
      projectData.metrics.time_spent_minutes,
      projectData.outcomes.deployed ? 1 : 0,
      projectData.outcomes.serigne_satisfaction,
      projectData.outcomes.technical_success ? 1 : 0,
      projectData.outcomes.philosophical_success,
      JSON.stringify(projectData)
    );
    
    // Record patterns used
    if (projectData.patterns.length > 0) {
      const patternStmt = this.db.prepare(`
        INSERT INTO patterns_used (project_id, pattern_name, pattern_type, frequency, contexts)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      for (const pattern of projectData.patterns) {
        patternStmt.run(
          projectData.id,
          pattern.name,
          pattern.type || 'unknown',
          pattern.frequency || 1,
          JSON.stringify(pattern.contexts || [])
        );
      }
    }
    
    // Record learnings
    if (projectData.learnings.length > 0) {
      const learningStmt = this.db.prepare(`
        INSERT INTO learnings (project_id, learning, category, importance, created_at)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      for (const learning of projectData.learnings) {
        learningStmt.run(
          projectData.id,
          learning.text || learning,
          learning.category || 'general',
          learning.importance || 0.5,
          Date.now()
        );
      }
    }
    
    // Backup to JSON
    await this.backupToJSON();
    
    // Recalculate significance for all projects
    await this.recalculateSignificance();
    
    return projectData;
  }
  
  /**
   * Calculate significance dynamically (émerge des données)
   */
  async recalculateSignificance() {
    const projects = this.db.prepare('SELECT * FROM projects').all();
    
    for (const project of projects) {
      const data = JSON.parse(project.data_json);
      
      const significance = await this.calculateSignificanceScore(project.id, data);
      
      // Update in DB
      this.db.prepare(`
        UPDATE projects 
        SET significance_score = ?
        WHERE id = ?
      `).run(significance.overall, project.id);
    }
    
    // Update ranks
    const ranked = this.db.prepare(`
      SELECT id FROM projects ORDER BY significance_score DESC
    `).all();
    
    ranked.forEach((proj, index) => {
      this.db.prepare(`
        UPDATE projects SET significance_rank = ? WHERE id = ?
      `).run(index + 1, proj.id);
    });
  }
  
  /**
   * Calculate significance score (facteurs multiples)
   */
  async calculateSignificanceScore(projectId, projectData) {
    const factors = {};
    
    // Factor 1: Pattern Reuse
    const reuseCount = this.db.prepare(`
      SELECT COUNT(*) as count FROM pattern_reuse 
      WHERE source_project_id = ?
    `).get(projectId);
    
    factors.pattern_reuse = {
      weight: 0.3,
      value: Math.min(reuseCount.count / 10, 1.0), // Normalize to 0-1
      reason: `Patterns réutilisés dans ${reuseCount.count} autres projets`
    };
    
    // Factor 2: Learning Density
    const learnings = this.db.prepare(`
      SELECT COUNT(*) as count FROM learnings WHERE project_id = ?
    `).get(projectId);
    
    factors.learning_density = {
      weight: 0.25,
      value: Math.min(learnings.count / 20, 1.0),
      reason: `${learnings.count} learnings extraits`
    };
    
    // Factor 3: Serigne Satisfaction
    const satisfaction = projectData.outcomes?.serigne_satisfaction;
    factors.serigne_satisfaction = {
      weight: 0.2,
      value: satisfaction ? satisfaction / 10 : 0.5, // Default to neutral if unknown
      reason: satisfaction ? `Satisfaction: ${satisfaction}/10` : 'Satisfaction inconnue'
    };
    
    // Factor 4: Philosophical Success
    const philSuccess = projectData.outcomes?.philosophical_success;
    factors.philosophical_success = {
      weight: 0.15,
      value: philSuccess || 0.5,
      reason: philSuccess ? `Succès philosophique: ${philSuccess}` : 'Non évalué'
    };
    
    // Factor 5: Longevity (still active?)
    const age = Date.now() - projectData.created_at;
    const ageMonths = age / (1000 * 60 * 60 * 24 * 30);
    const stillActive = projectData.status === 'ongoing' || projectData.status === 'maintained';
    
    factors.longevity = {
      weight: 0.1,
      value: stillActive && ageMonths > 3 ? 0.8 : 0.3,
      reason: stillActive ? `Actif après ${ageMonths.toFixed(1)} mois` : 'Complété ou abandonné'
    };
    
    // Calculate weighted average
    let overall = 0;
    for (const [key, factor] of Object.entries(factors)) {
      overall += factor.weight * factor.value;
    }
    
    return {
      overall,
      factors,
      computed_at: Date.now()
    };
  }
  
  /**
   * Get all projects (no hierarchy, sorted by significance)
   */
  async getAllProjects(options = {}) {
    const {
      sortBy = 'significance',
      limit = null,
      status = null
    } = options;
    
    let query = 'SELECT * FROM projects';
    const params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    switch (sortBy) {
      case 'significance':
        query += ' ORDER BY significance_score DESC';
        break;
      case 'recent':
        query += ' ORDER BY updated_at DESC';
        break;
      case 'created':
        query += ' ORDER BY created_at DESC';
        break;
    }
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
    }
    
    const stmt = this.db.prepare(query);
    const projects = stmt.all(...params);
    
    return projects.map(p => ({
      ...p,
      data: JSON.parse(p.data_json)
    }));
  }
  
  /**
   * Record pattern reuse (pour tracking significance)
   */
  async recordPatternReuse(patternName, sourceProjectId, targetProjectId) {
    this.db.prepare(`
      INSERT OR IGNORE INTO pattern_reuse (pattern_name, source_project_id, target_project_id, reuse_date)
      VALUES (?, ?, ?, ?)
    `).run(patternName, sourceProjectId, targetProjectId, Date.now());
    
    // Recalculate significance since reuse affects it
    await this.recalculateSignificance();
  }
  
  /**
   * Backup to JSON (human-readable)
   */
  async backupToJSON() {
    const projects = await this.getAllProjects();
    
    const backup = {
      backed_up_at: new Date().toISOString(),
      total_projects: projects.length,
      projects: projects.map(p => p.data)
    };
    
    await fs.writeFile(
      this.jsonPath,
      JSON.stringify(backup, null, 2),
      'utf-8'
    );
  }
  
  /**
   * Query patterns across projects
   */
  async queryPatterns(patternName = null) {
    let query = `
      SELECT 
        pu.*,
        p.name as project_name,
        p.significance_score
      FROM patterns_used pu
      JOIN projects p ON pu.project_id = p.id
    `;
    
    const params = [];
    
    if (patternName) {
      query += ' WHERE pu.pattern_name = ?';
      params.push(patternName);
    }
    
    query += ' ORDER BY p.significance_score DESC';
    
    return this.db.prepare(query).all(...params);
  }
  
  /**
   * Get statistics
   */
  async getStats() {
    const total = this.db.prepare('SELECT COUNT(*) as count FROM projects').get();
    const active = this.db.prepare('SELECT COUNT(*) as count FROM projects WHERE status = "ongoing"').get();
    const avgSignificance = this.db.prepare('SELECT AVG(significance_score) as avg FROM projects').get();
    
    const topPatterns = this.db.prepare(`
      SELECT pattern_name, COUNT(*) as usage_count
      FROM patterns_used
      GROUP BY pattern_name
      ORDER BY usage_count DESC
      LIMIT 10
    `).all();
    
    return {
      total_projects: total.count,
      active_projects: active.count,
      avg_significance: avgSignificance.avg,
      top_patterns: topPatterns
    };
  }
  
  /**
   * Helper: Generate unique ID
   */
  generateId() {
    return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default Memory;
