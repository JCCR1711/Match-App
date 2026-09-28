---
name: match-development
description: Implement or modify MATCH screens, feature code, shared UI, or Expo Router navigation while preserving the project's ownership, theme, and validation conventions. Use for application code changes; not for documentation-only or repository-administration tasks.
---

# MATCH development

Use this workflow only for code changes in MATCH. `AGENTS.md` remains authoritative for stable project rules.

## Focused discovery

1. Start at the requested route/view/component and inspect its direct imports.
2. Search the affected feature and `src/components/` for an existing implementation before creating code.
3. Read only the conditional source needed for the task:
   - structure or ownership change: `ARCHITECTURE.md`;
   - auth, modes, organizations, roles, plans or permissions: `PRODUCT_MODEL.md`;
   - mock/demo behavior or persistence: `DEVELOPMENT_TESTING.md`;
   - API/gateway change: the nearest feature `*_API.md`.
4. Check the nearest route layout and navigation guard only when the task affects reachability or flow.

## Placement

- Keep `app/` routes thin and put implementation in `src/features/<feature>/`.
- Keep feature-only components, hooks, services, queries, types and utilities within that feature.
- Use shared `src/` directories only for proven cross-feature responsibilities.
- Reuse `src/components/ui/` primitives and `src/theme/` tokens before adding variants or values.
- Add the minimum layer needed by current behavior; do not scaffold hypothetical architecture.

## Change and verify

- Preserve unrelated dirty-worktree changes and avoid broad formatting.
- For navigation, confirm typed route paths, parameters and the owning layout/guard.
- For server state, keep query keys/hooks beside the feature gateway and invalidate only affected data.
- Use TanStack Query for shared asynchronous data and include its account, organization, or resource scope in query keys. Never expose seed or placeholder data as hydrated content.
- For initial loading of structured screens, compose a feature skeleton from `AppSkeleton` so the shimmer mirrors the final hierarchy. Keep spinners for compact actions or waits without a stable layout.
- For prototype-only requests, do not add backend, persistence or production authorization.
- Run the smallest relevant check first. Use `npm run typecheck` for relevant TypeScript/structural changes and `npm run lint` for changed code; add a focused manual flow when behavior changed.
- Finish by reviewing the scoped diff and reporting validations and unverified behavior.
