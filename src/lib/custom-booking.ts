export const bookingTimezone = "America/New_York";
export type BookingDay = { date: string; slots: string[] };
export type Availability = { days: BookingDay[]; timezone: string };
export function easternDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: bookingTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
export function dateLabel(day: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: bookingTimezone,
    ...options,
  }).format(new Date(`${day}T12:00:00Z`));
}
export function timeLabel(instant: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: bookingTimezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(instant));
}
export function adjacentMonth(month: string, offset: number) {
  const [year, number] = month.split("-").map(Number);
  return new Date(Date.UTC(year, number - 1 + offset, 1, 12))
    .toISOString()
    .slice(0, 7);
}
export function calendarDays(month: string) {
  const first = new Date(`${month}-01T12:00:00Z`),
    begin = new Date(first);
  begin.setUTCDate(1 - first.getUTCDay());
  const last = new Date(
    Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0, 12),
  );
  const size = Math.ceil((first.getUTCDay() + last.getUTCDate()) / 7) * 7;
  return Array.from({ length: size }, (_, index) => {
    const day = new Date(begin);
    day.setUTCDate(begin.getUTCDate() + index);
    return day.toISOString().slice(0, 10);
  });
}
