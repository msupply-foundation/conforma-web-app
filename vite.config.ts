import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pluginPurgeCss from '@mojojoejo/vite-plugin-purgecss'

// https://vitejs.dev/config/
export default defineConfig({
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
  server: { port: 5100 },
  preview: { port: 5101 },
})
