import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import pluginPurgeCss from '@mojojoejo/vite-plugin-purgecss'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // The vite dev server proxies all backend traffic so the browser sees
  // same-origin requests — matching how the app behaves in production
  // (where the frontend and backend share one host). This avoids
  // cross-origin headaches: CORS preflights, `<a download>` being silently
  // ignored, brief navigation flickers on file downloads, etc.
  //
  // The proxy target is chosen at dev-server startup based on
  // `VITE_REMOTE_SERVER` in the .env file:
  //
  // - **Unset** (default): targets the local backend on port 8080. Paths
  //   pass through unchanged (browser sends `/api/...`, backend serves
  //   `/api/...`).
  //
  // - **Set** (e.g. a staging URL): targets that origin instead, and
  //   rewrites paths to mount under `/server/...` because remote deployments
  //   serve the backend at `/server/api` and `/server/graphql` rather than
  //   at the root. `changeOrigin: true` rewrites the Host header to match
  //   the target so reverse proxies / TLS SNI behave.
  //
  // To switch modes: set/unset `VITE_REMOTE_SERVER` in .env, then restart
  // the dev server (vite reads env vars at startup). No app-code changes —
  // in dev the client emits same-origin `/api` and `/graphql` requests
  // (built as absolute `http://<dev-host>/api` URLs against window.location,
  // see endpointUrlBuilder), which this proxy matches on path and forwards
  // just the same — so it stays same-origin with no CORS either way.
  const remoteServer = env.VITE_REMOTE_SERVER
  const apiProxy = remoteServer
    ? {
        target: remoteServer,
        changeOrigin: true,
        rewrite: (path: string) => `/server${path}`,
      }
    : 'http://localhost:8080'

  // The websocket is proxied too, so it stays same-origin like everything else.
  // That is load-bearing rather than tidiness: the auth cookies are Secure and
  // SameSite=Strict, and a cross-origin `ws://` handshake arrives without them,
  // leaving the server unable to tell which session the socket belongs to (so
  // it can't send that client a "session-expired" notification).
  //
  // Remote deployments serve it under `/websocket` rather than `/server`, which
  // is the one path that differs from the REST proxy above.
  const websocketProxy = remoteServer
    ? {
        target: remoteServer,
        changeOrigin: true,
        ws: true,
        rewrite: (path: string) => `/websocket${path}`,
      }
    : { target: 'http://localhost:8080', ws: true }

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
      proxy: {
        '/api': apiProxy,
        '/graphql': apiProxy,
        '/server-status': websocketProxy,
      },
    },
    preview: { port: 5101 },
  }
})
