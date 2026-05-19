---

## Responsive Considerations

SRT is a dev/demo application used primarily on a desktop browser. However, the layout must be readable and functional at tablet and mobile widths without horizontal scrolling or broken forms.

---

### Desktop (> 1024px)

**Submission Form:**
- Max-width container: `800px`, centered, `margin: 40px auto`, `padding: 0 16px`
- Form fields: full-width within the container
- Description textarea: minimum 3 rows visible; can grow with content
- Submit button: comfortable click target; does not need to be full-width

**Request List:**
- Table: full-width within the `800px` container
- Three columns split roughly: Name 20% | Request Title 30% | Description 50%
- Long description text wraps within the cell

---

### Tablet (768px – 1024px)

**Submission Form:**
- Same vertical stack layout; container fills width with horizontal padding
- No layout changes needed — the form is inherently single-column

**Request List:**
- Table remains horizontal with all three columns visible
- Column widths adjust to available space
- Description column may show truncated text with ellipsis if cells become too narrow; full text still accessible via tooltip or wrapping

---

### Mobile (< 768px)

**Submission Form:**
- Container fills viewport width with `padding: 0 16px`
- All fields full-width — no change to layout structure
- Submit button: full-width for easier tap target on small screens
- Textarea: minimum 4 rows so it is usable without pinch-zoom

**Request List:**
- Wide table on a narrow screen is the primary challenge
- Acceptable approaches (choose one):
  - **Horizontal scroll:** Allow the table to scroll horizontally inside the container. Preserve all three columns.
  - **Card layout at mobile breakpoint:** Stack each record as a card with labeled field-value pairs instead of a table row.
- The `id` and `createdAt` columns are not shown regardless.

**Navigation:**
- Header nav items remain visible at all widths — they are short text labels and fit side-by-side on mobile
- No hamburger menu needed for two nav items

---

### CSS Approach

Per FRD F01 requirements:
- **No UI framework** (no Tailwind, no MUI, no Bootstrap) — plain CSS only
- Base styles in `src/index.css` or `src/App.css`
- Suggested base:

```css
body {
  font-family: sans-serif;
  max-width: 800px;
  margin: 40px auto;
  padding: 0 16px;
}

@media (max-width: 768px) {
  body {
    margin: 16px auto;
  }

  .submit-button {
    width: 100%;
  }

  .request-table {
    display: block;
    overflow-x: auto;
  }
}
```
