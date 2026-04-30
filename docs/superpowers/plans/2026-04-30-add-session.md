# Add Session Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users log a tennis session incrementally on a dedicated Active Session page — add training blocks and match results one at a time, then finish and save to the sessions list.

**Architecture:** A new `/sessions/new` route renders `ActiveSessionPage`. The in-progress session is kept in `localStorage` (key `evenstar_active_session`) via a `useActiveSession` hook, so it survives page refreshes. The completed sessions list is also moved from static mock data to `localStorage` (key `evenstar_sessions`, seeded from mock data on first load) via a `useSessions` hook. Inline `TrainingForm` and `MatchForm` components render on the same page — no modal needed.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, React Router v7, localStorage. No test framework — verify each task with `cd frontend && yarn build` (TypeScript + Vite). Lint with `cd frontend && yarn lint`.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `frontend/src/hooks/useSessions.ts` | localStorage-backed sessions list; seeds from mock data |
| Create | `frontend/src/hooks/useActiveSession.ts` | In-progress session CRUD; persists draft to localStorage |
| Create | `frontend/src/components/TrainingForm.tsx` | Inline form: optional title + dynamic metrics |
| Create | `frontend/src/components/MatchForm.tsx` | Inline form: type toggle, name fields, sets, auto-result |
| Create | `frontend/src/pages/ActiveSessionPage.tsx` | The new page; wires hooks + forms + subsession list |
| Modify | `frontend/src/pages/SessionPage.tsx` | Use `useSessions()`; `+ Add` button navigates to `/sessions/new` |
| Modify | `frontend/src/pages/SessionDetailPage.tsx` | Use `useSessions()` instead of static import |
| Modify | `frontend/src/App.tsx` | Add `/sessions/new` route |

---

## Task 1: `useSessions` hook

**Files:**
- Create: `frontend/src/hooks/useSessions.ts`

- [ ] **Step 1: Create the hook**

```ts
// frontend/src/hooks/useSessions.ts
import { useState, useEffect } from "react";
import { sessions as mockSessions, type Session } from "@/data/sessions";

const STORAGE_KEY = "evenstar_sessions";

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Session[];
    } catch {}
    return mockSessions;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (session: Session) => {
    setSessions((prev) => [session, ...prev]);
  };

  return { sessions, addSession };
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd frontend && yarn build 2>&1 | tail -5
```
Expected: `✓ built in` with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/jacktfz/Work/evenstar && git add frontend/src/hooks/useSessions.ts && git commit -m "feat: add useSessions hook with localStorage persistence

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 2: `useActiveSession` hook

**Files:**
- Create: `frontend/src/hooks/useActiveSession.ts`

- [ ] **Step 1: Create the hook**

```ts
// frontend/src/hooks/useActiveSession.ts
import { useState, useEffect } from "react";
import type { Session, Subsession } from "@/data/sessions";

const STORAGE_KEY = "evenstar_active_session";

export interface ActiveSessionDraft extends Session {
  startedAt: number;
}

export function useActiveSession() {
  const [activeSession, setActiveSession] =
    useState<ActiveSessionDraft | null>(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored) as ActiveSessionDraft;
      } catch {}
      return null;
    });

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeSession));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activeSession]);

  const startSession = () => {
    const id = Date.now().toString();
    const draft: ActiveSessionDraft = {
      id,
      title: "New Session",
      date: new Date().toISOString().split("T")[0],
      duration: "",
      subsessions: [],
      startedAt: Date.now(),
    };
    setActiveSession(draft);
    return draft;
  };

  const updateSession = (
    fields: Partial<Pick<ActiveSessionDraft, "title" | "date">>
  ) => {
    setActiveSession((prev) => (prev ? { ...prev, ...fields } : prev));
  };

  const addSubsession = (subsession: Subsession) => {
    setActiveSession((prev) =>
      prev
        ? { ...prev, subsessions: [...prev.subsessions, subsession] }
        : prev
    );
  };

  const removeSubsession = (id: string) => {
    setActiveSession((prev) =>
      prev
        ? {
            ...prev,
            subsessions: prev.subsessions.filter((s) => s.id !== id),
          }
        : prev
    );
  };

  const clearSession = () => {
    setActiveSession(null);
  };

  return {
    activeSession,
    startSession,
    updateSession,
    addSubsession,
    removeSubsession,
    clearSession,
  };
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd frontend && yarn build 2>&1 | tail -5
```
Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/jacktfz/Work/evenstar && git add frontend/src/hooks/useActiveSession.ts && git commit -m "feat: add useActiveSession hook with localStorage draft persistence

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 3: Update `SessionPage` to use `useSessions`

**Files:**
- Modify: `frontend/src/pages/SessionPage.tsx`

- [ ] **Step 1: Replace static import with `useSessions` hook and wire `+ Add` button**

Replace the top of `SessionPage.tsx`. The diff touches two things: (a) swap `sessions` static array for the hook, (b) make the `+ Add` button navigate.

Full updated file:

```tsx
// frontend/src/pages/SessionPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import { cn } from "@/lib/utils";
import {
  filters,
  formatDate,
  formatSets,
  getMatchSubsessions,
  getTrainingSubsessions,
  hasMatches,
  hasTraining,
  isMatchSubsession,
  summarizeRecord,
  type Filter,
  type Session,
} from "@/data/sessions";
import { useSessions } from "@/hooks/useSessions";

function SessionCard({ session }: { session: Session }) {
  const navigate = useNavigate();
  const trainingCount = getTrainingSubsessions(session).length;
  const matchCount = getMatchSubsessions(session).length;
  const mixed = trainingCount > 0 && matchCount > 0;
  const typeLabel = mixed
    ? "Training + Match"
    : trainingCount > 0
      ? "Training"
      : "Match";

  return (
    <button
      type="button"
      onClick={() => navigate(`/sessions/${session.id}`)}
      className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-ivory-rule/90 bg-linear-to-b from-ivory to-ivory-dark/40 px-4 py-3 mt-3 first:mt-0 text-left shadow-[0_1px_0_rgba(29,61,42,0.08)] transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(29,61,42,0.08)]"
    >
      {/* Header Row: Type label, Duration/Date/Chevron */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <EvenStarText
          as="span"
          variant="label"
          tone="accent"
          caps
          className="font-semibold rounded-sm border border-gold/35 bg-gold-faint/60 px-2 py-0.5 shrink-0"
        >
          {typeLabel}
        </EvenStarText>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <EvenStarText
              as="p"
              variant="meta"
              tone="muted"
              numeric
              className="text-[11px]"
            >
              {session.duration}
            </EvenStarText>
            <EvenStarText
              as="p"
              variant="label"
              tone="accent"
              caps
              className="text-[10px] text-gold/75 tracking-widest"
            >
              {formatDate(session.date)}
            </EvenStarText>
          </div>
          {/* Chevron indicator */}
          <svg
            className="w-4 h-4 text-club-green/60 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Session Title */}
      <EvenStarText
        as="h3"
        variant="title"
        className="text-[13px] leading-snug font-semibold text-club-green/85 mb-3"
      >
        {session.title}
      </EvenStarText>
      {matchCount > 0 && (
        <div className="mb-3">
          <EvenStarText
            as="span"
            variant="label"
            tone="muted"
            caps
            className="font-semibold rounded-sm border border-ivory-rule bg-ivory/70 px-2 py-0.5 inline-block"
          >
            {summarizeRecord(getMatchSubsessions(session))}
          </EvenStarText>
        </div>
      )}

      {/* Subsessions: Full width */}
      <div className="space-y-2">
        {session.subsessions.map((subsession) => (
          <div
            key={subsession.id}
            className={cn(
              "rounded-lg border border-ivory-rule/80 border-l-4 p-2.5 bg-ivory/75",
              isMatchSubsession(subsession)
                ? "border-l-club-green-mid"
                : "border-l-gold",
            )}
          >
            {isMatchSubsession(subsession) ? (
              <>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <EvenStarText
                    as="p"
                    variant="label"
                    tone="muted"
                    caps
                    className="truncate font-semibold"
                  >
                    {subsession.event ?? "Match"}
                  </EvenStarText>
                  <EvenStarText
                    as="p"
                    variant="label"
                    caps
                    className={cn(
                      "font-semibold rounded-sm px-2 py-0.5 border shrink-0",
                      subsession.result === "win"
                        ? "text-win border-win/25 bg-win/8"
                        : subsession.result === "loss"
                          ? "text-loss border-loss/25 bg-loss/8"
                          : "text-gold border-gold/25 bg-gold/8",
                    )}
                  >
                    {subsession.result}
                  </EvenStarText>
                </div>
                <EvenStarText
                  as="p"
                  variant="meta"
                  tone="muted"
                  className="text-[11px] mb-0.5"
                >
                  You
                  {subsession.event === "Doubles" &&
                  subsession.opponent.yourPartner
                    ? ` / ${subsession.opponent.yourPartner}`
                    : ""}{" "}
                  vs {subsession.opponent.opponentNames.join(" / ")}
                </EvenStarText>
                <EvenStarText
                  as="p"
                  variant="title"
                  tone="primary"
                  numeric
                  className="text-sm font-semibold tracking-wide"
                >
                  {formatSets(subsession.sets)}
                </EvenStarText>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <EvenStarText
                    as="p"
                    variant="label"
                    tone="accent"
                    caps
                    className="font-semibold"
                  >
                    {subsession.title ?? "Training"}
                  </EvenStarText>
                  <EvenStarText
                    as="p"
                    variant="meta"
                    tone="muted"
                    className="text-[11px]"
                  >
                    {subsession.metrics.length} metric(s)
                  </EvenStarText>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {subsession.metrics.map((metric) => (
                    <span
                      key={`${subsession.id}-${metric.label}`}
                      className="inline-flex items-center rounded-md border border-gold/35 bg-ivory px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] uppercase text-club-green"
                    >
                      {metric.label} {metric.percentage}%
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </button>
  );
}

export function SessionPage() {
  const navigate = useNavigate();
  const { sessions } = useSessions();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = sessions.filter((session) => {
    if (filter === "all") return true;
    if (filter === "training") return hasTraining(session);
    return hasMatches(session);
  });

  return (
    <div>
      <div className="flex items-end justify-between mb-6 pb-4 border-b-2 border-club-green">
        <div>
          <EvenStarText as="h1" variant="display">
            Sessions
          </EvenStarText>
          <EvenStarText
            as="p"
            variant="label"
            tone="accent"
            caps
            className="mt-1.5"
          >
            {sessions.length} entries
          </EvenStarText>
        </div>
        <EvenStarButton
          variant="solid"
          size="md"
          onClick={() => navigate("/sessions/new")}
        >
          + Add
        </EvenStarButton>
      </div>

      <div className="flex gap-5 mb-5">
        {filters.map((f) => (
          <EvenStarButton
            key={f.value}
            onClick={() => setFilter(f.value)}
            variant="tab"
            size="sm"
            active={filter === f.value}
            className="px-0"
          >
            {f.label}
          </EvenStarButton>
        ))}
      </div>

      <div>
        {filtered.length > 0 ? (
          filtered.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))
        ) : (
          <EvenStarText
            as="p"
            variant="label"
            tone="accent"
            caps
            className="text-center text-gold/60 py-12"
          >
            No entries found
          </EvenStarText>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd frontend && yarn build 2>&1 | tail -5
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/jacktfz/Work/evenstar && git add frontend/src/pages/SessionPage.tsx && git commit -m "feat: SessionPage uses useSessions hook; + Add navigates to /sessions/new

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 4: Update `SessionDetailPage` to use `useSessions`

**Files:**
- Modify: `frontend/src/pages/SessionDetailPage.tsx`

- [ ] **Step 1: Replace `getSessionById` with `useSessions` hook lookup**

Replace the imports and the session lookup. Only the top ~25 lines change; the JSX is untouched.

```tsx
// frontend/src/pages/SessionDetailPage.tsx  — full file
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import { cn } from "@/lib/utils";
import {
  formatDate,
  formatSets,
  getMatchSubsessions,
  getTrainingSubsessions,
  isMatchSubsession,
} from "@/data/sessions";
import { useSessions } from "@/hooks/useSessions";

export function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions } = useSessions();

  const session = useMemo(() => {
    if (!sessionId) return undefined;
    return sessions.find((s) => s.id === sessionId);
  }, [sessionId, sessions]);

  if (!session) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-club-green">
          <EvenStarText as="h1" variant="display">
            Session Not Found
          </EvenStarText>
          <EvenStarButton
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
          >
            Back
          </EvenStarButton>
        </div>
        <EvenStarText as="p" variant="body" tone="muted">
          The requested session does not exist.
        </EvenStarText>
      </div>
    );
  }

  const trainingCount = getTrainingSubsessions(session).length;
  const matchCount = getMatchSubsessions(session).length;

  return (
    <div>
      <div className="flex items-end justify-between mb-6 pb-4 border-b-2 border-club-green">
        <div>
          <EvenStarText as="h1" variant="display">
            {session.title}
          </EvenStarText>
          <EvenStarText
            as="p"
            variant="label"
            tone="accent"
            caps
            className="mt-1.5"
          >
            {formatDate(session.date)} · {session.duration}
          </EvenStarText>
        </div>
        <EvenStarButton
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
        >
          Back
        </EvenStarButton>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <EvenStarText
          as="span"
          variant="label"
          tone="accent"
          caps
          className="font-medium"
        >
          Session Breakdown
        </EvenStarText>
        <EvenStarText as="span" variant="label" className="text-ivory-rule">
          ·
        </EvenStarText>
        <EvenStarText as="span" variant="label" tone="muted" caps>
          {trainingCount} training · {matchCount} match
        </EvenStarText>
      </div>

      <div className="space-y-2.5">
        {session.subsessions.map((subsession) => (
          <div
            key={subsession.id}
            className={cn(
              "rounded-lg border border-ivory-rule/80 border-l-4 p-3 bg-ivory/75",
              isMatchSubsession(subsession)
                ? "border-l-club-green-mid"
                : "border-l-gold",
            )}
          >
            {isMatchSubsession(subsession) ? (
              <>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <EvenStarText
                    as="p"
                    variant="label"
                    tone="muted"
                    caps
                    className="truncate font-semibold"
                  >
                    {subsession.event ?? "Match"}
                  </EvenStarText>
                  <EvenStarText
                    as="p"
                    variant="label"
                    caps
                    className={cn(
                      "font-semibold rounded-sm px-2 py-0.5 border",
                      subsession.result === "win"
                        ? "text-win border-win/25 bg-win/8"
                        : subsession.result === "loss"
                          ? "text-loss border-loss/25 bg-loss/8"
                          : "text-gold border-gold/25 bg-gold/8",
                    )}
                  >
                    {subsession.result}
                  </EvenStarText>
                </div>
                <EvenStarText
                  as="p"
                  variant="meta"
                  tone="muted"
                  className="text-[11px] mb-0.5"
                >
                  You
                  {subsession.event === "Doubles" &&
                  subsession.opponent.yourPartner
                    ? ` / ${subsession.opponent.yourPartner}`
                    : ""}{" "}
                  vs {subsession.opponent.opponentNames.join(" / ")}
                </EvenStarText>
                <EvenStarText
                  as="p"
                  variant="title"
                  tone="primary"
                  numeric
                  className="text-sm font-semibold tracking-wide"
                >
                  {formatSets(subsession.sets)}
                </EvenStarText>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <EvenStarText
                    as="p"
                    variant="label"
                    tone="accent"
                    caps
                    className="font-semibold"
                  >
                    {subsession.title ?? "Training"}
                  </EvenStarText>
                  <EvenStarText
                    as="p"
                    variant="meta"
                    tone="muted"
                    className="text-[11px]"
                  >
                    {subsession.metrics.length} metric(s)
                  </EvenStarText>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {subsession.metrics.map((metric) => (
                    <span
                      key={`${subsession.id}-${metric.label}`}
                      className="inline-flex items-center rounded-md border border-gold/35 bg-ivory px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] uppercase text-club-green"
                    >
                      {metric.label} {metric.percentage}%
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd frontend && yarn build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
cd /Users/jacktfz/Work/evenstar && git add frontend/src/pages/SessionDetailPage.tsx && git commit -m "feat: SessionDetailPage uses useSessions hook

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 5: `TrainingForm` component

**Files:**
- Create: `frontend/src/components/TrainingForm.tsx`

- [ ] **Step 1: Create the component**

```tsx
// frontend/src/components/TrainingForm.tsx
import { useState } from "react";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import type { TrainingSubsession } from "@/data/sessions";

interface MetricRow {
  label: string;
  percentage: string;
}

export interface TrainingFormProps {
  sessionId: string;
  onAdd: (subsession: TrainingSubsession) => void;
  onCancel: () => void;
}

export function TrainingForm({ sessionId, onAdd, onCancel }: TrainingFormProps) {
  const [title, setTitle] = useState("");
  const [metrics, setMetrics] = useState<MetricRow[]>([
    { label: "", percentage: "" },
  ]);

  const updateMetric = (index: number, field: keyof MetricRow, value: string) => {
    setMetrics((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const addMetricRow = () =>
    setMetrics((prev) => [...prev, { label: "", percentage: "" }]);

  const removeMetricRow = (index: number) =>
    setMetrics((prev) => prev.filter((_, i) => i !== index));

  const validMetrics = metrics.filter(
    (m) => m.label.trim() !== "" && m.percentage !== "" && !isNaN(Number(m.percentage))
  );
  const canAdd = validMetrics.length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    const subsession: TrainingSubsession = {
      id: `${sessionId}-s${Date.now()}`,
      type: "training",
      ...(title.trim() ? { title: title.trim() } : {}),
      metrics: validMetrics.map((m) => ({
        label: m.label.trim(),
        percentage: Math.min(100, Math.max(0, Math.round(Number(m.percentage)))),
      })),
    };
    onAdd(subsession);
  };

  const inputClass =
    "w-full rounded-md border border-ivory-rule bg-white px-3 py-2 text-sm text-club-green placeholder:text-club-green-muted/50 outline-none focus:border-gold transition-colors";

  return (
    <div className="rounded-xl border border-club-green/20 bg-ivory p-4 mb-4">
      <EvenStarText as="p" variant="label" tone="accent" caps className="font-semibold mb-3">
        New Training Block
      </EvenStarText>

      {/* Title */}
      <div className="mb-3">
        <EvenStarText as="label" variant="meta" tone="muted" caps className="block mb-1.5">
          Title (optional)
        </EvenStarText>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Warmup, Baseline, Serve"
          className={inputClass}
        />
      </div>

      {/* Metrics */}
      <div className="mb-3">
        <EvenStarText as="p" variant="meta" tone="muted" caps className="mb-2">
          Metrics
        </EvenStarText>
        <div className="space-y-2">
          {metrics.map((metric, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={metric.label}
                onChange={(e) => updateMetric(i, "label", e.target.value)}
                placeholder="Label"
                className="flex-1 rounded-md border border-ivory-rule bg-white px-3 py-2 text-sm text-club-green placeholder:text-club-green-muted/50 outline-none focus:border-gold transition-colors"
              />
              <input
                type="number"
                value={metric.percentage}
                onChange={(e) => updateMetric(i, "percentage", e.target.value)}
                placeholder="%"
                min={0}
                max={100}
                className="w-16 rounded-md border border-ivory-rule bg-white px-2 py-2 text-sm text-club-green text-center placeholder:text-club-green-muted/50 outline-none focus:border-gold transition-colors"
              />
              <button
                type="button"
                onClick={() => removeMetricRow(i)}
                disabled={metrics.length === 1}
                aria-label="Remove metric"
                className="text-club-green-muted/50 hover:text-loss transition-colors disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addMetricRow}
          className="mt-2 w-full rounded-md border border-dashed border-ivory-rule py-1.5 text-[10px] uppercase tracking-[0.18em] text-gold hover:border-gold transition-colors"
        >
          + Add Metric
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <EvenStarButton
          variant="solid"
          size="md"
          disabled={!canAdd}
          onClick={handleAdd}
          className="flex-1"
        >
          Add
        </EvenStarButton>
        <EvenStarButton
          variant="outline"
          size="md"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </EvenStarButton>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd frontend && yarn build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
cd /Users/jacktfz/Work/evenstar && git add frontend/src/components/TrainingForm.tsx && git commit -m "feat: add TrainingForm inline component

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 6: `MatchForm` component

**Files:**
- Create: `frontend/src/components/MatchForm.tsx`

- [ ] **Step 1: Create the component**

```tsx
// frontend/src/components/MatchForm.tsx
import { useState, useMemo } from "react";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import { cn } from "@/lib/utils";
import type { MatchSubsession, MatchResult } from "@/data/sessions";

interface SetRow {
  ours: string;
  theirs: string;
}

function computeResult(sets: SetRow[]): MatchResult | null {
  const complete = sets.filter((s) => s.ours !== "" && s.theirs !== "");
  if (complete.length === 0) return null;
  const won = complete.filter((s) => Number(s.ours) > Number(s.theirs)).length;
  const lost = complete.filter((s) => Number(s.ours) < Number(s.theirs)).length;
  if (won > lost) return "win";
  if (lost > won) return "loss";
  return "draw";
}

export interface MatchFormProps {
  sessionId: string;
  onAdd: (subsession: MatchSubsession) => void;
  onCancel: () => void;
}

export function MatchForm({ sessionId, onAdd, onCancel }: MatchFormProps) {
  const [event, setEvent] = useState<"Singles" | "Doubles">("Singles");
  const [opponent1, setOpponent1] = useState("");
  const [opponent2, setOpponent2] = useState("");
  const [partner, setPartner] = useState("");
  const [sets, setSets] = useState<SetRow[]>([{ ours: "", theirs: "" }]);

  const result = useMemo(() => computeResult(sets), [sets]);

  const updateSet = (index: number, field: keyof SetRow, value: string) => {
    setSets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const addSetRow = () => setSets((prev) => [...prev, { ours: "", theirs: "" }]);

  const removeSetRow = (index: number) =>
    setSets((prev) => prev.filter((_, i) => i !== index));

  const handleEventChange = (newEvent: "Singles" | "Doubles") => {
    setEvent(newEvent);
    setOpponent1("");
    setOpponent2("");
    setPartner("");
  };

  const hasOpponent =
    event === "Singles"
      ? opponent1.trim() !== ""
      : opponent1.trim() !== "" && opponent2.trim() !== "";
  const hasCompleteSet = sets.some((s) => s.ours !== "" && s.theirs !== "");
  const canAdd = hasOpponent && hasCompleteSet && result !== null;

  const handleAdd = () => {
    if (!canAdd || !result) return;
    const subsession: MatchSubsession = {
      id: `${sessionId}-s${Date.now()}`,
      type: "match",
      event,
      opponent: {
        opponentNames:
          event === "Singles"
            ? [opponent1.trim()]
            : [opponent1.trim(), opponent2.trim()],
        ...(event === "Doubles" && partner.trim()
          ? { yourPartner: partner.trim() }
          : {}),
      },
      result,
      sets: sets
        .filter((s) => s.ours !== "" && s.theirs !== "")
        .map((s) => ({ ours: Number(s.ours), theirs: Number(s.theirs) })),
    };
    onAdd(subsession);
  };

  const inputClass =
    "w-full rounded-md border border-ivory-rule bg-white px-3 py-2 text-sm text-club-green placeholder:text-club-green-muted/50 outline-none focus:border-gold transition-colors";

  return (
    <div className="rounded-xl border border-club-green/20 bg-ivory p-4 mb-4">
      <EvenStarText as="p" variant="label" tone="accent" caps className="font-semibold mb-3">
        New Match
      </EvenStarText>

      {/* Singles / Doubles toggle */}
      <div className="mb-3">
        <EvenStarText as="p" variant="meta" tone="muted" caps className="mb-1.5">
          Match Type
        </EvenStarText>
        <div className="flex gap-2">
          {(["Singles", "Doubles"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleEventChange(type)}
              className={cn(
                "flex-1 rounded-md border py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                event === type
                  ? "border-club-green bg-club-green text-ivory"
                  : "border-ivory-rule text-club-green-muted hover:border-gold hover:text-gold"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Name fields */}
      <div className="mb-3">
        {event === "Singles" ? (
          <>
            <EvenStarText as="label" variant="meta" tone="muted" caps className="block mb-1.5">
              Opponent
            </EvenStarText>
            <input
              type="text"
              value={opponent1}
              onChange={(e) => setOpponent1(e.target.value)}
              placeholder="Opponent name"
              className={inputClass}
            />
          </>
        ) : (
          <>
            <EvenStarText as="label" variant="meta" tone="muted" caps className="block mb-1.5">
              Your Partner
            </EvenStarText>
            <input
              type="text"
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              placeholder="Partner name (optional)"
              className={cn(inputClass, "mb-2")}
            />
            <EvenStarText as="label" variant="meta" tone="muted" caps className="block mb-1.5">
              Opponents
            </EvenStarText>
            <div className="flex gap-2">
              <input
                type="text"
                value={opponent1}
                onChange={(e) => setOpponent1(e.target.value)}
                placeholder="Opponent 1"
                className="flex-1 rounded-md border border-ivory-rule bg-white px-3 py-2 text-sm text-club-green placeholder:text-club-green-muted/50 outline-none focus:border-gold transition-colors"
              />
              <input
                type="text"
                value={opponent2}
                onChange={(e) => setOpponent2(e.target.value)}
                placeholder="Opponent 2"
                className="flex-1 rounded-md border border-ivory-rule bg-white px-3 py-2 text-sm text-club-green placeholder:text-club-green-muted/50 outline-none focus:border-gold transition-colors"
              />
            </div>
          </>
        )}
      </div>

      {/* Sets */}
      <div className="mb-3">
        <EvenStarText as="p" variant="meta" tone="muted" caps className="mb-2">
          Sets
        </EvenStarText>
        <div className="space-y-2">
          {sets.map((set, i) => (
            <div key={i} className="flex items-center gap-2">
              <EvenStarText as="span" variant="label" tone="accent" caps className="w-7 shrink-0 tabular-nums">
                S{i + 1}
              </EvenStarText>
              <input
                type="number"
                value={set.ours}
                onChange={(e) => updateSet(i, "ours", e.target.value)}
                min={0}
                placeholder="0"
                className="w-14 rounded-md border border-ivory-rule bg-white px-2 py-2 text-sm font-semibold text-center text-club-green outline-none focus:border-gold transition-colors"
              />
              <span className="text-club-green-muted font-semibold">–</span>
              <input
                type="number"
                value={set.theirs}
                onChange={(e) => updateSet(i, "theirs", e.target.value)}
                min={0}
                placeholder="0"
                className="w-14 rounded-md border border-ivory-rule bg-white px-2 py-2 text-sm font-semibold text-center text-club-green outline-none focus:border-gold transition-colors"
              />
              <button
                type="button"
                onClick={() => removeSetRow(i)}
                disabled={sets.length === 1}
                aria-label="Remove set"
                className="ml-auto text-club-green-muted/50 hover:text-loss transition-colors disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSetRow}
          className="mt-2 w-full rounded-md border border-dashed border-ivory-rule py-1.5 text-[10px] uppercase tracking-[0.18em] text-gold hover:border-gold transition-colors"
        >
          + Add Set
        </button>
      </div>

      {/* Auto result */}
      <div
        className={cn(
          "rounded-md border px-3 py-2 mb-3 flex items-center justify-between",
          result === "win"
            ? "border-win/30 bg-win/8"
            : result === "loss"
              ? "border-loss/30 bg-loss/8"
              : result === "draw"
                ? "border-gold/30 bg-gold/8"
                : "border-ivory-rule bg-ivory"
        )}
      >
        <EvenStarText as="span" variant="meta" tone="muted" caps>
          Result (auto)
        </EvenStarText>
        {result ? (
          <EvenStarText
            as="span"
            variant="label"
            caps
            className={cn(
              "font-semibold",
              result === "win"
                ? "text-win"
                : result === "loss"
                  ? "text-loss"
                  : "text-gold"
            )}
          >
            {result}
          </EvenStarText>
        ) : (
          <EvenStarText as="span" variant="meta" tone="muted">
            — enter scores above
          </EvenStarText>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <EvenStarButton
          variant="solid"
          size="md"
          disabled={!canAdd}
          onClick={handleAdd}
          className="flex-1"
        >
          Add
        </EvenStarButton>
        <EvenStarButton
          variant="outline"
          size="md"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </EvenStarButton>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd frontend && yarn build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
cd /Users/jacktfz/Work/evenstar && git add frontend/src/components/MatchForm.tsx && git commit -m "feat: add MatchForm inline component with auto win/loss/draw result

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 7: `ActiveSessionPage`

**Files:**
- Create: `frontend/src/pages/ActiveSessionPage.tsx`

- [ ] **Step 1: Create the page**

```tsx
// frontend/src/pages/ActiveSessionPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import { TrainingForm } from "@/components/TrainingForm";
import { MatchForm } from "@/components/MatchForm";
import { cn } from "@/lib/utils";
import { useActiveSession } from "@/hooks/useActiveSession";
import { useSessions } from "@/hooks/useSessions";
import { isMatchSubsession, formatSets, type Subsession } from "@/data/sessions";
import type { Session } from "@/data/sessions";

function formatDuration(startedAt: number): string {
  const ms = Date.now() - startedAt;
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function SubsessionCard({
  subsession,
  onRemove,
}: {
  subsession: Subsession;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-ivory-rule/80 border-l-4 p-3 bg-ivory/75 flex gap-2",
        isMatchSubsession(subsession)
          ? "border-l-club-green-mid"
          : "border-l-gold"
      )}
    >
      <div className="flex-1 min-w-0">
        {isMatchSubsession(subsession) ? (
          <>
            <div className="flex items-center justify-between gap-3 mb-1">
              <EvenStarText
                as="p"
                variant="label"
                tone="muted"
                caps
                className="truncate font-semibold"
              >
                {subsession.event ?? "Match"}
              </EvenStarText>
              <EvenStarText
                as="p"
                variant="label"
                caps
                className={cn(
                  "font-semibold rounded-sm px-2 py-0.5 border shrink-0",
                  subsession.result === "win"
                    ? "text-win border-win/25 bg-win/8"
                    : subsession.result === "loss"
                      ? "text-loss border-loss/25 bg-loss/8"
                      : "text-gold border-gold/25 bg-gold/8"
                )}
              >
                {subsession.result}
              </EvenStarText>
            </div>
            <EvenStarText
              as="p"
              variant="meta"
              tone="muted"
              className="text-[11px] mb-0.5"
            >
              You
              {subsession.event === "Doubles" &&
              subsession.opponent.yourPartner
                ? ` / ${subsession.opponent.yourPartner}`
                : ""}{" "}
              vs {subsession.opponent.opponentNames.join(" / ")}
            </EvenStarText>
            <EvenStarText
              as="p"
              variant="title"
              tone="primary"
              numeric
              className="text-sm font-semibold tracking-wide"
            >
              {formatSets(subsession.sets)}
            </EvenStarText>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <EvenStarText
                as="p"
                variant="label"
                tone="accent"
                caps
                className="font-semibold"
              >
                {subsession.title ?? "Training"}
              </EvenStarText>
              <EvenStarText
                as="p"
                variant="meta"
                tone="muted"
                className="text-[11px]"
              >
                {subsession.metrics.length} metric(s)
              </EvenStarText>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {subsession.metrics.map((metric) => (
                <span
                  key={`${subsession.id}-${metric.label}`}
                  className="inline-flex items-center rounded-md border border-gold/35 bg-ivory px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] uppercase text-club-green"
                >
                  {metric.label} {metric.percentage}%
                </span>
              ))}
            </div>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove subsession"
        className="shrink-0 self-start text-club-green-muted/40 hover:text-loss transition-colors mt-0.5 text-sm"
      >
        ✕
      </button>
    </div>
  );
}

type ActiveForm = "training" | "match" | null;

export function ActiveSessionPage() {
  const navigate = useNavigate();
  const {
    activeSession,
    startSession,
    updateSession,
    addSubsession,
    removeSubsession,
    clearSession,
  } = useActiveSession();
  const { addSession } = useSessions();
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);

  // Start a new session on mount only if none is in progress
  useEffect(() => {
    if (!activeSession) {
      startSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render nothing while the session initialises (one tick at most)
  if (!activeSession) return null;

  const toggleForm = (type: "training" | "match") => {
    setActiveForm((prev) => (prev === type ? null : type));
  };

  const handleFinish = () => {
    const session: Session = {
      id: activeSession.id,
      title: activeSession.title,
      date: activeSession.date,
      duration: formatDuration(activeSession.startedAt),
      subsessions: activeSession.subsessions,
    };
    addSession(session);
    clearSession();
    navigate("/");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-6 pb-4 border-b-2 border-club-green">
        <div className="flex-1 min-w-0 mr-4">
          <input
            type="text"
            value={activeSession.title}
            onChange={(e) => updateSession({ title: e.target.value })}
            placeholder="Session title"
            className="font-sans text-3xl font-semibold leading-none tracking-tight text-club-green bg-transparent border-none outline-none w-full placeholder:text-club-green/30"
          />
          <div className="flex items-center gap-2 mt-1.5">
            <input
              type="date"
              value={activeSession.date}
              onChange={(e) => updateSession({ date: e.target.value })}
              className="text-[10px] tracking-[0.15em] uppercase text-gold bg-transparent border-none outline-none cursor-pointer"
            />
            <EvenStarText as="span" variant="label" tone="accent" caps className="text-gold/60">
              · in progress
            </EvenStarText>
          </div>
        </div>
        <EvenStarButton variant="outline" size="sm" onClick={() => navigate("/")}>
          Back
        </EvenStarButton>
      </div>

      {/* Subsession list */}
      {activeSession.subsessions.length > 0 && (
        <div className="space-y-2.5 mb-5">
          {activeSession.subsessions.map((subsession) => (
            <SubsessionCard
              key={subsession.id}
              subsession={subsession}
              onRemove={() => removeSubsession(subsession.id)}
            />
          ))}
        </div>
      )}

      {/* Add buttons */}
      <div className="flex gap-3 mb-4">
        <EvenStarButton
          variant={activeForm === "training" ? "solid" : "outline"}
          size="md"
          onClick={() => toggleForm("training")}
          className="flex-1"
        >
          + Training
        </EvenStarButton>
        <EvenStarButton
          variant={activeForm === "match" ? "solid" : "outline"}
          size="md"
          onClick={() => toggleForm("match")}
          className="flex-1"
        >
          + Match
        </EvenStarButton>
      </div>

      {/* Inline form */}
      {activeForm === "training" && (
        <TrainingForm
          sessionId={activeSession.id}
          onAdd={(subsession) => {
            addSubsession(subsession);
            setActiveForm(null);
          }}
          onCancel={() => setActiveForm(null)}
        />
      )}
      {activeForm === "match" && (
        <MatchForm
          sessionId={activeSession.id}
          onAdd={(subsession) => {
            addSubsession(subsession);
            setActiveForm(null);
          }}
          onCancel={() => setActiveForm(null)}
        />
      )}

      {/* Finish session */}
      <div className="mt-6">
        <EvenStarButton
          variant="solid"
          size="md"
          fullWidth
          disabled={activeSession.subsessions.length === 0}
          onClick={handleFinish}
        >
          ✓ Finish Session
        </EvenStarButton>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd frontend && yarn build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
cd /Users/jacktfz/Work/evenstar && git add frontend/src/pages/ActiveSessionPage.tsx && git commit -m "feat: add ActiveSessionPage with inline training/match forms

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 8: Wire up routing + final verification

**Files:**
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Add `/sessions/new` route**

```tsx
// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SessionPage } from "@/pages/SessionPage";
import { SessionDetailPage } from "@/pages/SessionDetailPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ActiveSessionPage } from "@/pages/ActiveSessionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <SessionPage />
            </Layout>
          }
        />
        <Route
          path="/sessions/new"
          element={
            <Layout>
              <ActiveSessionPage />
            </Layout>
          }
        />
        <Route
          path="/sessions/:sessionId"
          element={
            <Layout>
              <SessionDetailPage />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <ProfilePage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 2: Full build + lint**

```bash
cd frontend && yarn build 2>&1 | tail -10
```
Expected: `✓ built in` with zero errors.

```bash
cd frontend && yarn lint 2>&1 | tail -10
```
Expected: no errors (warnings about `react-hooks/exhaustive-deps` on the mount-only effect in `ActiveSessionPage` are acceptable — it's intentional).

- [ ] **Step 3: Final commit**

```bash
cd /Users/jacktfz/Work/evenstar && git add frontend/src/App.tsx && git commit -m "feat: add /sessions/new route — completes add session feature

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

- [ ] **Step 4: Manual smoke test**

Start the dev server:
```bash
cd frontend && yarn dev
```

Verify:
1. Sessions list loads with mock sessions (5 entries)
2. Tap `+ Add` → navigates to `/sessions/new`
3. Title field is editable; date picker works
4. Tap `+ Training` → form appears; fill label + % → tap `Add` → card appears, form closes
5. Tap `+ Match` → form appears; pick Doubles, fill names, add two set scores → result badge shows WIN/LOSS/DRAW automatically
6. Tap `Finish Session` → navigates to `/`, new session appears at top of list
7. Tap the new session → detail page shows all subsessions correctly
8. Tap `+ Add` again → navigates to `/sessions/new` with a fresh session (previous was cleared)
9. Navigate back mid-session (tap Back) → session preserved; tap `+ Add` again → resumes same draft
