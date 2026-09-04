import React from "react";
import { useSession } from "../../context/SessionContext";
import { EmptyStateSession } from "./features/EmptyStateSession";
import { RunningSession } from "./features/RunningSession";

export const InSessionFeature: React.FC = () => {
  const { session } = useSession();

  if (!session.matches || session.matches.length === 0) {
    return <EmptyStateSession />;
  }

  return <RunningSession />;
};

export default InSessionFeature;
