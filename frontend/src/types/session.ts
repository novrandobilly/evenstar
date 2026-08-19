export interface Player {
  id: string;
  name: string;
}

export type MatchFormat = 'doubles' | 'singles';
export type DoublesGameMode = 'americano';

export interface MatchItem {
  id: string;
  matchNumber: number;
  teamA: Player[];
  teamB: Player[];
  scoreA: string;
  scoreB: string;
  isCompleted: boolean;
}

export interface SessionConfig {
  id: string;
  title: string;
  matchFormat: MatchFormat;
  doublesMode: DoublesGameMode;
  players: Player[];
  matches: MatchItem[];
  createdAt: string;
}

export const MIN_PLAYERS_DOUBLES = 4;
export const MIN_PLAYERS_SINGLES = 2;
export const DEFAULT_PLAYERS_DOUBLES = 8;
export const DEFAULT_PLAYERS_SINGLES = 4;
export const MAX_PLAYERS = 32;
