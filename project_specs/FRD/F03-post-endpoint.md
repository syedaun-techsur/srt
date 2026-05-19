---

## F03: POST Endpoint — Submit Request

**PRD Reference:** F3 | **Priority:** P0 | **Phase:** 2

**Description:** A REST endpoint accepts a JSON payload containing the three required fields (`name`, `title`, `description`), validates that all fields are present and non-blank, persists the new record to H2 via the `RequestRepository` (F2), assigns a server-generated `id` and `created_at`, and returns the saved entity with HTTP `201 Created`. This is the write side of the create-and-display loop.

---

### Terminology

- **`RequestController`:** The `@RestController` class that handles HTTP requests to `/api/requests`.
- **`RequestDto`:** A plain Java class (or `record`) used to deserialize the incoming JSON request body. Contains only the client-provided fields: `name`, `title`, `description`.
- **`@RequestBody`:** Spring annotation that deserializes the HTTP request body JSON into a Java object.
- **`@Valid` / `@NotBlank`:** Bean Validation annotations used to enforce required-field constraints on the DTO.
- **`201 Created`:** HTTP status returned when the request is successfully persisted.
- **`400 Bad Request`:** HTTP status returned when any required field is missing or blank.

---

### Sub-features

- `POST /api/requests` endpoint accepting JSON body
- Server-side required-field validation (name, title, description must be non-blank)
- Persistence via `RequestRepository.save()`
- Server-assigns `id` and `created_at` — these are never accepted from the client
- Returns `201 Created` with the full saved `Request` entity as JSON
- Returns `400 Bad Request` with an error message if validation fails

---

### Process

1. Client sends `POST http://localhost:8080/api/requests` with `Content-Type: application/json` and body:
   ```json
   {
     "name": "Alice",
     "title": "Fix login bug",
     "description": "The login page crashes on mobile browsers."
   }
   ```
2. Spring deserializes the JSON body into a `RequestDto` object.
3. Controller validates the DTO:
   - If `name` is null or blank → return `400 Bad Request` with error body.
   - If `title` is null or blank → return `400 Bad Request` with error body.
   - If `description` is null or blank → return `400 Bad Request` with error body.
4. Controller maps `RequestDto` to a new `Request` entity (copies `name`, `title`, `description`).
5. Controller calls `requestRepository.save(request)`.
6. JPA triggers `@PrePersist`, setting `createdAt = LocalDateTime.now()`.
7. H2 auto-generates and assigns `id`.
8. Controller returns `ResponseEntity` with HTTP `201 Created` and the saved `Request` entity serialized as JSON.

---

### Inputs

**HTTP Request:**
- Method: `POST`
- Path: `/api/requests`
- Header: `Content-Type: application/json`
- Header: `Origin: http://localhost:5173` (for CORS)

**Request Body (JSON):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Name of the person submitting the request |
| `title` | string | Yes | Short title of the request |
| `description` | string | Yes | Full description of the request |

**Fields that must NOT be accepted from client (server-assigned):**
- `id` — ignored if present in payload
- `createdAt` / `created_at` — ignored if present in payload

---

### Outputs

**Success Response — `201 Created`:**
```json
{
  "id": 1,
  "name": "Alice",
  "title": "Fix login bug",
  "description": "The login page crashes on mobile browsers.",
  "createdAt": "2026-05-19T14:32:00"
}
```

**Error Response — `400 Bad Request`:**
```json
{
  "error": "Validation failed",
  "message": "All fields (name, title, description) are required."
}
```

---

### Validation Rules

- `name`: must be present in the JSON body and non-blank (not `""`, not `"   "`). Trimming behavior: if the value is whitespace-only it is treated as blank.
- `title`: must be present and non-blank (same rule).
- `description`: must be present and non-blank (same rule).
- No length limits, no format constraints, no regex validation.
- The `id` and `createdAt` fields, if present in the request body, are silently ignored.
- No deduplication check — identical payloads create separate records.

---

### Error States

| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| `name` is missing or blank | 400 | VALIDATION_FAILED | "All fields (name, title, description) are required." |
| `title` is missing or blank | 400 | VALIDATION_FAILED | "All fields (name, title, description) are required." |
| `description` is missing or blank | 400 | VALIDATION_FAILED | "All fields (name, title, description) are required." |
| Request body is not valid JSON | 400 | BAD_REQUEST | "Invalid request body." |
| H2 save fails (unexpected) | 500 | INTERNAL_ERROR | "An unexpected error occurred." |

---

### API Surface (this feature)

| Method | Path | Auth | Request Body | Success | Error |
|--------|------|------|--------------|---------|-------|
| POST | `/api/requests` | None | `{name, title, description}` | 201 + saved entity | 400, 500 |

Full request/response schema: see `Y1-api.md §POST /api/requests`.

---

### Schema Surface (this feature)

Writes to the `requests` table. See `Y0-schema.md` and F02 for full DDL.
