## Release Planning

---

### R1: "Scaffold + Read" — Phase 1 Foundation

**Theme:** Stand up the complete technical stack, auto-provision the data model, and deliver a working read path (GET + list view). A developer can clone the repo, start both services, and see a functional (if empty) application with verified CORS and API connectivity.

**PRD Phase:** Phase 1

**Stories in R1:**

| Story ID | Title | Persona | Epic | NaC Satisfied |
|----------|-------|---------|------|---------------|
| US-0.1 | Start Backend with Zero Configuration | PER-02 Dana | Epic 0 (F0) | NaC-13, NaC-14, NaC-23 |
| US-0.2 | Access H2 Console for Database Inspection | PER-02 Dana | Epic 0 (F0) | NaC-13 (schema visibility) |
| US-0.3 | Backend Accepts CORS Requests from Frontend | PER-02 Dana | Epic 0 (F0) | NaC-19, NaC-20, NaC-24 |
| US-1.1 | Start Frontend Dev Server with Zero Configuration | PER-02 Dana | Epic 1 (F1) | NaC-15, NaC-23 |
| US-1.2 | Navigate Between Submission Form and Request List | PER-01 Marcus | Epic 1 (F1) | NaC-01, NaC-07 |
| US-1.3 | Backend Base URL Is Centrally Configured | PER-02 Dana | Epic 1 (F1) | NaC-26 |
| US-2.1 | Request Entity Is Persisted to H2 on Startup | PER-02 Dana | Epic 2 (F2) | NaC-18 |
| US-2.2 | Request Record Has Server-Assigned ID and Timestamp | PER-02 Dana | Epic 2 (F2) | NaC-25 |
| US-4.1 | Retrieve All Submitted Requests via API | PER-02 Dana | Epic 4 (F4) | NaC-17, NaC-19 |
| US-4.2 | GET Endpoint Returns Empty Array When No Requests Exist | PER-02 Dana | Epic 4 (F4) | NaC-19 |
| US-6.1 | View All Submitted Requests in a Table | PER-02 Dana | Epic 6 (F6) | NaC-17 |
| US-6.3 | List View Shows Empty State When No Requests Exist | PER-02 Dana | Epic 6 (F6) | NaC-18 (zero-config confirm) |
| US-6.4 | List View Handles Fetch Error Gracefully | PER-02 Dana | Epic 6 (F6) | NaC-22 |
| US-6.5 | List View Shows Loading State While Fetching | PER-01 Marcus | Epic 6 (F6) | NaC-08 |

**Story count:** 14  
**Personas served:** PER-02 Dana (primary, 12 stories), PER-01 Marcus (secondary, 2 stories — navigation + loading)

**JTBD addressed in R1:**

| JTBD-ID | Addressed? | Coverage Note |
|---------|-----------|---------------|
| JTBD-01.1 | Partial | Navigation (US-1.2) enables journey arrival; form not yet present |
| JTBD-01.2 | Partial | Loading state (US-6.5) and navigation (US-1.2) support list verification; form submit not yet present |
| JTBD-01.3 | None | Form + validation ships in R2 |
| JTBD-02.1 | Partial | Clone → start → GET loop verified; POST + form submit deferred to R2 |
| JTBD-02.2 | Partial | CORS verified on GET; POST CORS verified in R2 |
| JTBD-02.3 | Full | All scaffold readability patterns (CORS class, JPA entity, API URL constant) ship in R1 |

**Journeys enabled by R1:**

- **JRN-02.1 stages 1–3, 5–6:** Dana can clone, start both services, navigate to list, and confirm zero-config setup — minus the submit-test-request stage (Stage 4, R2)
- **JRN-02.2 stages 1–2:** Inspect GET on list load; CORS verified for GET
- **JRN-02.3 (full):** All source-reading stages complete
- **JRN-01.3 stages 1–2, 4:** Navigate to list, see loading state, done — entry won't exist until R2 adds form

**R1 exit condition:** Both services start with two commands; `GET /api/requests` returns 200 with `[]`; list view shows "No requests submitted yet."; CORS verified in browser DevTools; REQUESTS table visible in H2 console.

---
