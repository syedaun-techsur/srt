# User Stories: Simple Request Tracker (SRT)

**Document ID:** UserStories-SRT  
**Version:** 1.0  
**Date:** 2026-05-19  
**Status:** Active  
**Based on:** PRD-SRT v1.0, FRD-SRT v1.0, PERSONAS-SRT v1.0

---

## Personas

| Persona | Name | Role |
|---------|------|------|
| PER-01 | Marcus Webb | Business Requester — submits requests via the web form |
| PER-02 | Dana Park | Internal Stakeholder / Developer — reads requests, validates delivery pipeline |

---

## Priority Definitions

| Level | Label | Meaning |
|-------|-------|---------|
| P0 | Critical | MVP blocker — must ship before any release |
| P1 | High | Important but not a release blocker |
| P2 | Medium | Enhances experience; can be deferred |
| P3 | Low | Nice-to-have; deferred until P0–P2 are complete |

---

## Epic 0: Spring Boot Backend Scaffold (F0)

*The Java Spring Boot application is initialized with all required dependencies, CORS configuration, and H2 connection. This scaffold is the foundational layer all backend features depend on.*

---

### US-0.1: Start Backend with Zero Configuration
**As a** Dana Park, **I want to** start the Spring Boot backend with a single command from a fresh clone, **so that** I can validate the delivery pipeline without manual environment setup.

**Acceptance Criteria:**
- [ ] Running `./mvnw spring-boot:run` (or `./gradlew bootRun`) from the project root starts the application without errors
- [ ] Application starts in under 30 seconds on a standard developer machine with JDK 17+
- [ ] No external services, database servers, or Docker are required
- [ ] Application binds to port 8080 by default
- [ ] Startup log contains no `DataSource` errors or missing bean errors

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.2: Access H2 Console for Database Inspection
**As a** Dana Park, **I want to** access the H2 web console at `/h2-console`, **so that** I can inspect the in-memory database and verify the `requests` table was created correctly.

**Acceptance Criteria:**
- [ ] H2 Console is accessible at `http://localhost:8080/h2-console` when the backend is running
- [ ] Console connects successfully using JDBC URL `jdbc:h2:mem:srtdb`, username `sa`, and empty password
- [ ] The `REQUESTS` table is visible and contains the correct columns: `id`, `name`, `title`, `description`, `created_at`
- [ ] Console is only required in development mode; no error if accessed while app is running

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.3: Backend Accepts CORS Requests from Frontend
**As a** Dana Park, **I want to** confirm the backend returns CORS headers for requests from the Vite dev server origin, **so that** the browser does not block frontend-to-backend API calls.

**Acceptance Criteria:**
- [ ] Spring Boot CORS config allows origin `http://localhost:5173` on all `/api/**` endpoints
- [ ] Allowed HTTP methods include `GET`, `POST`, and `OPTIONS`
- [ ] All headers are allowed (`*`)
- [ ] Preflight (`OPTIONS`) requests are handled correctly with no 4xx response
- [ ] `Access-Control-Allow-Origin: http://localhost:5173` header is present in API responses when request includes that origin
- [ ] No CORS errors appear in the browser console when the React frontend calls the backend

**Priority:** P0 | **Feature Ref:** F0

---

## Epic 1: React Frontend Scaffold (F1)

*The React application is scaffolded using Vite with TypeScript and wired to communicate with the Spring Boot backend. It provides the application shell and two-screen navigation.*

---

### US-1.1: Start Frontend Dev Server with Zero Configuration
**As a** Dana Park, **I want to** start the React frontend with `npm run dev` from a fresh clone, **so that** I can validate the frontend is runnable without manual configuration.

**Acceptance Criteria:**
- [ ] Running `npm install && npm run dev` starts the Vite dev server without errors
- [ ] Dev server is accessible at `http://localhost:5173` by default
- [ ] No UI framework dependencies (Tailwind, MUI, Bootstrap) appear in `package.json`
- [ ] `npm run build` completes without TypeScript or compilation errors
- [ ] No hardcoded backend URLs appear in component files — only in the shared constants file

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.2: Navigate Between Submission Form and Request List
**As a** Marcus Webb, **I want to** switch between the "Submit Request" form screen and the "View Requests" list screen, **so that** I can access either part of the application without confusion.

**Acceptance Criteria:**
- [ ] Navigation controls (buttons or links) labeled "Submit Request" and "View Requests" are visible on every screen
- [ ] Clicking "Submit Request" renders the Submission Form without a full page reload
- [ ] Clicking "View Requests" renders the Request List without a full page reload
- [ ] The active screen is clearly indicated in the navigation
- [ ] No console errors appear when switching between views

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.3: Backend Base URL Is Centrally Configured
**As a** Dana Park, **I want to** find the backend API base URL defined in a single constants file, **so that** I can change the backend address without hunting through component files.

**Acceptance Criteria:**
- [ ] A `constants.ts` or `api.ts` file exports `API_BASE_URL = "http://localhost:8080/api"`
- [ ] No component file contains a hardcoded `http://localhost:8080` URL
- [ ] All API calls in the frontend reference the `API_BASE_URL` constant

**Priority:** P0 | **Feature Ref:** F1

---

## Epic 2: Request Data Model & Persistence (F2)

*The `Request` entity is defined as a JPA-managed Java class mapped to the `requests` table in H2. It is the data backbone every backend endpoint depends on.*

---

### US-2.1: Request Entity Is Persisted to H2 on Startup
**As a** Dana Park, **I want to** verify that the `requests` table is auto-created in H2 when Spring Boot starts, **so that** no manual schema setup is required.

**Acceptance Criteria:**
- [ ] H2 `requests` table is created automatically on application startup via Hibernate `ddl-auto=create-drop`
- [ ] Table contains columns: `id` (BIGINT, auto-increment), `name` (VARCHAR, NOT NULL), `title` (VARCHAR, NOT NULL), `description` (CLOB/TEXT, NOT NULL), `created_at` (TIMESTAMP, NOT NULL)
- [ ] Table is dropped on application shutdown
- [ ] Application restart re-creates the table empty — no stale data persists
- [ ] H2 Console shows the `REQUESTS` table with the correct schema after startup

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.2: Request Record Has Server-Assigned ID and Timestamp
**As a** Dana Park, **I want to** verify that saved requests have server-generated `id` and `created_at` values, **so that** clients cannot tamper with primary keys or timestamps.

**Acceptance Criteria:**
- [ ] `id` is auto-generated by H2 using identity/sequence strategy — client-provided `id` in POST body is silently ignored
- [ ] `created_at` is set by `@PrePersist` lifecycle method to `LocalDateTime.now()` at save time — client-provided `createdAt` is silently ignored
- [ ] Both fields appear in the JSON response of every successful `POST /api/requests` call
- [ ] `created_at` is serialized as an ISO 8601 timestamp string in API responses

**Priority:** P0 | **Feature Ref:** F2

---

## Epic 3: POST Endpoint — Submit Request (F3)

*A REST endpoint accepts a new request payload, validates required fields, persists the record to H2, and returns the created entity with `201 Created`.*

---

### US-3.1: Submit a Valid Request via API
**As a** Marcus Webb, **I want to** submit a request with my name, a title, and a description via the API, **so that** the request is stored and I receive confirmation it was saved.

**Acceptance Criteria:**
- [ ] `POST /api/requests` with a JSON body containing `name`, `title`, and `description` returns `201 Created`
- [ ] The response body contains the saved entity including server-assigned `id` and `createdAt`
- [ ] The saved record is immediately retrievable via `GET /api/requests`
- [ ] Identical payloads submitted twice create two separate records (no deduplication)
- [ ] `Content-Type: application/json` header is accepted and required

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.2: API Rejects Submission with Missing or Blank Fields
**As a** Dana Park, **I want to** verify that the POST endpoint returns `400 Bad Request` when any required field is missing or blank, **so that** invalid data never reaches the database.

**Acceptance Criteria:**
- [ ] Submitting without `name` (missing or blank/whitespace-only) returns `400 Bad Request`
- [ ] Submitting without `title` (missing or blank/whitespace-only) returns `400 Bad Request`
- [ ] Submitting without `description` (missing or blank/whitespace-only) returns `400 Bad Request`
- [ ] `400` response body contains `{"error": "Validation failed", "message": "All fields (name, title, description) are required."}`
- [ ] No record is written to H2 when validation fails
- [ ] Whitespace-only values (e.g., `"   "`) are treated as blank and rejected

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.3: API Rejects Malformed Request Body
**As a** Dana Park, **I want to** verify the POST endpoint returns `400 Bad Request` when the request body is not valid JSON, **so that** malformed payloads are handled gracefully.

**Acceptance Criteria:**
- [ ] Sending a non-JSON body returns `400 Bad Request`
- [ ] Response body contains `{"error": "Bad request", "message": "Invalid request body."}`
- [ ] No stack trace is included in the error response
- [ ] The endpoint does not return a `500` for malformed input

**Priority:** P0 | **Feature Ref:** F3

---

## Epic 4: GET Endpoint — List All Requests (F4)

*A REST endpoint returns all stored requests from H2 as a JSON array. Returns an empty array when no records exist. No filtering, sorting, or pagination.*

---

### US-4.1: Retrieve All Submitted Requests via API
**As a** Dana Park, **I want to** call `GET /api/requests` and receive a JSON array of all stored requests, **so that** I can verify the full create-and-display loop is working end-to-end.

**Acceptance Criteria:**
- [ ] `GET /api/requests` returns `200 OK` with a JSON array of all stored `Request` records
- [ ] Each record in the array includes: `id`, `name`, `title`, `description`, `createdAt`
- [ ] Records are returned in natural insertion order (ascending `id`)
- [ ] No query parameters are required or accepted
- [ ] Response is always a JSON array — never `null` or a non-array type

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.2: GET Endpoint Returns Empty Array When No Requests Exist
**As a** Dana Park, **I want to** call `GET /api/requests` on a freshly started backend and receive an empty array, **so that** the empty state is handled gracefully without errors.

**Acceptance Criteria:**
- [ ] `GET /api/requests` on an empty database returns `200 OK` with body `[]`
- [ ] Response status is `200`, not `404`
- [ ] Response body is a valid empty JSON array, not `null`
- [ ] No error is thrown or logged when the table has zero rows

**Priority:** P0 | **Feature Ref:** F4

---

## Epic 5: Request Submission Form (F5)

*The frontend submission screen presents a vertical form with three required fields and a Submit button. Performs client-side validation before making any API call.*

---

### US-5.1: Submit a Request Through the Web Form
**As a** Marcus Webb, **I want to** fill in my name, a request title, and a description and click Submit, **so that** my request is sent to the backend and confirmed as received.

**Acceptance Criteria:**
- [ ] Form displays three labeled fields stacked vertically: Name (text input), Request Title (text input), Description (textarea)
- [ ] All three fields display placeholder text: "Your name", "Request title", "Describe your request"
- [ ] Clicking Submit with all fields filled sends `POST /api/requests` with the entered values
- [ ] On `201 Created` response, user is navigated to the Request List view
- [ ] Submit button is re-enabled after a successful submission

**Priority:** P0 | **Feature Ref:** F5

---

### US-5.2: Form Shows Inline Errors for Blank Required Fields
**As a** Marcus Webb, **I want to** see an error message beneath each blank field when I try to submit without filling them in, **so that** I know exactly which fields need to be completed before I can submit.

**Acceptance Criteria:**
- [ ] Clicking Submit with a blank Name field shows "Name is required." below the Name input
- [ ] Clicking Submit with a blank Request Title field shows "Request title is required." below the Title input
- [ ] Clicking Submit with a blank Description field shows "Description is required." below the Description textarea
- [ ] Multiple errors can be shown simultaneously when more than one field is blank
- [ ] No API call is made when any required field is blank
- [ ] Whitespace-only input (e.g., spaces) is treated as blank and triggers the error
- [ ] Validation fires on Submit click only — not on every keystroke
- [ ] Once an inline error is displayed for a field, it clears as soon as that field has a non-blank value (error clears on input, not on re-submit)

**Priority:** P0 | **Feature Ref:** F5

---

### US-5.3: Submit Button Is Disabled During API Call
**As a** Marcus Webb, **I want to** see the Submit button become disabled while my request is being sent, **so that** I cannot accidentally submit the same request twice.

**Acceptance Criteria:**
- [ ] Submit button is disabled immediately after a valid form submission is initiated
- [ ] Button optionally shows "Submitting…" text or loading indicator while the API call is in flight
- [ ] A second click on the Submit button during an active API call has no effect
- [ ] Submit button is re-enabled after the API call completes (success or failure)

**Priority:** P0 | **Feature Ref:** F5

---

### US-5.4: Form Preserves Data and Shows Error on API Failure
**As a** Marcus Webb, **I want to** see an error message at the top of the form and keep my entered data intact if the submission fails, **so that** I can retry without re-typing everything.

**Acceptance Criteria:**
- [ ] If the API returns `400`, `500`, or a network error, a form-level error message is displayed: "Submission failed. Please try again."
- [ ] Form fields are NOT cleared on API failure — user-entered data is preserved
- [ ] The error message is displayed at the form level (not inline beneath a specific field)
- [ ] Submit button is re-enabled after a failed API call so the user can retry

**Priority:** P0 | **Feature Ref:** F5

---

## Epic 6: Request List View (F6)

*The frontend list screen displays all submitted requests in a full-width table. Fetches data on component mount. Shows an empty-state message when no records exist.*

---

### US-6.1: View All Submitted Requests in a Table
**As a** Dana Park, **I want to** open the Request List screen and see all submitted requests displayed in a full-width table, **so that** I can verify the create-and-display loop is complete and all entries are present.

**Acceptance Criteria:**
- [ ] Navigating to the Request List screen triggers a `GET /api/requests` call on component mount
- [ ] Table renders with three visible columns: "Name", "Request Title", "Description"
- [ ] Each submitted request appears as a row with its `name`, `title`, and `description` values
- [ ] The `id` and `createdAt` columns are NOT displayed in the table
- [ ] All records returned by the API are rendered — no client-side filtering or row limiting
- [ ] Records appear in natural insertion order (oldest first)
- [ ] The API call is made exactly once on mount, not on every render

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.2: Verify Submitted Request Appears in List Immediately
**As a** Marcus Webb, **I want to** navigate to the Request List after submitting a request and see my entry in the table, **so that** I can confirm my submission was saved successfully.

**Acceptance Criteria:**
- [ ] After a successful form submission (US-5.1), navigating to the list view shows the newly submitted request in the table
- [ ] The row shows the exact `name`, `title`, and `description` values that were entered in the form
- [ ] The request appears without requiring a manual page refresh
- [ ] If the user was automatically redirected to the list view after submission, the new record is already present on arrival

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.3: List View Shows Empty State When No Requests Exist
**As a** Dana Park, **I want to** see a clear message on the Request List screen when no requests have been submitted, **so that** it is obvious the list is intentionally empty rather than broken.

**Acceptance Criteria:**
- [ ] When `GET /api/requests` returns an empty array, the table is NOT rendered
- [ ] Instead, the message "No requests submitted yet." is displayed clearly on the screen
- [ ] The empty state message is shown on a freshly started application with no prior submissions
- [ ] No console errors appear when the empty state is rendered

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.4: List View Handles Fetch Error Gracefully
**As a** Dana Park, **I want to** see an error message on the Request List screen if the backend is unreachable or returns a server error, **so that** I know the failure is a connectivity issue rather than a data problem.

**Acceptance Criteria:**
- [ ] If the `GET /api/requests` call fails (network error or `5xx` response), the table is NOT rendered
- [ ] An error message is displayed: "Failed to load requests. Please try again."
- [ ] The error is shown without crashing the application or throwing an unhandled exception
- [ ] No empty table body is rendered in place of the error message

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.5: List View Shows Loading State While Fetching
**As a** Marcus Webb, **I want to** see a visual indicator while the request list is loading, **so that** I know the application is working and not frozen.

**Acceptance Criteria:**
- [ ] While the `GET /api/requests` call is in progress, a "Loading…" text or indicator is optionally displayed
- [ ] The loading state clears as soon as the API response is received (success or error)
- [ ] No stale "Loading…" text remains after data has been rendered

**Priority:** P0 | **Feature Ref:** F6

---

## Story Index

| Story ID | Title | Persona | Priority | Feature Ref |
|----------|-------|---------|----------|-------------|
| US-0.1 | Start Backend with Zero Configuration | Dana Park | P0 | F0 |
| US-0.2 | Access H2 Console for Database Inspection | Dana Park | P0 | F0 |
| US-0.3 | Backend Accepts CORS Requests from Frontend | Dana Park | P0 | F0 |
| US-1.1 | Start Frontend Dev Server with Zero Configuration | Dana Park | P0 | F1 |
| US-1.2 | Navigate Between Submission Form and Request List | Marcus Webb | P0 | F1 |
| US-1.3 | Backend Base URL Is Centrally Configured | Dana Park | P0 | F1 |
| US-2.1 | Request Entity Is Persisted to H2 on Startup | Dana Park | P0 | F2 |
| US-2.2 | Request Record Has Server-Assigned ID and Timestamp | Dana Park | P0 | F2 |
| US-3.1 | Submit a Valid Request via API | Marcus Webb | P0 | F3 |
| US-3.2 | API Rejects Submission with Missing or Blank Fields | Dana Park | P0 | F3 |
| US-3.3 | API Rejects Malformed Request Body | Dana Park | P0 | F3 |
| US-4.1 | Retrieve All Submitted Requests via API | Dana Park | P0 | F4 |
| US-4.2 | GET Endpoint Returns Empty Array When No Requests Exist | Dana Park | P0 | F4 |
| US-5.1 | Submit a Request Through the Web Form | Marcus Webb | P0 | F5 |
| US-5.2 | Form Shows Inline Errors for Blank Required Fields | Marcus Webb | P0 | F5 |
| US-5.3 | Submit Button Is Disabled During API Call | Marcus Webb | P0 | F5 |
| US-5.4 | Form Preserves Data and Shows Error on API Failure | Marcus Webb | P0 | F5 |
| US-6.1 | View All Submitted Requests in a Table | Dana Park | P0 | F6 |
| US-6.2 | Verify Submitted Request Appears in List Immediately | Marcus Webb | P0 | F6 |
| US-6.3 | List View Shows Empty State When No Requests Exist | Dana Park | P0 | F6 |
| US-6.4 | List View Handles Fetch Error Gracefully | Dana Park | P0 | F6 |
| US-6.5 | List View Shows Loading State While Fetching | Marcus Webb | P0 | F6 |

**Total stories:** 22  
**P0 (Critical):** 22 | **P1–P3:** 0

---

## Priority Summary

| Priority | Count | Rationale |
|----------|-------|-----------|
| P0 | 22 | All SRT features are critical-path MVP; no story exists outside the core create-and-display loop |

All stories are P0 because the PRD defines this application as a zero-frills demo project where every feature is a critical-path requirement. There are no optional enhancements, no deferred workflows, and no advanced features — the entire scope is the minimal viable loop.

---

*Generated by Pivota Spec UserStories Generator | Project: SRT | 2026-05-19*
