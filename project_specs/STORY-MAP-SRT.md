# Story Map: Simple Request Tracker (SRT)

**Document ID:** STORY-MAP-SRT  
**Version:** 1.0  
**Date:** 2026-05-19  
**Status:** Active  
**Product Name:** Simple Request Tracker (SRT)  
**Related Artifacts:** PRD-SRT v1.0 · PERSONAS-SRT v1.0 · JTBD-SRT v1.0 · JOURNEYS-SRT v1.0 · UserStories-SRT v1.0

| Field | Value |
|-------|-------|
| Personas | PER-01 Marcus Webb (Business Requester), PER-02 Dana Park (Internal Stakeholder/Dev) |
| Journeys | JRN-01.1, JRN-01.2, JRN-01.3, JRN-02.1, JRN-02.2, JRN-02.3 |
| Stories Mapped | 22 (US-0.1 – US-6.5) — all P0 |
| Releases Planned | R1 (Phase 1 — Scaffold + List), R2 (Phase 2 — Form + Submit) |
| Epics | 7 (Epic 0–6, Feature F0–F6) |

---

## Overview

This Story Map organizes all 22 user stories onto a two-dimensional grid:

- **X-axis (columns):** Journey stages drawn from JOURNEYS-SRT. Each column represents a moment in a persona's workflow where the product must deliver value.
- **Y-axis (rows):** Activities and stories within each stage, ordered by epic and story ID.
- **NaC column:** Natural Acceptance Criteria — testable statements derived from JTBD outcomes applied to the specific journey stage context. Every NaC traces back to a JTBD outcome; none are invented.
- **Release column:** R1 or R2, aligned to PRD delivery phases.

### NaC Concept

Natural Acceptance Criteria (NaC) bridge JTBD outcomes to testable story criteria:

1. **JTBD outcome** — what matters to the persona ("Minimize time to start work")
2. **Journey stage context** — when/where the outcome must be satisfied ("Start backend stage")
3. **Testable NaC** — the verifiable criterion that proves the outcome is met ("Backend starts in under 30 seconds with a single command")

NaC complement, but do not replace, the formal acceptance criteria in UserStories-SRT. They answer: *does this story, in the context of the journey, deliver the JTBD outcome?*

### Story Map ID Convention

Map entries use: `SM-{Epic}.{NN}` (e.g., SM-0.1 maps to Epic 0 / US-0.1)

---
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
## NaC Derivation Table

Full traceability chain: **JTBD Outcome → Journey Stage → NaC Statement → Story**

Each NaC is derived from the intersection of a JTBD outcome and a specific journey stage. The NaC text is the testable criterion that proves the JTBD outcome is satisfied in that context.

| NaC-ID | JTBD-ID | JTBD Outcome (abbreviated) | Journey Stage | NaC Statement | Story |
|--------|---------|---------------------------|--------------|---------------|-------|
| NaC-01 | JTBD-01.1 | Submit valid form in < 60s | JRN-01.1: Arrive | Navigation controls visible on page load; user reaches form in one click | US-1.2 |
| NaC-02 | JTBD-01.1 | Submit valid form in < 60s | JRN-01.1: Orient | Three labeled fields in single vertical stack before user types; required intent clear at a glance | US-5.1 |
| NaC-03 | JTBD-01.1 | Submit valid form in < 60s | JRN-01.1: Fill | Submit button disabled immediately on valid submit click; double-submission physically prevented | US-5.3 |
| NaC-04 | JTBD-01.1 | Submit valid form in < 60s | JRN-01.2: Re-submit | Valid second submit after correcting errors succeeds; POST /api/requests called exactly once | US-3.1 |
| NaC-05 | JTBD-01.2 | Unambiguous post-submit state within 3s | JRN-01.1: Submit | POST /api/requests called; form clears and/or user redirected within 3 seconds of 201 response | US-5.1 |
| NaC-06 | JTBD-01.2 | Unambiguous post-submit state within 3s | JRN-01.1: Confirm | Submitted request visible in list table within same session; no manual reload required | US-6.2 |
| NaC-07 | JTBD-01.2 | Unambiguous post-submit state within 3s | JRN-01.3: Navigate | Navigation from form to list is visible and immediate; no URL typing required | US-1.2 |
| NaC-08 | JTBD-01.2 | Unambiguous post-submit state within 3s | JRN-01.3: Load list | Visible loading indicator appears while GET is in flight; clears when data arrives | US-6.5 |
| NaC-09 | JTBD-01.2 | Unambiguous post-submit state within 3s | JRN-01.2: Confirm | On API failure, entered data preserved; clear error message shown; user can retry | US-5.4 |
| NaC-10 | JTBD-01.3 | Inline errors before API call (< 200ms) | JRN-01.2: Arrive & skip reading | Blank Submit fires three field-level error messages within 200ms; zero network requests made | US-5.2 |
| NaC-11 | JTBD-01.3 | Inline errors before API call (< 200ms) | JRN-01.2: See errors | Each error message identifies the specific blank field by name; shown directly below the input | US-5.2 |
| NaC-12 | JTBD-01.3 | Inline errors before API call (< 200ms) | JRN-01.2: Correct | Error under each field clears as soon as that field has a non-blank value | US-5.2 |
| NaC-13 | JTBD-02.1 | Full loop from fresh clone in < 5 min | JRN-02.1: Clone | Repo clones cleanly; Maven wrapper is committed; .gitignore excludes target/ and node_modules/ | US-0.1 |
| NaC-14 | JTBD-02.1 | Full loop from fresh clone in < 5 min | JRN-02.1: Start backend | `./mvnw spring-boot:run` starts in under 30s on JDK 17+; no external services required | US-0.1 |
| NaC-15 | JTBD-02.1 | Full loop from fresh clone in < 5 min | JRN-02.1: Start frontend | `npm install && npm run dev` starts Vite on port 5173 with no additional config | US-1.1 |
| NaC-16 | JTBD-02.1 | Full loop from fresh clone in < 5 min | JRN-02.1: Submit test request | POST /api/requests returns 201; form clears; no CORS error during test submit | US-3.1 |
| NaC-17 | JTBD-02.1 | Full loop from fresh clone in < 5 min | JRN-02.1: Verify list | GET /api/requests returns submitted entry; list updates without manual reload | US-6.1 |
| NaC-18 | JTBD-02.1 | Full loop from fresh clone in < 5 min | JRN-02.1: Confirm zero config | requests table auto-created from JPA entity on startup; no SQL migration file present | US-2.1 |
| NaC-19 | JTBD-02.2 | Zero CORS errors; correct HTTP codes | JRN-02.2: Inspect GET on list load | Access-Control-Allow-Origin: http://localhost:5173 in GET response; 200 with JSON array or [] | US-0.3, US-4.2 |
| NaC-20 | JTBD-02.2 | Zero CORS errors; correct HTTP codes | JRN-02.2: Inspect POST on submit | POST returns 201 with full entity body; OPTIONS preflight passes; no CORS error in console | US-0.3, US-3.1 |
| NaC-21 | JTBD-02.2 | Zero CORS errors; correct HTTP codes | JRN-02.2: Inspect blank-form validation | Zero network requests logged on blank-form submit; client-side guard fires before any fetch | US-5.2, US-3.2 |
| NaC-22 | JTBD-02.2 | Zero CORS errors; correct HTTP codes | JRN-02.2: Summarize | Zero console errors or warnings across full session; all status codes correct | US-6.4, US-3.3 |
| NaC-23 | JTBD-02.3 | Architecture readable at a glance | JRN-02.3: Navigate source structure | Standard Maven layout; dedicated frontend/ directory; no unusual nesting | US-0.1, US-1.1 |
| NaC-24 | JTBD-02.3 | Architecture readable at a glance | JRN-02.3: Find CORS config | Single @Configuration class for CORS; no per-controller annotations; locatable in < 2 min | US-0.3 |
| NaC-25 | JTBD-02.3 | Architecture readable at a glance | JRN-02.3: Find JPA entity | Plain JPA entity with 5 fields; @PrePersist for created_at; no extra annotation processors | US-2.2 |
| NaC-26 | JTBD-02.3 | Architecture readable at a glance | JRN-02.3: Find frontend fetch calls | API_BASE_URL in single constants file; plain fetch + async/await in form and list components | US-1.3 |

---
## Release Planning

---

### R1: "Scaffold + Read" — Phase 1 Foundation

**Theme:** Stand up the complete technical stack, auto-provision the data model, and deliver a working read path (GET + list view). A developer can clone the repo, start both services, and see a functional (if empty) application with verified CORS and API connectivity.

**PRD Phase:** Phase 1

**Stories in R1:**

| Story ID | Title | Persona | Epic | NaC Satisfied |
|----------|-------|---------|------|---------------|
| US-0.1 | Start Backend with Zero Configuration | PER-02 Dana | Epic 0 (F0) | NaC-13, NaC-14, NaC-23 |
| US-0.2 | Access H2 Console for Database Inspection | PER-02 Dana | Epic 0 (F0) | NaC-13 (schema visibility) |
| US-0.3 | Backend Accepts CORS Requests from Frontend | PER-02 Dana | Epic 0 (F0) | NaC-19, NaC-20, NaC-24 |
| US-1.1 | Start Frontend Dev Server with Zero Configuration | PER-02 Dana | Epic 1 (F1) | NaC-15, NaC-23 |
| US-1.2 | Navigate Between Submission Form and Request List | PER-01 Marcus | Epic 1 (F1) | NaC-01, NaC-07 |
| US-1.3 | Backend Base URL Is Centrally Configured | PER-02 Dana | Epic 1 (F1) | NaC-26 |
| US-2.1 | Request Entity Is Persisted to H2 on Startup | PER-02 Dana | Epic 2 (F2) | NaC-18 |
| US-2.2 | Request Record Has Server-Assigned ID and Timestamp | PER-02 Dana | Epic 2 (F2) | NaC-25 |
| US-4.1 | Retrieve All Submitted Requests via API | PER-02 Dana | Epic 4 (F4) | NaC-17, NaC-19 |
| US-4.2 | GET Endpoint Returns Empty Array When No Requests Exist | PER-02 Dana | Epic 4 (F4) | NaC-19 |
| US-6.1 | View All Submitted Requests in a Table | PER-02 Dana | Epic 6 (F6) | NaC-17 |
| US-6.3 | List View Shows Empty State When No Requests Exist | PER-02 Dana | Epic 6 (F6) | NaC-18 (zero-config confirm) |
| US-6.4 | List View Handles Fetch Error Gracefully | PER-02 Dana | Epic 6 (F6) | NaC-22 |
| US-6.5 | List View Shows Loading State While Fetching | PER-01 Marcus | Epic 6 (F6) | NaC-08 |

**Story count:** 14  
**Personas served:** PER-02 Dana (primary, 12 stories), PER-01 Marcus (secondary, 2 stories — navigation + loading)

**JTBD addressed in R1:**

| JTBD-ID | Addressed? | Coverage Note |
|---------|-----------|---------------|
| JTBD-01.1 | Partial | Navigation (US-1.2) enables journey arrival; form not yet present |
| JTBD-01.2 | Partial | Loading state (US-6.5) and navigation (US-1.2) support list verification; form submit not yet present |
| JTBD-01.3 | None | Form + validation ships in R2 |
| JTBD-02.1 | Partial | Clone → start → GET loop verified; POST + form submit deferred to R2 |
| JTBD-02.2 | Partial | CORS verified on GET; POST CORS verified in R2 |
| JTBD-02.3 | Full | All scaffold readability patterns (CORS class, JPA entity, API URL constant) ship in R1 |

**Journeys enabled by R1:**

- **JRN-02.1 stages 1–3, 5–6:** Dana can clone, start both services, navigate to list, and confirm zero-config setup — minus the submit-test-request stage (Stage 4, R2)
- **JRN-02.2 stages 1–2:** Inspect GET on list load; CORS verified for GET
- **JRN-02.3 (full):** All source-reading stages complete
- **JRN-01.3 stages 1–2, 4:** Navigate to list, see loading state, done — entry won't exist until R2 adds form

**R1 exit condition:** Both services start with two commands; `GET /api/requests` returns 200 with `[]`; list view shows "No requests submitted yet."; CORS verified in browser DevTools; REQUESTS table visible in H2 console.

---
### R2: "Write Path + Complete Loop" — Phase 2 Completion

**Theme:** Add the POST endpoint and submission form with full client-side validation, completing the create-and-display loop. Both personas can now use the full application. The end-to-end journey — submit a request, see it in the list — is verified.

**PRD Phase:** Phase 2

**Stories in R2:**

| Story ID | Title | Persona | Epic | NaC Satisfied |
|----------|-------|---------|------|---------------|
| US-3.1 | Submit a Valid Request via API | PER-01 Marcus | Epic 3 (F3) | NaC-04, NaC-16, NaC-20 |
| US-3.2 | API Rejects Submission with Missing or Blank Fields | PER-02 Dana | Epic 3 (F3) | NaC-21 |
| US-3.3 | API Rejects Malformed Request Body | PER-02 Dana | Epic 3 (F3) | NaC-22 |
| US-5.1 | Submit a Request Through the Web Form | PER-01 Marcus | Epic 5 (F5) | NaC-02, NaC-05 |
| US-5.2 | Form Shows Inline Errors for Blank Required Fields | PER-01 Marcus | Epic 5 (F5) | NaC-10, NaC-11, NaC-12, NaC-21 |
| US-5.3 | Submit Button Is Disabled During API Call | PER-01 Marcus | Epic 5 (F5) | NaC-03 |
| US-5.4 | Form Preserves Data and Shows Error on API Failure | PER-01 Marcus | Epic 5 (F5) | NaC-09 |
| US-6.2 | Verify Submitted Request Appears in List Immediately | PER-01 Marcus | Epic 6 (F6) | NaC-06 |

**Story count:** 8  
**Personas served:** PER-01 Marcus (primary, 6 stories), PER-02 Dana (secondary, 2 stories — API validation)

**JTBD addressed in R2 (completing R1 partial coverage):**

| JTBD-ID | R1 Status | R2 Completion |
|---------|----------|---------------|
| JTBD-01.1 | Partial | **Full** — form fields, tab order, submit flow all ship |
| JTBD-01.2 | Partial | **Full** — form clear on 201, redirect to list, new entry visible |
| JTBD-01.3 | None | **Full** — inline errors before API call, 200ms, zero network requests |
| JTBD-02.1 | Partial | **Full** — POST loop verified; full create-and-display confirmed |
| JTBD-02.2 | Partial | **Full** — POST 201, OPTIONS preflight, blank-submit zero-call all verified |
| JTBD-02.3 | Full | Maintained — no regressions |

**Journeys completed by R2:**

- **JRN-01.1 (full):** Arrive → Orient → Fill → Submit → Confirm — all 5 stages operational
- **JRN-01.2 (full):** Blank submit → errors → correct → re-submit → confirm
- **JRN-01.3 (full):** Navigate → load list → identify own entry → done
- **JRN-02.1 (full):** Clone → start backend → start frontend → submit test → verify list → confirm zero config
- **JRN-02.2 (full):** DevTools inspection across GET, POST, blank-form, and summary stages
- **JRN-02.3:** No additional stages; already complete in R1

**R2 exit condition:** A first-time user can fill the 3-field form and submit in under 60 seconds; the submitted request appears in the list immediately; blank-form submit shows inline errors with zero API calls; POST returns 201 with full entity; GET returns all records; no CORS errors anywhere; clean DevTools session confirms the full loop.

---
## Coverage Analysis

---

### Persona Coverage by Release

| Persona | R1 | R2 |
|---------|----|----|
| PER-01 Marcus Webb (Requester) | 2 stories (navigation + loading indicator) | 6 stories (form + submit + confirm) |
| PER-02 Dana Park (Stakeholder/Dev) | 12 stories (scaffold + read path) | 2 stories (API validation) |

**R1 persona balance:** Dana-heavy by design — Phase 1 is infrastructure and the read path, which only Dana validates. Marcus gets navigation (US-1.2) which enables his future journeys, and loading state (US-6.5) which provides UX feedback when the list is accessed.

**R2 persona balance:** Marcus-heavy by design — Phase 2 delivers the form and submit flow that Marcus requires to complete his primary journeys. Dana validates the POST endpoint behavior (US-3.2, US-3.3) as part of CORS/API correctness.

---

### JTBD Coverage by Release

| JTBD-ID | Job Statement (abbreviated) | R1 | R2 | Final Status |
|---------|---------------------------|----|----|-------------|
| JTBD-01.1 | Submit valid form in < 60s | Partial (navigation only) | Complete | ✅ Fully addressed |
| JTBD-01.2 | Unambiguous post-submit state | Partial (list read path) | Complete | ✅ Fully addressed |
| JTBD-01.3 | Inline errors before API call | None | Complete | ✅ Fully addressed |
| JTBD-02.1 | Full loop from fresh clone | Partial (scaffold + GET) | Complete | ✅ Fully addressed |
| JTBD-02.2 | Zero CORS errors; correct HTTP codes | Partial (GET CORS) | Complete | ✅ Fully addressed |
| JTBD-02.3 | Architecture readable at a glance | Complete | Maintained | ✅ Fully addressed |

All 6 JTBD outcomes are fully addressed across R1 + R2.

---

### Journey Stage Coverage

| Journey | Stage | R1 | R2 |
|---------|-------|----|----|
| JRN-01.1 | Arrive | ✅ US-1.2 | — |
| JRN-01.1 | Orient | — | ✅ US-5.1 |
| JRN-01.1 | Fill | — | ✅ US-5.3 |
| JRN-01.1 | Submit | — | ✅ US-5.1, US-3.1 |
| JRN-01.1 | Confirm | — | ✅ US-6.2 |
| JRN-01.2 | Arrive & skip reading | — | ✅ US-5.2 |
| JRN-01.2 | See errors | — | ✅ US-5.2 |
| JRN-01.2 | Correct | — | ✅ US-5.2 |
| JRN-01.2 | Re-submit | — | ✅ US-3.1 |
| JRN-01.2 | Confirm | — | ✅ US-5.4 |
| JRN-01.3 | Navigate | ✅ US-1.2 | — |
| JRN-01.3 | Load list | ✅ US-6.5 | — |
| JRN-01.3 | Identify entry | — | ✅ US-6.2 |
| JRN-01.3 | Done | — | — (no story needed — journey closes) |
| JRN-02.1 | Clone | ✅ US-0.1 | — |
| JRN-02.1 | Start backend | ✅ US-0.1, US-0.2, US-2.1 | — |
| JRN-02.1 | Start frontend | ✅ US-1.1 | — |
| JRN-02.1 | Submit test request | — | ✅ US-3.1, US-5.1 |
| JRN-02.1 | Verify list | ✅ US-4.1, US-6.1 | ✅ US-6.2 |
| JRN-02.1 | Confirm zero config | ✅ US-2.1, US-0.1, US-1.1 | — |
| JRN-02.2 | Open DevTools | ✅ US-1.1 | — |
| JRN-02.2 | Inspect GET on list load | ✅ US-0.3, US-4.2 | — |
| JRN-02.2 | Inspect POST on submit | — | ✅ US-0.3, US-3.1 |
| JRN-02.2 | Inspect blank-form validation | — | ✅ US-5.2, US-3.2 |
| JRN-02.2 | Summarize | ✅ US-6.4 | ✅ US-3.3 |
| JRN-02.3 | Navigate source structure | ✅ US-0.1, US-1.1 | — |
| JRN-02.3 | Find CORS config | ✅ US-0.3 | — |
| JRN-02.3 | Find JPA entity | ✅ US-2.2 | — |
| JRN-02.3 | Find frontend fetch calls | ✅ US-1.3 | — |

**Coverage result:** All 29 journey stages map to at least one story. No uncovered stages.

---

### Gap Analysis

**Journey stages with no mapped stories:**
- JRN-01.3: "Done" — No story required. This is the journey closure moment (user closes the tab). No software behavior is expected here. ✅ Intentional non-coverage.

**JTBD outcomes with no derived NaC:**
- None. All 6 JTBD outcomes have at least one NaC derived and at least one covering story. ✅

**Orphan stories (not mapped to any journey stage):**
- None. All 22 stories (US-0.1 through US-6.5) appear in the matrix. ✅

**Personas not served by a release:**
- R1: PER-01 Marcus has 2 stories — sub-complete journey, but by design (form ships in R2). His journeys JRN-01.1 and JRN-01.2 cannot complete until R2.
- R2: PER-02 Dana has 2 stories — her primary journeys are complete from R1; R2 closes the POST/validation loop she inspects in JRN-02.2.

**Summary:** No true gaps. The one partial-coverage release (R1 for Marcus) is intentional and reflects PRD Phase 1 scope discipline. Both personas have complete journeys by the end of R2.

---
## NaC-to-Acceptance Criteria Mapping

This section cross-checks each NaC against the formal acceptance criteria in UserStories-SRT to verify alignment. Each NaC should be supported by at least one acceptance criterion in the corresponding story.

| NaC-ID | NaC Statement | Story | Supporting Acceptance Criterion(a) | Aligned? |
|--------|---------------|-------|-------------------------------------|----------|
| NaC-01 | Navigation controls visible on page load; user reaches form in one click | US-1.2 | "Navigation controls (buttons or links) labeled 'Submit Request' and 'View Requests' are visible on every screen" | ✅ |
| NaC-02 | Three labeled fields in single vertical stack before user types; required intent clear at a glance | US-5.1 | "Form displays three labeled fields stacked vertically: Name, Request Title, Description" | ✅ |
| NaC-03 | Submit button disabled immediately on valid submit click; double-submission prevented | US-5.3 | "Submit button is disabled immediately after a valid form submission is initiated" + "A second click...has no effect" | ✅ |
| NaC-04 | Valid second submit succeeds; POST called exactly once | US-3.1 | "POST /api/requests with JSON body returns 201 Created" + "Identical payloads submitted twice create two separate records" | ✅ |
| NaC-05 | POST called; form clears and/or user redirected within 3 seconds of 201 | US-5.1 | "On 201 Created response, form fields are cleared" + "After successful submission, user is navigated to the Request List view" | ✅ |
| NaC-06 | Submitted request visible in list within same session; no manual reload required | US-6.2 | "Navigating to the list view shows the newly submitted request" + "The request appears without requiring a manual page refresh" | ✅ |
| NaC-07 | Navigation from form to list visible and immediate; no URL typing required | US-1.2 | "Clicking 'View Requests' renders the Request List without a full page reload" + "No console errors appear when switching between views" | ✅ |
| NaC-08 | Loading indicator while GET in flight; clears when data arrives | US-6.5 | "While GET /api/requests call is in progress, a 'Loading…' text or indicator is displayed" + "loading state clears as soon as the API response is received" | ✅ |
| NaC-09 | On API failure, entered data preserved; clear error message shown | US-5.4 | "Form fields are NOT cleared on API failure" + "error message...displayed at the form level" | ✅ |
| NaC-10 | Blank Submit shows three field-level error messages within 200ms; zero network requests | US-5.2 | "No API call is made when any required field is blank" + "Clicking Submit with blank Name shows 'Name is required.'" (×3) | ✅ |
| NaC-11 | Each error identifies specific blank field by name; shown directly below input | US-5.2 | "'Name is required.' below Name input" / "'Request title is required.' below Title input" / "'Description is required.' below Description textarea" | ✅ |
| NaC-12 | Error under each field clears when field has non-blank value | US-5.2 | "Validation fires on Submit click only — not on every keystroke" — *Note: US-5.2 specifies validation fires on submit; per-field clearing is described in JOURNEYS but not explicitly in US-5.2 AC. Partial alignment — recommend adding an AC for error-clear-on-input in US-5.2.* | ⚠️ Partial |
| NaC-13 | Repo clones cleanly; Maven wrapper committed; .gitignore excludes build artifacts | US-0.1 | "Running ./mvnw spring-boot:run...starts the application without errors" — *Note: .gitignore and repo hygiene are implied but not an explicit AC in US-0.1. Acceptable for demo scope.* | ⚠️ Implied |
| NaC-14 | Backend starts in under 30s on JDK 17+; no external services required | US-0.1 | "Application starts in under 30 seconds on a standard developer machine with JDK 17+" + "No external services, database servers, or Docker are required" | ✅ |
| NaC-15 | `npm install && npm run dev` starts Vite on 5173 with no additional config | US-1.1 | "Running npm install && npm run dev starts the Vite dev server without errors" + "Dev server is accessible at http://localhost:5173 by default" | ✅ |
| NaC-16 | POST returns 201; form clears; no CORS error during test submit | US-3.1 | "POST /api/requests...returns 201 Created" + "response body contains the saved entity including id and createdAt" | ✅ |
| NaC-17 | GET returns submitted entry; list updates without manual reload | US-6.1 | "Navigating to the Request List screen triggers a GET...on component mount" + "All records returned by the API are rendered" | ✅ |
| NaC-18 | requests table auto-created from JPA entity; no SQL migration file | US-2.1 | "H2 requests table is created automatically on application startup via Hibernate ddl-auto=create-drop" + "Application restart re-creates the table empty" | ✅ |
| NaC-19 | Access-Control-Allow-Origin header in GET response; 200 with JSON array or [] | US-0.3 + US-4.2 | "Access-Control-Allow-Origin: http://localhost:5173 header is present in API responses" + "GET...returns 200 OK with body []" | ✅ |
| NaC-20 | POST returns 201 with full entity; OPTIONS preflight passes; no CORS error | US-0.3 + US-3.1 | "Preflight (OPTIONS) requests are handled correctly with no 4xx response" + "POST /api/requests...returns 201 Created with the saved entity" | ✅ |
| NaC-21 | Zero network requests on blank-form submit; client-side guard fires before fetch | US-5.2 + US-3.2 | "No API call is made when any required field is blank" (US-5.2) + "POST with missing/blank fields returns 400" (US-3.2) | ✅ |
| NaC-22 | Zero console errors across full session; all status codes correct | US-6.4 + US-3.3 | "error is shown without crashing the application" (US-6.4) + "endpoint does not return a 500 for malformed input" (US-3.3) | ✅ |
| NaC-23 | Standard Maven layout; dedicated frontend/ directory; no unusual nesting | US-0.1 + US-1.1 | Implied by scaffold stories; not an explicit AC — acceptable for demo scope | ⚠️ Implied |
| NaC-24 | Single @Configuration class for CORS; locatable in < 2 min | US-0.3 | "Spring Boot CORS config allows origin http://localhost:5173 on all /api/** endpoints" — *Implementation detail (single class) implied but not explicit in AC. Acceptable.* | ⚠️ Implied |
| NaC-25 | Plain JPA entity with 5 fields; @PrePersist for created_at; no extra processors | US-2.2 | "created_at is set by @PrePersist lifecycle method" + "Both fields appear in the JSON response" | ✅ |
| NaC-26 | API_BASE_URL in single constants file; plain fetch in form and list components | US-1.3 | "A constants.ts or api.ts file exports API_BASE_URL" + "No component file contains a hardcoded http://localhost:8080 URL" | ✅ |

---

### Alignment Summary

| Status | Count | NaC IDs |
|--------|-------|---------|
| ✅ Full alignment | 21 | NaC-01–11, NaC-14–22, NaC-25–26 |
| ⚠️ Partial / Implied | 5 | NaC-12, NaC-13, NaC-23, NaC-24, NaC-26 |
| ❌ No alignment | 0 | — |

**Recommendations:**
- **NaC-12** (error clears on field input): Consider adding an acceptance criterion to US-5.2: *"Each inline error message disappears as soon as the corresponding field has a non-whitespace value."* This matches the intent described in JRN-01.2 Stage 3 but is missing from the formal AC.
- **NaC-13, NaC-23, NaC-24** (repo hygiene, directory structure, CORS class pattern): These are implementation-level constraints captured in JOURNEYS and JTBD but not in formal ACs. For a demo project, this is acceptable — the scaffold stories (US-0.1, US-0.3, US-1.1) deliver the intent even if the structural AC is implied.

---

*Generated by Pivota Spec Story Map Generator | Project: SRT | 2026-05-19*
