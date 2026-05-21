---
phase: 02-write-path
plan: "01"
subsystem: api
tags: [spring-boot, java, rest-api, dto, post-endpoint, validation]

# Dependency graph
requires:
  - phase: 01-read-path
    provides: Spring Boot 3.5.0 backend, Request JPA entity, RequestRepository, CORS config, GET /api/requests
provides:
  - POST /api/requests endpoint accepting name/title/description JSON body
  - RequestDto class for POST request body deserialization
  - Required-field validation returning 400 on blank/missing fields
  - 201 Created response with saved Request entity (id, createdAt)
  - GET /api/requests continues to work (no regression)
affects:
  - 02-02-PLAN.md (frontend SubmissionForm calls this POST endpoint)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - DTO pattern for POST request body (RequestDto separate from entity)
    - Manual required-field validation with isBlank helper (no Bean Validation dependency)
    - ResponseEntity<?> wildcard return type for multi-response (201/400) endpoints

key-files:
  created:
    - srt-backend/src/main/java/com/example/srt/dto/RequestDto.java
  modified:
    - srt-backend/src/main/java/com/example/srt/controller/RequestController.java

key-decisions:
  - "Used manual isBlank() validation instead of @Valid/@NotBlank — avoids adding spring-boot-starter-validation dependency, sufficient for required-field-only constraint"
  - "ResponseEntity<?> wildcard return type allows returning both List<Request> (GET) and error Map (POST 400) from same controller class"

patterns-established:
  - "DTO pattern: separate RequestDto for POST body, Request entity for JPA persistence — no @RequestBody directly on entity"
  - "Validation inline in controller: simple isBlank helper, no annotation-based validation for this scope"

# Metrics
duration: 1min
completed: 2026-05-21
---

# Phase 2 Plan 1: POST /api/requests Endpoint Summary

**POST /api/requests endpoint with RequestDto, required-field validation (400 on blank), and 201 Created response with saved entity including id and createdAt**

## Performance

- **Duration:** 1 min
- **Started:** 2026-05-21T20:39:25Z
- **Completed:** 2026-05-21T20:39:58Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- `RequestDto` created in new `dto/` package with name/title/description fields and standard getters/setters
- `RequestController` extended with `@PostMapping` handler that validates required fields
- Blank or null field returns `400 Bad Request` with `{"error": "Validation failed", "message": "name, title, and description are required"}`
- Valid request persisted via JPA and returned as `201 Created` with entity JSON (includes server-assigned `id` and `createdAt`)
- `GET /api/requests` endpoint unchanged — no regression
- Backend compiles cleanly (`./mvnw compile` exits 0)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create RequestDto and add POST endpoint to RequestController** - `defee05` (feat)

**Plan metadata:** (to be committed with this SUMMARY)

## Files Created/Modified
- `srt-backend/src/main/java/com/example/srt/dto/RequestDto.java` - DTO for POST request body (name, title, description with getters/setters)
- `srt-backend/src/main/java/com/example/srt/controller/RequestController.java` - Extended with @PostMapping createRequest, validation logic, and isBlank helper

## Decisions Made
- **Manual validation over @Valid/@NotBlank:** Adding `spring-boot-starter-validation` dependency for required-field-only validation would be over-engineering. The `isBlank()` helper is self-contained and readable.
- **ResponseEntity<?> wildcard:** Allows the same controller to return typed `List<Request>` on GET and error `Map<String,String>` on POST 400 without casting issues.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- POST /api/requests is ready for the frontend SubmissionForm to call
- CORS already configured for `http://localhost:5173` in Phase 1 — POST requests will not be blocked
- Ready for Plan 02-02: React SubmissionForm component

---
*Phase: 02-write-path*
*Completed: 2026-05-21*

## Self-Check: PASSED

All key files verified present on disk:
- ✅ srt-backend/src/main/java/com/example/srt/dto/RequestDto.java
- ✅ srt-backend/src/main/java/com/example/srt/controller/RequestController.java
- ✅ .planning/phases/02-write-path/02-01-SUMMARY.md

Commits verified:
- ✅ defee05 — feat(02-01): add RequestDto and POST /api/requests endpoint
