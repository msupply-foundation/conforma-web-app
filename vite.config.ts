import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import pluginPurgeCss from '@mojojoejo/vite-plugin-purgecss'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Local dev: proxy /api and /graphql to the backend on 8080 so the browser
  // sees same-origin requests, matching production. Avoids cross-origin
  // quirks (CORS preflights, <a download> being ignored, etc.). When
  // VITE_REMOTE_SERVER is set we're targeting a remote backend, so the
  // proxy is skipped and URLs stay absolute (see config.ts).
  const useProxy = !env.VITE_REMOTE_SERVER

  return {
    plugins: [react(), pluginPurgeCss()],
    css: {
      preprocessorOptions: {
        less: {
          math: 'always',
          relativeUrls: true,
          javascriptEnabled: true,
        },
      },
    },
    build: {
      commonjsOptions: { transformMixedEsModules: true },
    },
    server: {
      port: 5100,
      proxy: useProxy
        ? {
            '/api': 'http://localhost:8080',
            '/graphql': 'http://localhost:8080',
          }
        : undefined,
    },
    preview: { port: 5101 },
  }
})
