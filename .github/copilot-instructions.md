# Copilot Instructions

## Repository Layout

```
evenstar/
├── backend/    # Server-side application (empty — not yet scaffolded)
└── frontend/   # React + Vite + TypeScript + Tailwind CSS v4 + TanStack Query v5
```

This is a monorepo with a separate backend and frontend.

## Frontend

The `.github/instructions/` folder contains two active skills that Copilot uses automatically:

- **`senior-frontend.instructions.md`** — React/Next.js/TypeScript/Tailwind patterns, bundle analysis, component generation, accessibility
- **`frontend-design.instructions.md`** — Design-quality standards: visual direction, typography, color, motion, layout

These skills are applied automatically by Copilot when working on frontend tasks. They define the expected quality bar — not just functional correctness but intentional, production-grade design.

## Conventions to follow once code exists

Fill in these sections as the project is built out:

### Commands

```
cd frontend && yarn dev     # start dev server (Vite)
cd frontend && yarn build   # type-check + production build
cd frontend && yarn lint    # ESLint
```

### Architecture decisions
<!-- Document cross-cutting decisions that require reading multiple files to understand, e.g. auth strategy, data-fetching layer, API shape -->

### Key patterns

- `@/*` path alias maps to `src/*`
- `cn()` utility lives in `src/lib/utils.ts` (clsx + tailwind-merge)
- `QueryClient` is set up in `main.tsx`; wrap per-feature queries in custom hooks under `src/hooks/`
- Tailwind v4: configured via `@tailwindcss/vite` plugin — no `tailwind.config.ts` needed
