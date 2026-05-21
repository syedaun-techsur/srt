# Requirements: Simple Request Tracker (SRT)

**Defined:** 2026-05-19
**Core Value:** A user submits a request through the form, the data is stored, and the list view immediately shows it — the complete create-and-display loop working end-to-end.

## v1 Requirements

### Backend Infrastructure

- [x] **BACK-01**: Spring Boot backend is scaffolded and starts with no manual setup
- [x] **BACK-02**: H2 in-memory database is configured and available on application start
- [x] **BACK-03**: `Request` entity persists id (UUID), name, title, description, created_at fields
- [x] **BACK-04**: CORS is configured so the React frontend can reach the backend API

### API

- [x] **API-01**: GET `/api/requests` returns all stored requests as JSON array
- [x] **API-02**: POST `/api/requests` accepts name, title, description; persists to DB; returns 201 with created record

### Frontend Infrastructure

- [x] **FRONT-01**: React frontend (Vite + TypeScript) is scaffolded and starts with no manual setup
- [x] **FRONT-02**: Frontend connects to backend via HTTP and displays live data

### Submission Form

- [x] **FORM-01**: Request form displays fields for Name (text), Request Title (text), Description (textarea), and a Submit button
- [x] **FORM-02**: All three fields are required; submitting with any blank field shows inline validation errors
- [x] **FORM-03**: On successful submission, the form navigates to the Request List view (user sees their submitted entry immediately)
- [x] **FORM-04**: On API error, the form shows an error message and preserves entered field values

### Request List View

- [x] **LIST-01**: List view displays all submitted requests in a table with columns: Name, Request Title, Description
- [x] **LIST-02**: Table loads all records on page render (no pagination)
- [x] **LIST-03**: Empty state is handled gracefully (message shown when no requests exist)
- [x] **LIST-04**: Error state is handled gracefully (message shown when API call fails)

## v2 Requirements

*(None defined — scope is intentionally minimal for demo)*

## Out of Scope

| Feature | Reason |
|---------|--------|
| Authentication / login | Explicitly excluded from scope — demo app |
| External integrations | Zero external dependencies by design |
| Workflows / notifications | Out of scope per product definition |
| Advanced validation | Required-field only; no email format, length limits, etc. |
| Pagination | All records shown in single table — no pagination |
| Persistent database | H2 in-memory intentional — demo/zero-setup constraint |
| Mobile-specific design | Minimal CSS, functional UI only |

## Traceability

Which phases cover which requirements. Updated after roadmap creation (2026-05-20).

| Requirement | Phase | Status |
|-------------|-------|--------|
| BACK-01 | Phase 1 | Done |
| BACK-02 | Phase 1 | Done |
| BACK-03 | Phase 1 | Done |
| BACK-04 | Phase 1 | Done |
| API-01 | Phase 1 | Done |
| FRONT-01 | Phase 1 | Done |
| FRONT-02 | Phase 1 | Done |
| LIST-01 | Phase 1 | Done |
| LIST-02 | Phase 1 | Done |
| LIST-03 | Phase 1 | Done |
| LIST-04 | Phase 1 | Done |
| API-02 | Phase 2 | Done |
| FORM-01 | Phase 2 | Done |
| FORM-02 | Phase 2 | Done |
| FORM-03 | Phase 2 | Done |
| FORM-04 | Phase 2 | Done |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-19*
*Last updated: 2026-05-20 after roadmap creation — traceability confirmed complete*
