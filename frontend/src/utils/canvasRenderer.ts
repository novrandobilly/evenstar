import type { PlayerStats } from './standings';

/**
 * Draw the standings results directly to an HTML5 Canvas in edge-to-edge high-resolution portrait mode.
 * Optimized for mobile screens (e.g. iPhone SE, Instagram Stories, WhatsApp, iMessage) with large, high-contrast readable typography.
 */
export async function createStandingsImageBlob(
  title: string,
  formatLabel: string,
  standings: PlayerStats[]
): Promise<Blob> {
  const width = 1080; // Crisp mobile portrait width
  const pad = 32;

  const headerHeight = 310;
  const podiumHeight = standings.length >= 3 ? 360 : 0;
  const tableHeaderHeight = 76;
  const rowHeight = 104;
  const tableRowsHeight = standings.length * rowHeight;
  const footerHeight = 120;

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

  // 1. Full Canvas Background - Clean edge-to-edge White
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Top accent bar (Emerald green)
  ctx.fillStyle = '#059669';
  ctx.fillRect(0, 0, width, 14);

  let currentY = 72;

  // 2. Format / Category Pill Badge
  const badgeText = `🏆 ${formatLabel.toUpperCase()}`;
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  const badgeMetrics = ctx.measureText(badgeText);
  const badgeW = badgeMetrics.width + 48;
  const badgeH = 54;
  const badgeX = width / 2 - badgeW / 2;

  ctx.fillStyle = '#ecfdf5'; // emerald-50
  roundRect(ctx, badgeX, currentY - 38, badgeW, badgeH, 27);
  ctx.fill();
  ctx.strokeStyle = '#6ee7b7'; // emerald-300
  ctx.lineWidth = 2.5;
  roundRect(ctx, badgeX, currentY - 38, badgeW, badgeH, 27);
  ctx.stroke();

  ctx.fillStyle = '#047857'; // emerald-700
  ctx.fillText(badgeText, width / 2, currentY - 2);

  currentY += 68;

  // 3. Main Session Title (Large and prominent)
  ctx.fillStyle = '#0f172a'; // slate-900
  ctx.font = '900 62px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(truncateText(title || 'Tennis Session Results', 24), width / 2, currentY);

  currentY += 46;

  // 4. Subtitle / Date
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  ctx.fillStyle = '#64748b'; // slate-500
  ctx.font = '700 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Final Standings · ${dateStr}`, width / 2, currentY);

  currentY += 64;

  // 5. Podium Finishers (Top 3 Cards)
  if (standings.length >= 3) {
    const p1 = standings[0];
    const p2 = standings[1];
    const p3 = standings[2];

    const podiumAvailW = width - pad * 2;
    const colGap = 16;
    const colWidth = (podiumAvailW - colGap * 2) / 3;

    const pY = currentY;
    const cardHeight = 280;

    // Helper for drawing each podium pedestal
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
      ctx.lineWidth = isWinner ? 3.5 : 2;
      roundRect(ctx, x, y, w, h, 28);
      ctx.stroke();

      // Medal emoji
      ctx.textAlign = 'center';
      ctx.font = isWinner ? '68px sans-serif' : '56px sans-serif';
      ctx.fillText(medal, x + w / 2, y + (isWinner ? 74 : 64));

      // Player Name (Large & Bold)
      ctx.fillStyle = isWinner ? '#78350f' : '#0f172a';
      ctx.font = `bold ${isWinner ? '34px' : '30px'} -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillText(truncateText(stat.player.name, 13), x + w / 2, y + (isWinner ? 138 : 126));

      // Points Badge
      const ptsY = y + (isWinner ? 198 : 184);
      ctx.fillStyle = isWinner ? '#059669' : '#047857';
      ctx.font = `900 ${isWinner ? '34px' : '30px'} -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillText(`${stat.gamesWon} pts`, x + w / 2, ptsY);

      // Rank Label (2nd, 1st, 3rd)
      ctx.fillStyle = isWinner ? '#b45309' : '#64748b';
      ctx.font = `800 ${isWinner ? '22px' : '20px'} -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillText(isWinner ? '1ST PLACE' : stat.rank === 2 ? '2ND PLACE' : '3RD PLACE', x + w / 2, ptsY + 38);
    };

    // 2nd Place (Left)
    drawPodiumCard(p2, '🥈', pad, pY + 20, colWidth, cardHeight - 20, '#f8fafc', '#cbd5e1', false);

    // 1st Place (Center - Elevated & Highlighted)
    drawPodiumCard(p1, '🥇', pad + colWidth + colGap, pY, colWidth, cardHeight, '#fefce8', '#facc15', true);

    // 3rd Place (Right)
    drawPodiumCard(p3, '🥉', pad + (colWidth + colGap) * 2, pY + 30, colWidth, cardHeight - 30, '#fff7ed', '#fed7aa', false);

    currentY += cardHeight + 48;
  }

  // 6. Complete Standings Table
  const tableX = pad;
  const tableW = width - pad * 2;

  // Table Header Container
  ctx.fillStyle = '#0f172a'; // slate-900 header
  roundRect(ctx, tableX, currentY, tableW, tableHeaderHeight, 20);
  ctx.fill();

  ctx.fillStyle = '#94a3b8'; // slate-400
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  ctx.textAlign = 'center';
  ctx.fillText('RANK', tableX + 54, currentY + 47);

  ctx.textAlign = 'left';
  ctx.fillText('PLAYER', tableX + 130, currentY + 47);

  ctx.textAlign = 'center';
  ctx.fillText('MP', tableX + tableW - 440, currentY + 47);
  ctx.fillText('W-L', tableX + tableW - 305, currentY + 47);
  ctx.fillText('GW-GL', tableX + tableW - 170, currentY + 47);

  ctx.textAlign = 'right';
  ctx.fillText('+/-', tableX + tableW - 40, currentY + 47);

  currentY += tableHeaderHeight + 12;

  // Table Rows
  standings.forEach((stat, idx) => {
    const rowY = currentY + idx * rowHeight;
    const isLeader = stat.rank === 1;

    // Row Background
    if (isLeader) {
      ctx.fillStyle = 'rgba(254, 240, 138, 0.45)'; // soft amber-100
    } else if (idx % 2 === 0) {
      ctx.fillStyle = '#f8fafc'; // slate-50
    } else {
      ctx.fillStyle = '#ffffff';
    }
    roundRect(ctx, tableX, rowY, tableW, rowHeight - 8, 18);
    ctx.fill();

    // Row Border
    ctx.strokeStyle = isLeader ? '#facc15' : '#e2e8f0';
    ctx.lineWidth = isLeader ? 2.5 : 1.5;
    roundRect(ctx, tableX, rowY, tableW, rowHeight - 8, 18);
    ctx.stroke();

    // Rank / Medal
    ctx.textAlign = 'center';
    if (stat.rank === 1) {
      ctx.font = '40px sans-serif';
      ctx.fillText('🥇', tableX + 54, rowY + 58);
    } else if (stat.rank === 2) {
      ctx.font = '40px sans-serif';
      ctx.fillText('🥈', tableX + 54, rowY + 58);
    } else if (stat.rank === 3) {
      ctx.font = '40px sans-serif';
      ctx.fillText('🥉', tableX + 54, rowY + 58);
    } else {
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`${stat.rank}`, tableX + 54, rowY + 58);
    }

    // Player Name (Prominent & Clear)
    ctx.textAlign = 'left';
    ctx.fillStyle = isLeader ? '#78350f' : '#0f172a';
    ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(truncateText(stat.player.name, 18), tableX + 130, rowY + 58);

    // MP (Matches Played)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '700 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${stat.matchesPlayed}`, tableX + tableW - 440, rowY + 58);

    // W-L (Wins-Losses)
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${stat.matchWins}-${stat.matchLosses}`, tableX + tableW - 305, rowY + 58);

    // GW-GL (Games Won - Games Lost)
    ctx.fillStyle = '#475569';
    ctx.font = '700 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${stat.gamesWon}-${stat.gamesLost}`, tableX + tableW - 170, rowY + 58);

    // Differential (+/-)
    ctx.textAlign = 'right';
    const diffStr = stat.diff > 0 ? `+${stat.diff}` : `${stat.diff}`;
    ctx.fillStyle = stat.diff > 0 ? '#059669' : stat.diff < 0 ? '#dc2626' : '#64748b';
    ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(diffStr, tableX + tableW - 40, rowY + 58);
  });

  currentY += standings.length * rowHeight + 36;

  // 7. Footer Brand Watermark
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8'; // slate-400
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🎾 Kickserve · Matchmaker & Leaderboards', width / 2, currentY + 12);

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


