#!/usr/bin/env bun

/**
 * CodeLab Pro CLI
 * Starts the production server for CodeLab Pro
 */

import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadConfig, displayConfig, createDefaultConfig } from "./config.js";
import bun from "bun";

// Get the installation directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, "..");
const DIST_DIR = join(ROOT_DIR, "dist");

// Handle CLI commands
const command = process.argv[2];

if (command === "init") {
  console.log("\n🔧 Initializing CodeLab Pro configuration...\n");
  createDefaultConfig(ROOT_DIR);
  process.exit(0);
}

if (command === "config") {
  const config = loadConfig(ROOT_DIR);
  displayConfig(config);
  process.exit(0);
}

if (command === "help" || command === "--help" || command === "-h") {
  console.log(`
CodeLab Pro CLI

Usage:
  codelab              Start the production server
  codelab init         Create a default .codelabrc.json config file
  codelab config       Display current configuration
  codelab help         Show this help message

Options:
  --port, -p <port>    Server port (default: 3000)
  --host <host>        Server host (default: 0.0.0.0)
  --theme <theme>      Default editor theme
  --no-plugins         Disable plugin system

Environment Variables:
  CODELAB_PORT         Server port
  CODELAB_HOST         Server host
  CODELAB_THEME        Default theme
  CODELAB_PLUGINS_DIR  Plugins directory

Examples:
  codelab --port 8080
  codelab --theme monokai --no-plugins
  CODELAB_PORT=3001 codelab

`);
  process.exit(0);
}

// Load configuration
const config = loadConfig(ROOT_DIR);
const PORT = config.server.port;

console.log(`
🚀 Starting CodeLab Pro...

   Installation: ${ROOT_DIR}
   Serving from: ${DIST_DIR}
`);

// Check if dist/ exists
const distExists = await bun.file(join(DIST_DIR, "index.html")).exists();

if (!distExists) {
  console.error(`
❌ Error: Build files not found!

   The dist/ directory is missing or empty.
   Please build the project first:

   cd ${ROOT_DIR}
   bun run build

`);
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const server = bun.serve({
  port: PORT,
  hostname: config.server.host,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;

    // Default to index.html for root
    if (path === "/") {
      path = "/index.html";
    }

    // Try to serve the file from dist
    const filePath = DIST_DIR + path;
    const file = bun.file(filePath);

    if (await file.exists()) {
      // Determine content type
      let contentType = "application/octet-stream";
      if (path.endsWith(".html")) contentType = "text/html";
      else if (path.endsWith(".js")) contentType = "application/javascript";
      else if (path.endsWith(".css")) contentType = "text/css";
      else if (path.endsWith(".json")) contentType = "application/json";
      else if (path.endsWith(".svg")) contentType = "image/svg+xml";
      else if (path.endsWith(".png")) contentType = "image/png";
      else if (path.endsWith(".jpg") || path.endsWith(".jpeg"))
        contentType = "image/jpeg";

      return new Response(file, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": `public, max-age=${config.server.maxAge}`,
        },
      });
    }

    // SPA fallback - serve index.html for unknown routes
    const indexFile = bun.file(DIST_DIR + "/index.html");
    if (await indexFile.exists()) {
      return new Response(indexFile, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
  error(error) {
    console.error("Server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  },
});

console.log(`
✅ CodeLab Pro is running!

   Local:   http://localhost:${PORT}
   Network: http://0.0.0.0:${PORT}

   Press Ctrl+C to stop

`);
