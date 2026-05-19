---

## F00: Spring Boot Backend Scaffold

**PRD Reference:** F0 | **Priority:** P0 | **Phase:** 1

**Description:** The Java Spring Boot application is initialized with all required dependencies and configuration to serve a REST API, connect to the H2 in-memory database, and accept cross-origin requests from the React frontend. This scaffold is the foundational layer that all backend features (F2, F3, F4) depend on. It must be runnable with a single command after a fresh clone.

---

### Terminology

- **Spring Initializr:** The Spring Boot project generator; the project is bootstrapped with `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, and `h2`.
- **`application.properties`:** The Spring Boot configuration file located at `src/main/resources/application.properties`. Defines port, datasource, JPA, and H2 console settings.
- **H2 Console:** The web-based H2 database browser available at `/h2-console` during development.
- **CORS Configuration:** A Spring `WebMvcConfigurer` bean that adds CORS mappings to allow requests from the frontend origin.
- **`ddl-auto`:** The Hibernate property controlling schema generation; set to `create-drop` so the table is created on startup and dropped on shutdown.

---

### Sub-features

- Spring Boot project structure initialized with Maven (or Gradle) wrapper
- Required dependencies declared: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `h2`
- `application.properties` configured with server port, H2 datasource, JPA DDL setting, and H2 console
- CORS configuration bean permitting all methods and headers from `http://localhost:5173`
- Application starts successfully with `./mvnw spring-boot:run` (or `./gradlew bootRun`)

---

### Process

1. Project is generated with `spring-boot-starter-web` (REST), `spring-boot-starter-data-jpa` (ORM), and `com.h2database:h2` (in-memory DB).
2. `application.properties` is written with the following settings:
   - `server.port=8080`
   - `spring.datasource.url=jdbc:h2:mem:srtdb`
   - `spring.datasource.driver-class-name=org.h2.Driver`
   - `spring.datasource.username=sa`
   - `spring.datasource.password=`
   - `spring.jpa.database-platform=org.hibernate.dialect.H2Dialect`
   - `spring.jpa.hibernate.ddl-auto=create-drop`
   - `spring.h2.console.enabled=true`
3. A `WebMvcConfigurer` bean (e.g., `CorsConfig.java`) is defined that:
   - Maps CORS to `/**` (all endpoints)
   - Allows origin `http://localhost:5173`
   - Allows methods: `GET`, `POST`, `OPTIONS`
   - Allows all headers (`*`)
4. Developer runs `./mvnw spring-boot:run`; application starts in under 30 seconds.
5. Health check: `GET http://localhost:8080/api/requests` returns `200 OK` with `[]`.

---

### Inputs

- **Build tool files** (`pom.xml` or `build.gradle`): declare dependencies — not a runtime input but required for project setup.
- **`application.properties`**: configuration file read at startup.

---

### Outputs

- Running HTTP server on `http://localhost:8080`
- H2 in-memory database initialized and ready
- H2 Console accessible at `http://localhost:8080/h2-console`
- CORS headers present on all API responses for `http://localhost:5173` origin

---

### Validation

- The application must start without errors when `./mvnw spring-boot:run` is executed from the project root.
- H2 datasource must connect successfully (verified by absence of `DataSource` errors in startup log).
- CORS must be active: a `GET /api/requests` request from `http://localhost:5173` must not be blocked by the browser.
- Server port must be `8080` (not the Spring Boot default conflict port).

---

### Error States

| Scenario | Behavior | Resolution |
|----------|----------|------------|
| Port 8080 already in use | Application fails to start with `Address already in use` | Kill the process on 8080 or change `server.port` |
| Missing H2 dependency | `DataSource` auto-configuration fails at startup | Add `com.h2database:h2` to build file |
| CORS misconfigured | Browser blocks API calls with CORS error | Verify `WebMvcConfigurer` bean includes correct allowed origin |
| JDK version < 17 | Compilation fails | Ensure JDK 17+ is installed and `JAVA_HOME` is set |

---

### API Surface (this feature)

No endpoints defined in this feature. F00 provides the infrastructure that F03 and F04 expose endpoints on. See `Y1-api.md` for the full endpoint catalog.

---

### Schema Surface (this feature)

No tables defined in this feature. F02 defines the `requests` table. See `Y0-schema.md` for the full DDL.
