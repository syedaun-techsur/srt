---
phase: 02-write-path
plan: 01
subsystem: api
tags: [spring-boot, java, rest-api, post-endpoint, validation, dto, h2, jpa]

# Dependency graph
requires:
  - phase: 01-read-path
    provides: Spring Boot backend with GET /api/requests, H2 DB, JPA Request entity, CORS config
provides:
  - POST /api/requests endpoint accepting name/title/description
  - RequestDto for request body deserialization
  - Server-side field validation (null/blank check) returning 400 with error body
  - 201 Created response with saved entity including server-assigned id and createdAt
affects: [02-write-path, FORM-01, FORM-02, FORM-03, FORM-04]

# Tech tracking
tech-stack:
  added: []
  patterns: [DTO for request body separation from entity, ResponseEntity<?> for polymorphic 400/201 response, Map.of() for inline error body, null+isBlank() dual check for field validation]

key-files:
  created:
    - srt-backend/src/main/java/com/example/srt/dto/RequestDto.java
  modified:
    - srt-backend/src/main/java/com/example/srt/controller/RequestController.java

key-decisions:
  - "RequestDto has no id/createdAt fields — server assigns these, never accepted from client"
  - "Validation checks null OR isBlank() — whitespace-only strings treated as blank"
  - "400 error body uses Map.of() inline — no separate error DTO needed at this scope"
  - "Java 21 installed via sudo apt-get — Java was not in PATH in this execution environment"

patterns-established:
  - "DTO pattern: separate request body class from JPA entity — RequestDto vs Request"
  - "ResponseEntity<?> wildcard allows returning different body types per status code"
  - "All validation in controller — no @Valid annotations, manual null+isBlank() per TechArch"

# Metrics
duration: 2min
completed: 2026-05-20
---

# Phase 2 Plan 01: POST /api/requests Endpoint Summary

**POST /api/requests endpoint with RequestDto, null/blank validation returning 400, and 201 Created with server-assigned id and ISO 8601 createdAt**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-20T02:58:14Z
- **Completed:** 2026-05-20T03:00:19Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- Created `RequestDto.java` with name/title/description fields — separates request body from JPA entity
- Added `@PostMapping` to `RequestController` with null+isBlank() validation for all three fields
- Returns `201 Created` with full saved entity including server-assigned `id` and ISO 8601 `createdAt`
- Returns `400 Bad Request` with `{"error":"Validation failed","message":"All fields (name, title, description) are required."}` for any blank/null/whitespace field
- `GET /api/requests` preserved intact — returns all persisted records

## Task Commits

Each task was committed atomically:

1. **Task 1: Create RequestDto and add POST endpoint to RequestController** - `d147581` (feat)

**Plan metadata:** _(docs commit — see below)_

## Files Created/Modified
- `srt-backend/src/main/java/com/example/srt/dto/RequestDto.java` — Request body DTO with name/title/description getters/setters, no id/createdAt
- `srt-backend/src/main/java/com/example/srt/controller/RequestController.java` — Added @PostMapping with validation and 201/400 responses alongside existing @GetMapping

## How to Test the POST Endpoint

```bash
cd srt-backend
./mvnw spring-boot:run

# 201 Created — valid payload
curl -X POST http://localhost:8080/api/requests \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","title":"Fix login bug","description":"Login crashes on mobile."}' \
  -w "\n%{http_code}"
# Returns: {"id":1,"name":"Alice","title":"Fix login bug","description":"Login crashes on mobile.","createdAt":"2026-05-20T..."} 201

# 400 Bad Request — blank name
curl -X POST http://localhost:8080/api/requests \
  -H "Content-Type: application/json" \
  -d '{"name":"","title":"Test","description":"Test"}' \
  -w "\n%{http_code}"
# Returns: {"message":"All fields (name, title, description) are required.","error":"Validation failed"} 400

# 400 Bad Request — missing field (null)
curl -X POST http://localhost:8080/api/requests \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test"}' \
  -w "\n%{http_code}"
# Returns: 400

# GET all records
curl http://localhost:8080/api/requests
# Returns: [...] array with all submitted records
```

## Validation Behaviour

- **Triggers 400:** Any of name/title/description is null, empty string `""`, or whitespace-only `"   "`
- **Exact 400 body:** `{"error":"Validation failed","message":"All fields (name, title, description) are required."}`
- **id and createdAt:** Never accepted from client — `RequestDto` has no such fields; server assigns on save via `@PrePersist`
- **createdAt format:** ISO 8601 string (e.g. `"2026-05-20T03:00:01.481635"`) — Jackson configured with `write-dates-as-timestamps=false`

## Decisions Made
- **RequestDto has no id/createdAt:** Per TechArch — server assigns these, never accepted from client
- **Validation: null OR isBlank():** Handles null (missing JSON key) and blank/whitespace (empty/spaces) per spec
- **Map.of() for error body:** Simple inline map sufficient — no need for a separate error DTO at this scope
- **Java 21 re-installed:** Java was not in PATH in this execution environment; `sudo apt-get install openjdk-21-jdk` required (Rule 3 - Blocking auto-fix)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Java not in PATH — reinstalled OpenJDK 21**
- **Found during:** Task 1 (compile verification)
- **Issue:** `java` command not found; JAVA_HOME not set; `./mvnw compile` failed immediately
- **Fix:** `sudo apt-get install -y openjdk-21-jdk` and set `JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64`
- **Files modified:** None (system package installation)
- **Verification:** `java -version` returns 21.0.11; `./mvnw compile` succeeded with exit 0
- **Committed in:** N/A (system-level fix, not in task commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Java installation is an environment prerequisite, not a code change. No scope creep. All plan code written exactly as specified.

## Issues Encountered
None — all issues resolved via deviation rules.

## User Setup Required
None - no external service configuration required. Backend uses H2 in-memory database with zero external dependencies.

## Next Phase Readiness
- POST /api/requests fully operational — frontend SubmissionForm (Plan 02-02) can now submit to this endpoint
- GET /api/requests preserved — RequestList component continues to work
- Backend supports complete read+write operations; Phase 2 frontend work can proceed

---
*Phase: 02-write-path*
*Completed: 2026-05-20*

## Self-Check: PASSED

All key files exist on disk. Task commit `d147581` verified in git log.
