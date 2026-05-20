# Requirements Traceability Matrix: Simple Request Tracker (SRT)

**Document ID:** RTM-SRT  
**Version:** 1.0  
**Date:** 2026-05-20  
**Status:** Active  
**Based on:** PRD-SRT v1.0, FRD-SRT v1.0, TechArch-SRT v1.0, UserStories-SRT v1.0

---

## 1. Overview

This Requirements Traceability Matrix (RTM) provides bidirectional traceability between all Simple Request Tracker (SRT) specification documents. It ensures that every product requirement defined in the PRD is decomposed into functional requirements in the FRD, mapped to a technical specification in the TechArch, covered by at least one user story, and testable through defined test cases. The matrix enables any stakeholder to trace a requirement from its business motivation through to its implementation specification and acceptance criteria.

SRT is a two-screen, zero-setup demo application consisting of a React + Vite + TypeScript frontend and a Java Spring Boot backend with an embedded H2 in-memory database. Every feature in scope is classified as P0 (critical path), meaning all requirements in this matrix are MVP blockers. The scope is intentionally minimal — seven features (F0–F6), twenty-two user stories (US-0.1 through US-6.5), and two delivery phases — making complete traceability achievable within this document.

This RTM serves four primary purposes: (1) confirming no PRD feature has been dropped from downstream specification, (2) confirming no FRD requirement exists without a PRD parent, (3) providing a single reference for test coverage planning, and (4) supporting change management by establishing the baseline against which all future changes are assessed.

---

## 2. Requirements Summary

### PRD Features (F0–F6)

- **F0 — Spring Boot Backend Scaffold** (Phase 1, P0): Spring Boot project with Web, JPA, and H2 dependencies; CORS configuration; H2 in-memory datasource; `application.properties` configured for port 8080
- **F1 — React Frontend Scaffold** (Phase 1, P0): Vite + React + TypeScript project; minimal CSS baseline; `API_BASE_URL` constant; two-screen navigation shell in `App.tsx`
- **F2 — Request Data Model & Persistence** (Phase 1, P0): `Request` JPA entity with `id`, `name`, `title`, `description`, `created_at`; `RequestRepository`; Hibernate `ddl-auto=create-drop`
- **F3 — POST Endpoint — Submit Request** (Phase 2, P0): `POST /api/requests`; server-side required-field validation; `201 Created` on success; `400 Bad Request` on blank fields or malformed JSON
- **F4 — GET Endpoint — List All Requests** (Phase 1, P0): `GET /api/requests`; returns full `Request` array; `200 OK` with `[]` when empty; no filtering or pagination
- **F5 — Request Submission Form** (Phase 2, P0): Vertical form with Name, Request Title, Description; client-side validation; inline errors; loading state; navigation to list on success
- **F6 — Request List View** (Phase 1, P0): Full-width table fetching `GET /api/requests` on mount; empty-state message; error-state message; no pagination

### FRD Functional Requirements (F00–F06)

- **F00** — Backend scaffold runnable with `./mvnw spring-boot:run`; CORS `WebMvcConfigurer`; H2 datasource at `jdbc:h2:mem:srtdb`; port 8080
- **F01** — Frontend scaffold runnable with `npm run dev`; `constants.ts` exports `API_BASE_URL`; two-view `App.tsx` shell
- **F02** — `Request.java` entity; `RequestRepository` extending `JpaRepository<Request, Long>`; `@PrePersist` for `createdAt`; `requests` table auto-created on startup
- **F03** — `POST /api/requests`; `RequestDto` deserialization; null/blank validation; `repository.save()`; `ResponseEntity` 201/400/500
- **F04** — `GET /api/requests`; `repository.findAll()`; always `200 OK`; natural insertion order; never `null` body
- **F05** — `SubmissionForm.tsx`; controlled inputs; `name/title/description.trim()` validation; per-field inline errors; `isSubmitting` state; `onSuccess()` callback
- **F06** — `RequestList.tsx`; `useEffect` on mount; three render states (loading, error, data); empty-state and error-state messages; `id` and `createdAt` not displayed

### TechArch Specifications

- **SPEC-ARCH** — Two-tier client-server architecture; React SPA on port 5173 communicates via HTTP/REST to Spring Boot on port 8080; H2 in-JVM; no service layer
- **SPEC-BE-001** — `SrtApplication.java` entry point; `CorsConfig.java` WebMvcConfigurer; `RequestController.java` at `/api/requests`; `RequestDto.java`; `Request.java` entity; `RequestRepository.java`
- **SPEC-BE-002** — `Request` entity: `id` (Long, IDENTITY), `name` (String, NOT NULL), `title` (String, NOT NULL), `description` (TEXT, NOT NULL), `createdAt` (LocalDateTime, NOT NULL, `@PrePersist`)
- **SPEC-BE-003** — `GET /api/requests`: `@GetMapping`, returns `ResponseEntity<List<Request>>`, `200 OK`
- **SPEC-BE-004** — `POST /api/requests`: `@PostMapping`, `@RequestBody RequestDto`, manual null/blank validation, `ResponseEntity` 201/400; `RequestDto` has `name`, `title`, `description` only
- **SPEC-BE-005** — CORS: origin `http://localhost:5173`, methods `GET POST OPTIONS`, headers `*`, `allowCredentials=false`; input validation at frontend, backend, and DB layers
- **SPEC-FE-001** — `App.tsx`: `activeView` state `'form' | 'list'`; navigation buttons; conditional render of `<SubmissionForm />` or `<RequestList />`
- **SPEC-FE-002** — `constants.ts`: `API_BASE_URL = "http://localhost:8080/api"`; `types.ts`: `SrtRequest` and `CreateRequestPayload` interfaces
- **SPEC-FE-003** — `SubmissionForm.tsx`: three controlled `useState` fields; trim validation on submit; inline errors per field; `isSubmitting` disables button; `POST` via native `fetch`; `onSuccess()` navigates to list
- **SPEC-FE-004** — `RequestList.tsx`: `useEffect([])` fetch on mount; three render states; table columns Name/Request Title/Description; empty-state "No requests submitted yet."; error-state "Failed to load requests. Please try again."
- **SPEC-STACK** — Frontend: Vite 5.x, React 18.x, TypeScript 5.x, native fetch, vanilla CSS; Backend: Spring Boot 3.x, Java 17+, Spring Data JPA/Hibernate 6.x, H2 2.x, Maven 3.x, Jackson 2.x

### User Stories (US-0.1 through US-6.5)

- **22 stories** across 7 epics, all P0, covering both personas (Marcus Webb — Requester; Dana Park — Viewer/Developer)
- Epic 0 (F0): US-0.1, US-0.2, US-0.3
- Epic 1 (F1): US-1.1, US-1.2, US-1.3
- Epic 2 (F2): US-2.1, US-2.2
- Epic 3 (F3): US-3.1, US-3.2, US-3.3
- Epic 4 (F4): US-4.1, US-4.2
- Epic 5 (F5): US-5.1, US-5.2, US-5.3, US-5.4
- Epic 6 (F6): US-6.1, US-6.2, US-6.3, US-6.4, US-6.5

---

## 3. Traceability Matrix

### 3.1 Primary Traceability: PRD → FRD → TechArch → User Stories

| PRD Feature | FRD Req | TechArch Spec | User Story IDs | Phase |
|---|---|---|---|---|
| F0: Spring Boot Backend Scaffold | F00 | SPEC-BE-001, SPEC-BE-005, SPEC-STACK | US-0.1, US-0.2, US-0.3 | 1 |
| F1: React Frontend Scaffold | F01 | SPEC-FE-001, SPEC-FE-002, SPEC-STACK | US-1.1, US-1.2, US-1.3 | 1 |
| F2: Request Data Model & Persistence | F02 | SPEC-BE-002 | US-2.1, US-2.2 | 1 |
| F3: POST Endpoint — Submit Request | F03 | SPEC-BE-004 | US-3.1, US-3.2, US-3.3 | 2 |
| F4: GET Endpoint — List All Requests | F04 | SPEC-BE-003 | US-4.1, US-4.2 | 1 |
| F5: Request Submission Form | F05 | SPEC-FE-003 | US-5.1, US-5.2, US-5.3, US-5.4 | 2 |
| F6: Request List View | F06 | SPEC-FE-004 | US-6.1, US-6.2, US-6.3, US-6.4, US-6.5 | 1 |

### 3.2 Reverse Traceability: User Story → PRD Feature

| User Story | Title | PRD Feature | FRD Req | TechArch Spec |
|---|---|---|---|---|
| US-0.1 | Start Backend with Zero Configuration | F0 | F00 | SPEC-BE-001, SPEC-STACK |
| US-0.2 | Access H2 Console for Database Inspection | F0 | F00 | SPEC-BE-001 |
| US-0.3 | Backend Accepts CORS Requests from Frontend | F0 | F00 | SPEC-BE-005 |
| US-1.1 | Start Frontend Dev Server with Zero Configuration | F1 | F01 | SPEC-STACK |
| US-1.2 | Navigate Between Submission Form and Request List | F1 | F01 | SPEC-FE-001 |
| US-1.3 | Backend Base URL Is Centrally Configured | F1 | F01 | SPEC-FE-002 |
| US-2.1 | Request Entity Is Persisted to H2 on Startup | F2 | F02 | SPEC-BE-002 |
| US-2.2 | Request Record Has Server-Assigned ID and Timestamp | F2 | F02 | SPEC-BE-002 |
| US-3.1 | Submit a Valid Request via API | F3 | F03 | SPEC-BE-004 |
| US-3.2 | API Rejects Submission with Missing or Blank Fields | F3 | F03 | SPEC-BE-004, SPEC-BE-005 |
| US-3.3 | API Rejects Malformed Request Body | F3 | F03 | SPEC-BE-004 |
| US-4.1 | Retrieve All Submitted Requests via API | F4 | F04 | SPEC-BE-003 |
| US-4.2 | GET Endpoint Returns Empty Array When No Requests Exist | F4 | F04 | SPEC-BE-003 |
| US-5.1 | Submit a Request Through the Web Form | F5 | F05 | SPEC-FE-003 |
| US-5.2 | Form Shows Inline Errors for Blank Required Fields | F5 | F05 | SPEC-FE-003, SPEC-BE-005 |
| US-5.3 | Submit Button Is Disabled During API Call | F5 | F05 | SPEC-FE-003 |
| US-5.4 | Form Preserves Data and Shows Error on API Failure | F5 | F05 | SPEC-FE-003 |
| US-6.1 | View All Submitted Requests in a Table | F6 | F06 | SPEC-FE-004 |
| US-6.2 | Verify Submitted Request Appears in List Immediately | F6 | F06 | SPEC-FE-004, SPEC-BE-003 |
| US-6.3 | List View Shows Empty State When No Requests Exist | F6 | F06 | SPEC-FE-004 |
| US-6.4 | List View Handles Fetch Error Gracefully | F6 | F06 | SPEC-FE-004 |
| US-6.5 | List View Shows Loading State While Fetching | F6 | F06 | SPEC-FE-004 |

### 3.3 Cross-Cutting Traceability: Architecture & Integration

| Cross-Cutting Concern | PRD NFR | FRD Reference | TechArch Spec | User Stories Affected |
|---|---|---|---|---|
| Zero external dependencies | Zero external dependencies NFR | Y3 Integration Points | SPEC-ARCH, SPEC-STACK | US-0.1, US-1.1 |
| CORS configuration | CORS NFR | F00 CORS sub-feature, Y3 | SPEC-BE-005 | US-0.3, US-3.1, US-4.1 |
| H2 in-memory storage | Self-contained storage NFR | Y0 Database Schema | SPEC-BE-002 | US-2.1, US-2.2 |
| Required-field validation only | Validation NFR | F03 validation, F05 validation | SPEC-BE-004, SPEC-FE-003, SPEC-BE-005 | US-3.2, US-5.2 |
| Reproducibility (two-command startup) | Reproducibility NFR | F00, F01 | SPEC-ARCH, SPEC-STACK | US-0.1, US-1.1 |
| Jackson ISO 8601 date serialization | Backend API NFR | Y1 API Catalog, F03/F04 | SPEC-BE-003, SPEC-BE-004 | US-2.2, US-3.1, US-4.1 |
| Startup time under 30 seconds | Startup time NFR | F00 validation rules | SPEC-STACK | US-0.1 |

---

## 4. Requirements Detail

### F0: Spring Boot Backend Scaffold

**PRD Definition:** Java Spring Boot application initialized with Web, JPA, and H2 dependencies; CORS configuration; H2 in-memory database; fully configured `application.properties`; runnable with `./mvnw spring-boot:run`.

**FRD Requirements (F00):**
- Spring Boot project structure initialized with Maven wrapper
- Required dependencies declared: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `com.h2database:h2`
- `application.properties` configured: `server.port=8080`, `jdbc:h2:mem:srtdb`, `ddl-auto=create-drop`, H2 console enabled
- `CorsConfig.java` WebMvcConfigurer allows `http://localhost:5173`, methods `GET POST OPTIONS`, all headers `*`
- Application starts successfully without errors; H2 Console accessible at `/h2-console`

**TechArch Specifications:**
- SPEC-BE-001: Backend component structure — `SrtApplication.java`, `CorsConfig.java`, `RequestController.java`, `RequestDto.java`, `Request.java`, `RequestRepository.java`
- SPEC-BE-005: CORS policy — origin `http://localhost:5173`, methods `GET POST OPTIONS`, headers `*`, `allowCredentials=false`
- SPEC-STACK: Runtime — JDK 17+, Spring Boot 3.x, Maven 3.x, H2 2.x, Jackson 2.x

**Linked User Stories:** US-0.1, US-0.2, US-0.3

---

### F1: React Frontend Scaffold

**PRD Definition:** React application scaffolded with Vite + TypeScript; minimal CSS baseline; HTTP client constant; two-screen navigation shell; runnable with `npm run dev`.

**FRD Requirements (F01):**
- Vite + React + TypeScript project initialized with `npm create vite@latest`
- Minimal CSS: `font-family: sans-serif; max-width: 800px; margin: 40px auto;`; no UI framework
- `constants.ts` exports `API_BASE_URL = "http://localhost:8080/api"` as single source of truth
- `App.tsx` renders navigation controls ("Submit Request", "View Requests") and conditionally renders `<SubmissionForm />` or `<RequestList />`
- `npm run dev` starts on `localhost:5173`; `npm run build` succeeds without TypeScript errors

**TechArch Specifications:**
- SPEC-FE-001: `App.tsx` shell — `activeView` state `'form' | 'list'`; navigation buttons; conditional rendering
- SPEC-FE-002: `constants.ts` exports `API_BASE_URL`; `types.ts` exports `SrtRequest` and `CreateRequestPayload` interfaces
- SPEC-STACK: Frontend — Vite 5.x, React 18.x, TypeScript 5.x, native fetch, vanilla CSS, Node.js 18+

**Linked User Stories:** US-1.1, US-1.2, US-1.3

---

### F2: Request Data Model & Persistence

**PRD Definition:** `Request` entity with all required fields persisted to H2 via Spring Data JPA; table auto-created on startup.

**FRD Requirements (F02):**
- `Request.java` entity: `id` (Long, `@GeneratedValue(IDENTITY)`), `name` (String, `@Column(nullable=false)`), `title` (String, `NOT NULL`), `description` (TEXT/CLOB, `NOT NULL`), `createdAt` (LocalDateTime, `@PrePersist`, `updatable=false`)
- `RequestRepository.java` extends `JpaRepository<Request, Long>`; no custom queries needed for MVP
- H2 `requests` table auto-created via Hibernate `ddl-auto=create-drop`; dropped on shutdown
- Client must never provide `id` or `createdAt` — server assigns both

**TechArch Specifications:**
- SPEC-BE-002: Full entity definition with DDL — `CREATE TABLE requests (id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, name VARCHAR(255) NOT NULL, title VARCHAR(255) NOT NULL, description CLOB NOT NULL, created_at TIMESTAMP NOT NULL)`

**Linked User Stories:** US-2.1, US-2.2

---

### F3: POST Endpoint — Submit Request

**PRD Definition:** `POST /api/requests` accepts JSON payload, validates required fields, persists record, returns `201 Created` with saved entity or `400 Bad Request` on invalid input.

**FRD Requirements (F03):**
- Endpoint: `POST /api/requests`, Content-Type: `application/json`
- `RequestDto` fields: `name`, `title`, `description` (no `id` or `createdAt`)
- Validation: each field checked for null and `isBlank()`; all three must pass; whitespace-only treated as blank
- On valid input: `repository.save()` → JPA `@PrePersist` assigns `createdAt` → H2 assigns `id` → `ResponseEntity` 201 with saved entity
- On any blank field: `400 Bad Request` with `{"error":"Validation failed","message":"All fields (name, title, description) are required."}`
- On malformed JSON: `400 Bad Request` with `{"error":"Bad request","message":"Invalid request body."}`
- On unexpected error: `500` with `{"error":"Internal error","message":"An unexpected error occurred."}`
- No deduplication; identical payloads create separate records

**TechArch Specifications:**
- SPEC-BE-004: `@PostMapping`, `@RequestBody RequestDto`, manual null/blank validation in controller, `ResponseEntity.status(CREATED).body(saved)`

**Linked User Stories:** US-3.1, US-3.2, US-3.3

---

### F4: GET Endpoint — List All Requests

**PRD Definition:** `GET /api/requests` returns all stored requests as a JSON array; `200 OK` always (including empty array); no filtering, sorting, or pagination.

**FRD Requirements (F04):**
- Endpoint: `GET /api/requests`, no query parameters, no request body
- Calls `repository.findAll()` → `SELECT * FROM requests` in natural insertion order (ascending `id`)
- Always returns `200 OK`; body is always a JSON array (never `null`, never `404`)
- Empty database returns `[]`; never throws on zero rows
- On unexpected error: `500`

**TechArch Specifications:**
- SPEC-BE-003: `@GetMapping`, returns `ResponseEntity<List<Request>>`, `ResponseEntity.ok(requests)`

**Linked User Stories:** US-4.1, US-4.2

---

### F5: Request Submission Form

**PRD Definition:** Vertical frontend form with three required fields and Submit button; client-side validation; inline errors; loading state; navigates to list on success; preserves data on failure.

**FRD Requirements (F05):**
- `SubmissionForm.tsx` renders: Name (`<input type="text">`), Request Title (`<input type="text">`), Description (`<textarea>`), all with placeholder text
- Three `useState` fields (controlled components); Submit button at bottom
- On submit: `name.trim()`, `title.trim()`, `description.trim()` checked — blank fields show per-field inline errors ("Name is required.", "Request title is required.", "Description is required."); no API call made
- Per-field errors clear as soon as that field has a non-blank value (clears on input, not on re-submit)
- If all valid: `isSubmitting=true` disables Submit button; `POST` via native `fetch` to `API_BASE_URL/requests`
- On `201 Created`: call `onSuccess()` callback → `App.tsx` switches `activeView` to `'list'`
- On 4xx/5xx/network error: form-level error "Submission failed. Please try again."; fields preserved; Submit re-enabled

**TechArch Specifications:**
- SPEC-FE-003: `SubmissionForm.tsx` detailed implementation — controlled state, trim validation, inline errors, `isSubmitting`, `onSuccess()` callback, `fetch` POST pattern

**Linked User Stories:** US-5.1, US-5.2, US-5.3, US-5.4

---

### F6: Request List View

**PRD Definition:** Full-width table displaying all submitted requests; fetches on component mount; empty-state message; error-state message; no pagination.

**FRD Requirements (F06):**
- `RequestList.tsx` calls `GET API_BASE_URL/requests` in `useEffect` with `[]` dependency (once on mount)
- Three render states: `loading=true` → optional "Loading…"; `error=true` → "Failed to load requests. Please try again."; data → table or empty-state
- Table: `<thead>` with columns "Name", "Request Title", "Description"; one `<tr>` per record with `name`, `title`, `description`
- `id` and `createdAt` are NOT rendered in the table
- Empty array → "No requests submitted yet." (no empty table body)
- All records rendered; no client-side filtering or row limiting
- `API_BASE_URL` constant used — no hardcoded URL in component

**TechArch Specifications:**
- SPEC-FE-004: `RequestList.tsx` detailed implementation — `useEffect` mount fetch, three render states, table column structure, empty-state and error-state messages

**Linked User Stories:** US-6.1, US-6.2, US-6.3, US-6.4, US-6.5

---

## 5. Test Case Coverage Matrix

### 5.1 Test Cases by Feature

| Test ID | Test Case Description | Type | User Story | PRD Feature | Expected Result |
|---|---|---|---|---|---|
| TEST-0.1.1 | Run `./mvnw spring-boot:run` on fresh clone — verify starts without errors | Integration | US-0.1 | F0 | Application starts; no errors in log |
| TEST-0.1.2 | Verify application starts within 30 seconds on JDK 17+ | Performance | US-0.1 | F0 | Startup completes in ≤ 30s |
| TEST-0.1.3 | Verify backend binds to port 8080 | Integration | US-0.1 | F0 | Port 8080 is listening |
| TEST-0.2.1 | Access H2 Console at `http://localhost:8080/h2-console` | Integration | US-0.2 | F0 | Console loads; login succeeds with `jdbc:h2:mem:srtdb`, user `sa`, empty password |
| TEST-0.2.2 | Verify `REQUESTS` table schema in H2 Console | Integration | US-0.2 | F0 | Columns: `id`, `name`, `title`, `description`, `created_at` present with correct types |
| TEST-0.3.1 | Send `GET /api/requests` with `Origin: http://localhost:5173` header — verify CORS headers in response | Integration | US-0.3 | F0 | `Access-Control-Allow-Origin: http://localhost:5173` present in response |
| TEST-0.3.2 | Send `OPTIONS /api/requests` preflight — verify 200 response with CORS headers | Integration | US-0.3 | F0 | Preflight returns 200; CORS headers include GET, POST, OPTIONS |
| TEST-1.1.1 | Run `npm install && npm run dev` on fresh clone — verify Vite starts without errors | Integration | US-1.1 | F1 | Dev server accessible at `http://localhost:5173` |
| TEST-1.1.2 | Run `npm run build` — verify no TypeScript or compilation errors | Unit | US-1.1 | F1 | Build completes with exit code 0 |
| TEST-1.1.3 | Verify no UI framework dependencies in `package.json` | Static | US-1.1 | F1 | No Tailwind, MUI, Bootstrap in dependencies |
| TEST-1.2.1 | Click "Submit Request" navigation — verify `SubmissionForm` renders | UI | US-1.2 | F1 | Form screen visible; no page reload |
| TEST-1.2.2 | Click "View Requests" navigation — verify `RequestList` renders | UI | US-1.2 | F1 | List screen visible; no page reload |
| TEST-1.3.1 | Inspect source — verify `API_BASE_URL` is only defined in `constants.ts` or `api.ts` | Static | US-1.3 | F1 | No `http://localhost:8080` hardcoded in component files |
| TEST-2.1.1 | Start application and verify `REQUESTS` table exists in H2 | Integration | US-2.1 | F2 | H2 Console shows `REQUESTS` table with correct schema |
| TEST-2.1.2 | Stop and restart application — verify table is empty after restart | Integration | US-2.1 | F2 | `GET /api/requests` returns `[]` after restart |
| TEST-2.2.1 | POST a valid request — verify response includes server-assigned `id` and `createdAt` | Integration | US-2.2 | F2 | Response body has numeric `id` and ISO 8601 `createdAt` string |
| TEST-2.2.2 | POST with `id` and `createdAt` in body — verify they are silently ignored | Integration | US-2.2 | F2 | Server-assigned values override client-provided values |
| TEST-3.1.1 | POST `{"name":"Alice","title":"Fix bug","description":"Details"}` — verify 201 response | Integration | US-3.1 | F3 | 201 Created; response body contains all fields including `id` and `createdAt` |
| TEST-3.1.2 | POST valid request; then GET — verify new record appears in list | E2E | US-3.1 | F3 | `GET /api/requests` returns array containing newly submitted record |
| TEST-3.1.3 | POST identical payload twice — verify two separate records created | Integration | US-3.1 | F3 | Two records with different `id` values returned by GET |
| TEST-3.2.1 | POST with missing `name` field — verify 400 response | Integration | US-3.2 | F3 | 400 Bad Request; error body `{"error":"Validation failed",...}` |
| TEST-3.2.2 | POST with blank `name` (`""`) — verify 400 response | Integration | US-3.2 | F3 | 400 Bad Request; same error body |
| TEST-3.2.3 | POST with whitespace-only `name` (`"   "`) — verify 400 response | Integration | US-3.2 | F3 | 400 Bad Request; whitespace treated as blank |
| TEST-3.2.4 | POST with missing `title` — verify 400 response | Integration | US-3.2 | F3 | 400 Bad Request |
| TEST-3.2.5 | POST with missing `description` — verify 400 response | Integration | US-3.2 | F3 | 400 Bad Request |
| TEST-3.3.1 | POST non-JSON body — verify 400 response with "Bad request" error | Integration | US-3.3 | F3 | 400 Bad Request; `{"error":"Bad request","message":"Invalid request body."}` |
| TEST-3.3.2 | POST non-JSON body — verify no stack trace in response | Integration | US-3.3 | F3 | Response body contains no stack trace |
| TEST-4.1.1 | GET `/api/requests` with existing records — verify 200 and correct JSON array | Integration | US-4.1 | F4 | 200 OK; JSON array with all fields per record |
| TEST-4.1.2 | Verify response is always a JSON array (not null or object) | Integration | US-4.1 | F4 | Body is `[...]` type |
| TEST-4.1.3 | Verify records returned in ascending `id` order | Integration | US-4.1 | F4 | IDs are ascending in response array |
| TEST-4.2.1 | GET `/api/requests` on fresh backend (no records) — verify 200 with `[]` | Integration | US-4.2 | F4 | 200 OK; body is `[]` |
| TEST-4.2.2 | Verify empty-state response status is 200, not 404 | Integration | US-4.2 | F4 | HTTP status code is 200 |
| TEST-5.1.1 | Fill all three form fields and click Submit — verify POST is sent to backend | E2E | US-5.1 | F5 | Network request to `POST /api/requests` with correct payload |
| TEST-5.1.2 | Submit valid form — verify user navigated to Request List view | E2E | US-5.1 | F5 | `RequestList` component visible after submission |
| TEST-5.2.1 | Click Submit with all fields blank — verify three inline errors shown simultaneously | UI | US-5.2 | F5 | "Name is required.", "Request title is required.", "Description is required." all visible |
| TEST-5.2.2 | Click Submit with blank Name — verify no API call made | UI | US-5.2 | F5 | No network request to backend |
| TEST-5.2.3 | Submit with whitespace-only Name — verify inline error shown | UI | US-5.2 | F5 | "Name is required." displayed |
| TEST-5.2.4 | Display inline error then type in field — verify error clears on input | UI | US-5.2 | F5 | Error message disappears when field becomes non-blank |
| TEST-5.3.1 | Submit valid form — verify Submit button is disabled while API call in flight | UI | US-5.3 | F5 | Button has `disabled` attribute during pending request |
| TEST-5.3.2 | Click Submit twice in quick succession — verify only one API call made | UI | US-5.3 | F5 | Single POST request in network log |
| TEST-5.3.3 | After API completes (success or failure) — verify Submit button re-enabled | UI | US-5.3 | F5 | Button is enabled after response received |
| TEST-5.4.1 | Simulate API 500 error on submit — verify form-level error message shown | UI | US-5.4 | F5 | "Submission failed. Please try again." displayed at form level |
| TEST-5.4.2 | Simulate network failure on submit — verify field values preserved | UI | US-5.4 | F5 | Name, title, description inputs retain their values |
| TEST-6.1.1 | Navigate to Request List — verify GET call fired on component mount | E2E | US-6.1 | F6 | Network request to `GET /api/requests` on load |
| TEST-6.1.2 | Verify table has columns "Name", "Request Title", "Description" | UI | US-6.1 | F6 | Three column headers visible |
| TEST-6.1.3 | Verify `id` and `createdAt` are NOT shown in table | UI | US-6.1 | F6 | No `id` or `createdAt` column in rendered table |
| TEST-6.2.1 | Submit form then navigate to list — verify new record visible without page refresh | E2E | US-6.2 | F6 | Submitted entry appears in table immediately |
| TEST-6.3.1 | Open list on fresh backend — verify "No requests submitted yet." message shown | UI | US-6.3 | F6 | Empty-state message visible; no table rendered |
| TEST-6.3.2 | Verify no empty `<table>` body rendered in empty state | UI | US-6.3 | F6 | No `<tbody>` with zero rows; only message shown |
| TEST-6.4.1 | Simulate backend unreachable — verify error message shown | UI | US-6.4 | F6 | "Failed to load requests. Please try again." displayed |
| TEST-6.4.2 | Simulate backend 500 — verify no table rendered, error message shown | UI | US-6.4 | F6 | Error message visible; no table rendered |
| TEST-6.5.1 | Observe list view on slow network — verify loading indicator appears during fetch | UI | US-6.5 | F6 | "Loading…" text or indicator visible while fetch pending |
| TEST-6.5.2 | Verify loading state clears after data received | UI | US-6.5 | F6 | "Loading…" disappears; table or message rendered |

### 5.2 Coverage Summary by Feature

| PRD Feature | User Stories | Test Cases | Test Types | Coverage |
|---|---|---|---|---|
| F0: Spring Boot Backend Scaffold | US-0.1, US-0.2, US-0.3 | TEST-0.1.1 – TEST-0.3.2 (7 tests) | Integration, Performance | 100% |
| F1: React Frontend Scaffold | US-1.1, US-1.2, US-1.3 | TEST-1.1.1 – TEST-1.3.1 (5 tests) | Integration, UI, Static | 100% |
| F2: Request Data Model & Persistence | US-2.1, US-2.2 | TEST-2.1.1 – TEST-2.2.2 (4 tests) | Integration | 100% |
| F3: POST Endpoint — Submit Request | US-3.1, US-3.2, US-3.3 | TEST-3.1.1 – TEST-3.3.2 (9 tests) | Integration, E2E | 100% |
| F4: GET Endpoint — List All Requests | US-4.1, US-4.2 | TEST-4.1.1 – TEST-4.2.2 (4 tests) | Integration | 100% |
| F5: Request Submission Form | US-5.1, US-5.2, US-5.3, US-5.4 | TEST-5.1.1 – TEST-5.4.2 (10 tests) | UI, E2E | 100% |
| F6: Request List View | US-6.1, US-6.2, US-6.3, US-6.4, US-6.5 | TEST-6.1.1 – TEST-6.5.2 (10 tests) | UI, E2E | 100% |
| **Total** | **22 stories** | **49 test cases** | Integration, UI, E2E, Performance, Static | **100%** |

### 5.3 Test Type Definitions

| Test Type | Description | Example |
|---|---|---|
| Unit | Tests a single class or function in isolation | Validating DTO null/blank check logic |
| Integration | Tests two or more components together (e.g., controller + repository + H2) | `POST /api/requests` round-trip to H2 |
| UI | Tests frontend component rendering and interaction (browser or test framework) | Inline error messages on blank submit |
| E2E | Tests the full stack from browser action to database and back | Form submit → list view shows new record |
| Performance | Tests timing or resource constraints | Backend startup ≤ 30 seconds |
| Static | Tests source code without execution | No hardcoded URLs in component files |

---

## 6. Change Management

### 6.1 Baseline

This RTM is baselined against the following document versions:

| Document | Version | Date | Status |
|---|---|---|---|
| PRD-SRT | 1.0 | 2026-05-19 | Active |
| FRD-SRT | 1.0 | 2026-05-19 | Active |
| TechArch-SRT | 1.0 | 2026-05-19 | Active |
| UserStories-SRT | 1.0 | 2026-05-19 | Active |
| RTM-SRT | 1.0 | 2026-05-20 | Active |

### 6.2 Change Log

| Change ID | Date | Author | Description | Documents Affected | Impact |
|---|---|---|---|---|---|
| CHG-001 | 2026-05-20 | Pivota Spec RTM Generator | Initial RTM created — baseline established | RTM-SRT | None (initial baseline) |

### 6.3 Change Control Process

All changes to requirements after RTM baseline must follow this process:

- **Step 1:** Identify the PRD feature or NFR being changed
- **Step 2:** Assess downstream impact on FRD requirements, TechArch specs, and user stories
- **Step 3:** Update all impacted documents and increment their version numbers
- **Step 4:** Update the traceability matrix rows and test cases affected
- **Step 5:** Record the change in the Change Log table (Section 6.2)
- **Step 6:** Re-obtain approval signatures (Section 7)

Given SRT's explicitly defined out-of-scope items (authentication, pagination, external integrations, edit/delete operations, persistent storage, cloud deployment), any request touching these items must be treated as a scope change requiring PRD-level approval before downstream documents are updated.

---

## 7. Traceability Validation Checklist

The following checklist confirms completeness of this RTM:

| Check | Status | Notes |
|---|---|---|
| All 7 PRD features (F0–F6) have at least one FRD requirement | ✅ Pass | F0→F00, F1→F01, F2→F02, F3→F03, F4→F04, F5→F05, F6→F06 |
| All 7 FRD requirements map back to a PRD feature | ✅ Pass | Bidirectional 1:1 mapping confirmed |
| All 7 PRD features have at least one TechArch spec | ✅ Pass | SPEC-BE-001 through SPEC-FE-004 and SPEC-ARCH, SPEC-STACK |
| All 22 user stories map to a PRD feature and FRD requirement | ✅ Pass | US-0.1–US-6.5 all mapped in Section 3.2 |
| All 7 PRD features have at least one test case | ✅ Pass | TEST-0.x through TEST-6.x cover all features |
| All 22 user stories have at least one test case | ✅ Pass | Each US linked to 1–4 test cases in Section 5.1 |
| No PRD feature has zero user stories | ✅ Pass | Minimum 2 stories per feature (F2); maximum 5 (F6) |
| All TechArch specs trace to at least one FRD requirement | ✅ Pass | SPEC-* entries each link to F0x FRD sections |
| Non-functional requirements traced | ✅ Pass | NFRs from PRD §7 covered in Section 3.3 |
| Cross-cutting concerns documented | ✅ Pass | CORS, validation, H2 lifecycle, reproducibility in Section 3.3 |

---

## 8. Approval

### 8.1 Document Sign-Off

This RTM must be reviewed and approved by the following roles before implementation begins. Approval confirms that:
- All PRD features are correctly decomposed into FRD requirements
- All FRD requirements are correctly reflected in TechArch specifications
- All user stories accurately represent the stated requirements
- Test case coverage is sufficient for MVP acceptance

| Role | Name | Signature | Date | Status |
|---|---|---|---|---|
| Product Owner | — | | | Pending |
| Tech Lead / Architect | — | | | Pending |
| QA Lead | — | | | Pending |
| Project Sponsor | — | | | Pending |

### 8.2 Approval Notes

_Record any conditions, exceptions, or comments at the time of approval below._

| Note ID | Date | Author | Note |
|---|---|---|---|
| — | — | — | No notes at baseline. |

---

*Generated by Pivota Spec RTM Generator | Project: SRT | 2026-05-20*
