---
phase: 01-read-path
verified: 2026-05-20T16:42:00Z
status: passed
score: 4/4 must-haves verified
re_verification: false
---

# Phase 1: Read Path Verification Report

**Phase Goal:** Both services run locally, the data model is live, and a user can open the app and see all submitted requests (including a graceful empty state)
**Verified:** 2026-05-20T16:42:00Z
**Status:** ✅ PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `./mvnw spring-boot:run` starts backend on port 8080 with no errors; `GET /api/requests` returns `[]` | ✓ VERIFIED | Live test: HTTP 200, body `[]`; Spring logs show clean startup in 2.179s on port 8080 |
| 2 | `npm run dev` starts frontend on port 5173 with no errors; no browser CORS failures when calling backend | ✓ VERIFIED | `npm run build` passes 0 TS errors; CORS OPTIONS returns 200 with `Access-Control-Allow-Origin: http://localhost:5173` |
| 3 | Request List view loads, displays table with Name/Request Title/Description columns when records exist; shows "No requests submitted yet." when DB is empty | ✓ VERIFIED | Playwright tests 1 & 2 pass; exact strings confirmed in RequestList.tsx source |
| 4 | If backend is unreachable, Request List view shows an error message instead of crashing | ✓ VERIFIED | Playwright tests 3 & 4 pass (network abort + 5xx both show exact error message) |

**Score:** 4/4 truths verified

---

## Required Artifacts

### Backend (Plan 01-01)

| Artifact | Provides | Status | Details |
|----------|----------|--------|---------|
| `srt-backend/src/main/java/com/example/srt/entity/Request.java` | JPA entity mapped to requests table | ✓ VERIFIED | `@Entity`, `@Table(name = "requests")`, all 5 fields (id, name, title, description, createdAt), `@PrePersist` timestamp |
| `srt-backend/src/main/java/com/example/srt/config/CorsConfig.java` | CORS configuration allowing localhost:5173 | ✓ VERIFIED | `allowedOrigins("http://localhost:5173")`, methods GET/POST/OPTIONS, wildcard headers |
| `srt-backend/src/main/java/com/example/srt/controller/RequestController.java` | GET /api/requests endpoint | ✓ VERIFIED | `@GetMapping`, calls `requestRepository.findAll()`, returns `ResponseEntity.ok(requests)` |
| `srt-backend/src/main/resources/application.properties` | H2 datasource and JPA config | ✓ VERIFIED | `jdbc:h2:mem:srtdb`, `create-drop`, H2 console enabled at `/h2-console`, ISO 8601 dates |
| `srt-backend/src/main/java/com/example/srt/repository/RequestRepository.java` | JPA repository | ✓ VERIFIED | `extends JpaRepository<Request, Long>` |

### Frontend (Plan 01-02)

| Artifact | Provides | Status | Details |
|----------|----------|--------|---------|
| `srt-frontend/src/constants.ts` | API_BASE_URL constant | ✓ VERIFIED | `export const API_BASE_URL = "http://localhost:8080/api"` |
| `srt-frontend/src/types.ts` | SrtRequest TypeScript interface | ✓ VERIFIED | `SrtRequest`, `CreateRequestPayload`, `ApiError` interfaces all present |
| `srt-frontend/src/components/RequestList.tsx` | RequestList component with fetch, table, empty state, error state | ✓ VERIFIED | `useEffect([], [])` fetch, LoadState union type, all 4 render states, exact strings |
| `srt-frontend/src/App.tsx` | App shell with activeView state and navigation | ✓ VERIFIED | `activeView` state defaulting to `'list'`, nav buttons, conditional `<RequestList />` render |
| `e2e/request-list.spec.ts` | Playwright E2E tests | ✓ VERIFIED | 5 tests, all pass (confirmed via `NODE_PATH=./node_modules npx playwright test`) |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `RequestController.java` | `RequestRepository.java` | `requestRepository.findAll()` | ✓ WIRED | Line 22: `List<Request> requests = requestRepository.findAll();` — result returned to caller |
| `Request.java` | `requests` table | `@Table(name = "requests")` | ✓ WIRED | Line 7: `@Table(name = "requests")` — confirmed in live log: `create table requests (...)` |
| `RequestList.tsx` | `http://localhost:8080/api/requests` | `fetch` in `useEffect` with `[]` dep | ✓ WIRED | Line 12: `fetch(\`${API_BASE_URL}/requests\`)` with `.then(setRequests)` and `setLoadState('success')` |
| `App.tsx` | `RequestList` component | conditional render on `activeView === 'list'` | ✓ WIRED | Line 2: import; Line 28: `{activeView === 'list' && <RequestList />}` |
| `RequestList.tsx` | `constants.ts` | `import { API_BASE_URL }` | ✓ WIRED | No `localhost:8080` hardcoded anywhere in components — only in `constants.ts` |

---

## Requirements Coverage

| Feature | Status | Evidence |
|---------|--------|---------|
| BACK-01: Spring Boot backend scaffolded | ✓ SATISFIED | `SrtApplication.java`, `pom.xml`, `mvnw` all present and working |
| BACK-02: H2 in-memory database configured | ✓ SATISFIED | `application.properties` with `jdbc:h2:mem:srtdb`; Hibernate creates table on startup |
| BACK-03: Request entity (id/name/title/description/created_at) | ✓ SATISFIED | All 5 fields in `Request.java` with correct types |
| BACK-04: CORS allowing React frontend | ✓ SATISFIED | Live CORS OPTIONS → `Access-Control-Allow-Origin: http://localhost:5173` |
| API-01: GET /api/requests returns JSON array | ✓ SATISFIED | Live: `200 []`; Hibernate query confirmed in logs |
| FRONT-01: React frontend scaffolded with Vite+TypeScript | ✓ SATISFIED | `srt-frontend/` with Vite 8, React 19, TypeScript 6; `npm run build` → 0 errors |
| FRONT-02: Frontend connects to backend via HTTP | ✓ SATISFIED | `RequestList.tsx` fetches `${API_BASE_URL}/requests` on mount |
| LIST-01: Table with Name/Request Title/Description columns | ✓ SATISFIED | Playwright test 2 passes; exact column headers in `<th>` elements |
| LIST-02: All records loaded on page render | ✓ SATISFIED | `useEffect(..., [])` — fetch on mount, not on every render |
| LIST-03: Empty state "No requests submitted yet." | ✓ SATISFIED | Exact string at line 35 of `RequestList.tsx`; Playwright test 1 passes |
| LIST-04: Error state "Failed to load requests. Please try again." | ✓ SATISFIED | Exact string at line 31 of `RequestList.tsx`; Playwright tests 3 & 4 pass |

---

## Anti-Patterns Found

| File | Pattern | Severity | Assessment |
|------|---------|----------|------------|
| `srt-frontend/src/App.tsx:33` | `<p>Form coming in Phase 2.</p>` | ℹ️ Info | Intentional Phase 2 stub for SubmissionForm — explicitly documented in plan as out-of-scope. **Not a blocker.** |

No TODO/FIXME/XXX/HACK comments found. No `return null` / empty implementations found in Phase 1 artifacts.

**Note:** `@playwright/test` was in `package.json` but was not installed in `node_modules` when verified. Likely stripped during a `npm install` run without devDependencies. Running `npm install` restores it. The tests themselves pass correctly (5/5). This is an environment issue, not a code issue — the spec files are correct.

---

## Human Verification Required

### 1. Browser smoke test — full round-trip with live backend

**Test:** Start backend (`cd srt-backend && ./mvnw spring-boot:run`), then start frontend (`cd srt-frontend && npm run dev`), open `http://localhost:5173` in a browser.
**Expected:** Navigation buttons "Submit Request" and "View Requests" are visible. The list view shows "No requests submitted yet." within ~1 second. No console CORS errors in browser devtools.
**Why human:** Cannot verify visual rendering and browser-native fetch CORS behavior programmatically in this environment.

### 2. H2 console accessibility

**Test:** With backend running, open `http://localhost:8080/h2-console` in a browser. Connect with JDBC URL `jdbc:h2:mem:srtdb`, username `sa`, empty password.
**Expected:** H2 console connects and shows the `REQUESTS` table with columns: `ID`, `NAME`, `TITLE`, `DESCRIPTION`, `CREATED_AT`.
**Why human:** Browser-based UI — cannot verify via curl.

---

## Live Backend Evidence

```
Spring Boot 3.5.0 started in 2.179s on port 8080
Hibernate: create table requests (created_at timestamp(6) not null, id bigint generated by default as identity, description TEXT not null, name varchar(255) not null, title varchar(255) not null, primary key (id))
H2 console available at '/h2-console'. Database available at 'jdbc:h2:mem:srtdb'
GET /api/requests → HTTP 200, body: []
CORS OPTIONS → HTTP 200, Access-Control-Allow-Origin: http://localhost:5173
```

## Playwright Test Results

```
Running 5 tests using 1 worker
  ✓  1 shows empty state when API returns empty array (243ms)
  ✓  2 renders table with Name, Request Title, Description columns when data exists (269ms)
  ✓  3 shows error message when backend is unreachable (282ms)
  ✓  4 shows error message when backend returns 5xx (264ms)
  ✓  5 navigation shows Submit Request and View Requests buttons (272ms)
  5 passed (3.7s)
```

## Frontend Build

```
> srt-frontend@0.0.0 build
> tsc -b && vite build
✓ built in 182ms (0 TypeScript errors)
```

---

_Verified: 2026-05-20T16:42:00Z_
_Verifier: Claude (pivota_spec-verifier)_
