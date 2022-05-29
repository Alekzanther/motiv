import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
    react()
  ],
})
