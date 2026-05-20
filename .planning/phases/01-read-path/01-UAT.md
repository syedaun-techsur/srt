---
status: complete
phase: 01-read-path
source: 01-01-SUMMARY.md, 01-02-SUMMARY.md
started: 2026-05-20T17:00:00Z
updated: 2026-05-20T17:10:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Backend Starts on Port 8080
expected: Running `./mvnw spring-boot:run` from the srt-backend directory starts the Spring Boot backend on port 8080 with no errors. The application prints "Started SrtApplication" (or similar) in the logs and stays running.
result: pass

### 2. GET /api/requests Returns Empty Array
expected: With the backend running, calling `GET http://localhost:8080/api/requests` returns `200 OK` with a JSON response of `[]` (empty array).
result: pass

### 3. CORS Allows Frontend Origin
expected: An OPTIONS preflight request to `http://localhost:8080/api/requests` with `Origin: http://localhost:5173` returns a 200 response with the `Access-Control-Allow-Origin: http://localhost:5173` header present.
result: pass

### 4. H2 Console Accessible
expected: Navigating to `http://localhost:8080/h2-console` in a browser shows the H2 database console login page — not a 404, error, or blank page.
result: pass

### 5. Frontend Starts on Port 5173
expected: Running `npm run dev` from the srt-frontend directory starts the Vite dev server on port 5173 with no errors. The terminal shows a local URL like `http://localhost:5173`.
result: pass

### 6. Request List View Loads
expected: Opening `http://localhost:5173` in a browser shows the app shell with navigation buttons ("Submit Request" and "View Requests"). The app loads without crashing or showing blank content.
result: pass

### 7. Empty State Displayed
expected: With the backend running and no records in the database, the Request List view shows the message "No requests submitted yet." instead of a table or an error.
result: pass

### 8. Request Table Shows Correct Columns
expected: When there are records in the database, the Request List view displays a table with columns: Name, Request Title, and Description.
result: pass

### 9. Error State When Backend Unreachable
expected: With the backend stopped, clicking "View Requests" (or with it as the active view) shows an error message instead of crashing or showing a blank page.
result: pass

### 10. Loading State Visible
expected: While the Request List is fetching data, a loading indicator or "Loading..." message is briefly visible before the table or empty state appears.
result: pass

## Summary

total: 10
passed: 10
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
