import type { Player, MatchItem, MatchFormat } from '../types/session';

/**
 * Generate all possible matches for Americano Doubles (everyone plays with everyone against everyone)
 * or Round-Robin Singles.
 */
export function generateAllMatches(
  players: Player[],
  format: MatchFormat
): MatchItem[] {
  const n = players.length;
  const matches: MatchItem[] = [];
  let matchId = 1;

  if (format === 'singles') {
    // Round robin singles: every pair plays once
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        matches.push({
          id: `match-${matchId}`,
          matchNumber: matchId,
          teamA: [players[i]],
          teamB: [players[j]],
          scoreA: '',
          scoreB: '',
          isCompleted: false,
        });
        matchId++;
      }
    }
    return matches;
  }

  // Americano Doubles: generate round-robin combinations where partners & opponents rotate
  // Standard round robin schedule for N players:
  // Using standard polygon/circle algorithm for round robin pairing
  const playerList = [...players];
  const totalRounds = n % 2 === 0 ? n - 1 : n;
  const courtMatchesPerRound = Math.floor(n / 4);

  // Fallback: If 4 players, exactly 3 unique pairings
  if (n === 4) {
    const p = playerList;
    const matchups = [
      { a: [p[0], p[1]], b: [p[2], p[3]] },
      { a: [p[0], p[2]], b: [p[1], p[3]] },
      { a: [p[0], p[3]], b: [p[1], p[2]] },
    ];
    return matchups.map((m, idx) => ({
      id: `match-${idx + 1}`,
      matchNumber: idx + 1,
      teamA: m.a,
      teamB: m.b,
      scoreA: '',
      scoreB: '',
      isCompleted: false,
    }));
  }

  // For general N players, construct balanced rotation across total rounds
  const rotation = [...playerList];
  for (let r = 0; r < totalRounds; r++) {
    for (let c = 0; c < courtMatchesPerRound; c++) {
      const idx1 = c * 4;
      const p1 = rotation[idx1];
      const p2 = rotation[idx1 + 1];
      const p3 = rotation[idx1 + 2];
      const p4 = rotation[idx1 + 3];

      if (p1 && p2 && p3 && p4) {
        matches.push({
          id: `match-${matchId}`,
          matchNumber: matchId,
          teamA: [p1, p2],
          teamB: [p3, p4],
          scoreA: '',
          scoreB: '',
          isCompleted: false,
        });
        matchId++;
      }
    }
    // Rotate players array (keep first fixed, rotate the rest)
    if (rotation.length > 1) {
      const first = rotation[0];
      const rest = rotation.slice(1);
      const last = rest.pop();
      if (last) {
        rotation.splice(0, rotation.length, first, last, ...rest);
      }
    }
  }

  return matches;
}
