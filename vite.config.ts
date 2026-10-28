import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { appendFile, mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const DEV_FORMS_PATH = '/__dev/forms';
const DEV_ANALYTICS_PATH = '/__dev/analytics';
const DEV_SUBMISSIONS_FILE = '.local/submissions.jsonl';
const MAX_BODY_BYTES = 64 * 1024;

/**
 * Development-only endpoints so forms and analytics have a genuine, inspectable
 * submission path while the real backend is being connected. Submissions are
 * appended to .local/submissions.jsonl (git-ignored). Never served in production.
 */
function devEndpoints(): Plugin {
  return {
    name: 'huskysips-dev-endpoints',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'POST') return next();
        if (req.url !== DEV_FORMS_PATH && req.url !== DEV_ANALYTICS_PATH) return next();
        let raw = '';
        req.on('data', (chunk: Buffer) => {
          raw += chunk.toString('utf8');
          if (raw.length > MAX_BODY_BYTES) req.destroy();
        });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          if (req.url === DEV_ANALYTICS_PATH) {
            res.statusCode = 204;
            res.end();
            return;
          }
          try {
            const body = JSON.parse(raw) as Record<string, unknown>;
            const id = randomUUID();
            await mkdir('.local', { recursive: true });
            await appendFile(
              DEV_SUBMISSIONS_FILE,
              JSON.stringify({ id, receivedAt: new Date().toISOString(), ...body }) + '\n',
            );
            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true, id }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ ok: false, error: 'invalid_body' }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devEndpoints()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
  },
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
    },
  },
});
