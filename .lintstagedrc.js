// ESLint 9's flat config resolves a single eslint.config.* relative to the
// process cwd - it does not cascade per linted file the way .eslintrc did.
// Nx's own lint executor works around this by passing an explicit
// `overrideConfigFile` per project; lint-staged has no such notion of
// projects, so we replicate it here by grouping staged files by their
// nearest ancestor eslint.config.mjs and invoking eslint once per group
// with that config. Without this, type-aware rules (e.g.
// @typescript-eslint/no-deprecated) fail outside the root project because
// the root eslint.config.mjs has no parserOptions.project for them.
const fs = require('fs');
const path = require('path');

function findNearestEslintConfig(file) {
  let dir = path.dirname(path.resolve(file));
  const root = path.resolve(__dirname);
  for (;;) {
    const candidate = path.join(dir, 'eslint.config.mjs');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    if (dir === root) {
      break;
    }
    dir = path.dirname(dir);
  }
  return path.join(root, 'eslint.config.mjs');
}

module.exports = {
  '*.{json,scss,yml,html,md}': ['prettier --write'],
  '*.{js,ts,html}': (filenames) => {
    const filesByConfig = new Map();
    for (const file of filenames) {
      const config = findNearestEslintConfig(file);
      if (!filesByConfig.has(config)) {
        filesByConfig.set(config, []);
      }
      filesByConfig.get(config).push(file);
    }
    return Array.from(filesByConfig.entries()).map(([config, files]) => {
      const quotedFiles = files.map((file) => '"' + file + '"').join(' ');
      return 'eslint --fix --config "' + config + '" ' + quotedFiles;
    });
  },
};
