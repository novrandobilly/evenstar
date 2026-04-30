# Add Session Feature — Design Spec

**Date:** 2026-04-30  
**Status:** Approved

---

## Problem

The Sessions page shows a static list of past sessions. There is no way for a user to log a new session. The feature should mirror how Hevy handles workout logging: start a session, add entries incrementally over time, then finish and save.

---

## Proposed Approach

A dedicated **Active Session page** at `/sessions/new`. The session lives in `localStorage` while open, so it survives page refreshes. The user adds subsessions (training blocks or matches) one at a time via inline forms on the page — no modal. When done, they tap **Finish Session**, which saves the completed session to the sessions list and navigates back to `/`.

---

## Architecture

### New route
`/sessions/new` → `ActiveSessionPage`

### Data layer
Currently sessions are hardcoded in `src/data/sessions.ts`. This feature requires two localStorage-backed custom hooks:

**`useSessions`** (`src/hooks/useSessions.ts`)
- Reads the sessions list from `localStorage` key `evenstar_sessions`
- Seeds from the existing mock data array on first load (if key is absent)
- Exposes: `sessions`, `addSession(session: Session)`

**`useActiveSession`** (`src/hooks/useActiveSession.ts`)
- Manages the in-progress session under `localStorage` key `evenstar_active_session`
- Exposes:
  - `activeSession` — the current draft session (or `null`)
  - `startSession()` — creates a new blank session with a generated `id`, today's date, empty subsessions
  - `updateSession(fields)` — patch title or date
  - `addSubsession(subsession)` — append to `activeSession.subsessions`
  - `removeSubsession(id)` — remove by subsession `id`
  - `clearSession()` — wipe the active session from localStorage

`SessionPage` and `SessionDetailPage` switch from importing `sessions` directly to calling `useSessions()`.

---

## Pages

### `ActiveSessionPage` (`src/pages/ActiveSessionPage.tsx`)

**Layout (top to bottom):**

1. **Header area** — inline-editable session title (text input styled as a display heading), date field. Duration is automatically computed from session start time to finish time (stored as timestamps in the active session).

2. **Subsession list** — renders each added subsession as a read-only card (same card style as `SessionDetailPage`). Each card has a `✕` remove button.

3. **Add buttons** — `+ Training` and `+ Match` as two side-by-side pill buttons. Tapping one opens the corresponding inline form below; tapping the already-active one collapses it. Only one form is visible at a time — switching type swaps the form and resets its state.

4. **Inline form panel** — conditionally renders `TrainingForm` or `MatchForm` depending on which button is active.

5. **Finish Session button** — disabled when there are no subsessions. On click: calls `addSession(completedSession)`, calls `clearSession()`, navigates to `/`.

**Back navigation:** A back button navigates to `/` without finishing — the active session remains in localStorage (draft preserved).

---

## Components

### `TrainingForm` (`src/components/TrainingForm.tsx`)

Fields:
- **Title** — optional text input (e.g., "Warmup", "Baseline")
- **Metrics** — dynamic list of `{ label: string, percentage: number }` pairs
  - Each row: label text input + percentage number input (0–100) + `✕` remove button
  - `+ Add Metric` button appends a blank row
  - At least one metric required to enable Add
- **Add / Cancel** buttons

On Add: calls `addSubsession()` with a new `TrainingSubsession`, collapses the form, resets state.  
On Cancel: collapses and resets.

### `MatchForm` (`src/components/MatchForm.tsx`)

Fields:
- **Match Type toggle** — Singles / Doubles pill selector (radio-button style). Switching resets the name fields.
- **Name fields (conditional):**
  - Singles: one "Opponent" text input
  - Doubles: "Your Partner" text input + two "Opponents" text inputs side by side
- **Sets** — dynamic list of set rows, each row: `[your score]  –  [their score]` (two number inputs) + `✕` remove. `+ Add Set` appends a blank row. Minimum 1 set.
- **Result (auto)** — read-only live-computed badge. Logic:
  - Count sets where `ours > theirs` → sets won
  - Count sets where `ours < theirs` → sets lost
  - `won > lost` → **WIN**, `lost > won` → **LOSS**, `won === lost` → **DRAW**
  - Only computes when at least one complete set row exists (both scores filled)
  - Badge is grayed/empty until scores are entered
- **Add / Cancel** buttons. Add is disabled until: type chosen, at least one opponent name filled, at least one complete set row.

On Add: calls `addSubsession()` with a new `MatchSubsession`, collapses the form, resets state.  
On Cancel: collapses and resets.

---

## Routing

Add to `App.tsx`:
```tsx
<Route path="/sessions/new" element={<Layout><ActiveSessionPage /></Layout>} />
```

The `+ Add` button on `SessionPage`: if no active session exists in localStorage, calls `startSession()` then navigates to `/sessions/new`; if an active session already exists, navigates directly without calling `startSession()`.

---

## ID generation

Use a simple timestamp-based id: `Date.now().toString()` for sessions, `${sessionId}-s${index}` for subsessions.

---

## Duration

Stored as `startedAt: number` (Unix ms) on the active session. When `finishSession` is called, `duration` is computed as the human-readable diff (e.g., `"1h 24m"`).

---

## Error / edge cases

- If user navigates to `/sessions/new` with no active session in localStorage, `startSession()` is called automatically on mount.
- If user navigates away mid-session (back to `/`), the draft is preserved. Tapping `+ Add` again on `SessionPage` should check for an existing active session and navigate directly to `/sessions/new` without calling `startSession()` again.
- `Finish Session` is disabled with zero subsessions — prevents empty sessions being saved.

---

## Out of scope

- Editing a completed session
- Reusable modal component (deferred — no use case yet)
- Backend persistence
- Session notes / free-text field
