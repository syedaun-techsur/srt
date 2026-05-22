import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Same-origin /api so the frontend works inside any iframe preview.
    // Inside the sandbox, Spring Boot listens on 127.0.0.1:8080 — Vite proxies
    // /api → Spring. Outside (plain `npm run dev`), same behavior on the
    // user's localhost. SPRING_INTERNAL_URL lets CI / k8s override the target
    // without touching this file.
    proxy: {
      '/api': {
        target: process.env.SPRING_INTERNAL_URL ?? 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
})
