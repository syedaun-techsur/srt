---
phase: 01-read-path
plan: 01
subsystem: api
tags: [spring-boot, java, h2, jpa, cors, rest-api, maven]

# Dependency graph
requires: []
provides:
  - Spring Boot backend running on port 8080
  - GET /api/requests endpoint returning JSON array
  - H2 in-memory database with requests table
  - CORS allowing http://localhost:5173
  - Maven wrapper (mvnw) for zero-setup startup
affects: [01-read-path, frontend-integration]

# Tech tracking
tech-stack:
  added: [spring-boot-3.2.0, spring-boot-starter-web, spring-boot-starter-data-jpa, h2-database, maven-wrapper]
  patterns: [JPA entity with @PrePersist lifecycle, Spring Data JPA repository, WebMvcConfigurer CORS config, ResponseEntity REST response]

key-files:
  created:
    - srt-backend/pom.xml
    - srt-backend/mvnw
    - srt-backend/src/main/java/com/example/srt/SrtApplication.java
    - srt-backend/src/main/java/com/example/srt/entity/Request.java
    - srt-backend/src/main/java/com/example/srt/repository/RequestRepository.java
    - srt-backend/src/main/java/com/example/srt/config/CorsConfig.java
    - srt-backend/src/main/java/com/example/srt/controller/RequestController.java
    - srt-backend/src/main/resources/application.properties
  modified: []

key-decisions:
  - "Java 21 used instead of Java 17 — Java 17 not available in the environment, Java 21 is compatible with Spring Boot 3.2.0"
  - "Spring Initializr unavailable (network unrestricted) — project scaffolded manually with correct structure"
  - "Maven wrapper generated via mvn wrapper:wrapper — provides zero-setup startup identical to Spring Initializr output"

patterns-established:
  - "CORS via WebMvcConfigurer — addCorsMappings on /** for localhost:5173"
  - "JPA entity with @PrePersist for created_at — no DB default needed"
  - "Spring Data JpaRepository — zero-boilerplate CRUD"

# Metrics
duration: 3min
completed: 2026-05-20
---

# Phase 1 Plan 01: Spring Boot Backend Read Path Summary

**Spring Boot 3.2 backend with H2 in-memory DB, JPA Request entity, and GET /api/requests endpoint serving empty JSON array with CORS for localhost:5173**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-20T02:02:22Z
- **Completed:** 2026-05-20T02:05:28Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Spring Boot 3.2.0 project scaffolded with Maven wrapper — `./mvnw spring-boot:run` works from fresh clone
- H2 in-memory database configured with `requests` table auto-created on startup via JPA DDL
- `GET /api/requests` returns `200 OK` with `[]` (empty array) from H2
- CORS allows `http://localhost:5173` for GET, POST, and OPTIONS on all routes

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Spring Boot project with Maven wrapper and dependencies** - `ab97a81` (feat)
2. **Task 2: Create Request entity, repository, CorsConfig, and GET endpoint** - `9d727d3` (feat)

**Plan metadata:** _(docs commit — see below)_

## Files Created/Modified
- `srt-backend/pom.xml` - Maven project with web, data-jpa, h2, test dependencies (Spring Boot 3.2.0, Java 21)
- `srt-backend/mvnw` - Maven wrapper script (chmod +x, executable)
- `srt-backend/.mvn/wrapper/maven-wrapper.properties` - Wrapper config pointing to Maven 3.9.9
- `srt-backend/src/main/java/com/example/srt/SrtApplication.java` - `@SpringBootApplication` entry point
- `srt-backend/src/main/resources/application.properties` - H2 datasource, JPA config, H2 console, Jackson ISO dates
- `srt-backend/src/main/java/com/example/srt/entity/Request.java` - JPA entity mapped to `requests` table with `@PrePersist` for `created_at`
- `srt-backend/src/main/java/com/example/srt/repository/RequestRepository.java` - Spring Data `JpaRepository<Request, Long>`
- `srt-backend/src/main/java/com/example/srt/config/CorsConfig.java` - `WebMvcConfigurer` allowing `http://localhost:5173`
- `srt-backend/src/main/java/com/example/srt/controller/RequestController.java` - `GET /api/requests` returning `ResponseEntity<List<Request>>`

## Decisions Made
- **Java 21 instead of Java 17:** Only Java 21 (`openjdk-21-jdk`) was available in the environment via `apt`. Spring Boot 3.2.0 fully supports Java 21 — no code changes needed.
- **Manual scaffold instead of Spring Initializr:** `start.spring.io` was unreachable (TLS connection reset). Project created manually using same structure and dependencies as Initializr would produce.
- **Maven wrapper via `mvn wrapper:wrapper`:** Since Maven was available (`apt install maven`), the wrapper was generated properly rather than written by hand — produces identical files to Spring Initializr output.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Used Java 21 instead of Java 17**
- **Found during:** Task 1 (Scaffold Spring Boot project)
- **Issue:** Plan specified Java 17 but only Java 21 is available in this environment
- **Fix:** Installed `openjdk-21-jdk` via `apt`, updated `pom.xml` `<java.version>` to 21
- **Files modified:** `srt-backend/pom.xml`
- **Verification:** `java -version` returns 21.0.11; `./mvnw compile` succeeds
- **Committed in:** `ab97a81` (Task 1 commit)

**2. [Rule 3 - Blocking] Spring Initializr unavailable — manual scaffold**
- **Found during:** Task 1 (Scaffold Spring Boot project)
- **Issue:** `curl https://start.spring.io/starter.tgz` failed with TLS connection reset — network access blocked
- **Fix:** Created project structure manually with identical files; used `mvn wrapper:wrapper` for the Maven wrapper
- **Files modified:** All srt-backend files created manually
- **Verification:** `./mvnw dependency:resolve` succeeded; `./mvnw compile` succeeded
- **Committed in:** `ab97a81` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both auto-fixes necessary for environment compatibility. Java 21 is a valid upgrade from Java 17 for Spring Boot 3.2.0. Manual scaffold produces identical result to Spring Initializr. No scope creep.

## Issues Encountered
None — all issues resolved via deviation rules.

## User Setup Required
None - no external service configuration required. Backend uses H2 in-memory database with zero external dependencies.

## How to Start the Backend
```bash
cd srt-backend
./mvnw spring-boot:run
```
Server starts on `http://localhost:8080`

## API Endpoint
- `GET /api/requests` → `200 OK` with `[]` (empty array when no data)
- CORS origin: `http://localhost:5173`
- H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:srtdb`, user: `sa`, password: empty)

## Next Phase Readiness
- Backend read path complete — `GET /api/requests` returns `200 []`
- Frontend (Plan 01-02) can connect to `http://localhost:8080/api/requests` via Axios/fetch
- Phase 2 will add `POST /api/requests` endpoint and request form

---
*Phase: 01-read-path*
*Completed: 2026-05-20*

## Self-Check: PASSED

All key files exist on disk. Both task commits (`ab97a81`, `9d727d3`) verified in git log.
