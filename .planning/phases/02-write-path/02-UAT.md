---
status: complete
phase: 02-write-path
source: [02-01-SUMMARY.md, 02-02-SUMMARY.md]
started: 2026-05-20T03:10:00Z
updated: 2026-05-20T03:15:00Z
---

## Current Test

[testing complete]

## Tests

### 1. POST endpoint returns 201 with saved record
expected: Start the backend. Send a valid POST to http://localhost:8080/api/requests with name/title/description. Should return 201 Created with full record including server-assigned id and createdAt.
result: pass

### 2. POST endpoint rejects blank/null fields with 400
expected: Send a POST with one or more blank/null/whitespace-only fields. Should return 400 Bad Request with error body {"error":"Validation failed","message":"All fields (name, title, description) are required."}.
result: pass

### 3. Submission form renders with three input fields
expected: Three labeled input fields should be visible: Name, Request Title, and Description.
result: pass

### 4. Form shows per-field validation errors without calling API
expected: Submit the form with one or more blank fields. Inline validation error messages should appear under each blank field without any network request to the API.
result: pass

### 5. Successful submission navigates to Request List
expected: Fill all three fields with valid content and submit. The form should submit, and the view should switch to the Request List showing the newly created entry immediately.
result: pass

### 6. API error preserves field values and shows form-level error
expected: With the backend down or returning an error, submit the form with valid data. The form should show a form-level error message and preserves all entered field values.
result: pass

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
