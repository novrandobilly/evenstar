export function formatDuration(startedAt: number): string {
  if (!Number.isFinite(startedAt) || startedAt <= 0) return "0m";
  const ms = Date.now() - startedAt;
  if (ms < 0) return "0m";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
