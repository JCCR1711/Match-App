# Match Architecture

> Para decisiones sobre cuentas, modos de uso, organizaciones, permisos y planes, consultar también [`PRODUCT_MODEL.md`](./PRODUCT_MODEL.md).

## 1. Architecture Overview

Match uses a **feature-oriented architecture** built on top of Expo Router.

The architecture separates:

- navigation;
- feature implementation;
- shared UI;
- shared services;
- shared types;
- application context;
- theme and constants.

The main rule is:

> `app/` handles routing. `src/features/` handles feature implementation. Shared code belongs in the appropriate global `src/` directory.

---

# 2. Project Structure

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
│   │
│   ├── components/
│   │   └── ui/
│   │
│   ├── constants/
│   │
│   ├── context/
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── views/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── views/
│   │   │
│   │   └── home/
│   │       ├── components/
│   │       ├── services/
│   │       ├── types/
│   │       └── views/
│   │
│   ├── hooks/
│   ├── services/
│   │   ├── api/
│   │   └── storage/
│   │
│   ├── theme/
│   ├── types/
│   └── utils/
│
├── assets/
│
├── AGENTS.md
├── ARCHITECTURE.md
├── CLAUDE.md
├── README.md
└── TEAM_WORKFLOW.md
```

---

# 3. `app/`

`app/` is exclusively for Expo Router.

It contains:

- routes;
- layouts;
- route groups;
- route parameters;
- navigation entry points.

Example:

```text
app/auth/login/index.tsx
```

The route connects Expo Router with the feature implementation:

```text
app/auth/login/index.tsx
        ↓
src/features/auth/views/LoginView.tsx
```

Do not place reusable components, services, business logic, or shared types inside `app/`.

---

# 4. `src/features/`

Feature-specific code belongs under:

```text
src/features/
```

Current features:

```text
auth/
dashboard/
home/
```

Each feature owns its own implementation.

Standard structure:

```text
feature/
├── components/
├── services/
├── types/
└── views/
```

Folders should only be created when they are actually needed.

---

# 5. Auth

```text
src/features/auth/
```

Responsible for authentication and onboarding-related functionality.

Examples:

- login;
- registration;
- verification;
- onboarding;
- authentication UI.

Feature-specific code belongs here.

Global authentication state may live in:

```text
src/context/
```

when it is shared across the application.

Authentication owns identity and session state. Business roles, organization memberships and subscription plans must not be collapsed into a single authentication role. The target domain model is defined in `PRODUCT_MODEL.md`.

---

# 6. Dashboard

```text
src/features/dashboard/
```

Responsible for dashboard functionality.

Examples:

- dashboard summary;
- field performance;
- reservations;
- field-related UI;
- dashboard services;
- dashboard-specific types.

---

# 7. Home

```text
src/features/home/
```

Responsible for home-specific functionality and UI.

---

# 8. Components

Globally reusable components belong in:

```text
src/components/
```

Currently:

```text
src/components/ui/
```

Examples:

```text
CustomButton.tsx
CustomText.tsx
CustomTextTitle.tsx
TextSubTitle.tsx
```

A component used only by one feature belongs inside that feature:

```text
src/features/dashboard/components/
```

Do not duplicate shared components.

---

# 9. Services

Feature-specific services:

```text
src/features/auth/services/
src/features/dashboard/services/
src/features/home/services/
```

Shared services:

```text
src/services/
src/services/api/
src/services/storage/
```

A service should be global only when multiple features genuinely use it.

---

# 10. Types

Feature-specific types:

```text
src/features/auth/types/
src/features/dashboard/types/
src/features/home/types/
```

Shared types:

```text
src/types/
```

Do not duplicate types across features.

---

# 11. Context

Application-wide React context belongs in:

```text
src/context/
```

Current authentication context:

```text
src/context/AuthContext.tsx
src/context/AuthProvider.tsx
```

Context should only be used when state genuinely needs to be shared.

---

# 12. Hooks

Shared hooks:

```text
src/hooks/
```

Feature-specific hooks may live inside their respective feature if required.

Avoid creating hooks for trivial logic.

---

# 13. Theme

Global design values belong in:

```text
src/theme/
```

Current files:

```text
colors.ts
spacing.ts
typography.ts
index.ts
```

Use these values when they are reused across the application.

---

# 14. Constants

Global constants belong in:

```text
src/constants/
```

Do not use this directory for:

- feature-specific data;
- mock data;
- API responses;
- feature-specific configuration.

---

# 15. Temporary / Mock Data

Temporary data should remain close to the feature that uses it.

For example:

```text
src/features/dashboard/data/
```

may be created when dashboard prototype data is genuinely required.

Do not create global mock-data files.

Do not duplicate mock data in multiple features.

Temporary data should be removed when the real data source is introduced.

---

# 16. Dependency Direction

The preferred dependency direction is:

```text
app/
  ↓
features/
  ↓
shared components / services / types
```

Routes should not become business-logic containers.

Feature implementation should not depend on route-specific files.

Shared modules should not depend on a specific feature unless there is a strong architectural reason.

---

# 17. No Duplicate Architecture

The project must use one consistent structure.

Use:

```text
src/features/
```

Do not introduce:

```text
src/feature/
src/modules/
src/screens/
```

as alternative feature architectures.

Use:

```text
src/components/
```

for shared components.

Do not introduce parallel folders such as:

```text
src/ui/
src/shared/components/
```

without a deliberate architecture change.

---

# 18. Architecture Evolution

The architecture should evolve according to complexity.

Simple:

```text
Route
 ↓
View
```

Feature-oriented:

```text
Route
 ↓
Feature View
 ↓
Feature Components
```

More complex functionality may eventually become:

```text
Route
 ↓
Feature
 ↓
Application logic
 ↓
Domain logic
 ↓
Repository
 ↓
API
```

The more complex architecture must not be introduced prematurely.

---

# 19. Main Rule

Before creating a file or directory:

1. Check whether the responsibility already has a home.
2. Search for an existing implementation.
3. Check whether the code is feature-specific or shared.
4. Avoid duplicate structures.
5. Create new architecture only when the current requirement justifies it.

The architecture should remain simple, consistent, and easy to evolve.
