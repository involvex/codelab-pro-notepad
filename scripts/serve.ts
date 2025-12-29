/**
 * Production Server for CodeLab Pro
 * Serves the built application from dist/
 */

const PORT = 3000;
const DIST_DIR = './dist';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;

    // Default to index.html for root
    if (path === '/') {
      path = '/index.html';
    }

    // Try to serve the file from dist
    const filePath = DIST_DIR + path;
    const file = Bun.file(filePath);

    if (await file.exists()) {
      // Determine content type
      let contentType = 'application/octet-stream';
      if (path.endsWith('.html')) contentType = 'text/html';
      else if (path.endsWith('.js')) contentType = 'application/javascript';
      else if (path.endsWith('.css')) contentType = 'text/css';
      else if (path.endsWith('.json')) contentType = 'application/json';
      else if (path.endsWith('.svg')) contentType = 'image/svg+xml';
      else if (path.endsWith('.png')) contentType = 'image/png';
      else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) contentType = 'image/jpeg';

      return new Response(file, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    // SPA fallback - serve index.html for unknown routes
    const indexFile = Bun.file(DIST_DIR + '/index.html');
    if (await indexFile.exists()) {
      return new Response(indexFile, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
  error(error) {
    console.error('Server error:', error);
    return new Response('Internal Server Error', { status: 500 });
  },
});

console.log(`
🚀 CodeLab Pro Production Server

   Local:   http://localhost:${PORT}
   Network: http://0.0.0.0:${PORT}

   Serving: ${DIST_DIR}/

   Press Ctrl+C to stop
`);
