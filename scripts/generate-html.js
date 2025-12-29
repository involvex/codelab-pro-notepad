#!/usr/bin/env node
/**
 * Generate production HTML with correct asset references
 */

import { readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');

// Find the generated files
const files = readdirSync(distDir);

// Find the main entry point (exactly "index.js") and all chunks
const mainJs = files.find(f => f === 'index.js');
const chunks = files.filter(f =>
  f.endsWith('.js') &&
  !f.endsWith('.map') &&
  f !== 'index.js' &&
  (f.startsWith('index-') || f.startsWith('package-'))
);
const cssFile = files.find(f => f.startsWith('index') && f.endsWith('.css'));

if (!mainJs) {
  console.error('❌ Main entry point (index.js) not found in dist/');
  console.error('Available files:', files);
  process.exit(1);
}

console.log(`✅ Found assets:
   Main JS: ${mainJs}
   Chunks:  ${chunks.join(', ') || 'none'}
   CSS:     ${cssFile || 'none'}`);

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="CodeLab Pro - Production-ready code editor" />
    <meta name="theme-color" content="#0a0e27" />
    <title>CodeLab Pro - Code Editor</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    ${cssFile ? `<link rel="stylesheet" href="./${cssFile}" />` : ''}
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        margin: 0; padding: 0;
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        -webkit-font-smoothing: antialiased;
        overflow: hidden;
        background: #0a0e27;
        color: #e0e7ff;
      }
      #root { width: 100vw; height: 100vh; overflow: hidden; }
      #loading {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        background: linear-gradient(135deg, #0a0e27 0%, #141b3a 100%);
        z-index: 9999;
      }
      .loader {
        width: 64px; height: 64px;
        border: 4px solid #00f0ff; border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .loading-text { color: #e0e7ff; font-size: 18px; font-weight: 600; margin-top: 24px; }
    </style>
  </head>
  <body>
    <div id="loading">
      <div class="loader"></div>
      <div class="loading-text">Loading CodeLab Pro...</div>
    </div>
    <div id="root"></div>
    <script type="module" src="./${mainJs}"></script>
    <script>
      setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) {
          loading.style.opacity = '0';
          loading.style.transition = 'opacity 0.3s';
          setTimeout(() => loading.remove(), 300);
        }
      }, 1000);
    </script>
  </body>
</html>`;

// Write HTML file
const htmlPath = join(distDir, 'index.html');
writeFileSync(htmlPath, html, 'utf-8');

console.log(`✅ Generated: dist/index.html`);
