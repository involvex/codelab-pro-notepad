/**
 * Development Server for CodeLab Pro
 * Serves the application with Bun's built-in bundler
 */

const PORT = 3000;

console.log(`
🚀 CodeLab Pro Development Server Starting...

   Building application...
`);

// Build the application in development mode
const buildResult = await Bun.build({
  entrypoints: ["./src/index.tsx"],
  outdir: "./dev-build",
  target: "browser",
  format: "esm",
  sourcemap: "inline",
  splitting: false,
  minify: false,
  plugins: [],
});

if (!buildResult.success) {
  console.error("❌ Build failed:");
  buildResult.logs.forEach(log => console.error(log));
  process.exit(1);
}

console.log("✅ Build successful!\n");

// Serve the built application
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // Serve index.html for root and SPA routes
    if (path === "/" || !path.includes(".")) {
      const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="CodeLab Pro - Code Editor" />
    <title>CodeLab Pro - Development</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
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
    <script type="module" src="/index.js"></script>
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
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Serve the bundled JavaScript
    if (path === "/index.js") {
      const file = Bun.file("./dev-build/index.js");
      if (await file.exists()) {
        return new Response(file, {
          headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "no-cache",
          },
        });
      }
    }

    // Serve CSS files
    if (path.endsWith(".css")) {
      const file = Bun.file("./dev-build" + path);
      if (await file.exists()) {
        return new Response(file, {
          headers: {
            "Content-Type": "text/css",
            "Cache-Control": "no-cache",
          },
        });
      }
    }

    // 404
    return new Response("Not Found", { status: 404 });
  },
  error(error) {
    console.error("Server error:", error);
    return new Response("Internal Server Error: " + error.message, {
      status: 500,
    });
  },
});

console.log(`🎉 Server ready!

   Local:   http://localhost:${PORT}
   Network: http://0.0.0.0:${PORT}

   Press Ctrl+C to stop
`);
