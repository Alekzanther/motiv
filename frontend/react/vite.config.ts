import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
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
    react(),
    tsconfigPaths(),
  ],
})
