## NaC Derivation Table

Full traceability chain: **JTBD Outcome → Journey Stage → NaC Statement → Story**

Each NaC is derived from the intersection of a JTBD outcome and a specific journey stage. The NaC text is the testable criterion that proves the JTBD outcome is satisfied in that context.

| NaC-ID | JTBD-ID | JTBD Outcome (abbreviated) | Journey Stage | NaC Statement | Story |
|--------|---------|---------------------------|--------------|---------------|-------|
| NaC-01 | JTBD-01.1 | Submit valid form in < 60s | JRN-01.1: Arrive | Navigation controls visible on page load; user reaches form in one click | US-1.2 |
| NaC-02 | JTBD-01.1 | Submit valid form in < 60s | JRN-01.1: Orient | Three labeled fields in single vertical stack before user types; required intent clear at a glance | US-5.1 |
| NaC-03 | JTBD-01.1 | Submit valid form in < 60s | JRN-01.1: Fill | Submit button disabled immediately on valid submit click; double-submission physically prevented | US-5.3 |
| NaC-04 | JTBD-01.1 | Submit valid form in < 60s | JRN-01.2: Re-submit | Valid second submit after correcting errors succeeds; POST /api/requests called exactly once | US-3.1 |
| NaC-05 | JTBD-01.2 | Unambiguous post-submit state within 3s | JRN-01.1: Submit | POST /api/requests called; form clears and/or user redirected within 3 seconds of 201 response | US-5.1 |
| NaC-06 | JTBD-01.2 | Unambiguous post-submit state within 3s | JRN-01.1: Confirm | Submitted request visible in list table within same session; no manual reload required | US-6.2 |
| NaC-07 | JTBD-01.2 | Unambiguous post-submit state within 3s | JRN-01.3: Navigate | Navigation from form to list is visible and immediate; no URL typing required | US-1.2 |
| NaC-08 | JTBD-01.2 | Unambiguous post-submit state within 3s | JRN-01.3: Load list | Visible loading indicator appears while GET is in flight; clears when data arrives | US-6.5 |
| NaC-09 | JTBD-01.2 | Unambiguous post-submit state within 3s | JRN-01.2: Confirm | On API failure, entered data preserved; clear error message shown; user can retry | US-5.4 |
| NaC-10 | JTBD-01.3 | Inline errors before API call (< 200ms) | JRN-01.2: Arrive & skip reading | Blank Submit fires three field-level error messages within 200ms; zero network requests made | US-5.2 |
| NaC-11 | JTBD-01.3 | Inline errors before API call (< 200ms) | JRN-01.2: See errors | Each error message identifies the specific blank field by name; shown directly below the input | US-5.2 |
| NaC-12 | JTBD-01.3 | Inline errors before API call (< 200ms) | JRN-01.2: Correct | Error under each field clears as soon as that field has a non-blank value | US-5.2 |
| NaC-13 | JTBD-02.1 | Full loop from fresh clone in < 5 min | JRN-02.1: Clone | Repo clones cleanly; Maven wrapper is committed; .gitignore excludes target/ and node_modules/ | US-0.1 |
| NaC-14 | JTBD-02.1 | Full loop from fresh clone in < 5 min | JRN-02.1: Start backend | `./mvnw spring-boot:run` starts in under 30s on JDK 17+; no external services required | US-0.1 |
| NaC-15 | JTBD-02.1 | Full loop from fresh clone in < 5 min | JRN-02.1: Start frontend | `npm install && npm run dev` starts Vite on port 5173 with no additional config | US-1.1 |
| NaC-16 | JTBD-02.1 | Full loop from fresh clone in < 5 min | JRN-02.1: Submit test request | POST /api/requests returns 201; form clears; no CORS error during test submit | US-3.1 |
| NaC-17 | JTBD-02.1 | Full loop from fresh clone in < 5 min | JRN-02.1: Verify list | GET /api/requests returns submitted entry; list updates without manual reload | US-6.1 |
| NaC-18 | JTBD-02.1 | Full loop from fresh clone in < 5 min | JRN-02.1: Confirm zero config | requests table auto-created from JPA entity on startup; no SQL migration file present | US-2.1 |
| NaC-19 | JTBD-02.2 | Zero CORS errors; correct HTTP codes | JRN-02.2: Inspect GET on list load | Access-Control-Allow-Origin: http://localhost:5173 in GET response; 200 with JSON array or [] | US-0.3, US-4.2 |
| NaC-20 | JTBD-02.2 | Zero CORS errors; correct HTTP codes | JRN-02.2: Inspect POST on submit | POST returns 201 with full entity body; OPTIONS preflight passes; no CORS error in console | US-0.3, US-3.1 |
| NaC-21 | JTBD-02.2 | Zero CORS errors; correct HTTP codes | JRN-02.2: Inspect blank-form validation | Zero network requests logged on blank-form submit; client-side guard fires before any fetch | US-5.2, US-3.2 |
| NaC-22 | JTBD-02.2 | Zero CORS errors; correct HTTP codes | JRN-02.2: Summarize | Zero console errors or warnings across full session; all status codes correct | US-6.4, US-3.3 |
| NaC-23 | JTBD-02.3 | Architecture readable at a glance | JRN-02.3: Navigate source structure | Standard Maven layout; dedicated frontend/ directory; no unusual nesting | US-0.1, US-1.1 |
| NaC-24 | JTBD-02.3 | Architecture readable at a glance | JRN-02.3: Find CORS config | Single @Configuration class for CORS; no per-controller annotations; locatable in < 2 min | US-0.3 |
| NaC-25 | JTBD-02.3 | Architecture readable at a glance | JRN-02.3: Find JPA entity | Plain JPA entity with 5 fields; @PrePersist for created_at; no extra annotation processors | US-2.2 |
| NaC-26 | JTBD-02.3 | Architecture readable at a glance | JRN-02.3: Find frontend fetch calls | API_BASE_URL in single constants file; plain fetch + async/await in form and list components | US-1.3 |

---
