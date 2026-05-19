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
---

## Flow-00: First-Time Form Submission

**Persona:** PER-01 Marcus Webb (Business Requester)
**Trigger:** Marcus opens the app URL for the first time
**Journey:** JRN-01.1
**User Stories:** US-1.2, US-5.1, US-5.3

```
[Browser opens http://localhost:5173]
        │
        ▼
[App Shell renders — header nav + SubmissionForm screen]
        │
        ▼
[User scans form: sees 3 labeled fields + required indicators]
        │
        ▼
[User fills Name → tabs → fills Request Title → tabs → fills Description]
        │
        ▼
[User clicks Submit]
        │
        ▼
[Client-side validation: all fields non-blank?]
        │
        ├── ANY blank ──▶ [Inline errors shown; no API call] ──▶ [User corrects] ──┐
        │                                                                           │
        └── All valid ──▶ [Submit button disabled + "Submitting…"]                  │
                                │                                                   │
                                ▼                                                   │
                    [POST /api/requests fires]                                      │
                                │                                                   │
                    ┌───────────┴────────────┐                                     │
                    │                        │                                     │
               201 Created              4xx/5xx / network                          │
                    │                        │                                     │
                    ▼                        ▼                                     │
         [Form resets to empty]    [Form-level error message]                      │
         [Navigate → List View]    [Fields preserved]                              │
         [Button re-enabled]       [Button re-enabled]  ◀─────────────────────────┘
```

**Steps:**

1. **Arrive:** App loads with `SubmissionForm` as the active view. Header shows both nav items; "Submit Request" is visually active.
2. **Orient:** User sees three labeled, stacked fields with placeholder text and a required-field indicator ("All fields required" note or asterisks). No fields are pre-filled.
3. **Fill:** User types in each field in order. Tab focus moves Name → Request Title → Description → Submit button.
4. **Submit:** User clicks Submit. Button disables immediately and shows "Submitting…". `POST /api/requests` fires with `{name, title, description}`.
5. **Confirm (success path):** On `201 Created`, all fields clear, user is navigated to the Request List view where the new entry is already visible.
6. **Confirm (error path):** On API error, a form-level message appears: "Submission failed. Please try again." Fields are preserved. Button re-enables.

**Entry Point:** App home / default screen
**Exit Points:**
- Success → Request List View (Screen-01)
- Error → Stays on Submission Form (Screen-00) with error message
---

## Flow-01: Blank-Form Validation Recovery

**Persona:** PER-01 Marcus Webb (Business Requester)
**Trigger:** Marcus clicks Submit without filling in any fields
**Journey:** JRN-01.2
**User Stories:** US-5.2, US-5.3

```
[User on Submission Form — all fields blank]
        │
        ▼
[User clicks Submit (impulsive test or mistake)]
        │
        ▼
[Client-side validation fires immediately (<200ms)]
        │
        └── No API call made ──▶ [Inline errors appear under each blank field]
                                          │
                     ┌────────────────────┼────────────────────┐
                     ▼                    ▼                    ▼
             [Under Name:         [Under Title:         [Under Description:
          "Name is required."]  "Request title        "Description is
                                  is required."]          required."]
                     │
                     ▼
        [User begins typing in Name field]
                     │
                     ▼
        [Error under Name clears as user types]
                     │
                     ▼
        [User fills Title → error clears]
                     │
                     ▼
        [User fills Description → error clears]
                     │
                     ▼
        [All errors cleared; user clicks Submit again]
                     │
                     ▼
        [Validation passes → POST /api/requests fires]
                     │
              ┌──────┴──────┐
         201 Created    Error
              │              │
              ▼              ▼
     [Form resets]   [Form-level error]
     [→ List View]   [Fields preserved]
```

**Steps:**

1. **Blank submit:** User clicks Submit with no fields filled. The button is NOT disabled (it is enabled by default). No loading state appears. No API call fires.
2. **Error display:** Within 200ms, three inline error messages appear simultaneously — one directly below each blank field.
3. **Targeted errors:** Each error is field-specific: "Name is required." / "Request title is required." / "Description is required."
4. **Progressive correction:** As the user types into each field, that field's error message clears. Errors for other still-blank fields remain visible.
5. **Re-submit:** Once all fields have values, user clicks Submit again. Validation passes, API call fires, normal success/error flow follows.

**Key Constraint:** Error clearing behavior fires on input change (not on re-submit), so the user gets progressive positive feedback as they fill each field.

**Entry Point:** Submission Form (Screen-00) with all fields blank
**Exit Points:**
- User corrects all fields → continues to Flow-00 success path
- User abandons → stays on form
---

## Flow-02: Post-Submit Verification

**Persona:** PER-01 Marcus Webb (Business Requester)
**Trigger:** Marcus has just submitted a request and wants to confirm it was saved
**Journey:** JRN-01.3
**User Stories:** US-1.2, US-6.1, US-6.2, US-6.5

```
[User on Submission Form — just successfully submitted]
        │
        ▼ (automatic redirect after 201)
[Request List View loads]
        │
        ▼
[Loading state: "Loading…" shown while GET /api/requests resolves]
        │
        ├── Success ──▶ [Table renders with all requests]
        │                       │
        │               [User scans table for their entry]
        │                       │
        │               [Entry found: Name + Title + Description visible]
        │                       │
        │                       ▼
        │               [User satisfied — done]
        │
        └── Error ──▶ ["Failed to load requests. Please try again."]
                       [No table rendered]
```

**Steps:**

1. **Navigate:** After successful form submission, user is automatically redirected to the Request List view. Alternatively, if shown a success message, user clicks the "View Requests" nav link.
2. **Load:** List component mounts and fires `GET /api/requests`. A "Loading…" indicator is shown during the fetch.
3. **Render:** Table renders with three columns: Name, Request Title, Description. All records visible in insertion order.
4. **Verify:** User's newly submitted entry is visible in the table — exact values they entered are displayed.
5. **Done:** User has confirmed their submission. They can close the tab or navigate away.

**Key Constraint (JRN-01.3):** The new record must be visible without a manual page refresh. The redirect after form submit should land on a freshly-fetched list.

**Entry Point:** Redirect from Submission Form after successful `201 Created` response
**Exit Points:**
- Entry found → User navigates away / closes tab
- Load error → Error state shown; user can retry by navigating back and forth
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
---

## Screen-00: Request Submission Form

**Component:** `SubmissionForm.tsx`
**Purpose:** Primary entry point for Marcus to submit a new request. Default active screen on app load.
**User Stories:** US-1.2, US-5.1, US-5.2, US-5.3, US-5.4
**Feature Refs:** F1, F5

---

### Layout

```
┌─────────────────────────────────────────────────────┐
│  HEADER NAV                                         │
│  [Submit Request *]  [View Requests]                │
│  (* = active, visually distinguished)               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Submit a Request                                   │
│  ─────────────────────────────────────────────────  │
│  All fields required.                               │
│                                                     │
│  Name *                                             │
│  ┌─────────────────────────────────────────────┐   │
│  │ Your name                        (placeholder)│   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Request Title *                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ Request title                    (placeholder)│   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Description *                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ Describe your request            (placeholder)│   │
│  │                                               │   │
│  │                                               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [        Submit        ]   ← primary button       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### Information Hierarchy

| Priority | Content | Placement | Rationale |
|----------|---------|-----------|-----------|
| Primary | Three form fields (Name, Title, Description) | Center, full-width stack | Core task — must dominate the viewport |
| Primary | Submit button | Below description field | Logical completion of the form; tab order terminus |
| Secondary | "All fields required." note | Above Name field | Pre-emptive guidance; removes ambiguity before first interaction |
| Secondary | Field labels + asterisks (*) | Above each field | Confirms required status at a glance |
| Tertiary | Placeholder text | Inside each input | Contextual hint only; disappears on focus/input |
| Conditional | Inline field errors | Directly below each field | Only shown after failed submit attempt |
| Conditional | Form-level error message | Above Name field / below "All fields required" | Only shown on API failure |
| Conditional | "Submitting…" loading text on button | Button label replaces "Submit" | Only shown during API call in flight |

---

### States

#### Default State

```
┌──────────────────────────────────────────────────┐
│ Name *                                           │
│ ┌──────────────────────────────────────────┐    │
│ │ Your name                                │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ Request Title *                                  │
│ ┌──────────────────────────────────────────┐    │
│ │ Request title                            │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ Description *                                    │
│ ┌──────────────────────────────────────────┐    │
│ │ Describe your request                    │    │
│ │                                          │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ [          Submit          ]  ← enabled          │
└──────────────────────────────────────────────────┘
```

#### Validation Error State (US-5.2)

Triggered by: clicking Submit with one or more blank fields.
No API call is made.

```
┌──────────────────────────────────────────────────┐
│ All fields required.                             │
│                                                  │
│ Name *                                           │
│ ┌──────────────────────────────────────────┐    │
│ │                          [border: red]   │    │
│ └──────────────────────────────────────────┘    │
│ ⚠ Name is required.   ← inline, below field     │
│                                                  │
│ Request Title *                                  │
│ ┌──────────────────────────────────────────┐    │
│ │                          [border: red]   │    │
│ └──────────────────────────────────────────┘    │
│ ⚠ Request title is required.                    │
│                                                  │
│ Description *                                    │
│ ┌──────────────────────────────────────────┐    │
│ │                          [border: red]   │    │
│ └──────────────────────────────────────────┘    │
│ ⚠ Description is required.                      │
│                                                  │
│ [          Submit          ]  ← still enabled    │
└──────────────────────────────────────────────────┘
```

Behavior notes:
- All three errors shown simultaneously when all three fields are blank
- Only the errors for blank fields are shown; filled fields show no error
- As user types into a field, that field's red border and error message clear immediately (on input change)
- Submit remains enabled — user can retry at any time

#### Loading State (US-5.3)

Triggered by: all fields valid + Submit clicked. API call is in flight.

```
┌──────────────────────────────────────────────────┐
│ Name *                                           │
│ ┌──────────────────────────────────────────┐    │
│ │ Marcus Webb                              │    │  ← field values preserved
│ └──────────────────────────────────────────┘    │
│ ...                                              │
│                                                  │
│ [       Submitting…        ]  ← disabled         │
│           (grayed out)                           │
└──────────────────────────────────────────────────┘
```

Behavior notes:
- Submit button disabled immediately on click — second click has no effect
- Button label changes to "Submitting…" to communicate in-progress state
- Fields remain populated and readable during the API call
- Loading state clears as soon as the response arrives (success or failure)

#### Success State (US-5.1)

Triggered by: `201 Created` response from `POST /api/requests`.

```
┌──────────────────────────────────────────────────┐
│ [View transitions to Request List View]          │
│                                                  │
│   — OR —                                         │
│                                                  │
│ ✓ Request submitted!   ← brief transient message │
│                           (optional; fades out)  │
│                                                  │
│ Name *                                           │
│ ┌──────────────────────────────────────────┐    │
│ │ Your name                ← reset to empty│    │
│ └──────────────────────────────────────────┘    │
│ ...all fields reset...                           │
│                                                  │
│ [          Submit          ]  ← re-enabled       │
└──────────────────────────────────────────────────┘
```

Behavior notes:
- All three field values reset to empty string `""`
- Button re-enabled
- Preferred: navigate to Request List view so user can verify their entry (JRN-01.3)
- Optional: show brief "Request submitted!" message before/during redirect

#### API Error State (US-5.4)

Triggered by: `4xx`, `5xx`, or network failure response.

```
┌──────────────────────────────────────────────────┐
│ ✖ Submission failed. Please try again.           │
│   ← form-level; above the first field            │
│                                                  │
│ Name *                                           │
│ ┌──────────────────────────────────────────┐    │
│ │ Marcus Webb              ← data preserved│    │
│ └──────────────────────────────────────────┘    │
│ ... all fields preserved ...                     │
│                                                  │
│ [          Submit          ]  ← re-enabled       │
└──────────────────────────────────────────────────┘
```

Behavior notes:
- Form-level error — NOT inline under a specific field
- All entered data preserved so user does not have to re-type
- Button re-enabled so user can retry immediately
- Inline field errors (from prior validation attempt) remain if present; API error is separate

---

### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Name input | `<input type="text">` | Controlled; bound to state; error clears on input |
| Request Title input | `<input type="text">` | Controlled; bound to state; error clears on input |
| Description textarea | `<textarea>` | Controlled; bound to state; error clears on input |
| Submit button | Primary button | Enabled by default; disabled during API call; re-enabled on response |
| "Submit Request" nav link | Header nav | Already active on this screen; clicking is a no-op or reloads form |
| "View Requests" nav link | Header nav | Navigates to Request List View |

---

### Tab Order

```
Name input → Request Title input → Description textarea → Submit button
```

Tab order must follow visual top-to-bottom sequence. No unexpected focus jumps.
---

## Screen-01: Request List View

**Component:** `RequestList.tsx`
**Purpose:** Displays all submitted requests in a table. Confirms the create-and-display loop is working. Entry point for verification after submission.
**User Stories:** US-1.2, US-6.1, US-6.2, US-6.3, US-6.4, US-6.5
**Feature Refs:** F1, F4, F6

---

### Layout

```
┌─────────────────────────────────────────────────────┐
│  HEADER NAV                                         │
│  [Submit Request]  [View Requests *]                │
│  (* = active, visually distinguished)               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Submitted Requests                                 │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  ┌───────────┬───────────────────┬───────────────┐  │
│  │ Name      │ Request Title     │ Description   │  │
│  ├───────────┼───────────────────┼───────────────┤  │
│  │ Alice     │ Fix login bug     │ The login     │  │
│  │           │                   │ page crashes… │  │
│  ├───────────┼───────────────────┼───────────────┤  │
│  │ Bob       │ Add export        │ Need to export│  │
│  │           │ feature           │ the list…     │  │
│  └───────────┴───────────────────┴───────────────┘  │
│                         ← full-width table           │
└─────────────────────────────────────────────────────┘
```

---

### Information Hierarchy

| Priority | Content | Placement | Rationale |
|----------|---------|-----------|-----------|
| Primary | Request table (Name, Title, Description) | Main content area, full-width | Core task — all submitted requests at a glance |
| Primary | Table header row | Fixed top row of table | Field labels for orientation |
| Secondary | Page heading "Submitted Requests" | Above table | Screen identification |
| Conditional | "Loading…" indicator | Replaces table during fetch | Only shown while GET /api/requests is in flight |
| Conditional | Empty-state message | Replaces table when array is empty | Explicit signal that list is intentionally empty |
| Conditional | Error message | Replaces table on fetch failure | Explicit signal of connectivity problem |

**Explicitly NOT shown in the table:**
- `id` column — hidden (internal backend field)
- `createdAt` column — hidden (not relevant for this display per US-6.1)

---

### States

#### Loading State (US-6.5)

Triggered by: component mount while `GET /api/requests` is in flight.

```
┌──────────────────────────────────────────────────┐
│ Submitted Requests                               │
│                                                  │
│  Loading…                                        │
│  ← centered or left-aligned text                │
│  ← replaces the table entirely                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

Behavior notes:
- "Loading…" text shown as soon as component mounts, before fetch resolves
- Clears as soon as any response is received (success, empty, or error)
- No stale "Loading…" text can persist after data is rendered

#### Populated Table State (US-6.1, US-6.2)

Triggered by: `GET /api/requests` returns a non-empty array.

```
┌──────────────────────────────────────────────────┐
│ Submitted Requests                               │
│                                                  │
│ ┌──────────┬──────────────────┬───────────────┐  │
│ │ Name     │ Request Title    │ Description   │  │
│ ├──────────┼──────────────────┼───────────────┤  │
│ │ Marcus   │ Update homepage  │ The hero      │  │
│ │          │ copy             │ section text… │  │
│ ├──────────┼──────────────────┼───────────────┤  │
│ │ Dana     │ Fix API timeout  │ POST endpoint │  │
│ │          │                  │ times out…    │  │
│ └──────────┴──────────────────┴───────────────┘  │
└──────────────────────────────────────────────────┘
```

Behavior notes:
- Records appear in natural insertion order (ascending `id` — oldest first)
- ALL records returned by the API are rendered; no client-side filtering or row limits
- Description cells may truncate long text with ellipsis or wrap (implementation choice; full text accessible)
- `id` and `createdAt` are in component state but NOT rendered in the table

#### Empty State (US-6.3)

Triggered by: `GET /api/requests` returns `[]`.

```
┌──────────────────────────────────────────────────┐
│ Submitted Requests                               │
│                                                  │
│  No requests submitted yet.                      │
│  ← replaces the table entirely                  │
│  ← NO empty <table> or empty <tbody> rendered   │
│                                                  │
└──────────────────────────────────────────────────┘
```

Behavior notes:
- The `<table>` element is NOT rendered at all (per US-6.3)
- Only the text message is shown — no empty table structure
- Message is clearly readable and positioned where the table would be
- No console errors; this is a valid, expected state (e.g., freshly started backend)

#### Error State (US-6.4)

Triggered by: `GET /api/requests` fails (network error or 5xx).

```
┌──────────────────────────────────────────────────┐
│ Submitted Requests                               │
│                                                  │
│  Failed to load requests. Please try again.     │
│  ← replaces the table entirely                  │
│  ← NO empty table rendered                      │
│                                                  │
└──────────────────────────────────────────────────┘
```

Behavior notes:
- `<table>` element is NOT rendered — error message takes its place
- Message is "Failed to load requests. Please try again." (exact text per FRD)
- Application does not crash; unhandled exceptions are caught
- User can retry by navigating away and back (triggers new component mount and fresh fetch)

---

### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Table rows | Read-only display | No click actions; no row selection |
| "View Requests" nav link | Header nav | Already active on this screen; clicking is a no-op or re-triggers mount |
| "Submit Request" nav link | Header nav | Navigates to Submission Form (Screen-00) |

---

### State Summary Table

| State | Trigger | Table Rendered? | Message Shown |
|-------|---------|-----------------|---------------|
| Loading | Component mount, fetch in flight | No | "Loading…" |
| Populated | Fetch returns `[{…}, …]` | Yes | None |
| Empty | Fetch returns `[]` | No | "No requests submitted yet." |
| Error | Fetch fails or 5xx | No | "Failed to load requests. Please try again." |
---

## Interaction Patterns

### Pattern 1: Client-Side Validation Gate

**When to use:** On every Submit button click on the Submission Form
**User Stories:** US-5.2, US-5.3
**Journey:** JRN-01.2, JRN-02.2 (CP-03)

**Behavior:**
1. Submit clicked → run validation synchronously (no async, no debounce)
2. For each field: `value.trim() === ""` → mark as invalid
3. If ANY field is invalid → show all applicable inline errors → STOP. Do not call `fetch`.
4. If ALL fields valid → proceed to loading state + API call

**Trigger:** Submit button `onClick`
**Fires on:** Submit click only — NOT on every keystroke, NOT on blur
**Error clearing:** Each field's error clears as the user types (on `onChange`) — before the next Submit click

**Why this timing matters:**
- Validate on submit (not on keystroke) → no nagging red errors while the user is still typing
- Clear on change → progressive positive feedback as user corrects each field
- Zero network calls on blank submit → Dana's DevTools shows clean behavior

---

### Pattern 2: Submit Button Loading State

**When to use:** From the moment a valid form is submitted until the API response arrives
**User Stories:** US-5.3
**Journey:** JRN-01.1 (Submit stage)

**Behavior:**
1. Valid submit → immediately: `button.disabled = true`, label changes to "Submitting…"
2. API call in flight → button remains disabled; second click has no effect
3. Response received (any outcome) → button re-enabled; label resets to "Submit"

**Why this matters:**
- Prevents duplicate submissions (double-click protection)
- Eliminates the "did it go?" anxiety moment (JRN-01.1 key risk)
- Reassures user that something is happening

---

### Pattern 3: Form Reset on Success

**When to use:** After `POST /api/requests` returns `201 Created`
**User Stories:** US-5.1
**Journey:** JRN-01.1 (Confirm stage), JRN-02.1 (Submit test request stage)

**Behavior:**
1. `201 Created` received → reset all three fields to `""` (empty string)
2. Clear any inline errors and form-level errors
3. Re-enable Submit button
4. Navigate to Request List view (preferred) — so user can immediately verify their entry

**Why full reset + redirect (not just reset):**
- Reset alone: user sees a blank form and doesn't know if it worked
- Redirect to list: user sees their entry → self-confirmation loop closes naturally (JRN-01.3)

---

### Pattern 4: Data Preservation on API Failure

**When to use:** After `POST /api/requests` returns 4xx/5xx or network error
**User Stories:** US-5.4
**Journey:** JRN-01.2 (Re-submit stage)

**Behavior:**
1. API failure → show form-level error message: "Submission failed. Please try again."
2. Do NOT clear any field values — user data is preserved
3. Clear inline field validation errors (they are not the cause of the API failure)
4. Re-enable Submit button so the user can retry without re-typing

**Error placement:** Form-level error goes ABOVE the first field (not inline under a specific field), because the failure is not attributable to any single field.

---

### Pattern 5: Fetch on Mount (Request List)

**When to use:** Every time the Request List component mounts
**User Stories:** US-6.1, US-6.5
**Journey:** JRN-01.3 (Load list stage), JRN-02.1 (Verify list stage)

**Behavior:**
1. Component mounts → `useEffect([], [])` fires immediately
2. Set `loading = true` → render "Loading…"
3. `fetch(API_BASE_URL + "/requests")` called exactly once
4. Response received:
   - Success + data → set `requests`, set `loading = false`
   - Success + empty → set `requests = []`, set `loading = false`
   - Error → set `error = true`, set `loading = false`

**Key constraint:** The fetch fires exactly ONCE per mount — not on every render. This means the list refreshes automatically whenever the user navigates to it (component unmounts and remounts), which is how the newly submitted request appears without a manual reload.

---

### Pattern 6: Persistent Header Navigation

**When to use:** All screens, all states
**User Stories:** US-1.2
**Journey:** JRN-01.3 (Navigate stage), JRN-02.1 (Verify list stage) (CP-04)

**Behavior:**
- Header with two nav items is rendered by `App.tsx` and visible on every screen
- "Submit Request" navigates to / shows the `SubmissionForm` component
- "View Requests" navigates to / shows the `RequestList` component
- Active screen is visually indicated (e.g., underline, bold, different background, or border)
- Navigation triggers a React state change (or React Router route change) — no full page reload

**Visual indicator options (choose one):**
- Underline on active nav item
- Bold text on active item
- Background color change (e.g., darker shade)
- Border-bottom highlight

**Implementation note:** React Router `<NavLink>` provides active class automatically. A simple `useState` toggle in `App.tsx` is also acceptable per FRD.
---

## Responsive Considerations

SRT is a dev/demo application used primarily on a desktop browser. However, the layout must be readable and functional at tablet and mobile widths without horizontal scrolling or broken forms.

---

### Desktop (> 1024px)

**Submission Form:**
- Max-width container: `800px`, centered, `margin: 40px auto`, `padding: 0 16px`
- Form fields: full-width within the container
- Description textarea: minimum 3 rows visible; can grow with content
- Submit button: comfortable click target; does not need to be full-width

**Request List:**
- Table: full-width within the `800px` container
- Three columns split roughly: Name 20% | Request Title 30% | Description 50%
- Long description text wraps within the cell

---

### Tablet (768px – 1024px)

**Submission Form:**
- Same vertical stack layout; container fills width with horizontal padding
- No layout changes needed — the form is inherently single-column

**Request List:**
- Table remains horizontal with all three columns visible
- Column widths adjust to available space
- Description column may show truncated text with ellipsis if cells become too narrow; full text still accessible via tooltip or wrapping

---

### Mobile (< 768px)

**Submission Form:**
- Container fills viewport width with `padding: 0 16px`
- All fields full-width — no change to layout structure
- Submit button: full-width for easier tap target on small screens
- Textarea: minimum 4 rows so it is usable without pinch-zoom

**Request List:**
- Wide table on a narrow screen is the primary challenge
- Acceptable approaches (choose one):
  - **Horizontal scroll:** Allow the table to scroll horizontally inside the container. Preserve all three columns.
  - **Card layout at mobile breakpoint:** Stack each record as a card with labeled field-value pairs instead of a table row.
- The `id` and `createdAt` columns are not shown regardless.

**Navigation:**
- Header nav items remain visible at all widths — they are short text labels and fit side-by-side on mobile
- No hamburger menu needed for two nav items

---

### CSS Approach

Per FRD F01 requirements:
- **No UI framework** (no Tailwind, no MUI, no Bootstrap) — plain CSS only
- Base styles in `src/index.css` or `src/App.css`
- Suggested base:

```css
body {
  font-family: sans-serif;
  max-width: 800px;
  margin: 40px auto;
  padding: 0 16px;
}

@media (max-width: 768px) {
  body {
    margin: 16px auto;
  }

  .submit-button {
    width: 100%;
  }

  .request-table {
    display: block;
    overflow-x: auto;
  }
}
```
---

## Accessibility Notes

SRT is a minimal demo application. The following baseline accessibility requirements ensure the app is usable with keyboard navigation, screen readers, and meets minimum contrast standards. These are achievable without a UI framework.

---

### Color Contrast

| Element | Requirement |
|---------|-------------|
| Body text on background | Minimum 4.5:1 contrast ratio (WCAG AA) |
| Error messages (red text or icons) | Minimum 4.5:1 contrast ratio — avoid pure `#ff0000` on white; use darker red e.g. `#c0392b` |
| Placeholder text | Minimum 3:1 contrast — note that browser defaults often fail here; explicitly set `color: #767676` |
| Submit button text on button background | Minimum 4.5:1 |
| Active nav indicator | Ensure active state is distinguishable not just by color (add underline or bold) |

---

### Keyboard Navigation

| Interaction | Expected Behavior |
|------------|-------------------|
| Tab through form | Name → Request Title → Description → Submit button (in that order) |
| Enter in Name or Title input | Should NOT submit the form unexpectedly; or if it does, validation fires first |
| Enter on Submit button | Triggers click handler (same as mouse click) |
| Tab to nav links | Both nav items reachable via Tab key |
| Enter on nav link | Activates navigation |
| Focus indicators | Visible focus ring on all interactive elements (do not suppress `outline`) |

---

### Form Labels and ARIA

| Element | Requirement |
|---------|-------------|
| Name input | `<label for="name">Name</label>` — explicit label association via `for`/`id` |
| Request Title input | `<label for="title">Request Title</label>` — explicit label |
| Description textarea | `<label for="description">Description</label>` — explicit label |
| Required indicator | Use `aria-required="true"` on each required field in addition to visual asterisk |
| Inline error messages | Associate with their field via `aria-describedby`; add `role="alert"` so screen readers announce the error immediately |
| Form-level error | Use `role="alert"` so screen readers announce the error when it appears |
| Submit button loading state | Update `aria-label` to "Submitting, please wait" when disabled, or use `aria-busy="true"` on the form |
| Table | Use `<table>` with `<thead>` and `<th scope="col">` for proper screen reader column announcement |

**Example error association:**
```html
<label for="name">Name *</label>
<input
  id="name"
  type="text"
  aria-required="true"
  aria-describedby="name-error"
/>
<span id="name-error" role="alert">
  Name is required.
</span>
```

---

### Screen Reader Considerations

| Scenario | Behavior |
|----------|---------|
| Inline error appears | `role="alert"` causes screen reader to announce the error message immediately without user focus change |
| Form-level error appears | `role="alert"` announces "Submission failed. Please try again." to screen reader |
| Submit button disabled | Screen reader announces "Submitting, please wait" (via `aria-label`) — "dimmed" alone is not sufficient |
| Table renders | Screen reader can navigate columns via `<th scope="col">` headers |
| Empty-state message | Plain text in a `<p>` — announced naturally when user tabs to it or on focus |
| Loading state | Optional: `aria-live="polite"` region for "Loading…" text so screen readers announce it without interrupting |

---

### Minimum Implementation Checklist

- [ ] All form inputs have explicit `<label>` elements with matching `for`/`id`
- [ ] All required fields have `aria-required="true"`
- [ ] Inline error messages use `role="alert"` and are associated via `aria-describedby`
- [ ] Form-level error uses `role="alert"`
- [ ] Table has `<thead>` with `<th scope="col">` for each column
- [ ] No `outline: none` on interactive elements without a custom focus style replacement
- [ ] Tab order follows visual reading order (top to bottom, left to right)
- [ ] Error states are not communicated by color alone (text message required in addition to red border)
