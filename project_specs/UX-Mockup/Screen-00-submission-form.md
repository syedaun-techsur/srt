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
