import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import { filters, type Filter } from "@/data/sessions";

import { useSessions } from "@/hooks/useSessions";
import { SessionCard } from "./features/SessionCard";
import { hasTraining } from "./helper/hasTraining";
import { hasMatches } from "./helper/hasMatches";

export const SessionPage = () => {
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
};
