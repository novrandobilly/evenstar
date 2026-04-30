# Form UX Improvements — Design Spec
**Date:** 2026-04-30  
**Status:** Approved

## Overview

Three targeted improvements to the active session input forms: grouped focus chips in the training form, per-player anonymous toggles in the match form, and a more visible date + new duration input in the session header.

---

## 1. Training Form — Grouped Focus Chips

### Problem
The flat grid of 14 chips has no visual hierarchy. Users must scan the entire list to find what they want.

### Design
Group chips under **gold category labels** using the following taxonomy:

| Group label | Chips |
|---|---|
| Groundstrokes | Forehand, Backhand |
| Serve | First Serve, Second Serve, Kick Serve |
| Net Game | Volley, Overhead, Net Play, Approach |
| Movement | Return, Footwork, Baseline |
| General | Warmup, Other |

Each group label is rendered as a small uppercase text in `text-gold` above its row of chips. No border/divider between groups — the label alone provides the visual separation. The selected chip state (filled club-green) and "Other" free-text reveal behaviour are unchanged.

### Data impact
None — the resolved title string passed to `TrainingSubsession.title` is unchanged.

---

## 2. Match Form — Per-Player Anonymous Toggle

### Problem
The previous implementation had a single anonymous toggle per *team* (all opponents share one toggle). Users need to anonymise individual players independently, and when anonymous the field should visually confirm the state rather than simply disappearing.

### Design
Every player field gets its own **"Anonymous" pill button** in the label row:

```
Opponent 1          [Anonymous]
┌──────────────────────────────┐
│ Opponent 1 name              │
└──────────────────────────────┘
```

When toggled active:
```
Opponent 1          [✓ Anonymous]   ← gold tint
┌ - - - - - - - - - - - - - - ┐
│ Anonymous                    │   ← italic, muted, dashed border, disabled
└ - - - - - - - - - - - - - - ┘
```

**Player fields by event type:**

| Event | Fields with toggle |
|---|---|
| Singles | Opponent |
| Doubles | Your Partner, Opponent 1, Opponent 2 |

Each toggle is independent. The form's `canAdd` validation counts an anonymous player as filled (no name required). On submit, anonymous players are stored as the string `"Anonymous"`.

### State changes
Replace the two shared booleans (`opponentAnonymous`, `partnerAnonymous`) with a per-player map:
```ts
type PlayerKey = "opponent1" | "opponent2" | "partner";
const [anonymous, setAnonymous] = useState<Record<PlayerKey, boolean>>({
  opponent1: false, opponent2: false, partner: false,
});
```

`handleEventChange` resets the full map to all-false on event type switch.

---

## 3. Session Header — Date Pill + Duration Pill

### Problem
The date input is 10px text with no visible boundary — easy to miss. There is no duration input; duration is calculated automatically at finish and cannot be overridden.

### Design
Below the session title, replace the bare date text with two **pill-shaped inputs** separated by a `·` divider and followed by the "in progress" badge:

```
📅  Apr 30, 2026   ·   ⏱  1h 30m   ·   in progress
```

**Date pill:** wraps the existing `<input type="date">`. Styled with a white background, `border-1.5 border-ivory-rule rounded-full px-3 py-1.5`. Border highlights gold on hover/focus. Emoji icon prefix.

**Duration pill:** `<input type="text">` with placeholder `"e.g. 1h 30m"`. Same pill styling. Value is stored as a free-text string on the active session state (`activeSession.duration`). At finish, if the user has entered a value it is used directly; otherwise `formatDuration(startedAt)` is used as the fallback.

### State changes
`ActiveSessionDraft` already inherits `duration: string` from `Session` and `startSession` initialises it to `""`. The only change needed is to add `duration` to the allowed fields in `updateSession`'s `Partial<Pick<...>>` so the pill input can write to it. `handleFinish` reads `activeSession.duration || formatDuration(activeSession.startedAt)`.

---

## Files Affected

| File | Change |
|---|---|
| `src/components/TrainingForm.tsx` | Add group labels to TRAINING_PRESETS rendering |
| `src/components/MatchForm.tsx` | Replace shared anonymous booleans with per-player map; update UI and submit logic |
| `src/pages/ActiveSessionPage.tsx` | Add duration pill; improve date pill styling |
| `src/hooks/useActiveSession.ts` | Add `duration` field to `ActiveSession` type and state |
