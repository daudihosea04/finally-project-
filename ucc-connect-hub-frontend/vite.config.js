// C:\wamp64\www\ucc-connect-hub\ucc-connect-hub-frontend\vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // ✅ Backend port 8000
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/broadcasting': {
        target: 'http://localhost:8080',  // ✅ Reverb port 8080
        changeOrigin: true,
        secure: false
      }
    }
  }
})