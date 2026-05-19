## NaC-to-Acceptance Criteria Mapping

This section cross-checks each NaC against the formal acceptance criteria in UserStories-SRT to verify alignment. Each NaC should be supported by at least one acceptance criterion in the corresponding story.

| NaC-ID | NaC Statement | Story | Supporting Acceptance Criterion(a) | Aligned? |
|--------|---------------|-------|-------------------------------------|----------|
| NaC-01 | Navigation controls visible on page load; user reaches form in one click | US-1.2 | "Navigation controls (buttons or links) labeled 'Submit Request' and 'View Requests' are visible on every screen" | ✅ |
| NaC-02 | Three labeled fields in single vertical stack before user types; required intent clear at a glance | US-5.1 | "Form displays three labeled fields stacked vertically: Name, Request Title, Description" | ✅ |
| NaC-03 | Submit button disabled immediately on valid submit click; double-submission prevented | US-5.3 | "Submit button is disabled immediately after a valid form submission is initiated" + "A second click...has no effect" | ✅ |
| NaC-04 | Valid second submit succeeds; POST called exactly once | US-3.1 | "POST /api/requests with JSON body returns 201 Created" + "Identical payloads submitted twice create two separate records" | ✅ |
| NaC-05 | POST called; form clears and/or user redirected within 3 seconds of 201 | US-5.1 | "On 201 Created response, form fields are cleared" + "After successful submission, user is navigated to the Request List view" | ✅ |
| NaC-06 | Submitted request visible in list within same session; no manual reload required | US-6.2 | "Navigating to the list view shows the newly submitted request" + "The request appears without requiring a manual page refresh" | ✅ |
| NaC-07 | Navigation from form to list visible and immediate; no URL typing required | US-1.2 | "Clicking 'View Requests' renders the Request List without a full page reload" + "No console errors appear when switching between views" | ✅ |
| NaC-08 | Loading indicator while GET in flight; clears when data arrives | US-6.5 | "While GET /api/requests call is in progress, a 'Loading…' text or indicator is displayed" + "loading state clears as soon as the API response is received" | ✅ |
| NaC-09 | On API failure, entered data preserved; clear error message shown | US-5.4 | "Form fields are NOT cleared on API failure" + "error message...displayed at the form level" | ✅ |
| NaC-10 | Blank Submit shows three field-level error messages within 200ms; zero network requests | US-5.2 | "No API call is made when any required field is blank" + "Clicking Submit with blank Name shows 'Name is required.'" (×3) | ✅ |
| NaC-11 | Each error identifies specific blank field by name; shown directly below input | US-5.2 | "'Name is required.' below Name input" / "'Request title is required.' below Title input" / "'Description is required.' below Description textarea" | ✅ |
| NaC-12 | Error under each field clears when field has non-blank value | US-5.2 | "Validation fires on Submit click only — not on every keystroke" — *Note: US-5.2 specifies validation fires on submit; per-field clearing is described in JOURNEYS but not explicitly in US-5.2 AC. Partial alignment — recommend adding an AC for error-clear-on-input in US-5.2.* | ⚠️ Partial |
| NaC-13 | Repo clones cleanly; Maven wrapper committed; .gitignore excludes build artifacts | US-0.1 | "Running ./mvnw spring-boot:run...starts the application without errors" — *Note: .gitignore and repo hygiene are implied but not an explicit AC in US-0.1. Acceptable for demo scope.* | ⚠️ Implied |
| NaC-14 | Backend starts in under 30s on JDK 17+; no external services required | US-0.1 | "Application starts in under 30 seconds on a standard developer machine with JDK 17+" + "No external services, database servers, or Docker are required" | ✅ |
| NaC-15 | `npm install && npm run dev` starts Vite on 5173 with no additional config | US-1.1 | "Running npm install && npm run dev starts the Vite dev server without errors" + "Dev server is accessible at http://localhost:5173 by default" | ✅ |
| NaC-16 | POST returns 201; form clears; no CORS error during test submit | US-3.1 | "POST /api/requests...returns 201 Created" + "response body contains the saved entity including id and createdAt" | ✅ |
| NaC-17 | GET returns submitted entry; list updates without manual reload | US-6.1 | "Navigating to the Request List screen triggers a GET...on component mount" + "All records returned by the API are rendered" | ✅ |
| NaC-18 | requests table auto-created from JPA entity; no SQL migration file | US-2.1 | "H2 requests table is created automatically on application startup via Hibernate ddl-auto=create-drop" + "Application restart re-creates the table empty" | ✅ |
| NaC-19 | Access-Control-Allow-Origin header in GET response; 200 with JSON array or [] | US-0.3 + US-4.2 | "Access-Control-Allow-Origin: http://localhost:5173 header is present in API responses" + "GET...returns 200 OK with body []" | ✅ |
| NaC-20 | POST returns 201 with full entity; OPTIONS preflight passes; no CORS error | US-0.3 + US-3.1 | "Preflight (OPTIONS) requests are handled correctly with no 4xx response" + "POST /api/requests...returns 201 Created with the saved entity" | ✅ |
| NaC-21 | Zero network requests on blank-form submit; client-side guard fires before fetch | US-5.2 + US-3.2 | "No API call is made when any required field is blank" (US-5.2) + "POST with missing/blank fields returns 400" (US-3.2) | ✅ |
| NaC-22 | Zero console errors across full session; all status codes correct | US-6.4 + US-3.3 | "error is shown without crashing the application" (US-6.4) + "endpoint does not return a 500 for malformed input" (US-3.3) | ✅ |
| NaC-23 | Standard Maven layout; dedicated frontend/ directory; no unusual nesting | US-0.1 + US-1.1 | Implied by scaffold stories; not an explicit AC — acceptable for demo scope | ⚠️ Implied |
| NaC-24 | Single @Configuration class for CORS; locatable in < 2 min | US-0.3 | "Spring Boot CORS config allows origin http://localhost:5173 on all /api/** endpoints" — *Implementation detail (single class) implied but not explicit in AC. Acceptable.* | ⚠️ Implied |
| NaC-25 | Plain JPA entity with 5 fields; @PrePersist for created_at; no extra processors | US-2.2 | "created_at is set by @PrePersist lifecycle method" + "Both fields appear in the JSON response" | ✅ |
| NaC-26 | API_BASE_URL in single constants file; plain fetch in form and list components | US-1.3 | "A constants.ts or api.ts file exports API_BASE_URL" + "No component file contains a hardcoded http://localhost:8080 URL" | ✅ |

---

### Alignment Summary

| Status | Count | NaC IDs |
|--------|-------|---------|
| ✅ Full alignment | 21 | NaC-01–11, NaC-14–22, NaC-25–26 |
| ⚠️ Partial / Implied | 5 | NaC-12, NaC-13, NaC-23, NaC-24, NaC-26 |
| ❌ No alignment | 0 | — |

**Recommendations:**
- **NaC-12** (error clears on field input): Consider adding an acceptance criterion to US-5.2: *"Each inline error message disappears as soon as the corresponding field has a non-whitespace value."* This matches the intent described in JRN-01.2 Stage 3 but is missing from the formal AC.
- **NaC-13, NaC-23, NaC-24** (repo hygiene, directory structure, CORS class pattern): These are implementation-level constraints captured in JOURNEYS and JTBD but not in formal ACs. For a demo project, this is acceptable — the scaffold stories (US-0.1, US-0.3, US-1.1) deliver the intent even if the structural AC is implied.

---

*Generated by Pivota Spec Story Map Generator | Project: SRT | 2026-05-19*
