---
status: complete
phase: 02-write-path
source: [02-01-SUMMARY.md, 02-02-SUMMARY.md]
started: 2026-05-21T20:45:00.000Z
updated: 2026-05-21T20:50:00.000Z
---

## Current Test

[testing complete]

## Tests

### 1. POST /api/requests — valid submission returns 201
expected: Start the backend (`cd srt-backend && ./mvnw spring-boot:run`). Send a POST to http://localhost:8080/api/requests with JSON body {"name":"Alice","title":"Test request","description":"Some details"}. The response is 201 Created and the body includes an `id` (number) and `createdAt` (timestamp).
result: pass

### 2. POST /api/requests — blank field returns 400
expected: Send a POST to http://localhost:8080/api/requests with a blank field, e.g. {"name":"","title":"Test","description":"Details"}. The response is 400 Bad Request with a JSON body containing an "error" and "message" field.
result: pass

### 3. GET /api/requests still works
expected: Send GET http://localhost:8080/api/requests. The response is 200 OK and returns a JSON array (may be empty or contain previously submitted records). No regression from Phase 1.
result: pass

### 4. Submission Form renders in browser
expected: Start both services (`./mvnw spring-boot:run` + `npm run dev`). Open http://localhost:5173 in a browser. A "Submit Request" link or button navigates to a form with three fields: Name, Request Title, and Description, plus a Submit button.
result: pass

### 5. Form validates blank fields without calling the API
expected: Leave one or more fields blank and click Submit. An inline validation error appears next to each blank field. No network request is made to the backend.
result: pass

### 6. Successful form submission navigates to Request List
expected: Fill in all three fields and click Submit. The form posts to the backend and, on success, the view switches to the Request List where the new entry is immediately visible in the table.
result: pass

### 7. API failure preserves form values and shows error
expected: With the backend stopped (or unreachable), fill in all fields and click Submit. The form shows a message like "Submission failed. Please try again." All entered field values remain in the form inputs.
result: pass

## Summary

total: 7
passed: 7
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
