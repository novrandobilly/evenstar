---
name: enhanced-solid-principle
description: Enhanced SOLID principle for this codebase. Apply when creating, reviewing, or refactoring any file — components, hooks, helpers, or tools. Every file must have exactly one clear goal; if it has more, extract.
---

# Enhanced SOLID Principle

This codebase follows an **enhanced Single Responsibility Principle**: every file has exactly one clearly stated goal. If a file does more than one thing, extract the extra responsibility into its own file.

This applies to components, hooks, helpers, tools, and data files.

---

## The Core Rule

> A file should do one thing, and only one thing.

Before writing or reviewing any file, ask: **what is this file's single job?** If you cannot answer that in one sentence without using "and", the file needs to be split.

---

## Feature Folder Structure

Self-contained pages and features are organized as folders:

```
SessionPage/
├── index.tsx                        # Page entry: orchestrates layout, routing, filter state
├── features/
│   ├── SessionCard.tsx              # Renders one session card (composes subsession components)
│   ├── MatchSubsession.tsx          # Renders one match subsession
│   └── TrainingSubsession.tsx       # Renders one training subsession
├── hooks/
│   └── useMatchAndTrainingCount.ts  # Derives count + label for a session
└── helper/
    ├── hasTraining.ts               # Predicate: does session contain training?
    └── hasMatches.ts                # Predicate: does session contain matches?
```

Global tools live outside the feature folder and are reused across features:

```
src/
└── tools/
    ├── getMatchSubsessions.ts       # Extracts match subsessions from a session
    └── getTrainingSubsessions.ts    # Extracts training subsessions from a session
```

---

## Layer Responsibilities

Each layer has a distinct, non-overlapping job:

| Layer | Location | Job | Example |
|---|---|---|---|
| **Tools** | `src/tools/` | Pure functions that extract or transform typed data | `getMatchSubsessions(session)` |
| **Helpers** | `FeatureName/helper/` | Semantic predicates/queries that use tools, scoped to the feature | `hasMatches(session)` |
| **Hooks** | `FeatureName/hooks/` | React hooks that derive state or values consumed by components | `useMatchAndTrainingCount(session)` |
| **Features** | `FeatureName/features/` | Presentational components specific to this feature | `MatchSubsession`, `SessionCard` |
| **Index** | `FeatureName/index.tsx` | Page/feature entry: owns routing, layout, top-level state | `SessionPage` |

**Dependency direction:** `index → features → hooks → helpers → tools`

Never import upward. A tool must not import a hook. A helper must not import a component.

---

## Extraction Examples

### ✅ Correct — one goal per file

```ts
// helper/hasMatches.ts — one job: is there at least one match subsession?
export function hasMatches(session: Session): boolean {
  return getMatchSubsessions(session).length > 0;
}
```

```ts
// tools/getMatchSubsessions.ts — one job: filter and type match subsessions
export function getMatchSubsessions(session: Session): MatchSubsession[] {
  return session.subsessions.filter(isMatchSubsession);
}
```

```ts
// hooks/useMatchAndTrainingCount.ts — one job: derive counts and type label
export const useMatchAndTrainingCount = (session: Session) => {
  const trainingCount = getTrainingSubsessions(session).length;
  const matchCount = getMatchSubsessions(session).length;
  const mixed = trainingCount > 0 && matchCount > 0;
  const typeLabel = mixed ? "Training + Match" : trainingCount > 0 ? "Training" : "Match";
  return { trainingCount, matchCount, mixed, typeLabel };
};
```

### ❌ Wrong — multiple goals in one file

```ts
// BAD: this hook fetches data AND derives display labels AND formats dates
export const useSessionCard = (session: Session) => {
  const data = useSessions();          // fetching — belongs in useSessions
  const typeLabel = ...;               // derivation — belongs in useMatchAndTrainingCount
  const formatted = formatDate(...);   // formatting — belongs in a helper or data layer
  return { data, typeLabel, formatted };
};
```

Split each responsibility into its own file.

---

## Decision Guide

When adding code, route it to the correct layer:

- **Pure data extraction or transformation, no React** → `src/tools/`
- **Semantic predicate using a tool, scoped to one feature** → `FeatureName/helper/`
- **React hook that derives state or values for a feature** → `FeatureName/hooks/`
- **React component only used within this feature** → `FeatureName/features/`
- **React component reused by two or more features** → promote to a `components/` folder at the nearest common ancestor level (see below)
- **Page layout, routing, top-level filter state** → `FeatureName/index.tsx`

---

## Feature Until Proven Component

Components default to their feature folder. **Do not move a component up until it is actually reused by a second feature.**

When reuse is confirmed, promote to the nearest common ancestor's `components/` folder — not necessarily global `src/components/`. If two sibling features under `pages/Sessions/` both need it, a `pages/Sessions/components/` folder is the right home, not the global one.

```
pages/
└── Sessions/
    ├── components/        # shared between Sessions sub-features only
    │   └── SubsessionBadge.tsx
    ├── SessionPage/
    │   ├── features/
    │   └── index.tsx
    └── SessionDetailPage/
        ├── features/
        └── index.tsx
```

Only promote to `src/components/` when the component is genuinely used across unrelated top-level features. Over-globalizing is actively harmful: it creates pressure to add props for every edge case, leading to divergent one-off variants anyway.

**The test:** if you find yourself passing feature-specific props to a "shared" component just to handle one caller's edge case — it should not have been promoted, or needs to be forked back.

---

## When to Extract

Extract immediately when any of these are true:

- A function does more than one thing (and cannot be described without "and")
- A component renders more than one conceptually distinct UI region
- A hook fetches data **and** derives display values
- The same logic is copy-pasted into two files (consolidate into a tool or helper)
- A file imports from a higher layer (dependency inversion violation)

---

## Naming Conventions

| Pattern | Use |
|---|---|
| `get{Thing}(s)` | Tool that extracts a typed subset from a data structure |
| `has{Thing}` | Helper predicate returning `boolean` |
| `use{Thing}` | React hook |
| `{Thing}.tsx` (PascalCase) | React component (one component per file) |
| `index.tsx` | Page/feature entry point |
