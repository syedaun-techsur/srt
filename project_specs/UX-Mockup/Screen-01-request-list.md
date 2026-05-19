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
