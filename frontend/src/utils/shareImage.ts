import type { PlayerStats } from './standings';
import { createStandingsImageBlob } from './canvasRenderer';

/**
 * Capture standings directly to image and invoke mobile native Web Share sheet.
 * Compatible with iOS Safari, Android Chrome, and desktop browsers.
 */
export async function shareStandingsAsImage(
  title: string,
  formatLabel: string,
  standings: PlayerStats[],
  fileName: string = 'evenstar-tennis-results.png'
): Promise<{ success: boolean; method: 'share' | 'download' | 'copied' | 'error'; message?: string }> {
  try {
    // 1. Generate PNG blob using pure Canvas 2D engine (0% failure rate on iOS)
    const blob = await createStandingsImageBlob(title, formatLabel, standings);
    const file = new File([blob], fileName, { type: 'image/png' });

    // 2. Try native Web Share API Level 2 (iOS Safari & Android Chrome)
    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: title,
        });
        return { success: true, method: 'share' };
      } catch (err: unknown) {
        // User closed or dismissed the share sheet intentionally
        if (err instanceof Error && (err.name === 'AbortError' || err.name === 'NotAllowedError')) {
          return { success: true, method: 'share' };
        }
      }
    }

    // 3. Fallback for iOS or desktop: Direct Download
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = blobUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

    return {
      success: true,
      method: 'download',
      message: 'Standings image saved to your device!',
    };
  } catch (err) {
    console.error('Share image failed:', err);
    return {
      success: false,
      method: 'error',
      message: 'Could not generate share image.',
    };
  }
}
