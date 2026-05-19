# Technical Architecture: Simple Request Tracker (SRT)

**Document ID:** TechArch-SRT  
**Version:** 1.0  
**Date:** 2026-05-19  
**Status:** Active  
**Based on:** PRD-SRT v1.0, FRD-SRT v1.0

---

## Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Component Architecture](#2-component-architecture)
3. [Data Model](#3-data-model)
4. [API Design](#4-api-design)
5. [Security Architecture](#5-security-architecture)
6. [Technology Stack](#6-technology-stack)
7. [Integration Points](#7-integration-points)

---

## 1. Architectural Overview

### Pattern

SRT follows a **two-tier client-server architecture**: a React single-page application (SPA) communicates with a Spring Boot REST API over HTTP. The backend embeds an H2 in-memory database within the JVM process, eliminating any external infrastructure dependency. There is no service layer beyond the REST controller — the scope is intentionally minimal.

```
┌──────────────────────────────────────────────────────────────┐
│  Developer Machine                                           │
│                                                              │
│  ┌─────────────────────────┐    HTTP/REST (CORS)             │
│  │   React SPA             │ ─────────────────────────────►  │
│  │   Vite Dev Server       │    localhost:8080/api           │
│  │   localhost:5173        │ ◄─────────────────────────────  │
│  │                         │                                  │
│  │  ┌───────────────────┐  │                                  │
│  │  │  App.tsx (shell)  │  │                                  │
│  │  ├───────────────────┤  │                                  │
│  │  │ SubmissionForm.tsx│  │                                  │
│  │  ├───────────────────┤  │                                  │
│  │  │ RequestList.tsx   │  │                                  │
│  │  └───────────────────┘  │                                  │
│  └─────────────────────────┘                                  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Spring Boot Application  (localhost:8080)            │   │
│  │                                                       │   │
│  │  ┌─────────────────────┐   ┌───────────────────────┐ │   │
│  │  │  RequestController  │──►│  RequestRepository     │ │   │
│  │  │  @RestController    │   │  JpaRepository<Long>   │ │   │
│  │  │  /api/requests      │   └──────────┬────────────┘ │   │
│  │  └─────────────────────┘              │ JPA/Hibernate │   │
│  │                                       ▼               │   │
│  │                          ┌────────────────────────┐   │   │
│  │                          │  H2 In-Memory Database │   │   │
│  │                          │  jdbc:h2:mem:srtdb     │   │   │
│  │                          │  TABLE: requests       │   │   │
│  │                          └────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Deployment Topology

SRT runs entirely on a single developer machine with two co-running processes:

| Process | Runtime | Port | Start Command |
|---------|---------|------|---------------|
| Spring Boot backend | JDK 17+ | 8080 | `./mvnw spring-boot:run` |
| Vite dev server (React frontend) | Node.js 18+ | 5173 | `npm run dev` |

No Docker, no cloud deployment, no external services. Both processes are started manually from their respective project directories.

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| H2 in-memory (not Postgres) | Zero external setup; demo restarts cleanly; data loss on restart is acceptable |
| Hibernate `ddl-auto=create-drop` | Schema always matches entity definition; no migrations needed |
| No service layer (controller → repository direct) | Scope has a single entity with no business logic; a service layer adds no value |
| Native `fetch` API (no Axios) | No additional dependency; browser-native; sufficient for two simple calls |
| State-based navigation (no React Router required) | Two views; a `useState` toggle in `App.tsx` is adequate; Router is optional |
| Manual validation (no Bean Validation framework on DTO) | Three fields, one rule each; framework overhead is unwarranted |

---

## 2. Component Architecture

### Backend Components

```
src/main/java/com/example/srt/
├── SrtApplication.java           ← @SpringBootApplication entry point
├── config/
│   └── CorsConfig.java           ← WebMvcConfigurer CORS bean
├── controller/
│   └── RequestController.java    ← @RestController for /api/requests
├── dto/
│   └── RequestDto.java           ← Incoming POST payload (name, title, description)
├── entity/
│   └── Request.java              ← @Entity mapped to requests table
└── repository/
    └── RequestRepository.java    ← JpaRepository<Request, Long>
```

#### `SrtApplication.java`
- Entry point annotated with `@SpringBootApplication`.
- No custom startup logic required beyond Spring Boot auto-configuration.

#### `CorsConfig.java`
- Implements `WebMvcConfigurer`.
- Registers a CORS mapping for `/**`.
- Allows origin `http://localhost:5173`, methods `GET POST OPTIONS`, all headers (`*`).
- Must be a `@Configuration` bean so Spring picks it up automatically.

#### `RequestController.java`
- Annotated `@RestController`, `@RequestMapping("/api/requests")`.
- **`GET /api/requests`** — calls `repository.findAll()`, returns `ResponseEntity<List<Request>>` with `200 OK`.
- **`POST /api/requests`** — accepts `@RequestBody RequestDto`, validates all three fields non-blank, maps to `Request` entity, calls `repository.save()`, returns `ResponseEntity<Request>` with `201 Created`.
- Validation failure returns `400 Bad Request` with a `Map<String, String>` error body.
- Unexpected exceptions propagate to a `@ExceptionHandler` or Spring's default error mechanism returning `500`.

#### `RequestDto.java`
- Plain Java class (or `record`) with three `String` fields: `name`, `title`, `description`.
- No `id` or `createdAt` fields — these are never accepted from the client.
- Jackson deserializes the POST body into this type.

#### `Request.java`
- JPA entity mapped to the `requests` table.
- Fields: `id` (Long, auto-generated), `name`, `title`, `description`, `createdAt` (LocalDateTime).
- `@PrePersist` method sets `createdAt = LocalDateTime.now()` before first save.

#### `RequestRepository.java`
- Extends `JpaRepository<Request, Long>`.
- No custom query methods needed for MVP.
- Spring Boot auto-configures the bean via `@EnableJpaRepositories`.

---

### Frontend Components

```
srt-frontend/src/
├── main.tsx                      ← React DOM entry point
├── App.tsx                       ← App shell — navigation + view toggle
├── constants.ts                  ← API_BASE_URL = "http://localhost:8080/api"
├── types.ts                      ← Request TypeScript interface
├── components/
│   ├── SubmissionForm.tsx        ← F5: Request submission form
│   └── RequestList.tsx           ← F6: Request list table
├── index.css                     ← Minimal baseline CSS
└── App.css                       ← Optional app-level styles
```

#### `App.tsx`
- Top-level shell component.
- Holds `activeView` state: `'form' | 'list'`.
- Renders two navigation controls (buttons or links): "Submit Request" → sets view to `'form'`; "View Requests" → sets view to `'list'`.
- Conditionally renders `<SubmissionForm />` or `<RequestList />` based on `activeView`.
- On successful form submission, `SubmissionForm` calls a callback that switches `activeView` to `'list'`.

#### `constants.ts`
- Exports `API_BASE_URL = "http://localhost:8080/api"`.
- Single source of truth for the backend URL — no other file hardcodes this value.

#### `types.ts`
- Exports the `SrtRequest` TypeScript interface (see Section 4).

#### `SubmissionForm.tsx` (F5)
- Controlled form with three `useState` fields: `name`, `title`, `description`.
- On submit: runs client-side trim validation → shows inline errors per field → if valid, POSTs to `API_BASE_URL/requests`.
- Submit button disabled during in-flight API call (`isSubmitting` state).
- On `201` success: resets fields, calls `onSuccess()` callback to navigate to list view.
- On API error: shows form-level error message; preserves field values.

#### `RequestList.tsx` (F6)
- On mount (`useEffect` with `[]`): fetches `GET API_BASE_URL/requests`.
- Three render states: `loading` (optional spinner/text), `error` (fetch failed), `data` (renders table or empty-state).
- Table columns: **Name**, **Request Title**, **Description**. `id` and `createdAt` not rendered.
- Empty-state message: "No requests submitted yet."
- Error message: "Failed to load requests. Please try again."

---

## 3. Data Model

### Entity Relationship Diagram

SRT has a single entity. No relationships, no foreign keys.

```
┌──────────────────────────────────────────┐
│                 requests                 │
├──────────────────────────────────────────┤
│  id          BIGINT    PK  AUTO-INCREMENT│
│  name        VARCHAR(255)  NOT NULL      │
│  title       VARCHAR(255)  NOT NULL      │
│  description CLOB          NOT NULL      │
│  created_at  TIMESTAMP     NOT NULL      │
└──────────────────────────────────────────┘
```

### DDL (H2-Compatible)

```sql
-- ============================================================
-- Table: requests
-- Managed by: Hibernate ddl-auto=create-drop
-- Lifecycle: created on Spring Boot startup, dropped on shutdown
-- ============================================================
CREATE TABLE requests (
    id          BIGINT          GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name        VARCHAR(255)    NOT NULL,
    title       VARCHAR(255)    NOT NULL,
    description CLOB            NOT NULL,
    created_at  TIMESTAMP       NOT NULL
);
```

### Column Definitions

| Column | Java Field | Java Type | SQL Type | Constraints | Notes |
|--------|-----------|-----------|----------|-------------|-------|
| `id` | `id` | `Long` | `BIGINT` | PRIMARY KEY, AUTO-INCREMENT | Auto-generated by H2 identity column; never accepted from client |
| `name` | `name` | `String` | `VARCHAR(255)` | NOT NULL | Submitter's display name |
| `title` | `title` | `String` | `VARCHAR(255)` | NOT NULL | Short title of the request |
| `description` | `description` | `String` | `CLOB` | NOT NULL | Full request description; unbounded length |
| `created_at` | `createdAt` | `LocalDateTime` | `TIMESTAMP` | NOT NULL | Server-assigned via `@PrePersist`; never accepted from client |

### Index Strategy

H2 automatically indexes the primary key column (`id`). No additional indexes are required — the only query pattern is a full table scan (`SELECT * FROM requests`), which is acceptable for a demo with no performance SLA.

### JPA Entity — `Request.java`

```java
package com.example.srt.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
```

### Data Lifecycle

| Event | Behavior |
|-------|----------|
| Spring Boot startup | `requests` table created empty in H2 JVM memory |
| `POST /api/requests` | One row inserted; `id` and `created_at` assigned by server |
| `GET /api/requests` | All rows read; no data modification |
| Spring Boot shutdown | `requests` table dropped; all data permanently lost |
| Spring Boot restart | Table re-created empty (fresh state, by design) |

---

## 4. API Design

### Base URL

`http://localhost:8080/api`

### TypeScript Interfaces

```typescript
// types.ts

/** Represents a persisted request record returned by the backend. */
export interface SrtRequest {
  id: number;
  name: string;
  title: string;
  description: string;
  createdAt: string; // ISO 8601 datetime string, e.g. "2026-05-19T14:32:00"
}

/** Payload sent to POST /api/requests. */
export interface CreateRequestPayload {
  name: string;
  title: string;
  description: string;
}

/** Error response body returned on 400/500. */
export interface ApiError {
  error: string;   // machine-readable code, e.g. "Validation failed"
  message: string; // human-readable description
}
```

### Endpoint Catalog

| Method | Path | Feature | Auth | Description |
|--------|------|---------|------|-------------|
| GET | `/api/requests` | F04 | None | List all submitted requests |
| POST | `/api/requests` | F03 | None | Submit a new request |

---

### `GET /api/requests`

**Returns all stored requests as a JSON array. Always `200 OK` — returns `[]` when no records exist.**

#### Request

```
GET /api/requests HTTP/1.1
Host: localhost:8080
Origin: http://localhost:5173
```

No query parameters. No request body.

#### Responses

**`200 OK` — records exist:**
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

**`200 OK` — no records:**
```json
[]
```

**`500 Internal Server Error` — unexpected failure:**
```json
{
  "error": "Internal error",
  "message": "An unexpected error occurred."
}
```

#### Response Field Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Auto-generated primary key |
| `name` | `string` | Name of the requester |
| `title` | `string` | Short title of the request |
| `description` | `string` | Full description text |
| `createdAt` | `string` (ISO 8601) | Server timestamp when record was created |

#### Spring Boot Controller Signature

```java
@GetMapping
public ResponseEntity<List<Request>> getAllRequests() {
    List<Request> requests = requestRepository.findAll();
    return ResponseEntity.ok(requests);
}
```

---

### `POST /api/requests`

**Accepts a new request payload, validates required fields, persists the record, returns the created entity.**

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

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | Non-blank; whitespace-only treated as blank |
| `title` | string | Yes | Non-blank; whitespace-only treated as blank |
| `description` | string | Yes | Non-blank; whitespace-only treated as blank |

Fields `id` and `createdAt`, if present in the payload, are silently ignored.

#### Responses

**`201 Created` — success:**
```json
{
  "id": 1,
  "name": "Alice",
  "title": "Fix login bug",
  "description": "The login page crashes on mobile browsers.",
  "createdAt": "2026-05-19T14:32:00"
}
```

**`400 Bad Request` — validation failure:**
```json
{
  "error": "Validation failed",
  "message": "All fields (name, title, description) are required."
}
```

**`400 Bad Request` — malformed JSON:**
```json
{
  "error": "Bad request",
  "message": "Invalid request body."
}
```

**`500 Internal Server Error` — unexpected failure:**
```json
{
  "error": "Internal error",
  "message": "An unexpected error occurred."
}
```

#### Error Response Table

| Status | Condition | `error` value |
|--------|-----------|---------------|
| 201 | All fields valid; record saved | — |
| 400 | Any field is null or blank | `"Validation failed"` |
| 400 | Request body is not valid JSON | `"Bad request"` |
| 500 | Unexpected server/DB exception | `"Internal error"` |

#### Spring Boot Controller Signature

```java
@PostMapping
public ResponseEntity<?> createRequest(@RequestBody RequestDto dto) {
    if (dto.getName() == null || dto.getName().isBlank() ||
        dto.getTitle() == null || dto.getTitle().isBlank() ||
        dto.getDescription() == null || dto.getDescription().isBlank()) {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "Validation failed",
            "message", "All fields (name, title, description) are required."
        ));
    }
    Request request = new Request();
    request.setName(dto.getName());
    request.setTitle(dto.getTitle());
    request.setDescription(dto.getDescription());
    Request saved = requestRepository.save(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}
```

#### `RequestDto.java`

```java
package com.example.srt.dto;

public class RequestDto {
    private String name;
    private String title;
    private String description;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
```

### Jackson Configuration

Configure in `application.properties` to ensure `LocalDateTime` serializes as ISO 8601 string (not a numeric timestamp array):

```properties
spring.jackson.serialization.write-dates-as-timestamps=false
```

---

## 5. Security Architecture

### Authentication & Authorization

**None.** SRT explicitly has no authentication or authorization. All API endpoints are open. This is by design — SRT is a zero-friction demo application.

| Endpoint | Auth Required | Authorization |
|----------|--------------|---------------|
| `GET /api/requests` | No | Open to all |
| `POST /api/requests` | No | Open to all |

### CORS Policy

CORS is the only security-adjacent configuration in SRT. It controls which browser origin may call the backend API.

```
Allowed Origin:  http://localhost:5173
Allowed Methods: GET, POST, OPTIONS
Allowed Headers: * (all headers)
Exposed Headers: (none required)
Allow Credentials: false (not needed — no cookies, no auth)
```

**Spring Boot CORS configuration (`CorsConfig.java`):**

```java
package com.example.srt.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

### Input Validation

| Layer | Validation Type | Rule |
|-------|----------------|------|
| Frontend (client-side) | Required-field | `field.trim() !== ""` before API call |
| Backend (server-side) | Required-field | `field == null \|\| field.isBlank()` check in controller |
| Database (DB-level) | NOT NULL constraint | `NOT NULL` on `name`, `title`, `description`, `created_at` |

All three layers enforce the same constraint independently, providing defence-in-depth for the only validation rule in scope.

### Data Protection

- **No sensitive data is stored.** The `requests` table holds only name, title, description, and timestamp.
- **In-memory only.** H2 stores no data on disk; all records are lost on restart. No data retention risk.
- **No HTTPS.** Running on localhost only; TLS is out of scope for a local demo.
- **No secrets.** No API keys, passwords (H2 password is empty string by design), or tokens in the application.

### Error Handling — Security Considerations

- No stack traces in error responses (`server.error.include-stacktrace=never` — Spring Boot default).
- No internal state or database details leaked in `500` error messages.

---

## 6. Technology Stack

### Full Stack Table

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend — Build Tool** | Vite | 5.x | Fast dev server; React project scaffold |
| **Frontend — Framework** | React | 18.x | UI component library |
| **Frontend — Language** | TypeScript | 5.x | Type-safe JavaScript |
| **Frontend — HTTP Client** | Native `fetch` API | Browser built-in | REST calls to backend |
| **Frontend — CSS** | Vanilla CSS | — | Minimal baseline styling; no framework |
| **Backend — Framework** | Spring Boot | 3.x | REST API; auto-configuration |
| **Backend — Language** | Java | 17+ | Minimum LTS version required by Spring Boot 3 |
| **Backend — ORM** | Spring Data JPA / Hibernate | 6.x | Entity mapping; CRUD repository |
| **Backend — Database** | H2 | 2.x | In-memory embedded database |
| **Backend — Build Tool** | Maven (mvnw wrapper) | 3.x | Dependency management; build lifecycle |
| **Backend — JSON** | Jackson | 2.x | Automatic JSON serialization (Spring Boot default) |
| **Runtime — JDK** | JDK 17+ | 17 (LTS) | Java runtime for Spring Boot |
| **Runtime — Node.js** | Node.js | 18+ | npm + Vite runtime for frontend |

### Key Dependency Declarations

**`pom.xml` (Maven) — required dependencies:**

```xml
<dependencies>
    <!-- REST API -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- JPA + Hibernate ORM -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- H2 In-Memory Database -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

**`package.json` — required dependencies:**

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
```

### `application.properties` (complete)

```properties
# Server
server.port=8080

# H2 Datasource
spring.datasource.url=jdbc:h2:mem:srtdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# H2 Console (development only)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Jackson — serialize dates as ISO 8601 strings
spring.jackson.serialization.write-dates-as-timestamps=false

# Error handling — no stack traces in responses
server.error.include-stacktrace=never
```

---

## 7. Integration Points

### Integration Inventory

SRT has **zero external service integrations**. All components run in a single developer environment.

| Integration | Type | Direction | Boundary |
|-------------|------|-----------|----------|
| React SPA → Spring Boot | HTTP/REST over localhost TCP | Frontend calls backend | Cross-process (different ports) |
| Spring Boot → H2 | JDBC/JPA (in-process) | Bidirectional | In-JVM (not a network call) |

### Integration 1: React Frontend → Spring Boot Backend

```
React SPA (port 5173)  ──HTTP GET/POST──►  Spring Boot (port 8080)
                       ◄──JSON response──
```

| Property | Value |
|----------|-------|
| Protocol | HTTP/1.1 over localhost TCP |
| Frontend origin | `http://localhost:5173` |
| Backend base URL | `http://localhost:8080/api` |
| Content-Type | `application/json` |
| Auth | None |
| CORS policy | Backend allows `http://localhost:5173`; methods `GET POST OPTIONS`; all headers |

**Consumed endpoints:**

| Consumer | Endpoint | Method | Trigger |
|----------|----------|--------|---------|
| `SubmissionForm.tsx` | `/api/requests` | POST | Form submit (all fields valid) |
| `RequestList.tsx` | `/api/requests` | GET | Component mount (`useEffect`) |

**Frontend fetch pattern:**

```typescript
// POST example (SubmissionForm.tsx)
const response = await fetch(`${API_BASE_URL}/requests`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, title, description }),
});

// GET example (RequestList.tsx)
const response = await fetch(`${API_BASE_URL}/requests`);
const data: SrtRequest[] = await response.json();
```

**Failure modes:**

| Failure | Browser Behavior | Frontend Handling |
|---------|-----------------|-------------------|
| Backend not running | `TypeError: Failed to fetch` | Show error state in `RequestList`; show form-level error in `SubmissionForm` |
| CORS headers absent | Browser blocks request; no request reaches backend | Verify `CorsConfig.java` allows `http://localhost:5173` |
| Wrong backend port | `TypeError: Failed to fetch` | Check `constants.ts` matches `server.port` in `application.properties` |

### Integration 2: Spring Boot → H2 In-Process Database

```
Spring Boot JVM Process
├── RequestController
│     └── RequestRepository (JPA)
│           └── Hibernate ORM
│                 └── H2 Engine (in-JVM memory)
│                       └── jdbc:h2:mem:srtdb
```

| Property | Value |
|----------|-------|
| JDBC URL | `jdbc:h2:mem:srtdb` |
| Driver | `org.h2.Driver` |
| Username | `sa` |
| Password | (empty string) |
| Schema management | `ddl-auto=create-drop` — Hibernate creates/drops `requests` table |
| H2 console | `http://localhost:8080/h2-console` (development only) |

This integration is in-process — there is no network socket, no external database daemon, no container. H2 runs inside the same JVM that runs Spring Boot. The only "failure mode" is a missing H2 dependency or incorrect `ddl-auto` setting (see Section 5 error catalog).

---

*Generated by Pivota Spec TechArch Generator | Project: SRT | 2026-05-19*
