import { defineConfig } from 'vite'
import { VitePWA as pwa } from "vite-plugin-pwa";
import manifest from "./public/manifest.json";
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    proxy: {
      '/graphql': {
             target: 'http://0.0.0.0:5000',
             changeOrigin: true,
             secure: false,      
             ws: true,
      },
      '/m': {
             target: 'http://0.0.0.0:5000',
             changeOrigin: true,
             secure: false,      
             ws: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
  plugins: [
    tsconfigPaths(),
    react(),
    pwa({
      strategies: "injectManifest",
      srcDir: "",
      filename: "service-worker.js",
      manifest,
    }),
  ],
})
