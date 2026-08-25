import React from "react";
import { useSession } from "../../context/SessionContext";
import { EmptyStateSession } from "./features/EmptyStateSession";
import { RunningSession } from "./features/RunningSession";

export const InSessionFeature: React.FC = () => {
  const { session } = useSession();

  if (!session.matches || session.matches.length === 0) {
    return <EmptyStateSession />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-900 antialiased font-sans">
      <RunningSession />
    </div>
  );
};

export default InSessionFeature;
