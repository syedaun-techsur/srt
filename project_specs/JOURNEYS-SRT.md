# User Journey Maps: Simple Request Tracker (SRT)

**Document ID:** JOURNEYS-SRT  
**Version:** 1.0  
**Date:** 2026-05-19  
**Status:** Active  
**Related Personas:** PERSONAS-SRT v1.0 (PER-01 Marcus Webb, PER-02 Dana Park)  
**Related JTBD:** JTBD-SRT v1.0  
**Related PRD:** PRD-SRT v1.0  
**Derived From:** PERSONAS-SRT goals, top tasks; JTBD-SRT job statements, hiring criteria; PRD-SRT features F0–F6

---

## Journey Index

| JRN-ID | Persona | Scenario | Key JTBD | Stages |
|--------|---------|----------|----------|--------|
| JRN-01.1 | PER-01 Marcus Webb | First-time form submission — filling and submitting a request in one pass | JTBD-01.1, JTBD-01.2 | 5 |
| JRN-01.2 | PER-01 Marcus Webb | Blank-form blunder — submitting with empty fields and correcting from inline errors | JTBD-01.3 | 5 |
| JRN-01.3 | PER-01 Marcus Webb | Post-submit verification — navigating to the list to confirm the request was saved | JTBD-01.2 | 4 |
| JRN-02.1 | PER-02 Dana Park | Zero-setup validation — cloning the repo and proving the full create-display loop | JTBD-02.1 | 6 |
| JRN-02.2 | PER-02 Dana Park | CORS and API inspection — verifying frontend-to-backend connectivity via dev tools | JTBD-02.2 | 5 |
| JRN-02.3 | PER-02 Dana Park | Reference audit — reading the codebase to extract scaffold patterns for a new project | JTBD-02.3 | 4 |

---

## PER-01: Marcus Webb — Business Requester

---

### JRN-01.1: First-Time Form Submission

**Persona:** PER-01 (Marcus Webb)  
**Scenario:** Marcus has been asked to log a request using the new SRT tool. He has never seen it before and has no documentation in front of him. He opens the URL in his browser, scans the form, and attempts to complete and submit it in a single, uninterrupted pass. His only expectation: the form should behave like any other web form he has used.

**Related Jobs:** JTBD-01.1, JTBD-01.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Arrive** | Opens the URL; waits for the page to load | Browser, React app entry point (F1) | "OK, let's see what this looks like." | Neutral, mildly curious | If page load is slow or blank, immediate distrust kicks in | Fast initial render; no splash screen or loading gate |
| **2. Orient** | Scans the form layout top-to-bottom without typing yet | Submission form (F5) | "Three fields — Name, Request Title, Description. That seems simple enough. Which ones are required?" | Cautiously optimistic | No visible required-field indicators before interaction means uncertainty about what will happen on submit | Display required asterisks (*) and a "All fields required" note above the form before the user touches anything |
| **3. Fill** | Clicks into Name field; types name; tabs to Request Title; types title; tabs to Description; types description | Submission form inputs (F5) | "Name — that's me. Title — short summary. Description — what I actually need. This feels normal." | Focused, routine | Tab order mismatch or unexpected field jumps would break rhythm; multi-line description textarea too small to see full text | Correct tab order (Name → Title → Description → Submit); auto-grow textarea |
| **4. Submit** | Clicks the Submit button; waits | Submit button (F5), POST /api/requests (F3) | "Did it go? Is something happening?" | Momentarily anxious — the in-between state | Any visible loading delay without a spinner or disabled-button state creates doubt; silence after clicking is worst case | Disable button immediately on click + show loading indicator; resolve within 3 seconds |
| **5. Confirm** | User is redirected to the list view; sees the new entry | List view (F6) | "There it is — I can see my request. It worked." | Relieved, confident | If no redirect occurs and the form stays populated, Marcus doesn't know whether to submit again | After 201 response: navigate to Request List view; submitted entry is visible immediately |

---

#### Key Moments

- **Decision Point — Orient stage:** If Marcus cannot identify which fields are required by sight alone, he may guess or leave one blank, triggering a validation error loop that erodes trust.
- **Risk of Abandonment — Submit stage:** A click with no visible response (no spinner, no state change) is the most common reason users double-submit or give up entirely. This is the highest-risk moment in the journey.
- **Delight Opportunity — Confirm stage:** Redirecting directly to the list view where the new entry is immediately visible is the strongest possible confirmation — Marcus sees the result, not just an empty form.

---

#### Success Outcome

Marcus fills all three fields and clicks Submit in a single, uninterrupted pass. The user is navigated to the Request List view within 3 seconds of clicking Submit, where the new entry is immediately visible — no ambiguous intermediate state. Total time from page open to confirmed submission: under 60 seconds. *(JTBD-01.1 success measure: first-time user completes submission in under 60 seconds with no documentation.)*

---

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Arrive | F1 (React Frontend Scaffold) |
| Orient | F5 (Request Submission Form) |
| Fill | F5 (Request Submission Form) |
| Submit | F5 (Request Submission Form), F3 (POST Endpoint) |
| Confirm | F5 (triggers redirect on 201), F6 (list view — new entry immediately visible) |

---

### JRN-01.2: Blank-Form Blunder — Validation Recovery

**Persona:** PER-01 (Marcus Webb)  
**Scenario:** Marcus opens the form and, before reading the labels carefully, clicks Submit while all fields are still empty — a common reflex when testing a new tool. He expects either nothing to happen or a clear explanation of what went wrong. What he must not experience is a silent failure, a page reload, or a confusing server error.

**Related Jobs:** JTBD-01.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Arrive & skip reading** | Opens page; clicks Submit without filling any fields | Submission form (F5), Submit button | "Let me just see what happens." | Impatient, exploratory | If a network request fires (even if it fails), it signals that the form doesn't protect itself — trust erodes | Client-side validation must intercept before any network call fires |
| **2. See errors** | Three inline error messages appear under each blank field | Inline field errors (F5) | "Oh — all three are required. Got it. No big deal." | Mildly surprised, quickly refocused | Generic "form invalid" banners without field-level attribution leave users hunting for the problem | Field-specific messages: "Name is required", "Request Title is required", "Description is required" — placed directly under each input |
| **3. Correct** | Fills in Name; error under Name disappears; fills Title; error disappears; fills Description; error disappears | Form inputs with real-time or on-change error clearing (F5) | "Each error going away as I type makes me feel like I'm making progress." | Gaining confidence | If errors only clear on re-submit (not on input), the user feels punished; stale red borders after typing is frustrating | Clear each field's error as the user types or when the field gains a value |
| **4. Re-submit** | Clicks Submit again with all fields filled | Submit button (F5), POST /api/requests (F3) | "This time it should work." | Cautiously optimistic | If the API returns an error for a different reason (e.g., network) with no message, the user is confused | On API error (non-201): show a brief, non-technical error message ("Something went wrong — please try again") |
| **5. Confirm** | User is redirected to the list view; sees the entry | List view (F6) | "There it is. OK, it worked on the second attempt. Now I know how this form behaves." | Satisfied, not embarrassed | — | Validation recovery is smooth enough that Marcus leaves with confidence, not frustration |

---

#### Key Moments

- **Decision Point — Arrive & skip reading stage:** The first-click-on-submit reflex is extremely common. The app must handle it gracefully. If a network request fires on a blank submit, Dana (PER-02) will also flag it as a defect.
- **Risk of Abandonment — See errors stage:** If errors are generic or appear at the top of the page (not inline), Marcus may not connect them to the individual fields and give up.
- **Delight Opportunity — Correct stage:** Errors that disappear as the user types feel responsive and forgiving — this is the low-cost, high-trust move.

---

#### Success Outcome

A blank-form Submit fires inline, field-level error messages within 200ms and makes zero network requests. After filling all fields, the second Submit succeeds and the user is navigated to the Request List view where the entry is visible. *(JTBD-01.3 success measure: blank-form submit triggers inline field errors within 200ms; zero API calls made.)*

---

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Arrive & skip reading | F5 (Request Submission Form — client-side validation) |
| See errors | F5 (inline error messages) |
| Correct | F5 (real-time error clearing) |
| Re-submit | F5, F3 (POST Endpoint) |
| Confirm | F5 (triggers redirect on 201), F6 (list view) |

---

### JRN-01.3: Post-Submit Verification — Checking the List

**Persona:** PER-01 (Marcus Webb)  
**Scenario:** Marcus has just submitted a request and the form has cleared. He wants to double-check that his request actually made it into the system. He navigates to the list view to find his entry. This is a low-frequency but confidence-critical journey: if the list view is confusing or his entry doesn't appear, he will doubt whether the submission worked.

**Related Jobs:** JTBD-01.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Navigate** | Clicks a "View all requests" link or navigates to the list screen | Navigation / list link (F1, F6) | "Where do I find the list? Is there a link?" | Slightly uncertain | If there is no visible navigation from the form screen to the list, Marcus is stuck | Visible navigation element ("View Requests" link or tab) accessible from the form screen |
| **2. Load list** | List view loads; table appears | List view (F6), GET /api/requests (F4) | "Is my request in here?" | Alert, scanning | A loading delay with no placeholder or spinner creates anxiety about whether the page is working | Show a loading state (spinner or skeleton row) while GET /api/requests resolves |
| **3. Identify entry** | Scans the table rows for his Name and Request Title | Request list table (F6) | "There it is — my name, my title. It saved." | Relieved, satisfied | If there are many rows and no visual hierarchy, finding his own entry requires scrolling — no search available (and none needed if list is short) | Natural insertion order means his entry is likely at the bottom — consider showing newest first for easier self-verification |
| **4. Done** | Closes the tab or navigates away | Browser | "Done. It's in there." | Confident | — | Optional: a subtle "Your last submission: [title]" confirmation on the list view after redirect would close the loop elegantly |

---

#### Key Moments

- **Decision Point — Navigate stage:** If no navigation link exists between form and list, Marcus is blocked. This is a usability failure that undermines confidence in the entire tool.
- **Delight Opportunity — Identify entry stage:** If the list sorts newest-first, Marcus's entry is at the top, making self-verification instant and satisfying.

---

#### Success Outcome

Marcus navigates from the form to the list view and locates his submitted entry within the same browser session. His request is visible in the table with correct Name, Request Title, and Description values. *(JTBD-01.2 success measure: submitted request visible in list view within same session.)*

---

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Navigate | F1 (routing/navigation), F6 (list screen entry point) |
| Load list | F6 (Request List View), F4 (GET Endpoint) |
| Identify entry | F6 (table rendering) |
| Done | — |

---

## PER-02: Dana Park — Internal Stakeholder / Developer

---

### JRN-02.1: Zero-Setup Validation — Fresh Clone to Working Loop

**Persona:** PER-02 (Dana Park)  
**Scenario:** Dana has just received the SRT repository URL. She is on a machine with JDK 17+ and Node.js installed — nothing else project-specific. She clones the repo, starts both services with their standard commands, submits a test request via the form, and confirms it appears in the list. Her goal is to verify the complete create-and-display pipeline works without touching a config file, a database admin panel, or an environment variable. Any deviation from this script means the demo is not production-ready.

**Related Jobs:** JTBD-02.1

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Clone** | Runs `git clone <repo-url>` in terminal | Git, terminal | "One command. Repo lands. Good start." | Neutral, methodical | A repo with uncommitted changes or missing `.gitignore` entries (e.g., `target/`, `node_modules/`) creates noise on clone | Clean `.gitignore` for Maven and Node artifacts; README with exactly two startup commands |
| **2. Start backend** | Runs `./mvnw spring-boot:run` from repo root | Terminal, Maven wrapper, Spring Boot (F0) | "Should be up in under 30 seconds. Let's see if H2 auto-configures." | Alert, watching logs | Any startup error — missing wrapper, wrong JDK version detected, port 8080 already in use — kills the demo | Maven wrapper committed; H2 and JPA auto-configured; clear startup log confirming port and H2 URL |
| **3. Start frontend** | Runs `npm run dev` in a second terminal from `frontend/` or root | Terminal, Node.js, Vite (F1) | "Should come up on 5173 with no config. Is the API URL hardcoded or configurable?" | Focused | If `npm install` must be run separately or the API URL is not set, this step breaks | `package.json` scripts include install if needed; API base URL clearly set to `http://localhost:8080` |
| **4. Submit test request** | Opens `http://localhost:5173`; fills form with test data; clicks Submit | Browser, React form (F5), POST /api/requests (F3) | "Filling in dummy data. Hit submit. Did it return 201? Did it redirect to the list?" | Engaged, evaluating | A CORS error here is the highest-visibility failure — browser console lights up red; the demo is broken | Spring Boot CORS config explicitly allowing `http://localhost:5173`; redirect to list view on 201 |
| **5. Verify list** | Navigates to list view; sees the test entry in the table | List view (F6), GET /api/requests (F4) | "There it is. Name, title, description — all correct. The full loop works." | Satisfied, confident | If the list shows stale data or requires a manual reload, the demo flow is interrupted | List auto-fetches on mount; no manual reload needed |
| **6. Confirm zero configuration** | Reviews: no `.env` file edited, no DB setup run, no port changes made | Terminal, browser, file explorer | "Two commands. That's it. This is the pattern I wanted." | Impressed, validated | Any extra step discovered at this point (e.g., "oh you also need to run X") is a trust-breaking moment | Zero-configuration guarantee: H2 auto-schema, CORS pre-configured, ports match by default |

---

#### Key Moments

- **Decision Point — Start backend stage:** If `./mvnw` is not executable or not committed, Dana must troubleshoot immediately. This is the most common greenfield setup failure.
- **Risk of Abandonment — Submit test request stage:** A CORS error in the browser console during the submit is the single highest-risk failure point. Dana knows exactly what it means and it signals a fundamental configuration gap.
- **Delight Opportunity — Confirm zero configuration stage:** When Dana counts back and realizes she ran exactly two commands, the SRT has fulfilled its core value proposition. This moment should be unremarkable — no drama, no troubleshooting, just it worked.

---

#### Success Outcome

From `git clone` to a verified create-and-display loop in under 5 minutes, using only `./mvnw spring-boot:run` and `npm run dev`, with zero manual environment configuration steps. *(JTBD-02.1 success measure.)*

---

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Clone | — (repo hygiene) |
| Start backend | F0 (Spring Boot Backend Scaffold), F2 (Data Model — H2 auto-schema) |
| Start frontend | F1 (React Frontend Scaffold) |
| Submit test request | F5 (Submission Form), F3 (POST Endpoint), F0 (CORS) |
| Verify list | F6 (Request List View), F4 (GET Endpoint) |
| Confirm zero configuration | F0, F1, F2 (zero-setup guarantee) |

---

### JRN-02.2: CORS and API Inspection

**Persona:** PER-02 (Dana Park)  
**Scenario:** With both services running, Dana opens Chrome DevTools and systematically inspects the network panel while using SRT. She submits a request, fetches the list, and submits a blank form — watching HTTP status codes, response bodies, and the absence of CORS errors. She is using SRT as a verified reference pattern: if it passes here, the same CORS configuration can be extracted for the next project.

**Related Jobs:** JTBD-02.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Open DevTools** | Opens browser, navigates to `http://localhost:5173`, opens DevTools Network panel | Browser DevTools, React app (F1) | "Let me clear the network log and start fresh. I want to see every call." | Methodical, precise | Cached responses or stale network entries muddy the inspection — Dana clears the log manually | No service workers or aggressive caching in dev mode (Vite default handles this) |
| **2. Inspect GET on list load** | Navigates to list view; watches GET /api/requests fire | Network panel, GET /api/requests (F4) | "200 OK. JSON array — even if empty, that's correct. No CORS preflight error. Good." | Confident | A `net::ERR_FAILED` or CORS error on the GET means the backend CORS config is missing or wrong | `Access-Control-Allow-Origin: http://localhost:5173` present in response headers; 200 with `[]` or populated array |
| **3. Inspect POST on submit** | Fills form; submits; watches POST /api/requests in Network panel | Network panel, POST /api/requests (F3), Submission form (F5) | "201 Created. Response body has the full entity with id and created_at. Exactly right." | Satisfied | A 400 or 500 here means the request body is malformed, or JPA/H2 has a setup problem | 201 with full entity body including server-assigned `id` and `created_at`; no CORS error on the OPTIONS preflight |
| **4. Inspect blank-form validation** | Clears form; clicks Submit; watches Network panel | Network panel, Submission form (F5) | "No network call at all. Client-side validation fired first. This is correct behavior." | Pleased | If a network request appears (even a failed one), the client-side guard is missing — a correctness defect, not just a UX issue | Zero network requests logged when required fields are blank; inline errors only |
| **5. Summarize** | Reviews all calls: GET 200, POST 201, blank-submit zero calls; no CORS errors anywhere | Network panel, Console panel | "Clean. No CORS warnings. Correct status codes. No spurious calls. This pattern is extractable." | Validated, confident | Any console warning (even non-fatal) undermines the "clean reference" value of SRT | Zero console errors or warnings across the full session; no deprecation notices |

---

#### Key Moments

- **Decision Point — Inspect GET stage:** The very first network call (list GET on mount) tells Dana immediately whether CORS is configured. A CORS error here derails the entire inspection session.
- **Decision Point — Inspect POST stage:** The OPTIONS preflight for the POST is where CORS misconfigurations most commonly appear. Dana watches for this explicitly.
- **Delight Opportunity — Summarize stage:** A perfectly clean DevTools session — correct status codes, no CORS errors, no spurious calls — is the strongest possible endorsement of SRT as a reference pattern.

---

#### Success Outcome

Browser DevTools show zero CORS errors across all API calls. `GET /api/requests` returns 200 with a JSON array. `POST /api/requests` returns 201 with the full saved entity. A blank-form submit generates zero network requests. No console errors or warnings appear across the full session. *(JTBD-02.2 success measure.)*

---

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Open DevTools | F1 (React Frontend Scaffold) |
| Inspect GET on list load | F4 (GET Endpoint), F0 (CORS config) |
| Inspect POST on submit | F3 (POST Endpoint), F5 (Submission Form), F0 (CORS config) |
| Inspect blank-form validation | F5 (client-side validation) |
| Summarize | F0, F3, F4, F5 |

---

### JRN-02.3: Reference Audit — Extracting Scaffold Patterns

**Persona:** PER-02 (Dana Park)  
**Scenario:** Dana is about to start a new full-stack project. Before spinning up Spring Initializr and Vite separately, she opens the SRT repository to use it as a working reference. She wants to locate three specific patterns in the source code: (1) the CORS configuration class, (2) the JPA entity definition, and (3) the frontend fetch calls to the backend API. Her goal is to understand the pattern well enough to replicate it in 10 minutes — not copy-paste blindly, but read and understand.

**Related Jobs:** JTBD-02.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Navigate source structure** | Opens the repository in IDE or GitHub; scans top-level directory layout | IDE / GitHub file tree, F0 (backend), F1 (frontend) | "Backend in `src/main/java/...`. Frontend in `/frontend` or root. Clear separation — good." | Oriented | A flat or non-standard directory structure (e.g., frontend mixed into `src/main/resources`) forces hunting | Standard Maven layout for backend; dedicated `frontend/` directory for React app; no unusual nesting |
| **2. Find CORS config** | Navigates to the Spring Boot configuration package; opens the CORS configuration class | Backend source (F0), e.g., `CorsConfig.java` or `WebMvcConfig.java` | "One dedicated class, not per-controller annotations. `addCorsMappings` with explicit origin `http://localhost:5173`. I can lift this directly." | Confident, efficient | CORS configured via scattered `@CrossOrigin` annotations is harder to find and extract as a single pattern | One dedicated `@Configuration` class for CORS; no per-controller annotations; clearly named |
| **3. Find JPA entity** | Navigates to the entity package; opens `Request.java` | Backend source (F2), `Request.java` | "`@Entity`, `@Id`, `@GeneratedValue`, five fields, `@Column` annotations. Clean. Hibernate will auto-create the table — no migration file needed." | Satisfied | An entity with Lombok, MapStruct, or other annotation processors adds complexity that obscures the base pattern | Plain JPA entity with no extra frameworks; fields explicit; `ddl-auto=create-drop` in properties |
| **4. Find frontend fetch calls** | Navigates to the React source; finds the API call in the form submit handler and the list fetch | Frontend source (F1, F5, F6), e.g., `RequestForm.tsx`, `RequestList.tsx` | "Native `fetch` to `http://localhost:8080/api/requests`. POST with JSON body, GET on mount. Simple and readable — I can pattern-match this in 30 seconds." | Ready to replicate | `async/await` with no error handling or fetch abstracted behind multiple layers is harder to read in one pass | Plain `fetch` with `async/await`; error handling in the same function; no extra HTTP client library unless justified |

---

#### Key Moments

- **Decision Point — Navigate source structure stage:** If the project structure is non-standard (e.g., frontend inside Maven resources, or multiple nested config layers), Dana spends the first 5 minutes just orienting — eating into her 10-minute budget.
- **Delight Opportunity — Find CORS config stage:** A single, well-named `CorsConfig.java` that can be opened, read, and understood in 60 seconds is the ideal reference artifact. This is what transforms SRT from a demo into a trusted pattern library.
- **Risk of Abandonment — Find frontend fetch calls stage:** If the API calls are buried inside a custom hook, context provider, or Redux action, the pattern is invisible without deep reading. A developer in a hurry will just write their own from scratch.

---

#### Success Outcome

Dana locates the CORS configuration class, the JPA entity, and the frontend API fetch calls within 10 minutes of opening the repository — with zero prior project context. All three patterns are understandable at a glance and directly replicable. *(JTBD-02.3 success measure.)*

---

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Navigate source structure | F0 (backend scaffold), F1 (frontend scaffold) |
| Find CORS config | F0 (Spring Boot CORS configuration class) |
| Find JPA entity | F2 (Request Data Model & Persistence) |
| Find frontend fetch calls | F1 (frontend scaffold), F5 (form fetch), F6 (list fetch via F4) |

---

## Cross-Journey Patterns

### CP-01: CORS Is the Highest-Stakes Shared Risk

**Appears in:** JRN-02.1 (Submit test request stage), JRN-02.2 (Inspect GET, Inspect POST stages), JRN-01.1 (Submit stage — indirectly)

CORS misconfiguration is the single most visible and trust-breaking failure across all journeys. For Marcus (PER-01), a CORS error produces no visible feedback — the form sits silently or shows a generic error. For Dana (PER-02), a CORS error is immediately visible in DevTools and signals a fundamental configuration gap. Both personas' journeys converge on the same fix: a single, explicitly configured Spring Boot CORS class allowing `http://localhost:5173`.

**Shared Opportunity:** Pre-configure CORS in F0 so it is never a late-stage fix. Test it at the boundary of Phase 1 completion, before Phase 2 adds the form.

---

### CP-02: Post-Submit State Is Critical for Both Personas

**Appears in:** JRN-01.1 (Confirm stage), JRN-01.2 (Confirm stage), JRN-02.1 (Verify list stage), JRN-02.2 (Inspect POST stage)

Both Marcus and Dana care about what happens immediately after a successful POST. Marcus needs to see his request confirmed — the strongest signal is being navigated directly to the list view where his entry is visible. Dana needs the list to reflect the new entry without a manual reload so she can verify the loop. These are two sides of the same requirement: the POST response (201 with body) must trigger navigation to the list view.

**Shared Opportunity:** Design the post-submit flow in F5 to navigate to the list view on 201 — satisfying both personas in one implementation decision. Marcus gets unambiguous confirmation; Dana gets the loop verified.

---

### CP-03: Zero-Network-Call Validation Is Both a UX Win and a Correctness Signal

**Appears in:** JRN-01.2 (Arrive & skip reading stage), JRN-02.2 (Inspect blank-form validation stage)

Marcus benefits from client-side validation because he gets immediate, low-friction feedback without a network round-trip. Dana validates the same behavior from the DevTools perspective: zero network calls on a blank submit is a correctness signal, not just a UX nicety. Both personas benefit from the same implementation: client-side required-field validation in F5 that fires before any `fetch` call.

**Shared Opportunity:** Implement client-side validation as a hard gate in F5 — no `fetch` fires if any required field is empty. This satisfies Marcus's UX expectation and Dana's correctness requirement simultaneously.

---

### CP-04: Navigation Between Form and List Affects Both Personas

**Appears in:** JRN-01.3 (Navigate stage), JRN-02.1 (Verify list stage)

Marcus needs a visible way to get from the form to the list. Dana navigates this transition as part of validating the end-to-end loop. Both need the two-screen navigation to be obvious and immediate — not buried in a menu or requiring a URL change typed by hand.

**Shared Opportunity:** F1 routing should include a persistent, visible navigation element (header nav or tab strip) linking both screens. This is one implementation decision that unblocks both personas.

---

## Journey-to-JTBD Traceability

| JRN-ID | Stage | JTBD-ID | Expected Outcome |
|--------|-------|---------|-----------------|
| JRN-01.1 | Orient | JTBD-01.3 | Required-field indicators visible before typing begins |
| JRN-01.1 | Fill | JTBD-01.1 | Three clearly labeled fields; correct tab order; no extraneous options |
| JRN-01.1 | Submit | JTBD-01.1 | Submit triggers API call; button disabled with loading state |
| JRN-01.1 | Confirm | JTBD-01.2 | User is navigated to Request List view within 3 seconds; submitted entry is immediately visible |
| JRN-01.2 | Arrive & skip reading | JTBD-01.3 | No network call fires on blank submit |
| JRN-01.2 | See errors | JTBD-01.3 | Inline field-level errors appear within 200ms |
| JRN-01.2 | Correct | JTBD-01.3 | Errors clear per-field as user types |
| JRN-01.2 | Re-submit | JTBD-01.1 | Valid submit succeeds; 201 returned |
| JRN-01.2 | Confirm | JTBD-01.2 | User is navigated to Request List view; submitted entry visible; no ambiguous state |
| JRN-01.3 | Navigate | JTBD-01.2 | Navigation from form to list is visible and immediate |
| JRN-01.3 | Load list | JTBD-01.2 | GET /api/requests fetches on mount; shows loading state |
| JRN-01.3 | Identify entry | JTBD-01.2 | Submitted request appears in table within same session |
| JRN-02.1 | Clone | JTBD-02.1 | Clean repo with committed Maven wrapper and .gitignore |
| JRN-02.1 | Start backend | JTBD-02.1 | `./mvnw spring-boot:run` starts with H2 auto-configured in under 30s |
| JRN-02.1 | Start frontend | JTBD-02.1 | `npm run dev` starts Vite on port 5173 with no additional config |
| JRN-02.1 | Submit test request | JTBD-02.1, JTBD-02.2 | POST returns 201; no CORS error; user redirected to list view |
| JRN-02.1 | Verify list | JTBD-02.1 | GET returns submitted entry; list updates without manual reload |
| JRN-02.1 | Confirm zero configuration | JTBD-02.1 | Full loop achieved with exactly two commands from fresh clone |
| JRN-02.2 | Inspect GET on list load | JTBD-02.2 | 200 OK with JSON array; `Access-Control-Allow-Origin` header present; no CORS error |
| JRN-02.2 | Inspect POST on submit | JTBD-02.2 | 201 Created with full entity body; OPTIONS preflight passes; no CORS error |
| JRN-02.2 | Inspect blank-form validation | JTBD-01.3, JTBD-02.2 | Zero network requests logged on blank submit |
| JRN-02.2 | Summarize | JTBD-02.2 | Zero console errors or warnings; all status codes correct |
| JRN-02.3 | Navigate source structure | JTBD-02.3 | Standard Maven layout; dedicated frontend directory; no unusual nesting |
| JRN-02.3 | Find CORS config | JTBD-02.3 | Single `@Configuration` class for CORS; readable in under 2 minutes |
| JRN-02.3 | Find JPA entity | JTBD-02.3 | Plain JPA entity with five fields; no extra annotation processors |
| JRN-02.3 | Find frontend fetch calls | JTBD-02.3 | Plain `fetch` with `async/await` in form and list components; locatable in under 3 minutes |

---

*Generated by Pivota Spec Journeys Generator | Project: SRT | 2026-05-19*
