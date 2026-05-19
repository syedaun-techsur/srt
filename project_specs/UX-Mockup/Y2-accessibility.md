---

## Accessibility Notes

SRT is a minimal demo application. The following baseline accessibility requirements ensure the app is usable with keyboard navigation, screen readers, and meets minimum contrast standards. These are achievable without a UI framework.

---

### Color Contrast

| Element | Requirement |
|---------|-------------|
| Body text on background | Minimum 4.5:1 contrast ratio (WCAG AA) |
| Error messages (red text or icons) | Minimum 4.5:1 contrast ratio — avoid pure `#ff0000` on white; use darker red e.g. `#c0392b` |
| Placeholder text | Minimum 3:1 contrast — note that browser defaults often fail here; explicitly set `color: #767676` |
| Submit button text on button background | Minimum 4.5:1 |
| Active nav indicator | Ensure active state is distinguishable not just by color (add underline or bold) |

---

### Keyboard Navigation

| Interaction | Expected Behavior |
|------------|-------------------|
| Tab through form | Name → Request Title → Description → Submit button (in that order) |
| Enter in Name or Title input | Should NOT submit the form unexpectedly; or if it does, validation fires first |
| Enter on Submit button | Triggers click handler (same as mouse click) |
| Tab to nav links | Both nav items reachable via Tab key |
| Enter on nav link | Activates navigation |
| Focus indicators | Visible focus ring on all interactive elements (do not suppress `outline`) |

---

### Form Labels and ARIA

| Element | Requirement |
|---------|-------------|
| Name input | `<label for="name">Name</label>` — explicit label association via `for`/`id` |
| Request Title input | `<label for="title">Request Title</label>` — explicit label |
| Description textarea | `<label for="description">Description</label>` — explicit label |
| Required indicator | Use `aria-required="true"` on each required field in addition to visual asterisk |
| Inline error messages | Associate with their field via `aria-describedby`; add `role="alert"` so screen readers announce the error immediately |
| Form-level error | Use `role="alert"` so screen readers announce the error when it appears |
| Submit button loading state | Update `aria-label` to "Submitting, please wait" when disabled, or use `aria-busy="true"` on the form |
| Table | Use `<table>` with `<thead>` and `<th scope="col">` for proper screen reader column announcement |

**Example error association:**
```html
<label for="name">Name *</label>
<input
  id="name"
  type="text"
  aria-required="true"
  aria-describedby="name-error"
/>
<span id="name-error" role="alert">
  Name is required.
</span>
```

---

### Screen Reader Considerations

| Scenario | Behavior |
|----------|---------|
| Inline error appears | `role="alert"` causes screen reader to announce the error message immediately without user focus change |
| Form-level error appears | `role="alert"` announces "Submission failed. Please try again." to screen reader |
| Submit button disabled | Screen reader announces "Submitting, please wait" (via `aria-label`) — "dimmed" alone is not sufficient |
| Table renders | Screen reader can navigate columns via `<th scope="col">` headers |
| Empty-state message | Plain text in a `<p>` — announced naturally when user tabs to it or on focus |
| Loading state | Optional: `aria-live="polite"` region for "Loading…" text so screen readers announce it without interrupting |

---

### Minimum Implementation Checklist

- [ ] All form inputs have explicit `<label>` elements with matching `for`/`id`
- [ ] All required fields have `aria-required="true"`
- [ ] Inline error messages use `role="alert"` and are associated via `aria-describedby`
- [ ] Form-level error uses `role="alert"`
- [ ] Table has `<thead>` with `<th scope="col">` for each column
- [ ] No `outline: none` on interactive elements without a custom focus style replacement
- [ ] Tab order follows visual reading order (top to bottom, left to right)
- [ ] Error states are not communicated by color alone (text message required in addition to red border)
