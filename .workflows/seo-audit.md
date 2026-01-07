---
description: SEO Audit Checklist - Verify search engine optimization best practices
---

# SEO Audit Workflow

This workflow guides an AI agent through auditing the codebase for SEO best practices.

## Prerequisites

- Access to all route files in `app/routes/`
- Access to `app/root.tsx` for global meta tags
- Understanding of Open Graph and Twitter Card specifications

## Audit Checklist

### 1. Meta Tags Validation

- [ ] **Title Tags**: Every route has a unique, descriptive `<title>` tag (50-60 characters)

  - Check: Each route exports a `meta` function
  - Check: Titles include the business name and page context
  - Location: `app/routes/*.tsx`

- [ ] **Meta Descriptions**: All pages have compelling meta descriptions (150-160 characters)
  - Check: `meta` function includes `name: "description"`
  - Check: Descriptions are unique per page, not duplicated

### 2. Open Graph (OG) Tags

- [ ] **Required OG Tags**: Verify presence of essential Open Graph tags

  ```
  og:title
  og:description
  og:type
  og:url (if applicable)
  og:image (if applicable)
  ```

  - Location: `app/root.tsx` for defaults, individual routes for overrides

- [ ] **OG Image**: If using og:image, verify:
  - Image is at least 1200x630 pixels
  - Image URL is absolute (not relative)
  - Image is accessible and loads correctly

### 3. Canonical URLs

- [ ] **Canonical Tags**: Every route should have a canonical URL
  - Check: `meta` function includes `{ tagName: "link", rel: "canonical", href: "..." }`
  - Canonical URLs should be absolute paths
  - No duplicate content issues (www vs non-www, trailing slashes)

### 4. Image Optimization

- [ ] **Alt Text**: All `<img>` elements have descriptive `alt` attributes

  - Check: Alt text describes the image content
  - Check: Decorative images use `alt=""` or `aria-hidden="true"`
  - Locations: All components in `app/components/`, `app/routes/`

- [ ] **Image Format**: Prefer modern formats (WebP, AVIF) with fallbacks
  - Check: Images are optimized for web delivery
  - Consider lazy loading for below-fold images (`loading="lazy"`)

### 5. Semantic HTML Structure

- [ ] **Heading Hierarchy**: Proper heading structure (h1 → h2 → h3)

  - Check: Only ONE `<h1>` per page
  - Check: Headings are not skipped (h1 → h3 without h2)

- [ ] **Semantic Elements**: Use semantic HTML over generic divs
  - `<header>` for page/section headers
  - `<nav>` for navigation blocks
  - `<main>` for primary content
  - `<article>` for self-contained content
  - `<section>` for thematic groupings
  - `<footer>` for footer content
  - `<aside>` for tangentially related content

### 6. Structured Data (Advanced)

- [ ] **JSON-LD**: Consider adding structured data for:
  - LocalBusiness schema (for consulting businesses)
  - Service schema (for service offerings)
  - ContactPage schema (for contact page)

## Reporting

After completing the audit, generate a report with:

1. **Pass/Fail Status** for each checklist item
2. **Specific File Locations** for any issues found
3. **Recommended Fixes** with code snippets
4. **Priority Ranking** (Critical, High, Medium, Low)

## Example Fix

If missing Open Graph tags, add to route's `meta` function:

```typescript
export const meta: MetaFunction = () => [
  { property: "og:title", content: "Page Title" },
  { property: "og:description", content: "Page description here" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://example.com/page" },
];
```
