import type { PlayerStats } from '../../utils/standings';

/**
 * Generate clean markdown/emoji text formatted for sharing to chats or OS share sheet.
 */
export function generateShareText(
  sessionTitle: string,
  formatLabel: string,
  playersCount: number,
  standings: PlayerStats[]
): string {
  const lines = [
    `🎾 *${sessionTitle || 'Tennis Session'}* 🏆`,
    `Match Format: ${formatLabel} · ${playersCount} Players`,
    ``,
    `🏆 *FINAL STANDINGS*`,
  ];

  standings.forEach((s) => {
    const medal = s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : s.rank === 3 ? '🥉' : `${s.rank}.`;
    const diffFormatted = s.diff > 0 ? `+${s.diff}` : `${s.diff}`;
    lines.push(`${medal} ${s.player.name} — ${s.gamesWon} pts (${s.matchWins}-${s.matchLosses}, diff: ${diffFormatted})`);
  });

  lines.push(``);
  lines.push(`Hosted with Kickserve 🎾`);
  return lines.join('\n');
}
