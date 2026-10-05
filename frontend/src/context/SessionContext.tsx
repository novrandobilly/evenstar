import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  SessionConfig,
  MatchFormat,
  DoublesGameMode,
  Player,
  MatchItem,
} from '../types/session';
import {
  MIN_PLAYERS_DOUBLES,
  MIN_PLAYERS_SINGLES,
  DEFAULT_PLAYERS_DOUBLES,
  DEFAULT_PLAYERS_SINGLES,
  MAX_PLAYERS,
} from '../types/session';
import { generateAllMatches } from '../utils/matchmaker';

import { useTCreateSession } from '../api/sessions/useTCreateSession';

const ACTIVE_STORAGE_KEY = 'evenstar_tennis_session_config';

interface SessionContextType {
  session: SessionConfig;
  setSessionTitle: (title: string) => void;
  setMatchFormat: (format: MatchFormat) => void;
  setDoublesMode: (mode: DoublesGameMode) => void;
  setPlayerCount: (count: number) => void;
  setRosterPlayers: (players: Player[]) => void;
  addPlayer: () => void;
  removePlayer: (index: number) => void;
  updatePlayerName: (index: number, name: string) => void;
  startSession: () => void;
  updateMatchScore: (matchId: string, scoreA: string, scoreB: string) => void;
  toggleMatchCompleted: (matchId: string) => void;
  reorderMatches: (fromIndex: number, toIndex: number) => void;
  completeSession: () => Promise<string | undefined>;
  /** Discards the current active session without saving to history. */
  resetSession: () => void;
  addPlayerWithName: (name: string) => void;
  addCustomMatch: (teamA: Player[], teamB: Player[]) => { success: boolean; error?: string };
  editCustomMatch: (matchId: string, teamA: Player[], teamB: Player[]) => { success: boolean; error?: string };
  deleteMatch: (matchId: string) => void;
  hasActiveSession: boolean;
  isSavingSession: boolean;
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


const findDuplicateMatch = (
  matches: MatchItem[],
  teamA: Player[],
  teamB: Player[],
  excludeMatchId?: string
): MatchItem | undefined => {
  const targetA = teamA.map((p: Player) => p.id).sort().join(',');
  const targetB = teamB.map((p: Player) => p.id).sort().join(',');

  return matches.find((m) => {
    if (excludeMatchId && m.id === excludeMatchId) return false;
    const mA = m.teamA.map((p: Player) => p.id).sort().join(',');
    const mB = m.teamB.map((p: Player) => p.id).sort().join(',');
    return (mA === targetA && mB === targetB) || (mA === targetB && mB === targetA);
  });
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createSessionMutation = useTCreateSession();

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

  // Sync active session to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save session to localStorage:', e);
    }
  }, [session]);

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

  const setRosterPlayers = (selectedPlayers: Player[]) => {
    setSession((prev) => {
      const minRequired =
        prev.matchFormat === 'doubles' ? MIN_PLAYERS_DOUBLES : MIN_PLAYERS_SINGLES;
      const targetCount = Math.min(
        MAX_PLAYERS,
        Math.max(minRequired, selectedPlayers.length)
      );

      let updatedPlayers: Player[] = selectedPlayers.slice(0, MAX_PLAYERS).map((p, idx) => ({
        id: `p-${Date.now()}-${idx}`,
        name: p.name,
      }));

      // If selected count is less than minRequired, fill the remainder with blank player slots
      if (updatedPlayers.length < targetCount) {
        const additional = Array.from(
          { length: targetCount - updatedPlayers.length },
          (_, i) => ({
            id: `p-${Date.now()}-blank-${i}`,
            name: '',
          })
        );
        updatedPlayers = [...updatedPlayers, ...additional];
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
    const activePlayers = session.players.filter((p) => p.name.trim().length > 0);
    const matches = generateAllMatches(activePlayers, session.matchFormat);
    setSession((prev) => ({
      ...prev,
      players: activePlayers,
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

  const addCustomMatch = (teamA: Player[], teamB: Player[]) => {
    const dup = findDuplicateMatch(session.matches, teamA, teamB);
    if (dup) {
      return { success: false, error: `This matchup already exists as Match #${dup.matchNumber}!` };
    }

    setSession((prev) => {
      const nextNum = prev.matches.length > 0 ? Math.max(...prev.matches.map((m) => m.matchNumber)) + 1 : 1;
      const newMatch: MatchItem = {
        id: `match-${Date.now()}`,
        matchNumber: nextNum,
        teamA,
        teamB,
        scoreA: '',
        scoreB: '',
        isCompleted: false,
      };
      return {
        ...prev,
        matches: [...prev.matches, newMatch],
      };
    });

    return { success: true };
  };

  const editCustomMatch = (matchId: string, teamA: Player[], teamB: Player[]) => {
    const dup = findDuplicateMatch(session.matches, teamA, teamB, matchId);
    if (dup) {
      return { success: false, error: `This matchup already exists as Match #${dup.matchNumber}!` };
    }

    setSession((prev) => ({
      ...prev,
      matches: prev.matches.map((m) => {
        if (m.id !== matchId) return m;
        return {
          ...m,
          teamA,
          teamB,
        };
      }),
    }));

    return { success: true };
  };

  const deleteMatch = (matchId: string) => {
    setSession((prev) => {
      const filtered = prev.matches.filter((m) => m.id !== matchId);
      // Re-index match numbers so they are sequential 1, 2, 3...
      const reindexed = filtered.map((m, idx) => ({
        ...m,
        matchNumber: idx + 1,
      }));
      return {
        ...prev,
        matches: reindexed,
      };
    });
  };

  /**
   * Archives the current session into PocketBase, then resets the active session.
   */
  const completeSession = async (): Promise<string | undefined> => {
    const completedSession: SessionConfig = {
      ...session,
      completedAt: new Date().toISOString(),
    };

    let savedId: string | undefined;
    try {
      const record = await createSessionMutation.mutateAsync(completedSession);
      savedId = record.id;
    } catch (e) {
      console.error('Error saving session to PocketBase:', e);
    }

    try {
      localStorage.removeItem(ACTIVE_STORAGE_KEY);
      sessionStorage.removeItem(ACTIVE_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove active session from storage:', e);
    }
    setSession(createDefaultSession());
    return savedId;
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

  const addPlayerWithName = (name: string) => {
    setSession((prev) => {
      if (prev.players.length >= MAX_PLAYERS) return prev;
      return {
        ...prev,
        players: [...prev.players, { id: `p-${Date.now()}`, name }],
      };
    });
  };

  const hasActiveSession = Boolean(
    session.matches.length > 0 || session.players.some((p) => p.name.trim().length > 0)
  );

  return (
    <SessionContext.Provider
      value={{
        session,
        setSessionTitle,
        setMatchFormat,
        setDoublesMode,
        setPlayerCount,
        setRosterPlayers,
        addPlayer,
        removePlayer,
        updatePlayerName,
        startSession,
        updateMatchScore,
        toggleMatchCompleted,
        reorderMatches,
        addCustomMatch,
        editCustomMatch,
        deleteMatch,
        completeSession,
        resetSession,
        addPlayerWithName,
        hasActiveSession,
        isSavingSession: createSessionMutation.isPending,
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
