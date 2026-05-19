# JTBD: Simple Request Tracker (SRT)

**Document ID:** JTBD-SRT  
**Version:** 1.0  
**Date:** 2026-05-19  
**Status:** Active  
**Related Personas:** PERSONAS-SRT v1.0 (PER-01 Marcus Webb, PER-02 Dana Park)  
**Related PRD:** PRD-SRT v1.0  
**Derived From:** PERSONAS-SRT goals, pain points, top tasks; PRD-SRT features F0–F6 and success metrics

---

## JTBD Summary

| JTBD-ID | Persona | Job Statement (abbreviated) | Priority |
|---------|---------|----------------------------|----------|
| JTBD-01.1 | PER-01 Marcus Webb | Submit a request without hesitation or re-work | P0 |
| JTBD-01.2 | PER-01 Marcus Webb | Confirm my submission actually saved before leaving | P0 |
| JTBD-01.3 | PER-01 Marcus Webb | Understand which fields are required before I start typing | P0 |
| JTBD-02.1 | PER-02 Dana Park | Validate the full create-and-display loop from a fresh clone | P0 |
| JTBD-02.2 | PER-02 Dana Park | Confirm CORS and API connectivity without manual configuration | P0 |
| JTBD-02.3 | PER-02 Dana Park | Use SRT as a reference scaffold for real full-stack projects | P0 |

---

## PER-01: Marcus Webb — Business Requester

### JTBD-01.1: Frictionless Request Submission

**Job Statement:**
When I need to submit a request through the application, I want to fill in a clear, minimal form and hit Submit in one uninterrupted pass, so I can complete the task in under 60 seconds without needing to ask for help or re-read instructions.

**Current Alternatives:**
- Sends requests via email with inconsistent fields, leading to back-and-forth clarifications
- Uses shared spreadsheets that require knowing the correct tab and column format
- Asks a colleague to submit on their behalf because the form is too confusing

**Hiring Criteria:**
- Three clearly labeled fields (Name, Request Title, Description) with no extraneous options
- Form layout is vertical and scannable — no sidebars, tabs, or multi-step flows
- Submit button is visible and clearly labeled at the bottom of the form
- No login, setup, or configuration required to access the form

**Success Measure:** A first-time user with no documentation can complete and submit a valid form within 60 seconds of opening the page.

**Related Features:** F5, F1  
**Priority:** P0

---

### JTBD-01.2: Unambiguous Submission Confirmation

**Job Statement:**
When I click Submit, I want to receive clear, immediate feedback that my request was accepted and saved, so I can move on with confidence and not wonder whether I need to try again.

**Current Alternatives:**
- Refreshes the page and looks for their entry in a list — uncertain if it worked
- Waits for an email reply to know if the submission was received
- Submits the same request twice "just to be safe" because no confirmation appeared

**Hiring Criteria:**
- Form resets or the user is redirected to the list view immediately after a successful submission
- No intermediate "pending" or ambiguous state after clicking Submit
- If submission fails (e.g., network error), an error message is shown — not silence
- The submitted request is visible in the list view within the same browser session

**Success Measure:** After a successful submission, the user sees either a cleared form or their request in the list view within 3 seconds — with zero ambiguous in-between states.

**Related Features:** F5, F3, F6  
**Priority:** P0

---

### JTBD-01.3: Upfront Required-Field Clarity

**Job Statement:**
When I look at the form before typing anything, I want to understand which fields are required and what will happen if I skip one, so I can fill the form correctly on the first attempt without encountering surprise errors mid-submission.

**Current Alternatives:**
- Submits the form blank and reads the resulting error page to learn what was required
- Looks for asterisks or "(required)" labels and guesses the rest
- Abandons the form when validation errors appear after submission with no clear guidance

**Hiring Criteria:**
- Required-field indicators are visible before the user attempts to submit
- Inline error messages appear immediately on submit if any required field is blank
- Error messages identify the specific field that failed — not a generic "form is invalid"
- No API call is made when required fields are empty (client-side validation fires first)

**Success Measure:** A blank-form submission triggers inline field-level error messages within 200ms and makes zero network requests to the backend.

**Related Features:** F5  
**Priority:** P0

---

## PER-02: Dana Park — Internal Stakeholder / Developer

### JTBD-02.1: End-to-End Loop Validation from Zero

**Job Statement:**
When I clone the SRT repository on a machine with only JDK 17+ and Node.js installed, I want to run two startup commands and immediately see a submitted request appear in the list view, so I can confirm the full create-and-display pipeline works without any manual environment setup.

**Current Alternatives:**
- Uses heavily configured demo projects requiring Docker Compose, Postgres setup, or environment variables — fails in client demo environments
- Relies on locally cached databases or pre-seeded data that don't reproduce on other machines
- Builds skeleton apps from scratch each time to avoid brittle demo dependencies

**Hiring Criteria:**
- `./mvnw spring-boot:run` starts the backend with H2 auto-configured in under 30 seconds
- `npm run dev` starts the Vite frontend with no additional configuration
- Submitting a request via the form causes it to appear in the list view with no manual reload
- The full loop works identically on any machine with JDK 17+ and Node.js — no other prerequisites
- Both services can run simultaneously on their default ports without port conflicts

**Success Measure:** From `git clone` to a verified create-and-display loop in under 5 minutes, with zero commands beyond `npm run dev` and `./mvnw spring-boot:run`.

**Related Features:** F0, F1, F2, F3, F4, F5, F6  
**Priority:** P0

---

### JTBD-02.2: CORS and API Connectivity Verification

**Job Statement:**
When I open the browser developer tools while using SRT, I want to see zero CORS errors and correct HTTP responses from the backend, so I can confirm that frontend-to-backend connectivity is properly configured and use this pattern as a verified reference.

**Current Alternatives:**
- Manually adds CORS headers to each controller method — error-prone and easy to miss
- Uses a browser extension to suppress CORS errors during demos — hides the real issue
- Configures a Vite proxy to avoid CORS entirely — valid workaround but doesn't validate Spring Boot CORS config
- Debugs CORS failures live during a presentation, which undermines confidence in the demo

**Hiring Criteria:**
- Spring Boot CORS configuration explicitly allows requests from `http://localhost:5173`
- `POST /api/requests` returns `201 Created` with the saved entity in the response body
- `GET /api/requests` returns `200 OK` with a JSON array (empty array `[]` when no records exist)
- `POST /api/requests` returns `400 Bad Request` when any required field is missing
- No browser console CORS errors when the frontend calls any backend endpoint

**Success Measure:** Browser dev tools show zero CORS errors across all API calls, `POST /api/requests` returns `201` with a valid body, and `GET /api/requests` returns `200` with a JSON array — all verifiable without any backend configuration changes.

**Related Features:** F0, F3, F4, F1  
**Priority:** P0

---

### JTBD-02.3: Reference Scaffold for Full-Stack Projects

**Job Statement:**
When I need to bootstrap a new full-stack project with a React frontend and Spring Boot backend, I want to consult SRT as a working, understandable reference implementation, so I can replicate its architecture, CORS setup, JPA data model, and Vite configuration without reverse-engineering a complex codebase.

**Current Alternatives:**
- Starts from Spring Initializr and Vite scaffolds separately, then manually wires CORS, JPA, and fetch — time-consuming and inconsistency-prone
- Copies from a previous project that may have accumulated technical debt or outdated patterns
- References documentation that describes concepts but provides no running, testable example

**Hiring Criteria:**
- Data model follows a clear JPA entity pattern (`id`, `name`, `title`, `description`, `created_at`) — directly replicable
- CORS is configured via a dedicated Spring Boot configuration class (not per-controller annotations) — extractable
- Frontend fetch calls follow a consistent pattern to the backend API — readable and copyable
- The entire codebase is understandable at a glance — no framework abstractions that obscure the pattern
- Hibernate DDL auto-creates the schema from the entity — no manual SQL migration required

**Success Measure:** A developer can identify the CORS configuration, JPA entity definition, and frontend API call pattern in under 10 minutes of reading the source code with no prior project context.

**Related Features:** F0, F1, F2, F4  
**Priority:** P0

---

## Outcome-to-Feature Traceability

| JTBD-ID | Related Feature(s) | Expected Outcome |
|---------|-------------------|-----------------|
| JTBD-01.1 | F5, F1 | User completes and submits a valid form in under 60 seconds with no instructions |
| JTBD-01.2 | F5, F3, F6 | Successful submission results in form reset or redirect to list view within 3 seconds |
| JTBD-01.3 | F5 | Blank-form submit fires inline field errors within 200ms; zero API calls made |
| JTBD-02.1 | F0, F1, F2, F3, F4, F5, F6 | Full create-and-display loop verified from fresh clone in under 5 minutes |
| JTBD-02.2 | F0, F3, F4, F1 | Zero CORS errors; `POST` returns 201, `GET` returns 200 with JSON array |
| JTBD-02.3 | F0, F1, F2, F4 | CORS config, JPA entity, and API fetch pattern identified in under 10 minutes |

---

## NaC Preview

| JTBD-ID | Outcome | Candidate Natural Acceptance Criterion |
|---------|---------|---------------------------------------|
| JTBD-01.1 | Submit valid form in under 60 seconds | Given a new user opens the form, when they fill all three fields and click Submit, then the request is accepted and the form responds within 3 seconds |
| JTBD-01.2 | Unambiguous post-submit state | Given a successful form submission, when the API returns 201, then the form either clears all fields or the user is redirected to the list view — no intermediate state persists |
| JTBD-01.3 | Inline errors before API call | Given the form has one or more blank required fields, when the user clicks Submit, then inline error messages appear on each blank field and zero network requests are made |
| JTBD-02.1 | Full loop from fresh clone | Given only JDK 17+ and Node.js are installed, when both services start with their standard commands, then a submitted form entry appears in the list view with no manual configuration |
| JTBD-02.2 | Zero CORS errors, correct HTTP codes | Given the frontend calls `POST /api/requests` and `GET /api/requests`, when inspecting browser dev tools, then no CORS errors appear and responses are 201/200 respectively |
| JTBD-02.3 | Architecture readable at a glance | Given a developer opens the SRT codebase, when they search for CORS config, JPA entity, and API fetch calls, then all three are located within 10 minutes of unaided source reading |

---

*Generated by Pivota Spec JTBD Generator | Project: SRT | 2026-05-19*
