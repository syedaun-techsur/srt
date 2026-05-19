---

## Flow-03: Zero-Setup Developer Validation

**Persona:** PER-02 Dana Park (Internal Stakeholder / Developer)
**Trigger:** Dana clones the repo and validates the full create-display loop
**Journey:** JRN-02.1, JRN-02.2
**User Stories:** US-0.1–US-0.3, US-1.1–US-1.3, US-6.1, US-6.4, US-6.5

> Note: This flow covers Dana's interaction with the running UI after the backend and frontend are started. Backend startup and DevTools inspection are developer-environment workflows, not UI flows — they are documented here for completeness but have no screen wireframes.

```
[Terminal 1: ./mvnw spring-boot:run → Backend up on :8080]
        │
[Terminal 2: npm run dev → Frontend up on :5173]
        │
        ▼
[Browser opens http://localhost:5173]
        │
        ▼
[SubmissionForm renders — Dana inspects: 3 fields, Submit button]
        │
        ▼
[Dana opens DevTools > Network panel]
        │
        ▼
[Dana clicks "View Requests" nav link]
        │
        ▼
[RequestList mounts → GET /api/requests fires]
        │
        ├── DevTools: GET 200, JSON array ([] or populated), CORS headers present ✓
        │
        ▼
[Dana navigates back to Submit form]
        │
        ▼
[Dana fills form with test data; clicks Submit]
        │
        ▼
[DevTools: OPTIONS preflight passes; POST fires; 201 response with full entity body]
        │
        ▼
[Form resets → redirect to List View]
        │
        ▼
[List shows test entry — full loop verified]
        │
        ▼
[Dana goes back to form; clicks Submit with all blank fields]
        │
        ▼
[DevTools: ZERO network requests logged — client-side validation gate confirmed]
        │
        ▼
[Dana reviews console: zero errors, zero CORS warnings ✓]
```

**Steps:**

1. **Start services:** Two commands from a fresh clone — `./mvnw spring-boot:run` and `npm run dev`. No config changes.
2. **Initial load:** App opens on `SubmissionForm`. Dana notes the clean, minimal layout with three labeled fields.
3. **Inspect GET:** Navigate to "View Requests". DevTools shows `GET /api/requests` returning `200 OK` with `[]` (empty array on fresh start). `Access-Control-Allow-Origin: http://localhost:5173` header is present.
4. **Submit test request:** Fill form with dummy data. Submit. DevTools shows `OPTIONS` preflight (no CORS error), then `POST /api/requests` returning `201 Created` with `{id, name, title, description, createdAt}` in the response body. Form clears.
5. **Verify list:** List view auto-loads. Test entry is in the table. `GET /api/requests` returns `200 OK` with the array.
6. **Validate blank-form gate:** Return to form. Click Submit with all fields blank. DevTools: zero network requests logged.
7. **Review console:** Zero errors, zero CORS warnings, zero deprecation notices.

**Entry Point:** Fresh clone → two startup commands → browser
**Exit Points:** Dana confirms zero-config loop is complete ✓
