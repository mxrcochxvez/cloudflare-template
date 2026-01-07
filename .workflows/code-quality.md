---
description: Code Quality Checklist - Pre-deployment verification for code standards
---

# Code Quality Audit Workflow

This workflow guides an AI agent through verifying code quality before deployment.

## Prerequisites

- Access to all TypeScript/TSX files in the project
- Understanding of Remix conventions
- Knowledge of Cloudflare Workers environment

## Audit Checklist

### 1. TypeScript Strictness

- [ ] **Strict Mode**: Verify `tsconfig.json` has `"strict": true`

  - Location: `tsconfig.json`

- [ ] **Loader/Action Types**: All data functions are strictly typed

  ```typescript
  // ✅ Good - Explicit types
  interface LoaderData {
    items: Item[];
  }

  export async function loader({ context }: LoaderFunctionArgs) {
    // ...
    return json<LoaderData>({ items });
  }

  // ❌ Bad - Implicit any
  export async function loader({ context }) {
    return json({ items });
  }
  ```

- [ ] **No `any` Types**: Search for `any` usage
  - Command: `grep -r ": any" app/`
  - Replace with proper types or `unknown` if necessary

### 2. Import Hygiene

- [ ] **Unused Imports**: Remove all unused imports

  - Check: Run `npm run lint` or manually review
  - Common issue: Importing types that are removed during refactoring

- [ ] **Unused Variables**: No declared but unused variables

  - Prefix intentionally unused with underscore: `_unusedParam`
  - Check: TypeScript/ESLint should flag these

- [ ] **Import Order**: Consistent import ordering

  ```typescript
  // 1. External packages
  import { json } from "@remix-run/cloudflare";

  // 2. Internal absolute imports
  import { getDb } from "~/lib/db.server";

  // 3. Relative imports
  import { Component } from "./Component";
  ```

### 3. Environment Variable Security

- [ ] **No Hardcoded Secrets**: Scan for hardcoded values

  - API keys
  - Database credentials
  - Auth tokens
  - Search patterns: `apiKey`, `secret`, `password`, `token`

- [ ] **Proper Env Access**: Only use `context.cloudflare.env`

  ```typescript
  // ✅ Good - Access via context
  const { DB, AI } = getEnv(context);

  // ❌ Bad - Direct process.env (won't work in Workers)
  const apiKey = process.env.API_KEY;
  ```

- [ ] **Env Validation**: Environment bindings are typed
  - Location: `app/lib/env.server.ts`
  - Check: All required bindings are in the `Env` interface

### 4. Server/Client Separation

- [ ] **`.server.ts` Suffix**: Server-only code is properly marked

  - Database access: `*.server.ts`
  - Environment access: `*.server.ts`
  - Server utilities: `*.server.ts`

- [ ] **No Server Code in Client**: Verify no accidental imports
  - Client components should not import `.server.ts` files
  - Use Remix loaders/actions for data fetching

### 5. Error Handling

- [ ] **Try/Catch in Actions**: All database operations wrapped

  ```typescript
  try {
    await db.insert(table).values(data);
    return json({ success: true });
  } catch (error) {
    console.error("Operation failed:", error);
    return json({ error: "Failed" }, { status: 500 });
  }
  ```

- [ ] **User-Friendly Errors**: Don't expose internal errors

  - Log detailed errors server-side
  - Return generic messages to users

- [ ] **ErrorBoundary**: Root error boundary exists
  - Location: `app/root.tsx`

### 6. Performance Considerations

- [ ] **No N+1 Queries**: Database queries are efficient

  - Check: No queries inside loops
  - Use JOINs or batch queries instead

- [ ] **Lazy Loading**: Large components use dynamic imports

  ```typescript
  const HeavyComponent = lazy(() => import("./HeavyComponent"));
  ```

- [ ] **Image Optimization**: Images are properly sized
  - Use `loading="lazy"` for below-fold images
  - Specify width/height to prevent CLS

### 7. Remix Best Practices

- [ ] **Form Method**: POST for mutations, GET for reads

  - `<Form method="post">` for data changes
  - `<Form method="get">` for search/filters

- [ ] **Progressive Enhancement**: Forms work without JS

  - No `onClick` handlers for form submission
  - Use Remix `Form` component

- [ ] **Optimistic UI**: Consider for better UX
  - Use `useNavigation()` for pending states
  - Use `useFetcher()` for parallel submissions

## Automated Checks

```bash
# TypeScript type checking
npm run typecheck

# Linting
npm run lint

# Build verification
npm run build
```

## Reporting

After completing the audit, document:

1. **Issues Found** with severity (Critical, High, Medium, Low)
2. **File Locations** and line numbers
3. **Before/After Code** for fixes
4. **Verification Steps** to confirm resolution
