# Simple Request Tracker (SRT)

## What This Is

A lightweight web application where users submit simple requests via a form and a list view shows all submitted requests. Built to demonstrate end-to-end software delivery with React frontend, Java Spring Boot backend, and H2 in-memory database — zero external setup required.

## Core Value

A user submits a request through the form, the data is stored, and the list view immediately shows it — the complete create-and-display loop working end-to-end.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Request form with Name (text, required), Request Title (text, required), Description (textarea, required), and Submit button
- [ ] Required-field validation on form submit
- [ ] POST endpoint to receive and persist submitted requests
- [ ] H2 in-memory database with Request entity (id, name, title, description, created_at)
- [ ] GET endpoint to return all stored requests
- [ ] List/table view showing all submitted requests with columns: Name, Request Title, Description
- [ ] React frontend (Vite + TypeScript) scaffolded and connected to backend via CORS
- [ ] Spring Boot backend scaffolded with REST API

### Out of Scope

- Authentication — not needed for this demo scope
- External integrations — zero external dependencies by design
- Workflows / notifications — out of scope per product definition
- Advanced validation — required-field only, no complex rules
- Pagination — table shows all records, no pagination
- Persistent database — H2 in-memory is intentional (demo, zero setup)

## Context

This is a greenfield demo project. The goal is to demonstrate a full software delivery cycle in a simple, reproducible environment. Tech stack is fully prescribed:
- **Frontend:** React with Vite and TypeScript, minimal CSS
- **Backend:** Java Spring Boot with REST API
- **Storage:** H2 in-memory database (no Postgres, no external setup)
- **Connectivity:** CORS configured so frontend can reach backend

Two user personas:
- **Requester (Business User):** submits requests via the form
- **Viewer (Internal User):** reads the list of all submitted requests

Two screens:
1. Request submission — vertical form, fields stacked, Submit at bottom
2. Request list — full-width table of all stored requests

## Constraints

- **Tech Stack:** React + Vite + TypeScript frontend, Java Spring Boot backend, H2 in-memory DB — prescribed, no substitutions
- **Scope:** 2 phases only, keep simple
- **Storage:** H2 in-memory (intentional — demo/zero-setup constraint)
- **Validation:** Required-field only — no advanced validation in scope

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| H2 in-memory over Postgres | Zero setup, demo-friendly, no external dependencies | — Pending |
| 2-phase delivery | Tight scope: Phase 1 scaffold + list, Phase 2 form + submit flow | — Pending |
| Vite + TypeScript for frontend | Modern React scaffold, type safety, fast dev server | — Pending |

---
*Last updated: 2026-05-19 after initialization*
