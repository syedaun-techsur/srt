---

## F06: Request List View

**PRD Reference:** F6 | **Priority:** P0 | **Phase:** 1

**Description:** The frontend list screen displays all submitted requests in a full-width HTML table. On component mount, it fetches all records from `GET /api/requests` (F4) and renders each row. When the list is empty, it displays a clearly visible empty-state message instead of an empty table. There is no pagination, filtering, or sorting — all records are displayed in the order returned by the API (natural insertion order).

---

### Terminology

- **`RequestList` component:** The React component (`RequestList.tsx`) that fetches and renders the list of requests.
- **Component mount:** The moment the `RequestList` component is first rendered (React `useEffect` with empty dependency array `[]`).
- **Empty state:** The UI rendered when `GET /api/requests` returns an empty array (`[]`). Shows a text message instead of a table.
- **Loading state:** The brief period between component mount and API response. Optionally shown as "Loading…" text.
- **`Request` type:** A TypeScript interface mirroring the backend response shape: `{ id: number; name: string; title: string; description: string; createdAt: string }`.

---

### Sub-features

- Fetch `GET /api/requests` on component mount (`useEffect` + `[]` dependency)
- Render full-width HTML `<table>` with columns: Name, Request Title, Description
- Empty-state message when the response array is empty
- Optional loading indicator while the fetch is in progress
- No pagination, no sorting controls, no search/filter

---

### Process

1. User navigates to the Request List screen (via navigation in F01 App Shell, or redirect after form submit in F5).
2. `RequestList` component mounts; `useEffect` fires immediately.
3. Component sets a `loading` state to `true` and optionally renders "Loading…".
4. `fetch("http://localhost:8080/api/requests")` is called (using `API_BASE_URL` constant from F01).
5. **On successful response (`200 OK`):**
   a. Parse JSON response as `Request[]`.
   b. Set `requests` state to the parsed array.
   c. Set `loading` to `false`.
6. **On empty array:**
   - `requests` state is `[]`.
   - Render empty-state message: `"No requests submitted yet."`
7. **On populated array:**
   - Render a `<table>` with header row: `Name | Request Title | Description`
   - Render one `<tr>` per `Request` record with `<td>` cells for `name`, `title`, `description`.
   - `id` and `createdAt` are NOT displayed (but are available in state if needed for future use).
8. **On fetch error (network failure or 5xx):**
   - Set `loading` to `false`.
   - Render an error message: `"Failed to load requests. Please try again."`

---

### Inputs

**API call:**
- Method: `GET`
- URL: `http://localhost:8080/api/requests` (via `API_BASE_URL` constant)
- Headers: none required beyond browser defaults
- No query parameters

**TypeScript interface for the response:**
```typescript
interface Request {
  id: number;
  name: string;
  title: string;
  description: string;
  createdAt: string; // ISO 8601 timestamp string
}
```

---

### Outputs

**Table (when records exist):**

| Name | Request Title | Description |
|------|--------------|-------------|
| Alice | Fix login bug | The login page crashes on mobile browsers. |
| Bob | Add export feature | Need to export the request list to CSV. |

**Empty state (when no records):**
> No requests submitted yet.

**Error state (fetch failed):**
> Failed to load requests. Please try again.

---

### Validation Rules

- The component must call `GET /api/requests` exactly once on mount (not on every render).
- The fetch must use the `API_BASE_URL` constant — no hardcoded URLs in the component.
- The `id` and `createdAt` columns must NOT be rendered in the table.
- The `<table>` must have a visible header row with labels: `"Name"`, `"Request Title"`, `"Description"`.
- Empty array response must trigger the empty-state message, not an empty table body.
- All records returned by the API must be rendered — no client-side filtering or limiting.

---

### Error States

| Scenario | User-Visible Behavior | Component State |
|----------|--------------------|-----------------|
| API returns `[]` (no records) | "No requests submitted yet." message displayed | `requests = []`, `loading = false` |
| API returns records | Full table rendered with all records | `requests = [...] `, `loading = false` |
| Network error or fetch fails | "Failed to load requests. Please try again." | `error = true`, `loading = false` |
| API returns 500 | "Failed to load requests. Please try again." | `error = true`, `loading = false` |
| Component mounted, fetch in progress | "Loading…" (optional) | `loading = true` |

---

### API Surface (this feature)

This feature calls — but does not expose — the `GET /api/requests` endpoint defined in F04. See `Y1-api.md`.

---

### Schema Surface (this feature)

No database schema. Frontend only. Data read by F04 from the `requests` table defined in F02.
