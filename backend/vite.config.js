import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',  // Badilisha hapa
        changeOrigin: true,
        secure: false,
      },
      '/broadcasting': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})