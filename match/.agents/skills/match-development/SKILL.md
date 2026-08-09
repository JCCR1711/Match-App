# Match — Architecture & Agent Rules

## 1. Project Architecture

Match uses a **feature-based architecture with progressive architectural complexity**.

The architecture is not a fixed list of folders.

The important rule is:

> **Organize code according to responsibility and feature ownership, not according to a predetermined folder checklist.**

The current project structure is:

```text
match/
│
├── app/
│   ├── (tabs)/
│   ├── auth/
│   ├── dashboard/
│   ├── index.tsx
│   └── _layout.tsx
│
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ui/
│   ├── constants/
│   ├── context/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── home/
│   ├── hooks/
│   ├── services/
│   │   ├── api/
│   │   └── storage/
│   ├── theme/
│   ├── types/
│   └── utils/
│
├── .agents/
├── AGENTS.md
├── ARCHITECTURE.md
├── README.md
├── TEAM_WORKFLOW.md
└── package.json
```

This is the **current structure**, not a restriction that prevents the project from growing.

---

# 2. Architecture Rules

The project must follow these principles:

```text
Routes
  ↓
Features
  ↓
Reusable UI / Feature Components
  ↓
Business Logic when required
  ↓
Services / Infrastructure when required
```

The exact layers depend on the complexity of the feature.

A simple visual feature may only need:

```text
Route
 ↓
View
 ↓
Components
```

A real business feature may eventually require:

```text
Route
 ↓
View
 ↓
Feature
 ↓
Application / Use Case
 ↓
Domain
 ↓
Infrastructure / API
```

Do not create the second structure when the first one is sufficient.

---

# 3. `app/` Responsibility

`app/` belongs to Expo Router.

It is responsible for:

- routes;
- layouts;
- route groups;
- dynamic routes;
- navigation entry points;
- route parameters.

Do not use `app/` for:

- reusable global components;
- API clients;
- repositories;
- business rules;
- domain models;
- shared utilities;
- complex feature logic.

Example:

```text
app/dashboard/[id].tsx
        ↓
src/features/dashboard/views/PerformanceFieldView.tsx
```

The route connects Expo Router with the feature.

---

# 4. `src/features/`

`src/features/` contains application features.

Current features include:

```text
src/features/
├── auth/
├── dashboard/
└── home/
```

A feature owns code that is specifically related to that functionality.

For example:

```text
src/features/dashboard/
├── components/
├── services/
├── types/
└── views/
```

The exact internal structure is not mandatory.

Create only the directories that the feature actually needs.

---

# 5. Creating a New Feature

If a new business or application feature appears, **do not force it into an existing feature just to preserve the current folder list**.

Create a new feature when the responsibility is genuinely different.

For example, if Match later introduces:

```text
notifications
profile
matches
settings
payments
```

the structure may evolve into:

```text
src/features/
├── auth/
├── dashboard/
├── home/
├── matches/
├── notifications/
├── profile/
└── settings/
```

This is correct.

The architecture grows with the application.

Do not modify the entire architecture simply because a new feature was added.

---

# 6. Creating New Folders

The current folder structure is **not exhaustive**.

Agents are allowed to create new folders when there is a real responsibility that is not appropriately represented by an existing folder.

Before creating a folder:

1. Search for an existing folder with the same responsibility.
2. Check whether the code belongs to an existing feature.
3. Check whether it should be shared or feature-specific.
4. Check whether the new folder represents a real responsibility.
5. Avoid creating duplicate or synonymous folders.

For example, do not create:

```text
src/helpers/
src/helper/
src/utils/
src/common/
```

for essentially the same responsibility.

Use the existing appropriate location.

---

# 7. Shared vs Feature-Specific Code

Use this rule:

### Feature-specific

If the code only belongs to one feature:

```text
src/features/dashboard/components/
src/features/dashboard/services/
src/features/dashboard/types/
```

### Shared

If the code is genuinely reused across multiple unrelated features:

```text
src/components/
src/hooks/
src/services/
src/types/
src/utils/
```

Do not move code to shared folders merely because it might be reused someday.

> **Share code when reuse is real, not hypothetical.**

---

# 8. Components

Global reusable UI belongs in:

```text
src/components/
```

Current examples:

```text
src/components/ui/
├── CustomButton.tsx
├── CustomText.tsx
├── CustomTextTitle.tsx
└── TextSubTitle.tsx
```

Feature-specific components belong inside their feature:

```text
src/features/dashboard/components/
src/features/auth/components/
```

Before creating a component:

1. Search `src/components/`.
2. Search the current feature.
3. Check whether an existing component can be reused.
4. Extend an existing component when appropriate.
5. Create a new component only when it provides meaningful value.

Do not duplicate existing components.

---

# 9. Services

Services must have a clear responsibility.

Shared infrastructure can live in:

```text
src/services/
├── api/
└── storage/
```

Feature-specific services can live inside the feature:

```text
src/features/auth/services/
src/features/dashboard/services/
```

Do not create services simply because a function performs an action.

For example:

```ts
router.push("/dashboard");
```

does not require a navigation service.

---

# 10. Types

Shared types belong in:

```text
src/types/
```

Feature-specific types belong inside the feature:

```text
src/features/dashboard/types/
src/features/auth/types/
```

Do not place every type in `src/types/`.

Use the narrowest appropriate ownership.

---

# 11. Hooks

Shared hooks belong in:

```text
src/hooks/
```

Feature-specific hooks should belong to the feature when they are not useful elsewhere.

For example:

```text
src/features/dashboard/hooks/
```

may be created when dashboard-specific hooks become necessary.

Do not create a hook merely to move a few lines of code.

---

# 12. Domain and Application Layers

The project does **not** require `domain/` or `application/` folders for every feature.

Introduce them when real business complexity appears.

For example:

```text
src/features/matches/
├── components/
├── views/
├── hooks/
├── domain/
└── application/
```

or, if the domain is sufficiently shared:

```text
src/domain/
src/application/
```

The decision must be based on actual responsibilities.

Do not create empty architectural folders.

Do not create repositories, use cases, factories or adapters for visual prototypes.

---

# 13. Visual Prototype Rule

Match is currently evolving from a visual prototype toward production functionality.

If the requirement is visual:

```text
Figma
 ↓
Screen
 ↓
Components
 ↓
Navigation
```

is normally sufficient.

Do not automatically introduce:

- API calls;
- repositories;
- use cases;
- domain models;
- persistence;
- authentication systems;
- global state;
- backend integration.

Only introduce these when the requested functionality actually requires them.

---

# 14. Architecture Evolution

The architecture is expected to evolve.

A feature may start as:

```text
features/profile/
└── views/
```

and later become:

```text
features/profile/
├── components/
├── views/
├── hooks/
├── services/
├── types/
└── application/
```

This is not architectural inconsistency.

It is **progressive architecture**.

Do not force every feature to have identical folders.

Features should have the structure they actually need.

---

# 15. New Feature Decision Process

When implementing something new, the agent must determine:

### Step 1 — What is it?

Is it:

- a route?
- a global UI component?
- a feature component?
- a feature?
- a hook?
- a service?
- a type?
- a utility?
- business logic?
- infrastructure?

### Step 2 — Who owns it?

Determine whether it is:

```text
Global
```

or:

```text
Feature-specific
```

### Step 3 — Does the folder already exist?

Search before creating.

### Step 4 — Does the responsibility justify a new folder?

If yes, create it.

If no, use the existing appropriate location.

### Step 5 — Is additional architecture actually necessary?

Do not introduce layers for hypothetical future requirements.

---

# 16. Folder Naming

Use consistent, descriptive names.

Prefer:

```text
components
views
services
types
hooks
utils
```

Avoid unnecessary synonyms:

```text
helpers
helper
common
shared
misc
stuff
```

unless the responsibility is genuinely different.

Use singular/plural naming consistently with the existing project.

---

# 17. Import Rules

Prefer path aliases when configured:

```ts
@/src/...
```

Avoid unnecessary deeply nested relative imports such as:

```ts
../../../../components/...
```

Do not create new aliases without a clear reason.

---

# 18. Architecture Documentation

The architecture must be documented in:

```text
ARCHITECTURE.md
```

`README.md` should provide a concise overview and point developers toward the architecture documentation.

`AGENTS.md` defines how AI agents should work within the architecture.

`.agents/` contains agent-specific skills and instructions.

These files have different purposes:

```text
README.md
    ↓
Project overview

ARCHITECTURE.md
    ↓
Where code belongs and how the architecture evolves

AGENTS.md
    ↓
How AI agents must modify the project

.agents/
    ↓
Specialized skills/instructions for specific development tasks
```

Do not duplicate the entire architecture across all files.

---

# 19. `.agents/skills`

The `.agents/` directory is part of the agent tooling and must follow the same architectural principles.

If specialized skills are needed, organize them by responsibility.

Example:

```text
.agents/
└── skills/
    ├── react-native/
    ├── expo-router/
    ├── ui/
    ├── testing/
    └── architecture/
```

Only create a skill when it provides reusable agent instructions for a recurring task.

Do not create a skill for a one-off task.

Agent skills must complement `AGENTS.md`.

They must not contradict it.

---

# 20. Source of Truth

When deciding where code belongs, use this hierarchy:

```text
Current user requirement
        ↓
Current project architecture
        ↓
Feature ownership
        ↓
Existing reusable code
        ↓
Architecture documentation
        ↓
General best practices
```

Do not blindly copy a generic architecture from the internet.

Match's architecture must reflect Match's actual needs.

---

# 21. Golden Rule

The structure shown in this document is the **current architecture**, not a closed list of allowed directories.

When Match grows:

```text
New requirement
      ↓
Determine responsibility
      ↓
Determine ownership
      ↓
Search existing structure
      ↓
Reuse if possible
      ↓
Create a new folder/feature if justified
      ↓
Keep the same architectural principles
```

The agent must never think:

> "This folder does not exist, therefore I cannot create it."

Instead:

> "This responsibility does not currently exist. Does the architecture justify introducing it?"

If yes, create it in the correct architectural location.

If no, keep the implementation inside the existing structure.

**The architecture defines the rules.
The folder tree is allowed to evolve.**
