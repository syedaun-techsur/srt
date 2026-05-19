---

## Y3: Integration Points

**Scope:** All external system dependencies and integration contracts for SRT.

**Summary:** SRT has **zero external service integrations** by design. All dependencies are embedded within the application processes. This section documents the internal integration boundaries between the two co-running processes (frontend dev server and backend server).

---

### Integration Inventory

| Integration | Type | Direction | Notes |
|-------------|------|-----------|-------|
| React frontend → Spring Boot backend | HTTP/REST | Unidirectional (frontend calls backend) | Cross-origin (CORS required) |
| Spring Boot → H2 database | JDBC/JPA (in-process) | Bidirectional | H2 runs inside the JVM; not a network call |

---

### Integration 1: Frontend → Backend (HTTP REST over CORS)

**Type:** HTTP REST  
**Protocol:** HTTP/1.1  
**Transport:** localhost TCP (not external network)

| Property | Value |
|----------|-------|
| Frontend origin | `http://localhost:5173` (Vite dev server) |
| Backend base URL | `http://localhost:8080/api` |
| Auth mechanism | None |
| Content-Type | `application/json` |
| CORS policy | Configured in Spring Boot `WebMvcConfigurer`; allows `http://localhost:5173`, methods `GET POST OPTIONS`, all headers |

**Consumed endpoints:**

| Consumer Feature | Endpoint | Method |
|-----------------|----------|--------|
| F05 (Submission Form) | `/api/requests` | POST |
| F06 (Request List) | `/api/requests` | GET |

**CORS contract:**  
The backend MUST include the following headers on all API responses when the request includes `Origin: http://localhost:5173`:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: *
```
Preflight (`OPTIONS`) requests must also be handled — Spring Boot's `WebMvcConfigurer` does this automatically.

**Failure modes:**
- CORS headers absent → browser blocks all API calls (no error in backend logs; error only visible in browser console)
- Backend not running → all fetch calls fail with `TypeError: Failed to fetch`; frontend shows error states (F05, F06)

---

### Integration 2: Spring Boot → H2 (In-Process JDBC)

**Type:** In-process embedded database  
**Protocol:** JDBC (not a network socket — runs inside the same JVM)

| Property | Value |
|----------|-------|
| JDBC URL | `jdbc:h2:mem:srtdb` |
| Driver | `org.h2.Driver` |
| Username | `sa` |
| Password | (empty) |
| H2 Console URL | `http://localhost:8080/h2-console` |
| Schema lifecycle | Created on JVM startup; dropped on JVM shutdown |

**Dependencies:**
- `com.h2database:h2` must be on the classpath (included as a dependency in `pom.xml` or `build.gradle`).
- Spring Boot auto-configures `DataSource` via `spring.datasource.*` properties.

**Failure modes:**
- H2 dependency missing → `DataSource` auto-configuration fails at startup; application does not start
- `ddl-auto` not set to `create-drop` → table may not exist; JPA throws `TableNotFoundException` on first query

---

### Explicitly Excluded Integrations

The following integrations are **out of scope** and must NOT be added:

| Integration | Reason Excluded |
|-------------|----------------|
| External database (Postgres, MySQL, etc.) | Zero external setup is a core constraint |
| Authentication provider (Azure AD, Auth0, etc.) | Auth is explicitly out of scope |
| Email / notification service | Workflows are out of scope |
| Cloud storage or CDN | No deployment in scope |
| Any third-party API | Zero external dependencies by design |

---

### Developer Startup Sequence

To run SRT locally, only two processes need to be started — no external services:

```bash
# Terminal 1: Start backend
cd srt-backend
./mvnw spring-boot:run
# Backend ready: http://localhost:8080

# Terminal 2: Start frontend
cd srt-frontend
npm install
npm run dev
# Frontend ready: http://localhost:5173
```

Both processes must be running simultaneously for the full application to function.
