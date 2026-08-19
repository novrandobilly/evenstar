import type { Player, MatchItem } from '../types/session';

export interface PlayerStats {
  player: Player;
  matchesPlayed: number;
  matchWins: number;
  matchLosses: number;
  matchDraws: number;
  gamesWon: number;
  gamesLost: number;
  diff: number;
  rank: number;
}

/**
 * Compute real-time standings for all players based on completed matches and scores.
 */
export function calculateStandings(
  players: Player[],
  matches: MatchItem[]
): PlayerStats[] {
  const statsMap: Record<string, Omit<PlayerStats, 'rank'>> = {};

  players.forEach((p) => {
    statsMap[p.id] = {
      player: p,
      matchesPlayed: 0,
      matchWins: 0,
      matchLosses: 0,
      matchDraws: 0,
      gamesWon: 0,
      gamesLost: 0,
      diff: 0,
    };
  });

  matches.forEach((m) => {
    const scoreA = parseInt(m.scoreA, 10);
    const scoreB = parseInt(m.scoreB, 10);

    const hasValidScores = !isNaN(scoreA) && !isNaN(scoreB);
    // If scores are entered or marked completed with valid scores
    if (hasValidScores) {
      // Team A players
      m.teamA.forEach((p) => {
        const stat = statsMap[p.id];
        if (stat) {
          stat.matchesPlayed += 1;
          stat.gamesWon += scoreA;
          stat.gamesLost += scoreB;
          stat.diff += scoreA - scoreB;
          if (scoreA > scoreB) {
            stat.matchWins += 1;
          } else if (scoreA < scoreB) {
            stat.matchLosses += 1;
          } else {
            stat.matchDraws += 1;
          }
        }
      });

      // Team B players
      m.teamB.forEach((p) => {
        const stat = statsMap[p.id];
        if (stat) {
          stat.matchesPlayed += 1;
          stat.gamesWon += scoreB;
          stat.gamesLost += scoreA;
          stat.diff += scoreB - scoreA;
          if (scoreB > scoreA) {
            stat.matchWins += 1;
          } else if (scoreB < scoreA) {
            stat.matchLosses += 1;
          } else {
            stat.matchDraws += 1;
          }
        }
      });
    }
  });

  // Sort standings:
  // 1. Total Game Points Won (Americano standard)
  // 2. Point Differential (gamesWon - gamesLost)
  // 3. Match Wins
  const sorted = Object.values(statsMap).sort((a, b) => {
    if (b.gamesWon !== a.gamesWon) return b.gamesWon - a.gamesWon;
    if (b.diff !== a.diff) return b.diff - a.diff;
    if (b.matchWins !== a.matchWins) return b.matchWins - a.matchWins;
    return a.player.name.localeCompare(b.player.name);
  });

  return sorted.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}
