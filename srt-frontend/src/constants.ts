// Origin-relative API base so the frontend works in any host:
//   - Local dev (`npm run dev`):     Vite proxies `/api` to `http://localhost:8080`
//   - Pivota wildcard preview:        Vite proxies `/api` to the in-sandbox Spring on 127.0.0.1:8080
//   - Production (built + served):    served same-origin as the API behind a reverse proxy
// Hardcoding `http://localhost:8080` only works when the page is served from the user's host,
// which breaks the moment the frontend is hosted under a different origin (iframe preview, prod).
export const API_BASE_URL = "/api";
