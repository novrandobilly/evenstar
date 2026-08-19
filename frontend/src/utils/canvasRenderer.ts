import type { PlayerStats } from './standings';

/**
 * Draw the entire results card directly to an HTML5 Canvas using pure 2D canvas primitives.
 * This is 100% immune to CSS/DOM/Tailwind/CORS/foreignObject bugs and guaranteed to work on iOS Safari!
 */
export async function createStandingsImageBlob(
  title: string,
  formatLabel: string,
  standings: PlayerStats[]
): Promise<Blob> {
  const width = 800; // Crisp social share width
  const rowHeight = 44;
  const headerHeight = 160;
  const podiumHeight = standings.length >= 3 ? 180 : 0;
  const tableHeaderHeight = 40;
  const tableRowsHeight = standings.length * rowHeight;
  const footerHeight = 70;

  const height = headerHeight + podiumHeight + tableHeaderHeight + tableRowsHeight + footerHeight + 40;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Background
  ctx.fillStyle = '#0f172a'; // slate-900 dark theme
  ctx.fillRect(0, 0, width, height);

  // Card Background with rounded corners
  const cardPad = 24;
  ctx.fillStyle = '#1e293b'; // slate-800
  roundRect(ctx, cardPad, cardPad, width - cardPad * 2, height - cardPad * 2, 28);
  ctx.fill();

  let currentY = cardPad + 36;

  // Header Title
  ctx.fillStyle = '#10b981'; // emerald-500
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`🏆 ${formatLabel.toUpperCase()}`, width / 2, currentY);

  currentY += 28;
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(title || 'Tennis Session Results', width / 2, currentY);

  currentY += 35;

  // Podium (Top 3)
  if (standings.length >= 3) {
    const p1 = standings[0];
    const p2 = standings[1];
    const p3 = standings[2];

    const podiumCenterY = currentY + 70;
    const colWidth = (width - cardPad * 4) / 3;

    // 2nd Place (Left)
    ctx.textAlign = 'center';
    ctx.font = '26px sans-serif';
    ctx.fillText('🥈', cardPad * 2 + colWidth * 0.5, podiumCenterY - 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(truncateText(p2.player.name, 16), cardPad * 2 + colWidth * 0.5, podiumCenterY - 4);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px sans-serif';
    ctx.fillText(`${p2.gamesWon} pts`, cardPad * 2 + colWidth * 0.5, podiumCenterY + 16);

    // 1st Place (Center)
    ctx.font = '34px sans-serif';
    ctx.fillText('🥇', width / 2, podiumCenterY - 38);
    ctx.fillStyle = '#fbbf24'; // amber-400
    ctx.font = '900 17px sans-serif';
    ctx.fillText(truncateText(p1.player.name, 16), width / 2, podiumCenterY - 6);
    ctx.fillStyle = '#34d399'; // emerald-400
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(`${p1.gamesWon} pts`, width / 2, podiumCenterY + 16);

    // 3rd Place (Right)
    ctx.fillStyle = '#ffffff';
    ctx.font = '26px sans-serif';
    ctx.fillText('🥉', width - cardPad * 2 - colWidth * 0.5, podiumCenterY - 30);
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(truncateText(p3.player.name, 16), width - cardPad * 2 - colWidth * 0.5, podiumCenterY - 4);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px sans-serif';
    ctx.fillText(`${p3.gamesWon} pts`, width - cardPad * 2 - colWidth * 0.5, podiumCenterY + 16);

    currentY += 130;
  }

  // Table Container
  const tableX = cardPad + 20;
  const tableW = width - (cardPad + 20) * 2;

  // Table Header
  ctx.fillStyle = '#0f172a';
  roundRect(ctx, tableX, currentY, tableW, tableHeaderHeight, 12);
  ctx.fill();

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('#', tableX + 24, currentY + 24);

  ctx.textAlign = 'left';
  ctx.fillText('PLAYER', tableX + 60, currentY + 24);

  ctx.textAlign = 'center';
  ctx.fillText('MP', tableX + tableW - 250, currentY + 24);
  ctx.fillText('W-L', tableX + tableW - 175, currentY + 24);
  ctx.fillText('GW-GL', tableX + tableW - 95, currentY + 24);

  ctx.textAlign = 'right';
  ctx.fillText('+/-', tableX + tableW - 20, currentY + 24);

  currentY += tableHeaderHeight + 6;

  // Table Rows
  standings.forEach((stat, idx) => {
    const rowY = currentY + idx * rowHeight;
    const isLeader = stat.rank === 1;

    // Row background
    ctx.fillStyle = isLeader ? 'rgba(251, 191, 36, 0.08)' : idx % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'transparent';
    roundRect(ctx, tableX, rowY, tableW, rowHeight - 4, 10);
    ctx.fill();

    // Rank / Medal
    ctx.textAlign = 'center';
    if (stat.rank === 1) {
      ctx.font = '16px sans-serif';
      ctx.fillText('🥇', tableX + 24, rowY + 25);
    } else if (stat.rank === 2) {
      ctx.font = '16px sans-serif';
      ctx.fillText('🥈', tableX + 24, rowY + 25);
    } else if (stat.rank === 3) {
      ctx.font = '16px sans-serif';
      ctx.fillText('🥉', tableX + 24, rowY + 25);
    } else {
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`${stat.rank}`, tableX + 24, rowY + 25);
    }

    // Player Name
    ctx.textAlign = 'left';
    ctx.fillStyle = isLeader ? '#fbbf24' : '#f8fafc';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(truncateText(stat.player.name, 22), tableX + 60, rowY + 25);

    // MP
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px sans-serif';
    ctx.fillText(`${stat.matchesPlayed}`, tableX + tableW - 250, rowY + 25);

    // W-L
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`${stat.matchWins}-${stat.matchLosses}`, tableX + tableW - 175, rowY + 25);

    // GW-GL
    ctx.fillText(`${stat.gamesWon}-${stat.gamesLost}`, tableX + tableW - 95, rowY + 25);

    // Differential (+/-)
    ctx.textAlign = 'right';
    const diffStr = stat.diff > 0 ? `+${stat.diff}` : `${stat.diff}`;
    ctx.fillStyle = stat.diff > 0 ? '#34d399' : stat.diff < 0 ? '#f87171' : '#64748b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(diffStr, tableX + tableW - 20, rowY + 25);
  });

  currentY += standings.length * rowHeight + 10;

  // Footer Watermark
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎾 Evenstar Tennis · Matchmaker & Standings', width / 2, currentY + 15);

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
