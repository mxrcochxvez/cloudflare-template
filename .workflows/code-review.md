---
description: Senior Engineer Code Review - Identify code smells and antipatterns
---

# Code Review Workflow

This workflow guides an AI agent through a thorough code review, checking for code smells,
antipatterns, and issues a Senior Software Engineer would flag during review.

## Prerequisites

- Access to all source files in `app/`, `db/`, and configuration files
- Understanding of TypeScript, React, and Remix patterns
- Knowledge of SOLID principles and clean code practices

## Code Smells Checklist

### 1. Function & Component Size

- [ ] **Long Functions**: Functions should do one thing

  - Guideline: Functions over 30-40 lines are suspicious
  - Check: Can parts be extracted into helper functions?
  - Red flag: Multiple levels of nesting (if inside if inside loop)

- [ ] **God Components**: Components trying to do too much

  - Symptoms: Many state variables, many effects, long JSX
  - Solution: Split into smaller, focused components

  ```typescript
  // ❌ Bad - One component doing everything
  function Dashboard() {
    // 10+ useState calls
    // 5+ useEffect calls
    // 300+ lines of JSX
  }

  // ✅ Good - Composed of smaller pieces
  function Dashboard() {
    return (
      <DashboardLayout>
        <StatsGrid />
        <RecentLeads />
        <QuickActions />
      </DashboardLayout>
    );
  }
  ```

### 2. Naming Conventions

- [ ] **Descriptive Names**: Variables/functions describe their purpose

  - ❌ Bad: `data`, `info`, `temp`, `x`, `handler`
  - ✅ Good: `userProfile`, `orderItems`, `handleFormSubmit`

- [ ] **Boolean Naming**: Booleans should read as yes/no questions

  - ❌ Bad: `loading`, `open`, `valid`
  - ✅ Good: `isLoading`, `isOpen`, `isValid`, `hasError`, `canSubmit`

- [ ] **Consistent Casing**: Follow conventions
  - Components: PascalCase (`ServiceCard`)
  - Functions/variables: camelCase (`getServices`)
  - Constants: UPPER_SNAKE_CASE (`MAX_ITEMS`)
  - Files: Matches export (component files PascalCase or kebab-case)

### 3. DRY Violations (Don't Repeat Yourself)

- [ ] **Duplicate Code Blocks**: Same logic in multiple places

  - Check: Search for similar code patterns
  - Solution: Extract to shared utility or component

  ```typescript
  // ❌ Bad - Duplicated in multiple files
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  // ✅ Good - Utility function
  // app/lib/utils.ts
  export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
  ```

- [ ] **Magic Numbers/Strings**: Unexplained literals
  - ❌ Bad: `if (items.length > 10)`, `status === "active"`
  - ✅ Good: `if (items.length > MAX_DISPLAY_ITEMS)`, `status === Status.ACTIVE`

### 4. Coupling & Cohesion

- [ ] **Tight Coupling**: Components know too much about each other

  - Check: Does changing one file require changing many others?
  - Solution: Use props, context, or dependency injection

- [ ] **Low Cohesion**: Related logic scattered across files

  - Check: Are related functions grouped together?
  - Solution: Co-locate related functionality

- [ ] **Prop Drilling**: Passing props through many layers
  - Check: Props passed 3+ levels deep
  - Solutions: React Context, composition, or URL state

### 5. React Antipatterns

- [ ] **Unnecessary State**: Derived values stored in state

  ```typescript
  // ❌ Bad - Derived state
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  // Now you must keep them in sync!

  // ✅ Good - Derive at render time
  const [items, setItems] = useState([]);
  const itemCount = items.length; // Automatically correct
  ```

- [ ] **useEffect Overuse**: Effects for things that don't need them

  ```typescript
  // ❌ Bad - Effect to set derived state
  useEffect(() => {
    setFullName(firstName + " " + lastName);
  }, [firstName, lastName]);

  // ✅ Good - Calculate during render
  const fullName = firstName + " " + lastName;
  ```

- [ ] **Missing Dependencies**: useEffect/useMemo/useCallback deps

  - Check: ESLint exhaustive-deps warnings
  - All referenced values should be in dependency array

- [ ] **Key Prop Issues**: Missing or unstable keys

  ```typescript
  // ❌ Bad - Index as key (problematic if list reorders)
  {
    items.map((item, index) => <Item key={index} />);
  }

  // ✅ Good - Stable unique identifier
  {
    items.map((item) => <Item key={item.id} />);
  }
  ```

### 6. Error Handling Antipatterns

- [ ] **Swallowed Errors**: Catching without handling

  ```typescript
  // ❌ Bad - Error disappears
  try {
    await riskyOperation();
  } catch (e) {
    // Nothing here!
  }

  // ✅ Good - At minimum, log it
  try {
    await riskyOperation();
  } catch (error) {
    console.error("Operation failed:", error);
    throw error; // or handle appropriately
  }
  ```

- [ ] **Generic Error Messages**: User sees technical jargon
  - ❌ Bad: "SQLITE_CONSTRAINT_FOREIGNKEY"
  - ✅ Good: "Unable to save. Please try again."

### 7. Async/Await Issues

- [ ] **Unhandled Promise Rejections**: Async without try/catch

  - All `await` in actions/loaders should be wrapped

- [ ] **Sequential When Parallel**: Unnecessary blocking

  ```typescript
  // ❌ Bad - Sequential (slow)
  const users = await getUsers();
  const posts = await getPosts();

  // ✅ Good - Parallel (fast)
  const [users, posts] = await Promise.all([getUsers(), getPosts()]);
  ```

- [ ] **Missing Await**: Forgetting to await async functions
  - Check: Async functions called without await

### 8. Security Antipatterns

- [ ] **SQL Injection Risk**: Raw string interpolation in queries

  - ✅ Drizzle ORM handles this, but check raw queries

- [ ] **XSS Vectors**: Rendering unescaped user input

  - Check: Use of `dangerouslySetInnerHTML`
  - Ensure all user content is sanitized

- [ ] **Exposed Debug Info**: Development code in production
  - Check: `console.log` with sensitive data
  - Check: Debug panels or test routes

### 9. TypeScript Antipatterns

- [ ] **Type Assertions Overuse**: Using `as` to override types

  ```typescript
  // ❌ Bad - Bypassing type safety
  const user = data as User;

  // ✅ Good - Validate at runtime
  if (isUser(data)) {
    const user = data;
  }
  ```

- [ ] **Non-Null Assertions**: Using `!` excessively

  ```typescript
  // ❌ Risky
  const name = user!.name;

  // ✅ Safer
  const name = user?.name ?? "Unknown";
  ```

### 10. Code Organization

- [ ] **Circular Dependencies**: Files importing each other

  - Solution: Extract shared types/functions to separate file

- [ ] **Barrel File Abuse**: Re-exporting everything
  - Can cause bundle size issues
  - Import directly when possible

## Review Process

1. **Initial Scan**: Look for obvious issues
2. **Deep Dive**: Review complex logic carefully
3. **Test Coverage**: Ensure critical paths are testable
4. **Documentation**: Complex logic should have comments

## Reporting Template

```markdown
## Issue: [Brief Title]

**Severity**: Critical | High | Medium | Low
**File**: `path/to/file.ts:123`
**Category**: Code Smell | Antipattern | Security | Performance

### Problem

[Describe what's wrong]

### Current Code

\`\`\`typescript
// problematic code
\`\`\`

### Suggested Fix

\`\`\`typescript
// improved code
\`\`\`

### Rationale

[Why this matters]
```
