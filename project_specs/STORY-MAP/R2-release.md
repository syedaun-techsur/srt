### R2: "Write Path + Complete Loop" — Phase 2 Completion

**Theme:** Add the POST endpoint and submission form with full client-side validation, completing the create-and-display loop. Both personas can now use the full application. The end-to-end journey — submit a request, see it in the list — is verified.

**PRD Phase:** Phase 2

**Stories in R2:**

| Story ID | Title | Persona | Epic | NaC Satisfied |
|----------|-------|---------|------|---------------|
| US-3.1 | Submit a Valid Request via API | PER-01 Marcus | Epic 3 (F3) | NaC-04, NaC-16, NaC-20 |
| US-3.2 | API Rejects Submission with Missing or Blank Fields | PER-02 Dana | Epic 3 (F3) | NaC-21 |
| US-3.3 | API Rejects Malformed Request Body | PER-02 Dana | Epic 3 (F3) | NaC-22 |
| US-5.1 | Submit a Request Through the Web Form | PER-01 Marcus | Epic 5 (F5) | NaC-02, NaC-05 |
| US-5.2 | Form Shows Inline Errors for Blank Required Fields | PER-01 Marcus | Epic 5 (F5) | NaC-10, NaC-11, NaC-12, NaC-21 |
| US-5.3 | Submit Button Is Disabled During API Call | PER-01 Marcus | Epic 5 (F5) | NaC-03 |
| US-5.4 | Form Preserves Data and Shows Error on API Failure | PER-01 Marcus | Epic 5 (F5) | NaC-09 |
| US-6.2 | Verify Submitted Request Appears in List Immediately | PER-01 Marcus | Epic 6 (F6) | NaC-06 |

**Story count:** 8  
**Personas served:** PER-01 Marcus (primary, 6 stories), PER-02 Dana (secondary, 2 stories — API validation)

**JTBD addressed in R2 (completing R1 partial coverage):**

| JTBD-ID | R1 Status | R2 Completion |
|---------|----------|---------------|
| JTBD-01.1 | Partial | **Full** — form fields, tab order, submit flow all ship |
| JTBD-01.2 | Partial | **Full** — form clear on 201, redirect to list, new entry visible |
| JTBD-01.3 | None | **Full** — inline errors before API call, 200ms, zero network requests |
| JTBD-02.1 | Partial | **Full** — POST loop verified; full create-and-display confirmed |
| JTBD-02.2 | Partial | **Full** — POST 201, OPTIONS preflight, blank-submit zero-call all verified |
| JTBD-02.3 | Full | Maintained — no regressions |

**Journeys completed by R2:**

- **JRN-01.1 (full):** Arrive → Orient → Fill → Submit → Confirm — all 5 stages operational
- **JRN-01.2 (full):** Blank submit → errors → correct → re-submit → confirm
- **JRN-01.3 (full):** Navigate → load list → identify own entry → done
- **JRN-02.1 (full):** Clone → start backend → start frontend → submit test → verify list → confirm zero config
- **JRN-02.2 (full):** DevTools inspection across GET, POST, blank-form, and summary stages
- **JRN-02.3:** No additional stages; already complete in R1

**R2 exit condition:** A first-time user can fill the 3-field form and submit in under 60 seconds; the submitted request appears in the list immediately; blank-form submit shows inline errors with zero API calls; POST returns 201 with full entity; GET returns all records; no CORS errors anywhere; clean DevTools session confirms the full loop.

---
