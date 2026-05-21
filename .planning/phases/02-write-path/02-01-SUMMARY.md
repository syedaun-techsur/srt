---
phase: 02-write-path
plan: "01"
subsystem: api
tags: [spring-boot, java, post, dto, validation, rest-api]

# Dependency graph
requires:
  - phase: 01-read-path
    provides: "Plan 01-01 - Spring Boot backend, H2, Request entity, GET /api/requests"
provides:
  - RequestDto (name, title, description) — POST request body
  - POST /api/requests — 201 Created with saved record on success
  - POST /api/requests — 400 Bad Request with error JSON on blank field
  - GET /api/requests — still returns 200 OK (no regression)
affects:
  - 02-02-PLAN.md (frontend SubmissionForm calls this endpoint)

# Tech tracking
tech-stack:
  added:
    - RequestDto (plain Java class, no Jakarta validation — manual isBlank check)
  patterns:
    - Manual blank-check validation in controller (no @Valid / @NotBlank — keeps it simple per scope)
    - ResponseEntity<?> return type for mixed 201/400 responses
    - HashMap for error body ({"error": "...", "message": "..."})

key-files:
  created:
    - srt-backend/src/main/java/com/example/srt/dto/RequestDto.java
  modified:
    - srt-backend/src/main/java/com/example/srt/controller/RequestController.java
    - srt-backend/pom.xml (java.version 21 → 17)

key-decisions:
  - "Java 17 used (not 21) — only Java 17 available in environment this session; Spring Boot 3.5.0 supports Java 17+"
  - "Manual isBlank validation instead of @Valid/@NotBlank — simpler, no additional dependency, sufficient for scope"
  - "ResponseEntity<?> used for POST return type — needed to return both Request (201) and Map<String,String> (400)"

patterns-established:
  - "DTO pattern: separate RequestDto for POST body; entity not exposed directly in request"
  - "Error body: {\"error\": \"Validation failed\", \"message\": \"...\"}  consistent JSON error shape"

# Metrics
duration: 5min
completed: 2026-05-21
---

# Phase 2 Plan 01: POST Endpoint Summary

**RequestDto + POST /api/requests returning 201 on valid body, 400 on blank field; GET /api/requests unaffected**

## Performance

- **Duration:** 5 min
- **Completed:** 2026-05-21
- **Tasks:** 1
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments

- `RequestDto.java` created in new `dto/` package — plain Java DTO with name/title/description
- `RequestController.java` extended with `@PostMapping` — validates fields, persists via JPA, returns 201 with saved entity
- Blank/null field validation: returns 400 `{"error": "Validation failed", "message": "name, title, and description are required"}`
- GET /api/requests unbroken — verified 200 with array of submitted records
- Backend starts cleanly with Java 17 and Spring Boot 3.5.0

## API Contract

**POST /api/requests**
- Request: `{"name": "...", "title": "...", "description": "..."}`
- Success: `201 Created` — `{"id": 1, "name": "...", "title": "...", "description": "...", "createdAt": "2026-05-21T..."}`
- Blank field: `400 Bad Request` — `{"error": "Validation failed", "message": "name, title, and description are required"}`

**GET /api/requests** — still `200 OK` with JSON array (no regression)

## Commit

- `f811a53` — feat(02-01): add RequestDto and POST /api/requests endpoint

## Files Created/Modified

- `srt-backend/src/main/java/com/example/srt/dto/RequestDto.java` — DTO with name/title/description getters+setters
- `srt-backend/src/main/java/com/example/srt/controller/RequestController.java` — added @PostMapping with validation
- `srt-backend/pom.xml` — java.version updated 21 → 17 (Java 17 available this session)

## Decisions Made

- **Java 17 instead of 21:** Java 21 not installed in this session's environment; Java 17 is available and Spring Boot 3.5.0 supports Java 17+. Updated pom.xml accordingly.
- **Manual isBlank validation:** Kept simple — no Jakarta Validation dependency needed; `isBlank()` helper method in controller is sufficient per scope.

## Deviations from Plan

**1. [Rule 3 - Blocking] Java 17 instead of 21 in pom.xml**
- **Found during:** Task 1 (compile verification)
- **Issue:** Java 21 not available; default-jdk-headless installed Java 17
- **Fix:** Updated `<java.version>` from 21 to 17 in pom.xml; Spring Boot 3.5.0 supports Java 17+
- **Files modified:** `srt-backend/pom.xml`
- **Verification:** `./mvnw compile` succeeded; backend started and endpoints verified

## Next Phase Readiness

- POST endpoint fully operational; ready for frontend SubmissionForm (plan 02-02)
- CORS already allows POST from `http://localhost:5173` (configured in Phase 1 CorsConfig.java)

---
*Phase: 02-write-path*
*Completed: 2026-05-21*
