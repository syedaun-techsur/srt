---

## F05: Request Submission Form

**PRD Reference:** F5 | **Priority:** P0 | **Phase:** 2

**Description:** The frontend submission screen presents a vertical form with three required fields (Name, Request Title, Description) and a Submit button. On submit, the form performs client-side required-field validation before making any API call. If all fields are valid, it posts the data to `POST /api/requests` (F3) and on success clears the form and/or navigates the user to the Request List view (F6). If any field is empty, inline error messages are shown without making an API call.

---

### Terminology

- **`SubmissionForm` component:** The React component (`SubmissionForm.tsx`) that renders the form and manages its state.
- **Inline error message:** A short error text displayed directly beneath each invalid field (e.g., "Name is required.").
- **Loading state:** The period between form submission and API response. The Submit button is disabled during this period to prevent duplicate submissions.
- **Form reset:** Clearing all three field values back to empty strings after a successful submission.
- **Client-side validation:** Validation performed in the browser before any network request is made. Distinct from server-side validation in F3.
- **Controlled component:** A React input whose value is bound to component state (via `useState`), enabling real-time validation and reset.

---

### Sub-features

- Vertical form layout with three stacked fields and a Submit button at the bottom
- Controlled input components bound to React state
- Client-side required-field validation on submit (before API call)
- Inline error messages beneath each invalid field
- Submit button disabled during active API call (loading state)
- On success: form fields cleared; user navigated to list view (or shown success confirmation)
- On API error: error message displayed to the user without clearing the form

---

### Process

1. User navigates to the submission form screen (via navigation in F01 App Shell).
2. Form renders three fields — all empty initially — and an enabled Submit button.
3. User fills in one or more fields and clicks Submit.
4. **Client-side validation fires:**
   - Check `name.trim() !== ""` — if blank, mark `name` field as invalid and show "Name is required."
   - Check `title.trim() !== ""` — if blank, mark `title` field as invalid and show "Request title is required."
   - Check `description.trim() !== ""` — if blank, mark `description` field as invalid and show "Description is required."
   - If any field is invalid: stop here, do NOT make an API call, show all applicable inline errors.
5. If all fields pass validation:
   a. Disable the Submit button and optionally show "Submitting…" text.
   b. Call `POST http://localhost:8080/api/requests` (via `fetch` or axios) with JSON body `{name, title, description}`.
   c. Await response.
6. **On success (`201 Created`):**
   - Clear all three form fields (reset state to `""`).
   - Navigate to the Request List view (F6), OR show a brief success message (e.g., "Request submitted!") before navigating.
   - Re-enable the Submit button.
7. **On API error (4xx/5xx or network failure):**
   - Display an error message (e.g., "Submission failed. Please try again.") — NOT below a specific field but at the form level.
   - Re-enable the Submit button.
   - Do NOT clear the form fields (user data is preserved so they can retry).

---

### Inputs

**User-provided (form fields):**

| Field | HTML Element | Type | Required | Placeholder |
|-------|-------------|------|----------|-------------|
| Name | `<input type="text">` | string | Yes | "Your name" |
| Request Title | `<input type="text">` | string | Yes | "Request title" |
| Description | `<textarea>` | string | Yes | "Describe your request" |

**API call payload (sent to F03 on valid submit):**
```json
{ "name": "...", "title": "...", "description": "..." }
```

---

### Outputs

- Rendered form with three labeled fields and a Submit button
- Inline error messages (one per field, shown only when that field is invalid)
- Loading/disabled state on Submit button during API call
- On success: empty form + navigation to list view
- On failure: form-level error message, fields preserved

---

### Validation Rules

- **Name:** `name.trim()` must not be empty. Error message: `"Name is required."`
- **Request Title:** `title.trim()` must not be empty. Error message: `"Request title is required."`
- **Description:** `description.trim()` must not be empty. Error message: `"Description is required."`
- Validation fires only on Submit click — NOT on every keystroke (no real-time validation required).
- All three fields are checked on each submit attempt; multiple errors can be shown simultaneously.
- No length limits, no format/regex validation, no cross-field rules.
- Client sends trimmed values to the API (or raw values — the server also validates).

---

### Error States

| Scenario | User-Visible Behavior | Form State |
|----------|--------------------|------------|
| One or more fields are blank | Inline error per blank field shown below field | Fields preserved; no API call |
| All fields valid but API returns 400 | Form-level error: "Submission failed. Please try again." | Fields preserved; button re-enabled |
| API returns 500 or network error | Form-level error: "Submission failed. Please try again." | Fields preserved; button re-enabled |
| Submit clicked while API call in flight | Submit button is disabled; second click ignored | Loading state maintained |

---

### API Surface (this feature)

This feature calls — but does not expose — the `POST /api/requests` endpoint defined in F03. See `Y1-api.md`.

---

### Schema Surface (this feature)

No database schema. Frontend only. Data written by F03 via F02's `RequestRepository`.
