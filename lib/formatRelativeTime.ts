export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / (1000 * 60));

  if (diffMin < 1) return "たった今";
  if (diffMin < 60) return `${diffMin}分前`;

  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}時間前`;

  const diffDay = Math.round(diffHour / 24);
  return `${diffDay}日前`;
}
