---
phase: 01-read-path
plan: "01"
subsystem: api
tags: [spring-boot, java, h2, jpa, cors, rest-api]

# Dependency graph
requires: []
provides:
  - Spring Boot 3.5.0 backend running on port 8080
  - H2 in-memory database with requests table auto-created on startup
  - Request JPA entity (id, name, title, description, created_at)
  - GET /api/requests endpoint returning JSON array
  - CORS allowing http://localhost:5173 on all /api/** endpoints
  - H2 console at /h2-console
affects:
  - 01-02-PLAN.md (frontend connects to this backend via GET /api/requests)
  - Phase 2 (POST endpoint will extend this backend)

# Tech tracking
tech-stack:
  added:
    - Spring Boot 3.5.0 (upgraded from planned 3.2.0 — no longer supported by Initializr)
    - Java 21 OpenJDK (Java 17 not available in environment; 21 is LTS and compatible)
    - spring-boot-starter-web
    - spring-boot-starter-data-jpa
    - h2 (runtime scope)
  patterns:
    - Constructor injection for repositories in controllers
    - JPA @PrePersist for auto-setting createdAt timestamp
    - WebMvcConfigurer for CORS configuration (not @CrossOrigin per-controller)
    - application.properties for all datasource/JPA/H2 config

key-files:
  created:
    - srt-backend/pom.xml
    - srt-backend/mvnw
    - srt-backend/src/main/java/com/example/srt/SrtApplication.java
    - srt-backend/src/main/resources/application.properties
    - srt-backend/src/main/java/com/example/srt/entity/Request.java
    - srt-backend/src/main/java/com/example/srt/repository/RequestRepository.java
    - srt-backend/src/main/java/com/example/srt/config/CorsConfig.java
    - srt-backend/src/main/java/com/example/srt/controller/RequestController.java
  modified: []

key-decisions:
  - "Used Spring Boot 3.5.0 instead of 3.2.0 — Spring Initializr minimum is now >=3.5.0"
  - "Used Java 21 instead of Java 17 — only Java 21 available in the environment; both compatible with Spring Boot 3.x"
  - "POST endpoint omitted from RequestController — Phase 2 scope only; GET-only controller per plan"

patterns-established:
  - "Constructor injection: repositories injected via constructor, not @Autowired field injection"
  - "CORS via WebMvcConfigurer: global CorsConfig class, not per-controller @CrossOrigin annotations"
  - "H2 in-memory: jdbc:h2:mem:srtdb with ddl-auto=create-drop; data lost on restart by design"

# Metrics
duration: 3min
completed: 2026-05-20
---

# Phase 1 Plan 1: Spring Boot Backend Scaffold Summary

**Spring Boot 3.5.0 backend with H2 in-memory database, JPA Request entity, CORS config, and GET /api/requests returning `[]` on a fresh start**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-20T16:33:55Z
- **Completed:** 2026-05-20T16:37:39Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Spring Boot 3.5.0 project scaffolded with Maven wrapper (executable `mvnw`)
- H2 in-memory database configured with `requests` table auto-created by Hibernate on startup
- Request JPA entity with all required fields: id, name, title, description, created_at
- GET /api/requests endpoint returning `200 []` (verified with live backend)
- CORS configured allowing `http://localhost:5173` — OPTIONS preflight returns 200 with correct `Access-Control-Allow-Origin` header
- H2 console accessible at `http://localhost:8080/h2-console`

## How to Start the Backend

```bash
cd srt-backend
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64  # if needed
./mvnw spring-boot:run
```

Backend starts on port 8080. No manual setup required.

## API Endpoint

- `GET /api/requests` → `200 OK` with `[]` (empty database) or JSON array of request objects
- CORS origin: `http://localhost:5173`
- H2 JDBC URL: `jdbc:h2:mem:srtdb` / username: `sa` / password: (empty)

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Spring Boot project with Maven wrapper and dependencies** - `e411d56` (chore)
2. **Task 2: Create Request entity, repository, CorsConfig, and GET endpoint** - `c50c398` (feat)

## Files Created/Modified

- `srt-backend/pom.xml` - Spring Boot 3.5.0 parent, web/jpa/h2 dependencies
- `srt-backend/mvnw` - Maven wrapper script (executable)
- `srt-backend/mvnw.cmd` - Maven wrapper for Windows
- `srt-backend/.mvn/wrapper/maven-wrapper.properties` - Maven 3.9.6 distribution URL
- `srt-backend/src/main/java/com/example/srt/SrtApplication.java` - @SpringBootApplication entry point
- `srt-backend/src/main/resources/application.properties` - H2, JPA, H2 console, Jackson config
- `srt-backend/src/main/java/com/example/srt/entity/Request.java` - JPA entity mapped to `requests` table
- `srt-backend/src/main/java/com/example/srt/repository/RequestRepository.java` - JpaRepository interface
- `srt-backend/src/main/java/com/example/srt/config/CorsConfig.java` - WebMvcConfigurer CORS for localhost:5173
- `srt-backend/src/main/java/com/example/srt/controller/RequestController.java` - GET /api/requests endpoint

## Decisions Made

- **Spring Boot 3.5.0 instead of 3.2.0:** Spring Initializr now requires >=3.5.0; 3.5.0 is compatible with all planned code
- **Java 21 instead of Java 17:** Java 17 not available in the environment; Java 21 (LTS) is compatible with Spring Boot 3.x and all plan code
- **No POST endpoint in controller:** Phase 2 scope; GET-only per plan specification

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed Java 21 (Java not present in environment)**
- **Found during:** Task 1 (scaffolding)
- **Issue:** `java: command not found` — Java was not installed in the execution environment
- **Fix:** Installed `openjdk-21-jdk-headless` via apt (Java 17 not available; Java 21 is LTS and compatible)
- **Files modified:** System only (no project files affected)
- **Verification:** `java -version` → `OpenJDK 21.0.11`
- **Committed in:** Not in project commits (system dependency)

**2. [Rule 3 - Blocking] Used Spring Boot 3.5.0 instead of 3.2.0**
- **Found during:** Task 1 (Spring Initializr bootstrap)
- **Issue:** Spring Initializr returned HTTP 400: "Invalid Spring Boot version '3.2.0', Spring Boot compatibility range is >=3.5.0"
- **Fix:** Used `bootVersion=3.5.0` in Initializr request; Spring Boot 3.5.0 is API-compatible with all planned code
- **Files modified:** `srt-backend/pom.xml` (version `3.5.0` in parent)
- **Verification:** Dependencies resolved, application starts, all endpoints verified
- **Committed in:** e411d56 (Task 1 commit)

**3. [Rule 3 - Blocking] Used Java 21 in pom.xml**
- **Found during:** Task 1 (project scaffolding)
- **Issue:** Plan specified `javaVersion=17` but only Java 21 available; Spring Boot 3.5.0 also requires Java 17+
- **Fix:** Set `<java.version>21</java.version>` in pom.xml
- **Files modified:** `srt-backend/pom.xml`
- **Verification:** Build and runtime work correctly with Java 21
- **Committed in:** e411d56 (Task 1 commit)

**4. [Rule 3 - Blocking] Manually created project structure (tar extraction was partial)**
- **Found during:** Task 1
- **Issue:** `tar` received partial archive from Initializr (missing pom.xml, SrtApplication.java, application.properties); only mvnw scripts and test file were extracted
- **Fix:** Created all missing files manually per plan specifications; used exact code from plan
- **Files modified:** All srt-backend files
- **Verification:** `./mvnw dependency:resolve` succeeded
- **Committed in:** e411d56 (Task 1 commit)

---

**Total deviations:** 4 auto-fixed (all Rule 3 - Blocking)
**Impact on plan:** All fixes necessary to unblock execution in the environment. No scope changes. Spring Boot 3.5.0 and Java 21 are drop-in compatible with all plan specifications. No TechArch violations.

## Issues Encountered

- Spring Initializr no longer supports Spring Boot 3.2.0 (minimum 3.5.0 as of May 2026)
- Java 17 not available in environment — Java 21 substituted (fully compatible)
- Partial tar archive from Spring Initializr required manual file creation (resolved automatically)

## User Setup Required

None - no external service configuration required. H2 in-memory database requires zero setup.

## Next Phase Readiness

- Backend fully operational: `./mvnw spring-boot:run` starts on port 8080 with no errors
- `GET /api/requests` returns `200 []` — frontend can call this immediately
- CORS allows `http://localhost:5173` — no CORS errors expected from React dev server
- Ready for Plan 01-02: React+Vite frontend scaffold

---
*Phase: 01-read-path*
*Completed: 2026-05-20*

## Self-Check: PASSED

All key files verified present on disk:
- ✅ srt-backend/pom.xml
- ✅ srt-backend/mvnw
- ✅ srt-backend/src/main/java/com/example/srt/SrtApplication.java
- ✅ srt-backend/src/main/resources/application.properties
- ✅ srt-backend/src/main/java/com/example/srt/entity/Request.java
- ✅ srt-backend/src/main/java/com/example/srt/repository/RequestRepository.java
- ✅ srt-backend/src/main/java/com/example/srt/config/CorsConfig.java
- ✅ srt-backend/src/main/java/com/example/srt/controller/RequestController.java
- ✅ .planning/phases/01-read-path/01-01-SUMMARY.md

Commits verified:
- ✅ e411d56 — chore(01-01): scaffold Spring Boot project
- ✅ c50c398 — feat(01-01): add Request entity, repository, CorsConfig, GET endpoint
