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
      } catch {
        // Silently fail if localStorage is unavailable or parse fails
      }
      return null;
    });

  useEffect(() => {
    try {
      if (activeSession) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeSession));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Silently fail if localStorage quota is exceeded or storage is unavailable
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
