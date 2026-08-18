import type { Player, Match, Round, MatchFormat } from '../types/session';

/**
 * Generate a round of matches with fair rotation.
 * Automatically determines the number of active courts from the number of players.
 */
export function generateRound(
  players: Player[],
  matchFormat: MatchFormat,
  roundNumber: number,
  previousRounds: Round[] = []
): Round {
  const playersPerMatch = matchFormat === 'doubles' ? 4 : 2;
  const courtCount = Math.max(1, Math.floor(players.length / playersPerMatch));
  const maxActivePlayers = courtCount * playersPerMatch;

  // Track play count to prioritize rested players
  const playCounts: Record<string, number> = {};
  players.forEach((p) => {
    playCounts[p.id] = 0;
  });

  previousRounds.forEach((r) => {
    r.matches.forEach((m) => {
      [...m.teamA, ...m.teamB].forEach((p) => {
        playCounts[p.id] = (playCounts[p.id] || 0) + 1;
      });
    });
  });

  // Sort players by least played, with slight deterministic rotation
  const sortedPlayers = [...players].sort((a, b) => {
    const diff = (playCounts[a.id] || 0) - (playCounts[b.id] || 0);
    if (diff !== 0) return diff;
    return 0.5 - Math.random();
  });

  const activePlayers = sortedPlayers.slice(0, Math.min(sortedPlayers.length, maxActivePlayers));
  const restingPlayers = sortedPlayers.slice(activePlayers.length);

  const matches: Match[] = [];
  for (let i = 0; i < courtCount; i++) {
    const matchPlayers = activePlayers.slice(i * playersPerMatch, (i + 1) * playersPerMatch);
    if (matchFormat === 'doubles' && matchPlayers.length === 4) {
      matches.push({
        id: `m-${roundNumber}-${i + 1}`,
        courtNumber: i + 1,
        teamA: [matchPlayers[0], matchPlayers[1]],
        teamB: [matchPlayers[2], matchPlayers[3]],
        scoreA: 0,
        scoreB: 0,
        isFinished: false,
      });
    } else if (matchFormat === 'singles' && matchPlayers.length === 2) {
      matches.push({
        id: `m-${roundNumber}-${i + 1}`,
        courtNumber: i + 1,
        teamA: [matchPlayers[0]],
        teamB: [matchPlayers[1]],
        scoreA: 0,
        scoreB: 0,
        isFinished: false,
      });
    }
  }

  return {
    roundNumber,
    matches,
    restingPlayers,
  };
}
