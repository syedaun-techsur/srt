# Roadmap: Simple Request Tracker (SRT)

## Overview

SRT is delivered in two focused phases. Phase 1 builds the complete read path: scaffold both services, define the data model, expose the GET endpoint, and render the request list — including all empty/error states. Phase 2 completes the write path: the POST endpoint and submission form, closing the end-to-end create-and-display loop that is the core value of the application.

## Phases

**Phase Numbering:**
- Integer phases (1, 2): Planned milestone work
- Decimal phases (1.1, 2.1): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Read Path** - Backend + frontend scaffolds, data model, GET endpoint, and request list view (completed 2026-05-20)
- [ ] **Phase 2: Write Path** - POST endpoint, submission form, and end-to-end create-display loop verified

## Phase Details

### Phase 1: Read Path
**Status**: completed (2026-05-30)
**Last Updated**: 2026-05-30T21:11:17Z
**Goal**: Both services run locally, the data model is live, and a user can open the app and see all submitted requests (including a graceful empty state)
**Depends on**: Nothing (first phase)
**Requirements**: BACK-01, BACK-02, BACK-03, BACK-04, API-01, FRONT-01, FRONT-02, LIST-01, LIST-02, LIST-03, LIST-04
**Success Criteria** (what must be TRUE):
  1. Running `./mvnw spring-boot:run` starts the backend on port 8080 with no errors and `GET /api/requests` returns `[]`
  2. Running `npm run dev` starts the frontend on port 5173 with no errors and no browser CORS failures when calling the backend
  3. The Request List view loads in the browser, displays a table with columns Name, Request Title, Description when records exist, and shows "No requests submitted yet." when the database is empty
  4. If the backend is unreachable, the Request List view shows an error message instead of crashing
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Spring Boot scaffold: H2, Request entity, CorsConfig, GET /api/requests
- [x] 01-02-PLAN.md — React+Vite scaffold: App shell, constants, types, RequestList component + Playwright tests

### Phase 2: Write Path
**Status**: completed (2026-05-22)
**Last Updated**: 2026-05-22T15:56:55Z
**Goal**: A user can fill out the submission form and submit a request; it is immediately visible in the Request List view — the complete create-and-display loop works end-to-end
**Depends on**: Phase 1
**Requirements**: API-02, FORM-01, FORM-02, FORM-03, FORM-04
**Success Criteria** (what must be TRUE):
  1. `POST /api/requests` with valid fields returns `201 Created` with the saved record including server-assigned `id` and `createdAt`
  2. Submitting the form with one or more blank fields shows inline validation errors per field and makes no API call
  3. Successfully submitting the form navigates the user to the Request List view where the new entry is immediately visible
  4. If the API call fails, the form shows a form-level error message and preserves all entered field values
**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md — RequestDto + POST /api/requests (201 valid / 400 blank)
- [ ] 02-02-PLAN.md — SubmissionForm component + App.tsx update + 6 Playwright E2E tests

## Progress

**Execution Order:** Phase 1 → Phase 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Read Path | 0/2 | Not started | - |
| 2. Write Path | 0/TBD | Not started | - |