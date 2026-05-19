---

## Y2: Cross-Feature Error Catalog

**Scope:** All error conditions across all SRT features, with HTTP status codes, error codes, user-facing messages, and resolution guidance.

---

### Backend Error Catalog (API)

| HTTP Status | Error Code | Trigger | Response Body | Resolution |
|-------------|------------|---------|---------------|------------|
| 400 | `VALIDATION_FAILED` | POST body missing `name`, `title`, or `description` | `{"error":"Validation failed","message":"All fields (name, title, description) are required."}` | Client must send all three fields non-blank |
| 400 | `BAD_REQUEST` | POST body is not valid JSON | `{"error":"Bad request","message":"Invalid request body."}` | Client must send `Content-Type: application/json` with valid JSON |
| 500 | `INTERNAL_ERROR` | Unexpected exception (DB error, null pointer, etc.) | `{"error":"Internal error","message":"An unexpected error occurred."}` | Check server logs; verify H2 is running |

---

### Frontend Error Catalog (UI)

| Feature | Scenario | User-Visible Message | Form/State Behavior |
|---------|----------|---------------------|-------------------|
| F05 (Form) | `name` field is blank on submit | "Name is required." (below Name field) | No API call; field stays empty; error shown |
| F05 (Form) | `title` field is blank on submit | "Request title is required." (below Title field) | No API call; field stays empty; error shown |
| F05 (Form) | `description` field is blank on submit | "Description is required." (below Description field) | No API call; field stays empty; error shown |
| F05 (Form) | API returns 400 or 500 | "Submission failed. Please try again." (form-level) | Form preserved; Submit re-enabled |
| F05 (Form) | Network/fetch error | "Submission failed. Please try again." (form-level) | Form preserved; Submit re-enabled |
| F06 (List) | API returns 500 or fetch fails | "Failed to load requests. Please try again." | Table not rendered; error message shown |
| F06 (List) | API returns empty array | "No requests submitted yet." | Empty-state message rendered instead of table |

---

### Infrastructure Error Catalog

| Layer | Scenario | Behavior | Resolution |
|-------|----------|----------|------------|
| F00 (Backend) | Port 8080 already in use | Application fails to start: `Address already in use` | Kill process on 8080 |
| F00 (Backend) | JDK < 17 | Maven/Gradle compilation fails | Upgrade to JDK 17+ |
| F00 (Backend) | H2 dependency missing | Spring Boot fails to configure DataSource | Add `com.h2database:h2` to `pom.xml` |
| F00 (Backend) | CORS misconfigured | Browser blocks all API calls with CORS error | Verify `WebMvcConfigurer` allows `http://localhost:5173` |
| F01 (Frontend) | Port 5173 already in use | Vite starts on another port; CORS origin mismatch | Kill process on 5173 or update Spring Boot CORS config |
| F01 (Frontend) | Node.js version too old | `npm create vite` fails | Upgrade to Node.js 18+ |
| F02 (Entity) | `ddl-auto` not set | H2 table not created; JPA throws `TableNotFoundException` | Set `spring.jpa.hibernate.ddl-auto=create-drop` |

---

### Error Response Format (Backend)

All backend error responses follow this JSON structure:

```json
{
  "error": "<error code string>",
  "message": "<human-readable description>"
}
```

- `error`: A machine-readable code (e.g., `"Validation failed"`, `"Bad request"`, `"Internal error"`).
- `message`: A human-readable description suitable for display or logging.

No stack traces are included in error responses (Spring Boot default `server.error.include-stacktrace=never`).

---

### HTTP Status Code Reference

| Code | Name | Used For |
|------|------|---------|
| 200 | OK | Successful GET response |
| 201 | Created | Successful POST — new record saved |
| 400 | Bad Request | Missing/blank fields; malformed JSON |
| 500 | Internal Server Error | Unexpected backend failure |
