# Commit Convention

This workflow defines the commit message format to use when the user EXPLICITLY ASKS for commits.

## IMPORTANT: Only Commit When Asked

Do NOT make commits automatically. Only make commits when the user explicitly requests them.

## Commit Message Format

All commits MUST follow the Karma/Conventional Commits style:

```
<type>(<scope>): <subject>
```

## Types

| Type | Description |
|------|-------------|
| feat | A new feature |
| fix | A bug fix |
| docs | Documentation only changes |
| style | Formatting, white-space changes |
| refactor | Code change that neither fixes a bug nor adds a feature |
| perf | Performance improvement |
| test | Adding or correcting tests |
| chore | Build process, tooling, config changes |

## Rules

1. Subject: imperative mood, lowercase, no period, max 50 chars
2. Scope: component, file, or feature area affected
3. Make atomic commits - one logical change per commit
4. Each commit should be independently buildable

## Examples

```
feat(ui): add speed comparison component
fix(api): handle null response from database
docs(readme): update installation instructions
chore(config): add shimmer animation to tailwind
```
