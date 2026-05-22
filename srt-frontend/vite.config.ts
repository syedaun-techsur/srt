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
    //
    // The proxy strips the browser's `Origin` header before forwarding so
    // Spring sees a same-origin request and the CORS filter doesn't reject
    // it. This is correct because the Vite proxy IS acting as the
    // same-origin gateway — the actual origin policy belongs at this layer,
    // not at Spring (which has no way to know about Pivota's wildcard
    // preview hostnames). Without this, browsers loading the SPA from an
    // iframe origin (e.g. `5173-…preview.lvh.me:3000`) would see
    // "Invalid CORS request" on POST.
    proxy: {
      '/api': {
        target: process.env.SPRING_INTERNAL_URL ?? 'http://127.0.0.1:8080',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin')
          })
        },
      },
    },
  },
})
