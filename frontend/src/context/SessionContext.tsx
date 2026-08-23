import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  SessionConfig,
  MatchFormat,
  DoublesGameMode,
} from '../types/session';
import {
  MIN_PLAYERS_DOUBLES,
  MIN_PLAYERS_SINGLES,
  DEFAULT_PLAYERS_DOUBLES,
  DEFAULT_PLAYERS_SINGLES,
  MAX_PLAYERS,
} from '../types/session';
import { generateAllMatches } from '../utils/matchmaker';

const ACTIVE_STORAGE_KEY = 'evenstar_tennis_session_config';
const HISTORY_STORAGE_KEY = 'evenstar_session_history';
const MAX_HISTORY = 3;

interface SessionContextType {
  session: SessionConfig;
  sessionHistory: SessionConfig[];
  setSessionTitle: (title: string) => void;
  setMatchFormat: (format: MatchFormat) => void;
  setDoublesMode: (mode: DoublesGameMode) => void;
  setPlayerCount: (count: number) => void;
  addPlayer: () => void;
  removePlayer: (index: number) => void;
  updatePlayerName: (index: number, name: string) => void;
  startSession: () => void;
  updateMatchScore: (matchId: string, scoreA: string, scoreB: string) => void;
  toggleMatchCompleted: (matchId: string) => void;
  reorderMatches: (fromIndex: number, toIndex: number) => void;
  /** Archives the current session into history (auto-evicting the oldest if at limit), then resets. */
  completeSession: () => void;
  /** Discards the current active session without saving to history. */
  resetSession: () => void;
  deleteHistorySession: (sessionId: string) => void;
  hasActiveSession: boolean;
}

const createInitialPlayers = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `p-${i + 1}`,
    name: '',
  }));

const createDefaultSession = (): SessionConfig => ({
  id: `session-${Date.now()}`,
  title: 'Tennis Session',
  matchFormat: 'doubles',
  doublesMode: 'americano',
  players: createInitialPlayers(DEFAULT_PLAYERS_DOUBLES),
  matches: [],
  createdAt: new Date().toISOString(),
});

const loadHistory = (): SessionConfig[] => {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as SessionConfig[];
    return [];
  } catch {
    return [];
  }
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SessionConfig>(() => {
    const saved = localStorage.getItem(ACTIVE_STORAGE_KEY) || sessionStorage.getItem(ACTIVE_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...createDefaultSession(),
          ...parsed,
        };
      } catch {
        return createDefaultSession();
      }
    }
    return createDefaultSession();
  });

  const [sessionHistory, setSessionHistory] = useState<SessionConfig[]>(() => loadHistory());

  // Sync active session to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save session to localStorage:', e);
    }
  }, [session]);

  // Sync history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(sessionHistory));
    } catch (e) {
      console.error('Failed to save session history:', e);
    }
  }, [sessionHistory]);

  const setSessionTitle = (title: string) => {
    setSession((prev) => ({ ...prev, title }));
  };

  const setMatchFormat = (matchFormat: MatchFormat) => {
    setSession((prev) => {
      if (prev.matchFormat === matchFormat) return prev;

      const targetDefault =
        matchFormat === 'doubles' ? DEFAULT_PLAYERS_DOUBLES : DEFAULT_PLAYERS_SINGLES;

      let updatedPlayers = [...prev.players];

      if (updatedPlayers.length < targetDefault) {
        const additional = Array.from(
          { length: targetDefault - updatedPlayers.length },
          (_, i) => ({
            id: `p-${Date.now()}-${i}`,
            name: '',
          })
        );
        updatedPlayers = [...updatedPlayers, ...additional];
      } else if (updatedPlayers.length > targetDefault) {
        updatedPlayers = updatedPlayers.slice(0, targetDefault);
      }

      return {
        ...prev,
        matchFormat,
        players: updatedPlayers,
      };
    });
  };

  const setDoublesMode = (doublesMode: DoublesGameMode) => {
    setSession((prev) => ({ ...prev, doublesMode }));
  };

  const setPlayerCount = (targetCount: number) => {
    setSession((prev) => {
      const minRequired =
        prev.matchFormat === 'doubles' ? MIN_PLAYERS_DOUBLES : MIN_PLAYERS_SINGLES;
      const count = Math.min(MAX_PLAYERS, Math.max(minRequired, targetCount));

      let updatedPlayers = [...prev.players];
      if (count > updatedPlayers.length) {
        const additional = Array.from(
          { length: count - updatedPlayers.length },
          (_, i) => ({
            id: `p-${Date.now()}-${i}`,
            name: '',
          })
        );
        updatedPlayers = [...updatedPlayers, ...additional];
      } else if (count < updatedPlayers.length) {
        updatedPlayers = updatedPlayers.slice(0, count);
      }

      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  };

  const addPlayer = () => {
    setSession((prev) => {
      if (prev.players.length >= MAX_PLAYERS) return prev;
      return {
        ...prev,
        players: [...prev.players, { id: `p-${Date.now()}`, name: '' }],
      };
    });
  };

  const removePlayer = (index: number) => {
    setSession((prev) => {
      const minRequired =
        prev.matchFormat === 'doubles' ? MIN_PLAYERS_DOUBLES : MIN_PLAYERS_SINGLES;
      if (prev.players.length <= minRequired) return prev;
      return {
        ...prev,
        players: prev.players.filter((_, i) => i !== index),
      };
    });
  };

  const updatePlayerName = (index: number, name: string) => {
    setSession((prev) => {
      const updated = [...prev.players];
      if (updated[index]) {
        updated[index] = { ...updated[index], name };
      }
      return { ...prev, players: updated };
    });
  };

  const startSession = () => {
    const matches = generateAllMatches(session.players, session.matchFormat);
    setSession((prev) => ({
      ...prev,
      matches,
    }));
  };

  const updateMatchScore = (matchId: string, scoreA: string, scoreB: string) => {
    setSession((prev) => ({
      ...prev,
      matches: prev.matches.map((m) => {
        if (m.id !== matchId) return m;
        const hasScores = scoreA.trim().length > 0 && scoreB.trim().length > 0;
        return {
          ...m,
          scoreA,
          scoreB,
          isCompleted: hasScores ? true : m.isCompleted,
        };
      }),
    }));
  };

  const toggleMatchCompleted = (matchId: string) => {
    setSession((prev) => ({
      ...prev,
      matches: prev.matches.map((m) =>
        m.id === matchId ? { ...m, isCompleted: !m.isCompleted } : m
      ),
    }));
  };

  const reorderMatches = (fromIndex: number, toIndex: number) => {
    setSession((prev) => {
      const updated = [...prev.matches];
      const [moved] = updated.splice(fromIndex, 1);
      if (!moved) return prev;
      updated.splice(toIndex, 0, moved);
      return { ...prev, matches: updated };
    });
  };

  /**
   * Archives the current session into history (auto-evicting the oldest if
   * already at MAX_HISTORY), then resets the active session.
   */
  const completeSession = () => {
    const completedSession: SessionConfig = {
      ...session,
      completedAt: new Date().toISOString(),
    };

    setSessionHistory((prev) => {
      // Drop the oldest entry when already at capacity
      const trimmed = prev.length >= MAX_HISTORY ? prev.slice(1) : prev;
      return [...trimmed, completedSession];
    });

    try {
      localStorage.removeItem(ACTIVE_STORAGE_KEY);
      sessionStorage.removeItem(ACTIVE_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove active session from storage:', e);
    }
    setSession(createDefaultSession());
  };

  /**
   * Discards the current active session without saving to history.
   */
  const resetSession = () => {
    try {
      localStorage.removeItem(ACTIVE_STORAGE_KEY);
      sessionStorage.removeItem(ACTIVE_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove session from storage:', e);
    }
    setSession(createDefaultSession());
  };

  const deleteHistorySession = (sessionId: string) => {
    setSessionHistory((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const hasActiveSession = Boolean(
    session.matches.length > 0 || session.players.some((p) => p.name.trim().length > 0)
  );

  return (
    <SessionContext.Provider
      value={{
        session,
        sessionHistory,
        setSessionTitle,
        setMatchFormat,
        setDoublesMode,
        setPlayerCount,
        addPlayer,
        removePlayer,
        updatePlayerName,
        startSession,
        updateMatchScore,
        toggleMatchCompleted,
        reorderMatches,
        completeSession,
        resetSession,
        deleteHistorySession,
        hasActiveSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
