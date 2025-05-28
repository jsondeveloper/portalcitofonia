function parseExtensionsConf(content) {
  const lines = content.split('\n');
  const result = [];
  let currentContext = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      currentContext = trimmed.slice(1, -1);
    } else if (trimmed.startsWith('exten') && currentContext) {
      const match = trimmed.match(/^exten\s*=>\s*(\d+),(\w),dial\(([^,]+),([^)]*)\)/i);
      if (match) {
        const [_, extension, priority, number, options] = match;
        result.push({
          context: currentContext,
          extension,
          priority,
          number,
          options
        });
      }
    }
  }

  return result;
}

module.exports = { parseExtensionsConf };
