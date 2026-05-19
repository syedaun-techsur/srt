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
