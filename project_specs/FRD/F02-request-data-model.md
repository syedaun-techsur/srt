---

## F02: Request Data Model & Persistence

**PRD Reference:** F2 | **Priority:** P0 | **Phase:** 1

**Description:** The `Request` entity is defined as a JPA-managed Java class and mapped to the `requests` table in H2. It carries all required fields and is persisted via a Spring Data JPA repository. This is the data backbone of the application — every backend endpoint (F3, F4) operates on this entity.

---

### Terminology

- **`Request` entity:** The Java class annotated with `@Entity` representing a single submitted request record.
- **`RequestRepository`:** The Spring Data JPA interface extending `JpaRepository<Request, Long>` that provides CRUD operations.
- **`id`:** The auto-generated primary key of type `Long`, assigned by H2 using an identity/sequence strategy.
- **`created_at`:** The server-assigned timestamp capturing when the record was persisted. Set automatically before save; never provided by the client.
- **`@GeneratedValue`:** JPA annotation that configures automatic primary key generation (`GenerationType.IDENTITY`).
- **`@Column(nullable = false)`:** JPA annotation enforcing NOT NULL at the database level for required fields.

---

### Sub-features

- `Request` Java entity class with all required fields and JPA annotations
- Auto-generated primary key (`id`) using `GenerationType.IDENTITY`
- Server-assigned `created_at` timestamp using `@PrePersist` or constructor assignment
- `RequestRepository` interface extending `JpaRepository<Request, Long>`
- H2 `requests` table auto-created on startup via Hibernate `ddl-auto=create-drop`

---

### Process

1. Create `Request.java` in the backend source with the following fields:
   - `id`: `Long`, `@Id`, `@GeneratedValue(strategy = GenerationType.IDENTITY)`
   - `name`: `String`, `@Column(nullable = false)`
   - `title`: `String`, `@Column(name = "title", nullable = false)`
   - `description`: `String`, `@Column(columnDefinition = "TEXT", nullable = false)`
   - `createdAt`: `LocalDateTime`, `@Column(name = "created_at", nullable = false, updatable = false)`
2. Add a `@PrePersist` lifecycle method (or set in constructor) to assign `createdAt = LocalDateTime.now()` before the entity is first persisted.
3. Create `RequestRepository.java` extending `JpaRepository<Request, Long>`. No custom query methods are needed for MVP.
4. On application startup (via F00 scaffold), Hibernate reads the entity and auto-creates the `requests` table in H2.
5. Verify table creation: H2 Console at `http://localhost:8080/h2-console` shows the `REQUESTS` table with correct columns.

---

### Inputs

- No runtime inputs. The entity is populated by the `POST /api/requests` endpoint (F3).
- **Build-time:** `Request.java` and `RequestRepository.java` source files.

---

### Outputs

- `requests` table created in H2 on startup with columns: `id`, `name`, `title`, `description`, `created_at`
- `RequestRepository` bean available for injection in service/controller classes
- All standard `JpaRepository` methods available: `save()`, `findAll()`, `findById()`, `deleteById()`

---

### Validation (data-level constraints)

- `name`: NOT NULL, must be a non-blank string (enforced at controller level in F3; enforced at DB level via `nullable = false`)
- `title`: NOT NULL, must be a non-blank string (same)
- `description`: NOT NULL, must be a non-blank string (same)
- `created_at`: NOT NULL, set by server — client must never provide this field
- `id`: auto-generated — client must never provide this field in POST payloads

---

### Error States

| Scenario | Behavior | Resolution |
|----------|----------|------------|
| Entity saved with null required field | H2 throws `ConstraintViolationException`; Spring returns 500 | Controller (F3) must validate before calling `save()` |
| `requests` table missing at runtime | JPA throws `TableNotFoundException` on first query | Verify `ddl-auto=create-drop` in `application.properties` (F00) |
| `RequestRepository` not found by Spring | `NoSuchBeanDefinitionException` at startup | Ensure `@Repository` or `@EnableJpaRepositories` is active (auto-configured by Spring Boot) |

---

### API Surface (this feature)

No endpoints defined in this feature. The `Request` entity and `RequestRepository` are consumed by F03 (POST) and F04 (GET). See `Y1-api.md`.

---

### Schema Surface (this feature)

This feature defines the sole database table. Full DDL is in `Y0-schema.md`.

**Table:** `requests`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | BIGINT | PRIMARY KEY, IDENTITY (auto-increment) |
| `name` | VARCHAR(255) | NOT NULL |
| `title` | VARCHAR(255) | NOT NULL |
| `description` | TEXT (CLOB) | NOT NULL |
| `created_at` | TIMESTAMP | NOT NULL |
