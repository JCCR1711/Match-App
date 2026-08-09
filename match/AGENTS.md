# Match — Agent Development Guidelines

## 1. Project Overview

Match is a mobile application built with:

- Expo 54
- React Native 0.81.5
- React 19.1
- TypeScript 5.9
- Expo Router 6
- React Navigation 7
- React Native Reanimated 4
- React Native Gesture Handler
- React Native Safe Area Context
- React Native SVG
- Expo Image
- Material Symbols
- Expo Vector Icons

The application targets:

- iOS
- Android
- Web where supported

Match is currently in an **early visual prototype stage**.

---

# 2. Current Development Stage

The current application contains visual prototypes and temporary implementations.

Existing code may contain:

- placeholder data;
- temporary state;
- temporary navigation;
- visual-only interactions;
- incomplete functionality;
- prototype authentication;
- temporary components.

Do not assume that prototype code represents the final production implementation.

At the same time, do not over-engineer the application.

The current priority is:

> Build and refine the application incrementally while maintaining a clean architecture that can evolve into production functionality.

---

# 3. Architecture Philosophy

Match follows a **feature-oriented architecture**.

The architecture is **evolutionary, not rigid**.

The existing folder structure is a starting point, not a fixed list of folders that must never change.

When a new feature or responsibility appears, determine where it belongs based on the architectural rules below.

Do not create folders simply because another project uses them.

Do not create every possible architectural layer in advance.

Architecture should grow according to actual complexity.

The main rule is:

> Organize code according to responsibility and feature ownership, not according to file type alone.

---

# 4. Source Architecture

The project uses the following high-level structure:

```text
src/
├── assets/
├── components/
│   └── ui/
├── constants/
├── context/
├── features/
│   ├── auth/
│   ├── dashboard/
│   └── home/
├── hooks/
├── services/
│   ├── api/
│   └── storage/
├── theme/
├── types/
└── utils/
```

This structure is **not exhaustive**.

New features may be added under:

```text
src/features/<feature-name>/
```

when they represent a distinct business or product capability.

For example:

```text
src/features/payments/
src/features/profile/
src/features/matches/
src/features/notifications/
```

The exact feature name must reflect the actual domain responsibility.

---

# 5. Feature Structure

A feature owns code that is specific to that feature.

A feature may contain only the folders it actually needs.

For example:

```text
src/features/auth/
├── components/
├── services/
├── types/
└── views/
```

Another feature may require a different structure:

```text
src/features/payments/
├── components/
├── services/
├── types/
├── views/
└── hooks/
```

Another simple feature may only need:

```text
src/features/profile/
├── components/
└── views/
```

Do not create empty architectural folders just for consistency.

The rule is:

> Create a folder only when there is code that logically belongs there.

---

# 6. How to Decide Where New Code Goes

Before creating a new file or folder, determine:

1. Is it specific to one feature?
2. Is it reusable across multiple features?
3. Is it application infrastructure?
4. Is it a global design-system concern?
5. Is it a shared type or utility?
6. Is it route-specific?

Use the following decision process.

### Feature-specific code

If code belongs only to one feature:

```text
src/features/<feature>/
```

Examples:

```text
src/features/auth/components/
src/features/dashboard/services/
src/features/profile/types/
```

### Shared UI

If a component is genuinely reusable across multiple features:

```text
src/components/
```

Example:

```text
src/components/ui/CustomButton.tsx
```

Do not move a feature-specific component into `components/` merely because it may theoretically be reusable.

### Shared services

If a service is used by multiple features:

```text
src/services/
```

Examples:

```text
src/services/api/
src/services/storage/
```

If the service only belongs to one feature:

```text
src/features/<feature>/services/
```

### Shared types

If a type is used across multiple features:

```text
src/types/
```

If a type belongs exclusively to one feature:

```text
src/features/<feature>/types/
```

### Shared hooks

If a hook is used across multiple features:

```text
src/hooks/
```

If it belongs exclusively to one feature:

```text
src/features/<feature>/hooks/
```

### Global design system

Global design values belong in:

```text
src/theme/
```

Examples:

```text
colors.ts
spacing.ts
typography.ts
```

### Utilities

Generic, feature-independent helper functions belong in:

```text
src/utils/
```

Do not use `utils/` as a dumping ground.

If a helper is specific to one feature, keep it inside that feature.

---

# 7. Adding a New Feature

When a new business feature appears, do not modify an unrelated existing feature.

Create a new feature when the functionality represents a distinct responsibility.

For example:

```text
src/features/matches/
```

The feature can evolve progressively:

```text
src/features/matches/
├── components/
├── views/
├── services/
├── types/
└── hooks/
```

Only create the folders that are actually required.

If the feature later becomes more complex, additional layers may be introduced.

For example:

```text
src/features/matches/
├── components/
├── views/
├── hooks/
├── services/
├── types/
├── validators/
└── repositories/
```

This does NOT mean every feature should have all these folders.

---

# 8. Architecture Evolution

Match should evolve progressively.

A simple feature may initially be:

```text
Route
 ↓
View
 ↓
Component
```

A feature requiring real application logic may evolve into:

```text
Route
 ↓
View
 ↓
Feature logic
 ↓
Service
 ↓
API
```

A complex feature may eventually become:

```text
Route
 ↓
View
 ↓
Hook / Application logic
 ↓
Use Case
 ↓
Repository
 ↓
API
```

Do not introduce repositories, use cases, domain layers, adapters, factories or dependency injection unless the feature actually benefits from them.

The existence of a folder in another feature does not automatically require the same folder in every feature.

---

# 9. Expo Router

The `app/` directory is reserved for Expo Router.

It contains:

- routes;
- layouts;
- route groups;
- route parameters;
- navigation entry points.

Do not place feature business logic inside route files.

Do not create a second navigation system.

A route should generally connect Expo Router with the appropriate feature view.

Example:

```text
app/auth/login/index.tsx
        ↓
src/features/auth/views/LoginView.tsx
```

Another example:

```text
app/dashboard/[id].tsx
        ↓
src/features/dashboard/views/PerformanceFieldView.tsx
```

The route should remain thin.

---

# 10. Feature Ownership

When deciding where a file belongs, prefer **feature ownership** over technical category.

For example:

```text
ClientReservationCard
```

belongs to the dashboard feature if it only exists for the dashboard:

```text
src/features/dashboard/components/ClientReservationCard.tsx
```

It should not be moved to:

```text
src/components/
```

unless it becomes genuinely shared.

Similarly:

```text
LoginView
RegisterView
VerifyUserView
```

belong to:

```text
src/features/auth/views/
```

---

# 11. Avoid Duplicate Structures

Do not create multiple folders representing the same responsibility.

Avoid structures such as:

```text
src/components/
src/shared/components/
src/common/components/
src/ui/
```

when they all serve the same purpose.

Avoid:

```text
src/services/
src/api/
src/network/
```

if they duplicate the same responsibility.

Avoid:

```text
src/types/
src/models/
src/interfaces/
```

unless those concepts have clearly different responsibilities.

The project should have **one clear location for each responsibility**.

---

# 12. Existing Architecture Is Not Sacred

Existing folders may be reorganized when there is a real architectural reason.

However:

- do not reorganize the entire project unnecessarily;
- do not move files merely to make the tree look different;
- do not perform large refactors during unrelated tasks;
- preserve imports and behavior;
- verify the project after structural changes.

The goal is consistency, not constant movement.

---

# 13. Reusable Components

Before creating a component:

1. Search `src/components/`.
2. Search the current feature.
3. Check whether an existing component can be reused.
4. Extend an existing component when appropriate.
5. Create a new component only when it provides meaningful value.

Do not create duplicate components with slightly different names.

For example, do not create:

```text
CustomButton.tsx
ButtonCustom.tsx
PrimaryButton.tsx
GenericButton.tsx
```

without a real distinction.

---

# 14. Atomic Design

Atomic Design may be used where it provides value.

Conceptually:

```text
Atoms
 ↓
Molecules
 ↓
Organisms
 ↓
Templates
 ↓
Screens
```

However, do not force Atomic Design onto every component.

Do not turn every:

```tsx
<View />
<Text />
<Pressable />
```

into a separate component.

Abstraction must provide meaningful reuse, consistency, behavior or testability.

---

# 15. React Components

Prefer:

- functional components;
- TypeScript;
- explicit props;
- composition;
- focused responsibilities;
- readable JSX.

Avoid:

- God components;
- duplicated UI;
- unnecessary abstractions;
- excessive boolean props;
- unrelated responsibilities in one component.

Extract components based on responsibility and reuse, not simply file length.

---

# 16. TypeScript

All new code must use TypeScript.

Avoid:

```ts
any;
```

Do not use `any` simply to silence TypeScript errors.

Prefer:

- explicit types;
- interfaces;
- type aliases;
- discriminated unions;
- generics;
- type guards.

Do not leave parameters implicitly typed when TypeScript can infer or explicitly define the correct type.

Use meaningful names.

Avoid vague names such as:

```text
data
obj
thing
temp
value
result
```

when a meaningful name is available.

---

# 17. Styling

Use React Native styling consistently.

Prefer:

```tsx
StyleSheet.create({
  ...
})
```

for local component styles.

Use existing theme values when they already represent the required design value.

Global design values belong in:

```text
src/theme/
```

Do not introduce a styling library without a clear requirement.

---

# 18. Design System

The project gradually develops a shared design system.

Global reusable values may include:

- colors;
- typography;
- spacing;
- border radius;
- dimensions;
- icon sizes;
- animation durations.

Do not build an unnecessarily complex design-token system before there is a real need.

Create tokens when values are actually reused.

---

# 19. State Management

First determine what type of state is required:

- local UI state;
- form state;
- shared application state;
- server state;
- domain state.

For visual prototypes, prefer local state.

Do not introduce Redux, Zustand, MobX or another state-management library without a real requirement.

Avoid duplicated state.

Prefer derived values when possible.

---

# 20. Hooks

Hooks should have focused responsibilities.

Do not create custom hooks merely to move a few lines of trivial code.

Avoid hooks that combine unrelated responsibilities such as:

- fetching;
- navigation;
- persistence;
- notifications;
- unrelated UI state.

Avoid unnecessary `useEffect`.

---

# 21. Services and API

Services shared by multiple features belong in:

```text
src/services/
```

Feature-specific services belong in:

```text
src/features/<feature>/services/
```

When real APIs are introduced, keep network concerns separated from UI.

A sufficiently complex integration may evolve into:

```text
API DTO
 ↓
Mapper
 ↓
Application model
 ↓
UI
```

Do not create repositories or use cases for simple prototype data.

---

# 22. Mock and Temporary Data

Mock data is temporary and should not determine the permanent architecture.

Do not create global mock-data folders simply because mock data exists.

If mock data is needed for a feature, keep it close to that feature.

Example:

```text
src/features/dashboard/data/
```

When the mock is removed, remove the folder if it is no longer needed.

Do not keep obsolete mock infrastructure.

---

# 23. Authentication

Authentication may currently be prototype behavior.

Do not assume that the existence of login or registration screens means production authentication must be implemented.

When real authentication is introduced, consider:

- secure token handling;
- secure storage;
- authentication state;
- session expiration;
- authorization;
- backend enforcement;
- error handling.

Never store sensitive credentials insecurely.

---

# 24. Forms

For prototype forms, implement only the requested behavior.

Forms may initially contain:

- inputs;
- labels;
- visual validation;
- buttons;
- navigation.

Do not automatically connect forms to APIs or databases.

When real functionality is introduced, consider:

- validation;
- field errors;
- loading;
- submission state;
- server errors;
- keyboard behavior;
- accessibility.

---

# 25. Navigation

Use Expo Router exclusively.

Examples:

```tsx
router.push("/auth/register");
```

or:

```tsx
router.replace("/auth/slides");
```

Navigation does not automatically imply backend functionality.

A prototype login screen may navigate to another screen without implementing real authentication.

---

# 26. Accessibility

Consider accessibility from the beginning.

Interactive elements should have appropriate:

- `accessibilityLabel`;
- `accessibilityRole`;
- `accessibilityHint`;
- accessibility state.

Also consider:

- touch target size;
- contrast;
- readable text;
- screen readers;
- focus behavior.

---

# 27. Security

Never commit:

- passwords;
- API secrets;
- private keys;
- access tokens;
- credentials.

Never disable TLS validation in production.

Do not log sensitive information.

Anything included in a mobile application bundle may potentially be inspected.

Client-side checks are not an authorization boundary.

---

# 28. Testing

Testing should grow with functionality.

For the current prototype stage, prioritize:

- important reusable components;
- complex UI behavior;
- important navigation flows;
- business logic once introduced.

When business logic exists, consider:

### Unit tests

For:

- validation;
- business rules;
- transformations;
- utilities.

### Component tests

For:

- user interactions;
- UI states;
- accessibility;
- component behavior.

### Integration tests

For:

- feature flows;
- API integration;
- state interactions.

### E2E tests

For critical user journeys.

Test observable behavior rather than implementation details.

---

# 29. Dependencies

Before adding a dependency:

1. Check Expo.
2. Check React Native.
3. Check the existing project.
4. Check existing dependencies.
5. Verify Expo 54 compatibility.
6. Evaluate maintenance and security.
7. Confirm meaningful value.

Do not add dependencies merely because they are popular.

---

# 30. Git

Keep changes focused.

Do not:

- modify unrelated files;
- reformat entire files unnecessarily;
- mix unrelated refactors with features;
- rewrite architecture without a requirement;
- delete code without checking dependencies.

Prefer small, reviewable changes.

---

# 31. Debugging

When fixing an issue:

1. Understand the expected behavior.
2. Inspect the relevant files.
3. Identify the root cause.
4. Make the smallest safe change.
5. Verify the result.
6. Check for regressions.

Do not hide symptoms instead of fixing the underlying problem.

---

# 32. Required Verification

After structural changes or significant code changes, verify:

```bash
npx tsc --noEmit
```

Also verify the relevant application flow when possible.

When creating or moving files:

```bash
find app src -maxdepth 5 -type f | sort
```

may be used to verify the resulting structure.

When changing imports, search for old paths before deleting files.

Never delete a file simply because it appears unused without checking references.

---

# 33. Agent Decision Rules

Before creating a file, ask:

> What responsibility does this file have?

Before creating a folder, ask:

> Is there actual code that belongs here?

Before creating a new feature, ask:

> Is this a distinct product or business responsibility?

Before creating a shared component, ask:

> Is this actually reused across features?

Before creating a service, ask:

> Does this require shared or isolated application logic?

Before creating a repository or use case, ask:

> Does the current complexity justify another architectural layer?

Before moving a file, ask:

> Does the new location make ownership clearer without creating unnecessary churn?

Before deleting a file, ask:

> Have all references and imports been checked?

---

# 34. Golden Architecture Rule

The exact folder tree will evolve.

The architectural rules must remain stable.

Therefore, agents must NOT treat the current folder tree as an immutable specification.

Instead, follow these principles:

```text
Feature ownership
        ↓
Clear responsibility
        ↓
Reuse only when justified
        ↓
Shared infrastructure only when actually shared
        ↓
Additional layers only when complexity requires them
```

A new feature must follow the same architectural principles even if its folder structure differs from existing features.

For example, if a future feature requires:

```text
src/features/payments/
```

the agent must organize it according to the feature's actual responsibilities rather than blindly copying the current `auth` or `dashboard` structure.

---

# 35. Prototype Rule

When the user says a screen, button, form or component is visual only, assume:

- no backend;
- no database;
- no real authentication;
- no persistence;
- no production business logic;

unless explicitly requested.

A button may simply navigate.

An input may simply accept visual input.

A card may simply display temporary data.

This is intentional during the prototype stage.

---

# 36. Golden Rule

The goal is not to create the most sophisticated architecture.

The goal is:

> Build the simplest professional implementation that satisfies the current requirement while keeping Match easy to evolve.

For every change, prioritize:

```text
Correctness
    ↓
Security
    ↓
Maintainability
    ↓
Simplicity
    ↓
Performance
```

And remember:

# 37. Agent Skills

The `.agents/skills/` directory contains specialized instructions for recurring development tasks.

Agents must use the relevant skill when one exists for the current task.

Before implementing a task, determine whether a specialized skill applies.

Examples:

```text
React Native task
    ↓
Relevant React Native skill

Expo Router task
    ↓
Relevant Expo Router skill

UI / Figma task
    ↓
Relevant UI skill

Testing task
    ↓
Relevant testing skill

Architecture task
    ↓
Relevant architecture skill
```

Skills provide specialized guidance and must be used together with this `AGENTS.md`.

The relationship is:

```text
AGENTS.md
    ↓
General rules for all Match agent work
    ↓
.agents/skills/
    ↓
Specialized instructions for the current task
    ↓
ARCHITECTURE.md
    ↓
Current Match architecture and ownership
```

## Skill Rules

Agents must:

1. Check whether a relevant skill exists before starting a specialized task.
2. Read and follow the applicable `SKILL.md`.
3. Apply the skill together with the rules in this `AGENTS.md`.
4. Follow `ARCHITECTURE.md` when the task affects project structure.
5. Never treat the current folder tree as immutable.
6. Never ignore a relevant skill when one exists.
7. Never create a new skill for a one-off task unless explicitly requested.

Skills must complement the project rules.

If a skill conflicts with this document, follow the more specific and applicable instruction while preserving the project's architectural and security requirements.

Do not duplicate the entire content of skills inside `AGENTS.md`.

`AGENTS.md` defines **general agent behavior**.

`.agents/skills/` defines **specialized task behavior**.

`ARCHITECTURE.md` defines **where code belongs and how the architecture evolves**.

> The folder structure will change as Match grows. The architectural principles should remain consistent.

---

# 38. Product Domain Model

Before changing user types, onboarding modes, venue ownership, organization permissions, subscriptions, premium capabilities or related navigation, read:

```text
PRODUCT_MODEL.md
```

`PRODUCT_MODEL.md` defines the current product direction for:

- one account with player and venue-management modes;
- organizations and venue memberships;
- owner, manager and staff permissions;
- player and business subscription scopes;
- server-side authorization boundaries;
- the recommended implementation sequence.

Do not reintroduce a single `player | admin` role as the final domain model, and do not use a global `isPro` boolean for unrelated subscription products.
