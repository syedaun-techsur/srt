---
phase: 02-write-path
plan: "01"
subsystem: api
tags: [spring-boot, java, rest-api, bean-validation, jpa, post-endpoint]

# Dependency graph
requires:
  - phase: 01-read-path
    provides: Spring Boot scaffold with GET /api/requests, Request entity, H2 DB, CORS config
provides:
  - POST /api/requests endpoint returning 201 Created with full record (id, name, title, description, createdAt)
  - RequestDto with @NotBlank validation on name, title, description
  - 400 Bad Request on blank field validation failure
  - spring-boot-starter-validation in pom.xml
affects:
  - 02-02-PLAN.md (SubmissionForm can now POST to backend and handle 201/400 responses)
  - FORM-01/02/03/04 features

# Tech tracking
tech-stack:
  added:
    - spring-boot-starter-validation (Bean Validation @NotBlank/@Valid support)
  patterns:
    - DTO pattern: RequestDto for incoming POST body (keeps entity fields clean)
    - @Valid @RequestBody on controller method parameter for automatic 400 on constraint violations
    - ResponseEntity.status(HttpStatus.CREATED).body(saved) for explicit 201 response

key-files:
  created:
    - srt-backend/src/main/java/com/example/srt/dto/RequestDto.java
  modified:
    - srt-backend/src/main/java/com/example/srt/controller/RequestController.java
    - srt-backend/pom.xml

key-decisions:
  - "Used DTO pattern (RequestDto) to separate incoming payload from JPA entity — prevents exposing entity internals and allows independent validation"
  - "spring-boot-starter-validation added explicitly — Spring Boot 3.x does not include Bean Validation in starter-web by default"

patterns-established:
  - "DTO pattern: separate RequestDto for POST body validation, entity for persistence"
  - "@Valid @RequestBody: Spring MVC returns 400 automatically when @NotBlank constraints fail"

# Metrics
duration: 1min
completed: 2026-05-21
---

# Phase 2 Plan 1: POST /api/requests Endpoint Summary

**Spring Boot POST endpoint with Bean Validation: 201 Created on valid body, 400 Bad Request on blank fields; RequestDto with @NotBlank on name/title/description**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-05-21T22:47:00Z
- **Completed:** 2026-05-21T22:47:41Z
- **Tasks:** 1
- **Files modified:** 3

## Accomplishments
- `RequestDto` created with `@NotBlank` constraints on `name`, `title`, `description`
- `POST /api/requests` added to `RequestController` — validates DTO, maps to entity, persists, returns `201 Created` with full record
- `GET /api/requests` preserved exactly as before (no regression)
- `spring-boot-starter-validation` added to `pom.xml` (required for Bean Validation in Spring Boot 3.x)
- Backend compiles cleanly (`./mvnw compile` exits 0)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add RequestDto and POST /api/requests endpoint** - `44d4958` (feat)

## Files Created/Modified
- `srt-backend/src/main/java/com/example/srt/dto/RequestDto.java` - DTO with @NotBlank on name, title, description
- `srt-backend/src/main/java/com/example/srt/controller/RequestController.java` - POST endpoint added; GET preserved
- `srt-backend/pom.xml` - spring-boot-starter-validation dependency added

## Decisions Made
- **DTO pattern:** Used `RequestDto` to separate incoming POST body from the JPA `Request` entity. Keeps validation concerns out of the entity and avoids exposing generated fields (id, createdAt) as settable in the request body.
- **Explicit validation starter:** Spring Boot 3.x starter-web does NOT bundle Bean Validation by default; `spring-boot-starter-validation` must be declared explicitly.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `POST /api/requests` fully operational
- Frontend SubmissionForm (02-02) can POST `{"name":"...","title":"...","description":"..."}` and expect:
  - `201 Created` with JSON body including `id` and `createdAt` on success
  - `400 Bad Request` when any field is blank/missing
- No changes to GET endpoint — RequestList component continues to work

---
*Phase: 02-write-path*
*Completed: 2026-05-21*

## Self-Check: PASSED

All key files verified present on disk:
- ✅ srt-backend/src/main/java/com/example/srt/dto/RequestDto.java
- ✅ srt-backend/src/main/java/com/example/srt/controller/RequestController.java
- ✅ srt-backend/pom.xml
- ✅ .planning/phases/02-write-path/02-01-SUMMARY.md

Commits verified:
- ✅ 44d4958 — feat(02-01): add RequestDto and POST /api/requests endpoint
