---

## F01: React Frontend Scaffold

**PRD Reference:** F1 | **Priority:** P0 | **Phase:** 1

**Description:** The React application is scaffolded using Vite with TypeScript and configured to communicate with the Spring Boot backend. It provides the application shell — routing or navigation between the two screens (form and list) — and the HTTP client setup. This is the foundational layer that the frontend features (F5, F6) are built on top of.

---

### Terminology

- **Vite:** The build tool and development server used to scaffold and serve the React application. Default dev port is `5173`.
- **TypeScript (TSX):** The typed superset of JavaScript used for all frontend source files. Component files use the `.tsx` extension.
- **`fetch` API:** The native browser HTTP client used for API calls to the backend. Axios is an acceptable alternative but not required.
- **App Shell:** The top-level `App.tsx` component that includes navigation and renders either the form or the list screen.
- **Navigation:** Simple tab-style or link-based switching between the two views. React Router is recommended but a simple state-based toggle is acceptable given the scope.
- **Base URL:** The backend API root — `http://localhost:8080/api`. Defined as a constant to avoid hardcoding in multiple places.

---

### Sub-features

- Vite + React + TypeScript project initialized (`npm create vite@latest`)
- Minimal baseline CSS: readable typography, centered layout, no UI framework dependency
- HTTP client module: a shared constant or utility exporting the backend base URL
- Two-screen navigation: links or tabs to switch between the Submission Form (F5) and Request List (F6)
- Development server runs on `http://localhost:5173` with `npm run dev`

---

### Process

1. Project is created with: `npm create vite@latest srt-frontend -- --template react-ts`
2. Dependencies are installed: `npm install`
3. Minimal CSS is written in `src/index.css` or `src/App.css`:
   - Body: `font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 16px;`
   - No UI framework (no Tailwind, no MUI, no Bootstrap)
4. A `constants.ts` (or `api.ts`) file exports `API_BASE_URL = "http://localhost:8080/api"`.
5. `App.tsx` is updated to include:
   - Navigation controls (e.g., two `<button>` or `<a>` elements labeled "Submit Request" and "View Requests")
   - Conditional rendering of `<SubmissionForm />` (F5) or `<RequestList />` (F6) based on active view
6. Developer runs `npm run dev`; the Vite dev server starts at `http://localhost:5173`.
7. Navigation between both screens works; no console errors on initial load.

---

### Inputs

- **`npm create vite@latest` command**: scaffolds the project structure.
- **`package.json`**: declares `react`, `react-dom`, and `typescript` as dependencies.
- **No runtime user inputs** — this feature is pure infrastructure.

---

### Outputs

- Running Vite dev server at `http://localhost:5173`
- `src/` directory with: `main.tsx`, `App.tsx`, `index.css`
- Constants file exporting `API_BASE_URL`
- Two navigable views rendered by `App.tsx`
- TypeScript compilation succeeds with `npm run build` (no type errors)

---

### Validation

- `npm run dev` must start without errors.
- `npm run build` must complete without TypeScript or build errors.
- Navigation between the two views must work without page reload.
- No hardcoded `http://localhost:8080` URLs anywhere except the `constants.ts`/`api.ts` file.
- No UI framework dependencies in `package.json` (Tailwind, MUI, Bootstrap, etc. are out of scope).

---

### Error States

| Scenario | Behavior | Resolution |
|----------|----------|------------|
| Port 5173 already in use | Vite starts on next available port (e.g., 5174); CORS origin may mismatch | Kill process on 5173 or update Spring Boot CORS config |
| Node.js version too old | `npm create vite` fails with unsupported engine error | Upgrade to Node.js 18+ |
| TypeScript errors in scaffold | `npm run build` fails | Fix type errors; ensure `tsconfig.json` is Vite-generated default |
| Backend unreachable on load | API calls fail with network error; list view shows error or empty state | Ensure Spring Boot backend is running on port 8080 |

---

### API Surface (this feature)

No API endpoints defined in this feature. The frontend scaffold consumes endpoints defined in F03 (`POST /api/requests`) and F04 (`GET /api/requests`). See `Y1-api.md`.

---

### Schema Surface (this feature)

No database tables. Frontend only.
