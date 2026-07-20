import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const backendUrl = process.env.VITE_API_BACKEND_URL || 'http://localhost:5124';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/Logincontroller': {
        target: backendUrl,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
