const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

// Kumpulan klien SSE untuk Live Reload otomatis
const clients = new Set();

// Watch file perubahan di folder saat ini
try {
  fs.watch(ROOT_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    if (filename.includes('node_modules') || filename.startsWith('.')) return;
    clients.forEach((res) => {
      res.write('data: reload\n\n');
    });
  });
} catch (e) {
  // Ignore watch error pada platform tertentu
}

const LIVE_RELOAD_SCRIPT = `
<!-- Dev Server Live Reload Script -->
<script>
  (function() {
    try {
      const source = new EventSource('/__livereload');
      source.onmessage = function(e) {
        if (e.data === 'reload') {
          console.log('[Dev Server] File changed. Reloading...');
          location.reload();
        }
      };
    } catch(e) {}
  })();
</script>
</body>
`;

const server = http.createServer((req, res) => {
  // Endpoint SSE untuk Live Reload
  if (req.url === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  // Parse path URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, pathname);

  // Cegah directory traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1><p>Halaman atau berkas tidak ditemukan.</p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Jika file HTML, suntikkan script live-reload otomatis
    if (ext === '.html') {
      fs.readFile(filePath, 'utf8', (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Server Error');
          return;
        }
        const injected = content.includes('</body>')
          ? content.replace('</body>', LIVE_RELOAD_SCRIPT)
          : content + LIVE_RELOAD_SCRIPT;

        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        res.end(injected);
      });
      return;
    }

    // Untuk file statis lainnya (CSS, JS, Gambar, PDF)
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = PORT + 1;
    console.log(`Port ${PORT} sedang digunakan, mencoba port ${nextPort}...`);
    server.listen(nextPort);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, () => {
  const actualPort = server.address().port;
  console.log('\n======================================================');
  console.log(' 🚀 Local Dev Server Aktif (Zero Dependency)');
  console.log(` 👉 Local:   http://localhost:${actualPort}/`);
  console.log(' ⚡ Live Reload: Otomatis menyegarkan halaman saat file diedit');
  console.log('======================================================\n');
});

