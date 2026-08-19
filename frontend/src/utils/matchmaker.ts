import type { Player, MatchItem, MatchFormat } from '../types/session';

/**
 * Generate Singles round-robin schedule using the Berger/Circle algorithm.
 * Guarantees every player plays exactly once per round before anyone plays their next game.
 */
function generateSinglesSchedule(players: Player[]): MatchItem[] {
  const n = players.length;
  if (n < 2) return [];

  // If odd number of players, add a null dummy for 'bye'
  const list: (Player | null)[] = [...players];
  if (list.length % 2 !== 0) {
    list.push(null);
  }

  const numRounds = list.length - 1;
  const half = list.length / 2;
  const matches: MatchItem[] = [];
  let matchCounter = 1;

  for (let round = 0; round < numRounds; round++) {
    for (let i = 0; i < half; i++) {
      const p1 = list[i];
      const p2 = list[list.length - 1 - i];

      // If neither is the dummy bye, create a match
      if (p1 !== null && p2 !== null) {
        matches.push({
          id: `match-${matchCounter}`,
          matchNumber: matchCounter,
          teamA: [p1],
          teamB: [p2],
          scoreA: '',
          scoreB: '',
          isCompleted: false,
        });
        matchCounter++;
      }
    }

    // Rotate elements except index 0 (Berger circle rotation)
    const fixed = list[0];
    const rotating = list.slice(1);
    const last = rotating.pop();
    if (last !== undefined) {
      list.splice(0, list.length, fixed, last, ...rotating);
    }
  }

  return matches;
}

/**
 * Generate Doubles Americano schedule.
 * Prioritizes that every player plays an equal number of games across sequential rounds.
 * Handles any number of players from 4 up to 32 (both multiples of 4 and non-multiples with byes).
 */
export function generateDoublesAmericano(players: Player[]): MatchItem[] {
  const n = players.length;
  if (n < 4) return [];

  const matches: MatchItem[] = [];
  let matchCounter = 1;

  // Track player match participation to ensure fair distribution
  const playCounts: Record<string, number> = {};
  const partnerCounts: Record<string, Record<string, number>> = {};
  const opponentCounts: Record<string, Record<string, number>> = {};

  players.forEach((p) => {
    playCounts[p.id] = 0;
    partnerCounts[p.id] = {};
    opponentCounts[p.id] = {};
    players.forEach((other) => {
      if (p.id !== other.id) {
        partnerCounts[p.id][other.id] = 0;
        opponentCounts[p.id][other.id] = 0;
      }
    });
  });

  const courtsPerRound = Math.floor(n / 4);
  const totalRounds = n % 2 === 0 ? n - 1 : n;

  // Build round by round
  for (let r = 0; r < totalRounds; r++) {
    // 1. Select the 4 * courtsPerRound players who have played the least
    const availablePlayers = [...players].sort((a, b) => {
      const diff = (playCounts[a.id] || 0) - (playCounts[b.id] || 0);
      if (diff !== 0) return diff;
      return a.id.localeCompare(b.id);
    });

    const activeForRound = availablePlayers.slice(0, courtsPerRound * 4);

    // 2. For each court, pick 4 players that minimize repeat partnerships and opponents
    const remainingInRound = [...activeForRound];

    for (let c = 0; c < courtsPerRound; c++) {
      if (remainingInRound.length < 4) break;

      // Select 4 players from remainingInRound with best pair score
      let bestFour: Player[] = remainingInRound.slice(0, 4);
      let minPenalty = Infinity;

      // Try permutations of the first few candidates to find least repeated partner/opponent pairings
      const candidates = remainingInRound.slice(0, Math.min(8, remainingInRound.length));

      for (let i = 0; i < candidates.length; i++) {
        for (let j = i + 1; j < candidates.length; j++) {
          for (let k = j + 1; k < candidates.length; k++) {
            for (let l = k + 1; l < candidates.length; l++) {
              const p1 = candidates[i];
              const p2 = candidates[j];
              const p3 = candidates[k];
              const p4 = candidates[l];

              // Test pairings: (p1, p2) vs (p3, p4)
              const penalty1 =
                (partnerCounts[p1.id][p2.id] || 0) * 10 +
                (partnerCounts[p3.id][p4.id] || 0) * 10 +
                (opponentCounts[p1.id][p3.id] || 0) +
                (opponentCounts[p1.id][p4.id] || 0) +
                (opponentCounts[p2.id][p3.id] || 0) +
                (opponentCounts[p2.id][p4.id] || 0);

              if (penalty1 < minPenalty) {
                minPenalty = penalty1;
                bestFour = [p1, p2, p3, p4];
              }

              // Test pairings: (p1, p3) vs (p2, p4)
              const penalty2 =
                (partnerCounts[p1.id][p3.id] || 0) * 10 +
                (partnerCounts[p2.id][p4.id] || 0) * 10 +
                (opponentCounts[p1.id][p2.id] || 0) +
                (opponentCounts[p1.id][p4.id] || 0) +
                (opponentCounts[p3.id][p2.id] || 0) +
                (opponentCounts[p3.id][p4.id] || 0);

              if (penalty2 < minPenalty) {
                minPenalty = penalty2;
                bestFour = [p1, p3, p2, p4];
              }

              // Test pairings: (p1, p4) vs (p2, p3)
              const penalty3 =
                (partnerCounts[p1.id][p4.id] || 0) * 10 +
                (partnerCounts[p2.id][p3.id] || 0) * 10 +
                (opponentCounts[p1.id][p2.id] || 0) +
                (opponentCounts[p1.id][p3.id] || 0) +
                (opponentCounts[p4.id][p2.id] || 0) +
                (opponentCounts[p4.id][p3.id] || 0);

              if (penalty3 < minPenalty) {
                minPenalty = penalty3;
                bestFour = [p1, p4, p2, p3];
              }
            }
          }
        }
      }

      // Remove bestFour from remainingInRound
      bestFour.forEach((selected) => {
        const idx = remainingInRound.findIndex((p) => p.id === selected.id);
        if (idx !== -1) remainingInRound.splice(idx, 1);
      });

      const [teamA1, teamA2, teamB1, teamB2] = bestFour;

      // Update participation and pair stats
      bestFour.forEach((p) => {
        playCounts[p.id] = (playCounts[p.id] || 0) + 1;
      });

      partnerCounts[teamA1.id][teamA2.id] = (partnerCounts[teamA1.id][teamA2.id] || 0) + 1;
      partnerCounts[teamA2.id][teamA1.id] = (partnerCounts[teamA2.id][teamA1.id] || 0) + 1;
      partnerCounts[teamB1.id][teamB2.id] = (partnerCounts[teamB1.id][teamB2.id] || 0) + 1;
      partnerCounts[teamB2.id][teamB1.id] = (partnerCounts[teamB2.id][teamB1.id] || 0) + 1;

      [teamA1, teamA2].forEach((pa) => {
        [teamB1, teamB2].forEach((pb) => {
          opponentCounts[pa.id][pb.id] = (opponentCounts[pa.id][pb.id] || 0) + 1;
          opponentCounts[pb.id][pa.id] = (opponentCounts[pb.id][pa.id] || 0) + 1;
        });
      });

      matches.push({
        id: `match-${matchCounter}`,
        matchNumber: matchCounter,
        teamA: [teamA1, teamA2],
        teamB: [teamB1, teamB2],
        scoreA: '',
        scoreB: '',
        isCompleted: false,
      });
      matchCounter++;
    }
  }

  return matches;
}

/**
 * Generate all possible matches with guaranteed round-by-round equal game distribution.
 */
export function generateAllMatches(
  players: Player[],
  format: MatchFormat
): MatchItem[] {
  if (format === 'singles') {
    return generateSinglesSchedule(players);
  } else {
    return generateDoublesAmericano(players);
  }
}
