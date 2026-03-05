/**
 * Magnus 14 - Core
 * Persistent state management and storage for the Magnus Universe framework
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------------------------------------------------------------------
// Storage paths
// ---------------------------------------------------------------------------

const STORAGE_DIR = join(__dirname, '..', '.magnus-state');
const SESSION_FILE = join(STORAGE_DIR, 'sessions.json');
const CONFIG_FILE = join(STORAGE_DIR, 'config.json');
const MANIFEST_FILE = join(STORAGE_DIR, 'manifestations.json');
const CYCLE_LOG_FILE = join(STORAGE_DIR, 'cycle-log.json');

const STORAGE_SCHEMA_VERSION = 1;

// ---------------------------------------------------------------------------
// File-system helpers
// ---------------------------------------------------------------------------

/**
 * Ensure the storage directory exists, creating it recursively if needed.
 * @param {string} dir
 */
function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Parse raw JSON and assert that the root value is a plain object.
 * @param {string} raw
 * @param {string} label
 * @returns {object}
 */
function parseStorageJson(raw, label) {
  const parsed = JSON.parse(raw);
  if (typeof parsed !== 'object' || parsed === null) {
    throw new TypeError(`${label}: root value must be a non-null object`);
  }
  return parsed;
}

/**
 * Build a timestamped error record for the in-memory error log.
 * @param {string} source
 * @param {string} phase   - 'read' | 'parse' | 'validate' | 'migrate'
 * @param {string} message
 */
function errorRecord(source, phase, message) {
  return { source, phase, message, timestamp: new Date().toISOString() };
}

// ---------------------------------------------------------------------------
// Schema migration registry
// ---------------------------------------------------------------------------

const MIGRATIONS = {
  sessions: {
    /** v0 → v1: wrap bare array in envelope */
    1: (raw) => (Array.isArray(raw) ? raw : raw.data ?? [])
  },
  config: {
    1: (raw) => (raw.data !== undefined ? raw.data : raw)
  },
  manifestations: {
    1: (raw) => (Array.isArray(raw) ? raw : raw.data ?? [])
  },
  'cycle-log': {
    1: (raw) => (Array.isArray(raw) ? raw : raw.data ?? [])
  }
};

// ---------------------------------------------------------------------------
// MagnusCore class
// ---------------------------------------------------------------------------

export class MagnusCore {
  /**
   * @param {object} [options]
   * @param {string} [options.storageDir]   - Override default storage directory
   * @param {string} [options.sessionFile]  - Override default sessions file path
   * @param {string} [options.configFile]   - Override default config file path
   * @param {string} [options.manifestFile] - Override default manifestations path
   */
  constructor(options = {}) {
    this.storageDir   = options.storageDir   || STORAGE_DIR;
    this.sessionFile  = options.sessionFile  || SESSION_FILE;
    this.configFile   = options.configFile   || CONFIG_FILE;
    this.manifestFile = options.manifestFile || MANIFEST_FILE;
    this.cycleLogFile = options.cycleLogFile || CYCLE_LOG_FILE;

    /** @type {Array<{source:string,phase:string,message:string,timestamp:string}>} */
    this._storageErrors = [];

    this.state = {
      sessions:       [],
      config:         {},
      manifestations: [],
      cycleLog:       []
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  /**
   * Initialize core — ensures storage directory exists and loads all state.
   */
  initialize() {
    ensureDir(this.storageDir);
    this._loadAllState();
    return this;
  }

  /**
   * Persist the full in-memory state to disk.
   */
  saveAllState() {
    ensureDir(this.storageDir);
    this._write(this.sessionFile,  this.state.sessions);
    this._write(this.configFile,   this.state.config);
    this._write(this.manifestFile, this.state.manifestations);
    this._write(this.cycleLogFile, this.state.cycleLog);
  }

  // --------------------------------------------------------------------------
  // Generic storage primitives
  // --------------------------------------------------------------------------

  /**
   * Write data to a JSON file, wrapping it in a versioned envelope.
   * @param {string} filePath
   * @param {*} data
   */
  _write(filePath, data) {
    const envelope = { schemaVersion: STORAGE_SCHEMA_VERSION, data };
    writeFileSync(filePath, JSON.stringify(envelope, null, 2));
  }

  /**
   * Read and parse a JSON storage file, handling I/O and parse errors
   * explicitly rather than silently dropping them.
   *
   * On success  → returns { ok: true, data }
   * On any error → returns { ok: false, data: defaultValue }
   *   and records a structured error entry in this._storageErrors.
   *
   * @param {string} filePath
   * @param {string} label         - Human-readable name used in log messages
   * @param {*}      defaultValue  - Safe fallback returned on any failure
   * @returns {{ ok: boolean, data: * }}
   */
  _readStorage(filePath, label, defaultValue) {
    if (!existsSync(filePath)) {
      return { ok: true, data: defaultValue };
    }

    // ── I/O phase ────────────────────────────────────────────────────────────
    let raw;
    try {
      raw = readFileSync(filePath, 'utf8');
    } catch (err) {
      console.error(`[MagnusCore] Read error (${label}): ${err.message}`);
      this._storageErrors.push(errorRecord(label, 'read', err.message));
      return { ok: false, data: defaultValue };
    }

    // ── Parse phase ───────────────────────────────────────────────────────────
    let envelope;
    try {
      envelope = parseStorageJson(raw, label);
    } catch (err) {
      console.error(`[MagnusCore] Parse error (${label}): ${err.message}`);
      this._storageErrors.push(errorRecord(label, 'parse', err.message));
      return { ok: false, data: defaultValue };
    }

    // ── Migration phase ───────────────────────────────────────────────────────
    if (envelope.schemaVersion !== undefined &&
        envelope.schemaVersion !== STORAGE_SCHEMA_VERSION) {
      return this._migrateStorage(envelope, label, defaultValue);
    }

    return { ok: true, data: envelope.data !== undefined ? envelope.data : envelope };
  }

  /**
   * Attempt a schema migration for data that pre-dates the current version.
   * Errors are recorded rather than thrown so the caller always gets a usable value.
   */
  _migrateStorage(envelope, label, defaultValue) {
    try {
      const migrationFn = MIGRATIONS[label]?.[STORAGE_SCHEMA_VERSION];
      if (!migrationFn) {
        console.warn(`[MagnusCore] No migration found for ${label} v${envelope.schemaVersion} → v${STORAGE_SCHEMA_VERSION}. Using default.`);
        return { ok: false, data: defaultValue };
      }
      const data = migrationFn(envelope.data !== undefined ? envelope.data : envelope);
      return { ok: true, data };
    } catch (err) {
      console.error(`[MagnusCore] Migration error (${label}): ${err.message}`);
      this._storageErrors.push(errorRecord(label, 'migrate', err.message));
      return { ok: false, data: defaultValue };
    }
  }

  // --------------------------------------------------------------------------
  // Typed readers
  // --------------------------------------------------------------------------

  _loadAllState() {
    this.state.sessions       = this._readSessions();
    this.state.config         = this._readConfig();
    this.state.manifestations = this._readManifestations();
    this.state.cycleLog       = this._readCycleLog();
  }

  /**
   * Read persisted sessions from disk.
   *
   * On I/O or parse failure the error is recorded in this._storageErrors and
   * an empty array is returned, allowing the application to continue normally
   * rather than silently discarding the error or crashing.
   *
   * @returns {Array}
   */
  _readSessions() {
    const { ok, data } = this._readStorage(this.sessionFile, 'sessions', []);

    if (!ok) {
      // Error already logged by _readStorage; surface it to callers via errors list.
      return [];
    }

    if (!Array.isArray(data)) {
      const msg = `sessions: expected array, got ${typeof data}`;
      console.error(`[MagnusCore] Validation error — ${msg}`);
      this._storageErrors.push(errorRecord('sessions', 'validate', msg));
      return [];
    }

    return data;
  }

  /**
   * Read persisted configuration from disk.
   *
   * Returns an empty object on any failure and records the error so it can be
   * surfaced through getStorageErrors() rather than going unnoticed.
   *
   * @returns {object}
   */
  _readConfig() {
    const { ok, data } = this._readStorage(this.configFile, 'config', {});

    if (!ok) {
      return {};
    }

    if (typeof data !== 'object' || Array.isArray(data) || data === null) {
      const msg = `config: expected plain object, got ${Array.isArray(data) ? 'array' : typeof data}`;
      console.error(`[MagnusCore] Validation error — ${msg}`);
      this._storageErrors.push(errorRecord('config', 'validate', msg));
      return {};
    }

    return data;
  }

  /**
   * Read persisted manifestations from disk.
   *
   * Returns an empty array on any failure and records the error, ensuring
   * corrupt or missing files do not silently zero out manifestation history.
   *
   * @returns {Array}
   */
  _readManifestations() {
    const { ok, data } = this._readStorage(this.manifestFile, 'manifestations', []);

    if (!ok) {
      return [];
    }

    if (!Array.isArray(data)) {
      const msg = `manifestations: expected array, got ${typeof data}`;
      console.error(`[MagnusCore] Validation error — ${msg}`);
      this._storageErrors.push(errorRecord('manifestations', 'validate', msg));
      return [];
    }

    return data;
  }

  /**
   * Read persisted cycle log from disk.
   * @returns {Array}
   */
  _readCycleLog() {
    const { ok, data } = this._readStorage(this.cycleLogFile, 'cycle-log', []);
    if (!ok) return [];
    if (!Array.isArray(data)) {
      this._storageErrors.push(errorRecord('cycle-log', 'validate', `expected array, got ${typeof data}`));
      return [];
    }
    return data;
  }

  // --------------------------------------------------------------------------
  // Session management
  // --------------------------------------------------------------------------

  addSession(session) {
    if (!session || typeof session !== 'object') {
      throw new TypeError('session must be a non-null object');
    }
    const entry = {
      ...session,
      id:        session.id || crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    this.state.sessions.push(entry);
    return entry;
  }

  getSession(id) {
    return this.state.sessions.find((s) => s.id === id) ?? null;
  }

  removeSession(id) {
    const before = this.state.sessions.length;
    this.state.sessions = this.state.sessions.filter((s) => s.id !== id);
    return this.state.sessions.length < before;
  }

  // --------------------------------------------------------------------------
  // Diagnostics
  // --------------------------------------------------------------------------

  /** Returns a snapshot of all storage errors collected during this session. */
  getStorageErrors() {
    return [...this._storageErrors];
  }

  /** True if any storage read/parse/validate/migrate error has been recorded. */
  hasStorageErrors() {
    return this._storageErrors.length > 0;
  }
}

export default MagnusCore;
