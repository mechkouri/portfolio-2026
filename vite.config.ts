import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Local dev only: serves /api/chat with the real function, reading OPENROUTER_* from .env. */
function chatApi(): Plugin {
  return {
    name: 'local-chat-api',
    apply: 'serve',
    configureServer(server) {
      const g = globalThis as any;
      // loadEnv lets process.env win over the file, even when empty. A restart stays in the same process, so
      // forget empty values and the ones copied last time, or an edited .env would never be picked up.
      const copied: Set<string> = (g.__chatEnvKeys ??= new Set());
      for (const key of Object.keys(g.process.env)) {
        if (key.startsWith('OPENROUTER_') && (copied.has(key) || !g.process.env[key])) delete g.process.env[key];
      }
      copied.clear();
      const env = loadEnv(server.config.mode, server.config.root, 'OPENROUTER_');
      for (const [key, value] of Object.entries(env)) {
        if (!value || g.process.env[key]) continue;
        g.process.env[key] = value;
        copied.add(key);
      }

      server.middlewares.use('/api/chat', async (req: any, res: any) => {
        try {
          const chunks: any[] = [];
          for await (const chunk of req) chunks.push(chunk);
          const { default: handler } = await server.ssrLoadModule('/netlify/functions/chat.mts');
          const abort = new AbortController();
          res.on('close', () => abort.abort());
          const response: Response = await handler(
            new Request(`http://${req.headers.host}/api/chat`, {
              method: req.method,
              headers: req.headers,
              body: req.method === 'POST' ? g.Buffer.concat(chunks) : undefined,
              signal: abort.signal,
            }),
            { ip: req.socket.remoteAddress },
          );
          res.writeHead(response.status, Object.fromEntries(response.headers));
          if (response.body) for await (const part of response.body as any) res.write(part);
          res.end();
        } catch (error) {
          server.config.logger.error(`/api/chat: ${(error as Error).message}`);
          if (res.headersSent) res.destroy();
          else res.writeHead(500).end();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), chatApi()],
  build: {
    target: 'es2020',
    // three.js only loads lazily on capable desktops, so its size never affects first paint.
    chunkSizeWarningLimit: 1000,
  },
});
