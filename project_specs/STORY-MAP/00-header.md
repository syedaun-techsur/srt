# Story Map: Simple Request Tracker (SRT)

**Document ID:** STORY-MAP-SRT  
**Version:** 1.0  
**Date:** 2026-05-19  
**Status:** Active  
**Product Name:** Simple Request Tracker (SRT)  
**Related Artifacts:** PRD-SRT v1.0 · PERSONAS-SRT v1.0 · JTBD-SRT v1.0 · JOURNEYS-SRT v1.0 · UserStories-SRT v1.0

| Field | Value |
|-------|-------|
| Personas | PER-01 Marcus Webb (Business Requester), PER-02 Dana Park (Internal Stakeholder/Dev) |
| Journeys | JRN-01.1, JRN-01.2, JRN-01.3, JRN-02.1, JRN-02.2, JRN-02.3 |
| Stories Mapped | 22 (US-0.1 – US-6.5) — all P0 |
| Releases Planned | R1 (Phase 1 — Scaffold + List), R2 (Phase 2 — Form + Submit) |
| Epics | 7 (Epic 0–6, Feature F0–F6) |

---

## Overview

This Story Map organizes all 22 user stories onto a two-dimensional grid:

- **X-axis (columns):** Journey stages drawn from JOURNEYS-SRT. Each column represents a moment in a persona's workflow where the product must deliver value.
- **Y-axis (rows):** Activities and stories within each stage, ordered by epic and story ID.
- **NaC column:** Natural Acceptance Criteria — testable statements derived from JTBD outcomes applied to the specific journey stage context. Every NaC traces back to a JTBD outcome; none are invented.
- **Release column:** R1 or R2, aligned to PRD delivery phases.

### NaC Concept

Natural Acceptance Criteria (NaC) bridge JTBD outcomes to testable story criteria:

1. **JTBD outcome** — what matters to the persona ("Minimize time to start work")
2. **Journey stage context** — when/where the outcome must be satisfied ("Start backend stage")
3. **Testable NaC** — the verifiable criterion that proves the outcome is met ("Backend starts in under 30 seconds with a single command")

NaC complement, but do not replace, the formal acceptance criteria in UserStories-SRT. They answer: *does this story, in the context of the journey, deliver the JTBD outcome?*

### Story Map ID Convention

Map entries use: `SM-{Epic}.{NN}` (e.g., SM-0.1 maps to Epic 0 / US-0.1)

---
