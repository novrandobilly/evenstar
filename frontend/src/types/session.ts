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

import type { HostUser } from "./auth";

export interface SessionConfig {
  id: string;
  title: string;
  matchFormat: MatchFormat;
  doublesMode: DoublesGameMode;
  players: Player[];
  matches: MatchItem[];
  createdAt: string;
  completedAt?: string;
  sport?: string;
  status?: "in_progress" | "completed";
  hostClubName?: string;
  hostClubLogoUrl?: string;
}

export interface SessionRecord {
  id: string;
  collectionId: string;
  collectionName: "sessions";
  host: string;
  title: string;
  sport?: string;
  match_format: MatchFormat;
  doubles_mode: DoublesGameMode;
  players: Player[];
  matches: MatchItem[];
  status: "in_progress" | "completed";
  completed_at?: string;
  created: string;
  updated: string;
  expand?: {
    host?: HostUser;
  };
}

export const MIN_PLAYERS_DOUBLES = 4;
export const MIN_PLAYERS_SINGLES = 2;
export const DEFAULT_PLAYERS_DOUBLES = 8;
export const DEFAULT_PLAYERS_SINGLES = 4;
export const MAX_PLAYERS = 32;

