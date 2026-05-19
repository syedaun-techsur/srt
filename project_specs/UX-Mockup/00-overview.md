# UX Mockup: Simple Request Tracker (SRT)

**Project:** Simple Request Tracker (SRT)
**Generated:** 2026-05-19
**Based on:** UserStories-SRT.md, JOURNEYS-SRT.md, PRD-SRT.md, FRD-SRT.md, PROJECT.md

---

## Overview

SRT is a two-screen web application. The UX goal is radical simplicity: a first-time user should be able to submit a request within 60 seconds of opening the app, with no documentation, no onboarding, and no ambiguity. The second goal is developer confidence — the UI must behave exactly as a well-implemented reference application should, with correct state transitions visible at every step.

### Design Principles

1. **Zero cognitive load on arrival.** The form is the landing screen. Three fields, one button. Required-field indicators are visible before the user touches anything.
2. **Silent failures are the worst failures.** Every action — submit click, load, error — must produce visible feedback within 200ms.
3. **Client-side validation is a hard gate.** No network request fires if any required field is blank. This serves both Marcus (UX feedback) and Dana (correctness verification via DevTools).
4. **State is never ambiguous.** After a successful submit the form resets. The button is disabled during flight. The list shows a loading state. There is no moment where the user must guess whether something worked.
5. **Navigation is always visible.** Both screens are reachable from any point in the app via a persistent header navigation.

### Application Structure

```
┌─────────────────────────────────────────────────────┐
│  App Shell (App.tsx)                                │
│  ┌──────────────────────────────────────────────┐   │
│  │  Header Nav: [Submit Request] [View Requests] │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  Active Screen:                              │   │
│  │   • SubmissionForm  (default / "Submit")     │   │
│  │   • RequestList     ("View Requests")        │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Screen Index

| Screen | Component | Default? | User Stories |
|--------|-----------|----------|--------------|
| Request Submission Form | `SubmissionForm.tsx` | Yes | US-5.1–US-5.4 |
| Request List View | `RequestList.tsx` | No | US-6.1–US-6.5 |

### Flow Index

| Flow | Persona | Journeys |
|------|---------|---------|
| Flow-00: First-Time Form Submission | Marcus Webb (PER-01) | JRN-01.1 |
| Flow-01: Blank-Form Validation Recovery | Marcus Webb (PER-01) | JRN-01.2 |
| Flow-02: Post-Submit Verification | Marcus Webb (PER-01) | JRN-01.3 |
| Flow-03: Zero-Setup Developer Validation | Dana Park (PER-02) | JRN-02.1, JRN-02.2 |
