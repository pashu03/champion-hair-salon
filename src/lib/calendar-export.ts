/**
 * Calendar export helpers: Google Calendar direct URL & iCal (.ics) generator
 */

export interface CalendarEventDetails {
  title: string;
  description: string;
  location: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

function parseToUTCString(dateStr: string, timeStr: string): string {
  // Assuming Indian Standard Time (UTC+5:30)
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  const dateObj = new Date(year, month - 1, day, hours, minutes);
  return dateObj.toISOString().replace(/-|:|\.\d+/g, "");
}

/**
 * Creates Google Calendar Add Event URL
 */
export function createGoogleCalendarUrl(event: CalendarEventDetails): string {
  const startIso = parseToUTCString(event.date, event.startTime);
  const endIso = parseToUTCString(event.date, event.endTime);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${startIso}/${endIso}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates an .ics calendar file content as data URL
 */
export function createIcsDataUrl(event: CalendarEventDetails): string {
  const startIso = parseToUTCString(event.date, event.startTime);
  const endIso = parseToUTCString(event.date, event.endTime);
  const nowIso = new Date().toISOString().replace(/-|:|\.\d+/g, "");

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Champion Hair Salon//Appointment Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${nowIso}-${Math.random().toString(36).substring(2, 9)}@championhairsalon.com`,
    `DTSTAMP:${nowIso}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
}
