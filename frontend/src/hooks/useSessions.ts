import { useState, useEffect } from "react";
import { sessions as mockSessions, type Session } from "@/data/sessions";

const STORAGE_KEY = "evenstar_sessions";

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Session[];
    } catch {
      // Silently fail if localStorage is unavailable or parse fails
    }
    return mockSessions;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Silently fail if localStorage quota is exceeded or storage is unavailable
    }
  }, [sessions]);

  const addSession = (session: Session) => {
    setSessions((prev) => [session, ...prev]);
  };

  return { sessions, addSession };
}
