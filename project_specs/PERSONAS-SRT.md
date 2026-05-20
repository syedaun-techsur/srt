# PERSONAS: Simple Request Tracker (SRT)

**Document ID:** PERSONAS-SRT  
**Version:** 1.0  
**Date:** 2026-05-19  
**Status:** Active  
**Related PRD:** PRD-SRT v1.0  
**Derived From:** PRD-SRT Section 4 (Target Users), Section 2 (Problem Statement), Section 6 (Feature Requirements), Section 9 (Success Metrics)

---

## Persona Summary

| PER-ID | Name | Role | Primary Goal |
|--------|------|------|--------------|
| PER-01 | Marcus Webb | Business Requester | Submit a request quickly through a clear, no-friction form |
| PER-02 | Dana Park | Internal Stakeholder / Developer | Read all submitted requests at a glance; verify the demo pipeline works end-to-end |

---

## PER-01: Marcus Webb

**Role Title:** Business Requester

**Role & Context:**
Marcus is a non-technical or semi-technical business user — a project coordinator, operations staff member, or end-user representative — who uses the SRT form to submit named requests on behalf of himself or others. He accesses the application through a standard web browser, typically on a desktop or laptop. Marcus does not know how the backend works and does not care; he expects the form to behave like any familiar web form he has encountered. His interaction with SRT is brief and transactional: fill in the fields, hit Submit, and move on. If anything is unclear or the form does not respond predictably, he loses confidence in the tool immediately.

**Goals:**
- Submit a request in under 60 seconds without needing instructions (F5)
- Receive immediate, unambiguous confirmation that the request was accepted (F5, F3)
- Understand exactly which fields are required before attempting to submit (F5)
- See the submitted request appear in the list, confirming it was saved (F6, F4)

**Pain Points:**
- Forms with unclear required-field indicators waste time and cause re-submission frustration
- Ambiguous post-submit states (no confirmation, no redirect) leave users unsure whether the action succeeded
- Complex setup requirements or error-prone environments mean the demo fails at the moment it matters most
- Too many fields, options, or steps create unnecessary cognitive load for a simple submission task

**Technical Expertise:** Basic to Intermediate — comfortable with web browsers and standard web forms; does not interact with APIs, terminals, or developer tooling

**Top Tasks:**
1. Fill in Name, Request Title, and Description fields and submit the form (every session, critical)
2. Confirm the submission succeeded via form reset, redirect, or visual feedback (every session, critical)
3. Navigate to the list view to verify the submitted request appears (occasional, high)

**Success Criteria:**
- Can complete a full form submission without referring to any documentation
- Inline validation errors appear immediately when a required field is left blank, before any API call is made
- After successful submission, the user is navigated to the Request List view — no ambiguous "did it work?" state
- The submitted request is visible in the list view within the same session

---

## PER-02: Dana Park

**Role Title:** Internal Stakeholder / Developer

**Role & Context:**
Dana is a developer, tech lead, or technical stakeholder who uses SRT either as a reference application to validate delivery pipeline patterns or as a viewer of all submitted requests. In her viewer role, she opens the list screen to read submitted entries in a clear, readable table — no filters, no pagination, no complexity. In her developer role, she clones the repository, runs the two startup commands, and verifies the end-to-end stack is working: CORS passes, the H2 database persists a record through the JPA layer, the React frontend renders the result. She values reproducibility above all else: the app should work identically from a fresh clone on any machine with JDK 17+ and Node.js installed. She is sensitive to anything that requires manual environment configuration, because that defeats the purpose of the demo.

**Goals:**
- Validate that the complete create-and-display loop works with zero environment configuration (F0, F1, F2, F3, F4, F5, F6)
- Read all submitted requests in a clean, full-width table without pagination or filter overhead (F6, F4)
- Confirm CORS is correctly configured so the frontend can reach the backend without browser errors (F0, F1)
- Use SRT as a reference pattern for scaffolding similar full-stack projects (F0, F1, F2)
- Verify required-field validation works and makes no spurious API calls on a blank submit (F5, F3)

**Pain Points:**
- Demo applications with hidden external dependencies (Docker, database servers, auth services) fail exactly when they need to be shown
- Demos that are too trivial (static HTML, no real data flow) do not validate anything meaningful about a delivery pipeline
- CORS misconfiguration is a common, high-visibility failure that blocks frontend-to-backend connectivity and is hard to debug under pressure
- Inconsistent startup commands or undocumented port configurations waste setup time
- List views with complex filtering or pagination are harder to verify at a glance and add unnecessary scope risk

**Technical Expertise:** Advanced — daily use of IDEs, terminals, REST clients (curl, Postman), Spring Boot, React/Vite, JPA; comfortable reading source code and application logs

**Top Tasks:**
1. Clone the repository and start both services using standard commands (`npm run dev` / `./mvnw spring-boot:run`) to validate zero-setup reproducibility (initial session, critical)
2. Open the list view and confirm all submitted requests render correctly in the full-width table (each review session, critical)
3. Submit a test request via the form and verify it immediately appears in the list, confirming the end-to-end loop (validation session, high)
4. Inspect browser dev tools or server logs to confirm CORS headers are present and no cross-origin errors occur (initial session, high)
5. Submit a blank form and confirm inline validation errors fire before any network call is made (QA session, medium)

**Success Criteria:**
- Both services start successfully within 30 seconds on a machine with only JDK 17+ and Node.js installed
- `GET /api/requests` returns a JSON array and `POST /api/requests` returns `201 Created` with no manual database configuration
- The list view shows all records with Name, Request Title, and Description columns; an empty-state message appears when no records exist
- No CORS errors in the browser console when the frontend calls the backend
- Blank form submission triggers inline field errors and sends zero API requests

---

## Persona Relationships

| Interaction | PER-01 Marcus (Requester) | PER-02 Dana (Stakeholder/Dev) |
|-------------|--------------------------|-------------------------------|
| **Creates data** | Submits requests via the form | Submits test requests to validate the pipeline |
| **Consumes data** | Checks list view to confirm own submission | Reviews all submissions; validates list view rendering |
| **Cares about** | Simplicity, clarity, confirmation feedback | Reproducibility, CORS correctness, zero-setup startup |
| **Tolerates** | Data loss on restart (not primary concern) | Data loss on restart (expected, by design — H2 in-memory) |
| **Does not care about** | Tech stack, API structure, logs | Form aesthetics beyond functional clarity |

Both personas operate independently — Marcus does not need Dana's approval to submit, and Dana reads submissions Marcus creates. Their workflows intersect at the list view, which must satisfy both: simple enough for Marcus to verify his submission, complete enough for Dana to validate the full data loop.

---

## Feature-Persona Matrix

| Feature ID | Feature Name | PER-01 Marcus (Requester) | PER-02 Dana (Stakeholder/Dev) |
|------------|-------------|--------------------------|-------------------------------|
| F0 | Spring Boot Backend Scaffold | None | **Primary** |
| F1 | React Frontend Scaffold | None | **Primary** |
| F2 | Request Data Model & Persistence | None | **Primary** |
| F3 | POST Endpoint — Submit Request | **Secondary** (benefits from it; doesn't configure it) | **Primary** |
| F4 | GET Endpoint — List All Requests | **Secondary** (list view depends on it) | **Primary** |
| F5 | Request Submission Form | **Primary** | **Secondary** (validates it works) |
| F6 | Request List View | **Secondary** (confirms submission) | **Primary** |

**Legend:**
- **Primary** — Core to this persona's goals; failure directly blocks their workflow
- **Secondary** — Persona benefits from or interacts with this feature, but it is not their direct responsibility
- None — Feature operates below this persona's interaction layer

---

*Generated by Pivota Spec Personas Generator | Project: SRT | 2026-05-19*
