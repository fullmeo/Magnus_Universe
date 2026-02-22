export function safeStringify(obj, replacer = null, spaces = 2) {
  const seen = new WeakSet();
  return JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    if (typeof replacer === 'function') return replacer(key, value);
    return value;
  }, spaces);
}
