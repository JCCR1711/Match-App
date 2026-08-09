# Match — Claude Instructions

Match uses a feature-oriented architecture.

## Source of Truth

Read these files before making architectural changes:

- `AGENTS.md` — agent development rules and project conventions.
- `ARCHITECTURE.md` — official project architecture.
- `TEAM_WORKFLOW.md` — team and Git workflow.

## Architecture

Use:

```text
app/
```

for Expo Router routes only.

Use:

```text
src/features/
```

for feature-specific implementation.

Current features:

```text
src/features/auth/
src/features/dashboard/
src/features/home/
```

Use:

```text
src/components/
```

for globally reusable components.

Use:

```text
src/services/
```

for services shared across features.

Use:

```text
src/context/
```

for application-wide React context.

Use:

```text
src/hooks/
```

for shared hooks.

Use:

```text
src/theme/
```

for global design-system values.

Use:

```text
src/types/
```

for types shared across features.

## Important Rules

- Do not create duplicate architectural folders.
- Do not introduce `src/feature/`; the project uses `src/features/`.
- Do not put business logic inside `app/`.
- Do not create global mock-data files.
- Do not create unnecessary architectural layers.
- Search before creating, moving, or deleting files.
- Reuse existing components when possible.
- Keep prototype functionality simple.
- Do not introduce production architecture unless the requirement needs it.
- Run `npx tsc --noEmit` after relevant TypeScript changes.

When uncertain:

> Inspect the existing project first, follow `AGENTS.md` and `ARCHITECTURE.md`, make the smallest correct change, and verify it.
