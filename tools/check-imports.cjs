const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'frontend', 'src');

const exts = ['.js', '.jsx', '.ts', '.tsx', '.json'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      results.push(filePath);
    }
  });
  return results;
}

function resolveImport(fromFile, importPath) {
  // handle alias '@/'
  if (importPath.startsWith('@/')) {
    const rel = importPath.replace('@/', '');
    const target = path.join(root, rel);
    // try file or index
    for (const ext of exts) {
      if (fs.existsSync(target + ext)) return target + ext;
    }
    if (fs.existsSync(path.join(target, 'index.js'))) return path.join(target, 'index.js');
    if (fs.existsSync(path.join(target, 'index.jsx'))) return path.join(target, 'index.jsx');
    return target; // may not exist
  }
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    const dir = path.dirname(fromFile);
    const target = path.resolve(dir, importPath);
    for (const ext of exts) {
      if (fs.existsSync(target + ext)) return target + ext;
    }
    if (fs.existsSync(target)) return target;
    if (fs.existsSync(path.join(target, 'index.js'))) return path.join(target, 'index.js');
    if (fs.existsSync(path.join(target, 'index.jsx'))) return path.join(target, 'index.jsx');
    return target;
  }
  return null; // external module
}

const files = walk(root);
const issues = [];
files.forEach((file) => {
  const src = fs.readFileSync(file, 'utf8');
  const importRegex = /import\s+[^'\"]+['\"]([^'\"]+)['\"]/g;
  let m;
  while((m = importRegex.exec(src)) !== null) {
    const imp = m[1];
    if (imp.startsWith('.') || imp.startsWith('@/')) {
      const resolved = resolveImport(file, imp);
      if (!resolved) continue; // external
      if (fs.existsSync(resolved)) {
        const requestedAbs = imp.startsWith('@/') ? path.join(root, imp.replace('@/','')) : path.resolve(path.dirname(file), imp);
        const requestedNormalized = path.normalize(requestedAbs);
        const actualNormalized = path.normalize(resolved);
        const reqParts = requestedNormalized.split(path.sep).filter(Boolean);
        let actualParts = actualNormalized.split(path.sep).filter(Boolean);
        // strip extension from the last actual part for fair comparison
        if (actualParts.length) {
          actualParts[actualParts.length - 1] = path.parse(actualParts[actualParts.length - 1]).name;
        }
        // also strip extension from requested last part if it has one
        if (reqParts.length) {
          reqParts[reqParts.length - 1] = path.parse(reqParts[reqParts.length - 1]).name;
        }
        let mismatch = false;
        for (let i = 0; i < Math.min(reqParts.length, actualParts.length); i++) {
          if (reqParts[i] !== actualParts[i]) { mismatch = true; break; }
        }
        if (mismatch) issues.push({file, import: imp, resolved});
      } else {
        issues.push({file, import: imp, resolved});
      }
    }
  }
});

if (issues.length === 0) {
  console.log('No import issues detected');
  process.exit(0);
}
console.log('Import issues found:');
issues.forEach((it)=>{
  console.log(`File: ${it.file}\n  Import: ${it.import}\n  Resolved: ${it.resolved}\n`);
});
process.exit(1);
