/**
 * Formats the API/database HH:mm value for customer-facing booking screens.
 * The stored value remains 24-hour time so sorting and availability logic stay stable.
 */
export function formatTime12Hour(time: string): string {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) return time;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return time;

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${match[2]} ${period}`;
}

export function formatTimeRange12Hour(startTime: string, endTime: string): string {
  return `${formatTime12Hour(startTime)} – ${formatTime12Hour(endTime)}`;
}
