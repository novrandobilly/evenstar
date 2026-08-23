import type { PlayerStats } from './standings';
import { createStandingsImageBlob } from './canvasRenderer';

export interface ShareResult {
  success: boolean;
  method: 'share' | 'clipboard' | 'download' | 'error';
  message?: string;
}

/**
 * Capture standings directly to image and share natively based on device/OS capabilities.
 * - iOS Safari & Android Chrome/Edge: Native OS Share Sheet with PNG image file
 * - macOS Safari & Desktop Chrome/Edge: Native Share Sheet or Image Clipboard Copy
 * - Fallback: Direct PNG image download
 */
export async function shareStandingsAsImage(
  title: string,
  formatLabel: string,
  standings: PlayerStats[],
  fileName?: string
): Promise<ShareResult> {
  try {
    const defaultFileName = `${(title || 'kickserve').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-standings.png`;
    const finalFileName = fileName || defaultFileName;

    // 1. Generate PNG blob using pure HTML5 Canvas 2D engine
    const blob = await createStandingsImageBlob(title, formatLabel, standings);
    const file = new File([blob], finalFileName, { type: 'image/png' });

    // 2. Native Web Share API Level 2 (iOS, Android, macOS Safari/Chrome)
    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.canShare === 'function' &&
      typeof navigator.share === 'function'
    ) {
      try {
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: title || 'Tennis Session Results',
            files: [file],
          });
          return { success: true, method: 'share' };
        }
      } catch (err: unknown) {
        // User closed or dismissed the share sheet intentionally
        if (err instanceof Error && (err.name === 'AbortError' || err.name === 'NotAllowedError')) {
          return { success: true, method: 'share' };
        }
        console.warn('Native share failed, proceeding to clipboard/download fallback:', err);
      }
    }

    // 3. Desktop Clipboard Copy Fallback (copies image directly to clipboard on macOS/Windows/Linux)
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof ClipboardItem !== 'undefined' &&
      window.isSecureContext
    ) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        return {
          success: true,
          method: 'clipboard',
          message: 'Standings image copied to clipboard!',
        };
      } catch (err) {
        console.warn('Clipboard image write failed, falling back to download:', err);
      }
    }

    // 4. Direct File Download Fallback
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = finalFileName;
    link.href = blobUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

    return {
      success: true,
      method: 'download',
      message: 'Standings image downloaded to device!',
    };
  } catch (err) {
    console.error('Share image failed:', err);
    return {
      success: false,
      method: 'error',
      message: 'Could not generate standings image.',
    };
  }
}

