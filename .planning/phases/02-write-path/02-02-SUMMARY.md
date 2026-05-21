---
phase: 02-write-path
plan: "02"
subsystem: ui
tags: [react, typescript, form, validation, playwright, fetch]

# Dependency graph
requires:
  - phase: 02-write-path
    provides: "Plan 02-01 - POST /api/requests endpoint"
  - phase: 01-read-path
    provides: "Plan 01-02 - React+Vite scaffold, App shell, constants, types"
provides:
  - SubmissionForm component: Name/Title/Description inputs, inline validation, POST on submit
  - App.tsx updated: SubmissionForm replaces Phase 1 placeholder stub
  - 6 Playwright E2E tests for all form states
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Controlled inputs with useState for each field"
    - "FieldErrors interface for per-field inline validation state"
    - "onSuccess callback prop for post-submit navigation (keeps form decoupled from routing)"
    - "noValidate on form — React handles validation, not browser"
    - "role=alert on error spans/p for accessibility"
    - "exact: true in Playwright getByRole button locators to avoid ambiguity"

key-files:
  created:
    - srt-frontend/src/components/SubmissionForm.tsx
    - e2e/submission-form.spec.ts
  modified:
    - srt-frontend/src/App.tsx

key-decisions:
  - "onSuccess prop pattern: SubmissionForm calls onSuccess() on 201; App.tsx passes () => setActiveView('list') — keeps navigation logic in App"
  - "exact: true in button locators: 'Submit' without exact matched 'Submit Request' as partial match — fixed to exact:true"
  - "NODE_PATH=./node_modules needed: e2e/ is outside srt-frontend/ so @playwright/test import needs NODE_PATH pointing to srt-frontend/node_modules"

patterns-established:
  - "Controlled form pattern: one useState per field, validate() returns FieldErrors, setFieldErrors on invalid"
  - "API error preserved fields: catch block sets apiError but does not reset name/title/description state"
  - "Playwright exact button match: use { name: '...', exact: true } when button label is substring of another button"

# Metrics
duration: 5min
completed: 2026-05-21
---

# Phase 2 Plan 02: SubmissionForm Summary

**SubmissionForm with inline validation, POST to backend, success navigation; 6/6 Playwright E2E tests passing**

## Performance

- **Duration:** 5 min
- **Completed:** 2026-05-21
- **Tasks:** 2
- **Files created/modified:** 3

## Accomplishments

- `SubmissionForm.tsx` created: controlled form with Name/Request Title/Description inputs
- Inline validation: blank field → per-field error message; no POST call made
- On successful POST: calls `onSuccess()` → App.tsx navigates to list view
- On failed POST: shows "Submission failed. Please try again." while preserving all field values
- `App.tsx` updated: replaces `<div>Form coming in Phase 2.</div>` stub with `<SubmissionForm onSuccess={() => setActiveView('list')} />`
- 6/6 Playwright E2E tests pass with `page.route()` mocking (no live backend needed)
- 5/5 existing RequestList tests still pass (no regression)

## Test Results

```
submission-form.spec.ts — 6 passed
  ✓ renders Name, Request Title, Description fields and Submit button
  ✓ shows inline validation errors when submitting blank form
  ✓ does not call API when form has blank fields
  ✓ navigates to list view and shows new entry after successful submission
  ✓ shows API error message and preserves field values on submission failure
  ✓ clears inline validation errors when user fills in a field

request-list.spec.ts — 5 passed (no regression)
```

## Commit

- `36d2d06` — feat(02-02): add SubmissionForm component, update App.tsx, 6 E2E tests passing

## Files Created/Modified

- `srt-frontend/src/components/SubmissionForm.tsx` — form component with controlled inputs, validation, POST, onSuccess callback
- `srt-frontend/src/App.tsx` — imports SubmissionForm, replaces Phase 1 stub
- `e2e/submission-form.spec.ts` — 6 E2E tests with page.route() mocking

## How to Run Tests

```bash
cd srt-frontend
NODE_PATH=./node_modules npx playwright test ../e2e/submission-form.spec.ts --reporter=list
```

## Decisions Made

- **`onSuccess` prop pattern:** SubmissionForm receives `onSuccess: () => void` callback and calls it after 201. App.tsx passes `() => setActiveView('list')`. Keeps routing logic in App, form stays decoupled.
- **`exact: true` in Playwright locators:** `getByRole('button', { name: 'Submit' })` was ambiguous — matched both "Submit Request" and "Submit" buttons. Fixed with `{ name: 'Submit', exact: true }`.
- **`NODE_PATH` for Playwright:** The `e2e/` directory is at project root (sibling of `srt-frontend/`). Node module resolution doesn't walk into `srt-frontend/node_modules` from there. Running Playwright with `NODE_PATH=./node_modules` from `srt-frontend/` resolves `@playwright/test` correctly.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Playwright strict mode violation: ambiguous 'Submit' button locator**
- **Found during:** Task 2 (Playwright test run)
- **Issue:** `getByRole('button', { name: 'Submit' })` matched both "Submit Request" and "Submit" buttons — Playwright strict mode error
- **Fix:** Added `exact: true` to all Submit button locators: `getByRole('button', { name: 'Submit', exact: true })`
- **Files modified:** `e2e/submission-form.spec.ts`
- **Verification:** All 6 tests pass after fix

**2. [Rule 3 - Blocking] @playwright/test module resolution outside srt-frontend/**
- **Found during:** Task 2 (test execution)
- **Issue:** `e2e/` is outside `srt-frontend/`; `@playwright/test` import couldn't resolve without NODE_PATH
- **Fix:** Run tests with `NODE_PATH=./node_modules npx playwright test` from `srt-frontend/`
- **Files modified:** None (runtime flag only)
- **Verification:** Tests run and pass

---

**Total deviations:** 2 auto-fixed (1 bug, 1 env)
**Impact on plan:** No scope changes. All 6 tests pass; all 11 tests pass total.

## User Setup Required

None — `npm install` in `srt-frontend/` handles all dependencies.

---
*Phase: 02-write-path*
*Completed: 2026-05-21*
