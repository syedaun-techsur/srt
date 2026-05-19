---

## F04: GET Endpoint — List All Requests

**PRD Reference:** F4 | **Priority:** P0 | **Phase:** 1

**Description:** A REST endpoint returns all `Request` records stored in H2 as a JSON array. When no records exist, it returns an empty array (`[]`). This endpoint is the read side of the create-and-display loop and is consumed by the frontend list view (F6) on component mount. There is no filtering, sorting override, or pagination — all records are returned in natural database insertion order.

---

### Terminology

- **Natural insertion order:** The default order returned by `JpaRepository.findAll()`, which reflects the order rows were inserted into H2 (ascending by `id`). No `ORDER BY` clause is required.
- **Empty array:** When no records exist in H2, the endpoint returns `[]` (an empty JSON array), not `null` or a `404`.

---

### Sub-features

- `GET /api/requests` endpoint with no query parameters
- Returns all records from H2 using `RequestRepository.findAll()`
- Returns `200 OK` with JSON array in all cases (empty or populated)
- No pagination, filtering, or sorting parameters accepted

---

### Process

1. Client sends `GET http://localhost:8080/api/requests`.
2. Controller calls `requestRepository.findAll()`.
3. Spring Data JPA issues `SELECT * FROM requests` to H2.
4. Controller returns `ResponseEntity.ok(requests)` — a `200 OK` with the list serialized as a JSON array.
5. If no records exist, `findAll()` returns an empty `List<Request>`; the response body is `[]`.

---

### Inputs

**HTTP Request:**
- Method: `GET`
- Path: `/api/requests`
- Headers: `Origin: http://localhost:5173` (for CORS)
- No query parameters
- No request body

---

### Outputs

**Success Response — `200 OK` (records exist):**
```json
[
  {
    "id": 1,
    "name": "Alice",
    "title": "Fix login bug",
    "description": "The login page crashes on mobile browsers.",
    "createdAt": "2026-05-19T14:32:00"
  },
  {
    "id": 2,
    "name": "Bob",
    "title": "Add export feature",
    "description": "Need to export the request list to CSV.",
    "createdAt": "2026-05-19T14:45:00"
  }
]
```

**Success Response — `200 OK` (no records):**
```json
[]
```

---

### Validation Rules

- No input validation required — the endpoint accepts no parameters.
- The response must always be a JSON array (never `null`).
- The response must always have HTTP `200 OK` status (never `404`, even when empty).
- Records are returned in natural insertion order (ascending `id`). No client-specified ordering.

---

### Error States

| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| H2 query fails (unexpected) | 500 | INTERNAL_ERROR | "An unexpected error occurred." |
| CORS header missing | Browser blocks request | — | Configure Spring Boot CORS (see F00) |

---

### API Surface (this feature)

| Method | Path | Auth | Query Params | Success | Error |
|--------|------|------|--------------|---------|-------|
| GET | `/api/requests` | None | None | 200 + JSON array | 500 |

Full request/response schema: see `Y1-api.md §GET /api/requests`.

---

### Schema Surface (this feature)

Reads from the `requests` table. See `Y0-schema.md` and F02 for full DDL.
