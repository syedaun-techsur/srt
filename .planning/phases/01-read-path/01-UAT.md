---
status: complete
phase: 01-read-path
source: 01-01-SUMMARY.md, 01-02-SUMMARY.md
started: 2026-05-20T00:00:00Z
updated: 2026-05-20T00:10:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Backend starts and GET /api/requests responds
expected: Run `cd srt-backend && ./mvnw spring-boot:run`. Server starts on port 8080 with no errors. Visiting http://localhost:8080/api/requests returns `[]` (empty JSON array) with HTTP 200.
result: pass

### 2. Frontend starts with no errors
expected: Run `cd srt-frontend && npm run dev`. Dev server starts on port 5173 with no terminal errors. Opening http://localhost:5173 in the browser shows the app with no console CORS errors (with both backend and frontend running).
result: pass

### 3. Request List empty state
expected: With both services running and no data in the database, the Request List view shows the text "No requests submitted yet." instead of a table.
result: pass

### 4. Request List table view
expected: After inserting a record (e.g., via H2 console at http://localhost:8080/h2-console or curl POST later), the Request List shows a table with columns: Name, Request Title, Description — and the inserted record appears in the table.
result: pass

### 5. Error state when backend is unreachable
expected: With the backend stopped (or not started), opening http://localhost:5173 shows an error message such as "Failed to load requests. Please try again." — the app does not crash or show a blank screen.
result: pass

### 6. App navigation buttons
expected: Both "Submit Request" and "View Requests" navigation buttons are visible on every screen. Clicking "View Requests" shows the request list view. Clicking "Submit Request" switches to the form placeholder view.
result: pass

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
