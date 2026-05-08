import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import { filters, summarizeRecord, type Filter } from "@/data/sessions";
import { getMatchSubsessions } from "@/tools/getMatchSubsessions";

import { useSessions } from "@/hooks/useSessions";
import { SessionCard } from "./features/SessionCard";
import { hasTraining } from "./helper/hasTraining";
import { hasMatches } from "./helper/hasMatches";

export const SessionPage = () => {
  const navigate = useNavigate();
  const { sessions } = useSessions();
  const [filter, setFilter] = useState<Filter>("all");

  const allMatches = sessions.flatMap((s) => getMatchSubsessions(s));
  const record = allMatches.length > 0 ? summarizeRecord(allMatches) : null;

  const filtered = sessions.filter((session) => {
    if (filter === "all") return true;
    if (filter === "training") return hasTraining(session);
    return hasMatches(session);
  });

  return (
    <div>
      {/* Gradient hero — bleeds to full width */}
      <div
        className="-mx-4 -mt-6 mb-6 relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Decorative sun glow */}
        <div
          className="absolute top-8 right-6 w-10 h-10 rounded-full pointer-events-none"
          style={{
            background: "var(--gradient-hero-glow-bg)",
            boxShadow: "var(--gradient-hero-glow-shadow)",
          }}
        />
        <div className="px-4 pt-12 pb-8">
          <div className="flex items-end justify-between gap-3">
            <h1
              className="font-display italic text-[2rem] font-bold leading-none tracking-normal"
              style={{ fontFamily: "var(--font-display)", color: "oklch(99.5% 0.005 75)" }}
            >
              Evenstar
            </h1>
            <EvenStarButton
              variant="outline"
              size="sm"
              onClick={() => navigate("/sessions/new")}
              className="mb-0.5 border-white/40 text-white hover:bg-white/15 hover:text-white hover:border-white/60"
            >
              + New
            </EvenStarButton>
          </div>
          <p
            className="text-[11px] mt-2 font-medium"
            style={{ color: "oklch(99.5% 0.005 75)" }}
          >
            {sessions.length}{" "}
            {sessions.length === 1 ? "session" : "sessions"} logged
            {record && <span> · {record}</span>}
          </p>
        </div>
      </div>

      {/* Filter segment control */}
      <div className="flex gap-1 mb-5 p-1 bg-raised rounded-2xl border border-line">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "flex-1 min-h-[44px] py-2 rounded-xl text-[11px] font-bold uppercase tracking-[0.08em] transition-colors",
              filter === f.value
                ? "bg-ace text-surface shadow-sm"
                : "text-ink-2 hover:text-ink",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))
        ) : (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="text-5xl">🎾</span>
            <div>
              <EvenStarText as="p" variant="headline" className="mb-1.5">
                No sessions yet
              </EvenStarText>
              <EvenStarText as="p" variant="body" tone="muted">
                Log your first hit and start building your record.
              </EvenStarText>
            </div>
            <EvenStarButton
              variant="solid"
              size="md"
              onClick={() => navigate("/sessions/new")}
            >
              + Log a Session
            </EvenStarButton>
          </div>
        )}
      </div>
    </div>
  );
};
