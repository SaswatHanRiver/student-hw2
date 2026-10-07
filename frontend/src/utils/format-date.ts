// WM Date format (English): "May 1, 2016" — no leading zero on the day.
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC", // an ISO date has no time, so keep it in UTC to avoid shifting a day
});

// For a moment in time (createdAt / updatedAt), shown in the viewer's own time zone
const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

// "2016-05-01" -> "May 1, 2016"
export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? "-" : DATE_FORMATTER.format(date);
}

// "2016-05-01T09:30:00Z" -> "May 1, 2016 at 3:00 PM" (local time)
export function formatDateTime(isoInstant: string): string {
  const date = new Date(isoInstant);
  return Number.isNaN(date.getTime()) ? "-" : DATE_TIME_FORMATTER.format(date);
}

// Today's date as "YYYY-MM-DD" in the user's own time zone (used for "not in the future")
export function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
