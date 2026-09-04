import type { PlayerStats } from './standings';

/**
 * Draw the standings results directly to an HTML5 Canvas in edge-to-edge high-resolution portrait mode.
 * Styled with Grand Slam tournament aesthetic & Kickserve Volt neon accents.
 * Optimized for mobile screens (e.g. WhatsApp, iMessage, Instagram Stories) with high-contrast readable typography.
 */
export async function createStandingsImageBlob(
  title: string,
  formatLabel: string,
  standings: PlayerStats[]
): Promise<Blob> {
  const width = 1080; // Crisp mobile portrait width
  const pad = 36;

  const headerHeight = 320;
  const podiumHeight = standings.length >= 3 ? 370 : 0;
  const tableHeaderHeight = 80;
  const rowHeight = 106;
  const tableRowsHeight = standings.length * rowHeight;
  const footerHeight = 130;

  const height =
    headerHeight +
    podiumHeight +
    tableHeaderHeight +
    tableRowsHeight +
    footerHeight +
    40;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // 1. Full Canvas Background - Warm Chalk Tone
  ctx.fillStyle = '#fcfbf7';
  ctx.fillRect(0, 0, width, height);

  // Top accent bars (Deep court green + Electric Volt neon line)
  ctx.fillStyle = '#0a2519';
  ctx.fillRect(0, 0, width, 18);
  ctx.fillStyle = '#b4e100';
  ctx.fillRect(0, 18, width, 6);

  let currentY = 82;

  // 2. Format / Category Pill Badge
  const badgeText = `🏆 ${formatLabel.toUpperCase()}`;
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  const badgeMetrics = ctx.measureText(badgeText);
  const badgeW = badgeMetrics.width + 52;
  const badgeH = 56;
  const badgeX = width / 2 - badgeW / 2;

  ctx.fillStyle = '#e2f4ea';
  roundRect(ctx, badgeX, currentY - 38, badgeW, badgeH, 28);
  ctx.fill();
  ctx.strokeStyle = '#246d4a';
  ctx.lineWidth = 2.5;
  roundRect(ctx, badgeX, currentY - 38, badgeW, badgeH, 28);
  ctx.stroke();

  ctx.fillStyle = '#0f3522';
  ctx.fillText(badgeText, width / 2, currentY - 1);

  currentY += 72;

  // 3. Main Session Title
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 62px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(truncateText(title || 'Tennis Session Results', 24), width / 2, currentY);

  currentY += 48;

  // 4. Subtitle / Date
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  ctx.fillStyle = '#1b5639';
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Official Tournament Standings · ${dateStr}`, width / 2, currentY);

  currentY += 68;

  // 5. Podium Finishers (Top 3 Cards)
  if (standings.length >= 3) {
    const p1 = standings[0];
    const p2 = standings[1];
    const p3 = standings[2];

    const podiumAvailW = width - pad * 2;
    const colGap = 16;
    const colWidth = (podiumAvailW - colGap * 2) / 3;

    const pY = currentY;
    const cardHeight = 290;

    const drawPodiumCard = (
      stat: PlayerStats,
      medal: string,
      x: number,
      y: number,
      w: number,
      h: number,
      bgColor: string,
      borderColor: string,
      isWinner: boolean
    ) => {
      ctx.fillStyle = bgColor;
      roundRect(ctx, x, y, w, h, 28);
      ctx.fill();

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = isWinner ? 4 : 2;
      roundRect(ctx, x, y, w, h, 28);
      ctx.stroke();

      // Medal emoji
      ctx.textAlign = 'center';
      ctx.font = isWinner ? '70px sans-serif' : '58px sans-serif';
      ctx.fillText(medal, x + w / 2, y + (isWinner ? 78 : 66));

      // Player Name
      ctx.fillStyle = isWinner ? '#78350f' : '#0f172a';
      ctx.font = `bold ${isWinner ? '34px' : '30px'} -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillText(truncateText(stat.player.name, 13), x + w / 2, y + (isWinner ? 142 : 130));

      // Points Badge
      const ptsY = y + (isWinner ? 204 : 190);
      ctx.fillStyle = isWinner ? '#13422b' : '#1e293b';
      ctx.font = `900 ${isWinner ? '36px' : '30px'} -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillText(`${stat.gamesWon} pts`, x + w / 2, ptsY);

      // Rank Label
      ctx.fillStyle = isWinner ? '#b45309' : '#64748b';
      ctx.font = `800 ${isWinner ? '22px' : '20px'} -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillText(isWinner ? '1ST PLACE' : stat.rank === 2 ? '2ND PLACE' : '3RD PLACE', x + w / 2, ptsY + 40);
    };

    // 2nd Place (Left)
    drawPodiumCard(p2, '🥈', pad, pY + 20, colWidth, cardHeight - 20, '#f8fafc', '#cbd5e1', false);

    // 1st Place (Center - Elevated & Highlighted)
    drawPodiumCard(p1, '🥇', pad + colWidth + colGap, pY, colWidth, cardHeight, '#fffbeb', '#f59e0b', true);

    // 3rd Place (Right)
    drawPodiumCard(p3, '🥉', pad + (colWidth + colGap) * 2, pY + 30, colWidth, cardHeight - 30, '#fff7ed', '#fdba74', false);

    currentY += cardHeight + 48;
  }

  // 6. Complete Standings Table
  const tableX = pad;
  const tableW = width - pad * 2;

  // Table Header Container
  ctx.fillStyle = '#0a2519'; // Deep court green header
  roundRect(ctx, tableX, currentY, tableW, tableHeaderHeight, 22);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  ctx.textAlign = 'center';
  ctx.fillText('RANK', tableX + 54, currentY + 50);

  ctx.textAlign = 'left';
  ctx.fillText('PLAYER', tableX + 130, currentY + 50);

  ctx.textAlign = 'center';
  ctx.fillText('MP', tableX + tableW - 440, currentY + 50);
  ctx.fillText('W-L', tableX + tableW - 305, currentY + 50);
  ctx.fillText('GW-GL', tableX + tableW - 170, currentY + 50);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#b4e100'; // Volt yellow diff indicator
  ctx.fillText('+/-', tableX + tableW - 40, currentY + 50);

  currentY += tableHeaderHeight + 14;

  // Table Rows
  standings.forEach((stat, idx) => {
    const rowY = currentY + idx * rowHeight;
    const isLeader = stat.rank === 1;

    // Row Background
    if (isLeader) {
      ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
    } else if (idx % 2 === 0) {
      ctx.fillStyle = '#f6f4ed';
    } else {
      ctx.fillStyle = '#ffffff';
    }
    roundRect(ctx, tableX, rowY, tableW, rowHeight - 8, 20);
    ctx.fill();

    // Row Border
    ctx.strokeStyle = isLeader ? '#f59e0b' : '#e5e0d4';
    ctx.lineWidth = isLeader ? 3 : 1.5;
    roundRect(ctx, tableX, rowY, tableW, rowHeight - 8, 20);
    ctx.stroke();

    // Rank / Medal
    ctx.textAlign = 'center';
    if (stat.rank === 1) {
      ctx.font = '40px sans-serif';
      ctx.fillText('🥇', tableX + 54, rowY + 60);
    } else if (stat.rank === 2) {
      ctx.font = '40px sans-serif';
      ctx.fillText('🥈', tableX + 54, rowY + 60);
    } else if (stat.rank === 3) {
      ctx.font = '40px sans-serif';
      ctx.fillText('🥉', tableX + 54, rowY + 60);
    } else {
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`${stat.rank}`, tableX + 54, rowY + 60);
    }

    // Player Name
    ctx.textAlign = 'left';
    ctx.fillStyle = isLeader ? '#78350f' : '#0f172a';
    ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(truncateText(stat.player.name, 18), tableX + 130, rowY + 60);

    // MP (Matches Played)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${stat.matchesPlayed}`, tableX + tableW - 440, rowY + 60);

    // W-L (Wins-Losses)
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${stat.matchWins}-${stat.matchLosses}`, tableX + tableW - 305, rowY + 60);

    // GW-GL (Games Won - Games Lost)
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${stat.gamesWon}-${stat.gamesLost}`, tableX + tableW - 170, rowY + 60);

    // Differential (+/-)
    ctx.textAlign = 'right';
    const diffStr = stat.diff > 0 ? `+${stat.diff}` : `${stat.diff}`;
    ctx.fillStyle = stat.diff > 0 ? '#13422b' : stat.diff < 0 ? '#c24d24' : '#64748b';
    ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(diffStr, tableX + tableW - 40, rowY + 60);
  });

  currentY += standings.length * rowHeight + 36;

  // 7. Footer Brand Watermark
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1b5639';
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🎾 KICKSERVE · TENNIS MATCHMAKER & LEADERBOARDS', width / 2, currentY + 12);

  // Convert Canvas directly to Blob
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas to blob failed'));
      }
    }, 'image/png');
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function truncateText(str: string, maxLen: number) {
  if (!str) return 'Unnamed';
  return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
}
