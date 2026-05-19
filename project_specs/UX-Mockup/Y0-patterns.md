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
