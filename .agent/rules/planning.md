# Feature Planning Workflow

This workflow helps you create comprehensive, well-thought-out plans for features by following Opus 4.5's planning methodology.

## Step 1: Understand the Feature Request

First, deeply understand what's being asked. Consider:

### Clarifying Questions

- What is the core problem this feature solves?
- Who are the users and what are their needs?
- What are the success criteria?
- Are there any constraints (technical, timeline, resources)?
- What are the edge cases and failure modes?

### Context Gathering

- What existing code/systems does this interact with?
- Are there similar features already implemented?
- What are the dependencies?
- What's the current state of related code?

```bash
# Search for related code
grep -r "related_functionality" .
# Check recent changes in relevant areas
git log --oneline --since="1 month ago" -- path/to/relevant/files
```

## Step 2: Break Down the Problem

Decompose the feature into smaller, manageable pieces:

### High-Level Architecture

1. Identify the major components needed
2. Determine how they interact
3. Map out data flow
4. Identify integration points with existing code

### Subtasks and Dependencies

- List all subtasks required
- Identify which tasks depend on others
- Determine what can be done in parallel
- Estimate complexity for each subtask

### Risk Analysis

- What could go wrong?
- What are the technical challenges?
- Where might performance issues arise?
- What are the security considerations?

## Step 3: Design the Solution

Create a detailed technical design:

### Architecture Decisions

- What design patterns are appropriate?
- How does this fit into existing architecture?
- What interfaces/abstractions are needed?
- How will this be tested?

### Data Structures

- What data needs to be stored?
- What's the schema/shape of the data?
- How will data flow through the system?

### API/Interface Design

- What are the public interfaces?
- What are the function signatures?
- What are the input/output types?
- What error cases need handling?

### Language-Specific Considerations

**For TypeScript/Java:**

- Define interfaces and types upfront
- Plan class hierarchy and relationships
- Consider generics and type parameters
- Plan for proper encapsulation

**For Python (tkinter/langchain):**

- Separate GUI logic from business logic
- Plan widget hierarchy and layout
- Design langchain chain structure
- Plan for async operations if needed

### File and Module Structure

```
project/
├── src/
│   ├── feature/
│   │   ├── __init__.py / index.ts
│   │   ├── models.py / types.ts
│   │   ├── service.py / service.ts
│   │   ├── ui.py / component.tsx (if applicable)
│   │   └── tests/
```

## Step 4: Plan for Quality

### Testing Strategy

- Unit tests for each component
- Integration tests for component interactions
- Edge cases to test
- Performance benchmarks if relevant

### Error Handling

- What errors can occur?
- How should each be handled?
- What should users see?
- What should be logged?

### Documentation Needs

- What needs API documentation?
- What user-facing documentation is needed?
- What inline comments are critical?

## Step 5: Implementation Plan

Create a step-by-step implementation roadmap:

### Phase 1: Foundation

1. Set up file structure
2. Define types/interfaces/models
3. Create stub implementations
4. Set up tests

### Phase 2: Core Logic

1. Implement main business logic
2. Write unit tests
3. Handle basic error cases

### Phase 3: Integration

1. Connect to existing systems
2. Wire up UI (if applicable)
3. Integration tests
4. Handle edge cases

### Phase 4: Polish

1. Performance optimization
2. Comprehensive error handling
3. Documentation
4. Code review preparation

### Incremental Commits

Plan commits that are:

- Atomic (one logical change)
- Buildable (code compiles/runs after each)
- Testable (can be tested independently)
- Reviewable (easy to understand the change)

## Step 6: Validation Checklist

Before starting implementation, verify:

- [ ] All requirements are clearly understood
- [ ] Architecture decisions are justified
- [ ] Interfaces are well-defined
- [ ] Edge cases are identified
- [ ] Testing strategy is clear
- [ ] Implementation phases are logical
- [ ] Dependencies are identified
- [ ] Rollback plan exists (if needed)
- [ ] Performance implications considered
- [ ] Security implications considered

## Step 7: Create the Plan Document

Generate a comprehensive plan document with:

```markdown
# Feature: [Feature Name]

## Overview

[Brief description and motivation]

## Requirements

- [List all requirements]

## Architecture

[High-level design diagram or description]

## Components

### Component 1: [Name]

- **Purpose**: [What it does]
- **Interfaces**: [What it exposes]
- **Dependencies**: [What it needs]
- **Implementation notes**: [Key decisions]

[Repeat for each component]

## Data Model

[Describe data structures and flow]

## Implementation Phases

### Phase 1: [Name]

- [ ] Task 1
- [ ] Task 2

[Repeat for each phase]

## Testing Strategy

[How this will be tested]

## Risks and Mitigation

- **Risk 1**: [Description] → **Mitigation**: [How to handle]

## Open Questions

- [Things still to be decided]

## Success Criteria

- [How we know this is done well]
```

## Output

The result should be a detailed, actionable plan that:

- Anticipates problems before they occur
- Provides clear guidance for implementation
- Makes architectural decisions explicit
- Breaks work into manageable pieces
- Considers the full context of the codebase
