/**
 * Generates human-friendly sequential appointment identifiers like CH-2026-048291
 */
export function generateAppointmentNumber(): string {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `CH-${currentYear}-${randomSuffix}`;
}
