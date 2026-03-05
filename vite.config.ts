import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    // Disable source maps during build to avoid the specific code path
    sourcemap: false,
  },
  esbuild: {
    // Force single-threaded esbuild
  },

  server: { port: 5100 },
  preview: { port: 5101 },
})
