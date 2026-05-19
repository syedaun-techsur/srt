## Story Map Matrix

> **Reading guide:** Stages flow left-to-right across a persona's journey. Stories within a stage are stacked top-to-bottom by detail level (foundational → experiential). NaC is the testable JTBD-derived criterion for each story in its stage context.

---

### PER-01: Marcus Webb — Business Requester

Primary journeys: JRN-01.1 (Form submission), JRN-01.2 (Validation recovery), JRN-01.3 (Post-submit verification)

| SM-ID | Journey Stage | Activity | Epic | Story | NaC (JTBD Source) | Release |
|-------|--------------|----------|------|-------|-------------------|---------|
| SM-1.2 | **Arrive** (JRN-01.1.1) | Open app; frontend loads in browser | Epic 1 (F1) | US-1.2: Navigate Between Submission Form and Request List | JTBD-01.1 → Navigation controls are visible on page load; user reaches the form in one click without confusion | R1 |
| SM-5.1 | **Orient** (JRN-01.1.2) | Scan form layout; identify required fields | Epic 5 (F5) | US-5.1: Submit a Request Through the Web Form | JTBD-01.1 → Three labeled fields are visible in a single vertical stack before the user types; required intent is clear at a glance | R2 |
| SM-5.2 | **Orient** (JRN-01.2.2) | Attempt blank submit; read inline errors | Epic 5 (F5) | US-5.2: Form Shows Inline Errors for Blank Required Fields | JTBD-01.3 → Clicking Submit with all fields blank shows three field-level error messages within 200ms; zero network requests are made | R2 |
| SM-5.3 | **Fill** (JRN-01.1.3) | Type in fields; tab between them | Epic 5 (F5) | US-5.3: Submit Button Is Disabled During API Call | JTBD-01.1 → Submit button becomes disabled immediately on valid submit click; double-submission is physically prevented | R2 |
| SM-5.4 | **Fill / Correct** (JRN-01.2.3) | Retype after error; see errors clear | Epic 5 (F5) | US-5.4: Form Preserves Data and Shows Error on API Failure | JTBD-01.2 → On API failure, entered data is preserved and a clear error message appears; user can retry without re-typing | R2 |
| SM-5.1b | **Submit** (JRN-01.1.4) | Click Submit; wait for response | Epic 5 (F5) | US-5.1: Submit a Request Through the Web Form | JTBD-01.2 → POST /api/requests is called; form clears and/or user is redirected within 3 seconds of a 201 response | R2 |
| SM-6.2 | **Confirm** (JRN-01.1.5 / JRN-01.3.3) | Form clears or list shows new entry | Epic 6 (F6) | US-6.2: Verify Submitted Request Appears in List Immediately | JTBD-01.2 → Submitted request is visible in the list table within the same session; no manual reload required | R2 |
| SM-6.5 | **Load list** (JRN-01.3.2) | Navigate to list; see loading state | Epic 6 (F6) | US-6.5: List View Shows Loading State While Fetching | JTBD-01.2 → A visible loading indicator appears while GET /api/requests is in flight; it clears as soon as data arrives | R1 |

---

### PER-02: Dana Park — Internal Stakeholder / Developer

Primary journeys: JRN-02.1 (Zero-setup validation), JRN-02.2 (CORS & API inspection), JRN-02.3 (Reference audit)

| SM-ID | Journey Stage | Activity | Epic | Story | NaC (JTBD Source) | Release |
|-------|--------------|----------|------|-------|-------------------|---------|
| SM-0.1 | **Clone / Start backend** (JRN-02.1.1–2) | `git clone` + `./mvnw spring-boot:run` | Epic 0 (F0) | US-0.1: Start Backend with Zero Configuration | JTBD-02.1 → `./mvnw spring-boot:run` starts the backend in under 30 seconds on JDK 17+; no external dependencies or config required | R1 |
| SM-0.2 | **Start backend** (JRN-02.1.2) | Inspect H2 console post-start | Epic 0 (F0) | US-0.2: Access H2 Console for Database Inspection | JTBD-02.3 → H2 console is accessible at /h2-console with correct JDBC URL; REQUESTS table schema is visible and matches the JPA entity | R1 |
| SM-0.3 | **Start backend** (JRN-02.2.2–3) | Verify CORS headers in DevTools | Epic 0 (F0) | US-0.3: Backend Accepts CORS Requests from Frontend | JTBD-02.2 → Access-Control-Allow-Origin: http://localhost:5173 is present in all /api/** responses; OPTIONS preflight returns no 4xx; zero CORS errors in console | R1 |
| SM-1.1 | **Start frontend** (JRN-02.1.3) | `npm run dev`; app loads on 5173 | Epic 1 (F1) | US-1.1: Start Frontend Dev Server with Zero Configuration | JTBD-02.1 → `npm install && npm run dev` brings up Vite on port 5173 with no additional config; `npm run build` produces zero TypeScript errors | R1 |
| SM-1.3 | **Navigate source structure** (JRN-02.3.1) | Locate API URL in codebase | Epic 1 (F1) | US-1.3: Backend Base URL Is Centrally Configured | JTBD-02.3 → API_BASE_URL is found in a single constants file in under 2 minutes; no component file contains a hardcoded localhost URL | R1 |
| SM-2.1 | **Start backend** (JRN-02.1.2 / JRN-02.3.3) | Verify H2 schema auto-creates | Epic 2 (F2) | US-2.1: Request Entity Is Persisted to H2 on Startup | JTBD-02.1 → requests table is auto-created from the JPA entity on startup; no SQL migration file exists; table resets cleanly on restart | R1 |
| SM-2.2 | **Find JPA entity** (JRN-02.3.3) | Inspect Request entity source | Epic 2 (F2) | US-2.2: Request Record Has Server-Assigned ID and Timestamp | JTBD-02.3 → id and created_at are server-assigned; the JPA entity pattern (5 fields, @PrePersist) is readable and replicable in under 3 minutes | R1 |
| SM-3.1 | **Submit test request** (JRN-02.1.4 / JRN-02.2.3) | POST via form; inspect 201 response | Epic 3 (F3) | US-3.1: Submit a Valid Request via API | JTBD-02.1 → POST /api/requests with valid body returns 201 Created with full entity including id and createdAt; record immediately retrievable via GET | R2 |
| SM-3.2 | **Inspect blank-form validation** (JRN-02.2.4) | Blank submit; watch network panel | Epic 3 (F3) | US-3.2: API Rejects Submission with Missing or Blank Fields | JTBD-02.2 → POST with any missing/blank required field returns 400 Bad Request with structured error body; no record written to H2 | R2 |
| SM-3.3 | **Inspect POST** (JRN-02.2.3) | Send malformed body; watch response | Epic 3 (F3) | US-3.3: API Rejects Malformed Request Body | JTBD-02.2 → Non-JSON POST body returns 400; no stack trace in response; endpoint never returns 500 for malformed input | R2 |
| SM-4.1 | **Verify list** (JRN-02.1.5 / JRN-02.2.2) | GET /api/requests; check JSON array | Epic 4 (F4) | US-4.1: Retrieve All Submitted Requests via API | JTBD-02.1 → GET /api/requests returns 200 OK with a JSON array; each record contains all 5 fields; response is never null or non-array | R1 |
| SM-4.2 | **Inspect GET on list load** (JRN-02.2.2) | GET on fresh start; expect empty array | Epic 4 (F4) | US-4.2: GET Endpoint Returns Empty Array When No Requests Exist | JTBD-02.2 → GET on empty database returns 200 with body []; not 404; no error logged; verifiable from a fresh service start | R1 |
| SM-6.1 | **Verify list** (JRN-02.1.5 / JRN-02.2.2) | Navigate to list; confirm table renders | Epic 6 (F6) | US-6.1: View All Submitted Requests in a Table | JTBD-02.1 → List screen renders full-width table with Name, Request Title, Description columns on mount; all API records appear; GET fires exactly once | R1 |
| SM-6.3 | **Confirm zero configuration** (JRN-02.1.6) | Fresh start; list shows empty state | Epic 6 (F6) | US-6.3: List View Shows Empty State When No Requests Exist | JTBD-02.1 → On fresh app start with no submissions, "No requests submitted yet." is displayed; no table rendered; no console errors | R1 |
| SM-6.4 | **Summarize** (JRN-02.2.5) | Backend unreachable; list shows error | Epic 6 (F6) | US-6.4: List View Handles Fetch Error Gracefully | JTBD-02.2 → If GET /api/requests fails, "Failed to load requests. Please try again." appears without crashing the app; no empty table rendered | R1 |

---

> **Note:** US-1.2 (SM-1.2) appears in both the PER-01 matrix (Arrive stage) and supports PER-02's JRN-02.1 Verify list stage. US-5.1 has two map entries (SM-5.1 and SM-5.1b) because it covers both the Orient stage (field display) and the Submit stage (API call + form clear) — two distinct journey moments within the same story.

---
