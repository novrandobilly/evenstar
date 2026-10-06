import type { Player } from './session';

export interface RosterRecord {
  id: string;
  collectionId: string;
  collectionName: 'rosters';
  host: string;
  name: string;
  players: Player[];
  created: string;
  updated: string;
}

export interface SaveRosterPayload {
  name?: string;
  players: Player[];
}

export const MAX_ROSTER_PLAYERS = 100;

