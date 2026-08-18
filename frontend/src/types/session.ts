export interface Player {
  id: string;
  name: string;
}

export type MatchFormat = 'doubles' | 'singles';
export type DoublesGameMode = 'americano';

export interface Match {
  id: string;
  courtNumber: number;
  teamA: Player[];
  teamB: Player[];
  scoreA?: number;
  scoreB?: number;
  isFinished?: boolean;
}

export interface Round {
  roundNumber: number;
  matches: Match[];
  restingPlayers: Player[];
}

export interface SessionConfig {
  id: string;
  title: string;
  matchFormat: MatchFormat;
  doublesMode: DoublesGameMode;
  players: Player[];
  currentRoundIndex: number;
  rounds: Round[];
  createdAt: string;
}

export const MIN_PLAYERS_DOUBLES = 4;
export const MIN_PLAYERS_SINGLES = 2;
export const DEFAULT_PLAYERS_DOUBLES = 8;
export const DEFAULT_PLAYERS_SINGLES = 4;
export const MAX_PLAYERS = 32;
