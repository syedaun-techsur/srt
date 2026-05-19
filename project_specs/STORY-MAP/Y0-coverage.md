## Coverage Analysis

---

### Persona Coverage by Release

| Persona | R1 | R2 |
|---------|----|----|
| PER-01 Marcus Webb (Requester) | 2 stories (navigation + loading indicator) | 6 stories (form + submit + confirm) |
| PER-02 Dana Park (Stakeholder/Dev) | 12 stories (scaffold + read path) | 2 stories (API validation) |

**R1 persona balance:** Dana-heavy by design — Phase 1 is infrastructure and the read path, which only Dana validates. Marcus gets navigation (US-1.2) which enables his future journeys, and loading state (US-6.5) which provides UX feedback when the list is accessed.

**R2 persona balance:** Marcus-heavy by design — Phase 2 delivers the form and submit flow that Marcus requires to complete his primary journeys. Dana validates the POST endpoint behavior (US-3.2, US-3.3) as part of CORS/API correctness.

---

### JTBD Coverage by Release

| JTBD-ID | Job Statement (abbreviated) | R1 | R2 | Final Status |
|---------|---------------------------|----|----|-------------|
| JTBD-01.1 | Submit valid form in < 60s | Partial (navigation only) | Complete | ✅ Fully addressed |
| JTBD-01.2 | Unambiguous post-submit state | Partial (list read path) | Complete | ✅ Fully addressed |
| JTBD-01.3 | Inline errors before API call | None | Complete | ✅ Fully addressed |
| JTBD-02.1 | Full loop from fresh clone | Partial (scaffold + GET) | Complete | ✅ Fully addressed |
| JTBD-02.2 | Zero CORS errors; correct HTTP codes | Partial (GET CORS) | Complete | ✅ Fully addressed |
| JTBD-02.3 | Architecture readable at a glance | Complete | Maintained | ✅ Fully addressed |

All 6 JTBD outcomes are fully addressed across R1 + R2.

---

### Journey Stage Coverage

| Journey | Stage | R1 | R2 |
|---------|-------|----|----|
| JRN-01.1 | Arrive | ✅ US-1.2 | — |
| JRN-01.1 | Orient | — | ✅ US-5.1 |
| JRN-01.1 | Fill | — | ✅ US-5.3 |
| JRN-01.1 | Submit | — | ✅ US-5.1, US-3.1 |
| JRN-01.1 | Confirm | — | ✅ US-6.2 |
| JRN-01.2 | Arrive & skip reading | — | ✅ US-5.2 |
| JRN-01.2 | See errors | — | ✅ US-5.2 |
| JRN-01.2 | Correct | — | ✅ US-5.2 |
| JRN-01.2 | Re-submit | — | ✅ US-3.1 |
| JRN-01.2 | Confirm | — | ✅ US-5.4 |
| JRN-01.3 | Navigate | ✅ US-1.2 | — |
| JRN-01.3 | Load list | ✅ US-6.5 | — |
| JRN-01.3 | Identify entry | — | ✅ US-6.2 |
| JRN-01.3 | Done | — | — (no story needed — journey closes) |
| JRN-02.1 | Clone | ✅ US-0.1 | — |
| JRN-02.1 | Start backend | ✅ US-0.1, US-0.2, US-2.1 | — |
| JRN-02.1 | Start frontend | ✅ US-1.1 | — |
| JRN-02.1 | Submit test request | — | ✅ US-3.1, US-5.1 |
| JRN-02.1 | Verify list | ✅ US-4.1, US-6.1 | ✅ US-6.2 |
| JRN-02.1 | Confirm zero config | ✅ US-2.1, US-0.1, US-1.1 | — |
| JRN-02.2 | Open DevTools | ✅ US-1.1 | — |
| JRN-02.2 | Inspect GET on list load | ✅ US-0.3, US-4.2 | — |
| JRN-02.2 | Inspect POST on submit | — | ✅ US-0.3, US-3.1 |
| JRN-02.2 | Inspect blank-form validation | — | ✅ US-5.2, US-3.2 |
| JRN-02.2 | Summarize | ✅ US-6.4 | ✅ US-3.3 |
| JRN-02.3 | Navigate source structure | ✅ US-0.1, US-1.1 | — |
| JRN-02.3 | Find CORS config | ✅ US-0.3 | — |
| JRN-02.3 | Find JPA entity | ✅ US-2.2 | — |
| JRN-02.3 | Find frontend fetch calls | ✅ US-1.3 | — |

**Coverage result:** All 29 journey stages map to at least one story. No uncovered stages.

---

### Gap Analysis

**Journey stages with no mapped stories:**
- JRN-01.3: "Done" — No story required. This is the journey closure moment (user closes the tab). No software behavior is expected here. ✅ Intentional non-coverage.

**JTBD outcomes with no derived NaC:**
- None. All 6 JTBD outcomes have at least one NaC derived and at least one covering story. ✅

**Orphan stories (not mapped to any journey stage):**
- None. All 22 stories (US-0.1 through US-6.5) appear in the matrix. ✅

**Personas not served by a release:**
- R1: PER-01 Marcus has 2 stories — sub-complete journey, but by design (form ships in R2). His journeys JRN-01.1 and JRN-01.2 cannot complete until R2.
- R2: PER-02 Dana has 2 stories — her primary journeys are complete from R1; R2 closes the POST/validation loop she inspects in JRN-02.2.

**Summary:** No true gaps. The one partial-coverage release (R1 for Marcus) is intentional and reflects PRD Phase 1 scope discipline. Both personas have complete journeys by the end of R2.

---
