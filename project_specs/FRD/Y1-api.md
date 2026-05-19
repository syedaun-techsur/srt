---

## Y1: REST API Endpoint Catalog

**Scope:** All REST endpoints exposed by the Spring Boot backend. All endpoints are prefixed with `/api`. No authentication. CORS enabled for `http://localhost:5173`.

**Base URL:** `http://localhost:8080/api`  
**Content-Type:** `application/json` (all requests and responses)  
**Auth:** None — all endpoints are open

---

### Endpoint Index

| Method | Path | Feature | Description |
|--------|------|---------|-------------|
| GET | `/api/requests` | F04 | List all submitted requests |
| POST | `/api/requests` | F03 | Submit a new request |

---

### GET /api/requests

**Feature:** F04 — List All Requests  
**Description:** Returns all stored `Request` records as a JSON array. Returns `200 OK` with `[]` when no records exist.

#### Request

```
GET /api/requests HTTP/1.1
Host: localhost:8080
Origin: http://localhost:5173
```

No query parameters. No request body.

#### Response — 200 OK (records exist)

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

#### Response — 200 OK (empty)

```json
[]
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Auto-generated primary key |
| `name` | string | Name of the requester |
| `title` | string | Short title of the request |
| `description` | string | Full description text |
| `createdAt` | string (ISO 8601) | Server timestamp when record was created |

#### CORS Response Headers

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: *
```

#### Error Responses

| Status | Condition |
|--------|-----------|
| 500 | Unexpected database error |

---

### POST /api/requests

**Feature:** F03 — Submit Request  
**Description:** Accepts a new request payload, validates required fields, persists the record, and returns the created entity with HTTP `201 Created`.

#### Request

```
POST /api/requests HTTP/1.1
Host: localhost:8080
Origin: http://localhost:5173
Content-Type: application/json

{
  "name": "Alice",
  "title": "Fix login bug",
  "description": "The login page crashes on mobile browsers."
}
```

#### Request Body Schema

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `name` | string | Yes | Non-blank | Trimmed; whitespace-only = invalid |
| `title` | string | Yes | Non-blank | Trimmed; whitespace-only = invalid |
| `description` | string | Yes | Non-blank | Trimmed; whitespace-only = invalid |

Fields `id` and `createdAt` are silently ignored if present in the request body.

#### Response — 201 Created

```json
{
  "id": 1,
  "name": "Alice",
  "title": "Fix login bug",
  "description": "The login page crashes on mobile browsers.",
  "createdAt": "2026-05-19T14:32:00"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Auto-generated primary key |
| `name` | string | Submitted name (as stored) |
| `title` | string | Submitted title (as stored) |
| `description` | string | Submitted description (as stored) |
| `createdAt` | string (ISO 8601) | Server-assigned creation timestamp |

#### Response — 400 Bad Request (validation failure)

```json
{
  "error": "Validation failed",
  "message": "All fields (name, title, description) are required."
}
```

#### Response — 400 Bad Request (malformed JSON)

```json
{
  "error": "Bad request",
  "message": "Invalid request body."
}
```

#### Error Responses

| Status | Condition | Response Body |
|--------|-----------|---------------|
| 201 | Success | Saved `Request` entity |
| 400 | Missing/blank field or malformed JSON | Error object with `error` + `message` |
| 500 | Unexpected server/database error | Error object with `error` + `message` |

---

### Spring Boot Controller Implementation Notes

- Controller class: `RequestController.java` annotated with `@RestController` and `@RequestMapping("/api/requests")`
- `GET` handler: `@GetMapping` returning `ResponseEntity<List<Request>>`
- `POST` handler: `@PostMapping` with `@RequestBody RequestDto dto` parameter
- Validation: manual null/blank check on DTO fields, or use `@Valid` + `@NotBlank` on DTO with `@Validated` on the controller
- JSON serialization: Spring Boot auto-configures Jackson; `LocalDateTime` serialized as ISO 8601 string (configure `spring.jackson.serialization.write-dates-as-timestamps=false` if needed)
