---
description: Accessibility Audit Checklist - Ensure WCAG 2.1 AA compliance
---

# Accessibility (a11y) Audit Workflow

This workflow guides an AI agent through auditing the codebase for accessibility compliance.

## Prerequisites

- Access to all component files in `app/components/`
- Access to all route files in `app/routes/`
- Access to `app/styles/tailwind.css` for custom styles
- Understanding of WCAG 2.1 guidelines

## Audit Checklist

### 1. Color Contrast

- [ ] **Text Contrast**: Verify sufficient contrast ratios

  - Normal text (< 18px): Minimum 4.5:1 ratio
  - Large text (≥ 18px or 14px bold): Minimum 3:1 ratio
  - Check Tailwind classes for problematic combinations:
    - ❌ `text-slate-400` on `bg-white` (may fail)
    - ✅ `text-slate-600` on `bg-white` (passes)
    - ❌ `text-white` on `bg-primary-400` (may fail)
    - ✅ `text-white` on `bg-primary-600` (passes)

- [ ] **Non-Text Contrast**: UI components meet 3:1 ratio
  - Buttons, form inputs, icons
  - Focus indicators
  - Check borders are visible against backgrounds

### 2. Interactive Elements

- [ ] **Button Labels**: All buttons have accessible names

  - Check: Icon-only buttons have `aria-label`
  - Check: Submit buttons have descriptive text

  ```tsx
  // ❌ Bad
  <button><IconMenu /></button>

  // ✅ Good
  <button aria-label="Open menu"><IconMenu /></button>
  ```

- [ ] **Link Text**: Links are descriptive

  - ❌ Avoid: "Click here", "Read more", "Learn more"
  - ✅ Prefer: "View our services", "Read the full article"
  - If generic text is needed, use `aria-label` for context

- [ ] **Form Labels**: All inputs have associated labels
  - Check: `<label htmlFor="id">` matches `<input id="id">`
  - Check: Required fields are indicated (not just by color)
  - Check: Error messages are associated with inputs (`aria-describedby`)

### 3. Keyboard Navigation

- [ ] **Focus Visibility**: Focus states are clearly visible

  - Check: `focus:` or `focus-visible:` classes exist
  - Check: Focus ring has sufficient contrast
  - Default in this project: `focus-visible:ring-2 focus-visible:ring-primary-500`

- [ ] **Tab Order**: Logical tab sequence

  - Check: No positive `tabindex` values (0 and -1 only)
  - Check: Interactive elements are focusable
  - Check: Modal/dropdown focus trapping works correctly

- [ ] **Skip Links**: Consider adding skip navigation
  ```tsx
  <a href="#main-content" className="sr-only focus:not-sr-only">
    Skip to main content
  </a>
  ```

### 4. ARIA Usage

- [ ] **ARIA Landmarks**: Proper landmark roles

  - `role="navigation"` or `<nav>` for nav areas
  - `role="main"` or `<main>` for main content
  - `role="banner"` or `<header>` for page header
  - `role="contentinfo"` or `<footer>` for footer

- [ ] **ARIA States**: Dynamic content updates

  - Check: `aria-expanded` for collapsible elements
  - Check: `aria-selected` for tabs/selections
  - Check: `aria-current="page"` for current nav item

- [ ] **ARIA Labels**: Unique accessible names
  - Check: Multiple similar elements have unique labels
  - Check: Icon buttons have `aria-label`
  - Check: Form sections have `aria-labelledby` when needed

### 5. Images and Media

- [ ] **Alt Text**: All images have appropriate alt

  - Informative images: Descriptive alt text
  - Decorative images: `alt=""` or `role="presentation"`
  - Complex images: Consider `aria-describedby` for longer descriptions

- [ ] **SVG Accessibility**: SVGs are properly labeled

  ```tsx
  // Decorative SVG
  <svg aria-hidden="true">...</svg>

  // Meaningful SVG
  <svg role="img" aria-label="Description">...</svg>
  ```

### 6. Forms

- [ ] **Error Handling**: Errors are accessible

  - Check: Errors are announced to screen readers
  - Check: Error messages are associated with inputs
  - Check: Focus moves to first error on submit

- [ ] **Required Fields**: Clear indication
  - Check: Visual indicator (asterisk) exists
  - Check: `required` attribute is set
  - Check: `aria-required="true"` for custom components

### 7. Motion and Animation

- [ ] **Reduced Motion**: Respect user preferences
  - Check: Use `motion-reduce:` Tailwind variant
  - Check: Essential animations still work without motion
  ```css
  @media (prefers-reduced-motion: reduce) {
    .animate-spin {
      animation: none;
    }
  }
  ```

## Testing Commands

```bash
# Run axe-core audit (if installed)
npx axe-cli http://localhost:5173

# Use browser DevTools
# Chrome: Lighthouse > Accessibility
# Firefox: Accessibility Inspector
```

## Reporting

Generate a report with:

1. **WCAG Criterion** violated (e.g., "1.4.3 Contrast (Minimum)")
2. **Severity Level** (Critical, Serious, Moderate, Minor)
3. **Affected Elements** with file paths and line numbers
4. **Recommended Fixes** with code examples
