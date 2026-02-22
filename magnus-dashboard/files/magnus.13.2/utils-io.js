import { promises as fs } from 'fs';
import path from 'path';

const pending = new Map(); // filePath -> { timer, content }
const writeQueue = [];
let concurrentWrites = 0;
const DEFAULTS = { debounce: 100, maxConcurrent: 4, maxRetries: 3, baseBackoff: 200, maxQueueLength: 2000 };

async function _doWrite(task) {
  await fs.mkdir(path.dirname(task.filePath), { recursive: true });
  await fs.writeFile(task.filePath, task.content, 'utf8');
}

async function _flushOne(task) {
  try {
    await _doWrite(task);
    return true;
  } catch (e) {
    return false;
  }
}

function _processQueue(maxConcurrent = DEFAULTS.maxConcurrent) {
  while (concurrentWrites < maxConcurrent && writeQueue.length) {
    const task = writeQueue.shift();
    concurrentWrites += 1;
    (async () => {
      try {
        const ok = await _flushOne(task);
        if (!ok) {
          // failed - schedule retry if attempts remain
          task.attempts = (task.attempts || 0) + 1;
          if (task.attempts <= (task.maxRetries || DEFAULTS.maxRetries)) {
            const backoff = (task.baseBackoff || DEFAULTS.baseBackoff) * Math.pow(2, task.attempts - 1);
            const jitter = Math.round(Math.random() * 100);
            const delay = backoff + jitter;
            setTimeout(() => {
              // requeue at the end
              writeQueue.push(task);
              setImmediate(() => _processQueue(maxConcurrent));
            }, delay);
          } else {
            // give up after retries
            // eslint-disable-next-line no-console
            console.error(`utils-io: write failed for ${task.filePath} after ${task.attempts} attempts`);
          }
        }
      } catch (e) {
        // unexpected error - log and continue
        // eslint-disable-next-line no-console
        console.error('utils-io: unexpected write error', e && e.message);
      } finally {
        concurrentWrites = Math.max(0, concurrentWrites - 1);
        if (writeQueue.length) setImmediate(() => _processQueue(maxConcurrent));
      }
    })();
  }
}

export function scheduleWrite(filePath, content, opts = {}) {
  const debounce = opts.debounce || DEFAULTS.debounce;
  const maxConcurrent = opts.maxConcurrent || DEFAULTS.maxConcurrent;

  // coalesce by filePath - replace the pending content
  if (pending.has(filePath)) {
    const existing = pending.get(filePath);
    existing.content = String(content);
    clearTimeout(existing.timer);
    existing.timer = setTimeout(() => {
      const t = pending.get(filePath);
      if (!t) return;
      pending.delete(filePath);
      // guard queue length
      if (writeQueue.length >= (opts.maxQueueLength || DEFAULTS.maxQueueLength)) {
        // eslint-disable-next-line no-console
        console.warn('utils-io: write queue full, dropping write for', filePath);
        return;
      }
      writeQueue.push({ filePath, content: t.content, maxRetries: opts.maxRetries, baseBackoff: opts.baseBackoff });
      _processQueue(maxConcurrent);
    }, debounce);
    return;
  }

  const timer = setTimeout(() => {
    const t = pending.get(filePath);
    if (!t) return;
    pending.delete(filePath);
    if (writeQueue.length >= (opts.maxQueueLength || DEFAULTS.maxQueueLength)) {
      // eslint-disable-next-line no-console
      console.warn('utils-io: write queue full, dropping write for', filePath);
      return;
    }
    writeQueue.push({ filePath, content: t.content, maxRetries: opts.maxRetries, baseBackoff: opts.baseBackoff });
    _processQueue(maxConcurrent);
  }, debounce);

  pending.set(filePath, { timer, content: String(content) });
}

export default { scheduleWrite };
