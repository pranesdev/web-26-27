import fs from 'fs';
import path from 'path';

const DIST_DIR = './dist';

// Helper to recursively find files matching a pattern
function getFiles(dir, ext) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      files = files.concat(getFiles(filePath, ext));
    } else if (filePath.endsWith(ext)) {
      files.push(filePath);
    }
  }
  return files;
}

// Find all imports inside a JS file recursively
function getDependencyTree(jsPath, visited = new Set()) {
  const normalized = path.normalize(jsPath);
  if (visited.has(normalized)) return visited;
  visited.add(normalized);

  if (!fs.existsSync(normalized)) {
    // Check if it's relative to publicDir or root-relative
    return visited;
  }

  const content = fs.readFileSync(normalized, 'utf-8');
  const dir = path.dirname(normalized);

  // Regex to match ES import statements (static and dynamic)
  const importRegex = /(?:import\s*(?:[^'"]+from\s*)?|import\s*\()\s*['"]([^'"]+\.js)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importRef = match[1];
    // Resolve relative path
    let resolvedPath = '';
    if (importRef.startsWith('.') || importRef.startsWith('/')) {
      resolvedPath = path.resolve(importRef.startsWith('/') ? path.join(DIST_DIR, importRef) : path.join(dir, importRef));
      getDependencyTree(resolvedPath, visited);
    }
  }

  return visited;
}

const htmlFiles = getFiles(DIST_DIR, '.html');

for (const htmlFile of htmlFiles) {
  let htmlContent = fs.readFileSync(htmlFile, 'utf-8');
  console.log(`Processing: ${htmlFile}`);

  // Inline stylesheet link tags to eliminate render-blocking CSS
  const stylesheetRegex = /<link rel=["']stylesheet["'] href=["'](\/_astro\/[^"']+\.css)["']>/g;
  htmlContent = htmlContent.replace(stylesheetRegex, (match, cssUrl) => {
    const cssLocalPath = path.resolve(path.join(DIST_DIR, cssUrl));
    if (fs.existsSync(cssLocalPath)) {
      const cssContent = fs.readFileSync(cssLocalPath, 'utf-8');
      console.log(`  Inlined stylesheet: ${cssUrl}`);
      return `<style>${cssContent}</style>`;
    }
    return match;
  });
  
  // Find all component-url, renderer-url, before-hydration-url in astro-island tags
  const islandRegex = /(?:component-url|renderer-url|before-hydration-url)=["']([^"']+)["']/g;
  const urls = new Set();
  
  let match;
  while ((match = islandRegex.exec(htmlContent)) !== null) {
    urls.add(match[1]);
  }

  if (urls.size === 0) {
    fs.writeFileSync(htmlFile, htmlContent, 'utf-8');
    continue;
  }
  
  // Build a dependency tree of all JS files loaded by the islands
  const allDeps = new Set();
  for (const url of urls) {
    // Resolve URL to local file path
    const localPath = path.resolve(path.join(DIST_DIR, url));
    getDependencyTree(localPath, allDeps);
  }

  // Convert local paths back to root-relative URLs
  const preloadUrls = [];
  for (const depPath of allDeps) {
    const rel = path.relative(DIST_DIR, depPath).replace(/\\/g, '/');
    preloadUrls.push('/' + rel);
  }

  // Build the preload link tags
  const preloadTags = preloadUrls
    .map(url => `  <link rel="modulepreload" href="${url}">`)
    .join('\n');

  // Inject preload tags before </head>
  if (htmlContent.includes('</head>')) {
    htmlContent = htmlContent.replace('</head>', `${preloadTags}\n</head>`);
    fs.writeFileSync(htmlFile, htmlContent, 'utf-8');
    console.log(`  Injected ${preloadUrls.length} modulepreload tags.`);
  }
}

console.log("=== Post-build Injection Complete ===");
