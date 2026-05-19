# PRD: Simple Request Tracker (SRT)

**Document ID:** PRD-SRT  
**Version:** 1.0  
**Date:** 2026-05-19  
**Status:** Active

---

## 1. Executive Summary

The Simple Request Tracker (SRT) is a lightweight web application that enables users to submit named requests via a form and immediately view all submitted requests in a list. It is built as a fully self-contained demo — React + Vite + TypeScript frontend, Java Spring Boot backend, and H2 in-memory database — requiring zero external setup to run. The project demonstrates a complete end-to-end software delivery cycle in a reproducible, dependency-free environment.

---

## 2. Problem Statement

Development teams and technical stakeholders frequently need a minimal, working reference application to validate delivery pipelines, onboarding processes, or architectural patterns. Existing demo projects are either too complex (requiring databases, auth, external services) or too trivial (no real data flow). This creates friction when teams need to:

- Demonstrate a full create-and-display data loop
- Validate frontend-to-backend CORS connectivity
- Run a reproducible demo without environment configuration

**SRT solves this by:**
- Providing a two-screen application (form submission + list view) that covers the full request lifecycle
- Using H2 in-memory storage so the app runs anywhere with a single Java process
- Offering a prescribed, modern tech stack (React/Vite/TypeScript + Spring Boot) that is representative of real-world builds

---

## 3. Product Vision

**Vision Statement:** A zero-setup, end-to-end demo application that proves the full software delivery cycle works — from data entry to persistence to display — using a modern, representative tech stack.

**Strategic Goals:**
- Deliver a working create-and-display loop in two focused phases
- Eliminate all external dependencies (no database setup, no auth, no third-party services)
- Serve as a reliable reference for full-stack delivery pipelines
- Keep the scope minimal enough that the implementation is fully understandable at a glance

---

## 4. Target Users

### Requester (Business User)
A non-technical or semi-technical user who submits a request through the web form. They need a simple, clear form that accepts their name, a request title, and a description.

### Viewer (Internal User)
An internal stakeholder or developer who reads the list of all submitted requests. They need a clear, readable table that shows all entries without filters or pagination complexity.

---

## 5. Technical Architecture

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18 + Vite + TypeScript | Minimal CSS, fast dev server |
| Backend | Java Spring Boot | REST API, auto-configured |
| Storage | H2 in-memory database | No external setup; resets on restart |
| Connectivity | CORS (Spring Boot config) | Frontend-to-backend cross-origin calls |
| Build Tool | Maven or Gradle | Standard Spring Boot tooling |
| Dev Runtime | Node.js (frontend), JDK 17+ (backend) | Local only |

**Two screens:**
1. **Request Submission Screen** — vertical form with fields stacked, Submit button at bottom
2. **Request List Screen** — full-width table of all stored requests

---

## 6. Feature Requirements

### F0: Spring Boot Backend Scaffold
**Description:** The Java Spring Boot application is initialized with the required dependencies and configuration to serve a REST API, connect to H2, and accept CORS requests from the React frontend. This is the foundational layer all other backend features depend on.

**Capabilities:**
- Spring Boot project with Web, JPA, and H2 dependencies
- CORS configuration permitting requests from the frontend origin
- H2 in-memory database initialized on startup
- Application properties configured (port, datasource, H2 console)

**Priority:** P0 (Critical — MVP foundation)

---

### F1: React Frontend Scaffold
**Description:** The React application is scaffolded using Vite with TypeScript and wired to communicate with the Spring Boot backend. It provides the shell (routing, layout) into which the form and list screens are placed.

**Capabilities:**
- Vite + React + TypeScript project initialized
- Minimal CSS baseline (readable, functional, no framework dependency)
- HTTP client configured to reach the backend API (e.g., native fetch or axios)
- Two-screen routing or navigation (form view / list view)

**Priority:** P0 (Critical — MVP foundation)

---

### F2: Request Data Model & Persistence
**Description:** A `Request` entity is defined in the backend with all required fields and persisted to the H2 in-memory database via Spring Data JPA. This is the data backbone of the application.

**Capabilities:**
- `Request` entity with fields: `id` (auto-generated), `name` (string), `title` (string), `description` (text), `created_at` (timestamp)
- JPA repository for CRUD operations
- Table auto-created on startup via Hibernate DDL

**Priority:** P0 (Critical — MVP requirement)

---

### F3: POST Endpoint — Submit Request
**Description:** A REST endpoint accepts a new request payload from the frontend, validates that required fields are present, persists the record to H2, and returns the created entity.

**Capabilities:**
- `POST /api/requests` endpoint
- Accepts JSON body with `name`, `title`, `description`
- Persists record with server-assigned `id` and `created_at`
- Returns `201 Created` with the saved entity
- Returns `400 Bad Request` if any required field is missing

**Priority:** P0 (Critical — MVP requirement)

---

### F4: GET Endpoint — List All Requests
**Description:** A REST endpoint returns all stored requests from H2 as a JSON array, enabling the frontend list view to display all submissions.

**Capabilities:**
- `GET /api/requests` endpoint
- Returns JSON array of all `Request` records
- Returns `200 OK` with empty array `[]` when no requests exist
- No filtering, sorting, or pagination

**Priority:** P0 (Critical — MVP requirement)

---

### F5: Request Submission Form
**Description:** The frontend submission screen presents a vertical form with three required fields and a Submit button. On submit, the form posts data to the backend and provides feedback to the user.

**Capabilities:**
- Fields: **Name** (text input, required), **Request Title** (text input, required), **Description** (textarea, required)
- Required-field validation on submit — all three fields must be non-empty before the request is sent
- Inline error messages displayed for any blank required field
- On successful submission: form clears and/or user is redirected to the list view
- Submit button disabled or shows loading state during the API call

**Priority:** P0 (Critical — MVP requirement)

---

### F6: Request List View
**Description:** The frontend list screen displays all submitted requests in a full-width table. The table fetches data from the backend on load and renders every row without pagination.

**Capabilities:**
- Table columns: **Name**, **Request Title**, **Description**
- Fetches data from `GET /api/requests` on component mount
- Renders all records — no pagination, no filtering
- Shows an empty-state message when no requests exist (e.g., "No requests submitted yet.")
- Displays most recently submitted requests (natural DB insertion order)

**Priority:** P0 (Critical — MVP requirement)

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Zero external dependencies** | Application must run with only JDK 17+ and Node.js installed — no Docker, no database server, no external services |
| **Self-contained storage** | H2 in-memory database only; data loss on restart is acceptable and expected |
| **CORS** | Backend must accept requests from the Vite dev server origin (default: `http://localhost:5173`) |
| **Validation** | Required-field validation only — no regex, no length limits, no complex rules |
| **Scope discipline** | No authentication, no notifications, no pagination, no external integrations |
| **Reproducibility** | Any developer with JDK + Node can clone and run with standard `npm run dev` / `./mvnw spring-boot:run` commands |
| **Startup time** | Backend should start in under 30 seconds on a standard developer machine |

---

## 8. Out of Scope

The following items are explicitly excluded from this project:

- **Authentication & authorization** — all endpoints are open, no login required
- **External database** — no Postgres, MySQL, or any external storage
- **Persistent data** — H2 in-memory resets on restart by design
- **Pagination** — list view shows all records
- **Advanced validation** — required-field only; no format checks, length limits, or business rules
- **Notifications / workflows** — no email, webhook, or status tracking
- **Edit / delete operations** — read and create only
- **Deployment** — demo runs locally; no cloud deployment in scope

---

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| End-to-end create-display loop working | A submitted request appears in the list view immediately after form submission |
| Zero setup steps beyond JDK + Node | Developer can run both services with two commands from a fresh clone |
| Required-field validation active | Submitting a blank form shows inline errors and makes no API call |
| Backend API functional | `POST /api/requests` and `GET /api/requests` return correct responses |
| CORS working | Frontend can successfully call the backend without browser CORS errors |
| Empty-state handled | List view shows a message when no requests have been submitted |

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| CORS misconfiguration blocks frontend calls | Medium | High | Configure Spring Boot CORS explicitly for `http://localhost:5173`; test in Phase 1 |
| H2 schema drift between app restarts | Low | Low | Use Hibernate `ddl-auto=create-drop`; schema is always recreated from entity |
| Vite proxy vs. direct API URL confusion | Medium | Medium | Document the backend port clearly; optionally configure Vite proxy to avoid CORS in dev |
| Scope creep (pagination, auth, etc.) | Low | Medium | Out-of-scope items are explicitly listed; strict phase discipline enforced |

---

## 11. Delivery Phases

| Phase | Scope |
|-------|-------|
| **Phase 1** | Backend scaffold (F0) + Frontend scaffold (F1) + Data model (F2) + GET endpoint (F4) + List view (F6) |
| **Phase 2** | POST endpoint (F3) + Submission form with validation (F5) + end-to-end create-display loop verified |

---

## 12. Feature Index

| ID | Feature | Priority | Phase |
|----|---------|----------|-------|
| F0 | Spring Boot Backend Scaffold | P0 | 1 |
| F1 | React Frontend Scaffold | P0 | 1 |
| F2 | Request Data Model & Persistence | P0 | 1 |
| F3 | POST Endpoint — Submit Request | P0 | 2 |
| F4 | GET Endpoint — List All Requests | P0 | 1 |
| F5 | Request Submission Form | P0 | 2 |
| F6 | Request List View | P0 | 1 |

**Total features:** 7  
**P0 (Critical):** 7  
**P1–P3:** 0 (scope is fully critical-path for this demo)

---

*Generated by Pivota Spec PRD Generator | Project: SRT | 2026-05-19*
