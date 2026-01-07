---
description: Error Resolution Logging - Document errors and solutions for future reference
---

# Error Resolution Workflow

This workflow guides an AI agent through documenting errors encountered during development and their solutions. This creates a knowledge base for the project.

## Directory Structure

```
logs/
├── README.md           # Overview of the logs directory
└── errors/
    ├── YYYY-MM-DD-error-slug.md  # Individual error logs
    └── ...
```

## When to Log

Log an error when:

1. An error required investigation to resolve
2. The solution was non-obvious
3. The error might recur in the future
4. The fix involved learning something new

## Error Log Format

Each error log file should follow this template:

```markdown
# [Short Error Title]

**First Encountered**: YYYY-MM-DD HH:MM  
**Last Updated**: YYYY-MM-DD HH:MM  
**Status**: Resolved | Ongoing | Workaround  
**Occurrences**: N

## Error Message

\`\`\`
[Exact error message or stack trace]
\`\`\`

## Context

- **File(s) Affected**: `path/to/file.ts`
- **Environment**: Development | Production | Build
- **Trigger**: What action caused the error

## Root Cause

[Explain why this error occurred]

## Solution

[Step-by-step fix]

\`\`\`typescript
// Code changes if applicable
\`\`\`

## Prevention

[How to avoid this error in the future]

## Related Resources

- [Link to documentation]
- [Stack Overflow thread]
- [GitHub issue]
```

## Workflow Steps

### 1. Check for Existing Log

Before creating a new log, search for similar errors:

```bash
# Search logs directory for keywords from the error
grep -r "keyword" logs/errors/
```

If found, update the existing log:

- Increment "Occurrences" count
- Update "Last Updated" date
- Add new context if different
- Refine solution if improved

### 2. Create New Log (if no existing match)

**File naming convention**: `YYYY-MM-DD-short-slug.md`

Example: `2026-01-07-react-dom-streaming.md`

### 3. Categorize the Error

Add appropriate tags at the end of the file:

```markdown
## Tags

`build` `react` `cloudflare` `typescript` `database`
```

### 4. Update Logs README

Keep `logs/README.md` updated with a summary table:

```markdown
| Date       | Error               | Status   | File                                             |
| ---------- | ------------------- | -------- | ------------------------------------------------ |
| 2026-01-07 | React DOM streaming | Resolved | [Link](errors/2026-01-07-react-dom-streaming.md) |
```

## Example: React DOM Streaming Error

Here's a real example from this project:

**File**: `logs/errors/2026-01-07-react-dom-streaming.md`

```markdown
# React DOM renderToReadableStream Not Found

**First Encountered**: 2026-01-07 01:30  
**Last Updated**: 2026-01-07 01:32  
**Status**: Resolved  
**Occurrences**: 2

## Error Message

\`\`\`
[vite] Named export 'renderToReadableStream' not found.
The requested module 'react-dom/server' is a CommonJS module...

TypeError: renderToReadableStream is not a function
\`\`\`

## Context

- **File(s) Affected**: `app/entry.server.tsx`
- **Environment**: Development (Vite dev server)
- **Trigger**: Running `npm run dev`

## Root Cause

The `react-dom/server` module in the Vite development environment
doesn't export `renderToReadableStream` as a named export due to
CommonJS/ESM interop issues.

## Solution

Use `renderToString` instead, which works reliably across all environments:

\`\`\`typescript
import { renderToString } from "react-dom/server";

export default async function handleRequest(...) {
const markup = renderToString(
<RemixServer context={remixContext} url={request.url} />
);
return new Response(\`<!DOCTYPE html>\${markup}\`, ...);
}
\`\`\`

## Prevention

- For Cloudflare Workers with Remix, prefer `renderToString`
- If streaming is required, use Cloudflare's HTMLRewriter API

## Tags

\`react\` \`cloudflare\` \`vite\` \`ssr\`
```

## Automation Tips

When logging programmatically:

1. **Slug generation**: Convert error title to kebab-case
2. **Date format**: Use ISO 8601 (YYYY-MM-DD)
3. **Deduplication**: Hash the error message to detect duplicates
4. **Git integration**: Commit logs with descriptive messages

## Benefits

- **Onboarding**: New developers learn from past issues
- **Speed**: Quick reference for recurring problems
- **Patterns**: Identify systemic issues over time
- **Documentation**: Living history of technical decisions
