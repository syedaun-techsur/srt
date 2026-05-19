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
