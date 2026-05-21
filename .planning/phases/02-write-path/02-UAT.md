---
status: complete
phase: 02-write-path
source: 02-01-SUMMARY.md, 02-02-SUMMARY.md
started: 2026-05-21T23:00:00Z
updated: 2026-05-21T23:05:00Z
---

## Current Test

[testing complete]

## Tests

### 1. POST /api/requests Returns 201 with Full Record
expected: With the backend running, send a POST to `http://localhost:8080/api/requests` with JSON body `{"name":"Alice","title":"Fix login","description":"Login page broken"}`. The response is `201 Created` with a JSON body that includes `id` (server-assigned integer), `name`, `title`, `description`, and `createdAt` timestamp.
result: pass

### 2. POST /api/requests Returns 400 on Blank Fields
expected: Sending a POST to `http://localhost:8080/api/requests` with one or more blank/missing fields (e.g. `{"name":"","title":"Fix login","description":"..."}`) returns `400 Bad Request`.
result: pass

### 3. Submission Form Renders Correctly
expected: Opening the app at `http://localhost:5173` and clicking "Submit Request" shows a form with three fields: Name, Request Title, and Description, plus a Submit button.
result: pass

### 4. Inline Validation on Blank Submission
expected: Clicking Submit with one or more blank fields shows inline validation error messages beneath those fields. No API call is made (the list does not update).
result: pass

### 5. Successful Submission Navigates to List
expected: Filling in all three fields and clicking Submit sends the POST to the backend. On success (201), the app navigates to the Request List view where the new entry is immediately visible in the table.
result: pass

### 6. API Error Preserves Field Values
expected: If the API call fails (e.g. backend is unreachable), the form shows a form-level error message (alert/banner) and all previously entered field values are still present in the form — nothing is lost.
result: pass

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
