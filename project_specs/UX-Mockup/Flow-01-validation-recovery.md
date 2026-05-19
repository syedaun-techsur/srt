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
